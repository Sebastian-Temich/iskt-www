import { expect, test } from '@playwright/test';

// QA M3: scenariusze odbioru O-2, O-7, O-10 (plan) oraz przepływy między stronami usług:
// kafle strony głównej → strony usług → „Pozostałe kompetencje” → logo. Lista stron z W-01
// (specyfikacja) jest tu wpisana na sztywno, żeby test nie zależał od `src/content/seo.ts`.

const SERVICE_PAGES = [
  '/uslugi/projekty-br/',
  '/uslugi/esg/',
  '/uslugi/ai-transformacja/',
  '/startupy/',
  '/uslugi/oprogramowanie/',
  '/uslugi/interim/',
];
const W01_PAGES = ['/', ...SERVICE_PAGES];
const OTHER_SECTION = '[data-component="other-services"], [data-component="service-chips"]';

function internalPath(href: string): string | null {
  if (!href.startsWith('/') || href.startsWith('//')) return null;
  return href.split('#')[0]?.split('?')[0] || '/';
}

test.describe('QA M3', () => {
  test('O-2: z kafli strony głównej każda z 6 usług, breadcrumb, „Pozostałe kompetencje” i logo', async ({
    page,
    request,
  }) => {
    await page.goto('/');
    const tileHrefs = await page
      .locator('#kompetencje .service-grid a[href^="/"]')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''));
    expect([...tileHrefs].sort()).toEqual([...SERVICE_PAGES].sort());

    for (const href of SERVICE_PAGES) {
      await page.goto('/');
      const [response] = await Promise.all([
        page.waitForNavigation(),
        page.locator(`#kompetencje .service-grid a[href="${href}"]`).click(),
      ]);
      // WebKit może zwrócić 304 dla strony odwiedzonej wcześniej w tym teście (pamięć podręczna).
      expect(response?.status() ?? 0, href).toBeLessThan(400);
      expect(new URL(page.url()).pathname).toBe(href);

      // Breadcrumb z bieżącą stroną.
      const crumb = page.locator('nav.breadcrumb');
      await expect(crumb, href).toBeVisible();
      await expect(crumb.locator('[aria-current="page"]'), href).toHaveCount(1);
      await expect(crumb.locator('a[href="/"]'), href).toHaveCount(1);

      // „Pozostałe kompetencje”: linki wewnętrzne bez bieżącej strony, każdy 200.
      const others = await page
        .locator(OTHER_SECTION)
        .locator('a')
        .evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''));
      const internal = others.map(internalPath).filter((p): p is string => p !== null);
      // B+R ma w designie 5 chipów bez Interim (D/Projekty-BR.dc.html:246-250): 4 linki wewnętrzne.
      expect(internal.length, `${href}: linki pozostałych kompetencji`).toBeGreaterThanOrEqual(4);
      expect(internal, href).not.toContain(href);
      for (const other of internal) {
        expect((await request.get(other)).status(), `${href} → ${other}`).toBe(200);
      }

      // Przejście dalej przez pierwszą pozostałą kompetencję i powrót logo na stronę główną.
      const first = internal[0] ?? '/';
      await page.locator(OTHER_SECTION).locator(`a[href="${first}"]`).first().click();
      await expect(page).toHaveURL(new RegExp(`${first.replace(/\//g, '\\/')}$`));
      await page.getByTestId('logo-link').click();
      await expect(page).toHaveURL(/\/$/);
      await expect(page.locator('#kompetencje')).toBeVisible();
    }
  });

  test('linki wewnętrzne wszystkich stron W-01 nie dają 404', async ({ page, request }) => {
    const checked = new Map<string, number>();
    for (const path of W01_PAGES) {
      await page.goto(path);
      const hrefs = await page
        .locator('a[href]')
        .evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''));
      for (const href of hrefs) {
        const target = internalPath(href);
        if (target === null || checked.has(target)) continue;
        checked.set(target, (await request.get(target)).status());
      }
    }
    const broken = [...checked].filter(([, status]) => status >= 400);
    expect(broken, 'linki z błędem').toEqual([]);
    for (const path of W01_PAGES) expect(checked.has(path), `brak linku do ${path}`).toBe(true);
  });

  test('O-10 / W-08: sitemap.xml ma dokładnie 7 stron z W-01', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => new URL(m[1] ?? '').pathname,
    );
    expect([...paths].sort()).toEqual([...W01_PAGES].sort());
  });

  test('O-10 / W-07: każda strona W-01 ma unikalne meta, canonical i Open Graph', async ({
    page,
    request,
  }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const path of W01_PAGES) {
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
      const title = await page.title();
      const description =
        (await page.locator('meta[name="description"]').getAttribute('content')) ?? '';
      expect(title, path).not.toBe('');
      expect(description.length, `${path}: description`).toBeGreaterThan(0);
      expect(description.length, `${path}: description ≤ 160`).toBeLessThanOrEqual(160);
      titles.add(title);
      descriptions.add(description);

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(new URL(canonical ?? '').pathname, `${path}: canonical`).toBe(path);
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
      expect(ogUrl, `${path}: og:url`).toBe(canonical);
      for (const prop of ['og:title', 'og:description', 'og:image']) {
        await expect(page.locator(`meta[property="${prop}"]`), `${path}: ${prop}`).toHaveCount(1);
      }
      await expect(page.locator('meta[name="twitter:card"]'), path).toHaveCount(1);
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect((await request.get(new URL(ogImage ?? '').pathname)).status(), path).toBe(200);
    }
    expect(titles.size, 'unikalne <title>').toBe(W01_PAGES.length);
    expect(descriptions.size, 'unikalne description').toBe(W01_PAGES.length);
  });

  test('O-7: Tab zaczyna od „Przejdź do treści”, FAQ na B+R otwiera się Enterem', async ({
    page,
    browserName,
  }) => {
    await page.goto('/');
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
    const first = page.locator(':focus');
    await expect(first).toHaveClass(/skip-link/);
    await expect(first).toBeVisible();

    await page.goto('/uslugi/projekty-br/');
    const button = page.locator('.faq__button').first();
    const before = await button.getAttribute('aria-expanded');
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-expanded', before === 'true' ? 'false' : 'true');
    const panel = page.locator(`#${(await button.getAttribute('aria-controls')) ?? ''}`);
    if (before !== 'true') await expect(panel).toBeVisible();
  });

  test('W-03: strony usług bez poziomego scrolla na 375, 768 i 1440 px', async ({ page }) => {
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of SERVICE_PAGES) {
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        );
        expect(overflow, `${path} na ${width}px`).toBe(false);
      }
    }
  });
});
