---
id: GOV-003
status: approved
owner: project-architect
last_reviewed: 2026-08-14
---

# Documentation Standard

## Objective

Preserve product intent, implementation continuity and decision traceability **without making documentation a second project**.

Governing rule: **single owner of every important fact**.

## Document classes

Root operational documents do not require front matter: `README.md`, `PROJECT-STATUS.md`, `CONTRIBUTING.md`, `CHANGELOG.md`.

Substantive durable documents under `docs/` use:

```yaml
---
id: <stable-id>
status: proposed | approved | superseded | archived
owner: product-owner | project-architect
last_reviewed: YYYY-MM-DD
---
```

Git is the primary revision history. Do not maintain parallel semantic versions/history tables for every Markdown document unless the version itself has operational meaning.

## Stable identifiers

Suggested families: GOV, PROD, ARCH, SEC, TEST, ADR. Use identifiers where cross-reference value justifies them; do not create them for cosmetic uniformity.

## Current-state ownership

`PROJECT-STATUS.md` alone owns current phase/task/blocker/last checkpoint/exact next task. Other documents link to it rather than copying live state.

## Roadmap ownership

`docs/roadmap/ROADMAP.md` owns development sequence and exit criteria. It must not maintain branch/commit/blocker state.

## Architecture ownership

`docs/architecture/ARCHITECTURE-OVERVIEW.md` owns the concise current system model. Expensive-to-reverse decisions live in ADRs. Historical work packages explain why but are not primary implementation instructions.

## Duplication rule

Before adding a fact ask: **Does another document already own this fact?** If yes, link to it where practical. Contextual summaries are allowed but must not become parallel live-state records.

## Documentation-impact review

Every material task asks whether product truth, architecture, security requirements, development sequence, live state or durable decisions changed. Update only the owning documents.

Known stale documentation is a project defect. A task that materially directs a successor to obsolete work is incomplete.

## Historical material

Do not rewrite historical decisions as though the current view always existed. Update current owning documents, supersede ADRs when needed and use Git/CHANGELOG for historical trace.

## Automated checks

CI should progressively verify internal links, unique governed IDs, parseable front matter, valid ADR references and machine-checkable status/roadmap consistency. Automation should reduce governance effort, not add ceremony.

## Cold-handover test

A competent contributor with no chat history should orient to the project and next task in under 15 minutes. If normal work requires reading dozens of documents, simplify the documentation system.
