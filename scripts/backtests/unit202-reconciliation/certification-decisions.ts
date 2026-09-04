/**
 * CC-22A: conservative KnowledgeBoundaryCertification decisions.
 *
 * COMPLETE is used ONLY where every atomic PA-required proposition
 * mapped to that exact candidate is adequately represented in the
 * corrected (claim-decisions.ts) governing set. Task section 21 names
 * six known-false CC-22 COMPLETE statuses that must be corrected; none
 * of them appear as COMPLETE below (see each entry's own rationale for
 * why it is now PARTIAL or absent entirely).
 *
 * A candidate not listed here receives NO certification from this
 * package -- it is left at whatever the generic pipeline's own
 * conservative default produces (ADJUDICATION_REQUIRED/UNRESOLVED).
 */
export interface CertificationDecision {
  readonly targetCandidateKey: string;
  readonly decision: "COMPLETE" | "PARTIAL" | "UNRESOLVED";
  readonly rationale: string;
}

export const CERTIFICATION_DECISIONS: readonly CertificationDecision[] = [
  // --- AC2.1 (task section 6: now REQUIRED_QUALIFICATION_KNOWLEDGE, explicit breadth) ---
  // PA's AC2.1 requirement ("identify and correctly use the relevant SI unit/unit symbol at
  // Level-2 depth") is narrower than AC2.2's ("meaning, symbol, unit, distinction") -- the
  // existing EXPLICIT_CURRICULUM_FACT unit-name/unit-symbol claims are adequate for AC2.1's own,
  // simpler requirement (unlike AC2.2, see below). IDENTIFY performance type only -- APPLY
  // ("correct use... in calculations/contexts required elsewhere") is not independently
  // evidenced by the unit-name claim alone and is left uncertified.
  { targetCandidateKey: "length (SI unit)::IDENTIFY", decision: "COMPLETE", rationale: "Unit name/symbol claim adequate for AC2.1's own (narrower than AC2.2) requirement (task section 6)." },
  { targetCandidateKey: "area (SI unit)::IDENTIFY", decision: "COMPLETE", rationale: "Unit name/symbol claim adequate for AC2.1's own requirement (task section 6)." },
  { targetCandidateKey: "volume (SI unit)::IDENTIFY", decision: "COMPLETE", rationale: "Unit name/symbol claim adequate for AC2.1's own requirement (task section 6)." },
  { targetCandidateKey: "mass (SI unit)::IDENTIFY", decision: "COMPLETE", rationale: "Unit name/symbol claim adequate for AC2.1's own requirement (task section 6)." },
  { targetCandidateKey: "density (SI unit)::IDENTIFY", decision: "COMPLETE", rationale: "Unit name/symbol claim adequate for AC2.1's own requirement (task section 6)." },
  { targetCandidateKey: "time (SI unit)::IDENTIFY", decision: "COMPLETE", rationale: "Unit name/symbol claim adequate for AC2.1's own requirement (task section 6)." },
  { targetCandidateKey: "velocity (SI unit)::IDENTIFY", decision: "COMPLETE", rationale: "Unit name/symbol claim adequate for AC2.1's own requirement (task section 6)." },
  {
    targetCandidateKey: "temperature (SI unit)::IDENTIFY",
    decision: "COMPLETE",
    rationale: "Unit name/symbol claim (kelvin, symbol K) adequate for AC2.1's own requirement, and matches task section 6's explicit technical rule (kelvin is the SI base unit; Celsius is a legitimate practical scale but never the base-unit fact) exactly.",
  },

  // --- AC2.2 (task section 7: REMOVE the false COMPLETE status) ---
  // NONE of the 11 electrical quantities are certified COMPLETE. Each EXPLICIT_CURRICULUM_FACT
  // claim gives unit name/symbol only -- meaning, quantity symbol, and relevant distinction are
  // NOT represented. A real, VERIFIED source for meaning/symbol/distinction exists (technical-
  // source-verification.ts, "electrical-quantities-and-si-units" cluster) but has not been
  // normalized into a SourceFactualClaim -- PARTIAL, with nextAction=NORMALIZE, not "gather new".
  { targetCandidateKey: "current (SI unit)::IDENTIFY", decision: "PARTIAL", rationale: "Task section 7: unit-name-only evidence cannot certify meaning/symbol/distinction." },
  { targetCandidateKey: "voltage (SI unit)::IDENTIFY", decision: "PARTIAL", rationale: "Task section 7: unit-name-only evidence cannot certify meaning/symbol/distinction." },
  { targetCandidateKey: "resistance (SI unit)::IDENTIFY", decision: "PARTIAL", rationale: "Task section 7: unit-name-only evidence cannot certify meaning/symbol/distinction (resistance vs resistivity vs impedance)." },
  { targetCandidateKey: "resistivity (SI unit)::IDENTIFY", decision: "PARTIAL", rationale: "Task section 7: unit-name-only evidence cannot certify meaning/symbol/distinction (resistance vs resistivity)." },
  { targetCandidateKey: "power (SI unit)::IDENTIFY", decision: "PARTIAL", rationale: "Task section 7: unit-name-only evidence cannot certify meaning/symbol/distinction (power vs energy vs power factor)." },
  { targetCandidateKey: "energy (SI unit)::IDENTIFY", decision: "PARTIAL", rationale: "Task section 7: unit-name-only evidence cannot certify meaning/symbol/distinction (energy vs power)." },
  { targetCandidateKey: "frequency (SI electrical quantity)::IDENTIFY", decision: "PARTIAL", rationale: "Task section 7: unit-name-only evidence cannot certify meaning/symbol/distinction." },
  { targetCandidateKey: "impedance (SI unit)::IDENTIFY", decision: "PARTIAL", rationale: "Task section 7: unit-name-only evidence cannot certify meaning/symbol/distinction (resistance/reactance/impedance as distinct concepts)." },
  { targetCandidateKey: "capacitance and capacitive reactance (SI unit)::IDENTIFY", decision: "PARTIAL", rationale: "Task section 7: unit-name-only evidence cannot certify meaning/symbol/distinction (capacitance vs capacitive reactance)." },
  { targetCandidateKey: "inductance and inductive reactance (SI unit)::IDENTIFY", decision: "PARTIAL", rationale: "Task section 7: unit-name-only evidence cannot certify meaning/symbol/distinction (inductance vs inductive reactance)." },
  { targetCandidateKey: "power factor (SI unit / dimensional status)::IDENTIFY", decision: "PARTIAL", rationale: "Task section 7: unit-name-only evidence cannot certify meaning/symbol/distinction (power vs power factor)." },

  // --- AC2.3 instruments (task section 8) ---
  { targetCandidateKey: "instrument for measuring current::IDENTIFY", decision: "COMPLETE", rationale: "Ammeter identity + series connection is real, adequate, REQUIRED_OPERATIONAL knowledge (task section 8)." },
  { targetCandidateKey: "instrument for measuring voltage::IDENTIFY", decision: "COMPLETE", rationale: "Voltmeter identity + parallel connection is real, adequate, REQUIRED_OPERATIONAL knowledge (task section 8)." },
  {
    targetCandidateKey: "instrument for measuring resistance::IDENTIFY",
    decision: "PARTIAL",
    rationale: "Task section 8: the R=V/I-derivation claim establishes resistance measurement but not the full safe-use/de-energised-circuit connection procedure (which IS VERIFIED in the existing source dossier -- 'An ohmmeter requires the circuit under test to be de-energised' -- but not yet normalized into a claim here).",
  },
  { targetCandidateKey: "instrument for measuring power::IDENTIFY", decision: "PARTIAL", rationale: "Task section 8/22: wattmeter identity adjudicated REQUIRED_CORE, but no technical claim exists at all (confirmed both in the frozen QP input and as SOURCE_GAP in the existing verified-source dossier) -- genuinely missing technical evidence, not merely unnormalized." },
  { targetCandidateKey: "instrument for measuring energy::IDENTIFY", decision: "PARTIAL", rationale: "Task section 8/22: energy-meter identity adjudicated REQUIRED_CORE; a VERIFIED source exists ('An energy meter integrates power over time (kWh)') but has not been normalized into a claim in the frozen QP input." },

  // --- AC3.1 (unchanged from CC-22 -- not named among the corrected defects) ---
  { targetCandidateKey: "mass and weight::DEFINE", decision: "COMPLETE", rationale: "mass-definition + weight-definition (incl. W=mg) both real, curriculum-supported, REQUIRED_CORE." },

  // --- AC3.2 simple machines ---
  { targetCandidateKey: "lever class I::EXPLAIN", decision: "COMPLETE", rationale: "Fulcrum-position claim adequately distinguishes this class." },
  { targetCandidateKey: "lever class II::EXPLAIN", decision: "COMPLETE", rationale: "Fulcrum-position claim adequately distinguishes this class." },
  { targetCandidateKey: "lever class III::EXPLAIN", decision: "COMPLETE", rationale: "Fulcrum-position claim adequately distinguishes this class." },
  {
    targetCandidateKey: "gears::EXPLAIN",
    decision: "PARTIAL",
    rationale: "gear-mechanism (ratio) and mechanical-advantage claims real and adequate for those two facts, but 'ideal power conservation'/'losses reduce output' content (task section 9) is not yet a claim here -- a VERIFIED source exists ('An ideal machine trades force for distance; it does not create power') but is not normalized. The 'gears create power' misconception itself is NOT recorded as a separate required proposition needing its own source (task section 9's explicit correction).",
  },
  {
    targetCandidateKey: "pulleys::EXPLAIN",
    decision: "PARTIAL",
    rationale: "mechanical-advantage and pulley-mechanism claims real and adequate, but power-conservation/losses content is not yet normalized (same VERIFIED source as gears).",
  },

  // --- AC3.3/3.4 (task section 9 -- corrected) ---
  { targetCandidateKey: "work::DESCRIBE", decision: "COMPLETE", rationale: "W = Fd claim real and adequate." },
  { targetCandidateKey: "power (mechanical)::DESCRIBE", decision: "COMPLETE", rationale: "P = W/t claim real and adequate for this candidate's own narrow scope." },
  {
    targetCandidateKey: "inter-relationships between force, work, energy, power and efficiency::DESCRIBE",
    decision: "PARTIAL",
    rationale: "Task section 9: NOT complete merely because it contains P=W/t. The final model must connect force/weight, W=Fd, gravitational work/PE=mgh, P=W/t, efficiency, and multi-step use -- only P=W/t is currently adjudicated here (CC-22 wrongly certified this COMPLETE; corrected).",
  },
  { targetCandidateKey: "power (calculation, mechanical)::CALCULATE", decision: "COMPLETE", rationale: "P = W/t claim real and adequate for calculation practice." },
  { targetCandidateKey: "efficiency::DESCRIBE", decision: "COMPLETE", rationale: "Efficiency-formula claim real and adequate." },
  { targetCandidateKey: "efficiency (calculation)::CALCULATE", decision: "COMPLETE", rationale: "Efficiency-formula claim real and adequate for calculation practice." },
  // force::DESCRIBE, energy (kinetic and potential)::DESCRIBE, mechanical energy (calculation)::CALCULATE -- all REJECTED, zero requiredFactKeys, no certification constructed.

  // --- AC4 (task sections 4, 10) ---
  { targetCandidateKey: "basic principles of electron theory::DESCRIBE", decision: "COMPLETE", rationale: "current-charge-flow + conventional-vs-electron-flow both real and adequate." },
  { targetCandidateKey: "conductors (good electrical conductor materials)::IDENTIFY", decision: "COMPLETE", rationale: "conductor-definition claim real and adequate." },
  { targetCandidateKey: "conductors (good electrical conductor materials)::DISTINGUISH", decision: "COMPLETE", rationale: "conductor-definition claim real and adequate." },
  { targetCandidateKey: "insulators (electrical insulator materials)::IDENTIFY", decision: "COMPLETE", rationale: "insulator-definition claim real and adequate." },
  { targetCandidateKey: "insulators (electrical insulator materials)::DISTINGUISH", decision: "COMPLETE", rationale: "insulator-definition claim real and adequate." },
  { targetCandidateKey: "resistance and resistivity in relation to electrical circuits::DESCRIBE", decision: "COMPLETE", rationale: "ohms-law + resistance-resistivity-relation (R=rho L/A) both real and adequate." },
  {
    targetCandidateKey: "relationship between current, voltage and resistance in parallel and series D.C. circuits::EXPLAIN",
    decision: "PARTIAL",
    rationale: "Task section 10 (known-false-COMPLETE example, corrected): ohms-law + series-resistance + parallel-resistance establish resistance-combination rules and V=IR, but not the explicit current-continuity (series) / voltage-commonality (parallel) statements PA separately requires.",
  },
  { targetCandidateKey: "current (calculation, D.C. circuits)::CALCULATE", decision: "COMPLETE", rationale: "ohms-law claim real and adequate for calculation practice." },
  { targetCandidateKey: "voltage (calculation, D.C. circuits)::CALCULATE", decision: "COMPLETE", rationale: "ohms-law claim real and adequate for calculation practice." },
  { targetCandidateKey: "resistance (calculation, D.C. circuits)::CALCULATE", decision: "COMPLETE", rationale: "ohms-law claim real and adequate for calculation practice." },
  { targetCandidateKey: "values of current, voltage and resistance in parallel and series D.C. circuits::CALCULATE", decision: "COMPLETE", rationale: "ohms-law claim real and adequate for calculation practice." },
  {
    targetCandidateKey: "values of power in parallel and series D.C. circuits::CALCULATE",
    decision: "PARTIAL",
    rationale: "Task section 10 (known-false-COMPLETE example, corrected): P=I^2R=V^2/R (thermal-effect claim) alone does not exhaust electrical-power knowledge while the more foundational P=VI form is not itself a claim here.",
  },
  {
    targetCandidateKey: "voltage drop::STATE",
    decision: "PARTIAL",
    rationale: "Task section 10: V=IR is legitimate required voltage-drop content here, but the claim's generic (not voltage-drop-specific) framing means the full boundary (voltage loss concept + appropriate calculation framing) is not yet represented -- a VERIFIED, voltage-drop-specific source exists but is not normalized.",
  },
  { targetCandidateKey: "chemical and thermal effects of electric currents::DESCRIBE", decision: "COMPLETE", rationale: "chemical-effect + thermal-effect both real and adequate." },

  // --- AC5.1/5.2 ---
  {
    targetCandidateKey: "attraction and repulsion effects of magnetism::DESCRIBE",
    decision: "PARTIAL",
    rationale: "magnetic-attraction-repulsion claim real and adequate for that fact, but permanent-magnet field-pattern content is not yet a claim here -- a VERIFIED source exists but is not normalized.",
  },
  { targetCandidateKey: "difference between magnetic flux and flux density::STATE", decision: "COMPLETE", rationale: "flux-vs-flux-density claim (incl. B=Phi/A) real and adequate." },

  // --- AC5.3 (task sections 5B, 5E, 11) ---
  {
    targetCandidateKey: "production of a magnetic field::DESCRIBE",
    decision: "PARTIAL",
    rationale: "magnetic-field-production claim (conductor field + right-hand grip) real and adequate for that fact, but solenoid field/polarity/electromagnet content remains a CONDITIONAL_SOURCE_GAP in the existing verified-source dossier (contingent on what an approved source turns out to support -- requires locator review, not yet a confirmed gap or a normalized claim).",
  },
  // force on a current-carrying conductor in a magnetic field::DESCRIBE, electromotive force::DESCRIBE, EMF (AC generation principle)::DESCRIBE, magnetic flux (AC generation principle)::DESCRIBE, single-loop generator::DESCRIBE -- all REJECTED (vector F=IlxB / differential Faraday law), zero requiredFactKeys, no certification constructed.

  // --- AC5.4 (task sections 5B, 5C, 11) -- deliberately NO COMPLETE/PARTIAL certifications:
  // every existing claim on these candidates was REJECTED. The REAL required content (physical
  // parts, causal operation, f=N*P) is extensively VERIFIED in the existing source dossier but
  // has not been normalized into any CandidateFactRequirement/claim at all -- these candidates
  // correctly remain un-adjudicated/non-governing until that authoring happens.

  // --- AC5.5 -- 'frequency (sine-wave characteristic)' claim remains REJECTED (ac-sine-equation).
  // The other five characteristic candidates (amplitude/RMS/peak-to-peak/average/periodic-time)
  // are now explicitly authorised REQUIRED_CORE (CC-22B task section 5: "ALL PROJECT-ARCHITECT
  // DECISIONS ARE NOW RESOLVED"), so requiredFactKeys is populated for each -- but zero technical
  // claim exists for any of them in the frozen QP input, so technicalCoverageStatus stays
  // incomplete. PARTIAL, never falsely COMPLETE (mirrors task section 2's own instruction: keep
  // the calibrated decision visible, never certify evidence-complete when it is not).
  { targetCandidateKey: "amplitude (sine-wave characteristic)::IDENTIFY", decision: "PARTIAL", rationale: "Adjudicated REQUIRED_CORE (CC-22B); zero technical claim exists yet in the frozen QP input. PARTIAL." },
  { targetCandidateKey: "RMS value (sine-wave characteristic)::IDENTIFY", decision: "PARTIAL", rationale: "Adjudicated REQUIRED_CORE (CC-22B); zero technical claim exists yet in the frozen QP input. PARTIAL." },
  { targetCandidateKey: "peak to peak value (sine-wave characteristic)::IDENTIFY", decision: "PARTIAL", rationale: "Adjudicated REQUIRED_CORE (CC-22B); zero technical claim exists yet in the frozen QP input. PARTIAL." },
  { targetCandidateKey: "average value (sine-wave characteristic)::IDENTIFY", decision: "PARTIAL", rationale: "Adjudicated REQUIRED_CORE (CC-22B); zero technical claim exists yet in the frozen QP input. PARTIAL." },
  { targetCandidateKey: "periodic time (sine-wave characteristic)::IDENTIFY", decision: "PARTIAL", rationale: "Adjudicated REQUIRED_CORE (CC-22B); zero technical claim exists yet in the frozen QP input. PARTIAL." },

  // --- AC6.2 components (task section 4's AC6.2 rule, section 13) ---
  { targetCandidateKey: "capacitors::STATE", decision: "PARTIAL", rationale: "Operating-principle claim real and adequate; schematic-symbol recognition (task section 13) is a CONDITIONAL_SOURCE_GAP in the existing dossier, not yet represented." },
  { targetCandidateKey: "diacs::STATE", decision: "PARTIAL", rationale: "Operating-principle claim real and adequate; schematic-symbol recognition not yet represented." },
  { targetCandidateKey: "diodes::STATE", decision: "PARTIAL", rationale: "Operating-principle claim real and adequate; schematic-symbol recognition not yet represented." },
  { targetCandidateKey: "invertors::STATE", decision: "PARTIAL", rationale: "CC-22B correction: adjudicated REQUIRED_CORE against real curriculum evidence, but NO matching SourceFactualClaim actually exists in the frozen QP input for unit202.review-fact.invertor-definition (mechanically confirmed) -- technicalCoverageStatus stays incomplete; schematic-symbol recognition also not represented." },
  { targetCandidateKey: "LED::STATE", decision: "PARTIAL", rationale: "Operating-principle claim real and adequate; schematic-symbol recognition not yet represented." },
  { targetCandidateKey: "rectifiers::STATE", decision: "PARTIAL", rationale: "General operating-principle claim real; half-wave/full-wave distinction is CONDITIONAL_SOURCE_GAP in the existing dossier; schematic-symbol recognition not yet represented." },
  { targetCandidateKey: "thermistors::STATE", decision: "PARTIAL", rationale: "Operating-principle claim real and adequate; schematic-symbol recognition not yet represented." },
  { targetCandidateKey: "thyristors::STATE", decision: "PARTIAL", rationale: "Operating-principle claim real and adequate; schematic-symbol recognition not yet represented." },
  { targetCandidateKey: "transistors::STATE", decision: "PARTIAL", rationale: "Operating-principle claim real and adequate; schematic-symbol recognition not yet represented." },
  { targetCandidateKey: "triacs::STATE", decision: "PARTIAL", rationale: "Operating-principle claim real and adequate; TRIAC itself is SOURCE_GAP as a bidirectional-gated-switching-device description specifically in the existing dossier despite the QP claim; schematic-symbol recognition not yet represented." },
  { targetCandidateKey: "Zener::STATE", decision: "PARTIAL", rationale: "Operating-principle claim real and adequate; schematic-symbol recognition not yet represented." },
  // resistors::STATE, photo::STATE -- REJECTED / never proposed, no certification constructed.
] as const;
