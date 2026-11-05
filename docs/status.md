---
zadania_todo: 8
zadania_in_progress: 0
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 4
zadania_anulowane: 0
pr_otwarte: 0
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-05", "zrodlo": "T-8", "pytanie": "-", "decyzja": "Dodatkowo przeczytane źródła: `docs/02-design/zrodla/Strona firmowa ISKT/ISKT-standalone.dc.html`, `_ds/…/_ds_bundle.js` (l. 755-845, 1097-1166), `src/layouts/BaseLayout.astro`, `src/components/layout/SiteHeader.astro`, prymitywy `src/components/ui/*`, `src/pages/404.astro`, `e2e/layout.spec.ts`, `playwright.config.ts`, `docs/07-realizacja/T-6.md` (format raportu). Pliki spoza „Zakresu” nie były zmieniane."}, {"data": "2026-11-05", "zrodlo": "T-8", "pytanie": "Dane kontaktowe w sekcji", "decyzja": "tylko adres i NIP/REGON jak w designie (l. 160-163); e-mail i telefon są w stopce."}, {"data": "2026-11-05", "zrodlo": "T-8", "pytanie": "`Field`", "decyzja": "jeden komponent dla Input i Textarea (`type=\"textarea\"`), `*` z `aria-hidden` (wymagalność przekazuje atrybut `required`), `aria-invalid` i komunikat błędu gotowe dla T6."}, {"data": "2026-11-05", "zrodlo": "T-8", "pytanie": "Kontrolki hero na 375 px", "decyzja": "przyciski na całą szerokość poniżej 480 px (wzorzec z `404.astro`), a kolumny hero i kontaktu `minmax(min(300px, 100%), 1fr)`, żeby nie wymuszać poziomego scrolla."}, {"data": "2026-11-05", "zrodlo": "T-8", "pytanie": "Logo hero: `loading`", "decyzja": "`eager` zamiast `lazy` z designu, bo jest w pierwszym ekranie na desktopie (LCP); dekoracyjne `alt=\"\"` jak w designie."}]
ostatnia_synchronizacja: 2026-11-05T16:20:09Z
---

# Status projektu

Plik wspólny, aktualizuje orkiestrator. Frontmatter zapisuje `scripts/sync-status.sh`: liczniki,
`wstrzymania` (wpisy z `/Users/Shared/sh/limity.md`) i `ostatnie_decyzje` (5 najnowszych z `decyzje.md`).
Widok w Obsidianie: `docs/_dashboard.md`.

## Bieżący etap

- `08-qa`: review

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
- 2026-11-05 `08-qa`: in-progress
- 2026-11-05 `08-qa`: review
- 2026-11-05 `08-qa`: iteracja 2 (FAIL review PR #21)
- 2026-11-05 `08-qa`: iteracja 3 (FAIL review PR #21)

## Otwarte eskalacje

(brak)
