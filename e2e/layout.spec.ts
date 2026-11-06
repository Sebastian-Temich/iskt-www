import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// Adres /404 strony src/pages/404.astro. Przy trailingSlash: 'always' kanoniczna postać to /404/:
// na Vercel `/404` przekierowuje na nią (vercel.json, test niżej), a `astro preview` odrzuca każdy
// adres bez ukośnika własną stroną, zanim poszuka pliku.
const PATH_404 = '/404/';
const NOT_FOUND_PATH = '/nie-ma-takiej-strony/';
const PAGES = [
  { path: '/', name: 'strona główna' },
  { path: PATH_404, name: 'strona 404' },
];
const VIEWPORTS = [375, 768, 1440];

async function expectLayout(page: Page) {
  await expect(page.locator('html')).toHaveAttribute('data-layout', 'base');
  const body = page.locator('body');
  // Kolejność: SkipLink, <header>, <main id="tresc">, <footer>.
  const order = await body.evaluate((el) =>
    [...el.children]
      .filter((child) => !['SCRIPT', 'STYLE'].includes(child.tagName))
      .map((child) =>
        child.tagName === 'A' ? `a.${child.className.split(' ')[0]}` : child.tagName,
      )
      .slice(0, 4),
  );
  expect(order).toEqual(['a.skip-link', 'HEADER', 'MAIN', 'FOOTER']);
  await expect(page.locator('main#tresc')).toHaveCount(1);
  await expect(page.locator('main header, main footer')).toHaveCount(0);

  const header = page.locator('body > header');
  const logo = header.getByRole('link', { name: 'ISKT Greennovation' });
  await expect(logo).toHaveAttribute('href', '/');
  await expect(logo.locator('img')).toHaveAttribute('src', /^\/_astro\/.+\.webp$/);
  // „Kompetencje” tylko w wariancie page; wariant home (/) ma wyłącznie CTA (#41).
  if (new URL(page.url()).pathname === '/') {
    await expect(header.getByRole('link', { name: 'Kompetencje' })).toHaveCount(0);
  } else {
    await expect(header.getByRole('link', { name: 'Kompetencje' })).toHaveAttribute(
      'href',
      '/#kompetencje',
    );
  }
  await expect(header.getByRole('link', { name: 'Umów konsultację' })).toHaveAttribute(
    'href',
    '/#kontakt',
  );

  const footer = page.locator('body > footer');
  const year = new Date().getFullYear();
  await expect(footer).toContainText(`© ${year} ISKT Greennovation Sp. z o.o.`);
  await expect(footer).toContainText('Wiedeńska 11, 44-240 Żory');
  await expect(footer).toContainText('NIP 6511752112');
  await expect(footer.getByRole('link', { name: 'biuro@iskt.pl' })).toHaveAttribute(
    'href',
    'mailto:biuro@iskt.pl',
  );
  await expect(footer.getByRole('link', { name: '+48 504 083 825' })).toHaveAttribute(
    'href',
    'tel:+48504083825',
  );
}

test.describe('layout', () => {
  for (const { path, name } of PAGES) {
    test(`${name}: BaseLayout z nagłówkiem, <main> i stopką`, async ({ page }) => {
      await page.goto(path);
      await expectLayout(page);
    });

    test(`${name}: pierwszy Tab fokusuje „Przejdź do treści” z widocznym fokusem`, async ({
      page,
      browserName,
    }) => {
      await page.goto(path);
      // WebKit domyślnie pomija linki przy Tab; Option+Tab przechodzi po wszystkich elementach.
      await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
      const skip = page.getByRole('link', { name: 'Przejdź do treści' });
      await expect(skip).toBeFocused();
      await expect(skip).toBeInViewport();
      const outline = await skip.evaluate((el) => getComputedStyle(el).outlineStyle);
      expect(outline).not.toBe('none');
      await expect(skip).toHaveAttribute('href', '#tresc');
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/#tresc$/);
    });

    for (const width of VIEWPORTS) {
      test(`${name}: brak poziomego przewijania przy ${width} px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }

    test(`${name}: axe bez naruszeń serious i critical`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      const blocking = results.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
      expect(blocking).toEqual([]);
    });
  }

  test('strona główna: dokładnie jeden aria-current="page", na linku logo', async ({ page }) => {
    await page.goto('/');
    const current = page.locator('[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveAttribute('href', '/');
    await expect(current).toHaveAttribute('data-testid', 'logo-link');
    await expect(page.locator('body > header [aria-current="true"]')).toHaveCount(0);
  });
});

test.describe('strona 404', () => {
  test('nieistniejący URL zwraca 404 i stronę w layoucie z linkiem do /', async ({ page }) => {
    const response = await page.goto(NOT_FOUND_PATH);
    expect(response?.status()).toBe(404);
    await expectLayout(page);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Nie znaleziono strony' }),
    ).toBeVisible();
    await expect(
      page.locator('main').getByRole('link', { name: 'Wróć na stronę główną' }),
    ).toHaveAttribute('href', '/');
  });

  test('/404 to strona src/pages/404.astro w layoucie', async ({ page }) => {
    await page.goto(PATH_404);
    await expectLayout(page);
    await expect(page).toHaveTitle('Nie znaleziono strony · ISKT Greennovation');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Nie znaleziono strony' }),
    ).toBeVisible();
  });

  // Sprawdza tylko konfigurację, nie samo przekierowanie HTTP (to robi Vercel po wdrożeniu).
  test('Vercel ma włączony końcowy ukośnik (trailingSlash w vercel.json)', () => {
    const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
    expect(config.trailingSlash).toBe(true);
  });

  test('prymitywy UI: Breadcrumb, Badge, Card, SectionHeading, Button, Icon', async ({ page }) => {
    await page.goto(PATH_404);
    const main = page.locator('main');

    const breadcrumb = main.getByRole('navigation', { name: 'Ścieżka' });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByRole('link', { name: 'Start' })).toHaveAttribute('href', '/');
    const crumbs = breadcrumb.locator('li');
    await expect(crumbs.last().locator('[aria-current="page"]')).toHaveText(
      'Nie znaleziono strony',
    );
    await expect(page.locator('[aria-current="page"]')).toHaveCount(1);
    // Logo nie jest bieżącą stroną poza /.
    await expect(page.getByTestId('logo-link')).not.toHaveAttribute('aria-current', /.*/);

    await expect(main.locator('.badge')).toHaveText('Błąd 404');
    await expect(main.locator('.card')).toBeVisible();
    await expect(main.locator('.section-heading h1')).toHaveText('Nie znaleziono strony');

    const home = main.getByRole('link', { name: 'Wróć na stronę główną' });
    await expect(home).toHaveClass(/btn--primary/);
    await expect(home).toHaveClass(/btn--lg/);
    // Ikona Lucide wyrenderowana w buildzie jako inline SVG, dekoracyjna.
    const icon = home.locator('svg[data-icon="arrow-right"]');
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    await expect(main.getByRole('link', { name: 'Zobacz kompetencje' })).toHaveClass(
      /btn--outline/,
    );

    // Button nigdy nie zagnieżdża <button> w <a> ani odwrotnie.
    await expect(page.locator('a button, button a')).toHaveCount(0);
  });
});
