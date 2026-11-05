// @ts-check
import { existsSync, readFileSync } from 'node:fs';
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { parseEnv } from 'node:util';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';
import { isSitemapPage } from './src/content/seo.ts';
import { parsePublicEnv } from './src/lib/env.ts';

/**
 * Zmienne jak w Vite: `.env`, `.env.local`, `.env.[tryb]`, `.env.[tryb].local`, a nad nimi zmienne
 * procesu (Vercel). Vite nie jest bezpośrednią zależnością, więc bez jego `loadEnv`.
 * @returns {Record<string, string | undefined>}
 */
function loadEnvFiles() {
  const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
  const files = ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`];
  /** @type {Record<string, string | undefined>} */
  const values = {};
  for (const file of files) {
    if (existsSync(file)) Object.assign(values, parseEnv(readFileSync(file, 'utf-8')));
  }
  return { ...values, ...process.env };
}

// Adres bazowy i środowisko z PUBLIC_SITE_URL / PUBLIC_SITE_ENV, z tymi samymi wartościami
// domyślnymi co strony (src/lib/env.ts).
const publicEnv = parsePublicEnv(loadEnvFiles());

/**
 * SEO w wyniku buildu (W-08), po @astrojs/sitemap i przed kopiowaniem do .vercel/output/static:
 * - `sitemap.xml`: kopia urlsetu `sitemap-0.xml` pod adresem z W-08, statyczna (działa w preview);
 * - poza produkcją nagłówek `X-Robots-Tag: noindex` na wszystkich odpowiedziach, dopisany do
 *   konfiguracji Build Output API (vercel.json nie pozwala uzależnić nagłówka od zmiennej).
 * @returns {import('astro').AstroIntegration}
 */
function seoOutput() {
  /** @type {URL} */
  let root;
  return {
    name: 'iskt:seo-output',
    hooks: {
      'astro:config:done': ({ config }) => {
        root = config.root;
      },
      'astro:build:done': async ({ dir, logger }) => {
        await copyFile(new URL('sitemap-0.xml', dir), new URL('sitemap.xml', dir));
        logger.info('sitemap.xml ← sitemap-0.xml');

        if (publicEnv.indexable) return;
        const configUrl = new URL('.vercel/output/config.json', root);
        const config = JSON.parse(await readFile(configUrl, 'utf-8'));
        config.routes = [
          { src: '^/.*$', headers: { 'X-Robots-Tag': 'noindex' }, continue: true },
          ...(config.routes ?? []),
        ];
        await writeFile(configUrl, `${JSON.stringify(config, null, 2)}\n`);
        logger.info(`X-Robots-Tag: noindex (PUBLIC_SITE_ENV=${publicEnv.siteEnv})`);
      },
    },
  };
}

// Strony statyczne (SSG); jedyny kod serwerowy to endpoint z `prerender = false` (ADR-002).
// Region funkcji (fra1) i nagłówki są w vercel.json.
export default defineConfig({
  site: publicEnv.siteUrl,
  output: 'static',
  trailingSlash: 'always',
  adapter: vercel(),
  integrations: [sitemap({ filter: isSitemapPage }), seoOutput()],
  server: { port: 55326 },
});
