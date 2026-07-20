# playwright-mcp

Instruction → UI test agent powered by [Playwright MCP](https://playwright.dev/docs/getting-started-mcp).

## How it works

1. Copy `instructions/_template.md` → `instructions/<case>.md` and fill Goal / Steps / Assertions / Output
2. Agent follows `.cursor/skills/playwright-test-kit/SKILL.md`
3. Agent explores the UI with Playwright MCP and **validates every Step + Assertion** against the case file
4. Generates modular Playwright code:
   - **pages** — locators + actions
   - **assertions** — reusable expects
   - **flows** — composed journeys
   - **tests** — thin specs
   - **data** — reusable params (optional)

## First case

`instructions/google-search-playwright-mcp.md` → search Google for `playwright-mcp` with waits and assertions.

```bash
npm test
# or
npx playwright test tests/google-search-playwright-mcp.spec.ts
```

## Agent prompt example

> Follow the playwright-test-kit skill. Use `instructions/google-search-playwright-mcp.md`. Explore with Playwright MCP, validate every step and assertion, then generate or update framework code only.

## Layout

```
instructions/          # case files (+ _template.md)
.cursor/skills/        # playwright-test-kit skill (framework + MCP rules)
src/pages/             # page objects
src/assertions/        # assertion helpers
src/flows/             # end-to-end flows
src/fixtures/          # Playwright fixtures
data/                  # test data / params
tests/                 # specs
```
