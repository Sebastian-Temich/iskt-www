import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { findSeoEntry } from '../src/content/seo';
import { nav, services } from '../src/content/site';

// Strona Projekty B+R (W-01, W-03, W-07, W-11) według D/Projekty-BR.dc.html (wersja podstawowa);
// komponenty z src/components/br/.
const PATH = '/uslugi/projekty-br/';
const VIEWPORTS = [375, 768, 1440];
const PLACEHOLDERS = /lorem ipsum|TODO|\{\{|placeholder/i;

// Kolejność sekcji z designu: hero, zakres, proces, programy, dla kogo, FAQ, CTA, chipy.
const COMPONENTS = [
  'br-hero',
  'icon-card-grid',
  'process-cards',
  'program-card',
  'audience-dark',
  'faq-accordion',
  'cta-band-brand',
  'service-chips',
];

const FAQ = [
  'Czy mój pomysł to na pewno projekt B+R?',
  'Ile trwa przygotowanie wniosku o dotację?',
  'Jak wygląda rozliczenie i kto pisze wnioski o płatność?',
  'Czy można łączyć dotację z ulgą B+R?',
  'Współpracujecie z jednostkami naukowymi?',
];

// Hierarchia nagłówków z designu; pytania FAQ w h3 wg wzorca akordeonu APG (decyzja w T-14).
const HEADINGS: [number, string][] = [
  [1, 'Projekty badawczo‑rozwojowe z finansowaniem'],
  [2, 'Co robimy w projektach B+R'],
  [3, 'Audyt potencjału B+R'],
  [3, 'Agenda badawcza'],
  [3, 'Dobór finansowania'],
  [3, 'Wniosek i budżet'],
  [3, 'Prowadzenie i rozliczenie'],
  [3, 'Ulga B+R, IP Box i ochrona wyników'],
  [2, 'Pięć kroków od pomysłu do rozliczonej dotacji'],
  [3, 'Rozmowa i kwalifikacja'],
  [3, 'Koncepcja i agenda'],
  [3, 'Wniosek i złożenie'],
  [3, 'Realizacja'],
  [3, 'Wdrożenie wyników'],
  [2, 'Programy, w których aplikujemy'],
  [3, 'FENG — Ścieżka SMART'],
  [3, 'Programy regionalne (FE)'],
  [3, 'Horyzont Europa i Eurostars'],
  [3, 'Ulga B+R i IP Box'],
  [2, 'Kiedy warto się do nas zgłosić'],
  [3, 'Technologie środowiskowe'],
  [3, 'Przemysł i produkcja'],
  [3, 'Oprogramowanie i AI'],
  [2, 'Najczęstsze pytania o projekty B+R'],
  ...FAQ.map((q): [number, string] => [3, q]),
  [2, 'Sprawdźmy, czy Twój projekt kwalifikuje się do dotacji'],
  [2, 'Pozostałe kompetencje'],
];

// Chipy „Pozostałe kompetencje” w kolejności z D/Projekty-BR.dc.html:246-250, URL z W-01.
const CHIPS: [string, string][] = [
  ['ESG i zrównoważony rozwój', '/uslugi/esg/'],
  ['AI i transformacja cyfrowa', '/uslugi/ai-transformacja/'],
  ['Wsparcie startupów', '/startupy/'],
  ['Rozwój oprogramowania', '/uslugi/oprogramowanie/'],
  ['Szkolenia', 'https://szkolenia.iskt.pl'],
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

function faqButtons(page: Page) {
  return page.locator('[data-component="faq-accordion"] button');
}

async function expandedStates(page: Page) {
  return faqButtons(page).evaluateAll((nodes) => nodes.map((n) => n.getAttribute('aria-expanded')));
}

test.describe('strona Projekty B+R', () => {
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
    await expect(current).toHaveText('Projekty B+R');
    await expect(breadcrumb.locator('li').last().locator('[aria-current="page"]')).toHaveCount(1);
  });

  test('hero z Badge „Kompetencja · B+R” i przyciskami z designu', async ({ page }) => {
    await page.goto(PATH);
    const hero = page.locator('[data-component="br-hero"]');
    await expect(hero.locator('.badge')).toHaveText('Kompetencja · B+R');
    await expect(hero.getByRole('link', { name: 'Bezpłatna konsultacja' })).toHaveAttribute(
      'href',
      nav.contact,
    );
    await expect(hero.getByRole('link', { name: 'Jak pracujemy' })).toHaveAttribute(
      'href',
      '#proces',
    );
    await expect(page.locator('main #proces')).toHaveAttribute('data-component', 'process-cards');
  });

  test('każdy komponent B+R jest widoczny, w kolejności z designu', async ({ page }) => {
    await page.goto(PATH);
    for (const name of COMPONENTS) {
      await expect(page.locator(`main [data-component="${name}"]`).first(), name).toBeVisible();
    }
    const order = await page
      .locator('main [data-component]')
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('data-component')));
    expect(order.filter((name, i) => name !== order[i - 1])).toEqual(COMPONENTS);
    await expect(page.locator('[data-component="program-card"]')).toHaveCount(4);
  });

  test('hierarchia nagłówków i treść jak w D/Projekty-BR.dc.html, bez placeholderów', async ({
    page,
  }) => {
    await page.goto(PATH);
    expect(await headings(page)).toEqual(HEADINGS);

    const main = page.locator('main');
    await expect(main).toContainText('Prowadzimy Twój projekt B+R od pierwszej rozmowy');
    await expect(main).toContainText('01 · 1 tydzień');
    await expect(main).toContainText('05 · po zakończeniu');
    await expect(main).toContainText('Masz przyznaną dotację i brakuje Ci zespołu');
    await expect(main).toContainText('Odpowiadamy w ciągu jednego dnia roboczego.');
    await expect(page.locator('[data-component="icon-card-grid"] li svg')).toHaveCount(6);
    await expect(page.locator('[data-component="process-cards"] li')).toHaveCount(5);
    await expect(page.locator('[data-component="program-card"] .badge')).toHaveText([
      'krajowy',
      'regionalny',
      'europejski',
      'podatkowe',
    ]);
    await expect(
      page.locator('[data-component="audience-dark"] ul').first().locator('li'),
    ).toHaveCount(4);

    const text = (await main.innerText()) + (await page.title());
    expect(text).not.toMatch(PLACEHOLDERS);
  });

  test('bez noindex/nofollow z designu: robots jak na stronie głównej, wpis w seo.ts', async ({
    page,
  }) => {
    // Design ma `noindex, nofollow`; strona dostaje tylko noindex środowiska (staging, W-08), tak jak
    // strona główna, a na produkcji żadnego — bo ma wpis w seo.ts (Seo.astro).
    expect(findSeoEntry(PATH)).toBeTruthy();
    const robots = () =>
      page
        .locator('meta[name="robots"]')
        .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('content')));
    await page.goto('/');
    const homeRobots = await robots();
    await page.goto(PATH);
    expect(await robots()).toEqual(homeRobots);
    expect((await robots()).join(' ')).not.toMatch(/nofollow/);
  });

  test('FAQ: 5 pytań, aria-controls, pierwszy otwarty, jeden otwarty naraz', async ({ page }) => {
    await page.goto(PATH);
    const buttons = faqButtons(page);
    await expect(buttons).toHaveText(FAQ);
    for (const [index] of FAQ.entries()) {
      const button = buttons.nth(index);
      const panelId = await button.getAttribute('aria-controls');
      expect(panelId).toBeTruthy();
      const panel = page.locator(`#${panelId}`);
      await expect(panel).toHaveCount(1);
      await expect(panel).toHaveAttribute(
        'aria-labelledby',
        (await button.getAttribute('id')) ?? '',
      );
    }
    expect(await expandedStates(page)).toEqual(['true', 'false', 'false', 'false', 'false']);
    const firstPanel = page.locator(`#${await buttons.first().getAttribute('aria-controls')}`);
    await expect(firstPanel).toBeVisible();
    await expect(firstPanel).toContainText('niepewności technologicznej');

    await buttons.nth(2).click();
    expect(await expandedStates(page)).toEqual(['false', 'false', 'true', 'false', 'false']);
    await expect(firstPanel).toBeHidden();
    await expect(
      page.locator(`#${await buttons.nth(2).getAttribute('aria-controls')}`),
    ).toBeVisible();

    // Kliknięcie otwartego pytania je zamyka (D/Projekty-BR.dc.html:316).
    await buttons.nth(2).click();
    expect(await expandedStates(page)).toEqual(['false', 'false', 'false', 'false', 'false']);
  });

  test('FAQ: obsługa klawiaturą (Enter i Spacja)', async ({ page }) => {
    await page.goto(PATH);
    const buttons = faqButtons(page);
    await buttons.nth(1).focus();
    await expect(buttons.nth(1)).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(buttons.nth(1)).toHaveAttribute('aria-expanded', 'true');
    expect(await expandedStates(page)).toEqual(['false', 'true', 'false', 'false', 'false']);

    // Tab w WebKit na macOS domyślnie pomija przyciski (ustawienie systemu), więc fokus ustawiamy
    // wprost; sprawdzamy obsługę klawiszy, nie kolejność Tab.
    await buttons.nth(2).focus();
    await expect(buttons.nth(2)).toBeFocused();
    await page.keyboard.press('Space');
    await expect(buttons.nth(2)).toHaveAttribute('aria-expanded', 'true');
    expect(await expandedStates(page)).toEqual(['false', 'false', 'true', 'false', 'false']);
    await expect(
      page.locator(`#${await buttons.nth(2).getAttribute('aria-controls')}`),
    ).toBeVisible();

    await page.keyboard.press('Space');
    await expect(buttons.nth(2)).toHaveAttribute('aria-expanded', 'false');
  });

  test('CTA prowadzi do /#kontakt', async ({ page }) => {
    await page.goto(PATH);
    const band = page.locator('[data-component="cta-band-brand"]');
    await expect(band.getByRole('link', { name: 'Umów konsultację' })).toHaveAttribute(
      'href',
      nav.contact,
    );
    expect(nav.contact).toBe('/#kontakt');
  });

  test('chipy kompetencji linkują do URL z W-01, nie do /#kompetencje', async ({ page }) => {
    await page.goto(PATH);
    const chips = page.locator('[data-component="service-chips"] a');
    await expect(chips).toHaveCount(CHIPS.length);
    for (const [index, [label, href]] of CHIPS.entries()) {
      const chip = chips.nth(index);
      await expect(chip).toContainText(label);
      await expect(chip).toHaveAttribute('href', href);
      expect(
        services.map((s) => s.href),
        label,
      ).toContain(href);
    }
    await expect(chips.last()).toHaveAttribute('target', '_blank');
    await expect(chips.last()).toHaveAttribute('rel', /noopener/);
    await expect(
      page.locator('[data-component="service-chips"] a[href*="#kompetencje"]'),
    ).toHaveCount(0);
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
    if (!entry) throw new Error('brak wpisu Projekty B+R w seo.ts');
    await page.goto(PATH);
    await expect(page).toHaveTitle(entry.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      entry.description,
    );
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toMatch(/\/uslugi\/projekty-br\/$/);
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    const parsed: unknown = JSON.parse(jsonLd ?? '');
    expect(Array.isArray(parsed) ? parsed : [parsed]).toEqual(
      entry.jsonLd(new URL(canonical ?? '').origin),
    );
  });

  for (const width of VIEWPORTS) {
    test(`axe bez naruszeń serious i critical przy ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(PATH);
      const results = await new AxeBuilder({ page }).analyze();
      const blocking = results.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
      expect(blocking).toEqual([]);
    });
  }
});
