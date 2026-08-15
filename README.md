# Multigent Workflow Sandbox

This repository is intentionally small. It exists to test Multigent GitHub workflows end to end:

- issue triage
- development PRs
- QA review gates
- human merge decisions
- release dry-runs

The code is simple enough for agents to change safely, but it has real CI so workflow behavior can be verified against GitHub issues, pull requests, checks, and reviews.

## Local Commands

```bash
npm test
```

## Test Ideas

- Create an issue asking to add a new string helper.
- Create an issue describing a failing arithmetic edge case.
- Open a PR that intentionally breaks `npm test`.
- Open a PR that passes CI and should go to the human merge gate.
