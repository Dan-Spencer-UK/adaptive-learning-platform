/**
 * Governed Lesson Plan / Lesson Step content model -- the orchestration
 * layer ARCH-003 describes, sitting above (never duplicating) the CC-05
 * pedagogical chain this package already governs (./pedagogy.ts):
 *
 *   Source -> Atomic Assertion -> Assertion Family -> Capability/Evidence
 *   Target -> Teaching Representation -> Question Blueprint ->
 *   Deterministic Variant -> Evidence
 *
 * Design authority: docs/architecture/LESSON-PLAYER-AND-LESSON-PLAN-
 * ARCHITECTURE.md (ARCH-003, approved) §5 ("A future implementation
 * package must define the exact Zod/TypeScript shape of these; this
 * document fixes only the capability surface they must cover") and §13
 * ("Lesson Plan ... references governed content ... it does not
 * duplicate factual/pedagogical truth into itself. A Lesson Step's
 * 'teaches assertion X' field is a reference, never a restatement.").
 *
 * This module governs the CANONICAL lesson plan only -- the pedagogically
 * valid instructional design as authored/approved content. It does not
 * implement the learner-specific adaptive assembler (ARCH-003 §6) or any
 * runtime/player behaviour; those are later packages. Every reference
 * field here is a stable id into the real governed corpus
 * (`AssertionFamily`/`Capability`/`QuestionBlueprint`/etc. in
 * ./pedagogy.ts, or a raw assertion/misconception identifier in
 * ./knowledge-graph.ts) -- cross-corpus existence of those ids is
 * verified by scripts/content/validate-lesson-plan.ts (the same
 * "schema validates internal shape, a separate script recomputes
 * cross-reference integrity against the live corpus" split
 * ./pedagogy.ts and scripts/content/validate-pedagogy.ts already use),
 * not by this file, which must stay corpus-independent.
 *
 * Every field earns its place against a concrete architectural
 * requirement in ARCH-003 -- this is deliberately not a giant
 * speculative schema (task brief §4).
 */

import { z } from "zod";
import { difficultyBandSchema, misconceptionMappingManifestSchema } from "./pedagogy.ts";

const stableId = z.string().min(1);

// ---------------------------------------------------------------------
// Presentation mode (ARCH-003 §9/§15: Learn vs. Review/Reference)
// ---------------------------------------------------------------------

export const presentationModeSchema = z.enum(["learn", "review"]);
export type PresentationMode = z.infer<typeof presentationModeSchema>;

// ---------------------------------------------------------------------
// Lesson step type -- expresses PEDAGOGICAL FUNCTION, never a UI
// component (ARCH-003 task brief §6: "good: worked_example / bad:
// blue_card_with_button" -- the eventual player chooses presentation).
// ---------------------------------------------------------------------

export const lessonStepTypeSchema = z.enum([
  "orientation",
  "concept_explanation",
  "visual_explanation",
  "worked_example",
  "guided_interaction",
  "independent_question",
  "misconception_discrimination",
  "retrieval_check",
  "remediation",
  "transfer_application",
  "recap",
  "exit_completion",
]);
export type LessonStepType = z.infer<typeof lessonStepTypeSchema>;

/** Whether a step is always taken, or only reachable via an explicit branch route (task brief §5's "required vs conditionally skippable status"). */
export const stepRequirementSchema = z.enum([
  "required",
  "conditional_skip_if_mastered",
  "conditional_remediation_only",
]);
export type StepRequirement = z.infer<typeof stepRequirementSchema>;

// ---------------------------------------------------------------------
// Governed-content references a step may carry. Every field is a stable
// id into an existing governed type (./pedagogy.ts) -- never inline
// content. All optional: a given step only references what it needs.
// ---------------------------------------------------------------------

export const stepRepresentationRefsSchema = z.object({
  formulaFamilyId: stableId.optional(),
  diagramBlueprintId: stableId.optional(),
  workedExampleBlueprintId: stableId.optional(),
  visualAidBlueprintId: stableId.optional(),
});
export type StepRepresentationRefs = z.infer<typeof stepRepresentationRefsSchema>;

