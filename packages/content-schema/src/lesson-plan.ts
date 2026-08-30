/**
 * Governed Lesson Plan / Lesson Step content model -- the orchestration
 * layer ARCH-003 describes, sitting above (never duplicating) the CC-05
 * pedagogical chain this package already governs (./pedagogy.ts):
 *
 *   Source -> Atomic Assertion -> Assertion Family -> Capability/Evidence
 *   Target -> Teaching Representation -> Question Blueprint ->
 *   Deterministic Variant -> Evidence
 *
 * Design authority: docs/architecture/LESSON-PLAYER-AND-LESSON-PLAN-
 * ARCHITECTURE.md (ARCH-003, approved) §5 ("A future implementation
 * package must define the exact Zod/TypeScript shape of these; this
 * document fixes only the capability surface they must cover") and §13
 * ("Lesson Plan ... references governed content ... it does not
 * duplicate factual/pedagogical truth into itself. A Lesson Step's
 * 'teaches assertion X' field is a reference, never a restatement.").
 *
 * This module governs the CANONICAL lesson plan only -- the pedagogically
 * valid instructional design as authored/approved content. It does not
 * implement the learner-specific adaptive assembler (ARCH-003 §6) or any
 * runtime/player behaviour; those are later packages. Every reference
 * field here is a stable id into the real governed corpus
 * (`AssertionFamily`/`Capability`/`QuestionBlueprint`/etc. in
 * ./pedagogy.ts, or a raw assertion/misconception identifier in
 * ./knowledge-graph.ts) -- cross-corpus existence of those ids is
 * verified by scripts/content/validate-lesson-plan.ts (the same
 * "schema validates internal shape, a separate script recomputes
 * cross-reference integrity against the live corpus" split
 * ./pedagogy.ts and scripts/content/validate-pedagogy.ts already use),
 * not by this file, which must stay corpus-independent.
 *
 * Every field earns its place against a concrete architectural
 * requirement in ARCH-003 -- this is deliberately not a giant
 * speculative schema (task brief §4).
 *
 * CC-13A / ADR-0006 addendum: this module already models everything a V1
 * canonical lesson route needs -- `requirement: "required"` steps ARE the
 * V1 canonical route (they always execute, regardless of learner mastery/
 * evidence/prerequisite state); `conditional_skip_if_mastered`/
 * `conditional_remediation_only` steps and `branchRoutes` remain valid,
 * implemented, RETAINED platform capability (consumed by
 * @alp/learning-engine's assembler.ts/branching.ts and
 * @alp/diagnostic-engine) -- post-V1 direction, not deleted, but not part
 * of a `CANONICAL_FIXED_ROUTE` lesson's V1 route. `v1LessonRoutePolicySchema`
 * and the `routePolicy` field below let a lesson opt into that V1
 * invariant explicitly and mechanically (enforced in
 * `lessonPlanSchema`'s `superRefine`), rather than by convention.
 */

import { z } from "zod";
import { difficultyBandSchema, misconceptionMappingManifestSchema } from "./pedagogy.ts";

const stableId = z.string().min(1);

// ---------------------------------------------------------------------
// Presentation mode (ARCH-003 §9/§15: Learn vs. Review/Reference)
// ---------------------------------------------------------------------

export const presentationModeSchema = z.enum(["learn", "review"]);
export type PresentationMode = z.infer<typeof presentationModeSchema>;

// ---------------------------------------------------------------------
// Lesson step type -- expresses PEDAGOGICAL FUNCTION, never a UI
// component (ARCH-003 task brief §6: "good: worked_example / bad:
// blue_card_with_button" -- the eventual player chooses presentation).
// ---------------------------------------------------------------------

export const lessonStepTypeSchema = z.enum([
  "orientation",
  "concept_explanation",
  "visual_explanation",
  "worked_example",
  "guided_interaction",
  "independent_question",
  "misconception_discrimination",
  "retrieval_check",
  "remediation",
  "transfer_application",
  "recap",
  "exit_completion",
]);
export type LessonStepType = z.infer<typeof lessonStepTypeSchema>;

/** Whether a step is always taken, or only reachable via an explicit branch route (task brief §5's "required vs conditionally skippable status"). */
export const stepRequirementSchema = z.enum([
  "required",
  "conditional_skip_if_mastered",
  "conditional_remediation_only",
]);
export type StepRequirement = z.infer<typeof stepRequirementSchema>;

// ---------------------------------------------------------------------
// ADR-0006 / CC-13A: V1 lesson-route policy. A `LessonPlan` that declares
// `routePolicy: "CANONICAL_FIXED_ROUTE"` (below, on `lessonPlanSchema`) is
// asserting the ADR-0006 V1 contract: the ordered `required` step sequence
// never changes for learner mastery/evidence/prerequisite reasons. This is
// intentionally the ONLY value today -- richer post-V1 route policies
// (e.g. a future mastery-adaptive route) are not modelled speculatively
// (task brief §4's "every field earns its place" discipline extends to
// this enum).
// ---------------------------------------------------------------------

export const v1LessonRoutePolicySchema = z.literal("CANONICAL_FIXED_ROUTE");
export type V1LessonRoutePolicy = z.infer<typeof v1LessonRoutePolicySchema>;

