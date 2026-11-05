import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// Tokeny z design systemu muszą być w src/styles/tokens/ 1:1 (architektura, „Design”).
const DS = new URL(
  '../../docs/02-design/zrodla/Strona firmowa ISKT/_ds/iskt-greenovation-design-system-1705b29f-a657-4ea0-8548-faa4bf02a1b4/tokens/',
  import.meta.url,
);
const SRC = new URL('./tokens/', import.meta.url);

function read(base: URL, file: string): string {
  return readFileSync(fileURLToPath(new URL(file, base)), 'utf8');
}

/** Deklaracje `--nazwa: wartość` z pierwszego bloku `:root`, z normalizacją zapisu. */
function tokens(css: string): Map<string, string> {
  const root = css.replace(/\/\*[\s\S]*?\*\//g, '').match(/:root\s*\{([\s\S]*?)\n\}/);
  const result = new Map<string, string>();
  for (const [, name, value] of (root?.[1] ?? '').matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    if (name && value) result.set(name, normalize(value));
  }
  return result;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s*,\s*/g, ',')
    .replace(/(^|[\s,(])0\.(\d)/g, '$1.$2')
    .replace(/(\.\d*?)0+(?=[\s,)]|$)/g, '$1')
    .trim();
}

const FILES = ['colors.css', 'typography.css', 'spacing.css', 'effects.css'] as const;

describe('tokeny designu 1:1', () => {
  for (const file of FILES) {
    it(`${file}: każdy token z DS ma tę samą wartość`, () => {
      const expected = tokens(read(DS, file));
      const actual = tokens(read(SRC, file));
      expect(expected.size).toBeGreaterThan(5);
      for (const [name, value] of expected) {
        expect(actual.get(name), name).toBe(value);
      }
    });
  }

  it('tokeny pomocnicze --x-* z architektury', () => {
    const all = new Map(FILES.flatMap((file) => [...tokens(read(SRC, file))]));
    expect(Object.fromEntries([...all].filter(([name]) => name.startsWith('--x-')))).toEqual({
      '--x-glow-1': 'rgba(84,132,29,.16)',
      '--x-glow-2': 'rgba(84,132,29,.2)',
      '--x-glow-3': 'rgba(213,235,172,.22)',
      '--x-dark-card-bg': 'rgba(255,255,255,.04)',
      '--x-dark-card-border': 'rgba(255,255,255,.1)',
      '--x-h1-home': 'clamp(2.2rem,5vw,3.6rem)',
      '--x-h1-home-lh': '1.04',
      '--x-h1-service': 'clamp(2.2rem,5.2vw,3.8rem)',
      '--x-h1-service-lh': '1.02',
      '--x-h1-br': 'clamp(2rem,4.4vw,3.2rem)',
      '--x-h1-br-lh': '1.06',
      '--x-h2-cta': 'clamp(1.8rem,3.6vw,2.6rem)',
      '--x-container-narrow': '900px',
      '--x-container-faq': '860px',
    });
  });

  it('global.css zawiera reset z DS/tokens/base.css', () => {
    const squash = (css: string) =>
      css
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, '')
        .toLowerCase();
    const base = squash(read(DS, 'base.css'));
    const global = squash(read(new URL('../', SRC), 'global.css'));
    for (const rule of base.split('}').filter(Boolean)) {
      const [selector, body] = rule.split('{') as [string, string];
      const declarations = body.split(';').filter(Boolean);
      const match = global.match(
        new RegExp(`(?:^|[};])${selector.replace(/[.*+?^${}()|[\]\\:]/g, '\\$&')}\\{([^}]*)\\}`),
      );
      expect(match, selector).not.toBeNull();
      for (const declaration of declarations) {
        expect(match?.[1], `${selector} ${declaration}`).toContain(declaration);
      }
    }
  });
});
