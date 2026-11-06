import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

// #43: telefon bez dużego logo w hero (bez pobierania pliku), przyciski hero o szerokości treści,
// komunikaty pól 14 px, drobne różnice stron usług względem D/*.dc.html
// (docs/02-design/zrodla/Strona firmowa ISKT/).

// Pobrane obrazy z /_astro/. Nagłówek używa tego samego źródła (iskt-logo.png) w innych rozmiarach,
// więc „plik logo hero” to adresy kandydatów z <picture> w hero (srcset źródeł AVIF/WebP i <img>).
function imageRequests(page: Page): string[] {
  const urls: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'image') urls.push(new URL(request.url()).pathname);
  });
  return urls;
}

async function heroLogoFiles(page: Page): Promise<string[]> {
  return page.locator('main #top .hero__picture').evaluate((picture) =>
    [
      ...picture.querySelectorAll<HTMLSourceElement>('source[type]'),
      ...picture.querySelectorAll<HTMLImageElement>('img'),
    ]
      .flatMap((el) => [
        ...(el.getAttribute('srcset') ?? '').split(','),
        el.getAttribute('src') ?? '',
      ])
      .map((candidate) => candidate.trim().split(/\s+/)[0])
      .filter((url) => url.startsWith('/_astro/')),
  );
}

test.describe('#43 strona główna: logo w hero', () => {
  for (const width of [375, 414]) {
    test(`${width} px: logo hero niewidoczne, plik logo nie jest pobierany ani preloadowany`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      const requests = imageRequests(page);
      await page.goto('/');
      await page.waitForLoadState('load');
      await expect(page.locator('main #top .hero__visual')).toBeHidden();
      await expect(page.locator('main #top .hero__logo')).toBeHidden();
      const files = await heroLogoFiles(page);
      expect(files.length).toBeGreaterThan(20);
      expect(requests.filter((url) => files.includes(url))).toEqual([]);
      await expect(page.locator('link[rel="preload"][as="image"]')).toHaveCount(0);
      // Nagłówek home nadal ma swoje (małe) logo.
      await expect(page.getByTestId('logo-link')).toBeVisible();
    });
  }

  for (const width of [768, 1440]) {
    test(`${width} px: hero z logo w dwóch kolumnach, logo pobrane`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const requests = imageRequests(page);
      await page.goto('/');
      const logo = page.locator('main #top img.hero__logo');
      await expect(logo).toBeVisible();
      await expect.poll(() => logo.evaluate((img: HTMLImageElement) => img.complete)).toBe(true);
      const files = await heroLogoFiles(page);
      expect(requests.filter((url) => files.includes(url)).length).toBeGreaterThan(0);
      const copy = await page.locator('main #top .hero__copy').boundingBox();
      const visual = await page.locator('main #top .hero__visual').boundingBox();
      if (!copy || !visual) throw new Error('Brak kolumn hero');
      // Logo obok treści (druga kolumna), nie pod nią.
      expect(visual.x).toBeGreaterThan(copy.x + copy.width - 1);
      const box = await logo.boundingBox();
      expect(box?.width).toBeLessThanOrEqual(320);
    });
  }

  test('< 480 px: przyciski hero mają szerokość treści, nie 100%', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const actions = await page.locator('main #top .hero__actions').boundingBox();
    if (!actions) throw new Error('Brak przycisków hero');
    for (const name of ['Umów rozmowę', 'Zobacz kompetencje']) {
      const button = page.locator('main #top').getByRole('link', { name });
      const box = await button.boundingBox();
      if (!box) throw new Error(`Brak przycisku ${name}`);
      expect(box.width, name).toBeLessThan(actions.width - 40);
      expect(await button.evaluate((el) => getComputedStyle(el).width)).not.toBe(
        `${actions.width}px`,
      );
    }
  });
});

