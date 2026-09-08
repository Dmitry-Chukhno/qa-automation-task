import type { Page } from '@playwright/test';

/**
 * Common building block for every Page Object: holds the Playwright `Page`
 * and any behaviour that's genuinely shared across pages (currently the
 * mini-cart indicator in the header, present on every page of the site).
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  /** Text of the mini-cart quantity indicator in the header, e.g. "(1)". */
  async getMiniCartQuantityText(): Promise<string> {
    return this.page.locator('#topcartlink .cart-qty').innerText();
  }

  /** Numeric quantity currently shown in the mini-cart, e.g. 1. */
  async getMiniCartQuantity(): Promise<number> {
    const text = await this.getMiniCartQuantityText(); // "(1)"
    const match = text.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }
}
