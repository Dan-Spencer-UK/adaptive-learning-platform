/**
 * ADR-0006 / CC-13A: deterministic V1 Guided Revision -- weakness
 * aggregation over one `SubmittedAssessmentResult` (./assessment-
 * instance.ts) into a ranked `GuidedRevisionPlan` of full canonical
 * lessons. "Deterministic" is not a description, it is a structural
 * property this module enforces: `buildGuidedRevisionPlan` is a pure
 * function (no clock/RNG/network/persistence reads other than its
 * explicit `options`), and `guidedRevisionPlanSchema`'s `superRefine`
 * independently re-verifies the ordering/deduplication invariants a
 * caller might otherwise construct by hand, exactly as
 * @alp/learning-engine's assembler/branching modules never trust their
 * own callers either.
 *
 * Design authority: docs/architecture/LEARNING-PACKAGE-GOVERNANCE-
 * CONTRACTS.md §11, docs/architecture/V1-LEARNING-ASSESSMENT-AND-GUIDED-
 * REVISION-ARCHITECTURE.md.
 *
 * Scope discipline: this module ranks lessons a SUBMITTED assessment
 * exposed as weak. It does not select/sequence/generate questions
 * (./pedagogy.ts), does not decide assessment structure (./assessment-
 * specification.ts), does not track attempt lifecycle (./assessment-
 * instance.ts), and does not persist a plan or expose it to a learner --
 * storage/UI remain later packages, per the CC-13A brief's "minimum
 * schema/tooling foundation" scope.
 */

import { z } from "zod";
import type { SubmittedAssessmentResult } from "./assessment-instance.ts";

const stableId = z.string().min(1);
const isoTimestamp = z.string().datetime();

export const priorityBandSchema = z.enum(["HIGH", "MEDIUM", "LOW"]);
export type PriorityBand = z.infer<typeof priorityBandSchema>;

export const lessonWeaknessResultSchema = z.object({
  lessonId: stableId,
  contributingCapabilityIds: z.array(stableId).min(1),
  contributingQuestionInstanceIds: z.array(stableId).min(1),
  priorityScore: z.number(),
  explanation: z.string().min(1),
});
export type LessonWeaknessResult = z.infer<typeof lessonWeaknessResultSchema>;

export const guidedRevisionPlanItemSchema = z.object({
  rank: z.number().int().positive(),
  lessonId: stableId,
  priorityBand: priorityBandSchema,
  reason: z.string().min(1),
  contributingCapabilityIds: z.array(stableId).min(1),
});
export type GuidedRevisionPlanItem = z.infer<typeof guidedRevisionPlanItemSchema>;

/**
 * Structural re-verification of the LEARNING-PACKAGE-GOVERNANCE-
 * CONTRACTS.md §11 rules that are expressible without the live lesson
 * corpus: ranks form a contiguous 1..n sequence in array order (so
 * "array order" and "rank order" can never silently disagree), and no
 * lesson id appears twice (deduplication). "Every item resolves to a
 * production canonical lesson" needs the real corpus and is re-verified
 * by scripts/content/validate-v1-learning-package.ts instead -- this
 * schema stays corpus-independent, exactly as ./lesson-plan.ts does.
 */
export const guidedRevisionPlanSchema = z
  .object({
    planId: stableId,
    scopeId: stableId,
    sourceAssessmentInstanceId: stableId,
    sourceAssessmentSubmittedAt: isoTimestamp,
    generatedAt: isoTimestamp,
    policyVersion: stableId,
    items: z.array(guidedRevisionPlanItemSchema),
  })
  .superRefine((plan, ctx) => {
    const seenLessons = new Set<string>();
    for (const [index, item] of plan.items.entries()) {
      if (seenLessons.has(item.lessonId)) {
        ctx.addIssue({
          code: "custom",
          path: ["items", index, "lessonId"],
          message: `Guided Revision plan '${plan.planId}' has more than one item for lesson '${item.lessonId}' -- duplicate lesson mappings must collapse into one item`,
        });
      }
      seenLessons.add(item.lessonId);

      if (item.rank !== index + 1) {
        ctx.addIssue({
          code: "custom",
          path: ["items", index, "rank"],
          message: `Guided Revision plan '${plan.planId}' item at position ${index} declares rank ${item.rank}, expected ${index + 1} -- rank must be a contiguous 1..n sequence matching array order, so ranking is unambiguous and deterministic`,
        });
      }
    }
  });
export type GuidedRevisionPlan = z.infer<typeof guidedRevisionPlanSchema>;

