/**
 * CC-05D: governance/QA layer for instructional visuals, sitting beside
 * (never inside) CC-05A's pedagogical schema (./pedagogy.ts). Design
 * authority: docs/architecture/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-
 * AND-SEMANTIC-QA.md.
 *
 * `DiagramBlueprint` (pedagogy.ts) is a rendering *parameter* contract --
 * what values a diagram accepts. `VisualSemanticContract` here is a
 * teaching *meaning* contract -- what the rendered result must actually
 * show for it to teach its named concept correctly. Keeping these
 * separate means this file never modifies the already-approved CC-05A
 * schema or corpus.
 *
 * Every enum/field here is deliberately domain-agnostic (no field
 * mentions electricity, hands, or circuits) so a future qualification's
 * plumbing/anatomy/process diagrams govern through the identical shape.
 */

import { z } from "zod";
import { representationRoleSchema } from "./pedagogy.ts";

const stableId = z.string().min(1);
const sha256Hex = z.string().regex(/^[0-9a-f]{64}$/, "expected a lowercase hex SHA-256 digest");
const isoTimestamp = z.string().datetime();

// ---------------------------------------------------------------------
// Visual semantic contract
// ---------------------------------------------------------------------

export const visualModeSchema = z.enum(["teaching", "assessment", "both"]);
export type VisualMode = z.infer<typeof visualModeSchema>;

export const semanticMappingSchema = z.object({
  element: z.string().min(1),
  concept: z.string().min(1),
});

export const directionalRelationshipSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  relationship: z.string().min(1),
});

export const variantExpectationSchema = z.object({
  parameter: z.string().min(1),
  value: z.union([z.string(), z.number(), z.boolean()]),
  expectation: z.string().min(1),
});

export const answerDisclosureRuleSchema = z.object({
  element: z.string().min(1),
  revealedInModes: z.array(visualModeSchema).min(1),
});

export const accessibilityExpectationSchema = z.object({
  description: z.string().min(1),
  requiresNonColourEncoding: z.boolean().default(true),
});

/**
 * CC-11.3: which graphical-symbol convention a schematic-symbol visual
 * uses. Only present when the diagram actually draws standardised
 * component symbols (never on circuit-topology/field/waveform
 * contracts, which have no symbol-convention choice to record). Closed
 * enum, one member today (`UK_IEC` = BS EN 60617 / IEC 60617, the
 * convention appropriate for a UK electrical-installation
 * qualification) -- extend only if a future qualification genuinely
 * needs a different convention (e.g. `US_ANSI`), never speculatively.
 */
export const symbolStandardSchema = z.enum(["UK_IEC"]);
export type SymbolStandard = z.infer<typeof symbolStandardSchema>;

export const visualSemanticContractSchema = z.object({
  id: stableId,
  version: z.number().int().min(1),
  diagramBlueprintId: stableId,
  teachingIntent: z.string().min(1),
  representationRole: representationRoleSchema,
  assertionFamilyIds: z.array(stableId).min(1),
  assertionIdentifiers: z.array(stableId).default([]),
  capabilityIds: z.array(stableId).default([]),
  relevantQuestionBlueprintIds: z.array(stableId).default([]),
  modeApplicability: z.array(visualModeSchema).min(1),
  mustShow: z.array(z.string().min(1)).min(1),
  mustNotShow: z.array(z.string().min(1)).default([]),
  semanticMappings: z.array(semanticMappingSchema).default([]),
  directionalRelationships: z.array(directionalRelationshipSchema).default([]),
  variantExpectations: z.array(variantExpectationSchema).default([]),
  invariantExpectations: z.array(z.string().min(1)).default([]),
  answerDisclosure: z.array(answerDisclosureRuleSchema).default([]),
  accessibilityExpectations: z.array(accessibilityExpectationSchema).default([]),
  knownAmbiguity: z.string().optional(),
  symbolStandard: symbolStandardSchema.optional(),
});

export type VisualSemanticContract = z.infer<typeof visualSemanticContractSchema>;

// ---------------------------------------------------------------------
// Canonical variant identity
// ---------------------------------------------------------------------

