import type { PriceRange, ScrapedProduct, SyntheticPriceCheck } from '../types';

/**
 * Pure, browser-free functions over already-scraped product data.
 *
 * Kept separate from CatalogPage on purpose: this logic (filtering,
 * sorting, the synthetic price rule) is business logic, not page
 * interaction, so it can be reasoned about and unit-tested in isolation
 * from Playwright/a live page.
 */

export interface RatingReviewThreshold {
  minRating: number;
  minReviews: number;
}

export function filterByRatingAndReviews(
  products: readonly ScrapedProduct[],
  { minRating, minReviews }: RatingReviewThreshold,
): ScrapedProduct[] {
  return products.filter((p) => p.rating >= minRating && p.reviewCount >= minReviews);
}

/** Returns a new array sorted by price ascending; does not mutate the input. */
export function sortByPriceAscending(products: readonly ScrapedProduct[]): ScrapedProduct[] {
  return [...products].sort((a, b) => a.price - b.price);
}

export function takeCheapest(
  productsSortedByPriceAscending: readonly ScrapedProduct[],
  limit: number,
): ScrapedProduct[] {
  return productsSortedByPriceAscending.slice(0, limit);
}

/** Min/max price across a product list. Intended to be called on the FULL, unfiltered list. */
export function getPriceRange(products: readonly ScrapedProduct[]): PriceRange {
  if (products.length === 0) {
    throw new Error('getPriceRange() requires at least one product.');
  }
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export interface SyntheticPriceRuleOptions {
  /** A product is "too cheap" when price <= range.min * lowerMultiplier. */
  lowerMultiplier: number;
  /** A product is "too expensive" when price >= range.max * upperMultiplier. */
  upperMultiplier: number;
}

/**
 * Task 2's synthetic sanity rule: relative to the min/max price of the
 * FULL, unfiltered catalog, a shortlisted product is flagged if
 * `price <= min * lowerMultiplier` ("too cheap" to be plausible for a
 * rating/review-filtered pick) or `price >= max * upperMultiplier`
 * ("too expensive" relative to the category's ceiling).
 */
export function evaluateSyntheticPriceRule(
  product: ScrapedProduct,
  range: PriceRange,
  { lowerMultiplier, upperMultiplier }: SyntheticPriceRuleOptions,
): SyntheticPriceCheck {
  return {
    product,
    tooCheap: !(product.price > range.min * lowerMultiplier),
    tooExpensive: !(product.price < range.max * upperMultiplier),
  };
}
