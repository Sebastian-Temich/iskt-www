---
zadania_todo: 1
zadania_in_progress: 0
zadania_review: 1
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 17
zadania_anulowane: 0
pr_otwarte: 1
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-06", "zrodlo": "T-43", "pytanie": "Zrzuty porównawcze w `docs/07-realizacja/T-43/` (obok raportu)", "decyzja": "kryterium wymaga ich w raporcie; zrobione tymczasowym specem Playwright, usuniętym przed commitem."}, {"data": "2026-11-06", "zrodlo": "T-43", "pytanie": "Jak zmieścić nagłówek w jednym rzędzie od 360 px?", "decyzja": "mniejsza nazwa marki i padding CTA poniżej 768 px, a poniżej 430 px ukrycie wizualne słowa „Greennovation” (z dopuszczalnych opcji z kryterium). Font i wysokość CTA bez zmian, żeby przycisk był czytelny i miał obszar kliknięcia 40 px. Próg 430 px: przy 440 px pełna nazwa mieści się (zrzut), a przy 390 px wnętrze ma ok. 350 px, mniej niż szacowane ok. 385 px na logo, pełną nazwę i CTA."}, {"data": "2026-11-06", "zrodlo": "T-43", "pytanie": "Zmiana pliku spoza listy „Zakres”", "decyzja": "`src/components/layout/SiteHeader.astro`, bo kryterium z odbioru właściciela (komentarz w #43) dotyczy nagłówka strony głównej; zmiany tylko w regułach wariantu `home`, wariant `page` bez zmian. `e2e/qa/QA-M1-1-wydajnosc.spec.ts` jest w `e2e/` (zakres): zmienione widoki pomiaru, bo na 375 px nie ma już logo."}, {"data": "2026-11-06", "zrodlo": "T-43", "pytanie": "`ComparisonTable` w wariancie `subtle` dostaje też krawędź górną", "decyzja": "tak jest we wzorcu (l. 164); wariant domyślny bez zmian."}, {"data": "2026-11-06", "zrodlo": "T-43", "pytanie": "Szerokość leadu ServiceHero jako wariant klasy, nie liczba w stylu inline", "decyzja": "CSP `style-src 'self'` bez `'unsafe-inline'` blokuje atrybut `style`."}]
ostatnia_synchronizacja: 2026-11-06T19:23:24Z
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
