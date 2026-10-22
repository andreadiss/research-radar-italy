import assert from "node:assert/strict";
import test from "node:test";
import { deadlineClass, deadlineLabel, daysUntil } from "../lib/deadline-status.mjs";

test("deadline rendering follows the supplied snapshot day", () => {
  assert.equal(daysUntil("2026-10-23", "2026-10-21"), 2);
  assert.equal(deadlineLabel("2026-10-23", "2026-10-21"), "2 giorni");
  assert.equal(deadlineLabel("2026-10-23", "2026-10-22"), "Scade domani");
});

test("deadline urgency uses the same deterministic day", () => {
  assert.equal(deadlineClass("2026-11-05", "2026-10-21"), "deadline-pill");
  assert.equal(deadlineClass("2026-11-05", "2026-10-22"), "deadline-pill soon");
  assert.equal(deadlineClass("2026-10-22", "2026-10-22"), "deadline-pill urgent");
});

test("calendar-day differences remain stable across daylight-saving changes", () => {
  assert.equal(daysUntil("2026-10-26", "2026-10-24"), 2);
});