export const canonicalVariantSchema = z.object({
  variantId: stableId,
  contractId: stableId,
  contractVersion: z.number().int().min(1),
  diagramBlueprintId: stableId,
  mode: visualModeSchema,
  /** The real `DiagramInstance.parameters` shape -- what the engine would actually generate. */
  parameters: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  labels: z.array(z.string()),
  /**
   * The separate, optional "reveal" prop (e.g. `fieldRotation`/`forceDirection`)
   * some diagram components accept -- structurally distinct from `parameters`
   * because it is never part of the engine-generated DiagramInstance; it is
   * supplied only by the calling screen in teaching mode. An assessment-mode
   * variant must never carry a non-empty revealProps -- that is the whole
   * mechanical answer-leakage check (§14/§22A of the CC-05D task brief).
   */
  revealProps: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).default({}),
  seed: z.number().int().optional(),
});

export type CanonicalVariant = z.infer<typeof canonicalVariantSchema>;

// ---------------------------------------------------------------------
// Render-capture manifest (produced by apps/mobile's Jest-based render
// capture, consumed by scripts/visual-governance's mechanical/semantic/
// report tooling -- the shared, package-boundary-respecting contract
// between the two, per the CC-05D architecture doc §D/§T).
// ---------------------------------------------------------------------

export const renderedArtifactSchema = z.object({
  variantId: stableId,
  contractId: stableId,
  diagramBlueprintId: stableId,
  mode: visualModeSchema,
  svgRelativePath: z.string().min(1),
  imageHash: sha256Hex,
});

export type RenderedArtifact = z.infer<typeof renderedArtifactSchema>;

export const renderManifestSchema = z.object({
  generatedAt: isoTimestamp,
  contentRelease: z.string().min(1),
  artifacts: z.array(renderedArtifactSchema),
});

export type RenderManifest = z.infer<typeof renderManifestSchema>;

// ---------------------------------------------------------------------
// Semantic issue taxonomy
// ---------------------------------------------------------------------

export const semanticIssueCategorySchema = z.enum([
  "missing_required_element",
  "incorrect_element",
  "incorrect_direction",
  "incorrect_topology",
  "incorrect_semantic_mapping",
  "misleading_visual",
  "label_collision",
  "clipping",
  "ambiguous_direction",
  "ambiguous_relationship",
  "answer_leakage",
  "inaccessible_semantics",
  "contradiction_with_assertion",
  "contradiction_with_capability",
  "wrong_teaching_aid",
  "unexpected_element",
  "illegible",
  "unsupported_visual_type",
  "reviewer_uncertain",
]);

export const semanticIssueSeveritySchema = z.enum(["low", "medium", "high", "critical"]);

export const semanticIssueSchema = z.object({
  code: semanticIssueCategorySchema,
  severity: semanticIssueSeveritySchema,
  expected: z.string().min(1),
  observed: z.string().min(1),
  explanation: z.string().min(1),
});

export type SemanticIssue = z.infer<typeof semanticIssueSchema>;

// ---------------------------------------------------------------------
// Two-pass semantic review
// ---------------------------------------------------------------------

/** Pass A -- blind observation. No access to the contract's expected semantics. */
export const blindObservationSchema = z.object({
  visibleObjects: z.array(z.string()),
  visibleLabels: z.array(z.string()),
  arrows: z.array(
    z.object({
      description: z.string().min(1),
      approximateDirection: z.string().optional(),
    }),
  ),
  apparentTopology: z.string().optional(),
  apparentRelationships: z.array(z.string()).default([]),
  rotationSense: z.enum(["clockwise", "counterclockwise", "not_applicable", "indeterminate"]).default("not_applicable"),
  labelsOverlap: z.boolean(),
  anyClipping: z.boolean(),
  arrowsAppearAttachedToLabelledObject: z.boolean(),
  ambiguityNotes: z.array(z.string()).default([]),
  legibilityConcerns: z.array(z.string()).default([]),
});

export type BlindObservation = z.infer<typeof blindObservationSchema>;

export const semanticConfidenceSchema = z.enum(["high", "medium", "low"]);
export const semanticStatusSchema = z.enum(["pass", "warn", "fail"]);

