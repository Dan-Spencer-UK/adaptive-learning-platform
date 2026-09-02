/**
 * CC-19R1 clean-room ledger builder (supersedes CC-19R's build-ledger.ts).
 *
 * Fixes three defects identified by the CC-19R1 completion/correction
 * package:
 *   DEFECT A -- every Layer-B `normalizedRecord` now statically satisfies
 *     the ACTUAL exported generic-pipeline production type named by
 *     `genericPipelineRecordType` (imported type-only from
 *     "@alp/qualification-pipeline"), never a hand-invented
 *     Record<string, unknown> lookalike. Back-test-only audit metadata
 *     (proposalId, normalizationConfidence, normalizationRationale,
 *     profileEligibility, derivedCandidateKey, originKind,
 *     structuralParentageReviewNote) lives in the wrapper, never inside
 *     normalizedRecord.
 *   DEFECT B -- every one of the 140 CurriculumEvidence candidates now
 *     has an explicit DecompositionAttempt (EXPLICITLY_ATOMIC /
 *     REVIEW_DECOMPOSED / UNRESOLVED_DECOMPOSITION), including
 *     structural parents/categories correctly linked to the child
 *     candidates that decompose them.
 *   DEFECT C -- Layer-A `sourceFragments` contain ONLY text that is
 *     itself verbatim source wording (checked by a real validator in
 *     verbatim-validator.ts) -- no synthetic "[child: ...]" / "| Range:"
 *     concatenation.
 *
 * This script does NOT import or call packages/qualification-pipeline's
 * buildStandardPipeline -- every Layer-C `pipelineAcceptance` value is
 * the literal string "NOT_RUN_CC19R1".
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { candidateKey } from "@alp/qualification-pipeline";
import type { CandidateFactRequirement, CurriculumEvidence, CurriculumNormalizationKind, LearnerPerformanceType, OfficialCurriculumUnit, QualificationLevelEvidence, SourceFactualClaim } from "@alp/qualification-pipeline";

import { ASSESSMENT_CRITERIA, LEARNING_OUTCOMES, UNIT_202_HEADER, HANDBOOK_SOURCE_REF, type RawAC } from "./curriculum-data.ts";
import { OFFICIAL_CURRICULUM_UNITS } from "./official-curriculum-units.ts";
import {
  OFQUAL_SOURCE_REF,
  OFQUAL_SOURCE_URL,
  OFQUAL_PAGE_LAST_UPDATED,
  OFQUAL_LEVEL_2_KNOWLEDGE_DESCRIPTOR,
  OFQUAL_LEVEL_2_SKILLS_DESCRIPTOR,
} from "./qualification-level-data.ts";
import { TECHNICAL_CLAIMS } from "./technical-truth-data.ts";
import { EXPLICIT_FACT_REQUIREMENTS } from "./explicit-facts-data.ts";
import { REVIEW_FACT_PROPOSALS, ATOMIC_BY_DESIGN_SUBJECTS, GENUINELY_UNRESOLVED_SUBJECTS } from "./review-facts-data.ts";

const QUALIFICATION_ID = "2365-02";

type NormalizationConfidence = "EXPLICIT" | "STRONG_INFERENCE" | "REVIEW_PROPOSED";
type ProfileEligibility = "FULL_PUBLIC" | "DEGRADED_NO_ASSESSMENT";

export interface SourceFragment {
  readonly sourceRef: string;
  readonly sourceLocator: string;
  /** MUST be verbatim source wording -- see verbatim-validator.ts. Never synthetic prose/annotations. */
  readonly sourceExcerpt: string;
  /** What this fragment supplies (e.g. "command verb", "subject/Range member", "Range category label"). Audit-only, not part of any production record. */
  readonly fragmentRole: string;
}

export interface LedgerEntry {
  readonly proposalId: string;
  readonly derivedCandidateKey?: string;
  readonly layerA: {
    readonly sourceFragments: readonly SourceFragment[];
  };
  readonly layerB: {
    readonly genericPipelineRecordType: "CurriculumEvidence" | "OfficialCurriculumUnit" | "QualificationLevelEvidence" | "SourceFactualClaim" | "CandidateFactRequirement";
    readonly normalizedRecord: CurriculumEvidence | OfficialCurriculumUnit | QualificationLevelEvidence | SourceFactualClaim | CandidateFactRequirement;
    readonly normalizationConfidence: NormalizationConfidence;
    readonly normalizationRationale: string;
    readonly profileEligibility: readonly ProfileEligibility[];
    readonly structuralParentageReviewNote?: string;
  };
  readonly layerC: {
    readonly pipelineAcceptance: "NOT_RUN_CC19R1";
  };
}

const ledger: LedgerEntry[] = [];
let seq = 0;
const nextId = (prefix: string) => `${prefix}-${String(++seq).padStart(4, "0")}`;
const nextEvidenceId = (prefix: string) => `EV-${prefix}-${String(seq + 1).padStart(4, "0")}`;

function acLocator(ac: RawAC): string {
  return `Page ${ac.pageRef}, ${ac.id}`;
}

// ---------------------------------------------------------------------
// Curriculum candidate origin tracking (for DecompositionAttempt
// child-coverage computation -- CC-19R1 section 8).
// ---------------------------------------------------------------------
type OriginKind = "AC_PARENT" | "EXPLICIT_CHILD" | "RANGE_CATEGORY" | "RANGE_MEMBER";

interface CandidateOrigin {
  readonly candidateKey: string;
  readonly subject: string;
  readonly performanceType: LearnerPerformanceType;
  readonly curriculumUnitId: string;
  readonly normalizationKind: CurriculumNormalizationKind;
  readonly originKind: OriginKind;
  readonly originRangeGroupId?: string;
  readonly refinesSubject?: string;
  readonly evidenceId: string;
}
const candidateOrigins: CandidateOrigin[] = [];
const candidateSubjects = new Set<string>();

