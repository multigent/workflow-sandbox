#!/usr/bin/env node
// CLI entry point: node bin/triage.js <issue-id>  |  node bin/triage.js --list
// Fixture-driven; no LLM, no GitHub API.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { triage } from "../src/triage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FIXTURE_PATH = resolve(__dirname, "..", "fixtures", "issues.json");

const USAGE = `usage: node bin/triage.js <issue-id> | --list`;

async function loadFixture() {
  const raw = await readFile(FIXTURE_PATH, "utf8");
  const parsed = JSON.parse(raw);
  if (!parsed || !Array.isArray(parsed.issues)) {
    throw new Error("fixture must be { issues: [...] }");
  }
  return parsed.issues;
}

function findIssue(issues, id) {
  return issues.find((issue) => String(issue.id) === String(id));
}

async function main(argv) {
  const args = argv.slice(2);

  if (args.length === 0) {
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  const issues = await loadFixture();

  if (args[0] === "--list") {
    for (const issue of issues) {
      process.stdout.write(`${issue.id}\t${issue.title}\n`);
    }
    process.exit(0);
  }

  const id = args[0];
  const issue = findIssue(issues, id);
  if (!issue) {
    process.stderr.write(`unknown issue id: ${id}\n`);
    process.exit(1);
  }

  const result = triage(issue);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exit(0);
}

main(process.argv).catch((err) => {
  process.stderr.write(`triage error: ${err && err.message ? err.message : err}\n`);
  process.exit(1);
});