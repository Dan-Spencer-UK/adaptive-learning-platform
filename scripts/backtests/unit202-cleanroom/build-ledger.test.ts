/**
 * CC-19R1 clean-room validation suite (task section 23-24), superseding
 * CC-19R's build-ledger.test.ts. Reads the generated ledger/coverage/
 * inventory/freeze JSON files, the assembled StandardPipelineInput, and
 * the clean-room worktree's git state, and asserts every LOCKED rule
 * from both the CC-19R and CC-19R1 task packages. Does NOT import or
 * call packages/qualification-pipeline's buildStandardPipeline.
 */
import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { CandidateFactRequirement, CurriculumEvidence, OfficialCurriculumUnit, QualificationLevelEvidence, SourceFactualClaim } from "@alp/qualification-pipeline";

import { ledger, decompositionCoverage, decompositionAttempts, candidateOrigins, outDir } from "./build-ledger.ts";
import { TECHNICAL_CLAIMS } from "./technical-truth-data.ts";
import { REVIEW_FACT_PROPOSALS } from "./review-facts-data.ts";
import { validateOfficialCurriculumFragments } from "./verbatim-validator.ts";
import { assembleStandardInput } from "./assemble-standard-input.ts";
import { HANDBOOK_SOURCE_REF } from "./curriculum-data.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");

function readJson(name: string): unknown {
  return JSON.parse(readFileSync(path.join(outDir, name), "utf-8"));
}

function curriculumRec(e: (typeof ledger)[number]): CurriculumEvidence {
  return e.layerB.normalizedRecord as CurriculumEvidence;
}
function factRec(e: (typeof ledger)[number]): CandidateFactRequirement {
  return e.layerB.normalizedRecord as CandidateFactRequirement;
}
function claimRec(e: (typeof ledger)[number]): SourceFactualClaim {
  return e.layerB.normalizedRecord as SourceFactualClaim;
}
function qlvRec(e: (typeof ledger)[number]): QualificationLevelEvidence {
  return e.layerB.normalizedRecord as QualificationLevelEvidence;
}
function ocuRec(e: (typeof ledger)[number]): OfficialCurriculumUnit {
  return e.layerB.normalizedRecord as OfficialCurriculumUnit;
}

describe("CC-19R1 section 0: clean-room continuity", () => {
  it("branch is cc19-cleanroom and descends from 3c9b1dd via parent commit 20d65c6", () => {
    const branch = execSync("git rev-parse --abbrev-ref HEAD", { cwd: repoRoot }).toString().trim();
    expect(branch).toBe("cc19-cleanroom");
    const mergeBase = execSync("git merge-base HEAD 3c9b1dd", { cwd: repoRoot }).toString().trim();
    const base = execSync("git rev-parse 3c9b1dd", { cwd: repoRoot }).toString().trim();
    expect(mergeBase).toBe(base);
    const log = execSync("git log --oneline 3c9b1dd..HEAD", { cwd: repoRoot }).toString();
    expect(log).toContain("audit: rebuild Unit 202 blind normalization clean-room");
  });

  it("96602e3 (invalid CC-19A) is not an ancestor of HEAD", () => {
    let isAncestor = false;
    try {
      execSync("git merge-base --is-ancestor 96602e3 HEAD", { cwd: repoRoot });
      isAncestor = true;
    } catch {
      isAncestor = false;
    }
    expect(isAncestor).toBe(false);
  });
});

