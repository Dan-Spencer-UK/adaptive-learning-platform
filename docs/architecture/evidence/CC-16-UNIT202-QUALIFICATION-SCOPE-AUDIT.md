# CC-16 — Unit 202 Qualification-Scope Provenance / Contamination Audit: Evidence Report

**Status:** audit complete, review-ready. This is a **read-only evidence package**. It makes no final scope classification and changes no governed matrix, obligation, assertion, lesson, storyboard, or technical-source artefact. The Product Owner / Project Architect will classify and decide every case this report surfaces.

**Authority boundary:** Claude is not the authority for curriculum scope. Every finding below is phrased as evidence found or not found — never as a recommendation to retain, remove, narrow, or keep a proposition. See §10 for an explicit, itemised confirmation of this boundary.

## 1. Audit methodology

Every ledger row traces one distinct, non-trivial required-knowledge proposition drawn from the governed `unit202DepthPerformanceMatrix`'s own text (`requiredSupportingKnowledge`, `officialRangeCoverage` `depthTreatment`, `requiredLearnerPerformance`) against:

- **(A) explicit spec/AC support** — does the AC's own title/verb wording name this directly?
- **(B) explicit Range support** — does an official Range item name this directly, or is it Range-adjacent depth added by the matrix beyond the item's bare label?
- **(C–F) handout / worksheet / tutor-answer / sample-assessment support** — what does the matrix's own `cgTeachingWorksheetCalibration` / `publicSampleAssessmentCalibration` text claim?
- **(G) current governed knowledge-obligation keys** (`unit202-knowledge-obligations.ts`) and that obligation's own recorded `basis` — **diagnostic only**.
- **(H) current governed assertion keys** (`cc04-unit202-electrical-science.ts`) implementing the same proposition — **diagnostic only**.
- **(I) that assertion's own cited source class** — **diagnostic only**.

G/H/I never justify A–F. A legacy obligation or assertion is never treated as curriculum evidence for what C&G requires — see `packages/content-schema/src/qualification-scope-audit.ts`'s own module header for the structural reasoning.

### 1.1 The single largest finding: no C&G artefact is checked into this repository

Before tracing a single proposition, this audit searched the repository for actual C&G SmartScreen handouts, learner worksheets, tutor-answer sheets, or public sample-assessment papers. **None exist.** Every "Handout N" / "Worksheet N" reference anywhere in this codebase — in the governed matrix, the knowledge-obligations file, and this audit's own ledger — is the Project Architect's own paraphrased citation of what that document supposedly contains, never the document's own text. This means every `handoutSupport`/`worksheetSupport`/`tutorAnswerSupport`/`sampleAssessmentSupport` value of `MATRIX_CLAIMS_*` in the ledger records **what the matrix asserts**, not what this audit independently verified. This is the single largest, repo-wide evidence-access gap this audit found, and it applies to essentially every row.

A small number of `unit202-knowledge-obligations.ts` code comments go one step further and present what reads as a **verbatim quotation** from a handout (e.g. the AC1.1 "statistics" obligation's comment quotes: *"the data has been collected it can then be analysed using simple statistical tools including range, average (mean), median and mode"*). These were apparently transcribed by a prior session that had temporary, ephemeral access to a user-supplied document (the matrix's own `sourceReferences` field records: *"User-supplied official C&G SmartScreen evidence: 18 handouts, 18 learner worksheets, 18 tutor-answer worksheets, and the Unit 202 sample scheme of work"*) — but that document itself was never persisted to the repository. This audit has no way to re-verify any such quotation is accurate or complete, and records it distinctly (`QUOTED_IN_CODE_COMMENT_UNVERIFIABLE_THIS_SESSION` in the schema, though no ledger row below needed that exact value — the quoted passages found were all attached to obligations already independently flagged `OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION_NOT_EXPLICIT_OR_RANGE` for the underlying scope reason, so this audit records the quotation's unverifiability in prose within the relevant rows' `notes` rather than needing a separate coverage tier).

