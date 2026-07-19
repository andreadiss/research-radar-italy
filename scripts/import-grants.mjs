import { mkdir, readFile, writeFile } from "node:fs/promises";

const outputPath = "lib/generated/grants.json";
const pnrrReportPath = "data/store/pnrr-classification-report.json";
const sourceReportPath = "data/store/grants-source-report.json";
const useLive = process.argv.includes("--live");
const existingGrantBaselineDate = "2026-05-05";
const importDate = new Date().toISOString().slice(0, 10);
const italianMonths = {
  gennaio: "01",
  febbraio: "02",
  marzo: "03",
  aprile: "04",
  maggio: "05",
  giugno: "06",
  luglio: "07",
  agosto: "08",
  settembre: "09",
  ottobre: "10",
  novembre: "11",
  dicembre: "12"
};

const curatedGrants = [
  {
    id: "msca-postdoctoral-fellowships-2026",
    title: "MSCA Postdoctoral Fellowships 2026",
    program: "MSCA",
    funder: "Commissione Europea",
    discipline: "Tutte le discipline",
    deadline: "2026-09-09",
    deadlineStatus: "open",
    publishedAt: "2026-04-09",
    sourceName: "European Research Executive Agency",
    sourceUrl:
      "https://rea.ec.europa.eu/funding-and-grants/horizon-europe-marie-sklodowska-curie-actions/msca-postdoctoral-fellowships_en",
    amount: "399.05 million euro overall indicative budget",
    eligibility: "Postdoctoral researchers; mobility-based European and Global Fellowships",
    summary:
      "Call 2026 per progetti individuali di ricerca e formazione postdoc, con mobilita internazionale, interdisciplinare e intersettoriale.",
    status: "open",
    sourceType: "official_call"
  },
  {
    id: "msca-doctoral-networks-2026",
    title: "MSCA Doctoral Networks 2026",
    program: "MSCA",
    funder: "Commissione Europea",
    discipline: "Tutte le discipline",
    deadline: "2026-11-24",
    deadlineStatus: "upcoming",
    publishedAt: "2026-05-28",
    sourceName: "European Research Executive Agency",
    sourceUrl:
      "https://rea.ec.europa.eu/funding-and-grants/horizon-europe-marie-sklodowska-curie-actions/msca-doctoral-networks_en",
    amount: "593.03 million euro overall indicative budget",
    eligibility: "Doctoral training networks and participating organisations",
    summary:
      "Call 2026 per network dottorali internazionali e intersettoriali, con formazione strutturata di doctoral candidates.",
    status: "upcoming",
    sourceType: "official_call"
  },
  {
    id: "erc-advanced-grant-2026",
    title: "ERC Advanced Grant 2026",
    program: "ERC",
    funder: "European Research Council",
    discipline: "Tutte le discipline",
    deadline: "2026-08-27",
    deadlineStatus: "open",
    publishedAt: "2026-05-28",
    sourceName: "European Research Council",
    sourceUrl: "https://erc.europa.eu/apply-grant/advanced-grant",
    amount: "747 million euro planned budget",
    eligibility: "Established principal investigators with significant research track record",
    summary:
      "Grant ERC per principal investigator senior con progetto frontier research ambizioso in qualunque disciplina.",
    status: "open",
    sourceType: "official_source"
  },
  {
    id: "erc-proof-of-concept-2026-dl2",
    title: "ERC Proof of Concept 2026 - seconda scadenza",
    program: "ERC",
    funder: "European Research Council",
    discipline: "Tutte le discipline",
    deadline: "2026-09-17",
    deadlineStatus: "open",
    sourceName: "European Research Council",
    sourceUrl: "https://erc.europa.eu/apply-grant/proof-concept",
    amount: "150.000 euro per 18 mesi",
    eligibility: "Principal Investigator titolari di un ERC frontier research grant ammissibile",
    summary: "Finanziamento per verificare il potenziale commerciale o sociale di risultati ottenuti da un progetto ERC.",
    status: "open",
    sourceType: "official_call"
  },
  {
    id: "erc-starting-grant-2027",
    title: "ERC Starting Grant 2027",
    program: "ERC",
    funder: "European Research Council",
    discipline: "Tutte le discipline",
    deadline: "2026-10-14",
    deadlineStatus: "upcoming",
    opensAt: "2026-07-22",
    sourceName: "European Research Council",
    sourceUrl: "https://erc.europa.eu/apply-grant/starting-grant",
    amount: "Fino a 1,5 milioni di euro per 5 anni, oltre a eventuali costi aggiuntivi",
    eligibility: "Ricercatori early-career secondo la finestra di ammissibilita ERC 2027 e con host institution eleggibile",
    summary: "Call ERC per ricercatori early-career pronti a sviluppare un programma di ricerca indipendente.",
    status: "upcoming",
    sourceType: "official_call"
  },
  {
    id: "erc-consolidator-grant-2027",
    title: "ERC Consolidator Grant 2027",
    program: "ERC",
    funder: "European Research Council",
    discipline: "Tutte le discipline",
    deadline: "2027-01-12",
    deadlineStatus: "upcoming",
    opensAt: "2026-09-24",
    sourceName: "European Research Council",
    sourceUrl: "https://erc.europa.eu/apply-grant/consolidator-grant",
    eligibility: "Principal Investigator nella finestra di ammissibilita ERC 2027 e con host institution eleggibile",
    summary: "Call ERC per consolidare un gruppo e un programma di ricerca indipendente.",
    status: "upcoming",
    sourceType: "official_call"
  },
  {
    id: "cost-open-call-2026",
    title: "COST Open Call 2026",
    program: "COST",
    funder: "COST Association",
    discipline: "Tutte le discipline",
    deadline: "2026-10-28",
    deadlineStatus: "upcoming",
    opensAt: "2026-07-31",
    sourceName: "COST Association",
    sourceUrl: "https://www.cost.eu/funding/open-call-a-simple-one-step-application-process/",
    eligibility: "Network interdisciplinari e internazionali proposti secondo le regole della COST Open Call",
    summary: "Open Call per nuove COST Actions: reti di collaborazione scientifica e tecnologica della durata di quattro anni.",
    status: "upcoming",
    sourceType: "official_call"
  },
  {
    id: "prin-2026",
    title: "Bando PRIN 2026",
    program: "PRIN",
    funder: "MUR",
    discipline: "Tutte le discipline",
    deadline: "2026-06-01",
    deadlineStatus: "open",
    publishedAt: "2026-04-10",
    sourceName: "Portale PRIN MUR/Cineca",
    sourceUrl: "https://prin.mur.gov.it/Iniziative",
    eligibility: "PI e responsabili di unita tramite credenziali Loginmiur, secondo il bando PRIN 2026",
    summary:
      "Bando PRIN 2026 - Decreto Direttoriale n. 2298 del 10 aprile 2026. Presentazione domande dalle 15:00 del 17 aprile alle 15:00 dell'1 giugno 2026.",
    status: "open",
    sourceType: "official_call"
  },
  {
    id: "prin-2026-hybrid",
    title: "Bando PRIN 2026 HYBRID",
    program: "PRIN",
    funder: "MUR",
    discipline: "Tutte le discipline",
    deadline: "2026-06-04",
    deadlineStatus: "open",
    publishedAt: "2026-04-17",
    sourceName: "Portale PRIN MUR/Cineca",
    sourceUrl: "https://prin.mur.gov.it/Iniziative",
    eligibility: "PI e responsabili di unita tramite credenziali Loginmiur, secondo il bando PRIN 2026 HYBRID",
    summary:
      "Bando PRIN 2026 HYBRID - Decreto Direttoriale n. 2610 del 17 aprile 2026. Presentazione domande dalle 15:00 del 20 aprile alle 15:00 del 4 giugno 2026.",
    status: "open",
    sourceType: "official_call"
  },
  {
    id: "pnrr-research-source",
    title: "PNRR ricerca - avvisi e misure per universita e ricerca",
    program: "PNRR",
    funder: "MUR / Italia Domani",
    discipline: "Tutte le discipline",
    deadline: "monitoraggio fonte",
    deadlineStatus: "unknown",
    sourceName: "Italia Domani / MUR",
    sourceUrl:
      "https://www.mur.gov.it/it/pnrr/misure-e-componenti/m4c2/investimento-11-fondo-il-programma-nazionale-della-ricerca",
    eligibility: "Depends on the specific PNRR measure, call and implementing body",
    summary:
      "Fonte istituzionale per misure PNRR. La prossima integrazione deve separare avvisi aperti, graduatorie, decreti e progetti finanziati.",
    status: "source_monitoring",
    sourceType: "monitoring_source"
  },
  {
    id: "horizon-europe-funding-tenders",
    title: "Horizon Europe calls - Funding & Tenders",
    program: "Horizon Europe",
    funder: "Commissione Europea",
    discipline: "Tutte le discipline",
    deadline: "monitoraggio fonte",
    deadlineStatus: "unknown",
    sourceName: "EU Funding & Tenders Portal",
    sourceUrl: "https://ec.europa.eu/info/funding-tenders/opportunities/portal/",
    eligibility: "Depends on topic, action type and consortium rules",
    summary:
      "Fonte ufficiale per call Horizon Europe. Da integrare con filtri per cluster, topic, action type, budget, eligibility e deadline.",
    status: "source_monitoring",
    sourceType: "monitoring_source"
  }
];

