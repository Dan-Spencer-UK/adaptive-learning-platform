import { describe, expect, it } from "vitest";

import { sourceAcquisitionManifestSchema } from "@alp/content-schema";

import { unit202DepthPerformanceMatrix } from "./data/unit202-depth-performance-matrix.ts";
import { unit202SourceAcquisitionManifest } from "./data/unit202-source-acquisition-manifest.ts";
import { buildReport, isReportClean } from "./validate-unit202-source-acquisition-manifest.ts";

// CC-14: proves the REAL Unit 202 Source-Acquisition Manifest instance is
// loadable, valid, and provides complete AC/Range coverage of the real
// approved matrix it was derived from -- distinguishing schema-capable
// from real-corpus-adopted exactly as the matrix's own test file does.
describe("CC-14 Unit 202 Source-Acquisition Manifest -- real-instance validation", () => {
  it("REAL-CORPUS-ADOPTED: the real manifest parses against sourceAcquisitionManifestSchema without modification", () => {
    expect(() => sourceAcquisitionManifestSchema.parse(unit202SourceAcquisitionManifest)).not.toThrow();
  });

  it("PRODUCTION-LOADABLE: the real manifest report is entirely clean", () => {
    const report = buildReport();
    expect(isReportClean(report)).toBe(true);
  });

  it("every one of the matrix's 23 ACs is covered by at least one cluster", () => {
    const report = buildReport();
    expect(report.acsWithoutClusterCoverage).toEqual([]);
  });

  it("every one of the matrix's 58 official Range items is covered by at least one cluster", () => {
    const report = buildReport();
    expect(report.rangeItemsWithoutClusterCoverage).toEqual([]);
  });

  it("no cluster references an AC or Range item that does not genuinely exist in the matrix", () => {
    const report = buildReport();
    expect(report.clustersReferencingUnknownAc).toEqual([]);
    expect(report.clustersReferencingUnknownRangeItem).toEqual([]);
  });

  it("every cluster is UNSOURCED by default -- no cluster claims sourced status without exact repo evidence, and C&G teaching material alone is never treated as sufficient", () => {
    const report = buildReport();
    expect(report.sourcedClusterCount).toBe(0);
    expect(report.unsourcedClusterCount).toBe(unit202SourceAcquisitionManifest.clusters.length);
    for (const cluster of unit202SourceAcquisitionManifest.clusters) {
      expect(cluster.status).toBe("UNSOURCED");
      expect(cluster.existingGovernedSourceEvidence).toBeUndefined();
    }
  });

  it("has no duplicate cluster keys", () => {
    const keys = unit202SourceAcquisitionManifest.clusters.map((c) => c.clusterKey);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("every cluster declares at least one required source characteristic and at least one factual proposition requiring support", () => {
    for (const cluster of unit202SourceAcquisitionManifest.clusters) {
      expect(cluster.requiredSourceCharacteristics.length).toBeGreaterThan(0);
      expect(cluster.factualPropositionsRequiringSupport.length).toBeGreaterThan(0);
    }
  });

  it("clusters are grouped by reusable domain-knowledge topic, not mechanically one-per-AC (fewer clusters than ACs)", () => {
    expect(unit202SourceAcquisitionManifest.clusters.length).toBeLessThan(unit202DepthPerformanceMatrix.assessmentCriteria.length);
  });
});

describe("CC-14 Unit 202 Source-Acquisition Manifest -- tamper-and-assert regressions", () => {
  it("SCHEMA-CAPABLE: a duplicate clusterKey is rejected at the schema layer", () => {
    const tampered = {
      ...unit202SourceAcquisitionManifest,
      clusters: [...unit202SourceAcquisitionManifest.clusters, { ...unit202SourceAcquisitionManifest.clusters[0]! }],
    };
    expect(() => sourceAcquisitionManifestSchema.parse(tampered)).toThrow();
  });

  it("SCHEMA-CAPABLE: a SOURCED cluster with no existingGovernedSourceEvidence is rejected at the schema layer", () => {
    const tampered = {
      ...unit202SourceAcquisitionManifest,
      clusters: unit202SourceAcquisitionManifest.clusters.map((c, i) => (i === 0 ? { ...c, status: "SOURCED" as const } : c)),
    };
    expect(() => sourceAcquisitionManifestSchema.parse(tampered)).toThrow();
  });

  it("removing a cluster's coverage of an AC is caught as a gap, never silently accepted as complete", () => {
    const tampered = {
      ...unit202SourceAcquisitionManifest,
      clusters: unit202SourceAcquisitionManifest.clusters.filter((c) => c.clusterKey !== "mass-and-weight"),
    };
    const report = buildReport({ manifest: tampered });
    expect(report.acsWithoutClusterCoverage).toContain("3.1");
    expect(isReportClean(report)).toBe(false);
  });

  it("removing a cluster's coverage of a Range item is caught as a gap, never silently accepted as complete", () => {
    const tampered = {
      ...unit202SourceAcquisitionManifest,
      clusters: unit202SourceAcquisitionManifest.clusters.map((c) =>
        c.clusterKey === "sine-wave-characteristics" ? { ...c, relatedRangeItems: c.relatedRangeItems.slice(1) } : c,
      ),
    };
    const report = buildReport({ manifest: tampered });
    expect(report.rangeItemsWithoutClusterCoverage.length).toBeGreaterThan(0);
    expect(isReportClean(report)).toBe(false);
  });

  it("a cluster referencing an AC absent from the matrix is caught, not silently accepted", () => {
    const tampered = {
      ...unit202SourceAcquisitionManifest,
      clusters: unit202SourceAcquisitionManifest.clusters.map((c, i) => (i === 0 ? { ...c, relatedAcNumbers: [...c.relatedAcNumbers, "9.9"] } : c)),
    };
    const report = buildReport({ manifest: tampered });
    expect(report.clustersReferencingUnknownAc.length).toBeGreaterThan(0);
    expect(isReportClean(report)).toBe(false);
  });
});