/**
 * The DO -> RESPOND -> FEEDBACK -> NEXT contract (ARCH-003 §7/§16):
 * expresses what kind of learner action this step requires and when the
 * answer is revealed, without encoding any native component name or
 * styling (task brief §16's `interactionRole`/`answerReveal` example).
 */
export const interactionRoleSchema = z.enum([
  "predict",
  "select",
  "calculate",
  "interpret",
  "identify",
  "compare",
  "apply",
  "explain_structured",
  "correct_misconception",
]);
export type InteractionRole = z.infer<typeof interactionRoleSchema>;

export const answerRevealSchema = z.enum(["before_response", "after_submission", "on_request", "not_applicable"]);
export type AnswerReveal = z.infer<typeof answerRevealSchema>;

export const stepPresentationContractSchema = z.object({
  interactionRequired: z.boolean(),
  interactionRole: interactionRoleSchema.optional(),
  answerReveal: answerRevealSchema.default("not_applicable"),
  /** ARCH-003 §4 scrolling rule: a step's own content may scroll where it genuinely needs to; the lesson itself never does. */
  contentMayScroll: z.boolean().default(false),
  progressiveReveal: z.boolean().default(false),
});
export type StepPresentationContract = z.infer<typeof stepPresentationContractSchema>;

export const feedbackModeSchema = z.enum(["immediate", "after_step", "deferred"]);

export const stepFeedbackContractSchema = z.object({
  mode: feedbackModeSchema,
  explainWhy: z.boolean().default(true),
});
export type StepFeedbackContract = z.infer<typeof stepFeedbackContractSchema>;

/**
 * Explicit governed remediation/branch routes (task brief §13: "Avoid
 * vague metadata such as `remediate: true` when the actual route can be
 * represented explicitly"). Encodes enough for a FUTURE deterministic
 * assembler to route learners -- this package does not implement that
 * assembler or any runtime branching logic itself (ARCH-003 §6).
 */
export const branchTriggerSchema = z.enum([
  "misconception_detected",
  "capability_not_evidenced",
  "below_tolerance",
  "remediation_cleared",
]);
export type BranchTrigger = z.infer<typeof branchTriggerSchema>;

export const stepBranchRouteSchema = z.object({
  trigger: branchTriggerSchema,
  misconceptionIdentifier: stableId.optional(),
  destinationStepId: stableId,
  description: z.string().min(1),
});
export type StepBranchRoute = z.infer<typeof stepBranchRouteSchema>;

// ---------------------------------------------------------------------
// Lesson Step
// ---------------------------------------------------------------------

export const lessonStepSchema = z.object({
  id: stableId,
  type: lessonStepTypeSchema,
  purpose: z.string().min(1),
  requirement: stepRequirementSchema.default("required"),

  /** Atomic assertion identifiers this step primarily teaches (new content), reinforces (secondary), or tests (assessed here) -- references only, per ARCH-003 §13. */
  teaches: z.array(stableId).default([]),
  reinforces: z.array(stableId).default([]),
  tests: z.array(stableId).default([]),

  assertionFamilyId: stableId.optional(),
  capabilityIds: z.array(stableId).default([]),
  misconceptionTargets: z.array(misconceptionMappingManifestSchema).default([]),
  representation: stepRepresentationRefsSchema.default({}),
  questionBlueprintId: stableId.optional(),

  presentation: stepPresentationContractSchema,
  scaffoldingLevel: z.enum(["guided", "standard", "independent"]),
  cognitiveDemand: difficultyBandSchema,
  feedback: stepFeedbackContractSchema,

  completionCondition: z.enum(["view_acknowledged", "answer_submitted", "correct_answer_required"]),
  branchRoutes: z.array(stepBranchRouteSchema).default([]),

  /** Capability ids this step, if answered, may emit learner evidence for -- referenced, not computed; the evidence engine remains a separate, unmodified system. */
  evidenceEmitted: z.array(stableId).default([]),

  /**
   * The EXPLICIT capability whose mastery state controls a
   * `conditional_skip_if_mastered` step's skip decision (CC-06D,
   * Correction F §10.3). Required on every non-retrieval
   * `conditional_skip_if_mastered` step and prohibited elsewhere --
   * authored array order (`evidenceEmitted[0]`/`capabilityIds[0]`) must
   * never silently decide mastery gating.
   */
  masteryGateCapabilityId: stableId.optional(),
});
export type LessonStep = z.infer<typeof lessonStepSchema>;

