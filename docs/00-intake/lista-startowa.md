# Lista startowa

Wszystko zewnętrzne, czego realizacja potrzebuje od właściciela: konta, dostępy, domeny, klucze
testowe, limity i płatności usług, materiały. Spisuje ją `sh-intake` na początku zlecenia jedną listą,
a orkiestrator zaznacza pozycję po potwierdzeniu właściciela (na `main`).

`shctl task ready` i `shctl task dispatch` nie startują realizacji, dopóki jest tu choć jedno pole
`- [ ]`. Pole bez zastosowania: `- [-] treść (nie dotyczy: powód)`.

Wartości sekretów nigdy nie trafiają do tego pliku: właściciel wpisuje je do `.env.local` w repo głównym
albo do panelu usługi, a tu tylko potwierdza, że są.

Format pozycji: `- [ ] CO, PO CO (W-NN), JAK: kroki dla właściciela; GDZIE wpisać; JAK sprawdzimy`.

## Konta i dostępy

- [x] Vercel: konto ISKT (klienta), projekt podpięty do `Sebastian-Temich/iskt-www`, alias stagingu https://iskt-www.vercel.app dla `main`, funkcje `fra1` (W-12); potwierdzone 2026-11-05 (`decyzje.md`)
- [x] Resend: konto z domeną iskt.pl zweryfikowaną (W-04); potwierdzone 2026-11-06 (`decyzje.md`)
- [x] Vercel Firewall: reguła rate limit POST `/api/contact` 5/600 s/IP → 429 (W-05, ADR-003); opublikowana 2026-11-05
- [-] Supabase staging i prod, `STAGING_DB_URL` (nie dotyczy: projekt bez bazy, ADR-002)

## Domeny i DNS

- [-] Domena iskt.pl w Vercel (nie dotyczy: produkcja odłożona przez właściciela 2026-11-09, B9a)

## Klucze testowe i zmienne

- [x] Zmienne Vercel `PUBLIC_SITE_URL`, `PUBLIC_SITE_ENV=staging`, `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` (W-04, W-08, W-12); stan 2026-11-06: `formularz@iskt.pl` → `biuro@iskt.pl`
- [x] Klucz testowy Resend w `/Users/Shared/sh/projekty/iskt-www/.env.local` (W-04)

## Limity i płatności usług

- [x] Darmowe plany Vercel (Hobby) i Resend wystarczają (autoryzacja planu PR #3)

## Materiały

- [x] Design Claude Design w `docs/02-design/zrodla/` (W-01)

<!-- Przykład (iskt-www, E-005–E-007):
- [ ] Vercel: Protection Bypass for Automation dla podglądów PR (W-12), JAK: Project → Settings →
  Deployment Protection → Protection Bypass for Automation → Add; wartość do `.env.local` jako
  VERCEL_AUTOMATION_BYPASS_SECRET; sprawdzimy: curl -sI na podgląd PR zwraca 200, nie 302
- [ ] Resend: domena nadawcy zweryfikowana albo CONTACT_TO = adres właściciela konta (W-04), JAK:
  Resend → Domains → Add domain, rekordy SPF i DKIM w DNS; sprawdzimy: wysyłka testowa na CONTACT_TO
- [ ] GitHub Actions: płatności konta aktywne i limit wydatków > 0 (CI, wszystkie W), JAK: Settings →
  Billing and plans → Payment information i Spending limits; sprawdzimy: job e2e startuje na PR
-->
