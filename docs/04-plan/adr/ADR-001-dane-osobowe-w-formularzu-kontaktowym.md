---
projekt: iskt-www
etap: 04-plan
data: "2026-11-05"
rola: intake
---

# ADR-001: Dane osobowe w formularzu kontaktowym

Status: proponowana
Data: 2026-11-05

Autor: intake, z decyzji właściciela (E-001, opcja A). Architekt w etapie `04-architektura` przyjął
decyzję bez zmian merytorycznych (2026-11-05); mechanizm limitu z pkt 5 rozstrzyga ADR-003, a
integrację e-mail ADR-004. Status zmienia się na „zaakceptowana” z akceptacją architektury przez
właściciela.

Powiązane wymagania: W-04 (formularz), W-05 (antyspam i rate limit), W-06 (informacja o
przetwarzaniu), W-12 (sekrety).

## Kontekst

Formularz kontaktowy strony iskt.pl zbiera dane osobowe: imię, adres e-mail i treść wiadomości (oraz
ewentualne dodatkowe pola z designu). Specyfikacja oznacza obszar „Dane osobowe” jako `tak`, co
wymaga ADR. Strona nie ma kont użytkowników ani bazy danych, a zgłoszenie ma trafić do firmy jako
e-mail przez Resend. Funkcja formularza działa na Vercel. Rate limit (W-05) potrzebuje identyfikatora
nadawcy (adres IP) przechowywanego współdzielenie między instancjami funkcji.

## Decyzja

1. **Minimalizacja danych.** Formularz zbiera wyłącznie pola z designu potrzebne do odpowiedzi
   (co najmniej imię, e-mail, wiadomość). Żadnych pól opcjonalnych spoza designu, żadnych ukrytych
   danych o urządzeniu poza honeypotem.
2. **Cel i podstawa.** Jedynym celem jest odpowiedź na zapytanie (podjęcie działań na żądanie osoby,
   której dane dotyczą). Przy przycisku wysyłki jest informacja o administratorze (ISKT), celu i link do
   polityki prywatności (W-06). Brak zgód marketingowych w v1.
3. **Brak przechowywania w aplikacji.** Aplikacja nie zapisuje zgłoszeń w bazie, plikach ani pamięci
   trwałej. Dane istnieją tylko w e-mailu do odbiorcy i w logach wysyłki Resend.
4. **Logi bez danych osobowych.** Logi funkcji zawierają tylko identyfikator zdarzenia, status i kod
   błędu. Zakazane w logach: imię, e-mail, treść, nagłówki z danymi nadawcy, pełny adres IP. Testy
   jednostkowe endpointu sprawdzają, że ścieżki sukcesu i błędu nie logują tych pól.
5. **Rate limit i IP.** Klucz limitu to adres IP albo jego skrót (hash z solą ze zmiennej
   środowiskowej), trzymany tylko na czas okna limitu (10 minut) w mechanizmie współdzielonym między
   instancjami. Mechanizm: ADR-003 (reguła Vercel Firewall; fallback Upstash ze skrótem IP).
6. **Podmioty przetwarzające.** Vercel (hosting funkcji, region UE `fra1`) i Resend (wysyłka e-maili,
   region UE, jeśli dostępny na koncie). Akceptacja umów powierzenia (DPA) na koncie ISKT to krok ręczny
   właściciela.
7. **Retencja.** W aplikacji brak. Retencja e-maili w skrzynce odbiorcy i w panelu Resend jest po
   stronie właściciela; zalecamy najkrótszą retencję logów dostępną w Resend.
8. **Transmisja.** Tylko HTTPS; klucz Resend i adres odbiorcy wyłącznie w zmiennych środowiskowych
   (W-12). E-mail ustawia `Reply-To` na adres nadawcy; treść jest wysyłana jako tekst/escapowana.

## Rozważane opcje

| Opcja | Ocena |
|---|---|
| Wysyłka e-mailem przez Resend bez zapisu (wybrana) | Najmniej danych i najmniej elementów do zabezpieczenia; brak bazy; zgodna z zakresem v1 |
| Zapis zgłoszeń w bazie (np. Supabase) + powiadomienie | Daje historię i odporność na awarię e-maila, ale wymaga bazy, retencji, RLS i panelu — poza zakresem v1 |
| Zewnętrzny serwis formularzy (SaaS) | Mniej kodu, ale dodatkowy podmiot przetwarzający, często poza UE, i integracja wykluczona z v1 |

## Konsekwencje

- Utrata zgłoszenia przy awarii Resend: użytkownik widzi błąd i może ponowić lub napisać bezpośrednio
  e-mailem (W-04); dane zostają w formularzu.
- Brak historii zgłoszeń w aplikacji; jedynym archiwum jest skrzynka odbiorcy.
- Zadanie formularza musi mieć testy: walidacja serwera, brak PII w logach, honeypot, rate limit,
  timeout Resend (mock).
- Kroki właściciela: konto Resend z kluczem testowym, adres odbiorcy, akceptacja DPA Vercel i Resend,
  treść polityki prywatności (P2 specyfikacji).
- Zmiana na zapis zgłoszeń wymaga nowego ADR zastępującego ten.
