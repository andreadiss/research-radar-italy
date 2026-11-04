import fs from 'node:fs';
import ts from 'typescript';
import { buildCopyQueue } from './copy-queue.mjs';
import { reviewedCardCopy } from '../lib/position-card-copy.mjs';
import { applyVerifiedPositionEnrichment } from '../lib/verified-position-enrichments.mjs';

const asOf = process.argv[2];
if (!asOf || !Number.isFinite(Date.parse(asOf))) throw new Error('Supply an explicit ISO reporting instant');
const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(asOf));
const loadTs = async path => {
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
};
const { relatedPositions } = await loadTs('lib/related-positions.ts');
const { seoLandingPages } = await loadTs('lib/seo-landing-pages.ts');
const { isOpenPosition } = await loadTs('lib/opportunity-status.ts');
const records = JSON.parse(fs.readFileSync('lib/generated/mur-positions.json', 'utf8')).map(applyVerifiedPositionEnrichment);
const open = records.filter(record => isOpenPosition(record, day));
const recent = rows => [...rows].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
const surfaces = { home: recent(open.filter(record => record.publishedAt <= day)).slice(0, 6).map(record => record.id) };
for (const page of seoLandingPages.filter(page => page.kind === 'positions')) {
  surfaces[page.path] = recent(open.filter(record => (!page.filter.type || record.positionType === page.filter.type) && (!page.filter.discipline || record.discipline === page.filter.discipline))).slice(0, 8).map(record => record.id);
}
const seeds = [...new Set(Object.values(surfaces).flat())];
for (const id of seeds) surfaces[`related:${id}`] = relatedPositions(records.find(record => record.id === id), records, day).map(record => record.id);
const priorName = fs.readdirSync('docs/growth').filter(name => /^copy-queue-\d{4}-\d{2}-\d{2}\.json$/.test(name) && name < `copy-queue-${day}.json`).sort().at(-1);
const previous = priorName ? JSON.parse(fs.readFileSync(`docs/growth/${priorName}`, 'utf8')) : null;
const publications = JSON.parse(fs.readFileSync('docs/growth/copy-publications.json', 'utf8'));
const queue = buildCopyQueue({ records, reviews: reviewedCardCopy, surfaces, asOf, previous, publications });
queue.sourceCheck = JSON.parse(fs.readFileSync('lib/generated/mur-check-status.json', 'utf8')).lastSuccessfulCheckAt;
queue.limits = 'firstSeen means this registered observation, not publication or import date. Source/proposal/evidence are linked to the existing cache and copy-review registries. New reviews stay revisionata until a verified publication is recorded; see the release PR comment for post-deploy closure.';
if (process.argv.includes('--write')) {
  const { items, ...header } = queue;
  fs.writeFileSync(`docs/growth/copy-queue-${day}.json`, JSON.stringify(header, null, 2).slice(0, -2) + ',\n  "items": [\n' + items.map(item => '    ' + JSON.stringify(item)).join(',\n') + '\n  ]\n}\n');
}
console.log(JSON.stringify({ counts: queue.counts, newCount: queue.newCount, changedIds: queue.changedIds, sourceCheck: queue.sourceCheck, home: surfaces.home, baselineEstablished: queue.baselineEstablished }, null, 2));