const previousGrants = await readPreviousGrants(outputPath);
const grants = preserveFirstSeenAt(useLive ? await enrichFromLiveSources(curatedGrants) : curatedGrants, previousGrants)
  .map(normalizeTemporalStatus);

await mkdir("lib/generated", { recursive: true });
await writeFile(outputPath, `${JSON.stringify(grants, null, 2)}\n`, "utf8");

console.log(`Wrote ${grants.length} grants to ${outputPath}`);

async function readPreviousGrants(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return [];
  }
}

function preserveFirstSeenAt(nextGrants, previousGrants) {
  const previousById = new Map(previousGrants.map((grant) => [grant.id, grant]));

  return nextGrants.map((grant) => {
    const previous = previousById.get(grant.id);
    const previousFirstSeenAt =
      previous?.firstSeenAt && previous.firstSeenAt <= importDate ? previous.firstSeenAt : undefined;

    return {
      ...grant,
      firstSeenAt: previousFirstSeenAt ?? (previous ? existingGrantBaselineDate : grant.firstSeenAt ?? importDate)
    };
  });
}

async function enrichFromLiveSources(grants) {
  const prinGrants = await fetchPrinGrants();
  const geaGrants = await fetchGeaGrants();
  const pnrrReport = await fetchPnrrClassification();
  const withoutPrin = grants.filter((grant) => grant.program !== "PRIN");
  const withPrin = prinGrants.length > 0 ? [...withoutPrin, ...prinGrants] : grants;
  const sourceGrants = applyPnrrClassification([...withPrin, ...geaGrants], pnrrReport);
  const enriched = [];

  for (const grant of sourceGrants) {
    if (!grant.sourceUrl.includes("rea.ec.europa.eu")) {
      enriched.push(grant);
      continue;
    }

    try {
      const response = await fetch(grant.sourceUrl);
      if (!response.ok) {
        enriched.push(grant);
        continue;
      }

      const html = await response.text();
      enriched.push({ ...grant, ...parseReaGrantPage(html, grant) });
    } catch {
      enriched.push(grant);
    }
  }
  if (pnrrReport) {
    await mkdir("data/store", { recursive: true });
    await writeFile(pnrrReportPath, `${JSON.stringify(pnrrReport, null, 2)}\n`, "utf8");
  }

  await mkdir("data/store", { recursive: true });
  await writeFile(
    sourceReportPath,
    `${JSON.stringify(buildSourceReport(enriched, { prin: prinGrants.length, gea: geaGrants.length }), null, 2)}\n`,
    "utf8"
  );

  return dedupeById(enriched);
}

