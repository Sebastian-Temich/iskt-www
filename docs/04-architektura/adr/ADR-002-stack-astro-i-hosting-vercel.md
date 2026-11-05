---
projekt: iskt-www
etap: 04-architektura
data: "2026-11-05"
rola: architekt
---

# ADR-002: Stack Astro i hosting Vercel

Status: proponowana
Data: 2026-11-05

Wymagania: W-01–W-03, W-07–W-12. Decyzja właściciela z 2026-11-05: Astro 5, Vercel, bez bazy.

## Kontekst

Strona firmowa: 7 stron treściowych, jeden formularz, wymagany Lighthouse ≥ 90 na mobile i desktop
(W-10), SEO (W-07, W-08). Design dostarczono jako statyczny HTML/CSS z design systemem w CSS
(`docs/02-design/zrodla/Strona firmowa ISKT/`). Kontrakt stały przewiduje Supabase; ten projekt nie
przechowuje danych (ADR-001), więc baza nie jest potrzebna — to odstępstwo od kontraktu stałego
(„Baza lokalnie”) uzasadnia ten ADR.

## Decyzja

- **Astro 5 + TypeScript (strict)**, `output: 'static'` (SSG); jedyna trasa renderowana na żądanie to
  `src/pages/api/contact.ts` (`export const prerender = false`) przez adapter `@astrojs/vercel`
  (funkcje w regionie `fra1`).
- **Brak frameworka UI** (React/Vue): komponenty `.astro` bez JS w przeglądarce; interakcje (menu
  mobilne, formularz, ewentualne akordeony z designu) jako małe skrypty `<script>` w komponentach
  (bundlowane przez Astro), z progresywnym ulepszaniem.
- **Style:** czysty CSS z tokenami jako custom properties przeniesionymi z design systemu designu
  (`src/styles/tokens/*.css` + `global.css`); style komponentów w scoped `<style>` Astro. Bez
  Tailwinda — design ma własny system tokenów, przeniesienie 1:1 jest prostsze i lżejsze.
- **Obrazy:** `astro:assets` (`<Image>`/`<Picture>`, AVIF/WebP, wymiary, `loading="lazy"` poniżej
  pierwszego ekranu). **Czcionki:** pliki lokalne (`@fontsource*` albo pliki w `public/fonts`), preload
  czcionki nagłówków, `font-display: swap`.
- **SEO:** komponent `<Seo>` w layoucie (title, description, canonical, OG, Twitter), `@astrojs/sitemap`
  z filtrem (bez 404 i API), `robots.txt` generowany (`src/pages/robots.txt.ts`) zależnie od
  `PUBLIC_SITE_ENV` (`staging`: bez `Disallow`; nagłówek `X-Robots-Tag: noindex` przez `vercel.json`
  /middleware dla stagingu; `production`: indeksowanie + sitemap).
- **Hosting:** Vercel, konto klienta; gałąź produkcyjna `production`, `main` → wdrożenie pod stałym
  aliasem staging. Bez Supabase: brak `supabase/`, workflow `staging.yml` (migracje) pozostaje bez
  efektu (brak `STAGING_DB_URL`), zadania właściciela dotyczące Supabase oznaczone „nie dotyczy”.
- **Narzędzia:** pnpm, Node LTS (fnm), ESLint (`eslint-plugin-astro`, `typescript-eslint`) + Prettier
  (`prettier-plugin-astro`), `astro check`, Vitest, Playwright w wersji z `konfiguracja.md`
  (chromium + webkit) z `@axe-core/playwright`, Lighthouse CI (`@lhci/cli`) uruchamiany przeciw
  stagingowi.

## Rozważane opcje

| Opcja | Ocena |
|---|---|
| Astro 5 SSG + endpoint (wybrana) | Zero JS domyślnie, najłatwiej Lighthouse ≥ 90; wbudowane obrazy i sitemap; endpoint bez osobnego backendu |
| Next.js 15 (App Router) | Większy bundle JS, więcej konfiguracji dla strony treściowej; lepsza przy przyszłym panelu/CMS |
| Statyczny HTML z designu + funkcja Vercel | Najmniej narzędzi, ale brak komponentów, duplikacja layoutu na 7 stronach, ręczne SEO/obrazy |

## Konsekwencje

- Odstępstwo od kontraktu stałego: brak Supabase i Dockera w projekcie (wiersz „Baza lokalnie” nie
  dotyczy). Przyszły CMS/blog = nowy ADR.
- Komponenty i strony muszą być podpięte do routingu (`src/pages/`) lub layoutu
  (`src/layouts/BaseLayout.astro`); komponent nieużyty przez żadną stronę jest błędem review.
- Dowody: CI (lint, `astro check`, Vitest, build, Playwright, gitleaks) zielone; Lighthouse ≥ 90 na
  stagingu w raporcie QA.
