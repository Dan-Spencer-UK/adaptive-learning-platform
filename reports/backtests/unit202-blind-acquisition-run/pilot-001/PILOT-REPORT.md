# CC-24 Blind Technical-Evidence Acquisition Pilot -- pilot-001

15 fixed `evidenceRequirementId`s (frozen in `PILOT-SELECTION.json` before any web acquisition began), acquired via real public-web search and retrieval. **13 VERIFIED, 2 SOURCE_GAP.** No historical benchmark comparison occurred. The full 213-requirement run was not started.

## Per-requirement results

| # | Requirement (short) | Mode | Spec mode | Status | Source | Authority class |
|---|---|---|---|---|---|---|
| 1 | Fractions | TOPIC_BREADTH_COVERAGE | OPEN | VERIFIED | OpenStax *Prealgebra 2e* §4.1 | ACADEMIC_OR_RESEARCH_INSTITUTION |
| 2 | Formula transposition | PROCEDURE_COVERAGE | OPEN | VERIFIED | OpenStax *Elementary Algebra 2e* §2.6 | ACADEMIC_OR_RESEARCH_INSTITUTION |
| 3 | Temperature: SI unit/symbol | EXACT_FACT | OPEN | VERIFIED | NIST, "SI Units – Temperature" | PRIMARY_NORMATIVE_OR_STANDARDS_BODY |
| 4 | V = IR (Ohm's law) | FORMULA_OR_RULE | KNOWN | VERIFIED | OpenStax *University Physics Vol. 2* §9.4 | ACADEMIC_OR_RESEARCH_INSTITUTION |
| 5 | F = mg | RELATIONSHIP | KNOWN | VERIFIED | OpenStax *University Physics Vol. 1* §5.4 (as w=mg) | ACADEMIC_OR_RESEARCH_INSTITUTION |
| 6 | Right-hand grip rule | OPERATIONAL_USE_RULE | OPEN | VERIFIED | Le Moyne College Physics Faculty, "Magnetic Fields: Right Hand Rules" §0.6 | AUTHORITATIVE_TECHNICAL_REFERENCE |
| 7 | Fleming's left-hand rule | OPERATIONAL_USE_RULE | OPEN | **SOURCE_GAP** | -- | -- |
| 8 | Fleming's right-hand/generator rule | OPERATIONAL_USE_RULE | OPEN | **SOURCE_GAP** | -- | -- |
| 9 | f = N × P (frequency/pole pairs) | FORMULA_OR_RULE | KNOWN | VERIFIED | Workforce LibreTexts, "Frequency and Alternators" §3.5 (as f=PN/120) | ACADEMIC_OR_RESEARCH_INSTITUTION |
| 10 | Vrms ≈ 0.707 × Vpeak | RELATIONSHIP | KNOWN | VERIFIED | Engineering LibreTexts (Fiore), §1.2 "Root Mean Square Measurement" | ACADEMIC_OR_RESEARCH_INSTITUTION |
| 11 | Capacitor: operating principle | OPERATING_PRINCIPLE | OPEN | VERIFIED | OpenStax *College Physics 2e* §19.5 | ACADEMIC_OR_RESEARCH_INSTITUTION |
| 12 | TRIAC: operating principle | OPERATING_PRINCIPLE | OPEN | VERIFIED | IIT Kharagpur, Module 1 / Lesson 4 §4.7.1 | ACADEMIC_OR_RESEARCH_INSTITUTION |
| 13 | Wireless control systems: application/function | APPLICATION_FUNCTION | OPEN | VERIFIED | Lutron, Caséta product page | ORIGINAL_MANUFACTURER_OR_VENDOR |
| 14 | Wattmeter: measures power + sensing arrangement | EXACT_FACT | OPEN | VERIFIED | Philadelphia University (Dr. Firas Obeidat), "Power Measurement" slide 3 | ACADEMIC_OR_RESEARCH_INSTITUTION |
| 15 | Telephone: capacitor → ringer | EXACT_FACT | OPEN | VERIFIED | Technical University of Cluj-Napoca, "The phone device – basic schematic" | ACADEMIC_OR_RESEARCH_INSTITUTION |

Full queries, every candidate (chosen and rejected, with reasons) are in `PILOT-SEARCH-LOG.json`. Exact locators and retrieved passages are in `PILOT-RETRIEVAL-LOG.json`. Canonical `TechnicalEvidenceAcquisitionResult` objects plus pilot audit extensions are in `PILOT-RESULTS.json`.

## Unresolved / partial / conflicted requirements

**Requirements 7 and 8 are the only unresolved items.** Both are `OPERATIONAL_USE_RULE` / `OPEN_TECHNICAL_QUESTION` targets (Fleming's left-hand rule for motors, Fleming's right-hand/generator rule) whose four permitted authority classes for this pilot (`GOVERNMENT_OR_REGULATOR`, `PROFESSIONAL_BODY`, `AUTHORITATIVE_TECHNICAL_REFERENCE`, `ORIGINAL_MANUFACTURER_OR_VENDOR`) exclude `ACADEMIC_OR_RESEARCH_INSTITUTION` -- the class that resolved most of this pilot's other requirements. Genuinely authoritative UK physics-education candidates were identified (IOP Spark, Williams College Physics, Oxford Reference) but all returned HTTP 403 or a paywall to the retrieval tool. Every other retrievable candidate fell into a forbidden category (Wikipedia, commercial tutoring/SEO sites, unattributed worksheets) or an authority class not on this requirement's permitted list (unaffiliated personal teacher pages). Both are recorded as honest `SOURCE_GAP`s with `unresolvedDimensions: [DIRECTIONAL_MAPPING, ROLE_MAPPING, CORRECT_USE_CONDITIONS]` -- no answer was assumed or fabricated.

No conflicts and no partial verifications occurred among the 13 resolved requirements. Two KNOWN_CLAIM_TO_VERIFY requirements (5, 9) matched their target's stated formula only in an algebraically equivalent notation (w=mg vs F=mg; f=PN/120 vs f=N×P) -- recorded explicitly as equivalent forms, not conflicts, consistent with the adapter's own established pattern for other formula targets.

## Access / blindness

Every local read this pilot performed is in `PILOT-ACCESS-AUDIT.json`: one authorized read of the frozen target manifest (via the adapter), two authorized read-backs of the pilot's own generated artifacts, and three deliberate denial demonstrations (historical-material path, a `..`-traversal path, an absolute Windows path) -- all three denied before any filesystem access, proving Correction B's fixes hold. No blindness breach occurred. The one process deviation (an accidental `build-preflight.ts` run exposing only aggregate plan counts, never claim content or answers) is disclosed in full in `PILOT-RUN-MANIFEST.json`.

## Generic contract limitations surfaced

Four gaps in the canonical `TechnicalEvidenceAcquisitionResult`/`CandidateSourceRecord`/`NormalizedTechnicalClaim` shapes were identified while assembling this pilot's audit trail (query provenance, chosen/rejected candidates, per-claim dimension binding, authority-class rationale, publisher-verification record) -- none required touching the generic contract; all were carried in each result's `pilotAudit` sibling field instead. Full detail in `PILOT-RUN-MANIFEST.json.contractLimitationsForProjectArchitectReview`.

## Explicitly not performed

No comparison against the sealed historical benchmark occurred at any point before or during freeze. The full 213-requirement acquisition run was not started. No qualification scope, learner knowledge, lessons, storyboards, questions, or visuals were created or modified. No redesign of the generic architecture was performed.
