import { expect, test } from '@playwright/test';

// QA-M1-1 (#22): wydajność strony głównej na mobile (W-10). Logo w hero jest elementem LCP:
// eager + fetchpriority=high, a kandydat z srcset pasuje do miejsca na ekranie (nadmiar jak w audycie
// Lighthouse uses-responsive-images: bajty × (1 − powierzchnia wyświetlana / naturalna) < 10 KiB).

const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];
const MAX_WASTE_BYTES = 10 * 1024;

test.describe('QA-M1-1: wydajność strony głównej', () => {
  test('logo w hero ładowane jako obraz LCP: eager, fetchpriority=high, sizes', async ({
    page,
  }) => {
    await page.goto('/');
    const logo = page.locator('main #top img.hero__logo');
    await expect(logo).toHaveAttribute('loading', 'eager');
    await expect(logo).toHaveAttribute('fetchpriority', 'high');
    await expect(logo).toHaveAttribute('sizes', /.+/);
    await expect(logo).toHaveAttribute('srcset', /\d+w/);
  });

  test('CSS wbudowany: brak arkuszy _astro/*.css blokujących render', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(0);
    // Style nadal działają: token koloru z global.css jest ustawiony.
    const primary = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim(),
    );
    expect(primary.toUpperCase()).toBe('#1E551D');
  });

  test('polskie litery z podzbioru latin-ext-pl, bez pełnych plików latin-ext', async ({
    page,
  }) => {
    const fonts: string[] = [];
    page.on('request', (request) => {
      if (request.url().endsWith('.woff2')) fonts.push(new URL(request.url()).pathname);
    });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(fonts.some((path) => path.includes('-latin-ext-pl-'))).toBe(true);
    expect(fonts.filter((path) => /-latin-ext-\d/.test(path))).toEqual([]);
  });

  for (const deviceScaleFactor of [1, 2, 3]) {
    test.describe(`DPR ${deviceScaleFactor}`, () => {
      test.use({ deviceScaleFactor });
      for (const viewport of VIEWPORTS) {
        test(`logo bez nadmiaru > 10 KiB przy ${viewport.width} px`, async ({ page }) => {
          await page.setViewportSize(viewport);
          await page.goto('/');
          const logo = page.locator('main #top img.hero__logo');
          await expect(logo).toBeVisible();
          await expect
            .poll(() => logo.evaluate((img: HTMLImageElement) => img.complete))
            .toBe(true);
          const m = await logo.evaluate((img: HTMLImageElement) => {
            const entry = performance
              .getEntriesByType('resource')
              .find((e) => e.name === img.currentSrc) as PerformanceResourceTiming | undefined;
            const rect = img.getBoundingClientRect();
            return {
              bytes: entry?.encodedBodySize ?? 0,
              displayed: rect.width * rect.height * devicePixelRatio ** 2,
              natural: img.naturalWidth * img.naturalHeight,
            };
          });
          expect(m.bytes, 'rozmiar pobranego kandydata').toBeGreaterThan(0);
          const waste = m.bytes * Math.max(0, 1 - m.displayed / m.natural);
          expect(waste).toBeLessThan(MAX_WASTE_BYTES);
        });
      }
    });
  }
});
