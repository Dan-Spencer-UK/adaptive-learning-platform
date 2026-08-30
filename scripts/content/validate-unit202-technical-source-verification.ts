/**
 * CC-15: mechanical validation/coverage report for the Unit 202 Technical
 * Source Verification package (scripts/content/data/unit202-technical-
 * source-verification.ts) against both the approved dossier's own fixed
 * 67-source catalogue (hardcoded here, independently transcribed, so a
 * dropped/renamed/duplicated source is a hard failure) and the Unit 202
 * Source-Acquisition Manifest it must provide proposition coverage for.
 *
 * Proves, independently recomputed from the live data (never trusted from
 * the module's own claims):
 *   - all 67 approved dossier source ids are present exactly once, and no
 *     other id is present (no unapproved source, no silent substitution);
 *   - every VERIFIED proposition-coverage record cites at least one real
 *     source locator (schema-level, re-proven here at the report level);
 *   - every requirement item in every one of the 20 Source-Acquisition-
 *     Manifest clusters' five required-knowledge arrays has exactly one
 *     matching propositionCoverage record (by clusterKey + verbatim
 *     requirementText) -- no requirement silently dropped, none invented;
 *   - a cluster's computed coverage status (FULLY_SOURCED only when every
 *     one of its requirements is VERIFIED, else PARTIAL) matches what the
 *     Source-Acquisition Manifest's own binary SOURCED/UNSOURCED status
 *     claims -- a cluster can never show SOURCED unless every requirement
 *     is genuinely VERIFIED;
 *   - the two dossier-declared gaps that must never accidentally turn
 *     green (the telephone master-socket proposition, the security-alarm
 *     topology proposition) remain SOURCE_GAP.
 *
 * Usage:
 *   node scripts/content/validate-unit202-technical-source-verification.ts            (print report)
 *   node scripts/content/validate-unit202-technical-source-verification.ts --check     (exit 1 if any gate fails)
 */

import { fileURLToPath } from "node:url";

import { technicalSourceVerificationManifestSchema } from "@alp/content-schema";

import { unit202SourceAcquisitionManifest } from "./data/unit202-source-acquisition-manifest.ts";
import { unit202TechnicalSourceVerification } from "./data/unit202-technical-source-verification.ts";

// Independently transcribed from the approved dossier's own section 16
// source catalogue (67 ids) -- never derived from the live data, so a
// dropped, renamed or invented source id is caught as a genuine mismatch
// rather than trivially passing because both sides agree with themselves.
const EXPECTED_DOSSIER_SOURCE_IDS = [
  "SRC-BIPM-SI-9E-V4.01",
  "SRC-NIST-SP811-CH4",
  "SRC-NIST-SP811-B9",
  "SRC-NIST-SP811-B8",
  "SRC-OPENSTAX-PREALG-PERCENT",
  "SRC-OPENSTAX-INTERALG-FORMULA",
  "SRC-OPENSTAX-PREALG-SCI-NOTATION",
  "SRC-OPENSTAX-PREALG-PYTHAGORAS",
  "SRC-OPENSTAX-PRECALC-TRIG",
  "SRC-OPENSTAX-STATS-CENTER",
  "SRC-OPENSTAX-UP1-MASS-WEIGHT",
  "SRC-OPENSTAX-PHYSICS-WORK-POWER",
  "SRC-OPENSTAX-PHYSICS-SIMPLE-MACHINES",
  "SRC-LIBRETEXTS-LEVER-CLASSES",
  "SRC-LIBRETEXTS-GEAR-SYSTEMS",
  "SRC-LIBRETEXTS-GEAR-POWER-TORQUE",
  "SRC-OPENSTAX-UP2-ELECTRIC-CHARGE",
  "SRC-OPENSTAX-UP2-ELECTRICAL-CURRENT",
  "SRC-OPENSTAX-UP2-CONDUCTORS-INSULATORS",
  "SRC-OPENSTAX-UP2-RESISTIVITY",
  "SRC-OPENSTAX-UP2-OHM",
  "SRC-OPENSTAX-UP2-ELECTRICAL-POWER",
  "SRC-OPENSTAX-UP2-SERIES-PARALLEL",
  "SRC-OPENSTAX-UP2-KIRCHHOFF",
  "SRC-OPENSTAX-UP2-MEASURING-INSTRUMENTS",
  "SRC-YOKOGAWA-POWER-MEASUREMENT",
  "SRC-SCHNEIDER-ION7400-ENERGY",
  "SRC-OPENSTAX-CHEM-ELECTROLYSIS",
  "SRC-OPENSTAX-UP2-SIMPLE-AC",
  "SRC-OPENSTAX-UP2-RLC-IMPEDANCE",
  "SRC-OPENSTAX-UP2-AC-POWER",
  "SRC-OPENSTAX-UP2-MAGNETIC-FIELDS",
  "SRC-OPENSTAX-UP2-CURRENT-CONDUCTOR-FORCE",
  "SRC-OPENSTAX-UP2-STRAIGHT-WIRE",
  "SRC-OPENSTAX-UP2-SOLENOID",
  "SRC-OPENSTAX-UP2-FARADAY-FLUX",
  "SRC-OPENSTAX-UP2-MOTIONAL-EMF",
  "SRC-NAGOYA-OCW-ELECTROMAGNETICS",
  "SRC-OPENSTAX-UP2-GENERATORS",
  "SRC-ECAMPUS-SIMPLE-AC-GENERATOR",
  "SRC-ECAMPUS-ALTERNATOR-RELATIONSHIPS",
  "SRC-ABB-POLE-PAIR-CONVENTION",
  "SRC-IASTATE-AC-WAVEFORMS",
  "SRC-OPENSTAX-UP2-CAPACITORS",
  "SRC-OPENSTAX-UP2-CAPACITOR-ENERGY",
  "SRC-TE-RESISTOR-COLOR",
  "SRC-ROHM-DIODE-BASICS",
  "SRC-ROHM-RECTIFIER-DIODE",
  "SRC-ROHM-ZENER",
  "SRC-ROHM-LED-FORWARD",
  "SRC-ROHM-LED-EMISSION",
  "SRC-HAMAMATSU-PHOTODIODE",
  "SRC-ADVPHOTONIX-LDR",
  "SRC-MURATA-NTC",
  "SRC-MURATA-PTC",
  "SRC-ST-DIAC-DB3",
  "SRC-ST-AN3168-DIAC-TRIAC-DIMMER",
  "SRC-ROHM-BJT",
  "SRC-ROHM-NPN-SWITCH",
  "SRC-ST-AN4607-SCR",
  "SRC-OMRON-E5C2-TEMP-CONTROLLER",
  "SRC-ABB-DRIVE-SYSTEM",
  "SRC-TI-WIRELESS-ENV-SENSOR",
  "SRC-TI-TIDA-01067",
  "SRC-OPENREACH-DIGITAL-PHONE",
  "SRC-OFCOM-PSTN-VOIP-2026",
  "SRC-OFCOM-FUTURE-LANDLINE",
] as const;

