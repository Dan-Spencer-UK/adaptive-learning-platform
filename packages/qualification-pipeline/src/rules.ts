/**
 * CC-18: generic qualification knowledge-construction pipeline -- rules.
 *
 * Pure, deterministic functions only. No network, no clock, no RNG, no
 * model calls. Every function operates on the generic evidence records in
 * ./types.ts and their declared `role`/relationship fields -- NONE of the
 * conditions in this file may inspect a specific subject string (a real
 * qualification, AC, Range item or topic name). That restriction is
 * verified mechanically by rules.test.ts's own "no topic branching" test,
 * which scans this file's source for banned literals.
 *
 * See docs/architecture/qualification-knowledge-construction-pipeline.md
 * for the design this file implements.
 */

import {
  REQUIRED_DISPOSITIONS,
  STANDARD_MODE_CANDIDATE_ROLES,
  candidateKey,
  type AssessmentEvidence,
  type CandidateDisposition,
  type ConfidenceLevel,
  type CurriculumEvidence,
  type DiagnosticComparisonEntry,
  type EvidenceRole,
  type ExemplarEvidence,
  type GapRecord,
  type KnowledgeCandidate,
  type LegacyDiagnosticEvidence,
  type OptionalCalibrationEvidence,
  type PrerequisiteEvidence,
  type StandardPipelineResult,
  type TechnicalTruthEvidence,
} from "./types.ts";

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

/**
 * Merges candidates sharing a `candidateKey` into one, preferring the more
 * authoritative disposition, taking the max of each confidence dimension,
 * and unioning evidence references -- never silently dropping a source.
 */
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
    });
  }
  return [...byKey.values()];
}

// ---------------------------------------------------------------------
// Curriculum candidate generation (task section 5/6).
// ---------------------------------------------------------------------

/**
 * A subject counts as top-level required scope if EITHER it is named
 * directly in AC/LO primary wording, OR it is a standalone Range item (no
 * `refinesSubject`) -- these are independent sources, so a subject named
 * only in primary wording still becomes scope even when no Range item
 * separately enumerates it (task section 5's own regression case), and a
 * Range item establishes only the category it names, never automatically
 * any of its internal implementation detail (task section 6).
 */
export function generateCurriculumCandidates(evidence: readonly CurriculumEvidence[]): KnowledgeCandidate[] {
  const topLevel = new Map<string, CurriculumEvidence[]>();
  const refinementsBySubject = new Map<string, CurriculumEvidence[]>();

  for (const e of evidence) {
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
      ? "Named directly in the qualification's own primary AC/LO wording -- curriculum scope authority independent of any Range enumeration (task section 5)."
      : "Named as a standalone official Range item -- establishes the category as curriculum scope; internal implementation detail is not automatically authorised without independent evidence (task section 6).";
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
    });
  }
  return candidates;
}

// ---------------------------------------------------------------------
// Assessment candidate generation (task section 3/4) -- the
// positive-target rule. `distractorSubjects` is never read here.
// ---------------------------------------------------------------------

export function generateAssessmentCandidates(evidence: readonly AssessmentEvidence[]): KnowledgeCandidate[] {
  const byKey = new Map<string, AssessmentEvidence[]>();
  for (const e of evidence) {
    if (!e.mappedCurriculumUnitId.trim()) continue; // not validly mapped -- not legitimate evidence (task section 9)
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
      rationale: `Directly evidenced by ${items.length} assessment item(s) (${items.map((i) => i.itemId).join(", ")}), validly mapped to the qualification (${first.mappedCurriculumUnitId}); the positive target only -- correct-answer requirement, never distractor content from the same item.`,
      evidenceRefs: items.map((i) => ({ role: i.role, evidenceId: i.evidenceId })),
    });
  }
  return candidates;
}

// ---------------------------------------------------------------------
// Minimal prerequisite rule (task section 8).
// ---------------------------------------------------------------------

