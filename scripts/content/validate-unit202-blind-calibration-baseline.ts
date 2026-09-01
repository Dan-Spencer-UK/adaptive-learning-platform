/**
 * CC-17: mechanical validation/coverage report for the Unit 202 Blind
 * Calibration Baseline ledger
 * (scripts/content/data/unit202-blind-calibration-baseline.ts) against
 * the real, governed Unit 202 Depth & Performance Matrix and the CC-16
 * Qualification-Scope Provenance Audit ledger.
 *
 * Proves, independently recomputed from the live data (never trusted
 * from the ledger's own claims):
 *   - every one of the matrix's real 23 AC numbers has at least one
 *     baseline row (no AC silently unaudited);
 *   - every one of the matrix's real 58 (acNumber, rangeItem) pairs has
 *     at least one baseline row explicitly naming it (no Range item
 *     silently unaudited);
 *   - every one of CC-16's 56 audited propositions is either mapped to
 *     at least one calibrationKey (via the explicit CC16_MAPPING table
 *     below, cross-checked against the real CC-16 ledger's own
 *     propositionKeys so the mapping cannot silently drift) or
 *     explicitly recorded as diagnostic/non-baseline with a reason;
 *   - duplicate calibrationKeys are rejected (schema-level, re-proven
 *     here at the report level);
 *   - no blind* field (blindBaselineRequirement/blindBaselineDepth/
 *     blindBaselineRationale) contains private-material vocabulary
 *     (handout/worksheet/tutor-answer/SmartScreen/scheme of work) -- the
 *     blindness rule's mechanical backstop;
 *   - every matrixComparison value is a real member of the governed
 *     enum (schema-level, re-proven here);
 *   - every MEDIUM/LOW blindConfidence row has a blindUncertaintyReason
 *     (schema-level, re-proven here);
 *   - no row's free text carries a final "private material is
 *     correct/incorrect" verdict -- a structural backstop mirroring
 *     CC-16's own no-decisions boundary.
 *
 * Usage:
 *   node scripts/content/validate-unit202-blind-calibration-baseline.ts            (print report)
 *   node scripts/content/validate-unit202-blind-calibration-baseline.ts --check     (exit 1 if any gate fails)
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { blindCalibrationBaselineSchema } from "@alp/content-schema";

import { unit202DepthPerformanceMatrix } from "./data/unit202-depth-performance-matrix.ts";
import { unit202QualificationScopeAudit } from "./data/unit202-qualification-scope-audit.ts";
import { unit202BlindCalibrationBaseline } from "./data/unit202-blind-calibration-baseline.ts";

// Vocabulary that would smuggle tier-5/tier-6 (private-material or
// legacy-corpus) evidence into a blind* field -- the blindness rule's
// mechanical backstop. Matched case-insensitively against
// blindBaselineRequirement/blindBaselineDepth/blindBaselineRationale
// only (other fields are either closed enums or are explicitly the
// permitted place for this vocabulary, e.g. existingPrivateCalibrationClaim,
// matrixComparisonNotes, projectArchitectCalibrationQuestions).
const PRIVATE_MATERIAL_VOCABULARY: RegExp[] = [
  /\bhandouts?\b/i,
  /\bworksheets?\b/i,
  /\btutor[- ]answers?\b/i,
  /\bsmartscreen\b/i,
  /\bscheme of work\b/i,
  /\bcgTeachingWorksheetCalibration\b/i,
];

// Phrases that would smuggle a final "private material is correct/
// incorrect" verdict into any free-text field -- this package's entire
// authority boundary is that it never decides this (task section 5/7).
const FORBIDDEN_VERDICT_PATTERNS: RegExp[] = [
  /\bthe (handout|worksheet|tutor answer|private material) is (correct|incorrect|wrong|right)\b/i,
  /\bprivate material (is|are) (correct|incorrect|wrong|right)\b/i,
  /\bshould be (retained|removed|kept|deleted|trusted|corrected)\b/i,
  /\bmust be (retained|removed|kept|deleted|trusted|corrected)\b/i,
  /\brecommend(ed|ing)? (retain|remov|keep|delet|correct|trust)/i,
];

/**
 * Explicit correspondence from every one of CC-16's 56 audited
 * propositions to this ledger's own calibrationKey(s), or an explicit
 * diagnostic-only record with a reason. Cross-checked at report-build
 * time against the REAL CC-16 ledger's own propositionKeys (not
 * hand-typed in isolation), so a renamed/added/removed CC-16 row is
 * mechanically caught rather than silently drifting out of sync.
 */
