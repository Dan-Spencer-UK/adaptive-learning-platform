/**
 * CC-18/CC-18A/CC-18B/CC-18C: generic qualification knowledge-
 * construction pipeline -- rules.
 *
 * Pure, deterministic functions only. No network, no clock, no RNG, no
 * model calls. Production logic in this file may never inspect a
 * specific subject string (a real qualification, AC, Range item or
 * topic name) -- verified mechanically by rules.test.ts's own source
 * scan.
 *
 * See docs/architecture/qualification-knowledge-construction-pipeline.md
 * for the design this file implements, and types.ts's own CC-18C header
 * for the specific integrity gaps this revision closes relative to
 * CC-18B.
 */

import {
  GOVERNING_ADJUDICATION_DECISIONS,
  REQUIRED_DISPOSITIONS,
  STANDARD_MODE_CANDIDATE_ROLES,
  candidateKey,
  normalizationBasisSchema,
  unitRegistryKey,
  type AssessmentEvidence,
  type CandidateCapabilityRequirement,
  type CandidateDisposition,
  type CandidateFactRequirement,
  type ConfidenceLevel,
  type CurriculumEvidence,
  type CurriculumFamily,
  type CurriculumSubjectRelation,
  type DepthBasis,
  type DiagnosticComparisonEntry,
  type EvidenceRef,
  type EvidenceRole,
  type ExemplarEvidence,
  type GapRecord,
  type KnowledgeBoundaryCertification,
  type KnowledgeCandidate,
  type LearnerPerformanceType,
  type LegacyDiagnosticEvidence,
  type NormalizationBasis,
  type OfficialCurriculumUnit,
  type OptionalCalibrationEvidence,
  type PerformanceProvenance,
  type PrerequisiteEvidence,
  type QualificationLevelEvidence,
  type RepresentativeExemplarRecord,
  type SemanticAdjudication,
  type SemanticAdjudicationBasis,
  type SourceFactualClaim,
  type SourceProvenance,
  type StandardPipelineResult,
  type TechnicalCoverageStatus,
} from "./types.ts";
import { createHash } from "node:crypto";

// ---------------------------------------------------------------------
// Provenance gate (CC-18A section 21; CC-18B section 10 adds
// type-compatibility; CC-18C section 2 requires every rejection to be
// REPORTED, never silently dropped). An evidence record lacking valid,
// non-empty source provenance -- or carrying a normalizationBasis that
// is not semantically compatible with its own evidence type -- is
// rejected and always reported via `EVIDENCE_NORMALIZATION_REVIEW`.
// ---------------------------------------------------------------------

export function hasValidProvenance(evidence: SourceProvenance, allowedBases?: readonly NormalizationBasis[]): boolean {
  return provenanceFailureReason(evidence, allowedBases) === undefined;
}

/** Returns the exact, human-readable reason provenance validation failed, or undefined when it passes. Never silently swallowed -- every caller reports this via `provenanceReviewGap`. */
function provenanceFailureReason(evidence: SourceProvenance, allowedBases?: readonly NormalizationBasis[]): string | undefined {
  if (evidence.sourceRef.trim().length === 0) return "sourceRef is empty";
  if (evidence.sourceLocator.trim().length === 0) return "sourceLocator is empty";
  if (!normalizationBasisSchema.safeParse(evidence.normalizationBasis).success) return `normalizationBasis "${evidence.normalizationBasis}" is not a recognised governed value`;
  if (allowedBases && !allowedBases.includes(evidence.normalizationBasis)) {
    return `normalizationBasis "${evidence.normalizationBasis}" is not type-compatible for this evidence type (allowed: ${allowedBases.join(", ")})`;
  }
  return undefined;
}

/** CC-18C section 2: the uniform "rejected normalization proposal, reported not dropped" gap shape -- preserves evidence id/type and the proposal's own supplied provenance verbatim. */
function provenanceReviewGap(evidenceType: string, evidenceId: string, e: SourceProvenance, failure: string, candidateKeyValue: string, resolverRoles: readonly EvidenceRole[]): GapRecord {
  return {
    gapType: "EVIDENCE_NORMALIZATION_REVIEW",
    candidateKey: candidateKeyValue,
    evidenceAvailable: [
      `evidenceId=${evidenceId}`,
      `evidenceType=${evidenceType}`,
      `sourceRef=${JSON.stringify(e.sourceRef)}`,
      `sourceLocator=${JSON.stringify(e.sourceLocator)}`,
      `normalizationBasis=${JSON.stringify(e.normalizationBasis)}`,
    ],
    unresolved: `Provenance validation failed for ${evidenceType} "${evidenceId}": ${failure}.`,
    legitimateResolverRoles: resolverRoles,
  };
}

const CURRICULUM_ALLOWED_BASES: readonly NormalizationBasis[] = ["EXPLICIT_CURRICULUM_WORDING", "EXPLICIT_RANGE_STRUCTURE"];
const ASSESSMENT_ALLOWED_BASES: readonly NormalizationBasis[] = ["POSITIVE_ASSESSMENT_TARGET", "ASSESSMENT_CURRICULUM_MAPPING"];
const QUALIFICATION_LEVEL_ALLOWED_BASES: readonly NormalizationBasis[] = ["QUALIFICATION_LEVEL_DESCRIPTOR"];
const RELATION_ALLOWED_BASES: readonly NormalizationBasis[] = ["EXPLICIT_CURRICULUM_WORDING", "EXPLICIT_RANGE_STRUCTURE"];
const CAPABILITY_ALLOWED_BASES: readonly NormalizationBasis[] = ["CAPABILITY_DEPENDENCY_DERIVATION"];
const PREREQUISITE_ALLOWED_BASES: readonly NormalizationBasis[] = ["STRUCTURAL_PREREQUISITE_DEPENDENCY"];
const TECHNICAL_CLAIM_ALLOWED_BASES: readonly NormalizationBasis[] = ["AUTHORITATIVE_TECHNICAL_FACT"];
const CURRICULUM_CLAIM_ALLOWED_BASES: readonly NormalizationBasis[] = ["SOURCE_FACTUAL_CLAIM"];
/** CC-18C section 7: the ONLY basis a CandidateFactRequirement may declare -- never AUTHORITATIVE_TECHNICAL_FACT, which answers a fact rather than declaring the course requires one. */
const FACT_REQUIREMENT_ALLOWED_BASES: readonly NormalizationBasis[] = ["FACT_REQUIREMENT_DERIVATION"];
/** CC-20 section 3: the ONLY basis a SemanticAdjudication may declare -- it is a governed decision over existing evidence, never a new source authority. */
const SEMANTIC_ADJUDICATION_ALLOWED_BASES: readonly NormalizationBasis[] = ["SEMANTIC_ADJUDICATION_DECISION"];
/** CC-21A section 3: the ONLY basis a KnowledgeBoundaryCertification may declare -- a semantic certification over an already-existing candidate's knowledge state, never a new source authority. */
const KNOWLEDGE_BOUNDARY_CERTIFICATION_ALLOWED_BASES: readonly NormalizationBasis[] = ["KNOWLEDGE_BOUNDARY_CERTIFICATION_DECISION"];

// ---------------------------------------------------------------------
// CC-20 section 16: depth-basis priority, used both to pick the winning
// basis when mergeCandidates combines two candidates and to decide
// whether qualification-level evidence may still upgrade an UNRESOLVED
// depth basis. Mirrors CONFIDENCE_ORDER's ranking (ASSESSMENT_CALIBRATED/
// EXPLICIT_CURRICULUM_DEPTH -> HIGH; QUALIFICATION_LEVEL_BOUNDED -> MEDIUM;
// UNRESOLVED -> NONE/LOW) so the two never disagree about which basis won.
// ---------------------------------------------------------------------
const DEPTH_BASIS_PRIORITY: Record<DepthBasis, number> = {
  ASSESSMENT_CALIBRATED: 3,
  EXPLICIT_CURRICULUM_DEPTH: 2,
  QUALIFICATION_LEVEL_BOUNDED: 1,
  UNRESOLVED: 0,
};

function preferredDepthBasis(a: DepthBasis | undefined, b: DepthBasis | undefined): DepthBasis | undefined {
  if (!a) return b;
  if (!b) return a;
  return DEPTH_BASIS_PRIORITY[a] >= DEPTH_BASIS_PRIORITY[b] ? a : b;
}

/** CC-20A section 12: merge priority for PerformanceProvenance -- EXPLICIT is never downgraded by a weaker source's UNRESOLVED/GOVERNED_INHERITED value. */
const PERFORMANCE_PROVENANCE_PRIORITY: Record<PerformanceProvenance, number> = {
  EXPLICIT: 2,
  GOVERNED_INHERITED: 1,
  UNRESOLVED: 0,
};

function preferredPerformanceProvenance(a: PerformanceProvenance | undefined, b: PerformanceProvenance | undefined): PerformanceProvenance | undefined {
  if (!a) return b;
  if (!b) return a;
  return PERFORMANCE_PROVENANCE_PRIORITY[a] >= PERFORMANCE_PROVENANCE_PRIORITY[b] ? a : b;
}

// ---------------------------------------------------------------------
// Confidence / disposition ordering helpers.
// ---------------------------------------------------------------------

const CONFIDENCE_ORDER: Record<ConfidenceLevel, number> = { NONE: 0, LOW: 1, MEDIUM: 2, HIGH: 3 };

function maxConfidence(a: ConfidenceLevel, b: ConfidenceLevel): ConfidenceLevel {
  return CONFIDENCE_ORDER[a] >= CONFIDENCE_ORDER[b] ? a : b;
}

const DISPOSITION_PRIORITY: Record<CandidateDisposition, number> = {
  REQUIRED_EXPLICIT_CURRICULUM: 0,
  REQUIRED_ASSESSMENT_EVIDENCED: 1,
  FOUNDATIONAL_PREREQUISITE: 2,
  REPRESENTATIVE_EXEMPLAR: 3,
  CONTEXTUAL_TEACHING_SUPPORT: 4,
  OPEN_SCOPE_GAP: 5,
  REVIEW_REQUIRED: 6,
};

export function mergeCandidates(candidates: readonly KnowledgeCandidate[]): KnowledgeCandidate[] {
  const byKey = new Map<string, KnowledgeCandidate>();
  for (const c of candidates) {
    const existing = byKey.get(c.candidateKey);
    if (!existing) {
      byKey.set(c.candidateKey, c);
      continue;
    }
    const preferred = DISPOSITION_PRIORITY[existing.disposition] <= DISPOSITION_PRIORITY[c.disposition] ? existing : c;
    const other = preferred === existing ? c : existing;
    const mergedFactualStatements = { ...(existing.factualStatementsByClaimKey ?? {}), ...(c.factualStatementsByClaimKey ?? {}) };
    byKey.set(c.candidateKey, {
      ...preferred,
      confidence: {
        scopeConfidence: maxConfidence(existing.confidence.scopeConfidence, c.confidence.scopeConfidence),
        depthConfidence: maxConfidence(existing.confidence.depthConfidence, c.confidence.depthConfidence),
        technicalTruthConfidence: maxConfidence(existing.confidence.technicalTruthConfidence, c.confidence.technicalTruthConfidence),
      },
      rationale: preferred.rationale === other.rationale ? preferred.rationale : `${preferred.rationale} Additionally: ${other.rationale}`,
      evidenceRefs: [...existing.evidenceRefs, ...c.evidenceRefs],
      parentSubject: preferred.parentSubject ?? other.parentSubject,
      qualificationLevelRefs: [...(existing.qualificationLevelRefs ?? []), ...(c.qualificationLevelRefs ?? [])],
      depthConstraintNote: preferred.depthConstraintNote ?? other.depthConstraintNote,
      requiredFactKeys: [...new Set([...(existing.requiredFactKeys ?? []), ...(c.requiredFactKeys ?? [])])].sort() || undefined,
      factualStatementsByClaimKey: Object.keys(mergedFactualStatements).length > 0 ? mergedFactualStatements : undefined,
      technicalCoverageStatus: preferred.technicalCoverageStatus ?? other.technicalCoverageStatus,
      depthBasis: preferredDepthBasis(existing.depthBasis, c.depthBasis),
      assessmentCalibrationAvailable: (existing.assessmentCalibrationAvailable ?? false) || (c.assessmentCalibrationAvailable ?? false),
      performanceProvenance: preferredPerformanceProvenance(existing.performanceProvenance, c.performanceProvenance),
      isExplicitlyStructuralNode: (existing.isExplicitlyStructuralNode ?? false) || (c.isExplicitlyStructuralNode ?? false),
    });
  }
  return [...byKey.values()];
}

// ---------------------------------------------------------------------
// Official curriculum-unit registry. Keyed by the COMPOSITE
// (qualificationId, curriculumUnitId), never curriculumUnitId alone.
// Insertion order never affects the result. A genuine conflict (same
// composite key, incompatible official wording/source identity)
// excludes BOTH duplicates from the resolvable index and is reported,
// rather than resolved last-write-wins. CC-18C section 2: an entry with
// blank sourceRef/sourceLocator is ALSO rejected and reported -- it can
// never become mapping authority.
// ---------------------------------------------------------------------

