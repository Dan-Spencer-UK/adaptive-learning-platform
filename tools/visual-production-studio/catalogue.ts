/**
 * CC-11.6: the structured Unit 202 premium-visual production catalogue,
 * organised by VISUAL FAMILY rather than a flat asset list.
 *
 * Core architectural rule this file exists to embody: VISUAL COUNT
 * FOLLOWS PEDAGOGICAL NEED. A governed instructional concept is never
 * assumed to require a fixed number of images -- a VisualFamily is the
 * complete governed set of assets needed to teach, practise, assess and
 * explain one concept, and may contain exactly one asset (a simple
 * concept needs only one teaching visual) or several (a phenomenon that
 * needs a mnemonic, a lever/pulley concept with genuinely distinct
 * configurations, etc.). Nothing here optimises for "one image per
 * concept" or "two images per concept" -- each family's asset count is
 * individually justified in its own `familyNotes`/asset content below.
 *
 * This remains production-tooling metadata, not learner content or a
 * governed pedagogical entity (see prior header note, unchanged):
 * nothing here creates a DiagramBlueprint/VisualSemanticContract, and
 * wiring a finished, approved asset into a real lesson is a separate,
 * later step outside this tool's scope.
 */

export type ProductionClass = "DETERMINISTIC_TECHNICAL" | "PREMIUM_CONCEPTUAL" | "HYBRID";
export type Priority = "P0" | "P1" | "P2";
export type OutputSubfolder = "teaching" | "conceptual" | "hybrid" | "physical-components" | "deterministic-polish";
export type ReferenceReadiness = "READY" | "NOT_READY";

/**
 * CC-11.6 §4: the closed set of roles a VisualAsset may play within its
 * family. A family is never required to use every role, and never
 * required to reach a fixed cardinality -- these are descriptive labels
 * for whichever asset roles a given family's pedagogical need actually
 * calls for.
 */
export type VisualAssetRole =
  | "PHENOMENON"
  | "MNEMONIC"
  | "CONFIGURATION"
  | "SEQUENCE_STATE"
  | "COMPARISON"
  | "PHYSICAL_RECOGNITION"
  | "TECHNICAL_DIAGRAM"
  | "ASSESSMENT_SUPPORT"
  | "FEEDBACK_SUPPORT";

export const PRODUCTION_CLASSES: readonly ProductionClass[] = ["DETERMINISTIC_TECHNICAL", "PREMIUM_CONCEPTUAL", "HYBRID"];
export const PRIORITIES: readonly Priority[] = ["P0", "P1", "P2"];
export const OUTPUT_SUBFOLDERS: readonly OutputSubfolder[] = ["teaching", "conceptual", "hybrid", "physical-components", "deterministic-polish"];
export const VISUAL_ASSET_ROLES: readonly VisualAssetRole[] = [
  "PHENOMENON",
  "MNEMONIC",
  "CONFIGURATION",
  "SEQUENCE_STATE",
  "COMPARISON",
  "PHYSICAL_RECOGNITION",
  "TECHNICAL_DIAGRAM",
  "ASSESSMENT_SUPPORT",
  "FEEDBACK_SUPPORT",
];

/**
 * Product Owner correction (recorded in
 * docs/architecture/PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md
 * §7/§ANNOTATION FOLLOWS PEDAGOGICAL STATE): labels are a pedagogical
 * tool, not something to default to omitting. The governing boundary is
 * TEACHING vs ASSESSMENT vs FEEDBACK, never a blanket "no baked text"
 * rule. `annotationPolicy` records which of those states this specific
 * asset's artwork is produced for, so the prompt builder can tell the
 * art session explicitly whether explanatory labels are REQUIRED,
 * PERMITTED-but-non-revealing, or should be OMITTED entirely (a clean
 * base layer for a fully separate deterministic overlay system).
 */
export type AnnotationPolicy = "TEACHING_EXPLANATORY" | "ASSESSMENT_NON_REVEALING" | "FEEDBACK_EXPLANATORY" | "NONE";
export const ANNOTATION_POLICIES: readonly AnnotationPolicy[] = ["TEACHING_EXPLANATORY", "ASSESSMENT_NON_REVEALING", "FEEDBACK_EXPLANATORY", "NONE"];

/**
 * CC-11.7 §8: the pedagogical state a single CANONICAL LEARNER-VISIBLE
 * STATE is produced for. MULTI_STATE is for a state genuinely used
 * across more than one context unchanged (mirroring the existing CC-05D
 * canonical-variant `mode: "both"` convention) -- never a shortcut to
 * avoid classifying.
 */
export type PedagogicalState = "TEACHING" | "PRACTICE" | "ASSESSMENT" | "FEEDBACK" | "MULTI_STATE";
export const PEDAGOGICAL_STATES: readonly PedagogicalState[] = ["TEACHING", "PRACTICE", "ASSESSMENT", "FEEDBACK", "MULTI_STATE"];

/**
 * CC-11.7 §7: the third, most granular level of the visual hierarchy --
 * VISUAL FAMILY -> PRODUCTION/BASE ASSET (`VisualAsset` below) ->
 * CANONICAL LEARNER-VISIBLE STATE (this type). A single base asset may
 * legitimately support several canonical states (e.g. one illustrated
 * conductor base asset supporting both current directions, each in both
 * teaching and assessment mode) -- states are never collapsed merely
 * because they share a base, and a state is never silently dropped when
 * it already exists as a governed CC-05D canonical variant.
 */
export interface CanonicalState {
  /** Unique across the whole catalogue: "{assetId}.state.{slug}". */
  stateId: string;
  displayName: string;
  pedagogicalState: PedagogicalState;
  annotationPolicy: AnnotationPolicy;
  /** Concrete labels/callouts this specific state should carry -- see `VisualAsset.requiredLabels` doc comment for the same discipline, applied per-state instead of per-asset. */
  requiredLabels: string[];
  /** The exact parameter combination this state corresponds to, mirroring a DiagramBlueprint's own parameter shape where this state reconciles to an existing deterministic variant. */
  parameters?: Record<string, string | number | boolean>;
  /**
   * Reconciliation pointer: the exact `variantId` this state corresponds
   * to in the existing governed CC-05D canonical-variant system
   * (`scripts/visual-governance/data/canonical-variants.ts`), computed
   * via `reconciledVariantId()` below using the real stable-id algorithm
   * -- never hand-copied, so a transcription error cannot silently
   * misreport reconciliation. Undefined for a state that is genuinely
   * new (not a supersession/refinement of an existing deterministic
   * variant).
   */
  existingCanonicalVariantId?: string;
  notes?: string;
}
export const CANONICAL_STATE_ROLE_DOC = "VISUAL FAMILY -> PRODUCTION/BASE ASSET -> CANONICAL LEARNER-VISIBLE STATE";

/**
 * Reproduces `stableVariantId()` from
 * `scripts/visual-governance/data/canonical-variants.ts` exactly (same
 * sorted-keys-join algorithm) so every `existingCanonicalVariantId` above
 * is computed from real inputs rather than hand-transcribed -- the
 * mechanical reconciliation this package's acceptance criterion ("zero
 * existing canonical variants silently lost") depends on being exact.
 */
export function reconciledVariantId(
  contractId: string,
  contractVersion: number,
  mergedParameters: Record<string, string | number | boolean>,
  mode: "teaching" | "assessment" | "both",
): string {
  // The real algorithm (canonical-variants.ts's `variant()`) folds `mode`
  // itself into the object whose keys get sorted before the trailing
  // `::${mode}` is appended -- e.g. "...,mode=teaching,...::teaching", not
  // just "...::teaching". Omitting this produced 66/66 false mismatches
  // against the real system on first pass; reproduced exactly here.
  const withMode: Record<string, string | number | boolean> = { ...mergedParameters, mode };
  const sortedParams = Object.keys(withMode)
    .sort()
    .map((key) => `${key}=${withMode[key]}`)
    .join(",");
  return `${contractId}@${contractVersion}::${sortedParams}::${mode}`;
}

export interface CatalogueReference {
  sourceName: string;
  sourceUrl: string;
  licence: string;
  qualityGrade: string;
}

export interface VisualAsset {
  /** Global ordinal across the whole catalogue (declaration order), used only for stable "#01" display -- never for family grouping, which is structural (family.assets order). */
  sequence: number;
  assetId: string;
  familyId: string;
  /** 1-based position within this asset's own family. */
  orderInFamily: number;
  role: VisualAssetRole;
  displayName: string;
  loOrLesson?: string;
  priority: Priority;
  /** Exact priority text as specified (e.g. "P1/P2", "future / P2") -- `priority` above is the normalised filter value. */
  priorityLabel: string;
  productionClass: ProductionClass;
  /** Exact nuanced production-class text as specified (e.g. "HYBRID / PREMIUM TEACHING"). */
  productionClassLabel: string;
  /** The existing CC-05D-governed DiagramBlueprint id this premium asset relates to, if any -- distinct from `familyId` (this tool's own VisualFamily grouping). */
  governedDiagramBlueprintId?: string;
  instructionalPurpose: string;
  primaryReference: CatalogueReference;
  secondaryReference?: CatalogueReference;
  referenceReadiness: ReferenceReadiness;
  /**
   * CC-11.6 §11: set when the governed Unit 202 corpus does not clearly
   * establish that this specific configuration/asset is required
   * teaching content -- the asset is recorded (so the production need is
   * tracked and visible) but marked as needing a scope decision before
   * any prompt is generated for it, rather than inventing syllabus
   * content that was never actually governed.
   */
  needsScopeConfirmation?: boolean;
  scopeConfirmationNote?: string;
  /** Which pedagogical state this specific artwork is produced for -- governs whether the art session must include, may include, or must omit explanatory/answer-revealing labels. See ANNOTATION FOLLOWS PEDAGOGICAL STATE. */
  annotationPolicy: AnnotationPolicy;
  /** Concrete labels/callouts the delivered artwork itself should carry when `annotationPolicy` is TEACHING_EXPLANATORY or FEEDBACK_EXPLANATORY (e.g. "THUMB = CURRENT"). Empty when annotationPolicy is NONE or ASSESSMENT_NON_REVEALING (assessment labels are neutral stimulus content, described in `immutableFacts`/`exactDeliverable` instead, never a fixed answer-bearing list). */
  requiredLabels: string[];
  immutableFacts: string[];
  creativeFreedoms: string[];
  deterministicOverlayResponsibilities: string[];
  prohibitedChanges: string[];
  exactDeliverable: string;
  assessmentNote?: string;
  outputSubfolder: OutputSubfolder;
  filenameBase: string;
  /**
   * Product Owner clarification: a VisualFamily is an organisational
   * grouping only -- it never reduces prompt granularity. Every
   * individual asset gets its own distinct, individually copyable
   * ASSET-SPECIFIC PROMPT. This flag exists for the one different case:
   * an asset whose production is entirely deterministic and for which no
   * image-generation prompt should ever be offered at all (e.g. the
   * governed UK/IEC symbol system, produced by ComponentSymbols.tsx, not
   * an art session). Defaults to true (promptable) when omitted -- only
   * set false where a REAL, current reason exists.
   */
  promptable?: boolean;
  /**
   * Product Owner correction (default premium surface): every
   * HYBRID/PREMIUM_CONCEPTUAL asset automatically inherits the standard
   * muted dark-slate/blue-grey background instruction in its generated
   * prompt (see prompt-builder.ts's DEFAULT_BACKGROUND_INSTRUCTION) --
   * "not an absolute rule": set this field on an asset that has a
   * pedagogically/visually justified reason to depart from it, and that
   * text replaces the default instead of the standard one being appended.
   */
  backgroundStyleOverride?: string;
  /**
   * CC-11.7 §7/§9: every distinct learner-visible presentation this base
   * asset supports. Always at least one entry (an asset with zero states
   * is meaningless) -- `validateCatalogue()` enforces non-emptiness and
   * stateId uniqueness. Where this asset's `governedDiagramBlueprintId`
   * has existing CC-05D canonical variants, every one of them must be
   * reconciled here (retained as a state) or explicitly superseded --
   * never silently dropped.
   */
  canonicalStates: CanonicalState[];
  /**
   * CC-11.7A §3/§15: an asset defaults to REQUIRED (see
   * `visualNeedClassificationFor`). Set this to "USEFUL" for a genuine
   * CC-11.7-audit USEFUL finding that has been materialised into the live
   * catalogue -- optional enrichment the Product Owner may choose to
   * produce for course quality, never something REQUIRED completion may
   * depend on. Never set for an asset the audit judged REQUIRED merely
   * because it is now visible in the Studio (§3: "Do NOT upgrade optional
   * items to REQUIRED... Do not turn them into REQUIRED merely because
   * they are now visible").
   */
  needOverride?: "USEFUL";
  /**
   * CC-11.7B §3/§6: whether this asset's proposed image/state sharing (or,
   * for a single-state asset, its proposed multi-object composite -- §8)
   * was genuinely audited and found safe, safe-with-constraints, or
   * required a split into separate ProductionAssets. Present on every
   * asset that either (a) currently supports more than one
   * `CanonicalState`, or (b) resulted from, or was deliberately spared
   * from, a CC-11.7B split decision -- absent on an ordinary single-state
   * asset with nothing to audit here.
   */
  sharedBaseAudit?: SharedBaseAudit;
}

/**
 * CC-11.7B §3: SAFE_SHARED_BASE -- no meaningful pose/configuration/scene
 * change between states; achievable entirely via deterministic
 * labels/arrows/overlays/reveal-hide/dimensions. SHARED_BASE_WITH_CONDITIONS
 * -- reusable, but only if the recorded `conditions` are honoured by the
 * art session (e.g. "leave neutral spacing", "do not bake in a specific
 * direction"). SEPARATE_ARTWORK_REQUIRED -- the grouped states/objects
 * require genuinely different underlying images (pose, orientation,
 * apparatus configuration, or scene change); the asset was split.
 */
export type SharedBaseClassification = "SAFE_SHARED_BASE" | "SHARED_BASE_WITH_CONDITIONS" | "SEPARATE_ARTWORK_REQUIRED";
export const SHARED_BASE_CLASSIFICATIONS: readonly SharedBaseClassification[] = ["SAFE_SHARED_BASE", "SHARED_BASE_WITH_CONDITIONS", "SEPARATE_ARTWORK_REQUIRED"];

export type SharedBaseAction = "KEEP" | "KEEP_WITH_CONDITIONS" | "SPLIT";
export const SHARED_BASE_ACTIONS: readonly SharedBaseAction[] = ["KEEP", "KEEP_WITH_CONDITIONS", "SPLIT"];

export interface SharedBaseAudit {
  classification: SharedBaseClassification;
  action: SharedBaseAction;
  rationale: string;
  /** Populated only when classification is SHARED_BASE_WITH_CONDITIONS. */
  conditions?: string[];
  /** Populated only on an asset produced by a CC-11.7B split -- the original pre-split assetId this asset's state(s) were carved out of. */
  splitFrom?: string;
  /** Populated on a split asset -- every other assetId the same original asset split into (siblings, not including itself). */
  splitSiblings?: string[];
}

export interface VisualFamily {
  familyId: string;
  displayName: string;
  instructionalPurpose: string;
  /** Lesson/capability linkage where known -- informational, not a governed cross-reference. */
  governedConcept?: string;
  /** Why this family has the asset count it has -- especially important for a multi-asset family, so the count reads as a justified decision, not an accident. */
  familyNotes?: string;
  assets: VisualAsset[];
}

const NOT_READY_REF: CatalogueReference = {
  sourceName: "PRIMARY REFERENCE STILL TO BE APPROVED",
  sourceUrl: "",
  licence: "unknown -- not yet sourced",
  qualityGrade: "n/a",
};

// ---------------------------------------------------------------------
// FAMILIES
// ---------------------------------------------------------------------

