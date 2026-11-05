// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Strony statyczne (SSG); jedyny kod serwerowy to endpoint z `prerender = false` (ADR-002).
// Region funkcji (fra1) i nagłówki są w vercel.json.
export default defineConfig({
  site: 'https://iskt.pl',
  output: 'static',
  trailingSlash: 'always',
  adapter: vercel(),
  server: { port: 55326 },
});
