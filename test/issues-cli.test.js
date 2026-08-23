import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import {
  loadIssues,
  findIssue,
  formatListHuman,
  formatListJson,
  formatIssueHuman,
} from "../src/issues.js";

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CLI_PATH = path.join(REPO_ROOT, "src", "issues.js");
const DEFAULT_FIXTURE = path.join(REPO_ROOT, "fixtures", "issues.json");

function makeMinimalIssue(id, overrides = {}) {
  return {
    id,
    title: `Issue ${id}`,
    state: "open",
    body: `Body for issue ${id}.`,
    labels: ["enhancement"],
    author: "tester",
    createdAt: "2026-06-01T00:00:00Z",
    ...overrides,
  };
}

function writeTempFixture(issues) {
  const dir = mkdtempSync(path.join(tmpdir(), "issues-fixture-"));
  const filePath = path.join(dir, "issues.json");
  writeFileSync(filePath, JSON.stringify(issues, null, 2));
  return filePath;
}

function runCli(args) {
  return spawnSync(process.execPath, [CLI_PATH, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

// ---- fixture reader ----------------------------------------------------

test("loadIssues reads the bundled fixture", () => {
  const issues = loadIssues(DEFAULT_FIXTURE);
  assert.ok(Array.isArray(issues));
  assert.ok(issues.length >= 3, "fixture should provide at least 3 sample issues");
  for (const issue of issues) {
    for (const field of ["id", "title", "state", "body", "labels", "author", "createdAt"]) {
      assert.ok(field in issue, `fixture issue #${issue.id} missing field ${field}`);
    }
  }
});

test("fixture covers both open and closed states", () => {
  const issues = loadIssues(DEFAULT_FIXTURE);
  const states = new Set(issues.map((issue) => issue.state));
  assert.ok(states.has("open"), "fixture should include an open issue");
  assert.ok(states.has("closed"), "fixture should include a closed issue");
});

test("loadIssues validates the schema", () => {
  const missingField = writeTempFixture([makeMinimalIssue("1", { title: undefined })]);
  assert.throws(() => loadIssues(missingField), /missing required field "title"/);

  const wrongLabels = writeTempFixture([makeMinimalIssue("1", { labels: "bug" })]);
  assert.throws(() => loadIssues(wrongLabels), /non-array "labels"/);

  const notArray = writeTempFixture({ not: "an array" });
  assert.throws(() => loadIssues(notArray), /must be a JSON array/);

  const badEntry = writeTempFixture([null]);
  assert.throws(() => loadIssues(badEntry), /not an object/);
});

test("loadIssues surfaces JSON parse errors with the file path", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "issues-broken-"));
  const filePath = path.join(dir, "broken.json");
  writeFileSync(filePath, "{ not json");
  assert.throws(() => loadIssues(filePath), /JSON/);
});

// ---- helpers ----------------------------------------------------------

test("findIssue returns the matching issue", () => {
  const issues = loadIssues(DEFAULT_FIXTURE);
  const first = issues[0];
  const found = findIssue(issues, first.id);
  assert.equal(found.id, first.id);
});

test("findIssue throws a clear error for an unknown id", () => {
  const issues = loadIssues(DEFAULT_FIXTURE);
  assert.throws(() => findIssue(issues, "does-not-exist"), /issue does-not-exist not found/);
});

test("findIssue accepts numeric ids via string coercion", () => {
  const issues = loadIssues(DEFAULT_FIXTURE);
  const first = issues[0];
  assert.equal(findIssue(issues, Number(first.id)).id, first.id);
});

test("formatListHuman renders a header and a row per issue", () => {
  const issues = [
    makeMinimalIssue("1", { state: "open", labels: ["bug"], title: "Bug" }),
    makeMinimalIssue("2", { state: "closed", labels: [], title: "Closed issue" }),
  ];
  const output = formatListHuman(issues);
  assert.match(output, /ID\s+STATE\s+LABELS\s+TITLE/);
  assert.match(output, /\b1\s+open\s+bug/);
  assert.match(output, /\b2\s+closed\s+-/);
  assert.match(output, /Bug/);
  assert.match(output, /Closed issue/);
});

test("formatListHuman handles an empty list", () => {
  assert.equal(formatListHuman([]), "no issues");
});

test("formatListJson emits valid JSON of the issue list", () => {
  const issues = [
    makeMinimalIssue("1"),
    makeMinimalIssue("2"),
  ];
  const output = formatListJson(issues);
  const parsed = JSON.parse(output);
  assert.deepEqual(parsed, issues);
});

test("formatIssueHuman renders all required fields and the body", () => {
  const issues = loadIssues(DEFAULT_FIXTURE);
  const issue = issues[0];
  const output = formatIssueHuman(issue);
  assert.match(output, new RegExp(`Issue #${issue.id}:`));
  assert.match(output, new RegExp(`State\\s+: ${issue.state}`));
  assert.match(output, new RegExp(`Author\\s+: ${issue.author}`));
  assert.match(output, new RegExp(`Created : ${issue.createdAt}`));
  assert.ok(output.includes(issue.body.split("\n")[0]), "body should be rendered");
});

// ---- CLI behavior ------------------------------------------------------

test("CLI: list prints a human table", () => {
  const result = runCli(["list"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /ID\s+STATE\s+LABELS\s+TITLE/);
  // fixture contains at least one known issue title fragment
  assert.ok(result.stdout.length > 0);
});

test("CLI: list --json emits valid JSON array", () => {
  const result = runCli(["list", "--json"]);
  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout);
  assert.ok(Array.isArray(parsed));
  assert.ok(parsed.length >= 3);
  for (const issue of parsed) {
    for (const field of ["id", "title", "state", "body", "labels", "author", "createdAt"]) {
      assert.ok(field in issue);
    }
  }
});

test("CLI: show <id> prints the matching issue", () => {
  const fixture = loadIssues(DEFAULT_FIXTURE);
  const target = fixture[0];
  const result = runCli(["show", target.id]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, new RegExp(`Issue #${target.id}:`));
  assert.match(result.stdout, new RegExp(`State\\s+: ${target.state}`));
});

test("CLI: show <unknown> exits non-zero with a clear error", () => {
  const result = runCli(["show", "999999"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /issue 999999 not found/);
});

test("CLI: show without an id exits non-zero and prints usage", () => {
  const result = runCli(["show"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /missing issue id/);
  assert.match(result.stderr, /Usage:/);
});

test("CLI: unknown command exits non-zero and prints usage", () => {
  const result = runCli(["bogus"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /unknown command "bogus"/);
  assert.match(result.stderr, /Usage:/);
});
