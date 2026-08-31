import { describe, expect, it } from "vitest";

import type { TechnicalSourceVerificationManifest } from "@alp/content-schema";
import { technicalSourceVerificationManifestSchema } from "@alp/content-schema";

import { unit202SourceAcquisitionManifest } from "./data/unit202-source-acquisition-manifest.ts";
import { unit202TechnicalSourceVerification } from "./data/unit202-technical-source-verification.ts";
import {
  EXPECTED_DOSSIER_SOURCE_IDS,
  EXPECTED_SOURCE_GAP_REQUIREMENTS,
  buildReport,
  isReportClean,
} from "./validate-unit202-technical-source-verification.ts";

// CC-15: proves the REAL Unit 202 Technical Source Verification instance is
// loadable, valid, and mechanically consistent with both the approved
// dossier's fixed 67-source catalogue and the real Source-Acquisition
// Manifest it provides proposition coverage for.
describe("CC-15 Unit 202 Technical Source Verification -- real-instance validation", () => {
  it("REAL-CORPUS-ADOPTED: the real verification manifest parses against technicalSourceVerificationManifestSchema without modification", () => {
    expect(() => technicalSourceVerificationManifestSchema.parse(unit202TechnicalSourceVerification)).not.toThrow();
  });

  it("PRODUCTION-LOADABLE: the real verification report is entirely clean", () => {
    const report = buildReport();
    expect(isReportClean(report)).toBe(true);
  });

  it("registers exactly the 67 dossier-approved source ids, no more, no fewer", () => {
    const report = buildReport();
    expect(report.approvedSourceCount).toBe(67);
    expect(report.approvedSourceCount).toBe(EXPECTED_DOSSIER_SOURCE_IDS.length);
    expect(report.missingDossierIds).toEqual([]);
    expect(report.unapprovedDossierIds).toEqual([]);
    expect(report.duplicateDossierIds).toEqual([]);
  });

  it("every source registered as FACTUAL_AUTHORITY -- never NORMATIVE_CURRICULUM or OFFICIAL_ASSESSMENT smuggled in", () => {
    for (const source of unit202TechnicalSourceVerification.sources) {
      expect(source.sourceRole).toBe("FACTUAL_AUTHORITY");
    }
  });

  it("every VERIFIED proposition-coverage record cites at least one real source locator", () => {
    const locatorKeys = new Set(unit202TechnicalSourceVerification.sourceLocators.map((l) => l.key));
    const verified = unit202TechnicalSourceVerification.propositionCoverage.filter((p) => p.coverageState === "VERIFIED");
    expect(verified.length).toBeGreaterThan(0);
    for (const record of verified) {
      expect(record.supportingSourceLocatorKeys.length).toBeGreaterThan(0);
      for (const key of record.supportingSourceLocatorKeys) {
        expect(locatorKeys.has(key)).toBe(true);
      }
    }
  });

  it("every SOURCE_GAP/CONDITIONAL_SOURCE_GAP record states a gapReason -- never a silent, unexplained gap", () => {
    const gaps = unit202TechnicalSourceVerification.propositionCoverage.filter(
      (p) => p.coverageState === "SOURCE_GAP" || p.coverageState === "CONDITIONAL_SOURCE_GAP",
    );
    expect(gaps.length).toBeGreaterThan(0);
    for (const record of gaps) {
      expect(record.gapReason).toBeTruthy();
    }
  });

  it("the two dossier-declared source gaps (telephone master-socket, security-alarm topology) remain SOURCE_GAP", () => {
    for (const expected of EXPECTED_SOURCE_GAP_REQUIREMENTS) {
      const record = unit202TechnicalSourceVerification.propositionCoverage.find(
        (p) => p.clusterKey === expected.clusterKey && p.requirementText === expected.requirementText,
      );
      expect(record).toBeDefined();
      expect(record!.coverageState).toBe("SOURCE_GAP");
    }
  });

  it("every one of the Source-Acquisition Manifest's required-knowledge items across all 20 clusters has exactly one matching coverage record", () => {
    const report = buildReport();
    expect(report.requirementsWithoutCoverage).toEqual([]);
    expect(report.coverageWithUnknownRequirement).toEqual([]);
  });

  it("a cluster is never marked SOURCED in the Source-Acquisition Manifest unless every one of its requirements is genuinely VERIFIED here", () => {
    const report = buildReport();
    expect(report.clustersMarkedSourcedButNotFullyCovered).toEqual([]);
    const sourcedClusterKeys = new Set(
      unit202SourceAcquisitionManifest.clusters.filter((c) => c.status === "SOURCED").map((c) => c.clusterKey),
    );
    for (const clusterKey of sourcedClusterKeys) {
      const cov = report.clusterCoverage.find((c) => c.clusterKey === clusterKey);
      expect(cov?.status).toBe("FULLY_SOURCED");
    }
  });

  it("partial clusters are never miscounted as fully sourced (at least one cluster remains PARTIAL, matching the dossier's own expectation for electronic-systems-and-applications)", () => {
    const report = buildReport();
    expect(report.partialClusterCount).toBeGreaterThan(0);
    const electronicSystems = report.clusterCoverage.find((c) => c.clusterKey === "electronic-systems-and-applications");
    expect(electronicSystems?.status).toBe("PARTIAL");
  });

  it("CC-15B: VERIFIED + SOURCE_GAP + CONDITIONAL_SOURCE_GAP reconciles exactly to the total proposition-record count -- no manually-maintained count may ever contradict the live data", () => {
    const report = buildReport();
    expect(report.verifiedPropositionCount + report.sourceGapCount + report.conditionalSourceGapCount).toBe(
      report.totalPropositionCount,
    );
    expect(report.totalPropositionCount).toBe(unit202TechnicalSourceVerification.propositionCoverage.length);
  });

  it("CC-15B: the itemised residualPropositions list contains exactly every non-VERIFIED proposition once, and nothing else", () => {
    const report = buildReport();
    const expectedResidual = unit202TechnicalSourceVerification.propositionCoverage.filter((p) => p.coverageState !== "VERIFIED");
    expect(report.residualPropositions.length).toBe(expectedResidual.length);
    expect(report.residualPropositions.length).toBe(report.sourceGapCount + report.conditionalSourceGapCount);

    const residualKeys = report.residualPropositions.map((r) => `${r.clusterKey}::${r.requirementText}`);
    expect(new Set(residualKeys).size).toBe(residualKeys.length); // no duplicate entries

    for (const record of expectedResidual) {
      const match = report.residualPropositions.find(
        (r) => r.clusterKey === record.clusterKey && r.requirementText === record.requirementText,
      );
      expect(match).toBeDefined();
      expect(match!.coverageState).toBe(record.coverageState);
    }
    // And nothing VERIFIED leaks into the residual list.
    for (const r of report.residualPropositions) {
      expect(r.coverageState).not.toBe("VERIFIED");
    }
  });

  it("no unknown coverageState/requirementKind value can be introduced (schema enum enforcement)", () => {
    for (const record of unit202TechnicalSourceVerification.propositionCoverage) {
      expect(["VERIFIED", "SOURCE_GAP", "CONDITIONAL_SOURCE_GAP"]).toContain(record.coverageState);
      expect([
        "FACTUAL_PROPOSITION",
        "RELATIONSHIP_OR_MECHANISM",
        "PROCEDURE_OR_CALCULATION_RULE",
        "SYMBOL_OR_CONVENTION",
        "PHYSICAL_OR_COMPONENT_RECOGNITION",
      ]).toContain(record.requirementKind);
    }
  });
});

