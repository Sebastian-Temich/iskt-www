/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// getViteConfig pozwala testom renderować komponenty .astro przez Container API.
export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
