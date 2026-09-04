/**
 * PA review of CC-24 pilot-001 (requirement 6, "right-hand grip rule"),
 * and the PA's follow-up correction: the generic OPERATIONAL_USE_RULE
 * default excludes ACADEMIC_OR_RESEARCH_INSTITUTION / AUTHORITATIVE_
 * EDUCATIONAL_REFERENCE, which wrongly forced the pilot to relabel a
 * genuinely academic source (a physics-department handout) as
 * AUTHORITATIVE_TECHNICAL_REFERENCE to make it fit.
 *
 * [Corrected] These tests previously proved a POST-PLANNING override
 * function applied only by clean-plan.ts (pilot-path adoption). The
 * correction makes the policy CANONICAL: `UNIT202_SOURCE_AUTHORITY_POLICY`
 * is supplied directly in `buildUnit202PlanningInput().input.sourceAuthorityPolicy`,
 * so ANY caller of the adapter (clean-plan.ts, build-preflight.ts, or a
 * bare `planEvidenceRequirements(input)` call) receives the identical,
 * already-widened policy -- with no post-processing step to apply or
 * forget. These tests prove the canonical adoption directly, plus the
 * fail-closed invariant that makes the mode-level widening safe.
 *
 * Imports only the clean pilot-preparation path and the generic package
 * -- no historical material. Never runs build-preflight.ts itself (its
 * canonical adoption is proven structurally, by testing the SAME
 * `buildUnit202PlanningInput`/`planEvidenceRequirements` calls
 * build-preflight.ts would make, not by executing that script).
 */
import { describe, expect, it } from "vitest";
import type { EvidenceRequirement, KnowledgeTarget, RequirementMode } from "@alp/technical-evidence-engine";
import { DEFAULT_SOURCE_AUTHORITY_POLICY, planEvidenceRequirements } from "@alp/technical-evidence-engine";

import { UNIT202_DIRECTIONAL_RULE_AUTHORITY_CLASSES, UNIT202_SOURCE_AUTHORITY_POLICY, assertUnit202DirectionalRuleInvariant, buildUnit202PlanningInput } from "../unit202-evidence-acquisition-preflight/unit202-adapter.ts";
import { buildCleanPlan } from "./clean-plan.ts";

const DIRECTIONAL_REQUIREMENT_IDS = [
  "ER::provisional::unit202::electromagnetism-and-induction::right-hand-grip-rule::OPERATIONAL_USE_RULE",
  "ER::provisional::unit202::electromagnetism-and-induction::fleming-left-hand-rule::OPERATIONAL_USE_RULE",
  "ER::provisional::unit202::electromagnetism-and-induction::fleming-right-hand-generator-rule::OPERATIONAL_USE_RULE",
];

const EXPECTED_DIRECTIONAL_REQUIREMENT_TEXT: Record<string, string> = {
  "ER::provisional::unit202::electromagnetism-and-induction::right-hand-grip-rule::OPERATIONAL_USE_RULE": "Right-hand grip rule.",
  "ER::provisional::unit202::electromagnetism-and-induction::fleming-left-hand-rule::OPERATIONAL_USE_RULE": "Fleming left-hand rule.",
  "ER::provisional::unit202::electromagnetism-and-induction::fleming-right-hand-generator-rule::OPERATIONAL_USE_RULE": "Fleming right-hand/generator rule.",
};

function fixtureKnowledgeTarget(overrides: Partial<KnowledgeTarget>): KnowledgeTarget {
  return {
    knowledgeTargetId: "unit202::ACQ-TEST",
    targetText: "Fixture rule.",
    kind: "OPERATIONAL_USE_RULE",
    classification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    semanticIdentity: { semanticNamespace: "test", semanticKey: "fixture", governanceState: "PROVISIONAL_NON_REUSABLE" },
    specificationMode: "OPEN_TECHNICAL_QUESTION",
    expectedCoverageDimensions: ["DIRECTIONAL_MAPPING", "ROLE_MAPPING", "CORRECT_USE_CONDITIONS"],
    isRepresentativeExemplar: false,
    ...overrides,
  };
}

