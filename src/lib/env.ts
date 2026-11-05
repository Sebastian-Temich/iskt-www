import { z } from 'zod';

/**
 * Walidacja zmiennych środowiskowych (architektura, „Bezpieczeństwo”; ADR-003, ADR-004).
 *
 * - `parsePublicEnv`: zmienne strony (build i funkcje). Bezpieczne wartości domyślne
 *   (decyzja 2026-11-05): brak `PUBLIC_SITE_ENV` = `staging` (noindex), brak `PUBLIC_SITE_URL` =
 *   `https://${VERCEL_PROJECT_PRODUCTION_URL}`, a poza Vercel `http://localhost:55326`.
 *   Indeksowanie włącza wyłącznie jawne `PUBLIC_SITE_ENV=production`.
 * - `parseServerEnv`: zmienne endpointu formularza, walidowane przy starcie funkcji.
 *
 * Komunikaty błędów zawierają tylko nazwy zmiennych, nigdy ich wartości.
 */

export type EnvSource = Readonly<Record<string, string | undefined>>;

export const LOCAL_SITE_URL = 'http://localhost:55326';

const SITE_ENVS = ['production', 'staging', 'development'] as const;
export type SiteEnv = (typeof SITE_ENVS)[number];

const MAIL_TRANSPORTS = ['resend', 'mock'] as const;
export type MailTransport = (typeof MAIL_TRANSPORTS)[number];

const RATE_LIMIT_PROVIDERS = ['waf', 'upstash', 'memory'] as const;
export type RateLimitProvider = (typeof RATE_LIMIT_PROVIDERS)[number];

export interface PublicEnv {
  siteEnv: SiteEnv;
  siteUrl: string;
  indexable: boolean;
}

export interface ServerEnv extends PublicEnv {
  mailTransport: MailTransport;
  resendApiKey: string | undefined;
  contactTo: string | undefined;
  contactFrom: string | undefined;
  rateLimitProvider: RateLimitProvider;
  rateLimitSalt: string | undefined;
}

export class EnvError extends Error {
  readonly variables: readonly string[];

  constructor(variables: readonly string[]) {
    super(`Nieprawidłowe zmienne środowiskowe: ${variables.join(', ')}`);
    this.name = 'EnvError';
    this.variables = variables;
  }
}

/** Pusta wartość (`FOO=` w pliku env) znaczy to samo co brak zmiennej. */
function read(source: EnvSource, name: string): string | undefined {
  const value = source[name]?.trim();
  return value ? value : undefined;
}

const httpUrl = z.url({ protocol: /^https?$/ }).transform((value) => value.replace(/\/+$/, ''));

/** Adres e-mail albo forma `Nazwa <adres@domena>` (pole `from` w Resend). */
const mailbox = z
  .string()
  .refine(
    (value) =>
      z.email().safeParse(value).success ||
      /^[^<>\r\n]+<[^<>\s@]+@[^<>\s@]+\.[^<>\s@]+>$/.test(value),
  );

function fail(issues: string[]): never {
  throw new EnvError(issues);
}

function defaultSiteUrl(source: EnvSource): string {
  const vercelHost = read(source, 'VERCEL_PROJECT_PRODUCTION_URL');
  return vercelHost ? `https://${vercelHost}` : LOCAL_SITE_URL;
}

export function parsePublicEnv(source: EnvSource): PublicEnv {
  const issues: string[] = [];

  const siteEnvRaw = read(source, 'PUBLIC_SITE_ENV') ?? 'staging';
  const siteEnv = z.enum(SITE_ENVS).safeParse(siteEnvRaw);
  if (!siteEnv.success) issues.push('PUBLIC_SITE_ENV');

  const siteUrl = httpUrl.safeParse(read(source, 'PUBLIC_SITE_URL') ?? defaultSiteUrl(source));
  if (!siteUrl.success) issues.push('PUBLIC_SITE_URL');

  if (!siteEnv.success || !siteUrl.success) fail(issues);

  return {
    siteEnv: siteEnv.data,
    siteUrl: siteUrl.data,
    indexable: siteEnv.data === 'production',
  };
}

export function parseServerEnv(source: EnvSource): ServerEnv {
  const issues: string[] = [];
  let publicEnv: PublicEnv | undefined;
  try {
    publicEnv = parsePublicEnv(source);
  } catch (error) {
    if (!(error instanceof EnvError)) throw error;
    issues.push(...error.variables);
  }

  const mailTransport = z
    .enum(MAIL_TRANSPORTS)
    .safeParse(read(source, 'MAIL_TRANSPORT') ?? 'resend');
  if (!mailTransport.success) issues.push('MAIL_TRANSPORT');

  const resendApiKey = read(source, 'RESEND_API_KEY');
  const contactTo = read(source, 'CONTACT_TO');
  const contactFrom = read(source, 'CONTACT_FROM');
  if (mailTransport.success && mailTransport.data === 'resend') {
    if (!resendApiKey) issues.push('RESEND_API_KEY');
    if (!contactTo || !z.email().safeParse(contactTo).success) issues.push('CONTACT_TO');
    if (!contactFrom || !mailbox.safeParse(contactFrom).success) issues.push('CONTACT_FROM');
  }

  const rateLimitProvider = z
    .enum(RATE_LIMIT_PROVIDERS)
    .safeParse(read(source, 'RATE_LIMIT_PROVIDER') ?? 'waf');
  if (!rateLimitProvider.success) issues.push('RATE_LIMIT_PROVIDER');

  const rateLimitSalt = read(source, 'RATE_LIMIT_SALT');
  if (
    rateLimitProvider.success &&
    rateLimitProvider.data === 'upstash' &&
    (!rateLimitSalt || rateLimitSalt.length < 16)
  ) {
    issues.push('RATE_LIMIT_SALT');
  }

  if (!publicEnv || !mailTransport.success || !rateLimitProvider.success || issues.length > 0) {
    fail(issues);
  }

  return {
    ...publicEnv,
    mailTransport: mailTransport.data,
    resendApiKey,
    contactTo,
    contactFrom,
    rateLimitProvider: rateLimitProvider.data,
    rateLimitSalt,
  };
}

/**
 * Źródło zmiennych: `import.meta.env` (pliki `.env*` wczytane przez Vite) nadpisane przez
 * `process.env` (zmienne Vercel w funkcji i w buildzie).
 */
export function runtimeEnv(): EnvSource {
  const fromProcess = typeof process === 'undefined' ? {} : process.env;
  return { ...(import.meta.env as EnvSource), ...fromProcess };
}
