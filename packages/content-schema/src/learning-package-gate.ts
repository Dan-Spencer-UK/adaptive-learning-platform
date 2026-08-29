/**
 * ADR-0005 / CC-13A: the governed result shape every learning-package
 * publication gate reports through -- curriculum, pedagogy, assessment
 * integrity, visual, learner-presentation, runtime, formative-assessment
 * and Guided-Revision gates (docs/governance/LEARNING-PACKAGE-QUALITY-
 * GATES.md) all produce this same object, so a publication decision is
 * "every mandatory applicable gate result is PASS/WAIVED", never a
 * bespoke per-gate ad hoc check.
 *
 * This module does not implement any gate itself -- see
 * scripts/content/validate-v1-learning-package.ts for the deterministic,
 * mechanical gates this package adds, and the existing
 * scripts/content/validate-lesson-plan.ts / validate-pedagogy.ts for the
 * pre-existing corpus-integrity gates this reset does not replace.
 * Subjective gates (Product Owner premium-quality review, etc.) are
 * represented by the SAME result shape with a human-entered status --
 * this package does not pretend to automate those (CC-13A brief).
 *
 * Design authority: docs/architecture/LEARNING-PACKAGE-GOVERNANCE-
 * CONTRACTS.md §12.
 */

import { z } from "zod";

const stableId = z.string().min(1);
const isoTimestamp = z.string().datetime();

export const gateNameSchema = z.enum([
  "CURRICULUM",
  "PEDAGOGY",
  "ASSESSMENT_INTEGRITY",
  "VISUAL",
  "LEARNER_PRESENTATION",
  "RUNTIME",
  "FORMATIVE_ASSESSMENT",
  "GUIDED_REVISION",
  "PRODUCT_OWNER",
]);
export type GateName = z.infer<typeof gateNameSchema>;

export const gateStatusSchema = z.enum(["PASS", "FAIL", "WAIVED", "NOT_RUN"]);
export type GateStatus = z.infer<typeof gateStatusSchema>;

export const gateWaiverSchema = z.object({
  reason: z.string().min(1),
  owner: z.string().min(1),
  expiresAt: isoTimestamp.optional(),
});
export type GateWaiver = z.infer<typeof gateWaiverSchema>;

export const learningPackageGateResultSchema = z
  .object({
    scopeId: stableId,
    lessonId: stableId.optional(),
    gate: gateNameSchema,
    status: gateStatusSchema,
    checkedAt: isoTimestamp,
    evidenceRefs: z.array(z.string().min(1)).default([]),
    failures: z.array(z.string().min(1)).default([]),
    waiver: gateWaiverSchema.optional(),
  })
  .superRefine((result, ctx) => {
    if (result.status === "WAIVED" && !result.waiver) {
      ctx.addIssue({
        code: "custom",
        path: ["waiver"],
        message: `gate result for '${result.gate}' (scope '${result.scopeId}') is WAIVED but declares no waiver -- a waiver must record who owns the risk and why, never a silent bypass`,
      });
    }
    if (result.status === "FAIL" && result.failures.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["failures"],
        message: `gate result for '${result.gate}' (scope '${result.scopeId}') is FAIL but lists no failures -- a failing gate must explain what failed`,
      });
    }
    if (result.status === "PASS" && result.failures.length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["failures"],
        message: `gate result for '${result.gate}' (scope '${result.scopeId}') is PASS but lists failures -- a passing gate cannot carry unresolved failures`,
      });
    }
  });
export type LearningPackageGateResult = z.infer<typeof learningPackageGateResultSchema>;

/**
 * "Released lesson/package without all mandatory applicable gate results
 * = failure" (GOVERNANCE-CONTRACTS.md §14). `mandatoryGates` lets a caller
 * scope which gates are mandatory for a given publication decision (e.g.
 * a lesson-level publication check does not need a GUIDED_REVISION
 * result; a Guided-Revision-plan publication check does not need VISUAL).
 * PASS and WAIVED both satisfy a mandatory gate; FAIL and NOT_RUN do not.
 */
export function isPublicationReady(results: readonly LearningPackageGateResult[], mandatoryGates: readonly GateName[]): boolean {
  return mandatoryGates.every((gate) => results.some((result) => result.gate === gate && (result.status === "PASS" || result.status === "WAIVED")));
}
