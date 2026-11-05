import { expect, test } from '@playwright/test';

const FORBIDDEN_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'unpkg.com'];

test('strona główna: 200, lang="pl", BaseLayout, tokeny i lokalne czcionki', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));

  const response = await page.goto('/');
  expect(response?.status()).toBe(200);

  await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
  // Znacznik ustawiany wyłącznie przez src/layouts/BaseLayout.astro.
  await expect(page.locator('html')).toHaveAttribute('data-layout', 'base');

  const primary = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim(),
  );
  expect(primary.toUpperCase()).toBe('#1E551D');

  // Czcionki są ładowane z /fonts/ tej samej domeny i faktycznie użyte.
  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() =>
    [...document.fonts]
      .filter((font) => font.status === 'loaded')
      .map((font) => `${font.family.replace(/["']/g, '')} ${font.weight}`),
  );
  expect(fonts).toContain('Inter 400');
  await page.waitForLoadState('networkidle');

  const external = requests.filter((url) =>
    FORBIDDEN_HOSTS.some((host) => new URL(url).hostname === host),
  );
  expect(external).toEqual([]);
  const fontRequests = requests.filter((url) => url.endsWith('.woff2'));
  expect(fontRequests.length).toBeGreaterThan(0);
  for (const url of fontRequests) {
    expect(new URL(url).pathname).toMatch(/^\/fonts\//);
  }
});

test('wszystkie wagi czcionek mają @font-face z font-display: swap', async ({ page }) => {
  await page.goto('/');
  const faces = await page.evaluate(() =>
    [...document.fonts].map((font) => ({
      family: font.family.replace(/["']/g, ''),
      weight: font.weight,
      display: font.display,
    })),
  );
  const expected = [
    ...['400', '500', '600', '700', '800'].map((weight) => ({ family: 'Inter', weight })),
    ...['400', '500', '600'].map((weight) => ({ family: 'JetBrains Mono', weight })),
  ];
  for (const { family, weight } of expected) {
    const matching = faces.filter((face) => face.family === family && face.weight === weight);
    // latin + latin-ext
    expect(matching, `${family} ${weight}`).toHaveLength(2);
    for (const face of matching) expect(face.display).toBe('swap');
  }
});