export function buildOfficialCurriculumUnitIndex(units: readonly OfficialCurriculumUnit[]): { index: Map<string, OfficialCurriculumUnit>; gaps: GapRecord[] } {
  const firstSeen = new Map<string, OfficialCurriculumUnit>();
  const conflictedKeys = new Set<string>();
  const gaps: GapRecord[] = [];

  for (const u of units) {
    const key = unitRegistryKey(u.qualificationId, u.curriculumUnitId);
    // OfficialCurriculumUnit does not extend SourceProvenance (it carries no
    // normalizationBasis -- it IS the mapping authority, not a normalization
    // proposal against one) -- so its own bespoke, always-reported blank-field check.
    if (u.sourceRef.trim().length === 0 || u.sourceLocator.trim().length === 0) {
      gaps.push({
        gapType: "EVIDENCE_NORMALIZATION_REVIEW",
        candidateKey: key,
        evidenceAvailable: [`curriculumUnitId=${u.curriculumUnitId}`, `qualificationId=${u.qualificationId}`, `sourceRef=${JSON.stringify(u.sourceRef)}`, `sourceLocator=${JSON.stringify(u.sourceLocator)}`],
        unresolved: `OfficialCurriculumUnit "${key}" has ${u.sourceRef.trim().length === 0 ? "an empty sourceRef" : "an empty sourceLocator"} -- it cannot become mapping authority without provenance.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
      });
      continue;
    }

    const existing = firstSeen.get(key);
    if (!existing) {
      firstSeen.set(key, u);
      continue;
    }
    if (existing.officialWording !== u.officialWording || existing.sourceRef !== u.sourceRef) {
      if (!conflictedKeys.has(key)) {
        conflictedKeys.add(key);
        gaps.push({
          gapType: "EVIDENCE_NORMALIZATION_REVIEW",
          candidateKey: `${key}::REGISTRY_CONFLICT`,
          evidenceAvailable: [`first: sourceRef=${existing.sourceRef} wording="${existing.officialWording}"`, `duplicate: sourceRef=${u.sourceRef} wording="${u.officialWording}"`],
          unresolved: `Multiple OfficialCurriculumUnit entries share composite key "${key}" with incompatible official wording/source identity.`,
          legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
          notes: "Neither duplicate resolves until the registry conflict is explicitly corrected -- never last-write-wins.",
        });
      }
    }
  }

  const index = new Map<string, OfficialCurriculumUnit>();
  for (const [key, u] of firstSeen) {
    if (!conflictedKeys.has(key)) index.set(key, u);
  }
  return { index, gaps };
}

// ---------------------------------------------------------------------
// Curriculum evidence validation -- resolves each record against the
// official registry and the active qualification BEFORE any candidate
// is generated from it. CC-18C: a provenance failure is ALWAYS reported
// via EVIDENCE_NORMALIZATION_REVIEW, never silently excluded.
// ---------------------------------------------------------------------

export function validateCurriculumEvidence(
  evidence: readonly CurriculumEvidence[],
  qualificationId: string,
  unitIndex: ReadonlyMap<string, OfficialCurriculumUnit>,
): { validated: CurriculumEvidence[]; gaps: GapRecord[] } {
  const validated: CurriculumEvidence[] = [];
  const gaps: GapRecord[] = [];

  for (const e of evidence) {
    if (e.role !== "OFFICIAL_CURRICULUM") continue; // structurally guaranteed by type; defense in depth
    const key = candidateKey(e.subject, e.commandVerbPerformanceType ?? "OTHER");

    const failure = provenanceFailureReason(e, CURRICULUM_ALLOWED_BASES);
    if (failure) {
      gaps.push(provenanceReviewGap("CurriculumEvidence", e.evidenceId, e, failure, key, ["OFFICIAL_CURRICULUM"]));
      continue;
    }

    const qualMatches = e.qualificationId === qualificationId;
    const unitResolves = unitIndex.has(unitRegistryKey(e.qualificationId, e.curriculumUnitId));

    if (!qualMatches || !unitResolves) {
      gaps.push({
        gapType: "CURRICULUM_MAPPING_REVIEW",
        candidateKey: key,
        evidenceAvailable: [`evidenceId=${e.evidenceId}`, `declaredQualification=${e.qualificationId}`, `curriculumUnitId=${e.curriculumUnitId}`, `subject=${e.subject}`],
        unresolved: !qualMatches
          ? `CurriculumEvidence declares qualification "${e.qualificationId}", not the active pipeline qualification "${qualificationId}".`
          : `curriculumUnitId "${e.curriculumUnitId}" does not resolve to a real OfficialCurriculumUnit for qualification "${qualificationId}".`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
        notes: "Preserved for review; does not generate REQUIRED_EXPLICIT_CURRICULUM scope until a valid registry mapping is established.",
      });
      continue;
    }

    validated.push(e);
  }
  return { validated, gaps };
}

// ---------------------------------------------------------------------
// Curriculum candidate generation. Operates ONLY on an already-validated
// stream. Groups by the FULL (subject, performanceType) key from the
// start, so multiple performance types for one subject all survive, and
// honours the explicit CurriculumNormalizationKind. CC-18C section 11:
// a DEPTH_QUALIFIER must resolve to EXACTLY ONE (subject,
// performanceType) candidate -- via an explicit `refinesPerformanceType`
// or because the parent subject has only one performance-type candidate
// of its own -- or it is never applied and is reported for review
// instead of silently applying to every candidate sharing the subject.
// ---------------------------------------------------------------------

export function generateCurriculumCandidates(validatedEvidence: readonly CurriculumEvidence[]): { candidates: KnowledgeCandidate[]; gaps: GapRecord[] } {
  const ownCandidateRecordsByKey = new Map<string, CurriculumEvidence[]>();
  const depthQualifiersByParentSubject = new Map<string, CurriculumEvidence[]>();
  const parentBySubject = new Map<string, string>();
  const performanceTypesBySubject = new Map<string, Set<LearnerPerformanceType>>();
  // CC-20A section 12 (tightened CC-20B section 6-9): tracks which SUBJECTS
  // have at least one record whose commandVerbPerformanceType is BOTH
  // populated AND declared commandVerbPerformanceBasis: "SOURCE_EXPLICIT" --
  // the mechanical basis for PerformanceProvenance.EXPLICIT/
  // GOVERNED_INHERITED. A populated enum with no declared basis, or an
  // explicit "STRONG_INFERENCE" basis, is normalization OUTPUT, never
  // treated as source-explicit evidence on its own.
  const subjectsWithExplicitPerformance = new Set<string>();

  for (const e of validatedEvidence) {
    if (e.normalizationKind === "DEPTH_QUALIFIER") {
      if (!e.refinesSubject) continue; // malformed -- a depth qualifier with no parent constrains nothing
      const list = depthQualifiersByParentSubject.get(e.refinesSubject) ?? [];
      list.push(e);
      depthQualifiersByParentSubject.set(e.refinesSubject, list);
      continue;
    }

    // PRIMARY_REQUIREMENT, RANGE_REQUIRED_MEMBER, RANGE_CATEGORY all create their own (subject, performanceType) candidate.
    const performanceType = e.commandVerbPerformanceType ?? "OTHER";
    const key = candidateKey(e.subject, performanceType);
    const list = ownCandidateRecordsByKey.get(key) ?? [];
    list.push(e);
    ownCandidateRecordsByKey.set(key, list);

    const perfSet = performanceTypesBySubject.get(e.subject) ?? new Set<LearnerPerformanceType>();
    perfSet.add(performanceType);
    performanceTypesBySubject.set(e.subject, perfSet);

    if (e.commandVerbPerformanceType !== undefined && e.commandVerbPerformanceBasis === "SOURCE_EXPLICIT") subjectsWithExplicitPerformance.add(e.subject);

    if (e.normalizationKind === "RANGE_REQUIRED_MEMBER" && e.refinesSubject) {
      parentBySubject.set(e.subject, e.refinesSubject);
    }
  }

  const gaps: GapRecord[] = [];
  const depthQualifierHitsByKey = new Map<string, CurriculumEvidence[]>();

  for (const [subject, qualifiers] of depthQualifiersByParentSubject) {
    const perfSet = performanceTypesBySubject.get(subject) ?? new Set<LearnerPerformanceType>();
    for (const q of qualifiers) {
      let targetKey: string | undefined;
      if (q.refinesPerformanceType) {
        const candidate = candidateKey(subject, q.refinesPerformanceType);
        if (ownCandidateRecordsByKey.has(candidate)) targetKey = candidate;
      } else if (perfSet.size === 1) {
        targetKey = candidateKey(subject, [...perfSet][0]!);
      }

      if (!targetKey) {
        gaps.push({
          gapType: "EVIDENCE_NORMALIZATION_REVIEW",
          candidateKey: candidateKey(subject, q.refinesPerformanceType ?? "OTHER"),
          evidenceAvailable: [
            `evidenceId=${q.evidenceId}`,
            `refinesSubject=${subject}`,
            `refinesPerformanceType=${q.refinesPerformanceType ?? "(unspecified)"}`,
            `availablePerformanceTypesForSubject=${[...perfSet].join(", ") || "none"}`,
          ],
          unresolved: `DEPTH_QUALIFIER for subject "${subject}" cannot resolve to exactly one intended (subject, performanceType) candidate -- ${
            q.refinesPerformanceType
              ? `no candidate exists for the explicitly targeted performance type "${q.refinesPerformanceType}"`
              : `${perfSet.size} performance types exist for this subject and no explicit refinesPerformanceType was supplied`
          }. It is never applied broadly to every candidate sharing the subject.`,
          legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
        });
        continue;
      }
      const list = depthQualifierHitsByKey.get(targetKey) ?? [];
      list.push(q);
      depthQualifierHitsByKey.set(targetKey, list);
    }
  }

  const candidates: KnowledgeCandidate[] = [];
  for (const [key, records] of ownCandidateRecordsByKey) {
    const first = records[0]!;
    const subject = first.subject;
    const performanceType = first.commandVerbPerformanceType ?? "OTHER";
    const depthQualifiers = depthQualifierHitsByKey.get(key) ?? [];
    const kinds = new Set(records.map((r) => r.normalizationKind));

    const rationaleParts: string[] = [];
    if (kinds.has("PRIMARY_REQUIREMENT")) rationaleParts.push("named directly in the qualification's own primary AC/LO wording");
    if (kinds.has("RANGE_REQUIRED_MEMBER")) rationaleParts.push(`an explicit official Range member (parent subject: "${parentBySubject.get(subject) ?? "unknown"}")`);
    if (kinds.has("RANGE_CATEGORY")) rationaleParts.push("a named standalone official Range category");
    const rationale = `Required curriculum scope -- ${rationaleParts.join("; ")}. Internal implementation detail beyond what other evidence independently supports is not automatically authorised.`;

    // CC-20A section 12 (tightened CC-20B section 6-9): EXPLICIT when this
    // exact candidate's own record(s) declared commandVerbPerformanceType
    // WITH commandVerbPerformanceBasis: "SOURCE_EXPLICIT" -- a populated
    // enum with no declared basis, or an explicit "STRONG_INFERENCE" basis,
    // is normalization output, never treated as source evidence.
    // GOVERNED_INHERITED only for a RANGE_REQUIRED_MEMBER whose governed
    // parent subject is ITSELF source-explicit (a mechanically resolvable
    // relationship, never a topic-string guess, and never an upgrade for an
    // inferred parent); UNRESOLVED otherwise -- the pipeline's own
    // "?? OTHER" fallback is never treated as an evidence author's claim.
    const ownExplicitPerformance = records.some((r) => r.commandVerbPerformanceType !== undefined && r.commandVerbPerformanceBasis === "SOURCE_EXPLICIT");
    const parentSubjectForKey = parentBySubject.get(subject);
    const inheritedExplicitPerformance = !ownExplicitPerformance && kinds.has("RANGE_REQUIRED_MEMBER") && parentSubjectForKey !== undefined && subjectsWithExplicitPerformance.has(parentSubjectForKey);
    const performanceProvenance: PerformanceProvenance = ownExplicitPerformance ? "EXPLICIT" : inheritedExplicitPerformance ? "GOVERNED_INHERITED" : "UNRESOLVED";

    candidates.push({
      candidateKey: key,
      subject,
      performanceType,
      disposition: "REQUIRED_EXPLICIT_CURRICULUM",
      confidence: {
        scopeConfidence: "HIGH",
        // CC-20 section 16/17: an explicit curriculum depth qualifier
        // directly constrains depth -- HIGH, not the prior MEDIUM. A
        // qualification-level ceiling (weaker, MEDIUM) is applied later,
        // in buildStandardPipeline, only when no depth qualifier resolved.
        depthConfidence: depthQualifiers.length > 0 ? "HIGH" : "NONE",
        technicalTruthConfidence: "NONE",
      },
      rationale,
      evidenceRefs: [...records, ...depthQualifiers].map((r) => ({ role: r.role, evidenceId: r.evidenceId })),
      parentSubject: parentSubjectForKey,
      depthBasis: depthQualifiers.length > 0 ? "EXPLICIT_CURRICULUM_DEPTH" : "UNRESOLVED",
      performanceProvenance,
      // CC-20A section 9: the minimum governed signal currently eligible to
      // be treated as an explicitly structural curriculum node -- a
      // PRIMARY_REQUIREMENT is never eligible merely because a child points to it.
      isExplicitlyStructuralNode: kinds.has("RANGE_CATEGORY"),
    });
  }
  return { candidates, gaps };
}

// ---------------------------------------------------------------------
// Assessment evidence validation -- produces the SINGLE validated/
// accepted stream every downstream assessment-consuming function must
// use exclusively. CC-18C: a provenance failure is ALWAYS reported.
// ---------------------------------------------------------------------

export function validateAssessmentEvidence(
  evidence: readonly AssessmentEvidence[],
  qualificationId: string,
  unitIndex: ReadonlyMap<string, OfficialCurriculumUnit>,
): { validated: AssessmentEvidence[]; gaps: GapRecord[] } {
  const validated: AssessmentEvidence[] = [];
  const gaps: GapRecord[] = [];

  for (const e of evidence) {
    const key = candidateKey(e.subject, e.performanceType);
    const failure = provenanceFailureReason(e, ASSESSMENT_ALLOWED_BASES);
    if (failure) {
      gaps.push(provenanceReviewGap("AssessmentEvidence", e.evidenceId, e, failure, key, ["PUBLIC_ASSESSMENT"]));
      continue;
    }

    const mappedId = e.mappedCurriculumUnitId.trim();
    const unit = mappedId ? unitIndex.get(unitRegistryKey(e.qualificationId, mappedId)) : undefined;
    const qualMatches = e.qualificationId === qualificationId;

    if (!qualMatches || !unit) {
      const reason = !qualMatches
        ? `Assessment item declares qualification "${e.qualificationId}", not the active pipeline qualification "${qualificationId}".`
        : !mappedId
          ? "No curriculum-unit mapping was supplied for this assessment item."
          : `Mapped curriculum-unit id "${mappedId}" does not resolve to any official curriculum unit for qualification "${e.qualificationId}".`;
      gaps.push({
        gapType: "ASSESSMENT_MAPPING_REVIEW",
        candidateKey: key,
        evidenceAvailable: [`assessmentSource=${e.assessmentSource}`, `itemId=${e.itemId}`, `attemptedMapping=${mappedId || "(none)"}`, `targetSubject=${e.subject}`, `targetPerformanceType=${e.performanceType}`],
        unresolved: reason,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
        notes: "Preserved for review; does not generate REQUIRED_ASSESSMENT_EVIDENCED scope, and is excluded from every downstream assessment-consuming computation (pattern detection, breadth evidence, capability derivation).",
      });
      continue;
    }

    validated.push(e);
  }
  return { validated, gaps };
}

/** Pure candidate generation from an ALREADY validated/trusted assessment stream -- no validation logic here. */
export function generateAssessmentCandidates(validated: readonly AssessmentEvidence[]): KnowledgeCandidate[] {
  const byKey = new Map<string, AssessmentEvidence[]>();
  for (const e of validated) {
    const key = candidateKey(e.subject, e.performanceType);
    const list = byKey.get(key) ?? [];
    list.push(e);
    byKey.set(key, list);
  }
  const candidates: KnowledgeCandidate[] = [];
  for (const [key, items] of byKey) {
    const first = items[0]!;
    candidates.push({
      candidateKey: key,
      subject: first.subject,
      performanceType: first.performanceType,
      disposition: "REQUIRED_ASSESSMENT_EVIDENCED",
      confidence: { scopeConfidence: "HIGH", depthConfidence: "HIGH", technicalTruthConfidence: "NONE" },
      rationale: `Directly evidenced by ${items.length} validated assessment item(s) (${items.map((i) => i.itemId).join(", ")}), resolved against the official curriculum-unit registry (${first.mappedCurriculumUnitId}); the positive target only -- correct-answer requirement, never distractor content from the same item.`,
      evidenceRefs: items.map((i) => ({ role: i.role, evidenceId: i.evidenceId })),
      depthBasis: "ASSESSMENT_CALIBRATED",
      assessmentCalibrationAvailable: true,
      // CC-20B section 9: performanceType is mandatory, but that alone is
      // normalization output -- only a declared performanceBasis:
      // "SOURCE_EXPLICIT" means the assessment item itself directly
      // supports the performance, never a semantic guess from vague
      // assessment evidence recorded as a populated enum.
      performanceProvenance: items.some((i) => i.performanceBasis === "SOURCE_EXPLICIT") ? "EXPLICIT" : "UNRESOLVED",
    });
  }
  return candidates;
}

// ---------------------------------------------------------------------
// Qualification-level evidence validation. CC-18C: provenance failure
// always reported.
// ---------------------------------------------------------------------

export function validateQualificationLevelEvidence(evidence: readonly QualificationLevelEvidence[], qualificationId: string): { validated: QualificationLevelEvidence[]; gaps: GapRecord[] } {
  const validated: QualificationLevelEvidence[] = [];
  const gaps: GapRecord[] = [];
  for (const e of evidence) {
    const failure = provenanceFailureReason(e, QUALIFICATION_LEVEL_ALLOWED_BASES);
    if (failure) {
      gaps.push(provenanceReviewGap("QualificationLevelEvidence", e.evidenceId, e, failure, e.appliesToCandidateKey, ["QUALIFICATION_LEVEL"]));
      continue;
    }
    if (e.qualificationId !== qualificationId) continue; // not this run's concern -- depth constraint only, never scope
    validated.push(e);
  }
  return { validated, gaps };
}

/**
 * Qualification-level depth-constraint attachment. NEVER creates a new
 * candidate -- only attaches to a candidate that already exists under the
 * exact key it names. Operates on an ALREADY validated stream.
 *
 * CC-20 section 16: valid qualification-level evidence attached to a
 * required, explicit curriculum performance now supplies a defensible
 * conservative depth CEILING (QUALIFICATION_LEVEL_BOUNDED, MEDIUM
 * confidence) when nothing stronger already resolved depth -- the blind
 * back-test showed attaching qualification-level evidence and STILL
 * leaving depthConfidence=NONE for every candidate was too conservative.
 * This is a ceiling only: it never expands scope, never claims to know
 * exact content/formula/topology, and never overrides an
 * ASSESSMENT_CALIBRATED or EXPLICIT_CURRICULUM_DEPTH basis that already
 * resolved depth more strongly.
 *
 * CC-20A section 11-12: level evidence bounds an ESTABLISHED performance --
 * it does not itself establish an uncertain one. The ceiling therefore
 * applies only when the candidate's own `performanceProvenance` is
 * `EXPLICIT` or `GOVERNED_INHERITED`; a candidate whose performance mapping
 * is `UNRESOLVED` (resting only on the pipeline's own `?? "OTHER"`
 * fallback) is left at whatever depth basis it already had -- attaching a
 * level descriptor to it must never manufacture MEDIUM confidence out of an
 * uncertain performance claim.
 */
export function attachQualificationLevelConstraints(candidates: readonly KnowledgeCandidate[], validatedEvidence: readonly QualificationLevelEvidence[]): { candidates: KnowledgeCandidate[]; unmatched: QualificationLevelEvidence[] } {
  const byCandidateKey = new Map<string, QualificationLevelEvidence[]>();
  for (const e of validatedEvidence) {
    const list = byCandidateKey.get(e.appliesToCandidateKey) ?? [];
    list.push(e);
    byCandidateKey.set(e.appliesToCandidateKey, list);
  }

  const matchedKeys = new Set<string>();
  const updated = candidates.map((c) => {
    const matches = byCandidateKey.get(c.candidateKey);
    if (!matches || matches.length === 0) return c;
    matchedKeys.add(c.candidateKey);
    const currentBasis: DepthBasis = c.depthBasis ?? "UNRESOLVED";
    const performanceEstablished = c.performanceProvenance === "EXPLICIT" || c.performanceProvenance === "GOVERNED_INHERITED";
    const boundedByQualificationLevel = REQUIRED_DISPOSITIONS.includes(c.disposition) && currentBasis === "UNRESOLVED" && performanceEstablished;
    return {
      ...c,
      qualificationLevelRefs: [...(c.qualificationLevelRefs ?? []), ...matches.map((m) => ({ role: "QUALIFICATION_LEVEL" as const, evidenceId: m.evidenceId }))],
      depthConstraintNote: matches.map((m) => `${m.levelId}: ${m.depthConstraintDescriptor}`).join("; "),
      depthBasis: boundedByQualificationLevel ? "QUALIFICATION_LEVEL_BOUNDED" : currentBasis,
      confidence: boundedByQualificationLevel ? { ...c.confidence, depthConfidence: "MEDIUM" as const } : c.confidence,
    };
  });

  const unmatched = validatedEvidence.filter((e) => !matchedKeys.has(e.appliesToCandidateKey));
  return { candidates: updated, unmatched };
}

// ---------------------------------------------------------------------
// Structural capability dependency validation + prerequisite rule.
// `CandidateCapabilityRequirement` is the ONLY thing a
// `PrerequisiteEvidence` can match against. CC-18C:
//   - a capability requirement is now bound to the active qualificationId
//     (section 3);
//   - EXPLICIT_CURRICULUM_OPERATION must cite a role=OFFICIAL_CURRICULUM
//     ref resolving into the VALIDATED curriculum stream (section 4);
//   - EXPLICIT_ASSESSMENT_OPERATION must cite a role=PUBLIC_ASSESSMENT
//     ref resolving into the VALIDATED assessment stream -- a colliding
//     evidenceId under the wrong role never satisfies the gate (section 5);
//   - DETERMINISTIC_OPERATIONAL_DEPENDENCY is a deliberate HOLD and never
//     auto-promotes until a governed deterministic-rule registry is
//     separately authorised (section 6) -- REVIEW_REQUIRED only.
// ---------------------------------------------------------------------

export function validateCandidateCapabilityRequirements(requirements: readonly CandidateCapabilityRequirement[], qualificationId: string): { validated: CandidateCapabilityRequirement[]; gaps: GapRecord[] } {
  const validated: CandidateCapabilityRequirement[] = [];
  const gaps: GapRecord[] = [];
  for (const r of requirements) {
    const identifier = `${r.targetCandidateKey}::${r.capabilityKey}`;
    const failure = provenanceFailureReason(r, CAPABILITY_ALLOWED_BASES);
    if (failure) {
      gaps.push(provenanceReviewGap("CandidateCapabilityRequirement", identifier, r, failure, r.targetCandidateKey, ["OFFICIAL_CURRICULUM"]));
      continue;
    }
    if (r.qualificationId !== qualificationId) {
      gaps.push({
        gapType: "EVIDENCE_NORMALIZATION_REVIEW",
        candidateKey: r.targetCandidateKey,
        evidenceAvailable: [`identifier=${identifier}`, `declaredQualification=${r.qualificationId}`],
        unresolved: `CandidateCapabilityRequirement declares qualification "${r.qualificationId}", not the active pipeline qualification "${qualificationId}" -- it cannot influence this run or promote a prerequisite.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
      });
      continue;
    }
    validated.push(r);
  }
  return { validated, gaps };
}

