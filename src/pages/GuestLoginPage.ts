import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CheckoutPage } from './checkout/CheckoutPage';

/**
 * The "Welcome, Please Sign In!" page the site redirects to when an
 * unauthenticated shopper clicks Checkout. Its only job in this flow is
 * offering the "Checkout as Guest" escape hatch.
 */
export class GuestLoginPage extends BasePage {
  private readonly checkoutAsGuestButton = this.page.locator('.checkout-as-guest-button');

  constructor(page: Page) {
    super(page);
  }

  async continueAsGuest(): Promise<CheckoutPage> {
    await this.checkoutAsGuestButton.click();
    const checkout = new CheckoutPage(this.page);
    await checkout.waitUntilLoaded();
    return checkout;
  }
}