function addCurriculumCandidate(opts: {
  ac: RawAC;
  subject: string;
  performanceType: LearnerPerformanceType;
  confidence: NormalizationConfidence;
  rawVerb: string;
  normalizationKind: CurriculumNormalizationKind;
  originKind: OriginKind;
  originRangeGroupId?: string;
  fragments: SourceFragment[];
  rationale: string;
  refinesSubject?: string;
  breadthStatus?: "ENUMERATED_COMPLETE" | "OPEN_OR_UNDERSPECIFIED" | "UNKNOWN";
  structuralReviewNote?: string;
}) {
  const { ac, subject, performanceType, confidence, normalizationKind, originKind, originRangeGroupId, fragments, rationale, refinesSubject, breadthStatus, structuralReviewNote } = opts;
  candidateSubjects.add(subject);

  const evidenceId = nextEvidenceId("CUR");
  const record: CurriculumEvidence = {
    role: "OFFICIAL_CURRICULUM",
    evidenceId,
    qualificationId: QUALIFICATION_ID,
    curriculumUnitId: ac.id,
    subject,
    normalizationKind,
    commandVerbPerformanceType: performanceType,
    sourceRef: HANDBOOK_SOURCE_REF,
    sourceLocator: acLocator(ac),
    normalizationBasis: normalizationKind === "RANGE_REQUIRED_MEMBER" ? "EXPLICIT_RANGE_STRUCTURE" : normalizationKind === "RANGE_CATEGORY" ? "EXPLICIT_RANGE_STRUCTURE" : "EXPLICIT_CURRICULUM_WORDING",
    ...(refinesSubject ? { refinesSubject } : {}),
    ...(normalizationKind === "RANGE_CATEGORY" ? { breadthStatus: breadthStatus ?? "UNKNOWN" } : {}),
  };

  candidateOrigins.push({
    candidateKey: candidateKey(subject, performanceType),
    subject,
    performanceType,
    curriculumUnitId: ac.id,
    normalizationKind,
    originKind,
    originRangeGroupId,
    refinesSubject,
    evidenceId,
  });

  ledger.push({
    proposalId: nextId("CUR"),
    derivedCandidateKey: candidateKey(subject, performanceType),
    layerA: { sourceFragments: fragments },
    layerB: {
      genericPipelineRecordType: "CurriculumEvidence",
      normalizedRecord: record,
      normalizationConfidence: confidence,
      normalizationRationale: rationale,
      profileEligibility: ["FULL_PUBLIC", "DEGRADED_NO_ASSESSMENT"],
      structuralParentageReviewNote: structuralReviewNote,
    },
    layerC: { pipelineAcceptance: "NOT_RUN_CC19R1" },
  });
}

// ---------------------------------------------------------------------
// Expand curriculum candidates from ASSESSMENT_CRITERIA
// ---------------------------------------------------------------------
for (const ac of ASSESSMENT_CRITERIA) {
  const acWordingFragment = (fragmentRole: string): SourceFragment => ({ sourceRef: HANDBOOK_SOURCE_REF, sourceLocator: acLocator(ac), sourceExcerpt: ac.wording, fragmentRole });

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
        originKind: "AC_PARENT",
        fragments: [acWordingFragment("command verb + primary subject wording")],
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
        originKind: "EXPLICIT_CHILD",
        fragments: [acWordingFragment("command verb"), { sourceRef: HANDBOOK_SOURCE_REF, sourceLocator: acLocator(ac), sourceExcerpt: child.rawWording, fragmentRole: "explicit named sub-content (verbatim substring of the AC wording above)" }],
        rationale: `${perf.rationale} Explicit named sub-content within the same AC clause (CC-19R section 13).${child.structuralReviewNote ? " " + child.structuralReviewNote : ""}`,
        structuralReviewNote: child.structuralReviewNote,
      });
    }
  }

  // 3. Range groups: RANGE_CATEGORY + RANGE_REQUIRED_MEMBER children
  (ac.rangeGroups ?? []).forEach((group, groupIndex) => {
    const rangeGroupId = `${ac.id}::group${groupIndex}`;
    const categoryFragment: SourceFragment = { sourceRef: HANDBOOK_SOURCE_REF, sourceLocator: `Page ${group.pageRef}, Range under ${ac.id}`, sourceExcerpt: group.categoryLabel, fragmentRole: "Range category heading (verbatim)" };
    const categoryPerformances = group.memberPerformances ?? ac.performances;
    for (const perf of categoryPerformances) {
      addCurriculumCandidate({
        ac,
        subject: group.categorySubject,
        performanceType: perf.mapped,
        confidence: perf.confidence,
        rawVerb: perf.rawVerb,
        normalizationKind: "RANGE_CATEGORY",
        originKind: "RANGE_CATEGORY",
        originRangeGroupId: rangeGroupId,
        fragments: [acWordingFragment("command verb"), categoryFragment],
        rationale: `${perf.rationale} Range category header (page ${group.pageRef}) ${group.coincidesWithParentSubject ? "coincides with the AC's own explicit subject wording" : "enumerates the sub-scope this AC's performance applies across"}.`,
        breadthStatus: group.breadthStatus,
      });
    }

    for (const member of group.members) {
      const memberPerformances = group.memberPerformances ?? ac.performances;
      const memberFragment: SourceFragment = { sourceRef: HANDBOOK_SOURCE_REF, sourceLocator: `Page ${group.pageRef}, Range "${group.categoryLabel}" under ${ac.id}`, sourceExcerpt: member.raw, fragmentRole: "Range member (verbatim, as printed)" };
      for (const perf of memberPerformances) {
        addCurriculumCandidate({
          ac,
          subject: member.subject,
          performanceType: perf.mapped,
          confidence: "STRONG_INFERENCE",
          rawVerb: perf.rawVerb,
          normalizationKind: "RANGE_REQUIRED_MEMBER",
          originKind: "RANGE_MEMBER",
          originRangeGroupId: rangeGroupId,
          fragments: [acWordingFragment("command verb (inherited)"), memberFragment],
          rationale: `CC-19R section 12: Range member "${member.raw}" has no independent command verb -- membership is literal (EXPLICIT_RANGE_STRUCTURE) but the inherited performance mapping ${perf.mapped} is STRONG_INFERENCE, not EXPLICIT.${member.structuralReviewNote ? " " + member.structuralReviewNote : ""}`,
          refinesSubject: group.refinesSubject,
          structuralReviewNote: member.structuralReviewNote,
        });
      }
    }
  });
}

