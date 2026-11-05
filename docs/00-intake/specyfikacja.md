---
projekt: iskt-www
etap: 00-intake
data: "2026-11-05"
rola: intake
---

# Specyfikacja: iskt-www

Zlecenie: `docs/00-intake/zrodlo.md`. Zlecono (UTC): 2026-11-05T10:43Z.

## Cel i kontekst

ISKT potrzebuje nowej strony firmowej pod iskt.pl, budowanej od zera według designu przygotowanego w
Claude Design. Strona przedstawia firmę i jej ofertę oraz pozwala potencjalnemu klientowi wysłać
zapytanie przez formularz kontaktowy. Rezultat biznesowy: wiarygodna wizytówka firmy, dobrze widoczna w
wyszukiwarkach i szybka na telefonie, która zamienia odwiedziny w zapytania e-mail.

Sytuacja wyjściowa: czysty projekt. Jedynym źródłem treści i wyglądu jest eksport designu (materiały w
`docs/02-design/zrodla/`). Nie korzystamy z żadnych starych repozytoriów ani dotychczasowych stron.
Pilot kończy się na stagingu; podpięcie domeny iskt.pl robi właściciel później (B9a).

## Użytkownicy

| Grupa | Potrzeba | Uprawnienia |
|---|---|---|
| Odwiedzający (potencjalny klient, kandydat, partner) | Poznać ofertę ISKT i skontaktować się z firmą | Publiczny odczyt stron, wysłanie formularza |
| Właściciel ISKT (odbiorca zapytań) | Otrzymywać zapytania z formularza na swoją skrzynkę | Brak panelu; odbiór e-maili, konfiguracja zmiennych środowiska w hostingu |
| Wyszukiwarki i serwisy społecznościowe (roboty) | Poprawnie indeksować stronę i budować podgląd linku | Odczyt `sitemap.xml`, `robots.txt`, meta i Open Graph |

Strona nie ma kont użytkowników ani panelu administracyjnego.

## Zakres

W zakresie:

- wszystkie strony z designu (lista ustalana z materiałów, W-01), wspólny layout z nagłówkiem,
  nawigacją i stopką;
- formularz kontaktowy z walidacją i wysyłką e-maila przez Resend (w dev i na stagingu tylko klucz
  testowy);
- responsywność zgodna z widokami desktop i mobile z designu;
- podstawy SEO: meta title i description, kanoniczne URL, `sitemap.xml`, `robots.txt`, Open Graph i
  Twitter Card;
- strona 404 i dostępność na poziomie WCAG 2.2 AA w zakresie sprawdzalnym automatycznie i z
  klawiatury;
- staging na Vercel z wynikami Lighthouse ≥ 90.

Poza zakresem (v1):

- CMS, blog i jakikolwiek panel do edycji treści (treść jest w kodzie);
- wersje językowe (strona tylko w języku designu);
- integracje: CRM, newsletter, analityka, czat, mapy zewnętrzne, piksele reklamowe;
- zapisywanie zgłoszeń w bazie danych (zapytanie istnieje tylko jako e-mail);
- wdrożenie na domenę iskt.pl, weryfikacja domeny w Resend i produkcyjny klucz Resend (właściciel,
  B9a);
- baner cookies: v1 nie używa cookies ani skryptów śledzących, więc nie jest potrzebny.

## Wymagania

Priorytety: musi, powinno, może. Kryteria odnoszą się do designu w `docs/02-design/zrodla/`.

### W-01: Strony z designu (musi)

Jako odwiedzający chcę otworzyć każdą stronę zaprojektowaną w designie, aby poznać firmę i jej ofertę.

- Given materiały designu w `docs/02-design/zrodla/`, when architekt spisuje listę stron, then każda
  strona z designu ma w `architektura.md` swój adres URL i jest osiągalna z nawigacji albo z linku na
  innej stronie.
- Given dowolna strona z listy, when odwiedzający otwiera jej URL, then serwer zwraca 200, a treść
  (nagłówki, teksty, obrazy, przyciski) odpowiada designowi tej strony bez treści zastępczych
  („lorem ipsum”, „TODO”).
- Given strona z listy, when porównuję ją ze zrzutem designu w szerokości desktop, then układ sekcji,
  ich kolejność i hierarchia nagłówków są zgodne ze zrzutem.

Lista stron jest otwartym pytaniem P1 i zostanie domknięta z materiałów przed architekturą.

