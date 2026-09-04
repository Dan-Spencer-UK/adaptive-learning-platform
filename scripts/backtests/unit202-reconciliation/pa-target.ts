/**
 * CC-22B: the FINAL, LOCKED Project-Architect Unit-202 knowledge target
 * (task prompt section 5). This is now the sole source of truth for
 * "what is a PA proposition" -- CC-22A's defect (treating every
 * historical Source-Acquisition-Manifest row as REQUIRED_QUALIFICATION_
 * KNOWLEDGE) is corrected: this file is authored directly from the
 * locked PA decisions, independent of row count in any historical
 * evidence file. The historical manifest is consulted only afterward,
 * as a benchmark cross-reference (see historical-benchmark-mapping.ts).
 *
 * Atomicity: one row per PA bullet point, at the granularity the task
 * prompt's own section 5 presents them -- the same level CC-22B
 * explicitly mandates a finer split only where it says so (AC1.1's
 * fractional-indices exclusion). Two or more rows are never merged
 * merely for authoring convenience.
 */
export type PAClass = "REQUIRED_QUALIFICATION_KNOWLEDGE" | "FOUNDATIONAL_PREREQUISITE" | "CONTEXTUAL_TEACHING_SUPPORT" | "OUT_OF_SCOPE";
export type PropositionKind = "FACTUAL_PROPOSITION" | "RELATIONSHIP_OR_MECHANISM" | "PROCEDURE_OR_CALCULATION_RULE" | "SYMBOL_OR_CONVENTION" | "PHYSICAL_OR_COMPONENT_RECOGNITION";

export interface PATargetProposition {
  readonly id: string;
  readonly ac: string;
  readonly proposition: string;
  readonly class: PAClass;
  readonly kind: PropositionKind;
  /** True only for a calibrated representative/exemplar proposition PA names as an example course construction is expected to use -- never a universal top-level requirement in its own right, but still needs its own technical truth. */
  readonly isRepresentativeExemplar?: boolean;
  /** For an OUT_OF_SCOPE row that names a rejected misconception or an explicitly-excluded formalism, rather than a topic the qualification simply never reaches. */
  readonly rejectedProposition?: boolean;
  readonly notes?: string;
}

let n = 0;
function id(): string {
  n += 1;
  return `PA-${String(n).padStart(3, "0")}`;
}
function req(ac: string, proposition: string, kind: PropositionKind = "FACTUAL_PROPOSITION", extra?: Partial<PATargetProposition>): PATargetProposition {
  return { id: id(), ac, proposition, class: "REQUIRED_QUALIFICATION_KNOWLEDGE", kind, ...extra };
}
function found(ac: string, proposition: string, kind: PropositionKind = "PROCEDURE_OR_CALCULATION_RULE"): PATargetProposition {
  return { id: id(), ac, proposition, class: "FOUNDATIONAL_PREREQUISITE", kind };
}
function ctx(ac: string, proposition: string, kind: PropositionKind = "FACTUAL_PROPOSITION"): PATargetProposition {
  return { id: id(), ac, proposition, class: "CONTEXTUAL_TEACHING_SUPPORT", kind };
}
function oos(ac: string, proposition: string, notes?: string): PATargetProposition {
  return { id: id(), ac, proposition, class: "OUT_OF_SCOPE", kind: "FACTUAL_PROPOSITION", rejectedProposition: true, notes };
}

