import test from "node:test";
import assert from "node:assert/strict";
import { positionMetadataTitle } from "../lib/position-metadata-title.mjs";

test("does not append an institution already present as a title suffix", () => {
  for (const separator of [" - ", " – ", " — "]) {
    const title = `Postdoc${separator}Università di Pavia`;
    assert.equal(positionMetadataTitle(title, "Università di Pavia", "mur-postdoc-123"), `${title} (123)`);
  }
});
test("normalizes casing and whitespace only for comparison", () => {
  assert.equal(positionMetadataTitle("Postdoc - UNIVERSITÀ  DI PAVIA", "Università di Pavia", "mur-123"), "Postdoc - UNIVERSITÀ  DI PAVIA (123)");
});
test("keeps institutions not fully present in the rendered title", () => {
  assert.equal(positionMetadataTitle("Postdoc - Università di...", "Università di Pavia", "mur-123"), "Postdoc - Università di... – Università di Pavia (123)");
  assert.equal(positionMetadataTitle("Postdoc - Università di Pavia e partner", "Università di Pavia", "mur-123"), "Postdoc - Università di Pavia e partner – Università di Pavia (123)");
});
test("retains the identifying number and does not modify a specific topic", () => {
  assert.equal(positionMetadataTitle("Ricerca in fisica", "Università di Pavia", "mur-456"), "Ricerca in fisica – Università di Pavia (456)");
});
