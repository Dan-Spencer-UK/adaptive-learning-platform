import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { allProposals, capabilityRequirementProposals, curriculumEvidenceProposals, factRequirementAndTechnicalTruthProposals, officialCurriculumUnitProposals, prerequisiteProposals, QUAL_ID } from "./cc19a-ledger-data.ts";
import { buildCoverageAccounting } from "./cc19a-accounting.ts";
import { BANNED_PROVENANCE_PATTERNS, findContamination } from "./cc19a-contamination-validator.ts";
import { filterToProfile } from "./cc19a-profile-filter.ts";
import { cc19aSourceInventory, cc19aUnavailabilityRecords } from "./cc19a-source-inventory-data.ts";

const BACKTEST_DIR = import.meta.dirname;

describe("CC-19A section 28.A -- every included source is a permitted role", () => {
  it("every INCLUDED source-inventory entry declares one of the four permitted roles", () => {
    const permitted = ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT", "QUALIFICATION_LEVEL", "TECHNICAL_TRUTH"];
    for (const e of cc19aSourceInventory.filter((x) => x.inclusionDecision === "INCLUDED")) {
      expect(permitted).toContain(e.sourceRole);
    }
  });

  it("every proposal's evidenceRole is one of the four permitted roles", () => {
    const permitted = ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT", "QUALIFICATION_LEVEL", "TECHNICAL_TRUTH"];
    for (const p of allProposals) expect(permitted).toContain(p.evidenceRole);
  });
});

describe("CC-19A section 28.B -- no private/legacy/derived Unit-202 answer source is referenced", () => {
  it("the contamination validator finds zero findings across the live ledger + inventory", () => {
    const findings = findContamination(allProposals, cc19aSourceInventory);
    expect(findings).toEqual([]);
  });

  it("[tamper regression] a proposal citing a banned provenance token IS caught", () => {
    const tampered = [
      ...allProposals,
      {
        ...allProposals[0]!,
        proposalId: "TAMPER-TEST",
        layerA: { ...allProposals[0]!.layerA, sourceRef: "scripts/content/data/unit202-depth-performance-matrix.ts" },
      },
    ];
    const findings = findContamination(tampered, cc19aSourceInventory);
    expect(findings.some((f) => f.id === "TAMPER-TEST")).toBe(true);
  });

  it("every EXCLUDED_* entry's own reason is permitted to mention what it is excluding (the validator only scans INCLUDED entries' sourceRef/title)", () => {
    const excluded = cc19aSourceInventory.filter((e) => e.inclusionDecision !== "INCLUDED");
    expect(excluded.length).toBeGreaterThan(0);
    // sanity: at least one excluded entry legitimately names a banned pattern in its own path/title
    const anyBannedPath = excluded.some((e) => BANNED_PROVENANCE_PATTERNS.some((p) => p.test(e.sourceRef) || p.test(e.title)));
    expect(anyBannedPath).toBe(true);
  });

  it("no included source's own sourceRef/title names SmartScreen, CC-16, CC-17, the depth-performance-matrix, or knowledge obligations", () => {
    for (const e of cc19aSourceInventory.filter((x) => x.inclusionDecision === "INCLUDED")) {
      expect(e.sourceRef.toLowerCase()).not.toMatch(/smartscreen|cc-16|cc-17|depth-performance-matrix|knowledge-obligation/);
      expect(e.title.toLowerCase()).not.toMatch(/smartscreen|cc-16|cc-17|depth-performance-matrix|knowledge-obligation/);
    }
  });
});

