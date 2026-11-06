import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { findSeoEntry } from '../src/content/seo';
import { nav, services } from '../src/content/site';
import { POLICY_PAGE, W01_PAGES } from './cross/pages';

// Strona Wsparcie startupów (W-01, W-03, W-07, W-11) według D/Startupy.dc.html; komponenty z
// src/components/service/.
const PATH = '/startupy/';
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
  [1, 'Od pomysłu do pierwszych klientów i pierwszej rundy'],
  [2, 'Na czym skupiamy się najpierw'],
  [3, 'Dobry moment na rozmowę'],
  [3, 'Sygnały ostrzegawcze'],
  [2, 'Sześć obszarów naszej pracy'],
  [3, 'Walidacja pomysłu i rynku'],
  [3, 'Model biznesowy i wycena'],
  [3, 'MVP i mapa produktu'],
  [3, 'Finansowanie: dotacje i inwestorzy'],
  [3, 'Pitch deck i data room'],
  [3, 'Fundamenty spółki i IP'],
  [2, 'Wsparcie dopasowane do etapu'],
  [2, 'Przebieg współpracy'],
  [3, 'Sesja startowa'],
  [3, 'Walidacja i model'],
  [3, 'Budowa MVP'],
  [3, 'Pozyskanie finansowania'],
  [3, 'Wzrost'],
  [2, 'Opowiedz, na jakim etapie jesteś'],
  [2, 'Pozostałe kompetencje'],
];

// Karty „Pozostałe kompetencje” w kolejności z D/Startupy.dc.html:217-240, URL z W-01.
const OTHER_SERVICES: [string, string][] = [
  ['Dotacje i ulga B+R', '/uslugi/projekty-br/'],
  ['Raportowanie ESG — VSME i CSRD', '/uslugi/esg/'],
  ['Wdrożenia AI i automatyzacja', '/uslugi/ai-transformacja/'],
  ['Oprogramowanie dedykowane', '/uslugi/oprogramowanie/'],
  ['Interim: CAAO, CDO, AI, ESG', '/uslugi/interim/'],
  ['Szkolenia z AI i ESG', 'https://szkolenia.iskt.pl'],
];

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

test.describe('strona Startupy', () => {
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
    await expect(breadcrumb.getByRole('link', { name: 'Start', exact: true })).toHaveAttribute(
      'href',
      '/',
    );
    await expect(breadcrumb.getByRole('link', { name: 'Kompetencje' })).toHaveAttribute(
      'href',
      '/#kompetencje',
    );
    const current = page.locator('[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveText('Wsparcie startupów');
    await expect(current).toHaveAttribute('href', PATH);
    await expect(breadcrumb.locator('li').last().locator('[aria-current="page"]')).toHaveCount(1);
  });

  test('każdy komponent usług jest widoczny, w kolejności z designu', async ({ page }) => {
    await page.goto(PATH);
    for (const name of COMPONENTS) {
      await expect(page.locator(`main [data-component="${name}"]`), name).toBeVisible();
    }
    const order = await page
      .locator('main [data-component]')
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('data-component')));
    expect(order).toEqual(COMPONENTS);
  });

  test('hierarchia nagłówków i treść jak w D/Startupy.dc.html, bez placeholderów', async ({
    page,
  }) => {
    await page.goto(PATH);
    expect(await headings(page)).toEqual(HEADINGS);

    const main = page.locator('main');
    await expect(main).toContainText('Startupy technologiczne rzadko przegrywają na technologii.');
    await expect(main).toContainText('odpowiedź w 1 dzień roboczy');
    await expect(main.locator('[data-component="when-intro"] strong')).toHaveText(
      'zrozumiany problem klienta, najprostsza wersja rozwiązania i sposób finansowania kolejnych miesięcy',
    );
    await expect(main).toContainText(
      'sposób finansowania kolejnych miesięcy. Reszta jest konsekwencją.',
    );
    await expect(main).toContainText('model przychodowy „ustalimy później”');
    await expect(main).toContainText('Ćwiczymy prezentację przed spotkaniami.');
    await expect(main).toContainText('Powiemy, co zrobić w najbliższych trzech miesiącach');

    const scope = page.locator('[data-component="scope-list"] li');
    await expect(scope).toHaveCount(6);
    await expect(scope.first()).toContainText('01');

    const text = (await main.innerText()) + (await page.title());
    expect(text).not.toMatch(PLACEHOLDERS);
  });

  test('ProcessTimeline: 5 etapów z czasem z designu', async ({ page }) => {
    await page.goto(PATH);
    const steps = page.locator('[data-component="process-timeline"] li');
    await expect(steps).toHaveCount(5);
    await expect(steps.nth(0)).toContainText('ETAP 01 · 1 TYDZIEŃ');
    await expect(steps.nth(1)).toContainText('ETAP 02 · 2–4 TYGODNIE');
    await expect(steps.nth(2)).toContainText('ETAP 03 · 8–16 TYGODNI');
    await expect(steps.nth(3)).toContainText('ETAP 04 · 4–10 TYGODNI');
    await expect(steps.nth(4)).toContainText('ETAP 05 · WSPÓŁPRACA CIĄGŁA');
  });

  test('tabela etapów: 4 kolumny, 4 etapy z designu', async ({ page }) => {
    await page.goto(PATH);
    const table = page.locator('[data-component="comparison-table"] table');
    await expect(table.locator('thead th')).toHaveText(['Etap', 'Co robimy', 'Efekt', 'Czas']);
    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(4);
    await expect(rows.locator('th')).toHaveText([
      'Pomysł',
      'Prototyp / MVP',
      'Pierwsze finansowanie',
      'Skalowanie',
    ]);
    await expect(rows.first().locator('td').last()).toHaveText('3–6 tygodni');
    await expect(rows.last().locator('td').last()).toHaveText('współpraca ciągła');
    await expect(page.locator('[data-component="comparison-table"] [data-scroll]')).toHaveAttribute(
      'tabindex',
      '0',
    );
  });

  test('CTA i „Zobacz też” prowadzą do URL z W-01', async ({ page }) => {
    await page.goto(PATH);
    const hero = page.locator('[data-component="service-hero"]');
    await expect(hero.getByRole('link', { name: 'Umów konsultację' })).toHaveAttribute(
      'href',
      nav.contact,
    );
    await expect(
      hero.getByRole('link', { name: /Zobacz też: Rozwój oprogramowania/ }),
    ).toHaveAttribute('href', '/uslugi/oprogramowanie/');
    const band = page.locator('[data-component="cta-band"]');
    await expect(band.getByRole('link', { name: 'Umów konsultację' })).toHaveAttribute(
      'href',
      '/#kontakt',
    );
  });

  test('„Pozostałe kompetencje”: 5 usług i Szkolenia z site.ts, bez bieżącej strony', async ({
    page,
  }) => {
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

  test('linki wewnętrzne bez 404', async ({ page, request }) => {
    await page.goto(PATH);
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('href') ?? ''));
    // Wszystkie strony W-01 i polityka prywatności (e2e/cross/pages.ts).
    const built: string[] = [...W01_PAGES, POLICY_PAGE];
    for (const href of new Set(hrefs.map((h) => h.split('#')[0] || '/'))) {
      if (!built.includes(href)) continue;
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
    if (!entry) throw new Error('brak wpisu Startupy w seo.ts');
    await page.goto(PATH);
    await expect(page).toHaveTitle(entry.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      entry.description,
    );
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toMatch(/\/startupy\/$/);
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
