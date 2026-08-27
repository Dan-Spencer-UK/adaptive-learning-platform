/**
 * CC-05A: one-time governed pedagogical backfill of the CC-04/CC-04A/
 * CC-04B Unit 202 proving-slice corpus (scripts/content/data/
 * cc04-unit202-electrical-science.ts), per docs/architecture/
 * CC-05-PEDAGOGICAL-KNOWLEDGE-AND-QUESTION-ARCHITECTURE.md.
 *
 * This file does NOT modify a single assertion's wording, provenance,
 * rights, curriculum mapping, relationship or identifier. It adds a new
 * pedagogical layer *around* the existing corpus: assertion families,
 * capabilities, formula families, teaching/visual representations,
 * diagram blueprints and question blueprints, validated by
 * @alp/content-schema's `pedagogyManifestSchema`
 * (packages/content-schema/src/pedagogy.ts) and cross-checked against the
 * real corpus manifest by scripts/content/validate-pedagogy.ts.
 *
 * Every assertion identifier referenced below is copied verbatim from
 * cc04-unit202-electrical-science.ts -- never invented. Family groupings
 * follow the corpus's own existing topic clustering (ID prefixes, source
 * ordering, and the already-governed PREREQUISITE_OF/SUPPORTS graph),
 * not a new topic taxonomy layered on top.
 *
 * Scope: the 17 Electrical assertion families below are the assessable
 * "proving corpus" this task's exhaustive question-blueprint requirement
 * targets. One Electrical family (AC reactive-quantity concepts) and all
 * 5 Foundational Maths/Physics families are explicitly marked
 * `teaching_only` with a documented reason -- see the corpus's own header
 * comment (cc04-unit202-electrical-science.ts lines 43-49) for why AC
 * reactive quantities were deliberately not decomposed into calculation
 * capabilities, and the CC-04B corpus review for why 7 Foundational
 * Physics assertions do not currently reach an Electrical target. Neither
 * is a defect; both are pre-existing, documented, Product-Owner-approved
 * corpus design choices that this backfill respects rather than
 * silently overrides.
 */

import type {
  AnswerContract,
  AssertionFamily,
  AssertionFamilyMembership,
  Capability,
  DiagramBlueprint,
  EvidenceTarget,
  FamilyTeachingRepresentation,
  FormulaFamily,
  MarkingContract,
  PedagogyManifest,
  QuestionBlueprint,
  StandaloneAssertion,
  VisualAidBlueprint,
  WorkedExampleBlueprint,
} from "@alp/content-schema";

// =======================================================================
// Small local builders (reduce repetition; every field remains explicit
// at the call site that matters -- these do not hide any governed data).
// =======================================================================

type MembershipRole = AssertionFamilyMembership["role"];

function mem(familyId: string, assertionIdentifier: string, role: MembershipRole): AssertionFamilyMembership {
  return { familyId, assertionIdentifier, role };
}

function membersOf(
  familyId: string,
  entries: ReadonlyArray<readonly [string, MembershipRole]>,
): AssertionFamilyMembership[] {
  return entries.map(([assertionIdentifier, role]) => mem(familyId, assertionIdentifier, role));
}

function evidence(
  familyId: string,
  primaryCapabilityId: string,
  assertionIdentifiers: string[],
  opts: Partial<Omit<EvidenceTarget, "familyId" | "primaryCapabilityId" | "assertionIdentifiers">> = {},
): EvidenceTarget {
  return {
    familyId,
    primaryCapabilityId,
    assertionIdentifiers,
    supportingCapabilityIds: opts.supportingCapabilityIds ?? [],
    representationDependency: opts.representationDependency ?? [],
    misconceptionTargets: opts.misconceptionTargets ?? [],
  };
}

const quantityAnswer = (quantity: string, canonicalUnit: string): AnswerContract => ({
  type: "quantity",
  quantity,
  canonicalUnit,
});

const tolerance = (tolerancePercent = 2): MarkingContract => ({
  type: "numeric_tolerance",
  tolerancePercent,
});

const exact = (): MarkingContract => ({ type: "exact" });
const enumMarking = (): MarkingContract => ({ type: "enum" });

// =======================================================================
// 1. Assertion families
// =======================================================================

const assertionFamilies: AssertionFamily[] = [
  // --- Foundational Maths (teaching-only support technique) ------------
  {
    id: "foundational.algebraic_technique",
    title: "Algebraic technique: equality, inverse operations, transposition, substitution",
    learningIntent:
      "Rearrange and evaluate simple formulae correctly -- the general algebraic technique every electrical formula-family rearrangement relies on.",
    teachFamilyTogether: true,
    completeness: { requiredCapabilityIds: ["cap.foundational.algebraic_technique.apply"] },
    // CC-08: promoted from teaching_only to assessable. Every Electrical
    // formula-family solve/rearrange blueprint still exercises this
    // technique in context (unchanged), but a genuine standalone
    // foundational lesson (lesson.foundation.maths.formula-rearrangement)
    // now exists and needs real, abstract (non-electrical) assessment
    // items of its own -- see formula.algebraic_rearrangement_multiplicative
    // / _additive below -- so the family can now legitimately be assessed
    // directly, not only inferred from Electrical performance.
    assessmentRequirement: "assessable",
  },
  {
    id: "foundational.arithmetic_technique",
    title: "Arithmetic technique: reciprocals, fractions, percentages",
    learningIntent:
      "Apply reciprocal, fraction and percentage arithmetic correctly -- required for parallel-resistance and efficiency calculations.",
    teachFamilyTogether: true,
    completeness: { requiredCapabilityIds: ["cap.foundational.arithmetic_technique.apply"] },
    assessmentRequirement: "teaching_only",
    teachingOnlyReason:
      "Reusable horizontal Foundational Maths technique. Reciprocal-sum/invert technique is directly assessed in context by the parallel-resistance family's calculate_total blueprints; percentage technique is directly assessed in context by the efficiency family's calculate_efficiency blueprint.",
  },
  {
    id: "foundational.proportion_and_units",
    title: "Direct/inverse proportion and SI-prefix unit conversion",
    learningIntent:
      "Recognise direct and inverse proportion, and convert between SI-prefixed units -- required to interpret Ohm's-law proportionality and to work with electrical quantities across unit prefixes (mA, kΩ, etc).",
    teachFamilyTogether: true,
    completeness: { requiredCapabilityIds: ["cap.foundational.proportion_and_units.apply"] },
    assessmentRequirement: "teaching_only",
    teachingOnlyReason:
      "Reusable horizontal Foundational Maths technique. Proportion reasoning is directly assessed in context by EL-OHM-PROPORTIONALITY-001-derived blueprints; SI-prefix conversion is exercised by every Ohm's-law numeric blueprint's answer/parameter ranges.",
  },
  // --- Foundational Physics (teaching-only support concepts) -----------
  {
    id: "foundational.mechanics_work_energy_power",
    title: "Mechanics: force, work, energy, power (general physics)",
    learningIntent:
      "Understand force, work, energy and power as general mechanical concepts before their electrical specialisation.",
    teachFamilyTogether: true,
    completeness: { requiredCapabilityIds: ["cap.foundational.mechanics.recognise", "cap.foundational.mechanics.calculate"] },
    // CC-11 (Workstream A): reclassified from teaching_only to assessable.
    // Unit 202 AC3.3/AC3.4 genuinely require assessable coverage per the
    // task brief's teach -> practice -> calculate -> evidence -> mastery
    // requirement -- "reusable horizontal Foundational Physics knowledge"
    // does not make curriculum-required Unit 202 knowledge optional to
    // assess (the same principle CC-09G's completeness fix above already
    // established for this family's own required-capability set). Before
    // this reclassification, AC3.3/AC3.4 showed as covered only via a
    // FALSE-GREEN artefact (a shared capability touched by an unrelated
    // electrical.energy_and_efficiency lesson) -- see
    // lesson-mechanics-force-work-energy-power.ts, this family's first
    // real lesson.
    assessmentRequirement: "assessable",
  },
  {
    id: "foundational.mass_weight",
    title: "Mass and weight (general physics)",
    learningIntent: "Understand mass, weight and their relationship (W = mg).",
    teachFamilyTogether: true,
    completeness: { requiredCapabilityIds: ["cap.foundational.mass_weight.recognise"] },
    // CC-11 (Workstream A): reclassified from teaching_only to assessable.
    // Unit 202 AC3.1 genuinely requires assessable coverage per the task
    // brief's teach -> practice -> calculate -> evidence -> mastery
    // requirement -- "reusable horizontal Foundational Physics knowledge"
    // does not make curriculum-required Unit 202 knowledge optional to
    // assess. Before this reclassification AC3.1 had zero lesson/
    // question-blueprint coverage at all (not even a false-green
    // artefact) -- see lesson-mass-and-weight.ts, this family's first
    // real lesson, and mass_weight.recognise_relationship, its first
    // question blueprint.
    assessmentRequirement: "assessable",
  },

  // --- Electrical: units and core quantities ----------------------------
  {
    id: "electrical.si_units",
    title: "SI units for electrical quantities",
    learningIntent:
      "Identify the correct SI base or derived unit for each electrical quantity, and distinguish base units from derived units.",
    teachFamilyTogether: true,
    completeness: {
      requiredCapabilityIds: [
        "cap.si_units.identify_unit",
        "cap.si_units.distinguish_base_derived",
        "cap.si_units.diagnose_unit_confusion",
      ],
    },
    assessmentRequirement: "assessable",
  },
  {
    id: "electrical.core_quantities",
    title: "Voltage, current and resistance: core definitions",
    learningIntent:
      "State what voltage, current and resistance are, as the conceptual foundation Ohm's law formalises.",
    teachFamilyTogether: true,
    completeness: {
      requiredCapabilityIds: ["cap.core_quantities.recognise", "cap.core_quantities.distinguish"],
    },
    assessmentRequirement: "assessable",
  },
  {
    id: "electrical.ohms_law",
    title: "Ohm's Law",
    learningIntent:
      "Understand and apply the relationship between voltage, current and resistance (V = I x R), including every rearrangement, and recognise common rearrangement/unit errors.",
    teachFamilyTogether: true,
    completeness: {
      requiredCapabilityIds: [
        "cap.ohms_law.recognise_relationship",
        "cap.ohms_law.solve_for_voltage",
        "cap.ohms_law.solve_for_current",
        "cap.ohms_law.solve_for_resistance",
        "cap.ohms_law.select_rearrangement",
        "cap.ohms_law.apply_correct_unit",
        "cap.ohms_law.check_plausibility",
        "cap.ohms_law.diagnose_rearrangement_error",
        "cap.ohms_law.diagnose_wrong_operation",
        "cap.ohms_law.diagnose_unrelated_symbols",
        "cap.ohms_law.apply_substitution",
      ],
    },
    assessmentRequirement: "assessable",
  },
  {
    id: "electrical.resistivity",
    title: "Resistance, resistivity and the factors affecting conductor resistance",
    learningIntent:
      "Understand what resistivity is, how conductor length/area/material affect resistance, and compare materials by resistivity.",
    teachFamilyTogether: true,
    completeness: {
      requiredCapabilityIds: [
        "cap.resistivity.recognise",
        "cap.resistivity.compare_materials",
        "cap.resistivity.predict_length_effect",
        "cap.resistivity.predict_area_effect",
        "cap.resistivity.calculate",
      ],
    },
    assessmentRequirement: "assessable",
  },

  // --- Electrical: series/parallel circuits -----------------------------
  {
    id: "electrical.series_circuits",
    title: "Series D.C. circuits",
    learningIntent:
      "Understand and calculate current, resistance, voltage drop and power in series D.C. circuits, and predict the effect of circuit changes.",
    teachFamilyTogether: true,
    completeness: {
      requiredCapabilityIds: [
        "cap.series.recognise_structure",
        "cap.series.calculate_total_resistance",
        "cap.series.calculate_supply_current",
        "cap.series.calculate_voltage_drop",
        "cap.series.calculate_power",
        "cap.series.predict_add_component",
        "cap.series.predict_open_circuit",
        "cap.series.check_plausibility",
        "cap.series.identify_dominant_component",
        "cap.series.solve_missing_component",
      ],
    },
    assessmentRequirement: "assessable",
  },
  {
    id: "electrical.parallel_circuits",
    title: "Parallel D.C. circuits",
    learningIntent:
      "Understand and calculate current, resistance, branch voltage/current and power in parallel D.C. circuits, and predict the effect of circuit changes.",
    teachFamilyTogether: true,
    completeness: {
      requiredCapabilityIds: [
        "cap.parallel.recognise_structure",
        "cap.parallel.calculate_total_resistance",
        "cap.parallel.solve_missing_branch",
        "cap.parallel.calculate_branch_current",
        "cap.parallel.calculate_power",
        "cap.parallel.predict_add_branch",
        "cap.parallel.predict_open_branch",
        "cap.parallel.check_plausibility",
        "cap.parallel.diagnose_reciprocal_error",
        "cap.parallel.diagnose_missing_final_inversion",
        "cap.parallel.identify_dominant_branch",
      ],
    },
    assessmentRequirement: "assessable",
  },
  {
    id: "electrical.series_vs_parallel_comparison",
    title: "Series versus parallel: topology, tracing and comparison",
    learningIntent:
      "Identify whether a circuit is series, parallel or mixed; trace current paths; and compare resistance, current, voltage, power and energy behaviour between the two topologies.",
    teachFamilyTogether: true,
    completeness: {
      requiredCapabilityIds: [
        "cap.comparison.identify_topology",
        "cap.comparison.recognise_mixed_circuit",
        "cap.comparison.trace_current_path",
        "cap.comparison.compare_resistance",
        "cap.comparison.compare_current_voltage",
        "cap.comparison.compare_power_energy",
      ],
    },
    assessmentRequirement: "assessable",
  },

  // --- Electrical: power, energy, efficiency ----------------------------
  {
    id: "electrical.power_relationships",
    title: "Electrical power",
    learningIntent:
      "Understand and calculate electrical power from voltage/current, current/resistance, or voltage/resistance, and find total circuit power.",
    teachFamilyTogether: true,
    completeness: {
      requiredCapabilityIds: [
        "cap.power.recognise_relationship",
        "cap.power.select_form",
        "cap.power.calculate_from_vi",
        "cap.power.calculate_from_ir",
        "cap.power.calculate_from_vr",
        "cap.power.calculate_total",
      ],
    },
    assessmentRequirement: "assessable",
  },
  {
    id: "electrical.energy_and_efficiency",
    title: "Electrical energy and efficiency",
    learningIntent:
      "Calculate electrical energy transferred (including kWh billing units) from power and time, and calculate the efficiency of an electrical device.",
    teachFamilyTogether: true,
    completeness: {
      requiredCapabilityIds: [
        "cap.energy.calculate_energy",
        "cap.energy.calculate_energy_kwh",
        "cap.energy.rearrange",
        "cap.energy.calculate_efficiency",
      ],
    },
    assessmentRequirement: "assessable",
  },

  // --- Electrical: charge, thermal/chemical effects, conductors ---------
  {
    id: "electrical.charge_and_current",
    title: "Electric charge and its relationship to current",
    learningIntent: "Understand electric charge and calculate charge or current using I = Q / t.",
    teachFamilyTogether: true,
    completeness: { requiredCapabilityIds: ["cap.charge.recognise", "cap.charge.calculate"] },
    assessmentRequirement: "assessable",
  },
  {
    id: "electrical.thermal_and_chemical_effects",
    title: "Thermal and chemical effects of current",
    learningIntent:
      "Describe the thermal and chemical effects of electric current and recognise their practical applications and contributing factors.",
    teachFamilyTogether: true,
    completeness: {
      requiredCapabilityIds: ["cap.thermal_chemical.recognise_effect", "cap.thermal_chemical.recognise_application"],
    },
    assessmentRequirement: "assessable",
  },
  {
    id: "electrical.conductors_and_insulators",
    title: "Conductors and insulators",
    learningIntent:
      "Distinguish conductors from insulators via electron theory, identify common examples, and recognise insulation breakdown.",
    teachFamilyTogether: true,
    completeness: {
      requiredCapabilityIds: ["cap.conductors.classify_material", "cap.conductors.recognise_breakdown", "cap.conductors.recognise_electron_theory"],
    },
    assessmentRequirement: "assessable",
  },

  // --- Electrical: instrumentation, fault conditions/protection ---------
  {
    id: "electrical.instrumentation",
    title: "Electrical measuring instruments",
    learningIntent:
      "Select the correct instrument (voltmeter, ammeter, ohmmeter, multimeter, clamp meter, oscilloscope) for a given measurement task, and connect it correctly.",
    teachFamilyTogether: true,
    completeness: {
      requiredCapabilityIds: [
        "cap.instrumentation.select_instrument",
        "cap.instrumentation.recognise_connection",
        "cap.instrumentation.recognise_internal_resistance_property",
        "cap.instrumentation.recognise_purpose",
      ],
    },
    assessmentRequirement: "assessable",
  },
  {
    id: "electrical.fault_conditions_protection",
    title: "Fault conditions and protective devices",
    learningIntent:
      "Recognise short-circuit and open-circuit conditions, predict their effects, and understand how fuses and circuit breakers protect a circuit.",
    teachFamilyTogether: true,
    completeness: {
      requiredCapabilityIds: [
        "cap.fault.recognise_condition",
        "cap.fault.predict_effect",
        "cap.fault.select_protective_device",
        "cap.fault.compare_fuse_breaker",
      ],
    },
    assessmentRequirement: "assessable",
  },

  // --- Electrical: magnetism, EMF/generation, AC/DC waveforms -----------
  {
    id: "electrical.magnetism_and_electromagnetism",
    title: "Magnetism, electromagnetism and the motor principle",
    learningIntent:
      "Understand magnetic flux/flux density, the magnetic field around a current-carrying conductor, the force on a conductor in a field, and the motor principle.",
    teachFamilyTogether: true,
    // CC-09G (task section 4D): cap.magnetism.identify_unit (CC-09D/E,
    // AC5.2 required obligation flux-density-unit, DIRECT_SAMPLE_ANALOGUE
    // archetype evidence) was never added to completeness.
    // CC-11.1: added cap.magnetism.recognise_attraction_repulsion
    // (AC5.1) and cap.magnetism.calculate_force_on_conductor (AC5.3) --
    // both genuine required obligations with no prior capability.
    completeness: {
      requiredCapabilityIds: [
        "cap.magnetism.recognise_attraction_repulsion",
        "cap.magnetism.recognise_concept",
        "cap.magnetism.interpret_field_direction",
        "cap.magnetism.interpret_force_direction",
        "cap.magnetism.compare_permanent_electromagnet",
        "cap.magnetism.compare_motor_generator",
        "cap.magnetism.identify_unit",
        "cap.magnetism.calculate_force_on_conductor",
      ],
    },
    assessmentRequirement: "assessable",
  },
  {
    id: "electrical.emf_and_generation",
    title: "EMF, terminal voltage and A.C. generation",
    learningIntent:
      "Understand electromotive force, terminal voltage, and the basic principle of a rotating-loop A.C. generator.",
    teachFamilyTogether: true,
    // CC-09G (task section 4E): cap.emf.calculate_flux_change (CC-09D/E,
    // AC5.4 required obligation flux-change-emf-calculation, basis
    // OFFICIAL_ASSESSMENT_EVIDENCE, DIRECT_SAMPLE_ANALOGUE archetype
    // evidence) was never added to completeness.
    // CC-11.1: added cap.emf.calculate_motional_emf (AC5.3) -- a genuine
    // required obligation with no prior capability.
    completeness: {
      requiredCapabilityIds: [
        "cap.emf.recognise_emf_terminal_voltage",
        "cap.emf.describe_ac_generation",
        "cap.emf.calculate_flux_change",
        "cap.emf.calculate_motional_emf",
      ],
    },
    assessmentRequirement: "assessable",
  },
  {
    id: "electrical.ac_dc_waveforms",
    title: "A.C./D.C. distinction and sine-wave characteristics",
    learningIntent:
      "Distinguish A.C. from D.C., and identify/calculate sine-wave characteristics: periodic time, amplitude, peak-to-peak, RMS, average value and frequency.",
    teachFamilyTogether: true,
    completeness: {
      requiredCapabilityIds: [
        "cap.waveform.recognise_ac_dc",
        "cap.waveform.identify_characteristic",
        "cap.waveform.calculate_rms_peak",
        "cap.waveform.calculate_frequency_period",
        "cap.waveform.interpret_rated_value",
        "cap.waveform.compare_ac_dc_behaviour",
      ],
    },
    assessmentRequirement: "assessable",
  },
  {
    id: "electrical.ac_reactive_quantities",
    title: "AC reactive-quantity concepts (frequency-dependent opposition, inductance, capacitance)",
    learningIntent:
      "Describe reactance, impedance, inductance, capacitance and power factor as conceptual/definitional AC quantities.",
    teachFamilyTogether: true,
    // CC-09G (task section 4F): cap.ac_reactive.select_impedance_formula
    // and cap.ac_reactive.identify_reactance_unit (CC-09E -- the very
    // reclassification this comment block below describes) were never
    // added to completeness despite being governed, assessable, archetype-
    // evidenced capabilities.
    completeness: {
      requiredCapabilityIds: ["cap.ac_reactive.recognise", "cap.ac_reactive.select_impedance_formula", "cap.ac_reactive.identify_reactance_unit"],
    },
    // CC-09E (task section 3/4): narrowly reclassified from teaching_only.
    // The prior design decision (cc04-unit202-electrical-science.ts header
    // comment, lines 43-49) reasoned that "AC circuit calculation
    // (reactance/impedance arithmetic, phasor addition)" was out of scope
    // at Unit 202's LO2 depth ("identify and determine values of... SI
    // units", not LO4's deeper "calculate" framing) -- that reasoning is
    // UNCHANGED and still governs: no numeric AC reactive-quantity
    // calculation engine exists or is added by this package. CC-09D's
    // official 2365-602 sample-assessment calibration found real evidence
    // (sample item 6) that FORMULA RECOGNITION at LO2's own "identify"
    // depth -- selecting the correct impedance formula among distractors,
    // never computing a numeric AC value -- is genuinely assessable and
    // was previously undocumented. This flip and its one new capability
    // (cap.ac_reactive.select_impedance_formula, operationType
    // "select_relationship", categorical only) is scoped exactly to that
    // narrower, evidence-justified fact; it does not reopen or contradict
    // the original calculation-engine decision.
    assessmentRequirement: "assessable",
  },

  // --- CC-09B: new Foundational families for LO1 Range items with no
  // prior FM assertion (Indices; Triangles and trigonometry; Statistics),
  // and LO2's generic (non-electrical) SI quantities -- teaching_only,
  // matching the existing Foundational family pattern: no question-
  // blueprint/lesson authoring in this knowledge-corpus package. ---------
  {
    id: "foundational.indices",
    title: "Laws of indices",
    learningIntent: "Apply the laws of indices when multiplying, dividing or taking roots of powers of the same base.",
    teachFamilyTogether: true,
    completeness: { requiredCapabilityIds: ["cap.foundational.indices.apply"] },
    assessmentRequirement: "teaching_only",
    teachingOnlyReason: "Reusable horizontal Foundational Maths knowledge (Unit 202 LO1 Range: Indices). No question blueprint authored in this knowledge-corpus package (CC-09B); lesson/assessment authoring is a later package.",
  },
  {
    id: "foundational.trigonometry",
    title: "Pythagoras' theorem and basic trigonometric ratios",
    learningIntent: "Apply Pythagoras' theorem and the sine/cosine/tangent ratios to find unknown lengths and angles in right-angled triangles.",
    teachFamilyTogether: true,
    completeness: { requiredCapabilityIds: ["cap.foundational.trigonometry.apply"] },
    assessmentRequirement: "teaching_only",
    teachingOnlyReason: "Reusable horizontal Foundational Maths knowledge (Unit 202 LO1 Range: Triangles and trigonometry). No question blueprint authored in this knowledge-corpus package (CC-09B); lesson/assessment authoring is a later package.",
  },
  {
    id: "foundational.statistics",
    // CC-09G (task section 4A): title/learningIntent/capability description
    // previously named only mean and range, even though this family's own
    // membersOf list already includes median and mode (FM-STATS-MEDIAN-001/
    // FM-STATS-MODE-001, CC-09B.6) -- broadened to represent the full
    // governed Unit 202 scope honestly.
    title: "Central tendency and spread (mean, median, mode, range)",
    learningIntent: "Interpret a data set's mean, median and mode (central tendency) and range (spread).",
    teachFamilyTogether: true,
    completeness: { requiredCapabilityIds: ["cap.foundational.statistics.interpret"] },
    assessmentRequirement: "teaching_only",
    teachingOnlyReason: "Reusable horizontal Foundational Maths knowledge (Unit 202 LO1 Range: Statistics). No question blueprint authored in this knowledge-corpus package (CC-09B); lesson/assessment authoring is a later package.",
  },
  {
    id: "foundational.levers_mechanical_advantage",
    // CC-09B.1: broadened from "Levers and mechanical advantage" to cover
    // gears and pulleys too (audit section 13) -- AC3.2 names all three
    // as one "simple machines" topic, and they share the same mechanical-
    // advantage learning intent, so one family (not three) represents them.
    title: "Simple machines and mechanical advantage: levers, gears, pulleys",
    learningIntent: "Recognise how a lever, gear or pulley provides mechanical advantage: lever classes by the relative arrangement of pivot, effort and load; gear ratio by the ratio of driven/driving radii or tooth counts (mechanical advantage is output/input, matching torque out over torque in); pulley mechanical advantage by the number of supporting rope sections.",
    teachFamilyTogether: true,
    // CC-09G (task section 4B): AC3.2 covers levers, gears AND pulleys, but
    // family-mastery completeness required only the lever capability --
    // gear/pulley mastery could reach FULLY_SECURE-equivalent family state
    // without ever having been assessed. Added the two capabilities this
    // family's own broadening (CC-09B.1, comment above) already implied
    // but never mechanically completed.
    // CC-11 (Workstream A): added cap.foundational.levers.calculate --
    // AC3.2's own governed lever-calculation obligation
    // (FP-REL-LEVER-BALANCE-001, unit202-knowledge-obligations.ts
    // acNumber "3.2", basis OFFICIAL_TEACHING_INTERPRETATION) had no
    // capability of its own, the same gap CC-09G's comment above already
    // fixed for gears/pulleys recognition.
    completeness: {
      requiredCapabilityIds: [
        "cap.foundational.levers.recognise",
        "cap.foundational.gears.recognise",
        "cap.foundational.pulleys.recognise",
        "cap.foundational.levers.calculate",
      ],
    },
    // CC-11 (Workstream A): reclassified from teaching_only to assessable.
    // Unit 202 AC3.2 genuinely requires assessable coverage per the task
    // brief's teach -> practice -> calculate -> evidence -> mastery
    // requirement -- "reusable horizontal Foundational Physics knowledge"
    // does not make curriculum-required Unit 202 knowledge optional to
    // assess. Before this reclassification AC3.2 had zero lesson/
    // question-blueprint coverage at all -- see lesson-simple-machines.ts,
    // this family's first real lesson.
    assessmentRequirement: "assessable",
  },
  {
    id: "foundational.si_quantities_general",
    title: "SI units for general (non-electrical) physical quantities",
    learningIntent: "Identify the correct SI base or derived unit for a general physical quantity (length, area, volume, mass, density, time, temperature, velocity), distinct from electrical.si_units' electrical-quantity scope.",
    teachFamilyTogether: true,
    completeness: { requiredCapabilityIds: ["cap.foundational.si_quantities_general.identify_unit"] },
    assessmentRequirement: "teaching_only",
    teachingOnlyReason: "Reusable horizontal Foundational Physics knowledge (Unit 202 LO2 AC2.1 Range: length, area, volume, mass, density, time, temperature, velocity -- generic quantities, distinct from AC2.2's electrical-quantity Range already covered by electrical.si_units). No question blueprint authored in this knowledge-corpus package (CC-09B); lesson/assessment authoring is a later package.",
  },

  // --- CC-09B: LO6 electronic components -- previously entirely absent.
  // One family (not one per Range item / one per device): the Level 2
  // knowledge model is coherent as a single teachable/diagnosable
  // concept -- "recognise a component's basic operating principle and
  // typical application" -- rather than 17 near-identical micro-families
  // (task brief section 26: "do not arbitrarily make one family per AC").
  {
    id: "electrical.electronic_components",
    title: "Electronic components: basic operating principles and applications",
    learningIntent:
      "Recognise the basic operating principle of common electronic components (rectifiers, diodes, Zener diodes, LEDs, photodiodes, thermistors, DIACs, TRIACs, transistors, thyristors, inverters, alongside capacitors/resistors already covered by electrical.ac_reactive_quantities/electrical.core_quantities) and identify which component is typically used for a given electrical-system application.",
    teachFamilyTogether: true,
    completeness: {
      requiredCapabilityIds: [
        "cap.electronic_components.recognise_principle",
        "cap.electronic_components.identify_application",
      ],
    },
    // CC-11 (Workstream C): the "later package" this comment referred to.
    // Real governed knowledge has existed since CC-09B; this package adds
    // the first pedagogy-layer authoring against it -- 6 question
    // blueprints (electronics.recognise_capacitor_behaviour,
    // electronics.recognise_thermistor_type, electronics.recognise_rectifier_type,
    // electronics.recognise_diode_family, electronics.recognise_switching_family,
    // electronics.identify_application) and 2 lessons
    // (lesson.electrical.electronic-components-passive,
    // lesson.electrical.electronic-components-switching-control). No
    // longer teaching-only.
    assessmentRequirement: "assessable",
  },
];