function normalizeTemporalStatus(grant) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(grant.deadline)) return grant;
  if (grant.deadline < importDate) {
    return { ...grant, status: "closed", deadlineStatus: "expired" };
  }

  const days = Math.ceil(
    (new Date(`${grant.deadline}T00:00:00Z`).getTime() - new Date(`${importDate}T00:00:00Z`).getTime()) /
      86_400_000
  );
  const hasNotOpened = grant.opensAt && grant.opensAt > importDate;

  return {
    ...grant,
    status: hasNotOpened ? "upcoming" : "open",
    deadlineStatus: days <= 14 ? "closing_soon" : "open"
  };
}

async function fetchGeaGrants() {
  const indexUrl = "https://www.gea.mur.gov.it/Home/Bandi";

  try {
    const response = await fetch(indexUrl);
    if (!response.ok) return [];

    const html = await response.text();
    const candidates = parseGeaOpenCalls(html, indexUrl);
    const grants = [];

    for (const candidate of candidates) {
      try {
        const detailResponse = await fetch(candidate.sourceUrl);
        if (!detailResponse.ok) continue;
        const grant = parseGeaGrantDetail(await detailResponse.text(), candidate);
        if (grant) grants.push(grant);
      } catch {
        // A single unstable detail page must not block the other official sources.
      }
    }

    return grants;
  } catch {
    return [];
  }
}

