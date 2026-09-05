# Foundational Mathematics — Accepted Learning-Point Inventory

**Status:** Accepted by the Product Architect. This is a curriculum-review artifact, not finished lesson prose — no full lessons, storyboards, assessment questions, or app content have been generated.

**Revision note:** this inventory previously underwent a corrected revision following Product Architect review, which held the original 16 VERIFIED / 17-learning-point claim pending a depth-and-granularity correction pass. Eight learning points were added, none were removed, and several were corrected in wording, depth, or application example. IDs were renumbered at that time to reflect the corrected instructional sequence. See `PROJECT-STATUS.md` and `EVIDENCE-RESULTS.json`'s `paDepthCorrectionNote` for the full disposition of that pass.

**Closure note (this revision):** the Product Architect accepted the corrected 25-learning-point inventory in principle. `FM-LP-18` (standard/scientific form) was held only for an internal inconsistency (evidence `PARTIALLY_VERIFIED` while marked `READY`, with its outcome inferring the convention from examples). That inconsistency is now closed with a Product-Architect-supplied source and a narrow authority-policy adjudication (see `EVIDENCE-RESULTS.json`'s `paAuthorityPolicyAdjudication`). All 25 learning points are now accepted and `READY`. Two prerequisite corrections were also applied (see "Learning points by group" below) without renumbering anything — IDs `FM-LP-01` through `FM-LP-25` are now frozen; see "Identity policy" below.

**Total learning points: 25**, covering all 16 foundational-mathematics evidence requirements (batch 01 of six planned Unit 202 production domains).

## Proposed instructional sequence

Sequenced pedagogically (numbers/fractions/decimals/percentages/ratio → basic algebra and indices → formula transposition → notation → geometry/trigonometry → statistics), not alphabetically.

| Order | ID | Title | Learner outcome | Prerequisites | Evidence status |
|---|---|---|---|---|---|
| 1 | FM-LP-01 | Equivalent fractions and simplifying | Recognise equivalent fractions and simplify to lowest terms | — | READY |
| 2 | FM-LP-02 | The four operations on fractions | Add, subtract, multiply, and divide fractions | FM-LP-01 | READY |
| 3 | FM-LP-03 | Decimal place value and powers of ten | State place value and multiply/divide decimals by powers of ten | — | READY |
| 4 | FM-LP-04 | Adding, subtracting, multiplying and dividing decimals **(NEW)** | Calculate with decimals using all four operations | FM-LP-03 | READY |
| 5 | FM-LP-05 | Converting fractions, decimals, percentages | Convert a value between the three forms | FM-LP-01, FM-LP-03 | READY |
| 6 | FM-LP-06 | Finding a percentage of a quantity | Explain a percentage and calculate x% of a quantity | FM-LP-05 | READY |
| 7 | FM-LP-07 | Expressing one quantity as a percentage of another **(NEW)** | Express one quantity as a percentage of another | FM-LP-05 | READY |
| 8 | FM-LP-08 | Ratio notation and simplifying ratios | Express a comparison as a ratio and simplify it | FM-LP-01 | READY |
| 9 | FM-LP-09 | Sharing a quantity in a given ratio | Divide a quantity into parts by a given ratio | FM-LP-08 | READY |
| 10 | FM-LP-10 | Direct proportion: scaling and the unit-value method **(NEW)** | Scale a quantity in direct proportion using a unit value | FM-LP-08 | READY |
| 11 | FM-LP-11 | Algebraic notation: variables and reading conventional notation **(NEW)** | Explain what a variable is and read algebraic notation | — | READY |
| 12 | FM-LP-12 | Expanding a single bracket and collecting like terms | Expand a bracket and collect like terms | FM-LP-11 | READY |
| 13 | FM-LP-13 | Substituting into a formula and evaluating with order of operations **(NEW)** | Substitute values into a formula and evaluate correctly | FM-LP-11 | READY |
| 14 | FM-LP-14 | Laws of indices (positive powers) | State and apply the laws of indices | FM-LP-11 | READY |
| 15 | FM-LP-15 | Negative indices | Interpret a negative index as a reciprocal power | FM-LP-14 | READY |
| 16 | FM-LP-16 | Rearranging a simple formula (one or more inverse operations) | Rearrange a simple formula for a stated variable | FM-LP-13 | READY |
| 17 | FM-LP-17 | Rearranging formulae involving squares/roots | Rearrange a formula involving squares/square roots | FM-LP-16, FM-LP-14 | READY |
| 18 | FM-LP-18 | Standard (scientific) form | Write/interpret a number in standard form (a × 10^n, coefficient magnitude 1 to 10) | FM-LP-14, FM-LP-15 | READY |
| 19 | FM-LP-19 | Engineering notation and SI prefixes | Write a number in engineering notation with the correct prefix | FM-LP-18 | READY |
| 20 | FM-LP-20 | Pythagoras' theorem | State and apply c² = a² + b², including finding a shorter side | FM-LP-14 | READY |
| 21 | FM-LP-21 | Sine, cosine, tangent (SOHCAHTOA) | State and apply the trig ratios to find an unknown side | FM-LP-20 | READY |
| 22 | FM-LP-22 | Arithmetic mean **(split from old FM-LP-17)** | Calculate the mean of a small data set | FM-LP-04 | READY |
| 23 | FM-LP-23 | Median **(split)** | Find the median of a small data set | FM-LP-04 | READY |
| 24 | FM-LP-24 | Mode **(split)** | Find the mode of a small data set | — | READY |
| 25 | FM-LP-25 | Range **(split)** | Calculate the range of a small data set | FM-LP-04 | READY |

**All 25 learning points are READY and accepted. None are HELD.**

## Foundational prerequisites for later electrical calculations

The following learning points are flagged as directly foundational for Unit 202's electrical/engineering calculations later in the syllabus (formula rearrangements, unit-prefixed quantities, ratio/proportion-based calculations, and squared-term power formulae):

- **FM-LP-16 / FM-LP-17** (formula transposition) — the reused foundational procedure behind Ohm's law and other Unit 202 formula rearrangements, once those relationships are themselves acquired.
- **FM-LP-18 / FM-LP-19** (standard form / engineering notation) — needed to read and write quantities in mA, kΩ, MHz, etc.
- **FM-LP-14 / FM-LP-15** (indices) — needed for squared-term formulae and engineering-notation exponents.
- **FM-LP-01 / FM-LP-02** (fractions) — needed for parallel-resistance-style formulae (1/R = 1/R₁ + 1/R₂).
- **FM-LP-08 / FM-LP-09 / FM-LP-10** (ratio, sharing, and direct proportion) — needed for ratio- and proportion-based calculations later in Unit 202.

## Learning points by group

### Numbers, decimals, percentages, ratio and proportion (FM-LP-01 to FM-LP-10)

- **FM-LP-01 — Equivalent fractions and simplifying.** *Learner will be able to:* recognise equivalent fractions and simplify a fraction to lowest terms. *Exclusions:* algebraic fractions, continued fractions. *Application:* simplify 6/8.
- **FM-LP-02 — The four operations on fractions.** *Learner will be able to:* add, subtract, multiply, and divide fractions. *Exclusions:* algebraic fraction manipulation. *Application:* add 1/4 + 1/6.
- **FM-LP-03 — Decimal place value and powers of ten.** *Learner will be able to:* state place value and multiply/divide a decimal by a power of ten by shifting the decimal point. *Exclusions:* manual column-arithmetic algorithms (assumed prior knowledge). *Application:* convert 0.075 A to mA.
- **FM-LP-04 — Adding, subtracting, multiplying and dividing decimals (NEW).** *Learner will be able to:* calculate with decimal quantities using all four operations. *Depth note:* calculator-supported computation is acceptable; the procedure is taught for conceptual understanding of decimal-point placement, not as a mandate for manual column-algorithm mastery. *Exclusions:* manual long-column arithmetic as an assessed skill in itself. *Application:* add the measured lengths of several cable offcuts given to two decimal places.
- **FM-LP-05 — Converting fractions, decimals, percentages.** *Learner will be able to:* convert a value between the three forms. *Exclusions:* proof of irrationality. *Application:* express 3/8 as a decimal and a percentage.
- **FM-LP-06 — Finding a percentage of a quantity.** *Learner will be able to:* explain what a percentage is and calculate x% of a quantity. *Exclusions:* compound/repeated percentage change, reverse percentages. *Application:* calculate 15% of a batch of 240 components.
- **FM-LP-07 — Expressing one quantity as a percentage of another (NEW).** *Learner will be able to:* express one quantity as a percentage of another. *Exclusions:* percentage change, reverse percentages, compound percentage theory. *Application:* express 18 out of 20 correct answers as a percentage.
- **FM-LP-08 — Ratio notation and simplifying ratios.** *Learner will be able to:* express a comparison as a ratio (colon notation) and simplify it. *Exclusions:* inverse proportion. *Application:* simplify a paint-mixing ratio, e.g. 250 ml to 50 ml.
- **FM-LP-09 — Sharing a quantity in a given ratio.** *Learner will be able to:* divide a quantity into parts according to a given ratio. *Exclusions:* inverse proportion, rates of change. *Application:* share a 12 m cable length between three work packages in the ratio 3:2:1.
- **FM-LP-10 — Direct proportion: scaling and the unit-value method (NEW).** *Learner will be able to:* scale a quantity in direct proportion using a unit value, and apply a known ratio/proportional relationship to find an unknown. *Prerequisite (corrected this revision):* requires only FM-LP-08 (ratio notation) — sharing a quantity in a given ratio (FM-LP-09) is a sibling application of proportional reasoning, not a prerequisite for scaling. *Exclusions:* inverse proportion (no Unit 202 requirement currently identified as needing it — explicit decision, revisit if the mechanics-and-machines batch surfaces a need). *Application:* find the cost of 8 fixings given the cost of 5, using the unit-value method.

### Basic algebra (FM-LP-11 to FM-LP-13)

- **FM-LP-11 — Algebraic notation: variables and reading conventional notation (NEW).** *Learner will be able to:* explain what a variable is and read conventional algebraic notation (implicit multiplication, superscript powers). *Exclusions (deliberate depth decision):* named vocabulary for "constant"/"coefficient" — not required unless those terms themselves appear as assessed Unit 202 qualification knowledge, which none currently do; the underlying ideas are taught operationally (e.g. 5a). *Application:* read and interpret an expression such as 5a + 3.
- **FM-LP-12 — Expanding a single bracket and collecting like terms.** *Learner will be able to:* expand an expression with one bracket and simplify by collecting like terms. *Exclusions:* solving equations, factorising, quadratics, simultaneous equations, expanding a product of two brackets. *Application:* simplify 5 + 2(x+1).
- **FM-LP-13 — Substituting into a formula and evaluating with order of operations (NEW).** *Learner will be able to:* substitute values into a formula and evaluate using the correct order of operations (BODMAS). *Exclusions:* solving for an unknown that isn't already isolated (that's formula transposition). *Application:* substitute values into s = ut + ½at² and evaluate correctly.

