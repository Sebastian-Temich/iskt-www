---
zadania_todo: 0
zadania_in_progress: 0
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 19
zadania_anulowane: 0
pr_otwarte: 0
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-09", "zrodlo": "T-45", "pytanie": "Test układu formularza w `home.spec.ts` też miał „bez wysyłki” w nazwie (założenie z M1)", "decyzja": "zmieniona nazwa na „bez action”, bo ten test sprawdza brak atrybutu `action`, a „bez wysyłki” sugerowało, że formularz nic nie wysyła."}, {"data": "2026-11-09", "zrodlo": "T-45", "pytanie": "Czy `E2E_PORT` trafia do `.env.example`?", "decyzja": "tak (iteracja 2, zgłoszenie 🟡 z review). Zakres zadania rozszerzył orkiestrator o `.env.example`. Wpis wykonał orkiestrator, bo profil workera odrzucał Edit tego pliku mimo `allow: Edit(.env.example)`. W iteracji 1 wpisu nie było, z tego samego powodu."}, {"data": "2026-11-09", "zrodlo": "T-45", "pytanie": "Nazwa zmiennej portu", "decyzja": "`E2E_PORT`, bo `PORT` czytają inne narzędzia (np. serwery Node) i mogłaby przypadkiem zmienić port testów."}, {"data": "2026-11-09", "zrodlo": "T-45", "pytanie": "Skąd lista stron w „linki wewnętrzne bez 404”?", "decyzja": "z `e2e/cross/pages.ts` (`W01_PAGES`, `POLICY_PAGE`), a nie dopisanie jednego adresu, bo wszystkie strony W-01 już istnieją i lista nie rozjedzie się ponownie."}, {"data": "2026-11-09", "zrodlo": "T-45", "pytanie": "Jak sprawdzić status strony po kliknięciu kafla bez `waitForNavigation`?", "decyzja": "`waitForURL` plus osobne `request.get(href)` z oczekiwanym 200. `waitForResponse` dla nawigacji mógłby zawisnąć w WebKit, gdy strona przyjdzie z pamięci podręcznej (stary komentarz wspominał 304), a osobne żądanie sprawdza status ściślej (200 zamiast < 400)."}]
ostatnia_synchronizacja: 2026-11-08T23:08:23Z
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
- Następny krok: brak — produkcja odłożona przez właściciela 2026-11-09 (projekt na `main`); B9a i ewentualne zlecenie S na `deploy-prod.sh` dopiero na jego polecenie. Zlecenie S po odbiorze (#43–#45) zamknięte

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
