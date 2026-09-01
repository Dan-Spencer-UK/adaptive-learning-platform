/**
 * CC-17: structured ledger schema for a BLIND CALIBRATION BASELINE --
 * a Project-Architect review export answering "if ALP did NOT have
 * access to proprietary course-provider teaching material, what would
 * the transferable course-construction methodology conclude a Unit 202
 * learner needs to know/do?" This is produced BEFORE the Project
 * Architect compares it against the Product Owner's private City &
 * Guilds teaching material, so the baseline itself must be constructed
 * blind to that material (see the BLINDNESS RULE below) -- the
 * comparison is the Project Architect's own later, manual act, never
 * performed by this package.
 *
 * ARCHITECTURAL PRINCIPLE this package exists to demonstrate: the
 * long-term product must be able to construct courses where equivalent
 * private teaching material is unavailable. Proprietary handouts/
 * worksheets/tutor-answers are therefore modelled as an OPTIONAL,
 * external calibration benchmark (tier 5 of the evidence hierarchy
 * below), never a dependency the transferable methodology requires.
 *
 * EVIDENCE HIERARCHY (mirrors the task's own architectural principle):
 *   1. Official specification / Assessment Criteria / official Range
 *      -- curriculum-scope authority.
 *   2. Public sample-assessment material already legitimately governed
 *      -- depth/performance calibration where available.
 *   3. Qualification level, command verb, AC structure, necessary
 *      prerequisite reasoning -- transferable depth constraints.
 *   4. Independently approved authoritative technical sources --
 *      factual truth (never curriculum-scope authority on their own).
 *   5. Proprietary/private course-provider material -- OPTIONAL
 *      calibration benchmark only, recorded (if at all) as an
 *      unverified CLAIM the repository currently makes, never as an
 *      input to tiers 1-4's own conclusions.
 *   6. Existing ALP lessons/assertions/knowledge obligations --
 *      diagnostic legacy evidence only.
 *   7. LLM/model knowledge -- never factual or curriculum authority.
 *
 * BLINDNESS RULE (mechanically enforced, not merely a convention): a
 * `blindBaselineRequirement`/`blindBaselineDepth`/`blindBaselineRationale`
 * field must never be justified by tier 5 or tier 6 evidence. This
 * schema keeps tier-5 evidence in a SEPARATE field
 * (`existingPrivateCalibrationClaim`), structurally labelled as an
 * unverified claim the repository currently makes about private
 * material -- never a field the blind fields may cite. The validator
 * additionally scans blind-field text for private-material vocabulary
 * ("handout", "worksheet", "tutor answer", "SmartScreen", "scheme of
 * work") as a mechanical backstop.
 *
 * AUTHORITY BOUNDARY: like ./qualification-scope-audit.ts, no row here
 * may assert that private course material is correct or incorrect, nor
 * make any final curriculum-scope decision. `matrixComparison` records
 * a factual relationship between the blind baseline and the existing
 * governed matrix, never a verdict about which is right.
 */

import { z } from "zod";

const stableKey = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "calibrationKey must be kebab-case");
const acNumberPattern = /^[0-9]+\.[0-9]+$/;

export const learnerPerformanceTypeSchema = z.enum([
  "DEFINE",
  "DESCRIBE",
  "EXPLAIN",
  "RECOGNISE",
  "IDENTIFY",
  "CALCULATE",
  "APPLY",
  "DISTINGUISH",
  "INTERPRET",
  "DIRECTION_RULE",
  "COMPONENT_ROLE",
  "PHYSICAL_RECOGNITION",
  "OTHER",
]);
export type LearnerPerformanceType = z.infer<typeof learnerPerformanceTypeSchema>;

export const blindConfidenceSchema = z.enum(["HIGH", "MEDIUM", "LOW"]);
export type BlindConfidence = z.infer<typeof blindConfidenceSchema>;

