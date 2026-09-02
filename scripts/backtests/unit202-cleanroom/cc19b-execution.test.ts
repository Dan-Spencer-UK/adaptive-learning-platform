/**
 * CC-19B section 15 (A-N): proves the frozen execution artefacts under
 * reports/backtests/unit202-cleanroom/pipeline-execution/ genuinely reflect
 * a real, unmodified, deterministic, non-mutating invocation of the
 * production `buildStandardPipeline` against the accepted CC-19R2 frozen
 * Unit-202 clean-room input -- and reports mechanical facts only, never a
 * semantic judgement about curriculum correctness.
 */
import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { assembleStandardInput } from "./assemble-standard-input.ts";
import { validateSourceAccessCompleteness } from "./source-access-reconciliation.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const outDir = path.join(repoRoot, "reports", "backtests", "unit202-cleanroom");
const execOutDir = path.join(outDir, "pipeline-execution");
const harnessPath = path.join(__dirname, "execute-frozen-pipeline.ts");

const ACCEPTED_COMBINED_INPUT_HASH = "4e10f5692805b0ef2a6f0c781e87d5639276c87683e284c57634489c648c4437";

function readJson<T>(absPath: string): T {
  return JSON.parse(readFileSync(absPath, "utf-8")) as T;
}
function sha256OfFile(absPath: string): string {
  return createHash("sha256").update(readFileSync(absPath)).digest("hex");
}

interface Freeze {
  readonly lineage: readonly string[];
  readonly acceptedCc19r2FreezeHash: string;
  readonly productionQualificationPipelineTreeHash: string;
  readonly executionHarnessSha256: string;
  readonly FULL_PUBLIC: { inputSha256: string; outputSha256: string; secondRunOutputSha256: string; inputBeforeHash: string; inputAfterHash: string };
  readonly DEGRADED_NO_ASSESSMENT: { inputSha256: string; outputSha256: string; secondRunOutputSha256: string; inputBeforeHash: string; inputAfterHash: string };
  readonly profileInputEqualityResult: boolean;
  readonly profileOutputEqualityResult: boolean;
  readonly determinismResult: boolean;
  readonly semanticInputInvariants: { curriculumEvidenceCandidates: number; assessmentEvidence: number };
  readonly readOnlyProvenancePreflightResult: { publicAssessmentAttemptTrace: string; sourceIdentityAccessTrace: string };
  readonly outputArtefactHashes: Readonly<Record<string, string>>;
}

function loadFreeze(): Freeze {
  return readJson<Freeze>(path.join(execOutDir, "CC-19B-FREEZE.json"));
}

describe("CC-19B.A: HEAD lineage contains the accepted clean-room freeze commit 54a9ebb", () => {
  it("54a9ebb is an ancestor of (or equal to) HEAD", () => {
    let isAncestor = true;
    try {
      execSync("git merge-base --is-ancestor 54a9ebb HEAD", { cwd: repoRoot, stdio: "pipe" });
    } catch {
      isAncestor = false;
    }
    expect(isAncestor).toBe(true);
  });
});

describe("CC-19B.B: accepted assembled-input hash unchanged", () => {
  it("recomputed combined FULL_PUBLIC+DEGRADED hash matches the accepted CC-19R2 value", () => {
    const full = assembleStandardInput("FULL_PUBLIC").input;
    const degraded = assembleStandardInput("DEGRADED_NO_ASSESSMENT").input;
    const hash = createHash("sha256").update(JSON.stringify({ fullPublic: full, degraded })).digest("hex");
    expect(hash).toBe(ACCEPTED_COMBINED_INPUT_HASH);
  });
});