export const PA_TARGET: readonly PATargetProposition[] = [
  // ===================================================================
  // AC1.1 -- Mathematics
  // ===================================================================
  req("AC1.1", "Fractions."),
  req("AC1.1", "Percentages."),
  req("AC1.1", "Algebra."),
  req("AC1.1", "Formula transposition.", "PROCEDURE_OR_CALCULATION_RULE"),
  req("AC1.1", "Positive indices."),
  req("AC1.1", "Negative indices."),
  req("AC1.1", "Standard/scientific notation.", "SYMBOL_OR_CONVENTION"),
  req("AC1.1", "Engineering notation.", "SYMBOL_OR_CONVENTION"),
  req("AC1.1", "Pythagoras."),
  req("AC1.1", "Sine/cosine/tangent use in right triangles.", "PROCEDURE_OR_CALCULATION_RULE"),
  req("AC1.1", "Statistical range."),
  req("AC1.1", "Mean."),
  req("AC1.1", "Median."),
  req("AC1.1", "Mode."),
  found("AC1.1", "Ordinary decimal arithmetic."),
  found("AC1.1", "Proportional reasoning required to execute the above calculations."),
  oos("AC1.1", "Fractional indices as separate mastery.", "Task section 5/19.3: not required. Where an old source proposition bundles ordinary index laws with fractional indices, the PA target is split (see PA-005/PA-006 above, which name only positive/negative indices) -- fractional indices are never a separate required proposition."),

  // ===================================================================
  // AC2.1 -- Physical quantities / SI
  // ===================================================================
  req("AC2.1", "Length: correct SI unit and unit symbol."),
  req("AC2.1", "Area: correct SI unit and unit symbol."),
  req("AC2.1", "Volume: correct SI unit and unit symbol."),
  req("AC2.1", "Mass: correct SI unit and unit symbol."),
  req("AC2.1", "Density: correct SI unit and unit symbol."),
  req("AC2.1", "Time: correct SI unit and unit symbol."),
  req("AC2.1", "Velocity: correct SI unit and unit symbol."),
  req("AC2.1", "Temperature: correct SI unit and unit symbol.", "FACTUAL_PROPOSITION", { notes: "Technical rule (task section 5): kelvin is the SI base unit for thermodynamic temperature; degrees Celsius is a legitimate practical scale but is not the SI base-unit replacement." }),
  found("AC2.1", "Practical unit conversion needed elsewhere in Unit 202."),

  // ===================================================================
  // AC2.2 -- Electrical quantities (each requires meaning, conventional
  // quantity symbol, unit name, unit symbol, and relevant distinction
  // from related quantities -- task section 5).
  // ===================================================================
  req("AC2.2", "Current: meaning, quantity symbol, unit name/symbol."),
  req("AC2.2", "Voltage: meaning, quantity symbol, unit name/symbol."),
  req("AC2.2", "Resistance: meaning, quantity symbol, unit name/symbol, distinction from resistivity."),
  req("AC2.2", "Resistivity: meaning, quantity symbol, unit name/symbol, distinction from resistance."),
  req("AC2.2", "Power: meaning, quantity symbol, unit name/symbol, distinction from energy and from power factor."),
  req("AC2.2", "Energy: meaning, quantity symbol, unit name/symbol, distinction from power."),
  req("AC2.2", "Frequency: meaning, quantity symbol, unit name/symbol."),
  req("AC2.2", "Impedance: meaning, quantity symbol, unit name/symbol, distinction from resistance and reactance."),
  req("AC2.2", "Capacitance and capacitive reactance: meaning, quantity symbol, unit name/symbol, distinction between the two."),
  req("AC2.2", "Inductance and inductive reactance: meaning, quantity symbol, unit name/symbol, distinction between the two."),
  req("AC2.2", "Power factor: meaning, quantity symbol, unit name/symbol (dimensionless), distinction from power."),
  oos("AC2.2", "General Level-3 calculation topic for impedance, reactance or power factor.", "Task section 5: do not introduce."),

  // ===================================================================
  // AC2.3 -- Measurement instruments
  // ===================================================================
  req("AC2.3", "Ammeter: measures current + series connection.", "FACTUAL_PROPOSITION", { notes: "Split for exact-claim binding: 'measures current' and 'series connection' are both present in the single existing claim." }),
  req("AC2.3", "Voltmeter: measures potential difference + parallel connection."),
  req("AC2.3", "Ohmmeter: measures resistance."),
  req("AC2.3", "Ohmmeter: circuit de-energised/safe-use principle.", "PROCEDURE_OR_CALCULATION_RULE"),
  req("AC2.3", "Wattmeter: measures electrical power + appropriate current/voltage sensing arrangement at qualification depth."),
  req("AC2.3", "Energy meter: measures/integrates electrical energy."),
  ctx("AC2.3", "Low/high meter internal resistance."),

  // ===================================================================
  // AC3.1 -- Mass / weight
  // ===================================================================
  req("AC3.1", "Mass meaning."),
  req("AC3.1", "Weight meaning."),
  req("AC3.1", "Mass/weight distinction."),
  req("AC3.1", "F = mg.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC3.1", "Appropriate mass/weight calculations.", "PROCEDURE_OR_CALCULATION_RULE"),

  // ===================================================================
  // AC3.2 -- Levers / gears / pulleys
  // ===================================================================
  req("AC3.2", "Levers."),
  req("AC3.2", "Lever classes."),
  req("AC3.2", "Basic lever effort/load/arm relationship at appropriate depth.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC3.2", "Gears."),
  req("AC3.2", "Gear ratio / legitimate speed relationship.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC3.2", "Pulleys."),
  req("AC3.2", "Mechanical advantage.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC3.2", "Force-distance trade.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC3.2", "Torque-speed relationship where applicable.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC3.2", "Ideal machine conserves power.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC3.2", "Real losses reduce useful output.", "RELATIONSHIP_OR_MECHANISM"),
  oos("AC3.2", "'Gears create power.'", "Task section 5: rejected misconception, never a separate required proposition needing its own technical source."),

  // ===================================================================
  // AC3.3 / AC3.4 -- Force / work / energy / power / efficiency
  // ===================================================================
  req("AC3.3", "Force concept at qualification depth."),
  req("AC3.3", "Work."),
  req("AC3.3", "Energy."),
  req("AC3.3", "Kinetic versus potential energy concept."),
  req("AC3.3", "Power."),
  req("AC3.3", "Efficiency."),
  req("AC3.3", "Relationships between force, work, energy, power and efficiency.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC3.3", "W = Fd.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC3.3", "F = mg where relevant.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC3.3", "Gravitational lifting / work against gravity.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC3.3", "PE = mgh / work-against-gravity equivalence.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC3.4", "P = W/t.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC3.4", "Efficiency relationship.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC3.4", "Legitimate multistep mechanical calculations.", "PROCEDURE_OR_CALCULATION_RULE"),
  oos("AC3.3", "KE = 1/2 mv^2 as Unit-202 mastery.", "Task section 5: not required."),
  oos("AC3.3", "Separate F = ma mastery.", "Task section 5: not created."),

  // ===================================================================
  // AC4 -- Electrical science / DC circuits
  // ===================================================================
  req("AC4.1", "Basic electron theory."),
  req("AC4.1", "Current as charge/electron-flow concept at calibrated depth.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC4.1", "Conventional-current versus electron-flow distinction."),
  req("AC4.2", "Conductors."),
  req("AC4.2", "Insulators."),
  req("AC4.3", "Resistance."),
  req("AC4.3", "Resistivity."),
  req("AC4.3", "Rho (resistivity symbol).", "SYMBOL_OR_CONVENTION"),
  req("AC4.3", "Ohm-metre (resistivity unit).", "SYMBOL_OR_CONVENTION"),
  req("AC4.3", "R = rho L/A and appropriate rearrangement/use.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC4.4", "Ohm's law.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC4.4", "V = IR and rearrangements.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC4.4", "Series circuit: current common throughout.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC4.4", "Series circuit: voltage shares/sums.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC4.4", "Series circuit: resistance sums.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC4.4", "Parallel circuit: voltage common across branches.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC4.4", "Parallel circuit: current divides/sums.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC4.4", "Parallel circuit: equivalent-resistance relationship.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC4.6", "P = VI.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC4.6", "P = I^2 R.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC4.6", "P = V^2/R where appropriate.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC4.6", "Suitable DC-circuit-power calculations.", "PROCEDURE_OR_CALCULATION_RULE"),
  req("AC4.7", "Voltage drop: voltage loss across resistance carrying current."),
  req("AC4.7", "Vdrop = IR.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC4.7", "Appropriate voltage-drop calculation.", "PROCEDURE_OR_CALCULATION_RULE"),
  req("AC4.8", "Thermal effect of current."),
  req("AC4.8", "Chemical effect / electrolysis."),
  oos("AC4.4", "Separate Kirchhoff's Voltage Law mastery heading.", "Task section 5: the elementary underlying relationships (current-common/voltage-shares in series, voltage-common/current-divides in parallel) are required; a formal KVL label is not a separate mastery heading merely because a technical source uses it."),
  oos("AC4.4", "Separate Kirchhoff's Current Law mastery heading.", "Task section 5: same as KVL."),
  ctx("AC4.8", "Fuse operation as an example of the thermal effect."),

  // ===================================================================
  // AC5.1 / AC5.2 -- Magnetism
  // ===================================================================
  req("AC5.1", "Magnetic attraction/repulsion."),
  req("AC5.1", "Magnetic field patterns.", "PHYSICAL_OR_COMPONENT_RECOGNITION"),
  req("AC5.2", "Magnetic flux: meaning, symbol, unit."),
  req("AC5.2", "Magnetic flux density: meaning, symbol, unit."),
  req("AC5.2", "B = Phi/A and appropriate rearrangement/use.", "RELATIONSHIP_OR_MECHANISM"),

  // ===================================================================
  // AC5.3 -- Electromagnetism
  // ===================================================================
  req("AC5.3", "Magnetic field around a current-carrying conductor."),
  req("AC5.3", "Right-hand grip rule.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC5.3", "Solenoid magnetic field."),
  req("AC5.3", "Solenoid polarity."),
  req("AC5.3", "Basic electromagnet principle."),
  req("AC5.3", "Motor effect."),
  req("AC5.3", "Scalar F = BIl.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC5.3", "Fleming left-hand rule.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC5.3", "Motional/induced EMF causal concept.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC5.3", "e = Blv.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC5.3", "Fleming right-hand/generator rule.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC5.3", "Suitable simple electromagnetism calculations/rearrangements.", "PROCEDURE_OR_CALCULATION_RULE"),
  ctx("AC5.3", "Relay."),
  ctx("AC5.3", "Contactor."),
  ctx("AC5.3", "Dot/cross page convention.", "SYMBOL_OR_CONVENTION"),
  oos("AC5.3", "Vector cross-product formulation F = Il x B.", "Task section 5: not required. The scalar F=BIl relationship is required instead."),
  oos("AC5.3", "Differential Faraday-law formalism epsilon = -N dPhi/dt.", "Task section 5: not required. The motional/induced-EMF causal concept + e=Blv are required instead."),

  // ===================================================================
  // AC5.4 -- AC generation
  // ===================================================================
  req("AC5.4", "Single-loop alternator/generator parts.", "PHYSICAL_OR_COMPONENT_RECOGNITION"),
  req("AC5.4", "Coil.", "PHYSICAL_OR_COMPONENT_RECOGNITION"),
  req("AC5.4", "Magnetic poles.", "PHYSICAL_OR_COMPONENT_RECOGNITION"),
  req("AC5.4", "Slip rings.", "PHYSICAL_OR_COMPONENT_RECOGNITION"),
  req("AC5.4", "Brushes.", "PHYSICAL_OR_COMPONENT_RECOGNITION"),
  req("AC5.4", "Rotation/field-cutting causality.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC5.4", "No/minimum induced EMF when motion does not cut flux appropriately."),
  req("AC5.4", "Maximum induced EMF when cutting is maximum."),
  req("AC5.4", "Alternating/sinusoidal output concept."),
  req("AC5.4", "Frequency relationship to rotational speed and pole pairs.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC5.4", "f = N x P (N = rev/s, P = pole pairs).", "RELATIONSHIP_OR_MECHANISM"),
  req("AC5.4", "Equivalent rpm relationship f = n_rpm x P / 60.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC5.4", "Appropriate simple AC-generation calculations.", "PROCEDURE_OR_CALCULATION_RULE"),

  // ===================================================================
  // AC5.5 -- Sine-wave characteristics. ALL PA decisions now resolved
  // (task section 5): the five existing REVIEW_PROPOSED facts for
  // amplitude/RMS/peak-to-peak/average/periodic-time are explicitly
  // authorised REQUIRED_CORE.
  // ===================================================================
  req("AC5.5", "Amplitude / peak."),
  req("AC5.5", "Peak-to-peak."),
  req("AC5.5", "Periodic time."),
  req("AC5.5", "Frequency."),
  req("AC5.5", "T = 1/f.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC5.5", "RMS."),
  req("AC5.5", "Vrms ~= 0.707 x Vpeak.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC5.5", "Vpeak ~= 1.414 x Vrms.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC5.5", "Average over one alternation ~= 0.6366 x Vpeak.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC5.5", "Analogous current relationship where applicable.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC5.5", "Signed average of a complete symmetrical sine-wave cycle = 0.", "RELATIONSHIP_OR_MECHANISM"),
  req("AC5.5", "Appropriate sine-wave conversions/calculations.", "PROCEDURE_OR_CALCULATION_RULE"),
  oos("AC5.5", "Instantaneous waveform equation V = V0 sin(2*pi*f*t).", "Task section 5: remains REJECT_OVERDEPTH. Frequency is represented with simpler Level-2 relationships instead."),

  // ===================================================================
  // AC6.1 -- Electronic applications
  // ===================================================================
  req("AC6.1", "Security alarms: application category/function.", "FACTUAL_PROPOSITION", { notes: "EXPLICIT_PUBLIC_CURRICULUM: the official public curriculum establishes this application category directly under the function/application performance." }),
  req("AC6.1", "Telephones: application category/function.", "FACTUAL_PROPOSITION", { notes: "EXPLICIT_PUBLIC_CURRICULUM." }),
  req("AC6.1", "Dimmer switches: application category/function.", "FACTUAL_PROPOSITION", { notes: "EXPLICIT_PUBLIC_CURRICULUM." }),
  req("AC6.1", "Heating/boiler controls: application category/function.", "FACTUAL_PROPOSITION", { notes: "EXPLICIT_PUBLIC_CURRICULUM." }),
  req("AC6.1", "Motor control: application category/function.", "FACTUAL_PROPOSITION", { notes: "EXPLICIT_PUBLIC_CURRICULUM." }),
  req("AC6.1", "Wireless control systems: application category/function.", "FACTUAL_PROPOSITION", { notes: "EXPLICIT_PUBLIC_CURRICULUM." }),
  req("AC6.1", "Security alarm: SCR/thyristor latching + sounder role.", "FACTUAL_PROPOSITION", { isRepresentativeExemplar: true }),
  ctx("AC6.1", "Security alarm: transistor switching."),
  ctx("AC6.1", "Security alarm: exact NC/contact/bias topology."),
  req("AC6.1", "Telephone: capacitor -> ringer.", "FACTUAL_PROPOSITION", { isRepresentativeExemplar: true }),
  ctx("AC6.1", "Telephone: resistor -> line testing."),
  ctx("AC6.1", "Telephone: surge protector."),
  ctx("AC6.1", "Telephone: master/secondary socket details."),
  ctx("AC6.1", "Telephone: legacy PSTN framing."),
  req("AC6.1", "Dimmer: TRIAC AC switching/control."),
  req("AC6.1", "Dimmer: DIAC triggering."),
  req("AC6.1", "Dimmer: basic timing/control -> delivered-power relationship.", "RELATIONSHIP_OR_MECHANISM"),
  ctx("AC6.1", "Dimmer: exact RC timing implementation/component values."),
  req("AC6.1", "Heating: thermistor sensing role."),
  ctx("AC6.1", "Heating: exact transistor/relay topology."),
  req("AC6.1", "Motor: controlled electronic switching at general Level-2 depth."),
  req("AC6.1", "Motor: bridge rectifier converts AC to DC.", "FACTUAL_PROPOSITION", { isRepresentativeExemplar: true }),
  oos("AC6.1", "Motor: exact IC implementation."),
  oos("AC6.1", "Motor: exact protection topology."),
  oos("AC6.1", "Motor: noise-suppression network."),
  ctx("AC6.1", "Wireless: practical advantages/applications."),
  oos("AC6.1", "Wireless: Wi-Fi engineering."),
  oos("AC6.1", "Wireless: protocol stacks."),
  oos("AC6.1", "Wireless: RF-frequency design."),
  oos("AC6.1", "Wireless: IoT engineering."),

  // ===================================================================
  // AC6.2 -- Components. "photo" resolves into photodiode + LDR as
  // separate technical concepts (task section 5).
  // ===================================================================
  req("AC6.2", "Capacitor: basic operating principle."),
  req("AC6.2", "DIAC: basic operating principle."),
  req("AC6.2", "Diode: basic operating principle."),
  req("AC6.2", "Inverter: basic operating principle."),
  req("AC6.2", "LED: basic operating principle."),
  req("AC6.2", "Photodiode: basic operating principle."),
  req("AC6.2", "LDR (light-dependent resistor): basic operating principle."),
  req("AC6.2", "Rectifier: basic operating principle."),
  req("AC6.2", "Resistor: basic operating principle.", "FACTUAL_PROPOSITION", { notes: "Task section 5: R=V/I is NOT a resistor operating-principle proposition." }),
  req("AC6.2", "Thermistor: basic operating principle."),
  req("AC6.2", "Thyristor (SCR): basic operating principle."),
  req("AC6.2", "Transistor: basic operating principle."),
  req("AC6.2", "TRIAC: basic operating principle."),
  req("AC6.2", "Zener diode: basic operating principle."),
  req("AC6.2", "Schematic-symbol recognition for each named AC6.2 component/device family at qualification depth.", "SYMBOL_OR_CONVENTION"),
  req("AC6.2", "4-band resistor colour code.", "PROCEDURE_OR_CALCULATION_RULE", { notes: "Calibrated supporting performance (task section 5)." }),
  ctx("AC6.2", "Physical/photo appearance recognition of each component.", "PHYSICAL_OR_COMPONENT_RECOGNITION"),
] as const;
