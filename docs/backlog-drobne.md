# Backlog drobnych uwag

Plik wspólny, aktualizuje orkiestrator. Zgłoszenia ⚪ z review i „Drobne uwagi” z raportów.

| Data | Źródło | Uwaga | Stan |
|---|---|---|---|
| 2026-11-05 | T-5 | `.github/workflows/staging.yml` i `STAGING_DB_URL` nie dotyczą projektu bez bazy (architektura) — nieruszane. | otwarta |
| 2026-11-05 | T-5 | WebKit Playwright 1.61.1 na macOS 14 jest „frozen” (komunikat przy instalacji) — zgodne z opisem `playwright_version` w `konfiguracja.md`. | otwarta |
| 2026-11-05 | T-6 | `src/pages/index.astro` nadal ma tymczasową treść ze szkieletu; zastąpi ją T4. | otwarta |
| 2026-11-05 | T-6 | Logo jest w WebP (1x/2x) bez AVIF: `<Picture>` dla 34-40 px nie daje zauważalnej różnicy; duże logo w hero home (T4) może użyć `<Picture formats={['avif','webp']}>`. | otwarta |
| 2026-11-05 | review PR #18 | Nazwa testu deklaruje sprawdzenie przekierowania HTTP, ale asercja sprawdza wyłącznie trailingSlash w vercel.json; nazwij test zgodnie z jego zakresem, np. „Vercel ma włączony końcowy ukośnik”. To uwaga do nazewnictwa, nie błąd konfiguracji. (`e2e/layout.spec.ts:137`) | otwarta |
| 2026-11-05 | T-7 | `src/pages/index.astro` przekazuje tymczasowe `title`/`description`, które są teraz ignorowane; T4 może je usunąć. | otwarta |
| 2026-11-05 | T-7 | Logo `iskt-logo-transparent.png` ma jasną, niezupełnie przezroczystą otoczkę, widoczną lekko na obrazie OG; lepsze byłoby logo w SVG. | otwarta |
| 2026-11-05 | T-7 | `@astrojs/sitemap` zostawia też `sitemap-index.xml` i `sitemap-0.xml`; nie przeszkadzają, robots wskazuje `sitemap.xml`. | otwarta |
| 2026-11-05 | T-8 | `.visually-hidden` jest zdefiniowane lokalnie w `ServiceTile.astro`; przyda się globalna klasa w `src/styles/global.css` (np. dla T6 i stron usług). | otwarta |
| 2026-11-05 | T-8 | Animowany kafel (`translateY` na hover) i duże logo z `filter: drop-shadow` — warto sprawdzić wpływ na Lighthouse w zadaniu W-08. | otwarta |
| 2026-11-05 | QA M1 | Test `e2e/layout.spec.ts:137` nazywa się „przekierowanie HTTP”, a sprawdza tylko `trailingSlash` w `vercel.json`; zmienić nazwę testu. | otwarta |
| 2026-11-05 | T-9 | Lokalnie `playwright.config.ts` z `reuseExistingServer: !CI` używa serwera z innego worktree na porcie 55327 (strona dawała 404 ze starego buildu); lokalnie testy uruchamiałem z `CI=1`. | otwarta |
| 2026-11-05 | T-9 | `seo.ts` ma ścieżkę polityki jako literał, a `SiteFooter` drugi raz; warto mieć jedno źródło (np. `nav.privacy` w `site.ts`). | otwarta |
| 2026-11-05 | T-11 | Zod (klasyczne API) trafia do JS przeglądarki z walidacją formularza; przy Lighthouse (T11) warto sprawdzić rozmiar paczki i ewentualnie przejść na `zod/mini`. | otwarta |
| 2026-11-05 | T-11 | `e2e/home.spec.ts` (M1) zakłada formularz „bez wysyłki”; po T6 test l. 143 wysyła prawdziwe żądanie do mocka. Działa, ale nazwy i komentarze tego testu są nieaktualne. | otwarta |
| 2026-11-05 | T-11 | Vercel ostrzega, że lokalny Node 26 nie jest wspierany w funkcjach (runtime 22); do rozważenia `engines`/ustawienie wersji Node projektu Vercel. | otwarta |
| 2026-11-05 | T-11 | `astro.config.mjs` ma teraz dwa warianty adaptera; po pojawieniu się `previewEntrypoint` w `@astrojs/vercel` można wrócić do jednego. | otwarta |
| 2026-11-05 | review PR #26 | Raport nadal opisuje .env.example jako nieuzupełnione, również w sekcji Ryzyka, choć commit 59bd6ee dodaje wskazane zmienne. Zaktualizuj oba miejsca, oznaczając brak jako rozwiązany. (`docs/07-realizacja/T-11.md:49`) | otwarta |
