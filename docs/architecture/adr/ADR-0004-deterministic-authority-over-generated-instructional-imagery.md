---
id: ADR-0004
status: accepted
owner: project-architect
last_reviewed: 2026-08-23
---

# ADR-0004: Deterministic Authority Over Generated Instructional Imagery

## Status

Accepted — 2026-08-23. Recorded per a Project-Architect-issued task brief, the same authority pattern [`ADR-0001`](ADR-0001-mobile-client-technology.md)–[`ADR-0003`](ADR-0003-course-evidence-and-release-confidence.md) follow: the Implementation Engineer (Claude Code / Sonnet) mechanically records here an architecture direction already approved by the Product Owner / Project Architect.

## Context

CC-11.3 materially expanded the platform's deterministic instructional-visual layer (9 new diagram families, 16 total) and, during its real pixel-level review, directly confirmed a failure mode CC-05D had already anticipated in principle but not yet named as a governance rule: a visual can be structurally valid, mechanically governed, and still convey the wrong physics if the geometry it depicts was never checked against an authoritative construction (CC-05D §0's own right-hand-grip-rule finding; CC-11.3's own thumb-direction redraw). As the product moves toward premium, illustrated (not purely deterministic-vector) artwork — see [`PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md`](../PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md) for the full production methodology this ADR is extracted from — that risk grows materially worse: an image-generation tool has no access to the platform's governed contracts, no notion of "conventional current direction," and no way to be mechanically checked for geometric correctness the way a deterministic SVG renderer already is. A generated image of a hand demonstrating the right-hand grip rule can look entirely convincing while showing the wrong hand, the wrong curl direction, or a thumb that does not track current direction at all — and, unlike a rendering bug, nothing in CC-05D's existing mechanical-check layer (§E) can catch this, because there is no source geometry to parse; there is only a raster image.

