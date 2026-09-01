# Qualification Knowledge-Construction Pipeline

**Status:** governed architecture, implementation-complete for the generic pipeline stage this document covers (candidate generation + gap/conflict analysis). Package: `@alp/qualification-pipeline` (`packages/qualification-pipeline/src/`). This document is the design authority; the package is its operational encoding, proved by the synthetic regression suite in `packages/qualification-pipeline/src/rules.test.ts`.

**Scope of this package:** raw qualification evidence → normalized evidence roles → learner-performance/knowledge **candidates** → **gap/conflict analysis**. It stops there. It never writes a governed course matrix, knowledge obligation, assertion, or lesson — see §16 (Downstream Gate).

**Independence:** this package has zero dependency on any other workspace package and contains no qualification-specific content or branching. Every example in this document is illustrative; none of the terms used here (or in the package's own test fixtures) may appear as a literal in the package's production source (`types.ts`, `rules.ts`, `index.ts`) — mechanically enforced by a dedicated test.

**Revision note (CC-18A):** an adversarial Project-Architect review of the original CC-18 implementation found several places where a synthetic fixture *pre-declared* a relationship (a bare mapped-unit string, a free-form category/family label, a self-selected necessity enum, a pre-labelled conflicting statement) that production code then treated as proven. This revision closes those holes before the real Unit 202 blind back-test. Every section below reflects the corrected design; superseded CC-18 mechanisms are noted where useful for migration context, but nothing in this document describes them as current behaviour.

## 1. Why this exists

CC-17's Unit 202 blind-calibration experiment proved the underlying idea — a course can be constructed from transferable evidence, without proprietary course-provider material — but also exposed real methodological gaps. CC-18 hardened the *generic* pipeline against the first round of those gaps. CC-18A hardens it against a second-order failure mode: a pipeline can be "generic" in its logic while still being too trusting of whatever relationships a single fixture or adapter happens to assert. Before the real Unit 202 blind back-test, every relationship the pipeline treats as HIGH-confidence must be independently verifiable against a governed registry or record, never taken on the word of the evidence item that benefits from it.

## 2. Source-role hierarchy (locked)

Seven evidence roles, each with exactly one role in the pipeline. This hierarchy is a locked product decision this package implements, not something it revises.

| Role | Representative type(s) | Pipeline role |
|---|---|---|
| `OFFICIAL_CURRICULUM` | `CurriculumEvidence`, `OfficialCurriculumUnit` (registry), `CurriculumSubjectRelation`, `CurriculumFamily` | Curriculum **scope** authority |
| `PUBLIC_ASSESSMENT` | `AssessmentEvidence` | Learner-performance discovery + depth/performance calibration |
| `QUALIFICATION_LEVEL` | `QualificationLevelEvidence` | Depth constraint only — **never** scope-creating (CC-18A) |
| `TECHNICAL_TRUTH` | `SourceFactualClaim` (`sourceRole: TECHNICAL_TRUTH`) | Factual truth only — **never** curriculum-scope authority on its own |
| `OPTIONAL_CALIBRATION` | `OptionalCalibrationEvidence`, `SourceFactualClaim` (`sourceRole: OPTIONAL_CALIBRATION`, diagnostic use only) | Optional external calibration benchmark — **never** required by the standard pipeline |
| `LEGACY_DIAGNOSTIC` | `LegacyDiagnosticEvidence` | Diagnostic/comparison only — never scope, depth, or factual authority |
| `MODEL_KNOWLEDGE` | *(no evidence type — never a valid input)* | No evidential authority |

`STANDARD_MODE_CANDIDATE_ROLES` (`OFFICIAL_CURRICULUM`, `PUBLIC_ASSESSMENT`, `QUALIFICATION_LEVEL`, `TECHNICAL_TRUTH`) are the only roles `buildStandardPipeline` will accept for role-tagged evidence. `DIAGNOSTIC_ONLY_ROLES` (`OPTIONAL_CALIBRATION`, `LEGACY_DIAGNOSTIC`, `MODEL_KNOWLEDGE`) can never reach a required candidate in standard mode — see §11. `PrerequisiteEvidence` (structural capability dependency, §7) is deliberately **not** tagged with one of the 7 roles at all — see §7's own note on why.

## 3. Candidate identity and the performance-type rule

A candidate is keyed by **`(subject, performanceType)`**, via `candidateKey(subject, performanceType) = "${subject}::${performanceType}"` — never by subject alone. `performanceType` is one of `DEFINE / STATE / DESCRIBE / EXPLAIN / IDENTIFY / RECOGNISE / DISTINGUISH / CALCULATE / APPLY / INTERPRET / DIRECTION_RULE / COMPONENT_ROLE / SCHEMATIC_RECOGNITION / PHYSICAL_RECOGNITION / PROCEDURE / OTHER`.

This is what keeps an AC's own "state the operating principle" requirement (`subject::STATE`) structurally separate from a public-assessment item that additionally tests "identify this component from its schematic symbol" (`subject::SCHEMATIC_RECOGNITION`) — two candidates, two provenances, never one collapsed "knows topic X" proposition, and the AC's own verb is never treated as having silently created the second requirement.

## 4. Candidate disposition model

Every candidate carries exactly one `CandidateDisposition`, assigned deterministically by the rules below — never a discretionary Claude/Product-Architect scope call:

- **`REQUIRED_EXPLICIT_CURRICULUM`** — directly required by AC/LO/Range wording (`generateCurriculumCandidates`).
- **`REQUIRED_ASSESSMENT_EVIDENCED`** — learner performance directly evidenced by legitimate assessment material, **validated against the official curriculum-unit registry** (`generateAssessmentCandidates`, §6).
- **`FOUNDATIONAL_PREREQUISITE`** — a prerequisite whose `capabilityKey` structurally matches an existing required candidate's own declared `requiredCapabilityKeys` (`generatePrerequisiteCandidates`, §7).
- **`REPRESENTATIVE_EXEMPLAR`** — a technically valid example used to teach an already-required broad category, not itself a mastery requirement (`generateExemplarCandidates`).
- **`CONTEXTUAL_TEACHING_SUPPORT`** — useful context that does not belong in required mastery (a prerequisite whose target isn't itself required — §7).
- **`OPEN_SCOPE_GAP`** — a curriculum category explicitly declared `OPEN_OR_UNDERSPECIFIED` (§9).
- **`REVIEW_REQUIRED`** — evidence exists but deterministic rules cannot safely resolve the relationship without Project-Architect judgement: an `ASSESSMENT_PATTERN_CANDIDATE` (§10), an unproven prerequisite claim with a real target but no structural match (§7), or a category whose breadth status is `UNKNOWN` (§9).

`REQUIRED_DISPOSITIONS = [REQUIRED_EXPLICIT_CURRICULUM, REQUIRED_ASSESSMENT_EVIDENCED]` is the only set counted as mastery scope by downstream gap logic (§13) and by everything that checks "is there a real required candidate to attach to" (prerequisites §7, exemplars §5.4).

## 5. Curriculum route — AC-vs-Range rule (`generateCurriculumCandidates`)

A subject becomes a top-level `REQUIRED_EXPLICIT_CURRICULUM` candidate if **either**:

1. it is named directly in an AC/LO's own primary wording (`namedInPrimaryWording: true`), **or**
2. it is a standalone Range item with no `refinesSubject` (a bare category).

These two sources are independent. An AC that names three subjects in its own title, where the Range structure only enumerates sub-classes of ONE of them, still produces all three subjects as scope — the absent Range enumeration of the other two never demotes them.

A Range item **with** `refinesSubject` never creates its own top-level candidate — it attaches as a depth refinement to the subject it refines (raising that subject's `depthConfidence` from `NONE` to `MEDIUM`).

A standalone Range category establishes the **category only** — never any internal implementation detail beyond what other evidence independently supports (§9's category-vs-detail rule).

### 5.1 Structural capability declaration

`CurriculumEvidence.requiredCapabilityKeys` lets curriculum evidence declare which operational sub-skills a required performance structurally needs (e.g. an explicit calculation that cannot be performed without a rearrangement step). This is the ONLY thing a `PrerequisiteEvidence` record can match against to earn `FOUNDATIONAL_PREREQUISITE` — see §7.

### 5.2 Range category ≠ arbitrary internal detail

A standalone Range category authorises **no** further internal detail automatically — not from a technical-truth source describing the category's internals, not from private calibration material, not from legacy content. Internal detail enters the candidate set only through independent curriculum/assessment evidence naming that specific narrower subject directly, or the exemplar route (§5.4) as a clearly-labelled `REPRESENTATIVE_EXEMPLAR`.

### 5.3 Positive-target rule for assessment evidence

See §6 — assessment evidence is a first-class proposition-generation source, not merely depth confirmation.

### 5.4 Exemplar vs mastery (`generateExemplarCandidates`)

`ExemplarEvidence.exemplarOfCategory` must match an already-required subject before an exemplar candidate is created at all. When it does, the specific worked example becomes its own `REPRESENTATIVE_EXEMPLAR` candidate — never merged into the category's own candidate, never inflating it to `REQUIRED_*`. `implementationDetailSubjects` is recorded for transparency only; none of those finer sub-details is independently promoted. `ExemplarEvidence.role` accepts only `TECHNICAL_TRUTH | PUBLIC_ASSESSMENT` (CC-18A tightening — CC-18's own type additionally allowed `OPTIONAL_CALIBRATION`, which was inconsistent with §11's hard exclusion rule and has been removed).

## 6. Assessment mapping validation (CC-18A — the core correction)

CC-18 treated any non-empty `mappedCurriculumUnitId` string as a valid mapping. Adversarial review found this let a synthetic (and, by extension, a real future adapter's) fixture manufacture `REQUIRED_ASSESSMENT_EVIDENCED` scope from an arbitrary string with **zero curriculum evidence at all**. This is now closed by an explicit registry.

### 6.1 `OfficialCurriculumUnit` registry

A non-candidate authority structure representing the real set of AC/LO/curriculum units available for mapping:

```
OfficialCurriculumUnit { curriculumUnitId, qualificationId, sourceRef, sourceLocator,
                          officialWording, learningOutcomeId?, parentCurriculumUnitId? }
```

`StandardPipelineInput.officialCurriculumUnits` carries this registry. It is never itself a candidate list.

### 6.2 Validation rule

An `AssessmentEvidence` item generates `REQUIRED_ASSESSMENT_EVIDENCED` scope only when **all** of:

1. `mappedCurriculumUnitId` is non-empty;
2. it resolves to a real `OfficialCurriculumUnit.curriculumUnitId` in the supplied registry;
3. that unit's `qualificationId` equals the assessment item's own `qualificationId` (rejects a real unit id borrowed from a different qualification).

An item failing any of these never becomes required scope. It is preserved — never silently dropped — as an `ASSESSMENT_MAPPING_REVIEW` gap record naming the assessment source, item id, the attempted mapping, the target subject/performance, and the exact reason the mapping was not trusted.

### 6.3 Assessment may still introduce a new subject

This does **not** undo the CC-18 proposition-generation rule: a validly-mapped item may introduce a subject/performance that has no existing curriculum candidate at all — the requirement is that the *mapping* resolves to a real unit, never that the exact narrow subject already exists as a curriculum candidate. A broad curriculum unit (e.g. covering "magnetic effects" generally) can be validly mapped by an assessment item that tests a much narrower performance (e.g. a specific polarity-identification task) — the pipeline creates that narrower candidate.

### 6.4 Positive-target rule (unchanged from CC-18)

Every `AssessmentEvidence` record preserves the full provenance chain (`assessmentSource`, `itemId`, `mappedCurriculumUnitId`, `questionStemRef`, `correctAnswerTarget`, `subject`, `performanceType`). `distractorSubjects` exists purely for provenance/adversarial testing — no candidate-generating function reads it. A question whose correct answer targets subject X, with wrong-answer options Y and Z, generates a candidate for X only.

## 7. Structural prerequisite dependency (CC-18A — the second core correction)

CC-18 let a `PrerequisiteEvidence` record self-declare `necessityKind: OPERATIONALLY_NECESSARY_FOR_STATED_PROCEDURE` and be promoted to `FOUNDATIONAL_PREREQUISITE` on that free-form label alone. This is too trusting — a plausible-sounding claim is not the same as a structural dependency. `necessityKind` is removed entirely.

`PrerequisiteEvidence` is deliberately **not** tagged with one of the 7 evidence roles — prerequisite necessity is a *derived structural claim* about a candidate-to-candidate dependency, not a primary evidence source. Its `kind` field is the fixed literal `"STRUCTURAL_PREREQUISITE_DEPENDENCY"`, which makes it structurally impossible to mistake for one of the 7 roles or to route it past the standard-mode role gate.

A prerequisite becomes `FOUNDATIONAL_PREREQUISITE` only when:

- **A.** an existing `REQUIRED_*` candidate (found via `necessaryForCandidateKey`) exists; **and**
- **B.** that candidate's own `requiredCapabilityKeys` (declared by the *curriculum* evidence that created it, §5.1) includes the prerequisite's own `capabilityKey` — the same key, structurally matched, not merely a plausible-sounding label; **and**
- **C.** the prerequisite evidence itself carries valid source provenance (§14); **and**
- **D.** depth is capped to the minimum (`minimalDepthJustification` is preserved verbatim, never expanded).

Two weaker outcomes, both deterministic, never chosen by Claude:

- **A real target exists, but the capability key doesn't match** → `REVIEW_REQUIRED`. A plausible prerequisite claim is neither promoted to mastery nor silently discarded — it needs Project-Architect confirmation of the structural dependency.
- **No real required target exists at all** → `CONTEXTUAL_TEACHING_SUPPORT`.

This mechanically prevents the exact failure case the rule exists to catch: an unrelated but interesting topic (e.g. deep semiconductor theory) can never become a required prerequisite for a nearby required topic (e.g. basic diode operation) merely by *claiming* necessity — only a structural capability match declared by the required candidate's own curriculum evidence can do that.

## 8. Qualification-level evidence — depth constraint, never scope (CC-18A)

CC-18 represented `QUALIFICATION_LEVEL` through `PrerequisiteEvidence`, conflating two different concerns (a necessity claim vs. a depth ceiling). They are now separate types.

`QualificationLevelEvidence { role: "QUALIFICATION_LEVEL", evidenceId, levelId, depthConstraintDescriptor, appliesToCandidateKey, sourceRef, sourceLocator, normalizationBasis }` is attached, by `attachQualificationLevelConstraints`, **only** to a candidate that already exists under the exact `candidateKey` it names (`appliesToCandidateKey`). It updates `qualificationLevelRefs` and `depthConstraintNote` on that candidate. It never creates a new candidate, never changes a candidate's `disposition`, and a record whose `appliesToCandidateKey` matches nothing is recorded in `unmatchedQualificationLevel` — visible, never silently discarded, and never promoted to scope on its own.

Command-verb-driven performance type (from `CurriculumEvidence.commandVerbPerformanceType`, §3) and qualification-level depth constraint remain two separate concepts: the verb says *what kind* of performance is required; the level constrains *how complex* that performance may be. Neither is reduced to the other, and depth is never collapsed into one opaque confidence score (§12).

## 9. Category breadth status — independent of assessment presence (CC-18A)

CC-18 emitted a breadth gap for an under-specified category only when at least one assessment item happened to reference it via `underCategory`. That made the gap depend on assessment presence, which is backwards: a category can be genuinely open even with zero public assessment coverage, and the degraded-evidence back-test this package exists to support depends on breadth gaps firing without needing assessment evidence to exist first.

`CurriculumEvidence.breadthStatus` (`CategoryBreadthStatus`) is declared explicitly by curriculum normalization — never guessed from the category's own English word in production logic. Undeclared defaults to `UNKNOWN`, never silently treated as complete.

- **`ENUMERATED_COMPLETE`** — no scope-breadth gap is ever produced, regardless of whether every member is separately assessed.
- **`OPEN_OR_UNDERSPECIFIED`** — a `SCOPE_BREADTH_GAP` (and a companion `OPEN_SCOPE_GAP` candidate, `candidateKey: "{subject}::unresolved-breadth"`) is produced **unconditionally**, with or without any assessment evidence. Where governed sub-item evidence does exist (§9.1), it is listed in the gap's `evidenceAvailable`; where none exists, the gap still fires with an empty evidence list.
- **`UNKNOWN`** — a `REVIEW_REQUIRED` candidate (not `OPEN_SCOPE_GAP` — the two dispositions are kept distinct so a reviewer can tell "known-broad" from "breadth status itself never declared") plus a `SCOPE_BREADTH_GAP` naming that the breadth status itself, not merely the breadth, remains unresolved.

### 9.1 Governed sub-item evidence (`CurriculumSubjectRelation`)

An `AssessmentEvidence.underCategory` label only counts toward a breadth gap's evidenced sub-items when a matching `CurriculumSubjectRelation { subject, underCategory, sourceRef, sourceLocator, normalizationBasis }` also exists. An assessment record cannot unilaterally assert this relationship — the governed relation is the only thing that makes it count. An ungoverned `underCategory` label does not prevent the item's own independent `REQUIRED_ASSESSMENT_EVIDENCED` candidacy (§6), it only fails to register as breadth-gap evidence.

## 10. Assessment family-pattern generalisation (CC-18A adds governed families)

`AssessmentEvidence.familyKey` only counts when it resolves to a governed `CurriculumFamily { familyKey, memberSubjects, sourceRef, sourceLocator, normalizationBasis }` that lists the item's own `subject` as a member. An assessment record cannot unilaterally assert family membership any more than it can assert category membership (§9.1).

A pattern candidate (`disposition: REVIEW_REQUIRED`, `assessmentPattern: { familyKey, evidencedMembers }`) is emitted only when the **same performance type** is evidenced across **at least two distinct, governed member subjects** sharing a `familyKey`. A single tested family member never generalises, and neither does an ungoverned family label no matter how many distinct subjects share it. The individually tested members remain their own, separate `REQUIRED_ASSESSMENT_EVIDENCED` candidates regardless; untested family members are never mentioned anywhere in the output. The pattern candidate is paired with an `ASSESSMENT_GENERALISATION_REVIEW` gap record.

## 11. Standard-mode exclusion of optional-calibration and legacy content

`buildStandardPipeline`'s own input type does not accept `OptionalCalibrationEvidence` or `LegacyDiagnosticEvidence` at the type level, and rejects at runtime (`assertStandardModeRole`) any role-tagged evidence record whose own `role` is not one of `STANDARD_MODE_CANDIDATE_ROLES` — including a `SourceFactualClaim` whose `sourceRole` is `OPTIONAL_CALIBRATION` passed via `factualClaims` (§12.2), which only `OFFICIAL_CURRICULUM`/`TECHNICAL_TRUTH` claims may populate.

The only legitimate uses of calibration/legacy evidence anywhere in this package are read-only, called only *after* the standard pipeline has already produced its candidates, and never merged back into `StandardPipelineResult`:

- `compareAgainstDiagnosticEvidence(candidates, calibration, legacy)` — compares subjects against existing candidates.
- `compareCalibrationFactualClaims(calibrationClaims, technicalClaims)` — diagnostically detects a factual disagreement between optional-calibration material and approved technical truth (§12.3), supporting exactly the real-world case where a provider handout contains an erroneous technical statement, without ever letting that comparison feed backward into required-candidate generation.

## 12. Independent factual claims and real conflict detection (CC-18A)

CC-18 let `TechnicalTruthEvidence` itself carry a `conflictingCurriculumStatement` field — meaning the fixture told the pipeline a conflict existed. That is not conflict *detection*. It is removed.

### 12.1 `SourceFactualClaim`

```
SourceFactualClaim { claimKey, subject, sourceRole, evidenceId,
                      normalizedClaimValue, originalWordingRef?,
                      sourceRef, sourceLocator, normalizationBasis }
```

Curriculum/provider claims and technical-truth claims about the "same fact" are **independent records**, correlated only by sharing a canonical `claimKey` — never by one record naming the other's content.

### 12.2 Attachment (`attachFactualClaims`)

Only `TECHNICAL_TRUTH`-sourced claims update a matching candidate's `factualStatement` and raise `technicalTruthConfidence` to `HIGH`. A claim whose subject matches no candidate is returned in `unmatchedTechnicalTruth`, never promoted to scope — the mechanism that stops a technical source discussing several related components from turning all of them into requirements when only one is in scope.

### 12.3 Conflict detection (`detectFactualConflicts`)

Groups all supplied claims by `claimKey`. Wherever a `TECHNICAL_TRUTH` claim and a claim from a comparison role (`OFFICIAL_CURRICULUM` in standard mode; `OPTIONAL_CALIBRATION` only via the diagnostic-only `compareCalibrationFactualClaims`, §11) share a `claimKey` but disagree on `normalizedClaimValue`, a `CURRICULUM_TECHNICAL_CONFLICT` is emitted. The pipeline then:

- retains curriculum's own authority over **whether** the topic is in scope (untouched);
- retains technical truth's own authority over **what** is taught (`factualStatement` always comes from the `TECHNICAL_TRUTH` claim);
- preserves both source records (in the gap's `evidenceAvailable`);
- never teaches the incorrect source claim.

Two claims sharing a `claimKey` that **agree** never produce a conflict record at all.

## 13. Confidence model

Three independent dimensions on every candidate (`ConfidenceProfile`), each `HIGH / MEDIUM / LOW / NONE` — never collapsed into one opaque score: `scopeConfidence`, `depthConfidence`, `technicalTruthConfidence`. See §5 (scope), §9 (breadth-driven depth uncertainty), §12.2 (technical-truth confidence).

## 14. Source-normalization provenance (mandatory before back-testing)

Every evidence record capable of influencing required scope, learner performance, depth, prerequisite status, category/family relationship, or factual truth (`CurriculumEvidence`, `AssessmentEvidence`, `QualificationLevelEvidence`, `PrerequisiteEvidence`, `CurriculumSubjectRelation`, `CurriculumFamily`, `SourceFactualClaim`) carries mandatory, non-optional `sourceRef`, `sourceLocator`, and a `normalizationBasis` drawn from a governed enum:

`EXPLICIT_CURRICULUM_WORDING`, `EXPLICIT_RANGE_STRUCTURE`, `POSITIVE_ASSESSMENT_TARGET`, `ASSESSMENT_CURRICULUM_MAPPING`, `QUALIFICATION_LEVEL_DESCRIPTOR`, `STRUCTURAL_PREREQUISITE_DEPENDENCY`, `AUTHORITATIVE_TECHNICAL_FACT`, `SOURCE_FACTUAL_CLAIM`.

`hasValidProvenance(evidence)` is the runtime gate every candidate-generating and claim-processing function applies (`sourceRef`/`sourceLocator` non-empty after trimming, `normalizationBasis` a real enum member) — an evidence record failing it is excluded from candidate generation entirely, never silently accepted as the basis for a HIGH-confidence required candidate. TypeScript's own non-optional fields already prevent *omitting* these fields at compile time; this runtime check is the defense against a record supplying empty or malformed values that would still type-check.

## 15. Gap model and plural resolver roles

Six gap types (`SCOPE_BREADTH_GAP`, `PERFORMANCE_DEPTH_GAP`, `TECHNICAL_TRUTH_GAP`, `CURRICULUM_TECHNICAL_CONFLICT`, `ASSESSMENT_GENERALISATION_REVIEW`, `ASSESSMENT_MAPPING_REVIEW`), each preserving the affected candidate key, evidence already available, exactly what is unresolved, and `legitimateResolverRoles` — a **plural** array (CC-18A; CC-18 had a single role, which was too narrow for a gap like scope-breadth that more than one evidence role could legitimately close):

| Gap type | Produced by | Legitimate resolver role(s) |
|---|---|---|
| `SCOPE_BREADTH_GAP` | `computeCategoryBreadthOutcomes` | `OFFICIAL_CURRICULUM`, `PUBLIC_ASSESSMENT` |
| `PERFORMANCE_DEPTH_GAP` | `computePerformanceDepthGaps` | `PUBLIC_ASSESSMENT` |
| `TECHNICAL_TRUTH_GAP` | `computeTechnicalTruthGaps` | `TECHNICAL_TRUTH` |
| `CURRICULUM_TECHNICAL_CONFLICT` | `detectFactualConflicts` | `TECHNICAL_TRUTH` (factual side only — see §12.3) |
| `ASSESSMENT_GENERALISATION_REVIEW` | `detectAssessmentPatternCandidates` | `OFFICIAL_CURRICULUM` |
| `ASSESSMENT_MAPPING_REVIEW` | `generateAssessmentCandidates` | `OFFICIAL_CURRICULUM` |

`TECHNICAL_TRUTH` is never a legitimate resolver of a scope-breadth question — a technical source can establish facts about a category's internals but can never establish that those internals are within curriculum scope (§9, §12).

## 16. Downstream governance gate

```
raw qualification evidence
  -> normalized evidence roles                    (this package's evidence types + registries)
  -> learner-performance / knowledge candidates    (generate*/detect* functions)
  -> evidence/confidence/gap analysis              (attach*/compute*/detect* functions, buildStandardPipeline)
  -> [STOP -- Project-Architect curriculum decision -- outside this package]
  -> governed course matrix / knowledge boundary
  -> reusable domain knowledge assertions
  -> course mappings
  -> canonical lesson/storyboard design
```

This package produces `StandardPipelineResult` (`candidates`, `gaps`, `unmatchedTechnicalTruth`, `unmatchedQualificationLevel`) and stops. It never writes a governed matrix, a knowledge obligation, an assertion, or a lesson, and it never decides which candidate a Project Architect should ultimately accept.

### 16.1 Anti-cheating requirement for the future blind back-test

The upcoming Unit 202 back-test must test the pipeline's ability to derive normalized evidence from available sources — not merely replay a hand-authored expected answer disguised as evidence. Section 14's mandatory provenance is the structural hook that makes this possible: a later, separately authorised qualification-specific adapter must produce an evidence-normalization ledger recording an exact source locator for every normalized item **before** calling `buildStandardPipeline`, so a reviewer can always distinguish source-derived input from a hand-authored expected answer. This package's schemas make that ledger possible; building the actual Unit 202 adapter and running the back-test remain out of scope for this package and are explicitly deferred to a later, Project-Architect-specified package. Any future adapter that uses an LLM to *propose* normalized evidence must still preserve a real source locator for every proposal, validate structural mappings (§6, §9.1, §10) against the governed registries rather than trusting the model's own claim, keep uncertainty explicit (never force a HIGH confidence the evidence doesn't support), and leave final curriculum authority with the Project Architect — "the model says this is the correct mapping" is never sufficient evidence on its own.

## 17. Testing this architecture

`packages/qualification-pipeline/src/rules.test.ts` proves synthetic regression cases A–O (CC-18) and P–AC (CC-18A) — registry-validated assessment mapping (including fabricated-unit and cross-qualification rejection), governed-vs-ungoverned category/family relationships, qualification-level depth attachment without scope creation, structural-vs-claimed prerequisite dependency, independent factual claims with real conflict detection, breadth status independent of assessment presence across all three `CategoryBreadthStatus` values, and provenance-rejection — using topic names chosen for readability only, never Unit 202's own governed content. It also mechanically proves the package's own architectural boundaries: production source contains no qualification/topic-specific literal, and the package declares zero dependency on any other workspace package.
