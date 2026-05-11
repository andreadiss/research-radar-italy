# Sprint 1

## Goal

Move from mock-only product to a MUR/Cineca-backed MVP data flow.

## Completed

- MUR/Cineca endpoint discovery.
- First HTML importer.
- Real sample export in `data/mur-sample.json`.
- Professor role taxonomy and UI improvements.
- Local normalized position cache pipeline.
- Initial SQL schema for production persistence.
- Frontend now reads generated MUR positions via `lib/positions.ts`.
- Local JSON store added under `data/store`.
- `sync:mur` command added for import, dedupe, store update, and frontend cache rebuild.
- Empty state added for filter combinations with no current MUR matches.
- Supabase/Postgres schema expanded for source records, positions, dedupe keys, review status, saved searches, alert subscriptions, and admin reviews.
- Local normalization now emits canonical source URLs, composite dedupe keys, deadline status, GSD, professor rank, broader discipline classification, and broader Italian region inference.
- Conservative local dedupe now checks source id, canonical URL, and specific title/institution/deadline keys; generic titles are not merged by composite key.
- Supabase REST persistence script added for local store upserts into `sources`, `source_records`, and `positions`.
- `sync:mur` can now run with `--persist=supabase` after Supabase environment variables are configured.
- Saved-search and alert API endpoints added, with local JSON fallback for development.
- Filtered-results UI now collects email and saves the current search intent or alert from the post-filter state.
- Review metadata is generated locally and possible duplicates are flagged without hiding official MUR records.
- MUR coverage audit added with `npm run audit:mur`.
- Full MUR sync added with `npm run sync:mur:all`.
- Full open-call sync completed on 2026-05-05: 690 live MUR records, 690 frontend positions, 0 missing live records.
- Intent-driven top navigation added for `Posizioni aperte` and `Bandi e funding`, with type and discipline as second-level chips.

## In Progress

- Prepare PRIN/PNRR and other bandi source discovery after MUR coverage baseline.

## Next

- Apply `db/schema.sql` as the first Supabase migration.
- Configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, then run `npm run persist:supabase`.
- Discover PRIN/PNRR source endpoints and decide whether they belong in `bandi` as funding calls or separate source families.
- Tighten duplicate review rules for the 190 possible duplicate candidates without suppressing records.
- Add admin/review UI for the 351 records currently marked `needs_review`.

## Verification

- `npm run sync:mur:all` imported 690 open MUR records across the 8 public categories.
- `npm run audit:mur` reports 690 live open records, 690 stored frontend positions, and 0 missing live records.
- `npm run typecheck` passed.
- `npm run persist:supabase` fails safely until Supabase environment variables are configured.
- `next build` is still blocked on this Windows environment by `spawn EPERM` while Next tries to start build workers.