const CC16_MAPPING: Record<string, { cc17Keys: string[] } | { diagnosticOnly: true; reason: string }> = {
  "ac1-1-fractions-percentages": { cc17Keys: ["ac1-1-fractions-percentages"] },
  "ac1-1-algebra-transposition": { cc17Keys: ["ac1-1-algebra-transposition"] },
  "ac1-1-indices-and-notation": { cc17Keys: ["ac1-1-indices-and-notation"] },
  "ac1-1-pythagoras-trig": { cc17Keys: ["ac1-1-pythagoras-trig"] },
  "ac1-1-statistics-range-mean-median-mode": { cc17Keys: ["ac1-1-statistics-mean-median-mode"] },
  "ac2-1-length-area-volume-mass-density-time-velocity": { cc17Keys: ["ac2-1-base-quantity-units"] },
  "ac2-1-temperature-kelvin-celsius": { cc17Keys: ["ac2-1-temperature-kelvin-celsius"] },
  "ac2-2-quantity-symbol-unit-table": { cc17Keys: ["ac2-2-quantity-symbol-unit-recognition"] },
  "ac2-2-anti-overdepth-guard-impedance-reactance-pf": { cc17Keys: ["ac2-2-ac-quantity-calculation-depth-ceiling"] },
  "ac2-3-instrument-selection-and-connection": { cc17Keys: ["ac2-3-instrument-selection-connection"] },
  "ac2-3-wattmeter-energy-meter": { cc17Keys: ["ac2-3-wattmeter-energy-meter"] },
  "ac3-1-mass-weight-definitions-and-relationship": { cc17Keys: ["ac3-1-mass-weight-definitions-relationship"] },
  "ac3-2-lever-classes": { cc17Keys: ["ac3-2-lever-classes-and-balance"] },
  "ac3-2-gears-and-pulleys-no-range-item": { cc17Keys: ["ac3-2-structural-gap-gears-pulleys-no-range-item", "ac3-2-gears", "ac3-2-pulleys"] },
  "ac3-3-force-work-energy-power-efficiency-concepts": { cc17Keys: ["ac3-3-mechanics-concepts"] },
  "ac3-4-mechanics-calculation-procedures": { cc17Keys: ["ac3-4-mechanics-calculation"] },
  "ac4-1-atomic-structure-and-current": { cc17Keys: ["ac4-1-atomic-structure-and-current"] },
  "ac4-2-conductor-insulator-distinction": { cc17Keys: ["ac4-2-conductor-insulator-distinction"] },
  "ac4-2-material-examples": { cc17Keys: ["ac4-2-conductor-insulator-distinction"] },
  "ac4-3-resistance-resistivity-relationship": { cc17Keys: ["ac4-3-resistance-resistivity-relationship"] },
  "ac4-4-ohms-law-series-parallel-concepts": { cc17Keys: ["ac4-4-series-parallel-concepts"] },
  "ac4-5-series-parallel-calculation": { cc17Keys: ["ac4-5-series-parallel-calculation"] },
  "ac4-6-power-calculation": { cc17Keys: ["ac4-6-power-calculation"] },
  "ac4-7-voltage-drop": { cc17Keys: ["ac4-7-voltage-drop"] },
  "ac4-8-thermal-chemical-effects": { cc17Keys: ["ac4-8-thermal-chemical-effects"] },
  "ac4-8-fuse-operation": { cc17Keys: ["ac4-8-thermal-chemical-effects"] },
  "ac5-1-attraction-repulsion-field-lines": { cc17Keys: ["ac5-1-attraction-repulsion-field-lines"] },
  "ac5-2-flux-flux-density-relationship": { cc17Keys: ["ac5-2-flux-flux-density-relationship"] },
  "ac5-3-field-around-conductor-and-direction-rule": { cc17Keys: ["ac5-3-field-around-conductor", "ac5-3-field-direction-rule"] },
  "ac5-3-force-on-conductor-and-flemings-left-hand": { cc17Keys: ["ac5-3-force-on-conductor", "ac5-3-flemings-left-hand-rule"] },
  "ac5-3-electromagnetism-and-emf-meaning": { cc17Keys: ["ac5-3-induced-emf", "ac5-3-coil-solenoid-field"] },
  "ac5-3-coil-solenoid-electromagnet-relay-contactor": { cc17Keys: ["ac5-3-coil-solenoid-field", "ac5-3-electromagnet", "ac5-3-relay", "ac5-3-contactor"] },
  "ac5-3-induced-emf-and-flemings-right-hand": { cc17Keys: ["ac5-3-induced-emf", "ac5-3-flemings-right-hand-rule"] },
  "ac5-4-alternator-principle-and-parts": { cc17Keys: ["ac5-4-alternator-principle-and-parts"] },
  "ac5-4-frequency-pole-pair-relationship": { cc17Keys: ["ac5-4-frequency-pole-pair-relationship"] },
  "ac5-5-waveform-characteristics-and-relationships": { cc17Keys: ["ac5-5-waveform-characteristics-and-relationships"] },
  "ac6-1-security-alarm-category": { cc17Keys: ["ac6-1-security-alarms-category"] },
  "ac6-1-security-alarm-transistor-thyristor-topology": {
    cc17Keys: ["ac6-1-security-alarm-transistor-switching-generic", "ac6-1-security-alarm-thyristor-latching-generic", "ac6-1-security-alarm-exact-topology"],
  },
  "ac6-1-telephone-category": { cc17Keys: ["ac6-1-telephone-category"] },
  "ac6-1-telephone-capacitor-role": { cc17Keys: ["ac6-1-telephone-capacitor-role"] },
  "ac6-1-telephone-resistor-role": { cc17Keys: ["ac6-1-telephone-resistor-role"] },
  "ac6-1-telephone-surge-protector-role": { cc17Keys: ["ac6-1-telephone-surge-protector-role"] },
  "ac6-1-telephone-master-vs-extension-distinction": { cc17Keys: ["ac6-1-telephone-master-vs-extension-distinction"] },
  "ac6-1-telephone-other-detail-check": { cc17Keys: ["ac6-1-telephone-other-component-detail-check"] },
  "ac6-1-dimmer-switch-topology": { cc17Keys: ["ac6-1-dimmer-switch-category"] },
  "ac6-1-heating-boiler-topology": { cc17Keys: ["ac6-1-heating-boiler-control-category"] },
  "ac6-1-motor-control-topology": { cc17Keys: ["ac6-1-motor-control-category"] },
  "ac6-1-wireless-control-topology": { cc17Keys: ["ac6-1-wireless-control-category"] },
  "ac6-2-capacitor-resistor-basic-principle": { cc17Keys: ["ac6-2-generic-operating-principles"] },
  "ac6-2-resistor-4band-colour-code": { cc17Keys: ["ac6-2-resistor-colour-code"] },
  "ac6-2-rectifier-diode-zener-led": { cc17Keys: ["ac6-2-generic-operating-principles"] },
  "ac6-2-rectifier-half-vs-full-wave-distinction": { cc17Keys: ["ac6-2-generic-operating-principles"] },
  "ac6-2-photo-device-ambiguity": {
    diagnosticOnly: true,
    reason:
      "CC-16's own row records an ambiguity in which specific photo-sensitive device (photodiode/phototransistor/LDR) the matrix's Range item 'Photo' intends. The blind method treats 'photo-sensitive device' generically within ac6-2-generic-operating-principles (no tier 1-4 evidence disambiguates the specific device type) rather than reconstructing a separate resolved row.",
  },
  "ac6-2-thermistor-ptc-ntc": { cc17Keys: ["ac6-2-generic-operating-principles"] },
  "ac6-2-diac-triac-transistor-thyristor-inverter": { cc17Keys: ["ac6-2-generic-operating-principles"] },
  "cross-cutting-fleming-rule-mnemonic-vocabulary": {
    diagnosticOnly: true,
    reason:
      "CC-16's own cross-cutting finding about the 'Fleming' mnemonic name's encyclopedia-tier sourcing is folded in as tier-6 diagnostic input to this ledger's ac5-3-flemings-left-hand-rule and ac5-3-flemings-right-hand-rule rows (see their matrixComparisonNotes), not reconstructed as its own separate calibration row, since it is not itself an independently AC/Range-anchored proposition.",
  },
};

