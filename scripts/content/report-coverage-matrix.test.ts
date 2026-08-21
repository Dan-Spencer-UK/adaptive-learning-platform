import { describe, expect, it } from "vitest";
import { buildReport, isReportClean } from "./report-coverage-matrix.ts";
import { CV_KEY_R2, cc04Unit202ElectricalScience } from "./data/cc04-unit202-electrical-science.ts";
import { AC_OBLIGATIONS } from "./data/unit202-knowledge-obligations.ts";
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

  it("CC-09B target: every AC has knowledge (assertion) coverage and every Range item is covered (58/58) -- lesson/blueprint coverage may still be incomplete", () => {
    const report = buildReport();
    expect(report.totals.acWithNoCoverage).toBe(0);
    expect(report.totals.rangeItemsCovered).toBe(58);
    expect(report.acCoverage.every((ac) => ac.tier !== "NONE")).toBe(true);
    expect(report.acCoverage.every((ac) => ac.rangeItemsCovered === ac.rangeItemsTotal)).toBe(true);
  });

  it("ACCEPTANCE: a deliberate LO-count mismatch fails mechanically", () => {
    // Removing an entire LO subtree (not just the LO node itself) so the
    // fixture still satisfies knowledgeGraphManifestSchema's own
    // referential-integrity check (no node may reference a deleted
    // parent) -- this test isolates report-coverage-matrix.ts's own
    // "exactly 6 LOs" structural gate, not the base schema's. CC-09B: LO6
    // now has real assertions mapped down to its Range items, so removed
    // node keys must also be scrubbed from assertionCurriculumMappings,
    // or the base schema's own dangling-mapping check fires instead of
    // (and masking) the gate this test means to isolate.
    const lo6 = cc04Unit202ElectricalScience.curriculumNodes.find((n) => n.curriculumVersionKey === CV_KEY_R2 && n.code === "202-LO6");
    const ac6Keys = new Set(
      cc04Unit202ElectricalScience.curriculumNodes.filter((n) => n.parentKey === lo6!.key).map((n) => n.key),
    );
    const rangeItem6Keys = new Set(
      cc04Unit202ElectricalScience.curriculumNodes.filter((n) => n.parentKey && ac6Keys.has(n.parentKey)).map((n) => n.key),
    );
    const removedKeys = new Set([lo6!.key, ...ac6Keys, ...rangeItem6Keys]);
    const tampered = {
      ...cc04Unit202ElectricalScience,
      curriculumNodes: cc04Unit202ElectricalScience.curriculumNodes.filter((n) => !removedKeys.has(n.key)),
      assertionCurriculumMappings: cc04Unit202ElectricalScience.assertionCurriculumMappings.filter(
        (m) => !removedKeys.has(m.curriculumNodeKey),
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

  it("coverage gaps in the real corpus (the expected CC-09B lesson/blueprint backlog) never fail --check", () => {
    // CC-09B closed the CC-09A knowledge-corpus gap (every AC/Range item
    // now has real assertion coverage -- see the "23/23 ACs" and
    // "58/58 Range items" tests above), but lesson and question-blueprint
    // coverage remains genuinely incomplete (task brief section 33: "may
    // remain incomplete" for this knowledge-only package) -- not every AC
    // has reached the ASSESSABLE tier. This is the exact backlog the
    // report exists to expose, and must never be treated as a structural
    // defect.
    const report = buildReport();
    const notYetAssessable = report.acCoverage.filter((ac) => ac.tier !== "ASSESSABLE");
    expect(notYetAssessable.length).toBeGreaterThan(0);
    expect(report.acCoverage.every((ac) => ac.tier !== "NONE")).toBe(true);
    expect(isReportClean(report)).toBe(true);
  });
});

describe("report-coverage-matrix: CC-09B.1 semantic completeness (never inferred from referential coverage alone)", () => {
  it("the real corpus is semantically complete for all 23 ACs and 58 Range items, and every obligation resolves to a real assertion", () => {
    const report = buildReport();
    expect(report.totals.acSemanticComplete).toBe(23);
    expect(report.totals.rangeItemsSemanticComplete).toBe(58);
    expect(report.acSemantic.every((s) => s.obligationsDeclared)).toBe(true);
    expect(report.acSemantic.every((s) => s.status === "COMPLETE_PENDING_VERIFICATION")).toBe(true);
    expect(report.acSemantic.flatMap((s) => s.unresolvedObligationIds)).toEqual([]);
  });

  it("the real corpus has zero direct factual-provenance defects: no unsupported assertions, no syllabus-only technical assertions, no mismatched locators, no unresolved DERIVED_FROM targets", () => {
    const report = buildReport();
    expect(report.provenanceAudit.noProvenance).toEqual([]);
    expect(report.provenanceAudit.syllabusOnlyTechnical).toEqual([]);
    expect(report.provenanceAudit.mismatchedLocators).toEqual([]);
    expect(report.provenanceAudit.unresolvedDerivations).toEqual([]);
  });

  it("an AC with no declared knowledge-obligation set is INCOMPLETE by definition, never silently read as complete", () => {
    const withoutAc31 = AC_OBLIGATIONS.filter((set) => set.acNumber !== "3.1");
    const report = buildReport({ obligations: withoutAc31 });
    const ac31 = report.acSemantic.find((s) => s.acNumber === "3.1");
    expect(ac31?.obligationsDeclared).toBe(false);
    expect(ac31?.status).toBe("INCOMPLETE");
    expect(report.totals.acSemanticComplete).toBe(22);
    // Absence of a declaration is never a structural defect, and never fails --check.
    expect(isReportClean(report)).toBe(true);
  });

  it("REGRESSION (task section 26): an AC requiring 'levers, gears and pulleys' cannot be declared semantically complete if the governed knowledge contains only lever obligations", () => {
    const leversOnly = AC_OBLIGATIONS.map((set) =>
      set.acNumber === "3.2"
        ? { ...set, obligations: set.obligations.filter((o) => o.id === "lever-principle-and-classes") }
        : set,
    );
    const report = buildReport({ obligations: leversOnly });
    const ac32 = report.acSemantic.find((s) => s.acNumber === "3.2");
    // Levers alone still satisfy every obligation THIS tampered set declares
    // (it no longer asks for gears/pulleys at all) -- the point of this
    // regression is different and stronger: it proves the real, untampered
    // AC_OBLIGATIONS data actually asks for gears and pulleys as separate,
    // independently-tracked obligations, so a corpus containing only lever
    // assertions could never satisfy the REAL declaration.
    expect(ac32?.status).toBe("COMPLETE_PENDING_VERIFICATION");
    const realAc32 = AC_OBLIGATIONS.find((set) => set.acNumber === "3.2")!;
    const realObligationIds = realAc32.obligations.map((o) => o.id);
    expect(realObligationIds).toContain("lever-principle-and-classes");
    expect(realObligationIds).toContain("gears");
    expect(realObligationIds).toContain("pulleys");
    // And, decisively: if the real corpus's gear/pulley assertions were
    // hypothetically absent, the real (untampered) obligation set would
    // correctly report AC3.2 as INCOMPLETE, not complete.
    const missingGearPulleyAssertions = new Set([
      "FP-CONCEPT-GEAR-001", "FP-REL-GEAR-RATIO-001", "FP-GEAR-SPEED-TORQUE-TRADEOFF-001",
      "FP-CONCEPT-PULLEY-001", "FP-PULLEY-FIXED-VS-MOVABLE-001", "FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001",
    ]);
    const tamperedCorpus = {
      ...cc04Unit202ElectricalScience,
      assertions: cc04Unit202ElectricalScience.assertions.filter((a) => !missingGearPulleyAssertions.has(a.identifier)),
      assertionVersions: cc04Unit202ElectricalScience.assertionVersions.filter((v) => !missingGearPulleyAssertions.has(v.assertionIdentifier)),
      assertionCurriculumMappings: cc04Unit202ElectricalScience.assertionCurriculumMappings.filter((m) => !missingGearPulleyAssertions.has(m.assertionIdentifier)),
      assertionProvenanceLinks: cc04Unit202ElectricalScience.assertionProvenanceLinks.filter((p) => !missingGearPulleyAssertions.has(p.assertionIdentifier)),
      assertionRelationships: cc04Unit202ElectricalScience.assertionRelationships.filter(
        (r) => !missingGearPulleyAssertions.has(r.fromIdentifier) && !missingGearPulleyAssertions.has(r.toIdentifier),
      ),
    };
    const leversOnlyReport = buildReport({ curriculum: tamperedCorpus });
    const leversOnlyAc32 = leversOnlyReport.acSemantic.find((s) => s.acNumber === "3.2");
    expect(leversOnlyAc32?.status).toBe("INCOMPLETE");
    expect(leversOnlyAc32?.obligations.find((o) => o.id === "lever-principle-and-classes")?.satisfied).toBe(true);
    expect(leversOnlyAc32?.obligations.find((o) => o.id === "gears")?.satisfied).toBe(false);
    expect(leversOnlyAc32?.obligations.find((o) => o.id === "pulleys")?.satisfied).toBe(false);
  });

  it("REGRESSION (task section 26): a curriculum node's technical assertion citing only City & Guilds syllabus provenance fails the direct-factual-provenance audit", () => {
    const [target] = cc04Unit202ElectricalScience.assertions.filter((a) => a.identifier === "EL-OHM-SOLVE-I-001");
    expect(target).toBeDefined();
    const tampered = {
      ...cc04Unit202ElectricalScience,
      // Strip every non-curriculum provenance link AND every DERIVED_FROM
      // relationship from the target assertion, so its only remaining
      // grounding is the City & Guilds CURRICULUM_REQUIRES citation --
      // exactly the CC-09B false-green defect class this audit exists to
      // catch mechanically.
      assertionProvenanceLinks: cc04Unit202ElectricalScience.assertionProvenanceLinks.filter(
        (p) => p.assertionIdentifier !== "EL-OHM-SOLVE-I-001" || p.provenanceRole === "CURRICULUM_REQUIRES",
      ),
      assertionRelationships: cc04Unit202ElectricalScience.assertionRelationships.filter(
        (r) => !(r.fromIdentifier === "EL-OHM-SOLVE-I-001" && r.relationshipType === "DERIVED_FROM"),
      ),
    };
    const report = buildReport({ curriculum: tampered });
    expect(report.provenanceAudit.syllabusOnlyTechnical).toContain("EL-OHM-SOLVE-I-001");
    // Deliberately never a --check failure -- this is a real backlog item
    // this audit surfaces, not a structural bug in the report itself.
    expect(isReportClean(report)).toBe(true);
  });
});
