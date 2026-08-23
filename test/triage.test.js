import assert from "node:assert/strict";
import { test } from "node:test";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { triage, validateTriageResult } from "../src/triage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "..");
const CLI_PATH = resolve(REPO_ROOT, "bin", "triage.js");
const FIXTURE_PATH = resolve(REPO_ROOT, "fixtures", "issues.json");

function loadFixture() {
  const raw = readFileSync(FIXTURE_PATH, "utf8");
  return JSON.parse(raw).issues;
}

function findFixture(id) {
  const issues = loadFixture();
  const found = issues.find((i) => String(i.id) === String(id));
  if (!found) throw new Error(`fixture missing id ${id}`);
  return found;
}

function runCli(args) {
  return spawnSync(process.execPath, [CLI_PATH, ...args], {
    encoding: "utf8",
  });
}

// ---------- pure function: each type branch ----------

test("triage: question -> answer", () => {
  const issue = { type: "question", severity: "low", has_repro: false, acceptance_fit: true };
  const result = triage(issue);
  validateTriageResult(result);
  assert.equal(result.type, "answer");
  assert.equal(result.priority, "P3");
  assert.ok(result.rationale.length <= 120);
  assert.ok(result.rationale.includes("question"));
});

test("triage: chore at low severity -> defer", () => {
  const issue = { type: "chore", severity: "low", has_repro: false, acceptance_fit: true };
  const result = triage(issue);
  validateTriageResult(result);
  assert.equal(result.type, "defer");
  assert.equal(result.priority, "P3");
  assert.match(result.rationale, /chore/);
});

test("triage: chore at high severity falls through to close", () => {
  const issue = { type: "chore", severity: "high", has_repro: false, acceptance_fit: true };
  const result = triage(issue);
  validateTriageResult(result);
  assert.equal(result.type, "close");
  assert.equal(result.priority, "P3");
});

test("triage: bugfix with repro -> P0 develop", () => {
  const issue = { type: "bugfix", severity: "high", has_repro: true, acceptance_fit: true };
  const result = triage(issue);
  validateTriageResult(result);
  assert.equal(result.type, "develop");
  assert.equal(result.priority, "P0");
  assert.match(result.rationale, /P0/);
});

test("triage: bugfix without repro -> P1 needs-info (block dev on repro)", () => {
  const issue = { type: "bugfix", severity: "medium", has_repro: false, acceptance_fit: true };
  const result = triage(issue);
  validateTriageResult(result);
  assert.equal(result.type, "needs-info");
  assert.equal(result.priority, "P1");
  assert.match(result.nextAction, /repro/i);
});

test("triage: feature with acceptance_fit at medium -> develop P2", () => {
  const issue = { type: "feature", severity: "medium", has_repro: false, acceptance_fit: true };
  const result = triage(issue);
  validateTriageResult(result);
  assert.equal(result.type, "develop");
  assert.equal(result.priority, "P2");
});

test("triage: enhancement with acceptance_fit at high -> develop P1", () => {
  const issue = { type: "enhancement", severity: "high", has_repro: false, acceptance_fit: true };
  const result = triage(issue);
  validateTriageResult(result);
  assert.equal(result.type, "develop");
  assert.equal(result.priority, "P1");
});

test("triage: feature without acceptance_fit -> close", () => {
  const issue = { type: "feature", severity: "low", has_repro: false, acceptance_fit: false };
  const result = triage(issue);
  validateTriageResult(result);
  assert.equal(result.type, "close");
  assert.equal(result.priority, "P3");
});

test("triage: unknown type -> close", () => {
  const issue = { type: "mystery", severity: "low", has_repro: false, acceptance_fit: true };
  const result = triage(issue);
  validateTriageResult(result);
  assert.equal(result.type, "close");
});

test("triage: rationale never exceeds 120 chars", () => {
  const cases = [
    { type: "question", severity: "low", has_repro: false, acceptance_fit: true },
    { type: "bugfix", severity: "high", has_repro: true, acceptance_fit: true },
    { type: "bugfix", severity: "medium", has_repro: false, acceptance_fit: true },
    { type: "feature", severity: "high", has_repro: false, acceptance_fit: true },
  ];
  for (const issue of cases) {
    const result = triage(issue);
    assert.ok(result.rationale.length <= 120, `too long: ${result.rationale}`);
  }
});

test("triage: bugfix without repro uses the new needs-info branch (regression)", () => {
  // Regression guard for #42: previously this branch returned type=develop,
  // which a maintainer could misread as "start coding now". The PM verdict
  // (msg-20260823-trjijr) is: type=needs-info, nextAction collects repro.
  const issue = { type: "bugfix", severity: "medium", has_repro: false, acceptance_fit: true };
  const result = triage(issue);
  assert.notEqual(result.type, "develop", "regression: must not be develop");
  assert.equal(result.type, "needs-info");
  assert.equal(result.nextAction, "collect repro from reporter");
});

// ---------- pure function: errors ----------

test("triage: unknown id (function level) throws on missing required fields", () => {
  assert.throws(() => triage({}), /type/);
  assert.throws(() => triage({ type: "bugfix" }), /severity/);
  assert.throws(() => triage(null), /object/);
});

// ---------- fixture-driven: deterministic results ----------

test("triage: fixture issue 39 (feature, low) -> develop P3", () => {
  const result = triage(findFixture("39"));
  validateTriageResult(result);
  assert.equal(result.type, "develop");
  assert.equal(result.priority, "P3");
});

test("triage: fixture issue 40 (bugfix with repro) -> develop P0", () => {
  const result = triage(findFixture("40"));
  validateTriageResult(result);
  assert.equal(result.type, "develop");
  assert.equal(result.priority, "P0");
});

test("triage: fixture issue 42 (question) -> answer", () => {
  const result = triage(findFixture("42"));
  validateTriageResult(result);
  assert.equal(result.type, "answer");
});

// ---------- CLI: success path ----------

test("cli: known id prints triage JSON", () => {
  const res = runCli(["39"]);
  assert.equal(res.status, 0, `stderr=${res.stderr}`);
  const parsed = JSON.parse(res.stdout);
  validateTriageResult(parsed);
  assert.equal(parsed.type, "develop");
  assert.equal(parsed.priority, "P3");
});

test("cli: --list prints every fixture id and exits 0", () => {
  const issues = loadFixture();
  const res = runCli(["--list"]);
  assert.equal(res.status, 0, `stderr=${res.stderr}`);
  for (const issue of issues) {
    assert.ok(res.stdout.includes(issue.id), `missing id ${issue.id}`);
    assert.ok(res.stdout.includes(issue.title), `missing title ${issue.title}`);
  }
});

// ---------- CLI: error paths ----------

test("cli: unknown id exits 1 and stderr mentions unknown issue id", () => {
  const res = runCli(["does-not-exist"]);
  assert.notEqual(res.status, 0);
  assert.equal(res.status, 1);
  assert.match(res.stderr, /unknown issue id/);
});

test("cli: no args exits 2 and stderr contains usage", () => {
  const res = runCli([]);
  assert.equal(res.status, 2);
  assert.match(res.stderr, /usage/i);
});