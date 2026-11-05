import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { findSeoEntry } from '../src/content/seo';
import { nav, services } from '../src/content/site';

// Strona Oprogramowanie (W-01, W-03, W-07, W-11) według D/Oprogramowanie.dc.html, w tym
// „Nasze autorskie aplikacje” z kartami ProductCard (Clara, Petra).
const PATH = '/uslugi/oprogramowanie/';
const VIEWPORTS = [375, 768, 1440];
const PLACEHOLDERS = /lorem ipsum|TODO|\{\{|placeholder/i;

// Kolejność sekcji z designu; „Nasze aplikacje” to dwie karty product-card między zakresem a tabelą.
const COMPONENTS = [
  'service-hero',
  'when-intro',
  'scope-list',
  'product-card',
  'product-card',
  'comparison-table',
  'process-timeline',
  'cta-band',
  'other-services',
];

const HEADINGS: [number, string][] = [
  [1, 'Oprogramowanie, które zostaje Twoją własnością'],
  [2, 'Kiedy warto budować, a kiedy kupić'],
  [3, 'Budujemy'],
  [3, 'Odradzamy'],
  [2, 'Sześć obszarów naszej pracy'],
  [3, 'Analiza i specyfikacja'],
  [3, 'Projekt interfejsu'],
  [3, 'Budowa aplikacji'],
  [3, 'Integracje i dane'],
  [3, 'Wdrożenie i utrzymanie'],
  [3, 'Audyt i przejęcie kodu'],
  [2, 'Nasze autorskie aplikacje'],
  [3, 'Clara'],
  [3, 'Petra'],
  [2, 'Cztery formy współpracy'],
  [2, 'Przebieg współpracy'],
  [3, 'Warsztat i analiza'],
  [3, 'Prototyp i wycena'],
  [3, 'Budowa'],
  [3, 'Wdrożenie'],
  [3, 'Utrzymanie i rozwój'],
  [2, 'Opisz, co dziś robicie ręcznie'],
  [2, 'Pozostałe kompetencje'],
];

// Karty „Pozostałe kompetencje” w kolejności z D/Oprogramowanie.dc.html:253-276, URL z W-01.
const OTHER_SERVICES: [string, string][] = [
  ['Dotacje i ulga B+R', '/uslugi/projekty-br/'],
  ['Raportowanie ESG — VSME i CSRD', '/uslugi/esg/'],
  ['Wdrożenia AI i automatyzacja', '/uslugi/ai-transformacja/'],
  ['Wsparcie startupów', '/startupy/'],
  ['Interim: CAAO, CDO, AI, ESG', '/uslugi/interim/'],
  ['Szkolenia z AI i ESG', 'https://szkolenia.iskt.pl'],
];

const PRODUCTS = [
  {
    name: 'Clara',
    badge: 'faktury za media',
    text: 'Porównuje każdą fakturę z warunkami umowy',
    features: [
      'Rejestr umów, punktów poboru i faktur w jednym miejscu',
      'Automatyczna kontrola zgodności faktury z umową',
      'Dane o zużyciu gotowe do raportowania śladu węglowego',
    ],
    cta: 'Poznaj Clarę',
  },
  {
    name: 'Petra',
    badge: 'opłata środowiskowa',
    text: 'Prowadzi rozliczenie opłaty środowiskowej',
    features: [
      'Ewidencja źródeł emisji i danych za okres rozliczeniowy',
      'Wyliczenie opłaty i komplet dokumentów sprawozdawczych',
      'Historia rozliczeń dostępna przy kontroli i audycie',
    ],
    cta: 'Poznaj Petrę',
  },
];

const BUILT = ['/', '/uslugi/esg/', '/uslugi/ai-transformacja/', PATH, '/polityka-prywatnosci/'];

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

test.describe('strona Oprogramowanie', () => {
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
    await expect(current).toHaveText('Rozwój oprogramowania');
    await expect(current).toHaveAttribute('href', PATH);
    await expect(breadcrumb.locator('li').last().locator('[aria-current="page"]')).toHaveCount(1);
  });

  test('komponenty usług i ProductCard są widoczne, w kolejności z designu', async ({ page }) => {
    await page.goto(PATH);
    for (const name of new Set(COMPONENTS)) {
      await expect(page.locator(`main [data-component="${name}"]`).first(), name).toBeVisible();
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
    await expect(main).toContainText('Budujemy systemy dedykowane tam, gdzie gotowe narzędzia');
    await expect(main).toContainText('Standardowe aplikacje realizujemy w ok. 2 tygodnie.');
    await expect(main).toContainText(
      'żadne gotowe narzędzie nie łączy tego, co musi zostać połączone',
    );
    await expect(main).toContainText('Budujemy nie tylko na zlecenie.');
    await expect(main).toContainText('często kwalifikują się do ulgi B+R lub dotacji');
    await expect(main).toContainText('ETAP 01 · 2–3 DNI');
    await expect(main).toContainText('ETAP 05 · CYKL MIESIĘCZNY');
    await expect(main).toContainText('kupić gotowe — i ile to zajmie');

    await expect(page.locator('[data-component="scope-list"] li')).toHaveCount(6);
    await expect(page.locator('[data-component="process-timeline"] li')).toHaveCount(5);

    const text = (await main.innerText()) + (await page.title());
    expect(text).not.toMatch(PLACEHOLDERS);
  });

  test('„Nasze autorskie aplikacje”: karty Clara i Petra z cechami i linkiem do kontaktu', async ({
    page,
  }) => {
    await page.goto(PATH);
    const cards = page.locator('[data-component="product-card"]');
    await expect(cards).toHaveCount(PRODUCTS.length);
    for (const [index, product] of PRODUCTS.entries()) {
      const card = cards.nth(index);
      await expect(card).toBeVisible();
      await expect(card.getByRole('heading', { level: 3 })).toHaveText(product.name);
      await expect(card).toContainText(product.badge);
      await expect(card).toContainText(product.text);
      await expect(card.locator('li')).toHaveText(product.features);
      await expect(card.locator('li svg[aria-hidden="true"]')).toHaveCount(product.features.length);
      const cta = card.getByRole('link', { name: product.cta });
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute('href', nav.contact);
    }
  });

  test('tabela: 4 kolumny, 4 formy współpracy z designu', async ({ page }) => {
    await page.goto(PATH);
    const table = page.locator('[data-component="comparison-table"] table');
    await expect(table.locator('thead th')).toHaveText(['Forma', 'Kiedy pasuje', 'Efekt', 'Czas']);
    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(4);
    await expect(rows.locator('th')).toHaveText([
      'Warsztat i wycena',
      'Projekt na zakres',
      'Zespół w abonamencie',
      'Audyt lub ratunek',
    ]);
    await expect(rows.nth(1).locator('td').last()).toHaveText('ok. 2 tygodnie (standard)');
  });

  test('CTA prowadzą do /#kontakt, „Zobacz też” do AI i transformacji', async ({ page }) => {
    await page.goto(PATH);
    const hero = page.locator('[data-component="service-hero"]');
    await expect(hero.getByRole('link', { name: 'Umów konsultację' })).toHaveAttribute(
      'href',
      nav.contact,
    );
    await expect(
      hero.getByRole('link', { name: /Zobacz też: AI i transformacja/ }),
    ).toHaveAttribute('href', '/uslugi/ai-transformacja/');
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
    if (!entry) throw new Error('brak wpisu Oprogramowanie w seo.ts');
    await page.goto(PATH);
    await expect(page).toHaveTitle(entry.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      entry.description,
    );
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toMatch(/\/uslugi\/oprogramowanie\/$/);
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
