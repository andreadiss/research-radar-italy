import test from "node:test";
import assert from "node:assert/strict";
import { reconcilePositions } from "./reconcile-positions.mjs";

const old = [{ id: "one", title: "Call one", updatedAt: "2026-09-01" }, { id: "two", title: "Call two", updatedAt: "2026-09-01" }];
test("a full refresh retains missing URLs as archived and does not fake modification dates", () => {
  const result = reconcilePositions(old, [{ id: "one", title: "Call one" }], { fullSync: true, checkedAt: "2026-09-05" });
  assert.equal(result.length, 2);
  assert.equal(result[0].updatedAt, "2026-09-01");
  assert.equal(result[1].archivedAt, "2026-09-05");
});
test("partial imports cannot remove or archive unrelated records", () => {
  assert.deepEqual(reconcilePositions(old, [{ id: "one", title: "Call one" }], { fullSync: false, checkedAt: "2026-09-05" }), old);
});
test("empty and duplicate imports fail before publishing", () => {
  assert.throws(() => reconcilePositions(old, [], { fullSync: true }), /Empty import/);
  assert.throws(() => reconcilePositions(old, [old[0], old[0]], { fullSync: true }), /Duplicate/);
});
test("reopened records recover their original URL and update metadata", () => {
  const result = reconcilePositions([{ ...old[0], archivedAt: "2026-09-04" }], [{ id: "one", title: "Call one" }], { fullSync: true, checkedAt: "2026-09-05" });
  assert.equal(result[0].id, "one");
  assert.equal(result[0].archivedAt, undefined);
  assert.equal(result[0].updatedAt, "2026-09-05");
});
