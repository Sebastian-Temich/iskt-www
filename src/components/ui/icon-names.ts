// Nazwy ikon Lucide z designu (architektura: „Komponenty i ich podpięcie”). Osobny plik bez
// importów komponentów, żeby dane (content/site.ts) i testy jednostkowe nie ładowały .astro.
export const iconNames = [
  'arrow-right',
  'send',
  'flask-conical',
  'recycle',
  'cpu',
  'rocket',
  'code-xml',
  'graduation-cap',
  'user-cog',
  'search-check',
  'coins',
  'file-text',
  'clipboard-check',
  'shield-check',
  'check',
  'chevron-down',
  'chevron-up',
] as const;

export type IconName = (typeof iconNames)[number];
