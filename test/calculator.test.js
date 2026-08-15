import assert from "node:assert/strict";
import { test } from "node:test";

import { add, divide, titleCase } from "../src/calculator.js";

test("add returns the sum of two numbers", () => {
  assert.equal(add(2, 3), 5);
});

test("divide returns the quotient", () => {
  assert.equal(divide(8, 2), 4);
});

test("divide rejects division by zero", () => {
  assert.throws(() => divide(1, 0), /division by zero/);
});

test("titleCase normalizes whitespace and casing", () => {
  assert.equal(titleCase("  hello   MULTIGENT sandbox "), "Hello Multigent Sandbox");
});