### W-02: Wspólny layout i nawigacja (musi)

Jako odwiedzający chcę na każdej stronie mieć ten sam nagłówek, nawigację i stopkę, aby swobodnie
przechodzić między stronami.

- Given dowolna strona, when się ładuje, then ma nagłówek z logo prowadzącym na stronę główną,
  nawigację do stron z W-01 i stopkę zgodną z designem.
- Given bieżąca strona, when patrzę na nawigację, then pozycja bieżącej strony jest wyróżniona
  wizualnie i ma `aria-current="page"`.
- Given widok mobile z designu, when szerokość okna jest poniżej punktu przełamania z designu, then
  nawigacja przyjmuje formę mobilną z designu (np. menu rozwijane), daje się otworzyć i zamknąć
  klawiaturą i zamyka się klawiszem Escape.

### W-03: Responsywność zgodna z designem (musi)

Jako odwiedzający na telefonie chcę czytelnej strony, aby korzystać z niej bez powiększania.

- Given szerokości 375 px, 768 px i 1440 px, when otwieram dowolną stronę, then nie ma poziomego
  przewijania strony, a układ odpowiada zrzutom mobile (375 px) i desktop (1440 px) z designu.
- Given szerokość 375 px, when sprawdzam elementy interaktywne, then każdy ma obszar kliknięcia co
  najmniej 24×24 px.
- Given tekst podstawowy, when sprawdzam rozmiar czcionki na mobile, then wynosi co najmniej 16 px albo
  tyle, ile podaje design, jeśli więcej.

### W-04: Formularz kontaktowy (musi)

Jako potencjalny klient chcę wysłać zapytanie przez formularz, aby firma odpowiedziała mi e-mailem.

- Given formularz z polami z designu (co najmniej imię, e-mail, wiadomość), when wysyłam poprawnie
  wypełniony formularz, then serwer wysyła e-mail przez Resend na adres odbiorcy ze zmiennej
  środowiskowej, a ja widzę komunikat sukcesu z designu.
- Given e-mail zapytania, when odbiorca go otwiera, then zawiera imię, e-mail nadawcy, treść wiadomości
  i ewentualne dodatkowe pola z designu, a nagłówek `Reply-To` to e-mail nadawcy.
- Given puste wymagane pole albo niepoprawny e-mail, when wysyłam formularz, then nic nie jest
  wysyłane, a przy polu pojawia się komunikat błędu powiązany przez `aria-describedby`, a fokus
  przechodzi do pierwszego błędnego pola.
- Given walidacja po stronie przeglądarki wyłączona, when wysyłam niepoprawne dane bezpośrednio do
  endpointu, then serwer odrzuca je kodem 400 i nie wysyła e-maila.
- Given Resend zwraca błąd albo nie odpowiada w 10 s, when wysyłam formularz, then widzę komunikat
  błędu z prośbą o ponowienie lub kontakt mailowy, a wpisane dane zostają w formularzu.
- Given trwa wysyłka, when klikam ponownie „Wyślij”, then przycisk jest zablokowany i drugi e-mail nie
  jest wysyłany.

### W-05: Ochrona formularza przed spamem i nadużyciem (musi)

Jako właściciel chcę, aby formularz nie był kanałem spamu, aby skrzynka zawierała prawdziwe zapytania.

- Given wypełnione ukryte pole-pułapka (honeypot), when formularz trafia do endpointu, then serwer
  zwraca odpowiedź sukcesu, ale e-maila nie wysyła.
- Given więcej niż 5 zgłoszeń z jednego adresu IP w ciągu 10 minut, when przychodzi kolejne, then
  serwer zwraca 429 i nie wysyła e-maila.
- Given pola tekstowe, when wartość przekracza limity (imię 100, e-mail 254, wiadomość 5000 znaków),
  then serwer odrzuca zgłoszenie kodem 400.
- Given treść z HTML lub znakami nowej linii w nagłówkach, when serwer buduje e-mail, then treść jest
  wysłana jako tekst/escapowana, a nagłówki nie dają się wstrzyknąć.

### W-06: Informacja o przetwarzaniu danych (musi)

Jako osoba wysyłająca formularz chcę wiedzieć, co dzieje się z moimi danymi, aby świadomie je podać.

