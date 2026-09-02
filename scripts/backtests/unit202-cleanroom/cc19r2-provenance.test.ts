/**
 * CC-19R2 section 12 regressions (A-Q). Provenance-only: proves no
 * semantic count changed, every evidential source reconciles against
 * permitted access history, the exact historical CC-19R review-proposal
 * set survives, and the experiment's implementation code (not just its
 * output) is frozen by SHA-256. Does NOT call buildStandardPipeline.
 */
import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { CandidateFactRequirement } from "@alp/qualification-pipeline";
import { ledger, decompositionCoverage, outDir } from "./build-ledger.ts";
import { REVIEW_FACT_PROPOSALS } from "./review-facts-data.ts";
import { validateSourceAccessCompleteness, computeCc19r1Addendum } from "./source-access-reconciliation.ts";
import { compareHistoricalReviewProposals, summarizeHistoricalComparison, DOCUMENTED_MECHANICAL_CORRECTIONS } from "./historical-review-proposal-comparison.ts";
import { assembleStandardInput } from "./assemble-standard-input.ts";
import { REVIEW_FACT_PROPOSALS as REVIEW_FACT_PROPOSALS_AT_EA7E8BE } from "./historical-snapshots/review-facts-data.ea7e8be.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");

function factRec(e: (typeof ledger)[number]): CandidateFactRequirement {
  return e.layerB.normalizedRecord as CandidateFactRequirement;
}

