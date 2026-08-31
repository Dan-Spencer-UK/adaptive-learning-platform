import { describe, expect, it } from "vitest";

import { qualificationScopeAuditSchema, scopeRiskFlagSchema, curriculumEvidenceStrengthSchema } from "@alp/content-schema";

import { unit202DepthPerformanceMatrix } from "./data/unit202-depth-performance-matrix.ts";
import { unit202QualificationScopeAudit } from "./data/unit202-qualification-scope-audit.ts";
import { buildReport, FORBIDDEN_VERDICT_PATTERNS, isReportClean } from "./validate-unit202-qualification-scope-audit.ts";

// CC-16: proves the REAL Unit 202 Qualification-Scope Provenance Audit
// ledger is loadable, valid, and mechanically consistent with the real,
// governed Depth & Performance Matrix it audits.
describe("CC-16 Unit 202 Qualification-Scope Provenance Audit -- real-instance validation", () => {
  it("REAL-CORPUS-ADOPTED: the real audit ledger parses against qualificationScopeAuditSchema without modification", () => {
    expect(() => qualificationScopeAuditSchema.parse(unit202QualificationScopeAudit)).not.toThrow();
  });

  it("PRODUCTION-LOADABLE: the real audit report is entirely clean", () => {
    const report = buildReport();
    expect(isReportClean(report)).toBe(true);
  });

  it("every one of the matrix's real 23 ACs has at least one ledger row", () => {
    const report = buildReport();
    expect(report.acsInMatrix).toBe(23);
    expect(report.acsAudited).toBe(23);
    expect(report.acsNotAudited).toEqual([]);
  });

  it("every one of the matrix's real 58 Range-item treatments has at least one ledger row", () => {
    const report = buildReport();
    expect(report.rangeItemsInMatrix).toBe(58);
    expect(report.rangeItemsAudited).toBe(58);
    expect(report.rangeItemsNotAudited).toEqual([]);
  });

  it("no ledger row references an AC or Range item that does not exist in the real matrix", () => {
    const report = buildReport();
    expect(report.rowsReferencingUnknownAc).toEqual([]);
    expect(report.rowsReferencingUnknownRangeItem).toEqual([]);
  });

  it("has no duplicate propositionKeys", () => {
    const keys = unit202QualificationScopeAudit.rows.map((r) => r.propositionKey);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("every scopeRiskFlags entry is a real member of the governed enum", () => {
    for (const row of unit202QualificationScopeAudit.rows) {
      for (const flag of row.scopeRiskFlags) {
        expect(() => scopeRiskFlagSchema.parse(flag)).not.toThrow();
      }
    }
  });

  it("every evidenceStrength value is a real member of the governed enum", () => {
    for (const row of unit202QualificationScopeAudit.rows) {
      expect(() => curriculumEvidenceStrengthSchema.parse(row.evidenceStrength)).not.toThrow();
    }
  });

  it("NO-DECISIONS BOUNDARY: no ledger row's notes field contains forbidden final-scope-verdict language", () => {
    const report = buildReport();
    expect(report.rowsWithForbiddenVerdictLanguage).toEqual([]);
    // Re-prove directly against the real data, not just via the report's own logic.
    for (const row of unit202QualificationScopeAudit.rows) {
      for (const pattern of FORBIDDEN_VERDICT_PATTERNS) {
        expect(pattern.test(row.notes)).toBe(false);
      }
    }
  });

  it("NO-DECISIONS BOUNDARY (structural): no field name on a real, schema-validated row is capable of carrying a final scope classification", () => {
    // Structural proof, not just a data-content check: every KEY actually
    // present on the parsed, schema-validated row shape is checked, not
    // merely today's row content -- a future field addition with a
    // forbidden name would fail this test even before any row used it.
    const parsed = qualificationScopeAuditSchema.parse(unit202QualificationScopeAudit);
    const fieldNames = new Set<string>();
    for (const row of parsed.rows) {
      for (const key of Object.keys(row)) fieldNames.add(key);
    }
    const forbiddenFieldNamePatterns = [/decision/i, /classification/i, /verdict/i, /finalScope/i, /required_qualification/i];
    for (const name of fieldNames) {
      for (const pattern of forbiddenFieldNamePatterns) {
        expect(pattern.test(name)).toBe(false);
      }
    }
  });

  it("every row's currentKnowledgeObligationKeys/currentAssertionKeys are diagnostic arrays only (may be omitted, never used to justify A-F support fields)", () => {
    // This test cannot mechanically prove "never used to justify" (a
    // semantic property of the notes prose, reviewed manually in the
    // evidence report) -- it proves the weaker, still-useful structural
    // fact that these fields are independent of explicitSpecSupport/
    // explicitRangeSupport, i.e. a row can have obligation/assertion keys
    // while still recording NO_RANGE_ITEM/NOT_IN_AC_TEXT, proving the
    // schema does not conflate the two.
    const rowsWithDiagnosticKeysButNoRangeAnchor = unit202QualificationScopeAudit.rows.filter(
      (r) =>
        ((r.currentKnowledgeObligationKeys?.length ?? 0) > 0 || (r.currentAssertionKeys?.length ?? 0) > 0) &&
        (r.explicitRangeSupport === "NO_RANGE_ITEM" || r.explicitSpecSupport === "NOT_IN_AC_TEXT"),
    );
    expect(rowsWithDiagnosticKeysButNoRangeAnchor.length).toBeGreaterThan(0);
  });

  it("the mandated telephone exemplar trace covers all six required items (task section 10)", () => {
    const telephoneRows = unit202QualificationScopeAudit.rows.filter(
      (r) => r.acNumber === "6.1" && r.rangeItems?.includes("Telephones"),
    );
    // category, capacitor, resistor, surge-protector, master-vs-extension, other-detail-check
    expect(telephoneRows.length).toBeGreaterThanOrEqual(6);
    const keys = telephoneRows.map((r) => r.propositionKey);
    expect(keys).toContain("ac6-1-telephone-category");
    expect(keys).toContain("ac6-1-telephone-capacitor-role");
    expect(keys).toContain("ac6-1-telephone-resistor-role");
    expect(keys).toContain("ac6-1-telephone-surge-protector-role");
    expect(keys).toContain("ac6-1-telephone-master-vs-extension-distinction");
    expect(keys).toContain("ac6-1-telephone-other-detail-check");
  });

  it("the mandated security-alarm exemplar trace is present and traces the exact transistor+thyristor topology separately from the Range category", () => {
    const rows = unit202QualificationScopeAudit.rows.filter((r) => r.propositionKey.startsWith("ac6-1-security-alarm"));
    expect(rows.length).toBeGreaterThanOrEqual(2);
    const categoryRow = rows.find((r) => r.propositionKey === "ac6-1-security-alarm-category");
    const topologyRow = rows.find((r) => r.propositionKey === "ac6-1-security-alarm-transistor-thyristor-topology");
    expect(categoryRow?.explicitRangeSupport).toBe("EXPLICIT_RANGE_ITEM_DIRECT");
    expect(topologyRow?.scopeRiskFlags.length).toBeGreaterThan(0);
  });

  it("compound propositions record per-clause evidence rather than one bundled claim (task section 13) -- the four telephone master-socket clauses each carry independent evidence assessments", () => {
    const capacitorRow = unit202QualificationScopeAudit.rows.find((r) => r.propositionKey === "ac6-1-telephone-capacitor-role")!;
    const resistorRow = unit202QualificationScopeAudit.rows.find((r) => r.propositionKey === "ac6-1-telephone-resistor-role")!;
    const surgeProtectorRow = unit202QualificationScopeAudit.rows.find((r) => r.propositionKey === "ac6-1-telephone-surge-protector-role")!;
    // The capacitor clause has a specific worksheet claim the other two do not -- proving these are NOT identically bundled.
    expect(capacitorRow.worksheetSupport).toBe("MATRIX_CLAIMS_SPECIFIC_PERFORMANCE");
    expect(resistorRow.worksheetSupport).toBe("NO_CLAIM_IN_MATRIX");
    expect(surgeProtectorRow.worksheetSupport).toBe("NO_CLAIM_IN_MATRIX");
    expect(capacitorRow.evidenceStrength).not.toBe(surgeProtectorRow.evidenceStrength);
  });
});

describe("CC-16 Unit 202 Qualification-Scope Provenance Audit -- tamper-and-assert regressions", () => {
  it("SCHEMA-CAPABLE: a duplicate propositionKey is rejected at the schema layer", () => {
    const tampered = {
      ...unit202QualificationScopeAudit,
      rows: [...unit202QualificationScopeAudit.rows, { ...unit202QualificationScopeAudit.rows[0]! }],
    };
    expect(() => qualificationScopeAuditSchema.parse(tampered)).toThrow(/duplicate propositionKey/);
  });

  it("SCHEMA-CAPABLE: an invalid acNumber format is rejected at the schema layer", () => {
    const tampered = {
      ...unit202QualificationScopeAudit,
      rows: unit202QualificationScopeAudit.rows.map((r, i) => (i === 0 ? { ...r, acNumber: "not-an-ac-number" } : r)),
    };
    expect(() => qualificationScopeAuditSchema.parse(tampered)).toThrow();
  });

  it("SCHEMA-CAPABLE: an unknown scopeRiskFlags value is rejected at the schema layer", () => {
    const tampered = {
      ...unit202QualificationScopeAudit,
      rows: unit202QualificationScopeAudit.rows.map((r, i) => (i === 0 ? { ...r, scopeRiskFlags: ["NOT_A_REAL_FLAG" as never] } : r)),
    };
    expect(() => qualificationScopeAuditSchema.parse(tampered)).toThrow();
  });

  it("SCHEMA-CAPABLE: an unknown evidenceStrength value is rejected at the schema layer", () => {
    const tampered = {
      ...unit202QualificationScopeAudit,
      rows: unit202QualificationScopeAudit.rows.map((r, i) => (i === 0 ? { ...r, evidenceStrength: "REQUIRED_QUALIFICATION_KNOWLEDGE" as never } : r)),
    };
    expect(() => qualificationScopeAuditSchema.parse(tampered)).toThrow();
  });

  it("introducing a row that references a real-looking but non-existent AC number is caught, never silently accepted", () => {
    const tampered = {
      ...unit202QualificationScopeAudit,
      rows: [
        ...unit202QualificationScopeAudit.rows,
        {
          propositionKey: "invented-ac-test-row",
          acNumber: "9.9",
          matrixRequirementText: "does not exist",
          requirementType: "FACTUAL_PROPOSITION" as const,
          explicitSpecSupport: "AC_TEXT_DIRECT" as const,
          explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST" as const,
          handoutSupport: "NO_CLAIM_IN_MATRIX" as const,
          worksheetSupport: "NO_CLAIM_IN_MATRIX" as const,
          tutorAnswerSupport: "NO_CLAIM_IN_MATRIX" as const,
          sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX" as const,
          evidenceStrength: "NO_AC_OR_RANGE_ANCHOR_LOCATED" as const,
          scopeRiskFlags: [],
          notes: "adversarial test row referencing a fabricated AC number",
        },
      ],
    };
    const report = buildReport({ audit: tampered });
    expect(report.rowsReferencingUnknownAc.length).toBeGreaterThan(0);
    expect(isReportClean(report)).toBe(false);
  });

  it("introducing a row that references a real AC but a fabricated Range item is caught, never silently accepted", () => {
    const tampered = {
      ...unit202QualificationScopeAudit,
      rows: [
        ...unit202QualificationScopeAudit.rows,
        {
          propositionKey: "invented-range-item-test-row",
          acNumber: "1.1",
          rangeItems: ["A Range Item That Does Not Exist"],
          matrixRequirementText: "does not exist",
          requirementType: "FACTUAL_PROPOSITION" as const,
          explicitSpecSupport: "AC_TEXT_DIRECT" as const,
          explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT" as const,
          handoutSupport: "NO_CLAIM_IN_MATRIX" as const,
          worksheetSupport: "NO_CLAIM_IN_MATRIX" as const,
          tutorAnswerSupport: "NO_CLAIM_IN_MATRIX" as const,
          sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX" as const,
          evidenceStrength: "RANGE_ANCHORED_NO_DEPTH_EVIDENCE_LOCATED" as const,
          scopeRiskFlags: [],
          notes: "adversarial test row referencing a fabricated Range item",
        },
      ],
    };
    const report = buildReport({ audit: tampered });
    expect(report.rowsReferencingUnknownRangeItem.length).toBeGreaterThan(0);
    expect(isReportClean(report)).toBe(false);
  });

  it("an AC silently dropped from the ledger is caught as not-audited, never silently accepted as complete", () => {
    const tampered = {
      ...unit202QualificationScopeAudit,
      rows: unit202QualificationScopeAudit.rows.filter((r) => r.acNumber !== "3.1"),
    };
    const report = buildReport({ audit: tampered });
    expect(report.acsNotAudited).toContain("3.1");
    expect(isReportClean(report)).toBe(false);
  });

  it("a Range item silently dropped from every ledger row is caught as not-audited, never silently accepted as complete", () => {
    // Must strip "Telephones" from EVERY row that names it (there are
    // several, by design -- the mandated exemplar trace), not just one,
    // otherwise the Range item remains legitimately covered by its siblings.
    const tampered = {
      ...unit202QualificationScopeAudit,
      rows: unit202QualificationScopeAudit.rows.map((r) => {
        if (!r.rangeItems?.includes("Telephones")) return r;
        const remaining = r.rangeItems.filter((item) => item !== "Telephones");
        // rangeItems schema requires >=1 when present -- omit the field
        // entirely rather than produce a schema-invalid empty array.
        return remaining.length > 0 ? { ...r, rangeItems: remaining } : { ...r, rangeItems: undefined };
      }),
    };
    const report = buildReport({ audit: tampered });
    expect(report.rangeItemsNotAudited).toContain("6.1::Telephones");
    expect(isReportClean(report)).toBe(false);
  });

  it("NO-DECISIONS BOUNDARY: forbidden verdict language injected into a row's notes is mechanically caught", () => {
    const tampered = {
      ...unit202QualificationScopeAudit,
      rows: unit202QualificationScopeAudit.rows.map((r, i) =>
        i === 0 ? { ...r, notes: "This proposition is REQUIRED_QUALIFICATION_KNOWLEDGE and should be retained." } : r,
      ),
    };
    const report = buildReport({ audit: tampered });
    expect(report.rowsWithForbiddenVerdictLanguage.length).toBeGreaterThan(0);
    expect(isReportClean(report)).toBe(false);
  });

  it("NO-DECISIONS BOUNDARY: 'out of scope' language injected into a row's notes is mechanically caught", () => {
    const tampered = {
      ...unit202QualificationScopeAudit,
      rows: unit202QualificationScopeAudit.rows.map((r, i) =>
        i === 1 ? { ...r, notes: "This detail is out of scope and must be removed." } : r,
      ),
    };
    const report = buildReport({ audit: tampered });
    expect(report.rowsWithForbiddenVerdictLanguage.length).toBeGreaterThan(0);
  });
});

describe("CC-16 Unit 202 Qualification-Scope Provenance Audit -- matrix cross-reference sanity", () => {
  it("the matrix's own AC3.2 officialRangeCoverage genuinely contains no gear/pulley Range item (the structural finding this audit's ac3-2-gears-and-pulleys-no-range-item row depends on)", () => {
    const ac32Items = unit202DepthPerformanceMatrix.officialRangeCoverage.filter((r) => r.acNumber === "3.2").map((r) => r.rangeItem);
    expect(ac32Items.sort()).toEqual(["Class I", "Class II", "Class III"]);
    expect(ac32Items.some((i) => /gear|pulley/i.test(i))).toBe(false);
  });
});
