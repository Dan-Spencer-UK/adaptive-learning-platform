/**
 * CC-23B §7-§11/§18/§24: proves the generic technical-semantic handoff
 * contract -- proposal validation, governed conversion into a real
 * `KnowledgeTarget`, and the §CQ/§CR regressions -- plus §18's fully
 * synthetic, no-history new-module end-to-end preflight fixture.
 *
 * No fixture in this file references Unit 202, historical source dossiers,
 * or any real qualification.
 */
import { describe, expect, it } from "vitest";
import { DEFAULT_SOURCE_AUTHORITY_POLICY, planEvidenceRequirements } from "./planner.ts";
import { buildKnowledgeTargetFromSemantics, validateKnowledgeTechnicalSemanticsProposal } from "./semantic-handoff.ts";
import type { ApprovedKnowledgeTargetRef, KnowledgeEvidencePlanningInput, KnowledgeTarget, KnowledgeTechnicalSemanticsProposal } from "./types.ts";

function proposal(overrides: Partial<KnowledgeTechnicalSemanticsProposal> & Pick<KnowledgeTechnicalSemanticsProposal, "targetCandidateKey">): KnowledgeTechnicalSemanticsProposal {
  return {
    semanticIdentityProposal: null,
    evidencePlanningKind: "FACTUAL_PROPOSITION",
    specificationMode: "OPEN_TECHNICAL_QUESTION",
    coverageDimensionProposals: [],
    constituentTargetRefs: [],
    foundationalProcedureRefs: [],
    technicalQuestionShape: null,
    proposalBasis: "LLM_STRUCTURAL_INFERENCE",
    ...overrides,
  };
}

