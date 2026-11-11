---
projekt: iskt-www
etap: 04-plan
data: "2026-11-05"
rola: architekt
---

# ADR-003: Rate limit formularza

Status: proponowana
Data: 2026-11-05

Wymagania: W-05 (limit 5 zgłoszeń z jednego IP w 10 minut, licznik współdzielony między instancjami i
odporny na restart). Powiązane: ADR-001 (IP tylko jako klucz limitu na czas okna).

## Kontekst

Endpoint `/api/contact` działa jako funkcja serverless na Vercel. Funkcje skalują się na wiele
instancji i są restartowane, więc licznik w pamięci nie spełnia W-05. Projekt nie ma bazy danych
(ADR-002). Potrzebny jest mechanizm współdzielony, najlepiej bez nowego płatnego konta.

## Decyzja

1. **Warstwa podstawowa: reguła rate limit w Vercel Firewall (WAF)** na ścieżce `/api/contact`,
   metoda `POST`, klucz: IP, limit 5 żądań / 600 s, akcja: odpowiedź 429. Reguła działa przed funkcją,
   w infrastrukturze Vercel, więc jest współdzielona i odporna na restarty, a IP nie trafia do kodu
   aplikacji. Regułę konfiguruje właściciel w panelu projektu Vercel (zadanie właściciela przed
   kamieniem 2); jej ustawienia worker opisuje w `docs/wydanie/techniczna/`.
2. **Fallback, gdy plan Vercel nie udostępnia reguły rate limit:** `@upstash/ratelimit` z bazą Upstash
   Redis (darmowy plan, region UE `eu-central-1`, połączenie przez integrację Vercel Marketplace),
   okno przesuwne 5/600 s, klucz = SHA-256(IP + sól z `RATE_LIMIT_SALT`), TTL = długość okna. Wymaga
   konta Upstash: krok ręczny właściciela i nowa decyzja w `decyzje.md`.
3. **Kod endpointu jest przygotowany na oba warianty:** moduł `src/lib/rate-limit.ts` z interfejsem
   `check(ip): Promise<{ ok: boolean }>`; implementacja `noop` (gdy limit robi WAF) i `upstash`
   wybierana zmienną `RATE_LIMIT_PROVIDER` (`waf` domyślnie, `upstash`). Lokalnie i w testach:
   implementacja w pamięci, wyłącznie do testów.
4. **Odpowiedź 429** ma tę samą treść JSON niezależnie od źródła (`{ "error": "rate_limited" }`), a
   formularz pokazuje komunikat „Zbyt wiele zgłoszeń, spróbuj później” w stylu błędów z designu.

## Rozważane opcje

| Opcja | Ocena |
|---|---|
| Vercel Firewall rate limit (wybrana) | Bez kodu, bez nowego konta, przed funkcją (chroni też limit Resend); zależy od planu Vercel — weryfikacja w spike'u |
| Upstash Redis + `@upstash/ratelimit` (fallback) | Pewny i testowalny w kodzie, darmowy plan wystarcza; nowe konto i nowy podmiot przetwarzający IP (skrót) |
| Licznik w pamięci funkcji | Odrzucona: nie spełnia W-05 przy wielu instancjach i restartach |
| Supabase/Postgres jako licznik | Odrzucona: wprowadza bazę tylko dla limitu (ADR-002: bez bazy) |
| CAPTCHA (Turnstile) zamiast limitu | Nie zastępuje W-05; nowa integracja poza zakresem v1 |

## Konsekwencje

- Zadanie właściciela przed kamieniem 2: sprawdzić dostępność reguły rate limit w planie Vercel i ją
  skonfigurować; przy braku — decyzja o Upstash (fallback).
- Spike na początku kamienia 2 (zadanie formularza): kryterium decyzji — na stagingu 6. żądanie
  `POST /api/contact` z jednego IP w 10 minut zwraca 429. Gdy nie, przełączamy na fallback.
- Dowody (minimalne): test jednostkowy modułu `rate-limit` (implementacja pamięciowa i `upstash` z
  mockiem), test endpointu na 429, test na stagingu w raporcie QA (6 żądań → 429), logi bez IP.
