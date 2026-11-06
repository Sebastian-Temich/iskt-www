---
zadania_todo: 1
zadania_in_progress: 0
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 15
zadania_anulowane: 0
pr_otwarte: 1
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-06", "zrodlo": "wlasciciel", "pytanie": "Docelowa wysyłka formularza na stagingu: CONTACT_FROM z domeny iskt.pl (formularz@iskt.pl), CONTACT_TO=biuro@iskt.pl, klucz Resend z dostępem do iskt.pl; właściciel sprawdził, działa", "decyzja": "kto: właściciel w rozmowie 2026-11-06; przyczyna E-006: nadawca testowy onboarding@resend.dev wysyła tylko na adres konta Resend, domena iskt.pl była już zweryfikowana w Resend; wysyłka z adresu klienta niemożliwa (Resend i DMARC), klient w Reply-To; zakres: zmienne Vercel ustawione przez właściciela, bez zmian kodu. Cofnięcie: polecenie właściciela: przywrócenie poprzednich zmiennych w Vercel i redeploy"}, {"data": "2026-11-06", "zrodlo": "wlasciciel", "pytanie": "B+R: „Pozostałe kompetencje” bez chipu Interim, zgodnie z designem (Projekty-BR.dc.html:246-250)", "decyzja": "kto: właściciel w rozmowie 2026-11-06; uwaga z QA M3 (backlog-drobne); Interim osiągalny z B+R przez logo i kafle strony głównej. Cofnięcie: zlecenie S: chip Interim w projekty-br.astro i próg w e2e/qa/M3-scenariusze.spec.ts"}, {"data": "2026-11-06", "zrodlo": "wlasciciel", "pytanie": "O-6 potwierdzony przez właściciela w opengraph.xyz (strona główna stagingu): og:title, og:description i og:image (PNG 294 KB) obecne, obraz się ładuje", "decyzja": "kto: właściciel w rozmowie 2026-11-06; ostrzeżenia walidatora (tytuł 66 znaków > 60, opis 154 > ~125 w podglądach, obraz bez wezwania do działania) to zalecenia, nie kryteria W-07 (opis ≤ 160 spełniony); przeniesione do backlog-drobne. Cofnięcie: nie dotyczy (wynik testu)"}, {"data": "2026-11-06", "zrodlo": "wlasciciel", "pytanie": "O-3 na stagingu potwierdzony przez właściciela: formularz https://iskt-www.vercel.app/#kontakt wysyła e-mail (nadawca onboarding@resend.dev, odbiorca testowy właściciela)", "decyzja": "kto: właściciel w rozmowie 2026-11-06; rozwiązanie E-006/C: CONTACT_TO w Vercel (Production i Preview) ustawiony na adres konta Resend, redeploy stagingu; zamyka niespełnione kryteria W-04 (wysyłka) i W-12 (testowy klucz, adres testowy) z raportów QA M2 i M4. Cofnięcie: nie dotyczy (wynik testu); na produkcji CONTACT_FROM z domeny iskt.pl i skrzynka firmowa w kroku B9a"}, {"data": "2026-11-06", "zrodlo": "qa", "pytanie": "QA M4 bez nowych testów w e2e/qa/", "decyzja": "wymagania M4 pokrywa e2e/cross/ z #15, a pomiar Lighthouse na stagingu nie może działać w CI (PR #38). Cofnięcie: dopisanie testów e2e/qa/M4-*.spec.ts"}]
ostatnia_synchronizacja: 2026-11-06T11:57:06Z
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