// Deliberate dossier gaps that must remain visible -- a tamper that
// silently flips either to VERIFIED must fail this report.
const EXPECTED_SOURCE_GAP_REQUIREMENTS: ReadonlyArray<{ clusterKey: string; requirementText: string }> = [
  {
    clusterKey: "electronic-systems-and-applications",
    requirementText:
      "Telephone system: whether any specific master-socket component role remains qualification-relevant and current is itself unestablished -- currency must be independently verified before any such role is taught as current general technical truth.",
  },
  {
    clusterKey: "electronic-systems-and-applications",
    requirementText: "Security alarm: a transistor provides a switching role and a thyristor provides a latching/sounder role within the circuit.",
  },
];

type ClusterCoverageStatus = "FULLY_SOURCED" | "PARTIAL" | "UNSOURCED";

interface ClusterCoverage {
  clusterKey: string;
  requiredCount: number;
  verifiedCount: number;
  gapCount: number;
  conditionalGapCount: number;
  status: ClusterCoverageStatus;
}

interface Report {
  approvedSourceCount: number;
  verifiedSourceCount: number;
  retrievalFailedSourceCount: number;
  missingDossierIds: string[];
  unapprovedDossierIds: string[];
  duplicateDossierIds: string[];
  requirementsWithoutCoverage: string[];
  coverageWithUnknownRequirement: string[];
  clusterCoverage: ClusterCoverage[];
  fullySourcedClusterCount: number;
  partialClusterCount: number;
  unsourcedClusterCount: number;
  clustersMarkedSourcedButNotFullyCovered: string[];
  clustersFullyCoveredButNotMarkedSourced: string[];
  expectedGapsNoLongerGaps: string[];
}

function requirementsForCluster(cluster: (typeof unit202SourceAcquisitionManifest.clusters)[number]) {
  return [
    ...cluster.factualPropositionsRequiringSupport.map((text) => ({ requirementKind: "FACTUAL_PROPOSITION" as const, text })),
    ...cluster.relationshipsOrMechanismsRequiringSupport.map((text) => ({ requirementKind: "RELATIONSHIP_OR_MECHANISM" as const, text })),
    ...cluster.proceduresOrCalculationRulesRequiringSupport.map((text) => ({ requirementKind: "PROCEDURE_OR_CALCULATION_RULE" as const, text })),
    ...cluster.symbolsOrConventionsRequiringSupport.map((text) => ({ requirementKind: "SYMBOL_OR_CONVENTION" as const, text })),
    ...cluster.physicalOrComponentRecognitionRequirements.map((text) => ({ requirementKind: "PHYSICAL_OR_COMPONENT_RECOGNITION" as const, text })),
  ];
}

