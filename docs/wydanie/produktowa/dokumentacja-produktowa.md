---
projekt: iskt-www
etap: wydanie
data: "2026-11-06"
rola: worker
zadanie: 16
---

# Dokumentacja produktowa: iskt-www

## Czym jest produkt

Nowa strona firmowa ISKT Greennovation Sp. z o.o. („Innowacje w harmonii z naturą”), zbudowana według
designu z Claude Design. Przedstawia kompetencje firmy, ma osobną stronę dla każdej usługi i formularz
kontaktowy, z którego zapytania przychodzą e-mailem. Strona nie ma kont użytkowników, bazy danych,
analityki ani plików cookies.

Pilot działa na stagingu **https://iskt-www.vercel.app** (strony mają `noindex`, wyszukiwarki ich nie
indeksują). Przeniesienie na iskt.pl (B9a) wykonuje właściciel według dokumentacji technicznej
(`docs/wydanie/techniczna/dokumentacja-techniczna.md`, „Kroki B9a”).

## Dla kogo

- **Potencjalni klienci** szukający wsparcia w B+R, ESG, AI, oprogramowaniu, interim managemencie lub
  rozwoju startupu: poznają ofertę i wysyłają zapytanie.
- **Zespół ISKT:** dostaje zapytania e-mailem i odpowiada bezpośrednio nadawcy.

## Główne funkcje

### Strony

Adresy na stagingu; po B9a te same ścieżki pod `https://iskt.pl`.

| Strona | Adres | W sitemap |
|---|---|---|
| Strona główna (hero, 7 kafli kompetencji, kontakt) | https://iskt-www.vercel.app/ | tak |
| Projekty B+R | https://iskt-www.vercel.app/uslugi/projekty-br/ | tak |
| ESG | https://iskt-www.vercel.app/uslugi/esg/ | tak |
| AI i transformacja cyfrowa | https://iskt-www.vercel.app/uslugi/ai-transformacja/ | tak |
| Rozwój oprogramowania | https://iskt-www.vercel.app/uslugi/oprogramowanie/ | tak |
| Interim | https://iskt-www.vercel.app/uslugi/interim/ | tak |
| Startupy | https://iskt-www.vercel.app/startupy/ | tak |
| Polityka prywatności | https://iskt-www.vercel.app/polityka-prywatnosci/ | nie (link w stopce) |
| Strona 404 | dowolny nieistniejący adres, np. https://iskt-www.vercel.app/nie-ma-takiej-strony | nie |
| Szkolenia (zewnętrzny) | https://szkolenia.iskt.pl (kafel i „Pozostałe kompetencje”) | nie dotyczy |

Na każdej stronie: nagłówek z logo (powrót na stronę główną), „Kompetencje” i „Umów konsultację”
(prowadzi do formularza), stopka z danymi firmy i linkiem do polityki prywatności. Strony usług mają
ścieżkę nawigacji (okruszki z powrotem do kompetencji) i sekcję „Pozostałe kompetencje”. Strona B+R ma
rozwijane FAQ.

### Formularz kontaktowy

Na stronie głównej w sekcji kontaktu (`/#kontakt`). Pola: imię i nazwisko (do 100 znaków), e-mail (do
254), wiadomość (do 5000). Wszystkie wymagane.

| Sytuacja | Co widzi odwiedzający |
|---|---|
| Poprawne dane | „Dziękujemy! Odezwiemy się najszybciej jak to możliwe.” |
| Puste pole albo błędny e-mail | Komunikat przy polu, fokus na pierwszym błędnym polu, nic nie jest wysyłane |
| Błąd wysyłki (np. awaria Resend, brak odpowiedzi w 10 s) | Prośba o ponowienie albo kontakt na biuro@iskt.pl; wpisane dane zostają |
| Więcej niż 5 zgłoszeń z jednego adresu IP w 10 minut | „Zbyt wiele zgłoszeń, spróbuj później.” |
| Wyłączony JavaScript | Zamiast formularza: „Aby wysłać formularz, włącz JavaScript albo napisz do nas: biuro@iskt.pl lub zadzwoń: +48 504 083 825” |