/**
 * Classifies each `LessonStepType` against ADR-0006's V1 boundary --
 * `V1_ORDINARY` roles are legitimate content in a `CANONICAL_FIXED_ROUTE`
 * lesson's fixed route; `POST_V1_ADAPTIVE` roles exist to serve
 * `conditional_skip_if_mastered`/`conditional_remediation_only`/branch-
 * route machinery (retained platform capability, not deleted) and must
 * not appear as `required` steps inside a `CANONICAL_FIXED_ROUTE` lesson.
 * A lookup table, not a second enum, so the single `lessonStepTypeSchema`
 * above remains the one source of truth for valid step types.
 */
export const POST_V1_ADAPTIVE_STEP_TYPES: ReadonlySet<LessonStepType> = new Set([
  "misconception_discrimination",
  "remediation",
  "transfer_application",
]);

export function classifyV1StepRole(type: LessonStepType): "V1_ORDINARY" | "POST_V1_ADAPTIVE" {
  return POST_V1_ADAPTIVE_STEP_TYPES.has(type) ? "POST_V1_ADAPTIVE" : "V1_ORDINARY";
}

// ---------------------------------------------------------------------
// Governed-content references a step may carry. Every field is a stable
// id into an existing governed type (./pedagogy.ts) -- never inline
// content. All optional: a given step only references what it needs.
// ---------------------------------------------------------------------

/**
 * Shared shape for a pure TEACHING diagram instance's explicit parameter
 * overrides -- used both by the legacy `representation.diagramParameters`
 * field below and by a `contentBlocks` diagram-visual block's own
 * `source.diagramParameters` (CC-13C.2B), so the two paths reuse exactly
 * one parameter shape rather than defining it twice.
 */
const diagramParametersSchema = z.record(z.string().min(1), z.union([z.string(), z.number(), z.boolean()]));

export const stepRepresentationRefsSchema = z.object({
  formulaFamilyId: stableId.optional(),
  diagramBlueprintId: stableId.optional(),
  workedExampleBlueprintId: stableId.optional(),
  visualAidBlueprintId: stableId.optional(),
  /**
   * CC-11.3: explicit parameter overrides for a pure TEACHING diagram
   * instance (no generated question instance driving it) -- e.g.
   * `{ component_type: "capacitor" }` so a step referencing the shared,
   * multi-component `electronics.component_symbol_card` blueprint shows
   * the right one, rather than `buildTeachingDiagramInstance`'s generic
   * first-declared-enum-value default (which would show every such step
   * identically). Only meaningful for teaching-only diagram instances;
   * a step whose diagram instead comes from a real generated question
   * (see `LessonStepView.tsx`) always uses that instance's own
   * engine-computed parameters instead, exactly as before -- this field
   * is never consulted in that case.
   */
  diagramParameters: diagramParametersSchema.optional(),
});
export type StepRepresentationRefs = z.infer<typeof stepRepresentationRefsSchema>;

// ---------------------------------------------------------------------
// CC-13C.2B (Remediation Package 2 -- LESSON-DEPTH-AND-FRAGMENTATION-
// REGISTER.md §3's confirmed P0 finding, implementing the Project
// Architect's corrected design over the CC-13C.2A reconnaissance):
// governed, ordered, structured rich teaching content blocks a
// `LessonStep` may optionally carry, so a semantic teaching section is no
// longer limited to the deduplicated one-sentence assertion `statement`
// strings `resolveBodyStatements()` reconstructs at runtime. A `LessonStep`
// remains one semantic learning section, not a viewport -- it may scroll
// over multiple screen heights (ScrollableLessonStep.tsx already renders
// this generically; this package does not touch it).
//
// The approved V1 block families are EXACTLY: paragraph, list, visual,
// formula, worked_example, callout -- no other family, no `subheading`
// block, no Markdown/HTML/rich-text blob, no inline rich-text span system.
// A discriminated union (`type`) makes every block shape unambiguous by
// construction; every governed-content-bearing block reuses an EXISTING
// governed reference (formula family / worked-example blueprint / diagram
// blueprint / visual-aid blueprint from ./pedagogy.ts) -- never a new
// parallel content type.
//
// Produced artwork / `ProductionVisualAsset` runtime resolution is
// DELIBERATELY NOT integrated here -- the visual block supports only the
// two visual forms the CURRENT runtime already governs and renders
// (deterministic diagrams and governed visual aids). The real
// `VisualRequirement` -> `ReferenceDossier` -> `ProductionVisualAsset`
// authority chain is Packages 3-5's job; this package reserves no fake
// runtime path for it.
// ---------------------------------------------------------------------

export const paragraphContentBlockSchema = z.object({
  type: z.literal("paragraph"),
  /** Plain text only -- no Markdown/HTML/inline spans/embedded-resource syntax. Multiple paragraph blocks provide paragraph structure. */
  text: z.string().min(1),
});
export type ParagraphContentBlock = z.infer<typeof paragraphContentBlockSchema>;

export const listContentBlockSchema = z.object({
  type: z.literal("list"),
  style: z.enum(["ordered", "unordered"]),
  /** At least one item, every item non-empty plain text. No nesting in V1. */
  items: z.array(z.string().min(1)).min(1),
});
export type ListContentBlock = z.infer<typeof listContentBlockSchema>;

