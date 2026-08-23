// Fixture-based issue viewer for the workflow sandbox.
//
// Reads from fixtures/issues.json and exposes a tiny CLI:
//   node src/issues.js list [--json]
//   node src/issues.js show <id>
//
// Zero runtime deps: only Node 20+ stdlib is used so the sandbox can
// exercise workflow behavior without package installs.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_FIXTURE = path.resolve(HERE, "..", "fixtures", "issues.json");

const REQUIRED_FIELDS = ["id", "title", "state", "body", "labels", "author", "createdAt"];

/**
 * Load and validate the issues fixture.
 *
 * @param {string} [filePath] - override the default fixture location.
 * @returns {Array<object>} the parsed issue list.
 */
export function loadIssues(filePath = DEFAULT_FIXTURE) {
  const raw = readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`fixture at ${filePath} must be a JSON array`);
  }
  for (const [index, issue] of parsed.entries()) {
    if (!issue || typeof issue !== "object") {
      throw new Error(`fixture entry #${index} is not an object`);
    }
    for (const field of REQUIRED_FIELDS) {
      if (!(field in issue)) {
        throw new Error(`fixture entry #${index} is missing required field "${field}"`);
      }
    }
    if (!Array.isArray(issue.labels)) {
      throw new Error(`fixture entry #${index} has non-array "labels"`);
    }
  }
  return parsed;
}

/**
 * Find a single issue by id. Throws when no match is found so callers can
 * decide whether to exit non-zero or to surface the error differently.
 *
 * @param {Array<object>} issues
 * @param {string} id
 * @returns {object} the matching issue.
 */
export function findIssue(issues, id) {
  const match = issues.find((issue) => String(issue.id) === String(id));
  if (!match) {
    throw new Error(`issue ${id} not found`);
  }
  return match;
}

/**
 * Pad a string to a fixed display width, ignoring ANSI escape sequences.
 * The output is only used for human-facing tables, so a simple approach
 * is enough.
 */
function pad(text, width) {
  const value = String(text ?? "");
  if (value.length >= width) return value;
  return value + " ".repeat(width - value.length);
}

/**
 * Render the issue list as a fixed-column human table.
 *
 * @param {Array<object>} issues
 * @returns {string}
 */
export function formatListHuman(issues) {
  if (issues.length === 0) {
    return "no issues";
  }
  const headers = ["ID", "STATE", "LABELS", "TITLE"];
  const widths = [headers[0].length, headers[1].length, headers[2].length, headers[3].length];

  const rows = issues.map((issue) => [
    String(issue.id),
    String(issue.state),
    Array.isArray(issue.labels) && issue.labels.length > 0 ? issue.labels.join(", ") : "-",
    String(issue.title),
  ]);
  for (const row of rows) {
    widths[0] = Math.max(widths[0], row[0].length);
    widths[1] = Math.max(widths[1], row[1].length);
    widths[2] = Math.max(widths[2], row[2].length);
    widths[3] = Math.max(widths[3], row[3].length);
  }

  const lines = [];
  lines.push([pad(headers[0], widths[0]), pad(headers[1], widths[1]), pad(headers[2], widths[2]), headers[3]].join("  "));
  lines.push([pad("-".repeat(widths[0]), widths[0]), pad("-".repeat(widths[1]), widths[1]), pad("-".repeat(widths[2]), widths[2]), "-".repeat(widths[3])].join("  "));
  for (const row of rows) {
    lines.push([pad(row[0], widths[0]), pad(row[1], widths[1]), pad(row[2], widths[2]), row[3]].join("  "));
  }
  return lines.join("\n");
}

/**
 * Render one issue as a human-readable block. The body keeps its original
 * newlines so agents reading the output can still see paragraphs.
 *
 * @param {object} issue
 * @returns {string}
 */
export function formatIssueHuman(issue) {
  const labels = Array.isArray(issue.labels) && issue.labels.length > 0
    ? issue.labels.join(", ")
    : "(none)";
  return [
    `Issue #${issue.id}: ${issue.title}`,
    `State   : ${issue.state}`,
    `Author  : ${issue.author}`,
    `Created : ${issue.createdAt}`,
    `Labels  : ${labels}`,
    "",
    "Body:",
    String(issue.body ?? "").trim(),
  ].join("\n");
}

/**
 * Format the issue list for machine/agent consumption.
 *
 * @param {Array<object>} issues
 * @returns {string} JSON string.
 */
export function formatListJson(issues) {
  return JSON.stringify(issues, null, 2) + "\n";
}

function printUsage() {
  const usage = [
    "Usage:",
    "  node src/issues.js list [--json]",
    "  node src/issues.js show <id>",
  ].join("\n");
  process.stderr.write(usage + "\n");
}

function main(argv) {
  const args = argv.slice(2);
  const command = args[0];

  if (command === "list") {
    const issues = loadIssues();
    const asJson = args.includes("--json");
    if (asJson) {
      process.stdout.write(formatListJson(issues));
    } else {
      process.stdout.write(formatListHuman(issues) + "\n");
    }
    return 0;
  }

  if (command === "show") {
    const id = args[1];
    if (!id) {
      process.stderr.write("error: missing issue id\n");
      printUsage();
      return 2;
    }
    const issues = loadIssues();
    try {
      const issue = findIssue(issues, id);
      process.stdout.write(formatIssueHuman(issue) + "\n");
      return 0;
    } catch (err) {
      process.stderr.write(`error: ${err.message}\n`);
      return 1;
    }
  }

  process.stderr.write(`error: unknown command "${command ?? ""}"\n`);
  printUsage();
  return 2;
}

// Only invoke main when this module is run directly. Tests can import
// the helpers above without triggering CLI side effects.
const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const exitCode = main(process.argv);
  if (typeof exitCode === "number") {
    process.exit(exitCode);
  }
}
