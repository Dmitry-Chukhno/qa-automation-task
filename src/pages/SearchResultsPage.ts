import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { NotificationBar } from './components/NotificationBar';
import { CartPage } from './CartPage';
import type { ProductSummary } from '../types';

export class SearchResultsPage extends BasePage {
  private readonly notification: NotificationBar;
  private readonly items = this.page.locator('.search-results .product-item');

  constructor(page: Page) {
    super(page);
    this.notification = new NotificationBar(page);
  }

  /** Product tile at the given 1-based DOM position (matches how QA specs naturally describe order). */
  private itemAt(position: number): Locator {
    return this.items.nth(position - 1);
  }

  async getResultsCount(): Promise<number> {
    return this.items.count();
  }

  /** Name + price exactly as displayed for the product at the given 1-based DOM position. */
  async getProductSummaryAt(position: number): Promise<ProductSummary> {
    const item = this.itemAt(position);
    const name = (await item.locator('.product-title a').innerText()).trim();
    const priceText = await item.locator('.price.actual-price').innerText();
    return { name, price: parsePrice(priceText) };
  }

  /**
   * Adds the product at the given 1-based DOM position to the cart via the
   * quick "Add to cart" button, waits for the success notification, and
   * returns the CartPage.
   *
   * Note: not every product on this site can be quick-added this way -
   * "configurable" products (e.g. "Build your own computer", items with a
   * mandatory color/size attribute) redirect to their detail page instead,
   * because required options aren't submitted from the results list. This
   * method surfaces that as a clear error rather than silently following
   * the redirect, so a spec picking such a product fails fast with an
   * actionable message instead of a confusing downstream assertion failure.
   */
  async addToCartAt(position: number): Promise<CartPage> {
    const item = this.itemAt(position);
    const addToCartButton = item.locator('.product-box-add-to-cart-button');

    await addToCartButton.click();

    const navigatedAway = await this.page
      .waitForURL(/\/search/, { timeout: 2_000 })
      .then(() => false)
      .catch(() => true);

    if (navigatedAway) {
      throw new Error(
        `Product at position ${position} could not be quick-added from the search ` +
          'results - it requires selecting required options on its own product page ' +
          '(e.g. size/color/configuration), which this flow does not handle. Pick a ' +
          'search term whose result at this position is a simple, non-configurable product.',
      );
    }

    await this.notification.waitForSuccess();
    return new CartPage(this.page);
  }
}

/** "1,200.00" / "1200.00" -> 1200 (site shows plain numbers, no currency symbol). */
function parsePrice(text: string): number {
  return Number(text.replace(/[^0-9.]/g, ''));
}