/**
 * A nested discriminated union for the visual block's SOURCE (rather than
 * several optional ids plus an XOR `superRefine`) -- the choice between a
 * deterministic diagram and a governed visual aid is unambiguous by
 * construction. `diagramParameters` reuses the EXACT existing shape from
 * `stepRepresentationRefsSchema` above (`diagramParametersSchema`), never
 * a redefinition.
 */
export const visualContentBlockSourceSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("diagram"),
    diagramBlueprintId: stableId,
    diagramParameters: diagramParametersSchema.optional(),
  }),
  z.object({
    kind: z.literal("visual_aid"),
    visualAidBlueprintId: stableId,
  }),
]);
export type VisualContentBlockSource = z.infer<typeof visualContentBlockSourceSchema>;

export const visualContentBlockSchema = z.object({
  type: z.literal("visual"),
  source: visualContentBlockSourceSchema,
});
export type VisualContentBlock = z.infer<typeof visualContentBlockSchema>;

/** Reuses `FormulaFamily`/`formulaFamilyId` semantics EXACTLY (./pedagogy.ts) -- the existing rendering behaviour (every declared form for the family is shown, per `LessonStepView.tsx`'s CC-12H fix) is preserved for this block too; no free-form `target` selector is introduced because no typed per-form selector mechanism exists on the family today. */
export const formulaContentBlockSchema = z.object({
  type: z.literal("formula"),
  formulaFamilyId: stableId,
});
export type FormulaContentBlock = z.infer<typeof formulaContentBlockSchema>;

/** Reuses the existing `WorkedExampleBlueprint` exactly -- never embeds copied worked-example steps inside the block. */
export const workedExampleContentBlockSchema = z.object({
  type: z.literal("worked_example"),
  workedExampleBlueprintId: stableId,
});
export type WorkedExampleContentBlock = z.infer<typeof workedExampleContentBlockSchema>;

/**
 * Exactly key_point | definition | caution -- no generic `note` variant.
 * key_point = important teaching relationship/fact; definition = concise
 * governed meaning of a term/concept; caution = misconception/common
 * error/limitation/genuine caution. Presentation must be semantic and
 * accessible -- never colour-only for the variant (enforced by the
 * renderer, not this schema).
 */
export const calloutVariantSchema = z.enum(["key_point", "definition", "caution"]);
export type CalloutVariant = z.infer<typeof calloutVariantSchema>;

export const calloutContentBlockSchema = z.object({
  type: z.literal("callout"),
  variant: calloutVariantSchema,
  text: z.string().min(1),
});
export type CalloutContentBlock = z.infer<typeof calloutContentBlockSchema>;

export const lessonStepContentBlockSchema = z.discriminatedUnion("type", [
  paragraphContentBlockSchema,
  listContentBlockSchema,
  visualContentBlockSchema,
  formulaContentBlockSchema,
  workedExampleContentBlockSchema,
  calloutContentBlockSchema,
]);
export type LessonStepContentBlock = z.infer<typeof lessonStepContentBlockSchema>;

/**
 * The DO -> RESPOND -> FEEDBACK -> NEXT contract (ARCH-003 §7/§16):
 * expresses what kind of learner action this step requires and when the
 * answer is revealed, without encoding any native component name or
 * styling (task brief §16's `interactionRole`/`answerReveal` example).
 */
export const interactionRoleSchema = z.enum([
  "predict",
  "select",
  "calculate",
  "interpret",
  "identify",
  "compare",
  "apply",
  "explain_structured",
  "correct_misconception",
]);
export type InteractionRole = z.infer<typeof interactionRoleSchema>;

export const answerRevealSchema = z.enum(["before_response", "after_submission", "on_request", "not_applicable"]);
export type AnswerReveal = z.infer<typeof answerRevealSchema>;

export const stepPresentationContractSchema = z.object({
  interactionRequired: z.boolean(),
  interactionRole: interactionRoleSchema.optional(),
  answerReveal: answerRevealSchema.default("not_applicable"),
  /** ARCH-003 §4 scrolling rule: a step's own content may scroll where it genuinely needs to; the lesson itself never does. */
  contentMayScroll: z.boolean().default(false),
  progressiveReveal: z.boolean().default(false),
});
export type StepPresentationContract = z.infer<typeof stepPresentationContractSchema>;

export const feedbackModeSchema = z.enum(["immediate", "after_step", "deferred"]);

export const stepFeedbackContractSchema = z.object({
  mode: feedbackModeSchema,
  explainWhy: z.boolean().default(true),
});
export type StepFeedbackContract = z.infer<typeof stepFeedbackContractSchema>;

/**
 * Explicit governed remediation/branch routes (task brief §13: "Avoid
 * vague metadata such as `remediate: true` when the actual route can be
 * represented explicitly"). Encodes enough for a FUTURE deterministic
 * assembler to route learners -- this package does not implement that
 * assembler or any runtime branching logic itself (ARCH-003 §6).
 */
export const branchTriggerSchema = z.enum([
  "misconception_detected",
  "capability_not_evidenced",
  "below_tolerance",
  "remediation_cleared",
  // CC-12: a wrong answer with no positively-identified governed
  // misconception (or one with no matching route) -- the honest "ambiguous
  // wrong answer, cause not yet known" case task brief §11 requires
  // (EVIDENCE -> HYPOTHESIS -> DIAGNOSTIC CHECK -> TARGETED REMEDIATION,
  // never WRONG ANSWER -> ASSUME MISCONCEPTION). Never implies a specific
  // misconception was found -- only that this step's own answer was
  // incorrect and no more specific route already claimed it.
  "incorrect_answer",
]);
export type BranchTrigger = z.infer<typeof branchTriggerSchema>;

