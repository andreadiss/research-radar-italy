# Backlog operativo RR Italy

Aggiornato: 5 settembre 2026. Questo quadro P0–P5 è la fonte operativa corrente; il backlog storico sotto rimane per tracciabilità e non certifica che ogni funzione marcata in passato sia nella release pubblica.

| ID | Priorità | Attività | Stato | Evidenza / criterio di completamento |
|---|---|---|---|---|
| OPS-001 | P0 | HTML iniziale per homepage e cataloghi | Pubblicato, build/smoke OK | H1 e link presenti senza eseguire JS; smoke test post-deploy |
| OPS-002 | P0 | Stabilità URL e archiviazione | Pubblicato, test OK | Cache conserva URL, import vuoto bloccato, riapertura e import parziale testati |
| OPS-003 | P0 | Escludere scadute dai risultati aperti | Pubblicato, build/smoke OK | 33 scadute fuori dal conteggio; 696 attive per data |
| OPS-004 | P0 | Eliminare fallback a bandi mock | Implementato | Dataset vuoto non pubblica opportunità dimostrative |
| OPS-005 | P1 | Indice HTML paginato e link diretti | Pubblicato, audit OK | 24 pagine; tutti gli URL sitemap raggiungibili |
| OPS-006 | P1 | Title, canonical, hreflang e sitemap | Pubblicato, audit OK | Zero title duplicati schede, URL finali, niente lastmod non comprovato |
| OPS-007 | P1 | Structured data fattuale | Prima correzione pubblicata | WebPage con fonte al posto di JobPosting incompleto; completare validazione Grant |
| OPS-008 | P1 | Misurare click fonte da scheda | Pubblicato; GA4 da verificare | Evento e campo esistenti riutilizzati; verificare ricezione e deduplica |
| OPS-009 | P1 | Baseline GSC + GA4 | Bloccato: accesso Google | 28g vs 28g, non-brand, landing, conversione e copertura |
| OPS-010 | P1 | Core Web Vitals reali/mobile | Da fare | CrUX/GSC o PSI; non confondere JS bundle con CWV |
| OPS-011 | P2 | Audit qualità automatico | Implementato | Script offline e gate nel deploy; warning distinti dagli errori |
| OPS-012 | P2 | Correggere funding da HTML generico | Protezione pubblicata; 12 ulteriori schede verificate | Classificatore limitato a titolo/descrizione; fallback Non specificato introdotto. FANDEMIA corretto; 17 MSCA non comprovati rimossi dopo verifica fonte, 188 MSCA attivi (uno confermato; 187 ancora da verificare) ancora da revisionare; coda riproducibile con npm run audit:funding, ordinata per scadenza e con verifiche precedenti. Report funding-review-2026-09-05.json; Varianti MSCA e ambiguità multi-programma gestite; restano verifica delle menzioni e vecchi fallback MUR. |
| OPS-013 | P2 | Revisione possibili duplicati | 1 falso positivo risolto; 76 candidati rimasti | Foro Italico 151114/151043 distinti per SSD verificati; prevenzione sui codici moderni disgiunti e test. Nessuna eliminazione dei bandi. |
| OPS-014 | P2 | Normalizzare enti, sedi e disciplina | Da fare | Mantenere valore originale e mapping verificato; 17 regioni ignote |
| OPS-015 | P2 | Link checker e variazioni deadline | Da fare | Fonti esistenti, robots/condizioni, rate limit, storico; 403/429 ≠ bando cancellato |
| OPS-016 | P2 | Mini sessione giornaliera 30 minuti | Automazione attiva | Una sessione/giorno, 210 minuti/settimana pianificati; residui al giorno successivo. Nessuna garanzia quota/token |
| OPS-017 | P2 | Freschezza reale e provenance per grant | Parziale | Badge MUR corretto; introdurre lastCheckedAt distinto da updatedAt per fonte |
| OPS-018 | P1 | Landing professori/incarichi/tecnologi | Da prioritizzare con dati | Intento utile, contenuto specifico e dataset affidabile; evitare duplicati |
| OPS-019 | P3 | Liste locali e ritorno su scadenze | Da fare | Miglioramento senza account/nuovi dati personali |
| OPS-020 | P3 | Accessibilità modal e ordine risultati | Da fare | Focus/esc/tastiera, query vuote, priorità scadenza con evidenze UX |
| OPS-021 | P4 | Primo A/B test CTA o filtri | Bloccato da OPS-009 | Ipotesi, baseline, MDE/potenza, regola stop, niente vincitori prematuri |
| OPS-022 | P5 | Rifiniture estetiche minori | Differito | Solo dopo P0/P1; design importante richiede approvazione |
| OPS-023 | P1 | Revisione consenso/pageview GA4 | Audit prima di decisione | Eventuale modifica cookie/consenso con approvazione; non toccare la privacy ora |
| OPS-024 | P2 | Recupero URL storici già rimossi | Da valutare | Ricostruire da Git e GSC; niente ripubblicazione di bandi scaduti come aperti |
| OPS-025 | P0 | Indagare 404 transitori e doppio flusso Pages | Risolto, deploy verificato | Job 101283225613 pubblica ./docs via Jekyll in parallelo al workflow Next.js. Pages Source=GitHub Actions confermato dall’utente; commit 0646675 ha prodotto solo il workflow statico, run 33958301072 riuscito e 7/7 controlli live. Controllo live esteso a cataloghi, indice, sitemap e schede. Nessun permesso amministrativo esposto dal connector. |

| OPS-026 | P2 | Preservare settori GSD/SSD multipli | Implementato e testato | Importer conserva valori distinti e alias. Fonte 151246 verificata: 12 GSD/12 SSD, cache corretta e needs_review. Restano revisione altri bandi e filtri multi-disciplina. |

