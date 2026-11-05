import { defineConfig, devices } from '@playwright/test';

// Wersja i liczba workerów z docs/konfiguracja.md (playwright_version, playwright_workers).
const PORT = 55327;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    headless: true,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: `pnpm build && pnpm preview --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    // Adapter Node: `astro preview` z endpointem /api/contact (astro.config.mjs). PUBLIC_SITE_URL to
    // adres serwera testów, bo endpoint przyjmuje tylko Origin = PUBLIC_SITE_URL.
    env: { MAIL_TRANSPORT: 'mock', ASTRO_ADAPTER: 'node', PUBLIC_SITE_URL: baseURL },
  },
});
