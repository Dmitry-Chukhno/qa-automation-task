import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CatalogPage } from '../pages/CatalogPage';

/**
 * Extends Playwright's base `test` with ready-to-use Page Object fixtures,
 * following Playwright's own recommended "Page Object Models as fixtures"
 * pattern (https://playwright.dev/docs/pom). Specs only need to import
 * `test`/`expect` from this file instead of instantiating Page Objects by
 * hand.
 */
export const test = base.extend<{ homePage: HomePage; catalogPage: CatalogPage }>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
});

export { expect } from '@playwright/test';
