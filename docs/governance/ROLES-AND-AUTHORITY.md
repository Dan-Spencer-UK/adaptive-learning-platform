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

## Instructional visual authority split (ADR-0005, CC-13A)

Following the learning-package architecture reset (2026-08-29), visual production authority is explicitly split across four roles — no single role holds end-to-end authority over a shipped instructional visual:

- **Claude / Implementation Engineer** — candidate extraction and orchestration only: identifies visual needs from the governed corpus, discovers/caches *candidate* reference material, orchestrates production tooling, performs automated technical/pedagogical audits. Claude does **not** independently select or approve a final technical reference and does not invent technical relationships.
- **ChatGPT / Project Architect** — catalogue/reference review and technical-reference selection/annotation: independently researches, verifies and approves references, writes the Reference Dossier, and independently reviews generated output. See [`docs/governance/VISUAL-REFERENCE-REVIEW-PROTOCOL.md`](VISUAL-REFERENCE-REVIEW-PROTOCOL.md).
- **Product Owner** — final visual/design approval. No premium/hybrid artwork ships without Product Owner sign-off.
- **Gemini** — renderer only. Never technical authority; never a reference-selection authority. See [`ADR-0004`](../architecture/adr/ADR-0004-deterministic-authority-over-generated-instructional-imagery.md).

Full detail: [`ADR-0005`](../architecture/adr/ADR-0005-learning-package-production-and-visual-governance.md) and [`docs/architecture/INSTRUCTIONAL-VISUAL-PLANNING-REFERENCE-AND-PRODUCTION-ARCHITECTURE.md`](../architecture/INSTRUCTIONAL-VISUAL-PLANNING-REFERENCE-AND-PRODUCTION-ARCHITECTURE.md) §2.

## V1 learner-model changes are Product Owner / Project Architect decisions (ADR-0006, CC-13A)

Whether a lesson uses one canonical route or richer per-learner adaptive branching/skipping/reordering is a product-architecture decision recorded in [`ADR-0006`](../architecture/adr/ADR-0006-v1-canonical-lessons-and-assessment-driven-guided-revision.md), not a matter of Implementation Engineer discretion. Claude Code must not silently reintroduce mastery-driven ordinary-lesson routing, or silently narrow it further, without an equivalent Product Owner/Project Architect decision — see the Architecture conflict rule above.

## Implementation correctness vs. product/learning quality authority (CC-13C.3 governance)

Every material ALP architecture/content-production package is judged against two separate questions, owned by different roles:

1. **Implementation correctness** — does the implementation correctly satisfy the agreed architecture/contracts? Evidence: tests, validators, schema conformance, runtime proof. Claude Code may establish this directly.
2. **Product/learning quality** — is the architecture, content model, instructional design and learner experience itself good enough for a best-in-class learning product? Passing (1) never implies passing (2); a technically correct implementation of a weak design must be revised or rejected, regardless of how green the automated evidence is. Tests and validators provide evidence only for what they actually assert — they are never a substitute for independent product, pedagogical or learner-experience review.

Question (2) is decided by the Project Architect (independent review; may accept Claude's technical findings while rejecting Claude's proposed design; evaluates pedagogy, instructional quality, lesson/storyboard/assessment/visual design; detects false greens and architectural shortcuts; determines whether a package is actually good enough to proceed) and the Product Owner (final approval).

Claude Code is explicitly **not** final authority for: product architecture, instructional design, pedagogy, lesson quality, storyboard quality, assessment design, visual pedagogy, learner experience, production-workflow quality, or (per the existing instructional-visual authority split above) technical reference correctness for governed visuals. Claude may investigate, trace, propose and implement only when explicitly authorised, and must not automatically turn its own recommendations, architecture-audit findings or proposed package contracts into implementation or treat them as pre-approved merely because Claude produced them.

Gemini (and any future generative renderer) remains a rendering tool only — never technical or pedagogical authority, consistent with the instructional-visual authority split above.

Full detail — the false-green state model, storyboard/visual/assessment quality standards, authoring-economics principle, and the representative real-lesson qualification gate that must pass (both technically and pedagogically) before systematic Unit 202 rebuilding: [`docs/governance/LEARNING-PACKAGE-QUALITY-GATES.md`](LEARNING-PACKAGE-QUALITY-GATES.md) §1, §14-§17.

## Current role mapping

```text
Product Owner → founder
Project Architect → ChatGPT
Implementation Engineer → Claude Code
```
