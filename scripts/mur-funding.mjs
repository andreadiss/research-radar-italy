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

// The source portal is not evidence of who funds the call.
function detectFundingType(text) {
  const upper = text.toUpperCase().normalize("NFKD")
    .replace(/\p{M}/gu, "").replace(/Ł/g, "L").replace(/[‐‑–—]/g, "-");
  const matches = new Set();
  if (/\bPNRR\b/.test(upper)) matches.add("PNRR");
  if (/\bPRIN\b/.test(upper)) matches.add("PRIN");
  if (/\bERC\b/.test(upper)) matches.add("ERC");
  if (/\bMARIE[\s-]+(?:SKLODOWSKA[\s-]+)?CURIE\b|\bMSCA\b/.test(upper)) matches.add("MSCA");
  if (/\bHORIZON\b/.test(upper)) matches.add("Horizon");
  // Horizon is the umbrella programme for these more specific schemes.
  if (matches.has("MSCA") || matches.has("ERC")) matches.delete("Horizon");
  // Distinct programme mentions are not enough to choose one as the funder.
  if (matches.size > 1) return "Non specificato";
  if (matches.size === 1) return [...matches][0];
  if (/(?:FINANZIAT[OAIE]|FUNDED|FINANZIAMENTO)[^.]{0,80}\bMUR\b|\bFONDO ITALIANO PER LA SCIENZA\b|\bFIS\s*3\b/.test(upper)) return "MUR";
  return "Non specificato";
}
