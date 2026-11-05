---
projekt: iskt-www
etap: 08-qa
data: "2026-11-05"
rola: qa
---

# Raport QA: M2 Formularz kontaktowy end-to-end

Data: 2026-11-05T20:28Z
Commit: 0ddfb77

## Zakres

Kamień M2 (plan `docs/05-plan/plan.md`). Zamknięte issue: #9 Strona polityki prywatności z roboczą
treścią; #11 Formularz kontaktowy end-to-end — walidacja, endpoint, Resend, rate limit. Pominięte
(„not planned”): brak. Na tym samym commicie: naprawy QA M1 #22 (wydajność mobile) i #23 (CSP).

Przepływy: strona główna (#8) → formularz (#11) → `/api/contact/` → mailer (mock); klauzula przy
formularzu (#11) → polityka prywatności (#9); stopka z linkiem do polityki na każdej stronie (#9);
skrypt formularza pod CSP (#11 × #23); ustawienia buildu #22 × #23 (`astro.config.mjs`).

Scenariusze odbioru M2: O-3 (lokalnie z `MAIL_TRANSPORT=mock` oraz ręczny test na stagingu wymagany
przez ADR-004: jedno prawdziwe zgłoszenie; odbiór w skrzynce i `Reply-To` potwierdza właściciel), O-4,
O-5 (na stagingu: reguła WAF). Dodatkowo z decyzji właściciela E-005/C: kryterium 4 #23 — CSP na stagingu
https://iskt-www.vercel.app/ (staging = `main` z 0ddfb77: pliki czcionek `latin-ext-pl` z #22,
`/polityka-prywatnosci/` 200). Lighthouse na stagingu dla stron kamienia (DoD QA z planu, W-10).

Nowe testy w `e2e/qa/` nie powstały: przepływy i scenariusze M2 pokrywają `e2e/contact.spec.ts`,
`e2e/polityka.spec.ts` i `e2e/csp.spec.ts` (wykaz w „Zgodności”), a kontrole stagingu nie mogą
działać w CI (adres zewnętrzny, limit WAF). Kontrole stagingu wykonano komendami z „Wyników testów”.

## Wyniki testów

| Obszar | Wynik | Uwagi |
|---|---|---|
| E2E chromium | fail 81/83, 1 pominięty | `pnpm exec playwright test --project=chromium --project=webkit --workers=1` (Playwright 1.61.1), razem 162 pass, 2 skip, 2 fail; pada `e2e/qa/QA-M1-1-wydajnosc.spec.ts:26` „CSS wbudowany” (QA-M2-1), także w powtórce pojedynczo |
| E2E webkit | fail 81/83, 1 pominięty | jw.; ten sam test; pominięty test produkcyjnego buildu `seo.spec.ts` działa tylko w chromium (jak w M1) |
| Integracja | pass 128/128 | `pnpm test` (Vitest, 11 plików, w tym `contact-schema`, `contact-endpoint`, `mailer`, `rate-limit`, `log`) |
| Lint i typy | fail | `pnpm lint`: `astro.config.mjs:105 Duplicate key 'build' (no-dupe-keys)`; `pnpm typecheck`: ts(1117) w tym samym miejscu (QA-M2-1) |
| Testy QA (`e2e/qa/`) | fail 1 test × 2 przeglądarki | w pełnym przebiegu jw.; `M1-scenariusze.spec.ts` zielone |
| CSP na stagingu (kryterium 4 #23) | pass | `curl -sI https://iskt-www.vercel.app/`: `content-security-policy: default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`. W przeglądarce (Playwright chromium i webkit, nasłuch `securitypolicyviolation`, błędy konsoli i strony) na `/`, `/polityka-prywatnosci/`, `/nie-ma-takiej-strony/`: 0 naruszeń, 0 błędów; skrypt formularza działa (walidacja po kliknięciu „Wyślij” bez danych, bez żądania) |
| Rate limit WAF na stagingu (W-05, O-5) | pass | Seria `curl -X POST` z `Origin` stagingu w dwóch oknach 10 min: 20:31Z na `/api/contact` — 5 × 308, potem 19 × 429; 20:51Z na `/api/contact/` — 5 × 400, potem 19 × 429. Za każdym razem dokładnie 5 żądań przeszło, a 6. i kolejne dostały 429. Zastrzeżenie: przez błąd cytowania w pętli (rozwinięcie `{...}` w bashu) ciała nie były poprawnym JSON-em, więc endpoint zwracał 400 i nie wysłał żadnego e-maila; reguła WAF liczy żądania przed funkcją niezależnie od treści. Honeypot → 200 sprawdza `e2e/contact.spec.ts` lokalnie |
| Test ręczny na stagingu (ADR-004, O-3) | fail (konfiguracja) | 2026-11-05T21:08Z: prawdziwe zgłoszenie przez formularz na https://iskt-www.vercel.app/#kontakt (Playwright chromium) → `POST /api/contact/` 502, komunikat błędu wysyłki zamiast „Dziękujemy!”. Wcześniejsza próba o 21:04Z przerwana bez odczytu statusu. Lokalnie z kluczem testowym z `.env.local` (`pnpm dev`) to samo: 502, log `contact_failed` / `provider_error`. Wywołanie Resend SDK z tymi zmiennymi: `validation_error` 403, „You can only send testing emails to your own email address”, czyli nadawca `onboarding@resend.dev` (domena bez weryfikacji) może wysyłać tylko na adres konta Resend, a `CONTACT_TO` wskazuje inny adres. Kod działa zgodnie z kryteriami (502 z zachowaniem danych). Naprawa to konfiguracja właściciela: eskalacja E-006 |
| Lighthouse mobile (staging) | pass | Lighthouse 12.8.2, `--form-factor=mobile --skip-audits=is-crawlable`: `/` 3 przebiegi wydajność 98 / 99 / 96 (LCP 1,7–2,3 s), dostępność, dobre praktyki i SEO 100; `/polityka-prywatnosci/` 2 przebiegi 100 / 99, reszta 100 |
| Lighthouse desktop (staging) | pass | `--preset=desktop --skip-audits=is-crawlable`: `/` i `/polityka-prywatnosci/` 100 × 4 |
| Sekrety | pass | `gitleaks git --redact --no-banner .`: 115 commitów, no leaks found |

Testy niestabilne: brak. Dane osobowe w logach: reporter E2E nie zbiera logów serwera, więc dowodem
jest `src/lib/__tests__/log.test.ts` (logi ścieżek sukcesu i błędu bez imienia, e-maila, treści i
IP), zielony w `pnpm test`.

## Zgodność z wymaganiami

| Wymaganie | Wynik | Dowód |
|---|---|---|
| W-04 | niespełnione na stagingu (konfiguracja, E-006); kod spełnia kryteria | Pierwsze kryterium (e-mail przez Resend i komunikat sukcesu) nie działa na stagingu ani lokalnie z kluczem testowym: Resend 403 dla `CONTACT_TO` (wiersz „Test ręczny na stagingu”). Drugie (treść i `Reply-To`) niesprawdzone w skrzynce, tylko `mailer.test.ts`. Pozostałe kryteria spełnione: `e2e/contact.spec.ts` (wysyłka JSON i „Dziękujemy!” z mockiem, blokada drugiego kliknięcia, błędy pustych pól i złego e-maila z `aria-describedby` i fokusem, 400 z serwera, 502 i błąd sieci z zachowaniem danych, endpoint 400), `mailer.test.ts` (tekst, `replyTo`, timeout 10 s); O-4 spełnione, O-3 niespełnione do rozstrzygnięcia E-006 |
| W-05 | spełnione | Honeypot: `e2e/contact.spec.ts` (200 bez wysyłki, pole poza Tab); limity długości i CR/LF: `contact-schema.test.ts`, `contact-endpoint.test.ts`; 429 współdzielone: reguła Vercel Firewall przed funkcją, na stagingu 6. żądanie → 429 (wiersz WAF); komunikat 429 w UI: `e2e/contact.spec.ts` |
| W-06 | spełnione | Klauzula przy przycisku z linkiem `/polityka-prywatnosci/`: `e2e/contact.spec.ts`; treść polityki i stopka: `e2e/polityka.spec.ts` (treść zaakceptowana przez właściciela, `decyzje.md`); logi bez PII: `log.test.ts`; brak zapisu danych: endpoint bez bazy (ADR-001, ADR-002) |
| W-12 | częściowo | Spełnione: staging aktualizuje się z `main` (pliki z #22 na stagingu), gitleaks czysty, klucze tylko w zmiennych Vercel i `.env.local`. Niespełnione: kryterium „na stagingu używany jest testowy klucz Resend, a e-mail trafia na adres testowy właściciela”, bo Resend odrzuca adres `CONTACT_TO` (E-006) |
| W-10 (strony kamienia) | spełnione | Lighthouse mobile i desktop ≥ 96 na `/` i `/polityka-prywatnosci/`; CSP obecne (dobre praktyki 100) |

## Zgłoszenia

Tylko 🔴 krytyczne i 🟡 istotne; każde staje się issue `typ:qa` przez `shctl task create`.

| Issue | Waga | Opis |
|---|---|---|
| QA-M2-1 | 🟡 istotne | `astro.config.mjs` ma dwa klucze `build` po merge'u #22 (`inlineStylesheets: 'always'`, l. 97) i #23 (`'never'`, l. 105); działa ostatni. `pnpm lint` i `pnpm typecheck` czerwone na `main` (CI kolejnych PR z kodem będzie czerwone), `e2e/qa/QA-M1-1-wydajnosc.spec.ts:26` pada w obu przeglądarkach. Odtworzenie: na `main` `pnpm lint`; `pnpm typecheck`; `pnpm exec playwright test e2e/qa/QA-M1-1-wydajnosc.spec.ts:26 --project=chromium --project=webkit`. Wydajność na stagingu mimo to ≥ 96 |

## Drobne uwagi

Zgłoszenia ⚪ drobne, bez issue; orkiestrator przenosi je do `docs/backlog-drobne.md`.

- POST na `/api/contact` bez ukośnika dostaje 308 na `/api/contact/` (trailingSlash). Formularz
  używa `/api/contact/`, więc bez wpływu na W-04; reguła WAF liczy oba warianty.

## Werdykt

FAIL — błąd 🟡 istotny QA-M2-1 (zdublowany klucz `build`, czerwone lint, typy i test E2E na
`main`) i niedziałająca na stagingu wysyłka e-maila (W-04, O-3). Przyczyną wysyłki jest konfiguracja
Resend po stronie właściciela, nie kod, dlatego jest eskalacja E-006 zamiast issue. CSP, rate limit,
walidacja, honeypot, polityka prywatności i Lighthouse spełnione.

## Propozycje dla systemu

- CI na push do `main` uruchamia tylko `check-dod`, a PR zadań są scalane z CI liczonym na starszej
  bazie. Dwa PR zmieniające ten sam obiekt (#22, #23) dały czerwony `main` bez sygnału. Propozycja:
  pełne joby `lint`/`test` na push do `main` albo wymóg aktualnej gałęzi przed merge'em (`pr check`
  sprawdza `za_main` = 0).
- Główna kopia projektu nie może zmienić gałęzi (deny `git -C * switch`), a `shctl` nie ma komendy na
  worktree etapu. QA M2 pracowało w ręcznie założonym `/Users/Shared/sh/wt/iskt-www/stage-08-qa`
  (`git worktree add`), a starą gałąź `stage/08-qa` scalono z `main` (bez force pushu). Propozycja:
  `shctl stage worktree ETAP` (worktree na `stage/ETAP` od `origin/main`, z obsługą gałęzi po squashu).
- Etap `08-qa` przenosi `iteracja: 3` z QA M1 na QA M2, więc pierwsze review M2 stosowało regułę
  3. iteracji: nowe zgłoszenia istotne obniżało do drobnych. Propozycja: licznik iteracji `08-qa`
  liczony osobno dla każdego kamienia.
