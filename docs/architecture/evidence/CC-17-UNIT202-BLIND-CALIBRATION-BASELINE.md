# CC-17 — Unit 202 Blind Calibration Baseline: Project-Architect Review Export

**Status:** export complete, review-ready. This is a **blind reconstruction**, produced *before* the Project Architect compares it against the Product Owner's private City & Guilds Unit 202 teaching material. It makes no final scope classification, corrects no curriculum content, and changes no governed matrix, obligation, assertion, lesson, storyboard, source-acquisition-manifest, technical-source-verification, or visual asset. The Project Architect performs the actual calibration comparison manually, later, using this document and the two machine-readable exports (§2) as the "what would ALP conclude without your material" side of that comparison.

**Authority boundary:** no row in this export asserts that the Product Owner's private material is right or wrong. `matrixComparison` records a factual relationship between this blind baseline and the existing governed matrix, never a verdict. See §8 for an explicit, itemised confirmation of this boundary.

## 1. Why this export exists

The Product Owner is personally taking the C&G 2365-02 course and has private, proprietary teaching material (SmartScreen handouts, learner worksheets, tutor-answer sheets, a scheme of work) that will be used to manually calibrate ALP's existing Unit 202 governance against what a real course provider actually taught. Before that comparison happens, this package answers a narrower, architecturally important question:

> If ALP did **not** have access to that proprietary material at all, what would the transferable ALP course-construction methodology — specification/Range wording, public sample-assessment evidence, qualification level and command-verb reasoning, and independently approved technical sources — conclude a Unit 202 learner needs to know, understand, recognise, calculate and apply?

This question matters beyond Unit 202. ALP's long-term product must be able to construct courses for qualifications where no equivalent private teaching material is available at all. Proprietary handout/worksheet/tutor-answer content is therefore architected as an **optional, external calibration benchmark** — never a dependency the transferable methodology requires (§9 develops this as the scalability analysis).

## 2. Where the three artefacts live

| Artefact | Path |
|---|---|
| This report | `docs/architecture/evidence/CC-17-UNIT202-BLIND-CALIBRATION-BASELINE.md` |
| Machine-readable ledger (JSON) | `reports/unit202-calibration/blind-baseline.json` |
| Flat review export (CSV) | `reports/unit202-calibration/blind-baseline.csv` |

The governed ledger itself lives at `scripts/content/data/unit202-blind-calibration-baseline.ts` (60 rows), typed by `packages/content-schema/src/blind-calibration-baseline.ts`, validated by `scripts/content/validate-unit202-blind-calibration-baseline.ts`, and exported to JSON/CSV by `scripts/content/export-unit202-blind-calibration-baseline.ts` — the JSON and CSV are generated from the same in-memory, schema-validated ledger in one process, so their `calibrationKey` sets are identical by construction, never hand-typed independently. Re-run `node scripts/content/export-unit202-blind-calibration-baseline.ts` any time the ledger changes to regenerate both files.

## 3. Evidence hierarchy and the blindness rule

The schema (`packages/content-schema/src/blind-calibration-baseline.ts`) encodes a 7-tier evidence hierarchy:

1. **Official specification / Assessment Criteria / official Range** — curriculum-scope authority.
2. **Public sample-assessment material already legitimately governed** — depth/performance calibration where available.
3. **Qualification level, command verb, AC structure, necessary prerequisite reasoning** — transferable depth constraints.
4. **Independently approved authoritative technical sources** — factual truth (never curriculum-scope authority on their own).
5. **Proprietary/private course-provider material** — OPTIONAL calibration benchmark only, recorded (if at all) as an unverified claim, never an input to tiers 1–4's own conclusions.
6. **Existing ALP lessons/assertions/knowledge obligations** — diagnostic legacy evidence only.
7. **LLM/model knowledge** — never factual or curriculum authority.

Every `blindBaselineRequirement`/`blindBaselineDepth`/`blindBaselineRationale` field in the ledger was constructed using **only tiers 1–4**. None of the following were consulted to construct those three fields, for any row: `cgTeachingWorksheetCalibration`, any handout/worksheet/tutor-answer/scheme-of-work summary, any knowledge obligation whose sole basis is `OFFICIAL_TEACHING_INTERPRETATION`, or legacy lesson/assertion content. This is enforced two ways:

