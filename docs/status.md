---
zadania_todo: 7
zadania_in_progress: 0
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 8
zadania_anulowane: 0
pr_otwarte: 0
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-05", "zrodlo": "T-22", "pytanie": "-", "decyzja": "Dodatkowo przeczytane: `docs/04-architektura/architektura.md` (CSP), `e2e/smoke.spec.ts`, `e2e/qa/M1-scenariusze.spec.ts`, `playwright.config.ts`, `src/styles/tokens/spacing.css`."}, {"data": "2026-11-05", "zrodlo": "T-22", "pytanie": "Preloady fontów w `BaseLayout.astro` zostają", "decyzja": "ich usunięcie pogorszyło FCP (2,6 s, wynik 88–89)."}, {"data": "2026-11-05", "zrodlo": "T-22", "pytanie": "Nowy test w `e2e/qa/QA-M1-1-wydajnosc.spec.ts` (poza „Zakresem”)", "decyzja": "kryteria 1 i 2 potrzebują testu, a `e2e/home.spec.ts` ma zostać bez zmian; nazwa jak `e2e/qa/M1-scenariusze.spec.ts`."}, {"data": "2026-11-05", "zrodlo": "T-22", "pytanie": "Font zmienny Inter odrzucony", "decyzja": "zmienia kontrakt `@font-face` sprawdzany w `e2e/smoke.spec.ts` (osobna ściana na wagę) i wymagałby zmiany testu spoza zakresu."}, {"data": "2026-11-05", "zrodlo": "T-22", "pytanie": "-", "decyzja": "Pełne pliki latin-ext usunięte z `public/fonts/` (nieużywane); nowe pliki mają nazwy `*-latin-ext-pl-*`, żeby nie trafić na stary plik w cache przeglądarki/CDN."}]
ostatnia_synchronizacja: 2026-11-05T21:12:47Z
---

# Status projektu

Plik wspólny, aktualizuje orkiestrator. Frontmatter zapisuje `scripts/sync-status.sh`: liczniki,
`wstrzymania` (wpisy z `/Users/Shared/sh/limity.md`) i `ostatnie_decyzje` (5 najnowszych z `decyzje.md`).
Widok w Obsidianie: `docs/_dashboard.md`.

## Bieżący etap

- `08-qa`: escalated

## Punkt przekazania

Stan po ostatnim kamieniu milowym, potrzebny do wznowienia po `/clear` i „wznów”.

- Czas: 2026-11-05T21:25Z (po QA M2)
- Kamień zakończony: M2 funkcjonalnie (#9, #11 zamknięte; naprawy QA M1 #22, #23 zamknięte). QA M2 PR #28 scalony, werdykt FAIL: 🟡 QA-M2-1 → #29 (zdublowany klucz `build` w `astro.config.mjs`, lint/typecheck/E2E czerwone na `main`); wysyłka e-maila nie działa (Resend 403 dla `CONTACT_TO`) → E-006. CSP na stagingu i reguła WAF (6. POST → 429) potwierdzone
- Kamień bieżący: M2 (naprawa #29), M3 wstrzymany
- PR w toku: brak (worker #29 pracuje, panel `worker:iskt-www:29`)
- Eskalacje: E-006 otwarta (08-qa, konfiguracja Resend: opcje A/B/C)
- Wstrzymania: M3 (#10 gotowe) do rozstrzygnięcia E-006 i zamknięcia #29 (bez #29 CI każdego PR z kodem jest czerwone)
- `shctl doctor` 2026-11-05T14:12Z: 0 błędów
- Autoryzacja: „Autoryzacja planu PR #3” w `decyzje.md`
- Zadania właściciela: E-006; O-3 (odbiór e-maila i `Reply-To` w skrzynce) po E-006; O-6 podgląd w walidatorze OG przy odbiorze
- Worktree QA `/Users/Shared/sh/wt/iskt-www/stage-08-qa` założony ręcznie (brak komendy shctl); do usunięcia
- Następny krok: monitoring #29 (`shctl task wait 29`); po E-006/A ponowny test O-3 na stagingu i dopisek do `raport-M2.md`; potem start M3 (#10)

## Dziennik etapów

- 2026-11-05 `00-intake`: in-progress
- 2026-11-05 `00-intake`: review
- 2026-11-05 `00-intake`: iteracja 2 (FAIL review PR #1)
- 2026-11-05 `00-intake`: done
- 2026-11-05 `04-architektura`: in-progress
- 2026-11-05 `05-plan`: in-progress
- 2026-11-05 `04-architektura`: review
- 2026-11-05 `05-plan`: review
- 2026-11-05 `04-architektura`: iteracja 2 (FAIL review PR #3)
- 2026-11-05 `04-architektura`: iteracja 3 (FAIL review PR #3)
- 2026-11-05 `04-architektura`: done
- 2026-11-05 `05-plan`: done
- 2026-11-05 `06-zadania`: in-progress
- 2026-11-05 `06-zadania`: review
- 2026-11-05 `06-zadania`: iteracja 2 (FAIL review PR #4)
- 2026-11-05 `06-zadania`: iteracja 3 (FAIL review PR #4)
- 2026-11-05 `06-zadania`: done
- 2026-11-05 `08-qa`: in-progress
- 2026-11-05 `08-qa`: review
- 2026-11-05 `08-qa`: iteracja 2 (FAIL review PR #21)
- 2026-11-05 `08-qa`: iteracja 3 (FAIL review PR #21)

## Otwarte eskalacje

- E-006 (08-qa): QA M2: formularz na stagingu i lokalnie zwraca 502. Resend odrzuca wysyłkę (403 validation_error): z nadawcą onboarding@resend.dev można wysyłać tylko na adres właściciela konta Resend, a CONTACT_TO wskazuje inny adres. W-04 i O-3 niespełnione do zmiany konfiguracji; kod działa zgodnie z kryteriami (502 z zachowaniem danych)

