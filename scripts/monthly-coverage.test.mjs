import test from 'node:test';
import assert from 'node:assert/strict';
import { assessMonthlyCoverage } from './monthly-coverage.mjs';

const run = overrides => assessMonthlyCoverage({ month: '2026-10',
  records: [{ publishedAt: '2026-10-01' }, { publishedAt: '2026-10-21', archived: true }, { publishedAt: '2026-09-30' }],
  lastSuccessfulCheckAt: '2026-10-21T10:16:40.979Z', asOf: '2026-10-29T08:46:31Z', ...overrides });

test('current month and stale source cannot support a monthly market comparison', () => {
  const result = run();
  assert.equal(result.monthClosed, false);
  assert.equal(result.checkedAfterMonthEnd, false);
  assert.equal(result.cachedPublications, 2); // Includes expired/archived, not just open stock.
  assert.equal(result.latestCachedPublication, '2026-10-21');
  assert.deepEqual(result.blockers, ['month-in-progress', 'source-check-before-month-end', 'historical-coverage-not-validated']);
});
test('a later successful sync never certifies historical completeness automatically', () => {
  const result = run({ asOf: '2026-11-05T12:00:00Z', lastSuccessfulCheckAt: '2026-11-04T12:00:00Z' });
  assert.equal(result.monthClosed, true);
  assert.equal(result.checkedAfterMonthEnd, true);
  assert.equal(result.historicalCoverageVerified, false);
  assert.equal(result.marketComparisonAllowed, false);
  assert.deepEqual(result.blockers, ['historical-coverage-not-validated']);
});
test('month boundaries use Rome midnight including winter and summer time', () => {
  assert.equal(run({ asOf: '2026-10-31T22:59:59Z' }).monthClosed, false);
  assert.equal(run({ asOf: '2026-10-31T23:00:00Z' }).monthClosed, true);
  assert.equal(run({ month: '2026-06', asOf: '2026-06-30T22:00:00Z' }).monthClosed, true);
});
test('leap years and year rollover have correct exclusive end dates', () => {
  assert.equal(run({ month: '2028-02' }).nextMonthStart, '2028-03-01');
  assert.equal(run({ month: '2026-12' }).nextMonthStart, '2027-01-01');
});
test('missing, invalid and future source checks are blockers, not freshness evidence', () => {
  for (const value of [undefined, '', 'not-a-date', '2026-11-05T12:00:00Z']) {
    const result = run({ lastSuccessfulCheckAt: value });
    assert(result.blockers.includes('invalid-or-future-source-check'));
    assert.equal(result.checkedAfterMonthEnd, false);
  }
});
test('empty months are not evidence of zero market demand', () => {
  const result = run({ records: [] });
  assert.equal(result.cachedPublications, 0);
  assert.equal(result.latestCachedPublication, null);
  assert.equal(result.marketComparisonAllowed, false);
});
test('invalid month and reporting timestamp fail clearly', () => {
  assert.throws(() => run({ month: '2026-13' }));
  assert.throws(() => run({ asOf: 'invalid' }));
});