// =======================================================================
// 2. Standalone assertions (explicitly not grouped into a family)
// =======================================================================

const standaloneAssertions: StandaloneAssertion[] = [
  {
    // CC-09I (task section 1/3): FP-CALC-WEIGHT-001 is genuinely not named
    // by any Unit 202 knowledge obligation (unlike FP-CALC-POWER-001/
    // FP-CALC-EFFICIENCY-001/FP-REL-WEIGHT-MASS-001, which were the real
    // defect -- see foundational.mechanics_work_energy_power/foundational.
    // mass_weight's own membersOf entries above). Retained reusable
    // horizontal knowledge, deliberately never promoted to family-required
    // status merely to remove this entry -- doing so without genuine
    // obligation/scope evidence would itself be a scope-expansion defect.
    assertionIdentifier: "FP-CALC-WEIGHT-001",
    reason:
      "Foundational Physics mechanics calculation (W = mg, inverse direction) not named by any Unit 202 knowledge obligation -- genuinely optional reusable horizontal knowledge, not a defect.",
  },
];

// =======================================================================
// 3. Assertion-family memberships
// =======================================================================

const assertionFamilyMemberships: AssertionFamilyMembership[] = [
  // --- Foundational Maths -------------------------------------------------
  ...membersOf("foundational.algebraic_technique", [
    ["FM-ALG-INVERSE-OPS-MULT-001", "prerequisite_concept"],
    ["FM-ALG-INVERSE-OPS-ADD-001", "prerequisite_concept"],
    ["FM-ALG-EQUALITY-MULT-001", "prerequisite_concept"],
    ["FM-ALG-EQUALITY-ADD-001", "prerequisite_concept"],
    ["FM-ALG-TRANSPOSE-MULT-001", "canonical_form"],
    ["FM-ALG-TRANSPOSE-ADD-001", "canonical_form"],
    ["FM-ALG-SUBSTITUTION-001", "canonical_form"],
  ]),
  ...membersOf("foundational.arithmetic_technique", [
    ["FM-ARITH-RECIPROCAL-001", "prerequisite_concept"],
    ["FM-ARITH-FRACTION-OPS-001", "prerequisite_concept"],
    ["FM-ARITH-RECIPROCAL-SUM-001", "canonical_form"],
    ["FM-ARITH-RECIPROCAL-INVERT-001", "canonical_form"],
    ["FM-ARITH-PERCENTAGE-001", "canonical_form"],
  ]),
  ...membersOf("foundational.proportion_and_units", [
    ["FM-ALG-PROPORTION-DIRECT-001", "canonical_form"],
    ["FM-ALG-PROPORTION-INVERSE-001", "canonical_form"],
    ["FM-NUM-SI-PREFIX-001", "prerequisite_concept"],
    ["FM-NUM-STANDARD-FORM-001", "prerequisite_concept"],
    ["FM-NUM-SI-PREFIX-CONVERT-001", "canonical_form"],
  ]),

  // --- Foundational Physics -------------------------------------------------
  ...membersOf("foundational.mechanics_work_energy_power", [
    ["FP-CONCEPT-FORCE-001", "prerequisite_concept"],
    ["FP-CONCEPT-WORK-001", "prerequisite_concept"],
    ["FP-CONCEPT-ENERGY-001", "prerequisite_concept"],
    ["FP-CONCEPT-ENERGY-CONSERVATION-001", "prerequisite_concept"],
    ["FP-CONCEPT-POWER-001", "canonical_form"],
    ["FP-REL-POWER-WORK-TIME-001", "canonical_form"],
    ["FP-CONCEPT-EFFICIENCY-001", "canonical_form"],
    // CC-09B.1: work formula + dedicated kinetic/gravitational-potential-
    // energy concept/relationship/calculation additions (audit section 13).
    ["FP-REL-WORK-FORCE-DISTANCE-001", "canonical_form"],
    ["FP-CALC-WORK-001", "consequence"],
    ["FP-CONCEPT-KINETIC-ENERGY-001", "prerequisite_concept"],
    ["FP-REL-KINETIC-ENERGY-001", "canonical_form"],
    ["FP-CALC-KINETIC-ENERGY-001", "consequence"],
    ["FP-CONCEPT-POTENTIAL-ENERGY-001", "prerequisite_concept"],
    ["FP-REL-POTENTIAL-ENERGY-001", "canonical_form"],
    ["FP-CALC-POTENTIAL-ENERGY-001", "consequence"],
    // CC-09I (task section 1/2): FP-CALC-POWER-001/FP-CALC-EFFICIENCY-001
    // satisfy AC3.4's explicit power-calculation/efficiency-calculation
    // obligations but were left standalone (never a family member) since
    // CC-09B.1 -- a MATERIAL mastery-governance defect, since the old
    // Electrical-proving-slice PREREQUISITE_OF boundary is not a
    // qualification-mastery boundary. Added alongside their sibling
    // calculate-assertions above.
    ["FP-CALC-POWER-001", "consequence"],
    ["FP-CALC-EFFICIENCY-001", "consequence"],
  ]),
  ...membersOf("foundational.mass_weight", [
    ["FP-CONCEPT-MASS-001", "prerequisite_concept"],
    ["FP-CONCEPT-WEIGHT-001", "canonical_form"],
    // CC-09I (task section 1/3): FP-REL-WEIGHT-MASS-001 satisfies AC3.1's
    // explicit weight-mass-relationship obligation but was left standalone
    // -- same MATERIAL defect as above.
    ["FP-REL-WEIGHT-MASS-001", "canonical_form"],
  ]),

  // --- electrical.si_units ---------------------------------------------------
  ...membersOf("electrical.si_units", [
    ["EL-UNIT-VOLT-001", "canonical_form"],
    ["EL-UNIT-AMPERE-001", "canonical_form"],
    ["EL-UNIT-OHM-001", "canonical_form"],
    ["EL-UNIT-WATT-001", "canonical_form"],
    ["EL-UNIT-JOULE-001", "canonical_form"],
    ["EL-UNIT-OHM-METRE-001", "canonical_form"],
    ["EL-UNIT-BASE-VS-DERIVED-001", "consequence"],
    ["EL-UNIT-HERTZ-001", "canonical_form"],
  ]),

  // --- electrical.core_quantities ---------------------------------------------
  ...membersOf("electrical.core_quantities", [
    ["EL-CONCEPT-VOLTAGE-001", "canonical_form"],
    ["EL-CONCEPT-CURRENT-001", "canonical_form"],
    ["EL-CONCEPT-RESISTANCE-001", "canonical_form"],
  ]),

  // --- electrical.ohms_law ---------------------------------------------------
  ...membersOf("electrical.ohms_law", [
    ["EL-OHM-RELATIONSHIP-001", "canonical_form"],
    ["EL-OHM-PROPORTIONALITY-001", "consequence"],
    ["EL-OHM-REARRANGE-001", "rearranged_form"],
    ["EL-OHM-SOLVE-V-001", "rearranged_form"],
    ["EL-OHM-SOLVE-I-001", "rearranged_form"],
    ["EL-OHM-SOLVE-R-001", "rearranged_form"],
    ["EL-OHM-SELECT-RELATIONSHIP-001", "consequence"],
  ]),

  // --- electrical.resistivity ---------------------------------------------------
  ...membersOf("electrical.resistivity", [
    ["EL-CONCEPT-RESISTIVITY-001", "canonical_form"],
    ["EL-RESISTIVITY-RELATIONSHIP-001", "canonical_form"],
    ["EL-CONDUCTOR-RESISTANCE-FACTORS-001", "prerequisite_concept"],
    ["EL-RESISTIVITY-COMPARE-MATERIALS-001", "consequence"],
    ["EL-RESISTIVITY-LENGTH-EFFECT-001", "consequence"],
    ["EL-RESISTIVITY-AREA-EFFECT-001", "consequence"],
  ]),

  // --- electrical.series_circuits ---------------------------------------------------
  ...membersOf("electrical.series_circuits", [
    ["EL-CIRCUIT-SERIES-STRUCTURE-001", "canonical_form"],
    ["EL-SERIES-CURRENT-001", "consequence"],
    ["EL-SERIES-RESISTANCE-001", "canonical_form"],
    ["EL-SERIES-RESISTANCE-CALC-001", "consequence"],
    ["EL-INTERPRET-SERIES-RESULT-001", "misconception_guard"],
    ["EL-VOLTAGE-DROP-001", "prerequisite_concept"],
    ["EL-SERIES-VOLTAGE-001", "canonical_form"],
    // CC-09B.6 (adversarial gap review): names the already-governed
    // arithmetic as Kirchhoff's voltage law (task section 10).
    ["EL-CONCEPT-KIRCHHOFFS-VOLTAGE-LAW-001", "consequence"],
    ["EL-SERIES-VOLTAGE-CALC-001", "consequence"],
    ["EL-SERIES-DOMINANT-RESISTOR-001", "consequence"],
    ["EL-SERIES-PREDICT-OPEN-001", "consequence"],
    ["EL-SERIES-PREDICT-ADD-RESISTOR-001", "consequence"],
    ["EL-SERIES-VOLTAGE-DIVIDER-001", "contextual_application"],
    ["EL-CIRCUIT-SUPPLY-CURRENT-SERIES-001", "consequence"],
    ["EL-SERIES-POWER-CALC-001", "consequence"],
    ["EL-SERIES-POWER-DISTRIBUTION-001", "consequence"],
  ]),

  // --- electrical.parallel_circuits ---------------------------------------------------
  ...membersOf("electrical.parallel_circuits", [
    ["EL-CIRCUIT-PARALLEL-STRUCTURE-001", "canonical_form"],
    ["EL-PARALLEL-VOLTAGE-001", "consequence"],
    ["EL-PARALLEL-CURRENT-001", "canonical_form"],
    // CC-09B.6: as EL-CONCEPT-KIRCHHOFFS-VOLTAGE-LAW-001 above.
    ["EL-CONCEPT-KIRCHHOFFS-CURRENT-LAW-001", "consequence"],
    ["EL-PARALLEL-RESISTANCE-001", "canonical_form"],
    ["EL-PARALLEL-RESISTANCE-CALC-001", "consequence"],
    ["EL-INTERPRET-PARALLEL-RESULT-001", "misconception_guard"],
    ["EL-PARALLEL-CURRENT-CALC-001", "consequence"],
    ["EL-PARALLEL-DOMINANT-RESISTOR-001", "consequence"],
    ["EL-PARALLEL-PREDICT-OPEN-001", "consequence"],
    ["EL-PARALLEL-PREDICT-ADD-RESISTOR-001", "consequence"],
    ["EL-PARALLEL-CURRENT-DIVIDER-001", "contextual_application"],
    ["EL-CIRCUIT-SUPPLY-CURRENT-PARALLEL-001", "consequence"],
    ["EL-PARALLEL-POWER-CALC-001", "consequence"],
    ["EL-PARALLEL-POWER-DISTRIBUTION-001", "consequence"],
  ]),

  // --- electrical.series_vs_parallel_comparison ---------------------------------------------------
  ...membersOf("electrical.series_vs_parallel_comparison", [
    ["EL-CIRCUIT-SELECT-CONFIGURATION-001", "canonical_form"],
    ["EL-CIRCUIT-EQUIVALENT-RESISTANCE-DEFINITION-001", "prerequisite_concept"],
    ["EL-CIRCUIT-MIXED-SERIES-PARALLEL-RECOGNITION-001", "consequence"],
    ["EL-CIRCUIT-TRACE-CURRENT-PATH-001", "consequence"],
    ["EL-CIRCUIT-COMPARE-RESISTANCE-001", "consequence"],
    ["EL-CIRCUIT-COMPARE-CURRENT-001", "consequence"],
    ["EL-CIRCUIT-COMPARE-VOLTAGE-001", "consequence"],
    ["EL-CIRCUIT-COMPARE-POWER-001", "consequence"],
    ["EL-CIRCUIT-COMPARE-ENERGY-001", "consequence"],
  ]),

  // --- electrical.power_relationships ---------------------------------------------------
  ...membersOf("electrical.power_relationships", [
    ["EL-CONCEPT-POWER-001", "prerequisite_concept"],
    ["EL-POWER-RATING-001", "contextual_application"],
    ["EL-POWER-RELATIONSHIP-001", "canonical_form"],
    ["EL-POWER-REARRANGE-001", "rearranged_form"],
    ["EL-POWER-SOLVE-001", "consequence"],
    ["EL-POWER-DERIVED-VIR-001", "rearranged_form"],
    ["EL-POWER-SOLVE-IR-001", "consequence"],
    ["EL-POWER-DERIVED-V2R-001", "rearranged_form"],
    ["EL-POWER-SOLVE-V2R-001", "consequence"],
    ["EL-CIRCUIT-POWER-TOTAL-001", "consequence"],
  ]),

  // --- electrical.energy_and_efficiency ---------------------------------------------------
  ...membersOf("electrical.energy_and_efficiency", [
    ["EL-CONCEPT-ENERGY-001", "prerequisite_concept"],
    ["EL-UNIT-KWH-001", "prerequisite_concept"],
    ["EL-CONCEPT-ELECTRICAL-EFFICIENCY-001", "canonical_form"],
    ["EL-CALC-ELECTRICAL-EFFICIENCY-001", "consequence"],
    ["EL-ENERGY-POWER-TIME-RELATIONSHIP-001", "canonical_form"],
    ["EL-ENERGY-REARRANGE-001", "rearranged_form"],
    ["EL-ENERGY-CALC-001", "consequence"],
    ["EL-ENERGY-KWH-CALC-001", "consequence"],
  ]),

  // --- electrical.charge_and_current ---------------------------------------------------
  ...membersOf("electrical.charge_and_current", [
    ["EL-CONCEPT-CHARGE-001", "canonical_form"],
    ["EL-UNIT-COULOMB-001", "prerequisite_concept"],
    ["EL-CURRENT-CHARGE-RELATIONSHIP-001", "canonical_form"],
    ["EL-CURRENT-CHARGE-CALC-001", "consequence"],
    // CC-09B.1: minimal atomic-structure grounding for AC4.1 electron
    // theory (audit section 14.A).
    ["EL-CONCEPT-ATOMIC-CHARGE-STRUCTURE-001", "prerequisite_concept"],
  ]),

  // --- electrical.thermal_and_chemical_effects ---------------------------------------------------
  ...membersOf("electrical.thermal_and_chemical_effects", [
    ["EL-CURRENT-THERMAL-EFFECT-001", "canonical_form"],
    ["EL-CURRENT-CHEMICAL-EFFECT-001", "canonical_form"],
    ["EL-THERMAL-EFFECT-APPLICATION-001", "contextual_application"],
    ["EL-THERMAL-EFFECT-FACTORS-001", "consequence"],
  ]),

  // --- electrical.conductors_and_insulators ---------------------------------------------------
  ...membersOf("electrical.conductors_and_insulators", [
    ["EL-CONCEPT-ELECTRON-THEORY-001", "prerequisite_concept"],
    ["EL-CONCEPT-CONDUCTOR-001", "canonical_form"],
    ["EL-CONCEPT-INSULATOR-001", "canonical_form"],
    ["EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001", "contextual_application"],
    ["EL-INSULATOR-BREAKDOWN-001", "consequence"],
  ]),

  // --- electrical.instrumentation ---------------------------------------------------
  ...membersOf("electrical.instrumentation", [
    ["EL-INSTRUMENT-VOLTMETER-001", "canonical_form"],
    ["EL-INSTRUMENT-AMMETER-001", "canonical_form"],
    ["EL-INSTRUMENT-OHMMETER-001", "canonical_form"],
    ["EL-INSTRUMENT-MULTIMETER-001", "consequence"],
    ["EL-INSTRUMENT-SELECT-001", "consequence"],
    ["EL-INSTRUMENT-VOLTMETER-INTERNAL-RESISTANCE-001", "consequence"],
    ["EL-INSTRUMENT-AMMETER-INTERNAL-RESISTANCE-001", "consequence"],
    ["EL-INSTRUMENT-CONTINUITY-TEST-001", "contextual_application"],
    ["EL-INSTRUMENT-CLAMP-METER-001", "canonical_form"],
    ["EL-INSTRUMENT-OSCILLOSCOPE-001", "canonical_form"],
    // CC-09B: LO2 AC2.3 Range ("Electrical quantities (measurement)")
    // requires power and energy measurement alongside the pre-existing
    // resistance/current/voltage instruments.
    ["EL-INSTRUMENT-WATTMETER-001", "canonical_form"],
    ["EL-INSTRUMENT-ENERGY-METER-001", "canonical_form"],
  ]),

  // --- electrical.fault_conditions_protection ---------------------------------------------------
  ...membersOf("electrical.fault_conditions_protection", [
    ["EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001", "canonical_form"],
    ["EL-CIRCUIT-RECOGNISE-OPEN-CIRCUIT-001", "canonical_form"],
    ["EL-CIRCUIT-PREDICT-SHORT-EFFECT-001", "consequence"],
    ["EL-PROTECTIVE-DEVICE-PURPOSE-001", "canonical_form"],
    ["EL-FUSE-OPERATION-001", "consequence"],
    ["EL-CIRCUIT-BREAKER-VS-FUSE-001", "consequence"],
    ["EL-CIRCUIT-ZERO-RESISTANCE-INTERPRETATION-001", "prerequisite_concept"],
    ["EL-CIRCUIT-OPEN-CIRCUIT-RESISTANCE-INTERPRETATION-001", "prerequisite_concept"],
  ]),

  // --- electrical.magnetism_and_electromagnetism ---------------------------------------------------
  ...membersOf("electrical.magnetism_and_electromagnetism", [
    ["EL-CONCEPT-MAGNETISM-001", "canonical_form"],
    ["EL-CONCEPT-MAGNETIC-FLUX-001", "prerequisite_concept"],
    // CC-09D: official 2365-602 sample-assessment-confirmed unit-naming
    // gap (task section 7).
    ["EL-UNIT-WEBER-001", "prerequisite_concept"],
    ["EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001", "prerequisite_concept"],
    ["EL-UNIT-TESLA-001", "prerequisite_concept"],
    ["EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001", "canonical_form"],
    // CC-09B.6: official-teaching-confirmed gap (task section 9).
    ["EL-CONCEPT-FIELD-DIRECTION-RULE-001", "consequence"],
    ["EL-CONCEPT-FORCE-ON-CONDUCTOR-001", "canonical_form"],
    // CC-09B.6 (adversarial gap review): F=BIl/Fleming's left-hand rule and
    // e=Blv/Fleming's right-hand rule, official-teaching-confirmed gaps.
    ["EL-REL-FORCE-ON-CONDUCTOR-001", "consequence"],
    ["EL-CONCEPT-FLEMING-LEFT-HAND-001", "consequence"],
    ["EL-REL-INDUCED-EMF-001", "consequence"],
    ["EL-CONCEPT-FLEMING-RIGHT-HAND-001", "consequence"],
    ["EL-CONCEPT-ELECTROMAGNETISM-001", "consequence"],
    ["EL-MAGNETISM-COMPARE-PERMANENT-ELECTROMAGNET-001", "consequence"],
    ["EL-CONCEPT-MOTOR-PRINCIPLE-001", "consequence"],
    ["EL-MOTOR-GENERATOR-COMPARE-001", "consequence"],
  ]),

  // --- electrical.emf_and_generation ---------------------------------------------------
  ...membersOf("electrical.emf_and_generation", [
    ["EL-CONCEPT-EMF-001", "canonical_form"],
    ["EL-CONCEPT-TERMINAL-VOLTAGE-001", "consequence"],
    // CC-09B.1: explicit causal principle the generator assertion below
    // depends on (audit section 15.C).
    ["EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001", "prerequisite_concept"],
    // CC-09D: official 2365-602 sample-assessment-confirmed calculation
    // gap (task section 7) -- the quantitative Faraday's-law form.
    ["EL-REL-FLUX-CHANGE-EMF-001", "consequence"],
    ["EL-CONCEPT-AC-GENERATOR-001", "canonical_form"],
    ["EL-CONCEPT-SINE-WAVE-001", "consequence"],
  ]),

  // --- electrical.ac_dc_waveforms ---------------------------------------------------
  ...membersOf("electrical.ac_dc_waveforms", [
    ["EL-CONCEPT-FREQUENCY-001", "prerequisite_concept"],
    ["EL-CONCEPT-AC-DC-DISTINCTION-001", "canonical_form"],
    ["EL-CIRCUIT-AC-SUPPLY-RECOGNITION-001", "contextual_application"],
    ["EL-WAVEFORM-PERIODIC-TIME-001", "canonical_form"],
    ["EL-WAVEFORM-AMPLITUDE-001", "canonical_form"],
    ["EL-WAVEFORM-PEAK-TO-PEAK-001", "canonical_form"],
    ["EL-WAVEFORM-RMS-001", "canonical_form"],
    ["EL-WAVEFORM-AVERAGE-VALUE-001", "canonical_form"],
    ["EL-WAVEFORM-AVERAGE-ZERO-INTERPRETATION-001", "misconception_guard"],
    ["EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001", "canonical_form"],
    ["EL-WAVEFORM-RMS-CALC-001", "consequence"],
    ["EL-CONCEPT-PEAK-VS-RMS-SUPPLY-INTERPRETATION-001", "misconception_guard"],
    ["EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001", "canonical_form"],
    ["EL-WAVEFORM-FREQUENCY-CALC-001", "consequence"],
    ["EL-CIRCUIT-COMPARE-AC-DC-BEHAVIOUR-001", "consequence"],
  ]),

  // --- electrical.ac_reactive_quantities (teaching-only) ---------------------------------------------------
  ...membersOf("electrical.ac_reactive_quantities", [
    ["EL-CONCEPT-REACTANCE-001", "canonical_form"],
    ["EL-CONCEPT-IMPEDANCE-001", "canonical_form"],
    // CC-09D: official 2365-602 sample-assessment-confirmed calculation
    // gap (task section 7) -- formula recall/application, not merely the
    // qualitative concept above.
    ["EL-REL-IMPEDANCE-001", "consequence"],
    ["EL-UNIT-HENRY-001", "prerequisite_concept"],
    ["EL-CONCEPT-INDUCTANCE-001", "canonical_form"],
    ["EL-CONCEPT-INDUCTIVE-REACTANCE-001", "consequence"],
    ["EL-UNIT-FARAD-001", "prerequisite_concept"],
    ["EL-CONCEPT-CAPACITANCE-001", "canonical_form"],
    ["EL-CONCEPT-CAPACITIVE-REACTANCE-001", "consequence"],
    ["EL-CONCEPT-POWER-FACTOR-001", "canonical_form"],
  ]),

  // --- CC-09B: new Foundational families -------------------------------
  ...membersOf("foundational.indices", [["FM-NUM-INDICES-LAWS-001", "canonical_form"]]),
  ...membersOf("foundational.trigonometry", [
    ["FM-GEOM-PYTHAGORAS-001", "canonical_form"],
    ["FM-GEOM-TRIG-RATIOS-001", "canonical_form"],
    // CC-09B.1: application knowledge (audit section 11.B).
    ["FM-CALC-PYTHAGORAS-001", "consequence"],
    ["FM-CALC-TRIG-RATIO-001", "consequence"],
  ]),
  ...membersOf("foundational.statistics", [
    ["FM-STATS-MEAN-001", "canonical_form"],
    ["FM-STATS-RANGE-001", "canonical_form"],
    // CC-09B.6: official-teaching-resolved breadth (task section 6).
    ["FM-STATS-MEDIAN-001", "canonical_form"],
    ["FM-STATS-MODE-001", "canonical_form"],
  ]),
  ...membersOf("foundational.levers_mechanical_advantage", [
    ["FP-CONCEPT-MECHANICAL-ADVANTAGE-001", "prerequisite_concept"],
    ["FP-CONCEPT-LEVER-PRINCIPLE-001", "canonical_form"],
    ["FP-LEVER-CLASS-I-001", "consequence"],
    ["FP-LEVER-CLASS-II-001", "consequence"],
    ["FP-LEVER-CLASS-III-001", "consequence"],
    // CC-09B.1: gears and pulleys were AC3.2's largest single named gap
    // (audit section 13) -- folded into this same family (not a new one)
    // since they share the same "mechanical advantage" learning intent.
    ["FP-CONCEPT-GEAR-001", "canonical_form"],
    ["FP-REL-GEAR-RATIO-001", "consequence"],
    ["FP-GEAR-SPEED-TORQUE-TRADEOFF-001", "consequence"],
    ["FP-CONCEPT-PULLEY-001", "canonical_form"],
    ["FP-PULLEY-FIXED-VS-MOVABLE-001", "consequence"],
    ["FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001", "consequence"],
    // CC-09B.6: official-teaching-confirmed gaps (task section 7) --
    // lever calculation, gear direction/idler, pulley force-distance
    // trade-off.
    ["FP-REL-LEVER-BALANCE-001", "consequence"],
    ["FP-GEAR-DIRECTION-REVERSAL-001", "consequence"],
    ["FP-GEAR-IDLER-001", "consequence"],
    ["FP-REL-PULLEY-FORCE-DISTANCE-TRADEOFF-001", "consequence"],
  ]),
  ...membersOf("foundational.si_quantities_general", [
    ["FP-UNIT-METRE-001", "canonical_form"],
    ["FP-UNIT-SQUARE-METRE-001", "canonical_form"],
    ["FP-UNIT-CUBIC-METRE-001", "canonical_form"],
    ["FP-UNIT-KILOGRAM-001", "canonical_form"],
    ["FP-UNIT-DENSITY-001", "canonical_form"],
    ["FP-UNIT-SECOND-001", "canonical_form"],
    ["FP-UNIT-KELVIN-CELSIUS-001", "canonical_form"],
    ["FP-UNIT-METRE-PER-SECOND-001", "canonical_form"],
  ]),

  // --- CC-09B: electrical.electronic_components -------------------------
  ...membersOf("electrical.electronic_components", [
    // CC-09B.1: component-level (not merely quantity-level) resistor/
    // capacitor knowledge (audit section 16.A/B).
    ["EL-COMPONENT-RESISTOR-001", "canonical_form"],
    ["EL-COMPONENT-CAPACITOR-001", "canonical_form"],
    // CC-09B.2: split out of EL-COMPONENT-CAPACITOR-001 (charging/
    // discharging transient behaviour is a separately-sourced proposition
    // from static charge/energy storage -- task section 15).
    ["EL-COMPONENT-CAPACITOR-TRANSIENT-001", "consequence"],
    ["EL-COMPONENT-RECTIFIER-001", "canonical_form"],
    // CC-09B.6: official-teaching-confirmed depth (task section 19).
    ["EL-COMPONENT-RECTIFIER-HALF-WAVE-001", "consequence"],
    ["EL-COMPONENT-RECTIFIER-FULL-WAVE-001", "consequence"],
    ["EL-COMPONENT-DIODE-001", "canonical_form"],
    ["EL-COMPONENT-ZENER-DIODE-001", "consequence"],
    ["EL-COMPONENT-LED-001", "consequence"],
    ["EL-COMPONENT-PHOTODIODE-001", "consequence"],
    ["EL-COMPONENT-THERMISTOR-001", "canonical_form"],
    // CC-09B.6: PTC was genuinely missing (task section 18).
    ["EL-COMPONENT-THERMISTOR-PTC-001", "consequence"],
    ["EL-COMPONENT-DIAC-001", "canonical_form"],
    ["EL-COMPONENT-THYRISTOR-SCR-001", "canonical_form"],
    ["EL-COMPONENT-TRIAC-001", "consequence"],
    ["EL-COMPONENT-TRANSISTOR-001", "canonical_form"],
    ["EL-COMPONENT-INVERTER-001", "canonical_form"],
    ["EL-APPLICATION-DIMMER-SWITCH-001", "contextual_application"],
    ["EL-APPLICATION-MOTOR-CONTROL-001", "contextual_application"],
    ["EL-APPLICATION-HEATING-BOILER-CONTROL-001", "contextual_application"],
    ["EL-APPLICATION-SECURITY-ALARM-001", "contextual_application"],
    // CC-09B.6: official-teaching-matched replacement examples (task
    // sections 14/15) -- the originals above are retained (SUPPORTS-mapped)
    // as valid alternative teaching-adjacent examples, not removed.
    ["EL-APPLICATION-SECURITY-ALARM-TRANSISTOR-THYRISTOR-001", "contextual_application"],
    ["EL-APPLICATION-TELEPHONE-001", "contextual_application"],
    ["EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001", "contextual_application"],
    ["EL-APPLICATION-WIRELESS-CONTROL-001", "contextual_application"],
  ]),
];

