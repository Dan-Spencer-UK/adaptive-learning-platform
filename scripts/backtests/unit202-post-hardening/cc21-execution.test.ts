/**
 * CC-21 section 20 (A-Q): proves the mechanical schema-compatibility
 * projection is derived exclusively from the already-frozen ledger's own
 * `normalizationConfidence`, changes nothing else, and that the frozen
 * CC-21 execution artefacts genuinely reflect a real, unmodified,
 * deterministic, non-mutating invocation of the production
 * `buildStandardPipeline` against the projected input. Does NOT import
 * execute-projected-pipeline.ts (importing it would re-run the entire
 * pipeline execution as a side effect) -- reads the already-frozen output
 * files and independently re-derives everything else.
 */
import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildStandardPipeline } from "@alp/qualification-pipeline";
import type { StandardPipelineResult } from "@alp/qualification-pipeline";

import { assembleStandardInput } from "../unit202-cleanroom/assemble-standard-input.ts";
import { ledger } from "../unit202-cleanroom/build-ledger.ts";
import { applyPerformanceBasisProjection, computePerformanceBasisProjection, verifyOnlyPerformanceBasisAdded } from "./project-performance-basis.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const cleanroomOutDir = path.join(repoRoot, "reports", "backtests", "unit202-cleanroom");
const cleanroomExecDir = path.join(cleanroomOutDir, "pipeline-execution");
const outDir = path.join(repoRoot, "reports", "backtests", "unit202-post-hardening");
const harnessPath = path.join(__dirname, "execute-projected-pipeline.ts");

const ACCEPTED_COMBINED_BASE_INPUT_HASH = "4e10f5692805b0ef2a6f0c781e87d5639276c87683e284c57634489c648c4437";

function readJson<T>(absPath: string): T {
  return JSON.parse(readFileSync(absPath, "utf-8")) as T;
}
function sha256OfFile(absPath: string): string {
  return createHash("sha256").update(readFileSync(absPath)).digest("hex");
}

interface Freeze {
  readonly baseFrozenInputHash: string;
  readonly historicalCc19bOutputHash: string;
  readonly productionQualificationPipelineTreeHash: string;
  readonly FULL_PUBLIC: { inputSha256: string; outputSha256: string; secondRunOutputSha256: string; inputBeforeHash: string; inputAfterHash: string };
  readonly DEGRADED_NO_ASSESSMENT: { inputSha256: string; outputSha256: string; secondRunOutputSha256: string; inputBeforeHash: string; inputAfterHash: string };
  readonly profileInputEqualityResult: boolean;
  readonly profileOutputEqualityResult: boolean;
  readonly determinismResult: boolean;
  readonly inputMutationResult: boolean;
  readonly outputArtefactHashes: Readonly<Record<string, string>>;
}

function loadFreeze(): Freeze {
  return readJson<Freeze>(path.join(outDir, "CC-21-FREEZE.json"));
}

describe("CC-21.A: historical base assembled input hash remains exactly the accepted value", () => {
  it("recomputed combined FULL_PUBLIC+DEGRADED hash matches", () => {
    const full = assembleStandardInput("FULL_PUBLIC").input;
    const degraded = assembleStandardInput("DEGRADED_NO_ASSESSMENT").input;
    const hash = createHash("sha256").update(JSON.stringify({ fullPublic: full, degraded })).digest("hex");
    expect(hash).toBe(ACCEPTED_COMBINED_BASE_INPUT_HASH);
  });
  it("the frozen freeze records the same value as BASE_FROZEN_INPUT_HASH", () => {
    expect(loadFreeze().baseFrozenInputHash).toBe(ACCEPTED_COMBINED_BASE_INPUT_HASH);
  });
});

