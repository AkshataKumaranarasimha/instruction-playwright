---
name: pr-review
description: >-
  Reviews a PR or branch by comparing it to main: framework compliance, affected
  Playwright tests, Playwright MCP screenshots, and actionable feedback as
  markdown plus a PDF named from the PR title. Use when the user provides a PR
  number/URL or branch name, or asks to review changes against main.
---

# PR review agent

Compare a **PR** or **branch** against **`main`**, then test and give feedback **as a PDF**.

Do **not** use this to author new cases (use `playwright-test-kit`).

## Required input

Accept one of:

| Input  | Examples                                              |
| ------ | ----------------------------------------------------- |
| PR     | `123`, `#123`, `https://github.com/org/repo/pull/123` |
| Branch | `initial-setup`, `feature/foo`                        |

If the user gives neither, ask which PR or branch to review (do not guess from uncommitted dirty files alone).

Optional overrides:

- **Base branch** — default `main`. Only use another base if the user or PR says so.
- Skip MCP / skip tests if the user asks.

## Resolve head + base

### A) PR given

```bash
gh pr view <n> --json number,title,body,baseRefName,headRefName,url,files,commits
gh pr diff <n>
```

- **Head** = `headRefName`
- **Base** = PR `baseRefName` if set, else `main`

### B) Branch given (no PR)

```bash
git fetch origin main <branch>
git log --oneline origin/main..<branch>
git diff --stat origin/main...<branch>
git diff origin/main...<branch>
```

- **Head** = the given branch
- **Base** = `main` (`origin/main` preferred)
- If a PR exists for that branch: `gh pr view --head <branch>` and use its number/title for naming

### Always use three-dot range vs main

```bash
git diff --stat origin/main...<head>
git diff origin/main...<head>
git log --oneline origin/main..<head>
```

Also read any `instructions/<case>.md` touched in that diff.

## Workflow

### 1. Diff review (vs main)

Against framework rules:

- Specs thin; journeys in `src/flows/`
- Locators/actions in `src/pages/`; expects in `src/assertions/`
- Specs import `test` from `src/fixtures/test.ts`
- Prefer role/accessible locators; flag brittle CSS/xpath
- Flag duplication, secrets, missing waits/assertions

### 2. Run tests (changed surface)

Prefer affected specs from the diff; else `npm test`.

### 3. Visual MCP pass (when UI/journey changed)

1. Reproduce the happy path
2. Screenshot: start → key action → final state
3. Save under `reports/pr-review/<artifact-stem>/screenshots/` (`01-home.png`, …)
4. **Read each screenshot** and comment on what you see

### 4. Feedback report + PDF

#### Artifact naming (required)

Derive a filesystem-safe stem from the PR (preferred) or branch:

| Source      | Stem example           |
| ----------- | ---------------------- |
| PR          | `PR-1-Initial-setup`   |
| Branch only | `branch-initial-setup` |

Rules:

1. Prefer `PR-<number>-<PR-title>` when a PR exists
2. Slugify title: spaces → `-`, keep `[A-Za-z0-9._-]`, collapse `--`, trim, max ~80 chars
3. Example: title `Initial setup` → `PR-1-Initial-setup`

Outputs:

- Markdown: `reports/pr-review/<stem>.md`
- PDF: `reports/pr-review/<stem>.pdf`
- Screenshots: `reports/pr-review/<stem>/screenshots/` (or `reports/pr-review/screenshots/` if already used)

Generate the PDF with:

```bash
node scripts/pr-review-to-pdf.mjs reports/pr-review/<stem>.md
```

The script embeds linked screenshots when paths resolve under `reports/pr-review/`.

#### Markdown structure

```markdown
# PR review: <PR title or branch>

## Scope

- Head: <branch or PR head>
- Base: main (or <other>)
- Compare: `origin/main...<head>`
- PR: <url or n/a>

## Verdict

Approve | Approve with nits | Request changes

## Summary

1–3 sentences.

## Test results

- Command:
- Result: pass/fail
- Notes:

## Screenshots

- `.../01-home.png` — observation

## Findings

### Blockers

### Should fix

### Nits / improvements

## Framework compliance

## Suggested follow-ups
```

Always tell the user the **PDF path** when done.

## Rules

- Always state **head**, **base (`main`)**, and the compare range
- Always produce both `.md` and `.pdf` with the PR-based name
- Do not push, merge, or force-push unless asked
- Do not commit `reports/pr-review/`
- Do not invent failures you did not observe
- Captcha/bot walls → **environment blocker**
- Keep secrets out of the report

## Example prompts

> Follow the pr-review skill for PR 1. Compare to main, run tests, take screenshots, and create a PDF named from the PR title.

> Follow the pr-review skill for branch `initial-setup` vs `main` and output a PDF.
