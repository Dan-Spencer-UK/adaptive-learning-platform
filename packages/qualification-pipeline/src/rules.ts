/**
 * CC-18/CC-18A: generic qualification knowledge-construction pipeline --
 * rules.
 *
 * Pure, deterministic functions only. No network, no clock, no RNG, no
 * model calls. Production logic in this file may never inspect a
 * specific subject string (a real qualification, AC, Range item or
 * topic name) -- verified mechanically by rules.test.ts's own source
 * scan.
 *
 * See docs/architecture/qualification-knowledge-construction-pipeline.md
 * for the design this file implements, and types.ts's own CC-18A header
 * for the specific integrity gaps this revision closes relative to CC-18.
 */

import {
  REQUIRED_DISPOSITIONS,
  STANDARD_MODE_CANDIDATE_ROLES,
  candidateKey,
  normalizationBasisSchema,
  type AssessmentEvidence,
  type CandidateDisposition,
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
  type OfficialCurriculumUnit,
  type OptionalCalibrationEvidence,
  type PrerequisiteEvidence,
  type QualificationLevelEvidence,
  type SourceFactualClaim,
  type SourceProvenance,
  type StandardPipelineResult,
} from "./types.ts";

// ---------------------------------------------------------------------
// Provenance gate (CC-18A section 21/23-AC). An evidence record lacking
// valid, non-empty source provenance is rejected -- never silently
// accepted as a basis for a HIGH-confidence required candidate.
// ---------------------------------------------------------------------

export function hasValidProvenance(evidence: SourceProvenance): boolean {
  return (
    evidence.sourceRef.trim().length > 0 &&
    evidence.sourceLocator.trim().length > 0 &&
    normalizationBasisSchema.safeParse(evidence.normalizationBasis).success
  );
}

// ---------------------------------------------------------------------
// Confidence / disposition ordering helpers.
// ---------------------------------------------------------------------

const CONFIDENCE_ORDER: Record<ConfidenceLevel, number> = { NONE: 0, LOW: 1, MEDIUM: 2, HIGH: 3 };

function maxConfidence(a: ConfidenceLevel, b: ConfidenceLevel): ConfidenceLevel {
  return CONFIDENCE_ORDER[a] >= CONFIDENCE_ORDER[b] ? a : b;
}

/** Lower number = more authoritative when two candidates share a (subject, performanceType) key. */
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
    byKey.set(c.candidateKey, {
      ...preferred,
      confidence: {
        scopeConfidence: maxConfidence(existing.confidence.scopeConfidence, c.confidence.scopeConfidence),
        depthConfidence: maxConfidence(existing.confidence.depthConfidence, c.confidence.depthConfidence),
        technicalTruthConfidence: maxConfidence(existing.confidence.technicalTruthConfidence, c.confidence.technicalTruthConfidence),
      },
      rationale: preferred.rationale === other.rationale ? preferred.rationale : `${preferred.rationale} Additionally: ${other.rationale}`,
      evidenceRefs: [...existing.evidenceRefs, ...c.evidenceRefs],
      factualStatement: preferred.factualStatement ?? other.factualStatement,
      requiredCapabilityKeys:
        (existing.requiredCapabilityKeys?.length ?? 0) + (c.requiredCapabilityKeys?.length ?? 0) > 0
          ? [...new Set([...(existing.requiredCapabilityKeys ?? []), ...(c.requiredCapabilityKeys ?? [])])]
          : undefined,
      qualificationLevelRefs: [...(existing.qualificationLevelRefs ?? []), ...(c.qualificationLevelRefs ?? [])],
      depthConstraintNote: preferred.depthConstraintNote ?? other.depthConstraintNote,
    });
  }
  return [...byKey.values()];
}

// ---------------------------------------------------------------------
// Curriculum candidate generation (task section 5/6, CC-18).
// ---------------------------------------------------------------------

