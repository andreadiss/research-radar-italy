export function normalizeRecords(records) {
  return dedupePositions(
    records
      .map(toPosition)
      .filter((position) => position.title && position.institution && position.deadline)
  );
}

export function toPosition(record) {
  const description = firstText(record.description, record.descriptionEn, record.title);
  const title = firstText(record.title, record.titleEn, `${record.positionType} - ${record.institution}`);
  const institution = cleanInstitution(record.institution);
  const sourceUrl = canonicalizeUrl(record.sourceUrl);
  const location = normalizeLocation(firstText(record.city, record.province, "Italia"));
  const professorRank = inferProfessorRank(record);
  const requirements = [record.requirements, record.applicationMode]
    .filter(Boolean)
    .map((value) => truncate(value, 180));

  const review = reviewSignals({
    title,
    institution,
    location,
    region: inferRegion(location, institution, description),
    discipline: inferDiscipline(record.researchField, record.gsd, record.ssd, description),
    sourceUrl
  });

  return {
    id: `mur-${record.sourceCategory}-${record.externalId}`,
    title,
    institution,
    department: firstText(
      record.department,
      record.rawFields?.["Facolta/Dipartimento/Laboratorio di ricerca"],
      record.rawFields?.["Facolta'/Dipartimento/Laboratorio di ricerca"],
      "Da bando ufficiale"
    ),
    location,
    region: review.region,
    positionType: normalizePositionType(record.positionType, record, professorRank),
    professorRank,
    discipline: review.discipline,
    ssd: firstText(record.ssd, record.gsd, "-"),
    gsd: firstText(record.gsd, ""),
    fundingType: normalizeFunding(record.fundingType),
    deadline: record.deadline,
    deadlineStatus: deadlineStatus(record.deadline),
    publishedAt: firstText(record.publishedAt, record.importedAt?.slice(0, 10), ""),
    sourceName: record.sourceName,
    sourceUrl,
    salaryOrAmount: formatAmount(record.amount, record.rawFields?.Valuta),
    duration: record.duration || "Da bando ufficiale",
    language: record.descriptionEn ? "IT/EN" : "IT",
    summary: truncate(description, 420),
    requirements: requirements.length > 0 ? requirements : ["Requisiti indicati nel bando ufficiale"],
    dedupeKey: dedupeKey({ title, institution, deadline: record.deadline }),
    reviewStatus: review.status,
    confidenceScore: review.confidenceScore,
    reviewReasons: review.reasons
  };
}

function dedupePositions(items) {
  const bySourceId = new Map();
  const byUrl = new Map();
  const byComposite = new Map();

  for (const item of items) {
    const existing =
      bySourceId.get(item.id) ??
      byUrl.get(item.sourceUrl);

    if (existing) {
      existing.duplicateSourceIds = Array.from(new Set([...(existing.duplicateSourceIds ?? []), item.id]));
      continue;
    }

    const compositeKey = isSpecificDedupeKey(item.dedupeKey) ? item.dedupeKey : "";
    const possibleDuplicate = compositeKey ? byComposite.get(compositeKey) : undefined;

    if (possibleDuplicate) {
      item.possibleDuplicateOf = possibleDuplicate.id;
      item.reviewStatus = "needs_review";
      item.reviewReasons = Array.from(new Set([...(item.reviewReasons ?? []), "possible_duplicate"]));
      item.confidenceScore = Math.min(item.confidenceScore ?? 0.8, 0.71);
      possibleDuplicate.possibleDuplicateSourceIds = Array.from(
        new Set([...(possibleDuplicate.possibleDuplicateSourceIds ?? []), item.id])
      );
    }

    bySourceId.set(item.id, item);
    byUrl.set(item.sourceUrl, item);
    if (compositeKey) {
      byComposite.set(compositeKey, item);
    }
  }

  return Array.from(bySourceId.values());
}

function firstText(...values) {
  return values.find((value) => typeof value === "string" && value.trim())?.trim() ?? "";
}

