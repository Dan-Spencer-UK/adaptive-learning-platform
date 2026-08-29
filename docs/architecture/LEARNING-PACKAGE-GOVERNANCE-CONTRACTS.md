# Learning Package Governance Contracts

**Purpose:** implementation-level contract specification for ADR-0005 and ADR-0006. These are conceptual TypeScript shapes; the Implementation Engineer must map them onto existing schemas rather than duplicating equivalent types.

**V1 principle:** one canonical lesson route; assessment-driven Guided Revision after completed/submitted formative/mock assessment.

## 1. Core enums

```ts
type V1PedagogicalStepRole =
  | "ORIENTATION"
  | "CONCEPT_EXPLANATION"
  | "VISUAL_EXPLANATION"
  | "INTERACTIVE_MODEL"
  | "WORKED_EXAMPLE"
  | "REINFORCEMENT"
  | "LESSON_CHECK"
  | "APPLICATION_PRACTICE"
  | "RECAP"
  | "EXIT_COMPLETION";

type PostV1AdaptiveStepRole =
  | "DIAGNOSTIC_CHECK"
  | "REMEDIATION"
  | "RECHECK"
  | "TRANSFER_APPLICATION"
  | "DELAYED_RETRIEVAL";

type VisualNeedClassification = "REQUIRED" | "USEFUL" | "OPTIONAL" | "NOT_REQUIRED";

type VisualLearnerState =
  | "TEACHING"
  | "FORMATIVE"
  | "ASSESSMENT"
  | "FEEDBACK"
  | "SHARED";

type VisualProductionClass =
  | "DETERMINISTIC_TECHNICAL"
  | "ORIGINAL_REDRAW_FROM_REFERENCE"
  | "HYBRID_REDRAW_PLUS_DETERMINISTIC_OVERLAY"
  | "GENERATIVE_CONCEPTUAL"
  | "PHYSICAL_RECOGNITION"
  | "STANDARD_SYMBOL";

type ReferenceRole =
  | "TECHNICAL_AUTHORITY"
  | "SYMBOL_AUTHORITY"
  | "PHYSICAL_APPEARANCE_REFERENCE"
  | "LAYOUT_REFERENCE"
  | "STYLE_INSPIRATION"
  | "PEDAGOGICAL_REFERENCE";

type AssessmentAttemptStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUSPENDED"
  | "COMPLETED_AWAITING_SUBMISSION"
  | "SUBMITTED";

type V1LessonRoutePolicy = "CANONICAL_FIXED_ROUTE";
```

The existing richer lesson-step/adaptive schema may retain post-V1 roles. V1 publication must not require or dynamically inject them into an ordinary lesson route.

## 2. Canonical V1 lesson storyboard

```ts
interface LessonStoryboard {
  lessonId: string;
  syllabusNodeIds: string[];
  introducedAssertionIds: string[];
  reinforcedAssertionIds: string[];
  capabilityIds: string[];
  prerequisiteCapabilityIds: string[];
  routePolicy: V1LessonRoutePolicy;
  sections: StoryboardSection[];
  visualOpportunityAnalysisId: string;
  assessmentMappingIds: string[];
  status: "DRAFT" | "REVIEWED" | "APPROVED";
}

interface StoryboardSection {
  sectionId: string;
  role: V1PedagogicalStepRole;
  purpose: string;
  capabilityIds: string[];
  requiredKnowledgeIds: string[];
  introducesKnowledgeIds: string[];
  contentBlockIds: string[];
  visualRequirementIds: string[];
  questionBlueprintIds: string[];
  mayRevealTargetAnswer: boolean;

  /**
   * A section may exceed one viewport. It is not a slide-size contract.
   */
  scrollingAllowed: true;

  /**
   * Used by QA to prevent arbitrary one-sentence fragmentation.
   */
  semanticUnit: string;
}
```

### V1 route validator

Given the same released lesson version, changing learner mastery/evidence/prerequisite state must not change the ordered canonical `sections` list.

Existing post-V1 adaptive assemblers may remain in the repository, but the V1 normal Learn path must not depend on them.

## 3. Teaching-section density / coherence record

```ts
interface TeachingSectionQualityRecord {
  lessonId: string;
  sectionId: string;
  semanticUnit: string;
  hasSubstantiveExplanation: boolean;
  hasReinforcementWhereNeeded: boolean;
  visualRequirementIds: string[];
  deliberateShortSectionReason?: string;
  textOnlyJustification?: string;
}
```

Validator intent:
- a short focused question/interaction may be a legitimate short section;
- a teaching concept split into multiple one-sentence Continue screens without explicit pedagogical reason is a failure;
- a long uninterrupted wall of prose is also a review failure;
- scrolling is permitted and should be preferred to arbitrary fragmentation.

