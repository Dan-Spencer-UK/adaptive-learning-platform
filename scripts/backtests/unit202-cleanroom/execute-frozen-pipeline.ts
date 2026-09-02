/**
 * CC-19B: mechanical execution of the REAL, exported production
 * `buildStandardPipeline` (packages/qualification-pipeline) against the
 * frozen clean-room Unit-202 input assembled by `assembleStandardInput`
 * (frozen at commit 54a9ebb).
 *
 * This script performs NO semantic transformation, NO subject rewriting,
 * NO candidate generation, NO post-processing of the returned result, NO
 * fixing of rejected candidates, and NO reinterpretation of any status. It
 * imports the production pipeline unchanged and serializes exactly what it
 * returns.
 *
 * A successful run of this script means only that `buildStandardPipeline`
 * executed against this input. It does NOT mean the resulting course model
 * is correct, complete, calibrated, or ready for lessons -- that semantic
 * judgement belongs to a later, separate Project-Architect review.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildStandardPipeline } from "@alp/qualification-pipeline";
import type { StandardPipelineResult } from "@alp/qualification-pipeline";

import { assembleStandardInput, type Profile } from "./assemble-standard-input.ts";
import { validateSourceAccessCompleteness } from "./source-access-reconciliation.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const cleanroomOutDir = path.join(repoRoot, "reports", "backtests", "unit202-cleanroom");
const execOutDir = path.join(cleanroomOutDir, "pipeline-execution");

const ACCEPTED_COMBINED_INPUT_HASH = "4e10f5692805b0ef2a6f0c781e87d5639276c87683e284c57634489c648c4437";
const EXPECTED_SEMANTIC_INVARIANTS = {
  curriculumEvidenceCandidates: 139,
  decompositionAttempts: { total: 139, EXPLICITLY_ATOMIC: 44, REVIEW_DECOMPOSED: 81, UNRESOLVED_DECOMPOSITION: 14 },
  candidateFactRequirement: { EXPLICIT_CURRICULUM_FACT: 44, REVIEW_PROPOSED: 70 },
  assessmentEvidence: 0,
};

function sha256Hex(data: string | Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

function sha256OfFile(absPath: string): string {
  return sha256Hex(readFileSync(absPath));
}

function stableStringify(value: unknown): string {
  // JSON.stringify with Object.keys(...).sort() equivalent via a replacer,
  // so the hash is independent of property insertion order. Arrays keep
  // their order (order is semantically meaningful for every field here).
  const seen = new WeakSet();
  function sortKeys(v: unknown): unknown {
    if (v === null || typeof v !== "object") return v;
    if (seen.has(v as object)) throw new Error("stableStringify: circular reference");
    seen.add(v as object);
    if (Array.isArray(v)) return v.map(sortKeys);
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v as Record<string, unknown>).sort()) {
      out[k] = sortKeys((v as Record<string, unknown>)[k]);
    }
    return out;
  }
  return JSON.stringify(sortKeys(value));
}

/** Canonical pretty-printed form -- IDENTICAL to what writeJson() persists to disk, so a hash computed here is directly, literally comparable to a written file's hash (and to itself across runs). */
function canonicalJson(value: unknown): string {
  return JSON.stringify(value, null, 2) + "\n";
}

interface ProfileRunResult {
  readonly profile: Profile;
  readonly inputHashBefore: string;
  readonly inputHashAfter: string;
  readonly inputMutated: boolean;
  readonly outputHash: string;
  readonly secondRunOutputHash: string;
  readonly deterministic: boolean;
  readonly result: StandardPipelineResult;
}

