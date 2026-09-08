import type { Locator, Page } from '@playwright/test';

/** Step 3 of the one-page checkout: "Shipping method". */
export class ShippingMethodSection {
  private readonly continueButton: Locator;

  constructor(page: Page) {
    this.continueButton = page.locator('#opc-shipping_method .shipping-method-next-step-button');
  }

  /** Accepts the pre-selected default shipping method (e.g. "Ground") and continues. */
  async continueWithDefaultOption(): Promise<void> {
    await this.continueButton.click();
  }
}
