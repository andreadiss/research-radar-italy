# Sprint 3

## Goal

Create the first real Grants/funding experience without mixing grants with open positions.

## Completed

- `/?intent=bandi` now renders a dedicated Grants listing.
- Grants use `Programma` and `Materia` filters.
- Grants cards match the visual language of open positions.
- Grants detail pages exist under `/grants/[id]`.
- `GrantOpportunity` type added for funding-specific data.
- `lib/generated/grants.json` stores generated Grants data.
- `lib/grants.ts` loads Grants data into the frontend.
- `npm run import:grants` regenerates the curated dataset.
- `npm run import:grants:live` imports PRIN 2026 calls from the official PRIN portal and enriches REA MSCA pages with curated fallback.
- `npm run audit:grants` writes `data/store/grants-audit-report.json`.
- PRIN 2026 and PRIN 2026 HYBRID are imported from `https://prin.mur.gov.it/Iniziative`.
- MSCA Postdoctoral Fellowships and MSCA Doctoral Networks are connected to official REA pages.
- Grants data discovery is documented in `docs/grants-data-discovery.md`.

## Current Grants Data

- 7 Grants records total.
- 4 official calls.
- 1 official source.
- 2 monitoring sources.
- 4 open records.
- 1 upcoming record.
- 2 records without structured deadline: PNRR and Horizon monitoring sources.

## Verification

- `npm run import:grants:live` passed.
- `npm run audit:grants` passed.
- `npm run typecheck` passed.
- Grants listing responds on `/?intent=bandi`.
- PRIN detail pages respond under `/grants/prin-2026` and `/grants/prin-2026-hybrid`.

## Carryover

- PNRR remains a monitoring source and needs a classifier before showing open calls.
- Horizon Europe remains a monitoring source until a Funding & Tenders API strategy is selected.
- PRIN parser should be hardened with attachments, detail page parsing and fixtures.