function runProfile(profile: Profile): ProfileRunResult {
  const { input } = assembleStandardInput(profile);
  const inputHashBefore = sha256Hex(stableStringify(input));

  const result = buildStandardPipeline(input);

  const inputHashAfter = sha256Hex(stableStringify(input));
  const inputMutated = inputHashBefore !== inputHashAfter;
  // Same canonical form used to persist CC-19B-*-OUTPUT.json, so this hash is
  // directly comparable to the written file's own hash and to the second run below.
  const outputHash = sha256Hex(canonicalJson(result));

  // Determinism check (task section 10): a SECOND invocation with a
  // freshly assembled copy of the same input, only after the first
  // result is already computed and hashed above.
  const { input: freshInput } = assembleStandardInput(profile);
  const secondResult = buildStandardPipeline(freshInput);
  const secondRunOutputHash = sha256Hex(canonicalJson(secondResult));

  return {
    profile,
    inputHashBefore,
    inputHashAfter,
    inputMutated,
    outputHash,
    secondRunOutputHash,
    deterministic: outputHash === secondRunOutputHash,
    result,
  };
}

function writeJson(absPath: string, value: unknown): string {
  const text = JSON.stringify(value, null, 2) + "\n";
  writeFileSync(absPath, text, "utf-8");
  return sha256Hex(text);
}

