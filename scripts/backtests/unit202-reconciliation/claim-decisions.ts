/**
 * CC-22A: the ONLY authorised SemanticAdjudication decisions for this
 * package. CC-22 (commit d828e78, now corrected) applied REQUIRED_CORE to
 * every REVIEW_PROPOSED CandidateFactRequirement by default -- prohibited
 * by CC-22A task section 3: "A REVIEW_PROPOSED fact may govern only when
 * an explicit PA decision below authorises that exact proposition/claim.
 * Unlisted REVIEW_PROPOSED facts remain UNRESOLVED/non-governing."
 *
 * Every entry below traces to an explicit instruction in the CC-22A task
 * prompt (section 4's REQUIRED_CORE/REQUIRED_OPERATIONAL list, section
 * 4's AC6.2 operating-principle rule, or section 5's six named
 * REJECT_OVERDEPTH/REJECT_NOT_NECESSARY decisions). No other
 * REVIEW_PROPOSED CandidateFactRequirement in the corpus is adjudicated
 * by this package -- confirmed by build-reconciliation.ts's own
 * completeness check against the real frozen input.
 */
import type { SemanticAdjudicationDecision } from "@alp/qualification-pipeline";

export interface ClaimDecision {
  readonly targetCandidateKey: string;
  readonly claimKey: string;
  readonly decision: SemanticAdjudicationDecision;
  readonly rationale: string;
  readonly taskSection: string;
}

