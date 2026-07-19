# SEO and Online Positioning

## Current SEO Baseline

Research Radar Italy now has a technical SEO foundation suitable for the first public release.

Implemented:

- Global metadata with Italian locale, canonical URL, keywords, Open Graph and Twitter metadata.
- Dynamic metadata for the main intent pages: home, `Posizioni aperte`, and `Grants & Funding`.
- Dynamic metadata for position detail pages using title, institution, discipline, SSD, deadline and source.
- Dynamic metadata for grant detail pages using title, program, deadline and official source.
- `sitemap.xml` including home, intent pages, all generated position detail pages and all generated grant detail pages.
- `robots.txt` allowing public pages and excluding private/non-public routes.
- JSON-LD structured data:
  - `JobPosting` for position detail pages.
  - `Grant` for funding detail pages.
- Stable crawlable favicon and web manifest for search results and browser surfaces.
- Custom Open Graph image for social sharing.
- Dedicated static landing pages for dottorati, postdoc, contratti di ricerca, RTT, PRIN, MSCA and ERC.
- Visible internal links from the home page and related links across SEO landing pages.
- `CollectionPage`, `ItemList`, `BreadcrumbList` and visible FAQ content on landing pages.
- Contact page for source reports and corrections.
- `llms.txt` with canonical sections, provenance and citation guidance for generative systems.
- Sitemap dates tied to actual content dates instead of the build timestamp.

## Positioning

Primary positioning:

> Research Radar Italy helps early-career researchers find academic jobs, research contracts, PhDs, postdocs and funding calls in Italy from official sources.

Priority organic search intents:

- `bandi ricerca Italia`
- `posizioni accademiche Italia`
- `dottorati Italia`
- `postdoc Italia`
- `contratti di ricerca Italia`
- `bandi MUR Cineca`
- `PRIN 2026 bando`
- `MSCA Postdoctoral Fellowships Italia`
- `ERC grant Italia`

## Next SEO Steps

P0:

- Google Search Console connected for `https://rritaly.com`.
- Sitemap submitted at `https://rritaly.com/sitemap.xml`.
- Inspect `/`, `/?intent=posizioni`, `/?intent=bandi`, one position detail page and one grant detail page.
- Request a new crawl of the home page after favicon deployment.
- Add About, Contact, Privacy and Cookie pages before monetization or ad-network review.

P1:

- Review landing-page impressions and queries in Search Console after 28 days.
- Expand landing pages only when Search Console shows a distinct intent with enough real content.
- Add the Google Indexing API for new and removed job-detail URLs.
- Validate representative detail pages in Google's Rich Results Test.

P2:

- Add FAQ schema for common candidate questions.
- Add evergreen editorial pages around how to read MUR calls, PRIN, MSCA, ERC and academic career paths in Italy.
- Track Search Console queries and map them back to product filters and landing pages.
