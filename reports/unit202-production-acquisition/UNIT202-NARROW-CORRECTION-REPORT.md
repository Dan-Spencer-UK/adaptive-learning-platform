# Unit 202 Narrow Evidence, Curriculum-Modelling and Validation Correction

**Starting HEAD:** `f12d968b37a204a2f608bd1afcc64ef2a74adbcb`
**Final HEAD:** `691a39a5c639b4a97fd24718b4a44868a68c1b1e`
**Scope:** narrow correction only -- no architecture redesign, no authority-policy widening, no learner-facing lesson authoring, no gap forced green. Batches 01-03 identities and evidence preserved (confirmed byte-identical to baseline `8127768` throughout). The two pre-existing unrelated dirty files were never staged, edited, formatted or regenerated; their SHA-256 hashes are identical before and after this pass (see `PROTECTED-FILE-HASH-PROOF.txt`).

## A. Authority-class canonicalisation

**Finding:** 32 embedded `candidateSource.authorityClass` mismatches across Batch 04, all electronics-tutorials.ws (`SRC-ETW-*`) sources embedded as `AUTHORITATIVE_TECHNICAL_REFERENCE` while the canonical `SOURCE-REGISTER.json` had already reclassified that publisher as `AUTHORITATIVE_EDUCATIONAL_REFERENCE`. This let several `SYMBOL_OR_CONVENTION` rows (whose permitted classes exclude `AUTHORITATIVE_EDUCATIONAL_REFERENCE`) appear falsely VERIFIED.

**Correction:** every embedded label corrected to the canonical register value; every `normalizedClaim` resting solely on a now-unpermitted source removed; every row re-adjudicated purely from remaining genuinely permitted evidence.

**Two data-integrity bugs found and fixed in the same sweep:** the resistance and impedance `UNIT_SYMBOL` rows both cited `SRC-BIPM-BROCHURE` in a `normalizedClaim` without ever registering it as a candidate source. Fixed by registering the candidate (same passage already used identically elsewhere in this batch -- no new evidence acquired).

**Net effect:** power-factor `UNIT_SYMBOL` genuinely downgraded `PARTIALLY_VERIFIED -> SOURCE_GAP` (its only claim depended on the now-corrected class); every other affected row (current, voltage, resistance x2, power, impedance x2, capacitance, inductance) remained `VERIFIED` on independently-permitted evidence (EOLSS/BIPM/IEC) once the unpermitted claims were removed. `EQCT-LP-13` re-adjudicated and remains genuinely READY.