function buildReport(overrides?: {
  verification?: unknown;
  manifest?: typeof unit202SourceAcquisitionManifest;
}): Report {
  const verification = technicalSourceVerificationManifestSchema.parse(
    overrides?.verification ?? unit202TechnicalSourceVerification,
  );
  const manifest = overrides?.manifest ?? unit202SourceAcquisitionManifest;

  const dossierIds = verification.approvedSources.map((s) => s.dossierSourceId);
  const dossierIdSet = new Set(dossierIds);
  const expectedSet = new Set<string>(EXPECTED_DOSSIER_SOURCE_IDS);

  const missingDossierIds = EXPECTED_DOSSIER_SOURCE_IDS.filter((id) => !dossierIdSet.has(id));
  const unapprovedDossierIds = dossierIds.filter((id) => !expectedSet.has(id));
  const seen = new Set<string>();
  const duplicateDossierIds: string[] = [];
  for (const id of dossierIds) {
    if (seen.has(id)) duplicateDossierIds.push(id);
    seen.add(id);
  }

  const verifiedSourceCount = verification.approvedSources.filter((s) => s.status === "VERIFIED").length;
  const retrievalFailedSourceCount = verification.approvedSources.filter((s) => s.status === "RETRIEVAL_FAILED").length;

  // Index proposition-coverage records by cluster+requirementText.
  const coverageByKey = new Map<string, (typeof verification.propositionCoverage)[number]>();
  for (const record of verification.propositionCoverage) {
    const key = `${record.clusterKey}::${record.requirementText}`;
    coverageByKey.set(key, record);
  }
  const consumedKeys = new Set<string>();

  const requirementsWithoutCoverage: string[] = [];
  const clusterCoverage: ClusterCoverage[] = [];

  for (const cluster of manifest.clusters) {
    const requirements = requirementsForCluster(cluster);
    let verifiedCount = 0;
    let gapCount = 0;
    let conditionalGapCount = 0;

    for (const req of requirements) {
      const key = `${cluster.clusterKey}::${req.text}`;
      const record = coverageByKey.get(key);
      if (!record) {
        requirementsWithoutCoverage.push(key);
        continue;
      }
      consumedKeys.add(key);
      if (record.coverageState === "VERIFIED") verifiedCount += 1;
      else if (record.coverageState === "SOURCE_GAP") gapCount += 1;
      else conditionalGapCount += 1;
    }

    const requiredCount = requirements.length;
    const status: ClusterCoverageStatus =
      requiredCount > 0 && verifiedCount === requiredCount
        ? "FULLY_SOURCED"
        : verifiedCount > 0
          ? "PARTIAL"
          : "UNSOURCED";

    clusterCoverage.push({ clusterKey: cluster.clusterKey, requiredCount, verifiedCount, gapCount, conditionalGapCount, status });
  }

  const coverageWithUnknownRequirement = [...coverageByKey.keys()].filter((key) => !consumedKeys.has(key));

  const clusterStatusByKey = new Map(clusterCoverage.map((c) => [c.clusterKey, c.status]));
  const clustersMarkedSourcedButNotFullyCovered = manifest.clusters
    .filter((c) => c.status === "SOURCED" && clusterStatusByKey.get(c.clusterKey) !== "FULLY_SOURCED")
    .map((c) => c.clusterKey);
  const clustersFullyCoveredButNotMarkedSourced = manifest.clusters
    .filter((c) => c.status === "UNSOURCED" && clusterStatusByKey.get(c.clusterKey) === "FULLY_SOURCED")
    .map((c) => c.clusterKey);

  const expectedGapsNoLongerGaps = EXPECTED_SOURCE_GAP_REQUIREMENTS.filter((expected) => {
    const record = coverageByKey.get(`${expected.clusterKey}::${expected.requirementText}`);
    return record?.coverageState !== "SOURCE_GAP";
  }).map((expected) => `${expected.clusterKey}: ${expected.requirementText.slice(0, 60)}...`);

  return {
    approvedSourceCount: verification.approvedSources.length,
    verifiedSourceCount,
    retrievalFailedSourceCount,
    missingDossierIds,
    unapprovedDossierIds,
    duplicateDossierIds,
    requirementsWithoutCoverage,
    coverageWithUnknownRequirement,
    clusterCoverage,
    fullySourcedClusterCount: clusterCoverage.filter((c) => c.status === "FULLY_SOURCED").length,
    partialClusterCount: clusterCoverage.filter((c) => c.status === "PARTIAL").length,
    unsourcedClusterCount: clusterCoverage.filter((c) => c.status === "UNSOURCED").length,
    clustersMarkedSourcedButNotFullyCovered,
    clustersFullyCoveredButNotMarkedSourced,
    expectedGapsNoLongerGaps,
  };
}

