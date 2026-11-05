import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { runtimeEnv } from '../runtime-env';

// Regresja: wtyczka env Astro wkleja do paczki funkcji wartości z plików env dla kluczy prywatnych,
// których nazwy występują w module z odwołaniem do całego obiektu zmiennych Vite (runtime-env.ts).
const PRIVATE = [
  'RESEND_API_KEY',
  'CONTACT_TO',
  'CONTACT_FROM',
  'MAIL_TRANSPORT',
  'RATE_LIMIT_PROVIDER',
  'RATE_LIMIT_SALT',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
];

const read = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf-8');

describe('runtime-env: sekrety poza paczką funkcji', () => {
  it('runtime-env.ts nie zawiera nazw zmiennych prywatnych', () => {
    const source = read('runtime-env.ts');
    for (const name of PRIVATE) expect(source, name).not.toContain(name);
  });

  it('moduły z nazwami zmiennych prywatnych nie odwołują się do import.meta.env', () => {
    for (const file of ['env.ts', 'mailer.ts', 'rate-limit.ts', '../pages/api/contact.ts']) {
      expect(read(file), file).not.toMatch(/import\.meta\.env/);
    }
  });

  it('process.env ma pierwszeństwo', () => {
    process.env.ISKT_TEST_RUNTIME_ENV = 'z-procesu';
    try {
      expect(runtimeEnv().ISKT_TEST_RUNTIME_ENV).toBe('z-procesu');
    } finally {
      delete process.env.ISKT_TEST_RUNTIME_ENV;
    }
  });
});