export function validatePrerequisiteEvidence(evidence: readonly PrerequisiteEvidence[]): { validated: PrerequisiteEvidence[]; gaps: GapRecord[] } {
  const validated: PrerequisiteEvidence[] = [];
  const gaps: GapRecord[] = [];
  for (const e of evidence) {
    const failure = provenanceFailureReason(e, PREREQUISITE_ALLOWED_BASES);
    if (failure) {
      gaps.push(provenanceReviewGap("PrerequisiteEvidence", e.evidenceId, e, failure, candidateKey(e.subject, e.performanceType), ["OFFICIAL_CURRICULUM"]));
      continue;
    }
    validated.push(e);
  }
  return { validated, gaps };
}

/**
 * A capability requirement's derivationKind auto-promotes a matching
 * prerequisite only when it cites a role-and-id-matched entry in the
 * corresponding VALIDATED evidence stream. An EvidenceRef that merely
 * reuses the same evidenceId under the WRONG role never satisfies this.
 */
function isAutoPromotable(r: CandidateCapabilityRequirement, validatedCurriculumIds: ReadonlySet<string>, validatedAssessmentIds: ReadonlySet<string>): boolean {
  switch (r.derivationKind) {
    case "EXPLICIT_CURRICULUM_OPERATION":
      return r.sourceEvidenceRefs.some((ref) => ref.role === "OFFICIAL_CURRICULUM" && validatedCurriculumIds.has(ref.evidenceId));
    case "EXPLICIT_ASSESSMENT_OPERATION":
      return r.sourceEvidenceRefs.some((ref) => ref.role === "PUBLIC_ASSESSMENT" && validatedAssessmentIds.has(ref.evidenceId));
    case "DETERMINISTIC_OPERATIONAL_DEPENDENCY":
      // CC-18C section 6: deliberate HOLD -- no governed deterministic-rule
      // registry exists yet, so this can never auto-promote on its own say-so.
      return false;
    case "REVIEW_PROPOSED":
      return false;
  }
}

export function generatePrerequisiteCandidates(
  validatedPrerequisites: readonly PrerequisiteEvidence[],
  validatedCapabilityRequirements: readonly CandidateCapabilityRequirement[],
  existingCandidates: readonly KnowledgeCandidate[],
  validatedCurriculumEvidenceIds: ReadonlySet<string>,
  validatedAssessmentEvidenceIds: ReadonlySet<string>,
): KnowledgeCandidate[] {
  const requiredKeys = new Set(existingCandidates.filter((c) => REQUIRED_DISPOSITIONS.includes(c.disposition)).map((c) => c.candidateKey));
  const requirementsWithRealTarget = validatedCapabilityRequirements.filter((r) => requiredKeys.has(r.targetCandidateKey));

  return validatedPrerequisites.map((e) => {
    const matching = requirementsWithRealTarget.filter((r) => r.targetCandidateKey === e.necessaryForCandidateKey && r.capabilityKey === e.capabilityKey);
    const autoPromotable = matching.some((r) => isAutoPromotable(r, validatedCurriculumEvidenceIds, validatedAssessmentEvidenceIds));
    const targetExists = requiredKeys.has(e.necessaryForCandidateKey);
    const disposition: CandidateDisposition = autoPromotable ? "FOUNDATIONAL_PREREQUISITE" : targetExists ? "REVIEW_REQUIRED" : "CONTEXTUAL_TEACHING_SUPPORT";

    const rationale = autoPromotable
      ? `Capability "${e.capabilityKey}" is structurally required by "${e.necessaryForCandidateKey}" via a validly derived CandidateCapabilityRequirement that cites role-and-id-matched validated primary-source evidence -- minimal prerequisite: ${e.minimalDepthJustification}`
      : matching.length > 0
        ? `A CandidateCapabilityRequirement for "${e.capabilityKey}"/"${e.necessaryForCandidateKey}" exists but does not auto-promote: its derivationKind is REVIEW_PROPOSED, is DETERMINISTIC_OPERATIONAL_DEPENDENCY (a deliberate architectural HOLD until a governed deterministic-rule registry is authorised), or its cited EvidenceRef does not resolve into the correspondingly validated evidence stream under the matching role -- held at REVIEW_REQUIRED pending Project-Architect confirmation.`
        : targetExists
          ? `No CandidateCapabilityRequirement declares "${e.capabilityKey}" as necessary for "${e.necessaryForCandidateKey}" -- a claimed necessity label alone is never sufficient; held at REVIEW_REQUIRED.`
          : `Does not reference an existing required candidate ("${e.necessaryForCandidateKey}") -- capped at contextual teaching support.`;

    return {
      candidateKey: candidateKey(e.subject, e.performanceType),
      subject: e.subject,
      performanceType: e.performanceType,
      disposition,
      confidence: {
        scopeConfidence: disposition === "FOUNDATIONAL_PREREQUISITE" ? "MEDIUM" : "LOW",
        depthConfidence: "LOW",
        technicalTruthConfidence: "NONE",
      },
      rationale,
      evidenceRefs: [
        { role: "STRUCTURAL_PREREQUISITE_DEPENDENCY", evidenceId: e.evidenceId },
        ...matching.map((r) => ({ role: "CANDIDATE_CAPABILITY_REQUIREMENT" as const, evidenceId: `${r.targetCandidateKey}::${r.capabilityKey}` })),
      ],
    };
  });
}

// ---------------------------------------------------------------------
// Exemplar vs mastery. Role no longer auto-grants technical-truth
// confidence -- that comes only from exact claim-key coverage. CC-18C:
// provenance failure always reported.
// ---------------------------------------------------------------------

export function validateExemplarEvidence(evidence: readonly ExemplarEvidence[]): { validated: ExemplarEvidence[]; gaps: GapRecord[] } {
  const validated: ExemplarEvidence[] = [];
  const gaps: GapRecord[] = [];
  for (const e of evidence) {
    const failure = provenanceFailureReason(e);
    if (failure) {
      gaps.push(provenanceReviewGap("ExemplarEvidence", e.evidenceId, e, failure, candidateKey(e.exemplarSubject, "OTHER"), ["OFFICIAL_CURRICULUM"]));
      continue;
    }
    validated.push(e);
  }
  return { validated, gaps };
}

export function generateExemplarCandidates(validatedEvidence: readonly ExemplarEvidence[], existingCandidates: readonly KnowledgeCandidate[]): KnowledgeCandidate[] {
  const requiredSubjects = new Set(existingCandidates.filter((c) => REQUIRED_DISPOSITIONS.includes(c.disposition)).map((c) => c.subject));
  const candidates: KnowledgeCandidate[] = [];
  for (const e of validatedEvidence) {
    if (!requiredSubjects.has(e.exemplarOfCategory)) continue;
    const detail = (e.implementationDetailSubjects ?? []).join(", ") || "none recorded";
    candidates.push({
      candidateKey: candidateKey(e.exemplarSubject, "OTHER"),
      subject: e.exemplarSubject,
      performanceType: "OTHER",
      disposition: "REPRESENTATIVE_EXEMPLAR",
      confidence: { scopeConfidence: "MEDIUM", depthConfidence: "NONE", technicalTruthConfidence: "NONE" },
      rationale: `Technically valid representative example used to illustrate the required category "${e.exemplarOfCategory}" -- teaching-example status only, not an independent mastery requirement. Recorded implementation detail (${detail}) is never independently promoted. Technical-truth confidence is never auto-granted by the exemplar's own source role -- only exact claim-key coverage (see requiredFactKeys) can establish it.`,
      evidenceRefs: [{ role: e.role, evidenceId: e.evidenceId }],
      exemplarOfCategory: e.exemplarOfCategory,
    });
  }
  return candidates;
}

// ---------------------------------------------------------------------
// Candidate fact-requirement validation (CC-18C sections 7-8).
// qualificationId is mandatory; a requirement must resolve to a real
// current required candidate; its own normalizationBasis must be
// FACT_REQUIREMENT_DERIVATION specifically; and its derivationStatus
// gates whether it may contribute a requiredFactKey at all --
// EXPLICIT_CURRICULUM_FACT/EXPLICIT_ASSESSMENT_FACT must cite
// role-and-id-matched validated primary-source evidence;
// REVIEW_PROPOSED is exported for review but never contributes.
// ---------------------------------------------------------------------

