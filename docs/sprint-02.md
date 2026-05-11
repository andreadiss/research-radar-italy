# Sprint 2

## Goal

Stabilize the intent-driven UX for finding open academic positions before expanding the Grants area.

## Completed

- HP simplified into three primary actions: `Posizioni aperte`, `Grants`, and AI-ready search.
- `/` now behaves as the clean HP.
- `/?intent=posizioni` now behaves as the open positions workspace.
- Header logo returns to HP.
- `Login` and `Sign Up` entry points were added to the header.
- Login and Sign Up now open as centered modal-style pages with close actions back to HP.
- `Tipo` and `Materia` chips were moved into the `Posizioni aperte` workspace.
- Subject chips now use user-facing disciplinary clusters derived from MUR disciplinary sectors.
- `Tipo` chips now show available result counts.
- `Materia` chip counts now respect the currently selected `Tipo` and other active filters.
- The old visible `Filtri attivi` chip row was removed.
- Results summary was moved below contextual filters.
- `Posizioni aperte` now shows result count and near-deadline count inline beside the heading.
- A mini bottom navigation between `Posizioni aperte` and `Grants` appears after the first scroll.
- The full Grants experience remains intentionally postponed to the next sprint.

## Current Product State

- HP is intentionally minimal and action-led.
- The open positions flow is the primary working experience.
- MUR/Cineca open positions remain the only fully integrated source family.
- The frontend has 690 open MUR positions available from the generated local cache.
- Grants is visible as an intent and navigation destination.
- A first curated Grants dataset is available in `lib/generated/grants.json`.
- `npm run import:grants` regenerates the local Grants dataset.
- Grants currently uses official source links for MSCA, ERC, PRIN, PNRR and Horizon source monitoring.
- Grants detail pages and live source-specific importers are still planned.
- Account pages are modal-style UI placeholders; authentication and saved-account state are still planned.

## Next

The next sprint will focus on Grants/funding:

- Extend the Grants data model separately from open positions where needed.
- Discover official PRIN/PNRR source pages and data access patterns beyond the initial source links.
- Decide next live importers: PRIN/PNRR first, then ERC/MSCA/Horizon where feasible.
- Add Grants-specific filters beyond the first version: year, eligibility, deadline.
- Build a Grants listing and detail experience distinct from `Posizioni aperte`.
- Keep the bottom intent navigation between positions and Grants.

## Verification

- `npm run typecheck` passed after the latest UI changes.
- Local app responds on `http://127.0.0.1:3000/`.
- Browser checks confirmed logo navigation, filtered counts, and the bottom mini navigation behavior.
