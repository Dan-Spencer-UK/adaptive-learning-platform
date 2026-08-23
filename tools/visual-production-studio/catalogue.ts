/**
 * CC-11.5: the structured Unit 202 premium-visual production catalogue.
 *
 * This is the single source of truth prompt-builder.ts builds every
 * copyable prompt from (task brief §10: "Do NOT manually paste 30
 * unrelated giant prompt strings into HTML"). Nothing here is learner
 * content, a governed pedagogical entity, or part of the CC-05A/CC-05D
 * corpus -- it is production-tooling metadata describing how to source
 * reference material and commission artwork for visuals that already
 * are (or may become) governed via that corpus. Adding an entry here
 * does not create a DiagramBlueprint/VisualSemanticContract; wiring a
 * finished, approved asset into a real lesson is a separate, later step
 * outside this tool's scope (task brief §20).
 */

export type ProductionClass = "DETERMINISTIC_TECHNICAL" | "PREMIUM_CONCEPTUAL" | "HYBRID";
export type Priority = "P0" | "P1" | "P2";
export type OutputSubfolder = "teaching" | "conceptual" | "hybrid" | "physical-components" | "deterministic-polish";
export type ReferenceReadiness = "READY" | "NOT_READY";

export const PRODUCTION_CLASSES: readonly ProductionClass[] = ["DETERMINISTIC_TECHNICAL", "PREMIUM_CONCEPTUAL", "HYBRID"];
export const PRIORITIES: readonly Priority[] = ["P0", "P1", "P2"];
export const OUTPUT_SUBFOLDERS: readonly OutputSubfolder[] = ["teaching", "conceptual", "hybrid", "physical-components", "deterministic-polish"];

export interface CatalogueReference {
  sourceName: string;
  sourceUrl: string;
  licence: string;
  qualityGrade: string;
}

export interface CatalogueEntry {
  sequence: number;
  assetId: string;
  displayName: string;
  loOrLesson?: string;
  priority: Priority;
  /** Exact priority text as specified (e.g. "P1/P2", "future / P2") -- `priority` above is the normalised filter value. */
  priorityLabel: string;
  productionClass: ProductionClass;
  /** Exact nuanced production-class text as specified (e.g. "HYBRID / PREMIUM TEACHING"). */
  productionClassLabel: string;
  currentFamily?: string;
  instructionalPurpose: string;
  primaryReference: CatalogueReference;
  secondaryReference?: CatalogueReference;
  referenceReadiness: ReferenceReadiness;
  immutableFacts: string[];
  creativeFreedoms: string[];
  deterministicOverlayResponsibilities: string[];
  prohibitedChanges: string[];
  exactDeliverable: string;
  assessmentNote?: string;
  outputSubfolder: OutputSubfolder;
  filenameBase: string;
}

const NOT_READY_REF: CatalogueReference = {
  sourceName: "PRIMARY REFERENCE STILL TO BE APPROVED",
  sourceUrl: "",
  licence: "unknown -- not yet sourced",
  qualityGrade: "n/a",
};