describe("CC-21.B: historical CC-19 artefacts remain unchanged", () => {
  /**
   * Uses `git diff --exit-code` rather than a raw string/byte comparison --
   * this repo checks text files out with CRLF (core.autocrlf=true) while
   * the clean-room worktree they were originally frozen in used LF, so a
   * naive byte comparison flags cross-worktree line-ending drift as a
   * "change" even when git itself (which normalises for comparison) sees
   * none. `git diff` is the mechanically correct way to ask "did the
   * CONTENT change", and is what git status/commit itself relies on.
   */
  function gitDiffIsEmpty(relPath: string): boolean {
    try {
      execSync(`git diff --exit-code -- "${relPath}"`, { cwd: repoRoot, stdio: "pipe" });
      return true;
    } catch {
      return false;
    }
  }

  it("CC-19B-FULL-PUBLIC-OUTPUT.json has no content diff against HEAD", () => {
    expect(gitDiffIsEmpty("reports/backtests/unit202-cleanroom/pipeline-execution/CC-19B-FULL-PUBLIC-OUTPUT.json")).toBe(true);
  });
  it("CC-19B-FULL-PUBLIC-INPUT.json has no content diff against HEAD", () => {
    expect(gitDiffIsEmpty("reports/backtests/unit202-cleanroom/pipeline-execution/CC-19B-FULL-PUBLIC-INPUT.json")).toBe(true);
  });
  it("CC-19B-FREEZE.json has no content diff against HEAD", () => {
    expect(gitDiffIsEmpty("reports/backtests/unit202-cleanroom/pipeline-execution/CC-19B-FREEZE.json")).toBe(true);
  });
  it("the frozen CC-21 freeze recorded the historical CC-19B output's own hash, matching the file on disk right now", () => {
    expect(loadFreeze().historicalCc19bOutputHash).toBe(sha256OfFile(path.join(cleanroomExecDir, "CC-19B-FULL-PUBLIC-OUTPUT.json")));
  });
});

