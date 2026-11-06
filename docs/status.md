---
zadania_todo: 1
zadania_in_progress: 0
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 18
zadania_anulowane: 0
pr_otwarte: 0
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-06", "zrodlo": "T-44", "pytanie": "-", "decyzja": "Dodatkowo przeczytane źródła: `src/components/layout/Seo.astro`, `src/pages/index.astro`, `docs/decyzje.md` i `docs/status.md` (decyzja właściciela o wysyłce z 2026-11-06), kod `@astrojs/vercel` (`dist/index.js`) i pola `engines` zależności. Nic w nich nie zmieniałem."}, {"data": "2026-11-06", "zrodlo": "T-44", "pytanie": "Pliki spoza „Zakresu” w iteracji 2: `docs/04-architektura/adr/ADR-005-node-22-zamiast-26.md` i `AGENTS.md` (wiersz „Instalacja”)", "decyzja": "wymaga ich zgłoszenie 🟡 z review (zmiana kontraktu wymaga ADR) i polecenie orkiestratora. Wiersz „Node” w tabeli kontraktu stałego („LTS przez fnm”) bez zmian, bo 22 to LTS."}, {"data": "2026-11-06", "zrodlo": "T-44", "pytanie": "Plik spoza „Zakresu”: `docs/07-realizacja/T-44.md`", "decyzja": "raport wymagany przez proces."}, {"data": "2026-11-06", "zrodlo": "T-44", "pytanie": "Plik spoza „Zakresu”: `src/content/seo.test.ts`", "decyzja": "test jednostkowy limitów wymaga kryterium „Testy SEO (unit/E2E)”, a testy unit leżą obok `seo.ts`."}, {"data": "2026-11-06", "zrodlo": "T-44", "pytanie": "Jak skrócić treść?", "decyzja": "Usunąłem słowa powtórzone albo najmniej istotne („i wdrożenia”, „raportowanie”, „dedykowane”, w tytule „dla firm”). Marki i „Żory” w tytule nie ruszałem. Treść czeka na akceptację właściciela (tabela w „Co zrobiono”)."}]
ostatnia_synchronizacja: 2026-11-06T19:24:08Z
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