test.describe('#43 formularz: komunikaty pól', () => {
  test('komunikaty błędów pól mają 14 px, axe bez naruszeń kontrastu', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('#kontakt form');
    await expect(form).toBeVisible();
    await form.getByRole('button', { name: 'Wyślij wiadomość' }).click();
    const messages = form.locator('.field__message:not([hidden])');
    await expect(messages.first()).toBeVisible();
    const sizes = await messages.evaluateAll((elements) =>
      elements.map((el) => getComputedStyle(el).fontSize),
    );
    expect(sizes.length).toBeGreaterThan(0);
    for (const size of sizes) expect(size).toBe('14px');

    const results = await new AxeBuilder({ page }).include('#kontakt').analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});

test.describe('#43 strony usług', () => {
  test('/uslugi/esg/: bez spacji przed kropką po pogrubieniu', async ({ page }) => {
    await page.goto('/uslugi/esg/');
    const lead = page.locator('.when-intro__lead');
    const text = (await lead.innerText()).replace(/\s+/g, ' ');
    expect(text).toContain('o ryzyka klimatyczne. Wtedy liczy się');
    expect(text).not.toContain('klimatyczne .');
  });

  test('lead ServiceHero: 700 px na Interim, 680 px na pozostałych stronach usług', async ({
    page,
  }) => {
    const expected: Record<string, string> = {
      '/uslugi/interim/': '700px',
      '/uslugi/esg/': '680px',
      '/uslugi/ai-transformacja/': '680px',
      '/uslugi/oprogramowanie/': '680px',
      '/startupy/': '680px',
    };
    for (const [path, maxWidth] of Object.entries(expected)) {
      await page.goto(path);
      const lead = page.locator('[data-component="service-hero"] .service-hero__lead');
      expect(await lead.evaluate((el) => getComputedStyle(el).maxWidth), path).toBe(maxWidth);
    }
  });

  test('/uslugi/oprogramowanie/: tła tabeli i przebiegu jak w D/Oprogramowanie.dc.html', async ({
    page,
  }) => {
    await page.goto('/uslugi/oprogramowanie/');
    const tokens = await page.evaluate(() => {
      const probe = document.createElement('div');
      document.body.append(probe);
      const read = (token: string) => {
        probe.style.backgroundColor = `var(${token})`;
        return getComputedStyle(probe).backgroundColor;
      };
      const result = { page: read('--surface-page'), subtle: read('--surface-subtle') };
      probe.remove();
      return result;
    });
    expect(tokens.page).not.toBe(tokens.subtle);
    const bg = (selector: string) =>
      page.locator(selector).evaluate((el) => {
        const s = getComputedStyle(el);
        return { color: s.backgroundColor, borderTop: s.borderTopWidth };
      });
    // l. 164: „Modele” na --surface-subtle z krawędzią górną.
    expect(await bg('[data-component="comparison-table"]')).toEqual({
      color: tokens.subtle,
      borderTop: '1px',
    });
    // l. 211: „Proces” na --surface-page z krawędzią górną.
    expect(await bg('[data-component="process-timeline"]')).toEqual({
      color: tokens.page,
      borderTop: '1px',
    });

    // Domyślne tła bez zmian na innych stronach usług (D/ESG.dc.html:128, 175).
    await page.goto('/uslugi/esg/');
    expect((await bg('[data-component="comparison-table"]')).color).toBe(tokens.page);
    expect((await bg('[data-component="process-timeline"]')).color).toBe(tokens.subtle);
  });

  test('„Zobacz też”: strzałka w aria-hidden, nazwa dostępna bez strzałki', async ({ page }) => {
    for (const path of ['/uslugi/esg/', '/uslugi/interim/', '/uslugi/oprogramowanie/']) {
      await page.goto(path);
      const link = page.locator('[data-component="service-hero"] .service-hero__see-also');
      await expect(link.locator('[aria-hidden="true"]')).toHaveText('→');
      await expect(link, path).toHaveAccessibleName(/^Zobacz też: [^→]+[^\s→]$/);
      await expect(
        page.getByRole('link', { name: 'Zobacz też: AI i transformacja', exact: true }),
      ).toHaveCount(1);
    }
  });
});
