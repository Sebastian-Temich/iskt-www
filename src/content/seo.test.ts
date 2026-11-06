import { describe, expect, it } from 'vitest';
import { parsePublicEnv } from '../lib/env';
import {
  DESCRIPTION_MAX_LENGTH,
  HOME_DESCRIPTION_MAX_LENGTH,
  HOME_TITLE_MAX_LENGTH,
  absoluteUrl,
  findSeoEntry,
  isSitemapPage,
  robotsTxt,
  seoEntries,
  sitemapPaths,
} from './seo';

/** Strony z W-01 (specyfikacja, tabela „Lista stron v1”). */
const W01_PATHS = [
  '/',
  '/uslugi/projekty-br/',
  '/uslugi/esg/',
  '/uslugi/ai-transformacja/',
  '/uslugi/oprogramowanie/',
  '/uslugi/interim/',
  '/startupy/',
];

describe('seoEntries', () => {
  it('ma wpis dla 7 stron z W-01 i polityki prywatności', () => {
    expect(seoEntries.map((entry) => entry.path).sort()).toEqual(
      [...W01_PATHS, '/polityka-prywatnosci/'].sort(),
    );
  });

  it('tytuły są niepuste i unikalne', () => {
    const titles = seoEntries.map((entry) => entry.title);
    for (const title of titles) expect(title.trim()).not.toBe('');
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('opisy są niepuste, unikalne i mają najwyżej 160 znaków', () => {
    const descriptions = seoEntries.map((entry) => entry.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    for (const description of descriptions) {
      expect(description.trim()).not.toBe('');
      expect([...description].length, description).toBeLessThanOrEqual(DESCRIPTION_MAX_LENGTH);
    }
  });

  it('strona główna: tytuł ≤ 60 znaków, opis ≤ 125 znaków (podglądy X i LinkedIn)', () => {
    const home = findSeoEntry('/');
    if (!home) throw new Error('brak wpisu / w seo.ts');
    expect([...home.title].length, home.title).toBeLessThanOrEqual(HOME_TITLE_MAX_LENGTH);
    expect([...home.description].length, home.description).toBeLessThanOrEqual(
      HOME_DESCRIPTION_MAX_LENGTH,
    );
    expect(HOME_TITLE_MAX_LENGTH).toBe(60);
    expect(HOME_DESCRIPTION_MAX_LENGTH).toBe(125);
  });

  it('strona główna: tytuł i opis zachowują słowa kluczowe', () => {
    const home = findSeoEntry('/');
    for (const word of ['ISKT Greennovation', 'B+R', 'ESG', 'AI', 'oprogramowanie', 'Żory']) {
      expect(home?.title).toContain(word);
    }
    for (const word of [
      'firm',
      'projekty B+R',
      'finansowaniem',
      'ESG',
      'VSME',
      'CSRD',
      'wdrożenia AI',
      'oprogramowanie',
      'interim management',
    ]) {
      expect(home?.description).toContain(word);
    }
  });

  it('każda strona ma JSON-LD z adresami z PUBLIC_SITE_URL', () => {
    const siteUrl = 'https://staging.example.com';
    for (const entry of seoEntries) {
      const nodes = entry.jsonLd(siteUrl);
      expect(nodes.length, entry.path).toBeGreaterThan(0);
      for (const node of nodes) expect(node['@context']).toBe('https://schema.org');
      const json = JSON.stringify(nodes);
      expect(json).not.toContain('iskt.pl/');
      expect(json).not.toContain('/uslugi/"');
    }
    const esg = findSeoEntry('/uslugi/esg/')?.jsonLd(siteUrl);
    expect(esg?.[0]).toMatchObject({ '@type': 'Service', url: `${siteUrl}/uslugi/esg/` });
    expect(JSON.stringify(esg?.[1])).toContain(`${siteUrl}/#kompetencje`);
  });
});

describe('findSeoEntry', () => {
  it('znajduje wpis po ścieżce z ukośnikiem, bez niego i z index.html', () => {
    expect(findSeoEntry('/')?.path).toBe('/');
    expect(findSeoEntry('/index.html')?.path).toBe('/');
    expect(findSeoEntry('/uslugi/esg')?.path).toBe('/uslugi/esg/');
    expect(findSeoEntry('/uslugi/esg/index.html')?.path).toBe('/uslugi/esg/');
  });

  it('nie ma wpisu dla 404 i nieznanych ścieżek', () => {
    expect(findSeoEntry('/404/')).toBeUndefined();
    expect(findSeoEntry('/nie-ma/')).toBeUndefined();
  });
});

describe('sitemap', () => {
  it('obejmuje dokładnie strony z W-01', () => {
    expect([...sitemapPaths].sort()).toEqual([...W01_PATHS].sort());
  });

  it('filtr przepuszcza strony W-01, odrzuca 404, API i politykę prywatności', () => {
    expect(isSitemapPage('https://iskt.pl/')).toBe(true);
    expect(isSitemapPage('https://iskt.pl/uslugi/interim/')).toBe(true);
    expect(isSitemapPage('https://iskt.pl/404/')).toBe(false);
    expect(isSitemapPage('https://iskt.pl/api/contact/')).toBe(false);
    expect(isSitemapPage('https://iskt.pl/polityka-prywatnosci/')).toBe(false);
  });
});

describe('absoluteUrl', () => {
  it('skleja adres bazowy ze ścieżką bez podwójnych ukośników', () => {
    expect(absoluteUrl('https://iskt.pl', '/')).toBe('https://iskt.pl/');
    expect(absoluteUrl('https://iskt.pl/', '/og/iskt-og.png')).toBe(
      'https://iskt.pl/og/iskt-og.png',
    );
  });
});

describe('robotsTxt', () => {
  it('produkcja: Allow: / i Sitemap z PUBLIC_SITE_URL', () => {
    const env = parsePublicEnv({
      PUBLIC_SITE_ENV: 'production',
      PUBLIC_SITE_URL: 'https://iskt.pl',
    });
    const robots = robotsTxt(env);
    expect(robots).toMatch(/^User-agent: \*$/m);
    expect(robots).toMatch(/^Allow: \/$/m);
    expect(robots).toMatch(/^Sitemap: https:\/\/iskt\.pl\/sitemap\.xml$/m);
    expect(robots).not.toMatch(/^Disallow:/m);
  });

  it('staging: bez Disallow: / i bez Sitemap', () => {
    const env = parsePublicEnv({
      PUBLIC_SITE_ENV: 'staging',
      PUBLIC_SITE_URL: 'https://iskt-www.vercel.app',
    });
    const robots = robotsTxt(env);
    expect(robots).toMatch(/^User-agent: \*$/m);
    expect(robots).not.toMatch(/^Disallow:/m);
    expect(robots).not.toMatch(/^Sitemap:/m);
  });
});
