import type { Locator, Page } from '@playwright/test';
import type { CatalogCategory, ScrapedProduct } from '../types';

const CATEGORY_PATHS: Record<CatalogCategory, string> = {
  laptops: '/test-sites/e-commerce/allinone/computers/laptops',
  tablets: '/test-sites/e-commerce/allinone/computers/tablets',
};

/**
 * webscraper.io's "allinone" catalog pages (Task 2). Unlike the paginated
 * "computers"/"phones" test sites, "allinone" renders every product for a
 * category in one page load - no "Load more" button, no infinite scroll -
 * so scraping is a single DOM read with no pagination handling required
 * (confirmed while mapping the site: laptops = 117 cards, tablets = 21,
 * all present on first load).
 *
 * This Page Object only knows how to navigate and read the DOM. Filtering,
 * sorting and the synthetic price-range rule are deliberately NOT here -
 * see `src/catalog/catalogAnalyzer.ts` - so that business logic can be
 * unit-tested without a browser, and the Page Object stays a thin,
 * single-purpose wrapper around the page.
 */
export class CatalogPage {
  private readonly productCards: Locator;

  constructor(private readonly page: Page) {
    this.productCards = page.locator('.card.thumbnail');
  }

  async open(category: CatalogCategory): Promise<void> {
    await this.page.goto(CATEGORY_PATHS[category]);
    // Sanity check the page actually loaded a product grid before scraping,
    // so a broken/slow-loading page fails with a clear message here rather
    // than surfacing as "0 products" downstream.
    await this.productCards.first().waitFor({ state: 'visible' });
  }

  /** Reads title, price, rating, review count and product URL for every product on the page. */
  async scrapeAllProducts(): Promise<ScrapedProduct[]> {
    return this.productCards.evaluateAll((cards) =>
      cards.map((card) => {
        const titleEl = card.querySelector<HTMLAnchorElement>('a.title');
        const priceEl = card.querySelector('[itemprop="price"]');
        const ratingEl = card.querySelector('[data-rating]');
        const reviewCountEl = card.querySelector('[itemprop="reviewCount"]');

        const title = titleEl?.getAttribute('title')?.trim() ?? '';
        const href = titleEl?.getAttribute('href') ?? '';
        const price = Number((priceEl?.textContent ?? '').replace(/[^0-9.]/g, ''));
        const rating = Number(ratingEl?.getAttribute('data-rating') ?? NaN);
        const reviewCount = Number((reviewCountEl?.textContent ?? '').trim());

        return {
          title,
          price,
          rating,
          reviewCount,
          url: href ? new URL(href, window.location.origin).href : '',
        };
      }),
    );
  }
}
