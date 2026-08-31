/**
 * CC-16: mechanical validation/coverage report for the Unit 202
 * Qualification-Scope Provenance / Contamination Audit ledger
 * (scripts/content/data/unit202-qualification-scope-audit.ts) against the
 * real, governed Unit 202 Depth & Performance Matrix.
 *
 * Proves, independently recomputed from the live data (never trusted from
 * the ledger's own claims):
 *   - every one of the matrix's real 23 AC numbers has at least one ledger
 *     row (no AC silently unaudited);
 *   - every one of the matrix's real 58 (acNumber, rangeItem) Range-item
 *     pairs has at least one ledger row explicitly naming it (no Range
 *     item silently unaudited);
 *   - no ledger row references an AC number or (acNumber, rangeItem) pair
 *     that does not actually exist in the real matrix (no invented
 *     anchor);
 *   - duplicate propositionKeys are rejected (schema-level, re-proven here
 *     at the report level);
 *   - every scopeRiskFlags/evidenceStrength value used is a real member of
 *     the governed enum (schema-level, re-proven here);
 *   - no ledger row's free-text `notes` field contains a final-scope-
 *     classification phrase this package is forbidden from asserting
 *     (REQUIRED_QUALIFICATION_KNOWLEDGE, FOUNDATIONAL_PREREQUISITE as a
 *     verdict, CONTEXTUAL_TEACHING_SUPPORT, OUT_OF_SCOPE, or plain
 *     "retain"/"remove"/"required" used as a decision verb) -- a
 *     structural backstop for the audit's own no-decisions boundary.
 *
 * Usage:
 *   node scripts/content/validate-unit202-qualification-scope-audit.ts            (print report)
 *   node scripts/content/validate-unit202-qualification-scope-audit.ts --check     (exit 1 if any gate fails)
 */

import { fileURLToPath } from "node:url";

import { qualificationScopeAuditSchema } from "@alp/content-schema";

import { unit202DepthPerformanceMatrix } from "./data/unit202-depth-performance-matrix.ts";
import { unit202QualificationScopeAudit } from "./data/unit202-qualification-scope-audit.ts";

// Phrases that would smuggle a final scope classification into free-text
// notes -- this package's entire authority boundary is that it never
// decides these. Matched case-insensitively against `notes` only (other
// fields are closed enums already incapable of carrying a verdict).
const FORBIDDEN_VERDICT_PATTERNS: RegExp[] = [
  /\brequired[- ]qualification[- ]knowledge\b/i,
  /\bfoundational[- ]prerequisite\b(?!\s+claim)/i,
  /\bcontextual[- ]teaching[- ]support\b/i,
  /\bout[- ]of[- ]scope\b/i,
  /\bshould be (retained|removed|kept|deleted)\b/i,
  /\bmust be (retained|removed|kept|deleted)\b/i,
  /\brecommend(ed|ing)? (retain|remov|keep|delet)/i,
];

interface RowReport {
  propositionKey: string;
  acNumber: string;
  rangeItems?: string[];
  evidenceStrength: string;
  scopeRiskFlags: string[];
}

interface Report {
  totalRows: number;
  acsInMatrix: number;
  acsAudited: number;
  acsNotAudited: string[];
  rangeItemsInMatrix: number;
  rangeItemsAudited: number;
  rangeItemsNotAudited: string[];
  rowsReferencingUnknownAc: string[];
  rowsReferencingUnknownRangeItem: string[];
  rowsWithForbiddenVerdictLanguage: string[];
  riskFlagCounts: Record<string, number>;
  evidenceStrengthCounts: Record<string, number>;
  rowsWithAtLeastOneRiskFlag: RowReport[];
}

