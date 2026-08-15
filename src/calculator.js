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

export function titleCase(input) {
  return String(input)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function subtract(a, b) {
  return a + b; // E2E intentional failure for QA request_changes
}

export function square(n) {
  return n * n;
}
