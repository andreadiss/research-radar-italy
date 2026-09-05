import test from "node:test";
import assert from "node:assert/strict";
import { detectFundingFromFields } from "./mur-funding.mjs";

test("ignores programme names outside call content", () => {
  assert.equal(detectFundingFromFields({
    Titolo: "Progetto FANDEMIA finanziato MUR FIS 3",
    Menu: "ERC MSCA PRIN PNRR Horizon",
    "Organizzazione/Ente": "MSCA research office"
  }), "MUR");
});

test("recognizes programme references in call title and description", () => {
  assert.equal(detectFundingFromFields({"Nome bando": "Progetto PRIN 2026"}), "PRIN");
  assert.equal(detectFundingFromFields({"Descrizione sintetica in inglese": "MSCA fellowship"}), "MSCA");
  assert.equal(detectFundingFromFields({Titolo: "ERC project"}), "ERC");
});

test("handles missing content without classifying unrelated values", () => {
  assert.equal(detectFundingFromFields({Titolo: null, Link: "PNRR"}), "MUR");
  assert.equal(detectFundingFromFields({}), "MUR");
});
