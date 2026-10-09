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

test("replaces a title-only administrative summary without repeating the title", () => {
  const position = applyVerifiedPositionEnrichment({
    id: "mur-fixed-term-researchers-title-only",
    title: "Selezione pubblica per il reclutamento di n. 1 Ricercatore a tempo determinato",
    institution: "Università di Ferrara",
    positionType: "RTT",
    ssd: "IIND-07/B - Fisica tecnica ambientale",
    deadline: "2026-10-05",
    summary: "Selezione pubblica per il reclutamento di n. 1 Ricercatore a tempo determinato."
  });

  assert.equal(
    position.summary,
    "RTT presso Università di Ferrara nel settore IIND-07/B - Fisica tecnica ambientale. Scadenza per le candidature: 5 ottobre 2026."
  );
});

test("adds context to a substantive title-only summary", () => {
  const position = applyVerifiedPositionEnrichment({
    id: "mur-postdoc-assignments-title-only",
    title: "Analisi dati ecologici spaziali",
    institution: "Sapienza Università di Roma",
    positionType: "Postdoc",
    ssd: "BIOS-03/A - Zoologia",
    deadline: "2026-10-07",
    summary: "Analisi dati ecologici spaziali."
  });

  assert.equal(
    position.summary,
    "Postdoc presso Sapienza Università di Roma nel settore BIOS-03/A - Zoologia sul tema “Analisi dati ecologici spaziali”. Scadenza per le candidature: 7 ottobre 2026."
  );
});

test("replaces a bare postdoc label with its verified topic and sector", () => {
  const position = applyVerifiedPositionEnrichment({
    id: "mur-postdoc-assignments-udine",
    title: "Developing chromosome transplant technologies towards universal cell therapies”",
    institution: "Università degli Studi di Udine",
    positionType: "Postdoc",
    ssd: "BIOS-07/A - Biochimica",
    deadline: "2026-10-20",
    summary: "Incarico post-doc"
  });

  assert.equal(
    position.summary,
    "Postdoc presso Università degli Studi di Udine nel settore BIOS-07/A - Biochimica sul tema “Developing chromosome transplant technologies towards universal cell therapies”. Scadenza per le candidature: 20 ottobre 2026."
  );
});

test("does not replace a bare postdoc label when the title is administrative", () => {
  const position = {
    id: "mur-postdoc-assignments-generic",
    title: "Selezione pubblica per incarichi post-doc",
    institution: "Università di Esempio",
    positionType: "Postdoc",
    ssd: "BIOS-07/A - Biochimica",
    deadline: "2026-10-20",
    summary: "Incarico post-doc"
  };

  assert.equal(applyVerifiedPositionEnrichment(position), position);
});

test("replaces Bicocca postdoc boilerplate with sector and duration", () => {
  const position = applyVerifiedPositionEnrichment({
    id: "mur-postdoc-assignments-316864",
    title: "procedura selettiva per il conferimento di n. 1 incarico post-doc",
    institution: "Università degli Studi di Milano - Bicocca",
    positionType: "Postdoc",
    ssd: "BIOS-15/A - Microbiologia",
    duration: "12 mesi",
    deadline: "2026-10-10",
    summary: "Selezione pubblica per il conferimento di n. 1 incarico post-doc, ai sensi dell’art. 22 bis della Legge 240/2010"
  });

  assert.equal(
    position.summary,
    "Postdoc presso Università degli Studi di Milano - Bicocca nel settore BIOS-15/A - Microbiologia. Durata: 12 mesi. Scadenza per le candidature: 10 ottobre 2026."
  );
});

test("does not rewrite similar boilerplate from an unverified institution", () => {
  const position = {
    id: "mur-postdoc-assignments-other-institution",
    title: "procedura selettiva per il conferimento di n. 1 incarico post-doc",
    institution: "Altra Università",
    positionType: "Postdoc",
    ssd: "BIOS-15/A - Microbiologia",
    duration: "12 mesi",
    deadline: "2026-10-10",
    summary: "Selezione pubblica per il conferimento di n. 1 incarico post-doc, ai sensi dell’art. 22 bis della Legge 240/2010"
  };

  assert.equal(applyVerifiedPositionEnrichment(position), position);
});

test("no generated position is published with a URL-only or title-only summary", () => {
  const positions = JSON.parse(
    fs.readFileSync(new URL("../lib/generated/mur-positions.json", import.meta.url), "utf8")
  );
  const urlOnly = (value) => /^https?:\/\/\S+$/i.test(String(value ?? "").trim());
  const normalize = (value) => String(value ?? "").toLocaleLowerCase("it").replace(/[^a-z0-9à-ÿ]+/gi, " ").trim();
  const titleOnly = (position) => normalize(position.summary) && normalize(position.summary) === normalize(position.title);
  const affected = positions.filter((position) => urlOnly(position.summary) || titleOnly(position));

  assert.deepEqual(
    affected
      .map(applyVerifiedPositionEnrichment)
      .filter((position) => urlOnly(position.summary) || titleOnly(position)),
    []
  );
});

test("the verified Bicocca postdoc group retains distinct context after sync", () => {
  const positions = JSON.parse(
    fs.readFileSync(new URL("../lib/generated/mur-positions.json", import.meta.url), "utf8")
  );
  const affected = positions.filter((position) =>
    position.institution === "Università degli Studi di Milano - Bicocca" &&
    position.positionType === "Postdoc" &&
    /^procedura selettiva per il conferimento di n\. 1 incarico post-doc$/i.test(position.title) &&
    position.deadline === "2026-10-10" &&
    position.ssd && position.ssd !== "-"
  );

  assert.ok(affected.map(applyVerifiedPositionEnrichment).every((position) =>
    position.summary.includes(position.ssd) && position.summary.includes(position.duration)
  ));
});

test("bare postdoc summaries retain verified topic context after sync", () => {
  const positions = JSON.parse(
    fs.readFileSync(new URL("../lib/generated/mur-positions.json", import.meta.url), "utf8")
  );
  const affected = positions.filter((position) =>
    position.positionType === "Postdoc" &&
    /^incarico post-doc$/i.test(String(position.summary ?? "").trim())
  );

  assert.ok(affected.map(applyVerifiedPositionEnrichment).every((position) =>
    position.summary.includes(position.title) && position.summary.includes(position.ssd)
  ));
});
