import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { GuestLoginPage } from './GuestLoginPage';
import type { ProductSummary } from '../types';

export class CartPage extends BasePage {
  private readonly row = this.page.locator('.cart-item-row');
  private readonly termsCheckbox = this.page.locator('#termsofservice');
  private readonly checkoutButton = this.page.locator('#checkout');
  // The totals table reuses the same ".product-price" class for Sub-Total,
  // Shipping, Tax and Total, so each figure has to be picked out by its
  // row label rather than by class alone.
  private readonly subtotalPrice = this.page
    .locator('tr', { hasText: 'Sub-Total' })
    .locator('.product-price');

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.page.goto('/cart');
  }

  /** Name + line price for a single-item cart's product row (index defaults to the first/only row). */
  async getLineItemSummary(index = 0): Promise<ProductSummary> {
    const row = this.row.nth(index);
    const name = (await row.locator('.product-name').innerText()).trim();
    const priceText = await row.locator('.unit-price .product-unit-price').innerText();
    return { name, price: parsePrice(priceText) };
  }

  async getItemCount(): Promise<number> {
    return this.row.count();
  }

  /** "Sub-Total" line from the order totals summary. */
  async getSubtotal(): Promise<number> {
    return parsePrice(await this.subtotalPrice.innerText());
  }

  /** Accepts the Terms of Service and proceeds to checkout, landing on the guest/login prompt. */
  async proceedToCheckout(): Promise<GuestLoginPage> {
    await this.termsCheckbox.check();
    await this.checkoutButton.click();
    return new GuestLoginPage(this.page);
  }
}

function parsePrice(text: string): number {
  return Number(text.replace(/[^0-9.]/g, ''));
}