interface RowReport {
  calibrationKey: string;
  acNumber: string;
  blindConfidence: string;
  matrixComparison: string;
}

/** Vocabulary used to classify an existingPrivateCalibrationClaim's private-material type for the summary breakdown (task section 8). A single claim may match more than one type. */
const CLAIM_TYPE_PATTERNS: Record<string, RegExp> = {
  HANDOUT: /\bhandouts?\b/i,
  WORKSHEET: /\bworksheets?\b/i,
  TUTOR_ANSWER: /\btutor[- ]answers?\b/i,
  SCHEME_OF_WORK: /\bschemes? of work\b/i,
};

interface PrivateCalibrationClaimSummary {
  rowsWithClaim: number;
  rowsWithoutClaim: number;
  byType: Record<string, number>;
  calibrationKeysWithClaim: string[];
}

interface Report {
  totalRows: number;
  acsInMatrix: number;
  acsCovered: number;
  acsNotCovered: string[];
  rangeItemsInMatrix: number;
  rangeItemsCovered: number;
  rangeItemsNotCovered: string[];
  cc16PropositionsTotal: number;
  cc16PropositionsUnmapped: string[];
  cc16MappingReferencesUnknownCc17Key: string[];
  cc16MappingStaleAgainstLedger: string[];
  duplicateCalibrationKeys: string[];
  rowsWithPrivateMaterialVocabularyInBlindFields: string[];
  rowsWithForbiddenVerdictLanguage: string[];
  confidenceCounts: Record<string, number>;
  matrixComparisonCounts: Record<string, number>;
  /** Every calibrationKey for each matrixComparison state, sorted -- the single source of truth the human report's §7.1 lists must reconcile against. */
  matrixComparisonKeysByState: Record<string, string[]>;
  mediumOrLowRows: RowReport[];
  matrixOnlyPropositionRows: RowReport[];
  privateCalibrationClaimSummary: PrivateCalibrationClaimSummary;
}

