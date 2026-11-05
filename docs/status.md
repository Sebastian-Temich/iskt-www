---
zadania_todo: 0
zadania_in_progress: 0
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 0
zadania_anulowane: 0
pr_otwarte: 0
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: []
ostatnia_synchronizacja: brak
---

# Status projektu

Plik wspólny, aktualizuje orkiestrator. Frontmatter zapisuje `scripts/sync-status.sh`: liczniki,
`wstrzymania` (wpisy z `/Users/Shared/sh/limity.md`) i `ostatnie_decyzje` (5 najnowszych z `decyzje.md`).
Widok w Obsidianie: `docs/_dashboard.md`.

## Bieżący etap

- `00-intake`: escalated

## Punkt przekazania

Stan po ostatnim kamieniu milowym, potrzebny do wznowienia po `/clear` i „wznów”.

(brak)

## Dziennik etapów

- 2026-11-05 `00-intake`: in-progress
- 2026-11-05 `00-intake`: review
- 2026-11-05 `00-intake`: iteracja 2 (FAIL review PR #1)

## Otwarte eskalacje

- E-001 (00-intake): Review PR #1 (iteracja 2) blokuje 🔴: żąda ADR danych osobowych już w etapie 00-intake. Skill sh-intake zabrania pisania ADR (robi to sh-architekt), a ADR w specyfikacji jest dla intake zgłoszeniem 🟡. Specyfikacja zawiera ustalenia wejściowe do ADR i wymaga go przed planem. Kolejny FAIL = 3. iteracja i automatyczna eskalacja.

