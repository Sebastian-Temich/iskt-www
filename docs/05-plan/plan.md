---
projekt: iskt-www
etap: 05-plan
data: "2026-11-05"
rola: architekt
---

# Plan: iskt-www

Źródło: `docs/00-intake/specyfikacja.md` w rewizji f24eef2. Architektura:
`docs/04-architektura/architektura.md`. Wymagania przywołujemy numerami `W-n`. Skróty ścieżek designu:
`D/` = `docs/02-design/zrodla/Strona firmowa ISKT/`, `DS/` = `D/_ds/iskt-greenovation-design-system-1705b29f-a657-4ea0-8548-faa4bf02a1b4/`.

## Kamienie milowe

Każdy kamień to pionowy przekrój: działający rezultat jednej ścieżki (UI, endpoint, testy, docs),
widoczny na stagingu.

| Nr | Kamień milowy | Rezultat | Wymagania | Warunek startu |
|---|---|---|---|---|
| 1 | Szkielet, layout i strona główna | Repo z CI zielonym, komendy w `AGENTS.md` sprawdzone; layout (nagłówek, stopka, SkipLink, SEO) i strona główna `/` zgodne z designem na stagingu, z `sitemap.xml`, `robots.txt`, `noindex` stagingu, faviconami i obrazem OG; 404 | W-01 (strona główna), W-02, W-03, W-07, W-08, W-09, W-11, W-12 | Plan zaakceptowany; projekt Vercel podpięty przed QA M1 |
| 2 | Formularz kontaktowy end-to-end | Odwiedzający wysyła zapytanie z `/#kontakt`, e-mail dochodzi na adres testowy; walidacja, błędy, honeypot, rate limit, klauzula i strona polityki prywatności | W-04, W-05, W-06, W-12 | QA M1 zakończone; konto Resend, zmienne Preview i reguła rate limit w Vercel (zadania właściciela) |
| 3 | Strony usług | 6 stron usług zgodnych z designem, osiągalnych z kafli strony głównej i z „Pozostałe kompetencje”, z breadcrumb i meta | W-01, W-02, W-03, W-07, W-11 | QA M2 zakończone |
| 4 | Jakość i wydanie | Wszystkie strony: E2E przekrojowe, Lighthouse ≥ 90 (4 kategorie, mobile i desktop) na stagingu, dokumentacja wydania | W-03, W-10, W-11, W-12 | QA M3 zakończone |

QA kamienia sprawdza tylko strony zbudowane do tego kamienia: w M1 i M2 linki z kafli i z
„Umów konsultację” do stron usług mogą jeszcze dawać 404 (znane, nie jest błędem QA M1/M2); od QA M3
każdy link wewnętrzny musi działać, a sitemap mieć dokładnie 7 stron.

DoD QA każdego kamienia (`sh-qa`): scenariusze odbioru kamienia, wymagania `W-n` kamienia w raporcie
oraz **Lighthouse na stagingu dla stron kamienia, profil mobile i desktop: wydajność, dostępność, SEO i
dobre praktyki ≥ 90** (W-10; SEO na stagingu bez audytu `is-crawlable`). Wynik < 90 to błąd QA.

Poza zakresem kamieni: CMS/blog, wersje językowe, integracje, analityka, cookies, wdrożenie na iskt.pl
(specyfikacja, „Poza zakresem”).

## Zadania

Wykonawca każdego zadania: `claude`. Brak zadań z migracją (projekt bez bazy). Każde zadanie, które
tworzy stronę lub komponent, ma w kryteriach: „podpięte do routingu (`src/pages/`) lub layoutu
(`BaseLayout`), widoczne na wskazanej stronie i pokryte testem E2E tej strony”.

