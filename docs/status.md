---
zadania_todo: 0
zadania_in_progress: 0
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 16
zadania_anulowane: 0
pr_otwarte: 1
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-06", "zrodlo": "T-41", "pytanie": "-", "decyzja": "Dodatkowo przeczytane źródła: `docs/02-design/zrodla/Strona firmowa ISKT/ISKT-standalone.dc.html` (wzorzec z issue), `src/layouts/BaseLayout.astro`, `src/components/ui/Button.astro`, `playwright.config.ts`, `lighthouserc.cjs`. Bez zmian."}, {"data": "2026-11-06", "zrodlo": "T-41", "pytanie": "Plik spoza „Zakresu”: zrzuty w `docs/07-realizacja/T-41/*.png`", "decyzja": "wymaga ich kryterium „zrzut porównawczy z wzorcem w raporcie”. Zrobiłem je skryptem tymczasowym (Playwright chromium, zbudowane `dist/client` serwowane statycznie), skryptu nie commituję."}, {"data": "2026-11-06", "zrodlo": "T-41", "pytanie": "Jak zarezerwować wysokość nagłówka bez JavaScriptu (CSP)?", "decyzja": "Wysokość jest stała w zmiennej `--site-header-home-h`: 40 px, a poniżej 520 px dwa rzędy po 40 px + 16 px. Rzędy mają stałą wysokość, a zawijanie CTA wymusza `flex-direction: column` poniżej progu. Próg 520 px to szerokość, przy której logo z nazwą i CTA mieszczą się w jednym rzędzie (≈430 px + marginesy). Wzorzec zawija przez `flex-wrap`, więc przy 430-520 px u nas CTA przechodzi do drugiego rzędu nieco wcześniej. Przy 375, 768 i 1440 px układ jest zgodny."}, {"data": "2026-11-06", "zrodlo": "T-41", "pytanie": "Jak nałożyć nagłówek na hero, skoro `<header>` musi być poza `<main>`, a hero jest w `<main>`?", "decyzja": "Wariant home ma `position: absolute`, a hero rezerwuje miejsce przez `padding-top`. Alternatywy odrzuciłem: `display: contents` na `<main>` ryzykuje utratę landmarku, a tło na `<body>` wymaga znajomości wysokości hero."}, {"data": "2026-11-06", "zrodlo": "wlasciciel", "pytanie": "Odbiór wstrzymany: poprawka nagłówka strony głównej (#41) przed akceptacją; reszta scenariuszy odbioru OK", "decyzja": "kto: właściciel przy odbiorze 2026-11-06; nagłówek home niezgodny z ISKT-standalone.dc.html i architektura.md:153/194 (belka z krawędzią, dodatkowy link Kompetencje); zakres autoryzacji planu PR #3 (W-01, W-02). Cofnięcie: polecenie właściciela: odbiór bez poprawki i task cancel 41"}]
ostatnia_synchronizacja: 2026-11-06T13:28:11Z
---

# Status projektu

Plik wspólny, aktualizuje orkiestrator. Frontmatter zapisuje `scripts/sync-status.sh`: liczniki,
`wstrzymania` (wpisy z `/Users/Shared/sh/limity.md`) i `ostatnie_decyzje` (5 najnowszych z `decyzje.md`).
Widok w Obsidianie: `docs/_dashboard.md`.

## Bieżący etap

- `wydanie`: review

## Punkt przekazania

Stan po ostatnim kamieniu milowym, potrzebny do wznowienia po `/clear` i „wznów”.

- Czas: 2026-11-06T10:50Z (M4 zakończony, wszystkie kamienie i QA zamknięte, przed odbiorem)
- Kamień zakończony: M4 (#15, #16 zamknięte). QA M4 PR #38 scalony (9ff8137), review PASS, werdykt PASS, brak błędów; E2E 528 testów (526 pass, 2 skip), Lighthouse stagingu 7 stron mobile i desktop ≥ 97. Etap `08-qa`: done
- Kamień bieżący: brak — plan zrealizowany (16 zadań, M1–M4, QA M1–M4)
- PR w toku: brak
- Eskalacje: brak otwartych
- Wstrzymania: brak
- `shctl doctor` 2026-11-05T14:12Z: 0 błędów
- Autoryzacja: „Autoryzacja planu PR #3” w `decyzje.md` (do odbioru zlecenia)
- Zadania właściciela przed odbiorem: O-3 zrobione 2026-11-06 (Resend poprawiony, e-mail dotarł; `decyzje.md`), do sprawdzenia przy odbiorze `Reply-To`; O-6 potwierdzony w opengraph.xyz; O-10 podgląd strony usługi (opcjonalnie, meta sprawdzone w QA M3); chip Interim: zostaje jak w designie
- Worktree QA `/Users/Shared/sh/wt/iskt-www/stage-08-qa` założony ręcznie (brak komendy shctl); do usunięcia
- Następny krok: „Odbiór” — PR `stage/07-realizacja` z polami `DoD.md` realizacji, potem `stage/wydanie`; review etapów, `shctl checkpoint wydanie`, akceptacja właściciela

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
- 2026-11-06 `08-qa`: done
- 2026-11-06 `07-realizacja`: in-progress
- 2026-11-06 `07-realizacja`: review
- 2026-11-06 `07-realizacja`: done
- 2026-11-06 `wydanie`: in-progress
- 2026-11-06 `wydanie`: review

## Otwarte eskalacje

(brak)