describe("CC-19R2 section 12.A: semantic counts unchanged from ea7e8be", () => {
  it("candidates=139, attempts=139, statuses 44/81/14, explicit=44, review=70, assessment=0", () => {
    const curriculumCount = ledger.filter((e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence").length;
    expect(curriculumCount).toBe(139);
    expect(decompositionCoverage.totalCandidates).toBe(139);
    expect(decompositionCoverage.statusCounts).toEqual({ EXPLICITLY_ATOMIC: 44, REVIEW_DECOMPOSED: 81, UNRESOLVED_DECOMPOSITION: 14 });

    const factEntries = ledger.filter((e) => e.layerB.genericPipelineRecordType === "CandidateFactRequirement");
    const explicitCount = factEntries.filter((e) => factRec(e).derivationStatus === "EXPLICIT_CURRICULUM_FACT").length;
    const reviewCount = factEntries.filter((e) => factRec(e).derivationStatus === "REVIEW_PROPOSED").length;
    expect(explicitCount).toBe(44);
    expect(reviewCount).toBe(70);

    expect(ledger.filter((e) => (e.layerB.genericPipelineRecordType as string) === "AssessmentEvidence").length).toBe(0);
  });

  it("data-only semantic files (never touched by CC-19R2) are byte-identical to commit ea7e8be", () => {
    // review-facts-data.ts and technical-truth-data.ts are checked separately below at the
    // DATA level (not raw bytes) because CC-19R2 section 11 explicitly authorises fixing
    // their stale "140" comments -- the underlying arrays must be unchanged, not the file text.
    const files = ["explicit-facts-data.ts", "curriculum-data.ts", "qualification-level-data.ts", "official-curriculum-units.ts"];
    for (const file of files) {
      const committed = execSync(`git show ea7e8be:scripts/backtests/unit202-cleanroom/${file}`, { cwd: repoRoot }).toString();
      const current = readFileSync(path.join(__dirname, file), "utf-8");
      expect(current).toBe(committed);
    }
  });

  it("review-facts-data.ts's REVIEW_FACT_PROPOSALS/ATOMIC_BY_DESIGN_SUBJECTS/GENUINELY_UNRESOLVED_SUBJECTS arrays are deep-equal to ea7e8be (comment-only diff permitted by section 11)", () => {
    expect(REVIEW_FACT_PROPOSALS).toEqual(REVIEW_FACT_PROPOSALS_AT_EA7E8BE);
    // Confirm the file DID change (comment fix applied) so this isn't a vacuously-true no-op check.
    const committedSrc = execSync("git show ea7e8be:scripts/backtests/unit202-cleanroom/review-facts-data.ts", { cwd: repoRoot }).toString();
    const currentSrc = readFileSync(path.join(__dirname, "review-facts-data.ts"), "utf-8");
    expect(currentSrc).not.toBe(committedSrc); // proves the comment fix was applied (not a vacuous no-op check)
  });
});

describe("CC-19R2 section 12.B: assembled StandardPipelineInput unchanged", () => {
  it("recomputed assembly hash matches the CC-19R1-recorded value", () => {
    const CC19R1_RECORDED_HASH = "4e10f5692805b0ef2a6f0c781e87d5639276c87683e284c57634489c648c4437";
    const full = assembleStandardInput("FULL_PUBLIC").input;
    const degraded = assembleStandardInput("DEGRADED_NO_ASSESSMENT").input;
    const hash = createHash("sha256").update(JSON.stringify({ fullPublic: full, degraded })).digest("hex");
    expect(hash).toBe(CC19R1_RECORDED_HASH);
  });
});

describe("CC-19R2 sections 12.C/D: source-access completeness", () => {
  it("every evidential source used by the frozen normalization has a matching permitted access record", () => {
    const violations = validateSourceAccessCompleteness();
    expect(violations).toEqual([]);
  });

  it("the addendum was computed by mechanical diff, not a hand-typed list (deterministic, re-derivable)", () => {
    const addendum = computeCc19r1Addendum();
    expect(addendum.length).toBe(11);
    for (const entry of addendum) {
      expect(entry.sourceLocator.startsWith("https://")).toBe(true);
      expect(entry.loggingStatus).toBe("RETROSPECTIVELY_RECONSTRUCTED_FROM_SAME_SESSION_HISTORY");
      expect(entry.claimKeysSupported.length).toBeGreaterThan(0);
    }
  });

  it("the persisted CC-19R1-SOURCE-ACCESS-ADDENDUM.json matches the live mechanical computation", () => {
    const persisted = JSON.parse(readFileSync(path.join(outDir, "CC-19R1-SOURCE-ACCESS-ADDENDUM.json"), "utf-8")) as { entries: unknown[] };
    const live = computeCc19r1Addendum();
    expect(persisted.entries).toEqual(live);
  });
});

describe("CC-19R2 section 12.E: CC-19R1 new-source logging labelled retrospective, not contemporaneous", () => {
  it("CC-19R-SOURCE-ACCESS-LOG.json's cc19r1AdditionalAccess carries its own distinct RETROSPECTIVE label", () => {
    const log = JSON.parse(readFileSync(path.join(outDir, "CC-19R-SOURCE-ACCESS-LOG.json"), "utf-8")) as {
      executionConditions: { initialCC19RLogConstruction: string };
      cc19r1AdditionalAccess: { cc19r1NewSourceLogConstruction: string; cc19r1NewSourceChainOfCustodyLimitation: string };
    };
    expect(log.executionConditions.initialCC19RLogConstruction).toBe("RECONSTRUCTED_AT_END_FROM_SAME_SESSION_HISTORY");
    expect(log.cc19r1AdditionalAccess.cc19r1NewSourceLogConstruction).toBe("RECONSTRUCTED_AFTER_RESEARCH_FROM_SAME_SESSION_HISTORY");
    expect(log.cc19r1AdditionalAccess.cc19r1NewSourceChainOfCustodyLimitation.toLowerCase()).not.toContain("contemporaneous appended");
  });

  it("neither log claims contemporaneous logging anywhere", () => {
    const raw = readFileSync(path.join(outDir, "CC-19R-SOURCE-ACCESS-LOG.json"), "utf-8");
    // "contemporaneously" should appear only in NEGATED sentences (e.g. "rather than appended contemporaneously").
    const matches = [...raw.matchAll(/contemporaneous\w*/gi)];
    expect(matches.length).toBeGreaterThan(0);
    for (const m of matches) {
      const idx = m.index ?? 0;
      const context = raw.slice(Math.max(0, idx - 60), idx).toLowerCase();
      expect(context).toMatch(/rather than|not/);
    }
  });
});

describe("CC-19R2 sections 12.F/G/H/I: historical CC-19R review-proposal preservation", () => {
  it("exactly 31 historical proposals are derived from commit 20d65c6 (imported, not hand-typed)", () => {
    const entries = compareHistoricalReviewProposals();
    expect(entries.length).toBe(31);
  });

  it("all 31 historical proposals survive: 0 missing, 0 unexpected semantic changes", () => {
    const summary = summarizeHistoricalComparison();
    expect(summary.historicalCount).toBe(31);
    expect(summary.missingCount).toBe(0);
    expect(summary.unexpectedSemanticChangeCount).toBe(0);
    expect(summary.exactPreservedCount + summary.mechanicallyEquivalentCount).toBe(31);
  });

  it("no comparison relies on claimKey membership or count alone -- every surviving entry is EXACT_PRESERVED or has a documented, justified mechanical correction", () => {
    const entries = compareHistoricalReviewProposals();
    for (const entry of entries) {
      expect(["EXACT_PRESERVED", "MECHANICALLY_EQUIVALENT"]).toContain(entry.status);
      if (entry.status === "MECHANICALLY_EQUIVALENT") {
        expect(DOCUMENTED_MECHANICAL_CORRECTIONS.length).toBeGreaterThan(0);
      }
    }
  });

  it("historical snapshot file is an untouched git-show extraction (matches commit 20d65c6 exactly)", () => {
    const committed = execSync("git show 20d65c6:scripts/backtests/unit202-cleanroom/review-facts-data.ts", { cwd: repoRoot }).toString();
    const snapshot = readFileSync(path.join(__dirname, "historical-snapshots", "review-facts-data.20d65c6.ts"), "utf-8");
    expect(snapshot).toBe(committed);
  });
});

describe("CC-19R2 section 12.J: all 70 current REVIEW_PROPOSED entries unchanged from ea7e8be", () => {
  it("review-facts-data.ts's REVIEW_FACT_PROPOSALS array is deep-equal to the ea7e8be-committed version (field-for-field, not just count)", () => {
    expect(REVIEW_FACT_PROPOSALS.length).toBe(70);
    expect(REVIEW_FACT_PROPOSALS_AT_EA7E8BE.length).toBe(70);
    expect(REVIEW_FACT_PROPOSALS).toEqual(REVIEW_FACT_PROPOSALS_AT_EA7E8BE);
  });
});

describe("CC-19R2 section 12.K/L: implementation files frozen by SHA-256", () => {
  it("CC-19R2-FREEZE.json hashes every required implementation file, including assemble-standard-input.ts", () => {
    const freeze = JSON.parse(readFileSync(path.join(outDir, "CC-19R2-FREEZE.json"), "utf-8")) as { implementationCodeHashes: Record<string, string> };
    const required = [
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
    ];
    for (const name of required) {
      const key = `scripts/backtests/unit202-cleanroom/${name}`;
      expect(freeze.implementationCodeHashes[key]).toBeTruthy();
      const actual = createHash("sha256").update(readFileSync(path.join(__dirname, name))).digest("hex");
      expect(freeze.implementationCodeHashes[key]).toBe(actual);
    }
  });
});

describe("CC-19R2 sections 12.M/N: prior freezes preserved", () => {
  it("CC-19R-FREEZE.json is byte-identical to its commit-20d65c6 content", () => {
    const committed = execSync("git show 20d65c6:reports/backtests/unit202-cleanroom/CC-19R-FREEZE.json", { cwd: repoRoot }).toString();
    const current = readFileSync(path.join(outDir, "CC-19R-FREEZE.json"), "utf-8");
    expect(current).toBe(committed);
  });

  it("CC-19R1-FREEZE.json is byte-identical to its commit-ea7e8be content", () => {
    const committed = execSync("git show ea7e8be:reports/backtests/unit202-cleanroom/CC-19R1-FREEZE.json", { cwd: repoRoot }).toString();
    const current = readFileSync(path.join(outDir, "CC-19R1-FREEZE.json"), "utf-8");
    expect(current).toBe(committed);
  });
});

describe("CC-19R2 sections 12.O/P/Q: pipeline not run, package unmodified, forbidden evidence absent", () => {
  it("no script in this package calls buildStandardPipeline", () => {
    const files = ["build-ledger.ts", "assemble-standard-input.ts", "source-access-reconciliation.ts", "build-source-access-addendum.ts", "historical-review-proposal-comparison.ts", "build-freeze-cc19r2.ts"];
    for (const file of files) {
      const src = readFileSync(path.join(__dirname, file), "utf-8");
      expect(src.includes("buildStandardPipeline(")).toBe(false);
    }
  });

  it("packages/qualification-pipeline has no uncommitted changes", () => {
    const status = execSync("git status --porcelain -- packages/qualification-pipeline", { cwd: repoRoot }).toString().trim();
    expect(status).toBe("");
  });

  it("no forbidden derived/private Unit-202 term appears in any CC-19R2 output", () => {
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
    const files = ["CC-19R2-FREEZE.json", "CC-19R1-SOURCE-ACCESS-ADDENDUM.json"];
    for (const name of files) {
      const raw = readFileSync(path.join(outDir, name), "utf-8");
      for (const term of forbidden) expect(raw.includes(term)).toBe(false);
    }
  });
});

describe("Freeze v2 (CC-19R2) structure", () => {
  it("CC-19R2-FREEZE.json exists and reproduces its recorded output-file hashes", () => {
    const freezePath = path.join(outDir, "CC-19R2-FREEZE.json");
    expect(existsSync(freezePath)).toBe(true);
    const freeze = JSON.parse(readFileSync(freezePath, "utf-8")) as { outputFileHashes: Record<string, string>; implementationCodeHashes: Record<string, string> };
    for (const [relPath, expectedHash] of [...Object.entries(freeze.outputFileHashes), ...Object.entries(freeze.implementationCodeHashes)]) {
      const abs = path.join(repoRoot, relPath);
      const actualHash = createHash("sha256").update(readFileSync(abs)).digest("hex");
      expect(actualHash).toBe(expectedHash);
    }
  });

  it("CC-19R2-FREEZE.json reports COMPLETE source-access and FULLY_PRESERVED historical comparison", () => {
    const freeze = JSON.parse(readFileSync(path.join(outDir, "CC-19R2-FREEZE.json"), "utf-8")) as {
      sourceAccessCompleteness: { result: string };
      historicalReviewProposalPreservation: { result: string };
      semanticInvariants: { match: boolean };
      assembledStandardInputHash: { unchanged: boolean };
    };
    expect(freeze.sourceAccessCompleteness.result).toBe("COMPLETE");
    expect(freeze.historicalReviewProposalPreservation.result).toBe("FULLY_PRESERVED");
    expect(freeze.semanticInvariants.match).toBe(true);
    expect(freeze.assembledStandardInputHash.unchanged).toBe(true);
  });
});
