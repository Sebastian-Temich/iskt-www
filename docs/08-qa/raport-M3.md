---
projekt: iskt-www
etap: 08-qa
data: "2026-11-06"
rola: qa
---

# Raport QA: M3 Strony usług

Data: 2026-11-05T23:11Z
Commit: 5a953b4

## Zakres

Kamień M3 (plan `docs/05-plan/plan.md`, zadania planu 7–10). Zamknięte issue: #10 Komponenty stron
usług i strona ESG; #12 Strony AI-transformacja i Oprogramowanie; #13 Strony Interim i Startupy; #14
Strona Projekty B+R z FAQ. Pominięte („not planned”): brak. Otwartych zadań kamienia: brak.

Przepływy między funkcjami: kafle strony głównej (#8 z M1) → 6 stron usług; komponenty usług z #10
(`ServiceHero`, `OtherServices`, `CtaBand` i inne) użyte przez strony z #12 i #13; „Pozostałe
kompetencje” (`OtherServices` z `site.ts`, na B+R `ServiceChips`) → kolejna usługa; breadcrumb i logo →
strona główna; dane SEO z `content/seo.ts` (#3 z M1) → meta, OG i sitemap nowych stron.

Scenariusze odbioru M3: O-2 (przejście po wszystkich usługach), O-7 (klawiatura, FAQ na B+R), O-10
(SEO wszystkich stron, sitemap z 7 stronami) sprawdzone; O-10 poza podglądem w walidatorze OG
(niesprawdzony, do odbioru). Lighthouse na stagingu dla stron kamienia (DoD QA z planu,
W-10). Staging https://iskt-www.vercel.app/ serwuje `main` z #14 (B+R 200, sitemap z 7 stronami).

Nowe testy: `e2e/qa/M3-scenariusze.spec.ts` (O-2, O-7, O-10 z W-07 i W-08 wobec listy W-01 wpisanej
na sztywno, linki wewnętrzne wszystkich stron W-01 bez 404, W-03 stron usług na 375/768/1440 px).

## Wyniki testów

| Obszar | Wynik | Uwagi |
|---|---|---|
| E2E chromium | pass 167/167 | `pnpm exec playwright test --project=chromium --project=webkit --workers=1` (Playwright 1.61.1), razem 332 pass, 2 skip, 0 fail, 5,2 min; przebieg bez `e2e/qa/M3-scenariusze.spec.ts` (plik powstał w trakcie) |
| E2E webkit | pass 165/167, 2 pominięte | jw.; pominięte testy produkcyjnego buildu w `seo.spec.ts` działają tylko w chromium (jak w M1 i M2) |
| Integracja | pass 129/129 | `pnpm test` (Vitest, 11 plików) |
| Lint i typy | pass | `pnpm lint` (ESLint + Prettier) i `pnpm typecheck` (`astro check`: 0 błędów, 0 ostrzeżeń, 0 podpowiedzi) |
| Testy QA (`e2e/qa/`) | pass 46/46 | `pnpm exec playwright test e2e/qa/ --project=chromium --project=webkit --workers=1`: `M1-scenariusze`, `QA-M1-1-wydajnosc`, `M3-scenariusze` (6 testów × 2 przeglądarki) |
| Lighthouse mobile (staging) | pass | Lighthouse 12.8.2, `--form-factor=mobile --skip-audits=is-crawlable`, wydajność / dostępność / dobre praktyki / SEO: `/uslugi/projekty-br/` 100/100/100/100 (LCP 1,4 s), `/uslugi/esg/` 99/100/100/100 (1,7 s), `/uslugi/ai-transformacja/` 99/100/100/100 (1,7 s), `/uslugi/oprogramowanie/` 97/100/100/100 (1,8 s), `/uslugi/interim/` 100 × 4 (1,5 s), `/startupy/` 100 × 4 (1,5 s) |
| Lighthouse desktop (staging) | pass | `--preset=desktop --skip-audits=is-crawlable`: wszystkie 6 stron usług 100 × 4 (LCP 0,4 s) |
| SEO na stagingu (O-10) | pass poza walidatorem OG | `curl https://iskt-www.vercel.app/sitemap.xml`: dokładnie 7 adresów z W-01; `curl -sI …/uslugi/esg/`: `x-robots-tag: noindex`; `og:title`, `og:description`, `og:url`, `og:image` strony usługi w HTML. Podgląd w zewnętrznym walidatorze OG sprawdza właściciel przy odbiorze (jak O-6) |
| Sekrety | pass | `gitleaks git --redact --no-banner .`: 147 commitów, no leaks found |

Testy niestabilne: brak. Przy pisaniu `M3-scenariusze.spec.ts` dwa błędy samego testu poprawiono przed
przebiegiem zaliczonym: próg 5 linków „Pozostałych kompetencji” (B+R ma w designie 4 wewnętrzne, niżej
w „Drobnych uwagach”) i odpowiedź 304 z pamięci podręcznej WebKit przy powtórnym wejściu na stronę
(test przyjmuje status < 400). Dane osobowe w logach: strony M3 nie przetwarzają danych osobowych.

## Zgodność z wymaganiami

| Wymaganie | Wynik | Dowód |
|---|---|---|
| W-01 | spełnione | Każda z 7 stron 200 lokalnie (`M3-scenariusze`: linki wewnętrzne) i na stagingu; osiągalna z kafli strony głównej (O-2); treść, kolejność sekcji i hierarchia nagłówków wobec plików designu oraz brak placeholderów: `e2e/esg`, `ai`, `oprogramowanie`, `interim`, `startupy`, `projekty-br.spec.ts` (testy „hierarchia nagłówków i treść jak w D/…”, „sekcje w kolejności z designu”) |
| W-02 | spełnione | Nagłówek, logo → `/`, stopka na stronach usług: `e2e/layout.spec.ts` i testy stron („BaseLayout, nagłówek page z aktywnym »Kompetencje« i okruszki”); breadcrumb z `aria-current="page"` i logo → `/` na każdej z 6 stron: `M3-scenariusze` O-2; menu mobilne z Escape: nie dotyczy — design nie ma menu mobilnego (`architektura.md`, „Rozstrzygnięcia luk”, nawigacja) |
| W-03 | spełnione | Brak poziomego scrolla na 375/768/1440 px dla 6 stron usług: `M3-scenariusze` W-03 i testy stron; obszar kliknięcia ≥ 24 px: audyt `target-size` Lighthouse mobile zaliczony (score 1) na wszystkich 6 stronach usług (osobnego testu E2E rozmiaru nie ma; przekrojowo w #15) |
| W-07 | niesprawdzone (podgląd w walidatorze OG); meta spełnione | Kryterium „podgląd linku w walidatorze OG” niesprawdzone — do O-10 przy odbiorze (jak O-6 w M1); nie jest to wykryty błąd, więc bez issue. Meta: na 7 stronach unikalne `<title>` i `description` (≤ 160 znaków), `canonical` = ścieżka, `og:url` = `canonical`, `og:title`, `og:description`, `og:image` (200), `twitter:card`, `lang="pl"`: `M3-scenariusze` O-10/W-07; na stagingu jw. (wiersz „SEO na stagingu”) |
| W-08 (strony kamienia) | spełnione | `sitemap.xml` lokalnie i na stagingu: dokładnie 7 stron z W-01 (`M3-scenariusze` O-10/W-08); `noindex` na stagingu |
| W-11 | spełnione | axe bez naruszeń serious/critical na każdej stronie usług (testy stron z `AxeBuilder`); pierwszy Tab na „Przejdź do treści”, FAQ B+R otwiera się Enterem (`aria-expanded`, panel widoczny): `M3-scenariusze` O-7 i `projekty-br.spec.ts`; dostępność Lighthouse 100. `prefers-reduced-motion` sprawdzany w E2E tylko na ESG; przekrojowo w zadaniu #15 (M4) |
| W-10 (strony kamienia) | spełnione | Lighthouse mobile ≥ 97 i desktop 100 we wszystkich 4 kategoriach dla 6 stron usług na stagingu |

## Zgłoszenia

Tylko 🔴 krytyczne i 🟡 istotne; każde staje się issue `typ:qa` przez `shctl task create`.

| Issue | Waga | Opis |
|---|---|---|
| brak | | |

## Drobne uwagi

Zgłoszenia ⚪ drobne, bez issue; orkiestrator przenosi je do `docs/backlog-drobne.md`.

- „Pozostałe kompetencje” na B+R (`ServiceChips`) nie mają chipu Interim, zgodnie z designem
  (`Projekty-BR.dc.html:246-250`: ESG, AI, Startupy, Oprogramowanie, Szkolenia). Pozostałe 5 stron
  usług linkuje do wszystkich innych usług. Interim jest osiągalny z B+R przez logo → kafle. Do decyzji
  przy odbiorze: zostać przy designie albo dodać chip.

## Werdykt

PASS — 6 stron usług działa, jest osiągalnych z kafli, „Pozostałych kompetencji”, breadcrumb i logo,
ma unikalne meta i OG, sitemap ma dokładnie 7 stron, E2E i Lighthouse (≥ 97) zielone; brak błędów 🔴 i 🟡.

## Propozycje dla systemu

- `shctl doc new 08-qa raport-qa --projekt NAZWA` tworzy plik w głównej kopii projektu
  (`/Users/Shared/sh/projekty/NAZWA`), a nie w bieżącym worktree etapu; QA M3 przeniosło go ręcznie
  (`mv`). Propozycja: `doc new` pisze w katalogu bieżącym, gdy jest worktree tego repo na gałęzi
  `stage/ETAP`.
- Powtórka z QA M2: główna kopia nie może zmienić gałęzi, a odtworzenie `stage/08-qa` od `origin/main`
  w worktree QA (`git switch -C`) zostało odrzucone przez uprawnienia; gałąź po squashu QA M2 scalono z
  `main` (bez różnic względem `main`). Propozycja `shctl stage worktree ETAP` pozostaje aktualna.
