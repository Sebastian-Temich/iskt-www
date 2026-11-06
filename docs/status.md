---
zadania_todo: 0
zadania_in_progress: 0
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 15
zadania_anulowane: 0
pr_otwarte: 0
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-06", "zrodlo": "T-16", "pytanie": "-", "decyzja": "Dodatkowo przeczytane źródła: `docs/decyzje.md`, `docs/08-qa/raport-M1.md`, `raport-M2.md`, `raport-M3.md`, `docs/07-realizacja/escalations/E-006.md`, ADR-001, ADR-003, ADR-004, `docs/wydanie/DoD.md`, `docs/konfiguracja.md`, `scripts/deploy-prod.sh`, `scripts/check-dod.sh`, `vercel.json`, `astro.config.mjs`, `package.json`, `.env.example`, `src/lib/env.ts`, `src/lib/mailer.ts`, `src/pages/api/contact.ts`, `src/pages/robots.txt.ts`, `src/content/seo.ts`, `src/content/site.ts`, `src/components/home/ContactForm.astro`, `src/components/layout/Breadcrumb.astro`."}, {"data": "2026-11-06", "zrodlo": "T-16", "pytanie": "Kolumna „Uwagi” w scenariuszach odbioru", "decyzja": "stan z raportów QA M1–M3 i eskalacji E-003, E-006, żeby właściciel wiedział, co zostało do sprawdzenia przy odbiorze."}, {"data": "2026-11-06", "zrodlo": "T-16", "pytanie": "Status polityki prywatności", "decyzja": "„zaakceptowana 2026-11-05” na podstawie `docs/decyzje.md` (PR #25), z otwartymi punktami T-9; klauzula, obraz OG i meta polityki → „do akceptacji”."}, {"data": "2026-11-06", "zrodlo": "T-16", "pytanie": "`deploy-prod.sh` wymaga bazy (supabase, `PROD_DB_URL`), a projekt jej nie ma", "decyzja": "opisane w „Znanych ograniczeniach” z równoważną ścieżką ręczną (`vercel promote`, smoke test); zmiana skryptu jest poza zakresem (`scripts/`), zgłoszona w „Propozycjach”."}, {"data": "2026-11-06", "zrodlo": "T-16", "pytanie": "Przekierowanie `www.iskt.pl`", "decyzja": "`iskt.pl` w krokach B9a → dodane, bo endpoint odrzuca 403 żądania z `Origin` innym niż `PUBLIC_SITE_URL` (ADR-004), więc formularz pod `www` by nie działał."}]
ostatnia_synchronizacja: 2026-11-06T09:30:28Z
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