- Given formularz kontaktowy, when go oglądam, then przy przycisku wysyłki jest informacja o
  administratorze danych i celu przetwarzania z linkiem do polityki prywatności, w brzmieniu z designu
  albo — gdy design go nie zawiera — z tekstu dostarczonego przez właściciela (P2).
- Given wysłane zgłoszenie, when sprawdzam logi aplikacji, then nie zawierają imienia, e-maila ani
  treści wiadomości (tylko identyfikator zdarzenia, status i kod błędu).
- Given wysłane zgłoszenie, when sprawdzam system, then dane nie są zapisywane nigdzie poza wysłanym
  e-mailem.

### W-07: Meta i Open Graph (musi)

Jako właściciel chcę, aby każda strona miała poprawne meta i podgląd w mediach społecznościowych, aby
linki do strony dobrze wyglądały i były indeksowane.

- Given dowolna strona z W-01, when czytam jej `<head>`, then ma unikalny `<title>`, `meta description`
  (do 160 znaków), `link rel="canonical"`, `lang` w `<html>` oraz `og:title`, `og:description`,
  `og:url`, `og:image` (1200×630) i `twitter:card`.
- Given podgląd linku w walidatorze Open Graph, when podaję URL strony, then pokazuje tytuł, opis i
  obraz z designu albo zasobów.
- Given adres bazowy ze zmiennej środowiskowej, when zmieniam go ze stagingu na iskt.pl, then kanoniczne
  URL, `og:url` i sitemap zmieniają się bez zmian w kodzie.

### W-08: Sitemap i robots (musi)

Jako robot wyszukiwarki chcę mapy strony, aby zaindeksować wszystkie strony.

- Given zbudowana aplikacja, when pobieram `/sitemap.xml`, then zawiera wszystkie strony z W-01 i
  żadnych innych (bez 404 i endpointów).
- Given staging, when pobieram `/robots.txt` albo nagłówki strony, then staging ma `noindex` (nagłówek
  `X-Robots-Tag` albo `Disallow: /`), a konfiguracja produkcyjna wskazuje sitemap i pozwala indeksować.

### W-09: Strona 404 (powinno)

Jako odwiedzający chcę zrozumiałej strony błędu, aby wrócić do serwisu z błędnego linku.

- Given nieistniejący URL, when go otwieram, then serwer zwraca status 404 i stronę w stylu designu (z
  layoutem z W-02) z linkiem do strony głównej.

### W-10: Wydajność i jakość na stagingu (musi)

Jako właściciel chcę szybkiej i poprawnej strony, aby dobrze wypadała w wyszukiwarkach i na telefonach.

- Given wdrożenie na stagingu, when uruchamiam Lighthouse (profil mobile i desktop) dla każdej strony z
  W-01, then wyniki Performance, Accessibility, Best Practices i SEO wynoszą co najmniej 90 w obu
  profilach. Na stagingu ocena SEO jest liczona z pominięciem audytu `is-crawlable` (wynika z
  zamierzonego `noindex` z W-08), co raport QA odnotowuje.
- Given obrazy z designu, when strona je wyświetla, then są w nowoczesnym formacie (AVIF/WebP z
  fallbackiem), mają jawne wymiary i obrazy poniżej pierwszego ekranu ładują się leniwie.
- Given czcionki z designu, when strona się ładuje, then są hostowane lokalnie z `font-display: swap`
  albo `optional` i bez zewnętrznych żądań do serwisów czcionek.

### W-11: Dostępność (musi)

Jako osoba korzystająca z klawiatury lub czytnika ekranu chcę obsłużyć całą stronę, aby uzyskać te same
informacje co inni.

- Given dowolna strona, when uruchamiam axe-core w testach E2E, then nie ma naruszeń o wadze serious ani
  critical.
- Given nawigacja klawiaturą, when przechodzę klawiszem Tab, then pierwszym elementem jest link „Przejdź
  do treści”, każdy element interaktywny ma widoczny fokus, a kolejność odpowiada kolejności wizualnej.
- Given obrazy, when czytnik ekranu je odczytuje, then obrazy treściowe mają opisowy `alt`, a
  dekoracyjne `alt=""`.
- Given użytkownik z `prefers-reduced-motion: reduce`, when oglądam animacje z designu, then są
  wyłączone albo ograniczone.

### W-12: Staging (musi)

Jako właściciel chcę przeglądać stronę na stagingu, aby odebrać pilota przed wdrożeniem na iskt.pl.

