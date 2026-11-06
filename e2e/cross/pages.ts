// Strony sprawdzane przekrojowo (#15): 7 stron z W-01 (specyfikacja, tabela „Lista stron v1”),
// polityka prywatności (W-06) i 404 (W-09). Lista wpisana na sztywno, żeby testy nie zależały od
// `src/content/seo.ts`, które same sprawdzają (sitemap).

export const W01_PAGES = [
  '/',
  '/uslugi/projekty-br/',
  '/uslugi/esg/',
  '/uslugi/ai-transformacja/',
  '/uslugi/oprogramowanie/',
  '/uslugi/interim/',
  '/startupy/',
] as const;

export const POLICY_PAGE = '/polityka-prywatnosci/';
export const NOT_FOUND_PAGE = '/nie-ma-takiej-strony/';

export interface CrossPage {
  path: string;
  status: number;
}

export const CROSS_PAGES: CrossPage[] = [
  ...W01_PAGES.map((path) => ({ path, status: 200 })),
  { path: POLICY_PAGE, status: 200 },
  { path: NOT_FOUND_PAGE, status: 404 },
];

/** Ścieżka linku wewnętrznego bez kotwicy i zapytania albo `null` dla linku zewnętrznego. */
export function internalPath(href: string): string | null {
  if (!href.startsWith('/') || href.startsWith('//')) return null;
  return href.split('#')[0]?.split('?')[0] || '/';
}
