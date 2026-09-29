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
  return enrichment ? { ...position, ...enrichment } : position;
}
