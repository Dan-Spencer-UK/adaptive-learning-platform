/**
 * CC-23 §16 / CC-23A §5/§24: generic synthetic-domain regression fixtures
 * A-H (CC-23) plus CA-CJ (CC-23A semantic-identity/authority-extensibility
 * hardening), plus architecture-integrity checks mirroring
 * `@alp/qualification-pipeline/src/rules.test.ts`'s own pattern.
 *
 * No fixture in this file may reference Unit 202, 2365, ammeter,
 * voltmeter, TRIAC, AC/DC, or any electrical-specific AC numbering
 * (task §16) -- mechanically enforced below.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_SOURCE_AUTHORITY_POLICY, canonicalRequirementKey, planEvidenceRequirements, validateSourceAuthorityPolicy } from "./planner.ts";
import type { KnowledgeEvidencePlanningInput, KnowledgeTarget, TechnicalSemanticIdentity } from "./types.ts";

function defaultIdentityFor(knowledgeTargetId: string, targetText: string): TechnicalSemanticIdentity {
  const namespace = knowledgeTargetId.includes("::") ? knowledgeTargetId.split("::")[0]! : "default";
  const key = targetText
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return { semanticNamespace: namespace, semanticKey: key, governanceState: "CANONICAL" };
}

/** Test default: specificationMode KNOWN_CLAIM_TO_VERIFY unless a fixture explicitly overrides it (most §16.A-H fixtures predate CC-23B and are not testing this dimension). */
function target(overrides: Partial<KnowledgeTarget> & Pick<KnowledgeTarget, "knowledgeTargetId" | "targetText" | "kind" | "classification">): KnowledgeTarget {
  return { semanticIdentity: defaultIdentityFor(overrides.knowledgeTargetId, overrides.targetText), specificationMode: "KNOWN_CLAIM_TO_VERIFY", ...overrides };
}

function input(qualificationContextId: string, knowledgeTargets: readonly KnowledgeTarget[]): KnowledgeEvidencePlanningInput {
  return {
    qualificationContext: { qualificationContextId, description: `synthetic domain fixture: ${qualificationContextId}` },
    knowledgeTargets,
    sourceAuthorityPolicy: DEFAULT_SOURCE_AUTHORITY_POLICY,
  };
}