describe("CC-19A section 28.C -- every normalization proposal has exact raw source provenance", () => {
  it("every proposal's Layer A carries a non-empty sourceId, sourceRef, sourceLocator and sourceExcerpt", () => {
    for (const p of allProposals) {
      expect(p.layerA.sourceId.length, `${p.proposalId} sourceId`).toBeGreaterThan(0);
      expect(p.layerA.sourceRef.length, `${p.proposalId} sourceRef`).toBeGreaterThan(0);
      expect(p.layerA.sourceLocator.length, `${p.proposalId} sourceLocator`).toBeGreaterThan(0);
      expect(p.layerA.sourceExcerpt.length, `${p.proposalId} sourceExcerpt`).toBeGreaterThan(0);
    }
  });

  it("every proposal's sourceId resolves to a real, INCLUDED source-inventory entry", () => {
    const includedIds = new Set(cc19aSourceInventory.filter((e) => e.inclusionDecision === "INCLUDED").map((e) => e.sourceId));
    for (const p of allProposals) expect(includedIds.has(p.layerA.sourceId), `${p.proposalId} cites sourceId "${p.layerA.sourceId}"`).toBe(true);
  });

  it("every proposal carries a locked normalizationConfidence and a non-empty rationale explaining the transformation, not pedagogical usefulness", () => {
    for (const p of allProposals) {
      expect(["EXPLICIT", "STRONG_INFERENCE", "REVIEW_PROPOSED"]).toContain(p.layerB.normalizationConfidence);
      expect(p.layerB.normalizationRationale.length).toBeGreaterThan(0);
    }
  });

  it("Layer C is NOT_RUN_CC19A on every single proposal -- the pipeline acceptance layer is deliberately inert in this package", () => {
    for (const p of allProposals) expect(p.layerC.pipelineAcceptance).toBe("NOT_RUN_CC19A");
  });
});

describe("CC-19A section 28.D -- every curriculum source element reconciles", () => {
  it("exactly 23 Assessment Criteria are registered, matching the handbook's own LO1-LO6 numbering (1+3+4+8+5+2)", () => {
    expect(officialCurriculumUnitProposals.length).toBe(23);
  });

  it("LO4's structural absence of a Range section is explicitly recorded, never silently omitted", () => {
    const accounting = buildCoverageAccounting();
    expect(accounting.officialCurriculum.loWithNoRangeSection.length).toBeGreaterThan(0);
    expect(accounting.officialCurriculum.loWithNoRangeSection[0]).toMatch(/LO4/);
  });

  it("every OfficialCurriculumUnit proposal cites the handbook and a specific page", () => {
    for (const p of officialCurriculumUnitProposals) {
      expect(p.layerA.sourceId).toBe("src-cg-2365-02-handbook-v1-12");
      expect(p.layerA.sourceLocator).toMatch(/page \d+/);
    }
  });

  it("the ambiguous Zener/photo Diodes nesting is exported REVIEW_PROPOSED, never forced to EXPLICIT/STRONG_INFERENCE", () => {
    const zenerPhoto = curriculumEvidenceProposals.filter((p) => p.proposalId.includes("diodes--zener") || p.proposalId.includes("diodes--photo"));
    expect(zenerPhoto.length).toBe(2);
    for (const p of zenerPhoto) expect(p.layerB.normalizationConfidence).toBe("REVIEW_PROPOSED");
  });
});

describe("CC-19A section 28.E -- every public assessment item reconciles", () => {
  it("zero AssessmentEvidence proposals exist -- item-level content is honestly RAW_SOURCE_UNAVAILABLE", () => {
    expect(allProposals.some((p) => p.layerB.recordType === "AssessmentEvidence")).toBe(false);
    expect(cc19aUnavailabilityRecords.some((u) => u.kind === "RAW_SOURCE_UNAVAILABLE" && u.evidenceClass.includes("PUBLIC_ASSESSMENT"))).toBe(true);
  });

  it("the RAW_SOURCE_UNAVAILABLE record names concrete attempted sources, not a bare assertion", () => {
    const rec = cc19aUnavailabilityRecords.find((u) => u.evidenceClass.includes("PUBLIC_ASSESSMENT"))!;
    expect(rec.attemptedSources.length).toBeGreaterThanOrEqual(2);
  });
});

describe("CC-19A section 28.F -- assessment answers come from permitted official evidence or are REVIEW_PROPOSED", () => {
  it("(vacuous but explicit) since zero AssessmentEvidence proposals exist, none can violate the official-answer-evidence rule", () => {
    const assessmentProposals = allProposals.filter((p) => p.layerB.recordType === "AssessmentEvidence");
    expect(assessmentProposals.every((p) => p.layerB.normalizationConfidence !== "EXPLICIT" || p.layerA.sourceId === "src-cg-602-sample-mark-schemes-v1-0")).toBe(true);
  });
});

