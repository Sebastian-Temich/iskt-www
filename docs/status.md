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

- Czas: 2026-11-05T17:30Z (po QA M1)
- Kamień zakończony: M1 (#5–#8 zamknięte; QA M1 PR #21 scalony na decyzję właściciela E-003/B, werdykt FAIL: 2 × 🟡 → #22 wydajność mobile, #23 CSP). Etap `08-qa` zostaje otwarty do QA ostatniego kamienia
- Kamień bieżący: M2 (#9 polityka w toku, potem #11 formularz); naprawy QA M1: #23 w toku, #22 w kolejce
- PR w toku: brak (workery #9 i #23 pracują)
- Eskalacje: brak otwartych (E-001, E-002, E-003 zamknięte)
- Wstrzymania: M3 (#10 i dalej) czeka na QA M2
- `shctl doctor` 2026-11-05T14:12Z: 0 błędów
- Autoryzacja: „Autoryzacja planu PR #3” w `decyzje.md`
- Zadania właściciela: reguła rate limit w Vercel Firewall przed QA M2 (sprawdzić dostępność na Hobby); O-6 podgląd w walidatorze OG przy odbiorze
- Następny krok: monitoring #9 i #23, potem dispatch #22 i #11

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

