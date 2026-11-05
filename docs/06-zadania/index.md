# Zadania

Plik wspólny. Tabelę generuje `scripts/sync-status.sh`, nie edytuj jej ręcznie.

<!-- sync-status:start -->
| Zadanie | Tytuł | Status | Iteracja | Kamień milowy | PR | CI |
|---|---|---|---|---|---|---|
| #5 | Szkielet projektu Astro, CI, tokeny i czcionki | done | 1 | M1 Szkielet, layout i strona główna | #17 merged | pass |
| #6 | Layout strony i prymitywy UI, strona 404 | done | 2 | M1 Szkielet, layout i strona główna | #18 merged | pass |
| #7 | SEO techniczne - meta, Open Graph, sitemap, robots, favicony | done | 1 | M1 Szkielet, layout i strona główna | #20 merged | pass |
| #8 | Strona główna - hero, kompetencje, sekcja kontaktu | done | 2 | M1 Szkielet, layout i strona główna | #19 merged | pass |
| #9 | Strona polityki prywatności z roboczą treścią | todo | 0 | M2 Formularz kontaktowy end-to-end | - | - |
| #10 | Komponenty stron usług i strona ESG | todo | 0 | M3 Strony usług | - | - |
| #11 | Formularz kontaktowy end-to-end - walidacja, endpoint, Resend, rate limit | todo | 0 | M2 Formularz kontaktowy end-to-end | - | - |
| #12 | Strony AI-transformacja i Oprogramowanie | todo | 0 | M3 Strony usług | - | - |
| #13 | Strony Interim i Startupy | todo | 0 | M3 Strony usług | - | - |
| #14 | Strona Projekty B+R z FAQ | todo | 0 | M3 Strony usług | - | - |
| #15 | Jakość przekrojowa - E2E wszystkich stron i Lighthouse na stagingu | todo | 0 | M4 Jakość i wydanie | - | - |
| #16 | Dokumentacja wydania (techniczna i produktowa) | todo | 0 | M4 Jakość i wydanie | - | - |
| #22 | QA M1: Lighthouse mobile - wydajność strony głównej 87-89 (< 90) | todo | 0 | M1 Szkielet, layout i strona główna | - | - |
| #23 | QA M1: brak nagłówka Content-Security-Policy z architektury | todo | 0 | M1 Szkielet, layout i strona główna | - | - |
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
<!-- shctl:mapa:end -->
