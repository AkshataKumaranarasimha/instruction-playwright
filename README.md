# instruction-playwright

Instruction → UI test agent powered by [Playwright MCP](https://playwright.dev/docs/getting-started-mcp).

Natural-language case files in `instructions/` are explored with Playwright MCP, then turned into modular Playwright code (pages → assertions → flows → thin specs).

## Prerequisites

- Node.js 20+
- Google Chrome (for the Google demo; CI uses Playwright Chromium)
- Cursor with [Playwright MCP](https://playwright.dev/docs/getting-started-mcp) enabled (for agent explore / codegen)

```bash
npm install
npx playwright install chrome    # local Google demo
npx playwright install chromium  # CI / smoke (or both)
cp .env.example .env             # optional — defaults are headless
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

| Skill                 | Use for                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------ |
| `playwright-test-kit` | Create/update tests from `instructions/` (MCP explore → validate → codegen)                |
| `pr-review`           | Review a PR/branch vs main → tests, screenshots, markdown + **PDF** named `PR-<n>-<title>` |

### Create tests

> Follow the playwright-test-kit skill. Use `instructions/google-search-playwright-mcp.md`. Explore with Playwright MCP, validate every step and assertion, then generate or update framework code only.

### Review a PR or branch (vs main)

> Follow the pr-review skill for PR 12. Compare to main, run affected tests, take MCP screenshots, and tell me what to improve.

Review artifacts land in `reports/pr-review/` (gitignored). Checked-in example: [`reports/pr-review/PR-1-Initial-setup.pdf`](reports/pr-review/PR-1-Initial-setup.pdf).

```bash
npm run pr-review:pdf -- reports/pr-review/PR-1-Initial-setup.md
```

## Tests

| Command                           | Purpose                                                             |
| --------------------------------- | ------------------------------------------------------------------- |
| `npm run test:smoke`              | **CI gate** — local smoke app (no captcha)                          |
| `npm run test:google`             | Live demo against Google                                            |
| `npm test`                        | All specs                                                           |
| `npm run typecheck`               | `tsc --noEmit`                                                      |
| `npm run lint`                    | ESLint (TypeScript + Playwright rules)                              |
| `npm run format` / `format:check` | Prettier write / CI check                                           |
| `npm run ci`                      | Same checks as GitHub Actions (`typecheck` + lint + format + smoke) |

```bash
npm run test:smoke
HEADLESS=false npm run test:smoke   # watch the smoke app
npm run test:google                 # demo only — may hit captcha
```

**Demo caveat:** Google may show a captcha / “unusual traffic” interstitial. Prefer `test:smoke` (and CI) as the reliability proof; use Google for the live walkthrough. The fixture can use a persistent Chrome profile under `.auth/` (gitignored) when `USE_PERSISTENT_PROFILE=true`.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on pushes/PRs to `main`:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run format:check`
4. `npm run test:smoke` (Playwright Chromium + local `fixtures/smoke`)

Google is intentionally **not** in CI.

## Layout

```
instructions/          # case files (+ _template.md)
.cursor/skills/        # playwright-test-kit + pr-review
config/env.ts          # typed env (HEADLESS, profile, smoke URL, timeouts)
fixtures/smoke/        # local CI-safe demo app
src/pages/             # page objects (flat: google-*.ts, smoke-*.ts)
src/assertions/        # assertion helpers
src/flows/             # end-to-end flows
src/fixtures/          # Playwright fixtures (+ optional persistent context)
src/core/              # BasePage, tags, shared helpers
data/                  # test data / params
tests/                 # thin specs
.github/workflows/     # CI (typecheck + smoke)
reports/pr-review/     # local review artifacts (mostly ignored)
```
