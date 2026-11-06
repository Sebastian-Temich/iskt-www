---
projekt: iskt-www
etap: 04-architektura
data: "2026-11-06"
rola: worker
zadanie: 44
---

# ADR-005: Node 22 zamiast 26

Status: proponowana
Data: 2026-11-06

Zmienia kontrakt „Stack (kontrakt)” w `AGENTS.md`, wiersz „Instalacja”, gdzie było „Node 26 LTS z
`.nvmrc`”. Zadanie: #44. Decyzja właściciela z 2026-11-06 w `docs/decyzje.md`: Node 22 zainstalowany
lokalnie przez fnm obok Node 26, a `.nvmrc` zostaje 22 jak runtime Vercel.

## Kontekst

Jedyny kod serwerowy projektu to funkcja `POST /api/contact/` na Vercel (ADR-002). Wersję runtime tej
funkcji wybiera adapter `@astrojs/vercel` (8.2.11) z wersji Node, na której działa build. Adapter zna
tylko runtime 20 i 22 (`SUPPORTED_NODE_VERSIONS`). Dla innej wersji, w tym 24 i 26, ostrzega „The local
Node.js version (…) is not supported by Vercel Serverless Functions” i ustawia `nodejs22.x`.

Dotąd projekt miał Node 26 (`.nvmrc`) i `engines.node` „>=24”. Build, testy i CI szły więc na 26, a
funkcja produkcyjna działała na 22. Taki rozjazd ukrywa błędy: kod może użyć API z Node 26, którego
nie ma w runtime. Każdy build pokazywał też ostrzeżenie adaptera.

## Decyzja

1. Node projektu to 22 (LTS, faza maintenance do 2027-04-30): `.nvmrc` = `22`, a `package.json`
   `engines.node` = `22.x`. Vercel czyta wersję Node projektu z `engines.node`, a CI
   (`actions/setup-node` z `node-version-file: .nvmrc`) i fnm czytają `.nvmrc`.
2. Lokalny build, testy, CI i funkcja Vercel (`nodejs22.x`) działają na tej samej wersji.
3. Nie dodajemy `.node-version`. Wersja jest w jednym pliku, `.nvmrc`, plus w `engines.node`.
4. Właściciel instaluje Node 22 przez fnm obok Node 26. Domyślna wersja systemu się nie zmienia.

## Rozważane opcje

- **Node 26 bez zmian.** Odrzucona: build na 26, runtime na 22 i stałe ostrzeżenie adaptera.
- **Node 24.** Odrzucona: Vercel ma runtime 24, ale adapter 8.2.11 go nie zna i też ustawia
  `nodejs22.x`, więc rozjazd zostaje.
- **Node 22.** Wybrana: jedyna wersja zgodna z runtime ustawianym przez adapter, wspierana przez
  zależności (astro `>=22`, vitest `^22.12.0`, resend `>=20`).

## Konsekwencje

- Build i testy sprawdzają kod na tej samej wersji co funkcja produkcyjna. Ostrzeżenie adaptera znika.
- Agenci i właściciel potrzebują Node 22 w fnm: `fnm use` w katalogu projektu go wybiera.
- Nie wolno używać API dostępnych dopiero w Node 23+. `@types/node` jest dziś `^24`, więc typy tego nie
  pilnują (drobna uwaga w `T-44.md`).
- Node 22 kończy wsparcie 2027-04-30. Przed tą datą trzeba przejść na wyższą wersję razem z
  aktualizacją `@astrojs/vercel`, który obsługuje nowszy runtime. To osobne zadanie i nowy ADR.

## Cofnięcie

Nowe zadanie: `.nvmrc` = `26`, `engines.node` = `>=24`, wiersz „Instalacja” w `AGENTS.md` z powrotem na
Node 26 i status tego ADR „zastąpiona”. Lokalnie `fnm uninstall 22` (decyzja właściciela w
`docs/decyzje.md`). Funkcja Vercel i tak zostanie na `nodejs22.x`, dopóki adapter nie obsłuży nowszej
wersji.
