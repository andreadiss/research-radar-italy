// Restrict the existing funding heuristic to call-specific fields.
// Navigation, footer, institution and arbitrary table fields are not evidence.
const evidenceFields = new Set([
  "Titolo del progetto di ricerca in italiano", "Titolo del progetto di ricerca",
  "Titolo del progetto di ricerca in inglese", "Nome bando", "Titolo",
  "Descrizione sintetica in italiano", "Descrizione del bando in italiano",
  "Descrizione sintetica in inglese", "Descrizione del bando in inglese"
]);

export function detectFundingFromFields(fields) {
  const evidence = Object.entries(fields)
    .filter(([key, value]) => evidenceFields.has(key) && typeof value === "string")
    .map(([, value]) => value).join(" ");
  return detectFundingType(evidence);
}

// MUR remains the legacy fallback; it does not establish a verified funder.
function detectFundingType(text) {
  const upper = text.toUpperCase();
  if (/\bPNRR\b/.test(upper)) return "PNRR";
  if (/\bPRIN\b/.test(upper)) return "PRIN";
  if (/\bERC\b/.test(upper)) return "ERC";
  if (/\bMARIE CURIE\b/.test(upper) || /\bMSCA\b/.test(upper)) return "MSCA";
  if (/\bHORIZON\b/.test(upper)) return "Horizon";
  return "MUR";
}
