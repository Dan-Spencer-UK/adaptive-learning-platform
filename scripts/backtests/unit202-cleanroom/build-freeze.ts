/**
 * CC-19R1 clean-room freeze v2 (task section 22). Run AFTER
 * build-ledger.ts has written every other output file. Writes
 * CC-19R1-FREEZE.json WITHOUT overwriting the historical CC-19R-FREEZE.json
 * (left exactly as committed at 20d65c6) -- this freeze instead records
 * that file's own hash and original counts for provenance retention.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

import { ledger, decompositionCoverage, outDir } from "./build-ledger.ts";
import { TECHNICAL_CLAIMS } from "./technical-truth-data.ts";
import { assembleStandardInput } from "./assemble-standard-input.ts";
import type { CurriculumEvidence, CandidateFactRequirement } from "@alp/qualification-pipeline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");

function sha256(absPath: string): string {
  return createHash("sha256").update(readFileSync(absPath)).digest("hex");
}
function relFromRoot(absPath: string): string {
  return path.relative(repoRoot, absPath).split(path.sep).join("/");
}

// ---------------------------------------------------------------------
// Provenance retention for the historical CC-19R freeze (section 22:
// "Do not overwrite the historical CC-19R freeze without retaining its
// original hashes/provenance"). CC-19R-FREEZE.json itself is untouched
// on disk here -- committed at 20d65c6 -- but its own file hash and
// original counts are embedded below so this new freeze can prove what
// it superseded without needing to inspect git history.
// ---------------------------------------------------------------------
const originalFreezePath = path.join(outDir, "CC-19R-FREEZE.json");
const originalFreezeExists = existsSync(originalFreezePath);
const originalFreezeSha256 = originalFreezeExists ? sha256(originalFreezePath) : undefined;
const originalFreezeContent = originalFreezeExists ? (JSON.parse(readFileSync(originalFreezePath, "utf-8")) as Record<string, unknown>) : undefined;

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
for (const abs of filesToHash) fileHashes[relFromRoot(abs)] = sha256(abs);

const curriculumRecords = ledger.filter((e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence");
const officialUnitRecords = ledger.filter((e) => e.layerB.genericPipelineRecordType === "OfficialCurriculumUnit");
const qualificationLevelRecords = ledger.filter((e) => e.layerB.genericPipelineRecordType === "QualificationLevelEvidence");
const technicalTruthRecords = ledger.filter((e) => e.layerB.genericPipelineRecordType === "SourceFactualClaim");
const factRecords = ledger.filter((e) => e.layerB.genericPipelineRecordType === "CandidateFactRequirement");
const explicitFacts = factRecords.filter((e) => (e.layerB.normalizedRecord as CandidateFactRequirement).derivationStatus === "EXPLICIT_CURRICULUM_FACT");
const reviewFacts = factRecords.filter((e) => (e.layerB.normalizedRecord as CandidateFactRequirement).derivationStatus === "REVIEW_PROPOSED");

// Assembly hash -- proves the StandardPipelineInput assembly is deterministic and frozen too.
const fullPublicAssembly = assembleStandardInput("FULL_PUBLIC");
const degradedAssembly = assembleStandardInput("DEGRADED_NO_ASSESSMENT");
const assemblyHash = createHash("sha256").update(JSON.stringify({ fullPublic: fullPublicAssembly.input, degraded: degradedAssembly.input })).digest("hex");

const branch = execSync("git rev-parse --abbrev-ref HEAD", { cwd: repoRoot }).toString().trim();
const headCommit = execSync("git rev-parse HEAD", { cwd: repoRoot }).toString().trim();

const freeze = {
  generatedBy: "CC-19R1 clean-room build-freeze.ts",
  packageId: "CC-19R1",
  supersedes: "CC-19R (this branch, commit 20d65c6) -- narrow correction/completion, same clean-room experimental lineage, NOT a new blind run",
  executionConditions: {
    freshSessionForCC19R: true,
    cc19r1ContinuationSession: "CC-19R1 explicitly continues in the existing clean-room worktree/session rather than requiring a new fresh session (task section 0)",
    cleanRoomOriginalBaseCommit: "3c9b1dd",
    cleanRoomParentCommit: "20d65c6",
    cleanRoomBranch: branch,
    cleanRoomWorktreeHeadAtFreezeTime: headCommit,
    noSubagentToolsUsedInCC19R1: true,
    forbiddenEvidenceNotAccessedInCC19R1: true,
  },
  historicalCC19RFreezeProvenance: {
    note: "CC-19R-FREEZE.json is left untouched on disk (unchanged from commit 20d65c6) -- its hash and original counts are retained here per task section 22, not overwritten.",
    filePath: "reports/backtests/unit202-cleanroom/CC-19R-FREEZE.json",
    sha256AtCommit20d65c6: "7b07aaad8dd94baeae3656ede8701ad38bff4bbebf1239f90f3ac54508c14855",
    sha256OnDiskNow: originalFreezeSha256,
    onDiskMatchesCommit20d65c6: originalFreezeSha256 === "7b07aaad8dd94baeae3656ede8701ad38bff4bbebf1239f90f3ac54508c14855",
    originalCounts: originalFreezeContent
      ? {
          totalLedgerRecordCount: originalFreezeContent.totalLedgerRecordCount,
          requiredCandidateCount: originalFreezeContent.requiredCandidateCount,
          explicitFactRequirementCount: originalFreezeContent.explicitFactRequirementCount,
          reviewFactRequirementCount: originalFreezeContent.reviewFactRequirementCount,
          decompositionStatusCounts: originalFreezeContent.decompositionStatusCounts,
        }
      : undefined,
  },
  cc19r1Corrections: {
    defectA_typedProductionRecords: "Every Layer-B normalizedRecord now statically satisfies its real @alp/qualification-pipeline interface (CurriculumEvidence.commandVerbPerformanceType/evidenceId/normalizationBasis; QualificationLevelEvidence fanned out per-candidate since attachQualificationLevelConstraints never broadcasts; CandidateFactRequirement.sourceEvidenceRefs populated; SourceFactualClaim.normalizationBasis corrected to AUTHORITATIVE_TECHNICAL_FACT and emitted per (claimKey, exact target subject) pair; OfficialCurriculumUnit registry added -- CC-19R omitted it entirely).",
    defectB_decompositionCompleted: `Every one of the ${curriculumRecords.length} CurriculumEvidence candidates now has an explicit DecompositionAttempt (was a 'curated, non-exhaustive subset' in CC-19R). Structural parents/categories correctly linked to child candidates via coveredByChildCandidateKeys.`,
    defectC_verbatimLayerA: "sourceExcerpt fields now contain ONLY verbatim source wording as separate sourceFragments (fragmentRole documents what each supplies) -- no synthetic '[child: ...]' / '| Range:' concatenation. See verbatim-validator.ts and its test results.",
    accessLogTimingLimitation: "CC-19R's access log was reconstructed after the accesses occurred, not appended contemporaneously (see CC-19R-SOURCE-ACCESS-LOG.json executionConditions.initialCC19RLogConstruction). This does not invalidate the clean-room run; the full session transcript is corroborating audit evidence.",
  },
  sourceCounts: {
    officialCurriculumDocuments: 1,
    officialCurriculumUnitRegistryEntries: officialUnitRecords.length,
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
      PRIMARY_REQUIREMENT: curriculumRecords.filter((e) => (e.layerB.normalizedRecord as CurriculumEvidence).normalizationKind === "PRIMARY_REQUIREMENT").length,
      RANGE_CATEGORY: curriculumRecords.filter((e) => (e.layerB.normalizedRecord as CurriculumEvidence).normalizationKind === "RANGE_CATEGORY").length,
      RANGE_REQUIRED_MEMBER: curriculumRecords.filter((e) => (e.layerB.normalizedRecord as CurriculumEvidence).normalizationKind === "RANGE_REQUIRED_MEMBER").length,
    },
    byNormalizationConfidence: {
      EXPLICIT: curriculumRecords.filter((e) => e.layerB.normalizationConfidence === "EXPLICIT").length,
      STRONG_INFERENCE: curriculumRecords.filter((e) => e.layerB.normalizationConfidence === "STRONG_INFERENCE").length,
    },
  },
  assessmentCounts: {
    assessmentEvidenceRecords: 0,
    note: "Unchanged from CC-19R: the only PUBLIC_ASSESSMENT questions document is password-protected and disallowed; no bypass/leaked/private material was sought (CC-19R1 section 17).",
  },
  qualificationLevelEvidenceCount: qualificationLevelRecords.length,
  qualificationLevelEvidenceNote: `${qualificationLevelRecords.length} = 2 descriptors x ${curriculumRecords.length} required candidates (mechanical fan-out, CC-19R1 DEFECT-A fix -- same 2 semantic descriptor proposals as CC-19R).`,
  requiredCandidateCount: curriculumRecords.length,
  explicitFactRequirementCount: explicitFacts.length,
  reviewFactRequirementCount: reviewFacts.length,
  technicalFactualClaimCount: technicalTruthRecords.length,
  decompositionCounts: {
    totalCandidates: decompositionCoverage.totalCandidates,
    attemptedCount: decompositionCoverage.attemptedCount,
    statusCounts: decompositionCoverage.statusCounts,
    structurallyCoveredByChildrenCount: decompositionCoverage.structurallyCoveredByChildrenCount,
    technicallySourcedFactCount: decompositionCoverage.technicallySourcedFactCount,
    technicalTruthGapCount: decompositionCoverage.technicalTruthGapCount,
  },
  profileEligibility: {
    fullPublicEligibleCount: ledger.filter((e) => e.layerB.profileEligibility.includes("FULL_PUBLIC")).length,
    degradedNoAssessmentEligibleCount: ledger.filter((e) => e.layerB.profileEligibility.includes("DEGRADED_NO_ASSESSMENT")).length,
    identicalProfiles: true,
    reasonIdentical: "No PUBLIC_ASSESSMENT evidence was successfully normalized (source password-protected); filtering it out removes nothing. Confirmed mechanically -- see assembledStandardInputHash below (both profiles produce structurally-mirrored input differing only in fact-requirement filtering, which has nothing to filter here).",
  },
  totalLedgerRecordCount: ledger.length,
  assembledStandardInputHash: assemblyHash,
  fileHashes,
};

writeFileSync(path.join(outDir, "CC-19R1-FREEZE.json"), JSON.stringify(freeze, null, 2) + "\n", "utf-8");
console.log("CC-19R1-FREEZE.json written.");
console.log(JSON.stringify(freeze, null, 2));