| Nr | Zadanie | Kamień | Zależności | Wykonawca | Wymagania | Pliki designu |
|---|---|---|---|---|---|---|
| 1 | Szkielet projektu (sekwencyjnie): Astro 5 + TS strict, adapter Vercel (`fra1`), pnpm, ESLint/Prettier/`astro check`, Vitest, Playwright (wersja z `konfiguracja.md`, chromium+webkit) z axe, joby CI lint/test/e2e w `ci.yml`, tokeny w `src/styles/tokens/` i `global.css`, samohostowane Inter i JetBrains Mono, pusty `BaseLayout` podpięty do `src/pages/index.astro`, `vercel.json` z nagłówkami bezpieczeństwa, `.env.example`, `lib/env.ts`; komendy w „Stack (kontrakt)” sprawdzone i poprawione | 1 | — | claude | W-10, W-12 | `DS/tokens/colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`, `fonts.css`, `DS/readme.md` |
| 2 | Layout i prymitywy UI: `BaseLayout` (lang, `Seo`, `SkipLink`, `SiteHeader` home/page z `aria-current` wg architektury, `<main>`, `SiteFooter` z danymi z `content/site.ts`), `Button`, `Badge`, `Card`, `SectionHeading`, `Icon` (Lucide), `Breadcrumb`; strona `404.astro` używająca layoutu i prymitywów | 1 | 1 | claude | W-02, W-09, W-11 | `D/ISKT-standalone.dc.html:57-65,186-191`, `D/ESG.dc.html:44-68,247-252`, `DS/_ds_bundle.js:111,174,240,483`, `D/assets/iskt-logo-transparent.png` |
| 3 | SEO techniczne: `Seo`/`JsonLd` z danymi z `content/seo.ts` wybieranymi w `BaseLayout` po ścieżce (bez edycji plików stron), `@astrojs/sitemap` z filtrem: tylko 7 stron z W-01 (bez 404, API i polityki prywatności — W-08), `robots.txt.ts` zależny od `PUBLIC_SITE_ENV`, `X-Robots-Tag: noindex` na stagingu, favicony z wariantu C, obraz OG 1200×630; testy E2E meta/OG/robots oraz sitemap porównywana z listą stron W-01 **już zbudowanych** (w M1: tylko `/`; pełna lista 7 stron sprawdzana w #10/#11 i QA M3) | 1 | 2 | claude | W-07, W-08 | `D/*.dc.html:6-19` (meta), `D/sitemap.xml`, `D/robots.txt`, `D/assets/iskt-favicon-512.png`, `D/assets/iskt-logo-transparent.png` |
| 4 | Strona główna `/`: `HomeHero`, `ServiceGrid`/`ServiceTile` (7 kafli z `site.ts`, linki na URL z W-01, Szkolenia zewn.), `ContactSection` z formularzem w stanie statycznym (pola, etykiety, bez wysyłki), responsywność siatki 1/2/3 kolumny; E2E strony (sekcje, 375/768/1440, axe, `aria-current` logo; linki kafli mają poprawne `href` z W-01 — sprawdzenie, że nie dają 404, dopiero w M3, bo strony usług powstają w #7–#10) | 1 | 2 | claude | W-01, W-03, W-11 | `D/ISKT-standalone.dc.html` (całość, l. 54-182), `DS/_ds_bundle.js:758,1099` |
| 5 | Strona polityki prywatności `/polityka-prywatnosci/` z roboczą treścią (administrator ISKT Greennovation Sp. z o.o. z danymi z `site.ts`, cel, podstawa, podmioty przetwarzające Vercel i Resend, prawa, kontakt), oznaczona w raporcie do akceptacji przy odbiorze; link w `SiteFooter` | 2 | 2, 3 | claude | W-06 | `D/ESG.dc.html` (układ strony tekstowej: hero wąski, kontener 900 px), dane firmy `D/ISKT-standalone.dc.html:19,160-163` |
| 6 | Formularz end-to-end: `ContactForm` (stany: wysyłanie, sukces, błędy pól z `aria-describedby` i fokusem, błąd wysyłki, 429; robocza klauzula z linkiem do polityki; transport JSON z fallbackiem urlencoded bez JS, limit ciała 64 kB → 413, typ → 415, test maksymalnych długości ze znakami 4-bajtowymi w obu formatach), `lib/contact-schema.ts`, `lib/mailer.ts` (Resend, timeout 10 s, mock), `lib/rate-limit.ts` (waf/upstash/pamięć), `lib/log.ts`, `src/pages/api/contact.ts`; spike ADR-003 na stagingu (6. POST → 429); testy jednostkowe i E2E | 2 | 4, 5 | claude | W-04, W-05, W-06, W-12 | `D/ISKT-standalone.dc.html:154-182,223`, `DS/_ds_bundle.js:758,1099,483` |
| 7 | Komponenty usług + strona ESG `/uslugi/esg/`: `ServiceHero`, `WhenIntro`, `ScopeList`, `ComparisonTable`, `ProcessTimeline`, `CtaBand`, `OtherServices` (z `site.ts`), breadcrumb z bieżącą stroną `aria-current="page"` i aktywnym „Kompetencje” w nagłówku (architektura, „Rozstrzygnięcia luk”); E2E strony | 3 | 4 | claude | W-01, W-02, W-03, W-07, W-11 | `D/ESG.dc.html` (całość) |
| 8 | Strony AI-transformacja i Oprogramowanie (`ProductCard`) z komponentami z #7; E2E obu stron | 3 | 7 | claude | W-01, W-03, W-07, W-11 | `D/AI-Transformacja.dc.html`, `D/Oprogramowanie.dc.html` |
| 9 | Strony Interim (`RoleArticle`) i Startupy z komponentami z #7; E2E obu stron | 3 | 7 | claude | W-01, W-03, W-07, W-11 | `D/Interim.dc.html`, `D/Startupy.dc.html` |
| 10 | Strona Projekty B+R `/uslugi/projekty-br/`: `IconCardGrid`, `ProcessCards`, `ProgramCard`, `AudienceDark`, `FaqAccordion` (aria-expanded), `CtaBandBrand`, `ServiceChips`; treść z wersji podstawowej, meta z Ekspercki (architektura, „Rozstrzygnięcia luk”); E2E strony | 3 | 7 | claude | W-01, W-03, W-07, W-11 | `D/Projekty-BR.dc.html` (całość), meta: `D/Projekty-BR-Ekspercki.dc.html:6-19` |
| 11 | Jakość przekrojowa: E2E wszystkich stron (linki wewnętrzne bez 404, brak placeholderów, 375/768/1440 bez poziomego scrolla, axe, klawiatura, `prefers-reduced-motion`), `lighthouserc.cjs` (mobile i desktop, ≥ 0.9 × 4) i skrypt `pnpm lh:staging`; poprawki wydajności (obrazy, preload czcionek, CSS krytyczny) do osiągnięcia progów na stagingu | 4 | 6, 8, 9, 10 | claude | W-03, W-10, W-11 | wszystkie pliki stron z tabeli W-01 |
| 12 | Dokumentacja wydania: `docs/wydanie/techniczna/` (architektura w skrócie, zmienne środowiska bez wartości, alias stagingu, reguła WAF, kroki B9a: domena, Resend prod, zmienne prod, zdjęcie `noindex`, rollback w Vercel) i `docs/wydanie/produktowa/` (strony, formularz, co sprawdzić przy odbiorze, robocze treści do akceptacji) | 4 | wszystkie | claude | W-12 | — |

Zadania #8, #9 i #10 mogą iść równolegle (rozłączne pliki stron i komponentów; wspólne komponenty
tylko z #7). #5 i #4 mogą iść równolegle (różne strony; #5 zmienia tylko link w `SiteFooter`).

Pierwsze zadanie kamienia 1 to szkielet, ostatnie zadanie planu to dokumentacja wydania.

## Zadania właściciela

| Zadanie | Przed | Uwagi |
|---|---|---|
| Konto Vercel ISKT (konto klienta) i projekt podpięty do `Sebastian-Temich/iskt-www`; gałąź produkcyjna `production`, stały alias stagingu dla `main`, region funkcji `fra1` | QA kamienia 1 | Bez tego brak stagingu i Lighthouse |
| Zmienne Preview w Vercel: `PUBLIC_SITE_URL` (alias stagingu), `PUBLIC_SITE_ENV=staging` | QA kamienia 1 | Bez sekretów |
| Konto Resend, klucz **testowy**, adres odbiorcy testowego; zmienne Preview `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM=onboarding@resend.dev`; ten sam klucz testowy w `/Users/Shared/sh/projekty/iskt-www/.env.local` (shctl kopiuje go workerom) | startem zadania #6 | Klucz tylko w env, nigdy w czacie/repo |
| Reguła rate limit w Vercel Firewall (POST `/api/contact`, 5/10 min/IP → 429) albo informacja, że plan jej nie ma (fallback Upstash = nowa decyzja i konto) | QA kamienia 2 | ADR-003 |
| Akceptacja umów powierzenia (DPA) Vercel i Resend | odbiorem | ADR-001 |
| Akceptacja roboczej klauzuli, polityki prywatności i obrazu OG | odbiorem | P2 specyfikacji |
| Konta prod: Vercel (to samo konto), Supabase prod | — | Supabase nie dotyczy (ADR-002); Vercel jak wyżej |
| Projekt Supabase staging i sekret `STAGING_DB_URL` w GitHub Secrets | — | Nie dotyczy: projekt bez bazy (ADR-002) |
| Domena iskt.pl i DNS w Vercel, weryfikacja domeny w Resend (SPF/DKIM) | wdrożeniem prod (B9a, poza pilotem) | Pilot kończy się na stagingu |
| Zmienne prod w panelu Vercel (`PUBLIC_SITE_ENV=production`, `PUBLIC_SITE_URL=https://iskt.pl`, klucz prod Resend, `CONTACT_TO`, `CONTACT_FROM` z domeny) | wdrożeniem prod (B9a) | Sentry nie dotyczy (brak w zakresie) |

## Ryzyka

| Ryzyko | Skutek | Działanie (ADR, spike, dowody) | Właściciel |
|---|---|---|---|
| Plan Vercel bez reguły rate limit | W-05 niespełnione | ADR-003: spike w #6 na stagingu, fallback Upstash po decyzji właściciela | architekt (ADR), właściciel (plan Vercel) |
| Lighthouse < 90 na mobile (duże logo PNG, czcionki, CSS) | W-10 niespełnione | `astro:assets`, samohostowane czcionki z preload, zero JS poza 2 interakcjami; pomiar w QA każdego kamienia, poprawki w #11 | worker #11, QA |
| Dane osobowe w logach lub e-mailu | naruszenie W-06 | ADR-001, `lib/log.ts`, test „brak PII w logach” | worker #6, review |
| Niekompletny design (brak polityki, OG, menu mobilnego, `@media`, meta B+R) | rozbieżność z oczekiwaniem właściciela | Rozstrzygnięcia w architekturze, akceptacja przy odbiorze; pytanie o B+R w checkpoincie | architekt, właściciel |
| Kontrast `--text-muted` < 4,5:1 | axe/Lighthouse a11y | Reguła w architekturze („Design”), axe w E2E każdej strony | worker, QA |
| Brak kont Vercel/Resend na czas | blokada QA M1/M2 | Zadania właściciela z terminem „przed”; zadania niezależne trwają | właściciel |

## Scenariusze odbioru

| Nr | Scenariusz | Kroki | Oczekiwany wynik | Wymagania | Kamień |
|---|---|---|---|---|---|
| O-1 | Strona główna jak w designie | Otwórz alias stagingu na komputerze i telefonie | Hero, 7 kafli kompetencji, sekcja kontaktu i stopka jak w `ISKT-standalone`; na telefonie kafle w jednej kolumnie, bez przewijania w bok | W-01, W-03 | 1 |
| O-2 | Przejście po wszystkich usługach | Z kafli strony głównej otwórz każdą z 6 usług, na każdej użyj „Pozostałe kompetencje” i logo | Każda strona zgodna ze swoim plikiem designu, breadcrumb, powrót na `/`, żadnego 404 | W-01, W-02 | 3 |
| O-3 | Wysłanie zapytania | Na `/#kontakt` wypełnij imię, e-mail, wiadomość i wyślij | Komunikat „Dziękujemy!”, e-mail na adresie testowym z danymi i `Reply-To` nadawcy | W-04, W-06 | 2 |
| O-4 | Błędy formularza | Wyślij pusty formularz, potem z błędnym e-mailem | Komunikaty przy polach, fokus na pierwszym błędzie, nic nie wysłane | W-04, W-11 | 2 |
| O-5 | Ochrona przed spamem | Wyślij formularz 6 razy w ciągu 10 minut | 6. próba: komunikat o zbyt wielu zgłoszeniach (429) | W-05 | 2 |
| O-6 | Podgląd linku i indeksacja strony głównej | Wklej alias stagingu do walidatora OG; otwórz `/robots.txt` i nagłówki odpowiedzi stagingu | Tytuł, opis i obraz OG strony głównej; `robots.txt` bez `Disallow: /`; `X-Robots-Tag: noindex` | W-07, W-08 | 1 |
| O-7 | Klawiatura | Na stronie głównej naciśnij Tab | Pierwszy link „Przejdź do treści”, widoczny fokus, FAQ na B+R otwiera się Enterem | W-11 | 3 |
| O-8 | Wynik Lighthouse | Przejrzyj raport QA M4 | ≥ 90 w wydajności, dostępności, SEO i dobrych praktykach, mobile i desktop, dla każdej strony | W-10 | 4 |
| O-10 | SEO wszystkich stron | Wklej adres dowolnej strony usługi do walidatora OG; otwórz `/sitemap.xml` stagingu | Tytuł, opis i obraz OG strony usługi; sitemap z dokładnie 7 stronami z W-01 | W-07, W-08 | 3 |
| O-9 | Nieistniejący adres | Otwórz `/nie-ma-takiej-strony` | Strona 404 w stylu serwisu z linkiem do strony głównej | W-09 | 1 |

## Zakres autoryzacji

Po akceptacji orkiestrator zapisuje go w `decyzje.md` przez `shctl decision add --rola wlasciciel`.

- Na co: kamienie milowe 1–4 i zadania #1–#12 tego planu.
- Zakres: wymagania W-01–W-12; dostęp do konta Vercel ISKT (staging/preview) i konta Resend z kluczem
  testowym, zakładanych przez właściciela; darmowe plany Vercel i Resend; zależności npm z ADR-002–004.
- Do kiedy: do odbioru zlecenia.
- Wymaga nowej decyzji właściciela: konto lub płatny plan Upstash (fallback ADR-003), płatny plan
  Vercel lub Resend, nowe strony spoza tabeli W-01 (poza polityką prywatności i 404), zmiana treści
  względem designu, cokolwiek na domenie iskt.pl lub produkcji.

## Gotowość środowiska

`shctl doctor` 2026-11-05T12:29Z: 0 błędów. Uwagi: klon Obsidian iskt-www różni się od origin
(synchronizuje orkiestrator), 3 stare repo testowe do usunięcia (nie dotyczy projektu). Braki ważne dla
projektu: konto/projekt Vercel i konto Resend z kluczem testowym (zadania właściciela), `.env.local`
w `/Users/Shared/sh/projekty/iskt-www/` przed zadaniem #6. Ponowne `doctor` przed pierwszym dispatchem
robi orkiestrator.

## Następny krok

Po akceptacji architektury i planu: `sh-zadania` zakłada issue zadań #1–#12 (kamienie 1–4), a
właściciel podpina projekt Vercel przed QA kamienia 1.
