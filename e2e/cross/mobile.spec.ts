import { expect, test } from '@playwright/test';
import { CROSS_PAGES } from './pages';

// W-03 na 375 px (#15): obszar kliknięcia ≥ 24×24 px i tekst podstawowy ≥ 16 px na każdej stronie
// W-01, polityce i 404. Klasa `text-meta` oznacza teksty niepodstawowe z designu (src/styles/global.css).

const MIN_TARGET = 24;
const MIN_FONT = 16;
const INTERACTIVE = 'a, button, input, textarea, select, summary, [tabindex="0"]';
const BODY_TEXT = 'p, li, td, dd, label, input, textarea';

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
  });
}
