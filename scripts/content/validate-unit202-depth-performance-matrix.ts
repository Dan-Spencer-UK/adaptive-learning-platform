/**
 * CC-14: mechanical validation/coverage report for the approved Unit 202
 * Depth & Performance Matrix (scripts/content/data/unit202-depth-
 * performance-matrix.ts) against the official 23-AC / 58-Range-item
 * curriculum shape and the matrix's own review-flag inventory.
 *
 * This never trusts the matrix's own internal claims -- every count below
 * is independently recomputed from the live data, the same discipline
 * report-coverage-matrix.ts and validate-pedagogy.ts already use.
 *
 * This validator is deliberately independent of the existing assertion/
 * capability corpus (cc04-unit202-electrical-science.ts,
 * unit202-knowledge-obligations.ts) -- the Depth & Performance Matrix's
 * validity does not depend on, and is never inferred from, what the
 * existing corpus happens to already cover (docs/governance/
 * ROLES-AND-AUTHORITY.md, "Reuse-assessment sequencing").
 *
 * Usage:
 *   node scripts/content/validate-unit202-depth-performance-matrix.ts            (print report)
 *   node scripts/content/validate-unit202-depth-performance-matrix.ts --check     (exit 1 if any gate fails)
 */

import { fileURLToPath } from "node:url";

import { depthPerformanceMatrixSchema } from "@alp/content-schema";

import { unit202AssessmentSpecification } from "./data/unit202-assessment-specification.ts";
import { unit202DepthPerformanceMatrix } from "./data/unit202-depth-performance-matrix.ts";

// The exact official Unit 202 curriculum shape (City & Guilds 2365-02
// qualification handbook v1.12) -- the number this validator proves the
// REAL matrix instance against, not merely a schema capability.
const EXPECTED_AC_COUNT = 23;
const EXPECTED_RANGE_ITEM_COUNT = 58;

// The Project-Architect-approved matrix's own explicit review/correction/
// ambiguity flags (AC-level and Range-item-level), independently
// transcribed from unit202-depth-performance-matrix.md -- this is the
// mechanical proof that none of these were silently dropped or resolved
// during encoding (task brief §8/§16). Matched as case-sensitive
// substrings against the live data's reviewFlag fields.
const EXPECTED_REVIEW_FLAG_SUBSTRINGS: readonly string[] = [
  "C&G Handout 1 lists °C as the temperature entry; public sample A tests kelvin.",
  "Handout 2's formula appendix contains material beyond what the direct 2.2 assessment evidence establishes.",
  "Worksheet 8 clearly raises expected teaching depth above simple instrument-name recall",
  "The command verb 'specify' understates the worksheet depth",
  "C&G Handout 16 says gearing can provide 'twice as much power'",
  "Potential-energy calculation is effectively exercised through work done against gravity",
  "Public sample question labels sometimes blur AC3.2/3.4 boundaries",
  "The visual teaching should explicitly resolve the electron-flow/conventional-current apparent contradiction",
  "C&G Handout/Worksheet 7 print erroneous resistivity-unit forms such as ohm/metre³",
  "Some sample-question labels blur 4.3/4.4/4.5",
  "Magnetic effect is taught alongside these effects in Handout/Worksheet 1 but is governed substantively by LO5",
  "Worksheet 9 makes field-pattern understanding part of the expected post-teaching performance",
  "The C&G handout renders the flux-density symbol anomalously",
  "This AC is materially deeper than the verb 'describe' suggests",
  "Technical sourcing must verify and clearly document the pole-count convention because C&G Handout 12 defines P as pole pairs",
  "Average must be taught carefully as the average of one alternation",
  "Telephone-system details in the 2019 handout may be legacy-specific",
  "C&G Range says 'photo'; Handout 17 teaches photodiode while public Sample B tests a light-dependent resistor (LDR)",
  // Range-item-level (table-row) flags, distinct from the AC-level flags above.
  "Handout table uses °C; authoritative SI source required.",
  "Handout unit notation is erroneous; correct via technical source.",
  "Anti-overdepth guard.",
  "No standalone PF calculation required by AC2.2 evidence.",
  "Legacy/current-technology review required.",
  "Handout teaches photodiode; sample B tests LDR. Teach/distinguish both pending C&G clarification.",
];

interface DepthMatrixReport {
  acCount: number;
  rangeItemCount: number;
  duplicateAcNumbers: string[];
  duplicateRangeItems: string[];
  rangeItemsWithUnknownAc: string[];
  rangeItemsWithMismatchedLo: string[];
  acsMissingRequiredField: string[];
  acCountMismatch: boolean;
  rangeItemCountMismatch: boolean;
  assessmentEnvelopeMismatchesSpecification: string[];
  missingExpectedReviewFlagSubstrings: string[];
  acReviewFlagCount: number;
  rangeItemReviewFlagCount: number;
  confidenceCounts: Record<string, number>;
  matrixStatusCounts: Record<string, number>;
}

