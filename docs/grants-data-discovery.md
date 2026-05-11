# Grants Data Discovery

## Current Status

Sprint 3 now has a first Grants/funding vertical slice:

- `lib/generated/grants.json` contains a curated dataset of official calls and source-monitoring entries.
- `lib/grants.ts` loads the generated grants into the frontend.
- `npm run import:grants` regenerates the curated local dataset.
- `npm run import:grants:live` fetches the PRIN portal, replaces PRIN curated records with parsed official calls, classifies the MUR PNRR source page, attempts live enrichment of REA MSCA pages, and falls back to curated values if parsing fails.
- `npm run audit:grants` writes `data/store/grants-audit-report.json`.
- PNRR classification writes `data/store/pnrr-classification-report.json`.

## Integrated Sources

### PRIN 2026

Source: `https://prin.mur.gov.it/Iniziative`

The PRIN portal lists:

- `Bando PRIN 2026 - Decreto Direttoriale n. 2298 del 10 Aprile 2026`
- Application window: 17 April 2026 15:00 to 1 June 2026 15:00
- `Bando PRIN 2026 HYBRID - Decreto direttoriale n. 2610 del 17 aprile 2026`
- Application window: 20 April 2026 15:00 to 4 June 2026 15:00

Implementation state:

- Imported from `prin.mur.gov.it/Iniziative` in live mode.
- The importer extracts edition, title, decree text, detail URL and application window.
- Current live records: `prin-2026` and `prin-2026-hybrid`.
- Next hardening step: extract attachments and incompatibility notes as structured fields.

### PNRR / PRIN PNRR

Sources:

- `https://prin.mur.gov.it/`
- `https://www.mur.gov.it/it/pnrr/misure-e-componenti/m4c2/investimento-11-fondo-il-programma-nazionale-della-ricerca`
- `https://www.italiadomani.gov.it/`

Implementation state:

- Added as a monitoring source, not as a live call.
- `scripts/import-grants.mjs --live` now classifies relevant PNRR links into `open_call`, `administrative_document`, `admission_or_ranking`, `monitoring_or_reporting` and `other`.
- The importer decision is stored in `data/store/pnrr-classification-report.json`.
- Current rule: PNRR remains `monitoring_source` unless the classifier finds candidate open calls that can be reviewed before publication.
- PNRR pages mix calls, decrees, admission lists, reporting instructions, audits and project records, so broad PNRR pages must not become grant cards by default.

### MSCA / REA

Sources:

- `https://rea.ec.europa.eu/funding-and-grants/horizon-europe-marie-sklodowska-curie-actions/msca-postdoctoral-fellowships_en`
- `https://rea.ec.europa.eu/funding-and-grants/horizon-europe-marie-sklodowska-curie-actions/msca-doctoral-networks_en`

Implementation state:

- Added as official call records.
- `npm run import:grants:live` attempts to extract launch date, deadline and indicative budget from these pages.
- Fallback keeps curated values if the source HTML changes or network access is unavailable.

### ERC / Horizon Europe

Sources:

- `https://erc.europa.eu/apply-grant/advanced-grant`
- `https://ec.europa.eu/info/funding-tenders/opportunities/portal/`

Implementation state:

- ERC Advanced Grant 2026 is represented as an official source/call record.
- Horizon Europe is represented as a monitoring source until the Funding & Tenders importer has a fixture and audit report.
- Strategy documented in `docs/horizon-funding-tenders-strategy.md`.

## Next Importer Priorities

1. PRIN parser hardening: attachments, detail pages, incompatibility notes and fixtures.
2. REA MSCA parser hardening with fixtures.
3. Funding & Tenders importer spike for ERC, MSCA and Horizon topic-level calls.
4. PNRR classifier hardening with fixtures and false-positive review rules.
5. Grants audit extension: link checks, stale-source detection and importer health.