// =======================================================================
// 4. Capabilities
// =======================================================================

function cap(
  id: string,
  familyId: string,
  operationType: Capability["operationType"],
  description: string,
): Capability {
  return { id, familyId, operationType, description };
}

const capabilities: Capability[] = [
  // --- Foundational (teaching-only) -----------------------------------
  cap(
    "cap.foundational.algebraic_technique.apply",
    "foundational.algebraic_technique",
    "rearrange",
    "Rearrange and substitute into a simple formula correctly.",
  ),
  cap(
    "cap.foundational.arithmetic_technique.apply",
    "foundational.arithmetic_technique",
    "calculate",
    "Apply reciprocal, fraction and percentage arithmetic correctly.",
  ),
  cap(
    "cap.foundational.proportion_and_units.apply",
    "foundational.proportion_and_units",
    "apply_unit",
    "Recognise direct/inverse proportion and convert between SI-prefixed units.",
  ),
  cap(
    "cap.foundational.mechanics.recognise",
    "foundational.mechanics_work_energy_power",
    "recognise",
    "Recognise force, work, energy and power as general mechanical concepts.",
  ),
  // CC-09B.1: new calculate-type capability -- FP-CALC-WORK-001/
  // FP-CALC-KINETIC-ENERGY-001/FP-CALC-POTENTIAL-ENERGY-001 are genuine
  // calculation propositions the family's existing recognise-only
  // capability cannot represent.
  // CC-09I (task section 2): description previously omitted power and
  // efficiency despite both being explicit AC3.4 obligations this
  // capability already represents (FP-CALC-POWER-001/FP-CALC-EFFICIENCY-
  // 001, now family members -- see foundational.mechanics_work_energy_
  // power's own membersOf entries).
  cap(
    "cap.foundational.mechanics.calculate",
    "foundational.mechanics_work_energy_power",
    "calculate",
    "Calculate work done, kinetic energy, gravitational potential energy, power or efficiency from known force/distance, mass/speed, mass/height, work-or-energy/time, or useful/total input-output values.",
  ),
  // CC-09I (task section 3): description strengthened to name the
  // relationship explicitly (W = mg, weight-mass-relationship obligation,
  // AC3.1) rather than the vague "and their relationship".
  cap(
    "cap.foundational.mass_weight.recognise",
    "foundational.mass_weight",
    "recognise",
    "Recognise mass and weight, and their relationship (weight = mass x gravitational field strength, W = mg).",
  ),

  // --- electrical.si_units ----------------------------------------------
  cap("cap.si_units.identify_unit", "electrical.si_units", "identify", "Identify the correct SI unit for a given electrical quantity."),
  cap(
    "cap.si_units.distinguish_base_derived",
    "electrical.si_units",
    "compare",
    "Distinguish an SI base unit from an SI derived unit.",
  ),
  cap(
    "cap.si_units.diagnose_unit_confusion",
    "electrical.si_units",
    "diagnose_error",
    "Diagnose confusion between two similarly-presented electrical units.",
  ),

  // --- electrical.core_quantities -----------------------------------------
  cap(
    "cap.core_quantities.recognise",
    "electrical.core_quantities",
    "recognise",
    "Recognise voltage, current or resistance from its definition.",
  ),
  cap(
    "cap.core_quantities.distinguish",
    "electrical.core_quantities",
    "compare",
    "Distinguish current from voltage where the two are commonly confused.",
  ),

  // --- electrical.ohms_law -----------------------------------------------
  cap("cap.ohms_law.recognise_relationship", "electrical.ohms_law", "recognise", "Recognise that V, I and R are related by V = I x R."),
  cap("cap.ohms_law.solve_for_voltage", "electrical.ohms_law", "calculate", "Calculate voltage from known current and resistance."),
  cap("cap.ohms_law.solve_for_current", "electrical.ohms_law", "calculate", "Calculate current from known voltage and resistance."),
  cap("cap.ohms_law.solve_for_resistance", "electrical.ohms_law", "calculate", "Calculate resistance from known voltage and current."),
  cap(
    "cap.ohms_law.select_rearrangement",
    "electrical.ohms_law",
    "select_relationship",
    "Select the correct rearrangement of V = I x R for the quantity being solved.",
  ),
  cap("cap.ohms_law.apply_correct_unit", "electrical.ohms_law", "apply_unit", "Match each Ohm's-law variable to its correct SI unit."),
  cap(
    "cap.ohms_law.apply_substitution",
    "electrical.ohms_law",
    "calculate",
    "Substitute known values into a chosen Ohm's-law rearrangement and show intermediate working.",
  ),
  cap(
    "cap.ohms_law.check_plausibility",
    "electrical.ohms_law",
    "check_plausibility",
    "Judge whether a calculated Ohm's-law result is physically plausible.",
  ),
  cap(
    "cap.ohms_law.diagnose_rearrangement_error",
    "electrical.ohms_law",
    "diagnose_error",
    "Diagnose an incorrect algebraic rearrangement of V = I x R.",
  ),
  cap(
    "cap.ohms_law.diagnose_wrong_operation",
    "electrical.ohms_law",
    "diagnose_error",
    "Diagnose use of the wrong arithmetic operation (multiply instead of divide, or vice versa) when applying V = I x R.",
  ),
  cap(
    "cap.ohms_law.diagnose_unrelated_symbols",
    "electrical.ohms_law",
    "diagnose_error",
    "Diagnose substitution of an unrelated quantity's value for V, I or R.",
  ),

  // --- electrical.resistivity ----------------------------------------------
  cap("cap.resistivity.recognise", "electrical.resistivity", "recognise", "Recognise resistivity as a material property independent of a conductor's dimensions."),
  cap("cap.resistivity.calculate", "electrical.resistivity", "calculate", "Calculate resistance from resistivity, length and cross-sectional area."),
  cap(
    "cap.resistivity.compare_materials",
    "electrical.resistivity",
    "compare",
    "Compare the resistivity of different materials to determine the better conductor.",
  ),
  cap(
    "cap.resistivity.predict_length_effect",
    "electrical.resistivity",
    "predict",
    "Predict the effect of increasing conductor length on resistance.",
  ),
  cap(
    "cap.resistivity.predict_area_effect",
    "electrical.resistivity",
    "predict",
    "Predict the effect of increasing conductor cross-sectional area on resistance.",
  ),

  // --- electrical.series_circuits -----------------------------------------
  cap("cap.series.recognise_structure", "electrical.series_circuits", "recognise", "Recognise a series circuit from a description or diagram."),
  cap(
    "cap.series.calculate_total_resistance",
    "electrical.series_circuits",
    "calculate",
    "Calculate total resistance of resistors connected in series.",
  ),
  cap(
    "cap.series.solve_missing_component",
    "electrical.series_circuits",
    "calculate",
    "Calculate an unknown individual component resistance from the series total and the other known components.",
  ),
  cap(
    "cap.series.calculate_supply_current",
    "electrical.series_circuits",
    "calculate",
    "Calculate the supply current in a series circuit from supply voltage and total resistance.",
  ),
  cap(
    "cap.series.calculate_voltage_drop",
    "electrical.series_circuits",
    "calculate",
    "Calculate an individual voltage drop across a component in a series circuit.",
  ),
  cap("cap.series.calculate_power", "electrical.series_circuits", "calculate", "Calculate the power dissipated by an individual component in a series circuit."),
  cap(
    "cap.series.predict_add_component",
    "electrical.series_circuits",
    "predict",
    "Predict the effect on supply current of adding a component in series.",
  ),
  cap(
    "cap.series.predict_open_circuit",
    "electrical.series_circuits",
    "predict",
    "Predict the effect on current if a series circuit is broken at any point.",
  ),
  cap(
    "cap.series.check_plausibility",
    "electrical.series_circuits",
    "check_plausibility",
    "Judge whether a calculated series total resistance is plausible.",
  ),
  cap(
    "cap.series.identify_dominant_component",
    "electrical.series_circuits",
    "compare",
    "Identify which component has the greatest voltage drop/power dissipation in a series circuit.",
  ),

  // --- electrical.parallel_circuits ---------------------------------------
  cap("cap.parallel.recognise_structure", "electrical.parallel_circuits", "recognise", "Recognise a parallel circuit from a description or diagram."),
  cap(
    "cap.parallel.calculate_total_resistance",
    "electrical.parallel_circuits",
    "calculate",
    "Calculate total resistance of resistors connected in parallel.",
  ),
  cap(
    "cap.parallel.solve_missing_branch",
    "electrical.parallel_circuits",
    "calculate",
    "Calculate an unknown individual branch resistance from the parallel total and the other known branches.",
  ),
  cap(
    "cap.parallel.calculate_branch_current",
    "electrical.parallel_circuits",
    "calculate",
    "Calculate an individual branch current in a parallel circuit.",
  ),
  cap("cap.parallel.calculate_power", "electrical.parallel_circuits", "calculate", "Calculate the power dissipated by an individual branch in a parallel circuit."),
  cap(
    "cap.parallel.predict_add_branch",
    "electrical.parallel_circuits",
    "predict",
    "Predict the effect on supply current of adding a branch in parallel.",
  ),
  cap(
    "cap.parallel.predict_open_branch",
    "electrical.parallel_circuits",
    "predict",
    "Predict the effect on the remaining branches if one parallel branch is broken.",
  ),
  cap(
    "cap.parallel.check_plausibility",
    "electrical.parallel_circuits",
    "check_plausibility",
    "Judge whether a calculated parallel total resistance is plausible.",
  ),
  cap(
    "cap.parallel.diagnose_reciprocal_error",
    "electrical.parallel_circuits",
    "diagnose_error",
    "Diagnose the error of adding branch resistances directly instead of using the reciprocal relationship.",
  ),
  cap(
    "cap.parallel.diagnose_missing_final_inversion",
    "electrical.parallel_circuits",
    "diagnose_error",
    "Diagnose the error of leaving the result as a reciprocal-of-total instead of inverting it back.",
  ),
  cap(
    "cap.parallel.identify_dominant_branch",
    "electrical.parallel_circuits",
    "compare",
    "Identify which branch carries the largest current/dissipates the most power in a parallel circuit.",
  ),

  // --- electrical.series_vs_parallel_comparison ---------------------------
  cap(
    "cap.comparison.identify_topology",
    "electrical.series_vs_parallel_comparison",
    "identify",
    "Identify whether a given circuit is connected in series or parallel.",
  ),
  cap(
    "cap.comparison.recognise_mixed_circuit",
    "electrical.series_vs_parallel_comparison",
    "recognise",
    "Recognise a circuit combining both series- and parallel-connected sections.",
  ),
  cap(
    "cap.comparison.trace_current_path",
    "electrical.series_vs_parallel_comparison",
    "interpret_diagram",
    "Trace the path(s) current takes through a series or parallel circuit diagram.",
  ),
  cap(
    "cap.comparison.compare_resistance",
    "electrical.series_vs_parallel_comparison",
    "compare",
    "Compare total resistance of the same resistor set connected in series versus parallel.",
  ),
  cap(
    "cap.comparison.compare_current_voltage",
    "electrical.series_vs_parallel_comparison",
    "compare",
    "Compare current and voltage behaviour between series and parallel circuits.",
  ),
  cap(
    "cap.comparison.compare_power_energy",
    "electrical.series_vs_parallel_comparison",
    "compare",
    "Compare total power/energy of the same resistor set connected in series versus parallel.",
  ),

  // --- electrical.power_relationships --------------------------------------
  cap(
    "cap.power.recognise_relationship",
    "electrical.power_relationships",
    "recognise",
    "Recognise that electrical power is related to voltage and current by P = V x I.",
  ),
  cap(
    "cap.power.select_form",
    "electrical.power_relationships",
    "select_relationship",
    "Select which form of the power relationship to use, based on which two quantities are known.",
  ),
  cap("cap.power.calculate_from_vi", "electrical.power_relationships", "calculate", "Calculate power from known voltage and current."),
  cap("cap.power.calculate_from_ir", "electrical.power_relationships", "calculate", "Calculate power from known current and resistance."),
  cap("cap.power.calculate_from_vr", "electrical.power_relationships", "calculate", "Calculate power from known voltage and resistance."),
  cap(
    "cap.power.calculate_total",
    "electrical.power_relationships",
    "calculate",
    "Calculate total circuit power as the sum of individual component powers.",
  ),

  // --- electrical.energy_and_efficiency ------------------------------------
  cap("cap.energy.calculate_energy", "electrical.energy_and_efficiency", "calculate", "Calculate electrical energy transferred from power and time."),
  cap(
    "cap.energy.calculate_energy_kwh",
    "electrical.energy_and_efficiency",
    "calculate",
    "Calculate electrical energy used in kilowatt-hours from power rating in kW and time in hours.",
  ),
  cap("cap.energy.rearrange", "electrical.energy_and_efficiency", "rearrange", "Rearrange E = P x t to make power or time the subject."),
  cap(
    "cap.energy.calculate_efficiency",
    "electrical.energy_and_efficiency",
    "calculate",
    "Calculate the efficiency of an electrical device as a percentage.",
  ),

  // --- electrical.charge_and_current ---------------------------------------
  cap("cap.charge.recognise", "electrical.charge_and_current", "recognise", "Recognise electric charge and its relationship to current and time."),
  cap("cap.charge.calculate", "electrical.charge_and_current", "calculate", "Calculate charge or current using I = Q / t."),

  // --- electrical.thermal_and_chemical_effects -----------------------------
  cap(
    "cap.thermal_chemical.recognise_effect",
    "electrical.thermal_and_chemical_effects",
    "recognise",
    "Recognise the thermal or chemical effect of current flowing through a circuit.",
  ),
  cap(
    "cap.thermal_chemical.recognise_application",
    "electrical.thermal_and_chemical_effects",
    "identify",
    "Identify a practical application of the thermal effect of current.",
  ),

  // --- electrical.conductors_and_insulators --------------------------------
  cap(
    "cap.conductors.classify_material",
    "electrical.conductors_and_insulators",
    "identify",
    "Classify a given material as a conductor or an insulator.",
  ),
  cap(
    "cap.conductors.recognise_breakdown",
    "electrical.conductors_and_insulators",
    "recognise",
    "Recognise insulation breakdown as a consequence of excessive voltage.",
  ),
  // CC-11.2: closes AC4.1's own "electron-theory-of-current" obligation
  // (EXPLICIT basis) -- taught since CC-10 but never directly assessed;
  // the pre-existing blueprints in this family test conductor/insulator
  // classification and breakdown, neither of which exercises the
  // electron-theory proposition itself.
  cap(
    "cap.conductors.recognise_electron_theory",
    "electrical.conductors_and_insulators",
    "recognise",
    "Recognise electron theory: in a metallic conductor, current is the flow of free electrons driven by a potential difference.",
  ),

  // --- electrical.instrumentation -------------------------------------------
  cap(
    "cap.instrumentation.select_instrument",
    "electrical.instrumentation",
    "select_relationship",
    "Select the correct instrument to measure a given electrical quantity.",
  ),
  cap(
    "cap.instrumentation.recognise_connection",
    "electrical.instrumentation",
    "interpret_diagram",
    "Recognise the correct connection method (series or parallel) for a given instrument.",
  ),
  cap(
    "cap.instrumentation.recognise_internal_resistance_property",
    "electrical.instrumentation",
    "recognise",
    "Recognise the ideal internal-resistance property of a voltmeter or ammeter.",
  ),
  cap(
    "cap.instrumentation.recognise_purpose",
    "electrical.instrumentation",
    "identify",
    "Identify the purpose of a specialised instrument (clamp meter, oscilloscope, continuity tester).",
  ),

  // --- electrical.fault_conditions_protection -------------------------------
  cap(
    "cap.fault.recognise_condition",
    "electrical.fault_conditions_protection",
    "recognise",
    "Recognise a short-circuit or open-circuit condition from its description.",
  ),
  cap("cap.fault.predict_effect", "electrical.fault_conditions_protection", "predict", "Predict the effect of a short circuit or open circuit on a circuit."),
  cap(
    "cap.fault.select_protective_device",
    "electrical.fault_conditions_protection",
    "select_relationship",
    "Select a protective device appropriate to a fault scenario.",
  ),
  cap(
    "cap.fault.compare_fuse_breaker",
    "electrical.fault_conditions_protection",
    "compare",
    "Compare fuse and circuit-breaker operation and reuse.",
  ),

  // --- electrical.magnetism_and_electromagnetism ----------------------------
  // CC-11.1: AC5.1's own explicit obligation (EL-CONCEPT-MAGNETISM-001,
  // "like poles repel, unlike poles attract") had no capability of its
  // own -- cap.magnetism.compare_permanent_electromagnet tests a
  // different proposition (permanent magnet vs electromagnet), never
  // pole interaction.
  cap(
    "cap.magnetism.recognise_attraction_repulsion",
    "electrical.magnetism_and_electromagnetism",
    "recognise",
    "Recognise the effects of magnetism in terms of attraction and repulsion between poles.",
  ),
  cap(
    "cap.magnetism.recognise_concept",
    "electrical.magnetism_and_electromagnetism",
    "recognise",
    "Recognise magnetic flux, flux density or electromagnetism from its definition.",
  ),
  cap(
    "cap.magnetism.interpret_field_direction",
    "electrical.magnetism_and_electromagnetism",
    "interpret_diagram",
    "Interpret the direction of the magnetic field produced by a current-carrying conductor.",
  ),
  cap(
    "cap.magnetism.interpret_force_direction",
    "electrical.magnetism_and_electromagnetism",
    "interpret_diagram",
    "Interpret the direction of the force on a current-carrying conductor in a magnetic field.",
  ),
  cap(
    "cap.magnetism.compare_permanent_electromagnet",
    "electrical.magnetism_and_electromagnetism",
    "compare",
    "Compare a permanent magnet with an electromagnet.",
  ),
  cap(
    "cap.magnetism.compare_motor_generator",
    "electrical.magnetism_and_electromagnetism",
    "compare",
    "Compare the motor principle with the generator principle.",
  ),
  // CC-09E: official 2365-602 sample-assessment-confirmed archetype (task
  // section 4) -- identify the correct SI unit for a magnetic quantity
  // among plausible related-unit distractors.
  cap(
    "cap.magnetism.identify_unit",
    "electrical.magnetism_and_electromagnetism",
    "identify",
    "Identify the SI unit of magnetic flux or magnetic flux density.",
  ),
  // CC-11.1: AC5.3's own governed "force-on-conductor-calculation"
  // obligation (F = B I l, Fleming's left-hand rule, basis
  // OFFICIAL_TEACHING_INTERPRETATION) had no capability, formula family,
  // worked example or question blueprint anywhere -- a genuine gap CC-11
  // found and explicitly deferred, closed here.
  cap(
    "cap.magnetism.calculate_force_on_conductor",
    "electrical.magnetism_and_electromagnetism",
    "calculate",
    "Calculate the force on a straight current-carrying conductor at right angles to a magnetic field, using F = B I l.",
  ),

  // --- electrical.emf_and_generation -----------------------------------------
  cap(
    "cap.emf.recognise_emf_terminal_voltage",
    "electrical.emf_and_generation",
    "compare",
    "Distinguish EMF from terminal voltage.",
  ),
  cap(
    "cap.emf.describe_ac_generation",
    "electrical.emf_and_generation",
    "recognise",
    "Describe the basic principle of a rotating-loop A.C. generator.",
  ),
  // CC-09E: official 2365-602 sample-assessment-confirmed archetype (task
  // section 4) -- calculate the EMF induced in a single loop (or the flux
  // change from a given EMF/time), e = (change in flux) / (time taken).
  cap(
    "cap.emf.calculate_flux_change",
    "electrical.emf_and_generation",
    "calculate",
    "Calculate the EMF induced in a single loop by a changing magnetic flux, or the flux change from a given EMF and time.",
  ),
  // CC-11.1: AC5.3's own governed "induced-emf-calculation" obligation
  // (e = B l v, the motional-EMF special case for a conductor moving
  // through a field, distinct from the general rate-of-change-of-flux
  // form above; Fleming's right-hand rule; basis
  // OFFICIAL_TEACHING_INTERPRETATION) had no capability, formula family,
  // worked example or question blueprint anywhere -- a genuine gap CC-11
  // found and explicitly deferred, closed here.
  cap(
    "cap.emf.calculate_motional_emf",
    "electrical.emf_and_generation",
    "calculate",
    "Calculate the EMF induced in a straight conductor moving through a magnetic field, using e = B l v (conductor length, velocity and field mutually perpendicular).",
  ),

  // --- electrical.ac_dc_waveforms ---------------------------------------------
  cap("cap.waveform.recognise_ac_dc", "electrical.ac_dc_waveforms", "compare", "Distinguish A.C. from D.C. supply behaviour."),
  cap(
    "cap.waveform.identify_characteristic",
    "electrical.ac_dc_waveforms",
    "identify",
    "Identify a named sine-wave characteristic (periodic time, amplitude, peak-to-peak, RMS, average value, frequency).",
  ),
  cap(
    "cap.waveform.calculate_rms_peak",
    "electrical.ac_dc_waveforms",
    "calculate",
    "Calculate RMS value from peak value, or peak value from RMS value.",
  ),
  cap(
    "cap.waveform.calculate_frequency_period",
    "electrical.ac_dc_waveforms",
    "calculate",
    "Calculate frequency from periodic time, or periodic time from frequency.",
  ),
  cap(
    "cap.waveform.interpret_rated_value",
    "electrical.ac_dc_waveforms",
    "check_plausibility",
    "Interpret whether a quoted AC supply rating refers to RMS or peak value.",
  ),
  cap(
    "cap.waveform.compare_ac_dc_behaviour",
    "electrical.ac_dc_waveforms",
    "compare",
    "Compare how a resistor, inductor and capacitor behave under AC versus DC supply.",
  ),

  // --- electrical.ac_reactive_quantities ---------------------------------------
  cap(
    "cap.ac_reactive.recognise",
    "electrical.ac_reactive_quantities",
    "recognise",
    "Recognise reactance, impedance, inductance, capacitance or power factor from its definition.",
  ),
  // CC-09E: official 2365-602 sample-assessment-confirmed archetype (task
  // section 4) -- select the correct formula for a governed AC relationship
  // among plausible distractor formulas. Categorical formula recognition
  // only (operationType "select_relationship") -- no numeric AC
  // calculation is required or added; see the family's own reclassification
  // comment above for the scope boundary this stays within.
  cap(
    "cap.ac_reactive.select_impedance_formula",
    "electrical.ac_reactive_quantities",
    "select_relationship",
    "Select the correct formula for impedance in terms of resistance and reactance.",
  ),
  // CC-09E (task section 10, ASSESSMENT_STYLE_TRANSFER example): the same
  // "identify SI unit among plausible related-unit distractors" grammar
  // magnetism.identify_flux_density_unit demonstrates (DIRECT_SAMPLE_
  // ANALOGUE to sample item 31) legitimately transfers to a different
  // governed electrical quantity the sample never tested -- reactance.
  cap(
    "cap.ac_reactive.identify_reactance_unit",
    "electrical.ac_reactive_quantities",
    "identify",
    "Identify the SI unit of reactance.",
  ),

  // --- CC-09B: new Foundational capabilities (teaching-only) -----------
  cap("cap.foundational.indices.apply", "foundational.indices", "calculate", "Apply the laws of indices when multiplying, dividing or taking roots of powers of the same base."),
  cap("cap.foundational.trigonometry.apply", "foundational.trigonometry", "calculate", "Apply Pythagoras' theorem or a trigonometric ratio to find an unknown length or angle in a right-angled triangle."),
  cap("cap.foundational.statistics.interpret", "foundational.statistics", "interpret_diagram", "Interpret the mean, median, mode and range of a data set."),
  cap("cap.foundational.levers.recognise", "foundational.levers_mechanical_advantage", "recognise", "Recognise how a lever provides mechanical advantage, and distinguish class I, II and III levers."),
  // CC-09G (task section 4B): AC3.2 requires gears and pulleys alongside
  // levers; these capabilities already had governed assertion coverage
  // (FP-CONCEPT-GEAR-001/FP-REL-GEAR-RATIO-001/... and FP-CONCEPT-PULLEY-
  // 001/FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001/...) but no capability of
  // their own to represent in family-mastery completeness.
  // CC-09I (task section 4): narrowed to genuinely REQUIRED knowledge only
  // (the "gears" obligation, unit202-knowledge-obligations.ts acNumber
  // "3.2", satisfiedBy exactly FP-CONCEPT-GEAR-001/FP-REL-GEAR-RATIO-001).
  // Direction reversal (FP-GEAR-DIRECTION-REVERSAL-001) and the idler
  // gear's role (FP-GEAR-IDLER-001), like the speed/torque trade-off
  // (FP-GEAR-SPEED-TORQUE-TRADEOFF-001), are governed SUPPORTS-only
  // curriculum content (curriculum type "SUPPORTS", never "REQUIRED_FOR")
  // -- valuable teaching content, still governed family members via
  // membersOf below, but never named by this REQUIRED capability's own
  // description, which would have silently promoted them to mandatory
  // Unit 202 mastery. See report-coverage-matrix.test.ts's CC-09I
  // regression pinning this.
  cap("cap.foundational.gears.recognise", "foundational.levers_mechanical_advantage", "recognise", "Recognise how a gear provides mechanical advantage (ratio of driven/driving radii or tooth counts)."),
  cap("cap.foundational.pulleys.recognise", "foundational.levers_mechanical_advantage", "recognise", "Recognise how a pulley system provides mechanical advantage (number of supporting rope/cable sections), distinguishing fixed from movable/combination pulleys."),
  // CC-11 (Workstream A): AC3.2's own governed lever-calculation
  // obligation (FP-REL-LEVER-BALANCE-001) had no capability of its own.
  cap("cap.foundational.levers.calculate", "foundational.levers_mechanical_advantage", "calculate", "Calculate the effort or load in a balanced lever using the moment-balance relationship (effort x effort-arm = load x load-arm)."),
  cap("cap.foundational.si_quantities_general.identify_unit", "foundational.si_quantities_general", "identify", "Identify the correct SI unit for a general (non-electrical) physical quantity."),

  // --- CC-09B: electrical.electronic_components (teaching-only) --------
  cap("cap.electronic_components.recognise_principle", "electrical.electronic_components", "recognise", "Recognise the basic operating principle of a common electronic component."),
  cap("cap.electronic_components.identify_application", "electrical.electronic_components", "identify", "Identify which electronic component is typically used for a given electrical-system application."),
];

