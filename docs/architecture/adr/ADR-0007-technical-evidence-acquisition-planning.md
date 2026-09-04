---
id: ADR-0007
status: accepted
owner: project-architect
approved_by: product-owner
approved_date: 2026-09-04
---

# ADR-0007: Technical Evidence-Requirement Planning as a First-Class Pipeline Stage

## Status

Accepted — 2026-09-04. **Ratified — 2026-09-04 (CC-23A):** the Project Architect has explicitly reviewed and RATIFIED `packages/technical-evidence-engine/` as the correct, permanent home for technical/source-evidence planning, and confirms `packages/evidence-engine/` (learner-attempt/mastery evidence) must remain semantically separate from it. Neither package is to be merged or renamed. This ratification does not reopen the boundary decision below; it closes it.

## Context

`@alp/qualification-pipeline` (ADR-adjacent design: `docs/architecture/qualification-knowledge-construction-pipeline.md`) produces an APPROVED learner-knowledge boundary — the answer to "what must the learner know/do?" — from qualification evidence. It stops there by design (§17/§19 of that document): it never sources, verifies, or normalizes the underlying technical/factual content.

A parallel body of work (CC-14 through CC-22C) built a Unit-202-specific "historical dossier" reconciliation and a frozen blind technical-evidence-acquisition benchmark, in order to validate that a real qualification's technical content COULD be legitimately sourced from public evidence alone, without proprietary provider material. That work repeatedly exposed the same class of defect in different guises: a broad topic silently sourced as though it were one exact fact; a compound concept (meaning + symbol + unit + distinction) silently treated as one opaque fact; a multi-part relationship silently requiring its own brand-new source when its constituent facts were already independently sourceable; a canonical physical law appearing under several qualification requirements and being treated as though it needed sourcing separately each time; and a historical benchmark row inheriting a compound record's overall gap status even when the specific atomic sub-claim it represented was actually supported.

Every one of these defects was fixed, each time, as a Unit-202-specific correction inside `scripts/backtests/unit202-reconciliation/`. That location is architecturally correct for a validation fixture, but wrong for the underlying capability: none of these defects are actually about Unit 202, City & Guilds, or electrical installation work. They are about the boundary between "what must be known" and "what must be sourced" — a boundary every qualification, in every subject, from every awarding organisation, needs crossed the same way.

## Decision

**Evidence-requirement planning becomes a first-class, generic pipeline stage**, implemented in a new package, `@alp/technical-evidence-engine`, and documented as pipeline stages 7–12 in `docs/architecture/qualification-knowledge-construction-pipeline.md` §25.

**Package boundary — a new package, not an extension of `@alp/evidence-engine`.** `packages/evidence-engine/` already exists and is the canonical home for an entirely different responsibility: CC-07/WP1.3's LEARNER mastery/attempt-evidence derivation (`LearnerAttemptRecord` → `StepOutcome` → `DerivedLearnerState`, `docs/research/phase-1/PHASE-1-WP1.3-...`). "Evidence" there means evidence of what a *learner* has demonstrated; "evidence" in this ADR means evidence that a *technical/factual proposition is true*. These are unrelated domains that happen to share an English word. Extending `@alp/evidence-engine` with `KnowledgeTarget`/`EvidenceRequirement`/source-authority types would corrupt an already-cohesive, independently-tested package and mislead any future reader into assuming a relationship that does not exist. `@alp/technical-evidence-engine` is created instead, mirroring `@alp/qualification-pipeline`'s own contract: zero dependency on any other workspace package, no qualification-specific literal anywhere in production source, proven by a dedicated architecture-integrity test suite.

**`KnowledgeTarget` ≠ `EvidenceRequirement`.** A `KnowledgeTarget` (learner-facing semantic knowledge/performance) may require zero, one, or many `EvidenceRequirement`s (sourceable evidential obligations); one `EvidenceRequirement` may in turn support many `KnowledgeTarget`s, including targets from different qualifications. This relationship is a first-class, generic production type — not a Unit-202 JSON report artefact.

**The planner is qualification-agnostic by construction, not by convention.** It consumes a `KnowledgeEvidencePlanningInput` (`qualificationContext`, `knowledgeTargets[]`, `sourceAuthorityPolicy`) and decomposes each target into `EvidenceRequirement`s using ONLY structural fields the input declares (`kind`, `classification`, `expectedCoverageDimensions`, `requiresMultipleIndependentClaims`, `constituentKnowledgeTargetIds`, `childKnowledgeTargetIds`) — never by inspecting the content of a target's free-text description. A qualification-specific ADAPTER (e.g. the Unit-202 preflight harness under `scripts/backtests/unit202-evidence-acquisition-preflight/`) is solely responsible for populating those structural hints from its own frozen data; the generic planner never contains a qualification-name-branching conditional.