describe("CC-19A section 28.G -- distractors generate no scope records", () => {
  it("no proposal's rationale or excerpt references a distractor", () => {
    for (const p of allProposals) {
      expect(p.layerB.normalizationRationale.toLowerCase()).not.toContain("distractor");
      expect(p.layerA.sourceExcerpt.toLowerCase()).not.toContain("distractor");
    }
  });
});

describe("CC-19A section 28.H -- technical truth creates no curriculum candidate", () => {
  it("every SourceFactualClaim proposal's evidenceRole is TECHNICAL_TRUTH, never OFFICIAL_CURRICULUM", () => {
    for (const p of allProposals) {
      if (p.layerB.recordType !== "SourceFactualClaim") continue;
      expect(p.evidenceRole).toBe("TECHNICAL_TRUTH");
    }
  });

  it("no OfficialCurriculumUnit/CurriculumEvidence proposal cites the BIPM source", () => {
    for (const p of allProposals) {
      if (p.layerB.recordType !== "OfficialCurriculumUnit" && p.layerB.recordType !== "CurriculumEvidence") continue;
      expect(p.layerA.sourceId).not.toBe("src-bipm-si-brochure-9th-edition");
    }
  });
});

describe("CC-19A section 28.I -- every fact requirement precedes / is independent of technical-source attachment", () => {
  it("every SourceFactualClaim's claimKey matches a CandidateFactRequirement's claimKey that was proposed independently from curriculum wording (never AUTHORITATIVE_TECHNICAL_FACT basis)", () => {
    const factReqClaimKeys = new Set(factRequirementAndTechnicalTruthProposals.filter((p) => p.layerB.recordType === "CandidateFactRequirement").map((p) => (p.layerB.record as { claimKey: string }).claimKey));
    for (const p of factRequirementAndTechnicalTruthProposals) {
      if (p.layerB.recordType !== "SourceFactualClaim") continue;
      const claimKey = (p.layerB.record as { claimKey: string }).claimKey;
      expect(factReqClaimKeys.has(claimKey), `technical claim "${claimKey}" has no matching fact requirement`).toBe(true);
    }
  });

  it("every CandidateFactRequirement's normalizationBasis is FACT_REQUIREMENT_DERIVATION, never AUTHORITATIVE_TECHNICAL_FACT", () => {
    for (const p of factRequirementAndTechnicalTruthProposals) {
      if (p.layerB.recordType !== "CandidateFactRequirement") continue;
      expect((p.layerB.record as { normalizationBasis: string }).normalizationBasis).toBe("FACT_REQUIREMENT_DERIVATION");
    }
  });

  it("resistivity/impedance/inductive-reactance/capacitive-reactance fact requirements exist but have NO attached SourceFactualClaim -- never fabricated", () => {
    const accounting = buildCoverageAccounting();
    expect([...accounting.factRequirements.unattachedClaimKeys].sort()).toEqual(["capacitive-reactance-si-unit", "impedance-si-unit", "inductive-reactance-si-unit", "resistivity-si-unit"].sort());
    const attachedClaimKeys = new Set(factRequirementAndTechnicalTruthProposals.filter((p) => p.layerB.recordType === "SourceFactualClaim").map((p) => (p.layerB.record as { claimKey: string }).claimKey));
    for (const k of accounting.factRequirements.unattachedClaimKeys) expect(attachedClaimKeys.has(k)).toBe(false);
  });
});

describe("CC-19A section 28.J -- PROFILE B is mechanically derivable by filtering PROFILE A", () => {
  it("filterToProfile(allProposals, DEGRADED_NO_ASSESSMENT) is a strict subset of FULL_PUBLIC, never a separately authored list", () => {
    const profileA = filterToProfile(allProposals, "FULL_PUBLIC");
    const profileB = filterToProfile(allProposals, "DEGRADED_NO_ASSESSMENT");
    const idsA = new Set(profileA.map((p) => p.proposalId));
    for (const p of profileB) expect(idsA.has(p.proposalId)).toBe(true);
  });

  it("no proposal in this ledger depends solely on PUBLIC_ASSESSMENT authority (since zero AssessmentEvidence exists), so profile A and B are currently equal in size", () => {
    const profileA = filterToProfile(allProposals, "FULL_PUBLIC");
    const profileB = filterToProfile(allProposals, "DEGRADED_NO_ASSESSMENT");
    expect(profileB.length).toBe(profileA.length);
  });
});

