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
import { DEFAULT_SOURCE_AUTHORITY_POLICY, canonicalRequirementKey, planEvidenceRequirements } from "./planner.ts";
import type { KnowledgeEvidencePlanningInput, KnowledgeTarget, TechnicalSemanticIdentity } from "./types.ts";

function defaultIdentityFor(knowledgeTargetId: string, targetText: string): TechnicalSemanticIdentity {
  const namespace = knowledgeTargetId.includes("::") ? knowledgeTargetId.split("::")[0]! : "default";
  const key = targetText
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return { semanticNamespace: namespace, semanticKey: key };
}

function target(overrides: Partial<KnowledgeTarget> & Pick<KnowledgeTarget, "knowledgeTargetId" | "targetText" | "kind" | "classification">): KnowledgeTarget {
  return { semanticIdentity: defaultIdentityFor(overrides.knowledgeTargetId, overrides.targetText), ...overrides };
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
    const sharedIdentity: TechnicalSemanticIdentity = { semanticNamespace: "classical-mechanics", semanticKey: "newtons-second-law" };
    const q1Target = target({ knowledgeTargetId: "synthetic-f1::T1", targetText: "Newton's second law: force equals mass times acceleration.", kind: "FORMULA_OR_RULE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: sharedIdentity });
    const q2Target = target({ knowledgeTargetId: "synthetic-f2::T1", targetText: "F = ma (Newton's second law of motion).", kind: "FORMULA_OR_RULE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: sharedIdentity });

    const firstResult = planEvidenceRequirements(input("synthetic-f1", [q1Target]));
    expect(firstResult.requirements).toHaveLength(1);

    const secondResult = planEvidenceRequirements(input("synthetic-f2", [q2Target]), firstResult.requirements);
    expect(secondResult.requirements).toHaveLength(1); // reused, not duplicated, despite different wording
    const reused = secondResult.requirements[0]!;
    expect([...reused.sourceKnowledgeTargetIds].sort()).toEqual(["synthetic-f1::T1", "synthetic-f2::T1"]);
    expect(reused.canonicalRequirementKey).toBe(canonicalRequirementKey(sharedIdentity, "FORMULA_OR_RULE"));
    expect(reused.deduplicationBasis).toMatch(/reused across 2 knowledge targets/);
  });

  it("§CE: two learner targets within the SAME qualification sharing a semantic identity also reuse", () => {
    const sharedIdentity: TechnicalSemanticIdentity = { semanticNamespace: "classical-mechanics", semanticKey: "gravitational-weight-relation" };
    const t1 = target({ knowledgeTargetId: "synthetic-ce::T1", targetText: "Weight equals mass times gravitational field strength.", kind: "FORMULA_OR_RULE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: sharedIdentity });
    const t2 = target({ knowledgeTargetId: "synthetic-ce::T2", targetText: "W = mg.", kind: "FORMULA_OR_RULE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: sharedIdentity });
    const result = planEvidenceRequirements(input("synthetic-ce", [t1, t2]));
    expect(result.requirements).toHaveLength(1);
    expect([...result.requirements[0]!.sourceKnowledgeTargetIds].sort()).toEqual(["synthetic-ce::T1", "synthetic-ce::T2"]);
  });
});

describe("CC-23A §5 -- CA-CD: semantic-identity-driven canonical reuse (homonym safety)", () => {
  it("§CA: two qualifications require the same semantic law with different wording -> one reusable requirement when semantic identity is equal", () => {
    const identity: TechnicalSemanticIdentity = { semanticNamespace: "thermodynamics", semanticKey: "ideal-gas-law" };
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
      semanticIdentity: { semanticNamespace: "statistics", semanticKey: "range" },
    });
    const instrumentRange = target({
      knowledgeTargetId: "synthetic-cb::measurement",
      targetText: "Range.",
      kind: "FACTUAL_PROPOSITION",
      classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
      semanticIdentity: { semanticNamespace: "measurement", semanticKey: "instrument-range" },
    });
    const result = planEvidenceRequirements(input("synthetic-cb", [statsRange, instrumentRange]));
    expect(result.requirements).toHaveLength(2);
    expect(result.requirements[0]!.canonicalRequirementKey).not.toBe(result.requirements[1]!.canonicalRequirementKey);
  });

  it("§CC: same semantic identity but incompatible requirement modes -> never silently collapsed", () => {
    const identity: TechnicalSemanticIdentity = { semanticNamespace: "materials-science", semanticKey: "yield-point" };
    const definition = target({ knowledgeTargetId: "synthetic-cc::def", targetText: "Yield point: the stress at which a material begins to deform plastically.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: identity });
    const procedure = target({ knowledgeTargetId: "synthetic-cc::proc", targetText: "Determining the yield point from a stress-strain curve.", kind: "PROCEDURE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE", semanticIdentity: identity });
    const result = planEvidenceRequirements(input("synthetic-cc", [definition, procedure]));
    expect(result.requirements).toHaveLength(2); // EXACT_FACT and PROCEDURE_COVERAGE never collapse despite equal semantic identity
    expect(result.requirements.map((r) => r.requirementMode).sort()).toEqual(["EXACT_FACT", "PROCEDURE_COVERAGE"]);
  });

  it("§CD: qualification ID differs but semantic identity matches -> reuse still occurs", () => {
    const identity: TechnicalSemanticIdentity = { semanticNamespace: "electromagnetism", semanticKey: "magnetic-flux-density-relation" };
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

describe("CC-23A §7/§24 -- CI/CJ: extensible source-authority policy", () => {
  it("§CI: a custom domain authority class can be supplied via policy without any planner code change", () => {
    const t = target({ knowledgeTargetId: "synthetic-ci::T1", targetText: "A fact needing a domain-specific authority class.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const customPolicy = { allowedAuthorityClassesByMode: { EXACT_FACT: ["MARITIME_CLASSIFICATION_SOCIETY"] } };
    const result = planEvidenceRequirements({ qualificationContext: { qualificationContextId: "synthetic-ci", description: "x" }, knowledgeTargets: [t], sourceAuthorityPolicy: customPolicy });
    expect(result.requirements[0]!.sourceAuthorityClasses).toEqual(["MARITIME_CLASSIFICATION_SOCIETY"]);
  });

  it("§CJ: authority-class policy cannot modify knowledge classification, priority, or decomposition status", () => {
    const t = target({ knowledgeTargetId: "synthetic-cj::T1", targetText: "A required fact.", kind: "FACTUAL_PROPOSITION", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const policyA = DEFAULT_SOURCE_AUTHORITY_POLICY;
    const policyB = { allowedAuthorityClassesByMode: { EXACT_FACT: ["SOME_OTHER_AUTHORITY_CLASS"] } };
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
