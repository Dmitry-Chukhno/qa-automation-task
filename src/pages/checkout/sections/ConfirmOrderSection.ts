import type { Locator, Page } from '@playwright/test';
import type { OrderConfirmation } from '../../../types';

/** Step 6 of the one-page checkout: "Confirm order" and the resulting "Thank you" screen. */
export class ConfirmOrderSection {
  private readonly confirmButton: Locator;
  private readonly completed: Locator;

  constructor(page: Page) {
    this.confirmButton = page.locator('#opc-confirm_order .confirm-order-next-step-button');
    this.completed = page.locator('.order-completed');
  }

  /** Submits the order and returns the "Thank you" confirmation details. */
  async confirm(): Promise<OrderConfirmation> {
    await this.confirmButton.click();
    await this.completed.waitFor({ state: 'visible' });

    const message = (await this.completed.locator('.title').innerText()).trim();
    const detailsText = await this.completed.locator('.details').innerText();
    const orderNumber = detailsText.match(/Order number:\s*(\d+)/)?.[1] ?? '';

    return { message, orderNumber };
  }
}
