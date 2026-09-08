import type { Locator, Page } from '@playwright/test';
import { BillingAddressSection } from './sections/BillingAddressSection';
import { ShippingMethodSection } from './sections/ShippingMethodSection';
import { PaymentMethodSection } from './sections/PaymentMethodSection';
import { ConfirmOrderSection } from './sections/ConfirmOrderSection';
import type { CustomerAddress, OrderConfirmation } from '../../types';

/**
 * demowebshop's checkout is a single page ("/onepagecheckout") that reveals
 * one section at a time as each step is completed, rather than a series of
 * separate pages. Modeling it as one Page Object composed of small Section
 * objects mirrors that reality: each section owns the locators/actions for
 * its own step, while this class orchestrates the sequence and exposes one
 * high-level method for the common path this suite needs.
 *
 * Two steps have no meaningful interaction for a guest with a single
 * address and Cash-on-Delivery selected (both defaults on this site), so
 * they're handled inline here rather than via near-empty section classes:
 *  - Shipping address: the just-entered billing address is auto-selected
 *    as the shipping address ("ship to same address"), nothing to fill in.
 *  - Payment info: Cash on Delivery requires no additional details.
 */
export class CheckoutPage {
  private readonly billingAddress: BillingAddressSection;
  private readonly shippingMethod: ShippingMethodSection;
  private readonly paymentMethod: PaymentMethodSection;
  private readonly confirmOrder: ConfirmOrderSection;

  private readonly shippingAddressContinueButton: Locator;
  private readonly paymentInfoContinueButton: Locator;

  constructor(private readonly page: Page) {
    this.billingAddress = new BillingAddressSection(page);
    this.shippingMethod = new ShippingMethodSection(page);
    this.paymentMethod = new PaymentMethodSection(page);
    this.confirmOrder = new ConfirmOrderSection(page);

    this.shippingAddressContinueButton = page.locator(
      '#opc-shipping .new-address-next-step-button',
    );
    this.paymentInfoContinueButton = page.locator(
      '#opc-payment_info .payment-info-next-step-button',
    );
  }

  async waitUntilLoaded(): Promise<void> {
    await this.page.waitForURL(/\/onepagecheckout/);
  }

  /**
   * Runs the full guest checkout with the given address, accepting every
   * other step's default option (shipping method, payment method, payment
   * info), through to order confirmation.
   */
  async completeGuestCheckout(address: CustomerAddress): Promise<OrderConfirmation> {
    await this.billingAddress.fillAndContinue(address);
    await this.shippingAddressContinueButton.click();
    await this.shippingMethod.continueWithDefaultOption();
    await this.paymentMethod.continueWithDefaultOption();
    await this.paymentInfoContinueButton.click();
    return this.confirmOrder.confirm();
  }
}