export const stepBranchRouteSchema = z.object({
  trigger: branchTriggerSchema,
  misconceptionIdentifier: stableId.optional(),
  destinationStepId: stableId,
  description: z.string().min(1),
});
export type StepBranchRoute = z.infer<typeof stepBranchRouteSchema>;

// ---------------------------------------------------------------------
// Lesson Step
// ---------------------------------------------------------------------

export const lessonStepSchema = z.object({
  id: stableId,
  type: lessonStepTypeSchema,
  purpose: z.string().min(1),
  requirement: stepRequirementSchema.default("required"),

  /** Atomic assertion identifiers this step primarily teaches (new content), reinforces (secondary), or tests (assessed here) -- references only, per ARCH-003 §13. */
  teaches: z.array(stableId).default([]),
  reinforces: z.array(stableId).default([]),
  tests: z.array(stableId).default([]),

  assertionFamilyId: stableId.optional(),
  capabilityIds: z.array(stableId).default([]),
  misconceptionTargets: z.array(misconceptionMappingManifestSchema).default([]),
  representation: stepRepresentationRefsSchema.default({}),
  questionBlueprintId: stableId.optional(),

  /**
   * CC-13C.2B: this step's own learner-facing section heading -- DIFFERENT
   * from `semanticUnit` below, which is governance/authoring metadata and
   * must never be rendered as learner copy. Optional: a legacy step
   * without this renders exactly as before, using its existing
   * pedagogical-role-derived `sectionLabel` (`resolve-lesson-step.ts`'s
   * `SECTION_LABELS`) alone. Uses normal RN accessibility heading
   * semantics at render time; no nested heading levels, no heading block
   * system.
   */
  learnerFacingHeading: z.string().min(1).optional(),

  /**
   * CC-13C.2B: ordered, governed rich teaching content blocks (see the
   * block schemas above `stepRepresentationRefsSchema`) -- optional for
   * migration. PRESENCE SEMANTICS are load-bearing: ABSENT means the
   * legacy rendering path (`resolveBodyStatements()` + `representation`);
   * PRESENT means at least one block (enforced by `.min(1)` -- an explicit
   * empty array is REJECTED, never silently treated as "absent") and this
   * new path is the SOLE authoritative rendering path for the step. See
   * this schema's own `superRefine` below for the legacy-representation
   * mutual-exclusivity, teaching/evidence-state separation, and
   * `mayRevealTargetAnswer`-requiredness rules this presence triggers.
   */
  contentBlocks: z.array(lessonStepContentBlockSchema).min(1).optional(),

  presentation: stepPresentationContractSchema,
  scaffoldingLevel: z.enum(["guided", "standard", "independent"]),
  cognitiveDemand: difficultyBandSchema,
  feedback: stepFeedbackContractSchema,

  completionCondition: z.enum(["view_acknowledged", "answer_submitted", "correct_answer_required"]),
  branchRoutes: z.array(stepBranchRouteSchema).default([]),

  /** Capability ids this step, if answered, may emit learner evidence for -- referenced, not computed; the evidence engine remains a separate, unmodified system. */
  evidenceEmitted: z.array(stableId).default([]),

  /**
   * ADR-0005/CC-13A: this step's own coherent teaching/interaction unit
   * name (e.g. "why-parallel-resistance-falls", "worked-example-2-branch")
   * -- distinct from `id`, which is a stable identifier, not a semantic
   * label. Used by the embedded-check answer-leak and one-sentence-
   * fragmentation review gates (`scripts/content/validate-v1-learning-
   * package.ts`) to tell "one deliberately short, focused step" apart from
   * "a teaching concept arbitrarily sliced into one-sentence Continue
   * screens". Optional so existing authored content is not forced to
   * retrofit it before this package's schema lands; a missing value is a
   * currency-audit finding, not itself a hard validation failure.
   */
  semanticUnit: z.string().min(1).optional(),
  /** Required alongside `semanticUnit` when a reviewer would otherwise expect this step to be part of a larger coherent unit -- the explicit pedagogical reason a short section is legitimate (ADR-0006 Consequences: "arbitrary one-sentence fragmentation... is a review failure" but "a short focused question/interaction may be a legitimate short section"). */
  deliberateShortSectionReason: z.string().min(1).optional(),
  /** Required when this step is a substantive teaching step with no visual representation at all -- the explicit justification a visual-opportunity reviewer expects (ADR-0005: "text-only conceptual lessons require justification", `docs/product/PRODUCT-PRINCIPLES.md`). */
  textOnlyJustification: z.string().min(1).optional(),

  /**
   * ADR-0005/CC-13A: explicit, authored declaration that this step's
   * content is permitted to disclose the target answer of a governed
   * capability/assertion (e.g. a worked example showing the final
   * numeric answer). Distinct from `presentation.answerReveal`, which
   * times an INTERACTIVE step's own answer reveal -- this flags TEACHING
   * content itself as answer-bearing so the embedded-check answer-leak
   * gate can refuse to let it precede a graded check on the same
   * capability (matches the real Unit 202 finding: "teaching content
   * revealing answers to following/current formative checks",
   * `reports/architecture/2026-08-29-learning-package-architecture-
   * reset.md`). Optional: absent and `false` both mean "no declared
   * answer-disclosure" (kept `.optional()` rather than `.default(false)`
   * deliberately, so this additive field never forces every existing
   * governed lesson-step literal across scripts/content/data to be
   * touched merely to satisfy the schema -- CC-13A does not re-author
   * Unit 202 content).
   */
  mayRevealTargetAnswer: z.boolean().optional(),

  /**
   * The EXPLICIT capability whose mastery state controls a
   * `conditional_skip_if_mastered` step's skip decision (CC-06D,
   * Correction F §10.3). Required on every non-retrieval
   * `conditional_skip_if_mastered` step and prohibited elsewhere --
   * authored array order (`evidenceEmitted[0]`/`capabilityIds[0]`) must
   * never silently decide mastery gating.
   */
  masteryGateCapabilityId: stableId.optional(),
});
export type LessonStep = z.infer<typeof lessonStepSchema>;

