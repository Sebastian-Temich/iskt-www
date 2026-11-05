import { expect, test, type Page, type Route } from '@playwright/test';

// Formularz kontaktowy end-to-end (W-04, W-05, W-06; ADR-003, ADR-004). Serwer testów działa z
// MAIL_TRANSPORT=mock (playwright.config.ts), więc prawdziwy endpoint /api/contact niczego nie
// wysyła. Odpowiedzi 400/429/502 i opóźnienie wysyłki symulujemy przez page.route.

// Adres z końcowym ukośnikiem (trailingSlash: 'always' w astro.config.mjs i vercel.json).
const API = '/api/contact/';
const valid = {
  name: 'Jan Kowalski',
  email: 'jan@firma.pl',
  message: 'Proszę o kontakt w sprawie B+R.',
};

async function openForm(page: Page) {
  await page.goto('/');
  const form = page.locator('#kontakt form');
  await expect(form).toBeVisible();
  return {
    form,
    name: form.getByLabel('Imię i nazwisko'),
    email: form.getByLabel('E-mail'),
    message: form.getByLabel('Wiadomość'),
    submit: form.getByRole('button', { name: 'Wyślij wiadomość' }),
    alert: form.getByRole('alert'),
  };
}

async function fill(ui: Awaited<ReturnType<typeof openForm>>, data = valid) {
  await ui.name.fill(data.name);
  await ui.email.fill(data.email);
  await ui.message.fill(data.message);
}

function countPosts(page: Page) {
  const posts: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST' && new URL(request.url()).pathname === API) {
      posts.push(request.postData() ?? '');
    }
  });
  return posts;
}

async function expectFieldError(page: Page, label: string, text: string | RegExp) {
  const control = page.locator('#kontakt form').getByLabel(label);
  await expect(control).toHaveAttribute('aria-invalid', 'true');
  const describedBy = (await control.getAttribute('aria-describedby')) ?? '';
  expect(describedBy).not.toBe('');
  const message = page.locator(`[id="${describedBy.split(' ').at(-1)}"]`);
  await expect(message).toBeVisible();
  await expect(message).toHaveText(text);
}

