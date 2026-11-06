---
zadania_todo: 2
zadania_in_progress: 0
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 13
zadania_anulowane: 0
pr_otwarte: 0
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-06", "zrodlo": "T-14", "pytanie": "Klawiatura w teście: Tab między przyciskami?", "decyzja": "fokus ustawiany przez `focus()`. WebKit na macOS domyślnie pomija przyciski przy Tab (ustawienie systemu). Test sprawdza obsługę Enter i Spacji."}, {"data": "2026-11-06", "zrodlo": "T-14", "pytanie": "Test „bez noindex”: brak `meta robots`?", "decyzja": "robots równy temu na stronie głównej i bez `nofollow`. W E2E (staging) wszystkie strony mają `noindex` środowiskowy z W-08. Brak noindex na produkcji zapewnia wpis w `seo.ts`, co test też sprawdza."}, {"data": "2026-11-06", "zrodlo": "T-14", "pytanie": "Sekcja „Programy”: osobny komponent sekcji?", "decyzja": "`ProgramCard` to pojedyncza karta (nazwa z architektury), a siatkę z `SectionHeading` składa strona. Styl siatki jest w `<style>` strony."}, {"data": "2026-11-06", "zrodlo": "T-14", "pytanie": "Chipy: lista z designu (5) czy wszystkie usługi z `site.ts` (z Interim)?", "decyzja": "5 chipów z designu, w tej samej kolejności i z tymi etykietami. Zmienione są tylko adresy: na URL z W-01 zamiast `#kompetencje`, zgodnie z kryterium issue."}, {"data": "2026-11-06", "zrodlo": "T-14", "pytanie": "Okruszek bieżącej strony: `<span>` z designu czy link?", "decyzja": "link z `aria-current=\"page\"`, spójnie z ESG, Interim i Startupami (`Breadcrumb` z T-10)."}]
ostatnia_synchronizacja: 2026-11-05T23:10:40Z
---

# Status projektu

Plik wspólny, aktualizuje orkiestrator. Frontmatter zapisuje `scripts/sync-status.sh`: liczniki,
`wstrzymania` (wpisy z `/Users/Shared/sh/limity.md`) i `ostatnie_decyzje` (5 najnowszych z `decyzje.md`).
Widok w Obsidianie: `docs/_dashboard.md`.

## Bieżący etap

- `08-qa`: in-progress

## Punkt przekazania

Stan po ostatnim kamieniu milowym, potrzebny do wznowienia po `/clear` i „wznów”.

- Czas: 2026-11-06T00:30Z (M3 zakończony, QA M3 scalone, start M4)
- Kamień zakończony: M3 (#10, #12, #13, #14 zamknięte). QA M3 PR #35 scalony (e2905cc), review PASS, werdykt PASS, brak błędów 🔴/🟡; 1 drobna uwaga w `backlog-drobne.md` (B+R bez chipu Interim); O-10 podgląd w walidatorze OG do odbioru
- Kamień bieżący: M4 (#15 dispatch, #16 zależy od #15)
- PR w toku: brak
- Eskalacje: brak otwartych (E-007 zamknięta: repo publiczne, decyzja właściciela)
- Wstrzymania: brak
- `shctl doctor` 2026-11-05T14:12Z: 0 błędów
- Autoryzacja: „Autoryzacja planu PR #3” w `decyzje.md`
- Zadania właściciela: poprawa `CONTACT_TO`/Resend przed odbiorem (E-006/C), potem O-3; O-6 i O-10 podgląd w walidatorze OG przy odbiorze
- Worktree QA `/Users/Shared/sh/wt/iskt-www/stage-08-qa` założony ręcznie (brak komendy shctl); do usunięcia po QA M4
- Następny krok: monitoring #15 (`shctl task wait 15`), review, zamknięcie, dispatch #16; po M4: QA M4 (`sh-qa`), potem odbiór

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

## Otwarte eskalacje

(brak)
