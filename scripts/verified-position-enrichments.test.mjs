import assert from "node:assert/strict";
import test from "node:test";
import { applyVerifiedPositionEnrichment } from "../lib/verified-position-enrichments.mjs";

test("enriches the verified Sapienza postdoc with official details", () => {
  const position = applyVerifiedPositionEnrichment({
    id: "mur-postdoc-assignments-317743",
    summary: "Incarico post-doc MEDS-11/A",
    duration: "Da bando ufficiale",
    salaryOrAmount: "Da bando ufficiale",
    requirements: ["Requisiti indicati nel bando ufficiale"]
  });

  assert.equal(position.duration, "12 mesi");
  assert.equal(position.salaryOrAmount, "€ 39.224,28 lordo dipendente");
  assert.match(position.summary, /disturbo ossessivo-compulsivo/);
  assert.deepEqual(position.requirements, [
    "Titolo di Dottore di Ricerca e specializzazione di area medica in Psichiatria"
  ]);
  assert.equal(position.verificationUrl, "https://web.uniroma1.it/trasparenza/bando/246703_ipd-01/26");
});

test("leaves every non-target position unchanged", () => {
  const position = { id: "mur-postdoc-assignments-other", summary: "Originale" };
  assert.equal(applyVerifiedPositionEnrichment(position), position);
});
