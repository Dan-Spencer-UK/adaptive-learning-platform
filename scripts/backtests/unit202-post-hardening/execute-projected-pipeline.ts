/**
 * CC-21: mechanical execution of the REAL, exported production
 * `buildStandardPipeline` (packages/qualification-pipeline, hardened
 * through CC-20/CC-20A/CC-20B) against the SAME accepted, frozen Unit-202
 * clean-room normalization used by CC-19B -- after a strictly mechanical
 * schema-compatibility projection (see ./project-performance-basis.ts)
 * that adds ONLY `CurriculumEvidence.commandVerbPerformanceBasis`, derived
 * exclusively from the already-frozen `layerB.normalizationConfidence`
 * value on each ledger entry.
 *
 * This script performs NO renormalization, NO subject rewriting, NO new
 * research, NO semantic adjudication, and NO post-processing of the
 * returned result. It imports the real production pipeline unchanged and
 * serializes exactly what it returns. A successful run means only that
 * `buildStandardPipeline` executed against this mechanically-projected
 * input -- it is NOT a semantic judgement of curriculum correctness,
 * completeness, or Unit-202 calibration. That determination belongs to a
 * later, separate Project-Architect review.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildStandardPipeline } from "@alp/qualification-pipeline";
import type { KnowledgeCandidate, StandardPipelineInput, StandardPipelineResult } from "@alp/qualification-pipeline";

import { assembleStandardInput, type Profile } from "../unit202-cleanroom/assemble-standard-input.ts";
import { ledger } from "../unit202-cleanroom/build-ledger.ts";
import { applyPerformanceBasisProjection, computePerformanceBasisProjection, verifyOnlyPerformanceBasisAdded } from "./project-performance-basis.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const cleanroomOutDir = path.join(repoRoot, "reports", "backtests", "unit202-cleanroom");
const cc19bOutputPath = path.join(cleanroomOutDir, "pipeline-execution", "CC-19B-FULL-PUBLIC-OUTPUT.json");
const outDir = path.join(repoRoot, "reports", "backtests", "unit202-post-hardening");

const ACCEPTED_COMBINED_BASE_INPUT_HASH = "4e10f5692805b0ef2a6f0c781e87d5639276c87683e284c57634489c648c4437";
const PROJECTION_ALGORITHM_VERSION = "CC-21-performance-basis-projection-v1";

function sha256Hex(data: string | Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}
function sha256OfFile(absPath: string): string {
  return sha256Hex(readFileSync(absPath));
}
function stableStringify(value: unknown): string {
  const seen = new WeakSet();
  function sortKeys(v: unknown): unknown {
    if (v === null || typeof v !== "object") return v;
    if (seen.has(v as object)) throw new Error("stableStringify: circular reference");
    seen.add(v as object);
    if (Array.isArray(v)) return v.map(sortKeys);
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v as Record<string, unknown>).sort()) out[k] = sortKeys((v as Record<string, unknown>)[k]);
    return out;
  }
  return JSON.stringify(sortKeys(value));
}
/** Canonical pretty-printed form -- IDENTICAL to what writeJson() persists to disk, so hashes computed here are directly comparable to a written file's own hash. */
function canonicalJson(value: unknown): string {
  return JSON.stringify(value, null, 2) + "\n";
}
function writeJson(absPath: string, value: unknown): string {
  const text = canonicalJson(value);
  writeFileSync(absPath, text, "utf-8");
  return sha256Hex(text);
}

// ---------------------------------------------------------------------
// Mechanical count helpers (task section 13). Never hardcoded -- every
// count derives from the actual result object at hand.
// ---------------------------------------------------------------------
function countBy<T extends string>(values: readonly (T | undefined)[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const v of values) {
    const key = v ?? "(undeclared)";
    out[key] = (out[key] ?? 0) + 1;
  }
  return out;
}

/**
 * Defensive against the OLD (pre-CC-20) result schema too -- the historical
 * CC-19B-FULL-PUBLIC-OUTPUT.json this is also used to summarise for the
 * old-vs-new diff (task section 15) predates `semanticAdjudicationOutcomes`/
 * `representativeExemplars`/`performanceProvenance`/`depthBasis`/
 * `knowledgeBoundaryStatus` entirely -- every such field is read
 * optionally here so the SAME function can mechanically summarise both.
 */
