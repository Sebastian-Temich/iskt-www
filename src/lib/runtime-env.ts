/**
 * Źródło zmiennych środowiskowych: obiekt zmiennych Vite (pliki env w `astro dev` i zmienne
 * publiczne) nadpisany przez `process.env` (zmienne Vercel w funkcji i w buildzie).
 *
 * Ten moduł celowo NIE zawiera nazw zmiennych prywatnych (nawet w komentarzach). Wtyczka env Astro
 * zamienia w buildzie odwołanie do całego obiektu zmiennych na `Object.assign(…, {…})` z wartościami z
 * plików env dla tych kluczy, których nazwy występują w tekście modułu. Bez nazw nie wkleja żadnej
 * wartości, więc klucz API z lokalnego pliku env nie trafia do paczki funkcji; na Vercel sekrety
 * czytamy w czasie działania z `process.env`. Pilnuje tego test `__tests__/runtime-env.test.ts`.
 */
export function runtimeEnv(): Readonly<Record<string, string | undefined>> {
  const fromProcess = typeof process === 'undefined' ? {} : process.env;
  return { ...(import.meta.env as Record<string, string | undefined>), ...fromProcess };
}
