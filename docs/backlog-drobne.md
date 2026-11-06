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
| 2026-11-05 | T-23 | `playwright.config.ts` ma `reuseExistingServer: !process.env.CI` na wspólnym porcie 55327. Gdy w innym worktree działa preview, lokalny `pnpm test:e2e` może trafić na cudzy serwer albo na serwer, który właśnie się wyłącza. Raz dało to 61 przypadkowych porażek, a powtórka była zielona. | otwarta |
| 2026-11-05 | T-23 | Bundle klienta zawiera kod JIT zoda (`new Function`) jako martwą ścieżkę przy `jitless: true`. Można by użyć lżejszego `zod/mini` w przeglądarce, ale to poza zakresem. | otwarta |
| 2026-11-05 | T-22 | Logo w nagłówku (`SiteHeader`, 50 px) ładuje 2x WebP 10 KB z `fetchpriority=auto`; poza zakresem, wpływ znikomy. | otwarta |
| 2026-11-05 | T-22 | Lighthouse lokalnie jest bimodalny przy dużym CSS-owym fontowaniu: gdy zaobserwowany FCP wypada przed startem fontów, wynik skacze do 100; warto mierzyć min. 3 przebiegi (tak jak w issue). | otwarta |
| 2026-11-05 | T-22 | Iteracja 2: e2e uruchamiane z `CI=1`. Bez tego `reuseExistingServer` łączył się z serwerem innego worktree na porcie 55327 i padały nawet niezmienione testy (to samo zauważono w T-9). | otwarta |
| 2026-11-05 | QA M2 | POST na `/api/contact` bez ukośnika dostaje 308 na `/api/contact/` (trailingSlash). Formularz używa `/api/contact/`, bez wpływu na W-04; reguła WAF liczy oba warianty. | otwarta |
| 2026-11-05 | T-29 | CI na push do `main` uruchamia tylko `check-dod`, więc konflikt dwóch PR-ów zielonych osobno (jak #24 i #27) nie jest wykrywany po merge'u. Warto uruchamiać lint i typecheck także na `main` albo wymagać aktualnej gałęzi przed merge'em. | otwarta |
| 2026-11-05 | T-10 | W `global.css` brakuje wspólnej klasy `visually-hidden`. Ten sam blok CSS powtarza się w `ServiceTile`, `OtherServices` i `ComparisonTable` i warto go przenieść do `global.css`. | otwarta |
| 2026-11-05 | T-10 | „Zobacz też” w hero ma zakodowaną strzałkę „→” w tekście linku (jak w designie). Czytnik ekranu ją odczyta. Można ją przenieść do `aria-hidden`. | otwarta |
| 2026-11-05 | review PR #31 | Opis kryterium 4 nadal podaje czerwony lint i typecheck, choć sekcja „Testy” potwierdza zielone wyniki po rebase. Zaktualizuj ten akapit i usuń nieaktualne odesłanie do „Ryzyk”. (`docs/07-realizacja/T-10.md:30`) | otwarta |
| 2026-11-05 | T-13 | `src/pages/uslugi/esg.astro:56-59` (T7/#10): ten sam wzorzec `</strong>` w osobnej linii daje w HTML spację przed kropką („klimatyczne . Wtedy liczy się…”). Do poprawki osobnym zadaniem. | otwarta |
| 2026-11-05 | T-13 | `ServiceHero` ma stałe `max-width: 680px` leadu; w `D/Interim.dc.html:70` lead ma 700 px. Różnica 20 px, komponentu T7 nie zmieniałem. | otwarta |
| 2026-11-05 | T-13 | `ComparisonTable` mógłby mieć opcjonalny slot na notkę pod tabelą (Interim), wtedy blok `model-note` w `interim.astro` byłby zbędny. | otwarta |
| 2026-11-05 | T-12 | Tło sekcji różni się od designu, bo komponenty z T7 mają stałe tła: na Oprogramowaniu `ProcessTimeline` ma `--surface-subtle` (w designie `--surface-page`, bo poprzedza ją szara tabela), a `ComparisonTable` ma `--surface-page` (w designie `--surface-subtle`). Zmiana wymaga propsu `tone` w komponentach T7, które w tym zadaniu są poza zakresem. | otwarta |
| 2026-11-05 | T-12 | `ServiceHero` na Oprogramowaniu nie dostaje `note`, bo design go nie ma w hero tej strony. | otwarta |
| 2026-11-05 | T-12 | `playwright.config.ts` ma stały port i `reuseExistingServer`; przy równoległych workerach na jednej maszynie testy mogą trafić w cudzy serwer. Warto czytać port ze zmiennej środowiskowej. | otwarta |
| 2026-11-06 | T-14 | `e2e/esg.spec.ts`, `e2e/interim.spec.ts` i `e2e/startupy.spec.ts` w teście „linki wewnętrzne bez 404” mają stałą listę zbudowanych stron bez `/uslugi/projekty-br/`, więc nie sprawdzają tego linku. Można dopisać adres, ale to poza zakresem T-14. | otwarta |
| 2026-11-06 | QA M3 | „Pozostałe kompetencje” na B+R (`ServiceChips`) bez chipu Interim, zgodnie z designem (`Projekty-BR.dc.html:246-250`); pozostałe strony usług linkują do wszystkich usług. Właściciel 2026-11-06: zostaje jak w designie (`decyzje.md`). | zamknięta |
| 2026-11-06 | T-15 | `e2e/qa/M3-scenariusze.spec.ts` używa przestarzałego `page.waitForNavigation()` (podpowiedź `astro check`); poza zakresem. | otwarta |
| 2026-11-06 | T-15 | Komunikaty pól formularza (`Field`, `span.field__message`, 12 px) nie są objęte selektorem kryterium (`span`), więc zostały bez zmian; warto rozważyć 14–16 px. | otwarta |
| 2026-11-06 | T-15 | Nagłówek `role__benefits-heading` i opis `other-services__description` (14 px) to elementy spoza listy selektorów kryterium; bez zmian. | otwarta |
| 2026-11-06 | T-16 | Strona B+R ma w „Pozostałe kompetencje” 4 linki (brak chipu Interim, jak w designie); opisane w obu dokumentach. | otwarta |
| 2026-11-06 | Odbiór O-6 | opengraph.xyz (strona główna): `<title>`/`og:title` 66 znaków (zalecane ≤ 60, X i LinkedIn mogą uciąć), `og:description` 154 znaki (podglądy pokazują ~125), obraz OG bez wezwania do działania. Kryteria W-07 spełnione; do rozważenia skrócenie treści w `src/content/seo.ts` przed produkcją. | otwarta |
| 2026-11-06 | Odbiór (orkiestrator) | `docs/wydanie/techniczna/dokumentacja-techniczna.md` krok B9a.4: staging ma już docelową wysyłkę (`CONTACT_FROM` z iskt.pl, `CONTACT_TO=biuro@iskt.pl`, decyzja właściciela 2026-11-06), a nie testowego nadawcę `onboarding@resend.dev`; do aktualizacji opisu. | otwarta |
| 2026-11-06 | T-41 | Przyciski hero „Umów rozmowę” i „Zobacz kompetencje” mają poniżej 480 px pełną szerokość, a we wzorcu zachowują szerokość treści (widać na zrzucie 375 px). To wcześniejsza decyzja spoza zakresu tego zadania. | otwarta |
| 2026-11-06 | review PR #47 | `SiteHeader.astro:110`: mobilne `font-size: var(--text-base)` nazwy marki nadpisuje reguła bazowa `--text-lg` (l. 159); zmniejszenie nie działa, układ OK. Przenieść regułę mobilną za bazową. | otwarta |
| 2026-11-06 | T-43 | D/Oprogramowanie.dc.html:217-233 ma opisy etapów przebiegu w `--text-sm`, a `ProcessTimeline` używa `--text-base` (16 px, W-03). Poza zakresem #43, nie zmieniane. | otwarta |
| 2026-11-06 | review PR #47 | Mobilne font-size: var(--text-base) jest nadpisywane przez identyczny selektor z font-size: var(--text-lg) w linii 159, więc deklarowane w raporcie zmniejszenie nazwy marki nie działa. Przenieś regułę mobilną za regułę bazową. Waga drobna: różnica typograficzna bez wykazanego naruszenia układu. (`src/components/layout/SiteHeader.astro:110`) | otwarta |
| 2026-11-06 | T-44 | `src/pages/index.astro` przekazuje do `BaseLayout` stare `title` i `description` (178 znaków). To martwa wartość zapasowa, bo `Seo.astro` bierze najpierw wpis z `seo.ts`, ale wprowadza w błąd przy edycji treści. Warto usunąć te propsy. | otwarta |
| 2026-11-06 | T-44 | `@types/node` jest w wersji `^24`, a runtime to 22. Typy mogą dopuścić API z Node 24. Można przejść na `^22`. | otwarta |