function mechanicalResultCounts(result: StandardPipelineResult) {
  const semanticAdjudicationOutcomes = result.semanticAdjudicationOutcomes ?? [];
  const representativeExemplars = result.representativeExemplars ?? [];
  return {
    candidates: {
      total: result.candidates.length,
      byDisposition: countBy(result.candidates.map((c) => c.disposition)),
    },
    performanceProvenance: countBy(result.candidates.map((c) => c.performanceProvenance)),
    depthBasis: countBy(result.candidates.map((c) => c.depthBasis)),
    depthConfidence: countBy(result.candidates.map((c) => c.confidence.depthConfidence)),
    knowledgeBoundaryStatus: countBy(result.candidates.map((c) => c.knowledgeBoundaryStatus)),
    technicalCoverageStatus: countBy(result.candidates.map((c) => c.technicalCoverageStatus)),
    gapsByType: countBy(result.gaps.map((g) => g.gapType)),
    totalGaps: result.gaps.length,
    semanticAdjudication: {
      outcomesRecorded: semanticAdjudicationOutcomes.length,
      activeGoverning: semanticAdjudicationOutcomes.filter((a) => a.decision === "REQUIRED_CORE" || a.decision === "REQUIRED_OPERATIONAL").length,
      representativeExemplars: representativeExemplars.length,
    },
  };
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

function runProfile(profile: Profile, projectedInput: StandardPipelineInput, freshProjectedInput: StandardPipelineInput): ProfileRunResult {
  const inputHashBefore = sha256Hex(stableStringify(projectedInput));
  const result = buildStandardPipeline(projectedInput);
  const inputHashAfter = sha256Hex(stableStringify(projectedInput));
  const inputMutated = inputHashBefore !== inputHashAfter;
  const outputHash = sha256Hex(canonicalJson(result));

  // Determinism check: a SECOND invocation on a genuinely fresh (freshly
  // assembled + freshly projected) copy, only after the first result is
  // already computed and hashed above -- never a rerun with altered input.
  const secondResult = buildStandardPipeline(freshProjectedInput);
  const secondRunOutputHash = sha256Hex(canonicalJson(secondResult));

  return { profile, inputHashBefore, inputHashAfter, inputMutated, outputHash, secondRunOutputHash, deterministic: outputHash === secondRunOutputHash, result };
}

function candidateGapTypes(result: StandardPipelineResult, candidateKey: string): string[] {
  return [...new Set(result.gaps.filter((g) => g.candidateKey === candidateKey).map((g) => g.gapType))].sort();
}

function pendingReviewProposedFactKeys(input: StandardPipelineInput, candidate: KnowledgeCandidate): string[] {
  const governing = new Set(candidate.requiredFactKeys ?? []);
  return [...new Set((input.factRequirements ?? []).filter((f) => f.targetCandidateKey === candidate.candidateKey && f.derivationStatus === "REVIEW_PROPOSED" && !governing.has(f.claimKey)).map((f) => f.claimKey))].sort();
}

function candidateTableRow(c: KnowledgeCandidate, input: StandardPipelineInput, result: StandardPipelineResult): string {
  const sourceEvidenceIds = c.evidenceRefs.map((r) => `${r.role}:${r.evidenceId}`).join("; ");
  const requiredFactKeys = (c.requiredFactKeys ?? []).join(", ");
  const pending = pendingReviewProposedFactKeys(input, c).join(", ");
  const attachedClaims = Object.keys(c.factualStatementsByClaimKey ?? {}).join(", ");
  const gapTypes = candidateGapTypes(result, c.candidateKey).join(", ");
  return `| ${c.candidateKey} | ${c.subject} | ${c.performanceType} | ${c.disposition} | ${c.parentSubject ?? ""} | ${sourceEvidenceIds} | ${c.performanceProvenance ?? ""} | ${c.depthBasis ?? ""} | ${c.confidence.depthConfidence} | ${c.assessmentCalibrationAvailable ?? false} | ${c.knowledgeBoundaryStatus ?? ""} | ${c.technicalCoverageStatus ?? ""} | ${requiredFactKeys} | ${pending} | ${attachedClaims} | ${gapTypes} |`;
}

function main(): void {
  mkdirSync(outDir, { recursive: true });

  // ---------------------------------------------------------------------
  // Section 3: base frozen input must remain reproducible and unmutated.
  // ---------------------------------------------------------------------
  const baseFull = assembleStandardInput("FULL_PUBLIC").input;
  const baseDegraded = assembleStandardInput("DEGRADED_NO_ASSESSMENT").input;
  const baseCombinedHash = sha256Hex(JSON.stringify({ fullPublic: baseFull, degraded: baseDegraded }));
  if (baseCombinedHash !== ACCEPTED_COMBINED_BASE_INPUT_HASH) {
    throw new Error(`BASE_FROZEN_INPUT_HASH mismatch: expected ${ACCEPTED_COMBINED_BASE_INPUT_HASH}, got ${baseCombinedHash}. STOPPING -- the historical assembled input could not be reproduced. Not repairing.`);
  }
  const BASE_FROZEN_INPUT_HASH = baseCombinedHash;

  // ---------------------------------------------------------------------
  // Section 5: AssessmentEvidence must be exactly 0, or STOP.
  // ---------------------------------------------------------------------
  if (baseFull.assessment.length !== 0 || baseDegraded.assessment.length !== 0) {
    throw new Error(`Expected zero AssessmentEvidence in the frozen base input -- got FULL_PUBLIC=${baseFull.assessment.length}, DEGRADED=${baseDegraded.assessment.length}. STOPPING per task section 5 -- no mapping is invented.`);
  }
  if ((baseFull.semanticAdjudications ?? []).length !== 0 || (baseDegraded.semanticAdjudications ?? []).length !== 0) {
    throw new Error("Expected zero SemanticAdjudications in the frozen base input. STOPPING.");
  }

  // ---------------------------------------------------------------------
  // Section 4: compute the mechanical performance-basis projection from
  // the frozen ledger's own already-recorded normalizationConfidence.
  // ---------------------------------------------------------------------
  const projection = computePerformanceBasisProjection(ledger);

  function freshProjectedInput(profile: Profile): StandardPipelineInput {
    return applyPerformanceBasisProjection(assembleStandardInput(profile).input, projection.basisByEvidenceId);
  }

  const projectedFull = applyPerformanceBasisProjection(baseFull, projection.basisByEvidenceId);
  const projectedDegraded = applyPerformanceBasisProjection(baseDegraded, projection.basisByEvidenceId);

  // ---------------------------------------------------------------------
  // Section 6-7: mechanically PROVE only commandVerbPerformanceBasis was
  // added, on both profiles.
  // ---------------------------------------------------------------------
  const fullVerification = verifyOnlyPerformanceBasisAdded(baseFull, projectedFull);
  const degradedVerification = verifyOnlyPerformanceBasisAdded(baseDegraded, projectedDegraded);
  if (!fullVerification.ok) {
    throw new Error(`FULL_PUBLIC projection verification FAILED -- unauthorised change(s) detected: ${JSON.stringify(fullVerification.violations)}. STOPPING.`);
  }
  if (!degradedVerification.ok) {
    throw new Error(`DEGRADED_NO_ASSESSMENT projection verification FAILED -- unauthorised change(s) detected: ${JSON.stringify(degradedVerification.violations)}. STOPPING.`);
  }
  if ((projectedFull.assessment.length !== 0) || (projectedDegraded.assessment.length !== 0)) {
    throw new Error("Projected input unexpectedly gained AssessmentEvidence. STOPPING.");
  }
  if ((projectedFull.semanticAdjudications ?? []).length !== 0 || (projectedDegraded.semanticAdjudications ?? []).length !== 0) {
    throw new Error("Projected input unexpectedly gained SemanticAdjudications. STOPPING.");
  }

  // ---------------------------------------------------------------------
  // Write the projection ledger + report (task section 7-8).
  // ---------------------------------------------------------------------
  const projectionLedgerHash = writeJson(path.join(outDir, "CC-21-PERFORMANCE-BASIS-PROJECTION.json"), {
    generatedBy: "CC-21 project-performance-basis.ts",
    algorithmVersion: PROJECTION_ALGORITHM_VERSION,
    rules: [
      'commandVerbPerformanceType populated AND normalizationConfidence === "EXPLICIT" -> commandVerbPerformanceBasis: "SOURCE_EXPLICIT"',
      'commandVerbPerformanceType populated AND normalizationConfidence === "STRONG_INFERENCE" -> commandVerbPerformanceBasis: "STRONG_INFERENCE"',
      "anything else -> left untouched (no field added)",
    ],
    counts: projection.counts,
    entries: projection.entries,
  });

  const projectionMd = `# CC-21 -- Mechanical Performance-Basis Projection

Derived exclusively from the already-frozen \`layerB.normalizationConfidence\` value recorded on each \`CurriculumEvidence\` entry in the accepted Unit-202 clean-room ledger. No subject text, command-verb text, AC number, model judgement, calibration material, or the current Unit-202 matrix was read.

## Rules

- \`commandVerbPerformanceType\` populated AND \`normalizationConfidence === "EXPLICIT"\` → \`commandVerbPerformanceBasis: "SOURCE_EXPLICIT"\`
- \`commandVerbPerformanceType\` populated AND \`normalizationConfidence === "STRONG_INFERENCE"\` → \`commandVerbPerformanceBasis: "STRONG_INFERENCE"\`
- anything else → left untouched (no field added)

## Counts

- CurriculumEvidence total: ${projection.counts.curriculumEvidenceTotal}
- With populated commandVerbPerformanceType: ${projection.counts.withPopulatedCommandVerbPerformanceType}
- Projected SOURCE_EXPLICIT: ${projection.counts.projectedSourceExplicit}
- Projected STRONG_INFERENCE: ${projection.counts.projectedStrongInference}
- Performance field absent (untouched): ${projection.counts.performanceFieldAbsent}
- Left untouched for another reason (untouched): ${projection.counts.leftUntouchedOther}

## Mechanical proof

- FULL_PUBLIC projection verification: ${fullVerification.ok ? "PASS -- only commandVerbPerformanceBasis was added" : "FAIL"}
- DEGRADED_NO_ASSESSMENT projection verification: ${degradedVerification.ok ? "PASS -- only commandVerbPerformanceBasis was added" : "FAIL"}
`;
  const projectionMdPath = path.join(outDir, "CC-21-PERFORMANCE-BASIS-PROJECTION.md");
  writeFileSync(projectionMdPath, projectionMd, "utf-8");
  const projectionMdHash = sha256OfFile(projectionMdPath);

  // ---------------------------------------------------------------------
  // Section 9: freeze projected input BEFORE execution.
  // ---------------------------------------------------------------------
  const fullInputHash = writeJson(path.join(outDir, "CC-21-FULL-PUBLIC-INPUT.json"), projectedFull);
  const degradedInputHash = writeJson(path.join(outDir, "CC-21-DEGRADED-NO-ASSESSMENT-INPUT.json"), projectedDegraded);
  const profileInputsIdentical = stableStringify(projectedFull) === stableStringify(projectedDegraded);

  // ---------------------------------------------------------------------
  // Section 10: production pipeline integrity.
  // ---------------------------------------------------------------------
  const pipelineStatus = execSync("git status --porcelain -- packages/qualification-pipeline", { cwd: repoRoot }).toString().trim();
  if (pipelineStatus !== "") {
    throw new Error(`packages/qualification-pipeline has uncommitted changes -- STOPPING: ${pipelineStatus}`);
  }
  const pipelineTreeHash = execSync("git rev-parse HEAD:packages/qualification-pipeline", { cwd: repoRoot }).toString().trim();

  // ---------------------------------------------------------------------
  // Section 11: execute the REAL production buildStandardPipeline.
  // ---------------------------------------------------------------------
  const fullRun = runProfile("FULL_PUBLIC", projectedFull, freshProjectedInput("FULL_PUBLIC"));
  const degradedRun = runProfile("DEGRADED_NO_ASSESSMENT", projectedDegraded, freshProjectedInput("DEGRADED_NO_ASSESSMENT"));

  if (fullRun.inputMutated) throw new Error(`buildStandardPipeline mutated its FULL_PUBLIC projected input. STOPPING.`);
  if (degradedRun.inputMutated) throw new Error(`buildStandardPipeline mutated its DEGRADED_NO_ASSESSMENT projected input. STOPPING.`);
  if (!fullRun.deterministic) throw new Error(`Non-deterministic pipeline output for FULL_PUBLIC. STOPPING.`);
  if (!degradedRun.deterministic) throw new Error(`Non-deterministic pipeline output for DEGRADED_NO_ASSESSMENT. STOPPING.`);

  const profileOutputsIdentical = fullRun.outputHash === degradedRun.outputHash;
  if (profileInputsIdentical && !profileOutputsIdentical) {
    throw new Error("Determinism/integrity failure: identical projected inputs produced different outputs. STOPPING -- not choosing a result.");
  }

  const fullOutputHash = writeJson(path.join(outDir, "CC-21-FULL-PUBLIC-OUTPUT.json"), fullRun.result);
  const degradedOutputHash = writeJson(path.join(outDir, "CC-21-DEGRADED-NO-ASSESSMENT-OUTPUT.json"), degradedRun.result);

  // ---------------------------------------------------------------------
  // Section 13-14: mechanical counts + candidate-by-candidate export.
  // ---------------------------------------------------------------------
  const fullCounts = mechanicalResultCounts(fullRun.result);
  const degradedCounts = mechanicalResultCounts(degradedRun.result);

  const candidateHeader =
    "| candidateKey | subject | performanceType | disposition | parentSubject | evidenceRefs | performanceProvenance | depthBasis | depthConfidence | assessmentCalibrationAvailable | knowledgeBoundaryStatus | technicalCoverageStatus | requiredFactKeys | pendingReviewProposedFactKeys | attachedFactualClaimKeys | gapTypes |";
  const candidateSep = "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|";
  const candidateRows = fullRun.result.candidates.map((c) => candidateTableRow(c, projectedFull, fullRun.result));

  // ---------------------------------------------------------------------
  // Section 15: mechanical old (CC-19B) vs new (CC-21) diff.
  // ---------------------------------------------------------------------
  const historicalOutput = JSON.parse(readFileSync(cc19bOutputPath, "utf-8")) as StandardPipelineResult;
  const historicalOutputHash = sha256OfFile(cc19bOutputPath);
  const historicalCounts = mechanicalResultCounts(historicalOutput);
  const oldCandidateFieldKeys = new Set(historicalOutput.candidates.flatMap((c) => Object.keys(c)));
  const newCandidateFieldKeys = new Set(fullRun.result.candidates.flatMap((c) => Object.keys(c)));
  const fieldsAddedToCandidate = [...newCandidateFieldKeys].filter((k) => !oldCandidateFieldKeys.has(k)).sort();
  const fieldsRemovedFromCandidate = [...oldCandidateFieldKeys].filter((k) => !newCandidateFieldKeys.has(k)).sort();
  const oldResultTopLevelKeys = Object.keys(historicalOutput).sort();
  const newResultTopLevelKeys = Object.keys(fullRun.result).sort();
  const oldGapTypes = new Set(Object.keys(historicalCounts.gapsByType));
  const newGapTypes = new Set(Object.keys(fullCounts.gapsByType));
  const oldTechnicalCoverageValues = new Set(Object.keys(historicalCounts.technicalCoverageStatus));
  const newTechnicalCoverageValues = new Set(Object.keys(fullCounts.technicalCoverageStatus));

  const oldVsNewDiff = {
    generatedBy: "CC-21 execute-projected-pipeline.ts",
    purpose: "Mechanical diff only -- no quality/preference judgement of either side.",
    old: { source: "reports/backtests/unit202-cleanroom/pipeline-execution/CC-19B-FULL-PUBLIC-OUTPUT.json", sha256: historicalOutputHash, counts: historicalCounts, resultTopLevelKeys: oldResultTopLevelKeys },
    new: { source: "reports/backtests/unit202-post-hardening/CC-21-FULL-PUBLIC-OUTPUT.json", sha256: fullOutputHash, counts: fullCounts, resultTopLevelKeys: newResultTopLevelKeys },
    resultTopLevelFieldsAdded: newResultTopLevelKeys.filter((k) => !oldResultTopLevelKeys.includes(k)),
    resultTopLevelFieldsRemoved: oldResultTopLevelKeys.filter((k) => !newResultTopLevelKeys.includes(k)),
    candidateFieldsAdded: fieldsAddedToCandidate,
    candidateFieldsRemoved: fieldsRemovedFromCandidate,
    candidateCountDifference: fullRun.result.candidates.length - historicalOutput.candidates.length,
    dispositionCounts: { old: historicalCounts.candidates.byDisposition, new: fullCounts.candidates.byDisposition },
    depthConfidenceCounts: { old: historicalCounts.depthConfidence, new: fullCounts.depthConfidence },
    gapTypeCounts: { old: historicalCounts.gapsByType, new: fullCounts.gapsByType },
    gapTypesAddedInNewSchema: [...newGapTypes].filter((t) => !oldGapTypes.has(t)).sort(),
    gapTypesAbsentInNewOutput: [...oldGapTypes].filter((t) => !newGapTypes.has(t)).sort(),
    technicalCoverageStatusVocabulary: { old: [...oldTechnicalCoverageValues].sort(), new: [...newTechnicalCoverageValues].sort() },
    technicalCoverageStatusValuesAddedInNewSchema: [...newTechnicalCoverageValues].filter((v) => !oldTechnicalCoverageValues.has(v)).sort(),
    technicalCoverageStatusValuesAbsentInNewOutput: [...oldTechnicalCoverageValues].filter((v) => !newTechnicalCoverageValues.has(v)).sort(),
    knowledgeBoundaryStatusCounts: { old: "(field did not exist in the old schema)", new: fullCounts.knowledgeBoundaryStatus },
    performanceProvenanceCounts: { old: "(field did not exist in the old schema)", new: fullCounts.performanceProvenance },
    depthBasisCounts: { old: "(field did not exist in the old schema)", new: fullCounts.depthBasis },
  };
  const oldVsNewDiffHash = writeJson(path.join(outDir, "CC-21-OLD-VS-NEW-MECHANICAL-DIFF.json"), oldVsNewDiff);

  // ---------------------------------------------------------------------
  // Write CC-21-RESULT.md.
  // ---------------------------------------------------------------------
  const nodeVersion = process.version;
  const harnessSha256 = sha256OfFile(__filename);
  const projectionModuleSha256 = sha256OfFile(path.join(__dirname, "project-performance-basis.ts"));

  const resultMd = `# CC-21 -- Frozen Unit-202 Evidence Rerun Through the Hardened Generic Pipeline

**This is a mechanical execution report.** It reports what the CURRENT, hardened (CC-20/CC-20A/CC-20B) production \`buildStandardPipeline\` returns from the SAME accepted, frozen Unit-202 clean-room normalization used by CC-19B, after a strictly mechanical schema-compatibility projection (see \`CC-21-PERFORMANCE-BASIS-PROJECTION.md\`). It is NOT a semantic judgement. Nothing here should be read as "correct", "validated against Unit 202", "better", "worse", or "ready for lessons" -- those determinations belong to a later, separate Project-Architect review. The 70 REVIEW_PROPOSED facts in the frozen input remain deliberately unadjudicated.

## Execution identity

- Base frozen input hash (BASE_FROZEN_INPUT_HASH): \`${BASE_FROZEN_INPUT_HASH}\` -- MATCHED
- Production \`packages/qualification-pipeline\` git tree hash: \`${pipelineTreeHash}\` (working tree clean)
- Node version: ${nodeVersion}
- Execution harness SHA-256: \`${harnessSha256}\`
- Projection module SHA-256: \`${projectionModuleSha256}\`

## Performance-basis projection

- CurriculumEvidence total: ${projection.counts.curriculumEvidenceTotal}
- Projected SOURCE_EXPLICIT: ${projection.counts.projectedSourceExplicit}
- Projected STRONG_INFERENCE: ${projection.counts.projectedStrongInference}
- Performance field absent (untouched): ${projection.counts.performanceFieldAbsent}
- Left untouched for another reason: ${projection.counts.leftUntouchedOther}
- Full details: \`CC-21-PERFORMANCE-BASIS-PROJECTION.json\` / \`.md\`

## Profile input equality

\`INPUTS_IDENTICAL = ${profileInputsIdentical}\`

## FULL_PUBLIC profile

- Input hash before invocation: \`${fullRun.inputHashBefore}\`
- Input hash after invocation: \`${fullRun.inputHashAfter}\` -- ${fullRun.inputMutated ? "**MUTATED (FAILURE)**" : "unchanged"}
- First-run output hash: \`${fullRun.outputHash}\`
- Second-run (determinism) output hash: \`${fullRun.secondRunOutputHash}\` -- ${fullRun.deterministic ? "MATCHES (deterministic)" : "**MISMATCH (FAILURE)**"}

### Mechanical result counts (FULL_PUBLIC)

- Total candidates: ${fullCounts.candidates.total}
- By disposition: ${JSON.stringify(fullCounts.candidates.byDisposition)}
- performanceProvenance: ${JSON.stringify(fullCounts.performanceProvenance)}
- depthBasis: ${JSON.stringify(fullCounts.depthBasis)}
- depthConfidence: ${JSON.stringify(fullCounts.depthConfidence)}
- knowledgeBoundaryStatus: ${JSON.stringify(fullCounts.knowledgeBoundaryStatus)}
- technicalCoverageStatus: ${JSON.stringify(fullCounts.technicalCoverageStatus)}
- Total gaps: ${fullCounts.totalGaps}
- Gaps by type: ${JSON.stringify(fullCounts.gapsByType)}
- SemanticAdjudication: outcomesRecorded=${fullCounts.semanticAdjudication.outcomesRecorded}, activeGoverning=${fullCounts.semanticAdjudication.activeGoverning}, representativeExemplars=${fullCounts.semanticAdjudication.representativeExemplars}

## DEGRADED_NO_ASSESSMENT profile

- Input hash before invocation: \`${degradedRun.inputHashBefore}\`
- Input hash after invocation: \`${degradedRun.inputHashAfter}\` -- ${degradedRun.inputMutated ? "**MUTATED (FAILURE)**" : "unchanged"}
- First-run output hash: \`${degradedRun.outputHash}\`
- Second-run (determinism) output hash: \`${degradedRun.secondRunOutputHash}\` -- ${degradedRun.deterministic ? "MATCHES (deterministic)" : "**MISMATCH (FAILURE)**"}
- Mechanical result counts: ${JSON.stringify(degradedCounts)}

## Profile output equality

\`OUTPUTS_IDENTICAL = ${profileOutputsIdentical}\`

## Old (CC-19B) vs new (CC-21) mechanical diff summary

See \`CC-21-OLD-VS-NEW-MECHANICAL-DIFF.json\` for the complete machine-readable diff. Summary (mechanical only, no quality/preference judgement):

- Candidate count: old=${historicalCounts.candidates.total}, new=${fullCounts.candidates.total} (difference: ${oldVsNewDiff.candidateCountDifference})
- Result top-level fields added by the new schema: ${JSON.stringify(oldVsNewDiff.resultTopLevelFieldsAdded)}
- Candidate fields added by the new schema: ${JSON.stringify(oldVsNewDiff.candidateFieldsAdded)}
- Gap types present now but absent from the old output: ${JSON.stringify(oldVsNewDiff.gapTypesAddedInNewSchema)}
- Gap types present in the old output but absent now: ${JSON.stringify(oldVsNewDiff.gapTypesAbsentInNewOutput)}
- technicalCoverageStatus vocabulary -- old: ${JSON.stringify(oldVsNewDiff.technicalCoverageStatusVocabulary.old)}, new: ${JSON.stringify(oldVsNewDiff.technicalCoverageStatusVocabulary.new)}

## Candidate-by-candidate export (FULL_PUBLIC, complete -- ${candidateRows.length} candidates)

${candidateHeader}
${candidateSep}
${candidateRows.join("\n")}

## What this report does NOT say

This report does not say the resulting candidates are curriculum-correct, that course scope or depth is correct, that facts are sufficient, that Unit 202 is calibrated, or that this is ready for lessons/assertions. It says only: **the current, hardened production \`buildStandardPipeline\` executed against the same accepted frozen Unit-202 evidence (after a strictly mechanical schema-compatibility projection), deterministically, without mutating its input, and this is exactly what it returned.** Semantic adjudication of the 70 REVIEW_PROPOSED facts remains a separate, later, explicitly authorised step.
`;
  const resultMdPath = path.join(outDir, "CC-21-RESULT.md");
  writeFileSync(resultMdPath, resultMd, "utf-8");
  const resultMdHash = sha256OfFile(resultMdPath);

  // ---------------------------------------------------------------------
  // Section 19: freeze.
  // ---------------------------------------------------------------------
  const freeze = {
    generatedBy: "CC-21 execute-projected-pipeline.ts",
    packageId: "CC-21",
    purpose: "Mechanically project the frozen Unit-202 evidence to the current pipeline schema and rerun the hardened generic pipeline. Execution and freezing only -- no semantic adjudication.",
    mainHeadBeforeThisCommit: "ddde35f",
    baseFrozenInputHash: BASE_FROZEN_INPUT_HASH,
    historicalCc19bOutputHash: historicalOutputHash,
    productionQualificationPipelineTreeHash: pipelineTreeHash,
    node: nodeVersion,
    executionHarnessSha256: harnessSha256,
    projectionModuleSha256: projectionModuleSha256,
    projectionAlgorithmVersion: PROJECTION_ALGORITHM_VERSION,
    projectionLedgerSha256: projectionLedgerHash,
    projectionCounts: projection.counts,
    projectionVerification: { FULL_PUBLIC: fullVerification, DEGRADED_NO_ASSESSMENT: degradedVerification },
    FULL_PUBLIC: {
      inputSha256: fullInputHash,
      outputSha256: fullOutputHash,
      secondRunOutputSha256: fullRun.secondRunOutputHash,
      inputBeforeHash: fullRun.inputHashBefore,
      inputAfterHash: fullRun.inputHashAfter,
    },
    DEGRADED_NO_ASSESSMENT: {
      inputSha256: degradedInputHash,
      outputSha256: degradedOutputHash,
      secondRunOutputSha256: degradedRun.secondRunOutputHash,
      inputBeforeHash: degradedRun.inputHashBefore,
      inputAfterHash: degradedRun.inputHashAfter,
    },
    profileInputEqualityResult: profileInputsIdentical,
    profileOutputEqualityResult: profileOutputsIdentical,
    determinismResult: fullRun.deterministic && degradedRun.deterministic,
    inputMutationResult: fullRun.inputMutated || degradedRun.inputMutated,
    outputArtefactHashes: {
      "reports/backtests/unit202-post-hardening/CC-21-PERFORMANCE-BASIS-PROJECTION.json": projectionLedgerHash,
      "reports/backtests/unit202-post-hardening/CC-21-PERFORMANCE-BASIS-PROJECTION.md": projectionMdHash,
      "reports/backtests/unit202-post-hardening/CC-21-FULL-PUBLIC-INPUT.json": fullInputHash,
      "reports/backtests/unit202-post-hardening/CC-21-FULL-PUBLIC-OUTPUT.json": fullOutputHash,
      "reports/backtests/unit202-post-hardening/CC-21-DEGRADED-NO-ASSESSMENT-INPUT.json": degradedInputHash,
      "reports/backtests/unit202-post-hardening/CC-21-DEGRADED-NO-ASSESSMENT-OUTPUT.json": degradedOutputHash,
      "reports/backtests/unit202-post-hardening/CC-21-OLD-VS-NEW-MECHANICAL-DIFF.json": oldVsNewDiffHash,
      "reports/backtests/unit202-post-hardening/CC-21-RESULT.md": resultMdHash,
    },
  };
  writeJson(path.join(outDir, "CC-21-FREEZE.json"), freeze);

  console.log("CC-21 execution complete.");
  console.log(JSON.stringify({ ...freeze, outputArtefactHashes: undefined }, null, 2));
}

main();
