const proceduralOpening = /^(selezione pubblica|procedura selettiva|procedura di selezione|avviso pubblico|procedura comparativa|bando di selezione)\b/i;

export function positionTopicPresentation(title, summary) {
  const officialTitle = cleanText(title);
  const sourceSummary = cleanText(summary);

  if (!proceduralOpening.test(sourceSummary)) {
    return {
      label: "Argomento o descrizione del bando",
      text: sourceSummary
    };
  }

  if (officialTitle && !proceduralOpening.test(officialTitle)) {
    return {
      label: "Argomento dal titolo ufficiale",
      text: officialTitle
    };
  }

  return {
    label: "Argomento",
    text: "Non specificato nella descrizione MUR disponibile; consulta il bando ufficiale."
  };
}

function cleanText(value) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}