/**
 * The factual relationship between the blind baseline and the existing
 * governed matrix for this proposition -- descriptive, never a verdict
 * about which is correct. MATRIX_ONLY_PROPOSITION and
 * BASELINE_ONLY_PROPOSITION are the two cases worth the Project
 * Architect's closest attention: the former is exactly where private
 * material's influence on the existing matrix is most visible; the
 * latter is where the transferable methodology predicts something the
 * existing matrix does not currently capture.
 */
export const matrixComparisonSchema = z.enum([
  "SAME",
  "MATRIX_BROADER",
  "MATRIX_NARROWER",
  "DIFFERENT_EMPHASIS",
  "MATRIX_ONLY_PROPOSITION",
  "BASELINE_ONLY_PROPOSITION",
]);
export type MatrixComparison = z.infer<typeof matrixComparisonSchema>;

export const calibrationRowSchema = z
  .object({
    calibrationKey: stableKey,
    acNumber: z.string().regex(acNumberPattern, 'acNumber must look like "1.1"'),
    loNumber: z.number().int().min(1),
    rangeItems: z.array(z.string().min(1)).min(1).optional(),
    publicSpecificationAnchor: z.string().min(1),
    publicRangeAnchor: z.string().min(1).optional(),
    publicAssessmentAnchor: z.string().min(1).optional(),
    transferablePrerequisiteJustification: z.string().min(1).optional(),
    learnerPerformanceType: learnerPerformanceTypeSchema,
    blindBaselineRequirement: z.string().min(1),
    blindBaselineDepth: z.string().min(1),
    blindBaselineRationale: z.string().min(1),
    factualSourceRequirementKeys: z.array(z.string().min(1)).optional(),
    blindConfidence: blindConfidenceSchema,
    /** Required whenever blindConfidence is MEDIUM or LOW. */
    blindUncertaintyReason: z.string().min(1).optional(),
    matrixComparison: matrixComparisonSchema,
    matrixComparisonNotes: z.string().min(1),
    /**
     * TIER 5 EVIDENCE ONLY -- an unverified claim the repository
     * currently makes about private/proprietary teaching material
     * (handout/worksheet/tutor-answer). MUST begin with the literal
     * prefix "UNVERIFIED CALIBRATION CLAIM:" so it can never be mistaken
     * for independently verified evidence when this ledger is read in
     * isolation. Never cited by any blind* field.
     */
    existingPrivateCalibrationClaim: z.string().min(1).startsWith("UNVERIFIED CALIBRATION CLAIM:").optional(),
    legacyPropagationKeys: z.array(z.string().min(1)).optional(),
    projectArchitectCalibrationQuestions: z.array(z.string().min(1)).min(1),
  })
  .superRefine((row, ctx) => {
    if (row.blindConfidence !== "HIGH" && !row.blindUncertaintyReason) {
      ctx.addIssue({
        code: "custom",
        path: ["blindUncertaintyReason"],
        message: `calibration row '${row.calibrationKey}' has blindConfidence '${row.blindConfidence}' but no blindUncertaintyReason`,
      });
    }
  });
export type CalibrationRow = z.infer<typeof calibrationRowSchema>;

export const blindCalibrationBaselineSchema = z
  .object({
    baselineTitle: z.string().min(1),
    derivedFromMatrix: z.string().min(1),
    methodologyNote: z.string().min(1),
    rows: z.array(calibrationRowSchema).min(1),
  })
  .superRefine((baseline, ctx) => {
    const seen = new Set<string>();
    baseline.rows.forEach((row, i) => {
      if (seen.has(row.calibrationKey)) {
        ctx.addIssue({
          code: "custom",
          path: ["rows", i, "calibrationKey"],
          message: `duplicate calibrationKey '${row.calibrationKey}' -- every ledger row must be independently identifiable`,
        });
      }
      seen.add(row.calibrationKey);
    });
  });
export type BlindCalibrationBaseline = z.infer<typeof blindCalibrationBaselineSchema>;
