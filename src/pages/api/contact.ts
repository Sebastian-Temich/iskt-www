import type { APIRoute } from 'astro';
import { isHoneypotFilled, validateContact } from '../../lib/contact-schema';
import { parseServerEnv, runtimeEnv, type ServerEnv } from '../../lib/env';
import { createLogger, type Logger } from '../../lib/log';
import { createMailer, type Mailer } from '../../lib/mailer';
import { createRateLimiter, type RateLimiter } from '../../lib/rate-limit';

/**
 * `POST /api/contact` (W-04, W-05, W-06; ADR-003, ADR-004; architektura, „Model danych”).
 * Jedyny kod serwerowy serwisu. Kolejność sprawdzeń: metoda (405), `Origin` (403), typ treści (415),
 * rate limit (429), rozmiar ciała (413), JSON i walidacja (400), honeypot (200 bez wysyłki),
 * wysyłka (200 albo 502). Logi tylko przez `lib/log.ts`, bez danych osobowych i IP.
 */
export const prerender = false;

export const MAX_BODY_BYTES = 32 * 1024;

export interface ContactDeps {
  env: Pick<ServerEnv, 'siteUrl'>;
  mailer: Mailer;
  rateLimiter: RateLimiter;
  log: Logger;
  requestId?: () => string;
}

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...JSON_HEADERS, ...headers } });
}

function isJsonContentType(value: string | null): boolean {
  if (!value) return false;
  const [type, ...params] = value.split(';').map((part) => part.trim().toLowerCase());
  if (type !== 'application/json') return false;
  const charset = params.find((param) => param.startsWith('charset='));
  return !charset || charset === 'charset=utf-8';
}

class BodyTooLarge extends Error {}

/** Czyta ciało do `limit` bajtów; większe przerywa bez czytania reszty. */
async function readBody(request: Request, limit: number): Promise<string> {
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > limit) throw new BodyTooLarge();
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      throw new BodyTooLarge();
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export function createContactHandler(deps: ContactDeps) {
  const newRequestId = deps.requestId ?? (() => crypto.randomUUID());

  return async function handle(request: Request, clientIp: () => string): Promise<Response> {
    const requestId = newRequestId();
    const done = (status: number, event: string, body: unknown, code?: string) => {
      deps.log({ event, status, code, requestId });
      return json(status, body, status === 405 ? { Allow: 'POST' } : {});
    };

    if (request.method !== 'POST') {
      return done(405, 'contact_rejected', { error: 'method_not_allowed' }, 'method');
    }
    if (request.headers.get('origin') !== deps.env.siteUrl) {
      return done(403, 'contact_rejected', { error: 'forbidden' }, 'origin');
    }
    if (!isJsonContentType(request.headers.get('content-type'))) {
      return done(415, 'contact_rejected', { error: 'unsupported_media_type' }, 'content_type');
    }

    try {
      const limit = await deps.rateLimiter.check(clientIp());
      if (!limit.ok)
        return done(429, 'contact_rejected', { error: 'rate_limited' }, 'rate_limited');
    } catch {
      // Awaria magazynu limitu nie blokuje formularza (W-04 ma pierwszeństwo); zdarzenie w logu.
      deps.log({ event: 'rate_limit_error', status: 0, code: 'rate_limit_unavailable', requestId });
    }

    let raw: string;
    try {
      raw = await readBody(request, MAX_BODY_BYTES);
    } catch (error) {
      if (error instanceof BodyTooLarge) {
        return done(413, 'contact_rejected', { error: 'payload_too_large' }, 'body_size');
      }
      return done(400, 'contact_invalid', { error: 'invalid', fields: {} }, 'encoding');
    }

    let input: unknown;
    try {
      input = JSON.parse(raw);
    } catch {
      return done(400, 'contact_invalid', { error: 'invalid', fields: {} }, 'json');
    }

    if (isHoneypotFilled(input)) {
      return done(200, 'contact_honeypot', { ok: true }, 'honeypot');
    }

    const validation = validateContact(input);
    if (!validation.ok) {
      return done(
        400,
        'contact_invalid',
        { error: 'invalid', fields: validation.fields },
        'fields',
      );
    }

    let sent;
    try {
      sent = await deps.mailer.send(validation.data, { requestId });
    } catch {
      sent = { ok: false as const, code: 'provider_error' as const };
    }
    if (!sent.ok) return done(502, 'contact_failed', { error: 'send_failed' }, sent.code);
    return done(200, 'contact_sent', { ok: true });
  };
}

type Handler = ReturnType<typeof createContactHandler>;
let handler: Handler | undefined;
const log = createLogger();

/** Zmienne walidowane przy pierwszym żądaniu instancji funkcji (architektura, „Sekrety”). */
function getHandler(): Handler {
  if (!handler) {
    const source = runtimeEnv();
    const env = parseServerEnv(source);
    handler = createContactHandler({
      env,
      mailer: createMailer(env, log),
      rateLimiter: createRateLimiter(env, source),
      log,
    });
  }
  return handler;
}

const route: APIRoute = async (context) => {
  let handle: Handler;
  try {
    handle = getHandler();
  } catch (error) {
    // Nazwy zmiennych (bez wartości) z EnvError trafiają tylko do kodu zdarzenia.
    const code = error instanceof Error && error.name === 'EnvError' ? 'config' : 'init';
    log({ event: 'contact_config_error', status: 500, code, requestId: crypto.randomUUID() });
    return json(500, { error: 'server_error' });
  }
  return handle(context.request, () => {
    try {
      return context.clientAddress;
    } catch {
      return 'unknown';
    }
  });
};

export const POST = route;
export const ALL = route;