function buildReport(overrides?: { matrix?: unknown }): DepthMatrixReport {
  // Schema parse first -- structural shape, uniqueness and referential
  // integrity (AC<->Range) are enforced by depthPerformanceMatrixSchema's
  // own superRefine. A parse failure here is a hard defect, not a report
  // row -- consistent with every other validate-*.ts script in this repo.
  const matrix = depthPerformanceMatrixSchema.parse(overrides?.matrix ?? unit202DepthPerformanceMatrix);

  const acNumbers = matrix.assessmentCriteria.map((ac) => ac.acNumber);
  const acNumberSet = new Set(acNumbers);
  const duplicateAcNumbers = acNumbers.filter((id, i) => acNumbers.indexOf(id) !== i);

  const rangeKeys = matrix.officialRangeCoverage.map((r) => `${r.acNumber}::${r.rangeItem}`);
  const duplicateRangeItems = rangeKeys.filter((k, i) => rangeKeys.indexOf(k) !== i);

  const rangeItemsWithUnknownAc = matrix.officialRangeCoverage.filter((r) => !acNumberSet.has(r.acNumber)).map((r) => `${r.acNumber}::${r.rangeItem}`);

  const acLoByNumber = new Map(matrix.assessmentCriteria.map((ac) => [ac.acNumber, ac.loNumber]));
  const rangeItemsWithMismatchedLo = matrix.officialRangeCoverage
    .filter((r) => acLoByNumber.has(r.acNumber) && acLoByNumber.get(r.acNumber) !== r.loNumber)
    .map((r) => `${r.acNumber}::${r.rangeItem} (row loNumber ${r.loNumber} != AC loNumber ${acLoByNumber.get(r.acNumber)})`);

  // Redundant with zod's z.string().min(1) at the type level, but this
  // report independently RE-CHECKS every required-by-brief field is a
  // genuinely non-empty string on the real instance -- proving real-data
  // adoption, not merely that the schema *could* reject an empty string.
  const REQUIRED_STRING_FIELDS: (keyof (typeof matrix.assessmentCriteria)[number])[] = [
    "requiredLearnerPerformance",
    "requiredSupportingKnowledge",
    "visualRepresentationRequirement",
    "calculationProcedureRequirement",
    "cgTeachingWorksheetCalibration",
    "publicSampleAssessmentCalibration",
    "scopeCeiling",
  ];
  const acsMissingRequiredField: string[] = [];
  for (const ac of matrix.assessmentCriteria) {
    for (const field of REQUIRED_STRING_FIELDS) {
      const value = ac[field];
      if (typeof value !== "string" || value.trim().length === 0) {
        acsMissingRequiredField.push(`${ac.acNumber}: ${field}`);
      }
    }
    if (ac.requiredDepthDimensions.length === 0) acsMissingRequiredField.push(`${ac.acNumber}: requiredDepthDimensions`);
  }

  // Assessment envelope must stay identical to the already-governed
  // unit202AssessmentSpecification -- recomputed independently here
  // (never trusting that the matrix's own derivation stayed correct).
  const specSpecification = unit202AssessmentSpecification.specifications[0];
  const assessmentEnvelopeMismatchesSpecification: string[] = [];
  if (!specSpecification) {
    assessmentEnvelopeMismatchesSpecification.push("unit202AssessmentSpecification has no specification");
  } else {
    const specByLo = new Map(specSpecification.outcomeAllocations.map((a) => [a.outcomeNumber, a]));
    for (const row of matrix.assessmentEnvelope) {
      const specRow = specByLo.get(row.loNumber);
      if (!specRow) {
        assessmentEnvelopeMismatchesSpecification.push(`LO${row.loNumber}: no matching outcomeAllocation in unit202AssessmentSpecification`);
        continue;
      }
      if (specRow.questionCount !== row.approxQuestionCount || specRow.questionPercentage !== row.weightPercent) {
        assessmentEnvelopeMismatchesSpecification.push(
          `LO${row.loNumber}: matrix ${row.approxQuestionCount}q/${row.weightPercent}% != spec ${specRow.questionCount}q/${specRow.questionPercentage}%`,
        );
      }
    }
    if (matrix.assessmentEnvelope.length !== specSpecification.outcomeAllocations.length) {
      assessmentEnvelopeMismatchesSpecification.push(
        `envelope row count ${matrix.assessmentEnvelope.length} != specification outcomeAllocations count ${specSpecification.outcomeAllocations.length}`,
      );
    }
  }

  const allReviewFlagText = [
    ...matrix.assessmentCriteria.map((ac) => ac.reviewFlag).filter((f): f is string => Boolean(f)),
    ...matrix.officialRangeCoverage.map((r) => r.reviewFlag).filter((f): f is string => Boolean(f)),
  ].join("\n");
  const missingExpectedReviewFlagSubstrings = EXPECTED_REVIEW_FLAG_SUBSTRINGS.filter((s) => !allReviewFlagText.includes(s));

  const confidenceCounts: Record<string, number> = {};
  const matrixStatusCounts: Record<string, number> = {};
  for (const ac of matrix.assessmentCriteria) {
    confidenceCounts[ac.confidence] = (confidenceCounts[ac.confidence] ?? 0) + 1;
    matrixStatusCounts[ac.matrixStatus] = (matrixStatusCounts[ac.matrixStatus] ?? 0) + 1;
  }

  return {
    acCount: matrix.assessmentCriteria.length,
    rangeItemCount: matrix.officialRangeCoverage.length,
    duplicateAcNumbers,
    duplicateRangeItems,
    rangeItemsWithUnknownAc,
    rangeItemsWithMismatchedLo,
    acsMissingRequiredField,
    acCountMismatch: matrix.assessmentCriteria.length !== EXPECTED_AC_COUNT,
    rangeItemCountMismatch: matrix.officialRangeCoverage.length !== EXPECTED_RANGE_ITEM_COUNT,
    assessmentEnvelopeMismatchesSpecification,
    missingExpectedReviewFlagSubstrings,
    acReviewFlagCount: matrix.assessmentCriteria.filter((ac) => ac.reviewFlag).length,
    rangeItemReviewFlagCount: matrix.officialRangeCoverage.filter((r) => r.reviewFlag).length,
    confidenceCounts,
    matrixStatusCounts,
  };
}

