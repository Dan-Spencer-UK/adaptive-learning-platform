# Unit 202 Production Acquisition — Batch 01: Foundational Mathematics

**Domain:** foundational-mathematics (16 of Unit 202's 213 evidence requirements)
**Status:** 15 requirements VERIFIED, 1 PARTIALLY_VERIFIED, following a Product Architect depth-and-granularity correction pass.
**This is one of six planned Unit 202 production acquisition domains.** The remaining ~197 requirements across the other five domains are not addressed here and are not claimed complete.

## Revision note

The Product Architect held the original acquisition's claim of 16 VERIFIED requirements and 17 learning points pending a targeted correction pass, because several requirements' evidence did not support the full breadth or depth implied by their name, and several learning points conflated multiple independently-diagnosable skills. This report reflects the corrected state after that pass. Full detail of every correction is in `EVIDENCE-RESULTS.json`'s `paDepthCorrectionNote` and each affected result's own `scopeNote`/`gaps` fields, and in `ACQUISITION-LOG.json`'s `paDepthCorrectionPass` record.

## Summary

| # | Requirement | Status | Source(s) |
|---|---|---|---|
| 1 | Fractions | VERIFIED (reused) | Anglia Ruskin University LibGuide |
| 2 | Percentages | VERIFIED | mathcentre 'Percentages' (two units: quick-reference + teach-yourself) |
| 3 | Algebra | VERIFIED | mathcentre 'Mathematical language', 'Expanding and removing brackets', 'Substitution & Formulae' (three sources) |
| 4 | Formula transposition | VERIFIED (reused, description corrected) | mathcentre, 'Transposition of formulae' |
| 5 | Positive indices | VERIFIED | mathcentre, 'Indices or Powers' |
| 6 | Negative indices | VERIFIED | mathcentre, 'Indices or Powers' (same document) |
| 7 | Standard/scientific notation | **PARTIALLY_VERIFIED** | NIST Guide to the SI, Ch.7 (coefficient bound not sourced) |
| 8 | Engineering notation | VERIFIED | NIST Guide to the SI, Ch.7 (same document) |
| 9 | Pythagoras | VERIFIED (extended) | mathcentre, Engineering Maths First Aid Kit §4.5 |
| 10 | Sine/cosine/tangent in right triangles | VERIFIED | mathcentre, 'Trigonometrical ratios in a right-angled triangle' |
| 11 | Statistical range | VERIFIED | NIST/SEMATECH e-Handbook §1.3.5.6 |
| 12 | Mean | VERIFIED | NIST/SEMATECH e-Handbook §1.3.5.1 |
| 13 | Median | VERIFIED | NIST/SEMATECH e-Handbook §1.3.5.1 (same document) |
| 14 | Mode | VERIFIED | NIST/SEMATECH e-Handbook §1.3.5.1 (same document) |
| 15 | Ordinary decimal arithmetic | VERIFIED (extended) | mathcentre 'Decimals' + OpenStax 'Prealgebra 2e' (LibreTexts) |
| 16 | Proportional reasoning | VERIFIED (extended) | mathcentre, 'Ratios' (fuller locator) |

**Totals: 15 VERIFIED · 1 PARTIALLY_VERIFIED · 0 SOURCE_GAP · 0 CONFLICTED.**

Two requirements (fractions, formula transposition) reuse already-reviewed pilot-002 evidence, corrected in description only where noted. The remaining 14 were freshly acquired or extended this session.

## What changed in the depth-correction pass

- **Ordinary decimal arithmetic:** added a second source (OpenStax 'Prealgebra 2e' via Mathematics LibreTexts) covering addition, subtraction, multiplication, and division of decimals — the original evidence covered only place value, powers-of-ten, and fraction conversion.
- **Percentages:** added a second mathcentre source covering "expressing one quantity as a percentage of another" (needed for efficiency-style calculations) — deliberately not extending into percentage change/reverse percentages, which the same new document also contains but which remain out of scope.
- **Proportional reasoning:** extended the locator on the already-cited 'Ratios' source to include its direct-proportion/unit-value-method content (pp.6-7), which was present but previously under-quoted. Inverse proportion remains explicitly excluded — no Unit 202 requirement in the full 213-item plan currently needs it.
- **Algebra:** added two sources (mathcentre 'Mathematical language' for variables/notation conventions; mathcentre 'Substitution & Formulae' for substitution and the BODMAS order-of-operations rule), alongside the original brackets/like-terms source. 'Constant' and 'coefficient' as named vocabulary remain unsourced this pass and are recorded honestly as a scoping gap.
- **Formula transposition:** corrected the description of v = u + at rearranged for t from "single-step"/"single operation" to "one or more inverse operations" (it genuinely requires two: subtract, then divide). No new source needed.
- **Standard/scientific notation:** downgraded from VERIFIED to **PARTIALLY_VERIFIED**. A capped search across this requirement's permitted authority classes did not find a source stating the precise "1 ≤ \|a\| < 10" coefficient convention; the NIST passage previously cited is actually about engineering-notation prefix selection, not standard form's general rule. The corresponding learning point is scoped to what is genuinely evidenced.
- **Pythagoras:** extended the locator on the already-cited source to include its second page, which contains worked examples for finding both the hypotenuse and a shorter side — the original evidence supported only the theorem statement, while the learning point's outcome already promised the full procedure.
- **Statistics:** the four requirements (mean, median, mode, range) each already had their own dedicated evidence requirement and source; only the *learning-point* inventory needed correction — split from one combined learning point into four independently diagnosable ones. No evidence change was needed for this item.
- **Application examples:** reviewed all `applicationTypes` across every learning point. Several silently assumed an electrical or mechanical relationship not yet acquired in this batch (Ohm's law, transformer turns ratio, potential-divider, impedance triangle, AC phase angle, power formula P=I²R, efficiency). These were replaced with neutral mathematical examples, or, where a formula was already itself evidenced by the cited source (e.g. v = u + at), with that same formula.

## Source reuse

**16 unique sources support 16 requirements** (up from 12 sources before this pass; 4 newly acquired, 2 extended in place, the remainder unchanged):

- **mathcentre, 'Indices or Powers'** supports both positive indices and negative indices (one document, two requirements).
- **NIST Guide to the SI, Chapter 7** supports both standard/scientific notation and engineering notation (one document, two requirements) — though standard/scientific notation's binding is now PARTIALLY_VERIFIED as noted above.
- **NIST/SEMATECH e-Handbook, §1.3.5.1 'Measures of Location'** supports mean, median, and mode together (one document, three requirements).
- **mathcentre, 'Ratios'** now supports proportional reasoning across its full breadth (ratio notation, sharing, and direct proportion) from a single already-cited document, previously under-quoted.
- 2 sources are reused, unchanged, from already-reviewed pilot-002 evidence (fractions; formula transposition, the latter with a corrected description).
- 4 sources are new this pass: OpenStax 'Prealgebra 2e' (decimal operations), a second mathcentre 'Percentages' unit (one quantity as a percentage of another), mathcentre 'Substitution & Formulae' (order of operations), and mathcentre 'Mathematical language' (variables/notation).

No requirement's evidence was weakened or generalised merely to enable source reuse or to preserve a VERIFIED status; where full depth was not sourced (standard/scientific notation), the status was corrected downward instead.

## Authority classes used

- **PRIMARY_NORMATIVE_OR_STANDARDS_BODY** (4 requirement-bindings): NIST, for standard/scientific notation (partial), engineering notation, mean/median/mode, and range.
- **ACADEMIC_OR_RESEARCH_INSTITUTION** (11 requirement-bindings, reuse counted once per document): mathcentre and Anglia Ruskin University.
- **AUTHORITATIVE_EDUCATIONAL_REFERENCE** (1 requirement-binding): OpenStax 'Prealgebra 2e' via Mathematics LibreTexts.

All sources fall within each requirement's own permitted authority-class list from the evidence-requirement plan.

## Depth discipline applied

- A mathcentre page on the **sine rule and cosine rule** (general, non-right-angled-triangle trigonometry) was retrieved but not used for the sine/cosine/tangent requirement — scoped to right-angled-triangle ratios (SOHCAHTOA) only, and finding an unknown angle (inverse trigonometric functions) is explicitly excluded pending evidence of a genuine Unit 202 need.
- Inverse proportion is explicitly excluded from proportional reasoning, pending evidence of a genuine Unit 202 need.
- Percentage change, reverse percentages, and compound percentage theory remain excluded from percentages, even though a newly-cited source also contains them.
- Decimal arithmetic is taught for conceptual understanding of decimal-point placement, not to mandate manual long-column algorithm mastery — calculator-supported computation is acceptable per the approved depth policy.
- "Constant" and "coefficient" as named algebra vocabulary are not claimed as evidenced; this is recorded honestly rather than papered over.

## Remaining gaps

**One:** standard/scientific notation's precise coefficient-bound convention (1 ≤ \|a\| < 10) is not sourced to a permitted-authority document — recorded as `PARTIALLY_VERIFIED`, not as evidence that no such source exists. A further targeted search (or a Product Architect-supplied lead) is needed to close this fully.

## What this batch does not do

- It does not acquire evidence for any of the other ~197 Unit 202 requirements (the other five production domains remain unstarted).
- It does not generate learner-facing lessons, storyboards, or assessment items — only a proposed learning-point inventory for Product Architect review (see `FOUNDATIONAL-MATHEMATICS-LEARNING-POINTS.{json,md}`).
- It does not claim Unit 202 acquisition is complete.
- It does not resolve the standard/scientific-notation coefficient-bound gap noted above.
