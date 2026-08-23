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
        requiredLabels: ["current-direction arrow/label", "field-circulation direction indicator"],
        immutableFacts: [
          "straight current-carrying conductor",
          "magnetic field circulates around the conductor (closed concentric loops, not radiating outward)",
          "reversing the current reverses the direction of circulation",
          "any depiction of field strength must not contradict a stronger field nearer the conductor",
        ],
        creativeFreedoms: ["premium conductor material/finish", "field-line stylisation", "composition"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: ["do not include a hand in this asset -- that is the separate MNEMONIC asset in this family"],
        exactDeliverable:
          "One premium illustration of a straight conductor with concentric magnetic field lines circulating around it, current direction indicated, matching the reference field geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        assessmentNote: "Not the mnemonic itself -- may appear in assessment context as the phenomenon being questioned, distinct from the MNEMONIC asset which never appears in assessment.",
        outputSubfolder: "hybrid",
        filenameBase: "current-conductor-magnetic-field-base",
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
        ],
        exactDeliverable:
          "One premium illustration of a right hand gripping a straight current-carrying conductor, thumb and curled fingers clearly demonstrating the rule. Include the explanatory annotations THUMB = CURRENT and FINGERS = MAGNETIC FIELD plus the correct current and magnetic-field direction indicators -- this is a TEACHING asset and clear labels are part of the deliverable, not something to omit for visual cleanliness. Matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        assessmentNote: "Assessment contains NO hand — teaching only.",
        outputSubfolder: "teaching",
        filenameBase: "right-hand-grip-teaching-base",
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
      {
        sequence: 3,
        assetId: "unit202.motor.effect",
        familyId: "unit202.family.fleming-left-hand-motor",
        orderInFamily: 1,
        role: "PHENOMENON",
        displayName: "Motor effect — conductor in magnetic field",
        loOrLesson: "LO5 — lesson.magnetism.effects-of-current",
        priority: "P0",
        priorityLabel: "P0",
        productionClass: "HYBRID",
        productionClassLabel: "HYBRID",
        governedDiagramBlueprintId: "motor.force_field_current",
        instructionalPurpose:
          "Show a current-carrying conductor between magnetic poles experiencing a force perpendicular to both the field and the current (the motor effect), distinct from the Fleming's-left-hand mnemonic itself.",
        primaryReference: {
          sourceName: "Existing governed ALP motor-effect geometry (motor.force_field_current) plus a reputable human-readable motor-effect reference",
          sourceUrl: "",
          licence: "internal governed geometry -- external reference to be added when sourced",
          qualityGrade: "internal A (geometry); external reference pending",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["N", "S", "current-direction indicator", "force-direction indicator"],
        immutableFacts: [
          "N to S field direction",
          "conductor positioned between the poles",
          "current explicitly into or out of the page",
          "resulting force perpendicular to both field and current",
          "must remain visually distinct from the hand-rule mnemonic asset",
        ],
        creativeFreedoms: ["premium magnet/conductor physical-object rendering", "composition", "finish"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: ["do not include a hand in this asset -- that is the separate MNEMONIC asset in this family"],
        exactDeliverable:
          "One premium illustration of magnet poles with a conductor between them, ready to receive deterministic N/S, field, current and force overlays, matching the existing governed motor-effect geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "hybrid",
        filenameBase: "motor-effect-base",
      },
      {
        sequence: 4,
        assetId: "unit202.fleming-left-hand.teaching",
        familyId: "unit202.family.fleming-left-hand-motor",
        orderInFamily: 2,
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
        prohibitedChanges: ["do not swap to the right hand", "do not reassign which finger represents which quantity"],
        exactDeliverable:
          "One premium illustration of a left hand with thumb, first finger and second finger held mutually perpendicular, clearly and unambiguously demonstrating Force/Field/Current correspondence. Include the explanatory annotations MOTION / FORCE, FIELD and CURRENT on the corresponding digit -- this is a TEACHING asset and clear labels are part of the deliverable. Matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        assessmentNote: "Assessment: NO hand. Use the PHENOMENON asset's physical motor-effect apparatus instead.",
        outputSubfolder: "teaching",
        filenameBase: "fleming-left-hand-teaching-base",
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
      {
        sequence: 5,
        assetId: "unit202.generator.rotating-loop",
        familyId: "unit202.family.fleming-right-hand-generator",
        orderInFamily: 1,
        role: "PHENOMENON",
        displayName: "Simple rotating-loop AC generator",
        loOrLesson: "LO5 — lesson.emf.ac-generation-principles",
        priority: "P0",
        priorityLabel: "P0",
        productionClass: "HYBRID",
        productionClassLabel: "HYBRID",
        governedDiagramBlueprintId: "generator.rotating_loop",
        instructionalPurpose:
          "Show a single loop of wire rotating on a central axis between N and S poles, establishing the physical basis of single-loop AC generation at Level 2 depth.",
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
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["N", "S", "coil/loop", "rotation indicator", "output where useful"],
        immutableFacts: [
          "N/S magnetic poles",
          "loop/coil between the poles",
          "central rotational axis",
          "output/slip-ring concept at governed Level-2 abstraction",
          "rotating conductor cuts magnetic flux",
        ],
        creativeFreedoms: ["premium pole/housing/loop rendering", "composition", "finish"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: ["do not substitute a detailed modern alternator", "do not add three-phase windings, phasors or brushes/commutator detail beyond governed scope"],
        exactDeliverable:
          "One premium illustration of a single wire loop rotating on a central axis between clearly labelled N and S poles, with a minimal slip-ring/output connection concept, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "hybrid",
        filenameBase: "generator-rotating-loop-base",
      },
      {
        sequence: 6,
        assetId: "unit202.fleming-right-hand.teaching",
        familyId: "unit202.family.fleming-right-hand-generator",
        orderInFamily: 2,
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
        prohibitedChanges: ["do not swap to the left hand", "do not reassign which finger represents which quantity"],
        exactDeliverable:
          "One premium illustration of a right hand with thumb, first finger and second finger held mutually perpendicular, clearly and unambiguously demonstrating Motion/Field/induced-Current correspondence. Include the explanatory annotations MOTION, FIELD and INDUCED CURRENT / EMF on the corresponding digit -- this is a TEACHING asset and clear labels are part of the deliverable. Matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        assessmentNote: "Assessment: NO hand.",
        outputSubfolder: "teaching",
        filenameBase: "fleming-right-hand-teaching-base",
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
      },
      {
        sequence: 13,
        assetId: "unit202.magnet.poles",
        familyId: "unit202.family.magnetism",
        orderInFamily: 2,
        role: "COMPARISON",
        displayName: "Magnetic pole attraction / repulsion",
        loOrLesson: "LO5 — lesson.magnetism.fundamentals",
        priority: "P1",
        priorityLabel: "P1",
        productionClass: "HYBRID",
        productionClassLabel: "HYBRID",
        governedDiagramBlueprintId: "magnetic.pole_interaction",
        instructionalPurpose: "Show like poles repelling and unlike poles attracting from the pole labels on two facing bar magnets.",
        primaryReference: {
          sourceName: "Public-domain historical iron-filings attraction/repulsion illustrations, plus the approved bar-magnet reference (unit202.magnet.field)",
          sourceUrl: "",
          licence: "public-domain historical -- record exact source when selected",
          qualityGrade: "B+",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["N", "S", "attract/repel force-arrow indicator"],
        immutableFacts: ["unlike poles attract", "like poles repel", "field behaviour between the two magnets must remain physically meaningful"],
        creativeFreedoms: ["premium magnet-body rendering", "composition"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: [
          "this premium asset is TEACHING-only -- the separate deterministic magnetic.pole_interaction diagram (not this asset) is what governs the assessment-mode reveal/withhold state; do not treat this teaching image's own labels as an assessment-answer leak",
        ],
        exactDeliverable:
          "Two premium illustrations (like poles facing; unlike poles facing) of two bar magnets, matching the reference relationship exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "hybrid",
        filenameBase: "magnet-poles-base",
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
      },
    ],
  },
  {
    familyId: "unit202.family.gears",
    displayName: "Driver/driven gears",
    instructionalPurpose: "A single, simple concept: one relative-size relationship between a driver and driven gear.",
    governedConcept: "LO3 — lesson.foundation.physics.simple-machines (mechanical.gear_mesh)",
    familyNotes: "Single-asset family -- the driver/driven ratio is one relationship, not multiple distinct configurations, so no split is justified.",
    assets: [
      {
        sequence: 18,
        assetId: "unit202.gears",
        familyId: "unit202.family.gears",
        orderInFamily: 1,
        role: "CONFIGURATION",
        displayName: "Driver/driven gears",
        loOrLesson: "LO3 — lesson.foundation.physics.simple-machines",
        priority: "P1",
        priorityLabel: "P1",
        productionClass: "HYBRID",
        productionClassLabel: "POLISHED DETERMINISTIC / HYBRID",
        governedDiagramBlueprintId: "mechanical.gear_mesh",
        instructionalPurpose: "Show a driver gear meshed with a driven gear whose relative size represents the gear ratio and the resulting torque/speed trade-off.",
        primaryReference: {
          sourceName: "Wikimedia Commons — Example of a Compound Gear Train.png",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Example_of_a_Compound_Gear_Train.png",
          licence: "CC0",
          qualityGrade: "A",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["Driver", "Driven"],
        immutableFacts: ["meaningful driver/driven relationship", "physically plausible mesh", "relative size represents the ratio", "correct rotation relationship when shown"],
        creativeFreedoms: ["premium gear/material rendering", "composition", "finish"],
        deterministicOverlayResponsibilities: ["rotation-direction overlay where taught"],
        prohibitedChanges: ["do not depict a mesh that is not physically plausible"],
        exactDeliverable:
          "One premium illustration of two meshed gears with a clear relative-size relationship, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "hybrid",
        filenameBase: "gears-base",
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
        primaryReference: {
          sourceName: "OpenStax wire/conductor cylinder diagrams",
          sourceUrl: "",
          licence: "OpenStax -- CC BY, record exact chapter/figure when selected",
          qualityGrade: "A",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["length comparison caption", "qualitative-consequence caption (\"longer -> more resistance\")"],
        immutableFacts: ["increased length -> greater resistance (cross-sectional area unchanged)"],
        creativeFreedoms: ["premium conductor-material rendering", "composition", "finish"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: ["do not embed a numeric R = rho L / A calculation", "do not also vary cross-sectional area in this asset"],
        exactDeliverable:
          "One premium illustration of two conductor rods differing only in length, matching the reference relationship exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "hybrid",
        filenameBase: "resistivity-length-comparison-base",
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
        primaryReference: {
          sourceName: "OpenStax wire/conductor cylinder diagrams",
          sourceUrl: "",
          licence: "OpenStax -- CC BY, record exact chapter/figure when selected",
          qualityGrade: "A",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["area comparison caption", "qualitative-consequence caption (\"thicker -> less resistance\")"],
        immutableFacts: ["increased cross-sectional area -> lower resistance (length unchanged)"],
        creativeFreedoms: ["premium conductor-material rendering", "composition", "finish"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: ["do not embed a numeric R = rho L / A calculation", "do not also vary length in this asset"],
        exactDeliverable:
          "One premium illustration of two conductor rods differing only in cross-sectional area, matching the reference relationship exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "hybrid",
        filenameBase: "resistivity-area-comparison-base",
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
        primaryReference: {
          sourceName: "Existing governed ALP motional-EMF geometry (emf.motional_emf_geometry) -- add a human-readable physics reference before premium rebuild",
          sourceUrl: "",
          licence: "internal governed geometry -- external reference pending",
          qualityGrade: "internal A; external reference pending",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["B", "l", "v"],
        immutableFacts: ["B, l and v mutually perpendicular for the governed e = Blv case", "rod across rails", "velocity along the rails", "field perpendicular to the rail plane"],
        creativeFreedoms: ["premium rail/rod material rendering", "composition"],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: ["do not draw B, l or v as anything other than mutually perpendicular"],
        exactDeliverable:
          "One premium illustration of a conductor rod across two rails ready to receive B/l/v overlay arrows, matching the existing governed geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "hybrid",
        filenameBase: "emf-motional-base",
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
        promptable: false,
      },
      {
        sequence: 24,
        assetId: "unit202.components.physical",
        familyId: "unit202.family.electronic-components",
        orderInFamily: 2,
        role: "PHYSICAL_RECOGNITION",
        displayName: "Physical electronic component companion family",
        loOrLesson: "LO6 — lesson.electrical.electronic-components-passive / -switching-control",
        priority: "P1",
        priorityLabel: "P1/P2",
        productionClass: "PREMIUM_CONCEPTUAL",
        productionClassLabel: "PREMIUM CONCEPTUAL + deterministic UK/IEC symbol",
        instructionalPurpose:
          "A physical-appearance companion image per governed component (resistor, capacitor, diode, LED, thermistor, transistor, TRIAC, thyristor/SCR and others where a physical image genuinely improves recognition), paired with its existing deterministic symbol card.",
        primaryReference: {
          sourceName: "Physical reference material per component (manufacturer/datasheet photography or equivalent, sourced individually per component)",
          sourceUrl: "",
          licence: "record individually per component when sourced",
          qualityGrade: "to be assessed per component",
        },
        referenceReadiness: "READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: ["component name"],
        immutableFacts: ["package form must be a real, representative physical form for the named component type"],
        creativeFreedoms: ["premium photographic-impression rendering", "composition", "lighting"],
        deterministicOverlayResponsibilities: ["pairing with the existing deterministic UK/IEC symbol card"],
        prohibitedChanges: ["do not invent a misleading package form for any component"],
        exactDeliverable:
          "One premium physical-appearance illustration per selected component, matching real, representative package forms. Produce ONLY this asset -- do not automatically create the other members of this visual family.",
        outputSubfolder: "physical-components",
        filenameBase: "components-physical-base",
      },
    ],
  },
  {
    familyId: "unit202.family.electrolysis",
    displayName: "Chemical effect / electrolysis",
    instructionalPurpose: "A single, simple concept: one cell arrangement (source, electrolyte, electrodes, current path).",
    governedConcept: "LO4 — lesson.electrical.thermal-and-chemical-effects",
    familyNotes: "Single-asset family -- one arrangement, no distinct states or configurations to separate.",
    assets: [
      {
        sequence: 25,
        assetId: "unit202.electrolysis",
        familyId: "unit202.family.electrolysis",
        orderInFamily: 1,
        role: "PHENOMENON",
        displayName: "Chemical effect / electrolysis",
        loOrLesson: "LO4 — lesson.electrical.thermal-and-chemical-effects",
        priority: "P1",
        priorityLabel: "P1/P2",
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
        sequence: 26,
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
        sequence: 27,
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
      },
    ],
  },
  {
    familyId: "unit202.family.protective-devices",
    displayName: "Fuse / MCB / RCD conceptual visual",
    instructionalPurpose: "A single conceptual recognition illustration -- blocked pending a primary reference.",
    governedConcept: "LO4 — lesson.electrical.fault-conditions-protection",
    familyNotes: "Single-asset family, reference not yet approved.",
    assets: [
      {
        sequence: 28,
        assetId: "unit202.protective-devices",
        familyId: "unit202.family.protective-devices",
        orderInFamily: 1,
        role: "PHYSICAL_RECOGNITION",
        displayName: "Fuse / MCB / RCD conceptual visual",
        loOrLesson: "LO4 — lesson.electrical.fault-conditions-protection",
        priority: "P2",
        priorityLabel: "P2",
        productionClass: "PREMIUM_CONCEPTUAL",
        productionClassLabel: "PREMIUM CONCEPTUAL + deterministic functional explanation",
        instructionalPurpose: "Show protective-device recognition (fuse/MCB/RCD) at a conceptual level, without endorsing one manufacturer's product appearance as canonical.",
        primaryReference: NOT_READY_REF,
        referenceReadiness: "NOT_READY",
        annotationPolicy: "TEACHING_EXPLANATORY",
        requiredLabels: [],
        immutableFacts: [],
        creativeFreedoms: [],
        deterministicOverlayResponsibilities: [],
        prohibitedChanges: ["do not generate until a primary reference is marked READY", "avoid making one manufacturer's product appearance canonical"],
        exactDeliverable: "BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY.",
        outputSubfolder: "conceptual",
        filenameBase: "protective-devices-base",
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
        sequence: 29,
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
 * ready, its scope is not still pending confirmation, and it has not
 * been explicitly marked `promptable: false` (a deterministic-only asset
 * with no image-generation deliverable at all).
 */
export function isPromptable(asset: VisualAsset): boolean {
  return asset.referenceReadiness === "READY" && !asset.needsScopeConfirmation && asset.promptable !== false;
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
    });
  }

  return problems;
}