### 1.2 G/H/I diagnostic scoping decision

Full A–F tracing was performed for every one of the 56 ledger rows, covering all 23 ACs and all 58 official Range-item treatments (mechanically proven, §3). G/H/I diagnostic cross-referencing against `unit202-knowledge-obligations.ts` (568 lines, read in full) was likewise performed for every row where an obligation exists. Cross-referencing against `cc04-unit202-electrical-science.ts` (6,015 lines) for H/I was performed exhaustively for every row this audit flagged with at least one scope-risk flag, and for a representative spot-check of routine rows — not for every one of the 56 rows individually, given the corpus's scale. This scoping decision is disclosed here explicitly, not silently applied, per this audit's own governing instruction against false-green discipline.

## 2. Ledger location

`scripts/content/data/unit202-qualification-scope-audit.ts` (56 rows), validated by `scripts/content/validate-unit202-qualification-scope-audit.ts` and its schema `packages/content-schema/src/qualification-scope-audit.ts`. Run `npm run source-verification:report`-style directly: `node scripts/content/validate-unit202-qualification-scope-audit.ts` for the full machine-derived report, or `--check` for the pass/fail gate.

## 3. Coverage counts (mechanically proven, not asserted)

- **ACs audited: 23/23.** Every AC in the matrix has at least one ledger row.
- **Range items audited: 58/58.** Every `(acNumber, rangeItem)` pair in the matrix's own `officialRangeCoverage` has at least one ledger row explicitly naming it (rows may deliberately group several Range items sharing identical, undifferentiated evidence — documented in each such row's `notes` — while every named item still independently counts toward this total).
- **Rows referencing an unknown AC or Range item: 0.**
- **Rows with forbidden final-scope-verdict language in `notes`: 0** (mechanically scanned for phrases like "required qualification knowledge", "out of scope", "should be retained/removed").
- **Duplicate propositionKeys: 0** (schema-rejected).

## 4. Counts by evidence-strength category

| Category | Count |
|---|---:|
| `RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED` | 31 |
| `RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY` | 14 |
| `AC_TEXT_ONLY_NO_RANGE_ITEM` | 6 |
| `NO_AC_OR_RANGE_ANCHOR_LOCATED` | 4 |
| `RANGE_ANCHORED_NO_DEPTH_EVIDENCE_LOCATED` | 1 |
| `FOUNDATIONAL_SUPPLEMENTATION_CLAIM` | 0 (see §4.1) |

**Total: 56.** These categories describe evidence found, never a verdict — see the schema's own header.

### 4.1 Foundational-supplementation claims (task section 4)