## 4. Visual opportunity analysis

```ts
interface VisualOpportunityAnalysis {
  id: string;
  lessonId: string;
  reviewedConcepts: Array<{
    capabilityId?: string;
    assertionId?: string;
    rationale: string;
    visualNeed: VisualNeedClassification;
    proposedRole?: string;
    candidateVisualRequirementIds: string[];
    reinforcementVisualConsidered: boolean;
  }>;
  textOnlyJustification?: string;
  status: "CANDIDATE" | "PROJECT_ARCHITECT_REVIEWED" | "APPROVED";
}
```

A blank list is not equivalent to a completed analysis.

## 5. Visual Requirement Register entry

```ts
interface VisualRequirement {
  assetId: string;
  familyId: string;
  unitId: string;
  lessonIds: string[];
  capabilityIds: string[];
  assertionIds: string[];
  instructionalPurpose: string;
  needClassification: VisualNeedClassification;
  productionClass: VisualProductionClass;
  learnerState: VisualLearnerState;
  mustShow: string[];
  mustNotShow: string[];
  answerLeakRisk: "NONE" | "LOW" | "MEDIUM" | "HIGH";
  variantRequirements: Array<
    "TEACHING" |
    "ASSESSMENT_SAFE" |
    "FEEDBACK" |
    "PHYSICAL" |
    "SYMBOL"
  >;
  referenceDossierIds: string[];
  designSystemVersion: string;
  approval: "CANDIDATE" | "PROJECT_ARCHITECT_REVIEWED" | "PRODUCT_OWNER_APPROVED";
}
```

V1 does not require bespoke `REMEDIATION` visual variants merely because an adaptive misconception path could exist later.

## 6. Reference dossier

```ts
interface ReferenceDossier {
  id: string;
  assetId: string;
  reviewedBy: "PROJECT_ARCHITECT";
  status: "CANDIDATE" | "APPROVED" | "REJECTED";
  references: Array<{
    referenceId: string;
    sourceUrl?: string;
    localRef?: string;
    title?: string;
    rightsNote: string;
    roles: ReferenceRole[];
    authoritativeFor: string[];
    notAuthoritativeFor: string[];
  }>;
  preserveExactly: string[];
  changeDeliberately: string[];
  remove: string[];
  add: string[];
  neverInfer: string[];
  assessmentStateNotes: string[];
}
```

A production run must reject a dossier not marked APPROVED.

## 7. Visual family contract

```ts
interface VisualFamilyContract {
  familyId: string;
  designSystemVersion: string;
  canvasToken: string;
  aspectRatio: "4:3" | "1:1" | "16:9" | string;
  productionClass: VisualProductionClass;
  sharedReferenceDossierIds: string[];
  lineWeightProfile: string;
  semanticColourRoles: string[];
  labelPolicy: "DETERMINISTIC_OVERLAY" | "BAKED_EXCEPTION" | "NONE";
  requiredVariants: string[];
  familyConsistencyNotes: string[];
}
```

## 8. Question prerequisite/evidence contract

```ts
type V1QuestionRole =
  | "LESSON_CHECK"
  | "FORMATIVE_MOCK"
  | "SUMMATIVE"
  | "EXAM_PRACTICE";

interface QuestionGovernanceContract {
  blueprintId: string;
  targetCapabilityIds: string[];
  requiredKnowledgeIds: string[];
  pedagogicalRole: V1QuestionRole;
  evidenceContext: string;
  answerLeakRisk: "NONE" | "LOW" | "MEDIUM" | "HIGH";
  visualRequirementIds: string[];

  /**
   * Required for questions whose submitted result can influence Guided Revision.
   */
  revisionLessonIds: string[];
}
```

Validator rules:
- every `requiredKnowledgeId` resolves to taught-earlier, explicitly-prior, or governed retrieval provenance;
- every `FORMATIVE_MOCK` item has at least one useful canonical `revisionLessonId`;
- `LESSON_CHECK` items may create evidence but do not trigger/update V1 Guided Revision.

Legacy/post-V1 diagnostic hypothesis fields may remain in existing schemas but are not mandatory for V1 lesson authoring.

## 9. Formative/mock assessment instance contract

```ts
interface FormativeAssessmentInstance {
  assessmentInstanceId: string;
  assessmentDefinitionId: string;
  scopeId: string; // e.g. unit or qualification
  contentReleaseId: string;
  questionInstanceIds: string[];
  status: AssessmentAttemptStatus;
  startedAt?: string;
  completedAt?: string;
  submittedAt?: string;
}
```

### Submission invariant

`submittedAt` may exist only when all mandatory assessment completion criteria are satisfied.