test.describe('formularz kontaktowy', () => {
  test('poprawne zgłoszenie: JSON do /api/contact, stan sukcesu „Dziękujemy!”', async ({
    page,
  }) => {
    const posts = countPosts(page);
    const ui = await openForm(page);
    await fill(ui);
    const [response] = await Promise.all([
      page.waitForResponse((res) => new URL(res.url()).pathname === API),
      ui.submit.click(),
    ]);
    expect(response.status()).toBe(200);
    expect(response.request().headers()['content-type']).toMatch(/^application\/json/);
    expect(JSON.parse(posts[0] ?? '{}')).toEqual({ ...valid, website: '' });

    const card = page.locator('#kontakt');
    await expect(card.getByRole('heading', { name: 'Dziękujemy!' })).toBeVisible();
    await expect(card).toContainText('Odezwiemy się najszybciej jak to możliwe.');
    await expect(card.getByRole('heading', { name: 'Dziękujemy!' })).toBeFocused();
    await expect(ui.form).toBeHidden();
    await expect(page).toHaveURL(/\/$/);
    expect(posts).toHaveLength(1);
  });

  test('przycisk zablokowany w trakcie wysyłki; drugi klik nie wysyła drugiego żądania', async ({
    page,
  }) => {
    let release: () => void = () => {};
    const gate = new Promise<void>((resolve) => (release = resolve));
    let hits = 0;
    await page.route(API, async (route: Route) => {
      hits += 1;
      await gate;
      await route.fulfill({ status: 200, json: { ok: true } });
    });
    const ui = await openForm(page);
    await fill(ui);
    await ui.submit.click();
    await expect(ui.submit).toBeDisabled();
    await expect(ui.submit).toHaveAttribute('aria-busy', 'true');
    await ui.submit.click({ force: true });
    await ui.form.evaluate((form: HTMLFormElement) => form.requestSubmit());
    release();
    await expect(page.getByRole('heading', { name: 'Dziękujemy!' })).toBeVisible();
    expect(hits).toBe(1);
  });

  test('puste pola: błędy przy polach z aria-describedby, fokus na pierwszym, bez wysyłki', async ({
    page,
  }) => {
    const posts = countPosts(page);
    const ui = await openForm(page);
    await ui.submit.click();
    await expectFieldError(page, 'Imię i nazwisko', 'To pole jest wymagane.');
    await expectFieldError(page, 'E-mail', 'To pole jest wymagane.');
    await expectFieldError(page, 'Wiadomość', 'To pole jest wymagane.');
    await expect(ui.name).toBeFocused();
    expect(posts).toEqual([]);

    // Poprawione pola tracą błąd; fokus przechodzi do pierwszego nadal błędnego (e-mail).
    await ui.name.fill(valid.name);
    await ui.email.fill('jan@');
    await ui.message.fill(valid.message);
    await ui.submit.click();
    await expect(ui.name).not.toHaveAttribute('aria-invalid', 'true');
    await expect(ui.name).not.toHaveAttribute('aria-describedby', /error/);
    await expectFieldError(page, 'E-mail', 'Podaj poprawny adres e-mail.');
    await expect(ui.email).toBeFocused();
    expect(posts).toEqual([]);
  });

  test('błędy pól z serwera (400) przy polach, z fokusem', async ({ page }) => {
    await page.route(API, (route) =>
      route.fulfill({
        status: 400,
        json: { error: 'invalid', fields: { message: 'Maksymalnie 5000 znaków.' } },
      }),
    );
    const ui = await openForm(page);
    await fill(ui);
    await ui.submit.click();
    await expectFieldError(page, 'Wiadomość', 'Maksymalnie 5000 znaków.');
    await expect(ui.message).toBeFocused();
    await expect(ui.submit).toBeEnabled();
  });

  for (const { status, text } of [
    { status: 502, text: /Nie udało się wysłać wiadomości.*biuro@iskt\.pl/ },
    { status: 429, text: 'Zbyt wiele zgłoszeń, spróbuj później.' },
  ]) {
    test(`odpowiedź ${status}: komunikat błędu, wpisane dane zostają`, async ({ page }) => {
      await page.route(API, (route) =>
        route.fulfill({
          status,
          json: { error: status === 429 ? 'rate_limited' : 'send_failed' },
        }),
      );
      const ui = await openForm(page);
      await fill(ui);
      await ui.submit.click();
      await expect(ui.alert).toBeVisible();
      await expect(ui.alert).toHaveText(text);
      await expect(ui.name).toHaveValue(valid.name);
      await expect(ui.email).toHaveValue(valid.email);
      await expect(ui.message).toHaveValue(valid.message);
      await expect(ui.submit).toBeEnabled();
      await expect(page.getByRole('heading', { name: 'Dziękujemy!' })).toBeHidden();
    });
  }

  test('błąd sieci: komunikat błędu, wpisane dane zostają', async ({ page }) => {
    await page.route(API, (route) => route.abort('failed'));
    const ui = await openForm(page);
    await fill(ui);
    await ui.submit.click();
    await expect(ui.alert).toHaveText(/Nie udało się wysłać wiadomości/);
    await expect(ui.message).toHaveValue(valid.message);
  });

  test('klauzula informacyjna przy przycisku z linkiem do polityki prywatności', async ({
    page,
  }) => {
    const ui = await openForm(page);
    const clause = page.getByTestId('contact-clause');
    await expect(clause).toBeVisible();
    await expect(clause).toContainText('Administratorem Twoich danych jest ISKT Greennovation');
    await expect(clause).toContainText('aby odpowiedzieć na Twoje zapytanie');
    await expect(clause.getByRole('link', { name: 'polityce prywatności' })).toHaveAttribute(
      'href',
      '/polityka-prywatnosci/',
    );
    // Klauzula jest tuż pod przyciskiem wysyłki.
    const [buttonBox, clauseBox] = [await ui.submit.boundingBox(), await clause.boundingBox()];
    expect(clauseBox && buttonBox && clauseBox.y >= buttonBox.y + buttonBox.height).toBe(true);
  });

  test('honeypot website: niewidoczny i poza kolejnością Tab', async ({ page, browserName }) => {
    const ui = await openForm(page);
    const trap = ui.form.locator('input[name="website"]');
    await expect(trap).toHaveAttribute('tabindex', '-1');
    await expect(trap).toHaveAttribute('autocomplete', 'off');
    await expect(trap).not.toBeInViewport();
    await ui.message.focus();
    // WebKit domyślnie pomija przyciski przy Tab; Option+Tab przechodzi po wszystkich elementach.
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
    await expect(ui.submit).toBeFocused();
  });
});

