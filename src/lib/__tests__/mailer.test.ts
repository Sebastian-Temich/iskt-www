import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ServerEnv } from '../env';
import type { LogEntry } from '../log';
import {
  MAIL_TIMEOUT_MS,
  SUBJECT_PREFIX,
  buildContactEmail,
  createMailer,
  createResendMailer,
  type ResendClient,
} from '../mailer';

const data = {
  name: 'Jan Kowalski',
  email: 'jan@firma.pl',
  message: '<b>Hej</b><script>alert(1)</script>\nDruga linia',
};
const addresses = { from: 'ISKT <onboarding@resend.dev>', to: 'odbiorca@example.com' };

function client(send: ResendClient['emails']['send']): ResendClient {
  return { emails: { send } };
}

afterEach(() => {
  vi.useRealTimers();
});

describe('buildContactEmail', () => {
  it('tekst bez HTML, from/to z konfiguracji, replyTo nadawcy, stały temat', () => {
    const email = buildContactEmail(data, addresses);
    expect(email).toMatchObject({
      from: addresses.from,
      to: addresses.to,
      replyTo: data.email,
      subject: `${SUBJECT_PREFIX}: Jan Kowalski`,
    });
    expect(Object.keys(email).sort()).toEqual(['from', 'replyTo', 'subject', 'text', 'to']);
    expect(email).not.toHaveProperty('html');
    expect(email.text).toContain('Imię i nazwisko: Jan Kowalski');
    expect(email.text).toContain('E-mail: jan@firma.pl');
    // Treść użytkownika trafia dosłownie do części tekstowej (klient pocztowy jej nie renderuje).
    expect(email.text).toContain(data.message);
  });
});

describe('createResendMailer', () => {
  it('wysyła przez SDK z sygnałem i kluczem idempotencji', async () => {
    const send = vi.fn<ResendClient['emails']['send']>(async () => ({
      data: { id: 'e1' },
      error: null,
    }));
    const mailer = createResendMailer({ client: client(send), ...addresses });
    expect(await mailer.send(data, { requestId: 'req-1' })).toEqual({ ok: true });
    const [payload, options] = send.mock.calls[0] ?? [];
    expect(payload).toEqual(buildContactEmail(data, addresses));
    expect(options?.signal).toBeInstanceOf(AbortSignal);
    expect(options?.idempotencyKey).toBe('contact/req-1');
  });

  it('błąd z API Resend → provider_error', async () => {
    const mailer = createResendMailer({
      client: client(async () => ({ data: null, error: { name: 'validation_error' } })),
      ...addresses,
    });
    expect(await mailer.send(data, { requestId: 'r' })).toEqual({
      ok: false,
      code: 'provider_error',
    });
  });

  it('wyjątek SDK (np. sieć) → provider_error', async () => {
    const mailer = createResendMailer({
      client: client(async () => Promise.reject(new Error('ECONNRESET'))),
      ...addresses,
    });
    expect(await mailer.send(data, { requestId: 'r' })).toEqual({
      ok: false,
      code: 'provider_error',
    });
  });

  it('brak odpowiedzi przez 10 s → timeout i przerwany sygnał', async () => {
    vi.useFakeTimers();
    let signal: AbortSignal | undefined;
    const mailer = createResendMailer({
      client: client((_payload, options) => {
        signal = options.signal;
        return new Promise(() => {});
      }),
      ...addresses,
    });
    const pending = mailer.send(data, { requestId: 'r' });
    await vi.advanceTimersByTimeAsync(MAIL_TIMEOUT_MS - 1);
    expect(signal?.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(await pending).toEqual({ ok: false, code: 'timeout' });
    expect(signal?.aborted).toBe(true);
    expect(MAIL_TIMEOUT_MS).toBe(10_000);
  });

  it('SDK odrzuca po abort → timeout', async () => {
    vi.useFakeTimers();
    const mailer = createResendMailer({
      client: client(
        (_payload, { signal }) =>
          new Promise((_resolve, reject) => {
            signal.addEventListener('abort', () => reject(new Error('aborted')));
          }),
      ),
      ...addresses,
      timeoutMs: 50,
    });
    const pending = mailer.send(data, { requestId: 'r' });
    await vi.advanceTimersByTimeAsync(50);
    expect(await pending).toEqual({ ok: false, code: 'timeout' });
  });
});

describe('createMailer', () => {
  const base: ServerEnv = {
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

  it('MAIL_TRANSPORT=mock: nic nie wysyła, loguje tylko zdarzenie', async () => {
    const logs: LogEntry[] = [];
    const mailer = createMailer(base, (entry) => logs.push(entry));
    expect(await mailer.send(data, { requestId: 'req-9' })).toEqual({ ok: true });
    expect(logs).toEqual([{ event: 'mail_mock', status: 200, requestId: 'req-9' }]);
  });

  it('transport resend bez konfiguracji → błąd przy tworzeniu', () => {
    expect(() => createMailer({ ...base, mailTransport: 'resend' }, () => {})).toThrow();
  });
});