function parseGeaOpenCalls(html, indexUrl) {
  const cards = html.match(/<div class="card-wrapper card-space">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi) ?? [];

  return cards.flatMap((card) => {
    if (!/attualmente\s*<b>aperto<\/b>/i.test(card)) return [];
    const titleMatch = card.match(/<h3[^>]*>\s*<a href="([^"]+)">([\s\S]*?)<\/a>/i);
    if (!titleMatch) return [];

    return [{
      title: decodeEntities(stripTags(titleMatch[2])),
      sourceUrl: absoluteUrl(titleMatch[1], indexUrl),
      summary: decodeEntities(stripTags(card.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? ""))
    }];
  });
}

function parseGeaGrantDetail(html, candidate) {
  const text = decodeEntities(stripTags(html));
  const deadlineText = text.match(/(?:Termine presentazione delle domande|Termine candidature)\s+(\d{1,2}\s+[\p{L}]+\s+\d{4})/iu)?.[1];
  const startText = text.match(/(?:Avvio presentazione delle domande|Avvio candidature)\s+(\d{1,2}\s+[\p{L}]+\s+\d{4})/iu)?.[1];
  const deadline = parseItalianDateToIsoSafe(deadlineText);
  if (!deadline || deadline < importDate) return undefined;

  const startDate = parseItalianDateToIsoSafe(startText);
  const id = `gea-${slugify(new URL(candidate.sourceUrl).pathname.split("/").filter(Boolean).at(-1) ?? candidate.title)}`;

  return {
    id,
    title: candidate.title,
    program: inferGeaProgram(candidate.title),
    funder: "MUR",
    discipline: inferGeaDiscipline(candidate.title, candidate.summary),
    deadline,
    deadlineStatus: startDate && startDate > importDate ? "upcoming" : "open",
    publishedAt: startDate,
    sourceName: "GEA - Ministero dell'Universita e della Ricerca",
    sourceUrl: candidate.sourceUrl,
    eligibility: "Soggetti ammissibili indicati nel bando e nella documentazione ufficiale GEA",
    summary: candidate.summary || `Bando aperto pubblicato sulla piattaforma GEA del MUR, con scadenza ${deadline}.`,
    status: startDate && startDate > importDate ? "upcoming" : "open",
    sourceType: "official_call"
  };
}

