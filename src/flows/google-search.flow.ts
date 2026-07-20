import { type Page } from '@playwright/test';
import { GoogleHomePage } from '../pages/google-home.page';
import { GoogleResultsPage } from '../pages/google-results.page';
import {
  assertOfficialPlaywrightMcpResults,
  assertResultContains,
  assertSearchResultsLoaded,
} from '../assertions/google.assertions';

export type GoogleSearchOptions = {
  query: string;
  /** Substring/regex that must appear in results body */
  expectText?: string | RegExp;
  /** Assert known official Playwright MCP result links */
  expectOfficialPlaywrightMcp?: boolean;
};

/**
 * End-to-end Google search flow composed from page objects + assertions.
 */
export async function runGoogleSearch(
  page: Page,
  options: GoogleSearchOptions,
): Promise<GoogleResultsPage> {
  const home = new GoogleHomePage(page);
  await home.open();
  await home.search(options.query);

  const resultsPage = new GoogleResultsPage(page);
  await resultsPage.waitForResults(options.query);

  const results = await assertSearchResultsLoaded(page, options.query);

  if (options.expectText) {
    await assertResultContains(results, options.expectText);
  }

  if (options.expectOfficialPlaywrightMcp) {
    await assertOfficialPlaywrightMcpResults(results);
  }

  return results;
}
