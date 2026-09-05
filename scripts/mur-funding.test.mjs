import test from "node:test";
import assert from "node:assert/strict";
import { detectFundingFromFields } from "./mur-funding.mjs";

test("ignores programme names outside call content", () => {
  assert.equal(detectFundingFromFields({
    Titolo: "Progetto FANDEMIA finanziato MUR FIS 3",
    Menu: "ERC MSCA PRIN PNRR Horizon",
    "Research Framework Programme / Marie Curie Actions": "No",
    "Organizzazione/Ente": "MSCA research office"
  }), "MUR");
});

test("recognizes programme references in call title and description", () => {
  assert.equal(detectFundingFromFields({"Nome bando": "Progetto PRIN 2026"}), "PRIN");
  assert.equal(detectFundingFromFields({"Descrizione sintetica in inglese": "MSCA fellowship"}), "MSCA");
  assert.equal(detectFundingFromFields({Titolo: "ERC project"}), "ERC");
});

test("handles missing content without classifying unrelated values", () => {
  assert.equal(detectFundingFromFields({Titolo: null, Link: "PNRR"}), "Non specificato");
  assert.equal(detectFundingFromFields({}), "Non specificato");
});


test("source branding alone does not establish MUR funding", () => {
  assert.equal(detectFundingFromFields({Titolo: "Bando pubblicato sul portale MUR"}), "Non specificato");
  assert.equal(detectFundingFromFields({Titolo: "Progetto finanziato dal MUR"}), "MUR");
});

test("normalization preserves uncertainty rather than inferring a funder", async () => {
  const { toPosition } = await import("./mur-normalize.mjs");
  const record = {title: "Ricerca", institution: "Università", sourceCategory: "test", externalId: "1", sourceUrl: "https://bandi.mur.gov.it/test", deadline: "2026-12-31"};
  assert.equal(toPosition(record).fundingType, "Non specificato");
  assert.equal(toPosition({...record, fundingType: "Non specificato"}).fundingType, "Non specificato");
  assert.equal(toPosition({...record, fundingType: "PRIN"}).fundingType, "PRIN");
});


test("recognizes full MSCA names and typographic variants", () => {
  for (const name of ["Marie Skłodowska-Curie", "Marie Sklodowska Curie", "MARIE SKŁODOWSKA‑CURIE", "Marie-Curie"]) {
    assert.equal(detectFundingFromFields({Titolo: `${name} fellowship`}), "MSCA");
  }
});

test("keeps a specific scheme when its Horizon umbrella is also mentioned", () => {
  assert.equal(detectFundingFromFields({Titolo: "HORIZON-MSCA-2026-PF"}), "MSCA");
  assert.equal(detectFundingFromFields({Titolo: "Horizon Europe ERC project"}), "ERC");
});

test("does not choose arbitrarily between distinct programme mentions", () => {
  assert.equal(detectFundingFromFields({Titolo: "Progetti PRIN e PNRR"}), "Non specificato");
  assert.equal(detectFundingFromFields({Titolo: "Esperienza con programmi MSCA ed ERC"}), "Non specificato");
});
