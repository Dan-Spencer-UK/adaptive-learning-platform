/**
 * CC-19R clean-room EXPLICIT_CURRICULUM_FACT requirements (task section
 * 18) -- AC2.1/AC2.2 explicitly require identifying/using/determining
 * the applicable SI unit for each named quantity, so each Range member
 * under those ACs gets an atomic fact requirement for "what is the SI
 * unit of X". Derived directly from validated OFFICIAL_CURRICULUM
 * evidence -- never REVIEW_PROPOSED.
 */

export interface ExplicitFactRequirement {
  readonly targetSubject: string;
  readonly targetPerformanceType: string;
  readonly claimKey: string;
  readonly parentAcId: string;
}

const identifyFact = (targetSubject: string, claimKey: string, parentAcId: string): ExplicitFactRequirement => ({
  targetSubject,
  targetPerformanceType: "IDENTIFY",
  claimKey,
  parentAcId,
});

export const EXPLICIT_FACT_REQUIREMENTS: readonly ExplicitFactRequirement[] = [
  // AC2.1 -- general physical quantities
  identifyFact("length (SI unit)", "unit202.si-unit.length", "AC2.1"),
  identifyFact("area (SI unit)", "unit202.si-unit.area", "AC2.1"),
  identifyFact("volume (SI unit)", "unit202.si-unit.volume", "AC2.1"),
  identifyFact("mass (SI unit)", "unit202.si-unit.mass", "AC2.1"),
  identifyFact("density (SI unit)", "unit202.si-unit.density", "AC2.1"),
  identifyFact("time (SI unit)", "unit202.si-unit.time", "AC2.1"),
  identifyFact("temperature (SI unit)", "unit202.si-unit.temperature", "AC2.1"),
  identifyFact("velocity (SI unit)", "unit202.si-unit.velocity", "AC2.1"),
  // AC2.2 -- electrical quantities (both IDENTIFY and OTHER/"determine values of" performances)
  identifyFact("resistance (SI unit)", "unit202.si-unit.resistance", "AC2.2"),
  { targetSubject: "resistance (SI unit)", targetPerformanceType: "OTHER", claimKey: "unit202.si-unit.resistance", parentAcId: "AC2.2" },
  identifyFact("resistivity (SI unit)", "unit202.si-unit.resistivity", "AC2.2"),
  { targetSubject: "resistivity (SI unit)", targetPerformanceType: "OTHER", claimKey: "unit202.si-unit.resistivity", parentAcId: "AC2.2" },
  identifyFact("power (SI unit)", "unit202.si-unit.power", "AC2.2"),
  { targetSubject: "power (SI unit)", targetPerformanceType: "OTHER", claimKey: "unit202.si-unit.power", parentAcId: "AC2.2" },
  identifyFact("frequency (SI electrical quantity)", "unit202.si-unit.frequency", "AC2.2"),
  { targetSubject: "frequency (SI electrical quantity)", targetPerformanceType: "OTHER", claimKey: "unit202.si-unit.frequency", parentAcId: "AC2.2" },
  identifyFact("current (SI unit)", "unit202.si-unit.current", "AC2.2"),
  { targetSubject: "current (SI unit)", targetPerformanceType: "OTHER", claimKey: "unit202.si-unit.current", parentAcId: "AC2.2" },
  identifyFact("voltage (SI unit)", "unit202.si-unit.voltage", "AC2.2"),
  { targetSubject: "voltage (SI unit)", targetPerformanceType: "OTHER", claimKey: "unit202.si-unit.voltage", parentAcId: "AC2.2" },
  identifyFact("energy (SI unit)", "unit202.si-unit.energy", "AC2.2"),
  { targetSubject: "energy (SI unit)", targetPerformanceType: "OTHER", claimKey: "unit202.si-unit.energy", parentAcId: "AC2.2" },
  identifyFact("impedance (SI unit)", "unit202.si-unit.impedance", "AC2.2"),
  { targetSubject: "impedance (SI unit)", targetPerformanceType: "OTHER", claimKey: "unit202.si-unit.impedance", parentAcId: "AC2.2" },
  identifyFact("inductance and inductive reactance (SI unit)", "unit202.si-unit.inductance", "AC2.2"),
  identifyFact("inductance and inductive reactance (SI unit)", "unit202.si-unit.inductive-reactance", "AC2.2"),
  { targetSubject: "inductance and inductive reactance (SI unit)", targetPerformanceType: "OTHER", claimKey: "unit202.si-unit.inductance", parentAcId: "AC2.2" },
  { targetSubject: "inductance and inductive reactance (SI unit)", targetPerformanceType: "OTHER", claimKey: "unit202.si-unit.inductive-reactance", parentAcId: "AC2.2" },
  identifyFact("capacitance and capacitive reactance (SI unit)", "unit202.si-unit.capacitance", "AC2.2"),
  identifyFact("capacitance and capacitive reactance (SI unit)", "unit202.si-unit.capacitive-reactance", "AC2.2"),
  { targetSubject: "capacitance and capacitive reactance (SI unit)", targetPerformanceType: "OTHER", claimKey: "unit202.si-unit.capacitance", parentAcId: "AC2.2" },
  { targetSubject: "capacitance and capacitive reactance (SI unit)", targetPerformanceType: "OTHER", claimKey: "unit202.si-unit.capacitive-reactance", parentAcId: "AC2.2" },
  identifyFact("power factor (SI unit / dimensional status)", "unit202.si-unit.power-factor.defining-relationship", "AC2.2"),
  identifyFact("power factor (SI unit / dimensional status)", "unit202.si-unit.power-factor.dimensionless-convention", "AC2.2"),
  {
    targetSubject: "power factor (SI unit / dimensional status)",
    targetPerformanceType: "OTHER",
    claimKey: "unit202.si-unit.power-factor.defining-relationship",
    parentAcId: "AC2.2",
  },
  {
    targetSubject: "power factor (SI unit / dimensional status)",
    targetPerformanceType: "OTHER",
    claimKey: "unit202.si-unit.power-factor.dimensionless-convention",
    parentAcId: "AC2.2",
  },
];