describe("CC-19B.C: semantic invariants unchanged (139 / 44+81+14 / 44+70 / 0)", () => {
  it("curriculum, decomposition, fact-requirement, and assessment counts match the accepted values", async () => {
    const { ledger, decompositionCoverage } = await import("./build-ledger.ts");
    expect(ledger.filter((e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence").length).toBe(139);
    expect(decompositionCoverage.statusCounts).toEqual({ EXPLICITLY_ATOMIC: 44, REVIEW_DECOMPOSED: 81, UNRESOLVED_DECOMPOSITION: 14 });
    const factEntries = ledger.filter((e) => e.layerB.genericPipelineRecordType === "CandidateFactRequirement");
    const explicit = factEntries.filter((e) => (e.layerB.normalizedRecord as { derivationStatus: string }).derivationStatus === "EXPLICIT_CURRICULUM_FACT").length;
    const review = factEntries.filter((e) => (e.layerB.normalizedRecord as { derivationStatus: string }).derivationStatus === "REVIEW_PROPOSED").length;
    expect(explicit).toBe(44);
    expect(review).toBe(70);
    const full = assembleStandardInput("FULL_PUBLIC").input;
    expect(full.assessment.length).toBe(0);
  });
});

describe("CC-19B.D: public-assessment attempt provenance preflight", () => {
  it("both City & Guilds sample-assessment artefacts have a truthful, permitted attempt record, and AssessmentEvidence is 0", () => {
    const log = readJson<{ evidentialAccessLog: readonly { locator: string; permitted: boolean }[] }>(path.join(outDir, "CC-19R-SOURCE-ACCESS-LOG.json"));
    const sampleQuestions = log.evidentialAccessLog.find((e) => e.locator.includes("5357-2365_sample_papers_v1-2.pdf") || e.locator.includes("5357-and-2365-sample-papers-v1-2"));
    const markScheme = log.evidentialAccessLog.find((e) => e.locator.includes("5357-2365_sample_papers_markschemes_v1-0.pdf") || e.locator.includes("mark-schemes-v1-0"));
    expect(sampleQuestions?.permitted).toBe(true);
    expect(markScheme?.permitted).toBe(true);
    const full = assembleStandardInput("FULL_PUBLIC").input;
    expect(full.assessment.length).toBe(0);
  });

  it("the frozen manifest records this preflight as PASS", () => {
    expect(loadFreeze().readOnlyProvenancePreflightResult.publicAssessmentAttemptTrace).toBe("PASS");
  });
});

describe("CC-19B.E: source-identity access preflight", () => {
  it("zero unmatched source identities between assembled SourceFactualClaims and the permitted access history", () => {
    expect(validateSourceAccessCompleteness()).toEqual([]);
  });

  it("the frozen manifest records this preflight as PASS", () => {
    expect(loadFreeze().readOnlyProvenancePreflightResult.sourceIdentityAccessTrace).toBe("PASS");
  });
});

describe("CC-19B.F: production qualification-pipeline package is unmodified", () => {
  it("git status --porcelain reports no changes under packages/qualification-pipeline", () => {
    const status = execSync("git status --porcelain -- packages/qualification-pipeline", { cwd: repoRoot }).toString().trim();
    expect(status).toBe("");
  });
});

describe("CC-19B.G: production package tree hash is recorded and matches HEAD", () => {
  it("freeze.productionQualificationPipelineTreeHash equals git rev-parse HEAD:packages/qualification-pipeline", () => {
    const actual = execSync("git rev-parse HEAD:packages/qualification-pipeline", { cwd: repoRoot }).toString().trim();
    expect(loadFreeze().productionQualificationPipelineTreeHash).toBe(actual);
  });
});

describe("CC-19B.H: buildStandardPipeline is imported from the real production package, never reimplemented", () => {
  it("the harness imports buildStandardPipeline from @alp/qualification-pipeline", () => {
    const src = readFileSync(harnessPath, "utf-8");
    expect(src).toMatch(/import\s*\{[^}]*\bbuildStandardPipeline\b[^}]*\}\s*from\s*"@alp\/qualification-pipeline"/);
  });

  it("the harness never declares its own buildStandardPipeline function", () => {
    const src = readFileSync(harnessPath, "utf-8");
    expect(src.includes("function buildStandardPipeline")).toBe(false);
  });
});

describe("CC-19B.I: first-run input is not mutated by buildStandardPipeline", () => {
  it("FULL_PUBLIC input hash before invocation equals input hash after invocation", () => {
    const f = loadFreeze();
    expect(f.FULL_PUBLIC.inputBeforeHash).toBe(f.FULL_PUBLIC.inputAfterHash);
  });
  it("DEGRADED_NO_ASSESSMENT input hash before invocation equals input hash after invocation", () => {
    const f = loadFreeze();
    expect(f.DEGRADED_NO_ASSESSMENT.inputBeforeHash).toBe(f.DEGRADED_NO_ASSESSMENT.inputAfterHash);
  });
});

describe("CC-19B.J: first and repeat result hashes are identical (determinism)", () => {
  it("FULL_PUBLIC first-run output hash equals its second-run output hash", () => {
    const f = loadFreeze();
    expect(f.FULL_PUBLIC.outputSha256).toBe(f.FULL_PUBLIC.secondRunOutputSha256);
  });
  it("DEGRADED_NO_ASSESSMENT first-run output hash equals its second-run output hash", () => {
    const f = loadFreeze();
    expect(f.DEGRADED_NO_ASSESSMENT.outputSha256).toBe(f.DEGRADED_NO_ASSESSMENT.secondRunOutputSha256);
  });
  it("the freeze records an overall determinism result of true", () => {
    expect(loadFreeze().determinismResult).toBe(true);
  });
});

describe("CC-19B.K: FULL_PUBLIC / DEGRADED_NO_ASSESSMENT profile equality is reported mechanically, not assumed", () => {
  it("freeze reports boolean profileInputEqualityResult / profileOutputEqualityResult, mechanically re-derivable", () => {
    const f = loadFreeze();
    expect(typeof f.profileInputEqualityResult).toBe("boolean");
    expect(typeof f.profileOutputEqualityResult).toBe("boolean");
    const full = assembleStandardInput("FULL_PUBLIC").input;
    const degraded = assembleStandardInput("DEGRADED_NO_ASSESSMENT").input;
    // AssessmentEvidence is 0 this run, so DEGRADED_NO_ASSESSMENT's profile filter removes nothing -- re-derived, not hardcoded.
    expect(JSON.stringify(full) === JSON.stringify(degraded)).toBe(f.profileInputEqualityResult);
    expect(f.FULL_PUBLIC.outputSha256 === f.DEGRADED_NO_ASSESSMENT.outputSha256).toBe(f.profileOutputEqualityResult);
  });
});

describe("CC-19B.L: every execution artefact hash reproduces", () => {
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

  it("CC-19B-FREEZE.json itself is not included in its own outputArtefactHashes (cannot self-hash before being written -- mirrors CC-19R2-FREEZE.json)", () => {
    const f = loadFreeze();
    const keys = Object.keys(f.outputArtefactHashes);
    expect(keys.some((k) => k.endsWith("CC-19B-FREEZE.json"))).toBe(false);
  });
});

describe("CC-19B.M: CC-19R2-FREEZE.json remains byte-identical to commit 54a9ebb", () => {
  it("no CC-19B activity altered the CC-19R2 freeze artefact", () => {
    const committed = execSync("git show 54a9ebb:reports/backtests/unit202-cleanroom/CC-19R2-FREEZE.json", { cwd: repoRoot }).toString();
    const current = readFileSync(path.join(outDir, "CC-19R2-FREEZE.json"), "utf-8");
    expect(current).toBe(committed);
  });
});

describe("CC-19B.N: no forbidden/private/derived expected-answer source was accessed", () => {
  it("none of the CC-19B execution artefacts reference forbidden production/private Unit-202 material", () => {
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
    const files = ["CC-19B-EXECUTION-MANIFEST.json", "CC-19B-FREEZE.json", "CC-19B-PIPELINE-RESULT.md"];
    for (const name of files) {
      const raw = readFileSync(path.join(execOutDir, name), "utf-8");
      for (const term of forbidden) expect(raw.includes(term)).toBe(false);
    }
    const harnessSrc = readFileSync(harnessPath, "utf-8");
    for (const term of forbidden) expect(harnessSrc.includes(term)).toBe(false);
  });
});

describe("CC-19B: freeze structure sanity", () => {
  it("lineage matches 3c9b1dd -> 20d65c6 -> ea7e8be -> 54a9ebb", () => {
    expect(loadFreeze().lineage).toEqual(["3c9b1dd", "20d65c6", "ea7e8be", "54a9ebb"]);
  });
  it("accepted CC-19R2 freeze hash matches the accepted combined input hash", () => {
    expect(loadFreeze().acceptedCc19r2FreezeHash).toBe(ACCEPTED_COMBINED_INPUT_HASH);
  });
  it("semanticInputInvariants recorded in the freeze match the accepted values", () => {
    const f = loadFreeze();
    expect(f.semanticInputInvariants.curriculumEvidenceCandidates).toBe(139);
    expect(f.semanticInputInvariants.assessmentEvidence).toBe(0);
  });
});