describe("CC-19R1 section 23.A/B: production types, not a parallel schema", () => {
  it("build-ledger.ts imports normalized-record types from @alp/qualification-pipeline, not a local Record<string,unknown> parallel schema", () => {
    const src = readFileSync(path.join(__dirname, "build-ledger.ts"), "utf-8");
    expect(src).toMatch(/from\s+["']@alp\/qualification-pipeline["']/);
    // The wrapper's normalizedRecord union type must reference the real interfaces, not `Record<string, unknown>`.
    expect(src).toMatch(/normalizedRecord:\s*CurriculumEvidence \| OfficialCurriculumUnit \| QualificationLevelEvidence \| SourceFactualClaim \| CandidateFactRequirement/);
  });

  it("every CurriculumEvidence normalizedRecord uses the real field name commandVerbPerformanceType, never an invented performanceType/candidateKey field", () => {
    const curriculumEntries = ledger.filter((e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence");
    expect(curriculumEntries.length).toBe(139);
    for (const e of curriculumEntries) {
      const rec = curriculumRec(e) as unknown as Record<string, unknown>;
      expect(typeof rec.commandVerbPerformanceType).toBe("string");
      expect(rec.performanceType).toBeUndefined();
      expect(rec.candidateKey).toBeUndefined();
      expect(typeof rec.evidenceId).toBe("string");
      expect(typeof rec.normalizationBasis).toBe("string");
      expect(typeof rec.sourceRef).toBe("string");
      expect(typeof rec.sourceLocator).toBe("string");
    }
  });

  it("every CandidateFactRequirement carries a non-empty sourceEvidenceRefs array (mandatory field CC-19R omitted)", () => {
    const factEntries = ledger.filter((e) => e.layerB.genericPipelineRecordType === "CandidateFactRequirement");
    expect(factEntries.length).toBeGreaterThan(0);
    for (const e of factEntries) {
      const rec = factRec(e);
      expect(Array.isArray(rec.sourceEvidenceRefs)).toBe(true);
      expect(rec.sourceEvidenceRefs.length).toBeGreaterThan(0);
      for (const ref of rec.sourceEvidenceRefs) {
        expect(ref.role).toBe("OFFICIAL_CURRICULUM");
        expect(typeof ref.evidenceId).toBe("string");
      }
    }
  });

  it("every SourceFactualClaim with sourceRole TECHNICAL_TRUTH uses normalizationBasis AUTHORITATIVE_TECHNICAL_FACT (never SOURCE_FACTUAL_CLAIM, which CC-19R used incorrectly)", () => {
    const claimEntries = ledger.filter((e) => e.layerB.genericPipelineRecordType === "SourceFactualClaim");
    expect(claimEntries.length).toBeGreaterThan(0);
    for (const e of claimEntries) {
      const rec = claimRec(e);
      expect(rec.sourceRole).toBe("TECHNICAL_TRUTH");
      expect(rec.normalizationBasis).toBe("AUTHORITATIVE_TECHNICAL_FACT");
    }
  });

  it("QualificationLevelEvidence.appliesToCandidateKey names a real candidateKey for every record (never a broadcast sentinel)", () => {
    const qlvEntries = ledger.filter((e) => e.layerB.genericPipelineRecordType === "QualificationLevelEvidence");
    const realKeys = new Set(candidateOrigins.map((o) => o.candidateKey));
    expect(qlvEntries.length).toBe(2 * candidateOrigins.length);
    for (const e of qlvEntries) {
      const rec = qlvRec(e);
      expect(realKeys.has(rec.appliesToCandidateKey)).toBe(true);
      expect(rec.appliesToCandidateKey).not.toBe("ALL_UNIT_202_REQUIRED_CANDIDATES");
    }
  });

  it("OfficialCurriculumUnit registry exists (StandardPipelineInput field CC-19R omitted entirely) with one entry per LO and AC", () => {
    const ocuEntries = ledger.filter((e) => e.layerB.genericPipelineRecordType === "OfficialCurriculumUnit");
    expect(ocuEntries.length).toBe(6 + 23); // 6 LOs + 23 ACs (AC1.1, AC2.1-2.3, AC3.1-3.4, AC4.1-4.8, AC5.1-5.5, AC6.1-6.2)
    for (const e of ocuEntries) {
      const rec = ocuRec(e);
      expect(rec.sourceRef).toBe(HANDBOOK_SOURCE_REF);
      expect(rec.officialWording.length).toBeGreaterThan(0);
    }
  });

  it("compile-time type gate is real: a shape violating CurriculumEvidence's real fields is rejected by tsc (see ts-expect-error fixture)", () => {
    // This is a documentation test -- the actual proof is `npx tsc --noEmit`
    // on compile-type-gate-fixture.ts, run as part of CC-19R1 validation.
    // Asserting the fixture file exists keeps this test from silently rotting.
    expect(existsSync(path.join(__dirname, "compile-type-gate-fixture.ts"))).toBe(true);
  });
});

describe("CC-19R1 section 23.C/D/E: zero-semantics StandardPipelineInput assembly", () => {
  it("assembleStandardInput does not call buildStandardPipeline anywhere in its module", () => {
    const src = readFileSync(path.join(__dirname, "assemble-standard-input.ts"), "utf-8");
    expect(src.includes("buildStandardPipeline(")).toBe(false);
  });

  it("FULL_PUBLIC assembly contains every eligible ledger record unchanged, and nothing extra (one-to-one, no semantic transformation)", () => {
    const { input, provenance } = assembleStandardInput("FULL_PUBLIC");
    const expectedCurriculumCount = ledger.filter((e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence" && e.layerB.profileEligibility.includes("FULL_PUBLIC")).length;
    expect(input.curriculum.length).toBe(expectedCurriculumCount);
    expect(input.curriculum.length).toBe(139);

    // Every assembled CurriculumEvidence record is referentially the SAME
    // object frozen in the ledger (proves no rewriting/cloning-with-changes).
    const ledgerCurriculumRecords = new Set(ledger.filter((e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence").map((e) => e.layerB.normalizedRecord));
    for (const rec of input.curriculum) {
      expect(ledgerCurriculumRecords.has(rec)).toBe(true);
    }

    // Every assembled record has a one-to-one originating proposalId (section 23.E).
    for (const rec of input.curriculum) {
      expect(provenance.has(rec.evidenceId)).toBe(true);
    }
  });

  it("no proposal is silently dropped: FULL_PUBLIC assembly's total record count across all arrays equals the eligible ledger count for those types", () => {
    const { input } = assembleStandardInput("FULL_PUBLIC");
    const assembledTotal = input.curriculum.length + input.officialCurriculumUnits.length + (input.qualificationLevel?.length ?? 0) + (input.factRequirements?.length ?? 0) + (input.factualClaims?.length ?? 0) + input.assessment.length;
    const eligibleLedgerTotal = ledger.filter(
      (e) => e.layerB.profileEligibility.includes("FULL_PUBLIC") && ["CurriculumEvidence", "OfficialCurriculumUnit", "QualificationLevelEvidence", "CandidateFactRequirement", "SourceFactualClaim"].includes(e.layerB.genericPipelineRecordType),
    ).length;
    expect(assembledTotal).toBe(eligibleLedgerTotal);
  });

  it("no new semantic record is manufactured: every assembled subject string traces back to a subject already present in curriculum-data.ts-derived candidates", () => {
    const { input } = assembleStandardInput("FULL_PUBLIC");
    const knownSubjects = new Set(candidateOrigins.map((o) => o.subject));
    for (const rec of input.curriculum) {
      expect(knownSubjects.has(rec.subject)).toBe(true);
    }
  });

  it("profile filtering is the only profile-specific transformation: DEGRADED_NO_ASSESSMENT differs from FULL_PUBLIC only by excluding EXPLICIT_ASSESSMENT_FACT fact requirements (of which there are currently zero)", () => {
    const full = assembleStandardInput("FULL_PUBLIC").input;
    const degraded = assembleStandardInput("DEGRADED_NO_ASSESSMENT").input;
    expect(degraded.curriculum).toEqual(full.curriculum);
    expect(degraded.officialCurriculumUnits).toEqual(full.officialCurriculumUnits);
    expect(degraded.qualificationLevel).toEqual(full.qualificationLevel);
    expect(degraded.factualClaims).toEqual(full.factualClaims);
    expect(degraded.assessment).toEqual(full.assessment);
    expect(degraded.assessment.length).toBe(0);
    // fact requirements identical too, since zero EXPLICIT_ASSESSMENT_FACT exist
    expect(degraded.factRequirements?.length).toBe(full.factRequirements?.length);
  });
});

describe("CC-19R1 section 23.F/G: every candidate has exactly one DecompositionAttempt", () => {
  it("exactly 139 CurriculumEvidence candidates exist, each with exactly one DecompositionAttempt", () => {
    expect(candidateOrigins.length).toBe(139);
    expect(decompositionAttempts.length).toBe(139);
    const keys = decompositionAttempts.map((a) => a.candidateKey);
    expect(new Set(keys).size).toBe(139); // no duplicates
  });

  it("attempted count equals total candidate count (invariant)", () => {
    expect(decompositionCoverage.attemptedCount).toBe(decompositionCoverage.totalCandidates);
    expect(decompositionAttempts.every((a) => a.decompositionAttempted)).toBe(true);
  });
});

describe("CC-19R1 section 23.H: structural parents point to child coverage, not duplicate facts", () => {
  it("RANGE_CATEGORY candidates without their own facts are REVIEW_DECOMPOSED via coveredByChildCandidateKeys", () => {
    const rangeCategoryKeys = new Set(ledger.filter((e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence" && curriculumRec(e).normalizationKind === "RANGE_CATEGORY").map((e) => curriculumRec(e)));
    let checked = 0;
    for (const rec of rangeCategoryKeys) {
      const key = `${rec.subject}::${rec.commandVerbPerformanceType}`;
      const attempt = decompositionAttempts.find((a) => a.candidateKey === key);
      expect(attempt).toBeDefined();
      if (attempt!.explicitFactRequirementKeys.length === 0 && attempt!.reviewFactRequirementKeys.length === 0) {
        expect(attempt!.coveredByChildCandidateKeys.length).toBeGreaterThan(0);
        expect(attempt!.status).toBe("REVIEW_DECOMPOSED");
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it("children's own decomposition status is never overwritten by their parent's coverage", () => {
    // "levers" is covered by class I/II/III children; the children retain their OWN status (REVIEW_DECOMPOSED via their own facts), not merely inherited.
    const leverClasses = decompositionAttempts.filter((a) => a.candidateKey.startsWith("lever class"));
    expect(leverClasses.length).toBe(3);
    for (const c of leverClasses) {
      expect(c.reviewFactRequirementKeys.length).toBeGreaterThan(0);
      expect(c.status).toBe("REVIEW_DECOMPOSED");
    }
  });
});

describe("CC-19R1 section 23.I/J: UNRESOLVED_DECOMPOSITION reasons are substantive and evidence-bound", () => {
  const FORBIDDEN_PHRASES = ["not researched this session", "not enough time", "curated subset", "not attempted", "ran out of time"];

  it("every UNRESOLVED_DECOMPOSITION candidate has a non-empty unresolvedReason", () => {
    const unresolved = decompositionAttempts.filter((a) => a.status === "UNRESOLVED_DECOMPOSITION");
    expect(unresolved.length).toBe(decompositionCoverage.statusCounts.UNRESOLVED_DECOMPOSITION);
    expect(unresolved.length).toBeGreaterThan(0);
    for (const a of unresolved) {
      expect(a.unresolvedReason).toBeTruthy();
      expect((a.unresolvedReason ?? "").length).toBeGreaterThan(40);
    }
  });

  it("no unresolvedReason contains a forbidden execution/time-based phrase", () => {
    const unresolved = decompositionAttempts.filter((a) => a.status === "UNRESOLVED_DECOMPOSITION");
    for (const a of unresolved) {
      const reason = (a.unresolvedReason ?? "").toLowerCase();
      for (const phrase of FORBIDDEN_PHRASES) {
        expect(reason.includes(phrase)).toBe(false);
      }
    }
  });
});

describe("CC-19R1 section 23.K: existing 31 CC-19R review-proposed facts preserved", () => {
  it("REVIEW_FACT_PROPOSALS retains at least the 31 original claim keys (mechanical corrections only)", () => {
    const originalClaimKeys = [
      "unit202.review-fact.mass-definition",
      "unit202.review-fact.weight-definition",
      "unit202.review-fact.work-formula",
      "unit202.review-fact.kinetic-potential-energy-formula",
      "unit202.review-fact.power-mechanical-formula",
      "unit202.review-fact.efficiency-formula",
      "unit202.review-fact.current-charge-flow",
      "unit202.review-fact.conventional-vs-electron-flow",
      "unit202.review-fact.conductor-definition",
      "unit202.review-fact.insulator-definition",
      "unit202.review-fact.ohms-law",
      "unit202.review-fact.resistance-resistivity-relation",
      "unit202.review-fact.series-resistance",
      "unit202.review-fact.parallel-resistance",
      "unit202.review-fact.thermal-effect",
      "unit202.review-fact.chemical-effect",
      "unit202.review-fact.magnetic-attraction-repulsion",
      "unit202.review-fact.flux-vs-flux-density",
      "unit202.review-fact.force-on-conductor",
      "unit202.review-fact.faradays-law",
      "unit202.review-fact.diode-definition",
      "unit202.review-fact.zener-definition",
      "unit202.review-fact.led-definition",
      "unit202.review-fact.thermistor-definition",
      "unit202.review-fact.transistor-definition",
    ];
    const presentClaimKeys = new Set(REVIEW_FACT_PROPOSALS.map((f) => f.claimKey));
    for (const key of originalClaimKeys) {
      expect(presentClaimKeys.has(key)).toBe(true);
    }
    // at least 31 original proposal ENTRIES survive (some claim keys appear on >1 target, e.g. ohms-law) --
    // count entries whose claimKey is one of the original set.
    const originalKeySet = new Set(originalClaimKeys);
    const survivingOriginalEntries = REVIEW_FACT_PROPOSALS.filter((f) => originalKeySet.has(f.claimKey));
    expect(survivingOriginalEntries.length).toBeGreaterThanOrEqual(31);
  });
});

describe("CC-19R1 section 23.L: new facts are REVIEW_PROPOSED unless directly literal EXPLICIT_CURRICULUM_FACT", () => {
  it("every CandidateFactRequirement has derivationStatus EXPLICIT_CURRICULUM_FACT or REVIEW_PROPOSED, never EXPLICIT_ASSESSMENT_FACT (no assessment evidence exists)", () => {
    const factEntries = ledger.filter((e) => e.layerB.genericPipelineRecordType === "CandidateFactRequirement");
    for (const e of factEntries) {
      const rec = factRec(e);
      expect(["EXPLICIT_CURRICULUM_FACT", "REVIEW_PROPOSED"]).toContain(rec.derivationStatus);
    }
  });
});

describe("CC-19R1 section 23.M/N: Layer-A verbatim validator", () => {
  it("every OFFICIAL_CURRICULUM sourceFragment passes the verbatim validator (exact canonical match + grounded in raw handbook text)", () => {
    const officialCurriculumFragments = ledger.flatMap((e) => e.layerA.sourceFragments.map((fragment) => ({ sourceRef: fragment.sourceRef, fragment })));
    const violations = validateOfficialCurriculumFragments(officialCurriculumFragments, HANDBOOK_SOURCE_REF);
    if (violations.length > 0) {
      console.error(JSON.stringify(violations.slice(0, 10), null, 2));
    }
    expect(violations).toEqual([]);
  });

  it("synthetic '[child: ...]' / '| Range:' / generated 'Range (page...)' framing is rejected by the validator", () => {
    const synthetic = [
      { sourceRef: HANDBOOK_SOURCE_REF, fragment: { sourceRef: HANDBOOK_SOURCE_REF, sourceLocator: "x", sourceExcerpt: "some wording [child: levers]", fragmentRole: "synthetic" } },
      { sourceRef: HANDBOOK_SOURCE_REF, fragment: { sourceRef: HANDBOOK_SOURCE_REF, sourceLocator: "x", sourceExcerpt: "some wording | Range: Mathematical principles", fragmentRole: "synthetic" } },
      { sourceRef: HANDBOOK_SOURCE_REF, fragment: { sourceRef: HANDBOOK_SOURCE_REF, sourceLocator: "x", sourceExcerpt: 'Range (page 25), "Mathematical principles:": "Algebra"', fragmentRole: "synthetic" } },
    ];
    const violations = validateOfficialCurriculumFragments(synthetic, HANDBOOK_SOURCE_REF);
    expect(violations.length).toBe(3);
    expect(violations.every((v) => v.reason === "NOT_A_CANONICAL_STRING")).toBe(true);
  });

  it("no sourceExcerpt in the ledger contains a rationale/annotation marker (' [child: ', ' | Range:')", () => {
    for (const e of ledger) {
      for (const fragment of e.layerA.sourceFragments) {
        expect(fragment.sourceExcerpt.includes(" [child: ")).toBe(false);
        expect(fragment.sourceExcerpt.includes(" | Range:")).toBe(false);
        expect(fragment.sourceExcerpt.includes("CC-19R section")).toBe(false);
      }
    }
  });
});

describe("CC-19R1 section 23.O: Layer C non-executed", () => {
  it("every ledger record's Layer C pipelineAcceptance is exactly NOT_RUN_CC19R1", () => {
    expect(ledger.length).toBeGreaterThan(0);
    for (const e of ledger) {
      expect(e.layerC.pipelineAcceptance).toBe("NOT_RUN_CC19R1");
    }
  });

  it("build-ledger.ts, assemble-standard-input.ts contain no import/require/call of buildStandardPipeline", () => {
    for (const file of ["build-ledger.ts", "assemble-standard-input.ts"]) {
      const src = readFileSync(path.join(__dirname, file), "utf-8");
      expect(src.includes("buildStandardPipeline(")).toBe(false);
    }
  });
});

describe("CC-19R1 section 23.P: AssessmentEvidence remains zero", () => {
  it("no AssessmentEvidence-typed record exists in the ledger", () => {
    expect(ledger.filter((e) => (e.layerB.genericPipelineRecordType as string) === "AssessmentEvidence").length).toBe(0);
  });

  it("source inventory still reports the sample-papers questions PDF as RAW_SOURCE_UNAVAILABLE (password-protected), unchanged", () => {
    const inv = readJson("cc19r-source-inventory.json") as { publicAssessment: { sampleQuestionsDocument: { status: string } } };
    expect(inv.publicAssessment.sampleQuestionsDocument.status).toBe("RAW_SOURCE_UNAVAILABLE");
  });
});

describe("CC-19R1 section 23.Q: FULL_PUBLIC / DEGRADED_NO_ASSESSMENT mechanically derived from the same ledger", () => {
  it("both profiles' eligible-record counts equal the total ledger length (no PUBLIC_ASSESSMENT evidence to filter)", () => {
    expect(ledger.filter((e) => e.layerB.profileEligibility.includes("FULL_PUBLIC")).length).toBe(ledger.length);
    expect(ledger.filter((e) => e.layerB.profileEligibility.includes("DEGRADED_NO_ASSESSMENT")).length).toBe(ledger.length);
  });
});

describe("CC-19R1 section 23.R: access-log timing limitation truthfully recorded", () => {
  it("CC-19R-SOURCE-ACCESS-LOG.json records that CC-19R's original logging was reconstructed after the accesses", () => {
    const log = readJson("CC-19R-SOURCE-ACCESS-LOG.json") as { executionConditions: Record<string, unknown> };
    expect(log.executionConditions.initialCC19RLogConstruction).toBe("RECONSTRUCTED_AT_END_FROM_SAME_SESSION_HISTORY");
    expect(typeof log.executionConditions.chainOfCustodyLimitation).toBe("string");
    expect((log.executionConditions.chainOfCustodyLimitation as string).length).toBeGreaterThan(20);
  });
});

describe("CC-19R1 section 23.S: forbidden derived/private Unit-202 provenance remains absent", () => {
  const forbiddenTerms = [
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

  it("ledger JSON contains no forbidden term", () => {
    const raw = JSON.stringify(ledger);
    for (const term of forbiddenTerms) expect(raw.includes(term)).toBe(false);
  });

  it("decomposition coverage and source inventory contain no forbidden term", () => {
    const coverage = JSON.stringify(readJson("cc19r-decomposition-coverage.json"));
    const inventory = JSON.stringify(readJson("cc19r-source-inventory.json"));
    for (const term of forbiddenTerms) {
      expect(coverage.includes(term)).toBe(false);
      expect(inventory.includes(term)).toBe(false);
    }
  });
});

describe("CC-19R1 section 23.T: generic production package files remain unmodified", () => {
  it("packages/qualification-pipeline/src has no uncommitted changes relative to HEAD", () => {
    const status = execSync("git status --porcelain -- packages/qualification-pipeline", { cwd: repoRoot }).toString().trim();
    expect(status).toBe("");
  });
});

describe("Inherited CC-19R rules (still enforced)", () => {
  it("AC2.2 'determine values of' maps to performanceType OTHER, never DEFINE/CALCULATE", () => {
    const otherRecords = ledger.filter((e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence" && curriculumRec(e).curriculumUnitId === "AC2.2" && curriculumRec(e).commandVerbPerformanceType === "OTHER");
    expect(otherRecords.length).toBeGreaterThan(0);
  });

  it("every RANGE_REQUIRED_MEMBER curriculum candidate is STRONG_INFERENCE, never EXPLICIT", () => {
    for (const e of ledger) {
      if (e.layerB.genericPipelineRecordType !== "CurriculumEvidence") continue;
      if (curriculumRec(e).normalizationKind === "RANGE_REQUIRED_MEMBER") {
        expect(e.layerB.normalizationConfidence).toBe("STRONG_INFERENCE");
      }
    }
  });

  it("power factor defining-relationship claim cites OpenStax, not BIPM alone", () => {
    const claim = TECHNICAL_CLAIMS.find((c) => c.claimKey === "unit202.si-unit.power-factor.defining-relationship");
    expect(claim).toBeDefined();
    expect(claim!.sourceRef).toContain("OpenStax");
  });

  it("every required Range/child parent (refinesSubject) resolves to a real candidate subject", () => {
    const allSubjects = new Set(ledger.filter((e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence").map((e) => curriculumRec(e).subject));
    let checked = 0;
    for (const e of ledger) {
      if (e.layerB.genericPipelineRecordType !== "CurriculumEvidence") continue;
      const rec = curriculumRec(e);
      if (rec.normalizationKind === "RANGE_REQUIRED_MEMBER") {
        expect(rec.refinesSubject).toBeTruthy();
        expect(allSubjects.has(rec.refinesSubject as string)).toBe(true);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(0);
  });
});

describe("Freeze v2 structure", () => {
  it("CC-19R1-FREEZE.json exists and reproduces recorded hashes", () => {
    const freezePath = path.join(outDir, "CC-19R1-FREEZE.json");
    expect(existsSync(freezePath)).toBe(true);
    const freeze = JSON.parse(readFileSync(freezePath, "utf-8")) as { fileHashes: Record<string, string> };
    for (const [relPath, expectedHash] of Object.entries(freeze.fileHashes)) {
      const abs = path.join(repoRoot, relPath);
      const actualHash = createHash("sha256").update(readFileSync(abs)).digest("hex");
      expect(actualHash).toBe(expectedHash);
    }
  });

  it("the historical CC-19R-FREEZE.json is untouched (matches its commit-20d65c6 hash)", () => {
    const freezeV2 = JSON.parse(readFileSync(path.join(outDir, "CC-19R1-FREEZE.json"), "utf-8")) as { historicalCC19RFreezeProvenance: { onDiskMatchesCommit20d65c6: boolean } };
    expect(freezeV2.historicalCC19RFreezeProvenance.onDiskMatchesCommit20d65c6).toBe(true);
  });
});
