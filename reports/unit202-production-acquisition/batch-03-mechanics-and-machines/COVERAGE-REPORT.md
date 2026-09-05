# Batch 03 Coverage Report — Mechanics and Machines

## Product Architect final closure (this revision)

Following the narrow-correction pass below, the Product Architect accepted the corrected Batch 03 evidence and its 18 proposed learning points **IN PRINCIPLE AT THE APPROPRIATE EARLY-STAGE DEPTH**, subject to four final checks, all of which passed:

1. **A genuinely substantive JSON/Markdown comparison** (see "Substantive JSON/Markdown comparison" below) — previously only IDs, titles, prerequisites, and evidence mappings had been checked; this pass additionally compared learner outcomes, knowledge/procedure content, evidence readiness, exclusions, and all 28 coverage-matrix mappings, and corrected several Markdown entries that omitted substantive content present in the JSON (definitions of a lever's parts, mechanical advantage, a pulley, force, work, energy/KE/PE, and power — see below).
2. **MM-LP-18 scope check** — found MM-LP-18 broader than its replacement evidence (the Penn State weight-force-to-work-to-power worked example): its prerequisites and one application example implied an unrestricted procedure spanning levers, gears, pulleys and efficiency. Narrowed (see "MM-LP-18 scope narrowing" below).
3. **Penn State worked-solution PDF provenance** — found a provenance gap: the PDF actually quoted was not independently retrievable from the registered source's own URL. Corrected by registering the PDF as its own distinct `sourceId` (see "PDF provenance correction" below).
4. **Ideal-machine power qualification reconfirmation** — searched every artifact for unqualified "power is conserved" shorthand; found none remaining as a positive, current, learner-facing claim (see "Ideal-machine power qualification reconfirmation" below).

**`MM-LP-01` through `MM-LP-18` are now accepted and identity-frozen**: top-level inventory status `ACCEPTED_BY_PRODUCT_ARCHITECT`; `identityFreezePolicy.status` `FROZEN as of this closure pass`; future genuinely new mechanics-and-machines learning points begin at `MM-LP-19`; removed learning points would be deprecated, never renumbered or reused; instructional sequence remains tracked separately from stable identity — the same discipline already applied to Batch 01's `FM-LP-*` and Batch 02's `EFS-LP-*` inventories.

## Product Architect narrow-correction pass (prior revision)

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

18 unique sources are registered in `SOURCE-REGISTER.json` (17 from fresh acquisition, plus 1 -- `SRC-PSU-POWER-P2SOLUTION` -- added in this closure pass as a provenance split of already-fetched, already-quoted content; see "PDF provenance correction" below), spanning:

- **GOVERNMENT_OR_REGULATOR**: NIST (mass/weight definitions; force definition) — 2 sources
- **ACADEMIC_OR_RESEARCH_INSTITUTION**: HyperPhysics (Georgia State University) x5, University of Illinois, College of Micronesia-FSM, University of Washington ENGR100, University of Wisconsin-Madison, CUNY Brooklyn College, Penn State Mechanics Map x5 (including the newly-split worked-solution PDF) — 15 sources
- **AUTHORITATIVE_EDUCATIONAL_REFERENCE**: OpenStax College Physics (via Lumen Learning) — 1 source

### Source reuse

Several sources genuinely supported multiple requirements and were not re-counted as new discoveries on reuse:

- `SRC-UW-SIMPLEMACHINES` (University of Washington ENGR100 PDF) — levers, lever classes (confirming), lever calculations, force-distance trade, ideal-machine energy conservation. Its hydraulic worked example was **rejected** as evidence for the multistep-calculation requirement in the correction pass (see below), though it remains valid for force-distance-trade and ideal-machine-conserves-power.
- `SRC-HP-SIMMAC` (HyperPhysics) — mechanical advantage, force-distance trade, ideal-machine energy conservation; also now cited alongside `SRC-PSU-POWER` for an explicit, qualified power-equality derivation (correction pass).
- `SRC-PSU-EFFICIENCY` (Penn State Mechanics Map) — real-losses-reduce-useful-output and both efficiency requirements.
- `SRC-CUNY-GEARS` and `SRC-PSU-GEARDIRECTION` were deliberately cross-checked against each other to confirm they use the identical gear-ratio convention (output teeth/input teeth) before being combined in the same learning point.
- `SRC-PSU-GEARDIRECTION` (correction pass) — re-fetched to bind the general gear definition, replacing an unsupported claim previously attributed to `SRC-CUNY-GEARS`.
- `SRC-PSU-POWER` (correction pass) — also supports ideal-machine-conserves-power (via derivation, alongside `SRC-HP-SIMMAC`). Its linked worked-solution PDF, previously cited under this same sourceId, is now registered separately as `SRC-PSU-POWER-P2SOLUTION` (closure pass) — see "PDF provenance correction" below.
- `SRC-PSU-POWER-P2SOLUTION` (closure pass) — the Penn State "Problem 2" worked-solution PDF, registered as its own sourceId; supports legitimate-multistep-mechanical-calculations (replacing the rejected hydraulic example).

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

## Substantive JSON/Markdown comparison (closure pass)

A prior pass claimed a "substantive" comparison but demonstrated only ID, title, prerequisite, and evidence-mapping agreement. This closure pass programmatically compared all 18 learning points across every one of the following fields:

| Field | Method | Result |
|---|---|---|
| ID | Exact match, both directions | 18/18 match |
| Title | Exact string match | 18/18 match |
| Learner outcome | Presence + key-formula/term check (e.g. `F=mg`, `PE=mgh`, `P=W/t` present in both) | 18/18 match, no missing formulas |
| Knowledge/procedure | Presence + key-formula/term check | 18/18 match after corrections (see below); one flagged case (`MM-LP-10`) was a false positive from variable-naming abbreviation (`Force_in` vs `Force_input`), not a missing fact |
| Within-domain prerequisites | Exact set match | 18/18 match |
| Cross-domain prerequisites | Exact set match | 18/18 match |
| Evidence-requirement mappings | Exact set match (short-name form) | 18/18 match |
| Evidence readiness | Both artifacts state READY for all 18 | 18/18 match |
| Exclusions (where represented in both) | Presence check where JSON has `explicitExclusions` | 18/18 match |
| Coverage-matrix mappings (28 requirements) | Exact row-presence check in the Markdown table | 28/28 match |

**Corrections made as a result of this comparison:** the Markdown inventory was missing or materially abbreviating substantive knowledge content present in the JSON for eight learning points. Added or corrected `Knowledge:` content in Markdown for:
- `MM-LP-03` (lever/fulcrum/effort/load definitions were absent, only the outcome was stated)
- `MM-LP-08` (the basic "what a pulley is" definition was absent)
- `MM-LP-09` (the general mechanical-advantage definition was absent)
- `MM-LP-11` (the "useful output is always less than input" conclusion was absent)
- `MM-LP-12` (the exact newton definition was absent)
- `MM-LP-13` (the exact joule definition was absent)
- `MM-LP-14` (the actual definitions of energy/kinetic energy/potential energy were absent, only the outcome framing was present)
- `MM-LP-16` (the exact watt definition was absent)

None of these were previously-undetected factual errors — they were omissions where the Markdown's outcome-only prose did not carry the JSON's more precise definitional content. All corrections add content; none change the substance of any claim already present.

## MM-LP-18 scope narrowing (closure pass)

Reviewed `MM-LP-18` against its sole procedure evidence (the `SRC-PSU-POWER-P2SOLUTION` worked example: weight force × height → work → power). Found it broader than that evidence supports:

- `prerequisiteLearningPointIds` included `MM-LP-05` (lever calculations), `MM-LP-07` (gear ratio), `MM-LP-09` (mechanical advantage), `MM-LP-13` (work concept), and `MM-LP-17` (efficiency) — none of which the evidenced worked example demonstrates chaining into a work/power calculation.
- One `applicationTypes` example asked learners to chain a lever-or-pulley effort-force calculation into work/power, which is not what the evidence demonstrates.

**Narrowed:** `prerequisiteLearningPointIds` reduced to `["MM-LP-15", "MM-LP-16"]` — the weight-force-times-height work relationship and the power relationship the evidenced example actually uses. The lever/pulley application example was replaced with a second example within the evidenced weight/height/time chain type. An explicit exclusion was added naming lever/gear/pulley-to-work/power/efficiency chains as not directly evidenced by this requirement, even though each individual relationship remains separately evidenced and READY elsewhere in this batch. The learner outcome, knowledge/procedure, and application examples were all rewritten to state the evidenced chain specifically rather than implying an unrestricted omnibus procedure. `MM-LP-18`'s identity, title, and evidence-requirement mapping are unchanged; it remains `READY`.

## PDF provenance correction (closure pass)

The multistep-calculation worked example was quoted from `https://mechanicsmap.psu.edu/websites/10_work_energy_particle/10-3_power/pdf/P2.pdf` — a PDF linked from, but not identical to, `SRC-PSU-POWER`'s registered teaching-page URL (`.../power.html`). Anyone attempting to verify the quoted claim from `SRC-PSU-POWER`'s own registered URL would not land on the document actually quoted.

**Corrected:** registered the PDF as its own distinct source, `SRC-PSU-POWER-P2SOLUTION`, with its own exact URL, locator ("Penn State Mechanics Map, 'Power in Particle Systems' page, 'Problem 2' worked-solution PDF (pdf/P2.pdf), page 1"), publisher, and authority classification (`ACADEMIC_OR_RESEARCH_INSTITUTION`, same rationale as its parent page). `SRC-PSU-POWER`'s own entry now supports only what its own page states (`p-w-t`; the `ideal-machine-conserves-power` derivation, which cites the page's own `P=W/t` statement). `EVIDENCE-RESULTS.json`'s candidate sources, normalized claims, and `candidatesEvaluatedInOrder` for the multistep-calculation requirement were updated to cite the new sourceId. Both entries cross-reference each other via a `relatedSourceId` field. Source count is now 18 (17 → 18); this is a provenance normalization of already-fetched, already-quoted content, not new acquisition — the requirement remains `VERIFIED` on the same underlying evidence.