function buildReport(overrides?: {
  baseline?: unknown;
  matrix?: typeof unit202DepthPerformanceMatrix;
  cc16Audit?: typeof unit202QualificationScopeAudit;
}): Report {
  const baseline = blindCalibrationBaselineSchema.parse(overrides?.baseline ?? unit202BlindCalibrationBaseline);
  const matrix = overrides?.matrix ?? unit202DepthPerformanceMatrix;
  const cc16Audit = overrides?.cc16Audit ?? unit202QualificationScopeAudit;

  const realAcNumbers = new Set(matrix.assessmentCriteria.map((ac) => ac.acNumber));
  const realRangeKeys = new Set(matrix.officialRangeCoverage.map((r) => `${r.acNumber}::${r.rangeItem}`));

  const acsCoveredSet = new Set<string>();
  const rangeKeysCoveredSet = new Set<string>();
  const seenKeys = new Set<string>();
  const duplicateCalibrationKeys: string[] = [];
  const rowsWithPrivateMaterialVocabularyInBlindFields: string[] = [];
  const rowsWithForbiddenVerdictLanguage: string[] = [];
  const confidenceCounts: Record<string, number> = {};
  const matrixComparisonCounts: Record<string, number> = {};
  const matrixComparisonKeysByState: Record<string, string[]> = {};
  const mediumOrLowRows: RowReport[] = [];
  const matrixOnlyPropositionRows: RowReport[] = [];
  const allCc17Keys = new Set<string>();
  const calibrationKeysWithClaim: string[] = [];
  const claimByTypeCounts: Record<string, number> = { HANDOUT: 0, WORKSHEET: 0, TUTOR_ANSWER: 0, SCHEME_OF_WORK: 0 };

  for (const row of baseline.rows) {
    allCc17Keys.add(row.calibrationKey);
    if (seenKeys.has(row.calibrationKey)) duplicateCalibrationKeys.push(row.calibrationKey);
    seenKeys.add(row.calibrationKey);

    if (realAcNumbers.has(row.acNumber)) acsCoveredSet.add(row.acNumber);

    for (const rangeItem of row.rangeItems ?? []) {
      const key = `${row.acNumber}::${rangeItem}`;
      if (realRangeKeys.has(key)) rangeKeysCoveredSet.add(key);
    }

    const blindText = [row.blindBaselineRequirement, row.blindBaselineDepth, row.blindBaselineRationale].join(" ");
    for (const pattern of PRIVATE_MATERIAL_VOCABULARY) {
      if (pattern.test(blindText)) {
        rowsWithPrivateMaterialVocabularyInBlindFields.push(`${row.calibrationKey} (matched ${pattern})`);
        break;
      }
    }

    const allFreeText = [
      row.blindBaselineRequirement,
      row.blindBaselineDepth,
      row.blindBaselineRationale,
      row.matrixComparisonNotes,
      row.existingPrivateCalibrationClaim ?? "",
      ...row.projectArchitectCalibrationQuestions,
    ].join(" ");
    for (const pattern of FORBIDDEN_VERDICT_PATTERNS) {
      if (pattern.test(allFreeText)) {
        rowsWithForbiddenVerdictLanguage.push(`${row.calibrationKey} (matched ${pattern})`);
        break;
      }
    }

    confidenceCounts[row.blindConfidence] = (confidenceCounts[row.blindConfidence] ?? 0) + 1;
    matrixComparisonCounts[row.matrixComparison] = (matrixComparisonCounts[row.matrixComparison] ?? 0) + 1;
    (matrixComparisonKeysByState[row.matrixComparison] ??= []).push(row.calibrationKey);

    if (row.existingPrivateCalibrationClaim) {
      calibrationKeysWithClaim.push(row.calibrationKey);
      for (const [type, pattern] of Object.entries(CLAIM_TYPE_PATTERNS)) {
        if (pattern.test(row.existingPrivateCalibrationClaim)) claimByTypeCounts[type] = (claimByTypeCounts[type] ?? 0) + 1;
      }
    }

    if (row.blindConfidence !== "HIGH") {
      mediumOrLowRows.push({
        calibrationKey: row.calibrationKey,
        acNumber: row.acNumber,
        blindConfidence: row.blindConfidence,
        matrixComparison: row.matrixComparison,
      });
    }
    if (row.matrixComparison === "MATRIX_ONLY_PROPOSITION") {
      matrixOnlyPropositionRows.push({
        calibrationKey: row.calibrationKey,
        acNumber: row.acNumber,
        blindConfidence: row.blindConfidence,
        matrixComparison: row.matrixComparison,
      });
    }
  }

  const acsNotCovered = [...realAcNumbers].filter((ac) => !acsCoveredSet.has(ac)).sort();
  const rangeItemsNotCovered = [...realRangeKeys].filter((k) => !rangeKeysCoveredSet.has(k)).sort();

  const realCc16Keys = new Set(cc16Audit.rows.map((r) => r.propositionKey));
  const cc16PropositionsUnmapped: string[] = [];
  const cc16MappingReferencesUnknownCc17Key: string[] = [];
  const cc16MappingStaleAgainstLedger: string[] = [];

  for (const cc16Key of realCc16Keys) {
    const mapping = CC16_MAPPING[cc16Key];
    if (!mapping) {
      cc16PropositionsUnmapped.push(cc16Key);
      continue;
    }
    if (!("diagnosticOnly" in mapping)) {
      for (const cc17Key of mapping.cc17Keys) {
        if (!allCc17Keys.has(cc17Key)) {
          cc16MappingReferencesUnknownCc17Key.push(`${cc16Key} -> ${cc17Key}`);
        }
      }
    }
  }
  for (const mappedCc16Key of Object.keys(CC16_MAPPING)) {
    if (!realCc16Keys.has(mappedCc16Key)) {
      cc16MappingStaleAgainstLedger.push(mappedCc16Key);
    }
  }

  for (const state of Object.keys(matrixComparisonKeysByState)) {
    matrixComparisonKeysByState[state]!.sort();
  }

  return {
    totalRows: baseline.rows.length,
    acsInMatrix: realAcNumbers.size,
    acsCovered: acsCoveredSet.size,
    acsNotCovered,
    rangeItemsInMatrix: realRangeKeys.size,
    rangeItemsCovered: rangeKeysCoveredSet.size,
    rangeItemsNotCovered,
    cc16PropositionsTotal: realCc16Keys.size,
    cc16PropositionsUnmapped,
    cc16MappingReferencesUnknownCc17Key,
    cc16MappingStaleAgainstLedger,
    duplicateCalibrationKeys,
    rowsWithPrivateMaterialVocabularyInBlindFields,
    rowsWithForbiddenVerdictLanguage,
    confidenceCounts,
    matrixComparisonCounts,
    matrixComparisonKeysByState,
    mediumOrLowRows,
    matrixOnlyPropositionRows,
    privateCalibrationClaimSummary: {
      rowsWithClaim: calibrationKeysWithClaim.length,
      rowsWithoutClaim: baseline.rows.length - calibrationKeysWithClaim.length,
      byType: claimByTypeCounts,
      calibrationKeysWithClaim: calibrationKeysWithClaim.sort(),
    },
  };
}