export function generatePrerequisiteCandidates(
  evidence: readonly PrerequisiteEvidence[],
  existingCandidates: readonly KnowledgeCandidate[],
): KnowledgeCandidate[] {
  const requiredKeys = new Set(existingCandidates.filter((c) => REQUIRED_DISPOSITIONS.includes(c.disposition)).map((c) => c.candidateKey));
  return evidence.map((e) => {
    const linkedToRequired = requiredKeys.has(e.necessaryForCandidateKey);
    const isOperationallyNecessary = e.necessityKind === "OPERATIONALLY_NECESSARY_FOR_STATED_PROCEDURE";
    const disposition: CandidateDisposition = linkedToRequired && isOperationallyNecessary ? "FOUNDATIONAL_PREREQUISITE" : "CONTEXTUAL_TEACHING_SUPPORT";
    const rationale =
      disposition === "FOUNDATIONAL_PREREQUISITE"
        ? `Minimal prerequisite operationally necessary to perform the explicit required procedure "${e.necessaryForCandidateKey}": ${e.minimalDepthJustification}`
        : !linkedToRequired
          ? `Does not reference an existing required candidate ("${e.necessaryForCandidateKey}") -- capped at contextual teaching support.`
          : `Claimed only as background/contextual, not an operationally necessary step for "${e.necessaryForCandidateKey}" -- capped at contextual teaching support; a broader topic being in scope never by itself promotes adjacent knowledge to a prerequisite (task section 8).`;
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
      evidenceRefs: [{ role: e.role, evidenceId: e.evidenceId }],
    };
  });
}

// ---------------------------------------------------------------------
// Exemplar vs mastery (task section 12).
// ---------------------------------------------------------------------

export function generateExemplarCandidates(
  evidence: readonly ExemplarEvidence[],
  existingCandidates: readonly KnowledgeCandidate[],
): KnowledgeCandidate[] {
  const requiredSubjects = new Set(existingCandidates.filter((c) => REQUIRED_DISPOSITIONS.includes(c.disposition)).map((c) => c.subject));
  const candidates: KnowledgeCandidate[] = [];
  for (const e of evidence) {
    if (!requiredSubjects.has(e.exemplarOfCategory)) continue; // nothing required for this to illustrate -- not created
    const detail = (e.implementationDetailSubjects ?? []).join(", ") || "none recorded";
    candidates.push({
      candidateKey: candidateKey(e.exemplarSubject, "OTHER"),
      subject: e.exemplarSubject,
      performanceType: "OTHER",
      disposition: "REPRESENTATIVE_EXEMPLAR",
      confidence: {
        scopeConfidence: "MEDIUM",
        depthConfidence: "NONE",
        technicalTruthConfidence: e.role === "TECHNICAL_TRUTH" ? "HIGH" : "NONE",
      },
      rationale: `Technically valid representative example used to illustrate the required category "${e.exemplarOfCategory}" -- teaching-example status only, not an independent mastery requirement. Recorded implementation detail (${detail}) is never independently promoted to its own required candidate (task section 12).`,
      evidenceRefs: [{ role: e.role, evidenceId: e.evidenceId }],
      exemplarOfCategory: e.exemplarOfCategory,
    });
  }
  return candidates;
}

// ---------------------------------------------------------------------
// Technical truth attachment + curriculum/technical conflict detection
// (task section 13/14).
// ---------------------------------------------------------------------

export function attachTechnicalTruth(
  candidates: readonly KnowledgeCandidate[],
  evidence: readonly TechnicalTruthEvidence[],
): { candidates: KnowledgeCandidate[]; gaps: GapRecord[]; unmatched: TechnicalTruthEvidence[] } {
  const bySubject = new Map<string, TechnicalTruthEvidence[]>();
  for (const e of evidence) {
    const list = bySubject.get(e.subject) ?? [];
    list.push(e);
    bySubject.set(e.subject, list);
  }

  const matchedSubjects = new Set<string>();
  const gaps: GapRecord[] = [];
  const updated = candidates.map((c) => {
    const matches = bySubject.get(c.subject);
    if (!matches || matches.length === 0) return c;
    matchedSubjects.add(c.subject);
    const primary = matches[0]!;
    for (const m of matches) {
      if (m.conflictingCurriculumStatement) {
        gaps.push({
          gapType: "CURRICULUM_TECHNICAL_CONFLICT",
          candidateKey: c.candidateKey,
          evidenceAvailable: [`technical truth: ${m.correctStatement}`, `curriculum/provider material: ${m.conflictingCurriculumStatement}`],
          unresolved: `Curriculum/provider material states "${m.conflictingCurriculumStatement}" for "${c.subject}", which conflicts with the approved technical-truth statement "${m.correctStatement}". Scope authority (whether the topic is in scope) remains with curriculum evidence; factual authority (what is taught) remains with technical-truth evidence -- the two are never collapsed (task section 13, a constitutional rule).`,
          legitimateResolverRole: "TECHNICAL_TRUTH",
          notes: "The approved technical-truth statement is retained as the taught fact; the conflicting curriculum/provider wording is never promoted into the domain-knowledge layer.",
        });
      }
    }
    return {
      ...c,
      factualStatement: primary.correctStatement,
      confidence: { ...c.confidence, technicalTruthConfidence: "HIGH" as ConfidenceLevel },
      evidenceRefs: [...c.evidenceRefs, ...matches.map((m) => ({ role: m.role, evidenceId: m.evidenceId }))],
    };
  });

  const unmatched = evidence.filter((e) => !matchedSubjects.has(e.subject));
  return { candidates: updated, gaps, unmatched };
}