/** Pass B -- semantic verification against the governed VisualSemanticContract. */
export const semanticVerificationSchema = z.object({
  status: semanticStatusSchema,
  confidence: semanticConfidenceSchema,
  issues: z.array(semanticIssueSchema),
  possibleLearnerMisunderstanding: z.boolean(),
  answerLeakage: z.boolean(),
  requiresHumanReview: z.boolean(),
  reviewerIdentity: z.string().min(1),
  promptVersion: z.string().min(1),
  schemaVersion: z.string().min(1),
  timestamp: isoTimestamp,
  imageHash: sha256Hex,
  contractHash: sha256Hex,
});

export type SemanticVerification = z.infer<typeof semanticVerificationSchema>;

/** One complete two-pass audit record for one canonical variant. */
export const semanticAuditRecordSchema = z.object({
  variantId: stableId,
  observation: blindObservationSchema,
  verification: semanticVerificationSchema,
  cacheHit: z.boolean(),
});

export type SemanticAuditRecord = z.infer<typeof semanticAuditRecordSchema>;

// ---------------------------------------------------------------------
// Human review
// ---------------------------------------------------------------------

export const humanReviewStatusSchema = z.enum([
  "not_required",
  "required",
  "approved",
  "rejected",
  "approved_with_note",
]);

export const humanReviewDecisionSchema = z.object({
  variantId: stableId,
  status: humanReviewStatusSchema,
  reviewer: z.string().min(1),
  timestamp: isoTimestamp,
  reason: z.string().optional(),
  imageHash: sha256Hex,
  contractHash: sha256Hex,
});

export type HumanReviewDecision = z.infer<typeof humanReviewDecisionSchema>;

// ---------------------------------------------------------------------
// Mechanical QA
// ---------------------------------------------------------------------

export const mechanicalCheckResultSchema = z.object({
  variantId: stableId,
  passed: z.boolean(),
  failures: z.array(z.string()).default([]),
});

export type MechanicalCheckResult = z.infer<typeof mechanicalCheckResultSchema>;

// =======================================================================
// ADR-0005 / CC-13A: upstream visual PLANNING and GOVERNANCE layer.
//
// Everything above this line governs QA/semantic review of a visual that
// has ALREADY been produced (`VisualSemanticContract`, `CanonicalVariant`,
// two-pass review). ADR-0005's whole point is that visual need is planned
// and reference-governed BEFORE production, not repaired after lesson
// authoring -- the real Unit 202 finding this reconstructs: "entire
// conceptual/component lessons with little or no meaningful imagery"
// discovered only at runtime review. The schemas below are that upstream
// layer, deliberately additive/parallel rather than a rewrite:
//
//   VisualOpportunityAnalysis  -- per-lesson "was every concept reviewed
//                                 for visual need" record (CC-13A brief).
//   VisualRequirement          -- one Visual Requirement Register (VRR)
//                                 entry: a planned, classified visual need.
//   ReferenceDossier           -- the independent Project-Architect-
//                                 reviewed technical-reference package a
//                                 REQUIRED visual needs before production
//                                 (never Claude-authored/approved -- see
//                                 `reviewedBy` below, a fixed literal type,
//                                 not a free-form string).
//   VisualFamilyContract       -- shared production parameters for a
//                                 visual family, bound to a design-system
//                                 version (docs/design/ALP-PRODUCT-WIDE-
//                                 VISUAL-DESIGN-SYSTEM.md §17.1).
//   ProductionVisualAsset      -- runtime resolution eligibility for a
//                                 produced asset (PRODUCTION_ELIGIBLE /
//                                 DEVELOPMENT_ONLY / SUPERSEDED_ARCHIVE).
//
// Design authority: docs/architecture/LEARNING-PACKAGE-GOVERNANCE-
// CONTRACTS.md §4-§7/§13, docs/architecture/INSTRUCTIONAL-VISUAL-
// PLANNING-REFERENCE-AND-PRODUCTION-ARCHITECTURE.md,
// docs/governance/VISUAL-REFERENCE-REVIEW-PROTOCOL.md.
// =======================================================================

/** docs/design/ALP-PRODUCT-WIDE-VISUAL-DESIGN-SYSTEM.md §17.1's own declared identity -- the single source of truth this schema binds against. Update both together. */
export const CURRENT_DESIGN_SYSTEM_VERSION = "ALP-VDS-2026-08-29" as const;

