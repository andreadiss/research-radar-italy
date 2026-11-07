export const october2026Insight = {
  path: "/insights/2026-10",
  month: "Ottobre 2026",
  title: "Ottobre: cosa emerge dai bandi raccolti",
  summary: "Posizioni, settori e temi in 929 schede del catalogo."
} as const;

// Newest first. Each edition keeps its permanent URL.
export const insightEditions = [
  october2026Insight,
  {
    path: "/insights/2026-09",
    month: "Settembre 2026",
    title: "Ricerca universitaria: settembre in 984 schede",
    summary: "Posizioni, settori e temi del mese."
  }
] as const;

export const latestInsight = insightEditions[0];
