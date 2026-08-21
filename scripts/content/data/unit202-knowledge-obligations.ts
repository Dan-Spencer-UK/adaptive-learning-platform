/**
 * CC-09B.1: Unit 202 knowledge-obligation decomposition.
 *
 * A durable authoring/audit artefact, NOT learner content (task brief
 * section 4) -- it exists so a curriculum requirement can never again be
 * declared "knowledge complete" merely because a coverage counter is
 * non-zero (the exact false-green failure mode CC-09B's mechanical
 * checks allowed: a curriculum node had *a* mapped assertion, which is
 * REFERENTIAL coverage, silently read as SEMANTIC completeness).
 *
 * For every official Assessment Criterion, this file declares the
 * discrete factual/procedural obligations that AC genuinely imposes (per
 * the official handbook's own AC/Range wording -- see
 * cc04-unit202-electrical-science.ts's UNIT202_R2_STRUCTURE, the single
 * source of truth for what the curriculum actually requires), and which
 * real governed assertion(s) satisfy each one. `scripts/content/report-
 * coverage-matrix.ts` cross-checks `satisfiedBy` against the live corpus
 * mechanically (an obligation naming an assertion that does not exist is
 * a structural defect, not silently ignored) and computes SEMANTIC
 * completeness from this -- never inferred from assertion count, Range-
 * item-mapping count, or any other proxy (task brief section 8's explicit
 * "do not make the validator pretend it can infer semantic completeness
 * from assertion count alone").
 *
 * An AC with no entry in `AC_OBLIGATIONS` is INCOMPLETE by definition --
 * absence of a decomposition is never silently read as "nothing to
 * decompose, therefore complete" (task brief section 7: "23/23 mapped
 * must NOT be visually or mechanically confused with 23/23 semantically
 * complete").
 *
 * This is deliberately NOT a new governed database entity/table -- it is
 * plain authoring data, validated the same way the knowledge-graph/
 * pedagogy manifests already are (a schema-independent script cross-
 * checks it against the live corpus), per task brief section 5's
 * explicit instruction not to overbuild a new domain model.
 */

export interface KnowledgeObligation {
  /** Stable slug, unique within its AC, e.g. "force-meaning". */
  id: string;
  /** The discrete factual/procedural obligation this AC imposes, in plain English -- never learner-facing content. */
  description: string;
  /** Governed assertion identifier(s) that satisfy this obligation. Cross-checked against the live corpus; an unresolved id is a structural defect, not a silent gap. */
  satisfiedBy: string[];
}

export interface AcObligationSet {
  /** Official AC number, e.g. "3.3". */
  acNumber: string;
  obligations: KnowledgeObligation[];
}

