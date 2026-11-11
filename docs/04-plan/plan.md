---
projekt: iskt-www
etap: 04-plan
data: "2026-11-05"
rola: architekt
---

# Plan: iskt-www

Źródło: `docs/00-intake/specyfikacja.md` w rewizji f24eef2. Wymagania przywołujemy numerami `W-NN`,
szczegóły funkcji są w kartach `docs/00-intake/funkcje/W-NN.md`. Decyzje właściciela: `docs/decyzje.md`.
Zadania: `docs/06-zadania/zadania.yaml`. Skróty ścieżek designu: `D/` =
`docs/02-design/zrodla/Strona firmowa ISKT/`, `DS/` =
`D/_ds/iskt-greenovation-design-system-1705b29f-a657-4ea0-8548-faa4bf02a1b4/`.

Dokument scala `04-architektura/architektura.md` i `05-plan/plan.md` z procesu v1 (migracja na
`wersja_procesu: 2`, 2026-11-11). Treść planu jest z 2026-11-05; zmiany po akceptacji opisują decyzje
właściciela w `decyzje.md` (m.in. nadawca formularza z domeny iskt.pl, produkcja odłożona 2026-11-09).
Zlecenie odebrane przez właściciela 2026-11-06 (PR #40), zlecenie S #43–#45 zamknięte.

## Architektura

Statyczna strona firmowa w Astro 5 (ADR-002): 7 stron z designu (W-01), strona polityki prywatności
(W-06), strona 404 (W-09) i jeden endpoint serverless `POST /api/contact` (W-04, W-05) wysyłający
e-mail przez Resend (ADR-004). Bez bazy danych i bez kont (ADR-001). Hosting Vercel, funkcje w `fra1`.
Do przeglądarki trafia tylko mały JS dwóch interakcji: formularza i akordeonu FAQ.

Design z eksportu Claude Design jest **wzorcem wyglądu i treści, nie kodem do skopiowania**: pliki
`.dc.html` renderują się przez runtime React/Babel z CDN (`D/support.js`), więc kod przenosi treść,
strukturę i style do komponentów `.astro`, a nie dołącza `support.js`, `_ds_bundle.js`,
`image-slot.js` ani skryptów z unpkg.

### Moduły i punkty wejścia

| Moduł / funkcja | Punkt wejścia (strona, trasa, komenda, endpoint) | Design (pliki) | Wymagania |
|---|---|---|---|
| Strona główna (hero, kafle kompetencji, kontakt) | `/` → `src/pages/index.astro` | `D/ISKT-standalone.dc.html` | W-01, W-03 |
| Projekty B+R | `/uslugi/projekty-br/` → `src/pages/uslugi/projekty-br.astro` | `D/Projekty-BR.dc.html`, meta z `D/Projekty-BR-Ekspercki.dc.html:6-19` | W-01 |
| ESG | `/uslugi/esg/` → `src/pages/uslugi/esg.astro` | `D/ESG.dc.html` | W-01 |
| AI-transformacja | `/uslugi/ai-transformacja/` → `src/pages/uslugi/ai-transformacja.astro` | `D/AI-Transformacja.dc.html` | W-01 |
| Oprogramowanie | `/uslugi/oprogramowanie/` → `src/pages/uslugi/oprogramowanie.astro` | `D/Oprogramowanie.dc.html` | W-01 |
| Interim | `/uslugi/interim/` → `src/pages/uslugi/interim.astro` | `D/Interim.dc.html` | W-01 |
| Startupy | `/startupy/` → `src/pages/startupy.astro` | `D/Startupy.dc.html` | W-01 |
| Layout i nawigacja | `src/layouts/BaseLayout.astro` (każda strona) | `D/ISKT-standalone.dc.html:57-65`, `D/ESG.dc.html:44-68,247-252` | W-02, W-11 |
| Formularz kontaktowy | `/#kontakt` (`ContactForm`) → `POST /api/contact` (`src/pages/api/contact.ts`, `prerender=false`) | `D/ISKT-standalone.dc.html:154-182` | W-04, W-05 |
| Polityka prywatności i klauzula | `/polityka-prywatnosci/` → `src/pages/polityka-prywatnosci.astro`; klauzula w `ContactForm` | układ stron usług (`D/ESG.dc.html`) | W-06 |
| Meta, Open Graph, JSON-LD | `Seo`, `JsonLd` w `BaseLayout`, dane w `src/content/seo.ts` | `D/*.dc.html:6-19` | W-07 |
| Sitemap i robots | `/sitemap.xml` (`@astrojs/sitemap`, kopia `sitemap-0.xml` w `astro.config.mjs`), `/robots.txt` → `src/pages/robots.txt.ts`, `X-Robots-Tag` w `vercel.json` | `D/sitemap.xml`, `D/robots.txt` | W-08 |
| Strona 404 | `src/pages/404.astro` | styl stron serwisu | W-09 |
| Jakość i staging | `lighthouserc.cjs`, `pnpm lh:staging`, CI | — | W-10, W-12 |

Struktura kodu:

```text
src/
  pages/            routing (jedyne miejsce definiowania URL)
  layouts/BaseLayout.astro   <html lang="pl">, <Seo>, SkipLink, SiteHeader, <main>, SiteFooter
  components/
    layout/   SiteHeader, SiteFooter, SkipLink, Breadcrumb, Seo, JsonLd
    ui/       Button, Badge, Card, SectionHeading, Icon, Field (Input/Textarea)
    home/     HomeHero, ServiceTile, ServiceGrid, ContactSection, ContactForm
    service/  ServiceHero, WhenIntro, ScopeList, ComparisonTable, ProcessTimeline, CtaBand,
              OtherServices, ProductCard, RoleArticle
    br/       IconCardGrid, ProcessCards, ProgramCard, AudienceDark, FaqAccordion, CtaBandBrand,
              ServiceChips
  content/   site.ts (dane firmy, nawigacja, lista usług — jedno źródło dla stopki, kafli i
             „Pozostałe kompetencje”), seo.ts (title/description/ścieżka per strona)
  lib/       contact-schema.ts (Zod, wspólny), mailer.ts (Resend), rate-limit.ts, log.ts (logger
             bez PII), env.ts (walidacja zmiennych)
  styles/    tokens/{colors,typography,spacing,effects}.css, global.css (reset z DS/base.css)
public/      fonts/, favicon.ico, favicon-32.png, apple-touch-icon.png, og/iskt-og.png
```

Zasady granic:

- **Podpięcie do aplikacji:** każda strona jest plikiem w `src/pages/`, każda używa `BaseLayout`.
  Każdy komponent z `components/` jest użyty przez co najmniej jedną stronę albo layout w tym samym
  zadaniu, w którym powstaje; test E2E zadania otwiera stronę, na której komponent jest widoczny. Bez
  stron-katalogów komponentów i bez komponentów „na zapas”.
- **Dane firmy** (adres, NIP, REGON, telefon, e-mail, lista usług z URL) tylko w `content/site.ts`.
- **Linki z designu** `*.dc.html` mapujemy na czyste URL: `Wariant-C-Kompakt.dc.html` i
  `ISKT-standalone.dc.html` → `/`, `#kompetencje` → `/#kompetencje`, `#kontakt` → `/#kontakt`,
  `Projekty-BR-Ekspercki.dc.html` → `/uslugi/projekty-br/`, pozostałe `X.dc.html` → URL z tabeli W-01.
  Link „Szkolenia” → `https://szkolenia.iskt.pl` (zewnętrzny, zostaje).
- **Endpoint** `api/contact.ts` jest jedynym kodem serwerowym; zależy tylko od `lib/`.

### Model danych

Brak bazy danych i trwałego stanu (ADR-001, ADR-002). Dane formularza żyją tylko w żądaniu:

| DTO `ContactRequest` | Reguła (W-04, W-05) |
|---|---|
| `name` | wymagane, 1–100 znaków, bez CR/LF |
| `email` | wymagane, format e-mail, ≤ 254 |
| `message` | wymagane, 1–5000 znaków |
| `website` | honeypot, musi być pusty (ukryty, `tabindex=-1`, `autocomplete=off`) |

Odpowiedzi: `200 {ok:true}`, `400 {error:"invalid", fields:{…}}`, `429 {error:"rate_limited"}`,
`502 {error:"send_failed"}`, `405` dla innych metod, `413` dla ciała > 32 kB, `415` dla typów innych niż JSON.

Migracje są zgodne wstecz (expand/contract): poprzednia wersja aplikacji działa na nowym schemacie.
W tym projekcie nie ma schematu; zasada obowiązuje każdą przyszłą bazę (np. CMS) i jej ADR.

### Design

Tokeny przenosimy 1:1 z design systemu do `src/styles/tokens/` (ten sam podział plików). Strony z
designu używają tokenów przez style inline; kod zamienia style inline na scoped CSS komponentów z
tymi samymi tokenami. Wartości zapisane na sztywno w designie (niżej) stają się tokenami
pomocniczymi z prefiksem `--x-`.

#### Kolory — `DS/tokens/colors.css`

| Grupa | Tokeny |
|---|---|
| Zieleń (marka) | `--green-50 #F2F8EC`, `-100 #E1EFCF`, `-200 #D5EBAC`, `-300 #A9CE6E`, `-400 #7FA83A`, `-500 #54841D` (akcent), `-600 #2E6B1E`, `-700 #1E551D` (primary), `-800 #123F14`, `-900 #0A3400` |
| Ink | `--ink-900 #0E1511`, `-800 #182019`, `-700 #2A322C`, `-600 #3E4740` |
| Neutralne | `--neutral-0 #FFFFFF`, `-50 #FAFBF8`, `-100 #F3F5F0`, `-200 #E7EAE2`, `-300 #D4D9CD`, `-400 #AEB4A6`, `-500 #7E857A`, `-600 #5B6157`, `-700 #40453D`, `-800 #282C26`, `-900 #14170F` |
| Statusy | `--success-500 #2E6B1E`/`-50 #EAF4E3`, `--warning-500 #B8860B`/`-50 #FBF3DE`, `--error-500 #B23B2E`/`-50 #FBEBE8`, `--info-500 #1C6E6A`/`-50 #E3F1F0` |
| Semantyczne | `--color-primary` (g-700; hover g-800, active g-900), `--color-accent` (g-500), `--text-primary` (ink-900), `--text-secondary` (n-600), `--text-muted` (n-500), `--text-brand`/`--text-link` (g-700), `--text-link-hover` (g-900), `--text-on-dark` (n-50), `--text-on-brand` (#FFF), `--surface-page`/`--surface-card` (n-0), `--surface-subtle` (n-50), `--surface-muted` (g-50), `--surface-dark` (ink-900), `--surface-brand` (g-700), `--border-subtle` (n-200), `--border-default` (n-300), `--border-strong` (n-400), `--border-brand` (g-700), `--focus-ring` (g-500 55%) |
| Pomocnicze z designu | `--x-glow-1 rgba(84,132,29,.16)`, `--x-glow-2 rgba(84,132,29,.20)`, `--x-glow-3 rgba(213,235,172,.22)`, `--x-dark-card-bg rgba(255,255,255,.04)`, `--x-dark-card-border rgba(255,255,255,.10)` |

Brak motywu ciemnego (design: `themes: []`); ciemne sekcje to pasma `--surface-dark`. `--text-muted`
(n-500 na bieli, kontrast ok. 3,9:1) używamy tylko dla tekstu ≥ 18,66 px pogrubionego albo
dekoracyjnego; tekst drobny dostaje `--text-secondary` (W-11, WCAG AA). Kontrast par kolorów
sprawdza axe w E2E.

#### Typografia — `DS/tokens/typography.css`, `DS/tokens/fonts.css`

| Token | Wartość |
|---|---|
| Rodziny | `--font-sans: 'Inter', system-ui, …` (display/body/heading = sans), `--font-mono: 'JetBrains Mono', ui-monospace, …` |
| Źródło czcionek | **Samohostowane** (zamiast `@import` Google Fonts z `fonts.css:9`): Inter 400/500/600/700/800 i JetBrains Mono 400/500/600, licencja SIL OFL, `font-display: swap`, preload Inter 800 i 400, podzbiór latin + latin-ext (polskie znaki) — W-10 |
| Skala | `--text-xs .75rem`, `sm .875`, `base 1`, `lg 1.125`, `xl 1.375`, `2xl 1.75`, `3xl 2.25`, `4xl 3`, `5xl 3.75`, `6xl 4.5` |
| Wagi | `--fw-regular 400`, `medium 500`, `semibold 600`, `bold 700`, `extrabold 800` |
| Interlinia | `--lh-tight 1.08`, `snug 1.25`, `normal 1.5`, `relaxed 1.65` |
| Odstępy liter | `--ls-tighter -0.03em`, `tight -0.015em`, `normal 0`, `wide 0.02em`, `caps 0.08em` |
| Nagłówki hero (z designu) | `--x-h1-home clamp(2.2rem,5vw,3.6rem)`/lh 1.04 (`D/ISKT-standalone.dc.html:69`), `--x-h1-service clamp(2.2rem,5.2vw,3.8rem)`/lh 1.02, `--x-h1-br clamp(2rem,4.4vw,3.2rem)`/lh 1.06 (`D/Projekty-BR.dc.html:57`), `--x-h2-cta clamp(1.8rem,3.6vw,2.6rem)` |

#### Odstępy, układ, efekty — `DS/tokens/spacing.css`, `DS/tokens/effects.css`

| Token | Wartość |
|---|---|
| Odstępy | `--space-0 0`, `-1 .25rem`, `-2 .5`, `-3 .75`, `-4 1`, `-5 1.25`, `-6 1.5`, `-8 2`, `-10 2.5`, `-12 3`, `-16 4`, `-20 5`, `-24 6`, `-32 8` |
| Kontener | `--container-max 1200px`, `--container-pad clamp(1.25rem,5vw,3rem)`, `--section-pad-y clamp(4rem,9vw,7.5rem)`; z designu: `--x-container-narrow 900px` (hero/intro/proces/CTA usług), `--x-container-faq 860px`, szerokości tekstu 460–760 px jako `max-width` w `ch`/px w komponentach |
| Promienie | `--radius-xs 4px`, `sm 8`, `md 12`, `lg 16`, `xl 24`, `2xl 32`, `pill 999px`; `--border-width 1px`, `-strong 2px` |
| Cienie | `--shadow-xs`, `-sm`, `-md`, `-lg`, `-brand` (wartości z `effects.css`) |
| Ruch | `--ease-standard`, `--ease-out`, `--dur-fast 130ms`, `-base 220ms`, `-slow 380ms`; pod `prefers-reduced-motion: reduce` czasy = 0 i brak `translateY` (W-11) |
| Gradienty | `--gradient-brand`, `--gradient-leaf`, `--gradient-wash` |
| Punkty przełamania | Design nie ma `@media` (układ na `auto-fit/minmax`, `clamp`, `flex-wrap`). Wprowadzamy dwa: `--bp-sm 640px`, `--bp-md 960px` (w CSS jako literały w `@media`), używane tylko tam, gdzie układ z designu się nie składa: siatka kompetencji na stronie głównej (`repeat(3,…)` w `D/ISKT-standalone.dc.html:93` → 1/2/3 kolumny), nagłówek z `white-space: nowrap`, tabele porównawcze (przewijanie poziome w kontenerze z `tabindex=0` i podpisem) — W-03. Po odbiorze (#43, decyzja właściciela): duże logo w hero strony głównej ukryte poniżej 768 px, CTA nagłówka w jednym rzędzie z logo |

Reset bazowy: `DS/tokens/base.css` (box-sizing, nagłówki, `:focus-visible` 3 px w `--focus-ring`,
`::selection`). Nazwa marki w treści: **„ISKT Greennovation”** jak na stronach (DS używa
„Greenovation” tylko w nazwie pakietu).

#### Komponenty i ich podpięcie

Wzorzec implementacji prymitywów: komponenty React design systemu w `DS/_ds_bundle.js` (Button l. 483,
Input l. 758, Textarea l. 1099, Badge l. 111, Card l. 174, SectionHeading l. 240) — przepisane na
`.astro` bez React. Ikony: Lucide (stroke 2) renderowane w buildzie jako inline SVG
(`@lucide/astro`), lista: arrow-right, send, flask-conical, recycle, cpu, rocket, code-xml,
graduation-cap, user-cog, search-check, coins, file-text, clipboard-check, shield-check, check,
chevron-down, chevron-up.

| Komponent | Wzorzec w designie | Gdzie podpięty |
|---|---|---|
| `BaseLayout` | struktura stron | wszystkie strony |
| `SkipLink` | brak w designie (W-11) | `BaseLayout` |
| `SiteHeader` (warianty `home`, `page`) | home: `D/ISKT-standalone.dc.html:57-65` (logo, „Umów konsultację”); usługi: `D/ESG.dc.html:44-55` (logo→`/`, „Kompetencje”→`/#kompetencje`, CTA→`/#kontakt`) | `BaseLayout` (prop z strony) |
| `SiteFooter` | `D/ESG.dc.html:247-252` (pełna wersja: adres, NIP, e-mail, telefon) + link „Polityka prywatności” | `BaseLayout` |
| `Breadcrumb` (+ JSON-LD BreadcrumbList) | `D/ESG.dc.html:62-68` | 6 stron usług |
| `Seo`, `JsonLd` | `<head>` każdej strony (`D/*.dc.html:6-19`) | `BaseLayout` |
| `Button` (primary, secondary, outline, ghost, dark; sm/md/lg; jako `<a>` albo `<button>`, nigdy zagnieżdżone) | `DS/_ds_bundle.js:483` | hero, CTA, formularz |
| `Badge` | `DS/_ds_bundle.js:111` | HomeHero, ProductCard, ProgramCard, hero B+R |
| `Card` | `DS/_ds_bundle.js:174` | ContactForm, karty usług |
| `SectionHeading` (eyebrow z belką, h2, podtytuł; `align` center/left) | `DS/_ds_bundle.js:240` | sekcje wszystkich stron |
| `Icon` | Lucide, `this.ic()` w stronach | kafle, karty, przyciski |
| `Field` (Input, Textarea, etykieta, `*`, błąd z `aria-describedby`) | `DS/_ds_bundle.js:758,1099` | ContactForm |
| `HomeHero` | `D/ISKT-standalone.dc.html:54-86` | `/` |
| `ServiceTile`, `ServiceGrid` (7 kafli, Interim na całą szerokość, Szkolenia zewn.) | `D/ISKT-standalone.dc.html:87-153` | `/` |
| `ContactSection`, `ContactForm` (stany: domyślny, wysyłanie, sukces „Dziękujemy!”, błąd pola, błąd wysyłki, 429; klauzula informacyjna) | `D/ISKT-standalone.dc.html:154-182` | `/` (`#kontakt`) |
| `ServiceHero` (wąski, gradient w h1, lead, CTA, mikrotekst mono, „Zobacz też”) | `D/ESG.dc.html:58-78` | 5 stron usług |
| `WhenIntro` (dwie kolumny z lewą belką 3 px) | `D/ESG.dc.html` sekcja „Kiedy” | ESG, AI, Oprogramowanie, Interim, Startupy |
| `ScopeList` (6 punktów, numery mono) | ESG/AI/Oprogramowanie/Startupy „Zakres” | 4 strony |
| `ComparisonTable` (4 kolumny, przewijanie poziome) | ESG/AI/Oprogramowanie/Interim/Startupy | 5 stron |
| `ProcessTimeline` (oś pionowa, „ETAP 0X”) | ESG/AI/Oprogramowanie/Startupy (5), Interim (4) | 5 stron |
| `CtaBand` (jasny) | ESG/AI/Oprogramowanie/Interim/Startupy | 5 stron |
| `OtherServices` (6 kart: pozostałe usługi + Szkolenia, z `site.ts`) | `D/ESG.dc.html:209-245` | 5 stron |
| `ProductCard` | `D/Oprogramowanie.dc.html` „Nasze aplikacje” (Clara, Petra) | `/uslugi/oprogramowanie/` |
| `RoleArticle` | `D/Interim.dc.html` „Role” (4) | `/uslugi/interim/` |
| `IconCardGrid`, `ProcessCards`, `ProgramCard`, `AudienceDark`, `FaqAccordion` (przycisk z `aria-expanded`/`aria-controls`, pierwszy otwarty), `CtaBandBrand`, `ServiceChips` | `D/Projekty-BR.dc.html` (zakres, `#proces`, programy, „Dla kogo”, FAQ l. 208-227 i 288-318, CTA l. 229-240, chipy) | `/uslugi/projekty-br/` |

#### Zasoby

- Logo: `D/assets/iskt-logo-transparent.png` (1120×898, 1,77 MB) → `src/assets/`, optymalizowane przez
  `astro:assets` (AVIF/WebP, rozmiary 40/80/… px i duże w hero home).
- Favicon: wybrany wariant C (`D/assets/iskt-favicon-512.png` = `favicon-c-monogram-512.png`); z niego
  `favicon.ico` (16/32), `favicon-32.png`, `apple-touch-icon.png` (180), `icon-512.png`.
- Obraz OG: w designie brak (`og:image` wskazuje nieistniejący plik). Statyczny
  `public/og/iskt-og.png` 1200×630 z logo, nazwy i hasła „Innowacje w harmonii z naturą” na
  `--gradient-wash`; zaakceptowany przy odbiorze (W-07, O-6).
- Pliki `D/uploads/*`, `D/image-slot.js`, `D/Favicon.dc.html` — tylko wgląd, nie trafiają do aplikacji.

#### Rozstrzygnięcia luk designu

| Luka | Rozstrzygnięcie |
|---|---|
| Strona B+R: właściciel wybrał `Projekty-BR.dc.html` (wersja podstawowa), ale ma ona `noindex`, brak meta, a wszystkie linki w designie prowadzą do `Projekty-BR-Ekspercki.dc.html` | Treść i układ z `Projekty-BR.dc.html` (decyzja właściciela); meta (title, description, canonical, JSON-LD Service/Breadcrumb) z `<head>` `Projekty-BR-Ekspercki.dc.html:6-19`; bez `noindex` |
| Nawigacja: design ma tylko „Kompetencje” i CTA, bez menu mobilnego; W-02 wymaga wyróżnienia bieżącej strony z `aria-current="page"` | Nawigację strony tworzą dwa landmarki `<nav>`: nagłówek (`SiteHeader`) i ścieżka (`Breadcrumb`, `<nav aria-label="Ścieżka">`, na stronach usług i polityce). Bieżąca strona: **na stronie głównej** link logo w nagłówku ma `aria-current="page"`; **na każdej innej stronie** ostatnia pozycja ścieżki to nazwa bieżącej strony jako `<a aria-current="page">` wyróżniona wizualnie (`--fw-semibold`, `--text-primary`, bez podkreślenia; poprzednie pozycje w `--text-link`), a w nagłówku link „Kompetencje” na stronach usług ma stan aktywny (podkreślenie 2 px `--color-accent`, `aria-current="true"` — sekcja, nie strona). Dwa elementy nagłówka mieszczą się od 320 px (zawijanie, bez hamburgera — design nie ma menu mobilnego, więc kryterium W-02 o menu mobilnym nie ma zastosowania). Test E2E każdej strony sprawdza dokładnie jeden element `aria-current="page"` wskazujący bieżący URL |
| Nagłówek home w `<main>` wewnątrz hero | `SiteHeader` zawsze w `<header>` poza `<main>`; wygląd home bez zmian (nałożony na tło hero) |
| Brak polityki prywatności i klauzuli | Strona `/polityka-prywatnosci/` w stylu stron usług i robocza klauzula przy formularzu (decyzja właściciela P2), oznaczone do akceptacji przy odbiorze |
| Stopki różnią się między stronami | Jedna stopka: wersja pełna z `D/ESG.dc.html:247-252` + link do polityki prywatności; rok z daty buildu |
| Breadcrumb JSON-LD wskazuje nieistniejące `/uslugi/` | Pozycja „Kompetencje” → `/#kompetencje` |
| Przyciski DS zagnieżdżone w `<a>` | `Button` renderuje `<a>` albo `<button>`, nigdy oba |
| Brak stanu błędu formularza w designie | Komunikaty w stylu `--error-500`/`--error-50` z `Field` (DS Input, stan error) |

### Integracje

| Integracja | Gdzie | Zasady |
|---|---|---|
| Resend | `lib/mailer.ts` | ADR-004: timeout 10 s, `text`, `replyTo`, klucz z env, mock w testach. Nadawca `CONTACT_FROM` z domeny iskt.pl, odbiorca `CONTACT_TO` (decyzja właściciela 2026-11-06) |
| Vercel Firewall (rate limit) | konfiguracja projektu Vercel | ADR-003: 5 × POST `/api/contact` / 10 min / IP → 429; reguła opublikowana przez właściciela 2026-11-05, fallback Upstash niepotrzebny |
| Zewnętrzne zasoby w przeglądarce | — | Brak: fonty, ikony i obrazy lokalne; brak analityki i cookies (W-10, decyzje) |

### Bezpieczeństwo

- **Auth:** brak kont i paneli; jedyna powierzchnia zapisu to `POST /api/contact`.
- **Dostęp do danych:** brak przechowywanych danych (ADR-001). Walidacja serwera Zod, honeypot,
  sprawdzenie `Origin` = `PUBLIC_SITE_URL`, tylko `POST` (ADR-004). **Transport i limit ciała:**
  `ContactForm` wysyła `fetch` z `Content-Type: application/json` (UTF-8); endpoint przyjmuje
  **wyłącznie JSON** (inne typy → 415). **Bez JavaScriptu formularz nie jest wysyłany:** element
  `<form>` ma atrybut `hidden` usuwany przez skrypt komponentu, a `<noscript>` pokazuje komunikat
  „Aby wysłać formularz, włącz JavaScript albo napisz do nas: biuro@iskt.pl” z linkiem `mailto:` i
  telefonem z `site.ts`. Dzięki temu nie ma wysyłki bez JS ani danych osobowych w URL (formularz nie
  ma `action` i nigdy nie wysyła GET), a stan sukcesu/błędu i zachowanie wpisanych danych (W-04)
  obsługuje zawsze skrypt po stronie przeglądarki. Limit ciała **32 kB**, liczony z najgorszego
  przypadku dozwolonych pól: znak 4-bajtowy UTF-8 to 4 bajty w JSON (bez escapowania), więc
  (5000 + 100 + 254) × 4 B + klucze, honeypot i narzut ≈ 21,6 kB < 32 kB. Długości liczymy w znakach
  Unicode (code points), nie bajtach.
- **Rate limit:** ADR-003.
- **Sekrety:** `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`, `PUBLIC_SITE_URL`, `PUBLIC_SITE_ENV`,
  `RATE_LIMIT_PROVIDER`, `RATE_LIMIT_SALT` — w `.env.example` bez wartości; `lib/env.ts` waliduje
  przy starcie funkcji. Tylko klucze testowe lokalnie; gitleaks w CI (W-12).
- **Dane osobowe:** ADR-001; `lib/log.ts` loguje tylko `{event, status, code, requestId}`; test
  jednostkowy sprawdza brak PII w logach (W-06).
- **Nagłówki:** `vercel.json`: `Content-Security-Policy` (self, bez inline skryptów poza hashami
  Astro), `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`,
  `Permissions-Policy` minimalne, `X-Robots-Tag: noindex` tylko gdy `PUBLIC_SITE_ENV=staging` (W-08,
  W-10 Best Practices).

### Środowiska i droga na produkcję

| Środowisko | Opis w tym projekcie |
|---|---|
| LOCAL | `pnpm dev` (port `dev` z bloku: 55326); bez Supabase i Dockera (ADR-002); `.env.local` z kluczem testowym Resend albo `MAIL_TRANSPORT=mock` |
| PREVIEW | Vercel preview dla PR, za Deployment Protection (E-005, E-008): pomiary i weryfikacje na stagingu po merge'u |
| STAGING | `main` pod aliasem https://iskt-www.vercel.app (`staging_url` w `konfiguracja.md`), `PUBLIC_SITE_ENV=staging` → `noindex`; reguła rate limit WAF. W pilocie Production Branch w Vercel to `main`, zmienne staging w Production i Preview (decyzja właściciela 2026-11-05). Brak bazy: `staging.yml` i `STAGING_DB_URL` nie dotyczą |
| PROD | Bez dostępu agentów. Odłożona przez właściciela 2026-11-09 (projekt na `main`, bez gałęzi `production` i tagów). Przy B9a właściciel: domena iskt.pl, gałąź `production`, zmienne prod (`PUBLIC_SITE_ENV=production`, `PUBLIC_SITE_URL=https://iskt.pl`, klucz prod Resend), wdrożenie `scripts/deploy-prod.sh vX.Y.Z` |

Odstępstwa od drogi na produkcję z procesu: brak kroku migracji bazy; produkcja odłożona.

### Testy

| Poziom | Narzędzie | Zakres |
|---|---|---|
| Lint i typy | ESLint, Prettier, `astro check` | cały kod |
| Jednostkowe | Vitest | `contact-schema`, `mailer` (mock Resend, timeout), `rate-limit` (pamięć, upstash z mockiem), `api/contact` (200/400/405/413/415/429/502, honeypot, brak PII w logach), `seo` (unikalne title/description) |
| E2E | Playwright (chromium + webkit, wersja z `konfiguracja.md`) + `@axe-core/playwright` | per strona: 200, nagłówki i sekcje z designu, brak placeholderów, linki wewnętrzne bez 404, brak poziomego scrolla na 375/768/1440, axe bez serious/critical, Tab i SkipLink; formularz z `MAIL_TRANSPORT=mock`; 404; `sitemap.xml`, `robots.txt`, meta/OG. W CI: job `e2e` na PR, `qa-staging` na `staging_url` dla PR z `stage/08-qa` |
| Lighthouse | `@lhci/cli` (`lighthouserc.cjs`, preset mobile i desktop, asercje ≥ 0.9 dla 4 kategorii; na stagingu `is-crawlable` wyłączony), `pnpm lh:staging` | QA kamieni na stagingu (W-10); wynik w raporcie QA |
| Na stagingu (QA) | ręcznie / curl | e-mail dochodzi, 6. POST → 429, `X-Robots-Tag: noindex` |

### Decyzje

- ADR-001: Dane osobowe w formularzu kontaktowym
- ADR-002: Stack Astro i hosting Vercel (odstępstwo od kontraktu: bez Supabase)
- ADR-003: Rate limit formularza (Vercel Firewall, fallback Upstash)
- ADR-004: Integracja Resend i sekrety
- ADR-005: Node 22 zamiast 26

## Kamienie milowe

Każdy kamień to pionowy przekrój: działający rezultat jednej ścieżki (UI, endpoint, testy, docs),
widoczny na stagingu. Wszystkie kamienie zakończone (QA M1–M4: `docs/08-qa/raport-M1.md`…`raport-M4.md`).

| Nr | Kamień milowy | Rezultat | Wymagania | Warunek startu |
|---|---|---|---|---|
| 1 | Szkielet, layout i strona główna | Repo z CI zielonym, komendy w `AGENTS.md` sprawdzone; layout (nagłówek, stopka, SkipLink, SEO) i strona główna `/` zgodne z designem na stagingu, z `sitemap.xml`, `robots.txt`, `noindex` stagingu, faviconami i obrazem OG; 404 | W-01 (strona główna), W-02, W-03, W-07, W-08, W-09, W-11, W-12 | Plan zaakceptowany; projekt Vercel podpięty przed QA M1 |
| 2 | Formularz kontaktowy end-to-end | Odwiedzający wysyła zapytanie z `/#kontakt`, e-mail dochodzi na adres testowy; walidacja, błędy, honeypot, rate limit, klauzula i strona polityki prywatności | W-04, W-05, W-06, W-12 | QA M1 zakończone; konto Resend, zmienne Preview i reguła rate limit w Vercel (zadania właściciela) |
| 3 | Strony usług | 6 stron usług zgodnych z designem, osiągalnych z kafli strony głównej i z „Pozostałe kompetencje”, z breadcrumb i meta | W-01, W-02, W-03, W-07, W-11 | QA M2 zakończone |
| 4 | Jakość i wydanie | Wszystkie strony: E2E przekrojowe, Lighthouse ≥ 90 (4 kategorie, mobile i desktop) na stagingu, dokumentacja wydania | W-03, W-10, W-11, W-12 | QA M3 zakończone |

Pierwsze zadanie kamienia 1 to szkielet (#5), ostatnie zadanie planu to dokumentacja wydania (#16).
QA kamienia sprawdza tylko strony zbudowane do tego kamienia: w M1 i M2 linki z kafli i z
„Umów konsultację” do stron usług mogły jeszcze dawać 404; od QA M3 każdy link wewnętrzny musi działać,
a sitemap mieć dokładnie 7 stron.

DoD QA każdego kamienia (`sh-qa`): scenariusze odbioru kamienia, wymagania `W-NN` kamienia w raporcie
oraz **Lighthouse na stagingu dla stron kamienia, profil mobile i desktop: wydajność, dostępność, SEO i
dobre praktyki ≥ 90** (W-10; SEO na stagingu bez audytu `is-crawlable`). Wynik < 90 to błąd QA.

Każde zadanie, które tworzy stronę lub komponent, ma w kryteriach: „podpięte do routingu
(`src/pages/`) lub layoutu (`BaseLayout`), widoczne na wskazanej stronie i pokryte testem E2E tej
strony”. Brak zadań z migracją (projekt bez bazy).

Poza zakresem kamieni: CMS/blog, wersje językowe, integracje, analityka, cookies, wdrożenie na iskt.pl
(specyfikacja, „Poza zakresem”).

## Zadania właściciela

| Zadanie | Przed | Uwagi |
|---|---|---|
| Konto Vercel ISKT (konto klienta) i projekt podpięty do `Sebastian-Temich/iskt-www`, stały alias stagingu dla `main`, region funkcji `fra1` | QA kamienia 1 | Zrobione 2026-11-05 (https://iskt-www.vercel.app) |
| Zmienne w Vercel: `PUBLIC_SITE_URL` (alias stagingu), `PUBLIC_SITE_ENV=staging` | QA kamienia 1 | Bez sekretów |
| Konto Resend, klucz, zmienne `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`; klucz testowy w `/Users/Shared/sh/projekty/iskt-www/.env.local` (shctl kopiuje go workerom) | startem zadania formularza | Klucz tylko w env, nigdy w czacie/repo. Stan 2026-11-06: `formularz@iskt.pl` → `biuro@iskt.pl` |
| Reguła rate limit w Vercel Firewall (POST `/api/contact`, 5/10 min/IP → 429) | QA kamienia 2 | ADR-003; zrobione 2026-11-05 |
| Akceptacja umów powierzenia (DPA) Vercel i Resend | odbiorem | ADR-001 |
| Akceptacja roboczej klauzuli, polityki prywatności i obrazu OG | odbiorem | P2 specyfikacji |
| Konta prod: Vercel (to samo konto), Supabase prod | — | Supabase nie dotyczy (ADR-002) |
| Projekt Supabase staging i sekret `STAGING_DB_URL` w GitHub Secrets | — | Nie dotyczy: projekt bez bazy (ADR-002) |
| Domena iskt.pl i DNS w Vercel, weryfikacja domeny w Resend (SPF/DKIM) | wdrożeniem prod (B9a) | Produkcja odłożona 2026-11-09 |
| Zmienne prod w panelu Vercel (`PUBLIC_SITE_ENV=production`, `PUBLIC_SITE_URL=https://iskt.pl`, klucz prod Resend, `CONTACT_TO`, `CONTACT_FROM` z domeny) | wdrożeniem prod (B9a) | Sentry nie dotyczy (brak w zakresie) |

## Ryzyka

| Ryzyko | Skutek | Działanie (ADR, spike, dowody) | Właściciel |
|---|---|---|---|
| Plan Vercel bez reguły rate limit | W-05 niespełnione | ADR-003: reguła WAF opublikowana, fallback Upstash po decyzji właściciela | architekt (ADR), właściciel (plan Vercel) |
| Lighthouse < 90 na mobile (duże logo PNG, czcionki, CSS) | W-10 niespełnione | `astro:assets`, samohostowane czcionki z preload, zero JS poza 2 interakcjami; pomiar w QA każdego kamienia | QA |
| Dane osobowe w logach lub e-mailu | naruszenie W-06 | ADR-001, `lib/log.ts`, test „brak PII w logach” | review |
| Niekompletny design (brak polityki, OG, menu mobilnego, `@media`, meta B+R) | rozbieżność z oczekiwaniem właściciela | Rozstrzygnięcia w „Design”, akceptacja przy odbiorze | architekt, właściciel |
| Kontrast `--text-muted` < 4,5:1 | axe/Lighthouse a11y | Reguła w „Design”, axe w E2E każdej strony | worker, QA |
| Brak kont Vercel/Resend na czas | blokada QA M1/M2 | Zadania właściciela z terminem „przed”; zadania niezależne trwają | właściciel |

## Scenariusze odbioru

| Nr | Scenariusz | Kroki | Oczekiwany wynik | Wymagania | Kamień |
|---|---|---|---|---|---|
| O-1 | Strona główna jak w designie | Otwórz alias stagingu na komputerze i telefonie | Hero, 7 kafli kompetencji, sekcja kontaktu i stopka jak w `ISKT-standalone`; na telefonie kafle w jednej kolumnie, bez przewijania w bok | W-01, W-03 | 1 |
| O-2 | Przejście po wszystkich usługach | Z kafli strony głównej otwórz każdą z 6 usług, na każdej użyj „Pozostałe kompetencje” i logo | Każda strona zgodna ze swoim plikiem designu, breadcrumb, powrót na `/`, żadnego 404 | W-01, W-02 | 3 |
| O-3 | Wysłanie zapytania | Na `/#kontakt` wypełnij imię, e-mail, wiadomość i wyślij | Komunikat „Dziękujemy!”, e-mail na adresie odbiorcy z danymi i `Reply-To` nadawcy | W-04, W-06 | 2 |
| O-4 | Błędy formularza i brak JavaScriptu | Wyślij pusty formularz, potem z błędnym e-mailem; następnie wyłącz JavaScript i otwórz `/#kontakt` | Komunikaty przy polach, fokus na pierwszym błędzie, nic nie wysłane; bez JS zamiast formularza komunikat z biuro@iskt.pl (`mailto:`) i telefonem, bez wysyłki | W-04, W-11 | 2 |
| O-5 | Ochrona przed spamem | Wyślij formularz 6 razy w ciągu 10 minut | 6. próba: komunikat o zbyt wielu zgłoszeniach (429) | W-05 | 2 |
| O-6 | Podgląd linku i indeksacja strony głównej | Wklej alias stagingu do walidatora OG; otwórz `/robots.txt` i nagłówki odpowiedzi stagingu | Tytuł, opis i obraz OG strony głównej; `robots.txt` bez `Disallow: /`; `X-Robots-Tag: noindex` | W-07, W-08 | 1 |
| O-7 | Klawiatura | Na stronie głównej naciśnij Tab | Pierwszy link „Przejdź do treści”, widoczny fokus, FAQ na B+R otwiera się Enterem | W-11 | 3 |
| O-8 | Wynik Lighthouse | Przejrzyj raport QA M4 | ≥ 90 w wydajności, dostępności, SEO i dobrych praktykach, mobile i desktop, dla każdej strony | W-10 | 4 |
| O-9 | Nieistniejący adres | Otwórz `/nie-ma-takiej-strony` | Strona 404 w stylu serwisu z linkiem do strony głównej | W-09 | 1 |
| O-10 | SEO wszystkich stron | Wklej adres dowolnej strony usługi do walidatora OG; otwórz `/sitemap.xml` stagingu | Tytuł, opis i obraz OG strony usługi; sitemap z dokładnie 7 stronami z W-01 | W-07, W-08 | 3 |

## Zakres autoryzacji

Zapisany w `decyzje.md` („Autoryzacja planu PR #3”, 2026-11-05); wygasł z odbiorem zlecenia
2026-11-06. Nowe prace tylko jako nowe zlecenie z własną autoryzacją.

- Na co: kamienie milowe 1–4 i zadania planu.
- Zakres: wymagania W-01–W-12; dostęp do konta Vercel ISKT (staging/preview) i konta Resend,
  zakładanych przez właściciela; darmowe plany Vercel i Resend; zależności npm z ADR-002–005.
- Do kiedy: do odbioru zlecenia.
- Wymaga nowej decyzji właściciela: konto lub płatny plan Upstash (fallback ADR-003), płatny plan
  Vercel lub Resend, nowe strony spoza tabeli W-01 (poza polityką prywatności i 404), zmiana treści
  względem designu, cokolwiek na domenie iskt.pl lub produkcji.

## Gotowość środowiska

`shctl doctor` 2026-11-05T12:29Z: 0 błędów. Braki ważne dla projektu w chwili planowania (konto Vercel,
konto Resend, `.env.local`) uzupełnione przez właściciela przed QA M1 i formularzem.

## Następny krok

Brak w tym planie: zlecenie odebrane. Kolejny krok projektu (produkcja B9a albo nowe zlecenie) na
polecenie właściciela.