// ---------------------------------------------------------------------
// Completion / exit criteria -- distinguishes lesson completion from
// mastery (task brief §14): completion is defined here; mastery/evidence
// interpretation remains the existing learner evidence architecture's
// job, never reinvented inside a lesson plan.
//
// CC-08A correction: `requiredCapabilityEvidence` answers "did the
// learner engage with this" (completion) -- it was never a mastery
// signal and must never be read as one. `masteryGateCapabilityIds` is
// the separate, explicit, opt-in subset of those capabilities that a
// COURSE-LEVEL orchestrator (@alp/diagnostic-engine) may treat as
// genuine advancement gates -- each must independently reach a secure
// mastery tier (WP1.3's MASTERED_STATES) before the course may advance
// past this lesson. Mirrors the existing per-step
// `masteryGateCapabilityId` (skip-if-mastered) naming/intent one level
// up, rather than inventing a second parallel completion model.
//
// Deliberately NOT every `requiredCapabilityEvidence` entry: several
// real governed capabilities are, by legitimate content design, only
// ever evidenced through guided/diagnostic steps (never an independent
// or transfer_application step) and can structurally never reach a
// secure tier -- e.g. Ohm's Law's `cap.ohms_law.solve_for_current`
// (guided-only). Listing such a capability here would make course
// advancement permanently unreachable, so authors declare only the
// capabilities this lesson's own step design genuinely lets a learner
// demonstrate independently. `requiredCapabilityEvidence` still
// requires evidence to exist for ALL of them (lesson completion is
// unchanged); `masteryGateCapabilityIds` is strictly about which of
// those additionally gate course-level advancement.
// ---------------------------------------------------------------------

export const lessonCompletionCriteriaSchema = z
  .object({
    requiredStepIds: z.array(stableId).min(1),
    requiredCapabilityEvidence: z.array(stableId).min(1),
    /** Course-advancement mastery gates -- must be a non-empty subset of `requiredCapabilityEvidence` (enforced below). */
    masteryGateCapabilityIds: z.array(stableId).min(1),
    requiresRemediationClearance: z.boolean().default(true),
    exitSummary: z.string().min(1),
  })
  .superRefine((criteria, ctx) => {
    const requiredSet = new Set(criteria.requiredCapabilityEvidence);
    for (const [index, id] of criteria.masteryGateCapabilityIds.entries()) {
      if (!requiredSet.has(id)) {
        ctx.addIssue({
          code: "custom",
          path: ["masteryGateCapabilityIds", index],
          message: `masteryGateCapabilityIds entry '${id}' is not also in requiredCapabilityEvidence -- a mastery gate must be a genuine completion requirement, never a capability the lesson doesn't otherwise require evidence for`,
        });
      }
    }
  });
export type LessonCompletionCriteria = z.infer<typeof lessonCompletionCriteriaSchema>;

// ---------------------------------------------------------------------
// Remediation eligibility -- a SEPARATE, purpose-specific relationship
// from `targetAssertionFamilyIds` (task brief, Package B correction
// §4/§5). `targetAssertionFamilyIds` means "this lesson's own main
// instructional content"; many lessons (an introduction, a refresher,
// exam revision, retrieval practice, ...) may freely share the same
// target family with no ambiguity at all -- that overlap must never be
// prohibited. `remediationEligibility` is the much narrower, opt-in
// declaration "this lesson is a candidate a learner can be routed to
// when a specific prerequisite family is evidenced as weak/conflicting".
// Semantic metadata on the candidate lesson itself, deliberately not a
// brittle `remediationLessonId` pointer stored on the family or on the
// lesson that assumes the prerequisite (see
// prerequisite-resolution.ts's header comment for the resolution rule
// this enables).
// ---------------------------------------------------------------------

export const remediationEligibilitySchema = z.object({
  assertionFamilyId: stableId,
  /** At most one lesson per (contentRelease, assertionFamilyId) may set this true -- the deterministic tiebreak when more than one lesson is remediation-eligible for the same family (enforced by scripts/content/validate-lesson-plan.ts's ambiguousRemediationCandidates gate and re-verified defensively by the assembler). With only one eligible candidate, this flag is irrelevant -- it only matters once there is more than one. */
  isDefaultRemediation: z.boolean().default(false),
});
export type RemediationEligibility = z.infer<typeof remediationEligibilitySchema>;