function formatReport(report: DepthMatrixReport): string {
  const lines: string[] = [];
  lines.push("CC-14 Unit 202 Depth & Performance Matrix validation report");
  lines.push("=============================================================");
  lines.push(`Assessment Criteria: ${report.acCount} (expected ${EXPECTED_AC_COUNT}) ${report.acCountMismatch ? "MISMATCH" : "OK"}`);
  lines.push(`Official Range items: ${report.rangeItemCount} (expected ${EXPECTED_RANGE_ITEM_COUNT}) ${report.rangeItemCountMismatch ? "MISMATCH" : "OK"}`);
  lines.push(`Duplicate AC numbers (target 0): ${report.duplicateAcNumbers.length}`);
  if (report.duplicateAcNumbers.length) lines.push(`  ${report.duplicateAcNumbers.join(", ")}`);
  lines.push(`Duplicate Range items (target 0): ${report.duplicateRangeItems.length}`);
  if (report.duplicateRangeItems.length) lines.push(`  ${report.duplicateRangeItems.join(", ")}`);
  lines.push(`Range items referencing unknown AC (target 0): ${report.rangeItemsWithUnknownAc.length}`);
  if (report.rangeItemsWithUnknownAc.length) lines.push(`  ${report.rangeItemsWithUnknownAc.join(", ")}`);
  lines.push(`Range items with mismatched loNumber (target 0): ${report.rangeItemsWithMismatchedLo.length}`);
  if (report.rangeItemsWithMismatchedLo.length) lines.push(`  ${report.rangeItemsWithMismatchedLo.join(", ")}`);
  lines.push(`ACs missing a required field (target 0): ${report.acsMissingRequiredField.length}`);
  if (report.acsMissingRequiredField.length) lines.push(`  ${report.acsMissingRequiredField.join(", ")}`);
  lines.push(`Assessment envelope mismatches vs. unit202AssessmentSpecification (target 0): ${report.assessmentEnvelopeMismatchesSpecification.length}`);
  if (report.assessmentEnvelopeMismatchesSpecification.length) lines.push(`  ${report.assessmentEnvelopeMismatchesSpecification.join("; ")}`);
  lines.push(`Expected review-flag substrings missing from live data (target 0): ${report.missingExpectedReviewFlagSubstrings.length}`);
  if (report.missingExpectedReviewFlagSubstrings.length) lines.push(`  ${report.missingExpectedReviewFlagSubstrings.join("\n  ")}`);
  lines.push(`AC-level review flags present: ${report.acReviewFlagCount}/${report.acCount}`);
  lines.push(`Range-item-level review flags present: ${report.rangeItemReviewFlagCount}/${report.rangeItemCount}`);
  lines.push(`Confidence distribution: ${JSON.stringify(report.confidenceCounts)}`);
  lines.push(`Matrix-status distribution: ${JSON.stringify(report.matrixStatusCounts)}`);
  return lines.join("\n");
}

export function isReportClean(report: DepthMatrixReport): boolean {
  return (
    !report.acCountMismatch &&
    !report.rangeItemCountMismatch &&
    report.duplicateAcNumbers.length === 0 &&
    report.duplicateRangeItems.length === 0 &&
    report.rangeItemsWithUnknownAc.length === 0 &&
    report.rangeItemsWithMismatchedLo.length === 0 &&
    report.acsMissingRequiredField.length === 0 &&
    report.assessmentEnvelopeMismatchesSpecification.length === 0 &&
    report.missingExpectedReviewFlagSubstrings.length === 0
  );
}

export { buildReport, formatReport, EXPECTED_AC_COUNT, EXPECTED_RANGE_ITEM_COUNT, EXPECTED_REVIEW_FLAG_SUBSTRINGS };
export type { DepthMatrixReport };

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const report = buildReport();
  console.log(formatReport(report));
  const clean = isReportClean(report);
  console.log("");
  console.log(clean ? "PASS: all matrix validation gates are clean." : "FAIL: one or more matrix validation gates failed.");
  if (process.argv.includes("--check") && !clean) {
    process.exit(1);
  }
}