- **Structurally**: tier-5 evidence has its own, separately labelled field — `existingPrivateCalibrationClaim` — which the schema forces to begin with the literal string `"UNVERIFIED CALIBRATION CLAIM:"` so it can never be mistaken for verified evidence when the ledger is read in isolation. As of CC-17A, 35 of 60 rows populate this field with what the existing governed repository (the matrix's own `cgTeachingWorksheetCalibration` text, and a small number of narrowly attributable knowledge-obligation code-comment citations) records about proprietary handout/worksheet material — see §7.2 for the full breakdown. This field is comparison data only: populating it never altered any `blindBaselineRequirement`/`blindBaselineDepth`/`blindBaselineRationale`/`blindConfidence`/`publicSpecificationAnchor`/`publicRangeAnchor`/`publicAssessmentAnchor`/`transferablePrerequisiteJustification` value. CC-17B corrected a provenance weakness in how this was proven: the original CC-17A regression test compared against a snapshot generated from the (already CC-17A-modified) worktree, which could not independently prove anything was preserved. `scripts/content/data/unit202-blind-calibration-baseline-5d45953-snapshot.ts` is instead extracted directly from the actual committed CC-17 state (`git show 5d45953:scripts/content/data/unit202-blind-calibration-baseline.ts`), and the regression test in `scripts/content/validate-unit202-blind-calibration-baseline.test.ts` diffs every blind field against THAT historical commit. Every row is identical except the one CC-17B methodology-record correction explicitly named in §7.3.
- **Mechanically**: the validator scans every row's `blindBaselineRequirement`/`blindBaselineDepth`/`blindBaselineRationale` text for the vocabulary "handout(s)", "worksheet(s)", "tutor-answer(s)", "SmartScreen", "scheme(s) of work", and the literal field name `cgTeachingWorksheetCalibration`, case-insensitively — CC-17B made these patterns plural-aware (CC-17A's own singular-only patterns would have missed "handouts"/"worksheets"/"tutor answers" injected into a blind field). This gate is currently clean (0 matches across 60 rows) — see §5.

The governed matrix (`unit202DepthPerformanceMatrix`) and the CC-16 audit ledger were used only to **identify candidate propositions worth reconstructing** (so nothing already known to matter is missed) and to **compare against** afterward (`matrixComparison`) — never as a source for what a blind field itself asserts. Neither was deleted or modified.

## 4. Methodology

Each of the 60 rows independently answers, per proposition: what does the AC's own title/verb require; does an official Range item name it directly; does public sample-assessment evidence (already legitimately governed in the matrix's own `publicSampleAssessmentCalibration` field) confirm a specific depth; what does Level-2/command-verb/necessary-prerequisite reasoning imply; and what does the approved technical-source dossier establish as factually true. Rows were seeded from CC-16's own 56-proposition candidate list (walked systematically AC-by-AC) so no previously-identified proposition was missed, then **independently reconstructed** from tiers 1–4 only — the matrix's own conclusion was never copied forward as an assumption.

Granularity follows the task's own requirement that compound propositions not be left bundled: telephone category/capacitor/resistor/surge-protector/master-vs-extension/other remain six separate rows (§6.2); security-alarm category/transistor-switching/thyristor-latching/exact-topology remain four separate rows (§6.3); AC5.3's field/direction/force/Fleming-left/EMF/Fleming-right/coil-solenoid/electromagnet/relay/contactor remain ten separate rows (§6.4); AC3.2's lever classes, gears and pulleys are separated with the AC-wording-vs-Range-structure gap made explicit (§6.5); AC6.2 separates generic operating principle, schematic-symbol recognition, physical-appearance recognition and (for resistors specifically) colour-code identification (§6.6); AC2.2 makes the impedance/reactance/power-factor calculation-vs-recognition depth ceiling its own row (§6.7).

## 5. Coverage counts (mechanically proven, not asserted)

Run `node scripts/content/validate-unit202-blind-calibration-baseline.ts` to reproduce these live:

- **ACs covered: 23/23.** Every AC in the matrix has at least one baseline row.
- **Range items covered: 58/58.** Every `(acNumber, rangeItem)` pair in the matrix's own `officialRangeCoverage` has at least one baseline row explicitly naming it.
- **CC-16 propositions mapped or explicitly diagnostic: 56/56.** Every propositionKey in the real CC-16 ledger is present in this package's `CC16_MAPPING` table (in the validator), cross-checked live against the real CC-16 ledger so a renamed/added/removed CC-16 row cannot silently drift out of sync. 54 map to one or more `calibrationKey`s (several split 1-to-many, e.g. CC-16's single `ac5-3-coil-solenoid-electromagnet-relay-contactor` row maps to four separate CC-17 rows); 2 are recorded diagnostic-only (`ac6-2-photo-device-ambiguity`, `cross-cutting-fleming-rule-mnemonic-vocabulary`) because neither is itself an independently AC/Range-anchored proposition — each feeds as tier-6 diagnostic input into a related row instead (documented in that row's `matrixComparisonNotes`).
- **Duplicate calibrationKeys: 0** (schema-rejected).
- **Rows with private-material vocabulary leaked into a blind\* field: 0** (mechanically scanned, §3).
- **Rows with forbidden final-verdict language: 0** (mechanically scanned for phrases asserting private material is correct/incorrect, or recommending it be trusted/corrected).
- **JSON/CSV calibrationKey-set parity: confirmed identical**, 60/60, by construction (§2).

**Total ledger rows: 60.**

## 6. Special required cases (task section 11)

### 6.1 AC2.2 — impedance/reactance/power-factor calculation-vs-recognition depth
`ac2-2-quantity-symbol-unit-recognition` covers symbol/unit identification for all 11 Range items at HIGH confidence. `ac2-2-ac-quantity-calculation-depth-ceiling` is a dedicated row stating the blind method's own conclusion — recognition/distinction only, **not** full `Z=sqrt(R²+X²)`/`XL=2πfL`/`XC=1/(2πfC)`/numeric-power-factor calculation — derived independently from AC2.2's own command verb ("identify and determine values of ... units", not a calculation verb) and the absence of a calculation verb anywhere in this AC, at MEDIUM confidence (an absence-of-verb inference, not a positive citation). `matrixComparison: SAME` — the governed matrix reaches the identical ceiling, citing a proprietary handout appendix as the thing to guard against; the blind method reaches the same ceiling without needing to know what that appendix contained.

### 6.2 AC6.1 Telephones — six separate items
`ac6-1-telephone-category` (HIGH, direct Range anchor) is separated from `ac6-1-telephone-capacitor-role`, `ac6-1-telephone-resistor-role`, `ac6-1-telephone-surge-protector-role`, `ac6-1-telephone-master-vs-extension-distinction` (all LOW, `MATRIX_ONLY_PROPOSITION` — none of these four specific component/wiring claims is independently derivable from the bare Range label "Telephones", since a telephone is a complex device with many plausible components a course could choose to emphasise) and `ac6-1-telephone-other-component-detail-check` (LOW, a deliberate closure check confirming no further telephone-internal component is confidently derivable either).

### 6.3 AC6.1 Security alarms — four separate items
`ac6-1-security-alarms-category` (HIGH, direct Range anchor) is separated from `ac6-1-security-alarm-transistor-switching-generic` and `ac6-1-security-alarm-thyristor-latching-generic` (both MEDIUM — generic component capability, cross-AC-derived from AC6.2's own transistor/thyristor content, plausibly combined with this category) and `ac6-1-security-alarm-exact-topology` (LOW, `MATRIX_ONLY_PROPOSITION` — the *specific combined circuit* is one of several electrically-plausible designs and cannot be selected from specification/Range evidence alone).

### 6.4 AC5.3 — ten separate items
`ac5-3-field-around-conductor` (HIGH) / `ac5-3-field-direction-rule` (MEDIUM) / `ac5-3-force-on-conductor` (MEDIUM) / `ac5-3-flemings-left-hand-rule` (MEDIUM) / `ac5-3-induced-emf` (MEDIUM) / `ac5-3-flemings-right-hand-rule` (MEDIUM) / `ac5-3-coil-solenoid-field` (LOW) / `ac5-3-electromagnet` (LOW, `MATRIX_ONLY_PROPOSITION`) / `ac5-3-relay` (LOW, `MATRIX_ONLY_PROPOSITION`) / `ac5-3-contactor` (LOW, `MATRIX_ONLY_PROPOSITION`) — confidence strictly decreases moving from AC5.3's own directly-named content (field production, force, EMF) through necessary-prerequisite directional rules to progressively more specific, unnamed component applications (coil → electromagnet → relay → contactor), each step further from anything AC5.3's own title actually says.

### 6.5 AC3.2 — levers/gears/pulleys and the AC-wording-vs-Range-structure gap
`ac3-2-lever-classes-and-balance` (MEDIUM, direct Range anchor for the three classes) is separated from `ac3-2-structural-gap-gears-pulleys-no-range-item` (a dedicated structural-finding row, HIGH confidence *as a finding about the matrix's own data shape*, confirmed by the matrix cross-reference test in §6.5.1) and `ac3-2-gears` / `ac3-2-pulleys` (both MEDIUM, anchored only by AC3.2's own title wording since no Range item exists for either).

#### 6.5.1 The gap itself
AC3.2's own title names three mechanisms ("levers, gears and pulleys"), but the governed matrix's `officialRangeCoverage` array contains **only** the three lever-class rows (`Class I`/`Class II`/`Class III`) — confirmed live by this package's own test (`scripts/content/validate-unit202-blind-calibration-baseline.test.ts`, "matrix's own AC3.2 officialRangeCoverage genuinely contains no gear/pulley Range item"). Gears and pulleys are therefore anchored only by AC-title wording, never a distinct Range entry — the same structural finding CC-16's audit already made, independently re-confirmed here.

### 6.6 AC6.2 — generic principle vs symbol vs appearance vs application-specific usage
`ac6-2-generic-operating-principles` (HIGH, direct Range anchor for all 13 components, licensed by the AC's own verb "state the basic operating principles") is separated from `ac6-2-schematic-symbol-recognition` (MEDIUM — not named by the AC's own verb, but confirmed by public sample-assessment evidence for at least some components) and `ac6-2-physical-appearance-recognition` (LOW — neither AC-title-named nor sample-assessment-confirmed; plausible only as generic teaching support, not a confirmed required performance). `ac6-2-resistor-colour-code` is further separated as its own row (LOW, `MATRIX_BROADER` — a specific, standardised identification skill beyond "state the basic operating principle", included only as a plausible vocational-relevance addition).

### 6.7 AC2.2 — see §6.1 above (the task lists this alongside the other five special cases; treated together here to avoid duplicating the same content twice).

## 7. All MEDIUM/LOW confidence rows (33 of 60)

Every row below carries a `blindUncertaintyReason` in the ledger (schema-enforced — a MEDIUM/LOW row without one fails validation). Grouped by AC:

| calibrationKey | AC | Confidence | Why (see ledger `blindUncertaintyReason` for full text) |
|---|---|---|---|
| `ac1-1-indices-and-notation` | 1.1 | MEDIUM | Bare Range label "Indices" doesn't itself resolve integer-only vs. fractional-index scope |
| `ac1-1-statistics-mean-median-mode` | 1.1 | MEDIUM | Bare Range label "Statistics" has no sub-item breakdown; whether "range" is a 4th required measure is unresolved |
| `ac2-2-ac-quantity-calculation-depth-ceiling` | 2.2 | MEDIUM | Absence-of-calculation-verb inference, not a positive citation |
| `ac3-2-lever-classes-and-balance` | 3.2 | MEDIUM | Calculation requirement inferred from sample-assessment evidence, not AC3.2's own "explain" verb |
| `ac3-2-gears` | 3.2 | MEDIUM | No Range item names "gears" at all — AC-title-only anchor |
| `ac3-2-pulleys` | 3.2 | MEDIUM | No Range item names "pulleys" at all — AC-title-only anchor |
| `ac3-3-mechanics-concepts` | 3.3 | MEDIUM | Whether KE/PE quantitative formulae belong under 3.3 or 3.4 unresolved from command-verb analysis alone |
| `ac3-4-mechanics-calculation` | 3.4 | MEDIUM | Same AC3.3-vs-3.4 KE/PE placement question, from the calculation side |
| `ac4-2-conductor-insulator-distinction` | 4.2 | MEDIUM | No official Range list; complete required material-example list unresolved |
| `ac5-1-attraction-repulsion-field-lines` | 5.1 | MEDIUM | No sample-assessment evidence located for this AC at all |
| `ac5-3-field-direction-rule` | 5.3 | MEDIUM | Direction not itself named by AC5.3's title — necessary-prerequisite inference |
| `ac5-3-force-on-conductor` | 5.3 | MEDIUM | F=BIl calculation depth inferred, not a direct calculation-verb citation |
| `ac5-3-flemings-left-hand-rule` | 5.3 | MEDIUM | Specific mnemonic NAME is a vocational-trade convention, not independently verifiable from tiers 1–4 |
| `ac5-3-induced-emf` | 5.3 | MEDIUM | Same e=Blv calculation-depth inference as force-on-conductor |
| `ac5-3-flemings-right-hand-rule` | 5.3 | MEDIUM | Same specific-name caveat as the left-hand rule |
| `ac5-3-coil-solenoid-field` | 5.3 | LOW | No tier-1 anchor at all — "coil"/"solenoid" absent from AC5.3's title and Range |
| `ac5-3-electromagnet` | 5.3 | LOW | No tier-1 anchor anywhere in the matrix |
| `ac5-3-relay` | 5.3 | LOW | No tier-1 anchor anywhere; more specific than "electromagnet" |
| `ac5-3-contactor` | 5.3 | LOW | No tier-1 anchor anywhere; most specific/vocational of the four |
| `ac6-1-security-alarm-transistor-switching-generic` | 6.1 | MEDIUM | Generic capability confirmed (AC6.2), but pairing with THIS category is inferred |
| `ac6-1-security-alarm-thyristor-latching-generic` | 6.1 | MEDIUM | Same cross-AC-inference caveat as transistor-switching |
| `ac6-1-security-alarm-exact-topology` | 6.1 | LOW | Many electrically-equivalent topologies; none selectable from tiers 1–4 |
| `ac6-1-telephone-capacitor-role` | 6.1 | LOW | No component-specific evidence in tiers 1–4 |
| `ac6-1-telephone-resistor-role` | 6.1 | LOW | No component-specific evidence in tiers 1–4 |
| `ac6-1-telephone-surge-protector-role` | 6.1 | LOW | No component-specific evidence; may also be a legacy/superseded design detail |
| `ac6-1-telephone-master-vs-extension-distinction` | 6.1 | LOW | No evidence, and arguably not "electronic component" content per the AC's own framing |
| `ac6-1-telephone-other-component-detail-check` | 6.1 | LOW | By construction, an absence-check can't be HIGH confidence |
| `ac6-1-dimmer-switch-category` | 6.1 | MEDIUM | General phase-control principle confident; specific circuit topology is not |
| `ac6-1-motor-control-category` | 6.1 | MEDIUM | General rectify-then-switch pattern confident; "protection" function specifically is not |
| `ac6-1-wireless-control-category` | 6.1 | MEDIUM | Transmitter/receiver arrangement near-definitional; specific "advantages" content is not |
| `ac6-2-schematic-symbol-recognition` | 6.2 | MEDIUM | Confirmed for at least some components by sample-assessment evidence; not confirmed for all 13 |
| `ac6-2-physical-appearance-recognition` | 6.2 | LOW | No tier-1/tier-2 evidence distinguishes "required" from "helpful teaching illustration" |
| `ac6-2-resistor-colour-code` | 6.2 | LOW | Vocational-relevance plausibility only, no tier-1/tier-2 citation |

## 7.1 All matrix-vs-baseline discrepancies

This list is generated directly from the live ledger's own `matrixComparison` field (never hand-typed) and is mechanically reconciled against it by `scripts/content/validate-unit202-blind-calibration-baseline.ts`'s `reconcileReportAgainstMarkdown()` — re-run `node scripts/content/validate-unit202-blind-calibration-baseline.ts` to reproduce this exact list live and confirm it still matches. Each state below is listed exactly once, with its live count, so a count mismatch or a wrongly-classified key is mechanically caught rather than silently drifting (task section 5/CC-17A's own correction).

**SAME (44 rows):** not listed individually — the majority case; see the CSV/JSON export for the full set.

**MATRIX_BROADER (6 rows):** `ac1-1-indices-and-notation`, `ac1-1-statistics-mean-median-mode`, `ac3-4-mechanics-calculation`, `ac6-1-motor-control-category`, `ac6-2-physical-appearance-recognition`, `ac6-2-resistor-colour-code`.

**MATRIX_NARROWER (0 rows):** (none) — the blind method never independently derived a NARROWER conclusion than the matrix in the current ledger.

**DIFFERENT_EMPHASIS (1 row):** `ac4-2-conductor-insulator-distinction` — matrix and a separate governed assertion name two different material-example sets, neither Range-mandated.

**MATRIX_ONLY_PROPOSITION (9 rows):** `ac5-3-contactor`, `ac5-3-electromagnet`, `ac5-3-relay`, `ac6-1-security-alarm-exact-topology`, `ac6-1-telephone-capacitor-role`, `ac6-1-telephone-master-vs-extension-distinction`, `ac6-1-telephone-other-component-detail-check`, `ac6-1-telephone-resistor-role`, `ac6-1-telephone-surge-protector-role` — these are the rows of closest interest to the Project Architect, exactly where the existing matrix's access to proprietary material is most visible, since the blind method independently could not derive the same conclusion from transferable evidence alone.

**BASELINE_ONLY_PROPOSITION (0 rows):** (none) — the blind method did not independently predict any required content the existing matrix does not already capture.

## 7.2 Private-calibration claim summary (task section 8)

35 of 60 rows carry an `existingPrivateCalibrationClaim` — a repository-recorded, **unverified** claim about what proprietary handout/worksheet/tutor-answer/scheme-of-work material is reported to contain, drawn from the governed matrix's own `cgTeachingWorksheetCalibration` text and a small number of narrowly attributable knowledge-obligation code-comment citations (never independently verified against the actual private artefact, which this package cannot inspect). 25 of 60 rows carry no such claim, either because the repository records no specific private-material claim for that proposition, or because the claim it does record is too generic (a bare "Handout N" mention with no attributable content) to be useful comparison data.

Breakdown by claim type (a single claim may mention more than one type, so these do not sum to 35). Classification is plural-aware (`handouts?`, `worksheets?`, `tutor[- ]answers?`, `schemes? of work`) — CC-17A's own first cut of this breakdown used singular-only patterns and undercounted every type that a claim referenced only in its plural form (e.g. "Worksheets 4/5", "Handout 2; Worksheet 2/tutor answers"); CC-17B corrected the classifier and these are the live, machine-derived counts under the fix:

- **HANDOUT:** 23
- **WORKSHEET:** 30
- **TUTOR_ANSWER:** 1
- **SCHEME_OF_WORK:** 0

Calibration keys carrying one or more such claims: `ac1-1-algebra-transposition`, `ac2-1-temperature-kelvin-celsius`, `ac2-2-ac-quantity-calculation-depth-ceiling`, `ac2-2-quantity-symbol-unit-recognition`, `ac2-3-instrument-selection-connection`, `ac2-3-wattmeter-energy-meter`, `ac3-1-mass-weight-definitions-relationship`, `ac3-2-gears`, `ac3-2-lever-classes-and-balance`, `ac3-2-pulleys`, `ac3-4-mechanics-calculation`, `ac4-1-atomic-structure-and-current`, `ac4-3-resistance-resistivity-relationship`, `ac4-5-series-parallel-calculation`, `ac4-6-power-calculation`, `ac4-7-voltage-drop`, `ac4-8-thermal-chemical-effects`, `ac5-1-attraction-repulsion-field-lines`, `ac5-2-flux-flux-density-relationship`, `ac5-3-field-direction-rule`, `ac5-3-flemings-left-hand-rule`, `ac5-3-flemings-right-hand-rule`, `ac5-3-force-on-conductor`, `ac5-3-induced-emf`, `ac5-4-alternator-principle-and-parts`, `ac5-4-frequency-pole-pair-relationship`, `ac5-5-waveform-characteristics-and-relationships`, `ac6-1-dimmer-switch-category`, `ac6-1-heating-boiler-control-category`, `ac6-1-motor-control-category`, `ac6-1-security-alarm-thyristor-latching-generic`, `ac6-1-telephone-capacitor-role`, `ac6-2-generic-operating-principles`, `ac6-2-resistor-colour-code`, `ac6-2-schematic-symbol-recognition`.

Notably, `ac6-1-telephone-resistor-role`, `ac6-1-telephone-surge-protector-role`, `ac6-1-telephone-master-vs-extension-distinction` and `ac6-1-telephone-other-component-detail-check` carry **no** private-calibration claim — the governed matrix's `cgTeachingWorksheetCalibration` for AC6.1 names only the telephone **capacitor** specifically ("Worksheet 18 asks roles of thyristor, telephone capacitor, bridge rectifier, thermistor and DIAC"); the repository records no independent worksheet/handout claim for the other three telephone component clauses, so this package does not manufacture one by inheriting the capacitor's claim onto its siblings (task section 4's granularity rule).

This summary is intended to help the Project Architect decide which private documents need close inspection first: the 35 rows above are where the existing repository's own claims can be directly checked against the actual private material; the 25 rows without a claim are either genuinely un-evidenced in the repository today, or already fully derivable from public/transferable evidence alone.

## 7.3 CC-17B methodology-record correction (the only authorised blind-field change)

The `cross-cutting-matrix-vs-baseline-scope-of-analysis` row's `blindBaselineRequirement` previously stated a hand-maintained intermediate breakdown ("this baseline's 45 content rows... map to 42 of CC-16's 56 audit propositions... the remaining 14 CC-16 propositions were either merged...") that did not arithmetically reconcile with the ledger's real 60-row total (60 minus the two special rows it names is 58, not 45) — a genuine pre-existing CC-17 data inconsistency the Project Architect explicitly escalated in CC-17B rather than leaving for a future session to silently reinterpret.

Per the Project Architect's own instruction, the brittle hand-count is removed rather than recomputed, and replaced with the durable, machine-provable facts: the ledger contains 60 calibration rows; all 56 real CC-16 audit propositions are explicitly mapped to one or more `calibrationKey`s, or recorded diagnostic-only, through the validator's own `CC16_MAPPING` table; the validator mechanically proves zero unmapped CC-16 propositions (its own `cc16PropositionsUnmapped` report field, re-proven by a dedicated regression test). No other row's `blindBaselineRequirement`/`blindBaselineDepth`/`blindBaselineRationale`/`blindConfidence`/anchor field changed — proven by the historical (commit 5d45953) diff in `scripts/content/validate-unit202-blind-calibration-baseline.test.ts`, which explicitly names this row/field as the sole permitted exception and fails if any other field differs from that commit.

## 8. Explicit confirmation of the no-decisions boundary

- No row asserts the Product Owner's private material is correct or incorrect.
- No row recommends the private material be trusted, corrected, retained, or removed.
- `existingPrivateCalibrationClaim` is schema-forced to begin `"UNVERIFIED CALIBRATION CLAIM:"` wherever populated — 35/60 rows populate it as of CC-17A, every one verified by regression test to carry the required prefix (§7.2).
- `matrixComparison` is a closed, purely descriptive enum (`SAME`/`MATRIX_BROADER`/`MATRIX_NARROWER`/`DIFFERENT_EMPHASIS`/`MATRIX_ONLY_PROPOSITION`/`BASELINE_ONLY_PROPOSITION`) — never a verdict value.
- The validator mechanically scans all free text for forbidden verdict phrasing (0 matches, §5) and no field name on the schema is capable of carrying a final correctness verdict (proven by a dedicated structural test).
- The governed matrix, knowledge obligations, assertions, lessons, storyboards, source-acquisition manifest, technical-source-verification states, technical-source dossier, and visual assets were **not modified** by this package.

## 9. Scalability analysis — 2365 as a calibration benchmark for the general course-construction method

This section reports what this exercise implies about the transferable methodology **in general**, not only for Unit 202.

**Conclusions independently reachable at HIGH confidence without any proprietary material (27 of 60 rows, 45%):** the large majority of Unit 202's core mathematical, SI-unit, DC-circuit, magnetism, and generic-electronic-component content is directly anchored by official AC/Range wording, confirmed where needed by public sample-assessment evidence, and factually grounded by the approved technical-source dossier. Command-verb pairing (e.g. AC4.4 "explain" vs AC4.5 "calculate") reliably resolves conceptual-vs-numeric depth splits without needing any teaching material at all.

**Conclusions that depend on public sample-assessment evidence specifically (a meaningful fraction of the 27 HIGH-confidence rows):** several rows would drop to MEDIUM without it — e.g. `ac3-1-mass-weight-definitions-relationship`'s calculation depth, `ac2-1-temperature-kelvin-celsius`'s SI-base-unit confirmation, and `ac5-4-frequency-pole-pair-relationship`'s pole-pairs convention all lean on sample-assessment or independently-verified technical-source evidence to reach HIGH rather than MEDIUM. This is the second-most-load-bearing tier after the specification/Range text itself, and it is public, governable, reusable evidence — exactly the kind the architecture should keep investing in acquiring for any new qualification.

**Conclusions that rely on command-verb/level/prerequisite inference alone (21 MEDIUM-confidence rows, 35%):** these are not failures of the method — they are its honest boundary. Most cluster in three patterns: (a) AC titles/Range labels that are terse or absent (AC3.1/3.3/3.4/4.1–4.8/5.1–5.4 carry no Range box at all — matched here by necessary-prerequisite and command-verb reasoning instead); (b) named UK-vocational-trade conventions with no first-party technical source of their own (Fleming's rule names); (c) application categories (AC6.1) where a generic component capability can be confidently combined with a category, but the exact illustrative circuit cannot.

**Where private material would be useful for *validating* — never required for — the methodology (12 LOW-confidence rows, 20%, all `MATRIX_ONLY_PROPOSITION` or unresolved):** every LOW-confidence row in this ledger is exactly the set where a specific course provider's own pedagogical choice (which component, which worked example, which named convention) cannot be derived from specification wording alone, because C&G's own specification deliberately leaves that choice to the training provider. This is the correct, expected shape for an "optional calibration benchmark" tier: private material here would let the Project Architect *confirm which of several equally-plausible choices Unit 202 training providers conventionally make*, not supply content the transferable method was unable to construct a course from. Every LOW row still has a complete, functionally-correct blind-baseline entry (e.g. `ac6-1-security-alarm-exact-topology` correctly identifies that a sensing-plus-latching topology is needed, even without knowing the exact provider's own circuit) — the architecture never blocks on the absence of tier-5 evidence.

**Whether any matrix proposition seems impossible to derive from the transferable methodology:** no. Every one of the 9 `MATRIX_ONLY_PROPOSITION` rows has a plausible, lower-confidence blind-method treatment recorded (either a generic-capability parent row, e.g. transistor/thyristor switching-and-latching feeding the security-alarm cluster, or an explicit "not confidently derivable, here is why" record, e.g. the telephone component-role rows). None required the transferable methodology to simply give up; every gap degrades gracefully to a lower-confidence, still-useful conclusion plus a targeted calibration question for the Project Architect.

**Overall implication:** Unit 202 supports the architectural principle this package exists to demonstrate — a course can be constructed to a substantial, mostly-HIGH-confidence degree from specification/Range/public-assessment/technical-source evidence alone, with proprietary material adding *depth confirmation and specific-example selection*, never foundational curriculum-scope authority. Proprietary material remains valuable (it is exactly what will let the Project Architect resolve the 33 MEDIUM/LOW rows with real confidence), but this ledger's own construction is proof the methodology does not depend on it existing.

## 10. Usage instructions for the Project Architect

1. Read `reports/unit202-calibration/blind-baseline.csv` in a spreadsheet, one row per proposition, alongside the equivalent private handout/worksheet/tutor-answer content for the same AC/Range item.
2. For each row, use the `projectArchitectCalibrationQuestions` column as the specific, proposition-targeted question set to check against the private material — these are not boilerplate; each is written against that row's own specific uncertainty.
3. Pay closest attention to the 9 `MATRIX_ONLY_PROPOSITION` rows (§7.1) and the 33 MEDIUM/LOW confidence rows (§7) — these are exactly where private material's own influence on the current governed matrix is most visible, and where confirming or correcting the matrix will have the most value.
4. Where the private material resolves an uncertainty, that resolution becomes an `existingPrivateCalibrationClaim` (schema-forced `"UNVERIFIED CALIBRATION CLAIM:"` prefix) in a **future**, separate governed update — not a change to this blind baseline, which must remain reproducible from tiers 1–4 alone so future qualifications without private material can be constructed the same way.
5. `reports/unit202-calibration/blind-baseline.json` carries the complete, structured ledger for any tooling the Project Architect wants to build against it later (e.g. a diff view against a structured private-material extract).