// ---------------------------------------------------------------------
// Lesson Plan
// ---------------------------------------------------------------------

export const lessonPlanSchema = z.object({
  id: stableId,
  schemaVersion: z.literal(1),
  version: z.number().int().min(1),
  title: z.string().min(1),
  learnerFacingDescription: z.string().min(1),
  curriculumUnit: z.string().min(1),

  /** Assertion-family ids (foundational or vocational) this lesson assumes without reteaching -- referenced, never restated. */
  prerequisiteKnowledge: z.array(stableId).default([]),
  targetAssertionFamilyIds: z.array(stableId).min(1),
  targetAssertionIdentifiers: z.array(stableId).default([]),
  targetCapabilityIds: z.array(stableId).min(1),
  /** Families this lesson is eligible to remediate a learner into -- see the module-level comment above `remediationEligibilitySchema`. Empty by default: most lessons are not remediation candidates for anything. */
  remediationEligibility: z.array(remediationEligibilitySchema).default([]),

  estimatedDurationMinutes: z.number().positive(),
  instructionalStrategy: z.string().min(1),

  steps: z.array(lessonStepSchema).min(1),

  misconceptionTargets: z.array(misconceptionMappingManifestSchema).default([]),
  /** Free-form retrieval hook tags a future spaced-retrieval scheduler can query by -- no scheduling logic here (ARCH-003 §6). */
  retrievalTags: z.array(z.string().min(1)).default([]),

  completionCriteria: lessonCompletionCriteriaSchema,
  presentationModes: z.array(presentationModeSchema).min(1),

  /** Ties this lesson's deterministic identity to a content release, mirroring CC-05B's `contentRelease` concept (packages/calculation-engine/src/seed.ts) -- same lesson id/version/contentRelease must always mean the same canonical plan (ARCH-003 §18, task brief §18). */
  contentRelease: stableId,

  /**
   * ADR-0006/CC-13A: opt-in V1 route-policy declaration. Absent on
   * existing (pre-reset) lessons -- this package does not re-author Unit
   * 202 content, so making this required would break the live corpus for
   * no behavioural gain. When present as `CANONICAL_FIXED_ROUTE`, the
   * `superRefine` below enforces the ADR-0006 invariant mechanically:
   * every step must be `requirement: "required"` (no mastery-driven
   * skip/remediation branching in the V1 route itself -- that machinery
   * remains available on lessons that do NOT declare this policy).
   */
  routePolicy: v1LessonRoutePolicySchema.optional(),
  /** Stable id of this lesson's `VisualOpportunityAnalysis` (./visual-governance.ts) -- ADR-0005: every lesson receives one before learner-ready status. Optional for the same pre-existing-corpus reason as `routePolicy`. */
  visualOpportunityAnalysisId: stableId.optional(),
  /**
   * Stable ids of `QuestionGovernanceContract`-bearing formative/mock
   * question blueprints (./pedagogy.ts's
   * `questionBlueprintManifestSchema.revisionLessonIds`, the inverse
   * relationship) that map onto THIS lesson as a Guided Revision
   * destination. Referenced, not computed -- the real source of truth is
   * each question blueprint's own `revisionLessonIds`; this is a
   * denormalised convenience list an author/tool may populate, never
   * authoritative on its own. Kept `.optional()` rather than
   * `.default([])` deliberately (see `mayRevealTargetAnswer`'s comment
   * above for why) -- absence means "not yet populated", equivalent to an
   * empty list wherever this is consumed.
   */
  assessmentMappingIds: z.array(stableId).optional(),
})
  .superRefine((lesson, ctx) => {
    const remediationFamilyIds = new Set<string>();
    for (const [index, entry] of lesson.remediationEligibility.entries()) {
      if (remediationFamilyIds.has(entry.assertionFamilyId)) {
        ctx.addIssue({
          code: "custom",
          path: ["remediationEligibility", index, "assertionFamilyId"],
          message: `duplicate remediationEligibility entry for assertion family '${entry.assertionFamilyId}' within lesson '${lesson.id}'`,
        });
      }
      remediationFamilyIds.add(entry.assertionFamilyId);
    }

    const stepIds = new Set<string>();
    for (const [index, step] of lesson.steps.entries()) {
      if (stepIds.has(step.id)) {
        ctx.addIssue({ code: "custom", path: ["steps", index, "id"], message: `duplicate step id '${step.id}' within lesson '${lesson.id}'` });
      }
      stepIds.add(step.id);
    }

    // masteryGateCapabilityId placement (CC-06D §10.3): required exactly
    // where conditional skip-if-mastered semantics consume it (non-retrieval
    // conditional_skip_if_mastered steps -- retrieval_check steps are gated
    // by retrieval dueness, not capability mastery), prohibited everywhere
    // it has no semantic purpose, and never inferred from array order.
    for (const [index, step] of lesson.steps.entries()) {
      const requiresMasteryGate = step.requirement === "conditional_skip_if_mastered" && step.type !== "retrieval_check";
      if (requiresMasteryGate && !step.masteryGateCapabilityId) {
        ctx.addIssue({
          code: "custom",
          path: ["steps", index, "masteryGateCapabilityId"],
          message: `step '${step.id}' is conditional_skip_if_mastered but declares no masteryGateCapabilityId -- the skip-controlling capability must be explicit, never inferred from array order`,
        });
      }
      if (!requiresMasteryGate && step.masteryGateCapabilityId) {
        ctx.addIssue({
          code: "custom",
          path: ["steps", index, "masteryGateCapabilityId"],
          message: `step '${step.id}' declares masteryGateCapabilityId but is not a conditional_skip_if_mastered step -- the field has no semantic purpose here`,
        });
      }
    }

    for (const [index, step] of lesson.steps.entries()) {
      for (const [routeIndex, route] of step.branchRoutes.entries()) {
        if (!stepIds.has(route.destinationStepId)) {
          ctx.addIssue({
            code: "custom",
            path: ["steps", index, "branchRoutes", routeIndex, "destinationStepId"],
            message: `branch route in step '${step.id}' targets unknown step id '${route.destinationStepId}'`,
          });
        }
        if (route.destinationStepId === step.id) {
          ctx.addIssue({
            code: "custom",
            path: ["steps", index, "branchRoutes", routeIndex, "destinationStepId"],
            message: `branch route in step '${step.id}' targets itself`,
          });
        }
        if (route.trigger === "misconception_detected" && !route.misconceptionIdentifier) {
          ctx.addIssue({
            code: "custom",
            path: ["steps", index, "branchRoutes", routeIndex, "misconceptionIdentifier"],
            message: `branch route in step '${step.id}' has trigger 'misconception_detected' but no misconceptionIdentifier`,
          });
        }
      }
    }

    for (const [index, requiredId] of lesson.completionCriteria.requiredStepIds.entries()) {
      if (!stepIds.has(requiredId)) {
        ctx.addIssue({
          code: "custom",
          path: ["completionCriteria", "requiredStepIds", index],
          message: `completionCriteria references unknown step id '${requiredId}'`,
        });
      }
    }

    // ADR-0006 V1 route-invariance gate: a CANONICAL_FIXED_ROUTE lesson's
    // step sequence must not depend on learner mastery/evidence/
    // prerequisite state at all -- so no step may be conditional. This is
    // deliberately stricter than "the assembler happens to always include
    // them today": it makes the invariant a structural property of the
    // authored content itself, independent of assembler behaviour.
    if (lesson.routePolicy === "CANONICAL_FIXED_ROUTE") {
      for (const [index, step] of lesson.steps.entries()) {
        if (step.requirement !== "required") {
          ctx.addIssue({
            code: "custom",
            path: ["steps", index, "requirement"],
            message: `lesson '${lesson.id}' declares routePolicy 'CANONICAL_FIXED_ROUTE' but step '${step.id}' has requirement '${step.requirement}' -- ADR-0006's V1 canonical route must not vary with learner mastery/evidence/prerequisite state; conditional steps belong only to a lesson that does not declare CANONICAL_FIXED_ROUTE (they remain valid retained platform capability there)`,
          });
        }
        // CC-13C.1 (remediation of the CC-13B V1-ROUTE-DRIFT-REGISTER.md §2 /
        // BYPASS-PATH-REGISTER.md BP-1 finding): the `requirement` check above
        // only closes conditional step *inclusion*. A `required` step could
        // still carry a non-empty `branchRoutes`, letting
        // `resolveWithinSessionBranch` (@alp/learning-engine) divert a
        // CANONICAL_FIXED_ROUTE lesson to a different within-session
        // destination depending on the learner's answer -- the same
        // learner-dependent-route violation the `requirement` check exists to
        // prevent, just reached a different way. CANONICAL_FIXED_ROUTE
        // therefore means no conditional step inclusion AND no within-lesson
        // branch routes.
        if (step.branchRoutes.length > 0) {
          ctx.addIssue({
            code: "custom",
            path: ["steps", index, "branchRoutes"],
            message: `lesson '${lesson.id}' declares routePolicy 'CANONICAL_FIXED_ROUTE' but step '${step.id}' declares ${step.branchRoutes.length} branchRoutes entry(ies) -- CANONICAL_FIXED_ROUTE lessons cannot declare branchRoutes; a fixed V1 route must not have learner-dependent within-session branch destinations (branching remains valid retained platform capability for a lesson that does not declare CANONICAL_FIXED_ROUTE)`,
          });
        }
      }
    }

    // ADR-0005 embedded-check answer-leak gate: teaching content earlier
    // in canonical step order must not be declared `mayRevealTargetAnswer`
    // when a later step tests overlapping capability/knowledge with a
    // graded (`correct_answer_required`) completion condition. Real Unit
    // 202 finding this reconstructs mechanically: "teaching content
    // revealing answers to following/current formative checks".
    for (const [earlierIndex, earlierStep] of lesson.steps.entries()) {
      if (!earlierStep.mayRevealTargetAnswer) continue;
      const revealedTargets = new Set<string>([...earlierStep.teaches, ...earlierStep.reinforces, ...earlierStep.capabilityIds]);
      if (revealedTargets.size === 0) continue;
      for (const [laterIndex, laterStep] of lesson.steps.entries()) {
        if (laterIndex <= earlierIndex) continue;
        if (laterStep.completionCondition !== "correct_answer_required") continue;
        const checkedTargets = new Set<string>([...laterStep.tests, ...laterStep.capabilityIds]);
        const overlap = [...revealedTargets].filter((id) => checkedTargets.has(id));
        if (overlap.length > 0) {
          ctx.addIssue({
            code: "custom",
            path: ["steps", earlierIndex, "mayRevealTargetAnswer"],
            message: `lesson '${lesson.id}' step '${earlierStep.id}' is marked mayRevealTargetAnswer but precedes graded step '${laterStep.id}' (completionCondition 'correct_answer_required'), which tests the same target(s) (${overlap.join(", ")}) -- teaching content must not remain answer-bearing while an embedded check on the same target is still active`,
          });
        }
      }
    }

    // CC-13C.2B: `contentBlocks` presence triggers three additive rules.
    // None of these apply to a legacy step (no `contentBlocks`) -- every
    // check below is gated on `step.contentBlocks !== undefined` first.
    for (const [index, step] of lesson.steps.entries()) {
      if (step.contentBlocks === undefined) continue;

      // 1. Legacy/new mutual exclusivity: reject any legacy representation
      // field that would INDEPENDENTLY cause a formula/diagram/visual-aid/
      // worked-example to render, plus diagramParameters (only meaningful
      // paired with a legacy diagramBlueprintId). `stepRepresentationRefsSchema`
      // has no other, genuinely non-display field to preserve -- all five
      // of its fields are display-rendering fields.
      const conflictingLegacyFields: ReadonlyArray<readonly [string, unknown]> = [
        ["formulaFamilyId", step.representation.formulaFamilyId],
        ["diagramBlueprintId", step.representation.diagramBlueprintId],
        ["workedExampleBlueprintId", step.representation.workedExampleBlueprintId],
        ["visualAidBlueprintId", step.representation.visualAidBlueprintId],
        ["diagramParameters", step.representation.diagramParameters],
      ];
      for (const [field, value] of conflictingLegacyFields) {
        if (value !== undefined) {
          ctx.addIssue({
            code: "custom",
            path: ["steps", index, "representation", field],
            message: `lesson '${lesson.id}' step '${step.id}' declares contentBlocks AND representation.${field} -- once contentBlocks is present it is the sole authoritative rendering path for the step; a legacy representation field that would independently render content must not coexist with it`,
          });
        }
      }

      // 2. Teaching / evidence-state separation (V1 boundary): rich
      // teaching content and an evidence-bearing graded question must not
      // occupy the same step. A step is identified as a graded/
      // evidence-bearing question step either by `completionCondition:
      // "correct_answer_required"` or by carrying a `questionBlueprintId`
      // at all (the resolver's own migration rule renders ONLY
      // contentBlocks when present, so a step with both would silently
      // drop real question rendering -- structurally unsafe, not just
      // undesirable).
      if (step.completionCondition === "correct_answer_required" || step.questionBlueprintId !== undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["steps", index, "contentBlocks"],
          message: `lesson '${lesson.id}' step '${step.id}' declares contentBlocks but is a graded/evidence-bearing question step (completionCondition '${step.completionCondition}'${step.questionBlueprintId ? `, questionBlueprintId '${step.questionBlueprintId}'` : ""}) -- rich teaching content and an evidence-bearing graded question must not occupy the same step; use a separate step`,
        });
      }

      // 3. Answer-leak governance (additive to the existing gate above,
      // never weakening it): a rich teaching step must explicitly declare
      // mayRevealTargetAnswer true or false, never leave it undefined.
      if (step.mayRevealTargetAnswer === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["steps", index, "mayRevealTargetAnswer"],
          message: `lesson '${lesson.id}' step '${step.id}' declares contentBlocks but leaves mayRevealTargetAnswer undefined -- a rich teaching step must explicitly declare true or false, never rely on the implicit "absent means false" convention legacy steps use`,
        });
      }
    }
  });
