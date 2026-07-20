---
name: playwright-test-kit
description: >-
  Turns natural-language case instructions into modular Playwright UI tests
  using this repo's pages/assertions/flows/specs layout. Explores with
  Playwright MCP and validates every Step and Assertion against the case file
  before generating code. Use when creating or updating tests from
  instructions/, writing Playwright specs/flows/pages, or using Playwright MCP
  in this project.
---

# Playwright test kit

## When this applies

- User points at `instructions/<case>.md` (or asks to generate a UI test)
- User asks to explore / validate with Playwright MCP
- User asks to add pages, assertions, flows, or specs in this repo

## Workflow (always)

1. **Read the case** — open the target `instructions/<case>.md` (or copy from `instructions/_template.md` if creating a new case).
2. **Explore with Playwright MCP** — navigate and interact using accessibility snapshots; prefer role/name locators.
3. **Validate against the instruction** — before writing or changing code, confirm every Step and every Assertion from the case file in the live MCP session.
4. **Generate framework code only** — map Output paths; reuse existing modules when they fit; keep specs thin.

If a Step or Assertion cannot be observed in MCP, stop inventing locators — update the instruction or report the gap.

## MCP validation checklist

For the case file in play:

- [ ] Each Step ran in order (navigate, dismiss overlays, fill, submit, wait…)
- [ ] Each Assertion is observable (URL, title, role, text, link, count…)
- [ ] Waits match the instruction (URL ready, key heading/result visible)
- [ ] Captcha / blocking interstitial noted if present (do not fake success)

## Framework layout

| Layer | Path | Responsibility |
|-------|------|----------------|
| Case | `instructions/<case>.md` | Goal, Steps, Assertions, Output |
| Data | `data/<domain>.*.ts` | Queries, expected text, flags — not hardcoded in flows when reusable |
| Pages | `src/pages/` | Locators + actions only |
| Assertions | `src/assertions/` | Reusable `expect` helpers |
| Flows | `src/flows/` | Compose pages + assertions into a journey |
| Specs | `tests/` | Thin `test()` that calls a flow |
| Fixtures | `src/fixtures/test.ts` | Shared `test` / page objects / persistent context |

Domain subfolders are fine (`src/pages/google/`, `src/assertions/google/`). Prefer one style per domain; do not duplicate the same page/assertion in two paths.

## Code rules

- Import `test` / `expect` from `src/fixtures/test.ts` in specs (not raw `@playwright/test`), unless extending `src/core/test.base.ts` for steps.
- Specs call **flows** (or step modules that compose pages + assertions). Specs must not wire locators directly.
- Prefer `getByRole` / accessible names from MCP snapshots over brittle CSS.
- Put params in `data/` or flow options; avoid magic strings scattered across layers.
- Comment generated files with the source instruction path, e.g. `Generated from: instructions/foo.md`.
- Do not commit `.auth/`, `.env`, `test-results/`, or browser profile junk.

## New case quick path

1. Copy `instructions/_template.md` → `instructions/<case>.md` and fill Goal / Steps / Assertions / Output.
2. Run MCP explore + validation checklist against that file.
3. Emit/update pages → assertions → flow → data → thin spec.
4. Run: `npx playwright test tests/<case>.spec.ts`

## Example prompt

> Follow the playwright-test-kit skill. Use `instructions/google-search-playwright-mcp.md`. Explore with Playwright MCP, validate every step and assertion, then generate or update framework code only.
