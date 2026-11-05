// Generuje podzbiory latin-ext czcionek tylko z polskimi literami (#22, W-10).
// Źródło: pełne pliki latin-ext (~35 KB na wagę) z katalogów `files/` pakietów @fontsource/inter i
// @fontsource/jetbrains-mono 5.3.0, skopiowane do jednego katalogu; wynik: public/fonts/*-latin-ext-pl-*.woff2
// (ok. 2 KB). Uruchomienie: `node scripts/subset-fonts-pl.mjs KATALOG_ZRODEL`.
// Zakres musi być zgodny z `unicode-range` bloków latin-ext-pl w src/styles/fonts.css.
import { readFile, writeFile } from 'node:fs/promises';
import subsetFont from 'subset-font';

/** Polskie litery spoza Latin-1 (Ó/ó jest w podzbiorze latin). */
export const POLISH_EXT = 'ĄąĆćĘęŁłŃńŚśŹźŻż';

const FONTS = [
  ...[400, 500, 600, 700, 800].map((w) => `inter-latin-ext-${w}-normal`),
  ...[400, 500, 600].map((w) => `jetbrains-mono-latin-ext-${w}-normal`),
];

const sourceDir = process.argv[2];
if (!sourceDir) throw new Error('Podaj katalog z plikami latin-ext z @fontsource 5.3.0');

for (const name of FONTS) {
  const source = await readFile(`${sourceDir}/${name}.woff2`);
  const subset = await subsetFont(source, POLISH_EXT, { targetFormat: 'woff2' });
  const target = `public/fonts/${name.replace('latin-ext', 'latin-ext-pl')}.woff2`;
  await writeFile(target, subset);
  console.log(`${target}: ${source.length} B → ${subset.length} B`);
}