**Canonical requirement identity is domain-oriented, not qualification-oriented.** `canonicalRequirementKey` is derived from normalized requirement text + requirement mode (+ coverage dimension, for compound sub-requirements) — never from a qualification id or target id. Two structurally-identical requirements originating from two different qualifications collapse into one `EvidenceRequirement` with both targets recorded in `sourceKnowledgeTargetIds`, so a canonical technical truth (e.g. a physical law) is sourced and verified once and reused, never re-sourced per qualification.

**The planner never researches.** `EvidenceRequirementPlanner` (`planEvidenceRequirements`) and technical-evidence ACQUISITION are permanently separate: this package defines the future acquisition contract (`TechnicalEvidenceAcquisitionRequest`/`Result`) but contains no network, filesystem-read, or browsing code of any kind — mechanically proven by an architecture-integrity test that greps for I/O call signatures.

**Under-specification produces an explicit gap, never an invented decomposition.** Where the planner cannot safely tell whether a target is atomic or compound (a `CONCEPT_DEFINITION` with no `expectedCoverageDimensions`), or whether an integration target can reuse existing constituents (a multi-claim `RELATIONSHIP` with no declared `constituentKnowledgeTargetIds`), it returns `decompositionStatus: SEMANTIC_DECOMPOSITION_REQUIRED` and stops — the gap is returned to the Project Architect, never guessed shut.

**A generic, config-driven local-input isolation utility** (`LocalAccessGuard`) replaces the prose-only Unit-202 allowlist. A blind-acquisition experiment supplies a `LocalAccessGuardConfig` (exact paths/globs, optional required content hashes); every local read not matched by an allowlisted rule throws immediately and unrecoverably. There is no separate denylist mechanism inside the guard itself — a qualification's own denylist (if it keeps one) is defence-in-depth documentation only, never itself consulted for the access decision.

## Consequences

- `@alp/technical-evidence-engine` is a new, independently-versioned workspace package with its own typecheck/lint/test scripts, following the same architectural-independence contract as `@alp/qualification-pipeline`.
- `@alp/evidence-engine` is untouched by this decision and remains scoped to learner mastery/attempt-evidence derivation only; no code from this ADR is added to it.
- The Unit-202 historical-dossier reconciliation work (`scripts/backtests/unit202-reconciliation/`) remains exactly where it is — qualification-specific, sealed, benchmark-only — and is now explicitly understood as ONE regression fixture proving the generic architecture, not the architecture itself.
- A new qualification-specific adapter is required before any future qualification can use this pipeline stage; the adapter is where all qualification-specific judgement calls belong (e.g. "this compound target needs DEFINITION + QUANTITY_SYMBOL + UNIT_SYMBOL + DISTINCTION coverage"), never inside `@alp/technical-evidence-engine` itself.
- The future technical-evidence acquisition engine (source discovery, retrieval, factual verification, claim normalization) is a SEPARATE, not-yet-implemented package/stage; this ADR only fixes its input/output contract shape, and does not authorise building it.
- The Unit-202 blind acquisition target manifest (`reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-BLIND-ACQUISITION-TARGETS.json`, hash `3052aede77b472247fbdf7a9e04d62adb2e98bba3a2896dacd610267e4a754b4`) remains frozen and untouched by this ADR.
- **CC-23A hardening (2026-09-04):** `canonicalRequirementKey` was corrected to derive from `KnowledgeTarget.semanticIdentity` rather than normalized display text (closing a homonym-collision risk text-based reuse could not safely rule out), and `SourceAuthorityClass` was opened from a closed enum to an extensible string type with domain-neutral standard defaults. Both corrections are documented in `docs/architecture/qualification-knowledge-construction-pipeline.md` §25.5; neither changes the package-boundary decision this ADR records.
- **CC-23B hardening (2026-09-04):** every `EvidenceRequirement` now carries a mandatory `specificationMode` (`KNOWN_CLAIM_TO_VERIFY` / `OPEN_TECHNICAL_QUESTION`) so evidence planning never requires the technical answer it is meant to establish; `TechnicalSemanticIdentity` gains a mandatory `governanceState` (`CANONICAL` / `PROVISIONAL_NON_REUSABLE` / `UNRESOLVED`) so cross-qualification reuse is never assumed unsafely; `SourceAuthorityPolicy` gains custom-authority-class registration so CC-23A's extensibility cannot silently trust an undeclared/misspelled class; and a new downstream module, `@alp/technical-evidence-engine/semantic-handoff.ts`, closes the second missing generic handoff (a future qualification no longer needs a hand-written adapter merely to enter evidence planning) — owned entirely by this package, preserving the dependency direction this ADR locks. Documented in `docs/architecture/qualification-knowledge-construction-pipeline.md` §25.12-§25.14; none of this changes the package-boundary decision this ADR records.

## Compatibility

ADR-0007 does not revise `docs/architecture/qualification-knowledge-construction-pipeline.md`'s existing stages (§1-§24) — it appends new stages after `COURSE-CONSTRUCTION HANDOFF` and before the Project-Architect curriculum-decision stop, per that document's own §25.

ADR-0007 does not revise or supersede any existing ADR. It does not authorise live technical-evidence acquisition (web research, source retrieval) — that remains a future, separately-authorised package and ADR.
