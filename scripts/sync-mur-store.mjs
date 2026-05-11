import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { normalizeRecords } from "./mur-normalize.mjs";

const args = new Map(
  process.argv
    .slice(2)
    .map((arg) => arg.split("="))
    .filter(([key, value]) => key?.startsWith("--") && value !== undefined)
    .map(([key, value]) => [key.slice(2), value])
);

const limit = args.get("limit") ?? "10";
const rawPath = args.get("raw") ?? "data/mur-latest.json";
const storeDir = args.get("store") ?? "data/store";
const cachePath = args.get("cache") ?? "lib/generated/mur-positions.json";
const skipFetch = args.get("skip-fetch") === "true";
const persist = args.get("persist") ?? "local";
const startedAt = new Date().toISOString();
const runId = `mur-${startedAt.replace(/[-:.TZ]/g, "").slice(0, 14)}-${randomUUID().slice(0, 8)}`;

await mkdir(storeDir, { recursive: true });

if (!skipFetch) {
  const result = spawnSync(process.execPath, ["scripts/import-mur.mjs", `--limit=${limit}`, `--out=${rawPath}`], {
    encoding: "utf8",
    stdio: "inherit"
  });

  if (result.status !== 0) {
    throw new Error(`MUR import failed with exit code ${result.status}`);
  }
}

const latest = JSON.parse(await readFile(rawPath, "utf8"));
const fetchedRecords = latest.results ?? [];
const previousSourceRecords = await readJson(`${storeDir}/source-records.json`, []);
const previousPositions = await readJson(`${storeDir}/positions.json`, []);
const previousRuns = await readJson(`${storeDir}/import-runs.json`, []);

const sourceRecordsByKey = new Map(previousSourceRecords.map((record) => [sourceRecordKey(record), record]));
let newOrChanged = 0;

for (const record of fetchedRecords) {
  const key = `mur-cineca:${record.sourceCategory}:${record.externalId}`;
  const rawFieldsJson = JSON.stringify(record.rawFields ?? {});
  const contentHash = hash(rawFieldsJson);
  const previous = sourceRecordsByKey.get(key);

  if (!previous || previous.contentHash !== contentHash) {
    newOrChanged += 1;
  }

  sourceRecordsByKey.set(key, {
    id: `mur:${record.sourceCategory}:${record.externalId}`,
    sourceId: "mur-cineca",
    importRunId: runId,
    externalId: record.externalId,
    sourceCategory: record.sourceCategory,
    sourceCategoryLabel: record.sourceCategoryLabel,
    sourceUrl: record.sourceUrl,
    rawFields: record.rawFields ?? {},
    normalizedSnapshot: record,
    contentHash,
    importedAt: record.importedAt ?? startedAt,
    firstSeenAt: previous?.firstSeenAt ?? startedAt,
    lastSeenAt: startedAt
  });
}

const allSourceRecords = Array.from(sourceRecordsByKey.values()).sort((a, b) =>
  String(b.lastSeenAt).localeCompare(String(a.lastSeenAt))
);

const currentSourceRecords = allSourceRecords.filter((record) => record.lastSeenAt === startedAt);
const normalizedPositions = normalizeRecords(currentSourceRecords.map((record) => record.normalizedSnapshot));
const previousPositionMap = new Map(previousPositions.map((position) => [position.id, position]));
const allPositions = normalizedPositions
  .map((position) => cleanPosition({
    ...previousPositionMap.get(position.id),
    ...position,
    updatedAt: startedAt
  }, position))
  .sort((a, b) => String(a.deadline).localeCompare(String(b.deadline)));

const importRun = {
  id: runId,
  sourceId: "mur-cineca",
  startedAt,
  finishedAt: new Date().toISOString(),
  status: "success",
  recordsSeen: fetchedRecords.length,
  newOrChanged,
  sourceRecordsTotal: allSourceRecords.length,
  positionsTotal: allPositions.length
};

await writeJson(`${storeDir}/sources.json`, [
  { id: "mur-cineca", name: "MUR/Cineca", baseUrl: "https://bandi.mur.gov.it/", kind: "html" }
]);
await writeJson(`${storeDir}/source-records.json`, allSourceRecords);
await writeJson(`${storeDir}/positions.json`, allPositions);
await writeJson(`${storeDir}/import-runs.json`, [importRun, ...previousRuns].slice(0, 50));
await writeJson(`${storeDir}/last-sync-report.json`, importRun);
await writeJson(cachePath, allPositions);

if (persist === "supabase") {
  const result = spawnSync(process.execPath, ["scripts/persist-supabase.mjs", `--store=${storeDir}`], {
    encoding: "utf8",
    stdio: "inherit"
  });

  if (result.status !== 0) {
    throw new Error(`Supabase persistence failed with exit code ${result.status}`);
  }
}

console.log(`Fetched ${fetchedRecords.length} records`);
console.log(`New or changed source records: ${newOrChanged}`);
console.log(`Store totals: ${allSourceRecords.length} source records, ${allPositions.length} positions`);
console.log(`Frontend cache updated at ${cachePath}`);

function sourceRecordKey(record) {
  return `${record.sourceId}:${record.sourceCategory}:${record.externalId}`;
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

function cleanPosition(merged, current) {
  if (!current.duplicateSourceIds) {
    delete merged.duplicateSourceIds;
  }
  if (!current.possibleDuplicateOf) {
    delete merged.possibleDuplicateOf;
  }
  if (!current.possibleDuplicateSourceIds) {
    delete merged.possibleDuplicateSourceIds;
  }
  return merged;
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
