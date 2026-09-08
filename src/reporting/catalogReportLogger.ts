import type {
  CatalogAnalysisStats,
  CatalogCategory,
  ScrapedProduct,
  SyntheticPriceCheck,
} from '../types';

/**
 * Console output for the catalog analysis scenario, isolated from the
 * scraping/analysis logic so the exact wording/format can change without
 * touching either of those.
 */

export function logTopProducts(
  category: CatalogCategory,
  products: readonly ScrapedProduct[],
): void {
  console.log(
    `\n[${category}] Top ${products.length} cheapest product(s) passing the rating/review filter:`,
  );
  products.forEach((p, i) => {
    console.log(
      `  ${i + 1}. Title: ${p.title} | Price: $${p.price.toFixed(2)} | Rating: ${p.rating} | Reviews: ${p.reviewCount} | URL: ${p.url}`,
    );
  });
}

export function logInsufficientResultsWarning(
  category: CatalogCategory,
  actualCount: number,
  expectedLimit: number,
): void {
  console.warn(
    `[${category}] WARNING: only ${actualCount} product(s) passed the rating/review filter ` +
      `(expected up to ${expectedLimit}). Printing all ${actualCount}.`,
  );
}

export function logSyntheticPriceCheckFailure(
  category: CatalogCategory,
  check: SyntheticPriceCheck,
): void {
  const reasons: string[] = [];
  if (check.tooCheap) reasons.push('too cheap');
  if (check.tooExpensive) reasons.push('too expensive');
  console.error(
    `[${category}] Synthetic price rule failed for "${check.product.title}" ` +
      `($${check.product.price.toFixed(2)}): ${reasons.join(' & ')}`,
  );
}

export function logCategoryStatistics(stats: CatalogAnalysisStats): void {
  console.log(`\n[${stats.category}] Summary:`);
  console.log(`  Total products in category:      ${stats.totalProductCount}`);
  console.log(`  Passed rating + review filter:    ${stats.filteredProductCount}`);
  console.log(`  Checked against synthetic rule:   ${stats.checkedCount}`);
  console.log(`  Flagged too cheap:                ${stats.tooCheapCount}`);
  console.log(`  Flagged too expensive:            ${stats.tooExpensiveCount}`);
}
