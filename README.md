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

## Agents

| Skill | Use for |
|-------|---------|
| `playwright-test-kit` | Create/update tests from `instructions/` (MCP explore → validate → codegen) |
| `pr-review` | Review a PR/branch vs main → tests, screenshots, markdown + **PDF** named `PR-<n>-<title>` |

### Create tests

> Follow the playwright-test-kit skill. Use `instructions/google-search-playwright-mcp.md`. Explore with Playwright MCP, validate every step and assertion, then generate or update framework code only.

### Review a PR or branch (vs main)

> Follow the pr-review skill for PR 12. Compare to main, run affected tests, take MCP screenshots, and tell me what to improve.

> Follow the pr-review skill for branch `initial-setup` vs `main`. Run tests and give screenshot feedback.

Review artifacts land in `reports/pr-review/` (gitignored). Checked-in example: [`reports/pr-review/PR-1-Initial-setup.pdf`](reports/pr-review/PR-1-Initial-setup.pdf).

```bash
node scripts/pr-review-to-pdf.mjs reports/pr-review/PR-1-Initial-setup.md
```

## First case

`instructions/google-search-playwright-mcp.md` → search Google for `playwright-mcp` with waits and assertions.

```bash
npm test
# or
npx playwright test tests/google-search-playwright-mcp.spec.ts
```

## Layout

```
instructions/          # case files (+ _template.md)
.cursor/skills/        # playwright-test-kit + pr-review
src/pages/             # page objects
src/assertions/        # assertion helpers
src/flows/             # end-to-end flows
src/fixtures/          # Playwright fixtures
data/                  # test data / params
tests/                 # specs
reports/pr-review/     # local review screenshots + notes (ignored)
```
