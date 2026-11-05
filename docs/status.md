---
zadania_todo: 12
zadania_in_progress: 0
zadania_review: 0
zadania_blocked: 0
zadania_escalated: 0
zadania_done: 0
zadania_anulowane: 0
pr_otwarte: 0
ci_fail: 0
wstrzymania: []
ostatnie_decyzje: [{"data": "2026-11-05", "zrodlo": "architekt", "pytanie": "Dodatkowa strona /polityka-prywatnosci/ (poza sitemap) z roboczą treścią i obraz OG 1200x630 generowany z logo", "decyzja": "W-06 i P2; brak w designie, PR #3. Cofnięcie: akceptacja lub zmiana treści przy odbiorze"}, {"data": "2026-11-05", "zrodlo": "architekt", "pytanie": "Nawigacja jak w designie (Kompetencje + CTA, bez hamburgera); bieżąca strona przez aria-current w logo (home) i ścieżce (pozostałe); formularz tylko JSON przez fetch, bez JS komunikat noscript z mailto, limit 32 kB", "decyzja": "design jako jedyne źródło wyglądu; W-02, W-04; review PR #3. Cofnięcie: zmiana nawigacji = zmiana zakresu; obsługa bez JS = nowy ADR"}, {"data": "2026-11-05", "zrodlo": "architekt", "pytanie": "Style: czysty CSS z tokenami DS 1:1, bez Tailwinda; czcionki Inter i JetBrains Mono samohostowane (OFL)", "decyzja": "design ma własny system tokenów; Lighthouse i brak zewnętrznych żądań, PR #3. Cofnięcie: ADR przy zmianie"}, {"data": "2026-11-05", "zrodlo": "architekt", "pytanie": "Rate limit przez regułę Vercel Firewall, fallback Upstash (ADR-003)", "decyzja": "licznik współdzielony bez nowego konta, PR #3. Cofnięcie: przełączenie RATE_LIMIT_PROVIDER po decyzji właściciela"}, {"data": "2026-11-05", "zrodlo": "architekt", "pytanie": "Bez Supabase i Dockera w projekcie (ADR-002)", "decyzja": "brak danych do przechowania (ADR-001), PR #3. Cofnięcie: nowy ADR przy CMS lub zapisie zgłoszeń"}]
ostatnia_synchronizacja: 2026-11-05T13:01:13Z
---

# Status projektu

Plik wspólny, aktualizuje orkiestrator. Frontmatter zapisuje `scripts/sync-status.sh`: liczniki,
`wstrzymania` (wpisy z `/Users/Shared/sh/limity.md`) i `ostatnie_decyzje` (5 najnowszych z `decyzje.md`).
Widok w Obsidianie: `docs/_dashboard.md`.

## Bieżący etap

- `07-realizacja`: todo (następny)

## Punkt przekazania

Stan po ostatnim kamieniu milowym, potrzebny do wznowienia po `/clear` i „wznów”.

(brak)

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

## Otwarte eskalacje

(brak)
