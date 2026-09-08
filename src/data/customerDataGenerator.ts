import { faker } from '@faker-js/faker';
import type { CustomerAddress } from '../types';

/**
 * Builds a fresh, realistic customer address on every call.
 *
 * Used for the Guest Checkout step so each test run submits unique,
 * dynamically generated shipping data (per task requirement) instead of a
 * hardcoded fixture - this also avoids collisions/order-history buildup
 * when the suite runs repeatedly against the shared demo instance.
 *
 * `country`/`state` are fixed to "United States" / "New York" on purpose:
 * demowebshop.tricentis.com only reveals its State/Province dropdown after
 * a country is chosen (loaded asynchronously), so we generate a realistic
 * address for a country we know exposes a state list, rather than trying to
 * fake a country/state pairing that may not exist in the site's own list.
 */
export function generateCustomerAddress(): CustomerAddress {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    country: 'United States',
    state: 'New York',
    city: faker.location.city(),
    address1: faker.location.streetAddress(),
    zipPostalCode: faker.location.zipCode('#####'),
    phoneNumber: faker.string.numeric(10),
  };
}
