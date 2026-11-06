---
zadania_todo: 3
zadania_in_progress: 0
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 16
zadania_anulowane: 0
pr_otwarte: 0
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-06", "zrodlo": "wlasciciel", "pytanie": "Odbiór zlecenia iskt-www (PR #40, etap wydanie)", "decyzja": "kto: właściciel w rozmowie 2026-11-06; na co: strona iskt-www na stagingu, scenariusze odbioru O-1–O-10 i poprawka nagłówka #41 (PR #42); zakres: zlecenie z planu PR #3, M1–M4; deploy prod i przejście na iskt.pl (B9a) wykonuje właściciel. Cofnięcie: polecenie właściciela: nowe zlecenie S z poprawkami"}, {"data": "2026-11-06", "zrodlo": "T-41", "pytanie": "-", "decyzja": "Dodatkowo przeczytane źródła: `docs/02-design/zrodla/Strona firmowa ISKT/ISKT-standalone.dc.html` (wzorzec z issue), `src/layouts/BaseLayout.astro`, `src/components/ui/Button.astro`, `playwright.config.ts`, `lighthouserc.cjs`. Bez zmian."}, {"data": "2026-11-06", "zrodlo": "T-41", "pytanie": "Plik spoza „Zakresu”: zrzuty w `docs/07-realizacja/T-41/*.png`", "decyzja": "wymaga ich kryterium „zrzut porównawczy z wzorcem w raporcie”. Zrobiłem je skryptem tymczasowym (Playwright chromium, zbudowane `dist/client` serwowane statycznie), skryptu nie commituję."}, {"data": "2026-11-06", "zrodlo": "T-41", "pytanie": "Jak zarezerwować wysokość nagłówka bez JavaScriptu (CSP)?", "decyzja": "Wysokość jest stała w zmiennej `--site-header-home-h`: 40 px, a poniżej 520 px dwa rzędy po 40 px + 16 px. Rzędy mają stałą wysokość, a zawijanie CTA wymusza `flex-direction: column` poniżej progu. Próg 520 px to szerokość, przy której logo z nazwą i CTA mieszczą się w jednym rzędzie (≈430 px + marginesy). Wzorzec zawija przez `flex-wrap`, więc przy 430-520 px u nas CTA przechodzi do drugiego rzędu nieco wcześniej. Przy 375, 768 i 1440 px układ jest zgodny."}, {"data": "2026-11-06", "zrodlo": "T-41", "pytanie": "Jak nałożyć nagłówek na hero, skoro `<header>` musi być poza `<main>`, a hero jest w `<main>`?", "decyzja": "Wariant home ma `position: absolute`, a hero rezerwuje miejsce przez `padding-top`. Alternatywy odrzuciłem: `display: contents` na `<main>` ryzykuje utratę landmarku, a tło na `<body>` wymaga znajomości wysokości hero."}]
ostatnia_synchronizacja: 2026-11-06T13:44:50Z
---

# Status projektu

Plik wspólny, aktualizuje orkiestrator. Frontmatter zapisuje `scripts/sync-status.sh`: liczniki,
`wstrzymania` (wpisy z `/Users/Shared/sh/limity.md`) i `ostatnie_decyzje` (5 najnowszych z `decyzje.md`).
Widok w Obsidianie: `docs/_dashboard.md`.

## Bieżący etap

(wszystkie etapy zamknięte)

## Punkt przekazania

Stan po ostatnim kamieniu milowym, potrzebny do wznowienia po `/clear` i „wznów”.

- Czas: 2026-11-06T13:40Z (zlecenie odebrane przez właściciela, wszystkie etapy done)
- Kamień zakończony: M4 i odbiór. 07-realizacja done (PR #39), wydanie done (PR #40, review PASS fba6d7f, odbiór właściciela w `decyzje.md`). Poprawka z odbioru: #41 nagłówek strony głównej (PR #42, iteracja 2, PASS)
- Kamień bieżący: brak — zlecenie zakończone (16 zadań: 12 planu, 3 QA, 1 z odbioru)
- PR w toku: brak
- Eskalacje: brak otwartych
- Wstrzymania: brak
- `shctl doctor` 2026-11-05T14:12Z: 0 błędów
- Autoryzacja: „Autoryzacja planu PR #3” wygasła z odbiorem zlecenia; nowe prace tylko jako nowe zlecenie
- Wysyłka formularza na stagingu: `formularz@iskt.pl` → `biuro@iskt.pl`, Reply-To klienta (decyzja właściciela 2026-11-06)
- Worktree etapów usunięte
- Następny krok: właściciel — przejście na iskt.pl i deploy prod według B9a (`docs/wydanie/techniczna/dokumentacja-techniczna.md`); drobne uwagi w `backlog-drobne.md` do ewentualnego zlecenia S

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
- 2026-11-06 `wydanie`: done

## Otwarte eskalacje

(brak)
