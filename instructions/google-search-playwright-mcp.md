# Instruction: google-search-playwright-mcp

## Goal

Open Google, search for `playwright-mcp`, wait until results load, and assert the SERP is correct.

## Preconditions (optional)

- URL: `https://www.google.com`
- Auth / profile: persistent Chrome profile under `.auth/chrome-profile` (via fixtures)
- Test data: `data/google.search.data.ts` (query / expectText / official-link flag)

## Steps

1. Navigate to `https://www.google.com`
2. Dismiss cookie consent if present
3. Type `playwright-mcp` into the Search combobox
4. Submit the search (Enter)
5. Wait until the URL contains `q=playwright-mcp`
6. Wait until results are ready (result headings or search results region visible)

## Assertions

- Page URL matches search query `playwright-mcp`
- Page title contains `playwright-mcp`
- At least one result heading is present
- Results contain text matching `/playwright mcp/i`
- An official result link is visible (`playwright.dev` or `github.com/microsoft/playwright-mcp`)
- No captcha / unusual-traffic interstitial

## Output

- Spec: `tests/google-search-playwright-mcp.spec.ts`
- Flow: `src/flows/google-search.flow.ts`
- Pages: `src/pages/google-home.page.ts`, `src/pages/google-results.page.ts`
- Assertions: `src/assertions/google.assertions.ts`
- Data (optional): `data/google.search.data.ts`