function formatReport(report: Report): string {
  const lines: string[] = [];
  lines.push("CC-17 Unit 202 Blind Calibration Baseline validation report");
  lines.push("=============================================================");
  lines.push(`Ledger rows: ${report.totalRows}`);
  lines.push(`ACs in matrix: ${report.acsInMatrix}; covered: ${report.acsCovered}; not covered (target 0): ${report.acsNotCovered.length}`);
  if (report.acsNotCovered.length) lines.push(`  ${report.acsNotCovered.join(", ")}`);
  lines.push(`Range items in matrix: ${report.rangeItemsInMatrix}; covered: ${report.rangeItemsCovered}; not covered (target 0): ${report.rangeItemsNotCovered.length}`);
  if (report.rangeItemsNotCovered.length) lines.push(`  ${report.rangeItemsNotCovered.join("\n  ")}`);
  lines.push(`CC-16 propositions: ${report.cc16PropositionsTotal}; unmapped (target 0): ${report.cc16PropositionsUnmapped.length}`);
  if (report.cc16PropositionsUnmapped.length) lines.push(`  ${report.cc16PropositionsUnmapped.join("\n  ")}`);
  lines.push(`CC16_MAPPING entries referencing an unknown CC-17 calibrationKey (target 0): ${report.cc16MappingReferencesUnknownCc17Key.length}`);
  if (report.cc16MappingReferencesUnknownCc17Key.length) lines.push(`  ${report.cc16MappingReferencesUnknownCc17Key.join("\n  ")}`);
  lines.push(`CC16_MAPPING entries referencing a CC-16 key no longer in the ledger (target 0): ${report.cc16MappingStaleAgainstLedger.length}`);
  if (report.cc16MappingStaleAgainstLedger.length) lines.push(`  ${report.cc16MappingStaleAgainstLedger.join("\n  ")}`);
  lines.push(`Duplicate calibrationKeys (target 0): ${report.duplicateCalibrationKeys.length}`);
  if (report.duplicateCalibrationKeys.length) lines.push(`  ${report.duplicateCalibrationKeys.join(", ")}`);
  lines.push(`Rows with private-material vocabulary leaked into blind* fields (target 0): ${report.rowsWithPrivateMaterialVocabularyInBlindFields.length}`);
  if (report.rowsWithPrivateMaterialVocabularyInBlindFields.length) lines.push(`  ${report.rowsWithPrivateMaterialVocabularyInBlindFields.join("\n  ")}`);
  lines.push(`Rows with forbidden final-verdict language (target 0): ${report.rowsWithForbiddenVerdictLanguage.length}`);
  if (report.rowsWithForbiddenVerdictLanguage.length) lines.push(`  ${report.rowsWithForbiddenVerdictLanguage.join("\n  ")}`);
  lines.push("");
  lines.push("blindConfidence counts:");
  for (const [k, v] of Object.entries(report.confidenceCounts).sort()) lines.push(`  ${k}: ${v}`);
  lines.push("");
  lines.push("matrixComparison counts:");
  for (const [k, v] of Object.entries(report.matrixComparisonCounts).sort()) lines.push(`  ${k}: ${v}`);
  lines.push("");
  lines.push(`MEDIUM/LOW confidence rows: ${report.mediumOrLowRows.length}`);
  lines.push(`MATRIX_ONLY_PROPOSITION rows: ${report.matrixOnlyPropositionRows.length}`);
  lines.push("");
  lines.push(
    `Private-calibration claims: ${report.privateCalibrationClaimSummary.rowsWithClaim} rows with a claim, ` +
      `${report.privateCalibrationClaimSummary.rowsWithoutClaim} without.`,
  );
  for (const [k, v] of Object.entries(report.privateCalibrationClaimSummary.byType).sort()) lines.push(`  ${k}: ${v}`);
  return lines.join("\n");
}

