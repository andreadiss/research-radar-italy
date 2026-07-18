# Sprint Plan

## Planning Principle

Prioritize customer value in this order:

1. Find relevant opportunities quickly.
2. Understand requirements, constraints, and deadlines.
3. Stay updated over time.
4. Organize opportunities and applications.
5. Expand sources once the core experience is useful.

## Current Status - 2026-05-05

Sprint 4 has started. The core positions flow and the first Grants/funding baseline are in place.

- HP is clean and action-led.
- `Posizioni aperte` is the primary working view.
- `Tipo` and `Materia` filters are contextual to open positions.
- Filter chips show result counts and update based on the selected filter context.
- Results summary appears after filters and shows both total matches and near-deadline matches inline.
- Header account entry points exist, with modal-style Login and Sign Up pages.
- The mini bottom navigation appears after first scroll and lets users switch between `Posizioni aperte` and `Grants`.
- Grants has a first dedicated listing, detail pages and generated dataset.
- `npm run import:grants:live` imports PRIN 2026 calls from the official PRIN portal and enriches REA MSCA pages with curated fallback.
- `npm run audit:grants` writes Grants coverage/freshness metrics.
- Grants/funding now has a daily GitHub Actions refresh and `firstSeenAt` tracking for new-call badges.
- MUR/Cineca positions now have a daily GitHub Actions refresh that persists to Supabase, updates `lib/generated/mur-positions.json`, and triggers the static GitHub Pages deploy when data changes.
- Latest local MUR refresh on 2026-05-16 covers 809 live open records with 0 missing live records. The `Tipo` filter now exposes all MUR position families, including `Assegno` when the official endpoint returns current calls.
- Supabase dedupe keys are now indexed but not unique, because official MUR records with matching dedupe keys must remain visible for review.
- Logged-in users can save positions and grants with a single bookmark action and revisit them from `Le mie liste`.

Current sprint focus: stabilize UX across HP, positions, Grants and detail pages.

Release note: the AI natural-language search bar is intentionally hidden from the public release until the feature is designed and implemented in a later sprint.

## Sprint 2 - Find and Decide

Goal: help an early-career researcher reach a useful shortlist in less than two minutes.

Customer value:

- Reduces time spent searching across scattered sources.
- Makes it easier to decide whether a call is worth opening.

Scope:

- Improve top-chip navigation for intent and common position types.
- Add ranking rules: open calls first, urgent deadlines surfaced clearly, relevant matches before generic results.
- Improve result cards with decision-critical fields: deadline, institution, type, discipline, location, source, review warning.
- Keep official MUR records visible even when they are possible duplicates.
- Add visible quality indicators for `needs_review` and `possible_duplicate`.
- Preserve the MUR coverage baseline: 690 live open records, 0 missing.

Activities and priorities:

### P0

- Define primary top chips for high-intent paths: `PhD`, `RTT`, `Professori`, `Contratti`, `Postdoc`, `Funding`.
- Add clustered subject chips inspired by academic job boards: AI/data/computation, bio/medicine/environment, engineering/physics/materials, society/culture/law.
- Add ranking rules for results: non-expired first, closer deadlines surfaced, exact filter matches before broad matches.
- Redesign result cards around decision fields: title, institution, deadline, type, discipline, location, source.
- Show visible quality indicators on cards: `Fonte ufficiale`, `Da verificare`, `Possibile duplicato`.
- Ensure all 690 current MUR open records remain visible in the frontend.

### P1

- Add quick chips for urgency: `Scade entro 7 giorni`, `Scade entro 14 giorni`, `Nuovi`.
- Add region shortcuts for high-volume regions.
- Add a compact result-count summary by intent and active filters.
- Add sort options: relevance, deadline, newest.

### P2

- Add keyboard-friendly filter navigation.
- Add lightweight analytics events for chip usage and result clicks.
- Add test fixtures for ranking behavior.

Exit criteria:

- User can enter `Posizioni aperte` from HP and filter by type and discipline.
- `Tipo` and `Materia` chips show filter-aware result counts.
- Results are scannable on mobile and desktop, with result and deadline summary after filters.
- No official MUR record is hidden by dedupe.
- Typecheck passes.

Status: mostly completed for the open-positions flow. Remaining card ranking and quality-warning work can continue after Grants baseline if needed.

