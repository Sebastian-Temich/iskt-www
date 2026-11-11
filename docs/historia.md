# Historia projektu

Punkt przekazania wpisuje orkiestrator po kamieniu milowym, dziennik etapów `shctl stage`, a listę
zadań `scripts/sync-status.sh`.

## Punkt przekazania

- **2026-11-11** (migracja na proces v2, SH-lite faza 10): `wersja_procesu: 2`; etapy
  `04-architektura` i `05-plan` scalone w `04-plan/plan.md`, DoD etapów 01–03 i 07 usunięte,
  `status.md` zastąpiony przez `Projekt.md` i ten plik, karty funkcji W-01…W-12 dla stanu obecnego w
  `00-intake/funkcje/`, `staging_url` https://iskt-www.vercel.app. Zadania w toku: brak. Eskalacje:
  brak otwartych. Następny krok: produkcja (B9a) albo nowe zlecenie na polecenie właściciela.
- **2026-11-06T13:40Z** (zlecenie odebrane przez właściciela, wszystkie etapy done): kamień M4 i
  odbiór. 07-realizacja done (PR #39), wydanie done (PR #40, review PASS fba6d7f, odbiór właściciela
  w `decyzje.md`). Poprawka z odbioru: #41 nagłówek strony głównej (PR #42, iteracja 2, PASS). Kamień
  bieżący: brak — zlecenie zakończone (16 zadań: 12 planu, 3 QA, 1 z odbioru). PR w toku: brak.
  Eskalacje: brak otwartych. Wstrzymania: brak. `shctl doctor` 2026-11-05T14:12Z: 0 błędów.
  Autoryzacja: „Autoryzacja planu PR #3” wygasła z odbiorem zlecenia; nowe prace tylko jako nowe
  zlecenie. Wysyłka formularza na stagingu: `formularz@iskt.pl` → `biuro@iskt.pl`, Reply-To klienta
  (decyzja właściciela 2026-11-06). Worktree etapów usunięte. Następny krok: brak — produkcja
  odłożona przez właściciela 2026-11-09 (projekt na `main`); B9a i ewentualne zlecenie S na
  `deploy-prod.sh` dopiero na jego polecenie. Zlecenie S po odbiorze (#43–#45) zamknięte.

## Dziennik etapów

Wpisy do 2026-11-06 z procesu v1 (etapy `04-architektura` i `05-plan` to dziś `04-plan`).

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
- 2026-11-11 `04-plan`: done (migracja v2: scalenie `04-architektura` i `05-plan`)

<!-- historia:start -->
<!-- Blok generuje scripts/sync-status.sh. Nie edytuj go ręcznie. -->

## Wszystkie zadania zrobione (19)

| Zadanie | Kamień | PR | Zamknięte |
|---|---|---|---|
| #45 Higiena kodu i testów: visually-hidden, nazwy testów, port Playwright | - | #48 | 2026-11-08 |
| #44 SEO strony głównej i dokumentacja wydania po odbiorze | - | #46 | 2026-11-06 |
| #43 Mobile i zgodność z designem: logo w hero, przyciski, formularz, drobne różnice stron usług | - | #47 | 2026-11-06 |
| #41 Odbiór: nagłówek strony głównej niezgodny z designem (belka i link Kompetencje) | M4 Jakość i wydanie | #42 | 2026-11-06 |
| #16 Dokumentacja wydania (techniczna i produktowa) | M4 Jakość i wydanie | #37 | 2026-11-06 |
| #15 Jakość przekrojowa - E2E wszystkich stron i Lighthouse na stagingu | M4 Jakość i wydanie | #36 | 2026-11-06 |
| #14 Strona Projekty B+R z FAQ | M3 Strony usług | #34 | 2026-11-05 |
| #12 Strony AI-transformacja i Oprogramowanie | M3 Strony usług | #33 | 2026-11-05 |
| #13 Strony Interim i Startupy | M3 Strony usług | #32 | 2026-11-05 |
| #10 Komponenty stron usług i strona ESG | M3 Strony usług | #31 | 2026-11-05 |
| #29 QA M2: zdublowany klucz build w astro.config.mjs po #22 i #23 - lint, typecheck i E2E czerwone na main | M2 Formularz kontaktowy end-to-end | #30 | 2026-11-05 |
| #22 QA M1: Lighthouse mobile - wydajność strony głównej 87-89 (< 90) | M1 Szkielet, layout i strona główna | #27 | 2026-11-05 |
| #23 QA M1: brak nagłówka Content-Security-Policy z architektury | M1 Szkielet, layout i strona główna | #24 | 2026-11-05 |
| #11 Formularz kontaktowy end-to-end - walidacja, endpoint, Resend, rate limit | M2 Formularz kontaktowy end-to-end | #26 | 2026-11-05 |
| #9 Strona polityki prywatności z roboczą treścią | M2 Formularz kontaktowy end-to-end | #25 | 2026-11-05 |
| #8 Strona główna - hero, kompetencje, sekcja kontaktu | M1 Szkielet, layout i strona główna | #19 | 2026-11-05 |
| #7 SEO techniczne - meta, Open Graph, sitemap, robots, favicony | M1 Szkielet, layout i strona główna | #20 | 2026-11-05 |
| #6 Layout strony i prymitywy UI, strona 404 | M1 Szkielet, layout i strona główna | #18 | 2026-11-05 |
| #5 Szkielet projektu Astro, CI, tokeny i czcionki | M1 Szkielet, layout i strona główna | #17 | 2026-11-05 |
<!-- historia:end -->
