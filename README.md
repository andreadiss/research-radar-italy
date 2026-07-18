# Research Radar Italy

An MVP for discovering academic and research opportunities in Italy, starting from MUR/Cineca data and expanding to PRIN, PNRR, Euraxess, inPA, Gazzetta Ufficiale, universities, and research institutes.

## Product Goal

Make Italian academic calls easier to find, filter, understand, save, and monitor than existing ministerial portals and aggregators.

## Stack

- Next.js App Router
- TypeScript
- Static export on GitHub Pages
- PostgreSQL/Supabase for persisted source data and future account flows
- MUR/Cineca importer
- AI enrichment, planned
- Email alerts/newsletter, planned

## Local Development

Install dependencies once a Node package manager is available:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Until dependencies are installed, you can open `prototype.html` directly in a browser to review the first clickable direction.

## Project Docs

- [Product spec](docs/product-spec.md)
- [Backlog](docs/backlog.md)
- [Sprint 0](docs/sprint-00.md)
- [Architecture](docs/architecture.md)
- [Data sources](docs/data-sources.md)
- [MUR data discovery](docs/mur-data-discovery.md)
- [Sprint plan](docs/sprint-plan.md)
- [Decision log](docs/decisions.md)

## MUR/Cineca Importer

Run a sample import:

```bash
npm run import:mur
```

Run the integrated local data pipeline:

```bash
npm run sync:mur
```

Run a full open-position sync across all MUR/Cineca categories:

```bash
npm run sync:mur:all
```

## Automated Data Refresh

Open MUR/Cineca positions are refreshed by the GitHub Actions workflow `.github/workflows/sync-mur.yml`.

- Schedule: daily at `05:15 UTC`, around morning in Italy.
- Manual run: GitHub repository -> Actions -> `Sync MUR positions` -> `Run workflow`.
- Behavior: imports all currently open MUR positions, regenerates `lib/generated/mur-positions.json`, builds the app, and commits only when the generated cache changes.
- Supabase: when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured as GitHub Actions secrets, the workflow also persists sources, import runs, source records and positions to Supabase.
- Deployment: the workflow push to `main` triggers the static GitHub Pages deployment.

## Production Deployment

The public release is a static export hosted on GitHub Pages with the custom domain `https://rritaly.com`.

```bash
npm run build:static
```

The GitHub Actions workflow `.github/workflows/deploy-pages.yml` builds the static export from `main` and publishes the generated `out` directory to GitHub Pages. The `public/CNAME` file keeps the custom domain attached to the Pages deployment.

Because the release is static, browser favorites and lightweight account feedback are stored locally in the browser. Server-side auth, Google login persistence, email automation and cross-device saved lists remain Supabase-backed product work for a future dynamic layer.

If Supabase was initialized before the dedupe constraint change, run:

```sql
-- db/migrations/2026-05-11-drop-positions-dedupe-unique.sql
ALTER TABLE positions
  DROP CONSTRAINT IF EXISTS positions_dedupe_key_key;

CREATE INDEX IF NOT EXISTS positions_dedupe_key_idx
  ON positions(dedupe_key);
```

Or directly:

```bash
node scripts/import-mur.mjs --category=fixed-term-researchers --limit=10 --out=data/mur-sample.json
```
