# SEO and Online Positioning

## Current SEO Baseline

Research Radar Italy now has a technical SEO foundation suitable for the first public release.

Implemented:

- Global metadata with Italian locale, canonical URL, keywords, Open Graph and Twitter metadata.
- Dynamic metadata for the main intent pages: home, `Posizioni aperte`, and `Grants & Funding`.
- Dynamic metadata for position detail pages using title, institution, discipline, SSD, deadline and source.
- Dynamic metadata for grant detail pages using title, program, deadline and official source.
- `sitemap.xml` including home, intent pages, all generated position detail pages and all generated grant detail pages.
- `robots.txt` allowing public pages and excluding API/auth/login/signup routes.
- JSON-LD structured data:
  - `JobPosting` for position detail pages.
  - `Grant` for funding detail pages.

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

- Connect Google Search Console for `https://research-radar-italy.vercel.app`.
- Submit `https://research-radar-italy.vercel.app/sitemap.xml`.
- Inspect `/`, `/?intent=posizioni`, `/?intent=bandi`, one position detail page and one grant detail page.
- Add About, Contact, Privacy and Cookie pages before monetization or ad-network review.

P1:

- Create SEO landing pages for high-intent segments:
  - `/posizioni/dottorati`
  - `/posizioni/postdoc`
  - `/posizioni/contratti-di-ricerca`
  - `/funding/prin`
  - `/funding/msca`
  - `/funding/erc`
- Add internal links from HP and listings to these landing pages.
- Add a custom Open Graph image.

P2:

- Add FAQ schema for common candidate questions.
- Add evergreen editorial pages around how to read MUR calls, PRIN, MSCA, ERC and academic career paths in Italy.
- Track Search Console queries and map them back to product filters and landing pages.
