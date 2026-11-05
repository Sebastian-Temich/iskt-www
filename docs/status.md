---
zadania_todo: 5
zadania_in_progress: 1
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 9
zadania_anulowane: 0
pr_otwarte: 1
ci_fail: 1
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-05", "zrodlo": "T-29", "pytanie": "Co sprawdza test QA-M1-1 zamiast braku arkuszy?", "decyzja": "brak `<style>` inline i arkusze wyłącznie z `/_astro/` tego samego źródła, bo to warunek zgodności z CSP i odwrotność poprzedniego założenia; sprawdzenie tokenu koloru zostaje."}, {"data": "2026-11-05", "zrodlo": "T-29", "pytanie": "CSS wbudowany (`'always'`, T-22) czy CSS w plikach (`'never'`, T-23)?", "decyzja": "`'never'`: CSP `style-src 'self'` bez `'unsafe-inline'` jest wymaganiem architektury, a wbudowany CSS wymagałby `'unsafe-inline'` albo hashy generowanych przy każdej zmianie stylów. W-10 jest spełnione również z CSS w plikach (Lighthouse mobile QA M2: 98, 99, 96)."}, {"data": "2026-11-05", "zrodlo": "wlasciciel", "pytanie": "E-006: wysyłka e-maila na stagingu (W-04, O-3) sprawdzana przy odbiorze końcowym, nie w QA M2", "decyzja": "kto: właściciel 2026-11-05, E-006 opcja C; na co: kontynuacja M3 mimo niedziałającej wysyłki przez Resend (403: CONTACT_TO inny niż adres konta Resend); zakres: konfiguracja CONTACT_TO/Resend do poprawy przez właściciela przed odbiorem; do kiedy: odbiór zlecenia (etap wydanie); ryzyko: ścieżka W-04 niesprawdzona do końca. Cofnięcie: polecenie właściciela: opcja A albo B z E-006 i ponowny test O-3 przez QA"}, {"data": "2026-11-05", "zrodlo": "qa", "pytanie": "Pomiar reguły WAF żądaniami z niepoprawnym ciałem (400) zamiast honeypota (200)", "decyzja": "błąd cytowania w pętli; reguła liczy żądania przed funkcją, w dwóch oknach dokładnie 5 przeszło, 6. → 429; żaden e-mail nie został wysłany. Cofnięcie: powtórka O-5 przez właściciela przy odbiorze"}, {"data": "2026-11-05", "zrodlo": "qa", "pytanie": "Test „CSS wbudowany” (e2e/qa/QA-M1-1-wydajnosc.spec.ts:26) bez test.fixme w PR QA M2", "decyzja": "QA nie zmienia plików spoza e2e/qa/MN-*, a zmiana uruchomiłaby lint; naprawa QA-M2-1 (#29) obejmuje ten test. Cofnięcie: #29 przed zadaniami M3"}]
ostatnia_synchronizacja: 2026-11-05T21:49:33Z
---

# Status projektu

Plik wspólny, aktualizuje orkiestrator. Frontmatter zapisuje `scripts/sync-status.sh`: liczniki,
`wstrzymania` (wpisy z `/Users/Shared/sh/limity.md`) i `ostatnie_decyzje` (5 najnowszych z `decyzje.md`).
Widok w Obsidianie: `docs/_dashboard.md`.

## Bieżący etap

- `08-qa`: in-progress

## Punkt przekazania

Stan po ostatnim kamieniu milowym, potrzebny do wznowienia po `/clear` i „wznów”.

- Czas: 2026-11-05T21:25Z (po QA M2)
- Kamień zakończony: M2 funkcjonalnie (#9, #11 zamknięte; naprawy QA M1 #22, #23 zamknięte). QA M2 PR #28 scalony, werdykt FAIL: 🟡 QA-M2-1 → #29 (zdublowany klucz `build` w `astro.config.mjs`, lint/typecheck/E2E czerwone na `main`); wysyłka e-maila nie działa (Resend 403 dla `CONTACT_TO`) → E-006. CSP na stagingu i reguła WAF (6. POST → 429) potwierdzone
- Kamień bieżący: M2 (naprawa #29), M3 wstrzymany
- PR w toku: brak (worker #29 pracuje, panel `worker:iskt-www:29`)
- Eskalacje: E-006 otwarta (08-qa, konfiguracja Resend: opcje A/B/C)
- Wstrzymania: M3 (#10 gotowe) do rozstrzygnięcia E-006 i zamknięcia #29 (bez #29 CI każdego PR z kodem jest czerwone)
- `shctl doctor` 2026-11-05T14:12Z: 0 błędów
- Autoryzacja: „Autoryzacja planu PR #3” w `decyzje.md`
- Zadania właściciela: E-006; O-3 (odbiór e-maila i `Reply-To` w skrzynce) po E-006; O-6 podgląd w walidatorze OG przy odbiorze
- Worktree QA `/Users/Shared/sh/wt/iskt-www/stage-08-qa` założony ręcznie (brak komendy shctl); do usunięcia
- Następny krok: monitoring #29 (`shctl task wait 29`); po E-006/A ponowny test O-3 na stagingu i dopisek do `raport-M2.md`; potem start M3 (#10)

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

## Otwarte eskalacje

(brak)