## Sprint 3 - Grants and Funding

Goal: add a dedicated Grants/funding experience without mixing grants with open positions.

Customer value:

- Helps candidates find funding opportunities alongside positions.
- Keeps the mental model clear: jobs are jobs, funding calls are funding calls.

Scope:

- Discover official PRIN/PNRR source pages and data access patterns.
- Decide whether funding calls need a separate data model from `positions`.
- Add first Grants listing view.
- Add Grants-specific filters: program, discipline, year, eligibility, deadline.
- Add Grants detail page structure.
- Preserve the HP and bottom intent navigation between `Posizioni aperte` and `Grants`.

Activities and priorities:

### P0

- Map official PRIN/PNRR source pages and determine import feasibility. Status: first discovery documented in `docs/grants-data-discovery.md`.
- Define Grants fields: title, program, funder, eligibility, deadline, budget/funding amount when available, official URL, source. Status: `GrantOpportunity` type added.
- Decide schema approach: separate `grants` table or generalized `opportunities` model.
- Build Grants placeholder into a real listing route/state under `?intent=bandi`. Status: completed.
- Add program/discipline chips for Grants. Status: completed.
- Add Grants detail page shell with official-source CTA. Status: completed.

### P1

- Prototype first live Grants importer. Status: `npm run import:grants:live` imports PRIN 2026 calls from the official PRIN portal and enriches REA MSCA pages with curated fallback.
- Add source badges for PRIN, PNRR, ERC, MSCA, Horizon.
- Add funding-call deadline status and near-deadline counts.
- Add audit report for Grants source coverage. Status: `npm run audit:grants` writes `data/store/grants-audit-report.json`.
- Add daily Grants/funding refresh action. Status: completed with `.github/workflows/sync-grants.yml`.
- Add new-call detection for Grants. Status: completed with `firstSeenAt` in `lib/generated/grants.json`.

### P2

- Explore ERC/MSCA/Horizon source patterns.
- Explore links between Grants, projects, institutions, and related positions.
- Add saved Grants to the future account model.
- Create backlog for larger Grants database expansion after the first Grants UX baseline.

Exit criteria:

- `Grants` is a distinct navigable experience.
- At least one official funding source has a documented import path or prototype.
- Grants filters are not reused blindly from position filters.
- Typecheck passes.

## Sprint 4 - UX Stabilization

Goal: polish the positions and grants UX after the first Grants baseline exists.

Customer value:

- Reduces cognitive load.
- Makes navigation predictable for repeated use.

Scope:

- Refine the first viewport around action, not explanation.
- Keep `Posizioni aperte` and `Grants` clearly separated.
- Tighten mobile layout, chip wrapping, empty states, and result density.
- Improve detail page layout with fixed sections: deadline, requirements, constraints, how to apply, official link.
- Add consistent labels for source confidence and official-source traceability.
- Add loading/error states for saved searches and alerts.

Activities and priorities:

### P0

- Refine HP, `Posizioni aperte`, and `Grants` after Grants is live.
- Keep bottom intent navigation consistent across positions and grants.
- Keep `Tipo` and `Materia` chips inside `Posizioni aperte`.
- Keep Grants filters funding-specific, not copied from positions.
- Fix mobile layout for top chips, filter form, result cards, and action buttons.
- Redesign position and grant detail pages with stable sections: overview, deadline, requirements, constraints, how to apply, official source.
- Remove or compress UI elements that delay the first useful result.
- Hide the AI search bar from the release UI and move it to the next product sprint.

### P1

- Improve empty states with suggested alternative chips.
- Add sticky mobile bottom action for filtered searches: save/search alert.
- Normalize visual language for badges, chips, deadlines, and quality warnings.
- Add skeleton/loading and API error states for saved search and alert creation.

### P2

- Add accessibility pass for labels, focus states, and tap targets.
- Add responsive screenshot checks for mobile and desktop.
- Add copy pass for Italian labels and bilingual readiness.

Exit criteria:

- Mobile viewport shows useful actions without excessive scrolling.
- Detail page answers "Should I apply?" quickly.
- Save/search alert UI is understandable without instructions.

## Sprint 5 - Account, Alerts and Tracking

Goal: turn Research Radar from a search page into a personal radar tied to a user account.

