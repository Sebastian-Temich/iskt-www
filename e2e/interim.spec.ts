import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { findSeoEntry } from '../src/content/seo';
import { nav, services } from '../src/content/site';
import { POLICY_PAGE, W01_PAGES } from './cross/pages';

// Strona Interim (W-01, W-03, W-07, W-11) według D/Interim.dc.html; komponenty z
// src/components/service/ i RoleArticle (4 role).
const PATH = '/uslugi/interim/';
const VIEWPORTS = [375, 768, 1440];
const PLACEHOLDERS = /lorem ipsum|TODO|\{\{|placeholder/i;

// Sekcje <main> w kolejności z designu: komponenty usług (data-component) i sekcje strony
// (data-section: role, notka pod tabelą modeli).
const SECTIONS = [
  'service-hero',
  'when-intro',
  'roles',
  'comparison-table',
  'model-note',
  'process-timeline',
  'cta-band',
  'other-services',
];

// Hierarchia nagłówków z designu (h1 w hero, h2 sekcji, h3 w kolumnach, rolach i etapach).
const HEADINGS: [number, string][] = [
  [1, 'Kompetencja na etacie tylko na tyle, ile trwa zmiana'],
  [2, 'Kiedy interim jest lepszy od rekrutacji'],
  [3, 'Typowe sytuacje'],
  [3, 'Kiedy odradzamy'],
  [2, 'Cztery role, które obsadzamy'],
  [3, 'Chief AI & Automation Officer'],
  [3, 'Chief Digital / Data Officer'],
  [3, 'Interim AI Lead / Architekt AI'],
  [3, 'Interim ESG Manager'],
  [2, 'Modele współpracy'],
  [2, 'Przebieg współpracy'],
  [3, 'Rozmowa o zakresie i mandacie'],
  [3, 'Wejście w organizację'],
  [3, 'Prowadzenie obszaru'],
  [3, 'Przekazanie i wyjście'],
  [2, 'Powiedzcie, czego dziś nie ma kto poprowadzić'],
  [2, 'Pozostałe kompetencje'],
];

// Role z D/Interim.dc.html:103-182: numer, skrót, nazwa, podtytuł.
const ROLES: [string, string, string, string][] = [
  ['01', 'CAAO', 'Chief AI & Automation Officer', 'Właściciel agendy AI i automatyzacji'],
  ['02', 'CDO', 'Chief Digital / Data Officer', 'Architektura cyfrowa i porządek w danych'],
  ['03', 'AI Lead', 'Interim AI Lead / Architekt AI', 'Rola techniczna, blisko wdrożenia'],
  ['04', 'ESG', 'Interim ESG Manager', 'Raportowanie i wdrożenie praktyk'],
];

// Karty „Pozostałe kompetencje” w kolejności z D/Interim.dc.html:273-296, URL z W-01.
const OTHER_SERVICES: [string, string][] = [
  ['Dotacje i ulga B+R', '/uslugi/projekty-br/'],
  ['Raportowanie ESG — VSME i CSRD', '/uslugi/esg/'],
  ['Wdrożenia AI i automatyzacja', '/uslugi/ai-transformacja/'],
  ['Wsparcie startupów', '/startupy/'],
  ['Oprogramowanie dedykowane', '/uslugi/oprogramowanie/'],
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

test.describe('strona Interim', () => {
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
    await expect(current).toHaveText('Interim');
    await expect(current).toHaveAttribute('href', PATH);
    await expect(breadcrumb.locator('li').last().locator('[aria-current="page"]')).toHaveCount(1);
  });

  test('sekcje widoczne, w kolejności z designu', async ({ page }) => {
    await page.goto(PATH);
    const order = await page
      .locator('main > [data-component], main > [data-section]')
      .evaluateAll((nodes) =>
        nodes.map((n) => n.getAttribute('data-component') ?? n.getAttribute('data-section')),
      );
    expect(order).toEqual(SECTIONS);
    for (const name of SECTIONS) {
      await expect(
        page.locator(`main > [data-component="${name}"], main > [data-section="${name}"]`),
        name,
      ).toBeVisible();
    }
  });

  test('RoleArticle: 4 role z designu, każda z listą „Co zyskuje organizacja”', async ({
    page,
  }) => {
    await page.goto(PATH);
    const roles = page.locator('[data-section="roles"] [data-component="role-article"]');
    await expect(roles).toHaveCount(4);
    for (const [index, [number, code, title, subtitle]] of ROLES.entries()) {
      const role = roles.nth(index);
      await expect(role).toBeVisible();
      await expect(role.locator('h3')).toHaveText(title);
      await expect(role).toContainText(number);
      await expect(role).toContainText(code);
      await expect(role).toContainText(subtitle);
      await expect(role).toContainText('Co zyskuje organizacja');
      await expect(role.locator('li')).toHaveCount(4);
    }
    expect(await roles.evaluateAll((nodes) => nodes.map((n) => n.tagName))).toEqual(
      Array(4).fill('ARTICLE'),
    );
    await expect(roles.first()).toContainText('rejestr zastosowań wymagany przez AI Act');
    await expect(roles.last().locator('li').last()).toHaveText(
      'Priorytety wybrane tam, gdzie redukcja emisji spotyka się z niższym kosztem energii i odpadów.',
    );
  });

  test('hierarchia nagłówków i treść jak w D/Interim.dc.html, bez placeholderów', async ({
    page,
  }) => {
    await page.goto(PATH);
    expect(await headings(page)).toEqual(HEADINGS);

    const main = page.locator('main');
    await expect(main).toContainText('Bywa, że decyzja jest już podjęta');
    await expect(main).toContainText('start zwykle w 2–3 tygodnie');
    await expect(main.locator('[data-component="when-intro"] strong')).toHaveText(
      'zadanie ma początek i koniec',
    );
    await expect(main).toContainText(
      'Nie doradzamy z boku — pracujemy jak członek Waszego zespołu.',
    );
    await expect(main).toContainText('Rozliczamy się za dostępność w miesiącu, nie za godziny.');
    await expect(page.locator('[data-section="model-note"]')).toHaveText(
      'Umowa jest wypowiadalna z miesięcznym okresem — nie wiążemy Was na rok, jeśli po dwóch miesiącach okaże się, że rola jest niepotrzebna.',
    );
    await expect(main).toContainText(
      'Odpowiemy, czy to zadanie na interim, na projekt, czy na rekrutację.',
    );

    const text = (await main.innerText()) + (await page.title());
    expect(text).not.toMatch(PLACEHOLDERS);
  });

  test('ProcessTimeline: 4 etapy z czasem z designu', async ({ page }) => {
    await page.goto(PATH);
    const steps = page.locator('[data-component="process-timeline"] li');
    await expect(steps).toHaveCount(4);
    await expect(steps.nth(0)).toContainText('ETAP 01 · 2–3 DNI');
    await expect(steps.nth(1)).toContainText('ETAP 02 · 2–3 TYGODNIE');
    await expect(steps.nth(2)).toContainText('ETAP 03 · CYKL MIESIĘCZNY');
    await expect(steps.nth(3)).toContainText('ETAP 04 · 4–8 TYGODNI');
  });

  test('tabela modeli współpracy: 4 kolumny, 4 modele z designu', async ({ page }) => {
    await page.goto(PATH);
    const table = page.locator('[data-component="comparison-table"] table');
    await expect(table.locator('thead th')).toHaveText([
      'Model',
      'Zaangażowanie',
      'Dla kogo',
      'Czas',
    ]);
    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(4);
    await expect(rows.locator('th')).toHaveText([
      'Nadzór doradczy',
      'Interim część etatu',
      'Interim intensywny',
      'Interim z sukcesją',
    ]);
    await expect(rows.first().locator('td').first()).toHaveText('1–2 dni w miesiącu');
    await expect(rows.last().locator('td').last()).toHaveText('6–18 miesięcy');
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
      hero.getByRole('link', { name: /Zobacz też: AI i transformacja/ }),
    ).toHaveAttribute('href', '/uslugi/ai-transformacja/');
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

  // Siatka jak w designie: auto-fit, kolumny min. 360 px (na wąskim ekranie 100%).
  test('role w jednej kolumnie przy 375 px, w kilku przy 1440 px', async ({ page }) => {
    const roles = page.locator('[data-component="role-article"]');
    const lefts = () =>
      roles.evaluateAll((nodes) => nodes.map((n) => n.getBoundingClientRect().left));

    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto(PATH);
    expect(new Set(await lefts()).size).toBe(1);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PATH);
    expect(new Set(await lefts()).size).toBeGreaterThan(1);
  });

  test('meta i JSON-LD z seo.ts', async ({ page }) => {
    const entry = findSeoEntry(PATH);
    if (!entry) throw new Error('brak wpisu Interim w seo.ts');
    await page.goto(PATH);
    await expect(page).toHaveTitle(entry.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      entry.description,
    );
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toMatch(/\/uslugi\/interim\/$/);
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
