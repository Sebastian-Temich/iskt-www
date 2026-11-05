---
zadania_todo: 10
zadania_in_progress: 0
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 4
zadania_anulowane: 0
pr_otwarte: 0
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-05", "zrodlo": "wlasciciel", "pytanie": "Merge raportu QA M1 (PR #21) mimo FAIL review iteracji 3; zgłoszenie dotyczyło wyłącznie braku wyniku walidatora OG", "decyzja": "kto: właściciel 2026-11-05, E-003 opcja B; metadane i obraz OG potwierdzone pobraniem jak crawler; publiczne walidatory niedostępne (429/render w przeglądarce). Cofnięcie: podgląd w walidatorze OG w scenariuszu O-6 przy odbiorze; przy błędzie nowe issue typ:qa"}, {"data": "2026-11-05", "zrodlo": "T-8", "pytanie": "-", "decyzja": "Dodatkowo przeczytane źródła: `docs/02-design/zrodla/Strona firmowa ISKT/ISKT-standalone.dc.html`, `_ds/…/_ds_bundle.js` (l. 755-845, 1097-1166), `src/layouts/BaseLayout.astro`, `src/components/layout/SiteHeader.astro`, prymitywy `src/components/ui/*`, `src/pages/404.astro`, `e2e/layout.spec.ts`, `playwright.config.ts`, `docs/07-realizacja/T-6.md` (format raportu). Pliki spoza „Zakresu” nie były zmieniane."}, {"data": "2026-11-05", "zrodlo": "T-8", "pytanie": "Dane kontaktowe w sekcji", "decyzja": "tylko adres i NIP/REGON jak w designie (l. 160-163); e-mail i telefon są w stopce."}, {"data": "2026-11-05", "zrodlo": "T-8", "pytanie": "`Field`", "decyzja": "jeden komponent dla Input i Textarea (`type=\"textarea\"`), `*` z `aria-hidden` (wymagalność przekazuje atrybut `required`), `aria-invalid` i komunikat błędu gotowe dla T6."}, {"data": "2026-11-05", "zrodlo": "T-8", "pytanie": "Kontrolki hero na 375 px", "decyzja": "przyciski na całą szerokość poniżej 480 px (wzorzec z `404.astro`), a kolumny hero i kontaktu `minmax(min(300px, 100%), 1fr)`, żeby nie wymuszać poziomego scrolla."}]
ostatnia_synchronizacja: 2026-11-05T16:52:21Z
---

# Status projektu

Plik wspólny, aktualizuje orkiestrator. Frontmatter zapisuje `scripts/sync-status.sh`: liczniki,
`wstrzymania` (wpisy z `/Users/Shared/sh/limity.md`) i `ostatnie_decyzje` (5 najnowszych z `decyzje.md`).
Widok w Obsidianie: `docs/_dashboard.md`.

## Bieżący etap

- `08-qa`: review

## Punkt przekazania

Stan po ostatnim kamieniu milowym, potrzebny do wznowienia po `/clear` i „wznów”.

- Czas: 2026-11-05T17:30Z (po QA M1)
- Kamień zakończony: M1 (#5–#8 zamknięte; QA M1 PR #21 scalony na decyzję właściciela E-003/B, werdykt FAIL: 2 × 🟡 → #22 wydajność mobile, #23 CSP). Etap `08-qa` zostaje otwarty do QA ostatniego kamienia
- Kamień bieżący: M2 (#9 polityka w toku, potem #11 formularz); naprawy QA M1: #23 w toku, #22 w kolejce
- PR w toku: brak (workery #9 i #23 pracują)
- Eskalacje: brak otwartych (E-001, E-002, E-003 zamknięte)
- Wstrzymania: M3 (#10 i dalej) czeka na QA M2
- `shctl doctor` 2026-11-05T14:12Z: 0 błędów
- Autoryzacja: „Autoryzacja planu PR #3” w `decyzje.md`
- Zadania właściciela: reguła rate limit w Vercel Firewall przed QA M2 (sprawdzić dostępność na Hobby); O-6 podgląd w walidatorze OG przy odbiorze
- Następny krok: monitoring #9 i #23, potem dispatch #22 i #11

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
