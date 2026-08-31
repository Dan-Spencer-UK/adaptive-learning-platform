# CC-15B — Unit 202 Dossier-Candidate Provenance Binding and Evidence-Report Correction: Evidence Report

**Status:** implementation-complete, review-ready. A narrow correction to the unpushed CC-15A commit, fixing exactly two Project-Architect-identified defects: (A) residual-gap reporting that did not reconcile with the actual machine data, and (B) a VERIFIED-proposition provenance gate that stopped at source-level approval and therefore still permitted ambiguity between several dossier candidates resolving to the same governed source. No supplemental source acquisition, source selection, curriculum-scope redesign, knowledge reconstruction, or lesson/storyboard work was performed.

**Authority boundary:** unchanged from CC-15/CC-15A. Every one of the 67 dossier candidates remains exactly what the approved dossier named. Candidate-to-locator bindings were populated **only** from already-existing CC-15/CC-15A locators — no new retrieval, no new source, no re-scoping, no proposition turned green.

## 1. Defect A: residual-gap accounting did not reconcile with the machine data

The CC-15A evidence document (`CC-15A-UNIT202-TECHNICAL-SOURCE-COVERAGE-INTEGRITY-CORRECTION.md`) reported the 20 post-correction residual propositions as "9 `SOURCE_GAP` / 11 `CONDITIONAL_SOURCE_GAP`" and its itemised list omitted one existing record entirely (`electronic-systems-and-applications` — "Motor control: rectification and controlled switching/protection at block-function level.", a `CONDITIONAL_SOURCE_GAP`). Both were manually-typed prose errors — the underlying `unit202-technical-source-verification.ts` data was never wrong.

**Independently recomputed this session** (before any code change, by counting `coverageState` occurrences directly in the committed dataset): the real split is **7 `SOURCE_GAP` + 13 `CONDITIONAL_SOURCE_GAP` = 20**, confirmed identical after `buildReport()`'s own machine derivation (§4 below). The CC-15A document has been corrected in place (§2, §7 there now carry explicit "Correction (CC-15B review)" notes rather than silently rewritten prose — CC-15's and CC-15A's own history is preserved, not erased).

**Historical count also corrected.** CC-15A's document stated "21 records before this package"; the actual figure, confirmed by extracting `scripts/content/data/unit202-technical-source-verification.ts` at commit `5336e2e` (CC-15's final committed state, before any CC-15A edit) and counting `coverageState` occurrences directly (`grep -c`), is:

- **CC-15 residual (commit `5336e2e`):** 11 `SOURCE_GAP` + 17 `CONDITIONAL_SOURCE_GAP` = **28**.
- **CC-15A's 8 corrections** (pulley mechanical advantage/supporting strands; pulley effort determination; sine periodic-time/frequency support; T=1/f; frequency/period conversion; minutes-to-seconds; fuse operation; wireless practical advantage) — each moved one proposition record from a gap state to `VERIFIED`.
- **CC-15A residual (commit `0ef4d9c`, before this package's own binding/reporting fix):** 28 − 8 = **20**, confirmed by direct recount: 7 `SOURCE_GAP` + 13 `CONDITIONAL_SOURCE_GAP`.

No proposition-coverage record changed state in CC-15B itself — this defect was reporting-only, now fixed by making the report machine-derived (§3) rather than by touching the dataset.

## 2. Defect B: source-level trust was insufficiently precise

**Problem:** CC-15A's schema hardening required a `VERIFIED` proposition's cited locator to resolve through a `VERIFIED` `sourceVersion` to a source that had **at least one** `approvedSources` record with `status: "VERIFIED"`. This is SOURCE-level trust. The approved dossier is CANDIDATE-level governance — several approved dossier candidates may legitimately resolve to the same governed source object (e.g. several approved sections of one OpenStax volume; in the real Unit 202 dataset, University Physics Volume 2 alone supplies 20 of the 67 dossier candidates, all sharing one `sourceKey`). Under the old rule, if candidate A (`RETRIEVAL_FAILED`) and candidate B (`VERIFIED`) shared a `sourceKey`, a proposition citing evidence that actually belonged to A's (never-retrieved) section would incorrectly pass, laundered by B's unrelated success.

**Fix — explicit candidate-to-locator binding** (`packages/content-schema/src/technical-source-verification.ts`):

`approvedTechnicalSourceSchema` gained a new required-shaped field:

```ts
verifiedSourceLocatorKeys: z.array(stableKey).default([])
```

with two new per-candidate rules (enforced by the schema's own object-level `superRefine`, independent of the manifest-level checks below):

- `status === "VERIFIED"` → `verifiedSourceLocatorKeys` must be non-empty (a VERIFIED candidate that names no locator it was actually checked against is exactly the ambiguity this field exists to close).
- `status === "RETRIEVAL_FAILED"` or `"APPROVED_NOT_VERIFIED"` → `verifiedSourceLocatorKeys` must be empty (a candidate that never succeeded can never claim a verified locator, regardless of what any other candidate on the same source claims).

The manifest-level `superRefine` was rewritten from a source-level check to a two-step candidate-level one:

1. **Validate every VERIFIED candidate's own bindings.** For each `verifiedSourceLocatorKeys` entry: the locator must exist; it must resolve to an existing `sourceVersion`; that `sourceVersion.verificationStatus` must be `"VERIFIED"`; and — the specific new precision — `sourceVersion.sourceKey` must equal **this candidate's own declared `sourceKey`**, never merely *some* source. Only locators that survive all four checks are collected into a `candidateVerifiedLocatorKeys` set.
2. **Gate every VERIFIED proposition.** Every locator a `VERIFIED` proposition-coverage record cites must be a member of that set — i.e. explicitly bound, chain and all, to a candidate whose own status is `VERIFIED`. A structurally valid locator with no such binding, or one bound only to a non-VERIFIED candidate, is rejected with a message naming the exact locator, candidate(s) and reason.

Legitimate reuse remains fully supported: two `VERIFIED` candidates sharing one `sourceKey`/`sourceVersion`, each independently declaring its own `verifiedSourceLocatorKeys`, both pass — proven by adversarial test J (§5).

## 3. Machine-derived reporting

`scripts/content/validate-unit202-technical-source-verification.ts`'s `Report` interface and `buildReport()` gained:

- `approvedNotVerifiedSourceCount` (candidate status counts are now complete: VERIFIED / RETRIEVAL_FAILED / APPROVED_NOT_VERIFIED).
- `totalPropositionCount`, `verifiedPropositionCount`, `sourceGapCount`, `conditionalSourceGapCount` — each derived directly from `verification.propositionCoverage`, never independently typed.
- `residualPropositions: { clusterKey, requirementText, coverageState }[]` — every non-`VERIFIED` record, exactly once, machine-derived.

`formatReport()` now prints all of the above, so the CLI's own text output (`npm run source-verification:report`) is itself the reconciliation, not a separately-maintained document.

Two new regression tests (`validate-unit202-technical-source-verification.test.ts`, real-instance block) prove this mechanically rather than merely printing it:

- `verifiedPropositionCount + sourceGapCount + conditionalSourceGapCount === totalPropositionCount`, and `totalPropositionCount === unit202TechnicalSourceVerification.propositionCoverage.length`.
- `residualPropositions` has exactly the same length as the live data's non-`VERIFIED` records, contains no duplicate `clusterKey::requirementText` pairs, contains every one of them with the matching `coverageState`, and contains nothing `VERIFIED`.

## 4. Binding the existing 67-candidate data

All 67 `approvedSources` entries in `scripts/content/data/unit202-technical-source-verification.ts` were updated:

- **63 `VERIFIED` candidates** — each given an explicit `verifiedSourceLocatorKeys` array naming the exact pre-existing locator(s) that dossier candidate's own approved section/role corresponds to (cross-checked against the approved dossier's own per-`SRC-*` role/section descriptions, never guessed from proximity). Multi-section candidates (e.g. `SRC-OPENSTAX-PHYSICS-SIMPLE-MACHINES` binding both `loc-physics-simple-machines` and the CC-15A-added `loc-physics-simple-machines-pulleys`, since both locators are from the same approved §9.3 section) bind every locator that belongs to that one candidate's section. The 20 `SRC-OPENSTAX-UP2-*` candidates sharing one `sourceKey` each bind only their own chapter's locator(s), never a sibling's.
- **4 `RETRIEVAL_FAILED` candidates** (`SRC-YOKOGAWA-POWER-MEASUREMENT`, `SRC-ST-AN3168-DIAC-TRIAC-DIMMER`, `SRC-OFCOM-PSTN-VOIP-2026`, `SRC-OFCOM-FUTURE-LANDLINE`) — `verifiedSourceLocatorKeys: []`, schema-enforced.
- **0 `APPROVED_NOT_VERIFIED` candidates** exist in the current dataset.

**No candidate required a manufactured binding.** Every one of the 63 `VERIFIED` candidates already had at least one genuinely-corresponding locator already registered by CC-15/CC-15A (a locator is only ever created when actual page/PDF content was retrieved and inspected, per this dataset's own established discipline) — including the one edge case worth calling out explicitly: `SRC-NAGOYA-OCW-ELECTROMAGNETICS` is bound to `loc-nagoya-fleming-left`/`loc-nagoya-fleming-right`, honestly, even though those two locators' content proved insufficient to VERIFY either Fleming's-rule proposition (both remain `SOURCE_GAP`). This is not a contradiction: `verifiedSourceLocatorKeys` records that the candidate's own retrieval-and-inspection step succeeded against those exact locators (a source-integrity fact, matching this candidate's `sourceApprovalStatusSchema` "VERIFIED" status, which is explicitly about retrieval succeeding, not proposition sufficiency — see the schema module's own header comment), while the propositions those locators were insufficient to establish correctly remain gapped. No CC-15B provenance defect was found requiring Project-Architect escalation under §6 of the task brief.

The real dataset (67 sources, 41 registered `sources`, 37 `sourceVersions`, 75 `sourceLocators`, 126 proposition-coverage records) parses against the hardened schema and passes with **zero** issues — confirmed by running the schema's own `.parse()` (via the CLI validator) before writing any test, not merely asserted afterward.

## 5. Adversarial tests

`scripts/content/validate-unit202-technical-source-verification.test.ts` — the CC-15A "VERIFIED-proposition trust-chain hardening" `describe` block was replaced with "CC-15B ... candidate-to-locator provenance binding", built on a shared two-candidate/one-source fixture (candidate A `RETRIEVAL_FAILED` bound to nothing, candidate B `VERIFIED` bound to `loc-b` only, both declaring `sourceKey: "src-shared"`) so each case varies exactly one thing and exercises `technicalSourceVerificationManifestSchema.parse()` directly — never a reimplementation of the schema's own logic:

| Case | Scenario | Expected |
|---|---|---|
| A | Proposition cites `loc-a` (candidate A's own section) while sibling candidate B is VERIFIED on the same source | **REJECTED** — `loc-a` is bound to no candidate at all, since a `RETRIEVAL_FAILED` candidate is schema-forbidden from claiming any locator; B's success never launders it |
| B | Same fixture, proposition cites `loc-b` (candidate B's own, correctly-bound section) | **PASSES** |
| C | Proposition cites an existing locator bound to no candidate whatsoever | **REJECTED** |
| D | Proposition cites a locator whose only would-be binder is `APPROVED_NOT_VERIFIED` | **REJECTED** (that candidate is schema-forbidden from claiming the locator, so it too resolves to "bound to no candidate") |
| E | Single-candidate variant of A/D for `RETRIEVAL_FAILED` | **REJECTED** |
| F | A `VERIFIED` candidate claims a locator that actually resolves to a *different* `sourceKey` than the candidate declares | **REJECTED** |
| G | A `VERIFIED` candidate names zero `verifiedSourceLocatorKeys` | **REJECTED** |
| H | A `RETRIEVAL_FAILED` candidate (and, separately, an `APPROVED_NOT_VERIFIED` one) claims a `verifiedSourceLocatorKeys` entry | **REJECTED**, both variants |
| I | The bound locator's `sourceVersion.verificationStatus` is not `VERIFIED` | **REJECTED** |
| J | Two `VERIFIED` candidates legitimately share one source *and* one `sourceVersion`, each with its own explicit locator binding, each cited by a different proposition | **PASSES**, both propositions |
| K | The pre-existing duplicate `clusterKey`+`requirementText` masking gate | **still enforced** under the new architecture |
| — | A `SOURCE_GAP`/`CONDITIONAL_SOURCE_GAP` record is unaffected by an untrustworthy chain | **PASSES** (not claiming VERIFIED) |

13 tests in the new block (all of A–K plus the two supporting cases), plus the two pre-existing real-data tamper tests that reference the trust chain were re-pointed at the new, more precise rejection message (`removing an approved dossier source that backs VERIFIED propositions...` now expects `/not bound (via verifiedSourceLocatorKeys) to ANY dossier candidate/`, since removing a candidate entirely — rather than merely changing its status — leaves its locators with zero binders under the new architecture), plus the two new §3 reconciliation tests. **40 tests total** in this file (up from CC-15A's 33), all passing.

## 6. Corrected proposition-state counts (post-CC-15B, machine-derived)

Recomputed by `buildReport()` — no manually-maintained figure:

- **Approved dossier IDs:** 67/67 represented, 0 missing, 0 unapproved, 0 duplicate.
- **Source status:** 63 `VERIFIED` (all now with explicit `verifiedSourceLocatorKeys`), 4 `RETRIEVAL_FAILED`, 0 `APPROVED_NOT_VERIFIED`.
- **Proposition records:** 126 total = **106 `VERIFIED`** + **7 `SOURCE_GAP`** + **13 `CONDITIONAL_SOURCE_GAP`** (unchanged from CC-15A's actual — never-before-correctly-reported — split).
- **Clusters:** 13 `FULLY_SOURCED`, 7 `PARTIAL`, 0 `UNSOURCED` (unchanged — this package touched provenance/reporting, not proposition states).
- **Source-Acquisition Manifest:** 13 `SOURCED`, 7 `UNSOURCED` (unchanged).

## 7. Exact 20 residual propositions (mechanically reconciled)

Identical in substance to CC-15A's corrected §7 list (this package changed no proposition state), now printed directly by `formatReport()` and proven by the two new regression tests in §3 to be the complete, non-duplicated, exactly-matching set:

**SOURCE_GAP (7):** wattmeter measurement principle · Fleming's left-hand rule · Fleming's right-hand rule · security-alarm transistor+thyristor topology (dossier-mandated) · dimmer capacitor/DIAC/TRIAC chain · telephone master-socket component-role currency (dossier-mandated) · TRIAC's own bidirectional operation.

**CONDITIONAL_SOURCE_GAP (13):** four operations on fractions/decimals/percentages + proportional reasoning · fractional indices as roots · statistical range definition · computing range · wattmeter connection topology · combined-multimeter/wattmeter recognition · generic force definition · tungsten/porcelain conductor/insulator examples · "electromagnet"/relay/contactor terminology · motor-control "protection" function · full-wave/bridge rectifier form · schematic symbols for all 13 listed components · physical appearance of all listed components.

Full per-item detail (source, exact reason, prior corrections where applicable) is unchanged from CC-15A §7 (now corrected in place there) — not duplicated here.

## 8. Telephone / curriculum scope

No telephone curriculum decision made in this package. The resistor/remote-test role, surge-protector role, and master-vs-extension anatomy remain neither sourced nor removed. CC-15A's §8 reporting-only provenance trace stands unchanged; this package added no new telephone-scope material. The security-alarm topology gap was likewise neither resolved nor expanded.

## 9. Validation

- `npx tsc --noEmit -p scripts/content/tsconfig.json` — clean.
- `node scripts/content/validate-unit202-technical-source-verification.ts --check` — PASS, all gates clean (candidate-binding gate included).
- `node scripts/content/validate-unit202-source-acquisition-manifest.ts --check` — PASS, all gates clean.
- `npm run depth-matrix:check` — PASS, all gates clean (unaffected).
- `npx vitest run` on the technical-source-verification suite — **40/40 passing**.
- `npx vitest run` on all three focused suites together — **77/77 passing**.
- `npm run typecheck` (all workspaces) — clean.
- Focused lint on all CC-15B-touched files — clean, 0 problems.
- `npm run lint` (full repository) — same 4 pre-existing errors as CC-15/CC-15A left, in the same two untouched `tools/visual-production-studio` files.
- `npm run test:unit` (full repository, bounded run) — completed in ~107s, **1190/1192 passing** (up from CC-15A's 1183/1185 by exactly this package's 7 net-new tests, 40 vs CC-15A's 33). The 2 failures are the same pre-existing, out-of-scope `tools/project-dashboard/roadmap-data.test.ts` failures CC-14/CC-15/CC-15A already documented — not caused by, and not fixed by, this package.

## 10. What this package explicitly did not do

No knowledge-corpus assertion, lesson, capability, storyboard or visual asset was authored, reconstructed, approved or altered. No replacement or additional technical source was selected or acquired. No proposition-coverage record's `coverageState` changed. No curriculum-scope, depth, or proposition-necessity decision was made — the telephone resistor/surge-protector/master-vs-extension clauses were neither sourced nor removed, and the security-alarm topology gap was neither resolved nor expanded. No unapproved source was promoted to `FACTUAL_AUTHORITY`. Package 3 remains not authorised/not implemented. Nothing pushed; `0ef4d9c` was not amended.

The next gate is Project Architect review of this correction; a separate qualification-scope contamination audit (telephone and related clauses) will be governed independently after CC-15B.
