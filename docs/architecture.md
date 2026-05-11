# Architecture

## System Overview

```text
MUR/Cineca
   |
   v
Importer job
   |
   v
Raw source records
   |
   v
Normalization and dedupe
   |
   v
Positions database
   |
   v
Web app, alerts, newsletter
```

## Planned Components

### Web App

Next.js app with public pages, API endpoints, and eventually authenticated user flows.

### Database

PostgreSQL through Supabase.

Core tables:

- positions
- source_records
- sources
- saved_searches
- alert_subscriptions
- import_runs
- admin_reviews

### Importers

Start with MUR/Cineca. Each importer should:

- Fetch source data
- Store raw records
- Normalize into internal position shape
- Detect duplicates
- Mark confidence
- Emit an import report

Current local integration:

```text
npm run sync:mur
   |
   v
data/mur-latest.json
   |
   v
data/store/source-records.json
data/store/positions.json
data/store/import-runs.json
   |
   v
lib/generated/mur-positions.json
   |
   v
Next.js frontend
```

Current normalization outputs production-oriented metadata:

- canonical source URL
- source-id and URL dedupe, plus conservative title/institution/deadline dedupe
- deadline status: `open`, `closing_soon`, `expired`, `unknown`
- professor rank for professor calls
- GSD/SSD-backed discipline classification
- broader Italian region inference

### AI Enrichment

The AI layer should only derive structured metadata from source text. It must not invent facts.

Allowed enrichment:

- Summary
- Discipline classification
- Funding detection
- Requirement extraction
- Duration and amount extraction
- IT/EN translation

## Operational Principles

- Preserve official source URLs.
- Store raw source data for traceability.
- Prefer automated publish for high-confidence data.
- Route ambiguous records into admin review.
- Keep imports idempotent.
