---
id: EVID-CC-09D
status: complete
owner: implementation-engineer
last_reviewed: 2026-08-22
---

# CC-09D — Unit 202 Official Public Assessment Calibration

The first real calibration of the CC-09C course-evidence architecture against genuine official public assessment material: the complete City & Guilds 2365-602 (Unit 202, Principles of Electrical Science) sample e-volve multiple-choice test.

> **Amendment (CC-09D.1, 2026-08-22):** `EL-REL-FLUX-CHANGE-EMF-001` (§D below) was narrowed from "the EMF induced in a **coil**" to "the EMF induced in a **single loop**" following Project Architect review -- the OpenStax source itself distinguishes single-loop (ε = -dΦ/dt, no turns factor) from N-turn-coil (ε = -N dΦ/dt) forms, and the original wording said "coil" while giving the single-loop expression. The correction matches both the formula actually given and AC5.4's own "single-loop generator" wording; no N-turn detail was introduced. §A/§D below are left as originally written for historical accuracy; see `PROJECT-STATUS.md` §CC-09D.1 for the full correction record.

## A. Source

| Field | Value |
|---|---|
| Title | "5357-003 Electrical Scientific Principles and Technologies / 2365-602 Principles of Electrical Science — Sample e-volve MC Test" (question paper) and its companion mark scheme (answer keys) |
| Publisher | City & Guilds |
| Edition | v1.0, August 2018 |
| Access date | 2026-08-22 |
| Question-paper URL | `https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/assessment_materials/sample_assessment/5357-and-2365-sample-papers-v1-0-pdf.ashx` — **this exact URL currently 404s on cityandguilds.com** (confirmed by direct HTTP inspection: it 302-redirects to `/page-not-found`). Retrieved instead via the Internet Archive Wayback Machine's own snapshot of the same URL, captured 2024-11-25 — the most recent available capture of the genuine official artefact, not a third-party mirror or reproduction. |
| Mark-scheme URL | `https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/assessment_materials/sample_assessment/5357-and-2365-sample-papers---mark-schemes-v1-0-pdf.pdf` — **still live**, fetched directly. |
| Content fingerprints (SHA-256) | Question paper: `96afeb0827ec1f39cc19249608bf0fbea9287e554f7b40a94979dcccf8da983c` (archived copy). Mark scheme: `0fba6fc4d2ad0f7662cc7068b184e815ddca4b17b3fa91f9772c058d62c770d7` (live copy). Both computed directly from the fetched bytes, never fabricated. |
| Compatibility/currency | The document's own title page states "August 2018 v1.0" with no later revision found. The still-live mark-scheme companion (same v1.0/August 2018) supports, without proving, that v1.0 remains the current sample-paper edition. The current qualification handbook (v1.12, April 2026, already governed as `SV_CG`) still specifies the identical Unit 602 assessment structure (90 minutes, 40 questions, closed book, non-programmable calculator, ~50% pass, LO allocation 2/5/7/15/7/4) this sample paper exhibits — an independent structural consistency check, not merely an assumption of compatibility. Recorded `status: CURRENT`, `verificationStatus: UNVERIFIED` per ADR-0002 (this session is the extracting/authoring model, never its own verifier). |
| Source role | `OFFICIAL_ASSESSMENT` (CC-09C's `sourceRoleSchema`) — registered in `cc04-unit202-electrical-science.ts` as `SRC_CG_602_SAMPLE_QUESTIONS` / `SRC_CG_602_SAMPLE_MARK_SCHEME`. **Zero `assertionProvenanceLinks` cite either source anywhere in the corpus** — by design: this evidence justifies curriculum-scope obligations (`basis: OFFICIAL_ASSESSMENT_EVIDENCE`), never factual entailment. |

## B. Sample structure

- 40 questions, single-best-answer 4-option multiple choice, matching the governed `AssessmentSpecification` (`unit202AssessmentSpecification`) exactly.
- Two diagram-dependent items (a pulley system, a series/parallel resistor-network diagram family used across several items) plus one waveform diagram.
- Per-Learning-Outcome item count, derived from mapping each of the 40 items to its LO by topic:

  | LO | Items in sample | Official weighting (`unit202-assessment-specification.ts`) | Match |
  |---|---|---|---|
  | LO1 (mathematical principles) | 2 | 2 questions / 5% | Exact |
  | LO2 (standard units) | 5 | 5 questions / 13% | Exact |
  | LO3 (basic mechanics) | 7 | 7 questions / 18% | Exact |
  | LO4 (resistance/D.C. circuits) | 15 | 15 questions / 37% | Exact |
  | LO5 (magnetism/A.C.) | 7 | 7 questions / 17% | Exact |
  | LO6 (electronic components) | 4 | 4 questions / 10% | Exact |

  This sample's own per-LO item distribution matches the already-governed official weighting **exactly**, item for item — strong corroborating evidence the governed `AssessmentSpecification` transcription (CC-09A) is correct, and that this sample is representative of the assessment's real structure rather than an unrepresentative outlier.

## C. Knowledge calibration

Every one of the 40 items was individually classified against the governed corpus. **37/40 confirmed existing coverage at the correct depth (`CONFIRMS_EXISTING`); 3/40 revealed a genuine, narrow calculation/unit-recognition gap (`REVEALS_POTENTIAL_GAP`); 0/40 revealed a mapping issue, formal-scope conflict, or handbook/SmartScreen disagreement.**

| Signal | Curriculum anchor | Existing corpus representation (before) | Action |
|---|---|---|---|
| Item testing impedance formula selection (Z = √(R²+X²) vs. plausible sign/operation/inversion distractors) | AC2.2, Range item "Impedance" | `EL-CONCEPT-IMPEDANCE-001` stated the qualitative concept and unit only — no governed formula | Added `EL-REL-IMPEDANCE-001` (new obligation `impedance-calculation`, basis `OFFICIAL_ASSESSMENT_EVIDENCE`) |
| Item testing the SI unit of magnetic flux density among real-but-wrong distractor units (weber, henry, farad) | AC5.2 | `EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001` stated the quantity but never named its SI unit (unlike every other electrical quantity in the corpus) | Added `EL-UNIT-TESLA-001` (new obligation `flux-density-unit`, basis `OFFICIAL_ASSESSMENT_EVIDENCE`); added `EL-UNIT-WEBER-001` alongside it (basis `NECESSARY_PREREQUISITE` — the natural paired-unit completion AC5.2's own EXPLICIT wording already implied, not itself assessment-evidenced) |
| Item testing calculation of flux change from a given induced EMF and time interval (quantitative Faraday's law, e = ΔΦ/Δt) | AC5.4 | `EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001` stated only the qualitative causal principle ("changing flux induces an EMF"); distinct from `EL-REL-INDUCED-EMF-001` (e = Blv, AC5.3's motional-EMF special case) | Added `EL-REL-FLUX-CHANGE-EMF-001` (new obligation `flux-change-emf-calculation`, basis `OFFICIAL_ASSESSMENT_EVIDENCE`) |

All other 37 items confirmed existing, already-governed knowledge at the correct depth — including, notably, the F=BIl force-on-conductor calculation (item 32), waveform periodic-time diagram interpretation (item 36), electrolysis/dissimilar-metal corrosion (item 29), and every LO4 D.C.-circuit series/parallel calculation item — all already governed via CC-09B.6's own corrections. No item required deepening an over-shallow assertion, narrowing an over-broad one, or reconciling a handbook/SmartScreen conflict.

Two low-confidence, **non-material** observations were identified and deliberately **not** acted on, to avoid the exact source-over-specificity pattern CC-09B.5 exists to prevent:

- One item (voltage drop and which cable conductors' resistance affects it) touches installation-practice detail arguably beyond AC4.7's "state what is meant by voltage drop" depth — judged out of proportionate scope, not added.
- One item (an amplifying-transistor / PIR-sensor security-alarm framing) uses a different worked example than CC-09B.6's officially-taught transistor/thyristor-latching example — both are valid; the existing governed knowledge (generic transistor amplification property + security-alarm application context) already supports it without a new assertion.

## D. Corpus deltas

- **Assertions added (4)**: `EL-REL-IMPEDANCE-001`, `EL-UNIT-WEBER-001`, `EL-UNIT-TESLA-001`, `EL-REL-FLUX-CHANGE-EMF-001`. Total: 254 → **258**.
- **Assertions reused (all 37 `CONFIRMS_EXISTING` items)**: no new assertion authored; existing assertions/capabilities already cover the demonstrated knowledge.
- **Assertions modified**: none — no existing assertion's statement, provenance, or curriculum mapping was changed.
- **Obligations added (3)**: `impedance-calculation` (AC2.2), `flux-density-unit` (AC5.2), `flux-change-emf-calculation` (AC5.4) — all `basis: OFFICIAL_ASSESSMENT_EVIDENCE`, the first genuine use of this basis value since it was reserved (CC-09B.6). One additional obligation, `flux-unit` (AC5.2, `basis: NECESSARY_PREREQUISITE`), added for the paired Weber unit.
- **Mappings added**: 4 new `assertionCurriculumMappings` (`REQUIRED_FOR`), one per new assertion, onto AC2.2/AC5.2×2/AC5.4.
- **Capabilities/families affected**: no new assertion family; all 4 new assertions joined existing families (`electrical.ac_reactive_quantities`, `electrical.magnetism_and_electromagnetism` ×2, `electrical.emf_and_generation`) as new memberships. No new capability, question blueprint, lesson, or diagram blueprint.
- **Misconceptions**: none affected.
- **No-change confirmations**: 37/40 sample items, 23/23 ACs, 58/58 Range items, all pre-existing entailment/scope classifications.

## E. Assessment-pattern profile (observed, this one sample only — see §F)

- **Cognitive demand** (dominant operation per item, all 40 classified): RECALL/IDENTIFY ~15/40; APPLY (interpret a diagram/statement) ~8/40; CALCULATE_SINGLE_STEP ~9/40; CALCULATE_MULTI_STEP ~8/40. Roughly 40–45% of items require a genuine numeric calculation, consistent with the closed-book/non-programmable-calculator format already governed.
- **Calculation depth**: predominantly `DIRECT_SUBSTITUTION` or `SINGLE_TRANSFORMATION` (e.g. Pythagoras, motor efficiency, resistivity-length scaling, series voltage-divider); a smaller number are genuinely `MULTI_STEP` (e.g. pulley mechanical-advantage-then-weight, power-from-mass-height-time). No item required more than two chained calculation stages.
- **Visual/diagram use**: 5/40 items depend on a diagram (a pulley system; three resistor-network circuit diagrams reused across several LO4 items; one sine-wave diagram). Diagram roles observed: mechanical arrangement, circuit topology, waveform interpretation — all already representable by the existing governed visual/diagram-blueprint architecture; no new visual capability gap identified.
- **Terminology**: consistently uses the same vocational-trade terminology the corpus already governs (e.g. "impedance", "reactance", "EMF", "flux density") rather than more formal physics phrasing — no terminology mismatch found.
- **Distractor/misconception patterns observed** (derived signal only, no option text retained): wrong-formula-operation (e.g. addition vs. Pythagorean combination), inverted/reciprocal relationships, plausible-but-wrong named component/unit substitutions (e.g. weber offered as a flux-density-unit distractor for the correct answer tesla). None of these met the corpus's own bar for a new/updated misconception (task section 16: must be pedagogically reusable, statable independently of the question, not source-specific wording) — all are generic, already-anticipated error classes, not distinct enough to warrant a new governed misconception record.
- **Contextualisation**: mixed — some items are abstract (bare circuit/formula questions), others lightly scenario-framed (a security-alarm PIR context, a remote-control context) — consistent with the existing corpus's own mix.

## F. Limitations

- This is **one** official sample (40 items). It is strong positive evidence of assessability, depth and style — not an exhaustive question bank, and not proof of the live exam's exact item-level composition on any given sitting.
- Absence of a topic from this sample is **not** treated as exclusion evidence anywhere in this package (mechanically enforced — see `report-coverage-matrix.test.ts`'s CC-09D describe block, and the pre-existing CC-09C `ScopeStatus`/`OUT_OF_SCOPE` invariant, both unchanged and re-confirmed).
- The observed cognitive-demand/calculation-depth/distractor-pattern profile in §E is this sample's own observed pattern, not asserted as a normative or permanent characteristic of every future 2365-602 sitting. A future additional sample should be layered onto this evidence, never silently overwrite it.
- The question-paper source artefact itself is currently unreachable at its live cityandguilds.com URL (a 404) and was retrieved via the Wayback Machine's most recent capture instead — a real, honestly-recorded currency caveat (§A), not a defect concealed from this report.

## G. Release-confidence result

**Unchanged: `GOOD`, `releaseReady: true`, 0 `MATERIAL` unresolved uncertainty** (before and after this package — mechanically recomputed via `npm run coverage:matrix:check`). The three narrow gaps this calibration found were closed with independently-sourced, proportionate assertions before recomputation, so no new material uncertainty was introduced. `HIGH` remains unreached for the same pre-existing reason recorded in ADR-0003 (independent source verification, per ADR-0002, has not yet happened at scale) — this calibration neither improves nor worsens that.

## H. Follow-on implications

- **Question-blueprint work**: no blueprint change required by this package. The impedance-formula and flux-change-EMF calculation capabilities are now governed facts; authoring original question blueprints exercising them (never copying the sample's own items) is a legitimate future task, not started here.
- **Lesson media**: the sample's diagram use (pulley systems, circuit-topology diagrams, waveform diagrams) is already within the existing governed visual architecture's scope; no new visual-governance gap was found.
- **Representative mini-unit**: this package found the 258-assertion corpus survives a complete official-sample calibration with only minor, easily-closed gaps — supporting evidence (not a decision) that the corpus is in a reasonable state for the deferred representative 5–10 lesson mini-unit to build on.
- **Future assessment calibration**: if/when a second official sample (a different version, or an official examiner/qualification report) becomes available, it should be layered onto this evidence via the same `OFFICIAL_ASSESSMENT`/`OFFICIAL_ASSESSMENT_EVIDENCE` seam, never replacing this package's findings.

## Practice vs. public-mock implications (kept explicitly separate, task section 47)

- **Practice-question implications** (future, not built here): targeted diagnostic items for impedance-formula selection, flux-density-unit recall, and flux-change EMF calculation now have governed knowledge to draw on; short skill-check items exercising the newly-confirmed calculation capabilities would be legitimate future authoring targets.
- **Public-mock implications** (future, not built here): the confirmed exact 2/5/7/15/7/4 LO weighting match, the ~40–45% calculation-item ratio, the ~12.5% diagram-dependent-item ratio, and the observed single-/two-step calculation depth ceiling are all useful future inputs to a deterministic mock-paper assembler (`AssessmentBlueprint`, still deferred, per CC-09A) — using only original, independently-authored questions and diagrams, never this sample's own content.
