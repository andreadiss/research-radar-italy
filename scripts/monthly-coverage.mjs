import assert from 'node:assert/strict';

const romeDay = value => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit'
}).format(new Date(value));

// Necessary checks only. A successful sync does not establish historical coverage.
export function assessMonthlyCoverage({ month, records, lastSuccessfulCheckAt, asOf }) {
  assert.match(month ?? '', /^\d{4}-(0[1-9]|1[0-2])$/);
  assert(Number(month.slice(0, 4)) >= 1000 && Number(month.slice(0, 4)) < 9999);
  const start = new Date(`${month}-01T00:00:00Z`);
  const next = new Date(start);
  next.setUTCMonth(next.getUTCMonth() + 1);
  const nextMonthStart = next.toISOString().slice(0, 10);
  const now = Date.parse(asOf);
  assert(Number.isFinite(now), 'asOf must be a valid timestamp');
  const checked = Date.parse(lastSuccessfulCheckAt);
  const validCheck = Number.isFinite(checked) && checked <= now;
  const monthClosed = romeDay(now) >= nextMonthStart;
  const checkedAfterMonthEnd = validCheck && romeDay(checked) >= nextMonthStart;
  const rows = records.filter(p => p.publishedAt?.startsWith(`${month}-`));
  const dates = rows.map(p => p.publishedAt.slice(0, 10)).sort();
  const blockers = [];
  if (!monthClosed) blockers.push('month-in-progress');
  if (!validCheck) blockers.push('invalid-or-future-source-check');
  else if (!checkedAfterMonthEnd) blockers.push('source-check-before-month-end');
  blockers.push('historical-coverage-not-validated');
  return {
    asOf, timeZone: 'Europe/Rome', monthClosed,
    lastSuccessfulCheckAt: lastSuccessfulCheckAt ?? null,
    checkedAfterMonthEnd, historicalCoverageVerified: false,
    marketComparisonAllowed: false, blockers,
    cachedPublications: rows.length,
    earliestCachedPublication: dates[0] ?? null,
    latestCachedPublication: dates.at(-1) ?? null,
    nextMonthStart,
    limitation: 'Presenza nella cache, non completezza della raccolta. Data più recente e sync dopo fine mese non provano copertura storica o comparabilità. Nessuna variazione del mercato inferibile.'
  };
}
