import { writeFile, mkdir } from "node:fs/promises";

const BASE_URL = "https://bandi.mur.gov.it";

const categories = [
  {
    key: "doctorates",
    label: "Dottorati",
    positionType: "PhD",
    searchPath: "/doctorate.php/public/cercaFellowship"
  },
  {
    key: "technologists",
    label: "Tecnologi",
    positionType: "Tecnologo",
    searchPath: "/tecno.php/public/cercaJobs"
  },
  {
    key: "research-grants",
    label: "Assegni di ricerca",
    positionType: "Assegno",
    searchPath: "/bandi.php/public/cercaFellowship"
  },
  {
    key: "fixed-term-researchers",
    label: "Ricercatori a tempo determinato",
    positionType: "RTT",
    searchPath: "/jobs.php/public/cercaJobs"
  },
  {
    key: "professor-calls",
    label: "Chiamate professori",
    positionType: "Professore II fascia",
    searchPath: "/profcalls.php/public/cercaJobs"
  },
  {
    key: "research-contracts",
    label: "Contratti di ricerca",
    positionType: "Contratto di ricerca",
    searchPath: "/contrattidiricerca.php/public/cercaFellowship"
  },
  {
    key: "research-assignments",
    label: "Incarichi di ricerca",
    positionType: "Incarico di ricerca",
    searchPath: "/incarichidiricerca.php/public/cercaFellowship"
  },
  {
    key: "postdoc-assignments",
    label: "Incarichi post doc",
    positionType: "Postdoc",
    searchPath: "/incarichipostdoc.php/public/cercaFellowship"
  }
];

const args = new Map(
  process.argv
    .slice(2)
    .map((arg) => arg.split("="))
    .filter(([key, value]) => key?.startsWith("--") && value !== undefined)
    .map(([key, value]) => [key.slice(2), value])
);

const limitArg = args.get("limit") ?? "5";
const limit = limitArg === "all" ? Infinity : Number(limitArg);
const categoryFilter = args.get("category");
const outputPath = args.get("out") ?? "data/mur-sample.json";
const status = args.get("status") ?? "open";

const selectedCategories = categoryFilter
  ? categories.filter((category) => category.key === categoryFilter)
  : categories;

if (selectedCategories.length === 0) {
  throw new Error(`Unknown category: ${categoryFilter}`);
}

const results = [];
const importStartedAt = new Date().toISOString();

for (const category of selectedCategories) {
  const searchUrl = await buildSearchUrl(category, status);
  const searchHtml = await fetchText(searchUrl);
  const detailUrls = extractDetailUrls(searchHtml, category).slice(0, Number.isFinite(limit) ? limit : undefined);

  for (const detailUrl of detailUrls) {
    const detailHtml = await fetchText(detailUrl);
    const fields = extractTableFields(detailHtml);
    const rawText = stripHtml(detailHtml);

    results.push({
      externalId: detailUrl.pathname.split("/").at(-1) ?? detailUrl.href,
      sourceName: "MUR/Cineca",
      sourceCategory: category.key,
      sourceCategoryLabel: category.label,
      sourceUrl: detailUrl.href,
      importedAt: new Date().toISOString(),
      positionType: category.positionType,
      title: pickFirst(fields, [
        "Titolo del progetto di ricerca in italiano",
        "Titolo del progetto di ricerca",
        "Nome bando",
        "Titolo"
      ]),
      titleEn: pickFirst(fields, ["Titolo del progetto di ricerca in inglese"]),
      institution: pickFirst(fields, ["Organizzazione/Ente", "Ente", "Nome dell'Ente finanziatore"]),
      department: pickFirst(fields, ["Facolta/Dipartimento/Laboratorio di ricerca", "Facoltà/Dipartimento/Laboratorio di ricerca"]),
      city: pickFirst(fields, ["Citta", "Città"]),
      province: pickFirst(fields, ["Stato/Provincia"]),
      country: pickFirst(fields, ["Paese"]),
      publishedAt: parseItalianDate(pickFirst(fields, ["Data del bando"])),
      deadline: parseItalianDate(pickFirst(fields, ["Data di scadenza del bando"])),
      gsd: pickFirst(fields, ["G.S.D.", "GSD"]),
      ssd: pickFirst(fields, ["S.S.D", "SSD"]),
      researchField: pickFirst(fields, ["Campo principale della ricerca"]),
      researchSubfield: pickFirst(fields, ["Sottocampo della ricerca"]),
      positionsAvailable: pickFirst(fields, ["Numero posti"]),
      contractType: pickFirst(fields, ["Tipo di contratto"]),
      time: pickFirst(fields, ["Tempo"]),
      applicationMode: pickFirst(fields, ["Come candidarsi"]),
      officialWebsite: pickFirst(fields, ["Sito web del bando", "Sito web"]),
      amount: pickFirst(fields, ["Importo annuale", "Stanziamento annuale"]),
      duration: pickFirst(fields, ["Massima durata della borsa", "Periodicità"]),
      description: pickFirst(fields, [
        "Descrizione sintetica in italiano",
        "Descrizione del bando in italiano"
      ]),
      descriptionEn: pickFirst(fields, [
        "Descrizione sintetica in inglese",
        "Descrizione del bando in inglese"
      ]),
      requirements: pickFirst(fields, [
        "Requisiti specifici in italiano",
        "Competenze richieste in italiano"
      ]),
      fundingType: detectFundingType(`${rawText} ${Object.values(fields).join(" ")}`),
      rawFields: fields
    });
  }

  console.log(
    `${category.label}: ${detailUrls.length} detail URLs imported from ${searchUrl.href}`
  );
}