/** GOVERNANCE-CONTRACTS.md §11's rank-banding rule: split into thirds by rank position, deterministic, no free parameters beyond the item count. */
function computePriorityBand(rank: number, total: number): PriorityBand {
  const highCutoff = Math.ceil(total / 3);
  const mediumCutoff = Math.ceil((2 * total) / 3);
  if (rank <= highCutoff) return "HIGH";
  if (rank <= mediumCutoff) return "MEDIUM";
  return "LOW";
}

export interface GuidedRevisionPolicyOptions {
  readonly planId: string;
  readonly generatedAt: string;
  readonly policyVersion: string;
}

/**
 * Deterministic weakness aggregation + ranking. Same `SubmittedAssessmentResult`
 * + same `options` always produces the same `GuidedRevisionPlan` (no
 * clock/RNG read internally -- `generatedAt` is supplied by the caller,
 * exactly as @alp/learning-engine's assembler takes its policy version as
 * an explicit input rather than a module-level "now").
 *
 * Only INCORRECT items contribute weakness -- a correct answer never adds
 * priority to a lesson, matching ADR-0006's framing ("ranking the full
 * lessons needed to address the weaknesses exposed"). An item with no
 * `revisionLessonIds` contributes nothing (an upstream authoring gap the
 * question-governance contract on ./pedagogy.ts's `questionBlueprintManifestSchema`
 * already flags for FORMATIVE_MOCK items -- this function does not paper
 * over that, it simply has nothing to rank for that item).
 */
export function buildGuidedRevisionPlan(result: SubmittedAssessmentResult, options: GuidedRevisionPolicyOptions): GuidedRevisionPlan {
  const byLesson = new Map<string, { capabilityIds: Set<string>; questionInstanceIds: Set<string>; weight: number }>();

  for (const item of result.itemResults) {
    if (item.correct) continue;
    for (const lessonId of item.revisionLessonIds) {
      const entry = byLesson.get(lessonId) ?? { capabilityIds: new Set<string>(), questionInstanceIds: new Set<string>(), weight: 0 };
      for (const capabilityId of item.capabilityIds) entry.capabilityIds.add(capabilityId);
      entry.questionInstanceIds.add(item.questionInstanceId);
      entry.weight += item.evidenceWeight ?? 1;
      byLesson.set(lessonId, entry);
    }
  }

  const weaknesses: LessonWeaknessResult[] = [...byLesson.entries()]
    .map(([lessonId, entry]) => ({
      lessonId,
      contributingCapabilityIds: [...entry.capabilityIds].sort(),
      contributingQuestionInstanceIds: [...entry.questionInstanceIds].sort(),
      priorityScore: entry.weight,
      explanation: `${entry.questionInstanceIds.size} incorrect item(s) in the submitted assessment mapped to ${entry.capabilityIds.size} capability(ies) taught by this lesson.`,
    }))
    // Deterministic total order: highest weakness first; ties broken by
    // lessonId so two runs over the same input can never disagree, and so
    // rank never depends on JS Map/object iteration incidentals.
    .sort((a, b) => b.priorityScore - a.priorityScore || a.lessonId.localeCompare(b.lessonId));

  const items: GuidedRevisionPlanItem[] = weaknesses.map((weakness, index) => ({
    rank: index + 1,
    lessonId: weakness.lessonId,
    priorityBand: computePriorityBand(index + 1, weaknesses.length),
    reason: weakness.explanation,
    contributingCapabilityIds: weakness.contributingCapabilityIds,
  }));

  return guidedRevisionPlanSchema.parse({
    planId: options.planId,
    scopeId: result.scopeId,
    sourceAssessmentInstanceId: result.assessmentInstanceId,
    sourceAssessmentSubmittedAt: result.submittedAt,
    generatedAt: options.generatedAt,
    policyVersion: options.policyVersion,
    items,
  });
}

/**
 * "The plan is based on the most recently submitted assessment in that
 * scope" (GOVERNANCE-CONTRACTS.md §11). Pure selection over already-
 * submitted results -- callers that hold `FormativeAssessmentInstance`s
 * in other states must construct `SubmittedAssessmentResult`s via
 * `buildSubmittedAssessmentResult` (./assessment-instance.ts) first,
 * which itself refuses non-SUBMITTED instances.
 */
export function selectLatestSubmittedResultInScope(
  results: readonly SubmittedAssessmentResult[],
  scopeId: string,
): SubmittedAssessmentResult | undefined {
  const inScope = results.filter((result) => result.scopeId === scopeId);
  if (inScope.length === 0) return undefined;
  return inScope.reduce((latest, current) => (new Date(current.submittedAt).getTime() > new Date(latest.submittedAt).getTime() ? current : latest));
}