// ---------------------------------------------------------------------
// Parent-integrity validation (CC-19R section 14)
// ---------------------------------------------------------------------
const unresolvedParents: string[] = [];
for (const o of candidateOrigins) {
  if (o.normalizationKind === "RANGE_REQUIRED_MEMBER" && o.refinesSubject) {
    if (!candidateSubjects.has(o.refinesSubject)) {
      unresolvedParents.push(`${o.candidateKey}: refinesSubject "${o.refinesSubject}" does not resolve to any generated candidate subject`);
    }
  }
}
if (unresolvedParents.length > 0) {
  throw new Error(`CC-19R1 parent-integrity violation (section 14):\n${unresolvedParents.join("\n")}`);
}

// ---------------------------------------------------------------------
// OfficialCurriculumUnit registry (CC-19R1 DEFECT A) -- required
// StandardPipelineInput field CC-19R omitted entirely.
// ---------------------------------------------------------------------
for (const unit of OFFICIAL_CURRICULUM_UNITS) {
  const isLo = !unit.parentCurriculumUnitId;
  ledger.push({
    proposalId: nextId("OCU"),
    layerA: {
      sourceFragments: [{ sourceRef: unit.sourceRef, sourceLocator: unit.sourceLocator, sourceExcerpt: unit.officialWording, fragmentRole: isLo ? "Learning Outcome wording (verbatim)" : "Assessment Criterion wording (verbatim)" }],
    },
    layerB: {
      genericPipelineRecordType: "OfficialCurriculumUnit",
      normalizedRecord: unit,
      normalizationConfidence: "EXPLICIT",
      normalizationRationale: "Mechanical registry entry -- verbatim official curriculum-unit identity (CC-19R1 DEFECT-A fix; StandardPipelineInput.officialCurriculumUnits was omitted entirely by CC-19R).",
      profileEligibility: ["FULL_PUBLIC", "DEGRADED_NO_ASSESSMENT"],
    },
    layerC: { pipelineAcceptance: "NOT_RUN_CC19R1" },
  });
}

// ---------------------------------------------------------------------
// Qualification-level evidence (CC-19R1 DEFECT A fix): the real
// `attachQualificationLevelConstraints` NEVER broadcasts -- it only
// attaches to a candidate that already exists under the EXACT key it
// names (see rules.ts). CC-19R's single "applies to all" sentinel was
// not valid production input. Same semantic content (Level 2 constrains
// depth for every required Unit 202 candidate, per CC-19R section 17) is
// now represented as one QualificationLevelEvidence record per (level
// descriptor, required candidate) pair -- a mechanical fan-out, not a
// new semantic claim.
// ---------------------------------------------------------------------
const LEVEL_DESCRIPTORS: readonly { readonly id: string; readonly text: string; readonly column: string }[] = [
  { id: "knowledge", text: OFQUAL_LEVEL_2_KNOWLEDGE_DESCRIPTOR, column: "knowledge/understanding column" },
  { id: "skills", text: OFQUAL_LEVEL_2_SKILLS_DESCRIPTOR, column: "skills column" },
];
for (const descriptor of LEVEL_DESCRIPTORS) {
  for (const origin of candidateOrigins) {
    const evidenceId = nextEvidenceId("QLV");
    const record: QualificationLevelEvidence = {
      role: "QUALIFICATION_LEVEL",
      evidenceId,
      qualificationId: QUALIFICATION_ID,
      levelId: "Level 2",
      sourceRef: OFQUAL_SOURCE_REF,
      sourceLocator: `Level descriptors table, Level 2 row, ${descriptor.column} (page last updated ${OFQUAL_PAGE_LAST_UPDATED})`,
      normalizationBasis: "QUALIFICATION_LEVEL_DESCRIPTOR",
      depthConstraintDescriptor: descriptor.text,
      appliesToCandidateKey: origin.candidateKey,
    };
    ledger.push({
      proposalId: nextId("QLV"),
      derivedCandidateKey: origin.candidateKey,
      layerA: { sourceFragments: [{ sourceRef: OFQUAL_SOURCE_REF, sourceLocator: record.sourceLocator, sourceExcerpt: descriptor.text, fragmentRole: `Level 2 ${descriptor.id} descriptor (verbatim)` }] },
      layerB: {
        genericPipelineRecordType: "QualificationLevelEvidence",
        normalizedRecord: record,
        normalizationConfidence: "EXPLICIT",
        normalizationRationale: `CC-19R1 fan-out: the Level 2 ${descriptor.id} descriptor applies as a depth constraint to every required Unit 202 candidate (unchanged semantic content from CC-19R section 17) -- represented per-candidate because attachQualificationLevelConstraints only ever matches one exact appliesToCandidateKey and never broadcasts.`,
        profileEligibility: ["FULL_PUBLIC", "DEGRADED_NO_ASSESSMENT"],
      },
      layerC: { pipelineAcceptance: "NOT_RUN_CC19R1" },
    });
  }
}

