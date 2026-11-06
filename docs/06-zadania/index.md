# Zadania

Plik wspólny. Tabelę generuje `scripts/sync-status.sh`, nie edytuj jej ręcznie.

<!-- sync-status:start -->
| Zadanie | Tytuł | Status | Iteracja | Kamień milowy | PR | CI |
|---|---|---|---|---|---|---|
| #5 | Szkielet projektu Astro, CI, tokeny i czcionki | done | 1 | M1 Szkielet, layout i strona główna | #17 merged | pass |
| #6 | Layout strony i prymitywy UI, strona 404 | done | 2 | M1 Szkielet, layout i strona główna | #18 merged | pass |
| #7 | SEO techniczne - meta, Open Graph, sitemap, robots, favicony | done | 1 | M1 Szkielet, layout i strona główna | #20 merged | pass |
| #8 | Strona główna - hero, kompetencje, sekcja kontaktu | done | 2 | M1 Szkielet, layout i strona główna | #19 merged | pass |
| #9 | Strona polityki prywatności z roboczą treścią | done | 1 | M2 Formularz kontaktowy end-to-end | #25 merged | pass |
| #10 | Komponenty stron usług i strona ESG | done | 1 | M3 Strony usług | #31 merged | pass |
| #11 | Formularz kontaktowy end-to-end - walidacja, endpoint, Resend, rate limit | done | 1 | M2 Formularz kontaktowy end-to-end | #26 merged | pass |
| #12 | Strony AI-transformacja i Oprogramowanie | done | 1 | M3 Strony usług | #33 merged | pass |
| #13 | Strony Interim i Startupy | done | 1 | M3 Strony usług | #32 merged | pass |
| #14 | Strona Projekty B+R z FAQ | done | 1 | M3 Strony usług | #34 merged | pass |
| #15 | Jakość przekrojowa - E2E wszystkich stron i Lighthouse na stagingu | done | 3 | M4 Jakość i wydanie | #36 merged | pass |
| #16 | Dokumentacja wydania (techniczna i produktowa) | done | 1 | M4 Jakość i wydanie | #37 merged | pass |
| #22 | QA M1: Lighthouse mobile - wydajność strony głównej 87-89 (< 90) | done | 2 | M1 Szkielet, layout i strona główna | #27 merged | pass |
| #23 | QA M1: brak nagłówka Content-Security-Policy z architektury | done | 2 | M1 Szkielet, layout i strona główna | #24 merged | pass |
| #29 | QA M2: zdublowany klucz build w astro.config.mjs po #22 i #23 - lint, typecheck i E2E czerwone na main | done | 1 | M2 Formularz kontaktowy end-to-end | #30 merged | pass |
| #41 | Odbiór: nagłówek strony głównej niezgodny z designem (belka i link Kompetencje) | done | 2 | M4 Jakość i wydanie | #42 merged | pass |
| #43 | Mobile i zgodność z designem: logo w hero, przyciski, formularz, drobne różnice stron usług | done | 1 | - | #47 merged | pass |
| #44 | SEO strony głównej i dokumentacja wydania po odbiorze | done | 2 | - | #46 merged | pass |
| #45 | Higiena kodu i testów: visually-hidden, nazwy testów, port Playwright | todo | 0 | - | - | - |
<!-- sync-status:end -->

## Mapa zadań z planu

Sekcję uzupełnia `shctl task create`: ID z pliku YAML i numer issue.

<!-- shctl:mapa:start -->
| ID | Issue | Tytuł | Zależności |
|---|---|---|---|
| T1 | #5 | Szkielet projektu Astro, CI, tokeny i czcionki | - |
| T2 | #6 | Layout strony i prymitywy UI, strona 404 | #5 |
| T3 | #7 | SEO techniczne - meta, Open Graph, sitemap, robots, favicony | #6 |
| T4 | #8 | Strona główna - hero, kompetencje, sekcja kontaktu | #6 |
| T5 | #9 | Strona polityki prywatności z roboczą treścią | #6, #7 |
| T7 | #10 | Komponenty stron usług i strona ESG | #8 |
| T6 | #11 | Formularz kontaktowy end-to-end - walidacja, endpoint, Resend, rate limit | #8, #9 |
| T8 | #12 | Strony AI-transformacja i Oprogramowanie | #10 |
| T9 | #13 | Strony Interim i Startupy | #10 |
| T10 | #14 | Strona Projekty B+R z FAQ | #10 |
| T11 | #15 | Jakość przekrojowa - E2E wszystkich stron i Lighthouse na stagingu | #11, #12, #13, #14 |
| T12 | #16 | Dokumentacja wydania (techniczna i produktowa) | #5, #6, #7, #8, #9, #11, #10, #12, #13, #14, #15 |
| QA-M1-1 | #22 | QA M1: Lighthouse mobile - wydajność strony głównej 87-89 (< 90) | - |
| QA-M1-2 | #23 | QA M1: brak nagłówka Content-Security-Policy z architektury | - |
| QA-M2-1 | #29 | QA M2: zdublowany klucz build w astro.config.mjs po #22 i #23 - lint, typecheck i E2E czerwone na main | - |
| ODB-1 | #41 | Odbiór: nagłówek strony głównej niezgodny z designem (belka i link Kompetencje) | - |
| S-20261106-mobile-design | #43 | Mobile i zgodność z designem: logo w hero, przyciski, formularz, drobne różnice stron usług | - |
| S-20261106-seo-docs | #44 | SEO strony głównej i dokumentacja wydania po odbiorze | - |
| S-20261106-higiena-testow | #45 | Higiena kodu i testów: visually-hidden, nazwy testów, port Playwright | #43 |
<!-- shctl:mapa:end -->
