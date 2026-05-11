# Research Radar Italy

An MVP for discovering academic and research opportunities in Italy, starting from MUR/Cineca data and expanding to PRIN, PNRR, Euraxess, inPA, Gazzetta Ufficiale, universities, and research institutes.

## Product Goal

Make Italian academic calls easier to find, filter, understand, save, and monitor than existing ministerial portals and aggregators.

## Stack

- Next.js App Router
- TypeScript
- PostgreSQL/Supabase, planned
- MUR/Cineca importer, planned
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
- Deployment: the workflow push to `main` triggers a new Vercel deployment.

Or directly:

```bash
node scripts/import-mur.mjs --category=fixed-term-researchers --limit=10 --out=data/mur-sample.json
```
