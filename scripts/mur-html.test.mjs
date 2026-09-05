import test from "node:test";
import assert from "node:assert/strict";
import { extractTableFields } from "./mur-html.mjs";
import { toPosition } from "./mur-normalize.mjs";

// Small synthetic fixture using field labels observed on the official MUR pages.
const row = (label, value) => `<tr><th>${label}</th><td>${value}</td></tr>`;
test("retains all unique scientific sectors including label aliases", () => {
  const fields = extractTableFields(row("G.S.D.", "07/AGRI-02") + row("GSD", "10/ANGL-01") +
    row("G.S.D.", "07/AGRI-02") + row("S.S.D", "AGRI-02/A") + row("SSD", "ANGL-01/C"));
  assert.equal(fields["G.S.D."], "07/AGRI-02\n10/ANGL-01");
  assert.equal(fields["S.S.D"], "AGRI-02/A\nANGL-01/C");
});
test("does not merge a contact institution into the employer", () => {
  const fields = extractTableFields(row("Organizzazione/Ente", "Università A") + row("Organizzazione/Ente", "Ufficio B"));
  assert.equal(fields["Organizzazione/Ente"], "Università A");
});
test("keeps decoded call content compatible with funding classification", () => {
  const fields = extractTableFields(row("Titolo:", "Ricerca &amp; innovazione<br>2026"));
  assert.equal(fields.Titolo, "Ricerca & innovazione 2026");
});
test("normalization preserves sectors and flags the multi-sector call", () => {
  const p = toPosition({title: "Bando di ricerca multidisciplinare", institution: "Università di Roma",
    sourceUrl: "https://bandi.mur.gov.it/test", deadline: "2026-12-31", gsd: "07/AGRI-02\n10/ANGL-01", ssd: "AGRI-02/A\nANGL-01/C"});
  assert.equal(p.gsd, "07/AGRI-02\n10/ANGL-01");
  assert.equal(p.ssd, "AGRI-02/A\nANGL-01/C");
  assert.equal(p.discipline, "Altro / interdisciplinare");
  assert.equal(p.reviewStatus, "needs_review");
  assert.ok(p.reviewReasons.includes("multiple_scientific_sectors"));
});
