---
zadania_todo: 6
zadania_in_progress: 0
zadania_review: 1
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 7
zadania_anulowane: 0
pr_otwarte: 1
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-05", "zrodlo": "T-23", "pytanie": "-", "decyzja": "Dodatkowo przeczytane źródła: `astro.config.mjs`, `playwright.config.ts`, `src/lib/contact-schema.ts`, wynik buildu `.vercel/output/static/` i `dist/client/_astro/`, logi CI runów 42070489965, 42071473614, 42075083080."}, {"data": "2026-11-05", "zrodlo": "T-23", "pytanie": "Rebase zamiast `git merge origin/main` przy konflikcie z `main`", "decyzja": "profil workera nie pozwala na `git merge`. Konflikt w `astro.config.mjs` (adapter Node z #11) rozwiązany przez zachowanie obu zmian."}, {"data": "2026-11-05", "zrodlo": "T-23", "pytanie": "Jak sprawdzić CSP lokalnie, skoro `astro preview` ignoruje `vercel.json`?", "decyzja": "test dokleja nagłówek z `vercel.json` przez `page.route`, więc przeglądarka egzekwuje dokładnie tę politykę, która trafi na Vercel."}, {"data": "2026-11-05", "zrodlo": "T-23", "pytanie": "Dodatkowe `object-src 'none'` poza listą z issue?", "decyzja": "dodane, bo to standardowe utwardzenie bez wpływu na stronę."}, {"data": "2026-11-05", "zrodlo": "T-23", "pytanie": "JSON-LD (`<script type=\"application/ld+json\">`) w `script-src`?", "decyzja": "bez zmian: to blok danych, przeglądarka go nie wykonuje i CSP go nie blokuje."}]
ostatnia_synchronizacja: 2026-11-05T20:17:13Z
---

# Status projektu

Plik wspólny, aktualizuje orkiestrator. Frontmatter zapisuje `scripts/sync-status.sh`: liczniki,
`wstrzymania` (wpisy z `/Users/Shared/sh/limity.md`) i `ostatnie_decyzje` (5 najnowszych z `decyzje.md`).
Widok w Obsidianie: `docs/_dashboard.md`.

## Bieżący etap

- `08-qa`: review

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

(brak)
