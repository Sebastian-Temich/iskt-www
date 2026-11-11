---
projekt: iskt-www
etap: wydanie
data: "2026-11-06"
rola: worker
zadanie: 16
---

# Dokumentacja techniczna: iskt-www

Strona firmowa ISKT Greennovation. Wymagania: `docs/00-intake/specyfikacja.md` (W-01 do W-12).
Architektura: `docs/04-plan/plan.md` („Architektura”) i ADR-001 do ADR-005. Plan i zadania właściciela:
`docs/04-plan/plan.md`. Dokument nie zawiera wartości sekretów, tylko nazwy zmiennych.

## Architektura w skrócie

| Element | Opis |
|---|---|
| Aplikacja | Astro 5 + TypeScript (strict). 7 stron z designu, polityka prywatności i 404 to strony statyczne (SSG) budowane w `pnpm build` |
| Kod serwerowy | Jeden endpoint `POST /api/contact/` (`src/pages/api/contact.ts`, `prerender = false`), funkcja serverless Vercel w regionie `fra1` |
| E-mail | Resend przez SDK `resend`, cały kod integracji w `src/lib/mailer.ts` (ADR-004): treść tylko tekstowa, `Reply-To` = e-mail nadawcy, timeout 10 s, bez ponowień |
| Dane | Brak bazy i brak zapisu zgłoszeń (ADR-001, ADR-002). Dane formularza istnieją tylko w żądaniu i w wysłanym e-mailu |
| Rate limit | Reguła Vercel Firewall (WAF) przed funkcją (ADR-003); kod ma wariant zapasowy `upstash`, nieużywany |
| Ochrona endpointu | Tylko `POST`, `Origin` równy `PUBLIC_SITE_URL` (inaczej 403), tylko JSON (415), ciało do 32 kB (413), honeypot, walidacja Zod (400) |
| Logi | `src/lib/log.ts`: tylko `{event, status, code, requestId}`, bez imienia, e-maila, treści i IP (W-06) |
| Nagłówki | `vercel.json`: CSP, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`. `X-Robots-Tag: noindex` dopisuje build poza produkcją (hook w `astro.config.mjs`) |
| SEO | `@astrojs/sitemap` (dokładnie 7 stron W-01), `src/pages/robots.txt.ts`, meta i JSON-LD z `src/content/seo.ts`, adresy z `PUBLIC_SITE_URL` |
| Zasoby | Czcionki Inter i JetBrains Mono samohostowane w `public/fonts/`, obrazy przez `astro:assets`, obraz OG `public/og/iskt-og.png` (1200×630). Brak zewnętrznych skryptów, analityki i cookies |
| Hosting | Vercel, konto klienta (ISKT), repo `Sebastian-Temich/iskt-www` |

## Uruchomienie lokalne

Wymagania: fnm, pnpm. Node z `.nvmrc` (22, jak runtime funkcji Vercel `nodejs22.x`; `engines.node`
w `package.json` to `22.x`, z niego Vercel bierze wersję Node projektu). Adapter `@astrojs/vercel`
wybiera runtime funkcji z wersji Node buildu i dla wersji spoza swojej listy (20, 22) ostrzega i
przyjmuje `nodejs22.x`.

```sh
fnm use
pnpm install --frozen-lockfile
pnpm dev --port 55326            # http://localhost:55326
```

`.env.local` (wzór `.env.example`) zawiera wyłącznie klucz testowy Resend. Bez klucza ustaw
`MAIL_TRANSPORT=mock`: formularz zwraca sukces bez wysyłki e-maila.

| Komenda | Co robi |
|---|---|
| `pnpm lint` | ESLint i `prettier --check .` |
| `pnpm typecheck` | `astro check` |
| `pnpm test` | Vitest (`src/**/*.test.ts`) |
| `pnpm exec playwright install chromium webkit` | Przeglądarki do E2E (raz) |
| `pnpm test:e2e` | Playwright chromium + webkit na `astro build` + `astro preview --port 55327` |
| `pnpm build` | Build dla Vercel w `.vercel/output/` |
| `pnpm lh:staging https://iskt-www.vercel.app` | Lighthouse 7 stron, mobile i desktop (`lighthouserc.cjs`) |

## Środowiska