Report: [audit del 5 settembre](operations/audit-2026-09-05.md). Budget: [policy e limitazioni](operations/work-budget-policy.json). Registro: [operazioni](operations/log.md).

## Backlog storico (stato precedente, da riconciliare)

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
- [x] Add daily GitHub Action to refresh MUR positions and trigger production redeploys
- [x] Move public release from Netlify/Vercel runtime hosting to GitHub Pages static export with custom domain
- [x] Keep all MUR position families visible in `Tipo` filters, including categories with zero current open calls
- [x] Add production deduplication by URL, title, institution, and deadline
- [x] Add deadline status: open, closing soon, expired
- [x] Add newsletter signup
- [x] Remove Login and Sign Up entry points from the static public release until a real backend is available
- [ ] Improve result ranking for fast shortlist creation
- [x] Improve result cards with decision-critical fields
- [x] Remove AI search bar from the release UI until the feature is implemented
- [ ] Add visible quality indicators for needs-review and possible duplicates
- [x] Remove home sidebar filters in favor of contextual top chips
- [x] Remove saved-search actions from Grants placeholder on the home flow
- [x] Separate clean HP from `Posizioni aperte` results view
- [x] Add logo navigation back to HP
- [x] Remove centered Login and Sign Up modal pages from the static release
- [x] Add bottom mini navigation between `Posizioni aperte` and `Grants` after first scroll
- [x] Add filter-aware counts to `Tipo` and `Materia` chips
- [x] Move results summary after contextual filters
- [x] Show open-position count and near-deadline count next to `Posizioni aperte`

## P1 - Better Than Existing Aggregators

- [x] Stabilize UX around intent-driven navigation
- [x] Redesign first viewport around action and top chips
- [x] Move type and subject chips into `Posizioni aperte`
- [x] Move full Grants experience to the next dedicated Grants sprint
- [ ] Add personalized suggestions after backend signup/login is live
- [x] Add homepage next-best-action cards without auth-dependent promises in the static release
- [x] Add governance note: every new feature must be evaluated for Next Best Action eligibility
- [ ] Implement production Sign Up with first name, last name, email, and password in a backend runtime
- [ ] Implement production Login with email and password in a backend runtime
- [ ] Add Google login/signup only after the production auth callback is supported
- [ ] Restore saved positions and grants after login with server-backed persistence
- [ ] Add `Suggeriti per te` box on HP for authenticated users
- [ ] Make saved searches and alerts account-aware after backend login
- [ ] Re-enable production Google login after choosing a dynamic auth runtime or Supabase-only static callback pattern
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
- [x] Add homepage next-best-action card to return to locally saved lists when favorites exist
- [ ] Personal opportunity statuses
- [x] Add account profile and email opt-in data model
- [x] Add email notification queue data model
- [ ] IT/EN UI and summaries
- [ ] Similar opportunities on detail pages
- [ ] Implement AI-powered natural-language search bar after release
- [x] Admin review queue for low-confidence records

## P2 - Source Expansion

- [x] Expand Grants database beyond the first curated dataset with GEA/MUR, additional ERC calls and COST
- [x] Add live GEA/MUR discovery for calls explicitly marked open with structured deadlines
- [x] Add ERC Proof of Concept 2026, Starting Grant 2027 and Consolidator Grant 2027
- [x] Add COST Open Call 2026
- [x] Recalculate grant open/upcoming/closed status at every import
- [x] Add source-domain coverage report for the Grants pipeline
- [x] Add live PNRR grant source classifier and importer
- [ ] Harden PNRR classifier with fixtures and false-positive review rules
- [ ] Add EU Funding & Tenders importer for ERC, MSCA and Horizon calls
- [ ] Add AIRC research grant importer
- [ ] Add Fondazione Telethon research grant importer
- [ ] Add Fondazione Cariplo science and research call importer
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
- [x] Add stable favicon and manifest for Google Search and browser surfaces
- [x] Add custom Open Graph image for social sharing
- [x] Add internal links and semantic structured data for high-intent collections
- [x] Add `llms.txt` with canonical pages and source-provenance guidance
- [x] Connect Google Search Console and submit sitemap
- [ ] Request recrawl of the home page after favicon deployment
- [ ] Validate representative JobPosting pages in Rich Results Test
- [ ] Add Google Indexing API notifications for new, updated and expired job pages
- [ ] Review Search Console query clusters after 28 days and iterate content
- [x] Add SEO landing pages by high-intent query: dottorati, postdoc, contratti di ricerca, RTT, PRIN, MSCA, ERC
- [x] Add About, Contact, Privacy, Cookie and Terms pages before ad-network applications
- [ ] Add content/positioning plan for organic acquisition
- [x] Add web analytics and performance monitoring baseline
- [x] Track core product funnel events: home intent, filters, previews, detail opens, source opens, saves, auth CTAs
- [ ] Add analytics event review dashboard for activation and conversion
- [ ] Add dynamic backend layer for account persistence, email automation, and premium flows while keeping the public site cacheable/static where possible
- [ ] Define freemium limits for saved opportunities, lists, and alert frequency
- [ ] Add Stripe subscription foundation for premium alerts
- [ ] Public RSS feeds
- [ ] Telegram alerts
- [ ] Employer pages
- [ ] Sponsored positions
- [ ] Analytics for institutions
- [ ] Premium alerts
- [ ] API access






- [x] P1: collegamenti correlati nelle schede, con filtri di pertinenza e scadenza (ciclo aggiuntivo, sessione 3/6).

- [x] P2: evitare revisioni ripetute di conferme funding ancora valide; 187 verifiche MSCA pendenti, 1 conferma conservata (sessione 4/6).