**A second, more serious governance defect found in Batch 05:** the `dot-cross-page-convention` row carried an ad hoc, self-declared `paAuthorityPolicyAdjudication` (`CC-BATCH05-PA-AUTHORITY-ADJUDICATION-001`) with no genuine external Product Architect record, no code-level backing, and no fail-closed invariant -- directly contradicted by PROJECT-STATUS.md's own claim that no authority class was widened in that pass. **Inspected passage confirming the reversion was correct:** the frozen plan's own `sourceAuthorityClasses` for this requirement (`PRIMARY_NORMATIVE_OR_STANDARDS_BODY, PROFESSIONAL_BODY, AUTHORITATIVE_TECHNICAL_REFERENCE`) was never itself widened -- only a side-channel field admitted academic sources. Reverted to a genuine `SOURCE_GAP` after a fresh bounded re-search (IEC Electropedia, IEEE Std 315-1975/ANSI Y32.2-1975, IET "Units & Symbols for Electrical & Electronic Engineers") found nothing on point. `EMI-LP-03` reclassified `DEFERRED_CONTEXT_ONLY` (non-blocking, since it is `CONTEXTUAL_SUPPORT_ONLY` per the frozen plan's own `acquisitionPriority`).

**Distinguished from a genuine widening:** the `right-hand-grip-rule` row's widened `sourceAuthorityClasses` (including `ACADEMIC_OR_RESEARCH_INSTITUTION`/`AUTHORITATIVE_EDUCATIONAL_REFERENCE`) IS legitimate -- **inspected passage:** `scripts/backtests/unit202-evidence-acquisition-preflight/unit202-adapter.ts`'s `UNIT202_SOURCE_AUTHORITY_POLICY` and its fail-closed `assertUnit202DirectionalRuleInvariant` (refuses planning unless Unit 202 has exactly 3 `OPERATIONAL_USE_RULE` targets with exactly the same dimension set), with an explicit code comment tracing it to "PA review of CC-24 pilot-001, requirement 6 ('right-hand grip rule'), and the PA's follow-up correction." This row was left VERIFIED, with only a data-integrity fix (three genuinely-permitted claims registered as candidate sources for the first time).

New registry: `UNIT202-PA-AUTHORITY-DECISION-REGISTRY.json` lists the one genuinely-recorded PA decision (Batch 01's engineering-notation adjudication) and records the removed ad hoc field for audit purposes.

## B. Validator false-green repair

Checks 49-57 added (all additive; checks 1-48 unchanged):
- 49: embedded authority-class labels match the canonical register.
- 50: every `normalizedClaim`'s source is a registered, permitted candidate, or its row's `paAuthorityPolicyAdjudication.id` is in the PA decision registry.
- 51: every VERIFIED row has genuine permitted-class support for every required dimension.
- 52: no `PARTIALLY_VERIFIED` row has an empty `unresolvedDimensions` array (the exact self-contradiction found on the pre-correction EQCT-LP-07 row).
- 53: no dimension is simultaneously satisfied and unresolved on the same row.
- 54: no REQUIRED_MASTERY/MIXED_REQUIRED_AND_CONTEXT learning point depends on a DEFERRED_CONTEXT_ONLY/RETIRED_OUT_OF_SCOPE prerequisite.
- 55: no deferred/retired learning point appears in the core V1 instructional sequence.
- 56: the two protected files are byte-identical to their pass-start SHA-256 hashes.
- 57: the runtime delta mapping never marks content taught-correct against held/partial/source-gap/retired governed evidence without an explicit `contentAheadOfEvidenceRisk` flag.

## C. Re-adjudications

**EQCT-LP-07 (power factor):** the requirement mode was NOT changed (found genuinely answerable as `SYMBOL_OR_CONVENTION::UNIT_SYMBOL`). **Inspected passage:** IEC 60050 IEV 112-03-04 "factor" -- "A factor is a quantity of dimension one", with examples explicitly including "power factor" by name (`PRIMARY_NORMATIVE_OR_STANDARDS_BODY`). This closes the gap directly, not by inference. EQCT-LP-07 -> READY.

**EMI-LP-17 (simple AC generator coil):** the "coil" requirement had been answered as if it demanded a generic IEC 60617 circuit-schematic symbol (AC6.2/EDA-LP-16's question). **Inspected passage:** `reports/backtests/unit202-evidence-acquisition-benchmark/UNIT202-BLIND-ACQUISITION-TARGETS.json`, entry `acquisitionTargetId: "ACQ-123"`, field `"ac": "AC5.4"` -- confirming this requirement genuinely belongs to AC5.4 (the generator), not AC6.2. Its genuine mastery (recognising the coil as a labelled generator part) is already answered by the registered DOE Fundamentals Handbook evidence ("field coils receive excitation and produce the magnetic flux"; "the armature ... consists of many coils of wire..."). EMI-LP-17 -> READY (all 4 required dimensions now VERIFIED); its `REPRESENTATIVE_DIAGRAM_AUTHORING` dependency is resolved since DOE Module ES-07 Figure 1 already shows loop+field+slip rings+brushes together.

**EQCT-LP-12 (inductance vs. inductive reactance):** wording corrected from "a fixed coil property" to the same precise ideal/basic-component-model qualification already used for the sibling EQCT-LP-11, removing the implication that inductance is universally fixed for a real component. No evidence-status change (already READY); a wording-precision fix only.

**EDA-LP-27/EDA-LP-28 prerequisite structure:** `EDA-LP-28` (`MIXED_REQUIRED_AND_CONTEXT`) listed `EDA-LP-27` (`CONTEXTUAL_SUPPORT_ONLY`/`DEFERRED_CONTEXT_ONLY`) as a hard `prerequisiteLearningPointIds` gate. Removed: EDA-LP-28's required facet needs only the master socket's existence, already established by the READY, REQUIRED `EDA-LP-26`. The same defect was independently found (by the new check 54) on `EMI-LP-05`/`EMI-LP-13` against `EMI-LP-03` and fixed the same way.

## D. Bounded real source acquisition

**EMI-LP-16 (Fleming's right-hand rule):** ten independent access routes attempted (the user-identified studylib.net copy direct and via proxy, archive.org, two mirrored PDFs exceeding the 10 MB fetch limit, Google Books, a since-removed WordPress mirror, a solutions-manual excerpt, a Studocu search). All failed for disclosed reasons. **Remains genuinely held** -- the Hughes 12th ed. p.145 citation trail is confirmed genuine but unread.

**EDA-LP-28 (telephone capacitor-to-ringer):** **inspected passage:** IXYS/Littelfuse AN-144 "Impulse Noise Benefits of Line Card Access Switches," Section 3.1 "Ringing Loads," page 4 -- "Historically, the ringer in a telephone was an inductive type device consisting of a coil applying a magnetic force to a clapper that struck against a bell. This circuit needed a DC blocking capacitor and the value of the capacitor was chosen to make the circuit resonant slightly above 20Hz." Combined transparently with Openreach SIN 351 (UK topology/presence/connection) -- AN-144 is NOT claimed to describe the Openreach NTE specifically, only the general mechanism of the topology SIN 351 independently confirms exists there. EDA-LP-28 -> READY. Resistor line-testing attribution remains contextual and genuinely unevidenced.

**EDA-LP-25 (SCR alarm/sounder):** STMicroelectronics AN4607 re-inspected, confirmed to add nothing beyond its already-recorded generic "light alarms" mention. **Inspected passage (found, read, and rejected):** Nuts & Volts magazine, "Security Electronics Systems and Circuits" Part 4 -- "This diagram also shows how the circuit can be made self-latching by wiring R4 across the bell so that the SCR anode current does not fall to zero as the bell self-interrupts" / "Switch S1 enables the circuit to be reset (unlatched) when required." Genuinely on-point, but Nuts & Volts is a hobbyist/enthusiast electronics magazine, not a standards body, government body, academic institution, or established technical reference by this project's own consistently-applied bar. **Remains genuinely held**, not forced through.

**EDA-LP-16 (component symbols):** untouched -- remains the genuine final evidence blocker (current BS EN/IEC 60617 symbol geometry still inaccessible), per instruction not to force it green using the 1975 ANSI/IEEE scan as a substitute for the current standard.

## E. Multi-axis runtime delta mapping

Rebuilt as schema v2 with independent axes (see `UNIT202-RUNTIME-CURRICULUM-DELTA-MAPPING.json`). Preserves and sharpens the two urgent findings (EDA-LP-25, EDA-LP-28 both had live, actively-assessed runtime content matching a governed-retired/unevidenced claim); adds two new scope-creep findings (MM-LP-14, EQCT-LP-13) and EMI-LP-16's content-ahead-of-evidence risk.

## F. Final state

- **Core release blockers: 3** (EMI-LP-16, EDA-LP-16, EDA-LP-25) -- down from the original 16 held points.
- **Contextual deferrals: 3** (EDA-LP-17, EDA-LP-27, EMI-LP-03).
- **Validator: 57/57.** **Vitest: 146/146.** **TypeScript: clean** (`@alp/technical-evidence-engine`, `build-review-pack.ts`). **`git diff --check`: clean.** **Review-pack regeneration: idempotent.**
- **Batches 01-03: byte-identical to baseline `8127768`** throughout.
- **Protected files: byte-identical SHA-256** before and after (see `PROTECTED-FILE-HASH-PROOF.txt`).
- **Acquisition/curriculum-input freeze readiness:** NOT YET -- 3 core blockers remain, each genuinely unresolved after real, bounded, permitted-class-respecting acquisition attempts, none fabricated closed.
- **Learner-facing Unit 202 completion readiness:** separate and further away -- see `UNIT202-RUNTIME-CURRICULUM-DELTA-MAPPING.json` for the full production delta (unchanged in scale from the prior pass's mapping; two safety-relevant obsolete-content findings still require runtime-level correction independent of this pass's governed-evidence work).

This report is a record of what changed and why. It does not constitute freeze acceptance -- that remains a Product Architect decision after independent review.
