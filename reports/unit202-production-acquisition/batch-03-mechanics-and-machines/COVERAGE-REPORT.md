# Batch 03 Coverage Report — Mechanics and Machines

## Summary

All 28 `mechanics-and-machines` evidence requirements (from `UNIT202-EVIDENCE-REQUIREMENT-PLAN.json`, confirmed via `canonicalRequirementKey` containing `::mechanics-and-machines::`) were acquired and reached **VERIFIED** status. No `PARTIALLY_VERIFIED`, `SOURCE_GAP`, or `CONFLICTED` results were produced in this batch.

| Status | Count |
|---|---|
| VERIFIED | 28 |
| PARTIALLY_VERIFIED | 0 |
| SOURCE_GAP | 0 |
| CONFLICTED | 0 |
| **Total** | **28** |

## Sources

17 unique sources were registered in `SOURCE-REGISTER.json`, spanning:

- **GOVERNMENT_OR_REGULATOR**: NIST (mass/weight definitions; force definition) — 2 sources
- **ACADEMIC_OR_RESEARCH_INSTITUTION**: HyperPhysics (Georgia State University) x5, University of Illinois, College of Micronesia-FSM, University of Washington ENGR100, University of Wisconsin-Madison, CUNY Brooklyn College, Penn State Mechanics Map x4 — 14 sources
- **AUTHORITATIVE_EDUCATIONAL_REFERENCE**: OpenStax College Physics (via Lumen Learning) — 1 source

### Source reuse

Several sources genuinely supported multiple requirements and were not re-counted as new discoveries on reuse:

- `SRC-UW-SIMPLEMACHINES` (University of Washington ENGR100 PDF) — levers, lever classes (confirming), lever calculations, force-distance trade, ideal-machine energy conservation, and the multistep-calculation requirement (its hydraulic worked example used only as a procedural analogy).
- `SRC-HP-SIMMAC` (HyperPhysics) — mechanical advantage, force-distance trade, ideal-machine energy conservation.
- `SRC-PSU-EFFICIENCY` (Penn State Mechanics Map) — real-losses-reduce-useful-output and both efficiency requirements.
- `SRC-CUNY-GEARS` and `SRC-PSU-GEARDIRECTION` were deliberately cross-checked against each other to confirm they use the identical gear-ratio convention (output teeth/input teeth) before being combined in the same learning point.

### Access failures (handled, not gaps)

- Oregon State BoxSand module: 403 Forbidden — abandoned, next candidate used.
- Millersville physics handout: 404 Not Found — abandoned, next candidate used.
- `hyperphysics.phy-astr.gsu.edu`: TLS certificate hostname mismatch — resolved by using `hyperphysics.gsu.edu` (identical content) for every HyperPhysics fetch in this batch.

### PDF extraction workaround

Two formula/slide-deck PDFs (University of Washington ENGR100, CUNY Brooklyn College gear notes) returned only "binary/compressed content" via WebFetch's text extraction. Both were resolved by reading the locally-saved PDF directly with the image-based PDF page reader, which correctly extracted the underlying text, formulas and diagrams.

## Depth discipline applied

Each Product-Architect-locked boundary was explicitly checked against the acquired evidence and the resulting learning points:

- **Mass/weight**: F=mg is bound as an unconditional definition of gravitational weight force (not restricted to free fall); weight-force notation is kept distinct from the work symbol W; no independent F=ma topic was introduced.
- **Levers**: lever identity/parts, lever classes, and lever calculations are covered as three separately-diagnosable learning points (MM-LP-03/04/05); lever classes are bound to the positional rule, not to memorising named example objects.
- **Gears**: every gear-ratio formula explicitly defines its numerator (output/driven teeth) and denominator (input/driver teeth); the convention was confirmed identical across two independently-retrieved sources (CUNY, Penn State) before being combined; no claim anywhere states or implies that gears create or increase power; rotation direction for directly-meshing external gears is bound only where evidenced.
- **Pulleys/machines**: pulley purpose/operation, mechanical advantage, and the ideal force-distance trade are covered with mechanical advantage's "number of supporting rope sections" rule bound exactly as the source defines it (load-end sections, not total rope length or pulley count); ideal machines are explicitly stated as unable to create energy or power; real friction/losses are covered as a separate, independently-diagnosable learning point; the batch does not expand into lifting-equipment regulation, pulley-block inspection, or advanced dynamics.
- **Force/work/energy/power/efficiency**: W=Fd is explicitly scoped to the case where the force acts along the displacement direction; kinetic and potential energy are covered as qualitative concepts only, with the KE=½mv² formula never introduced as mastery content; PE=mgh defines Δh explicitly as vertical height change under a consistent gravitational-field assumption; efficiency is bound with its two legitimate, non-mixed forms (work-ratio and power-ratio) kept explicit and separate; a distinct procedural learning point (MM-LP-18) covers genuinely multistep calculation, separate from single-formula recognition.

### Confirmed absent from this batch's evidence and learning points

- F=ma as an independent topic (mentioned only inside exclusion-disclosure scope notes, never as an introduced or taught relationship).
- KE=½mv² (same — exclusion-disclosure only).
- Vector mechanics, calculus-based treatments, angular-momentum theory, stress/strain, fluid mechanics, advanced machine dynamics, detailed friction-coefficient calculations, and full engineering design of lifting machinery.
- Any claim that gears, pulleys, or other ideal machines create or increase energy or power.

## Learning points

18 proposed learning points (`MM-LP-01`–`MM-LP-18`, status `PROPOSED_FOR_PA_REVIEW`) cover all 28 requirements, each mapped to exactly one learning point (see the coverage matrix in `MECHANICS-AND-MACHINES-LEARNING-POINTS.md`/`.json`). All 18 are marked **READY** — no `HELD` or `PARTIALLY_EVIDENCED` learning points, since every underlying evidence requirement is VERIFIED. No `MM-LP-*` identity is accepted or frozen in this batch; that decision is reserved for Product Architect review.

Cross-domain prerequisites were drawn only from the accepted, frozen Batch 01 (`FM-LP-*`) inventory, attached only where a learning point's own outcome genuinely performs that mathematical operation: `FM-LP-04`, `FM-LP-06`, `FM-LP-07`, `FM-LP-08`, `FM-LP-10`, `FM-LP-13`, `FM-LP-16`. No `FM-LP-*` or `EFS-LP-*` identity was edited, renumbered, or duplicated.

## What this batch does not do

This batch is production evidence acquisition and a proposed learning-point inventory only. It does not modify qualification scope, knowledge targets, evidence requirements, schemas, validators, planners, or acquisition-engine code; it does not touch Batch 01, Batch 02, the frozen preflight artifacts, the sealed historical benchmark, or any pilot/clean-room artifact; and it does not accept, freeze, or otherwise finalize the `MM-LP-*` learning-point identities, which remain subject to Product Architect review.

## Remaining gaps

None. All 28 requirements are VERIFIED with no conflicts.