describe("CC-15 Unit 202 Technical Source Verification -- tamper-and-assert regressions", () => {
  it("SCHEMA-CAPABLE: a VERIFIED coverage record with no supporting locator is rejected at the schema layer", () => {
    const tampered = {
      ...unit202TechnicalSourceVerification,
      propositionCoverage: unit202TechnicalSourceVerification.propositionCoverage.map((p, i) =>
        i === 0 ? { ...p, coverageState: "VERIFIED" as const, supportingSourceLocatorKeys: [] } : p,
      ),
    };
    expect(() => technicalSourceVerificationManifestSchema.parse(tampered)).toThrow();
  });

  it("SCHEMA-CAPABLE: a SOURCE_GAP record with no gapReason is rejected at the schema layer", () => {
    const tampered = {
      ...unit202TechnicalSourceVerification,
      propositionCoverage: unit202TechnicalSourceVerification.propositionCoverage.map((p, i) =>
        i === 0 ? { ...p, coverageState: "SOURCE_GAP" as const, supportingSourceLocatorKeys: [], gapReason: undefined } : p,
      ),
    };
    expect(() => technicalSourceVerificationManifestSchema.parse(tampered)).toThrow();
  });

  it("SCHEMA-CAPABLE: a RETRIEVAL_FAILED approved source with no retrievalNote is rejected at the schema layer", () => {
    const tampered = {
      ...unit202TechnicalSourceVerification,
      approvedSources: unit202TechnicalSourceVerification.approvedSources.map((s, i) =>
        i === 0 ? { ...s, status: "RETRIEVAL_FAILED" as const, retrievalNote: undefined } : s,
      ),
    };
    expect(() => technicalSourceVerificationManifestSchema.parse(tampered)).toThrow();
  });

  it("SCHEMA-CAPABLE: a non-FACTUAL_AUTHORITY source role in this registry is rejected", () => {
    const tampered = {
      ...unit202TechnicalSourceVerification,
      sources: unit202TechnicalSourceVerification.sources.map((s, i) =>
        i === 0 ? { ...s, sourceRole: "NORMATIVE_CURRICULUM" as const } : s,
      ),
    };
    expect(() => technicalSourceVerificationManifestSchema.parse(tampered)).toThrow();
  });

  it("SCHEMA-CAPABLE: a duplicate dossierSourceId is rejected at the schema layer", () => {
    const tampered = {
      ...unit202TechnicalSourceVerification,
      approvedSources: [...unit202TechnicalSourceVerification.approvedSources, { ...unit202TechnicalSourceVerification.approvedSources[0]! }],
    };
    expect(() => technicalSourceVerificationManifestSchema.parse(tampered)).toThrow();
  });

  it("a propositionCoverage record citing an unknown source locator is caught by the manifest's own internal graph integrity", () => {
    const tampered = {
      ...unit202TechnicalSourceVerification,
      propositionCoverage: unit202TechnicalSourceVerification.propositionCoverage.map((p, i) =>
        i === 0 ? { ...p, coverageState: "VERIFIED" as const, supportingSourceLocatorKeys: ["loc-does-not-exist"] } : p,
      ),
    };
    expect(() => technicalSourceVerificationManifestSchema.parse(tampered)).toThrow();
  });

  it("removing an approved dossier source that backs VERIFIED propositions is caught at the schema layer by the trust-chain gate (CC-15A hardening) -- stronger than the pre-hardening report-level-only detection", () => {
    const tampered = {
      ...unit202TechnicalSourceVerification,
      approvedSources: unit202TechnicalSourceVerification.approvedSources.filter((s) => s.dossierSourceId !== "SRC-BIPM-SI-9E-V4.01"),
    };
    expect(() => technicalSourceVerificationManifestSchema.parse(tampered)).toThrow(
      /not bound \(via verifiedSourceLocatorKeys\) to ANY dossier candidate/,
    );
  });

  it("removing an approved dossier source is ALSO caught at the report layer as a missing id (defence in depth) when the tamper does not itself break the trust chain", () => {
    // Use a source with no VERIFIED propositionCoverage evidence depending on
    // it (SRC-OFCOM-FUTURE-LANDLINE is RETRIEVAL_FAILED, so removing its
    // approvedSources entry cannot trip the trust-chain gate) to isolate the
    // report-level missing-id detection from the schema-level trust-chain gate.
    const tampered = {
      ...unit202TechnicalSourceVerification,
      approvedSources: unit202TechnicalSourceVerification.approvedSources.filter(
        (s) => s.dossierSourceId !== "SRC-OFCOM-FUTURE-LANDLINE",
      ),
    };
    const report = buildReport({ verification: tampered });
    expect(report.missingDossierIds).toContain("SRC-OFCOM-FUTURE-LANDLINE");
    expect(isReportClean(report)).toBe(false);
  });

  it("introducing an unapproved source id is caught, never silently treated as legitimate", () => {
    const tampered = {
      ...unit202TechnicalSourceVerification,
      approvedSources: [
        ...unit202TechnicalSourceVerification.approvedSources,
        // APPROVED_NOT_VERIFIED (not VERIFIED) so this tamper isolates the
        // report-level unapproved-id detection under test, without also
        // tripping the schema's own "VERIFIED candidate needs >=1
        // verifiedSourceLocatorKeys" rule -- irrelevant to what this test checks.
        { dossierSourceId: "SRC-NOT-IN-DOSSIER", sourceKey: unit202TechnicalSourceVerification.sources[0]!.key, approvedRole: "invented", status: "APPROVED_NOT_VERIFIED" as const, verifiedSourceLocatorKeys: [] },
      ],
    };
    const report = buildReport({ verification: tampered });
    expect(report.unapprovedDossierIds).toContain("SRC-NOT-IN-DOSSIER");
    expect(isReportClean(report)).toBe(false);
  });

  it("silently flipping the telephone master-socket gap to VERIFIED is caught, never accepted", () => {
    const tampered = {
      ...unit202TechnicalSourceVerification,
      propositionCoverage: unit202TechnicalSourceVerification.propositionCoverage.map((p) =>
        p.clusterKey === "electronic-systems-and-applications" && p.requirementText.startsWith("Telephone system:")
          ? { ...p, coverageState: "VERIFIED" as const, supportingSourceLocatorKeys: ["loc-openreach-digital-phone"], gapReason: undefined }
          : p,
      ),
    };
    const report = buildReport({ verification: tampered });
    expect(report.expectedGapsNoLongerGaps.length).toBeGreaterThan(0);
    expect(isReportClean(report)).toBe(false);
  });

  it("silently flipping the security-alarm topology gap to VERIFIED is caught, never accepted", () => {
    const tampered = {
      ...unit202TechnicalSourceVerification,
      propositionCoverage: unit202TechnicalSourceVerification.propositionCoverage.map((p) =>
        p.clusterKey === "electronic-systems-and-applications" && p.requirementText.startsWith("Security alarm:")
          ? { ...p, coverageState: "VERIFIED" as const, supportingSourceLocatorKeys: ["loc-rohm-npn-switch"], gapReason: undefined }
          : p,
      ),
    };
    const report = buildReport({ verification: tampered });
    expect(report.expectedGapsNoLongerGaps.length).toBeGreaterThan(0);
    expect(isReportClean(report)).toBe(false);
  });

  it("removing a manifest requirement's coverage record is caught as a dropped requirement, never silently accepted as complete", () => {
    const tampered = {
      ...unit202TechnicalSourceVerification,
      propositionCoverage: unit202TechnicalSourceVerification.propositionCoverage.filter(
        (p) => !(p.clusterKey === "mass-and-weight" && p.requirementText.startsWith("W = mg")),
      ),
    };
    const report = buildReport({ verification: tampered });
    expect(report.requirementsWithoutCoverage.length).toBeGreaterThan(0);
    expect(isReportClean(report)).toBe(false);
  });

  it("a cluster the Source-Acquisition Manifest claims SOURCED without full coverage is caught, never silently trusted", () => {
    const tamperedManifest = {
      ...unit202SourceAcquisitionManifest,
      clusters: unit202SourceAcquisitionManifest.clusters.map((c) =>
        c.clusterKey === "conductors-and-insulators"
          ? { ...c, status: "SOURCED" as const, existingGovernedSourceEvidence: "fabricated evidence for tamper test" }
          : c,
      ),
    };
    const report = buildReport({ manifest: tamperedManifest });
    expect(report.clustersMarkedSourcedButNotFullyCovered).toContain("conductors-and-insulators");
    expect(isReportClean(report)).toBe(false);
  });

  it("a duplicate proposition-coverage record is rejected at the schema layer, even when it would mask a less favourable original record", () => {
    const original = unit202TechnicalSourceVerification.propositionCoverage.find(
      (p) => p.coverageState === "SOURCE_GAP",
    )!;
    const tampered = {
      ...unit202TechnicalSourceVerification,
      propositionCoverage: [
        ...unit202TechnicalSourceVerification.propositionCoverage,
        // A second, more favourable record for the SAME requirement --
        // exactly the "smuggle a nicer coverageState in as a second record"
        // attack the duplicate gate exists to catch.
        {
          clusterKey: original.clusterKey,
          requirementKind: original.requirementKind,
          requirementText: original.requirementText,
          coverageState: "VERIFIED" as const,
          supportingSourceLocatorKeys: [unit202TechnicalSourceVerification.sourceLocators[0]!.key],
        },
      ],
    };
    expect(() => technicalSourceVerificationManifestSchema.parse(tampered)).toThrow(
      /duplicate proposition coverage record/,
    );
  });
});

