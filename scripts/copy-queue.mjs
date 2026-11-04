import { createHash } from 'node:crypto';

export const sourceKeys = ['id', 'title', 'summary', 'sourceUrl', 'positionType', 'institution', 'ssd', 'location', 'discipline', 'deadline', 'publishedAt', 'possibleDuplicateOf'];
export const sourceFingerprint = record => createHash('sha256').update(JSON.stringify(
  Object.fromEntries(sourceKeys.map(key => [key, record[key] ?? null]))
)).digest('hex');

// A first observation is a baseline, never evidence that every cached ID arrived today.
export function buildCopyQueue({ records, reviews, surfaces, asOf, previous = null, publications = {} }) {
  const old = new Map((previous?.items ?? []).map(item => [item.id, item]));
  const currentIds = new Set(records.map(record => record.id));
  if (currentIds.size !== records.length) throw new Error('Duplicate source IDs');
  const reviewMap = new Map(reviews.map(review => [review.source.id, review]));
  const newIds = previous ? records.filter(record => !old.has(record.id)).map(record => record.id).sort() : null;
  const changedIds = records.filter(record => old.has(record.id) && old.get(record.id).fingerprint !== sourceFingerprint(record)).map(record => record.id).sort();
  const items = records.map(record => {
    const before = old.get(record.id);
    const review = reviewMap.get(record.id);
    const matches = review && Object.entries(review.source).every(([key, value]) => record[key] === value);
    const exposed = Object.entries(surfaces).filter(([, ids]) => ids.includes(record.id)).map(([surface]) => surface);
    const priority = exposed.includes('home') ? 1 : exposed.length ? 2 : !before && previous ? 3 : 4;
    return {
      id: record.id, firstSeen: before?.firstSeen ?? asOf, fingerprint: sourceFingerprint(record),
      priority, surfaces: exposed, status: matches ? publications[record.id] ? 'pubblicata' : 'revisionata' : 'da_revisionare',
      reason: review && !matches ? 'review-source-mismatch' : changedIds.includes(record.id) ? 'source-changed' : !before && previous ? 'new-id' : 'baseline-or-backlog',
      originalRef: `lib/generated/mur-positions.json#${record.id}`, sourceUrl: record.sourceUrl,
      ...(review ? { reviewRef: `lib/position-card-copy.mjs#${record.id}` } : {}),
      ...(matches && publications[record.id] ? { publication: publications[record.id] } : {})
    };
  });
  // Keep disappeared IDs in the audit trail; they must not become "new" when reimported.
  for (const item of old.values()) if (!currentIds.has(item.id)) items.push({ ...item, surfaces: [], absentFromCurrentSnapshot: true });
  const priorityItems = items.filter(item => item.surfaces.length);
  const reviewed = item => ['revisionata', 'pubblicata'].includes(item.status);
  return {
    asOf, previousAsOf: previous?.asOf ?? null, baselineEstablished: !previous,
    newIds, newCount: newIds?.length ?? null, changedIds,
    denominator: 'Unique IDs in home6, first8 of each of the five position landings linked by Ricerche popolari, and up to3 related suggestions on those detail pages. Funding links are not position cards. Not a measured popularity ranking.',
    counts: { catalog: records.length, exposed: priorityItems.length, exposedReviewed: priorityItems.filter(reviewed).length,
      home: surfaces.home.length, homeReviewed: items.filter(item => item.surfaces.includes('home') && reviewed(item)).length,
      exposedBacklog: priorityItems.filter(item => !reviewed(item)).length,
      catalogBacklog: items.filter(item => currentIds.has(item.id) && !reviewed(item)).length,
      invalidatedReviews: items.filter(item => item.reason === 'review-source-mismatch').length },
    surfaces, items: items.sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id))
  };
}
