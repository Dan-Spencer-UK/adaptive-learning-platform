# CC-14 — Unit 202 Depth & Performance Matrix + Source-Acquisition Manifest: Evidence Report

**Status:** implementation-complete, review-ready. Recovered and completed from a stalled prior session's partial work (see "Recovery" below).

**Authority boundary:** every substantive depth/performance/scope judgment in the matrix — required learner performance, required depth dimensions, supporting-knowledge scope, scope ceilings, confidence, matrix status, and every review flag — was authored by the Project Architect/ChatGPT and approved by the Product Owner in `unit202-depth-performance-matrix.md` (2026-08-30 session). Claude Code performed mechanical encoding, validation, mapping-trace, and diagnostic work only. This document records that implementation work; it does not restate or re-justify the substantive judgments themselves.

## 1. Recovery

A prior Claude Code session had already produced substantial, correct partial work for this package and stalled after a `tsc --noEmit` run surfaced TypeScript errors. This session inventoried the full dirty working tree, read every uncommitted/untracked file in full, and confirmed the prior work was largely complete and high-quality — the matrix data (23/23 ACs, 58/58 Range items, all review flags), the source-acquisition manifest's 20-cluster structure and full AC/Range coverage, both Zod schemas, both validators, and both real-instance Vitest suites were already substantively correct. Nothing was discarded or re-derived from scratch.

Two genuine defects were found and fixed (see §2), plus one test-infrastructure defect and one test-coverage gap surfaced only once the build was unblocked (see §4).

## 2. Defects found and fixed

1. **`scripts/content/data/unit202-depth-performance-matrix.ts` — assessment-envelope derivation.** `assessmentConditions.approxPassPercentage` was assigned directly from `unit202AssessmentSpecification`'s `approximatePassPercentage`, which is `.optional()` in `assessment-specification.ts` (not every assessment specification publishes a pass boundary) — a `number | undefined` into a required `number` field. Fixed with an explicit, fail-closed guard (`if (spec.approximatePassPercentage === undefined) throw ...`) rather than a fabricated default (`?? 0` was explicitly rejected per the task's own architecture decision) — the matrix and the assessment specification now mechanically agree, with no silent fallback if the source specification's pass percentage is ever removed.

2. **`scripts/content/data/unit202-source-acquisition-manifest.ts` — missing structured array fields.** Per the architect's decision that every cluster carries every structured category consistently (`relatedRangeItems`, `relationshipsOrMechanismsRequiringSupport`, `proceduresOrCalculationRulesRequiringSupport`, `symbolsOrConventionsRequiringSupport`, `physicalOrComponentRecognitionRequirements`, `reviewOrCorrectionFlags`), using an explicit `[]` where a category genuinely does not apply — never omission, never an invented default — most of the 20 clusters were missing one or more of these fields entirely (the prior session's TypeScript-error report). All 20 clusters now carry all six fields explicitly. One cluster (`dc-circuit-power`, AC4.6) was also missing its required non-empty `factualPropositionsRequiringSupport` entirely (a genuine content gap, not a formatting one); a proposition restating AC4.6's own already-approved P=VI relationship was added — no new substantive judgment, purely structural completion of already-approved matrix content.