function buildReport(overrides?: {
  audit?: unknown;
  matrix?: typeof unit202DepthPerformanceMatrix;
}): Report {
  const audit = qualificationScopeAuditSchema.parse(overrides?.audit ?? unit202QualificationScopeAudit);
  const matrix = overrides?.matrix ?? unit202DepthPerformanceMatrix;

  const realAcNumbers = new Set(matrix.assessmentCriteria.map((ac) => ac.acNumber));
  const realRangeKeys = new Set(matrix.officialRangeCoverage.map((r) => `${r.acNumber}::${r.rangeItem}`));

  const rowsReferencingUnknownAc: string[] = [];
  const rowsReferencingUnknownRangeItem: string[] = [];
  const rowsWithForbiddenVerdictLanguage: string[] = [];
  const acsAuditedSet = new Set<string>();
  const rangeKeysAuditedSet = new Set<string>();
  const riskFlagCounts: Record<string, number> = {};
  const evidenceStrengthCounts: Record<string, number> = {};
  const rowsWithAtLeastOneRiskFlag: RowReport[] = [];

  for (const row of audit.rows) {
    if (!realAcNumbers.has(row.acNumber)) {
      rowsReferencingUnknownAc.push(`${row.propositionKey} -> ${row.acNumber}`);
    } else {
      acsAuditedSet.add(row.acNumber);
    }

    for (const rangeItem of row.rangeItems ?? []) {
      const key = `${row.acNumber}::${rangeItem}`;
      if (!realRangeKeys.has(key)) {
        rowsReferencingUnknownRangeItem.push(`${row.propositionKey} -> ${key}`);
      } else {
        rangeKeysAuditedSet.add(key);
      }
    }

    for (const pattern of FORBIDDEN_VERDICT_PATTERNS) {
      if (pattern.test(row.notes)) {
        rowsWithForbiddenVerdictLanguage.push(`${row.propositionKey} (matched ${pattern})`);
        break;
      }
    }

    evidenceStrengthCounts[row.evidenceStrength] = (evidenceStrengthCounts[row.evidenceStrength] ?? 0) + 1;
    for (const flag of row.scopeRiskFlags) {
      riskFlagCounts[flag] = (riskFlagCounts[flag] ?? 0) + 1;
    }
    if (row.scopeRiskFlags.length > 0) {
      rowsWithAtLeastOneRiskFlag.push({
        propositionKey: row.propositionKey,
        acNumber: row.acNumber,
        rangeItems: row.rangeItems,
        evidenceStrength: row.evidenceStrength,
        scopeRiskFlags: row.scopeRiskFlags,
      });
    }
  }

  const acsNotAudited = [...realAcNumbers].filter((ac) => !acsAuditedSet.has(ac)).sort();
  const rangeItemsNotAudited = [...realRangeKeys].filter((k) => !rangeKeysAuditedSet.has(k)).sort();

  return {
    totalRows: audit.rows.length,
    acsInMatrix: realAcNumbers.size,
    acsAudited: acsAuditedSet.size,
    acsNotAudited,
    rangeItemsInMatrix: realRangeKeys.size,
    rangeItemsAudited: rangeKeysAuditedSet.size,
    rangeItemsNotAudited,
    rowsReferencingUnknownAc,
    rowsReferencingUnknownRangeItem,
    rowsWithForbiddenVerdictLanguage,
    riskFlagCounts,
    evidenceStrengthCounts,
    rowsWithAtLeastOneRiskFlag,
  };
}

function formatReport(report: Report): string {
  const lines: string[] = [];
  lines.push("CC-16 Unit 202 Qualification-Scope Provenance Audit validation report");
  lines.push("=========================================================================");
  lines.push(`Ledger rows: ${report.totalRows}`);
  lines.push(`ACs in matrix: ${report.acsInMatrix}; audited: ${report.acsAudited}; not audited (target 0): ${report.acsNotAudited.length}`);
  if (report.acsNotAudited.length) lines.push(`  ${report.acsNotAudited.join(", ")}`);
  lines.push(`Range items in matrix: ${report.rangeItemsInMatrix}; audited: ${report.rangeItemsAudited}; not audited (target 0): ${report.rangeItemsNotAudited.length}`);
  if (report.rangeItemsNotAudited.length) lines.push(`  ${report.rangeItemsNotAudited.join("\n  ")}`);
  lines.push(`Rows referencing an unknown AC (target 0): ${report.rowsReferencingUnknownAc.length}`);
  if (report.rowsReferencingUnknownAc.length) lines.push(`  ${report.rowsReferencingUnknownAc.join("\n  ")}`);
  lines.push(`Rows referencing an unknown Range item (target 0): ${report.rowsReferencingUnknownRangeItem.length}`);
  if (report.rowsReferencingUnknownRangeItem.length) lines.push(`  ${report.rowsReferencingUnknownRangeItem.join("\n  ")}`);
  lines.push(`Rows with forbidden final-scope-verdict language in notes (target 0): ${report.rowsWithForbiddenVerdictLanguage.length}`);
  if (report.rowsWithForbiddenVerdictLanguage.length) lines.push(`  ${report.rowsWithForbiddenVerdictLanguage.join("\n  ")}`);
  lines.push("");
  lines.push("Evidence-strength counts:");
  for (const [k, v] of Object.entries(report.evidenceStrengthCounts).sort()) lines.push(`  ${k}: ${v}`);
  lines.push("");
  lines.push("Scope-risk-flag counts:");
  for (const [k, v] of Object.entries(report.riskFlagCounts).sort()) lines.push(`  ${k}: ${v}`);
  lines.push("");
  lines.push(`Rows with at least one scope-risk flag: ${report.rowsWithAtLeastOneRiskFlag.length}`);
  return lines.join("\n");
}

export function isReportClean(report: Report): boolean {
  return (
    report.acsNotAudited.length === 0 &&
    report.rangeItemsNotAudited.length === 0 &&
    report.rowsReferencingUnknownAc.length === 0 &&
    report.rowsReferencingUnknownRangeItem.length === 0 &&
    report.rowsWithForbiddenVerdictLanguage.length === 0
  );
}

export { buildReport, formatReport, FORBIDDEN_VERDICT_PATTERNS };
export type { Report, RowReport };

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
  console.log(clean ? "PASS: all qualification-scope-audit validation gates are clean." : "FAIL: one or more validation gates failed.");
  if (process.argv.includes("--check") && !clean) {
    process.exit(1);
  }
}