// ---------------------------------------------------------------------
// Fact requirements: EXPLICIT_CURRICULUM_FACT + REVIEW_PROPOSED.
// sourceEvidenceRefs now populated from the real CurriculumEvidence
// evidenceId(s) of the target candidate (CC-19R1 DEFECT A fix -- the
// field is mandatory on CandidateFactRequirement and CC-19R never set it).
// ---------------------------------------------------------------------
const acById = new Map(ASSESSMENT_CRITERIA.map((ac) => [ac.id, ac] as const));
const missingFactTargets: string[] = [];
type FactSourceKind = { readonly targetSubject: string; readonly targetPerformanceType: LearnerPerformanceType; readonly claimKey: string; readonly parentAcId: string; readonly necessityRationale?: string; readonly technicalClaimKey?: string };

function evidenceIdsFor(subject: string, performanceType: LearnerPerformanceType): string[] {
  return candidateOrigins.filter((o) => o.subject === subject && o.performanceType === performanceType).map((o) => o.evidenceId);
}

function pushFactRequirement(fact: FactSourceKind, derivationStatus: "EXPLICIT_CURRICULUM_FACT" | "REVIEW_PROPOSED") {
  const key = candidateKey(fact.targetSubject, fact.targetPerformanceType);
  const evidenceIds = evidenceIdsFor(fact.targetSubject, fact.targetPerformanceType);
  if (evidenceIds.length === 0) missingFactTargets.push(`${derivationStatus} fact ${fact.claimKey} -> missing candidate ${key}`);
  const ac = acById.get(fact.parentAcId);
  if (!ac) throw new Error(`Unknown parentAcId ${fact.parentAcId}`);
  const techClaim = TECHNICAL_CLAIMS.find((c) => c.claimKey === fact.technicalClaimKey);

  const record: CandidateFactRequirement = {
    qualificationId: QUALIFICATION_ID,
    targetCandidateKey: key,
    claimKey: fact.claimKey,
    derivationStatus,
    sourceRef: HANDBOOK_SOURCE_REF,
    sourceLocator: acLocator(ac),
    normalizationBasis: "FACT_REQUIREMENT_DERIVATION",
    sourceEvidenceRefs: evidenceIds.map((evidenceId) => ({ role: "OFFICIAL_CURRICULUM" as const, evidenceId })),
  };

  ledger.push({
    proposalId: nextId("FCT"),
    derivedCandidateKey: key,
    layerA: { sourceFragments: [{ sourceRef: HANDBOOK_SOURCE_REF, sourceLocator: acLocator(ac), sourceExcerpt: ac.wording, fragmentRole: "AC wording creating the parent performance" }] },
    layerB: {
      genericPipelineRecordType: "CandidateFactRequirement",
      normalizedRecord: record,
      normalizationConfidence: derivationStatus === "EXPLICIT_CURRICULUM_FACT" ? "EXPLICIT" : "REVIEW_PROPOSED",
      normalizationRationale:
        derivationStatus === "EXPLICIT_CURRICULUM_FACT"
          ? `CC-19R section 18: ${fact.parentAcId} explicitly requires identifying/using/determining the applicable SI unit -- atomic fact requirement derived directly from validated OFFICIAL_CURRICULUM evidence.`
          : `${fact.necessityRationale ?? ""} CC-19R section 21: exported for Project-Architect review; MUST NOT auto-govern or contribute to requiredFactKeys automatically.`,
      profileEligibility: ["FULL_PUBLIC", "DEGRADED_NO_ASSESSMENT"],
    },
    layerC: { pipelineAcceptance: "NOT_RUN_CC19R1" },
  });

  return { targetSubject: fact.targetSubject, techClaimKey: fact.technicalClaimKey, hasClaim: Boolean(techClaim) };
}

// dynamic SourceFactualClaim emission -- one record per DISTINCT (technicalClaimKey, targetSubject) pair
const claimSubjectPairs = new Map<string, { claimKey: string; subject: string }>();

for (const fact of EXPLICIT_FACT_REQUIREMENTS) {
  pushFactRequirement(fact as FactSourceKind, "EXPLICIT_CURRICULUM_FACT");
  claimSubjectPairs.set(`${fact.claimKey}::${fact.targetSubject}`, { claimKey: fact.claimKey, subject: fact.targetSubject });
}
for (const fact of REVIEW_FACT_PROPOSALS) {
  pushFactRequirement(fact as FactSourceKind, "REVIEW_PROPOSED");
  if (fact.technicalClaimKey) claimSubjectPairs.set(`${fact.technicalClaimKey}::${fact.targetSubject}`, { claimKey: fact.technicalClaimKey, subject: fact.targetSubject });
}

if (missingFactTargets.length > 0) {
  throw new Error(`CC-19R1 fact-requirement target resolution failure:\n${missingFactTargets.join("\n")}`);
}

