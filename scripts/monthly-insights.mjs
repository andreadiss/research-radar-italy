import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { assessMonthlyCoverage } from './monthly-coverage.mjs';

const month = process.argv[2];
assert.match(month ?? '', /^\d{4}-(0[1-9]|1[0-2])$/);
const raw = fs.readFileSync(new URL('../lib/generated/mur-positions.json', import.meta.url), 'utf8');
const records = JSON.parse(raw);
const checkStatus = JSON.parse(fs.readFileSync(new URL('../lib/generated/mur-check-status.json', import.meta.url), 'utf8'));
// Optional third argument fixes the reporting instant for a reproducible editorial review.
const coverage = assessMonthlyCoverage({ month, records,
  lastSuccessfulCheckAt: checkStatus.lastSuccessfulCheckAt,
  asOf: process.argv[3] ?? new Date().toISOString() });
assert.equal(records.length, new Set(records.map(p => p.id)).size);
// Monthly publications include now-expired/archived records; this is not open stock.
const rows = records.filter(p => p.publishedAt?.startsWith(`${month}-`));
const count = key => Object.entries(rows.reduce((a, p) => {
  const value = p[key] || 'Non specificato';
  a[value] = (a[value] || 0) + 1;
  return a;
}, {})).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
const definitions = [
  ['IA e machine learning', 'intelligenza artificiale|artificial intelligence|machine learning|deep learning'],
  ['Energia', 'energ\\w*'],
  ['Clima', 'climat\\w*|climate'],
  ['Riferimenti neuro', 'neuro\\w*'],
  ['Tumori e oncologia', 'tumor\\w*|oncolog\\w*|cancer\\w*']
];
const topics = definitions.map(([label, pattern]) => {
  const matches = rows.filter(p => new RegExp(pattern, 'i').test(`${p.title} ${p.summary}`));
  return { label, pattern, count: matches.length, ids: matches.map(p => p.id).sort() };
});
for (const key of ['positionType', 'discipline', 'region', 'ssd']) {
  assert.equal(count(key).reduce((n, [, c]) => n + c, 0), rows.length);
}
console.log(JSON.stringify({ month, total: rows.length,
  coverage,
  sourceSha256: crypto.createHash('sha256').update(raw).digest('hex'),
  unit: 'schede pubblicate nel mese presenti nella cache, non posti o assunzioni',
  comparisonStatus: 'Copertura mensile non validata: nessuna crescita o diminuzione del mercato inferibile',
  byType: count('positionType'), byArea: count('discipline'), bySsd: count('ssd'),
  byRegion: count('region'), topics,
  topicLimits: 'Cinque famiglie lessicali predefinite e sovrapposte. Non classifica esaustiva né classificazione semantica; possibili falsi positivi e omissioni.',
  ids: rows.map(p => p.id).sort() }, null, 2));