### Co się dzieje z danymi z formularza

1. Przeglądarka wysyła dane szyfrowanym połączeniem (HTTPS) do funkcji na serwerach Vercel w UE
   (Frankfurt).
2. Serwer sprawdza dane jeszcze raz i odrzuca zgłoszenia automatów (ukryte pole-pułapka, limit 5
   zgłoszeń na 10 minut z jednego IP liczony przez zaporę Vercel).
3. Zgłoszenie idzie e-mailem przez Resend na skrzynkę firmową `biuro@iskt.pl` (`CONTACT_TO`). Nadawcą
   jest adres serwisu z domeny iskt.pl (`formularz@iskt.pl`), nie adres klienta: pocztę z cudzej
   domeny odrzuciłyby filtry antyspamowe. E-mail ma temat „[iskt.pl] Zapytanie z formularza: imię”,
   zawiera imię, e-mail i treść, a adres klienta jest w polu `Reply-To`, więc „Odpowiedz” trafia od
   razu do klienta.
4. **Strona niczego nie zapisuje:** brak bazy, plików i historii zgłoszeń. Logi techniczne zawierają
   tylko identyfikator zdarzenia, status i kod błędu, bez imienia, e-maila, treści i adresu IP.
5. Dane zostają tylko w skrzynce odbiorcy i w logach wysyłki Resend (retencję ustawia ISKT). Adres IP
   zapora Vercel trzyma tylko na czas okna limitu (ok. 10 minut).

Szczegóły prawne: polityka prywatności (`/polityka-prywatnosci/`). Decyzje: ADR-001, ADR-003, ADR-004.

## Jak korzystać

### Scenariusze odbioru

Scenariusze z planu (`docs/04-plan/plan.md`, „Scenariusze odbioru”), do przejścia na stagingu
https://iskt-www.vercel.app. Kolumna „Uwagi” mówi, co zostało do sprawdzenia przez właściciela.

| Nr | Scenariusz | Kroki | Oczekiwany wynik | Uwagi |
|---|---|---|---|---|
| O-1 | Strona główna jak w designie | Otwórz staging na komputerze i telefonie | Hero, 7 kafli kompetencji, sekcja kontaktu i stopka jak w `ISKT-standalone`; na telefonie kafle w jednej kolumnie, bez przewijania w bok | sprawdzone w QA M1 |
| O-2 | Przejście po wszystkich usługach | Z kafli strony głównej otwórz każdą z 6 usług, na każdej użyj „Pozostałe kompetencje” i logo | Każda strona zgodna ze swoim plikiem designu, ścieżka, powrót na `/`, żadnego 404 | sprawdzone w QA M3; na B+R 4 linki w „Pozostałe kompetencje”, jak w designie |
| O-3 | Wysłanie zapytania | Na `/#kontakt` wypełnij imię, e-mail, wiadomość i wyślij | „Dziękujemy!”, e-mail w skrzynce `biuro@iskt.pl` od `formularz@iskt.pl`, z danymi i `Reply-To` klienta | sprawdzone przez właściciela 2026-11-06 (E-006 zamknięta: nadawca z domeny iskt.pl, odbiorca `biuro@iskt.pl`) |
| O-4 | Błędy formularza i brak JavaScriptu | Wyślij pusty formularz, potem z błędnym e-mailem; wyłącz JavaScript i otwórz `/#kontakt` | Komunikaty przy polach, fokus na pierwszym błędzie, nic nie wysłane; bez JS komunikat z biuro@iskt.pl (`mailto:`) i telefonem | sprawdzone w QA M2 |
| O-5 | Ochrona przed spamem | Wyślij formularz 6 razy w ciągu 10 minut | 6. próba: „Zbyt wiele zgłoszeń, spróbuj później.” (429) | sprawdzone w QA M2; przy odbiorze 5 prawdziwych wysyłek trafi do skrzynki |
| O-6 | Podgląd linku i indeksacja strony głównej | Wklej adres stagingu do walidatora OG (np. opengraph.xyz); otwórz `/robots.txt` i nagłówki odpowiedzi | Tytuł, opis i obraz OG; `robots.txt` bez `Disallow: /`; `X-Robots-Tag: noindex` | robots i nagłówki sprawdzone w QA M1; **walidator OG przy odbiorze** (E-003) |
| O-7 | Klawiatura | Na stronie głównej naciśnij Tab; na B+R otwórz FAQ Enterem | Pierwszy link „Przejdź do treści”, widoczny fokus, FAQ otwiera się Enterem | sprawdzone w QA M3 |
| O-8 | Wynik Lighthouse | Przejrzyj raport QA M4 | ≥ 90 w wydajności, dostępności, SEO i dobrych praktykach, mobile i desktop, dla każdej strony | raport QA M4 |
| O-9 | Nieistniejący adres | Otwórz `/nie-ma-takiej-strony` | Strona 404 w stylu serwisu z linkiem do strony głównej | sprawdzone w QA M1 |
| O-10 | SEO wszystkich stron | Wklej adres dowolnej strony usługi do walidatora OG; otwórz `/sitemap.xml` | Tytuł, opis i obraz OG strony usługi; sitemap z dokładnie 7 stronami | sitemap sprawdzona w QA M3; **walidator OG przy odbiorze** |