### Formula transposition (FM-LP-16 to FM-LP-17)

- **FM-LP-16 — Rearranging a simple formula (corrected).** *Learner will be able to:* rearrange a simple linear formula for a stated variable using one or more inverse operations. *Correction:* v = u + at rearranged for t needs TWO inverse operations (subtract, then divide), not one — corrected from an earlier "single-step" description. *Exclusions:* simultaneous equations, quadratics, proof. *Application:* rearrange v = u + at for t.
- **FM-LP-17 — Rearranging formulae involving squares/roots.** *Learner will be able to:* rearrange a formula with a squared term or square root. *Exclusions:* simultaneous equations, quadratic-formula methods, complex numbers. *Application:* rearrange a squared-term formula for an unknown base value.

### Number notation for engineering (FM-LP-18 to FM-LP-19)

- **FM-LP-18 — Standard (scientific) form (closed this revision).** *Learner will be able to:* write a number in the form a × 10^n, where for a non-zero value 1 ≤ \|a\| < 10 and n is an integer, using the decimal-point-moving procedure (move the decimal point so the coefficient is between 1 and 10; the number of places moved gives \|n\|; the direction moved gives its sign), and interpret a number already given in that form. *Closure:* the precise convention is now sourced to OpenStax *Prealgebra 2e* §10.5, closing the prior `PARTIALLY_VERIFIED` inconsistency — see "Evidence closure" below. *Application:* write 4,700,000 Ω in standard form.
- **FM-LP-19 — Engineering notation and SI prefixes.** *Learner will be able to:* write a number in engineering notation (exponent a multiple of 3) and relate it to the correct SI prefix. This requirement's convention IS fully and explicitly stated by its source, so it remains fully `VERIFIED`. *Application:* express 0.000068 A as 68 µA.

