import { mkdir, readFile, writeFile } from "node:fs/promises";

const BASE_URL = "https://bandi.mur.gov.it";

const categories = [
  { key: "doctorates", label: "Dottorati", searchPath: "/doctorate.php/public/cercaFellowship" },
  { key: "technologists", label: "Tecnologi", searchPath: "/tecno.php/public/cercaJobs" },
  { key: "research-grants", label: "Assegni di ricerca", searchPath: "/bandi.php/public/cercaFellowship" },
  { key: "fixed-term-researchers", label: "Ricercatori a tempo determinato", searchPath: "/jobs.php/public/cercaJobs" },
  { key: "professor-calls", label: "Chiamate professori", searchPath: "/profcalls.php/public/cercaJobs" },
  { key: "research-contracts", label: "Contratti di ricerca", searchPath: "/contrattidiricerca.php/public/cercaFellowship" },
  { key: "research-assignments", label: "Incarichi di ricerca", searchPath: "/incarichidiricerca.php/public/cercaFellowship" },
  { key: "postdoc-assignments", label: "Incarichi post doc", searchPath: "/incarichipostdoc.php/public/cercaFellowship" }
];

const storeDir = arg("store") ?? "data/store";
const outputPath = arg("out") ?? `${storeDir}/mur-coverage-report.json`;
const status = arg("status") ?? "open";
const sourceRecords = await readJson(`${storeDir}/source-records.json`, []);
const positions = await readJson(`${storeDir}/positions.json`, []);
const generatedAt = new Date().toISOString();
const categoryReports = [];

for (const category of categories) {
  const searchUrl = await buildSearchUrl(category, status);
  const searchHtml = await fetchText(searchUrl);
  const detailUrls = extractDetailUrls(searchHtml, category);
  const storeRecords = sourceRecords.filter((record) => record.sourceCategory === category.key);
  const storeExternalIds = new Set(storeRecords.map((record) => String(record.externalId)));
  const liveExternalIds = detailUrls.map((url) => url.pathname.split("/").at(-1) ?? url.href);
  const missingExternalIds = liveExternalIds.filter((externalId) => !storeExternalIds.has(externalId));

  categoryReports.push({
    key: category.key,
    label: category.label,
    searchUrl: searchUrl.href,
    liveOpenCount: detailUrls.length,
    storedSourceRecords: storeRecords.length,
    storedPositions: positions.filter((position) => position.id.startsWith(`mur-${category.key}-`)).length,
    missingExternalIds,
    status: missingExternalIds.length === 0 ? "covered" : "missing_records"
  });
}

const report = {
  generatedAt,
  status,
  source: BASE_URL,
  categoriesExpected: categories.length,
  categoriesCoveredInStore: categoryReports.filter((category) => category.storedSourceRecords > 0).length,
  liveOpenTotal: categoryReports.reduce((sum, category) => sum + category.liveOpenCount, 0),
  storedSourceRecordsTotal: sourceRecords.length,
  storedPositionsTotal: positions.length,
  missingTotal: categoryReports.reduce((sum, category) => sum + category.missingExternalIds.length, 0),
  categories: categoryReports
};

await writeJson(outputPath, report);

for (const category of categoryReports) {
  console.log(
    `${category.label}: live ${category.liveOpenCount}, stored ${category.storedSourceRecords}, missing ${category.missingExternalIds.length}`
  );
}

console.log(`Missing live records: ${report.missingTotal}`);
console.log(`Wrote ${outputPath}`);

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
    if (seen.has(url.href)) return false;
    seen.add(url.href);
    return true;
  });
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

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function arg(name) {
  return process.argv
    .slice(2)
    .find((value) => value.startsWith(`--${name}=`))
    ?.split("=")
    .slice(1)
    .join("=");
}

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJson(path, value) {
  await mkdir(path.split("/").slice(0, -1).join("/") || ".", { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