// ---------------------------------------------------------------------
// Visual opportunity analysis (LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md §4)
// ---------------------------------------------------------------------

export const visualNeedClassificationSchema = z.enum(["REQUIRED", "USEFUL", "OPTIONAL", "NOT_REQUIRED"]);
export type VisualNeedClassification = z.infer<typeof visualNeedClassificationSchema>;

export const visualOpportunityReviewedConceptSchema = z
  .object({
    capabilityId: stableId.optional(),
    assertionId: stableId.optional(),
    rationale: z.string().min(1),
    visualNeed: visualNeedClassificationSchema,
    proposedRole: z.string().min(1).optional(),
    candidateVisualRequirementIds: z.array(stableId).default([]),
    reinforcementVisualConsidered: z.boolean(),
  })
  .superRefine((concept, ctx) => {
    if (!concept.capabilityId && !concept.assertionId) {
      ctx.addIssue({
        code: "custom",
        path: ["capabilityId"],
        message: "a reviewed concept must reference at least one of capabilityId/assertionId -- a visual-opportunity entry with no governed target is not a real review",
      });
    }
  });
export type VisualOpportunityReviewedConcept = z.infer<typeof visualOpportunityReviewedConceptSchema>;

export const visualOpportunityAnalysisStatusSchema = z.enum(["CANDIDATE", "PROJECT_ARCHITECT_REVIEWED", "APPROVED"]);

/**
 * `reviewedConcepts.min(1)` is deliberate: "a blank list is not equivalent
 * to a completed analysis" (LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md §4).
 * An empty analysis cannot even be constructed as CANDIDATE.
 */
export const visualOpportunityAnalysisSchema = z.object({
  id: stableId,
  lessonId: stableId,
  reviewedConcepts: z.array(visualOpportunityReviewedConceptSchema).min(1),
  textOnlyJustification: z.string().min(1).optional(),
  status: visualOpportunityAnalysisStatusSchema,
});
export type VisualOpportunityAnalysis = z.infer<typeof visualOpportunityAnalysisSchema>;

// ---------------------------------------------------------------------
// Visual Requirement Register (VRR) entry (LEARNING-PACKAGE-GOVERNANCE-
// CONTRACTS.md §5)
// ---------------------------------------------------------------------

export const visualProductionClassSchema = z.enum([
  "DETERMINISTIC_TECHNICAL",
  "ORIGINAL_REDRAW_FROM_REFERENCE",
  "HYBRID_REDRAW_PLUS_DETERMINISTIC_OVERLAY",
  "GENERATIVE_CONCEPTUAL",
  "PHYSICAL_RECOGNITION",
  "STANDARD_SYMBOL",
]);
export type VisualProductionClass = z.infer<typeof visualProductionClassSchema>;

export const visualLearnerStateSchema = z.enum(["TEACHING", "FORMATIVE", "ASSESSMENT", "FEEDBACK", "SHARED"]);
export type VisualLearnerState = z.infer<typeof visualLearnerStateSchema>;

export const visualAnswerLeakRiskSchema = z.enum(["NONE", "LOW", "MEDIUM", "HIGH"]);
export type VisualAnswerLeakRisk = z.infer<typeof visualAnswerLeakRiskSchema>;

export const visualVariantRequirementSchema = z.enum(["TEACHING", "ASSESSMENT_SAFE", "FEEDBACK", "PHYSICAL", "SYMBOL"]);

export const visualApprovalStateSchema = z.enum(["CANDIDATE", "PROJECT_ARCHITECT_REVIEWED", "PRODUCT_OWNER_APPROVED"]);
export type VisualApprovalState = z.infer<typeof visualApprovalStateSchema>;

/**
 * ADR-0006: "V1 does not require bespoke REMEDIATION visual variants
 * merely because an adaptive misconception path could exist later" --
 * `variantRequirements` deliberately has no `"REMEDIATION"` member; a
 * requirement's variants are scoped to what the V1 canonical route and
 * dedicated formative/mock assessment actually need.
 */
