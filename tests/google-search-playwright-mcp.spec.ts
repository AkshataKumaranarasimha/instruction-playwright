import { test } from '../src/fixtures/test';
import { runGoogleSearch } from '../src/flows/google-search.flow';
import { googleSearchData } from '../data/google.search.data';

/**
 * Generated from: instructions/google-search-playwright-mcp.md
 * Explored with Playwright MCP before coding locators/assertions.
 */
test.describe('Google search — playwright-mcp', () => {
  test('opens Google, searches playwright-mcp, waits for results, and asserts SERP', async ({
    page,
  }) => {
    await runGoogleSearch(page, { ...googleSearchData.playwrightMcp });
  });
});
