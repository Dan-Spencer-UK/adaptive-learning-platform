import { describe, expect, it } from "vitest";

import { blindCalibrationBaselineSchema, blindConfidenceSchema, matrixComparisonSchema } from "@alp/content-schema";

import { readFileSync } from "node:fs";
import path from "node:path";

import { unit202DepthPerformanceMatrix } from "./data/unit202-depth-performance-matrix.ts";
import { unit202QualificationScopeAudit } from "./data/unit202-qualification-scope-audit.ts";
import { unit202BlindCalibrationBaseline } from "./data/unit202-blind-calibration-baseline.ts";
import { unit202BlindCalibrationBaseline5d45953Snapshot } from "./data/unit202-blind-calibration-baseline-5d45953-snapshot.ts";
import {
  buildReport,
  CC16_MAPPING,
  PRIVATE_MATERIAL_VOCABULARY,
  isReportClean,
  isReportReconciliationClean,
  reconcileReportAgainstMarkdown,
} from "./validate-unit202-blind-calibration-baseline.ts";

const CC17_MD_PATH = path.resolve(import.meta.dirname, "..", "..", "docs", "architecture", "evidence", "CC-17-UNIT202-BLIND-CALIBRATION-BASELINE.md");

// CC-17: proves the REAL Unit 202 Blind Calibration Baseline ledger is
// loadable, valid, and mechanically consistent with the real, governed
// Depth & Performance Matrix and the real CC-16 audit ledger it derives from.
describe("CC-17 Unit 202 Blind Calibration Baseline -- real-instance validation", () => {
  it("REAL-CORPUS-ADOPTED: the real baseline ledger parses against blindCalibrationBaselineSchema without modification", () => {
    expect(() => blindCalibrationBaselineSchema.parse(unit202BlindCalibrationBaseline)).not.toThrow();
  });

  it("PRODUCTION-LOADABLE: the real baseline report is entirely clean", () => {
    const report = buildReport();
    expect(isReportClean(report)).toBe(true);
  });

  it("every one of the matrix's real 23 ACs has at least one baseline row", () => {
    const report = buildReport();
    expect(report.acsInMatrix).toBe(23);
    expect(report.acsCovered).toBe(23);
    expect(report.acsNotCovered).toEqual([]);
  });

  it("every one of the matrix's real 58 Range-item treatments has at least one baseline row", () => {
    const report = buildReport();
    expect(report.rangeItemsInMatrix).toBe(58);
    expect(report.rangeItemsCovered).toBe(58);
    expect(report.rangeItemsNotCovered).toEqual([]);
  });

  it("every one of the real CC-16 audit's propositions is mapped to a calibrationKey or explicitly recorded as diagnostic-only", () => {
    const report = buildReport();
    expect(report.cc16PropositionsUnmapped).toEqual([]);
    expect(report.cc16MappingReferencesUnknownCc17Key).toEqual([]);
    expect(report.cc16MappingStaleAgainstLedger).toEqual([]);
    // Re-prove directly against the real CC-16 ledger, not just via the report's own logic.
    const realCc16Keys = new Set(unit202QualificationScopeAudit.rows.map((r) => r.propositionKey));
    for (const key of realCc16Keys) expect(CC16_MAPPING[key]).toBeDefined();
  });

  it("has no duplicate calibrationKeys", () => {
    const keys = unit202BlindCalibrationBaseline.rows.map((r) => r.calibrationKey);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("every blindConfidence value is a real member of the governed enum", () => {
    for (const row of unit202BlindCalibrationBaseline.rows) {
      expect(() => blindConfidenceSchema.parse(row.blindConfidence)).not.toThrow();
    }
  });

  it("every matrixComparison value is a real member of the governed enum", () => {
    for (const row of unit202BlindCalibrationBaseline.rows) {
      expect(() => matrixComparisonSchema.parse(row.matrixComparison)).not.toThrow();
    }
  });

  it("every MEDIUM/LOW blindConfidence row has a blindUncertaintyReason", () => {
    for (const row of unit202BlindCalibrationBaseline.rows) {
      if (row.blindConfidence !== "HIGH") {
        expect(row.blindUncertaintyReason, `row ${row.calibrationKey} is ${row.blindConfidence} but has no blindUncertaintyReason`).toBeTruthy();
      }
    }
  });

  it("BLINDNESS RULE: no row's blind* fields contain private-material vocabulary", () => {
    const report = buildReport();
    expect(report.rowsWithPrivateMaterialVocabularyInBlindFields).toEqual([]);
    // Re-prove directly against the real data, not just via the report's own logic.
    for (const row of unit202BlindCalibrationBaseline.rows) {
      const blindText = [row.blindBaselineRequirement, row.blindBaselineDepth, row.blindBaselineRationale].join(" ");
      for (const pattern of PRIVATE_MATERIAL_VOCABULARY) {
        expect(pattern.test(blindText), `row ${row.calibrationKey} blind* field matched ${pattern}`).toBe(false);
      }
    }
  });

  it("BLINDNESS RULE (structural): every existingPrivateCalibrationClaim, where present, is prefixed as an unverified claim", () => {
    for (const row of unit202BlindCalibrationBaseline.rows) {
      if (row.existingPrivateCalibrationClaim) {
        expect(row.existingPrivateCalibrationClaim.startsWith("UNVERIFIED CALIBRATION CLAIM:")).toBe(true);
      }
    }
  });

  it("NO-DECISIONS BOUNDARY: no row's free text contains forbidden final-verdict language about private material", () => {
    const report = buildReport();
    expect(report.rowsWithForbiddenVerdictLanguage).toEqual([]);
  });

  it("NO-DECISIONS BOUNDARY (structural): no field name on a real, schema-validated row is capable of carrying a final correctness verdict", () => {
    const parsed = blindCalibrationBaselineSchema.parse(unit202BlindCalibrationBaseline);
    const fieldNames = new Set<string>();
    for (const row of parsed.rows) {
      for (const key of Object.keys(row)) fieldNames.add(key);
    }
    const forbiddenFieldNamePatterns = [/verdict/i, /isCorrect/i, /privateMaterialAccurate/i, /finalDecision/i];
    for (const name of fieldNames) {
      for (const pattern of forbiddenFieldNamePatterns) {
        expect(pattern.test(name)).toBe(false);
      }
    }
  });

  it("every row carries at least one Project-Architect calibration question, and none are generic boilerplate repeated verbatim across every row", () => {
    for (const row of unit202BlindCalibrationBaseline.rows) {
      expect(row.projectArchitectCalibrationQuestions.length).toBeGreaterThan(0);
    }
    const firstQuestions = unit202BlindCalibrationBaseline.rows.map((r) => r.projectArchitectCalibrationQuestions[0]);
    expect(new Set(firstQuestions).size).toBeGreaterThan(unit202BlindCalibrationBaseline.rows.length / 2);
  });

  it("the mandated telephone cluster covers all six required items (task section 11.A)", () => {
    const rows = unit202BlindCalibrationBaseline.rows.filter((r) => r.acNumber === "6.1" && r.rangeItems?.includes("Telephones"));
    const keys = rows.map((r) => r.calibrationKey);
    expect(keys).toContain("ac6-1-telephone-category");
    expect(keys).toContain("ac6-1-telephone-capacitor-role");
    expect(keys).toContain("ac6-1-telephone-resistor-role");
    expect(keys).toContain("ac6-1-telephone-surge-protector-role");
    expect(keys).toContain("ac6-1-telephone-master-vs-extension-distinction");
    expect(keys).toContain("ac6-1-telephone-other-component-detail-check");
  });

  it("the mandated security-alarm cluster covers all four required items (task section 11.B), separating generic component capability from the exact combined topology", () => {
    const keys = unit202BlindCalibrationBaseline.rows.filter((r) => r.calibrationKey.startsWith("ac6-1-security-alarm")).map((r) => r.calibrationKey);
    expect(keys).toContain("ac6-1-security-alarms-category");
    expect(keys).toContain("ac6-1-security-alarm-transistor-switching-generic");
    expect(keys).toContain("ac6-1-security-alarm-thyristor-latching-generic");
    expect(keys).toContain("ac6-1-security-alarm-exact-topology");
    const topologyRow = unit202BlindCalibrationBaseline.rows.find((r) => r.calibrationKey === "ac6-1-security-alarm-exact-topology")!;
    expect(topologyRow.matrixComparison).toBe("MATRIX_ONLY_PROPOSITION");
    expect(topologyRow.blindConfidence).toBe("LOW");
  });

  it("the mandated AC5.3 cluster covers all ten required items (task section 11.C), separately from the bundled coil/solenoid/electromagnet/relay/contactor group", () => {
    const keys = unit202BlindCalibrationBaseline.rows.filter((r) => r.acNumber === "5.3").map((r) => r.calibrationKey);
    expect(keys).toContain("ac5-3-field-around-conductor");
    expect(keys).toContain("ac5-3-field-direction-rule");
    expect(keys).toContain("ac5-3-force-on-conductor");
    expect(keys).toContain("ac5-3-flemings-left-hand-rule");
    expect(keys).toContain("ac5-3-induced-emf");
    expect(keys).toContain("ac5-3-flemings-right-hand-rule");
    expect(keys).toContain("ac5-3-coil-solenoid-field");
    expect(keys).toContain("ac5-3-electromagnet");
    expect(keys).toContain("ac5-3-relay");
    expect(keys).toContain("ac5-3-contactor");
  });

  it("the mandated AC3.2 cluster separates lever classes from gears from pulleys, and records the AC-wording-vs-Range-structure gap explicitly (task section 11.D)", () => {
    const keys = unit202BlindCalibrationBaseline.rows.filter((r) => r.acNumber === "3.2").map((r) => r.calibrationKey);
    expect(keys).toContain("ac3-2-lever-classes-and-balance");
    expect(keys).toContain("ac3-2-structural-gap-gears-pulleys-no-range-item");
    expect(keys).toContain("ac3-2-gears");
    expect(keys).toContain("ac3-2-pulleys");
  });

  it("the mandated AC6.2 cluster separates generic operating principle from schematic-symbol recognition from physical-appearance recognition (task section 11.E)", () => {
    const keys = unit202BlindCalibrationBaseline.rows.filter((r) => r.acNumber === "6.2").map((r) => r.calibrationKey);
    expect(keys).toContain("ac6-2-generic-operating-principles");
    expect(keys).toContain("ac6-2-schematic-symbol-recognition");
    expect(keys).toContain("ac6-2-physical-appearance-recognition");
    const appearanceRow = unit202BlindCalibrationBaseline.rows.find((r) => r.calibrationKey === "ac6-2-physical-appearance-recognition")!;
    expect(appearanceRow.blindConfidence).toBe("LOW");
  });

  it("the mandated AC2.2 cluster makes the impedance/reactance/power-factor calculation-vs-recognition depth explicit (task section 11.F)", () => {
    const depthRow = unit202BlindCalibrationBaseline.rows.find((r) => r.calibrationKey === "ac2-2-ac-quantity-calculation-depth-ceiling")!;
    expect(depthRow.learnerPerformanceType).toBe("DISTINGUISH");
    expect(depthRow.blindBaselineDepth).toMatch(/ceiling|not.*calculate|recognition/i);
  });
});

describe("CC-17 Unit 202 Blind Calibration Baseline -- tamper-and-assert regressions", () => {
  it("SCHEMA-CAPABLE: a duplicate calibrationKey is rejected at the schema layer", () => {
    const tampered = {
      ...unit202BlindCalibrationBaseline,
      rows: [...unit202BlindCalibrationBaseline.rows, { ...unit202BlindCalibrationBaseline.rows[0]! }],
    };
    expect(() => blindCalibrationBaselineSchema.parse(tampered)).toThrow(/duplicate calibrationKey/);
  });

  it("SCHEMA-CAPABLE: an invalid acNumber format is rejected at the schema layer", () => {
    const tampered = {
      ...unit202BlindCalibrationBaseline,
      rows: unit202BlindCalibrationBaseline.rows.map((r, i) => (i === 0 ? { ...r, acNumber: "not-an-ac-number" } : r)),
    };
    expect(() => blindCalibrationBaselineSchema.parse(tampered)).toThrow();
  });

  it("SCHEMA-CAPABLE: an unknown matrixComparison value is rejected at the schema layer", () => {
    const tampered = {
      ...unit202BlindCalibrationBaseline,
      rows: unit202BlindCalibrationBaseline.rows.map((r, i) => (i === 0 ? { ...r, matrixComparison: "NOT_A_REAL_VALUE" as never } : r)),
    };
    expect(() => blindCalibrationBaselineSchema.parse(tampered)).toThrow();
  });

  it("SCHEMA-CAPABLE: a MEDIUM/LOW confidence row missing blindUncertaintyReason is rejected at the schema layer", () => {
    const tampered = {
      ...unit202BlindCalibrationBaseline,
      rows: unit202BlindCalibrationBaseline.rows.map((r, i) =>
        i === 0 ? { ...r, blindConfidence: "LOW" as const, blindUncertaintyReason: undefined } : r,
      ),
    };
    expect(() => blindCalibrationBaselineSchema.parse(tampered)).toThrow(/blindUncertaintyReason/);
  });

  it("SCHEMA-CAPABLE: an existingPrivateCalibrationClaim missing the required unverified-claim prefix is rejected at the schema layer", () => {
    const tampered = {
      ...unit202BlindCalibrationBaseline,
      rows: unit202BlindCalibrationBaseline.rows.map((r, i) =>
        i === 0 ? { ...r, existingPrivateCalibrationClaim: "the handout says X" } : r,
      ),
    };
    expect(() => blindCalibrationBaselineSchema.parse(tampered)).toThrow();
  });

  it("an AC silently dropped from the ledger is caught as not-covered, never silently accepted", () => {
    const tampered = {
      ...unit202BlindCalibrationBaseline,
      rows: unit202BlindCalibrationBaseline.rows.filter((r) => r.acNumber !== "3.1"),
    };
    const report = buildReport({ baseline: tampered });
    expect(report.acsNotCovered).toContain("3.1");
    expect(isReportClean(report)).toBe(false);
  });

  it("a Range item silently dropped from every ledger row is caught as not-covered, never silently accepted", () => {
    const tampered = {
      ...unit202BlindCalibrationBaseline,
      rows: unit202BlindCalibrationBaseline.rows.map((r) => {
        if (!r.rangeItems?.includes("Telephones")) return r;
        const remaining = r.rangeItems.filter((item) => item !== "Telephones");
        return remaining.length > 0 ? { ...r, rangeItems: remaining } : { ...r, rangeItems: undefined };
      }),
    };
    const report = buildReport({ baseline: tampered });
    expect(report.rangeItemsNotCovered).toContain("6.1::Telephones");
    expect(isReportClean(report)).toBe(false);
  });

  it("a CC-16 proposition silently dropped from CC16_MAPPING's coverage is caught, never silently accepted", () => {
    // Simulate a stale mapping table by checking against a CC-16 ledger
    // with an extra, unmapped proposition injected.
    const tamperedCc16 = {
      ...unit202QualificationScopeAudit,
      rows: [
        ...unit202QualificationScopeAudit.rows,
        { ...unit202QualificationScopeAudit.rows[0]!, propositionKey: "a-brand-new-unmapped-cc16-proposition" },
      ],
    };
    const report = buildReport({ cc16Audit: tamperedCc16 });
    expect(report.cc16PropositionsUnmapped).toContain("a-brand-new-unmapped-cc16-proposition");
    expect(isReportClean(report)).toBe(false);
  });

  it("BLINDNESS RULE: private-material vocabulary injected into a blind* field is mechanically caught", () => {
    const tampered = {
      ...unit202BlindCalibrationBaseline,
      rows: unit202BlindCalibrationBaseline.rows.map((r, i) =>
        i === 0 ? { ...r, blindBaselineRationale: "This is confirmed directly by the private handout's own worksheet." } : r,
      ),
    };
    const report = buildReport({ baseline: tampered });
    expect(report.rowsWithPrivateMaterialVocabularyInBlindFields.length).toBeGreaterThan(0);
    expect(isReportClean(report)).toBe(false);
  });

  it("NO-DECISIONS BOUNDARY: a final-verdict phrase about private material injected into a row is mechanically caught", () => {
    const tampered = {
      ...unit202BlindCalibrationBaseline,
      rows: unit202BlindCalibrationBaseline.rows.map((r, i) =>
        i === 0 ? { ...r, matrixComparisonNotes: "The private material is correct and should be trusted." } : r,
      ),
    };
    const report = buildReport({ baseline: tampered });
    expect(report.rowsWithForbiddenVerdictLanguage.length).toBeGreaterThan(0);
    expect(isReportClean(report)).toBe(false);
  });
});

describe("CC-17 Unit 202 Blind Calibration Baseline -- matrix/CC-16 cross-reference sanity", () => {
  it("the matrix's own AC3.2 officialRangeCoverage genuinely contains no gear/pulley Range item, matching this baseline's structural-gap row", () => {
    const ac32Items = unit202DepthPerformanceMatrix.officialRangeCoverage.filter((r) => r.acNumber === "3.2").map((r) => r.rangeItem);
    expect(ac32Items.sort()).toEqual(["Class I", "Class II", "Class III"]);
  });

  it("every CC17 calibrationKey referenced by CC16_MAPPING actually exists in the real baseline ledger", () => {
    const realCc17Keys = new Set(unit202BlindCalibrationBaseline.rows.map((r) => r.calibrationKey));
    for (const mapping of Object.values(CC16_MAPPING)) {
      if ("cc17Keys" in mapping) {
        for (const key of mapping.cc17Keys) expect(realCc17Keys.has(key)).toBe(true);
      }
    }
  });
});

// CC-17A: narrow correction -- populate existingPrivateCalibrationClaim
// (comparison data only, never an input to a blind* field) and reconcile
// the human-readable report's matrixComparison lists against the live
// ledger. See task letters A-H in the CC-17A instruction for the exact
// checks this block proves.
describe("CC-17A -- private-calibration claim export completeness", () => {
  it("[B] every populated existingPrivateCalibrationClaim begins with the literal prefix 'UNVERIFIED CALIBRATION CLAIM:'", () => {
    const populated = unit202BlindCalibrationBaseline.rows.filter((r) => r.existingPrivateCalibrationClaim);
    expect(populated.length).toBeGreaterThan(0);
    for (const row of populated) {
      expect(row.existingPrivateCalibrationClaim!.startsWith("UNVERIFIED CALIBRATION CLAIM:")).toBe(true);
    }
  });

  it("[C] at least one real row now contains an existingPrivateCalibrationClaim", () => {
    const report = buildReport();
    expect(report.privateCalibrationClaimSummary.rowsWithClaim).toBeGreaterThan(0);
  });

  it("[D] telephone capacitor carries its repository-recorded private calibration claim, matching the governed matrix's Worksheet-18 text", () => {
    const row = unit202BlindCalibrationBaseline.rows.find((r) => r.calibrationKey === "ac6-1-telephone-capacitor-role")!;
    expect(row.existingPrivateCalibrationClaim).toBeTruthy();
    expect(row.existingPrivateCalibrationClaim).toMatch(/worksheet 18/i);
    expect(row.existingPrivateCalibrationClaim).toMatch(/capacitor/i);
    // Cross-check directly against the real governed matrix's own text, not just this ledger's own claim.
    const ac61 = unit202DepthPerformanceMatrix.assessmentCriteria.find((ac) => ac.acNumber === "6.1")!;
    expect(ac61.cgTeachingWorksheetCalibration).toMatch(/worksheet 18 asks roles of thyristor, telephone capacitor/i);
  });

  it("[E] telephone resistor/surge-protector/master-vs-extension do NOT inherit the capacitor's Worksheet-18 claim without independent repository evidence", () => {
    const noInheritKeys = [
      "ac6-1-telephone-resistor-role",
      "ac6-1-telephone-surge-protector-role",
      "ac6-1-telephone-master-vs-extension-distinction",
      "ac6-1-telephone-other-component-detail-check",
    ];
    for (const key of noInheritKeys) {
      const row = unit202BlindCalibrationBaseline.rows.find((r) => r.calibrationKey === key)!;
      expect(row.existingPrivateCalibrationClaim, `${key} should carry no private-calibration claim`).toBeUndefined();
    }
    // Cross-check against the real governed matrix's own text: it names only
    // the capacitor, never resistor/surge-protector/master-vs-extension.
    const ac61 = unit202DepthPerformanceMatrix.assessmentCriteria.find((ac) => ac.acNumber === "6.1")!;
    expect(ac61.cgTeachingWorksheetCalibration).not.toMatch(/resistor/i);
    expect(ac61.cgTeachingWorksheetCalibration).not.toMatch(/surge/i);
    expect(ac61.cgTeachingWorksheetCalibration).not.toMatch(/extension/i);
  });

  it("[F] the human report's §7.1 matrixComparison counts and lists reconcile exactly to the live ledger", () => {
    const report = buildReport();
    const markdown = readFileSync(CC17_MD_PATH, "utf-8");
    const reconciliation = reconcileReportAgainstMarkdown(report, markdown);
    expect(reconciliation.missingStatesInMarkdown).toEqual([]);
    expect(reconciliation.countMismatches).toEqual([]);
    expect(reconciliation.keysWithWrongState).toEqual([]);
    expect(reconciliation.duplicateKeysWithinAState).toEqual([]);
    expect(isReportReconciliationClean(reconciliation)).toBe(true);
  });

  it("[F, tamper] a MATRIX_BROADER key silently omitted from the human report's list is mechanically caught, even when the declared count is left stale", () => {
    const report = buildReport();
    const markdown = readFileSync(CC17_MD_PATH, "utf-8").replace("`ac1-1-indices-and-notation`, ", "");
    const reconciliation = reconcileReportAgainstMarkdown(report, markdown);
    expect(reconciliation.keysMissingFromMarkdownList.some((m) => m.startsWith("MATRIX_BROADER") && m.includes("ac1-1-indices-and-notation"))).toBe(
      true,
    );
    expect(isReportReconciliationClean(reconciliation)).toBe(false);
  });

  it("[F, tamper] a key listed under the wrong matrixComparison state in the human report is mechanically caught", () => {
    const report = buildReport();
    // Move ac2-2-ac-quantity-calculation-depth-ceiling (really SAME) into the MATRIX_BROADER line, exactly CC-17's own original defect.
    const markdown = readFileSync(CC17_MD_PATH, "utf-8").replace(
      "**MATRIX_BROADER (6 rows):** `ac1-1-indices-and-notation`,",
      "**MATRIX_BROADER (7 rows):** `ac2-2-ac-quantity-calculation-depth-ceiling`, `ac1-1-indices-and-notation`,",
    );
    const reconciliation = reconcileReportAgainstMarkdown(report, markdown);
    expect(reconciliation.keysWithWrongState.some((m) => m.includes("ac2-2-ac-quantity-calculation-depth-ceiling"))).toBe(true);
    expect(isReportReconciliationClean(reconciliation)).toBe(false);
  });

  it("[G] the CC-16 live proposition count is reported as 56 in CC-17/CC-17A source prose, never 55", () => {
    const validatorSource = readFileSync(path.resolve(import.meta.dirname, "validate-unit202-blind-calibration-baseline.ts"), "utf-8");
    expect(validatorSource).not.toMatch(/CC-16's? (own )?55\b/i);
    expect(validatorSource).toMatch(/CC-16's 56 audited/);
    const mdSource = readFileSync(CC17_MD_PATH, "utf-8");
    expect(mdSource).not.toMatch(/\b55\b/);
    // Re-prove directly: the real CC-16 ledger really does have 56 rows.
    expect(unit202QualificationScopeAudit.rows.length).toBe(56);
  });

  it("[H] the JSON and CSV exports still contain the identical 60-key calibrationKey set", () => {
    const jsonPath = path.resolve(import.meta.dirname, "..", "..", "reports", "unit202-calibration", "blind-baseline.json");
    const csvPath = path.resolve(import.meta.dirname, "..", "..", "reports", "unit202-calibration", "blind-baseline.csv");
    const json = JSON.parse(readFileSync(jsonPath, "utf-8")) as { rows: { calibrationKey: string }[] };
    const jsonKeys = json.rows.map((r) => r.calibrationKey).sort();
    const csvLines = readFileSync(csvPath, "utf-8").trim().split("\n");
    const header = csvLines[0]!.split(",");
    const keyIdx = header.indexOf("calibrationKey");
    const csvKeys = csvLines
      .slice(1)
      .map((line) => line.split(",")[keyIdx]!)
      .sort();
    const liveKeys = unit202BlindCalibrationBaseline.rows.map((r) => r.calibrationKey).sort();
    expect(jsonKeys).toEqual(liveKeys);
    expect(csvKeys).toEqual(liveKeys);
    expect(jsonKeys.length).toBe(60);
  });
});

// CC-17B: final integrity correction -- plural-aware private-material
// classification (both the blindness-gate scanner and the claim-type
// summary), a properly-provenanced historical (commit 5d45953) blind-field
// comparison baseline, and one explicitly Project-Architect-authorised
// methodology-record correction. See task letters A-J in the CC-17B
// instruction for the exact checks this block proves.
describe("CC-17B -- calibration export integrity correction", () => {
  /** The ONLY blind-field difference CC-17B authorises relative to commit 5d45953. */
  const AUTHORISED_EXCEPTION = { calibrationKey: "cross-cutting-matrix-vs-baseline-scope-of-analysis", field: "blindBaselineRequirement" };

  const BLIND_FIELDS = [
    "publicSpecificationAnchor",
    "publicRangeAnchor",
    "publicAssessmentAnchor",
    "transferablePrerequisiteJustification",
    "blindBaselineRequirement",
    "blindBaselineDepth",
    "blindBaselineRationale",
    "blindConfidence",
  ] as const;

  function diffAgainstHistoricalSnapshot(): { calibrationKey: string; field: string; historical: unknown; live: unknown }[] {
    const diffs: { calibrationKey: string; field: string; historical: unknown; live: unknown }[] = [];
    for (const row of unit202BlindCalibrationBaseline.rows) {
      const historical = unit202BlindCalibrationBaseline5d45953Snapshot[row.calibrationKey];
      if (!historical) {
        diffs.push({ calibrationKey: row.calibrationKey, field: "(row missing from historical snapshot)", historical: undefined, live: row });
        continue;
      }
      for (const field of BLIND_FIELDS) {
        const liveVal = (row as unknown as Record<string, unknown>)[field];
        const historicalVal = historical[field];
        if (liveVal !== historicalVal) {
          diffs.push({ calibrationKey: row.calibrationKey, field, historical: historicalVal, live: liveVal });
        }
      }
    }
    return diffs;
  }

  it("[A] the historical comparison snapshot is genuinely sourced from commit 5d45953, not the current worktree", () => {
    const snapshotSource = readFileSync(
      path.resolve(import.meta.dirname, "data", "unit202-blind-calibration-baseline-5d45953-snapshot.ts"),
      "utf-8",
    );
    // Full commit hash, short hash, source path and generation method are
    // all recorded in the fixture's own header -- provenance the CC-17A
    // snapshot (generated from the live worktree) never carried.
    expect(snapshotSource).toMatch(/SOURCE COMMIT:\s*5d4595314f17dbadcf8bf971ad0fa522ceb1715c/);
    expect(snapshotSource).toMatch(/SOURCE PATH:\s*scripts\/content\/data\/unit202-blind-calibration-baseline\.ts/);
    expect(snapshotSource).toMatch(/GENERATION METHOD/);
    expect(snapshotSource).toMatch(/git show 5d45953/);
    // Every row present, matching CC-17's own real historical row count.
    expect(Object.keys(unit202BlindCalibrationBaseline5d45953Snapshot).length).toBe(60);
  });

  it("[B, C] every row's blind-baseline-defining field is byte-identical to commit 5d45953, except exactly the one explicitly authorised methodology-record correction", () => {
    const diffs = diffAgainstHistoricalSnapshot();
    const unauthorised = diffs.filter((d) => !(d.calibrationKey === AUTHORISED_EXCEPTION.calibrationKey && d.field === AUTHORISED_EXCEPTION.field));
    expect(unauthorised, `unauthorised historical diffs: ${JSON.stringify(unauthorised, null, 2)}`).toEqual([]);

    // The authorised exception must actually exist (proving the fix was
    // applied), and must actually differ from history (proving this test
    // isn't vacuously passing because nothing changed).
    const authorisedDiff = diffs.find((d) => d.calibrationKey === AUTHORISED_EXCEPTION.calibrationKey && d.field === AUTHORISED_EXCEPTION.field);
    expect(authorisedDiff, "the §4 methodology-record correction was expected but not found").toBeDefined();
    expect(authorisedDiff!.live).not.toBe(authorisedDiff!.historical);

    // The corrected content must state the durable, machine-provable facts
    // (§4 option B) and must NOT still contain the stale, arithmetically-
    // inconsistent hand-count ("45 content rows" / "42 of CC-16").
    const liveText = String(authorisedDiff!.live);
    expect(liveText).toMatch(/60 calibration rows/);
    expect(liveText).toMatch(/CC16_MAPPING/);
    expect(liveText).not.toMatch(/45 content rows/);
    expect(liveText).not.toMatch(/42 of CC-16/);
  });

  it("[B, tamper] a genuinely unauthorised blind-field change would be caught, not silently accepted", () => {
    const tampered = unit202BlindCalibrationBaseline.rows.map((r) =>
      r.calibrationKey === "ac1-1-fractions-percentages" ? { ...r, blindBaselineDepth: "TAMPERED VALUE FOR TEST PURPOSES ONLY" } : r,
    );
    const diffs: string[] = [];
    for (const row of tampered) {
      const historical = unit202BlindCalibrationBaseline5d45953Snapshot[row.calibrationKey];
      if (historical && row.blindBaselineDepth !== historical.blindBaselineDepth) diffs.push(row.calibrationKey);
    }
    expect(diffs).toContain("ac1-1-fractions-percentages");
  });

  it("[D] singular AND plural private-material vocabulary are both rejected when injected into a blind field", () => {
    const forms = [
      "handout", "handouts",
      "worksheet", "worksheets",
      "tutor answer", "tutor answers", "tutor-answer", "tutor-answers",
      "SmartScreen",
      "scheme of work",
      "cgTeachingWorksheetCalibration",
    ];
    for (const form of forms) {
      const tampered = {
        ...unit202BlindCalibrationBaseline,
        rows: unit202BlindCalibrationBaseline.rows.map((r, i) =>
          i === 0 ? { ...r, blindBaselineRationale: `This blind conclusion is confirmed directly by the ${form} content.` } : r,
        ),
      };
      const report = buildReport({ baseline: tampered });
      expect(report.rowsWithPrivateMaterialVocabularyInBlindFields.length, `form "${form}" was not detected`).toBeGreaterThan(0);
      expect(isReportClean(report)).toBe(false);
    }
  });

  it("[D] the real, current ledger produces zero blindness violations under the corrected (plural-aware) patterns", () => {
    const report = buildReport();
    expect(report.rowsWithPrivateMaterialVocabularyInBlindFields).toEqual([]);
    for (const row of unit202BlindCalibrationBaseline.rows) {
      const blindText = [row.blindBaselineRequirement, row.blindBaselineDepth, row.blindBaselineRationale].join(" ");
      for (const pattern of PRIVATE_MATERIAL_VOCABULARY) {
        expect(pattern.test(blindText), `row ${row.calibrationKey} blind* field matched ${pattern}`).toBe(false);
      }
    }
  });

  it("[E, F] the claim-type summary independently reconstructed from the real existingPrivateCalibrationClaim strings agrees with buildReport(), and TUTOR_ANSWER is non-zero because of the real 'tutor answers' claim", () => {
    const report = buildReport();
    const expectedByType: Record<string, number> = { HANDOUT: 0, WORKSHEET: 0, TUTOR_ANSWER: 0, SCHEME_OF_WORK: 0 };
    const expectedKeysWithClaim: string[] = [];
    for (const row of unit202BlindCalibrationBaseline.rows) {
      const claim = row.existingPrivateCalibrationClaim;
      if (!claim) continue;
      expectedKeysWithClaim.push(row.calibrationKey);
      if (/\bhandouts?\b/i.test(claim)) expectedByType.HANDOUT!++;
      if (/\bworksheets?\b/i.test(claim)) expectedByType.WORKSHEET!++;
      if (/\btutor[- ]answers?\b/i.test(claim)) expectedByType.TUTOR_ANSWER!++;
      if (/\bschemes? of work\b/i.test(claim)) expectedByType.SCHEME_OF_WORK!++;
    }
    expect(report.privateCalibrationClaimSummary.byType).toEqual(expectedByType);
    expect(report.privateCalibrationClaimSummary.calibrationKeysWithClaim).toEqual(expectedKeysWithClaim.sort());
    expect(report.privateCalibrationClaimSummary.rowsWithClaim).toBe(expectedKeysWithClaim.length);

    // [F] specifically: the real algebra/transposition claim contains "tutor
    // answers" (plural, no hyphen) and must be the thing driving TUTOR_ANSWER > 0.
    const algebraRow = unit202BlindCalibrationBaseline.rows.find((r) => r.calibrationKey === "ac1-1-algebra-transposition")!;
    expect(algebraRow.existingPrivateCalibrationClaim).toMatch(/tutor answers/i);
    expect(report.privateCalibrationClaimSummary.byType.TUTOR_ANSWER).toBeGreaterThan(0);
  });

  it("[E, tamper] the claim-type classifier is genuinely plural-aware, not merely coincidentally correct on the current data", () => {
    const tampered = {
      ...unit202BlindCalibrationBaseline,
      rows: unit202BlindCalibrationBaseline.rows.map((r, i) =>
        i === 0 ? { ...r, existingPrivateCalibrationClaim: "UNVERIFIED CALIBRATION CLAIM: The repository records Handouts and Worksheets and tutor-answers for this row." } : r,
      ),
    };
    const report = buildReport({ baseline: tampered });
    expect(report.privateCalibrationClaimSummary.byType.HANDOUT).toBeGreaterThan(0);
    expect(report.privateCalibrationClaimSummary.byType.WORKSHEET).toBeGreaterThan(0);
    expect(report.privateCalibrationClaimSummary.byType.TUTOR_ANSWER).toBeGreaterThan(0);
  });

  it("[G] the human-readable report's claim-type counts and calibrationKey list match the live, machine-derived summary exactly", () => {
    const report = buildReport();
    const mdSource = readFileSync(CC17_MD_PATH, "utf-8");
    for (const [type, count] of Object.entries(report.privateCalibrationClaimSummary.byType)) {
      const pattern = new RegExp(`\\*\\*${type}:\\*\\*\\s*${count}\\b`);
      expect(mdSource, `report does not state "${type}: ${count}" matching live data`).toMatch(pattern);
    }
    expect(mdSource).toMatch(new RegExp(`${report.privateCalibrationClaimSummary.rowsWithClaim} of 60 rows carry`));
    for (const key of report.privateCalibrationClaimSummary.calibrationKeysWithClaim) {
      expect(mdSource, `report's calibration-key list is missing ${key}`).toMatch(new RegExp("`" + key + "`"));
    }
  });

  it("[H] the prior CC-17A telephone claim-isolation tests remain green under the corrected classifier (re-proven directly, not only via the shared [E] test above)", () => {
    const capacitorRow = unit202BlindCalibrationBaseline.rows.find((r) => r.calibrationKey === "ac6-1-telephone-capacitor-role")!;
    expect(capacitorRow.existingPrivateCalibrationClaim).toBeTruthy();
    for (const key of [
      "ac6-1-telephone-resistor-role",
      "ac6-1-telephone-surge-protector-role",
      "ac6-1-telephone-master-vs-extension-distinction",
      "ac6-1-telephone-other-component-detail-check",
    ]) {
      const row = unit202BlindCalibrationBaseline.rows.find((r) => r.calibrationKey === key)!;
      expect(row.existingPrivateCalibrationClaim, `${key} should still carry no private-calibration claim`).toBeUndefined();
    }
  });

  it("[I] matrixComparison report reconciliation remains green after the CC-17B corrections", () => {
    const report = buildReport();
    const markdown = readFileSync(CC17_MD_PATH, "utf-8");
    const reconciliation = reconcileReportAgainstMarkdown(report, markdown);
    expect(isReportReconciliationClean(reconciliation)).toBe(true);
    expect(report.matrixComparisonCounts).toEqual({
      SAME: 44,
      MATRIX_BROADER: 6,
      MATRIX_ONLY_PROPOSITION: 9,
      DIFFERENT_EMPHASIS: 1,
    });
  });

  it("[J] the JSON and CSV exports retain the identical 60-key calibrationKey set after the CC-17B corrections", () => {
    const jsonPath = path.resolve(import.meta.dirname, "..", "..", "reports", "unit202-calibration", "blind-baseline.json");
    const csvPath = path.resolve(import.meta.dirname, "..", "..", "reports", "unit202-calibration", "blind-baseline.csv");
    const json = JSON.parse(readFileSync(jsonPath, "utf-8")) as { rows: { calibrationKey: string; blindBaselineRequirement: string }[] };
    const jsonKeys = json.rows.map((r) => r.calibrationKey).sort();
    const csvKeys = readFileSync(csvPath, "utf-8")
      .trim()
      .split("\n")
      .slice(1)
      .map((line) => line.split(",")[0]!)
      .sort();
    const liveKeys = unit202BlindCalibrationBaseline.rows.map((r) => r.calibrationKey).sort();
    expect(jsonKeys).toEqual(liveKeys);
    expect(csvKeys).toEqual(liveKeys);
    expect(jsonKeys.length).toBe(60);
    // The export must also carry the corrected methodology-row text, not a stale cached copy from before §4's fix.
    const methodologyRow = json.rows.find((r) => r.calibrationKey === "cross-cutting-matrix-vs-baseline-scope-of-analysis")!;
    expect(methodologyRow.blindBaselineRequirement).toMatch(/60 calibration rows/);
    expect(methodologyRow.blindBaselineRequirement).not.toMatch(/45 content rows/);
  });
});
