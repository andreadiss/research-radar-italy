# MUR/Cineca Data Discovery

Date: 2026-05-04

## Official Source

Base URL: https://bandi.mur.gov.it/

The homepage links to eight relevant public search areas:

- `/doctorate.php/public/cercaFellowship` - dottorati
- `/tecno.php/public/cercaJobs` - tecnologi
- `/bandi.php/public/cercaFellowship` - assegni di ricerca
- `/jobs.php/public/cercaJobs` - ricercatori a tempo determinato
- `/profcalls.php/public/cercaJobs` - chiamate professori
- `/contrattidiricerca.php/public/cercaFellowship` - contratti di ricerca
- `/incarichidiricerca.php/public/cercaFellowship` - incarichi di ricerca
- `/incarichipostdoc.php/public/cercaFellowship` - incarichi post doc

## Endpoint Pattern

No public JSON API was found during this pass. The site is classic server-rendered HTML.

Search pages use GET forms and require `azione=cerca` to return results. Open calls are requested through the category-specific status select field with value `2-3`.

Examples:

```text
https://bandi.mur.gov.it/jobs.php/public/cercaJobs?azione=cerca&jv_comp_status_id=2-3&bb_type_code=%25&idsettore=%25&idgsd24=%25&idqualifica=%25
```

The status field name varies by category, so the importer discovers any select whose name ends in `status_id`.

## Pagination Pattern

The search result page includes all result pages in HTML under `#hiddenresult`. The JavaScript file `/js/mypagination.js` clones one `div.result` at a time into `#Searchresult`; it does not call a backend pagination API.

This means the MVP importer can fetch one search URL and extract all detail links from that HTML response.

## Detail Page Pattern

Detail URLs are stable and category-specific:

```text
/jobs.php/public/job/id_job/147145
/bandi.php/public/fellowship/id_fellow/{id}
```

Detail pages use table rows with `th` labels and adjacent `td` values. The first importer extracts all `th/td` pairs into `rawFields`, then maps common labels into our normalized position shape.

Useful labels observed:

- Titolo del progetto di ricerca in italiano
- Descrizione sintetica in italiano
- Data del bando
- Data di scadenza del bando
- Organizzazione/Ente
- Stato/Provincia
- Citta
- G.S.D.
- S.S.D
- Numero posti
- Tipo di contratto
- Come candidarsi
- Sito web del bando
- Importo annuale
- Nome dell'Ente finanziatore

## Importer

Prototype script:

```bash
node scripts/import-mur.mjs --limit=5 --out=data/mur-sample.json
```

For one category:

```bash
node scripts/import-mur.mjs --category=fixed-term-researchers --limit=10
```

The importer:

- discovers form params per category
- requests open calls with status `2-3`
- extracts stable detail URLs
- fetches detail pages
- normalizes common fields
- detects funding tags: PNRR, PRIN, ERC, MSCA, Horizon, MUR
- writes JSON for the next database/import step

## Risks

- Some categories may have zero open calls at a given time.
- Labels vary slightly across categories.
- Some fields can be empty or duplicated on detail pages.
- The source is HTML, not an API, so parser tests are important.

## Next Steps

- Add parser fixtures for one detail page per category.
- Persist raw HTML in addition to raw fields if traceability requires exact source snapshots.
- Add scheduled import run and import report.

## Coverage Audit

Latest live audit: 2026-05-05.

The official homepage currently exposes eight public search areas. `npm run audit:mur` checks all eight, compares live open detail URLs with `data/store/source-records.json`, and writes `data/store/mur-coverage-report.json`.

Current result:

- Live open records: 690.
- Frontend positions generated from current open records: 690.
- Missing live records: 0.
- Assegni di ricerca live open records: 0.

Historical source records are retained in `data/store/source-records.json`, so the source-record total can be higher than the current open-position total.
