import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { findSeoEntry, sitemapPaths } from '../src/content/seo';

// SEO techniczne (W-07, W-08). Serwer testów to `astro build` + `astro preview` bez
// PUBLIC_SITE_ENV, czyli staging (bezpieczna wartość domyślna z src/lib/env.ts). Konfigurację
// produkcyjną sprawdza osobny build z PUBLIC_SITE_ENV=production i innym PUBLIC_SITE_URL.

const VERCEL_OUTPUT = '.vercel/output';

async function head(page: Page) {
  const content = (selector: string) => page.locator(selector).getAttribute('content');
  return {
    title: await page.title(),
    description: await content('meta[name="description"]'),
    canonical: await page.locator('link[rel="canonical"]').getAttribute('href'),
    ogUrl: await content('meta[property="og:url"]'),
    ogTitle: await content('meta[property="og:title"]'),
    ogDescription: await content('meta[property="og:description"]'),
    ogImage: await content('meta[property="og:image"]'),
    ogLocale: await content('meta[property="og:locale"]'),
    twitterCard: await content('meta[name="twitter:card"]'),
    robots: await page.locator('meta[name="robots"]').count(),
  };
}

function pngSize(buffer: Buffer) {
  expect(buffer.subarray(1, 4).toString('ascii')).toBe('PNG');
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function sitemapLocs(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1] ?? '');
}

/** Strony z W-01, które są już zbudowane (w M1: tylko `/`). */
async function builtW01Paths(request: APIRequestContext): Promise<string[]> {
  const built: string[] = [];
  for (const path of sitemapPaths) {
    if ((await request.get(path)).status() === 200) built.push(path);
  }
  return built;
}

test('/: title, description, canonical, Open Graph i twitter:card z seo.ts', async ({
  page,
  request,
}) => {
  const entry = findSeoEntry('/');
  if (!entry) throw new Error('brak wpisu / w seo.ts');

  expect((await page.goto('/'))?.status()).toBe(200);
  const meta = await head(page);

  expect(meta.title).toBe(entry.title);
  expect(meta.description).toBe(entry.description);
  expect(meta.ogTitle).toBe(entry.title);
  expect(meta.ogDescription).toBe(entry.description);
  expect(meta.ogLocale).toBe('pl_PL');
  expect(meta.twitterCard).toBe('summary_large_image');

  // canonical i og:url: PUBLIC_SITE_URL + ścieżka, ten sam adres bazowy co w sitemap.xml.
  expect(meta.canonical).toMatch(/^https?:\/\/[^/]+\/$/);
  expect(meta.ogUrl).toBe(meta.canonical);
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemapLocs(sitemap)).toContain(meta.canonical);

  // og:image: absolutny adres pod tym samym adresem bazowym, PNG 1200×630.
  const base = new URL(meta.canonical ?? '').origin;
  expect(meta.ogImage).toBe(`${base}/og/iskt-og.png`);
  const image = await request.get(new URL(meta.ogImage ?? '').pathname);
  expect(image.status()).toBe(200);
  expect(pngSize(await image.body())).toEqual({ width: 1200, height: 630 });

  // JSON-LD z wpisu seo.ts, z adresami z PUBLIC_SITE_URL.
  const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(jsonLd ?? '')).toEqual(entry.jsonLd(base));
});

test('favicony: favicon.ico (16/32), favicon-32, apple-touch-icon 180, icon-512', async ({
  page,
  request,
}) => {
  await page.goto('/');
  const icons = [
    { selector: 'link[rel="icon"][href="/favicon.ico"]', path: '/favicon.ico' },
    { selector: 'link[rel="icon"][href="/favicon-32.png"]', path: '/favicon-32.png', size: 32 },
    {
      selector: 'link[rel="apple-touch-icon"][href="/apple-touch-icon.png"]',
      path: '/apple-touch-icon.png',
      size: 180,
    },
    { selector: 'link[rel="icon"][href="/icon-512.png"]', path: '/icon-512.png', size: 512 },
  ];
  for (const icon of icons) {
    await expect(page.locator(icon.selector), icon.path).toHaveCount(1);
    const response = await request.get(icon.path);
    expect(response.status(), icon.path).toBe(200);
    if (icon.size) {
      expect(pngSize(await response.body())).toEqual({ width: icon.size, height: icon.size });
    }
  }

  // ICO: nagłówek typu 1 i dwa obrazy 16 i 32 px.
  const ico = await (await request.get('/favicon.ico')).body();
  expect(ico.readUInt16LE(2)).toBe(1);
  expect(ico.readUInt16LE(4)).toBe(2);
  expect([ico.readUInt8(6), ico.readUInt8(22)]).toEqual([16, 32]);
});

