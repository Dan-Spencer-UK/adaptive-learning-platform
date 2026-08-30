import { describe, expect, it } from "vitest";

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

  it("removing an approved dossier source is caught as a missing id, never silently accepted", () => {
    const tampered = {
      ...unit202TechnicalSourceVerification,
      approvedSources: unit202TechnicalSourceVerification.approvedSources.filter((s) => s.dossierSourceId !== "SRC-BIPM-SI-9E-V4.01"),
    };
    const report = buildReport({ verification: tampered });
    expect(report.missingDossierIds).toContain("SRC-BIPM-SI-9E-V4.01");
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
});
