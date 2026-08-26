# Visual Reference Semantic QA — Product Decision

## Status
**APPROVED PRODUCT / CONTENT-GOVERNANCE DECISION**

This applies to all future modules, courses and qualifications.

## Decision
Reference-first generation is necessary but not sufficient.

Before any generative instructional visual enters production, the **actual reference image/frame that will be supplied to the image model must pass semantic reference QA against the exact governed learner-visible state**.

A source is NOT production-ready merely because it is authoritative, relevant, licensed, high resolution, or mechanically marked ready.

## Why
Unit 202 exposed recurring upstream failures:
- composite references caused irrelevant sibling diagrams/real-world examples to leak into outputs;
- direction-sensitive motor imagery was re-derived instead of preserving an exact approved state;
- a generator reference existed in metadata but was not visible in review while the output became visually ambiguous;
- resistivity reference notation conflicted with course notation;
- semiconductor-band references were the wrong composition authority for Level-2 diode-bias teaching;
- a stripped-wire photograph was technically relevant but pedagogically weak for conductor vs insulator;
- electrolysis micro-direction semantics were incorrectly accepted by automated audit.

These are reference-input/semantic-governance failures, not merely model failures.

## Hard production sequence
GOVERNED VISUAL STATE
→ REFERENCE RESEARCH
→ **SEMANTIC REFERENCE QA**
→ CROP / ISOLATE / PREPARE EXACT FRAME
→ EXTERNAL/HUMAN REFERENCE APPROVAL
→ GENERATION
→ TECHNICAL AUDIT
→ PEDAGOGICAL-CLARITY AUDIT
→ VISUAL-PRODUCT AUDIT
→ BOUNDED RETRY
→ PRODUCT OWNER REVIEW
→ APPROVED VERSION
→ USAGE BINDING / CONTENT RELEASE

## Required semantic-QA fields
- exact learner-visible purpose/state
- source/provenance/licence
- actual reference frame used
- facts established by reference
- elements to KEEP
- elements to CROP/REMOVE
- elements REQUIRED in final
- elements PROHIBITED in final
- relationships MODEL MUST NOT INFER/recalculate
- family-consistency requirements
- assessment-leakage constraints
- mobile-legibility considerations
- ambiguity/contamination risk
- disposition: APPROVED_DIRECT / APPROVED_PREPARED / REPLACE_REFERENCE / REJECT_REFERENCE

## Smallest-frame rule
The generator receives the smallest approved frame containing exactly the commissioned state. Extra lever classes, real-world examples, other generator phases, extra circuit states, instruments, unrelated panels or irrelevant labels must be removed before generation unless intentionally required.

## No model re-derivation
For meaningful direction, topology, polarity, handedness or state, the prepared reference itself must encode the correct relationship.

If contract and reference appear inconsistent:
**STOP AND ESCALATE. DO NOT SILENTLY CHOOSE OR RE-DERIVE.**

## Review-package rule
The review pack must show the **actual reference frame sent to the image model**. `reference preview not found` is a hard review failure for a reference-driven asset.

## Three independent approval gates
1. **Technical** — geometry/topology/direction/polarity/labels/state correct.
2. **Pedagogical** — intended idea is quickly understandable; no competing or irrelevant visual ideas.
3. **Visual/product** — premium, crisp, mobile-legible and family-consistent.

Technical PASS alone is insufficient.

## Family governance
Sibling images must use one consistent grammar and vary only the intended teaching variable. Examples: forward/reverse diode bias, motor teaching/assessment states, lever classes, and physical component recognition.

## Reuse
Semantic QA and prepared references belong to reusable canonical visual assets/states, not a single lesson. Future usages may reuse them when technical and pedagogical state is identical, subject to scope/assessment checks.

## Automation principle
Automation removes clerical work; it does not remove semantic judgement. Claude may acquire, crop, prepare, orchestrate and audit, but a distinct semantic approval boundary must exist before reference-dependent generation scales.
