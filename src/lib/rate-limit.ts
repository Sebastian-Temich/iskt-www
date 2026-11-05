import type { EnvSource, ServerEnv } from './env';
import { EnvError } from './env';

/**
 * Rate limit formularza (W-05, ADR-003): 5 zgłoszeń z jednego IP w 10 minut, potem 429.
 *
 * - `waf` (domyślnie): limit robi reguła Vercel Firewall przed funkcją; w kodzie `noop`.
 * - `upstash` (fallback): `@upstash/ratelimit`, okno przesuwne 5/600 s, klucz = SHA-256(IP + sól);
 *   surowe IP nie opuszcza funkcji, a klucz żyje w Redis tylko przez długość okna.
 * - `memory`: licznik w pamięci instancji, wyłącznie do testów (nie spełnia W-05 przy wielu
 *   instancjach), dlatego odrzucany przy `PUBLIC_SITE_ENV=production`.
 */

export const RATE_LIMIT = { limit: 5, windowSeconds: 600 } as const;

export interface RateLimitResult {
  ok: boolean;
}

export interface RateLimiter {
  check(ip: string): Promise<RateLimitResult>;
}

export function createNoopRateLimiter(): RateLimiter {
  return { check: async () => ({ ok: true }) };
}

/** Okno przesuwne w pamięci; `now` w milisekundach (wstrzykiwane w testach). */
export function createMemoryRateLimiter(
  options: { limit?: number; windowMs?: number; now?: () => number } = {},
): RateLimiter {
  const {
    limit = RATE_LIMIT.limit,
    windowMs = RATE_LIMIT.windowSeconds * 1000,
    now = Date.now,
  } = options;
  const hits = new Map<string, number[]>();
  return {
    async check(ip) {
      const time = now();
      const recent = (hits.get(ip) ?? []).filter((at) => time - at < windowMs);
      if (recent.length >= limit) {
        hits.set(ip, recent);
        return { ok: false };
      }
      recent.push(time);
      hits.set(ip, recent);
      return { ok: true };
    },
  };
}

/** SHA-256(IP + sól) w hex: klucz limitu bez surowego IP (ADR-001, ADR-003). */
export async function hashIp(ip: string, salt: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${ip}${salt}`));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/** Fragment `Ratelimit` z `@upstash/ratelimit` używany przez moduł (w testach atrapa). */
export interface UpstashLimiter {
  limit(identifier: string): Promise<{ success: boolean }>;
}

export function createUpstashRateLimiter(options: {
  salt: string;
  limiter: () => Promise<UpstashLimiter>;
}): RateLimiter {
  let limiter: UpstashLimiter | undefined;
  return {
    async check(ip) {
      limiter ??= await options.limiter();
      const { success } = await limiter.limit(await hashIp(ip, options.salt));
      return { ok: success };
    },
  };
}

/** Prawdziwy limiter Upstash, ładowany dopiero przy pierwszym żądaniu. */
async function loadUpstashLimiter(url: string, token: string): Promise<UpstashLimiter> {
  const [{ Ratelimit }, { Redis }] = await Promise.all([
    import('@upstash/ratelimit'),
    import('@upstash/redis'),
  ]);
  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(RATE_LIMIT.limit, `${RATE_LIMIT.windowSeconds} s`),
    prefix: 'iskt-www:contact',
  });
}

/**
 * Limiter z konfiguracji. Zmienne Upstash (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`)
 * sprawdzamy tu, bo są potrzebne tylko przy `RATE_LIMIT_PROVIDER=upstash`.
 */
export function createRateLimiter(env: ServerEnv, source: EnvSource): RateLimiter {
  switch (env.rateLimitProvider) {
    case 'waf':
      return createNoopRateLimiter();
    case 'memory':
      if (env.siteEnv === 'production') throw new EnvError(['RATE_LIMIT_PROVIDER']);
      return createMemoryRateLimiter();
    case 'upstash': {
      const url = source.UPSTASH_REDIS_REST_URL?.trim();
      const token = source.UPSTASH_REDIS_REST_TOKEN?.trim();
      const missing = [
        ...(url ? [] : ['UPSTASH_REDIS_REST_URL']),
        ...(token ? [] : ['UPSTASH_REDIS_REST_TOKEN']),
      ];
      if (!url || !token || !env.rateLimitSalt) throw new EnvError(missing);
      return createUpstashRateLimiter({
        salt: env.rateLimitSalt,
        limiter: () => loadUpstashLimiter(url, token),
      });
    }
  }
}
