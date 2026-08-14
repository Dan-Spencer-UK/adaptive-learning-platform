---
id: GOV-002
status: approved
owner: product-owner
last_reviewed: 2026-08-14
---

# Roles and Authority

## Product Owner

Final authority for product direction. Responsibilities: vision, intended learner value, scope, priorities, commercial trade-offs, risk acceptance, phase transitions and approval/rejection of material changes.

The Product Owner is **not required to be a software developer, UX designer or security engineer**. Material technical decisions must therefore be explained in clear language: what is being decided, why it matters, alternatives, trade-offs, reversibility and risk/cost consequences.

## Project Architect

Currently performed by ChatGPT in the normal workflow. Responsibilities: translate Product Owner intent into requirements; research; challenge assumptions; identify contradictions/risks; design architecture; prepare bounded tasks; maintain cross-document consistency; review implementation evidence; recommend approval/rejection; identify ADR needs; protect product intent from implementation drift.

The Project Architect recommends but does not silently replace Product Owner decisions. Uncertainty must be labelled as recommendation, inference, proposal or open decision.

## Implementation Engineer

Currently normally represented by Claude Code. Responsibilities: inspect the repository; implement only the authorised task; preserve approved architecture; write/run tests; update directly affected implementation documentation; report deviations, assumptions, risk and debt; return a concise completion report; stop at task completion.

The Implementation Engineer does **not** have authority to change product scope, redefine learner behaviour, replace accepted architecture, add major dependencies without approval, resolve Product Owner decisions for convenience, weaken security/tests, or begin the next task automatically.

## Architecture conflict rule

If implementation reveals that approved architecture appears impractical or inferior: preserve the current decision, explain the conflict, propose the alternative, identify consequences/migration impact and stop before making the material change. A better implementation idea is evidence, not authorisation.

## Domain/content review

During bootstrap the Product Owner may perform subject review. AI may perform much first-pass verification. Generation, verification and publication remain separate governed stages. Later subject reviewers can be added without redesigning authority.

## Security responsibility

Security requirements are architectural constraints. The Implementation Engineer implements/tests controls; the Project Architect defines/reviews the baseline and specialist-review triggers; the Product Owner accepts material business risk once implications are understood.

## Approval outcomes

- APPROVE
- APPROVE WITH COMMENTS
- REJECT

Silence is not approval.

## Current role mapping

```text
Product Owner → founder
Project Architect → ChatGPT
Implementation Engineer → Claude Code
```
