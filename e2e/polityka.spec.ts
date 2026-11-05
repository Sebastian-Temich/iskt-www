import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { findSeoEntry } from '../src/content/seo';
import { company } from '../src/content/site';

// Polityka prywatności (W-06, ADR-001): treść robocza do akceptacji właściciela przy odbiorze (P2).
const PATH = '/polityka-prywatnosci/';
const VIEWPORTS = [375, 768, 1440];

test.describe('polityka prywatności', () => {
  test('BaseLayout z nagłówkiem page i okruszkami Start / Polityka prywatności', async ({
    page,
  }) => {
    expect((await page.goto(PATH))?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('data-layout', 'base');
    await expect(page.locator('body > header')).toHaveClass(/site-header--page/);
    await expect(page.locator('body > footer')).toHaveCount(1);

    const breadcrumb = page.locator('main').getByRole('navigation', { name: 'Ścieżka' });
    await expect(breadcrumb.locator('li')).toHaveCount(2);
    await expect(breadcrumb.getByRole('link', { name: 'Start' })).toHaveAttribute('href', '/');
    const current = page.locator('[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveText('Polityka prywatności');
    await expect(breadcrumb.locator('li').last().locator('[aria-current="page"]')).toHaveCount(1);

    await expect(
      page.getByRole('heading', { level: 1, name: 'Polityka prywatności' }),
    ).toBeVisible();
  });

  test('treść: administrator, cel, podstawa, odbiorcy, przechowywanie, prawa, kontakt', async ({
    page,
  }) => {
    await page.goto(PATH);
    const main = page.locator('main');

    for (const heading of [
      'Administrator danych',
      'Cel przetwarzania',
      'Podstawa prawna',
      'Odbiorcy danych',
      'Okres przechowywania',
      'Twoje prawa',
      'Kontakt',
    ]) {
      await expect(main.getByRole('heading', { level: 2, name: heading })).toBeVisible();
    }

    const admin = main.locator('section', {
      has: page.getByRole('heading', { name: 'Administrator danych' }),
    });
    const { street, postalCode, city } = company.address;
    await expect(admin).toContainText(company.name);
    await expect(admin).toContainText(`${street}, ${postalCode} ${city}`);
    await expect(admin).toContainText(`NIP ${company.nip}`);
    await expect(admin).toContainText(`REGON ${company.regon}`);

    await expect(main).toContainText('odpowiedź na zapytanie');
    await expect(main).toContainText('art. 6 ust. 1 lit. b RODO');
    await expect(main).toContainText('Vercel');
    await expect(main).toContainText('Resend');
    await expect(main).toContainText('nie zapisuje');
    await expect(main).toContainText('Prezesa Urzędu Ochrony Danych Osobowych');

    const contact = main.locator('section', {
      has: page.getByRole('heading', { name: 'Kontakt' }),
    });
    await expect(contact.getByRole('link', { name: company.email })).toHaveAttribute(
      'href',
      `mailto:${company.email}`,
    );
    await expect(contact.getByRole('link', { name: company.phone })).toHaveAttribute(
      'href',
      company.phoneHref,
    );
  });

  test('meta z seo.ts, bez strony w sitemapie', async ({ page, request }) => {
    const entry = findSeoEntry(PATH);
    if (!entry) throw new Error('brak wpisu polityki w seo.ts');
    expect(entry.inSitemap).toBe(false);

    await page.goto(PATH);
    await expect(page).toHaveTitle(entry.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      entry.description,
    );
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toMatch(/\/polityka-prywatnosci\/$/);
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    // JsonLd renderuje pojedynczy węzeł bez tablicy.
    const parsed: unknown = JSON.parse(jsonLd ?? '');
    expect(Array.isArray(parsed) ? parsed : [parsed]).toEqual(
      entry.jsonLd(new URL(canonical ?? '').origin),
    );

    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).not.toContain('polityka-prywatnosci');
  });

  for (const path of ['/', PATH]) {
    test(`stopka ${path}: link „Polityka prywatności” → ${PATH}`, async ({ page }) => {
      await page.goto(path);
      const link = page.locator('body > footer').getByRole('link', {
        name: 'Polityka prywatności',
      });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', PATH);
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${PATH}$`));
    });
  }

  for (const width of VIEWPORTS) {
    test(`brak poziomego przewijania przy ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(PATH);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('axe bez naruszeń serious i critical', async ({ page }) => {
    await page.goto(PATH);
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
    expect(blocking).toEqual([]);
  });
});
