# Batch 05 -- Electromagnetism and Induction: Coverage Report

## Scope

44 requirements / 44 unique `evidenceRequirementId`s were taken from the frozen
`reports/backtests/unit202-evidence-acquisition-preflight/UNIT202-EVIDENCE-REQUIREMENT-PLAN.json`
(all with `canonicalRequirementKey` containing `::electromagnetism-and-induction::`). Requirement metadata is
copied mechanically from the frozen plan during assembly rather than transcribed, so it cannot drift. Exact
44-ID set equality against the frozen plan is proved by the batch validation script and holds.

Work proceeded through three parallel research clusters:

| Cluster | Scope | Requirements |
|---|---|---|
| B05-A | Magnetism fundamentals, flux quantities, field patterns and page conventions | 12 |
| B05-B | Motor effect, electromagnetic induction, and generator hardware | 15 |
| B05-C | AC waveform quantities, sine-wave conversions and AC generation calculations | 17 |
| **Total** | | **44** |

## Evidence status totals

**32 VERIFIED, 11 PARTIALLY_VERIFIED, 1 SOURCE_GAP.**

> **The dominant reason for a non-VERIFIED status in this batch is AUTHORITY TIER, not content.** In seven of the
> nine cases below, clear and genuinely authoritative material was retrieved and read, but its authority class is
> not among the permitted classes the frozen plan sets for that specific requirement. Those passages are preserved
> on each result under `evaluatedButOutOfPermittedAuthorityClass`. **No frozen requirement's permitted authority
> classes were widened to turn a result green**, and no claim rests on an out-of-class source.

| Requirement | Status | Why |
|---|---|---|
| `appropriate-simple-ac-generation-calculations::PROCEDURE_COVERAGE` | PARTIALLY_VERIFIED | Downgraded VERIFIED -> PARTIALLY_VERIFIED during the internal audit pass, on BREADTH. |
| `appropriate-sine-wave-conversions-calculations::PROCEDURE_COVERAGE` | PARTIALLY_VERIFIED | Downgraded VERIFIED -> PARTIALLY_VERIFIED during the internal audit pass, on CALCULATION_METHOD breadth. |
| `coil::SCHEMATIC_OR_DIAGRAM_RECOGNITION` | PARTIALLY_VERIFIED | No source within the requirement's permitted authority classes was obtained that shows a coil with an explicit figure callout reading 'coil', nor a standardised graphical symbol for a coil/winding. |
| `dot-cross-page-convention::SYMBOL_OR_CONVENTION` | SOURCE_GAP | AUTHORITY-CLASS MISMATCH, not a content gap. |
| `equivalent-rpm-relationship-f-n-rpm-x-p-60::RELATIONSHIP` | PARTIALLY_VERIFIED | The n_rpm-with-pole-pairs form (f = n_rpm × P_pole-pairs / 60) was not directly evidenced by any read passage; four further candidates (IEC Electropedia, Britannica, ScienceDirect topic pages, University of Tennessee ECE 522 notes) were all inaccessible - see accessFailures. |
| `fleming-right-hand-generator-rule::OPERATIONAL_USE_RULE` | PARTIALLY_VERIFIED | No source within the permitted authority classes was found that states IN TEXT the finger-to-quantity assignment for the right hand (thumb = motion/velocity, first finger = field, second finger = induced current). |
| `magnetic-field-patterns::SCHEMATIC_OR_DIAGRAM_RECOGNITION` | PARTIALLY_VERIFIED | PARTIALLY_VERIFIED on BREADTH. |
| `motional-induced-emf-causal-concept::RELATIONSHIP` | PARTIALLY_VERIFIED | Downgraded VERIFIED -> PARTIALLY_VERIFIED during the internal audit pass. |
| `motor-effect::EXACT_FACT` | PARTIALLY_VERIFIED | The physical fact is fully evidenced, but no read source within the permitted authority classes uses the UK-syllabus TERM 'motor effect' itself; both sources title the phenomenon 'magnetic force on a current-carrying conductor/wire'. |
| `right-hand-grip-rule::OPERATIONAL_USE_RULE` | PARTIALLY_VERIFIED | PARTIALLY_VERIFIED on AUTHORITY DEPTH and on the CORRECT_USE_CONDITIONS dimension. |
| `rotational-frequency-pole-pairs-relationship::FORMULA_OR_RULE` | PARTIALLY_VERIFIED | No read source states the formula in the requirement's exact units (f in Hz, N in rev/s, P = pole pairs). |
| `single-loop-alternator-generator-parts::SCHEMATIC_OR_DIAGRAM_RECOGNITION` | PARTIALLY_VERIFIED | No source read within the permitted authority classes shows a diagram explicitly captioned as a SINGLE-LOOP (one-turn) alternator with every part labelled. |