// ---------------------------------------------------------------------
// Completion / exit criteria -- distinguishes lesson completion from
// mastery (task brief §14): completion is defined here; mastery/evidence
// interpretation remains the existing learner evidence architecture's
// job, never reinvented inside a lesson plan.
// ---------------------------------------------------------------------

export const lessonCompletionCriteriaSchema = z.object({
  requiredStepIds: z.array(stableId).min(1),
  requiredCapabilityEvidence: z.array(stableId).min(1),
  requiresRemediationClearance: z.boolean().default(true),
  exitSummary: z.string().min(1),
});
export type LessonCompletionCriteria = z.infer<typeof lessonCompletionCriteriaSchema>;

// ---------------------------------------------------------------------
// Remediation eligibility -- a SEPARATE, purpose-specific relationship
// from `targetAssertionFamilyIds` (task brief, Package B correction
// §4/§5). `targetAssertionFamilyIds` means "this lesson's own main
// instructional content"; many lessons (an introduction, a refresher,
// exam revision, retrieval practice, ...) may freely share the same
// target family with no ambiguity at all -- that overlap must never be
// prohibited. `remediationEligibility` is the much narrower, opt-in
// declaration "this lesson is a candidate a learner can be routed to
// when a specific prerequisite family is evidenced as weak/conflicting".
// Semantic metadata on the candidate lesson itself, deliberately not a
// brittle `remediationLessonId` pointer stored on the family or on the
// lesson that assumes the prerequisite (see
// prerequisite-resolution.ts's header comment for the resolution rule
// this enables).
// ---------------------------------------------------------------------

export const remediationEligibilitySchema = z.object({
  assertionFamilyId: stableId,
  /** At most one lesson per (contentRelease, assertionFamilyId) may set this true -- the deterministic tiebreak when more than one lesson is remediation-eligible for the same family (enforced by scripts/content/validate-lesson-plan.ts's ambiguousRemediationCandidates gate and re-verified defensively by the assembler). With only one eligible candidate, this flag is irrelevant -- it only matters once there is more than one. */
  isDefaultRemediation: z.boolean().default(false),
});
export type RemediationEligibility = z.infer<typeof remediationEligibilitySchema>;

// ---------------------------------------------------------------------
// Lesson Plan
// ---------------------------------------------------------------------

