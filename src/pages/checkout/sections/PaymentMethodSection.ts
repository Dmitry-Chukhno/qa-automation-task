import type { Locator, Page } from '@playwright/test';

/** Step 4 of the one-page checkout: "Payment method". */
export class PaymentMethodSection {
  private readonly continueButton: Locator;

  constructor(page: Page) {
    this.continueButton = page.locator('#opc-payment_method .payment-method-next-step-button');
  }

  /** Accepts the pre-selected default payment method (e.g. "Cash On Delivery") and continues. */
  async continueWithDefaultOption(): Promise<void> {
    await this.continueButton.click();
  }
}
