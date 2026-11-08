import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Strona główna (W-01, W-03, W-11): hero, 7 kafli kompetencji i sekcja kontaktu w wersji statycznej.
// Treść z D/ISKT-standalone.dc.html (hero l. 54-86, kompetencje l. 87-153, kontakt l. 154-182).

const TILES = [
  { title: 'Projekty B+R', href: '/uslugi/projekty-br/' },
  { title: 'ESG', href: '/uslugi/esg/' },
  { title: 'AI i transformacja', href: '/uslugi/ai-transformacja/' },
  { title: 'Startupy', href: '/startupy/' },
  { title: 'Oprogramowanie', href: '/uslugi/oprogramowanie/' },
  { title: 'Szkolenia', href: 'https://szkolenia.iskt.pl' },
  { title: 'Interim', href: '/uslugi/interim/' },
];

const COLUMNS = [
  { width: 375, columns: 1 },
  { width: 768, columns: 2 },
  { width: 1440, columns: 3 },
];

test.describe('strona główna', () => {
  test('BaseLayout z nagłówkiem home i sekcjami top, kompetencje, kontakt w <main>', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('body > header.site-header--home')).toHaveCount(1);
    const ids = await page
      .locator('main > section')
      .evaluateAll((sections) => sections.map((s) => s.id));
    expect(ids).toEqual(['top', 'kompetencje', 'kontakt']);
  });

  test('nagłówek home: logo i wyłącznie „Umów konsultację” → /#kontakt, bez „Kompetencje”', async ({
    page,
  }) => {
    await page.goto('/');
    const header = page.locator('body > header');
    await expect(header.getByRole('link', { name: 'Kompetencje' })).toHaveCount(0);
    const nav = header.getByRole('navigation', { name: 'Główna' });
    await expect(nav.getByRole('link')).toHaveCount(1);
    await expect(nav.getByRole('link', { name: 'Umów konsultację' })).toHaveAttribute(
      'href',
      '/#kontakt',
    );
  });

  // D/ISKT-standalone.dc.html:54-66: nagłówek leży na tle hero (bez własnego tła i krawędzi),
  // 40 px od góry, a siatka hero zaczyna się 64 px pod nim. Odbiór właściciela #43: na każdej
  // szerokości jeden rząd (logo z lewej, CTA z prawej), także poniżej 520 px, gdzie wzorzec zawija.
  for (const width of [360, 375, 390, 440, 768, 1440]) {
    test(`nagłówek home przy ${width} px: przezroczysty, nałożony na hero jak we wzorcu`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const header = page.locator('body > header');
      const style = await header.evaluate((el) => {
        const s = getComputedStyle(el);
        return {
          bgColor: s.backgroundColor,
          bgImage: s.backgroundImage,
          border: s.borderBottomWidth,
        };
      });
      expect(style.bgColor).toBe('rgba(0, 0, 0, 0)');
      expect(style.bgImage).toBe('none');
      expect(style.border).toBe('0px');

      const hero = await page.locator('main #top').boundingBox();
      const inner = await header.locator('.site-header__inner').boundingBox();
      const grid = await page.locator('main #top .hero__inner').boundingBox();
      const logo = await header.getByTestId('logo-link').boundingBox();
      const cta = await header.getByRole('link', { name: 'Umów konsultację' }).boundingBox();
      if (!hero || !inner || !grid || !logo || !cta) throw new Error('Brak elementu nagłówka');

      // Hero zaczyna się na górze strony, a nagłówek mieści się w jego obszarze.
      expect(hero.y).toBe(0);
      expect(inner.y).toBe(40);
      expect(inner.x).toBeCloseTo(grid.x, 0);
      expect(inner.width).toBeCloseTo(grid.width, 0);
      expect(grid.y - (inner.y + inner.height)).toBeCloseTo(64, 0);
      expect(logo.height).toBe(40);
      expect(cta.height).toBe(40);
      expect(logo.x).toBeCloseTo(inner.x, 0);
      // Jeden rząd: logo z lewej, CTA przy prawej krawędzi, oba na tej samej wysokości, bez
      // nachodzenia na siebie i bez przewijania w poziomie.
      expect(inner.height).toBe(40);
      expect(cta.y).toBe(logo.y);
      expect(cta.x + cta.width).toBeCloseTo(inner.x + inner.width, 0);
      expect(cta.x).toBeGreaterThanOrEqual(logo.x + logo.width + 8);
      const name = header.locator('.brand__name');
      const nameBox = await name.boundingBox();
      if (!nameBox) throw new Error('Brak nazwy marki');
      expect(nameBox.x + nameBox.width).toBeLessThanOrEqual(cta.x);
      expect(
        await name.evaluate((el) => el.scrollWidth <= Math.ceil(el.getBoundingClientRect().width)),
      ).toBe(true);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
      // Nazwa dostępna linku logo zawsze pełna, także gdy „Greennovation” jest ukryte wizualnie.
      await expect(header.getByTestId('logo-link')).toHaveAccessibleName('ISKT Greennovation');
      // Pełna nazwa widoczna od 430 px (440 px i szerzej).
      const accentVisible = await header
        .locator('.brand__accent')
        .evaluate((el) => el.getBoundingClientRect().width > 1);
      expect(accentVisible).toBe(width >= 430);
    });
  }

  test('hero: treść i przyciski jak w designie, logo przez astro:assets z wymiarami', async ({
    page,
  }) => {
    await page.goto('/');
    const hero = page.locator('main #top');
    await expect(hero.locator('.badge')).toHaveText('Innowacje w harmonii z naturą');
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Technologie przyszłości dla odpowiedzialnego biznesu');
    await expect(hero).toContainText(
      'ISKT Greennovation to zespół ekspertów łączących pasję do innowacji technologicznych. Wspieramy organizacje w transformacji cyfrowej, wdrażaniu rozwiązań AI i strategiach ESG.',
    );
    const talk = hero.getByRole('link', { name: 'Umów rozmowę' });
    await expect(talk).toHaveAttribute('href', '#kontakt');
    await expect(talk).toHaveClass(/btn--primary/);
    await expect(talk.locator('svg[data-icon="arrow-right"]')).toHaveCount(1);
    const competences = hero.getByRole('link', { name: 'Zobacz kompetencje' });
    await expect(competences).toHaveAttribute('href', '#kompetencje');
    await expect(competences).toHaveClass(/btn--outline/);

    const logo = hero.locator('img');
    await expect(logo).toHaveCount(1);
    await expect(logo).toHaveAttribute('src', /^\/_astro\/.+\.webp$/);
    await expect(logo).toHaveAttribute('alt', '');
    await expect(logo).toHaveAttribute('width', /^\d+$/);
    await expect(logo).toHaveAttribute('height', /^\d+$/);
  });

  test('kompetencje: nagłówek i 7 kafli z href z W-01', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#kompetencje');
    await expect(section.getByRole('heading', { level: 2 })).toHaveText('Nasze Kompetencje');
    await expect(section).toContainText('Kompleksowe rozwiązania dla nowoczesnego biznesu');

    const tiles = section.locator('.service-grid > a');
    await expect(tiles).toHaveCount(TILES.length);
    for (const [i, { title, href }] of TILES.entries()) {
      const tile = tiles.nth(i);
      await expect(tile.getByRole('heading', { level: 3 })).toHaveText(title);
      await expect(tile).toHaveAttribute('href', href);
    }
    const training = tiles.nth(5);
    await expect(training).toHaveAttribute('target', '_blank');
    await expect(training).toHaveAttribute('rel', /noopener/);
  });

  for (const { width, columns } of COLUMNS) {
    test(`kompetencje: ${columns} kol. przy ${width} px, Interim na całą szerokość`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const grid = page.locator('#kompetencje .service-grid');
      const count = await grid.evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length,
      );
      expect(count).toBe(columns);

      const gridBox = await grid.boundingBox();
      const interimBox = await grid.locator('> a').last().boundingBox();
      if (!gridBox || !interimBox) throw new Error('Brak siatki albo kafla Interim');
      expect(Math.abs(interimBox.width - gridBox.width)).toBeLessThanOrEqual(1);
    });
  }

  // Sam układ sekcji, bez wysyłania. Formularz nie ma atrybutu `action`: wysyła go skrypt (fetch
  // POST /api/contact), co sprawdza test wysłania niżej.
  test('kontakt: treść, dane z site.ts i formularz z polami i etykietami, bez action', async ({
    page,
  }) => {
    await page.goto('/');
    const section = page.locator('#kontakt');
    await expect(section.getByRole('heading', { level: 2 })).toHaveText(
      'Porozmawiajmy o Twoim projekcie',
    );
    await expect(section).toContainText(
      'Napisz w dwóch zdaniach, czego potrzebujesz. Odpowiadamy zwykle w ciągu jednego dnia roboczego.',
    );
    await expect(section).toContainText('Wiedeńska 11, 44-240 Żory');
    await expect(section).toContainText('NIP 6511752112 · REGON 543251405');

    const form = section.locator('form');
    await expect(form).toHaveCount(1);
    await expect(form).not.toHaveAttribute('action', /.*/);

    const fields = [
      { label: 'Imię i nazwisko', name: 'name', tag: 'INPUT', type: 'text' },
      { label: 'E-mail', name: 'email', tag: 'INPUT', type: 'email' },
      { label: 'Wiadomość', name: 'message', tag: 'TEXTAREA', type: null },
    ];
    for (const { label, name, tag, type } of fields) {
      // Etykieta powiązana z polem (for/id), z gwiazdką wymagalności.
      const control = form.getByLabel(label);
      await expect(control).toHaveCount(1);
      await expect(control).toHaveAttribute('name', name);
      await expect(control).toHaveAttribute('required', '');
      expect(await control.evaluate((el) => el.tagName)).toBe(tag);
      if (type) await expect(control).toHaveAttribute('type', type);
      const id = await control.getAttribute('id');
      const labelEl = form.locator(`label[for="${id}"]`);
      await expect(labelEl).toHaveCount(1);
      await expect(labelEl).toContainText(label);
      await expect(labelEl.locator('.field__required')).toHaveText('*');
    }

    const submit = form.getByRole('button', { name: 'Wyślij wiadomość' });
    await expect(submit).toHaveAttribute('type', 'submit');
    await expect(submit.locator('svg[data-icon="send"]')).toHaveCount(1);
  });

  // Prawdziwa wysyłka: skrypt formularza robi POST /api/contact, a serwer testów (playwright.config.ts)
  // działa z MAIL_TRANSPORT=mock, więc żaden e-mail nie wychodzi. Test sprawdza, że wysłanie do mocka
  // nie przeładowuje strony i nie przenosi danych do URL (jak przy wysyłce GET bez JS).
  test('kontakt: wysłanie formularza do mocka nie zmienia adresu i nie przenosi danych do URL', async ({
    page,
  }) => {
    await page.goto('/');
    const form = page.locator('#kontakt form');
    await form.getByLabel('Imię i nazwisko').fill('Jan Kowalski');
    await form.getByLabel('E-mail').fill('jan@firma.pl');
    await form.getByLabel('Wiadomość').fill('Test');
    await form.getByRole('button', { name: 'Wyślij wiadomość' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(form.getByLabel('Imię i nazwisko')).toHaveValue('Jan Kowalski');
  });

  test.describe('bez JavaScriptu', () => {
    test.use({ javaScriptEnabled: false });

    test('kontakt: formularz ukryty, nie da się go wysłać (brak POST), jest kontakt w noscript', async ({
      page,
    }) => {
      const posts: string[] = [];
      page.on('request', (request) => {
        if (request.method() === 'POST') posts.push(request.url());
      });
      await page.goto('/');
      const section = page.locator('#kontakt');
      const form = section.locator('form');
      await expect(form).toHaveCount(1);
      await expect(form).toBeHidden();
      await expect(form).toHaveAttribute('hidden', '');

      // Ukrytego formularza nie da się wypełnić ani wysłać: pola i przycisk są niewidoczne.
      await expect(form.getByRole('button', { name: 'Wyślij wiadomość' })).toHaveCount(0);
      await expect(section.locator('input:visible, textarea:visible, button:visible')).toHaveCount(
        0,
      );
      await page.keyboard.press('Enter');
      expect(posts).toEqual([]);
      await expect(page).toHaveURL(/\/$/);

      const fallback = section.getByTestId('contact-noscript');
      await expect(fallback).toBeVisible();
      await expect(fallback).toContainText('Aby wysłać formularz, włącz JavaScript');
      await expect(fallback.getByRole('link', { name: 'biuro@iskt.pl' })).toHaveAttribute(
        'href',
        'mailto:biuro@iskt.pl',
      );
      await expect(fallback.getByRole('link', { name: '+48 504 083 825' })).toHaveAttribute(
        'href',
        'tel:+48504083825',
      );
    });
  });

  test('treść bez lorem ipsum i TODO', async ({ page }) => {
    await page.goto('/');
    const text = (await page.locator('body').innerText()).toLowerCase();
    expect(text).not.toContain('lorem ipsum');
    expect(text).not.toContain('todo');
  });

  for (const width of [375, 768, 1440]) {
    test(`brak poziomego przewijania przy ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('axe bez naruszeń serious i critical', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
    expect(blocking).toEqual([]);
  });
});
