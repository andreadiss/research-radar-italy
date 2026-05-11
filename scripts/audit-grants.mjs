import { mkdir, readFile, writeFile } from "node:fs/promises";

const inputPath = "lib/generated/grants.json";
const outputPath = "data/store/grants-audit-report.json";
const today = new Date("2026-05-05T00:00:00Z");

const grants = JSON.parse(await readFile(inputPath, "utf8"));
const report = buildReport(grants);

await mkdir("data/store", { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(`Grants audit: ${report.total} records, ${report.officialCalls} official calls, ${report.monitoringSources} monitoring sources`);
console.log(`Wrote ${outputPath}`);

function buildReport(grants) {
  const issues = [];
  const byProgram = countBy(grants, "program");
  const byStatus = countBy(grants, "status");
  const bySourceType = countBy(grants, "sourceType");
  const nextDeadlines = grants
    .filter((grant) => /^\d{4}-\d{2}-\d{2}$/.test(grant.deadline))
    .map((grant) => ({
      id: grant.id,
      title: grant.title,
      program: grant.program,
      deadline: grant.deadline,
      daysUntilDeadline: daysUntil(grant.deadline)
    }))
    .sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);

  for (const grant of grants) {
    if (!grant.sourceUrl || !/^https?:\/\//.test(grant.sourceUrl)) {
      issues.push({ id: grant.id, severity: "high", reason: "missing_or_invalid_source_url" });
    }

    if (!grant.deadline || grant.deadline === "monitoraggio fonte") {
      issues.push({ id: grant.id, severity: "medium", reason: "missing_structured_deadline" });
    }

    if (grant.sourceType === "official_call" && grant.status === "source_monitoring") {
      issues.push({ id: grant.id, severity: "medium", reason: "official_call_marked_as_monitoring" });
    }

    if (!grant.eligibility || grant.eligibility.length < 12) {
      issues.push({ id: grant.id, severity: "low", reason: "weak_eligibility_text" });
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    total: grants.length,
    officialCalls: grants.filter((grant) => grant.sourceType === "official_call").length,
    officialSources: grants.filter((grant) => grant.sourceType === "official_source").length,
    monitoringSources: grants.filter((grant) => grant.sourceType === "monitoring_source").length,
    open: grants.filter((grant) => grant.status === "open").length,
    upcoming: grants.filter((grant) => grant.status === "upcoming").length,
    closed: grants.filter((grant) => grant.status === "closed").length,
    unknownDeadline: grants.filter((grant) => !/^\d{4}-\d{2}-\d{2}$/.test(grant.deadline)).length,
    byProgram,
    byStatus,
    bySourceType,
    nextDeadlines,
    issues
  };
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item[key] ?? "unknown";
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function daysUntil(value) {
  const deadline = new Date(`${value}T00:00:00Z`);
  return Math.ceil((deadline.getTime() - today.getTime()) / 86_400_000);
}
