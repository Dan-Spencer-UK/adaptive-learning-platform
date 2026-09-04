/**
 * CC-22C: the ONLY mechanism that establishes a PA proposition's
 * historical benchmark state. Replaces CC-22B's fuzzy/token matcher and
 * MANUAL_HISTORICAL_OVERRIDES entirely (task section 2) -- every entry
 * below is an explicit, hand-verified binding between a PA_TARGET
 * proposition and one or more real historical Technical Source
 * Verification `propositionCoverage` records, identified by their
 * canonical (clusterKey, requirementKind, requirementText) triple (the
 * schema has no separate stable ID -- see task section 3). build-
 * benchmark.ts resolves each triple against the live historical data and
 * throws if it does not resolve to EXACTLY one record, so a typo here
 * fails the build rather than silently mis-binding.
 *
 * `mappingBasis`:
 *  - EXACT_EQUIVALENT: the historical record's own requirementText
 *    states this exact PA proposition (formula, definition, or
 *    relationship), no broader and no narrower.
 *  - HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET: the historical
 *    record's requirementText is a compound sentence that explicitly
 *    names/contains this specific atomic PA proposition as one of its
 *    parts (task section 5's own worked example -- the series-circuit
 *    "current is common, voltage divides, resistances add" row
 *    supporting three separate PA targets).
 *  - MULTIPLE_HISTORICAL_RECORDS_REQUIRED: the PA proposition is only
 *    fully established by combining >=2 distinct historical records
 *    together (e.g. a defining record plus its own dedicated procedure
 *    record).
 *
 * `historicalCoverageState` is NEVER typed here as the source of truth
 * (task section 3's explicit prohibition) -- build-benchmark.ts derives
 * it mechanically from the real, current `coverageState` of every bound
 * record (task section 6's aggregation rule: SOURCE_GAP dominates,
 * then CONDITIONAL_SOURCE_GAP, else VERIFIED).
 *
 * A PA proposition NOT listed here has NO explicit historical binding
 * and is reported NO_HISTORICAL_BENCHMARK -- conservative under-mapping
 * is deliberate and expected (task section 4/9): a plausible-looking
 * historical row whose exact text does not state the proposition is
 * left unbound rather than guessed.
 */

export interface HistoricalRecordRef {
  readonly clusterKey: string;
  readonly requirementKind: string;
  readonly requirementText: string;
}

export type MappingBasis = "EXACT_EQUIVALENT" | "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET" | "MULTIPLE_HISTORICAL_RECORDS_REQUIRED";

export interface HistoricalBenchmarkBinding {
  readonly paPropositionText: string;
  readonly mappingBasis: MappingBasis;
  readonly records: readonly HistoricalRecordRef[];
  readonly rationale: string;
}

function ref(clusterKey: string, requirementKind: string, requirementText: string): HistoricalRecordRef {
  return { clusterKey, requirementKind, requirementText };
}

// ---------------------------------------------------------------------
// AC1.1 -- foundational-mathematics-for-electrical-work
// ---------------------------------------------------------------------
const MATH = "foundational-mathematics-for-electrical-work";
const R_FRACTIONS_DECIMALS_PCT = ref(MATH, "FACTUAL_PROPOSITION", "The four operations on fractions, decimals and percentages, and proportional reasoning.");
const R_INDEX_LAWS = ref(MATH, "FACTUAL_PROPOSITION", "Laws of indices (multiplying/dividing powers of the same base; fractional indices as roots).");
const R_PYTHAGORAS_TRIG = ref(MATH, "FACTUAL_PROPOSITION", "Pythagoras' theorem and the sine/cosine/tangent ratios for a right triangle.");
const R_RANGE_MEAN_MEDIAN_MODE_DEF = ref(MATH, "FACTUAL_PROPOSITION", "Definitions of range, mean, median and mode for a small dataset.");
const R_TRANSPOSITION = ref(MATH, "RELATIONSHIP_OR_MECHANISM", "Formula transposition: rearranging an equation to isolate an unknown, including squared/root forms.");
const R_SOLVE_RIGHT_TRIANGLE = ref(MATH, "PROCEDURE_OR_CALCULATION_RULE", "Solving a right-triangle side/angle from Pythagoras or a trig ratio.");
const R_COMPUTE_RANGE_MEAN_MEDIAN_MODE = ref(MATH, "PROCEDURE_OR_CALCULATION_RULE", "Computing range/mean/median/mode from a small dataset.");
const R_REARRANGE_EVALUATE_FORMULA = ref(MATH, "PROCEDURE_OR_CALCULATION_RULE", "Rearranging and evaluating a formula for an unknown quantity, including a square/root form.");

// ---------------------------------------------------------------------
// AC2.1 -- si-units-and-physical-quantities
// ---------------------------------------------------------------------
const SIU = "si-units-and-physical-quantities";
const R_SI_BASE_DERIVED_UNITS = ref(SIU, "FACTUAL_PROPOSITION", "The SI base/derived units for length (m), area (m²), volume (m³), mass (kg), density (kg/m³), time (s), temperature (K) and velocity (m/s).");
const R_KELVIN_CELSIUS = ref(SIU, "FACTUAL_PROPOSITION", "Kelvin is the SI base unit of thermodynamic temperature; Celsius is a common practical scale related to it, not the SI unit itself.");
const R_UNIT_CONVERSIONS = ref(SIU, "PROCEDURE_OR_CALCULATION_RULE", "Practical unit conversions used elsewhere in the unit (e.g. mm→m, mm²→m², minutes→seconds).");

// ---------------------------------------------------------------------
// AC2.2 -- electrical-quantities-and-si-units. The cluster's only
// historical record ("The conventional symbol and SI unit for
// resistance (R, Ω), resistivity (ρ, Ω·m), power (P, W), frequency
// (f, Hz), current (I, A), voltage (V, V), energy (E/W, J), impedance
// (Z, Ω), inductance (L, H), inductive reactance (XL, Ω), capacitance
// (C, F), capacitive reactance (XC, Ω), and power factor as a
// dimensionless ratio.") is deliberately never bound here -- see the
// dedicated note near the bottom of this file's AC2.2 section.
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// AC2.3 -- electrical-measurement-instruments
// ---------------------------------------------------------------------
const EMI = "electrical-measurement-instruments";
const R_AMMETER = ref(EMI, "FACTUAL_PROPOSITION", "An ammeter is connected in series and has very low internal resistance.");
const R_VOLTMETER = ref(EMI, "FACTUAL_PROPOSITION", "A voltmeter is connected in parallel and has high internal resistance.");
const R_OHMMETER_DEENERGISED = ref(EMI, "FACTUAL_PROPOSITION", "An ohmmeter requires the circuit under test to be de-energised.");
const R_WATTMETER = ref(EMI, "FACTUAL_PROPOSITION", "A wattmeter measures power via combined current- and voltage-sensing paths.");
const R_ENERGY_METER = ref(EMI, "FACTUAL_PROPOSITION", "An energy meter integrates power over time (kWh).");

// ---------------------------------------------------------------------
// AC3.1 -- mass-and-weight
// ---------------------------------------------------------------------
const MAW = "mass-and-weight";
const R_MASS_DEF = ref(MAW, "FACTUAL_PROPOSITION", "Mass is the amount of matter in an object (kg) and is invariant with location.");
const R_WEIGHT_DEF = ref(MAW, "FACTUAL_PROPOSITION", "Weight is the force due to gravity acting on a mass (N) and depends on gravitational field strength.");
const R_W_EQ_MG = ref(MAW, "RELATIONSHIP_OR_MECHANISM", "W = mg and its rearrangement m = W/g.");
const R_CALC_WEIGHT_FROM_MASS = ref(MAW, "PROCEDURE_OR_CALCULATION_RULE", "Calculating weight from mass (and vice versa) under a stated gravitational field strength.");