export type LessonPlan = z.infer<typeof lessonPlanSchema>;

// ---------------------------------------------------------------------
// Manifest -- a governed collection of canonical lesson plans.
// ---------------------------------------------------------------------

export const lessonPlanManifestSchema = z.object({
  lessons: z.array(lessonPlanSchema),
}).superRefine((manifest, ctx) => {
  // CC-08A: keyed on (id, version, contentRelease) -- this module's own
  // documented identity model ("same lesson id/version/content release
  // must always mean the same canonical plan", ARCH-003 §18) already
  // makes contentRelease part of a lesson's identity, so the SAME
  // immutable step content may legitimately be a member of more than
  // one governed ContentRelease (e.g. an existing lesson carried
  // forward, unchanged, into a new release alongside newly added
  // lessons) without being a "duplicate" -- content-release immutability
  // (a release, once declared, always names the exact same snapshot)
  // requires this: growing a release's membership by moving a lesson
  // out of an older release is not legitimate, so the older release
  // must keep its own (id, version, contentRelease)-identified member
  // untouched while a new release gains its own.
  const seen = new Set<string>();
  for (const [index, lesson] of manifest.lessons.entries()) {
    const key = `${lesson.id}@${lesson.version}@${lesson.contentRelease}`;
    if (seen.has(key)) {
      ctx.addIssue({ code: "custom", path: ["lessons", index, "id"], message: `duplicate lesson id/version/contentRelease '${key}'` });
    }
    seen.add(key);
  }
});
export type LessonPlanManifest = z.infer<typeof lessonPlanManifestSchema>;
