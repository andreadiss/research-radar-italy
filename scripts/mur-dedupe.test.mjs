import test from "node:test";
import assert from "node:assert/strict";
import {normalizeRecords} from "./mur-normalize.mjs";
const record = (id, ssd) => ({externalId:id, sourceCategory:"test", title:"Procedura selettiva per ricercatore a tempo determinato", institution:"Università di Roma", deadline:"2026-12-31", sourceUrl:`https://bandi.mur.gov.it/test/${id}`, ssd});
test("different SSDs do not hide a later same-sector duplicate candidate", () => {
  const result = normalizeRecords([record("a","MEDF-01/A"),record("b","GIUR-06/A"),record("c","MEDF-01/A")]);
  assert.equal(result.length,3);
  assert.equal(result[1].possibleDuplicateOf,undefined);
  assert.equal(result[2].possibleDuplicateOf,"mur-test-a");
});
test("unknown sectors still require duplicate review", () => {
  const result=normalizeRecords([record("a","MEDF-01/A"),record("b","-")]);
  assert.equal(result[1].possibleDuplicateOf,"mur-test-a");
});
test("exact source URL still deduplicates despite conflicting SSD fields", () => {
  const a=record("a","MEDF-01/A"), b={...record("b","GIUR-06/A"),sourceUrl:a.sourceUrl};
  assert.equal(normalizeRecords([a,b]).length,1);
});
