import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * The site's global "bar-notification" banner - reused for success/error
 * messages on the search results page (add to cart), the product page, and
 * elsewhere. Modeled as a small component object rather than duplicating
 * these locators/waits inside every Page Object that can trigger it.
 */
export class NotificationBar {
  private readonly root: Locator;

  constructor(page: Page) {
    this.root = page.locator('#bar-notification');
  }

  /** Waits for a success notification and returns its message text. */
  async waitForSuccess(): Promise<string> {
    await expect(this.root).toHaveClass(/success/, { timeout: 10_000 });
    return (await this.root.locator('.content').innerText()).trim();
  }
}
