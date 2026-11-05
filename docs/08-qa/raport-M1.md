---
projekt: iskt-www
etap: 08-qa
data: "2026-11-05"
rola: qa
---

# Raport QA: M1 Szkielet, layout i strona główna

Data: 2026-11-05T16:20Z
Commit: ff5c386

## Zakres

Kamień M1 (plan `docs/05-plan/plan.md`). Zamknięte issue: #5 Szkielet projektu Astro, CI, tokeny i
czcionki; #6 Layout strony i prymitywy UI, strona 404; #7 SEO techniczne — meta, Open Graph, sitemap,
robots, favicony; #8 Strona główna — hero, kompetencje, sekcja kontaktu. Pominięte („not planned”):
brak.

Przepływy: layout (#6) → strona główna (#8) → SEO z `content/seo.ts` (#7); 404 w layoucie. Scenariusze
odbioru M1: O-1, O-6, O-9. Lighthouse na stagingu https://iskt-www.vercel.app/ (DoD QA z planu, W-10).
Znane i niebędące błędem M1: linki kafli do stron usług dają 404 do M3 (plan).

## Wyniki testów

| Obszar | Wynik | Uwagi |
|---|---|---|
| E2E chromium | pass 38/38 | `pnpm exec playwright test --project=chromium --project=webkit --workers=1` (Playwright 1.61.1), razem 75 pass, 1 skip |
| E2E webkit | pass 37/38, 1 pominięty | jw.; pominięty test produkcyjnego buildu `seo.spec.ts:157` działa tylko w chromium (świadomie, raz na przebieg) |
| Integracja | pass 38/38 | `pnpm test` (Vitest, 5 plików); `pnpm lint` i `pnpm typecheck` bez błędów |
| Testy QA (`e2e/qa/`) | pass 8 (w tym 2 oczekiwane porażki) | `pnpm exec playwright test e2e/qa --project=chromium --project=webkit --workers=1`; test „QA-M1-2” z `test.fail` wykonuje się i potwierdza brak CSP w obu przeglądarkach |
| Lighthouse mobile (staging, `/`) | fail | Lighthouse 12.8.2, `--form-factor=mobile --skip-audits=is-crawlable`, 3 przebiegi: wydajność 87 / 89 / 89, dostępność 100, dobre praktyki 100, SEO 100; LCP 3,5 s (logo w hero), FCP 2,1 s, TBT 0 ms, CLS 0 |
| Lighthouse desktop (staging, `/`) | pass | `--preset=desktop --skip-audits=is-crawlable`: 100 / 100 / 100 / 100 |
| Staging — nagłówki i pliki | pass | `curl -sI /`: `x-robots-tag: noindex`, Referrer-Policy, X-Content-Type-Options, Permissions-Policy (bez CSP — QA-M1-2); `/robots.txt` bez `Disallow: /`; `/sitemap.xml` = urlset z `/`; `/og/iskt-og.png` 200; `/nie-ma-takiej-strony` → 308 → 404 |
| Open Graph na stagingu (O-6) | pass | Pobranie `https://iskt-www.vercel.app/` jako zewnętrzny crawler (`curl -A "facebookexternalhit/1.1"`, bez uwierzytelnienia): og:title, og:description, og:url, og:image `https://iskt-www.vercel.app/og/iskt-og.png` (+ type, width 1200, height 630, alt), `twitter:card=summary_large_image`; pełny URL obrazu: 200 `image/png`, wymiary 1200×630 (`sips`) |
| Sekrety | pass | `gitleaks git --redact --no-banner .`: no leaks found |

Testy niestabilne: brak. Logi z przebiegu bez danych osobowych (M1 nie przetwarza danych formularza).

## Zgodność z wymaganiami

| Wymaganie | Wynik | Dowód |
|---|---|---|
| W-01 (strona główna) | spełnione | `e2e/home.spec.ts` (sekcje, treść, kafle), O-1 w `e2e/qa/M1-scenariusze.spec.ts`; pozostałe strony w M3 |
| W-02 | spełnione | `e2e/layout.spec.ts` (nagłówek, stopka, `aria-current="page"` na logo), O-1 |
| W-03 | spełnione | `e2e/home.spec.ts` (kolumny 1/2/3 na 375/768/1440, brak poziomego scrolla), O-1; pełny test 24×24 px i 16 px w T11 |
| W-07 | spełnione | `e2e/seo.spec.ts` (title, description, canonical, OG, twitter), O-6 lokalnie; na stagingu walidacja jako zewnętrzny crawler: tytuł, opis i obraz OG (pełny URL, 200, 1200×630) — wiersz „Open Graph na stagingu” |
| W-08 | spełnione | `e2e/seo.spec.ts` (sitemap, robots staging/production), staging: `x-robots-tag: noindex`, robots bez `Disallow: /`, O-6 |
| W-09 | spełnione | `e2e/layout.spec.ts` (404 w layoucie), O-9, staging 404 |
| W-10 | częściowo | Lighthouse desktop 100 × 4; mobile wydajność 87–89 < 90 (QA-M1-1); brak CSP z architektury (QA-M1-2) |
| W-11 | spełnione | axe bez serious/critical w `e2e/layout.spec.ts` i `e2e/home.spec.ts`, SkipLink jako pierwszy Tab; Lighthouse dostępność 100 |
| W-12 | spełnione | gitleaks czysty, `.env.example` bez wartości, zmienne tylko w Vercel |

## Zgłoszenia

Tylko 🔴 krytyczne i 🟡 istotne; każde staje się issue `typ:qa` przez `shctl task create`.

| Issue | Waga | Opis |
|---|---|---|
| QA-M1-1 | 🟡 istotne | Lighthouse mobile na stagingu `/`: wydajność 87/89/89 (< 90, W-10). LCP 3,5 s na logo w hero, 3 blokujące pliki `_astro/index.*.css`, za duże obrazy (~84 KiB). Odtworzenie: `npx lighthouse@12.8.2 https://iskt-www.vercel.app/ --form-factor=mobile --skip-audits=is-crawlable` |
| QA-M1-2 | 🟡 istotne | Brak nagłówka Content-Security-Policy wymaganego w architekturze („Bezpieczeństwo”). Odtworzenie: `curl -sI https://iskt-www.vercel.app/` — brak `content-security-policy`; test `e2e/qa/M1-scenariusze.spec.ts` „QA-M1-2” (`test.fail`, wykonywany) |

## Drobne uwagi

Zgłoszenia ⚪ drobne, bez issue; orkiestrator przenosi je do `docs/backlog-drobne.md`.

- Wpis `/404` bez ukośnika daje 308 na `/404/` (trailingSlash: true); zachowanie poprawne, ale test
  w `e2e/layout.spec.ts:137` nazywa to przekierowaniem HTTP, a sprawdza tylko konfigurację (uwaga z
  review #6).

## Werdykt

FAIL — dwa błędy 🟡 istotne (wydajność mobile < 90 i brak CSP), oba z issue; reszta kamienia M1
spełniona.
