/**
 * CC-19R/CC-19R1 clean-room REVIEW_PROPOSED knowledge-decomposition
 * proposals (task sections 20-24; completed by CC-19R1 sections 7-10).
 *
 * For each targeted required curriculum candidate, this asks: "what
 * minimal independently checkable factual/procedural proposition would a
 * learner have to know to legitimately perform exactly this syllabus
 * requirement at this qualification level?" -- a NORMALIZATION PROPOSAL,
 * never authority to expand scope (CC-19R section 20-21).
 *
 * Every entry preserves the exact curriculum source excerpt that creates
 * the PARENT performance (via `parentAcId`, resolved against
 * curriculum-data.ts at build time) and a `necessityRationale`. All
 * entries carry normalizationConfidence = REVIEW_PROPOSED and MUST NOT
 * auto-govern (CC-19R section 21, 25).
 *
 * CC-19R1 note: the original CC-19R batch below (through the AC6.2
 * transistor entry) was a "curated, non-exhaustive subset" left
 * deliberately incomplete -- CC-19R1 section 7 identified that as a
 * defect ("contradicts the back-test requirement") and requires a
 * DecompositionAttempt for every one of the 140 curriculum candidates.
 * The CC-19R1 additions further down in this file (plus
 * ATOMIC_BY_DESIGN_SUBJECTS and GENUINELY_UNRESOLVED_SUBJECTS) complete
 * that attempt. The original 31 CC-19R proposals are preserved unchanged
 * except for mechanical schema/target-key corrections (see inline
 * CC-19R1 comments where applied).
 */

import type { LearnerPerformanceType } from "@alp/qualification-pipeline";

export interface ReviewFactProposal {
  readonly targetSubject: string;
  readonly targetPerformanceType: LearnerPerformanceType;
  readonly claimKey: string;
  readonly parentAcId: string;
  readonly necessityRationale: string;
  /** TECHNICAL_CLAIMS claimKey researched to support this proposition, if any was found (CC-19R section 22). Absent = TECHNICAL_TRUTH_GAP (CC-19R1 section 11). */
  readonly technicalClaimKey?: string;
}

