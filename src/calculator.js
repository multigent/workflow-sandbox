export function add(a, b) {
  return a + b;
}

export function divide(a, b) {
  if (b === 0) {
    throw new Error("division by zero");
  }
  return a / b;
}

export function multiply(a, b) {
  return a * b;
}

const TITLE_CASE_ACRONYMS = new Set([
  "api",
  "url",
  "http",
  "https",
  "json",
  "yaml",
  "id",
  "http2",
  "ip",
  "ttl",
  "sql",
  "html",
  "css",
  "cli",
  "gui",
]);

function titleCaseWord(word) {
  const lower = word.toLowerCase();
  if (TITLE_CASE_ACRONYMS.has(lower)) {
    return lower.toUpperCase();
  }
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function titleCase(input) {
  return String(input)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(titleCaseWord)
    .join(" ");
}

export function subtract(a, b) {
  return a - b;
}

export function square(n) {
  return n * n;
}
