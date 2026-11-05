import type { ContactData } from './contact-schema';
import type { ServerEnv } from './env';
import type { Logger } from './log';

/**
 * Granica integracji z Resend (ADR-004 pkt 1, 3, 4). Endpoint nie importuje SDK bezpośrednio.
 *
 * - Treść wyłącznie jako `text`, bez HTML z danych użytkownika; `from` = `CONTACT_FROM`,
 *   `to` = `CONTACT_TO`, `replyTo` = zwalidowany e-mail nadawcy, temat stały z prefiksem i imieniem.
 * - Wywołanie przerywa `AbortController` po 10 s; błąd albo timeout to wynik `ok: false` (502 w
 *   endpoincie). Bez ponowień po stronie serwera, żeby nie dublować e-maili.
 * - `MAIL_TRANSPORT=mock` (testy, E2E): nic nie wysyła i loguje tylko identyfikator zdarzenia.
 */

export const MAIL_TIMEOUT_MS = 10_000;
export const SUBJECT_PREFIX = '[iskt.pl] Zapytanie z formularza';

export interface ContactEmail {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
}

export type SendFailure = 'timeout' | 'provider_error';
export type SendResult = { ok: true } | { ok: false; code: SendFailure };

export interface Mailer {
  send(data: ContactData, context: { requestId: string }): Promise<SendResult>;
}

/** Fragment klienta Resend używany przez mailer (w testach zastępowany atrapą). */
export interface ResendClient {
  emails: {
    send(
      payload: ContactEmail,
      options: { signal: AbortSignal; idempotencyKey: string },
    ): Promise<{ data: unknown; error: unknown }>;
  };
}

export function buildContactEmail(
  data: ContactData,
  addresses: { from: string; to: string },
): ContactEmail {
  return {
    from: addresses.from,
    to: addresses.to,
    replyTo: data.email,
    subject: `${SUBJECT_PREFIX}: ${data.name}`,
    text: [
      'Nowe zapytanie z formularza kontaktowego iskt.pl.',
      '',
      `Imię i nazwisko: ${data.name}`,
      `E-mail: ${data.email}`,
      '',
      'Wiadomość:',
      data.message,
      '',
      '—',
      'Odpowiedz na ten e-mail, aby napisać bezpośrednio do nadawcy.',
    ].join('\n'),
  };
}

interface ResendMailerOptions {
  client: ResendClient;
  from: string;
  to: string;
  timeoutMs?: number;
}

export function createResendMailer({
  client,
  from,
  to,
  timeoutMs = MAIL_TIMEOUT_MS,
}: ResendMailerOptions): Mailer {
  return {
    async send(data, { requestId }) {
      const controller = new AbortController();
      let timedOut = false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const timeout = new Promise<SendResult>((resolve) => {
        timer = setTimeout(() => {
          timedOut = true;
          controller.abort();
          resolve({ ok: false, code: 'timeout' });
        }, timeoutMs);
      });
      const request = client.emails
        .send(buildContactEmail(data, { from, to }), {
          signal: controller.signal,
          idempotencyKey: `contact/${requestId}`,
        })
        .then(({ error }): SendResult =>
          error ? { ok: false, code: 'provider_error' } : { ok: true },
        )
        .catch((): SendResult => ({ ok: false, code: timedOut ? 'timeout' : 'provider_error' }));
      try {
        return await Promise.race([request, timeout]);
      } finally {
        clearTimeout(timer);
      }
    },
  };
}

export function createMockMailer(log: Logger): Mailer {
  return {
    async send(_data, { requestId }) {
      log({ event: 'mail_mock', status: 200, requestId });
      return { ok: true };
    },
  };
}

/** Mailer z konfiguracji: mock albo Resend (SDK ładowany dopiero przy pierwszej wysyłce). */
export function createMailer(env: ServerEnv, log: Logger): Mailer {
  if (env.mailTransport === 'mock') return createMockMailer(log);
  const { resendApiKey, contactFrom, contactTo } = env;
  if (!resendApiKey || !contactFrom || !contactTo) {
    // parseServerEnv wymaga tych zmiennych dla transportu resend; tu tylko zawężenie typów.
    throw new Error('Brak konfiguracji Resend');
  }
  let mailer: Mailer | undefined;
  return {
    async send(data, context) {
      if (!mailer) {
        const { Resend } = await import('resend');
        mailer = createResendMailer({
          client: new Resend(resendApiKey) as unknown as ResendClient,
          from: contactFrom,
          to: contactTo,
        });
      }
      return mailer.send(data, context);
    },
  };
}