Customer value:

- Helps users avoid missing important opportunities.
- Supports planning over time.

Scope:

- Add account entry points: `Login` and `Sign Up`.
- Implement sign up with first name, last name, email, and password.
- Implement login with email and password.
- Persist saved searches in Supabase.
- Persist alert subscriptions in Supabase.
- Restore saved positions and grants after login.
- Add `Suggeriti per te` box on the home page for authenticated users, based on searches and saved items.
- Add frequency choice: weekly default, daily optional.
- Add a minimal saved-searches view.
- Add favorites or tracked opportunities.
- Add personal statuses: `Interessante`, `Da leggere`, `Candidatura in corso`, `Scartato`.

Activities and priorities:

### P0

- [x] Add Supabase Auth or equivalent auth flow for email/password accounts.
- [x] Add Google login/signup through Supabase Auth. Production setup still requires enabling the Google provider and adding `/auth/callback` to allowed redirect URLs in Supabase.
- [x] Store user profile fields: first name, last name, email.
- [x] Add login and signup forms with validation and error states.
- [x] Create session-aware header states: logged out, logged in.
- Persist saved positions/grants by user id.
- Show `Suggeriti per te` on HP only after login/signup.

### P1

- [x] Configure Supabase persistence foundation for profiles and alert subscriptions.
- [x] Save current filters with a clear generated name.
- [x] Create account-aware alert from filtered results with weekly default.
- Add local validation and clear success/error feedback.
- [x] Add unsubscribe-ready data model fields, even if email sending is not live yet.
- [x] Add email notification queue and delivery log schema for automated emails.
- Add saved-searches page or panel.
- [x] Add opportunity favorites.
- Add personal opportunity status: `Interessante`, `Da leggere`, `Candidatura in corso`, `Scartato`.
- Add deadline reminders as data model fields.

### P2

- Add calendar export for deadlines.
- Implement the AI-powered natural-language search bar once search intent parsing and result ranking are defined.
- Add daily frequency option.
- Add simple digest preview for alert results.

Exit criteria:

- User can create an account with first name, last name, email, and password.
- User can log in with email and password.
- User can save a filtered search.
- User can create an alert from a filtered result set.
- User can mark at least one opportunity for later.
- HP shows personalized suggestions for authenticated users.

## Sprint 6 - Data Quality and Review

Goal: improve trust in a complete MUR dataset.

Customer value:

- Makes the product safer to rely on for real decisions.

Scope:

- Review the 351 current `needs_review` records.
- Tighten rules for the 190 possible duplicate candidates.
- Improve discipline and region classification for uncertain records.
- Add a lightweight admin/review queue.
- Add report metrics: coverage, missing live records, needs-review count, possible duplicates.

Activities and priorities:

### P0

- Build a review queue for `needs_review` records.
- Group possible duplicates by `possibleDuplicateOf` and shared dedupe key.
- Add review actions: confirm duplicate, dismiss duplicate, mark reviewed.
- Improve classification rules for records with unknown or generic discipline.
- Keep audit guardrail: `npm run audit:mur` must stay at 0 missing live records.

### P1

- Add review summary metrics to local report: needs-review by reason, possible duplicates by category.
- Improve institution normalization.
- Improve professor rank detection for ordinario/associato/straordinario.
- Add parser fixtures for one detail page per MUR category.

### P2

- Add admin-only filters for low confidence and missing fields.
- Add historical trend for needs-review count.
- Add export of review queue to CSV.

Exit criteria:

- MUR audit remains at 0 missing live records.
- Possible duplicates are explained, not suppressed.
- Needs-review count trends down with measurable reasons.

## Sprint 7 - Source Expansion

Goal: expand beyond the first Grants/funding baseline into additional official sources.

Customer value:

- Expands coverage while preserving the distinction between positions, grants, and other source families.

Scope:

- Add Gazzetta Ufficiale 4a Serie, inPA, Euraxess, university, and research-institute source discovery.
- Decide priority order by customer value and data reliability.
- Add source-specific importers after each source has a documented coverage strategy.
- Extend source registry and audit reporting.
- Explore links between funding calls, projects, institutions, and positions.

Activities and priorities:

### P0

