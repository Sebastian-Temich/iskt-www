// Lighthouse CI (W-10, #15): 7 stron z W-01, profile mobile i desktop, asercje ≥ 0.9 dla
// performance, accessibility, best-practices i seo.
//
// Uruchomienie: `pnpm lh:staging https://iskt-www.vercel.app` (adres stagingu w docs/decyzje.md).
// Skrypt wywołuje `lhci collect` i `lhci assert` raz na profil (LH_PRESET=mobile|desktop) i wypisuje
// tabelę wyników (mediana z LH_RUNS przebiegów, domyślnie 3). Na stagingu (LH_ENV inne niż
// `production`) audyt `is-crawlable` jest wyłączony, bo staging ma zamierzone `noindex` (W-08).
// Chrome: z Playwright (`pnpm exec playwright install chromium`), chyba że podano CHROME_PATH.
/* eslint-disable @typescript-eslint/no-require-imports */
const { spawnSync } = require('node:child_process');
const { existsSync, mkdirSync, readFileSync, rmSync } = require('node:fs');
const path = require('node:path');

const PAGES = [
  '/',
  '/uslugi/projekty-br/',
  '/uslugi/esg/',
  '/uslugi/ai-transformacja/',
  '/uslugi/oprogramowanie/',
  '/uslugi/interim/',
  '/startupy/',
];
const PRESETS = ['mobile', 'desktop'];
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
const MIN_SCORE = 0.9;

const baseUrl = (process.env.LH_BASE_URL || 'http://localhost:55327').replace(/\/+$/, '');
const preset = process.env.LH_PRESET === 'desktop' ? 'desktop' : 'mobile';
const staging = process.env.LH_ENV !== 'production';
const runs = Number(process.env.LH_RUNS || 3);
const outputDir = path.join(__dirname, 'test-results', 'lighthouse', preset);

function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  try {
    return require('@playwright/test').chromium.executablePath();
  } catch {
    return undefined;
  }
}

module.exports = {
  ci: {
    collect: {
      url: PAGES.map((page) => `${baseUrl}${page}`),
      numberOfRuns: runs,
      chromePath: chromePath(),
      settings: {
        ...(preset === 'desktop' ? { preset: 'desktop' } : {}),
        ...(staging ? { skipAudits: ['is-crawlable'] } : {}),
        chromeFlags: '--headless=new --no-sandbox',
      },
    },
    assert: {
      assertions: Object.fromEntries(
        CATEGORIES.map((category) => [
          `categories:${category}`,
          ['error', { minScore: MIN_SCORE, aggregationMethod: 'median-run' }],
        ]),
      ),
    },
    upload: { target: 'filesystem', outputDir },
  },
};

/** Tabela wyników z manifestu `lhci upload --target=filesystem` (reprezentatywny przebieg). */
function summary(dir) {
  const manifestPath = path.join(dir, 'manifest.json');
  if (!existsSync(manifestPath)) return [];
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  return manifest
    .filter((entry) => entry.isRepresentativeRun)
    .map((entry) => ({
      url: new URL(entry.url).pathname,
      scores: CATEGORIES.map((category) => Math.round((entry.summary[category] ?? 0) * 100)),
    }))
    .sort((a, b) => PAGES.indexOf(a.url) - PAGES.indexOf(b.url));
}

// Katalog roboczy lhci (`.lighthouseci/`) w test-results/, ignorowanym przez git, ESLint i Prettier.
const workDir = path.join(__dirname, 'test-results', 'lighthouse');

function lhci(command, env) {
  const result = spawnSync('pnpm', ['exec', 'lhci', command, `--config=${__filename}`], {
    cwd: workDir,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
  return result.status ?? 1;
}

function main() {
  const target = process.argv[2] || process.env.LH_BASE_URL;
  if (!target) {
    console.error('Użycie: pnpm lh:staging <adres stagingu>, np. https://iskt-www.vercel.app');
    process.exit(2);
  }
  let failed = false;
  const rows = [];
  mkdirSync(workDir, { recursive: true });
  for (const name of PRESETS) {
    const env = { LH_BASE_URL: target, LH_PRESET: name };
    rmSync(path.join(workDir, '.lighthouseci'), { recursive: true, force: true });
    rmSync(path.join(workDir, name), { recursive: true, force: true });
    if (lhci('collect', env) !== 0) process.exit(1);
    if (lhci('assert', env) !== 0) failed = true;
    lhci('upload', env);
    for (const row of summary(path.join(workDir, name))) {
      rows.push(`| ${row.url} | ${name} | ${row.scores.join(' | ')} |`);
    }
  }
  console.log(
    `\nLighthouse ${target} (mediana z ${runs} przebiegów, is-crawlable pominięty: ${staging})`,
  );
  console.log(`| Strona | Profil | ${CATEGORIES.join(' | ')} |`);
  console.log(`|---|---|${CATEGORIES.map(() => '---').join('|')}|`);
  for (const row of rows) console.log(row);
  process.exit(failed ? 1 : 0);
}

if (require.main === module) main();
