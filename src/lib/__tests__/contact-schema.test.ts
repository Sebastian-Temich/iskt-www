import { describe, expect, it } from 'vitest';
import {
  CONTACT_LIMITS,
  CONTACT_MESSAGES,
  codePointLength,
  isHoneypotFilled,
  validateContact,
} from '../contact-schema';

/** Znak 4-bajtowy w UTF-8 (2 jednostki UTF-16, 1 code point). */
const FOUR_BYTE = '😀';

const valid = {
  name: 'Jan Kowalski',
  email: 'jan@firma.pl',
  message: 'Dzień dobry, chcę porozmawiać o projekcie B+R.',
  website: '',
};

function emailOfLength(length: number): string {
  const domain = '@example.com';
  return `${'a'.repeat(length - domain.length)}${domain}`;
}

describe('validateContact: wartości poprawne', () => {
  it('przyjmuje poprawne zgłoszenie i zwraca tylko pola formularza', () => {
    expect(validateContact(valid)).toEqual({
      ok: true,
      data: { name: valid.name, email: valid.email, message: valid.message },
    });
  });

  it('honeypot może nie występować; obcięte spacje na brzegach', () => {
    const result = validateContact({ name: '  Ola ', email: ' ola@x.pl ', message: ' Hej ' });
    expect(result).toEqual({ ok: true, data: { name: 'Ola', email: 'ola@x.pl', message: 'Hej' } });
  });

  it('wiadomość może mieć wiele linii', () => {
    expect(validateContact({ ...valid, message: 'Linia 1\r\nLinia 2\nLinia 3' }).ok).toBe(true);
  });

  it('maksymalne długości ze znaków 4-bajtowych liczone w code points', () => {
    const name = FOUR_BYTE.repeat(CONTACT_LIMITS.name);
    const message = FOUR_BYTE.repeat(CONTACT_LIMITS.message);
    expect(name.length).toBe(2 * CONTACT_LIMITS.name);
    expect(codePointLength(name)).toBe(CONTACT_LIMITS.name);
    expect(validateContact({ ...valid, name, message }).ok).toBe(true);
  });

  it('e-mail o długości dokładnie 254 znaków', () => {
    const email = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(58)}.pl`;
    expect(email.length).toBe(CONTACT_LIMITS.email);
    expect(validateContact({ ...valid, email }).ok).toBe(true);
  });
});

describe('validateContact: wartości puste', () => {
  it.each(['name', 'email', 'message'] as const)('puste pole %s → komunikat wymagania', (field) => {
    expect(validateContact({ ...valid, [field]: '' })).toEqual({
      ok: false,
      fields: { [field]: CONTACT_MESSAGES.required },
    });
    expect(validateContact({ ...valid, [field]: '   ' })).toEqual({
      ok: false,
      fields: { [field]: CONTACT_MESSAGES.required },
    });
  });

  it('brak wszystkich pól → błąd każdego pola', () => {
    expect(validateContact({})).toEqual({
      ok: false,
      fields: {
        name: CONTACT_MESSAGES.required,
        email: CONTACT_MESSAGES.required,
        message: CONTACT_MESSAGES.required,
      },
    });
  });

  it.each([null, 'tekst', 42, []])('ciało niebędące obiektem (%j) → błąd każdego pola', (input) => {
    const result = validateContact(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.fields).sort()).toEqual(['email', 'message', 'name']);
  });

  it('pole innego typu niż tekst → komunikat wymagania', () => {
    expect(validateContact({ ...valid, name: 123 })).toEqual({
      ok: false,
      fields: { name: CONTACT_MESSAGES.required },
    });
  });
});

describe('validateContact: wartości za długie', () => {
  it('imię 101 znaków (także 4-bajtowych)', () => {
    const tooLong = { ok: false, fields: { name: CONTACT_MESSAGES.tooLong(100) } };
    expect(validateContact({ ...valid, name: 'a'.repeat(101) })).toEqual(tooLong);
    expect(validateContact({ ...valid, name: FOUR_BYTE.repeat(101) })).toEqual(tooLong);
  });

  it('e-mail 255 znaków', () => {
    expect(validateContact({ ...valid, email: emailOfLength(255) })).toEqual({
      ok: false,
      fields: { email: CONTACT_MESSAGES.tooLong(254) },
    });
  });

  it('wiadomość 5001 znaków (także 4-bajtowych)', () => {
    const tooLong = { ok: false, fields: { message: CONTACT_MESSAGES.tooLong(5000) } };
    expect(validateContact({ ...valid, message: 'a'.repeat(5001) })).toEqual(tooLong);
    expect(validateContact({ ...valid, message: FOUR_BYTE.repeat(5001) })).toEqual(tooLong);
  });
});

describe('validateContact: format e-mail i CR/LF', () => {
  it.each(['brak-malpy', 'jan@', '@firma.pl', 'jan kowalski@firma.pl', '<a@b.pl>'])(
    'niepoprawny e-mail %s',
    (email) => {
      expect(validateContact({ ...valid, email })).toEqual({
        ok: false,
        fields: { email: CONTACT_MESSAGES.email },
      });
    },
  );

  it.each(['Jan\r\nBcc: x@y.pl', 'Jan\nKowalski', 'Jan\rKowalski'])(
    'CR/LF w imieniu (%j) → odrzucone',
    (name) => {
      expect(validateContact({ ...valid, name })).toEqual({
        ok: false,
        fields: { name: CONTACT_MESSAGES.newline },
      });
    },
  );

  it.each(['jan@firma.pl\r\nBcc: x@y.pl', 'jan@firma.pl\nx', 'jan@\rfirma.pl'])(
    'CR/LF w e-mailu (%j) → odrzucone',
    (email) => {
      expect(validateContact({ ...valid, email })).toEqual({
        ok: false,
        fields: { email: CONTACT_MESSAGES.newline },
      });
    },
  );
});

describe('honeypot website', () => {
  it('pusty albo nieobecny: niewypełniony i walidacja przechodzi', () => {
    expect(isHoneypotFilled(valid)).toBe(false);
    expect(isHoneypotFilled({ name: 'x' })).toBe(false);
    expect(isHoneypotFilled(null)).toBe(false);
  });

  it.each(['http://spam.example', ' ', 0, false, {}])('wartość %j: wypełniony', (website) => {
    expect(isHoneypotFilled({ ...valid, website })).toBe(true);
  });

  it('schemat odrzuca niepusty honeypot (ochrona, gdy ktoś pominie isHoneypotFilled)', () => {
    expect(validateContact({ ...valid, website: 'spam' }).ok).toBe(false);
  });
});
