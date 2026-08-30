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

## 15. Rich teaching content blocks (Remediation Package 2 implementation record, CC-13C.2B)

`StoryboardSection.contentBlockIds` (§2 above) is this document's conceptual placeholder for a section's rich teaching content. Remediation Package 2 implemented the real, concrete governed shape it referred to, in `packages/content-schema/src/lesson-plan.ts`'s `lessonStepSchema`. This section records that real implementation as governance contract; §2's `StoryboardSection` shape is unchanged and still describes the storyboard-level (Package 3) concept, one layer up from the concrete block schema recorded here.

```ts
type LessonStepContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; style: "ordered" | "unordered"; items: string[] } // min 1 item, no nesting
  | {
      type: "visual";
      source:
        | { kind: "diagram"; diagramBlueprintId: string; diagramParameters?: Record<string, string | number | boolean> }
        | { kind: "visual_aid"; visualAidBlueprintId: string };
    }
  | { type: "formula"; formulaFamilyId: string }
  | { type: "worked_example"; workedExampleBlueprintId: string }
  | { type: "callout"; variant: "key_point" | "definition" | "caution"; text: string };
```

**Exactly these six block families, no others** — no `subheading` block, no Markdown/HTML/inline-rich-text-span system, no free-form presentation markup of any kind. Every governed-content-bearing block (`visual`/`formula`/`worked_example`) reuses an EXISTING governed reference (`FormulaFamily`/`WorkedExampleBlueprint`/`DiagramBlueprint`/`VisualAidBlueprint` from `./pedagogy.ts`) — never a new parallel content type.

**On `LessonStep`:**
- `contentBlocks?: LessonStepContentBlock[]` — optional, non-empty when present (`.min(1)`; an explicit `[]` is schema-invalid, never silently treated as "absent").
- `learnerFacingHeading?: string` — optional plain-text learner-facing heading, distinct from `semanticUnit` below.

**Presence/absence migration semantics:** absent `contentBlocks` = the pre-existing legacy rendering path (`representation.*` refs + reconstructed body statements), unchanged. Present `contentBlocks` = the SOLE authoritative learner-visible representation for that step, rendered in exactly authored order — never resorted, regrouped, or merged with legacy output for the same step.

**Governance invariants enforced by `lessonPlanSchema`'s `superRefine` when `contentBlocks` is present:**
1. **Legacy exclusivity** — none of `representation.formulaFamilyId` / `.diagramBlueprintId` / `.workedExampleBlueprintId` / `.visualAidBlueprintId` / `.diagramParameters` may also be set on the same step. `contentBlocks`, once present, is the only path that may independently render content for that step.
2. **Teaching/question step separation** — a step declaring `contentBlocks` must not also declare `completionCondition: "correct_answer_required"` or a `questionBlueprintId`. Rich teaching content and an evidence-bearing graded question must occupy separate semantic steps.
3. **Explicit answer-leak governance** — a step declaring `contentBlocks` must explicitly set `mayRevealTargetAnswer: true | false`; leaving it undefined is a validation failure (the implicit "absent means false" convention legacy steps use does not apply once a step is rich-teaching-capable).

**Supported visual source forms, this package only:** `diagram` (deterministic, engine-rendered) and `visual_aid` (governed SVG visual aid) — the two visual forms the current mobile runtime already renders. **Produced-artwork integration is explicitly NOT part of this package.** The `VisualRequirement` → `ReferenceDossier` → `ProductionVisualAsset` authority chain (§4-§7, §13 above) is Packages 3-5's later, separately-gated work (Package 3, storyboard/visual-opportunity planning, has not started); this schema reserves no runtime path for it and this package must never be read as having wired produced artwork into a content block.

**Governed reference ownership/dependency validation:** a `contentBlocks` block's formula/worked-example/diagram/visual-aid references are walked into the SAME dependency-manifest categories legacy `representation.*` references already use (`packages/learning-engine/src/content-dependencies.ts`'s `computeLessonContentDependencies` — no second, parallel dependency shape), and are validated for real existence at mobile-projection generation time by `scripts/content/generate-mobile-projection.ts`'s fail-loud `pickAll()` (a referenced-but-missing governed id fails generation, never silently ships to a device).

**Grounding remains at step/section level.** `contentBlocks` introduces no new per-paragraph/per-block assertion-grounding field — a step's `teaches`/`reinforces`/`tests`/`capabilityIds` (§1's `V1PedagogicalStepRole` machinery, and the existing `lessonStepSchema` fields of the same names) remain the sole grounding mechanism, exactly as for a legacy step.

**What mechanical validation does and does not prove:** the schema and its `superRefine`/dependency-walk checks prove structural integrity — every governed reference resolves, mutual-exclusivity and step-separation rules hold, `mayRevealTargetAnswer` is explicit. **They cannot and do not attempt to prove that authored `paragraph`/`list`/`callout` prose is semantically accurate, on-syllabus, or pedagogically sound.** Independent human / Project Architect content review remains a required gate before any lesson adopts this representation, exactly as for every other governed authored-content contract in this document.

**Adoption status:** zero real lessons currently declare `contentBlocks` or `learnerFacingHeading` (see `reports/learning-package-pipeline-audit/LESSON-DEPTH-AND-FRAGMENTATION-REGISTER.md` §8). This section documents implemented governance capability, not adopted content.