## Ideal-machine power qualification reconfirmation (closure pass)

Searched every Batch 03 artifact for "conserve"/"conservation"/"conserves power" occurrences. Every occurrence is one of: (a) the frozen requirement identifier `ideal-machine-conserves-power` itself (not renamed, per instruction), (b) a reference to the distinct, correct, and unrestricted law of conservation of energy (which requires no qualification), or (c) a properly-qualified or explicitly-negated statement (e.g. "NOT that power is a generally conserved quantity", "not an independent 'power conservation law'"). No unqualified "power is conserved" or "ideal machines conserve power" shorthand appears anywhere as a positive, current, learner-facing claim — every mention of that phrasing describes the *previously corrected* problem, in past tense, as historical record. No further correction was needed.

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

18 learning points (`MM-LP-01`–`MM-LP-18`, status **`ACCEPTED_BY_PRODUCT_ARCHITECT`**) cover all 28 requirements, each mapped to exactly one learning point (see the coverage matrix in `MECHANICS-AND-MACHINES-LEARNING-POINTS.md`/`.json`). All 18 are marked **READY** — no `HELD` or `PARTIALLY_EVIDENCED` learning points, since every underlying evidence requirement is VERIFIED. **`MM-LP-01` through `MM-LP-18` are now identity-frozen** (`identityFreezePolicy.status`: `FROZEN as of this closure pass`): future genuinely new mechanics-and-machines learning points begin at `MM-LP-19`; removed learning points would be deprecated, never renumbered or reused; instructional sequence remains tracked separately from stable identity.