describe("CC-24 PA-review correction §2 -- canonical Unit-202 directional-rule authority policy", () => {
  it("buildUnit202PlanningInput().input carries UNIT202_SOURCE_AUTHORITY_POLICY, with OPERATIONAL_USE_RULE widened and every other mode identical to the generic default", () => {
    const { input } = buildUnit202PlanningInput();
    expect(input.sourceAuthorityPolicy).toBe(UNIT202_SOURCE_AUTHORITY_POLICY);
    expect(new Set(input.sourceAuthorityPolicy.allowedAuthorityClassesByMode.OPERATIONAL_USE_RULE)).toEqual(new Set(UNIT202_DIRECTIONAL_RULE_AUTHORITY_CLASSES));
    for (const mode of Object.keys(DEFAULT_SOURCE_AUTHORITY_POLICY.allowedAuthorityClassesByMode) as RequirementMode[]) {
      if (mode === "OPERATIONAL_USE_RULE") continue;
      expect(input.sourceAuthorityPolicy.allowedAuthorityClassesByMode[mode]).toEqual(DEFAULT_SOURCE_AUTHORITY_POLICY.allowedAuthorityClassesByMode[mode]);
    }
  });

  it("a direct planEvidenceRequirements(input) call -- exactly what build-preflight.ts's own call site makes -- already receives the expanded list, with no post-planning step", () => {
    const { input } = buildUnit202PlanningInput();
    const plan = planEvidenceRequirements(input);
    for (const id of DIRECTIONAL_REQUIREMENT_IDS) {
      const req = plan.requirements.find((r) => r.evidenceRequirementId === id);
      expect(req, `expected requirement present: ${id}`).toBeDefined();
      expect(new Set(req!.sourceAuthorityClasses)).toEqual(new Set(UNIT202_DIRECTIONAL_RULE_AUTHORITY_CLASSES));
    }
  });

  it("clean-plan.ts produces the IDENTICAL list, byte-for-byte, to a bare planEvidenceRequirements(input) call -- proving no pilot-specific post-processing remains", () => {
    const { input } = buildUnit202PlanningInput();
    const bareplan = planEvidenceRequirements(input);
    const cleanplan = buildCleanPlan();
    expect(cleanplan.requirements).toEqual(bareplan.requirements);
    expect(cleanplan.structuralSatisfactions).toEqual(bareplan.structuralSatisfactions);
  });

  it("all three real Unit-202 directional requirements are covered by the widened policy, and no target text/specMode/priority/classification/dimensions changed", () => {
    const plan = buildCleanPlan();
    const found = new Set<string>();
    for (const id of DIRECTIONAL_REQUIREMENT_IDS) {
      const req = plan.requirements.find((r) => r.evidenceRequirementId === id);
      expect(req).toBeDefined();
      const r = req as EvidenceRequirement;
      expect(r.requirementMode).toBe("OPERATIONAL_USE_RULE");
      expect(r.specificationMode).toBe("OPEN_TECHNICAL_QUESTION");
      expect(r.acquisitionPriority).toBe("REQUIRED");
      expect(r.decompositionStatus).toBe("READY");
      expect(new Set(r.requiredCoverageDimensions)).toEqual(new Set(["DIRECTIONAL_MAPPING", "ROLE_MAPPING", "CORRECT_USE_CONDITIONS"]));
      expect(r.requirementText).toBe(EXPECTED_DIRECTIONAL_REQUIREMENT_TEXT[id]);
      found.add(id);
    }
    expect(found.size).toBe(3);
  });

  it("an academic source is declared as ACADEMIC_OR_RESEARCH_INSTITUTION itself -- never relabeled to fit a class it does not belong to", () => {
    expect(UNIT202_DIRECTIONAL_RULE_AUTHORITY_CLASSES).toContain("ACADEMIC_OR_RESEARCH_INSTITUTION");
    expect(UNIT202_DIRECTIONAL_RULE_AUTHORITY_CLASSES).toContain("AUTHORITATIVE_EDUCATIONAL_REFERENCE");
  });

  describe("assertUnit202DirectionalRuleInvariant -- fail-closed on the premise the mode-level widening relies on", () => {
    const validDirectional = () => [
      fixtureKnowledgeTarget({ knowledgeTargetId: "unit202::ACQ-A" }),
      fixtureKnowledgeTarget({ knowledgeTargetId: "unit202::ACQ-B" }),
      fixtureKnowledgeTarget({ knowledgeTargetId: "unit202::ACQ-C" }),
    ];

    it("does not throw for exactly three OPERATIONAL_USE_RULE targets, all with exactly the directional dimension set", () => {
      expect(() => assertUnit202DirectionalRuleInvariant(validDirectional())).not.toThrow();
    });

    it("throws if a fourth OPERATIONAL_USE_RULE target appears (e.g. a future genuine SAFE_USE procedure) with a DIFFERENT dimension set", () => {
      const targets = [...validDirectional(), fixtureKnowledgeTarget({ knowledgeTargetId: "unit202::ACQ-SAFETY", expectedCoverageDimensions: ["SAFE_USE"] })];
      expect(() => assertUnit202DirectionalRuleInvariant(targets)).toThrow(/EXACTLY 3 OPERATIONAL_USE_RULE/);
    });

    it("throws if one of the three existing directional targets is missing (count drops to 2)", () => {
      const targets = validDirectional().slice(0, 2);
      expect(() => assertUnit202DirectionalRuleInvariant(targets)).toThrow(/EXACTLY 3 OPERATIONAL_USE_RULE/);
    });

    it("throws if all three are present but one carries a different dimension set (e.g. SAFE_USE substituted in place of a directional target)", () => {
      const targets = [fixtureKnowledgeTarget({ knowledgeTargetId: "unit202::ACQ-A" }), fixtureKnowledgeTarget({ knowledgeTargetId: "unit202::ACQ-B" }), fixtureKnowledgeTarget({ knowledgeTargetId: "unit202::ACQ-C", expectedCoverageDimensions: ["SAFE_USE"] })];
      expect(() => assertUnit202DirectionalRuleInvariant(targets)).toThrow(/EXACTLY \[DIRECTIONAL_MAPPING, ROLE_MAPPING, CORRECT_USE_CONDITIONS\]/);
    });

    it("throws if a directional target has a SUPERSET of the expected dimensions (an extra dimension added)", () => {
      const targets = [fixtureKnowledgeTarget({ knowledgeTargetId: "unit202::ACQ-A" }), fixtureKnowledgeTarget({ knowledgeTargetId: "unit202::ACQ-B" }), fixtureKnowledgeTarget({ knowledgeTargetId: "unit202::ACQ-C", expectedCoverageDimensions: ["DIRECTIONAL_MAPPING", "ROLE_MAPPING", "CORRECT_USE_CONDITIONS", "SAFE_USE"] })];
      expect(() => assertUnit202DirectionalRuleInvariant(targets)).toThrow(/EXACTLY \[DIRECTIONAL_MAPPING, ROLE_MAPPING, CORRECT_USE_CONDITIONS\]/);
    });

    it("is actually enforced by buildUnit202PlanningInput() against the real frozen Unit-202 target -- does not throw for the real data", () => {
      expect(() => buildUnit202PlanningInput()).not.toThrow();
    });
  });

  it("leaves DEFAULT_SOURCE_AUTHORITY_POLICY structurally unchanged (byte-for-byte-equivalent to its documented shape)", () => {
    expect(DEFAULT_SOURCE_AUTHORITY_POLICY).toEqual({
      allowedAuthorityClassesByMode: {
        EXACT_FACT: ["PRIMARY_NORMATIVE_OR_STANDARDS_BODY", "GOVERNMENT_OR_REGULATOR", "ACADEMIC_OR_RESEARCH_INSTITUTION", "AUTHORITATIVE_TECHNICAL_REFERENCE"],
        FORMULA_OR_RULE: ["PRIMARY_NORMATIVE_OR_STANDARDS_BODY", "ACADEMIC_OR_RESEARCH_INSTITUTION", "AUTHORITATIVE_EDUCATIONAL_REFERENCE", "PROFESSIONAL_BODY"],
        CONCEPT_DEFINITION: ["ACADEMIC_OR_RESEARCH_INSTITUTION", "PROFESSIONAL_BODY", "AUTHORITATIVE_TECHNICAL_REFERENCE", "AUTHORITATIVE_EDUCATIONAL_REFERENCE"],
        RELATIONSHIP: ["ACADEMIC_OR_RESEARCH_INSTITUTION", "PROFESSIONAL_BODY", "AUTHORITATIVE_TECHNICAL_REFERENCE"],
        PROCEDURE_COVERAGE: ["ACADEMIC_OR_RESEARCH_INSTITUTION", "PROFESSIONAL_BODY", "AUTHORITATIVE_TECHNICAL_REFERENCE", "AUTHORITATIVE_EDUCATIONAL_REFERENCE"],
        OPERATING_PRINCIPLE: ["ACADEMIC_OR_RESEARCH_INSTITUTION", "ORIGINAL_MANUFACTURER_OR_VENDOR", "AUTHORITATIVE_TECHNICAL_REFERENCE"],
        OPERATIONAL_USE_RULE: ["GOVERNMENT_OR_REGULATOR", "PROFESSIONAL_BODY", "AUTHORITATIVE_TECHNICAL_REFERENCE", "ORIGINAL_MANUFACTURER_OR_VENDOR"],
        SYMBOL_OR_CONVENTION: ["PRIMARY_NORMATIVE_OR_STANDARDS_BODY", "PROFESSIONAL_BODY", "AUTHORITATIVE_TECHNICAL_REFERENCE"],
        SCHEMATIC_OR_DIAGRAM_RECOGNITION: ["ORIGINAL_MANUFACTURER_OR_VENDOR", "AUTHORITATIVE_TECHNICAL_REFERENCE", "PROFESSIONAL_BODY"],
        APPLICATION_FUNCTION: ["ORIGINAL_MANUFACTURER_OR_VENDOR", "AUTHORITATIVE_TECHNICAL_REFERENCE", "ACADEMIC_OR_RESEARCH_INSTITUTION"],
        TOPIC_BREADTH_COVERAGE: ["ACADEMIC_OR_RESEARCH_INSTITUTION", "AUTHORITATIVE_EDUCATIONAL_REFERENCE", "PROFESSIONAL_BODY"],
      },
    });
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
    // -- it matches exactly what UNIT202_SOURCE_AUTHORITY_POLICY's (identical
    // to DEFAULT_SOURCE_AUTHORITY_POLICY for every other mode) policy produces.
    const untouched = plan.requirements.filter((r) => !DIRECTIONAL_REQUIREMENT_IDS.includes(r.evidenceRequirementId));
    for (const r of untouched) {
      const defaultForMode = DEFAULT_SOURCE_AUTHORITY_POLICY.allowedAuthorityClassesByMode[r.requirementMode];
      if (defaultForMode) expect(new Set(r.sourceAuthorityClasses)).toEqual(new Set(defaultForMode));
    }
  });
});
