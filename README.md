# playwright-mcp

Instruction → UI test agent powered by [Playwright MCP](https://playwright.dev/docs/getting-started-mcp).

## How it works

1. Write natural-language steps in `instructions/`
2. Agent explores the UI with Playwright MCP
3. Generates modular Playwright code:
   - **pages** — locators + actions
   - **assertions** — reusable expects
   - **flows** — composed journeys
   - **tests** — thin specs

## First case

`instructions/google-search-playwright-mcp.md` → search Google for `playwright-mcp` with waits and assertions.

```bash
npm test
# or
npx playwright test tests/google-search-playwright-mcp.spec.ts
```

## Layout

```
instructions/          # human instructions for the agent
src/pages/             # page objects
src/assertions/        # assertion helpers
src/flows/             # end-to-end flows
src/fixtures/          # Playwright fixtures
tests/                 # specs
.cursor/skills/        # Cursor agent skill
```