- Prioritize next source family after Grants: Gazzetta Ufficiale, inPA, Euraxess, or university feeds.
- Add source registry fields for crawl strategy, update frequency, reliability, and coverage audit.
- Implement one importer prototype for the highest-priority source family.
- Add coverage audit for the new source.

### P1

- Add source-family filters where useful.
- Detect links between calls, positions, institutions, and projects when available.
- Add source badges for each additional source.

### P2

- Add source registry for universities and institutes.
- Add RSS/API output for normalized funding calls.

Exit criteria:

- At least one additional non-MUR source imported.
- UI keeps source families distinct.
- New source has coverage/audit reporting.

## Sprint 8 - Analytics and Monetization

Goal: understand activation before introducing paid flows.

Customer value:

- Keeps the product focused on the actions that help users find and save relevant opportunities.
- Creates the evidence needed to price alerts, premium features, and institutional services without guessing.

Scope:

- Add privacy-friendly pageview and performance analytics.
- Track the core product funnel: HP intent click, filter use, preview open, detail open, official source open, save/unsave, login/signup CTA.
- Define the first monetization path around premium alerts and saved workflow depth.
- Prepare a later Stripe integration without blocking the free MVP.

Activities and priorities:

### P0

- [x] Add client-side product analytics hooks.
- [x] Add performance/SEO monitoring baseline.
- [x] Track home intent entry points for `Posizioni aperte` and `Grants & Funding`.
- [x] Track position and grant filter usage.
- [x] Track opportunity preview, detail page and official source opens.
- [x] Track bookmark save/unsave and auth-required save attempts.
- [x] Track login and signup CTA clicks.

### P1

- Add a lightweight KPI view for: visits, activated sessions, saved opportunities, signup conversion.
- Add server-side events for saved-opportunity API success/failure.
- Define free vs premium limits: saved opportunities, alert frequency, digest personalization.
- Add paid-plan copy and pricing experiment notes.

### P2

- Add Stripe checkout and subscription status fields.
- Add institutional analytics package: source demand by discipline, region and position type.
- Add sponsored listing rules and disclosure copy.

Exit criteria:

- The public product can report pageviews, Core Web Vitals and core funnel events through a privacy-friendly analytics provider.
- The main funnel actions emit named analytics events.
- The monetization path is documented before payment UI is added.

## Sprint 9 - SEO and Online Positioning

Goal: make the public release discoverable through Google and social sharing while keeping the product focused on official academic opportunities.

Customer value:

- Helps candidates discover Research Radar from high-intent searches.
- Builds trust by making sources, deadlines and opportunity details visible to search engines.
- Creates a foundation for future content, newsletter growth and monetization.

Scope:

- Add technical SEO primitives: metadata, canonical URLs, sitemap, robots and structured data.
- Define positioning and priority organic queries.
- Prepare Search Console setup and sitemap submission.
- Plan landing pages for high-intent segments.

Activities and priorities:

### P0

- [x] Add global metadata for the public site.
- [x] Add dynamic metadata for HP, `Posizioni aperte`, `Grants & Funding`, position details and grant details.
- [x] Add `sitemap.xml` and `robots.txt` routes.
- [x] Add `JobPosting` structured data for position details.
- [x] Add `Grant` structured data for funding details.
- [ ] Connect Google Search Console and submit sitemap.

### P1

- [ ] Add high-intent landing pages for dottorati, postdoc, contratti di ricerca, PRIN, MSCA and ERC.
- [ ] Add internal links from HP and listing views to the landing pages.
- [ ] Add custom Open Graph image.
- [x] Add auth-aware homepage next-best-action card pattern.
- [x] Add About, Privacy, Cookie and Terms pages.
- [ ] Add Contact page.

### P2

- [ ] Add FAQ schema and evergreen explainers for MUR/Cineca, PRIN, MSCA and ERC.
- [ ] Review Search Console queries after the first indexing cycle.
- [ ] Use query data to refine filters, titles and landing pages.

Decision rule:

- Whenever a new feature is added, decide explicitly whether it should become a homepage Next Best Action and for which user state: anonymous, logged-in, saved-items present, or no saved-items.

Exit criteria:
- Search engines can crawl the main public pages and all generated detail pages.
- The sitemap is submitted in Search Console.
- Search snippets clearly communicate source, deadline and opportunity type.