export const REVIEW_FACT_PROPOSALS: readonly ReviewFactProposal[] = [
  // ---- AC3.1: mass and weight (DEFINE) ----
  {
    targetSubject: "mass and weight",
    targetPerformanceType: "DEFINE",
    claimKey: "unit202.review-fact.mass-definition",
    parentAcId: "AC3.1",
    necessityRationale: "AC3.1 requires the learner to 'specify what is meant by mass' -- defining mass minimally requires knowing it is the quantity of matter in an object, distinct from weight.",
    technicalClaimKey: "unit202.review-fact.mass-definition",
  },
  {
    targetSubject: "mass and weight",
    targetPerformanceType: "DEFINE",
    claimKey: "unit202.review-fact.weight-definition",
    parentAcId: "AC3.1",
    necessityRationale: "AC3.1 requires the learner to 'specify what is meant by ... weight' -- defining weight minimally requires knowing it is the gravitational force on an object (W=mg), distinguishing it from mass.",
    technicalClaimKey: "unit202.review-fact.weight-definition",
  },
  // ---- AC3.3: force/work/energy/power/efficiency (DESCRIBE) ----
  {
    targetSubject: "work",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.work-formula",
    parentAcId: "AC3.3",
    necessityRationale: "AC3.3.b requires describing the principle of 'work' -- minimally requires knowing work is the product of force and distance moved.",
    technicalClaimKey: "unit202.review-fact.work-formula",
  },
  {
    targetSubject: "energy (kinetic and potential)",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.kinetic-potential-energy-formula",
    parentAcId: "AC3.3",
    necessityRationale: "AC3.3.c explicitly names 'energy (kinetic and potential)' -- describing both forms minimally requires the KE=1/2mv^2 and PE=mgh relationships that distinguish them.",
    technicalClaimKey: "unit202.review-fact.kinetic-potential-energy-formula",
  },
  {
    targetSubject: "power (mechanical)",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.power-mechanical-formula",
    parentAcId: "AC3.3",
    necessityRationale: "AC3.3.d requires describing the principle of 'power' -- minimally requires knowing power is the rate of doing work, P=W/t.",
    technicalClaimKey: "unit202.review-fact.power-mechanical-formula",
  },
  {
    targetSubject: "efficiency",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.efficiency-formula",
    parentAcId: "AC3.3",
    necessityRationale: "AC3.3.e requires describing the principle of 'efficiency' -- minimally requires knowing efficiency is useful output work divided by input work, expressed as a percentage.",
    technicalClaimKey: "unit202.review-fact.efficiency-formula",
  },
  {
    targetSubject: "mechanical energy (calculation)",
    targetPerformanceType: "CALCULATE",
    claimKey: "unit202.review-fact.kinetic-potential-energy-formula",
    parentAcId: "AC3.4",
    necessityRationale: "AC3.4 requires calculating values of mechanical energy -- performing the calculation minimally requires the KE/PE formulas already established for AC3.3.",
    technicalClaimKey: "unit202.review-fact.kinetic-potential-energy-formula",
  },
  {
    targetSubject: "power (calculation, mechanical)",
    targetPerformanceType: "CALCULATE",
    claimKey: "unit202.review-fact.power-mechanical-formula",
    parentAcId: "AC3.4",
    necessityRationale: "AC3.4 requires calculating values of power -- performing the calculation minimally requires the P=W/t formula.",
    technicalClaimKey: "unit202.review-fact.power-mechanical-formula",
  },
  {
    targetSubject: "efficiency (calculation)",
    targetPerformanceType: "CALCULATE",
    claimKey: "unit202.review-fact.efficiency-formula",
    parentAcId: "AC3.4",
    necessityRationale: "AC3.4 requires calculating values of efficiency -- performing the calculation minimally requires the %efficiency=Wo/Wi x100 formula.",
    technicalClaimKey: "unit202.review-fact.efficiency-formula",
  },
  // ---- AC4.1: electron theory (DESCRIBE) ----
  {
    targetSubject: "basic principles of electron theory",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.current-charge-flow",
    parentAcId: "AC4.1",
    necessityRationale: "AC4.1 requires describing basic principles of electron theory -- minimally requires knowing current is the rate of flow of charge.",
    technicalClaimKey: "unit202.review-fact.current-charge-flow",
  },
  {
    targetSubject: "basic principles of electron theory",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.conventional-vs-electron-flow",
    parentAcId: "AC4.1",
    necessityRationale: "AC4.1 requires describing basic principles of electron theory -- minimally requires knowing conventional current direction is opposite to the actual electron-flow direction in a metal conductor.",
    technicalClaimKey: "unit202.review-fact.conventional-vs-electron-flow",
  },
  // ---- AC4.2: conductors and insulators (IDENTIFY, DISTINGUISH) ----
  // CC-19R1 fix: AC4.2's compound performance is "identify and distinguish"
  // (both EXPLICIT) -- CC-19R only wired DISTINGUISH, leaving the IDENTIFY
  // candidateKeys unattempted (candidate-key resolution bug, section 2 item C).
  {
    targetSubject: "conductors (good electrical conductor materials)",
    targetPerformanceType: "IDENTIFY",
    claimKey: "unit202.review-fact.conductor-definition",
    parentAcId: "AC4.2",
    necessityRationale: "AC4.2 requires identifying materials which are good conductors -- minimally requires knowing a conductor has free electrons allowing charge to move.",
    technicalClaimKey: "unit202.review-fact.conductor-definition",
  },
  {
    targetSubject: "conductors (good electrical conductor materials)",
    targetPerformanceType: "DISTINGUISH",
    claimKey: "unit202.review-fact.conductor-definition",
    parentAcId: "AC4.2",
    necessityRationale: "AC4.2 requires distinguishing conductors from insulators -- minimally requires knowing a conductor has free electrons allowing charge to move.",
    technicalClaimKey: "unit202.review-fact.conductor-definition",
  },
  {
    targetSubject: "insulators (electrical insulator materials)",
    targetPerformanceType: "IDENTIFY",
    claimKey: "unit202.review-fact.insulator-definition",
    parentAcId: "AC4.2",
    necessityRationale: "AC4.2 requires identifying materials which are insulators -- minimally requires knowing an insulator does not allow charge to move freely.",
    technicalClaimKey: "unit202.review-fact.insulator-definition",
  },
  {
    targetSubject: "insulators (electrical insulator materials)",
    targetPerformanceType: "DISTINGUISH",
    claimKey: "unit202.review-fact.insulator-definition",
    parentAcId: "AC4.2",
    necessityRationale: "AC4.2 requires distinguishing conductors from insulators -- minimally requires knowing an insulator does not allow charge to move freely.",
    technicalClaimKey: "unit202.review-fact.insulator-definition",
  },
  // ---- AC4.3: resistance and resistivity (DESCRIBE) ----
  {
    targetSubject: "resistance and resistivity in relation to electrical circuits",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.ohms-law",
    parentAcId: "AC4.3",
    necessityRationale: "AC4.3 requires describing what is meant by resistance -- minimally requires the defining relationship R=V/I.",
    technicalClaimKey: "unit202.review-fact.ohms-law",
  },
  {
    targetSubject: "resistance and resistivity in relation to electrical circuits",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.resistance-resistivity-relation",
    parentAcId: "AC4.3",
    necessityRationale: "AC4.3 requires describing what is meant by resistivity in relation to electrical circuits -- minimally requires the relationship R=rho L/A connecting resistivity to resistance.",
    technicalClaimKey: "unit202.review-fact.resistance-resistivity-relation",
  },
  // ---- AC4.4/AC4.5: relationship between current, voltage, resistance (EXPLAIN, CALCULATE) ----
  {
    targetSubject: "relationship between current, voltage and resistance in parallel and series D.C. circuits",
    targetPerformanceType: "EXPLAIN",
    claimKey: "unit202.review-fact.ohms-law",
    parentAcId: "AC4.4",
    necessityRationale: "AC4.4 requires explaining the relationship between current, voltage and resistance -- minimally requires Ohm's law, R=V/I.",
    technicalClaimKey: "unit202.review-fact.ohms-law",
  },
  {
    targetSubject: "relationship between current, voltage and resistance in parallel and series D.C. circuits",
    targetPerformanceType: "EXPLAIN",
    claimKey: "unit202.review-fact.series-resistance",
    parentAcId: "AC4.4",
    necessityRationale: "AC4.4 requires explaining the relationship in series circuits specifically -- minimally requires the series total-resistance formula.",
    technicalClaimKey: "unit202.review-fact.series-resistance",
  },
  {
    targetSubject: "relationship between current, voltage and resistance in parallel and series D.C. circuits",
    targetPerformanceType: "EXPLAIN",
    claimKey: "unit202.review-fact.parallel-resistance",
    parentAcId: "AC4.4",
    necessityRationale: "AC4.4 requires explaining the relationship in parallel circuits specifically -- minimally requires the parallel total-resistance formula.",
    technicalClaimKey: "unit202.review-fact.parallel-resistance",
  },
  {
    targetSubject: "values of current, voltage and resistance in parallel and series D.C. circuits",
    targetPerformanceType: "CALCULATE",
    claimKey: "unit202.review-fact.ohms-law",
    parentAcId: "AC4.5",
    necessityRationale: "AC4.5 requires calculating current, voltage and resistance values -- performing the calculation minimally requires Ohm's law, R=V/I.",
    technicalClaimKey: "unit202.review-fact.ohms-law",
  },
  // ---- AC4.8: chemical and thermal effects (DESCRIBE) ----
  {
    targetSubject: "chemical and thermal effects of electric currents",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.thermal-effect",
    parentAcId: "AC4.8",
    necessityRationale: "AC4.8 requires describing the thermal effect of electric currents -- minimally requires knowing resistive/thermal power dissipation, P=I^2R.",
    technicalClaimKey: "unit202.review-fact.thermal-effect",
  },
  {
    targetSubject: "chemical and thermal effects of electric currents",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.chemical-effect",
    parentAcId: "AC4.8",
    necessityRationale: "AC4.8 requires describing the chemical effect of electric currents -- minimally requires knowing current can drive nonspontaneous chemical decomposition (electrolysis).",
    technicalClaimKey: "unit202.review-fact.chemical-effect",
  },
  // ---- AC5.1: attraction and repulsion (DESCRIBE) ----
  {
    targetSubject: "attraction and repulsion effects of magnetism",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.magnetic-attraction-repulsion",
    parentAcId: "AC5.1",
    necessityRationale: "AC5.1 requires describing the effects of magnetism in terms of attraction and repulsion -- minimally requires knowing like poles repel and unlike poles attract.",
    technicalClaimKey: "unit202.review-fact.magnetic-attraction-repulsion",
  },
  // ---- AC5.2: flux vs flux density (STATE) ----
  {
    targetSubject: "difference between magnetic flux and flux density",
    targetPerformanceType: "STATE",
    claimKey: "unit202.review-fact.flux-vs-flux-density",
    parentAcId: "AC5.2",
    necessityRationale: "AC5.2 requires stating the difference between magnetic flux and flux density -- minimally requires knowing flux (Wb) is a total quantity and flux density (T) is flux per unit area.",
    technicalClaimKey: "unit202.review-fact.flux-vs-flux-density",
  },
  // ---- AC5.3 children (DESCRIBE) ----
  {
    targetSubject: "force on a current-carrying conductor in a magnetic field",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.force-on-conductor",
    parentAcId: "AC5.3",
    necessityRationale: "AC5.3.b requires describing force on a current-carrying conductor in a magnetic field -- minimally requires the relationship F = I l x B.",
    technicalClaimKey: "unit202.review-fact.force-on-conductor",
  },
  {
    targetSubject: "electromotive force",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.faradays-law",
    parentAcId: "AC5.3",
    necessityRationale: "AC5.3.d requires describing electromotive force as a magnetic effect of electrical currents -- minimally requires Faraday's law relating induced EMF to the rate of change of magnetic flux.",
    technicalClaimKey: "unit202.review-fact.faradays-law",
  },
  // ---- AC5.4 children (DESCRIBE) ----
  {
    targetSubject: "EMF (AC generation principle)",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.faradays-law",
    parentAcId: "AC5.4",
    necessityRationale: "AC5.4.d requires describing EMF as a principle of generating an A.C. supply -- minimally requires Faraday's law.",
    technicalClaimKey: "unit202.review-fact.faradays-law",
  },
  // ---- AC6.2 selected explicit Range members (STATE) ----
  {
    targetSubject: "diodes",
    targetPerformanceType: "STATE",
    claimKey: "unit202.review-fact.diode-definition",
    parentAcId: "AC6.2",
    necessityRationale: "AC6.2 requires stating basic operating principles of electronic components including diodes -- minimally requires knowing a diode conducts current in one direction only.",
    technicalClaimKey: "unit202.review-fact.diode-definition",
  },
  {
    targetSubject: "Zener",
    targetPerformanceType: "STATE",
    claimKey: "unit202.review-fact.zener-definition",
    parentAcId: "AC6.2",
    necessityRationale: "AC6.2 requires stating basic operating principles of electronic components including Zener -- minimally requires knowing a Zener diode is operated in reverse breakdown as a voltage reference.",
    technicalClaimKey: "unit202.review-fact.zener-definition",
  },
  {
    targetSubject: "LED",
    targetPerformanceType: "STATE",
    claimKey: "unit202.review-fact.led-definition",
    parentAcId: "AC6.2",
    necessityRationale: "AC6.2 requires stating basic operating principles of electronic components including LED -- minimally requires knowing an LED is a forward-biased p-n junction that emits light.",
    technicalClaimKey: "unit202.review-fact.led-definition",
  },
  {
    targetSubject: "thermistors",
    targetPerformanceType: "STATE",
    claimKey: "unit202.review-fact.thermistor-definition",
    parentAcId: "AC6.2",
    necessityRationale: "AC6.2 requires stating basic operating principles of electronic components including thermistors -- minimally requires knowing a thermistor's resistance is sensitive to temperature.",
    technicalClaimKey: "unit202.review-fact.thermistor-definition",
  },
  {
    targetSubject: "transistors",
    targetPerformanceType: "STATE",
    claimKey: "unit202.review-fact.transistor-definition",
    parentAcId: "AC6.2",
    necessityRationale: "AC6.2 requires stating basic operating principles of electronic components including transistors -- minimally requires knowing a transistor amplifies or switches electrical signals.",
    technicalClaimKey: "unit202.review-fact.transistor-definition",
  },

  // ================================================================
  // CC-19R1 additions (task section 7/9): completing the decomposition
  // attempt for every remaining leaf/performance candidate that CC-19R's
  // "curated, non-exhaustive" subset left unattempted. Same blind
  // methodology as CC-19R sections 20-23 -- no expected-answer
  // information was consulted. The existing 31 CC-19R proposals above are
  // UNCHANGED (only mechanical schema fixes were applied to them
  // elsewhere in this file, e.g. the AC4.3 target-subject correction
  // already made in the prior CC-19R session).
  // ================================================================

  // ---- AC3.2: force (via AC3.3, see below), gears, pulleys, lever classes ----
  {
    targetSubject: "gears",
    targetPerformanceType: "EXPLAIN",
    claimKey: "unit202.review-fact.gear-mechanism",
    parentAcId: "AC3.2",
    necessityRationale: "AC3.2 requires explaining the principles of basic mechanics as applied to gears -- minimally requires knowing meshed gear teeth share a common speed at the contact point and that gear ratio = radius(output)/radius(input) = teeth(output)/teeth(input).",
    technicalClaimKey: "unit202.review-fact.gear-mechanism",
  },
  {
    targetSubject: "gears",
    targetPerformanceType: "EXPLAIN",
    claimKey: "unit202.review-fact.mechanical-advantage",
    parentAcId: "AC3.2",
    necessityRationale: "AC3.2 requires explaining the principles of basic mechanics as applied to gears -- as a simple machine, minimally requires the general mechanical-advantage concept (ratio of output to input force).",
    technicalClaimKey: "unit202.review-fact.mechanical-advantage",
  },
  {
    targetSubject: "pulleys",
    targetPerformanceType: "EXPLAIN",
    claimKey: "unit202.review-fact.pulley-mechanism",
    parentAcId: "AC3.2",
    necessityRationale: "AC3.2 requires explaining the principles of basic mechanics as applied to pulleys -- minimally requires knowing a single pulley redirects force without multiplying it, while multi-cable systems' mechanical advantage approximates the number of supporting cables.",
    technicalClaimKey: "unit202.review-fact.pulley-mechanism",
  },
  {
    targetSubject: "pulleys",
    targetPerformanceType: "EXPLAIN",
    claimKey: "unit202.review-fact.mechanical-advantage",
    parentAcId: "AC3.2",
    necessityRationale: "AC3.2 requires explaining the principles of basic mechanics as applied to pulleys -- as a simple machine, minimally requires the general mechanical-advantage concept.",
    technicalClaimKey: "unit202.review-fact.mechanical-advantage",
  },
  {
    targetSubject: "lever class I",
    targetPerformanceType: "EXPLAIN",
    claimKey: "unit202.review-fact.lever-class-1",
    parentAcId: "AC3.2",
    necessityRationale: "Range member 'class I' under AC3.2 -- performing the inherited EXPLAIN requirement minimally requires knowing the fulcrum's position relative to load and effort for a class I lever.",
    technicalClaimKey: "unit202.review-fact.lever-class-1",
  },
  {
    targetSubject: "lever class II",
    targetPerformanceType: "EXPLAIN",
    claimKey: "unit202.review-fact.lever-class-2",
    parentAcId: "AC3.2",
    necessityRationale: "Range member 'class II' under AC3.2 -- minimally requires knowing the load's position relative to fulcrum and effort for a class II lever.",
    technicalClaimKey: "unit202.review-fact.lever-class-2",
  },
  {
    targetSubject: "lever class III",
    targetPerformanceType: "EXPLAIN",
    claimKey: "unit202.review-fact.lever-class-3",
    parentAcId: "AC3.2",
    necessityRationale: "Range member 'class III' under AC3.2 -- minimally requires knowing the effort's position relative to fulcrum and load for a class III lever.",
    technicalClaimKey: "unit202.review-fact.lever-class-3",
  },

  // ---- AC3.3: force (previously unfacted lettered child) ----
  {
    targetSubject: "force",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.force-definition",
    parentAcId: "AC3.3",
    necessityRationale: "AC3.3.a requires describing the principle of 'force' -- minimally requires the Newton's-second-law relationship between force, mass and acceleration already established for the AC3.1 weight fact (W=mg is a special case of F=ma).",
    technicalClaimKey: "unit202.review-fact.force-definition",
  },
  {
    targetSubject: "inter-relationships between force, work, energy, power and efficiency",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.power-mechanical-formula",
    parentAcId: "AC3.3",
    necessityRationale: "AC3.3 explicitly requires describing 'their inter-relationships' -- minimally requires the relationship already sourced connecting work and power (P=W/t), which is the most direct explicit inter-relationship among the five named quantities.",
    technicalClaimKey: "unit202.review-fact.power-mechanical-formula",
  },

  // ---- AC4.5 children: current/voltage/resistance calculation (no independent facts previously) ----
  {
    targetSubject: "current (calculation, D.C. circuits)",
    targetPerformanceType: "CALCULATE",
    claimKey: "unit202.review-fact.ohms-law",
    parentAcId: "AC4.5",
    necessityRationale: "AC4.5 explicitly names 'current' as a required calculation -- performing it minimally requires Ohm's law, R=V/I (rearranged for I).",
    technicalClaimKey: "unit202.review-fact.ohms-law",
  },
  {
    targetSubject: "voltage (calculation, D.C. circuits)",
    targetPerformanceType: "CALCULATE",
    claimKey: "unit202.review-fact.ohms-law",
    parentAcId: "AC4.5",
    necessityRationale: "AC4.5 explicitly names 'voltage' as a required calculation -- performing it minimally requires Ohm's law, R=V/I (rearranged for V).",
    technicalClaimKey: "unit202.review-fact.ohms-law",
  },
  {
    targetSubject: "resistance (calculation, D.C. circuits)",
    targetPerformanceType: "CALCULATE",
    claimKey: "unit202.review-fact.ohms-law",
    parentAcId: "AC4.5",
    necessityRationale: "AC4.5 explicitly names 'resistance' as a required calculation -- performing it minimally requires Ohm's law, R=V/I.",
    technicalClaimKey: "unit202.review-fact.ohms-law",
  },

  // ---- AC4.6: power values (no fact previously) ----
  {
    targetSubject: "values of power in parallel and series D.C. circuits",
    targetPerformanceType: "CALCULATE",
    claimKey: "unit202.review-fact.thermal-effect",
    parentAcId: "AC4.6",
    necessityRationale: "AC4.6 requires calculating values of power -- minimally requires the power formula already sourced for AC4.8, P=I^2R=V^2/R.",
    technicalClaimKey: "unit202.review-fact.thermal-effect",
  },

  // ---- AC4.7: voltage drop (no fact previously) ----
  {
    targetSubject: "voltage drop",
    targetPerformanceType: "STATE",
    claimKey: "unit202.review-fact.ohms-law",
    parentAcId: "AC4.7",
    necessityRationale: "AC4.7 requires stating what is meant by voltage drop -- minimally requires Ohm's law (V=IR), which is the relationship a voltage drop across a resistive element is computed from.",
    technicalClaimKey: "unit202.review-fact.ohms-law",
  },

  // ---- AC6.2: resistors (reuses Ohm's law, no independent fact previously), remaining components ----
  {
    targetSubject: "resistors",
    targetPerformanceType: "STATE",
    claimKey: "unit202.review-fact.ohms-law",
    parentAcId: "AC6.2",
    necessityRationale: "AC6.2 requires stating basic operating principles of electronic components including resistors -- minimally requires knowing a resistor's function is governed by Ohm's law, R=V/I (already sourced for AC4.3/4.4/4.5).",
    technicalClaimKey: "unit202.review-fact.ohms-law",
  },
  {
    targetSubject: "capacitors",
    targetPerformanceType: "STATE",
    claimKey: "unit202.review-fact.capacitor-definition",
    parentAcId: "AC6.2",
    necessityRationale: "AC6.2 requires stating basic operating principles of electronic components including capacitors -- minimally requires knowing a capacitor stores electrical charge/energy.",
    technicalClaimKey: "unit202.review-fact.capacitor-definition",
  },
  {
    targetSubject: "rectifiers",
    targetPerformanceType: "STATE",
    claimKey: "unit202.review-fact.rectifier-definition",
    parentAcId: "AC6.2",
    necessityRationale: "AC6.2 requires stating basic operating principles of electronic components including rectifiers -- minimally requires knowing a rectifier converts AC to DC.",
    technicalClaimKey: "unit202.review-fact.rectifier-definition",
  },
  {
    targetSubject: "diacs",
    targetPerformanceType: "STATE",
    claimKey: "unit202.review-fact.diac-definition",
    parentAcId: "AC6.2",
    necessityRationale: "AC6.2 requires stating basic operating principles of electronic components including diacs -- minimally requires knowing a diac is a bidirectional trigger device.",
    technicalClaimKey: "unit202.review-fact.diac-definition",
  },
  {
    targetSubject: "triacs",
    targetPerformanceType: "STATE",
    claimKey: "unit202.review-fact.triac-definition",
    parentAcId: "AC6.2",
    necessityRationale: "AC6.2 requires stating basic operating principles of electronic components including triacs -- minimally requires knowing a triac is a bidirectional thyristor equivalent to two back-to-back SCRs.",
    technicalClaimKey: "unit202.review-fact.triac-definition",
  },
  {
    targetSubject: "thyristors",
    targetPerformanceType: "STATE",
    claimKey: "unit202.review-fact.thyristor-definition",
    parentAcId: "AC6.2",
    necessityRationale: "AC6.2 requires stating basic operating principles of electronic components including thyristors -- minimally requires knowing a thyristor is a latching switch that remains conducting once triggered until current falls to zero.",
    technicalClaimKey: "unit202.review-fact.thyristor-definition",
  },
  {
    targetSubject: "invertors",
    targetPerformanceType: "STATE",
    claimKey: "unit202.review-fact.invertor-definition",
    parentAcId: "AC6.2",
    necessityRationale: "AC6.2 requires stating basic operating principles of electronic components including invertors -- minimally requires knowing an invertor converts DC to AC. No source meeting the CC-19R section 23 quality hierarchy (standards body / government publication / open academic textbook) was found this session (only Wikipedia/commercial results); the proposal stands with a TECHNICAL_TRUTH_GAP rather than being sourced from a lower-tier site.",
    // deliberately no technicalClaimKey -- TECHNICAL_TRUTH_GAP
  },

  // ---- AC2.3: remaining instrument members ----
  {
    targetSubject: "instrument for measuring resistance",
    targetPerformanceType: "IDENTIFY",
    claimKey: "unit202.review-fact.ohmmeter-definition",
    parentAcId: "AC2.3",
    necessityRationale: "AC2.3 requires identifying the appropriate instrument for measuring resistance -- minimally requires knowing an ohmmeter is used, derived from R=V/I.",
    technicalClaimKey: "unit202.review-fact.ohmmeter-definition",
  },
  {
    targetSubject: "instrument for measuring current",
    targetPerformanceType: "IDENTIFY",
    claimKey: "unit202.review-fact.ammeter-definition",
    parentAcId: "AC2.3",
    necessityRationale: "AC2.3 requires identifying the appropriate instrument for measuring current -- minimally requires knowing an ammeter is used, connected in series.",
    technicalClaimKey: "unit202.review-fact.ammeter-definition",
  },
  {
    targetSubject: "instrument for measuring voltage",
    targetPerformanceType: "IDENTIFY",
    claimKey: "unit202.review-fact.voltmeter-definition",
    parentAcId: "AC2.3",
    necessityRationale: "AC2.3 requires identifying the appropriate instrument for measuring voltage -- minimally requires knowing a voltmeter is used, connected in parallel.",
    technicalClaimKey: "unit202.review-fact.voltmeter-definition",
  },
  {
    targetSubject: "instrument for measuring power",
    targetPerformanceType: "IDENTIFY",
    claimKey: "unit202.review-fact.wattmeter",
    parentAcId: "AC2.3",
    necessityRationale: "AC2.3 requires identifying the appropriate instrument for measuring power -- minimally requires knowing a wattmeter is used. No source meeting the CC-19R section 23 quality hierarchy was found this session for a formal wattmeter definition; the proposal stands with a TECHNICAL_TRUTH_GAP.",
    // deliberately no technicalClaimKey -- TECHNICAL_TRUTH_GAP
  },
  {
    targetSubject: "instrument for measuring energy",
    targetPerformanceType: "IDENTIFY",
    claimKey: "unit202.review-fact.energy-meter",
    parentAcId: "AC2.3",
    necessityRationale: "AC2.3 requires identifying the appropriate instrument for measuring energy -- minimally requires knowing an energy meter (kWh meter) is used. No source meeting the CC-19R section 23 quality hierarchy was found this session; the proposal stands with a TECHNICAL_TRUTH_GAP.",
    // deliberately no technicalClaimKey -- TECHNICAL_TRUTH_GAP
  },

  // ---- AC5.3: production of a magnetic field ----
  {
    targetSubject: "production of a magnetic field",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.magnetic-field-production",
    parentAcId: "AC5.3",
    necessityRationale: "AC5.3.a requires describing the production of a magnetic field as a magnetic effect of electrical currents -- minimally requires knowing a current-carrying conductor produces a magnetic field, direction given by the right-hand rule.",
    technicalClaimKey: "unit202.review-fact.magnetic-field-production",
  },

  // ---- AC5.4: single-loop generator, sine-wave, frequency, magnetic flux (previously unfacted) ----
  {
    targetSubject: "single-loop generator",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.faradays-law",
    parentAcId: "AC5.4",
    necessityRationale: "AC5.4.a requires describing the single-loop generator as a principle of generating an A.C. supply -- minimally requires Faraday's law (EMF induced by a changing magnetic flux as the loop rotates), already sourced for AC5.3.d.",
    technicalClaimKey: "unit202.review-fact.faradays-law",
  },
  {
    targetSubject: "sine-wave (AC generation principle)",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.ac-sine-equation",
    parentAcId: "AC5.4",
    necessityRationale: "AC5.4.b requires describing sine-wave as a principle of generating an A.C. supply -- minimally requires the sinusoidal voltage equation V=V0sin(2*pi*f*t) produced by a rotating loop.",
    technicalClaimKey: "unit202.review-fact.ac-sine-equation",
  },
  {
    targetSubject: "frequency (AC generation principle)",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.ac-sine-equation",
    parentAcId: "AC5.4",
    necessityRationale: "AC5.4.c requires describing frequency as a principle of generating an A.C. supply -- minimally requires its role in the sinusoidal voltage equation already sourced (V=V0sin(2*pi*f*t), f in hertz).",
    technicalClaimKey: "unit202.review-fact.ac-sine-equation",
  },
  {
    targetSubject: "magnetic flux (AC generation principle)",
    targetPerformanceType: "DESCRIBE",
    claimKey: "unit202.review-fact.faradays-law",
    parentAcId: "AC5.4",
    necessityRationale: "AC5.4.e requires describing magnetic flux as a principle of generating an A.C. supply -- minimally requires Faraday's law, which relates induced EMF directly to the rate of change of magnetic flux through the rotating loop.",
    technicalClaimKey: "unit202.review-fact.faradays-law",
  },

  // ---- AC5.5: sine-wave characteristics (all 6 Range members) ----
  {
    targetSubject: "RMS value (sine-wave characteristic)",
    targetPerformanceType: "IDENTIFY",
    claimKey: "unit202.review-fact.rms-value",
    parentAcId: "AC5.5",
    necessityRationale: "AC5.5 Range member 'Root Mean Square (RMS) value' -- minimally requires knowing RMS is the value that produces an equivalent DC heating effect, related to the peak value. A WebFetch attempt against OpenStax College Physics 2e §20.5 returned an equation with ambiguous rendering of the divisor (possibly '/2' or '/sqrt(2)', a known math-notation extraction limitation of the fetch tool) -- rather than assert an uncertain verbatim excerpt, this proposal stands with a TECHNICAL_TRUTH_GAP.",
  },
  {
    targetSubject: "average value (sine-wave characteristic)",
    targetPerformanceType: "IDENTIFY",
    claimKey: "unit202.review-fact.average-value",
    parentAcId: "AC5.5",
    necessityRationale: "AC5.5 Range member 'Average value' -- minimally requires knowing the mean value of a sine wave over a half-cycle, related to the peak value. No reliably verbatim technical source was obtained this session (same math-notation extraction limitation as the RMS value); TECHNICAL_TRUTH_GAP.",
  },
  {
    targetSubject: "peak to peak value (sine-wave characteristic)",
    targetPerformanceType: "IDENTIFY",
    claimKey: "unit202.review-fact.peak-to-peak-value",
    parentAcId: "AC5.5",
    necessityRationale: "AC5.5 Range member 'Peak to peak value' -- minimally requires knowing peak-to-peak is the total excursion between the positive and negative peaks of the waveform. TECHNICAL_TRUTH_GAP -- not independently verified against a verbatim technical source this session.",
  },
  {
    targetSubject: "periodic time (sine-wave characteristic)",
    targetPerformanceType: "IDENTIFY",
    claimKey: "unit202.review-fact.periodic-time",
    parentAcId: "AC5.5",
    necessityRationale: "AC5.5 Range member 'Periodic time' -- minimally requires knowing the periodic time T is the time for one complete cycle, T=1/f. TECHNICAL_TRUTH_GAP -- not independently verified against a verbatim technical source this session.",
  },
  {
    targetSubject: "frequency (sine-wave characteristic)",
    targetPerformanceType: "IDENTIFY",
    claimKey: "unit202.review-fact.ac-sine-equation",
    parentAcId: "AC5.5",
    necessityRationale: "AC5.5 Range member 'Frequency' -- minimally requires knowing frequency f (hertz) is the number of complete cycles per second, per the sinusoidal voltage equation already sourced for AC5.4.",
    technicalClaimKey: "unit202.review-fact.ac-sine-equation",
  },
  {
    targetSubject: "amplitude (sine-wave characteristic)",
    targetPerformanceType: "IDENTIFY",
    claimKey: "unit202.review-fact.amplitude-value",
    parentAcId: "AC5.5",
    necessityRationale: "AC5.5 Range member 'Amplitude' -- minimally requires knowing amplitude is the maximum displacement of the waveform from its zero/mean value (the peak value). TECHNICAL_TRUTH_GAP -- not independently verified against a verbatim technical source this session.",
  },
];