describe("CC-21.C: the projection uses only the frozen ledger's own normalizationConfidence", () => {
  it("every projection entry's originalNormalizationConfidence matches the ledger entry it was derived from", () => {
    const projection = computePerformanceBasisProjection(ledger);
    const byEvidenceId = new Map(ledger.filter((e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence").map((e) => [(e.layerB.normalizedRecord as { evidenceId: string }).evidenceId, e.layerB.normalizationConfidence] as const));
    for (const entry of projection.entries) {
      expect(byEvidenceId.get(entry.evidenceId)).toBe(entry.originalNormalizationConfidence);
    }
    expect(projection.entries.length).toBe(projection.counts.curriculumEvidenceTotal);
  });
});

describe("CC-21.D/E: EXPLICIT maps only to SOURCE_EXPLICIT, STRONG_INFERENCE maps only to STRONG_INFERENCE", () => {
  const projection = computePerformanceBasisProjection(ledger);

  it("[D] every SOURCE_EXPLICIT projection came from an EXPLICIT-confidence entry, and vice versa", () => {
    for (const entry of projection.entries) {
      if (entry.projectedCommandVerbPerformanceBasis === "SOURCE_EXPLICIT") expect(entry.originalNormalizationConfidence).toBe("EXPLICIT");
      if (entry.originalNormalizationConfidence === "EXPLICIT" && entry.performanceType !== "(absent)") expect(entry.projectedCommandVerbPerformanceBasis).toBe("SOURCE_EXPLICIT");
    }
  });

  it("[E] every STRONG_INFERENCE projection came from a STRONG_INFERENCE-confidence entry, and vice versa", () => {
    for (const entry of projection.entries) {
      if (entry.projectedCommandVerbPerformanceBasis === "STRONG_INFERENCE") expect(entry.originalNormalizationConfidence).toBe("STRONG_INFERENCE");
      if (entry.originalNormalizationConfidence === "STRONG_INFERENCE" && entry.performanceType !== "(absent)") expect(entry.projectedCommandVerbPerformanceBasis).toBe("STRONG_INFERENCE");
    }
  });
});

describe("CC-21.F: no input field other than commandVerbPerformanceBasis changes", () => {
  it("verifyOnlyPerformanceBasisAdded reports ok=true with zero violations for both profiles", () => {
    const projection = computePerformanceBasisProjection(ledger);
    const baseFull = assembleStandardInput("FULL_PUBLIC").input;
    const baseDegraded = assembleStandardInput("DEGRADED_NO_ASSESSMENT").input;
    const projectedFull = applyPerformanceBasisProjection(baseFull, projection.basisByEvidenceId);
    const projectedDegraded = applyPerformanceBasisProjection(baseDegraded, projection.basisByEvidenceId);
    const fullResult = verifyOnlyPerformanceBasisAdded(baseFull, projectedFull);
    const degradedResult = verifyOnlyPerformanceBasisAdded(baseDegraded, projectedDegraded);
    expect(fullResult.violations).toEqual([]);
    expect(fullResult.ok).toBe(true);
    expect(degradedResult.violations).toEqual([]);
    expect(degradedResult.ok).toBe(true);
  });

  it("the frozen freeze records this same verification result", () => {
    const freezeRaw = readJson<{ projectionVerification: { FULL_PUBLIC: { ok: boolean }; DEGRADED_NO_ASSESSMENT: { ok: boolean } } }>(path.join(outDir, "CC-21-FREEZE.json"));
    expect(freezeRaw.projectionVerification.FULL_PUBLIC.ok).toBe(true);
    expect(freezeRaw.projectionVerification.DEGRADED_NO_ASSESSMENT.ok).toBe(true);
  });
});

describe("CC-21.G/H: AssessmentEvidence and SemanticAdjudications remain zero", () => {
  it("[G] AssessmentEvidence is 0 for both profiles", () => {
    expect(assembleStandardInput("FULL_PUBLIC").input.assessment.length).toBe(0);
    expect(assembleStandardInput("DEGRADED_NO_ASSESSMENT").input.assessment.length).toBe(0);
  });
  it("[H] SemanticAdjudications are 0 in the projected input files on disk", () => {
    const full = readJson<{ semanticAdjudications?: unknown[] }>(path.join(outDir, "CC-21-FULL-PUBLIC-INPUT.json"));
    const degraded = readJson<{ semanticAdjudications?: unknown[] }>(path.join(outDir, "CC-21-DEGRADED-NO-ASSESSMENT-INPUT.json"));
    expect((full.semanticAdjudications ?? []).length).toBe(0);
    expect((degraded.semanticAdjudications ?? []).length).toBe(0);
  });
});

describe("CC-21.I: the projected input is a valid current StandardPipelineInput", () => {
  it("buildStandardPipeline accepts a freshly computed projected input without throwing, and returns candidates", () => {
    const projection = computePerformanceBasisProjection(ledger);
    const projectedFull = applyPerformanceBasisProjection(assembleStandardInput("FULL_PUBLIC").input, projection.basisByEvidenceId);
    let result: StandardPipelineResult | undefined;
    expect(() => {
      result = buildStandardPipeline(projectedFull);
    }).not.toThrow();
    expect(result!.candidates.length).toBeGreaterThan(0);
  });
});

describe("CC-21.J: the production qualification-pipeline package is unmodified by CC-21", () => {
  it("git status --porcelain reports no changes under packages/qualification-pipeline", () => {
    const status = execSync("git status --porcelain -- packages/qualification-pipeline", { cwd: repoRoot }).toString().trim();
    expect(status).toBe("");
  });
  it("the frozen freeze records the production tree hash matching git rev-parse HEAD", () => {
    const actual = execSync("git rev-parse HEAD:packages/qualification-pipeline", { cwd: repoRoot }).toString().trim();
    expect(loadFreeze().productionQualificationPipelineTreeHash).toBe(actual);
  });
});

describe("CC-21.K: buildStandardPipeline is imported from the real production package, never reimplemented", () => {
  it("the harness imports buildStandardPipeline from @alp/qualification-pipeline", () => {
    const src = readFileSync(harnessPath, "utf-8");
    expect(src).toMatch(/import\s*\{[^}]*\bbuildStandardPipeline\b[^}]*\}\s*from\s*"@alp\/qualification-pipeline"/);
  });
  it("the harness never declares its own buildStandardPipeline function", () => {
    const src = readFileSync(harnessPath, "utf-8");
    expect(src.includes("function buildStandardPipeline")).toBe(false);
  });
});

describe("CC-21.L: the projected input is not mutated by buildStandardPipeline", () => {
  it("FULL_PUBLIC input hash before invocation equals input hash after invocation", () => {
    const f = loadFreeze();
    expect(f.FULL_PUBLIC.inputBeforeHash).toBe(f.FULL_PUBLIC.inputAfterHash);
  });
  it("DEGRADED_NO_ASSESSMENT input hash before invocation equals input hash after invocation", () => {
    const f = loadFreeze();
    expect(f.DEGRADED_NO_ASSESSMENT.inputBeforeHash).toBe(f.DEGRADED_NO_ASSESSMENT.inputAfterHash);
  });
  it("the freeze records inputMutationResult=false", () => {
    expect(loadFreeze().inputMutationResult).toBe(false);
  });
});

describe("CC-21.M: repeat output is deterministic", () => {
  it("FULL_PUBLIC first-run output hash equals its second-run output hash", () => {
    const f = loadFreeze();
    expect(f.FULL_PUBLIC.outputSha256).toBe(f.FULL_PUBLIC.secondRunOutputSha256);
  });
  it("DEGRADED_NO_ASSESSMENT first-run output hash equals its second-run output hash", () => {
    const f = loadFreeze();
    expect(f.DEGRADED_NO_ASSESSMENT.outputSha256).toBe(f.DEGRADED_NO_ASSESSMENT.secondRunOutputSha256);
  });
  it("the freeze records determinismResult=true", () => {
    expect(loadFreeze().determinismResult).toBe(true);
  });
});

describe("CC-21.N: profile input/output equality is reported mechanically, not assumed", () => {
  it("re-derives the same equality results independently", () => {
    const projection = computePerformanceBasisProjection(ledger);
    const projectedFull = applyPerformanceBasisProjection(assembleStandardInput("FULL_PUBLIC").input, projection.basisByEvidenceId);
    const projectedDegraded = applyPerformanceBasisProjection(assembleStandardInput("DEGRADED_NO_ASSESSMENT").input, projection.basisByEvidenceId);
    const inputsIdentical = JSON.stringify(projectedFull) === JSON.stringify(projectedDegraded);
    const f = loadFreeze();
    expect(f.profileInputEqualityResult).toBe(inputsIdentical);
    expect(f.FULL_PUBLIC.outputSha256 === f.DEGRADED_NO_ASSESSMENT.outputSha256).toBe(f.profileOutputEqualityResult);
  });
});

describe("CC-21.O: every result candidate appears in the candidate-by-candidate export", () => {
  it("every candidateKey from CC-21-FULL-PUBLIC-OUTPUT.json is a row in CC-21-RESULT.md", () => {
    const output = readJson<StandardPipelineResult>(path.join(outDir, "CC-21-FULL-PUBLIC-OUTPUT.json"));
    const md = readFileSync(path.join(outDir, "CC-21-RESULT.md"), "utf-8");
    expect(output.candidates.length).toBeGreaterThan(0);
    for (const c of output.candidates) {
      expect(md.includes(`| ${c.candidateKey} |`), `candidate ${c.candidateKey} missing from CC-21-RESULT.md`).toBe(true);
    }
  });
});

describe("CC-21.P: the old-vs-new diff is generated mechanically", () => {
  it("CC-21-OLD-VS-NEW-MECHANICAL-DIFF.json references real, reproducible hashes for both sides", () => {
    const diff = readJson<{ old: { sha256: string }; new: { sha256: string } }>(path.join(outDir, "CC-21-OLD-VS-NEW-MECHANICAL-DIFF.json"));
    expect(diff.old.sha256).toBe(sha256OfFile(path.join(cleanroomExecDir, "CC-19B-FULL-PUBLIC-OUTPUT.json")));
    expect(diff.new.sha256).toBe(sha256OfFile(path.join(outDir, "CC-21-FULL-PUBLIC-OUTPUT.json")));
  });

  it("never uses correctness/quality language", () => {
    const raw = readFileSync(path.join(outDir, "CC-21-OLD-VS-NEW-MECHANICAL-DIFF.json"), "utf-8").toLowerCase();
    for (const banned of ["correct", "better", "worse", "expected answer", "wrong"]) {
      expect(raw.includes(banned), `diff must not use judgement language "${banned}"`).toBe(false);
    }
  });
});

describe("CC-21.Q: no expected-answer/private Unit-202 source was accessed", () => {
  it("none of the CC-21 execution artefacts or harness source reference forbidden production/private Unit-202 material", () => {
    const forbidden = [
      "unit202-depth-performance-matrix",
      "unit202-qualification-scope-audit",
      "CC-16",
      "CC-17",
      "blind-calibration",
      "unit202-knowledge-obligations",
      "cc04-unit202",
      "unit202-source-acquisition-manifest",
      "unit202-technical-source-verification",
      "SmartScreen",
    ];
    const files = [
      "CC-21-FREEZE.json",
      "CC-21-RESULT.md",
      "CC-21-PERFORMANCE-BASIS-PROJECTION.md",
      "CC-21-OLD-VS-NEW-MECHANICAL-DIFF.json",
    ];
    for (const name of files) {
      const raw = readFileSync(path.join(outDir, name), "utf-8");
      for (const term of forbidden) expect(raw.includes(term)).toBe(false);
    }
    const harnessSrc = readFileSync(harnessPath, "utf-8");
    for (const term of forbidden) expect(harnessSrc.includes(term)).toBe(false);
  });
});

describe("CC-21: freeze/output artefact hashes reproduce", () => {
  it("every file in freeze.outputArtefactHashes hashes to its recorded SHA-256", () => {
    const f = loadFreeze();
    const entries = Object.entries(f.outputArtefactHashes);
    expect(entries.length).toBeGreaterThan(0);
    for (const [relPath, expectedHash] of entries) {
      const abs = path.join(repoRoot, relPath);
      expect(existsSync(abs)).toBe(true);
      expect(sha256OfFile(abs)).toBe(expectedHash);
    }
  });

  it("CC-21-FREEZE.json is not included in its own outputArtefactHashes", () => {
    const keys = Object.keys(loadFreeze().outputArtefactHashes);
    expect(keys.some((k) => k.endsWith("CC-21-FREEZE.json"))).toBe(false);
  });
});
