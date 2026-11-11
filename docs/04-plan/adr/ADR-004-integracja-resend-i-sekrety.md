---
projekt: iskt-www
etap: 04-plan
data: "2026-11-05"
rola: architekt
---

# ADR-004: Integracja Resend i sekrety

Status: proponowana
Data: 2026-11-05

Wymagania: W-04 (wysyłka, błędy, timeout), W-05 (walidacja, brak wstrzyknięć), W-06 (logi bez PII),
W-12 (klucze tylko w env). Obszary ryzyka specyfikacji: „Upload plików, integracje zewnętrzne” = tak,
„Płatne usługi, sekrety, nowe konta” = tak. Decyzja właściciela z 2026-11-05: Resend zostaje.

## Kontekst

Endpoint `/api/contact` wysyła zgłoszenie e-mailem przez API Resend. Integracja może zawieść (błąd API,
limit, timeout), a dane wejściowe pochodzą od anonimowych użytkowników. Klucz API jest sekretem; w dev
i na stagingu używamy wyłącznie klucza testowego.

## Decyzja

1. **Granica integracji:** cały kod Resend w `src/lib/mailer.ts` (funkcja
   `sendContactEmail(dto): Promise<Result>`); endpoint nie importuje SDK bezpośrednio. W testach mailer
   jest mockowany; testy E2E nigdy nie wysyłają prawdziwych e-maili (zmienna `MAIL_TRANSPORT=mock` w
   środowisku testów, która loguje tylko identyfikator zdarzenia).
2. **Walidacja:** schemat Zod współdzielony przez formularz i endpoint (`src/lib/contact-schema.ts`):
   pola z designu, limity z W-05 (imię ≤ 100, e-mail ≤ 254 i format, wiadomość ≤ 5000), honeypot,
   odrzucenie znaków CR/LF w polach trafiających do nagłówków. Serwer zawsze waliduje ponownie (400).
3. **Budowa e-maila:** treść wyłącznie jako `text` (bez HTML z danych użytkownika); `from` ze zmiennej
   `CONTACT_FROM` (na stagingu `onboarding@resend.dev`), `to` ze zmiennej `CONTACT_TO`, `replyTo` =
   zwalidowany e-mail nadawcy, temat stały z prefiksem i imieniem po walidacji.
4. **Błędy i timeout:** wywołanie z `AbortController` 10 s; błąd/timeout → odpowiedź 502
   `{ "error": "send_failed" }`, formularz zachowuje dane i pokazuje komunikat z W-04. Bez ponowień po
   stronie serwera (unikamy duplikatów); ponowienie robi użytkownik.
5. **Idempotencja po stronie klienta:** przycisk zablokowany w trakcie wysyłki (W-04); endpoint
   przyjmuje tylko `POST` z `Content-Type: application/json` (ciało ≤ 32 kB) i nagłówkiem `Origin` z
   adresu bazowego; bez JavaScriptu formularz nie jest wysyłany (architektura, „Bezpieczeństwo”).
6. **Sekrety i zmienne:** `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`, `PUBLIC_SITE_URL`,
   `RATE_LIMIT_PROVIDER` (ADR-003), opcjonalnie `RATE_LIMIT_SALT` — wszystkie w `.env.example` bez
   wartości; wartości w `.env.local` (klucz testowy) i w zmiennych środowiska Vercel (Preview/staging)
   ustawianych przez właściciela. Żadne nie trafiają do GitHub Secrets. Prod (klucz produkcyjny,
   weryfikacja domeny iskt.pl SPF/DKIM) — właściciel, poza pilotem (B9a).
7. **CI:** gitleaks na każdym PR i pushu (szablon) — dowód braku sekretów.

## Rozważane opcje

| Opcja | Ocena |
|---|---|
| Resend przez SDK (wybrana) | Klucz tylko do wysyłki, region UE, prosty SDK, klucz testowy do stagingu |
| SMTP skrzynki firmowej (nodemailer) | Odrzucona przez właściciela: hasło do skrzynki w env, wolniejsze z serverless |
| Serwis formularzy SaaS | Odrzucona: dodatkowy podmiot przetwarzający, integracje poza v1 |

## Konsekwencje

- Zadania właściciela: konto Resend + klucz testowy, `CONTACT_TO`, zmienne w Vercel przed kamieniem 2;
  DPA Resend; przy wdrożeniu prod: domena w Resend i klucz prod.
- Dowody (minimalne): testy jednostkowe walidacji (poprawne/niepoprawne/limity/CR-LF), testy endpointu
  (200, 400, 429, 502 przy timeout z mockiem), test „brak PII w logach”, E2E formularza z mockiem,
  ręczny test na stagingu w raporcie QA (e-mail dochodzi na adres testowy), gitleaks zielony.