export const visualRequirementSchema = z
  .object({
    assetId: stableId,
    familyId: stableId,
    unitId: stableId,
    lessonIds: z.array(stableId).min(1),
    capabilityIds: z.array(stableId).default([]),
    assertionIds: z.array(stableId).default([]),
    instructionalPurpose: z.string().min(1),
    needClassification: visualNeedClassificationSchema,
    productionClass: visualProductionClassSchema,
    learnerState: visualLearnerStateSchema,
    mustShow: z.array(z.string().min(1)).min(1),
    mustNotShow: z.array(z.string().min(1)).default([]),
    answerLeakRisk: visualAnswerLeakRiskSchema,
    variantRequirements: z.array(visualVariantRequirementSchema).default([]),
    referenceDossierIds: z.array(stableId).default([]),
    designSystemVersion: stableId,
    approval: visualApprovalStateSchema,
  })
  .superRefine((requirement, ctx) => {
    // "REQUIRED visuals resolve or block" / "generated assets without an
    // approved dossier = failure": a REQUIRED visual cannot itself reach
    // PRODUCT_OWNER_APPROVED without at least one referenced dossier --
    // full "that dossier is actually APPROVED" cross-checking happens in
    // scripts/content/validate-v1-learning-package.ts (needs the sibling
    // ReferenceDossier objects, which this single-object schema cannot see).
    if (requirement.needClassification === "REQUIRED" && requirement.approval === "PRODUCT_OWNER_APPROVED" && requirement.referenceDossierIds.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["referenceDossierIds"],
        message: `visual requirement ${requirement.assetId} is REQUIRED and marked PRODUCT_OWNER_APPROVED but names no referenceDossierIds -- a required visual cannot be approved for production without an approved Reference Dossier (ADR-0005)`,
      });
    }
  });
export type VisualRequirement = z.infer<typeof visualRequirementSchema>;

// ---------------------------------------------------------------------
// Reference dossier (LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md §6)
// ---------------------------------------------------------------------

export const referenceRoleSchema = z.enum([
  "TECHNICAL_AUTHORITY",
  "SYMBOL_AUTHORITY",
  "PHYSICAL_APPEARANCE_REFERENCE",
  "LAYOUT_REFERENCE",
  "STYLE_INSPIRATION",
  "PEDAGOGICAL_REFERENCE",
]);
export type ReferenceRole = z.infer<typeof referenceRoleSchema>;

export const dossierReferenceEntrySchema = z
  .object({
    referenceId: stableId,
    sourceUrl: z.string().min(1).optional(),
    localRef: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    rightsNote: z.string().min(1),
    roles: z.array(referenceRoleSchema).min(1),
    authoritativeFor: z.array(z.string().min(1)).default([]),
    notAuthoritativeFor: z.array(z.string().min(1)).default([]),
  })
  .superRefine((entry, ctx) => {
    if (!entry.sourceUrl && !entry.localRef) {
      ctx.addIssue({
        code: "custom",
        path: ["sourceUrl"],
        message: `reference ${entry.referenceId} names neither sourceUrl nor localRef -- a reference must be traceable to something, never asserted with no locatable origin`,
      });
    }
  });
export type DossierReferenceEntry = z.infer<typeof dossierReferenceEntrySchema>;

export const referenceDossierStatusSchema = z.enum(["CANDIDATE", "APPROVED", "REJECTED"]);
export type ReferenceDossierStatus = z.infer<typeof referenceDossierStatusSchema>;

/**
 * `reviewedBy` is a fixed literal, not a free-form string -- this is the
 * mechanical half of ADR-0005's authority boundary ("Claude may extract
 * visual needs and orchestrate production but may not independently
 * select technical references"): no code path can construct a dossier
 * object claiming any reviewer identity other than "PROJECT_ARCHITECT".
 * Automated/candidate discovery produces `VisualRequirement.referenceDossierIds`
 * pointing at dossiers that do not yet exist, or exist only with
 * `status: "CANDIDATE"` -- never a dossier this type will accept as
 * reviewed. `status: "APPROVED"` is a claim only a real Project-Architect
 * handoff record justifies; nothing in this schema fabricates that
 * authority, it only makes misattributing it structurally impossible.
 */
