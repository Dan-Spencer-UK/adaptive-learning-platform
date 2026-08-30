/**
 * CC-14: structured manifest schema for a course-specific "Depth &
 * Performance Matrix" -- the governed artefact required by
 * docs/architecture/SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md
 * §4.3. For each official Assessment Criterion (and, where the handbook's
 * own Range applies, each individual Range item), the matrix records what
 * depth of understanding/performance a learner must reach, why, what
 * supporting knowledge that implies, and what remains uncertain -- sitting
 * conceptually between curriculum authority ("this AC/Range item is in
 * scope") and technical knowledge sourcing ("what authoritative external
 * reference supports the required knowledge").
 *
 * This schema is deliberately generic (§3.7 of the architecture doc): a
 * future C&G course, or a future non-C&G course, reuses this exact shape.
 * The real Unit 202 instance lives in
 * scripts/content/data/unit202-depth-performance-matrix.ts.
 *
 * AUTHORITY BOUNDARY: substantive depth/performance judgments encoded
 * through this schema are never authored by Claude Code -- see
 * docs/governance/ROLES-AND-AUTHORITY.md, "C&G depth-inference and the
 * Unit 202 Depth & Performance Matrix are Product Owner / Project
 * Architect decisions". This module only describes the SHAPE an approved
 * matrix must have; it carries no domain content of its own.
 *
 * `requiredDepthDimensions` is deliberately free text, not a closed enum:
 * §3.6 of the governing architecture doc explicitly states depth dimension
 * names are not yet fixed by that document, and this schema must not
 * invent a closed vocabulary the architecture itself declined to fix.
 */

import { z } from "zod";

export const depthMatrixConfidenceSchema = z.enum(["HIGH", "MEDIUM_HIGH"]);
export type DepthMatrixConfidence = z.infer<typeof depthMatrixConfidenceSchema>;

export const depthMatrixStatusSchema = z.enum([
  "LOCKED",
  "LOCKED_WITH_CORRECTION",
  "LOCKED_WITH_SCOPE_GUARD",
  "LOCKED_WITH_SOURCE_CHECK",
  "LOCKED_WITH_CURRENCY_REVIEW",
  "LOCKED_WITH_AMBIGUITY",
]);
export type DepthMatrixStatus = z.infer<typeof depthMatrixStatusSchema>;

/** One official Range item's depth treatment, at the exact granularity of the approved matrix's "Exact official Range coverage" table. */
export const depthMatrixRangeItemTreatmentSchema = z.object({
  loNumber: z.number().int().min(1),
  acNumber: z.string().min(1),
  rangeCategory: z.string().min(1),
  rangeItem: z.string().min(1),
  depthTreatment: z.string().min(1),
  /** Present only where the approved matrix flags this specific Range item for review/correction/ambiguity -- never silently resolved. */
  reviewFlag: z.string().min(1).optional(),
});
export type DepthMatrixRangeItemTreatment = z.infer<typeof depthMatrixRangeItemTreatmentSchema>;

/** One Assessment Criterion's full depth/performance treatment. */
export const depthMatrixCriterionSchema = z.object({
  acNumber: z.string().regex(/^[0-9]+\.[0-9]+$/, 'acNumber must look like "1.1"'),
  loNumber: z.number().int().min(1),
  title: z.string().min(1),
  /** Short prose Range summary as given directly under the AC heading -- only present where the source document has one; the granular per-item table lives in officialRangeCoverage. */
  officialRangeSummary: z.string().min(1).optional(),
  requiredLearnerPerformance: z.string().min(1),
  requiredDepthDimensions: z.array(z.string().min(1)).min(1),
  requiredSupportingKnowledge: z.string().min(1),
  visualRepresentationRequirement: z.string().min(1),
  calculationProcedureRequirement: z.string().min(1),
  cgTeachingWorksheetCalibration: z.string().min(1),
  publicSampleAssessmentCalibration: z.string().min(1),
  scopeCeiling: z.string().min(1),
  confidence: depthMatrixConfidenceSchema,
  matrixStatus: depthMatrixStatusSchema,
  /** Present only where the approved matrix carries an explicit AC-level review/correction/ambiguity flag -- never silently resolved (§8 of the encoding task brief). */
  reviewFlag: z.string().min(1).optional(),
});
export type DepthMatrixCriterion = z.infer<typeof depthMatrixCriterionSchema>;

