import { describe, expect, it } from "vitest";
import { buildReport, isReportClean } from "./report-coverage-matrix.ts";
import { CV_KEY_R2, cc04Unit202ElectricalScience } from "./data/cc04-unit202-electrical-science.ts";
import { unit202AssessmentSpecification } from "./data/unit202-assessment-specification.ts";

describe("report-coverage-matrix: structural gates against the real corpus", () => {
  it("the real CV_KEY_R2 curriculum structure has zero structural defects", () => {
    const report = buildReport();
    expect(report.structuralDefects).toEqual([]);
    expect(isReportClean(report)).toBe(true);
  });

  it("the real CV_KEY_R2 structure has exactly the official 6 LOs / 23 ACs / 58 Range items", () => {
    const report = buildReport();
    expect(report.totals.loCount).toBe(6);
    expect(report.totals.acCount).toBe(23);
    expect(report.totals.rangeItemCount).toBe(58);
  });

  it("every real Assessment Criterion appears exactly once in acCoverage, and every real Range item is attributed to some AC", () => {
    const report = buildReport();
    expect(report.acCoverage).toHaveLength(23);
    const totalRangeAcrossAcs = report.acCoverage.reduce((sum, ac) => sum + ac.rangeItemsTotal, 0);
    expect(totalRangeAcrossAcs).toBe(58);
  });

  it("LO readiness rows are keyed 1..6 and each carries the official question allocation", () => {
    const report = buildReport();
    expect(report.loReadiness.map((lo) => lo.number)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(report.loReadiness.map((lo) => lo.officialQuestionCount)).toEqual([2, 5, 7, 15, 7, 4]);
  });

  it("ACCEPTANCE: a deliberate LO-count mismatch fails mechanically", () => {
    // Removing an entire LO subtree (not just the LO node itself) so the
    // fixture still satisfies knowledgeGraphManifestSchema's own
    // referential-integrity check (no node may reference a deleted
    // parent) -- this test isolates report-coverage-matrix.ts's own
    // "exactly 6 LOs" structural gate, not the base schema's.
    const lo6 = cc04Unit202ElectricalScience.curriculumNodes.find((n) => n.curriculumVersionKey === CV_KEY_R2 && n.code === "202-LO6");
    const ac6Keys = new Set(
      cc04Unit202ElectricalScience.curriculumNodes.filter((n) => n.parentKey === lo6!.key).map((n) => n.key),
    );
    const tampered = {
      ...cc04Unit202ElectricalScience,
      curriculumNodes: cc04Unit202ElectricalScience.curriculumNodes.filter(
        (n) => n.key !== lo6!.key && !ac6Keys.has(n.key) && !(n.parentKey && ac6Keys.has(n.parentKey)),
      ),
    };
    const report = buildReport({ curriculum: tampered });
    expect(report.structuralDefects.some((d) => d.includes("LEARNING_OUTCOME"))).toBe(true);
    expect(isReportClean(report)).toBe(false);
  });

  it("ACCEPTANCE: a Range item reparented onto a Learning Outcome (skipping its Assessment Criterion) fails mechanically", () => {
    const [firstLo] = cc04Unit202ElectricalScience.curriculumNodes.filter(
      (n) => n.curriculumVersionKey === CV_KEY_R2 && n.nodeType === "LEARNING_OUTCOME",
    );
    const tampered = {
      ...cc04Unit202ElectricalScience,
      curriculumNodes: cc04Unit202ElectricalScience.curriculumNodes.map((n) =>
        n.curriculumVersionKey === CV_KEY_R2 && n.nodeType === "RANGE_ITEM" ? { ...n, parentKey: firstLo!.key } : n,
      ),
    };
    const report = buildReport({ curriculum: tampered });
    expect(report.structuralDefects.some((d) => d.includes("RANGE_ITEM"))).toBe(true);
    expect(isReportClean(report)).toBe(false);
  });

  it("ACCEPTANCE: an AssessmentSpecification referencing an unknown Learning Outcome node fails mechanically", () => {
    const [spec] = unit202AssessmentSpecification.specifications;
    const tampered = {
      specifications: [
        {
          ...spec!,
          outcomeAllocations: [...spec!.outcomeAllocations.slice(1), { ...spec!.outcomeAllocations[0]!, learningOutcomeNodeKey: "node-does-not-exist" }],
        },
      ],
    };
    const report = buildReport({ assessmentSpecification: tampered });
    expect(report.structuralDefects.some((d) => d.includes("node-does-not-exist"))).toBe(true);
    expect(isReportClean(report)).toBe(false);
  });

  it("coverage gaps in the real corpus (the expected CC-09A backlog) never fail --check", () => {
    // AC3.1/AC3.2/AC6.1/AC6.2 genuinely have no assertion authored yet
    // (see CV_KEY_R2's own header comment) -- this is the exact backlog
    // the report exists to expose, and must never be treated as a
    // structural defect.
    const report = buildReport();
    const uncovered = report.acCoverage.filter((ac) => ac.tier === "NONE");
    expect(uncovered.length).toBeGreaterThan(0);
    expect(isReportClean(report)).toBe(true);
  });
});
