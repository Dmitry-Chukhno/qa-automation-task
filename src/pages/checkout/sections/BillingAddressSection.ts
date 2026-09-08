import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { CustomerAddress } from '../../../types';

/** Step 1 of the one-page checkout: "Billing address". */
export class BillingAddressSection {
  private readonly root: Locator;
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly email: Locator;
  private readonly country: Locator;
  private readonly state: Locator;
  private readonly city: Locator;
  private readonly address1: Locator;
  private readonly zipPostalCode: Locator;
  private readonly phoneNumber: Locator;
  private readonly continueButton: Locator;

  constructor(page: Page) {
    this.root = page.locator('#opc-billing');
    this.firstName = this.root.locator('#BillingNewAddress_FirstName');
    this.lastName = this.root.locator('#BillingNewAddress_LastName');
    this.email = this.root.locator('#BillingNewAddress_Email');
    this.country = this.root.locator('#BillingNewAddress_CountryId');
    this.state = this.root.locator('#BillingNewAddress_StateProvinceId');
    this.city = this.root.locator('#BillingNewAddress_City');
    this.address1 = this.root.locator('#BillingNewAddress_Address1');
    this.zipPostalCode = this.root.locator('#BillingNewAddress_ZipPostalCode');
    this.phoneNumber = this.root.locator('#BillingNewAddress_PhoneNumber');
    this.continueButton = this.root.locator('.new-address-next-step-button');
  }

  async fillAndContinue(address: CustomerAddress): Promise<void> {
    await this.firstName.fill(address.firstName);
    await this.lastName.fill(address.lastName);
    await this.email.fill(address.email);

    // Selecting the country triggers an async call that populates the State
    // dropdown - it must resolve before a state can be selected.
    await this.country.selectOption({ label: address.country });
    await expect(this.state.locator(`option`, { hasText: address.state })).toHaveCount(1);
    await this.state.selectOption({ label: address.state });

    await this.city.fill(address.city);
    await this.address1.fill(address.address1);
    await this.zipPostalCode.fill(address.zipPostalCode);
    await this.phoneNumber.fill(address.phoneNumber);

    await this.continueButton.click();
  }
}
