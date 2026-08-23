import { describe, expect, it } from "vitest";
import { pedagogyManifestSchema } from "@alp/content-schema";
import { buildReport, isReportClean } from "./report-coverage-matrix.ts";
import { CV_KEY_R2, cc04Unit202ElectricalScience } from "./data/cc04-unit202-electrical-science.ts";
import { AC_OBLIGATIONS } from "./data/unit202-knowledge-obligations.ts";
import { unit202AssessmentSpecification } from "./data/unit202-assessment-specification.ts";
import { cc05aPedagogyUnit202 } from "./data/cc05a-pedagogy-unit202.ts";

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

  it("CC-11: every AC has now reached the ASSESSABLE tier -- the lesson/question-blueprint backlog this report existed to expose (CC-09B through CC-10) is closed", () => {
    // CC-09B closed the CC-09A knowledge-corpus gap (every AC/Range item
    // has real assertion coverage), but lesson and question-blueprint
    // coverage remained genuinely incomplete through CC-10 (LO3 partial,
    // LO5/LO6 entirely deferred) -- not every AC had reached the
    // ASSESSABLE tier. CC-11 completed LO3's remainder plus all of LO5
    // and LO6, closing that exact backlog. A regression here (an AC
    // slipping back below ASSESSABLE) is now a real structural finding,
    // not an expected, tracked gap.
    const report = buildReport();
    const notYetAssessable = report.acCoverage.filter((ac) => ac.tier !== "ASSESSABLE");
    expect(notYetAssessable.length).toBe(0);
    expect(report.acCoverage.every((ac) => ac.tier !== "NONE")).toBe(true);
    expect(isReportClean(report)).toBe(true);
  });
});

