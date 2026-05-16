# Sprint 4

## Goal

Stabilize the UX across HP, open positions, Grants listing and detail pages.

## Customer Value

- Users should immediately understand where to go.
- Users should distinguish open calls from monitored sources.
- Users should decide faster whether to open, save or ignore an opportunity.

## Scope

- Polish the `Posizioni aperte` and `Grants` list views after the Grants baseline.
- Improve detail pages for decision-making.
- Tighten mobile behavior, chip wrapping and bottom navigation.
- Normalize labels for source confidence, deadlines and official-source traceability.
- Improve empty states and filtered-state actions.

## P0 Activities

- [x] Improve Grants cards with deadline, eligibility, budget and official source.
- Improve position cards with quality labels: `Fonte ufficiale`, `Da verificare`, `Possibile duplicato`.
- Refine position and grant detail pages into stable sections: overview, deadline, requirements/eligibility, how to apply, official source.
- [x] Keep mobile bottom navigation consistent and non-invasive.
- [x] Refine mobile layout and card density for Grants and positions lists.
- [x] Add PNRR source classifier report while keeping PNRR as monitored source.
- [x] Add scheduled MUR/Cineca refresh so production positions update automatically.
- [x] Replace verbose filter-level novelty badges with compact green dots.

## P1 Activities

- [x] Add empty states with suggested alternative chips.
- Add save/search-alert action with clearer loading, success and error states.
- Normalize badge and chip language across positions and grants.
- Add lightweight screenshot checks for mobile and desktop.
- [x] Document Horizon / Funding & Tenders importer strategy.

## P2 Activities

- Accessibility pass for focus states, labels and tap targets.
- Italian copy pass and bilingual-readiness notes.
- Add skeleton/loading states where API-backed actions can wait.

## Exit Criteria

- HP, positions and grants have distinct, predictable flows.
- Grants clearly separates candidate-ready calls from monitored sources.
- Detail pages answer: deadline, eligibility/requirements, official source and next action.
- Typecheck passes.
