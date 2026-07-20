import { type Page } from '@playwright/test';
import { test } from '../../core/test.base';
import { GoogleHomePage } from '../../pages/google/home.page';
import { GoogleResultsPage } from '../../pages/google/results.page';
import {
  assertOfficialPlaywrightMcpResults,
  assertResultContains,
  assertSearchResultsLoaded,
} from '../../assertions/google/search.assertions';

export type GoogleSearchOptions = {
  query: string;
  expectText?: string | RegExp;
  expectOfficialPlaywrightMcp?: boolean;
};

/**
 * Business-level steps (flows) composed from pages + assertions.
 * Specs should call steps — not wire locators directly.
 */
export async function runGoogleSearch(
  page: Page,
  options: GoogleSearchOptions,
): Promise<GoogleResultsPage> {
  const home = new GoogleHomePage(page);
  const resultsPage = new GoogleResultsPage(page);

  await test.step(`Open Google and search for "${options.query}"`, async () => {
    await home.open();
    await home.search(options.query);
  });

  await test.step('Wait until search results are ready', async () => {
    await resultsPage.waitForResults(options.query);
  });

  const results = await test.step('Assert SERP loaded', async () =>
    assertSearchResultsLoaded(page, options.query),
  );

  if (options.expectText) {
    await test.step('Assert result text', async () => {
      await assertResultContains(results, options.expectText!);
    });
  }

  if (options.expectOfficialPlaywrightMcp) {
    await test.step('Assert official Playwright MCP results', async () => {
      await assertOfficialPlaywrightMcpResults(results);
    });
  }

  return results;
}