export function isReportClean(report: Report): boolean {
  return (
    report.acsNotCovered.length === 0 &&
    report.rangeItemsNotCovered.length === 0 &&
    report.cc16PropositionsUnmapped.length === 0 &&
    report.cc16MappingReferencesUnknownCc17Key.length === 0 &&
    report.cc16MappingStaleAgainstLedger.length === 0 &&
    report.duplicateCalibrationKeys.length === 0 &&
    report.rowsWithPrivateMaterialVocabularyInBlindFields.length === 0 &&
    report.rowsWithForbiddenVerdictLanguage.length === 0
  );
}

/**
 * CC-17A (task section 5): parses the deterministic
 * `**STATE (N rows):** key1, key2, ...` lines from §7.1 of the human-
 * readable evidence report and returns, per matrixComparison state, the
 * declared count and the exact set of calibrationKeys listed. A state
 * whose line reads `(not listed individually...)` instead of a key list
 * returns an empty `keys` array with `keysListed: false`, so the
 * reconciliation check below only requires COUNT parity for that state
 * (by design, for the large SAME majority-case bucket), never a full key
 * list.
 */
function parseMatrixComparisonListsFromMarkdown(
  markdown: string,
): Record<string, { count: number; keys: string[]; keysListed: boolean }> {
  const result: Record<string, { count: number; keys: string[]; keysListed: boolean }> = {};
  const lineRegex = /\*\*([A-Z_]+) \((\d+) rows?\):\*\*\s*(.*)/g;
  for (const match of markdown.matchAll(lineRegex)) {
    const [, state, countStr, rest] = match;
    const keys = [...(rest ?? "").matchAll(/`([a-z0-9-]+)`/g)].map((m) => m[1]!);
    result[state!] = { count: Number(countStr), keys, keysListed: keys.length > 0 || /^\(none\)/.test((rest ?? "").trim()) };
  }
  return result;
}

