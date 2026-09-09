import test from "node:test";
import assert from "node:assert/strict";
import { evaluateSourceFreshness } from "./source-freshness.mjs";

test("uses the last successful source check instead of record modification dates", () => {
  assert.deepEqual(
    evaluateSourceFreshness("2026-09-08T09:47:24Z", new Date("2026-09-09T07:00:00Z")),
    { status: "fresh", ageHours: 21.21 }
  );
});

test("marks a source stale only after 48 hours", () => {
  assert.equal(evaluateSourceFreshness("2026-09-07T06:59:59Z", new Date("2026-09-09T07:00:00Z")).status, "stale");
  assert.equal(evaluateSourceFreshness("2026-09-07T07:00:00Z", new Date("2026-09-09T07:00:00Z")).status, "fresh");
});

test("rejects missing, malformed and future check timestamps", () => {
  for (const timestamp of [undefined, "not-a-date", "2026-09-10T00:00:00Z"]) {
    assert.deepEqual(
      evaluateSourceFreshness(timestamp, new Date("2026-09-09T07:00:00Z")),
      { status: "invalid", ageHours: null }
    );
  }
});
