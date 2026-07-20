/**
 * Externalized smoke-app search data — keep literals out of specs.
 */
export const smokeSearchData = {
  playwrightMcp: {
    query: 'playwright-mcp',
    expectLink: /playwright mcp|microsoft\/playwright-mcp/i,
  },
} as const;
