// /robots.txt (W-08), generowany w buildzie zależnie od PUBLIC_SITE_ENV (ADR-002).
import type { APIRoute } from 'astro';
import { robotsTxt } from '../content/seo';
import { parsePublicEnv, runtimeEnv } from '../lib/env';

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(robotsTxt(parsePublicEnv(runtimeEnv())), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
