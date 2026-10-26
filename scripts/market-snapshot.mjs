import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

// Read-only analysis: explicit day, source fingerprint, no persistence or requests.
const day = process.argv[2];
assert.match(day ?? '', /^\d{4}-\d{2}-\d{2}$/, 'Supply YYYY-MM-DD');
assert.equal(new Date(`${day}T12:00:00Z`).toISOString().slice(0, 10), day);
const raw = fs.readFileSync(new URL('../lib/generated/mur-positions.json', import.meta.url), 'utf8');
const records = JSON.parse(raw);
const check = JSON.parse(fs.readFileSync(new URL('../lib/generated/mur-check-status.json', import.meta.url), 'utf8'));
assert.equal(new Set(records.map(p => p.id)).size, records.length, 'Duplicate IDs');
const eligible = records.filter(p => !p.archivedAt && p.publishedAt <= day && /^\d{4}-\d{2}-\d{2}$/.test(p.deadline) && p.deadline >= day);
const counts = key => Object.entries(eligible.reduce((a, p) => {
  const value = p[key] || 'Non specificato';
  a[value] = (a[value] || 0) + 1;
  return a;
}, {})).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'it'));
const byType = counts('positionType');
const byRegion = counts('region');
assert.equal(byType.reduce((s, [, n]) => s + n, 0), eligible.length);
assert.equal(byRegion.reduce((s, [, n]) => s + n, 0), eligible.length);
console.log(JSON.stringify({
  analysisDay: day, sourceLastSuccessfulCheckAt: check.lastSuccessfulCheckAt,
  sourceSha256: crypto.createHash('sha256').update(raw).digest('hex'),
  unit: 'schede di bando, non posti né assunzioni; possibili duplicati non consolidati',
  totalRecords: records.length, eligibleRecords: eligible.length,
  unarchivedWithoutValidDeadline: records.filter(p => !p.archivedAt && !/^\d{4}-\d{2}-\d{2}$/.test(p.deadline)).length,
  byType, byRegion,
  ids: eligible.map(p => p.id).sort()
}, null, 2));
