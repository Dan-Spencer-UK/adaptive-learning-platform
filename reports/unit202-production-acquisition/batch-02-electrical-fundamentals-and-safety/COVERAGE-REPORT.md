# Unit 202 Production Acquisition — Batch 02: Electrical Fundamentals and Safety

**Domain:** electrical-fundamentals-and-safety (28 of Unit 202's 213 evidence requirements)
**Status:** All 28 requirements VERIFIED. Proposed for Product Architect review — not yet accepted.
**This is the second of six planned Unit 202 production acquisition domains** (batch 01, foundational mathematics, is already accepted and closed). The remaining ~157 requirements across the other four domains are not addressed here and are not claimed complete.

## Summary

| # | Requirement | Status | Source(s) |
|---|---|---|---|
| 1 | Basic electron theory | VERIFIED | HyperPhysics 'Atoms and Elements' + 'Conductors and Insulators' |
| 2 | Current as charge/electron-flow concept | VERIFIED | HyperPhysics 'Electric current' |
| 3 | Conventional current vs. electron flow | VERIFIED | HyperPhysics 'Electric current' (same document) |
| 4 | Conductors | VERIFIED | HyperPhysics 'Conductors and Insulators' |
| 5 | Insulators | VERIFIED | HyperPhysics 'Conductors and Insulators' (same document) |
| 6 | Resistance | VERIFIED | HyperPhysics 'Resistance and Resistivity' |
| 7 | Resistivity | VERIFIED | HyperPhysics 'Resistance and Resistivity' (same document) |
| 8 | Rho (resistivity symbol) | VERIFIED | NIST, 'Resistivity and Hall Measurements' |
| 9 | Ohm-metre (resistivity unit) | VERIFIED | NIST 'Resistivity and Hall Measurements' + NIST SI Guide Appendix B.9 (combined) |
| 10 | R = ρL/A and rearrangement | VERIFIED | HyperPhysics 'Resistance and Resistivity' + Union College Physics 111 |
| 11 | Ohm's law | VERIFIED | HyperPhysics "Ohm's Law" |
| 12 | V=IR and rearrangements | VERIFIED | HyperPhysics "Ohm's Law" + 'Resistance and Resistivity' |
| 13 | Voltage drop (definition) | VERIFIED | University of Utah ECE, Conceptual Tools |
| 14 | Vdrop = IR | VERIFIED | University of Utah ECE (same document) |
| 15 | Appropriate voltage-drop calculation | VERIFIED | IET Wiring Matters (July 2023) |
| 16 | Series circuit: current common | VERIFIED | ETSU PHYS-2020 Course Notes |
| 17 | Series circuit: resistance sums | VERIFIED | ETSU PHYS-2020 + Union College Physics 111 |
| 18 | Series circuit: voltage shares/sums | VERIFIED | ETSU PHYS-2020 (same document) |
| 19 | Parallel circuit: voltage common | VERIFIED | ETSU PHYS-2020 (same document) |
| 20 | Parallel circuit: current divides/sums | VERIFIED | ETSU PHYS-2020 (same document) |
| 21 | Parallel circuit: equivalent resistance | VERIFIED | ETSU PHYS-2020 + Union College Physics 111 |
| 22 | P = VI | VERIFIED | HyperPhysics 'Electric Power' + Union College Physics 111 |
| 23 | P = I²R | VERIFIED | Union College Physics 111 |
| 24 | P = V²/R (where appropriate) | VERIFIED | ETSU PHYS-2020 |
| 25 | Suitable DC-circuit power calculations | VERIFIED | ETSU PHYS-2020 (worked example) |
| 26 | Thermal effect of current | VERIFIED | Union College Physics 111 |
| 27 | Fuse operation (thermal-effect example) | VERIFIED | University of Calgary, Energy Education |
| 28 | Chemical effect / electrolysis | VERIFIED | University of Colorado Boulder, Lecture Demonstration Manual |

**Totals: 28 VERIFIED · 0 PARTIALLY_VERIFIED · 0 SOURCE_GAP · 0 CONFLICTED.**

No requirement in this batch was reused from pilot-002 or from batch-01 (foundational mathematics does not overlap electrical content). Every requirement was freshly researched in this session.

## Source reuse

**14 unique sources support 28 requirements** — a genuine ~2:1 reuse ratio, arising naturally because general physics/electrical-engineering course material commonly covers several related quantities/relationships on one page, not because sourcing was inflated or forced:

- **HyperPhysics** (Georgia State University) supplies 6 of the 14 sources, covering electron theory, conductors/insulators, current, Ohm's law, resistance/resistivity, and electric power — each a separate page, cited separately.
- **ETSU PHYS-2020 course notes** (East Tennessee State University) alone supports 8 requirements: all three series-circuit relationships, all three parallel-circuit relationships, P=V²/R (with its "where appropriate" condition made explicit), and the DC-circuit power-calculation procedure.
- **Union College Physics 111 course notes** supports 6 requirements: P=I²R, P=VI (confirming), thermal effect, series-resistance-sum and parallel-equivalent-resistance (confirming ETSU), and the microscopic R=ρL/A derivation (confirming HyperPhysics).
- **NIST** supplies 2 sources (a nanoscale-measurement technical page and the SI-unit conversion-factor Appendix B.9), jointly establishing the resistivity symbol/unit requirement — disclosed as a two-source compound binding, not a single passage stating both facts.
- The remaining 5 sources (University of Utah ECE, IET Wiring Matters, University of Calgary Energy Education, University of Colorado Boulder Chemistry) each support exactly one or two closely related requirements.

No requirement's evidence was weakened or generalised merely to enable source reuse.

## Authority classes used

- **ACADEMIC_OR_RESEARCH_INSTITUTION** (most requirement-bindings): HyperPhysics (Georgia State University), University of Utah (Electrical and Computer Engineering), University of Calgary (Energy Education), University of Colorado Boulder (Chemistry), Union College (Physics), East Tennessee State University (Physics and Astronomy). All six are hosted directly on the originating institution's own domain/server, not a third-party mirror.
- **PRIMARY_NORMATIVE_OR_STANDARDS_BODY** (2 requirement-bindings): NIST, for the resistivity symbol/unit.
- **PROFESSIONAL_BODY** (1 requirement-binding): the IET, for the voltage-drop calculation procedure.

All sources fall within each requirement's own permitted authority-class list (verified programmatically against the frozen plan's `sourceAuthorityClasses` field for every one of the 28 requirements). No authority-policy adjudication was needed in this batch, unlike batch-01's narrow `SYMBOL_OR_CONVENTION` exception.