// ---------------------------------------------------------------------
// AC3.2 -- simple-machines-levers-gears-pulleys
// ---------------------------------------------------------------------
const SMG = "simple-machines-levers-gears-pulleys";
const R_LEVER_CLASSES = ref(SMG, "FACTUAL_PROPOSITION", "The three lever classes are distinguished by the relative arrangement of fulcrum, effort and load.");
const R_GEAR_RATIO = ref(SMG, "FACTUAL_PROPOSITION", "A gear transmits rotary motion; gear ratio relates tooth count to speed ratio and direction (including the idler effect).");
const R_PULLEY_MA = ref(SMG, "FACTUAL_PROPOSITION", "A pulley system's mechanical advantage relates to the number of supporting strands.");
const R_IDEAL_MACHINE_NO_POWER_CREATE = ref(SMG, "FACTUAL_PROPOSITION", "An ideal machine trades force for distance; it does not create power.");
const R_MOMENT_BALANCE = ref(SMG, "RELATIONSHIP_OR_MECHANISM", "Moment/turning-effect balance: effort × effort-arm = load × load-arm.");
const R_SOLVE_LEVER_BALANCE = ref(SMG, "PROCEDURE_OR_CALCULATION_RULE", "Solving a lever balance problem for an unknown effort, load or distance.");
const R_GEAR_SPEED_DIRECTION = ref(SMG, "PROCEDURE_OR_CALCULATION_RULE", "Determining driven-gear speed/direction from tooth-count ratio.");
const R_PULLEY_EFFORT = ref(SMG, "PROCEDURE_OR_CALCULATION_RULE", "Determining pulley effort from mechanical advantage.");

// ---------------------------------------------------------------------
// AC3.3/3.4 -- work-energy-power-efficiency
// ---------------------------------------------------------------------
const WEP = "work-energy-power-efficiency";
const R_FORCE_DEF = ref(WEP, "FACTUAL_PROPOSITION", "A force is a push or pull that can cause or resist motion, deformation or equilibrium; weight is one example (force due to gravity).");
const R_WORK_DEF = ref(WEP, "FACTUAL_PROPOSITION", "Work is done when a force causes a displacement; work and energy are equivalent in this context.");
const R_KE_PE_DISTINCT = ref(WEP, "FACTUAL_PROPOSITION", "Kinetic energy and potential energy are distinct forms of mechanical energy at Level-2 conceptual depth.");
const R_EFFICIENCY_DEF = ref(WEP, "FACTUAL_PROPOSITION", "Efficiency is the ratio of useful output to total input; total input equals useful output plus losses.");
const R_W_EQ_FD = ref(WEP, "RELATIONSHIP_OR_MECHANISM", "Work/energy = force × distance.");
const R_P_EQ_W_T = ref(WEP, "RELATIONSHIP_OR_MECHANISM", "Power = work (or energy) / time.");
const R_EFF_PCT = ref(WEP, "RELATIONSHIP_OR_MECHANISM", "Efficiency (%) = (useful output / input) × 100.");
const R_MULTISTEP_MECH_CALC = ref(WEP, "PROCEDURE_OR_CALCULATION_RULE", "Multi-step mechanical calculations combining mass/weight, work/energy, time and efficiency (including chained motor/pump efficiency problems).");

// ---------------------------------------------------------------------
// AC4.1 -- electron-theory-and-conduction
// ---------------------------------------------------------------------
const ETC = "electron-theory-and-conduction";
const R_PROTON_ELECTRON_NEUTRON = ref(ETC, "FACTUAL_PROPOSITION", "At a basic level, protons are positive, electrons are negative and neutrons are neutral; atoms are normally neutral with a nucleus and outer electrons.");
const R_METALS_FREE_ELECTRONS = ref(ETC, "FACTUAL_PROPOSITION", "Metals have loosely bound/free electrons available to carry current.");
const R_CLOSED_CIRCUIT_EMF = ref(ETC, "FACTUAL_PROPOSITION", "Current requires a closed circuit and an EMF/potential-difference driver.");
const R_CONVENTIONAL_VS_ELECTRON = ref(ETC, "FACTUAL_PROPOSITION", "Conventional current flow (+ to −) is the opposite direction to electron flow (− to +).");
const R_CURRENT_AS_ELECTRON_FLOW = ref(ETC, "RELATIONSHIP_OR_MECHANISM", "Current as the flow of free electrons through a conductor under an applied potential difference.");

// ---------------------------------------------------------------------
// AC4.2 -- conductors-and-insulators
// ---------------------------------------------------------------------
const CAI = "conductors-and-insulators";
const R_CONDUCTOR_INSULATOR_DEF = ref(CAI, "FACTUAL_PROPOSITION", "A good conductor has readily available/free charge carriers; an insulator tightly binds its outer electrons and presents high resistance.");

// ---------------------------------------------------------------------
// AC4.3 -- resistance-and-resistivity
// ---------------------------------------------------------------------
const RAR = "resistance-and-resistivity";
const R_RES_VS_RESISTIVITY = ref(RAR, "FACTUAL_PROPOSITION", "Resistance (R, Ω) is distinct from resistivity (ρ, Ω·m), a material property.");
const R_RES_PROPORTIONAL_LA = ref(RAR, "FACTUAL_PROPOSITION", "Resistance is directly proportional to conductor length and inversely proportional to cross-sectional area.");
const R_R_EQ_RHOLA = ref(RAR, "RELATIONSHIP_OR_MECHANISM", "R = ρL/A and its rearrangements for ρ, L or A.");
const R_SOLVE_RHOLA = ref(RAR, "PROCEDURE_OR_CALCULATION_RULE", "Solving R = ρL/A for any unknown, with correct area/length unit conversion (e.g. mm²→m²).");

// ---------------------------------------------------------------------
// AC4.4 -- dc-circuit-theory-series-parallel
// ---------------------------------------------------------------------
const DCS = "dc-circuit-theory-series-parallel";
const R_OHMS_LAW = ref(DCS, "FACTUAL_PROPOSITION", "Ohm's law V = IR holds for an ohmic conductor under stated/appropriate conditions.");
const R_SERIES_COMPOUND = ref(DCS, "FACTUAL_PROPOSITION", "In a series circuit: current is common, voltage divides across components, and resistances add.");
const R_PARALLEL_COMPOUND = ref(DCS, "FACTUAL_PROPOSITION", "In a parallel circuit: voltage is common across branches, current divides, and equivalent resistance is below the smallest branch resistance.");
const R_SERIES_RT = ref(DCS, "RELATIONSHIP_OR_MECHANISM", "Series total resistance Rt = ΣR.");
const R_PARALLEL_RT = ref(DCS, "RELATIONSHIP_OR_MECHANISM", "Parallel total resistance 1/Rt = Σ(1/R), including the two-resistor product-over-sum shortcut.");

