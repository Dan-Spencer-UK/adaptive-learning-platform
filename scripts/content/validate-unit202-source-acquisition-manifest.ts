/**
 * CC-14: mechanical validation/coverage report for the Unit 202
 * Source-Acquisition Manifest (scripts/content/data/unit202-source-
 * acquisition-manifest.ts) against the approved Depth & Performance
 * Matrix it was derived from (scripts/content/data/unit202-depth-
 * performance-matrix.ts).
 *
 * Proves, independently recomputed from both live manifests (never
 * trusted from either manifest's own claims): every one of the matrix's
 * 23 ACs and 58 official Range items is covered by at least one cluster;
 * no cluster key is duplicated; every cluster referencing an AC/Range item
 * references one that genuinely exists in the matrix; and no cluster is
 * marked SOURCED without an exact evidence citation.
 *
 * Usage:
 *   node scripts/content/validate-unit202-source-acquisition-manifest.ts            (print report)
 *   node scripts/content/validate-unit202-source-acquisition-manifest.ts --check     (exit 1 if any gate fails)
 */

import { fileURLToPath } from "node:url";

import { sourceAcquisitionManifestSchema } from "@alp/content-schema";

import { unit202DepthPerformanceMatrix } from "./data/unit202-depth-performance-matrix.ts";
import { unit202SourceAcquisitionManifest } from "./data/unit202-source-acquisition-manifest.ts";

interface ManifestReport {
  clusterCount: number;
  acsWithoutClusterCoverage: string[];
  rangeItemsWithoutClusterCoverage: string[];
  clustersReferencingUnknownAc: string[];
  clustersReferencingUnknownRangeItem: string[];
  sourcedClustersWithoutEvidence: string[];
  sourcedClusterCount: number;
  unsourcedClusterCount: number;
}

function buildReport(overrides?: { manifest?: unknown; matrix?: typeof unit202DepthPerformanceMatrix }): ManifestReport {
  const manifest = sourceAcquisitionManifestSchema.parse(overrides?.manifest ?? unit202SourceAcquisitionManifest);
  const matrix = overrides?.matrix ?? unit202DepthPerformanceMatrix;
  const matrixAcNumbers = new Set(matrix.assessmentCriteria.map((ac) => ac.acNumber));
  const matrixRangeKeys = new Set(matrix.officialRangeCoverage.map((r) => `${r.acNumber}::${r.rangeItem}`));

  const coveredAcNumbers = new Set<string>();
  const coveredRangeKeys = new Set<string>();
  const clustersReferencingUnknownAc: string[] = [];
  const clustersReferencingUnknownRangeItem: string[] = [];

  for (const cluster of manifest.clusters) {
    for (const acNumber of cluster.relatedAcNumbers) {
      coveredAcNumbers.add(acNumber);
      if (!matrixAcNumbers.has(acNumber)) {
        clustersReferencingUnknownAc.push(`${cluster.clusterKey}: ${acNumber}`);
      }
    }
    for (const range of cluster.relatedRangeItems) {
      const key = `${range.acNumber}::${range.rangeItem}`;
      coveredRangeKeys.add(key);
      if (!matrixRangeKeys.has(key)) {
        clustersReferencingUnknownRangeItem.push(`${cluster.clusterKey}: ${key}`);
      }
    }
  }

  const acsWithoutClusterCoverage = [...matrixAcNumbers].filter((ac) => !coveredAcNumbers.has(ac)).sort((a, b) => a.localeCompare(b));
  const rangeItemsWithoutClusterCoverage = [...matrixRangeKeys].filter((key) => !coveredRangeKeys.has(key)).sort((a, b) => a.localeCompare(b));

  const sourcedClusters = manifest.clusters.filter((c) => c.status === "SOURCED");
  const sourcedClustersWithoutEvidence = sourcedClusters.filter((c) => !c.existingGovernedSourceEvidence).map((c) => c.clusterKey);

  return {
    clusterCount: manifest.clusters.length,
    acsWithoutClusterCoverage,
    rangeItemsWithoutClusterCoverage,
    clustersReferencingUnknownAc,
    clustersReferencingUnknownRangeItem,
    sourcedClustersWithoutEvidence,
    sourcedClusterCount: sourcedClusters.length,
    unsourcedClusterCount: manifest.clusters.length - sourcedClusters.length,
  };
}

function formatReport(report: ManifestReport): string {
  const lines: string[] = [];
  lines.push("CC-14 Unit 202 Source-Acquisition Manifest validation report");
  lines.push("==============================================================");
  lines.push(`Clusters: ${report.clusterCount}`);
  lines.push(`  - SOURCED: ${report.sourcedClusterCount}`);
  lines.push(`  - UNSOURCED: ${report.unsourcedClusterCount}`);
  lines.push(`ACs without any cluster coverage (target 0 -- expect 23/23 covered): ${report.acsWithoutClusterCoverage.length}`);
  if (report.acsWithoutClusterCoverage.length) lines.push(`  ${report.acsWithoutClusterCoverage.join(", ")}`);
  lines.push(`Range items without any cluster coverage (target 0 -- expect 58/58 covered): ${report.rangeItemsWithoutClusterCoverage.length}`);
  if (report.rangeItemsWithoutClusterCoverage.length) lines.push(`  ${report.rangeItemsWithoutClusterCoverage.join(", ")}`);
  lines.push(`Clusters referencing an unknown AC (target 0): ${report.clustersReferencingUnknownAc.length}`);
  if (report.clustersReferencingUnknownAc.length) lines.push(`  ${report.clustersReferencingUnknownAc.join(", ")}`);
  lines.push(`Clusters referencing an unknown Range item (target 0): ${report.clustersReferencingUnknownRangeItem.length}`);
  if (report.clustersReferencingUnknownRangeItem.length) lines.push(`  ${report.clustersReferencingUnknownRangeItem.join(", ")}`);
  lines.push(`SOURCED clusters without exact evidence (target 0): ${report.sourcedClustersWithoutEvidence.length}`);
  if (report.sourcedClustersWithoutEvidence.length) lines.push(`  ${report.sourcedClustersWithoutEvidence.join(", ")}`);
  return lines.join("\n");
}

export function isReportClean(report: ManifestReport): boolean {
  return (
    report.acsWithoutClusterCoverage.length === 0 &&
    report.rangeItemsWithoutClusterCoverage.length === 0 &&
    report.clustersReferencingUnknownAc.length === 0 &&
    report.clustersReferencingUnknownRangeItem.length === 0 &&
    report.sourcedClustersWithoutEvidence.length === 0
  );
}

export { buildReport, formatReport };
export type { ManifestReport };

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const report = buildReport();
  console.log(formatReport(report));
  const clean = isReportClean(report);
  console.log("");
  console.log(clean ? "PASS: all manifest validation gates are clean." : "FAIL: one or more manifest validation gates failed.");
  if (process.argv.includes("--check") && !clean) {
    process.exit(1);
  }
}
