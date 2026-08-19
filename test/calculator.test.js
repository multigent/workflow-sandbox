import assert from "node:assert/strict";
import { test } from "node:test";

import { add, divide, multiply, titleCase, subtract, square } from "../src/calculator.js";

test("add returns the sum of two numbers", () => {
  assert.equal(add(2, 3), 5);
});

test("divide returns the quotient", () => {
  assert.equal(divide(8, 2), 4);
});

test("divide rejects division by zero", () => {
  assert.throws(() => divide(1, 0), /division by zero/);
});


test("divide returns a non-integer quotient for normal numbers", () => {
  assert.equal(divide(5, 2), 2.5);
});

test("divide returns a negative result when the dividend is negative", () => {
  assert.equal(divide(-6, 3), -2);
});

test("divide returns a negative result when the divisor is negative", () => {
  assert.equal(divide(6, -3), -2);
});

test("divide returns a positive result when both operands are negative", () => {
  assert.equal(divide(-6, -3), 2);
});

test("divide returns 0 when the dividend is 0", () => {
  assert.equal(divide(0, 7), 0);
});

test("divide returns the dividend unchanged when the divisor is 1", () => {
  assert.equal(divide(7, 1), 7);
});

test("divide handles floating point operands", () => {
  assert.equal(divide(1.5, 0.5), 3);
});

test("divide throws an error whose message mentions zero", () => {
  assert.throws(() => divide(1, 0), /zero/);
});

test("multiply returns the product of two numbers", () => {
  assert.equal(multiply(3, 4), 12);
});

test("multiply returns 0 when first argument is zero", () => {
  assert.equal(multiply(0, 7), 0);
});

test("multiply returns 0 when second argument is zero", () => {
  assert.equal(multiply(7, 0), 0);
});

test("multiply handles a negative first argument", () => {
  assert.equal(multiply(-2, 5), -10);
});

test("multiply handles two negative arguments", () => {
  assert.equal(multiply(-3, -4), 12);
});

test("titleCase normalizes whitespace and casing", () => {
  assert.equal(titleCase("  hello   MULTIGENT sandbox "), "Hello Multigent Sandbox");
});

test("titleCase uppercases a single acronym word", () => {
  assert.equal(titleCase("api client"), "API Client");
});

test("titleCase uppercases multiple acronyms in one input", () => {
  assert.equal(titleCase("api url parser"), "API URL Parser");
});

test("titleCase returns empty string for empty input", () => {
  assert.equal(titleCase(""), "");
});

test("titleCase trims surrounding whitespace and collapses runs", () => {
  assert.equal(titleCase("   api   client   "), "API Client");
});

test("titleCase uppercases Id when it is the leading acronym word", () => {
  assert.equal(titleCase("Id Of A Record"), "ID Of A Record");
});

test("titleCase preserves casing for acronym matches and lowercases the rest", () => {
  assert.equal(titleCase("mixed JSON and Api"), "Mixed JSON And API");
});

test("subtract returns the difference between two numbers", () => {
  assert.equal(subtract(9, 4), 5);
});

test("square returns n * n for positive n", () => {
  assert.equal(square(5), 25);
});

test("square returns 0 for n = 0", () => {
  assert.equal(square(0), 0);
});

test("square returns positive result for negative n", () => {
  assert.equal(square(-3), 9);
});
