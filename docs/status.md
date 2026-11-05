---
zadania_todo: 3
zadania_in_progress: 1
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 11
zadania_anulowane: 0
pr_otwarte: 1
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-05", "zrodlo": "T-13", "pytanie": "Test „linki wewnętrzne bez 404” sprawdza tylko istniejące strony (`/`, ESG, Interim, Startupy, polityka)", "decyzja": "pozostałe strony usług powstają w innych zadaniach M3."}, {"data": "2026-11-05", "zrodlo": "T-13", "pytanie": "-", "decyzja": "Wyróżnienie we wstępie Startupy w stałej `focus`: inaczej Prettier łamie `</strong>` i kropkę do osobnych linii, co w HTML daje spację przed kropką („miesięcy . Reszta”). Test sprawdza „miesięcy. Reszta jest konsekwencją.”."}, {"data": "2026-11-05", "zrodlo": "T-13", "pytanie": "Cudzysłów w „ustalimy później” (design: `„…\"`)", "decyzja": "typograficzny `„…”`, jak w pozostałych tekstach strony."}, {"data": "2026-11-05", "zrodlo": "T-13", "pytanie": "Siatka ról: `minmax(360px, 1fr)` z designu daje przy 1440 px trzy kolumny (3 + 1)", "decyzja": "zostawione jak w designie; dodane tylko `min(360px, 100%)`, żeby karta nie wychodziła poza ekran 375 px. Test sprawdza jedną kolumnę przy 375 px i więcej niż jedną przy 1440 px."}, {"data": "2026-11-05", "zrodlo": "T-13", "pytanie": "Gdzie umieścić notkę pod tabelą „Modele współpracy” (`D/Interim.dc.html:231`), skoro `ComparisonTable` z T7 nie ma na nią miejsca, a zmiany komponentów T7 są poza zakresem?", "decyzja": "Blok `model-note` w `interim.astro` tuż po tabeli, z tym samym tłem i ujemnym marginesem, który daje odstęp `--space-8` jak `gap` sekcji w designie; treść i wygląd jak w designie."}]
ostatnia_synchronizacja: 2026-11-05T22:34:16Z
---

# Status projektu

Plik wspólny, aktualizuje orkiestrator. Frontmatter zapisuje `scripts/sync-status.sh`: liczniki,
`wstrzymania` (wpisy z `/Users/Shared/sh/limity.md`) i `ostatnie_decyzje` (5 najnowszych z `decyzje.md`).
Widok w Obsidianie: `docs/_dashboard.md`.

## Bieżący etap

- `08-qa`: in-progress

## Punkt przekazania

Stan po ostatnim kamieniu milowym, potrzebny do wznowienia po `/clear` i „wznów”.

- Czas: 2026-11-05T22:28Z (M3 w toku, limit Codexa)
- Kamień zakończony: M2 funkcjonalnie (#9, #11 zamknięte; naprawy QA M1 #22, #23 zamknięte). QA M2 PR #28 scalony, werdykt FAIL: 🟡 QA-M2-1 → #29 (zdublowany klucz `build` w `astro.config.mjs`, lint/typecheck/E2E czerwone na `main`); wysyłka e-maila nie działa (Resend 403 dla `CONTACT_TO`) → E-006. CSP na stagingu i reguła WAF (6. POST → 429) potwierdzone
- Kamień bieżący: M3 (#10 zamknięte; #12 PR #33 i #13 PR #32: CI zielone, review czeka na limit Codexa; #14 czeka na slot). #29 zamknięte, Lighthouse mobile stagingu 99/99/99
- PR w toku: #32 (#13), #33 (#12), oba `status:review`, panele workerów otwarte
- Eskalacje: brak otwartych (E-006 zamknięta: opcja C, O-3 przy odbiorze końcowym)
- Wstrzymania: review Codex do 2026-11-06T00:36Z (limit użycia; nie podbija iteracji); #14 bez slotu do zamknięcia #12 lub #13
- `shctl doctor` 2026-11-05T14:12Z: 0 błędów
- Autoryzacja: „Autoryzacja planu PR #3” w `decyzje.md`
- Zadania właściciela: poprawa `CONTACT_TO`/Resend przed odbiorem (E-006/C), potem O-3; O-6 podgląd w walidatorze OG przy odbiorze
- Worktree QA `/Users/Shared/sh/wt/iskt-www/stage-08-qa` założony ręcznie (brak komendy shctl); do usunięcia
- Następny krok: po 00:36Z `shctl review run 32` i `33`, zamknięcie, dispatch #14; po M3: QA M3 (`sh-qa`)

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
- 2026-11-05 `08-qa`: in-progress, QA M2 scalone (PR #28); etap otwarty do QA ostatniego kamienia

## Otwarte eskalacje

(brak)
