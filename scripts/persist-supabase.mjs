import { readFile } from "node:fs/promises";

const storeDir = arg("store") ?? "data/store";
const batchSize = Number(arg("batch-size") ?? 100);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running persist:supabase.");
}

const sources = await readJson(`${storeDir}/sources.json`, []);
const sourceRecords = await readJson(`${storeDir}/source-records.json`, []);
const positions = await readJson(`${storeDir}/positions.json`, []);

await upsert("sources", sources.map(toDbSource), "id");
await upsert("source_records", sourceRecords.map(toDbSourceRecord), "source_id,source_category,external_id");
await upsert("positions", positions.map(toDbPosition), "id");

console.log(`Persisted ${sources.length} sources`);
console.log(`Persisted ${sourceRecords.length} source records`);
console.log(`Persisted ${positions.length} positions`);

function toDbSource(source) {
  return {
    id: source.id,
    name: source.name,
    base_url: source.baseUrl,
    kind: source.kind
  };
}

function toDbSourceRecord(record) {
  return {
    id: record.id,
    source_id: record.sourceId,
    import_run_id: record.importRunId,
    external_id: record.externalId,
    source_category: record.sourceCategory,
    source_category_label: record.sourceCategoryLabel,
    source_url: record.sourceUrl,
    source_url_canonical: canonicalizeUrl(record.sourceUrl),
    raw_fields_json: record.rawFields ?? {},
    normalized_snapshot_json: record.normalizedSnapshot ?? {},
    content_hash: record.contentHash,
    imported_at: record.importedAt,
    first_seen_at: record.firstSeenAt,
    last_seen_at: record.lastSeenAt
  };
}

function toDbPosition(position) {
  return {
    id: position.id,
    source_record_id: sourceRecordIdFromPosition(position.id),
    duplicate_of_position_id: null,
    title: position.title,
    title_key: normalizeKey(position.title),
    institution: position.institution,
    institution_key: normalizeKey(position.institution),
    department: position.department,
    location: position.location,
    region: position.region,
    position_type: position.positionType,
    professor_rank: position.professorRank || null,
    discipline: position.discipline,
    ssd: position.ssd,
    gsd: position.gsd ?? null,
    funding_type: position.fundingType,
    deadline: emptyToNull(position.deadline),
    deadline_status: position.deadlineStatus ?? "unknown",
    published_at: emptyToNull(position.publishedAt),
    source_name: position.sourceName,
    source_url: position.sourceUrl,
    source_url_canonical: canonicalizeUrl(position.sourceUrl),
    salary_or_amount: position.salaryOrAmount,
    duration: position.duration,
    language: position.language,
    summary: position.summary,
    requirements_json: position.requirements ?? [],
    dedupe_key: position.dedupeKey ?? `${normalizeKey(position.title)}|${normalizeKey(position.institution)}|${position.deadline}`,
    review_status: position.reviewStatus ?? "auto_published",
    confidence_score: position.confidenceScore ?? 0.8
  };
}

async function upsert(table, records, onConflict) {
  for (let index = 0; index < records.length; index += batchSize) {
    const batch = records.slice(index, index + batchSize);
    if (batch.length === 0) continue;

    const url = new URL(`${process.env.SUPABASE_URL}/rest/v1/${table}`);
    url.searchParams.set("on_conflict", onConflict);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "content-type": "application/json",
        prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify(batch)
    });

    if (!response.ok) {
      throw new Error(`${table} upsert failed: ${response.status} ${await response.text()}`);
    }
  }
}

function sourceRecordIdFromPosition(id) {
  const match = id.match(/^mur-(.+)-(\d+)$/);
  if (!match) return id;
  return `mur:${match[1]}:${match[2]}`;
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

function normalizeKey(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function emptyToNull(value) {
  return value || null;
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
