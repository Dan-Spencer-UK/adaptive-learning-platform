/**
 * CC-19R clean-room validation suite (task section 34).
 *
 * Reads the generated ledger/coverage/inventory JSON files and the
 * clean-room worktree's git state, and asserts the LOCKED rules from the
 * CC-19R task package. Does NOT import or call
 * packages/qualification-pipeline's buildStandardPipeline.
 */
import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ledger, decompositionCoverage, outDir } from "./build-ledger.ts";
import { TECHNICAL_CLAIMS } from "./technical-truth-data.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");

function readJson(name: string): unknown {
  return JSON.parse(readFileSync(path.join(outDir, name), "utf-8"));
}

describe("CC-19R section 34.1: clean-room base commit", () => {
  it("worktree HEAD's parent history includes exactly 3c9b1dd as the branch point ancestor set is untouched by CC-19A", () => {
    // The worktree was created via `git worktree add -b cc19-cleanroom <path> 3c9b1dd`;
    // verify that commit exists and that 96602e3 (the invalid CC-19A freeze commit) is
    // NOT an ancestor of HEAD on this branch (i.e. this branch never merged it in).
    const mergeBase = execSync("git merge-base HEAD 96602e3", { cwd: repoRoot }).toString().trim();
    const base3c9b1dd = execSync("git rev-parse 3c9b1dd", { cwd: repoRoot }).toString().trim();
    // merge-base of HEAD and the CC-19A commit must be 3c9b1dd itself (their common
    // ancestor), proving this branch diverged AT 3c9b1dd and never incorporated 96602e3.
    expect(mergeBase).toBe(base3c9b1dd);
  });
});

describe("CC-19R section 34.2: no forbidden Unit-202 derived/private evidence", () => {
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
    for (const term of forbiddenTerms) {
      expect(raw.includes(term)).toBe(false);
    }
  });

  it("source inventory contains no forbidden term", () => {
    const raw = JSON.stringify(readJson("cc19r-source-inventory.json"));
    for (const term of forbiddenTerms) {
      expect(raw.includes(term)).toBe(false);
    }
  });
});

describe("CC-19R section 34.3/34.4: public source discovery", () => {
  it("source inventory cites the official Level 2 landing page and current Sample Papers v1-2 link", () => {
    const inv = readJson("cc19r-source-inventory.json") as { publicAssessment: { landingPageUrl: string; sampleQuestionsDocument: { url: string; status: string } } };
    expect(inv.publicAssessment.landingPageUrl).toContain("2365-electrotechnical-craft");
    expect(inv.publicAssessment.sampleQuestionsDocument.url).toContain("5357-and-2365-sample-papers-v1-2-pdf.pdf");
  });

  it("sample papers v1-2 is honestly reported as RAW_SOURCE_UNAVAILABLE (password-protected), not fabricated as read", () => {
    const inv = readJson("cc19r-source-inventory.json") as { publicAssessment: { sampleQuestionsDocument: { status: string } } };
    expect(inv.publicAssessment.sampleQuestionsDocument.status).toBe("RAW_SOURCE_UNAVAILABLE");
  });
});

describe("CC-19R section 34.5: assessment items reconcile completely", () => {
  it("zero AssessmentEvidence-typed records exist in the ledger (no usable question-stem content was ever available)", () => {
    const assessmentRecords = ledger.filter((e) => e.layerB.genericPipelineRecordType === "AssessmentEvidence");
    expect(assessmentRecords.length).toBe(0);
  });
});

describe("CC-19R section 34.6: current Ofqual Level 2 evidence included", () => {
  it("ledger contains exactly two QualificationLevelEvidence records (knowledge + skills descriptor)", () => {
    const qlv = ledger.filter((e) => e.layerB.genericPipelineRecordType === "QualificationLevelEvidence");
    expect(qlv.length).toBe(2);
    for (const e of qlv) {
      expect(e.layerA.sourceRef).toContain("Ofqual");
    }
  });
});

