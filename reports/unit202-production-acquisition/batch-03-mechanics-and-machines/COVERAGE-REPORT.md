# Batch 03 Coverage Report — Mechanics and Machines

## Product Architect narrow-correction pass (this revision)

A Product Architect review of the original acquisition found six false-green risks despite the clean 28/28 VERIFIED and 18/18 READY totals: (1) an unqualified "ideal machines conserve power" inference; (2) the sole procedure evidence for the multistep-calculation learning point being an out-of-scope hydraulic example; (3) a gear-definition claim attributing content to a passage that didn't support it; (4) a self-contradictory lever distance-ratio claim; (5) a gear torque/speed relationship stated as unconditional rather than the ideal/lossless model; and (6) several cross-domain mathematics prerequisites attached defensively rather than because the outcome genuinely required them. All six were corrected — see "Correction pass detail" below. The 28 VERIFIED / 18 READY totals are **unchanged**, on the honest basis that genuine, properly-qualified or replaced evidence supports each affected item, not because the totals were preserved for their own sake.

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

- `SRC-UW-SIMPLEMACHINES` (University of Washington ENGR100 PDF) — levers, lever classes (confirming), lever calculations, force-distance trade, ideal-machine energy conservation. Its hydraulic worked example was **rejected** as evidence for the multistep-calculation requirement in the correction pass (see below), though it remains valid for force-distance-trade and ideal-machine-conserves-power.
- `SRC-HP-SIMMAC` (HyperPhysics) — mechanical advantage, force-distance trade, ideal-machine energy conservation; also now cited alongside `SRC-PSU-POWER` for an explicit, qualified power-equality derivation (correction pass).
- `SRC-PSU-EFFICIENCY` (Penn State Mechanics Map) — real-losses-reduce-useful-output and both efficiency requirements.
- `SRC-CUNY-GEARS` and `SRC-PSU-GEARDIRECTION` were deliberately cross-checked against each other to confirm they use the identical gear-ratio convention (output teeth/input teeth) before being combined in the same learning point.
- `SRC-PSU-GEARDIRECTION` (correction pass) — re-fetched to bind the general gear definition, replacing an unsupported claim previously attributed to `SRC-CUNY-GEARS`.
- `SRC-PSU-POWER` (correction pass) — its linked worked-solution PDF now also supports ideal-machine-conserves-power (via derivation) and legitimate-multistep-mechanical-calculations (replacing the rejected hydraulic example).

### Access failures (handled, not gaps)

- Oregon State BoxSand module: 403 Forbidden — abandoned, next candidate used.
- Millersville physics handout: 404 Not Found — abandoned, next candidate used.
- `hyperphysics.phy-astr.gsu.edu`: TLS certificate hostname mismatch — resolved by using `hyperphysics.gsu.edu` (identical content) for every HyperPhysics fetch in this batch.

### PDF extraction workaround

Formula/slide-deck or handwritten PDFs (University of Washington ENGR100, CUNY Brooklyn College gear notes, and — added in the correction pass — Penn State's Problem 2 worked-solution PDF) returned only "binary/compressed content" or unreadable image content via WebFetch's text extraction. All were resolved by reading the locally-saved PDF directly with the image-based PDF page reader, which correctly extracted the underlying text, formulas, diagrams, and worked calculation steps.

## Correction pass detail

A Product Architect narrow-correction pass addressed six findings, summarized here (full detail in `ACQUISITION-LOG.json`'s `productArchitectCorrectionPass` and in `EVIDENCE-RESULTS.json`'s per-requirement `scopeNote` fields):

1. **Ideal-machine power relationship** (`ideal-machine-conserves-power`): the previous claim embedded an unqualified inference that power is conserved. Corrected to an explicitly-derived, properly-qualified claim — combining the already-evidenced work equality with the already-evidenced `P=W/t` relationship, qualified to "no internal energy storage" and "compared over the same time interval." Remains VERIFIED.
2. **Multistep mechanical calculations** (`legitimate-multistep-mechanical-calculations`): the sole procedure evidence was an out-of-scope hydraulic worked example. Rejected and replaced with a genuinely in-scope worked example (gravitational lifting work chained into a power calculation) from the already-registered Penn State power source. Remains VERIFIED; the rejected hydraulic example is retained, explicitly marked rejected, in `ACQUISITION-LOG.json` and `SOURCE-REGISTER.json`.
3. **Gear definition overreach** (`gears`): a general "what a gear does" claim was attributed to a passage (CUNY) that did not support it. Corrected by narrowing the CUNY claim to only driver/driven/idler, and binding the general definition to an exact, newly-located passage from the already-registered Penn State gear-direction source. Remains VERIFIED.
4. **Incorrect lever normalization** (`basic-lever-effort-load-arm-relationship-at-appropriate-depth`): a claim self-contradicted its own cited numbers (said the load moves a smaller distance while citing an example where it moves farther). Corrected to accurately describe the source's own worked numbers, and to keep arm length distinct from distance travelled. Remains VERIFIED.
5. **Gear torque/speed qualification** (`torque-speed-relationship-where-applicable`): the torque equation was stated as an unconditional property of gear trains. Corrected to explicitly frame it as the ideal (lossless) model, noting real gear trains lose some torque to friction. Remains VERIFIED.
6. **Cross-domain prerequisites**: reviewed every `FM-LP-*` prerequisite against the genuine operation required by each learning point's outcome. Removed all cross-domain prerequisites from `MM-LP-09` (rope-section counting) and `MM-LP-10` (now purely conceptual); removed the formula-rearrangement prerequisite (`FM-LP-16`) from `MM-LP-13`, `MM-LP-15`, and `MM-LP-16`, whose evidenced worked examples only perform forward substitution.

A strict normalization review of every remaining `retrievedPassage`→`normalizedClaims` mapping found no further unsupported enrichment requiring correction.

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

Cross-domain prerequisites were drawn only from the accepted, frozen Batch 01 (`FM-LP-*`) inventory, attached only where a learning point's own outcome genuinely performs that mathematical operation: `FM-LP-04`, `FM-LP-06`, `FM-LP-07`, `FM-LP-08`, `FM-LP-10`, `FM-LP-13`, `FM-LP-16`. No `FM-LP-*` or `EFS-LP-*` identity was edited, renumbered, or duplicated. The correction pass narrowed several of these attachments (see above): `MM-LP-09` and `MM-LP-10` now carry no cross-domain prerequisites, and `FM-LP-16` (formula rearrangement) is now attached only to `MM-LP-02`, `MM-LP-05`, and `MM-LP-07`, whose outcomes genuinely require solving for a different unknown.

## What this batch does not do

This batch is production evidence acquisition and a proposed learning-point inventory only. It does not modify qualification scope, knowledge targets, evidence requirements, schemas, validators, planners, or acquisition-engine code; it does not touch Batch 01, Batch 02, the frozen preflight artifacts, the sealed historical benchmark, or any pilot/clean-room artifact; and it does not accept, freeze, or otherwise finalize the `MM-LP-*` learning-point identities, which remain subject to Product Architect review.

## Remaining gaps

None. All 28 requirements are VERIFIED with no conflicts.