export const depthMatrixEvidenceTierSchema = z.object({
  rank: z.number().int().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
});
export type DepthMatrixEvidenceTier = z.infer<typeof depthMatrixEvidenceTierSchema>;

export const depthMatrixAssessmentEnvelopeRowSchema = z.object({
  loNumber: z.number().int().min(1),
  approxQuestionCount: z.number().int().min(0),
  weightPercent: z.number().min(0),
});
export type DepthMatrixAssessmentEnvelopeRow = z.infer<typeof depthMatrixAssessmentEnvelopeRowSchema>;

export const depthMatrixSourceReferenceSchema = z.object({
  title: z.string().min(1),
  url: z.string().min(1).optional(),
});
export type DepthMatrixSourceReference = z.infer<typeof depthMatrixSourceReferenceSchema>;

/**
 * Document-level authorship/approval provenance. `documentHeaderStatusAsAuthored`
 * preserves the source document's own literal header status verbatim
 * (historical fact about the artefact as authored) even after
 * `approvalStatus` records a later approval event -- the encoding step
 * must never silently rewrite the source document's own words.
 */
export const depthMatrixAuthoritySchema = z
  .object({
    substantiveAuthor: z.string().min(1),
    implementerRoleNote: z.string().min(1),
    approvalStatus: z.enum(["PROPOSED", "APPROVED"]),
    approvedBy: z.string().min(1).optional(),
    approvedDate: z.string().min(1).optional(),
    documentHeaderStatusAsAuthored: z.string().min(1),
  })
  .superRefine((val, ctx) => {
    if (val.approvalStatus === "APPROVED" && !val.approvedBy) {
      ctx.addIssue({ code: "custom", message: "approvedBy is required once approvalStatus is APPROVED" });
    }
  });
export type DepthMatrixAuthority = z.infer<typeof depthMatrixAuthoritySchema>;

export const depthPerformanceMatrixSchema = z
  .object({
    qualificationCode: z.string().min(1),
    qualificationTitle: z.string().min(1),
    unitNumber: z.string().min(1),
    unitTitle: z.string().min(1),
    governingDepthDecision: z.string().min(1),
    evidenceHierarchy: z.array(depthMatrixEvidenceTierSchema).min(1),
    assessmentEnvelope: z.array(depthMatrixAssessmentEnvelopeRowSchema).min(1),
    assessmentConditions: z.object({
      durationMinutes: z.number().int().min(1),
      closedBook: z.boolean(),
      calculator: z.string().min(1),
      totalQuestionCount: z.number().int().min(1),
      approxPassPercentage: z.number().min(0).max(100),
      handbookVersion: z.string().min(1),
    }),
    assessmentCriteria: z.array(depthMatrixCriterionSchema).min(1),
    officialRangeCoverage: z.array(depthMatrixRangeItemTreatmentSchema),
    sourceReferences: z.array(depthMatrixSourceReferenceSchema).min(1),
    reusableKnowledgePrinciple: z.string().min(1),
    nextProductionGate: z.string().min(1),
    authorship: depthMatrixAuthoritySchema,
  })
  .superRefine((matrix, ctx) => {
    // Only genuine referential integrity (a Range item pointing at an AC
    // that does not exist at all) is enforced at the schema layer, mirroring
    // knowledge-graph.ts's FK-style dangling-reference checks. Uniqueness
    // and exact-instance-shape checks (no duplicate AC/Range item, exact
    // 23/58 counts, review-flag preservation) deliberately live in
    // scripts/content/validate-unit202-depth-performance-matrix.ts's report
    // instead, so a tamper-and-assert test can inspect the resulting report
    // fields directly rather than only catching a thrown error -- the same
    // split scripts/content/report-coverage-matrix.ts already uses between
    // schema-level structural validity and script-level semantic checks.
    const acNumbers = new Set(matrix.assessmentCriteria.map((ac) => ac.acNumber));
    for (const [i, row] of matrix.officialRangeCoverage.entries()) {
      if (!acNumbers.has(row.acNumber)) {
        ctx.addIssue({
          code: "custom",
          path: ["officialRangeCoverage", i, "acNumber"],
          message: `range item references unknown acNumber ${row.acNumber}`,
        });
      }
    }
  });
export type DepthPerformanceMatrix = z.infer<typeof depthPerformanceMatrixSchema>;