export function generateCurriculumCandidates(evidence: readonly CurriculumEvidence[]): KnowledgeCandidate[] {
  const valid = evidence.filter(hasValidProvenance);
  const topLevel = new Map<string, CurriculumEvidence[]>();
  const refinementsBySubject = new Map<string, CurriculumEvidence[]>();

  for (const e of valid) {
    if (e.refinesSubject) {
      const list = refinementsBySubject.get(e.refinesSubject) ?? [];
      list.push(e);
      refinementsBySubject.set(e.refinesSubject, list);
      continue;
    }
    const list = topLevel.get(e.subject) ?? [];
    list.push(e);
    topLevel.set(e.subject, list);
  }

  const candidates: KnowledgeCandidate[] = [];
  for (const [subject, records] of topLevel) {
    const withVerb = records.find((r) => r.commandVerbPerformanceType);
    const performanceType = withVerb?.commandVerbPerformanceType ?? "OTHER";
    const refinements = refinementsBySubject.get(subject) ?? [];
    const namedPrimary = records.some((r) => r.namedInPrimaryWording);
    const rationale = namedPrimary
      ? "Named directly in the qualification's own primary AC/LO wording -- curriculum scope authority independent of any Range enumeration."
      : "Named as a standalone official Range item -- establishes the category as curriculum scope; internal implementation detail is not automatically authorised without independent evidence.";
    const requiredCapabilityKeys = [...new Set(records.flatMap((r) => r.requiredCapabilityKeys ?? []))];
    candidates.push({
      candidateKey: candidateKey(subject, performanceType),
      subject,
      performanceType,
      disposition: "REQUIRED_EXPLICIT_CURRICULUM",
      confidence: {
        scopeConfidence: "HIGH",
        depthConfidence: refinements.length > 0 ? "MEDIUM" : "NONE",
        technicalTruthConfidence: "NONE",
      },
      rationale,
      evidenceRefs: [...records, ...refinements].map((r) => ({ role: r.role, evidenceId: r.evidenceId })),
      requiredCapabilityKeys: requiredCapabilityKeys.length > 0 ? requiredCapabilityKeys : undefined,
    });
  }
  return candidates;
}

// ---------------------------------------------------------------------
// Assessment candidate generation (task section 3/4, CC-18) -- the
// positive-target rule. Mapping validation added CC-18A sections 2-6:
// a `mappedCurriculumUnitId` counts only when it resolves to a REAL
// `OfficialCurriculumUnit` belonging to the SAME qualification as the
// assessment item itself.
// ---------------------------------------------------------------------

export function generateAssessmentCandidates(
  evidence: readonly AssessmentEvidence[],
  officialCurriculumUnits: readonly OfficialCurriculumUnit[],
): { candidates: KnowledgeCandidate[]; gaps: GapRecord[] } {
  const unitById = new Map(officialCurriculumUnits.map((u) => [u.curriculumUnitId, u] as const));
  const gaps: GapRecord[] = [];
  const byKey = new Map<string, AssessmentEvidence[]>();

  for (const e of evidence) {
    if (!hasValidProvenance(e)) continue; // rejected, never silently accepted at HIGH confidence

    const mappedId = e.mappedCurriculumUnitId.trim();
    const unit = mappedId ? unitById.get(mappedId) : undefined;
    const validMapping = !!unit && unit.qualificationId === e.qualificationId;

    if (!validMapping) {
      const reason = !mappedId
        ? "No curriculum-unit mapping was supplied for this assessment item."
        : !unit
          ? `Mapped curriculum-unit id "${mappedId}" does not resolve to any official curriculum unit in the registry.`
          : `Mapped curriculum-unit id "${mappedId}" belongs to qualification "${unit.qualificationId}", not this item's own qualification "${e.qualificationId}".`;
      gaps.push({
        gapType: "ASSESSMENT_MAPPING_REVIEW",
        candidateKey: candidateKey(e.subject, e.performanceType),
        evidenceAvailable: [`assessmentSource=${e.assessmentSource}`, `itemId=${e.itemId}`, `attemptedMapping=${mappedId || "(none)"}`, `targetSubject=${e.subject}`, `targetPerformanceType=${e.performanceType}`],
        unresolved: reason,
        legitimateResolverRoles: ["OFFICIAL_CURRICULUM"],
        notes: "Preserved for review; does not generate REQUIRED_ASSESSMENT_EVIDENCED scope until a valid curriculum-unit mapping is established.",
      });
      continue;
    }

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
      rationale: `Directly evidenced by ${items.length} assessment item(s) (${items.map((i) => i.itemId).join(", ")}), validated against the official curriculum-unit registry (${first.mappedCurriculumUnitId}); the positive target only -- correct-answer requirement, never distractor content from the same item.`,
      evidenceRefs: items.map((i) => ({ role: i.role, evidenceId: i.evidenceId })),
    });
  }
  return { candidates, gaps };
}

