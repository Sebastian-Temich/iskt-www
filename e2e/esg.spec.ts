import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { findSeoEntry } from '../src/content/seo';
import { nav, services } from '../src/content/site';

// Strona ESG (W-01, W-02, W-03, W-07, W-11) według D/ESG.dc.html; komponenty z src/components/service/.
const PATH = '/uslugi/esg/';
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
  [1, 'ESG, które przechodzi audyt i pomaga sprzedawać'],
  [2, 'Kiedy ESG przestaje być deklaracją'],
  [3, 'Działa'],
  [3, 'Nie działa'],
  [2, 'Sześć obszarów naszej pracy'],
  [3, 'Diagnoza ESG i analiza istotności'],
  [3, 'Ślad węglowy (zakres 1, 2, 3)'],
  [3, 'Strategia i cele redukcji'],
  [3, 'Raportowanie i sprawozdawczość'],
  [3, 'ESG w łańcuchu dostaw'],
  [3, 'Wdrożenie i szkolenia zespołu'],
  [2, 'Co Cię dotyczy — cztery typowe sytuacje'],
  [2, 'Przebieg współpracy'],
  [3, 'Ustalenie wymagań'],
  [3, 'Dane i obliczenia'],
  [3, 'Strategia i cele'],
  [3, 'Raport i komunikacja'],
  [3, 'Utrzymanie i aktualizacja'],
  [2, 'Nie wiesz, czy ESG już Cię dotyczy?'],
  [2, 'Pozostałe kompetencje'],
];

// Karty „Pozostałe kompetencje” w kolejności z D/ESG.dc.html:217-240, URL z W-01.
const OTHER_SERVICES: [string, string][] = [
  ['Dotacje i ulga B+R', '/uslugi/projekty-br/'],
  ['Wdrożenia AI i automatyzacja', '/uslugi/ai-transformacja/'],
  ['Wsparcie startupów', '/startupy/'],
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

test.describe('strona ESG', () => {
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
      '/#kompetencje',
    );
    const current = page.locator('[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveText('ESG i zrównoważony rozwój');
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

  test('hierarchia nagłówków i treść jak w D/ESG.dc.html, bez placeholderów', async ({ page }) => {
    await page.goto(PATH);
    expect(await headings(page)).toEqual(HEADINGS);

    const main = page.locator('main');
    await expect(main).toContainText('Większość firm zaczyna ESG od raportu');
    await expect(main).toContainText('odpowiedź w 1 dzień roboczy');
    await expect(main).toContainText(
      'ankieta od dużego klienta, warunek w przetargu albo pytanie banku o ryzyka klimatyczne',
    );
    await expect(main).toContainText('Inwentaryzacja emisji zgodna z GHG Protocol');
    await expect(main).toContainText('ETAP 01 · 1 TYDZIEŃ');
    await expect(main).toContainText('ETAP 05 · CYKL ROCZNY');
    await expect(main).toContainText('Napisz, kto o dane pyta');

    const scope = page.locator('[data-component="scope-list"] li');
    await expect(scope).toHaveCount(6);
    await expect(scope.first()).toContainText('01');
    await expect(page.locator('[data-component="process-timeline"] li')).toHaveCount(5);

    const text = (await main.innerText()) + (await page.title());
    expect(text).not.toMatch(PLACEHOLDERS);
  });

  test('tabela: 4 kolumny, 4 sytuacje z designu', async ({ page }) => {
    await page.goto(PATH);
    const table = page.locator('[data-component="comparison-table"] table');
    await expect(table.locator('thead th')).toHaveText([
      'Sytuacja',
      'Co jest potrzebne',
      'Efekt',
      'Czas',
    ]);
    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(4);
    await expect(rows.locator('th')).toHaveText([
      'Duży klient przysłał ankietę ESG',
      'Obowiązek sprawozdawczy',
      'Finansowanie lub przetarg',
      'Redukcja kosztów i emisji',
    ]);
    await expect(rows.first().locator('td').last()).toHaveText('3–5 tygodni');
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
      nav.contact,
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
    // Strony usług T8–T10 powstają w kolejnych zadaniach; sprawdzamy tylko istniejące już adresy.
    const built = ['/', PATH, '/polityka-prywatnosci/'];
    for (const href of new Set(hrefs.map((h) => h.split('#')[0] || '/'))) {
      if (!built.includes(href)) continue;
      expect((await request.get(href)).status(), href).toBe(200);
    }
  });

  test('tabela przewija się poziomo w kontenerze z tabindex=0 i podpisem', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto(PATH);
    const scroller = page.locator('[data-component="comparison-table"] [data-scroll]');
    await expect(scroller).toHaveAttribute('tabindex', '0');
    await expect(scroller).toHaveAttribute('role', 'region');
    const caption = page.locator('[data-component="comparison-table"] caption');
    await expect(caption).toHaveCount(1);
    const captionId = await caption.getAttribute('id');
    await expect(scroller).toHaveAttribute('aria-labelledby', captionId ?? '');
    await expect(scroller).toHaveAccessibleName(/./);

    const { scrollWidth, clientWidth } = await scroller.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    expect(scrollWidth).toBeGreaterThan(clientWidth);
    await scroller.focus();
    await expect(scroller).toBeFocused();
    // WebKit bywa, że gubi pierwsze naciśnięcie zaraz po załadowaniu strony; ponawiamy klawisz.
    await expect(async () => {
      await page.keyboard.press('ArrowRight');
      expect(await scroller.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
    }).toPass({ timeout: 5_000 });
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

  test('hover kart bez animacji przy prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PATH);
    const card = page.locator('[data-component="other-services"] a').first();
    await card.hover();
    const style = await card.evaluate((el) => {
      const s = getComputedStyle(el);
      return { transform: s.transform, duration: s.transitionDuration };
    });
    expect(style.transform).toBe('none');
    expect(style.duration.split(',').every((d) => parseFloat(d) === 0)).toBe(true);
  });

  test('hover kart podnosi kartę bez prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PATH);
    const card = page.locator('[data-component="other-services"] a').first();
    await card.hover();
    await expect.poll(() => card.evaluate((el) => getComputedStyle(el).transform)).not.toBe('none');
  });

  test('meta i JSON-LD z seo.ts', async ({ page }) => {
    const entry = findSeoEntry(PATH);
    if (!entry) throw new Error('brak wpisu ESG w seo.ts');
    await page.goto(PATH);
    await expect(page).toHaveTitle(entry.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      entry.description,
    );
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toMatch(/\/uslugi\/esg\/$/);
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
