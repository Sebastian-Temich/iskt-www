---
projekt: iskt-www
etap: 08-qa
data: "2026-11-06"
rola: qa
---

# Raport QA: M4 Jakość i wydanie

Data: 2026-11-06T09:30Z
Commit: 5eee98c

## Zakres

Kamień M4, ostatni w planie (`docs/05-plan/plan.md`, zadania planu 11–12). Zamknięte issue: #15 Jakość
przekrojowa — E2E wszystkich stron i Lighthouse na stagingu; #16 Dokumentacja wydania (techniczna i
produktowa). Pominięte („not planned”): brak. Otwartych zadań w planie: brak.

Przepływy między funkcjami: testy przekrojowe z #15 (`e2e/cross/`) obejmują wszystkie strony zbudowane w
M1–M3 (lista `e2e/cross/pages.ts`); `lighthouserc.cjs` i `pnpm lh:staging` z #15 mierzą staging
aktualizowany z `main` (W-12); dokumentacja z #16 opisuje staging, zmienne i kroki wydania, z których
korzysta odbiór.

Scenariusze odbioru M4: O-8 (wynik Lighthouse w raporcie QA M4, każda strona, mobile i desktop). Pomiar
po merge'u #15 według decyzji właściciela E-008/A (`docs/decyzje.md`) jest tu powtórzony narzędziem
projektu. Staging https://iskt-www.vercel.app/ serwuje `main` z 5eee98c (status Vercel `success`).

Nowe testy w `e2e/qa/` nie powstały: wymagania M4 pokrywa `e2e/cross/` z #15 (wykaz w „Zgodności”), a
pomiar Lighthouse na stagingu nie może działać w CI (adres zewnętrzny). Pomiar wykonano komendą z
„Wyników testów”.

## Wyniki testów

| Obszar | Wynik | Uwagi |
|---|---|---|
| E2E chromium | pass 264/264 | `pnpm exec playwright test --project=chromium --project=webkit --workers=1` (Playwright 1.61.1), razem 528 testów: 526 pass, 2 skip, 0 fail, 9,2 min |
| E2E webkit | pass 262/264, 2 pominięte | jw.; pominięte testy produkcyjnego buildu w `seo.spec.ts` działają tylko w chromium (jak w M1–M3) |
| Integracja | pass 129/129 | `pnpm test` (Vitest, 11 plików) |
| Lint i typy | pass | `pnpm lint` (ESLint + Prettier), `pnpm typecheck` (0 błędów, 0 ostrzeżeń) |
| Testy QA (`e2e/qa/`) | pass | w pełnym przebiegu jw.: `M1-scenariusze`, `QA-M1-1-wydajnosc`, `M3-scenariusze` w obu przeglądarkach |
| Lighthouse mobile (staging, O-8) | pass | `pnpm lh:staging https://iskt-www.vercel.app` (`@lhci/cli` 0.16.0, Lighthouse 13.6.0, mediana z 3 przebiegów, `is-crawlable` pominięty), wydajność / dostępność / dobre praktyki / SEO: `/` 99/100/100/100, `/uslugi/projekty-br/` 99/100/100/100, `/uslugi/esg/`, `/uslugi/ai-transformacja/`, `/uslugi/oprogramowanie/`, `/uslugi/interim/`, `/startupy/` 100 × 4 |
| Lighthouse desktop (staging, O-8) | pass | jw., `--preset=desktop`: `/uslugi/projekty-br/` 97/100/100/100, pozostałe 6 stron 100 × 4 |
| Obrazy i czcionki (W-10) | pass | Lighthouse 12.8.2 na stagingu po merge'u #15 (wszystkie 7 stron, mobile): audyty `modern-image-formats`, `unsized-images`, `offscreen-images`, `font-display` zaliczone (score 1); 0 żądań poza domeną stagingu (`network-requests`) |
| Sekrety | pass | `gitleaks git --redact --no-banner .`: no leaks found |

Testy niestabilne: brak. Dane osobowe w logach: QA M4 nie wysyła formularza; logi bez PII sprawdza
`src/lib/__tests__/log.test.ts` (zielony w `pnpm test`).

## Zgodność z wymaganiami

| Wymaganie | Wynik | Dowód |
|---|---|---|
| W-03 | spełnione | Wszystkie strony: bez poziomego scrolla na 375/768/1440 px, elementy interaktywne ≥ 24×24 px, tekst podstawowy ≥ 16 px i rozmiary większe z designu: `e2e/cross/pages.spec.ts`, `e2e/cross/mobile.spec.ts` (obie przeglądarki) |
| W-10 | spełnione | Lighthouse ≥ 97 we wszystkich 4 kategoriach dla 7 stron, mobile i desktop (O-8); obrazy w nowoczesnym formacie, z wymiarami i leniwym ładowaniem, czcionki lokalne z `font-display`, brak zewnętrznych żądań (wiersz „Obrazy i czcionki”). SEO na stagingu liczone bez audytu `is-crawlable` (zamierzony `noindex`, W-08) |
| W-11 | spełnione | axe bez naruszeń serious/critical, pierwszy Tab na SkipLink, dokładnie jeden `aria-current="page"`, `prefers-reduced-motion` bez animacji: `e2e/cross/pages.spec.ts` na każdej stronie; dostępność Lighthouse 100 na 7 stronach |
| W-12 | częściowo (zadanie właściciela) | Spełnione: staging aktualizuje się z `main` (5eee98c na stagingu), stały alias `https://iskt-www.vercel.app` zapisany w `docs/wydanie/techniczna/dokumentacja-techniczna.md`, gitleaks czysty, klucze tylko w zmiennych Vercel i `.env.local`. Niespełnione: wysyłka testowym kluczem Resend na adres testowy właściciela — Resend odrzuca `CONTACT_TO` (E-006); decyzja właściciela E-006/C: poprawa konfiguracji przed odbiorem i test O-3 przy odbiorze. To konfiguracja konta, nie kod, więc bez issue |

## Zgłoszenia

Tylko 🔴 krytyczne i 🟡 istotne; każde staje się issue `typ:qa` przez `shctl task create`.

| Issue | Waga | Opis |
|---|---|---|
| brak | | |

## Drobne uwagi

Zgłoszenia ⚪ drobne, bez issue; orkiestrator przenosi je do `docs/backlog-drobne.md`.

- brak

## Werdykt

PASS — wszystkie strony spełniają W-03, W-10 i W-11 w testach przekrojowych i w Lighthouse na stagingu
(≥ 97); brak błędów 🔴 i 🟡. Otwarta pozostaje konfiguracja Resend właściciela (W-12, E-006/C) do
sprawdzenia w O-3 przy odbiorze.
