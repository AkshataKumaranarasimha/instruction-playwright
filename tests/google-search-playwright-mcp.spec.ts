import { test } from '../src/fixtures/test';
import { runGoogleSearch } from '../src/flows/google-search.flow';

/**
 * Generated from: instructions/google-search-playwright-mcp.md
 * Explored with Playwright MCP before coding locators/assertions.
 */
test.describe('Google search — playwright-mcp', () => {
  test('opens Google, searches playwright-mcp, waits for results, and asserts SERP', async ({
    page,
  }) => {
    await runGoogleSearch(page, {
      query: 'playwright-mcp',
      expectText: /playwright mcp/i,
      expectOfficialPlaywrightMcp: true,
    });
  });
});
