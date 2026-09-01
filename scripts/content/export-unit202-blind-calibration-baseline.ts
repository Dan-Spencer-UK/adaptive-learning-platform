/**
 * CC-17: deterministic export of the real, governed Unit 202 Blind
 * Calibration Baseline ledger (scripts/content/data/unit202-blind-
 * calibration-baseline.ts) to the two machine-readable Project-Architect
 * review artefacts (task section 9.B/9.C):
 *   - reports/unit202-calibration/blind-baseline.json (complete ledger)
 *   - reports/unit202-calibration/blind-baseline.csv (flat review export)
 *
 * Both are generated from the SAME in-memory, schema-validated ledger in
 * one process, so their calibrationKey sets are identical by
 * construction -- never hand-typed or allowed to drift independently.
 *
 * Usage: node scripts/content/export-unit202-blind-calibration-baseline.ts
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { blindCalibrationBaselineSchema } from "@alp/content-schema";

import { unit202BlindCalibrationBaseline } from "./data/unit202-blind-calibration-baseline.ts";

const OUTPUT_DIR = path.resolve(import.meta.dirname, "..", "..", "reports", "unit202-calibration");

const CSV_COLUMNS = [
  "calibrationKey",
  "acNumber",
  "loNumber",
  "rangeItems",
  "publicSpecificationAnchor",
  "publicRangeAnchor",
  "publicAssessmentAnchor",
  "transferablePrerequisiteJustification",
  "learnerPerformanceType",
  "blindBaselineRequirement",
  "blindBaselineDepth",
  "blindBaselineRationale",
  "factualSourceRequirementKeys",
  "blindConfidence",
  "blindUncertaintyReason",
  "matrixComparison",
  "matrixComparisonNotes",
  "existingPrivateCalibrationClaim",
  "legacyPropagationKeys",
  "projectArchitectCalibrationQuestions",
] as const;

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toCsvCell(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return csvEscape(value.join(" | "));
  return csvEscape(String(value));
}

export function buildCsv(baseline = unit202BlindCalibrationBaseline): string {
  const lines: string[] = [];
  lines.push(CSV_COLUMNS.join(","));
  for (const row of baseline.rows) {
    lines.push(CSV_COLUMNS.map((col) => toCsvCell((row as Record<string, unknown>)[col])).join(","));
  }
  return lines.join("\n") + "\n";
}

export function buildJson(baseline = unit202BlindCalibrationBaseline): string {
  return JSON.stringify(baseline, null, 2) + "\n";
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const baseline = blindCalibrationBaselineSchema.parse(unit202BlindCalibrationBaseline);
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const jsonPath = path.join(OUTPUT_DIR, "blind-baseline.json");
  const csvPath = path.join(OUTPUT_DIR, "blind-baseline.csv");
  writeFileSync(jsonPath, buildJson(baseline), "utf-8");
  writeFileSync(csvPath, buildCsv(baseline), "utf-8");
  console.log(`Wrote ${baseline.rows.length} rows to:`);
  console.log(`  ${jsonPath}`);
  console.log(`  ${csvPath}`);
}