export function validateCandidateFactRequirements(
  requirements: readonly CandidateFactRequirement[],
  qualificationId: string,
  requiredCandidateKeys: ReadonlySet<string>,
  validatedCurriculumEvidenceIds: ReadonlySet<string>,
  validatedAssessmentEvidenceIds: ReadonlySet<string>,
  /** CC-20 section 8: ACTIVE (validated, non-conflicted) SemanticAdjudications whose decision is REQUIRED_CORE/REQUIRED_OPERATIONAL, keyed by `targetCandidateKey::claimKey`. The ONLY thing that may promote a REVIEW_PROPOSED requirement into a governing requiredFactKey. */
  activeGoverningAdjudicationsByIdentity: ReadonlyMap<string, SemanticAdjudication> = new Map(),
): { validated: CandidateFactRequirement[]; gaps: GapRecord[] } {
  const validated: CandidateFactRequirement[] = [];
  const gaps: GapRecord[] = [];

  for (const r of requirements) {
    const identifier = `${r.targetCandidateKey}::${r.claimKey}`;
    const failure = provenanceFailureReason(r, FACT_REQUIREMENT_ALLOWED_BASES);
    if (failure) {
      gaps.push(provenanceReviewGap("CandidateFactRequirement", identifier, r, failure, r.targetCandidateKey, ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT"]));
      continue;
    }
    if (r.qualificationId !== qualificationId) {
      gaps.push({
        gapType: "EVIDENCE_NORMALIZATION_REVIEW",
        candidateKey: r.targetCandidateKey,
        evidenceAvailable: [`identifier=${identifier}`, `declaredQualification=${r.qualificationId}`],
        unresolved: `CandidateFactRequirement declares qualification "${r.qualificationId}", not the active pipeline qualification "${qualificationId}" -- it cannot create a requiredFactKey for this run.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
      });
      continue;
    }
    if (!requiredCandidateKeys.has(r.targetCandidateKey)) {
      gaps.push({
        gapType: "EVIDENCE_NORMALIZATION_REVIEW",
        candidateKey: r.targetCandidateKey,
        evidenceAvailable: [`identifier=${identifier}`],
        unresolved: `CandidateFactRequirement targets "${r.targetCandidateKey}", which is not a current required candidate.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
      });
      continue;
    }

    // CC-20 section 8: a REVIEW_PROPOSED requirement is eligible ONLY when
    // an ACTIVE (validated, non-conflicted) REQUIRED_CORE/REQUIRED_OPERATIONAL
    // SemanticAdjudication references this exact targetCandidateKey+claimKey.
    // Technical truth alone, qualification-level evidence alone, or a
    // plausible rationale alone can never promote it (section 7).
    const governingAdjudication = r.derivationStatus === "REVIEW_PROPOSED" ? activeGoverningAdjudicationsByIdentity.get(identifier) : undefined;
    const eligible =
      r.derivationStatus === "EXPLICIT_CURRICULUM_FACT"
        ? r.sourceEvidenceRefs.some((ref) => ref.role === "OFFICIAL_CURRICULUM" && validatedCurriculumEvidenceIds.has(ref.evidenceId))
        : r.derivationStatus === "EXPLICIT_ASSESSMENT_FACT"
          ? r.sourceEvidenceRefs.some((ref) => ref.role === "PUBLIC_ASSESSMENT" && validatedAssessmentEvidenceIds.has(ref.evidenceId))
          : governingAdjudication !== undefined; // REVIEW_PROPOSED

    if (!eligible) {
      gaps.push({
        gapType: "EVIDENCE_NORMALIZATION_REVIEW",
        candidateKey: r.targetCandidateKey,
        evidenceAvailable: [`identifier=${identifier}`, `derivationStatus=${r.derivationStatus}`],
        unresolved:
          r.derivationStatus === "REVIEW_PROPOSED"
            ? `CandidateFactRequirement for claimKey "${r.claimKey}" (derivationStatus=REVIEW_PROPOSED) has no active REQUIRED_CORE/REQUIRED_OPERATIONAL SemanticAdjudication -- exported for Project-Architect (or evidence-bound LLM) semantic adjudication but does not contribute to requiredFactKeys or technical coverage automatically.`
            : `CandidateFactRequirement for claimKey "${r.claimKey}" (derivationStatus=${r.derivationStatus}) does not cite role-and-id-matched validated primary-source evidence -- exported for Project-Architect review but does not contribute to requiredFactKeys or technical coverage automatically.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT"],
        notes: "REVIEW_PROPOSED requirements, and EXPLICIT_*_FACT requirements whose citation does not check out, are never silently promoted to a governing fact requirement.",
      });
      continue;
    }

    validated.push(r);
  }
  return { validated, gaps };
}

// ---------------------------------------------------------------------
// Claim-key-specific technical-truth coverage. A candidate's technical
// coverage is determined exclusively by its own declared
// `requiredFactKeys` matched against TECHNICAL_TRUTH claims by EXACT
// claimKey -- never by subject equality alone. CC-18C section 9-10:
// MULTIPLE TECHNICAL_TRUTH claims for the same (subject, claimKey) are
// resolved deterministically, never by array/source order -- agreeing
// claims attach with every supporting ref preserved; incompatible
// comparisonKinds produce FACTUAL_COMPARISON_REVIEW; disagreeing
// canonical values produce TECHNICAL_TRUTH_CONFLICT_REVIEW. Neither
// case is ever arbitrarily resolved to one value, and neither counts as
// covered -- a disputed fact can never make a candidate COMPLETE.
// ---------------------------------------------------------------------

/**
 * CC-20 section 15: assumes `requiredKeys.length > 0` -- the caller
 * (`attachFactualClaims`) leaves `technicalCoverageStatus` undefined for a
 * zero-requirement candidate and defers that classification (NOT_APPLICABLE
 * vs UNRESOLVED_REQUIREMENTS) to `finalizeKnowledgeBoundary`, which alone
 * has the structural/adjudication context to tell the two apart -- a
 * disputed claim (hasConflict) is CONFLICTED regardless of how many other
 * keys attached, and is never silently folded into PARTIAL.
 */
function computeCoverage(requiredKeys: readonly string[], attachedCount: number, hasConflict: boolean): { status: TechnicalCoverageStatus; confidence: ConfidenceLevel } {
  if (hasConflict) return { status: "CONFLICTED", confidence: "NONE" };
  if (attachedCount === requiredKeys.length) return { status: "COMPLETE", confidence: "HIGH" };
  if (attachedCount === 0) return { status: "UNRESOLVED_REQUIREMENTS", confidence: "NONE" };
  return { status: "PARTIAL", confidence: "MEDIUM" };
}

/**
 * CC-18B section 10: type-compatibility gate for `SourceFactualClaim` --
 * a TECHNICAL_TRUTH claim must use AUTHORITATIVE_TECHNICAL_FACT; any
 * other sourceRole must use SOURCE_FACTUAL_CLAIM. CC-18C: a provenance
 * failure is always reported, never silently dropped.
 */
export function validateFactualClaims(claims: readonly SourceFactualClaim[]): { validated: SourceFactualClaim[]; gaps: GapRecord[] } {
  const validated: SourceFactualClaim[] = [];
  const gaps: GapRecord[] = [];
  for (const c of claims) {
    const allowedBases = c.sourceRole === "TECHNICAL_TRUTH" ? TECHNICAL_CLAIM_ALLOWED_BASES : CURRICULUM_CLAIM_ALLOWED_BASES;
    const failure = provenanceFailureReason(c, allowedBases);
    if (failure) {
      gaps.push(provenanceReviewGap("SourceFactualClaim", c.evidenceId, c, failure, `${c.subject}::FACTUAL_CLAIM`, [c.sourceRole]));
      continue;
    }
    validated.push(c);
  }
  return { validated, gaps };
}

export function attachFactualClaims(
  candidates: readonly KnowledgeCandidate[],
  validatedFactRequirements: readonly CandidateFactRequirement[],
  validatedClaims: readonly SourceFactualClaim[],
): { candidates: KnowledgeCandidate[]; unmatched: SourceFactualClaim[]; gaps: GapRecord[] } {
  const requiredKeysByCandidate = new Map<string, Set<string>>();
  for (const r of validatedFactRequirements) {
    const set = requiredKeysByCandidate.get(r.targetCandidateKey) ?? new Set<string>();
    set.add(r.claimKey);
    requiredKeysByCandidate.set(r.targetCandidateKey, set);
  }

  const technicalClaims = validatedClaims.filter((c) => c.sourceRole === "TECHNICAL_TRUTH");
  const usedClaimSubjectKeys = new Set<string>();
  const gaps: GapRecord[] = [];

  const updated = candidates.map((c) => {
    const requiredKeys = [...(requiredKeysByCandidate.get(c.candidateKey) ?? new Set<string>())].sort();
    // CC-20 section 15: technicalCoverageStatus is left undefined here for a
    // zero-requirement candidate -- finalizeKnowledgeBoundary alone has the
    // structural/adjudication context to classify it NOT_APPLICABLE (a
    // genuine structural/non-mastery case) vs UNRESOLVED_REQUIREMENTS (a
    // mastery-bearing leaf never actually examined).
    if (requiredKeys.length === 0) return { ...c, requiredFactKeys: undefined, technicalCoverageStatus: undefined };

    const attached = new Map<string, string>();
    const attachedRefs: EvidenceRef[] = [];
    let hasConflict = false;

    for (const key of requiredKeys) {
      const matchingClaims = technicalClaims.filter((cl) => cl.claimKey === key && cl.subject === c.subject);
      if (matchingClaims.length === 0) continue; // genuinely unresolved -- no claim at all

      usedClaimSubjectKeys.add(`${key}::${c.subject}`);

      if (matchingClaims.length === 1) {
        attached.set(key, matchingClaims[0]!.normalizedClaimValue);
        attachedRefs.push({ role: "TECHNICAL_TRUTH", evidenceId: matchingClaims[0]!.evidenceId });
        continue;
      }

      // Multiple TECHNICAL_TRUTH claims for the same (subject, claimKey) --
      // resolve deterministically, never by which happened to come first.
      const kinds = new Set(matchingClaims.map((cl) => cl.comparisonKind));
      if (kinds.size > 1) {
        hasConflict = true;
        gaps.push({
          gapType: "FACTUAL_COMPARISON_REVIEW",
          candidateKey: c.candidateKey,
          evidenceAvailable: matchingClaims.map((cl) => `${cl.sourceRef} (kind=${cl.comparisonKind}): ${cl.normalizedClaimValue}`),
          unresolved: `Multiple TECHNICAL_TRUTH claims for claimKey "${key}" on subject "${c.subject}" use incompatible comparison kinds -- cannot be automatically resolved to a single taught value.`,
          legitimateResolverRoles: ["TECHNICAL_TRUTH"],
        });
        continue; // not attached, not counted as covered
      }

      const values = new Set(matchingClaims.map((cl) => cl.normalizedClaimValue));
      if (values.size > 1) {
        hasConflict = true;
        gaps.push({
          gapType: "TECHNICAL_TRUTH_CONFLICT_REVIEW",
          candidateKey: c.candidateKey,
          evidenceAvailable: matchingClaims.map((cl) => `${cl.sourceRef}: ${cl.normalizedClaimValue}`),
          unresolved: `Multiple TECHNICAL_TRUTH claims for claimKey "${key}" on subject "${c.subject}" disagree on the canonical value -- never arbitrarily resolved to one; the fact is not counted as covered while disputed.`,
          legitimateResolverRoles: ["TECHNICAL_TRUTH"],
        });
        continue; // not attached, not counted as covered
      }

      // All agree -- attach the shared value, preserve EVERY supporting evidence ref.
      attached.set(key, matchingClaims[0]!.normalizedClaimValue);
      for (const cl of matchingClaims) attachedRefs.push({ role: "TECHNICAL_TRUTH", evidenceId: cl.evidenceId });
    }

    const { status, confidence } = computeCoverage(requiredKeys, attached.size, hasConflict);
    return {
      ...c,
      requiredFactKeys: requiredKeys,
      factualStatementsByClaimKey: attached.size > 0 ? Object.fromEntries(attached) : undefined,
      technicalCoverageStatus: status,
      confidence: { ...c.confidence, technicalTruthConfidence: confidence },
      evidenceRefs: [...c.evidenceRefs, ...attachedRefs],
    };
  });

  const unmatched = technicalClaims.filter((c) => !usedClaimSubjectKeys.has(`${c.claimKey}::${c.subject}`));
  return { candidates: updated, unmatched, gaps };
}

// ---------------------------------------------------------------------
// Semantic adjudication (CC-20; CC-20A hardens evidence binding). A
// governed DECISION stage over ALREADY-EXISTING CandidateFactRequirement
// proposals -- never a new factual source, and never capable of
// introducing a new candidate, claimKey, subject or performance of its
// own (see types.ts's own header for the full rationale).
//
// CC-20A section 3-6: `supportingEvidenceRefs` are not decorative --
// every ref is resolved by (role, evidenceId) against the SAME validated
// evidence streams/registries the rest of this pipeline already produces
// (never a second, ungoverned evidence registry). A governing decision
// (REQUIRED_CORE/REQUIRED_OPERATIONAL) requires at least one ref that
// resolves to real OFFICIAL_CURRICULUM or PUBLIC_ASSESSMENT evidence for
// the EXACT target candidate, and every basis it declares must itself be
// compatible with the resolved support -- identically regardless of
// adjudicatorKind. TECHNICAL_TRUTH/QUALIFICATION_LEVEL evidence may
// corroborate or bound depth but can never substitute for curriculum/
// performance authority.
// ---------------------------------------------------------------------

/** CC-20A: what an individual `supportingEvidenceRefs` entry actually resolves to, mechanically -- never inferred from the adjudicator's own claim. */
type SemanticAdjudicationRefMatch = "CURRICULUM_MATCH" | "ASSESSMENT_MATCH" | "QUALIFICATION_LEVEL_MATCH" | "TECHNICAL_TRUTH_REAL" | "UNRESOLVED";

/** The validated evidence streams/registries a SemanticAdjudication's supporting refs are resolved against -- the SAME ones the rest of buildStandardPipeline already produces, never a second ungoverned registry. */
export interface SemanticAdjudicationSupportContext {
  /** evidenceId -> the exact candidateKey a validated, own-candidate-creating (non-DEPTH_QUALIFIER) CurriculumEvidence record resolves to. */
  readonly curriculumCandidateKeyByEvidenceId: ReadonlyMap<string, string>;
  /** evidenceId -> the exact candidateKey a validated AssessmentEvidence record resolves to. */
  readonly assessmentCandidateKeyByEvidenceId: ReadonlyMap<string, string>;
  /** evidenceId -> the exact candidateKey a validated QualificationLevelEvidence record applies to. */
  readonly qualificationLevelCandidateKeyByEvidenceId: ReadonlyMap<string, string>;
  /** evidenceIds of validated TECHNICAL_TRUTH SourceFactualClaims. */
  readonly technicalTruthClaimIds: ReadonlySet<string>;
  /** CC-20B section 3 route C: candidateKey -> that candidate's own already-resolved DepthBasis, needed only for OVERDEPTH_FORMALISM's "already governed by an explicit curriculum depth qualifier" route. */
  readonly candidateDepthBasisByKey: ReadonlyMap<string, DepthBasis>;
}

function classifySupportingRef(ref: EvidenceRef, targetCandidateKey: string, ctx: SemanticAdjudicationSupportContext): SemanticAdjudicationRefMatch {
  switch (ref.role) {
    case "OFFICIAL_CURRICULUM":
      return ctx.curriculumCandidateKeyByEvidenceId.get(ref.evidenceId) === targetCandidateKey ? "CURRICULUM_MATCH" : "UNRESOLVED";
    case "PUBLIC_ASSESSMENT":
      return ctx.assessmentCandidateKeyByEvidenceId.get(ref.evidenceId) === targetCandidateKey ? "ASSESSMENT_MATCH" : "UNRESOLVED";
    case "QUALIFICATION_LEVEL":
      return ctx.qualificationLevelCandidateKeyByEvidenceId.get(ref.evidenceId) === targetCandidateKey ? "QUALIFICATION_LEVEL_MATCH" : "UNRESOLVED";
    case "TECHNICAL_TRUTH":
      return ctx.technicalTruthClaimIds.has(ref.evidenceId) ? "TECHNICAL_TRUTH_REAL" : "UNRESOLVED";
    default:
      return "UNRESOLVED"; // a role reused from a derived/structural relation (e.g. SEMANTIC_ADJUDICATION itself) is never primary qualification authority
  }
}

/**
 * CC-20A section 5 (tightened CC-20B section 3-5): per-basis compatibility
 * against the RESOLVED support -- the basis enum must never become another
 * self-authorising label. `targetCandidateDepthBasis` is the ADJUDICATED
 * candidate's own already-resolved `DepthBasis` (from earlier pipeline
 * stages), needed only by `OVERDEPTH_FORMALISM`'s route C below.
 * `isGoverningDecision` distinguishes the one basis (`INSUFFICIENT_EVIDENCE`)
 * whose compatibility depends on which kind of decision it is attached to.
 */
function isBasisCompatibleWithSupport(basis: SemanticAdjudicationBasis, matches: readonly SemanticAdjudicationRefMatch[], targetCandidateDepthBasis: DepthBasis | undefined, isGoverningDecision: boolean): boolean {
  const has = (m: SemanticAdjudicationRefMatch) => matches.includes(m);
  switch (basis) {
    case "PUBLIC_ASSESSMENT_CALIBRATION":
      return has("ASSESSMENT_MATCH");
    case "COMMAND_VERB_AND_LEVEL":
      return has("CURRICULUM_MATCH") && has("QUALIFICATION_LEVEL_MATCH");
    case "SEMANTIC_NECESSITY":
    case "OPERATIONAL_NECESSITY":
      // Technical truth may corroborate an operation but can never substitute for curriculum/performance authority.
      return has("CURRICULUM_MATCH") || has("ASSESSMENT_MATCH");
    case "MULTIPLE_VALID_IMPLEMENTATIONS":
    case "REPRESENTATIVE_EXEMPLAR_SELECTION":
      // Non-mastery bases: supporting refs must still be real (not fabricated), but any recognised evidence stream suffices.
      return matches.some((m) => m !== "UNRESOLVED");
    case "OVERDEPTH_FORMALISM":
      // CC-20B section 3: makes a QUALIFICATION-DEPTH judgement ("this is
      // beyond the required learner depth") -- TECHNICAL_TRUTH alone can
      // prove a fact is true, never that the qualification excludes it.
      // Valid routes: (A) exact curriculum authority for this candidate
      // PLUS applicable qualification-level evidence; (B) assessment
      // evidence mapped to this exact candidate (assessment IS the
      // pipeline's own depth-calibration mechanism); (C) the candidate's
      // OWN depth is already governed by an explicit curriculum depth
      // qualifier (already represented by the governed curriculum/depth
      // model, without needing to re-cite it here).
      return (has("CURRICULUM_MATCH") && has("QUALIFICATION_LEVEL_MATCH")) || has("ASSESSMENT_MATCH") || targetCandidateDepthBasis === "EXPLICIT_CURRICULUM_DEPTH";
    case "INSUFFICIENT_EVIDENCE":
      // Can never support a governing decision, by definition -- but is
      // exactly the honest, non-governing admission behind UNRESOLVED/
      // REJECT_*, which needs no evidence of its own to be compatible.
      return !isGoverningDecision;
  }
}

export function validateSemanticAdjudications(
  adjudications: readonly SemanticAdjudication[],
  qualificationId: string,
  /** ALL proposed CandidateFactRequirements (every derivationStatus) -- an adjudication must reference a REAL, already-existing proposal; it can never manufacture one. */
  proposedFactRequirements: readonly CandidateFactRequirement[],
  supportContext: SemanticAdjudicationSupportContext,
): { validated: SemanticAdjudication[]; gaps: GapRecord[] } {
  const proposedByIdentity = new Map<string, CandidateFactRequirement>();
  for (const f of proposedFactRequirements) proposedByIdentity.set(`${f.targetCandidateKey}::${f.claimKey}`, f);

  const validated: SemanticAdjudication[] = [];
  const gaps: GapRecord[] = [];

  for (const a of adjudications) {
    const identifier = `${a.targetCandidateKey}::${a.claimKey}`;
    const failure = provenanceFailureReason(a, SEMANTIC_ADJUDICATION_ALLOWED_BASES);
    if (failure) {
      gaps.push(provenanceReviewGap("SemanticAdjudication", identifier, a, failure, a.targetCandidateKey, ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT", "TECHNICAL_TRUTH"]));
      continue;
    }
    if (a.qualificationId !== qualificationId) {
      gaps.push({
        gapType: "EVIDENCE_NORMALIZATION_REVIEW",
        candidateKey: a.targetCandidateKey,
        evidenceAvailable: [`identifier=${identifier}`, `declaredQualification=${a.qualificationId}`],
        unresolved: `SemanticAdjudication declares qualification "${a.qualificationId}", not the active pipeline qualification "${qualificationId}" -- it cannot influence this run.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
      });
      continue;
    }
    const referenced = proposedByIdentity.get(identifier);
    if (!referenced || referenced.qualificationId !== qualificationId) {
      gaps.push({
        gapType: "EVIDENCE_NORMALIZATION_REVIEW",
        candidateKey: a.targetCandidateKey,
        evidenceAvailable: [`identifier=${identifier}`],
        unresolved: `SemanticAdjudication references claimKey "${a.claimKey}" for candidate "${a.targetCandidateKey}", which does not correspond to any existing CandidateFactRequirement proposal for this qualification -- an adjudication may only resolve an already-proposed knowledge question, never manufacture a new one.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT", "TECHNICAL_TRUTH"],
      });
      continue;
    }

    // CC-20A sections 3-6 (CC-20B section 11 closes the non-governing gap):
    // every basis a decision declares must be compatible with what
    // mechanically resolved -- applies to EVERY adjudication, governing or
    // not, identically regardless of adjudicatorKind (HUMAN_PROJECT_ARCHITECT/
    // LLM_EVIDENCE_BOUND/RULE_ENGINE all pass through the same mechanical
    // gate; the label never bypasses it). A GOVERNING decision additionally
    // requires real, exact-candidate primary qualification support -- a
    // non-governing decision (CONTEXT_ONLY/REJECT_*/REPRESENTATIVE_EXEMPLAR/
    // UNRESOLVED) never needed that authority in the first place, but its
    // declared basis (e.g. OVERDEPTH_FORMALISM on a REJECT_OVERDEPTH) is
    // never exempt from being itself well-grounded -- an invalid basis is
    // rejected and reported for EVERY decision kind, never silently
    // discarded, so a malformed non-governing adjudication can never
    // silently prune a valid governing requirement or alter the knowledge
    // boundary.
    const isGoverningDecision = GOVERNING_ADJUDICATION_DECISIONS.includes(a.decision);
    const matches = a.supportingEvidenceRefs.map((ref) => classifySupportingRef(ref, a.targetCandidateKey, supportContext));
    const targetCandidateDepthBasis = supportContext.candidateDepthBasisByKey.get(a.targetCandidateKey);
    const hasPrimaryQualificationAuthority = matches.includes("CURRICULUM_MATCH") || matches.includes("ASSESSMENT_MATCH");
    const allBasesCompatible = a.adjudicationBasis.length > 0 && a.adjudicationBasis.every((b) => isBasisCompatibleWithSupport(b, matches, targetCandidateDepthBasis, isGoverningDecision));
    const governingSupportOk = !isGoverningDecision || hasPrimaryQualificationAuthority;

    if (!governingSupportOk || !allBasesCompatible) {
      gaps.push({
        gapType: "EVIDENCE_NORMALIZATION_REVIEW",
        candidateKey: a.targetCandidateKey,
        evidenceAvailable: [
          `identifier=${identifier}`,
          `decision=${a.decision}`,
          `adjudicatorKind=${a.adjudicatorKind}`,
          `adjudicationBasis=${a.adjudicationBasis.join(", ") || "(none)"}`,
          `supportingEvidenceRefs=${a.supportingEvidenceRefs.map((r) => `${r.role}:${r.evidenceId}`).join(", ") || "(none)"}`,
          `resolvedMatches=${matches.join(", ") || "(none)"}`,
        ],
        unresolved: !governingSupportOk
          ? `A governing SemanticAdjudication (${a.decision}) for claimKey "${a.claimKey}" on candidate "${a.targetCandidateKey}" cites no supportingEvidenceRefs entry that mechanically resolves, by role and evidenceId, to real validated OFFICIAL_CURRICULUM or PUBLIC_ASSESSMENT evidence for this exact candidate -- TECHNICAL_TRUTH and QUALIFICATION_LEVEL evidence may corroborate or bound depth but can never substitute for curriculum/performance authority, and no adjudicatorKind bypasses this gate.`
          : `A SemanticAdjudication (${a.decision}) for claimKey "${a.claimKey}" on candidate "${a.targetCandidateKey}" declares adjudicationBasis (${a.adjudicationBasis.join(", ")}) not fully compatible with its resolved supporting evidence -- the basis enum is never self-authorising, for governing or non-governing decisions alike (e.g. OVERDEPTH_FORMALISM can never be satisfied by TECHNICAL_TRUTH alone).`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT", "TECHNICAL_TRUTH"],
        notes:
          "A fabricated evidenceId, wrong role, wrong qualification, or wrong candidate mapping never validates merely because sourceRef/sourceLocator are non-empty or the adjudicator's own rationale asserts the evidence exists. This adjudication is entirely excluded from `active` -- it has zero semantic effect on requiredFactKeys, knowledgeBoundaryStatus, or any other adjudication's outcome.",
      });
      continue;
    }

    validated.push(a);
  }
  return { validated, gaps };
}

/**
 * CC-20 section 11: two or more validated adjudications giving
 * incompatible decisions for the same (qualificationId, targetCandidateKey,
 * claimKey) must never resolve by array order -- ALL of them are excluded
 * from `active` (no governing promotion for that identity) and a single
 * SEMANTIC_ADJUDICATION_CONFLICT gap is emitted.
 */
export function detectSemanticAdjudicationConflicts(validated: readonly SemanticAdjudication[]): { active: SemanticAdjudication[]; gaps: GapRecord[] } {
  const byIdentity = new Map<string, SemanticAdjudication[]>();
  for (const a of validated) {
    const key = `${a.qualificationId}::${a.targetCandidateKey}::${a.claimKey}`;
    const list = byIdentity.get(key) ?? [];
    list.push(a);
    byIdentity.set(key, list);
  }

  const gaps: GapRecord[] = [];
  const conflictedIdentities = new Set<string>();
  for (const [identity, group] of byIdentity) {
    const decisions = new Set(group.map((a) => a.decision));
    if (decisions.size > 1) {
      conflictedIdentities.add(identity);
      gaps.push({
        gapType: "SEMANTIC_ADJUDICATION_CONFLICT",
        candidateKey: group[0]!.targetCandidateKey,
        evidenceAvailable: group.map((a) => `decision=${a.decision} adjudicatorKind=${a.adjudicatorKind} decisionRef=${a.decisionRef}`),
        unresolved: `Multiple SemanticAdjudication records for claimKey "${group[0]!.claimKey}" on candidate "${group[0]!.targetCandidateKey}" disagree: ${[...decisions].join(", ")} -- never resolved by array order; no governing promotion occurs until the conflict is resolved.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT", "TECHNICAL_TRUTH"],
      });
    }
  }
  const active = validated.filter((a) => !conflictedIdentities.has(`${a.qualificationId}::${a.targetCandidateKey}::${a.claimKey}`));
  return { active, gaps };
}

/** CC-20 section 10: UNRESOLVED is the only decision that emits its own dedicated gap -- every other non-governing decision is preserved via StandardPipelineResult.semanticAdjudicationOutcomes instead, never silently lost. */
export function computeSemanticAdjudicationGaps(activeAdjudications: readonly SemanticAdjudication[]): GapRecord[] {
  return activeAdjudications
    .filter((a) => a.decision === "UNRESOLVED")
    .map((a) => ({
      gapType: "SEMANTIC_ADJUDICATION_GAP" as const,
      candidateKey: a.targetCandidateKey,
      evidenceAvailable: [`claimKey=${a.claimKey}`, `adjudicatorKind=${a.adjudicatorKind}`, `decisionRef=${a.decisionRef}`, ...a.adjudicationBasis.map((b) => `basis=${b}`)],
      unresolved: `Semantic adjudication for claimKey "${a.claimKey}" on candidate "${a.targetCandidateKey}" is UNRESOLVED: ${a.rationale}`,
      legitimateResolverRoles: ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT", "TECHNICAL_TRUTH"] as EvidenceRole[],
    }));
}

/** CC-20 section 9: REPRESENTATIVE_EXEMPLAR decisions only, in the dedicated shape -- never present in any candidate's requiredFactKeys. */
export function buildRepresentativeExemplars(activeAdjudications: readonly SemanticAdjudication[]): RepresentativeExemplarRecord[] {
  return activeAdjudications
    .filter((a) => a.decision === "REPRESENTATIVE_EXEMPLAR")
    .map((a) => ({ candidateKey: a.targetCandidateKey, claimKey: a.claimKey, decisionRef: a.decisionRef, adjudicatorKind: a.adjudicatorKind, rationale: a.rationale }));
}

// ---------------------------------------------------------------------
// Knowledge-boundary certification (CC-21A). A governed SEMANTIC
// CERTIFICATION over an EXISTING candidate's already-constructed
// knowledge/decomposition state -- never a new evidence source, never
// capable of creating a candidate, fact, claimKey, or scope of its own.
// Fact-level inclusion/exclusion remains governed entirely by
// CandidateFactRequirement + SemanticAdjudication; this stage only
// reviews whether the resulting SET is sufficient (see types.ts's own
// header for the full rationale).
// ---------------------------------------------------------------------

/** Shared by fingerprint computation, certification validation, and knowledge-boundary finalization -- ONE source of truth for "which REVIEW_PROPOSED claimKeys targeting this candidate are still pending (not yet promoted)". */
function computePendingReviewProposedClaimKeysByCandidate(
  proposedFactRequirements: readonly CandidateFactRequirement[],
  validatedFactRequirements: readonly CandidateFactRequirement[],
): Map<string, string[]> {
  const validatedIdentities = new Set(validatedFactRequirements.map((f) => `${f.targetCandidateKey}::${f.claimKey}`));
  const pending = new Map<string, string[]>();
  for (const f of proposedFactRequirements) {
    if (f.derivationStatus !== "REVIEW_PROPOSED") continue;
    const identity = `${f.targetCandidateKey}::${f.claimKey}`;
    if (validatedIdentities.has(identity)) continue; // promoted -- no longer pending
    const list = pending.get(f.targetCandidateKey) ?? [];
    list.push(f.claimKey);
    pending.set(f.targetCandidateKey, list);
  }
  return pending;
}

/** Shared by fingerprint computation and knowledge-boundary finalization -- subject -> the candidateKeys of its governed required children (parentSubject relationship), never a topic string. */
function computeGovernedChildCandidateKeysBySubject(candidates: readonly KnowledgeCandidate[]): Map<string, string[]> {
  const bySubject = new Map<string, string[]>();
  for (const c of candidates) {
    if (!REQUIRED_DISPOSITIONS.includes(c.disposition) || c.parentSubject === undefined) continue;
    const list = bySubject.get(c.parentSubject) ?? [];
    list.push(c.candidateKey);
    bySubject.set(c.parentSubject, list);
  }
  return bySubject;
}

/**
 * CC-21A section 5: canonical, deterministic, array-order-independent
 * identity of the EXACT semantic state a certification reviews. Every
 * input is explicitly sorted before hashing -- incidental array/object
 * insertion order never changes the result.
 */
export function computeKnowledgeBoundaryFingerprint(opts: {
  readonly qualificationId: string;
  readonly targetCandidateKey: string;
  readonly performanceType: string;
  readonly performanceProvenance: string | undefined;
  readonly requiredFactKeys: readonly string[];
  readonly pendingReviewProposedClaimKeys: readonly string[];
  readonly adjudicationOutcomes: readonly { claimKey: string; decision: string }[];
  readonly governedChildCandidateKeys: readonly string[];
}): string {
  const canonical = {
    qualificationId: opts.qualificationId,
    targetCandidateKey: opts.targetCandidateKey,
    performanceType: opts.performanceType,
    performanceProvenance: opts.performanceProvenance ?? "UNRESOLVED",
    requiredFactKeys: [...opts.requiredFactKeys].sort(),
    pendingReviewProposedClaimKeys: [...opts.pendingReviewProposedClaimKeys].sort(),
    adjudicationOutcomes: [...opts.adjudicationOutcomes].map((a) => `${a.claimKey}::${a.decision}`).sort(),
    governedChildCandidateKeys: [...opts.governedChildCandidateKeys].sort(),
  };
  return createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
}

/** Computes the current boundary fingerprint for every candidate, from the SAME pending-facts/adjudication/child-decomposition state finalizeKnowledgeBoundary itself uses -- the two can never drift apart. */
export function computeCandidateBoundaryFingerprints(
  candidates: readonly KnowledgeCandidate[],
  qualificationId: string,
  proposedFactRequirements: readonly CandidateFactRequirement[],
  validatedFactRequirements: readonly CandidateFactRequirement[],
  activeAdjudications: readonly SemanticAdjudication[],
): ReadonlyMap<string, string> {
  const pendingByCandidate = computePendingReviewProposedClaimKeysByCandidate(proposedFactRequirements, validatedFactRequirements);
  const childrenBySubject = computeGovernedChildCandidateKeysBySubject(candidates);

  const adjudicationsByCandidate = new Map<string, { claimKey: string; decision: string }[]>();
  for (const a of activeAdjudications) {
    const list = adjudicationsByCandidate.get(a.targetCandidateKey) ?? [];
    list.push({ claimKey: a.claimKey, decision: a.decision });
    adjudicationsByCandidate.set(a.targetCandidateKey, list);
  }

  const fingerprints = new Map<string, string>();
  for (const c of candidates) {
    fingerprints.set(
      c.candidateKey,
      computeKnowledgeBoundaryFingerprint({
        qualificationId,
        targetCandidateKey: c.candidateKey,
        performanceType: c.performanceType,
        performanceProvenance: c.performanceProvenance,
        requiredFactKeys: c.requiredFactKeys ?? [],
        pendingReviewProposedClaimKeys: pendingByCandidate.get(c.candidateKey) ?? [],
        adjudicationOutcomes: adjudicationsByCandidate.get(c.candidateKey) ?? [],
        governedChildCandidateKeys: childrenBySubject.get(c.subject) ?? [],
      }),
    );
  }
  return fingerprints;
}

/**
 * CC-21A sections 4-9: validates every `KnowledgeBoundaryCertification`
 * against (a) provenance, (b) qualification match, (c) resolving to a
 * real current required candidate, (d) an EXACT match against the
 * pipeline's own currently-calculated boundary fingerprint for that
 * candidate (a stale certification -- one whose fingerprint doesn't
 * match, because a fact was added/removed, an adjudication changed, or
 * child decomposition changed -- never survives automatically), (e) real
 * supporting evidence resolving to OFFICIAL_CURRICULUM or PUBLIC_ASSESSMENT
 * for the exact candidate (TECHNICAL_TRUTH alone can never establish
 * completeness), and (f) for COMPLETE specifically, no unresolved
 * REVIEW_PROPOSED fact requirement remaining for the candidate -- COMPLETE
 * is never a shortcut around fact-level adjudication. Every rejection is
 * reported via KNOWLEDGE_BOUNDARY_CERTIFICATION_GAP, never silently
 * dropped, identically regardless of adjudicatorKind.
 */
export function validateKnowledgeBoundaryCertifications(
  certifications: readonly KnowledgeBoundaryCertification[],
  qualificationId: string,
  requiredCandidateKeys: ReadonlySet<string>,
  fingerprintByCandidateKey: ReadonlyMap<string, string>,
  pendingReviewProposedClaimKeysByCandidate: ReadonlyMap<string, string[]>,
  supportContext: SemanticAdjudicationSupportContext,
): { validated: KnowledgeBoundaryCertification[]; gaps: GapRecord[] } {
  const validated: KnowledgeBoundaryCertification[] = [];
  const gaps: GapRecord[] = [];

  for (const cert of certifications) {
    const identifier = cert.targetCandidateKey;
    const failure = provenanceFailureReason(cert, KNOWLEDGE_BOUNDARY_CERTIFICATION_ALLOWED_BASES);
    if (failure) {
      gaps.push(provenanceReviewGap("KnowledgeBoundaryCertification", cert.certificationRef, cert, failure, identifier, ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT"]));
      continue;
    }
    if (cert.qualificationId !== qualificationId) {
      gaps.push({
        gapType: "KNOWLEDGE_BOUNDARY_CERTIFICATION_GAP",
        candidateKey: identifier,
        evidenceAvailable: [`certificationRef=${cert.certificationRef}`, `declaredQualification=${cert.qualificationId}`],
        unresolved: `KnowledgeBoundaryCertification declares qualification "${cert.qualificationId}", not the active pipeline qualification "${qualificationId}" -- it cannot influence this run.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
      });
      continue;
    }
    if (!requiredCandidateKeys.has(cert.targetCandidateKey)) {
      gaps.push({
        gapType: "KNOWLEDGE_BOUNDARY_CERTIFICATION_GAP",
        candidateKey: identifier,
        evidenceAvailable: [`certificationRef=${cert.certificationRef}`],
        unresolved: `KnowledgeBoundaryCertification targets "${cert.targetCandidateKey}", which is not a current required candidate.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
      });
      continue;
    }

    const currentFingerprint = fingerprintByCandidateKey.get(cert.targetCandidateKey);
    if (currentFingerprint === undefined || cert.boundaryFingerprint !== currentFingerprint) {
      gaps.push({
        gapType: "KNOWLEDGE_BOUNDARY_CERTIFICATION_GAP",
        candidateKey: identifier,
        evidenceAvailable: [`certificationRef=${cert.certificationRef}`, `certifiedFingerprint=${cert.boundaryFingerprint}`, `currentFingerprint=${currentFingerprint ?? "(none)"}`],
        unresolved: `KnowledgeBoundaryCertification for "${cert.targetCandidateKey}" is STALE -- its boundaryFingerprint does not equal the pipeline's current calculated fingerprint for this candidate's knowledge state (a fact proposal, adjudication, performance provenance, or governed child decomposition changed since certification). A historic certification never survives a changed knowledge boundary automatically.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT", "TECHNICAL_TRUTH"],
      });
      continue;
    }

    const matches = cert.supportingEvidenceRefs.map((ref) => classifySupportingRef(ref, cert.targetCandidateKey, supportContext));
    const hasPrimaryQualificationAuthority = matches.includes("CURRICULUM_MATCH") || matches.includes("ASSESSMENT_MATCH");
    if (!hasPrimaryQualificationAuthority) {
      gaps.push({
        gapType: "KNOWLEDGE_BOUNDARY_CERTIFICATION_GAP",
        candidateKey: identifier,
        evidenceAvailable: [
          `certificationRef=${cert.certificationRef}`,
          `decision=${cert.decision}`,
          `adjudicatorKind=${cert.adjudicatorKind}`,
          `supportingEvidenceRefs=${cert.supportingEvidenceRefs.map((r) => `${r.role}:${r.evidenceId}`).join(", ") || "(none)"}`,
        ],
        unresolved: `KnowledgeBoundaryCertification for "${cert.targetCandidateKey}" cites no supportingEvidenceRefs entry that mechanically resolves, by role and evidenceId, to real validated OFFICIAL_CURRICULUM or PUBLIC_ASSESSMENT evidence for this exact candidate -- TECHNICAL_TRUTH may support factual correctness but can never establish qualification completeness on its own, and no adjudicatorKind bypasses this gate.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT"],
      });
      continue;
    }

    if (cert.decision === "COMPLETE" && (pendingReviewProposedClaimKeysByCandidate.get(cert.targetCandidateKey)?.length ?? 0) > 0) {
      gaps.push({
        gapType: "KNOWLEDGE_BOUNDARY_CERTIFICATION_GAP",
        candidateKey: identifier,
        evidenceAvailable: [`certificationRef=${cert.certificationRef}`, `pendingReviewProposedClaimKeys=${(pendingReviewProposedClaimKeysByCandidate.get(cert.targetCandidateKey) ?? []).join(", ")}`],
        unresolved: `A COMPLETE KnowledgeBoundaryCertification for "${cert.targetCandidateKey}" is invalid while an unresolved REVIEW_PROPOSED CandidateFactRequirement remains for this candidate -- fact-level questions must be resolved first; COMPLETE is never a shortcut around fact-level adjudication.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT", "TECHNICAL_TRUTH"],
      });
      continue;
    }

    validated.push(cert);
  }
  return { validated, gaps };
}

/**
 * CC-21A section 15: two or more validated certifications giving
 * incompatible decisions for the same (qualificationId, targetCandidateKey,
 * boundaryFingerprint) are never resolved by array order -- ALL of them
 * are excluded from `active` (no GOVERNED status for that candidate) and
 * a single KNOWLEDGE_BOUNDARY_CERTIFICATION_CONFLICT gap is emitted.
 */
export function detectKnowledgeBoundaryCertificationConflicts(validated: readonly KnowledgeBoundaryCertification[]): { active: KnowledgeBoundaryCertification[]; gaps: GapRecord[] } {
  const byIdentity = new Map<string, KnowledgeBoundaryCertification[]>();
  for (const cert of validated) {
    const key = `${cert.qualificationId}::${cert.targetCandidateKey}::${cert.boundaryFingerprint}`;
    const list = byIdentity.get(key) ?? [];
    list.push(cert);
    byIdentity.set(key, list);
  }

  const gaps: GapRecord[] = [];
  const conflictedIdentities = new Set<string>();
  for (const [identity, group] of byIdentity) {
    const decisions = new Set(group.map((c) => c.decision));
    if (decisions.size > 1) {
      conflictedIdentities.add(identity);
      gaps.push({
        gapType: "KNOWLEDGE_BOUNDARY_CERTIFICATION_CONFLICT",
        candidateKey: group[0]!.targetCandidateKey,
        evidenceAvailable: group.map((c) => `decision=${c.decision} adjudicatorKind=${c.adjudicatorKind} certificationRef=${c.certificationRef}`),
        unresolved: `Multiple KnowledgeBoundaryCertification records for candidate "${group[0]!.targetCandidateKey}" at the same boundary fingerprint disagree: ${[...decisions].join(", ")} -- never resolved by array order; no GOVERNED status while conflicted.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT", "TECHNICAL_TRUTH"],
      });
    }
  }
  const active = validated.filter((c) => !conflictedIdentities.has(`${c.qualificationId}::${c.targetCandidateKey}::${c.boundaryFingerprint}`));
  return { active, gaps };
}

// ---------------------------------------------------------------------
// Knowledge-boundary finalization (CC-20 sections 12-15; CC-21A closes the
// certification false-green). Runs LAST, once requiredFactKeys/
// technicalCoverageStatus, active adjudications, AND active knowledge-
// boundary certifications are all known. Detects a genuine structural
// parent from the governed candidate-relationship graph (`parentSubject`),
// never a topic string, and closes the false-green gaps the blind
// back-test (CC-20) and its hardened rerun (CC-21) exposed: a required,
// mastery-bearing leaf with zero governing facts, no decomposition, and
// no adjudication history is UNRESOLVED and gets KNOWLEDGE_DECOMPOSITION_GAP;
// a candidate whose governing facts are merely mechanically resolved, with
// no valid COMPLETE KnowledgeBoundaryCertification at the current
// fingerprint, is never GOVERNED -- it gets ADJUDICATION_REQUIRED and
// KNOWLEDGE_BOUNDARY_CERTIFICATION_GAP instead. GOVERNED now means
// semantically certified knowledge-boundary completeness, never merely
// "every currently-known requiredFactKey happens to have technical truth".
// ---------------------------------------------------------------------

export function finalizeKnowledgeBoundary(
  candidates: readonly KnowledgeCandidate[],
  proposedFactRequirements: readonly CandidateFactRequirement[],
  validatedFactRequirements: readonly CandidateFactRequirement[],
  activeAdjudications: readonly SemanticAdjudication[],
  /** CC-21A: ACTIVE (validated, non-conflicted, current-fingerprint) certifications, keyed by targetCandidateKey. GOVERNED is reachable ONLY through a COMPLETE entry here. */
  activeCertificationsByCandidateKey: ReadonlyMap<string, KnowledgeBoundaryCertification> = new Map(),
): { candidates: KnowledgeCandidate[]; gaps: GapRecord[] } {
  const structuralParentSubjects = new Set(
    candidates.filter((c) => REQUIRED_DISPOSITIONS.includes(c.disposition) && c.parentSubject !== undefined).map((c) => c.parentSubject!),
  );

  const pendingReviewProposedByCandidate = computePendingReviewProposedClaimKeysByCandidate(proposedFactRequirements, validatedFactRequirements);

  const anyAdjudicationByCandidate = new Map<string, SemanticAdjudication[]>();
  for (const a of activeAdjudications) {
    const list = anyAdjudicationByCandidate.get(a.targetCandidateKey) ?? [];
    list.push(a);
    anyAdjudicationByCandidate.set(a.targetCandidateKey, list);
  }

  const gaps: GapRecord[] = [];

  /**
   * CC-21A sections 8-13: applies the certification exactly once the
   * candidate's fact-level state is otherwise settled (no pending
   * REVIEW_PROPOSED fact). `technicalCoverageStatus` is reported as
   * computed -- COMPLETE knowledge-boundary certification is a distinct,
   * independent axis from technical-source completeness (section 8), so a
   * GOVERNED candidate may still carry an incomplete technicalCoverageStatus
   * and a visible TECHNICAL_TRUTH_GAP.
   */
  function applyCertification(c: KnowledgeCandidate, coverage: TechnicalCoverageStatus): KnowledgeCandidate {
    const certification = activeCertificationsByCandidateKey.get(c.candidateKey);
    if (certification?.decision === "COMPLETE") {
      return { ...c, knowledgeBoundaryStatus: "GOVERNED" as const, technicalCoverageStatus: coverage };
    }
    if (certification?.decision === "PARTIAL") {
      gaps.push({
        gapType: "KNOWLEDGE_BOUNDARY_CERTIFICATION_GAP",
        candidateKey: c.candidateKey,
        evidenceAvailable: [`certificationRef=${certification.certificationRef}`, `technicalCoverageStatus=${coverage}`],
        unresolved: `KnowledgeBoundaryCertification for "${c.candidateKey}" certified PARTIAL: ${certification.rationale}`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT", "TECHNICAL_TRUTH"],
      });
      return { ...c, knowledgeBoundaryStatus: "PARTIAL" as const, technicalCoverageStatus: coverage };
    }
    if (certification?.decision === "UNRESOLVED") {
      gaps.push({
        gapType: "KNOWLEDGE_BOUNDARY_CERTIFICATION_GAP",
        candidateKey: c.candidateKey,
        evidenceAvailable: [`certificationRef=${certification.certificationRef}`],
        unresolved: `KnowledgeBoundaryCertification for "${c.candidateKey}" certified UNRESOLVED: ${certification.rationale}`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT", "TECHNICAL_TRUTH"],
      });
      return { ...c, knowledgeBoundaryStatus: "UNRESOLVED" as const, technicalCoverageStatus: coverage };
    }
    // CC-21A section 1/12: no valid certification at the current fingerprint --
    // mechanically resolved fact coverage (or its deliberate absence) is
    // NEVER, by itself, sufficient to certify the knowledge boundary complete.
    gaps.push({
      gapType: "KNOWLEDGE_BOUNDARY_CERTIFICATION_GAP",
      candidateKey: c.candidateKey,
      evidenceAvailable: [c.rationale, `technicalCoverageStatus=${coverage}`, `requiredFactKeys=${(c.requiredFactKeys ?? []).join(", ") || "(none)"}`],
      unresolved: `"${c.subject}" has no valid KnowledgeBoundaryCertification at the current boundary fingerprint -- mechanically resolved (or deliberately absent) fact coverage alone never certifies the knowledge boundary complete; an independent semantic decision is required before this candidate can be GOVERNED.`,
      legitimateResolverRoles: ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT", "TECHNICAL_TRUTH"],
    });
    return { ...c, knowledgeBoundaryStatus: "ADJUDICATION_REQUIRED" as const, technicalCoverageStatus: coverage };
  }

  const updated = candidates.map((c) => {
    // CC-20A section 8-9: a governed child relationship (some required
    // candidate's parentSubject naming this subject) is NECESSARY but NOT
    // SUFFICIENT -- this node must ALSO be demonstrably an explicitly
    // structural curriculum node (currently: a validated RANGE_CATEGORY
    // record) before its own, possibly-independent learner performance is
    // assumed fully represented by its children. A PRIMARY_REQUIREMENT is
    // never STRUCTURALLY_DECOMPOSED merely because a child points to it.
    // No separate certification is required for a genuine structural node.
    if (c.isExplicitlyStructuralNode === true && structuralParentSubjects.has(c.subject) && REQUIRED_DISPOSITIONS.includes(c.disposition)) {
      return { ...c, knowledgeBoundaryStatus: "STRUCTURALLY_DECOMPOSED" as const, technicalCoverageStatus: "NOT_APPLICABLE" as const };
    }

    if (!REQUIRED_DISPOSITIONS.includes(c.disposition)) {
      return { ...c, technicalCoverageStatus: c.technicalCoverageStatus ?? ("NOT_APPLICABLE" as const) };
    }

    const pendingKeys = pendingReviewProposedByCandidate.get(c.candidateKey) ?? [];
    const requiredCount = c.requiredFactKeys?.length ?? 0;

    if (requiredCount === 0) {
      if (pendingKeys.length > 0) {
        return { ...c, knowledgeBoundaryStatus: "ADJUDICATION_REQUIRED" as const, technicalCoverageStatus: "UNRESOLVED_REQUIREMENTS" as const };
      }
      const everExamined = (anyAdjudicationByCandidate.get(c.candidateKey)?.length ?? 0) > 0;
      if (everExamined) {
        // Deliberately, auditably closed at zero requirements (e.g. every
        // proposal was CONTEXT_ONLY/REJECT_*) -- distinct from never
        // having been examined at all. Still requires a valid COMPLETE
        // certification to reach GOVERNED (CC-21A section 12).
        return applyCertification(c, "NOT_APPLICABLE");
      }
      gaps.push({
        gapType: "KNOWLEDGE_DECOMPOSITION_GAP",
        candidateKey: c.candidateKey,
        evidenceAvailable: [c.rationale],
        unresolved: `"${c.subject}" is a required, mastery-bearing candidate with no governed child decomposition and no governing requiredFactKeys, and was never examined by any semantic adjudication -- it is never reported as though technical knowledge is simply not required.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT", "TECHNICAL_TRUTH"],
      });
      return { ...c, knowledgeBoundaryStatus: "UNRESOLVED" as const, technicalCoverageStatus: "UNRESOLVED_REQUIREMENTS" as const };
    }

    // requiredCount > 0 -- some governing facts already exist.
    if (pendingKeys.length > 0) {
      // Never falsely COMPLETE while a sibling review-proposed fact for
      // this same candidate is still pending adjudication.
      const coverage = c.technicalCoverageStatus === "COMPLETE" ? ("PARTIAL" as const) : (c.technicalCoverageStatus ?? ("PARTIAL" as const));
      return { ...c, knowledgeBoundaryStatus: "ADJUDICATION_REQUIRED" as const, technicalCoverageStatus: coverage };
    }

    // CC-21A section 1/12-13: fact coverage mechanically resolved (or not)
    // is reported as-is, but GOVERNED is reachable ONLY through a valid
    // COMPLETE certification -- never merely because coverage === COMPLETE.
    const coverage = c.technicalCoverageStatus ?? ("UNRESOLVED_REQUIREMENTS" as const);
    return applyCertification(c, coverage);
  });

  return { candidates: updated, gaps };
}

// ---------------------------------------------------------------------
// Independent factual-claim conflict detection (curriculum/provider vs
// technical truth). comparisonKind compatibility gates comparison -- an
// incompatible pairing produces FACTUAL_COMPARISON_REVIEW rather than a
// guessed conflict or false agreement.
// ---------------------------------------------------------------------

export function detectFactualConflicts(claims: readonly SourceFactualClaim[], comparisonRoles: readonly EvidenceRole[] = ["OFFICIAL_CURRICULUM"]): GapRecord[] {
  const byClaimKey = new Map<string, SourceFactualClaim[]>();
  for (const c of claims) {
    const list = byClaimKey.get(c.claimKey) ?? [];
    list.push(c);
    byClaimKey.set(c.claimKey, list);
  }

  const gaps: GapRecord[] = [];
  for (const group of byClaimKey.values()) {
    const technical = group.filter((c) => c.sourceRole === "TECHNICAL_TRUTH");
    const comparison = group.filter((c) => comparisonRoles.includes(c.sourceRole));
    for (const t of technical) {
      for (const n of comparison) {
        if (n.comparisonKind !== t.comparisonKind) {
          gaps.push({
            gapType: "FACTUAL_COMPARISON_REVIEW",
            candidateKey: `${t.subject}::FACTUAL_CLAIM`,
            evidenceAvailable: [`${n.sourceRole} (${n.sourceRef}, kind=${n.comparisonKind}): ${n.normalizedClaimValue}`, `TECHNICAL_TRUTH (${t.sourceRef}, kind=${t.comparisonKind}): ${t.normalizedClaimValue}`],
            unresolved: `Claim "${t.claimKey}" for subject "${t.subject}" cannot be automatically compared -- ${n.sourceRole} declares comparisonKind "${n.comparisonKind}" while TECHNICAL_TRUTH declares "${t.comparisonKind}".`,
            legitimateResolverRoles: ["OFFICIAL_CURRICULUM", "TECHNICAL_TRUTH"],
            notes: "Neither an automatic conflict nor a false agreement -- incompatible comparison kinds require Project-Architect review.",
          });
          continue;
        }
        if (n.normalizedClaimValue === t.normalizedClaimValue) continue;
        gaps.push({
          gapType: "CURRICULUM_TECHNICAL_CONFLICT",
          candidateKey: `${t.subject}::FACTUAL_CLAIM`,
          evidenceAvailable: [`${n.sourceRole} (${n.sourceRef}): ${n.normalizedClaimValue}`, `TECHNICAL_TRUTH (${t.sourceRef}): ${t.normalizedClaimValue}`],
          unresolved: `Claim "${t.claimKey}" for subject "${t.subject}" differs between ${n.sourceRole} ("${n.normalizedClaimValue}") and approved TECHNICAL_TRUTH ("${t.normalizedClaimValue}").`,
          legitimateResolverRoles: ["TECHNICAL_TRUTH"],
          notes: "Scope authority (whether the topic is in scope) remains with curriculum evidence; factual authority (what is taught) remains with technical-truth evidence. The approved technical-truth value is retained as the taught fact; the conflicting claim is never promoted into the domain-knowledge layer.",
        });
      }
    }
  }
  return gaps;
}

/** Diagnostic-only comparison of OPTIONAL_CALIBRATION factual claims against approved TECHNICAL_TRUTH. Never merged into StandardPipelineResult.gaps. */
export function compareCalibrationFactualClaims(calibrationClaims: readonly SourceFactualClaim[], technicalClaims: readonly SourceFactualClaim[]): GapRecord[] {
  return detectFactualConflicts([...calibrationClaims, ...technicalClaims], ["OPTIONAL_CALIBRATION"]);
}

// ---------------------------------------------------------------------
// Assessment family-pattern generalisation. Operates ONLY on the
// validated assessment stream; `familyKey` only counts when it resolves
// to a governed CurriculumFamily listing the item's own subject.
// ---------------------------------------------------------------------

export function detectAssessmentPatternCandidates(validatedAssessment: readonly AssessmentEvidence[], curriculumFamilies: readonly CurriculumFamily[]): { candidates: KnowledgeCandidate[]; gaps: GapRecord[] } {
  const familyByKey = new Map(curriculumFamilies.map((f) => [f.familyKey, f] as const));

  const byFamilyAndType = new Map<string, AssessmentEvidence[]>();
  for (const e of validatedAssessment) {
    if (!e.familyKey) continue;
    const family = familyByKey.get(e.familyKey);
    if (!family || !family.memberSubjects.includes(e.subject)) continue;
    const key = `${e.familyKey}::${e.performanceType}`;
    const list = byFamilyAndType.get(key) ?? [];
    list.push(e);
    byFamilyAndType.set(key, list);
  }

  const candidates: KnowledgeCandidate[] = [];
  const gaps: GapRecord[] = [];
  for (const items of byFamilyAndType.values()) {
    const distinctSubjects = [...new Set(items.map((i) => i.subject))];
    if (distinctSubjects.length < 2) continue;

    const familyKey = items[0]!.familyKey!;
    const performanceType = items[0]!.performanceType;
    const patternKey = `${familyKey}::${performanceType}::PATTERN`;

    candidates.push({
      candidateKey: patternKey,
      subject: familyKey,
      performanceType,
      disposition: "REVIEW_REQUIRED",
      confidence: { scopeConfidence: "MEDIUM", depthConfidence: "LOW", technicalTruthConfidence: "NONE" },
      rationale: `Repeated ${performanceType} assessment evidence, from the validated stream only, across ${distinctSubjects.length} distinct, governed members of the "${familyKey}" family (${distinctSubjects.join(", ")}) suggests a possible family-wide performance pattern. NOT auto-generalised to untested members and remains REVIEW_REQUIRED unless explicit curriculum wording independently supports family-wide generalisation.`,
      evidenceRefs: items.map((i) => ({ role: i.role, evidenceId: i.evidenceId })),
      assessmentPattern: { familyKey, evidencedMembers: distinctSubjects },
    });
    gaps.push({
      gapType: "ASSESSMENT_GENERALISATION_REVIEW",
      candidateKey: patternKey,
      evidenceAvailable: distinctSubjects.map((m) => `${m} (${performanceType})`),
      unresolved: `Whether untested members of the "${familyKey}" family share this same ${performanceType} requirement is unresolved.`,
      legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
    });
  }
  return { candidates, gaps };
}

// ---------------------------------------------------------------------
// Governed category/family relationship validation. An arbitrary
// relation object with non-empty strings must not become governed
// merely because it was supplied -- it must belong to the active
// qualification, carry type-compatible provenance, and reference
// subjects that actually exist in normalized evidence. CC-18C:
// provenance failure always reported.
// ---------------------------------------------------------------------

export function validateCurriculumSubjectRelations(relations: readonly CurriculumSubjectRelation[], qualificationId: string, knownSubjects: ReadonlySet<string>): { validated: CurriculumSubjectRelation[]; gaps: GapRecord[] } {
  const validated: CurriculumSubjectRelation[] = [];
  const gaps: GapRecord[] = [];
  for (const r of relations) {
    const key = `${r.subject}::${r.underCategory}`;
    const failure = provenanceFailureReason(r, RELATION_ALLOWED_BASES);
    if (failure) {
      gaps.push(provenanceReviewGap("CurriculumSubjectRelation", r.evidenceId, r, failure, key, ["OFFICIAL_CURRICULUM"]));
      continue;
    }
    if (r.qualificationId !== qualificationId) continue; // not this run's concern
    if (!knownSubjects.has(r.subject) || !knownSubjects.has(r.underCategory)) {
      gaps.push({
        gapType: "EVIDENCE_NORMALIZATION_REVIEW",
        candidateKey: key,
        evidenceAvailable: [`evidenceId=${r.evidenceId}`, `subject=${r.subject}`, `underCategory=${r.underCategory}`],
        unresolved: `Relation references a subject not present in normalized curriculum/assessment evidence -- an arbitrary relation label is never governed merely because it was supplied.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
      });
      continue;
    }
    validated.push(r);
  }
  return { validated, gaps };
}

export function validateCurriculumFamilies(families: readonly CurriculumFamily[], qualificationId: string, knownSubjects: ReadonlySet<string>): { validated: CurriculumFamily[]; gaps: GapRecord[] } {
  const validated: CurriculumFamily[] = [];
  const gaps: GapRecord[] = [];
  for (const f of families) {
    const failure = provenanceFailureReason(f, RELATION_ALLOWED_BASES);
    if (failure) {
      gaps.push(provenanceReviewGap("CurriculumFamily", f.evidenceId, f, failure, f.familyKey, ["OFFICIAL_CURRICULUM"]));
      continue;
    }
    if (f.qualificationId !== qualificationId) continue;
    const unknownMembers = f.memberSubjects.filter((s) => !knownSubjects.has(s));
    if (unknownMembers.length > 0) {
      gaps.push({
        gapType: "EVIDENCE_NORMALIZATION_REVIEW",
        candidateKey: f.familyKey,
        evidenceAvailable: [`evidenceId=${f.evidenceId}`, `unknownMembers=${unknownMembers.join(", ")}`],
        unresolved: `CurriculumFamily "${f.familyKey}" references member subject(s) not present in normalized curriculum/assessment evidence: ${unknownMembers.join(", ")}.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
      });
      continue;
    }
    validated.push(f);
  }
  return { validated, gaps };
}

// ---------------------------------------------------------------------
// Category breadth status. A breadth gap is produced from the RANGE_
// CATEGORY curriculum evidence's OWN declared breadth status, entirely
// independent of whether any assessment evidence exists. Only the
// validated assessment stream and governed subject relations count as
// evidenced sub-items.
// ---------------------------------------------------------------------

export function computeCategoryBreadthOutcomes(
  validatedCurriculum: readonly CurriculumEvidence[],
  validatedAssessment: readonly AssessmentEvidence[],
  validatedSubjectRelations: readonly CurriculumSubjectRelation[],
): { candidates: KnowledgeCandidate[]; gaps: GapRecord[] } {
  const governedPairs = new Set(validatedSubjectRelations.map((r) => `${r.subject}::${r.underCategory}`));

  const categories = new Map<string, CurriculumEvidence[]>();
  for (const e of validatedCurriculum) {
    if (e.normalizationKind !== "RANGE_CATEGORY") continue;
    const list = categories.get(e.subject) ?? [];
    list.push(e);
    categories.set(e.subject, list);
  }

  const candidates: KnowledgeCandidate[] = [];
  const gaps: GapRecord[] = [];
  for (const [subject, records] of categories) {
    const breadthStatus = records.map((r) => r.breadthStatus).find((s) => s !== undefined) ?? "UNKNOWN";
    if (breadthStatus === "ENUMERATED_COMPLETE") continue;

    const governedEvidencedSubjects = [...new Set(validatedAssessment.filter((a) => a.underCategory === subject && governedPairs.has(`${a.subject}::${subject}`)).map((a) => a.subject))];

    const gapKey = `${subject}::unresolved-breadth`;
    if (breadthStatus === "OPEN_OR_UNDERSPECIFIED") {
      candidates.push({
        candidateKey: gapKey,
        subject: gapKey,
        performanceType: "OTHER",
        disposition: "OPEN_SCOPE_GAP",
        confidence: { scopeConfidence: "HIGH", depthConfidence: "NONE", technicalTruthConfidence: "NONE" },
        rationale: `"${subject}" is declared OPEN_OR_UNDERSPECIFIED by curriculum normalization. ${governedEvidencedSubjects.length} governed sub-item(s) directly assessment-evidenced (${governedEvidencedSubjects.join(", ") || "none"}); the category's remaining internal breadth is neither confirmed nor excluded -- produced regardless of whether any assessment evidence exists.`,
        evidenceRefs: records.map((r) => ({ role: r.role, evidenceId: r.evidenceId })),
      });
      gaps.push({
        gapType: "SCOPE_BREADTH_GAP",
        candidateKey: gapKey,
        evidenceAvailable: governedEvidencedSubjects,
        unresolved: `Full internal breadth of "${subject}" beyond the directly evidenced sub-item(s) is unresolved.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT"],
      });
    } else {
      candidates.push({
        candidateKey: gapKey,
        subject: gapKey,
        performanceType: "OTHER",
        disposition: "REVIEW_REQUIRED",
        confidence: { scopeConfidence: "HIGH", depthConfidence: "NONE", technicalTruthConfidence: "NONE" },
        rationale: `"${subject}"'s breadth status has not been declared by curriculum normalization (defaults to UNKNOWN, never silently treated as complete or as underspecified). Project-Architect review is required.`,
        evidenceRefs: records.map((r) => ({ role: r.role, evidenceId: r.evidenceId })),
      });
      gaps.push({
        gapType: "SCOPE_BREADTH_GAP",
        candidateKey: gapKey,
        evidenceAvailable: governedEvidencedSubjects,
        unresolved: `Breadth status for "${subject}" is UNKNOWN -- not yet declared as ENUMERATED_COMPLETE or OPEN_OR_UNDERSPECIFIED by curriculum normalization.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM", "PUBLIC_ASSESSMENT"],
      });
    }
  }
  return { candidates, gaps };
}

// ---------------------------------------------------------------------
// Generic gap production for depth / technical-truth coverage.
// ---------------------------------------------------------------------

/**
 * CC-20 sections 16-18: absence of PUBLIC_ASSESSMENT evidence alone no
 * longer means depthConfidence=NONE/PERFORMANCE_DEPTH_GAP for every
 * candidate -- explicit curriculum depth qualifiers and, more weakly,
 * valid qualification-level evidence (QUALIFICATION_LEVEL_BOUNDED, MEDIUM)
 * now supply a defensible depth basis. A gap remains only where depth is
 * genuinely UNRESOLVED (depthConfidence NONE/LOW) after considering ALL of
 * official curriculum, explicit performance, explicit depth qualifiers,
 * qualification-level evidence, accepted semantic adjudications, and
 * available assessment evidence -- `assessmentCalibrationAvailable` is
 * always recorded on the gap so absence of assessment stays visible
 * without implying total depth ignorance.
 */
export function computePerformanceDepthGaps(candidates: readonly KnowledgeCandidate[]): GapRecord[] {
  return candidates
    .filter((c) => REQUIRED_DISPOSITIONS.includes(c.disposition) && (c.confidence.depthConfidence === "NONE" || c.confidence.depthConfidence === "LOW"))
    .map((c) => ({
      gapType: "PERFORMANCE_DEPTH_GAP" as const,
      candidateKey: c.candidateKey,
      evidenceAvailable: [c.rationale, `depthBasis=${c.depthBasis ?? "UNRESOLVED"}`, `assessmentCalibrationAvailable=${c.assessmentCalibrationAvailable ?? false}`],
      unresolved: `Exact learner-performance depth for "${c.subject}" remains unresolved (depth confidence: ${c.confidence.depthConfidence}, basis: ${c.depthBasis ?? "UNRESOLVED"}) even after considering explicit curriculum depth qualifiers, qualification-level evidence, and available assessment evidence.`,
      legitimateResolverRoles: ["PUBLIC_ASSESSMENT", "OFFICIAL_CURRICULUM", "QUALIFICATION_LEVEL"] as EvidenceRole[],
    }));
}

/** Only fires for a candidate that structurally requires fact-key coverage (`requiredFactKeys.length > 0`) and isn't yet COMPLETE -- a candidate needing no facts is never "gapped" for lacking one, and a candidate with a disputed fact (PARTIAL, never COMPLETE) still gaps. */
export function computeTechnicalTruthGaps(candidates: readonly KnowledgeCandidate[]): GapRecord[] {
  return candidates
    .filter((c) => REQUIRED_DISPOSITIONS.includes(c.disposition) && (c.requiredFactKeys?.length ?? 0) > 0 && c.technicalCoverageStatus !== "COMPLETE")
    .map((c) => ({
      gapType: "TECHNICAL_TRUTH_GAP" as const,
      candidateKey: c.candidateKey,
      evidenceAvailable: [`requiredFactKeys=${(c.requiredFactKeys ?? []).join(", ")}`, `attached=${Object.keys(c.factualStatementsByClaimKey ?? {}).join(", ") || "none"}`],
      unresolved: `Technical-truth coverage for "${c.subject}" is ${c.technicalCoverageStatus ?? "PARTIAL"} -- not every required fact key has an approved, undisputed matching TECHNICAL_TRUTH claim.`,
      legitimateResolverRoles: ["TECHNICAL_TRUTH"] as EvidenceRole[],
    }));
}

// ---------------------------------------------------------------------
// Standard-mode orchestration. Locked to exactly one qualificationId per
// run; only STANDARD_MODE_CANDIDATE_ROLES may be passed in.
// ---------------------------------------------------------------------

export interface StandardPipelineInput {
  readonly qualificationId: string;
  readonly officialCurriculumUnits: readonly OfficialCurriculumUnit[];
  readonly curriculum: readonly CurriculumEvidence[];
  readonly assessment: readonly AssessmentEvidence[];
  readonly subjectRelations?: readonly CurriculumSubjectRelation[];
  readonly families?: readonly CurriculumFamily[];
  readonly qualificationLevel?: readonly QualificationLevelEvidence[];
  readonly prerequisites?: readonly PrerequisiteEvidence[];
  readonly capabilityRequirements?: readonly CandidateCapabilityRequirement[];
  readonly exemplars?: readonly ExemplarEvidence[];
  readonly factRequirements?: readonly CandidateFactRequirement[];
  /** OFFICIAL_CURRICULUM and TECHNICAL_TRUTH sourceRole claims only -- OPTIONAL_CALIBRATION factual claims never belong here (use compareCalibrationFactualClaims separately). */
  readonly factualClaims?: readonly SourceFactualClaim[];
  /** CC-20: governed decisions over already-existing `factRequirements` proposals -- see SemanticAdjudication's own header. Never a new factual source. */
  readonly semanticAdjudications?: readonly SemanticAdjudication[];
  /** CC-21A: semantic certifications over an existing candidate's already-constructed knowledge state -- see KnowledgeBoundaryCertification's own header. Never a new evidence source, never able to manufacture knowledge. */
  readonly knowledgeBoundaryCertifications?: readonly KnowledgeBoundaryCertification[];
}

function assertStandardModeRole(role: EvidenceRole, evidenceId: string): void {
  if (!STANDARD_MODE_CANDIDATE_ROLES.includes(role)) {
    throw new Error(
      `buildStandardPipeline received evidence with role "${role}" (evidenceId=${evidenceId}) -- OPTIONAL_CALIBRATION and LEGACY_DIAGNOSTIC evidence must never be passed to the standard pipeline.`,
    );
  }
}

const FACTUAL_CLAIM_STANDARD_ROLES: readonly EvidenceRole[] = ["OFFICIAL_CURRICULUM", "TECHNICAL_TRUTH"];

export function buildStandardPipeline(input: StandardPipelineInput): StandardPipelineResult {
  for (const e of input.curriculum) assertStandardModeRole(e.role, e.evidenceId);
  for (const e of input.assessment) assertStandardModeRole(e.role, e.evidenceId);
  for (const e of input.qualificationLevel ?? []) assertStandardModeRole(e.role, e.evidenceId);
  for (const e of input.exemplars ?? []) assertStandardModeRole(e.role, e.evidenceId);
  for (const e of input.factualClaims ?? []) {
    if (!FACTUAL_CLAIM_STANDARD_ROLES.includes(e.sourceRole)) {
      throw new Error(
        `buildStandardPipeline received a SourceFactualClaim with sourceRole "${e.sourceRole}" (evidenceId=${e.evidenceId}) -- only OFFICIAL_CURRICULUM and TECHNICAL_TRUTH factual claims may be passed to the standard pipeline; use compareCalibrationFactualClaims for OPTIONAL_CALIBRATION comparison.`,
      );
    }
  }

  const { index: unitIndex, gaps: registryGaps } = buildOfficialCurriculumUnitIndex(input.officialCurriculumUnits);

  const { validated: validCurriculum, gaps: curriculumGaps } = validateCurriculumEvidence(input.curriculum, input.qualificationId, unitIndex);
  const { validated: validAssessment, gaps: assessmentGaps } = validateAssessmentEvidence(input.assessment, input.qualificationId, unitIndex);
  const validatedCurriculumIds = new Set(validCurriculum.map((e) => e.evidenceId));
  const validatedAssessmentIds = new Set(validAssessment.map((e) => e.evidenceId));

  // "Known" for relation/family governance purposes means present in EITHER
  // validated curriculum evidence OR the validated assessment stream -- a
  // relation must be able to legitimately connect a category to a subject
  // assessment evidence itself validly reveals, while an entirely
  // fabricated subject with no supporting evidence anywhere is still rejected.
  const knownSubjects = new Set([...validCurriculum.map((e) => e.subject), ...validAssessment.map((e) => e.subject)]);
  const { validated: validRelations, gaps: relationGaps } = validateCurriculumSubjectRelations(input.subjectRelations ?? [], input.qualificationId, knownSubjects);
  const { validated: validFamilies, gaps: familyGaps } = validateCurriculumFamilies(input.families ?? [], input.qualificationId, knownSubjects);

  const { candidates: curriculumCandidates, gaps: curriculumCandidateGaps } = generateCurriculumCandidates(validCurriculum);
  const assessmentCandidates = generateAssessmentCandidates(validAssessment);
  const { candidates: patternCandidates, gaps: patternGaps } = detectAssessmentPatternCandidates(validAssessment, validFamilies);

  let candidates = mergeCandidates([...curriculumCandidates, ...assessmentCandidates, ...patternCandidates]);
  const requiredCandidateKeys = new Set(candidates.filter((c) => REQUIRED_DISPOSITIONS.includes(c.disposition)).map((c) => c.candidateKey));

  const { validated: validPrerequisites, gaps: prerequisiteGaps } = validatePrerequisiteEvidence(input.prerequisites ?? []);
  const { validated: validCapabilityRequirements, gaps: capabilityGaps } = validateCandidateCapabilityRequirements(input.capabilityRequirements ?? [], input.qualificationId);
  const prerequisiteCandidates = generatePrerequisiteCandidates(validPrerequisites, validCapabilityRequirements, candidates, validatedCurriculumIds, validatedAssessmentIds);

  const { validated: validExemplars, gaps: exemplarGaps } = validateExemplarEvidence(input.exemplars ?? []);
  const exemplarCandidates = generateExemplarCandidates(validExemplars, candidates);

  candidates = mergeCandidates([...candidates, ...prerequisiteCandidates, ...exemplarCandidates]);

  const { validated: validQualificationLevel, gaps: qualificationLevelGaps } = validateQualificationLevelEvidence(input.qualificationLevel ?? [], input.qualificationId);
  const { candidates: withLevelConstraints, unmatched: unmatchedQualificationLevel } = attachQualificationLevelConstraints(candidates, validQualificationLevel);
  candidates = withLevelConstraints;

  // Moved earlier than CC-20's original ordering (was after semantic
  // adjudication) so validFactualClaims' validated TECHNICAL_TRUTH ids are
  // available to the semantic-adjudication support context below.
  const { validated: validFactualClaims, gaps: factualClaimBasisGaps } = validateFactualClaims(input.factualClaims ?? []);

  // CC-20A sections 3-6: `supportingEvidenceRefs` are resolved against the
  // SAME validated evidence streams/registries this pipeline already
  // produces -- never a second, ungoverned evidence registry. Only
  // records that create their OWN candidate (never a DEPTH_QUALIFIER,
  // which modifies an existing candidate's depth rather than representing
  // one itself) are eligible to substantiate "exact target candidate"
  // curriculum authority.
  const curriculumCandidateKeyByEvidenceId = new Map(
    validCurriculum.filter((e) => e.normalizationKind !== "DEPTH_QUALIFIER").map((e) => [e.evidenceId, candidateKey(e.subject, e.commandVerbPerformanceType ?? "OTHER")] as const),
  );
  const assessmentCandidateKeyByEvidenceId = new Map(validAssessment.map((e) => [e.evidenceId, candidateKey(e.subject, e.performanceType)] as const));
  const qualificationLevelCandidateKeyByEvidenceId = new Map(validQualificationLevel.map((e) => [e.evidenceId, e.appliesToCandidateKey] as const));
  const technicalTruthClaimIds = new Set(validFactualClaims.filter((c) => c.sourceRole === "TECHNICAL_TRUTH").map((c) => c.evidenceId));
  // CC-20B section 3 route C: candidates already carry their own resolved
  // depthBasis at this point (attachQualificationLevelConstraints already
  // ran) -- OVERDEPTH_FORMALISM may rely on a candidate's OWN
  // EXPLICIT_CURRICULUM_DEPTH without needing to re-cite the depth qualifier.
  const candidateDepthBasisByKey = new Map(candidates.filter((c) => c.depthBasis !== undefined).map((c) => [c.candidateKey, c.depthBasis!] as const));
  const semanticAdjudicationSupportContext: SemanticAdjudicationSupportContext = {
    curriculumCandidateKeyByEvidenceId,
    assessmentCandidateKeyByEvidenceId,
    qualificationLevelCandidateKeyByEvidenceId,
    technicalTruthClaimIds,
    candidateDepthBasisByKey,
  };

  // CC-20: semantic adjudication runs BEFORE fact-requirement validation --
  // only an ACTIVE (validated, non-conflicted) REQUIRED_CORE/
  // REQUIRED_OPERATIONAL adjudication may promote a REVIEW_PROPOSED fact.
  const { validated: validAdjudications, gaps: adjudicationValidationGaps } = validateSemanticAdjudications(
    input.semanticAdjudications ?? [],
    input.qualificationId,
    input.factRequirements ?? [],
    semanticAdjudicationSupportContext,
  );
  const { active: activeAdjudications, gaps: adjudicationConflictGaps } = detectSemanticAdjudicationConflicts(validAdjudications);
  const activeGoverningAdjudicationsByIdentity = new Map(
    activeAdjudications.filter((a) => GOVERNING_ADJUDICATION_DECISIONS.includes(a.decision)).map((a) => [`${a.targetCandidateKey}::${a.claimKey}`, a] as const),
  );
  const adjudicationUnresolvedGaps = computeSemanticAdjudicationGaps(activeAdjudications);
  const representativeExemplars = buildRepresentativeExemplars(activeAdjudications);

  const { validated: validFactRequirements, gaps: factRequirementGaps } = validateCandidateFactRequirements(
    input.factRequirements ?? [],
    input.qualificationId,
    requiredCandidateKeys,
    validatedCurriculumIds,
    validatedAssessmentIds,
    activeGoverningAdjudicationsByIdentity,
  );
  const { candidates: withFactualClaims, unmatched: unmatchedTechnicalTruth, gaps: attachmentGaps } = attachFactualClaims(candidates, validFactRequirements, validFactualClaims);
  candidates = withFactualClaims;
  const conflictGaps = detectFactualConflicts(validFactualClaims, ["OFFICIAL_CURRICULUM"]);

  const { candidates: breadthCandidates, gaps: breadthGaps } = computeCategoryBreadthOutcomes(validCurriculum, validAssessment, validRelations);
  candidates = mergeCandidates([...candidates, ...breadthCandidates]);

  // CC-21A: knowledge-boundary CERTIFICATIONS are validated once
  // requiredFactKeys/technicalCoverageStatus are settled -- each is bound
  // to a deterministic fingerprint of the candidate's exact current
  // knowledge state, so a certification computed against an earlier state
  // (a fact added/removed, an adjudication changed, decomposition
  // changed) is mechanically STALE and never silently trusted.
  const candidateBoundaryFingerprints = computeCandidateBoundaryFingerprints(candidates, input.qualificationId, input.factRequirements ?? [], validFactRequirements, activeAdjudications);
  const pendingReviewProposedClaimKeysByCandidate = computePendingReviewProposedClaimKeysByCandidate(input.factRequirements ?? [], validFactRequirements);
  const { validated: validCertifications, gaps: certificationValidationGaps } = validateKnowledgeBoundaryCertifications(
    input.knowledgeBoundaryCertifications ?? [],
    input.qualificationId,
    requiredCandidateKeys,
    candidateBoundaryFingerprints,
    pendingReviewProposedClaimKeysByCandidate,
    semanticAdjudicationSupportContext,
  );
  const { active: activeCertifications, gaps: certificationConflictGaps } = detectKnowledgeBoundaryCertificationConflicts(validCertifications);
  const activeCertificationsByCandidateKey = new Map(activeCertifications.map((c) => [c.targetCandidateKey, c] as const));

  // CC-20 sections 12-15 (CC-21A closes the certification false-green):
  // knowledge-boundary finalization runs LAST, once requiredFactKeys/
  // technicalCoverageStatus, active adjudications, AND active
  // certifications are all known.
  const { candidates: withKnowledgeBoundary, gaps: knowledgeBoundaryGaps } = finalizeKnowledgeBoundary(
    candidates,
    input.factRequirements ?? [],
    validFactRequirements,
    activeAdjudications,
    activeCertificationsByCandidateKey,
  );
  candidates = withKnowledgeBoundary;

  const depthGaps = computePerformanceDepthGaps(candidates);
  const truthGaps = computeTechnicalTruthGaps(candidates);

  return {
    candidates,
    gaps: [
      ...registryGaps,
      ...curriculumGaps,
      ...curriculumCandidateGaps,
      ...assessmentGaps,
      ...relationGaps,
      ...familyGaps,
      ...prerequisiteGaps,
      ...capabilityGaps,
      ...exemplarGaps,
      ...qualificationLevelGaps,
      ...adjudicationValidationGaps,
      ...adjudicationConflictGaps,
      ...adjudicationUnresolvedGaps,
      ...factualClaimBasisGaps,
      ...factRequirementGaps,
      ...attachmentGaps,
      ...conflictGaps,
      ...breadthGaps,
      ...patternGaps,
      ...certificationValidationGaps,
      ...certificationConflictGaps,
      ...knowledgeBoundaryGaps,
      ...depthGaps,
      ...truthGaps,
    ],
    unmatchedTechnicalTruth,
    unmatchedQualificationLevel,
    semanticAdjudicationOutcomes: activeAdjudications,
    representativeExemplars,
    knowledgeBoundaryCertificationOutcomes: activeCertifications,
  };
}

// ---------------------------------------------------------------------
// Diagnostic-only comparison. Read-only: never mutates `candidates`,
// never returns a KnowledgeCandidate, never feeds back into the
// standard pipeline.
// ---------------------------------------------------------------------

export function compareAgainstDiagnosticEvidence(
  candidates: readonly KnowledgeCandidate[],
  calibration: readonly OptionalCalibrationEvidence[],
  legacy: readonly LegacyDiagnosticEvidence[],
): DiagnosticComparisonEntry[] {
  const candidateKeysBySubject = new Map<string, string[]>();
  for (const c of candidates) {
    const list = candidateKeysBySubject.get(c.subject) ?? [];
    list.push(c.candidateKey);
    candidateKeysBySubject.set(c.subject, list);
  }

  const entries: DiagnosticComparisonEntry[] = [];
  for (const e of calibration) {
    const matches = candidateKeysBySubject.get(e.subject) ?? [];
    entries.push({ subject: e.subject, diagnosticRole: "OPTIONAL_CALIBRATION", claim: e.claim, matchesExistingCandidate: matches.length > 0, matchingCandidateKeys: matches });
  }
  for (const e of legacy) {
    const matches = candidateKeysBySubject.get(e.subject) ?? [];
    entries.push({ subject: e.subject, diagnosticRole: "LEGACY_DIAGNOSTIC", claim: e.claim, matchesExistingCandidate: matches.length > 0, matchingCandidateKeys: matches });
  }
  return entries;
}
