# Instruction: smoke-search

## Goal

Search the local smoke app for `playwright-mcp` and assert official-style results appear (CI-safe, no captcha).

## Preconditions (optional)

- URL: `http://127.0.0.1:4173/` (started by Playwright `webServer`)
- Auth / profile: none
- Test data: `data/smoke.search.data.ts`

## Steps

1. Open the smoke home page
2. Fill the Search searchbox with `playwright-mcp`
3. Submit Search
4. Wait for the Results region to become visible

## Assertions

- URL contains `q=playwright-mcp`
- Page title includes `playwright-mcp`
- A Results heading is visible
- A link named like Playwright MCP / microsoft/playwright-mcp is visible

## Output

- Spec: `tests/smoke-search.spec.ts`
- Flow: `src/flows/smoke-search.flow.ts`
- Pages: `src/pages/smoke-home.page.ts`
- Assertions: `src/assertions/smoke.assertions.ts`
- Data (optional): `data/smoke.search.data.ts`
