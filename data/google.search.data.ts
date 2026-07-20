/**
 * Externalized test data — keep literals out of specs.
 */
export const googleSearchData = {
  playwrightMcp: {
    query: 'playwright-mcp',
    expectText: /playwright mcp/i,
    expectOfficialPlaywrightMcp: true,
  },
} as const;
