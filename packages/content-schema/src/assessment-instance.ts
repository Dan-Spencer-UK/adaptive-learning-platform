/**
 * ADR-0006 / CC-13A: the V1 formative/mock assessment ATTEMPT-STATE
 * contract -- deliberately separate from ./assessment-specification.ts
 * (CC-09A's official awarding-body test STRUCTURE: duration, question
 * count, per-Learning-Outcome allocation) and from `QuestionBlueprint`/
 * `GeneratedQuestionInstance` (./pedagogy.ts: what a question IS). This
 * module governs the runtime LIFECYCLE of one learner's attempt at a
 * formative/mock assessment instance, and the immutable result object
 * that attempt produces once (and only once) it is explicitly submitted.
 *
 * This is the mechanical foundation for ADR-0006's central V1 invariant:
 * "Incomplete, abandoned, suspended or merely started assessments do not
 * update the [Guided Revision] plan." The type system enforces the
 * submission boundary rather than relying on call-site discipline --
 * ./guided-revision.ts's plan builder accepts only a
 * `SubmittedAssessmentResult`, which can only be constructed from a
 * `FormativeAssessmentInstance` whose `status === "SUBMITTED"` (see the
 * `superRefine` invariants below); there is no code path that lets an
 * `IN_PROGRESS`/`SUSPENDED`/`COMPLETED_AWAITING_SUBMISSION` instance
 * reach the plan builder's input type.
 *
 * Design authority: docs/architecture/LEARNING-PACKAGE-GOVERNANCE-
 * CONTRACTS.md §9-§10.
 */

import { z } from "zod";

const stableId = z.string().min(1);
const isoTimestamp = z.string().datetime();

export const assessmentAttemptStatusSchema = z.enum([
  "NOT_STARTED",
  "IN_PROGRESS",
  "SUSPENDED",
  "COMPLETED_AWAITING_SUBMISSION",
  "SUBMITTED",
]);
export type AssessmentAttemptStatus = z.infer<typeof assessmentAttemptStatusSchema>;

/**
 * Submission invariant (LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md §9):
 * `submittedAt` may exist only when `status === "SUBMITTED"`, and
 * `SUBMITTED` requires both `completedAt` (mandatory completion criteria
 * satisfied) and `submittedAt`, in that chronological order.
 * `IN_PROGRESS`/`SUSPENDED`/`COMPLETED_AWAITING_SUBMISSION` are structurally
 * prevented from carrying a `submittedAt` at all.
 */
export const formativeAssessmentInstanceSchema = z
  .object({
    assessmentInstanceId: stableId,
    assessmentDefinitionId: stableId,
    /** e.g. a unit or qualification id -- the scope a Guided Revision plan is keyed against (./guided-revision.ts). */
    scopeId: stableId,
    contentReleaseId: stableId,
    questionInstanceIds: z.array(stableId).min(1),
    status: assessmentAttemptStatusSchema,
    startedAt: isoTimestamp.optional(),
    completedAt: isoTimestamp.optional(),
    submittedAt: isoTimestamp.optional(),
  })
  .superRefine((instance, ctx) => {
    if (instance.submittedAt && instance.status !== "SUBMITTED") {
      ctx.addIssue({
        code: "custom",
        path: ["submittedAt"],
        message: `assessment instance ${instance.assessmentInstanceId} declares submittedAt but status is '${instance.status}', not SUBMITTED -- submission is a hard state boundary, never inferred from a timestamp alone`,
      });
    }
    if (instance.status === "SUBMITTED" && !instance.submittedAt) {
      ctx.addIssue({
        code: "custom",
        path: ["submittedAt"],
        message: `assessment instance ${instance.assessmentInstanceId} has status SUBMITTED but no submittedAt`,
      });
    }
    if (instance.status === "SUBMITTED" && !instance.completedAt) {
      ctx.addIssue({
        code: "custom",
        path: ["completedAt"],
        message: `assessment instance ${instance.assessmentInstanceId} has status SUBMITTED but no completedAt -- submittedAt may exist only once mandatory completion criteria are satisfied`,
      });
    }
    if (instance.completedAt && !(instance.status === "COMPLETED_AWAITING_SUBMISSION" || instance.status === "SUBMITTED")) {
      ctx.addIssue({
        code: "custom",
        path: ["completedAt"],
        message: `assessment instance ${instance.assessmentInstanceId} declares completedAt but status is '${instance.status}'`,
      });
    }
    if (instance.submittedAt && instance.completedAt && new Date(instance.submittedAt).getTime() < new Date(instance.completedAt).getTime()) {
      ctx.addIssue({
        code: "custom",
        path: ["submittedAt"],
        message: `assessment instance ${instance.assessmentInstanceId} has submittedAt before completedAt -- submission cannot precede completion`,
      });
    }
  });
