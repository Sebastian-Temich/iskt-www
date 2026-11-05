---
zadania_todo: 6
zadania_in_progress: 2
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 6
zadania_anulowane: 0
pr_otwarte: 2
ci_fail: 2
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-05", "zrodlo": "T-11", "pytanie": "-", "decyzja": "Dodatkowo przeczytane źródła: `e2e/home.spec.ts`, `e2e/layout.spec.ts`, `e2e/seo.spec.ts`, `e2e/qa/M1-scenariusze.spec.ts`, `src/pages/404.astro`, `src/content/site.ts`, `vercel.json`, `.github/workflows/ci.yml`, kod `astro` (preview, checkOrigin, wtyczka env) i typy `resend`."}, {"data": "2026-11-05", "zrodlo": "T-11", "pytanie": "Treść klauzuli?", "decyzja": "robocza, zgodna z polityką prywatności (administrator, cel, link), do akceptacji przy odbiorze (P2)."}, {"data": "2026-11-05", "zrodlo": "T-11", "pytanie": "Formularz po sukcesie?", "decyzja": "ukryty bez resetu (stan sukcesu z designu); wpisane dane zostają w DOM, co utrzymuje test M1 `e2e/home.spec.ts` (wartość pola po wysłaniu)."}, {"data": "2026-11-05", "zrodlo": "T-11", "pytanie": "`maxlength` w polach?", "decyzja": "nie, bo liczy jednostki UTF-16 i ucinałby 100 emoji do 50; limity pilnuje schemat (code points)."}, {"data": "2026-11-05", "zrodlo": "T-11", "pytanie": "Sekret wklejany do paczki funkcji", "decyzja": "`runtimeEnv` przeniesiony do nowego `src/lib/runtime-env.ts` (plik spoza „Zakresu”), `env.ts` go reeksportuje. Wtyczka env Astro przy odwołaniu do całego `import.meta.env` wkleja wartości z plików `.env*` dla kluczy, których nazwy są w tekście modułu; stary `runtimeEnv` w `env.ts` (z nazwami zmiennych) wklejał klucz z `.env.local` do `.vercel/output/_functions`. Test regresji `src/lib/__tests__/runtime-env.test.ts`."}]
ostatnia_synchronizacja: 2026-11-05T19:40:16Z
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

- E-005 (#23): Kryterium 4 i review iteracji 1 (🔴) wymagają potwierdzenia nagłówka CSP na wdrożeniu Vercel. Preview PR #24 jest za Vercel Deployment Protection (302 na vercel.com/sso-api), a staging wdraża się dopiero z main.

