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
  }
};

export function applyVerifiedPositionEnrichment(position) {
  const enrichment = verifiedPositionEnrichments[position.id];
  return enrichment ? { ...position, ...enrichment } : position;
}
