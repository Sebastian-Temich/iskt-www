---
zadania_todo: 8
zadania_in_progress: 1
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 5
zadania_anulowane: 0
pr_otwarte: 1
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-05", "zrodlo": "T-9", "pytanie": "-", "decyzja": "Dodatkowo przeczytane: `docs/02-design/zrodla/.../ESG.dc.html` (układ), ADR-001, `e2e/layout.spec.ts`, `e2e/seo.spec.ts`, `e2e/qa/M1-scenariusze.spec.ts` (wzorce testów i ocena czerwonego testu QA)."}, {"data": "2026-11-05", "zrodlo": "T-9", "pytanie": "JSON-LD z jednym węzłem `JsonLd` renderuje bez tablicy", "decyzja": "test normalizuje odczyt do tablicy, bez zmiany komponentu spoza zakresu."}, {"data": "2026-11-05", "zrodlo": "T-9", "pytanie": "Linki w treści polityki podkreślone", "decyzja": "axe `link-in-text-block` (serious) przy samym kolorze."}, {"data": "2026-11-05", "zrodlo": "T-9", "pytanie": "-", "decyzja": "Link w stopce: w wierszu kontaktowym obok domeny, ten sam styl (`--green-300` na `--ink-900`), bez zmiany układu stopki."}, {"data": "2026-11-05", "zrodlo": "T-9", "pytanie": "Czy dopisać ścieżkę polityki do `nav` w `site.ts`?", "decyzja": "nie, `site.ts` jest poza zakresem; stała `privacyPath` w `SiteFooter.astro`."}]
ostatnia_synchronizacja: 2026-11-05T17:13:40Z
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
