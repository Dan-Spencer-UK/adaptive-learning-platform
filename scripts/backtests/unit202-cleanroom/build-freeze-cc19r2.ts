/**
 * CC-19R2 sections 9-10: freezes the clean-room IMPLEMENTATION CODE
 * (not just its outputs) by SHA-256, reconciles source-access
 * completeness, and proves the exact historical CC-19R review-proposal
 * set survives unchanged. Writes CC-19R2-FREEZE.json WITHOUT touching
 * CC-19R-FREEZE.json or CC-19R1-FREEZE.json -- both are hashed here for
 * provenance retention only.
 *
 * This script performs NO semantic recomputation: it imports the SAME
 * frozen `ledger`/`decompositionCoverage` from build-ledger.ts (unchanged
 * since ea7e8be) purely to report semantic-count invariants for
 * provenance -- it does not alter them.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

import { ledger, decompositionCoverage, outDir } from "./build-ledger.ts";
import type { CandidateFactRequirement } from "@alp/qualification-pipeline";
import { validateSourceAccessCompleteness, computeCc19r1Addendum } from "./source-access-reconciliation.ts";
import { summarizeHistoricalComparison, compareHistoricalReviewProposals } from "./historical-review-proposal-comparison.ts";
import { assembleStandardInput } from "./assemble-standard-input.ts";

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
// 1. Implementation-code hashes (CC-19R2 section 9) -- the behaviour of
// the clean-room experiment depends on this code, not merely its output.
// ---------------------------------------------------------------------
const IMPLEMENTATION_FILES = [
  "assemble-standard-input.ts",
  "build-ledger.ts",
  "review-facts-data.ts",
  "explicit-facts-data.ts",
  "technical-truth-data.ts",
  "curriculum-data.ts",
  "qualification-level-data.ts",
  "official-curriculum-units.ts",
  "verbatim-validator.ts",
  "compile-type-gate-fixture.ts",
  "build-ledger.test.ts",
  // CC-19R2's own new implementation files (also frozen, for completeness):
  "source-access-reconciliation.ts",
  "build-source-access-addendum.ts",
  "historical-review-proposal-comparison.ts",
];
const implementationCodeHashes: Record<string, string> = {};
for (const name of IMPLEMENTATION_FILES) {
  const abs = path.join(__dirname, name);
  implementationCodeHashes[relFromRoot(abs)] = sha256(abs);
}

const historicalSnapshotPath = path.join(__dirname, "historical-snapshots", "review-facts-data.20d65c6.ts");
const historicalSnapshotHash = sha256(historicalSnapshotPath);

// ---------------------------------------------------------------------
// 2. Output/report hashes (unchanged categories from CC-19R1, plus the
// new source-access addendum).
// ---------------------------------------------------------------------
const filesToHash: string[] = [
  path.join(outDir, "CC-19R-SOURCE-ACCESS-LOG.json"),
  path.join(outDir, "CC-19R1-SOURCE-ACCESS-ADDENDUM.json"),
  path.join(outDir, "cc19r-source-inventory.json"),
  path.join(outDir, "cc19r-normalization-ledger.json"),
  path.join(outDir, "cc19r-decomposition-coverage.json"),
];
const rawSourcesDir = path.join(outDir, "raw-sources");
for (const name of readdirSync(rawSourcesDir)) {
  const abs = path.join(rawSourcesDir, name);
  if (statSync(abs).isFile()) filesToHash.push(abs);
}
const outputFileHashes: Record<string, string> = {};
for (const abs of filesToHash) outputFileHashes[relFromRoot(abs)] = sha256(abs);

// ---------------------------------------------------------------------
// 3. Provenance retention: prior freezes, untouched.
// ---------------------------------------------------------------------
const cc19rFreezePath = path.join(outDir, "CC-19R-FREEZE.json");
const cc19r1FreezePath = path.join(outDir, "CC-19R1-FREEZE.json");
const cc19rFreezeHash = existsSync(cc19rFreezePath) ? sha256(cc19rFreezePath) : undefined;
const cc19r1FreezeHash = existsSync(cc19r1FreezePath) ? sha256(cc19r1FreezePath) : undefined;
const cc19rFreezeAtCommit = execSync("git show 20d65c6:reports/backtests/unit202-cleanroom/CC-19R-FREEZE.json", { cwd: repoRoot }).toString();
const cc19rFreezeHashAtCommit = createHash("sha256").update(cc19rFreezeAtCommit).digest("hex");
const cc19r1FreezeAtCommit = execSync("git show ea7e8be:reports/backtests/unit202-cleanroom/CC-19R1-FREEZE.json", { cwd: repoRoot }).toString();
const cc19r1FreezeHashAtCommit = createHash("sha256").update(cc19r1FreezeAtCommit).digest("hex");

// ---------------------------------------------------------------------
// 4. Source-access completeness (CC-19R2 section 5).
// ---------------------------------------------------------------------
const completenessViolations = validateSourceAccessCompleteness();
const addendum = computeCc19r1Addendum();

// ---------------------------------------------------------------------
// 5. Historical review-proposal preservation (CC-19R2 sections 6-8).
// ---------------------------------------------------------------------
const historicalComparison = compareHistoricalReviewProposals();
const historicalSummary = summarizeHistoricalComparison(historicalComparison);

// ---------------------------------------------------------------------
// 6. Semantic-count invariants (reported, NOT recomputed/altered).
// ---------------------------------------------------------------------
const curriculumRecords = ledger.filter((e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence");
const factRecords = ledger.filter((e) => e.layerB.genericPipelineRecordType === "CandidateFactRequirement");
const explicitFacts = factRecords.filter((e) => (e.layerB.normalizedRecord as CandidateFactRequirement).derivationStatus === "EXPLICIT_CURRICULUM_FACT");
const reviewFacts = factRecords.filter((e) => (e.layerB.normalizedRecord as CandidateFactRequirement).derivationStatus === "REVIEW_PROPOSED");
const assessmentRecords = ledger.filter((e) => (e.layerB.genericPipelineRecordType as string) === "AssessmentEvidence");

const semanticInvariants = {
  curriculumEvidenceCandidates: curriculumRecords.length,
  decompositionAttempts: {
    total: decompositionCoverage.totalCandidates,
    EXPLICITLY_ATOMIC: decompositionCoverage.statusCounts.EXPLICITLY_ATOMIC,
    REVIEW_DECOMPOSED: decompositionCoverage.statusCounts.REVIEW_DECOMPOSED,
    UNRESOLVED_DECOMPOSITION: decompositionCoverage.statusCounts.UNRESOLVED_DECOMPOSITION,
  },
  candidateFactRequirement: {
    EXPLICIT_CURRICULUM_FACT: explicitFacts.length,
    REVIEW_PROPOSED: reviewFacts.length,
  },
  assessmentEvidence: assessmentRecords.length,
};

const EXPECTED_INVARIANTS = {
  curriculumEvidenceCandidates: 139,
  decompositionAttempts: { total: 139, EXPLICITLY_ATOMIC: 44, REVIEW_DECOMPOSED: 81, UNRESOLVED_DECOMPOSITION: 14 },
  candidateFactRequirement: { EXPLICIT_CURRICULUM_FACT: 44, REVIEW_PROPOSED: 70 },
  assessmentEvidence: 0,
};
const invariantsMatch = JSON.stringify(semanticInvariants) === JSON.stringify(EXPECTED_INVARIANTS);

// ---------------------------------------------------------------------
// 7. Assembled-input hash -- RECOMPUTED (not copy-pasted) to actually
// prove it is unchanged from CC-19R1's ea7e8be-recorded value, rather
// than merely asserting the same string.
// ---------------------------------------------------------------------
const CC19R1_RECORDED_ASSEMBLY_HASH = "4e10f5692805b0ef2a6f0c781e87d5639276c87683e284c57634489c648c4437";
const fullPublicAssembly = assembleStandardInput("FULL_PUBLIC");
const degradedAssembly = assembleStandardInput("DEGRADED_NO_ASSESSMENT");
const recomputedAssemblyHash = createHash("sha256").update(JSON.stringify({ fullPublic: fullPublicAssembly.input, degraded: degradedAssembly.input })).digest("hex");
const assemblyHashUnchanged = recomputedAssemblyHash === CC19R1_RECORDED_ASSEMBLY_HASH;

const branch = execSync("git rev-parse --abbrev-ref HEAD", { cwd: repoRoot }).toString().trim();
const headCommit = execSync("git rev-parse HEAD", { cwd: repoRoot }).toString().trim();

const freeze = {
  generatedBy: "CC-19R2 clean-room build-freeze-cc19r2.ts",
  packageId: "CC-19R2",
  purpose: "Final narrow provenance/freeze correction -- no new research, no semantic changes. Provenance-only.",
  lineage: {
    originalCleanRoomBase: "3c9b1dd",
    cc19rParentCommit: "20d65c6",
    cc19r1SemanticFreezeCommit: "ea7e8be",
    note: "CC-19R2 freeze was generated from parent semantic commit ea7e8be, BEFORE the CC-19R2 provenance commit itself was created -- it does not and cannot self-hash its own final commit.",
  },
  executionConditions: {
    cleanRoomBranch: branch,
    cleanRoomWorktreeHeadAtFreezeTime: headCommit,
    noSubagentToolsUsed: true,
    noNewResearchPerformed: true,
    forbiddenEvidenceNotAccessed: true,
    semanticDataFilesUnchangedSinceEa7e8be: true,
  },
  priorFreezeProvenance: {
    cc19rFreeze: {
      filePath: "reports/backtests/unit202-cleanroom/CC-19R-FREEZE.json",
      hashAtCommit20d65c6: cc19rFreezeHashAtCommit,
      hashOnDiskNow: cc19rFreezeHash,
      unchanged: cc19rFreezeHash === cc19rFreezeHashAtCommit,
    },
    cc19r1Freeze: {
      filePath: "reports/backtests/unit202-cleanroom/CC-19R1-FREEZE.json",
      hashAtCommitEa7e8be: cc19r1FreezeHashAtCommit,
      hashOnDiskNow: cc19r1FreezeHash,
      unchanged: cc19r1FreezeHash === cc19r1FreezeHashAtCommit,
    },
  },
  sourceAccessCompleteness: {
    cc19r1AddendumEntryCount: addendum.length,
    violationCount: completenessViolations.length,
    violations: completenessViolations,
    result: completenessViolations.length === 0 ? "COMPLETE" : "INCOMPLETE",
  },
  historicalReviewProposalPreservation: {
    ...historicalSummary,
    result: historicalSummary.missingCount === 0 && historicalSummary.unexpectedSemanticChangeCount === 0 ? "FULLY_PRESERVED" : "PRESERVATION_VIOLATION",
  },
  semanticInvariants: {
    current: semanticInvariants,
    expected: EXPECTED_INVARIANTS,
    match: invariantsMatch,
  },
  assembledStandardInputHash: {
    recomputed: recomputedAssemblyHash,
    recordedAtEa7e8be: CC19R1_RECORDED_ASSEMBLY_HASH,
    unchanged: assemblyHashUnchanged,
  },
  implementationCodeHashes,
  historicalSnapshotHash: { "scripts/backtests/unit202-cleanroom/historical-snapshots/review-facts-data.20d65c6.ts": historicalSnapshotHash },
  outputFileHashes,
};

writeFileSync(path.join(outDir, "CC-19R2-FREEZE.json"), JSON.stringify(freeze, null, 2) + "\n", "utf-8");
console.log("CC-19R2-FREEZE.json written.");
console.log(JSON.stringify(freeze, null, 2));
