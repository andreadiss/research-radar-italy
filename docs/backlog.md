# Backlog

## User Stories

- In quanto dottorando o ricercatore early-career, voglio poter individuare rapidamente opportunita accademiche rilevanti per il mio ambito, per ridurre il tempo speso a cercare informazioni disperse su piu fonti.
- In quanto candidato a posizioni o grant, voglio comprendere facilmente requisiti, vincoli e scadenze di ciascun bando, per decidere in modo consapevole se investire tempo nella candidatura.
- In quanto utente interessato a opportunita accademiche, voglio rimanere aggiornato nel tempo su nuove possibilita coerenti con i miei interessi, per non perdere occasioni importanti.
- In quanto ricercatore o studente, voglio organizzare e tenere traccia delle opportunita che mi interessano, per pianificare le mie candidature in modo efficace.

## P0 - MVP Core

- [x] Create project governance docs
- [x] Create initial Next.js scaffold
- [x] Build clickable job board with mock data
- [x] Build position detail page with normalized fields
- [ ] Install dependencies and run locally
- [ ] Initialize Git repository
- [ ] Create Notion tracker
- [x] Analyze MUR/Cineca endpoints and data model
- [x] Build first MUR/Cineca importer
- [x] Add database schema
- [x] Replace mock-only frontend dependency with generated MUR cache
- [x] Add local deduplication by MUR source id
- [x] Add local JSON store for source records, positions, sources, and import runs
- [x] Add single `sync:mur` command for import + normalize + cache
- [x] Add full MUR sync and live coverage audit
- [x] Add daily GitHub Action to refresh MUR positions and trigger Vercel redeploys
- [x] Keep all MUR position families visible in `Tipo` filters, including categories with zero current open calls
- [x] Add production deduplication by URL, title, institution, and deadline
- [x] Add deadline status: open, closing soon, expired
- [x] Add newsletter signup
- [x] Add Login and Sign Up entry points
- [ ] Improve result ranking for fast shortlist creation
- [x] Improve result cards with decision-critical fields
- [x] Remove AI search bar from the release UI until the feature is implemented
- [ ] Add visible quality indicators for needs-review and possible duplicates
- [x] Remove home sidebar filters in favor of contextual top chips
- [x] Remove saved-search actions from Grants placeholder on the home flow
- [x] Separate clean HP from `Posizioni aperte` results view
- [x] Add logo navigation back to HP
- [x] Add centered Login and Sign Up modal pages
- [x] Add bottom mini navigation between `Posizioni aperte` and `Grants` after first scroll
- [x] Add filter-aware counts to `Tipo` and `Materia` chips
- [x] Move results summary after contextual filters
- [x] Show open-position count and near-deadline count next to `Posizioni aperte`

## P1 - Better Than Existing Aggregators

- [x] Stabilize UX around intent-driven navigation
- [x] Redesign first viewport around action and top chips
- [x] Move type and subject chips into `Posizioni aperte`
- [x] Move full Grants experience to the next dedicated Grants sprint
- [ ] Add personalized suggestions after signup/login
- [x] Add homepage next-best-action cards with auth-aware visibility
- [x] Add governance note: every new feature must be evaluated for Next Best Action eligibility
- [x] Implement Sign Up with first name, last name, email, and password
- [x] Implement Login with email and password
- [x] Add Google login/signup entry point through Supabase Auth
- [ ] Restore saved positions and grants after login
- [ ] Add `Suggeriti per te` box on HP for authenticated users
- [x] Make saved searches and alerts account-aware after login
- [ ] Improve detail page for candidate decision-making
- [ ] AI summary for each call
- [ ] Discipline classification across all fields
- [ ] PRIN, PNRR, ERC, Horizon funding detection
- [x] Saved searches
- [x] Personalized email alerts
- [x] Intent-driven top-chip navigation
- [x] Build first dedicated Grants/funding experience
- [x] Add Grants entry view with funding-specific filters
- [x] Add first curated real Grants dataset with official source links
- [x] Add local `import:grants` command
- [x] Add Grants detail page model
- [x] Add live PRIN 2026 importer from official PRIN portal
- [x] Add Grants audit report
- [x] Add daily GitHub Action to refresh Grants/funding cache
- [x] Add `firstSeenAt` tracking so new Grants can be surfaced in the UI
- [x] Show filter-level new-call signals as small green dots instead of text badges
- [x] Split Grants listing into open calls and monitored sources
- [x] Add Grants status filter
- [x] Favorites
- [x] Add `Le mie liste` page for saved positions and grants
- [x] Remove visible alert icon actions from opportunity cards
- [x] Add homepage next-best-action card to return to saved lists after login
- [ ] Personal opportunity statuses
- [x] Add account profile and email opt-in data model
- [x] Add email notification queue data model
- [ ] IT/EN UI and summaries
- [ ] Similar opportunities on detail pages
- [ ] Implement AI-powered natural-language search bar after release
- [x] Admin review queue for low-confidence records

## P2 - Source Expansion

- [ ] Expand Grants database beyond the first curated dataset
- [x] Add live PNRR grant source classifier and importer
- [ ] Harden PNRR classifier with fixtures and false-positive review rules
- [ ] Add EU Funding & Tenders importer for ERC, MSCA and Horizon calls
- [ ] Add Horizon Funding & Tenders topic-list fixture and audit
- [x] Add grant coverage audit and source freshness report
- [ ] Gazzetta Ufficiale 4a Serie importer
- [ ] inPA importer
- [ ] Euraxess importer
- [ ] University source registry
- [ ] Research institute source registry
- [ ] Lab and project pages
- [ ] User-submitted calls

## P3 - Growth and Monetization

- [x] Add SEO metadata baseline for HP, positions listing, Grants listing and detail pages
- [x] Add sitemap and robots routes for Google indexing
- [x] Add structured data for position detail pages and grant detail pages
- [ ] Connect Google Search Console and submit sitemap
- [ ] Add SEO landing pages by high-intent query: dottorati, postdoc, contratti di ricerca, PRIN, MSCA, ERC
- [x] Add About, Privacy, Cookie and Terms pages before ad-network applications
- [ ] Add Contact page
- [ ] Add custom Open Graph image for social sharing
- [ ] Add content/positioning plan for organic acquisition
- [x] Add Vercel Web Analytics and Speed Insights baseline
- [x] Track core product funnel events: home intent, filters, previews, detail opens, source opens, saves, auth CTAs
- [ ] Add analytics event review dashboard for activation and conversion
- [ ] Define freemium limits for saved opportunities, lists, and alert frequency
- [ ] Add Stripe subscription foundation for premium alerts
- [ ] Public RSS feeds
- [ ] Telegram alerts
- [ ] Employer pages
- [ ] Sponsored positions
- [ ] Analytics for institutions
- [ ] Premium alerts
- [ ] API access





