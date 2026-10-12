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