export type FormativeAssessmentInstance = z.infer<typeof formativeAssessmentInstanceSchema>;

/** The states ADR-0006 requires to be "side-effect free with respect to current Guided Revision". */
export const GUIDED_REVISION_SIDE_EFFECT_FREE_STATUSES: ReadonlySet<AssessmentAttemptStatus> = new Set([
  "NOT_STARTED",
  "IN_PROGRESS",
  "SUSPENDED",
  "COMPLETED_AWAITING_SUBMISSION",
]);

// ---------------------------------------------------------------------
// Submitted assessment result (LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md §10)
// ---------------------------------------------------------------------

export const submittedAssessmentItemResultSchema = z.object({
  questionInstanceId: stableId,
  capabilityIds: z.array(stableId).min(1),
  /** Canonical lesson ids this item's failure should contribute to in Guided Revision. May be empty for a genuinely un-mapped legacy item (a currency-audit finding upstream, not something this object can repair). */
  revisionLessonIds: z.array(stableId).default([]),
  correct: z.boolean(),
  evidenceWeight: z.number().min(0).optional(),
});
export type SubmittedAssessmentItemResult = z.infer<typeof submittedAssessmentItemResultSchema>;

/**
 * The V1 trigger input to weakness analysis / Guided Revision
 * (LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md §10). Deliberately has no
 * `status` field at all -- unlike `FormativeAssessmentInstance`, its mere
 * existence as this TYPE already means "submitted"; there is no
 * in-progress variant of this object. Construct one only from a
 * `FormativeAssessmentInstance` whose `status === "SUBMITTED"` (see
 * `buildSubmittedAssessmentResult` below).
 */
export const submittedAssessmentResultSchema = z.object({
  assessmentInstanceId: stableId,
  scopeId: stableId,
  submittedAt: isoTimestamp,
  itemResults: z.array(submittedAssessmentItemResultSchema).min(1),
});
export type SubmittedAssessmentResult = z.infer<typeof submittedAssessmentResultSchema>;

/**
 * The ONLY sanctioned way to produce a `SubmittedAssessmentResult`: it
 * throws, rather than silently coercing, if handed an instance that is
 * not actually `SUBMITTED` -- callers cannot accidentally launder an
 * in-progress attempt into Guided Revision's trigger type by constructing
 * the result object literal directly (nothing stops that at the type
 * level in TypeScript, so this function exists to be the one call site
 * that matters and to fail loudly if misused).
 */
export function buildSubmittedAssessmentResult(
  instance: FormativeAssessmentInstance,
  itemResults: readonly SubmittedAssessmentItemResult[],
): SubmittedAssessmentResult {
  if (instance.status !== "SUBMITTED" || !instance.submittedAt) {
    throw new Error(
      `Cannot build a SubmittedAssessmentResult from assessment instance '${instance.assessmentInstanceId}': status is '${instance.status}', not SUBMITTED. Incomplete/unsubmitted assessments must never produce a Guided Revision trigger (ADR-0006).`,
    );
  }
  return submittedAssessmentResultSchema.parse({
    assessmentInstanceId: instance.assessmentInstanceId,
    scopeId: instance.scopeId,
    submittedAt: instance.submittedAt,
    itemResults,
  });
}