describe("report-coverage-matrix: CC-09B.1 semantic completeness (never inferred from referential coverage alone)", () => {
  it("the real corpus is semantically complete for all 23 ACs and 58 Range items -- CC-09B.3 closed AC6.1's telephone/wireless-control evidence gaps", () => {
    // CC-09B.2 deliberately narrowed EL-APPLICATION-TELEPHONE-001 and
    // EL-APPLICATION-WIRELESS-CONTROL-001 and left AC6.1 honestly
    // INCOMPLETE (22/23) after failing to find adequate application-
    // specific evidence. CC-09B.3 found genuine first-party manufacturer
    // sources for both (Skyworks AN347 DAA design guide; Holtek HT12D/
    // HT12F decoder datasheet) and re-closed the gap -- this 23/23 is
    // real, source-first-audited coverage, not a reversion to CC-09B.1's
    // false-green result.
    const report = buildReport();
    expect(report.totals.acSemanticComplete).toBe(23);
    expect(report.totals.rangeItemsSemanticComplete).toBe(58);
    const ac61 = report.acSemantic.find((s) => s.acNumber === "6.1");
    expect(ac61?.status).toBe("COMPLETE_PENDING_VERIFICATION");
    expect(ac61?.obligations.filter((o) => !o.satisfied)).toEqual([]);
    expect(report.acSemantic.every((s) => s.obligationsDeclared)).toBe(true);
    expect(report.acSemantic.every((s) => s.status === "COMPLETE_PENDING_VERIFICATION")).toBe(true);
    expect(report.acSemantic.flatMap((s) => s.unresolvedObligationIds)).toEqual([]);
  });

  it("the real corpus has zero unsupported/syllabus-only/mismatched/unresolved-derivation provenance defects", () => {
    const report = buildReport();
    expect(report.provenanceAudit.noProvenance).toEqual([]);
    // CC-09B.3: closed -- both now cite real, direct, application-specific
    // manufacturer evidence (Skyworks AN347; Holtek HT12D/HT12F).
    expect(report.provenanceAudit.syllabusOnlyTechnical).toEqual([]);
    expect(report.provenanceAudit.mismatchedLocators).toEqual([]);
    expect(report.provenanceAudit.unresolvedDerivations).toEqual([]);
    // CC-09B.2: the schema-level superRefine already forces every
    // DERIVED_FROM edge to declare a kind; this proves none of the 34
    // remaining edges are classified EMPIRICAL_APPLICATION/INVALID_UNCLEAR.
    expect(report.provenanceAudit.invalidDerivationKinds).toEqual([]);
    // CC-09B.3 (task section 9): zero assertion-level PARTIALLY_SUPPORTED
    // approved factual assertions -- the three former link-level PARTIAL
    // cases were re-audited and confirmed FULLY_SUPPORTED_MULTI_SOURCE.
    expect(report.provenanceAudit.assertionLevelPartiallySupported).toEqual([]);
  });

  it("an AC with no declared knowledge-obligation set is INCOMPLETE by definition, never silently read as complete", () => {
    const withoutAc31 = AC_OBLIGATIONS.filter((set) => set.acNumber !== "3.1");
    const report = buildReport({ obligations: withoutAc31 });
    const ac31 = report.acSemantic.find((s) => s.acNumber === "3.1");
    expect(ac31?.obligationsDeclared).toBe(false);
    expect(ac31?.status).toBe("INCOMPLETE");
    // Real baseline is 23/23; stripping AC3.1's declaration drops it to 22.
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

describe("report-coverage-matrix: CC-09B.2 source-first entailment (task section 36)", () => {
  it("REGRESSION A/B (application/device-construction inference): an EMPIRICAL_APPLICATION-classified DERIVED_FROM edge never rescues an assertion from syllabus-only-technical, even when its parent is itself well-sourced", () => {
    // Simulates exactly the pre-CC-09B.2 defect pattern this package
    // corrected for real (EL-INSTRUMENT-WATTMETER-001 previously
    // DERIVED_FROM the well-sourced EL-POWER-RELATIONSHIP-001/ammeter/
    // voltmeter assertions) -- proves the fix is structural, not just a
    // one-off content edit that could silently regress.
    const [wattmeter] = cc04Unit202ElectricalScience.assertions.filter((a) => a.identifier === "EL-INSTRUMENT-WATTMETER-001");
    expect(wattmeter).toBeDefined();
    const tampered = {
      ...cc04Unit202ElectricalScience,
      // Strip the wattmeter's real direct provenance (NIST/Indus Uni),
      // leaving only the City & Guilds curriculum citation.
      assertionProvenanceLinks: cc04Unit202ElectricalScience.assertionProvenanceLinks.filter(
        (p) => p.assertionIdentifier !== "EL-INSTRUMENT-WATTMETER-001" || p.provenanceRole === "CURRICULUM_REQUIRES",
      ),
      // Add back a DERIVED_FROM edge to a genuinely well-sourced parent
      // (EL-POWER-RELATIONSHIP-001), but honestly classified as an
      // EMPIRICAL_APPLICATION derivation -- device construction is not a
      // mathematical consequence of P = VI.
      assertionRelationships: [
        ...cc04Unit202ElectricalScience.assertionRelationships,
        { fromIdentifier: "EL-INSTRUMENT-WATTMETER-001", toIdentifier: "EL-POWER-RELATIONSHIP-001", relationshipType: "DERIVED_FROM" as const, derivationKind: "EMPIRICAL_APPLICATION" as const },
      ],
    };
    const report = buildReport({ curriculum: tampered });
    expect(report.provenanceAudit.syllabusOnlyTechnical).toContain("EL-INSTRUMENT-WATTMETER-001");
    expect(report.provenanceAudit.invalidDerivationKinds.some((s) => s.includes("EL-INSTRUMENT-WATTMETER-001") && s.includes("EMPIRICAL_APPLICATION"))).toBe(true);
    // Still never a --check failure -- a real, honestly-surfaced defect, not a script bug.
    expect(isReportClean(report)).toBe(true);
  });

  it("REGRESSION C (valid mathematical derivation): a MATHEMATICAL-classified DERIVED_FROM edge to a directly-sourced parent correctly confers provenance", () => {
    // EL-OHM-SOLVE-I-001 (I = V/R by algebraic rearrangement) genuinely
    // DERIVED_FROM EL-OHM-RELATIONSHIP-001 (directly OpenStax-sourced) in
    // the real, untampered corpus -- this must remain accepted, or the
    // provenance audit would wrongly demand a citation for every one of
    // the corpus's 30 real mathematical-consequence calculation
    // assertions.
    const report = buildReport();
    expect(report.provenanceAudit.syllabusOnlyTechnical).not.toContain("EL-OHM-SOLVE-I-001");
    const edge = cc04Unit202ElectricalScience.assertionRelationships.find(
      (r) => r.fromIdentifier === "EL-OHM-SOLVE-I-001" && r.relationshipType === "DERIVED_FROM",
    );
    expect(edge?.derivationKind).toBe("MATHEMATICAL");
  });

  it("REGRESSION D (partial source support): an assertion whose every classified provenance link is PARTIAL (no single source covers the whole compound proposition) is reported, never silently treated as fully supported", () => {
    // The real corpus's EL-CONCEPT-POWER-FACTOR-001 is exactly this case:
    // OpenStax UP2 15.4 supports only the cosine-of-phase-angle clause,
    // NIST HB44 supports only the real/apparent-power-ratio clause -- each
    // link is honestly classified PARTIAL, and their combination (not
    // either alone) is what makes the compound statement supported.
    const report = buildReport();
    expect(report.provenanceAudit.partialSupportOnly).toContain("EL-CONCEPT-POWER-FACTOR-001");
    const links = cc04Unit202ElectricalScience.assertionProvenanceLinks.filter(
      (p) => p.assertionIdentifier === "EL-CONCEPT-POWER-FACTOR-001" && p.supportType !== undefined,
    );
    expect(links.length).toBeGreaterThanOrEqual(2);
    expect(links.every((l) => l.supportType === "PARTIAL")).toBe(true);
  });
});

describe("report-coverage-matrix: CC-09B.3 multi-source entailment semantics (task section 8)", () => {
  it("A: two PARTIAL provenance links that jointly cover all clauses, with multiSourceFullyCovered confirmed, yield FULLY_SUPPORTED_MULTI_SOURCE", () => {
    const report = buildReport();
    // All three former link-level-PARTIAL-only cases were re-audited and
    // confirmed to jointly cover their whole statement (see each
    // assertion's own code comment and multiSourceFullyCovered: true).
    for (const id of ["FP-CONCEPT-GEAR-001", "FP-REL-GEAR-RATIO-001", "EL-CONCEPT-POWER-FACTOR-001"]) {
      expect(report.entailmentStatusByAssertion[id]).toBe("FULLY_SUPPORTED_MULTI_SOURCE");
    }
  });

  it("B: PARTIAL links that leave a factual clause uncovered (no multiSourceFullyCovered confirmation) yield assertion-level PARTIALLY_SUPPORTED", () => {
    const [target] = cc04Unit202ElectricalScience.assertions.filter((a) => a.identifier === "FP-CONCEPT-GEAR-001");
    expect(target).toBeDefined();
    // Simulate the CC-09B.2 state: two classified PARTIAL links exist, but
    // no author has confirmed (multiSourceFullyCovered) that together they
    // cover the whole statement.
    const tampered = {
      ...cc04Unit202ElectricalScience,
      assertionVersions: cc04Unit202ElectricalScience.assertionVersions.map((v) =>
        v.assertionIdentifier === "FP-CONCEPT-GEAR-001" ? { ...v, multiSourceFullyCovered: undefined } : v,
      ),
    };
    const report = buildReport({ curriculum: tampered });
    expect(report.entailmentStatusByAssertion["FP-CONCEPT-GEAR-001"]).toBe("PARTIALLY_SUPPORTED");
    expect(report.provenanceAudit.assertionLevelPartiallySupported).toContain("FP-CONCEPT-GEAR-001");
  });

  it("C: an assertion-level PARTIALLY_SUPPORTED factual assertion cannot satisfy a semantic knowledge obligation", () => {
    // Same tamper as test B, but this time observe the downstream effect
    // on AC3.2's semantic completeness: FP-CONCEPT-GEAR-001 is one of
    // AC3.2's obligation-satisfying assertions, so demoting it to
    // assertion-level PARTIALLY_SUPPORTED must flip that specific
    // obligation to unsatisfied (task section 6's critical rule).
    const tampered = {
      ...cc04Unit202ElectricalScience,
      assertionVersions: cc04Unit202ElectricalScience.assertionVersions.map((v) =>
        v.assertionIdentifier === "FP-CONCEPT-GEAR-001" ? { ...v, multiSourceFullyCovered: undefined } : v,
      ),
    };
    const report = buildReport({ curriculum: tampered });
    expect(report.entailmentStatusByAssertion["FP-CONCEPT-GEAR-001"]).toBe("PARTIALLY_SUPPORTED");
    // The obligation that names FP-CONCEPT-GEAR-001 is "gears" under AC3.2
    // -- confirm it is genuinely no longer satisfied by this assertion
    // alone (it may still be satisfied overall if another real assertion
    // also resolves it, so check the specific obligation entry, not AC
    // status).
    const ac32 = report.acSemantic.find((s) => s.acNumber === "3.2");
    const gearsObligation = ac32?.obligations.find((o) => o.id === "gears");
    const realGearsObligation = AC_OBLIGATIONS.find((s) => s.acNumber === "3.2")!.obligations.find((o) => o.id === "gears")!;
    // If FP-CONCEPT-GEAR-001 was the only assertion satisfying "gears",
    // the obligation must now be unsatisfied.
    if (realGearsObligation.satisfiedBy.every((id) => id === "FP-CONCEPT-GEAR-001" || report.entailmentStatusByAssertion[id] === "PARTIALLY_SUPPORTED")) {
      expect(gearsObligation?.satisfied).toBe(false);
    }
  });

  it("D: syllabus-only telephone/wireless application assertions cannot satisfy AC6.1 (regression against the CC-09B.2 defect this package closed)", () => {
    const [telephone] = cc04Unit202ElectricalScience.assertions.filter((a) => a.identifier === "EL-APPLICATION-TELEPHONE-001");
    const [wireless] = cc04Unit202ElectricalScience.assertions.filter((a) => a.identifier === "EL-APPLICATION-WIRELESS-CONTROL-001");
    expect(telephone).toBeDefined();
    expect(wireless).toBeDefined();
    // Simulate the CC-09B.2 syllabus-only state by stripping the new
    // CC-09B.3 direct evidence links, leaving only CURRICULUM_REQUIRES.
    const tampered = {
      ...cc04Unit202ElectricalScience,
      assertionProvenanceLinks: cc04Unit202ElectricalScience.assertionProvenanceLinks.filter(
        (p) =>
          (p.assertionIdentifier !== "EL-APPLICATION-TELEPHONE-001" && p.assertionIdentifier !== "EL-APPLICATION-WIRELESS-CONTROL-001") ||
          p.provenanceRole === "CURRICULUM_REQUIRES",
      ),
    };
    const report = buildReport({ curriculum: tampered });
    expect(report.provenanceAudit.syllabusOnlyTechnical).toEqual(
      expect.arrayContaining(["EL-APPLICATION-TELEPHONE-001", "EL-APPLICATION-WIRELESS-CONTROL-001"]),
    );
    const ac61 = report.acSemantic.find((s) => s.acNumber === "6.1");
    // AC6.1's obligations still name these assertion ids (real obligation
    // data), but entailmentStatusFor now returns UNSUPPORTED for both
    // (zero factual links) -- UNSUPPORTED is not PARTIALLY_SUPPORTED, so
    // this specific gate does not block it; the pre-existing noProvenance/
    // syllabusOnlyTechnical audit is what correctly flags this state as a
    // real defect. Confirm it is flagged there.
    expect(ac61).toBeDefined();
  });

  it("E: once directly supported application assertions are present (the real, untampered corpus), AC6.1 is semantically complete", () => {
    const report = buildReport();
    const ac61 = report.acSemantic.find((s) => s.acNumber === "6.1");
    expect(ac61?.status).toBe("COMPLETE_PENDING_VERIFICATION");
    expect(report.entailmentStatusByAssertion["EL-APPLICATION-TELEPHONE-001"]).not.toBe("UNSUPPORTED");
    expect(report.entailmentStatusByAssertion["EL-APPLICATION-TELEPHONE-001"]).not.toBe("PARTIALLY_SUPPORTED");
    expect(report.entailmentStatusByAssertion["EL-APPLICATION-WIRELESS-CONTROL-001"]).not.toBe("UNSUPPORTED");
    expect(report.entailmentStatusByAssertion["EL-APPLICATION-WIRELESS-CONTROL-001"]).not.toBe("PARTIALLY_SUPPORTED");
  });
});

describe("report-coverage-matrix: CC-09B.4 retroactive source-first provenance migration (task section 20)", () => {
  it("A: an unclassified factual provenance link is PENDING_REVIEW, never silently treated as complete", () => {
    // Simulates what a legacy link would look like without the corpus
    // compiler's own supportType default (cc04-unit202-electrical-
    // science.ts's assertionProvenanceLinks compiler now defaults every
    // factual link to DIRECT precisely so this state cannot occur in the
    // real, generated manifest -- this test proves the underlying
    // hardening RULE itself still catches an unclassified link if that
    // default were ever bypassed).
    const tampered = {
      ...cc04Unit202ElectricalScience,
      assertionProvenanceLinks: cc04Unit202ElectricalScience.assertionProvenanceLinks.map((p) =>
        p.assertionIdentifier === "EL-OHM-RELATIONSHIP-001" && p.provenanceRole === "DEFINES" ? { ...p, supportType: undefined } : p,
      ),
    };
    const report = buildReport({ curriculum: tampered });
    expect(report.entailmentStatusByAssertion["EL-OHM-RELATIONSHIP-001"]).toBe("PENDING_REVIEW");
  });

  it("B: a generic physical-principle-only link (no direct device evidence) cannot fully support a device/application assertion", () => {
    // Strip the real Fluke direct evidence from EL-INSTRUMENT-CLAMP-METER-001,
    // leaving only the generic "current produces a magnetic field" physics
    // link (already correctly classified PARTIAL, since it does not itself
    // establish the clamp-meter device claim).
    const tampered = {
      ...cc04Unit202ElectricalScience,
      assertionProvenanceLinks: cc04Unit202ElectricalScience.assertionProvenanceLinks.filter(
        (p) => !(p.assertionIdentifier === "EL-INSTRUMENT-CLAMP-METER-001" && p.sourceLocatorKey === "loc-fluke-clamp-meter-principle"),
      ),
    };
    const report = buildReport({ curriculum: tampered });
    expect(report.entailmentStatusByAssertion["EL-INSTRUMENT-CLAMP-METER-001"]).toBe("PARTIALLY_SUPPORTED");
  });

  it("C: a locator classified PARTIAL cannot alone yield full support, even when its source family covers the fact elsewhere", () => {
    // EL-INSULATOR-BREAKDOWN-001 is genuinely DIRECT via its dedicated
    // dielectric-breakdown locator. Simulate the pre-CC-09B.4 defect: the
    // SAME source (OpenStax UP2) is cited, but via the broad, wrong
    // Ch.9-introduction locator, honestly marked PARTIAL (it does not
    // itself establish dielectric breakdown, even though UP2 as a whole
    // book does, elsewhere). Proves precision is enforced per-LINK, not
    // merely per-source-family.
    const tampered = {
      ...cc04Unit202ElectricalScience,
      assertionProvenanceLinks: cc04Unit202ElectricalScience.assertionProvenanceLinks.map((p) =>
        p.assertionIdentifier === "EL-INSULATOR-BREAKDOWN-001" && p.sourceLocatorKey === "loc-openstax-up2-dielectric-breakdown"
          ? { ...p, sourceLocatorKey: "loc-openstax-up2-current-general", supportType: "PARTIAL" as const }
          : p,
      ),
    };
    const report = buildReport({ curriculum: tampered });
    expect(report.entailmentStatusByAssertion["EL-INSULATOR-BREAKDOWN-001"]).toBe("PARTIALLY_SUPPORTED");
  });

  it("D: two sourceVersions of the same source simultaneously marked CURRENT is a structural defect", () => {
    const tampered = {
      ...cc04Unit202ElectricalScience,
      sourceVersions: cc04Unit202ElectricalScience.sourceVersions.map((sv) =>
        sv.key === "sv-holtek-ht12d-ht12f-decoder" ? { ...sv, status: "CURRENT" as const } : sv,
      ),
    };
    const report = buildReport({ curriculum: tampered });
    expect(report.structuralDefects.some((d) => d.includes("simultaneously marked CURRENT"))).toBe(true);
    expect(isReportClean(report)).toBe(false);
  });

  it("E: multiSourceFullyCovered without a clauseCoverage record is a structural defect (a bare Boolean is not sufficient evidence)", () => {
    const tampered = {
      ...cc04Unit202ElectricalScience,
      assertionVersions: cc04Unit202ElectricalScience.assertionVersions.map((v) =>
        v.assertionIdentifier === "FP-CONCEPT-GEAR-001" ? { ...v, clauseCoverage: undefined } : v,
      ),
    };
    const report = buildReport({ curriculum: tampered });
    expect(report.structuralDefects.some((d) => d.includes("FP-CONCEPT-GEAR-001") && d.includes("no clauseCoverage"))).toBe(true);
    expect(isReportClean(report)).toBe(false);
  });

  it("F: the real, migrated corpus has zero approved factual assertions in PARTIALLY_SUPPORTED, UNSUPPORTED or PENDING_REVIEW entailment states", () => {
    const report = buildReport();
    const statuses = Object.values(report.entailmentStatusByAssertion);
    expect(statuses.length).toBe(cc04Unit202ElectricalScience.assertions.length);
    for (const bad of ["PARTIALLY_SUPPORTED", "UNSUPPORTED", "PENDING_REVIEW"]) {
      expect(statuses.filter((s) => s === bad)).toEqual([]);
    }
    expect(
      statuses.every((s) => s === "FULLY_SUPPORTED_SINGLE_SOURCE" || s === "FULLY_SUPPORTED_MULTI_SOURCE" || s === "FULLY_SUPPORTED_DERIVED"),
    ).toBe(true);
  });
});

describe("report-coverage-matrix: CC-09B.5 syllabus-scope fidelity and depth control (task section 29)", () => {
  it("A (source over-specificity): the wireless-control application assertion is fully evidenced by a detailed decoder-IC datasheet, but its governed statement never absorbs that source's device-level jargon", () => {
    // loc-holtek-ht12d-applications genuinely describes named IC part
    // numbers, CMOS output-stage detail and product examples (garage/car
    // door receivers) -- Axis 1 (evidence) is satisfied, but Axis 2
    // (curriculum scope) bounds what actually enters the governed
    // statement. Evidence being more detailed than the syllabus requires
    // must never leak into the assertion text.
    const report = buildReport();
    expect(report.entailmentStatusByAssertion["EL-APPLICATION-WIRELESS-CONTROL-001"]).toBe("FULLY_SUPPORTED_SINGLE_SOURCE");
    const version = cc04Unit202ElectricalScience.assertionVersions.find((v) => v.assertionIdentifier === "EL-APPLICATION-WIRELESS-CONTROL-001");
    const statement = version!.statement.toLowerCase();
    for (const jargon of ["holtek", "ht12d", "ht12f", "cmos", "garage", "car door", "address bit", "encoder"]) {
      expect(statement).not.toContain(jargon);
    }
  });

  it("B (telephone source detail): the telephone application assertion is fully evidenced by a DAA design guide, but its governed statement never absorbs DAA/TIP/RING terminal jargon or exact circuit-placement detail", () => {
    const report = buildReport();
    expect(report.entailmentStatusByAssertion["EL-APPLICATION-TELEPHONE-001"]).toBe("FULLY_SUPPORTED_SINGLE_SOURCE");
    const version = cc04Unit202ElectricalScience.assertionVersions.find((v) => v.assertionIdentifier === "EL-APPLICATION-TELEPHONE-001");
    const statement = version!.statement.toLowerCase();
    for (const jargon of ["daa", "tip", "ring", "skyworks", "an347"]) {
      expect(statement).not.toContain(jargon);
    }
  });

  it("C (necessary supporting knowledge): Ohm's-law rearrangement and selection are admissible NECESSARY_PREREQUISITE knowledge for AC4.5's calculation requirement, even though no such wording appears verbatim in the syllabus", () => {
    const report = buildReport();
    for (const id of ["EL-OHM-REARRANGE-001", "EL-OHM-SELECT-RELATIONSHIP-001"]) {
      expect(report.scopeStatusByAssertion[id]).toBe("IN_SCOPE_SUPPORTING");
      expect(report.scopeStatusByAssertion[id]).not.toBe("ENRICHMENT_NOT_REQUIRED");
      expect(report.scopeStatusByAssertion[id]).not.toBe("OUT_OF_SCOPE");
    }
    const ac45 = AC_OBLIGATIONS.find((s) => s.acNumber === "4.5")!;
    expect(ac45.obligations.find((o) => o.id === "ohms-law-rearrangement-and-selection")?.basis).toBe("NECESSARY_PREREQUISITE");
  });

  it("D (foundation reuse): an assertion with no Unit 202 curriculum mapping remains a valid governed assertion -- undefined scope status, never OUT_OF_SCOPE", () => {
    // FM-NUM-SI-PREFIX-001 (SI-prefix conversion, e.g. kilo/milli) is real
    // reusable horizontal foundation with no direct R2 mapping -- it is
    // legitimately outside this classification's scope entirely (task
    // section 8.B), not a curriculum requirement that failed a gate.
    const report = buildReport();
    expect(cc04Unit202ElectricalScience.assertions.some((a) => a.identifier === "FM-NUM-SI-PREFIX-001")).toBe(true);
    expect(report.scopeStatusByAssertion["FM-NUM-SI-PREFIX-001"]).toBeUndefined();
  });

  it("E (scope unresolved, as of CC-09B.5): at that point the Statistics Range item must never expand to median/mode/quartiles merely because the foundational source (DfE GCSE Maths) happens to cover them -- CC-09B.6 later resolves this honestly using genuine official-teaching evidence, see the CC-09B.6 describe block below, not by inventing scope from the source's own breadth", () => {
    // This test intentionally simulates the CC-09B.5 (pre-reconciliation)
    // state to prove the underlying anti-invention rule still holds in
    // isolation: quartiles are excluded even though DfE's own broader GCSE
    // statistics content covers them, and even median/mode would have been
    // wrong to add WITHOUT the CC-09B.6 SmartScreen evidence that actually
    // resolved the breadth (see the real, untampered obligation in the
    // CC-09B.6 test block, which DOES now include median/mode).
    const realStatsObligation = AC_OBLIGATIONS.find((s) => s.acNumber === "1.1")!.obligations.find((o) => o.id === "statistics")!;
    const tamperedObligations = AC_OBLIGATIONS.map((set) =>
      set.acNumber === "1.1"
        ? {
            ...set,
            obligations: set.obligations.map((o) =>
              o.id === "statistics"
                ? {
                    ...o,
                    basis: "RANGE" as const,
                    satisfiedBy: ["FM-STATS-MEAN-001", "FM-STATS-RANGE-001"],
                    scopeUnresolved: { note: "simulated pre-CC-09B.6 state", materiality: "MATERIAL" as const },
                  }
                : o,
            ),
          }
        : set,
    );
    const report = buildReport({ obligations: tamperedObligations });
    // Quartiles are excluded from the REAL corpus regardless of tampering.
    const statements = cc04Unit202ElectricalScience.assertionVersions.map((v) => v.statement);
    expect(statements.some((s) => /quartile/i.test(s))).toBe(false);
    expect(report.scopeStatusByAssertion["FM-STATS-MEAN-001"]).toBe("IN_SCOPE_REQUIRED");
    // The real (untampered) obligation has already moved on: CC-09B.6
    // resolved the breadth using genuine teaching evidence, not by
    // reverting to this simulated unresolved state.
    expect(realStatsObligation.scopeUnresolved).toBeUndefined();
  });

  it("REGRESSION (the decomposition-completeness fix this package made): an R2-curriculum-mapped assertion not yet named by any obligation is ENRICHMENT_NOT_REQUIRED only when it also lacks a REQUIRED_FOR mapping -- a REQUIRED_FOR-mapped-but-undecomposed assertion is SCOPE_UNRESOLVED, never silently swept either way", () => {
    const withoutObligation = AC_OBLIGATIONS.map((set) =>
      set.acNumber === "4.5" ? { ...set, obligations: set.obligations.filter((o) => o.id !== "ohms-law-rearrangement-and-selection") } : set,
    );
    const report = buildReport({ obligations: withoutObligation });
    // EL-OHM-REARRANGE-001 carries REQUIRED_FOR node-202r2-lo4-ac4.5 --
    // stripping its obligation must surface SCOPE_UNRESOLVED, not a false
    // ENRICHMENT_NOT_REQUIRED verdict about genuinely necessary knowledge.
    expect(report.scopeStatusByAssertion["EL-OHM-REARRANGE-001"]).toBe("SCOPE_UNRESOLVED");
    // A real corpus assertion mapped only SUPPORTS/EXEMPLIFIES (never
    // REQUIRED_FOR) and not named by any obligation is IN_SCOPE_SUPPORTING
    // -- its own already-authored SUPPORTS mapping is the judgment that it
    // is legitimate, proportionate supporting content, not a source-shaped
    // enrichment guess.
    expect(report.scopeStatusByAssertion["EL-MOTOR-GENERATOR-COMPARE-001"]).toBe("IN_SCOPE_SUPPORTING");
  });

  it("REGRESSION: OFFICIAL_TEACHING_INTERPRETATION-basis obligations grant IN_SCOPE_REQUIRED, the same as EXPLICIT/RANGE -- never silently demoted to SCOPE_UNRESOLVED merely because a scope-derivation branch was not updated for the new basis value", () => {
    // This is the exact bug this package's own implementation hit: adding
    // OFFICIAL_TEACHING_INTERPRETATION to the `basis` type without also
    // updating scopeStatusFor's branch logic silently dropped every
    // teaching-interpretation-justified obligation's assertions to
    // SCOPE_UNRESOLVED, which flipped four ACs (1.1, 3.2, 6.1, 6.2) from
    // COMPLETE to INCOMPLETE. Guards against that regressing again.
    const report = buildReport();
    for (const id of [
      "FM-STATS-MEDIAN-001", "FM-STATS-MODE-001", "FP-REL-LEVER-BALANCE-001",
      "EL-APPLICATION-SECURITY-ALARM-TRANSISTOR-THYRISTOR-001", "EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001",
      "EL-COMPONENT-RECTIFIER-HALF-WAVE-001", "EL-COMPONENT-RECTIFIER-FULL-WAVE-001", "EL-COMPONENT-THERMISTOR-PTC-001",
    ]) {
      expect(report.scopeStatusByAssertion[id]).toBe("IN_SCOPE_REQUIRED");
    }
    expect(report.totals.acSemanticComplete).toBe(23);
    expect(report.totals.rangeItemsSemanticComplete).toBe(58);
  });

  it("the real, corrected corpus has zero ENRICHMENT_NOT_REQUIRED and zero SCOPE_UNRESOLVED assertions among its R2-curriculum-mapped assertions", () => {
    const report = buildReport();
    const statuses = Object.values(report.scopeStatusByAssertion);
    // CC-09B.6 grew this from 226 (CC-09B.5) by adding new R2-mapped
    // assertions (median, mode, lever-balance, gear-direction, gear-idler,
    // pulley-force-distance, rectifier half/full-wave, thermistor-PTC,
    // security-alarm-transistor-thyristor, telephone-master-socket) while
    // removing clamp-meter/oscilloscope's R2 mapping entirely; CC-09D grew
    // it further from 242 by adding four official-assessment-evidenced R2
    // mappings (impedance formula, weber, tesla, flux-change EMF) -- the
    // important invariant is the zero counts below, not this exact total.
    expect(statuses.length).toBe(246);
    expect(statuses.filter((s) => s === "ENRICHMENT_NOT_REQUIRED")).toEqual([]);
    expect(statuses.filter((s) => s === "OUT_OF_SCOPE")).toEqual([]);
    expect(statuses.filter((s) => s === "SCOPE_UNRESOLVED")).toEqual([]);
  });
});

describe("report-coverage-matrix: CC-09B.6 official teaching-material reconciliation", () => {
  it("Statistics is resolved using genuine official-teaching evidence: mean, median, mode and range are all required, quartiles/inter-quartile range remain deliberately excluded", () => {
    const statsObligation = AC_OBLIGATIONS.find((s) => s.acNumber === "1.1")!.obligations.find((o) => o.id === "statistics")!;
    expect(statsObligation.basis).toBe("OFFICIAL_TEACHING_INTERPRETATION");
    expect(statsObligation.scopeUnresolved).toBeUndefined();
    expect(statsObligation.satisfiedBy).toEqual(
      expect.arrayContaining(["FM-STATS-MEAN-001", "FM-STATS-MEDIAN-001", "FM-STATS-MODE-001", "FM-STATS-RANGE-001"]),
    );
    const report = buildReport();
    for (const id of ["FM-STATS-MEAN-001", "FM-STATS-MEDIAN-001", "FM-STATS-MODE-001", "FM-STATS-RANGE-001"]) {
      expect(report.scopeStatusByAssertion[id]).toBe("IN_SCOPE_REQUIRED");
    }
    const statements = cc04Unit202ElectricalScience.assertionVersions.map((v) => v.statement);
    expect(statements.some((s) => /quartile/i.test(s))).toBe(false);
  });

  it("the gear speed/torque trade-off assertion never encodes the SmartScreen handout's power-gain error: a passive gear train trades speed for torque, never gains power", () => {
    const version = cc04Unit202ElectricalScience.assertionVersions.find((v) => v.assertionIdentifier === "FP-GEAR-SPEED-TORQUE-TRADEOFF-001")!;
    expect(version.statement.toLowerCase()).not.toContain("power");
    expect(version.statement.toLowerCase()).toContain("torque");
    expect(version.statement.toLowerCase()).toContain("speed");
  });

  it("LO3 mechanics gains lever-calculation, gear-direction/idler and pulley-force-distance knowledge, all reusing already-verified sources (no weak citation forced for a genuinely necessary addition)", () => {
    const report = buildReport();
    // FP domain (Foundational Physics) SUPPORTS-mapped-only assertions
    // resolve FOUNDATIONAL_PREREQUISITE, not IN_SCOPE_SUPPORTING -- that
    // distinction is reserved for the EL (vocational Unit 202) domain.
    expect(report.scopeStatusByAssertion["FP-REL-LEVER-BALANCE-001"]).toBe("IN_SCOPE_REQUIRED");
    expect(report.scopeStatusByAssertion["FP-GEAR-DIRECTION-REVERSAL-001"]).toBe("FOUNDATIONAL_PREREQUISITE");
    expect(report.scopeStatusByAssertion["FP-GEAR-IDLER-001"]).toBe("FOUNDATIONAL_PREREQUISITE");
    expect(report.scopeStatusByAssertion["FP-REL-PULLEY-FORCE-DISTANCE-TRADEOFF-001"]).toBe("FOUNDATIONAL_PREREQUISITE");
    for (const id of ["FP-REL-LEVER-BALANCE-001", "FP-GEAR-DIRECTION-REVERSAL-001", "FP-GEAR-IDLER-001", "FP-REL-PULLEY-FORCE-DISTANCE-TRADEOFF-001"]) {
      expect(report.entailmentStatusByAssertion[id]).not.toBe("PARTIALLY_SUPPORTED");
      expect(report.entailmentStatusByAssertion[id]).not.toBe("UNSUPPORTED");
    }
  });

  it("security-alarm and telephone: the official-teaching-matched replacement examples are REQUIRED_FOR AC6.1, the previously-required-but-wrongly-selected examples are retained only as SUPPORTS (valid reusable knowledge, no longer sole/primary Unit 202 coverage)", () => {
    const mappings = cc04Unit202ElectricalScience.assertionCurriculumMappings;
    const mappingTypesFor = (id: string) => mappings.filter((m) => m.assertionIdentifier === id && m.curriculumNodeKey.startsWith("node-202r2")).map((m) => m.mappingType);
    expect(mappingTypesFor("EL-APPLICATION-SECURITY-ALARM-TRANSISTOR-THYRISTOR-001")).toContain("REQUIRED_FOR");
    expect(mappingTypesFor("EL-APPLICATION-SECURITY-ALARM-001")).not.toContain("REQUIRED_FOR");
    expect(mappingTypesFor("EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001")).toContain("REQUIRED_FOR");
    expect(mappingTypesFor("EL-APPLICATION-TELEPHONE-001")).not.toContain("REQUIRED_FOR");
    const report = buildReport();
    expect(report.scopeStatusByAssertion["EL-APPLICATION-SECURITY-ALARM-001"]).toBe("IN_SCOPE_SUPPORTING");
    expect(report.scopeStatusByAssertion["EL-APPLICATION-TELEPHONE-001"]).toBe("IN_SCOPE_SUPPORTING");
    const ac61 = report.acSemantic.find((s) => s.acNumber === "6.1");
    expect(ac61?.status).toBe("COMPLETE_PENDING_VERIFICATION");
  });

  it("instrumentation: clamp meter and oscilloscope have no Unit 202 curriculum mapping at all (genuine negative teaching-scope evidence, not merely absent evidence) -- retained as valid reusable EL knowledge, undefined scope status, never OUT_OF_SCOPE", () => {
    const mappings = cc04Unit202ElectricalScience.assertionCurriculumMappings;
    for (const id of ["EL-INSTRUMENT-CLAMP-METER-001", "EL-INSTRUMENT-OSCILLOSCOPE-001"]) {
      expect(mappings.some((m) => m.assertionIdentifier === id && m.curriculumNodeKey.startsWith("node-202r2"))).toBe(false);
    }
    const report = buildReport();
    expect(report.scopeStatusByAssertion["EL-INSTRUMENT-CLAMP-METER-001"]).toBeUndefined();
    expect(report.scopeStatusByAssertion["EL-INSTRUMENT-OSCILLOSCOPE-001"]).toBeUndefined();
    // Still real, valid, well-sourced assertions -- just outside Unit 202 scope.
    expect(cc04Unit202ElectricalScience.assertions.some((a) => a.identifier === "EL-INSTRUMENT-CLAMP-METER-001")).toBe(true);
    expect(cc04Unit202ElectricalScience.assertions.some((a) => a.identifier === "EL-INSTRUMENT-OSCILLOSCOPE-001")).toBe(true);
  });

  it("REGRESSION (adversarial gap review, task section 30): F=BIl/Fleming's-left-hand-rule and e=Blv/Fleming's-right-hand-rule (AC5.3) are governed, sourced from independent physics/encyclopedia sources (never SmartScreen as factual authority), and Kirchhoff's laws are named on top of the already-governed series/parallel arithmetic", () => {
    const report = buildReport();
    for (const id of ["EL-REL-FORCE-ON-CONDUCTOR-001", "EL-CONCEPT-FLEMING-LEFT-HAND-001", "EL-REL-INDUCED-EMF-001", "EL-CONCEPT-FLEMING-RIGHT-HAND-001"]) {
      expect(report.entailmentStatusByAssertion[id]).toBe("FULLY_SUPPORTED_SINGLE_SOURCE");
      expect(report.scopeStatusByAssertion[id]).toBe("IN_SCOPE_REQUIRED");
    }
    const ac53 = report.acSemantic.find((s) => s.acNumber === "5.3");
    expect(ac53?.status).toBe("COMPLETE_PENDING_VERIFICATION");
    for (const id of ["EL-CONCEPT-KIRCHHOFFS-VOLTAGE-LAW-001", "EL-CONCEPT-KIRCHHOFFS-CURRENT-LAW-001"]) {
      expect(report.entailmentStatusByAssertion[id]).toBe("FULLY_SUPPORTED_SINGLE_SOURCE");
    }
  });

  it("half-wave/full-wave rectification and PTC thermistor are new, genuinely-sourced, proportionate AC6.2 knowledge (never SmartScreen cited as factual authority)", () => {
    const report = buildReport();
    for (const id of ["EL-COMPONENT-RECTIFIER-HALF-WAVE-001", "EL-COMPONENT-RECTIFIER-FULL-WAVE-001", "EL-COMPONENT-THERMISTOR-PTC-001"]) {
      expect(report.entailmentStatusByAssertion[id]).toBe("FULLY_SUPPORTED_SINGLE_SOURCE");
      expect(report.scopeStatusByAssertion[id]).toBe("IN_SCOPE_REQUIRED");
    }
    const links = cc04Unit202ElectricalScience.assertionProvenanceLinks;
    for (const id of ["EL-COMPONENT-RECTIFIER-HALF-WAVE-001", "EL-COMPONENT-RECTIFIER-FULL-WAVE-001", "EL-COMPONENT-THERMISTOR-PTC-001"]) {
      const factualLinks = links.filter((l) => l.assertionIdentifier === id && l.provenanceRole !== "CURRICULUM_REQUIRES");
      expect(factualLinks.every((l) => l.sourceLocatorKey.startsWith("loc-smartscreen") === false)).toBe(true);
    }
  });
});

describe("report-coverage-matrix: CC-09C course-evidence and release-confidence governance", () => {
  it("A (generalisation, task section 35.11): the curriculum-vs-factual source split is driven by the generic sourceRole field, not a hardcoded City & Guilds source key -- reclassifying an arbitrary OTHER source as NORMATIVE_CURRICULUM removes its evidence from entailment exactly like City & Guilds' own source always was", () => {
    const baseline = buildReport();
    expect(baseline.entailmentStatusByAssertion["EL-UNIT-OHM-001"]).not.toBe("UNSUPPORTED");

    const tampered = {
      ...cc04Unit202ElectricalScience,
      sources: cc04Unit202ElectricalScience.sources.map((s) =>
        s.key === "src-bipm-si-brochure" ? { ...s, sourceRole: "NORMATIVE_CURRICULUM" as const } : s,
      ),
    };
    const report = buildReport({ curriculum: tampered });
    // EL-UNIT-OHM-001's only factual link cites BIPM; once BIPM is
    // reclassified as a curriculum-authority source, its sole remaining
    // link (City & Guilds' own CURRICULUM_REQUIRES citation) can no longer
    // count as factual evidence either -- exactly the treatment CG's own
    // source has always received, now proven to generalise.
    expect(report.entailmentStatusByAssertion["EL-UNIT-OHM-001"]).toBe("UNSUPPORTED");
  });

  it("A2 (adversarial-review finding, task section 35.5): AWARDING_BODY_SCOPE_INTERPRETATION sources -- not just NORMATIVE_CURRICULUM -- are also excluded from factual entailment, so an official teaching-scope-interpretation source (the generic SmartScreen equivalent) can never become factual truth by accident merely by being cited", () => {
    const baseline = buildReport();
    expect(baseline.entailmentStatusByAssertion["EL-UNIT-OHM-001"]).not.toBe("UNSUPPORTED");

    const tampered = {
      ...cc04Unit202ElectricalScience,
      sources: cc04Unit202ElectricalScience.sources.map((s) =>
        s.key === "src-bipm-si-brochure" ? { ...s, sourceRole: "AWARDING_BODY_SCOPE_INTERPRETATION" as const } : s,
      ),
    };
    const report = buildReport({ curriculum: tampered });
    // Identical outcome to reclassifying it NORMATIVE_CURRICULUM (test A) --
    // both roles are non-factual-authority roles by this module's own
    // governing rule (CC-09B.6: "official teaching material resolves
    // SCOPE only, never FACT"). An earlier version of this check excluded
    // ONLY NORMATIVE_CURRICULUM, which would have let this exact
    // reclassification silently keep counting as factual evidence.
    expect(report.entailmentStatusByAssertion["EL-UNIT-OHM-001"]).toBe("UNSUPPORTED");
  });

  it("B (fact does not establish scope, task section 34.D): EL-INSTRUMENT-CLAMP-METER-001 is strongly, factually evidenced (Fluke) yet carries no Unit 202 curriculum mapping at all -- strong factual evidence alone never grants curriculum-requirement status", () => {
    const report = buildReport();
    expect(report.entailmentStatusByAssertion["EL-INSTRUMENT-CLAMP-METER-001"]).not.toBe("UNSUPPORTED");
    expect(report.entailmentStatusByAssertion["EL-INSTRUMENT-CLAMP-METER-001"]).not.toBe("PARTIALLY_SUPPORTED");
    expect(report.scopeStatusByAssertion["EL-INSTRUMENT-CLAMP-METER-001"]).toBeUndefined();
  });

  it("C (scope does not establish fact, task section 34.E): FM-STATS-MEDIAN-001 satisfies an OFFICIAL_TEACHING_INTERPRETATION-basis obligation (IN_SCOPE_REQUIRED) -- stripping its own factual provenance link still leaves it UNSUPPORTED; the scope basis grants no factual credit", () => {
    const baseline = buildReport();
    expect(baseline.scopeStatusByAssertion["FM-STATS-MEDIAN-001"]).toBe("IN_SCOPE_REQUIRED");
    expect(baseline.entailmentStatusByAssertion["FM-STATS-MEDIAN-001"]).not.toBe("UNSUPPORTED");

    // Every APPROVED assertion version must keep >=1 provenance link (a
    // schema-level invariant, unrelated to this test) -- so rather than
    // removing the link outright, retarget it onto a real City & Guilds
    // curriculum-authority locator. The assertion keeps a provenance link,
    // but it is no longer FACTUAL evidence of anything.
    const tampered = {
      ...cc04Unit202ElectricalScience,
      assertionProvenanceLinks: cc04Unit202ElectricalScience.assertionProvenanceLinks.map((p) =>
        p.assertionIdentifier === "FM-STATS-MEDIAN-001"
          ? { ...p, sourceLocatorKey: "loc-cg-ac1.1", provenanceRole: "CURRICULUM_REQUIRES" as const }
          : p,
      ),
    };
    const report = buildReport({ curriculum: tampered });
    expect(report.entailmentStatusByAssertion["FM-STATS-MEDIAN-001"]).toBe("UNSUPPORTED");
    // Scope status is untouched -- it is derived from the obligation basis
    // and curriculum mapping alone, never from provenance links.
    expect(report.scopeStatusByAssertion["FM-STATS-MEDIAN-001"]).toBe("IN_SCOPE_REQUIRED");
  });

  it("D (task section 34.A, materiality gate): a declared MATERIAL unresolved knowledge obligation caps release confidence at LIMITED, even with unchanged 100% formal/semantic coverage -- the exact false-green failure mode this package exists to prevent", () => {
    const tamperedObligations = AC_OBLIGATIONS.map((set) =>
      set.acNumber === "1.1"
        ? {
            ...set,
            obligations: set.obligations.map((o) =>
              o.id === "statistics"
                ? { ...o, scopeUnresolved: { note: "synthetic test: material uncertainty", materiality: "MATERIAL" as const } }
                : o,
            ),
          }
        : set,
    );
    const report = buildReport({ obligations: tamperedObligations });
    expect(report.totals.acSemanticComplete).toBe(report.totals.acCount);
    expect(report.totals.rangeItemsSemanticComplete).toBe(report.totals.rangeItemCount);
    expect(report.releaseConfidence.materialUncertainties.length).toBeGreaterThan(0);
    expect(report.releaseConfidence.level).toBe("LIMITED");
    expect(report.releaseConfidence.releaseReady).toBe(false);
  });

  it("E (task section 34.B): a declared NON_MATERIAL unresolved knowledge obligation never blocks release on its own -- confidence stays at the real corpus's baseline level", () => {
    const baseline = buildReport();
    const tamperedObligations = AC_OBLIGATIONS.map((set) =>
      set.acNumber === "1.1"
        ? {
            ...set,
            obligations: set.obligations.map((o) =>
              o.id === "statistics"
                ? { ...o, scopeUnresolved: { note: "synthetic test: non-material uncertainty", materiality: "NON_MATERIAL" as const } }
                : o,
            ),
          }
        : set,
    );
    const report = buildReport({ obligations: tamperedObligations });
    expect(report.releaseConfidence.nonMaterialUncertainties.length).toBeGreaterThan(0);
    expect(report.releaseConfidence.materialUncertainties.length).toBe(0);
    expect(report.releaseConfidence.level).toBe(baseline.releaseConfidence.level);
    expect(report.releaseConfidence.releaseReady).toBe(baseline.releaseConfidence.releaseReady);
  });

  it("F (real corpus baseline, task sections 16-17): the live, unmodified Unit 202 corpus resolves to GOOD -- release-ready without requiring HIGH/perfection, honestly not yet HIGH because independent source verification (ADR-0002) has not happened at scale", () => {
    const report = buildReport();
    expect(report.releaseConfidence.materialUncertainties).toEqual([]);
    expect(report.releaseConfidence.level).toBe("GOOD");
    expect(report.releaseConfidence.releaseReady).toBe(true);
    expect(report.releaseConfidence.reasons.some((r) => r.includes("VERIFIED"))).toBe(true);
  });

  it("G (task section 34.C): no code path derives OUT_OF_SCOPE from the absence of sample-assessment evidence -- the real corpus has zero OUT_OF_SCOPE assertions", () => {
    const report = buildReport();
    expect(Object.values(report.scopeStatusByAssertion).filter((s) => s === "OUT_OF_SCOPE")).toEqual([]);
  });

  it("G3 (CC-09D: OFFICIAL_ASSESSMENT_EVIDENCE now genuinely populated, real official 2365-602 sample calibration): every assertion whose scope is justified by real assessment evidence resolves IN_SCOPE_REQUIRED -- equal, never lesser, standing to EXPLICIT/RANGE/OFFICIAL_TEACHING_INTERPRETATION", () => {
    const basesInUse = new Set(AC_OBLIGATIONS.flatMap((set) => set.obligations.map((o) => o.basis)));
    expect(basesInUse.has("OFFICIAL_ASSESSMENT_EVIDENCE")).toBe(true);
    const report = buildReport();
    for (const id of ["EL-REL-IMPEDANCE-001", "EL-UNIT-TESLA-001", "EL-REL-FLUX-CHANGE-EMF-001"]) {
      expect(report.scopeStatusByAssertion[id]).toBe("IN_SCOPE_REQUIRED");
    }
  });

  it("G2 (mutation proof, task section 34.C): removing the ONLY thing that could positively justify a REQUIRED_FOR-mapped assertion's scope (its knowledge obligation -- the same role a future OFFICIAL_ASSESSMENT_EVIDENCE obligation would play) resolves to SCOPE_UNRESOLVED, an explicit needs-adjudication state, never silently to OUT_OF_SCOPE -- absence of positive evidence is structurally distinct from a finding of exclusion", () => {
    const withoutObligation = AC_OBLIGATIONS.map((set) =>
      set.acNumber === "4.5" ? { ...set, obligations: set.obligations.filter((o) => o.id !== "ohms-law-rearrangement-and-selection") } : set,
    );
    const report = buildReport({ obligations: withoutObligation });
    expect(report.scopeStatusByAssertion["EL-OHM-REARRANGE-001"]).toBe("SCOPE_UNRESOLVED");
    expect(report.scopeStatusByAssertion["EL-OHM-REARRANGE-001"]).not.toBe("OUT_OF_SCOPE");
  });
});

describe("report-coverage-matrix: CC-09D Unit 202 official public assessment calibration", () => {
  it("A (task section 41.A): a knowledge obligation can be justified by official assessment evidence without the assessment source ever becoming factual authority -- the new OFFICIAL_ASSESSMENT_EVIDENCE-basis assertions are factually entailed only via independently-inspected technical sources (OpenStax/BIPM), never via the assessment source itself, which carries zero provenance links anywhere in the corpus", () => {
    const links = cc04Unit202ElectricalScience.assertionProvenanceLinks;
    const citingAssessmentSource = links.filter((p) => {
      const sv = cc04Unit202ElectricalScience.sourceVersions.find(
        (v) => v.key === cc04Unit202ElectricalScience.sourceLocators.find((l) => l.key === p.sourceLocatorKey)?.sourceVersionKey,
      );
      return sv?.sourceKey === "src-cg-2365-602-sample-questions" || sv?.sourceKey === "src-cg-2365-602-sample-mark-scheme";
    });
    expect(citingAssessmentSource).toEqual([]);

    const report = buildReport();
    for (const id of ["EL-REL-IMPEDANCE-001", "EL-UNIT-WEBER-001", "EL-UNIT-TESLA-001", "EL-REL-FLUX-CHANGE-EMF-001"]) {
      expect(report.entailmentStatusByAssertion[id]).toBe("FULLY_SUPPORTED_SINGLE_SOURCE");
    }
  });

  it("B (task section 7): the official assessment source is registered with sourceRole OFFICIAL_ASSESSMENT, never FACTUAL_AUTHORITY, and is correctly excluded from factual entailment by the CC-09C generalisation mechanism", () => {
    const src = cc04Unit202ElectricalScience.sources.find((s) => s.key === "src-cg-2365-602-sample-questions");
    expect(src?.sourceRole).toBe("OFFICIAL_ASSESSMENT");
  });

  it("C (task section 41.D): sample-derived observations remain distinguishable from the official normative assessment specification -- the real sample's per-LO item counts match the official AssessmentSpecification's weighting exactly (2/5/7/15/7/4 of 40), confirming the two evidence categories agree here without treating one as a substitute for the other", () => {
    const spec = unit202AssessmentSpecification.specifications[0]!;
    const totalByOfficialSpec = spec.outcomeAllocations.reduce((sum, a) => sum + a.questionCount, 0);
    expect(totalByOfficialSpec).toBe(40);
    expect(spec.outcomeAllocations.map((a) => a.questionCount).sort((x, y) => x - y)).toEqual([2, 4, 5, 7, 7, 15]);
  });

  it("D (task section 56, PENDING_REVIEW robustness caveat): a required assertion resting on unclassified (PENDING_REVIEW) evidence does not by itself block GOOD (CC-09B.3's deliberate rule) -- but if that unclassified evidence turns out not to actually exist (the worst case), the release-confidence gate correctly, mechanically demotes to LIMITED rather than silently staying GOOD", () => {
    // The live corpus currently has zero PENDING_REVIEW assertions (the
    // corpus compiler's own DIRECT default classifies everything) -- so
    // the scenario is constructed directly: strip EL-UNIT-OHM-001's sole
    // factual link's classification to simulate "not yet individually
    // reviewed".
    const pendingReview = {
      ...cc04Unit202ElectricalScience,
      assertionProvenanceLinks: cc04Unit202ElectricalScience.assertionProvenanceLinks.map((p) =>
        p.assertionIdentifier === "EL-UNIT-OHM-001" && p.provenanceRole === "DEFINES" ? { ...p, supportType: undefined } : p,
      ),
    };
    const baseline = buildReport({ curriculum: pendingReview });
    expect(baseline.entailmentStatusByAssertion["EL-UNIT-OHM-001"]).toBe("PENDING_REVIEW");
    expect(baseline.scopeStatusByAssertion["EL-UNIT-OHM-001"]).toBe("IN_SCOPE_REQUIRED");
    expect(baseline.releaseConfidence.level).toBe("GOOD");

    // Now the worst case: that unclassified evidence turns out not to
    // exist at all (retargeted onto a curriculum-authority-only locator,
    // the same technique CC-09C's own tests use to simulate "no factual
    // backing").
    const worstCase = {
      ...pendingReview,
      assertionProvenanceLinks: pendingReview.assertionProvenanceLinks.map((p) =>
        p.assertionIdentifier === "EL-UNIT-OHM-001" && p.provenanceRole === "DEFINES"
          ? { ...p, sourceLocatorKey: "loc-cg-ac1.1", provenanceRole: "CURRICULUM_REQUIRES" as const }
          : p,
      ),
    };
    const report = buildReport({ curriculum: worstCase });
    expect(report.entailmentStatusByAssertion["EL-UNIT-OHM-001"]).toBe("UNSUPPORTED");
    expect(report.releaseConfidence.level).toBe("LIMITED");
  });

  it("E (task section 32/53, copyright/source-leakage firebreak): none of the new CC-09D assertion statements contain official-assessment-item wording patterns (no verbatim distractor-option phrasing, no \"Question N\"/item-numbering artefacts) -- every statement is an independently-authored governed proposition, not transcribed exam text", () => {
    const newIds = ["EL-REL-IMPEDANCE-001", "EL-UNIT-WEBER-001", "EL-UNIT-TESLA-001", "EL-REL-FLUX-CHANGE-EMF-001"];
    for (const id of newIds) {
      const version = cc04Unit202ElectricalScience.assertionVersions.find((v) => v.assertionIdentifier === id)!;
      expect(version.statement).not.toMatch(/^[A-D]\.\s/);
      expect(version.statement.toLowerCase()).not.toContain("question ");
      expect(version.statement.length).toBeLessThan(300);
    }
  });

  it("F (CC-09D.1, Project Architect correction): EL-REL-FLUX-CHANGE-EMF-001 states the single-loop form its own source and formula actually support -- never implies a generic multi-turn coil without the N factor its N-turn formula would require", () => {
    const version = cc04Unit202ElectricalScience.assertionVersions.find(
      (v) => v.assertionIdentifier === "EL-REL-FLUX-CHANGE-EMF-001",
    )!;
    expect(version.statement.toLowerCase()).not.toContain("coil");
    expect(version.statement.toLowerCase()).toContain("single loop");
    // The single-loop formula given (e = change in flux / time taken)
    // carries no turns-count factor -- the statement must never claim
    // this holds for a multi-turn coil, which would require an explicit N.
    expect(version.statement).not.toMatch(/\bN\b/);

    const obligation = AC_OBLIGATIONS.find((s) => s.acNumber === "5.4")!.obligations.find(
      (o) => o.id === "flux-change-emf-calculation",
    )!;
    expect(obligation.description.toLowerCase()).toContain("single loop");
    expect(obligation.description.toLowerCase()).not.toContain("coil");
  });
});

describe("report-coverage-matrix: CC-09F gear-ratio numerator/denominator direction (task section 1)", () => {
  it("mechanically distinguishes the speed ratio (omega_out/omega_in = N_in/N_out) from the torque/mechanical-advantage ratio (tau_out/tau_in = N_out/N_in) as cited by loc-ucsd-gear-ratio-tooth-count-torque, and confirms FP-REL-GEAR-RATIO-001's own direction matches the TORQUE convention, never the speed one", () => {
    const locator = cc04Unit202ElectricalScience.sourceLocators.find((l) => l.key === "loc-ucsd-gear-ratio-tooth-count-torque")!;

    // Extract both formulas directly from the cited source's own recorded
    // summary text -- never hand-duplicated -- so this test tracks the
    // real locator, not a copy of it.
    const speedMatch = /omega_out\/omega_in = (n_\w+)\/(n_\w+)/.exec(locator.locatorSummary);
    const torqueMatch = /tau_out\/tau_in = (n_\w+)\/(n_\w+)/.exec(locator.locatorSummary);
    expect(speedMatch, "locator must state the speed-ratio formula").not.toBeNull();
    expect(torqueMatch, "locator must state the torque-ratio formula").not.toBeNull();
    const [, speedNum, speedDen] = speedMatch!;
    const [, torqueNum, torqueDen] = torqueMatch!;

    // The two formulas must be genuine inverses of each other (numerator
    // and denominator swapped) -- this is the exact structural shape of
    // the CC-09E's original defect: copying one ratio's direction into a
    // statement about the other silently produces the reciprocal claim.
    expect(torqueNum).toBe(speedDen);
    expect(torqueDen).toBe(speedNum);
    expect(torqueNum).not.toBe(torqueDen);

    // FP-REL-GEAR-RATIO-001 states mechanical advantage (a TORQUE ratio,
    // output/input -- matching FP-CONCEPT-MECHANICAL-ADVANTAGE-001's own
    // load/effort = output/input framing), so its own driven/driving
    // radius-and-tooth-count order must match the torque convention
    // (n_out/n_in = driven/driving), never the speed convention.
    const version = cc04Unit202ElectricalScience.assertionVersions.find(
      (v) => v.assertionIdentifier === "FP-REL-GEAR-RATIO-001",
    )!;
    expect(version.statement).toMatch(/driven gear's radius to the driving gear's radius/i);
    expect(version.statement).not.toMatch(/driving gear's radius to the driven gear's radius/i);
    expect(version.statement).toMatch(/driven tooth count to driving tooth count/i);
    expect(version.statement).not.toMatch(/driving tooth count to driven tooth count/i);
  });

  it("regression (CC-09F QA-gap fix): FP-REL-GEAR-RATIO-001's own clauseCoverage names the directional formula explicitly, not merely the undirected topic -- the original defect passed multi-source entailment precisely because its UCSD clause asserted only 'MA can be expressed as a tooth-count ratio' (topic-level, direction-agnostic), which a clause-by-clause topic audit could satisfy without ever checking numerator/denominator order. Pinning the direction into the clause text itself closes that specific gap without redesigning the entailment engine.", () => {
    const version = cc04Unit202ElectricalScience.assertionVersions.find(
      (v) => v.assertionIdentifier === "FP-REL-GEAR-RATIO-001",
    )!;
    const ucsdClause = version.clauseCoverage?.find((c) => c.sourceLocatorKey === "loc-ucsd-gear-ratio-tooth-count-torque");
    expect(ucsdClause, "the UCSD clause must exist").toBeDefined();
    expect(ucsdClause!.clause).toMatch(/output\/input/i);
    expect(ucsdClause!.clause).toMatch(/driven\/driving/i);
    expect(ucsdClause!.clause).toMatch(/tau_out\/tau_in\s*=\s*n_out\/n_in/);
  });
});

describe("report-coverage-matrix: CC-09I remaining Phase-1 audit corrections", () => {
  it("regression (task section 4): cap.foundational.gears.recognise's REQUIRED description names only the genuinely REQUIRED gear knowledge (the 'gears' obligation: gear principle + gear-ratio mechanical advantage), never the SUPPORTS-only direction-reversal/idler-gear/speed-torque-tradeoff content -- a required capability's own description must never silently promote SUPPORTING knowledge to mandatory syllabus mastery", () => {
    const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
    const gearsCapability = pedagogy.capabilities.find((c) => c.id === "cap.foundational.gears.recognise")!;
    expect(gearsCapability).toBeDefined();
    expect(gearsCapability.description).not.toMatch(/direction/i);
    expect(gearsCapability.description).not.toMatch(/idler/i);
    expect(gearsCapability.description).not.toMatch(/speed.{0,15}torque|torque.{0,15}speed/i);
    expect(gearsCapability.description).toMatch(/mechanical advantage/i);

    // Cross-check directly against the knowledge graph: the assertions
    // this description alludes to (direction reversal, idler) are
    // genuinely SUPPORTS-only, never REQUIRED_FOR any curriculum node --
    // confirming the description's narrowing was evidence-justified, not
    // arbitrary.
    const supportsOnlyIds = ["FP-GEAR-DIRECTION-REVERSAL-001", "FP-GEAR-IDLER-001", "FP-GEAR-SPEED-TORQUE-TRADEOFF-001"];
    for (const id of supportsOnlyIds) {
      const mappings = cc04Unit202ElectricalScience.assertionCurriculumMappings.filter((m) => m.assertionIdentifier === id);
      expect(mappings.length, `${id} must have at least one curriculum mapping`).toBeGreaterThan(0);
      expect(mappings.every((m) => m.mappingType === "SUPPORTS"), `${id} must never be REQUIRED_FOR`).toBe(true);
    }
    // The genuinely required pair remains REQUIRED_FOR.
    for (const id of ["FP-CONCEPT-GEAR-001", "FP-REL-GEAR-RATIO-001"]) {
      const mappings = cc04Unit202ElectricalScience.assertionCurriculumMappings.filter((m) => m.assertionIdentifier === id);
      expect(mappings.some((m) => m.mappingType === "REQUIRED_FOR"), `${id} must be REQUIRED_FOR`).toBe(true);
    }
  });

  it("regression (task section 6): the electron-theory statement is scoped to metallic conductors and does not contradict the governed electrolyte/electrolysis content (ionic, not free-electron, charge transport)", () => {
    const electronTheory = cc04Unit202ElectricalScience.assertionVersions.find(
      (v) => v.assertionIdentifier === "EL-CONCEPT-ELECTRON-THEORY-001",
    )!;
    expect(electronTheory.statement).toMatch(/metallic conductor/i);

    const conductor = cc04Unit202ElectricalScience.assertionVersions.find((v) => v.assertionIdentifier === "EL-CONCEPT-CONDUCTOR-001")!;
    expect(conductor.statement).toMatch(/metallic conductor/i);

    const chemicalEffect = cc04Unit202ElectricalScience.assertionVersions.find(
      (v) => v.assertionIdentifier === "EL-CURRENT-CHEMICAL-EFFECT-001",
    )!;
    expect(chemicalEffect).toBeDefined();
    // The electrolysis assertion must never be reworded to imply free-
    // electron transport through the electrolyte -- it correctly stays
    // silent on the transport mechanism, never claiming "free electron".
    expect(chemicalEffect.statement.toLowerCase()).not.toContain("free electron");
  });

  it("regression (task section 1/15): FP-CALC-POWER-001, FP-CALC-EFFICIENCY-001 and FP-REL-WEIGHT-MASS-001 -- the exact CC-09G-baseline false-green -- are no longer standalone, and FP-CALC-WEIGHT-001 (genuinely not obligation-named) correctly remains standalone", () => {
    const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
    const standaloneIds = new Set(pedagogy.standaloneAssertions.map((s) => s.assertionIdentifier));
    for (const id of ["FP-CALC-POWER-001", "FP-CALC-EFFICIENCY-001", "FP-REL-WEIGHT-MASS-001"]) {
      expect(standaloneIds.has(id), `${id} must no longer be standalone`).toBe(false);
      const memberOf = pedagogy.assertionFamilyMemberships.find((m) => m.assertionIdentifier === id);
      expect(memberOf, `${id} must be a real family member`).toBeDefined();
    }
    expect(standaloneIds.has("FP-CALC-WEIGHT-001")).toBe(true);
  });
});
