/**
 * PA review of CC-24 pilot-001 (requirement 6, "right-hand grip rule"):
 * the generic OPERATIONAL_USE_RULE default excludes ACADEMIC_OR_RESEARCH_
 * INSTITUTION / AUTHORITATIVE_EDUCATIONAL_REFERENCE, which wrongly forced
 * the pilot to relabel a genuinely academic source (a physics-department
 * handout) as AUTHORITATIVE_TECHNICAL_REFERENCE to make it fit. These
 * tests prove the narrow, Unit-202-scoped, dimension-precise override in
 * unit202-adapter.ts (`applyUnit202DirectionalRuleAuthorityPolicyOverride`)
 * -- never a broadening of the generic default, never a relabeling
 * workaround.
 *
 * Imports only the clean pilot-preparation path and the generic package
 * -- no historical material.
 */
import { describe, expect, it } from "vitest";
import type { EvidenceRequirement, KnowledgeEvidencePlanResult } from "@alp/technical-evidence-engine";
import { DEFAULT_SOURCE_AUTHORITY_POLICY } from "@alp/technical-evidence-engine";

import { UNIT202_DIRECTIONAL_RULE_AUTHORITY_CLASSES, applyUnit202DirectionalRuleAuthorityPolicyOverride } from "../unit202-evidence-acquisition-preflight/unit202-adapter.ts";
import { buildCleanPlan } from "./clean-plan.ts";

const DIRECTIONAL_REQUIREMENT_IDS = [
  "ER::provisional::unit202::electromagnetism-and-induction::right-hand-grip-rule::OPERATIONAL_USE_RULE",
  "ER::provisional::unit202::electromagnetism-and-induction::fleming-left-hand-rule::OPERATIONAL_USE_RULE",
  "ER::provisional::unit202::electromagnetism-and-induction::fleming-right-hand-generator-rule::OPERATIONAL_USE_RULE",
];

function fixtureRequirement(overrides: Partial<EvidenceRequirement>): EvidenceRequirement {
  return {
    evidenceRequirementId: "ER::test::fixture::OPERATIONAL_USE_RULE",
    canonicalRequirementKey: "test::fixture::OPERATIONAL_USE_RULE",
    sourceKnowledgeTargetIds: ["unit202::ACQ-TEST"],
    requirementMode: "OPERATIONAL_USE_RULE",
    specificationMode: "OPEN_TECHNICAL_QUESTION",
    requirementText: "Fixture rule.",
    evidenceQuestion: "What is the fixture rule?",
    requiredCoverageDimensions: ["DIRECTIONAL_MAPPING", "ROLE_MAPPING", "CORRECT_USE_CONDITIONS"],
    sourceAuthorityClasses: DEFAULT_SOURCE_AUTHORITY_POLICY.allowedAuthorityClassesByMode.OPERATIONAL_USE_RULE!,
    acquisitionPriority: "REQUIRED",
    representativeExemplar: false,
    calibratedSupportingPerformance: null,
    deduplicationBasis: "fixture",
    decompositionStatus: "READY",
    decompositionReason: null,
    acceptanceCriteria: "fixture",
    ...overrides,
  };
}