describe("CC-15B Unit 202 Technical Source Verification -- candidate-to-locator provenance binding", () => {
  // Build a minimal, otherwise-valid manifest skeleton per test so each
  // adversarial case only has to vary the ONE thing it's testing -- this
  // exercises the real schema/validator boundary (technicalSourceVerification-
  // ManifestSchema itself), not a reimplementation of its logic. Two
  // candidates (A, B) share ONE sourceKey/sourceVersion throughout, matching
  // the Project-Architect-specified shared-source scenario -- A is
  // RETRIEVAL_FAILED and bound to loc-a-only, B is VERIFIED and bound to
  // loc-b-only, so any test wiring a proposition to loc-a is proving A's
  // failure/non-verification is never laundered by B's success.
  function baseManifest(): TechnicalSourceVerificationManifest {
    return {
      approvedDossierIdentity: "test dossier",
      sources: [{ key: "src-shared", title: "Shared Source", sourceRole: "FACTUAL_AUTHORITY" as const }],
      sourceVersions: [
        {
          key: "sv-shared",
          sourceKey: "src-shared",
          status: "CURRENT" as const,
          rightsClassification: "OPEN" as const,
          verificationStatus: "VERIFIED" as const,
          verifiedBy: "test-verifier",
        },
      ],
      sourceLocators: [
        { key: "loc-a", sourceVersionKey: "sv-shared", locatorSummary: "locator for candidate A's section" },
        { key: "loc-b", sourceVersionKey: "sv-shared", locatorSummary: "locator for candidate B's section" },
      ],
      approvedSources: [
        {
          dossierSourceId: "SRC-CANDIDATE-A",
          sourceKey: "src-shared",
          approvedRole: "test role A",
          status: "RETRIEVAL_FAILED" as const,
          retrievalNote: "candidate A's own retrieval failed, independent of candidate B on the same source",
          verifiedSourceLocatorKeys: [],
        },
        {
          dossierSourceId: "SRC-CANDIDATE-B",
          sourceKey: "src-shared",
          approvedRole: "test role B",
          status: "VERIFIED" as const,
          verifiedSourceLocatorKeys: ["loc-b"],
        },
      ],
      propositionCoverage: [
        {
          clusterKey: "test-cluster",
          requirementKind: "FACTUAL_PROPOSITION" as const,
          requirementText: "Test proposition.",
          coverageState: "VERIFIED" as const,
          supportingSourceLocatorKeys: ["loc-b"],
        },
      ],
    };
  }

  it("A: proposition cites a locator belonging to a RETRIEVAL_FAILED candidate (A) sharing a source with a VERIFIED candidate (B) -- REJECTED, never laundered via B", () => {
    const manifest = baseManifest();
    manifest.propositionCoverage[0]!.supportingSourceLocatorKeys = ["loc-a"];
    // A, being RETRIEVAL_FAILED, is schema-enforced to have ZERO
    // verifiedSourceLocatorKeys (rule H below) -- so loc-a can never be
    // bound to A at all, and B's own binding is scoped to loc-b only. The
    // mechanism by which "A's locator is never laundered via B" is
    // therefore that loc-a ends up bound to NO candidate whatsoever, not
    // that it's bound to a candidate whose status happens to be wrong.
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).toThrow(
      /not bound \(via verifiedSourceLocatorKeys\) to ANY dossier candidate/,
    );
  });

  it("B: same shared-source setup, proposition cites the locator bound to VERIFIED candidate B -- PASSES", () => {
    const manifest = baseManifest(); // already cites loc-b (candidate B) by default
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).not.toThrow();
  });

  it("C: VERIFIED proposition cites an existing locator bound to NO dossier candidate at all -- REJECTED", () => {
    const manifest = baseManifest();
    manifest.sourceLocators.push({ key: "loc-unbound", sourceVersionKey: "sv-shared", locatorSummary: "never bound to any candidate" });
    manifest.propositionCoverage[0]!.supportingSourceLocatorKeys = ["loc-unbound"];
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).toThrow(
      /not bound \(via verifiedSourceLocatorKeys\) to ANY dossier candidate/,
    );
  });

  it("D: VERIFIED proposition cites a locator whose bound candidate is APPROVED_NOT_VERIFIED -- REJECTED", () => {
    const manifest = baseManifest();
    manifest.approvedSources = [
      { dossierSourceId: "SRC-CANDIDATE-B", sourceKey: "src-shared", approvedRole: "test role B", status: "APPROVED_NOT_VERIFIED" as const, verifiedSourceLocatorKeys: [] },
    ];
    // APPROVED_NOT_VERIFIED must carry zero verifiedSourceLocatorKeys (schema-enforced), so no
    // candidate binds loc-b at all here -- this simultaneously proves the
    // "no VERIFIED candidate binds this locator" rejection for an
    // APPROVED_NOT_VERIFIED candidate specifically.
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).toThrow(
      /not bound \(via verifiedSourceLocatorKeys\) to ANY dossier candidate/,
    );
  });

  it("E: VERIFIED proposition cites a locator whose bound candidate is RETRIEVAL_FAILED -- REJECTED (same mechanism as A, single-candidate case)", () => {
    const manifest = baseManifest();
    manifest.approvedSources = [
      { dossierSourceId: "SRC-CANDIDATE-A", sourceKey: "src-shared", approvedRole: "test role A", status: "RETRIEVAL_FAILED" as const, retrievalNote: "failed", verifiedSourceLocatorKeys: [] },
    ];
    manifest.propositionCoverage[0]!.supportingSourceLocatorKeys = ["loc-a"];
    // No VERIFIED candidate exists at all here -- caught as "not bound to
    // ANY dossier candidate" (loc-a's only candidate, A, is RETRIEVAL_FAILED
    // and schema-enforced to have zero verifiedSourceLocatorKeys).
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).toThrow(
      /not bound \(via verifiedSourceLocatorKeys\) to ANY dossier candidate/,
    );
  });

  it("F: a VERIFIED dossier candidate claims a verifiedSourceLocatorKeys entry whose chain reaches a DIFFERENT sourceKey -- REJECTED", () => {
    const manifest = baseManifest();
    manifest.sources.push({ key: "src-other", title: "Other Source", sourceRole: "FACTUAL_AUTHORITY" as const });
    manifest.sourceVersions.push({
      key: "sv-other", sourceKey: "src-other", status: "CURRENT" as const, rightsClassification: "OPEN" as const,
      verificationStatus: "VERIFIED" as const, verifiedBy: "test-verifier",
    });
    manifest.sourceLocators.push({ key: "loc-other", sourceVersionKey: "sv-other", locatorSummary: "belongs to a different source" });
    // Candidate B declares sourceKey "src-shared" but claims a locator that
    // actually resolves to "src-other" -- a candidate may only bind locators
    // belonging to its own declared source.
    manifest.approvedSources[1]!.verifiedSourceLocatorKeys = ["loc-other"];
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).toThrow(
      /resolves through source version .* to a DIFFERENT source/,
    );
  });

  it("G: a VERIFIED dossier candidate has no verifiedSourceLocatorKeys -- REJECTED", () => {
    const manifest = baseManifest();
    manifest.approvedSources[1]!.verifiedSourceLocatorKeys = [];
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).toThrow(
      /has status VERIFIED but names no verifiedSourceLocatorKeys/,
    );
  });

  it("H: a RETRIEVAL_FAILED candidate claiming a verifiedSourceLocatorKey -- REJECTED", () => {
    const manifest = baseManifest();
    manifest.approvedSources[0]!.verifiedSourceLocatorKeys = ["loc-a"];
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).toThrow(
      /has status 'RETRIEVAL_FAILED' but claims 1 verifiedSourceLocatorKeys/,
    );
  });

  it("H (APPROVED_NOT_VERIFIED variant): an APPROVED_NOT_VERIFIED candidate claiming a verifiedSourceLocatorKey -- REJECTED", () => {
    const manifest = baseManifest();
    manifest.approvedSources[0]! = {
      dossierSourceId: "SRC-CANDIDATE-A", sourceKey: "src-shared", approvedRole: "test role A",
      status: "APPROVED_NOT_VERIFIED" as const, verifiedSourceLocatorKeys: ["loc-a"],
    };
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).toThrow(
      /has status 'APPROVED_NOT_VERIFIED' but claims 1 verifiedSourceLocatorKeys/,
    );
  });

  it("I: locator reaches a sourceVersion whose verificationStatus is not VERIFIED -- REJECTED", () => {
    const manifest = baseManifest();
    manifest.sourceVersions[0]!.verificationStatus = "UNVERIFIED" as const;
    manifest.sourceVersions[0]!.verifiedBy = undefined;
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).toThrow(
      /verifiedSourceLocatorKeys includes 'loc-b', whose source version 'sv-shared' has verificationStatus 'UNVERIFIED', not VERIFIED/,
    );
  });

  it("J: legitimate reuse -- two VERIFIED candidates intentionally map to the same governed source AND sourceVersion, each with its own explicit locator binding -- PASSES", () => {
    const manifest = baseManifest();
    manifest.approvedSources[0]! = {
      dossierSourceId: "SRC-CANDIDATE-A", sourceKey: "src-shared", approvedRole: "test role A",
      status: "VERIFIED" as const, verifiedSourceLocatorKeys: ["loc-a"],
    };
    // Now both A and B are legitimately VERIFIED on the same source/sourceVersion,
    // each binding only its own section's locator -- a proposition citing
    // either locator should pass, and neither candidate's binding leaks to
    // support a claim the OTHER candidate's locator would be needed for.
    manifest.propositionCoverage = [
      { clusterKey: "test-cluster", requirementKind: "FACTUAL_PROPOSITION" as const, requirementText: "Proposition via A.", coverageState: "VERIFIED" as const, supportingSourceLocatorKeys: ["loc-a"] },
      { clusterKey: "test-cluster", requirementKind: "FACTUAL_PROPOSITION" as const, requirementText: "Proposition via B.", coverageState: "VERIFIED" as const, supportingSourceLocatorKeys: ["loc-b"] },
    ];
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).not.toThrow();
  });

  it("K: the duplicate clusterKey+requirementText masking gate remains enforced under the new candidate-binding architecture", () => {
    const manifest = baseManifest();
    manifest.propositionCoverage.push({
      clusterKey: "test-cluster", requirementKind: "FACTUAL_PROPOSITION" as const, requirementText: "Test proposition.",
      coverageState: "SOURCE_GAP" as const, supportingSourceLocatorKeys: [], gapReason: "a duplicate trying to mask the original VERIFIED record",
    });
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).toThrow(
      /duplicate proposition coverage record/,
    );
  });

  it("a SOURCE_GAP or CONDITIONAL_SOURCE_GAP record is NOT subject to the candidate-binding gate (it cites no locator, or an untrustworthy one is irrelevant to a claim that is not itself VERIFIED)", () => {
    const manifest = baseManifest();
    manifest.approvedSources = [
      { dossierSourceId: "SRC-CANDIDATE-A", sourceKey: "src-shared", approvedRole: "test role A", status: "RETRIEVAL_FAILED" as const, retrievalNote: "irrelevant to this test", verifiedSourceLocatorKeys: [] },
    ];
    manifest.propositionCoverage = [
      {
        clusterKey: "test-cluster", requirementKind: "FACTUAL_PROPOSITION" as const, requirementText: "Test proposition.",
        coverageState: "SOURCE_GAP" as const, supportingSourceLocatorKeys: [], gapReason: "no approved source establishes this",
      },
    ];
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).not.toThrow();
  });
});