test.describe('endpoint /api/contact (MAIL_TRANSPORT=mock)', () => {
  test('POST JSON z Origin serwisu → 200; honeypot → 200', async ({ request, baseURL }) => {
    const headers = { Origin: new URL(baseURL ?? '').origin };
    const ok = await request.post(API, { data: { ...valid, website: '' }, headers });
    expect(ok.status()).toBe(200);
    expect(await ok.json()).toEqual({ ok: true });
    const trap = await request.post(API, { data: { ...valid, website: 'spam' }, headers });
    expect(trap.status()).toBe(200);
  });

  test('odrzucenia: 400, 403, 405, 413, 415', async ({ request, baseURL }) => {
    const origin = new URL(baseURL ?? '').origin;
    const invalid = await request.post(API, {
      data: { ...valid, email: 'zly' },
      headers: { Origin: origin },
    });
    expect(invalid.status()).toBe(400);
    expect(await invalid.json()).toMatchObject({
      error: 'invalid',
      fields: { email: expect.any(String) },
    });

    const foreign = await request.post(API, {
      data: valid,
      headers: { Origin: 'https://evil.example' },
    });
    expect(foreign.status()).toBe(403);

    const get = await request.get(API);
    expect(get.status()).toBe(405);

    const big = await request.post(API, {
      data: { ...valid, message: 'a'.repeat(40_000) },
      headers: { Origin: origin },
    });
    expect(big.status()).toBe(413);

    const xml = await request.post(API, {
      data: '<contact/>',
      headers: { Origin: origin, 'Content-Type': 'application/xml' },
    });
    expect(xml.status()).toBe(415);

    // Typy formularzowe: 415 z endpointu (test jednostkowy) albo 403 z wbudowanego checkOrigin Astro,
    // gdy Origin różni się od adresu żądania widzianego przez serwer. Nigdy nie są przyjmowane.
    const form = await request.post(API, { form: valid, headers: { Origin: origin } });
    expect([403, 415]).toContain(form.status());
  });
});

test.describe('bez JavaScriptu', () => {
  test.use({ javaScriptEnabled: false });

  test('formularz ukryty, <noscript> z mailto i telefonem, brak żądania do /api/contact', async ({
    page,
  }) => {
    const posts = countPosts(page);
    await page.goto('/');
    const section = page.locator('#kontakt');
    await expect(section.locator('form')).toBeHidden();
    await expect(section.getByRole('heading', { name: 'Dziękujemy!' })).toBeHidden();
    const fallback = section.getByTestId('contact-noscript');
    await expect(fallback).toBeVisible();
    await expect(fallback.getByRole('link', { name: 'biuro@iskt.pl' })).toHaveAttribute(
      'href',
      'mailto:biuro@iskt.pl',
    );
    await expect(fallback.getByRole('link', { name: '+48 504 083 825' })).toHaveAttribute(
      'href',
      'tel:+48504083825',
    );
    await page.keyboard.press('Enter');
    expect(posts).toEqual([]);
  });
});
