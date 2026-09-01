# Qualification Knowledge-Construction Pipeline

**Status:** governed architecture, implementation-complete for the generic pipeline stage this document covers (candidate generation + gap/conflict analysis). Package: `@alp/qualification-pipeline` (`packages/qualification-pipeline/src/`). This document is the design authority; the package is its operational encoding, proved by the synthetic regression suite in `packages/qualification-pipeline/src/rules.test.ts`.

**Scope of this package:** raw qualification evidence → learner-performance/knowledge **candidates** → **gap/conflict analysis**. It stops there. It never writes a governed course matrix, knowledge obligation, assertion, or lesson — see §9 (Downstream Gate).

**Independence:** this package has zero dependency on any other workspace package and contains no qualification-specific content or branching. Every example in this document is illustrative; none of the terms used here (or in the package's own test fixtures) may appear as a literal in the package's production source (`types.ts`, `rules.ts`, `index.ts`) — mechanically enforced by a dedicated test.

## 1. Why this exists

CC-17's Unit 202 blind-calibration experiment proved the underlying idea — a course can be constructed from transferable evidence, without proprietary course-provider material — but also exposed real methodological gaps: assessment evidence was treated as confirmation-only rather than a proposition source; broad Range labels were sometimes resolved by guessing the narrowest or broadest reading; exemplars used to teach a category were indistinguishable from mastery requirements; technical-truth sources could be mistaken for curriculum-scope authority. This package hardens the *generic* pipeline against exactly those failure modes, independent of any one qualification, so a later package can blind-back-test it against Unit 202 and a Project Architect can then correct Unit 202's own matrix with a better-founded methodology.

## 2. Source-role hierarchy (locked)

Seven evidence roles, each with exactly one role in the pipeline. This hierarchy is a locked product decision this package implements, not something it revises.

| Role | Type | Pipeline role |
|---|---|---|
| `OFFICIAL_CURRICULUM` | `CurriculumEvidence` | Curriculum **scope** authority |
| `PUBLIC_ASSESSMENT` | `AssessmentEvidence` | Learner-performance discovery + depth/performance calibration |
| `QUALIFICATION_LEVEL` | `PrerequisiteEvidence` (this package's own encoding of the role) | Depth constraint / prerequisite necessity |
| `TECHNICAL_TRUTH` | `TechnicalTruthEvidence` | Factual truth only — **never** curriculum-scope authority on its own |
| `OPTIONAL_CALIBRATION` | `OptionalCalibrationEvidence` | Optional external calibration benchmark — **never** required by the standard pipeline |
| `LEGACY_DIAGNOSTIC` | `LegacyDiagnosticEvidence` | Diagnostic/comparison only — never scope, depth, or factual authority |
| `MODEL_KNOWLEDGE` | *(no evidence type — never a valid input)* | No evidential authority |

`STANDARD_MODE_CANDIDATE_ROLES` (`OFFICIAL_CURRICULUM`, `PUBLIC_ASSESSMENT`, `QUALIFICATION_LEVEL`, `TECHNICAL_TRUTH`) are the only roles `buildStandardPipeline` will accept. `DIAGNOSTIC_ONLY_ROLES` (`OPTIONAL_CALIBRATION`, `LEGACY_DIAGNOSTIC`, `MODEL_KNOWLEDGE`) can never reach a required candidate in standard mode — see §8.

## 3. Candidate identity and the performance-type rule

A candidate is keyed by **`(subject, performanceType)`**, via `candidateKey(subject, performanceType) = "${subject}::${performanceType}"` — never by subject alone. `performanceType` is one of `DEFINE / STATE / DESCRIBE / EXPLAIN / IDENTIFY / RECOGNISE / DISTINGUISH / CALCULATE / APPLY / INTERPRET / DIRECTION_RULE / COMPONENT_ROLE / SCHEMATIC_RECOGNITION / PHYSICAL_RECOGNITION / PROCEDURE / OTHER`.

This is what keeps, say, an AC's own "state the operating principle" requirement (`subject::STATE`) structurally separate from a public-assessment item that additionally tests "identify this component from its schematic symbol" (`subject::SCHEMATIC_RECOGNITION`) — two candidates, two provenances, never one collapsed "knows topic X" proposition, and the AC's own verb is never treated as having silently created the second requirement.

## 4. Candidate disposition model

Every candidate carries exactly one `CandidateDisposition`, assigned deterministically by the rules below — never a discretionary Claude/Product-Architect scope call:

- **`REQUIRED_EXPLICIT_CURRICULUM`** — directly required by AC/LO/Range wording (`generateCurriculumCandidates`).
- **`REQUIRED_ASSESSMENT_EVIDENCED`** — learner performance directly evidenced by legitimate, validly-mapped assessment material (`generateAssessmentCandidates`).
- **`FOUNDATIONAL_PREREQUISITE`** — minimal necessary prerequisite for an existing required candidate (`generatePrerequisiteCandidates`, gated by `necessityKind`).
- **`REPRESENTATIVE_EXEMPLAR`** — a technically valid example used to teach an already-required broad category, not itself a mastery requirement (`generateExemplarCandidates`).
- **`CONTEXTUAL_TEACHING_SUPPORT`** — useful context that does not belong in required mastery (the reject path of `generatePrerequisiteCandidates`).
- **`OPEN_SCOPE_GAP`** — breadth/depth cannot be safely resolved from current transferable evidence (`computeScopeBreadthGaps`).
- **`REVIEW_REQUIRED`** — evidence exists but deterministic rules cannot safely resolve the relationship without Project-Architect judgement (the `ASSESSMENT_PATTERN_CANDIDATE` produced by `detectAssessmentPatternCandidates`).

`REQUIRED_DISPOSITIONS = [REQUIRED_EXPLICIT_CURRICULUM, REQUIRED_ASSESSMENT_EVIDENCED]` is the only set counted as mastery scope by downstream gap logic (§7).

## 5. Proposition-generation routes

### 5.1 Curriculum route — AC-vs-Range rule (`generateCurriculumCandidates`)

A subject becomes a top-level `REQUIRED_EXPLICIT_CURRICULUM` candidate if **either**:

1. it is named directly in an AC/LO's own primary wording (`namedInPrimaryWording: true`), **or**
2. it is a standalone Range item with no `refinesSubject` (a bare category, e.g. a Range entry with no further sub-item breakdown).

These two sources are independent. An AC that names three subjects in its own title, where the Range structure only enumerates sub-classes of ONE of them, still produces all three subjects as scope — the absent Range enumeration of the other two never demotes them (the regression case this rule exists to fix).

A Range item **with** `refinesSubject` never creates its own top-level candidate — it attaches as a depth refinement to the subject it refines (raising that subject's `depthConfidence` from `NONE` to `MEDIUM`), and has no bearing on any other subject's candidacy.

A standalone Range category establishes the **category only** (§5.4) — never any internal implementation detail beyond what other evidence independently supports.

### 5.2 Assessment route — the positive-target rule (`generateAssessmentCandidates`)

Public assessment evidence is a first-class proposition-generation source, not merely depth confirmation for propositions that must already exist elsewhere. An `AssessmentEvidence` record with a non-empty `mappedCurriculumUnitId` (i.e. validly mapped to the qualification) generates a `REQUIRED_ASSESSMENT_EVIDENCED` candidate for its own `(subject, performanceType)`, **regardless of whether any prior curriculum evidence names that exact subject**.

Every `AssessmentEvidence` record preserves: `assessmentSource`, `itemId`, `mappedCurriculumUnitId`, `questionStemRef`, `correctAnswerTarget`, `subject`, `performanceType` — the full provenance chain the task's own positive-target rule requires.

**Positive-target enforcement:** `distractorSubjects` exists on the type purely for provenance/adversarial testing. No candidate-generating function reads it. A question whose correct answer targets subject X, with wrong-answer options Y and Z, generates a candidate for X only — Y and Z never become curriculum candidates merely for having appeared as distractor text in the same item.

### 5.3 Minimal prerequisite rule (`generatePrerequisiteCandidates`)

`PrerequisiteEvidence.necessityKind` is the structural gate that prevents this rule becoming a scope-creep loophole:

- `OPERATIONALLY_NECESSARY_FOR_STATED_PROCEDURE` + a valid `necessaryForCandidateKey` (must reference an existing required candidate) → `FOUNDATIONAL_PREREQUISITE`.
- Anything else (`BACKGROUND_OR_CONTEXTUAL`, or a `necessaryForCandidateKey` that doesn't reference a real required candidate) → capped at `CONTEXTUAL_TEACHING_SUPPORT`.

This is deliberately mechanical: the disposition depends on the evidence's own declared **kind** of necessity, never on how compelling its justification prose reads, and never merely on the fact that a broader topic containing it happens to be in scope.

### 5.4 Range category ≠ arbitrary internal detail (§5.1's category branch + `generateExemplarCandidates`)

A standalone Range category (§5.1, branch 2) establishes only that the named category is examinable. It authorises **no** further internal detail automatically — not from a technical-truth source describing the category's internals, not from private calibration material, not from legacy content. Internal detail enters the candidate set only through one of:

- independent curriculum/assessment evidence that names that specific narrower subject directly (§5.1/§5.2, run again for the narrower subject in its own right), or
- the exemplar route (§5.5) as a clearly-labelled `REPRESENTATIVE_EXEMPLAR`, never as required mastery.

### 5.5 Exemplar vs mastery (`generateExemplarCandidates`)

`ExemplarEvidence.exemplarOfCategory` must match an already-required subject (checked against the required-candidate set built so far) before an exemplar candidate is created at all. When it does, the specific worked example becomes its own `REPRESENTATIVE_EXEMPLAR` candidate — never merged into the category's own candidate, never inflating it to `REQUIRED_*`. `implementationDetailSubjects` on the exemplar is recorded for transparency only; none of those finer sub-details is independently promoted.

## 6. Broad/under-specified labels — `OPEN_SCOPE_GAP` (`computeScopeBreadthGaps`)

A standalone curriculum category (§5.1, branch 2) whose evidence does not declare `breadthFullyEnumerated: true`, and for which at least one `AssessmentEvidence` record declares `underCategory` equal to that subject, produces **both**:

1. an `OPEN_SCOPE_GAP` candidate (`candidateKey: "{subject}::unresolved-breadth"`), and
2. a `SCOPE_BREADTH_GAP` gap record naming exactly which narrower sub-items are directly evidenced and that the remaining breadth is unresolved.

This is the deliberate middle path between the two failure modes this rule exists to prevent: it never concludes "only the evidenced sub-item is required" (the narrowest reading), and never invents an exhaustive enumeration of the category's plausible sub-items (the broadest reading, which would require model knowledge to guess).

## 7. Confidence model

Three independent dimensions on every candidate (`ConfidenceProfile`), each `HIGH / MEDIUM / LOW / NONE` — never collapsed into one opaque score:

- **`scopeConfidence`** — is this in scope at all. `HIGH` for any `REQUIRED_*` candidate; lower for exemplar/prerequisite/gap candidates.
- **`depthConfidence`** — how well the exact performance depth is pinned down. `HIGH` only once assessment evidence attaches; `MEDIUM` with a Range refinement but no assessment evidence; `NONE` with neither.
- **`technicalTruthConfidence`** — whether an approved technical-truth source has confirmed the factual content. `HIGH` once `attachTechnicalTruth` matches a subject; `NONE` otherwise.

## 8. Technical truth vs curriculum scope (constitutional rule)

`TECHNICAL_TRUTH` evidence is attached by `attachTechnicalTruth` to a candidate **only when its `subject` matches an existing candidate's `subject`**. It updates `factualStatement` (the taught fact) and `technicalTruthConfidence`, but it can never, by itself, create a new required candidate — a `TechnicalTruthEvidence` record for a subject with no curriculum/assessment-generated candidate is returned in `unmatchedTechnicalTruth`, available for reference, never promoted to scope. This is what stops a technical article that happens to discuss several related components from turning all of them into curriculum requirements when only one is actually in scope.

When `TechnicalTruthEvidence.conflictingCurriculumStatement` is present (the curriculum/provider material asserts something the approved technical source contradicts), the pipeline:

- retains curriculum's own authority over **whether** the topic is in scope (the candidate's disposition/scope is untouched);
- retains technical truth's own authority over **what** is taught (`factualStatement` is always set from `correctStatement`, never from the conflicting curriculum wording);
- emits a `CURRICULUM_TECHNICAL_CONFLICT` gap record for Project-Architect review.

The two statements are never silently reconciled, and an erroneous factual claim is never promoted into `factualStatement` merely because a curriculum or provider source asserted it.

## 9. Standard-mode exclusion of optional-calibration and legacy content

`buildStandardPipeline`'s own input type (`StandardPipelineInput`) does not accept `OptionalCalibrationEvidence` or `LegacyDiagnosticEvidence` at the type level. As defense in depth against a routing bug, every evidence record actually passed in is also checked at runtime (`assertStandardModeRole`) and the call throws if any record's own `role` is not one of `STANDARD_MODE_CANDIDATE_ROLES`.

The only legitimate use of calibration/legacy evidence anywhere in this package is `compareAgainstDiagnosticEvidence(candidates, calibration, legacy)` — a **read-only** function that never mutates `candidates`, never returns a `KnowledgeCandidate`, and is called only *after* the standard pipeline has already produced its candidates. It exists to support a later, separate calibration/review workflow (as CC-17 already does for Unit 202) — calibration and legacy content compare against the standard output; they never feed backward into generating it.

## 10. Assessment family-pattern generalisation (`detectAssessmentPatternCandidates`)

`AssessmentEvidence.familyKey` groups items belonging to the same coherent Range/component family. A pattern candidate (`disposition: REVIEW_REQUIRED`, `assessmentPattern: { familyKey, evidencedMembers }`) is emitted only when the **same performance type** is evidenced across **at least two distinct subjects** sharing a `familyKey`. A single tested family member never generalises. The individually tested members remain their own, separate `REQUIRED_ASSESSMENT_EVIDENCED` candidates regardless; untested family members are never mentioned anywhere in the output, since no evidence record names them. The pattern candidate is paired with an `ASSESSMENT_GENERALISATION_REVIEW` gap record naming exactly which members were tested and what remains unresolved.

## 11. Absence-of-evidence rule

Nowhere in this pipeline does "no assessment item was found for X" cause X's required disposition to be downgraded or removed. An explicit curriculum candidate with no assessment evidence simply keeps `depthConfidence: NONE` or `MEDIUM` and accrues a `PERFORMANCE_DEPTH_GAP` (§12) — its `disposition` and `scopeConfidence: HIGH` are untouched. Public assessment is treated throughout as *positive* evidence only, never as exhaustive negative evidence.

## 12. Structured gap/conflict production

Five gap types, each preserving the affected candidate, the evidence already available, exactly what is unresolved, and which evidence role could legitimately resolve it (`GapRecord.legitimateResolverRole`):

| Gap type | Produced by | Legitimate resolver |
|---|---|---|
| `SCOPE_BREADTH_GAP` | `computeScopeBreadthGaps` | `OFFICIAL_CURRICULUM` (further Range/spec detail) |
| `PERFORMANCE_DEPTH_GAP` | `computePerformanceDepthGaps` | `PUBLIC_ASSESSMENT` |
| `TECHNICAL_TRUTH_GAP` | `computeTechnicalTruthGaps` | `TECHNICAL_TRUTH` |
| `CURRICULUM_TECHNICAL_CONFLICT` | `attachTechnicalTruth` | `TECHNICAL_TRUTH` (factual side only — see §8) |
| `ASSESSMENT_GENERALISATION_REVIEW` | `detectAssessmentPatternCandidates` | `OFFICIAL_CURRICULUM` |

A gap is never resolved by a role other than the one that legitimately owns that kind of question — e.g. a technical-truth gap is never "resolved" by re-reading curriculum wording, and a scope-breadth gap is never resolved by a technical source describing implementation detail.

## 13. Downstream governance gate

```
raw qualification evidence
  -> normalized evidence roles                    (this package's evidence types)
  -> learner-performance / knowledge candidates    (generate*/detect* functions)
  -> evidence/confidence/gap analysis              (attach*/compute* functions, buildStandardPipeline)
  -> [STOP -- Project-Architect curriculum decision -- outside this package]
  -> governed course matrix / knowledge boundary
  -> reusable domain knowledge assertions
  -> course mappings
  -> canonical lesson/storyboard design
```

This package produces `StandardPipelineResult` (`candidates`, `gaps`, `unmatchedTechnicalTruth`) and stops. It never writes a governed matrix, a knowledge obligation, an assertion, or a lesson, and it never decides which candidate a Project Architect should ultimately accept. A future package performs a qualification-specific blind back-test by supplying real evidence records to `buildStandardPipeline` and comparing its output to the qualification's existing governed conclusions (mirroring CC-17's own blind-calibration-baseline pattern) — that comparison, and any resulting matrix correction, remains a separate, later, Project-Architect-authorised package.

## 14. Testing this architecture

`packages/qualification-pipeline/src/rules.test.ts` proves synthetic regression cases A–O (task section 20) plus the minimal-prerequisite, exemplar-vs-mastery, and absence-of-evidence rules, using topic names chosen for readability only — never Unit 202's own governed content. It also mechanically proves the package's own architectural boundaries: production source contains no qualification/topic-specific literal, and the package declares zero dependency on any other workspace package.
