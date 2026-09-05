// Review candidates only. Never changes or deletes published opportunities.
import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";

const positions = JSON.parse(await readFile("lib/generated/mur-positions.json", "utf8"));
const checkedAt = new Date().toISOString();
const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit"
}).format(new Date(checkedAt));
const reviews = new Map();
for (const file of (await readdir("docs/operations")).filter((name) => /^funding-review-.*\.json$/.test(name)).sort()) {
  const report = JSON.parse(await readFile(`docs/operations/${file}`, "utf8"));
  for (const review of report.reviews ?? []) {
    const previous = reviews.get(review.id);
    if (!previous || review.checkedAt > previous.checkedAt) reviews.set(review.id, review);
  }
}
const candidates = positions
  .filter((item) => item.fundingType === "MSCA" && !item.archivedAt && item.deadline >= today)
  .sort((a, b) => a.deadline.localeCompare(b.deadline) || a.id.localeCompare(b.id))
  .map((item) => ({
    id: item.id, title: item.title, institution: item.institution,
    deadline: item.deadline, sourceUrl: item.sourceUrl, fundingType: item.fundingType,
    programmeMentionInExcerpt: /\bMSCA\b|\bMARIE[\s-]+(?:SK[ŁL]ODOWSKA[\s-]+)?CURIE\b/i.test(`${item.title} ${item.summary}`),
    priorReview: reviews.get(item.id) ?? null,
    decision: "pending_official_source_review"
  }));
const report = {
  checkedAt, asOf: today, count: candidates.length,
  limitations: [
    "Targeted queue, not a representative sample or proof of misclassification.",
    "A missing programme name in a truncated excerpt does not prove absence from the call.",
    "A programme mention is not proof of funding. Read the current official source before any correction."
  ],
  candidates
};
await mkdir("data/store", { recursive: true });
await writeFile("data/store/funding-review-queue.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ output: "data/store/funding-review-queue.json", count: candidates.length,
  next: candidates.slice(0, 6).map(({ id, deadline, programmeMentionInExcerpt }) => ({ id, deadline, programmeMentionInExcerpt })) }, null, 2));
