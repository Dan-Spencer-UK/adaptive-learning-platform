import { describe, expect, it } from "vitest";
import {
  visualSemanticContractSchema,
  canonicalVariantSchema,
  blindObservationSchema,
  semanticVerificationSchema,
  humanReviewDecisionSchema,
  mechanicalCheckResultSchema,
  renderManifestSchema,
  type VisualSemanticContract,
} from "./visual-governance.ts";

const validHash = "a".repeat(64);
const validTimestamp = "2026-08-17T12:00:00.000Z";

function minimalValidContract(): VisualSemanticContract {
  return {
    id: "visual-contract.right-hand-grip-rule",
    version: 1,
    diagramBlueprintId: "magnetic.field_conductor_direction",
    teachingIntent: "Teach the right-hand grip rule for the magnetic field around a current-carrying conductor.",
    representationRole: "essential",
    assertionFamilyIds: ["electrical.magnetism_and_electromagnetism"],
    assertionIdentifiers: ["EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001"],
    capabilityIds: ["cap.magnetism.interpret_field_direction"],
    relevantQuestionBlueprintIds: ["magnetism.interpret_field_direction"],
    modeApplicability: ["teaching", "assessment"],
    mustShow: ["recognisable right hand", "thumb", "curled fingers", "conductor"],
    mustNotShow: ["force_arrow_misrepresented_as_field_direction"],
    semanticMappings: [
      { element: "thumb", concept: "conventional_current_direction" },
      { element: "curled_fingers", concept: "magnetic_field_direction" },
    ],
    directionalRelationships: [
      { from: "current_direction", to: "field_rotation", relationship: "determines" },
    ],
    variantExpectations: [],
    invariantExpectations: ["thumb always points along the conductor's current direction"],
    answerDisclosure: [{ element: "field_rotation_arrow", revealedInModes: ["teaching"] }],
    accessibilityExpectations: [{ description: "Direction described in words, not colour alone.", requiresNonColourEncoding: true }],
  };
}

describe("visualSemanticContractSchema", () => {
  it("accepts a minimal valid contract", () => {
    const result = visualSemanticContractSchema.safeParse(minimalValidContract());
    expect(result.success).toBe(true);
  });

  it("rejects a contract with no mustShow elements", () => {
    const contract = { ...minimalValidContract(), mustShow: [] };
    const result = visualSemanticContractSchema.safeParse(contract);
    expect(result.success).toBe(false);
  });

  it("rejects a contract with no assertion family", () => {
    const contract = { ...minimalValidContract(), assertionFamilyIds: [] };
    const result = visualSemanticContractSchema.safeParse(contract);
    expect(result.success).toBe(false);
  });

  it("rejects a contract with no mode applicability", () => {
    const contract = { ...minimalValidContract(), modeApplicability: [] };
    const result = visualSemanticContractSchema.safeParse(contract);
    expect(result.success).toBe(false);
  });

  it("rejects an invalid representationRole", () => {
    const contract = { ...minimalValidContract(), representationRole: "decorative-ish" };
    const result = visualSemanticContractSchema.safeParse(contract);
    expect(result.success).toBe(false);
  });

  it("defaults optional array fields to empty arrays when omitted", () => {
    const contract: Record<string, unknown> = { ...minimalValidContract() };
    delete contract.mustNotShow;
    delete contract.semanticMappings;
    const result = visualSemanticContractSchema.parse(contract);
    expect(result.mustNotShow).toEqual([]);
    expect(result.semanticMappings).toEqual([]);
  });
});