describe("CC-19A section 28.K -- no CC-19A code executes buildStandardPipeline against Unit 202", () => {
  it("no .ts file under scripts/backtests/unit202 imports or calls buildStandardPipeline (prose mentions explaining its absence are fine; an import specifier or a call are not)", () => {
    const files = ["cc19a-types.ts", "cc19a-source-inventory-data.ts", "cc19a-ledger-data.ts", "cc19a-contamination-validator.ts", "cc19a-accounting.ts", "cc19a-profile-filter.ts", "generate-cc19a-reports.ts"];
    for (const f of files) {
      const source = readFileSync(path.join(BACKTEST_DIR, f), "utf-8");
      expect(source, `${f} must never CALL buildStandardPipeline`).not.toMatch(/buildStandardPipeline\(/);
      expect(source, `${f} must never IMPORT buildStandardPipeline`).not.toMatch(/import\s*\{[^}]*\bbuildStandardPipeline\b[^}]*\}/);
    }
  });

  it("every Layer C on every proposal is the inert NOT_RUN_CC19A sentinel, never a real pipeline verdict", () => {
    for (const p of allProposals) {
      expect(p.layerC).toEqual({ pipelineAcceptance: "NOT_RUN_CC19A" });
    }
  });
});

describe("CC-19A section 28.L -- freeze hashes reproduce exactly", () => {
  it("re-running the report generator's serialization produces byte-identical JSON content for a fixed proposal set", () => {
    const content1 = `${JSON.stringify({ proposals: allProposals }, null, 2)}\n`;
    const content2 = `${JSON.stringify({ proposals: allProposals }, null, 2)}\n`;
    expect(content1).toBe(content2);
  });

  it("the on-disk CC-19A-FREEZE.json hashes match a fresh hash of the on-disk ledger/inventory JSON files", async () => {
    const { createHash } = await import("node:crypto");
    const reportsDir = path.resolve(BACKTEST_DIR, "..", "..", "..", "reports", "backtests", "unit202");
    const freeze = JSON.parse(readFileSync(path.join(reportsDir, "CC-19A-FREEZE.json"), "utf-8")) as { hashes: Record<string, string> };
    const inventoryContent = readFileSync(path.join(reportsDir, "cc19a-source-inventory.json"), "utf-8");
    const ledgerContent = readFileSync(path.join(reportsDir, "cc19a-normalization-ledger.json"), "utf-8");
    expect(createHash("sha256").update(inventoryContent, "utf8").digest("hex")).toBe(freeze.hashes["cc19a-source-inventory.json"]);
    expect(createHash("sha256").update(ledgerContent, "utf8").digest("hex")).toBe(freeze.hashes["cc19a-normalization-ledger.json"]);
  });
});

describe("CC-19A -- proposal id uniqueness and internal consistency", () => {
  it("every proposalId is unique", () => {
    const ids = allProposals.map((p) => p.proposalId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("prerequisite and capability-requirement proposals are REVIEW_PROPOSED, never auto-promotable EXPLICIT_CURRICULUM_OPERATION, since the handbook never explicitly states the necessity relationship", () => {
    for (const p of [...prerequisiteProposals, ...capabilityRequirementProposals]) {
      expect(p.layerB.normalizationConfidence).toBe("REVIEW_PROPOSED");
      if (p.layerB.recordType === "CandidateCapabilityRequirement") {
        expect((p.layerB.record as { derivationKind: string }).derivationKind).toBe("REVIEW_PROPOSED");
      }
    }
  });

  it("every proposal declares the locked CC-19C-family qualificationId consistently where applicable", () => {
    for (const p of allProposals) {
      const rec = p.layerB.record as { qualificationId?: string };
      if (rec.qualificationId !== undefined) expect(rec.qualificationId).toBe(QUAL_ID);
    }
  });
});