### Robocze treści do akceptacji

Design nie zawierał tych treści (P2 specyfikacji). Napisał je zespół i czekają na decyzję właściciela.

| Treść | Gdzie | Stan | Co zrobić |
|---|---|---|---|
| Klauzula informacyjna przy formularzu: „Administratorem Twoich danych jest ISKT Greennovation Sp. z o.o., Wiedeńska 11, 44-240 Żory. Imię, e-mail i treść wiadomości przetwarzamy wyłącznie po to, aby odpowiedzieć na Twoje zapytanie. Szczegóły w polityce prywatności.” | `/#kontakt`, pod przyciskiem „Wyślij wiadomość” (`src/components/home/ContactForm.astro`) | **do akceptacji** | Zaakceptować albo podać nowe brzmienie (zmiana = nowe issue) |
| Polityka prywatności (administrator, cel, podstawa, odbiorcy Vercel i Resend, okres przechowywania, prawa, kontakt) | `/polityka-prywatnosci/` | zaakceptowana 2026-11-05 (PR #25, `docs/decyzje.md`) | Przed B9a potwierdzić otwarte punkty z raportu T-9: region Resend, retencja logów Resend, IOD |
| Obraz Open Graph 1200×630: logo, „ISKT Greennovation”, „Innowacje w harmonii z naturą” na jasnym tle marki | `public/og/iskt-og.png`, podgląd: https://iskt-www.vercel.app/og/iskt-og.png | **do akceptacji** | Zaakceptować albo dostarczyć własny obraz 1200×630 |
| Tytuł i opis polityki prywatności w wynikach wyszukiwania | `src/content/seo.ts` | **do akceptacji** razem z polityką | Jak wyżej |

Poza treściami właściciel przed odbiorem akceptuje umowy powierzenia (DPA) Vercel i Resend na koncie
ISKT (ADR-001).

## Obsługa i eksploatacja

Po odbiorze ISKT przejmuje:

- **Skrzynkę zapytań** (`CONTACT_TO`): odpowiadanie na zgłoszenia, usuwanie starych e-maili (strona nie
  przechowuje zgłoszeń, skrzynka jest jedynym archiwum).
- **Konto Vercel:** hosting, domena iskt.pl, zmienne środowiska, reguła rate limit w Firewall, logi
  funkcji formularza.
- **Konto Resend:** domena wysyłkowa, klucze API, retencja logów wysyłki.
- **Repozytorium** `Sebastian-Temich/iskt-www`: zmiany treści i kodu przez PR; po merge'u do `main`
  zmiana jest widoczna na stagingu, a na iskt.pl po wydaniu przez właściciela.

Zgłaszanie problemów: issue w repozytorium `Sebastian-Temich/iskt-www` (opis, adres strony, kroki,
zrzut ekranu; bez danych osobowych z formularza i bez kluczy). Pilne: niedziałający formularz albo
strona. Typowe przyczyny i diagnoza: dokumentacja techniczna, „Monitoring” i „Plan rollbacku”.
