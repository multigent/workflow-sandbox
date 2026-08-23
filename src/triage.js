// Pure triage function for issue fixtures.
// Schema (per fixture):
//   id: string, title: string,
//   type: "feature" | "enhancement" | "bugfix" | "question" | "chore",
//   labels: string[],
//   severity: "low" | "medium" | "high",
//   area: string,
//   has_repro: boolean,
//   acceptance_fit: boolean,
//   notes: string

const SEVERITY_TO_PRIORITY = {
  high: "P1",
  medium: "P2",
  low: "P3",
};

const PRIORITIES = new Set(["P0", "P1", "P2", "P3"]);
const TYPES = new Set(["develop", "answer", "defer", "close"]);

function priorityFromSeverity(severity) {
  return SEVERITY_TO_PRIORITY[severity] ?? "P3";
}

function trimRationale(text, max = 120) {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

function validateIssue(issue) {
  if (!issue || typeof issue !== "object") {
    throw new Error("issue must be an object");
  }
  if (typeof issue.type !== "string") {
    throw new Error("issue.type must be a string");
  }
  if (typeof issue.severity !== "string") {
    throw new Error("issue.severity must be a string");
  }
}

/**
 * triage(issue) -> { priority, type, nextAction, rationale }
 *
 * Rule precedence (first match wins):
 *   1. question          -> answer / P3
 *   2. chore (sev!=high) -> defer  / P3
 *   3. bugfix + repro    -> develop / P0
 *   4. bugfix no repro   -> develop / P1 (request repro first)
 *   5. feature/enhancement + acceptance_fit -> develop / severity->priority
 *   6. fallback          -> close   / P3
 */
export function triage(issue) {
  validateIssue(issue);

  const t = issue.type;

  if (t === "question") {
    return {
      priority: "P3",
      type: "answer",
      nextAction: "answer in thread",
      rationale: trimRationale("question → answer with link to docs"),
    };
  }

  if (t === "chore" && issue.severity !== "high") {
    return {
      priority: "P3",
      type: "defer",
      nextAction: "park for later cleanup sprint",
      rationale: trimRationale(
        `chore at severity=${issue.severity} → defer; not blocking`,
      ),
    };
  }

  if (t === "bugfix" && issue.has_repro === true) {
    return {
      priority: "P0",
      type: "develop",
      nextAction: "fix immediately",
      rationale: trimRationale(
        "bugfix with reproducible steps → P0 hotfix",
      ),
    };
  }

  if (t === "bugfix" && issue.has_repro !== true) {
    return {
      priority: "P1",
      type: "develop",
      nextAction: "request repro then fix",
      rationale: trimRationale(
        "bugfix without repro → P1; ask reporter for repro first",
      ),
    };
  }

  if (
    (t === "feature" || t === "enhancement") &&
    issue.acceptance_fit === true
  ) {
    const priority = priorityFromSeverity(issue.severity);
    return {
      priority,
      type: "develop",
      nextAction: `implement (${t})`,
      rationale: trimRationale(
        `${t} acceptance_fit=true, severity=${issue.severity} → develop ${priority}`,
      ),
    };
  }

  return {
    priority: "P3",
    type: "close",
    nextAction: "close as not planned",
    rationale: trimRationale(
      `no rule matched for type=${t}; default close`,
    ),
  };
}

export function validateTriageResult(result) {
  if (!result || typeof result !== "object") {
    throw new Error("triage result must be an object");
  }
  if (!PRIORITIES.has(result.priority)) {
    throw new Error(`invalid priority: ${result.priority}`);
  }
  if (!TYPES.has(result.type)) {
    throw new Error(`invalid type: ${result.type}`);
  }
  if (typeof result.nextAction !== "string" || result.nextAction.length === 0) {
    throw new Error("nextAction must be a non-empty string");
  }
  if (typeof result.rationale !== "string" || result.rationale.length === 0) {
    throw new Error("rationale must be a non-empty string");
  }
  if (result.rationale.length > 120) {
    throw new Error("rationale must be <=120 chars");
  }
}