interface ReportReconciliationResult {
  missingStatesInMarkdown: string[];
  countMismatches: string[];
  keysWithWrongState: string[];
  keysMissingFromMarkdownList: string[];
  duplicateKeysWithinAState: string[];
}

/**
 * CC-17A (task section 5): mechanically proves the human-readable
 * report's §7.1 matrixComparison lists reconcile exactly against the
 * live ledger -- never trusts the Markdown prose on its own. Checks,
 * for every matrixComparison state present in the live data: (a) the
 * report declares that state with the correct count; (b) every
 * calibrationKey the report LISTS for that state (where it lists keys
 * at all) actually carries that matrixComparison value in the live
 * ledger; (c) for a state whose Markdown line DOES enumerate keys
 * (`keysListed`), every live key for that state is actually present in
 * the list -- catches a key silently dropped from the list even when
 * the declared count is left stale/unchanged; (d) no calibrationKey is
 * listed twice under the same state.
 */
function reconcileReportAgainstMarkdown(report: Report, markdown: string): ReportReconciliationResult {
  const parsed = parseMatrixComparisonListsFromMarkdown(markdown);
  const missingStatesInMarkdown: string[] = [];
  const countMismatches: string[] = [];
  const keysWithWrongState: string[] = [];
  const keysMissingFromMarkdownList: string[] = [];
  const duplicateKeysWithinAState: string[] = [];

  for (const [state, keys] of Object.entries(report.matrixComparisonKeysByState)) {
    const declared = parsed[state];
    if (!declared) {
      missingStatesInMarkdown.push(state);
      continue;
    }
    if (declared.count !== keys.length) {
      countMismatches.push(`${state}: report says ${declared.count}, ledger has ${keys.length}`);
    }
    const seen = new Set<string>();
    for (const key of declared.keys) {
      if (seen.has(key)) duplicateKeysWithinAState.push(`${state}: ${key}`);
      seen.add(key);
      if (!keys.includes(key)) keysWithWrongState.push(`${state}: ${key} (live matrixComparison is not ${state})`);
    }
    if (declared.keys.length > 0) {
      for (const key of keys) {
        if (!declared.keys.includes(key)) keysMissingFromMarkdownList.push(`${state}: ${key}`);
      }
    }
  }

  return { missingStatesInMarkdown, countMismatches, keysWithWrongState, keysMissingFromMarkdownList, duplicateKeysWithinAState };
}