describe("canonicalVariantSchema", () => {
  it("accepts a valid canonical variant", () => {
    const result = canonicalVariantSchema.safeParse({
      variantId: "visual-contract.right-hand-grip-rule@1::current_direction=into_page::teaching",
      contractId: "visual-contract.right-hand-grip-rule",
      contractVersion: 1,
      diagramBlueprintId: "magnetic.field_conductor_direction",
      mode: "teaching",
      parameters: { current_direction: "into_page", show_field_arrows: true },
      labels: ["conductor"],
      seed: 1,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid mode", () => {
    const result = canonicalVariantSchema.safeParse({
      variantId: "x",
      contractId: "x",
      contractVersion: 1,
      diagramBlueprintId: "x",
      mode: "sometimes",
      parameters: {},
      labels: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("blindObservationSchema", () => {
  it("accepts a structured Pass A observation", () => {
    const result = blindObservationSchema.safeParse({
      visibleObjects: ["hand", "conductor"],
      visibleLabels: ["Thumb", "Fingers"],
      arrows: [{ description: "curved arrow around the conductor", approximateDirection: "clockwise" }],
      apparentTopology: "a hand gripping a cylindrical conductor",
      apparentRelationships: ["thumb points along the conductor"],
      rotationSense: "clockwise",
      labelsOverlap: false,
      anyClipping: false,
      arrowsAppearAttachedToLabelledObject: true,
      ambiguityNotes: [],
      legibilityConcerns: [],
    });
    expect(result.success).toBe(true);
  });

  it("rejects free-form prose in place of the structured shape", () => {
    const result = blindObservationSchema.safeParse("the image looks fine to me");
    expect(result.success).toBe(false);
  });

  it("requires the boolean legibility flags", () => {
    const result = blindObservationSchema.safeParse({
      visibleObjects: [],
      visibleLabels: [],
      arrows: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("semanticVerificationSchema", () => {
  function minimalVerification() {
    return {
      status: "pass" as const,
      confidence: "high" as const,
      issues: [],
      possibleLearnerMisunderstanding: false,
      answerLeakage: false,
      requiresHumanReview: false,
      reviewerIdentity: "mock-provider-v1",
      promptVersion: "pass-b.v1",
      schemaVersion: "semantic-verification.v1",
      timestamp: validTimestamp,
      imageHash: validHash,
      contractHash: validHash,
    };
  }

  it("accepts a minimal passing verification", () => {
    expect(semanticVerificationSchema.safeParse(minimalVerification()).success).toBe(true);
  });

  it("rejects a non-hex image hash", () => {
    const result = semanticVerificationSchema.safeParse({ ...minimalVerification(), imageHash: "not-a-hash" });
    expect(result.success).toBe(false);
  });

  it("rejects an uncalibrated numeric confidence value", () => {
    const result = semanticVerificationSchema.safeParse({ ...minimalVerification(), confidence: 0.87 });
    expect(result.success).toBe(false);
  });

  it("accepts a fail status with issues", () => {
    const result = semanticVerificationSchema.safeParse({
      ...minimalVerification(),
      status: "fail",
      requiresHumanReview: true,
      issues: [
        {
          code: "incorrect_direction",
          severity: "high",
          expected: "arrowhead collinear with the wire",
          observed: "arrowhead perpendicular to the wire",
          explanation: "The current-direction arrow points across the wire, not along it.",
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects an issue with an unknown taxonomy code", () => {
    const result = semanticVerificationSchema.safeParse({
      ...minimalVerification(),
      status: "fail",
      issues: [
        {
          code: "looks_kind_of_off",
          severity: "high",
          expected: "x",
          observed: "y",
          explanation: "z",
        },
      ],
    });
    expect(result.success).toBe(false);
  });
});

describe("humanReviewDecisionSchema", () => {
  it("accepts an approved decision", () => {
    const result = humanReviewDecisionSchema.safeParse({
      variantId: "visual-contract.right-hand-grip-rule@1::current_direction=into_page::teaching",
      status: "approved",
      reviewer: "product-owner",
      timestamp: validTimestamp,
      imageHash: validHash,
      contractHash: validHash,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown status", () => {
    const result = humanReviewDecisionSchema.safeParse({
      variantId: "x",
      status: "looks_fine_probably",
      reviewer: "x",
      timestamp: validTimestamp,
      imageHash: validHash,
      contractHash: validHash,
    });
    expect(result.success).toBe(false);
  });
});

describe("renderManifestSchema", () => {
  it("accepts a valid manifest with one artefact", () => {
    const result = renderManifestSchema.safeParse({
      generatedAt: validTimestamp,
      contentRelease: "release-2026-08",
      artifacts: [
        {
          variantId: "visual-contract.right-hand-grip-rule@1::current_direction=into_page::teaching",
          contractId: "visual-contract.right-hand-grip-rule",
          diagramBlueprintId: "magnetic.field_conductor_direction",
          mode: "teaching",
          svgRelativePath: "renders/visual-contract.right-hand-grip-rule@1__into_page__teaching.svg",
          imageHash: validHash,
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects an artefact with a non-hex image hash", () => {
    const result = renderManifestSchema.safeParse({
      generatedAt: validTimestamp,
      contentRelease: "release-2026-08",
      artifacts: [
        {
          variantId: "x",
          contractId: "x",
          diagramBlueprintId: "x",
          mode: "teaching",
          svgRelativePath: "renders/x.svg",
          imageHash: "not-a-hash",
        },
      ],
    });
    expect(result.success).toBe(false);
  });
});

describe("mechanicalCheckResultSchema", () => {
  it("accepts a passing result with no failures", () => {
    const result = mechanicalCheckResultSchema.safeParse({ variantId: "x", passed: true });
    expect(result.success).toBe(true);
  });

  it("accepts a failing result with failure reasons", () => {
    const result = mechanicalCheckResultSchema.safeParse({
      variantId: "x",
      passed: false,
      failures: ["arrowhead not collinear with wire"],
    });
    expect(result.success).toBe(true);
  });
});
