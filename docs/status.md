---
zadania_todo: 1
zadania_in_progress: 0
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 14
zadania_anulowane: 0
pr_otwarte: 0
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-06", "zrodlo": "T-15", "pytanie": "Iteracja 2: minima z designu", "decyzja": "tylko elementy z selektora kryterium (`p` itd.), dla których pliki designu podają rozmiar > 16 px; tokeny designu nie mają wariantu mobile, więc minimum obowiązuje na 375 px. Polityka prywatności i 404 nie mają pliku designu, więc nie mają minimów ponad 16 px."}, {"data": "2026-11-06", "zrodlo": "T-15", "pytanie": "Iteracja 2: pomiar Lighthouse wersji z PR", "decyzja": "build Vercel commita PR serwowany lokalnie (`npx serve` na porcie 55328 z bloku projektu), bo preview jest za Deployment Protection, a bypass to dostęp, o który worker nie prosi sam (eskalacja E-008)."}, {"data": "2026-11-06", "zrodlo": "T-15", "pytanie": "`LH_BASE_URL`, `LH_PRESET`, `LH_ENV`, `LH_RUNS`, `CHROME_PATH` w `.env.example`?", "decyzja": "tak (review iter. 1), ale profil workera blokuje edycję pliku; wpisy czekają na E-008."}, {"data": "2026-11-06", "zrodlo": "T-15", "pytanie": "-", "decyzja": "Lighthouse mierzy 7 stron W-01 (W-10); polityka i 404 są tylko w E2E."}, {"data": "2026-11-06", "zrodlo": "T-15", "pytanie": "`pnpm lh:staging`", "decyzja": "`node lighthouserc.cjs <adres>`: ten sam plik jest konfiguracją LHCI i skryptem uruchamiającym oba profile, bo LHCI przyjmuje jeden preset na przebieg, a `scripts/` jest poza „Zakresem”. Katalog roboczy `.lighthouseci/` w `test-results/lighthouse/` (ignorowany przez git, ESLint i Prettier)."}]
ostatnia_synchronizacja: 2026-11-06T09:21:34Z
---

# Status projektu

Plik wspólny, aktualizuje orkiestrator. Frontmatter zapisuje `scripts/sync-status.sh`: liczniki,
`wstrzymania` (wpisy z `/Users/Shared/sh/limity.md`) i `ostatnie_decyzje` (5 najnowszych z `decyzje.md`).
Widok w Obsidianie: `docs/_dashboard.md`.

## Bieżący etap

- `08-qa`: in-progress

## Punkt przekazania

Stan po ostatnim kamieniu milowym, potrzebny do wznowienia po `/clear` i „wznów”.

- Czas: 2026-11-06T00:30Z (M3 zakończony, QA M3 scalone, start M4)
- Kamień zakończony: M3 (#10, #12, #13, #14 zamknięte). QA M3 PR #35 scalony (e2905cc), review PASS, werdykt PASS, brak błędów 🔴/🟡; 1 drobna uwaga w `backlog-drobne.md` (B+R bez chipu Interim); O-10 podgląd w walidatorze OG do odbioru
- Kamień bieżący: M4 (#15 dispatch, #16 zależy od #15)
- PR w toku: brak
- Eskalacje: brak otwartych (E-007 zamknięta: repo publiczne, decyzja właściciela)
- Wstrzymania: brak
- `shctl doctor` 2026-11-05T14:12Z: 0 błędów
- Autoryzacja: „Autoryzacja planu PR #3” w `decyzje.md`
- Zadania właściciela: poprawa `CONTACT_TO`/Resend przed odbiorem (E-006/C), potem O-3; O-6 i O-10 podgląd w walidatorze OG przy odbiorze
- Worktree QA `/Users/Shared/sh/wt/iskt-www/stage-08-qa` założony ręcznie (brak komendy shctl); do usunięcia po QA M4
- Następny krok: monitoring #15 (`shctl task wait 15`), review, zamknięcie, dispatch #16; po M4: QA M4 (`sh-qa`), potem odbiór

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
- 2026-11-06 `08-qa`: review
- 2026-11-06 `08-qa`: in-progress

## Otwarte eskalacje

(brak)
