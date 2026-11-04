import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCopyQueue, sourceFingerprint } from './copy-queue.mjs';
const a = { id: 'a', title: 'Official', summary: 'Research', sourceUrl: 'https://example.test/a' };
const review = { source: { ...a }, title: 'Clear', summary: 'Clear research' };
const args = { records: [a], reviews: [review], surfaces: { home: ['a'] }, asOf: '2026-11-04T08:44:16Z' };
test('first snapshot is explicitly a baseline, not a wave of new arrivals', () => {
  const q = buildCopyQueue(args);
  assert.equal(q.newCount, null); assert.equal(q.baselineEstablished, true);
  assert.equal(q.counts.homeReviewed, 1); assert.equal(q.items[0].status, 'revisionata');
});
test('ID delta detects an old publication imported later and preserves firstSeen', () => {
  const previous = buildCopyQueue(args);
  const q = buildCopyQueue({ ...args, records: [a, { ...a, id: 'b', publishedAt: '2025-01-01' }], previous, asOf: '2026-11-05T08:00:00Z' });
  assert.deepEqual(q.newIds, ['b']); assert.equal(q.items.find(item => item.id === 'a').firstSeen, args.asOf);
});
test('fingerprint mismatch requeues approved copy rather than claiming coverage', () => {
  assert.notEqual(sourceFingerprint(a), sourceFingerprint({ ...a, summary: 'Changed' }));
  const q = buildCopyQueue({ ...args, records: [{ ...a, summary: 'Changed' }], previous: buildCopyQueue(args), publications: { a: { pr: 1 } } });
  assert.deepEqual(q.changedIds, ['a']); assert.equal(q.counts.exposedReviewed, 0);
  assert.equal(q.items[0].reason, 'review-source-mismatch');
});
test('published requires evidence; disappeared IDs survive and are not new on return', () => {
  const first = buildCopyQueue({ ...args, publications: { a: { pr: 1 } } });
  assert.equal(first.items[0].status, 'pubblicata');
  const absent = buildCopyQueue({ ...args, records: [], surfaces: { home: [] }, previous: first });
  assert.equal(absent.items[0].absentFromCurrentSnapshot, true);
  assert.equal(buildCopyQueue({ ...args, previous: absent }).newCount, 0);
});
