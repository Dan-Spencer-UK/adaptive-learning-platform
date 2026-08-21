/**
 * CC-09A: governed Assessment Specification -- the official test structure
 * an awarding body publishes for a unit's mandatory assessment (duration,
 * question count, permitted materials, pass threshold, per-Learning-
 * Outcome question/percentage allocation), as first-class governed data
 * rather than a fact buried in a doc comment or hand-copied into a test
 * fixture.
 *
 * Scope discipline (approved architecture decision, see PROJECT-STATUS
 * CC-09A): this is official test STRUCTURE, never mock-exam runtime
 * behaviour. It answers "what does the awarding body's own test look
 * like" so a coverage report can compare governed content against it and
 * so a future deterministic mock-paper assembler (`AssessmentBlueprint`,
 * explicitly deferred -- YES LATER, not built here) has something real to
 * consume. It does not select, sequence or generate any question --
 * `QuestionBlueprint` / `GeneratedQuestionInstance` (./pedagogy.ts) own
 * that entirely.
 *
 * `outcomeAllocations[].learningOutcomeNodeKey` is a plain stableId
 * reference into a `curriculumNode` (LEARNING_OUTCOME) defined in a
 * knowledge-graph manifest -- this module stays corpus-independent,
 * exactly as ./lesson-plan.ts and ./content-release.ts do; cross-manifest
 * existence is verified by the content-authoring script that imports both
 * manifests (the established "schema validates internal shape, a script
 * recomputes cross-reference integrity against the live corpus" split).
 */

import { z } from "zod";

const stableId = z.string().min(1);

export const assessmentMethodSchema = z.enum([
  "ONLINE_MULTIPLE_CHOICE_TEST",
  "PRACTICAL_ASSIGNMENT",
  "WRITTEN_SHORT_ANSWER",
]);
export type AssessmentMethod = z.infer<typeof assessmentMethodSchema>;

export const permittedMaterialsSchema = z.object({
  closedBook: z.boolean(),
  calculator: z.enum(["none", "non_programmable", "any"]),
});
export type PermittedMaterials = z.infer<typeof permittedMaterialsSchema>;

export const assessmentOutcomeAllocationSchema = z.object({
  /** Stable key of the LEARNING_OUTCOME curriculum node this allocation covers. */
  learningOutcomeNodeKey: stableId,
  /** The official learning-outcome number as published (e.g. 1..6) -- kept alongside the node key for human-readable reporting, never used as the join key. */
  outcomeNumber: z.number().int().positive(),
  questionCount: z.number().int().nonnegative(),
  questionPercentage: z.number().nonnegative(),
});
export type AssessmentOutcomeAllocation = z.infer<typeof assessmentOutcomeAllocationSchema>;

export const assessmentSpecificationSchema = z
  .object({
    id: stableId,
    schemaVersion: z.literal(1),
    /** Stable key of the curriculum version this specification's outcome allocations are keyed against. */
    curriculumVersionKey: stableId,
    /** Awarding-body qualification code (e.g. "2365-02"). */
    qualificationCode: stableId,
    /** Awarding-body unit number as published (e.g. "202"). */
    unitNumber: stableId,
    unitTitle: z.string().min(1),
    /** The awarding body's own assessment/test component number (e.g. 602) -- distinct from the unit number. */
    assessmentNumber: stableId,
    method: assessmentMethodSchema,
    durationMinutes: z.number().positive(),
    totalQuestionCount: z.number().int().positive(),
    permittedMaterials: permittedMaterialsSchema,
    /** The published approximate pass grade boundary, e.g. 50 for "approximately 50%". Optional: not every assessment publishes one. */
    approximatePassPercentage: z.number().min(0).max(100).optional(),
    outcomeAllocations: z.array(assessmentOutcomeAllocationSchema).min(1),
    /** Provenance: the governed source-version key this specification was transcribed from (./knowledge-graph.ts sourceVersion), never a bare URL string. */
    sourceVersionKey: stableId,
  })
  .superRefine((spec, ctx) => {
    const seenOutcomes = new Set<number>();
    let questionTotal = 0;
    for (const [index, allocation] of spec.outcomeAllocations.entries()) {
      if (seenOutcomes.has(allocation.outcomeNumber)) {
        ctx.addIssue({
          code: "custom",
          path: ["outcomeAllocations", index, "outcomeNumber"],
          message: `duplicate outcome allocation for outcome number ${allocation.outcomeNumber} in assessment specification '${spec.id}'`,
        });
      }
      seenOutcomes.add(allocation.outcomeNumber);
      questionTotal += allocation.questionCount;
    }
    if (questionTotal !== spec.totalQuestionCount) {
      ctx.addIssue({
        code: "custom",
        path: ["outcomeAllocations"],
        message: `outcome allocation question counts sum to ${questionTotal}, but totalQuestionCount is ${spec.totalQuestionCount} for assessment specification '${spec.id}'`,
      });
    }
  });
export type AssessmentSpecification = z.infer<typeof assessmentSpecificationSchema>;

export const assessmentSpecificationManifestSchema = z.object({
  specifications: z.array(assessmentSpecificationSchema),
});
export type AssessmentSpecificationManifest = z.infer<typeof assessmentSpecificationManifestSchema>;
