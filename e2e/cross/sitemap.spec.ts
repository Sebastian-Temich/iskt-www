import { expect, test } from '@playwright/test';
import { robotsTxt } from '../../src/content/seo';
import { parsePublicEnv } from '../../src/lib/env';
import { W01_PAGES } from './pages';

// W-08 (#15): sitemap zbudowanej aplikacji i robots.txt w konfiguracji produkcyjnej.

test('sitemap.xml zawiera dokładnie 7 stron z W-01 i żadnych innych', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const xml = await response.text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1] ?? '').pathname);
  expect(paths).toHaveLength(W01_PAGES.length);
  expect([...paths].sort()).toEqual([...W01_PAGES].sort());
});

test('robots.txt w konfiguracji production wskazuje /sitemap.xml', () => {
  const env = parsePublicEnv({ PUBLIC_SITE_ENV: 'production', PUBLIC_SITE_URL: 'https://iskt.pl' });
  const robots = robotsTxt(env);
  expect(robots).toMatch(/^Sitemap: https:\/\/iskt\.pl\/sitemap\.xml$/m);
  expect(robots).toMatch(/^Allow: \/$/m);
  expect(robots).not.toMatch(/^Disallow:/m);
});

test('robots.txt serwera testów (staging) nie blokuje crawlowania', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).not.toMatch(/^Disallow: \/\s*$/m);
});
