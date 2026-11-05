import { z } from 'zod';

/**
 * Schemat zgłoszenia z formularza kontaktowego (W-04, W-05; ADR-004 pkt 2), wspólny dla
 * `ContactForm` (walidacja w przeglądarce) i `POST /api/contact` (walidacja serwera, zawsze ponowna).
 *
 * - Długości liczymy w znakach Unicode (code points), nie w jednostkach UTF-16 ani bajtach
 *   (architektura, „Bezpieczeństwo”): emoji to jeden znak.
 * - Imię i e-mail trafiają do nagłówków e-maila (temat, Reply-To), więc odrzucamy w nich CR i LF.
 * - `website` to honeypot: prawdziwy użytkownik go nie widzi, więc musi być pusty. Endpoint sprawdza go
 *   przed walidacją (`isHoneypotFilled`) i odpowiada sukcesem bez wysyłki (W-05).
 */

export const CONTACT_LIMITS = { name: 100, email: 254, message: 5000 } as const;

export const CONTACT_FIELDS = ['name', 'email', 'message'] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];

export const CONTACT_MESSAGES = {
  required: 'To pole jest wymagane.',
  tooLong: (max: number) => `Maksymalnie ${max} znaków.`,
  newline: 'To pole nie może zawierać znaków nowej linii.',
  email: 'Podaj poprawny adres e-mail.',
} as const;

/** Liczba znaków Unicode (code points). */
export function codePointLength(value: string): number {
  return Array.from(value).length;
}

const CR_LF = /[\r\n]/;

function text(max: number, { singleLine }: { singleLine: boolean }) {
  return z
    .string({ error: CONTACT_MESSAGES.required })
    .trim()
    .refine((value) => value.length > 0, { error: CONTACT_MESSAGES.required, abort: true })
    .refine((value) => !singleLine || !CR_LF.test(value), {
      error: CONTACT_MESSAGES.newline,
      abort: true,
    })
    .refine((value) => codePointLength(value) <= max, {
      error: CONTACT_MESSAGES.tooLong(max),
      abort: true,
    });
}

const emailFormat = z.email();

export const contactSchema = z.object({
  name: text(CONTACT_LIMITS.name, { singleLine: true }),
  email: text(CONTACT_LIMITS.email, { singleLine: true }).refine(
    (value) => emailFormat.safeParse(value).success,
    { error: CONTACT_MESSAGES.email },
  ),
  message: text(CONTACT_LIMITS.message, { singleLine: false }),
  website: z.literal('').optional(),
});

export type ContactRequest = z.infer<typeof contactSchema>;
export type ContactData = Pick<ContactRequest, ContactField>;
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export type ContactValidation =
  { ok: true; data: ContactData } | { ok: false; fields: ContactFieldErrors };

/** Waliduje zgłoszenie; dla każdego błędnego pola zwraca pierwszy komunikat. */
export function validateContact(input: unknown): ContactValidation {
  const result = contactSchema.safeParse(input);
  if (result.success) {
    const { name, email, message } = result.data;
    return { ok: true, data: { name, email, message } };
  }
  const fields: ContactFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field !== 'string' || !isContactField(field) || fields[field]) continue;
    fields[field] = issue.message;
  }
  if (Object.keys(fields).length === 0) {
    // Błąd poza polami formularza (np. ciało nie jest obiektem albo honeypot nie jest tekstem).
    for (const field of CONTACT_FIELDS) {
      if (!isObject(input) || !(field in input)) fields[field] = CONTACT_MESSAGES.required;
    }
  }
  return { ok: false, fields };
}

/** Honeypot wypełniony: niepusta wartość pola `website` (każdego typu poza pustym tekstem). */
export function isHoneypotFilled(input: unknown): boolean {
  if (!isObject(input) || !('website' in input)) return false;
  const { website } = input;
  return website !== '' && website !== undefined && website !== null;
}

function isContactField(value: string): value is ContactField {
  return (CONTACT_FIELDS as readonly string[]).includes(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