3. **`docs/architecture/evidence/CC-14-UNIT202-DEPTH-PERFORMANCE-MATRIX-SOURCE.md` — one-character encoding drift.** A byte-for-byte diff against the newly re-attached `unit202-depth-performance-matrix.md` found the two documents identical except for a single character on the "Resistors" Range-item row: the attachment has a correctly-encoded "Ω" there (an inconsistency within the source document's own mojibake, not a new issue), while the previously-committed evidence copy had "Î©" (mojibake). Corrected the evidence copy to match the actual attachment exactly, per this task's explicit instruction to prefer the newly attached source over a prior session's copy where they diverge. No other byte differs between the two files (confirmed by full diff after the fix).

## 3. Encoding-normalisation note (not a defect)

An independent fresh-agent audit (§5) confirmed the attachment's mojibake is not a single deterministic substitution — several distinct original symbols collapsed onto the same corrupted byte sequence during transfer (e.g. the byte pair rendered "â" stands for a hyphen, →, ≈, ∝, or ↔ depending on context; "Ï" stands for either ρ or φ depending on context). Every instance in the governed TS encoding was checked and found contextually and technically correct (e.g. "cos φ" for power factor, "ρ" for resistivity, "R∝L, R∝1/A" for the resistivity proportionality). This is flagged for transparency, not as a defect: recovering the original symbol from lossy mojibake is necessarily an interpretive step, and every interpretation was verified sound.

## 4. Post-fix defects found and fixed while getting tests green

Fixing §2's TypeScript errors unblocked the test suite for the first time this session, surfacing two additional defects the prior session's stall had never let run:

4. **`validate-unit202-depth-performance-matrix.test.ts` — Windows-incompatible file read.** `readFileSync(new URL("./data/....ts", import.meta.url), "utf8")` threw `TypeError: The URL must be of scheme file` on this Windows environment. Replaced with this repo's own established idiom elsewhere (`check-mobile-projection.test.ts`): `fileURLToPath(import.meta.url)` + `dirname`/`join`.

5. **`validate-unit202-depth-performance-matrix.ts` — `EXPECTED_REVIEW_FLAG_SUBSTRINGS` coverage gap.** The list's first entry ("Handout table uses °C; authoritative SI source required.") is AC2.1's **Range-item-level** Temperature-row flag, not AC2.1's own **AC-level** review flag — meaning AC2.1's actual AC-level flag had zero substring coverage in this mechanical drop-detection list, which a tamper-and-assert regression test then caught (removing AC2.1's AC-level flag produced 0 missing substrings, not >0 as the test expected — proving the gate was not actually testing what it claimed). Fixed by adding AC2.1's own AC-level flag text as its own entry, and by adding the Range-item-level Photo-row flag, which had no coverage at all. All 18 AC-level and all 8 distinct Range-item-level review-flag texts (`3` of which legitimately share the literal substring "Anti-overdepth guard.") are now represented.

Also closed one non-defect completeness note the information-loss audit raised (§5): the source document's evidence-hierarchy caveat ("LLM internal knowledge is never source-of-truth provenance. Existing ALP assertions/capabilities/lessons were not used to decide this matrix.") has no dedicated schema field, so it is now also recorded verbatim in the matrix data module's own header comment for full fidelity, alongside where its substance already lived (module header, AC5.4's review flag, and the dedicated "does not import the existing corpus" test).

## 4b. Independent final review finding and fix

A fresh, independent subagent reviewed the complete diff after implementation was otherwise finished, per this task's required final-review step. It found one genuine defect: three `factualPropositionsRequiringSupport` entries in `unit202-source-acquisition-manifest.ts` (`electronic-systems-and-applications` and `electronic-components-operating-principles` clusters) stated more specific technical detail than the approved matrix's own `requiredSupportingKnowledge` text supported — a security-alarm circuit mechanism ("senses a break in a normally-closed loop"), specific telephone master-socket components ("capacitor, resistor, and on older sockets a surge protector") on exactly the sub-topic the matrix itself flags as needing independent currency verification, and a rectifier diode count ("half-wave uses one diode, full-wave/bridge uses four"). None of these came from the approved matrix text; they were added during manifest authoring from general technical knowledge, which is exactly what this task's own governance forbids for an artefact whose entire purpose is to declare technical claims as *not yet* sourced. All three were rewritten to state only what the approved matrix actually supports, with the telephone entry rephrased so it asserts nothing about which components exist, only that their relevance/currency is unestablished. Re-verified clean after the fix: `tsc --noEmit`, both CLIs, both Vitest suites (36/36).

## 5. Attached-matrix revalidation (recomputed independently, not trusted from the prior session)

- **23/23 Assessment Criteria**, **58/58 official Range items** — recomputed by `validate-unit202-depth-performance-matrix.ts`'s `buildReport()`, not merely asserted.
- **18 AC-level review flags**: AC2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 4.1, 4.3, 4.4, 4.8, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2. (5 LOCKED ACs carry none: 1.1, 4.2, 4.5, 4.6, 4.7.)
- **8 Range-item-level review flags**: Temperature (2.1), Resistivity (2.2), Impedance (2.2), Inductance and inductive reactance (2.2), Capacitance and capacitive reactance (2.2), Power factor (2.2), Telephones (6.1), Photo (6.2).
- Evidence hierarchy (5 ranked tiers), source-role separation, the reusable-knowledge principle, and the "do not author lessons yet" next-production-gate instruction are all present in the governed data, word-for-word from the source document.

## 6. Information-loss audit

Performed by an independent fresh subagent with no prior context on this file, comparing the byte-exact evidence copy (`CC-14-UNIT202-DEPTH-PERFORMANCE-MATRIX-SOURCE.md`, post-provenance-comment) against the governed TypeScript encoding, field by field, for all 23 ACs (~250 field comparisons) and all 58 Range rows (~290 field comparisons), plus ~10 document-level fields — roughly 550 discrete comparisons.

**Result: 0 substantive mismatches.** Every AC title, official-Range summary, learner-performance requirement, depth-dimension list, supporting-knowledge text, visual/calculation requirement, calibration text, scope ceiling, confidence value, matrix status, and review flag (AC- and Range-row-level) matches once mojibake is decoded; the assessment envelope and conditions are correctly derived from `unit202-assessment-specification.ts` and match the source table exactly. See §3 above for the encoding-normalisation transparency note this audit also produced, and §4 for the one completeness gap it found and this session closed.

## 7. Source-Acquisition Manifest

`scripts/content/data/unit202-source-acquisition-manifest.ts` — **20 clusters**, grouped by reusable domain-knowledge topic rather than mechanically one-per-AC (three clusters deliberately span two ACs each: work/energy/power/efficiency spans AC3.3+3.4; DC circuit theory spans AC4.4+4.5; magnetism/flux spans AC5.1+5.2):

`foundational-mathematics-for-electrical-work`, `si-units-and-physical-quantities`, `electrical-quantities-and-si-units`, `electrical-measurement-instruments`, `mass-and-weight`, `simple-machines-levers-gears-pulleys`, `work-energy-power-efficiency`, `electron-theory-and-conduction`, `conductors-and-insulators`, `resistance-and-resistivity`, `dc-circuit-theory-series-parallel`, `dc-circuit-power`, `voltage-drop`, `thermal-and-chemical-effects-of-current`, `magnetism-flux-and-flux-density`, `electromagnetism-motor-effect-and-induced-emf`, `ac-generation-single-loop-alternator`, `sine-wave-characteristics`, `electronic-systems-and-applications`, `electronic-components-operating-principles`.

- **AC coverage:** 23/23, independently recomputed (`acsWithoutClusterCoverage: []`).
- **Range coverage:** 58/58, independently recomputed (`rangeItemsWithoutClusterCoverage: []`).
- **Sourced:** 0. **Unsourced:** 20. Verified, not assumed: the live Unit 202 corpus was inspected for any source carrying `sourceRole: "FACTUAL_AUTHORITY"` and none exists — only `NORMATIVE_CURRICULUM` (the C&G handbook) and `OFFICIAL_ASSESSMENT` (the public sample papers) carry an explicit `sourceRole` anywhere in that corpus today. Individual assertions that informally cite external technical sources (BIPM, OpenStax, NIST/SEMATECH) are **not** treated as sufficient repo evidence here, per this task's own governance — that determination belongs to the next, separately-reviewed source-acquisition package.
- **Cross-course reuse rationale:** each cluster's `domainReuseNote` states which existing reusable-domain code it aligns with (e.g. `FM` for foundational maths, `FP` for general physics/SI units, `EL` for core electrical-domain knowledge) or explicitly notes it has no electrical-domain dependency at all — the manifest is a shopping list for domain knowledge, never a Unit-202-owned duplicate.

## 8. Existing-corpus diagnostic

Full detail: `docs/architecture/evidence/CC-14-UNIT202-CORPUS-DIAGNOSTIC.md`. Performed by an independent fresh subagent, read-only — **zero corpus edits made**, confirmed by `git status`/`git diff --stat` before and after. Summary: actual current corpus counts are EL 189 / FP 44 / FM 27 / total 260 assertions, 22 misconceptions (the task brief's ~259/26 figures were off by one on FM/total, now corrected). All 8 explicitly flagged review topics were checked against the live corpus; see the diagnostic report for the full per-topic findings (most are already handled correctly by the existing corpus; two gaps — AC5.4 alternator/frequency content and LDR content for the "photo" ambiguity — are entirely absent; one area — AC2.2 impedance/reactance assertions — sits closer to the matrix's anti-overdepth guard than ideal and is worth attention in the next package). This diagnostic does not approve any of this content for reuse; that determination is explicitly deferred to the next, separately-reviewed package.

## 9. Validators, tests, CLI

- **Schema:** `packages/content-schema/src/depth-performance-matrix.ts`, `packages/content-schema/src/source-acquisition-manifest.ts` (both generic, reusable across future courses — no Unit 202 content in the schema layer).
- **Real data:** `scripts/content/data/unit202-depth-performance-matrix.ts`, `scripts/content/data/unit202-source-acquisition-manifest.ts`.
- **Validators (report + `--check` CLI):** `scripts/content/validate-unit202-depth-performance-matrix.ts`, `scripts/content/validate-unit202-source-acquisition-manifest.ts` — both independently recompute every count/gate from the live data rather than trusting either module's own claims.
- **Root scripts:** `depth-matrix:report` / `depth-matrix:check`, `source-manifest:report` / `source-manifest:check` (added to `package.json`, following the existing `report`/`report:check` naming convention used elsewhere in the repo, e.g. `coverage:matrix`/`coverage:matrix:check`).
- **Tests:** `scripts/content/validate-unit202-depth-performance-matrix.test.ts` (22 tests), `scripts/content/validate-unit202-source-acquisition-manifest.test.ts` (14 tests) — **36/36 passing**.

**Test-evidence classification** (this package is production content-governance tooling, not learner-runtime content — "production-loadable" below means "the exact function the CLI's `--check` flag calls," never learner-runtime wiring):

| Level | Evidence |
|---|---|
| SCHEMA-CAPABLE | Both Zod schemas reject a Range item referencing an unknown AC, an AC missing a required field, an AC with an empty depth-dimension array, a duplicate cluster key, and a `SOURCED` cluster with no evidence citation (tamper-and-assert regressions, both test files). |
| VALIDATOR-CAPABLE | Both `buildReport()` functions independently detect duplicate AC numbers, duplicate Range items, unknown-AC references, mismatched LO numbers, missing required fields, assessment-envelope drift, missing review-flag substrings, AC/Range coverage gaps, and unknown-AC/Range cluster references — proven by deliberately mutated clones of the real data, not merely accepting good data. |
| SYNTHETICALLY TESTED | All of the above tamper-and-assert regressions use a deliberately corrupted clone of the real instance, never a synthetic fixture invented from scratch. |
| REAL-CORPUS-ADOPTED | Both real instances (`unit202DepthPerformanceMatrix`, `unit202SourceAcquisitionManifest`) parse against their schemas without modification and pass every report gate clean. |
| PRODUCTION/TOOLING-LOADABLE | `isReportClean()`/`buildReport()` are the exact functions each CLI's `--check` flag calls (`node scripts/content/validate-unit202-depth-performance-matrix.ts --check`, `... -source-acquisition-manifest.ts --check`) — both run clean in this evidence pass. |

## 10. Broader validation run

- `npx tsc --noEmit -p scripts/content/tsconfig.json` — clean.
- `npm run typecheck` (all workspaces: root, web, calculation-engine, content-schema, diagnostic-engine, domain, evidence-engine, learning-engine, test-fixtures, ui) — clean.
- `npx vitest run` (the two CC-14 test files) — 36/36 passing.
- `npm run lint`, `npm run test:unit` — see the final commit message / final report for exact pass/fail counts against the full repository (any pre-existing unrelated failure, if found, is called out explicitly rather than masked).

## 11. What this package explicitly did not do

No lesson/storyboard authored or changed. No knowledge re-extraction. No broad external source research (the manifest is a shopping list, not a completed sourcing pass). No existing corpus content changed. No review flag silently resolved. Package 3 remains not authorised/not implemented. Nothing pushed.