- Given merge do `main`, when CI przechodzi, then staging na Vercel aktualizuje się automatycznie i ma
  stały adres (alias stagingu zapisany w `docs/wydanie/techniczna/`).
- Given staging, when wysyłam formularz, then używany jest testowy klucz Resend, a e-mail trafia na
  adres testowy właściciela.
- Given repozytorium, when szukam kluczy API, then żaden klucz nie jest w kodzie ani w historii git;
  klucze są wyłącznie w zmiennych środowiskowych Vercel i lokalnym `.env.local`.

## Typ projektu

Web (strona statyczna z jednym endpointem serwerowym dla formularza):

| Konsekwencja | Ustalenie |
|---|---|
| Narzędzia testowe | Vitest (walidacja i endpoint formularza, z mockiem Resend), Playwright chromium + webkit (nawigacja, formularz, responsywność 375/768/1440, axe-core), Lighthouse CI na stagingu (mobile i desktop) |
| Dodatkowe punkty DoD | Każda strona i komponent podpięte do routingu lub layoutu (kryterium w zadaniu albo osobne zadanie); zgodność ze zrzutami desktop i mobile; Lighthouse ≥ 90 w 4 kategoriach na stagingu (DoD QA); wymagania W-xx przywoływane w zadaniach i w raporcie QA |
| Ograniczenia runnera | Brak; testy E2E nie wysyłają prawdziwych e-maili (mock Resend albo adres testowy Resend) |
| Kroki ręczne właściciela | Konto Vercel i projekt, konto Resend i klucz testowy, adres odbiorcy zapytań; domena iskt.pl później (B9a) |

## Stack

| | Wybór | Uzasadnienie |
|---|---|---|
| Rekomendacja | **Astro 5 + TypeScript**, strony statyczne (SSG) z jednym endpointem serwerowym `/api/contact` (adapter `@astrojs/vercel`, funkcja serverless), style w CSS z tokenami designu (custom properties; Tailwind 4 dopuszczalny, decyzja architekta), `@astrojs/sitemap`, obrazy przez `astro:assets`, walidacja Zod, SDK `resend` | Strona treściowa bez stanu: Astro domyślnie nie wysyła JavaScriptu do przeglądarki, co najłatwiej daje Lighthouse ≥ 90 na mobile; wbudowana optymalizacja obrazów i sitemap; endpoint formularza obok stron bez osobnego backendu; prosty kod komponentów do odwzorowania designu z eksportu HTML/CSS |
| Alternatywa | Next.js 15 (App Router, statyczne strony + Route Handler dla formularza) na Vercel | Szerszy ekosystem React i łatwiejsza rozbudowa o panel/CMS w przyszłości, ale cięższy bundle JS (trudniej o Performance ≥ 90 na mobile) i więcej konfiguracji dla czysto treściowej strony |

Supabase nie jest potrzebny: v1 nie przechowuje danych (W-06). Gdy w przyszłości dojdzie CMS lub blog,
wybór warstwy treści rozstrzyga nowy ADR.

## Hosting

Vercel (aplikacja i funkcja formularza), region funkcji UE (`fra1`), konto klienta (ISKT). Bez bazy
danych: pole `hosting.baza` w `konfiguracja.md` ustawione na `brak`. Staging: wdrożenie z `main` z
aliasem stagingu; podpięcie domeny iskt.pl robi właściciel (B9a). E-mail: Resend (region UE, jeśli
dostępny na koncie), w dev i na stagingu tylko klucz testowy.

## Design

Źródło: design przygotowany przez właściciela w Claude Design. Jest jedynym źródłem treści i wyglądu.
Ustalone: styl, treści i układ wynikają wyłącznie z materiałów; nie ma odniesień do starych stron.

Właściciel dostarcza przez skrzynkę `SH/Skrzynka/iskt-www` (orkiestrator przenosi do
`docs/02-design/zrodla/`):

- eksport z Claude Design (HTML/CSS lub pakiet projektu);
- zrzuty każdej strony w widoku desktop i mobile;
- treści (teksty stron, w tym klauzula informacyjna formularza, jeśli jest w designie);
- zasoby: logotyp (najlepiej SVG), ikony, zdjęcia i ilustracje w pełnej rozdzielczości, favicon,
  pliki czcionek albo ich nazwy i licencje, obraz Open Graph (lub zgoda na wygenerowanie go z designu).

