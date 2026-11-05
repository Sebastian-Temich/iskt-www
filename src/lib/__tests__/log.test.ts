import { describe, expect, it } from 'vitest';
import { createContactHandler } from '../../pages/api/contact';
import { createLogger, type LogEntry } from '../log';
import { createMockMailer, type Mailer } from '../mailer';
import { createMemoryRateLimiter, type RateLimiter } from '../rate-limit';

const SITE = 'https://iskt-www.vercel.app';
const IP = '203.0.113.77';
const PII = {
  name: 'Zofia Unikalnanazwisko',
  email: 'zofia.unikalna@firma-testowa.pl',
  message: 'Treść-wiadomości-XYZ-123 z danymi wrażliwymi',
};

function request(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request(`${SITE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: SITE, ...headers },
    body: JSON.stringify(body),
  });
}

/** Uruchamia handler z prawdziwym loggerem i zwraca wszystkie zapisane linie. */
async function linesFor(
  requests: Request[],
  {
    mailer,
    rateLimiter,
  }: { mailer?: (log: ReturnType<typeof createLogger>) => Mailer; rateLimiter?: RateLimiter } = {},
): Promise<string[]> {
  const lines: string[] = [];
  const log = createLogger((line) => lines.push(line));
  const handle = createContactHandler({
    env: { siteUrl: SITE },
    mailer: mailer ? mailer(log) : createMockMailer(log),
    rateLimiter: rateLimiter ?? createMemoryRateLimiter(),
    log,
  });
  for (const req of requests) await handle(req, () => IP);
  return lines;
}

function expectNoPii(lines: string[]) {
  expect(lines.length).toBeGreaterThan(0);
  for (const line of lines) {
    for (const value of [PII.name, PII.email, PII.message, IP, 'Zofia', 'zofia', 'XYZ-123']) {
      expect(line).not.toContain(value);
    }
    const entry = JSON.parse(line) as Record<string, unknown>;
    for (const key of Object.keys(entry)) {
      expect(['event', 'status', 'code', 'requestId']).toContain(key);
    }
  }
}

describe('createLogger', () => {
  it('zapisuje wyłącznie event, status, code i requestId', () => {
    const lines: string[] = [];
    const log = createLogger((line) => lines.push(line));
    const entry = { event: 'e', status: 200, code: 'c', requestId: 'r', ...PII, ip: IP };
    log(entry as LogEntry);
    log({ event: 'e', status: 200, requestId: 'r' });
    expect(lines.map((line) => JSON.parse(line))).toEqual([
      { event: 'e', status: 200, code: 'c', requestId: 'r' },
      { event: 'e', status: 200, requestId: 'r' },
    ]);
  });
});

describe('logi endpointu bez PII (W-06)', () => {
  it('ścieżka sukcesu (wysyłka mock)', async () => {
    const lines = await linesFor([request({ ...PII, website: '' })]);
    expect(lines.map((line) => JSON.parse(line).event)).toEqual(['mail_mock', 'contact_sent']);
    expectNoPii(lines);
  });

  it('błąd walidacji, honeypot, zły Origin, typ, rozmiar', async () => {
    const lines = await linesFor([
      request({ ...PII, email: `${PII.email}\r\nBcc: x@y.pl` }),
      request({ ...PII, website: PII.message }),
      request(PII, { Origin: `https://${PII.name}.example` }),
      request(PII, { 'Content-Type': 'text/plain' }),
      request({ ...PII, message: PII.message.repeat(2000) }),
    ]);
    expect(lines).toHaveLength(5);
    expectNoPii(lines);
  });

  it('błąd wysyłki (502) i rate limit (429)', async () => {
    const failing: Mailer = { send: async () => ({ ok: false, code: 'provider_error' }) };
    const lines = await linesFor(
      Array.from({ length: 6 }, () => request(PII)),
      { mailer: () => failing },
    );
    const statuses = lines.map((line) => JSON.parse(line).status);
    expect(statuses).toEqual([502, 502, 502, 502, 502, 429]);
    expectNoPii(lines);
  });

  it('awaria limitera', async () => {
    const lines = await linesFor([request(PII)], {
      rateLimiter: { check: async () => Promise.reject(new Error(`redis ${IP}`)) },
    });
    expectNoPii(lines);
  });
});
