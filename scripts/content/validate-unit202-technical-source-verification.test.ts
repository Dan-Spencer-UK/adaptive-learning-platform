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
      /has NO approvedSources record at all/,
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
        { dossierSourceId: "SRC-NOT-IN-DOSSIER", sourceKey: unit202TechnicalSourceVerification.sources[0]!.key, approvedRole: "invented", status: "VERIFIED" as const },
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

describe("CC-15A Unit 202 Technical Source Verification -- VERIFIED-proposition trust-chain hardening", () => {
  // Build a minimal, otherwise-valid manifest skeleton once per test so each
  // adversarial case only has to vary the ONE thing it's testing -- this
  // exercises the real schema/validator boundary (technicalSourceVerification-
  // ManifestSchema itself), not a reimplementation of its logic.
  function baseManifest(): TechnicalSourceVerificationManifest {
    return {
      approvedDossierIdentity: "test dossier",
      sources: [
        { key: "src-a", title: "Source A", sourceRole: "FACTUAL_AUTHORITY" as const },
      ],
      sourceVersions: [
        {
          key: "sv-a",
          sourceKey: "src-a",
          status: "CURRENT" as const,
          rightsClassification: "OPEN" as const,
          verificationStatus: "VERIFIED" as const,
          verifiedBy: "test-verifier",
        },
      ],
      sourceLocators: [{ key: "loc-a", sourceVersionKey: "sv-a", locatorSummary: "test locator" }],
      approvedSources: [
        { dossierSourceId: "SRC-A", sourceKey: "src-a", approvedRole: "test role", status: "VERIFIED" as const },
      ],
      propositionCoverage: [
        {
          clusterKey: "test-cluster",
          requirementKind: "FACTUAL_PROPOSITION" as const,
          requirementText: "Test proposition.",
          coverageState: "VERIFIED" as const,
          supportingSourceLocatorKeys: ["loc-a"],
        },
      ],
    };
  }

  it("passes for the legitimate reuse model: two approved dossier candidates resolving to the same governed source, one VERIFIED, backs a VERIFIED proposition", () => {
    const manifest = baseManifest();
    manifest.approvedSources = [
      { dossierSourceId: "SRC-A", sourceKey: "src-a", approvedRole: "test role", status: "RETRIEVAL_FAILED" as const, retrievalNote: "unrelated failed dossier candidate for the same source" } as never,
      { dossierSourceId: "SRC-A-ALT", sourceKey: "src-a", approvedRole: "test role", status: "VERIFIED" as const },
    ];
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).not.toThrow();
  });

  it("REQUIRED (1): VERIFIED proposition citing a locator whose source has NO approvedSources entry at all is rejected", () => {
    const manifest = baseManifest();
    manifest.approvedSources = [];
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).toThrow(
      /NO approvedSources record at all/,
    );
  });

  it("REQUIRED (2): VERIFIED proposition citing a locator whose source's approvedSources record is RETRIEVAL_FAILED is rejected", () => {
    const manifest = baseManifest();
    manifest.approvedSources = [
      {
        dossierSourceId: "SRC-A",
        sourceKey: "src-a",
        approvedRole: "test role",
        status: "RETRIEVAL_FAILED" as const,
        retrievalNote: "simulated failure for adversarial test",
      },
    ];
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).toThrow(
      /RETRIEVAL_FAILED or APPROVED_NOT_VERIFIED dossier source/,
    );
  });

  it("REQUIRED (2b): VERIFIED proposition citing a locator whose source's approvedSources record is APPROVED_NOT_VERIFIED is rejected", () => {
    const manifest = baseManifest();
    manifest.approvedSources = [
      { dossierSourceId: "SRC-A", sourceKey: "src-a", approvedRole: "test role", status: "APPROVED_NOT_VERIFIED" as const },
    ];
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).toThrow(
      /RETRIEVAL_FAILED or APPROVED_NOT_VERIFIED dossier source/,
    );
  });

  it("REQUIRED (3): VERIFIED proposition citing a locator whose sourceVersion.verificationStatus is not VERIFIED is rejected", () => {
    const manifest = baseManifest();
    manifest.sourceVersions = [{ ...manifest.sourceVersions[0]!, verificationStatus: "UNVERIFIED" as const, verifiedBy: undefined as never }];
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).toThrow(
      /not VERIFIED -- an unverified or verification-failed source snapshot/,
    );
  });

  it("REQUIRED (3b): VERIFIED proposition citing a locator whose sourceVersion.verificationStatus is VERIFICATION_FAILED is rejected", () => {
    const manifest = baseManifest();
    manifest.sourceVersions = [{ ...manifest.sourceVersions[0]!, verificationStatus: "VERIFICATION_FAILED" as const, verifiedBy: "test-verifier" }];
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).toThrow(
      /not VERIFIED -- an unverified or verification-failed source snapshot/,
    );
  });

  it("REQUIRED (4): VERIFIED proposition citing an otherwise-structurally-valid but wholly unapproved source/sourceVersion/sourceLocator chain is rejected", () => {
    const manifest = baseManifest();
    // A second, internally-consistent source/sourceVersion/sourceLocator
    // triple that was never approved by the dossier at all -- structurally
    // indistinguishable from a legitimate one except for having no
    // approvedSources entry.
    manifest.sources.push({ key: "src-unapproved", title: "Unapproved Source", sourceRole: "FACTUAL_AUTHORITY" as const });
    manifest.sourceVersions.push({
      key: "sv-unapproved",
      sourceKey: "src-unapproved",
      status: "CURRENT" as const,
      rightsClassification: "OPEN" as const,
      verificationStatus: "VERIFIED" as const,
      verifiedBy: "test-verifier",
    });
    manifest.sourceLocators.push({ key: "loc-unapproved", sourceVersionKey: "sv-unapproved", locatorSummary: "test locator" });
    manifest.propositionCoverage[0]!.supportingSourceLocatorKeys = ["loc-unapproved"];
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).toThrow(
      /NO approvedSources record at all/,
    );
  });

  it("a SOURCE_GAP or CONDITIONAL_SOURCE_GAP record is NOT subject to the trust-chain gate (it cites no locator, or an untrustworthy one is irrelevant to a claim that is not itself VERIFIED)", () => {
    const manifest = baseManifest();
    // Leave src-a's approvedSources entry RETRIEVAL_FAILED -- would fail the
    // trust-chain gate if any VERIFIED proposition cited it, but must not
    // affect a SOURCE_GAP/CONDITIONAL_SOURCE_GAP record that cites no
    // locator at all (schema requires >=1 approvedSources entry overall).
    manifest.approvedSources = [
      { dossierSourceId: "SRC-A", sourceKey: "src-a", approvedRole: "test role", status: "RETRIEVAL_FAILED", retrievalNote: "simulated failure, irrelevant to this test" },
    ];
    manifest.propositionCoverage = [
      {
        clusterKey: "test-cluster",
        requirementKind: "FACTUAL_PROPOSITION" as const,
        requirementText: "Test proposition.",
        coverageState: "SOURCE_GAP" as const,
        supportingSourceLocatorKeys: [],
        gapReason: "no approved source establishes this",
      },
    ];
    expect(() => technicalSourceVerificationManifestSchema.parse(manifest)).not.toThrow();
  });
});
