import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { SearchResultsPage } from './SearchResultsPage';

export class HomePage extends BasePage {
  private readonly searchInput = this.page.locator('#small-searchterms');
  private readonly searchButton = this.page.locator('.search-box-button');

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  /** Searches by product name via the header search box and returns the results page. */
  async searchForProduct(term: string): Promise<SearchResultsPage> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
    return new SearchResultsPage(this.page);
  }
}
