const verifiedPositionEnrichments = {
  "mur-postdoc-assignments-317743": {
    verificationUrl: "https://web.uniroma1.it/trasparenza/bando/246703_ipd-01/26",
    summary:
      "L’incarico riguarda attività di ricerca e collaborazione didattica in psichiatria: corsi ECM provider Sapienza, corso integrato di Psichiatria e Psicologia Clinica e protocolli attivi in psichiatria di consultazione e nei pazienti con disturbo ossessivo-compulsivo.",
    duration: "12 mesi",
    salaryOrAmount: "€ 39.224,28 lordo dipendente",
    requirements: [
      "Titolo di Dottore di Ricerca e specializzazione di area medica in Psichiatria"
    ]
  },
  "mur-research-assignments-317744": {
    verificationUrl:
      "https://trasparenza.uniroma1.it/page/5/details/30709/ir-0226-selezione-pubblica-per-il-conferimento-di-n-1-incarico-di-ricerca-psic-04b-neuroscienze-umane-fondi-ateneo-delibere-sa-n-282026-e-cda-n-4526.html",
    summary:
      "L’incarico riguarda ricerca in psicologia clinica, forense e psicodiagnostica, con focus sulla valutazione della validità della risposta e degli stili di risposta; prevede progettazione di studi sperimentali e raccolta, gestione e analisi statistica dei dati.",
    duration: "12 mesi",
    salaryOrAmount: "€ 22.500,00 lordo dipendente",
    requirements: [
      "Titolo di Laurea Magistrale o a ciclo unico in Psicologia (LM-51), conseguito da non più di sei anni"
    ]
  }
};

export function applyVerifiedPositionEnrichment(position) {
  const enrichment = verifiedPositionEnrichments[position.id];
  const enriched = enrichment ? { ...position, ...enrichment } : position;

  if (!needsContextualSummary(enriched)) return enriched;

  return {
    ...enriched,
    summary: buildSourceFieldSummary(enriched, { includeDuration: isBicoccaPostdocBoilerplate(enriched) })
  };
}

function isUrlOnly(value) {
  return /^https?:\/\/\S+$/i.test(String(value ?? "").trim());
}

function needsContextualSummary(position) {
  const summary = cleanText(position.summary);
  const title = cleanText(position.title);
  return isUrlOnly(summary) ||
    (summary && title && normalizeForComparison(summary) === normalizeForComparison(title)) ||
    isBicoccaPostdocBoilerplate(position);
}

function normalizeForComparison(value) {
  return cleanText(value).toLocaleLowerCase("it").replace(/[^a-z0-9à-ÿ]+/gi, " ").trim();
}

function buildSourceFieldSummary(position, { includeDuration = false } = {}) {
  const type = cleanText(position.positionType) || "Opportunità di ricerca";
  const institution = cleanText(position.institution) || "l’ente indicato nel bando";
  const sector = cleanText(position.ssd);
  const title = cleanText(position.title);
  const parts = [`${type} presso ${institution}`];

  if (sector && sector !== "-") parts.push(`nel settore ${sector}`);
  if (title && !isGenericAdministrativeTitle(title)) parts.push(`sul tema “${title}”`);

  const duration = includeDuration ? cleanText(position.duration) : "";
  const deadline = formatItalianDate(position.deadline);
  return `${parts.join(" ")}.${duration && duration !== "Da bando ufficiale" ? ` Durata: ${duration}.` : ""}${deadline ? ` Scadenza per le candidature: ${deadline}.` : ""}`;
}

function isBicoccaPostdocBoilerplate(position) {
  const title = cleanText(position.title);
  const summary = cleanText(position.summary);
  const sector = cleanText(position.ssd);
  return cleanText(position.institution) === "Università degli Studi di Milano - Bicocca" &&
    position.positionType === "Postdoc" &&
    /^procedura selettiva per il conferimento di n\. 1 incarico post-doc$/i.test(title) &&
    /^selezione pubblica per il conferimento di n\. 1 incarico post-doc\b/i.test(summary) &&
    sector && sector !== "-";
}

function isGenericAdministrativeTitle(value) {
  return /^(procedura selettiva|selezione pubblica|procedura di selezione|avviso pubblico)\b/i.test(value);
}

function cleanText(value) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function formatItalianDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(cleanText(value));
  if (!match) return "";

  const months = [
    "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
    "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"
  ];
  const month = months[Number(match[2]) - 1];
  return month ? `${Number(match[3])} ${month} ${match[1]}` : "";
}