/**
 * Candidate keys explicitly assessed as EXPLICITLY_ATOMIC by their own
 * named content (CC-19R1 section 9.A) -- the source names a complete,
 * self-contained required scope with no further internal decomposition
 * available from the source without inventing beyond-source detail
 * (forbidden by section 9: "Do not add interesting context / optional
 * examples / advanced knowledge"). Distinct from candidates covered by
 * genuine explicit facts or by explicit child/Range-member coverage.
 */
export const ATOMIC_BY_DESIGN_SUBJECTS: readonly { readonly subject: string; readonly performanceType: LearnerPerformanceType; readonly rationale: string }[] = [
  ...(
    [
      "electronic components function/application: security alarms",
      "electronic components function/application: telephones",
      "electronic components function/application: dimmer switches",
      "electronic components function/application: heating/boiler controls",
      "electronic components function/application: motor control",
      "electronic components function/application: wireless control systems",
    ] as const
  ).map((subject) => ({
    subject,
    performanceType: "DESCRIBE" as const,
    rationale:
      "AC6.1 Range member naming a specific application context. The named system IS the complete required scope for this Range member; decomposing further into which specific AC6.2 component serves which specific role within it would require inventing an application-mapping the source does not state (forbidden: 'interesting context' / 'advanced knowledge' per section 9).",
  })),
];

