/**
 * CC-23B §7-§11: the SECOND missing generic handoff. CC-23A made
 * `KnowledgeTarget.semanticIdentity` mandatory; the Unit-202 regression
 * adapter supplies it by hand. A future qualification must not need a
 * hand-written, module-specific adapter merely to enter evidence planning.
 *
 * This is a DOWNSTREAM handoff owned entirely by `@alp/technical-evidence-
 * engine` -- never by `@alp/qualification-pipeline`, preserving the locked
 * dependency direction (this package still declares, and imports, zero
 * `@alp/*` workspace dependency; see planner.test.ts's own architecture-
 * integrity check). The CALLER (an integration layer that already
 * legitimately depends on both packages) is responsible for translating a
 * real `KnowledgeCandidate` into the minimal `ApprovedKnowledgeTargetRef`
 * shape this module consumes.
 *
 * `KnowledgeTechnicalSemanticsProposal` is NOT evidence, NOT curriculum
 * authority, and cannot create a learner target or change its REQUIRED/
 * CONTEXTUAL/OUT_OF_SCOPE classification (task §8) -- it only structures
 * an EXISTING approved learner target for evidence planning.
 * `validateKnowledgeTechnicalSemanticsProposal` is the sole gate a
 * proposal must pass before `buildKnowledgeTargetFromSemantics` may turn
 * it into a real `KnowledgeTarget` the planner accepts.
 *
 * CC-23B §9: an LLM (or any other process) may PROPOSE structure; it must
 * never manufacture technical ANSWER content. Structurally enforced here:
 * the proposal/result shapes have no field capable of asserting a fact --
 * `technicalQuestionShape` exists ONLY to phrase a question, and this
 * module never reads it as, or compares it against, an established truth.
 */

import type { ApprovedKnowledgeTargetRef, KnowledgeTarget, KnowledgeTechnicalSemantics, KnowledgeTechnicalSemanticsProposal } from "./types.ts";

/** `classification` is deliberately NOT a field here -- it always comes from the already-validated `approvedTarget.classification` (task §11: a semantics proposal/result can never change scope/classification), never re-supplied at conversion time. */
export interface BuildKnowledgeTargetParams {
  readonly knowledgeTargetId: string;
  readonly targetText: string;
  readonly isRepresentativeExemplar?: boolean;
  readonly calibratedSupportingPerformance?: string;
  readonly requiresMultipleIndependentClaims?: boolean;
}

/**
 * CC-23B §11: a semantics proposal/result must target an EXISTING approved
 * learner target -- it can never create scope, change scope, change
 * performance depth, promote contextual material, or create a factual
 * claim. This validates a `KnowledgeTechnicalSemanticsProposal` against the
 * real `ApprovedKnowledgeTargetRef` it claims to annotate and returns the
 * governed `KnowledgeTechnicalSemantics` result -- `REJECTED` (never
 * thrown) for any structural violation, so a caller processing many
 * proposals can inspect every rejection without one bad proposal aborting
 * the batch.
 */