// ---------------------------------------------------------------------
// SourceFactualClaim (technical truth) -- CC-19R1 DEFECT A fix: emitted
// per (claimKey, targetSubject) pair because attachFactualClaims matches
// on BOTH claimKey AND exact subject equality, and normalizationBasis is
// now "AUTHORITATIVE_TECHNICAL_FACT" (CC-19R incorrectly used
// "SOURCE_FACTUAL_CLAIM", which is reserved for non-TECHNICAL_TRUTH
// sourceRole claims -- see rules.ts validateFactualClaims).
// ---------------------------------------------------------------------
const missingTechnicalClaims: string[] = [];
for (const { claimKey: techClaimKey, subject } of claimSubjectPairs.values()) {
  const claim = TECHNICAL_CLAIMS.find((c) => c.claimKey === techClaimKey);
  if (!claim) {
    missingTechnicalClaims.push(`${techClaimKey} referenced for subject "${subject}" has no TECHNICAL_CLAIMS entry`);
    continue;
  }
  const evidenceId = nextEvidenceId("TEC");
  const record: SourceFactualClaim = {
    claimKey: claim.claimKey,
    subject,
    sourceRole: "TECHNICAL_TRUTH",
    evidenceId,
    sourceRef: claim.sourceRef,
    sourceLocator: claim.sourceLocator,
    normalizationBasis: "AUTHORITATIVE_TECHNICAL_FACT",
    normalizedClaimValue: claim.normalizedClaimValue,
    comparisonKind: claim.comparisonKind,
  };
  ledger.push({
    proposalId: nextId("TEC"),
    derivedCandidateKey: undefined,
    layerA: { sourceFragments: [{ sourceRef: claim.sourceRef, sourceLocator: claim.sourceLocator, sourceExcerpt: claim.sourceExcerpt, fragmentRole: "technical-truth source excerpt (verbatim)" }] },
    layerB: {
      genericPipelineRecordType: "SourceFactualClaim",
      normalizedRecord: record,
      normalizationConfidence: "EXPLICIT",
      normalizationRationale: `Independently researched technical-truth source (CC-19R section 4/22/23), attached to subject "${subject}" for exact-match with attachFactualClaims. Source quality: ${claim.sourceQuality}`,
      profileEligibility: ["FULL_PUBLIC", "DEGRADED_NO_ASSESSMENT"],
    },
    layerC: { pipelineAcceptance: "NOT_RUN_CC19R1" },
  });
}
if (missingTechnicalClaims.length > 0) {
  throw new Error(`CC-19R1 technical-claim reference failure:\n${missingTechnicalClaims.join("\n")}`);
}

// ---------------------------------------------------------------------
// DecompositionAttempt (CC-19R1 section 7-10): every one of the 140
// CurriculumEvidence candidates gets exactly one attempt record.
// ---------------------------------------------------------------------
type DecompositionStatus = "EXPLICITLY_ATOMIC" | "REVIEW_DECOMPOSED" | "UNRESOLVED_DECOMPOSITION";

interface DecompositionAttempt {
  readonly candidateKey: string;
  readonly curriculumUnitId: string;
  readonly decompositionAttempted: true;
  readonly status: DecompositionStatus;
  readonly explicitFactRequirementKeys: readonly string[];
  readonly reviewFactRequirementKeys: readonly string[];
  readonly coveredByChildCandidateKeys: readonly string[];
  readonly attemptRationale: string;
  readonly unresolvedReason?: string;
}

const explicitFactsByCandidate = new Map<string, string[]>();
for (const f of EXPLICIT_FACT_REQUIREMENTS) {
  const key = candidateKey(f.targetSubject, f.targetPerformanceType);
  explicitFactsByCandidate.set(key, [...(explicitFactsByCandidate.get(key) ?? []), f.claimKey]);
}
const reviewFactsByCandidate = new Map<string, string[]>();
for (const f of REVIEW_FACT_PROPOSALS) {
  const key = candidateKey(f.targetSubject, f.targetPerformanceType);
  reviewFactsByCandidate.set(key, [...(reviewFactsByCandidate.get(key) ?? []), f.claimKey]);
}
const atomicByDesign = new Map(ATOMIC_BY_DESIGN_SUBJECTS.map((a) => [candidateKey(a.subject, a.performanceType), a.rationale] as const));
const genuinelyUnresolved = new Map(GENUINELY_UNRESOLVED_SUBJECTS.map((u) => [candidateKey(u.subject, u.performanceType), u.unresolvedReason] as const));

function computeCoveredByChildren(origin: CandidateOrigin): string[] {
  const direct = candidateOrigins.filter((o) => o.refinesSubject === origin.subject).map((o) => o.candidateKey);
  const explicitChildSiblings =
    origin.originKind === "AC_PARENT" ? candidateOrigins.filter((o) => o.curriculumUnitId === origin.curriculumUnitId && o.originKind === "EXPLICIT_CHILD").map((o) => o.candidateKey) : [];
  const rangeGroupSiblings =
    origin.originKind === "RANGE_CATEGORY" && origin.originRangeGroupId
      ? candidateOrigins.filter((o) => o.originRangeGroupId === origin.originRangeGroupId && o.originKind === "RANGE_MEMBER").map((o) => o.candidateKey)
      : [];
  return [...new Set([...direct, ...explicitChildSiblings, ...rangeGroupSiblings])];
}

const decompositionAttempts: DecompositionAttempt[] = candidateOrigins.map((origin) => {
  const explicitKeys = explicitFactsByCandidate.get(origin.candidateKey) ?? [];
  const reviewKeys = reviewFactsByCandidate.get(origin.candidateKey) ?? [];
  const children = computeCoveredByChildren(origin);
  const atomicRationale = atomicByDesign.get(origin.candidateKey);
  const unresolvedReason = genuinelyUnresolved.get(origin.candidateKey);

  let status: DecompositionStatus;
  let attemptRationale: string;

  if (explicitKeys.length > 0) {
    status = "EXPLICITLY_ATOMIC";
    attemptRationale = `Explicit curriculum wording (${origin.curriculumUnitId}) directly requires this atomic fact -- source wording is already atomic enough (CC-19R1 section 9.A).`;
  } else if (atomicRationale) {
    status = "EXPLICITLY_ATOMIC";
    attemptRationale = atomicRationale;
  } else if (reviewKeys.length > 0) {
    status = "REVIEW_DECOMPOSED";
    attemptRationale = `Minimal knowledge propositions defensibly proposed (CC-19R1 section 9.B) -- see reviewFactRequirementKeys.${children.length > 0 ? " Also structurally decomposed via child candidates." : ""}`;
  } else if (children.length > 0) {
    status = "REVIEW_DECOMPOSED";
    attemptRationale = `Structural parent/category: scope is decomposed into explicit required child candidates (see coveredByChildCandidateKeys) rather than independent atomic facts on this candidate itself (CC-19R1 section 8).`;
  } else if (unresolvedReason) {
    status = "UNRESOLVED_DECOMPOSITION";
    attemptRationale = "Considered and evaluated against sections 9.A/9.B; neither an atomic reading nor a defensible minimal proposition could be safely established from currently accessible evidence -- see unresolvedReason.";
  } else {
    // Should not happen once all 140 are accounted for; fail loudly rather than silently mis-classify.
    throw new Error(`CC-19R1: candidate ${origin.candidateKey} (${origin.curriculumUnitId}) has no explicit fact, review fact, child coverage, atomic-by-design entry, or unresolved-reason entry -- decomposition attempt incomplete.`);
  }

  return {
    candidateKey: origin.candidateKey,
    curriculumUnitId: origin.curriculumUnitId,
    decompositionAttempted: true,
    status,
    explicitFactRequirementKeys: explicitKeys,
    reviewFactRequirementKeys: reviewKeys,
    coveredByChildCandidateKeys: children,
    attemptRationale,
    ...(unresolvedReason && status === "UNRESOLVED_DECOMPOSITION" ? { unresolvedReason } : {}),
  };
});