export const CLAIM_DECISIONS: readonly ClaimDecision[] = [
  // --- AC2.3 instruments (task section 4 + section 8) ---
  {
    targetCandidateKey: "instrument for measuring current::IDENTIFY",
    claimKey: "unit202.review-fact.ammeter-definition",
    decision: "REQUIRED_OPERATIONAL",
    rationale: "Ammeter identity + series connection -- legitimate REQUIRED_OPERATIONAL knowledge (task section 4, section 8).",
    taskSection: "4, 8",
  },
  {
    targetCandidateKey: "instrument for measuring voltage::IDENTIFY",
    claimKey: "unit202.review-fact.voltmeter-definition",
    decision: "REQUIRED_OPERATIONAL",
    rationale: "Voltmeter identity + parallel connection -- legitimate REQUIRED_OPERATIONAL knowledge (task section 4, section 8).",
    taskSection: "4, 8",
  },
  {
    targetCandidateKey: "instrument for measuring resistance::IDENTIFY",
    claimKey: "unit202.review-fact.ohmmeter-definition",
    decision: "REQUIRED_CORE",
    rationale: "Ohmmeter identity as resistance-measuring instrument (task section 4). Section 8: this claim establishes identity/measurement only, NOT the full safe-use/connection procedure -- the operational boundary is not complete from this fact alone (see certification decision).",
    taskSection: "4, 8",
  },
  {
    targetCandidateKey: "instrument for measuring power::IDENTIFY",
    claimKey: "unit202.review-fact.wattmeter",
    decision: "REQUIRED_CORE",
    rationale: "Wattmeter identity as power-measuring instrument (task section 4).",
    taskSection: "4",
  },
  {
    targetCandidateKey: "instrument for measuring energy::IDENTIFY",
    claimKey: "unit202.review-fact.energy-meter",
    decision: "REQUIRED_CORE",
    rationale: "Energy-meter identity as energy-measuring instrument (task section 4).",
    taskSection: "4",
  },

  // --- AC3.1 mass and weight (task section 4) ---
  { targetCandidateKey: "mass and weight::DEFINE", claimKey: "unit202.review-fact.mass-definition", decision: "REQUIRED_CORE", rationale: "Mass definition (task section 4).", taskSection: "4" },
  { targetCandidateKey: "mass and weight::DEFINE", claimKey: "unit202.review-fact.weight-definition", decision: "REQUIRED_CORE", rationale: "Weight definition including F = mg (task section 4).", taskSection: "4" },

  // --- AC3.2 simple machines (task section 4) ---
  { targetCandidateKey: "lever class I::EXPLAIN", claimKey: "unit202.review-fact.lever-class-1", decision: "REQUIRED_CORE", rationale: "Lever-class configuration fact (task section 4).", taskSection: "4" },
  { targetCandidateKey: "lever class II::EXPLAIN", claimKey: "unit202.review-fact.lever-class-2", decision: "REQUIRED_CORE", rationale: "Lever-class configuration fact (task section 4).", taskSection: "4" },
  { targetCandidateKey: "lever class III::EXPLAIN", claimKey: "unit202.review-fact.lever-class-3", decision: "REQUIRED_CORE", rationale: "Lever-class configuration fact (task section 4).", taskSection: "4" },
  { targetCandidateKey: "gears::EXPLAIN", claimKey: "unit202.review-fact.gear-mechanism", decision: "REQUIRED_CORE", rationale: "Gear mechanism / legitimate ratio relationship (task section 4).", taskSection: "4" },
  { targetCandidateKey: "gears::EXPLAIN", claimKey: "unit202.review-fact.mechanical-advantage", decision: "REQUIRED_CORE", rationale: "Simple-machine mechanical advantage (task section 4).", taskSection: "4" },
  { targetCandidateKey: "pulleys::EXPLAIN", claimKey: "unit202.review-fact.mechanical-advantage", decision: "REQUIRED_CORE", rationale: "Simple-machine mechanical advantage (task section 4).", taskSection: "4" },
  { targetCandidateKey: "pulleys::EXPLAIN", claimKey: "unit202.review-fact.pulley-mechanism", decision: "REQUIRED_CORE", rationale: "Pulley mechanism / legitimate mechanical advantage (task section 4).", taskSection: "4" },

  // --- AC3.3/3.4 work/power/efficiency (task section 4) -- NOT force (see REJECT below), NOT the bundled KE/PE claim (see REJECT below) ---
  { targetCandidateKey: "work::DESCRIBE", claimKey: "unit202.review-fact.work-formula", decision: "REQUIRED_CORE", rationale: "W = Fd (task section 4).", taskSection: "4" },
  { targetCandidateKey: "power (mechanical)::DESCRIBE", claimKey: "unit202.review-fact.power-mechanical-formula", decision: "REQUIRED_CORE", rationale: "P = W/t (task section 4).", taskSection: "4" },
  { targetCandidateKey: "inter-relationships between force, work, energy, power and efficiency::DESCRIBE", claimKey: "unit202.review-fact.power-mechanical-formula", decision: "REQUIRED_CORE", rationale: "P = W/t (task section 4) -- NOTE: task section 9 explicitly holds this candidate is NOT complete merely from P=W/t; see certification decision (PARTIAL, not COMPLETE).", taskSection: "4, 9" },
  { targetCandidateKey: "power (calculation, mechanical)::CALCULATE", claimKey: "unit202.review-fact.power-mechanical-formula", decision: "REQUIRED_CORE", rationale: "P = W/t (task section 4).", taskSection: "4" },
  { targetCandidateKey: "efficiency::DESCRIBE", claimKey: "unit202.review-fact.efficiency-formula", decision: "REQUIRED_CORE", rationale: "Efficiency relationship (task section 4).", taskSection: "4" },
  { targetCandidateKey: "efficiency (calculation)::CALCULATE", claimKey: "unit202.review-fact.efficiency-formula", decision: "REQUIRED_CORE", rationale: "Efficiency relationship (task section 4).", taskSection: "4" },

  // --- AC4.1 electron theory (task section 4) ---
  { targetCandidateKey: "basic principles of electron theory::DESCRIBE", claimKey: "unit202.review-fact.current-charge-flow", decision: "REQUIRED_CORE", rationale: "Current as charge flow (task section 4).", taskSection: "4" },
  { targetCandidateKey: "basic principles of electron theory::DESCRIBE", claimKey: "unit202.review-fact.conventional-vs-electron-flow", decision: "REQUIRED_CORE", rationale: "Conventional versus electron-flow distinction (task section 4).", taskSection: "4" },

  // --- AC4.2 conductors/insulators (task section 4) ---
  { targetCandidateKey: "conductors (good electrical conductor materials)::IDENTIFY", claimKey: "unit202.review-fact.conductor-definition", decision: "REQUIRED_CORE", rationale: "Conductor definition (task section 4).", taskSection: "4" },
  { targetCandidateKey: "conductors (good electrical conductor materials)::DISTINGUISH", claimKey: "unit202.review-fact.conductor-definition", decision: "REQUIRED_CORE", rationale: "Conductor definition (task section 4).", taskSection: "4" },
  { targetCandidateKey: "insulators (electrical insulator materials)::IDENTIFY", claimKey: "unit202.review-fact.insulator-definition", decision: "REQUIRED_CORE", rationale: "Insulator definition (task section 4).", taskSection: "4" },
  { targetCandidateKey: "insulators (electrical insulator materials)::DISTINGUISH", claimKey: "unit202.review-fact.insulator-definition", decision: "REQUIRED_CORE", rationale: "Insulator definition (task section 4).", taskSection: "4" },

  // --- AC4.3/4.4/4.5/4.6/4.7 DC circuits (task section 4 + section 10) ---
  { targetCandidateKey: "resistance and resistivity in relation to electrical circuits::DESCRIBE", claimKey: "unit202.review-fact.ohms-law", decision: "REQUIRED_CORE", rationale: "Ohm's-law relationship where the target is an actual DC-circuit/resistance performance (task section 4).", taskSection: "4" },
  { targetCandidateKey: "resistance and resistivity in relation to electrical circuits::DESCRIBE", claimKey: "unit202.review-fact.resistance-resistivity-relation", decision: "REQUIRED_CORE", rationale: "R = rho L/A (task section 4).", taskSection: "4" },
  {
    targetCandidateKey: "relationship between current, voltage and resistance in parallel and series D.C. circuits::EXPLAIN",
    claimKey: "unit202.review-fact.ohms-law",
    decision: "REQUIRED_CORE",
    rationale: "Ohm's-law relationship, actual DC-circuit performance (task section 4) -- NOTE: task section 10 explicitly holds the series/parallel relationship is NOT complete without current-continuity/voltage-commonality statements; see certification decision (PARTIAL, not COMPLETE).",
    taskSection: "4, 10",
  },
  { targetCandidateKey: "relationship between current, voltage and resistance in parallel and series D.C. circuits::EXPLAIN", claimKey: "unit202.review-fact.series-resistance", decision: "REQUIRED_CORE", rationale: "Series-resistance relationship (task section 4).", taskSection: "4" },
  { targetCandidateKey: "relationship between current, voltage and resistance in parallel and series D.C. circuits::EXPLAIN", claimKey: "unit202.review-fact.parallel-resistance", decision: "REQUIRED_CORE", rationale: "Parallel-resistance relationship (task section 4).", taskSection: "4" },
  { targetCandidateKey: "current (calculation, D.C. circuits)::CALCULATE", claimKey: "unit202.review-fact.ohms-law", decision: "REQUIRED_CORE", rationale: "Ohm's-law relationship, actual calculation performance (task section 4).", taskSection: "4" },
  { targetCandidateKey: "voltage (calculation, D.C. circuits)::CALCULATE", claimKey: "unit202.review-fact.ohms-law", decision: "REQUIRED_CORE", rationale: "Ohm's-law relationship, actual calculation performance (task section 4).", taskSection: "4" },
  { targetCandidateKey: "resistance (calculation, D.C. circuits)::CALCULATE", claimKey: "unit202.review-fact.ohms-law", decision: "REQUIRED_CORE", rationale: "Ohm's-law relationship, actual calculation performance (task section 4).", taskSection: "4" },
  { targetCandidateKey: "values of current, voltage and resistance in parallel and series D.C. circuits::CALCULATE", claimKey: "unit202.review-fact.ohms-law", decision: "REQUIRED_CORE", rationale: "Ohm's-law relationship, actual calculation performance (task section 4).", taskSection: "4" },
  {
    targetCandidateKey: "values of power in parallel and series D.C. circuits::CALCULATE",
    claimKey: "unit202.review-fact.thermal-effect",
    decision: "REQUIRED_CORE",
    rationale: "Legitimate thermal-effect relationship P=I^2R=V^2/R (task section 4) -- NOTE: task section 10 explicitly holds this does not exhaust electrical-power knowledge while the more foundational P=VI form is absent; see certification decision (PARTIAL, not COMPLETE).",
    taskSection: "4, 10",
  },
  {
    targetCandidateKey: "voltage drop::STATE",
    claimKey: "unit202.review-fact.ohms-law",
    decision: "REQUIRED_CORE",
    rationale: "Task section 10 explicitly lists 'applicable V=IR relationship' as required voltage-drop content -- legitimate here (unlike resistors::STATE, see REJECT below). The claim's generic framing (not distinctly voltage-drop-specific) means the boundary is not yet COMPLETE; see certification decision.",
    taskSection: "10",
  },
  { targetCandidateKey: "chemical and thermal effects of electric currents::DESCRIBE", claimKey: "unit202.review-fact.chemical-effect", decision: "REQUIRED_CORE", rationale: "Chemical effect/electrolysis concept (task section 4).", taskSection: "4" },
  { targetCandidateKey: "chemical and thermal effects of electric currents::DESCRIBE", claimKey: "unit202.review-fact.thermal-effect", decision: "REQUIRED_CORE", rationale: "Legitimate thermal-effect relationship (task section 4).", taskSection: "4" },

  // --- AC5.1/5.2 magnetism (task section 4) ---
  { targetCandidateKey: "attraction and repulsion effects of magnetism::DESCRIBE", claimKey: "unit202.review-fact.magnetic-attraction-repulsion", decision: "REQUIRED_CORE", rationale: "Magnetic attraction/repulsion (task section 4).", taskSection: "4" },
  { targetCandidateKey: "difference between magnetic flux and flux density::STATE", claimKey: "unit202.review-fact.flux-vs-flux-density", decision: "REQUIRED_CORE", rationale: "Flux-versus-flux-density relationship including B = Phi/A (task section 4).", taskSection: "4" },

  // --- AC5.3 (task section 4) -- conductor field + right-hand grip only; NOT force-on-conductor's vector form, NOT electromotive-force's differential form (see REJECT below) ---
  { targetCandidateKey: "production of a magnetic field::DESCRIBE", claimKey: "unit202.review-fact.magnetic-field-production", decision: "REQUIRED_CORE", rationale: "Current-carrying-conductor magnetic field + right-hand grip direction (task section 4).", taskSection: "4" },

  // --- AC6.2 component families (task section 4's own rule): REQUIRED_CORE only where the exact
  // normalizedClaimValue genuinely describes the component's operating principle, not an adjacent
  // circuit formula. Verified against each claim's real text (CC-22 research). Excludes
  // resistors::STATE (section 5F) and photo::STATE (no CandidateFactRequirement exists at all). ---
  { targetCandidateKey: "capacitors::STATE", claimKey: "unit202.review-fact.capacitor-definition", decision: "REQUIRED_CORE", rationale: "Claim genuinely describes the capacitor's operating principle (charge storage), not an adjacent formula (task section 4's AC6.2 rule).", taskSection: "4" },
  { targetCandidateKey: "diacs::STATE", claimKey: "unit202.review-fact.diac-definition", decision: "REQUIRED_CORE", rationale: "Genuine operating-principle description.", taskSection: "4" },
  { targetCandidateKey: "diodes::STATE", claimKey: "unit202.review-fact.diode-definition", decision: "REQUIRED_CORE", rationale: "Genuine operating-principle description.", taskSection: "4" },
  { targetCandidateKey: "invertors::STATE", claimKey: "unit202.review-fact.invertor-definition", decision: "REQUIRED_CORE", rationale: "Genuine operating-principle description.", taskSection: "4" },
  { targetCandidateKey: "LED::STATE", claimKey: "unit202.review-fact.led-definition", decision: "REQUIRED_CORE", rationale: "Genuine operating-principle description.", taskSection: "4" },
  { targetCandidateKey: "rectifiers::STATE", claimKey: "unit202.review-fact.rectifier-definition", decision: "REQUIRED_CORE", rationale: "Genuine (general) operating-principle description of the rectification process -- not an adjacent formula. Half-wave/full-wave distinction remains a separate technical-evidence gap (dossier: CONDITIONAL_SOURCE_GAP).", taskSection: "4" },
  { targetCandidateKey: "thermistors::STATE", claimKey: "unit202.review-fact.thermistor-definition", decision: "REQUIRED_CORE", rationale: "Genuine operating-principle description.", taskSection: "4" },
  { targetCandidateKey: "thyristors::STATE", claimKey: "unit202.review-fact.thyristor-definition", decision: "REQUIRED_CORE", rationale: "Genuine operating-principle description.", taskSection: "4" },
  { targetCandidateKey: "transistors::STATE", claimKey: "unit202.review-fact.transistor-definition", decision: "REQUIRED_CORE", rationale: "Genuine operating-principle description.", taskSection: "4" },
  { targetCandidateKey: "triacs::STATE", claimKey: "unit202.review-fact.triac-definition", decision: "REQUIRED_CORE", rationale: "Genuine operating-principle description.", taskSection: "4" },
  { targetCandidateKey: "Zener::STATE", claimKey: "unit202.review-fact.zener-definition", decision: "REQUIRED_CORE", rationale: "Genuine operating-principle description.", taskSection: "4" },

  // ===================================================================
  // Explicit non-governing decisions (task section 5).
  // ===================================================================
  {
    targetCandidateKey: "energy (kinetic and potential)::DESCRIBE",
    claimKey: "unit202.review-fact.kinetic-potential-energy-formula",
    decision: "REJECT_OVERDEPTH",
    rationale: "Task section 5A: the atomic claim bundles required PE=mgh with non-required KE=1/2mv^2 and cannot be partially promoted.",
    taskSection: "5A",
  },
  {
    targetCandidateKey: "mechanical energy (calculation)::CALCULATE",
    claimKey: "unit202.review-fact.kinetic-potential-energy-formula",
    decision: "REJECT_OVERDEPTH",
    rationale: "Task section 5A -- same bundled claim, second independent CandidateFactRequirement.",
    taskSection: "5A",
  },
  {
    targetCandidateKey: "electromotive force::DESCRIBE",
    claimKey: "unit202.review-fact.faradays-law",
    decision: "REJECT_OVERDEPTH",
    rationale: "Task section 5B: epsilon=-N dPhi/dt is differential Faraday-law formalism, not the required Level-appropriate causal EMF concept / e=Blv relationship.",
    taskSection: "5B",
  },
  { targetCandidateKey: "EMF (AC generation principle)::DESCRIBE", claimKey: "unit202.review-fact.faradays-law", decision: "REJECT_OVERDEPTH", rationale: "Task section 5B -- same claim, independent CandidateFactRequirement.", taskSection: "5B" },
  { targetCandidateKey: "magnetic flux (AC generation principle)::DESCRIBE", claimKey: "unit202.review-fact.faradays-law", decision: "REJECT_OVERDEPTH", rationale: "Task section 5B -- same claim, independent CandidateFactRequirement.", taskSection: "5B" },
  { targetCandidateKey: "single-loop generator::DESCRIBE", claimKey: "unit202.review-fact.faradays-law", decision: "REJECT_OVERDEPTH", rationale: "Task section 5B -- same claim, independent CandidateFactRequirement.", taskSection: "5B" },
  {
    targetCandidateKey: "sine-wave (AC generation principle)::DESCRIBE",
    claimKey: "unit202.review-fact.ac-sine-equation",
    decision: "REJECT_OVERDEPTH",
    rationale: "Task section 5C: V = V0 sin(2*pi*f*t) is not required Unit-202 mastery.",
    taskSection: "5C",
  },
  { targetCandidateKey: "frequency (AC generation principle)::DESCRIBE", claimKey: "unit202.review-fact.ac-sine-equation", decision: "REJECT_OVERDEPTH", rationale: "Task section 5C -- same claim, independent CandidateFactRequirement.", taskSection: "5C" },
  { targetCandidateKey: "frequency (sine-wave characteristic)::IDENTIFY", claimKey: "unit202.review-fact.ac-sine-equation", decision: "REJECT_OVERDEPTH", rationale: "Task section 5C -- same claim, independent CandidateFactRequirement.", taskSection: "5C" },
  {
    targetCandidateKey: "force::DESCRIBE",
    claimKey: "unit202.review-fact.force-definition",
    decision: "REJECT_NOT_NECESSARY",
    rationale: "Task section 5D: the claim's factual value is F=ma -- the calibrated Unit-202 calculation boundary requires F=mg (weight) and W=Fd (work); a separate F=ma mastery requirement is not manufactured.",
    taskSection: "5D",
  },
  {
    targetCandidateKey: "force on a current-carrying conductor in a magnetic field::DESCRIBE",
    claimKey: "unit202.review-fact.force-on-conductor",
    decision: "REJECT_OVERDEPTH",
    rationale: "Task section 5E: the atomic value is the vector/cross-product formalism F = Il x B. Required target remains the Level-appropriate scalar F=BIL plus Fleming left-hand mapping -- since the current claim cannot be partially accepted, a missing suitable technical fact is recorded instead of promoting the vector formalism.",
    taskSection: "5E",
  },
  {
    targetCandidateKey: "resistors::STATE",
    claimKey: "unit202.review-fact.ohms-law",
    decision: "REJECT_NOT_NECESSARY",
    rationale: "Task section 5F: R=V/I is not a resistor-component operating-principle description. A resistor operating-principle fact remains required separately (see technical-evidence-gap manifest).",
    taskSection: "5F",
  },
] as const;
