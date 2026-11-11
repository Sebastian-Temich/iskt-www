---
etap: 04-plan
status: done
iteracja: 3
akceptacja_wlasciciela: true
---

# DoD: Plan

Jeden dokument `plan.md`: krótka architektura i plan kamieni milowych (szablon `docs/_szablony/plan.md`).
Migracja z v1 (2026-11-11): etapy `04-architektura` (done, iteracja 3, PR #3) i `05-plan` (done, PR #3)
scalone; pola zaznaczone na podstawie ich DoD.

## Dokumentacja

- [x] `plan.md` ma krótką architekturę: moduły, model danych, bezpieczeństwo, środowiska
- [x] `plan.md` ma kamienie milowe jako pionowe przekroje
- [x] `plan.md` ma 5–10 scenariuszy odbioru, zakres autoryzacji i jeden następny krok
- [x] Ważne decyzje i obszary ryzyka mają ADR w `adr/`
- [x] Sekcja „Stack (kontrakt)” w `AGENTS.md` jest uzupełniona

## Funkcjonalność

- [x] Każde wymaganie ze specyfikacji ma kamień milowy
- [x] Każda funkcja ma wskazany punkt wejścia (strona, trasa, komenda, endpoint)
- [x] Pierwszy kamień zaczyna się od szkieletu projektu, ostatni kończy dokumentacją wydania

## Checklisty jakości

- [x] Migracje zgodne wstecz są zasadą modelu danych
- [x] Zadania właściciela są w planie: konta prod i staging, DNS, `STAGING_DB_URL`, zmienne prod w Vercel oraz kroki typu projektu

## Checkpoint

- [x] Review etapu dało PASS (zaznacza reviewer, nie autor)
- [x] Właściciel zaakceptował plan
<!-- tylko-tryb:L -->
- [ ] Checkpoint 1 zaliczony
<!-- /tylko-tryb -->
