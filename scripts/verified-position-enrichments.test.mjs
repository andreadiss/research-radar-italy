import assert from "node:assert/strict";
import fs from "node:fs";
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

test("enriches the verified Sapienza research assignment with official details", () => {
  const position = applyVerifiedPositionEnrichment({
    id: "mur-research-assignments-317744",
    summary: "Incarico di ricerca PSIC-04/B",
    duration: "Da bando ufficiale",
    salaryOrAmount: "Da bando ufficiale",
    requirements: ["Requisiti indicati nel bando ufficiale"]
  });

  assert.equal(position.duration, "12 mesi");
  assert.equal(position.salaryOrAmount, "€ 22.500,00 lordo dipendente");
  assert.match(position.summary, /psicologia clinica, forense e psicodiagnostica/);
  assert.deepEqual(position.requirements, [
    "Titolo di Laurea Magistrale o a ciclo unico in Psicologia (LM-51), conseguito da non più di sei anni"
  ]);
  assert.match(position.verificationUrl, /details\/30709\/ir-0226/);
});

test("leaves every non-target position unchanged", () => {
  const position = { id: "mur-postdoc-assignments-other", summary: "Originale" };
  assert.equal(applyVerifiedPositionEnrichment(position), position);
});

test("replaces a URL-only summary with verified source fields", () => {
  const position = applyVerifiedPositionEnrichment({
    id: "mur-fixed-term-researchers-example",
    title: "Procedura selettiva per un ricercatore in tenure track",
    institution: "Università di Esempio",
    positionType: "RTT",
    ssd: "IBIO-01/A - Bioingegneria",
    deadline: "2026-10-05",
    summary: "https://www.example.edu/concorsi"
  });

  assert.equal(
    position.summary,
    "RTT presso Università di Esempio nel settore IBIO-01/A - Bioingegneria. Scadenza per le candidature: 5 ottobre 2026."
  );
});

test("keeps a substantive title when an official description is only a URL", () => {
  const position = applyVerifiedPositionEnrichment({
    id: "mur-research-assignments-example",
    title: "Analisi di sistemi complessi",
    institution: "Università di Esempio",
    positionType: "Incarico di ricerca",
    ssd: "-",
    deadline: "2026-10-14",
    summary: "https://www.example.edu/bando"
  });

  assert.equal(
    position.summary,
    "Incarico di ricerca presso Università di Esempio sul tema “Analisi di sistemi complessi”. Scadenza per le candidature: 14 ottobre 2026."
  );
});

test("no generated position is published with a URL-only summary", () => {
  const positions = JSON.parse(
    fs.readFileSync(new URL("../lib/generated/mur-positions.json", import.meta.url), "utf8")
  );
  const urlOnly = (value) => /^https?:\/\/\S+$/i.test(String(value ?? "").trim());
  const affected = positions.filter((position) => urlOnly(position.summary));

  assert.ok(affected.length > 0, "fixture must exercise the fallback");
  assert.deepEqual(
    affected.map(applyVerifiedPositionEnrichment).filter((position) => urlOnly(position.summary)),
    []
  );
});
