import { describe, expect, it } from "vitest";

import { blindCalibrationBaselineSchema, blindConfidenceSchema, matrixComparisonSchema } from "@alp/content-schema";

import { unit202DepthPerformanceMatrix } from "./data/unit202-depth-performance-matrix.ts";
import { unit202QualificationScopeAudit } from "./data/unit202-qualification-scope-audit.ts";
import { unit202BlindCalibrationBaseline } from "./data/unit202-blind-calibration-baseline.ts";
import {
  buildReport,
  CC16_MAPPING,
  PRIVATE_MATERIAL_VOCABULARY,
  isReportClean,
} from "./validate-unit202-blind-calibration-baseline.ts";

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
