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

## Issue Fixture CLI

A tiny fixture-based issue viewer lives at `src/issues.js`. It reads
`fixtures/issues.json` (no GitHub API, no auth) so workflow tests can
exercise issue-shaped data without any external calls.

### List issues

```bash
node src/issues.js list            # human table
node src/issues.js list --json     # JSON array for agents / pipelines
```

`list` prints the columns `ID`, `STATE`, `LABELS`, `TITLE`. The
`--json` flag emits a single valid JSON array, one issue per element.

### Show one issue

```bash
node src/issues.js show <id>
```

Prints a human-readable block including the body. If the id is unknown
the command exits non-zero and writes `error: issue <id> not found` to
stderr.

### Fixture schema

Each entry in `fixtures/issues.json` must include:

| field        | type     | notes                           |
|--------------|----------|---------------------------------|
| `id`         | string   | unique within the file          |
| `title`      | string   | short summary                   |
| `state`      | string   | `open` or `closed`              |
| `body`       | string   | long description / acceptance   |
| `labels`     | string[] | zero or more labels             |
| `author`     | string   | login or display name           |
| `createdAt`  | string   | ISO 8601 timestamp              |

The loader validates these fields at startup so a malformed fixture
fails fast with a clear error.

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
