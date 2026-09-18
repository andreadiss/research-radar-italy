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

test("uses a specific PhD title before administrative application copy", () => {
  const p = toPosition({
    externalId: "phd-machine-learning",
    sourceCategory: "doctorates",
    title: "Machine-learning-based methods for kinetic modelling",
    description: "La selezione richiede curriculum e lettera di motivazione.",
    institution: "Politecnico di Milano",
    city: "Milano",
    sourceUrl: "https://bandi.mur.gov.it/test-phd-machine-learning",
    deadline: "2026-12-31"
  });
  assert.equal(p.discipline, "Ingegneria, informatica e AI");
});

test("does not treat a motivation letter as literature", () => {
  const p = toPosition({
    externalId: "phd-generic",
    sourceCategory: "doctorates",
    title: "Borsa tematica",
    description: "La selezione richiede curriculum e lettera di motivazione.",
    institution: "Università di Milano",
    city: "Milano",
    sourceUrl: "https://bandi.mur.gov.it/test-phd-generic",
    deadline: "2026-12-31"
  });
  assert.equal(p.discipline, "Altro / interdisciplinare");
});

test("still recognizes literature explicitly", () => {
  const p = toPosition({
    externalId: "phd-literature",
    sourceCategory: "doctorates",
    title: "Letteratura italiana contemporanea",
    description: "La selezione richiede curriculum e lettera di motivazione.",
    institution: "Università di Milano",
    city: "Milano",
    sourceUrl: "https://bandi.mur.gov.it/test-phd-literature",
    deadline: "2026-12-31"
  });
  assert.equal(p.discipline, "Filosofia, storia, lingue, pedagogia e psicologia");
});

test("does not treat technical design as architecture or product design", () => {
  const p = toPosition({
    externalId: "phd-reactor-design",
    sourceCategory: "doctorates",
    title: "CFD-assisted innovative reactor design for solid fuel gasification",
    description: "La selezione richiede curriculum e lettera di motivazione.",
    institution: "Politecnico di Milano",
    city: "Milano",
    sourceUrl: "https://bandi.mur.gov.it/test-phd-reactor-design",
    deadline: "2026-12-31"
  });
  assert.equal(p.discipline, "Altro / interdisciplinare");
});

test("classifies groundwater management from the research topic, not generic management", () => {
  const p = toPosition({
    externalId: "phd-groundwater",
    sourceCategory: "doctorates",
    title: "Groundwater modelling for sustainable water resource management",
    description: "La selezione richiede curriculum e lettera di motivazione.",
    institution: "Politecnico di Milano",
    city: "Milano",
    sourceUrl: "https://bandi.mur.gov.it/test-phd-groundwater",
    deadline: "2026-12-31"
  });
  assert.equal(p.discipline, "Ambiente, agraria e veterinaria");
});

test("distinguishes neuromorphic engineering from neuroscience", () => {
  const p = toPosition({
    externalId: "phd-neuromorphic",
    sourceCategory: "doctorates",
    title: "Neuromorphic perception for experimental space surveillance",
    description: "La selezione richiede curriculum e lettera di motivazione.",
    institution: "Politecnico di Milano",
    city: "Milano",
    sourceUrl: "https://bandi.mur.gov.it/test-phd-neuromorphic",
    deadline: "2026-12-31"
  });
  assert.equal(p.discipline, "Ingegneria, informatica e AI");
});

test("prefers the specific doctoral title to secondary subjects in the description", () => {
  const p = toPosition({
    externalId: "phd-musical-heritage",
    sourceCategory: "doctorates",
    title: "Scienze e culture del patrimonio musicale",
    description: "Il corso include anche economia e gestione, didattica e tecnologie digitali.",
    institution: "Conservatorio di Milano",
    city: "Milano",
    sourceUrl: "https://bandi.mur.gov.it/test-phd-musical-heritage",
    deadline: "2026-12-31"
  });
  assert.equal(p.discipline, "Filosofia, storia, lingue, pedagogia e psicologia");
});

test("keeps a multi-area doctoral call interdisciplinary", () => {
  const p = toPosition({
    externalId: "phd-multiple-programmes",
    sourceCategory: "doctorates",
    title: "Bando per l'ammissione ai corsi di dottorato - XLII ciclo",
    description: "Corsi disponibili: informatica e intelligenza artificiale; medicina molecolare; scienze matematiche e fisiche.",
    institution: "Università di Udine",
    city: "Udine",
    sourceUrl: "https://bandi.mur.gov.it/test-phd-multiple-programmes",
    deadline: "2026-12-31"
  });
  assert.equal(p.discipline, "Altro / interdisciplinare");
});