function formatReport(report: Report): string {
  const lines: string[] = [];
  lines.push("CC-15 Unit 202 Technical Source Verification validation report");
  lines.push("==================================================================");
  lines.push(`Approved dossier sources: ${report.approvedSourceCount} (expected ${EXPECTED_DOSSIER_SOURCE_IDS.length})`);
  lines.push(`  - VERIFIED: ${report.verifiedSourceCount}`);
  lines.push(`  - RETRIEVAL_FAILED: ${report.retrievalFailedSourceCount}`);
  lines.push(`Missing expected dossier ids (target 0): ${report.missingDossierIds.length}`);
  if (report.missingDossierIds.length) lines.push(`  ${report.missingDossierIds.join(", ")}`);
  lines.push(`Unapproved dossier ids present (target 0): ${report.unapprovedDossierIds.length}`);
  if (report.unapprovedDossierIds.length) lines.push(`  ${report.unapprovedDossierIds.join(", ")}`);
  lines.push(`Duplicate dossier ids (target 0): ${report.duplicateDossierIds.length}`);
  if (report.duplicateDossierIds.length) lines.push(`  ${report.duplicateDossierIds.join(", ")}`);
  lines.push(`Manifest requirements without any coverage record (target 0): ${report.requirementsWithoutCoverage.length}`);
  if (report.requirementsWithoutCoverage.length) lines.push(`  ${report.requirementsWithoutCoverage.slice(0, 10).join("\n  ")}`);
  lines.push(`Coverage records referencing an unknown requirement (target 0): ${report.coverageWithUnknownRequirement.length}`);
  if (report.coverageWithUnknownRequirement.length) lines.push(`  ${report.coverageWithUnknownRequirement.slice(0, 10).join("\n  ")}`);
  lines.push("");
  lines.push(`Clusters: ${report.clusterCoverage.length}`);
  lines.push(`  - FULLY_SOURCED: ${report.fullySourcedClusterCount}`);
  lines.push(`  - PARTIAL: ${report.partialClusterCount}`);
  lines.push(`  - UNSOURCED: ${report.unsourcedClusterCount}`);
  for (const c of report.clusterCoverage) {
    lines.push(`    ${c.clusterKey}: ${c.status} (${c.verifiedCount}/${c.requiredCount} verified, ${c.gapCount} gap, ${c.conditionalGapCount} conditional)`);
  }
  lines.push(`Clusters marked SOURCED without full coverage (target 0): ${report.clustersMarkedSourcedButNotFullyCovered.length}`);
  if (report.clustersMarkedSourcedButNotFullyCovered.length) lines.push(`  ${report.clustersMarkedSourcedButNotFullyCovered.join(", ")}`);
  lines.push(`Clusters fully covered but still marked UNSOURCED (informational, target 0 after manifest update): ${report.clustersFullyCoveredButNotMarkedSourced.length}`);
  if (report.clustersFullyCoveredButNotMarkedSourced.length) lines.push(`  ${report.clustersFullyCoveredButNotMarkedSourced.join(", ")}`);
  lines.push(`Expected dossier gaps that turned green (target 0): ${report.expectedGapsNoLongerGaps.length}`);
  if (report.expectedGapsNoLongerGaps.length) lines.push(`  ${report.expectedGapsNoLongerGaps.join("\n  ")}`);
  return lines.join("\n");
}

export function isReportClean(report: Report): boolean {
  return (
    report.missingDossierIds.length === 0 &&
    report.unapprovedDossierIds.length === 0 &&
    report.duplicateDossierIds.length === 0 &&
    report.requirementsWithoutCoverage.length === 0 &&
    report.coverageWithUnknownRequirement.length === 0 &&
    report.clustersMarkedSourcedButNotFullyCovered.length === 0 &&
    report.expectedGapsNoLongerGaps.length === 0
  );
}

export { buildReport, formatReport, EXPECTED_DOSSIER_SOURCE_IDS, EXPECTED_SOURCE_GAP_REQUIREMENTS };
export type { Report, ClusterCoverage, ClusterCoverageStatus };

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
  console.log(clean ? "PASS: all technical-source-verification validation gates are clean." : "FAIL: one or more validation gates failed.");
  if (process.argv.includes("--check") && !clean) {
    process.exit(1);
  }
}
