/**
 * CC-22B section 7: removes CC-22A's unsafe shortcut (a historically
 * VERIFIED proposition became EXACT_CURRENT_FACTUAL_CLAIM merely because
 * SOME governing claim existed on a mapped candidate, regardless of
 * whether that claim's actual content expressed the proposition).
 *
 * Every entry below is an explicit, hand-verified binding: PA_TARGET
 * proposition text -> the real (targetCandidateKey, claimKey) whose
 * `normalizedClaimValue` GENUINELY AND FULLY expresses that exact
 * proposition -- never merely adjacent, partial, or a formula that
 * happens to reuse the same variable names. A proposition not listed
 * here is never mechanically upgraded to EXACT_CURRENT_FACTUAL_CLAIM by
 * build-benchmark.ts, however plausible-looking a candidate's other
 * claims are (CC-22A's exact defect).
 *
 * Matched against PA_TARGET by EXACT proposition text -- build-
 * benchmark.ts throws if a listed propositionText has no PA_TARGET row,
 * so a typo here fails the build rather than silently binding nothing.
 */
export interface ExactClaimBinding {
  readonly propositionText: string;
  readonly targetCandidateKey: string;
  readonly claimKey: string;
}

export const EXACT_CLAIM_BINDINGS: readonly ExactClaimBinding[] = [
  // --- AC2.1: the claim literally states unit name + symbol, exactly what each proposition asks. ---
  { propositionText: "Length: correct SI unit and unit symbol.", targetCandidateKey: "length (SI unit)::IDENTIFY", claimKey: "unit202.si-unit.length" },
  { propositionText: "Area: correct SI unit and unit symbol.", targetCandidateKey: "area (SI unit)::IDENTIFY", claimKey: "unit202.si-unit.area" },
  { propositionText: "Volume: correct SI unit and unit symbol.", targetCandidateKey: "volume (SI unit)::IDENTIFY", claimKey: "unit202.si-unit.volume" },
  { propositionText: "Mass: correct SI unit and unit symbol.", targetCandidateKey: "mass (SI unit)::IDENTIFY", claimKey: "unit202.si-unit.mass" },
  { propositionText: "Density: correct SI unit and unit symbol.", targetCandidateKey: "density (SI unit)::IDENTIFY", claimKey: "unit202.si-unit.density" },
  { propositionText: "Time: correct SI unit and unit symbol.", targetCandidateKey: "time (SI unit)::IDENTIFY", claimKey: "unit202.si-unit.time" },
  { propositionText: "Velocity: correct SI unit and unit symbol.", targetCandidateKey: "velocity (SI unit)::IDENTIFY", claimKey: "unit202.si-unit.velocity" },
  { propositionText: "Temperature: correct SI unit and unit symbol.", targetCandidateKey: "temperature (SI unit)::IDENTIFY", claimKey: "unit202.si-unit.temperature" },

  // --- AC2.3 instruments ---
  { propositionText: "Ammeter: measures current + series connection.", targetCandidateKey: "instrument for measuring current::IDENTIFY", claimKey: "unit202.review-fact.ammeter-definition" },
  { propositionText: "Voltmeter: measures potential difference + parallel connection.", targetCandidateKey: "instrument for measuring voltage::IDENTIFY", claimKey: "unit202.review-fact.voltmeter-definition" },
  { propositionText: "Ohmmeter: measures resistance.", targetCandidateKey: "instrument for measuring resistance::IDENTIFY", claimKey: "unit202.review-fact.ohmmeter-definition" },

  // --- AC3.1 mass/weight ---
  { propositionText: "Mass meaning.", targetCandidateKey: "mass and weight::DEFINE", claimKey: "unit202.review-fact.mass-definition" },
  { propositionText: "Weight meaning.", targetCandidateKey: "mass and weight::DEFINE", claimKey: "unit202.review-fact.weight-definition" },
  { propositionText: "F = mg.", targetCandidateKey: "mass and weight::DEFINE", claimKey: "unit202.review-fact.weight-definition" },

  // --- AC3.2 simple machines ---
  { propositionText: "Gear ratio / legitimate speed relationship.", targetCandidateKey: "gears::EXPLAIN", claimKey: "unit202.review-fact.gear-mechanism" },
  { propositionText: "Mechanical advantage.", targetCandidateKey: "gears::EXPLAIN", claimKey: "unit202.review-fact.mechanical-advantage" },
  { propositionText: "Force-distance trade.", targetCandidateKey: "pulleys::EXPLAIN", claimKey: "unit202.review-fact.pulley-mechanism" },

  // --- AC3.3/3.4 work/power/efficiency (force/energy/KE-PE deliberately NOT bound -- their only
  // claims are REJECT_OVERDEPTH/REJECT_NOT_NECESSARY per claim-decisions.ts) ---
  { propositionText: "W = Fd.", targetCandidateKey: "work::DESCRIBE", claimKey: "unit202.review-fact.work-formula" },
  { propositionText: "P = W/t.", targetCandidateKey: "power (mechanical)::DESCRIBE", claimKey: "unit202.review-fact.power-mechanical-formula" },
  { propositionText: "Efficiency relationship.", targetCandidateKey: "efficiency::DESCRIBE", claimKey: "unit202.review-fact.efficiency-formula" },

  // --- AC4 ---
  { propositionText: "Current as charge/electron-flow concept at calibrated depth.", targetCandidateKey: "basic principles of electron theory::DESCRIBE", claimKey: "unit202.review-fact.current-charge-flow" },
  { propositionText: "Conventional-current versus electron-flow distinction.", targetCandidateKey: "basic principles of electron theory::DESCRIBE", claimKey: "unit202.review-fact.conventional-vs-electron-flow" },
  { propositionText: "Conductors.", targetCandidateKey: "conductors (good electrical conductor materials)::IDENTIFY", claimKey: "unit202.review-fact.conductor-definition" },
  { propositionText: "Insulators.", targetCandidateKey: "insulators (electrical insulator materials)::IDENTIFY", claimKey: "unit202.review-fact.insulator-definition" },
  { propositionText: "R = rho L/A and appropriate rearrangement/use.", targetCandidateKey: "resistance and resistivity in relation to electrical circuits::DESCRIBE", claimKey: "unit202.review-fact.resistance-resistivity-relation" },
  { propositionText: "Ohm's law.", targetCandidateKey: "relationship between current, voltage and resistance in parallel and series D.C. circuits::EXPLAIN", claimKey: "unit202.review-fact.ohms-law" },
  { propositionText: "V = IR and rearrangements.", targetCandidateKey: "relationship between current, voltage and resistance in parallel and series D.C. circuits::EXPLAIN", claimKey: "unit202.review-fact.ohms-law" },
  { propositionText: "Series circuit: resistance sums.", targetCandidateKey: "relationship between current, voltage and resistance in parallel and series D.C. circuits::EXPLAIN", claimKey: "unit202.review-fact.series-resistance" },
  { propositionText: "Parallel circuit: equivalent-resistance relationship.", targetCandidateKey: "relationship between current, voltage and resistance in parallel and series D.C. circuits::EXPLAIN", claimKey: "unit202.review-fact.parallel-resistance" },
  { propositionText: "P = I^2 R.", targetCandidateKey: "values of power in parallel and series D.C. circuits::CALCULATE", claimKey: "unit202.review-fact.thermal-effect" },
  { propositionText: "P = V^2/R where appropriate.", targetCandidateKey: "values of power in parallel and series D.C. circuits::CALCULATE", claimKey: "unit202.review-fact.thermal-effect" },
  { propositionText: "Vdrop = IR.", targetCandidateKey: "voltage drop::STATE", claimKey: "unit202.review-fact.ohms-law" },
  { propositionText: "Thermal effect of current.", targetCandidateKey: "chemical and thermal effects of electric currents::DESCRIBE", claimKey: "unit202.review-fact.thermal-effect" },
  { propositionText: "Chemical effect / electrolysis.", targetCandidateKey: "chemical and thermal effects of electric currents::DESCRIBE", claimKey: "unit202.review-fact.chemical-effect" },

  // --- AC5.1/5.2 magnetism ---
  { propositionText: "Magnetic attraction/repulsion.", targetCandidateKey: "attraction and repulsion effects of magnetism::DESCRIBE", claimKey: "unit202.review-fact.magnetic-attraction-repulsion" },
  { propositionText: "Magnetic flux: meaning, symbol, unit.", targetCandidateKey: "difference between magnetic flux and flux density::STATE", claimKey: "unit202.review-fact.flux-vs-flux-density" },
  { propositionText: "Magnetic flux density: meaning, symbol, unit.", targetCandidateKey: "difference between magnetic flux and flux density::STATE", claimKey: "unit202.review-fact.flux-vs-flux-density" },
  { propositionText: "B = Phi/A and appropriate rearrangement/use.", targetCandidateKey: "difference between magnetic flux and flux density::STATE", claimKey: "unit202.review-fact.flux-vs-flux-density" },

  // --- AC5.3 (Fleming rules, solenoid, e=Blv all deliberately NOT bound -- absent from the QP
  // model entirely; force-on-conductor/electromotive-force's only claims are REJECT_OVERDEPTH) ---
  { propositionText: "Magnetic field around a current-carrying conductor.", targetCandidateKey: "production of a magnetic field::DESCRIBE", claimKey: "unit202.review-fact.magnetic-field-production" },
  { propositionText: "Right-hand grip rule.", targetCandidateKey: "production of a magnetic field::DESCRIBE", claimKey: "unit202.review-fact.magnetic-field-production" },

  // --- AC6.2 components (task section 4's AC6.2 rule already established these as genuine
  // operating-principle descriptions -- resistor and photo deliberately excluded) ---
  { propositionText: "Capacitor: basic operating principle.", targetCandidateKey: "capacitors::STATE", claimKey: "unit202.review-fact.capacitor-definition" },
  { propositionText: "DIAC: basic operating principle.", targetCandidateKey: "diacs::STATE", claimKey: "unit202.review-fact.diac-definition" },
  { propositionText: "Diode: basic operating principle.", targetCandidateKey: "diodes::STATE", claimKey: "unit202.review-fact.diode-definition" },
  // NOTE: "invertors::STATE" cites claimKey unit202.review-fact.invertor-definition in its
  // CandidateFactRequirement, but NO matching SourceFactualClaim exists in the frozen QP input
  // (mechanically confirmed -- CC-22A's certification-decisions.ts rationale for this candidate
  // was wrong on this point). Deliberately NOT bound here.
  { propositionText: "LED: basic operating principle.", targetCandidateKey: "LED::STATE", claimKey: "unit202.review-fact.led-definition" },
  { propositionText: "Rectifier: basic operating principle.", targetCandidateKey: "rectifiers::STATE", claimKey: "unit202.review-fact.rectifier-definition" },
  { propositionText: "Thermistor: basic operating principle.", targetCandidateKey: "thermistors::STATE", claimKey: "unit202.review-fact.thermistor-definition" },
  { propositionText: "Thyristor (SCR): basic operating principle.", targetCandidateKey: "thyristors::STATE", claimKey: "unit202.review-fact.thyristor-definition" },
  { propositionText: "Transistor: basic operating principle.", targetCandidateKey: "transistors::STATE", claimKey: "unit202.review-fact.transistor-definition" },
  { propositionText: "TRIAC: basic operating principle.", targetCandidateKey: "triacs::STATE", claimKey: "unit202.review-fact.triac-definition" },
  { propositionText: "Zener diode: basic operating principle.", targetCandidateKey: "Zener::STATE", claimKey: "unit202.review-fact.zener-definition" },
] as const;
