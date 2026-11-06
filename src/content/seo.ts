// Meta stron (W-07, W-08): title, description, ścieżka i JSON-LD per strona.
// Treść z <head> plików designu (D/*.dc.html l. 6-19); strona B+R z D/Projekty-BR-Ekspercki.dc.html
// (architektura, „Rozstrzygnięcia luk designu”). Adresy absolutne budujemy z PUBLIC_SITE_URL, więc
// zmiana adresu bazowego nie wymaga zmian w kodzie.
import type { PublicEnv } from '../lib/env';
import { company, nav } from './site';

export type JsonLdNode = Record<string, unknown>;

export interface SeoEntry {
  /** Ścieżka strony z ukośnikiem na końcu (`trailingSlash: 'always'`). */
  path: string;
  title: string;
  /** Do 160 znaków (W-07). */
  description: string;
  /** Strona z listy W-01, więc trafia do `sitemap.xml` (W-08). */
  inSitemap: boolean;
  jsonLd: (siteUrl: string) => JsonLdNode[];
}

export const OG_IMAGE = {
  path: '/og/iskt-og.png',
  width: 1200,
  height: 630,
  alt: `${company.brand}: ${company.slogan}`,
} as const;

export const LOGO_PATH = '/icon-512.png';

export const DESCRIPTION_MAX_LENGTH = 160;

/**
 * Limity strony głównej dla podglądów linku w X i LinkedIn (uwaga z O-6): dłuższy tytuł lub opis
 * jest tam ucinany. `<title>` = `og:title`, `meta description` = `og:description` (Seo.astro).
 */
export const HOME_TITLE_MAX_LENGTH = 60;
export const HOME_DESCRIPTION_MAX_LENGTH = 125;

/** Adres absolutny z adresu bazowego (bez ukośnika na końcu) i ścieżki. */
export function absoluteUrl(siteUrl: string, path: string): string {
  return new URL(path, `${siteUrl.replace(/\/+$/, '')}/`).href;
}

function provider(siteUrl: string): JsonLdNode {
  return { '@type': 'ProfessionalService', name: company.name, url: absoluteUrl(siteUrl, '/') };
}

const areaServed = { '@type': 'Country', name: 'Polska' } as const;

/** Okruszki: Start → Kompetencje (`/#kompetencje`, bo `/uslugi/` nie istnieje) → strona. */
function breadcrumb(siteUrl: string, name: string, extra: { name: string; path: string }[] = []) {
  const items = [{ name: 'Start', path: nav.home }, ...extra];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: absoluteUrl(siteUrl, item.path),
      })),
      { '@type': 'ListItem', position: items.length + 1, name },
    ],
  };
}

interface ServicePage {
  path: string;
  title: string;
  description: string;
  serviceName: string;
  breadcrumbName: string;
}

function servicePage(page: ServicePage): SeoEntry {
  return {
    path: page.path,
    title: page.title,
    description: page.description,
    inSitemap: true,
    jsonLd: (siteUrl) => [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: page.serviceName,
        description: page.description,
        serviceType: page.serviceName,
        url: absoluteUrl(siteUrl, page.path),
        provider: provider(siteUrl),
        areaServed,
      },
      breadcrumb(siteUrl, page.breadcrumbName, [{ name: 'Kompetencje', path: nav.competences }]),
    ],
  };
}

// Opis z designu ma 178 znaków; skrócony do 125 dla podglądów w X i LinkedIn (O-6, #44). Zostają
// słowa kluczowe: projekty B+R z finansowaniem, ESG (VSME, CSRD), wdrożenia AI, oprogramowanie,
// interim management, firmy. Lokalizację niesie tytuł i JSON-LD.
const homeDescription =
  'Doradztwo dla firm: projekty B+R z finansowaniem, ESG (VSME, CSRD), wdrożenia AI, oprogramowanie i interim management.';

