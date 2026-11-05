---
zadania_todo: 2
zadania_in_progress: 1
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 12
zadania_anulowane: 0
pr_otwarte: 0
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-05", "zrodlo": "T-12", "pytanie": "-", "decyzja": "Dodatkowo przeczytane źródła: `src/pages/uslugi/esg.astro`, `e2e/esg.spec.ts` i `T-10.md` jako wzorzec, komponenty `src/components/service/*`, `src/components/ui/{Badge,Icon,icon-names}`, `src/content/{site,seo}.ts`, `playwright.config.ts`."}, {"data": "2026-11-05", "zrodlo": "T-12", "pytanie": "Kolejność `data-component` na Oprogramowaniu", "decyzja": "dwie karty `product-card` między `scope-list` i `comparison-table`; sekcja nie ma własnego `data-component`, żeby test kolejności był jednoznaczny."}, {"data": "2026-11-05", "zrodlo": "T-12", "pytanie": "Okruszki", "decyzja": "„AI i transformacja cyfrowa” i „Rozwój oprogramowania”, jak w designie (l. 67) i w BreadcrumbList `seo.ts`."}, {"data": "2026-11-05", "zrodlo": "T-12", "pytanie": "Cudzysłowy zamykające w designie są ASCII (`„wdróżmy AI\"`, `„Chcemy zacząć z AI, nie wiemy gdzie\"`)", "decyzja": "użyłem polskiego `”`, jak w `esg.astro`."}, {"data": "2026-11-05", "zrodlo": "T-12", "pytanie": "Sekcja „Nasze autorskie aplikacje” (nagłówek, opis, siatka)", "decyzja": "w `oprogramowanie.astro` z własnym `<style>`, a `ProductCard` to pojedyncza karta. Issue wymaga tylko nowego `ProductCard`, a sekcja występuje na jednej stronie."}]
ostatnia_synchronizacja: 2026-11-05T22:36:40Z
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
