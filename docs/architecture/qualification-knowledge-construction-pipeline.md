# Qualification Knowledge-Construction Pipeline

**Status:** governed architecture, implementation-complete for the generic pipeline stage this document covers (candidate generation + gap/conflict analysis). Package: `@alp/qualification-pipeline` (`packages/qualification-pipeline/src/`). This document is the design authority; the package is its operational encoding, proved by the synthetic regression suite in `packages/qualification-pipeline/src/rules.test.ts`.

**Scope of this package:** raw qualification evidence → normalized/validated evidence → learner-performance/knowledge **candidates** → **gap/conflict analysis**. It stops there. It never writes a governed course matrix, knowledge obligation, assertion, or lesson — see §17 (Downstream Gate).

**Independence:** this package has zero dependency on any other workspace package and contains no qualification-specific content or branching. Every example in this document is illustrative; none of the terms used here (or in the package's own test fixtures) may appear as a literal in the package's production source (`types.ts`, `rules.ts`, `index.ts`) — mechanically enforced by a dedicated test.

**Revision history:**
- **CC-18** established the generic pipeline: source-role hierarchy, assessment as a proposition-generation source, AC-vs-Range scope, exemplar/mastery separation, technical-truth/curriculum-scope separation, structured gaps.
- **CC-18A** closed a first round of adversarial-review findings: assessment mapping validated against a registry, category/family relationships required governance, qualification-level separated from prerequisites, prerequisites required a structural (if self-declared) necessity kind, factual claims made independent records, category breadth status made explicit, gap resolver roles made plural, source provenance made mandatory.
- **CC-18B** closes a second round: the pipeline is locked to one qualification per run; the official-unit registry is keyed compositely and conflict-checked; curriculum evidence is itself validated against that registry (not just assessment); the ambiguous boolean pair driving curriculum-candidate creation is replaced by a locked, explicit normalization kind that lets Range members create their own candidates; candidate generation groups by the full `(subject, performanceType)` key so multiple performance types per subject all survive; assessment evidence is validated into a single trusted stream that every downstream consumer must use exclusively; `normalizationBasis` is checked for type-compatibility per evidence type; capability dependencies become an independent, provenance-bearing relation instead of a self-declared curriculum field; technical-truth coverage becomes claim-key-exact instead of subject-matched; factual-claim comparison requires compatible comparison kinds; exemplars carry mandatory provenance and no longer auto-gain technical-truth confidence from their own role; category/family relationships are validated against the qualification and the set of subjects actually present in normalized evidence.
- **CC-18C** (this revision, a narrow final pre-back-test correction) closes five remaining implementation-integrity defects at the same boundary, none of which change the pipeline's design: (1) a normalization proposal that fails provenance validation is now **always** reported as `EVIDENCE_NORMALIZATION_REVIEW`, naming the exact failure — CC-18B still silently dropped a basic blank-`sourceRef`/`sourceLocator` failure in several validating functions and in the `OfficialCurriculumUnit` registry itself, reporting a gap only for the separate, narrower case of a type-incompatible-but-present `normalizationBasis`; (2) `CandidateCapabilityRequirement` is bound to the active `qualificationId`, and `EXPLICIT_CURRICULUM_OPERATION`/`EXPLICIT_ASSESSMENT_OPERATION` derivations must cite a role-**and**-id-matched entry in the correspondingly validated curriculum/assessment stream, closing a loophole where an `EvidenceRef` reusing a real `evidenceId` under the wrong role could satisfy the gate; (3) `DETERMINISTIC_OPERATIONAL_DEPENDENCY` is downgraded from an auto-promoting `derivationKind` to a deliberate, documented HOLD (§11.2) — it let an upstream adapter self-authorise a prerequisite by enum choice alone, with no governed deterministic-rule registry backing it; (4) `CandidateFactRequirement.qualificationId` becomes mandatory and the type gains a locked `derivationStatus` mirroring the capability-requirement citation pattern, plus its own dedicated `normalizationBasis` (`FACT_REQUIREMENT_DERIVATION`) so a technical source can never be misread as authorising what the course requires (§16.1); (5) multiple `TECHNICAL_TRUTH` claims for the same `(subject, claimKey)` are now resolved deterministically rather than by first-array-match, with a new `TECHNICAL_TRUTH_CONFLICT_REVIEW` gap type for claims that disagree among themselves (§16.2); and depth qualifiers gain an explicit `refinesPerformanceType` target so a `DEPTH_QUALIFIER` can never be misapplied across every performance type sharing a subject (§6.1).

## 1. Why this exists

CC-17's Unit 202 blind-calibration experiment proved the underlying idea — a course can be constructed from transferable evidence, without proprietary course-provider material. CC-18/18A hardened the *generic* pipeline's rules. CC-18B hardens the boundary one layer earlier: the raw-source → normalized-evidence step itself. A pipeline can apply every rule correctly and still be too trusting if a single fixture, or a future qualification-specific adapter, can hand-author a relationship (a bare mapped-unit string, an arbitrary category label, a self-declared necessity, a pre-labelled conflict) that the pipeline then treats as proven. Every mechanism in this document exists to make that impossible before the real Unit 202 blind back-test.

## 2. Source-role hierarchy (locked)

Seven evidence roles, each with exactly one role in the pipeline. This hierarchy is a locked product decision this package implements, not something it revises.

| Role | Representative type(s) | Pipeline role |
|---|---|---|
| `OFFICIAL_CURRICULUM` | `CurriculumEvidence`, `OfficialCurriculumUnit` (registry), `CurriculumSubjectRelation`, `CurriculumFamily` | Curriculum **scope** authority |
| `PUBLIC_ASSESSMENT` | `AssessmentEvidence` | Learner-performance discovery + depth/performance calibration |
| `QUALIFICATION_LEVEL` | `QualificationLevelEvidence` | Depth constraint only — **never** scope-creating |
| `TECHNICAL_TRUTH` | `SourceFactualClaim` (`sourceRole: TECHNICAL_TRUTH`) | Factual truth only — **never** curriculum-scope authority on its own |
| `OPTIONAL_CALIBRATION` | `OptionalCalibrationEvidence`, `SourceFactualClaim` (`sourceRole: OPTIONAL_CALIBRATION`, diagnostic use only) | Optional external calibration benchmark — **never** required by the standard pipeline |
| `LEGACY_DIAGNOSTIC` | `LegacyDiagnosticEvidence` | Diagnostic/comparison only — never scope, depth, or factual authority |
| `MODEL_KNOWLEDGE` | *(no evidence type — never a valid input)* | No evidential authority |

`STANDARD_MODE_CANDIDATE_ROLES` are the only roles `buildStandardPipeline` will accept for role-tagged evidence. `DIAGNOSTIC_ONLY_ROLES` can never reach a required candidate in standard mode (§13). `PrerequisiteEvidence` (`kind: "STRUCTURAL_PREREQUISITE_DEPENDENCY"`) and `CandidateCapabilityRequirement` are deliberately **not** tagged with one of the 7 roles — they are derived structural relations, not primary evidence sources.

## 3. The active qualification boundary

Every `StandardPipelineInput` carries exactly one `qualificationId`. A run only ever concludes scope for that qualification. Every qualification-specific evidence type carries its own `qualificationId` (`CurriculumEvidence`, `AssessmentEvidence`, `CurriculumSubjectRelation`, `CurriculumFamily`, `QualificationLevelEvidence`, `OfficialCurriculumUnit` in the registry, and — as of CC-18C — `CandidateCapabilityRequirement` and the now-mandatory `CandidateFactRequirement.qualificationId`) and is validated or filtered against the active run's `qualificationId` — never merely relied upon as a pre-filtered caller convention. `CurriculumEvidence`/`AssessmentEvidence` failing this check are excluded and reported (`CURRICULUM_MAPPING_REVIEW` / `ASSESSMENT_MAPPING_REVIEW`); `CandidateCapabilityRequirement`/`CandidateFactRequirement` from another qualification are excluded and reported (`EVIDENCE_NORMALIZATION_REVIEW`, CC-18C — a foreign-qualification requirement can neither auto-promote a prerequisite (§11) nor contribute a `requiredFactKey` (§16.1)); `CurriculumSubjectRelation`/`CurriculumFamily`/`QualificationLevelEvidence` from another qualification are silently filtered (they are structural registries, not scope-generating evidence, so a mismatch is not itself reportable scope loss).

## 4. Official curriculum-unit registry — composite identity

`OfficialCurriculumUnit { curriculumUnitId, qualificationId, sourceRef, sourceLocator, officialWording, learningOutcomeId?, parentCurriculumUnitId? }` is never itself a candidate list — it is the real, authoritative set of AC/LO/curriculum units available for mapping.

`buildOfficialCurriculumUnitIndex` keys it by the **composite** `unitRegistryKey(qualificationId, curriculumUnitId)`, never `curriculumUnitId` alone — two different qualifications may legitimately share the same bare unit id (e.g. both naming an "AC1.1"), and each must resolve independently. Registry insertion order never affects the result: entries are grouped by composite key regardless of array order, so the outcome for a given qualification+unit pair is identical no matter how the registry array was assembled.

A genuine registry conflict — the same composite key appearing more than once with **incompatible** `officialWording` or `sourceRef` — excludes **both** duplicates from the resolvable index and is reported as an `EVIDENCE_NORMALIZATION_REVIEW` gap, never resolved last-write-wins. Two entries sharing a composite key that genuinely agree are not a conflict.

**CC-18C:** `OfficialCurriculumUnit` does not itself extend the `SourceProvenance` shape (it carries no `normalizationBasis` — it *is* mapping authority, not a normalization proposal against one), but it still carries mandatory `sourceRef`/`sourceLocator`. `buildOfficialCurriculumUnitIndex` rejects and reports (`EVIDENCE_NORMALIZATION_REVIEW`) any unit with a blank `sourceRef` or `sourceLocator` before it is even considered for the index — a blank-provenance entry can never become mapping authority, and every `CurriculumEvidence`/`AssessmentEvidence` record attempting to resolve against it is correctly rejected downstream via `CURRICULUM_MAPPING_REVIEW`/`ASSESSMENT_MAPPING_REVIEW`, with both gaps visible.

## 5. Curriculum evidence validation

CC-18A validated only assessment mappings against the registry. CC-18B validates `CurriculumEvidence` itself, via `validateCurriculumEvidence`, before any candidate is generated from it. A record is accepted only when **all** of:

- **A.** its `qualificationId` matches the active pipeline `qualificationId`;
- **B.** its `curriculumUnitId` resolves to a real `OfficialCurriculumUnit` under the composite key;
- **C.** its source provenance is valid (§14);
- **D.** its `normalizationBasis` is type-compatible for curriculum evidence (`EXPLICIT_CURRICULUM_WORDING` or `EXPLICIT_RANGE_STRUCTURE`) — an incompatible basis produces `EVIDENCE_NORMALIZATION_REVIEW` rather than being silently accepted or silently dropped;
- **E.** its `role` is `OFFICIAL_CURRICULUM` (structurally guaranteed by the type; re-checked at runtime as defense in depth).

A fabricated `curriculumUnitId`, or a record belonging to another qualification, never generates required scope — it is preserved as a `CURRICULUM_MAPPING_REVIEW` gap naming the attempted mapping and the exact reason it was not trusted.

## 6. Curriculum normalization kind — replacing the ambiguous boolean pair

CC-18/18A's `namedInPrimaryWording`/`isRangeItem` boolean pair let any provenance-valid record with neither flag set (a genuine bug) still generate required scope. It is replaced by an explicit, **locked** `CurriculumNormalizationKind`, declared by the normalization record itself — never inferred from the subject's own English word in production logic:

- **`PRIMARY_REQUIREMENT`** — text explicitly appears as required AC/LO/criterion wording. Creates `REQUIRED_EXPLICIT_CURRICULUM`.
- **`RANGE_REQUIRED_MEMBER`** — an explicit Range member a learner may be required to distinguish/identify/apply. Creates its **own** `REQUIRED_EXPLICIT_CURRICULUM` candidate (`requiresSubject` is required for this kind and is preserved on the resulting candidate as `parentSubject`) — CC-18/18A's `refinesSubject` mechanism silently treated every Range member as depth-only, which this corrects.
- **`RANGE_CATEGORY`** — a named broad Range category. Creates the category requirement; may carry `breadthStatus` (§9).
- **`DEPTH_QUALIFIER`** — official wording that constrains/deepens an existing required subject but does not independently represent learner content. Creates **no** independent candidate; only raises the depth confidence of the **exact** `(subject, performanceType)` candidate it targets.

### 6.1 Range members must not disappear

The canonical regression: a primary subject with three official Range members (e.g. three named classes) produces **four** required candidates — the parent plus each member, each independently `REQUIRED_EXPLICIT_CURRICULUM`, with the parent/child relationship preserved via `parentSubject`, never silently collapsed into "the parent alone, with the members as bare depth colour." A genuine depth qualifier (constrains without representing independent content) is still expressible via `DEPTH_QUALIFIER` and remains non-candidate — the explicit kind controls which behaviour applies, never a guess.

### 6.2 Depth qualifiers must be performance-specific (CC-18C)

Candidate identity is `(subject, performanceType)`, never subject alone. CC-18B's `DEPTH_QUALIFIER` raised depth confidence for its `refinesSubject` alone — correct when that subject carried exactly one performance-type candidate, but silently wrong (applying broadly to every performance type sharing the subject) the moment it carried more than one. `CurriculumEvidence.refinesPerformanceType` closes this: when present, the qualifier resolves to exactly the `(refinesSubject, refinesPerformanceType)` candidate and no other. When omitted, `generateCurriculumCandidates` resolves it only if `refinesSubject` has exactly one performance-type candidate of its own; if the subject carries more than one and no explicit target was supplied, the qualifier cannot resolve to a single intended candidate and is **never** applied broadly — it is excluded and reported as `EVIDENCE_NORMALIZATION_REVIEW` instead. Regression: a subject with both `IDENTIFY` and `CALCULATE` candidates, and a depth qualifier explicitly targeting `CALCULATE`, raises `CALCULATE`'s depth confidence only and leaves `IDENTIFY` at `NONE`; the same qualifier with no explicit target resolves to neither and is reported for review.

## 7. Multi-performance-type preservation

Candidate identity remains `(subject, performanceType)`. CC-18/18A's curriculum-candidate generation grouped records by subject FIRST and then picked a single command-verb performance type, silently discarding the others if the same subject appeared under multiple official requirements with different verbs. `generateCurriculumCandidates` now groups by the full `(subject, performanceType)` key from the start: three official requirements sharing a subject under `IDENTIFY`/`DESCRIBE`/`CALCULATE` survive as three independent candidates. Source order never changes which performance types survive.

## 8. Validated assessment stream

`validateAssessmentEvidence` produces the single trusted `validated` stream — provenance-valid, type-compatible `normalizationBasis`, resolved against the registry under the active qualification. **Every** downstream function that treats assessment as evidence — `generateAssessmentCandidates`, `detectAssessmentPatternCandidates`, `computeCategoryBreadthOutcomes`, and `EXPLICIT_ASSESSMENT_OPERATION` capability-dependency substantiation (§11) — consumes **only** this validated stream, never the raw input array. `generateAssessmentCandidates` itself now contains no validation logic at all; it trusts its input completely because validation is a separate, prior step.

### 8.1 Rejection propagates

Two assessment items sharing a governed `familyKey`, one validly mapped and one mapped to a fabricated unit: the invalid one produces `ASSESSMENT_MAPPING_REVIEW` and is entirely absent from the validated stream, so it cannot count toward the two-distinct-member threshold a family pattern requires (§10) and cannot appear in a `SCOPE_BREADTH_GAP`'s evidenced sub-items (§9.1) — an invalid item influences nothing downstream, by construction, not by a second round of filtering at each call site.

## 9. Category breadth status — independent of assessment presence

`CurriculumEvidence.breadthStatus` (meaningful only on `RANGE_CATEGORY` records) is declared explicitly by curriculum normalization — never guessed from the category's own English word. Undeclared defaults to `UNKNOWN`, never silently complete.

- **`ENUMERATED_COMPLETE`** — no scope-breadth gap is ever produced, regardless of assessment coverage.
- **`OPEN_OR_UNDERSPECIFIED`** — a `SCOPE_BREADTH_GAP` (and a companion `OPEN_SCOPE_GAP` candidate, `candidateKey: "{subject}::unresolved-breadth"`) is produced **unconditionally**, with or without any assessment evidence at all — required for the degraded-evidence back-test this package exists to support.
- **`UNKNOWN`** — a `REVIEW_REQUIRED` candidate (kept structurally distinct from `OPEN_SCOPE_GAP` so a reviewer can tell "known-broad" from "breadth status itself never declared") plus a `SCOPE_BREADTH_GAP` naming that the breadth status itself is unresolved.

### 9.1 Governed sub-item evidence

An `AssessmentEvidence.underCategory` label only counts toward a breadth gap's evidenced sub-items when a matching, governed `CurriculumSubjectRelation { qualificationId, subject, underCategory, ...provenance }` also exists (§12), drawn from the validated assessment stream only (§8.1).

## 10. Assessment family-pattern generalisation

`AssessmentEvidence.familyKey` only counts when it resolves to a governed `CurriculumFamily { qualificationId, familyKey, memberSubjects, ...provenance }` that lists the item's own `subject` as a member (§12). A pattern candidate (`disposition: REVIEW_REQUIRED`) is emitted only when the same performance type is evidenced, from the validated stream, across at least two distinct, governed member subjects. A single tested member never generalises, an ungoverned family label never generalises no matter how many distinct subjects share it, and an invalid assessment item can never count toward the threshold (§8.1).

## 11. Structural capability dependency — independent of curriculum scope records

CC-18A let `CurriculumEvidence.requiredCapabilityKeys` self-declare what a required performance needs, and a `PrerequisiteEvidence.necessityKind` self-declare its own necessity. Both self-authorisation points are removed.

`CandidateCapabilityRequirement { qualificationId, targetSubject, targetCandidateKey, capabilityKey, derivationKind, sourceEvidenceRefs, ...provenance }` is an **independent**, provenance-bearing relation declaring that a required candidate structurally needs a capability. **CC-18C:** it is validated (`validateCandidateCapabilityRequirements`) against provenance (§14, always reported on failure) and the active `qualificationId` before anything downstream sees it — a requirement declared for a different qualification is filtered out and reported, and can never influence this run's prerequisite promotion, even if its `targetCandidateKey` happens to collide with a real candidate. `derivationKind` is locked:

- **`EXPLICIT_CURRICULUM_OPERATION`** — may auto-promote, but only when at least one `sourceEvidenceRefs` entry has `role: OFFICIAL_CURRICULUM` **and** its `evidenceId` resolves into the validated curriculum stream (§5) for this run.
- **`EXPLICIT_ASSESSMENT_OPERATION`** — may auto-promote, but only when at least one `sourceEvidenceRefs` entry has `role: PUBLIC_ASSESSMENT` **and** its `evidenceId` resolves into the validated assessment stream (§8) for this run. An `EvidenceRef` that merely reuses a real, validated `evidenceId` under the **wrong** role (e.g. a validated assessment item's id cited with `role: OFFICIAL_CURRICULUM`) never satisfies this gate (CC-18C closes this collision loophole) — the citation must match on role **and** id together.
- **`DETERMINISTIC_OPERATIONAL_DEPENDENCY`** — never auto-promotes; see §11.2.
- **`REVIEW_PROPOSED`** — never auto-promotes. A raw claim that "this subject probably requires skill X" is `REVIEW_PROPOSED`, not an automatic prerequisite.

A `PrerequisiteEvidence` proposal (`capabilityKey`, `necessaryForCandidateKey`, `minimalDepthJustification`) becomes `FOUNDATIONAL_PREREQUISITE` only when a validly-provenanced, correctly-qualification-bound `CandidateCapabilityRequirement` exists for the same `(targetCandidateKey, capabilityKey)` pair with an auto-promoting `derivationKind` and a satisfied citation. Two weaker, deterministic outcomes:

- a real required target exists but no matching capability requirement auto-promotes (`REVIEW_PROPOSED`, `DETERMINISTIC_OPERATIONAL_DEPENDENCY`, an unsatisfied citation, or none found at all) → `REVIEW_REQUIRED`;
- no real required target exists → `CONTEXTUAL_TEACHING_SUPPORT`.

### 11.1 Assessment-derived dependencies must use validated items

A `CandidateCapabilityRequirement` with `derivationKind: EXPLICIT_ASSESSMENT_OPERATION` auto-promotes only when at least one of its `sourceEvidenceRefs` names an assessment item present in the validated stream (§8) **under the matching role** (see above). A dependency derived from a rejected or unmapped assessment item can never auto-promote a prerequisite.

### 11.2 `DETERMINISTIC_OPERATIONAL_DEPENDENCY` — deliberate HOLD (CC-18C)

`DETERMINISTIC_OPERATIONAL_DEPENDENCY` exists in the locked `derivationKind` enum to name a real category of dependency — one that follows deterministically from the structure of an operation (e.g. "you cannot perform this calculation without this prerequisite arithmetic skill") rather than from an explicit curriculum/assessment citation. CC-18B let it auto-promote on the strength of the enum choice alone, with no governed registry backing *which* deterministic rules are actually authorised — this let an upstream normalization adapter self-authorise a prerequisite simply by picking this `derivationKind` over `REVIEW_PROPOSED`.

As of CC-18C, `DETERMINISTIC_OPERATIONAL_DEPENDENCY` **never** auto-promotes — `isAutoPromotable` returns `false` for it unconditionally, identically to `REVIEW_PROPOSED`, regardless of how well-cited its `sourceEvidenceRefs` are. This is a deliberate, temporary HOLD, not a design conclusion: a future package may define a governed deterministic-dependency-rule registry (analogous to the `OfficialCurriculumUnit` registry) against which such a claim could be validated before auto-promoting. Designing that registry is explicitly **out of scope** for CC-18C and is not implied by this HOLD — until it exists and is separately authorised, automatic prerequisite promotion is limited to properly source-cited `EXPLICIT_CURRICULUM_OPERATION` and `EXPLICIT_ASSESSMENT_OPERATION`.

## 12. Governed category/family relationship validation

`CurriculumSubjectRelation` and `CurriculumFamily` are validated (`validateCurriculumSubjectRelations`, `validateCurriculumFamilies`) against three things before being trusted at all:

1. they belong to the active qualification;
2. their `normalizationBasis` is type-compatible (`EXPLICIT_CURRICULUM_WORDING` or `EXPLICIT_RANGE_STRUCTURE`);
3. every subject they reference (a relation's `subject` and `underCategory`; a family's every `memberSubjects` entry) is present in the set of subjects **known** to the run — subjects appearing in validated curriculum evidence *or* the validated assessment stream (§8), so a relation can legitimately connect a category to a subject that assessment evidence itself validly reveals, while a subject with no supporting evidence anywhere is rejected.

An arbitrary relation or family object with non-empty strings is never governed merely because it was supplied — a relation referencing an unknown subject, or a family listing even one unknown member, is rejected wholesale and reported as `EVIDENCE_NORMALIZATION_REVIEW`.

**Confirmed governed boundary (CC-18C, no behaviour change):** "known" in point 3 above is deliberately **curriculum + validated-assessment-derived** subjects, not curriculum-only — a relation may legitimately connect a category to a subject that only assessment evidence validly reveals, which is the correct behaviour for a family/relation record authored *after* seeing what assessment evidence turned up. This is CC-18B's original implementation, carried forward unchanged; it is stated explicitly here because CC-18C's own review found the surrounding prose could be misread as curriculum-only, which it never was.

## 13. Standard-mode exclusion of optional-calibration and legacy content

`buildStandardPipeline`'s own input type does not accept `OptionalCalibrationEvidence` or `LegacyDiagnosticEvidence`, and rejects at runtime any role-tagged evidence whose own `role`/`sourceRole` is not one of the standard-mode roles — including a `SourceFactualClaim` with `sourceRole: OPTIONAL_CALIBRATION` passed via `factualClaims`, which only `OFFICIAL_CURRICULUM`/`TECHNICAL_TRUTH` claims may populate.

The only legitimate uses of calibration/legacy evidence are read-only, called only *after* the standard pipeline has produced its candidates, and never merged back into `StandardPipelineResult`: `compareAgainstDiagnosticEvidence` (subject-level comparison) and `compareCalibrationFactualClaims` (claim-key factual comparison against approved technical truth, §16).

## 14. Source-normalization provenance

Every evidence record capable of influencing required scope, learner performance, depth, prerequisite status, category/family relationship, or factual truth (`CurriculumEvidence`, `AssessmentEvidence`, `QualificationLevelEvidence`, `PrerequisiteEvidence`, `CandidateCapabilityRequirement`, `ExemplarEvidence`, `CurriculumSubjectRelation`, `CurriculumFamily`, `SourceFactualClaim`, `CandidateFactRequirement`) carries mandatory, non-optional `sourceRef`, `sourceLocator`, and a `normalizationBasis` drawn from a governed enum. `hasValidProvenance(evidence, allowedBases?)` is the runtime gate every validating/generating function applies — non-empty `sourceRef`/`sourceLocator` after trimming, a real `normalizationBasis` enum member, and (when an `allowedBases` list is supplied) type-compatibility with the specific evidence type carrying it. A record failing any of these checks is excluded from candidate generation.

**CC-18C — no rejection is ever silent.** CC-18B already reported a basic-but-type-incompatible `normalizationBasis` as `EVIDENCE_NORMALIZATION_REVIEW`, but several validating functions still handled a more basic failure (blank `sourceRef`/`sourceLocator`, or an unrecognised `normalizationBasis` entirely) with a bare `if (!hasValidProvenance(e)) continue;` — the proposal simply vanished, with no gap naming what was attempted or why it failed. This violated the three-layer anti-cheating contract (§19.1): layer C (pipeline acceptance/rejection **and reason**) must never be skipped. Every validating function in this package now uses a single, uniform check (`provenanceFailureReason`, returning the exact human-readable failure — `"sourceRef is empty"`, `"sourceLocator is empty"`, or a `normalizationBasis` message) that **always** produces an `EVIDENCE_NORMALIZATION_REVIEW` gap on failure, for every evidence type listed above plus the `OfficialCurriculumUnit` registry itself (§4) — never a silent `continue`. The gap preserves the proposal's own evidence id, evidence type, `sourceRef`, `sourceLocator`, and `normalizationBasis` exactly as supplied, so a rejected proposal remains fully traceable for review rather than disappearing.

Allowed bases per evidence type: `CurriculumEvidence` → `EXPLICIT_CURRICULUM_WORDING`/`EXPLICIT_RANGE_STRUCTURE`; `AssessmentEvidence` → `POSITIVE_ASSESSMENT_TARGET`/`ASSESSMENT_CURRICULUM_MAPPING`; `QualificationLevelEvidence` → `QUALIFICATION_LEVEL_DESCRIPTOR`; `PrerequisiteEvidence` → `STRUCTURAL_PREREQUISITE_DEPENDENCY`; `CandidateCapabilityRequirement` → `CAPABILITY_DEPENDENCY_DERIVATION`; `CurriculumSubjectRelation`/`CurriculumFamily` → `EXPLICIT_CURRICULUM_WORDING`/`EXPLICIT_RANGE_STRUCTURE`; `SourceFactualClaim` with `sourceRole: TECHNICAL_TRUTH` → `AUTHORITATIVE_TECHNICAL_FACT`; with any other `sourceRole` → `SOURCE_FACTUAL_CLAIM`; `CandidateFactRequirement` → `FACT_REQUIREMENT_DERIVATION` **only** (§16.1) — never `AUTHORITATIVE_TECHNICAL_FACT`, since a technical source establishes the *answer* to a fact, never *whether the course requires it*. `ExemplarEvidence` carries mandatory provenance but no type-compatibility restriction beyond that.

## 15. Confidence model

Three independent dimensions on every candidate, each `HIGH / MEDIUM / LOW / NONE`: `scopeConfidence`, `depthConfidence`, `technicalTruthConfidence` (governed now by claim-key coverage, §16, not subject matching). A fourth, richer field, `technicalCoverageStatus` (`NOT_REQUIRED / PARTIAL / COMPLETE`), makes fact-level completeness explicit where the bare confidence level is not expressive enough on its own.

## 16. Independent factual claims, claim-key-exact coverage, and real conflict detection

CC-18A already made curriculum/provider and technical-truth claims independent `SourceFactualClaim` records correlated by `claimKey`, never one record naming the other's content as a pre-labelled conflict field. CC-18B tightens attachment and comparison further.

### 16.1 Candidate fact requirements (CC-18C: locked derivation model)

`CandidateFactRequirement { qualificationId, targetCandidateKey, claimKey, derivationStatus, sourceEvidenceRefs, ...provenance }` declares that a specific candidate structurally requires coverage for a specific `claimKey`. A candidate's `requiredFactKeys` come exclusively from these declarations — **zero** declared requirements means the candidate never claims `technicalTruthConfidence: HIGH` merely because some `TECHNICAL_TRUTH` source happens to discuss the same subject.

CC-18B left this record dangerously under-governed: `qualificationId` was optional, there was no citation requirement, and nothing stopped a normalization adapter hand-authoring the entire expected factual syllabus — making technical coverage *look* complete while never actually deriving from a real curriculum or assessment source. CC-18C closes this: `qualificationId` is now **mandatory** and validated exactly like `CandidateCapabilityRequirement` (§3, §11) — a foreign-qualification requirement never contributes a `requiredFactKey`. A locked `derivationStatus` (`factRequirementDerivationStatusSchema`) additionally gates every requirement:

- **`EXPLICIT_CURRICULUM_FACT`** — counts only when at least one `sourceEvidenceRefs` entry has `role: OFFICIAL_CURRICULUM` **and** its `evidenceId` resolves into the validated curriculum stream (§5).
- **`EXPLICIT_ASSESSMENT_FACT`** — counts only when at least one `sourceEvidenceRefs` entry has `role: PUBLIC_ASSESSMENT` **and** its `evidenceId` resolves into the validated assessment stream (§8).
- **`REVIEW_PROPOSED`** — exported for Project-Architect review via `EVIDENCE_NORMALIZATION_REVIEW`, but **never** contributes to `requiredFactKeys` or technical coverage automatically, unconditionally.

`validateCandidateFactRequirements` performs all of this — qualification match, real-target resolution, and citation eligibility — before a requirement is allowed to add a `requiredFactKey`; an ineligible requirement (wrong qualification, unmatched target, uncited `EXPLICIT_*_FACT`, or any `REVIEW_PROPOSED`) is excluded from the validated stream and reported, never silently promoted. `CandidateFactRequirement`'s own `normalizationBasis` is locked to `FACT_REQUIREMENT_DERIVATION` (§14) — `AUTHORITATIVE_TECHNICAL_FACT` is never valid here, because a technical source establishes the *answer* to a fact, never *whether the course requires it*.

### 16.2 Attachment is claim-key exact, multi-source resolution is deterministic, and multi-fact coverage is tracked explicitly

`attachFactualClaims` attaches `TECHNICAL_TRUTH` claims to a candidate only for `claimKey`s that are one of that candidate's `requiredFactKeys` (and whose `subject` matches). A technical claim sharing the candidate's *subject* but declaring an *unrelated* `claimKey` is never treated as satisfying a different required key. Results are collected per claim key in `factualStatementsByClaimKey` — the CC-18A/CC-18 singular `factualStatement = matches[0]` model, which silently discarded every fact beyond the first and was order-dependent, is removed entirely.

**CC-18C — multiple `TECHNICAL_TRUTH` claims for the same `(subject, claimKey)`.** CC-18B already deduplicated multiple *sources* onto one required key via the `requiredFactKeys` set, but its attachment logic still picked the technical claim via `.find(...)` — the *first* matching claim, silently ignoring any other `TECHNICAL_TRUTH` record for that exact `(subject, claimKey)`, which is source-order-dependent the moment two technical sources disagree. `attachFactualClaims` now collects **every** matching claim first, then resolves deterministically, never by array/source order:

- **zero** matching claims → the fact stays genuinely unresolved (no attachment, not counted covered);
- **one** matching claim → attaches normally;
- **more than one**, all sharing the same `comparisonKind` and the same `normalizedClaimValue` → attaches that shared value, and preserves **every** supporting claim's `EvidenceRef` (not just one) on the candidate;
- **more than one**, with **incompatible** `comparisonKind`s → emits `FACTUAL_COMPARISON_REVIEW` (§16.3); no value is attached, the fact is not counted as covered;
- **more than one**, with a **compatible** `comparisonKind` but **different** canonical values → emits `TECHNICAL_TRUTH_CONFLICT_REVIEW` (a new gap type, distinct from `FACTUAL_COMPARISON_REVIEW`'s incompatible-*kind* case — this is a disagreement *within* the same kind); no value is attached, the fact is not counted as covered, and no source order changes this outcome.

Coverage is computed deterministically from the *set* of required vs. attached keys, so source ordering never changes the result: `NOT_REQUIRED` (zero required keys), `COMPLETE` (`technicalTruthConfidence: HIGH`, every required key attached), or `PARTIAL` (`technicalTruthConfidence: MEDIUM` with at least one attached, `NONE` with none yet) otherwise. Because a disputed fact (incompatible kinds or disagreeing values) is never attached, a candidate with one undisputed and one disputed required fact caps at `PARTIAL` — a genuine technical dispute can never produce `COMPLETE` merely because *some* technical source exists for the disputed key.

### 16.3 Comparison kinds gate conflict detection

`SourceFactualClaim.comparisonKind` (`BOOLEAN / ENUM / NUMBER_WITH_UNIT / CANONICAL_TEXT`) declares how `normalizedClaimValue` — a canonical comparison value, never arbitrary prose — may be compared. `detectFactualConflicts` groups claims by `claimKey` and, for each `TECHNICAL_TRUTH`/comparison-role pair sharing a key: if their `comparisonKind`s differ, it emits `FACTUAL_COMPARISON_REVIEW` (neither an automatic conflict nor a false agreement — incompatible kinds are never semantically reconciled by this package); only when the kinds match does it compare `normalizedClaimValue` for equality and emit `CURRICULUM_TECHNICAL_CONFLICT` on disagreement. Two claims that agree never produce a conflict record at all. This package performs no semantic/LLM comparison — canonicalisation is entirely the evidence author's responsibility, declared via `comparisonKind`.

The pipeline still, on a real conflict: retains curriculum's own authority over whether the topic is in scope (untouched); retains technical truth's own authority over what is taught (`factualStatementsByClaimKey` always comes from the `TECHNICAL_TRUTH` claim); preserves both source records; never teaches the incorrect source claim.

### 16.4 Diagnostic-only calibration comparison

`compareCalibrationFactualClaims(calibrationClaims, technicalClaims)` reuses the same claim-key/comparison-kind machinery to diagnostically compare `OPTIONAL_CALIBRATION` factual claims against approved `TECHNICAL_TRUTH` — supporting the real-world case where a provider handout contains an erroneous technical statement — without ever letting that comparison feed back into required-candidate generation (§13).

## 17. Exemplar provenance and the coverage boundary

`ExemplarEvidence` now carries mandatory `sourceRef`/`sourceLocator`/`normalizationBasis`, like every other scope-adjacent evidence type. A `TECHNICAL_TRUTH`-role exemplar does **not** itself set `technicalTruthConfidence: HIGH` merely because its role label says `TECHNICAL_TRUTH` — technical-truth coverage for *any* candidate, exemplar or otherwise, comes only from exact claim-key coverage under §16. Role and factual-truth confidence are kept structurally separate.

## 18. Gap model

Ten gap types, each preserving the affected candidate key, evidence already available, exactly what is unresolved, and a **plural** `legitimateResolverRoles`:

| Gap type | Produced by | Legitimate resolver role(s) |
|---|---|---|
| `SCOPE_BREADTH_GAP` | `computeCategoryBreadthOutcomes` | `OFFICIAL_CURRICULUM`, `PUBLIC_ASSESSMENT` |
| `PERFORMANCE_DEPTH_GAP` | `computePerformanceDepthGaps` | `PUBLIC_ASSESSMENT` |
| `TECHNICAL_TRUTH_GAP` | `computeTechnicalTruthGaps` (only fires when `requiredFactKeys.length > 0` and coverage isn't `COMPLETE`) | `TECHNICAL_TRUTH` |
| `CURRICULUM_TECHNICAL_CONFLICT` | `detectFactualConflicts` | `TECHNICAL_TRUTH` |
| `ASSESSMENT_GENERALISATION_REVIEW` | `detectAssessmentPatternCandidates` | `OFFICIAL_CURRICULUM` |
| `ASSESSMENT_MAPPING_REVIEW` | `validateAssessmentEvidence` | `OFFICIAL_CURRICULUM` |
| `CURRICULUM_MAPPING_REVIEW` | `validateCurriculumEvidence` | `OFFICIAL_CURRICULUM` |
| `EVIDENCE_NORMALIZATION_REVIEW` | **(CC-18C: the uniform, always-reported provenance-failure gap)** every `validate*` function (curriculum, assessment, qualification-level, capability requirement, prerequisite, exemplar, fact requirement, factual claim, subject relation, family) plus `buildOfficialCurriculumUnitIndex`, registry-conflict detection, relation/family governance checks, foreign-qualification capability/fact requirements, unsatisfied `EXPLICIT_*` citations, `REVIEW_PROPOSED` fact requirements, and unresolvable `DEPTH_QUALIFIER`s | `OFFICIAL_CURRICULUM` (context-dependent; `PUBLIC_ASSESSMENT` also legitimate for fact-requirement citation failures) |
| `FACTUAL_COMPARISON_REVIEW` | `attachFactualClaims`/`detectFactualConflicts` (incompatible `comparisonKind`) | `OFFICIAL_CURRICULUM`, `TECHNICAL_TRUTH` |
| `TECHNICAL_TRUTH_CONFLICT_REVIEW` | `attachFactualClaims` (CC-18C: multiple `TECHNICAL_TRUTH` claims for the same `(subject, claimKey)` share a `comparisonKind` but disagree on `normalizedClaimValue` — distinct from `FACTUAL_COMPARISON_REVIEW`'s incompatible-*kind* case) | `TECHNICAL_TRUTH` |

`TECHNICAL_TRUTH` is never a legitimate resolver of a scope-breadth or curriculum-mapping question.

## 19. Downstream governance gate

```
raw qualification evidence
  -> normalized evidence roles + registries        (this package's evidence types, OfficialCurriculumUnit registry)
  -> VALIDATED evidence streams                     (validateCurriculumEvidence, validateAssessmentEvidence,
                                                       validateCurriculumSubjectRelations, validateCurriculumFamilies,
                                                       validateFactualClaims)
  -> learner-performance / knowledge candidates      (generate*/detect* functions, operating ONLY on validated streams)
  -> evidence/confidence/gap analysis                (attach*/compute*/detect* functions, buildStandardPipeline)
  -> [STOP -- Project-Architect curriculum decision -- outside this package]
  -> governed course matrix / knowledge boundary
  -> reusable domain knowledge assertions
  -> course mappings
  -> canonical lesson/storyboard design
```

This package produces `StandardPipelineResult` (`candidates`, `gaps`, `unmatchedTechnicalTruth`, `unmatchedQualificationLevel`) and stops.

### 19.1 Three-layer anti-cheating contract for the future blind back-test

The future Unit 202 normalization adapter is itself an audited product, not a trusted black box. It must preserve three layers **separately** and export all three:

- **A. Raw source locator** — the exact specification/assessment/technical-source locator a normalized item was derived from (`sourceRef`/`sourceLocator` on every evidence record already carries this).
- **B. Normalization proposal** — the adapter's own typed claim about what the source says: subject, performance, curriculum normalization kind, parent/family relationship, capability relationship, fact requirement, factual claim (the evidence record types in this package ARE this layer).
- **C. Pipeline acceptance** — accepted / rejected / review-required, and why (the `KnowledgeCandidate`/`GapRecord` output of `buildStandardPipeline` IS this layer).

No direct hand-authored "expected candidate" may bypass layer B — every candidate this package ever produces is traceable back through a typed, provenance-bearing normalization proposal to a raw source locator, and every rejection is equally traceable to exactly which validation gate declined it and why. An adapter that uses an LLM to *propose* normalized evidence (layer B) must still: preserve a real source locator for every proposal (layer A); have its structural mappings (registry resolution, category/family governance, capability derivation) validated against the governed registries by this package's own deterministic rules, never trusted from the model's own claim; keep uncertainty explicit (never force a `HIGH` confidence the evidence doesn't structurally support); and leave final curriculum authority with the Project Architect. "The model says this is the correct mapping" is never sufficient evidence on its own — only registry/relation resolution (this package's own deterministic logic) is.

## 20. Testing this architecture

`packages/qualification-pipeline/src/rules.test.ts` proves synthetic regression cases A–O (CC-18), P–AC (CC-18A), AD–AZ (CC-18B), and BA–BS (CC-18C) — composite registry resolution and conflict detection, curriculum-evidence registry validation, the locked normalization-kind semantics (including Range members surviving as their own candidates and depth qualifiers not), multi-performance-type preservation, the validated-assessment-stream boundary (including rejection propagation into pattern/breadth computations), type-compatible provenance per evidence type, independent capability-dependency derivation kinds, claim-key-exact multi-fact technical coverage, comparison-kind-gated conflict detection, exemplar provenance, and category/family governance against the known-subject set — using topic names chosen for readability only, never Unit 202's own governed content. It also mechanically proves the package's own architectural boundaries: production source contains no qualification/topic-specific literal, and the package declares zero dependency on any other workspace package.

**CC-18C cases BA–BS** mechanically prove the five defect corrections: BA/BB/BC — a blank-provenance `CurriculumEvidence`, `AssessmentEvidence`, or `OfficialCurriculumUnit` is rejected and reported, never silently dropped; BD/BE/BF/BG/BH — a foreign-qualification, uncited, role-mismatched-citation, or `DETERMINISTIC_OPERATIONAL_DEPENDENCY` capability requirement cannot auto-promote a prerequisite, while a properly qualification-bound, role-and-id-cited `EXPLICIT_CURRICULUM_OPERATION` can; BI/BJ/BK/BL — a foreign-qualification, `REVIEW_PROPOSED`, or uncited `EXPLICIT_*_FACT` fact requirement never contributes a `requiredFactKey`; BM/BN/BO/BP/BQ — agreeing multi-source technical claims attach with every ref preserved, disagreeing claims (same or reversed order) produce `TECHNICAL_TRUTH_CONFLICT_REVIEW` with no arbitrary attachment, incompatible comparison kinds produce `FACTUAL_COMPARISON_REVIEW`, and one disputed required fact caps a candidate's coverage at `PARTIAL`; BR/BS — an explicitly-targeted `DEPTH_QUALIFIER` affects only its exact `(subject, performanceType)` candidate, and an ambiguous one (no explicit target, more than one performance type) applies to neither and is reported for review.
