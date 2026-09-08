import { test, expect } from '../src/fixtures/pages.fixture';
import { generateCustomerAddress } from '../src/data/customerDataGenerator';

/**
 * Task 1 - Hybrid cart scenario (demowebshop.tricentis.com).
 *
 * Search term: the task's own example ("computer") is deliberately NOT used
 * here. On this instance, the 2nd search result for "computer" is
 * "Build your own computer" - a configurable product whose catalog list
 * price does not equal its actual price once required options are
 * selected (confirmed while mapping the site: list shows 1200.00, but the
 * cheapest valid configuration adds up to 1265.00 because two of its
 * required attributes default to priced options). That would make step 5
 * ("price in cart matches the search page") fail for reasons unrelated to
 * the scenario under test. "jeans" was chosen instead because its 2nd
 * result ("TBlue Jeans") is a simple product with no required options, so
 * quick "Add to cart" behaves deterministically and price parity is
 * meaningful to assert.
 */
const SEARCH_TERM = 'jeans';
const SEARCH_RESULT_POSITION = 2;

test.describe('Hybrid cart & guest checkout', () => {
  test('search, add 2nd result to cart, verify totals, complete guest checkout', async ({
    homePage,
  }) => {
    // Assigned inside the step below (and always read after that step is
    // awaited) - the definite-assignment assertion tells TS what the
    // runtime `await` already guarantees.
    let expectedSummary!: { name: string; price: number };

    await test.step('1-2. Open the site and search for a product', async () => {
      await homePage.open();
    });

    const searchResultsPage = await homePage.searchForProduct(SEARCH_TERM);

    await test.step('Capture the search result to be added, for later comparison', async () => {
      expect(await searchResultsPage.getResultsCount()).toBeGreaterThanOrEqual(
        SEARCH_RESULT_POSITION,
      );
      expectedSummary = await searchResultsPage.getProductSummaryAt(SEARCH_RESULT_POSITION);
      expect(expectedSummary.name).toBeTruthy();
      expect(expectedSummary.price).toBeGreaterThan(0);
    });

    const cartPage = await test.step('3. Add the 2nd DOM-order result to the cart', async () => {
      return searchResultsPage.addToCartAt(SEARCH_RESULT_POSITION);
    });

    await test.step('4. Mini-cart counter equals 1', async () => {
      await expect
        .poll(() => searchResultsPage.getMiniCartQuantity(), {
          message: 'mini-cart quantity did not reach 1',
        })
        .toBe(1);
    });

    await test.step('5. Cart line item name & price match the search results page', async () => {
      await cartPage.open();
      const lineItem = await cartPage.getLineItemSummary();
      expect(lineItem.name).toBe(expectedSummary.name);
      expect(lineItem.price).toBe(expectedSummary.price);
    });

    await test.step('6. Cart subtotal is correct', async () => {
      expect(await cartPage.getItemCount()).toBe(1);
      const subtotal = await cartPage.getSubtotal();
      expect(subtotal).toBe(expectedSummary.price);
    });

    await test.step('7. Guest checkout with dynamically generated shipping data', async () => {
      const guestLoginPage = await cartPage.proceedToCheckout();
      const checkoutPage = await guestLoginPage.continueAsGuest();

      const address = generateCustomerAddress();
      const confirmation = await checkoutPage.completeGuestCheckout(address);

      expect(confirmation.message).toContain('Your order has been successfully processed');
      expect(confirmation.orderNumber).toMatch(/^\d+$/);
    });
  });
});