export const CATALOGUE: CatalogueEntry[] = [
  {
    sequence: 1,
    assetId: "unit202.right-hand-grip.teaching",
    displayName: "Right-hand grip rule — teaching mnemonic",
    loOrLesson: "LO5 — lesson.magnetism.effects-of-current",
    priority: "P0",
    priorityLabel: "P0",
    productionClass: "HYBRID",
    productionClassLabel: "HYBRID / PREMIUM TEACHING",
    currentFamily: "magnetic.field_conductor_direction",
    instructionalPurpose:
      "Teach that gripping a current-carrying conductor with the right hand, thumb along conventional current direction, gives the direction the magnetic field circulates as shown by the curled fingers.",
    primaryReference: {
      sourceName: "Wikimedia Commons — Right-hand grip rule.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Right-hand_grip_rule.svg",
      licence: "Public-domain dedication",
      qualityGrade: "A",
    },
    referenceReadiness: "READY",
    immutableFacts: [
      "RIGHT hand",
      "thumb = conventional current direction",
      "curled fingers = magnetic-field circulation direction",
      "reversing current reverses magnetic-field rotation",
      "straight conductor axis",
    ],
    creativeFreedoms: ["premium hand rendering", "conductor styling", "composition", "finish"],
    deterministicOverlayResponsibilities: ["final current labels/arrows if separated from the illustrated layer", "assessment-state control"],
    prohibitedChanges: [
      "do not swap to the left hand",
      "do not depict the thumb pointing anywhere other than along the conductor's conventional current direction",
    ],
    exactDeliverable:
      "One (or, if visually superior, two opposite-current variant) premium illustration(s) of a right hand gripping a straight current-carrying conductor, thumb and curled fingers clearly demonstrating the rule, matching the reference geometry exactly.",
    assessmentNote: "Assessment contains NO hand — teaching only.",
    outputSubfolder: "teaching",
    filenameBase: "right-hand-grip-teaching-base",
  },
  {
    sequence: 2,
    assetId: "unit202.fleming-left-hand.teaching",
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
    immutableFacts: [
      "LEFT hand",
      "thumb = force/motion",
      "first (index) finger = magnetic FIELD",
      "second (middle) finger = conventional CURRENT",
      "mutually perpendicular relationship between all three",
    ],
    creativeFreedoms: ["premium hand rendering", "finger-labelling styling", "composition", "finish"],
    deterministicOverlayResponsibilities: ["F/B/I letter or direction labels if separated from the illustrated layer", "assessment-state control"],
    prohibitedChanges: ["do not swap to the right hand", "do not reassign which finger represents which quantity"],
    exactDeliverable:
      "One premium illustration of a left hand with thumb, first finger and second finger held mutually perpendicular, clearly and unambiguously demonstrating Force/Field/Current correspondence, matching the reference geometry exactly.",
    assessmentNote: "Assessment: NO hand. Use physical motor-effect apparatus instead (see unit202.motor.effect).",
    outputSubfolder: "teaching",
    filenameBase: "fleming-left-hand-teaching-base",
  },
  {
    sequence: 3,
    assetId: "unit202.fleming-right-hand.teaching",
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
    immutableFacts: [
      "RIGHT hand",
      "thumb = conductor MOTION",
      "first (index) finger = magnetic FIELD",
      "second (middle) finger = induced current/EMF",
      "three directions mutually perpendicular",
    ],
    creativeFreedoms: ["premium hand rendering", "finger-labelling styling", "composition", "finish"],
    deterministicOverlayResponsibilities: ["M/F/I letter or direction labels if separated from the illustrated layer", "assessment-state control"],
    prohibitedChanges: ["do not swap to the left hand", "do not reassign which finger represents which quantity"],
    exactDeliverable:
      "One premium illustration of a right hand with thumb, first finger and second finger held mutually perpendicular, clearly and unambiguously demonstrating Motion/Field/induced-Current correspondence, matching the reference geometry exactly.",
    assessmentNote: "Assessment: NO hand.",
    outputSubfolder: "teaching",
    filenameBase: "fleming-right-hand-teaching-base",
  },
  {
    sequence: 4,
    assetId: "unit202.generator.rotating-loop",
    displayName: "Simple rotating-loop AC generator",
    loOrLesson: "LO5 — lesson.emf.ac-generation-principles",
    priority: "P0",
    priorityLabel: "P0",
    productionClass: "HYBRID",
    productionClassLabel: "HYBRID",
    currentFamily: "generator.rotating_loop",
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
    immutableFacts: [
      "N/S magnetic poles",
      "loop/coil between the poles",
      "central rotational axis",
      "output/slip-ring concept at governed Level-2 abstraction",
      "rotating conductor cuts magnetic flux",
    ],
    creativeFreedoms: ["premium pole/housing/loop rendering", "composition", "finish"],
    deterministicOverlayResponsibilities: ["N/S pole labels", "output-connection labelling", "rotation-phase state overlay"],
    prohibitedChanges: ["do not substitute a detailed modern alternator", "do not add three-phase windings, phasors or brushes/commutator detail beyond governed scope"],
    exactDeliverable:
      "One premium illustration of a single wire loop rotating on a central axis between clearly labelled N and S poles, with a minimal slip-ring/output connection concept, matching the reference geometry exactly.",
    outputSubfolder: "hybrid",
    filenameBase: "generator-rotating-loop-base",
  },
  {
    sequence: 5,
    assetId: "unit202.motor.effect",
    displayName: "Motor effect — conductor in magnetic field",
    loOrLesson: "LO5 — lesson.magnetism.effects-of-current",
    priority: "P0",
    priorityLabel: "P0",
    productionClass: "HYBRID",
    productionClassLabel: "HYBRID",
    currentFamily: "motor.force_field_current",
    instructionalPurpose:
      "Show a current-carrying conductor between magnetic poles experiencing a force perpendicular to both the field and the current (the motor effect), distinct from the Fleming's-left-hand mnemonic itself.",
    primaryReference: {
      sourceName: "Existing governed ALP motor-effect geometry (motor.force_field_current) plus a reputable human-readable motor-effect reference",
      sourceUrl: "",
      licence: "internal governed geometry -- external reference to be added when sourced",
      qualityGrade: "internal A (geometry); external reference pending",
    },
    referenceReadiness: "READY",
    immutableFacts: [
      "N to S field direction",
      "conductor positioned between the poles",
      "current explicitly into or out of the page",
      "resulting force perpendicular to both field and current",
      "must remain visually distinct from the hand-rule mnemonic asset",
    ],
    creativeFreedoms: ["premium magnet/conductor physical-object rendering", "composition", "finish"],
    deterministicOverlayResponsibilities: ["N/S labels", "field-direction overlay", "current-direction overlay", "force-direction overlay"],
    prohibitedChanges: ["do not include a hand in this asset -- that is the separate Fleming's-left-hand mnemonic asset"],
    exactDeliverable:
      "One premium illustration of magnet poles with a conductor between them, ready to receive deterministic N/S, field, current and force overlays, matching the existing governed motor-effect geometry exactly.",
    outputSubfolder: "hybrid",
    filenameBase: "motor-effect-base",
  },
  {
    sequence: 6,
    assetId: "unit202.levers.classes",
    displayName: "Lever classes I / II / III",
    loOrLesson: "LO3 — lesson.foundation.physics.simple-machines",
    priority: "P0",
    priorityLabel: "P0",
    productionClass: "HYBRID",
    productionClassLabel: "HYBRID",
    currentFamily: "mechanical.lever_arrangement",
    instructionalPurpose: "Show the three lever classes so a learner can identify class from the fulcrum/effort/load arrangement itself.",
    primaryReference: {
      sourceName: "Pearson Scott Foresman — Lever (PSF).svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Lever_(PSF).svg",
      licence: "Public domain",
      qualityGrade: "A+",
    },
    referenceReadiness: "READY",
    immutableFacts: [
      "Class I: fulcrum between effort and load",
      "Class II: load between fulcrum and effort",
      "Class III: effort between fulcrum and load",
    ],
    creativeFreedoms: ["premium physical lever-rig rendering", "material/finish", "composition"],
    deterministicOverlayResponsibilities: ["effort/load/fulcrum labels", "arm-dimension labels where taught"],
    prohibitedChanges: ["do not blend or ambiguate the three class arrangements into one image"],
    exactDeliverable:
      "Three premium illustrations (one per lever class) of a bar with a clearly positioned fulcrum, effort point and load point matching each class's governed arrangement, matching the reference geometry exactly.",
    outputSubfolder: "hybrid",
    filenameBase: "levers-classes-base",
  },
  {
    sequence: 7,
    assetId: "unit202.pulleys.fixed-movable",
    displayName: "Fixed vs movable pulley",
    loOrLesson: "LO3 — lesson.foundation.physics.simple-machines",
    priority: "P0",
    priorityLabel: "P0",
    productionClass: "HYBRID",
    productionClassLabel: "HYBRID",
    currentFamily: "mechanical.pulley_arrangement",
    instructionalPurpose: "Contrast a fixed pulley (direction change only, MA≈1) with a simple movable pulley (MA≈2, two supporting rope segments).",
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
    immutableFacts: [
      "fixed pulley changes rope direction only, MA approximately 1",
      "simple movable pulley has exactly two supporting rope segments",
      "physically continuous/plausible rope path",
    ],
    creativeFreedoms: ["premium pulley/load/support-hardware rendering", "composition", "finish"],
    deterministicOverlayResponsibilities: ["rope path (may remain deterministic if necessary)", "effort/load arrows and labels"],
    prohibitedChanges: ["do NOT introduce block-and-tackle complexity beyond one fixed and one simple movable pulley"],
    exactDeliverable:
      "Two premium illustrations (fixed; movable) of a pulley wheel, fixed anchor point where applicable, and a physically plausible rope path with effort/load ends, matching the reference geometry exactly.",
    outputSubfolder: "hybrid",
    filenameBase: "pulleys-fixed-movable-base",
  },
  {
    sequence: 8,
    assetId: "unit202.magnet.field",
    displayName: "Bar magnet and magnetic field",
    loOrLesson: "LO5 — lesson.magnetism.fundamentals",
    priority: "P0",
    priorityLabel: "P0",
    productionClass: "HYBRID",
    productionClassLabel: "HYBRID",
    currentFamily: "magnetic.flux_field_lines",
    instructionalPurpose: "Show a bar magnet with its external magnetic field pattern, N to S, as the basis for flux/flux-density teaching.",
    primaryReference: {
      sourceName: "Wikimedia Commons — DipolMagnet.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:DipolMagnet.svg",
      licence: "Public-domain dedication",
      qualityGrade: "A+",
    },
    referenceReadiness: "READY",
    immutableFacts: ["meaningful field-line geometry", "external field direction runs N to S", "field-line density used meaningfully where density is taught"],
    creativeFreedoms: ["premium magnet-body rendering (material, finish)", "composition"],
    deterministicOverlayResponsibilities: ["N/S labels", "field-line overlay"],
    prohibitedChanges: ["do not draw field lines that reverse direction or cross incorrectly"],
    exactDeliverable: "One premium illustration of a bar magnet body ready to receive a deterministic N/S-labelled field-line overlay, matching the reference geometry exactly.",
    outputSubfolder: "hybrid",
    filenameBase: "magnet-field-base",
  },
  {
    sequence: 9,
    assetId: "unit202.circuit.series",
    displayName: "Series circuit",
    loOrLesson: "LO4 — lesson.electrical.resistors-series",
    priority: "P1",
    priorityLabel: "P1",
    productionClass: "DETERMINISTIC_TECHNICAL",
    productionClassLabel: "DETERMINISTIC TECHNICAL",
    currentFamily: "circuit.series_resistors",
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
    immutableFacts: ["complete source", "one continuous loop", "UK/IEC component convention", "current direction consistent with polarity when shown"],
    creativeFreedoms: [],
    deterministicOverlayResponsibilities: ["every schematic element remains deterministic vector -- no generated raster geometry for this family"],
    prohibitedChanges: ["do not replace the governed deterministic SVG renderer's output with generated raster geometry"],
    exactDeliverable:
      "A style/contrast reference only (not a replacement asset): include an unmistakable cell/battery/source wherever current direction is being taught, matching the reference geometry exactly.",
    outputSubfolder: "deterministic-polish",
    filenameBase: "circuit-series-base",
  },
  {
    sequence: 10,
    assetId: "unit202.circuit.parallel",
    displayName: "Parallel circuit",
    loOrLesson: "LO4 — lesson.electrical.resistors-parallel",
    priority: "P1",
    priorityLabel: "P1",
    productionClass: "DETERMINISTIC_TECHNICAL",
    productionClassLabel: "DETERMINISTIC TECHNICAL",
    currentFamily: "circuit.parallel_resistors",
    instructionalPurpose: "A visually polished parallel-circuit reference for style/contrast QA against the existing deterministic renderer -- topology and correctness are already governed.",
    primaryReference: {
      sourceName: "Same circuit reference family as series (see unit202.circuit.series)",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Series_and_parallel_circuits2.svg",
      licence: "recorded per source page",
      qualityGrade: "A",
    },
    referenceReadiness: "READY",
    immutableFacts: ["source present", "common pair of nodes/rails", "separate branches", "current direction consistent with source polarity"],
    creativeFreedoms: [],
    deterministicOverlayResponsibilities: ["every schematic element remains deterministic vector -- no generated raster geometry for this family"],
    prohibitedChanges: ["do not replace the governed deterministic SVG renderer's output with generated raster geometry"],
    exactDeliverable: "A style/contrast reference only (not a replacement asset), matching the reference geometry exactly.",
    outputSubfolder: "deterministic-polish",
    filenameBase: "circuit-parallel-base",
  },
  {
    sequence: 11,
    assetId: "unit202.circuit.mixed",
    displayName: "Mixed series/parallel circuit",
    loOrLesson: "LO4 — lesson.electrical.series-vs-parallel-comparison",
    priority: "P1",
    priorityLabel: "P1",
    productionClass: "DETERMINISTIC_TECHNICAL",
    productionClassLabel: "DETERMINISTIC TECHNICAL",
    currentFamily: "circuit.series_parallel_mixed",
    instructionalPurpose: "A visually polished mixed-topology reference for style/contrast QA against the existing deterministic renderer -- topology and correctness are already governed.",
    primaryReference: {
      sourceName: "Wikimedia Commons — SeriesParallelCircuit.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:SeriesParallelCircuit.svg",
      licence: "use only as topology/reference, not a close stylistic derivative",
      qualityGrade: "B",
    },
    referenceReadiness: "READY",
    immutableFacts: ["genuinely mixed topology", "obvious junctions", "traceable current paths", "source included where pedagogically necessary"],
    creativeFreedoms: [],
    deterministicOverlayResponsibilities: ["every schematic element remains deterministic vector -- no generated raster geometry for this family"],
    prohibitedChanges: ["use only as topology/reference, not a close stylistic derivative", "do not replace the governed deterministic SVG renderer's output with generated raster geometry"],
    exactDeliverable: "A style/contrast reference only (not a replacement asset), matching the reference topology exactly.",
    outputSubfolder: "deterministic-polish",
    filenameBase: "circuit-mixed-base",
  },
  {
    sequence: 12,
    assetId: "unit202.instrument.connections",
    displayName: "Ammeter / voltmeter / ohmmeter connections",
    loOrLesson: "LO2 — lesson.electrical.instrumentation",
    priority: "P1",
    priorityLabel: "P1",
    productionClass: "DETERMINISTIC_TECHNICAL",
    productionClassLabel: "DETERMINISTIC TECHNICAL / SELECTIVE HYBRID",
    currentFamily: "instrument.measurement_connection",
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
    exactDeliverable: "A style/contrast reference only (not a replacement asset), matching the reference connection geometry exactly.",
    outputSubfolder: "deterministic-polish",
    filenameBase: "instrument-connections-base",
  },
  {
    sequence: 13,
    assetId: "unit202.gears",
    displayName: "Driver/driven gears",
    loOrLesson: "LO3 — lesson.foundation.physics.simple-machines",
    priority: "P1",
    priorityLabel: "P1",
    productionClass: "HYBRID",
    productionClassLabel: "POLISHED DETERMINISTIC / HYBRID",
    currentFamily: "mechanical.gear_mesh",
    instructionalPurpose: "Show a driver gear meshed with a driven gear whose relative size represents the gear ratio and the resulting torque/speed trade-off.",
    primaryReference: {
      sourceName: "Wikimedia Commons — Example of a Compound Gear Train.png",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Example_of_a_Compound_Gear_Train.png",
      licence: "CC0",
      qualityGrade: "A",
    },
    referenceReadiness: "READY",
    immutableFacts: ["meaningful driver/driven relationship", "physically plausible mesh", "relative size represents the ratio", "correct rotation relationship when shown"],
    creativeFreedoms: ["premium gear/material rendering", "composition", "finish"],
    deterministicOverlayResponsibilities: ["driver/driven labels", "rotation-direction overlay where taught"],
    prohibitedChanges: ["do not depict a mesh that is not physically plausible"],
    exactDeliverable: "One premium illustration of two meshed gears with a clear relative-size relationship, matching the reference geometry exactly.",
    outputSubfolder: "hybrid",
    filenameBase: "gears-base",
  },
  {
    sequence: 14,
    assetId: "unit202.resistivity.dimensions",
    displayName: "Resistance vs conductor length / area",
    loOrLesson: "LO4 — lesson.electrical.resistivity",
    priority: "P1",
    priorityLabel: "P1",
    productionClass: "HYBRID",
    productionClassLabel: "HYBRID / POLISHED DETERMINISTIC",
    currentFamily: "mechanical.resistivity_dimensions",
    instructionalPurpose: "Show two conductor rods differing only in length or cross-sectional area so a learner predicts the qualitative effect on resistance.",
    primaryReference: {
      sourceName: "OpenStax wire/conductor cylinder diagrams",
      sourceUrl: "",
      licence: "OpenStax -- CC BY, record exact chapter/figure when selected",
      qualityGrade: "A",
    },
    referenceReadiness: "READY",
    immutableFacts: [
      "increased length -> greater resistance (other governed variables unchanged)",
      "increased cross-sectional area -> lower resistance (other governed variables unchanged)",
    ],
    creativeFreedoms: ["premium conductor-material rendering", "composition", "finish"],
    deterministicOverlayResponsibilities: ["length/area comparison labels", "qualitative-consequence captions"],
    prohibitedChanges: ["do not embed a numeric R = rho L / A calculation"],
    exactDeliverable: "Two premium illustrations (length comparison; area comparison) of conductor rods, matching the reference relationship exactly.",
    outputSubfolder: "hybrid",
    filenameBase: "resistivity-dimensions-base",
  },
  {
    sequence: 15,
    assetId: "unit202.waveform.sine",
    displayName: "AC sine waveform",
    loOrLesson: "LO5 — lesson.waveforms.ac-dc-and-sine-wave-quantities",
    priority: "P1",
    priorityLabel: "P1",
    productionClass: "DETERMINISTIC_TECHNICAL",
    productionClassLabel: "DETERMINISTIC TECHNICAL",
    currentFamily: "graph.waveform_sine",
    instructionalPurpose: "A visually polished sine-waveform reference for style/contrast QA against the existing deterministic renderer -- waveform correctness is already governed.",
    primaryReference: {
      sourceName: "Wikimedia Commons — Sine wave 2.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Sine_wave_2.svg",
      licence: "Public-domain dedication",
      qualityGrade: "A+",
    },
    referenceReadiness: "READY",
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
    exactDeliverable: "A style/contrast reference only (not a replacement asset), matching the reference waveform exactly.",
    outputSubfolder: "deterministic-polish",
    filenameBase: "waveform-sine-base",
  },
  {
    sequence: 16,
    assetId: "unit202.emf.motional",
    displayName: "Motional EMF geometry",
    loOrLesson: "LO5 — lesson.magnetism.effects-of-current",
    priority: "P1",
    priorityLabel: "P1",
    productionClass: "HYBRID",
    productionClassLabel: "DETERMINISTIC / HYBRID",
    currentFamily: "emf.motional_emf_geometry",
    instructionalPurpose: "Show that conductor length, its velocity and the magnetic field are mutually perpendicular -- the geometric fact behind e = Blv.",
    primaryReference: {
      sourceName: "Existing governed ALP motional-EMF geometry (emf.motional_emf_geometry) -- add a human-readable physics reference before premium rebuild",
      sourceUrl: "",
      licence: "internal governed geometry -- external reference pending",
      qualityGrade: "internal A; external reference pending",
    },
    referenceReadiness: "READY",
    immutableFacts: ["B, l and v mutually perpendicular for the governed e = Blv case", "rod across rails", "velocity along the rails", "field perpendicular to the rail plane"],
    creativeFreedoms: ["premium rail/rod material rendering", "composition"],
    deterministicOverlayResponsibilities: ["B/l/v labelled overlay arrows"],
    prohibitedChanges: ["do not draw B, l or v as anything other than mutually perpendicular"],
    exactDeliverable: "One premium illustration of a conductor rod across two rails ready to receive B/l/v overlay arrows, matching the existing governed geometry exactly.",
    outputSubfolder: "hybrid",
    filenameBase: "emf-motional-base",
  },
  {
    sequence: 17,
    assetId: "unit202.magnet.poles",
    displayName: "Magnetic pole attraction / repulsion",
    loOrLesson: "LO5 — lesson.magnetism.fundamentals",
    priority: "P1",
    priorityLabel: "P1",
    productionClass: "HYBRID",
    productionClassLabel: "HYBRID",
    currentFamily: "magnetic.pole_interaction",
    instructionalPurpose: "Show like poles repelling and unlike poles attracting from the pole labels on two facing bar magnets.",
    primaryReference: {
      sourceName: "Public-domain historical iron-filings attraction/repulsion illustrations, plus the approved bar-magnet reference (unit202.magnet.field)",
      sourceUrl: "",
      licence: "public-domain historical -- record exact source when selected",
      qualityGrade: "B+",
    },
    referenceReadiness: "READY",
    immutableFacts: ["unlike poles attract", "like poles repel", "field behaviour between the two magnets must remain physically meaningful"],
    creativeFreedoms: ["premium magnet-body rendering", "composition"],
    deterministicOverlayResponsibilities: ["N/S pole labels", "force-arrow overlay (teaching mode only)"],
    prohibitedChanges: ["do not reveal the force-arrow/attract-repel answer in assessment mode"],
    exactDeliverable: "Two premium illustrations (like poles facing; unlike poles facing) of two bar magnets, matching the reference relationship exactly.",
    outputSubfolder: "hybrid",
    filenameBase: "magnet-poles-base",
  },
  {
    sequence: 18,
    assetId: "unit202.components.symbols",
    displayName: "Electronic component symbol system",
    loOrLesson: "LO6 — lesson.electrical.electronic-components-passive / -switching-control",
    priority: "P1",
    priorityLabel: "P1",
    productionClass: "DETERMINISTIC_TECHNICAL",
    productionClassLabel: "DETERMINISTIC TECHNICAL",
    currentFamily: "electronics.component_symbol_card",
    instructionalPurpose: "The governed UK/IEC schematic-symbol system for component recognition -- symbol geometry must never be AI-generated.",
    primaryReference: {
      sourceName: "IEC 60617 graphical-symbol system / current UK technical-drawing convention",
      sourceUrl: "",
      licence: "standards reference -- verify against the current governed BS EN 60617 / IEC 60617 convention",
      qualityGrade: "A (standards authority)",
    },
    referenceReadiness: "READY",
    immutableFacts: ["every symbol must match the governed BS EN 60617 / IEC 60617 convention exactly"],
    creativeFreedoms: [],
    deterministicOverlayResponsibilities: ["the symbol geometry itself remains 100% deterministic vector -- this asset is not a candidate for generated imagery"],
    prohibitedChanges: ["do NOT use AI-generated schematic symbols", "do NOT use US/ANSI substitutes where UK/IEC differs"],
    exactDeliverable: "No image-generation deliverable -- this catalogue entry exists for tracking/QA only; symbols remain produced by ComponentSymbols.tsx.",
    outputSubfolder: "deterministic-polish",
    filenameBase: "components-symbols-base",
  },
  {
    sequence: 19,
    assetId: "unit202.components.physical",
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
    immutableFacts: ["package form must be a real, representative physical form for the named component type"],
    creativeFreedoms: ["premium photographic-impression rendering", "composition", "lighting"],
    deterministicOverlayResponsibilities: ["component name label", "pairing with the existing deterministic UK/IEC symbol card"],
    prohibitedChanges: ["do not invent a misleading package form for any component"],
    exactDeliverable: "One premium physical-appearance illustration per selected component, matching real, representative package forms.",
    outputSubfolder: "physical-components",
    filenameBase: "components-physical-base",
  },
  {
    sequence: 20,
    assetId: "unit202.electrolysis",
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
    immutableFacts: ["source present", "electrolyte present", "electrodes present", "meaningful current path"],
    creativeFreedoms: ["premium vessel/electrode material rendering", "composition"],
    deterministicOverlayResponsibilities: ["labels for source/electrolyte/electrodes/current path"],
    prohibitedChanges: ["do not introduce chemistry detail beyond Unit 202 syllabus scope"],
    exactDeliverable: "One premium illustration of an electrolysis cell showing source, electrolyte and electrodes, matching the reference geometry exactly.",
    outputSubfolder: "hybrid",
    filenameBase: "electrolysis-base",
  },
  {
    sequence: 21,
    assetId: "unit202.heating-effect",
    displayName: "Heating effect of electric current",
    loOrLesson: "LO4 — lesson.electrical.thermal-and-chemical-effects",
    priority: "P2",
    priorityLabel: "P2",
    productionClass: "PREMIUM_CONCEPTUAL",
    productionClassLabel: "PREMIUM CONCEPTUAL / HYBRID",
    instructionalPurpose: "Show the heating effect of electric current (resistive heating) at a conceptual level.",
    primaryReference: NOT_READY_REF,
    referenceReadiness: "NOT_READY",
    immutableFacts: [],
    creativeFreedoms: [],
    deterministicOverlayResponsibilities: [],
    prohibitedChanges: ["do not generate until a primary reference is marked READY"],
    exactDeliverable: "BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY.",
    outputSubfolder: "conceptual",
    filenameBase: "heating-effect-base",
  },
  {
    sequence: 22,
    assetId: "unit202.conductor-insulator",
    displayName: "Conductor vs insulator",
    loOrLesson: "LO4 — lesson.electrical.conductors-and-insulators",
    priority: "P2",
    priorityLabel: "P2",
    productionClass: "PREMIUM_CONCEPTUAL",
    productionClassLabel: "PREMIUM CONCEPTUAL",
    instructionalPurpose: "Show a material-recognition comparison between conductors and insulators.",
    primaryReference: NOT_READY_REF,
    referenceReadiness: "NOT_READY",
    immutableFacts: [],
    creativeFreedoms: [],
    deterministicOverlayResponsibilities: [],
    prohibitedChanges: ["do not generate until a primary reference is marked READY"],
    exactDeliverable: "BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY.",
    outputSubfolder: "conceptual",
    filenameBase: "conductor-insulator-base",
  },
  {
    sequence: 23,
    assetId: "unit202.protective-devices",
    displayName: "Fuse / MCB / RCD conceptual visual",
    loOrLesson: "LO4 — lesson.electrical.fault-conditions-protection",
    priority: "P2",
    priorityLabel: "P2",
    productionClass: "PREMIUM_CONCEPTUAL",
    productionClassLabel: "PREMIUM CONCEPTUAL + deterministic functional explanation",
    instructionalPurpose: "Show protective-device recognition (fuse/MCB/RCD) at a conceptual level, without endorsing one manufacturer's product appearance as canonical.",
    primaryReference: NOT_READY_REF,
    referenceReadiness: "NOT_READY",
    immutableFacts: [],
    creativeFreedoms: [],
    deterministicOverlayResponsibilities: [],
    prohibitedChanges: ["do not generate until a primary reference is marked READY", "avoid making one manufacturer's product appearance canonical"],
    exactDeliverable: "BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY.",
    outputSubfolder: "conceptual",
    filenameBase: "protective-devices-base",
  },
  {
    sequence: 24,
    assetId: "unit202.trigonometry",
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
    immutableFacts: ["right angle present", "hypotenuse opposite the right angle", "opposite/adjacent sides correctly identified relative to the selected acute angle"],
    creativeFreedoms: [],
    deterministicOverlayResponsibilities: ["the triangle geometry itself remains deterministic vector"],
    prohibitedChanges: ["do not build a new lesson to host this asset -- current lesson integration remains deferred per the content freeze"],
    exactDeliverable: "No lesson exists to host this asset yet -- tracked for future commissioning only, not for current production.",
    outputSubfolder: "deterministic-polish",
    filenameBase: "trigonometry-base",
  },
];