/**
 * Candidates genuinely UNRESOLVED after considered attempt (CC-19R1
 * section 10) -- every reason names a SPECIFIC evidence-bound limitation,
 * never an execution/time-based excuse.
 */
export const GENUINELY_UNRESOLVED_SUBJECTS: readonly { readonly subject: string; readonly performanceType: LearnerPerformanceType; readonly parentAcId: string; readonly unresolvedReason: string }[] = [
  ...(
    [
      { subject: "fractions and percentages", label: "Fractions and percentages" },
      { subject: "algebra", label: "Algebra" },
      { subject: "indices", label: "Indices" },
      { subject: "transposition", label: "Transposition" },
      { subject: "triangles and trigonometry", label: "Triangles and trigonometry" },
      { subject: "statistics", label: "Statistics" },
    ] as const
  ).flatMap(({ subject, label }) =>
    (["IDENTIFY", "APPLY"] as const).map((performanceType) => ({
      subject,
      performanceType,
      parentAcId: "AC1.1",
      unresolvedReason: `AC1.1 Range names '${label}' as a required mathematical principle without specifying which internal operations/techniques within '${label}' are in scope at this qualification level (e.g. which specific procedures, to what depth). No accessible public assessment evidence resolves which specific technique is tested (the only public sample-assessment questions document is password-protected -- see CC-19R source inventory). The term is too broad in the qualification source to safely propose a single minimal checkable proposition without inventing scope boundaries the source does not state.`,
    })),
  ),
  {
    subject: "electromagnetism",
    performanceType: "DESCRIBE",
    parentAcId: "AC5.3",
    unresolvedReason:
      "AC5.3.c names 'electromagnetism' as a lettered item alongside three more specific sibling items in the same list (a. production of a magnetic field, b. force on a current-carrying conductor, d. electromotive force). The source does not specify what content 'electromagnetism' requires beyond what those three already cover, and several technically valid distinct readings exist (the general electricity-magnetism interaction; electromagnets/solenoids specifically; Ampere's law generally) with no curriculum or accessible assessment evidence selecting one. Proposing a specific minimal fact would risk inventing scope the source does not itself distinguish from its siblings.",
  },
  {
    subject: "photo",
    performanceType: "STATE",
    parentAcId: "AC6.2",
    unresolvedReason:
      "AC6.2 Range member 'photo' (page 29) is printed as a bare, unexpanded term in a genuinely flat bulleted list (CC-19R section 15 -- confirmed by direct visual inspection of the handbook page image, no nesting under 'Diodes' or 'LED'). The source does not state whether this refers to a photodiode, phototransistor, or another photo-sensitive device, and proposing a minimal operating-principle fact requires knowing which device is meant; no accessible public assessment evidence disambiguates the term. Expanding it would require inventing a specific device identity the source does not itself state (the same structural ambiguity already logged for 'Zener' at the membership level; here it blocks fact-level decomposition too).",
  },
];