// Forbidden execution/time-based unresolvedReason phrases (CC-19R1 section 10/20)
const FORBIDDEN_REASON_PHRASES = ["not researched this session", "not enough time", "curated subset", "not attempted", "ran out of time"];
for (const attempt of decompositionAttempts) {
  if (attempt.status !== "UNRESOLVED_DECOMPOSITION") continue;
  const reason = (attempt.unresolvedReason ?? "").toLowerCase();
  for (const phrase of FORBIDDEN_REASON_PHRASES) {
    if (reason.includes(phrase)) {
      throw new Error(`CC-19R1 section 10 violation: unresolvedReason for ${attempt.candidateKey} contains forbidden execution/time-based phrase "${phrase}".`);
    }
  }
}

const decompositionCoverage = {
  generatedBy: "CC-19R1 clean-room build-ledger.ts (supersedes CC-19R)",
  totalCandidates: decompositionAttempts.length,
  attemptedCount: decompositionAttempts.filter((a) => a.decompositionAttempted).length,
  statusCounts: {
    EXPLICITLY_ATOMIC: decompositionAttempts.filter((a) => a.status === "EXPLICITLY_ATOMIC").length,
    REVIEW_DECOMPOSED: decompositionAttempts.filter((a) => a.status === "REVIEW_DECOMPOSED").length,
    UNRESOLVED_DECOMPOSITION: decompositionAttempts.filter((a) => a.status === "UNRESOLVED_DECOMPOSITION").length,
  },
  structurallyCoveredByChildrenCount: decompositionAttempts.filter((a) => a.coveredByChildCandidateKeys.length > 0).length,
  explicitFactRequirementCount: EXPLICIT_FACT_REQUIREMENTS.length,
  reviewFactRequirementCount: REVIEW_FACT_PROPOSALS.length,
  technicallySourcedFactCount: [...claimSubjectPairs.values()].length,
  technicalTruthGapCount: [...new Set(REVIEW_FACT_PROPOSALS.filter((f) => !f.technicalClaimKey).map((f) => `${f.claimKey}::${f.targetSubject}`))].length,
  byAc: ASSESSMENT_CRITERIA.map((ac) => {
    const rows = decompositionAttempts.filter((a) => a.curriculumUnitId === ac.id);
    return {
      acId: ac.id,
      acWording: ac.wording,
      candidateCount: rows.length,
      explicitlyAtomic: rows.filter((r) => r.status === "EXPLICITLY_ATOMIC").length,
      reviewDecomposed: rows.filter((r) => r.status === "REVIEW_DECOMPOSED").length,
      unresolved: rows.filter((r) => r.status === "UNRESOLVED_DECOMPOSITION").length,
      candidates: rows,
    };
  }),
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
  generatedBy: "CC-19R1 clean-room build-ledger.ts (supersedes CC-19R)",
  recordCount: ledger.length,
  records: ledger,
});

writeJson("cc19r-decomposition-coverage.json", decompositionCoverage);