| Środowisko | Adres | Gałąź | `PUBLIC_SITE_ENV` | Resend |
|---|---|---|---|---|
| LOCAL | `http://localhost:55326` | dowolna | brak (= `staging`) | klucz testowy albo `MAIL_TRANSPORT=mock` |
| PREVIEW | adres wdrożenia PR (za Deployment Protection Vercel) | `task/*`, `stage/*` | `staging` | klucz testowy |
| STAGING | **https://iskt-www.vercel.app** (stały alias stagingu, W-12) | `main` | `staging` (noindex) | klucz testowy, odbiorca testowy |
| PROD | https://iskt.pl (po B9a) | `production` (po B9a) | `production` | klucz produkcyjny, domena zweryfikowana |

Stan pilota (decyzje właściciela z 2026-11-05 w `docs/decyzje.md`): w Vercel gałęzią produkcyjną jest
`main`, więc `iskt-www.vercel.app` jest stagingiem, a zmienne stagingu są ustawione w środowiskach
Production i Preview. Każdy merge do `main` aktualizuje staging automatycznie. Gałąź `production`
powstaje dopiero w B9a.

## Konfiguracja i zmienne środowiskowe

Nazwy zmiennych, bez wartości. Wzór: `.env.example`. Walidacja: `src/lib/env.ts` (komunikaty błędów
podają tylko nazwy zmiennych). Wartości trzymamy wyłącznie w panelu Vercel i w lokalnym `.env.local`,
nigdy w repo ani w GitHub Secrets.

| Zmienna | Gdzie | Sekret | Opis | Staging | Prod (B9a) |
|---|---|---|---|---|---|
| `PUBLIC_SITE_URL` | build i funkcja | nie | Adres bazowy: canonical, `og:url`, sitemap, kontrola `Origin` formularza. Domyślnie `https://` + `VERCEL_PROJECT_PRODUCTION_URL` | adres stagingu | `https://iskt.pl` |
| `PUBLIC_SITE_ENV` | build i funkcja | nie | `production`, `staging` albo `development`. Brak = `staging` (noindex). Indeksowanie włącza wyłącznie `production` | `staging` | `production` |
| `RESEND_API_KEY` | funkcja | **tak** | Klucz API Resend z uprawnieniem tylko do wysyłki | klucz z dostępem do domeny `iskt.pl` | klucz produkcyjny ograniczony do `iskt.pl` |
| `CONTACT_TO` | funkcja | nie (dane kontaktowe) | Odbiorca zgłoszeń | `biuro@iskt.pl` | `biuro@iskt.pl` (skrzynka firmowa) |
| `CONTACT_FROM` | funkcja | nie | Nadawca, adres albo `Nazwa <adres>`; zawsze adres z domeny zweryfikowanej w Resend, nigdy adres klienta (klient trafia do `Reply-To`) | adres z domeny `iskt.pl` (`formularz@iskt.pl`) | adres z domeny `iskt.pl` (`formularz@iskt.pl`) |
| `MAIL_TRANSPORT` | funkcja | nie | `resend` (domyślnie) albo `mock` (testy, bez wysyłki) | nie ustawiać | nie ustawiać |
| `RATE_LIMIT_PROVIDER` | funkcja | nie | `waf` (domyślnie), `upstash`, `memory` (tylko testy) | nie ustawiać (`waf`) | nie ustawiać (`waf`) |
| `RATE_LIMIT_SALT` | funkcja | **tak** | Sól skrótu IP, min. 16 znaków, tylko dla `upstash` | — | — |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | funkcja | **tak** (token) | Tylko wariant zapasowy `upstash` (ADR-003) | — | — |
| `ASTRO_ADAPTER` | build E2E | nie | `node` tylko w Playwright; na Vercel nie ustawiać | — | — |
| `LH_BASE_URL`, `LH_PRESET`, `LH_ENV`, `LH_RUNS`, `CHROME_PATH` | lokalnie | nie | Opcje `pnpm lh:staging` | — | — |

`PUBLIC_SITE_URL` i `PUBLIC_SITE_ENV` działają w czasie buildu (sitemap, meta, `noindex`). Ich zmiana
wymaga nowego builda (redeploy), samo zapisanie w panelu nie wystarcza.