describe("CC-23 §16.A -- mathematics procedure", () => {
  it("a multi-step procedure target becomes PROCEDURE_COVERAGE, never a fake exact fact", () => {
    const t = target({ knowledgeTargetId: "synthetic-a::T1", targetText: "Solving a quadratic equation by completing the square.", kind: "PROCEDURE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const result = planEvidenceRequirements(input("synthetic-a", [t]));
    expect(result.requirements).toHaveLength(1);
    const r = result.requirements[0]!;
    expect(r.requirementMode).toBe("PROCEDURE_COVERAGE");
    expect(r.decompositionStatus).toBe("READY");
    expect(r.requiredCoverageDimensions).toContain("PROCEDURE");
    expect(r.sourceKnowledgeTargetIds).toEqual(["synthetic-a::T1"]);
  });
});

describe("CC-23 §16.B -- mechanical/scientific compound concept", () => {
  it("a compound definition+symbol+unit target decomposes into independent coverage-dimension requirements", () => {
    const t = target({
      knowledgeTargetId: "synthetic-b::T1",
      targetText: "Torque: the turning moment produced by a force about a pivot.",
      kind: "CONCEPT_DEFINITION",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      expectedCoverageDimensions: ["DEFINITION", "QUANTITY_SYMBOL", "UNIT_SYMBOL", "DISTINCTION"],
    });
    const result = planEvidenceRequirements(input("synthetic-b", [t]));
    expect(result.requirements).toHaveLength(4);
    const dims = result.requirements.map((r) => r.requiredCoverageDimensions[0]).sort();
    expect(dims).toEqual(["DEFINITION", "DISTINCTION", "QUANTITY_SYMBOL", "UNIT_SYMBOL"]);
    for (const r of result.requirements) {
      expect(r.decompositionStatus).toBe("READY");
      expect(r.sourceKnowledgeTargetIds).toEqual(["synthetic-b::T1"]);
    }
    // Independently addressable canonical keys -- not one bundled requirement.
    expect(new Set(result.requirements.map((r) => r.canonicalRequirementKey)).size).toBe(4);
  });
});

describe("CC-23 §16.C -- non-electrical operating principle", () => {
  it("a device/process operating-principle target requires OPERATING_PRINCIPLE evidence", () => {
    const t = target({ knowledgeTargetId: "synthetic-c::T1", targetText: "Operating principle of a bimetallic-strip thermostat.", kind: "OPERATING_PRINCIPLE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const result = planEvidenceRequirements(input("synthetic-c", [t]));
    expect(result.requirements).toHaveLength(1);
    expect(result.requirements[0]!.requirementMode).toBe("OPERATING_PRINCIPLE");
    expect(result.requirements[0]!.decompositionStatus).toBe("READY");
  });
});

describe("CC-23 §16.D -- broad topic target", () => {
  it("a broad topic becomes TOPIC_BREADTH_COVERAGE with substantive breadth dimensions, never a fake exact fact", () => {
    const t = target({ knowledgeTargetId: "synthetic-d::T1", targetText: "Trigonometric identities.", kind: "BREADTH_TOPIC_COVERAGE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const result = planEvidenceRequirements(input("synthetic-d", [t]));
    expect(result.requirements).toHaveLength(1);
    const r = result.requirements[0]!;
    expect(r.requirementMode).toBe("TOPIC_BREADTH_COVERAGE");
    expect(r.requirementMode).not.toBe("EXACT_FACT");
    expect(r.requiredCoverageDimensions.length).toBeGreaterThan(0);
    expect(r.acceptanceCriteria).toMatch(/substantive/i);
  });
});

describe("CC-23 §16.E -- integration target", () => {
  it("a relationship jointly established by already-sourceable constituents is satisfied by them, not a manufactured combined source", () => {
    const stress = target({ knowledgeTargetId: "synthetic-e::stress", targetText: "Stress: force per unit area.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const strain = target({ knowledgeTargetId: "synthetic-e::strain", targetText: "Strain: extension per unit length.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const modulus = target({ knowledgeTargetId: "synthetic-e::modulus", targetText: "Young's modulus: the ratio of stress to strain within the elastic limit.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const integration = target({
      knowledgeTargetId: "synthetic-e::integration",
      targetText: "Relationship between stress, strain and Young's modulus.",
      kind: "RELATIONSHIP",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      requiresMultipleIndependentClaims: true,
      constituentKnowledgeTargetIds: ["synthetic-e::stress", "synthetic-e::strain", "synthetic-e::modulus"],
    });
    const result = planEvidenceRequirements(input("synthetic-e", [stress, strain, modulus, integration]));
    expect(result.requirements).toHaveLength(3); // one per constituent, none for the integration target itself
    expect(result.requirements.some((r) => r.sourceKnowledgeTargetIds.includes("synthetic-e::integration"))).toBe(false);
    const satisfaction = result.structuralSatisfactions.find((s) => s.knowledgeTargetId === "synthetic-e::integration");
    expect(satisfaction?.kind).toBe("INTEGRATION_SATISFIED_BY_CONSTITUENTS");
    expect(satisfaction?.satisfiedByKnowledgeTargetIds).toEqual(["synthetic-e::stress", "synthetic-e::strain", "synthetic-e::modulus"]);
  });
});

describe("CC-23 §16.F / CC-23A §CD/§CE -- cross-qualification and within-qualification canonical reuse via semantic identity", () => {
  it("the same semantic identity required by two different synthetic qualifications collapses into one reused evidence requirement, even with different wording", () => {
    const sharedIdentity: TechnicalSemanticIdentity = { semanticNamespace: "classical-mechanics", semanticKey: "newtons-second-law", governanceState: "CANONICAL" };
    const q1Target = target({ knowledgeTargetId: "synthetic-f1::T1", targetText: "Newton's second law: force equals mass times acceleration.", kind: "FORMULA_OR_RULE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: sharedIdentity });
    const q2Target = target({ knowledgeTargetId: "synthetic-f2::T1", targetText: "F = ma (Newton's second law of motion).", kind: "FORMULA_OR_RULE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: sharedIdentity });

    const firstResult = planEvidenceRequirements(input("synthetic-f1", [q1Target]));
    expect(firstResult.requirements).toHaveLength(1);

    const secondResult = planEvidenceRequirements(input("synthetic-f2", [q2Target]), firstResult.requirements);
    expect(secondResult.requirements).toHaveLength(1); // reused, not duplicated, despite different wording
    const reused = secondResult.requirements[0]!;
    expect([...reused.sourceKnowledgeTargetIds].sort()).toEqual(["synthetic-f1::T1", "synthetic-f2::T1"]);
    expect(reused.canonicalRequirementKey).toBe(canonicalRequirementKey(sharedIdentity, "FORMULA_OR_RULE", "synthetic-f2"));
    expect(reused.deduplicationBasis).toMatch(/reused across 2 knowledge targets/);
  });

  it("§CE: two learner targets within the SAME qualification sharing a semantic identity also reuse", () => {
    const sharedIdentity: TechnicalSemanticIdentity = { semanticNamespace: "classical-mechanics", semanticKey: "gravitational-weight-relation", governanceState: "CANONICAL" };
    const t1 = target({ knowledgeTargetId: "synthetic-ce::T1", targetText: "Weight equals mass times gravitational field strength.", kind: "FORMULA_OR_RULE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: sharedIdentity });
    const t2 = target({ knowledgeTargetId: "synthetic-ce::T2", targetText: "W = mg.", kind: "FORMULA_OR_RULE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: sharedIdentity });
    const result = planEvidenceRequirements(input("synthetic-ce", [t1, t2]));
    expect(result.requirements).toHaveLength(1);
    expect([...result.requirements[0]!.sourceKnowledgeTargetIds].sort()).toEqual(["synthetic-ce::T1", "synthetic-ce::T2"]);
  });
});

describe("CC-23A §5 -- CA-CD: semantic-identity-driven canonical reuse (homonym safety)", () => {
  it("§CA: two qualifications require the same semantic law with different wording -> one reusable requirement when semantic identity is equal", () => {
    const identity: TechnicalSemanticIdentity = { semanticNamespace: "thermodynamics", semanticKey: "ideal-gas-law", governanceState: "CANONICAL" };
    const a = target({ knowledgeTargetId: "synthetic-ca-q1::T1", targetText: "The ideal gas law relates pressure, volume, amount and temperature.", kind: "FORMULA_OR_RULE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: identity });
    const b = target({ knowledgeTargetId: "synthetic-ca-q2::T1", targetText: "PV = nRT.", kind: "FORMULA_OR_RULE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: identity });
    const first = planEvidenceRequirements(input("synthetic-ca-q1", [a]));
    const second = planEvidenceRequirements(input("synthetic-ca-q2", [b]), first.requirements);
    expect(second.requirements).toHaveLength(1);
  });

  it("§CB: identical text 'Range.' under different semantic namespaces (statistics vs. measurement) -> two distinct canonical requirements", () => {
    const statsRange = target({
      knowledgeTargetId: "synthetic-cb::stats",
      targetText: "Range.",
      kind: "FACTUAL_PROPOSITION",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      semanticIdentity: { semanticNamespace: "statistics", semanticKey: "range", governanceState: "CANONICAL" },
    });
    const instrumentRange = target({
      knowledgeTargetId: "synthetic-cb::measurement",
      targetText: "Range.",
      kind: "FACTUAL_PROPOSITION",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      semanticIdentity: { semanticNamespace: "measurement", semanticKey: "instrument-range", governanceState: "CANONICAL" },
    });
    const result = planEvidenceRequirements(input("synthetic-cb", [statsRange, instrumentRange]));
    expect(result.requirements).toHaveLength(2);
    expect(result.requirements[0]!.canonicalRequirementKey).not.toBe(result.requirements[1]!.canonicalRequirementKey);
  });

  it("§CC: same semantic identity but incompatible requirement modes -> never silently collapsed", () => {
    const identity: TechnicalSemanticIdentity = { semanticNamespace: "materials-science", semanticKey: "yield-point", governanceState: "CANONICAL" };
    const definition = target({ knowledgeTargetId: "synthetic-cc::def", targetText: "Yield point: the stress at which a material begins to deform plastically.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: identity });
    const procedure = target({ knowledgeTargetId: "synthetic-cc::proc", targetText: "Determining the yield point from a stress-strain curve.", kind: "PROCEDURE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: identity });
    const result = planEvidenceRequirements(input("synthetic-cc", [definition, procedure]));
    expect(result.requirements).toHaveLength(2); // EXACT_FACT and PROCEDURE_COVERAGE never collapse despite equal semantic identity
    expect(result.requirements.map((r) => r.requirementMode).sort()).toEqual(["EXACT_FACT", "PROCEDURE_COVERAGE"]);
  });

  it("§CD: qualification ID differs but semantic identity matches -> reuse still occurs", () => {
    const identity: TechnicalSemanticIdentity = { semanticNamespace: "electromagnetism", semanticKey: "magnetic-flux-density-relation", governanceState: "CANONICAL" };
    const a = target({ knowledgeTargetId: "synthetic-cd-alpha::T1", targetText: "Magnetic flux density equals flux divided by area.", kind: "FORMULA_OR_RULE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: identity });
    const b = target({ knowledgeTargetId: "synthetic-cd-beta::T1", targetText: "B = Phi / A.", kind: "FORMULA_OR_RULE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: identity });
    const first = planEvidenceRequirements(input("synthetic-cd-alpha", [a]));
    const second = planEvidenceRequirements(input("synthetic-cd-beta", [b]), first.requirements);
    expect(second.requirements).toHaveLength(1);
    expect([...second.requirements[0]!.sourceKnowledgeTargetIds].sort()).toEqual(["synthetic-cd-alpha::T1", "synthetic-cd-beta::T1"]);
  });
});

describe("CC-23A §11-§15/§24 -- CF/CG: generic formula + rearrangement rule", () => {
  it("§CF: a formula target reusing a foundational procedure emits ONE technical formula requirement, never a duplicated technical source for ordinary algebra", () => {
    const foundationalProcedure = target({ knowledgeTargetId: "synthetic-cf::transposition", targetText: "Formula transposition: rearranging an equation to isolate an unknown.", kind: "PROCEDURE", classification: "FOUNDATIONAL_PREREQUISITE" });
    const formula = target({
      knowledgeTargetId: "synthetic-cf::formula",
      targetText: "V = IR and rearrangements.",
      kind: "FORMULA_OR_RULE",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      requiresMultipleIndependentClaims: true,
      reusesFoundationalProcedureIds: ["synthetic-cf::transposition"],
    });
    const result = planEvidenceRequirements(input("synthetic-cf", [foundationalProcedure, formula]));
    // Exactly two requirements: the foundational procedure itself, and the formula -- never a third "rearrangement" source.
    expect(result.requirements).toHaveLength(2);
    const formulaReq = result.requirements.find((r) => r.sourceKnowledgeTargetIds.includes("synthetic-cf::formula"));
    expect(formulaReq?.requirementMode).toBe("FORMULA_OR_RULE");
    expect(formulaReq?.decompositionStatus).toBe("READY");
    const satisfaction = result.structuralSatisfactions.find((s) => s.knowledgeTargetId === "synthetic-cf::formula");
    expect(satisfaction?.kind).toBe("REARRANGEMENT_SATISFIED_BY_FOUNDATIONAL_PROCEDURE");
    expect(satisfaction?.satisfiedByKnowledgeTargetIds).toEqual(["synthetic-cf::transposition"]);
  });

  it("§CG: the same generic formula+rearrangement rule works in a non-electrical synthetic domain (fluid dynamics)", () => {
    const foundationalProcedure = target({ knowledgeTargetId: "synthetic-cg::algebra", targetText: "Rearranging and evaluating a formula for an unknown quantity.", kind: "PROCEDURE", classification: "FOUNDATIONAL_PREREQUISITE" });
    const formula = target({
      knowledgeTargetId: "synthetic-cg::bernoulli",
      targetText: "Bernoulli's principle relates pressure, velocity and height along a streamline, and rearrangements thereof.",
      kind: "RELATIONSHIP",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      requiresMultipleIndependentClaims: true,
      reusesFoundationalProcedureIds: ["synthetic-cg::algebra"],
    });
    const result = planEvidenceRequirements(input("synthetic-cg", [foundationalProcedure, formula]));
    expect(result.requirements).toHaveLength(2);
    const formulaReq = result.requirements.find((r) => r.sourceKnowledgeTargetIds.includes("synthetic-cg::bernoulli"));
    expect(formulaReq?.requirementMode).toBe("RELATIONSHIP");
    expect(formulaReq?.decompositionStatus).toBe("READY");
  });

  it("a multi-claim formula target with NEITHER constituents NOR a foundational-procedure reuse abstains", () => {
    const formula = target({
      knowledgeTargetId: "synthetic-under::formula",
      targetText: "Some formula and its rearrangement.",
      kind: "FORMULA_OR_RULE",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      requiresMultipleIndependentClaims: true,
    });
    const result = planEvidenceRequirements(input("synthetic-under", [formula]));
    expect(result.requirements).toHaveLength(1);
    expect(result.requirements[0]!.decompositionStatus).toBe("SEMANTIC_DECOMPOSITION_REQUIRED");
  });
});

describe("CC-23A §17-§19/§24 -- CH: directional mapping is domain-agnostic structured metadata", () => {
  it("§CH: a directional/operational rule can be represented in a non-electrical domain (compass bearing) using the same generic field electrical hand-rules use", () => {
    const t = target({
      knowledgeTargetId: "synthetic-ch::bearing-rule",
      targetText: "Back-bearing rule: the back bearing is the forward bearing plus or minus 180 degrees.",
      kind: "OPERATIONAL_USE_RULE",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      // [Correction]: OPERATIONAL_USE_RULE has no safe default dimension (a
      // non-safety directional rule like this one is not a SAFE_USE
      // requirement) -- the coverage dimension must be declared explicitly.
      expectedCoverageDimensions: ["DIRECTIONAL_MAPPING", "ROLE_MAPPING"],
      directionalMapping: [
        { role: "forward-bearing", meaning: "the measured compass bearing in the direction of travel" },
        { role: "back-bearing", meaning: "forward bearing plus 180 degrees if less than 180, otherwise minus 180 degrees" },
      ],
    });
    const result = planEvidenceRequirements(input("synthetic-ch", [t]));
    expect(result.requirements).toHaveLength(1);
    expect(result.requirements[0]!.requirementMode).toBe("OPERATIONAL_USE_RULE");
    expect(result.requirements[0]!.decompositionStatus).toBe("READY");
    // The field itself is generic (role/meaning), never named after a specific domain's own vocabulary (hand/finger/current).
    expect(t.directionalMapping!.every((d) => typeof d.role === "string" && typeof d.meaning === "string")).toBe(true);
  });
});

describe("[Correction] dimension-inference correctness -- qualification-agnostic", () => {
  it("a SYMBOL_OR_CONVENTION target with no explicit coverage dimension abstains rather than guessing QUANTITY_SYMBOL", () => {
    const t = target({
      knowledgeTargetId: "synthetic-symdim::compass-rose",
      targetText: "Compass-rose cardinal/intercardinal point convention.",
      kind: "SYMBOL_OR_CONVENTION",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    });
    const result = planEvidenceRequirements(input("synthetic-symdim", [t]));
    const r = result.requirements[0]!;
    expect(r.decompositionStatus).toBe("SEMANTIC_DECOMPOSITION_REQUIRED");
    expect(r.decompositionReason).toMatch(/explicit expectedCoverageDimensions/i);
    expect(r.requiredCoverageDimensions).toEqual([]);
  });

  it("a SYMBOL_OR_CONVENTION target with an explicit SCHEMATIC_SYMBOL dimension is READY and never coerced to QUANTITY_SYMBOL", () => {
    const t = target({
      knowledgeTargetId: "synthetic-symdim::map-symbol",
      targetText: "Standard topographic map symbol for a road bridge.",
      kind: "SYMBOL_OR_CONVENTION",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      expectedCoverageDimensions: ["SCHEMATIC_SYMBOL"],
    });
    const result = planEvidenceRequirements(input("synthetic-symdim", [t]));
    const r = result.requirements[0]!;
    expect(r.decompositionStatus).toBe("READY");
    expect(r.requiredCoverageDimensions).toEqual(["SCHEMATIC_SYMBOL"]);
  });

  it("an OPERATIONAL_USE_RULE target with no explicit coverage dimension abstains rather than guessing SAFE_USE", () => {
    const t = target({
      knowledgeTargetId: "synthetic-opdim::right-of-way",
      targetText: "Give-way rule at an unmarked road junction.",
      kind: "OPERATIONAL_USE_RULE",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    });
    const result = planEvidenceRequirements(input("synthetic-opdim", [t]));
    const r = result.requirements[0]!;
    expect(r.decompositionStatus).toBe("SEMANTIC_DECOMPOSITION_REQUIRED");
    expect(r.requiredCoverageDimensions).toEqual([]);
  });

  it("a PROCEDURE target defaults to PROCEDURE only -- CALCULATION_METHOD is never assumed for a non-calculation procedure", () => {
    const t = target({
      knowledgeTargetId: "synthetic-procdim::evacuation",
      targetText: "Fire-evacuation assembly-point procedure.",
      kind: "PROCEDURE",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    });
    const result = planEvidenceRequirements(input("synthetic-procdim", [t]));
    const r = result.requirements[0]!;
    expect(r.decompositionStatus).toBe("READY");
    expect(r.requiredCoverageDimensions).toEqual(["PROCEDURE"]);
    expect(r.requiredCoverageDimensions).not.toContain("CALCULATION_METHOD");
  });

  it("a PROCEDURE target may still explicitly declare CALCULATION_METHOD when it genuinely computes a numeric result", () => {
    const t = target({
      knowledgeTargetId: "synthetic-procdim::dosage",
      targetText: "Calculating a medication dose from body mass and concentration.",
      kind: "PROCEDURE",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      expectedCoverageDimensions: ["PROCEDURE", "CALCULATION_METHOD"],
    });
    const result = planEvidenceRequirements(input("synthetic-procdim", [t]));
    expect(result.requirements[0]!.requiredCoverageDimensions).toEqual(["PROCEDURE", "CALCULATION_METHOD"]);
  });

  it("a compound PROCEDURE target built from already-sourceable constituents is satisfied structurally, never demanding one omnibus source", () => {
    const stepA = target({ knowledgeTargetId: "synthetic-procint::stepA", targetText: "Converting a peak value to an RMS value.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const stepB = target({ knowledgeTargetId: "synthetic-procint::stepB", targetText: "Converting an RMS value to a peak value.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const compoundProcedure = target({
      knowledgeTargetId: "synthetic-procint::conversions",
      targetText: "Appropriate waveform-value conversions.",
      kind: "PROCEDURE",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      requiresMultipleIndependentClaims: true,
      constituentKnowledgeTargetIds: ["synthetic-procint::stepA", "synthetic-procint::stepB"],
    });
    const result = planEvidenceRequirements(input("synthetic-procint", [stepA, stepB, compoundProcedure]));
    expect(result.requirements).toHaveLength(2); // one per constituent, none for the compound procedure itself
    expect(result.requirements.some((r) => r.sourceKnowledgeTargetIds.includes("synthetic-procint::conversions"))).toBe(false);
    const satisfaction = result.structuralSatisfactions.find((s) => s.knowledgeTargetId === "synthetic-procint::conversions");
    expect(satisfaction?.kind).toBe("INTEGRATION_SATISFIED_BY_CONSTITUENTS");
  });
});

describe("[Correction] underspecified-exemplar detection -- qualification-agnostic", () => {
  it("a representative exemplar with no governed reference is never READY, even when every other structural field would otherwise allow it", () => {
    const t = target({
      knowledgeTargetId: "synthetic-exemplar::unnamed-circuit",
      targetText: "A worked example circuit demonstrating the concept.",
      kind: "FACTUAL_PROPOSITION",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      isRepresentativeExemplar: true,
    });
    const result = planEvidenceRequirements(input("synthetic-exemplar", [t]));
    const r = result.requirements[0]!;
    expect(r.decompositionStatus).toBe("SEMANTIC_DECOMPOSITION_REQUIRED");
    expect(r.decompositionReason).toMatch(/governed reference/i);
    expect(r.representativeExemplar).toBe(true);
  });

  it("a representative exemplar explicitly resolved by a governed reference is READY like any other atomic target", () => {
    const t = target({
      knowledgeTargetId: "synthetic-exemplar::named-circuit",
      targetText: "The manufacturer-specified reference circuit for this application.",
      kind: "FACTUAL_PROPOSITION",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      isRepresentativeExemplar: true,
      exemplarObjectIdentity: "GOVERNED_REFERENCE_RESOLVED",
    });
    const result = planEvidenceRequirements(input("synthetic-exemplar", [t]));
    const r = result.requirements[0]!;
    expect(r.decompositionStatus).toBe("READY");
    expect(r.representativeExemplar).toBe(true);
  });
});

describe("[Correction] cross-batch/cross-run structural satisfaction -- qualification-agnostic", () => {
  it("a target already satisfied by an existing approved outcome from a prior run emits no new requirement", () => {
    const t = target({
      knowledgeTargetId: "synthetic-priorrun::T1",
      targetText: "A fact already taught and approved in an earlier run.",
      kind: "FACTUAL_PROPOSITION",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      satisfiedByExistingLearningPointIds: ["PRIOR-RUN-LP-05"],
    });
    const result = planEvidenceRequirements(input("synthetic-priorrun", [t]));
    expect(result.requirements).toHaveLength(0);
    const satisfaction = result.structuralSatisfactions.find((s) => s.knowledgeTargetId === "synthetic-priorrun::T1");
    expect(satisfaction?.kind).toBe("SATISFIED_BY_EXISTING_LEARNING_POINT");
    expect(satisfaction?.satisfiedByKnowledgeTargetIds).toEqual(["PRIOR-RUN-LP-05"]);
  });
});

describe("CC-23A §7/§24 -- CI/CJ: extensible source-authority policy", () => {
  it("§CI: a custom domain authority class can be supplied via policy without any planner code change", () => {
    const t = target({ knowledgeTargetId: "synthetic-ci::T1", targetText: "A fact needing a domain-specific authority class.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const customPolicy = { allowedAuthorityClassesByMode: { EXACT_FACT: ["MARITIME_CLASSIFICATION_SOCIETY"] }, registeredCustomAuthorityClasses: ["MARITIME_CLASSIFICATION_SOCIETY"] };
    const result = planEvidenceRequirements({ qualificationContext: { qualificationContextId: "synthetic-ci", description: "x" }, knowledgeTargets: [t], sourceAuthorityPolicy: customPolicy });
    expect(result.requirements[0]!.sourceAuthorityClasses).toEqual(["MARITIME_CLASSIFICATION_SOCIETY"]);
  });

  it("§CJ: authority-class policy cannot modify knowledge classification, priority, or decomposition status", () => {
    const t = target({ knowledgeTargetId: "synthetic-cj::T1", targetText: "A required fact.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const policyA = DEFAULT_SOURCE_AUTHORITY_POLICY;
    const policyB = { allowedAuthorityClassesByMode: { EXACT_FACT: ["SOME_OTHER_AUTHORITY_CLASS"] }, registeredCustomAuthorityClasses: ["SOME_OTHER_AUTHORITY_CLASS"] };
    const resultA = planEvidenceRequirements({ qualificationContext: { qualificationContextId: "synthetic-cj", description: "x" }, knowledgeTargets: [t], sourceAuthorityPolicy: policyA });
    const resultB = planEvidenceRequirements({ qualificationContext: { qualificationContextId: "synthetic-cj", description: "x" }, knowledgeTargets: [t], sourceAuthorityPolicy: policyB });
    expect(resultA.requirements[0]!.acquisitionPriority).toBe(resultB.requirements[0]!.acquisitionPriority);
    expect(resultA.requirements[0]!.decompositionStatus).toBe(resultB.requirements[0]!.decompositionStatus);
    expect(resultA.requirements[0]!.requirementMode).toBe(resultB.requirements[0]!.requirementMode);
    // Only sourceAuthorityClasses may legitimately differ between the two runs.
    expect(resultA.requirements[0]!.sourceAuthorityClasses).not.toEqual(resultB.requirements[0]!.sourceAuthorityClasses);
  });

  it("the standard authority-class defaults use the new domain-neutral CC-23A §7 names, never the CC-23 electrical-flavoured ones", () => {
    const allClasses = new Set(Object.values(DEFAULT_SOURCE_AUTHORITY_POLICY.allowedAuthorityClassesByMode).flat());
    for (const oldName of ["PRIMARY_STANDARDS_OR_METROLOGY_AUTHORITY", "UNIVERSITY_OR_OPEN_ACADEMIC_TEXT", "PROFESSIONAL_ENGINEERING_INSTITUTION", "ORIGINAL_COMPONENT_MANUFACTURER", "AUTHORITATIVE_TECHNICAL_MANUAL", "AUTHORITATIVE_MATHEMATICS_REFERENCE"]) {
      expect(allClasses.has(oldName)).toBe(false);
    }
    expect(allClasses.has("PRIMARY_NORMATIVE_OR_STANDARDS_BODY")).toBe(true);
  });
});

describe("CC-23B §1-§3/§17 -- CL-CO: evidence planning does not require the technical answer", () => {
  it("§CL: a named operating-principle target with an unknown technical answer becomes READY OPEN_TECHNICAL_QUESTION, never requiring the answer up front", () => {
    const t = target({
      knowledgeTargetId: "synthetic-cl::T1",
      targetText: "Operating principle of a thermocouple.",
      kind: "OPERATING_PRINCIPLE",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      specificationMode: "OPEN_TECHNICAL_QUESTION",
    });
    const result = planEvidenceRequirements(input("synthetic-cl", [t]));
    const r = result.requirements[0]!;
    expect(r.specificationMode).toBe("OPEN_TECHNICAL_QUESTION");
    expect(r.decompositionStatus).toBe("READY");
    expect(r.evidenceQuestion).not.toBeNull();
    expect(r.evidenceQuestion!.toLowerCase()).toContain("operating principle");
    // No technical answer invented anywhere in the emitted requirement.
    expect(r.requirementText.toLowerCase()).not.toContain("seebeck");
    expect(r.evidenceQuestion!.toLowerCase()).not.toContain("seebeck");
  });

  it("§CM: a named directional rule with an unknown mapping becomes READY OPEN_TECHNICAL_QUESTION with a generic coverage obligation, never the mapping itself", () => {
    const t = target({
      knowledgeTargetId: "synthetic-cm::T1",
      targetText: "Right-hand grip rule.",
      kind: "OPERATIONAL_USE_RULE",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      specificationMode: "OPEN_TECHNICAL_QUESTION",
      expectedCoverageDimensions: ["DIRECTIONAL_MAPPING", "ROLE_MAPPING", "CORRECT_USE_CONDITIONS"],
    });
    const result = planEvidenceRequirements(input("synthetic-cm", [t]));
    const r = result.requirements[0]!;
    expect(r.specificationMode).toBe("OPEN_TECHNICAL_QUESTION");
    expect(r.decompositionStatus).toBe("READY");
    expect(r.requiredCoverageDimensions).toEqual(["DIRECTIONAL_MAPPING", "ROLE_MAPPING", "CORRECT_USE_CONDITIONS"]);
    expect(r.evidenceQuestion).not.toBeNull();
    for (const forbidden of ["thumb", "finger", "curl"]) {
      expect(r.evidenceQuestion!.toLowerCase(), `evidenceQuestion must not leak "${forbidden}"`).not.toContain(forbidden);
      expect(r.requirementText.toLowerCase(), `requirementText must not leak "${forbidden}"`).not.toContain(forbidden);
    }
  });

  it("§CN: a formula explicitly supplied by the approved target is KNOWN_CLAIM_TO_VERIFY, with no evidence question composed", () => {
    const t = target({ knowledgeTargetId: "synthetic-cn::T1", targetText: "P = VI.", kind: "FORMULA_OR_RULE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", specificationMode: "KNOWN_CLAIM_TO_VERIFY" });
    const result = planEvidenceRequirements(input("synthetic-cn", [t]));
    const r = result.requirements[0]!;
    expect(r.specificationMode).toBe("KNOWN_CLAIM_TO_VERIFY");
    expect(r.evidenceQuestion).toBeNull();
    expect(r.requirementText).toBe("P = VI.");
  });

  it("§CO: a relationship required but its formula absent becomes OPEN_TECHNICAL_QUESTION, never inventing the missing formula", () => {
    const t = target({
      knowledgeTargetId: "synthetic-co::T1",
      targetText: "Relationship between rotational speed, pole count and generated frequency.",
      kind: "RELATIONSHIP",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      specificationMode: "OPEN_TECHNICAL_QUESTION",
    });
    const result = planEvidenceRequirements(input("synthetic-co", [t]));
    const r = result.requirements[0]!;
    expect(r.specificationMode).toBe("OPEN_TECHNICAL_QUESTION");
    expect(r.evidenceQuestion).not.toBeNull();
    expect(r.requirementText).not.toMatch(/[A-Za-z]\s*=\s*[A-Za-z0-9]/); // no formula embedded
  });
});

describe("CC-23B §4/§17 -- CP: open technical research cannot create scope", () => {
  const typesSource = readFileSync(path.join(path.resolve(import.meta.dirname), "types.ts"), "utf-8");

  it("§CP: TechnicalEvidenceAcquisitionResult has no field capable of creating a second learner target or scope -- only claims/sources tied back to the exact evidenceRequirementId", () => {
    const match = typesSource.match(/export interface TechnicalEvidenceAcquisitionResult \{([\s\S]*?)\n\}/);
    expect(match, "TechnicalEvidenceAcquisitionResult interface not found").not.toBeNull();
    const memberNames = [...match![1]!.matchAll(/readonly\s+(\w+)\s*:/g)].map((m) => m[1]);
    expect(memberNames).toEqual(["evidenceRequirementId", "candidateSources", "normalizedClaims", "verificationStatus", "coverageDimensionsSatisfied", "unresolvedDimensions", "conflicts", "gaps"]);
    for (const scopeCreatingField of ["classification", "newKnowledgeTarget", "candidateKey", "requiredFactKeys"]) {
      expect(memberNames).not.toContain(scopeCreatingField);
    }
  });
});

describe("CC-23B §10/§17 -- CS-CU: identity governance controls reuse safety", () => {
  it("§CS: a PROVISIONAL_NON_REUSABLE identity never deduplicates across qualifications, even with identical namespace/key/text", () => {
    const identity: TechnicalSemanticIdentity = { semanticNamespace: "electromagnetism", semanticKey: "some-local-rule", governanceState: "PROVISIONAL_NON_REUSABLE" };
    const a = target({ knowledgeTargetId: "synthetic-cs-q1::T1", targetText: "Some local rule.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: identity });
    const b = target({ knowledgeTargetId: "synthetic-cs-q2::T1", targetText: "Some local rule.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: identity });
    const first = planEvidenceRequirements(input("synthetic-cs-q1", [a]));
    const second = planEvidenceRequirements(input("synthetic-cs-q2", [b]), first.requirements);
    expect(second.requirements).toHaveLength(2); // never merged across qualifications
    expect(second.requirements[0]!.canonicalRequirementKey).not.toBe(second.requirements[1]!.canonicalRequirementKey);
  });

  it("§CS (continued): a PROVISIONAL_NON_REUSABLE identity still reuses normally WITHIN the same qualification", () => {
    const identity: TechnicalSemanticIdentity = { semanticNamespace: "electromagnetism", semanticKey: "some-local-rule", governanceState: "PROVISIONAL_NON_REUSABLE" };
    const a = target({ knowledgeTargetId: "synthetic-cs-same::T1", targetText: "Some local rule.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: identity });
    const b = target({ knowledgeTargetId: "synthetic-cs-same::T2", targetText: "Some local rule, restated.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: identity });
    const result = planEvidenceRequirements(input("synthetic-cs-same", [a, b]));
    expect(result.requirements).toHaveLength(1); // same qualificationContextId -> normal reuse
    expect([...result.requirements[0]!.sourceKnowledgeTargetIds].sort()).toEqual(["synthetic-cs-same::T1", "synthetic-cs-same::T2"]);
  });

  it("§CT: a CANONICAL identity may deduplicate across qualifications", () => {
    const identity: TechnicalSemanticIdentity = { semanticNamespace: "electromagnetism", semanticKey: "a-universal-law", governanceState: "CANONICAL" };
    const a = target({ knowledgeTargetId: "synthetic-ct-q1::T1", targetText: "A universal law, phrasing one.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: identity });
    const b = target({ knowledgeTargetId: "synthetic-ct-q2::T1", targetText: "A universal law, phrasing two.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: identity });
    const first = planEvidenceRequirements(input("synthetic-ct-q1", [a]));
    const second = planEvidenceRequirements(input("synthetic-ct-q2", [b]), first.requirements);
    expect(second.requirements).toHaveLength(1);
    expect([...second.requirements[0]!.sourceKnowledgeTargetIds].sort()).toEqual(["synthetic-ct-q1::T1", "synthetic-ct-q2::T1"]);
  });

  it("§CU: an UNRESOLVED semantic identity produces an explicit planning gap, unconditionally, before any other structural field is considered", () => {
    const identity: TechnicalSemanticIdentity = { semanticNamespace: "unclassified", semanticKey: "unclassified", governanceState: "UNRESOLVED" };
    const t = target({
      knowledgeTargetId: "synthetic-cu::T1",
      targetText: "Some target with structurally under-specified semantics.",
      kind: "FACTUAL_PROPOSITION",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      semanticIdentity: identity,
    });
    const result = planEvidenceRequirements(input("synthetic-cu", [t]));
    expect(result.requirements).toHaveLength(1);
    expect(result.requirements[0]!.decompositionStatus).toBe("SEMANTIC_DECOMPOSITION_REQUIRED");
    expect(result.requirements[0]!.decompositionReason).toMatch(/UNRESOLVED/);
  });
});

describe("CC-23B §12/§17 -- CV/CW: custom authority-class registration", () => {
  it("§CV: an undeclared custom authority class throws a structured configuration-gap error, never silently trusted", () => {
    const policy = { allowedAuthorityClassesByMode: { EXACT_FACT: ["MARITIME_CLASSIFICATON_SOCIETY"] } }; // deliberate typo, never registered
    expect(() => validateSourceAuthorityPolicy(policy)).toThrow(/undeclared custom authority class/i);
  });

  it("§CW: a declared custom authority class passes validation, and flows through planning, with zero production-code change", () => {
    const policy = { allowedAuthorityClassesByMode: { EXACT_FACT: ["MARITIME_CLASSIFICATION_SOCIETY"] }, registeredCustomAuthorityClasses: ["MARITIME_CLASSIFICATION_SOCIETY"] };
    expect(() => validateSourceAuthorityPolicy(policy)).not.toThrow();
    const t = target({ knowledgeTargetId: "synthetic-cw::T1", targetText: "A fact needing a maritime authority.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const result = planEvidenceRequirements({ qualificationContext: { qualificationContextId: "synthetic-cw", description: "x" }, knowledgeTargets: [t], sourceAuthorityPolicy: policy });
    expect(result.requirements[0]!.sourceAuthorityClasses).toEqual(["MARITIME_CLASSIFICATION_SOCIETY"]);
  });
});

describe("CC-23 -- additional structural/scope coverage beyond the required §16 letters", () => {
  it("a structural/parent target with governed children emits zero evidence requirements of its own", () => {
    const child1 = target({ knowledgeTargetId: "synthetic-struct::lever", targetText: "Lever: a rigid bar pivoting about a fulcrum.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const child2 = target({ knowledgeTargetId: "synthetic-struct::pulley", targetText: "Pulley: a wheel used to change the direction of a force.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const parent = target({
      knowledgeTargetId: "synthetic-struct::simple-machines",
      targetText: "Simple machines.",
      kind: "FACTUAL_PROPOSITION",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      childKnowledgeTargetIds: ["synthetic-struct::lever", "synthetic-struct::pulley"],
    });
    const result = planEvidenceRequirements(input("synthetic-struct", [parent, child1, child2]));
    expect(result.requirements).toHaveLength(2);
    expect(result.requirements.some((r) => r.sourceKnowledgeTargetIds.includes("synthetic-struct::simple-machines"))).toBe(false);
    const satisfaction = result.structuralSatisfactions.find((s) => s.knowledgeTargetId === "synthetic-struct::simple-machines");
    expect(satisfaction?.kind).toBe("STRUCTURAL_PARENT_DECOMPOSED");
  });

  it("an OUT_OF_SCOPE target is never sourced", () => {
    const t = target({ knowledgeTargetId: "synthetic-oos::T1", targetText: "A tangential fact never required by this qualification.", kind: "FACTUAL_PROPOSITION", classification: "OUT_OF_SCOPE" });
    const result = planEvidenceRequirements(input("synthetic-oos", [t]));
    expect(result.requirements).toHaveLength(0);
    expect(result.structuralSatisfactions[0]?.kind).toBe("OUT_OF_SCOPE_EXCLUDED");
  });

  it("planner output is deterministic and array-order-independent", () => {
    const a = target({ knowledgeTargetId: "synthetic-order::A", targetText: "Alpha proposition.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const b = target({ knowledgeTargetId: "synthetic-order::B", targetText: "Beta proposition.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const forward = planEvidenceRequirements(input("synthetic-order", [a, b]));
    const reversed = planEvidenceRequirements(input("synthetic-order", [b, a]));
    expect(forward.requirements.map((r) => r.canonicalRequirementKey)).toEqual(reversed.requirements.map((r) => r.canonicalRequirementKey));
  });

  it("a caller-supplied authority policy overrides only the modes it declares, falling back to the generic default elsewhere", () => {
    const t = target({ knowledgeTargetId: "synthetic-policy::T1", targetText: "A fact needing a domain-specific authority class.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const customPolicy = { allowedAuthorityClassesByMode: { EXACT_FACT: ["GOVERNMENT_OR_REGULATOR"] } };
    const result = planEvidenceRequirements({ qualificationContext: { qualificationContextId: "synthetic-policy", description: "x" }, knowledgeTargets: [t], sourceAuthorityPolicy: customPolicy });
    expect(result.requirements[0]!.sourceAuthorityClasses).toEqual(["GOVERNMENT_OR_REGULATOR"]);
  });
});

describe("CC-23 §16.H -- under-specified target", () => {
  it("a concept-definition target with no coverage-dimension hints abstains rather than inventing a decomposition", () => {
    const t = target({ knowledgeTargetId: "synthetic-h::T1", targetText: "Definition of entropy.", kind: "CONCEPT_DEFINITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const result = planEvidenceRequirements(input("synthetic-h", [t]));
    expect(result.requirements).toHaveLength(1);
    const r = result.requirements[0]!;
    expect(r.decompositionStatus).toBe("SEMANTIC_DECOMPOSITION_REQUIRED");
    expect(r.decompositionReason).not.toBeNull();
    expect(r.acceptanceCriteria).toMatch(/not yet determinable/i);
  });

  it("a multi-claim relationship target with no declared constituents or foundational-procedure reuse also abstains", () => {
    const t = target({
      knowledgeTargetId: "synthetic-h::T2",
      targetText: "Relationship between several already-sourceable quantities.",
      kind: "RELATIONSHIP",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      requiresMultipleIndependentClaims: true,
    });
    const result = planEvidenceRequirements(input("synthetic-h", [t]));
    expect(result.requirements).toHaveLength(1);
    expect(result.requirements[0]!.decompositionStatus).toBe("SEMANTIC_DECOMPOSITION_REQUIRED");
  });
});

describe("CC-23 §16.G -- contextual target", () => {
  it("a contextual target is still sourced but never enters required acquisition scoring", () => {
    const t = target({ knowledgeTargetId: "synthetic-g::T1", targetText: "A brief historical note on the discovery of penicillin.", kind: "FACTUAL_PROPOSITION", classification: "CONTEXTUAL_TEACHING_SUPPORT" });
    const result = planEvidenceRequirements(input("synthetic-g", [t]));
    expect(result.requirements).toHaveLength(1);
    expect(result.requirements[0]!.acquisitionPriority).toBe("OPTIONAL_CONTEXT");
  });
});

describe("CC-23 §28 -- architecture-integrity checks", () => {
  const srcDir = path.resolve(import.meta.dirname);
  const typesSource = readFileSync(path.join(srcDir, "types.ts"), "utf-8");
  const plannerSource = readFileSync(path.join(srcDir, "planner.ts"), "utf-8");
  const accessGuardSource = readFileSync(path.join(srcDir, "access-guard.ts"), "utf-8");
  const indexSource = readFileSync(path.join(srcDir, "index.ts"), "utf-8");
  const allProductionSource = [typesSource, plannerSource, accessGuardSource, indexSource];

  it("production source contains zero qualification-specific or electrical-specific literals", () => {
    const banned = ["unit202", "unit 202", "2365", "city & guilds", "city and guilds", "c&g", "ammeter", "voltmeter", "triac", "ac/dc", "ac1.1", "ac2.2"];
    for (const source of allProductionSource) {
      const lower = source.toLowerCase();
      for (const literal of banned) {
        expect(lower.includes(literal), `production source must not contain "${literal}"`).toBe(false);
      }
    }
  });

  it("this package declares zero dependency on any @alp/* workspace package", () => {
    const packageJson = JSON.parse(readFileSync(path.resolve(srcDir, "..", "package.json"), "utf-8")) as { dependencies?: Record<string, string> };
    expect(Object.keys(packageJson.dependencies ?? {}).every((d) => !d.startsWith("@alp/"))).toBe(true);
  });

  it("no source file in this package imports from an @alp/* workspace package", () => {
    for (const source of allProductionSource) expect(source).not.toMatch(/from\s+["']@alp\//);
  });

  it("the planner never researches, browses, retrieves, or performs any i/o -- it is a pure function over its input (task §13)", () => {
    const ioSignatures = ["fetch(", "http.request", "https.request", "readFileSync", "writeFileSync", "XMLHttpRequest", "WebFetch", "WebSearch"];
    for (const signature of ioSignatures) {
      expect(plannerSource.includes(signature), `planner.ts must not contain the I/O signature "${signature}"`).toBe(false);
    }
  });

  it("no production file contains Unit-202-style qualified conditional branching (if path.includes(\"unit202\"))", () => {
    for (const source of allProductionSource) {
      expect(source).not.toMatch(/includes\(\s*["']unit ?202["']/i);
    }
  });

  it("the planner discovers no semantic identity from free text -- canonicalRequirementKey is a pure function of the supplied TechnicalSemanticIdentity, never of targetText content (task §6)", () => {
    expect(plannerSource).not.toMatch(/targetText[\s\S]{0,60}canonicalRequirementKey/);
    expect(plannerSource).toContain("target.semanticIdentity");
  });

  it("SourceAuthorityClass is an open, extensible type -- never a closed zod enum (task §7)", () => {
    expect(typesSource).not.toMatch(/sourceAuthorityClassSchema\s*=\s*z\.enum/);
  });
});