export function findCatalogueEntry(assetId: string): CatalogueEntry | undefined {
  return CATALOGUE.find((entry) => entry.assetId === assetId);
}

/** Mechanically proves catalogue integrity -- no duplicate ids, sequences, or filename stems, and every enum field is a real declared value. */
export function validateCatalogue(entries: CatalogueEntry[] = CATALOGUE): string[] {
  const problems: string[] = [];
  const seenIds = new Set<string>();
  const seenSequences = new Set<number>();
  const seenFilenames = new Set<string>();

  for (const entry of entries) {
    if (seenIds.has(entry.assetId)) problems.push(`duplicate assetId: ${entry.assetId}`);
    seenIds.add(entry.assetId);

    if (seenSequences.has(entry.sequence)) problems.push(`duplicate sequence: ${entry.sequence}`);
    seenSequences.add(entry.sequence);

    if (seenFilenames.has(entry.filenameBase)) problems.push(`duplicate filenameBase: ${entry.filenameBase}`);
    seenFilenames.add(entry.filenameBase);

    if (!PRODUCTION_CLASSES.includes(entry.productionClass)) problems.push(`${entry.assetId}: invalid productionClass ${entry.productionClass}`);
    if (!PRIORITIES.includes(entry.priority)) problems.push(`${entry.assetId}: invalid priority ${entry.priority}`);
    if (!OUTPUT_SUBFOLDERS.includes(entry.outputSubfolder)) problems.push(`${entry.assetId}: invalid outputSubfolder ${entry.outputSubfolder}`);

    if (entry.referenceReadiness === "NOT_READY" && entry.primaryReference.sourceUrl) {
      problems.push(`${entry.assetId}: marked NOT_READY but primaryReference has a sourceUrl -- readiness state is inconsistent`);
    }
    if (entry.referenceReadiness === "READY" && !entry.primaryReference.sourceName) {
      problems.push(`${entry.assetId}: marked READY but has no primaryReference.sourceName`);
    }
    if (!/^[a-z0-9-]+$/.test(entry.filenameBase)) {
      problems.push(`${entry.assetId}: filenameBase '${entry.filenameBase}' is not a safe lowercase-kebab stem`);
    }
  }

  return problems;
}
