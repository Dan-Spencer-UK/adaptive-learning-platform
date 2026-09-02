/**
 * CC-19R clean-room freeze (task section 33). Run AFTER build-ledger.ts
 * has written every other output file. Computes SHA-256 over the source
 * access log, source inventory JSON, normalization ledger JSON,
 * decomposition coverage JSON, and every locally preserved raw source,
 * plus summary counts, and writes CC-19R-FREEZE.json.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

import { ledger, decompositionCoverage, outDir } from "./build-ledger.ts";
import { TECHNICAL_CLAIMS } from "./technical-truth-data.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");

function sha256(absPath: string): string {
  return createHash("sha256").update(readFileSync(absPath)).digest("hex");
}

function relFromRoot(absPath: string): string {
  return path.relative(repoRoot, absPath).split(path.sep).join("/");
}

const filesToHash: string[] = [
  path.join(outDir, "CC-19R-SOURCE-ACCESS-LOG.json"),
  path.join(outDir, "cc19r-source-inventory.json"),
  path.join(outDir, "cc19r-normalization-ledger.json"),
  path.join(outDir, "cc19r-decomposition-coverage.json"),
];

const rawSourcesDir = path.join(outDir, "raw-sources");
for (const name of readdirSync(rawSourcesDir)) {
  const abs = path.join(rawSourcesDir, name);
  if (statSync(abs).isFile()) filesToHash.push(abs);
}

const fileHashes: Record<string, string> = {};
for (const abs of filesToHash) {
  fileHashes[relFromRoot(abs)] = sha256(abs);
}

const curriculumRecords = ledger.filter((e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence");
const qualificationLevelRecords = ledger.filter((e) => e.layerB.genericPipelineRecordType === "QualificationLevelEvidence");
const technicalTruthRecords = ledger.filter((e) => e.layerB.genericPipelineRecordType === "SourceFactualClaim");
const factRecords = ledger.filter((e) => e.layerB.genericPipelineRecordType === "CandidateFactRequirement");
const explicitFacts = factRecords.filter((e) => (e.layerB.normalizedRecord as { derivationStatus: string }).derivationStatus === "EXPLICIT_CURRICULUM_FACT");
const reviewFacts = factRecords.filter((e) => (e.layerB.normalizedRecord as { derivationStatus: string }).derivationStatus === "REVIEW_PROPOSED");
const assessmentRecords = ledger.filter((e) => e.layerB.genericPipelineRecordType === "AssessmentEvidence");

const branch = execSync("git rev-parse --abbrev-ref HEAD", { cwd: repoRoot }).toString().trim();
const headCommit = execSync("git rev-parse HEAD", { cwd: repoRoot }).toString().trim();

const freeze = {
  generatedBy: "CC-19R clean-room build-freeze.ts",
  executionConditions: {
    freshClaudeSession: true,
    cleanRoomBaseCommit: "3c9b1dd",
    cleanRoomBranch: branch,
    cleanRoomWorktreeHeadAtFreezeTime: headCommit,
    noSubagentToolsUsed: true,
  },
  sourceCounts: {
    officialCurriculumDocuments: 1,
    publicAssessmentDocumentsAttempted: 2,
    publicAssessmentDocumentsUsedAsEvidence: 0,
    qualificationLevelDocuments: 1,
    distinctTechnicalTruthSources: new Set(TECHNICAL_CLAIMS.map((c) => c.sourceRef)).size,
    distinctTechnicalTruthClaimKeys: new Set(TECHNICAL_CLAIMS.map((c) => c.claimKey)).size,
  },
  curriculumCounts: {
    learningOutcomes: 6,
    requiredCandidateRecords: curriculumRecords.length,
    byNormalizationKind: {
      PRIMARY_REQUIREMENT: curriculumRecords.filter((e) => (e.layerB.normalizedRecord as { normalizationKind: string }).normalizationKind === "PRIMARY_REQUIREMENT").length,
      RANGE_CATEGORY: curriculumRecords.filter((e) => (e.layerB.normalizedRecord as { normalizationKind: string }).normalizationKind === "RANGE_CATEGORY").length,
      RANGE_REQUIRED_MEMBER: curriculumRecords.filter((e) => (e.layerB.normalizedRecord as { normalizationKind: string }).normalizationKind === "RANGE_REQUIRED_MEMBER").length,
    },
    byNormalizationConfidence: {
      EXPLICIT: curriculumRecords.filter((e) => e.layerB.normalizationConfidence === "EXPLICIT").length,
      STRONG_INFERENCE: curriculumRecords.filter((e) => e.layerB.normalizationConfidence === "STRONG_INFERENCE").length,
    },
  },
  assessmentCounts: {
    assessmentEvidenceRecords: assessmentRecords.length,
    note: "Zero: the only PUBLIC_ASSESSMENT questions document was password-protected (RAW_SOURCE_UNAVAILABLE) and disallowed under CC-19R section B; the mark scheme alone lacked question-stem content required by section 16.",
  },
  qualificationLevelEvidenceCount: qualificationLevelRecords.length,
  requiredCandidateCount: curriculumRecords.length,
  explicitFactRequirementCount: explicitFacts.length,
  reviewFactRequirementCount: reviewFacts.length,
  technicalFactualClaimCount: technicalTruthRecords.length,
  unresolvedDecompositionCount: decompositionCoverage.statusCounts.UNRESOLVED_DECOMPOSITION,
  decompositionStatusCounts: decompositionCoverage.statusCounts,
  profileEligibility: {
    fullPublicEligibleCount: ledger.filter((e) => e.layerB.profileEligibility.includes("FULL_PUBLIC")).length,
    degradedNoAssessmentEligibleCount: ledger.filter((e) => e.layerB.profileEligibility.includes("DEGRADED_NO_ASSESSMENT")).length,
    identicalProfiles: true,
    reasonIdentical: "No PUBLIC_ASSESSMENT evidence was successfully normalized this run (source password-protected); filtering it out removes nothing.",
  },
  totalLedgerRecordCount: ledger.length,
  fileHashes,
};

writeFileSync(path.join(outDir, "CC-19R-FREEZE.json"), JSON.stringify(freeze, null, 2) + "\n", "utf-8");
console.log("CC-19R-FREEZE.json written.");
console.log(JSON.stringify(freeze, null, 2));
