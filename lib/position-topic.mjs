const proceduralOpening = /^(selezione pubblica|procedura selettiva|procedura di selezione|avviso pubblico|procedura comparativa|bando di selezione)\b/i;
const administrativeTitle = /^(?:(?:n\.\s*)?\d+\s+(?:(?:posti?|posizioni?)\s+(?:da|di)\s+)?(?:professor|ricercator|contratt|incarich)|(?:contratto|incarico)\s+(?:di ricerca|post-doc)\s+art\.)/i;

export function positionTopicPresentation(title, summary) {
  const officialTitle = cleanText(title);
  const sourceSummary = cleanText(summary);

  if (!proceduralOpening.test(sourceSummary)) {
    return {
      label: "Argomento o descrizione del bando",
      text: sourceSummary
    };
  }

  if (officialTitle && !proceduralOpening.test(officialTitle) && !administrativeTitle.test(officialTitle)) {
    return {
      label: "Argomento dal titolo ufficiale",
      text: officialTitle
    };
  }

  const explicitProjectTitle = extractExplicitProjectTitle(sourceSummary);
  if (explicitProjectTitle) {
    return {
      label: "Argomento dal progetto ufficiale",
      text: explicitProjectTitle
    };
  }

  return {
    label: "Argomento",
    text: "Non specificato nella descrizione MUR disponibile; consulta il bando ufficiale."
  };
}

function extractExplicitProjectTitle(value) {
  const match = value.match(/progetto dal titolo\s*[“"]([^”"]{5,180})[”"]/i);
  return match ? cleanText(match[1]) : "";
}

function cleanText(value) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}