Pliki `deploy-prod.sh` (tylko urządzenie właściciela, nie w Vercel): `VERCEL_TOKEN`, `VERCEL_ORG_ID`,
`VERCEL_PROJECT_ID`, `PROD_DOMAIN`, `PROD_DB_URL` (opis w „Wdrożenie” i „Znane ograniczenia”).

## Reguła rate limit (Vercel Firewall)

Opublikowana przez właściciela 2026-11-05 (ADR-003, W-05). Plan Hobby ją obsługuje, wariant Upstash
nie jest potrzebny.

| Pole | Wartość |
|---|---|
| Miejsce | Vercel → projekt `iskt-www` → Firewall → Custom Rules |
| Warunek | Request Path *starts with* `/api/contact` **AND** Method *equals* `POST` |
| Akcja | Rate Limit, algorytm Fixed Window |
| Limit | 5 żądań na 600 s |
| Klucz | IP |
| Po przekroczeniu | odpowiedź 429 |

Reguła działa przed funkcją, więc liczy też żądania odrzucone przez walidację. Endpoint zwraca dla 429
ten sam JSON `{ "error": "rate_limited" }`, a formularz pokazuje „Zbyt wiele zgłoszeń, spróbuj później.”
Weryfikacja (QA M2): 6. `POST` w oknie → 429. Reguła dotyczy projektu, więc działa też po podpięciu
domeny iskt.pl. Po zmianach w Firewall sprawdź, że reguła jest opublikowana (nie w szkicu).

## Wdrożenie

Wykonuje wyłącznie właściciel ze swojego urządzenia przez `scripts/deploy-prod.sh`. W pilocie (etap A)
nie ma wdrożeń produkcyjnych: staging aktualizuje się sam po merge'u do `main`.

### Kroki B9a: przejście na iskt.pl

Kolejność ma znaczenie: najpierw gałąź i zmienne, potem domena, na końcu wdrożenie.

1. **Gałąź `production`.** Utwórz ją z `main` na tagu wydania (`git tag vX.Y.Z`, push tagu) i ustaw
   ochronę gałęzi w GitHub (bez force push, bez usuwania).
2. **Branch Tracking w Vercel.** Settings → Environments → Production → Branch Tracking: `production`
   zamiast `main`. Od tej chwili `main` buduje się jako Preview.
3. **Alias stagingu.** Settings → Domains: przypisz `iskt-www.vercel.app` do gałęzi `main` (Git Branch),
   żeby staging nadal pokazywał `main`, a nie produkcję. Sprawdź `curl -sI https://iskt-www.vercel.app/`:
   jest `x-robots-tag: noindex`.
4. **Zmienne Preview (staging).** Bez zmian względem stanu po odbiorze (decyzja właściciela z
   2026-11-06): `PUBLIC_SITE_ENV=staging`, `PUBLIC_SITE_URL=https://iskt-www.vercel.app`,
   `RESEND_API_KEY` (klucz z dostępem do domeny `iskt.pl`), `CONTACT_FROM` z domeny `iskt.pl`
   (`formularz@iskt.pl`, np. `ISKT Greennovation <formularz@iskt.pl>`), `CONTACT_TO=biuro@iskt.pl`.
   Zgłoszenia ze stagingu trafiają więc do skrzynki firmowej; temat zaczyna się od `[iskt.pl]`, a
   `Reply-To` to e-mail klienta z formularza. Nadawcą nie może być adres klienta (Resend wysyła tylko z
   domen zweryfikowanych, a DMARC domeny klienta odrzuciłby taki e-mail). Adres testowy
   `onboarding@resend.dev` nie jest już używany: wysyła tylko na adres konta Resend (E-006).
5. **Domena w Resend.** Domena `iskt.pl` jest już zweryfikowana w Resend (stan z 2026-11-06). Sprawdź
   w Resend → Domains status „Verified” i rekordy SPF i DKIM u operatora DNS. Opcjonalnie DMARC
   (`_dmarc.iskt.pl`, zacznij od `p=none`), jeśli jeszcze go nie ma.
6. **Klucz produkcyjny Resend.** Utwórz nowy klucz z uprawnieniem „Sending access” ograniczonym do
   domeny `iskt.pl`. Wpisz go tylko w panel Vercel (Production), nigdzie indziej.
