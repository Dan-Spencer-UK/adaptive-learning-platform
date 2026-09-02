/**
 * CC-19R clean-room ledger builder.
 *
 * Expands the raw curriculum data (curriculum-data.ts) into the
 * three-layer normalization ledger described in the CC-19R task
 * (section 8), attaches qualification-level evidence, explicit and
 * review-proposed fact requirements, and technical-truth claims, then
 * writes every required output file under
 * reports/backtests/unit202-cleanroom/.
 *
 * This script does NOT import or call packages/qualification-pipeline's
 * buildStandardPipeline -- every Layer-C `pipelineAcceptance` value is
 * the literal string "NOT_RUN_CC19R" (CC-19R section 8, 32).
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { ASSESSMENT_CRITERIA, LEARNING_OUTCOMES, UNIT_202_HEADER, HANDBOOK_SOURCE_REF, HANDBOOK_SOURCE_URL, type RawAC } from "./curriculum-data.ts";
import {
  OFQUAL_SOURCE_REF,
  OFQUAL_SOURCE_URL,
  OFQUAL_PAGE_LAST_UPDATED,
  OFQUAL_LEVEL_2_KNOWLEDGE_DESCRIPTOR,
  OFQUAL_LEVEL_2_SKILLS_DESCRIPTOR,
} from "./qualification-level-data.ts";
import { TECHNICAL_CLAIMS } from "./technical-truth-data.ts";
import { EXPLICIT_FACT_REQUIREMENTS } from "./explicit-facts-data.ts";
import { REVIEW_FACT_PROPOSALS, KNOWN_UNRESOLVED_DECOMPOSITIONS } from "./review-facts-data.ts";

const QUALIFICATION_ID = "2365-02";

export function candidateKey(subject: string, performanceType: string): string {
  return `${subject}::${performanceType}`;
}

type NormalizationConfidence = "EXPLICIT" | "STRONG_INFERENCE" | "REVIEW_PROPOSED";
type ProfileEligibility = "FULL_PUBLIC" | "DEGRADED_NO_ASSESSMENT";

interface LedgerEntry {
  readonly proposalId: string;
  readonly layerA: {
    readonly sourceId: string;
    readonly sourceRole: string;
    readonly sourceRef: string;
    readonly sourceLocator: string;
    readonly sourceExcerpt: string;
    readonly rawIdentifier: string;
    readonly rawCommandWording?: string;
  };
  readonly layerB: {
    readonly genericPipelineRecordType: string;
    readonly normalizedRecord: Record<string, unknown>;
    readonly normalizationConfidence: NormalizationConfidence;
    readonly normalizationRationale: string;
    readonly profileEligibility: readonly ProfileEligibility[];
  };
  readonly layerC: {
    readonly pipelineAcceptance: "NOT_RUN_CC19R";
  };
}

const ledger: LedgerEntry[] = [];
const candidateSubjectPerformanceSet = new Set<string>(); // "<subject>" existence check for refinesSubject resolution
const candidateSubjects = new Set<string>();
let seq = 0;
const nextId = (prefix: string) => `${prefix}-${String(++seq).padStart(4, "0")}`;

function acLocator(ac: RawAC): string {
  return `Page ${ac.pageRef}, ${ac.id}`;
}

function addCurriculumCandidate(opts: {
  ac: RawAC;
  subject: string;
  performanceType: string;
  confidence: NormalizationConfidence;
  rawVerb: string;
  normalizationKind: "PRIMARY_REQUIREMENT" | "RANGE_REQUIRED_MEMBER" | "RANGE_CATEGORY";
  sourceExcerpt: string;
  rationale: string;
  refinesSubject?: string;
  breadthStatus?: "ENUMERATED_COMPLETE" | "OPEN_OR_UNDERSPECIFIED" | "UNKNOWN";
  structuralReviewNote?: string;
}) {
  const { ac, subject, performanceType, confidence, rawVerb, normalizationKind, sourceExcerpt, rationale, refinesSubject, breadthStatus, structuralReviewNote } = opts;
  candidateSubjects.add(subject);
  candidateSubjectPerformanceSet.add(candidateKey(subject, performanceType));

  ledger.push({
    proposalId: nextId("CUR"),
    layerA: {
      sourceId: "SRC-HANDBOOK-2365-02-V1-12",
      sourceRole: "OFFICIAL_CURRICULUM",
      sourceRef: HANDBOOK_SOURCE_REF,
      sourceLocator: acLocator(ac),
      sourceExcerpt: sourceExcerpt,
      rawIdentifier: subject,
      rawCommandWording: rawVerb,
    },
    layerB: {
      genericPipelineRecordType: "CurriculumEvidence",
      normalizedRecord: {
        role: "OFFICIAL_CURRICULUM",
        qualificationId: QUALIFICATION_ID,
        curriculumUnitId: ac.id,
        subject,
        normalizationKind,
        performanceType,
        refinesSubject: refinesSubject,
        breadthStatus: normalizationKind === "RANGE_CATEGORY" ? (breadthStatus ?? "UNKNOWN") : undefined,
        candidateKey: candidateKey(subject, performanceType),
        structuralParentageReview: structuralReviewNote,
      },
      normalizationConfidence: confidence,
      normalizationRationale: rationale,
      profileEligibility: ["FULL_PUBLIC", "DEGRADED_NO_ASSESSMENT"],
    },
    layerC: { pipelineAcceptance: "NOT_RUN_CC19R" },
  });
}

// ---------------------------------------------------------------------
// Expand curriculum candidates from ASSESSMENT_CRITERIA
// ---------------------------------------------------------------------
for (const ac of ASSESSMENT_CRITERIA) {
  // 1. Standalone parent subject (only when NOT coincident with a range group)
  if (ac.parentSubject) {
    for (const perf of ac.performances) {
      addCurriculumCandidate({
        ac,
        subject: ac.parentSubject,
        performanceType: perf.mapped,
        confidence: perf.confidence,
        rawVerb: perf.rawVerb,
        normalizationKind: "PRIMARY_REQUIREMENT",
        sourceExcerpt: ac.wording,
        rationale: perf.rationale,
      });
    }
  }

  // 2. Explicit children named directly in AC wording
  for (const child of ac.explicitChildren ?? []) {
    const performances = child.performances ?? ac.performances;
    for (const perf of performances) {
      addCurriculumCandidate({
        ac,
        subject: child.subject,
        performanceType: perf.mapped,
        confidence: perf.confidence,
        rawVerb: perf.rawVerb,
        normalizationKind: "PRIMARY_REQUIREMENT",
        sourceExcerpt: `${ac.wording} [child: ${child.rawWording}]`,
        rationale: `${perf.rationale} Explicit named sub-content within the same AC clause (CC-19R section 13).${child.structuralReviewNote ? " " + child.structuralReviewNote : ""}`,
        structuralReviewNote: child.structuralReviewNote,
      });
    }
  }

  // 3. Range groups: RANGE_CATEGORY + RANGE_REQUIRED_MEMBER children
  for (const group of ac.rangeGroups ?? []) {
    const categoryPerformances = group.memberPerformances ?? ac.performances;
    for (const perf of categoryPerformances) {
      addCurriculumCandidate({
        ac,
        subject: group.categorySubject,
        performanceType: perf.mapped,
        confidence: perf.confidence,
        rawVerb: perf.rawVerb,
        normalizationKind: "RANGE_CATEGORY",
        sourceExcerpt: `${ac.wording} | Range: ${group.categoryLabel}`,
        rationale: `${perf.rationale} Range category header (page ${group.pageRef}) ${group.coincidesWithParentSubject ? "coincides with the AC's own explicit subject wording" : "enumerates the sub-scope this AC's performance applies across"}.`,
        breadthStatus: group.breadthStatus,
      });
    }

    for (const member of group.members) {
      const memberPerformances = group.memberPerformances ?? ac.performances;
      for (const perf of memberPerformances) {
        addCurriculumCandidate({
          ac,
          subject: member.subject,
          performanceType: perf.mapped,
          confidence: "STRONG_INFERENCE",
          rawVerb: perf.rawVerb,
          normalizationKind: "RANGE_REQUIRED_MEMBER",
          sourceExcerpt: `Range (page ${group.pageRef}), "${group.categoryLabel}": "${member.raw}"`,
          rationale: `CC-19R section 12: Range member "${member.raw}" has no independent command verb -- membership is literal (EXPLICIT_RANGE_STRUCTURE) but the inherited performance mapping ${perf.mapped} is STRONG_INFERENCE, not EXPLICIT.${member.structuralReviewNote ? " " + member.structuralReviewNote : ""}`,
          refinesSubject: group.refinesSubject,
          structuralReviewNote: member.structuralReviewNote,
        });
      }
    }
  }
}

// ---------------------------------------------------------------------
// Parent-integrity validation (CC-19R section 14): every
// RANGE_REQUIRED_MEMBER.refinesSubject must resolve to a real candidate
// subject generated above.
// ---------------------------------------------------------------------
const unresolvedParents: string[] = [];
for (const entry of ledger) {
  const rec = entry.layerB.normalizedRecord as { normalizationKind?: string; refinesSubject?: string };
  if (rec.normalizationKind === "RANGE_REQUIRED_MEMBER" && rec.refinesSubject) {
    if (!candidateSubjects.has(rec.refinesSubject)) {
      unresolvedParents.push(`${entry.proposalId}: refinesSubject "${rec.refinesSubject}" does not resolve to any generated candidate subject`);
    }
  }
}
if (unresolvedParents.length > 0) {
  throw new Error(`CC-19R parent-integrity violation (section 14):\n${unresolvedParents.join("\n")}`);
}

// ---------------------------------------------------------------------
// Qualification-level evidence (depth constraint only, CC-19R section 17)
// ---------------------------------------------------------------------
ledger.push({
  proposalId: nextId("QLV"),
  layerA: {
    sourceId: "SRC-OFQUAL-HANDBOOK-SECTION-E",
    sourceRole: "QUALIFICATION_LEVEL",
    sourceRef: OFQUAL_SOURCE_REF,
    sourceLocator: `Level descriptors table, Level 2 row, knowledge/understanding column (page last updated ${OFQUAL_PAGE_LAST_UPDATED})`,
    sourceExcerpt: OFQUAL_LEVEL_2_KNOWLEDGE_DESCRIPTOR,
    rawIdentifier: "Level 2 knowledge and understanding descriptor",
  },
  layerB: {
    genericPipelineRecordType: "QualificationLevelEvidence",
    normalizedRecord: {
      role: "QUALIFICATION_LEVEL",
      qualificationId: QUALIFICATION_ID,
      levelId: "Level 2",
      depthConstraintDescriptor: OFQUAL_LEVEL_2_KNOWLEDGE_DESCRIPTOR,
      appliesToCandidateKey: "ALL_UNIT_202_REQUIRED_CANDIDATES",
    },
    normalizationConfidence: "EXPLICIT",
    normalizationRationale:
      "Current Ofqual Handbook Section E / Condition E9 Level 2 knowledge/understanding descriptor, applied as a general depth ceiling across all Unit 202 required candidates (CC-19R section 17) -- constrains depth only, never scope.",
    profileEligibility: ["FULL_PUBLIC", "DEGRADED_NO_ASSESSMENT"],
  },
  layerC: { pipelineAcceptance: "NOT_RUN_CC19R" },
});
ledger.push({
  proposalId: nextId("QLV"),
  layerA: {
    sourceId: "SRC-OFQUAL-HANDBOOK-SECTION-E",
    sourceRole: "QUALIFICATION_LEVEL",
    sourceRef: OFQUAL_SOURCE_REF,
    sourceLocator: `Level descriptors table, Level 2 row, skills column (page last updated ${OFQUAL_PAGE_LAST_UPDATED})`,
    sourceExcerpt: OFQUAL_LEVEL_2_SKILLS_DESCRIPTOR,
    rawIdentifier: "Level 2 skills descriptor",
  },
  layerB: {
    genericPipelineRecordType: "QualificationLevelEvidence",
    normalizedRecord: {
      role: "QUALIFICATION_LEVEL",
      qualificationId: QUALIFICATION_ID,
      levelId: "Level 2",
      depthConstraintDescriptor: OFQUAL_LEVEL_2_SKILLS_DESCRIPTOR,
      appliesToCandidateKey: "ALL_UNIT_202_REQUIRED_CANDIDATES",
    },
    normalizationConfidence: "EXPLICIT",
    normalizationRationale:
      "Current Ofqual Handbook Section E / Condition E9 Level 2 skills descriptor, applied as a general depth ceiling across all Unit 202 required candidates that involve APPLY/CALCULATE/PROCEDURE performances (CC-19R section 17) -- constrains depth only, never scope.",
    profileEligibility: ["FULL_PUBLIC", "DEGRADED_NO_ASSESSMENT"],
  },
  layerC: { pipelineAcceptance: "NOT_RUN_CC19R" },
});

// ---------------------------------------------------------------------
// Technical-truth claims (SourceFactualClaim)
// ---------------------------------------------------------------------
const technicalClaimById = new Map<string, string>(); // claimKey -> proposalId (first occurrence; multiple claims can share a claimKey e.g. power factor)
for (const claim of TECHNICAL_CLAIMS) {
  const id = nextId("TEC");
  if (!technicalClaimById.has(claim.claimKey)) technicalClaimById.set(claim.claimKey, id);
  ledger.push({
    proposalId: id,
    layerA: {
      sourceId: `SRC-TECH-${claim.claimKey}`,
      sourceRole: "TECHNICAL_TRUTH",
      sourceRef: claim.sourceRef,
      sourceLocator: claim.sourceLocator,
      sourceExcerpt: claim.sourceExcerpt,
      rawIdentifier: claim.subject,
    },
    layerB: {
      genericPipelineRecordType: "SourceFactualClaim",
      normalizedRecord: {
        claimKey: claim.claimKey,
        subject: claim.subject,
        sourceRole: "TECHNICAL_TRUTH",
        normalizedClaimValue: claim.normalizedClaimValue,
        comparisonKind: claim.comparisonKind,
      },
      normalizationConfidence: "EXPLICIT",
      normalizationRationale: `Independently researched technical-truth source (CC-19R section 4/22/23). Source quality: ${claim.sourceQuality}`,
      profileEligibility: ["FULL_PUBLIC", "DEGRADED_NO_ASSESSMENT"],
    },
    layerC: { pipelineAcceptance: "NOT_RUN_CC19R" },
  });
}

// ---------------------------------------------------------------------
// Fact requirements: EXPLICIT_CURRICULUM_FACT + REVIEW_PROPOSED
// ---------------------------------------------------------------------
const acById = new Map(ASSESSMENT_CRITERIA.map((ac) => [ac.id, ac] as const));
const missingFactTargets: string[] = [];
const missingTechnicalClaims: string[] = [];

for (const fact of EXPLICIT_FACT_REQUIREMENTS) {
  const key = candidateKey(fact.targetSubject, fact.targetPerformanceType);
  if (!candidateSubjectPerformanceSet.has(key)) missingFactTargets.push(`EXPLICIT fact ${fact.claimKey} -> missing candidate ${key}`);
  const ac = acById.get(fact.parentAcId);
  if (!ac) throw new Error(`Unknown parentAcId ${fact.parentAcId}`);
  const techClaim = TECHNICAL_CLAIMS.find((c) => c.claimKey === fact.claimKey);
  ledger.push({
    proposalId: nextId("FCT"),
    layerA: {
      sourceId: "SRC-HANDBOOK-2365-02-V1-12",
      sourceRole: "OFFICIAL_CURRICULUM",
      sourceRef: HANDBOOK_SOURCE_REF,
      sourceLocator: acLocator(ac),
      sourceExcerpt: ac.wording,
      rawIdentifier: fact.targetSubject,
    },
    layerB: {
      genericPipelineRecordType: "CandidateFactRequirement",
      normalizedRecord: {
        qualificationId: QUALIFICATION_ID,
        targetCandidateKey: key,
        claimKey: fact.claimKey,
        derivationStatus: "EXPLICIT_CURRICULUM_FACT",
        normalizationBasis: "FACT_REQUIREMENT_DERIVATION",
        technicalCoverageStatus: techClaim ? "COMPLETE" : "PARTIAL",
      },
      normalizationConfidence: "EXPLICIT",
      normalizationRationale: `CC-19R section 18: ${fact.parentAcId} explicitly requires identifying/using/determining the applicable SI unit -- atomic fact requirement derived directly from validated OFFICIAL_CURRICULUM evidence, never REVIEW_PROPOSED.`,
      profileEligibility: ["FULL_PUBLIC", "DEGRADED_NO_ASSESSMENT"],
    },
    layerC: { pipelineAcceptance: "NOT_RUN_CC19R" },
  });
}

for (const fact of REVIEW_FACT_PROPOSALS) {
  const key = candidateKey(fact.targetSubject, fact.targetPerformanceType);
  if (!candidateSubjectPerformanceSet.has(key)) missingFactTargets.push(`REVIEW_PROPOSED fact ${fact.claimKey} -> missing candidate ${key}`);
  const ac = acById.get(fact.parentAcId);
  if (!ac) throw new Error(`Unknown parentAcId ${fact.parentAcId}`);
  const techClaim = fact.technicalClaimKey ? TECHNICAL_CLAIMS.find((c) => c.claimKey === fact.technicalClaimKey) : undefined;
  if (fact.technicalClaimKey && !techClaim) missingTechnicalClaims.push(`${fact.claimKey} references missing technical claim ${fact.technicalClaimKey}`);
  ledger.push({
    proposalId: nextId("FCT"),
    layerA: {
      sourceId: "SRC-HANDBOOK-2365-02-V1-12",
      sourceRole: "OFFICIAL_CURRICULUM",
      sourceRef: HANDBOOK_SOURCE_REF,
      sourceLocator: acLocator(ac),
      sourceExcerpt: ac.wording,
      rawIdentifier: fact.targetSubject,
    },
    layerB: {
      genericPipelineRecordType: "CandidateFactRequirement",
      normalizedRecord: {
        qualificationId: QUALIFICATION_ID,
        targetCandidateKey: key,
        claimKey: fact.claimKey,
        derivationStatus: "REVIEW_PROPOSED",
        normalizationBasis: "FACT_REQUIREMENT_DERIVATION",
        technicalCoverageStatus: techClaim ? "COMPLETE" : "NOT_REQUIRED",
      },
      normalizationConfidence: "REVIEW_PROPOSED",
      normalizationRationale: fact.necessityRationale + " CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.",
      profileEligibility: ["FULL_PUBLIC", "DEGRADED_NO_ASSESSMENT"],
    },
    layerC: { pipelineAcceptance: "NOT_RUN_CC19R" },
  });
}

if (missingFactTargets.length > 0) {
  throw new Error(`CC-19R fact-requirement target resolution failure:\n${missingFactTargets.join("\n")}`);
}
if (missingTechnicalClaims.length > 0) {
  throw new Error(`CC-19R technical-claim reference failure:\n${missingTechnicalClaims.join("\n")}`);
}

// ---------------------------------------------------------------------
// Decomposition coverage report (CC-19R section 24)
// ---------------------------------------------------------------------
type DecompositionStatus = "EXPLICITLY_ATOMIC" | "REVIEW_DECOMPOSED" | "UNRESOLVED_DECOMPOSITION";

interface CandidateSummary {
  readonly candidateKey: string;
  readonly subject: string;
  readonly performanceType: string;
  readonly parentAcId: string;
  readonly normalizationKind: string;
  readonly normalizationConfidence: NormalizationConfidence;
}

const candidateSummaries: CandidateSummary[] = ledger
  .filter((e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence")
  .map((e) => {
    const rec = e.layerB.normalizedRecord as { candidateKey: string; subject: string; performanceType: string; curriculumUnitId: string; normalizationKind: string };
    return {
      candidateKey: rec.candidateKey,
      subject: rec.subject,
      performanceType: rec.performanceType,
      parentAcId: rec.curriculumUnitId,
      normalizationKind: rec.normalizationKind,
      normalizationConfidence: e.layerB.normalizationConfidence,
    };
  });

interface CoverageRow extends CandidateSummary {
  readonly decompositionStatus: DecompositionStatus;
  readonly explicitFactCount: number;
  readonly reviewProposedFactCount: number;
}

const coverageRows: CoverageRow[] = candidateSummaries.map((c) => {
  const explicitCount = EXPLICIT_FACT_REQUIREMENTS.filter((f) => candidateKey(f.targetSubject, f.targetPerformanceType) === c.candidateKey).length;
  const reviewCount = REVIEW_FACT_PROPOSALS.filter((f) => candidateKey(f.targetSubject, f.targetPerformanceType) === c.candidateKey).length;
  let status: DecompositionStatus;
  if (explicitCount > 0) status = "EXPLICITLY_ATOMIC";
  else if (reviewCount > 0) status = "REVIEW_DECOMPOSED";
  else status = "UNRESOLVED_DECOMPOSITION";
  return { ...c, decompositionStatus: status, explicitFactCount: explicitCount, reviewProposedFactCount: reviewCount };
});

const coverageByAc = new Map<string, CoverageRow[]>();
for (const row of coverageRows) {
  const list = coverageByAc.get(row.parentAcId) ?? [];
  list.push(row);
  coverageByAc.set(row.parentAcId, list);
}

const decompositionCoverage = {
  generatedBy: "CC-19R clean-room build-ledger.ts",
  totalCandidates: coverageRows.length,
  statusCounts: {
    EXPLICITLY_ATOMIC: coverageRows.filter((r) => r.decompositionStatus === "EXPLICITLY_ATOMIC").length,
    REVIEW_DECOMPOSED: coverageRows.filter((r) => r.decompositionStatus === "REVIEW_DECOMPOSED").length,
    UNRESOLVED_DECOMPOSITION: coverageRows.filter((r) => r.decompositionStatus === "UNRESOLVED_DECOMPOSITION").length,
  },
  byAc: Array.from(coverageByAc.entries()).map(([acId, rows]) => ({
    acId,
    acWording: acById.get(acId)?.wording,
    candidateCount: rows.length,
    explicitlyAtomic: rows.filter((r) => r.decompositionStatus === "EXPLICITLY_ATOMIC").length,
    reviewDecomposed: rows.filter((r) => r.decompositionStatus === "REVIEW_DECOMPOSED").length,
    unresolved: rows.filter((r) => r.decompositionStatus === "UNRESOLVED_DECOMPOSITION").length,
    candidates: rows.map((r) => ({
      candidateKey: r.candidateKey,
      normalizationKind: r.normalizationKind,
      normalizationConfidence: r.normalizationConfidence,
      decompositionStatus: r.decompositionStatus,
      explicitFactCount: r.explicitFactCount,
      reviewProposedFactCount: r.reviewProposedFactCount,
    })),
  })),
  knownUnresolvedDecompositions: KNOWN_UNRESOLVED_DECOMPOSITIONS,
  technicalSourceCoverage: {
    totalTechnicalClaims: TECHNICAL_CLAIMS.length,
    distinctClaimKeys: new Set(TECHNICAL_CLAIMS.map((c) => c.claimKey)).size,
  },
};

// ---------------------------------------------------------------------
// Write outputs
// ---------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const outDir = path.join(repoRoot, "reports", "backtests", "unit202-cleanroom");
mkdirSync(outDir, { recursive: true });

function writeJson(name: string, data: unknown) {
  writeFileSync(path.join(outDir, name), JSON.stringify(data, null, 2) + "\n", "utf-8");
}

writeJson("cc19r-normalization-ledger.json", {
  qualificationId: QUALIFICATION_ID,
  unitId: UNIT_202_HEADER.unitId,
  unitTitle: UNIT_202_HEADER.unitTitle,
  generatedBy: "CC-19R clean-room build-ledger.ts",
  recordCount: ledger.length,
  records: ledger,
});

writeJson("cc19r-decomposition-coverage.json", decompositionCoverage);

const sourceInventory = {
  qualificationId: QUALIFICATION_ID,
  officialCurriculum: [{ sourceRef: HANDBOOK_SOURCE_REF, url: HANDBOOK_SOURCE_URL, version: "v1-12" }],
  publicAssessment: {
    landingPageUrl: "https://www.cityandguilds.com/qualifications-and-apprenticeships/building-services-industry/electrical-installation/2365-electrotechnical-craft",
    sampleQuestionsDocument: {
      title: "5357 and 2365 Sample Papers v1-2",
      url: "https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/assessment_materials/sample_assessment/5357-and-2365-sample-papers-v1-2-pdf.pdf",
      status: "RAW_SOURCE_UNAVAILABLE",
      reason:
        "Downloaded directly from the current official Level 2 landing page (and independently re-confirmed via the Level 3 landing page's identically-named link -- both resolve to the same SHA-256). The file is password-protected (poppler pdftotext/pdfinfo and the Read tool's PDF renderer both fail with 'Incorrect password' even with an explicit empty user password). CC-19R section B explicitly disallows password-protected/private material, so this document was NOT used as evidence. This is a genuine access restriction, not a parser failure or a guessed/obsolete URL (CC-19R section 27).",
    },
    markScheme: {
      title: "5357 and 2365 Sample Papers - Mark schemes v1-0",
      url: "https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/assessment_materials/sample_assessment/5357-and-2365-sample-papers---mark-schemes-v1-0-pdf.pdf",
      status: "ACCESSED_BUT_INSUFFICIENT",
      reason:
        "Not encrypted; successfully extracted. Contains ONLY question-number-to-answer-letter keys for 2365-602 Principles of Electrical Science (40 items, e.g. '1 C, 2 B, ...'), with no question stems, no answer-option text, and no distractor content. CC-19R section 16 requires an exact/short question-stem excerpt and the correct-answer CONTENT for every recorded item -- an answer letter alone cannot establish what content the correct answer represents, so no AssessmentEvidence records were created from this file.",
    },
  },
  qualificationLevel: [{ sourceRef: OFQUAL_SOURCE_REF, url: OFQUAL_SOURCE_URL, pageLastUpdated: OFQUAL_PAGE_LAST_UPDATED }],
  technicalTruth: TECHNICAL_CLAIMS.map((c) => ({ claimKey: c.claimKey, sourceRef: c.sourceRef, sourceLocator: c.sourceLocator })),
  profileImpact: {
    note: "FULL_PUBLIC and DEGRADED_NO_ASSESSMENT are IDENTICAL in this run: the only PUBLIC_ASSESSMENT document available (sample papers v1-2) was password-protected and therefore never used as evidence (see publicAssessment.sampleQuestionsDocument above). No candidate, fact requirement, or relationship in this ledger depends solely on assessment evidence, so mechanically filtering out PUBLIC_ASSESSMENT evidence removes nothing. This is reported transparently per CC-19R section 16/26, not fabricated as a false distinction.",
  },
};
writeJson("cc19r-source-inventory.json", sourceInventory);

// ---------------------------------------------------------------------
// Human-readable Markdown reports
// ---------------------------------------------------------------------
function mdEscape(s: string): string {
  return s.replace(/\|/g, "\\|");
}

const ledgerMdLines: string[] = [];
ledgerMdLines.push(`# CC-19R Normalization Ledger -- Unit 202 Principles of Electrical Science`, "");
ledgerMdLines.push(`Clean-room proposal ledger. Every record: RAW SOURCE -> NORMALIZED REQUIRED CONTENT / REVIEW-PROPOSED KNOWLEDGE / TECHNICAL TRUTH -> pipelineAcceptance = NOT_RUN_CC19R.`, "");

for (const lo of LEARNING_OUTCOMES) {
  ledgerMdLines.push(`## ${lo.id}: ${lo.wording}`, "");
  const acsForLo = ASSESSMENT_CRITERIA.filter((ac) => ac.loId === lo.id);
  for (const ac of acsForLo) {
    ledgerMdLines.push(`### ${ac.id}`, "", `**RAW SOURCE (AC wording, page ${ac.pageRef}):** "${mdEscape(ac.wording)}"`, "");
    const relatedCurriculum = ledger.filter(
      (e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence" && (e.layerB.normalizedRecord as { curriculumUnitId: string }).curriculumUnitId === ac.id,
    );
    ledgerMdLines.push(`**NORMALIZED REQUIRED CONTENT:**`, "");
    ledgerMdLines.push(`| Candidate | Kind | Performance | Confidence | Refines |`, `|---|---|---|---|---|`);
    for (const e of relatedCurriculum) {
      const rec = e.layerB.normalizedRecord as { subject: string; normalizationKind: string; performanceType: string; refinesSubject?: string };
      ledgerMdLines.push(`| ${mdEscape(rec.subject)} | ${rec.normalizationKind} | ${rec.performanceType} | ${e.layerB.normalizationConfidence} | ${rec.refinesSubject ? mdEscape(rec.refinesSubject) : "-"} |`);
    }
    ledgerMdLines.push("");

    const relatedExplicitFacts = ledger.filter(
      (e) =>
        e.layerB.genericPipelineRecordType === "CandidateFactRequirement" &&
        (e.layerB.normalizedRecord as { derivationStatus: string }).derivationStatus === "EXPLICIT_CURRICULUM_FACT" &&
        relatedCurriculum.some((c) => (c.layerB.normalizedRecord as { candidateKey: string }).candidateKey === (e.layerB.normalizedRecord as { targetCandidateKey: string }).targetCandidateKey),
    );
    if (relatedExplicitFacts.length > 0) {
      ledgerMdLines.push(`**EXPLICIT FACT REQUIREMENTS:**`, "");
      for (const e of relatedExplicitFacts) {
        const rec = e.layerB.normalizedRecord as { targetCandidateKey: string; claimKey: string };
        const claim = TECHNICAL_CLAIMS.find((c) => c.claimKey === rec.claimKey);
        ledgerMdLines.push(`- \`${rec.claimKey}\` on ${mdEscape(rec.targetCandidateKey)}${claim ? ` -- **TECHNICAL TRUTH:** ${mdEscape(claim.normalizedClaimValue)} (${mdEscape(claim.sourceRef)})` : " -- **UNRESOLVED** (no technical claim)"}`);
      }
      ledgerMdLines.push("");
    }

    const relatedReviewFacts = ledger.filter(
      (e) =>
        e.layerB.genericPipelineRecordType === "CandidateFactRequirement" &&
        (e.layerB.normalizedRecord as { derivationStatus: string }).derivationStatus === "REVIEW_PROPOSED" &&
        relatedCurriculum.some((c) => (c.layerB.normalizedRecord as { candidateKey: string }).candidateKey === (e.layerB.normalizedRecord as { targetCandidateKey: string }).targetCandidateKey),
    );
    if (relatedReviewFacts.length > 0) {
      ledgerMdLines.push(`**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**`, "");
      for (const e of relatedReviewFacts) {
        const rec = e.layerB.normalizedRecord as { targetCandidateKey: string; claimKey: string };
        const claim = TECHNICAL_CLAIMS.find((c) => c.claimKey === rec.claimKey);
        ledgerMdLines.push(`- \`${rec.claimKey}\` on ${mdEscape(rec.targetCandidateKey)}: ${mdEscape(e.layerB.normalizationRationale)}`);
        if (claim) ledgerMdLines.push(`  - **TECHNICAL TRUTH:** ${mdEscape(claim.normalizedClaimValue)} (${mdEscape(claim.sourceRef)})`);
        else ledgerMdLines.push(`  - **UNRESOLVED:** no technical claim researched/found this session`);
      }
      ledgerMdLines.push("");
    }
  }
}
writeFileSync(path.join(outDir, "CC-19R-NORMALIZATION-LEDGER.md"), ledgerMdLines.join("\n").trimEnd() + "\n", "utf-8");

const coverageMdLines: string[] = [];
coverageMdLines.push(`# CC-19R Decomposition Coverage Report`, "");
coverageMdLines.push(
  `Total candidates: ${decompositionCoverage.totalCandidates}. EXPLICITLY_ATOMIC: ${decompositionCoverage.statusCounts.EXPLICITLY_ATOMIC}. REVIEW_DECOMPOSED: ${decompositionCoverage.statusCounts.REVIEW_DECOMPOSED}. UNRESOLVED_DECOMPOSITION: ${decompositionCoverage.statusCounts.UNRESOLVED_DECOMPOSITION}.`,
  "",
);
for (const row of decompositionCoverage.byAc) {
  coverageMdLines.push(`## ${row.acId} (${row.candidateCount} candidates)`, "", `"${mdEscape(row.acWording ?? "")}"`, "");
  coverageMdLines.push(`Explicitly atomic: ${row.explicitlyAtomic} | Review-decomposed: ${row.reviewDecomposed} | Unresolved: ${row.unresolved}`, "");
  coverageMdLines.push(`| Candidate key | Kind | Status | Explicit facts | Review facts |`, `|---|---|---|---|---|`);
  for (const c of row.candidates) {
    coverageMdLines.push(`| ${mdEscape(c.candidateKey)} | ${c.normalizationKind} | ${c.decompositionStatus} | ${c.explicitFactCount} | ${c.reviewProposedFactCount} |`);
  }
  coverageMdLines.push("");
}
coverageMdLines.push(`## Known unresolved decompositions (technical source actively sought, not found)`, "");
for (const u of KNOWN_UNRESOLVED_DECOMPOSITIONS) {
  coverageMdLines.push(`- **${mdEscape(u.subject)}**: ${mdEscape(u.reason)}`);
}
writeFileSync(path.join(outDir, "CC-19R-DECOMPOSITION-COVERAGE.md"), coverageMdLines.join("\n").trimEnd() + "\n", "utf-8");

console.log(`CC-19R ledger built: ${ledger.length} records, ${coverageRows.length} curriculum candidates.`);
console.log(`Decomposition: EXPLICITLY_ATOMIC=${decompositionCoverage.statusCounts.EXPLICITLY_ATOMIC} REVIEW_DECOMPOSED=${decompositionCoverage.statusCounts.REVIEW_DECOMPOSED} UNRESOLVED=${decompositionCoverage.statusCounts.UNRESOLVED_DECOMPOSITION}`);

export { ledger, decompositionCoverage, coverageRows, outDir };
