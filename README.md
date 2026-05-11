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

Or directly:

```bash
node scripts/import-mur.mjs --category=fixed-term-researchers --limit=10 --out=data/mur-sample.json
```
