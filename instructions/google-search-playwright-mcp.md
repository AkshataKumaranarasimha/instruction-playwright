# Instruction: Google search for playwright-mcp

## Goal
Open Google, search for `playwright-mcp`, wait until results load, and assert the SERP is correct.

## Steps
1. Navigate to `https://www.google.com`
2. Dismiss cookie consent if present
3. Type `playwright-mcp` into the Search combobox
4. Submit the search (Enter)
5. Wait until the URL contains `q=playwright-mcp`
6. Wait until the "Search Results" heading and at least one result heading are visible

## Assertions
- Page URL matches search query `playwright-mcp`
- Page title contains `playwright-mcp`
- "Search Results" heading is visible
- At least one result (level-3 heading) is present
- Results contain text matching `/playwright mcp/i`
- An official result link is visible (`playwright.dev` or `github.com/microsoft/playwright-mcp`)

## Output
- Spec: `tests/google-search-playwright-mcp.spec.ts`
- Flow: `src/flows/google-search.flow.ts`
- Pages: `src/pages/google-home.page.ts`, `src/pages/google-results.page.ts`
- Assertions: `src/assertions/google.assertions.ts`