Guided Revision generation is prohibited unless `status === "SUBMITTED"`.

`IN_PROGRESS`, `SUSPENDED`, and `COMPLETED_AWAITING_SUBMISSION` must be side-effect free with respect to current Guided Revision.

## 10. Submitted assessment result

```ts
interface SubmittedAssessmentResult {
  assessmentInstanceId: string;
  scopeId: string;
  submittedAt: string;
  itemResults: Array<{
    questionInstanceId: string;
    capabilityIds: string[];
    revisionLessonIds: string[];
    correct: boolean;
    evidenceWeight?: number;
  }>;
}
```

This object is the V1 trigger input to weakness analysis / Guided Revision.

## 11. V1 weakness and Guided Revision contracts

```ts
interface LessonWeaknessResult {
  lessonId: string;
  contributingCapabilityIds: string[];
  contributingQuestionInstanceIds: string[];
  priorityScore: number;
  explanation: string;
}

interface GuidedRevisionPlan {
  planId: string;
  scopeId: string;
  sourceAssessmentInstanceId: string;
  sourceAssessmentSubmittedAt: string;
  generatedAt: string;
  policyVersion: string;
  items: GuidedRevisionPlanItem[];
}

interface GuidedRevisionPlanItem {
  rank: number;
  lessonId: string;
  priorityBand: "HIGH" | "MEDIUM" | "LOW";
  reason: string;
  contributingCapabilityIds: string[];
}
```

Rules:
- ranking is deterministic;
- duplicate lesson mappings collapse into one item;
- every item resolves to a production canonical lesson;
- the plan is based on the most recently submitted assessment in that scope;
- prior plans remain auditable but only one current plan is active per learner/scope;
- completing a revision lesson does not by itself regenerate the plan.

## 12. Gate result

```ts
type GateName =
  | "CURRICULUM"
  | "PEDAGOGY"
  | "ASSESSMENT_INTEGRITY"
  | "VISUAL"
  | "LEARNER_PRESENTATION"
  | "RUNTIME"
  | "FORMATIVE_ASSESSMENT"
  | "GUIDED_REVISION"
  | "PRODUCT_OWNER";

interface LearningPackageGateResult {
  scopeId: string;
  lessonId?: string;
  gate: GateName;
  status: "PASS" | "FAIL" | "WAIVED" | "NOT_RUN";
  checkedAt: string;
  evidenceRefs: string[];
  failures: string[];
  waiver?: {
    reason: string;
    owner: string;
    expiresAt?: string;
  };
}
```

## 13. Production asset eligibility

```ts
interface ProductionVisualAsset {
  assetId: string;
  version: number;
  familyId: string;
  sourceVisualRequirementId: string;
  referenceDossierIds: string[];
  designSystemVersion: string;
  learnerState: VisualLearnerState;
  path: string;
  sha256: string;
  technicalQa: "PASS" | "FAIL";
  pedagogicalQa: "PASS" | "FAIL";
  designQa: "PASS" | "FAIL";
  productOwnerApproval: "APPROVED" | "PENDING" | "REJECTED";
  eligibility: "PRODUCTION_ELIGIBLE" | "DEVELOPMENT_ONLY" | "SUPERSEDED_ARCHIVE";
}
```

Runtime must resolve only `PRODUCTION_ELIGIBLE` assets for released content, unless a clearly governed development build flag is active.

## 14. Required derivations / validations

The implementation should be able to derive/prove:

### Lesson integrity
- lesson → all taught knowledge;
- lesson → all embedded checked knowledge;
- checked minus taught/prior = failure;
- lesson route is invariant to mastery/evidence for V1;
- arbitrary one-sentence fragmentation = review failure;
- scrollable coherent sections are supported.

### Visual integrity
- lesson → all visual opportunities reviewed;
- REQUIRED visuals minus eligible assets = failure;
- generated assets without approved dossier = failure;
- active assets with stale design-system version = review trigger;
- assessment states using answer-bearing teaching variants = failure.

### Assessment integrity
- assessment item → capability → revision lesson;
- submitted assessment is complete before Guided Revision trigger;
- incomplete/unsubmitted assessment cannot mutate current plan;
- stable assessment question instances persist through resume;
- assessment-safe visuals do not leak answers.

### Guided Revision integrity
- latest submitted assessment in scope → exactly one current plan;
- repeated rendering/navigation cannot regenerate plan accidentally;
- plan ordering is deterministic;
- duplicate lesson mappings are deduplicated;
- plan item → production canonical lesson;
- Guided Revision lesson completion does not imply repaired mastery;
- next submitted assessment rebuilds/replaces current plan.

### Publication
- released lesson/package without all mandatory applicable gate results = failure.
