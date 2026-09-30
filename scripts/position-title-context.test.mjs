import test from "node:test";
import assert from "node:assert/strict";
import { positionTitleContext } from "../lib/position-title-context.mjs";

const common = {
  title: "Procedura selettiva per un incarico post-doc",
  institution: "Università di Milano",
  positionType: "Postdoc"
};

test("distinguishes same-title calls at the same university using their source SSD", () => {
  const oncology = { ...common, id: "mur-postdoc-1", ssd: "MEDS-09/A - Oncologia medica" };
  const physics = { ...common, id: "mur-postdoc-2", ssd: "PHYS-03/A - Fisica sperimentale" };
  const open = [oncology, physics];

  assert.deepEqual(positionTitleContext(oncology, open), {
    heading: `${common.title} — MEDS-09/A - Oncologia medica`,
    metadataSubject: "Postdoc — MEDS-09/A - Oncologia medica"
  });
  assert.notEqual(positionTitleContext(oncology, open).heading, positionTitleContext(physics, open).heading);
});

test("keeps unique and archived official titles intact", () => {
  const open = { ...common, id: "mur-postdoc-1", ssd: "MEDS-09/A" };
  const archived = { ...common, id: "mur-postdoc-2", ssd: "PHYS-03/A" };
  const expected = { heading: common.title, metadataSubject: common.title };
  assert.deepEqual(positionTitleContext(open, [open]), expected);
  assert.deepEqual(positionTitleContext(archived, [open]), expected);
});

test("uses the SSD when universities differ but the official call title is the same", () => {
  const milan = { ...common, id: "mur-postdoc-1", ssd: "MEDS-09/A" };
  const pavia = { ...common, id: "mur-postdoc-2", institution: "Università di Pavia", ssd: "MATH-04/A" };
  assert.equal(positionTitleContext(milan, [milan, pavia]).metadataSubject, "Postdoc — MEDS-09/A");
});
