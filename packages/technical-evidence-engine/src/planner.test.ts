/**
 * CC-23 §16: generic synthetic-domain regression fixtures A-H, plus
 * architecture-integrity checks mirroring
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
import type { KnowledgeEvidencePlanningInput, KnowledgeTarget } from "./types.ts";

function target(overrides: Partial<KnowledgeTarget> & Pick<KnowledgeTarget, "knowledgeTargetId" | "targetText" | "kind" | "classification">): KnowledgeTarget {
  return overrides;
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

describe("CC-23 §16.F -- cross-qualification canonical reuse", () => {
  it("the same canonical technical truth required by two different synthetic qualifications collapses into one reused evidence requirement", () => {
    const q1Target = target({ knowledgeTargetId: "synthetic-f1::T1", targetText: "Newton's second law: force equals mass times acceleration.", kind: "FORMULA_OR_RULE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });
    const q2Target = target({ knowledgeTargetId: "synthetic-f2::T1", targetText: "Newton's second law: force equals mass times acceleration.", kind: "FORMULA_OR_RULE", classification: "REQUIRED_QUALIFICATION_KNOWLEDGE" });

    const firstResult = planEvidenceRequirements(input("synthetic-f1", [q1Target]));
    expect(firstResult.requirements).toHaveLength(1);

    const secondResult = planEvidenceRequirements(input("synthetic-f2", [q2Target]), firstResult.requirements);
    expect(secondResult.requirements).toHaveLength(1); // reused, not duplicated
    const reused = secondResult.requirements[0]!;
    expect([...reused.sourceKnowledgeTargetIds].sort()).toEqual(["synthetic-f1::T1", "synthetic-f2::T1"]);
    expect(reused.canonicalRequirementKey).toBe(canonicalRequirementKey(q1Target.targetText, "FORMULA_OR_RULE"));
    expect(reused.deduplicationBasis).toMatch(/reused across 2 knowledge targets/);
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

  it("a multi-claim relationship target with no declared constituents also abstains", () => {
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
    const customPolicy = { allowedAuthorityClassesByMode: { EXACT_FACT: ["GOVERNMENT_OR_REGULATOR"] as const } };
    const result = planEvidenceRequirements({ qualificationContext: { qualificationContextId: "synthetic-policy", description: "x" }, knowledgeTargets: [t], sourceAuthorityPolicy: customPolicy });
    expect(result.requirements[0]!.sourceAuthorityClasses).toEqual(["GOVERNMENT_OR_REGULATOR"]);
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

  it("the planner never researches, browses, retrieves, or performs any I/O -- it is a pure function over its input (task §13)", () => {
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
});
