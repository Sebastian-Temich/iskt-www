import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// QA M1: scenariusze odbioru O-1, O-6, O-9 (plan) i przepływ layout → strona główna → SEO.

test.describe('QA M1', () => {
  test('O-1: strona główna z layoutem na 375 i 1440 px, kafle w 1 kolumnie na telefonie', async ({
    page,
  }) => {
    for (const width of [1440, 375]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await expect(page.locator('body > header')).toHaveCount(1);
      await expect(page.locator('main#tresc #top')).toBeVisible();
      await expect(page.locator('main#tresc #kompetencje')).toBeVisible();
      await expect(page.locator('main#tresc #kontakt')).toBeVisible();
      await expect(page.locator('body > footer')).toContainText('biuro@iskt.pl');
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(overflow, `poziomy scroll na ${width}px`).toBe(false);
    }
  });

  test('O-6: strona główna ma meta OG z obrazem, robots bez Disallow i noindex na stagingu', async ({
    page,
    request,
  }) => {
    await page.goto('/');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toMatch(/\/og\/iskt-og\.png$/);
    const img = await request.get(new URL(ogImage ?? '').pathname);
    expect(img.status()).toBe(200);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).not.toMatch(/Disallow:\s*\/\s*$/m);
  });

  test('O-9: nieistniejący adres daje 404 w layoucie z linkiem do strony głównej', async ({
    page,
  }) => {
    const res = await page.goto('/nie-ma-takiej-strony/');
    expect(res?.status()).toBe(404);
    await expect(page.locator('body > header')).toHaveCount(1);
    await expect(page.locator('main a[href="/"]').first()).toBeVisible();
  });

  // QA-M1-2: naprawione w #23; zachowanie CSP w przeglądarce sprawdza e2e/csp.spec.ts.
  test('QA-M1-2: vercel.json ustawia Content-Security-Policy z architektury', () => {
    const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
    const keys = config.headers.flatMap((h: { headers: { key: string }[] }) =>
      h.headers.map((x) => x.key.toLowerCase()),
    );
    expect(keys).toContain('content-security-policy');
  });
});
