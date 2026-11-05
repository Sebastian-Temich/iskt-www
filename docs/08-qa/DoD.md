---
etap: 08-qa
status: escalated
iteracja: 3
akceptacja_wlasciciela: false
---

# DoD: QA zbiorcze

## Dokumentacja

- [ ] Raport QA powstał dla każdego kamienia milowego
  (M1: `raport-M1.md`, M2: `raport-M2.md`; pole zaznaczane w QA ostatniego kamienia M4)

## Funkcjonalność

- [ ] Testy E2E przechodzą (chromium + webkit)
  (M2: 162 pass, 2 fail — `e2e/qa/QA-M1-1-wydajnosc.spec.ts:26` w obu przeglądarkach, QA-M2-1)
- [x] Integracja i zgodność z wymaganiami są sprawdzone
- [ ] Błędy z QA są issue i zostały zamknięte
  (M1: QA-M1-1 i QA-M1-2 zamknięte (#22, #23); M2: QA-M2-1 jako issue po merge'u; pole zaznaczane
  w QA ostatniego kamienia)

## Checklisty jakości

- [ ] Nie ma otwartych zgłoszeń krytycznych ani istotnych
  (M2: 1 istotne otwarte — QA-M2-1)
- [x] Bezpieczeństwo i sekrety są sprawdzone

## Checkpoint

- [ ] Review etapu dało PASS (zaznacza reviewer, nie autor)