7. **Zmienne Production w Vercel:**
   - `PUBLIC_SITE_ENV=production`: zdejmuje `noindex` (meta i `X-Robots-Tag`), `robots.txt` pozwala
     indeksować i wskazuje sitemap;
   - `PUBLIC_SITE_URL=https://iskt.pl`: canonical, `og:url`, sitemap i kontrola `Origin` formularza;
   - `RESEND_API_KEY` (klucz produkcyjny, typ Sensitive);
   - `CONTACT_TO=biuro@iskt.pl` (skrzynka firmowa, jak na stagingu);
   - `CONTACT_FROM` z domeny zweryfikowanej, np. `ISKT Greennovation <formularz@iskt.pl>`.
8. **Domena iskt.pl w Vercel.** Settings → Domains → Add `iskt.pl` (Production) i `www.iskt.pl` z
   przekierowaniem 308 na `iskt.pl`. Rekordy DNS według panelu Vercel (A dla apex, CNAME dla `www`).
   Przekierowanie `www` jest konieczne: formularz otwarty pod innym adresem niż `PUBLIC_SITE_URL`
   dostaje 403 (kontrola `Origin`).
9. **Wdrożenie.** Na urządzeniu właściciela: `git switch --detach vX.Y.Z`, potem
   `scripts/deploy-prod.sh vX.Y.Z --dry-run`, a po sprawdzeniu `scripts/deploy-prod.sh vX.Y.Z`. Skrypt
   sprawdza tag i zielone CI, promuje gotowe wdrożenie preview tego commita (Vercel buduje je ponownie
   ze zmiennymi Production) i robi smoke test `https://$PROD_DOMAIN/`. Przeczytaj najpierw „Znane
   ograniczenia”: skrypt wymaga dziś zmiennych bazy, której projekt nie ma.
10. **Sprawdzenie po wdrożeniu:**
    - `curl -sI https://iskt.pl/`: brak `x-robots-tag`, jest `content-security-policy`;
    - `curl https://iskt.pl/robots.txt`: `Allow: /` i linia `Sitemap: https://iskt.pl/sitemap.xml`;
    - `curl https://iskt.pl/sitemap.xml`: 7 adresów `https://iskt.pl/...`;
    - źródło strony: `<link rel="canonical" href="https://iskt.pl/">`, brak `meta robots noindex`;
    - formularz na `https://iskt.pl/#kontakt`: „Dziękujemy!”, e-mail w skrzynce `CONTACT_TO` z
      `Reply-To` nadawcy;
    - 6 wysyłek w 10 minut: 6. daje komunikat o zbyt wielu zgłoszeniach (429);
    - Google Search Console: dodaj usługę `iskt.pl` i zgłoś `https://iskt.pl/sitemap.xml`.

## Baza danych i migracje

Projekt nie ma bazy danych (ADR-002): bez Supabase, Dockera, `supabase/migrations/` i
`STAGING_DB_URL`. Workflow `staging.yml` nie dotyczy projektu. Przyszła baza (np. CMS) wymaga nowego
ADR i migracji zgodnych wstecz (expand/contract).

## Lista migracji

| Migracja | Co zmienia | Zgodna wstecz | Faza (expand/contract) |
|---|---|---|---|
| brak | Projekt bez bazy danych (ADR-002) | nie dotyczy | nie dotyczy |

## Plan rollbacku

- **Wersja aplikacji do cofnięcia:** poprzednie wdrożenie produkcyjne w Vercel.
  - Panel: Vercel → `iskt-www` → Deployments → poprzednie wdrożenie Production → menu „…” → Instant
    Rollback. Na planie Hobby rollback jest możliwy do poprzedniego wdrożenia produkcyjnego.
  - CLI (urządzenie właściciela): `vercel rollback <adres-poprzedniego-wdrożenia> --yes`;
    `deploy-prod.sh` robi to sam, gdy smoke test po wdrożeniu nie przejdzie.
  - Po rollbacku Vercel nie promuje automatycznie kolejnych buildów `production`; następne wydanie
    idzie znów przez `deploy-prod.sh`, a w razie potrzeby przez „Undo Rollback” w panelu.
