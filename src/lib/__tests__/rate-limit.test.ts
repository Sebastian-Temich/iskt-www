import { describe, expect, it, vi } from 'vitest';
import { EnvError, type ServerEnv } from '../env';
import {
  RATE_LIMIT,
  createMemoryRateLimiter,
  createNoopRateLimiter,
  createRateLimiter,
  createUpstashRateLimiter,
  hashIp,
  type UpstashLimiter,
} from '../rate-limit';

const SALT = 'sol-testowa-0123456789';

const env: ServerEnv = {
  siteEnv: 'staging',
  siteUrl: 'http://localhost:55326',
  indexable: false,
  mailTransport: 'mock',
  resendApiKey: undefined,
  contactTo: undefined,
  contactFrom: undefined,
  rateLimitProvider: 'waf',
  rateLimitSalt: undefined,
};

describe('limit z ADR-003', () => {
  it('5 zgłoszeń na 600 s', () => {
    expect(RATE_LIMIT).toEqual({ limit: 5, windowSeconds: 600 });
  });
});

describe('waf (noop)', () => {
  it('zawsze przepuszcza: limit robi Vercel Firewall', async () => {
    const limiter = createNoopRateLimiter();
    for (let i = 0; i < 20; i += 1)
      expect(await limiter.check('203.0.113.7')).toEqual({ ok: true });
  });
});

describe('memory (tylko testy)', () => {
  it('5 przechodzi, 6. w oknie → odmowa, po oknie znowu przechodzi', async () => {
    let now = 0;
    const limiter = createMemoryRateLimiter({ now: () => now });
    for (let i = 0; i < 5; i += 1) {
      expect(await limiter.check('203.0.113.7')).toEqual({ ok: true });
      now += 60_000;
    }
    expect(await limiter.check('203.0.113.7')).toEqual({ ok: false });
    // Inny adres ma własny licznik.
    expect(await limiter.check('198.51.100.1')).toEqual({ ok: true });
    // Okno przesuwne: pierwsze zgłoszenie (t=0) wypada po 600 s.
    now = 600_000;
    expect(await limiter.check('203.0.113.7')).toEqual({ ok: true });
    expect(await limiter.check('203.0.113.7')).toEqual({ ok: false });
  });
});

describe('upstash (z mockiem)', () => {
  it('klucz to SHA-256(IP + sól), bez surowego IP', async () => {
    const limit = vi.fn<UpstashLimiter['limit']>(async () => ({ success: true }));
    const limiter = createUpstashRateLimiter({ salt: SALT, limiter: async () => ({ limit }) });
    expect(await limiter.check('203.0.113.7')).toEqual({ ok: true });
    const [key] = limit.mock.calls[0] ?? [];
    expect(key).toMatch(/^[0-9a-f]{64}$/);
    expect(key).not.toContain('203.0.113.7');
    expect(key).toBe(await hashIp('203.0.113.7', SALT));
    expect(await hashIp('203.0.113.7', 'inna-sol-0123456789')).not.toBe(key);
  });

  it('odmowa z Upstash → ok:false; limiter tworzony raz', async () => {
    const factory = vi.fn(async () => ({ limit: async () => ({ success: false }) }));
    const limiter = createUpstashRateLimiter({ salt: SALT, limiter: factory });
    expect(await limiter.check('203.0.113.7')).toEqual({ ok: false });
    expect(await limiter.check('203.0.113.7')).toEqual({ ok: false });
    expect(factory).toHaveBeenCalledOnce();
  });

  it('hashIp: znany wektor SHA-256', async () => {
    // sha256("abc")
    expect(await hashIp('a', 'bc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
  });
});

describe('createRateLimiter', () => {
  it('waf → noop', async () => {
    const limiter = createRateLimiter(env, {});
    expect(await limiter.check('x')).toEqual({ ok: true });
  });

  it('memory poza produkcją działa, w produkcji jest odrzucany', async () => {
    const limiter = createRateLimiter({ ...env, rateLimitProvider: 'memory' }, {});
    for (let i = 0; i < 5; i += 1) await limiter.check('x');
    expect(await limiter.check('x')).toEqual({ ok: false });
    expect(() =>
      createRateLimiter(
        { ...env, siteEnv: 'production', indexable: true, rateLimitProvider: 'memory' },
        {},
      ),
    ).toThrow(EnvError);
  });

  it('upstash wymaga adresu i tokenu REST (błąd z nazwami zmiennych)', () => {
    const upstash = { ...env, rateLimitProvider: 'upstash' as const, rateLimitSalt: SALT };
    try {
      createRateLimiter(upstash, {});
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(EnvError);
      expect((error as EnvError).variables).toEqual([
        'UPSTASH_REDIS_REST_URL',
        'UPSTASH_REDIS_REST_TOKEN',
      ]);
    }
    expect(
      createRateLimiter(upstash, {
        UPSTASH_REDIS_REST_URL: 'https://example.upstash.io',
        UPSTASH_REDIS_REST_TOKEN: 'token-testowy',
      }),
    ).toHaveProperty('check');
  });
});