// ---------------------------------------------------------------------
// AC4.6 -- dc-circuit-power
// ---------------------------------------------------------------------
const DCP = "dc-circuit-power";
const R_P_FORMS = ref(DCP, "RELATIONSHIP_OR_MECHANISM", "P = VI, and its derived forms P = I²R and P = V²/R.");
const R_CALC_POWER_COMPONENT = ref(DCP, "PROCEDURE_OR_CALCULATION_RULE", "Calculating power for an individual component, a whole circuit, or a resistive loss, selecting and rearranging the correct P/V/I/R relationship.");
const R_SUM_COMPONENT_POWERS = ref(DCP, "PROCEDURE_OR_CALCULATION_RULE", "Summing individual component powers to total circuit power in simple series/parallel circuits.");

// ---------------------------------------------------------------------
// AC4.7 -- voltage-drop
// ---------------------------------------------------------------------
const VDR = "voltage-drop";
const R_VDROP_DEF = ref(VDR, "FACTUAL_PROPOSITION", "Voltage drop is the voltage developed across a resistance carrying current (Vdrop = IR).");
const R_LOAD_TERMINAL_VOLTAGE = ref(VDR, "FACTUAL_PROPOSITION", "In a simple circuit, the voltage available at the load equals the supply voltage minus upstream voltage drops.");
const R_VDROP_EQ_IR = ref(VDR, "RELATIONSHIP_OR_MECHANISM", "Vdrop = IR.");
const R_CALC_VDROP = ref(VDR, "PROCEDURE_OR_CALCULATION_RULE", "Calculating voltage drop from current and cable/circuit resistance, and simple supply-minus-drop load-terminal-voltage arithmetic.");

// ---------------------------------------------------------------------
// AC4.8 -- thermal-and-chemical-effects-of-current
// ---------------------------------------------------------------------
const TCE = "thermal-and-chemical-effects-of-current";
const R_THERMAL_EFFECT = ref(TCE, "FACTUAL_PROPOSITION", "Current through a resistance converts electrical energy to heat, with greater heating at greater power/current.");
const R_CHEMICAL_EFFECT = ref(TCE, "FACTUAL_PROPOSITION", "Current through a suitable liquid can produce a chemical change (electrolysis); electroplating is a practical application.");

// ---------------------------------------------------------------------
// AC5.1/5.2 -- magnetism-flux-and-flux-density
// ---------------------------------------------------------------------
const MFD = "magnetism-flux-and-flux-density";
const R_POLES_REPEL_ATTRACT = ref(MFD, "FACTUAL_PROPOSITION", "Like magnetic poles repel; unlike poles attract.");
const R_FIELD_PATTERNS = ref(MFD, "FACTUAL_PROPOSITION", "A magnetic field is the region in which a magnetic effect can be observed; field-line conventions (closed loops, external N→S direction, non-crossing lines).");
const R_FLUX_VS_DENSITY = ref(MFD, "FACTUAL_PROPOSITION", "Magnetic flux (Φ, weber) is distinct from flux density (B, tesla = Wb/m²), which is flux concentration per unit area.");
const R_B_EQ_PHI_A = ref(MFD, "RELATIONSHIP_OR_MECHANISM", "B = Φ/A, and its rearrangements Φ = BA and A = Φ/B.");

// ---------------------------------------------------------------------
// AC5.3 -- electromagnetism-motor-effect-and-induced-emf
// ---------------------------------------------------------------------
const EMM = "electromagnetism-motor-effect-and-induced-emf";
const R_CONDUCTOR_FIELD = ref(EMM, "FACTUAL_PROPOSITION", "A current-carrying conductor produces a magnetic field around it.");
const R_MOTOR_EFFECT = ref(EMM, "FACTUAL_PROPOSITION", "A current-carrying conductor placed in a magnetic field experiences a force (the motor effect).");
const R_MOTIONAL_EMF = ref(EMM, "FACTUAL_PROPOSITION", "A conductor moving through a magnetic field has an EMF induced in it (motional EMF).");
const R_RIGHT_HAND_GRIP = ref(EMM, "RELATIONSHIP_OR_MECHANISM", "Right-hand grip / Maxwell's screw rule for field direction around a straight conductor.");
const R_FLEMING_LH = ref(EMM, "RELATIONSHIP_OR_MECHANISM", "Fleming's left-hand rule for force direction on a current-carrying conductor in a field.");
const R_FLEMING_RH = ref(EMM, "RELATIONSHIP_OR_MECHANISM", "Fleming's right-hand rule for induced-current direction in a conductor moving through a field.");
const R_F_EQ_BIL = ref(EMM, "RELATIONSHIP_OR_MECHANISM", "F = BIl for a conductor perpendicular to the field; reversing B or I reverses the force.");
const R_E_EQ_BLV = ref(EMM, "RELATIONSHIP_OR_MECHANISM", "e = Blv for a conductor moving perpendicular to the field.");
const R_CALC_F_BIL_E_BLV = ref(EMM, "PROCEDURE_OR_CALCULATION_RULE", "Calculating force from F=BIl or induced EMF from e=Blv, including simple rearrangements and unit conversions.");
const R_SOLENOID = ref(EMM, "PHYSICAL_OR_COMPONENT_RECOGNITION", "Coil/solenoid field and polarity; basic electromagnet/relay/contactor principle.");

// ---------------------------------------------------------------------
// AC5.4 -- ac-generation-single-loop-alternator
// ---------------------------------------------------------------------
const ACG = "ac-generation-single-loop-alternator";
const R_LOOP_PRODUCES_EMF = ref(ACG, "FACTUAL_PROPOSITION", "A single loop rotating within a magnetic field, connected via slip rings and brushes, produces an alternating EMF.");
const R_CUTTING_FLUX_EMF = ref(ACG, "FACTUAL_PROPOSITION", "No EMF is induced for motion parallel to the field; maximum EMF occurs for motion perpendicular to (cutting) the field.");
const R_SINE_OUTPUT = ref(ACG, "FACTUAL_PROPOSITION", "The generator's output EMF varies as a sine wave as the loop rotates.");
const R_F_EQ_NP = ref(ACG, "RELATIONSHIP_OR_MECHANISM", "f = N×P where N is rotational speed in rev/s and P is the number of pole pairs (per the C&G handout's own convention -- pole-pair definition requires independent verification, see review flag).");
const R_ONE_CYCLE_PER_POLE_PAIR = ref(ACG, "RELATIONSHIP_OR_MECHANISM", "One cycle of output corresponds to one revolution per pole pair.");
const R_FNP_CALC = ref(ACG, "PROCEDURE_OR_CALCULATION_RULE", "Simple f=N×P calculations and rearrangements; cycle/period/time relations.");
const R_ALTERNATOR_PARTS = ref(ACG, "PHYSICAL_OR_COMPONENT_RECOGNITION", "Slip rings, brushes, poles and coil as the core parts of a single-loop alternator.");

// ---------------------------------------------------------------------
// AC5.5 -- sine-wave-characteristics
// ---------------------------------------------------------------------
const SWC = "sine-wave-characteristics";
const R_SINEWAVE_DEFS = ref(SWC, "FACTUAL_PROPOSITION", "Definitions of amplitude/peak, peak-to-peak, periodic time, frequency, RMS value and average value for a sine wave.");
const R_SIGNED_AVG_ZERO = ref(SWC, "FACTUAL_PROPOSITION", "The signed average of a complete symmetrical sine-wave cycle is zero; the 'average value' used in AC calculations is the average of one alternation.");
const R_VPP = ref(SWC, "RELATIONSHIP_OR_MECHANISM", "Vpp = 2×Vpeak.");
const R_T_EQ_1_F = ref(SWC, "RELATIONSHIP_OR_MECHANISM", "T = 1/f.");
const R_VRMS = ref(SWC, "RELATIONSHIP_OR_MECHANISM", "Vrms ≈ 0.707×Vpeak (and Vpeak ≈ 1.414×Vrms).");
const R_VAVG = ref(SWC, "RELATIONSHIP_OR_MECHANISM", "Vavg ≈ 0.636×Vpeak (average of one alternation), and the analogous current relationships.");
const R_CONVERT_FREQ_PERIOD_RMS = ref(SWC, "PROCEDURE_OR_CALCULATION_RULE", "Converting between frequency and period, and between peak, RMS and average-of-one-alternation values.");

