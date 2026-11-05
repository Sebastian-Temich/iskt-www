# Backlog drobnych uwag

Plik wspólny, aktualizuje orkiestrator. Zgłoszenia ⚪ z review i „Drobne uwagi” z raportów.

| Data | Źródło | Uwaga | Stan |
|---|---|---|---|
| 2026-11-05 | T-5 | `.github/workflows/staging.yml` i `STAGING_DB_URL` nie dotyczą projektu bez bazy (architektura) — nieruszane. | otwarta |
| 2026-11-05 | T-5 | WebKit Playwright 1.61.1 na macOS 14 jest „frozen” (komunikat przy instalacji) — zgodne z opisem `playwright_version` w `konfiguracja.md`. | otwarta |
| 2026-11-05 | T-6 | `src/pages/index.astro` nadal ma tymczasową treść ze szkieletu; zastąpi ją T4. | otwarta |
| 2026-11-05 | T-6 | Logo jest w WebP (1x/2x) bez AVIF: `<Picture>` dla 34-40 px nie daje zauważalnej różnicy; duże logo w hero home (T4) może użyć `<Picture formats={['avif','webp']}>`. | otwarta |
| 2026-11-05 | review PR #18 | Nazwa testu deklaruje sprawdzenie przekierowania HTTP, ale asercja sprawdza wyłącznie trailingSlash w vercel.json; nazwij test zgodnie z jego zakresem, np. „Vercel ma włączony końcowy ukośnik”. To uwaga do nazewnictwa, nie błąd konfiguracji. (`e2e/layout.spec.ts:137`) | otwarta |
