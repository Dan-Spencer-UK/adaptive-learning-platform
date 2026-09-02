/**
 * CC-19R clean-room REVIEW_PROPOSED knowledge-decomposition proposals
 * (task sections 20-24).
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
 * This is a curated, non-exhaustive subset (CC-19R section 20 tests
 * whether the transferable process CAN surface minimal knowledge -- it is
 * not obligated to succeed for every one of the ~136 curriculum
 * candidates in one session). Everything not covered here is reported in
 * the decomposition-coverage output as UNRESOLVED_DECOMPOSITION, per
 * CC-19R section 24 ("A scope candidate with zero facts must not silently
 * appear complete").
 */

export interface ReviewFactProposal {
  readonly targetSubject: string;
  readonly targetPerformanceType: string;
  readonly claimKey: string;
  readonly parentAcId: string;
  readonly necessityRationale: string;
  /** TECHNICAL_CLAIMS claimKey researched to support this proposition, if any was found (CC-19R section 22). */
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
];

/**
 * Candidates deliberately NOT decomposed this session (CC-19R section 24
 * transparency requirement) -- listed with a short note on why, so the
 * coverage report never silently implies completeness. This is not
 * exhaustive of every un-decomposed candidate (most Range-member leaf
 * candidates fall here too); it specifically flags the ones where a
 * technical source was actively sought and not successfully retrieved.
 */
export const KNOWN_UNRESOLVED_DECOMPOSITIONS: readonly { readonly subject: string; readonly reason: string }[] = [
  {
    subject: "thyristors",
    reason: "AC6.2: an authoritative open/academic source explicitly defining thyristor latching behaviour was sought but not successfully retrieved this session (allaboutcircuits.com returned HTTP 403; no LibreTexts/OpenStax equivalent found). Left UNRESOLVED rather than sourced from a lower-tier site.",
  },
  {
    subject: "single-loop generator",
    reason: "AC5.4.a: not researched this session -- decomposition would need the generator EMF equation (e = NBA*omega*sin(omega t)) from an authoritative source.",
  },
  {
    subject: "electromagnetism",
    reason: "AC5.3.c: not researched this session -- decomposition would need a clearer minimal-fact boundary between 'production of a magnetic field' (AC5.3.a) and the general term 'electromagnetism'.",
  },
];