// ---------------------------------------------------------------------
// AC6.1 -- electronic-systems-and-applications
// ---------------------------------------------------------------------
const ESA = "electronic-systems-and-applications";
const R_ALARM_SCR = ref(ESA, "FACTUAL_PROPOSITION", "Security alarm: a transistor provides a switching role and a thyristor provides a latching/sounder role within the circuit.");
const R_DIMMER_TRIAC_DIAC = ref(ESA, "FACTUAL_PROPOSITION", "Dimmer switch: a capacitor provides timing, a DIAC triggers, and a TRIAC provides phase control.");
const R_HEATING_THERMISTOR = ref(ESA, "FACTUAL_PROPOSITION", "Heating/boiler control: a thermistor senses temperature, feeding a switching/relay chain.");
const R_MOTOR_RECTIFICATION = ref(ESA, "FACTUAL_PROPOSITION", "Motor control: rectification and controlled switching/protection at block-function level.");
const R_WIRELESS_TXRX = ref(ESA, "FACTUAL_PROPOSITION", "Wireless control: transmitter/receiver arrangement and its practical advantages.");

// ---------------------------------------------------------------------
// AC6.2 -- electronic-components-operating-principles
// ---------------------------------------------------------------------
const ECO = "electronic-components-operating-principles";
const R_CAPACITOR = ref(ECO, "FACTUAL_PROPOSITION", "A capacitor stores charge/energy in an electric field.");
const R_RESISTOR_COLOURCODE = ref(ECO, "FACTUAL_PROPOSITION", "A resistor opposes current flow; resistors carry a 4-band colour-code rating.");
const R_RECTIFIER = ref(ECO, "FACTUAL_PROPOSITION", "A rectifier converts AC to unidirectional/pulsating DC, with distinct half-wave and full-wave circuit forms.");
const R_DIODE = ref(ECO, "FACTUAL_PROPOSITION", "A diode conducts in one direction only, with anode/cathode terminals.");
const R_ZENER = ref(ECO, "FACTUAL_PROPOSITION", "A Zener diode provides controlled reverse conduction for simple regulation/reference use.");
const R_LED = ref(ECO, "FACTUAL_PROPOSITION", "An LED emits light when correctly forward biased.");
const R_PHOTODIODE_LDR = ref(ECO, "FACTUAL_PROPOSITION", "A photo-sensitive device's behaviour depends on light -- both a photodiode and a light-dependent resistor (LDR) are candidate devices for the Range's terse 'photo' entry (see review flag).");
const R_THERMISTOR = ref(ECO, "FACTUAL_PROPOSITION", "A thermistor's resistance changes with temperature; PTC and NTC are the two types.");
const R_DIAC = ref(ECO, "FACTUAL_PROPOSITION", "A DIAC is a bidirectional breakover device commonly used to trigger a TRIAC.");
const R_TRIAC = ref(ECO, "FACTUAL_PROPOSITION", "A TRIAC is a bidirectional gated AC switching device.");
const R_TRANSISTOR = ref(ECO, "FACTUAL_PROPOSITION", "A transistor can switch or amplify; NPN and PNP are distinguished by symbol.");
const R_THYRISTOR = ref(ECO, "FACTUAL_PROPOSITION", "A thyristor (SCR) is a gate-triggered, latching, unidirectional controlled switch.");
const R_INVERTER = ref(ECO, "FACTUAL_PROPOSITION", "An inverter converts DC to AC, the reverse of a rectifier.");
const R_SCHEMATIC_SYMBOLS = ref(ECO, "SYMBOL_OR_CONVENTION", "Standard schematic symbols for each listed component, including the NPN/PNP transistor distinction.");

