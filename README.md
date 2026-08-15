# Multigent Workflow Sandbox

This repository is intentionally small. It exists to test Multigent GitHub workflows end to end:

- issue triage
- development PRs
- QA review gates
- human merge decisions
- release dry-runs

The code is simple enough for agents to change safely, but it has real CI so workflow behavior can be verified against GitHub issues, pull requests, checks, and reviews.

## Local Commands

This package has **zero runtime dependencies** and no `package-lock.json`,
so `npm ci` does NOT apply. Just run the test suite directly with Node 20+:

```bash
node --test
# or equivalently:
npm test
```

## Test Ideas

- Create an issue asking to add a new string helper.
- Create an issue describing a failing arithmetic edge case.
- Open a PR that intentionally breaks `npm test`.
- Open a PR that passes CI and should go to the human merge gate.

## Release Notes Install Template

Use the snippet below in release notes / GitHub Release bodies so users
do not run `npm ci` against a lockfile-less repo:

```bash
git clone https://github.com/multigent/workflow-sandbox
cd workflow-sandbox
git checkout <TAG>
npm test
```
