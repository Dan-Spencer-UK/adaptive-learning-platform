---
id: GOV-004
status: approved
owner: project-architect
last_reviewed: 2026-08-14
---

# Decision Standard

## Purpose

Record durable decisions without turning routine development judgement into excessive governance.

## Architecture Decision Record — ADR

Use an ADR when a decision materially affects system structure, a major technology/platform choice, a security boundary, durable data-model principle, major dependency/interface or another choice expensive/risky to reverse.

Lifecycle: `Proposed → Accepted → optionally Superseded`.

Minimum ADR content: status, date, context, decision, alternatives, consequences/trade-offs, security/privacy implications where relevant, cost/operational implications where relevant, review triggers, related documents and supersession links where applicable.

## Decision Log

Use `docs/governance/DECISION-LOG.md` for smaller durable Product Owner decisions that do not justify a full ADR.

## Authority

The Project Architect prepares/recommends architecture decisions. The Product Owner approves material architecture/product trade-offs. The Implementation Engineer does not silently create architectural precedent.

## Unresolved decisions

An unresolved material decision remains unresolved. Do not create a plausible implementation and later treat its existence as the decision.

## Supersession

Never delete an accepted ADR merely because direction changed. Mark it superseded and link the replacement.

## Reversibility principle

The harder a decision is to reverse, the more evidence and explicit review it warrants. Low-cost local implementation details do not require ADRs.
