---
zadania_todo: 10
zadania_in_progress: 0
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 2
zadania_anulowane: 0
pr_otwarte: 0
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-05", "zrodlo": "T-6", "pytanie": "-", "decyzja": "Dodatkowo przeczytane: `docs/02-design/zrodla/.../ISKT-standalone.dc.html` l. 15-233 (mapowanie ikon kafli l. 225-233), `D/ESG.dc.html` l. 40-79 i 245-253, `DS/_ds_bundle.js` l. 105-305 i 478-590, `vitest.config.ts`, `scripts/ci-zakres.sh`."}, {"data": "2026-11-05", "zrodlo": "T-6", "pytanie": "Breadcrumb bez JSON-LD BreadcrumbList", "decyzja": "JSON-LD należy do T3 (meta i SEO, poza zakresem)."}, {"data": "2026-11-05", "zrodlo": "T-6", "pytanie": "Strona 404 bez listy usług", "decyzja": "linki do stron usług dawałyby dziś 404 (strony powstają w kolejnych zadaniach); 404 linkuje do `/` i `/#kompetencje`."}, {"data": "2026-11-05", "zrodlo": "T-6", "pytanie": "`Button` w nagłówku jako rozmiar sm", "decyzja": "najbliższy rozmiar DS do przycisku z designu (0.6rem 1.15rem, `--text-sm`)."}, {"data": "2026-11-05", "zrodlo": "T-6", "pytanie": "Gdzie lista nazw ikon?", "decyzja": "`src/components/ui/icon-names.ts` bez importów `.astro`, żeby `site.ts` i testy jednostkowe nie ładowały komponentów; mapa komponentów w `src/components/ui/icons.ts`."}]
ostatnia_synchronizacja: 2026-11-05T15:14:04Z
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
