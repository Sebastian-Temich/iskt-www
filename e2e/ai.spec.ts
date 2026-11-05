import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { findSeoEntry } from '../src/content/seo';
import { nav, services } from '../src/content/site';

// Strona AI i transformacja (W-01, W-03, W-07, W-11) według D/AI-Transformacja.dc.html; komponenty
// z src/components/service/.
const PATH = '/uslugi/ai-transformacja/';
const VIEWPORTS = [375, 768, 1440];
const PLACEHOLDERS = /lorem ipsum|TODO|\{\{|placeholder/i;

const COMPONENTS = [
  'service-hero',
  'when-intro',
  'scope-list',
  'comparison-table',
  'process-timeline',
  'cta-band',
  'other-services',
];

// Hierarchia nagłówków z designu (h1 w hero, h2 sekcji, h3 w kolumnach, obszarach i etapach).
const HEADINGS: [number, string][] = [
  [1, 'AI, która wychodzi z pilotażu i zostaje w procesie'],
  [2, 'Kiedy AI naprawdę się opłaca'],
  [3, 'Dobre przypadki użycia'],
  [3, 'Sygnały ostrzegawcze'],
  [2, 'Sześć obszarów naszej pracy'],
  [3, 'Audyt procesów i danych'],
  [3, 'Wybór i wycena przypadków użycia'],
  [3, 'Dane i integracje'],
  [3, 'Pilotaż i wdrożenie produkcyjne'],
  [3, 'Zgodność, bezpieczeństwo i AI Act'],
  [3, 'Adopcja i kompetencje zespołu'],
  [2, 'Cztery typowe punkty startu'],
  [2, 'Przebieg współpracy'],
  [3, 'Audyt i warsztat'],
  [3, 'Wybór przypadku i kryteria sukcesu'],
  [3, 'Pilotaż na realnych danych'],
  [3, 'Wdrożenie produkcyjne'],
  [3, 'Utrzymanie i rozwój'],
  [2, 'Opisz proces, który zabiera Wam najwięcej czasu'],
  [2, 'Pozostałe kompetencje'],
];

// Karty „Pozostałe kompetencje” w kolejności z D/AI-Transformacja.dc.html:217-240, URL z W-01.
const OTHER_SERVICES: [string, string][] = [
  ['Dotacje i ulga B+R', '/uslugi/projekty-br/'],
  ['Raportowanie ESG — VSME i CSRD', '/uslugi/esg/'],
  ['Wsparcie startupów', '/startupy/'],
  ['Oprogramowanie dedykowane', '/uslugi/oprogramowanie/'],
  ['Interim: CAAO, CDO, AI, ESG', '/uslugi/interim/'],
  ['Szkolenia z AI i ESG', 'https://szkolenia.iskt.pl'],
];

// Strony zbudowane do tej pory; pozostałe adresy W-01 powstają w kolejnych zadaniach.
const BUILT = ['/', '/uslugi/esg/', PATH, '/uslugi/oprogramowanie/', '/polityka-prywatnosci/'];

async function headings(page: Page) {
  return page
    .locator('main')
    .locator('h1, h2, h3, h4, h5, h6')
    .evaluateAll((nodes) =>
      nodes.map((n) => [
        Number(n.tagName.slice(1)),
        (n.textContent ?? '').replace(/\s+/g, ' ').trim(),
      ]),
    );
}

test.describe('strona AI i transformacja', () => {
  test('BaseLayout, nagłówek page z aktywnym „Kompetencje” i okruszki', async ({ page }) => {
    expect((await page.goto(PATH))?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('data-layout', 'base');
    const header = page.locator('body > header');
    await expect(header).toHaveClass(/site-header--page/);
    await expect(header.getByRole('link', { name: 'Kompetencje' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    await expect(page.locator('body > footer')).toHaveCount(1);

    const breadcrumb = page.locator('main').getByRole('navigation', { name: 'Ścieżka' });
    await expect(breadcrumb.locator('li')).toHaveCount(3);
    await expect(breadcrumb.getByRole('link', { name: 'Start' })).toHaveAttribute('href', '/');
    await expect(breadcrumb.getByRole('link', { name: 'Kompetencje' })).toHaveAttribute(
      'href',
      nav.competences,
    );
    const current = page.locator('[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveText('AI i transformacja cyfrowa');
    await expect(current).toHaveAttribute('href', PATH);
    await expect(breadcrumb.locator('li').last().locator('[aria-current="page"]')).toHaveCount(1);
  });

  test('komponenty usług są widoczne, w kolejności z designu', async ({ page }) => {
    await page.goto(PATH);
    for (const name of COMPONENTS) {
      await expect(page.locator(`main [data-component="${name}"]`), name).toBeVisible();
    }
    const order = await page
      .locator('main [data-component]')
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('data-component')));
    expect(order).toEqual(COMPONENTS);
  });

  test('hierarchia nagłówków i treść jak w designie, bez placeholderów', async ({ page }) => {
    await page.goto(PATH);
    expect(await headings(page)).toEqual(HEADINGS);

    const main = page.locator('main');
    await expect(main).toContainText(
      'Najdroższe wdrożenia AI to te, które kończą się demonstracją',
    );
    await expect(main).toContainText('odpowiedź w 1 dzień roboczy');
    await expect(main).toContainText('powtarzalny proces, mierzalny koszt i dostępne dane');
    await expect(main).toContainText('Klasyfikacja ryzyka systemów, polityka korzystania');
    await expect(main).toContainText('Część prac o charakterze badawczym można sfinansować');
    await expect(main).toContainText('ETAP 01 · 1–2 TYGODNIE');
    await expect(main).toContainText('ETAP 05 · CYKL CIĄGŁY');
    await expect(main).toContainText('od czego zacząć');

    await expect(page.locator('[data-component="scope-list"] li')).toHaveCount(6);
    await expect(page.locator('[data-component="process-timeline"] li')).toHaveCount(5);

    const text = (await main.innerText()) + (await page.title());
    expect(text).not.toMatch(PLACEHOLDERS);
  });

  test('tabela: 4 kolumny, 4 punkty startu z designu', async ({ page }) => {
    await page.goto(PATH);
    const table = page.locator('[data-component="comparison-table"] table');
    await expect(table.locator('thead th')).toHaveText([
      'Punkt startu',
      'Co robimy',
      'Efekt',
      'Czas',
    ]);
    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(4);
    await expect(rows.locator('th')).toHaveText([
      '„Chcemy zacząć z AI, nie wiemy gdzie”',
      'Konkretny proces do odciążenia',
      'Pilotaż, który utknął',
      'Zespół używa AI bez zasad',
    ]);
    await expect(rows.first().locator('td').last()).toHaveText('3–4 tygodnie');
    await expect(rows.last().locator('td').last()).toHaveText('3–5 tygodni');
  });

  test('CTA prowadzą do /#kontakt, „Zobacz też” do Startupów', async ({ page }) => {
    await page.goto(PATH);
    const hero = page.locator('[data-component="service-hero"]');
    await expect(hero.getByRole('link', { name: 'Umów konsultację' })).toHaveAttribute(
      'href',
      nav.contact,
    );
    await expect(hero.getByRole('link', { name: /Zobacz też: Startupy/ })).toHaveAttribute(
      'href',
      '/startupy/',
    );
    const band = page.locator('[data-component="cta-band"]');
    await expect(band.getByRole('link', { name: 'Umów konsultację' })).toHaveAttribute(
      'href',
      nav.contact,
    );
  });

  test('„Pozostałe kompetencje”: karty z URL z W-01, bez bieżącej strony', async ({ page }) => {
    await page.goto(PATH);
    const cards = page.locator('[data-component="other-services"] a');
    await expect(cards).toHaveCount(OTHER_SERVICES.length);
    for (const [index, [title, href]] of OTHER_SERVICES.entries()) {
      const card = cards.nth(index);
      await expect(card).toContainText(title);
      await expect(card).toHaveAttribute('href', href);
      expect(
        services.map((s) => s.href),
        title,
      ).toContain(href);
    }
    await expect(cards.last()).toHaveAttribute('target', '_blank');
    await expect(cards.last()).toHaveAttribute('rel', /noopener/);
    await expect(page.locator(`[data-component="other-services"] a[href="${PATH}"]`)).toHaveCount(
      0,
    );
  });

  test('linki wewnętrzne do zbudowanych stron bez 404', async ({ page, request }) => {
    await page.goto(PATH);
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('href') ?? ''));
    for (const href of new Set(hrefs.map((h) => h.split('#')[0] || '/'))) {
      if (!BUILT.includes(href)) continue;
      expect((await request.get(href)).status(), href).toBe(200);
    }
  });

  for (const width of VIEWPORTS) {
    test(`brak poziomego przewijania strony przy ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(PATH);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('meta i JSON-LD z seo.ts', async ({ page }) => {
    const entry = findSeoEntry(PATH);
    if (!entry) throw new Error('brak wpisu AI w seo.ts');
    await page.goto(PATH);
    await expect(page).toHaveTitle(entry.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      entry.description,
    );
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toMatch(/\/uslugi\/ai-transformacja\/$/);
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    const parsed: unknown = JSON.parse(jsonLd ?? '');
    expect(Array.isArray(parsed) ? parsed : [parsed]).toEqual(
      entry.jsonLd(new URL(canonical ?? '').origin),
    );
  });

  test('axe bez naruszeń serious i critical', async ({ page }) => {
    await page.goto(PATH);
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
    expect(blocking).toEqual([]);
  });
});