// ---------------------------------------------------------------------
// Structural prerequisite dependency rule (CC-18A section 9-11). The
// free-form `necessityKind` self-declaration CC-18 used is gone -- the
// only gate is a `capabilityKey` match against an existing REQUIRED_*
// candidate's own declared `requiredCapabilityKeys`.
// ---------------------------------------------------------------------

export function generatePrerequisiteCandidates(
  evidence: readonly PrerequisiteEvidence[],
  existingCandidates: readonly KnowledgeCandidate[],
): KnowledgeCandidate[] {
  const requiredByKey = new Map(existingCandidates.filter((c) => REQUIRED_DISPOSITIONS.includes(c.disposition)).map((c) => [c.candidateKey, c] as const));

  return evidence.filter(hasValidProvenance).map((e) => {
    const target = requiredByKey.get(e.necessaryForCandidateKey);
    const structuralMatch = !!target && (target.requiredCapabilityKeys ?? []).includes(e.capabilityKey);

    const disposition: CandidateDisposition = structuralMatch ? "FOUNDATIONAL_PREREQUISITE" : target ? "REVIEW_REQUIRED" : "CONTEXTUAL_TEACHING_SUPPORT";

    const rationale = structuralMatch
      ? `Capability "${e.capabilityKey}" is structurally declared as required by "${e.necessaryForCandidateKey}" (requiredCapabilityKeys match) -- minimal prerequisite: ${e.minimalDepthJustification}`
      : target
        ? `A required candidate "${e.necessaryForCandidateKey}" exists, but it does not structurally declare "${e.capabilityKey}" among its own requiredCapabilityKeys -- a claimed necessity label alone is never sufficient (CC-18A section 9); held at REVIEW_REQUIRED pending Project-Architect confirmation of the structural dependency.`
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
      evidenceRefs: [{ role: "STRUCTURAL_PREREQUISITE_DEPENDENCY", evidenceId: e.evidenceId }],
    };
  });
}

// ---------------------------------------------------------------------
// Qualification-level depth-constraint attachment (CC-18A section 7/8).
// NEVER creates a new candidate -- only attaches to a candidate that
// already exists under the exact key it names.
// ---------------------------------------------------------------------