## Depth discipline applied

- **Current as charge flow, not electron flow, calibrated deliberately.** EFS-LP-02's outcome and claim state current as the rate of charge flow (I=q/t) as the correct definition, with electron motion described as the physical carrier in a conductor — not as an equivalent simplified restatement of the definition. The separate conventional-vs-electron-flow distinction (EFS-LP-03) is evidenced and taught independently.
- **Resistance vs. resistivity kept distinct.** Resistance (a component's V/I ratio) and resistivity (a shape-independent material property, with its own symbol, unit, and formula) are two separate learning points, not conflated.
- **Ohm's law stated as conditional, not universal.** The HyperPhysics source explicitly restricts the direct-proportionality relationship to "ohmic" materials where the voltage/current ratio is constant — this conditionality is preserved in the bound claim and the learning point, not smoothed away.
- **Series and parallel relationships kept fully separate.** All three series-circuit relationships (current/resistance/voltage) and all three parallel-circuit relationships (voltage/current/resistance) are independently sourced and independently learning-pointed, exactly mirroring the frozen plan's own three-way split for each, so a learner who masters one cannot be assumed to have mastered another.
- **P=VI/P=I²R/P=V²/R's conditions made explicit.** The P=V²/R claim is bound with its worked source's own explicit condition (valid when internal/source resistance is negligible compared with the load) rather than presented as unconditionally interchangeable with the other two forms.
- **Voltage drop and DC-circuit power calculations kept as concept-vs-procedure pairs.** Voltage-drop-definition+Vdrop=IR (concept) is a separate learning point from the mV/A/m calculation procedure; the three power formulas (concept) are a separate learning point from the DC-circuit power-calculation procedure — each pair reflects genuinely different, independently-assessable skills.
- **Thermal effect vs. fuse operation kept separate.** General Joule heating (P=I²R) and the specific practical mechanism of a fuse are evidenced and learning-pointed separately, since a learner can know one without the other.

## Remaining gaps

None. All 28 requirements are `VERIFIED`.

One requirement (`ohm-metre-resistivity-unit`) required combining two genuinely-read NIST passages rather than one single passage stating both the symbol and the SI unit name together — disclosed explicitly in that result's `scopeNote`, not concealed. One requirement (`r-rho-l-a-and-appropriate-rearrangement-use`) treats "appropriate rearrangement" as an application of the general formula-transposition skill already evidenced in Batch 01 (`FM-LP-16`) rather than as a separately-sourced physics fact, since no retrieved source showed the formula explicitly rearranged in text — also disclosed, not papered over.

## Pipeline limitations encountered

Two genuinely useful, on-topic PDFs (Union College Physics 111 Chapter 16; ETSU PHYS-2020 Section IV) could not be read as text by the harness's web-fetch tool, which reported only compressed/binary stream content for both. Both are slide/formula-heavy documents whose actual content is typeset text rendered as page images. Both were instead read directly via the harness's image-based PDF-page reader, and the quotations bound to them were transcribed directly from those page images. This is disclosed in `ACQUISITION-LOG.json`'s `manualNormalizationNote` as a genuine, worked-around pipeline limitation, not a silent change to the acquisition method.

A small number of candidate URLs failed on access (TLS certificate errors, HTTP 403/503) — see `ACQUISITION-LOG.json`'s `accessFailures` list. Every affected requirement was still closed with a successfully-retrieved, in-policy alternative; none was left `SOURCE_GAP`.

## What this batch does not do

- It does not acquire evidence for any of the other ~157 remaining Unit 202 requirements (the other four production domains remain unstarted).
- It does not generate learner-facing lessons, storyboards, or assessment items — only a proposed learning-point inventory (see `ELECTRICAL-FUNDAMENTALS-AND-SAFETY-LEARNING-POINTS.{json,md}`), awaiting Product Architect review.
- It does not claim Unit 202 acquisition is complete.
- It does not modify the frozen preflight artefacts, the accepted batch-01 artefacts, any sealed pilot, application code, the generic acquisition-planner code, or any schema/validator.
- It does not begin batch 03.
