import { expect, type Locator, type Page, test } from '@playwright/test';

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

  // CSS w plikach /_astro/*.css, nie inline: CSP style-src 'self' bez 'unsafe-inline' (#23, #29).
  test('CSS z plików _astro/*.css tego samego źródła, bez <style> inline', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('style')).toHaveCount(0);
    const hrefs = await page
      .locator('link[rel="stylesheet"]')
      .evaluateAll((links: HTMLLinkElement[]) => links.map((link) => link.href));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      const url = new URL(href);
      expect(url.origin).toBe(new URL(page.url()).origin);
      expect(url.pathname).toMatch(/^\/_astro\/[^/]+\.css$/);
    }
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
          const logo = await loadedLogo(page);
          const url = await logo.evaluate((img: HTMLImageElement) => img.currentSrc);
          const m = await measure(logo, url);
          expect(m.bytes, 'rozmiar pobranego kandydata').toBeGreaterThan(0);
          expect(m.waste).toBeLessThan(MAX_WASTE_BYTES);
        });
      }
    });
  }

  // Przypadek kontrolny: największy kandydat WebP (640w) na 375 px przy DPR 1 to nadmiar, który
  // pomiar musi wykryć; inaczej test powyżej niczego nie sprawdza.
  test('kontrola: pomiar wykrywa nadmiar > 10 KiB dla za dużego kandydata', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS[0]);
    await page.goto('/');
    const logo = await loadedLogo(page);
    const url = await page
      .locator('main #top source[type="image/webp"]')
      .evaluate((source: HTMLSourceElement) => {
        const largest = source.srcset
          .split(',')
          .map((candidate) => candidate.trim().split(/\s+/))
          .sort((a, b) => parseInt(b[1]) - parseInt(a[1]))[0];
        return new URL(largest[0], location.href).href;
      });
    const m = await measure(logo, url);
    expect(m.naturalWidth).toBe(640);
    expect(m.waste).toBeGreaterThan(MAX_WASTE_BYTES);
  });
});

async function loadedLogo(page: Page): Promise<Locator> {
  const logo = page.locator('main #top img.hero__logo');
  await expect(logo).toBeVisible();
  await expect.poll(() => logo.evaluate((img: HTMLImageElement) => img.complete)).toBe(true);
  return logo;
}

/**
 * Nadmiar jak w audycie Lighthouse uses-responsive-images dla pliku `url` wyświetlonego w miejscu
 * logo. Wymiary pliku z osobnego `Image` bez srcset: `naturalWidth` obrazu z srcset jest dzielone
 * przez gęstość kandydata (szerokość w / sizes), więc nie opisuje pobranego pliku. Bajty z `fetch`.
 */
async function measure(logo: Locator, url: string) {
  return logo.evaluate(async (img: HTMLImageElement, src: string) => {
    const bytes = (await (await fetch(src)).arrayBuffer()).byteLength;
    const file = new Image();
    file.src = src;
    await file.decode();
    const rect = img.getBoundingClientRect();
    const displayed = rect.width * rect.height * devicePixelRatio ** 2;
    const natural = file.naturalWidth * file.naturalHeight;
    return {
      bytes,
      naturalWidth: file.naturalWidth,
      waste: bytes * Math.max(0, 1 - displayed / natural),
    };
  }, url);
}