function main(): void {
  mkdirSync(execOutDir, { recursive: true });

  // ---------------------------------------------------------------------
  // Step 3 / preflight: verify the accepted combined input hash BEFORE
  // invoking the production pipeline at all.
  // ---------------------------------------------------------------------
  const fullInputForCheck = assembleStandardInput("FULL_PUBLIC").input;
  const degradedInputForCheck = assembleStandardInput("DEGRADED_NO_ASSESSMENT").input;
  const combinedHash = sha256Hex(JSON.stringify({ fullPublic: fullInputForCheck, degraded: degradedInputForCheck }));
  if (combinedHash !== ACCEPTED_COMBINED_INPUT_HASH) {
    throw new Error(`Accepted combined assembled-input hash mismatch: expected ${ACCEPTED_COMBINED_INPUT_HASH}, got ${combinedHash}. STOPPING -- input is not in the accepted frozen state.`);
  }

  const semanticInvariants = {
    curriculumEvidenceCandidates: fullInputForCheck.curriculum.length,
    assessmentEvidence: fullInputForCheck.assessment.length,
  };
  if (semanticInvariants.curriculumEvidenceCandidates !== EXPECTED_SEMANTIC_INVARIANTS.curriculumEvidenceCandidates) {
    throw new Error(`Semantic invariant mismatch: curriculumEvidenceCandidates expected ${EXPECTED_SEMANTIC_INVARIANTS.curriculumEvidenceCandidates}, got ${semanticInvariants.curriculumEvidenceCandidates}`);
  }
  if (semanticInvariants.assessmentEvidence !== EXPECTED_SEMANTIC_INVARIANTS.assessmentEvidence) {
    throw new Error(`Semantic invariant mismatch: assessmentEvidence expected ${EXPECTED_SEMANTIC_INVARIANTS.assessmentEvidence}, got ${semanticInvariants.assessmentEvidence}`);
  }

  // ---------------------------------------------------------------------
  // Read-only provenance preflights (task section 4).
  // ---------------------------------------------------------------------
  const sourceAccessLog = JSON.parse(readFileSync(path.join(cleanroomOutDir, "CC-19R-SOURCE-ACCESS-LOG.json"), "utf-8")) as {
    evidentialAccessLog: readonly { reference: string; locator: string; evidenceRole: string; permitted: boolean; outcome?: string }[];
  };
  const sampleQuestionsEntry = sourceAccessLog.evidentialAccessLog.find((e) => e.locator.includes("5357-2365_sample_papers_v1-2.pdf") || e.locator.includes("5357-and-2365-sample-papers-v1-2"));
  const markSchemeEntry = sourceAccessLog.evidentialAccessLog.find((e) => e.locator.includes("5357-2365_sample_papers_markschemes_v1-0.pdf") || e.locator.includes("mark-schemes-v1-0"));
  const publicAssessmentPreflight = {
    sampleQuestionsAttemptFound: Boolean(sampleQuestionsEntry),
    sampleQuestionsPermitted: sampleQuestionsEntry?.permitted === true,
    markSchemeAttemptFound: Boolean(markSchemeEntry),
    markSchemePermitted: markSchemeEntry?.permitted === true,
    assessmentEvidenceCount: fullInputForCheck.assessment.length,
    pass:
      Boolean(sampleQuestionsEntry) &&
      sampleQuestionsEntry?.permitted === true &&
      Boolean(markSchemeEntry) &&
      markSchemeEntry?.permitted === true &&
      fullInputForCheck.assessment.length === 0,
  };
  if (!publicAssessmentPreflight.pass) {
    throw new Error(`Public-assessment attempt trace preflight FAILED: ${JSON.stringify(publicAssessmentPreflight)}. STOPPING per task section 4.A -- do not repair, report only.`);
  }

  const sourceIdentityViolations = validateSourceAccessCompleteness();
  const sourceIdentityPreflight = {
    unmatchedSourceIdentities: sourceIdentityViolations.length,
    violations: sourceIdentityViolations,
    pass: sourceIdentityViolations.length === 0,
  };
  if (!sourceIdentityPreflight.pass) {
    throw new Error(`Source-identity access preflight FAILED: ${sourceIdentityViolations.length} unmatched. STOPPING per task section 4.B -- do not repair, report only.`);
  }

  // ---------------------------------------------------------------------
  // Production package integrity (task section 5).
  // ---------------------------------------------------------------------
  const pipelineStatus = execSync("git status --porcelain -- packages/qualification-pipeline", { cwd: repoRoot }).toString().trim();
  if (pipelineStatus !== "") {
    throw new Error(`packages/qualification-pipeline has uncommitted changes -- STOPPING: ${pipelineStatus}`);
  }
  const pipelineTreeHash = execSync("git rev-parse HEAD:packages/qualification-pipeline", { cwd: repoRoot }).toString().trim();

  // ---------------------------------------------------------------------
  // Execute the REAL production buildStandardPipeline, once per profile,
  // plus one determinism re-run each (task sections 6, 7, 10).
  // ---------------------------------------------------------------------
  const fullPublicRun = runProfile("FULL_PUBLIC");
  const degradedRun = runProfile("DEGRADED_NO_ASSESSMENT");

  if (fullPublicRun.inputMutated) {
    throw new Error(`buildStandardPipeline mutated its FULL_PUBLIC input (before=${fullPublicRun.inputHashBefore}, after=${fullPublicRun.inputHashAfter}). STOPPING per task section 7.`);
  }
  if (degradedRun.inputMutated) {
    throw new Error(`buildStandardPipeline mutated its DEGRADED_NO_ASSESSMENT input (before=${degradedRun.inputHashBefore}, after=${degradedRun.inputHashAfter}). STOPPING per task section 7.`);
  }
  if (!fullPublicRun.deterministic) {
    throw new Error(`Non-deterministic pipeline output for FULL_PUBLIC: first=${fullPublicRun.outputHash}, second=${fullPublicRun.secondRunOutputHash}. STOPPING per task section 10.`);
  }
  if (!degradedRun.deterministic) {
    throw new Error(`Non-deterministic pipeline output for DEGRADED_NO_ASSESSMENT: first=${degradedRun.outputHash}, second=${degradedRun.secondRunOutputHash}. STOPPING per task section 10.`);
  }

  // ---------------------------------------------------------------------
  // Profile input/output equality (task section 9).
  // ---------------------------------------------------------------------
  const fullInputAgain = assembleStandardInput("FULL_PUBLIC").input;
  const degradedInputAgain = assembleStandardInput("DEGRADED_NO_ASSESSMENT").input;
  const inputsIdentical = stableStringify(fullInputAgain) === stableStringify(degradedInputAgain);
  const outputsIdentical = fullPublicRun.outputHash === degradedRun.outputHash;
  if (inputsIdentical && !outputsIdentical) {
    throw new Error(`Determinism/integrity failure: FULL_PUBLIC and DEGRADED_NO_ASSESSMENT inputs are identical but outputs differ. STOPPING per task section 9 -- not choosing a "nicer" output.`);
  }

  // ---------------------------------------------------------------------
  // Write output files (task section 8).
  // ---------------------------------------------------------------------
  const fullInputHashWritten = writeJson(path.join(execOutDir, "CC-19B-FULL-PUBLIC-INPUT.json"), fullInputForCheck);
  const fullOutputHashWritten = writeJson(path.join(execOutDir, "CC-19B-FULL-PUBLIC-OUTPUT.json"), fullPublicRun.result);
  const degradedInputHashWritten = writeJson(path.join(execOutDir, "CC-19B-DEGRADED-NO-ASSESSMENT-INPUT.json"), degradedInputForCheck);
  const degradedOutputHashWritten = writeJson(path.join(execOutDir, "CC-19B-DEGRADED-NO-ASSESSMENT-OUTPUT.json"), degradedRun.result);

  const harnessSha256 = sha256OfFile(__filename);
  const nodeVersion = process.version;

  function mechanicalCounts(result: StandardPipelineResult) {
    const byDisposition: Record<string, number> = {};
    for (const c of result.candidates) byDisposition[c.disposition] = (byDisposition[c.disposition] ?? 0) + 1;
    const byGapType: Record<string, number> = {};
    for (const g of result.gaps) byGapType[g.gapType] = (byGapType[g.gapType] ?? 0) + 1;
    const byTechnicalCoverageStatus: Record<string, number> = {};
    for (const c of result.candidates) {
      const key = c.technicalCoverageStatus ?? "UNDECLARED";
      byTechnicalCoverageStatus[key] = (byTechnicalCoverageStatus[key] ?? 0) + 1;
    }
    return {
      totalCandidates: result.candidates.length,
      byDisposition,
      totalGaps: result.gaps.length,
      byGapType,
      byTechnicalCoverageStatus,
      unmatchedTechnicalTruthCount: result.unmatchedTechnicalTruth.length,
      unmatchedQualificationLevelCount: result.unmatchedQualificationLevel.length,
    };
  }

  const manifest = {
    generatedBy: "CC-19B execute-frozen-pipeline.ts",
    packageId: "CC-19B",
    purpose: "Mechanical execution of the REAL production buildStandardPipeline against the frozen (54a9ebb) Unit-202 clean-room input. Execution and freezing only -- no semantic judgement.",
    lineage: ["3c9b1dd", "20d65c6", "ea7e8be", "54a9ebb"],
    acceptedCombinedInputHash: ACCEPTED_COMBINED_INPUT_HASH,
    node: nodeVersion,
    harnessSha256,
    productionPipelineTreeHash: pipelineTreeHash,
    semanticInvariants: { ...semanticInvariants, expected: EXPECTED_SEMANTIC_INVARIANTS, matchedForVerifiedFields: true },
    provenancePreflights: { publicAssessmentAttemptTrace: publicAssessmentPreflight, sourceIdentityAccessTrace: sourceIdentityPreflight },
    profiles: {
      FULL_PUBLIC: {
        inputHashBefore: fullPublicRun.inputHashBefore,
        inputHashAfter: fullPublicRun.inputHashAfter,
        inputMutated: fullPublicRun.inputMutated,
        writtenInputFileHash: fullInputHashWritten,
        firstRunOutputHash: fullPublicRun.outputHash,
        secondRunOutputHash: fullPublicRun.secondRunOutputHash,
        writtenOutputFileHash: fullOutputHashWritten,
        deterministic: fullPublicRun.deterministic,
        mechanicalCounts: mechanicalCounts(fullPublicRun.result),
      },
      DEGRADED_NO_ASSESSMENT: {
        inputHashBefore: degradedRun.inputHashBefore,
        inputHashAfter: degradedRun.inputHashAfter,
        inputMutated: degradedRun.inputMutated,
        writtenInputFileHash: degradedInputHashWritten,
        firstRunOutputHash: degradedRun.outputHash,
        secondRunOutputHash: degradedRun.secondRunOutputHash,
        writtenOutputFileHash: degradedOutputHashWritten,
        deterministic: degradedRun.deterministic,
        mechanicalCounts: mechanicalCounts(degradedRun.result),
      },
    },
    profileInputsIdentical: inputsIdentical,
    profileOutputsIdentical: outputsIdentical,
    resultTopLevelShape: Object.keys(fullPublicRun.result).sort(),
  };

  const manifestHash = writeJson(path.join(execOutDir, "CC-19B-EXECUTION-MANIFEST.json"), manifest);

  // ---------------------------------------------------------------------
  // Mechanical result report (task section 12).
  // ---------------------------------------------------------------------
  function candidateTableRows(result: StandardPipelineResult): string {
    const header = "| candidateKey | subject | performanceType | disposition | scopeConf | depthConf | technicalTruthConf | technicalCoverageStatus | evidenceRefs | requiredFactKeys |";
    const sep = "|---|---|---|---|---|---|---|---|---|---|";
    const rows = result.candidates.map((c) => {
      return `| ${c.candidateKey} | ${c.subject} | ${c.performanceType} | ${c.disposition} | ${c.confidence.scopeConfidence} | ${c.confidence.depthConfidence} | ${c.confidence.technicalTruthConfidence} | ${c.technicalCoverageStatus ?? ""} | ${c.evidenceRefs.length} | ${(c.requiredFactKeys ?? []).length} |`;
    });
    return [header, sep, ...rows].join("\n");
  }

  function gapTableRows(result: StandardPipelineResult): string {
    const header = "| gapType | candidateKey | legitimateResolverRoles |";
    const sep = "|---|---|---|";
    const rows = result.gaps.map((g) => `| ${g.gapType} | ${g.candidateKey} | ${g.legitimateResolverRoles.join(", ")} |`);
    return [header, sep, ...rows].join("\n");
  }

  const md = `# CC-19B -- Frozen Unit-202 Clean-Room Input Through the Production Generic Qualification Pipeline

**This is a mechanical execution report.** It reports what \`buildStandardPipeline\` (the real, unmodified production function in \`packages/qualification-pipeline\`) returned when called against the frozen (commit 54a9ebb) Unit-202 clean-room input. It is NOT a semantic judgement. Nothing here should be read as "correct", "validated against Unit 202", "complete curriculum", or "production-ready course" -- those determinations belong to a later, separate Project-Architect review.

## Execution identity

- Lineage: 3c9b1dd -> 20d65c6 -> ea7e8be -> 54a9ebb
- Accepted combined assembled-input hash: \`${ACCEPTED_COMBINED_INPUT_HASH}\` -- MATCHED
- Node version: ${nodeVersion}
- Production \`packages/qualification-pipeline\` git tree hash: \`${pipelineTreeHash}\` (working tree clean)
- Execution harness SHA-256: \`${harnessSha256}\`

## Read-only provenance preflights

- **A. Public-assessment attempt trace**: sample-questions attempt found=${publicAssessmentPreflight.sampleQuestionsAttemptFound}, permitted=${publicAssessmentPreflight.sampleQuestionsPermitted}; mark-scheme attempt found=${publicAssessmentPreflight.markSchemeAttemptFound}, permitted=${publicAssessmentPreflight.markSchemePermitted}; AssessmentEvidence count=${publicAssessmentPreflight.assessmentEvidenceCount} -- **${publicAssessmentPreflight.pass ? "PASS" : "FAIL"}**
- **B. Source-identity access trace**: unmatched source identities=${sourceIdentityPreflight.unmatchedSourceIdentities} -- **${sourceIdentityPreflight.pass ? "PASS" : "FAIL"}**

## Semantic input invariants (verified against the frozen ledger, unchanged)

- CurriculumEvidence candidates: ${semanticInvariants.curriculumEvidenceCandidates} (expected ${EXPECTED_SEMANTIC_INVARIANTS.curriculumEvidenceCandidates})
- AssessmentEvidence: ${semanticInvariants.assessmentEvidence} (expected ${EXPECTED_SEMANTIC_INVARIANTS.assessmentEvidence})

## Profile input equality

\`INPUTS_IDENTICAL = ${inputsIdentical}\`

(Expected, mechanically confirmed rather than assumed: AssessmentEvidence = 0, so DEGRADED_NO_ASSESSMENT's profile filter removes nothing that FULL_PUBLIC has.)

## FULL_PUBLIC profile

- Input hash before invocation: \`${fullPublicRun.inputHashBefore}\`
- Input hash after invocation: \`${fullPublicRun.inputHashAfter}\` -- ${fullPublicRun.inputMutated ? "**MUTATED (FAILURE)**" : "unchanged"}
- First-run output hash: \`${fullPublicRun.outputHash}\`
- Second-run (determinism) output hash: \`${fullPublicRun.secondRunOutputHash}\` -- ${fullPublicRun.deterministic ? "MATCHES (deterministic)" : "**MISMATCH (non-deterministic, FAILURE)**"}

Mechanical counts (fields exactly as emitted by \`StandardPipelineResult\`):

- Total candidates: ${manifest.profiles.FULL_PUBLIC.mechanicalCounts.totalCandidates}
- Candidates by \`disposition\`: ${JSON.stringify(manifest.profiles.FULL_PUBLIC.mechanicalCounts.byDisposition)}
- Candidates by \`technicalCoverageStatus\`: ${JSON.stringify(manifest.profiles.FULL_PUBLIC.mechanicalCounts.byTechnicalCoverageStatus)}
- Total gaps: ${manifest.profiles.FULL_PUBLIC.mechanicalCounts.totalGaps}
- Gaps by \`gapType\`: ${JSON.stringify(manifest.profiles.FULL_PUBLIC.mechanicalCounts.byGapType)}
- \`unmatchedTechnicalTruth\`: ${manifest.profiles.FULL_PUBLIC.mechanicalCounts.unmatchedTechnicalTruthCount}
- \`unmatchedQualificationLevel\`: ${manifest.profiles.FULL_PUBLIC.mechanicalCounts.unmatchedQualificationLevelCount}

### FULL_PUBLIC candidates (raw, as emitted)

${candidateTableRows(fullPublicRun.result)}

### FULL_PUBLIC gaps (raw, as emitted)

${gapTableRows(fullPublicRun.result)}

## DEGRADED_NO_ASSESSMENT profile

- Input hash before invocation: \`${degradedRun.inputHashBefore}\`
- Input hash after invocation: \`${degradedRun.inputHashAfter}\` -- ${degradedRun.inputMutated ? "**MUTATED (FAILURE)**" : "unchanged"}
- First-run output hash: \`${degradedRun.outputHash}\`
- Second-run (determinism) output hash: \`${degradedRun.secondRunOutputHash}\` -- ${degradedRun.deterministic ? "MATCHES (deterministic)" : "**MISMATCH (non-deterministic, FAILURE)**"}

Mechanical counts:

- Total candidates: ${manifest.profiles.DEGRADED_NO_ASSESSMENT.mechanicalCounts.totalCandidates}
- Candidates by \`disposition\`: ${JSON.stringify(manifest.profiles.DEGRADED_NO_ASSESSMENT.mechanicalCounts.byDisposition)}
- Candidates by \`technicalCoverageStatus\`: ${JSON.stringify(manifest.profiles.DEGRADED_NO_ASSESSMENT.mechanicalCounts.byTechnicalCoverageStatus)}
- Total gaps: ${manifest.profiles.DEGRADED_NO_ASSESSMENT.mechanicalCounts.totalGaps}
- Gaps by \`gapType\`: ${JSON.stringify(manifest.profiles.DEGRADED_NO_ASSESSMENT.mechanicalCounts.byGapType)}
- \`unmatchedTechnicalTruth\`: ${manifest.profiles.DEGRADED_NO_ASSESSMENT.mechanicalCounts.unmatchedTechnicalTruthCount}
- \`unmatchedQualificationLevel\`: ${manifest.profiles.DEGRADED_NO_ASSESSMENT.mechanicalCounts.unmatchedQualificationLevelCount}

## Profile output equality

\`OUTPUTS_IDENTICAL = ${outputsIdentical}\`

## Result type / top-level shape

\`StandardPipelineResult\` keys as actually returned: ${JSON.stringify(manifest.resultTopLevelShape)}

## What this report does NOT say

This report does not say the resulting candidates are curriculum-correct, that course scope or depth is correct, that facts are sufficient, that Unit 202 is calibrated, or that this is ready for lessons. It says only: **the production \`buildStandardPipeline\` function executed against this frozen input, deterministically, without mutating its input, and this is exactly what it returned.**
`;

  const mdPath = path.join(execOutDir, "CC-19B-PIPELINE-RESULT.md");
  writeFileSync(mdPath, md, "utf-8");
  const mdHash = sha256OfFile(mdPath);

  // ---------------------------------------------------------------------
  // Freeze (task section 14).
  // ---------------------------------------------------------------------
  const freeze = {
    generatedBy: "CC-19B execute-frozen-pipeline.ts",
    packageId: "CC-19B",
    purpose: "Freezes the first mechanical execution of the real production buildStandardPipeline against the accepted CC-19R2 frozen Unit-202 clean-room input.",
    lineage: ["3c9b1dd", "20d65c6", "ea7e8be", "54a9ebb"],
    acceptedCc19r2FreezeHash: ACCEPTED_COMBINED_INPUT_HASH,
    productionQualificationPipelineTreeHash: pipelineTreeHash,
    node: nodeVersion,
    executionHarnessSha256: harnessSha256,
    FULL_PUBLIC: {
      inputSha256: fullInputHashWritten,
      outputSha256: fullOutputHashWritten,
      secondRunOutputSha256: fullPublicRun.secondRunOutputHash,
      inputBeforeHash: fullPublicRun.inputHashBefore,
      inputAfterHash: fullPublicRun.inputHashAfter,
    },
    DEGRADED_NO_ASSESSMENT: {
      inputSha256: degradedInputHashWritten,
      outputSha256: degradedOutputHashWritten,
      secondRunOutputSha256: degradedRun.secondRunOutputHash,
      inputBeforeHash: degradedRun.inputHashBefore,
      inputAfterHash: degradedRun.inputHashAfter,
    },
    profileInputEqualityResult: inputsIdentical,
    profileOutputEqualityResult: outputsIdentical,
    determinismResult: fullPublicRun.deterministic && degradedRun.deterministic,
    semanticInputInvariants: { ...semanticInvariants, expected: EXPECTED_SEMANTIC_INVARIANTS },
    readOnlyProvenancePreflightResult: {
      publicAssessmentAttemptTrace: publicAssessmentPreflight.pass ? "PASS" : "FAIL",
      sourceIdentityAccessTrace: sourceIdentityPreflight.pass ? "PASS" : "FAIL",
    },
    outputArtefactHashes: {
      "reports/backtests/unit202-cleanroom/pipeline-execution/CC-19B-FULL-PUBLIC-INPUT.json": fullInputHashWritten,
      "reports/backtests/unit202-cleanroom/pipeline-execution/CC-19B-FULL-PUBLIC-OUTPUT.json": fullOutputHashWritten,
      "reports/backtests/unit202-cleanroom/pipeline-execution/CC-19B-DEGRADED-NO-ASSESSMENT-INPUT.json": degradedInputHashWritten,
      "reports/backtests/unit202-cleanroom/pipeline-execution/CC-19B-DEGRADED-NO-ASSESSMENT-OUTPUT.json": degradedOutputHashWritten,
      "reports/backtests/unit202-cleanroom/pipeline-execution/CC-19B-EXECUTION-MANIFEST.json": manifestHash,
      "reports/backtests/unit202-cleanroom/pipeline-execution/CC-19B-PIPELINE-RESULT.md": mdHash,
    },
  };

  writeJson(path.join(execOutDir, "CC-19B-FREEZE.json"), freeze);

  console.log("CC-19B execution complete.");
  console.log(JSON.stringify({ ...freeze, outputArtefactHashes: undefined }, null, 2));
}

main();