const sourceInventory = {
  qualificationId: QUALIFICATION_ID,
  officialCurriculum: [{ sourceRef: HANDBOOK_SOURCE_REF, url: "https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/centre_documents/2365-02_l2_electrical_installation_qualification_handbook_v1-12-pdf.pdf", version: "v1-12" }],
  publicAssessment: {
    landingPageUrl: "https://www.cityandguilds.com/qualifications-and-apprenticeships/building-services-industry/electrical-installation/2365-electrotechnical-craft",
    sampleQuestionsDocument: {
      title: "5357 and 2365 Sample Papers v1-2",
      url: "https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/assessment_materials/sample_assessment/5357-and-2365-sample-papers-v1-2-pdf.pdf",
      status: "RAW_SOURCE_UNAVAILABLE",
      reason:
        "Unchanged from CC-19R (task section 17: public-assessment status must not change): downloaded from the current official landing page (and independently re-confirmed byte-identical via the Level 3 landing page's own copy). The file is password-protected. No bypass, leaked copy, or private material was sought this session (CC-19R1 section 17 explicitly forbids this) -- no content from this file was read or used as evidence.",
    },
    markScheme: {
      title: "5357 and 2365 Sample Papers - Mark schemes v1-0",
      url: "https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/assessment_materials/sample_assessment/5357-and-2365-sample-papers---mark-schemes-v1-0-pdf.pdf",
      status: "ACCESSED_BUT_INSUFFICIENT",
      reason: "Unchanged from CC-19R: contains only question-number-to-answer-letter keys, no question stems/content -- cannot support AssessmentEvidence records.",
    },
  },
  qualificationLevel: [{ sourceRef: OFQUAL_SOURCE_REF, url: OFQUAL_SOURCE_URL, pageLastUpdated: OFQUAL_PAGE_LAST_UPDATED }],
  technicalTruth: TECHNICAL_CLAIMS.map((c) => ({ claimKey: c.claimKey, sourceRef: c.sourceRef, sourceLocator: c.sourceLocator })),
  profileImpact: {
    note: "FULL_PUBLIC and DEGRADED_NO_ASSESSMENT remain IDENTICAL in CC-19R1 (unchanged from CC-19R): AssessmentEvidence count is 0, so mechanically filtering out PUBLIC_ASSESSMENT evidence removes nothing. Per CC-19R1 section 17, no aggressive search for an alternative was performed merely to make the two profiles differ -- this is an honest, preserved limitation.",
  },
  cc19r1Corrections: {
    note: "Interface/schema corrections applied to CC-19R's source representation (task section 3-15) -- no new evidential sources beyond the 25 technical-truth sources already logged, plus additional technical-truth research completing the decomposition attempt (see CC-19R-SOURCE-ACCESS-LOG.json entries logged under this session).",
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
ledgerMdLines.push(`# CC-19R1 Normalization Ledger -- Unit 202 Principles of Electrical Science`, "");
ledgerMdLines.push(
  `Clean-room proposal ledger (supersedes CC-19R's serialization/provenance representation; same clean-room experimental lineage, branch cc19-cleanroom, parent commit 20d65c6). Every record: RAW SOURCE -> NORMALIZED REQUIRED CONTENT / REVIEW-PROPOSED KNOWLEDGE / TECHNICAL TRUTH -> pipelineAcceptance = NOT_RUN_CC19R1.`,
  "",
  `Layer-B normalizedRecord values are now typed against the real @alp/qualification-pipeline production interfaces (CurriculumEvidence, OfficialCurriculumUnit, QualificationLevelEvidence, CandidateFactRequirement, SourceFactualClaim) -- see build-ledger.test.ts for the compile-time compatibility proof.`,
  "",
  `Qualification-level evidence (${LEARNING_OUTCOMES.length > 0 ? "2 descriptors" : ""}) is mechanically fanned out to one record per required candidate (see section "Qualification-level evidence" below) -- summarised, not listed record-by-record, to keep this report readable.`,
  "",
);

for (const lo of LEARNING_OUTCOMES) {
  ledgerMdLines.push(`## ${lo.id}: ${lo.wording}`, "");
  const acsForLo = ASSESSMENT_CRITERIA.filter((ac) => ac.loId === lo.id);
  for (const ac of acsForLo) {
    ledgerMdLines.push(`### ${ac.id}`, "", `**RAW SOURCE (AC wording, page ${ac.pageRef}):** "${mdEscape(ac.wording)}"`, "");
    const relatedCurriculum = ledger.filter((e) => e.layerB.genericPipelineRecordType === "CurriculumEvidence" && (e.layerB.normalizedRecord as CurriculumEvidence).curriculumUnitId === ac.id);
    ledgerMdLines.push(`**NORMALIZED REQUIRED CONTENT:**`, "");
    ledgerMdLines.push(`| Candidate | Kind | Performance | Confidence | Refines |`, `|---|---|---|---|---|`);
    for (const e of relatedCurriculum) {
      const rec = e.layerB.normalizedRecord as CurriculumEvidence;
      ledgerMdLines.push(`| ${mdEscape(rec.subject)} | ${rec.normalizationKind} | ${rec.commandVerbPerformanceType} | ${e.layerB.normalizationConfidence} | ${rec.refinesSubject ? mdEscape(rec.refinesSubject) : "-"} |`);
    }
    ledgerMdLines.push("");

    const relatedKeys = new Set(relatedCurriculum.map((c) => (c.layerB.normalizedRecord as CurriculumEvidence).evidenceId));
    const relatedExplicitFacts = ledger.filter((e) => {
      if (e.layerB.genericPipelineRecordType !== "CandidateFactRequirement") return false;
      const rec = e.layerB.normalizedRecord as CandidateFactRequirement;
      return rec.derivationStatus === "EXPLICIT_CURRICULUM_FACT" && rec.sourceEvidenceRefs.some((r) => relatedKeys.has(r.evidenceId));
    });
    if (relatedExplicitFacts.length > 0) {
      ledgerMdLines.push(`**EXPLICIT FACT REQUIREMENTS:**`, "");
      for (const e of relatedExplicitFacts) {
        const rec = e.layerB.normalizedRecord as CandidateFactRequirement;
        const claimEntry = ledger.find((c) => c.layerB.genericPipelineRecordType === "SourceFactualClaim" && (c.layerB.normalizedRecord as SourceFactualClaim).claimKey === rec.claimKey);
        const claim = claimEntry ? (claimEntry.layerB.normalizedRecord as SourceFactualClaim) : undefined;
        ledgerMdLines.push(`- \`${rec.claimKey}\` on ${mdEscape(rec.targetCandidateKey)}${claim ? ` -- **TECHNICAL TRUTH:** ${mdEscape(claim.normalizedClaimValue)} (${mdEscape(claim.sourceRef)})` : " -- **UNRESOLVED** (no technical claim)"}`);
      }
      ledgerMdLines.push("");
    }

    const relatedReviewFacts = ledger.filter((e) => {
      if (e.layerB.genericPipelineRecordType !== "CandidateFactRequirement") return false;
      const rec = e.layerB.normalizedRecord as CandidateFactRequirement;
      if (rec.derivationStatus !== "REVIEW_PROPOSED") return false;
      return relatedCurriculum.some((c) => (c.layerB.normalizedRecord as CurriculumEvidence).subject === candidateSubjectOf(rec.targetCandidateKey));
    });
    if (relatedReviewFacts.length > 0) {
      ledgerMdLines.push(`**REVIEW-PROPOSED KNOWLEDGE (does not auto-govern):**`, "");
      for (const e of relatedReviewFacts) {
        const rec = e.layerB.normalizedRecord as CandidateFactRequirement;
        const claimEntry = ledger.find((c) => c.layerB.genericPipelineRecordType === "SourceFactualClaim" && (c.layerB.normalizedRecord as SourceFactualClaim).claimKey === rec.claimKey);
        const claim = claimEntry ? (claimEntry.layerB.normalizedRecord as SourceFactualClaim) : undefined;
        ledgerMdLines.push(`- \`${rec.claimKey}\` on ${mdEscape(rec.targetCandidateKey)}: ${mdEscape(e.layerB.normalizationRationale)}`);
        if (claim) ledgerMdLines.push(`  - **TECHNICAL TRUTH:** ${mdEscape(claim.normalizedClaimValue)} (${mdEscape(claim.sourceRef)})`);
        else ledgerMdLines.push(`  - **TECHNICAL_TRUTH_GAP:** fact proposed, no technical source meeting the CC-19R section 23 quality hierarchy found`);
      }
      ledgerMdLines.push("");
    }
  }
}

function candidateSubjectOf(key: string): string {
  const idx = key.lastIndexOf("::");
  return idx === -1 ? key : key.slice(0, idx);
}

ledgerMdLines.push(`## Qualification-level evidence`, "");
ledgerMdLines.push(
  `${LEVEL_DESCRIPTORS.length} descriptor(s) x ${candidateOrigins.length} required candidates = ${LEVEL_DESCRIPTORS.length * candidateOrigins.length} QualificationLevelEvidence records (see cc19r-normalization-ledger.json for the full per-candidate list). Depth constraint only, never scope (CC-19R section 17).`,
  "",
);
for (const d of LEVEL_DESCRIPTORS) {
  ledgerMdLines.push(`- **${d.id}:** "${mdEscape(d.text)}"`);
}
ledgerMdLines.push("");

ledgerMdLines.push(`## Official curriculum-unit registry`, "");
ledgerMdLines.push(`${OFFICIAL_CURRICULUM_UNITS.length} entries (${LEARNING_OUTCOMES.length} Learning Outcomes + ${ASSESSMENT_CRITERIA.length} Assessment Criteria), verbatim official wording -- CC-19R1 DEFECT-A fix.`, "");

writeFileSync(path.join(outDir, "CC-19R-NORMALIZATION-LEDGER.md"), ledgerMdLines.join("\n").trimEnd() + "\n", "utf-8");

const coverageMdLines: string[] = [];
coverageMdLines.push(`# CC-19R1 Decomposition Coverage Report`, "");
coverageMdLines.push(
  `Total candidates: ${decompositionCoverage.totalCandidates}. Attempted: ${decompositionCoverage.attemptedCount} (invariant: attempted === total). EXPLICITLY_ATOMIC: ${decompositionCoverage.statusCounts.EXPLICITLY_ATOMIC}. REVIEW_DECOMPOSED: ${decompositionCoverage.statusCounts.REVIEW_DECOMPOSED}. UNRESOLVED_DECOMPOSITION: ${decompositionCoverage.statusCounts.UNRESOLVED_DECOMPOSITION}.`,
  "",
  `Structurally covered by children: ${decompositionCoverage.structurallyCoveredByChildrenCount}. Explicit fact requirements: ${decompositionCoverage.explicitFactRequirementCount}. Review-proposed fact requirements: ${decompositionCoverage.reviewFactRequirementCount}. Technically sourced facts: ${decompositionCoverage.technicallySourcedFactCount}. Technical-truth gaps: ${decompositionCoverage.technicalTruthGapCount}.`,
  "",
);
for (const row of decompositionCoverage.byAc) {
  coverageMdLines.push(`## ${row.acId} (${row.candidateCount} candidates)`, "", `"${mdEscape(row.acWording)}"`, "");
  coverageMdLines.push(`Explicitly atomic: ${row.explicitlyAtomic} | Review-decomposed: ${row.reviewDecomposed} | Unresolved: ${row.unresolved}`, "");
  coverageMdLines.push(`| Candidate key | Status | Explicit facts | Review facts | Covered by children | Rationale |`, `|---|---|---|---|---|---|`);
  for (const c of row.candidates) {
    coverageMdLines.push(
      `| ${mdEscape(c.candidateKey)} | ${c.status} | ${c.explicitFactRequirementKeys.length} | ${c.reviewFactRequirementKeys.length} | ${c.coveredByChildCandidateKeys.length} | ${mdEscape(c.attemptRationale)}${c.unresolvedReason ? " " + mdEscape(c.unresolvedReason) : ""} |`,
    );
  }
  coverageMdLines.push("");
}
writeFileSync(path.join(outDir, "CC-19R-DECOMPOSITION-COVERAGE.md"), coverageMdLines.join("\n").trimEnd() + "\n", "utf-8");

console.log(`CC-19R1 ledger built: ${ledger.length} records, ${candidateOrigins.length} curriculum candidates.`);
console.log(`Decomposition: EXPLICITLY_ATOMIC=${decompositionCoverage.statusCounts.EXPLICITLY_ATOMIC} REVIEW_DECOMPOSED=${decompositionCoverage.statusCounts.REVIEW_DECOMPOSED} UNRESOLVED=${decompositionCoverage.statusCounts.UNRESOLVED_DECOMPOSITION}`);

export { ledger, decompositionCoverage, decompositionAttempts, candidateOrigins, outDir, QUALIFICATION_ID };