Cross-domain prerequisites were drawn only from the accepted, frozen Batch 01 (`FM-LP-*`) inventory, attached only where a learning point's own outcome genuinely performs that mathematical operation: `FM-LP-04`, `FM-LP-06`, `FM-LP-07`, `FM-LP-08`, `FM-LP-10`, `FM-LP-13`, `FM-LP-16`. No `FM-LP-*` or `EFS-LP-*` identity was edited, renumbered, or duplicated. The correction pass narrowed several of these attachments (see above): `MM-LP-09` and `MM-LP-10` now carry no cross-domain prerequisites, and `FM-LP-16` (formula rearrangement) is now attached only to `MM-LP-02`, `MM-LP-05`, and `MM-LP-07`, whose outcomes genuinely require solving for a different unknown.

## What this batch does not do

This batch is production evidence acquisition plus an accepted, identity-frozen learning-point inventory. It does not modify qualification scope, knowledge targets, evidence requirements, schemas, validators, planners, or acquisition-engine code; it does not touch Batch 01, Batch 02, the frozen preflight artifacts, the sealed historical benchmark, or any pilot/clean-room artifact; it does not reopen the acquisition (no new source was sought in this closure pass); and it does not generate any lesson, storyboard, or assessment from these learning points, nor does it begin Batch 04.

## Remaining gaps

None. All 28 requirements are VERIFIED with no conflicts.
