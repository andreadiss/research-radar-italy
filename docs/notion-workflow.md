# Notion Workflow

## Goal

Use Notion as the agile control tower for Research Radar Italy while keeping the repository as the source of truth for code, architecture, and implementation notes.

## Databases

### Tasks

Properties:

- Task: title
- Status: Backlog, Ready, In Progress, Review, Done
- Priority: P0, P1, P2, P3
- Type: Product, UX, Engineering, Data, Ops
- Sprint: Sprint 0, Sprint 1, Sprint 2, Sprint 3
- Estimate: XS, S, M, L
- Owner: Andre, Codex
- Area: Web App, Data Pipeline, Notion, DevOps, Product
- Acceptance Criteria: text
- Repo Path: url or text
- Created Date: date
- Due Date: date

Views:

- Sprint Board: board grouped by Status, filtered to current sprint
- Backlog: table sorted by Priority then Status
- Data Pipeline: table filtered by Type = Data
- Done: table filtered by Status = Done

### Sprints

Properties:

- Sprint: title
- Status: Planned, Active, Completed
- Start: date
- End: date
- Goal: text
- Demo URL: url
- Notes: text

Views:

- Roadmap: timeline by Start/End
- Active Sprint: table filtered by Status = Active

## Operating Rhythm

1. At sprint start, Codex proposes sprint goal and pulls tasks from P0/P1.
2. During implementation, Codex updates task status and adds notes.
3. At review, user gives feedback in chat or Notion comments.
4. At sprint close, Codex updates Done tasks and writes a short sprint recap.

## Sync Rule

Notion tracks product execution. Git tracks code. If they disagree, current code wins for implementation state, while Notion wins for priorities.