describe("CC-24 PA-review correction §2 -- Unit-202 directional-rule authority-policy override", () => {
  it("expands the three real Unit-202 directional requirements to the declared six-class list, including ACADEMIC_OR_RESEARCH_INSTITUTION and AUTHORITATIVE_EDUCATIONAL_REFERENCE", () => {
    const plan = buildCleanPlan();
    const found = new Set<string>();
    for (const id of DIRECTIONAL_REQUIREMENT_IDS) {
      const req = plan.requirements.find((r) => r.evidenceRequirementId === id);
      expect(req, `expected requirement present: ${id}`).toBeDefined();
      expect(req!.requirementMode).toBe("OPERATIONAL_USE_RULE");
      expect(new Set(req!.sourceAuthorityClasses)).toEqual(new Set(UNIT202_DIRECTIONAL_RULE_AUTHORITY_CLASSES));
      found.add(id);
    }
    expect(found.size).toBe(3);
  });

  it("an academic source is declared as ACADEMIC_OR_RESEARCH_INSTITUTION itself -- never relabeled to fit a class it does not belong to", () => {
    // Task §2's own defect: pilot-001 classified a physics-department
    // handout as AUTHORITATIVE_TECHNICAL_REFERENCE because the generic
    // policy excluded ACADEMIC_OR_RESEARCH_INSTITUTION. The corrected
    // policy must list ACADEMIC_OR_RESEARCH_INSTITUTION literally, so a
    // genuinely academic source never again needs a relabeling workaround.
    expect(UNIT202_DIRECTIONAL_RULE_AUTHORITY_CLASSES).toContain("ACADEMIC_OR_RESEARCH_INSTITUTION");
    expect(UNIT202_DIRECTIONAL_RULE_AUTHORITY_CLASSES).toContain("AUTHORITATIVE_EDUCATIONAL_REFERENCE");
  });

  it("does not widen a generic OPERATIONAL_USE_RULE requirement whose dimensions are not exactly the directional-rule triplet (e.g. a genuine SAFE_USE procedure)", () => {
    const strictClasses = DEFAULT_SOURCE_AUTHORITY_POLICY.allowedAuthorityClassesByMode.OPERATIONAL_USE_RULE!;
    const safeUseRequirement = fixtureRequirement({
      evidenceRequirementId: "ER::test::safety-critical-procedure::OPERATIONAL_USE_RULE",
      canonicalRequirementKey: "test::safety-critical-procedure::OPERATIONAL_USE_RULE",
      requiredCoverageDimensions: ["SAFE_USE"],
      sourceAuthorityClasses: strictClasses,
    });
    const plan: KnowledgeEvidencePlanResult = { requirements: [safeUseRequirement], structuralSatisfactions: [] };

    const result = applyUnit202DirectionalRuleAuthorityPolicyOverride(plan);

    expect(result.requirements[0]!.sourceAuthorityClasses).toEqual(strictClasses);
    expect(result.requirements[0]!.sourceAuthorityClasses).not.toContain("ACADEMIC_OR_RESEARCH_INSTITUTION");
  });

  it("does not widen a directional-dimension requirement of a DIFFERENT mode (e.g. RELATIONSHIP)", () => {
    const strictRelationshipClasses = DEFAULT_SOURCE_AUTHORITY_POLICY.allowedAuthorityClassesByMode.RELATIONSHIP!;
    const wrongModeRequirement = fixtureRequirement({
      evidenceRequirementId: "ER::test::wrong-mode::RELATIONSHIP",
      canonicalRequirementKey: "test::wrong-mode::RELATIONSHIP",
      requirementMode: "RELATIONSHIP",
      requiredCoverageDimensions: ["DIRECTIONAL_MAPPING", "ROLE_MAPPING", "CORRECT_USE_CONDITIONS"],
      sourceAuthorityClasses: strictRelationshipClasses,
    });
    const plan: KnowledgeEvidencePlanResult = { requirements: [wrongModeRequirement], structuralSatisfactions: [] };

    const result = applyUnit202DirectionalRuleAuthorityPolicyOverride(plan);

    expect(result.requirements[0]!.sourceAuthorityClasses).toEqual(strictRelationshipClasses);
  });

  it("does not widen a partial-dimension match (subset or superset of the directional triplet)", () => {
    const strictClasses = DEFAULT_SOURCE_AUTHORITY_POLICY.allowedAuthorityClassesByMode.OPERATIONAL_USE_RULE!;
    const subsetRequirement = fixtureRequirement({
      evidenceRequirementId: "ER::test::subset::OPERATIONAL_USE_RULE",
      canonicalRequirementKey: "test::subset::OPERATIONAL_USE_RULE",
      requiredCoverageDimensions: ["DIRECTIONAL_MAPPING", "ROLE_MAPPING"],
      sourceAuthorityClasses: strictClasses,
    });
    const supersetRequirement = fixtureRequirement({
      evidenceRequirementId: "ER::test::superset::OPERATIONAL_USE_RULE",
      canonicalRequirementKey: "test::superset::OPERATIONAL_USE_RULE",
      requiredCoverageDimensions: ["DIRECTIONAL_MAPPING", "ROLE_MAPPING", "CORRECT_USE_CONDITIONS", "SAFE_USE"],
      sourceAuthorityClasses: strictClasses,
    });
    const plan: KnowledgeEvidencePlanResult = { requirements: [subsetRequirement, supersetRequirement], structuralSatisfactions: [] };

    const result = applyUnit202DirectionalRuleAuthorityPolicyOverride(plan);

    expect(result.requirements[0]!.sourceAuthorityClasses).toEqual(strictClasses);
    expect(result.requirements[1]!.sourceAuthorityClasses).toEqual(strictClasses);
  });

  it("leaves the generic DEFAULT_SOURCE_AUTHORITY_POLICY itself completely unmodified", () => {
    expect(DEFAULT_SOURCE_AUTHORITY_POLICY.allowedAuthorityClassesByMode.OPERATIONAL_USE_RULE).toEqual(["GOVERNMENT_OR_REGULATOR", "PROFESSIONAL_BODY", "AUTHORITATIVE_TECHNICAL_REFERENCE", "ORIGINAL_MANUFACTURER_OR_VENDOR"]);
  });

  it("changes no other Unit-202 mode, target text, classification, priority, or specification mode -- and every CC-24 Correction-A plan count is unchanged", () => {
    const plan = buildCleanPlan();
    expect(plan.requirements).toHaveLength(213);
    expect(plan.requirements.every((r) => r.decompositionStatus === "READY")).toBe(true);
    expect(plan.requirements.filter((r) => r.specificationMode === "KNOWN_CLAIM_TO_VERIFY")).toHaveLength(20);
    expect(plan.requirements.filter((r) => r.specificationMode === "OPEN_TECHNICAL_QUESTION")).toHaveLength(193);
    expect(plan.requirements.filter((r) => r.requirementMode === "APPLICATION_FUNCTION")).toHaveLength(6);
    expect(plan.requirements.filter((r) => r.requirementMode === "OPERATING_PRINCIPLE")).toHaveLength(14);
    expect(plan.requirements.filter((r) => r.requirementMode === "EXACT_FACT")).toHaveLength(78);
    expect(plan.requirements.filter((r) => r.requirementMode === "OPERATIONAL_USE_RULE")).toHaveLength(3);

    // Every non-directional requirement's sourceAuthorityClasses is untouched
    // by the override -- it matches exactly what the mode's DEFAULT policy
    // would have produced.
    const untouched = plan.requirements.filter((r) => !DIRECTIONAL_REQUIREMENT_IDS.includes(r.evidenceRequirementId));
    for (const r of untouched) {
      const defaultForMode = DEFAULT_SOURCE_AUTHORITY_POLICY.allowedAuthorityClassesByMode[r.requirementMode];
      if (defaultForMode) expect(new Set(r.sourceAuthorityClasses)).toEqual(new Set(defaultForMode));
    }
  });
});