### Right-angled-triangle geometry and trigonometry (FM-LP-20 to FM-LP-21)

- **FM-LP-20 — Pythagoras' theorem (extended).** *Learner will be able to:* state and apply c² = a² + b², including finding the hypotenuse AND rearranging to find a shorter side. *Correction:* the worked procedure for finding a shorter side is now evidenced (was previously only the theorem statement). *Exclusions:* proof, non-right-angled geometry, 3D Pythagoras. *Application:* find the diagonal brace needed for a rectangular frame.
- **FM-LP-21 — Sine, cosine, tangent (SOHCAHTOA).** *Learner will be able to:* state the three ratios and use the correct one to find an unknown SIDE given one side and one angle. *Explicit exclusion decision:* finding an unknown angle via inverse trigonometric functions is excluded — no requirement in the full 213-item Unit 202 evidence-requirement plan was found naming phase angle, power factor, or an unknown-angle calculation; revisit if the electromagnetism/AC-theory batch surfaces a need. *Application:* find the height gained by a ramp of known length and angle.

### Statistics (FM-LP-22 to FM-LP-25)

- **FM-LP-22 — Arithmetic mean (split).** *Learner will be able to:* calculate the mean of a small, ungrouped data set. *Application:* calculate the mean of repeated instrument readings.
- **FM-LP-23 — Median (split).** *Learner will be able to:* find the median of a small, ungrouped data set. *Application:* find the median of repeated instrument readings.
- **FM-LP-24 — Mode (split).** *Learner will be able to:* find the mode of a small, ungrouped data set. *Prerequisite (corrected this revision):* none — finding the mode is a frequency count only and requires no addition, subtraction, or division, unlike mean, median, and range (which retain FM-LP-04 because their procedures may require those decimal operations). *Application:* find the mode of repeated instrument readings.
- **FM-LP-25 — Range (split).** *Learner will be able to:* calculate the range of a small, ungrouped data set. *Application:* calculate the range of repeated instrument readings.
- **Design note:** these four were previously one combined learning point (mean/median/mode/range together). They are split here so the adaptive model can identify which specific calculation or concept a learner has misunderstood; they may still be taught together in one lesson.