export const AC_OBLIGATIONS: readonly AcObligationSet[] = [
  {
    acNumber: "1.1",
    obligations: [
      { id: "fractions-percentages", description: "Apply the four operations to fractions; interpret and use percentages.", satisfiedBy: ["FM-ARITH-FRACTION-OPS-001", "FM-ARITH-PERCENTAGE-001"] },
      { id: "algebra", description: "Understand inverse operations and the principle that an equation's equality is preserved by an operation applied to both sides.", satisfiedBy: ["FM-ALG-INVERSE-OPS-MULT-001", "FM-ALG-INVERSE-OPS-ADD-001", "FM-ALG-EQUALITY-MULT-001", "FM-ALG-EQUALITY-ADD-001"] },
      { id: "indices", description: "Apply the laws of indices (multiplying/dividing powers of the same base; fractional indices as roots).", satisfiedBy: ["FM-NUM-INDICES-LAWS-001"] },
      { id: "transposition", description: "Rearrange a formula to change its subject, and substitute known values to find an unknown.", satisfiedBy: ["FM-ALG-TRANSPOSE-MULT-001", "FM-ALG-TRANSPOSE-ADD-001", "FM-ALG-SUBSTITUTION-001"] },
      { id: "triangles-trigonometry", description: "State Pythagoras' theorem and the sine/cosine/tangent ratios, AND apply them to find an unknown side or angle.", satisfiedBy: ["FM-GEOM-PYTHAGORAS-001", "FM-GEOM-TRIG-RATIOS-001", "FM-CALC-PYTHAGORAS-001", "FM-CALC-TRIG-RATIO-001"] },
      { id: "statistics", description: "Interpret the mean and range of a data set.", satisfiedBy: ["FM-STATS-MEAN-001", "FM-STATS-RANGE-001"] },
    ],
  },
  {
    acNumber: "2.1",
    obligations: [
      { id: "length", description: "Identify the SI unit of length.", satisfiedBy: ["FP-UNIT-METRE-001"] },
      { id: "area", description: "Identify the SI unit of area.", satisfiedBy: ["FP-UNIT-SQUARE-METRE-001"] },
      { id: "volume", description: "Identify the SI unit of volume.", satisfiedBy: ["FP-UNIT-CUBIC-METRE-001"] },
      { id: "mass", description: "Identify the SI unit of mass.", satisfiedBy: ["FP-UNIT-KILOGRAM-001"] },
      { id: "density", description: "Identify the SI unit of density.", satisfiedBy: ["FP-UNIT-DENSITY-001"] },
      { id: "time", description: "Identify the SI unit of time.", satisfiedBy: ["FP-UNIT-SECOND-001"] },
      { id: "temperature", description: "Identify the SI unit of temperature and its relationship to Celsius.", satisfiedBy: ["FP-UNIT-KELVIN-CELSIUS-001"] },
      { id: "velocity", description: "Identify the SI unit of velocity.", satisfiedBy: ["FP-UNIT-METRE-PER-SECOND-001"] },
      { id: "base-vs-derived", description: "Distinguish an SI base unit from an SI derived unit.", satisfiedBy: ["EL-UNIT-BASE-VS-DERIVED-001"] },
    ],
  },
  {
    acNumber: "2.2",
    obligations: [
      { id: "resistance", description: "Identify the SI unit of resistance.", satisfiedBy: ["EL-UNIT-OHM-001", "EL-CONCEPT-RESISTANCE-001"] },
      { id: "resistivity", description: "Identify the SI unit of resistivity.", satisfiedBy: ["EL-UNIT-OHM-METRE-001"] },
      { id: "power", description: "Identify the SI unit of power.", satisfiedBy: ["EL-UNIT-WATT-001", "EL-CONCEPT-POWER-001"] },
      { id: "frequency", description: "Identify the SI unit of frequency.", satisfiedBy: ["EL-UNIT-HERTZ-001", "EL-CONCEPT-FREQUENCY-001"] },
      { id: "current", description: "Identify the SI unit of current.", satisfiedBy: ["EL-UNIT-AMPERE-001", "EL-CONCEPT-CURRENT-001"] },
      { id: "voltage", description: "Identify the SI unit of voltage.", satisfiedBy: ["EL-UNIT-VOLT-001", "EL-CONCEPT-VOLTAGE-001"] },
      { id: "energy", description: "Identify the SI unit of energy.", satisfiedBy: ["EL-UNIT-JOULE-001", "EL-CONCEPT-ENERGY-001"] },
      { id: "impedance", description: "Understand impedance as combined resistance/reactance and its unit.", satisfiedBy: ["EL-CONCEPT-IMPEDANCE-001"] },
      { id: "inductance-and-inductive-reactance", description: "Distinguish inductance (henry) from inductive reactance (ohm), and state inductive reactance's frequency dependence.", satisfiedBy: ["EL-UNIT-HENRY-001", "EL-CONCEPT-INDUCTANCE-001", "EL-CONCEPT-INDUCTIVE-REACTANCE-001"] },
      { id: "capacitance-and-capacitive-reactance", description: "Distinguish capacitance (farad) from capacitive reactance (ohm), and state capacitive reactance's frequency dependence.", satisfiedBy: ["EL-UNIT-FARAD-001", "EL-CONCEPT-CAPACITANCE-001", "EL-CONCEPT-CAPACITIVE-REACTANCE-001"] },
      { id: "power-factor", description: "Understand power factor as real power / apparent power.", satisfiedBy: ["EL-CONCEPT-POWER-FACTOR-001"] },
    ],
  },
  {
    acNumber: "2.3",
    obligations: [
      { id: "voltmeter", description: "Voltmeter: purpose, connection, and internal-resistance property.", satisfiedBy: ["EL-INSTRUMENT-VOLTMETER-001", "EL-INSTRUMENT-VOLTMETER-INTERNAL-RESISTANCE-001"] },
      { id: "ammeter", description: "Ammeter: purpose, connection, and internal-resistance property.", satisfiedBy: ["EL-INSTRUMENT-AMMETER-001", "EL-INSTRUMENT-AMMETER-INTERNAL-RESISTANCE-001"] },
      { id: "ohmmeter", description: "Ohmmeter: purpose and the de-energised-circuit requirement.", satisfiedBy: ["EL-INSTRUMENT-OHMMETER-001"] },
      { id: "wattmeter", description: "Wattmeter: purpose (senses current and voltage to compute power).", satisfiedBy: ["EL-INSTRUMENT-WATTMETER-001"] },
      { id: "energy-meter", description: "Energy meter: purpose (integrates power over time).", satisfiedBy: ["EL-INSTRUMENT-ENERGY-METER-001"] },
      { id: "multimeter-and-selection", description: "Multimeter as a combined instrument, and selecting the correct instrument for a given quantity.", satisfiedBy: ["EL-INSTRUMENT-MULTIMETER-001", "EL-INSTRUMENT-SELECT-001"] },
    ],
  },
  {
    acNumber: "3.1",
    obligations: [
      { id: "mass-meaning", description: "Specify what is meant by mass.", satisfiedBy: ["FP-CONCEPT-MASS-001"] },
      { id: "weight-meaning", description: "Specify what is meant by weight.", satisfiedBy: ["FP-CONCEPT-WEIGHT-001"] },
      { id: "weight-mass-relationship", description: "Relate weight to mass and gravitational field strength.", satisfiedBy: ["FP-REL-WEIGHT-MASS-001"] },
    ],
  },
  {
    acNumber: "3.2",
    obligations: [
      { id: "mechanical-advantage-principle", description: "General principle of mechanical advantage shared by levers/gears/pulleys.", satisfiedBy: ["FP-CONCEPT-MECHANICAL-ADVANTAGE-001"] },
      { id: "lever-principle-and-classes", description: "Lever principle, and the three lever classes distinguished by pivot/effort/load arrangement.", satisfiedBy: ["FP-CONCEPT-LEVER-PRINCIPLE-001", "FP-LEVER-CLASS-I-001", "FP-LEVER-CLASS-II-001", "FP-LEVER-CLASS-III-001"] },
      { id: "gears", description: "Gear principle (transmitting rotary motion) and gear-ratio mechanical advantage.", satisfiedBy: ["FP-CONCEPT-GEAR-001", "FP-REL-GEAR-RATIO-001"] },
      { id: "pulleys", description: "Pulley principle, fixed-vs-movable distinction, and pulley mechanical advantage.", satisfiedBy: ["FP-CONCEPT-PULLEY-001", "FP-PULLEY-FIXED-VS-MOVABLE-001", "FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001"] },
    ],
  },
  {
    acNumber: "3.3",
    obligations: [
      { id: "force-meaning", description: "Describe what a force is.", satisfiedBy: ["FP-CONCEPT-FORCE-001"] },
      { id: "work-meaning-and-relationship", description: "Describe work, and its relationship to force and distance (W = F x d).", satisfiedBy: ["FP-CONCEPT-WORK-001", "FP-REL-WORK-FORCE-DISTANCE-001"] },
      { id: "kinetic-energy-meaning-and-relationship", description: "Describe kinetic energy and its relationship to mass and speed (KE = half m v squared).", satisfiedBy: ["FP-CONCEPT-KINETIC-ENERGY-001", "FP-REL-KINETIC-ENERGY-001"] },
      { id: "potential-energy-meaning-and-relationship", description: "Describe gravitational potential energy and its relationship to mass, g and height (GPE = mgh).", satisfiedBy: ["FP-CONCEPT-POTENTIAL-ENERGY-001", "FP-REL-POTENTIAL-ENERGY-001"] },
      { id: "power-meaning-and-relationship", description: "Describe power and its relationship to work/energy and time.", satisfiedBy: ["FP-CONCEPT-POWER-001", "FP-REL-POWER-WORK-TIME-001"] },
      { id: "efficiency-meaning", description: "Describe efficiency as useful output over total input.", satisfiedBy: ["FP-CONCEPT-EFFICIENCY-001"] },
      { id: "interrelationships", description: "The electrical-efficiency bridge connecting these general-mechanics concepts to electrical power/energy.", satisfiedBy: ["EL-CONCEPT-ELECTRICAL-EFFICIENCY-001"] },
    ],
  },
  {
    acNumber: "3.4",
    obligations: [
      { id: "work-calculation", description: "Calculate work done from force and distance.", satisfiedBy: ["FP-CALC-WORK-001"] },
      { id: "kinetic-energy-calculation", description: "Calculate kinetic energy from mass and speed.", satisfiedBy: ["FP-CALC-KINETIC-ENERGY-001"] },
      { id: "potential-energy-calculation", description: "Calculate gravitational potential energy from mass, g and height.", satisfiedBy: ["FP-CALC-POTENTIAL-ENERGY-001"] },
      { id: "power-calculation", description: "Calculate power from work/energy and time.", satisfiedBy: ["FP-CALC-POWER-001"] },
      { id: "efficiency-calculation", description: "Calculate efficiency as a percentage from useful and total input/output.", satisfiedBy: ["FP-CALC-EFFICIENCY-001", "EL-CALC-ELECTRICAL-EFFICIENCY-001"] },
    ],
  },
  {
    acNumber: "4.1",
    obligations: [
      { id: "atomic-charge-structure", description: "Minimal atomic context: protons/electrons, free electrons in a conductor.", satisfiedBy: ["EL-CONCEPT-ATOMIC-CHARGE-STRUCTURE-001"] },
      { id: "charge-meaning", description: "Describe electric charge.", satisfiedBy: ["EL-CONCEPT-CHARGE-001"] },
      { id: "electron-theory-of-current", description: "Current as the flow of free electrons driven by potential difference.", satisfiedBy: ["EL-CONCEPT-ELECTRON-THEORY-001"] },
      { id: "current-charge-relationship", description: "Relate current to the rate of flow of charge (I = Q / t).", satisfiedBy: ["EL-CURRENT-CHARGE-RELATIONSHIP-001"] },
    ],
  },
  {
    acNumber: "4.2",
    obligations: [
      { id: "conductor-meaning", description: "Describe a conductor.", satisfiedBy: ["EL-CONCEPT-CONDUCTOR-001"] },
      { id: "insulator-meaning", description: "Describe an insulator.", satisfiedBy: ["EL-CONCEPT-INSULATOR-001"] },
      { id: "examples-and-breakdown", description: "Real conductor/insulator examples, and insulator voltage breakdown.", satisfiedBy: ["EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001", "EL-INSULATOR-BREAKDOWN-001"] },
    ],
  },
  {
    acNumber: "4.3",
    obligations: [
      { id: "resistance-meaning", description: "Describe resistance.", satisfiedBy: ["EL-CONCEPT-RESISTANCE-001"] },
      { id: "resistivity-meaning-and-relationship", description: "Describe resistivity and R = rho L / A.", satisfiedBy: ["EL-CONCEPT-RESISTIVITY-001", "EL-RESISTIVITY-RELATIONSHIP-001"] },
      { id: "factors-affecting-resistance", description: "How length, area, resistivity and temperature affect resistance.", satisfiedBy: ["EL-CONDUCTOR-RESISTANCE-FACTORS-001", "EL-RESISTIVITY-LENGTH-EFFECT-001", "EL-RESISTIVITY-AREA-EFFECT-001"] },
    ],
  },
  {
    acNumber: "4.4",
    obligations: [
      { id: "ohms-law-relationship", description: "State V = I R and the direct/inverse proportionality it implies.", satisfiedBy: ["EL-OHM-RELATIONSHIP-001", "EL-OHM-PROPORTIONALITY-001"] },
      { id: "series-behaviour", description: "Series circuit structure, current, voltage-sharing and total resistance.", satisfiedBy: ["EL-CIRCUIT-SERIES-STRUCTURE-001", "EL-SERIES-CURRENT-001", "EL-SERIES-VOLTAGE-001", "EL-SERIES-RESISTANCE-001"] },
      { id: "parallel-behaviour", description: "Parallel circuit structure, common voltage, current division and total resistance.", satisfiedBy: ["EL-CIRCUIT-PARALLEL-STRUCTURE-001", "EL-PARALLEL-VOLTAGE-001", "EL-PARALLEL-CURRENT-001", "EL-PARALLEL-RESISTANCE-001"] },
    ],
  },
  {
    acNumber: "4.5",
    obligations: [
      { id: "ohms-law-calculation", description: "Calculate the unknown of V, I or R given the other two.", satisfiedBy: ["EL-OHM-SOLVE-V-001", "EL-OHM-SOLVE-I-001", "EL-OHM-SOLVE-R-001"] },
      { id: "series-resistance-calculation", description: "Calculate total series resistance and an individual series voltage drop.", satisfiedBy: ["EL-SERIES-RESISTANCE-CALC-001", "EL-SERIES-VOLTAGE-CALC-001"] },
      { id: "parallel-resistance-calculation", description: "Calculate total parallel resistance and an individual branch current.", satisfiedBy: ["EL-PARALLEL-RESISTANCE-CALC-001", "EL-PARALLEL-CURRENT-CALC-001"] },
      { id: "supply-current-calculation", description: "Calculate supply current in a series or parallel circuit.", satisfiedBy: ["EL-CIRCUIT-SUPPLY-CURRENT-SERIES-001", "EL-CIRCUIT-SUPPLY-CURRENT-PARALLEL-001"] },
    ],
  },
  {
    acNumber: "4.6",
    obligations: [
      { id: "power-relationship", description: "State P = V I and its I^2 R / V^2/R derived forms.", satisfiedBy: ["EL-POWER-RELATIONSHIP-001", "EL-POWER-DERIVED-VIR-001", "EL-POWER-DERIVED-V2R-001"] },
      { id: "power-calculation", description: "Calculate power from VI, I^2R or V^2/R.", satisfiedBy: ["EL-POWER-SOLVE-001", "EL-POWER-SOLVE-IR-001", "EL-POWER-SOLVE-V2R-001"] },
      { id: "series-parallel-power-calculation", description: "Calculate power dissipated by an individual series/parallel component.", satisfiedBy: ["EL-SERIES-POWER-CALC-001", "EL-PARALLEL-POWER-CALC-001"] },
      { id: "total-power", description: "Total circuit power is the sum of individual component powers.", satisfiedBy: ["EL-CIRCUIT-POWER-TOTAL-001"] },
    ],
  },
  {
    acNumber: "4.7",
    obligations: [
      { id: "voltage-drop-meaning", description: "State what is meant by voltage drop.", satisfiedBy: ["EL-VOLTAGE-DROP-001"] },
    ],
  },
  {
    acNumber: "4.8",
    obligations: [
      { id: "thermal-effect", description: "Describe the thermal effect of current.", satisfiedBy: ["EL-CURRENT-THERMAL-EFFECT-001"] },
      { id: "chemical-effect", description: "Describe the chemical effect of current.", satisfiedBy: ["EL-CURRENT-CHEMICAL-EFFECT-001"] },
      { id: "protective-devices", description: "Fuses/circuit breakers as an application of the thermal effect.", satisfiedBy: ["EL-PROTECTIVE-DEVICE-PURPOSE-001", "EL-FUSE-OPERATION-001"] },
    ],
  },
  {
    acNumber: "5.1",
    obligations: [
      { id: "magnetism-attraction-repulsion", description: "Describe magnetic attraction and repulsion.", satisfiedBy: ["EL-CONCEPT-MAGNETISM-001"] },
    ],
  },
  {
    acNumber: "5.2",
    obligations: [
      { id: "flux-meaning", description: "State what magnetic flux is.", satisfiedBy: ["EL-CONCEPT-MAGNETIC-FLUX-001"] },
      { id: "flux-density-meaning", description: "State the difference between flux and flux density.", satisfiedBy: ["EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001"] },
    ],
  },
  {
    acNumber: "5.3",
    obligations: [
      { id: "field-from-current", description: "A current-carrying conductor produces a magnetic field.", satisfiedBy: ["EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001"] },
      { id: "force-on-conductor", description: "A current-carrying conductor in a field experiences a force.", satisfiedBy: ["EL-CONCEPT-FORCE-ON-CONDUCTOR-001"] },
      { id: "electromagnetism-meaning", description: "Describe electromagnetism as the current/magnetism relationship.", satisfiedBy: ["EL-CONCEPT-ELECTROMAGNETISM-001"] },
      { id: "emf-meaning", description: "Describe electromotive force.", satisfiedBy: ["EL-CONCEPT-EMF-001"] },
    ],
  },
  {
    acNumber: "5.4",
    obligations: [
      { id: "electromagnetic-induction", description: "A changing flux induces an EMF (the causal principle underlying generation).", satisfiedBy: ["EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001"] },
      { id: "ac-generator-principle", description: "A single-loop generator produces alternating EMF by rotating within a field.", satisfiedBy: ["EL-CONCEPT-AC-GENERATOR-001"] },
      { id: "sine-wave-output", description: "The generator's EMF varies as a sine wave.", satisfiedBy: ["EL-CONCEPT-SINE-WAVE-001"] },
      { id: "ac-dc-distinction", description: "Distinguish A.C. from D.C.", satisfiedBy: ["EL-CONCEPT-AC-DC-DISTINCTION-001"] },
    ],
  },
  {
    acNumber: "5.5",
    obligations: [
      { id: "rms-value", description: "Define RMS value.", satisfiedBy: ["EL-WAVEFORM-RMS-001"] },
      { id: "average-value", description: "Define the average value used in AC calculations.", satisfiedBy: ["EL-WAVEFORM-AVERAGE-VALUE-001"] },
      { id: "peak-to-peak-value", description: "Define peak-to-peak value.", satisfiedBy: ["EL-WAVEFORM-PEAK-TO-PEAK-001"] },
      { id: "periodic-time", description: "Define periodic time.", satisfiedBy: ["EL-WAVEFORM-PERIODIC-TIME-001"] },
      { id: "frequency", description: "Define frequency.", satisfiedBy: ["EL-CONCEPT-FREQUENCY-001"] },
      { id: "amplitude", description: "Define amplitude.", satisfiedBy: ["EL-WAVEFORM-AMPLITUDE-001"] },
      { id: "rms-peak-relationship-and-calculation", description: "Relate RMS to peak, and calculate one from the other.", satisfiedBy: ["EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001", "EL-WAVEFORM-RMS-CALC-001"] },
      { id: "frequency-period-relationship-and-calculation", description: "Relate frequency to periodic time, and calculate one from the other.", satisfiedBy: ["EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001", "EL-WAVEFORM-FREQUENCY-CALC-001"] },
    ],
  },
  {
    acNumber: "6.1",
    obligations: [
      { id: "dimmer-switch-application", description: "Which component and why: dimmer switches.", satisfiedBy: ["EL-APPLICATION-DIMMER-SWITCH-001"] },
      { id: "motor-control-application", description: "Which component and why: motor control.", satisfiedBy: ["EL-APPLICATION-MOTOR-CONTROL-001"] },
      { id: "heating-boiler-control-application", description: "Which component and why: heating/boiler controls.", satisfiedBy: ["EL-APPLICATION-HEATING-BOILER-CONTROL-001"] },
      { id: "security-alarm-application", description: "Which component and why: security alarms.", satisfiedBy: ["EL-APPLICATION-SECURITY-ALARM-001"] },
      // CC-09B.3: re-closed. CC-09B.2 could not find adequate application-
      // specific evidence within its own search effort and left this
      // honestly unsatisfied; CC-09B.3 found Skyworks AN347 (a real DAA/
      // telephone-line-interface design guide showing a diode bridge wired
      // directly to TIP/RING) and re-sourced EL-APPLICATION-TELEPHONE-001
      // to it directly.
      { id: "telephone-application", description: "Which component and why: telephones/communications.", satisfiedBy: ["EL-APPLICATION-TELEPHONE-001"] },
      // CC-09B.3: re-closed via the Holtek HT12D/HT12F decoder datasheet
      // (a real, first-party remote-control IC datasheet explicitly
      // naming garage-door/car-door/alarm/remote-control applications).
      { id: "wireless-control-application", description: "Which component and why: wireless control systems.", satisfiedBy: ["EL-APPLICATION-WIRELESS-CONTROL-001"] },
    ],
  },
  {
    acNumber: "6.2",
    obligations: [
      { id: "capacitors", description: "Basic operating principle of a capacitor as a component.", satisfiedBy: ["EL-COMPONENT-CAPACITOR-001"] },
      { id: "resistors", description: "Basic operating principle of a resistor as a component.", satisfiedBy: ["EL-COMPONENT-RESISTOR-001"] },
      { id: "rectifiers", description: "Basic operating principle of a rectifier.", satisfiedBy: ["EL-COMPONENT-RECTIFIER-001"] },
      { id: "diodes", description: "Basic operating principle of a diode.", satisfiedBy: ["EL-COMPONENT-DIODE-001"] },
      { id: "zener", description: "Basic operating principle of a Zener diode.", satisfiedBy: ["EL-COMPONENT-ZENER-DIODE-001"] },
      { id: "led", description: "Basic operating principle of an LED.", satisfiedBy: ["EL-COMPONENT-LED-001"] },
      { id: "photo", description: "Basic operating principle of a photodiode.", satisfiedBy: ["EL-COMPONENT-PHOTODIODE-001"] },
      { id: "thermistors", description: "Basic operating principle of a thermistor.", satisfiedBy: ["EL-COMPONENT-THERMISTOR-001"] },
      { id: "diacs", description: "Basic operating principle of a DIAC.", satisfiedBy: ["EL-COMPONENT-DIAC-001"] },
      { id: "triacs", description: "Basic operating principle of a TRIAC.", satisfiedBy: ["EL-COMPONENT-TRIAC-001"] },
      { id: "transistors", description: "Basic operating principle of a transistor.", satisfiedBy: ["EL-COMPONENT-TRANSISTOR-001"] },
      { id: "thyristors", description: "Basic operating principle of a thyristor (SCR).", satisfiedBy: ["EL-COMPONENT-THYRISTOR-SCR-001"] },
      { id: "invertors", description: "Basic operating principle of an inverter.", satisfiedBy: ["EL-COMPONENT-INVERTER-001"] },
    ],
  },
];