// ---------------------------------------------------------------------
// Assessment family-pattern generalisation (task section 11).
// ---------------------------------------------------------------------

export function detectAssessmentPatternCandidates(evidence: readonly AssessmentEvidence[]): { candidates: KnowledgeCandidate[]; gaps: GapRecord[] } {
  const byFamilyAndType = new Map<string, AssessmentEvidence[]>();
  for (const e of evidence) {
    if (!e.familyKey) continue;
    const key = `${e.familyKey}::${e.performanceType}`;
    const list = byFamilyAndType.get(key) ?? [];
    list.push(e);
    byFamilyAndType.set(key, list);
  }

  const candidates: KnowledgeCandidate[] = [];
  const gaps: GapRecord[] = [];
  for (const items of byFamilyAndType.values()) {
    const distinctSubjects = [...new Set(items.map((i) => i.subject))];
    // A single tested member never generalises to its family (task section 11/case H).
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
      rationale: `Repeated ${performanceType} assessment evidence across ${distinctSubjects.length} distinct members of the "${familyKey}" family (${distinctSubjects.join(", ")}) suggests a possible family-wide performance pattern. This is NOT auto-generalised to untested members and remains REVIEW_REQUIRED unless explicit curriculum wording independently supports family-wide generalisation (task section 11). The individually tested members remain separately REQUIRED_ASSESSMENT_EVIDENCED; untested family members are never silently promoted.`,
      evidenceRefs: items.map((i) => ({ role: i.role, evidenceId: i.evidenceId })),
      assessmentPattern: { familyKey, evidencedMembers: distinctSubjects },
    });
    gaps.push({
      gapType: "ASSESSMENT_GENERALISATION_REVIEW",
      candidateKey: patternKey,
      evidenceAvailable: distinctSubjects.map((m) => `${m} (${performanceType})`),
      unresolved: `Whether untested members of the "${familyKey}" family share this same ${performanceType} requirement is unresolved.`,
      legitimateResolverRole: "OFFICIAL_CURRICULUM",
    });
  }
  return { candidates, gaps };
}

// ---------------------------------------------------------------------
// Broad/under-specified curriculum labels -> OPEN_SCOPE_GAP (task
// section 7). Absence of a full evidence-based enumeration must never
// resolve to either "only what's evidenced" or an invented exhaustive
// list.
// ---------------------------------------------------------------------

export function computeScopeBreadthGaps(
  curriculumEvidence: readonly CurriculumEvidence[],
  assessmentEvidence: readonly AssessmentEvidence[],
): { candidates: KnowledgeCandidate[]; gaps: GapRecord[] } {
  const categories = new Map<string, CurriculumEvidence[]>();
  for (const e of curriculumEvidence) {
    if (e.refinesSubject) continue;
    const list = categories.get(e.subject) ?? [];
    list.push(e);
    categories.set(e.subject, list);
  }

  const candidates: KnowledgeCandidate[] = [];
  const gaps: GapRecord[] = [];
  for (const [subject, records] of categories) {
    if (records.some((r) => r.breadthFullyEnumerated === true)) continue;
    const narrowerEvidenced = assessmentEvidence.filter((a) => a.underCategory === subject);
    if (narrowerEvidenced.length === 0) continue;

    const evidencedSubjects = [...new Set(narrowerEvidenced.map((a) => a.subject))];
    const gapKey = `${subject}::unresolved-breadth`;
    candidates.push({
      candidateKey: gapKey,
      subject: gapKey,
      performanceType: "OTHER",
      disposition: "OPEN_SCOPE_GAP",
      confidence: { scopeConfidence: "HIGH", depthConfidence: "NONE", technicalTruthConfidence: "NONE" },
      rationale: `"${subject}" is a broad, un-enumerated curriculum label. ${evidencedSubjects.length} sub-item(s) are directly assessment-evidenced (${evidencedSubjects.join(", ")}); the category's remaining internal breadth is neither confirmed nor excluded by current transferable evidence (task section 7) -- not silently resolved to only the evidenced items, and not expanded to an invented exhaustive list.`,
      evidenceRefs: records.map((r) => ({ role: r.role, evidenceId: r.evidenceId })),
    });
    gaps.push({
      gapType: "SCOPE_BREADTH_GAP",
      candidateKey: gapKey,
      evidenceAvailable: evidencedSubjects,
      unresolved: `Full internal breadth of "${subject}" beyond the directly evidenced sub-item(s) is unresolved.`,
      legitimateResolverRole: "OFFICIAL_CURRICULUM",
    });
  }
  return { candidates, gaps };
}

