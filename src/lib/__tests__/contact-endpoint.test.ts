import { describe, expect, it, vi } from 'vitest';
import { createContactHandler, MAX_BODY_BYTES, type ContactDeps } from '../../pages/api/contact';
import { CONTACT_LIMITS, type ContactData } from '../contact-schema';
import type { LogEntry } from '../log';
import type { Mailer, SendResult } from '../mailer';
import { createMemoryRateLimiter, createNoopRateLimiter } from '../rate-limit';

const SITE = 'https://iskt-www.vercel.app';
const URL_API = `${SITE}/api/contact`;
const FOUR_BYTE = '😀';

const valid = {
  name: 'Jan Kowalski',
  email: 'jan@firma.pl',
  message: 'Dzień dobry, proszę o kontakt.',
  website: '',
};

function setup(overrides: Partial<ContactDeps> & { result?: SendResult } = {}) {
  const logs: LogEntry[] = [];
  const send = vi.fn<Mailer['send']>(async () => overrides.result ?? { ok: true });
  const handle = createContactHandler({
    env: { siteUrl: SITE },
    mailer: { send },
    rateLimiter: createNoopRateLimiter(),
    log: (entry) => logs.push(entry),
    requestId: () => 'req-1',
    ...overrides,
  });
  return { handle, send, logs };
}

