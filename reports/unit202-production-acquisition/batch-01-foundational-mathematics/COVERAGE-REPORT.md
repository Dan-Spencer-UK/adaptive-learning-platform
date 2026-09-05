# Unit 202 Production Acquisition — Batch 01: Foundational Mathematics

**Domain:** foundational-mathematics (16 of Unit 202's 213 evidence requirements)
**Status:** All 16 requirements VERIFIED. Accepted by the Product Architect.
**This is one of six planned Unit 202 production acquisition domains.** The remaining ~197 requirements across the other five domains are not addressed here and are not claimed complete.

## Revision history

1. **Original acquisition:** 16 VERIFIED requirements, 17 proposed learning points.
2. **Depth-and-granularity correction pass:** the Product Architect held that claim pending correction, because several requirements' evidence did not support the full breadth or depth implied by their name, and several learning points conflated multiple independently-diagnosable skills. Resulted in 15 VERIFIED / 1 PARTIALLY_VERIFIED (standard-scientific-notation) and 25 learning points. Full detail in `EVIDENCE-RESULTS.json`'s `paDepthCorrectionNote` and `ACQUISITION-LOG.json`'s `paDepthCorrectionPass` record.
3. **Closure pass (this revision):** the Product Architect accepted the corrected inventory in principle and closed the one remaining inconsistency -- standard-scientific-notation's evidence was `PARTIALLY_VERIFIED` while its learning point (`FM-LP-18`) was marked `READY`. Closed with a Product-Architect-supplied source and a narrow authority-policy adjudication. Two minor prerequisite corrections were also applied. See `EVIDENCE-RESULTS.json`'s `paClosureNote` and `paAuthorityPolicyAdjudication`, and `ACQUISITION-LOG.json`'s `paClosurePass` record.

## Summary

| # | Requirement | Status | Source(s) |
|---|---|---|---|
| 1 | Fractions | VERIFIED (reused) | Anglia Ruskin University LibGuide |
| 2 | Percentages | VERIFIED | mathcentre 'Percentages' (two units: quick-reference + teach-yourself) |
| 3 | Algebra | VERIFIED | mathcentre 'Mathematical language', 'Expanding and removing brackets', 'Substitution & Formulae' (three sources) |
| 4 | Formula transposition | VERIFIED (reused, description corrected) | mathcentre, 'Transposition of formulae' |
| 5 | Positive indices | VERIFIED | mathcentre, 'Indices or Powers' |
| 6 | Negative indices | VERIFIED | mathcentre, 'Indices or Powers' (same document) |
| 7 | Standard/scientific notation | VERIFIED (closed this revision) | NIST Guide to the SI Ch.7 (context) + OpenStax 'Prealgebra 2e' §10.5 (defining convention) |
| 8 | Engineering notation | VERIFIED | NIST Guide to the SI, Ch.7 (same document) |
| 9 | Pythagoras | VERIFIED (extended) | mathcentre, Engineering Maths First Aid Kit §4.5 |
| 10 | Sine/cosine/tangent in right triangles | VERIFIED | mathcentre, 'Trigonometrical ratios in a right-angled triangle' |
| 11 | Statistical range | VERIFIED | NIST/SEMATECH e-Handbook §1.3.5.6 |
| 12 | Mean | VERIFIED | NIST/SEMATECH e-Handbook §1.3.5.1 |
| 13 | Median | VERIFIED | NIST/SEMATECH e-Handbook §1.3.5.1 (same document) |
| 14 | Mode | VERIFIED | NIST/SEMATECH e-Handbook §1.3.5.1 (same document) |
| 15 | Ordinary decimal arithmetic | VERIFIED (extended) | mathcentre 'Decimals' + OpenStax 'Prealgebra 2e' (LibreTexts) |
| 16 | Proportional reasoning | VERIFIED (extended) | mathcentre, 'Ratios' (fuller locator) |

**Totals: 16 VERIFIED · 0 PARTIALLY_VERIFIED · 0 SOURCE_GAP · 0 CONFLICTED.**

Two requirements (fractions, formula transposition) reuse already-reviewed pilot-002 evidence, corrected in description only where noted.

## What changed in this closure pass

- **Standard/scientific notation:** restored from `PARTIALLY_VERIFIED` to **`VERIFIED`**. The Product Architect supplied OpenStax 'Prealgebra 2e' §10.5 "Integer Exponents and Scientific Notation" directly (no further source search was performed or required), which states the exact convention: `a x 10^n`, where for a non-zero number `1 <= |a| < 10` and `n` is an integer, and the decimal-point-moving procedure that determines the exponent. The NIST Chapter 7 passage previously cited is retained as supporting context only (it is properly about engineering-notation prefix selection), and the new source is bound as the requirement's defining evidence.
- **Authority-policy adjudication (narrow, batch-scoped):** the generic `SYMBOL_OR_CONVENTION` authority-class list (`PRIMARY_NORMATIVE_OR_STANDARDS_BODY`, `PROFESSIONAL_BODY`, `AUTHORITATIVE_TECHNICAL_REFERENCE`) is mode-based, built for engineering/measurement conventions, and excludes `AUTHORITATIVE_EDUCATIONAL_REFERENCE`. Applied unmodified to a foundational *mathematics* teaching convention, it produced a false source gap despite an authoritative, peer-reviewed OpenStax textbook stating the rule directly. The Product Architect explicitly approved `AUTHORITATIVE_EDUCATIONAL_REFERENCE` for this **one** requirement binding only. OpenStax is classified honestly as `AUTHORITATIVE_EDUCATIONAL_REFERENCE` -- not disguised as a standards body or any other class. This adjudication does **not** modify the generic evidence-acquisition planner, does **not** broaden authority policy for engineering-notation or any other `SYMBOL_OR_CONVENTION` requirement in this or any other batch, and does **not** touch the frozen preflight artifacts under `reports/backtests/unit202-evidence-acquisition-preflight/`. Full record: `EVIDENCE-RESULTS.json`'s `paAuthorityPolicyAdjudication` field (id `CC-BATCH01-PA-AUTHORITY-ADJUDICATION-001`).
- **Algebra depth decision confirmed:** the absence of named vocabulary for "constant" and "coefficient" is now recorded as a **deliberate depth exclusion**, not an unresolved evidence gap -- those terms are not required unless they themselves appear as assessed Unit 202 qualification knowledge, which none currently do. The algebra requirement remains `VERIFIED` (no evidence change was needed for this item).
- **Prerequisite corrections (learning-point inventory only, no evidence change):** `FM-LP-10` (direct proportion) now requires only `FM-LP-08` (ratio notation), not `FM-LP-09` (sharing in a ratio) -- sharing is a sibling application of proportional reasoning, not a prerequisite for scaling. `FM-LP-24` (mode) now has no learning-point prerequisite -- finding the mode is a frequency count only and needs no addition/subtraction/division, unlike mean, median, and range, which retain `FM-LP-04`.
- **Learning-point identities frozen:** `FM-LP-01` through `FM-LP-25` are now the approved Batch 01 identity baseline. No IDs were renumbered in this pass; see `FOUNDATIONAL-MATHEMATICS-LEARNING-POINTS.json`'s `identityFreezePolicy` field for the governing policy on future revisions.

## Source reuse

**17 unique sources support 16 requirements** (up from 16 before this pass; 1 newly acquired this closure):

- **mathcentre, 'Indices or Powers'** supports both positive indices and negative indices (one document, two requirements).
- **OpenStax 'Prealgebra 2e'** now appears twice in this batch: §5.3 for decimal operations (added in the prior pass) and §10.5 for the scientific-notation convention (added this closure pass) -- two different sections of the same open-education textbook series, cited separately as distinct sources.
- **NIST/SEMATECH e-Handbook, §1.3.5.1 'Measures of Location'** supports mean, median, and mode together (one document, three requirements).
- **mathcentre, 'Ratios'** supports proportional reasoning across its full breadth (ratio notation, sharing, and direct proportion) from a single already-cited document.
- 2 sources are reused, unchanged, from already-reviewed pilot-002 evidence (fractions; formula transposition, the latter with a corrected description).

No requirement's evidence was weakened or generalised merely to enable source reuse or to preserve a `VERIFIED` status.

## Authority classes used

- **PRIMARY_NORMATIVE_OR_STANDARDS_BODY** (3 requirement-bindings): NIST, for engineering notation, mean/median/mode, and range (standard-scientific-notation's NIST binding is now supporting context, not the defining source).
- **ACADEMIC_OR_RESEARCH_INSTITUTION** (11 requirement-bindings, reuse counted once per document): mathcentre and Anglia Ruskin University.
- **AUTHORITATIVE_EDUCATIONAL_REFERENCE** (2 requirement-bindings): OpenStax 'Prealgebra 2e' -- §5.3 for ordinary decimal arithmetic, §10.5 for standard/scientific notation (the latter via the narrow authority-policy adjudication described above).

All sources fall within each requirement's own permitted authority-class list, with the one narrow, explicitly-recorded adjudication noted above.

## Depth discipline applied

- A mathcentre page on the **sine rule and cosine rule** (general, non-right-angled-triangle trigonometry) was retrieved but not used for the sine/cosine/tangent requirement -- scoped to right-angled-triangle ratios (SOHCAHTOA) only, and finding an unknown angle (inverse trigonometric functions) is explicitly excluded pending evidence of a genuine Unit 202 need.
- Inverse proportion is explicitly excluded from proportional reasoning, pending evidence of a genuine Unit 202 need.
- Percentage change, reverse percentages, and compound percentage theory remain excluded from percentages, even though a cited source also contains them.
- Decimal arithmetic is taught for conceptual understanding of decimal-point placement, not to mandate manual long-column algorithm mastery -- calculator-supported computation is acceptable per the approved depth policy.
- "Constant" and "coefficient" as named algebra vocabulary are a deliberate depth exclusion, not required unless assessed as qualification knowledge.

## Remaining gaps

None. All 16 requirements are `VERIFIED`.

## What this batch does not do

- It does not acquire evidence for any of the other ~197 Unit 202 requirements (the other five production domains remain unstarted).
- It does not generate learner-facing lessons, storyboards, or assessment items -- only an accepted learning-point inventory (see `FOUNDATIONAL-MATHEMATICS-LEARNING-POINTS.{json,md}`).
- It does not claim Unit 202 acquisition is complete.
- It does not begin Batch 02 or modify any generic acquisition infrastructure or the frozen preflight artifacts.
