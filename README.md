# instruction-playwright

Instruction → UI test agent powered by [Playwright MCP](https://playwright.dev/docs/getting-started-mcp).

Natural-language case files in `instructions/` are explored with Playwright MCP, then turned into modular Playwright code (pages → assertions → flows → thin specs).

## Prerequisites

- Node.js 20+
- Google Chrome (tests use `channel: 'chrome'`)
- Cursor with [Playwright MCP](https://playwright.dev/docs/getting-started-mcp) enabled (for agent explore / codegen)

```bash
npm install
npx playwright install chrome
cp .env.example .env   # optional — defaults are headless + Google
```

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

## Agents

| Skill | Use for |
|-------|---------|
| `playwright-test-kit` | Create/update tests from `instructions/` (MCP explore → validate → codegen) |
| `pr-review` | Review a PR/branch vs main → tests, screenshots, markdown + **PDF** named `PR-<n>-<title>` |

### Create tests

> Follow the playwright-test-kit skill. Use `instructions/google-search-playwright-mcp.md`. Explore with Playwright MCP, validate every step and assertion, then generate or update framework code only.

### Review a PR or branch (vs main)

> Follow the pr-review skill for PR 12. Compare to main, run affected tests, take MCP screenshots, and tell me what to improve.

Review artifacts land in `reports/pr-review/` (gitignored). Checked-in example: [`reports/pr-review/PR-1-Initial-setup.pdf`](reports/pr-review/PR-1-Initial-setup.pdf).

```bash
npm run pr-review:pdf -- reports/pr-review/PR-1-Initial-setup.md
```

## First case (demo)

`instructions/google-search-playwright-mcp.md` → search Google for `playwright-mcp` with waits and SERP assertions.

```bash
npm test
# or
npm run test:google

# Watch the browser
HEADLESS=false npm test

# Typecheck
npm run typecheck
```

**Demo caveat:** Google may show a captcha / “unusual traffic” interstitial. The fixture uses a persistent Chrome profile under `.auth/` (gitignored) to reduce that. If a live run is blocked, use a previously green HTML report (`npm run report`) rather than inventing a pass.

## Layout

```
instructions/          # case files (+ _template.md)
.cursor/skills/        # playwright-test-kit + pr-review
config/env.ts          # typed env (HEADLESS, profile, timeouts)
src/pages/             # page objects (flat: google-home.page.ts)
src/assertions/        # assertion helpers
src/flows/             # end-to-end flows
src/fixtures/          # Playwright fixtures + persistent context
src/core/              # BasePage, tags, shared helpers
data/                  # test data / params
tests/                 # thin specs
reports/pr-review/     # local review artifacts (mostly ignored)
```
