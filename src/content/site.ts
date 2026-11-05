// Jedno źródło danych firmy, nawigacji i listy usług (architektura: „Moduły i granice”).
// Dane z D/ISKT-standalone.dc.html (JSON-LD l. 19, kontakt l. 160-163) i D/ESG.dc.html (stopka).
import type { IconName } from '../components/ui/icon-names';

export const company = {
  name: 'ISKT Greennovation Sp. z o.o.',
  brand: 'ISKT Greennovation',
  slogan: 'Innowacje w harmonii z naturą',
  address: {
    street: 'Wiedeńska 11',
    postalCode: '44-240',
    city: 'Żory',
  },
  nip: '6511752112',
  regon: '543251405',
  email: 'biuro@iskt.pl',
  phone: '+48 504 083 825',
  phoneHref: 'tel:+48504083825',
  domain: 'iskt.pl',
} as const;

export const nav = {
  home: '/',
  competences: '/#kompetencje',
  contact: '/#kontakt',
} as const;

export const trainingUrl = 'https://szkolenia.iskt.pl';

export interface Service {
  /** Nazwa z kafla na stronie głównej. */
  title: string;
  /** URL strony usługi (W-01) albo zewnętrzny link Szkoleń. */
  href: string;
  /** Krótki opis z kafla D/ISKT-standalone.dc.html. */
  description: string;
  icon: IconName;
  external?: boolean;
}

/** Kafle „Nasze Kompetencje” w kolejności z designu (D/ISKT-standalone.dc.html:94-149). */
export const services: readonly Service[] = [
  {
    title: 'Projekty B+R',
    href: '/uslugi/projekty-br/',
    description: 'Badania i rozwój z finansowaniem.',
    icon: 'flask-conical',
  },
  {
    title: 'ESG',
    href: '/uslugi/esg/',
    description: 'Strategie i wdrożenia praktyk.',
    icon: 'recycle',
  },
  {
    title: 'AI i transformacja',
    href: '/uslugi/ai-transformacja/',
    description: 'Automatyzacja procesów.',
    icon: 'cpu',
  },
  {
    title: 'Startupy',
    href: '/startupy/',
    description: 'Od pomysłu po skalowanie.',
    icon: 'rocket',
  },
  {
    title: 'Oprogramowanie',
    href: '/uslugi/oprogramowanie/',
    description: 'Dedykowane rozwiązania.',
    icon: 'code-xml',
  },
  {
    title: 'Szkolenia',
    href: trainingUrl,
    description: 'Rozwijaj praktyczne kompetencje z AI, ESG - prywatnie lub w organizacji',
    icon: 'graduation-cap',
    external: true,
  },
  {
    title: 'Interim',
    href: '/uslugi/interim/',
    description:
      'Gdy organizacja czasowo potrzebuje kompetencji CAAO, CDO, AI lub ESG — obejmujemy rolę na czas przejściowy.',
    icon: 'user-cog',
  },
];
