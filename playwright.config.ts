import { defineConfig } from '@playwright/test';

const PORT = 4399;
const isCI = Boolean(process.env.CI);

// WHY: fonts render differently on Windows/macOS and Linux, so screenshots are compared
// only in CI (ubuntu-latest). Locally the scenarios run without comparison.
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  snapshotPathTemplate: '{testDir}/visual/__screenshots__/{projectName}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  ignoreSnapshots: !isCI && !process.env.VISUAL_COMPARE,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mobile-390',
      testMatch: 'visual/**/*.spec.ts',
      use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, hasTouch: true },
    },
    {
      name: 'tablet-768',
      testMatch: 'visual/**/*.spec.ts',
      use: { browserName: 'chromium', viewport: { width: 768, height: 1024 } },
    },
    {
      name: 'laptop-1024',
      testMatch: 'visual/**/*.spec.ts',
      use: { browserName: 'chromium', viewport: { width: 1024, height: 768 } },
    },
    {
      name: 'desktop-1440',
      testMatch: 'visual/**/*.spec.ts',
      use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'e2e',
      testMatch: 'e2e/**/*.spec.ts',
      use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: `bunx astro build && node scripts/build-cv.mjs && bunx astro preview --ignore-lock --host 127.0.0.1 --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !isCI,
    timeout: 240_000,
  },
});