export const FAMILIES: VisualFamily[] = [
  {
    familyId: "unit202.family.right-hand-grip",
    displayName: "Right-hand grip rule / field around a conductor",
    instructionalPurpose:
      "Teach both the electromagnetic phenomenon (a current-carrying conductor is surrounded by a circulating magnetic field) and the mnemonic used to predict that field's direction from the current's direction.",
    governedConcept: "LO5 — lesson.magnetism.effects-of-current (magnetic.field_conductor_direction)",
    familyNotes:
      "Two assets, not one: the phenomenon a learner must recognise (a field genuinely circulates around any current-carrying conductor) is a distinct fact from the mnemonic used to predict its direction, and conflating them into a single image risks the learner memorising the hand gesture without understanding what it predicts. A third role, ASSESSMENT_SUPPORT (a deterministic technical stimulus with no hand), already exists as the governed CC-05D deterministic diagram `magnetic.field_conductor_direction` (see apps/mobile/src/components/diagrams/RightHandGripRuleDiagram.tsx) -- it is not duplicated here as a premium asset because its correctness is already fully governed and pixel-reviewed by the existing deterministic pipeline.",
    assets: [
      {
        sequence: 1,
        assetId: "unit202.current-conductor.magnetic-field",
        familyId: "unit202.family.right-hand-grip",
        orderInFamily: 1,
        role: "PHENOMENON",
        displayName: "Magnetic field around a current-carrying conductor",
        loOrLesson: "LO5 — lesson.magnetism.effects-of-current",
        priority: "P0",
        priorityLabel: "P0",
        productionClass: "HYBRID",
        productionClassLabel: "HYBRID",
        governedDiagramBlueprintId: "magnetic.field_conductor_direction",
        instructionalPurpose: "Show the actual electromagnetic phenomenon that the right-hand grip mnemonic predicts, independent of the mnemonic itself.",
        primaryReference: {
          sourceName: "Wikimedia Commons — Right-hand grip rule.svg (field-line geometry only, not the hand)",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Right-hand_grip_rule.svg",
          licence: "Public-domain dedication",
          qualityGrade: "A",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: [],
        immutableFacts: [
          "straight current-carrying conductor",
          "magnetic field circulates around the conductor (closed concentric loops, not radiating outward)",
          "reversing the current reverses the direction of circulation",
          "any depiction of field strength must not contradict a stronger field nearer the conductor",
          "the concentric field-line pattern is rotationally symmetric -- do not bake in a specific current direction or circulation sense",
        ],
        creativeFreedoms: ["premium conductor material/finish", "field-line stylisation", "composition"],
        deterministicOverlayResponsibilities: ["current-direction arrow/label (dot/cross convention)", "field-circulation direction indicator (arrowheads on the field lines)"],
        prohibitedChanges: [
          "do not include a hand in this asset -- that is the separate MNEMONIC asset in this family",
          "do not bake a specific current direction or circulation-arrow sense into the base artwork -- CC-11.7B correction: this base must safely serve BOTH current directions via deterministic overlay, never a redraw",
        ],
        exactDeliverable:
          "One premium illustration of a straight conductor with concentric magnetic field lines circulating around it -- direction-neutral, with no baked current-direction or circulation arrowheads (those are added deterministically per state), matching the reference field geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        assessmentNote: "Not the mnemonic itself -- may appear in assessment context as the phenomenon being questioned, distinct from the MNEMONIC asset which never appears in assessment.",
        outputSubfolder: "hybrid",
        filenameBase: "current-conductor-magnetic-field-base",
        sharedBaseAudit: {
          classification: "SHARED_BASE_WITH_CONDITIONS",
          action: "KEEP_WITH_CONDITIONS",
          rationale:
            "CC-11.7B: a straight conductor's concentric field-line pattern is rotationally symmetric -- reversing current only reverses which way the circulation arrows point, never the field-line geometry, conductor position, or composition. The base artwork itself is produced ONCE, direction-neutral, and the two current directions are distinguished entirely by a deterministic dot/cross + arrowhead OVERLAY added afterward -- the generated artwork is never mirrored, flipped, or redrawn to represent the opposite direction (CC-11.7C §2: mirroring hand-rule/directional artwork is prohibited outright, since it can silently invalidate a geometry-dependent mnemonic or phenomenon; this asset never relies on it). CORRECTION APPLIED (CC-11.7B): the pre-audit config incorrectly asked the art session to bake in 'current direction indicated' as part of the artwork (exactDeliverable) while also requiring 4 states covering both directions from one image -- an internal inconsistency. Fixed by moving both direction indicators to deterministicOverlayResponsibilities and removing direction-specific language from exactDeliverable/immutableFacts.",
          conditions: [
            "base artwork must show field lines with NO baked arrowheads/direction sense",
            "base artwork must show the conductor cross-section with no baked dot/cross current-direction symbol",
            "composition must leave clear, uncluttered space at the conductor's cross-section and along at least two field-line loops for a deterministic overlay to add direction indicators afterward",
          ],
        },
        canonicalStates: [
          {
            stateId: "unit202.current-conductor.magnetic-field.state.into-page-teaching",
            displayName: "Current into page — field circulation revealed (teaching)",
            pedagogicalState: "TEACHING",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["current-direction arrow/label", "field-circulation direction indicator"],
            parameters: { current_direction: "into_page", show_field_arrows: true },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.right-hand-grip-rule", 1, { current_direction: "into_page", show_field_arrows: true, field_rotation: "clockwise" }, "teaching"),
          },
          {
            stateId: "unit202.current-conductor.magnetic-field.state.into-page-assessment",
            displayName: "Current into page — field circulation withheld (assessment)",
            pedagogicalState: "ASSESSMENT",
            annotationPolicy: "ASSESSMENT_NON_REVEALING",
            requiredLabels: [],
            notes: "Current direction is the GIVEN stimulus; field-circulation direction is the assessed answer and must not appear.",
            parameters: { current_direction: "into_page", show_field_arrows: true },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.right-hand-grip-rule", 1, { current_direction: "into_page", show_field_arrows: true }, "assessment"),
          },
          {
            stateId: "unit202.current-conductor.magnetic-field.state.out-of-page-teaching",
            displayName: "Current out of page — field circulation revealed (teaching)",
            pedagogicalState: "TEACHING",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["current-direction arrow/label", "field-circulation direction indicator"],
            parameters: { current_direction: "out_of_page", show_field_arrows: true },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.right-hand-grip-rule", 1, { current_direction: "out_of_page", show_field_arrows: true, field_rotation: "counterclockwise" }, "teaching"),
          },
          {
            stateId: "unit202.current-conductor.magnetic-field.state.out-of-page-assessment",
            displayName: "Current out of page — field circulation withheld (assessment)",
            pedagogicalState: "ASSESSMENT",
            annotationPolicy: "ASSESSMENT_NON_REVEALING",
            requiredLabels: [],
            parameters: { current_direction: "out_of_page", show_field_arrows: true },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.right-hand-grip-rule", 1, { current_direction: "out_of_page", show_field_arrows: true }, "assessment"),
          },
        ],
      },
      {
        sequence: 2,
        assetId: "unit202.right-hand-grip.teaching",
        familyId: "unit202.family.right-hand-grip",
        orderInFamily: 2,
        role: "MNEMONIC",
        displayName: "Right-hand grip rule — teaching mnemonic",
        loOrLesson: "LO5 — lesson.magnetism.effects-of-current",
        priority: "P0",
        priorityLabel: "P0",
        productionClass: "HYBRID",
        productionClassLabel: "HYBRID / PREMIUM TEACHING",
        governedDiagramBlueprintId: "magnetic.field_conductor_direction",
        instructionalPurpose:
          "Teach that gripping a current-carrying conductor with the right hand, thumb along conventional current direction, gives the direction the magnetic field circulates as shown by the curled fingers.",
        primaryReference: {
          sourceName: "Wikimedia Commons — Right-hand grip rule.svg",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Right-hand_grip_rule.svg",
          licence: "Public-domain dedication",
          qualityGrade: "A",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["THUMB = CURRENT", "FINGERS = MAGNETIC FIELD", "current-direction arrow", "magnetic-field direction indicator where appropriate"],
        immutableFacts: [
          "RIGHT hand",
          "thumb = conventional current direction",
          "curled fingers = magnetic-field circulation direction",
          "reversing current reverses magnetic-field rotation",
          "straight conductor axis",
        ],
        creativeFreedoms: ["premium hand rendering", "conductor styling", "composition", "finish"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: [
          "do not swap to the left hand",
          "do not depict the thumb pointing anywhere other than along the conductor's conventional current direction",
          "DO NOT MIRROR OR HORIZONTALLY FLIP HAND-RULE ARTWORK. Mirroring may change handedness (a mirrored right hand can read as a left hand) and invalidate the mnemonic -- never use a mirror/flip transform of this image to represent a reversed current direction.",
        ],
        exactDeliverable:
          "One premium illustration of a right hand gripping a straight current-carrying conductor, thumb and curled fingers clearly demonstrating the rule. Include the explanatory annotations THUMB = CURRENT and FINGERS = MAGNETIC FIELD plus the correct current and magnetic-field direction indicators -- this is a TEACHING asset and clear labels are part of the deliverable, not something to omit for visual cleanliness. Matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        assessmentNote: "Assessment contains NO hand — teaching only.",
        outputSubfolder: "teaching",
        filenameBase: "right-hand-grip-teaching-base",
        sharedBaseAudit: {
          classification: "SAFE_SHARED_BASE",
          action: "KEEP",
          rationale:
            "CC-11.7B/CC-11.7C: single canonical state, single learner-facing object (one hand demonstrating one rule) -- no sharing/composite question applies. One base image remains sufficient because the mnemonic teaches the RULE itself (thumb = current, curled fingers = field), not a specific current direction. CC-11.7C correction: this is NOT achieved by mirroring or flipping the hand artwork for a reversed-current companion image -- that approach is explicitly prohibited (mirroring can silently change handedness and invalidate the mnemonic). Directional application for a specific current direction continues entirely through the sibling governed PHENOMENON/deterministic states (unit202.current-conductor.magnetic-field), never through a transformed copy of this mnemonic image.",
        },
        canonicalStates: [
          {
            stateId: "unit202.right-hand-grip.teaching.state.teaching",
            displayName: "Right-hand grip mnemonic (teaching only)",
            pedagogicalState: "TEACHING",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["THUMB = CURRENT", "FINGERS = MAGNETIC FIELD", "current-direction arrow", "magnetic-field direction indicator where appropriate"],
            notes:
              "One base image is sufficient: the mnemonic teaches the RULE, not a specific current direction. Directional application for a specific current continues through the sibling PHENOMENON asset's governed deterministic states, never through a mirrored/flipped copy of this hand image (CC-11.7C: mirroring hand-rule artwork is prohibited -- see prohibitedChanges). Never appears in assessment -- the sibling PHENOMENON asset (unit202.current-conductor.magnetic-field) carries this family's assessment/teaching deterministic states instead.",
          },
        ],
      },
    ],
  },
  {
    familyId: "unit202.family.fleming-left-hand-motor",
    displayName: "Fleming's left-hand rule / motor effect",
    instructionalPurpose: "Teach the motor-effect phenomenon (a force on a current-carrying conductor in a magnetic field) and the mnemonic used to predict its direction.",
    governedConcept: "LO5 — lesson.magnetism.effects-of-current (motor.force_field_current)",
    familyNotes: "Phenomenon and mnemonic are genuinely distinct facts, same reasoning as the right-hand-grip family -- these two assets already existed separately in the prior flat catalogue and are grouped here without any content change.",
    assets: [
      // CC-11.7B §5/§6: unit202.motor.effect audited and SPLIT. Pole
      // orientation (N/S poles arranged horizontally vs vertically) is a
      // genuine physical apparatus-layout change -- the magnets themselves
      // occupy different positions in the scene, not something a
      // deterministic overlay can achieve on one base image. Current
      // direction (into/out of page) WITHIN one fixed pole orientation is,
      // by contrast, a deterministic dot/cross + force-arrow overlay
      // concern (same reasoning as the right-hand-grip conductor asset) --
      // so the split is by pole orientation only, not by all 4 parameter
      // combinations. Each resulting asset keeps 4 states (2 current
      // directions x 2 pedagogical modes), 8 states preserved in total,
      // 0 historical variants lost (all 8 existingCanonicalVariantId
      // values carried over unchanged onto their new parent asset).
      ...(
        [
          { poles: "N_S_horizontal" as const, orderSuffix: 1, slug: "horizontal-poles", label: "N/S poles arranged horizontally" },
          { poles: "N_S_vertical" as const, orderSuffix: 2, slug: "vertical-poles", label: "N/S poles arranged vertically" },
        ] as const
      ).map(({ poles, orderSuffix, slug, label }) => ({
        sequence: poles === "N_S_horizontal" ? 3 : 48,
        assetId: `unit202.motor.effect.${slug}`,
        familyId: "unit202.family.fleming-left-hand-motor",
        orderInFamily: orderSuffix,
        role: "PHENOMENON" as const,
        displayName: `Motor effect — conductor in magnetic field (${label})`,
        loOrLesson: "LO5 — lesson.magnetism.effects-of-current",
        priority: "P0" as const,
        priorityLabel: "P0",
        productionClass: "HYBRID" as const,
        productionClassLabel: "HYBRID",
        governedDiagramBlueprintId: "motor.force_field_current",
        instructionalPurpose: `Show a current-carrying conductor between magnetic poles (${label}) experiencing a force perpendicular to both the field and the current (the motor effect), distinct from the Fleming's-left-hand mnemonic itself.`,
        // CC-11.7C §1: was marked READY with a placeholder reference
        // ("external reference pending") -- no specific, locked external
        // reference is actually available yet. Corrected to BLOCKED;
        // pedagogical classification (REQUIRED) is unchanged.
        primaryReference: NOT_READY_REF,
        referenceReadiness: "NOT_READY" as const,
        annotationPolicy: "TEACHING_EXPLANATORY" as const,
        requiredLabels: [],
        immutableFacts: [
          "N to S field direction",
          "conductor positioned between the poles",
          `poles arranged ${poles === "N_S_horizontal" ? "horizontally" : "vertically"} -- this specific orientation is the defining physical fact of this asset, never mixed with the sibling orientation asset`,
          "current explicitly into or out of the page -- the base artwork must not bake in either direction (deterministic overlay per state)",
          "resulting force perpendicular to both field and current",
          "must remain visually distinct from the hand-rule mnemonic asset",
        ],
        creativeFreedoms: ["premium magnet/conductor physical-object rendering", "composition", "finish"],
        deterministicOverlayResponsibilities: ["N/S pole labels", "current-direction indicator (dot/cross)", "force-direction indicator (arrow)"],
        prohibitedChanges: [
          "do not include a hand in this asset -- that is the separate MNEMONIC asset in this family",
          `do not depict the ${poles === "N_S_horizontal" ? "vertical" : "horizontal"} pole arrangement in this asset -- that is the sibling ProductionAsset`,
          "do not bake a specific current or force direction into the base artwork -- this base must safely serve both current directions via deterministic overlay",
        ],
        exactDeliverable: `BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium illustration of magnet poles arranged ${poles === "N_S_horizontal" ? "horizontally" : "vertically"} with a conductor between them, direction-neutral (no baked current/force arrows), ready to receive deterministic N/S, current and force overlays, matching the existing governed motor-effect geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.`,
        outputSubfolder: "hybrid" as const,
        filenameBase: `motor-effect-${slug}-base`,
        sharedBaseAudit: {
          classification: "SHARED_BASE_WITH_CONDITIONS" as const,
          action: "KEEP_WITH_CONDITIONS" as const,
          rationale:
            "CC-11.7B: split from the original unit202.motor.effect (8 states, all 4 pole/current combinations on one asset). Pole orientation is a genuine apparatus-layout change requiring separate artwork; current direction within one fixed orientation is a deterministic overlay concern, matching the right-hand-grip conductor asset's reasoning.",
          conditions: [
            "base artwork must show N/S pole labels ready for deterministic overlay, not baked as final text",
            "base artwork must leave the conductor and the space around it clear of any baked current-direction or force-direction arrow",
          ],
          splitFrom: "unit202.motor.effect",
          splitSiblings: [`unit202.motor.effect.${poles === "N_S_horizontal" ? "vertical-poles" : "horizontal-poles"}`],
        },
        canonicalStates: (
          [
            { direction: "into_page" as const, force: poles === "N_S_horizontal" ? ("down" as const) : ("left" as const) },
            { direction: "out_of_page" as const, force: poles === "N_S_horizontal" ? ("up" as const) : ("right" as const) },
          ] as const
        ).flatMap(({ direction, force }) => [
          {
            stateId: `unit202.motor.effect.${slug}.state.${direction.replace(/_/g, "-")}-teaching`,
            displayName: `${poles.replace(/_/g, "/")} poles, current ${direction.replace(/_/g, " ")} — force revealed (teaching)`,
            pedagogicalState: "TEACHING" as const,
            annotationPolicy: "TEACHING_EXPLANATORY" as const,
            requiredLabels: ["N", "S", "current-direction indicator", "force-direction indicator"],
            parameters: { pole_labels: poles, current_direction: direction, show_force_arrow: true },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.motor-principle-force", 1, { pole_labels: poles, current_direction: direction, show_force_arrow: true, force_direction: force }, "teaching"),
          },
          {
            stateId: `unit202.motor.effect.${slug}.state.${direction.replace(/_/g, "-")}-assessment`,
            displayName: `${poles.replace(/_/g, "/")} poles, current ${direction.replace(/_/g, " ")} — force withheld (assessment)`,
            pedagogicalState: "ASSESSMENT" as const,
            annotationPolicy: "ASSESSMENT_NON_REVEALING" as const,
            requiredLabels: [],
            notes: "Pole orientation and current direction are the GIVEN stimulus; force direction is the assessed answer and must not appear.",
            parameters: { pole_labels: poles, current_direction: direction, show_force_arrow: true },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.motor-principle-force", 1, { pole_labels: poles, current_direction: direction, show_force_arrow: true }, "assessment"),
          },
        ]),
      })),
      {
        sequence: 4,
        assetId: "unit202.fleming-left-hand.teaching",
        familyId: "unit202.family.fleming-left-hand-motor",
        orderInFamily: 3,
        role: "MNEMONIC",
        displayName: "Fleming left-hand rule — motor teaching mnemonic",
        loOrLesson: "LO5 — lesson.magnetism.effects-of-current",
        priority: "P0",
        priorityLabel: "P0",
        productionClass: "HYBRID",
        productionClassLabel: "HYBRID / PREMIUM TEACHING",
        instructionalPurpose:
          "Teach the motor-effect hand mnemonic: thuMb = Motion/force, First finger = Field, seCond finger = Current, each mutually perpendicular on the left hand.",
        primaryReference: {
          sourceName: "Wikimedia Commons — Fleming's Left Hand Rule.png",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Fleming%27s_Left_Hand_Rule.png",
          licence: "Openly licensed -- treat primarily as geometry/reference, not artwork to imitate",
          qualityGrade: "B visual / strong semantic cross-check",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["MOTION / FORCE", "FIELD", "CURRENT"],
        immutableFacts: [
          "LEFT hand",
          "thumb = force/motion",
          "first (index) finger = magnetic FIELD",
          "second (middle) finger = conventional CURRENT",
          "mutually perpendicular relationship between all three",
        ],
        creativeFreedoms: ["premium hand rendering", "finger-labelling styling", "composition", "finish"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: [
          "do not swap to the right hand",
          "do not reassign which finger represents which quantity",
          "DO NOT MIRROR OR HORIZONTALLY FLIP HAND-RULE ARTWORK. Mirroring may change handedness (a mirrored left hand can read as a right hand) and invalidate the mnemonic -- never use a mirror/flip transform of this image for any other pole/current combination.",
        ],
        exactDeliverable:
          "One premium illustration of a left hand with thumb, first finger and second finger held mutually perpendicular, clearly and unambiguously demonstrating Force/Field/Current correspondence. Include the explanatory annotations MOTION / FORCE, FIELD and CURRENT on the corresponding digit -- this is a TEACHING asset and clear labels are part of the deliverable. Matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        assessmentNote: "Assessment: NO hand. Use the PHENOMENON asset's physical motor-effect apparatus instead.",
        outputSubfolder: "teaching",
        filenameBase: "fleming-left-hand-teaching-base",
        sharedBaseAudit: {
          classification: "SAFE_SHARED_BASE",
          action: "KEEP",
          rationale:
            "CC-11.7B: single canonical state, single learner-facing object -- no sharing/composite question applies. The mnemonic teaches the Force/Field/Current correspondence itself, not a specific pole/current combination, so it does not need a companion image per pole-orientation the way the sibling PHENOMENON assets do. CC-11.7C: this is never achieved by mirroring/flipping the hand artwork -- see prohibitedChanges.",
        },
        canonicalStates: [
          {
            stateId: "unit202.fleming-left-hand.teaching.state.teaching",
            displayName: "Fleming's left-hand mnemonic (teaching only)",
            pedagogicalState: "TEACHING",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["MOTION / FORCE", "FIELD", "CURRENT"],
            notes: "One base image is sufficient -- the mnemonic teaches the F/B/I correspondence, not a specific pole/current combination. Never appears in assessment -- the sibling PHENOMENON assets (unit202.motor.effect.horizontal-poles / .vertical-poles) carry this family's assessment/teaching deterministic states.",
          },
        ],
      },
    ],
  },
  {
    familyId: "unit202.family.fleming-right-hand-generator",
    displayName: "Fleming's right-hand rule / AC generator effect",
    instructionalPurpose: "Teach the generator-effect phenomenon (a rotating loop between magnetic poles induces an EMF) and the mnemonic used to predict induced-current direction.",
    governedConcept: "LO5 — lesson.emf.ac-generation-principles / lesson.magnetism.effects-of-current (generator.rotating_loop)",
    familyNotes: "Groups the rotating-loop generator phenomenon with its own hand-rule mnemonic, the same phenomenon+mnemonic pattern as the other two hand-rule families -- unifies what were two separately-lesson-linked but pedagogically inseparable assets in the prior flat catalogue.",
    assets: [
      // CC-11.7B §5/§6: unit202.generator.rotating-loop audited and SPLIT.
      // "Loop plane facing poles" (near-zero EMF) and "loop plane edge-on
      // to poles" (near-peak EMF) are two materially different 3D poses of
      // the same physical loop-on-axis apparatus -- a rectangular loop
      // shown face-on has a completely different silhouette from the same
      // loop shown edge-on (a thin line/sliver). No deterministic overlay
      // can rotate a loop's rendered pose in a premium illustration; this
      // is exactly the "genuinely separate rendered physical states are
      // pedagogically superior" case the brief itself invited scrutiny of
      // (§5 GENERATOR). 2 states preserved in total (now 1 per asset), 0
      // historical variants lost.
      ...(
        [
          { phase: "horizontal" as const, orderSuffix: 1, slug: "horizontal", label: "loop plane facing poles — near-zero EMF", pose: "loop plane facing the poles head-on (widest visible loop face)" },
          { phase: "vertical" as const, orderSuffix: 2, slug: "vertical", label: "loop plane edge-on to poles — near-peak EMF", pose: "loop plane edge-on to the poles (loop seen from the side, near its thinnest silhouette)" },
        ] as const
      ).map(({ phase, orderSuffix, slug, label, pose }) => ({
        sequence: phase === "horizontal" ? 5 : 49,
        assetId: `unit202.generator.rotating-loop.${slug}`,
        familyId: "unit202.family.fleming-right-hand-generator",
        orderInFamily: orderSuffix,
        role: "PHENOMENON" as const,
        displayName: `Simple rotating-loop AC generator — ${label}`,
        loOrLesson: "LO5 — lesson.emf.ac-generation-principles",
        priority: "P0" as const,
        priorityLabel: "P0",
        productionClass: "HYBRID" as const,
        productionClassLabel: "HYBRID",
        governedDiagramBlueprintId: "generator.rotating_loop",
        instructionalPurpose: `Show a single loop of wire, ${pose}, rotating on a central axis between N and S poles, establishing the physical basis of single-loop AC generation at Level 2 depth.`,
        primaryReference: {
          sourceName: "Wikimedia Commons — Diagram of single-phase generator with two poles.svg",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Diagram_of_single-phase_generator_with_two_poles.svg",
          licence: "CC0/public-domain reference material where recorded",
          qualityGrade: "A concept",
        },
        secondaryReference: {
          sourceName: "Pearson Scott Foresman — Dynamo (PSF).png",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Dynamo_(PSF).png",
          licence: "CC0/public-domain",
          qualityGrade: "A physical context",
        },
        referenceReadiness: "READY" as const,
        annotationPolicy: "TEACHING_EXPLANATORY" as const,
        requiredLabels: ["N", "S", "coil/loop", "rotation indicator", "output where useful"],
        immutableFacts: [
          "N/S magnetic poles",
          "loop/coil between the poles",
          `${pose} -- this specific pose is the defining physical fact of this asset, never mixed with the sibling pose asset`,
          "central rotational axis",
          "output/slip-ring concept at governed Level-2 abstraction",
          "rotating conductor cuts magnetic flux",
        ],
        creativeFreedoms: ["premium pole/housing/loop rendering", "composition", "finish"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: [
          "do not substitute a detailed modern alternator",
          "do not add three-phase windings, phasors or brushes/commutator detail beyond governed scope",
          `do not depict the ${phase === "horizontal" ? "edge-on" : "face-on"} loop pose in this asset -- that is the sibling ProductionAsset`,
        ],
        exactDeliverable: `One premium illustration of a single wire loop, ${pose}, rotating on a central axis between clearly labelled N and S poles, with a minimal slip-ring/output connection concept, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.`,
        outputSubfolder: "hybrid" as const,
        filenameBase: `generator-rotating-loop-${slug}-base`,
        sharedBaseAudit: {
          classification: "SEPARATE_ARTWORK_REQUIRED" as const,
          action: "SPLIT" as const,
          rationale:
            "CC-11.7B: split from the original unit202.generator.rotating-loop (2 states on 1 asset). The loop's face-on vs edge-on pose is a materially different silhouette/scene, not a labelling or overlay difference -- no deterministic overlay can rotate a loop's rendered 3D pose. Confirms brief §5's own invited scrutiny: reuse would have been chosen merely to reduce workload, not because it is pedagogically or technically honest.",
          splitFrom: "unit202.generator.rotating-loop",
          splitSiblings: [`unit202.generator.rotating-loop.${phase === "horizontal" ? "vertical" : "horizontal"}`],
        },
        canonicalStates: [
          {
            stateId: `unit202.generator.rotating-loop.${slug}.state.${phase === "horizontal" ? "near-zero-emf" : "near-peak-emf"}`,
            displayName: label.replace(/^./, (c) => c.toUpperCase()),
            pedagogicalState: "MULTI_STATE" as const,
            annotationPolicy: "TEACHING_EXPLANATORY" as const,
            requiredLabels: ["N", "S", "coil/loop", "rotation indicator", "output where useful"],
            notes: "Confirmed sufficient at two states (brief §14, re-confirmed CC-11.7B §5): near-zero and near-peak EMF are the two pedagogically load-bearing orientations; additional phase/animation-like states were considered and rejected as not materially improving understanding at Level 2 depth.",
            parameters: { rotation_phase: phase },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.ac-generator-rotating-loop", 1, { rotation_phase: phase }, "both"),
          },
        ],
      })),
      {
        sequence: 6,
        assetId: "unit202.fleming-right-hand.teaching",
        familyId: "unit202.family.fleming-right-hand-generator",
        orderInFamily: 3,
        role: "MNEMONIC",
        displayName: "Fleming right-hand rule — generator teaching mnemonic",
        loOrLesson: "LO5 — lesson.magnetism.effects-of-current",
        priority: "P0",
        priorityLabel: "P0",
        productionClass: "HYBRID",
        productionClassLabel: "HYBRID / PREMIUM TEACHING",
        instructionalPurpose:
          "Teach the generator-effect hand mnemonic: thuMb = Motion of the conductor, First finger = Field, seCond finger = induced Current/EMF, each mutually perpendicular on the right hand.",
        primaryReference: {
          sourceName: "Fleming's original 1902 right-hand-rule figure (Wikimedia Commons)",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Fleming%27s_right_hand_rule.png",
          licence: "Public-domain historical work",
          qualityGrade: "A+",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["MOTION", "FIELD", "INDUCED CURRENT / EMF"],
        immutableFacts: [
          "RIGHT hand",
          "thumb = conductor MOTION",
          "first (index) finger = magnetic FIELD",
          "second (middle) finger = induced current/EMF",
          "three directions mutually perpendicular",
        ],
        creativeFreedoms: ["premium hand rendering", "finger-labelling styling", "composition", "finish"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: [
          "do not swap to the left hand",
          "do not reassign which finger represents which quantity",
          "DO NOT MIRROR OR HORIZONTALLY FLIP HAND-RULE ARTWORK. Mirroring may change handedness (a mirrored right hand can read as a left hand) and invalidate the mnemonic -- never use a mirror/flip transform of this image for any other rotation phase.",
        ],
        exactDeliverable:
          "One premium illustration of a right hand with thumb, first finger and second finger held mutually perpendicular, clearly and unambiguously demonstrating Motion/Field/induced-Current correspondence. Include the explanatory annotations MOTION, FIELD and INDUCED CURRENT / EMF on the corresponding digit -- this is a TEACHING asset and clear labels are part of the deliverable. Matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        assessmentNote: "Assessment: NO hand.",
        outputSubfolder: "teaching",
        filenameBase: "fleming-right-hand-teaching-base",
        sharedBaseAudit: {
          classification: "SAFE_SHARED_BASE",
          action: "KEEP",
          rationale:
            "CC-11.7B: single canonical state, single learner-facing object -- no sharing/composite question applies. The mnemonic teaches the Motion/Field/induced-Current correspondence itself, not a specific loop pose, so it does not need a companion image per rotation phase the way the sibling PHENOMENON assets do. CC-11.7C: this is never achieved by mirroring/flipping the hand artwork -- see prohibitedChanges.",
        },
        canonicalStates: [
          {
            stateId: "unit202.fleming-right-hand.teaching.state.teaching",
            displayName: "Fleming's right-hand mnemonic (teaching only)",
            pedagogicalState: "TEACHING",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["MOTION", "FIELD", "INDUCED CURRENT / EMF"],
            notes: "One base image is sufficient -- the mnemonic teaches the M/F/I correspondence generally. Never appears in assessment -- the sibling PHENOMENON assets (unit202.generator.rotating-loop.horizontal / .vertical) carry this family's deterministic states.",
          },
        ],
      },
    ],
  },
  {
    familyId: "unit202.family.levers",
    displayName: "Lever classes",
    instructionalPurpose: "Teach the three lever classes as distinct, individually recognisable fulcrum/effort/load arrangements.",
    governedConcept: "LO3 — lesson.foundation.physics.simple-machines (mechanical.lever_arrangement)",
    familyNotes:
      "Split into three separate CONFIGURATION assets rather than one image showing all three classes at once (task brief's own explicit example): forcing all three arrangements into a single illustration would either cramp the composition or blur the very distinction the learner must be able to recognise. Each class gets its own clean, unambiguous illustration.",
    assets: [
      {
        sequence: 7,
        assetId: "unit202.levers.class-1",
        familyId: "unit202.family.levers",
        orderInFamily: 1,
        role: "CONFIGURATION",
        displayName: "Lever — Class I",
        loOrLesson: "LO3 — lesson.foundation.physics.simple-machines",
        priority: "P0",
        priorityLabel: "P0",
        productionClass: "HYBRID",
        productionClassLabel: "HYBRID",
        governedDiagramBlueprintId: "mechanical.lever_arrangement",
        instructionalPurpose: "Show a Class I lever arrangement (fulcrum between effort and load) so a learner can recognise it from the arrangement itself.",
        primaryReference: {
          sourceName: "Pearson Scott Foresman — Lever (PSF).svg",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Lever_(PSF).svg",
          licence: "Public domain",
          qualityGrade: "A+",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["EFFORT", "LOAD", "FULCRUM"],
        immutableFacts: ["fulcrum positioned between the effort point and the load point"],
        creativeFreedoms: ["premium physical lever-rig rendering", "material/finish", "composition"],
        deterministicOverlayResponsibilities: ["arm-dimension labels where taught"],
        prohibitedChanges: ["do not blend this with the Class II or Class III arrangement"],
        exactDeliverable:
          "One premium illustration of a bar with the fulcrum positioned between a clearly marked effort point and load point, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "hybrid",
        filenameBase: "levers-class-1-base",
        sharedBaseAudit: {
          classification: "SAFE_SHARED_BASE",
          action: "KEEP",
          rationale: "CC-11.7B: 'recognition' and 'moment-balance' states depict the identical physical lever rig (same fulcrum/effort/load positions) -- the only difference is whether deterministic effort-arm/load-arm distance annotations are added on top. No pose, configuration or scene change.",
        },
        canonicalStates: [
          {
            stateId: "unit202.levers.class-1.state.recognition",
            displayName: "Class I recognition (no distances)",
            pedagogicalState: "MULTI_STATE",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["EFFORT", "LOAD", "FULCRUM"],
            parameters: { lever_class: "class_1", show_distances: false },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.lever-class-arrangement", 1, { lever_class: "class_1", show_distances: false }, "both"),
          },
          {
            stateId: "unit202.levers.class-1.state.moment-balance",
            displayName: "Class I with effort-arm/load-arm distances",
            pedagogicalState: "MULTI_STATE",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["EFFORT", "LOAD", "FULCRUM", "effort-arm distance", "load-arm distance"],
            parameters: { lever_class: "class_1", show_distances: true },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.lever-class-arrangement", 1, { lever_class: "class_1", show_distances: true }, "both"),
          },
        ],
      },
      {
        sequence: 8,
        assetId: "unit202.levers.class-2",
        familyId: "unit202.family.levers",
        orderInFamily: 2,
        role: "CONFIGURATION",
        displayName: "Lever — Class II",
        loOrLesson: "LO3 — lesson.foundation.physics.simple-machines",
        priority: "P0",
        priorityLabel: "P0",
        productionClass: "HYBRID",
        productionClassLabel: "HYBRID",
        governedDiagramBlueprintId: "mechanical.lever_arrangement",
        instructionalPurpose: "Show a Class II lever arrangement (load between fulcrum and effort) so a learner can recognise it from the arrangement itself.",
        primaryReference: {
          sourceName: "Pearson Scott Foresman — Lever (PSF).svg",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Lever_(PSF).svg",
          licence: "Public domain",
          qualityGrade: "A+",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["EFFORT", "LOAD", "FULCRUM"],
        immutableFacts: ["load positioned between the fulcrum and the effort point"],
        creativeFreedoms: ["premium physical lever-rig rendering", "material/finish", "composition"],
        deterministicOverlayResponsibilities: ["arm-dimension labels where taught"],
        prohibitedChanges: ["do not blend this with the Class I or Class III arrangement"],
        exactDeliverable:
          "One premium illustration of a bar with the load positioned between a clearly marked fulcrum and effort point, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "hybrid",
        filenameBase: "levers-class-2-base",
        sharedBaseAudit: {
          classification: "SAFE_SHARED_BASE",
          action: "KEEP",
          rationale: "CC-11.7B: 'recognition' and 'moment-balance' states depict the identical physical lever rig (same fulcrum/effort/load positions) -- the only difference is whether deterministic effort-arm/load-arm distance annotations are added on top. No pose, configuration or scene change.",
        },
        canonicalStates: [
          {
            stateId: "unit202.levers.class-2.state.recognition",
            displayName: "Class II recognition (no distances)",
            pedagogicalState: "MULTI_STATE",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["EFFORT", "LOAD", "FULCRUM"],
            parameters: { lever_class: "class_2", show_distances: false },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.lever-class-arrangement", 1, { lever_class: "class_2", show_distances: false }, "both"),
          },
          {
            stateId: "unit202.levers.class-2.state.moment-balance",
            displayName: "Class II with effort-arm/load-arm distances",
            pedagogicalState: "MULTI_STATE",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["EFFORT", "LOAD", "FULCRUM", "effort-arm distance", "load-arm distance"],
            parameters: { lever_class: "class_2", show_distances: true },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.lever-class-arrangement", 1, { lever_class: "class_2", show_distances: true }, "both"),
          },
        ],
      },
      {
        sequence: 9,
        assetId: "unit202.levers.class-3",
        familyId: "unit202.family.levers",
        orderInFamily: 3,
        role: "CONFIGURATION",
        displayName: "Lever — Class III",
        loOrLesson: "LO3 — lesson.foundation.physics.simple-machines",
        priority: "P0",
        priorityLabel: "P0",
        productionClass: "HYBRID",
        productionClassLabel: "HYBRID",
        governedDiagramBlueprintId: "mechanical.lever_arrangement",
        instructionalPurpose: "Show a Class III lever arrangement (effort between fulcrum and load) so a learner can recognise it from the arrangement itself.",
        primaryReference: {
          sourceName: "Pearson Scott Foresman — Lever (PSF).svg",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Lever_(PSF).svg",
          licence: "Public domain",
          qualityGrade: "A+",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["EFFORT", "LOAD", "FULCRUM"],
        immutableFacts: ["effort positioned between the fulcrum and the load point"],
        creativeFreedoms: ["premium physical lever-rig rendering", "material/finish", "composition"],
        deterministicOverlayResponsibilities: ["arm-dimension labels where taught"],
        prohibitedChanges: ["do not blend this with the Class I or Class II arrangement"],
        exactDeliverable:
          "One premium illustration of a bar with the effort positioned between a clearly marked fulcrum and load point, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "hybrid",
        filenameBase: "levers-class-3-base",
        sharedBaseAudit: {
          classification: "SAFE_SHARED_BASE",
          action: "KEEP",
          rationale: "CC-11.7B: 'recognition' and 'moment-balance' states depict the identical physical lever rig (same fulcrum/effort/load positions) -- the only difference is whether deterministic effort-arm/load-arm distance annotations are added on top. No pose, configuration or scene change.",
        },
        canonicalStates: [
          {
            stateId: "unit202.levers.class-3.state.recognition",
            displayName: "Class III recognition (no distances)",
            pedagogicalState: "MULTI_STATE",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["EFFORT", "LOAD", "FULCRUM"],
            parameters: { lever_class: "class_3", show_distances: false },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.lever-class-arrangement", 1, { lever_class: "class_3", show_distances: false }, "both"),
          },
          {
            stateId: "unit202.levers.class-3.state.moment-balance",
            displayName: "Class III with effort-arm/load-arm distances",
            pedagogicalState: "MULTI_STATE",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["EFFORT", "LOAD", "FULCRUM", "effort-arm distance", "load-arm distance"],
            parameters: { lever_class: "class_3", show_distances: true },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.lever-class-arrangement", 1, { lever_class: "class_3", show_distances: true }, "both"),
          },
        ],
      },
    ],
  },
  {
    familyId: "unit202.family.pulleys",
    displayName: "Pulleys",
    instructionalPurpose: "Teach the fixed-vs-movable pulley distinction and the mechanical-advantage consequence each configuration has.",
    governedConcept: "LO3 — lesson.foundation.physics.simple-machines (mechanical.pulley_arrangement)",
    familyNotes:
      "CONFIRMED, not assumed: two assets (fixed; movable), not more. Reviewed the full governed evidence before finalising this count -- FP-CONCEPT-PULLEY-001, FP-PULLEY-FIXED-VS-MOVABLE-001, FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001 and FP-REL-PULLEY-FORCE-DISTANCE-TRADEOFF-001 (scripts/content/data/cc04-unit202-electrical-science.ts) and cap.foundational.pulleys.recognise together teach fixed-vs-movable and the qualitative MA-vs-supporting-segments relationship, never a specific two-/three-pulley or block-and-tackle configuration; the calculation engine's own PULLEY_SCENARIOS is a two-way more/fewer-supporting-sections comparator, not an N-pulley model. Multiple governed artefacts explicitly declare multi-pulley/block-and-tackle content out of scope (the existing visual-semantic-contract's mustNotShow, PulleyDiagram.tsx's own header comment). No third asset is added here -- doing so would manufacture syllabus content that was never governed, exactly what task brief §11 warns against.",
    assets: [
      {
        sequence: 10,
        assetId: "unit202.pulleys.fixed",
        familyId: "unit202.family.pulleys",
        orderInFamily: 1,
        role: "CONFIGURATION",
        displayName: "Fixed pulley",
        loOrLesson: "LO3 — lesson.foundation.physics.simple-machines",
        priority: "P0",
        priorityLabel: "P0",
        productionClass: "HYBRID",
        productionClassLabel: "HYBRID",
        governedDiagramBlueprintId: "mechanical.pulley_arrangement",
        instructionalPurpose: "Show a fixed pulley: direction change only, mechanical advantage approximately 1.",
        primaryReference: {
          sourceName: "Wikimedia Commons — Pulley1a.svg",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Pulley1a.svg",
          licence: "Public-domain where recorded",
          qualityGrade: "B+ overall -- simplify to governed Unit 202 scope",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["EFFORT", "LOAD", "fixed anchor point"],
        immutableFacts: ["fixed anchor point", "pulley wheel changes rope direction only", "mechanical advantage approximately 1", "physically continuous/plausible rope path"],
        creativeFreedoms: ["premium pulley/support-hardware rendering", "composition", "finish"],
        deterministicOverlayResponsibilities: ["rope path (may remain deterministic if necessary)"],
        prohibitedChanges: ["do NOT introduce block-and-tackle complexity"],
        exactDeliverable:
          "One premium illustration of a fixed pulley wheel with a fixed anchor point and a physically plausible rope path with effort/load ends, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "hybrid",
        filenameBase: "pulleys-fixed-base",
        canonicalStates: [
          {
            stateId: "unit202.pulleys.fixed.state.teaching",
            displayName: "Fixed pulley",
            pedagogicalState: "MULTI_STATE",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["EFFORT", "LOAD", "fixed anchor point"],
            parameters: { arrangement: "fixed" },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.pulley-fixed-vs-movable", 1, { arrangement: "fixed" }, "both"),
          },
        ],
      },
      {
        sequence: 11,
        assetId: "unit202.pulleys.movable",
        familyId: "unit202.family.pulleys",
        orderInFamily: 2,
        role: "CONFIGURATION",
        displayName: "Movable pulley",
        loOrLesson: "LO3 — lesson.foundation.physics.simple-machines",
        priority: "P0",
        priorityLabel: "P0",
        productionClass: "HYBRID",
        productionClassLabel: "HYBRID",
        governedDiagramBlueprintId: "mechanical.pulley_arrangement",
        instructionalPurpose: "Show a simple movable pulley: two supporting rope segments, mechanical advantage approximately 2.",
        primaryReference: {
          sourceName: "Wikimedia Commons — Pulley1a.svg",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Pulley1a.svg",
          licence: "Public-domain where recorded",
          qualityGrade: "B+ overall -- simplify to governed Unit 202 scope",
        },
        secondaryReference: {
          sourceName: "Historical simple-pulley material (secondary geometry cross-check)",
          sourceUrl: "",
          licence: "to be recorded when selected",
          qualityGrade: "secondary",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["EFFORT", "LOAD", "supporting-segment count"],
        immutableFacts: ["exactly two supporting rope segments", "mechanical advantage approximately 2", "physically continuous/plausible rope path"],
        creativeFreedoms: ["premium pulley/load/support-hardware rendering", "composition", "finish"],
        deterministicOverlayResponsibilities: ["rope path (may remain deterministic if necessary)"],
        prohibitedChanges: ["do NOT introduce block-and-tackle complexity"],
        exactDeliverable:
          "One premium illustration of a movable pulley with exactly two supporting rope segments and a physically plausible rope path with effort/load ends, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "hybrid",
        filenameBase: "pulleys-movable-base",
        canonicalStates: [
          {
            stateId: "unit202.pulleys.movable.state.teaching",
            displayName: "Movable pulley",
            pedagogicalState: "MULTI_STATE",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["EFFORT", "LOAD", "supporting-segment count"],
            parameters: { arrangement: "movable" },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.pulley-fixed-vs-movable", 1, { arrangement: "movable" }, "both"),
          },
        ],
      },
    ],
  },
  {
    familyId: "unit202.family.magnetism",
    displayName: "Magnetism — field and pole interaction",
    instructionalPurpose: "Teach the bar-magnet field pattern and the attraction/repulsion relationship between two magnets' poles.",
    governedConcept: "LO5 — lesson.magnetism.fundamentals (magnetic.flux_field_lines / magnetic.pole_interaction)",
    familyNotes:
      "Two assets covering two genuinely distinct governed relationships (a single magnet's own field pattern; the interaction between two magnets' poles). A separate flux-density-comparison asset is not currently included -- the existing deterministic `magnetic.flux_field_lines` diagram already covers density comparison and no additional premium illustration is currently justified for it.",
    assets: [
      {
        sequence: 12,
        assetId: "unit202.magnet.field",
        familyId: "unit202.family.magnetism",
        orderInFamily: 1,
        role: "PHENOMENON",
        displayName: "Bar magnet and magnetic field",
        loOrLesson: "LO5 — lesson.magnetism.fundamentals",
        priority: "P0",
        priorityLabel: "P0",
        productionClass: "HYBRID",
        productionClassLabel: "HYBRID",
        governedDiagramBlueprintId: "magnetic.flux_field_lines",
        instructionalPurpose: "Show a bar magnet with its external magnetic field pattern, N to S, as the basis for flux/flux-density teaching.",
        primaryReference: {
          sourceName: "Wikimedia Commons — DipolMagnet.svg",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:DipolMagnet.svg",
          licence: "Public-domain dedication",
          qualityGrade: "A+",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["N", "S", "field-line direction"],
        immutableFacts: ["meaningful field-line geometry", "external field direction runs N to S", "field-line density used meaningfully where density is taught"],
        creativeFreedoms: ["premium magnet-body rendering (material, finish)", "composition"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: ["do not draw field lines that reverse direction or cross incorrectly"],
        exactDeliverable:
          "One premium illustration of a bar magnet body ready to receive a deterministic N/S-labelled field-line overlay, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "hybrid",
        filenameBase: "magnet-field-base",
        sharedBaseAudit: {
          classification: "SAFE_SHARED_BASE",
          action: "KEEP",
          rationale: "CC-11.7B: the density-comparison state adds a deterministic comparison callout to the same bar magnet + field-line composition -- the magnet's position and field-line geometry are unchanged. The base artwork already documents this as an overlay concern (exactDeliverable: 'ready to receive a deterministic N/S-labelled field-line overlay').",
        },
        canonicalStates: [
          {
            stateId: "unit202.magnet.field.state.field-only",
            displayName: "Bar magnet field pattern (no density comparison)",
            pedagogicalState: "MULTI_STATE",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["N", "S", "field-line direction"],
            parameters: { density_comparison: false },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.magnetic-flux-density-comparison", 1, { density_comparison: false }, "both"),
          },
          {
            stateId: "unit202.magnet.field.state.density-comparison",
            displayName: "Bar magnet field with flux-density comparison (same flux, different cross-section)",
            pedagogicalState: "MULTI_STATE",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["N", "S", "field-line direction", "flux-density comparison caption"],
            parameters: { density_comparison: true },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.magnetic-flux-density-comparison", 1, { density_comparison: true }, "both"),
          },
        ],
      },
      // CC-11.7B §5/§6: unit202.magnet.poles audited and SPLIT. The
      // pre-audit exactDeliverable already literally asked for "Two
      // premium illustrations (like poles facing; unlike poles facing)"
      // inside one ProductionAsset/one prompt -- exactly the brief's own
      // "NOT ACCEPTABLE" composite pattern. The two arrangements also
      // differ in genuine physical spacing (attracting unlike poles drawn
      // close/near-touching; repelling like poles drawn with a visible
      // gap and compressed field lines) -- a real scene difference, not
      // an arrow-direction overlay. 4 states preserved in total (2 per
      // asset), 0 historical variants lost.
      ...(
        [
          { pairing: "like_poles_facing" as const, orderSuffix: 2, slug: "like", label: "like poles facing (repel)" },
          { pairing: "unlike_poles_facing" as const, orderSuffix: 3, slug: "unlike", label: "unlike poles facing (attract)" },
        ] as const
      ).map(({ pairing, orderSuffix, slug, label }) => ({
        sequence: pairing === "like_poles_facing" ? 13 : 50,
        assetId: `unit202.magnet.poles.${slug}`,
        familyId: "unit202.family.magnetism",
        orderInFamily: orderSuffix,
        role: "COMPARISON" as const,
        displayName: `Magnetic pole ${pairing === "like_poles_facing" ? "repulsion" : "attraction"} — ${label}`,
        loOrLesson: "LO5 — lesson.magnetism.fundamentals",
        priority: "P1" as const,
        priorityLabel: "P1",
        productionClass: "HYBRID" as const,
        productionClassLabel: "HYBRID",
        governedDiagramBlueprintId: "magnetic.pole_interaction",
        instructionalPurpose: `Show ${label} from the pole labels on two bar magnets.`,
        // CC-11.7C §1: "historical iron-filings illustrations" was a
        // category description, not a specific locked reference (no URL,
        // no named source) -- corrected to BLOCKED; pedagogical
        // classification (REQUIRED) is unchanged.
        primaryReference: NOT_READY_REF,
        referenceReadiness: "NOT_READY" as const,
        annotationPolicy: "TEACHING_EXPLANATORY" as const,
        requiredLabels: ["N", "S", "attract/repel force-arrow indicator"],
        immutableFacts: [
          pairing === "like_poles_facing" ? "like poles repel" : "unlike poles attract",
          `magnets must be composed with a spacing appropriate to ${pairing === "like_poles_facing" ? "repulsion (visible gap, compressed/deflected field lines)" : "attraction (close together, merging field lines)"} -- this specific spacing is the defining physical fact of this asset, never mixed with the sibling asset`,
          "field behaviour between the two magnets must remain physically meaningful",
        ],
        creativeFreedoms: ["premium magnet-body rendering", "composition"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: [
          "this premium asset is TEACHING-only -- the separate deterministic magnetic.pole_interaction diagram (not this asset) is what governs the assessment-mode reveal/withhold state; do not treat this teaching image's own labels as an assessment-answer leak",
          `do not depict the ${pairing === "like_poles_facing" ? "unlike-poles/attracting" : "like-poles/repelling"} arrangement in this asset -- that is the sibling ProductionAsset`,
        ],
        exactDeliverable: `BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium illustration of two bar magnets arranged ${label}, matching the reference relationship exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.`,
        outputSubfolder: "hybrid" as const,
        filenameBase: `magnet-poles-${slug}-base`,
        sharedBaseAudit: {
          classification: "SEPARATE_ARTWORK_REQUIRED" as const,
          action: "SPLIT" as const,
          rationale:
            "CC-11.7B: split from the original unit202.magnet.poles (4 states on 1 asset whose own exactDeliverable already literally asked for 'Two premium illustrations' in one prompt). Attracting vs repelling poles are conventionally composed with genuinely different magnet spacing/field-line behaviour, not merely a different arrow direction on identical geometry.",
          splitFrom: "unit202.magnet.poles",
          splitSiblings: [`unit202.magnet.poles.${pairing === "like_poles_facing" ? "unlike" : "like"}`],
        },
        canonicalStates: [
          {
            stateId: `unit202.magnet.poles.${slug}.state.teaching`,
            displayName: `${label} — force revealed (teaching)`,
            pedagogicalState: "TEACHING" as const,
            annotationPolicy: "TEACHING_EXPLANATORY" as const,
            requiredLabels: ["N", "S", "attract/repel force-arrow indicator"],
            parameters: { pole_pairing: pairing },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.magnetic-pole-interaction", 1, { pole_pairing: pairing, show_pole_force: true }, "teaching"),
          },
          {
            stateId: `unit202.magnet.poles.${slug}.state.assessment`,
            displayName: `${label} — force withheld (assessment)`,
            pedagogicalState: "ASSESSMENT" as const,
            annotationPolicy: "ASSESSMENT_NON_REVEALING" as const,
            requiredLabels: [],
            notes: "Pole labels are the GIVEN stimulus; attract/repel is the assessed answer and must not appear.",
            parameters: { pole_pairing: pairing },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.magnetic-pole-interaction", 1, { pole_pairing: pairing }, "assessment"),
          },
        ],
      })),
      // CC-11.7A §1/§2/§8: CC-11.7 audit finding 4 ("Permanent magnet vs
      // electromagnet comparison", cap.magnetism.compare_permanent_electromagnet
      // -- reports/instructional-visuals/unit202-comprehensive-visual-audit.md
      // §4) materialised as USEFUL, not REQUIRED (Level 2 depth keeps it
      // below REQUIRED per the audit). The intended learner-facing
      // deliverable is one side-by-side comparison, so this is
      // deliberately one image-generation job / one ProductionAsset (task
      // brief §8's own "CORRECT EXAMPLE — PERMANENT MAGNET VS
      // ELECTROMAGNET"), not two.
      {
        sequence: 43,
        assetId: "unit202.magnet.permanent-vs-electromagnet",
        familyId: "unit202.family.magnetism",
        orderInFamily: 4,
        role: "COMPARISON",
        displayName: "Permanent magnet vs electromagnet comparison",
        loOrLesson: "LO5 — lesson.magnetism.fundamentals",
        priority: "P2",
        priorityLabel: "P2 (USEFUL, not REQUIRED)",
        productionClass: "HYBRID",
        productionClassLabel: "HYBRID",
        instructionalPurpose:
          "CC-11.7 audit finding: a genuine physical-topology comparison (coiled wire around a core vs a solid bar magnet) the learner can use to distinguish the two magnet types by appearance -- USEFUL enrichment, Level 2 depth keeps it below REQUIRED.",
        primaryReference: NOT_READY_REF,
        referenceReadiness: "NOT_READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["PERMANENT MAGNET", "ELECTROMAGNET"],
        immutableFacts: [
          "permanent magnet depicted as a solid bar/horseshoe magnet, no coil or power source",
          "electromagnet depicted as a coil of wire around a core with a visible power source/current path",
          "one side-by-side comparison image, not two separate images",
        ],
        creativeFreedoms: ["premium magnet/coil/core rendering", "composition", "finish"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: ["do not generate until a primary reference is marked READY", "do not split into two separate images -- this is one comparison deliverable"],
        exactDeliverable:
          "BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium side-by-side illustration (permanent magnet | electromagnet), matching the immutable facts exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "hybrid",
        filenameBase: "magnet-permanent-vs-electromagnet-base",
        needOverride: "USEFUL",
        sharedBaseAudit: {
          classification: "SAFE_SHARED_BASE",
          action: "KEEP",
          rationale:
            "CC-11.7B composite-image audit (§8): the intended learner-facing deliverable is deliberately ONE side-by-side comparison visual (permanent magnet | electromagnet) -- the comparison itself is the teaching objective, matching the brief's own explicit 'ACCEPTABLE' example. Confirmed as one ProductionAsset, not split.",
        },
        canonicalStates: [
          {
            stateId: "unit202.magnet.permanent-vs-electromagnet.state.teaching",
            displayName: "Permanent magnet vs electromagnet (blocked)",
            pedagogicalState: "TEACHING",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["PERMANENT MAGNET", "ELECTROMAGNET"],
            notes: "CC-11.7 audit finding, USEFUL not REQUIRED -- cap.magnetism.compare_permanent_electromagnet, Level 2 depth.",
          },
        ],
      },
    ],
  },
  {
    familyId: "unit202.family.circuit-series",
    displayName: "Series circuit",
    instructionalPurpose: "A single, simple concept: a series circuit's topology is already fully governed by the deterministic renderer.",
    governedConcept: "LO4 — lesson.electrical.resistors-series (circuit.series_resistors)",
    familyNotes: "Single-asset family -- a simple, already-governed concept does not need a manufactured family structure.",
    assets: [
      {
        sequence: 14,
        assetId: "unit202.circuit.series",
        familyId: "unit202.family.circuit-series",
        orderInFamily: 1,
        role: "TECHNICAL_DIAGRAM",
        displayName: "Series circuit",
        loOrLesson: "LO4 — lesson.electrical.resistors-series",
        priority: "P1",
        priorityLabel: "P1",
        productionClass: "DETERMINISTIC_TECHNICAL",
        productionClassLabel: "DETERMINISTIC TECHNICAL",
        governedDiagramBlueprintId: "circuit.series_resistors",
        instructionalPurpose: "A visually polished series-circuit reference for style/contrast QA against the existing deterministic renderer -- topology and correctness are already governed.",
        primaryReference: {
          sourceName: "Wikimedia Commons — Battery symbols and circuit.svg",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Battery_symbols_and_circuit.svg",
          licence: "recorded per source page",
          qualityGrade: "A",
        },
        secondaryReference: {
          sourceName: "Wikimedia Commons — Series and parallel circuits2.svg",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Series_and_parallel_circuits2.svg",
          licence: "recorded per source page",
          qualityGrade: "A",
        },
        referenceReadiness: "READY",
        annotationPolicy: "NONE",
        requiredLabels: [],
        immutableFacts: ["complete source", "one continuous loop", "UK/IEC component convention", "current direction consistent with polarity when shown"],
        creativeFreedoms: [],
        deterministicOverlayResponsibilities: ["every schematic element remains deterministic vector -- no generated raster geometry for this family"],
        prohibitedChanges: ["do not replace the governed deterministic SVG renderer's output with generated raster geometry"],
        exactDeliverable:
          "A style/contrast reference only (not a replacement asset): include an unmistakable cell/battery/source wherever current direction is being taught, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "deterministic-polish",
        filenameBase: "circuit-series-base",
        sharedBaseAudit: { classification: "SAFE_SHARED_BASE", action: "KEEP", rationale: "CC-11.7B: DETERMINISTIC_TECHNICAL -- component-count states are deterministic vector geometry, no generated artwork involved at all." },
        canonicalStates: ([2, 3, 4] as const).map((count) => ({
          stateId: `unit202.circuit.series.state.${count}-component`,
          displayName: `Series circuit — ${count} components`,
          pedagogicalState: "MULTI_STATE" as const,
          annotationPolicy: "NONE" as const,
          requiredLabels: [],
          parameters: { component_count: count, show_values: false, show_current_arrow: true },
          existingCanonicalVariantId: reconciledVariantId("visual-contract.series-circuit-current-direction", 1, { component_count: count, show_values: false, show_current_arrow: true }, "both"),
        })),
      },
    ],
  },
  {
    familyId: "unit202.family.circuit-parallel",
    displayName: "Parallel circuit",
    instructionalPurpose: "A single, simple concept: a parallel circuit's topology is already fully governed by the deterministic renderer.",
    governedConcept: "LO4 — lesson.electrical.resistors-parallel (circuit.parallel_resistors)",
    familyNotes: "Single-asset family -- a simple, already-governed concept does not need a manufactured family structure.",
    assets: [
      {
        sequence: 15,
        assetId: "unit202.circuit.parallel",
        familyId: "unit202.family.circuit-parallel",
        orderInFamily: 1,
        role: "TECHNICAL_DIAGRAM",
        displayName: "Parallel circuit",
        loOrLesson: "LO4 — lesson.electrical.resistors-parallel",
        priority: "P1",
        priorityLabel: "P1",
        productionClass: "DETERMINISTIC_TECHNICAL",
        productionClassLabel: "DETERMINISTIC TECHNICAL",
        governedDiagramBlueprintId: "circuit.parallel_resistors",
        instructionalPurpose: "A visually polished parallel-circuit reference for style/contrast QA against the existing deterministic renderer -- topology and correctness are already governed.",
        primaryReference: {
          sourceName: "Same circuit reference family as series (see unit202.circuit.series)",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Series_and_parallel_circuits2.svg",
          licence: "recorded per source page",
          qualityGrade: "A",
        },
        referenceReadiness: "READY",
        annotationPolicy: "NONE",
        requiredLabels: [],
        immutableFacts: ["source present", "common pair of nodes/rails", "separate branches", "current direction consistent with source polarity"],
        creativeFreedoms: [],
        deterministicOverlayResponsibilities: ["every schematic element remains deterministic vector -- no generated raster geometry for this family"],
        prohibitedChanges: ["do not replace the governed deterministic SVG renderer's output with generated raster geometry"],
        exactDeliverable:
          "A style/contrast reference only (not a replacement asset), matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "deterministic-polish",
        filenameBase: "circuit-parallel-base",
        sharedBaseAudit: { classification: "SAFE_SHARED_BASE", action: "KEEP", rationale: "CC-11.7B: DETERMINISTIC_TECHNICAL -- branch-count states are deterministic vector geometry, no generated artwork involved at all." },
        canonicalStates: ([2, 3, 4] as const).map((count) => ({
          stateId: `unit202.circuit.parallel.state.${count}-branch`,
          displayName: `Parallel circuit — ${count} branches`,
          pedagogicalState: "MULTI_STATE" as const,
          annotationPolicy: "NONE" as const,
          requiredLabels: [],
          parameters: { branch_count: count, show_values: false, show_branch_current_arrows: true },
          existingCanonicalVariantId: reconciledVariantId("visual-contract.parallel-circuit-branches", 1, { branch_count: count, show_values: false, show_branch_current_arrows: true }, "both"),
        })),
      },
    ],
  },
  {
    familyId: "unit202.family.circuit-mixed",
    displayName: "Mixed series/parallel circuit",
    instructionalPurpose: "A single, simple concept: a mixed circuit's topology is already fully governed by the deterministic renderer.",
    governedConcept: "LO4 — lesson.electrical.series-vs-parallel-comparison (circuit.series_parallel_mixed)",
    familyNotes: "Single-asset family -- a simple, already-governed concept does not need a manufactured family structure.",
    assets: [
      {
        sequence: 16,
        assetId: "unit202.circuit.mixed",
        familyId: "unit202.family.circuit-mixed",
        orderInFamily: 1,
        role: "TECHNICAL_DIAGRAM",
        displayName: "Mixed series/parallel circuit",
        loOrLesson: "LO4 — lesson.electrical.series-vs-parallel-comparison",
        priority: "P1",
        priorityLabel: "P1",
        productionClass: "DETERMINISTIC_TECHNICAL",
        productionClassLabel: "DETERMINISTIC TECHNICAL",
        governedDiagramBlueprintId: "circuit.series_parallel_mixed",
        instructionalPurpose: "A visually polished mixed-topology reference for style/contrast QA against the existing deterministic renderer -- topology and correctness are already governed.",
        primaryReference: {
          sourceName: "Wikimedia Commons — SeriesParallelCircuit.svg",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:SeriesParallelCircuit.svg",
          licence: "use only as topology/reference, not a close stylistic derivative",
          qualityGrade: "B",
        },
        referenceReadiness: "READY",
        annotationPolicy: "NONE",
        requiredLabels: [],
        immutableFacts: ["genuinely mixed topology", "obvious junctions", "traceable current paths", "source included where pedagogically necessary"],
        creativeFreedoms: [],
        deterministicOverlayResponsibilities: ["every schematic element remains deterministic vector -- no generated raster geometry for this family"],
        prohibitedChanges: ["use only as topology/reference, not a close stylistic derivative", "do not replace the governed deterministic SVG renderer's output with generated raster geometry"],
        exactDeliverable:
          "A style/contrast reference only (not a replacement asset), matching the reference topology exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "deterministic-polish",
        filenameBase: "circuit-mixed-base",
        sharedBaseAudit: { classification: "SAFE_SHARED_BASE", action: "KEEP", rationale: "CC-11.7B: DETERMINISTIC_TECHNICAL -- arrangement states are deterministic vector topology, no generated artwork involved at all." },
        canonicalStates: (["series_of_parallel", "parallel_of_series"] as const).map((arrangement) => ({
          stateId: `unit202.circuit.mixed.state.${arrangement.replace(/_/g, "-")}`,
          displayName: `Mixed circuit — ${arrangement.replace(/_/g, " ")}`,
          pedagogicalState: "MULTI_STATE" as const,
          annotationPolicy: "NONE" as const,
          requiredLabels: [],
          parameters: { branch_arrangement: arrangement, show_values: false },
          existingCanonicalVariantId: reconciledVariantId("visual-contract.series-parallel-mixed-topology", 1, { branch_arrangement: arrangement, show_values: false }, "both"),
        })),
      },
    ],
  },
  {
    familyId: "unit202.family.instrument-connections",
    displayName: "Instrument connections",
    instructionalPurpose: "A single, simple concept: ammeter/voltmeter/ohmmeter connection correctness is already fully governed by the deterministic renderer.",
    governedConcept: "LO2 — lesson.electrical.instrumentation (instrument.measurement_connection)",
    familyNotes: "Single-asset family -- a simple, already-governed concept does not need a manufactured family structure.",
    assets: [
      {
        sequence: 17,
        assetId: "unit202.instrument.connections",
        familyId: "unit202.family.instrument-connections",
        orderInFamily: 1,
        role: "TECHNICAL_DIAGRAM",
        displayName: "Ammeter / voltmeter / ohmmeter connections",
        loOrLesson: "LO2 — lesson.electrical.instrumentation",
        priority: "P1",
        priorityLabel: "P1",
        productionClass: "DETERMINISTIC_TECHNICAL",
        productionClassLabel: "DETERMINISTIC TECHNICAL / SELECTIVE HYBRID",
        governedDiagramBlueprintId: "instrument.measurement_connection",
        instructionalPurpose: "A visually polished instrument-connection reference for style/contrast QA against the existing deterministic renderer -- connection correctness is already governed.",
        primaryReference: {
          sourceName: "Wikimedia Commons — SimpleCircuit.SVG",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:SimpleCircuit.SVG",
          licence: "recorded per source page",
          qualityGrade: "A",
        },
        secondaryReference: {
          sourceName: "Fluke resistance-measurement guidance (technical cross-check)",
          sourceUrl: "",
          licence: "reference/technical grounding only -- not a redistributable asset",
          qualityGrade: "technical B",
        },
        referenceReadiness: "READY",
        annotationPolicy: "NONE",
        requiredLabels: [],
        immutableFacts: [
          "ammeter connects in series",
          "voltmeter connects in parallel",
          "resistance measurement requires a de-energised circuit",
          "isolation/disconnection of an individual component is required only where necessary to avoid parallel-path readings, never claimed as a universal requirement",
          "source/load context understandable",
        ],
        creativeFreedoms: [],
        deterministicOverlayResponsibilities: ["every schematic/instrument element remains deterministic vector -- no generated raster geometry for this family"],
        prohibitedChanges: ["do not restate isolation as a universal requirement -- see immutable facts"],
        exactDeliverable:
          "A style/contrast reference only (not a replacement asset), matching the reference connection geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "deterministic-polish",
        filenameBase: "instrument-connections-base",
        sharedBaseAudit: { classification: "SAFE_SHARED_BASE", action: "KEEP", rationale: "CC-11.7B: DETERMINISTIC_TECHNICAL -- instrument/connection-style states are deterministic vector topology, no generated artwork involved at all." },
        canonicalStates: (
          [
            { instrument_type: "voltmeter", connection_style: "parallel", standard: true },
            { instrument_type: "voltmeter", connection_style: "series", standard: false },
            { instrument_type: "ammeter", connection_style: "series", standard: true },
            { instrument_type: "ammeter", connection_style: "parallel", standard: false },
            { instrument_type: "ohmmeter", connection_style: "isolated", standard: true },
          ] as const
        ).map(({ instrument_type, connection_style, standard }) => ({
          stateId: `unit202.instrument.connections.state.${instrument_type}-${connection_style}`,
          displayName: `${instrument_type} — ${connection_style} (${standard ? "standard" : "non-standard, deliberate teaching contrast"})`,
          pedagogicalState: "MULTI_STATE" as const,
          annotationPolicy: "NONE" as const,
          requiredLabels: [],
          parameters: { instrument_type, connection_style },
          existingCanonicalVariantId: reconciledVariantId("visual-contract.instrument-measurement-connection", 1, { instrument_type, connection_style }, "both"),
        })),
      },
      // CC-11.7A §1/§2/§16: CC-11.7 audit findings 1-2 ("Clamp meter
      // recognition" / "Oscilloscope recognition" --
      // reports/instructional-visuals/unit202-comprehensive-visual-audit.md
      // §4) materialised as USEFUL, not REQUIRED. Both are distinctive
      // physical-recognition targets genuinely different from the
      // series/parallel/isolated connection topology the sibling
      // TECHNICAL_DIAGRAM asset models -- kept as two separate assets
      // (one distinct instrument each), not combined.
      ...(
        [
          {
            component: "clamp-meter",
            displayName: "Clamp meter",
            purpose:
              "CC-11.7 audit finding: physical recognition of a clamp meter by its distinctive ferrite-jaw form -- genuinely different from the series/parallel/isolated connection topology the sibling TECHNICAL_DIAGRAM asset models. USEFUL enrichment, not REQUIRED.",
            fact: "ferrite clamp jaw must be clearly visible and open-able around a conductor -- the defining recognition feature",
          },
          {
            component: "oscilloscope",
            displayName: "Oscilloscope",
            purpose: "CC-11.7 audit finding: physical recognition of an oscilloscope by its distinctive screen/trace form. USEFUL enrichment, not REQUIRED.",
            fact: "screen with a visible waveform trace must be clearly depicted -- the defining recognition feature",
          },
        ] as const
      ).map(({ component, displayName, purpose, fact }, index) => ({
        sequence: 44 + index,
        assetId: `unit202.instrument.${component}`,
        familyId: "unit202.family.instrument-connections",
        orderInFamily: 2 + index,
        role: "PHYSICAL_RECOGNITION" as const,
        displayName: `${displayName} recognition`,
        loOrLesson: "LO2 — lesson.electrical.instrumentation",
        priority: "P2" as const,
        priorityLabel: "P2 (USEFUL, not REQUIRED)",
        productionClass: "PREMIUM_CONCEPTUAL" as const,
        productionClassLabel: "PREMIUM CONCEPTUAL",
        instructionalPurpose: purpose,
        primaryReference: NOT_READY_REF,
        referenceReadiness: "NOT_READY" as const,
        annotationPolicy: "TEACHING_EXPLANATORY" as const,
        requiredLabels: ["instrument name"],
        immutableFacts: [fact],
        creativeFreedoms: ["premium photographic-impression rendering", "composition", "lighting"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: ["do not generate until a primary reference is marked READY", "do not make one manufacturer's product appearance canonical"],
        exactDeliverable: `BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium physical-appearance illustration of a ${displayName.toLowerCase()}. Produce ONLY this asset -- do not automatically create the other members of this visual family.`,
        outputSubfolder: "physical-components" as const,
        filenameBase: `instrument-${component}-base`,
        needOverride: "USEFUL" as const,
        canonicalStates: [
          {
            stateId: `unit202.instrument.${component}.state.teaching`,
            displayName: `${displayName} recognition (blocked)`,
            pedagogicalState: "TEACHING" as const,
            annotationPolicy: "TEACHING_EXPLANATORY" as const,
            requiredLabels: ["instrument name"],
            notes: "CC-11.7 audit finding, USEFUL not REQUIRED.",
          },
        ],
      })),
    ],
  },
  {
    familyId: "unit202.family.current-direction",
    displayName: "Conventional current vs electron flow",
    instructionalPurpose: "A single deterministic dual-arrow diagram distinguishing conventional current direction from actual electron-flow direction.",
    governedConcept: "LO4 — lesson.electrical.charge-and-current",
    familyNotes:
      "CC-11.7 audit finding 3 (reports/instructional-visuals/unit202-comprehensive-visual-audit.md §4): targets the named misconception MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001. USEFUL, not REQUIRED -- cheap and high-value, but not yet corroborated by a dedicated QuestionBlueprint. A simple dual-arrow wire diagram is a geometric fact (conventional current: + to -; electron flow: - to +, opposite direction, same wire), not an artistic subject -- DETERMINISTIC_TECHNICAL, no ChatGPT art job, and no risk of generated artwork ever establishing arrow direction (task brief §16's own explicit warning).",
    assets: [
      {
        sequence: 46,
        assetId: "unit202.current-direction.electron-flow-vs-conventional",
        familyId: "unit202.family.current-direction",
        orderInFamily: 1,
        role: "TECHNICAL_DIAGRAM",
        displayName: "Conventional current vs electron flow",
        loOrLesson: "LO4 — lesson.electrical.charge-and-current",
        priority: "P2",
        priorityLabel: "P2 (USEFUL, not REQUIRED)",
        productionClass: "DETERMINISTIC_TECHNICAL",
        productionClassLabel: "DETERMINISTIC TECHNICAL",
        instructionalPurpose:
          "CC-11.7 audit finding: a single wire with two labelled arrows -- conventional current (+ to -) and actual electron flow (- to +) -- shown together so the direction distinction and the underlying reason (electrons are negative, so they physically move opposite to the conventional-current convention) are both visible at a glance.",
        primaryReference: {
          sourceName: "Standard conventional-current/electron-flow dual-arrow reference -- to be selected when this asset is commissioned",
          sourceUrl: "",
          licence: "to be recorded when selected",
          qualityGrade: "to be assessed",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["CONVENTIONAL CURRENT (+ to -)", "ELECTRON FLOW (- to +)"],
        immutableFacts: [
          "conventional current direction: positive terminal to negative terminal",
          "electron flow direction: negative terminal to positive terminal -- opposite to conventional current",
          "both arrows on the same single wire/conductor, never on separate wires",
        ],
        creativeFreedoms: [],
        deterministicOverlayResponsibilities: ["the two arrows and their geometry remain deterministic vector -- no arbitrary raster arrow direction for this family"],
        prohibitedChanges: ["do not draw the two arrows pointing the same direction", "do not omit either arrow"],
        exactDeliverable: "Deterministic vector dual-arrow diagram -- not a premium art-generation deliverable.",
        outputSubfolder: "deterministic-polish",
        filenameBase: "current-direction-electron-flow-vs-conventional-base",
        promptable: false,
        needOverride: "USEFUL",
        canonicalStates: [
          {
            stateId: "unit202.current-direction.electron-flow-vs-conventional.state.teaching",
            displayName: "Conventional current vs electron flow (dual arrow)",
            pedagogicalState: "TEACHING",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["CONVENTIONAL CURRENT (+ to -)", "ELECTRON FLOW (- to +)"],
            notes: "CC-11.7 audit finding, USEFUL not REQUIRED. NO ART PROMPT -- DETERMINISTIC.",
          },
        ],
      },
    ],
  },
  {
    familyId: "unit202.family.gears",
    displayName: "Driver/driven gears",
    instructionalPurpose: "The driver/driven relative-size relationship, plus the optional rotation-direction/idler concept.",
    governedConcept: "LO3 — lesson.foundation.physics.simple-machines (mechanical.gear_mesh)",
    familyNotes:
      "CC-11.7B correction: the original single unit202.gears asset packed 3 genuinely different gear-size relationships (driven larger/smaller/equal) behind one prompt -- a real physical size change to a rendered object in the scene, with no deterministic overlay mechanism (only rotation-direction is an overlay responsibility) able to resize a gear in generated artwork. Split into 3 size-specific ProductionAssets. The optional rotation-direction/idler USEFUL finding remains a separate deterministic-only asset, unaffected by the split.",
    assets: [
      ...(
        [
          { ratio: "driven_larger" as const, orderSuffix: 1, slug: "driven-larger", label: "driven gear larger than the driver" },
          { ratio: "driven_smaller" as const, orderSuffix: 2, slug: "driven-smaller", label: "driven gear smaller than the driver" },
          { ratio: "equal" as const, orderSuffix: 3, slug: "equal", label: "driver and driven gears equal size" },
        ] as const
      ).map(({ ratio, orderSuffix, slug, label }) => ({
        sequence: ratio === "driven_larger" ? 18 : ratio === "driven_smaller" ? 51 : 52,
        assetId: `unit202.gears.${slug}`,
        familyId: "unit202.family.gears",
        orderInFamily: orderSuffix,
        role: "CONFIGURATION" as const,
        displayName: `Driver/driven gears — ${label}`,
        loOrLesson: "LO3 — lesson.foundation.physics.simple-machines",
        priority: "P1" as const,
        priorityLabel: "P1",
        productionClass: "HYBRID" as const,
        productionClassLabel: "POLISHED DETERMINISTIC / HYBRID",
        governedDiagramBlueprintId: "mechanical.gear_mesh",
        instructionalPurpose: `Show a driver gear meshed with a driven gear, ${label}, representing the gear ratio and the resulting torque/speed trade-off.`,
        primaryReference: {
          sourceName: "Wikimedia Commons — Example of a Compound Gear Train.png",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Example_of_a_Compound_Gear_Train.png",
          licence: "CC0",
          qualityGrade: "A",
        },
        referenceReadiness: "READY" as const,
        annotationPolicy: "TEACHING_EXPLANATORY" as const,
        requiredLabels: ["Driver", "Driven"],
        immutableFacts: [
          "meaningful driver/driven relationship",
          "physically plausible mesh",
          `${label} -- this specific size relationship is the defining physical fact of this asset, never mixed with a sibling size-ratio asset`,
          "correct rotation relationship when shown",
        ],
        creativeFreedoms: ["premium gear/material rendering", "composition", "finish"],
        deterministicOverlayResponsibilities: ["rotation-direction overlay where taught"],
        prohibitedChanges: ["do not depict a mesh that is not physically plausible", "do not depict a different size relationship than stated -- that is a sibling ProductionAsset"],
        exactDeliverable: `One premium illustration of two meshed gears, ${label}, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.`,
        outputSubfolder: "hybrid" as const,
        filenameBase: `gears-${slug}-base`,
        sharedBaseAudit: {
          classification: "SEPARATE_ARTWORK_REQUIRED" as const,
          action: "SPLIT" as const,
          rationale:
            "CC-11.7B: split from the original unit202.gears (3 states on 1 asset). Driven-gear size relative to the driver is a genuine physical size change to a rendered object, not a labelling/overlay difference -- no deterministic overlay mechanism can resize a gear in generated artwork (only rotation-direction is declared as an overlay responsibility).",
          splitFrom: "unit202.gears",
          splitSiblings: (["driven-larger", "driven-smaller", "equal"] as const).filter((s) => s !== slug).map((s) => `unit202.gears.${s}`),
        },
        canonicalStates: [
          {
            stateId: `unit202.gears.${slug}.state.teaching`,
            displayName: `Driver/driven gears — ${ratio.replace(/_/g, " ")}`,
            pedagogicalState: "MULTI_STATE" as const,
            annotationPolicy: "TEACHING_EXPLANATORY" as const,
            requiredLabels: ["Driver", "Driven"],
            parameters: { size_ratio: ratio },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.gear-mesh-ratio", 1, { size_ratio: ratio }, "both"),
          },
        ],
      })),
      // CC-11.7A §1/§2/§16: CC-11.7 audit finding 5 ("Gear rotation-direction
      // reversal / idler gear", FP-GEAR-DIRECTION-REVERSAL-001,
      // FP-GEAR-IDLER-001) materialised as USEFUL, not REQUIRED --
      // governed SUPPORTS-only (non-mandatory) content. The audit report's
      // own framing ("cheap addition to the existing gear-mesh asset if
      // commissioned") is followed literally: this reuses whichever
      // existing driver/driven gear artwork is on hand via a
      // deterministic rotation-direction overlay (already declared on
      // each size-specific asset's deterministicOverlayResponsibilities),
      // so it is DETERMINISTIC annotation, not a second premium art job.
      {
        sequence: 47,
        assetId: "unit202.gears.rotation-direction",
        familyId: "unit202.family.gears",
        orderInFamily: 4,
        role: "TECHNICAL_DIAGRAM",
        displayName: "Gear rotation-direction reversal / idler gear",
        loOrLesson: "LO3 — lesson.foundation.physics.simple-machines",
        priority: "P2",
        priorityLabel: "P2 (USEFUL, not REQUIRED)",
        productionClass: "DETERMINISTIC_TECHNICAL",
        productionClassLabel: "DETERMINISTIC TECHNICAL (annotation overlay on whichever sibling driver/driven gear base artwork applies)",
        governedDiagramBlueprintId: "mechanical.gear_mesh",
        instructionalPurpose:
          "CC-11.7 audit finding: two meshed gears rotate in opposite directions; adding a third idler gear reverses the output direction back to match the driver without changing the overall ratio. Governed SUPPORTS-only content (non-mandatory).",
        primaryReference: {
          sourceName: "Deterministic rotation-direction annotation on the sibling driver/driven gear reference geometry -- no separate photographic reference required",
          sourceUrl: "",
          licence: "n/a -- deterministic annotation, not generated artwork",
          qualityGrade: "n/a",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["rotation-direction arrows", "idler (where present)"],
        immutableFacts: [
          "two directly meshed gears rotate in opposite directions",
          "an idler gear between driver and driven reverses the output direction back to match the driver's own direction",
          "an idler gear does not change the overall driver:driven ratio",
        ],
        creativeFreedoms: [],
        deterministicOverlayResponsibilities: ["rotation-direction arrows and idler-gear presence remain a deterministic overlay on whichever sibling driver/driven gear base artwork applies -- no separate art session"],
        prohibitedChanges: ["do not commission a new premium base image for this asset -- it reuses a sibling gear asset's own overlay system"],
        exactDeliverable: "Deterministic rotation-direction overlay states on a sibling driver/driven gear base artwork -- not a separate premium art-generation deliverable.",
        outputSubfolder: "deterministic-polish",
        filenameBase: "gears-rotation-direction-base",
        promptable: false,
        needOverride: "USEFUL",
        sharedBaseAudit: {
          classification: "SAFE_SHARED_BASE",
          action: "KEEP",
          rationale: "CC-11.7B: purely deterministic annotation (rotation-direction arrows, idler presence) on whichever sibling driver/driven gear base artwork applies -- no generated artwork involved at all, unaffected by the CC-11.7B size-ratio split.",
        },
        canonicalStates: [
          {
            stateId: "unit202.gears.rotation-direction.state.direct-mesh-opposite-directions",
            displayName: "Two directly meshed gears — opposite rotation directions",
            pedagogicalState: "TEACHING",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["rotation-direction arrows"],
            notes: "CC-11.7 audit finding, USEFUL not REQUIRED. NO ART PROMPT -- DETERMINISTIC overlay on a sibling driver/driven gear base artwork.",
          },
          {
            stateId: "unit202.gears.rotation-direction.state.idler-preserves-driver-direction",
            displayName: "Idler gear — output direction matches driver, ratio unchanged",
            pedagogicalState: "TEACHING",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["rotation-direction arrows", "idler"],
            notes: "CC-11.7 audit finding, USEFUL not REQUIRED. NO ART PROMPT -- DETERMINISTIC overlay on a sibling driver/driven gear base artwork.",
          },
        ],
      },
    ],
  },
  {
    familyId: "unit202.family.resistivity",
    displayName: "Resistance vs conductor dimensions",
    instructionalPurpose: "Teach the two independent qualitative relationships that together make up R = ρL/A: length's effect on resistance, and area's effect on resistance.",
    governedConcept: "LO4 — lesson.electrical.resistivity (mechanical.resistivity_dimensions)",
    familyNotes: "Split into two COMPARISON assets: length and area are two independently-varying quantities the learner must predict the qualitative consequence of separately -- one image cannot show both comparisons without conflating which variable is changing.",
    assets: [
      {
        sequence: 19,
        assetId: "unit202.resistivity.length-comparison",
        familyId: "unit202.family.resistivity",
        orderInFamily: 1,
        role: "COMPARISON",
        displayName: "Resistance vs conductor length",
        loOrLesson: "LO4 — lesson.electrical.resistivity",
        priority: "P1",
        priorityLabel: "P1",
        productionClass: "HYBRID",
        productionClassLabel: "HYBRID / POLISHED DETERMINISTIC",
        governedDiagramBlueprintId: "mechanical.resistivity_dimensions",
        instructionalPurpose: "Show two conductor rods differing only in length so a learner predicts the qualitative effect on resistance.",
        // CC-11.7C §1: "OpenStax wire/conductor cylinder diagrams" named a
        // publisher/category, not a specific chapter/figure/URL -- not
        // sufficiently specific to count as locked. Corrected to BLOCKED;
        // pedagogical classification (REQUIRED) is unchanged.
        primaryReference: NOT_READY_REF,
        referenceReadiness: "NOT_READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["length comparison caption", "qualitative-consequence caption (\"longer -> more resistance\")"],
        immutableFacts: ["increased length -> greater resistance (cross-sectional area unchanged)"],
        creativeFreedoms: ["premium conductor-material rendering", "composition", "finish"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: ["do not embed a numeric R = rho L / A calculation", "do not also vary cross-sectional area in this asset"],
        exactDeliverable:
          "BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium illustration of two conductor rods differing only in length, matching the reference relationship exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "hybrid",
        filenameBase: "resistivity-length-comparison-base",
        canonicalStates: [
          {
            stateId: "unit202.resistivity.length-comparison.state.teaching",
            displayName: "Resistance vs conductor length",
            pedagogicalState: "MULTI_STATE",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["length comparison caption", "qualitative-consequence caption (\"longer -> more resistance\")"],
            parameters: { comparison: "length" },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.resistivity-length-area-dimensions", 1, { comparison: "length" }, "both"),
          },
        ],
      },
      {
        sequence: 20,
        assetId: "unit202.resistivity.area-comparison",
        familyId: "unit202.family.resistivity",
        orderInFamily: 2,
        role: "COMPARISON",
        displayName: "Resistance vs conductor cross-sectional area",
        loOrLesson: "LO4 — lesson.electrical.resistivity",
        priority: "P1",
        priorityLabel: "P1",
        productionClass: "HYBRID",
        productionClassLabel: "HYBRID / POLISHED DETERMINISTIC",
        governedDiagramBlueprintId: "mechanical.resistivity_dimensions",
        instructionalPurpose: "Show two conductor rods differing only in cross-sectional area so a learner predicts the qualitative effect on resistance.",
        // CC-11.7C §1: same correction as the sibling length-comparison
        // asset -- "OpenStax wire/conductor cylinder diagrams" named a
        // publisher/category, not a locked chapter/figure/URL.
        primaryReference: NOT_READY_REF,
        referenceReadiness: "NOT_READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["area comparison caption", "qualitative-consequence caption (\"thicker -> less resistance\")"],
        immutableFacts: ["increased cross-sectional area -> lower resistance (length unchanged)"],
        creativeFreedoms: ["premium conductor-material rendering", "composition", "finish"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: ["do not embed a numeric R = rho L / A calculation", "do not also vary length in this asset"],
        exactDeliverable:
          "BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium illustration of two conductor rods differing only in cross-sectional area, matching the reference relationship exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "hybrid",
        filenameBase: "resistivity-area-comparison-base",
        canonicalStates: [
          {
            stateId: "unit202.resistivity.area-comparison.state.teaching",
            displayName: "Resistance vs conductor cross-sectional area",
            pedagogicalState: "MULTI_STATE",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["area comparison caption", "qualitative-consequence caption (\"thicker -> less resistance\")"],
            parameters: { comparison: "area" },
            existingCanonicalVariantId: reconciledVariantId("visual-contract.resistivity-length-area-dimensions", 1, { comparison: "area" }, "both"),
          },
        ],
      },
    ],
  },
  {
    familyId: "unit202.family.waveform-sine",
    displayName: "AC sine waveform",
    instructionalPurpose: "A single, simple concept: sine-waveform characteristics are already fully governed by the deterministic renderer.",
    governedConcept: "LO5 — lesson.waveforms.ac-dc-and-sine-wave-quantities (graph.waveform_sine)",
    familyNotes: "Single-asset family -- a simple, already-governed concept does not need a manufactured family structure.",
    assets: [
      {
        sequence: 21,
        assetId: "unit202.waveform.sine",
        familyId: "unit202.family.waveform-sine",
        orderInFamily: 1,
        role: "TECHNICAL_DIAGRAM",
        displayName: "AC sine waveform",
        loOrLesson: "LO5 — lesson.waveforms.ac-dc-and-sine-wave-quantities",
        priority: "P1",
        priorityLabel: "P1",
        productionClass: "DETERMINISTIC_TECHNICAL",
        productionClassLabel: "DETERMINISTIC TECHNICAL",
        governedDiagramBlueprintId: "graph.waveform_sine",
        instructionalPurpose: "A visually polished sine-waveform reference for style/contrast QA against the existing deterministic renderer -- waveform correctness is already governed.",
        primaryReference: {
          sourceName: "Wikimedia Commons — Sine wave 2.svg",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Sine_wave_2.svg",
          licence: "Public-domain dedication",
          qualityGrade: "A+",
        },
        referenceReadiness: "READY",
        annotationPolicy: "NONE",
        requiredLabels: [],
        immutableFacts: [
          "mathematically correct sine curve",
          "zero axis shown",
          "peak shown",
          "peak-to-peak shown",
          "period shown",
          "RMS is approximately 0.707 x peak where taught",
        ],
        creativeFreedoms: [],
        deterministicOverlayResponsibilities: ["the curve itself remains deterministic vector -- no arbitrary raster curve for this family"],
        prohibitedChanges: ["do not approximate the sine curve with a freehand/raster curve"],
        exactDeliverable:
          "A style/contrast reference only (not a replacement asset), matching the reference waveform exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "deterministic-polish",
        filenameBase: "waveform-sine-base",
        sharedBaseAudit: { classification: "SAFE_SHARED_BASE", action: "KEEP", rationale: "CC-11.7B: DETERMINISTIC_TECHNICAL -- peak/RMS/period-marker/cycle-count states are deterministic vector plots, no generated artwork involved at all." },
        canonicalStates: (
          [
            { peak: false, rms: false, period: false, cycles: 2, name: "bare cycle (zero-axis reference only)" },
            { peak: true, rms: false, period: false, cycles: 2, name: "peak revealed" },
            { peak: true, rms: true, period: false, cycles: 2, name: "peak + RMS revealed" },
            { peak: true, rms: true, period: true, cycles: 2, name: "peak + RMS + period revealed" },
            { peak: true, rms: true, period: true, cycles: 1, name: "single cycle, fully annotated" },
            { peak: true, rms: true, period: true, cycles: 3, name: "three cycles, fully annotated" },
          ] as const
        ).map(({ peak, rms, period, cycles, name }, index) => ({
          stateId: `unit202.waveform.sine.state.progression-${index + 1}`,
          displayName: `Sine waveform — ${name} (${cycles} cycle${cycles === 1 ? "" : "s"})`,
          pedagogicalState: "MULTI_STATE" as const,
          annotationPolicy: "NONE" as const,
          requiredLabels: [],
          notes: "REQUIRED reconciliation review confirms genuinely required learner-visible states: a progressive teaching reveal (none -> peak -> peak+RMS -> peak+RMS+period) plus two cycle-count variants distinct enough to be their own picture, not a numeric permutation. Peak-to-peak is a labelled bracket on the existing renderer, not a separate state.",
          parameters: { show_peak_line: peak, show_rms_line: rms, show_period_marker: period, cycles_shown: cycles },
          existingCanonicalVariantId: reconciledVariantId("visual-contract.ac-waveform-sine", 1, { show_peak_line: peak, show_rms_line: rms, show_period_marker: period, cycles_shown: cycles }, "both"),
        })),
      },
    ],
  },
  {
    familyId: "unit202.family.emf-motional",
    displayName: "Motional EMF geometry",
    instructionalPurpose: "A single, simple concept: one mutually-perpendicular geometric relationship (B, l, v) behind e = Blv.",
    governedConcept: "LO5 — lesson.magnetism.effects-of-current (emf.motional_emf_geometry)",
    familyNotes: "Single-asset family -- one geometric fact, no distinct states or configurations to separate.",
    assets: [
      {
        sequence: 22,
        assetId: "unit202.emf.motional",
        familyId: "unit202.family.emf-motional",
        orderInFamily: 1,
        role: "PHENOMENON",
        displayName: "Motional EMF geometry",
        loOrLesson: "LO5 — lesson.magnetism.effects-of-current",
        priority: "P1",
        priorityLabel: "P1",
        productionClass: "HYBRID",
        productionClassLabel: "DETERMINISTIC / HYBRID",
        governedDiagramBlueprintId: "emf.motional_emf_geometry",
        instructionalPurpose: "Show that conductor length, its velocity and the magnetic field are mutually perpendicular -- the geometric fact behind e = Blv.",
        // CC-11.7C §1: was marked READY with a placeholder reference
        // ("external reference pending", "add a human-readable physics
        // reference before premium rebuild") -- no specific, locked
        // external reference is actually available yet. Corrected to
        // BLOCKED; pedagogical classification (REQUIRED) is unchanged.
        primaryReference: NOT_READY_REF,
        referenceReadiness: "NOT_READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["B", "l", "v"],
        immutableFacts: ["B, l and v mutually perpendicular for the governed e = Blv case", "rod across rails", "velocity along the rails", "field perpendicular to the rail plane"],
        creativeFreedoms: ["premium rail/rod material rendering", "composition"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: ["do not draw B, l or v as anything other than mutually perpendicular"],
        exactDeliverable:
          "BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium illustration of a conductor rod across two rails ready to receive B/l/v overlay arrows, matching the existing governed geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "hybrid",
        filenameBase: "emf-motional-base",
        canonicalStates: [
          {
            stateId: "unit202.emf.motional.state.teaching",
            displayName: "Motional EMF — B, l, v mutually perpendicular",
            pedagogicalState: "MULTI_STATE",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["B", "l", "v"],
            notes: "One canonical state confirmed sufficient -- the geometry never varies (no DiagramBlueprint parameters at all), matching the existing contract's own knownAmbiguity note that exactly one variant is expected.",
            parameters: {},
            existingCanonicalVariantId: reconciledVariantId("visual-contract.motional-emf-geometry", 1, {}, "both"),
          },
        ],
      },
    ],
  },
  {
    familyId: "unit202.family.electronic-components",
    displayName: "Electronic components — recognition",
    instructionalPurpose: "Teach component recognition through the governed UK/IEC schematic symbol and, where genuinely useful, a physical-appearance companion image.",
    governedConcept: "LO6 — lesson.electrical.electronic-components-passive / -switching-control (electronics.component_symbol_card)",
    familyNotes:
      "Two assets covering two distinct recognition modes (schematic symbol vs physical appearance) rather than one combined image, since a learner needs to recognise a component both on a circuit diagram and in physical form. The 13-component physical-recognition set is not split into one asset per component in this pass -- tracked as one family member (task brief scope: reorganise where straightforward, do not mechanically split every entry).",
    assets: [
      {
        sequence: 23,
        assetId: "unit202.components.symbols",
        familyId: "unit202.family.electronic-components",
        orderInFamily: 1,
        role: "TECHNICAL_DIAGRAM",
        displayName: "Electronic component symbol system",
        loOrLesson: "LO6 — lesson.electrical.electronic-components-passive / -switching-control",
        priority: "P1",
        priorityLabel: "P1",
        productionClass: "DETERMINISTIC_TECHNICAL",
        productionClassLabel: "DETERMINISTIC TECHNICAL",
        governedDiagramBlueprintId: "electronics.component_symbol_card",
        instructionalPurpose: "The governed UK/IEC schematic-symbol system for component recognition -- symbol geometry must never be AI-generated.",
        primaryReference: {
          sourceName: "IEC 60617 graphical-symbol system / current UK technical-drawing convention",
          sourceUrl: "",
          licence: "standards reference -- verify against the current governed BS EN 60617 / IEC 60617 convention",
          qualityGrade: "A (standards authority)",
        },
        referenceReadiness: "READY",
        annotationPolicy: "NONE",
        requiredLabels: [],
        immutableFacts: ["every symbol must match the governed BS EN 60617 / IEC 60617 convention exactly"],
        creativeFreedoms: [],
        deterministicOverlayResponsibilities: ["the symbol geometry itself remains 100% deterministic vector -- this asset is not a candidate for generated imagery"],
        prohibitedChanges: ["do NOT use AI-generated schematic symbols", "do NOT use US/ANSI substitutes where UK/IEC differs"],
        exactDeliverable: "No image-generation deliverable -- this catalogue entry exists for tracking/QA only; symbols remain produced by ComponentSymbols.tsx.",
        outputSubfolder: "deterministic-polish",
        filenameBase: "components-symbols-base",
        sharedBaseAudit: { classification: "SAFE_SHARED_BASE", action: "KEEP", rationale: "CC-11.7B: DETERMINISTIC_TECHNICAL -- governed UK/IEC symbol geometry, produced by ComponentSymbols.tsx, never an art session. No generated-artwork sharing question applies." },
        promptable: false,
        canonicalStates: (
          ["resistor", "capacitor", "diode", "zener_diode", "led", "photodiode", "thermistor", "diac", "triac", "transistor", "thyristor_scr", "rectifier", "inverter"] as const
        ).map((component_type) => ({
          stateId: `unit202.components.symbols.state.${component_type.replace(/_/g, "-")}`,
          displayName: `UK/IEC symbol — ${component_type.replace(/_/g, " ")}`,
          pedagogicalState: "MULTI_STATE" as const,
          annotationPolicy: "NONE" as const,
          requiredLabels: [],
          notes: "NO ART PROMPT -- DETERMINISTIC. Produced by ComponentSymbols.tsx, never an art session.",
          parameters: { component_type },
          existingCanonicalVariantId: reconciledVariantId("visual-contract.electronic-component-symbol-card", 1, { component_type }, "both"),
        })),
      },
      // CC-11.7A §9: unit202.components.physical (the original single asset)
      // was six genuinely distinct image-generation jobs collapsed behind
      // one ProductionAsset/one prompt/one filename/one approval slot --
      // a resistor and a capacitor are not the same base artwork with a
      // toggled annotation, they are different physical objects (task
      // brief §8's own "INCORRECT EXAMPLE — ELECTRONIC COMPONENTS"). Split
      // into six independent REQUIRED PHYSICAL_RECOGNITION assets, each
      // with its own reference/prompt/filename/save slot/approval state.
      // Classification and reference-readiness are unchanged from the
      // pre-split asset (task brief §28: "Do not reopen or weaken the
      // accepted REQUIRED findings") -- only the structural granularity is
      // fixed.
      ...(
        [
          { component: "resistor", note: "REQUIRED -- ubiquitous, distinctive banded-body form." },
          { component: "capacitor", note: "REQUIRED -- distinctive cylindrical/disc forms, genuinely different from a resistor." },
          { component: "diode", note: "REQUIRED -- small distinctive banded form, directly supports forward/reverse-bias recognition." },
          { component: "led", note: "REQUIRED -- visually distinctive domed package, high recognition value." },
          { component: "thermistor", note: "REQUIRED -- distinctive bead/disc form, directly supports NTC/PTC recognition." },
          { component: "transistor", note: "REQUIRED -- distinctive 3-lead TO-92/TO-220-style package." },
        ] as const
      ).map(({ component, note }, index) => ({
        sequence: 24 + index,
        assetId: `unit202.components.physical.${component}`,
        familyId: "unit202.family.electronic-components",
        orderInFamily: 2 + index,
        role: "PHYSICAL_RECOGNITION" as const,
        displayName: `Physical electronic component — ${component}`,
        loOrLesson: "LO6 — lesson.electrical.electronic-components-passive / -switching-control",
        priority: "P1" as const,
        priorityLabel: "P1/P2",
        productionClass: "PREMIUM_CONCEPTUAL" as const,
        productionClassLabel: "PREMIUM CONCEPTUAL + deterministic UK/IEC symbol",
        instructionalPurpose: `A physical-appearance companion image for the ${component}, paired with its existing deterministic UK/IEC symbol card, so a learner can recognise this component both on a circuit diagram and in physical form.`,
        // CC-11.7C §1: "to be selected when this asset is commissioned" is
        // placeholder wording, not a locked reference. Corrected to
        // BLOCKED; pedagogical classification (REQUIRED) is unchanged.
        primaryReference: NOT_READY_REF,
        referenceReadiness: "NOT_READY" as const,
        annotationPolicy: "TEACHING_EXPLANATORY" as const,
        requiredLabels: ["component name"],
        immutableFacts: [`package form must be a real, representative physical form for a ${component}`],
        creativeFreedoms: ["premium photographic-impression rendering", "composition", "lighting"],
        deterministicOverlayResponsibilities: ["pairing with the existing deterministic UK/IEC symbol card"],
        prohibitedChanges: [`do not invent a misleading package form for the ${component}`, "do not depict any other component in this asset"],
        exactDeliverable: `BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium physical-appearance illustration of a ${component}, matching a real, representative package form. Produce ONLY this asset -- do not automatically create the other members of this visual family.`,
        outputSubfolder: "physical-components" as const,
        filenameBase: `components-physical-${component}-base`,
        canonicalStates: [
          {
            stateId: `unit202.components.physical.${component}.state.teaching`,
            displayName: `Physical appearance — ${component}`,
            pedagogicalState: "TEACHING" as const,
            annotationPolicy: "TEACHING_EXPLANATORY" as const,
            requiredLabels: ["component name"],
            notes: note,
          },
        ],
      })),
      // CC-11.7B §5/§6: unit202.diode.bias-direction audited and SPLIT.
      // The pre-audit exactDeliverable already literally asked for "Two
      // premium illustrations (forward bias, conducting; reverse bias,
      // blocked)" inside one ProductionAsset/one prompt -- the same
      // composite-violation pattern as the pre-audit magnet.poles asset.
      // Conducting vs blocked current flow through the same diode/circuit
      // context is also a genuine presence/absence scene difference
      // (a visible current-flow glow/arrow vs a visibly blocked/gapped
      // path), not a label swap. 2 states preserved in total (1 per
      // asset); neither state carries an existingCanonicalVariantId (both
      // are new since CC-11.7, not part of the historical 66), so the
      // split has no historical-reconciliation impact.
      ...(
        [
          { bias: "forward" as const, orderSuffix: 8, label: "forward bias — conducting" },
          { bias: "reverse" as const, orderSuffix: 9, label: "reverse bias — blocked" },
        ] as const
      ).map(({ bias, orderSuffix, label }) => ({
        sequence: bias === "forward" ? 30 : 53,
        assetId: `unit202.diode.bias-direction.${bias}`,
        familyId: "unit202.family.electronic-components",
        orderInFamily: orderSuffix,
        role: "PHENOMENON" as const,
        displayName: `Diode ${label}`,
        loOrLesson: "LO6 — lesson.electrical.electronic-components-passive",
        priority: "P1" as const,
        priorityLabel: "P1",
        productionClass: "HYBRID" as const,
        productionClassLabel: "HYBRID",
        instructionalPurpose: `CC-11.7 audit finding (new, beyond the original 66): show current ${bias === "forward" ? "flowing easily in forward bias" : "blocked in reverse bias"}, distinct from the static IEC symbol -- directly targets EL-COMPONENT-DIODE-001 and the named misconception MIS-EL-DIODE-DIRECTION-CONFUSION-001 (confusing which direction a diode conducts), which the existing \`electronics.component_symbol_card\` blueprint cannot represent since it renders only the static symbol, never current flow.`,
        // CC-11.7C §1: "to be selected when this asset is commissioned" is
        // placeholder wording, not a locked reference. Corrected to
        // BLOCKED; pedagogical classification (REQUIRED) is unchanged.
        primaryReference: NOT_READY_REF,
        referenceReadiness: "NOT_READY" as const,
        annotationPolicy: "TEACHING_EXPLANATORY" as const,
        requiredLabels: bias === "forward" ? ["FORWARD BIAS", "current-flow arrow"] : ["REVERSE BIAS", "blocked-current indicator"],
        immutableFacts: [
          bias === "forward" ? "diode conducts easily in forward bias (anode more positive than cathode)" : "diode blocks current in reverse bias (cathode more positive than anode)",
          "must remain visually distinct from the plain IEC diode symbol asset",
          `must depict ONLY the ${bias}-bias state -- the sibling ProductionAsset covers the other`,
        ],
        creativeFreedoms: ["premium diode/circuit-context rendering", "composition", "finish"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: [
          bias === "forward" ? "do not depict blocked/no current flow -- that is the reverse-bias sibling asset" : "do not depict current flowing -- that is the forward-bias sibling asset",
          "do not conflate with the zener/LED/photodiode symbol variants",
        ],
        exactDeliverable: `BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium illustration (${label}) of a diode in a simple test circuit, matching the immutable facts exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.`,
        outputSubfolder: "hybrid" as const,
        filenameBase: `diode-bias-direction-${bias}-base`,
        sharedBaseAudit: {
          classification: "SEPARATE_ARTWORK_REQUIRED" as const,
          action: "SPLIT" as const,
          rationale:
            "CC-11.7B: split from the original unit202.diode.bias-direction (2 states on 1 asset whose own exactDeliverable already literally asked for 'Two premium illustrations' in one prompt). Conducting vs blocked current flow is a genuine presence/absence scene difference (visible current-flow indication vs a visibly blocked path), not a label swap on identical geometry.",
          splitFrom: "unit202.diode.bias-direction",
          splitSiblings: [`unit202.diode.bias-direction.${bias === "forward" ? "reverse" : "forward"}`],
        },
        canonicalStates: [
          {
            stateId: `unit202.diode.bias-direction.${bias}.state.teaching`,
            displayName: label.replace(/^./, (c) => c.toUpperCase()),
            pedagogicalState: "TEACHING" as const,
            annotationPolicy: "TEACHING_EXPLANATORY" as const,
            requiredLabels: bias === "forward" ? ["FORWARD BIAS", "current-flow arrow"] : ["REVERSE BIAS", "blocked-current indicator"],
          },
        ],
      })),
      {
        sequence: 31,
        assetId: "unit202.rectification.waveforms",
        familyId: "unit202.family.electronic-components",
        orderInFamily: 10,
        role: "TECHNICAL_DIAGRAM",
        displayName: "Rectifier/inverter output waveform shapes",
        loOrLesson: "LO6 — lesson.electrical.electronic-components-switching-control",
        priority: "P1",
        priorityLabel: "P1",
        productionClass: "DETERMINISTIC_TECHNICAL",
        productionClassLabel: "DETERMINISTIC TECHNICAL",
        instructionalPurpose:
          "CC-11.7 audit finding (new, beyond the original 66): the three distinct output-waveform SHAPES (half-wave rectified, full-wave rectified, inverter-synthesised AC) directly targeted by question blueprint `electronics.recognise_rectifier_type`, which the existing `graph.waveform_sine` blueprint cannot represent (it renders only a plain sine wave) and the existing `electronics.component_symbol_card`'s rectifier/inverter entries cannot represent either (they render only the functional-block symbol, never the resulting waveform shape).",
        primaryReference: {
          sourceName: "Standard half-wave/full-wave rectification and inverter output waveform references -- to be selected when this asset is commissioned",
          sourceUrl: "",
          licence: "to be recorded when selected",
          qualityGrade: "to be assessed",
        },
        referenceReadiness: "READY",
        annotationPolicy: "NONE",
        requiredLabels: [],
        immutableFacts: [
          "half-wave: blocks one half-cycle entirely, passes the other unchanged in shape",
          "full-wave: converts both half-cycles to the same polarity (pulsating DC, never a flat line)",
          "inverter: DC input synthesised into an AC-shaped output via controlled switching",
          "never a smooth sine wave for any of the three -- that is the plain graph.waveform_sine blueprint's own separate, correct depiction",
        ],
        creativeFreedoms: [],
        deterministicOverlayResponsibilities: ["the curve itself remains deterministic vector -- no arbitrary raster curve for this family"],
        prohibitedChanges: ["do not draw a smooth continuous sine wave for any of the three states", "do not conflate half-wave and full-wave shapes"],
        exactDeliverable: "Deterministic vector waveform plots -- not a premium art-generation deliverable.",
        outputSubfolder: "deterministic-polish",
        filenameBase: "rectification-waveforms-base",
        promptable: false,
        sharedBaseAudit: { classification: "SAFE_SHARED_BASE", action: "KEEP", rationale: "CC-11.7B: DETERMINISTIC_TECHNICAL -- half-wave/full-wave/inverter waveform shapes are deterministic vector plots, no generated artwork involved at all." },
        canonicalStates: [
          {
            stateId: "unit202.rectification.waveforms.state.half-wave",
            displayName: "Half-wave rectified output",
            pedagogicalState: "MULTI_STATE",
            annotationPolicy: "NONE",
            requiredLabels: [],
            notes: "NO ART PROMPT -- DETERMINISTIC.",
          },
          {
            stateId: "unit202.rectification.waveforms.state.full-wave",
            displayName: "Full-wave rectified output",
            pedagogicalState: "MULTI_STATE",
            annotationPolicy: "NONE",
            requiredLabels: [],
            notes: "NO ART PROMPT -- DETERMINISTIC.",
          },
          {
            stateId: "unit202.rectification.waveforms.state.inverter",
            displayName: "Inverter-synthesised AC output",
            pedagogicalState: "MULTI_STATE",
            annotationPolicy: "NONE",
            requiredLabels: [],
            notes: "NO ART PROMPT -- DETERMINISTIC.",
          },
        ],
      },
      {
        sequence: 32,
        assetId: "unit202.capacitor.transient",
        familyId: "unit202.family.electronic-components",
        orderInFamily: 11,
        role: "TECHNICAL_DIAGRAM",
        displayName: "Capacitor RC charge/discharge transient curve",
        loOrLesson: "LO6 — lesson.electrical.electronic-components-passive",
        priority: "P1",
        priorityLabel: "P1",
        productionClass: "DETERMINISTIC_TECHNICAL",
        productionClassLabel: "DETERMINISTIC TECHNICAL",
        instructionalPurpose:
          "CC-11.7 audit finding (new, beyond the original 66): the exponential RC charge/discharge curve directly targeted by EL-COMPONENT-CAPACITOR-TRANSIENT-001 and question blueprint `electronics.recognise_capacitor_behaviour` ('gradual_exponential_change' vs 'instant_step_change'), which no existing blueprint depicts -- an exponential curve is a genuinely different shape from the plain sine wave.",
        primaryReference: {
          sourceName: "Standard RC charge/discharge exponential-curve reference -- to be selected when this asset is commissioned",
          sourceUrl: "",
          licence: "to be recorded when selected",
          qualityGrade: "to be assessed",
        },
        referenceReadiness: "READY",
        annotationPolicy: "NONE",
        requiredLabels: [],
        immutableFacts: [
          "charge/discharge follows a genuine exponential curve, never a straight-line ramp or instant step",
          "never a sine wave -- this is a transient response, not a periodic waveform",
        ],
        creativeFreedoms: [],
        deterministicOverlayResponsibilities: ["the curve itself remains deterministic vector -- no arbitrary raster curve for this family"],
        prohibitedChanges: ["do not draw a straight-line ramp or instant step in place of the exponential curve", "do not draw a periodic/sine shape"],
        exactDeliverable: "Deterministic vector exponential-curve plots -- not a premium art-generation deliverable.",
        outputSubfolder: "deterministic-polish",
        filenameBase: "capacitor-transient-base",
        promptable: false,
        sharedBaseAudit: { classification: "SAFE_SHARED_BASE", action: "KEEP", rationale: "CC-11.7B: DETERMINISTIC_TECHNICAL -- charge/discharge exponential curves are deterministic vector plots, no generated artwork involved at all." },
        canonicalStates: [
          {
            stateId: "unit202.capacitor.transient.state.charge",
            displayName: "Charge curve (exponential rise)",
            pedagogicalState: "MULTI_STATE",
            annotationPolicy: "NONE",
            requiredLabels: [],
            notes: "NO ART PROMPT -- DETERMINISTIC.",
          },
          {
            stateId: "unit202.capacitor.transient.state.discharge",
            displayName: "Discharge curve (exponential decay)",
            pedagogicalState: "MULTI_STATE",
            annotationPolicy: "NONE",
            requiredLabels: [],
            notes: "NO ART PROMPT -- DETERMINISTIC.",
          },
        ],
      },
      // CC-11.7A §1/§2/§9: CC-11.7 audit findings 6-10 ("Physical-recognition
      // images for zener diode, photodiode, DIAC, TRIAC, thyristor/SCR" --
      // reports/instructional-visuals/unit202-comprehensive-visual-audit.md
      // §4) materialised into the live catalogue as USEFUL, not REQUIRED
      // (§3: the 6 already-REQUIRED components above cover the
      // highest-value recognition targets; these 5 are genuinely useful
      // but more specialist). Each is its own ProductionAsset -- the same
      // "one distinct image, one asset" discipline applied to the REQUIRED
      // split above -- and each is currently BLOCKED_REFERENCE (no
      // individually-sourced physical reference approved yet); tracked,
      // never removed for lacking one (§15).
      ...(
        [
          { component: "zener_diode", displayName: "zener diode" },
          { component: "photodiode", displayName: "photodiode" },
          { component: "diac", displayName: "DIAC" },
          { component: "triac", displayName: "TRIAC" },
          { component: "thyristor_scr", displayName: "thyristor/SCR" },
        ] as const
      ).map(({ component, displayName }, index) => ({
        sequence: 33 + index,
        assetId: `unit202.components.physical.${component.replace(/_/g, "-")}`,
        familyId: "unit202.family.electronic-components",
        orderInFamily: 12 + index,
        role: "PHYSICAL_RECOGNITION" as const,
        displayName: `Physical electronic component — ${displayName}`,
        loOrLesson: "LO6 — lesson.electrical.electronic-components-switching-control",
        priority: "P2" as const,
        priorityLabel: "P2 (secondary queue)",
        productionClass: "PREMIUM_CONCEPTUAL" as const,
        productionClassLabel: "PREMIUM CONCEPTUAL + deterministic UK/IEC symbol",
        instructionalPurpose: `A physical-appearance companion image for the ${displayName}, paired with its existing deterministic UK/IEC symbol card -- more specialist than the six REQUIRED components, genuinely useful but not REQUIRED for Unit 202 visual completeness (CC-11.7 audit finding).`,
        primaryReference: NOT_READY_REF,
        referenceReadiness: "NOT_READY" as const,
        annotationPolicy: "TEACHING_EXPLANATORY" as const,
        requiredLabels: ["component name"],
        immutableFacts: [`package form must be a real, representative physical form for a ${displayName}`],
        creativeFreedoms: ["premium photographic-impression rendering", "composition", "lighting"],
        deterministicOverlayResponsibilities: ["pairing with the existing deterministic UK/IEC symbol card"],
        prohibitedChanges: [`do not invent a misleading package form for the ${displayName}`, "do not generate until a primary reference is marked READY"],
        exactDeliverable: `BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium physical-appearance illustration of a ${displayName}, matching a real, representative package form.`,
        outputSubfolder: "physical-components" as const,
        filenameBase: `components-physical-${component.replace(/_/g, "-")}-base`,
        needOverride: "USEFUL" as const,
        canonicalStates: [
          {
            stateId: `unit202.components.physical.${component.replace(/_/g, "-")}.state.teaching`,
            displayName: `Physical appearance — ${displayName} (blocked)`,
            pedagogicalState: "TEACHING" as const,
            annotationPolicy: "TEACHING_EXPLANATORY" as const,
            requiredLabels: ["component name"],
            notes: "CC-11.7 audit finding, USEFUL not REQUIRED -- more specialist than the six REQUIRED components; deferred to the secondary production queue.",
          },
        ],
      })),
    ],
  },
  {
    familyId: "unit202.family.electrolysis",
    displayName: "Chemical effect / electrolysis",
    instructionalPurpose: "A single, simple concept: one cell arrangement (source, electrolyte, electrodes, current path).",
    governedConcept: "LO4 — lesson.electrical.thermal-and-chemical-effects",
    familyNotes:
      "Single-asset family -- one arrangement, no distinct states or configurations to separate. CC-11.7 audit corroboration: EL-CURRENT-CHEMICAL-EFFECT-001 (electrolysis) has no representation anywhere in the deterministic CC-05D system (none of the 16 blueprints depict a chemistry apparatus), confirming this asset is REQUIRED, not merely USEFUL as originally scoped.",
    assets: [
      {
        sequence: 38,
        assetId: "unit202.electrolysis",
        familyId: "unit202.family.electrolysis",
        orderInFamily: 1,
        role: "PHENOMENON",
        displayName: "Chemical effect / electrolysis",
        loOrLesson: "LO4 — lesson.electrical.thermal-and-chemical-effects",
        priority: "P1",
        priorityLabel: "P1 (upgraded from P1/P2 -- CC-11.7 corpus corroboration)",
        productionClass: "HYBRID",
        productionClassLabel: "HYBRID",
        instructionalPurpose: "Show the chemical effect of current: a source, an electrolyte and electrodes, with a meaningful current path -- no chemistry beyond syllabus scope.",
        primaryReference: {
          sourceName: "Wikimedia Commons — Elektrolyse Allgemein.svg",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Elektrolyse_Allgemein.svg",
          licence: "prefer CC0/public-domain reference where available",
          qualityGrade: "B+",
        },
        secondaryReference: {
          sourceName: "Wikimedia Commons — Electrolysis diagram.png",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Electrolysis_diagram.png",
          licence: "recorded per source page",
          qualityGrade: "B",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["source", "electrolyte", "electrodes", "current path"],
        immutableFacts: ["source present", "electrolyte present", "electrodes present", "meaningful current path"],
        creativeFreedoms: ["premium vessel/electrode material rendering", "composition"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: ["do not introduce chemistry detail beyond Unit 202 syllabus scope"],
        exactDeliverable:
          "One premium illustration of an electrolysis cell showing source, electrolyte and electrodes, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "hybrid",
        filenameBase: "electrolysis-base",
        canonicalStates: [
          {
            stateId: "unit202.electrolysis.state.teaching",
            displayName: "Electrolysis cell — source, electrolyte, electrodes, current path",
            pedagogicalState: "TEACHING",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["source", "electrolyte", "electrodes", "current path"],
          },
        ],
      },
    ],
  },
  {
    familyId: "unit202.family.heating-effect",
    displayName: "Heating effect of electric current",
    instructionalPurpose: "A single conceptual illustration of resistive heating -- blocked pending a primary reference.",
    governedConcept: "LO4 — lesson.electrical.thermal-and-chemical-effects",
    familyNotes: "Single-asset family, reference not yet approved.",
    assets: [
      {
        sequence: 39,
        assetId: "unit202.heating-effect",
        familyId: "unit202.family.heating-effect",
        orderInFamily: 1,
        role: "PHENOMENON",
        displayName: "Heating effect of electric current",
        loOrLesson: "LO4 — lesson.electrical.thermal-and-chemical-effects",
        priority: "P2",
        priorityLabel: "P2",
        productionClass: "PREMIUM_CONCEPTUAL",
        productionClassLabel: "PREMIUM CONCEPTUAL / HYBRID",
        instructionalPurpose: "Show the heating effect of electric current (resistive heating) at a conceptual level.",
        primaryReference: NOT_READY_REF,
        referenceReadiness: "NOT_READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: [],
        immutableFacts: [],
        creativeFreedoms: [],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: ["do not generate until a primary reference is marked READY"],
        exactDeliverable: "BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY.",
        outputSubfolder: "conceptual",
        filenameBase: "heating-effect-base",
        canonicalStates: [
          {
            stateId: "unit202.heating-effect.state.teaching",
            displayName: "Heating effect of electric current (blocked)",
            pedagogicalState: "TEACHING",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: [],
            notes: "CC-11.7 audit: EL-CURRENT-THERMAL-EFFECT-001 has no deterministic representation either -- classification remains USEFUL (conceptual only, no spatial/topology content beyond a concept card already teaches), reference still not sourced.",
          },
        ],
      },
    ],
  },
  {
    familyId: "unit202.family.conductor-insulator",
    displayName: "Conductor vs insulator",
    instructionalPurpose: "A single conceptual comparison -- blocked pending a primary reference.",
    governedConcept: "LO4 — lesson.electrical.conductors-and-insulators",
    familyNotes: "Single-asset family, reference not yet approved.",
    assets: [
      {
        sequence: 40,
        assetId: "unit202.conductor-insulator",
        familyId: "unit202.family.conductor-insulator",
        orderInFamily: 1,
        role: "COMPARISON",
        displayName: "Conductor vs insulator",
        loOrLesson: "LO4 — lesson.electrical.conductors-and-insulators",
        priority: "P2",
        priorityLabel: "P2",
        productionClass: "PREMIUM_CONCEPTUAL",
        productionClassLabel: "PREMIUM CONCEPTUAL",
        instructionalPurpose: "Show a material-recognition comparison between conductors and insulators.",
        primaryReference: NOT_READY_REF,
        referenceReadiness: "NOT_READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: [],
        immutableFacts: [],
        creativeFreedoms: [],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: ["do not generate until a primary reference is marked READY"],
        exactDeliverable: "BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY.",
        outputSubfolder: "conceptual",
        filenameBase: "conductor-insulator-base",
        canonicalStates: [
          {
            stateId: "unit202.conductor-insulator.state.teaching",
            displayName: "Conductor vs insulator (blocked)",
            pedagogicalState: "TEACHING",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: [],
            notes: "CC-11.7 audit: every tested capability for this lesson is material-name classification by fact recall, not a spatial distinction -- USEFUL confirmed, not REQUIRED, reference still not sourced.",
          },
        ],
      },
    ],
  },
  {
    familyId: "unit202.family.protective-devices",
    displayName: "Fuse vs circuit breaker comparison",
    instructionalPurpose: "A single side-by-side comparison illustration -- blocked pending a primary reference.",
    governedConcept: "LO4 — lesson.electrical.fault-conditions-protection",
    familyNotes:
      "Single-asset family, reference not yet approved. CC-11.7 audit corroboration: a dedicated capability, cap.fault.compare_fuse_breaker, exists with zero visual representation anywhere in the corpus -- the fuse-vs-breaker reset/replace comparison is REQUIRED once a reference is sourced, upgraded from the original blocked/deferred framing. CC-11.7B correction: this asset's ROLE was PHYSICAL_RECOGNITION (a mismatch -- it does not depict one recognisable physical component) and its displayName/scope implied broader MCB/RCD physical-recognition coverage that was never actually modelled or corroborated; narrowed to what the governed capability actually asks for -- COMPARISON, fuse vs circuit breaker specifically -- per the explicit CC-11.7B pedagogical decision recorded on the asset's own sharedBaseAudit.",
    assets: [
      {
        sequence: 41,
        assetId: "unit202.protective-devices",
        familyId: "unit202.family.protective-devices",
        orderInFamily: 1,
        role: "COMPARISON",
        displayName: "Fuse vs circuit breaker comparison",
        loOrLesson: "LO4 — lesson.electrical.fault-conditions-protection",
        priority: "P2",
        priorityLabel: "P2",
        productionClass: "PREMIUM_CONCEPTUAL",
        productionClassLabel: "PREMIUM CONCEPTUAL + deterministic functional explanation",
        instructionalPurpose: "Show a fuse and a circuit breaker side by side, supporting cap.fault.compare_fuse_breaker (fuse must be replaced once blown; breaker can be reset), without endorsing one manufacturer's product appearance as canonical.",
        primaryReference: NOT_READY_REF,
        referenceReadiness: "NOT_READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["FUSE", "CIRCUIT BREAKER"],
        immutableFacts: ["one fuse and one circuit breaker shown side by side, not as two separate images", "must not endorse one manufacturer's product appearance as canonical"],
        creativeFreedoms: ["premium physical-object rendering", "composition", "lighting"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: [
          "do not generate until a primary reference is marked READY",
          "avoid making one manufacturer's product appearance canonical",
          "do not split into two separate images -- this is one comparison deliverable",
        ],
        exactDeliverable: "BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium side-by-side illustration (fuse | circuit breaker), matching the immutable facts exactly.",
        outputSubfolder: "conceptual",
        filenameBase: "protective-devices-fuse-vs-breaker-base",
        sharedBaseAudit: {
          classification: "SAFE_SHARED_BASE",
          action: "KEEP",
          rationale:
            "CC-11.7B §5/§8 explicit pedagogical decision: the comparison itself (fuse must be replaced; breaker can be reset) is the teaching objective cap.fault.compare_fuse_breaker asks for, matching the brief's own 'ACCEPTABLE: Fuse vs circuit breaker comparison where comparison itself is the teaching objective' example. Confirmed as one intentional composite ProductionAsset, not two independent physical-recognition assets. ROLE corrected from the pre-audit PHYSICAL_RECOGNITION (a mismatch for a two-object comparison) to COMPARISON.",
        },
        canonicalStates: [
          {
            stateId: "unit202.protective-devices.state.fuse-vs-breaker",
            displayName: "Fuse vs circuit breaker comparison (blocked)",
            pedagogicalState: "TEACHING",
            annotationPolicy: "TEACHING_EXPLANATORY",
            requiredLabels: ["FUSE", "CIRCUIT BREAKER"],
            notes: "REQUIRED once a reference is sourced -- cap.fault.compare_fuse_breaker has no visual representation anywhere in the corpus (CC-11.7 finding).",
          },
        ],
      },
    ],
  },
  {
    familyId: "unit202.family.trigonometry",
    displayName: "Right-angle triangle / SOHCAHTOA",
    instructionalPurpose: "A single deterministic geometry illustration -- lesson integration remains deferred.",
    governedConcept: "LO1 — no current lesson (integration deferred, see reports/instructional-visuals/visual-needs-matrix.md)",
    familyNotes: "Single-asset family, tracked for future commissioning only.",
    assets: [
      {
        sequence: 42,
        assetId: "unit202.trigonometry",
        familyId: "unit202.family.trigonometry",
        orderInFamily: 1,
        role: "TECHNICAL_DIAGRAM",
        displayName: "Right-angle triangle / SOHCAHTOA",
        loOrLesson: "LO1 — no current lesson (integration deferred, see reports/instructional-visuals/visual-needs-matrix.md)",
        priority: "P2",
        priorityLabel: "future / P2",
        productionClass: "DETERMINISTIC_TECHNICAL",
        productionClassLabel: "DETERMINISTIC TECHNICAL",
        instructionalPurpose: "A right-angle triangle showing hypotenuse/opposite/adjacent relative to a selected acute angle, supporting SOHCAHTOA -- lesson integration remains deferred.",
        primaryReference: {
          sourceName: "Standard right-triangle trigonometry reference -- to be selected when this asset is actually commissioned",
          sourceUrl: "",
          licence: "to be recorded when selected",
          qualityGrade: "to be assessed",
        },
        referenceReadiness: "READY",
        annotationPolicy: "NONE",
        requiredLabels: [],
        immutableFacts: ["right angle present", "hypotenuse opposite the right angle", "opposite/adjacent sides correctly identified relative to the selected acute angle"],
        creativeFreedoms: [],
        deterministicOverlayResponsibilities: ["the triangle geometry itself remains deterministic vector"],
        prohibitedChanges: ["do not build a new lesson to host this asset -- current lesson integration remains deferred per the content freeze"],
        exactDeliverable: "No lesson exists to host this asset yet -- tracked for future commissioning only, not for current production.",
        outputSubfolder: "deterministic-polish",
        filenameBase: "trigonometry-base",
        canonicalStates: [
          {
            stateId: "unit202.trigonometry.state.teaching",
            displayName: "Right-angle triangle / SOHCAHTOA",
            pedagogicalState: "TEACHING",
            annotationPolicy: "NONE",
            requiredLabels: [],
            notes: "NO ART PROMPT -- DETERMINISTIC once commissioned. No existing CC-05D blueprint yet (no lesson to attach it to); tracked for future commissioning only.",
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

export function allAssets(families: VisualFamily[] = FAMILIES): VisualAsset[] {
  return families.flatMap((family) => family.assets);
}

export function findAsset(assetId: string, families: VisualFamily[] = FAMILIES): VisualAsset | undefined {
  return allAssets(families).find((asset) => asset.assetId === assetId);
}

export function findFamily(familyId: string, families: VisualFamily[] = FAMILIES): VisualFamily | undefined {
  return families.find((family) => family.familyId === familyId);
}

export function familyForAsset(assetId: string, families: VisualFamily[] = FAMILIES): VisualFamily | undefined {
  return families.find((family) => family.assets.some((asset) => asset.assetId === assetId));
}

/**
 * An asset is genuinely promptable (i.e. the Studio should ever offer a
 * real ChatGPT ASSET-SPECIFIC PROMPT for it) only when its reference is
 * ready, its scope is not still pending confirmation, it has not been
 * explicitly marked `promptable: false`, AND its production class is not
 * `DETERMINISTIC_TECHNICAL`.
 *
 * CC-11.7C §3 correction: a `DETERMINISTIC_TECHNICAL` asset's
 * authoritative output is always deterministic vector geometry (SVG /
 * React Native SVG / equivalent rendering code) produced by ALP's own
 * tooling -- never a ChatGPT image-generation job, regardless of whether
 * its own `promptable` field happens to be set. Before this fix, an
 * asset that was DETERMINISTIC_TECHNICAL but had not explicitly set
 * `promptable: false` (e.g. `unit202.circuit.series`, `.parallel`,
 * `.mixed`, `unit202.instrument.connections`, `unit202.waveform.sine`,
 * `unit202.current-direction.electron-flow-vs-conventional`,
 * `unit202.gears.rotation-direction`) was incorrectly reported as
 * promptable, offering a real ChatGPT art prompt for something with no
 * art-generation deliverable at all.
 */
export function isPromptable(asset: VisualAsset): boolean {
  return asset.referenceReadiness === "READY" && !asset.needsScopeConfirmation && asset.promptable !== false && asset.productionClass !== "DETERMINISTIC_TECHNICAL";
}

/**
 * CC-11.7 §5 / CC-11.7B §12: the visual-need classification every
 * identified need in the comprehensive audit carries. Only REQUIRED
 * assets/states count toward Unit 202 visual completeness.
 *
 * CC-11.7B §12 CORRECTION: this is the PEDAGOGICAL NEED dimension only --
 * "does Unit 202 need this visual, and how badly" -- and is now fully
 * independent of PRODUCTION READINESS ("is a reference/artwork actually
 * available yet", tracked separately via `asset.referenceReadiness` /
 * `isReferenceBlocked()` below). The pre-CC-11.7B version of this function
 * returned "BLOCKED_REFERENCE" for any NOT_READY asset, which silently
 * demoted a REQUIRED-but-blocked asset out of the REQUIRED bucket in every
 * downstream count -- exactly the bug the brief's own "REQUIRED +
 * BLOCKED_REFERENCE is still REQUIRED" correction targets. A REQUIRED
 * asset that is also reference-blocked is REQUIRED here, and separately,
 * orthogonally, blocked -- never one or the other.
 */
export type VisualNeedClassification = "REQUIRED" | "USEFUL" | "NOT_NEEDED" | "DEFERRED_SCOPE";

export function visualNeedClassificationFor(asset: VisualAsset): VisualNeedClassification {
  if (asset.needsScopeConfirmation) return "DEFERRED_SCOPE";
  if (asset.assetId === "unit202.trigonometry") return "DEFERRED_SCOPE";
  if (asset.needOverride === "USEFUL") return "USEFUL";
  return "REQUIRED";
}

/**
 * CC-11.7B §12: the PRODUCTION READINESS dimension, orthogonal to
 * `visualNeedClassificationFor`'s pedagogical-need dimension. An asset can
 * be REQUIRED-and-blocked, REQUIRED-and-ready, USEFUL-and-blocked, or
 * USEFUL-and-ready -- all four combinations are real and must never be
 * collapsed into one axis.
 */
export function isReferenceBlocked(asset: VisualAsset): boolean {
  return asset.referenceReadiness === "NOT_READY";
}

export function promptableAssets(families: VisualFamily[] = FAMILIES): VisualAsset[] {
  return allAssets(families).filter(isPromptable);
}

/** Mechanically proves catalogue integrity -- no duplicate family/asset ids, sequences, or filename stems, and every enum field is a real declared value. */
export function validateCatalogue(families: VisualFamily[] = FAMILIES): string[] {
  const problems: string[] = [];
  const seenFamilyIds = new Set<string>();
  const seenAssetIds = new Set<string>();
  const seenSequences = new Set<number>();
  const seenFilenames = new Set<string>();
  const seenStateIds = new Set<string>();

  for (const family of families) {
    if (seenFamilyIds.has(family.familyId)) problems.push(`duplicate familyId: ${family.familyId}`);
    seenFamilyIds.add(family.familyId);

    if (family.assets.length === 0) problems.push(`${family.familyId}: family has zero assets`);

    family.assets.forEach((asset, index) => {
      if (asset.familyId !== family.familyId) {
        problems.push(`${asset.assetId}: familyId '${asset.familyId}' does not match its containing family '${family.familyId}'`);
      }
      if (asset.orderInFamily !== index + 1) {
        problems.push(`${asset.assetId}: orderInFamily ${asset.orderInFamily} does not match its actual position ${index + 1} in '${family.familyId}'`);
      }

      if (seenAssetIds.has(asset.assetId)) problems.push(`duplicate assetId: ${asset.assetId}`);
      seenAssetIds.add(asset.assetId);

      if (seenSequences.has(asset.sequence)) problems.push(`duplicate sequence: ${asset.sequence}`);
      seenSequences.add(asset.sequence);

      if (seenFilenames.has(asset.filenameBase)) problems.push(`duplicate filenameBase: ${asset.filenameBase}`);
      seenFilenames.add(asset.filenameBase);

      if (!PRODUCTION_CLASSES.includes(asset.productionClass)) problems.push(`${asset.assetId}: invalid productionClass ${asset.productionClass}`);
      if (!PRIORITIES.includes(asset.priority)) problems.push(`${asset.assetId}: invalid priority ${asset.priority}`);
      if (!OUTPUT_SUBFOLDERS.includes(asset.outputSubfolder)) problems.push(`${asset.assetId}: invalid outputSubfolder ${asset.outputSubfolder}`);
      if (!VISUAL_ASSET_ROLES.includes(asset.role)) problems.push(`${asset.assetId}: invalid role ${asset.role}`);

      if (asset.referenceReadiness === "NOT_READY" && asset.primaryReference.sourceUrl) {
        problems.push(`${asset.assetId}: marked NOT_READY but primaryReference has a sourceUrl -- readiness state is inconsistent`);
      }
      if (asset.referenceReadiness === "READY" && !asset.primaryReference.sourceName) {
        problems.push(`${asset.assetId}: marked READY but has no primaryReference.sourceName`);
      }
      if (!/^[a-z0-9-]+$/.test(asset.filenameBase)) {
        problems.push(`${asset.assetId}: filenameBase '${asset.filenameBase}' is not a safe lowercase-kebab stem`);
      }

      // CC-11.7A §7/§8/§9: ONE ART PROMPT PER DISTINCT IMAGE JOB. A
      // PHYSICAL_RECOGNITION asset depicts one specific physical object --
      // several such states sharing one asset would mean several genuinely
      // different images (a resistor is not a capacitor with a toggled
      // annotation) are being collapsed behind one prompt/filename/save
      // slot, exactly the granularity error the package's own brief
      // documents as incorrect. Unlike PHENOMENON/CONFIGURATION/etc. roles
      // (where multiple states legitimately share one base image via
      // deterministic annotation), a PHYSICAL_RECOGNITION asset must carry
      // exactly one state.
      if (asset.role === "PHYSICAL_RECOGNITION" && asset.canonicalStates.length > 1) {
        problems.push(
          `${asset.assetId}: PHYSICAL_RECOGNITION asset has ${asset.canonicalStates.length} canonicalStates -- each distinct physical component/instrument must be its own ProductionAsset with its own prompt and save slot, never combined behind one asset`,
        );
      }

      // CC-11.7 §7/§9: a base asset with zero canonical states is meaningless,
      // and every state's id/enum fields must be structurally valid --
      // "zero existing canonical variants silently lost" starts here.
      if (asset.canonicalStates.length === 0) {
        problems.push(`${asset.assetId}: has zero canonicalStates -- every production asset must support at least one learner-visible state`);
      }
      for (const state of asset.canonicalStates) {
        if (seenStateIds.has(state.stateId)) problems.push(`duplicate stateId: ${state.stateId}`);
        seenStateIds.add(state.stateId);

        if (!state.stateId.startsWith(asset.assetId)) {
          problems.push(`${asset.assetId}: state '${state.stateId}' does not begin with its owning assetId`);
        }
        if (!PEDAGOGICAL_STATES.includes(state.pedagogicalState)) {
          problems.push(`${asset.assetId}/${state.stateId}: invalid pedagogicalState ${state.pedagogicalState}`);
        }
        if (!ANNOTATION_POLICIES.includes(state.annotationPolicy)) {
          problems.push(`${asset.assetId}/${state.stateId}: invalid annotationPolicy ${state.annotationPolicy}`);
        }
        // ANNOTATION FOLLOWS PEDAGOGICAL STATE, mechanically: an ASSESSMENT
        // state must never declare an explanatory/labelling policy, and a
        // MNEMONIC-role asset (assessment always leaks the answer via the
        // hand itself) must never declare an ASSESSMENT state at all.
        if (state.pedagogicalState === "ASSESSMENT" && (state.annotationPolicy === "TEACHING_EXPLANATORY" || state.annotationPolicy === "FEEDBACK_EXPLANATORY")) {
          problems.push(`${asset.assetId}/${state.stateId}: ASSESSMENT state declares an explanatory annotationPolicy (${state.annotationPolicy}) -- known answer-bearing leak`);
        }
        if (asset.role === "MNEMONIC" && state.pedagogicalState === "ASSESSMENT") {
          problems.push(`${asset.assetId}/${state.stateId}: a MNEMONIC-role asset must never declare an ASSESSMENT state (the hand itself is the answer-bearing mnemonic dependency)`);
        }
      }
    });
  }

  return problems;
}