// ---------------------------------------------------------------------
// Generic gap production for depth / technical-truth coverage (task
// section 16/17).
// ---------------------------------------------------------------------

export function computePerformanceDepthGaps(candidates: readonly KnowledgeCandidate[]): GapRecord[] {
  return candidates
    .filter((c) => c.disposition === "REQUIRED_EXPLICIT_CURRICULUM" && c.confidence.depthConfidence !== "HIGH")
    .map((c) => ({
      gapType: "PERFORMANCE_DEPTH_GAP" as const,
      candidateKey: c.candidateKey,
      evidenceAvailable: [c.rationale],
      unresolved: `Exact learner-performance depth for "${c.subject}" is not yet confirmed by assessment evidence (current depth confidence: ${c.confidence.depthConfidence}).`,
      legitimateResolverRole: "PUBLIC_ASSESSMENT" as const,
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
      legitimateResolverRole: "TECHNICAL_TRUTH" as const,
    }));
}

// ---------------------------------------------------------------------
// Standard-mode orchestration (task section 18/19/24). Only
// STANDARD_MODE_CANDIDATE_ROLES may be passed in; OPTIONAL_CALIBRATION
// and LEGACY_DIAGNOSTIC evidence is rejected outright, defense in depth
// on top of the type system itself excluding them from these input types.
// ---------------------------------------------------------------------

export interface StandardPipelineInput {
  readonly curriculum: readonly CurriculumEvidence[];
  readonly assessment: readonly AssessmentEvidence[];
  readonly technicalTruth?: readonly TechnicalTruthEvidence[];
  readonly prerequisites?: readonly PrerequisiteEvidence[];
  readonly exemplars?: readonly ExemplarEvidence[];
}

function assertStandardModeRole(role: EvidenceRole, evidenceId: string): void {
  if (!STANDARD_MODE_CANDIDATE_ROLES.includes(role)) {
    throw new Error(
      `buildStandardPipeline received evidence with role "${role}" (evidenceId=${evidenceId}) -- OPTIONAL_CALIBRATION and LEGACY_DIAGNOSTIC evidence must never be passed to the standard pipeline (task section 18/19).`,
    );
  }
}

export function buildStandardPipeline(input: StandardPipelineInput): StandardPipelineResult {
  for (const e of input.curriculum) assertStandardModeRole(e.role, e.evidenceId);
  for (const e of input.assessment) assertStandardModeRole(e.role, e.evidenceId);
  for (const e of input.technicalTruth ?? []) assertStandardModeRole(e.role, e.evidenceId);
  for (const e of input.prerequisites ?? []) assertStandardModeRole(e.role, e.evidenceId);
  for (const e of input.exemplars ?? []) assertStandardModeRole(e.role, e.evidenceId);

  const curriculumCandidates = generateCurriculumCandidates(input.curriculum);
  const assessmentCandidates = generateAssessmentCandidates(input.assessment);
  const { candidates: patternCandidates, gaps: patternGaps } = detectAssessmentPatternCandidates(input.assessment);

  let candidates = mergeCandidates([...curriculumCandidates, ...assessmentCandidates, ...patternCandidates]);

  const prerequisiteCandidates = generatePrerequisiteCandidates(input.prerequisites ?? [], candidates);
  const exemplarCandidates = generateExemplarCandidates(input.exemplars ?? [], candidates);
  candidates = mergeCandidates([...candidates, ...prerequisiteCandidates, ...exemplarCandidates]);

  const { candidates: withTechnicalTruth, gaps: conflictGaps, unmatched } = attachTechnicalTruth(candidates, input.technicalTruth ?? []);
  candidates = withTechnicalTruth;

  const { candidates: breadthGapCandidates, gaps: breadthGaps } = computeScopeBreadthGaps(input.curriculum, input.assessment);
  candidates = mergeCandidates([...candidates, ...breadthGapCandidates]);

  const depthGaps = computePerformanceDepthGaps(candidates);
  const truthGaps = computeTechnicalTruthGaps(candidates);

  return {
    candidates,
    gaps: [...conflictGaps, ...breadthGaps, ...patternGaps, ...depthGaps, ...truthGaps],
    unmatchedTechnicalTruth: unmatched,
  };
}

// ---------------------------------------------------------------------
// Diagnostic-only comparison (task section 18/19). Read-only: never
// mutates `candidates`, never returns a KnowledgeCandidate, never feeds
// back into the standard pipeline. The only legitimate use of
// OPTIONAL_CALIBRATION / LEGACY_DIAGNOSTIC evidence anywhere in this
// package.
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
