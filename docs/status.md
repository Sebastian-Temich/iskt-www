---
zadania_todo: 5
zadania_in_progress: 0
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 10
zadania_anulowane: 0
pr_otwarte: 0
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-05", "zrodlo": "T-10", "pytanie": "-", "decyzja": "Dodatkowo przeczytane źródła: `D/AI-Transformacja.dc.html` i `D/Interim.dc.html` (sekcja „Pozostałe kompetencje”) dla treści i kolejności kart innych usług, `e2e/polityka.spec.ts` jako wzorzec testu, `src/components/home/ServiceTile.astro` i `src/components/ui/Button.astro` jako wzorzec komponentów."}, {"data": "2026-11-05", "zrodlo": "T-10", "pytanie": "Aktualizacja gałęzi po scaleniu #29: orkiestrator polecił `git merge origin/main`, ale profil workera odrzuca `git merge`", "decyzja": "zrobiłem `git rebase origin/main` (krok 4 procedury sh-worker) i `git push --force-with-lease` na `task/10-*`. Konfliktów nie było, a treść zmian jest ta sama."}, {"data": "2026-11-05", "zrodlo": "T-10", "pytanie": "Zdublowany klucz `build` w `astro.config.mjs`", "decyzja": "nie poprawiam go, bo to poza zakresem i ma własne issue #29 (PR #30)."}, {"data": "2026-11-05", "zrodlo": "T-10", "pytanie": "Okruszki w hero", "decyzja": "`ServiceHero` ma slot `breadcrumb`. Strona sama przekazuje `Breadcrumb` (jak w kryterium 1), a kolejne strony usług ustalają własną ścieżkę."}, {"data": "2026-11-05", "zrodlo": "T-10", "pytanie": "Podpis tabeli", "decyzja": "`<caption>` ukryty wizualnie, który nazywa przewijany region (`aria-labelledby`). Design nie ma widocznego podpisu, więc wygląd zostaje taki jak w designie."}]
ostatnia_synchronizacja: 2026-11-05T22:01:44Z
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