## Coverage matrix — every requirement maps to at least one learning point

| Evidence requirement | Learning point(s) |
|---|---|
| Fractions | FM-LP-01, FM-LP-02, FM-LP-05 |
| Percentages | FM-LP-05, FM-LP-06, FM-LP-07 |
| Algebra | FM-LP-11, FM-LP-12, FM-LP-13 |
| Formula transposition | FM-LP-16, FM-LP-17 |
| Positive indices | FM-LP-14 |
| Negative indices | FM-LP-15 |
| Standard/scientific notation | FM-LP-18 |
| Engineering notation | FM-LP-19 |
| Pythagoras | FM-LP-20 |
| Sine/cosine/tangent | FM-LP-21 |
| Statistical range | FM-LP-25 |
| Mean | FM-LP-22 |
| Median | FM-LP-23 |
| Mode | FM-LP-24 |
| Ordinary decimal arithmetic | FM-LP-03, FM-LP-04, FM-LP-05 |
| Proportional reasoning | FM-LP-08, FM-LP-09, FM-LP-10 |

No orphaned learning points: every one of the 25 traces to at least one evidence-requirement claim recorded in `EVIDENCE-RESULTS.json`.

## Held learning points

None. Every learning point is `READY` and accepted.

## Evidence closure: FM-LP-18 (standard/scientific form)

In the prior depth-correction pass, this learning point's core skill was evidenced by example, but its underlying evidence requirement (`standard-scientific-notation::SYMBOL_OR_CONVENTION`) was recorded as `PARTIALLY_VERIFIED`, not `VERIFIED`, because no source within the requirement's then-permitted authority classes stated the precise convention that the coefficient's magnitude must satisfy 1 ≤ \|a\| < 10. This inconsistency (evidence `PARTIALLY_VERIFIED` while the learning point was marked `READY`) is now closed: the Product Architect supplied OpenStax *Prealgebra 2e* §10.5 "Integer Exponents and Scientific Notation" directly, together with a narrow authority-policy adjudication approving `AUTHORITATIVE_EDUCATIONAL_REFERENCE` for this one binding (see `EVIDENCE-RESULTS.json`'s `paAuthorityPolicyAdjudication` field for the full record — it does not broaden authority policy for any other requirement). The requirement is restored to `VERIFIED`, and `FM-LP-18`'s outcome and procedure now state the exact convention rather than inferring it from illustrative examples.

## Identity policy (frozen from this revision)

`FM-LP-01` through `FM-LP-25` are now the **approved Batch 01 learning-point identity baseline**. Future revisions to this inventory must:

1. **Preserve every existing ID exactly** — an ID is never reassigned to a different learning point.
2. **Append new IDs** (`FM-LP-26` onward) for genuinely new learning points, rather than inserting into the existing numeric sequence.
3. **Deprecate rather than silently reuse** a removed ID — if a learning point is retired, its ID is recorded as deprecated (see `deprecatedLearningPointIds` in the JSON), not recycled.
4. **Never renumber** the inventory merely because the taught/instructional sequence changes.

Instructional order is tracked separately via the `instructionalSequence` field, which may be freely reordered without affecting any learning point's stable `id`.
