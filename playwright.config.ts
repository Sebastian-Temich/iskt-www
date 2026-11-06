import { defineConfig, devices } from '@playwright/test';

// Wersja i liczba workerów z docs/konfiguracja.md (playwright_version, playwright_workers).
// Port serwera testów: E2E_PORT (domyślnie 55327 z bloku portów projektu). Każdy worktree, który
// uruchamia E2E równolegle, ustawia inny port, żeby `reuseExistingServer` nie trafił w cudzy serwer
// (README, „Testy E2E”).
const DEFAULT_PORT = 55327;
const PORT = parsePort(process.env.E2E_PORT);
const baseURL = `http://localhost:${PORT}`;

function parsePort(value: string | undefined): number {
  if (value === undefined || value === '') return DEFAULT_PORT;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`E2E_PORT musi być numerem portu 1-65535, jest: ${value}`);
  }
  return port;
}

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
