---
zadania_todo: 11
zadania_in_progress: 0
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 1
zadania_anulowane: 0
pr_otwarte: 0
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-05", "zrodlo": "T-5", "pytanie": "`RATE_LIMIT_PROVIDER`", "decyzja": "wartości `waf` (domyślnie), `upstash`, `memory` (ADR-003: pamięć lokalnie i w testach); `RATE_LIMIT_SALT` wymagana tylko dla `upstash`."}, {"data": "2026-11-05", "zrodlo": "T-5", "pytanie": "Port E2E", "decyzja": "`astro preview` na 55327 (blok 55321-55329), żeby nie kolidować z `pnpm dev` na 55326."}, {"data": "2026-11-05", "zrodlo": "T-5", "pytanie": "Dowód renderowania przez BaseLayout", "decyzja": "atrybut `data-layout=\"base\"` na `<html>` ustawiany tylko w `BaseLayout.astro`."}, {"data": "2026-11-05", "zrodlo": "T-5", "pytanie": "Region fra1", "decyzja": "w `vercel.json` (`regions`), bo adapter `@astrojs/vercel` 8 nie ma opcji regionu."}, {"data": "2026-11-05", "zrodlo": "T-5", "pytanie": "Zapis hex w tokenach", "decyzja": "małe litery (Prettier); test 1:1 porównuje wartości bez rozróżniania wielkości liter, a smoke porównuje `--color-primary` z `#1E551D` po `toUpperCase`."}]
ostatnia_synchronizacja: 2026-11-05T14:36:32Z
---

# Status projektu

Plik wspólny, aktualizuje orkiestrator. Frontmatter zapisuje `scripts/sync-status.sh`: liczniki,
`wstrzymania` (wpisy z `/Users/Shared/sh/limity.md`) i `ostatnie_decyzje` (5 najnowszych z `decyzje.md`).
Widok w Obsidianie: `docs/_dashboard.md`.

## Bieżący etap

- `07-realizacja`: todo (następny)

## Punkt przekazania

Stan po ostatnim kamieniu milowym, potrzebny do wznowienia po `/clear` i „wznów”.

- Czas: 2026-11-05T14:12Z (przed pierwszym dispatchem)
- Kamień: M1 startuje; etapy 00, 04, 05, 06 `done`
- `shctl doctor`: 0 błędów (uwaga: 3 stare repo testowe do usunięcia, nie dotyczy projektu)
- Autoryzacja: wiersz „Autoryzacja planu PR #3” w `decyzje.md`; start workerów na sygnał właściciela 2026-11-05 („start”)
- Zadania właściciela: Vercel (projekt, alias https://iskt-www.vercel.app, zmienne Production+Preview) i Resend (klucz, `.env.local`) gotowe; region fra1 do potwierdzenia; reguła WAF przed QA M2
- Eskalacje: brak otwartych
- Następny krok: dispatch #5 (szkielet), do jego zamknięcia nic innego

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

## Otwarte eskalacje

(brak)