export function attachQualificationLevelConstraints(
  candidates: readonly KnowledgeCandidate[],
  evidence: readonly QualificationLevelEvidence[],
): { candidates: KnowledgeCandidate[]; unmatched: QualificationLevelEvidence[] } {
  const valid = evidence.filter(hasValidProvenance);
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
// Exemplar vs mastery (task section 12, CC-18).
// ---------------------------------------------------------------------

export function generateExemplarCandidates(evidence: readonly ExemplarEvidence[], existingCandidates: readonly KnowledgeCandidate[]): KnowledgeCandidate[] {
  const requiredSubjects = new Set(existingCandidates.filter((c) => REQUIRED_DISPOSITIONS.includes(c.disposition)).map((c) => c.subject));
  const candidates: KnowledgeCandidate[] = [];
  for (const e of evidence) {
    if (!requiredSubjects.has(e.exemplarOfCategory)) continue;
    const detail = (e.implementationDetailSubjects ?? []).join(", ") || "none recorded";
    candidates.push({
      candidateKey: candidateKey(e.exemplarSubject, "OTHER"),
      subject: e.exemplarSubject,
      performanceType: "OTHER",
      disposition: "REPRESENTATIVE_EXEMPLAR",
      confidence: { scopeConfidence: "MEDIUM", depthConfidence: "NONE", technicalTruthConfidence: e.role === "TECHNICAL_TRUTH" ? "HIGH" : "NONE" },
      rationale: `Technically valid representative example used to illustrate the required category "${e.exemplarOfCategory}" -- teaching-example status only, not an independent mastery requirement. Recorded implementation detail (${detail}) is never independently promoted to its own required candidate.`,
      evidenceRefs: [{ role: e.role, evidenceId: e.evidenceId }],
      exemplarOfCategory: e.exemplarOfCategory,
    });
  }
  return candidates;
}

// ---------------------------------------------------------------------
// Independent factual-claim model + real conflict detection (CC-18A
// section 12-15). No pre-labelled conflict field anywhere -- two
// independent SourceFactualClaim records sharing a claimKey are compared.
// ---------------------------------------------------------------------

export function attachFactualClaims(
  candidates: readonly KnowledgeCandidate[],
  claims: readonly SourceFactualClaim[],
): { candidates: KnowledgeCandidate[]; unmatched: SourceFactualClaim[] } {
  const technical = claims.filter((c) => c.sourceRole === "TECHNICAL_TRUTH" && hasValidProvenance(c));
  const bySubject = new Map<string, SourceFactualClaim[]>();
  for (const c of technical) {
    const list = bySubject.get(c.subject) ?? [];
    list.push(c);
    bySubject.set(c.subject, list);
  }

  const matchedSubjects = new Set<string>();
  const updated = candidates.map((c) => {
    const matches = bySubject.get(c.subject);
    if (!matches || matches.length === 0) return c;
    matchedSubjects.add(c.subject);
    return {
      ...c,
      factualStatement: matches[0]!.normalizedClaimValue,
      confidence: { ...c.confidence, technicalTruthConfidence: "HIGH" as ConfidenceLevel },
      evidenceRefs: [...c.evidenceRefs, ...matches.map((m) => ({ role: "TECHNICAL_TRUTH" as const, evidenceId: m.evidenceId }))],
    };
  });

  const unmatched = technical.filter((c) => !matchedSubjects.has(c.subject));
  return { candidates: updated, unmatched };
}

/**
 * Groups independent factual claims by their shared `claimKey` and emits
 * a `CURRICULUM_TECHNICAL_CONFLICT` wherever a TECHNICAL_TRUTH claim and
 * a claim from one of `comparisonRoles` disagree on `normalizedClaimValue`
 * for the same claimKey. No claim record is ever told by another that a
 * conflict exists -- this function is the only place that decides that.
 */
export function detectFactualConflicts(claims: readonly SourceFactualClaim[], comparisonRoles: readonly EvidenceRole[] = ["OFFICIAL_CURRICULUM"]): GapRecord[] {
  const valid = claims.filter(hasValidProvenance);
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

/**
 * CC-18A section 15: OPTIONAL_CALIBRATION material remains forbidden
 * from generating standard-mode required scope, but its factual claims
 * MAY be diagnostically compared against approved TECHNICAL_TRUTH. This
 * is a read-only comparison, called separately from
 * `buildStandardPipeline`, and its output must never be merged into
 * `StandardPipelineResult.gaps`.
 */
export function compareCalibrationFactualClaims(calibrationClaims: readonly SourceFactualClaim[], technicalClaims: readonly SourceFactualClaim[]): GapRecord[] {
  return detectFactualConflicts([...calibrationClaims, ...technicalClaims], ["OPTIONAL_CALIBRATION"]);
}

// ---------------------------------------------------------------------
// Assessment family-pattern generalisation (task section 11, CC-18).
// CC-18A section 6: `familyKey` only counts when it resolves to a
// governed `CurriculumFamily` that lists the item's own subject as a
// member -- an assessment record cannot unilaterally assert family
// membership.
// ---------------------------------------------------------------------

export function detectAssessmentPatternCandidates(
  evidence: readonly AssessmentEvidence[],
  curriculumFamilies: readonly CurriculumFamily[],
): { candidates: KnowledgeCandidate[]; gaps: GapRecord[] } {
  const familyByKey = new Map(curriculumFamilies.filter(hasValidProvenance).map((f) => [f.familyKey, f] as const));

  const byFamilyAndType = new Map<string, AssessmentEvidence[]>();
  for (const e of evidence) {
    if (!e.familyKey) continue;
    const family = familyByKey.get(e.familyKey);
    if (!family || !family.memberSubjects.includes(e.subject)) continue; // ungoverned family label -- ignored for pattern purposes
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
      rationale: `Repeated ${performanceType} assessment evidence across ${distinctSubjects.length} distinct, governed members of the "${familyKey}" family (${distinctSubjects.join(", ")}) suggests a possible family-wide performance pattern. NOT auto-generalised to untested members and remains REVIEW_REQUIRED unless explicit curriculum wording independently supports family-wide generalisation. The individually tested members remain separately REQUIRED_ASSESSMENT_EVIDENCED; untested family members are never silently promoted.`,
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
// Category breadth status (CC-18A section 18/19). A breadth gap is
// produced from the curriculum's OWN declared breadth status, entirely
// independent of whether any assessment evidence exists.
// `underCategory` only counts as legitimate narrower evidence when a
// matching governed `CurriculumSubjectRelation` also exists (CC-18A
// section 6).
// ---------------------------------------------------------------------

export function computeCategoryBreadthOutcomes(
  curriculumEvidence: readonly CurriculumEvidence[],
  assessmentEvidence: readonly AssessmentEvidence[],
  subjectRelations: readonly CurriculumSubjectRelation[],
): { candidates: KnowledgeCandidate[]; gaps: GapRecord[] } {
  const governedPairs = new Set(subjectRelations.filter(hasValidProvenance).map((r) => `${r.subject}::${r.underCategory}`));

  const categories = new Map<string, CurriculumEvidence[]>();
  for (const e of curriculumEvidence) {
    if (e.refinesSubject || !hasValidProvenance(e)) continue;
    const list = categories.get(e.subject) ?? [];
    list.push(e);
    categories.set(e.subject, list);
  }

  const candidates: KnowledgeCandidate[] = [];
  const gaps: GapRecord[] = [];
  for (const [subject, records] of categories) {
    const breadthStatus = records.map((r) => r.breadthStatus).find((s) => s !== undefined) ?? "UNKNOWN";
    if (breadthStatus === "ENUMERATED_COMPLETE") continue; // fully enumerated -- no breadth gap regardless of assessment coverage

    const governedEvidencedSubjects = [
      ...new Set(assessmentEvidence.filter((a) => a.underCategory === subject && governedPairs.has(`${a.subject}::${subject}`)).map((a) => a.subject)),
    ];

    const gapKey = `${subject}::unresolved-breadth`;
    if (breadthStatus === "OPEN_OR_UNDERSPECIFIED") {
      candidates.push({
        candidateKey: gapKey,
        subject: gapKey,
        performanceType: "OTHER",
        disposition: "OPEN_SCOPE_GAP",
        confidence: { scopeConfidence: "HIGH", depthConfidence: "NONE", technicalTruthConfidence: "NONE" },
        rationale: `"${subject}" is declared OPEN_OR_UNDERSPECIFIED by curriculum normalization. ${governedEvidencedSubjects.length} governed sub-item(s) directly assessment-evidenced (${governedEvidencedSubjects.join(", ") || "none"}); the category's remaining internal breadth is neither confirmed nor excluded by current transferable evidence -- not silently resolved to only the evidenced items, and not expanded to an invented exhaustive list. This gap is produced regardless of whether any assessment evidence exists.`,
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
      // UNKNOWN -- breadth status itself, not merely the breadth, is unresolved.
      candidates.push({
        candidateKey: gapKey,
        subject: gapKey,
        performanceType: "OTHER",
        disposition: "REVIEW_REQUIRED",
        confidence: { scopeConfidence: "HIGH", depthConfidence: "NONE", technicalTruthConfidence: "NONE" },
        rationale: `"${subject}"'s breadth status has not been declared by curriculum normalization (defaults to UNKNOWN, never silently treated as complete or as underspecified). Project-Architect review is required to establish whether this category is fully enumerated or genuinely open.`,
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

export function computeTechnicalTruthGaps(candidates: readonly KnowledgeCandidate[]): GapRecord[] {
  return candidates
    .filter((c) => REQUIRED_DISPOSITIONS.includes(c.disposition) && c.confidence.technicalTruthConfidence === "NONE")
    .map((c) => ({
      gapType: "TECHNICAL_TRUTH_GAP" as const,
      candidateKey: c.candidateKey,
      evidenceAvailable: [c.rationale],
      unresolved: `No approved technical-truth source has yet confirmed the factual content of "${c.subject}".`,
      legitimateResolverRoles: ["TECHNICAL_TRUTH"] as EvidenceRole[],
    }));
}

// ---------------------------------------------------------------------
// Standard-mode orchestration. Only STANDARD_MODE_CANDIDATE_ROLES may be
// passed in; OPTIONAL_CALIBRATION and LEGACY_DIAGNOSTIC evidence is
// rejected outright at runtime, on top of the type system already
// excluding them from these input types.
// ---------------------------------------------------------------------

export interface StandardPipelineInput {
  readonly officialCurriculumUnits: readonly OfficialCurriculumUnit[];
  readonly curriculum: readonly CurriculumEvidence[];
  readonly assessment: readonly AssessmentEvidence[];
  readonly subjectRelations?: readonly CurriculumSubjectRelation[];
  readonly families?: readonly CurriculumFamily[];
  readonly qualificationLevel?: readonly QualificationLevelEvidence[];
  readonly prerequisites?: readonly PrerequisiteEvidence[];
  readonly exemplars?: readonly ExemplarEvidence[];
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

  const { candidates: assessmentCandidates, gaps: mappingGaps } = generateAssessmentCandidates(input.assessment, input.officialCurriculumUnits);
  const curriculumCandidates = generateCurriculumCandidates(input.curriculum);
  const { candidates: patternCandidates, gaps: patternGaps } = detectAssessmentPatternCandidates(input.assessment, input.families ?? []);

  let candidates = mergeCandidates([...curriculumCandidates, ...assessmentCandidates, ...patternCandidates]);

  const prerequisiteCandidates = generatePrerequisiteCandidates(input.prerequisites ?? [], candidates);
  const exemplarCandidates = generateExemplarCandidates(input.exemplars ?? [], candidates);
  candidates = mergeCandidates([...candidates, ...prerequisiteCandidates, ...exemplarCandidates]);

  const { candidates: withLevelConstraints, unmatched: unmatchedQualificationLevel } = attachQualificationLevelConstraints(candidates, input.qualificationLevel ?? []);
  candidates = withLevelConstraints;

  const { candidates: withFactualClaims, unmatched: unmatchedTechnicalTruth } = attachFactualClaims(candidates, input.factualClaims ?? []);
  candidates = withFactualClaims;
  const conflictGaps = detectFactualConflicts(input.factualClaims ?? [], ["OFFICIAL_CURRICULUM"]);

  const { candidates: breadthCandidates, gaps: breadthGaps } = computeCategoryBreadthOutcomes(input.curriculum, input.assessment, input.subjectRelations ?? []);
  candidates = mergeCandidates([...candidates, ...breadthCandidates]);

  const depthGaps = computePerformanceDepthGaps(candidates);
  const truthGaps = computeTechnicalTruthGaps(candidates);

  return {
    candidates,
    gaps: [...mappingGaps, ...conflictGaps, ...breadthGaps, ...patternGaps, ...depthGaps, ...truthGaps],
    unmatchedTechnicalTruth,
    unmatchedQualificationLevel,
  };
}

// ---------------------------------------------------------------------
// Diagnostic-only comparison (task section 18/19, CC-18). Read-only:
// never mutates `candidates`, never returns a KnowledgeCandidate, never
// feeds back into the standard pipeline.
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
