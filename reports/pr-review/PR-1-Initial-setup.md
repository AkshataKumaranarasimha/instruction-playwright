# PR review: Initial setup

## Scope
- Head: `initial-setup`
- Base: `main`
- Compare: `origin/main...origin/initial-setup`
- PR: https://github.com/AkshataKumaranarasimha/playwright-api-test-kit/pull/1 (open)

## Verdict
**Approve with nits**

## Summary
PR #1 adds the `playwright-test-kit` skill, instruction template, gitignore hardening, and aligns the Google case file. Diff vs `main` is docs/agent tooling only (no test code changes). The existing Google SERP spec still passes, and an MCP visual pass shows a healthy homepage → results journey for `playwright-mcp`.

## Test results
- Command: `npx playwright test tests/google-search-playwright-mcp.spec.ts`
- Result: **pass** (1/1, ~4.2s)
- Notes: No captcha observed in this run. Locale is India (`en-IN` / regional homepage).

## Screenshots
- `PR-1-Initial-setup/screenshots/01-home.png` — Google homepage (India). Search combobox present; also shows newer chrome: `+`, **AI Mode**, Gemini promo. Consent dialog not blocking.
- `PR-1-Initial-setup/screenshots/02-after-search.png` — SERP for `playwright-mcp`. Official `playwright.dev` / GitHub MCP results visible; matches instruction assertions.

## Findings

### Blockers
- None for merge of this PR’s scoped changes.

### Should fix
- **Empty PR body** — add a short summary (skill + template + gitignore + instruction alignment) and test plan (`npm test` / Google spec).
- **Instruction ↔ data drift** — `instructions/google-search-playwright-mcp.md` lists `data/google.search.data.ts`, but `tests/google-search-playwright-mcp.spec.ts` still hardcodes `query: 'playwright-mcp'`. Either wire `googleSearchData.playwrightMcp` in the spec or drop Data from Output until used.

### Nits / improvements
- **`pr-review` skill is local-only** — `.cursor/skills/pr-review/` + README “Agents” section are uncommitted / not on `origin/initial-setup`. Include them in this PR (or a follow-up) so reviewers get the same agent.
- **README on the PR branch** still documents only `playwright-test-kit`; after adding `pr-review`, keep the Agents table in sync.
- **UI churn risk (observed in screenshots)** — homepage now has **AI Mode** and a `+` control beside Search. Current role-based `combobox "Search"` still works; worth a short note in the Google page object / skill that AI Mode must not be confused with classic search submit.

## Framework compliance
- **This PR’s files:** Pass — skill correctly encodes pages → assertions → flows → thin specs; template matches; `.auth/` / reports ignored.
- **Repo baseline (already on `main`, not introduced here):** gaps remain — duplicate Google modules (`src/pages/google-*.ts` vs `src/pages/google/`, `src/assertions/google.assertions.ts` vs `google/search.assertions.ts`), and `src/steps/google/search.steps.ts` imports missing `src/pages/google/home.page.ts`. Spec correctly uses `src/flows/google-search.flow.ts`. Clean up in a follow-up, not a merge blocker for #1.

## Suggested follow-ups
1. Commit/push `pr-review` skill + README Agents section onto `initial-setup` (or open PR #2).
2. Deduplicate Google pages/assertions; delete or fix broken `src/steps/` path.
3. Spec should import `googleSearchData` to match the instruction Output.
4. Add a non-empty PR description template for future PRs.
