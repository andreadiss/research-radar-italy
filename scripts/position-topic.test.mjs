import assert from "node:assert/strict";
import test from "node:test";
import { positionTopicPresentation } from "../lib/position-topic.mjs";

test("keeps a substantive source description", () => {
  assert.deepEqual(
    positionTopicPresentation(
      "Analisi di sistemi complessi",
      "Il progetto studia nuovi metodi per analizzare sistemi complessi."
    ),
    {
      label: "Argomento o descrizione del bando",
      text: "Il progetto studia nuovi metodi per analizzare sistemi complessi."
    }
  );
});

test("uses the official title when the description is only procedural", () => {
  assert.deepEqual(
    positionTopicPresentation(
      "SMART-SLD: approcci multidisciplinari per studenti con disturbi specifici dell'apprendimento",
      "Procedura di selezione per il conferimento di n. 1 incarico post-doc."
    ),
    {
      label: "Argomento dal titolo ufficiale",
      text: "SMART-SLD: approcci multidisciplinari per studenti con disturbi specifici dell'apprendimento"
    }
  );
});

test("uses an explicitly quoted official project title in a procedural description", () => {
  assert.deepEqual(
    positionTopicPresentation(
      "Selezione pubblica per n. 1 incarico post-doc",
      "Selezione pubblica nell’ambito del progetto dal titolo “Altermagnetism: a promising landscape for future technology” – acronimo MARGARET."
    ),
    {
      label: "Argomento dal progetto ufficiale",
      text: "Altermagnetism: a promising landscape for future technology"
    }
  );
});

test("does not infer a topic from an unquoted project reference", () => {
  assert.deepEqual(
    positionTopicPresentation(
      "Selezione pubblica per n. 1 incarico post-doc",
      "Selezione pubblica finanziata nell’ambito del progetto MARGARET."
    ),
    {
      label: "Argomento",
      text: "Non specificato nella descrizione MUR disponibile; consulta il bando ufficiale."
    }
  );
});

test("signals when neither description nor title specifies a topic", () => {
  assert.deepEqual(
    positionTopicPresentation(
      "Procedura selettiva per una posizione RTT",
      "Selezione pubblica per il reclutamento di un ricercatore."
    ),
    {
      label: "Argomento",
      text: "Non specificato nella descrizione MUR disponibile; consulta il bando ufficiale."
    }
  );
});

test("does not present an administrative professor title as a research topic", () => {
  assert.deepEqual(
    positionTopicPresentation(
      "n.1 professoressa/professore associata/o, finanziato dalla RAS - GSD 13/ECON-07",
      "Procedura selettiva per la copertura di un posto."
    ),
    {
      label: "Argomento",
      text: "Non specificato nella descrizione MUR disponibile; consulta il bando ufficiale."
    }
  );
});

test("does not present an administrative research-contract title as a topic", () => {
  assert.deepEqual(
    positionTopicPresentation(
      "n. 3 contratti di ricerca art. 22",
      "Bando di selezione per il conferimento di contratti di ricerca."
    ),
    {
      label: "Argomento",
      text: "Non specificato nella descrizione MUR disponibile; consulta il bando ufficiale."
    }
  );
});