function inferGeaProgram(title) {
  if (/young researchers/i.test(title)) return "Young Researchers";
  if (/\bFIS\b/i.test(title)) return "FIS";
  if (/\bPNRA\b/i.test(title)) return "PNRA";
  if (/DM\s*44/i.test(title)) return "MUR";
  return "MUR";
}

function inferGeaDiscipline(title, summary) {
  return /antartid|sistema terra|clima/i.test(`${title} ${summary}`)
    ? "Ambiente, agraria e veterinaria"
    : "Tutte le discipline";
}

function buildSourceReport(grants, imported) {
  const sourceHosts = [...new Set(grants.map((grant) => new URL(grant.sourceUrl).hostname))].sort();
  return {
    generatedAt: new Date().toISOString(),
    databases: sourceHosts.length,
    sourceHosts,
    imported,
    records: grants.length
  };
}

async function fetchPrinGrants() {
  const sourceUrl = "https://prin.mur.gov.it/Iniziative";

  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) return [];

    const html = await response.text();
    return parsePrinPortal(html, sourceUrl);
  } catch {
    return [];
  }
}

function parsePrinPortal(html, portalUrl) {
  const cards = html.match(/<div class="card card-bg no-after">[\s\S]*?<!--end card-->/g) ?? [];
  const grants = [];

  for (const card of cards) {
    const plain = stripTags(card);
    if (!/\bBando PRIN 2026\b/i.test(plain)) continue;

    const edition = /^2026 HYBRID\b/i.test(plain) ? "2026 HYBRID" : "2026";
    const title = edition === "2026 HYBRID" ? "Bando PRIN 2026 HYBRID" : "Bando PRIN 2026";
    const detailPath = card.match(/<a href="([^"]*\/Iniziative\/Detail\?key=[^"]+)"/i)?.[1];
    const decreeHref = card.match(/<a href="([^"]+)"[^>]*>\s*Bando PRIN 2026/i)?.[1];
    const sourceUrl = absoluteUrl(detailPath ?? decreeHref ?? portalUrl, portalUrl);
    const decreeText =
      plain.match(/Decreto\s+Direttoriale\s+n\.\s*[\d]+\s+del\s+\d{1,2}\s+[A-Za-zàèéìòù]+\s+\d{4}/i)?.[0] ??
      plain.match(/Decreto\s+direttoriale\s+n\.\s*[\d]+\s+del\s+\d{1,2}\s+[A-Za-zàèéìòù]+\s+\d{4}/i)?.[0];
    const applicationWindow = parseItalianApplicationWindowSafe(plain);

    grants.push({
      id: edition === "2026 HYBRID" ? "prin-2026-hybrid" : "prin-2026",
      title,
      program: "PRIN",
      funder: "MUR",
      discipline: "Tutte le discipline",
      deadline: applicationWindow?.deadline ?? "monitoraggio fonte",
      deadlineStatus: applicationWindow?.deadline ? "open" : "unknown",
      publishedAt: parseItalianDateToIsoSafe(decreeText?.match(/\d{1,2}\s+[\p{L}]+\s+\d{4}/u)?.[0]) ?? undefined,
      sourceName: "Portale PRIN MUR/Cineca",
      sourceUrl,
      eligibility: `PI e responsabili di unita tramite credenziali Loginmiur, secondo il ${title}`,
      summary: [
        decreeText ? `${title} - ${decreeText}.` : title,
        applicationWindow?.summary ?? "Finestra di candidatura da verificare sul portale PRIN."
      ].join(" "),
      status: applicationWindow?.deadline ? "open" : "source_monitoring",
      sourceType: "official_call"
    });
  }

  return dedupeById(grants);
}