No ledger row was tagged `FOUNDATIONAL_SUPPLEMENTATION_CLAIM` as its primary evidence-strength category, because every genuinely foundational item this audit traced (e.g. AC1.1's mathematics content: fractions, algebra, indices, transposition, trigonometry, statistics) is **itself** an explicit official Range item under AC1.1 — i.e. C&G's own Range already names these as required mathematical principles for electrical work, so they are `RANGE_ANCHORED_*`, not merely inferred as prerequisite background. This audit found no case in the current matrix of supplementary knowledge justified *purely* as an unnamed prerequisite with no Range anchor at all. This is a reportable finding in itself: the foundational-supplementation risk pattern task section 4 anticipates does not currently manifest at the level this audit examined (the AC/Range/matrix level) — it may still exist one layer down, in how deep AC1.1's own mathematics is taught relative to what electrical calculations in later ACs actually require, which this audit did not separately trace (out of scope: that is a pedagogical-sequencing question, not a matrix-proposition-provenance one).

## 5. Counts by scope-risk flag

| Flag | Count |
|---|---:|
| `OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION_NOT_EXPLICIT_OR_RANGE` | 11 |
| `MENTION_ONLY_NOT_PERFORMANCE` | 8 |
| `ENCYCLOPEDIA_SOURCE` | 6 |
| `CURRENTNESS_OR_JURISDICTION_DEPENDENT` | 5 |
| `LEGACY_ASSERTION_ONLY` | 5 |
| `MATRIX_SELF_FLAGGED_REVIEW_NOTE` | 5 |
| `NO_TUTOR_OR_ASSESSMENT_SUPPORT` | 5 |
| `NO_EXPLICIT_AC_OR_RANGE_ANCHOR` | 4 |
| `POSSIBLE_CONTEXT_ONLY` | 4 |
| `POSSIBLE_OVERBUNDLED_PROPOSITION` | 4 |
| `DEPTH_ONLY_FROM_HANDOUT` | 2 |
| `PHYSICAL_RECOGNITION_EVIDENCE_ONLY` | 2 |
| `WORKSHEET_DOES_NOT_REQUIRE_DETAIL` | 0 |
| `FOUNDATIONAL_JUSTIFICATION_REQUIRED` | 0 |
| `TECHNICAL_SOURCE_ONLY` | 0 |
| `HANDOUT_QUOTE_UNVERIFIABLE_NO_PERSISTED_ARTEFACT` | 0 (see §1.1 — the pattern exists but is recorded in prose, not this flag, since the affected obligations were already flagged on the underlying scope-basis grounds) |

**32 of 56 rows (57%) carry at least one scope-risk flag.** Two flags this audit added beyond the task-mandated 14 (`MATRIX_SELF_FLAGGED_REVIEW_NOTE`, `OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION_NOT_EXPLICIT_OR_RANGE`) account for 16 of the flag instances between them — both were needed because the governed corpus already self-documents exactly the kind of scope uncertainty this audit exists to surface, and collapsing that into a generic flag would have discarded useful, already-authored evidence.

## 6. Every proposition with at least one scope-risk flag

Full detail (matrix text, exact evidence quotes, per-clause reasoning) is in the ledger's own `notes` field for each row; this table is the index.

| propositionKey | AC | Evidence strength | Flags |
|---|---|---|---|
| ac1-1-indices-and-notation | 1.1 | RANGE_ANCHORED_NO_DEPTH_EVIDENCE_LOCATED | NO_TUTOR_OR_ASSESSMENT_SUPPORT |
| ac1-1-statistics-range-mean-median-mode | 1.1 | RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY | DEPTH_ONLY_FROM_HANDOUT, OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION... |
| ac2-1-length-area-volume-mass-density-time-velocity | 2.1 | RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY | POSSIBLE_OVERBUNDLED_PROPOSITION |
| ac2-1-temperature-kelvin-celsius | 2.1 | RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED | MATRIX_SELF_FLAGGED_REVIEW_NOTE, CURRENTNESS_OR_JURISDICTION_DEPENDENT |
| ac2-2-quantity-symbol-unit-table | 2.2 | RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED | POSSIBLE_OVERBUNDLED_PROPOSITION |
| ac2-2-anti-overdepth-guard-impedance-reactance-pf | 2.2 | RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED | MATRIX_SELF_FLAGGED_REVIEW_NOTE |
| ac3-2-lever-classes | 3.2 | RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED | OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION... |
| ac3-2-gears-and-pulleys-no-range-item | 3.2 | AC_TEXT_ONLY_NO_RANGE_ITEM | NO_EXPLICIT_AC_OR_RANGE_ANCHOR |
| ac4-2-material-examples | 4.2 | RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY | POSSIBLE_OVERBUNDLED_PROPOSITION, PHYSICAL_RECOGNITION_EVIDENCE_ONLY |
| ac4-8-fuse-operation | 4.8 | RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY | MENTION_ONLY_NOT_PERFORMANCE |
| ac5-1-attraction-repulsion-field-lines | 5.1 | RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY | NO_TUTOR_OR_ASSESSMENT_SUPPORT |
| ac5-3-field-around-conductor-and-direction-rule | 5.3 | AC_TEXT_ONLY_NO_RANGE_ITEM | OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION..., NO_TUTOR_OR_ASSESSMENT_SUPPORT |
| ac5-3-force-on-conductor-and-flemings-left-hand | 5.3 | RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED | OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION..., ENCYCLOPEDIA_SOURCE |
| ac5-3-electromagnetism-and-emf-meaning | 5.3 | AC_TEXT_ONLY_NO_RANGE_ITEM | NO_TUTOR_OR_ASSESSMENT_SUPPORT |
| ac5-3-coil-solenoid-electromagnet-relay-contactor | 5.3 | NO_AC_OR_RANGE_ANCHOR_LOCATED | NO_EXPLICIT_AC_OR_RANGE_ANCHOR, NO_TUTOR_OR_ASSESSMENT_SUPPORT, POSSIBLE_OVERBUNDLED_PROPOSITION |
| ac5-3-induced-emf-and-flemings-right-hand | 5.3 | RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED | OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION... |
| ac5-4-frequency-pole-pair-relationship | 5.4 | RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED | MATRIX_SELF_FLAGGED_REVIEW_NOTE, CURRENTNESS_OR_JURISDICTION_DEPENDENT |
| ac6-1-security-alarm-transistor-thyristor-topology | 6.1 | RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY | MENTION_ONLY_NOT_PERFORMANCE, OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION..., POSSIBLE_CONTEXT_ONLY, CURRENTNESS_OR_JURISDICTION_DEPENDENT |
| ac6-1-telephone-category | 6.1 | RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY | MATRIX_SELF_FLAGGED_REVIEW_NOTE, CURRENTNESS_OR_JURISDICTION_DEPENDENT |
| ac6-1-telephone-capacitor-role | 6.1 | RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED | ENCYCLOPEDIA_SOURCE, LEGACY_ASSERTION_ONLY, OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION... |
| ac6-1-telephone-resistor-role | 6.1 | RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY | MENTION_ONLY_NOT_PERFORMANCE, ENCYCLOPEDIA_SOURCE, LEGACY_ASSERTION_ONLY, OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION... |
| ac6-1-telephone-surge-protector-role | 6.1 | NO_AC_OR_RANGE_ANCHOR_LOCATED | NO_EXPLICIT_AC_OR_RANGE_ANCHOR, MENTION_ONLY_NOT_PERFORMANCE, ENCYCLOPEDIA_SOURCE, LEGACY_ASSERTION_ONLY, CURRENTNESS_OR_JURISDICTION_DEPENDENT, OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION... |
| ac6-1-telephone-master-vs-extension-distinction | 6.1 | NO_AC_OR_RANGE_ANCHOR_LOCATED | NO_EXPLICIT_AC_OR_RANGE_ANCHOR, MENTION_ONLY_NOT_PERFORMANCE, ENCYCLOPEDIA_SOURCE, LEGACY_ASSERTION_ONLY |
| ac6-1-dimmer-switch-topology | 6.1 | RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY | MENTION_ONLY_NOT_PERFORMANCE, POSSIBLE_CONTEXT_ONLY |
| ac6-1-heating-boiler-topology | 6.1 | RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED | POSSIBLE_CONTEXT_ONLY |
| ac6-1-motor-control-topology | 6.1 | RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY | MENTION_ONLY_NOT_PERFORMANCE, POSSIBLE_CONTEXT_ONLY |
| ac6-1-wireless-control-topology | 6.1 | RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY | MENTION_ONLY_NOT_PERFORMANCE |
| ac6-2-resistor-4band-colour-code | 6.2 | RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED | DEPTH_ONLY_FROM_HANDOUT, PHYSICAL_RECOGNITION_EVIDENCE_ONLY |
| ac6-2-rectifier-half-vs-full-wave-distinction | 6.2 | RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED | OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION... |
| ac6-2-photo-device-ambiguity | 6.2 | RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED | MATRIX_SELF_FLAGGED_REVIEW_NOTE |
| ac6-2-thermistor-ptc-ntc | 6.2 | RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY | OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION... |
| cross-cutting-fleming-rule-mnemonic-vocabulary | 5.3 | RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY | ENCYCLOPEDIA_SOURCE, LEGACY_ASSERTION_ONLY |

## 7. Telephone exemplar trace (task section 10)

Six rows (`ac6-1-telephone-category` through `ac6-1-telephone-other-detail-check`), tracing each of the six required items separately, never as one bundled "master-socket role" claim:

1. **Telephones as a category** — direct qualification evidence found: an explicit official Range item under AC6.1.
2. **Capacitor/ringing role** — the matrix's own Worksheet-18 calibration text names this specifically ("Worksheet 18 asks roles of... telephone capacitor..."). The strongest-evidenced of the four component-role clauses, though still resting on an `OFFICIAL_TEACHING_INTERPRETATION`-basis obligation, not `EXPLICIT`/`RANGE`.
3. **Resistor/remote line-testing role** — only handout adjacency found; the matrix's own Worksheet-18 text does not name a resistor role at all.
4. **Older surge-protector role** — no learner-performance evidence located anywhere in the matrix's own text; present only in the governed obligation's description and the underlying assertion.
5. **Master-vs-extension-socket distinction** — no curriculum evidence of any kind located; not even present in the governed obligation's own description text, only one level further removed in the assertion's own statement.
6. **Any other telephone detail** — this audit's search found none beyond the four clauses above (negative result recorded explicitly, not silently omitted).

**Provenance distinction (explicitly required by task section 10):** for clauses 2–5, *C&G itself* is never directly inspected by this audit (no artefact exists to inspect). What this audit found is: (a) *the governed matrix* claims Worksheet 18 asks about the capacitor role specifically (clause 2 only); (b) *a governed knowledge obligation* (`6.1/telephone-application`, basis `OFFICIAL_TEACHING_INTERPRETATION`) asserts all three of capacitor/resistor/surge-protector together; (c) *a legacy governed assertion* (`EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001`) states all four clauses including the master-vs-extension distinction, sourced from **Wikipedia** ("British telephone sockets", an encyclopedia article — itself citing BS 6312/BT SIN 351/352, but the article, not those primary standards, is the actual cited source). These are three different, non-equivalent claims, and this audit has traced each to its own actual level, never collapsing (c) or (b) into (a).

**Downstream contamination footprint:** the capacitor, resistor, surge-protector and master-vs-extension content has propagated into `scripts/content/data/lesson-cc11-3-historical-snapshot.ts` and `scripts/content/data/lesson-electronic-components-passive.ts` (confirmed by direct search; inspected only to detect propagation, never as scope evidence for whether the content belongs).

## 8. Security-alarm exemplar trace (task section 11)

One row (`ac6-1-security-alarm-transistor-thyristor-topology`), plus a companion row confirming the category itself:

- **"Security alarms" as a Range item/application:** yes — direct qualification evidence found, an explicit official Range item under AC6.1.
- **The exact transistor-switching + thyristor-latching topology required by C&G:** no direct evidence located. The matrix's own Worksheet-18 calibration text names "roles of thyristor" generically — never "transistor", and never the specific normally-closed-loop/transistor-triggers-thyristor/latched-sounder circuit — as a worksheet performance item.
- **Worksheet/tutor-answer performance evidence for this exact topology:** none located in the matrix's own text.
- **Whether it is merely one teaching example:** the governed corpus's own history shows at least two candidate examples were considered for this Range item (the current transistor+thyristor topology, and an earlier infrared-beam-sensor topology now downgraded to `SUPPORTS` rather than `REQUIRED_FOR`) — evidence that example selection here has itself been revised at least once.
- **Whether any current requirement was inherited from legacy material:** the governed obligation's own basis is `OFFICIAL_TEACHING_INTERPRETATION`, and its own code comment states: *"SmartScreen itself is used only to identify which proportionate proposition to source and govern, never as the factual authority for the proposition itself."* The topology's own factual sourcing (for the transistor-triggers-thyristor mechanism specifically) is a general electronics tutorial site (ElProCus) and a general electronics textbook (Kuphaldt "All About Circuits") — neither first-party manufacturer documentation nor a C&G artefact.

No circuit was sourced and no retain/remove decision was made, per the task's explicit instruction.

**Downstream contamination footprint:** this topology has propagated into `scripts/content/data/lesson-cc11-3-historical-snapshot.ts` and `scripts/content/data/lesson-electronic-components-switching-control.ts`.

## 9. Other high-risk propositions discovered (task section 12 — beyond the two named examples)

- **AC3.2 gears/pulleys have no official Range item at all** (`ac3-2-gears-and-pulleys-no-range-item`) — a structural finding, not previously documented anywhere this audit found. AC3.2's own title names "levers, gears and pulleys", but the matrix's `officialRangeCoverage` array contains only three Class-I/II/III lever rows; gears and pulleys carry substantial required knowledge (idler effect, supporting-strand counting, ideal-machine energy conservation) anchored only by the AC's title wording, never a distinct Range entry.
- **AC5.3 (magnetic effects of current) is the densest single cluster of `OFFICIAL_TEACHING_INTERPRETATION`-basis content in the matrix** — five of the six AC5.3 rows carry at least one risk flag, and four of the eleven `OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION_NOT_EXPLICIT_OR_RANGE` instances repository-wide belong to this one AC (field-direction rule, F=BIl+Fleming's-left, e=Blv+Fleming's-right, and — most acutely — coil/solenoid/electromagnet/relay/contactor).
- **AC5.3 "electromagnet/relay/contactor basic principle" has literally no located anchor of any kind** (`ac5-3-coil-solenoid-electromagnet-relay-contactor`) — not in the AC's own title, no Range box exists for this AC, no worksheet or sample-assessment claim in the matrix, and no corresponding entry in the governed knowledge-obligations file at all. This is the single weakest-evidenced proposition this audit found in the entire matrix.
- **Two independent, pre-existing Wikipedia citations exist in the governed corpus** (`cc04-unit202-electrical-science.ts`), not one: the already-known telephone master-socket assertion, and — newly found by this audit — `EL-CONCEPT-FLEMING-LEFT-HAND-001` (Fleming's left-hand rule's own directional definition), entirely independent of CC-15's own separate, unrelated attempt to source the same directional convention from the approved technical-source dossier (Nagoya OCW), which CC-15A found could not be verified past a course-index heading. `cross-cutting-fleming-rule-mnemonic-vocabulary` records this cross-cutting finding once rather than duplicating it across every AC5.3 row it touches.
- **AC4.2's specific conductor/insulator material examples do not match between the governed matrix and the governed assertion implementing them** (`ac4-2-material-examples`): the matrix names "copper/tungsten vs porcelain/glass/plastics" (matching a public sample-assessment item), while the current assertion names "copper/aluminium... PVC/rubber" (matching an installation-cable datasheet). Neither traces to an explicit C&G-mandated material list (AC4.2 carries no Range box) — both are plausible illustrative choices, reported as a genuine divergence.
- **AC6.2's resistor 4-band colour-code depth is explicitly self-attributed to worksheet evidence by the matrix's own wording**, not the bare "Resistors" Range label (`ac6-2-resistor-4band-colour-code`) — a textbook instance of the `DEPTH_ONLY_FROM_HANDOUT` pattern, though well-evidenced by the approved technical-source dossier (TE Connectivity, manufacturer).
- **A possible tension between AC2.2's matrix-recorded anti-overdepth guard and the governed obligations file's own impedance-formula obligation**: the matrix's reviewFlag for AC2.2 explicitly warns against importing "Handout 2's formula appendix" material beyond recognition depth, while `unit202-knowledge-obligations.ts`'s own `2.2/impedance-calculation` obligation (basis `OFFICIAL_ASSESSMENT_EVIDENCE`) already asserts full `Z = sqrt(R^2+X^2)` formula recall as required. Reported for Project Architect attention (`ac2-2-anti-overdepth-guard-impedance-reactance-pf`), not resolved here.
- **A possible tension between AC3.3's matrix-recorded scope ceiling and the governed obligations file's own kinetic-energy-calculation obligation**: AC3.3's scopeCeiling explicitly excludes `KE = 1/2 m v^2` "unless later assessment/source evidence specifically requires it", while `unit202-knowledge-obligations.ts`'s own `3.4/kinetic-energy-calculation` obligation (basis `EXPLICIT`) already implements it as required (`ac3-4-mechanics-calculation-procedures`'s notes). Reported, not resolved.

## 10. Explicit confirmation: no final scope decision was made

- No ledger row uses, and the governed schema structurally forbids, any of: `REQUIRED_QUALIFICATION_KNOWLEDGE`, `FOUNDATIONAL_PREREQUISITE` (as a verdict), `CONTEXTUAL_TEACHING_SUPPORT`, `OUT_OF_SCOPE`, or equivalent classification — mechanically proven by a dedicated regression test scanning every row's `notes` field for forbidden verdict phrases (0 matches) and a second test proving the schema's own field names carry no decision-shaped vocabulary.
- No proposition was recommended for retention or removal. No telephone detail was sourced, narrowed, or removed. No security-alarm topology was sourced or resolved.
- No new technical source was selected or browsed for; this audit's own evidence is limited to what the existing governed matrix, obligations file, and (diagnostically) assertion corpus already contain.
- No knowledge assertion, lesson, storyboard, source-acquisition requirement, proposition-coverage state, or technical-source dossier entry was changed. `git status` confirms the only repository changes are this ledger, its schema, its validator/tests, this evidence report, and a narrow `PROJECT-STATUS.md` entry.

## 11. Validation

- `npx tsc --noEmit -p scripts/content/tsconfig.json` — clean.
- `node scripts/content/validate-unit202-qualification-scope-audit.ts --check` — PASS, all gates clean (23/23 ACs, 58/58 Range items, 0 unknown references, 0 forbidden-verdict matches).
- `npx vitest run` on the CC-16 suite — **25/25 passing**; all four focused suites together — **102/102 passing**.
- `npm run typecheck` (all workspaces) — clean.
- Focused lint on all five CC-16-touched files — clean, 0 problems.
- `npm run lint` (full repository) — same 4 pre-existing errors as prior packages left, in the same two untouched `tools/visual-production-studio` files, unrelated to this audit.
- `npm run test:unit` (full repository, bounded run) — completed in ~115s, **1215/1217 passing** (up from the prior package's 1190/1192 by exactly this audit's 25 new tests). The 2 failures are the same pre-existing, out-of-scope `tools/project-dashboard/roadmap-data.test.ts` failures already documented by prior packages — not caused by, and not fixed by, this audit.

## 12. What this package explicitly did not do

Did not change the 23-AC/58-Range matrix, knowledge obligations, knowledge assertions, lessons, storyboards, source-acquisition requirements, proposition-coverage states, the technical-source dossier, or any visual asset. Did not select or browse for any curriculum evidence beyond what already exists in the repository. Did not classify any proposition as required, foundational, contextual, or out of scope. Nothing pushed.

The Project Architect will review this ledger and the 32 flagged rows and make the actual scope decisions; a separate qualification-scope contamination remediation package (if any) will be governed independently after this review.