await mkdir(outputPath.split("/").slice(0, -1).join("/") || ".", { recursive: true });
await writeFile(
  outputPath,
  `${JSON.stringify(
    {
      importStartedAt,
      importFinishedAt: new Date().toISOString(),
      status,
      limit,
      count: results.length,
      results
    },
    null,
    2
  )}\n`,
  "utf8"
);

console.log(`Wrote ${results.length} records to ${outputPath}`);

async function buildSearchUrl(category, statusValue) {
  const url = new URL(category.searchPath, BASE_URL);
  const html = await fetchText(url);
  const form = extractSearchForm(html);
  const params = new URLSearchParams();

  for (const input of form.hiddenInputs) {
    params.set(input.name, input.value);
  }

  for (const select of form.selects) {
    const defaultValue = select.options.find((option) => option.selected)?.value ?? select.options[0]?.value;
    params.set(select.name, defaultValue ?? "%");
  }

  if (!params.has("azione")) {
    params.set("azione", "cerca");
  }

  if (statusValue === "open") {
    const statusSelect = form.selects.find((select) => /status_id$/i.test(select.name));
    if (statusSelect) {
      params.set(statusSelect.name, "2-3");
    }
  }

  url.search = params.toString();
  return url;
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "ResearchRadarItalyMVP/0.1 (+https://example.local)",
      accept: "text/html,application/xhtml+xml"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed ${response.status} ${response.statusText}: ${url}`);
  }

  return response.text();
}

function extractSearchForm(html) {
  const formHtml = html.match(/<form\b[\s\S]*?<\/form>/i)?.[0] ?? "";
  const selects = [...formHtml.matchAll(/<select\b[^>]*name="([^"]+)"[^>]*>([\s\S]*?)<\/select>/gi)].map(
    ([, name, body]) => ({
      name,
      options: [...body.matchAll(/<option\b([^>]*)value="([^"]*)"[^>]*>([\s\S]*?)<\/option>/gi)].map(
        ([, attrs, value, label]) => ({
          value: decodeHtml(value.trim()),
          label: stripHtml(label),
          selected: /selected/i.test(attrs)
        })
      )
    })
  );

  const hiddenInputs = [...formHtml.matchAll(/<input\b[^>]*type="hidden"[^>]*>/gi)].map(([input]) => ({
    name: input.match(/\bname="([^"]+)"/i)?.[1] ?? "",
    value: decodeHtml(input.match(/\bvalue="([^"]*)"/i)?.[1] ?? "")
  })).filter((input) => input.name);

  return { selects, hiddenInputs };
}

function extractDetailUrls(html, category) {
  const moduleName = category.searchPath.split("/")[1];
  const pattern = new RegExp(`href="([^"]*${escapeRegex(moduleName)}\\/public\\/(?:job|fellowship)\\/id_(?:job|fellow)\\/\\d+)"`, "gi");
  const urls = [...html.matchAll(pattern)].map(([, href]) => new URL(href, BASE_URL));
  const seen = new Set();

  return urls.filter((url) => {
    if (seen.has(url.href)) {
      return false;
    }
    seen.add(url.href);
    return true;
  });
}

function extractTableFields(html) {
  const fields = {};
  const normalizedHtml = html.replace(/\r?\n/g, " ");

  for (const [, rawLabel, rawValue] of normalizedHtml.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>\s*<td\b[^>]*>([\s\S]*?)<\/td>/gi)) {
    const label = normalizeLabel(stripHtml(rawLabel));
    const value = stripHtml(rawValue);

    if (label && value && !fields[label]) {
      fields[label] = value;
    }
  }

  return fields;
}

function pickFirst(fields, labels) {
  for (const label of labels) {
    const normalized = normalizeLabel(label);
    if (fields[normalized]) {
      return fields[normalized];
    }
  }
  return "";
}

function stripHtml(value) {
  return decodeHtml(
    value
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function normalizeLabel(value) {
  return decodeHtml(value)
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .replace(/:$/, "")
    .trim();
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&agrave;/g, "à")
    .replace(/&egrave;/g, "è")
    .replace(/&eacute;/g, "é")
    .replace(/&igrave;/g, "ì")
    .replace(/&ograve;/g, "ò")
    .replace(/&ugrave;/g, "ù")
    .replace(/&Agrave;/g, "À")
    .replace(/&Egrave;/g, "È")
    .replace(/&Eacute;/g, "É")
    .replace(/&Igrave;/g, "Ì")
    .replace(/&Ograve;/g, "Ò")
    .replace(/&Ugrave;/g, "Ù")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function parseItalianDate(value) {
  const match = value.match(/\b(\d{2})\/(\d{2})\/(\d{4})\b/);
  if (!match) {
    return "";
  }
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

function detectFundingType(text) {
  const upper = text.toUpperCase();
  if (/\bPNRR\b/.test(upper)) return "PNRR";
  if (/\bPRIN\b/.test(upper)) return "PRIN";
  if (/\bERC\b/.test(upper)) return "ERC";
  if (/\bMARIE CURIE\b/.test(upper) || /\bMSCA\b/.test(upper)) return "MSCA";
  if (/\bHORIZON\b/.test(upper)) return "Horizon";
  return "MUR";
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
