# Horizon / Funding & Tenders Strategy

## Status

Horizon Europe is still a monitored source in Research Radar Italy. It is not yet a full importer because the product must avoid publishing broad programme pages as if they were candidate-ready calls.

## Official Source

- EU Funding & Tenders Portal API page: https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/support/apis
- Funding & Tenders calls pages expose topic-list data for calls for proposals and should be treated as the primary official data surface before scraping rendered UI pages.

## Importer Strategy

1. Start from the official Topic List data exposed by Funding & Tenders.
2. Filter to Horizon Europe framework programme and grant/call-for-proposals records.
3. Keep only open or upcoming topics for the first production importer.
4. Normalize each topic into the Grants model:
   - `id`: topic identifier or call identifier plus topic code.
   - `title`: official topic title.
   - `program`: Horizon Europe, ERC or MSCA where the topic clearly belongs to that family.
   - `funder`: European Commission / relevant agency.
   - `discipline`: mapped to Research Radar macro disciplines using title, destination, cluster and keywords.
   - `deadline`: official deadline date.
   - `amount`: budget where exposed.
   - `eligibility`: action type and consortium/participant rules when exposed.
   - `sourceUrl`: official Funding & Tenders topic URL.
   - `sourceType`: `official_call` only when the topic has a concrete deadline and application page.
5. Dedupe by topic identifier first, then by title, deadline and programme.
6. Audit after each import:
   - open/upcoming/closed counts;
   - missing deadlines;
   - missing official URLs;
   - broad programme pages incorrectly classified as calls.

## Product Rules

- Horizon remains `monitoring_source` until the importer has a fixture and an audit report.
- Broad programme pages are useful sources but must not become grant cards unless they point to specific calls.
- ERC and MSCA pages can remain curated/enriched in parallel, but the Funding & Tenders importer should eventually become the canonical source for EU calls.

## Next Sprint Tasks

- Add a `scripts/import-horizon.mjs` spike that fetches one official topic-list response.
- Save the raw sample in `data/store/horizon-topic-list-sample.json`.
- Add `scripts/audit-horizon.mjs` with counts for status, deadline and source URL.
- Integrate only after the importer can produce specific open/upcoming call records.