async function fetchPnrrClassification() {
  const sourceUrl =
    "https://www.mur.gov.it/it/pnrr/misure-e-componenti/m4c2/investimento-11-fondo-il-programma-nazionale-della-ricerca";

  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) return undefined;

    const html = await response.text();
    const links = extractLinks(html, sourceUrl)
      .filter((link) => isRelevantPnrrLink(link.label))
      .map((link) => ({ ...link, category: classifyPnrrLink(link.label) }));

    return {
      generatedAt: new Date().toISOString(),
      sourceUrl,
      totalLinks: links.length,
      byCategory: links.reduce((counts, link) => {
        counts[link.category] = (counts[link.category] ?? 0) + 1;
        return counts;
      }, {}),
      openCalls: links.filter((link) => link.category === "open_call"),
      administrativeDocuments: links.filter((link) => link.category === "administrative_document"),
      admissionDocuments: links.filter((link) => link.category === "admission_or_ranking"),
      monitoringDocuments: links.filter((link) => link.category === "monitoring_or_reporting"),
      otherDocuments: links.filter((link) => link.category === "other"),
      importerDecision: links.some((link) => link.category === "open_call")
        ? "review_open_call_candidates"
        : "monitoring_source_only",
      links
    };
  } catch {
    return undefined;
  }
}

function applyPnrrClassification(grants, pnrrReport) {
  if (!pnrrReport) return grants;

  return grants.map((grant) => {
    if (grant.id !== "pnrr-research-source") return grant;

    const openCalls = pnrrReport.openCalls.length;
    const administrativeDocuments = pnrrReport.administrativeDocuments.length;
    const admissionDocuments = pnrrReport.admissionDocuments.length;
    const monitoringDocuments = pnrrReport.monitoringDocuments.length;

    return {
      ...grant,
      sourceUrl: pnrrReport.sourceUrl,
      summary:
        openCalls > 0
          ? `Fonte PNRR con ${openCalls} possibili avvisi da verificare prima della pubblicazione. Documenti amministrativi: ${administrativeDocuments}; graduatorie/ammissioni: ${admissionDocuments}; rendicontazione/monitoraggio: ${monitoringDocuments}.`
          : `Fonte PNRR classificata: nessun avviso aperto esposto in modo sicuro. Documenti amministrativi: ${administrativeDocuments}; graduatorie/ammissioni: ${admissionDocuments}; rendicontazione/monitoraggio: ${monitoringDocuments}.`,
      status: "source_monitoring",
      sourceType: "monitoring_source"
    };
  });
}

function extractLinks(html, baseUrl) {
  const links = [];
  const linkPattern = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = linkPattern.exec(html))) {
    const label = decodeEntities(stripTags(match[2]));
    if (!label) continue;

    links.push({
      label,
      url: absoluteUrl(match[1], baseUrl)
    });
  }

  return links;
}

function isRelevantPnrrLink(label) {
  return /decreto|bando|avviso|ammissione|finanziamento|graduatoria|linee guida|rendicontazione|riparto|progetto|programma/i.test(
    label
  );
}

function classifyPnrrLink(label) {
  if (/graduatoria|ammissione|ammess|finanziamento/i.test(label)) return "admission_or_ranking";
  if (/linee guida|rendicontazione|attuazione|comunicazione|riparto/i.test(label)) return "monitoring_or_reporting";
  if (/bando|avviso/i.test(label) && !/ammissione|graduatoria|finanziamento/i.test(label)) return "open_call";
  if (/decreto/i.test(label)) return "administrative_document";
  return "other";
}

