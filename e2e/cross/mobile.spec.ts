import { expect, test } from '@playwright/test';
import { CROSS_PAGES } from './pages';

// W-03 na 375 px (#15): obszar kliknięcia ≥ 24×24 px i tekst podstawowy ≥ 16 px na każdej stronie
// W-01, polityce i 404. Klasa `text-meta` oznacza teksty niepodstawowe z designu (src/styles/global.css).

const MIN_TARGET = 24;
const MIN_FONT = 16;
const INTERACTIVE = 'a, button, input, textarea, select, summary, [tabindex="0"]';
const BODY_TEXT = 'p, li, td, dd, label, input, textarea';

// Tekst podstawowy, dla którego design podaje więcej niż 16 px (W-03: „albo tyle, ile podaje design,
// jeśli więcej”). Design ma stałe tokeny bez zmniejszania na mobile: --text-lg = 18 px,
// --text-xl = 22 px. Źródła: pliki D/*.dc.html z docs/02-design/zrodla/Strona firmowa ISKT/.
const SERVICE_DESIGN_MIN = [
  { selector: '.service-hero__lead', px: 22, source: 'l. 70: lead hero, --text-xl' },
  { selector: '.when-intro__lead', px: 18, source: 'l. 81–82: lead „Kiedy…”, --text-lg' },
];
const DESIGN_MIN: Record<string, { selector: string; px: number; source: string }[]> = {
  '/': [
    { selector: '.hero__lead', px: 18, source: 'ISKT-standalone.dc.html:70, --text-lg' },
    { selector: '.contact__lead', px: 18, source: 'ISKT-standalone.dc.html:159, --text-lg' },
  ],
  '/uslugi/projekty-br/': [
    { selector: '.br-hero__lead', px: 18, source: 'Projekty-BR.dc.html:58, --text-lg' },
    {
      selector: '[data-component="cta-band-brand"] p',
      px: 18,
      source: 'Projekty-BR.dc.html:234, --text-lg',
    },
  ],
  '/uslugi/esg/': SERVICE_DESIGN_MIN,
  '/uslugi/ai-transformacja/': SERVICE_DESIGN_MIN,
  '/uslugi/oprogramowanie/': SERVICE_DESIGN_MIN,
  '/uslugi/interim/': SERVICE_DESIGN_MIN,
  '/startupy/': SERVICE_DESIGN_MIN,
};

test.use({ viewport: { width: 375, height: 812 } });

for (const { path } of CROSS_PAGES) {
  test.describe(`W-03 375 px ${path}`, () => {
    test('każdy widoczny element interaktywny ma co najmniej 24×24 px', async ({ page }) => {
      await page.goto(path);
      const small = await page.locator(INTERACTIVE).evaluateAll(
        (elements, min) =>
          elements
            // Widoczny: renderowany i nie w ukrytej pułapce formularza (aria-hidden, poza ekranem).
            .filter(
              (el) =>
                el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) &&
                !el.closest('[aria-hidden="true"]'),
            )
            .map((el) => {
              const rect = el.getBoundingClientRect();
              const parent = el.parentElement?.closest('[class]');
              const where = parent ? `${String(parent.className).split(' ')[0]} > ` : '';
              return {
                label: `${where}${el.tagName.toLowerCase()}${el.className ? `.${String(el.className).split(' ')[0]}` : ''} „${(el.textContent ?? '').trim().slice(0, 30)}”`,
                width: Math.round(rect.width * 10) / 10,
                height: Math.round(rect.height * 10) / 10,
              };
            })
            .filter((box) => box.width < min || box.height < min)
            .map((box) => `${box.label}: ${box.width}×${box.height}`),
        MIN_TARGET,
      );
      expect(small).toEqual([]);
    });

    test('tekst podstawowy w <main> i stopce ma co najmniej 16 px', async ({ page }) => {
      await page.goto(path);
      const scope = page.locator('main, body > footer');
      const report = await scope.evaluateAll(
        (roots, { selector, min }) => {
          const elements = roots.flatMap((root) => [
            ...root.querySelectorAll<HTMLElement>(selector),
          ]);
          const visible = elements.filter(
            (el) => el.checkVisibility() && !el.closest('[aria-hidden="true"]'),
          );
          const label = (el: HTMLElement) => {
            const parent = el.parentElement?.closest('[class]');
            const where = parent ? `${String(parent.className).split(' ')[0]} > ` : '';
            const name = `${el.tagName.toLowerCase()}${el.className ? `.${String(el.className).split(' ')[0]}` : ''}`;
            return `${where}${name} „${(el.textContent ?? '').trim().slice(0, 30)}” ${getComputedStyle(el).fontSize}`;
          };
          return {
            meta: roots
              .flatMap((root) => [...root.querySelectorAll<HTMLElement>('.text-meta')])
              .map(label),
            small: visible
              .filter((el) => !el.classList.contains('text-meta'))
              .filter((el) => parseFloat(getComputedStyle(el).fontSize) < min)
              .map(label),
          };
        },
        { selector: BODY_TEXT, min: MIN_FONT },
      );
      // Lista elementów z text-meta (kryterium #15) trafia do wyniku testu.
      test.info().annotations.push({
        type: 'text-meta',
        description: report.meta.join('\n') || 'brak',
      });
      console.log(`${path} text-meta (${report.meta.length}):\n  ${report.meta.join('\n  ')}`);
      expect(report.small).toEqual([]);
    });

    const designMin = DESIGN_MIN[path] ?? [];
    if (designMin.length > 0) {
      test('tekst większy w designie ma co najmniej rozmiar z designu', async ({ page }) => {
        await page.goto(path);
        for (const { selector, px, source } of designMin) {
          const sizes = await page
            .locator(`main ${selector}`)
            .evaluateAll((elements) =>
              elements
                .filter((el) => el.checkVisibility())
                .map((el) => parseFloat(getComputedStyle(el).fontSize)),
            );
          expect(sizes.length, `${selector}: element z designu (${source})`).toBeGreaterThan(0);
          for (const size of sizes) {
            expect(size, `${selector} (${source})`).toBeGreaterThanOrEqual(px);
          }
        }
      });
    }
  });
}
