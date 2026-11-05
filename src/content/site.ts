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
  /** Karta „Pozostałe kompetencje” na stronach usług (D/ESG.dc.html:217-240, D/AI-Transformacja.dc.html). */
  card: { title: string; description: string };
}

/** Kafle „Nasze Kompetencje” w kolejności z designu (D/ISKT-standalone.dc.html:94-149). */
export const services: readonly Service[] = [
  {
    title: 'Projekty B+R',
    href: '/uslugi/projekty-br/',
    description: 'Badania i rozwój z finansowaniem.',
    icon: 'flask-conical',
    card: {
      title: 'Dotacje i ulga B+R',
      description: 'Finansowanie badań i rozwoju, wnioski i rozliczenia.',
    },
  },
  {
    title: 'ESG',
    href: '/uslugi/esg/',
    description: 'Strategie i wdrożenia praktyk.',
    icon: 'recycle',
    card: {
      title: 'Raportowanie ESG — VSME i CSRD',
      description: 'Dane, analiza istotności, raport i wdrożenie praktyk.',
    },
  },
  {
    title: 'AI i transformacja',
    href: '/uslugi/ai-transformacja/',
    description: 'Automatyzacja procesów.',
    icon: 'cpu',
    card: {
      title: 'Wdrożenia AI i automatyzacja',
      description: 'Od audytu procesów do rozwiązania w produkcji.',
    },
  },
  {
    title: 'Startupy',
    href: '/startupy/',
    description: 'Od pomysłu po skalowanie.',
    icon: 'rocket',
    card: {
      title: 'Wsparcie startupów',
      description: 'Od pomysłu i MVP po finansowanie i skalowanie.',
    },
  },
  {
    title: 'Oprogramowanie',
    href: '/uslugi/oprogramowanie/',
    description: 'Dedykowane rozwiązania.',
    icon: 'code-xml',
    card: {
      title: 'Oprogramowanie dedykowane',
      description: 'Systemy szyte na miarę procesu, standard w ok. 2 tygodnie.',
    },
  },
  {
    title: 'Szkolenia',
    href: trainingUrl,
    description: 'Rozwijaj praktyczne kompetencje z AI, ESG - prywatnie lub w organizacji',
    icon: 'graduation-cap',
    external: true,
    card: {
      title: 'Szkolenia z AI i ESG',
      description: 'Praktyczne warsztaty — szkolenia.iskt.pl',
    },
  },
  {
    title: 'Interim',
    href: '/uslugi/interim/',
    description:
      'Gdy organizacja czasowo potrzebuje kompetencji CAAO, CDO, AI lub ESG — obejmujemy rolę na czas przejściowy.',
    icon: 'user-cog',
    card: {
      title: 'Interim: CAAO, CDO, AI, ESG',
      description: 'Kompetencja w strukturze na czas trwania zmiany.',
    },
  },
];

/**
 * Karty „Pozostałe kompetencje” (D/ESG.dc.html:213-243): wszystkie usługi poza bieżącą, w kolejności
 * kafli, a Szkolenia (link zewnętrzny) na końcu, jak na każdej stronie usługi w designie.
 */
export function otherServices(currentHref: string): Service[] {
  const others = services.filter((service) => service.href !== currentHref);
  return [...others.filter((s) => !s.external), ...others.filter((s) => s.external)];
}