- **Baza:** nie dotyczy (brak bazy, brak migracji, brak backupu).
- **Zmienne i domena:** zmiana zmiennych wymaga redeploy; przy błędnej konfiguracji prod (np. 502 z
  formularza) najpierw popraw zmienną i zrób Redeploy bieżącego wdrożenia, rollback kodu nie pomoże.
  Awaryjne wyłączenie indeksowania: `PUBLIC_SITE_ENV=staging` i redeploy.
- **Rate limit:** reguła WAF działa niezależnie od wersji aplikacji; wyłączenie tylko w panelu Firewall.
- **Kiedy cofamy i kto decyduje:** decyduje właściciel. Cofamy, gdy po wdrożeniu nie działa strona
  główna lub dowolna strona W-01 (5xx/404), znika CSP, strony prod mają `noindex`, albo formularz z
  poprawnymi danymi zwraca błąd, a przyczyną jest kod, nie konfiguracja.

## Monitoring

- **Vercel → Logs (Functions):** zdarzenia endpointu, tylko `event`, `status`, `code`, `requestId`:
  `contact_sent` (200), `contact_honeypot` (200, bez wysyłki), `contact_invalid` (400),
  `contact_rejected` (403 `origin`, 405, 413, 415, 429), `contact_failed` (502, `provider_error` albo
  `timeout`), `contact_config_error` (500, błędna konfiguracja zmiennych), `rate_limit_error`.
  Seria `contact_failed` albo `contact_config_error` wymaga reakcji.
- **Vercel → Firewall:** liczba żądań zablokowanych regułą rate limit.
- **Vercel → Deployments:** stan buildów `main` (staging) i produkcji.
- **Resend → Emails / Logs:** status dostarczenia, odbicia; retencję logów ustaw na najkrótszą
  dostępną (ADR-001).
- **Lighthouse:** `pnpm lh:staging <adres>` (z `LH_ENV=production` dla iskt.pl); próg ≥ 90 w 4
  kategoriach.
- Brak Sentry i analityki (poza zakresem v1).

## Przekazanie do eksploatacji

Po odbiorze właściciel (ISKT) przejmuje: konto i projekt Vercel (domena, zmienne, Firewall), konto
Resend (domena, klucze, retencja logów), skrzynkę `CONTACT_TO` i umowy powierzenia (DPA) Vercel i
Resend. Zmiany treści i kodu idą przez repo `Sebastian-Temich/iskt-www` (PR, CI zielone, merge do
`main`, sprawdzenie na stagingu, wydanie przez `deploy-prod.sh`). Rotacja klucza Resend: nowy klucz w
Resend, podmiana w Vercel, Redeploy, usunięcie starego klucza.

## Znane ograniczenia

- `scripts/deploy-prod.sh` pochodzi z szablonu dla projektów z Supabase: wymaga narzędzi `supabase` i
  `docker` oraz zmiennej `PROD_DB_URL`, robi `supabase db dump` i `supabase db push`. Projekt nie ma
  bazy, więc bez zmiany skryptu (opcja „bez bazy”) wdrożenie przez skrypt się nie powiedzie. Do czasu
  zmiany właściciel wdraża równoważnie ręcznie: sprawdza tag i CI jak skrypt, potem
  `vercel promote <wdrożenie-preview-commita> --yes` i smoke test; rollback jak w „Plan rollbacku”.
- `deploy-prod.sh` szuka wdrożenia typu Preview dla commita taga, więc działa dopiero po kroku 2 B9a
  (w pilocie `main` buduje się jako Production).
- Wysyłka e-maila na stagingu (O-3, E-006) działa od 2026-11-06: nadawca z domeny `iskt.pl`
  (`formularz@iskt.pl`), odbiorca `biuro@iskt.pl`. Testy formularza na stagingu wysyłają więc
  prawdziwe e-maile do skrzynki firmowej; testy automatyczne i lokalne używają `MAIL_TRANSPORT=mock`.
- Podgląd w zewnętrznym walidatorze OG (O-6, O-10) nie był sprawdzony automatycznie (E-003); robi go
  właściciel przy odbiorze.
- Preview PR są za Deployment Protection Vercel; Lighthouse i testy na Vercel robimy na stagingu po
  merge'u (E-008).
- Strona B+R w designie nie ma chipu „Interim” w „Pozostałe kompetencje” (4 linki zamiast 5); zgodnie z
  designem.
