import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import SiteHeader from './SiteHeader.astro';

async function render(path: string, props: Record<string, unknown> = {}) {
  const container = await AstroContainer.create();
  return container.renderToString(SiteHeader, {
    props,
    request: new Request(`https://iskt.pl${path}`),
  });
}

function competencesLink(html: string): string {
  const match = html.match(/<a[^>]*href="\/#kompetencje"[^>]*>/);
  if (!match) throw new Error('Brak linku Kompetencje w nagłówku');
  return match[0];
}

describe('SiteHeader', () => {
  it('na stronie usługi z activeSection="kompetencje" oznacza „Kompetencje” jako aktywne', async () => {
    const html = await render('/uslugi/esg/', { variant: 'page', activeSection: 'kompetencje' });
    const link = competencesLink(html);
    expect(link).toContain('aria-current="true"');
    expect(link).toContain('site-nav__link--active');
    expect(html).not.toContain('aria-current="page"');
  });

  it('bez activeSection „Kompetencje” nie jest aktywne', async () => {
    const html = await render('/uslugi/esg/', { variant: 'page' });
    const link = competencesLink(html);
    expect(link).not.toContain('aria-current');
    expect(link).not.toContain('site-nav__link--active');
  });

  it('na / link logo ma aria-current="page" i wariant home', async () => {
    const html = await render('/', { variant: 'home' });
    expect(html).toMatch(/<a[^>]*href="\/"[^>]*aria-current="page"/);
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    expect(html).toContain('site-header--home');
  });

  it('CTA „Umów konsultację” to pojedynczy <a> do /#kontakt, bez zagnieżdżonego <button>', async () => {
    const html = await render('/uslugi/esg/');
    expect(html).toMatch(/<a[^>]*href="\/#kontakt"[^>]*>\s*Umów konsultację\s*<\/a>/);
    expect(html).not.toContain('<button');
  });
});
