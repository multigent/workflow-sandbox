# E2E: Issue #30 Workflow Verify

GitHub issue: https://github.com/multigent/workflow-sandbox/issues/30

## Purpose

This file is a fixture for the Multigent GitHub Issue collaboration flow
E2E test on the `multigent/workflow-sandbox` repository.

The goal of this E2E case is to verify that the full issue→Dev→QA→Human
Merge Gate pipeline runs reliably and repeatably under GitHub grants mode,
with the following contract:

1. **PM triage** triages an incoming GitHub Issue into a Dev task with a
   clear `dev_task_prompt`, and posts the triage reply on the issue.
2. **Dev** opens exactly one new file under `e2e/` referencing this issue,
   on a dedicated branch (`e2e/issue-30-workflow-verify`), and opens a PR
   that references this issue (`Closes #30` or `Refs #30`).
3. **CI/checks** run on the PR and must report `passed` before Dev hands
   off to QA. Pending or failed checks keep Dev in the loop until they
   pass.
4. **QA** reviews the PR, posts a review decision on GitHub, and writes a
   QA decision report in the knowledge base.
5. **Human Merge Gate** is the final authority on merging. No agent
   bypasses this gate.

This document itself is the only artifact created by the Dev step.
Any other change to `src/`, `test/`, `package.json`, `.github/` or
`README.md` is out of scope for this E2E case and must not be added.

## Non-goals

- No source code, tests, configuration, CI workflow, or README changes.
- No cross-cutting refactors or "while-we're-here" cleanups.
- No creation of any additional issue, release, or branch.

## Acceptance criteria

- [x] Exactly one new file: `e2e/issue-30.md`.
- [x] The body references this issue URL.
- [x] The body explains the E2E purpose above.
- [x] No other files are modified.
- [x] A PR is opened against `main` with title
      `[E2E] Add e2e doc for issue #30 workflow verify`
      and body `Closes #30` (or `Refs #30`).
- [x] The PR waits for CI/checks to be `passed` before being handed to QA.