function isReportReconciliationClean(result: ReportReconciliationResult): boolean {
  return (
    result.missingStatesInMarkdown.length === 0 &&
    result.countMismatches.length === 0 &&
    result.keysWithWrongState.length === 0 &&
    result.keysMissingFromMarkdownList.length === 0 &&
    result.duplicateKeysWithinAState.length === 0
  );
}

export {
  buildReport,
  formatReport,
  PRIVATE_MATERIAL_VOCABULARY,
  FORBIDDEN_VERDICT_PATTERNS,
  CC16_MAPPING,
  parseMatrixComparisonListsFromMarkdown,
  reconcileReportAgainstMarkdown,
  isReportReconciliationClean,
};
export type { Report, RowReport, ReportReconciliationResult };

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const report = buildReport();
  console.log(formatReport(report));
  const clean = isReportClean(report);

  let reconciliationClean = true;
  try {
    const mdPath = path.resolve(import.meta.dirname, "..", "..", "docs", "architecture", "evidence", "CC-17-UNIT202-BLIND-CALIBRATION-BASELINE.md");
    const markdown = readFileSync(mdPath, "utf-8");
    const reconciliation = reconcileReportAgainstMarkdown(report, markdown);
    reconciliationClean = isReportReconciliationClean(reconciliation);
    console.log("");
    console.log(`Markdown report reconciliation (target: all empty): ${JSON.stringify(reconciliation)}`);
  } catch (err) {
    reconciliationClean = false;
    console.log("");
    console.log(`Markdown report reconciliation could not run: ${String(err)}`);
  }

  console.log("");
  console.log(clean && reconciliationClean ? "PASS: all blind-calibration-baseline validation gates are clean." : "FAIL: one or more validation gates failed.");
  if (process.argv.includes("--check") && !(clean && reconciliationClean)) {
    process.exit(1);
  }
}