function approved(overrides: Partial<ApprovedKnowledgeTargetRef> & Pick<ApprovedKnowledgeTargetRef, "targetCandidateKey">): ApprovedKnowledgeTargetRef {
  return { qualificationContextId: "synthetic-handoff", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", ...overrides };
}

describe("CC-23B §11 -- proposal validation targets an existing approved learner target only", () => {
  it("a well-formed proposal against a real approved target validates", () => {
    const target = approved({ targetCandidateKey: "cand-1" });
    const p = proposal({ targetCandidateKey: "cand-1", semanticIdentityProposal: { semanticNamespace: "ns", semanticKey: "key", governanceState: "PROVISIONAL_NON_REUSABLE" } });
    const result = validateKnowledgeTechnicalSemanticsProposal(p, target);
    expect(result.provenance.validationStatus).toBe("VALID");
    expect(result.provenance.rejectionReason).toBeNull();
  });

  it("a proposal targeting a nonexistent candidate is REJECTED, not thrown", () => {
    const p = proposal({ targetCandidateKey: "does-not-exist" });
    const result = validateKnowledgeTechnicalSemanticsProposal(p, undefined);
    expect(result.provenance.validationStatus).toBe("REJECTED");
    expect(result.provenance.rejectionReason).toMatch(/no approved learner target/i);
  });

  it("a proposal whose targetCandidateKey mismatches the resolved approved target is REJECTED", () => {
    const target = approved({ targetCandidateKey: "cand-real" });
    const p = proposal({ targetCandidateKey: "cand-spoofed" });
    const result = validateKnowledgeTechnicalSemanticsProposal(p, target);
    expect(result.provenance.validationStatus).toBe("REJECTED");
  });

  it("a proposal against an OUT_OF_SCOPE candidate is REJECTED -- cannot promote scope", () => {
    const target = approved({ targetCandidateKey: "cand-oos", classification: "OUT_OF_SCOPE" });
    const p = proposal({ targetCandidateKey: "cand-oos" });
    const result = validateKnowledgeTechnicalSemanticsProposal(p, target);
    expect(result.provenance.validationStatus).toBe("REJECTED");
    expect(result.provenance.rejectionReason).toMatch(/OUT_OF_SCOPE/);
  });
});

describe("CC-23B §9/§17 -- CQ: an LLM proposal cannot manufacture technical answer content", () => {
  it("§CQ: technicalQuestionShape containing answer-shaped text never becomes a claim, never satisfies acceptance, and never changes specificationMode -- it is mechanically inert as truth", () => {
    const target = approved({ targetCandidateKey: "cand-diac" });
    // An LLM proposal that tries to smuggle a technical ANSWER through the only free-text field available to it.
    const p = proposal({
      targetCandidateKey: "cand-diac",
      semanticIdentityProposal: { semanticNamespace: "electronic-devices", semanticKey: "diac-triggering", governanceState: "PROVISIONAL_NON_REUSABLE" },
      specificationMode: "OPEN_TECHNICAL_QUESTION",
      technicalQuestionShape: "The DIAC triggers the TRIAC via breakover conduction at a fixed voltage threshold.", // answer-shaped, not a question
    });
    const semantics = validateKnowledgeTechnicalSemanticsProposal(p, target);
    expect(semantics.provenance.validationStatus).toBe("VALID"); // structurally valid -- the shape is still just phrasing
    const knowledgeTarget = buildKnowledgeTargetFromSemantics(semantics, target, { knowledgeTargetId: "synthetic-cq::T1", targetText: "DIAC triggering behaviour." });
    const result = planEvidenceRequirements(planningInput("synthetic-cq", [knowledgeTarget]));
    const r = result.requirements[0]!;
    // The "answer" is used ONLY as question phrasing -- it never becomes requirementText, never sets specificationMode to KNOWN, and acceptanceCriteria still demands independent source verification.
    expect(r.specificationMode).toBe("OPEN_TECHNICAL_QUESTION");
    expect(r.requirementText).toBe("DIAC triggering behaviour.");
    expect(r.acceptanceCriteria).toMatch(/authoritative source/i);
    expect(r.evidenceQuestion).toContain("breakover conduction"); // present only as PHRASING of the question
    // Nothing in the architecture treats this as an accepted technical fact: no field records it as a verified claim.
    expect(Object.keys(r)).not.toContain("verifiedClaim");
  });
});

describe("CC-23B §6/§17 -- CR: canonical identity can be proposed independently of technical answer", () => {
  it("§CR: a semantic identity proposal carries no technical-answer field, and an OPEN_TECHNICAL_QUESTION target built from it has no answer content", () => {
    const target = approved({ targetCandidateKey: "cand-flh" });
    const p = proposal({
      targetCandidateKey: "cand-flh",
      semanticIdentityProposal: { semanticNamespace: "electromagnetic-rules", semanticKey: "fleming-left-hand-rule", governanceState: "PROVISIONAL_NON_REUSABLE" },
      evidencePlanningKind: "OPERATIONAL_USE_RULE",
      specificationMode: "OPEN_TECHNICAL_QUESTION",
      coverageDimensionProposals: ["DIRECTIONAL_MAPPING", "ROLE_MAPPING"],
    });
    const semantics = validateKnowledgeTechnicalSemanticsProposal(p, target);
    expect(semantics.provenance.validationStatus).toBe("VALID");
    expect(semantics.semanticIdentity).toEqual({ semanticNamespace: "electromagnetic-rules", semanticKey: "fleming-left-hand-rule", governanceState: "PROVISIONAL_NON_REUSABLE" });
    const knowledgeTarget = buildKnowledgeTargetFromSemantics(semantics, target, { knowledgeTargetId: "synthetic-cr::T1", targetText: "Fleming's left-hand rule." });
    expect(knowledgeTarget.semanticIdentity.semanticKey).toBe("fleming-left-hand-rule");
    // The identity names WHAT the rule is; nothing about finger/current/field/force mapping appears anywhere on the target.
    for (const forbidden of ["thumb", "finger", "first finger", "second finger"]) {
      expect(knowledgeTarget.targetText.toLowerCase()).not.toContain(forbidden);
    }
    expect(knowledgeTarget.directionalMapping).toBeUndefined();
  });
});

function planningInput(qualificationContextId: string, knowledgeTargets: readonly KnowledgeTarget[]): KnowledgeEvidencePlanningInput {
  return { qualificationContext: { qualificationContextId, description: `synthetic handoff fixture: ${qualificationContextId}` }, knowledgeTargets, sourceAuthorityPolicy: DEFAULT_SOURCE_AUTHORITY_POLICY };
}

describe("CC-23B §18 -- fully synthetic, no-history new-module end-to-end preflight", () => {
  // A fictional new qualification module. No Unit-202 data, no historical
  // source dossier, no technical answer beyond what its fictional public
  // curriculum text (below) explicitly states.
  const approvedTargets: readonly ApprovedKnowledgeTargetRef[] = [
    approved({ targetCandidateKey: "synthetic-module::boyles-law", qualificationContextId: "synthetic-module-x" }),
    approved({ targetCandidateKey: "synthetic-module::valve-operating-principle", qualificationContextId: "synthetic-module-x" }),
    approved({ targetCandidateKey: "synthetic-module::provisional-local-rule", qualificationContextId: "synthetic-module-x" }),
  ];

  // Structural proposals -- an LLM (or a human) proposing STRUCTURE only,
  // never a technical answer beyond what the fictional curriculum states.
  const proposals: readonly KnowledgeTechnicalSemanticsProposal[] = [
    // 1. The fictional curriculum EXPLICITLY states "P1V1 = P2V2 (Boyle's law)" -- a known claim.
    proposal({
      targetCandidateKey: "synthetic-module::boyles-law",
      semanticIdentityProposal: { semanticNamespace: "gas-laws", semanticKey: "boyles-law", governanceState: "CANONICAL" },
      evidencePlanningKind: "FORMULA_OR_RULE",
      specificationMode: "KNOWN_CLAIM_TO_VERIFY",
      proposalBasis: "EXPLICIT_QUALIFICATION_WORDING",
    }),
    // 2. The fictional curriculum says only "explain the operating principle of a pressure relief valve" -- no mechanism given.
    proposal({
      targetCandidateKey: "synthetic-module::valve-operating-principle",
      semanticIdentityProposal: { semanticNamespace: "fluid-systems", semanticKey: "pressure-relief-valve-operating-principle", governanceState: "PROVISIONAL_NON_REUSABLE" },
      evidencePlanningKind: "OPERATING_PRINCIPLE",
      specificationMode: "OPEN_TECHNICAL_QUESTION",
      proposalBasis: "LLM_STRUCTURAL_INFERENCE",
    }),
    // 3. A locally-scoped rule this new module needs, not yet safe to declare reusable across other qualifications.
    proposal({
      targetCandidateKey: "synthetic-module::provisional-local-rule",
      semanticIdentityProposal: { semanticNamespace: "fluid-systems", semanticKey: "module-specific-tagging-rule", governanceState: "PROVISIONAL_NON_REUSABLE" },
      evidencePlanningKind: "OPERATIONAL_USE_RULE",
      specificationMode: "OPEN_TECHNICAL_QUESTION",
      proposalBasis: "ADAPTER_ASSIGNED",
    }),
  ];

  it("every proposal validates against its real approved target", () => {
    for (const p of proposals) {
      const target = approvedTargets.find((t) => t.targetCandidateKey === p.targetCandidateKey);
      const semantics = validateKnowledgeTechnicalSemanticsProposal(p, target);
      expect(semantics.provenance.validationStatus, `expected VALID for "${p.targetCandidateKey}"`).toBe("VALID");
    }
  });

  const knowledgeTargets: KnowledgeTarget[] = proposals.map((p) => {
    const target = approvedTargets.find((t) => t.targetCandidateKey === p.targetCandidateKey)!;
    const semantics = validateKnowledgeTechnicalSemanticsProposal(p, target);
    const textByKey: Record<string, string> = {
      "synthetic-module::boyles-law": "P1V1 = P2V2 (Boyle's law).",
      "synthetic-module::valve-operating-principle": "Operating principle of a pressure relief valve.",
      "synthetic-module::provisional-local-rule": "Module-specific component-tagging rule.",
    };
    return buildKnowledgeTargetFromSemantics(semantics, target, { knowledgeTargetId: p.targetCandidateKey, targetText: textByKey[p.targetCandidateKey]! });
  });

  const planResult = planEvidenceRequirements(planningInput("synthetic-module-x", knowledgeTargets));

  it("the known claim (Boyle's law) becomes KNOWN_CLAIM_TO_VERIFY", () => {
    const r = planResult.requirements.find((x) => x.sourceKnowledgeTargetIds.includes("synthetic-module::boyles-law"))!;
    expect(r.specificationMode).toBe("KNOWN_CLAIM_TO_VERIFY");
    expect(r.evidenceQuestion).toBeNull();
    expect(r.decompositionStatus).toBe("READY");
  });

  it("the required-but-technically-unspecified operating principle becomes OPEN_TECHNICAL_QUESTION with no invented answer", () => {
    const r = planResult.requirements.find((x) => x.sourceKnowledgeTargetIds.includes("synthetic-module::valve-operating-principle"))!;
    expect(r.specificationMode).toBe("OPEN_TECHNICAL_QUESTION");
    expect(r.decompositionStatus).toBe("READY");
    expect(r.evidenceQuestion).not.toBeNull();
    expect(r.requirementText).toBe("Operating principle of a pressure relief valve.");
    // No mechanism/answer content anywhere -- the curriculum never supplied one.
    expect(r.requirementText.toLowerCase()).not.toMatch(/spring|diaphragm|calibrated/);
  });

  it("the provisional semantic identity remains non-reusable -- it never merges with an identically-keyed identity from a different synthetic qualification", () => {
    const provisionalReq = planResult.requirements.find((x) => x.sourceKnowledgeTargetIds.includes("synthetic-module::provisional-local-rule"))!;
    // A different synthetic qualification independently using the SAME namespace/key, also provisional.
    const otherTarget: KnowledgeTarget = {
      knowledgeTargetId: "synthetic-module-y::same-key",
      targetText: "An unrelated module's own tagging rule.",
      kind: "OPERATIONAL_USE_RULE",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      semanticIdentity: { semanticNamespace: "fluid-systems", semanticKey: "module-specific-tagging-rule", governanceState: "PROVISIONAL_NON_REUSABLE" },
      specificationMode: "OPEN_TECHNICAL_QUESTION",
    };
    const otherResult = planEvidenceRequirements(planningInput("synthetic-module-y", [otherTarget]), planResult.requirements);
    const bothRows = otherResult.requirements.filter((r) => r.sourceKnowledgeTargetIds.includes("synthetic-module::provisional-local-rule") || r.sourceKnowledgeTargetIds.includes("synthetic-module-y::same-key"));
    expect(bothRows).toHaveLength(2); // never merged
    expect(provisionalReq.canonicalRequirementKey).not.toBe(bothRows.find((r) => r.sourceKnowledgeTargetIds.includes("synthetic-module-y::same-key"))!.canonicalRequirementKey);
  });

  it("no technical answer was invented anywhere in this fixture -- every requirementText matches the fictional curriculum's own stated wording exactly", () => {
    const expectedTexts = new Set(["P1V1 = P2V2 (Boyle's law).", "Operating principle of a pressure relief valve.", "Module-specific component-tagging rule."]);
    for (const r of planResult.requirements) {
      expect(expectedTexts.has(r.requirementText), `unexpected requirementText: "${r.requirementText}"`).toBe(true);
    }
  });

  it("this fixture references no Unit-202/historical-dossier concept anywhere", () => {
    const serialized = JSON.stringify({ proposals, knowledgeTargets, planResult });
    expect(serialized.toLowerCase()).not.toContain("unit202");
    expect(serialized.toLowerCase()).not.toContain("dossier");
  });
});
