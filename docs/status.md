---
zadania_todo: 8
zadania_in_progress: 1
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 3
zadania_anulowane: 0
pr_otwarte: 1
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-05", "zrodlo": "T-7", "pytanie": "-", "decyzja": "Dodatkowo przeczytane: `<head>` (l. 1-22) siedmiu plików `D/*.dc.html`, `D/sitemap.xml`, `D/robots.txt`, `D/assets/*`, `src/lib/env.ts`, `src/content/site.ts`, `docs/07-realizacja/T-6.md`, `.github/workflows/ci.yml`, `playwright.config.ts`, `node_modules/@astrojs/vercel/dist/index.js` (kolejność hooków i kopiowanie do `.vercel/output`)."}, {"data": "2026-11-05", "zrodlo": "T-7", "pytanie": "Favicony i obraz OG", "decyzja": "wygenerowane jednorazowo skryptem z `sharp` (poza repo); obraz OG używa systemowego kroju sans (Helvetica Neue), bo `sharp`/librsvg nie czyta `woff2` Inter."}, {"data": "2026-11-05", "zrodlo": "T-7", "pytanie": "Jak przetestować e2e obie wartości `PUBLIC_SITE_ENV` przy jednym serwerze testów (`playwright.config.ts` poza zakresem)?", "decyzja": "Serwer testów to staging (wartość domyślna); test „produkcja” uruchamia drugi `astro build --outDir` w katalogu wyników testu z `PUBLIC_SITE_ENV=production` i czyta pliki. Build nadpisuje `.vercel/output`, więc test robi kopię i ją przywraca."}, {"data": "2026-11-05", "zrodlo": "T-7", "pytanie": "Strona bez wpisu (404)", "decyzja": "bez canonical i `og:url`, z `noindex`."}, {"data": "2026-11-05", "zrodlo": "T-7", "pytanie": "`BaseLayout` props `title`/`description`", "decyzja": "opcjonalne, używane tylko dla stron bez wpisu w `seo.ts` (404); dla stron z wpisem wygrywa `seo.ts`, więc tymczasowy tytuł w `index.astro` jest ignorowany."}]
ostatnia_synchronizacja: 2026-11-05T15:31:08Z
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
