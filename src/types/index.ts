/** A product as summarized in a listing (search results, cart row, etc.). */
export interface ProductSummary {
  name: string;
  /** Parsed numeric price, e.g. 1.00 (site displays plain numbers, no currency symbol). */
  price: number;
}

/** Guest checkout billing/shipping address data. */
export interface CustomerAddress {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  country: string;
  state: string;
  city: string;
  address1: string;
  zipPostalCode: string;
  phoneNumber: string;
}

/** Result of successfully completing the guest checkout flow. */
export interface OrderConfirmation {
  message: string;
  orderNumber: string;
}

/** The two webscraper.io "allinone" catalog categories in scope for Task 2. */
export type CatalogCategory = 'laptops' | 'tablets';

/** A single product as scraped from a webscraper.io catalog listing page. */
export interface ScrapedProduct {
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  url: string;
}

/** Inclusive min/max price bounds of an (unfiltered) product list. */
export interface PriceRange {
  min: number;
  max: number;
}

/** Outcome of checking one product's price against the synthetic min/max-based rule. */
export interface SyntheticPriceCheck {
  product: ScrapedProduct;
  tooCheap: boolean;
  tooExpensive: boolean;
}

/** Aggregate counters reported for one category's catalog analysis run. */
export interface CatalogAnalysisStats {
  category: CatalogCategory;
  totalProductCount: number;
  filteredProductCount: number;
  checkedCount: number;
  tooCheapCount: number;
  tooExpensiveCount: number;
}
