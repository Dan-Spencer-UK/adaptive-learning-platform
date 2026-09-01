/**
 * CC-18/CC-18A/CC-18B: generic qualification knowledge-construction
 * pipeline -- rules.
 *
 * Pure, deterministic functions only. No network, no clock, no RNG, no
 * model calls. Production logic in this file may never inspect a
 * specific subject string (a real qualification, AC, Range item or
 * topic name) -- verified mechanically by rules.test.ts's own source
 * scan.
 *
 * See docs/architecture/qualification-knowledge-construction-pipeline.md
 * for the design this file implements, and types.ts's own CC-18B header
 * for the specific integrity gaps this revision closes relative to
 * CC-18A.
 */

import {
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
  type DiagnosticComparisonEntry,
  type EvidenceRole,
  type ExemplarEvidence,
  type GapRecord,
  type KnowledgeCandidate,
  type LegacyDiagnosticEvidence,
  type NormalizationBasis,
  type OfficialCurriculumUnit,
  type OptionalCalibrationEvidence,
  type PrerequisiteEvidence,
  type QualificationLevelEvidence,
  type SourceFactualClaim,
  type SourceProvenance,
  type StandardPipelineResult,
  type TechnicalCoverageStatus,
} from "./types.ts";

// ---------------------------------------------------------------------
// Provenance gate (CC-18A section 21; CC-18B section 10 adds
// type-compatibility). An evidence record lacking valid, non-empty
// source provenance -- or carrying a normalizationBasis that is not
// semantically compatible with its own evidence type -- is rejected,
// never silently accepted as a basis for a HIGH-confidence required
// candidate.
// ---------------------------------------------------------------------

export function hasValidProvenance(evidence: SourceProvenance, allowedBases?: readonly NormalizationBasis[]): boolean {
  const basicallyValid = evidence.sourceRef.trim().length > 0 && evidence.sourceLocator.trim().length > 0 && normalizationBasisSchema.safeParse(evidence.normalizationBasis).success;
  if (!basicallyValid) return false;
  if (allowedBases && !allowedBases.includes(evidence.normalizationBasis)) return false;
  return true;
}

const CURRICULUM_ALLOWED_BASES: readonly NormalizationBasis[] = ["EXPLICIT_CURRICULUM_WORDING", "EXPLICIT_RANGE_STRUCTURE"];
const ASSESSMENT_ALLOWED_BASES: readonly NormalizationBasis[] = ["POSITIVE_ASSESSMENT_TARGET", "ASSESSMENT_CURRICULUM_MAPPING"];
const QUALIFICATION_LEVEL_ALLOWED_BASES: readonly NormalizationBasis[] = ["QUALIFICATION_LEVEL_DESCRIPTOR"];
const RELATION_ALLOWED_BASES: readonly NormalizationBasis[] = ["EXPLICIT_CURRICULUM_WORDING", "EXPLICIT_RANGE_STRUCTURE"];
const CAPABILITY_ALLOWED_BASES: readonly NormalizationBasis[] = ["CAPABILITY_DEPENDENCY_DERIVATION"];
const PREREQUISITE_ALLOWED_BASES: readonly NormalizationBasis[] = ["STRUCTURAL_PREREQUISITE_DEPENDENCY"];
const TECHNICAL_CLAIM_ALLOWED_BASES: readonly NormalizationBasis[] = ["AUTHORITATIVE_TECHNICAL_FACT"];
const CURRICULUM_CLAIM_ALLOWED_BASES: readonly NormalizationBasis[] = ["SOURCE_FACTUAL_CLAIM"];

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
    });
  }
  return [...byKey.values()];
}

// ---------------------------------------------------------------------
// Official curriculum-unit registry (CC-18B section 3). Keyed by the
// COMPOSITE (qualificationId, curriculumUnitId), never curriculumUnitId
// alone. Insertion order never affects the result: a genuine conflict
// (same composite key, incompatible official wording/source identity)
// excludes BOTH duplicates from the resolvable index and is reported,
// rather than resolved last-write-wins.
// ---------------------------------------------------------------------