describe("CC-19R section 34.7: Layer-A excerpts contain source wording, not rationale", () => {
  it("no sourceExcerpt contains the literal string 'CC-19R section' (a rationale marker)", () => {
    for (const e of ledger) {
      expect(e.layerA.sourceExcerpt.includes("CC-19R section")).toBe(false);
    }
  });

  it("no sourceExcerpt contains the word 'necessityRationale' or 'normalizationRationale'", () => {
    for (const e of ledger) {
      expect(e.layerA.sourceExcerpt).not.toMatch(/necessityRationale|normalizationRationale/i);
    }
  });
});

describe("CC-19R section 34.8: inferred command mappings are never labelled EXPLICIT", () => {
  it("every STRONG_INFERENCE-worthy rawCommandWording ('use', 'specify what is meant by', 'determine values of') is never EXPLICIT", () => {
    const paraphraseVerbs = ["use", "specify what is meant by", "determine values of"];
    for (const e of ledger) {
      if (e.layerA.rawCommandWording && paraphraseVerbs.includes(e.layerA.rawCommandWording)) {
        expect(e.layerB.normalizationConfidence).not.toBe("EXPLICIT");
      }
    }
  });

  it("every RANGE_REQUIRED_MEMBER curriculum candidate is STRONG_INFERENCE, never EXPLICIT (section 12)", () => {
    for (const e of ledger) {
      if (e.layerB.genericPipelineRecordType !== "CurriculumEvidence") continue;
      const rec = e.layerB.normalizedRecord as { normalizationKind: string };
      if (rec.normalizationKind === "RANGE_REQUIRED_MEMBER") {
        expect(e.layerB.normalizationConfidence).toBe("STRONG_INFERENCE");
      }
    }
  });
});

describe("CC-19R section 34.9: AC2.2 DETERMINE is not normalized to DEFINE", () => {
  it("'determine values of' maps to performanceType OTHER, never DEFINE or CALCULATE", () => {
    const records = ledger.filter((e) => e.layerA.rawCommandWording === "determine values of");
    expect(records.length).toBeGreaterThan(0);
    for (const e of records) {
      const rec = e.layerB.normalizedRecord as { performanceType?: string };
      expect(rec.performanceType).toBe("OTHER");
    }
  });
});