// =======================================================================
// 5. Family teaching representations
// =======================================================================

function familyRep(
  familyId: string,
  representationType: FamilyTeachingRepresentation["representationType"],
  requirement: FamilyTeachingRepresentation["requirement"],
  opts: { role?: FamilyTeachingRepresentation["role"]; diagramBlueprintId?: string } = {},
): FamilyTeachingRepresentation {
  return { familyId, representationType, requirement, role: opts.role, diagramBlueprintId: opts.diagramBlueprintId };
}

const familyTeachingRepresentations: FamilyTeachingRepresentation[] = [
  familyRep("electrical.ohms_law", "formula_family", "required"),
  familyRep("electrical.ohms_law", "mnemonic", "recommended", { role: "supporting" }),
  familyRep("electrical.ohms_law", "worked_example", "required"),

  familyRep("electrical.resistivity", "concept_card", "required"),

  familyRep("electrical.series_circuits", "technical_diagram", "required", {
    role: "essential",
    diagramBlueprintId: "circuit.series_resistors",
  }),
  familyRep("electrical.series_circuits", "worked_example", "required"),

  familyRep("electrical.parallel_circuits", "technical_diagram", "required", {
    role: "essential",
    diagramBlueprintId: "circuit.parallel_resistors",
  }),
  familyRep("electrical.parallel_circuits", "worked_example", "required"),
  familyRep("electrical.parallel_circuits", "misconception_warning", "recommended"),

  familyRep("electrical.series_vs_parallel_comparison", "technical_diagram", "required", {
    role: "essential",
    diagramBlueprintId: "circuit.series_parallel_mixed",
  }),
  familyRep("electrical.series_vs_parallel_comparison", "comparison", "required"),

  familyRep("electrical.power_relationships", "formula_family", "required"),
  familyRep("electrical.power_relationships", "mnemonic", "recommended", { role: "supporting" }),

  familyRep("electrical.energy_and_efficiency", "formula_family", "required"),

  familyRep("electrical.instrumentation", "technical_diagram", "required", {
    role: "essential",
    diagramBlueprintId: "instrument.measurement_connection",
  }),

  familyRep("electrical.fault_conditions_protection", "concept_card", "recommended"),

  familyRep("electrical.magnetism_and_electromagnetism", "technical_diagram", "required", {
    role: "essential",
    diagramBlueprintId: "magnetic.field_conductor_direction",
  }),

  // CC-11.3: was "motor.force_field_current" (the static motor-principle
  // diagram) -- a genuine misrepresentation of this family's own rotating-
  // loop AC-generation content, corrected to the new dedicated blueprint.
  familyRep("electrical.emf_and_generation", "technical_diagram", "required", {
    role: "essential",
    diagramBlueprintId: "generator.rotating_loop",
  }),

  familyRep("electrical.ac_dc_waveforms", "technical_diagram", "required", {
    role: "essential",
    diagramBlueprintId: "graph.waveform_sine",
  }),
];

// =======================================================================
// 6. Diagram blueprints
// =======================================================================

function diagramAccessibility(labelPattern: string) {
  return {
    semanticDescriptionRequired: true as const,
    colourOnlyEncodingProhibited: true as const,
    identifierLabelPattern: labelPattern,
  };
}

const diagramBlueprints: DiagramBlueprint[] = [
  {
    id: "circuit.series_resistors",
    type: "electrical_circuit",
    renderer: "svg",
    parameters: [
      { name: "component_count", kind: "enum", allowed: [2, 3, 4] },
      { name: "show_values", kind: "boolean" },
      { name: "show_current_arrow", kind: "boolean" },
    ],
    accessibility: diagramAccessibility("R{index}"),
    valueEmbedding: "symbolic_only",
  },
  {
    id: "circuit.parallel_resistors",
    type: "electrical_circuit",
    renderer: "svg",
    parameters: [
      { name: "branch_count", kind: "enum", allowed: [2, 3, 4] },
      { name: "show_values", kind: "boolean" },
      { name: "show_branch_current_arrows", kind: "boolean" },
    ],
    accessibility: diagramAccessibility("R{index}"),
    valueEmbedding: "symbolic_only",
  },
  {
    id: "circuit.series_parallel_mixed",
    type: "electrical_circuit",
    renderer: "svg",
    parameters: [
      { name: "branch_arrangement", kind: "enum", allowed: ["series_of_parallel", "parallel_of_series"] },
      { name: "show_values", kind: "boolean" },
    ],
    accessibility: diagramAccessibility("R{index}"),
    valueEmbedding: "symbolic_only",
  },
  {
    id: "magnetic.field_conductor_direction",
    type: "magnetic_field",
    renderer: "svg",
    parameters: [
      { name: "current_direction", kind: "enum", allowed: ["into_page", "out_of_page", "left_to_right"] },
      { name: "show_field_arrows", kind: "boolean" },
    ],
    accessibility: diagramAccessibility("arrow-{index}"),
    valueEmbedding: "symbolic_only",
  },
  {
    id: "motor.force_field_current",
    type: "magnetic_field",
    renderer: "svg",
    parameters: [
      { name: "pole_labels", kind: "enum", allowed: ["N_S_horizontal", "N_S_vertical"] },
      { name: "current_direction", kind: "enum", allowed: ["into_page", "out_of_page"] },
      { name: "show_force_arrow", kind: "boolean" },
    ],
    accessibility: diagramAccessibility("arrow-{index}"),
    valueEmbedding: "symbolic_only",
  },
  {
    id: "graph.waveform_sine",
    type: "waveform",
    renderer: "svg",
    parameters: [
      { name: "show_peak_line", kind: "boolean" },
      { name: "show_rms_line", kind: "boolean" },
      { name: "show_period_marker", kind: "boolean" },
      { name: "cycles_shown", kind: "number_range", min: 1, max: 3 },
    ],
    accessibility: diagramAccessibility("marker-{index}"),
    valueEmbedding: "values_when_assessed",
  },
  {
    id: "instrument.measurement_connection",
    type: "instrument_connection",
    renderer: "svg",
    parameters: [
      { name: "instrument_type", kind: "enum", allowed: ["voltmeter", "ammeter", "ohmmeter"] },
      // CC-11.3: "isolated" added for the ohmmeter's own metadata honesty
      // -- an ohmmeter connection is never meaningfully "in series" or
      // "in parallel" (InstrumentConnectionDiagram.tsx's own
      // CANONICAL_CONNECTION already documents and structurally enforces
      // this; the renderer never even reads connection_style for
      // instrument_type "ohmmeter"). "series"/"parallel" remain first in
      // the list and unchanged in meaning for voltmeter/ammeter.
      { name: "connection_style", kind: "enum", allowed: ["series", "parallel", "isolated"] },
    ],
    accessibility: diagramAccessibility("instrument-{index}"),
    valueEmbedding: "symbolic_only",
  },
  // ---------------------------------------------------------------------
  // CC-11.3: whole-course instructional visual coverage closeout -- LO3
  // mechanics (levers/gears/pulleys), LO4 resistivity, LO5 magnetism/AC
  // (pole interaction, flux/flux-density concept, motional-EMF geometry,
  // single-loop AC generator), LO6 UK/IEC component symbols.
  // ---------------------------------------------------------------------
  {
    id: "mechanical.lever_arrangement",
    type: "mechanical",
    renderer: "svg",
    parameters: [
      { name: "lever_class", kind: "enum", allowed: ["class_1", "class_2", "class_3"] },
      { name: "show_distances", kind: "boolean" },
    ],
    accessibility: diagramAccessibility("lever-{index}"),
    valueEmbedding: "symbolic_only",
  },
  {
    id: "mechanical.gear_mesh",
    type: "mechanical",
    renderer: "svg",
    parameters: [{ name: "size_ratio", kind: "enum", allowed: ["driven_larger", "driven_smaller", "equal"] }],
    accessibility: diagramAccessibility("gear-{index}"),
    valueEmbedding: "symbolic_only",
  },
  {
    id: "mechanical.pulley_arrangement",
    type: "mechanical",
    renderer: "svg",
    parameters: [{ name: "arrangement", kind: "enum", allowed: ["fixed", "movable"] }],
    accessibility: diagramAccessibility("pulley-{index}"),
    valueEmbedding: "symbolic_only",
  },
  {
    // Belongs conceptually to electrical.resistivity, not the mechanics
    // families above -- `type: "mechanical"` names the diagram's own
    // spatial/graphical CATEGORY (a labelled physical object's
    // dimensions), never an assertion-family grouping; see
    // ResistivityDimensionsDiagram.tsx's own header comment.
    id: "mechanical.resistivity_dimensions",
    type: "mechanical",
    renderer: "svg",
    parameters: [{ name: "comparison", kind: "enum", allowed: ["length", "area"] }],
    accessibility: diagramAccessibility("rod-{index}"),
    valueEmbedding: "symbolic_only",
  },
  {
    id: "magnetic.pole_interaction",
    type: "magnetic_field",
    renderer: "svg",
    parameters: [{ name: "pole_pairing", kind: "enum", allowed: ["like_poles_facing", "unlike_poles_facing"] }],
    accessibility: diagramAccessibility("pole-{index}"),
    valueEmbedding: "symbolic_only",
  },
  {
    id: "magnetic.flux_field_lines",
    type: "magnetic_field",
    renderer: "svg",
    parameters: [{ name: "density_comparison", kind: "boolean" }],
    accessibility: diagramAccessibility("flux-line-{index}"),
    valueEmbedding: "symbolic_only",
  },
  {
    // No parameters -- the mutually-perpendicular B/l/v geometry never
    // varies; this diagram illustrates a fixed given arrangement, not a
    // family of distinct pictures.
    id: "emf.motional_emf_geometry",
    type: "magnetic_field",
    renderer: "svg",
    parameters: [],
    accessibility: diagramAccessibility("vector-{index}"),
    valueEmbedding: "symbolic_only",
  },
  {
    id: "generator.rotating_loop",
    type: "magnetic_field",
    renderer: "svg",
    parameters: [{ name: "rotation_phase", kind: "enum", allowed: ["vertical", "horizontal"] }],
    accessibility: diagramAccessibility("loop-{index}"),
    valueEmbedding: "symbolic_only",
  },
  {
    // One shared, parameterised blueprint for all 13 governed LO6
    // components -- mirrors instrument.measurement_connection's own
    // one-blueprint-many-instrument_type pattern, rather than 13 bespoke
    // blueprints for what is structurally the same "pick a governed
    // component and show its symbol/card" representation.
    id: "electronics.component_symbol_card",
    type: "component_symbol",
    renderer: "svg",
    parameters: [
      {
        name: "component_type",
        kind: "enum",
        allowed: ["resistor", "capacitor", "diode", "zener_diode", "led", "photodiode", "thermistor", "diac", "triac", "transistor", "thyristor_scr", "rectifier", "inverter"],
      },
    ],
    accessibility: diagramAccessibility("component-{index}"),
    valueEmbedding: "symbolic_only",
  },
];

// =======================================================================
// 7. Formula families, worked examples and mnemonic visual aids
// =======================================================================

