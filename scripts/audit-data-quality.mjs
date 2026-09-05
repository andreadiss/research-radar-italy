import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const positions = JSON.parse(await readFile("lib/generated/mur-positions.json", "utf8"));
const grants = JSON.parse(await readFile("lib/generated/grants.json", "utf8"));
const now = new Date();
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
const errors = [], warnings = [];
const counts = (items, key) => Object.fromEntries([...new Set(items.map((item) => item[key]))].map((value) => [String(value), items.filter((item) => item[key] === value).length]));
for (const [kind, items] of [["position", positions], ["grant", grants]]) {
  const ids = new Set(), urls = new Map();
  for (const item of items) {
    const issue = (code, list = warnings) => list.push({ kind, id: item.id, code });
    if (!item.id || ids.has(item.id)) issue("duplicate_or_missing_id", errors);
    ids.add(item.id);
    if (!item.title || !item.sourceName || !item.sourceUrl) issue("missing_identity_or_source", errors);
    try {
      const url = new URL(item.sourceUrl);
      if (!["https:", "http:"].includes(url.protocol)) issue("unsafe_source_protocol", errors);
      if (urls.has(url.href)) issue("shared_source_url");
      urls.set(url.href, item.id);
    } catch { issue("invalid_source_url", errors); }
    if (item.deadline !== "monitoraggio fonte") {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(item.deadline) || !Number.isFinite(Date.parse(item.deadline)) || new Date(item.deadline).toISOString().slice(0, 10) !== item.deadline) issue("invalid_deadline", errors);
      else if (item.deadline < today) issue("past_deadline_retained");
    }
    if (item.publishedAt && item.publishedAt.slice(0, 10) > today) issue("future_publication_date");
    if (kind === "position" && item.fundingType === "Non specificato") issue("funding_unspecified");
    if (item.possibleDuplicateOf) issue("possible_duplicate_requires_review");
    for (const code of item.reviewReasons ?? []) if (code !== "possible_duplicate") issue(code);
    if (kind === "position" && item.requirements?.every((text) => /^https?:|^Requisiti indicati/.test(text))) issue("requirements_not_extracted");
    if (item.updatedAt && now.getTime() - Date.parse(item.updatedAt) > 48 * 3600000 && !item.archivedAt) issue("record_not_updated_within_48h_check_source_freshness");
  }
}
const report = {
  checkedAt: now.toISOString(), asOf: today,
  positions: { total: positions.length, openByDeadline: positions.filter((p) => !p.archivedAt && p.deadline >= today).length, archived: positions.filter((p) => p.archivedAt).length, expired: positions.filter((p) => p.deadline < today).length, byType: counts(positions, "positionType"), reviewStatus: counts(positions, "reviewStatus") },
  grants: { total: grants.length, available: grants.filter((g) => ["open", "upcoming"].includes(g.status) && g.deadline >= today).length, byStatus: counts(grants, "status") },
  errors, warnings,
  warningCounts: Object.fromEntries([...new Set(warnings.map((w) => w.code))].map((code) => [code, warnings.filter((w) => w.code === code).length])),
  limitations: ["Offline validation; source availability and deadline changes require a separate official-source check.", "Possible duplicates are review candidates, not confirmed duplicates. No records are deleted.", "Record modification time is not proof of the latest successful source check."]
};
const output = process.argv.find((arg) => arg.startsWith("--out="))?.slice(6) ?? "data/store/data-quality-report.json";
await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ output, positions: report.positions, grants: report.grants, errors: errors.length, warningCounts: report.warningCounts }, null, 2));
if (errors.length) process.exitCode = 1;