export function buildOfficialCurriculumUnitIndex(units: readonly OfficialCurriculumUnit[]): { index: Map<string, OfficialCurriculumUnit>; gaps: GapRecord[] } {
  const firstSeen = new Map<string, OfficialCurriculumUnit>();
  const conflictedKeys = new Set<string>();
  const gaps: GapRecord[] = [];

  for (const u of units) {
    const key = unitRegistryKey(u.qualificationId, u.curriculumUnitId);
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
// Curriculum evidence validation (CC-18B section 4) -- resolves each
// record against the official registry and the active qualification
// BEFORE any candidate is generated from it.
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
    if (!hasValidProvenance(e)) continue; // no provenance at all -- silently excluded

    const key = candidateKey(e.subject, e.commandVerbPerformanceType ?? "OTHER");

    if (!hasValidProvenance(e, CURRICULUM_ALLOWED_BASES)) {
      gaps.push({
        gapType: "EVIDENCE_NORMALIZATION_REVIEW",
        candidateKey: key,
        evidenceAvailable: [`normalizationBasis=${e.normalizationBasis}`],
        unresolved: `CurriculumEvidence normalizationBasis "${e.normalizationBasis}" is not type-compatible for curriculum evidence.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
      });
      continue;
    }

    const qualMatches = e.qualificationId === qualificationId;
    const unitResolves = unitIndex.has(unitRegistryKey(e.qualificationId, e.curriculumUnitId));

    if (!qualMatches || !unitResolves) {
      gaps.push({
        gapType: "CURRICULUM_MAPPING_REVIEW",
        candidateKey: key,
        evidenceAvailable: [`declaredQualification=${e.qualificationId}`, `curriculumUnitId=${e.curriculumUnitId}`, `subject=${e.subject}`],
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
// Curriculum candidate generation (CC-18B section 5-7). Operates ONLY on
// an already-validated stream. Groups by the FULL (subject,
// performanceType) key from the start, so multiple performance types
// for one subject all survive, and honours the explicit
// CurriculumNormalizationKind rather than an ambiguous boolean pair.
// ---------------------------------------------------------------------

export function generateCurriculumCandidates(validatedEvidence: readonly CurriculumEvidence[]): KnowledgeCandidate[] {
  const ownCandidateRecordsByKey = new Map<string, CurriculumEvidence[]>();
  const depthQualifiersByParent = new Map<string, CurriculumEvidence[]>();
  const parentBySubject = new Map<string, string>();

  for (const e of validatedEvidence) {
    if (e.normalizationKind === "DEPTH_QUALIFIER") {
      if (!e.refinesSubject) continue; // malformed -- a depth qualifier with no parent constrains nothing
      const list = depthQualifiersByParent.get(e.refinesSubject) ?? [];
      list.push(e);
      depthQualifiersByParent.set(e.refinesSubject, list);
      continue;
    }

    // PRIMARY_REQUIREMENT, RANGE_REQUIRED_MEMBER, RANGE_CATEGORY all create their own (subject, performanceType) candidate.
    const performanceType = e.commandVerbPerformanceType ?? "OTHER";
    const key = candidateKey(e.subject, performanceType);
    const list = ownCandidateRecordsByKey.get(key) ?? [];
    list.push(e);
    ownCandidateRecordsByKey.set(key, list);

    if (e.normalizationKind === "RANGE_REQUIRED_MEMBER" && e.refinesSubject) {
      parentBySubject.set(e.subject, e.refinesSubject);
    }
  }

  const candidates: KnowledgeCandidate[] = [];
  for (const [key, records] of ownCandidateRecordsByKey) {
    const first = records[0]!;
    const subject = first.subject;
    const performanceType = first.commandVerbPerformanceType ?? "OTHER";
    const depthQualifiers = depthQualifiersByParent.get(subject) ?? [];
    const kinds = new Set(records.map((r) => r.normalizationKind));

    const rationaleParts: string[] = [];
    if (kinds.has("PRIMARY_REQUIREMENT")) rationaleParts.push("named directly in the qualification's own primary AC/LO wording");
    if (kinds.has("RANGE_REQUIRED_MEMBER")) rationaleParts.push(`an explicit official Range member (parent subject: "${parentBySubject.get(subject) ?? "unknown"}")`);
    if (kinds.has("RANGE_CATEGORY")) rationaleParts.push("a named standalone official Range category");
    const rationale = `Required curriculum scope -- ${rationaleParts.join("; ")}. Internal implementation detail beyond what other evidence independently supports is not automatically authorised.`;

    candidates.push({
      candidateKey: key,
      subject,
      performanceType,
      disposition: "REQUIRED_EXPLICIT_CURRICULUM",
      confidence: {
        scopeConfidence: "HIGH",
        depthConfidence: depthQualifiers.length > 0 ? "MEDIUM" : "NONE",
        technicalTruthConfidence: "NONE",
      },
      rationale,
      evidenceRefs: [...records, ...depthQualifiers].map((r) => ({ role: r.role, evidenceId: r.evidenceId })),
      parentSubject: parentBySubject.get(subject),
    });
  }
  return candidates;
}

// ---------------------------------------------------------------------
// Assessment evidence validation (CC-18B section 8-9) -- produces the
// SINGLE validated/accepted stream every downstream assessment-consuming
// function must use exclusively.
// ---------------------------------------------------------------------

export function validateAssessmentEvidence(
  evidence: readonly AssessmentEvidence[],
  qualificationId: string,
  unitIndex: ReadonlyMap<string, OfficialCurriculumUnit>,
): { validated: AssessmentEvidence[]; gaps: GapRecord[] } {
  const validated: AssessmentEvidence[] = [];
  const gaps: GapRecord[] = [];

  for (const e of evidence) {
    if (!hasValidProvenance(e)) continue;

    if (!hasValidProvenance(e, ASSESSMENT_ALLOWED_BASES)) {
      gaps.push({
        gapType: "EVIDENCE_NORMALIZATION_REVIEW",
        candidateKey: candidateKey(e.subject, e.performanceType),
        evidenceAvailable: [`normalizationBasis=${e.normalizationBasis}`],
        unresolved: `AssessmentEvidence normalizationBasis "${e.normalizationBasis}" is not type-compatible for assessment evidence.`,
        legitimateResolverRoles: ["PUBLIC_ASSESSMENT"],
      });
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
        candidateKey: candidateKey(e.subject, e.performanceType),
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

/** CC-18B section 8: pure candidate generation from an ALREADY validated/trusted assessment stream -- no validation logic here. */
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
    });
  }
  return candidates;
}

// ---------------------------------------------------------------------
// Structural capability dependency + prerequisite rule (CC-18B sections
// 11-13). `CandidateCapabilityRequirement` is the ONLY thing a
// `PrerequisiteEvidence` can match against. Auto-promotion is gated by
// `derivationKind`, and an EXPLICIT_ASSESSMENT_OPERATION derivation must
// itself be substantiated by a VALIDATED assessment item.
// ---------------------------------------------------------------------

export function generatePrerequisiteCandidates(
  prerequisites: readonly PrerequisiteEvidence[],
  capabilityRequirements: readonly CandidateCapabilityRequirement[],
  existingCandidates: readonly KnowledgeCandidate[],
  validatedAssessmentEvidenceIds: ReadonlySet<string>,
): KnowledgeCandidate[] {
  const requiredKeys = new Set(existingCandidates.filter((c) => REQUIRED_DISPOSITIONS.includes(c.disposition)).map((c) => c.candidateKey));
  const validCapabilityRequirements = capabilityRequirements.filter((r) => hasValidProvenance(r, CAPABILITY_ALLOWED_BASES) && requiredKeys.has(r.targetCandidateKey));

  return prerequisites
    .filter((e) => hasValidProvenance(e, PREREQUISITE_ALLOWED_BASES))
    .map((e) => {
      const matching = validCapabilityRequirements.filter((r) => r.targetCandidateKey === e.necessaryForCandidateKey && r.capabilityKey === e.capabilityKey);

      const autoPromotable = matching.some((r) => {
        if (r.derivationKind === "REVIEW_PROPOSED") return false;
        if (r.derivationKind === "EXPLICIT_ASSESSMENT_OPERATION") {
          return r.sourceEvidenceRefs.some((ref) => validatedAssessmentEvidenceIds.has(ref.evidenceId));
        }
        return true; // EXPLICIT_CURRICULUM_OPERATION | DETERMINISTIC_OPERATIONAL_DEPENDENCY
      });

      const targetExists = requiredKeys.has(e.necessaryForCandidateKey);
      const disposition: CandidateDisposition = autoPromotable ? "FOUNDATIONAL_PREREQUISITE" : targetExists ? "REVIEW_REQUIRED" : "CONTEXTUAL_TEACHING_SUPPORT";

      const rationale = autoPromotable
        ? `Capability "${e.capabilityKey}" is structurally required by "${e.necessaryForCandidateKey}" via a validly derived CandidateCapabilityRequirement -- minimal prerequisite: ${e.minimalDepthJustification}`
        : matching.length > 0
          ? `A CandidateCapabilityRequirement for "${e.capabilityKey}"/"${e.necessaryForCandidateKey}" exists but its derivationKind does not auto-promote (REVIEW_PROPOSED, or an EXPLICIT_ASSESSMENT_OPERATION whose source item was not in the validated assessment stream) -- held at REVIEW_REQUIRED pending Project-Architect confirmation.`
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
        evidenceRefs: [{ role: "STRUCTURAL_PREREQUISITE_DEPENDENCY", evidenceId: e.evidenceId }, ...matching.map((r) => ({ role: "CANDIDATE_CAPABILITY_REQUIREMENT" as const, evidenceId: `${r.targetCandidateKey}::${r.capabilityKey}` }))],
      };
    });
}

// ---------------------------------------------------------------------
// Qualification-level depth-constraint attachment. NEVER creates a new
// candidate -- only attaches to a candidate that already exists under
// the exact key it names.
// ---------------------------------------------------------------------

export function attachQualificationLevelConstraints(
  candidates: readonly KnowledgeCandidate[],
  evidence: readonly QualificationLevelEvidence[],
): { candidates: KnowledgeCandidate[]; unmatched: QualificationLevelEvidence[] } {
  const valid = evidence.filter((e) => hasValidProvenance(e, QUALIFICATION_LEVEL_ALLOWED_BASES));
  const byCandidateKey = new Map<string, QualificationLevelEvidence[]>();
  for (const e of valid) {
    const list = byCandidateKey.get(e.appliesToCandidateKey) ?? [];
    list.push(e);
    byCandidateKey.set(e.appliesToCandidateKey, list);
  }

  const matchedKeys = new Set<string>();
  const updated = candidates.map((c) => {
    const matches = byCandidateKey.get(c.candidateKey);
    if (!matches || matches.length === 0) return c;
    matchedKeys.add(c.candidateKey);
    return {
      ...c,
      qualificationLevelRefs: [...(c.qualificationLevelRefs ?? []), ...matches.map((m) => ({ role: "QUALIFICATION_LEVEL" as const, evidenceId: m.evidenceId }))],
      depthConstraintNote: matches.map((m) => `${m.levelId}: ${m.depthConstraintDescriptor}`).join("; "),
    };
  });

  const unmatched = valid.filter((e) => !matchedKeys.has(e.appliesToCandidateKey));
  return { candidates: updated, unmatched };
}

// ---------------------------------------------------------------------
// Exemplar vs mastery. CC-18B: role no longer auto-grants technical-
// truth confidence -- that comes only from exact claim-key coverage.
// ---------------------------------------------------------------------

export function generateExemplarCandidates(evidence: readonly ExemplarEvidence[], existingCandidates: readonly KnowledgeCandidate[]): KnowledgeCandidate[] {
  const requiredSubjects = new Set(existingCandidates.filter((c) => REQUIRED_DISPOSITIONS.includes(c.disposition)).map((c) => c.subject));
  const candidates: KnowledgeCandidate[] = [];
  for (const e of evidence.filter((ev) => hasValidProvenance(ev))) {
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
// Claim-key-specific technical-truth coverage (CC-18B sections 14-17).
// A candidate's technical coverage is determined exclusively by its own
// declared `requiredFactKeys` (from `CandidateFactRequirement`) matched
// against TECHNICAL_TRUTH claims by EXACT claimKey -- never by subject
// equality alone.
// ---------------------------------------------------------------------

function computeCoverage(requiredKeys: readonly string[], attached: ReadonlyMap<string, string>): { status: TechnicalCoverageStatus; confidence: ConfidenceLevel } {
  if (requiredKeys.length === 0) return { status: "NOT_REQUIRED", confidence: "NONE" };
  const attachedCount = requiredKeys.filter((k) => attached.has(k)).length;
  if (attachedCount === requiredKeys.length) return { status: "COMPLETE", confidence: "HIGH" };
  if (attachedCount === 0) return { status: "PARTIAL", confidence: "NONE" };
  return { status: "PARTIAL", confidence: "MEDIUM" };
}

/**
 * CC-18B section 10: type-compatibility gate for `SourceFactualClaim` --
 * a TECHNICAL_TRUTH claim must use AUTHORITATIVE_TECHNICAL_FACT; an
 * OFFICIAL_CURRICULUM (or diagnostic-only OPTIONAL_CALIBRATION) claim
 * must use SOURCE_FACTUAL_CLAIM. A record with valid basic provenance
 * but an incompatible basis is excluded and explicitly reviewed, never
 * silently ignored.
 */
export function validateFactualClaims(claims: readonly SourceFactualClaim[]): { validated: SourceFactualClaim[]; gaps: GapRecord[] } {
  const validated: SourceFactualClaim[] = [];
  const gaps: GapRecord[] = [];
  for (const c of claims) {
    if (!hasValidProvenance(c)) continue;
    const allowedBases = c.sourceRole === "TECHNICAL_TRUTH" ? TECHNICAL_CLAIM_ALLOWED_BASES : CURRICULUM_CLAIM_ALLOWED_BASES;
    if (!hasValidProvenance(c, allowedBases)) {
      gaps.push({
        gapType: "EVIDENCE_NORMALIZATION_REVIEW",
        candidateKey: `${c.subject}::FACTUAL_CLAIM`,
        evidenceAvailable: [`normalizationBasis=${c.normalizationBasis}`, `sourceRole=${c.sourceRole}`],
        unresolved: `SourceFactualClaim normalizationBasis "${c.normalizationBasis}" is not type-compatible for sourceRole "${c.sourceRole}".`,
        legitimateResolverRoles: [c.sourceRole],
      });
      continue;
    }
    validated.push(c);
  }
  return { validated, gaps };
}

export function attachFactualClaims(
  candidates: readonly KnowledgeCandidate[],
  factRequirements: readonly CandidateFactRequirement[],
  claims: readonly SourceFactualClaim[],
): { candidates: KnowledgeCandidate[]; unmatched: SourceFactualClaim[] } {
  const validRequirements = factRequirements.filter((r) => hasValidProvenance(r));
  const requiredKeysByCandidate = new Map<string, Set<string>>();
  for (const r of validRequirements) {
    const set = requiredKeysByCandidate.get(r.targetCandidateKey) ?? new Set<string>();
    set.add(r.claimKey);
    requiredKeysByCandidate.set(r.targetCandidateKey, set);
  }

  const technicalClaims = claims.filter((c) => c.sourceRole === "TECHNICAL_TRUTH" && hasValidProvenance(c, TECHNICAL_CLAIM_ALLOWED_BASES));
  const usedClaimKeys = new Set<string>();

  const updated = candidates.map((c) => {
    const requiredKeys = [...(requiredKeysByCandidate.get(c.candidateKey) ?? new Set<string>())].sort();
    if (requiredKeys.length === 0) return { ...c, requiredFactKeys: undefined, technicalCoverageStatus: "NOT_REQUIRED" as const };

    const attached = new Map<string, string>();
    const attachedRefs: { role: "TECHNICAL_TRUTH"; evidenceId: string }[] = [];
    for (const key of requiredKeys) {
      const claim = technicalClaims.find((cl) => cl.claimKey === key && cl.subject === c.subject);
      if (claim) {
        attached.set(key, claim.normalizedClaimValue);
        attachedRefs.push({ role: "TECHNICAL_TRUTH", evidenceId: claim.evidenceId });
        usedClaimKeys.add(`${claim.claimKey}::${claim.subject}`);
      }
    }

    const { status, confidence } = computeCoverage(requiredKeys, attached);
    return {
      ...c,
      requiredFactKeys: requiredKeys,
      factualStatementsByClaimKey: attached.size > 0 ? Object.fromEntries(attached) : undefined,
      technicalCoverageStatus: status,
      confidence: { ...c.confidence, technicalTruthConfidence: confidence },
      evidenceRefs: [...c.evidenceRefs, ...attachedRefs],
    };
  });

  const unmatched = technicalClaims.filter((c) => !usedClaimKeys.has(`${c.claimKey}::${c.subject}`));
  return { candidates: updated, unmatched };
}

// ---------------------------------------------------------------------
// Independent factual-claim conflict detection (CC-18A section 12-15;
// CC-18B adds comparisonKind compatibility -- an incompatible pairing
// produces FACTUAL_COMPARISON_REVIEW rather than a guessed conflict or
// false agreement).
// ---------------------------------------------------------------------

export function detectFactualConflicts(claims: readonly SourceFactualClaim[], comparisonRoles: readonly EvidenceRole[] = ["OFFICIAL_CURRICULUM"]): GapRecord[] {
  const valid = claims.filter((c) => hasValidProvenance(c, c.sourceRole === "TECHNICAL_TRUTH" ? TECHNICAL_CLAIM_ALLOWED_BASES : CURRICULUM_CLAIM_ALLOWED_BASES));
  const byClaimKey = new Map<string, SourceFactualClaim[]>();
  for (const c of valid) {
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

/** CC-18A section 15: diagnostic-only comparison of OPTIONAL_CALIBRATION factual claims against approved TECHNICAL_TRUTH. Never merged into StandardPipelineResult.gaps. */
export function compareCalibrationFactualClaims(calibrationClaims: readonly SourceFactualClaim[], technicalClaims: readonly SourceFactualClaim[]): GapRecord[] {
  return detectFactualConflicts([...calibrationClaims, ...technicalClaims], ["OPTIONAL_CALIBRATION"]);
}

// ---------------------------------------------------------------------
// Assessment family-pattern generalisation. Operates ONLY on the
// validated assessment stream; `familyKey` only counts when it resolves
// to a governed CurriculumFamily listing the item's own subject.
// ---------------------------------------------------------------------

export function detectAssessmentPatternCandidates(
  validatedAssessment: readonly AssessmentEvidence[],
  curriculumFamilies: readonly CurriculumFamily[],
): { candidates: KnowledgeCandidate[]; gaps: GapRecord[] } {
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
// Governed category/family relationship validation (CC-18B section 20).
// An arbitrary relation object with non-empty strings must not become
// governed merely because it was supplied -- it must belong to the
// active qualification, carry type-compatible provenance, and reference
// subjects that actually exist in normalized curriculum evidence.
// ---------------------------------------------------------------------

export function validateCurriculumSubjectRelations(
  relations: readonly CurriculumSubjectRelation[],
  qualificationId: string,
  knownSubjects: ReadonlySet<string>,
): { validated: CurriculumSubjectRelation[]; gaps: GapRecord[] } {
  const validated: CurriculumSubjectRelation[] = [];
  const gaps: GapRecord[] = [];
  for (const r of relations) {
    if (!hasValidProvenance(r)) continue;
    if (!hasValidProvenance(r, RELATION_ALLOWED_BASES)) {
      gaps.push({
        gapType: "EVIDENCE_NORMALIZATION_REVIEW",
        candidateKey: `${r.subject}::${r.underCategory}`,
        evidenceAvailable: [`normalizationBasis=${r.normalizationBasis}`],
        unresolved: `CurriculumSubjectRelation normalizationBasis "${r.normalizationBasis}" is not type-compatible.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
      });
      continue;
    }
    if (r.qualificationId !== qualificationId) continue; // not this run's concern
    if (!knownSubjects.has(r.subject) || !knownSubjects.has(r.underCategory)) {
      gaps.push({
        gapType: "EVIDENCE_NORMALIZATION_REVIEW",
        candidateKey: `${r.subject}::${r.underCategory}`,
        evidenceAvailable: [`subject=${r.subject}`, `underCategory=${r.underCategory}`],
        unresolved: `Relation references a subject not present in normalized curriculum evidence -- an arbitrary relation label is never governed merely because it was supplied.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
      });
      continue;
    }
    validated.push(r);
  }
  return { validated, gaps };
}

export function validateCurriculumFamilies(
  families: readonly CurriculumFamily[],
  qualificationId: string,
  knownSubjects: ReadonlySet<string>,
): { validated: CurriculumFamily[]; gaps: GapRecord[] } {
  const validated: CurriculumFamily[] = [];
  const gaps: GapRecord[] = [];
  for (const f of families) {
    if (!hasValidProvenance(f)) continue;
    if (!hasValidProvenance(f, RELATION_ALLOWED_BASES)) {
      gaps.push({
        gapType: "EVIDENCE_NORMALIZATION_REVIEW",
        candidateKey: f.familyKey,
        evidenceAvailable: [`normalizationBasis=${f.normalizationBasis}`],
        unresolved: `CurriculumFamily normalizationBasis "${f.normalizationBasis}" is not type-compatible.`,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
      });
      continue;
    }
    if (f.qualificationId !== qualificationId) continue;
    const unknownMembers = f.memberSubjects.filter((s) => !knownSubjects.has(s));
    if (unknownMembers.length > 0) {
      gaps.push({
        gapType: "EVIDENCE_NORMALIZATION_REVIEW",
        candidateKey: f.familyKey,
        evidenceAvailable: [`unknownMembers=${unknownMembers.join(", ")}`],
        unresolved: `CurriculumFamily "${f.familyKey}" references member subject(s) not present in normalized curriculum evidence: ${unknownMembers.join(", ")}.`,
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

export function computePerformanceDepthGaps(candidates: readonly KnowledgeCandidate[]): GapRecord[] {
  return candidates
    .filter((c) => c.disposition === "REQUIRED_EXPLICIT_CURRICULUM" && c.confidence.depthConfidence !== "HIGH")
    .map((c) => ({
      gapType: "PERFORMANCE_DEPTH_GAP" as const,
      candidateKey: c.candidateKey,
      evidenceAvailable: [c.rationale],
      unresolved: `Exact learner-performance depth for "${c.subject}" is not yet confirmed by assessment evidence (current depth confidence: ${c.confidence.depthConfidence}).`,
      legitimateResolverRoles: ["PUBLIC_ASSESSMENT"] as EvidenceRole[],
    }));
}

/** CC-18B: only fires for a candidate that structurally requires fact-key coverage (`requiredFactKeys.length > 0`) and isn't yet COMPLETE -- a candidate needing no facts is never "gapped" for lacking one. */
export function computeTechnicalTruthGaps(candidates: readonly KnowledgeCandidate[]): GapRecord[] {
  return candidates
    .filter((c) => REQUIRED_DISPOSITIONS.includes(c.disposition) && (c.requiredFactKeys?.length ?? 0) > 0 && c.technicalCoverageStatus !== "COMPLETE")
    .map((c) => ({
      gapType: "TECHNICAL_TRUTH_GAP" as const,
      candidateKey: c.candidateKey,
      evidenceAvailable: [`requiredFactKeys=${(c.requiredFactKeys ?? []).join(", ")}`, `attached=${Object.keys(c.factualStatementsByClaimKey ?? {}).join(", ") || "none"}`],
      unresolved: `Technical-truth coverage for "${c.subject}" is ${c.technicalCoverageStatus ?? "PARTIAL"} -- not every required fact key has an approved matching TECHNICAL_TRUTH claim.`,
      legitimateResolverRoles: ["TECHNICAL_TRUTH"] as EvidenceRole[],
    }));
}

// ---------------------------------------------------------------------
// Standard-mode orchestration. Locked to exactly one qualificationId per
// run (CC-18B section 2); only STANDARD_MODE_CANDIDATE_ROLES may be
// passed in.
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

  // "Known" for relation/family governance purposes means present in EITHER
  // validated curriculum evidence OR the validated assessment stream -- a
  // relation must be able to legitimately connect a category to a subject
  // assessment evidence itself validly reveals (section 6/task section 3's
  // "assessment may still introduce a new subject" rule), while an entirely
  // fabricated subject with no supporting evidence anywhere is still rejected.
  const knownSubjects = new Set([...validCurriculum.map((e) => e.subject), ...validAssessment.map((e) => e.subject)]);
  const { validated: validRelations, gaps: relationGaps } = validateCurriculumSubjectRelations(input.subjectRelations ?? [], input.qualificationId, knownSubjects);
  const { validated: validFamilies, gaps: familyGaps } = validateCurriculumFamilies(input.families ?? [], input.qualificationId, knownSubjects);

  const curriculumCandidates = generateCurriculumCandidates(validCurriculum);
  const assessmentCandidates = generateAssessmentCandidates(validAssessment);
  const { candidates: patternCandidates, gaps: patternGaps } = detectAssessmentPatternCandidates(validAssessment, validFamilies);

  let candidates = mergeCandidates([...curriculumCandidates, ...assessmentCandidates, ...patternCandidates]);

  const validatedAssessmentIds = new Set(validAssessment.map((e) => e.evidenceId));
  const prerequisiteCandidates = generatePrerequisiteCandidates(input.prerequisites ?? [], input.capabilityRequirements ?? [], candidates, validatedAssessmentIds);
  const exemplarCandidates = generateExemplarCandidates(input.exemplars ?? [], candidates);
  candidates = mergeCandidates([...candidates, ...prerequisiteCandidates, ...exemplarCandidates]);

  const { candidates: withLevelConstraints, unmatched: unmatchedQualificationLevel } = attachQualificationLevelConstraints(
    candidates,
    (input.qualificationLevel ?? []).filter((e) => e.qualificationId === input.qualificationId),
  );
  candidates = withLevelConstraints;

  const { validated: validFactualClaims, gaps: factualClaimBasisGaps } = validateFactualClaims(input.factualClaims ?? []);
  const { candidates: withFactualClaims, unmatched: unmatchedTechnicalTruth } = attachFactualClaims(candidates, input.factRequirements ?? [], validFactualClaims);
  candidates = withFactualClaims;
  const conflictGaps = detectFactualConflicts(validFactualClaims, ["OFFICIAL_CURRICULUM"]);

  const { candidates: breadthCandidates, gaps: breadthGaps } = computeCategoryBreadthOutcomes(validCurriculum, validAssessment, validRelations);
  candidates = mergeCandidates([...candidates, ...breadthCandidates]);

  const depthGaps = computePerformanceDepthGaps(candidates);
  const truthGaps = computeTechnicalTruthGaps(candidates);

  return {
    candidates,
    gaps: [...registryGaps, ...curriculumGaps, ...assessmentGaps, ...relationGaps, ...familyGaps, ...factualClaimBasisGaps, ...conflictGaps, ...breadthGaps, ...patternGaps, ...depthGaps, ...truthGaps],
    unmatchedTechnicalTruth,
    unmatchedQualificationLevel,
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
