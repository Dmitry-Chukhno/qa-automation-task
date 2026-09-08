/**
 * Central place for environment-driven configuration.
 * Keeping it here (instead of scattering process.env reads across the
 * codebase) makes it obvious what can be overridden and from where.
 *
 * Two independent base URLs because the suite covers two unrelated sites
 * (Task 1: demowebshop.tricentis.com, Task 2: webscraper.io) - each has
 * its own Playwright "project" in playwright.config.ts so specs can use
 * plain relative `page.goto('/some/path')` calls either way.
 */
export const env = {
  demowebshopBaseUrl: process.env.DEMOWEBSHOP_BASE_URL ?? 'https://demowebshop.tricentis.com',
  webscraperBaseUrl: process.env.WEBSCRAPER_BASE_URL ?? 'https://webscraper.io',
} as const;