function truncate(value, maxLength) {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1).trim()}...` : clean;
}

function cleanInstitution(value) {
  return String(value ?? "").replace(/\s+/g, " ").replace(/^UNIVERSITA'/i, "Universita").trim();
}

function normalizePositionType(value, record, professorRank = "") {
  const text = searchText(value, record.title, record.titleEn, record.description, record.descriptionEn, record.contractType);
  if (record.sourceCategory === "fixed-term-researchers") return "RTT";
  if (record.sourceCategory === "research-contracts") return "Contratto di ricerca";
  if (record.sourceCategory === "research-assignments") return "Incarico di ricerca";
  if (record.sourceCategory === "postdoc-assignments") return "Postdoc";
  if (record.sourceCategory === "technologists") return "Tecnologo";
  if (record.sourceCategory === "doctorates") return "PhD";
  if (record.sourceCategory === "professor-calls" && professorRank) return professorRank;
  if (text.includes("postdoc")) return "Postdoc";
  if (text.includes("incarico")) return "Incarico di ricerca";
  if (text.includes("contratto")) return "Contratto di ricerca";
  if (text.includes("tecnologo")) return "Tecnologo";
  if (text.includes("phd") || text.includes("dottorato")) return "PhD";
  if (text.includes("professore straordinario")) return "Professore straordinario";
  if (text.includes("professore ordinario") || text.includes("prima fascia")) return "Professore I fascia";
  if (text.includes("professore") || text.includes("associato") || text.includes("seconda fascia")) {
    return "Professore II fascia";
  }
  if (text.includes("rtt") || text.includes("ricercatore")) return "RTT";
  return value;
}

function normalizeFunding(value) {
  const allowed = new Set(["MUR", "PNRR", "PRIN", "ERC", "Horizon", "MSCA", "Dipartimentale"]);
  return allowed.has(value) ? value : "MUR";
}

function inferDiscipline(...values) {
  const text = searchText(...values);
  const sector = sectorPrefix(...values);

  if (sector === "06") return "Medicina e salute";
  if (sector === "05") return "Biologia, biotech e farmacia";
  if (sector === "09" || /01\/info|info-01/.test(text)) return "Ingegneria, informatica e AI";
  if (["01", "02", "03"].includes(sector)) return "Matematica, fisica e chimica";
  if (["04", "07"].includes(sector)) return "Ambiente, agraria e veterinaria";
  if (sector === "08") return "Architettura, design e territorio";
  if (["12", "13", "14"].includes(sector)) return "Economia, diritto e politica";
  if (["10", "11"].includes(sector)) return "Filosofia, storia, lingue, pedagogia e psicologia";

  if (/\b06\/|meds|medicin|clinical|sanitar|health|chirurg|cardiolog|neurolog/.test(text)) {
    return "Medicina e salute";
  }
  if (/\b05\/|bios|biolog|biochim|biotec|farmac|neuro|bioinformat/.test(text)) {
    return "Biologia, biotech e farmacia";
  }
  if (/\b09\/|\b01\/info|iind|iinf|info-01|informat|computer|software|data science|machine learning|robot|elettronic|automatica/.test(text)) {
    return "Ingegneria, informatica e AI";
  }
  if (/\b01\/|\b02\/|\b03\/|math|matemat|statistic|phys|fisic|astronom|chem|chimic/.test(text)) {
    return "Matematica, fisica e chimica";
  }
  if (/\b04\/|\b07\/|earth|geolog|geo|agri|veterinar|food|agrar|ambient/.test(text)) {
    return "Ambiente, agraria e veterinaria";
  }
  if (/\b08\/|cear|architett|design|urban|territor|civil|edil|costruzion/.test(text)) {
    return "Architettura, design e territorio";
  }
  if (/\b12\/|\b13\/|\b14\/|giur|diritto|law|econ|econom|management|finanz|politic|relazioni internazionali/.test(text)) {
    return "Economia, diritto e politica";
  }
  if (/\b10\/|\b11\/|hist|filol|letter|linguist|cultural|archeolog|filosof|psicolog|sociolog|pedagog|anthropolog/.test(text)) {
    return "Filosofia, storia, lingue, pedagogia e psicologia";
  }
  return "Altro / interdisciplinare";
}

function inferRegion(...values) {
  const city = searchText(...values);
  const map = [
    [/aosta/, "Valle d'Aosta"],
    [/torino|turin|novara|vercelli|alessandria|cuneo|asti/, "Piemonte"],
    [/milano|milan|pavia|brescia|bergamo|como|lecco|varese|mantova|cremona|lodi|pieve emanuele/, "Lombardia"],
    [/bolzano|bozen|trento/, "Trentino-Alto Adige"],
    [/padova|padua|venezia|venice|verona|vicenza|treviso|rovigo|belluno/, "Veneto"],
    [/trieste|udine/, "Friuli-Venezia Giulia"],
    [/genova|genoa|savona|imperia|la spezia/, "Liguria"],
    [/bologna|modena|parma|ferrara|ravenna|forli|cesena|rimini|reggio emilia/, "Emilia-Romagna"],
    [/lucca|pisa|firenze|florence|siena|arezzo|livorno|grosseto|prato|pistoia/, "Toscana"],
    [/perugia|terni/, "Umbria"],
    [/ancona|urbino|macerata|camerino|ascoli|pesaro/, "Marche"],
    [/roma|rome|viterbo|latina|frosinone|rieti/, "Lazio"],
    [/l'aquila|aquila|chieti|pescara|teramo/, "Abruzzo"],
    [/campobasso|isernia/, "Molise"],
    [/napoli|naples|salerno|benevento|caserta|avellino/, "Campania"],
    [/lecce|bari|foggia|taranto|brindisi/, "Puglia"],
    [/potenza|matera/, "Basilicata"],
    [/catanzaro|cosenza|reggio calabria|crotone|vibo valentia/, "Calabria"],
    [/palermo|catania|messina|cefalu|agrigento|caltanissetta|enna|ragusa|siracusa|trapani/, "Sicilia"],
    [/cagliari|sassari|oristano|nuoro/, "Sardegna"]
  ];
  return map.find(([pattern]) => pattern.test(city))?.[1] ?? "Italia";
}

function formatAmount(amount, currency) {
  if (!amount) return "Da bando ufficiale";
  const number = Number(String(amount).replace(/[^\d.,]/g, "").replace(",", "."));
  const label = Number.isFinite(number) ? new Intl.NumberFormat("it-IT").format(number) : amount;
  return currency ? `${label} ${currency}` : label;
}

function inferProfessorRank(record) {
  const text = searchText(
    record.positionType,
    record.title,
    record.titleEn,
    record.contractType,
    record.description,
    record.descriptionEn,
    record.rawFields?.Qualifica,
    record.rawFields?.["Tipo di contratto"]
  );

  if (/professore straordinario|straordinario/.test(text)) return "Professore straordinario";
  if (/professore ordinario|ordinario|prima fascia|\bi fascia\b|\b1 fascia\b/.test(text)) return "Professore I fascia";
  if (/professore associato|associato|seconda fascia|\bii fascia\b|\b2 fascia\b/.test(text)) return "Professore II fascia";
  return "";
}

function deadlineStatus(value) {
  if (!value) return "unknown";
  const today = new Date().toISOString().slice(0, 10);
  if (value < today) return "expired";

  const deadline = new Date(`${value}T00:00:00Z`);
  const now = new Date(`${today}T00:00:00Z`);
  const days = Math.ceil((deadline.getTime() - now.getTime()) / 86400000);
  return days <= 14 ? "closing_soon" : "open";
}

function canonicalizeUrl(value) {
  try {
    const url = new URL(value);
    url.hash = "";
    url.searchParams.sort();
    return url.href.replace(/\/$/, "");
  } catch {
    return String(value ?? "").trim();
  }
}

function dedupeKey({ title, institution, deadline }) {
  return [normalizeKey(title), normalizeKey(institution), deadline].filter(Boolean).join("|");
}

function isSpecificDedupeKey(value) {
  const [titleKey] = String(value ?? "").split("|");
  if (titleKey.length < 32) return false;
  if (/^(postdoc|incarico ricerca|contratto ricerca|assegno ricerca|tecnologo|phd)(\s|$)/.test(titleKey)) return false;
  return true;
}

function normalizeKey(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(universita|university|degli|delle|della|del|di|the|and|at|presso)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeLocation(value) {
  return value
    .replace(/\bMilan\b/i, "Milano")
    .replace(/\bRome\b/i, "Roma")
    .replace(/\bVenice\b/i, "Venezia")
    .replace(/\bGenoa\b/i, "Genova")
    .replace(/\bTurin\b/i, "Torino")
    .replace(/\bNaples\b/i, "Napoli")
    .replace(/\s+/g, " ")
    .trim();
}

function searchText(...values) {
  return values
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function sectorPrefix(...values) {
  const text = values.filter(Boolean).join(" ");
  return text.match(/\b(0[1-9]|1[0-4])\//)?.[1] ?? "";
}

function reviewSignals({ title, institution, location, region, discipline, sourceUrl }) {
  const reasons = [];

  if (!sourceUrl) reasons.push("missing_source_url");
  if (region === "Italia") reasons.push("unknown_region");
  if (discipline === "Altro / interdisciplinare") reasons.push("unknown_discipline");
  if (normalizeKey(title).length < 32) reasons.push("generic_title");
  if (normalizeKey(institution).length < 4) reasons.push("generic_institution");
  if (normalizeKey(location) === "italia") reasons.push("generic_location");

  const confidenceScore = Math.max(0.35, Number((0.95 - reasons.length * 0.12).toFixed(2)));

  return {
    region,
    discipline,
    reasons,
    confidenceScore,
    status: reasons.length > 0 ? "needs_review" : "auto_published"
  };
}