const formulaFamilies: FormulaFamily[] = [
  {
    id: "formula.ohms_law",
    assertionFamilyId: "electrical.ohms_law",
    canonicalTarget: "V",
    variables: [
      { symbol: "V", name: "voltage", quantity: "voltage", unitName: "volt", unitSymbol: "V" },
      { symbol: "I", name: "current", quantity: "current", unitName: "ampere", unitSymbol: "A" },
      { symbol: "R", name: "resistance", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
    ],
    forms: [
      {
        target: "V",
        expression: { operation: "multiply", operands: ["I", "R"] },
        instruction: "To find voltage, multiply current by resistance.",
        requiresWorkedExample: true,
      },
      {
        target: "I",
        expression: { operation: "divide", numerator: "V", denominator: "R" },
        instruction: "To find current, divide voltage by resistance.",
        requiresWorkedExample: true,
      },
      {
        target: "R",
        expression: { operation: "divide", numerator: "V", denominator: "I" },
        instruction: "To find resistance, divide voltage by current.",
        requiresWorkedExample: true,
      },
    ],
    requiredTargets: ["V", "I", "R"],
    mnemonicId: "mnemonic.vir_triangle",
  },
  // CC-08: two small, deliberately abstract (non-electrical) formula
  // families for foundational.algebraic_technique's own standalone
  // lesson. They restate FM-ALG-TRANSPOSE-MULT-001 ("a = b times c,
  // rearrange to make b or c the subject") and FM-ALG-TRANSPOSE-ADD-001
  // ("a = b + c, rearrange to make b or c the subject") -- both already
  // real governed assertions -- in the SAME structured-expression /
  // worked-example / question-blueprint machinery every Electrical
  // formula family uses, so the skill genuinely transfers rather than
  // being taught through Ohm's-law content in disguise (task brief §5B).
  // "Solve for a" is deliberately not a target: given a and one factor/
  // term, finding the OTHER factor/term is the rearrangement skill;
  // finding a itself is direct substitution, not rearrangement.
  {
    id: "formula.algebraic_rearrangement_multiplicative",
    assertionFamilyId: "foundational.algebraic_technique",
    canonicalTarget: "a",
    variables: [
      { symbol: "a", name: "a", quantity: "value", unitName: "unit", unitSymbol: "u" },
      { symbol: "b", name: "b", quantity: "value", unitName: "unit", unitSymbol: "u" },
      { symbol: "c", name: "c", quantity: "value", unitName: "unit", unitSymbol: "u" },
    ],
    forms: [
      {
        target: "a",
        expression: { operation: "multiply", operands: ["b", "c"] },
        instruction: "a is b multiplied by c.",
        requiresWorkedExample: false,
      },
      {
        target: "b",
        expression: { operation: "divide", numerator: "a", denominator: "c" },
        instruction: "To find b, divide a by c.",
        requiresWorkedExample: true,
      },
      {
        target: "c",
        expression: { operation: "divide", numerator: "a", denominator: "b" },
        instruction: "To find c, divide a by b.",
        requiresWorkedExample: true,
      },
    ],
    // Only "b" is a required target (needs a governed question blueprint);
    // the "c" form is documented content but the b/c rearrangement skill
    // is identical, so a single assessed target keeps authoring bounded
    // (task brief: smallest credible proving vertical).
    requiredTargets: ["b"],
  },
  {
    id: "formula.algebraic_rearrangement_additive",
    assertionFamilyId: "foundational.algebraic_technique",
    canonicalTarget: "a",
    variables: [
      { symbol: "a", name: "a", quantity: "value", unitName: "unit", unitSymbol: "u" },
      { symbol: "b", name: "b", quantity: "value", unitName: "unit", unitSymbol: "u" },
      { symbol: "c", name: "c", quantity: "value", unitName: "unit", unitSymbol: "u" },
    ],
    forms: [
      {
        target: "a",
        expression: { operation: "add", operands: ["b", "c"] },
        instruction: "a is b plus c.",
        requiresWorkedExample: false,
      },
      {
        target: "b",
        expression: { operation: "subtract", operands: ["a", "c"] },
        instruction: "To find b, subtract c from a.",
        requiresWorkedExample: true,
      },
      {
        target: "c",
        expression: { operation: "subtract", operands: ["a", "b"] },
        instruction: "To find c, subtract b from a.",
        requiresWorkedExample: true,
      },
    ],
    requiredTargets: ["b"],
  },
  {
    id: "formula.series_resistance",
    assertionFamilyId: "electrical.series_circuits",
    canonicalTarget: "Rt",
    variables: [
      { symbol: "Rt", name: "total resistance", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
      { symbol: "R1", name: "resistance of component 1", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
      { symbol: "R2", name: "resistance of component 2", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
      { symbol: "R3", name: "resistance of component 3", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
      { symbol: "R4", name: "resistance of component 4", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
    ],
    forms: [
      {
        target: "Rt",
        expression: { operation: "add", operands: ["R1", "R2", "R3", "R4"] },
        instruction:
          "To find total series resistance, add the individual component resistances (using as many of R1..R4 as the circuit actually has).",
        requiresWorkedExample: true,
      },
    ],
    requiredTargets: ["Rt"],
  },
  {
    id: "formula.parallel_resistance",
    assertionFamilyId: "electrical.parallel_circuits",
    canonicalTarget: "Rt",
    variables: [
      { symbol: "Rt", name: "total resistance", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
      { symbol: "R1", name: "resistance of branch 1", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
      { symbol: "R2", name: "resistance of branch 2", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
      { symbol: "R3", name: "resistance of branch 3", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
      { symbol: "R4", name: "resistance of branch 4", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
    ],
    forms: [
      {
        target: "Rt",
        expression: { operation: "reciprocal_of_sum_of_reciprocals", operands: ["R1", "R2", "R3", "R4"] },
        instruction:
          "To find total parallel resistance, sum the reciprocals of the individual branch resistances, then take the reciprocal of that total (using as many of R1..R4 as the circuit actually has).",
        requiresWorkedExample: true,
      },
    ],
    requiredTargets: ["Rt"],
  },
  {
    id: "formula.electrical_power",
    assertionFamilyId: "electrical.power_relationships",
    canonicalTarget: "P",
    variables: [
      { symbol: "P", name: "power", quantity: "power", unitName: "watt", unitSymbol: "W" },
      { symbol: "V", name: "voltage", quantity: "voltage", unitName: "volt", unitSymbol: "V" },
      { symbol: "I", name: "current", quantity: "current", unitName: "ampere", unitSymbol: "A" },
      { symbol: "R", name: "resistance", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
    ],
    forms: [
      {
        target: "P",
        expression: { operation: "multiply", operands: ["V", "I"] },
        instruction: "To find power, multiply voltage by current.",
        requiresWorkedExample: true,
      },
      {
        target: "V",
        expression: { operation: "divide", numerator: "P", denominator: "I" },
        instruction: "To find voltage, divide power by current.",
        requiresWorkedExample: true,
      },
      {
        target: "I",
        expression: { operation: "divide", numerator: "P", denominator: "V" },
        instruction: "To find current, divide power by voltage.",
        requiresWorkedExample: true,
      },
      {
        target: "P",
        expression: {
          operation: "multiply",
          operands: [{ operation: "square", operand: "I" }, "R"],
        },
        instruction: "Power can also be found by multiplying current squared by resistance: P = I^2 x R.",
        requiresWorkedExample: true,
      },
      {
        target: "P",
        expression: {
          operation: "divide",
          numerator: { operation: "square", operand: "V" },
          denominator: "R",
        },
        instruction: "Power can also be found by dividing voltage squared by resistance: P = V^2 / R.",
        requiresWorkedExample: true,
      },
    ],
    requiredTargets: ["P", "V", "I"],
    mnemonicId: "mnemonic.power_triangle",
  },
  {
    id: "formula.electrical_energy",
    assertionFamilyId: "electrical.energy_and_efficiency",
    canonicalTarget: "E",
    variables: [
      { symbol: "E", name: "energy", quantity: "energy", unitName: "joule", unitSymbol: "J" },
      { symbol: "P", name: "power", quantity: "power", unitName: "watt", unitSymbol: "W" },
      { symbol: "t", name: "time", quantity: "time", unitName: "second", unitSymbol: "s" },
    ],
    forms: [
      {
        target: "E",
        expression: { operation: "multiply", operands: ["P", "t"] },
        instruction: "To find energy transferred, multiply power by time.",
        requiresWorkedExample: true,
      },
      {
        target: "P",
        expression: { operation: "divide", numerator: "E", denominator: "t" },
        instruction: "To find power, divide energy by time.",
        requiresWorkedExample: true,
      },
      {
        target: "t",
        expression: { operation: "divide", numerator: "E", denominator: "P" },
        instruction: "To find time, divide energy by power.",
        requiresWorkedExample: true,
      },
    ],
    requiredTargets: ["E", "P", "t"],
  },
  {
    id: "formula.electrical_efficiency",
    assertionFamilyId: "electrical.energy_and_efficiency",
    canonicalTarget: "eta",
    variables: [
      { symbol: "eta", name: "efficiency", quantity: "efficiency", unitName: "percent", unitSymbol: "%" },
      { symbol: "Pout", name: "useful power output", quantity: "power", unitName: "watt", unitSymbol: "W" },
      { symbol: "Pin", name: "power input", quantity: "power", unitName: "watt", unitSymbol: "W" },
    ],
    forms: [
      {
        target: "eta",
        expression: { operation: "ratio_percentage", numerator: "Pout", denominator: "Pin" },
        instruction: "To find efficiency, divide useful power output by power input and express as a percentage.",
        requiresWorkedExample: true,
      },
    ],
    requiredTargets: ["eta"],
  },
  {
    id: "formula.charge_current",
    assertionFamilyId: "electrical.charge_and_current",
    canonicalTarget: "I",
    variables: [
      { symbol: "I", name: "current", quantity: "current", unitName: "ampere", unitSymbol: "A" },
      { symbol: "Q", name: "charge", quantity: "charge", unitName: "coulomb", unitSymbol: "C" },
      { symbol: "t", name: "time", quantity: "time", unitName: "second", unitSymbol: "s" },
    ],
    forms: [
      {
        target: "I",
        expression: { operation: "divide", numerator: "Q", denominator: "t" },
        instruction: "To find current, divide charge by time.",
        requiresWorkedExample: true,
      },
      {
        target: "Q",
        expression: { operation: "multiply", operands: ["I", "t"] },
        instruction: "To find charge, multiply current by time.",
        requiresWorkedExample: true,
      },
      {
        target: "t",
        expression: { operation: "divide", numerator: "Q", denominator: "I" },
        instruction: "To find time, divide charge by current.",
        requiresWorkedExample: false,
      },
    ],
    requiredTargets: ["I", "Q"],
  },
  {
    // CC-09E: official 2365-602 sample-assessment-confirmed archetype
    // (task section 4) -- the single-loop form of Faraday's law
    // (EL-REL-FLUX-CHANGE-EMF-001, CC-09D/CC-09D.1: e = (change in flux) /
    // (time taken), narrowed from a generic "coil" wording to match the
    // formula actually given, with no N-turn factor).
    id: "formula.flux_change_emf",
    assertionFamilyId: "electrical.emf_and_generation",
    canonicalTarget: "e",
    variables: [
      { symbol: "e", name: "induced EMF", quantity: "emf", unitName: "volt", unitSymbol: "V" },
      { symbol: "deltaPhi", name: "change in magnetic flux", quantity: "magnetic flux", unitName: "weber", unitSymbol: "Wb" },
      { symbol: "deltaT", name: "time taken", quantity: "time", unitName: "second", unitSymbol: "s" },
    ],
    forms: [
      {
        target: "e",
        expression: { operation: "divide", numerator: "deltaPhi", denominator: "deltaT" },
        instruction: "To find the induced EMF, divide the change in flux by the time taken.",
        requiresWorkedExample: true,
      },
      {
        target: "deltaPhi",
        expression: { operation: "multiply", operands: ["e", "deltaT"] },
        instruction: "To find the change in flux, multiply the induced EMF by the time taken.",
        requiresWorkedExample: true,
      },
      {
        target: "deltaT",
        expression: { operation: "divide", numerator: "deltaPhi", denominator: "e" },
        instruction: "To find the time taken, divide the change in flux by the induced EMF.",
        requiresWorkedExample: false,
      },
    ],
    requiredTargets: ["e", "deltaPhi"],
  },
  {
    id: "formula.resistivity",
    assertionFamilyId: "electrical.resistivity",
    canonicalTarget: "R",
    variables: [
      { symbol: "R", name: "resistance", quantity: "resistance", unitName: "ohm", unitSymbol: "Ω" },
      { symbol: "rho", name: "resistivity", quantity: "resistivity", unitName: "ohm-metre", unitSymbol: "Ω·m" },
      { symbol: "L", name: "conductor length", quantity: "length", unitName: "metre", unitSymbol: "m" },
      { symbol: "A", name: "cross-sectional area", quantity: "area", unitName: "square metre", unitSymbol: "m²" },
    ],
    forms: [
      {
        target: "R",
        expression: {
          operation: "divide",
          numerator: { operation: "multiply", operands: ["rho", "L"] },
          denominator: "A",
        },
        instruction: "To find resistance, multiply resistivity by length, then divide by cross-sectional area.",
        requiresWorkedExample: true,
      },
    ],
    requiredTargets: ["R"],
  },
  {
    id: "formula.ac_waveform_relationships",
    assertionFamilyId: "electrical.ac_dc_waveforms",
    canonicalTarget: "rms",
    variables: [
      { symbol: "rms", name: "RMS value", quantity: "voltage_or_current", unitName: "volt or ampere", unitSymbol: "V/A" },
      { symbol: "peak", name: "peak value", quantity: "voltage_or_current", unitName: "volt or ampere", unitSymbol: "V/A" },
      { symbol: "f", name: "frequency", quantity: "frequency", unitName: "hertz", unitSymbol: "Hz" },
      { symbol: "T", name: "periodic time", quantity: "time", unitName: "second", unitSymbol: "s" },
    ],
    forms: [
      {
        target: "rms",
        expression: { operation: "divide", numerator: "peak", denominator: { operation: "sqrt", operand: 2 } },
        instruction: "To find the RMS value, divide the peak value by the square root of two.",
        requiresWorkedExample: true,
      },
      {
        target: "peak",
        expression: { operation: "multiply", operands: ["rms", { operation: "sqrt", operand: 2 }] },
        instruction: "To find the peak value, multiply the RMS value by the square root of two.",
        requiresWorkedExample: true,
      },
      {
        target: "f",
        expression: { operation: "divide", numerator: 1, denominator: "T" },
        instruction: "To find frequency, divide one by the periodic time.",
        requiresWorkedExample: true,
      },
      {
        target: "T",
        expression: { operation: "divide", numerator: 1, denominator: "f" },
        instruction: "To find periodic time, divide one by the frequency.",
        requiresWorkedExample: true,
      },
    ],
    requiredTargets: ["rms", "peak", "f", "T"],
  },
  // ===================================================================
  // CC-11 (Workstream A): Unit 202 LO3 (AC3.2/AC3.3/AC3.4) formula
  // families reclassified from teaching-only to assessable.
  // ===================================================================
  {
    // Unit 202 LO3 AC3.2's governed lever-calculation obligation
    // (FP-REL-LEVER-BALANCE-001, unit202-knowledge-obligations.ts
    // acNumber "3.2", basis OFFICIAL_TEACHING_INTERPRETATION) -- moment
    // balance: effort x effort-arm = load x load-arm.
    id: "formula.lever_balance",
    assertionFamilyId: "foundational.levers_mechanical_advantage",
    canonicalTarget: "Fe",
    variables: [
      { symbol: "Fe", name: "effort force", quantity: "force", unitName: "newton", unitSymbol: "N" },
      { symbol: "de", name: "effort-to-pivot distance", quantity: "length", unitName: "metre", unitSymbol: "m" },
      { symbol: "Fl", name: "load force", quantity: "force", unitName: "newton", unitSymbol: "N" },
      { symbol: "dl", name: "load-to-pivot distance", quantity: "length", unitName: "metre", unitSymbol: "m" },
    ],
    forms: [
      {
        target: "Fe",
        expression: { operation: "divide", numerator: { operation: "multiply", operands: ["Fl", "dl"] }, denominator: "de" },
        instruction: "To find the effort force, multiply the load by its distance from the pivot, then divide by the effort's distance from the pivot.",
        requiresWorkedExample: true,
      },
      {
        target: "Fl",
        expression: { operation: "divide", numerator: { operation: "multiply", operands: ["Fe", "de"] }, denominator: "dl" },
        instruction: "To find the load, multiply the effort by its distance from the pivot, then divide by the load's distance from the pivot.",
        requiresWorkedExample: true,
      },
    ],
    requiredTargets: ["Fe", "Fl"],
  },
  {
    // General-mechanics work, FP-REL-WORK-FORCE-DISTANCE-001 (AC3.3) /
    // FP-CALC-WORK-001 (AC3.4).
    id: "formula.mechanics_work",
    assertionFamilyId: "foundational.mechanics_work_energy_power",
    canonicalTarget: "W",
    variables: [
      { symbol: "W", name: "work done", quantity: "work", unitName: "joule", unitSymbol: "J" },
      { symbol: "F", name: "force", quantity: "force", unitName: "newton", unitSymbol: "N" },
      { symbol: "d", name: "distance moved", quantity: "length", unitName: "metre", unitSymbol: "m" },
    ],
    forms: [
      {
        target: "W",
        expression: { operation: "multiply", operands: ["F", "d"] },
        instruction: "To find work done, multiply the force by the distance moved in the direction of that force.",
        requiresWorkedExample: true,
      },
    ],
    requiredTargets: ["W"],
  },
  {
    // FP-REL-KINETIC-ENERGY-001 (AC3.3) / FP-CALC-KINETIC-ENERGY-001
    // (AC3.4). KE = 1/2 x m x v^2 -- "0.5" is a numeric-constant leaf, not
    // a physical-quantity variable, the same treatment
    // formula.ac_waveform_relationships already gives sqrt(2).
    id: "formula.mechanics_kinetic_energy",
    assertionFamilyId: "foundational.mechanics_work_energy_power",
    canonicalTarget: "KE",
    variables: [
      { symbol: "KE", name: "kinetic energy", quantity: "energy", unitName: "joule", unitSymbol: "J" },
      { symbol: "m", name: "mass", quantity: "mass", unitName: "kilogram", unitSymbol: "kg" },
      { symbol: "v", name: "speed", quantity: "speed", unitName: "metre per second", unitSymbol: "m/s" },
    ],
    forms: [
      {
        target: "KE",
        expression: { operation: "multiply", operands: [0.5, "m", { operation: "square", operand: "v" }] },
        instruction: "To find kinetic energy, multiply one half by the mass, by the speed squared: KE = 1/2 x m x v^2.",
        requiresWorkedExample: true,
      },
    ],
    requiredTargets: ["KE"],
  },
  {
    // FP-REL-POTENTIAL-ENERGY-001 (AC3.3) / FP-CALC-POTENTIAL-ENERGY-001
    // (AC3.4). GPE = m x g x h; gravitational field strength
    // (g = 9.81 N/kg) is a numeric-constant leaf, exactly as the
    // AC-waveform family already treats sqrt(2) -- never a physical-
    // quantity variable requiring its own learner-supplied binding.
    id: "formula.mechanics_potential_energy",
    assertionFamilyId: "foundational.mechanics_work_energy_power",
    canonicalTarget: "PE",
    variables: [
      { symbol: "PE", name: "gravitational potential energy", quantity: "energy", unitName: "joule", unitSymbol: "J" },
      { symbol: "m", name: "mass", quantity: "mass", unitName: "kilogram", unitSymbol: "kg" },
      { symbol: "h", name: "height", quantity: "length", unitName: "metre", unitSymbol: "m" },
    ],
    forms: [
      {
        target: "PE",
        expression: { operation: "multiply", operands: ["m", 9.81, "h"] },
        instruction: "To find gravitational potential energy, multiply the mass by the gravitational field strength (9.81 N/kg) by the height.",
        requiresWorkedExample: true,
      },
    ],
    requiredTargets: ["PE"],
  },
  {
    // FP-REL-POWER-WORK-TIME-001 (AC3.3) / FP-CALC-POWER-001 (AC3.4).
    // P = W / t, the general-mechanics form electrical.power_
    // relationships' P = V x I later specialises.
    id: "formula.mechanics_power",
    assertionFamilyId: "foundational.mechanics_work_energy_power",
    canonicalTarget: "P",
    variables: [
      { symbol: "P", name: "power", quantity: "power", unitName: "watt", unitSymbol: "W" },
      { symbol: "W", name: "work done (or energy transferred)", quantity: "work_or_energy", unitName: "joule", unitSymbol: "J" },
      { symbol: "t", name: "time taken", quantity: "time", unitName: "second", unitSymbol: "s" },
    ],
    forms: [
      {
        target: "P",
        expression: { operation: "divide", numerator: "W", denominator: "t" },
        instruction: "To find power, divide the work done (or energy transferred) by the time taken.",
        requiresWorkedExample: true,
      },
    ],
    requiredTargets: ["P"],
  },
  {
    // FP-CONCEPT-EFFICIENCY-001 (AC3.3) / FP-CALC-EFFICIENCY-001 (AC3.4)
    // -- the general-mechanics form electrical.energy_and_efficiency's
    // own formula.electrical_efficiency later specialises.
    id: "formula.mechanics_efficiency",
    assertionFamilyId: "foundational.mechanics_work_energy_power",
    canonicalTarget: "eta",
    variables: [
      { symbol: "eta", name: "efficiency", quantity: "efficiency", unitName: "percent", unitSymbol: "%" },
      { symbol: "Eout", name: "useful output", quantity: "energy_or_power", unitName: "joule or watt", unitSymbol: "J/W" },
      { symbol: "Ein", name: "total input", quantity: "energy_or_power", unitName: "joule or watt", unitSymbol: "J/W" },
    ],
    forms: [
      {
        target: "eta",
        expression: { operation: "ratio_percentage", numerator: "Eout", denominator: "Ein" },
        instruction: "To find efficiency, divide the useful output by the total input and express as a percentage.",
        requiresWorkedExample: true,
      },
    ],
    requiredTargets: ["eta"],
  },
  // ===================================================================
  // CC-11.1: Unit 202 LO5 AC5.3 (force-on-conductor-calculation /
  // induced-emf-calculation) -- the two genuine gaps CC-11 found and
  // explicitly deferred. Both are the single governed simple-geometry
  // case only (conductor at right angles to the field / conductor,
  // velocity and field mutually perpendicular) -- no vector maths, no
  // sin(theta), no N-turn coil treatment, matching the governed
  // assertions' own stated scope. Single form each (the canonical
  // target only) -- the governed assertions state only "calculate F"/
  // "calculate e" from the other three quantities, never a rearrangement
  // for B/I/l or B/l/v, so none is invented here.
  // ===================================================================
  {
    id: "formula.force_on_conductor",
    assertionFamilyId: "electrical.magnetism_and_electromagnetism",
    canonicalTarget: "F",
    variables: [
      { symbol: "F", name: "force", quantity: "force", unitName: "newton", unitSymbol: "N" },
      { symbol: "B", name: "magnetic flux density", quantity: "magnetic flux density", unitName: "tesla", unitSymbol: "T" },
      { symbol: "I", name: "current", quantity: "current", unitName: "ampere", unitSymbol: "A" },
      { symbol: "l", name: "conductor length in the field", quantity: "length", unitName: "metre", unitSymbol: "m" },
    ],
    forms: [
      {
        target: "F",
        expression: { operation: "multiply", operands: ["B", "I", "l"] },
        instruction: "To find the force on the conductor, multiply the magnetic flux density by the current, by the length of conductor in the field: F = B x I x l.",
        requiresWorkedExample: true,
      },
    ],
    requiredTargets: ["F"],
  },
  {
    id: "formula.motional_emf",
    assertionFamilyId: "electrical.emf_and_generation",
    canonicalTarget: "e",
    variables: [
      { symbol: "e", name: "induced EMF", quantity: "emf", unitName: "volt", unitSymbol: "V" },
      { symbol: "B", name: "magnetic flux density", quantity: "magnetic flux density", unitName: "tesla", unitSymbol: "T" },
      { symbol: "l", name: "conductor length", quantity: "length", unitName: "metre", unitSymbol: "m" },
      { symbol: "v", name: "conductor velocity", quantity: "speed", unitName: "metre per second", unitSymbol: "m/s" },
    ],
    forms: [
      {
        target: "e",
        expression: { operation: "multiply", operands: ["B", "l", "v"] },
        instruction: "To find the induced EMF, multiply the magnetic flux density by the conductor length, by its velocity: e = B x l x v.",
        requiresWorkedExample: true,
      },
    ],
    requiredTargets: ["e"],
  },
];

const workedExampleBlueprints: WorkedExampleBlueprint[] = [
  // CC-08: foundational.algebraic_technique's own worked examples.
  {
    id: "worked.algebraic_rearrangement_multiplicative.solve_for_factor",
    formulaFamilyId: "formula.algebraic_rearrangement_multiplicative",
    target: "b",
    knownVariables: ["a", "c"],
    steps: ["show_formula", "show_rearrangement", "substitute_values", "calculate", "show_answer_with_unit"],
    teachingValues: { a: 12, c: 4 },
  },
  {
    id: "worked.algebraic_rearrangement_additive.solve_for_term",
    formulaFamilyId: "formula.algebraic_rearrangement_additive",
    target: "b",
    knownVariables: ["a", "c"],
    steps: ["show_formula", "show_rearrangement", "substitute_values", "calculate", "show_answer_with_unit"],
    teachingValues: { a: 15, c: 9 },
  },
  {
    id: "worked.ohms_law.solve_voltage",
    formulaFamilyId: "formula.ohms_law",
    target: "V",
    knownVariables: ["I", "R"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
    // Governed fixed teaching values (V = 24 V, I = 4 A, R = 6 Ω -- V = I x R holds exactly),
    // deliberately shared across all three Ohm's-law worked examples so the
    // learner sees one relationship from multiple directions (design doc §9).
    teachingValues: { I: 4, R: 6 },
  },
  {
    id: "worked.ohms_law.solve_current",
    formulaFamilyId: "formula.ohms_law",
    target: "I",
    knownVariables: ["V", "R"],
    steps: ["show_formula", "show_rearrangement", "substitute_values", "calculate", "show_answer_with_unit"],
    teachingValues: { V: 24, R: 6 },
  },
  {
    id: "worked.ohms_law.solve_resistance",
    formulaFamilyId: "formula.ohms_law",
    target: "R",
    knownVariables: ["V", "I"],
    steps: ["show_formula", "show_rearrangement", "substitute_values", "calculate", "show_answer_with_unit"],
    teachingValues: { V: 24, I: 4 },
  },
  {
    id: "worked.series_resistance.calculate_total",
    formulaFamilyId: "formula.series_resistance",
    target: "Rt",
    knownVariables: ["R1", "R2", "R3"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit", "sanity_check_result"],
  },
  {
    id: "worked.parallel_resistance.calculate_total",
    formulaFamilyId: "formula.parallel_resistance",
    target: "Rt",
    knownVariables: ["R1", "R2", "R3"],
    steps: [
      "show_formula",
      "substitute_values",
      "calculate",
      "show_answer_with_unit",
      "sanity_check_result",
    ],
  },
  {
    id: "worked.power.calculate_from_vi",
    formulaFamilyId: "formula.electrical_power",
    target: "P",
    knownVariables: ["V", "I"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
  },
  {
    id: "worked.power.calculate_from_ir",
    formulaFamilyId: "formula.electrical_power",
    target: "P",
    knownVariables: ["I", "R"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
  },
  {
    id: "worked.energy.calculate_energy",
    formulaFamilyId: "formula.electrical_energy",
    target: "E",
    knownVariables: ["P", "t"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
  },
  {
    id: "worked.efficiency.calculate",
    formulaFamilyId: "formula.electrical_efficiency",
    target: "eta",
    knownVariables: ["Pout", "Pin"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
  },
  {
    id: "worked.charge.calculate_current",
    formulaFamilyId: "formula.charge_current",
    target: "I",
    knownVariables: ["Q", "t"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
  },
  {
    id: "worked.resistivity.calculate_resistance",
    formulaFamilyId: "formula.resistivity",
    target: "R",
    knownVariables: ["rho", "L", "A"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
  },
  {
    id: "worked.waveform.calculate_rms",
    formulaFamilyId: "formula.ac_waveform_relationships",
    target: "rms",
    knownVariables: ["peak"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
  },
  {
    id: "worked.waveform.calculate_frequency",
    formulaFamilyId: "formula.ac_waveform_relationships",
    target: "f",
    knownVariables: ["T"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
  },
  // ===================================================================
  // CC-11 (Workstream A): Unit 202 LO3 worked examples.
  // ===================================================================
  {
    id: "worked.lever_balance.calculate_effort",
    formulaFamilyId: "formula.lever_balance",
    target: "Fe",
    knownVariables: ["Fl", "dl", "de"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
    teachingValues: { Fl: 100, dl: 2, de: 1 },
  },
  {
    id: "worked.mechanics_work.calculate",
    formulaFamilyId: "formula.mechanics_work",
    target: "W",
    knownVariables: ["F", "d"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
    teachingValues: { F: 20, d: 5 },
  },
  {
    id: "worked.mechanics_kinetic_energy.calculate",
    formulaFamilyId: "formula.mechanics_kinetic_energy",
    target: "KE",
    knownVariables: ["m", "v"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
    teachingValues: { m: 4, v: 5 },
  },
  {
    id: "worked.mechanics_potential_energy.calculate",
    formulaFamilyId: "formula.mechanics_potential_energy",
    target: "PE",
    knownVariables: ["m", "h"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
    teachingValues: { m: 4, h: 3 },
  },
  {
    id: "worked.mechanics_power.calculate",
    formulaFamilyId: "formula.mechanics_power",
    target: "P",
    knownVariables: ["W", "t"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
    teachingValues: { W: 200, t: 10 },
  },
  {
    id: "worked.mechanics_efficiency.calculate",
    formulaFamilyId: "formula.mechanics_efficiency",
    target: "eta",
    knownVariables: ["Eout", "Ein"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
    teachingValues: { Eout: 80, Ein: 100 },
  },
  // ===================================================================
  // CC-11.1: LO5 AC5.3 force-on-conductor / motional-EMF worked examples,
  // and the two flux_change_emf worked examples CC-11 identified as
  // missing (formula.flux_change_emf declares requiresWorkedExample:
  // true for targets "e" and "deltaPhi" but neither had a blueprint).
  // ===================================================================
  {
    id: "worked.force_on_conductor.calculate",
    formulaFamilyId: "formula.force_on_conductor",
    target: "F",
    knownVariables: ["B", "I", "l"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
    teachingValues: { B: 0.5, I: 4, l: 0.3 },
  },
  {
    id: "worked.motional_emf.calculate",
    formulaFamilyId: "formula.motional_emf",
    target: "e",
    knownVariables: ["B", "l", "v"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
    teachingValues: { B: 0.5, l: 0.3, v: 2 },
  },
  {
    id: "worked.emf.calculate_flux_change_e",
    formulaFamilyId: "formula.flux_change_emf",
    target: "e",
    knownVariables: ["deltaPhi", "deltaT"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
    teachingValues: { deltaPhi: 6, deltaT: 3 },
  },
  {
    id: "worked.emf.calculate_flux_change_deltaPhi",
    formulaFamilyId: "formula.flux_change_emf",
    target: "deltaPhi",
    knownVariables: ["e", "deltaT"],
    steps: ["show_formula", "substitute_values", "calculate", "show_answer_with_unit"],
    teachingValues: { e: 2, deltaT: 3 },
  },
];

const visualAidBlueprints: VisualAidBlueprint[] = [
  {
    id: "mnemonic.vir_triangle",
    type: "mnemonic",
    formulaFamilyId: "formula.ohms_law",
    renderer: "svg",
    regions: { top: "V", bottom_left: "I", bottom_right: "R" },
    accessibleDescription:
      "A triangle divided into three regions labelled V (top), I (bottom left) and R (bottom right). Covering V shows I x R; covering I shows V / R; covering R shows V / I. The triangle is a learning aid only -- the authoritative relationship is formula.ohms_law.",
  },
  {
    id: "mnemonic.power_triangle",
    type: "mnemonic",
    formulaFamilyId: "formula.electrical_power",
    renderer: "svg",
    regions: { top: "P", bottom_left: "V", bottom_right: "I" },
    accessibleDescription:
      "A triangle divided into three regions labelled P (top), V (bottom left) and I (bottom right). Covering P shows V x I; covering V shows P / I; covering I shows P / V. The triangle is a learning aid only -- the authoritative relationship is formula.electrical_power.",
  },
];

// =======================================================================
// 8. Question blueprints -- pedagogically exhaustive, normalised
//    inventory per assessable family (design doc §17-§19).
// =======================================================================

interface QuestionBlueprintSpec {
  id: string;
  familyId: string;
  capabilityId: string;
  title: string;
  difficultyBand: QuestionBlueprint["difficultyBand"];
  answer: AnswerContract;
  marking: MarkingContract;
  assertionIdentifiers: string[];
  representation?: QuestionBlueprint["representation"];
  variantDimensions?: QuestionBlueprint["variantDimensions"];
  parameterGenerators?: QuestionBlueprint["parameterGenerators"];
  supportingCapabilityIds?: string[];
  representationDependency?: string[];
  misconceptionTargets?: EvidenceTarget["misconceptionTargets"];
  normalisationNote?: string;
  /** Governed learner-facing presentation copy (CC-06D, Correction C) -- required for any blueprint a governed lesson's learner runtime uses; see @alp/content-schema's questionPresentationManifestSchema. */
  presentation?: QuestionBlueprint["presentation"];
  /** CC-09E: this blueprint's classified relationship to official public assessment evidence -- see @alp/content-schema's assessmentStyleEvidenceManifestSchema. Unset for blueprints this package did not examine under this lens. */
  assessmentStyleEvidence?: QuestionBlueprint["assessmentStyleEvidence"];
}

function qb(spec: QuestionBlueprintSpec): QuestionBlueprint {
  return {
    id: spec.id,
    assertionFamilyId: spec.familyId,
    capabilityId: spec.capabilityId,
    title: spec.title,
    representation: spec.representation ?? {},
    variantDimensions: spec.variantDimensions ?? {},
    parameterGenerators: spec.parameterGenerators ?? [],
    answer: spec.answer,
    marking: spec.marking,
    difficultyBand: spec.difficultyBand,
    normalisationNote: spec.normalisationNote,
    presentation: spec.presentation,
    assessmentStyleEvidence: spec.assessmentStyleEvidence,
    evidence: evidence(spec.familyId, spec.capabilityId, spec.assertionIdentifiers, {
      supportingCapabilityIds: spec.supportingCapabilityIds,
      representationDependency: spec.representationDependency,
      misconceptionTargets: spec.misconceptionTargets,
    }),
  };
}

const questionBlueprints: QuestionBlueprint[] = [
  // ===================================================================
  // electrical.si_units (3)
  // ===================================================================
  qb({
    id: "si_units.identify_unit",
    familyId: "electrical.si_units",
    capabilityId: "cap.si_units.identify_unit",
    title: "Identify the SI unit for a given electrical quantity",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["V", "A", "Ω", "W", "J", "Hz"] },
    marking: exact(),
    assertionIdentifiers: [
      "EL-UNIT-VOLT-001",
      "EL-UNIT-AMPERE-001",
      "EL-UNIT-OHM-001",
      "EL-UNIT-WATT-001",
      "EL-UNIT-JOULE-001",
      "EL-UNIT-HERTZ-001",
    ],
    variantDimensions: { quantity: { allowed: ["voltage", "current", "resistance", "power", "energy", "frequency"] } },
    presentation: { promptLines: ["Which SI unit is used to measure {quantity}?"] },
  }),
  qb({
    id: "si_units.distinguish_base_derived",
    familyId: "electrical.si_units",
    capabilityId: "cap.si_units.distinguish_base_derived",
    title: "Distinguish an SI base unit from an SI derived unit",
    difficultyBand: "intermediate",
    answer: { type: "multiple_choice", options: ["base", "derived"] },
    marking: exact(),
    assertionIdentifiers: ["EL-UNIT-BASE-VS-DERIVED-001"],
    presentation: { promptLines: ["Is the {unit} an SI base unit or an SI derived unit?"] },
  }),
  qb({
    id: "si_units.diagnose_unit_confusion",
    familyId: "electrical.si_units",
    capabilityId: "cap.si_units.diagnose_unit_confusion",
    title: "Diagnose confusion between similarly-presented electrical units",
    difficultyBand: "diagnostic",
    answer: { type: "worked_error_classification" },
    marking: enumMarking(),
    assertionIdentifiers: ["EL-UNIT-VOLT-001", "EL-UNIT-OHM-001"],
    misconceptionTargets: [
      { misconceptionIdentifier: "MIS-EL-UNIT-CONFUSION-001", evidenceStrength: "direct" },
      { misconceptionIdentifier: "MIS-EL-SI-PREFIX-ERROR-001", evidenceStrength: "suggestive" },
    ],
    presentation: { promptLines: ["A learner keeps mixing up {confused_pair_label}.", "Which kind of unit confusion is this?"] },
  }),

  // ===================================================================
  // electrical.core_quantities (2)
  // ===================================================================
  qb({
    id: "core_quantities.recognise_from_definition",
    familyId: "electrical.core_quantities",
    capabilityId: "cap.core_quantities.recognise",
    title: "Recognise voltage, current or resistance from its definition",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["voltage", "current", "resistance"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CONCEPT-VOLTAGE-001", "EL-CONCEPT-CURRENT-001", "EL-CONCEPT-RESISTANCE-001"],
    presentation: { promptLines: ["Which quantity is defined as: {definition_clause}?"] },
  }),
  qb({
    id: "core_quantities.diagnose_current_voltage_confusion",
    familyId: "electrical.core_quantities",
    capabilityId: "cap.core_quantities.distinguish",
    title: "Diagnose confusion between current and voltage",
    difficultyBand: "diagnostic",
    answer: { type: "worked_error_classification" },
    marking: enumMarking(),
    assertionIdentifiers: ["EL-CONCEPT-VOLTAGE-001", "EL-CONCEPT-CURRENT-001"],
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-CURRENT-VOLTAGE-CONFUSION-001", evidenceStrength: "direct" }],
    presentation: { promptLines: ["{scenario_text}", "Which misconception does this reveal?"] },
  }),

  // ===================================================================
  // electrical.ohms_law (10)
  // ===================================================================
  qb({
    id: "ohms_law.solve_for_voltage",
    familyId: "electrical.ohms_law",
    capabilityId: "cap.ohms_law.solve_for_voltage",
    title: "Solve for voltage given current and resistance",
    difficultyBand: "introductory",
    answer: quantityAnswer("voltage", "volt"),
    marking: tolerance(1),
    assertionIdentifiers: ["EL-OHM-SOLVE-V-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.ohms_law" } },
    supportingCapabilityIds: ["cap.ohms_law.apply_substitution"],
    presentation: { promptLines: ["I = {I} A", "R = {R} Ω"] },
  }),
  qb({
    id: "ohms_law.solve_for_current",
    familyId: "electrical.ohms_law",
    capabilityId: "cap.ohms_law.solve_for_current",
    title: "Solve for current given voltage and resistance",
    difficultyBand: "introductory",
    answer: quantityAnswer("current", "ampere"),
    marking: tolerance(1),
    assertionIdentifiers: ["EL-OHM-SOLVE-I-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.ohms_law" } },
    supportingCapabilityIds: ["cap.ohms_law.apply_substitution"],
    presentation: { promptLines: ["V = {V} V", "R = {R} Ω"] },
  }),
  qb({
    id: "ohms_law.solve_for_resistance",
    familyId: "electrical.ohms_law",
    capabilityId: "cap.ohms_law.solve_for_resistance",
    title: "Solve for resistance given voltage and current",
    difficultyBand: "intermediate",
    answer: quantityAnswer("resistance", "ohm"),
    marking: tolerance(1),
    assertionIdentifiers: ["EL-OHM-SOLVE-R-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.ohms_law" } },
    supportingCapabilityIds: ["cap.ohms_law.apply_substitution"],
    presentation: { promptLines: ["V = {V} V", "I = {I} A"] },
  }),
  qb({
    id: "ohms_law.select_rearrangement",
    familyId: "electrical.ohms_law",
    capabilityId: "cap.ohms_law.select_rearrangement",
    title: "Select the correct rearrangement of V = I x R for the target quantity",
    difficultyBand: "intermediate",
    answer: { type: "formula_selection" },
    marking: enumMarking(),
    assertionIdentifiers: ["EL-OHM-SELECT-RELATIONSHIP-001"],
    supportingCapabilityIds: ["cap.ohms_law.recognise_relationship"],
    variantDimensions: { target_variable: { allowed: ["V", "I", "R"] } },
    normalisationNote:
      "One blueprint with target_variable as a variant dimension, rather than three separate select-rearrangement blueprints, since the selection skill being assessed is identical regardless of which variable is unknown.",
    presentation: { promptLines: ["V = {V} V", "I = {I} A", "R = {R} Ω"] },
  }),
  qb({
    id: "ohms_law.match_variables_units",
    familyId: "electrical.ohms_law",
    capabilityId: "cap.ohms_law.apply_correct_unit",
    title: "Match each Ohm's-law variable to its correct SI unit",
    difficultyBand: "introductory",
    answer: { type: "multi_select" },
    marking: { type: "set_equality" },
    assertionIdentifiers: ["EL-OHM-RELATIONSHIP-001"],
    supportingCapabilityIds: ["cap.si_units.identify_unit"],
    presentation: { promptLines: ["V = {V} V", "I = {I} A", "R = {R} Ω"] },
  }),
  qb({
    id: "ohms_law.substitution",
    familyId: "electrical.ohms_law",
    capabilityId: "cap.ohms_law.apply_substitution",
    title: "Substitute known values into a chosen Ohm's-law rearrangement, showing intermediate working",
    difficultyBand: "introductory",
    answer: quantityAnswer("voltage", "volt"),
    marking: tolerance(1),
    assertionIdentifiers: ["FM-ALG-SUBSTITUTION-001", "EL-OHM-SOLVE-V-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.ohms_law" } },
    representationDependency: ["worked_example"],
  }),
  qb({
    id: "ohms_law.diagnose_rearrangement_error",
    familyId: "electrical.ohms_law",
    capabilityId: "cap.ohms_law.diagnose_rearrangement_error",
    title: "Diagnose an incorrect algebraic rearrangement of V = I x R",
    difficultyBand: "diagnostic",
    answer: { type: "worked_error_classification", options: ["wrong_operation", "rearrangement_error", "unrelated_symbols", "no_error"] },
    marking: enumMarking(),
    assertionIdentifiers: ["EL-OHM-REARRANGE-001"],
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-OHM-REARRANGE-ERROR-001", evidenceStrength: "direct" }],
    presentation: {
      promptLines: ["A learner was asked to find resistance (R) from a known voltage and current:", "V = {V} V", "I = {I} A"],
      shownWorkingLines: ["V = {V} V, I = {I} A", "R = I / V = {shown_R} Ω"],
      answerOptionLabels: {
        wrong_operation: "Used the wrong operation (multiplied instead of divided, or vice versa)",
        rearrangement_error: "Rearranged the formula incorrectly",
        unrelated_symbols: "Substituted an unrelated value",
        no_error: "The working shown is actually correct",
      },
    },
  }),
  qb({
    id: "ohms_law.diagnose_wrong_operation",
    familyId: "electrical.ohms_law",
    capabilityId: "cap.ohms_law.diagnose_wrong_operation",
    title: "Diagnose use of the wrong arithmetic operation when applying V = I x R",
    difficultyBand: "diagnostic",
    answer: { type: "worked_error_classification", options: ["wrong_operation", "rearrangement_error", "unrelated_symbols", "no_error"] },
    marking: enumMarking(),
    assertionIdentifiers: ["EL-OHM-RELATIONSHIP-001"],
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-OHM-WRONG-OPERATION-001", evidenceStrength: "direct" }],
    presentation: {
      promptLines: ["A learner was asked to find current (I) from a known voltage and resistance:", "V = {V} V", "R = {R} Ω"],
      shownWorkingLines: ["V = {V} V, R = {R} Ω", "I = V x R = {shown_I} A"],
      answerOptionLabels: {
        wrong_operation: "Used the wrong operation (multiplied instead of divided, or vice versa)",
        rearrangement_error: "Rearranged the formula incorrectly",
        unrelated_symbols: "Substituted an unrelated value",
        no_error: "The working shown is actually correct",
      },
    },
  }),
  qb({
    id: "ohms_law.diagnose_unrelated_symbols",
    familyId: "electrical.ohms_law",
    capabilityId: "cap.ohms_law.diagnose_unrelated_symbols",
    title: "Diagnose substitution of an unrelated quantity's value into V = I x R",
    difficultyBand: "diagnostic",
    answer: { type: "worked_error_classification" },
    marking: enumMarking(),
    assertionIdentifiers: ["EL-OHM-RELATIONSHIP-001"],
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-OHM-UNRELATED-SYMBOLS-001", evidenceStrength: "direct" }],
  }),
  qb({
    id: "ohms_law.plausibility_check",
    familyId: "electrical.ohms_law",
    capabilityId: "cap.ohms_law.check_plausibility",
    title: "Judge whether a calculated Ohm's-law result is physically plausible",
    difficultyBand: "advanced",
    answer: { type: "multiple_choice", options: ["plausible", "too_high", "too_low"] },
    marking: exact(),
    assertionIdentifiers: ["EL-OHM-RELATIONSHIP-001"],
    presentation: {
      promptLines: ["I = {I} A", "R = {R} Ω", "A calculated voltage of {shown_V} V was reported."],
      answerOptionLabels: { plausible: "Plausible", too_high: "Too high", too_low: "Too low" },
    },
  }),

  // ===================================================================
  // electrical.resistivity (5)
  // ===================================================================
  qb({
    id: "resistivity.recognise",
    familyId: "electrical.resistivity",
    capabilityId: "cap.resistivity.recognise",
    title: "Recognise resistivity as a material property independent of conductor dimensions",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["resistance", "resistivity"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CONCEPT-RESISTIVITY-001"],
    presentation: { promptLines: ["Which term describes this: {recognise_clue}?"] },
  }),
  qb({
    id: "resistivity.calculate_resistance",
    familyId: "electrical.resistivity",
    capabilityId: "cap.resistivity.calculate",
    title: "Calculate resistance from resistivity, length and cross-sectional area",
    difficultyBand: "advanced",
    answer: quantityAnswer("resistance", "ohm"),
    marking: tolerance(2),
    assertionIdentifiers: ["EL-RESISTIVITY-RELATIONSHIP-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.resistivity" } },
    presentation: { promptLines: ["ρ = {rho} Ω·m", "L = {L} m", "A = {A} m²"] },
  }),
  qb({
    id: "resistivity.compare_materials",
    familyId: "electrical.resistivity",
    capabilityId: "cap.resistivity.compare_materials",
    title: "Compare the resistivity of different materials to determine the better conductor",
    difficultyBand: "intermediate",
    answer: { type: "multiple_choice", options: ["material_a", "material_b"] },
    marking: exact(),
    assertionIdentifiers: ["EL-RESISTIVITY-COMPARE-MATERIALS-001"],
    presentation: {
      promptLines: [
        "Material A has a resistivity of {resistivity_a} Ω·m.",
        "Material B has a resistivity of {resistivity_b} Ω·m.",
        "Which material is the better conductor?",
      ],
    },
  }),
  qb({
    id: "resistivity.predict_length_effect",
    familyId: "electrical.resistivity",
    capabilityId: "cap.resistivity.predict_length_effect",
    title: "Predict the effect of increasing conductor length on resistance",
    difficultyBand: "intermediate",
    answer: { type: "direction", canonicalUnit: undefined },
    marking: exact(),
    assertionIdentifiers: ["EL-RESISTIVITY-LENGTH-EFFECT-001"],
    presentation: { promptLines: ["A conductor's length is increased while its material and cross-sectional area stay the same.", "What happens to its resistance?"] },
  }),
  qb({
    id: "resistivity.predict_area_effect",
    familyId: "electrical.resistivity",
    capabilityId: "cap.resistivity.predict_area_effect",
    title: "Predict the effect of increasing conductor cross-sectional area on resistance",
    difficultyBand: "intermediate",
    answer: { type: "direction" },
    marking: exact(),
    assertionIdentifiers: ["EL-RESISTIVITY-AREA-EFFECT-001"],
    presentation: { promptLines: ["A conductor's cross-sectional area is increased while its material and length stay the same.", "What happens to its resistance?"] },
  }),

  // ===================================================================
  // electrical.series_circuits (10)
  // ===================================================================
  qb({
    id: "series.calculate_total_resistance",
    familyId: "electrical.series_circuits",
    capabilityId: "cap.series.calculate_total_resistance",
    title: "Calculate total resistance of resistors connected in series",
    difficultyBand: "introductory",
    answer: quantityAnswer("resistance", "ohm"),
    marking: tolerance(1),
    assertionIdentifiers: ["EL-SERIES-RESISTANCE-CALC-001"],
    representation: {
      formula: { required: true, formulaFamilyId: "formula.series_resistance" },
      diagram: { required: true, blueprintId: "circuit.series_resistors" },
    },
    variantDimensions: { component_count: { allowed: [2, 3, 4] } },
    parameterGenerators: [{ variable: "R1", min: 1, max: 100, constraints: ["positive", "pedagogically_sensible"] }],
    // Component count varies (2-4); only {component_count} is guaranteed
    // present on every generated instance (packages/calculation-engine/src/
    // families/series-resistance.ts's calculateTotalResistance), so the
    // individual R1..R4 values are read from the diagram, never templated.
    presentation: { promptLines: ["The series circuit shown has {component_count} resistors."] },
    // CC-09E.2 (Project Architect correction): assessmentStyleEvidence
    // deliberately left undeclared. CC-09E originally cited item 27 (a
    // factual error -- item 27's diagram is actually a three-branch
    // PARALLEL circuit, matching item 23's topology); CC-09E.1 corrected
    // this to item 22 (a genuine series-circuit voltage-divider, three
    // resistors in series, individually voltmetered), but on further
    // review item 22's own REQUESTED answer is an individual resistor's
    // voltage (V1), not the total series resistance -- the total is only
    // ever computed as an internal intermediate step toward that answer,
    // never itself the grammar the sample tests. DIRECT_SAMPLE_ANALOGUE
    // requires the sample to directly demonstrate the SAME requested-
    // answer grammar for the SAME knowledge target, not merely use it as
    // an intermediate operation inside a materially different question
    // (see the regression test in prove-question-archetypes.test.ts
    // guarding against exactly this). No sample item in the official
    // public 2365-602 sample asks for total series resistance as its own
    // final requested answer (unlike item 25, which does ask this
    // directly for a parallel circuit -- see parallel.calculate_total).
    // This blueprint remains valid, governed practice regardless --
    // "no direct sample analogue" is not itself a defect, only an
    // honestly narrower evidence claim than CC-09E/CC-09E.1 made.
  }),
  qb({
    id: "series.solve_missing_component",
    familyId: "electrical.series_circuits",
    capabilityId: "cap.series.solve_missing_component",
    title: "Solve for a missing series component resistance given the total and the other components",
    difficultyBand: "advanced",
    answer: quantityAnswer("resistance", "ohm"),
    marking: tolerance(1),
    assertionIdentifiers: ["EL-SERIES-RESISTANCE-001", "FM-ALG-TRANSPOSE-ADD-001"],
    representation: { diagram: { required: true, blueprintId: "circuit.series_resistors" } },
    variantDimensions: { component_count: { allowed: [2, 3, 4] }, target: { allowed: ["choose_from_components"] } },
    normalisationNote:
      "A single blueprint with the unknown component chosen by the generator, rather than a separate find_R1/find_R2/find_R3 blueprint per component -- the assessed skill is identical regardless of which component is unknown.",
    // {Rt} and {target} are always present regardless of component_count
    // or which component is missing (solveMissingComponent); individual
    // Ri values are read from the diagram.
    presentation: {
      promptLines: [
        "This series circuit has {component_count} resistors with a total resistance of {Rt} Ω.",
        "Find the resistance of {target} (rearrange RT = R1 + R2 + ... to isolate it).",
      ],
    },
  }),
  qb({
    id: "series.calculate_supply_current",
    familyId: "electrical.series_circuits",
    capabilityId: "cap.series.calculate_supply_current",
    title: "Calculate supply current in a series circuit from supply voltage and total resistance",
    difficultyBand: "intermediate",
    answer: quantityAnswer("current", "ampere"),
    marking: tolerance(1),
    assertionIdentifiers: ["EL-CIRCUIT-SUPPLY-CURRENT-SERIES-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.ohms_law" } },
    presentation: { promptLines: ["V = {V} V", "Rt = {Rt} Ω"] },
  }),
  qb({
    id: "series.calculate_voltage_drop",
    familyId: "electrical.series_circuits",
    capabilityId: "cap.series.calculate_voltage_drop",
    title: "Calculate an individual voltage drop across a component in a series circuit",
    difficultyBand: "intermediate",
    answer: quantityAnswer("voltage", "volt"),
    marking: tolerance(1),
    // CC-11.1: additive evidence-citation fix -- calculating a voltage
    // drop functionally demonstrates understanding what "voltage drop"
    // means (AC4.7's own obligation), previously uncited here.
    assertionIdentifiers: ["EL-SERIES-VOLTAGE-CALC-001", "EL-VOLTAGE-DROP-001"],
    representation: { diagram: { required: true, blueprintId: "circuit.series_resistors" } },
    presentation: {
      promptLines: ["This series circuit carries {I} A throughout.", "Using the diagram, find the voltage drop across {target}."],
    },
  }),
  qb({
    id: "series.calculate_power",
    familyId: "electrical.series_circuits",
    capabilityId: "cap.series.calculate_power",
    title: "Calculate the power dissipated by an individual component in a series circuit",
    difficultyBand: "advanced",
    answer: quantityAnswer("power", "watt"),
    marking: tolerance(2),
    assertionIdentifiers: ["EL-SERIES-POWER-CALC-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.electrical_power" } },
  }),
  qb({
    id: "series.predict_add_component_effect",
    familyId: "electrical.series_circuits",
    capabilityId: "cap.series.predict_add_component",
    title: "Predict the effect on supply current of adding a component in series",
    difficultyBand: "intermediate",
    answer: { type: "direction" },
    marking: exact(),
    assertionIdentifiers: ["EL-SERIES-PREDICT-ADD-RESISTOR-001"],
  }),
  qb({
    id: "series.predict_open_circuit_effect",
    familyId: "electrical.series_circuits",
    capabilityId: "cap.series.predict_open_circuit",
    title: "Predict the effect on current if a series circuit is broken at any point",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["current_stops_everywhere", "current_continues_elsewhere", "no_effect"] },
    marking: exact(),
    assertionIdentifiers: ["EL-SERIES-PREDICT-OPEN-001"],
  }),
  qb({
    id: "series.detect_incorrect_total",
    familyId: "electrical.series_circuits",
    capabilityId: "cap.series.check_plausibility",
    title: "Detect an implausible series total-resistance result",
    difficultyBand: "diagnostic",
    answer: { type: "multiple_choice", options: ["plausible", "implausible"] },
    marking: exact(),
    assertionIdentifiers: ["EL-INTERPRET-SERIES-RESULT-001"],
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-SERIES-PARALLEL-CONFUSION-001", evidenceStrength: "suggestive" }],
    presentation: {
      promptLines: [
        "This series circuit has {component_count} resistors (see diagram).",
        "A calculated total resistance of {shown_total} Ω was reported. Is this plausible?",
      ],
      answerOptionLabels: { plausible: "Plausible", implausible: "Implausible" },
    },
  }),
  qb({
    id: "series.identify_dominant_component",
    familyId: "electrical.series_circuits",
    capabilityId: "cap.series.identify_dominant_component",
    title: "Identify which series component has the greatest voltage drop/power dissipation",
    difficultyBand: "advanced",
    answer: { type: "multiple_choice", options: ["R1", "R2", "R3"] },
    marking: exact(),
    assertionIdentifiers: ["EL-SERIES-DOMINANT-RESISTOR-001"],
    representation: { diagram: { required: true, blueprintId: "circuit.series_resistors" } },
  }),
  qb({
    id: "series.interpret_diagram",
    familyId: "electrical.series_circuits",
    capabilityId: "cap.series.recognise_structure",
    title: "Recognise a series circuit from a circuit diagram",
    difficultyBand: "introductory",
    answer: { type: "diagram_region" },
    marking: exact(),
    assertionIdentifiers: ["EL-CIRCUIT-SERIES-STRUCTURE-001"],
    representation: { diagram: { required: true, blueprintId: "circuit.series_resistors" } },
    presentation: { promptLines: ["Look at the circuit diagram.", "Select the part that shows every component connected in one single loop (series)."] },
  }),

  // ===================================================================
  // electrical.parallel_circuits (11)
  // ===================================================================
  qb({
    id: "parallel.calculate_total",
    familyId: "electrical.parallel_circuits",
    capabilityId: "cap.parallel.calculate_total_resistance",
    title: "Calculate total resistance of resistors connected in parallel",
    difficultyBand: "intermediate",
    answer: quantityAnswer("resistance", "ohm"),
    marking: tolerance(2),
    assertionIdentifiers: ["EL-PARALLEL-RESISTANCE-CALC-001"],
    representation: {
      formula: { required: true, formulaFamilyId: "formula.parallel_resistance" },
      diagram: { required: true, blueprintId: "circuit.parallel_resistors" },
    },
    variantDimensions: { branch_count: { allowed: [2, 3, 4] } },
    parameterGenerators: [{ variable: "R1", min: 1, max: 100, constraints: ["positive", "pedagogically_sensible"] }],
    presentation: { promptLines: ["The parallel circuit shown has {branch_count} branches."] },
    // CC-09E: the official public 2365-602 sample directly demonstrates
    // this exact grammar (parallel-circuit diagram + total-resistance
    // calculation) across several items (e.g. sample item 25). No source
    // wording retained -- item reference only.
    assessmentStyleEvidence: {
      classification: "DIRECT_SAMPLE_ANALOGUE",
      sourceItemRef: "2365-602-sample-v1:item-25",
      note: "Sample item 25 (parallel-circuit total-resistance calculation from a diagram) demonstrates this exact operation/representation for this same knowledge target.",
    },
  }),
  qb({
    id: "parallel.solve_missing_branch",
    familyId: "electrical.parallel_circuits",
    capabilityId: "cap.parallel.solve_missing_branch",
    title: "Solve for a missing parallel branch resistance given the total and the other branches",
    difficultyBand: "advanced",
    answer: quantityAnswer("resistance", "ohm"),
    marking: tolerance(2),
    // CC-08: FM-ALG-TRANSPOSE-ADD-001 added -- isolating the unknown
    // branch (1/Rx = 1/Rt - sum of the known branches' reciprocals) is
    // genuine additive-relationship rearrangement, the same technique
    // series.solve_missing_component already cites, not only reciprocal
    // arithmetic. See the matching cc04 knowledge-graph prereq added to
    // EL-PARALLEL-RESISTANCE-CALC-001.
    assertionIdentifiers: ["EL-PARALLEL-RESISTANCE-001", "FM-ARITH-RECIPROCAL-SUM-001", "FM-ARITH-RECIPROCAL-INVERT-001", "FM-ALG-TRANSPOSE-ADD-001"],
    representation: { diagram: { required: true, blueprintId: "circuit.parallel_resistors" } },
    variantDimensions: { branch_count: { allowed: [2, 3] }, target: { allowed: ["choose_from_branches"] } },
    normalisationNote:
      "A single blueprint with the unknown branch chosen by the generator (design doc §18), rather than a separate find_R1_given_Rt_R2 / find_R2_given_Rt_R1 blueprint pair -- the assessed skill is identical regardless of which branch is unknown.",
    presentation: {
      promptLines: [
        "This parallel circuit has {branch_count} branches with a total resistance of {Rt} Ω.",
        "Find the resistance of {target}.",
      ],
    },
  }),
  qb({
    id: "parallel.identify_topology",
    familyId: "electrical.parallel_circuits",
    capabilityId: "cap.parallel.recognise_structure",
    title: "Recognise a parallel circuit from a circuit diagram",
    difficultyBand: "introductory",
    answer: { type: "diagram_region" },
    marking: exact(),
    assertionIdentifiers: ["EL-CIRCUIT-PARALLEL-STRUCTURE-001"],
    representation: { diagram: { required: true, blueprintId: "circuit.parallel_resistors" } },
    presentation: { promptLines: ["Look at the circuit diagram.", "Select the part that shows multiple branches connected across the same two points (parallel)."] },
  }),
  qb({
    id: "parallel.predict_add_branch_effect",
    familyId: "electrical.parallel_circuits",
    capabilityId: "cap.parallel.predict_add_branch",
    title: "Predict the effect on supply current of adding a branch in parallel",
    difficultyBand: "intermediate",
    answer: { type: "direction" },
    marking: exact(),
    assertionIdentifiers: ["EL-PARALLEL-PREDICT-ADD-RESISTOR-001"],
  }),
  qb({
    id: "parallel.predict_open_branch_effect",
    familyId: "electrical.parallel_circuits",
    capabilityId: "cap.parallel.predict_open_branch",
    title: "Predict the effect on the remaining branches if one parallel branch is broken",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["other_branches_unaffected", "all_current_stops", "other_branches_stop"] },
    marking: exact(),
    assertionIdentifiers: ["EL-PARALLEL-PREDICT-OPEN-001"],
  }),
  qb({
    id: "parallel.calculate_branch_current",
    familyId: "electrical.parallel_circuits",
    capabilityId: "cap.parallel.calculate_branch_current",
    title: "Calculate an individual branch current in a parallel circuit",
    difficultyBand: "intermediate",
    answer: quantityAnswer("current", "ampere"),
    marking: tolerance(1),
    assertionIdentifiers: ["EL-PARALLEL-CURRENT-CALC-001"],
    representation: {
      formula: { required: true, formulaFamilyId: "formula.ohms_law" },
      diagram: { required: true, blueprintId: "circuit.parallel_resistors" },
    },
    presentation: { promptLines: ["The parallel circuit's supply voltage is {V} V.", "Using the diagram, find the current in branch {target}."] },
  }),
  qb({
    id: "parallel.calculate_power",
    familyId: "electrical.parallel_circuits",
    capabilityId: "cap.parallel.calculate_power",
    title: "Calculate the power dissipated by an individual branch in a parallel circuit",
    difficultyBand: "advanced",
    answer: quantityAnswer("power", "watt"),
    marking: tolerance(2),
    assertionIdentifiers: ["EL-PARALLEL-POWER-CALC-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.electrical_power" } },
  }),
  qb({
    id: "parallel.identify_dominant_branch",
    familyId: "electrical.parallel_circuits",
    capabilityId: "cap.parallel.identify_dominant_branch",
    title: "Identify which parallel branch carries the largest current/dissipates the most power",
    difficultyBand: "advanced",
    answer: { type: "multiple_choice", options: ["R1", "R2", "R3"] },
    marking: exact(),
    assertionIdentifiers: ["EL-PARALLEL-DOMINANT-RESISTOR-001"],
    representation: { diagram: { required: true, blueprintId: "circuit.parallel_resistors" } },
  }),
  qb({
    id: "parallel.detect_impossible_total",
    familyId: "electrical.parallel_circuits",
    capabilityId: "cap.parallel.check_plausibility",
    title: "Detect an impossible parallel total-resistance result",
    difficultyBand: "diagnostic",
    answer: { type: "multiple_choice", options: ["plausible", "impossible"] },
    marking: exact(),
    assertionIdentifiers: ["EL-INTERPRET-PARALLEL-RESULT-001"],
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-PARALLEL-RESISTANCE-ADDITION-001", evidenceStrength: "suggestive" }],
    presentation: {
      promptLines: [
        "This parallel circuit has {branch_count} branches (see diagram).",
        "A calculated total resistance of {shown_total} Ω was reported. Is this possible?",
      ],
      answerOptionLabels: { plausible: "Possible", impossible: "Impossible" },
    },
  }),
  qb({
    id: "parallel.diagnose_reciprocal_error",
    familyId: "electrical.parallel_circuits",
    capabilityId: "cap.parallel.diagnose_reciprocal_error",
    title: "Diagnose the error of adding parallel branch resistances directly",
    difficultyBand: "diagnostic",
    answer: { type: "worked_error_classification" },
    marking: enumMarking(),
    assertionIdentifiers: ["EL-PARALLEL-RESISTANCE-001"],
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-PARALLEL-RESISTANCE-ADDITION-001", evidenceStrength: "direct" }],
    presentation: {
      promptLines: ["A learner calculated the total resistance of this {branch_count}-branch parallel circuit (see diagram)."],
      shownWorkingLines: ["Rt = R1 + R2 + ... = {shown_total} Ω"],
    },
  }),
  qb({
    id: "parallel.diagnose_missing_final_inversion",
    familyId: "electrical.parallel_circuits",
    capabilityId: "cap.parallel.diagnose_missing_final_inversion",
    title: "Diagnose the error of leaving the parallel-resistance result as a reciprocal instead of inverting it back",
    difficultyBand: "diagnostic",
    answer: { type: "worked_error_classification" },
    marking: enumMarking(),
    assertionIdentifiers: ["EL-PARALLEL-RESISTANCE-CALC-001", "FM-ARITH-RECIPROCAL-INVERT-001"],
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-RECIPROCAL-FORGOTTEN-INVERT-001", evidenceStrength: "direct" }],
    presentation: {
      promptLines: ["A learner calculated the total resistance of this {branch_count}-branch parallel circuit (see diagram)."],
      shownWorkingLines: ["1/Rt = 1/R1 + 1/R2 + ... = {shown_total} (left un-inverted)"],
    },
  }),

  // ===================================================================
  // electrical.series_vs_parallel_comparison (6)
  // ===================================================================
  qb({
    id: "comparison.identify_topology",
    familyId: "electrical.series_vs_parallel_comparison",
    capabilityId: "cap.comparison.identify_topology",
    title: "Identify whether a given circuit is connected in series or parallel",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["series", "parallel"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CIRCUIT-SELECT-CONFIGURATION-001"],
    representation: { diagram: { required: true, blueprintId: "circuit.series_parallel_mixed" } },
    presentation: { promptLines: ["Look at the circuit diagram.", "Is this circuit's overall arrangement series or parallel?"] },
  }),
  qb({
    id: "comparison.recognise_mixed_circuit",
    familyId: "electrical.series_vs_parallel_comparison",
    capabilityId: "cap.comparison.recognise_mixed_circuit",
    title: "Recognise a circuit combining both series and parallel sections",
    difficultyBand: "advanced",
    answer: { type: "multiple_choice", options: ["series", "parallel", "mixed"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CIRCUIT-MIXED-SERIES-PARALLEL-RECOGNITION-001"],
    representation: { diagram: { required: true, blueprintId: "circuit.series_parallel_mixed" } },
    presentation: { promptLines: ["Look at the circuit diagram.", "Is it wired in series, parallel, or a mix of both?"] },
  }),
  qb({
    id: "comparison.trace_current_path",
    familyId: "electrical.series_vs_parallel_comparison",
    capabilityId: "cap.comparison.trace_current_path",
    title: "Trace the path(s) current takes through a circuit diagram",
    difficultyBand: "intermediate",
    answer: { type: "diagram_region" },
    marking: exact(),
    assertionIdentifiers: ["EL-CIRCUIT-TRACE-CURRENT-PATH-001"],
    representation: { diagram: { required: true, blueprintId: "circuit.series_parallel_mixed" } },
    presentation: { promptLines: ["Look at the circuit diagram.", "Trace the path(s) current takes from the supply and back."] },
  }),
  qb({
    id: "comparison.compare_resistance",
    familyId: "electrical.series_vs_parallel_comparison",
    capabilityId: "cap.comparison.compare_resistance",
    title: "Compare total resistance of the same resistor set connected in series versus parallel",
    difficultyBand: "intermediate",
    answer: { type: "multiple_choice", options: ["series_higher", "parallel_higher", "equal"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CIRCUIT-COMPARE-RESISTANCE-001"],
    presentation: {
      promptLines: ["Take the same set of two or more resistors.", "Is their total resistance higher when connected in series, or when connected in parallel?"],
    },
  }),
  qb({
    id: "comparison.compare_current_voltage",
    familyId: "electrical.series_vs_parallel_comparison",
    capabilityId: "cap.comparison.compare_current_voltage",
    title: "Compare current and voltage behaviour between series and parallel circuits",
    difficultyBand: "intermediate",
    answer: { type: "multiple_choice", options: ["series_behaviour", "parallel_behaviour"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CIRCUIT-COMPARE-CURRENT-001", "EL-CIRCUIT-COMPARE-VOLTAGE-001"],
    presentation: { promptLines: ["{pattern_text}", "Is this series behaviour or parallel behaviour?"] },
  }),
  qb({
    id: "comparison.compare_power_energy",
    familyId: "electrical.series_vs_parallel_comparison",
    capabilityId: "cap.comparison.compare_power_energy",
    title: "Compare total power/energy of the same resistor set connected in series versus parallel",
    difficultyBand: "advanced",
    answer: { type: "multiple_choice", options: ["series_higher", "parallel_higher", "equal"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CIRCUIT-COMPARE-POWER-001", "EL-CIRCUIT-COMPARE-ENERGY-001"],
    presentation: {
      promptLines: [
        "Take the same set of two or more resistors, connected to the same supply voltage.",
        "Is their total power/energy higher when connected in series, or when connected in parallel?",
      ],
    },
  }),

  // ===================================================================
  // electrical.power_relationships (6)
  // ===================================================================
  qb({
    id: "power.recognise_relationship",
    familyId: "electrical.power_relationships",
    capabilityId: "cap.power.recognise_relationship",
    title: "Recognise that electrical power is related to voltage and current by P = V x I",
    difficultyBand: "introductory",
    answer: { type: "formula_selection" },
    marking: enumMarking(),
    assertionIdentifiers: ["EL-POWER-RELATIONSHIP-001"],
    presentation: { promptLines: ["Which formula correctly relates electrical power P to voltage V and current I?"] },
  }),
  qb({
    id: "power.select_form",
    familyId: "electrical.power_relationships",
    capabilityId: "cap.power.select_form",
    title: "Select which form of the power relationship to use, based on which quantities are known",
    difficultyBand: "intermediate",
    answer: { type: "formula_selection" },
    marking: enumMarking(),
    assertionIdentifiers: ["EL-POWER-REARRANGE-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.electrical_power" } },
    presentation: { promptLines: ["The known quantities are: {known}.", "Which form of the power relationship should be used to find the missing quantity?"] },
  }),
  qb({
    id: "power.calculate_from_vi",
    familyId: "electrical.power_relationships",
    capabilityId: "cap.power.calculate_from_vi",
    title: "Calculate power from known voltage and current",
    difficultyBand: "introductory",
    answer: quantityAnswer("power", "watt"),
    marking: tolerance(1),
    assertionIdentifiers: ["EL-POWER-SOLVE-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.electrical_power" } },
    presentation: { promptLines: ["V = {V} V", "I = {I} A"] },
  }),
  qb({
    id: "power.calculate_from_ir",
    familyId: "electrical.power_relationships",
    capabilityId: "cap.power.calculate_from_ir",
    title: "Calculate power from known current and resistance",
    difficultyBand: "intermediate",
    answer: quantityAnswer("power", "watt"),
    marking: tolerance(1),
    assertionIdentifiers: ["EL-POWER-SOLVE-IR-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.electrical_power" } },
    presentation: { promptLines: ["I = {I} A", "R = {R} Ω"] },
  }),
  qb({
    id: "power.calculate_from_vr",
    familyId: "electrical.power_relationships",
    capabilityId: "cap.power.calculate_from_vr",
    title: "Calculate power from known voltage and resistance",
    difficultyBand: "intermediate",
    answer: quantityAnswer("power", "watt"),
    marking: tolerance(1),
    assertionIdentifiers: ["EL-POWER-SOLVE-V2R-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.electrical_power" } },
    presentation: { promptLines: ["V = {V} V", "R = {R} Ω"] },
  }),
  qb({
    id: "power.calculate_total",
    familyId: "electrical.power_relationships",
    capabilityId: "cap.power.calculate_total",
    title: "Calculate total circuit power as the sum of individual component powers",
    difficultyBand: "advanced",
    answer: quantityAnswer("power", "watt"),
    marking: tolerance(2),
    assertionIdentifiers: ["EL-CIRCUIT-POWER-TOTAL-001"],
    presentation: { promptLines: ["This circuit has {component_count} components.", "Individual power values: {summary}", "Calculate the total power."] },
  }),

  // ===================================================================
  // electrical.energy_and_efficiency (4)
  // ===================================================================
  qb({
    id: "energy.calculate_energy",
    familyId: "electrical.energy_and_efficiency",
    capabilityId: "cap.energy.calculate_energy",
    title: "Calculate electrical energy transferred from power and time",
    difficultyBand: "introductory",
    answer: quantityAnswer("energy", "joule"),
    marking: tolerance(1),
    assertionIdentifiers: ["EL-ENERGY-CALC-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.electrical_energy" } },
    presentation: { promptLines: ["P = {P} W", "t = {t} s"] },
  }),
  qb({
    id: "energy.calculate_energy_kwh",
    familyId: "electrical.energy_and_efficiency",
    capabilityId: "cap.energy.calculate_energy_kwh",
    title: "Calculate electrical energy used in kilowatt-hours from power rating and time",
    difficultyBand: "intermediate",
    answer: quantityAnswer("energy", "kilowatt-hour"),
    marking: tolerance(1),
    assertionIdentifiers: ["EL-ENERGY-KWH-CALC-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.electrical_energy" } },
    presentation: { promptLines: ["P = {P_kW} kW", "t = {t_hours} hours"] },
  }),
  qb({
    id: "energy.rearrange",
    familyId: "electrical.energy_and_efficiency",
    capabilityId: "cap.energy.rearrange",
    title: "Rearrange E = P x t to make power or time the subject",
    difficultyBand: "intermediate",
    answer: { type: "formula_selection" },
    marking: enumMarking(),
    assertionIdentifiers: ["EL-ENERGY-REARRANGE-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.electrical_energy" } },
    presentation: { promptLines: ["The known quantities are: {known}.", "Which rearrangement of E = P x t should be used to find the missing quantity?"] },
  }),
  qb({
    id: "energy.calculate_efficiency",
    familyId: "electrical.energy_and_efficiency",
    capabilityId: "cap.energy.calculate_efficiency",
    title: "Calculate the efficiency of an electrical device as a percentage",
    difficultyBand: "advanced",
    answer: { type: "quantity", quantity: "efficiency", canonicalUnit: "percent" },
    marking: tolerance(1),
    assertionIdentifiers: ["EL-CALC-ELECTRICAL-EFFICIENCY-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.electrical_efficiency" } },
    presentation: { promptLines: ["Power input: {Pin} W", "Power output: {Pout} W"] },
  }),

  // ===================================================================
  // electrical.charge_and_current (2)
  // ===================================================================
  qb({
    id: "charge.recognise",
    familyId: "electrical.charge_and_current",
    capabilityId: "cap.charge.recognise",
    title: "Recognise the relationship between current and the rate of flow of charge",
    difficultyBand: "introductory",
    answer: { type: "formula_selection" },
    marking: enumMarking(),
    assertionIdentifiers: ["EL-CURRENT-CHARGE-RELATIONSHIP-001"],
    presentation: { promptLines: ["Which formula correctly relates current I to charge Q and time t?"] },
  }),
  qb({
    id: "charge.calculate",
    familyId: "electrical.charge_and_current",
    capabilityId: "cap.charge.calculate",
    title: "Calculate charge or current using I = Q / t",
    difficultyBand: "intermediate",
    answer: { type: "quantity", quantity: "charge_or_current", canonicalUnit: "coulomb_or_ampere" },
    marking: tolerance(1),
    assertionIdentifiers: ["EL-CURRENT-CHARGE-CALC-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.charge_current" } },
    variantDimensions: { target_variable: { allowed: ["I", "Q"] } },
    presentation: { promptLines: ["{given_summary}", "Find {target_variable}."] },
  }),

  // ===================================================================
  // electrical.thermal_and_chemical_effects (2)
  // ===================================================================
  qb({
    id: "thermal_chemical.recognise_effect",
    familyId: "electrical.thermal_and_chemical_effects",
    capabilityId: "cap.thermal_chemical.recognise_effect",
    title: "Recognise the thermal or chemical effect of current flowing through a circuit",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["thermal", "chemical"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CURRENT-THERMAL-EFFECT-001", "EL-CURRENT-CHEMICAL-EFFECT-001", "EL-THERMAL-EFFECT-FACTORS-001"],
    presentation: { promptLines: ["{effect_clue}", "Is this the thermal effect or the chemical effect of current?"] },
  }),
  qb({
    id: "thermal_chemical.recognise_application",
    familyId: "electrical.thermal_and_chemical_effects",
    capabilityId: "cap.thermal_chemical.recognise_application",
    title: "Identify a practical application of the thermal effect of current",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["heating_element", "filament_lamp", "relay_coil"] },
    marking: exact(),
    assertionIdentifiers: ["EL-THERMAL-EFFECT-APPLICATION-001"],
    presentation: { promptLines: ["{application_clue}", "Which application of the thermal effect of current is this?"] },
  }),

  // ===================================================================
  // electrical.conductors_and_insulators (2)
  // ===================================================================
  qb({
    id: "conductors.classify_material",
    familyId: "electrical.conductors_and_insulators",
    capabilityId: "cap.conductors.classify_material",
    title: "Classify a given material as a conductor or an insulator",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["conductor", "insulator"] },
    marking: exact(),
    // CC-11.1: additive evidence-citation fix -- correctly classifying a
    // material as conductor/insulator functionally demonstrates
    // understanding of what each term means (AC4.2's own "conductor-
    // meaning"/"insulator-meaning" obligations), but those two definitional
    // assertions were never cited here, an evidence-completeness gap the
    // new obligation-level readiness check (report-coverage-matrix.ts)
    // would otherwise mis-flag as a missing assessment route. No new
    // pedagogy: same blueprint, same grading, just honestly-completed
    // evidence.
    assertionIdentifiers: ["EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001", "EL-CONCEPT-CONDUCTOR-001", "EL-CONCEPT-INSULATOR-001"],
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-CONDUCTOR-INSULATOR-CONFUSION-001", evidenceStrength: "suggestive" }],
    presentation: { promptLines: ["Is {material} a conductor or an insulator?"] },
  }),
  qb({
    id: "conductors.recognise_breakdown",
    familyId: "electrical.conductors_and_insulators",
    capabilityId: "cap.conductors.recognise_breakdown",
    title: "Recognise insulation breakdown as a consequence of excessive voltage",
    difficultyBand: "intermediate",
    answer: { type: "multiple_choice", options: ["breaks_down_and_conducts", "remains_insulating"] },
    marking: exact(),
    assertionIdentifiers: ["EL-INSULATOR-BREAKDOWN-001"],
    presentation: { promptLines: ["A voltage far beyond an insulator's rating is applied across it.", "What happens to the insulator?"] },
  }),
  // CC-11.2: closes AC4.1's own "electron-theory-of-current" obligation.
  // Distractor is "protons" rather than an ionic/semiconductor charge
  // carrier -- both the correct answer and the wrong one draw only on
  // content this family's own prerequisite already teaches
  // (EL-CONCEPT-ATOMIC-CHARGE-STRUCTURE-001: protons fixed in the
  // nucleus, only electrons free to move), so no new teaching content
  // was introduced to support this question.
  qb({
    id: "conductors.recognise_electron_theory",
    familyId: "electrical.conductors_and_insulators",
    capabilityId: "cap.conductors.recognise_electron_theory",
    title: "Recognise electron theory of current in a metallic conductor",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["free_electrons", "protons"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CONCEPT-ELECTRON-THEORY-001", "EL-CONCEPT-ATOMIC-CHARGE-STRUCTURE-001"],
    presentation: { promptLines: ["In a metallic conductor, a potential difference is applied across it.", "What actually moves through the conductor to create the electric current?"] },
  }),

  // ===================================================================
  // electrical.instrumentation (4)
  // ===================================================================
  qb({
    id: "instrumentation.select_instrument",
    familyId: "electrical.instrumentation",
    capabilityId: "cap.instrumentation.select_instrument",
    title: "Select the correct instrument to measure a given electrical quantity",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["voltmeter", "ammeter", "ohmmeter", "multimeter"] },
    marking: exact(),
    assertionIdentifiers: ["EL-INSTRUMENT-SELECT-001"],
    presentation: { promptLines: ["Which instrument should be used to measure {quantity}?"] },
  }),
  qb({
    id: "instrumentation.recognise_connection",
    familyId: "electrical.instrumentation",
    capabilityId: "cap.instrumentation.recognise_connection",
    title: "Recognise the correct connection method for a voltmeter or ammeter",
    difficultyBand: "intermediate",
    answer: { type: "multiple_choice", options: ["series", "parallel"] },
    marking: exact(),
    assertionIdentifiers: ["EL-INSTRUMENT-VOLTMETER-001", "EL-INSTRUMENT-AMMETER-001"],
    representation: { diagram: { required: true, blueprintId: "instrument.measurement_connection" } },
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-INSTRUMENT-CONNECTION-CONFUSION-001", evidenceStrength: "direct" }],
    presentation: { promptLines: ["Look at the circuit diagram.", "How should the {instrument_type} be connected to measure correctly?"] },
  }),
  qb({
    id: "instrumentation.recognise_internal_resistance_property",
    familyId: "electrical.instrumentation",
    capabilityId: "cap.instrumentation.recognise_internal_resistance_property",
    title: "Recognise the ideal internal-resistance property of a voltmeter or ammeter",
    difficultyBand: "advanced",
    answer: { type: "multiple_choice", options: ["very_high", "very_low"] },
    marking: exact(),
    assertionIdentifiers: ["EL-INSTRUMENT-VOLTMETER-INTERNAL-RESISTANCE-001", "EL-INSTRUMENT-AMMETER-INTERNAL-RESISTANCE-001"],
    presentation: { promptLines: ["For accurate measurement without disturbing the circuit, what should the ideal internal resistance of a {instrument_type} be?"] },
  }),
  qb({
    id: "instrumentation.recognise_purpose",
    familyId: "electrical.instrumentation",
    capabilityId: "cap.instrumentation.recognise_purpose",
    title: "Identify the purpose of a specialised instrument (clamp meter, oscilloscope, continuity tester)",
    difficultyBand: "intermediate",
    answer: { type: "multiple_choice", options: ["clamp_meter", "oscilloscope", "continuity_tester"] },
    marking: exact(),
    assertionIdentifiers: ["EL-INSTRUMENT-CLAMP-METER-001", "EL-INSTRUMENT-OSCILLOSCOPE-001", "EL-INSTRUMENT-CONTINUITY-TEST-001"],
    presentation: { promptLines: ["{purpose_clue}", "Which instrument is this?"] },
  }),

  // ===================================================================
  // electrical.fault_conditions_protection (4)
  // ===================================================================
  qb({
    id: "fault.recognise_condition",
    familyId: "electrical.fault_conditions_protection",
    capabilityId: "cap.fault.recognise_condition",
    title: "Recognise a short-circuit or open-circuit condition from its description",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["short_circuit", "open_circuit"] },
    marking: exact(),
    assertionIdentifiers: [
      "EL-CIRCUIT-RECOGNISE-SHORT-CIRCUIT-001",
      "EL-CIRCUIT-RECOGNISE-OPEN-CIRCUIT-001",
      "EL-CIRCUIT-ZERO-RESISTANCE-INTERPRETATION-001",
      "EL-CIRCUIT-OPEN-CIRCUIT-RESISTANCE-INTERPRETATION-001",
    ],
    presentation: { promptLines: ["{condition_clue}", "Which fault condition is this?"] },
  }),
  qb({
    id: "fault.predict_short_effect",
    familyId: "electrical.fault_conditions_protection",
    capabilityId: "cap.fault.predict_effect",
    title: "Predict the effect of a short circuit occurring across a component",
    difficultyBand: "intermediate",
    answer: { type: "multiple_choice", options: ["current_increases_sharply", "current_decreases", "no_effect"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CIRCUIT-PREDICT-SHORT-EFFECT-001"],
    presentation: { promptLines: ["A short circuit occurs across a component in an energised circuit.", "What happens to the current?"] },
  }),
  qb({
    id: "fault.select_protective_device",
    familyId: "electrical.fault_conditions_protection",
    capabilityId: "cap.fault.select_protective_device",
    title: "Select a protective device appropriate to a fault scenario",
    difficultyBand: "intermediate",
    answer: { type: "multiple_choice", options: ["fuse", "circuit_breaker"] },
    marking: exact(),
    assertionIdentifiers: ["EL-PROTECTIVE-DEVICE-PURPOSE-001", "EL-FUSE-OPERATION-001"],
    presentation: { promptLines: ["{scenario_text}", "Which protective device is most appropriate?"] },
  }),
  qb({
    id: "fault.compare_fuse_breaker",
    familyId: "electrical.fault_conditions_protection",
    capabilityId: "cap.fault.compare_fuse_breaker",
    title: "Compare fuse and circuit-breaker operation and reuse",
    difficultyBand: "advanced",
    answer: { type: "multiple_choice", options: ["fuse", "circuit_breaker"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CIRCUIT-BREAKER-VS-FUSE-001"],
    presentation: { promptLines: ["Which protective device {asked_about_text}?"] },
  }),

  // ===================================================================
  // electrical.magnetism_and_electromagnetism (6)
  // ===================================================================
  qb({
    id: "magnetism.recognise_concept",
    familyId: "electrical.magnetism_and_electromagnetism",
    capabilityId: "cap.magnetism.recognise_concept",
    title: "Recognise magnetic flux or flux density from its definition",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["flux", "flux_density"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CONCEPT-MAGNETIC-FLUX-001", "EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001", "EL-CONCEPT-ELECTROMAGNETISM-001"],
    presentation: {
      promptLines: ["Which quantity is described as: {definition_clue}?"],
      answerOptionLabels: { flux: "Magnetic flux", flux_density: "Magnetic flux density" },
    },
  }),
  qb({
    id: "magnetism.interpret_field_direction",
    familyId: "electrical.magnetism_and_electromagnetism",
    capabilityId: "cap.magnetism.interpret_field_direction",
    title: "Interpret the direction of the magnetic field produced by a current-carrying conductor",
    difficultyBand: "advanced",
    answer: { type: "direction" },
    marking: { type: "direction_match" },
    // CC-11.1: additive evidence-citation fix -- determining the field's
    // direction from a current direction IS applying the field-direction
    // rule (AC5.3's own "field-direction-rule" obligation, Maxwell's screw
    // rule / right-hand rule), previously uncited here.
    assertionIdentifiers: ["EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001", "EL-CONCEPT-FIELD-DIRECTION-RULE-001"],
    representation: { diagram: { required: true, blueprintId: "magnetic.field_conductor_direction" } },
    presentation: { promptLines: ["A straight conductor carries current as shown. In which direction does the magnetic field circulate around it?"] },
  }),
  qb({
    id: "magnetism.interpret_force_direction",
    familyId: "electrical.magnetism_and_electromagnetism",
    capabilityId: "cap.magnetism.interpret_force_direction",
    title: "Interpret the direction of the force on a current-carrying conductor in a magnetic field",
    difficultyBand: "advanced",
    answer: { type: "direction" },
    marking: { type: "direction_match" },
    assertionIdentifiers: ["EL-CONCEPT-FORCE-ON-CONDUCTOR-001", "EL-CONCEPT-MOTOR-PRINCIPLE-001"],
    representation: { diagram: { required: true, blueprintId: "motor.force_field_current" } },
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001", evidenceStrength: "suggestive" }],
    presentation: { promptLines: ["A current-carrying conductor sits in the magnetic field shown. In which direction does the force act on it?"] },
  }),
  // CC-12: a genuine root-cause DIAGNOSTIC, not a teaching/assessment
  // question -- deliberately fixed (no parameterGenerators), single
  // canonical scenario, mirroring identifyFluxDensityUnit/
  // identifyFluxUnit's own constant-output pattern. Reused by the
  // ambiguous-wrong-answer branch on magnetism.interpret_force_direction
  // (see lesson-magnetic-effects-of-current.ts's diagnose_force_direction_
  // error step) to distinguish, before assuming a specific cause, whether
  // an incorrect force-direction answer traces to current-convention
  // confusion (this blueprint's own 2-option discriminating check, the
  // governed pattern emf.distinguish_emf_terminal_voltage already
  // established) or -- by elimination when answered correctly -- to
  // Fleming's-rule finger-assignment confusion instead (task brief §11:
  // EVIDENCE -> HYPOTHESIS -> DIAGNOSTIC CHECK -> TARGETED REMEDIATION).
  qb({
    id: "magnetism.diagnose_current_convention",
    familyId: "electrical.magnetism_and_electromagnetism",
    capabilityId: "cap.magnetism.interpret_force_direction",
    title: "Diagnose which current convention was used for Fleming's left-hand rule",
    difficultyBand: "diagnostic",
    answer: { type: "multiple_choice", options: ["conventional_current", "electron_flow"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CONCEPT-FLEMING-LEFT-HAND-001"],
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001", evidenceStrength: "direct" }],
    presentation: {
      promptLines: [
        "Fleming's left-hand rule's seCond finger represents the direction of CONVENTIONAL current (positive to negative), never electron flow.",
        "Which direction convention did you use when you last answered a force-direction question?",
      ],
      answerOptionLabels: {
        conventional_current: "Conventional current (positive to negative)",
        electron_flow: "Electron flow (negative to positive)",
      },
    },
  }),
  qb({
    id: "magnetism.compare_permanent_electromagnet",
    familyId: "electrical.magnetism_and_electromagnetism",
    capabilityId: "cap.magnetism.compare_permanent_electromagnet",
    title: "Compare a permanent magnet with an electromagnet",
    difficultyBand: "intermediate",
    answer: { type: "multiple_choice", options: ["permanent_magnet", "electromagnet"] },
    marking: exact(),
    assertionIdentifiers: ["EL-MAGNETISM-COMPARE-PERMANENT-ELECTROMAGNET-001"],
    presentation: { promptLines: ["Which type of magnet is being described: it {scenario_clue}?"] },
  }),
  qb({
    id: "magnetism.compare_motor_generator",
    familyId: "electrical.magnetism_and_electromagnetism",
    capabilityId: "cap.magnetism.compare_motor_generator",
    title: "Compare the motor principle with the generator principle",
    difficultyBand: "advanced",
    answer: { type: "multiple_choice", options: ["motor", "generator"] },
    marking: exact(),
    assertionIdentifiers: ["EL-MOTOR-GENERATOR-COMPARE-001"],
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-EMF-VOLTAGE-CONFUSION-001", evidenceStrength: "suggestive" }],
    presentation: { promptLines: ["Which principle is being described: it {principle_clue}?"] },
  }),
  qb({
    // CC-09E.1 (Project Architect correction): restricted to magnetic
    // flux DENSITY only -- the official sample directly demonstrated unit
    // recognition for this one quantity (item 31), never for magnetic
    // flux itself. Magnetic flux's own unit (weber) was previously bundled
    // into this SAME DIRECT_SAMPLE_ANALOGUE blueprint via a variantDimensions
    // quantity pick, which dishonestly implied the sample had also directly
    // demonstrated flux-unit recognition. Split into a companion
    // ASSESSMENT_STYLE_TRANSFER blueprint below (magnetism.identify_flux_unit)
    // instead.
    id: "magnetism.identify_flux_density_unit",
    familyId: "electrical.magnetism_and_electromagnetism",
    capabilityId: "cap.magnetism.identify_unit",
    title: "Identify the SI unit of magnetic flux density",
    difficultyBand: "introductory",
    // Distractors are the real, governed SI units of closely related AC
    // reactive quantities (henry/inductance, farad/capacitance) plus
    // magnetic flux's own unit (weber) -- each a genuine, plausible
    // related-unit confusion, never an arbitrary wrong answer (task
    // section 11).
    answer: { type: "multiple_choice", options: ["tesla", "weber", "henry", "farad"] },
    marking: exact(),
    assertionIdentifiers: ["EL-UNIT-TESLA-001"],
    // CC-09E (task section 4): the official public 2365-602 sample
    // directly demonstrates this exact grammar -- sample item 31 tests
    // naming the SI unit of magnetic flux density among plausible
    // related-unit distractors (weber, henry, farad were the real
    // distractor options; only the topic is paraphrased here, per the
    // copyright firebreak -- task section 6). No source wording retained.
    assessmentStyleEvidence: {
      classification: "DIRECT_SAMPLE_ANALOGUE",
      sourceItemRef: "2365-602-sample-v1:item-31",
      note: "Sample item 31 (identify the SI unit of magnetic flux density among weber/henry/farad distractors) demonstrates this exact operation/representation for this same knowledge target -- the finding that originally justified authoring EL-UNIT-TESLA-001 (CC-09D).",
    },
    presentation: { promptLines: ["What is the SI unit of magnetic flux density?"] },
  }),
  qb({
    // CC-09E.1: the companion transfer -- magnetic FLUX's own unit
    // (weber) was never itself tested by the sample (only flux density
    // was, item 31); this reuses the same "identify unit among plausible
    // related-unit distractors" grammar for magnetic flux, honestly
    // classified as a transfer, never a direct analogue.
    id: "magnetism.identify_flux_unit",
    familyId: "electrical.magnetism_and_electromagnetism",
    capabilityId: "cap.magnetism.identify_unit",
    title: "Identify the SI unit of magnetic flux",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["weber", "tesla", "henry", "farad"] },
    marking: exact(),
    assertionIdentifiers: ["EL-UNIT-WEBER-001"],
    assessmentStyleEvidence: {
      classification: "ASSESSMENT_STYLE_TRANSFER",
      transferredFromBlueprintId: "magnetism.identify_flux_density_unit",
      note: "Transfers the 'identify SI unit among plausible related-unit distractors' grammar sample item 31 demonstrated for magnetic flux DENSITY to magnetic flux itself -- a closely related but distinct, already-governed Unit 202 quantity (EL-UNIT-WEBER-001, AC5.2) the sample never directly tested unit recognition for.",
    },
    presentation: { promptLines: ["What is the SI unit of magnetic flux?"] },
  }),

  // ===================================================================
  // electrical.emf_and_generation (2)
  // ===================================================================
  qb({
    id: "emf.distinguish_emf_terminal_voltage",
    familyId: "electrical.emf_and_generation",
    capabilityId: "cap.emf.recognise_emf_terminal_voltage",
    title: "Distinguish EMF from terminal voltage",
    difficultyBand: "advanced",
    answer: { type: "multiple_choice", options: ["emf", "terminal_voltage"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CONCEPT-EMF-001", "EL-CONCEPT-TERMINAL-VOLTAGE-001"],
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-EMF-VOLTAGE-CONFUSION-001", evidenceStrength: "direct" }],
    presentation: { promptLines: ["A source's potential difference is measured {reading_context}.", "Is this its EMF or its terminal voltage?"] },
  }),
  qb({
    id: "emf.describe_ac_generation",
    familyId: "electrical.emf_and_generation",
    capabilityId: "cap.emf.describe_ac_generation",
    title: "Describe the basic principle of a rotating-loop A.C. generator",
    difficultyBand: "intermediate",
    answer: { type: "multiple_choice", options: ["sine_wave", "constant_dc", "square_wave"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CONCEPT-AC-GENERATOR-001", "EL-CONCEPT-SINE-WAVE-001"],
    // CC-11.3: was "motor.force_field_current" -- an active misrepresentation
    // (the static motor-principle diagram, not a rotating loop) this
    // package fixes; see generator.rotating_loop's own diagram-blueprint entry.
    representation: { diagram: { required: false, blueprintId: "generator.rotating_loop" } },
    presentation: { promptLines: ["A single loop of wire is rotated at a constant speed inside a uniform magnetic field.", "What shape is the resulting EMF waveform?"] },
  }),
  qb({
    id: "emf.calculate_flux_change",
    familyId: "electrical.emf_and_generation",
    capabilityId: "cap.emf.calculate_flux_change",
    title: "Calculate the EMF induced in a single loop from a changing magnetic flux",
    difficultyBand: "intermediate",
    answer: quantityAnswer("emf", "volt"),
    marking: tolerance(2),
    assertionIdentifiers: ["EL-REL-FLUX-CHANGE-EMF-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.flux_change_emf" } },
    variantDimensions: { target_variable: { allowed: ["e", "deltaPhi", "deltaT"] } },
    parameterGenerators: [
      { variable: "deltaPhi", min: 1, max: 20, constraints: ["positive", "pedagogically_sensible"] },
      { variable: "deltaT", min: 1, max: 60, constraints: ["positive", "pedagogically_sensible"] },
    ],
    // CC-09E (task section 4): the official public 2365-602 sample
    // directly demonstrates this exact grammar -- sample item 35 requires
    // calculating the flux change from a given induced EMF and time
    // interval, the same single-step rearrangement of the same formula
    // (CC-09D's own OFFICIAL_ASSESSMENT_EVIDENCE finding). No source
    // wording retained -- item reference only.
    assessmentStyleEvidence: {
      classification: "DIRECT_SAMPLE_ANALOGUE",
      sourceItemRef: "2365-602-sample-v1:item-35",
      note: "Sample item 35 (calculate flux change from a given induced EMF and time interval) demonstrates this exact operation/formula for this same knowledge target -- the finding that originally justified authoring EL-REL-FLUX-CHANGE-EMF-001 (CC-09D).",
    },
    presentation: { promptLines: ["{given_summary}", "Find {target_variable}."] },
  }),

  // ===================================================================
  // electrical.ac_dc_waveforms (6)
  // ===================================================================
  qb({
    id: "waveform.recognise_ac_dc",
    familyId: "electrical.ac_dc_waveforms",
    capabilityId: "cap.waveform.recognise_ac_dc",
    title: "Distinguish A.C. from D.C. supply behaviour",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["ac", "dc"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CONCEPT-AC-DC-DISTINCTION-001", "EL-CIRCUIT-AC-SUPPLY-RECOGNITION-001"],
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-AC-DC-CONFUSION-001", evidenceStrength: "suggestive" }],
    presentation: { promptLines: ["Which type of supply is being described: {supply_clue}?"] },
  }),
  qb({
    id: "waveform.identify_characteristic",
    familyId: "electrical.ac_dc_waveforms",
    capabilityId: "cap.waveform.identify_characteristic",
    title: "Identify a named sine-wave characteristic from a waveform graph",
    difficultyBand: "intermediate",
    answer: { type: "multiple_choice", options: ["periodic_time", "amplitude", "peak_to_peak", "rms", "average_value"] },
    marking: exact(),
    assertionIdentifiers: [
      "EL-WAVEFORM-PERIODIC-TIME-001",
      "EL-WAVEFORM-AMPLITUDE-001",
      "EL-WAVEFORM-PEAK-TO-PEAK-001",
      "EL-WAVEFORM-RMS-001",
      "EL-WAVEFORM-AVERAGE-VALUE-001",
      "EL-WAVEFORM-AVERAGE-ZERO-INTERPRETATION-001",
    ],
    representation: { diagram: { required: true, blueprintId: "graph.waveform_sine" } },
    // CC-09E: the official public 2365-602 sample directly demonstrates
    // this exact grammar (identify a named waveform characteristic from a
    // diagram) -- sample item 36 asks which labelled interval on a
    // sine-wave diagram indicates periodic time.
    assessmentStyleEvidence: {
      classification: "DIRECT_SAMPLE_ANALOGUE",
      sourceItemRef: "2365-602-sample-v1:item-36",
      note: "Sample item 36 (identify periodic time from a labelled waveform diagram) demonstrates this exact operation/representation for this same knowledge target.",
    },
    presentation: { promptLines: ["Which characteristic of this waveform is highlighted by the marked reference line(s) on the graph?"] },
  }),
  qb({
    id: "waveform.calculate_rms_from_peak",
    familyId: "electrical.ac_dc_waveforms",
    capabilityId: "cap.waveform.calculate_rms_peak",
    title: "Calculate RMS value from peak value, or peak value from RMS value",
    difficultyBand: "intermediate",
    answer: quantityAnswer("voltage_or_current", "volt_or_ampere"),
    marking: tolerance(1),
    assertionIdentifiers: ["EL-WAVEFORM-RMS-CALC-001", "EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001"],
    representation: {
      formula: { required: true, formulaFamilyId: "formula.ac_waveform_relationships" },
      diagram: { required: false, blueprintId: "graph.waveform_sine" },
    },
    variantDimensions: { target_variable: { allowed: ["rms", "peak"] } },
    presentation: { promptLines: ["{given_summary}", "Find the {target_variable} value."] },
  }),
  qb({
    id: "waveform.calculate_frequency_from_period",
    familyId: "electrical.ac_dc_waveforms",
    capabilityId: "cap.waveform.calculate_frequency_period",
    title: "Calculate frequency from periodic time, or periodic time from frequency",
    difficultyBand: "intermediate",
    answer: quantityAnswer("frequency_or_time", "hertz_or_second"),
    marking: tolerance(1),
    assertionIdentifiers: ["EL-WAVEFORM-FREQUENCY-CALC-001", "EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.ac_waveform_relationships" } },
    variantDimensions: { target_variable: { allowed: ["f", "T"] } },
    presentation: { promptLines: ["{given_summary}", "Find {target_variable}."] },
  }),
  qb({
    id: "waveform.interpret_rated_value",
    familyId: "electrical.ac_dc_waveforms",
    capabilityId: "cap.waveform.interpret_rated_value",
    title: "Interpret whether a quoted AC supply rating (e.g. 230 V) refers to RMS or peak value",
    difficultyBand: "diagnostic",
    answer: { type: "multiple_choice", options: ["rms", "peak"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CONCEPT-PEAK-VS-RMS-SUPPLY-INTERPRETATION-001"],
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-PEAK-RMS-CONFUSION-001", evidenceStrength: "direct" }],
    presentation: { promptLines: ["A supply is rated at a stated voltage (for example, '230 V').", "Does this rated value refer to the RMS value or the peak value?"] },
  }),
  qb({
    id: "waveform.compare_ac_dc_behaviour",
    familyId: "electrical.ac_dc_waveforms",
    capabilityId: "cap.waveform.compare_ac_dc_behaviour",
    title: "Compare how a resistor, inductor and capacitor behave under AC versus DC supply",
    difficultyBand: "advanced",
    answer: { type: "multiple_choice", options: ["same_both", "differs_by_frequency"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CIRCUIT-COMPARE-AC-DC-BEHAVIOUR-001"],
    presentation: { promptLines: ["How does a {component} behave under an AC supply compared with a DC supply?"] },
  }),

  // ===================================================================
  // electrical.ac_reactive_quantities (3) -- CC-09E: newly assessable
  // (see the family's own reclassification comment, section 1 above).
  // Formula/unit RECOGNITION only, categorical -- no numeric AC
  // reactive-quantity calculation engine exists or is added here.
  // ===================================================================
  qb({
    // The family's own pre-existing required capability
    // (cap.ac_reactive.recognise) now needs its own blueprint now that the
    // family is assessable -- a direct, necessary consequence of the
    // reclassification above, not new assessment-evidenced scope. Not
    // marked assessmentStyleEvidence: this specific recognition question
    // was not itself examined against the sample (unlike its two siblings
    // below), so it is honestly left unclassified rather than overclaimed.
    id: "ac_reactive.recognise",
    familyId: "electrical.ac_reactive_quantities",
    capabilityId: "cap.ac_reactive.recognise",
    title: "Recognise an AC reactive quantity from its definition",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["reactance", "impedance", "inductance", "capacitance", "power_factor"] },
    marking: exact(),
    assertionIdentifiers: [
      "EL-CONCEPT-REACTANCE-001",
      "EL-CONCEPT-IMPEDANCE-001",
      "EL-CONCEPT-INDUCTANCE-001",
      "EL-CONCEPT-CAPACITANCE-001",
      "EL-CONCEPT-POWER-FACTOR-001",
    ],
  }),
  qb({
    id: "ac_reactive.select_impedance_formula",
    familyId: "electrical.ac_reactive_quantities",
    capabilityId: "cap.ac_reactive.select_impedance_formula",
    title: "Select the correct formula for impedance",
    difficultyBand: "intermediate",
    // Distractors are the real, governed shape of plausible impedance-
    // formula confusions -- wrong operation (division instead of the
    // Pythagorean combination) and inversion -- never arbitrary wrong
    // answers (task section 11). "formula_selection" is answer-type
    // categorical; graded as an enum, no numeric evaluation required.
    answer: { type: "formula_selection", options: ["sqrt_r2_plus_x2", "sqrt_r2_minus_x2", "r_over_z", "z_over_r"] },
    marking: enumMarking(),
    assertionIdentifiers: ["EL-REL-IMPEDANCE-001"],
    // CC-09E (task section 4): the official public 2365-602 sample
    // directly demonstrates this exact grammar -- sample item 6 tests
    // selecting the correct impedance formula among the same shape of
    // plausible distractors (wrong operation, inversion). No source
    // wording retained -- item reference only.
    assessmentStyleEvidence: {
      classification: "DIRECT_SAMPLE_ANALOGUE",
      sourceItemRef: "2365-602-sample-v1:item-06",
      note: "Sample item 6 (select the correct impedance formula among plausible wrong-operation/inversion distractors) demonstrates this exact operation/representation for this same knowledge target -- the finding that originally justified authoring EL-REL-IMPEDANCE-001 (CC-09D).",
    },
  }),
  qb({
    id: "ac_reactive.identify_reactance_unit",
    familyId: "electrical.ac_reactive_quantities",
    capabilityId: "cap.ac_reactive.identify_reactance_unit",
    title: "Identify the SI unit of reactance",
    difficultyBand: "introductory",
    // CC-09E.1 (Project Architect correction): distractors are the real,
    // governed SI units of closely related AC reactive quantities
    // (henry/inductance, farad/capacitance) plus volt -- ohm/volt is
    // already a governed confusion pair elsewhere in this corpus
    // (units-and-quantities.ts's `diagnoseUnitConfusion`, "volt_ohm"),
    // reused here rather than "siemens" (conductance), which is not a
    // governed Unit 202 quantity/unit anywhere in this corpus and was
    // removed rather than adding new knowledge merely to keep it.
    answer: { type: "multiple_choice", options: ["ohm", "henry", "farad", "volt"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CONCEPT-REACTANCE-001"],
    // CC-09E (task sections 2.B/10, ASSESSMENT_STYLE_TRANSFER): the
    // sample never tested reactance's own unit -- this transfers the
    // "identify SI unit among plausible related-unit distractors" grammar
    // magnetism.identify_flux_density_unit demonstrates (DIRECT_SAMPLE_
    // ANALOGUE, sample item 31) to a different governed electrical
    // quantity. Never claimed as sample-proven; recorded honestly as a
    // legitimate style transfer, never a DIRECT_SAMPLE_ANALOGUE.
    assessmentStyleEvidence: {
      classification: "ASSESSMENT_STYLE_TRANSFER",
      transferredFromBlueprintId: "magnetism.identify_flux_density_unit",
      note: "Transfers the 'identify SI unit among plausible related-unit distractors' grammar sample item 31 demonstrated for magnetic flux density to reactance -- a different, already-governed Unit 202 quantity (EL-CONCEPT-REACTANCE-001, AC2.2) the sample itself never tested. One sample item is evidence this grammar is a plausible, real City & Guilds assessment style, not proof it is a universal exam rule or that this specific question occurs -- see task section 21's sample-size discipline.",
    },
  }),

  // ===================================================================
  // foundational.algebraic_technique (2) -- CC-08: standalone, abstract
  // (non-electrical) formula-rearrangement assessment for
  // lesson.foundation.maths.formula-rearrangement. Restates
  // FM-ALG-TRANSPOSE-MULT-001 / FM-ALG-TRANSPOSE-ADD-001 directly.
  // ===================================================================
  qb({
    id: "foundational.rearrange_multiplicative",
    familyId: "foundational.algebraic_technique",
    capabilityId: "cap.foundational.algebraic_technique.apply",
    title: "Rearrange a = b x c to find b",
    difficultyBand: "introductory",
    answer: quantityAnswer("value", "unit"),
    marking: tolerance(1),
    assertionIdentifiers: ["FM-ALG-TRANSPOSE-MULT-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.algebraic_rearrangement_multiplicative" } },
    presentation: { promptLines: ["a = {a}", "c = {c}", "Given a = b x c, find b."] },
  }),
  qb({
    id: "foundational.rearrange_additive",
    familyId: "foundational.algebraic_technique",
    capabilityId: "cap.foundational.algebraic_technique.apply",
    title: "Rearrange a = b + c to find b",
    difficultyBand: "introductory",
    answer: quantityAnswer("value", "unit"),
    marking: tolerance(1),
    assertionIdentifiers: ["FM-ALG-TRANSPOSE-ADD-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.algebraic_rearrangement_additive" } },
    presentation: { promptLines: ["a = {a}", "c = {c}", "Given a = b + c, find b."] },
  }),

  // ===================================================================
  // CC-11 (Workstream A): Unit 202 LO3 (AC3.1-AC3.4).
  // foundational.mass_weight (1)
  // ===================================================================
  qb({
    id: "mass_weight.recognise_relationship",
    familyId: "foundational.mass_weight",
    capabilityId: "cap.foundational.mass_weight.recognise",
    title: "Recognise mass or weight from its definition, and their relationship (W = mg)",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["mass", "weight"] },
    marking: exact(),
    assertionIdentifiers: ["FP-CONCEPT-MASS-001", "FP-CONCEPT-WEIGHT-001", "FP-REL-WEIGHT-MASS-001"],
    presentation: { promptLines: ["Which quantity is described as: {concept_clue}?"] },
  }),

  // ===================================================================
  // foundational.levers_mechanical_advantage (4)
  // ===================================================================
  qb({
    id: "levers.identify_class",
    familyId: "foundational.levers_mechanical_advantage",
    capabilityId: "cap.foundational.levers.recognise",
    title: "Identify a lever's class from the arrangement of pivot, effort and load",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["class_I", "class_II", "class_III"] },
    marking: exact(),
    assertionIdentifiers: ["FP-CONCEPT-LEVER-PRINCIPLE-001", "FP-LEVER-CLASS-I-001", "FP-LEVER-CLASS-II-001", "FP-LEVER-CLASS-III-001"],
    presentation: { promptLines: ["A lever is arranged so that {arrangement_clue}.", "Which class of lever is this?"] },
  }),
  qb({
    id: "gears.recognise_ratio_tradeoff",
    familyId: "foundational.levers_mechanical_advantage",
    capabilityId: "cap.foundational.gears.recognise",
    title: "Recognise the torque/speed trade-off a gear ratio produces",
    difficultyBand: "intermediate",
    answer: { type: "multiple_choice", options: ["torque_increases", "speed_increases"] },
    marking: exact(),
    assertionIdentifiers: ["FP-CONCEPT-GEAR-001", "FP-REL-GEAR-RATIO-001", "FP-GEAR-SPEED-TORQUE-TRADEOFF-001"],
    presentation: {
      promptLines: [
        "{scenario_clue}",
        "Compared with the driving gear, does the driven gear's output torque increase, or does its output speed increase?",
      ],
    },
  }),
  qb({
    id: "pulleys.recognise_force_distance_tradeoff",
    familyId: "foundational.levers_mechanical_advantage",
    capabilityId: "cap.foundational.pulleys.recognise",
    title: "Recognise the effort force/distance trade-off a pulley system's mechanical advantage produces",
    difficultyBand: "intermediate",
    answer: { type: "multiple_choice", options: ["effort_force_decreases", "effort_force_increases"] },
    marking: exact(),
    assertionIdentifiers: [
      "FP-CONCEPT-PULLEY-001",
      "FP-PULLEY-FIXED-VS-MOVABLE-001",
      "FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001",
      "FP-REL-PULLEY-FORCE-DISTANCE-TRADEOFF-001",
    ],
    presentation: {
      promptLines: ["{scenario_clue}", "Compared with a single fixed pulley, does the effort force needed to lift the load decrease, or increase?"],
    },
  }),
  qb({
    id: "levers.calculate_effort_or_load",
    familyId: "foundational.levers_mechanical_advantage",
    capabilityId: "cap.foundational.levers.calculate",
    title: "Calculate the effort or load in a balanced lever using the moment-balance relationship",
    difficultyBand: "intermediate",
    answer: quantityAnswer("force", "newton"),
    marking: tolerance(2),
    assertionIdentifiers: ["FP-REL-LEVER-BALANCE-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.lever_balance" } },
    variantDimensions: { target_variable: { allowed: ["Fe", "Fl"] } },
    presentation: { promptLines: ["{given_summary}", "Find {target_variable}."] },
  }),

  // ===================================================================
  // foundational.mechanics_work_energy_power (6)
  // ===================================================================
  qb({
    id: "mechanics.recognise_concept",
    familyId: "foundational.mechanics_work_energy_power",
    capabilityId: "cap.foundational.mechanics.recognise",
    title: "Recognise force, work, energy, power or efficiency from its definition",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["force", "work", "energy", "power", "efficiency"] },
    marking: exact(),
    assertionIdentifiers: ["FP-CONCEPT-FORCE-001", "FP-CONCEPT-WORK-001", "FP-CONCEPT-ENERGY-001", "FP-CONCEPT-POWER-001", "FP-CONCEPT-EFFICIENCY-001"],
    presentation: { promptLines: ["Which mechanical quantity is described as: {concept_clue}?"] },
  }),
  qb({
    id: "mechanics.calculate_work",
    familyId: "foundational.mechanics_work_energy_power",
    capabilityId: "cap.foundational.mechanics.calculate",
    title: "Calculate work done from force and distance",
    difficultyBand: "introductory",
    answer: quantityAnswer("work", "joule"),
    marking: tolerance(2),
    assertionIdentifiers: ["FP-REL-WORK-FORCE-DISTANCE-001", "FP-CALC-WORK-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.mechanics_work" } },
    presentation: { promptLines: ["F = {F} N", "d = {d} m"] },
  }),
  qb({
    id: "mechanics.calculate_kinetic_energy",
    familyId: "foundational.mechanics_work_energy_power",
    capabilityId: "cap.foundational.mechanics.calculate",
    title: "Calculate kinetic energy from mass and speed",
    difficultyBand: "intermediate",
    answer: quantityAnswer("energy", "joule"),
    marking: tolerance(2),
    assertionIdentifiers: ["FP-REL-KINETIC-ENERGY-001", "FP-CALC-KINETIC-ENERGY-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.mechanics_kinetic_energy" } },
    presentation: { promptLines: ["m = {m} kg", "v = {v} m/s"] },
  }),
  qb({
    id: "mechanics.calculate_potential_energy",
    familyId: "foundational.mechanics_work_energy_power",
    capabilityId: "cap.foundational.mechanics.calculate",
    title: "Calculate gravitational potential energy from mass and height",
    difficultyBand: "intermediate",
    answer: quantityAnswer("energy", "joule"),
    marking: tolerance(2),
    assertionIdentifiers: ["FP-REL-POTENTIAL-ENERGY-001", "FP-CALC-POTENTIAL-ENERGY-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.mechanics_potential_energy" } },
    presentation: { promptLines: ["m = {m} kg", "h = {h} m", "(use g = 9.81 N/kg)"] },
  }),
  qb({
    id: "mechanics.calculate_power",
    familyId: "foundational.mechanics_work_energy_power",
    capabilityId: "cap.foundational.mechanics.calculate",
    title: "Calculate power from work done (or energy transferred) and time taken",
    difficultyBand: "intermediate",
    answer: quantityAnswer("power", "watt"),
    marking: tolerance(2),
    assertionIdentifiers: ["FP-REL-POWER-WORK-TIME-001", "FP-CALC-POWER-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.mechanics_power" } },
    presentation: { promptLines: ["W = {W} J", "t = {t} s"] },
  }),
  qb({
    id: "mechanics.calculate_efficiency",
    familyId: "foundational.mechanics_work_energy_power",
    capabilityId: "cap.foundational.mechanics.calculate",
    title: "Calculate efficiency as a percentage from useful output and total input",
    difficultyBand: "advanced",
    answer: { type: "quantity", quantity: "efficiency", canonicalUnit: "percent" },
    marking: tolerance(1),
    assertionIdentifiers: ["FP-CONCEPT-EFFICIENCY-001", "FP-CALC-EFFICIENCY-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.mechanics_efficiency" } },
    presentation: { promptLines: ["Useful output: {Eout} J", "Total input: {Ein} J"] },
  }),

  // ===================================================================
  // CC-11 (Workstream C): Unit 202 LO6 (AC6.1/AC6.2).
  // electrical.electronic_components (6)
  // ===================================================================
  qb({
    id: "electronics.recognise_capacitor_behaviour",
    familyId: "electrical.electronic_components",
    capabilityId: "cap.electronic_components.recognise_principle",
    title: "Recognise a capacitor's charge/discharge transient behaviour",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["gradual_exponential_change", "instant_step_change"] },
    marking: exact(),
    assertionIdentifiers: ["EL-COMPONENT-CAPACITOR-TRANSIENT-001"],
    presentation: {
      promptLines: ["A capacitor is {scenario} through a resistor in a circuit.", "How does the voltage across the capacitor change over time?"],
      answerOptionLabels: {
        gradual_exponential_change: "Gradually, following an exponential curve (governed by the time constant tau = R x C)",
        instant_step_change: "Instantly, as a sudden step change",
      },
    },
  }),
  qb({
    id: "electronics.recognise_thermistor_type",
    familyId: "electrical.electronic_components",
    capabilityId: "cap.electronic_components.recognise_principle",
    title: "Distinguish an NTC thermistor from a PTC thermistor",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["ntc_thermistor", "ptc_thermistor"] },
    marking: exact(),
    assertionIdentifiers: ["EL-COMPONENT-THERMISTOR-001", "EL-COMPONENT-THERMISTOR-PTC-001"],
    presentation: {
      promptLines: ["A thermistor is described as follows: {thermistor_type_clue}.", "Which type of thermistor is this?"],
      answerOptionLabels: { ntc_thermistor: "NTC (negative-temperature-coefficient) thermistor", ptc_thermistor: "PTC (positive-temperature-coefficient) thermistor" },
    },
  }),
  qb({
    id: "electronics.recognise_rectifier_type",
    familyId: "electrical.electronic_components",
    capabilityId: "cap.electronic_components.recognise_principle",
    title: "Distinguish half-wave rectification, full-wave rectification and the inverter",
    difficultyBand: "intermediate",
    answer: { type: "multiple_choice", options: ["half_wave_rectifier", "full_wave_rectifier", "inverter"] },
    marking: exact(),
    assertionIdentifiers: ["EL-COMPONENT-RECTIFIER-001", "EL-COMPONENT-RECTIFIER-HALF-WAVE-001", "EL-COMPONENT-RECTIFIER-FULL-WAVE-001", "EL-COMPONENT-INVERTER-001"],
    presentation: {
      promptLines: ["A circuit {rectifier_type_clue}.", "Which of these does this describe?"],
      answerOptionLabels: { half_wave_rectifier: "Half-wave rectifier", full_wave_rectifier: "Full-wave bridge rectifier", inverter: "Inverter" },
    },
  }),
  qb({
    id: "electronics.recognise_diode_family",
    familyId: "electrical.electronic_components",
    capabilityId: "cap.electronic_components.recognise_principle",
    title: "Recognise a member of the diode family from its behaviour",
    difficultyBand: "intermediate",
    answer: { type: "multiple_choice", options: ["diode", "zener_diode", "led", "photodiode"] },
    marking: exact(),
    assertionIdentifiers: ["EL-COMPONENT-DIODE-001", "EL-COMPONENT-ZENER-DIODE-001", "EL-COMPONENT-LED-001", "EL-COMPONENT-PHOTODIODE-001"],
    misconceptionTargets: [{ misconceptionIdentifier: "MIS-EL-DIODE-DIRECTION-CONFUSION-001", evidenceStrength: "suggestive" }],
    presentation: {
      promptLines: ["A component {diode_family_clue}.", "Which component is this?"],
      answerOptionLabels: { diode: "Diode", zener_diode: "Zener diode", led: "LED (light-emitting diode)", photodiode: "Photodiode" },
    },
  }),
  qb({
    id: "electronics.recognise_switching_family",
    familyId: "electrical.electronic_components",
    capabilityId: "cap.electronic_components.recognise_principle",
    title: "Recognise a DIAC, TRIAC, thyristor (SCR) or transistor from its behaviour",
    difficultyBand: "advanced",
    answer: { type: "multiple_choice", options: ["diac", "triac", "thyristor_scr", "transistor"] },
    marking: exact(),
    assertionIdentifiers: ["EL-COMPONENT-DIAC-001", "EL-COMPONENT-TRIAC-001", "EL-COMPONENT-THYRISTOR-SCR-001", "EL-COMPONENT-TRANSISTOR-001"],
    presentation: {
      promptLines: ["A component {switching_family_clue}.", "Which component is this?"],
      answerOptionLabels: { diac: "DIAC", triac: "TRIAC", thyristor_scr: "Thyristor (silicon-controlled rectifier, SCR)", transistor: "Transistor" },
    },
  }),
  qb({
    id: "electronics.identify_application",
    familyId: "electrical.electronic_components",
    capabilityId: "cap.electronic_components.identify_application",
    title: "Identify which electronic component is used for a described electrical-system application",
    difficultyBand: "intermediate",
    answer: { type: "multiple_choice", options: ["triac", "thyristor_scr", "thermistor", "transistor", "capacitor", "resistor"] },
    marking: exact(),
    assertionIdentifiers: [
      "EL-APPLICATION-DIMMER-SWITCH-001",
      "EL-APPLICATION-MOTOR-CONTROL-001",
      "EL-APPLICATION-HEATING-BOILER-CONTROL-001",
      "EL-APPLICATION-SECURITY-ALARM-TRANSISTOR-THYRISTOR-001",
      "EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001",
    ],
    presentation: {
      promptLines: ["{application_clue}"],
      answerOptionLabels: { triac: "TRIAC", thyristor_scr: "Thyristor (SCR)", thermistor: "Thermistor", transistor: "Transistor", capacitor: "Capacitor", resistor: "Resistor" },
    },
  }),

  // ===================================================================
  // CC-11.1: Unit 202 LO5 AC5.1/AC5.3 -- the three genuine evidence gaps
  // CC-11 found and explicitly deferred.
  // ===================================================================
  qb({
    id: "magnetism.recognise_attraction_repulsion",
    familyId: "electrical.magnetism_and_electromagnetism",
    capabilityId: "cap.magnetism.recognise_attraction_repulsion",
    title: "Recognise the effects of magnetism in terms of attraction and repulsion",
    difficultyBand: "introductory",
    answer: { type: "multiple_choice", options: ["attract", "repel"] },
    marking: exact(),
    assertionIdentifiers: ["EL-CONCEPT-MAGNETISM-001"],
    representation: { diagram: { required: true, blueprintId: "magnetic.pole_interaction" } },
    presentation: { promptLines: ["Two magnetic poles are brought close together: {pole_scenario_clue}.", "What happens?"] },
  }),
  qb({
    id: "magnetism.calculate_force_on_conductor",
    familyId: "electrical.magnetism_and_electromagnetism",
    capabilityId: "cap.magnetism.calculate_force_on_conductor",
    title: "Calculate the force on a current-carrying conductor at right angles to a magnetic field",
    difficultyBand: "advanced",
    answer: quantityAnswer("force", "newton"),
    marking: tolerance(2),
    assertionIdentifiers: ["EL-REL-FORCE-ON-CONDUCTOR-001"],
    representation: { formula: { required: true, formulaFamilyId: "formula.force_on_conductor" } },
    presentation: { promptLines: ["B = {B} T", "I = {I} A", "l = {l} m", "The conductor is at right angles to the field.", "Find the force on the conductor."] },
  }),
  qb({
    id: "emf.calculate_motional_emf",
    familyId: "electrical.emf_and_generation",
    capabilityId: "cap.emf.calculate_motional_emf",
    title: "Calculate the EMF induced in a conductor moving through a magnetic field",
    difficultyBand: "advanced",
    answer: quantityAnswer("emf", "volt"),
    marking: tolerance(2),
    assertionIdentifiers: ["EL-REL-INDUCED-EMF-001"],
    representation: {
      formula: { required: true, formulaFamilyId: "formula.motional_emf" },
      diagram: { required: false, blueprintId: "emf.motional_emf_geometry" },
    },
    presentation: {
      promptLines: [
        "B = {B} T",
        "l = {l} m",
        "v = {v} m/s",
        "The conductor's length, its velocity and the magnetic field are mutually perpendicular.",
        "Find the induced EMF.",
      ],
    },
  }),
];

// =======================================================================
// 9. Final assembled manifest
// =======================================================================

/** Stable identity of this governed pedagogy-corpus snapshot module, referenced by governed ContentRelease manifests (scripts/content/data/content-releases.ts). */
export const CC05A_PEDAGOGY_CORPUS_ID = "cc05a-pedagogy-unit202" as const;

const cc05aPedagogyUnit202: PedagogyManifest = {
  assertionFamilies,
  assertionFamilyMemberships,
  standaloneAssertions,
  capabilities,
  familyTeachingRepresentations,
  formulaFamilies,
  workedExampleBlueprints,
  visualAidBlueprints,
  diagramBlueprints,
  questionBlueprints,
};

export {
  assertionFamilies,
  standaloneAssertions,
  assertionFamilyMemberships,
  capabilities,
  familyTeachingRepresentations,
  diagramBlueprints,
  formulaFamilies,
  workedExampleBlueprints,
  visualAidBlueprints,
  questionBlueprints,
  cc05aPedagogyUnit202,
};
