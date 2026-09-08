import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },

  // Reporting: HTML report is always generated; "list" gives readable console
  // output while running. The HTML report bundles traces/screenshots/videos
  // captured on failure, so a failed run's artifacts are just a click away.
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],

  use: {
    actionTimeout: 15_000,
    navigationTimeout: 30_000,

    // Test artifacts on failure only, to keep green runs lightweight.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Two projects because the suite covers two unrelated sites - each spec
  // file only ever runs against the site it targets, and gets that site's
  // baseURL so it can use relative page.goto() calls.
  projects: [
    {
      name: 'demowebshop',
      testMatch: /cart-guest-checkout\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: env.demowebshopBaseUrl },
    },
    {
      name: 'webscraper',
      testMatch: /catalog-analysis\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: env.webscraperBaseUrl },
    },
  ],
});
