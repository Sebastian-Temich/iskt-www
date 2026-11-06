import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { CROSS_PAGES, internalPath } from './pages';

// Jakość przekrojowa (#15, W-01, W-02, W-03, W-09, W-11): każda strona W-01, polityka i 404.

const WIDTHS = [375, 768, 1440];
const linkStatus = new Map<string, number>();

for (const { path, status } of CROSS_PAGES) {
  test.describe(`strona ${path}`, () => {
    test('status i brak treści zastępczych', async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(status);
      const text = await page.locator('body').innerText();
      expect(text).not.toMatch(/lorem ipsum/i);
      // „TODO” wielkimi literami: małe litery trafiałyby w polskie słowa („metodologia”).
      expect(text).not.toMatch(/\bTODO\b/);
      const html = await page.content();
      expect(html).not.toMatch(/lorem ipsum/i);
      expect(html).not.toMatch(/\bTODO\b/);
    });

    test('linki wewnętrzne bez 404', async ({ page, request }) => {
      await page.goto(path);
      const hrefs = await page
        .locator('a[href]')
        .evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''));
      const targets = [...new Set(hrefs.map(internalPath).filter((p): p is string => p !== null))];
      expect(targets.length, 'linki wewnętrzne').toBeGreaterThan(0);
      const broken: string[] = [];
      for (const target of targets) {
        if (!linkStatus.has(target)) linkStatus.set(target, (await request.get(target)).status());
        const code = linkStatus.get(target) ?? 0;
        if (code >= 400) broken.push(`${target}: ${code}`);
      }
      expect(broken).toEqual([]);

      // Kotwice na tej samej stronie wskazują istniejący element.
      const anchors = hrefs.filter((href) => href.startsWith('#') && href.length > 1);
      for (const anchor of new Set(anchors)) {
        await expect(page.locator(`[id="${anchor.slice(1)}"]`), anchor).toHaveCount(1);
      }
    });

    test('bez poziomego scrolla na 375, 768 i 1440 px', async ({ page }) => {
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${width}px`).toBeLessThanOrEqual(0);
      }
    });

    test('axe bez naruszeń serious i critical', async ({ page }) => {
      for (const width of [375, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        const results = await new AxeBuilder({ page }).analyze();
        const blocking = results.violations
          .filter((v) => v.impact === 'serious' || v.impact === 'critical')
          .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
        expect(blocking, `${width}px`).toEqual([]);
      }
    });

    test('pierwszy Tab to SkipLink', async ({ page, browserName }) => {
      await page.goto(path);
      // WebKit na macOS przechodzi Tabem tylko po polach formularza; Alt+Tab obejmuje linki.
      await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
      const focused = page.locator(':focus');
      await expect(focused).toHaveClass(/skip-link/);
      await expect(focused).toHaveText('Przejdź do treści');
      await expect(focused).toBeInViewport();
    });

    test('dokładnie jeden aria-current="page"', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('[aria-current="page"]')).toHaveCount(1);
    });

    test('prefers-reduced-motion: bez animacji i bez transformacji przy hover', async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(path);
      // Ruch to animacje CSS (@keyframes) i przejścia właściwości przesuwających element;
      // przejście koloru linku nie jest ruchem.
      const motion = () =>
        page.evaluate(
          () =>
            document
              .getAnimations()
              .filter(
                (a) =>
                  !(a instanceof CSSTransition) ||
                  ['transform', 'translate', 'scale', 'rotate', 'top', 'left'].includes(
                    a.transitionProperty,
                  ),
              ).length,
        );
      expect(await motion(), 'animacje po załadowaniu').toBe(0);

      const interactive = page.locator(
        'header a, header button, main a, main button, main summary, footer a',
      );
      const count = await interactive.count();
      const moved: string[] = [];
      for (let i = 0; i < count; i += 1) {
        const element = interactive.nth(i);
        if (!(await element.isVisible())) continue;
        const before = await element.evaluate((el) => getComputedStyle(el).transform);
        await element.hover();
        const after = await element.evaluate((el) => getComputedStyle(el).transform);
        const label = await element.evaluate(
          (el) => `${el.tagName.toLowerCase()}: ${el.textContent?.trim().slice(0, 40)}`,
        );
        if (after !== before || (await motion()) > 0) moved.push(label);
      }
      expect(moved).toEqual([]);
    });
  });
}