export const lessonPlanSchema = z.object({
  id: stableId,
  schemaVersion: z.literal(1),
  version: z.number().int().min(1),
  title: z.string().min(1),
  learnerFacingDescription: z.string().min(1),
  curriculumUnit: z.string().min(1),

  /** Assertion-family ids (foundational or vocational) this lesson assumes without reteaching -- referenced, never restated. */
  prerequisiteKnowledge: z.array(stableId).default([]),
  targetAssertionFamilyIds: z.array(stableId).min(1),
  targetAssertionIdentifiers: z.array(stableId).default([]),
  targetCapabilityIds: z.array(stableId).min(1),
  /** Families this lesson is eligible to remediate a learner into -- see the module-level comment above `remediationEligibilitySchema`. Empty by default: most lessons are not remediation candidates for anything. */
  remediationEligibility: z.array(remediationEligibilitySchema).default([]),

  estimatedDurationMinutes: z.number().positive(),
  instructionalStrategy: z.string().min(1),

  steps: z.array(lessonStepSchema).min(1),

  misconceptionTargets: z.array(misconceptionMappingManifestSchema).default([]),
  /** Free-form retrieval hook tags a future spaced-retrieval scheduler can query by -- no scheduling logic here (ARCH-003 §6). */
  retrievalTags: z.array(z.string().min(1)).default([]),

  completionCriteria: lessonCompletionCriteriaSchema,
  presentationModes: z.array(presentationModeSchema).min(1),

  /** Ties this lesson's deterministic identity to a content release, mirroring CC-05B's `contentRelease` concept (packages/calculation-engine/src/seed.ts) -- same lesson id/version/contentRelease must always mean the same canonical plan (ARCH-003 §18, task brief §18). */
  contentRelease: stableId,
})
  .superRefine((lesson, ctx) => {
    const remediationFamilyIds = new Set<string>();
    for (const [index, entry] of lesson.remediationEligibility.entries()) {
      if (remediationFamilyIds.has(entry.assertionFamilyId)) {
        ctx.addIssue({
          code: "custom",
          path: ["remediationEligibility", index, "assertionFamilyId"],
          message: `duplicate remediationEligibility entry for assertion family '${entry.assertionFamilyId}' within lesson '${lesson.id}'`,
        });
      }
      remediationFamilyIds.add(entry.assertionFamilyId);
    }

    const stepIds = new Set<string>();
    for (const [index, step] of lesson.steps.entries()) {
      if (stepIds.has(step.id)) {
        ctx.addIssue({ code: "custom", path: ["steps", index, "id"], message: `duplicate step id '${step.id}' within lesson '${lesson.id}'` });
      }
      stepIds.add(step.id);
    }

    // masteryGateCapabilityId placement (CC-06D §10.3): required exactly
    // where conditional skip-if-mastered semantics consume it (non-retrieval
    // conditional_skip_if_mastered steps -- retrieval_check steps are gated
    // by retrieval dueness, not capability mastery), prohibited everywhere
    // it has no semantic purpose, and never inferred from array order.
    for (const [index, step] of lesson.steps.entries()) {
      const requiresMasteryGate = step.requirement === "conditional_skip_if_mastered" && step.type !== "retrieval_check";
      if (requiresMasteryGate && !step.masteryGateCapabilityId) {
        ctx.addIssue({
          code: "custom",
          path: ["steps", index, "masteryGateCapabilityId"],
          message: `step '${step.id}' is conditional_skip_if_mastered but declares no masteryGateCapabilityId -- the skip-controlling capability must be explicit, never inferred from array order`,
        });
      }
      if (!requiresMasteryGate && step.masteryGateCapabilityId) {
        ctx.addIssue({
          code: "custom",
          path: ["steps", index, "masteryGateCapabilityId"],
          message: `step '${step.id}' declares masteryGateCapabilityId but is not a conditional_skip_if_mastered step -- the field has no semantic purpose here`,
        });
      }
    }

    for (const [index, step] of lesson.steps.entries()) {
      for (const [routeIndex, route] of step.branchRoutes.entries()) {
        if (!stepIds.has(route.destinationStepId)) {
          ctx.addIssue({
            code: "custom",
            path: ["steps", index, "branchRoutes", routeIndex, "destinationStepId"],
            message: `branch route in step '${step.id}' targets unknown step id '${route.destinationStepId}'`,
          });
        }
        if (route.destinationStepId === step.id) {
          ctx.addIssue({
            code: "custom",
            path: ["steps", index, "branchRoutes", routeIndex, "destinationStepId"],
            message: `branch route in step '${step.id}' targets itself`,
          });
        }
        if (route.trigger === "misconception_detected" && !route.misconceptionIdentifier) {
          ctx.addIssue({
            code: "custom",
            path: ["steps", index, "branchRoutes", routeIndex, "misconceptionIdentifier"],
            message: `branch route in step '${step.id}' has trigger 'misconception_detected' but no misconceptionIdentifier`,
          });
        }
      }
    }

    for (const [index, requiredId] of lesson.completionCriteria.requiredStepIds.entries()) {
      if (!stepIds.has(requiredId)) {
        ctx.addIssue({
          code: "custom",
          path: ["completionCriteria", "requiredStepIds", index],
          message: `completionCriteria references unknown step id '${requiredId}'`,
        });
      }
    }
  });
export type LessonPlan = z.infer<typeof lessonPlanSchema>;

// ---------------------------------------------------------------------
// Manifest -- a governed collection of canonical lesson plans.
// ---------------------------------------------------------------------

export const lessonPlanManifestSchema = z.object({
  lessons: z.array(lessonPlanSchema),
}).superRefine((manifest, ctx) => {
  const seen = new Set<string>();
  for (const [index, lesson] of manifest.lessons.entries()) {
    const key = `${lesson.id}@${lesson.version}`;
    if (seen.has(key)) {
      ctx.addIssue({ code: "custom", path: ["lessons", index, "id"], message: `duplicate lesson id/version '${key}'` });
    }
    seen.add(key);
  }
});
export type LessonPlanManifest = z.infer<typeof lessonPlanManifestSchema>;