function parseItalianApplicationWindowSafe(text) {
  const match = text.match(
    /La presentazione delle domande (?:e|\u00e8) possibile dalle ore\s+([0-9:.]+)\s+del\s+(\d{1,2}\s+[\p{L}]+(?:\s+\d{4})?)\s+alle ore\s+([0-9:.]+)\s+(?:del|dell')\s*(\d{1,2}\s+[\p{L}]+(?:\s+\d{4})?)/iu
  );

  if (!match) return undefined;

  const fallbackYear = match[4].match(/\d{4}/)?.[0] ?? match[2].match(/\d{4}/)?.[0];
  const startDate = parseItalianDateToIsoSafe(match[2], fallbackYear);
  const deadline = parseItalianDateToIsoSafe(match[4], fallbackYear);
  if (!deadline) return undefined;

  return {
    deadline,
    summary: `Presentazione domande dalle ${match[1]} del ${match[2]} alle ${match[3]} del ${match[4]}.`,
    startDate
  };
}

function parseItalianDateToIsoSafe(value, fallbackYear) {
  if (!value) return undefined;
  const match = value.toLowerCase().match(/(\d{1,2})\s+([\p{L}]+)(?:\s+(\d{4}))?/u);
  if (!match) return undefined;

  const month = italianMonths[normalizeText(match[2])];
  if (!month) return undefined;
  const year = match[3] ?? fallbackYear;
  if (!year) return undefined;

  return `${year}-${month}-${match[1].padStart(2, "0")}`;
}

function parseItalianApplicationWindow(text) {
  const match = text.match(
    /La presentazione delle domande è possibile dalle ore\s+([0-9:.]+)\s+del\s+(\d{1,2}\s+[A-Za-zàèéìòù]+\s+\d{4})\s+alle ore\s+([0-9:.]+)\s+dell?'?(\d{1,2}\s+[A-Za-zàèéìòù]+\s+\d{4})/i
  );

  if (!match) return undefined;

  const startDate = parseItalianDateToIso(match[2]);
  const deadline = parseItalianDateToIso(match[4]);
  if (!deadline) return undefined;

  return {
    deadline,
    summary: `Presentazione domande dalle ${match[1]} del ${match[2]} alle ${match[3]} del ${match[4]}.`,
    startDate
  };
}

function parseItalianDateToIso(value) {
  if (!value) return undefined;
  const match = value.toLowerCase().match(/(\d{1,2})\s+([a-zàèéìòù]+)\s+(\d{4})/i);
  if (!match) return undefined;

  const month = italianMonths[normalizeText(match[2])];
  if (!month) return undefined;

  return `${match[3]}-${month}-${match[1].padStart(2, "0")}`;
}

function absoluteUrl(value, base) {
  if (!value) return base;
  return new URL(value, base).toString();
}

function dedupeById(items) {
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

function parseReaGrantPage(html, grant) {
  const text = stripTags(html);
  const deadline = findTimelineDate(html, "Deadline for applicants to submit proposals") ?? grant.deadline;
  const launch = findTimelineDate(html, "Launch of the call for proposals") ?? grant.publishedAt;
  const budgetMatch = text.match(/(\d+(?:\.\d+)?)\s+million\s+Overall indicative budget for the call/i);

  return {
    deadline: toIsoDate(deadline) ?? grant.deadline,
    publishedAt: toIsoDate(launch) ?? grant.publishedAt,
    amount: budgetMatch ? `${budgetMatch[1]} million euro overall indicative budget` : grant.amount,
    sourceType: "official_call"
  };
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&agrave;/g, "a")
    .replace(/&egrave;/g, "e")
    .replace(/&eacute;/g, "e")
    .replace(/&igrave;/g, "i")
    .replace(/&ograve;/g, "o")
    .replace(/&ugrave;/g, "u");
}

function findDateAfter(text, marker) {
  const index = text.indexOf(marker);
  if (index < 0) return undefined;

  const after = text.slice(index, index + 220);
  return after.match(/\b\d{1,2}\s+[A-Z][a-z]+\s+\d{4}\b/)?.[0];
}

function toIsoDate(value) {
  if (!value) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = new Date(`${value} UTC`);
  if (Number.isNaN(parsed.getTime())) return undefined;

  return parsed.toISOString().slice(0, 10);
}

function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function findTimelineDate(html, title) {
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(
    new RegExp(`ecl-timeline__label[^>]*>([^<]+)<[\\s\\S]{0,260}?ecl-timeline__title[^>]*>${escapedTitle}`, "i")
  );
  return match?.[1]?.trim();
}

function slugify(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
