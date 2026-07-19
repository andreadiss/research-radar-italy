# Architecture

## System Overview

```text
MUR/Cineca
   |
   v
GitHub Actions importer job
   |
   v
Raw source records
   |
   v
Normalization and dedupe
   |
   v
Positions database and generated JSON cache
   |
   v
Static web app, alerts, newsletter
```

## Planned Components

### Web App

Next.js App Router app exported as a static site for the public release.

Current production hosting:

- GitHub Pages serves the generated static `out` directory.
- `public/CNAME` attaches the custom domain `rritaly.com`.
- Public pages, listings, details, sitemap and robots are static.
- Favorites use browser local storage in the static release.
- Login, signup, Google OAuth, email alerts and cross-device saved lists are not exposed in the static release.

Dynamic account persistence, Google auth, email automation and premium flows belong to a separate backend sprint and must be verified end to end before returning to the public UI.

### Database

PostgreSQL through Supabase.

Supabase is currently used as the production persistence target for importer data when GitHub Actions secrets are configured. User-facing auth persistence is paused in the static release and should return through a dedicated dynamic layer.

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
