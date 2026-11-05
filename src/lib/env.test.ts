import { describe, expect, it } from 'vitest';
import { EnvError, LOCAL_SITE_URL, parsePublicEnv, parseServerEnv, type EnvSource } from './env';

const resendOk: EnvSource = {
  PUBLIC_SITE_ENV: 'staging',
  PUBLIC_SITE_URL: 'https://iskt-www.vercel.app',
  RESEND_API_KEY: 're_test_dummy',
  CONTACT_TO: 'odbiorca@example.com',
  CONTACT_FROM: 'ISKT <onboarding@resend.dev>',
};

function variablesOf(fn: () => unknown): readonly string[] {
  try {
    fn();
  } catch (error) {
    if (error instanceof EnvError) return error.variables;
    throw error;
  }
  throw new Error('oczekiwano EnvError');
}

describe('parsePublicEnv: wartości domyślne (decyzja 2026-11-05)', () => {
  it('bez zmiennych: staging, noindex, adres lokalny', () => {
    expect(parsePublicEnv({})).toEqual({
      siteEnv: 'staging',
      siteUrl: LOCAL_SITE_URL,
      indexable: false,
    });
  });

  it('puste wartości traktuje jak brak zmiennej', () => {
    expect(parsePublicEnv({ PUBLIC_SITE_ENV: '', PUBLIC_SITE_URL: ' ' })).toMatchObject({
      siteEnv: 'staging',
      siteUrl: LOCAL_SITE_URL,
    });
  });

  it('bez PUBLIC_SITE_URL na Vercel: https://VERCEL_PROJECT_PRODUCTION_URL', () => {
    const env = parsePublicEnv({ VERCEL_PROJECT_PRODUCTION_URL: 'iskt-www.vercel.app' });
    expect(env.siteUrl).toBe('https://iskt-www.vercel.app');
    expect(env.indexable).toBe(false);
  });

  it('jawne PUBLIC_SITE_URL ma pierwszeństwo i traci końcowy ukośnik', () => {
    const env = parsePublicEnv({
      PUBLIC_SITE_URL: 'https://iskt.pl/',
      VERCEL_PROJECT_PRODUCTION_URL: 'iskt-www.vercel.app',
    });
    expect(env.siteUrl).toBe('https://iskt.pl');
  });
});

describe('parsePublicEnv: indeksowanie', () => {
  it('indeksowanie tylko przy jawnym production', () => {
    expect(parsePublicEnv({ PUBLIC_SITE_ENV: 'production' }).indexable).toBe(true);
    expect(parsePublicEnv({ PUBLIC_SITE_ENV: 'staging' }).indexable).toBe(false);
    expect(parsePublicEnv({ PUBLIC_SITE_ENV: 'development' }).indexable).toBe(false);
  });

  it('odrzuca nieznane środowisko i adres bez http(s)', () => {
    expect(variablesOf(() => parsePublicEnv({ PUBLIC_SITE_ENV: 'prod' }))).toEqual([
      'PUBLIC_SITE_ENV',
    ]);
    expect(variablesOf(() => parsePublicEnv({ PUBLIC_SITE_URL: 'ftp://iskt.pl' }))).toEqual([
      'PUBLIC_SITE_URL',
    ]);
    expect(variablesOf(() => parsePublicEnv({ PUBLIC_SITE_URL: 'nie-adres' }))).toEqual([
      'PUBLIC_SITE_URL',
    ]);
  });
});

describe('parseServerEnv', () => {
  it('poprawna konfiguracja Resend: domyślnie transport resend i rate limit waf', () => {
    expect(parseServerEnv(resendOk)).toMatchObject({
      mailTransport: 'resend',
      contactTo: 'odbiorca@example.com',
      contactFrom: 'ISKT <onboarding@resend.dev>',
      rateLimitProvider: 'waf',
      rateLimitSalt: undefined,
    });
  });

  it('transport resend wymaga klucza i poprawnych adresów', () => {
    expect(variablesOf(() => parseServerEnv({}))).toEqual([
      'RESEND_API_KEY',
      'CONTACT_TO',
      'CONTACT_FROM',
    ]);
    expect(
      variablesOf(() =>
        parseServerEnv({ ...resendOk, CONTACT_TO: 'brak-malpy', CONTACT_FROM: 'a\r\nb' }),
      ),
    ).toEqual(['CONTACT_TO', 'CONTACT_FROM']);
  });

  it('transport mock nie wymaga sekretów Resend', () => {
    expect(parseServerEnv({ MAIL_TRANSPORT: 'mock' })).toMatchObject({
      mailTransport: 'mock',
      resendApiKey: undefined,
    });
  });

  it('odrzuca nieznany transport i dostawcę rate limitu', () => {
    expect(
      variablesOf(() => parseServerEnv({ MAIL_TRANSPORT: 'smtp', RATE_LIMIT_PROVIDER: 'redis' })),
    ).toEqual(['MAIL_TRANSPORT', 'RATE_LIMIT_PROVIDER']);
  });

  it('upstash wymaga soli min. 16 znaków', () => {
    const base = { ...resendOk, RATE_LIMIT_PROVIDER: 'upstash' };
    expect(variablesOf(() => parseServerEnv(base))).toEqual(['RATE_LIMIT_SALT']);
    expect(variablesOf(() => parseServerEnv({ ...base, RATE_LIMIT_SALT: 'krotka' }))).toEqual([
      'RATE_LIMIT_SALT',
    ]);
    expect(
      parseServerEnv({ ...base, RATE_LIMIT_SALT: 'sol-testowa-0123456789' }).rateLimitProvider,
    ).toBe('upstash');
  });

  it('komunikat błędu nie zawiera wartości zmiennych', () => {
    const secret = 're_test_tajna_wartosc';
    try {
      parseServerEnv({ RESEND_API_KEY: secret, CONTACT_TO: 'zly' });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(EnvError);
      expect(String((error as Error).message)).not.toContain(secret);
      expect(String((error as Error).message)).not.toContain('zly');
    }
  });

  it('błędy zmiennych publicznych są zgłaszane razem z serwerowymi', () => {
    expect(
      variablesOf(() => parseServerEnv({ PUBLIC_SITE_ENV: 'x', MAIL_TRANSPORT: 'mock' })),
    ).toEqual(['PUBLIC_SITE_ENV']);
  });
});
