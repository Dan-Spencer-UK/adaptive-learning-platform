/**
 * CC-13A: tests for the ADR-0005 upstream visual planning/governance
 * additions to ./visual-governance.ts (VisualOpportunityAnalysis,
 * VisualRequirement, ReferenceDossier, VisualFamilyContract,
 * ProductionVisualAsset). Kept as its own file rather than growing
 * visual-governance.test.ts indefinitely, mirroring this repo's existing
 * one-concern-per-test-file discipline.
 */
import { describe, expect, it } from "vitest";
import {
  CURRENT_DESIGN_SYSTEM_VERSION,
  visualOpportunityAnalysisSchema,
  visualRequirementSchema,
  referenceDossierSchema,
  visualFamilyContractSchema,
  productionVisualAssetSchema,
} from "./visual-governance.ts";

describe("visualOpportunityAnalysisSchema", () => {
  it("accepts a candidate analysis with one reviewed concept", () => {
    const result = visualOpportunityAnalysisSchema.safeParse({
      id: "voa.lesson.resistors-parallel.v1",
      lessonId: "lesson.resistors-parallel",
      reviewedConcepts: [
        {
          capabilityId: "cap.resistors_parallel.calculate_total",
          rationale: "Parallel branches are notoriously hard to reason about from formula alone.",
          visualNeed: "REQUIRED",
          candidateVisualRequirementIds: [],
          reinforcementVisualConsidered: true,
        },
      ],
      status: "CANDIDATE",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty reviewedConcepts list -- a blank list is not equivalent to a completed analysis", () => {
    const result = visualOpportunityAnalysisSchema.safeParse({
      id: "voa.lesson.x",
      lessonId: "lesson.x",
      reviewedConcepts: [],
      status: "CANDIDATE",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a reviewed concept naming neither capabilityId nor assertionId", () => {
    const result = visualOpportunityAnalysisSchema.safeParse({
      id: "voa.lesson.x",
      lessonId: "lesson.x",
      reviewedConcepts: [{ rationale: "vague", visualNeed: "OPTIONAL", candidateVisualRequirementIds: [], reinforcementVisualConsidered: false }],
      status: "CANDIDATE",
    });
    expect(result.success).toBe(false);
  });
});

function minimalVisualRequirement(overrides: Partial<Parameters<typeof visualRequirementSchema.parse>[0]> = {}) {
  return {
    assetId: "asset.resistors-parallel.branch-topology",
    familyId: "family.circuit-diagrams",
    unitId: "unit202",
    lessonIds: ["lesson.resistors-parallel"],
    capabilityIds: ["cap.resistors_parallel.calculate_total"],
    assertionIds: [],
    instructionalPurpose: "Show two resistors in parallel with current-divider arrows.",
    needClassification: "REQUIRED",
    productionClass: "DETERMINISTIC_TECHNICAL",
    learnerState: "TEACHING",
    mustShow: ["two parallel branches", "shared node labels"],
    mustNotShow: ["numeric answer values"],
    answerLeakRisk: "NONE",
    variantRequirements: ["TEACHING"],
    referenceDossierIds: [],
    designSystemVersion: CURRENT_DESIGN_SYSTEM_VERSION,
    approval: "CANDIDATE",
    ...overrides,
  };
}

describe("visualRequirementSchema", () => {
  it("accepts a candidate REQUIRED visual with no dossier yet", () => {
    expect(visualRequirementSchema.safeParse(minimalVisualRequirement()).success).toBe(true);
  });

  it("rejects a REQUIRED visual marked PRODUCT_OWNER_APPROVED with no referenceDossierIds", () => {
    const result = visualRequirementSchema.safeParse(minimalVisualRequirement({ approval: "PRODUCT_OWNER_APPROVED" }));
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toMatch(/referenceDossierIds/);
  });

  it("accepts a REQUIRED visual marked PRODUCT_OWNER_APPROVED once it names a dossier", () => {
    const result = visualRequirementSchema.safeParse(
      minimalVisualRequirement({ approval: "PRODUCT_OWNER_APPROVED", referenceDossierIds: ["dossier.resistors-parallel.001"] }),
    );
    expect(result.success).toBe(true);
  });

  it("has no REMEDIATION member in variantRequirements -- ADR-0006 does not require bespoke remediation visual variants for V1", () => {
    const result = visualRequirementSchema.safeParse(minimalVisualRequirement({ variantRequirements: ["REMEDIATION" as never] }));
    expect(result.success).toBe(false);
  });
});

function minimalDossier(overrides: Partial<Parameters<typeof referenceDossierSchema.parse>[0]> = {}) {
  return {
    id: "dossier.resistors-parallel.001",
    assetId: "asset.resistors-parallel.branch-topology",
    reviewedBy: "PROJECT_ARCHITECT",
    status: "CANDIDATE",
    references: [
      {
        referenceId: "ref.001",
        localRef: "reports/instructional-visuals/reference-cache/resistors-parallel-001.png",
        rightsNote: "Internally redrawn technical diagram, no third-party asset embedded.",
        roles: ["TECHNICAL_AUTHORITY"],
        authoritativeFor: ["branch topology"],
        notAuthoritativeFor: ["colour palette"],
      },
    ],
    preserveExactly: ["branch topology"],
    changeDeliberately: ["colour palette to match design system"],
    remove: [],
    add: [],
    neverInfer: ["component values"],
    assessmentStateNotes: ["assessment-safe variant omits labelled values"],
    ...overrides,
  };
}

describe("referenceDossierSchema", () => {
  it("accepts a well-formed candidate dossier", () => {
    expect(referenceDossierSchema.safeParse(minimalDossier()).success).toBe(true);
  });

  it("rejects any reviewedBy value other than the literal PROJECT_ARCHITECT -- mechanical enforcement of ADR-0005's authority boundary", () => {
    const result = referenceDossierSchema.safeParse(minimalDossier({ reviewedBy: "Claude" as never }));
    expect(result.success).toBe(false);
  });

  it("rejects a reference with neither sourceUrl nor localRef", () => {
    const result = referenceDossierSchema.safeParse(
      minimalDossier({
        references: [{ referenceId: "ref.001", rightsNote: "note", roles: ["TECHNICAL_AUTHORITY"], authoritativeFor: [], notAuthoritativeFor: [] }],
      }),
    );
    expect(result.success).toBe(false);
  });
});

describe("visualFamilyContractSchema", () => {
  it("accepts a well-formed family contract bound to the current design-system version", () => {
    const result = visualFamilyContractSchema.safeParse({
      familyId: "family.circuit-diagrams",
      designSystemVersion: CURRENT_DESIGN_SYSTEM_VERSION,
      canvasToken: "VISUAL_CANVAS_LIGHT",
      aspectRatio: "4:3",
      productionClass: "DETERMINISTIC_TECHNICAL",
      sharedReferenceDossierIds: [],
      lineWeightProfile: "technical-diagram-standard",
      semanticColourRoles: ["current-path", "component-outline"],
      labelPolicy: "DETERMINISTIC_OVERLAY",
      requiredVariants: ["TEACHING", "ASSESSMENT_SAFE"],
      familyConsistencyNotes: [],
    });
    expect(result.success).toBe(true);
  });
});

function minimalProductionAsset(overrides: Partial<Parameters<typeof productionVisualAssetSchema.parse>[0]> = {}) {
  return {
    assetId: "asset.resistors-parallel.branch-topology",
    version: 1,
    familyId: "family.circuit-diagrams",
    sourceVisualRequirementId: "asset.resistors-parallel.branch-topology",
    referenceDossierIds: ["dossier.resistors-parallel.001"],
    designSystemVersion: CURRENT_DESIGN_SYSTEM_VERSION,
    learnerState: "TEACHING",
    path: "assets/visuals/unit202/resistors-parallel-branch-topology.svg",
    sha256: "a".repeat(64),
    technicalQa: "PASS",
    pedagogicalQa: "PASS",
    designQa: "PASS",
    productOwnerApproval: "APPROVED",
    eligibility: "PRODUCTION_ELIGIBLE",
    ...overrides,
  };
}

describe("productionVisualAssetSchema", () => {
  it("accepts a fully-qualified PRODUCTION_ELIGIBLE asset", () => {
    expect(productionVisualAssetSchema.safeParse(minimalProductionAsset()).success).toBe(true);
  });

  it("rejects PRODUCTION_ELIGIBLE with a failed QA dimension", () => {
    const result = productionVisualAssetSchema.safeParse(minimalProductionAsset({ designQa: "FAIL" }));
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toMatch(/designQa/);
  });

  it("rejects PRODUCTION_ELIGIBLE with productOwnerApproval still PENDING", () => {
    const result = productionVisualAssetSchema.safeParse(minimalProductionAsset({ productOwnerApproval: "PENDING" }));
    expect(result.success).toBe(false);
  });

  it("rejects PRODUCTION_ELIGIBLE with no referenceDossierIds", () => {
    const result = productionVisualAssetSchema.safeParse(minimalProductionAsset({ referenceDossierIds: [] }));
    expect(result.success).toBe(false);
  });

  it("accepts DEVELOPMENT_ONLY / SUPERSEDED_ARCHIVE assets even with failed QA -- eligibility gating applies only to PRODUCTION_ELIGIBLE", () => {
    expect(productionVisualAssetSchema.safeParse(minimalProductionAsset({ eligibility: "DEVELOPMENT_ONLY", technicalQa: "FAIL" })).success).toBe(true);
    expect(productionVisualAssetSchema.safeParse(minimalProductionAsset({ eligibility: "SUPERSEDED_ARCHIVE", productOwnerApproval: "REJECTED" })).success).toBe(true);
  });
});