export const referenceDossierSchema = z.object({
  id: stableId,
  assetId: stableId,
  reviewedBy: z.literal("PROJECT_ARCHITECT"),
  status: referenceDossierStatusSchema,
  references: z.array(dossierReferenceEntrySchema).min(1),
  preserveExactly: z.array(z.string().min(1)).default([]),
  changeDeliberately: z.array(z.string().min(1)).default([]),
  remove: z.array(z.string().min(1)).default([]),
  add: z.array(z.string().min(1)).default([]),
  neverInfer: z.array(z.string().min(1)).default([]),
  assessmentStateNotes: z.array(z.string().min(1)).default([]),
});
export type ReferenceDossier = z.infer<typeof referenceDossierSchema>;

// ---------------------------------------------------------------------
// Visual family contract (LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md §7)
// ---------------------------------------------------------------------

export const visualFamilyLabelPolicySchema = z.enum(["DETERMINISTIC_OVERLAY", "BAKED_EXCEPTION", "NONE"]);

export const visualFamilyContractSchema = z.object({
  familyId: stableId,
  designSystemVersion: stableId,
  canvasToken: z.string().min(1),
  aspectRatio: z.string().min(1),
  productionClass: visualProductionClassSchema,
  sharedReferenceDossierIds: z.array(stableId).default([]),
  lineWeightProfile: z.string().min(1),
  semanticColourRoles: z.array(z.string().min(1)).default([]),
  labelPolicy: visualFamilyLabelPolicySchema,
  requiredVariants: z.array(z.string().min(1)).default([]),
  familyConsistencyNotes: z.array(z.string().min(1)).default([]),
});
export type VisualFamilyContract = z.infer<typeof visualFamilyContractSchema>;

// ---------------------------------------------------------------------
// Production asset eligibility (LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md §13)
// ---------------------------------------------------------------------

export const productionAssetEligibilitySchema = z.enum(["PRODUCTION_ELIGIBLE", "DEVELOPMENT_ONLY", "SUPERSEDED_ARCHIVE"]);
export type ProductionAssetEligibility = z.infer<typeof productionAssetEligibilitySchema>;

export const productOwnerApprovalStateSchema = z.enum(["APPROVED", "PENDING", "REJECTED"]);
export const qaResultSchema = z.enum(["PASS", "FAIL"]);

/**
 * "Runtime must resolve only PRODUCTION_ELIGIBLE assets for released
 * content, unless a clearly governed development build flag is active"
 * (LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md §13) is enforced here as a
 * structural impossibility, not a convention: an asset cannot be
 * PRODUCTION_ELIGIBLE unless every QA dimension PASSed, Product Owner
 * approval is APPROVED, and it carries at least one reference dossier.
 */
export const productionVisualAssetSchema = z
  .object({
    assetId: stableId,
    version: z.number().int().min(1),
    familyId: stableId,
    sourceVisualRequirementId: stableId,
    referenceDossierIds: z.array(stableId).default([]),
    designSystemVersion: stableId,
    learnerState: visualLearnerStateSchema,
    path: z.string().min(1),
    sha256: sha256Hex,
    technicalQa: qaResultSchema,
    pedagogicalQa: qaResultSchema,
    designQa: qaResultSchema,
    productOwnerApproval: productOwnerApprovalStateSchema,
    eligibility: productionAssetEligibilitySchema,
  })
  .superRefine((asset, ctx) => {
    if (asset.eligibility !== "PRODUCTION_ELIGIBLE") return;
    const failures: string[] = [];
    if (asset.technicalQa !== "PASS") failures.push("technicalQa");
    if (asset.pedagogicalQa !== "PASS") failures.push("pedagogicalQa");
    if (asset.designQa !== "PASS") failures.push("designQa");
    if (asset.productOwnerApproval !== "APPROVED") failures.push("productOwnerApproval");
    if (asset.referenceDossierIds.length === 0) failures.push("referenceDossierIds");
    if (failures.length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["eligibility"],
        message: `production asset ${asset.assetId} is marked PRODUCTION_ELIGIBLE but fails: ${failures.join(", ")} -- eligibility requires all QA dimensions PASS, Product Owner approval APPROVED, and at least one reference dossier`,
      });
    }
  });
export type ProductionVisualAsset = z.infer<typeof productionVisualAssetSchema>;