/** Strony z W-01 (kolejność z D/sitemap.xml) i polityka prywatności (W-06, poza sitemapą). */
export const seoEntries: readonly SeoEntry[] = [
  {
    path: '/',
    title: 'ISKT Greennovation — B+R, ESG, AI i oprogramowanie | Żory',
    description: homeDescription,
    inSitemap: true,
    jsonLd: (siteUrl) => [
      {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: company.name,
        alternateName: 'ISKT',
        url: absoluteUrl(siteUrl, '/'),
        logo: absoluteUrl(siteUrl, LOGO_PATH),
        email: company.email,
        telephone: company.phoneHref.replace(/^tel:/, ''),
        vatID: `PL${company.nip}`,
        slogan: company.slogan,
        description:
          'Doradztwo i wdrożenia dla firm: projekty B+R z finansowaniem, raportowanie ESG, wdrożenia AI, oprogramowanie dedykowane i interim management.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: company.address.street,
          postalCode: company.address.postalCode,
          addressLocality: company.address.city,
          addressRegion: 'śląskie',
          addressCountry: 'PL',
        },
        areaServed,
        knowsLanguage: 'pl',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: company.brand,
        url: absoluteUrl(siteUrl, '/'),
        inLanguage: 'pl-PL',
      },
    ],
  },
  servicePage({
    path: '/uslugi/projekty-br/',
    title: 'Projekty B+R — dotacje i ulga B+R dla firm | ISKT Greennovation',
    description:
      'Prowadzimy projekty badawczo-rozwojowe: kwalifikacja prac B+R, wniosek o dotację, rozliczenie ulgi B+R i dokumentacja odporna na kontrolę.',
    serviceName: 'Projekty B+R i finansowanie badań',
    breadcrumbName: 'Projekty B+R',
  }),
  servicePage({
    path: '/uslugi/esg/',
    title: 'Raportowanie ESG — VSME, CSRD, ślad węglowy | ISKT Greennovation',
    description:
      'Doradztwo ESG dla firm: analiza istotności, zbieranie danych, ślad węglowy, raport w standardzie VSME lub CSRD oraz odpowiedzi na ankiety klientów i banków.',
    serviceName: 'Doradztwo ESG i raportowanie zrównoważonego rozwoju',
    breadcrumbName: 'ESG i zrównoważony rozwój',
  }),
  servicePage({
    path: '/uslugi/ai-transformacja/',
    title: 'Wdrożenia AI w firmie — automatyzacja i AI Act | ISKT Greennovation',
    description:
      'Audyt procesów i danych, wybór przypadków użycia, pilotaż i wdrożenie produkcyjne AI. Zgodność z AI Act i realny pomiar efektu.',
    serviceName: 'Wdrożenia AI i transformacja cyfrowa',
    breadcrumbName: 'AI i transformacja cyfrowa',
  }),
  servicePage({
    path: '/startupy/',
    title: 'Wsparcie startupów — od MVP do finansowania | ISKT Greennovation',
    description:
      'Wsparcie startupów technologicznych: walidacja pomysłu, MVP, model biznesowy, finansowanie i przygotowanie do rozmów z inwestorem.',
    serviceName: 'Wsparcie startupów technologicznych',
    breadcrumbName: 'Wsparcie startupów',
  }),
  servicePage({
    path: '/uslugi/oprogramowanie/',
    title: 'Oprogramowanie dedykowane dla firm | ISKT Greennovation',
    description:
      'Aplikacje i systemy szyte na miarę procesu — standardowa aplikacja w ok. 2 tygodnie, z dokumentacją, testami i bez uzależnienia od dostawcy.',
    serviceName: 'Rozwój oprogramowania dedykowanego',
    breadcrumbName: 'Rozwój oprogramowania',
  }),
  servicePage({
    path: '/uslugi/interim/',
    title: 'Interim manager — CAAO, CDO, AI, ESG | ISKT Greennovation',
    description:
      'Obejmujemy role CAAO, Chief Digital Officer, AI Lead i ESG Manager na czas przejściowy — z mandatem decyzyjnym, od 1 dnia w miesiącu po pełne zaangażowanie.',
    serviceName: 'Interim management: CAAO, CDO, AI, ESG',
    breadcrumbName: 'Interim',
  }),
  {
    path: '/polityka-prywatnosci/',
    title: 'Polityka prywatności | ISKT Greennovation',
    description:
      'Jak ISKT Greennovation Sp. z o.o. przetwarza dane osobowe z formularza kontaktowego: administrator, cel, podstawa prawna, okres przechowywania i Twoje prawa.',
    inSitemap: false,
    jsonLd: (siteUrl) => [breadcrumb(siteUrl, 'Polityka prywatności')],
  },
];

/** Ścieżki stron z W-01, jedyne w `sitemap.xml`. */
export const sitemapPaths: readonly string[] = seoEntries
  .filter((entry) => entry.inSitemap)
  .map((entry) => entry.path);

/** Ścieżka w postaci z ukośnikiem na końcu; `/index.html` i `/x/index.html` jak katalog. */
export function normalizePath(pathname: string): string {
  const withoutIndex = pathname.replace(/index\.html$/, '');
  return withoutIndex.endsWith('/') ? withoutIndex : `${withoutIndex}/`;
}

export function findSeoEntry(pathname: string): SeoEntry | undefined {
  const path = normalizePath(pathname);
  return seoEntries.find((entry) => entry.path === path);
}

/** Czy adres (absolutny albo ścieżka) jest stroną z W-01; filtr `@astrojs/sitemap`. */
export function isSitemapPage(url: string): boolean {
  return sitemapPaths.includes(normalizePath(new URL(url, 'http://localhost').pathname));
}

/**
 * `robots.txt` (W-08): produkcja pozwala indeksować i wskazuje sitemapę; staging i development nie
 * blokują crawlowania (`Disallow: /` ukryłby `noindex` przed robotem), a `noindex` daje nagłówek
 * `X-Robots-Tag` i meta robots.
 */
export function robotsTxt(env: PublicEnv): string {
  const lines = ['User-agent: *', 'Allow: /'];
  if (env.indexable) lines.push('', `Sitemap: ${absoluteUrl(env.siteUrl, '/sitemap.xml')}`);
  return `${lines.join('\n')}\n`;
}