export function validateKnowledgeTechnicalSemanticsProposal(proposal: KnowledgeTechnicalSemanticsProposal, approvedTarget: ApprovedKnowledgeTargetRef | undefined): KnowledgeTechnicalSemantics {
  const rejected = (reason: string): KnowledgeTechnicalSemantics => ({
    targetCandidateKey: proposal.targetCandidateKey,
    semanticIdentity: null,
    evidencePlanningKind: proposal.evidencePlanningKind,
    specificationMode: proposal.specificationMode,
    coverageDimensions: [],
    constituentTargetRefs: [],
    foundationalProcedureRefs: [],
    technicalQuestionOverride: null,
    provenance: { proposalBasis: proposal.proposalBasis, validationStatus: "REJECTED", rejectionReason: reason },
  });

  // Task §11: must target an existing approved learner target.
  if (!approvedTarget) {
    return rejected(`No approved learner target found for targetCandidateKey "${proposal.targetCandidateKey}" -- a semantics proposal can never create a target of its own.`);
  }
  if (approvedTarget.targetCandidateKey !== proposal.targetCandidateKey) {
    return rejected(`Proposal targetCandidateKey "${proposal.targetCandidateKey}" does not match the resolved approved target "${approvedTarget.targetCandidateKey}" -- wrong-qualification/wrong-candidate mismatch.`);
  }
  // Task §11: an OUT_OF_SCOPE candidate can never be smuggled in as REQUIRED via this handoff.
  if (approvedTarget.classification === "OUT_OF_SCOPE") {
    return rejected(`Target "${proposal.targetCandidateKey}" is OUT_OF_SCOPE -- a semantics proposal cannot promote it into evidence planning (task §11: cannot create/change scope).`);
  }

  return {
    targetCandidateKey: proposal.targetCandidateKey,
    semanticIdentity: proposal.semanticIdentityProposal,
    evidencePlanningKind: proposal.evidencePlanningKind,
    specificationMode: proposal.specificationMode,
    coverageDimensions: proposal.coverageDimensionProposals,
    constituentTargetRefs: proposal.constituentTargetRefs,
    foundationalProcedureRefs: proposal.foundationalProcedureRefs,
    // CC-23B §9/§CQ: phrasing only -- never read as fact anywhere downstream.
    technicalQuestionOverride: proposal.technicalQuestionShape,
    provenance: { proposalBasis: proposal.proposalBasis, validationStatus: "VALID", rejectionReason: null },
  };
}

/**
 * Converts a VALIDATED (`provenance.validationStatus === "VALID"`) semantics
 * result, plus the caller-supplied approved target's own classification and
 * display text, into a real `KnowledgeTarget` the generic planner accepts.
 * Throws if `semantics` was rejected, or if its `semanticIdentity` is
 * `null` (an UNRESOLVED proposal never supplied one) -- a caller wanting an
 * explicit `UNRESOLVED` `KnowledgeTarget` must supply that governance state
 * on a real (non-null) identity itself, never omit the identity.
 */
export function buildKnowledgeTargetFromSemantics(semantics: KnowledgeTechnicalSemantics, approvedTarget: ApprovedKnowledgeTargetRef, params: BuildKnowledgeTargetParams): KnowledgeTarget {
  if (semantics.provenance.validationStatus !== "VALID") {
    throw new Error(`buildKnowledgeTargetFromSemantics: cannot build a KnowledgeTarget from a REJECTED semantics result (targetCandidateKey "${semantics.targetCandidateKey}"): ${semantics.provenance.rejectionReason}`);
  }
  if (!semantics.semanticIdentity) {
    throw new Error(`buildKnowledgeTargetFromSemantics: semantics result for "${semantics.targetCandidateKey}" carries no semanticIdentity -- supply one with governanceState "UNRESOLVED" rather than omitting it, so the planner can report an explicit gap.`);
  }

  const target: KnowledgeTarget = {
    knowledgeTargetId: params.knowledgeTargetId,
    targetText: params.targetText,
    kind: semantics.evidencePlanningKind,
    classification: approvedTarget.classification,
    semanticIdentity: semantics.semanticIdentity,
    specificationMode: semantics.specificationMode,
    ...(semantics.technicalQuestionOverride ? { evidenceQuestionOverride: semantics.technicalQuestionOverride } : {}),
    ...(semantics.coverageDimensions.length > 0 ? { expectedCoverageDimensions: semantics.coverageDimensions } : {}),
    ...(params.requiresMultipleIndependentClaims ? { requiresMultipleIndependentClaims: true } : {}),
    ...(semantics.constituentTargetRefs.length > 0 ? { constituentKnowledgeTargetIds: semantics.constituentTargetRefs } : {}),
    ...(semantics.foundationalProcedureRefs.length > 0 ? { reusesFoundationalProcedureIds: semantics.foundationalProcedureRefs } : {}),
    ...(params.isRepresentativeExemplar ? { isRepresentativeExemplar: true } : {}),
    ...(params.calibratedSupportingPerformance ? { calibratedSupportingPerformance: params.calibratedSupportingPerformance } : {}),
  };
  return target;
}
