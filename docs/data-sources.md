# Data Sources

## Phase 1

### MUR/Cineca

Source: https://bandi.mur.gov.it/

Target categories:

- Bandi per dottorati
- Bandi per tecnologi
- Bandi per assegni di ricerca
- Bandi per ricercatori a tempo determinato
- Chiamata dei professori
- Bandi per contratti di ricerca
- Bandi per incarichi di ricerca
- Bandi per incarichi post doc

Questions to answer during source discovery:

- Are there public JSON endpoints? Answer so far: no public JSON endpoint found; pages are server-rendered HTML.
- What query parameters exist? Answer so far: category-specific GET forms; use `azione=cerca` and status field value `2-3` for open calls.
- Is pagination stable? Answer so far: pagination is client-side over hidden HTML blocks, not backend/API pagination.
- Are detail pages HTML, PDF, or mixed? Answer so far: detail pages are HTML tables with `th`/`td` fields.
- Which fields are already structured? Answer so far: institution, dates, city/province, GSD/SSD, descriptions, contract/application fields appear as table labels.
- Which fields require parsing? Answer so far: funding tags, normalized discipline, title fallback, deadline time, salary/amount, requirements.

See [MUR data discovery](mur-data-discovery.md).

## Phase 2

- Gazzetta Ufficiale 4a Serie
- inPA
- Euraxess
- Major universities
- CNR, INFN, INAF, IIT, Human Technopole, FBK

## Funding Tags

Detect these from title, description, source metadata, and documents:

- MUR
- PRIN
- PNRR
- ERC
- MSCA
- Horizon
- Dipartimentale