function post(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request(URL_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: SITE, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const ip = () => '203.0.113.7';

async function call(handle: ReturnType<typeof setup>['handle'], request: Request) {
  const response = await handle(request, ip);
  return { status: response.status, body: await response.json(), headers: response.headers };
}

describe('POST /api/contact: 200', () => {
  it('poprawne zgłoszenie → wysyłka i {ok:true}', async () => {
    const { handle, send } = setup();
    const res = await call(handle, post(valid));
    expect(res).toMatchObject({ status: 200, body: { ok: true } });
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(send).toHaveBeenCalledOnce();
    const [data, context] = send.mock.calls[0] ?? [];
    expect(data).toEqual<ContactData>({
      name: valid.name,
      email: valid.email,
      message: valid.message,
    });
    expect(context).toEqual({ requestId: 'req-1' });
  });

  it('JSON z maksymalnymi długościami ze znaków 4-bajtowych → 200', async () => {
    const { handle, send } = setup();
    const email = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(58)}.pl`;
    expect(email.length).toBe(CONTACT_LIMITS.email);
    const body = JSON.stringify({
      name: FOUR_BYTE.repeat(CONTACT_LIMITS.name),
      email,
      message: FOUR_BYTE.repeat(CONTACT_LIMITS.message),
      website: '',
    });
    const bytes = new TextEncoder().encode(body).byteLength;
    expect(bytes).toBeGreaterThan(20_000);
    expect(bytes).toBeLessThanOrEqual(MAX_BODY_BYTES);
    const res = await call(handle, post(body));
    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledOnce();
  });

  it('Content-Type z charset=utf-8 jest akceptowany', async () => {
    const { handle } = setup();
    const res = await call(
      handle,
      post(valid, { 'Content-Type': 'application/json; charset=UTF-8' }),
    );
    expect(res.status).toBe(200);
  });

  it('honeypot wypełniony → 200 bez wysyłki', async () => {
    const { handle, send, logs } = setup();
    const res = await call(handle, post({ ...valid, website: 'https://spam.example' }));
    expect(res).toMatchObject({ status: 200, body: { ok: true } });
    expect(send).not.toHaveBeenCalled();
    expect(logs).toEqual([
      { event: 'contact_honeypot', status: 200, code: 'honeypot', requestId: 'req-1' },
    ]);
  });

  it('honeypot wypełniony przy błędnych polach też → 200 bez wysyłki', async () => {
    const { handle, send } = setup();
    const res = await call(handle, post({ website: 'x' }));
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });
});

describe('POST /api/contact: 400', () => {
  it('niepoprawne pola → 400 z komunikatami i bez wysyłki', async () => {
    const { handle, send } = setup();
    const res = await call(handle, post({ ...valid, name: '', email: 'zly' }));
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('invalid');
    expect(Object.keys(res.body.fields).sort()).toEqual(['email', 'name']);
    expect(send).not.toHaveBeenCalled();
  });

  it('za długa wiadomość i CR/LF w imieniu → 400', async () => {
    const { handle, send } = setup();
    const res = await call(
      handle,
      post({ ...valid, name: 'Jan\r\nBcc: x@y.pl', message: 'a'.repeat(5001) }),
    );
    expect(res.status).toBe(400);
    expect(Object.keys(res.body.fields).sort()).toEqual(['message', 'name']);
    expect(send).not.toHaveBeenCalled();
  });

  it('niepoprawny JSON → 400', async () => {
    const { handle, send } = setup();
    const res = await call(handle, post('{"name":'));
    expect(res).toMatchObject({ status: 400, body: { error: 'invalid', fields: {} } });
    expect(send).not.toHaveBeenCalled();
  });

  it('ciało niebędące UTF-8 → 400', async () => {
    const { handle } = setup();
    const request = new Request(URL_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: SITE },
      body: new Uint8Array([0x7b, 0xff, 0xfe, 0x7d]),
    });
    expect((await call(handle, request)).status).toBe(400);
  });
});

describe('POST /api/contact: metoda, Origin, typ i rozmiar', () => {
  it.each(['GET', 'PUT', 'DELETE', 'PATCH'])('%s → 405 z nagłówkiem Allow', async (method) => {
    const { handle, send } = setup();
    const res = await call(handle, new Request(URL_API, { method, headers: { Origin: SITE } }));
    expect(res).toMatchObject({ status: 405, body: { error: 'method_not_allowed' } });
    expect(res.headers.get('allow')).toBe('POST');
    expect(send).not.toHaveBeenCalled();
  });

  it.each([
    ['obcy Origin', { Origin: 'https://evil.example' }],
    ['Origin z innym portem', { Origin: `${SITE}:8443` }],
    ['brak Origin', { Origin: '' }],
  ])('%s → 403 bez wysyłki', async (_label, headers) => {
    const { handle, send } = setup();
    const res = await call(handle, post(valid, headers));
    expect(res).toMatchObject({ status: 403, body: { error: 'forbidden' } });
    expect(send).not.toHaveBeenCalled();
  });

  it.each([
    'application/x-www-form-urlencoded',
    'multipart/form-data; boundary=x',
    'text/plain',
    'application/json; charset=iso-8859-2',
  ])('Content-Type %s → 415', async (type) => {
    const { handle, send } = setup();
    const res = await call(handle, post(valid, { 'Content-Type': type }));
    expect(res).toMatchObject({ status: 415, body: { error: 'unsupported_media_type' } });
    expect(send).not.toHaveBeenCalled();
  });

  it('brak Content-Type → 415', async () => {
    const { handle } = setup();
    const request = new Request(URL_API, {
      method: 'POST',
      headers: { Origin: SITE },
      body: new Blob([JSON.stringify(valid)]),
    });
    expect((await call(handle, request)).status).toBe(415);
  });

  it('ciało > 32 kB → 413 bez wysyłki', async () => {
    const { handle, send } = setup();
    const body = JSON.stringify({ ...valid, message: 'a'.repeat(MAX_BODY_BYTES) });
    const res = await call(handle, post(body));
    expect(res).toMatchObject({ status: 413, body: { error: 'payload_too_large' } });
    expect(send).not.toHaveBeenCalled();
  });

  it('zadeklarowany Content-Length > 32 kB → 413 bez czytania ciała', async () => {
    const { handle } = setup();
    const res = await call(handle, post(valid, { 'Content-Length': String(MAX_BODY_BYTES + 1) }));
    expect(res.status).toBe(413);
  });

  it('ciało dokładnie 32 kB nie jest odrzucane rozmiarem', async () => {
    const { handle } = setup();
    const filler = MAX_BODY_BYTES - JSON.stringify({ ...valid, message: '' }).length;
    const body = JSON.stringify({ ...valid, message: 'a'.repeat(filler) });
    expect(body.length).toBe(MAX_BODY_BYTES);
    // Wiadomość jest za długa (400), ale nie przekracza limitu ciała (413).
    expect((await call(handle, post(body))).status).toBe(400);
  });
});

describe('POST /api/contact: 429 i 502', () => {
  it('6. zgłoszenie z jednego IP w oknie → 429 bez wysyłki', async () => {
    const { handle, send } = setup({ rateLimiter: createMemoryRateLimiter() });
    for (let i = 0; i < 5; i += 1) expect((await call(handle, post(valid))).status).toBe(200);
    const res = await call(handle, post(valid));
    expect(res).toMatchObject({ status: 429, body: { error: 'rate_limited' } });
    expect(send).toHaveBeenCalledTimes(5);
  });

  it('limiter dostaje IP klienta', async () => {
    const check = vi.fn(async () => ({ ok: true }));
    const { handle } = setup({ rateLimiter: { check } });
    await call(handle, post(valid));
    expect(check).toHaveBeenCalledWith('203.0.113.7');
  });

  it('awaria limitera nie blokuje wysyłki (zdarzenie w logu)', async () => {
    const { handle, send, logs } = setup({
      rateLimiter: { check: async () => Promise.reject(new Error('redis down')) },
    });
    expect((await call(handle, post(valid))).status).toBe(200);
    expect(send).toHaveBeenCalledOnce();
    expect(logs.map((entry) => entry.code)).toContain('rate_limit_unavailable');
  });

  it.each(['timeout', 'provider_error'] as const)('mailer zwraca %s → 502', async (code) => {
    const { handle, logs } = setup({ result: { ok: false, code } });
    const res = await call(handle, post(valid));
    expect(res).toMatchObject({ status: 502, body: { error: 'send_failed' } });
    expect(logs.at(-1)).toEqual({ event: 'contact_failed', status: 502, code, requestId: 'req-1' });
  });

  it('wyjątek mailera → 502', async () => {
    const { handle } = setup({
      mailer: { send: async () => Promise.reject(new Error('boom')) },
    });
    expect((await call(handle, post(valid))).status).toBe(502);
  });
});