Architekt wyprowadza z materiałów tokeny (kolory, typografia, odstępy) i listę komponentów do sekcji
„Design” w `architektura.md`, a zadania wskazują konkretne pliki designu.

## Kroki ręczne właściciela

1. Wrzucić materiały designu do skrzynki i napisać „materiały w skrzynce” (przed architekturą).
2. Założyć (albo udostępnić) konto Vercel i projekt podpięty do repo `Sebastian-Temich/iskt-www`;
   ustawić region funkcji UE.
3. Założyć konto Resend i wygenerować klucz testowy; wpisać go w zmienne środowiskowe Vercel
   (staging) oraz przekazać do lokalnego `.env.local` poza repo. Podać adres odbiorcy zapytań (testowy
   na staging).
4. Dostarczyć treść polityki prywatności i klauzuli informacyjnej, jeśli design jej nie zawiera (P2).
5. Później, poza pilotem (B9a): domena iskt.pl w Vercel, weryfikacja domeny w Resend (SPF/DKIM),
   klucz produkcyjny, przełączenie adresu bazowego i zdjęcie `noindex`.

Usługi: Vercel Hobby/Pro i Resend Free wystarczają na v1; ewentualny płatny plan wybiera właściciel.

## Ryzyka

| Obszar | Ocena (tak, nie, do ustalenia) | Skutek |
|---|---|---|
| Auth i RLS, role użytkowników | nie | Brak kont i panelu |
| Płatności | nie | — |
| Dane osobowe | tak | Formularz zbiera imię, e-mail i treść: ADR (brak zapisu danych, logi bez PII, klauzula informacyjna W-06), testy logów |
| AI przetwarzające dane użytkowników | nie | — |
| Migracje bazy produkcyjnej | nie | Brak bazy |
| Upload plików, integracje zewnętrzne | tak | Integracja Resend: walidacja wejścia, timeout 10 s, obsługa błędów (W-04), rate limit i honeypot (W-05) |
| Płatne usługi, sekrety, nowe konta | tak | Konta Vercel i Resend oraz klucz testowy to kroki ręczne właściciela; klucze tylko w env (W-12) |
| Zgodność z designem i niekompletne materiały | do ustalenia | Lista stron i treści zależą od materiałów; brak elementu w designie zgłaszamy jako pytanie, nie zgadujemy treści |

## Szacunek poglądowy

| Miara | Wartość |
|---|---|
| Zadania | 9–13 (szkielet z tokenami i layoutem, 4–7 stron zależnie od designu, formularz z endpointem, SEO, 404, staging i Lighthouse) w 2–3 kamieniach |
| Czas kalendarzowy | ok. 1–1,5 tygodnia od akceptacji planu |
| Czas właściciela | ok. 2–3 h: materiały, 3 checkpointy, konta Vercel i Resend, odbiór na stagingu |

## Tryb procesu

Tryb M: nowy projekt z danymi osobowymi w formularzu i integracją zewnętrzną (Resend), mieszczący się w
kilkunastu zadaniach, więc nie wymaga trybu L.

Założenia:

- Strona jest w jednym języku — w tym, w którym jest design (zakładamy polski).
- Treść wszystkich stron pochodzi wyłącznie z designu; brakujących tekstów nie wymyślamy.
- Odbiorca zapytań i klucz Resend są w zmiennych środowiskowych, nie w kodzie.
- Rate limit W-05 jest realizowany w pamięci funkcji lub prostym mechanizmie bez bazy; jeśli okaże się
  niewystarczający, architekt proponuje alternatywę w ADR.

Otwarte pytania:

1. **P1: Jaka jest lista stron v1?** Proponowana odpowiedź: dokładnie strony obecne w eksporcie
   designu; architekt spisuje je z materiałów z URL-ami, a strony bez zrzutu mobile odwzorowujemy
   według reguł responsywnych z designu.
2. **P2: Skąd treść polityki prywatności i klauzuli przy formularzu?** Proponowana odpowiedź: jeśli nie
   ma jej w designie, właściciel dostarcza tekst; do tego czasu w zadaniu formularza używamy krótkiej
   klauzuli (administrator ISKT, cel: odpowiedź na zapytanie) oznaczonej do akceptacji przy odbiorze.
3. **P3: Stack Astro czy Next.js?** Proponowana odpowiedź: Astro 5 (rekomendacja powyżej), bo
   najpewniej spełnia Lighthouse ≥ 90 na mobile przy stronie bez CMS.