export const HISTORICAL_BENCHMARK_BINDINGS: readonly HistoricalBenchmarkBinding[] = [
  // --- AC1.1 ---
  { paPropositionText: "Fractions.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_FRACTIONS_DECIMALS_PCT], rationale: "Record explicitly names 'fractions' as one of the four operations covered." },
  { paPropositionText: "Percentages.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_FRACTIONS_DECIMALS_PCT], rationale: "Record explicitly names 'percentages'." },
  {
    paPropositionText: "Positive indices.",
    mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET",
    records: [R_INDEX_LAWS],
    rationale: "Record's 'multiplying/dividing powers of the same base' is the general index law applying regardless of exponent sign; positive-index use is explicitly within its scope.",
  },
  {
    paPropositionText: "Negative indices.",
    mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET",
    records: [R_INDEX_LAWS],
    rationale: "Same record and reasoning as positive indices -- the base multiplying/dividing law applies to negative exponents too.",
  },
  { paPropositionText: "Pythagoras.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_PYTHAGORAS_TRIG], rationale: "Record explicitly names Pythagoras' theorem." },
  {
    paPropositionText: "Sine/cosine/tangent use in right triangles.",
    mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED",
    records: [R_PYTHAGORAS_TRIG, R_SOLVE_RIGHT_TRIANGLE],
    rationale: "The concept record names the sine/cosine/tangent ratios; the procedure record covers solving from them -- both bear on 'use in right triangles'.",
  },
  { paPropositionText: "Statistical range.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_RANGE_MEAN_MEDIAN_MODE_DEF, R_COMPUTE_RANGE_MEAN_MEDIAN_MODE], rationale: "Definition record explicitly names 'range'; procedure record covers computing it." },
  { paPropositionText: "Mean.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_RANGE_MEAN_MEDIAN_MODE_DEF, R_COMPUTE_RANGE_MEAN_MEDIAN_MODE], rationale: "Definition record explicitly names 'mean'; procedure record covers computing it." },
  { paPropositionText: "Median.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_RANGE_MEAN_MEDIAN_MODE_DEF, R_COMPUTE_RANGE_MEAN_MEDIAN_MODE], rationale: "Definition record explicitly names 'median'; procedure record covers computing it." },
  { paPropositionText: "Mode.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_RANGE_MEAN_MEDIAN_MODE_DEF, R_COMPUTE_RANGE_MEAN_MEDIAN_MODE], rationale: "Definition record explicitly names 'mode'; procedure record covers computing it." },
  { paPropositionText: "Formula transposition.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_TRANSPOSITION, R_REARRANGE_EVALUATE_FORMULA], rationale: "Definition + matching procedure record, both about transposition." },
  { paPropositionText: "Ordinary decimal arithmetic.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_FRACTIONS_DECIMALS_PCT], rationale: "Record explicitly names 'decimals' among the four operations." },
  { paPropositionText: "Proportional reasoning required to execute the above calculations.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_FRACTIONS_DECIMALS_PCT], rationale: "Record explicitly names 'proportional reasoning'." },
  // 'Algebra.' (bare, general topic) deliberately NOT bound -- no historical record addresses algebra
  // generally, only the narrower transposition subset (already bound separately above).
  // 'Standard/scientific notation.' and 'Engineering notation.' deliberately NOT bound -- no
  // historical record anywhere mentions either.

  // --- AC2.1 ---
  { paPropositionText: "Length: correct SI unit and unit symbol.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_SI_BASE_DERIVED_UNITS], rationale: "Record explicitly names length (m)." },
  { paPropositionText: "Area: correct SI unit and unit symbol.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_SI_BASE_DERIVED_UNITS], rationale: "Record explicitly names area (m²)." },
  { paPropositionText: "Volume: correct SI unit and unit symbol.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_SI_BASE_DERIVED_UNITS], rationale: "Record explicitly names volume (m³)." },
  { paPropositionText: "Mass: correct SI unit and unit symbol.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_SI_BASE_DERIVED_UNITS], rationale: "Record explicitly names mass (kg)." },
  { paPropositionText: "Density: correct SI unit and unit symbol.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_SI_BASE_DERIVED_UNITS], rationale: "Record explicitly names density (kg/m³)." },
  { paPropositionText: "Time: correct SI unit and unit symbol.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_SI_BASE_DERIVED_UNITS], rationale: "Record explicitly names time (s)." },
  { paPropositionText: "Velocity: correct SI unit and unit symbol.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_SI_BASE_DERIVED_UNITS], rationale: "Record explicitly names velocity (m/s)." },
  { paPropositionText: "Temperature: correct SI unit and unit symbol.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_SI_BASE_DERIVED_UNITS, R_KELVIN_CELSIUS], rationale: "First record names temperature (K); second dedicated record states the kelvin/Celsius rule exactly." },
  { paPropositionText: "Practical unit conversion needed elsewhere in Unit 202.", mappingBasis: "EXACT_EQUIVALENT", records: [R_UNIT_CONVERSIONS], rationale: "Record states this exactly." },

  // --- AC2.2 (deliberately NOT bound as whole propositions) ---
  // Every AC2.2 quantity's PA proposition requires meaning + quantity symbol + unit name/symbol +
  // relevant distinction (task section 5 of CC-22B). The only historical record for this cluster
  // (quoted in the section header comment above) states symbol+unit only -- it never states what
  // any quantity MEANS. Per
  // task section 5's own caution ("a historical row that supports only one part of a PA
  // proposition cannot establish the whole target") and section 6's aggregation rule, none of the
  // 11 AC2.2 propositions can be bound as a whole -- each is left NO_HISTORICAL_BENCHMARK.

  // --- AC2.3 ---
  { paPropositionText: "Ammeter: measures current + series connection.", mappingBasis: "EXACT_EQUIVALENT", records: [R_AMMETER], rationale: "Record names the ammeter and its series connection; 'measures current' is the instrument's stated identity, restated by naming it." },
  { paPropositionText: "Voltmeter: measures potential difference + parallel connection.", mappingBasis: "EXACT_EQUIVALENT", records: [R_VOLTMETER], rationale: "Record names the voltmeter and its parallel connection." },
  { paPropositionText: "Ohmmeter: circuit de-energised/safe-use principle.", mappingBasis: "EXACT_EQUIVALENT", records: [R_OHMMETER_DEENERGISED], rationale: "Record states this exactly." },
  { paPropositionText: "Wattmeter: measures electrical power + appropriate current/voltage sensing arrangement at qualification depth.", mappingBasis: "EXACT_EQUIVALENT", records: [R_WATTMETER], rationale: "Record states this exactly (coverageState SOURCE_GAP)." },
  { paPropositionText: "Energy meter: measures/integrates electrical energy.", mappingBasis: "EXACT_EQUIVALENT", records: [R_ENERGY_METER], rationale: "Record states this exactly." },
  // 'Ohmmeter: measures resistance.' deliberately NOT bound -- the only ohmmeter record is entirely
  // about the de-energised safe-use principle; it never separately states 'measures resistance'.

  // --- AC3.1 ---
  { paPropositionText: "Mass meaning.", mappingBasis: "EXACT_EQUIVALENT", records: [R_MASS_DEF], rationale: "Record states this exactly." },
  { paPropositionText: "Weight meaning.", mappingBasis: "EXACT_EQUIVALENT", records: [R_WEIGHT_DEF], rationale: "Record states this exactly." },
  { paPropositionText: "Mass/weight distinction.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_MASS_DEF, R_WEIGHT_DEF], rationale: "The two definitions (invariant matter-quantity vs field-dependent gravitational force) together establish the distinction." },
  { paPropositionText: "F = mg.", mappingBasis: "EXACT_EQUIVALENT", records: [R_W_EQ_MG], rationale: "Record states W = mg, the same relationship." },
  { paPropositionText: "Appropriate mass/weight calculations.", mappingBasis: "EXACT_EQUIVALENT", records: [R_CALC_WEIGHT_FROM_MASS], rationale: "Record states this exactly." },

  // --- AC3.2 ---
  { paPropositionText: "Lever classes.", mappingBasis: "EXACT_EQUIVALENT", records: [R_LEVER_CLASSES], rationale: "Record states this exactly." },
  { paPropositionText: "Basic lever effort/load/arm relationship at appropriate depth.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_MOMENT_BALANCE, R_SOLVE_LEVER_BALANCE], rationale: "Relationship record states the moment-balance formula; procedure record covers solving it." },
  { paPropositionText: "Gears.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_GEAR_RATIO], rationale: "Record introduces gears generally before stating the ratio relationship." },
  { paPropositionText: "Gear ratio / legitimate speed relationship.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_GEAR_RATIO, R_GEAR_SPEED_DIRECTION], rationale: "Relationship record states the ratio; procedure record covers determining speed/direction from it." },
  { paPropositionText: "Pulleys.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_PULLEY_MA], rationale: "Record introduces pulleys generally before stating the mechanical-advantage relationship." },
  { paPropositionText: "Mechanical advantage.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_IDEAL_MACHINE_NO_POWER_CREATE, R_PULLEY_MA, R_PULLEY_EFFORT], rationale: "General force-for-distance-trade record, the pulley-specific mechanical-advantage record, and the matching procedure record for determining effort from mechanical advantage." },
  { paPropositionText: "Force-distance trade.", mappingBasis: "EXACT_EQUIVALENT", records: [R_IDEAL_MACHINE_NO_POWER_CREATE], rationale: "Record states this exactly ('trades force for distance')." },
  { paPropositionText: "Ideal machine conserves power.", mappingBasis: "EXACT_EQUIVALENT", records: [R_IDEAL_MACHINE_NO_POWER_CREATE], rationale: "'It does not create power' is the same conservation statement in negative form." },
  // 'Levers.' (bare general topic), 'Torque-speed relationship where applicable.', and 'Real losses
  // reduce useful output.' deliberately NOT bound -- no historical record states a general levers
  // topic separate from lever classes/moment balance, uses the word 'torque', or discusses real
  // losses (only the ideal, lossless case is stated).

  // --- AC3.3/3.4 ---
  { paPropositionText: "Force concept at qualification depth.", mappingBasis: "EXACT_EQUIVALENT", records: [R_FORCE_DEF], rationale: "Record states this exactly (coverageState CONDITIONAL_SOURCE_GAP)." },
  { paPropositionText: "Work.", mappingBasis: "EXACT_EQUIVALENT", records: [R_WORK_DEF], rationale: "Record states this exactly." },
  { paPropositionText: "Energy.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_KE_PE_DISTINCT], rationale: "Record's discussion of energy's two forms entails the general energy concept." },
  { paPropositionText: "Kinetic versus potential energy concept.", mappingBasis: "EXACT_EQUIVALENT", records: [R_KE_PE_DISTINCT], rationale: "Record states this exactly." },
  { paPropositionText: "Power.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_P_EQ_W_T], rationale: "The Power = work/time relationship record states what power is as well as the relationship." },
  { paPropositionText: "Efficiency.", mappingBasis: "EXACT_EQUIVALENT", records: [R_EFFICIENCY_DEF], rationale: "Record states this exactly." },
  {
    paPropositionText: "Relationships between force, work, energy, power and efficiency.",
    mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED",
    records: [R_W_EQ_FD, R_P_EQ_W_T, R_EFF_PCT, R_MULTISTEP_MECH_CALC],
    rationale: "No single historical record states the holistic inter-relationship; the four constituent relationship/procedure records, taken together, establish it.",
  },
  { paPropositionText: "W = Fd.", mappingBasis: "EXACT_EQUIVALENT", records: [R_W_EQ_FD], rationale: "Record states this exactly." },
  { paPropositionText: "F = mg where relevant.", mappingBasis: "EXACT_EQUIVALENT", records: [R_W_EQ_MG], rationale: "Same underlying relationship as AC3.1's F=mg, cross-referenced to the mass-and-weight cluster's record explicitly." },
  { paPropositionText: "P = W/t.", mappingBasis: "EXACT_EQUIVALENT", records: [R_P_EQ_W_T], rationale: "Record states this exactly." },
  { paPropositionText: "Efficiency relationship.", mappingBasis: "EXACT_EQUIVALENT", records: [R_EFF_PCT], rationale: "Record states this exactly." },
  { paPropositionText: "Legitimate multistep mechanical calculations.", mappingBasis: "EXACT_EQUIVALENT", records: [R_MULTISTEP_MECH_CALC], rationale: "Record states this exactly." },
  // 'Gravitational lifting / work against gravity.' and 'PE = mgh / work-against-gravity
  // equivalence.' deliberately NOT bound -- no historical record states either; the only PE-related
  // record (R_KE_PE_DISTINCT) is conceptual only and never gives the mgh formula.

  // --- AC4.1 ---
  {
    paPropositionText: "Basic electron theory.",
    mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED",
    records: [R_PROTON_ELECTRON_NEUTRON, R_METALS_FREE_ELECTRONS, R_CLOSED_CIRCUIT_EMF, R_CONVENTIONAL_VS_ELECTRON, R_CURRENT_AS_ELECTRON_FLOW],
    rationale: "The whole electron-theory cluster (5 records) together constitutes 'basic electron theory'.",
  },
  { paPropositionText: "Current as charge/electron-flow concept at calibrated depth.", mappingBasis: "EXACT_EQUIVALENT", records: [R_CURRENT_AS_ELECTRON_FLOW], rationale: "Record states this exactly." },
  { paPropositionText: "Conventional-current versus electron-flow distinction.", mappingBasis: "EXACT_EQUIVALENT", records: [R_CONVENTIONAL_VS_ELECTRON], rationale: "Record states this exactly." },

  // --- AC4.2 ---
  { paPropositionText: "Conductors.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_CONDUCTOR_INSULATOR_DEF], rationale: "Record explicitly defines conductors (as well as insulators)." },
  { paPropositionText: "Insulators.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_CONDUCTOR_INSULATOR_DEF], rationale: "Record explicitly defines insulators (as well as conductors) -- the same single row supports both PA targets." },

  // --- AC4.3 ---
  { paPropositionText: "Resistance.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_RES_VS_RESISTIVITY], rationale: "Record's distinction statement names and characterises resistance." },
  { paPropositionText: "Resistivity.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_RES_VS_RESISTIVITY, R_RES_PROPORTIONAL_LA], rationale: "Distinction record names resistivity; proportionality record gives its length/area dependence." },
  { paPropositionText: "Rho (resistivity symbol).", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_RES_VS_RESISTIVITY], rationale: "Record explicitly gives the symbol 'ρ'." },
  { paPropositionText: "Ohm-metre (resistivity unit).", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_RES_VS_RESISTIVITY], rationale: "Record explicitly gives the unit 'Ω·m'." },
  { paPropositionText: "R = rho L/A and appropriate rearrangement/use.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_R_EQ_RHOLA, R_SOLVE_RHOLA], rationale: "Relationship record states the formula and its rearrangements; procedure record covers solving it." },

  // --- AC4.4 ---
  { paPropositionText: "Ohm's law.", mappingBasis: "EXACT_EQUIVALENT", records: [R_OHMS_LAW], rationale: "Record states this exactly." },
  { paPropositionText: "V = IR and rearrangements.", mappingBasis: "EXACT_EQUIVALENT", records: [R_OHMS_LAW], rationale: "Record states the identical relationship." },
  { paPropositionText: "Series circuit: current common throughout.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_SERIES_COMPOUND], rationale: "Task section 5's own worked example -- record explicitly contains 'current is common'." },
  { paPropositionText: "Series circuit: voltage shares/sums.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_SERIES_COMPOUND], rationale: "Same compound record explicitly contains 'voltage divides across components'." },
  { paPropositionText: "Series circuit: resistance sums.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_SERIES_COMPOUND, R_SERIES_RT], rationale: "Compound record explicitly contains 'resistances add'; dedicated relationship record states Rt=ΣR precisely." },
  { paPropositionText: "Parallel circuit: voltage common across branches.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_PARALLEL_COMPOUND], rationale: "Record explicitly contains 'voltage is common across branches'." },
  { paPropositionText: "Parallel circuit: current divides/sums.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_PARALLEL_COMPOUND], rationale: "Record explicitly contains 'current divides'." },
  { paPropositionText: "Parallel circuit: equivalent-resistance relationship.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_PARALLEL_COMPOUND, R_PARALLEL_RT], rationale: "Compound record states the qualitative relationship; dedicated relationship record gives 1/Rt=Σ(1/R) precisely." },

  // --- AC4.6 ---
  { paPropositionText: "P = VI.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_P_FORMS], rationale: "Task section 5-style compound record explicitly contains 'P = VI'." },
  { paPropositionText: "P = I^2 R.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_P_FORMS], rationale: "Same compound record explicitly contains 'P = I²R'." },
  { paPropositionText: "P = V^2/R where appropriate.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_P_FORMS], rationale: "Same compound record explicitly contains 'P = V²/R'." },
  { paPropositionText: "Suitable DC-circuit-power calculations.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_CALC_POWER_COMPONENT, R_SUM_COMPONENT_POWERS], rationale: "Two dedicated procedure records cover per-component and summed circuit power calculations." },

  // --- AC4.7 ---
  { paPropositionText: "Voltage drop: voltage loss across resistance carrying current.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_VDROP_DEF, R_LOAD_TERMINAL_VOLTAGE], rationale: "Both records state aspects of the voltage-loss concept." },
  { paPropositionText: "Vdrop = IR.", mappingBasis: "EXACT_EQUIVALENT", records: [R_VDROP_EQ_IR], rationale: "Record states this exactly." },
  { paPropositionText: "Appropriate voltage-drop calculation.", mappingBasis: "EXACT_EQUIVALENT", records: [R_CALC_VDROP], rationale: "Record states this exactly." },

  // --- AC4.8 ---
  { paPropositionText: "Thermal effect of current.", mappingBasis: "EXACT_EQUIVALENT", records: [R_THERMAL_EFFECT], rationale: "Record states this exactly." },
  { paPropositionText: "Chemical effect / electrolysis.", mappingBasis: "EXACT_EQUIVALENT", records: [R_CHEMICAL_EFFECT], rationale: "Record states this exactly." },

  // --- AC5.1/5.2 ---
  { paPropositionText: "Magnetic attraction/repulsion.", mappingBasis: "EXACT_EQUIVALENT", records: [R_POLES_REPEL_ATTRACT], rationale: "Record states this exactly." },
  { paPropositionText: "Magnetic field patterns.", mappingBasis: "EXACT_EQUIVALENT", records: [R_FIELD_PATTERNS], rationale: "Record states this exactly." },
  { paPropositionText: "Magnetic flux: meaning, symbol, unit.", mappingBasis: "EXACT_EQUIVALENT", records: [R_FLUX_VS_DENSITY], rationale: "Record's distinguishing definition states flux's meaning, symbol (Φ) and unit (weber)." },
  { paPropositionText: "Magnetic flux density: meaning, symbol, unit.", mappingBasis: "EXACT_EQUIVALENT", records: [R_FLUX_VS_DENSITY], rationale: "Same record states flux density's meaning, symbol (B) and unit (tesla = Wb/m²) -- one historical row explicitly supporting two PA targets." },
  { paPropositionText: "B = Phi/A and appropriate rearrangement/use.", mappingBasis: "EXACT_EQUIVALENT", records: [R_B_EQ_PHI_A], rationale: "Record states this exactly." },

  // --- AC5.3 ---
  { paPropositionText: "Magnetic field around a current-carrying conductor.", mappingBasis: "EXACT_EQUIVALENT", records: [R_CONDUCTOR_FIELD], rationale: "Record states this exactly." },
  { paPropositionText: "Right-hand grip rule.", mappingBasis: "EXACT_EQUIVALENT", records: [R_RIGHT_HAND_GRIP], rationale: "Record states this exactly." },
  { paPropositionText: "Solenoid magnetic field.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_SOLENOID], rationale: "Record explicitly names 'coil/solenoid field' (coverageState CONDITIONAL_SOURCE_GAP)." },
  { paPropositionText: "Solenoid polarity.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_SOLENOID], rationale: "Same record explicitly names 'polarity'." },
  { paPropositionText: "Basic electromagnet principle.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_SOLENOID], rationale: "Same record explicitly names 'basic electromagnet...principle' -- one historical row explicitly supporting three PA targets." },
  { paPropositionText: "Motor effect.", mappingBasis: "EXACT_EQUIVALENT", records: [R_MOTOR_EFFECT], rationale: "Record states this exactly." },
  { paPropositionText: "Scalar F = BIl.", mappingBasis: "EXACT_EQUIVALENT", records: [R_F_EQ_BIL], rationale: "Record states this exactly." },
  { paPropositionText: "Fleming left-hand rule.", mappingBasis: "EXACT_EQUIVALENT", records: [R_FLEMING_LH], rationale: "Record states this exactly (coverageState SOURCE_GAP)." },
  { paPropositionText: "Motional/induced EMF causal concept.", mappingBasis: "EXACT_EQUIVALENT", records: [R_MOTIONAL_EMF], rationale: "Record states this exactly." },
  { paPropositionText: "e = Blv.", mappingBasis: "EXACT_EQUIVALENT", records: [R_E_EQ_BLV], rationale: "Record states this exactly." },
  { paPropositionText: "Fleming right-hand/generator rule.", mappingBasis: "EXACT_EQUIVALENT", records: [R_FLEMING_RH], rationale: "Record states this exactly (coverageState SOURCE_GAP)." },
  { paPropositionText: "Suitable simple electromagnetism calculations/rearrangements.", mappingBasis: "EXACT_EQUIVALENT", records: [R_CALC_F_BIL_E_BLV], rationale: "Record states this exactly." },

  // --- AC5.4 ---
  { paPropositionText: "Single-loop alternator/generator parts.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_ALTERNATOR_PARTS], rationale: "Record explicitly names the parts." },
  { paPropositionText: "Coil.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_ALTERNATOR_PARTS], rationale: "Record explicitly names 'coil'." },
  { paPropositionText: "Magnetic poles.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_ALTERNATOR_PARTS], rationale: "Record explicitly names 'poles'." },
  { paPropositionText: "Slip rings.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_ALTERNATOR_PARTS], rationale: "Record explicitly names 'slip rings' -- one historical row explicitly supporting four PA targets (parts, coil, poles, slip rings; brushes below)." },
  { paPropositionText: "Brushes.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_ALTERNATOR_PARTS], rationale: "Record explicitly names 'brushes'." },
  { paPropositionText: "Rotation/field-cutting causality.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_LOOP_PRODUCES_EMF, R_CUTTING_FLUX_EMF], rationale: "First record states rotation produces EMF; second states the cutting-dependence causality precisely." },
  { paPropositionText: "No/minimum induced EMF when motion does not cut flux appropriately.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_CUTTING_FLUX_EMF], rationale: "Record explicitly contains 'No EMF is induced for motion parallel to the field'." },
  { paPropositionText: "Maximum induced EMF when cutting is maximum.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_CUTTING_FLUX_EMF], rationale: "Same record explicitly contains 'maximum EMF occurs for motion perpendicular to (cutting) the field'." },
  { paPropositionText: "Alternating/sinusoidal output concept.", mappingBasis: "EXACT_EQUIVALENT", records: [R_SINE_OUTPUT], rationale: "Record states this exactly." },
  { paPropositionText: "Frequency relationship to rotational speed and pole pairs.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_F_EQ_NP, R_ONE_CYCLE_PER_POLE_PAIR], rationale: "Both records state aspects of the frequency/speed/pole-pair relationship." },
  { paPropositionText: "f = N x P (N = rev/s, P = pole pairs).", mappingBasis: "EXACT_EQUIVALENT", records: [R_F_EQ_NP], rationale: "Record states this exactly." },
  { paPropositionText: "Appropriate simple AC-generation calculations.", mappingBasis: "EXACT_EQUIVALENT", records: [R_FNP_CALC], rationale: "Record states this exactly." },
  // 'Equivalent rpm relationship f = n_rpm x P / 60.' deliberately NOT bound -- no propositionCoverage
  // record states the rpm-divided-by-60 form as its own requirementText (only the rev/s form,
  // R_F_EQ_NP, is a recorded requirement); the dossier's header prose mentions a source discussing
  // it but that is not itself a requirementText this file can bind to.

  // --- AC5.5 ---
  { paPropositionText: "Amplitude / peak.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_SINEWAVE_DEFS], rationale: "Record explicitly lists 'amplitude/peak'." },
  { paPropositionText: "Peak-to-peak.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_SINEWAVE_DEFS, R_VPP], rationale: "Definitions record names peak-to-peak; dedicated relationship record gives Vpp=2xVpeak." },
  { paPropositionText: "Periodic time.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_SINEWAVE_DEFS, R_T_EQ_1_F], rationale: "Definitions record names periodic time; dedicated relationship record gives T=1/f." },
  { paPropositionText: "Frequency.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_SINEWAVE_DEFS], rationale: "Record explicitly lists 'frequency'." },
  { paPropositionText: "T = 1/f.", mappingBasis: "EXACT_EQUIVALENT", records: [R_T_EQ_1_F], rationale: "Record states this exactly." },
  { paPropositionText: "RMS.", mappingBasis: "MULTIPLE_HISTORICAL_RECORDS_REQUIRED", records: [R_SINEWAVE_DEFS, R_VRMS], rationale: "Definitions record names RMS value; dedicated relationship record gives the 0.707/1.414 constants." },
  { paPropositionText: "Vrms ~= 0.707 x Vpeak.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_VRMS], rationale: "Record explicitly contains 'Vrms ≈ 0.707×Vpeak'." },
  { paPropositionText: "Vpeak ~= 1.414 x Vrms.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_VRMS], rationale: "Same record explicitly contains 'Vpeak ≈ 1.414×Vrms' -- one historical row explicitly supporting two PA targets." },
  {
    paPropositionText: "Average over one alternation ~= 0.6366 x Vpeak.",
    mappingBasis: "EXACT_EQUIVALENT",
    records: [R_VAVG],
    rationale: "Record states Vavg≈0.636×Vpeak -- the same relationship; the dossier's own header documents 0.636 vs 0.6366 as equally valid roundings of 2/pi.",
  },
  { paPropositionText: "Analogous current relationship where applicable.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_VAVG], rationale: "Same record explicitly contains 'and the analogous current relationships'." },
  { paPropositionText: "Signed average of a complete symmetrical sine-wave cycle = 0.", mappingBasis: "EXACT_EQUIVALENT", records: [R_SIGNED_AVG_ZERO], rationale: "Record states this exactly." },
  { paPropositionText: "Appropriate sine-wave conversions/calculations.", mappingBasis: "EXACT_EQUIVALENT", records: [R_CONVERT_FREQ_PERIOD_RMS], rationale: "Record states this exactly." },

  // --- AC6.1 ---
  { paPropositionText: "Wireless control systems: application category/function.", mappingBasis: "EXACT_EQUIVALENT", records: [R_WIRELESS_TXRX], rationale: "Record names the wireless-control category and its function directly (unlike the other five applications, whose records address only a specific exemplar detail, not the bare category)." },
  { paPropositionText: "Security alarm: SCR/thyristor latching + sounder role.", mappingBasis: "EXACT_EQUIVALENT", records: [R_ALARM_SCR], rationale: "Record states this exactly (coverageState SOURCE_GAP)." },
  { paPropositionText: "Dimmer: TRIAC AC switching/control.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_DIMMER_TRIAC_DIAC], rationale: "Record explicitly contains 'a TRIAC provides phase control' (coverageState SOURCE_GAP)." },
  { paPropositionText: "Dimmer: DIAC triggering.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_DIMMER_TRIAC_DIAC], rationale: "Same record explicitly contains 'a DIAC triggers'." },
  { paPropositionText: "Dimmer: basic timing/control -> delivered-power relationship.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_DIMMER_TRIAC_DIAC], rationale: "Same record explicitly contains 'a capacitor provides timing...TRIAC provides phase control' -- one historical row explicitly supporting three PA targets, all SOURCE_GAP." },
  { paPropositionText: "Heating: thermistor sensing role.", mappingBasis: "EXACT_EQUIVALENT", records: [R_HEATING_THERMISTOR], rationale: "Record states this exactly." },
  { paPropositionText: "Motor: controlled electronic switching at general Level-2 depth.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_MOTOR_RECTIFICATION], rationale: "Record explicitly contains 'controlled switching/protection at block-function level' (coverageState CONDITIONAL_SOURCE_GAP)." },
  // The other five AC6.1 bare 'category/function' propositions (security alarms, telephones,
  // dimmer switches, heating/boiler controls, motor control) deliberately NOT bound -- their
  // historical records each address only a specific exemplar/rectification detail, never the bare
  // application category itself (unlike wireless, whose record is framed at exactly that level).
  // 'Telephone: capacitor -> ringer.' and 'Motor: bridge rectifier converts AC to DC.' deliberately
  // NOT bound -- no historical record states either; the telephone record concerns master-socket
  // currency (a different, unrelated fact) and the motor record is generic rectification, never
  // naming a BRIDGE topology specifically.

  // --- AC6.2 ---
  { paPropositionText: "Capacitor: basic operating principle.", mappingBasis: "EXACT_EQUIVALENT", records: [R_CAPACITOR], rationale: "Record states this exactly." },
  { paPropositionText: "DIAC: basic operating principle.", mappingBasis: "EXACT_EQUIVALENT", records: [R_DIAC], rationale: "Record states this exactly." },
  { paPropositionText: "Diode: basic operating principle.", mappingBasis: "EXACT_EQUIVALENT", records: [R_DIODE], rationale: "Record states this exactly." },
  { paPropositionText: "Inverter: basic operating principle.", mappingBasis: "EXACT_EQUIVALENT", records: [R_INVERTER], rationale: "Record states this exactly." },
  { paPropositionText: "LED: basic operating principle.", mappingBasis: "EXACT_EQUIVALENT", records: [R_LED], rationale: "Record states this exactly." },
  { paPropositionText: "Photodiode: basic operating principle.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_PHOTODIODE_LDR], rationale: "Record explicitly names 'a photodiode' as one of the two candidate devices." },
  { paPropositionText: "LDR (light-dependent resistor): basic operating principle.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_PHOTODIODE_LDR], rationale: "Same record explicitly names 'a light-dependent resistor (LDR)' -- one historical row explicitly supporting two PA targets, exactly resolving the terse 'photo' Range entry." },
  { paPropositionText: "Rectifier: basic operating principle.", mappingBasis: "EXACT_EQUIVALENT", records: [R_RECTIFIER], rationale: "Record states this exactly (coverageState CONDITIONAL_SOURCE_GAP)." },
  { paPropositionText: "Resistor: basic operating principle.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_RESISTOR_COLOURCODE], rationale: "Record explicitly states the operating principle ('opposes current flow')." },
  { paPropositionText: "Thermistor: basic operating principle.", mappingBasis: "EXACT_EQUIVALENT", records: [R_THERMISTOR], rationale: "Record states this exactly." },
  { paPropositionText: "Thyristor (SCR): basic operating principle.", mappingBasis: "EXACT_EQUIVALENT", records: [R_THYRISTOR], rationale: "Record states this exactly." },
  { paPropositionText: "Transistor: basic operating principle.", mappingBasis: "EXACT_EQUIVALENT", records: [R_TRANSISTOR], rationale: "Record states this exactly." },
  { paPropositionText: "TRIAC: basic operating principle.", mappingBasis: "EXACT_EQUIVALENT", records: [R_TRIAC], rationale: "Record states this exactly (coverageState SOURCE_GAP)." },
  { paPropositionText: "Zener diode: basic operating principle.", mappingBasis: "EXACT_EQUIVALENT", records: [R_ZENER], rationale: "Record states this exactly." },
  { paPropositionText: "Schematic-symbol recognition for each named AC6.2 component/device family at qualification depth.", mappingBasis: "EXACT_EQUIVALENT", records: [R_SCHEMATIC_SYMBOLS], rationale: "Record states this exactly (coverageState CONDITIONAL_SOURCE_GAP)." },
  { paPropositionText: "4-band resistor colour code.", mappingBasis: "HISTORICAL_COMPOUND_EXPLICITLY_CONTAINS_TARGET", records: [R_RESISTOR_COLOURCODE], rationale: "Same record explicitly states 'resistors carry a 4-band colour-code rating' -- the same historical row explicitly supporting both the resistor operating-principle PA target and this calibrated supporting-performance PA target." },
] as const;