test('/sitemap.xml: urlset ze zbudowanymi stronami W-01, bez 404, API i polityki', async ({
  request,
}) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const xml = await response.text();
  expect(xml).toContain('<urlset');
  expect(xml).not.toContain('<sitemapindex');

  const locs = sitemapLocs(xml);
  const base = new URL(locs[0] ?? '').origin;
  const expected = (await builtW01Paths(request)).map((path) => `${base}${path}`);
  expect(expected).toContain(`${base}/`);
  expect([...locs].sort()).toEqual([...expected].sort());
  for (const loc of locs) expect(loc).not.toMatch(/404|\/api\/|polityka-prywatnosci/);
});

test('staging: robots.txt bez Disallow: /, noindex w meta i X-Robots-Tag w konfiguracji Vercel', async ({
  page,
  request,
}) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  const text = await robots.text();
  expect(text).toMatch(/^User-agent: \*$/m);
  expect(text).not.toMatch(/^Disallow:\s*\/\s*$/m);
  expect(text).not.toMatch(/^Sitemap:/m);

  await page.goto('/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');

  const config = JSON.parse(readFileSync(join(VERCEL_OUTPUT, 'config.json'), 'utf-8'));
  expect(config.routes[0]).toEqual({
    src: '^/.*$',
    headers: { 'X-Robots-Tag': 'noindex' },
    continue: true,
  });
});

test.describe('produkcja (osobny build z PUBLIC_SITE_ENV=production)', () => {
  test.setTimeout(180_000);

  const SITE_URL = 'https://iskt.pl';

  test('robots.txt z Sitemap, bez noindex; PUBLIC_SITE_URL zmienia canonical, og:url i sitemap', async ({
    browserName,
  }, testInfo) => {
    // Build nie zależy od przeglądarki: sprawdzany raz, w projekcie chromium.
    test.skip(browserName !== 'chromium', 'build sprawdzany raz');
    const outDir = testInfo.outputPath('dist-production');
    const backup = testInfo.outputPath('vercel-output-backup');
    // Build nadpisuje .vercel/output; kopia przywraca wynik buildu serwera testów.
    if (existsSync(VERCEL_OUTPUT)) cpSync(VERCEL_OUTPUT, backup, { recursive: true });
    let config: { routes: { headers?: Record<string, string> }[] };
    try {
      execFileSync('pnpm', ['exec', 'astro', 'build', '--outDir', outDir], {
        env: { ...process.env, PUBLIC_SITE_ENV: 'production', PUBLIC_SITE_URL: SITE_URL },
        stdio: 'pipe',
      });
      config = JSON.parse(readFileSync(join(VERCEL_OUTPUT, 'config.json'), 'utf-8'));
    } finally {
      if (existsSync(backup)) {
        rmSync(VERCEL_OUTPUT, { recursive: true, force: true });
        cpSync(backup, VERCEL_OUTPUT, { recursive: true });
      }
    }

    const robots = readFileSync(join(outDir, 'robots.txt'), 'utf-8');
    expect(robots).toMatch(/^User-agent: \*$/m);
    expect(robots).toMatch(/^Allow: \/$/m);
    expect(robots).toMatch(/^Sitemap: https:\/\/iskt\.pl\/sitemap\.xml$/m);
    expect(robots).not.toMatch(/^Disallow:/m);

    const html = readFileSync(join(outDir, 'index.html'), 'utf-8');
    expect(html).toContain('<link rel="canonical" href="https://iskt.pl/">');
    expect(html).toContain('<meta property="og:url" content="https://iskt.pl/">');
    expect(html).toContain('<meta property="og:image" content="https://iskt.pl/og/iskt-og.png">');
    expect(html).not.toContain('name="robots"');

    const sitemap = readFileSync(join(outDir, 'sitemap.xml'), 'utf-8');
    expect(sitemap).toContain('<urlset');
    expect(sitemapLocs(sitemap)).toContain('https://iskt.pl/');
    for (const loc of sitemapLocs(sitemap)) expect(loc.startsWith(`${SITE_URL}/`)).toBe(true);

    const robotsHeaders = config.routes.filter((route) => route.headers?.['X-Robots-Tag']);
    expect(robotsHeaders).toEqual([]);
  });
});
