import { describe, expect, it } from 'vitest';
import { iconNames } from '../components/ui/icon-names';
import { company, nav, services, trainingUrl } from './site';

const W01_SERVICE_URLS = [
  '/uslugi/projekty-br/',
  '/uslugi/esg/',
  '/uslugi/ai-transformacja/',
  '/uslugi/oprogramowanie/',
  '/uslugi/interim/',
  '/startupy/',
];

describe('content/site', () => {
  it('zawiera dane firmy z designu', () => {
    expect(company.name).toBe('ISKT Greennovation Sp. z o.o.');
    expect(company.address).toEqual({ street: 'Wiedeńska 11', postalCode: '44-240', city: 'Żory' });
    expect(company.nip).toBe('6511752112');
    expect(company.email).toBe('biuro@iskt.pl');
    expect(company.phone).toBe('+48 504 083 825');
    expect(company.phoneHref).toBe('tel:+48504083825');
  });

  it('ma nawigację na czyste URL', () => {
    expect(nav).toEqual({ home: '/', competences: '/#kompetencje', contact: '/#kontakt' });
  });

  it('ma 7 usług z kafli: 6 stron z W-01 i Szkolenia jako link zewnętrzny', () => {
    expect(services).toHaveLength(7);
    const internal = services.filter((s) => !s.external).map((s) => s.href);
    expect([...internal].sort()).toEqual([...W01_SERVICE_URLS].sort());
    const training = services.filter((s) => s.external);
    expect(training).toHaveLength(1);
    expect(training[0]).toMatchObject({ title: 'Szkolenia', href: 'https://szkolenia.iskt.pl' });
    expect(trainingUrl).toBe('https://szkolenia.iskt.pl');
  });

  it('każda usługa ma opis i ikonę z listy Lucide', () => {
    for (const service of services) {
      expect(service.description.length, service.title).toBeGreaterThan(0);
      expect(iconNames, service.title).toContain(service.icon);
    }
  });
});