describe("CC-19R section 34.10: every required Range/child parent resolves", () => {
  it("every RANGE_REQUIRED_MEMBER.refinesSubject matches a real candidate subject in the ledger", () => {
    const allSubjects = new Set(
      ledger.filter((e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence").map((e) => (e.layerB.normalizedRecord as { subject: string }).subject),
    );
    let checked = 0;
    for (const e of ledger) {
      if (e.layerB.genericPipelineRecordType !== "CurriculumEvidence") continue;
      const rec = e.layerB.normalizedRecord as { normalizationKind: string; refinesSubject?: string };
      if (rec.normalizationKind === "RANGE_REQUIRED_MEMBER") {
        expect(rec.refinesSubject).toBeTruthy();
        expect(allSubjects.has(rec.refinesSubject as string)).toBe(true);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(0);
  });
});

describe("CC-19R section 34.11: AC3.2 explicit levers/gears/pulleys and lever-class parentage", () => {
  it("levers, gears, and pulleys each exist as their own required candidate under AC3.2", () => {
    const ac32Curriculum = ledger.filter(
      (e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence" && (e.layerB.normalizedRecord as { curriculumUnitId: string }).curriculumUnitId === "AC3.2",
    );
    const subjects = new Set(ac32Curriculum.map((e) => (e.layerB.normalizedRecord as { subject: string }).subject));
    expect(subjects.has("levers")).toBe(true);
    expect(subjects.has("gears")).toBe(true);
    expect(subjects.has("pulleys")).toBe(true);
  });

  it("lever class I/II/III members refine 'levers' directly, with no orphan 'lever-classes' parent", () => {
    const classMembers = ledger.filter(
      (e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence" && (e.layerB.normalizedRecord as { subject: string }).subject.startsWith("lever class"),
    );
    expect(classMembers.length).toBeGreaterThan(0);
    for (const e of classMembers) {
      expect((e.layerB.normalizedRecord as { refinesSubject?: string }).refinesSubject).toBe("levers");
    }
    const orphanParent = ledger.some((e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence" && (e.layerB.normalizedRecord as { subject: string }).subject === "lever classes");
    expect(orphanParent).toBe(false);
  });
});

describe("CC-19R section 34.12: power factor is not inferred from BIPM alone", () => {
  it("the power-factor defining-relationship claim cites OpenStax, not BIPM", () => {
    const claim = TECHNICAL_CLAIMS.find((c) => c.claimKey === "unit202.si-unit.power-factor.defining-relationship");
    expect(claim).toBeDefined();
    expect(claim!.sourceRef).toContain("OpenStax");
    expect(claim!.sourceRef).not.toContain("BIPM");
  });

  it("a separate BIPM claim exists only for the generic unit-one convention, and its rationale states it is used only in support", () => {
    const bipmClaimEntry = ledger.find(
      (e) => e.layerB.genericPipelineRecordType === "SourceFactualClaim" && (e.layerB.normalizedRecord as { claimKey: string }).claimKey === "unit202.si-unit.power-factor.dimensionless-convention",
    );
    expect(bipmClaimEntry).toBeDefined();
    expect(bipmClaimEntry!.layerA.sourceRef).toContain("BIPM");
    expect(bipmClaimEntry!.layerB.normalizationRationale).toMatch(/AFTER|already establishes|never used alone/i);
  });
});

describe("CC-19R section 34.13: every broad required candidate has an explicit decomposition status", () => {
  it("every curriculum candidate row in the coverage report has a decompositionStatus", () => {
    for (const acRow of decompositionCoverage.byAc) {
      for (const c of acRow.candidates) {
        expect(["EXPLICITLY_ATOMIC", "REVIEW_DECOMPOSED", "UNRESOLVED_DECOMPOSITION"]).toContain(c.decompositionStatus);
      }
    }
  });

  it("total candidates in coverage report equals total CurriculumEvidence records in the ledger", () => {
    const curriculumCount = ledger.filter((e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence").length;
    expect(decompositionCoverage.totalCandidates).toBe(curriculumCount);
  });
});

describe("CC-19R section 34.14: technical sources cannot create scope", () => {
  it("no SourceFactualClaim-typed record carries normalizationKind, disposition, or any scope-creating field", () => {
    for (const e of ledger) {
      if (e.layerB.genericPipelineRecordType !== "SourceFactualClaim") continue;
      const rec = e.layerB.normalizedRecord as Record<string, unknown>;
      expect(rec.normalizationKind).toBeUndefined();
      expect(rec.disposition).toBeUndefined();
      expect(rec.sourceRole).toBe("TECHNICAL_TRUTH");
    }
  });

  it("no CandidateFactRequirement uses AUTHORITATIVE_TECHNICAL_FACT as its normalizationBasis (must be FACT_REQUIREMENT_DERIVATION)", () => {
    for (const e of ledger) {
      if (e.layerB.genericPipelineRecordType !== "CandidateFactRequirement") continue;
      const rec = e.layerB.normalizedRecord as { normalizationBasis: string };
      expect(rec.normalizationBasis).toBe("FACT_REQUIREMENT_DERIVATION");
    }
  });
});

describe("CC-19R section 34.15: REVIEW_PROPOSED facts do not auto-govern", () => {
  it("every REVIEW_PROPOSED CandidateFactRequirement's normalizationConfidence is REVIEW_PROPOSED (never EXPLICIT)", () => {
    const reviewFacts = ledger.filter(
      (e) => e.layerB.genericPipelineRecordType === "CandidateFactRequirement" && (e.layerB.normalizedRecord as { derivationStatus: string }).derivationStatus === "REVIEW_PROPOSED",
    );
    expect(reviewFacts.length).toBeGreaterThan(0);
    for (const e of reviewFacts) {
      expect(e.layerB.normalizationConfidence).toBe("REVIEW_PROPOSED");
    }
  });

  it("every EXPLICIT_CURRICULUM_FACT CandidateFactRequirement cites validated OFFICIAL_CURRICULUM evidence in Layer A", () => {
    const explicitFacts = ledger.filter(
      (e) => e.layerB.genericPipelineRecordType === "CandidateFactRequirement" && (e.layerB.normalizedRecord as { derivationStatus: string }).derivationStatus === "EXPLICIT_CURRICULUM_FACT",
    );
    expect(explicitFacts.length).toBeGreaterThan(0);
    for (const e of explicitFacts) {
      expect(e.layerA.sourceRole).toBe("OFFICIAL_CURRICULUM");
    }
  });
});

describe("CC-19R section 34.16: degraded profile is mechanically filtered", () => {
  it("FULL_PUBLIC and DEGRADED_NO_ASSESSMENT profile sets are identical (no PUBLIC_ASSESSMENT evidence was ever normalized)", () => {
    const fullPublic = ledger.filter((e) => e.layerB.profileEligibility.includes("FULL_PUBLIC"));
    const degraded = ledger.filter((e) => e.layerB.profileEligibility.includes("DEGRADED_NO_ASSESSMENT"));
    expect(fullPublic.length).toBe(ledger.length);
    expect(degraded.length).toBe(ledger.length);
  });

  it("zero records carry role/sourceRole PUBLIC_ASSESSMENT", () => {
    const assessmentSourced = ledger.filter((e) => e.layerA.sourceRole === "PUBLIC_ASSESSMENT");
    expect(assessmentSourced.length).toBe(0);
  });
});

describe("CC-19R section 34.17: buildStandardPipeline was not executed", () => {
  it("every ledger record's Layer C pipelineAcceptance is exactly NOT_RUN_CC19R", () => {
    expect(ledger.length).toBeGreaterThan(0);
    for (const e of ledger) {
      expect(e.layerC.pipelineAcceptance).toBe("NOT_RUN_CC19R");
    }
  });

  it("build-ledger.ts contains no import/require statement referencing packages/qualification-pipeline (prose mentions of the package name in comments are fine)", () => {
    const builderFile = readFileSync(path.join(__dirname, "build-ledger.ts"), "utf-8");
    const importOrRequirePattern = /(?:from\s+["'][^"']*qualification-pipeline[^"']*["']|require\(\s*["'][^"']*qualification-pipeline[^"']*["']\s*\)|import\(\s*["'][^"']*qualification-pipeline[^"']*["']\s*\))/;
    expect(importOrRequirePattern.test(builderFile)).toBe(false);
  });
});

describe("CC-19R section 9 regression: prerequisite/dependency-style records never smuggle reasoning into Layer A", () => {
  it("CandidateFactRequirement Layer-A excerpts are curriculum wording only, never a formula or equation", () => {
    const factRecords = ledger.filter((e) => e.layerB.genericPipelineRecordType === "CandidateFactRequirement");
    expect(factRecords.length).toBeGreaterThan(0);
    for (const e of factRecords) {
      // Layer A excerpt must equal the cited AC's raw wording -- never contain a "=" sign,
      // which would indicate a formula (a calculated implication) leaking into raw source.
      expect(e.layerA.sourceExcerpt.includes(" = ")).toBe(false);
    }
  });
});

describe("Freeze file structure", () => {
  it("CC-19R-FREEZE.json exists and reproduces recorded hashes", () => {
    const freezePath = path.join(outDir, "CC-19R-FREEZE.json");
    expect(existsSync(freezePath)).toBe(true);
    const freeze = JSON.parse(readFileSync(freezePath, "utf-8")) as { fileHashes: Record<string, string> };
    for (const [relPath, expectedHash] of Object.entries(freeze.fileHashes)) {
      const abs = path.join(repoRoot, relPath);
      const content = readFileSync(abs);
      const actualHash = createHash("sha256").update(content).digest("hex");
      expect(actualHash).toBe(expectedHash);
    }
  });
});
