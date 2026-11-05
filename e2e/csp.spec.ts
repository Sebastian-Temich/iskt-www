import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

// CSP z vercel.json (architektura, „Bezpieczeństwo”; W-10, W-12). `astro preview` nie wysyła
// nagłówków z vercel.json, więc test dokleja nagłówek do odpowiedzi HTML i sprawdza, że strony
// działają pod tą polityką bez naruszeń.

type HeaderRule = { source: string; headers: { key: string; value: string }[] };

function cspFromVercelJson(): string {
  const config = JSON.parse(readFileSync('vercel.json', 'utf8')) as { headers: HeaderRule[] };
  const rule = config.headers.find((h) => h.source === '/(.*)');
  const header = rule?.headers.find((h) => h.key.toLowerCase() === 'content-security-policy');
  if (!header) throw new Error('vercel.json: brak Content-Security-Policy dla /(.*)');
  return header.value;
}

function directives(csp: string): Map<string, string[]> {
  return new Map(
    csp
      .split(';')
      .map((d) => d.trim().split(/\s+/))
      .filter((parts) => parts[0])
      .map(([name = '', ...values]) => [name, values]),
  );
}

const CSP = cspFromVercelJson();
const PAGES = [
  { name: 'strona główna', path: '/', status: 200 },
  { name: '404', path: '/nie-ma-takiej-strony/', status: 404 },
];

/**
 * Wykonywalne skrypty inline (bez bloków danych, np. JSON-LD), style inline i atrybuty `style=""`
 * z dokumentu HTML: każdy z nich wymagałby hasha albo 'unsafe-inline' w CSP.
 */
function inlineBlocks(html: string): string[] {
  const blocks: string[] = [];
  for (const [, tag, attrs, body] of html.matchAll(/<(script|style)(\s[^>]*)?>([\s\S]*?)<\/\1>/g)) {
    if (/\ssrc=/.test(attrs ?? '')) continue;
    const type = /\stype="([^"]*)"/.exec(attrs ?? '')?.[1];
    if (tag === 'script' && type && !['module', 'text/javascript'].includes(type)) continue;
    blocks.push(`<${tag}> ${(body ?? '').slice(0, 80)}`);
  }
  for (const [attr] of html.matchAll(/\sstyle="[^"]*"/g)) blocks.push(attr.trim());
  return blocks;
}

/** Dokleja CSP do dokumentów HTML i zbiera naruszenia (zdarzenia i konsola). */
async function withCsp(page: Page): Promise<{ violations: string[]; consoleErrors: string[] }> {
  const violations: string[] = [];
  const consoleErrors: string[] = [];
  await page.exposeFunction('__cspViolation', (msg: string) => violations.push(msg));
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (e) => {
      (window as unknown as { __cspViolation: (m: string) => void }).__cspViolation(
        `${e.violatedDirective} ${e.blockedURI}`,
      );
    });
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error' && /content security policy|refused to/i.test(msg.text())) {
      consoleErrors.push(msg.text());
    }
  });
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const response = await route.fetch();
    await route.fulfill({
      response,
      headers: { ...response.headers(), 'content-security-policy': CSP },
    });
  });
  return { violations, consoleErrors };
}

test.describe('Content-Security-Policy', () => {
  test('vercel.json: dyrektywy z architektury', () => {
    const d = directives(CSP);
    expect(d.get('default-src')).toEqual(["'self'"]);
    expect(d.get('img-src')).toEqual(["'self'", 'data:']);
    expect(d.get('font-src')).toEqual(["'self'"]);
    expect(d.get('connect-src')).toEqual(["'self'"]);
    expect(d.get('frame-ancestors')).toEqual(["'none'"]);
    expect(d.get('base-uri')).toEqual(["'self'"]);
    expect(d.get('form-action')).toEqual(["'self'"]);
    // Bez hashy i 'unsafe-inline': Astro nie inline'uje stylów ani skryptów (astro.config.mjs).
    expect(d.get('script-src')).toEqual(["'self'"]);
    expect(d.get('style-src')).toEqual(["'self'"]);
  });

  for (const { name, path, status } of PAGES) {
    test(`${name}: brak skryptów i stylów inline w HTML`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(status);
      expect(inlineBlocks(await res.text()), 'inline w HTML (sprawdź astro.config.mjs)').toEqual(
        [],
      );
    });

    test(`${name}: brak naruszeń CSP w przeglądarce`, async ({ page }) => {
      const { violations, consoleErrors } = await withCsp(page);
      const res = await page.goto(path);
      expect(res?.status()).toBe(status);
      expect(res?.headers()['content-security-policy']).toBe(CSP);
      await page.waitForLoadState('networkidle');
      expect(violations, 'naruszenia CSP').toEqual([]);
      expect(consoleErrors, 'błędy CSP w konsoli').toEqual([]);

      // Kontrola, że polityka jest egzekwowana: obcy skrypt inline zostaje zablokowany.
      const blocked = await page.evaluate(
        () =>
          new Promise<string>((resolve) => {
            document.addEventListener(
              'securitypolicyviolation',
              (e) => resolve(e.violatedDirective),
              {
                once: true,
              },
            );
            const s = document.createElement('script');
            s.textContent = 'window.__cspProbe = 1;';
            document.head.append(s);
          }),
      );
      expect(blocked).toMatch(/^script-src/);
      expect(await page.evaluate(() => 'cspProbe' in window || '__cspProbe' in window)).toBe(false);
    });
  }

  test('strona główna: skrypt formularza z /_astro/ działa pod CSP', async ({ page }) => {
    await withCsp(page);
    await page.goto('/');
    await expect(page.locator('form[data-contact-form]')).toBeVisible();
  });
});