### The one SOURCE_GAP

`dot-cross-page-convention::SYMBOL_OR_CONVENTION` is a **pure authority-class gap**. MIT 8.02 states both
directions verbatim ("points out the page and is represented with dots"; "points into the page, and is
represented with crosses"), and OpenStax corroborates. But this requirement permits only
`PRIMARY_NORMATIVE_OR_STANDARDS_BODY`, `PROFESSIONAL_BODY` and `AUTHORITATIVE_TECHNICAL_REFERENCE` --
`ACADEMIC_OR_RESEARCH_INSTITUTION` is excluded -- and IEC Electropedia returned 403 on every attempt. **The
content is not in doubt; the required authority tier could not be reached.** Either an in-class source must be
acquired or the frozen requirement's permitted classes reconsidered at plan level.

## Sources

48 sources are registered, all genuinely opened and read. `supportsRequirementSuffixes` is derived
mechanically from actual citations in `EVIDENCE-RESULTS.json`, so the register cannot over-claim.
2 source(s) are marked
`citedAsVerifyingEvidence: false` -- genuinely read, but of an authority class not permitted for any requirement
they were evaluated for; they are retained for the audit trail and support no claim.

**No `PRIMARY_NORMATIVE_OR_STANDARDS_BODY` or `GOVERNMENT_OR_REGULATOR` source appears anywhere in this batch.**
IEC Electropedia, the IEC 60617/60050 databases, Britannica and ScienceDirect all returned 403 throughout. This is
a systemic limitation of the whole acquisition and is flagged for Product Architect judgment.

Access failures and workarounds are recorded per-candidate in `ACQUISITION-LOG.json`. Notably, several PDFs
(MIT 8.02 chapters, the US DOE handbook, the Mersen carbon-brush guide) would not yield text through the fetch
tool and were downloaded and read as rendered page images; every figure cited from them was actually viewed.

## Depth guardrail compliance

- **Fleming's rules kept strictly apart.** LEFT hand = motor/force (`EMI-LP-13`); RIGHT hand = generator/induced
  EMF (`EMI-LP-16`). Two separate learning points, each naming the other as the thing it is not.
- **Right-hand grip rule** (`EMI-LP-05`): thumb = **conventional** current, curled fingers = field. Carries
  `EFS-LP-03` as a genuine cross-domain prerequisite because the rule is convention-dependent.
- **Solenoid polarity** (`EMI-LP-06`): the hand-role REVERSAL against the straight-conductor grip rule (fingers =
  current, thumb = north pole) is taught explicitly as knowledge content, because it is the error this pairing
  generates.
- **`F = BIl`** (`EMI-LP-12`) is stated as the **perpendicular-conductor special case**, with the general
  `F = BIl sin(theta)` form named as the scope qualification. The scalar case is never presented as general.
- **`e = Blv`** (`EMI-LP-15`) carries its mutually-perpendicular / maximum-flux-cutting conditions explicitly.
- **`B = phi/A`** (`EMI-LP-11`) is scoped to the uniform-field, field-normal-to-area case, with
  `phi = BA cos(theta)` named as the general relationship. Never presented as the unrestricted definition.
- **Maximum vs zero flux cutting** (`EMI-LP-14`): taught together precisely so the trap is visible -- maximum
  FLUX and maximum EMF occur at OPPOSITE instants, because EMF depends on the RATE of cutting.
- **Pole PAIRS** (`EMI-LP-22`): `f = N x P` uses pole pairs, and the genuine cross-source conflict with the
  total-poles convention (`f = P/2 x N/60`, `n_s = 120f/P`) is recorded as explicit knowledge content, not
  silently harmonised, because the two differ by a factor of two.
- **The three averages kept distinct** (`EMI-LP-20`): signed full-cycle average = **0**; half-cycle/rectified
  average = **0.637 x peak**; RMS = **0.707 x peak**. The 0.637 figure is never presented as the signed average.
- **RMS** is taught as the equivalent **heating/power** value, explicitly *not* as "the average".
- **0.707 and 1.414 restricted to pure sine waves**, with the restriction stated as knowledge content and
  reinforced as an exclusion in `EMI-LP-21`.
- **Slip rings, not a commutator** (`EMI-LP-17`): the AC-generator/DC-generator distinction and its different
  output waveforms are taught explicitly; substituting a commutator is named as the error to avoid.
- **Relay and contactor kept distinct** (`EMI-LP-08`): a contactor is defined as a relay built to switch large
  power, so the distinguishing property is stated rather than the two being treated as synonyms.
- **Recognition outcomes rest only on actually-retrieved figures** with exact identifiers and full provenance. No
  diagram was generated, drawn or described from memory. Where a labelled figure could not be obtained (the
  `coil` requirement), that is recorded as PARTIALLY_VERIFIED rather than filled in from knowledge.
- **Excluded throughout:** Maxwell's equations, vector calculus, advanced phasors, detailed winding design,
  three-phase generation, and machine theory beyond the simple single-loop alternator.

## Proposed learning-point summary

22 proposed learning points (`EMI-LP-01` through `EMI-LP-22`), all
`status: PROPOSED_FOR_PA_REVIEW` -- none accepted, frozen or identity-locked.
**13 READY, 9 HELD_PENDING_EVIDENCE_CORRECTION.**

Every requirement maps to exactly one learning point (proved by the validation script -- no requirement is
unmapped, and none is double-counted across two learning points). Readiness is derived mechanically from the
underlying evidence statuses, and the generator refuses to emit a learning point marked READY over PARTIALLY_VERIFIED or
SOURCE_GAP evidence.

The held learning points are:

- `EMI-LP-02` (Recognising magnetic field patterns) -- Underlying evidence is PARTIALLY_VERIFIED on BREADTH.
- `EMI-LP-03` (The dot-and-cross page convention for field and current direction) -- Underlying evidence is a SOURCE_GAP on AUTHORITY CLASS, not on content.
- `EMI-LP-05` (The right-hand grip rule for a current-carrying conductor) -- Underlying evidence is PARTIALLY_VERIFIED.
- `EMI-LP-12` (The motor effect and the force on a current-carrying conductor) -- The F = BIl half of this learning point is fully VERIFIED, including its perpendicularity condition.
- `EMI-LP-14` (Electromagnetic induction: motion, flux cutting, and when EMF is greatest or zero) -- Three of the four underlying requirements are fully VERIFIED.
- `EMI-LP-16` (Fleming's right-hand (generator) rule) -- Underlying evidence is PARTIALLY_VERIFIED on the DIRECTIONAL_MAPPING dimension.
- `EMI-LP-17` (The simple AC generator: parts and how they work together) -- Two of the four underlying requirements are PARTIALLY_VERIFIED.
- `EMI-LP-21` (Carrying out sine-wave conversion calculations) -- Underlying evidence is PARTIALLY_VERIFIED on CALCULATION_METHOD breadth.
- `EMI-LP-22` (Generated frequency, pole pairs and rotational speed) -- All three underlying requirements are now PARTIALLY_VERIFIED.

## Matters flagged for the consolidated Product Architect review

1. **No normative or governmental source anywhere in this batch** (IEC/Britannica/ScienceDirect all 403).
2. **The `dot-cross-page-convention` SOURCE_GAP** is an authority-tier gap on content that is not in dispute -- decide
   whether to acquire an in-class source or revisit the frozen requirement's permitted classes.
3. **`right-hand-grip-rule` rests on a single vendor source** for its directional mapping, with the clearest
   statements found sitting outside the permitted classes.
4. **`fleming-right-hand-generator-rule`**: the rule's role and use conditions are evidenced, but the
   thumb/finger MAPPING is not evidenced in text by any in-class source. It must not be taught as established.
5. **The pole-pairs versus total-poles convention conflict** (`EMI-LP-22`) needs a qualification-level decision;
   the two conventions differ by a factor of two.
6. **`motor-effect`**: the physics is fully evidenced but no in-class source uses the UK term itself.
7. **US DOE handbook classification**: classified `AUTHORITATIVE_TECHNICAL_REFERENCE` as a formally issued
   engineering handbook. A reviewer reading it as purely governmental would need to downgrade the slip-ring and
   single-loop-alternator results; brushes would still stand on two manufacturer sources.
8. **Historical figure provenance**: the in-class diagram sources for pole and field-pattern recognition are
   1895-1917 handbook illustrations reproduced by the University of South Florida's ClipArt ETC. The physics is
   not time-sensitive, but the register may not suit learner-facing material.
9. **The `EQCT-LP-08` frequency relationship** (see `overlapAudit`) -- deliberately not encoded as a
   prerequisite because Batch 04 is itself unfrozen.

## Validation

Run `node validate-batch.js` (see the consolidated review pack) for the deterministic checks: exact 44-ID set
equality with the frozen plan; no duplicate or omitted requirement IDs; valid JSON throughout; every cited source
and normalized-claim reference resolves; **every cited authority class permitted by its own requirement**;
prerequisite references resolve with no cycles; Markdown and JSON learning-point inventories agree; and no
learning point marked READY over non-VERIFIED evidence.
