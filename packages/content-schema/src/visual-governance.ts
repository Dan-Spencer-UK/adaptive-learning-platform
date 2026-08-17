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