This is exactly the class of decision `docs/governance/DECISION-STANDARD.md` reserves for an ADR: a durable content-authority boundary, expensive to reverse (a learner who memorises a wrong field direction from premium artwork is a real harm, not a cosmetic defect, and the resulting correction is a content republish, not a style tweak), and cross-cutting (it applies to every future qualification's visual pipeline, not only Unit 202).

## Decision

**Where generated imagery and governed deterministic geometry disagree, deterministic geometry always wins.** This is not a style preference weighed case-by-case; it is a hard authority rule with no exception process short of a superseding ADR.

Concretely:

1. Generated imagery (from any current or future image-generation tool, at any point in the production pipeline described in [`PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md`](../PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md) §3) **may** establish: finish, style, material impression, anatomy, depth, context and visual polish.
2. Generated imagery **must never** establish, on its own authority: circuit topology; schematic symbol geometry; mathematical geometry; directional electromagnetism; hand-rule correspondence; exact force/current/field/motion direction; or assessment answer state. Every one of these remains either a deterministic vector overlay (class A/C, per the pipeline document's §2 production-class taxonomy) or a fact independently verified against a technically authoritative reference before any illustration work begins.
3. For direction-sensitive electromagnetism specifically (right-hand grip rule, Fleming's left-hand/motor rule, Fleming's right-hand/generator rule, and any future magnetic field/current/force relationship), the production workflow must begin from a technically authoritative reference construction, **never from generated imagery or an illustrator's/model's visual memory of "what this typically looks like."** Hand orientation, digit correspondence, current direction, magnetic-field direction, force direction, motion direction and N/S relationship must be locked against that reference before illustration begins, and treated as immutable for that visual family thereafter (`PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md` §6).
4. This authority rule does not, by itself, change CC-05D's existing governance/QA architecture — it constrains *what a production input is allowed to decide*, upstream of CC-05D's contract/mechanical/semantic/human-review pipeline, which still applies unchanged to whatever is produced.

## Alternatives considered

| Option | Rejected primarily because |
|---|---|
| Trust generated imagery for geometry, verify after the fact via semantic QA | CC-05D's semantic QA (Pass A/B) is a vision-model *review* of an already-rendered image against a contract — it is well-suited to catching whether a rendered image matches a known-correct contract, but is not a substitute for the geometry having been correct in the first place; relying on it as the only check for AI-generated geometric claims stacks one unverified AI judgement on top of another rather than grounding either in an authoritative source. |
| Case-by-case judgement on whether a given generated image "looks right" | Exactly the failure mode this ADR exists to prevent — "looks right" is not a technical-correctness test, and is the same trap that let a structurally-valid-but-wrong diagram pass every existing check in CC-05D's own founding incident (§0). |
| Defer this decision until premium illustration work actually begins | The risk is real now, not hypothetical — CC-11.3's own pixel review found a geometry-communication defect in an existing *deterministic* diagram (the grip-rule thumb), which is a much easier case to get right than a generated image; recording the boundary before any generated imagery enters the pipeline is cheaper than correcting it after publication. |

## Consequences / trade-offs

- No image-generation tool was integrated by this ADR at the time it was recorded; it established the boundary rule for whenever that work began. **Update (automated visual-production pipeline):** Gemini (`gemini-3.1-flash-image`, via `tools/visual-production-studio/gemini-client.ts`) is now the implementation renderer used by the production pipeline (`PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md` §20). It operates exactly within the boundary this ADR set: it receives an approved technical reference image and the canonical style guide, redraws/re-illustrates within governed style, and never independently decides topology, connectivity, direction, or any other immutable technical fact — those remain either deterministic overlay or a fact locked against an independently-approved reference before generation begins, per §Decision points 1–3 above, unchanged.
- Class-A (deterministic technical) visuals are entirely unaffected — they already comply with this rule by construction, since they contain no generated imagery at all.
- Future class-B (premium conceptual illustration) visuals gain no additional correctness burden, since by definition their geometry is not the assessed fact (`PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md` §2).
- Future class-C (hybrid) visuals carry the real cost of this ADR: the illustrated layer and the deterministic overlay must be produced and reviewed as materially different trust levels, never merged into one "the image looked fine" approval step. This is a deliberate constraint on production velocity, accepted because the alternative (a plausible-looking but wrong physics image reaching a learner) is worse.
- No CC-05D schema, mechanical check, or semantic-QA prompt is changed by this ADR. A future package that builds class-B/C tooling will need to extend CC-05D's contract/canonical-variant model to represent "illustrated base + deterministic overlay" as a single governed visual — not yet designed, tracked as a review trigger below.
- **Update (CC-11.9, Product Owner reference handover):** the earlier assumption that missing technical semantics (pole identity, direction, hand identity, component labels) could always be deferred to a later deterministic overlay is corrected. Where a generated teaching illustration's own required labels/semantics are part of its acceptance criteria (`VisualAsset.requiredLabels`), they must be present and technically correct in the generated image itself — "add it later" is not an acceptable substitute for a wrong or missing fact in the actual pixels. This does not weaken the ADR's own boundary (exact/answer-critical geometry is still never generated); it corrects an operational shortcut that had crept into how the boundary was being applied. See `PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md` §21.

## Review triggers

- The first time any class-B or class-C visual is actually commissioned — confirms whether this ADR's authority split (§Decision, points 1–3) is sufficient in practice or needs a more detailed technical-invariant schema than the pipeline document's current prose-based "immutable technical invariants" field (`PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md` §3).
- The first time a second qualification's visual needs include a direction-sensitive physical relationship outside electromagnetism (e.g. fluid-flow direction, mechanical-advantage direction in a new domain) — confirms whether §Decision point 3's locked-skeleton rule should generalise beyond "direction-sensitive electromagnetism" to a broader "direction-sensitive physical relationship" category.
- Any incident where generated or illustrated imagery is found, post-publication, to have communicated an incorrect direction/geometry — triggers an immediate review of whether this ADR's process was actually followed, not merely whether the ADR itself needs to change.

## Related documents

- [`PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md`](../PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md) — the full production methodology (reference-first workflow, production classes, reference library, style system) this ADR's authority rule is extracted from.
- [`CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md`](../CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md) — the unchanged governance/QA architecture every produced visual, regardless of production class, must still pass.
- [`ADR-0002`](ADR-0002-external-source-verification-and-currency.md) — the same "independent verification before treating extraction as governed" discipline this ADR applies to visual geometry rather than factual text.
- `PROJECT-STATUS.md` §CC-11.3 — the real pixel-review finding (right-hand-grip-rule thumb redraw) that directly motivated recording this boundary before premium/generated imagery enters the pipeline.
- `docs/governance/DECISION-LOG.md` — pointer entry for this ADR.
