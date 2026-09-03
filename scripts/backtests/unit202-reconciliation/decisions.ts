/**
 * CC-22: Project-Architect-directed Unit-202 knowledge-boundary decisions.
 *
 * This file is the ONLY place in this package where a human/PA judgement
 * call is recorded. It contains no evidence of its own -- every
 * evidenceId/claimKey/candidateKey referenced elsewhere is resolved
 * mechanically, by ./build-reconciliation.ts, against the REAL frozen
 * Unit-202 input (reports/backtests/unit202-post-hardening/
 * CC-21-FULL-PUBLIC-INPUT.json), never hand-transcribed here. That keeps
 * this file auditable against exactly what the CC-22 task's section 5
 * instructed and nothing else.
 *
 * Three kinds of directive:
 *
 *  - `SUBJECT_NOTES`: one entry per curriculum `subject` string PA's
 *    section 5 addresses (AC1.1-AC6.2, excluding AC2.1 -- PA gave no
 *    locked decision for AC2.1 in this package, so it is deliberately
 *    left out and reported as AWAITING_PROJECT_ARCHITECT_DECISION,
 *    per task section 9's "leave unresolved" instruction). Governs the
 *    reconciliation-ledger classification/gap/certification-eligibility
 *    for every REAL candidate sharing that subject.
 *
 *  - `ADJUDICATION_OVERRIDES`: (targetCandidateKey, claimKey) pairs whose
 *    mechanical decision is NOT the default REQUIRED_CORE -- currently
 *    only the two REJECT_OVERDEPTH cases task section 9 names explicitly
 *    (the bundled KE/PE technical claim). Every OTHER REVIEW_PROPOSED
 *    CandidateFactRequirement in the corpus is adjudicated REQUIRED_CORE
 *    by the build script's default, because every AC PA did address
 *    (1.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 4, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1,
 *    6.2) locks its content as required qualification knowledge -- see
 *    task section 5's own wording for each AC ("Required: ...").
 *
 *  - `MISSING_PROPOSITIONS`: PA-locked propositions with NO real
 *    candidate/claim in the current evidence at all (never a row that
 *    can be reached by iterating `candidates`) -- recorded here so the
 *    reconciliation ledger can never silently drop them (task section 7).
 */

export type PAClassification =
  | "REQUIRED_QUALIFICATION_KNOWLEDGE"
  | "FOUNDATIONAL_PREREQUISITE"
  | "CONTEXTUAL_TEACHING_SUPPORT"
  | "OUT_OF_SCOPE"
  | "AWAITING_PROJECT_ARCHITECT_DECISION";

export type GapType =
  | "A_NO_GAP"
  | "B_MISSING_NORMALIZED_CANDIDATE"
  | "C_MISSING_FACT_REQUIREMENT"
  | "D_SEMANTIC_ADJUDICATION_REQUIRED"
  | "E_MISSING_QUALIFICATION_SCOPE_EVIDENCE"
  | "F_MISSING_PERFORMANCE_DEPTH_EVIDENCE"
  | "G_MISSING_TECHNICAL_TRUTH"
  | "H_TECHNICAL_CONFLICT"
  | "I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT"
  | "J_OUT_OF_SCOPE_OR_OVERDEPTH"
  | "K_CONTEXT_ONLY";

export interface CertificationDirective {
  readonly decision: "COMPLETE" | "PARTIAL" | "UNRESOLVED";
  readonly rationale: string;
}

export interface SubjectNote {
  readonly ac: string;
  readonly paClassification: PAClassification;
  readonly gapType: GapType;
  readonly notes: string;
  /** Present only when this package constructs a KnowledgeBoundaryCertification for the candidate(s) sharing this subject. Absent means the candidate is left at its generic-default status (ADJUDICATION_REQUIRED/UNRESOLVED/STRUCTURALLY_DECOMPOSED as the pipeline itself determines). */
  readonly certification?: CertificationDirective;
}

/**
 * Keyed by the EXACT `CurriculumEvidence.subject` string in the frozen
 * input. The build script asserts every subject appearing under
 * AC1.1-AC6.2 in the real curriculum data has an entry here (except a
 * small, explicit AC2.1 whitelist) and errors loudly otherwise -- so a
 * typo here fails the build rather than silently vanishing a row.
 */
export const SUBJECT_NOTES: Record<string, SubjectNote> = {
  // ===================================================================
  // AC1.1 -- Mathematics. PA locks 14 items across 6 curriculum Range
  // members: fractions+percentages, algebra, indices (positive+negative
  // combined), transposition, triangles-and-trigonometry
  // (Pythagoras+trigonometry combined), statistics (range+mean+median+
  // mode combined). ZERO CandidateFactRequirement exists for ANY of
  // them -- the entire AC1.1 area has real curriculum scope but no
  // factual/procedural content behind it at all.
  // ===================================================================
  "mathematical principles": {
    ac: "AC1.1",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes:
      "Structural RANGE_CATEGORY parent for the six Range members below. Itself carries no content requirement -- STRUCTURALLY_DECOMPOSED is reachable via its real children without a certification. Not itself a PA proposition.",
  },
  "fractions and percentages": {
    ac: "AC1.1",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes:
      "Covers PA items 'fractions' and 'percentages' (bundled in one curriculum Range member). No CandidateFactRequirement and no TECHNICAL_TRUTH claim exists at all. Cannot be adjudicated (nothing has been proposed) and cannot be certified.",
  },
  algebra: {
    ac: "AC1.1",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes: "Covers PA item 'algebra'. No CandidateFactRequirement and no TECHNICAL_TRUTH claim exists at all.",
  },
  indices: {
    ac: "AC1.1",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes:
      "Covers PA items 'positive indices' and 'negative indices' (bundled in one curriculum Range member, not split). No CandidateFactRequirement and no TECHNICAL_TRUTH claim exists at all. PA's guard against introducing separate fractional-indices mastery is trivially satisfied -- no fractional-indices content exists anywhere in the evidence to over-include.",
  },
  transposition: {
    ac: "AC1.1",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes: "Covers PA item 'transposition of formulae'. No CandidateFactRequirement and no TECHNICAL_TRUTH claim exists at all.",
  },
  "triangles and trigonometry": {
    ac: "AC1.1",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes:
      "Covers PA items 'Pythagoras' and 'trigonometry' (bundled in one curriculum Range member, not split -- decomposed coverage per task section 12 would need two separate technical claims, but zero currently exist for either). No CandidateFactRequirement and no TECHNICAL_TRUTH claim exists at all.",
  },
  statistics: {
    ac: "AC1.1",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes:
      "Covers PA items 'statistical range', 'mean', 'median', 'mode' (four items bundled in one curriculum Range member, not split -- decomposed coverage per task section 12 would need four separate technical claims). No CandidateFactRequirement and no TECHNICAL_TRUTH claim exists at all.",
  },

  // ===================================================================
  // AC2.2 -- Electrical quantities. All 11 quantities already have
  // EXPLICIT_CURRICULUM_FACT fact requirements (not REVIEW_PROPOSED --
  // no adjudication needed) with real meaning/symbol/unit TECHNICAL_TRUTH
  // claims. PA's "do not turn into a calculation topic" guard is already
  // structurally satisfied: no CALCULATE-type candidate exists for any
  // of impedance/reactance/power-factor.
  // ===================================================================
  "electrical quantities (SI units)": {
    ac: "AC2.2",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "Structural RANGE_CATEGORY parent for the 11 quantities below. STRUCTURALLY_DECOMPOSED via real children, no certification needed.",
  },
  "current (SI unit)": aC22Quantity(),
  "voltage (SI unit)": aC22Quantity(),
  "resistance (SI unit)": aC22Quantity(),
  "resistivity (SI unit)": aC22Quantity(
    "Unit claim correctly gives 'ohm-metre, symbol Ω·m' -- the known-incorrect Ω/m^3 formulation PA names does not appear anywhere in the evidence. Validated correct, not a gap.",
  ),
  "power (SI unit)": aC22Quantity(),
  "energy (SI unit)": aC22Quantity(),
  "frequency (SI electrical quantity)": aC22Quantity(),
  "impedance (SI unit)": aC22Quantity(
    "Meaning/symbol/unit only (IDENTIFY/OTHER performance types) -- no CALCULATE-type impedance candidate exists anywhere in the evidence, structurally satisfying PA's 'do not turn into a calculation topic' guard without needing an explicit rejection.",
  ),
  "capacitance and capacitive reactance (SI unit)": aC22Quantity(
    "Meaning/symbol/unit only, same as impedance -- no capacitive-reactance calculation candidate exists.",
  ),
  "inductance and inductive reactance (SI unit)": aC22Quantity(
    "Meaning/symbol/unit only, same as impedance -- no inductive-reactance calculation candidate exists.",
  ),
  "power factor (SI unit / dimensional status)": aC22Quantity(
    "Meaning/symbol/unit only -- no power-factor calculation candidate exists, structurally satisfying PA's guard. 'distinctions between them' (PA) is reported as a soft note, not a blocking gap: each quantity carries its own distinct meaning/unit claim, but no single claim explicitly cross-distinguishes all 11 from one another.",
  ),

  // ===================================================================
  // AC2.3 -- Measurement instruments. Two PARALLEL, curriculum-authored
  // parent candidates exist for this AC ("electrical instruments for the
  // measurement of electrical quantities" PRIMARY_REQUIREMENT, and
  // "electrical quantities requiring instrument identification
  // (measurement)" RANGE_CATEGORY) -- the 5 real instrument children
  // attach ONLY to the PRIMARY_REQUIREMENT one via refinesSubject, so
  // (per CC-20A's correctly-conservative rule) neither parent reaches
  // STRUCTURALLY_DECOMPOSED: the PRIMARY_REQUIREMENT one is never
  // structural merely because children point to it, and the RANGE_
  // CATEGORY one has no children pointing to IT at all. This is a
  // pre-existing curriculum-evidence-authoring anomaly (two competing
  // AC2.3 parent nodes), not a generic-pipeline defect -- flagged for
  // Project-Architect review, not corrected here (frozen evidence).
  // ===================================================================
  "electrical instruments for the measurement of electrical quantities": {
    ac: "AC2.3",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes:
      "PRIMARY_REQUIREMENT umbrella; the 5 real instrument children (ammeter/voltmeter/ohmmeter/wattmeter/energy-meter) attach here via refinesSubject, but a PRIMARY_REQUIREMENT is never STRUCTURALLY_DECOMPOSED merely because children point to it (CC-20A). This candidate has zero own facts and was never examined -- it correctly stays UNRESOLVED, not GOVERNED, despite its children being individually well-governed. SYSTEMIC PATTERN: see build-reconciliation.ts summary notes -- this 'umbrella parent not structurally linked to its own content' pattern recurs across AC2.3/AC3.2/AC3.3/AC5.3/AC5.4/AC6.1/AC6.2.",
  },
  "electrical quantities requiring instrument identification (measurement)": {
    ac: "AC2.3",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes:
      "RANGE_CATEGORY sibling of 'electrical instruments for the measurement of electrical quantities' -- but the 5 real instrument children attach to THAT PRIMARY_REQUIREMENT sibling, not to this RANGE_CATEGORY node, so this candidate has neither its own facts nor any children of its own. Stays UNRESOLVED. Data-authoring anomaly (two parallel AC2.3 parents) flagged for Project-Architect review.",
  },
  "instrument for measuring current": aC23Instrument(),
  "instrument for measuring voltage": aC23Instrument(),
  "instrument for measuring resistance": aC23Instrument(
    "Content is an Ohm's-law-derivation description (resistance computed via R=V/I), not explicit connection topology -- ohmmeters are typically used disconnected from the live circuit, so topology is less central than for the ammeter/voltmeter. Judged adequate at calibrated depth.",
  ),
  "instrument for measuring power": aC23Instrument(),
  "instrument for measuring energy": aC23Instrument(),

  // ===================================================================
  // AC3.1 -- Mass and weight.
  // ===================================================================
  "mass and weight": {
    ac: "AC3.1",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "B_MISSING_NORMALIZED_CANDIDATE",
    notes:
      "mass-definition and weight-definition claims cover 'definition/distinction of mass and weight' AND F=mg (the weight-definition claim literally states W=mg) -- both real PA requirements met by the DEFINE candidate. However PA also requires 'appropriate calculations': no CALCULATE-type candidate exists anywhere for mass/weight arithmetic practice. The DEFINE candidate itself is certified COMPLETE (its own definitional content is genuinely adequate); the missing calculation-practice candidate is a separate MISSING_NORMALIZED_CANDIDATE gap that does not block the DEFINE candidate's own certification.",
    certification: {
      decision: "COMPLETE",
      rationale:
        "requiredFactKeys = {mass-definition, weight-definition} after REQUIRED_CORE adjudication; both trace to real OFFICIAL_CURRICULUM evidence (EV-CUR-0064) for this exact candidate; weight-definition's claim value literally gives W=mg. No REVIEW_PROPOSED fact remains pending. Boundary adequate for the DEFINE performance specifically.",
    },
  },

  // ===================================================================
  // AC3.2 -- Simple machines.
  // ===================================================================
  "principles of basic mechanics as applied to levers, gears and pulleys": {
    ac: "AC3.2",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes:
      "PRIMARY_REQUIREMENT umbrella; NOT structurally linked to levers/gears/pulleys (none of them refinesSubject to this candidate). Zero own facts, never examined -- stays UNRESOLVED despite levers/gears/pulleys being individually addressed below. Umbrella-not-linked systemic pattern.",
  },
  levers: {
    ac: "AC3.2",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "Structural RANGE_CATEGORY parent for the three lever classes. STRUCTURALLY_DECOMPOSED via real children, no certification needed.",
  },
  "lever class I": aC32LeverClass(),
  "lever class II": aC32LeverClass(),
  "lever class III": aC32LeverClass(),
  gears: {
    ac: "AC3.2",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    notes:
      "gear-mechanism (speed/ratio at meshed teeth) and mechanical-advantage (force ratio) claims cover PA's torque/speed relationship and force/distance trade-off reasonably well. MISSING entirely (no CandidateFactRequirement even proposed): 'ideal power conservation', 'real losses reduce output', and an explicit rejection of the 'gears create power' misconception -- all three PA-required propositions have zero representation anywhere in the evidence.",
    certification: {
      decision: "PARTIAL",
      rationale:
        "requiredFactKeys = {gear-mechanism, mechanical-advantage} after REQUIRED_CORE adjudication, both real and curriculum-supported -- but PA's power-conservation/losses/misconception-rejection content is entirely unrepresented (not even proposed), so the constructed boundary is knowingly incomplete relative to the calibrated target. PARTIAL, not COMPLETE.",
    },
  },
  pulleys: {
    ac: "AC3.2",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    notes:
      "mechanical-advantage and pulley-mechanism claims cover force/distance trade-off (single pulley MA=1 direction-only; multi-cable MA approx. cable count) well. MISSING: 'ideal power conservation' and 'real losses reduce output' -- neither proposed anywhere.",
    certification: {
      decision: "PARTIAL",
      rationale:
        "requiredFactKeys = {mechanical-advantage, pulley-mechanism} after REQUIRED_CORE adjudication, both real and curriculum-supported -- but power-conservation/losses content is entirely unrepresented. PARTIAL, not COMPLETE.",
    },
  },

  // ===================================================================
  // AC3.3 / AC3.4 -- Force, work, energy, power, efficiency.
  // ===================================================================
  "principles of force, work, energy, power and efficiency": {
    ac: "AC3.3",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes: "PRIMARY_REQUIREMENT umbrella; not structurally linked to force/work/energy/power/efficiency below. Zero own facts, never examined -- stays UNRESOLVED. Umbrella-not-linked systemic pattern.",
  },
  force: {
    ac: "AC3.3",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "force-definition claim gives F=ma (Newton's second law), explicitly cross-referenced to the W=mg weight formula already sourced for AC3.1.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {force-definition} after REQUIRED_CORE adjudication; real curriculum support (EV-CUR-0073); no pending REVIEW_PROPOSED fact." },
  },
  work: {
    ac: "AC3.3",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "work-formula claim gives W = Fd exactly as PA requires.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {work-formula} after REQUIRED_CORE adjudication; real curriculum support (EV-CUR-0074); no pending REVIEW_PROPOSED fact." },
  },
  "energy (kinetic and potential)": {
    ac: "AC3.3",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    notes:
      "The ONLY technical claim for this candidate (kinetic-potential-energy-formula) bundles KE = 1/2 m v^2 with PE = mgh in a SINGLE claim value. PA requires the kinetic-vs-potential CONCEPT and PE-via-mgh, but explicitly EXCLUDES KE = 1/2 m v^2 as required mastery (task section 5, section 9's own worked example). Because the claim is not separable at sub-value granularity, the CandidateFactRequirement citing it is adjudicated REJECT_OVERDEPTH per task section 9's explicit instruction -- this correctly keeps KE out of requiredFactKeys, but ALSO leaves the required 'kinetic vs potential energy concept' proposition with no clean, non-overdepth technical claim of its own. New technical evidence (a KE/PE distinction claim that does not carry the KE numeric formula) is needed to close this candidate's boundary -- it is NOT certified in this package.",
  },
  "power (mechanical)": {
    ac: "AC3.3",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "power-mechanical-formula claim gives P = W/t exactly as PA requires.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {power-mechanical-formula} after REQUIRED_CORE adjudication; real curriculum support (EV-CUR-0076); no pending REVIEW_PROPOSED fact." },
  },
  efficiency: {
    ac: "AC3.3",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "efficiency-formula claim gives %efficiency = Wo/Wi x 100 exactly as PA requires.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {efficiency-formula} after REQUIRED_CORE adjudication; real curriculum support (EV-CUR-0077); no pending REVIEW_PROPOSED fact." },
  },
  "inter-relationships between force, work, energy, power and efficiency": {
    ac: "AC3.3",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "Carries the P = W/t claim (reused from 'power (mechanical)'). Narrow (connects only power/work/time, not a full force-work-energy-efficiency synthesis) but judged adequate at Level-2 calibrated depth.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {power-mechanical-formula} after REQUIRED_CORE adjudication; real curriculum support (EV-CUR-0078); no pending REVIEW_PROPOSED fact." },
  },
  "mechanical energy (calculation)": {
    ac: "AC3.4",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    notes:
      "Same bundled kinetic-potential-energy-formula claim as 'energy (kinetic and potential)' above, attached here as a SEPARATE CandidateFactRequirement (same claimKey, different targetCandidateKey). Same REJECT_OVERDEPTH treatment per task section 9, for the same reason -- and the same follow-on gap: PA's required 'PE via work-against-gravity / mgh equivalence' CALCULATION content has no clean, non-overdepth technical claim to certify. Not certified in this package.",
  },
  "power (calculation, mechanical)": {
    ac: "AC3.4",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "power-mechanical-formula claim (P = W/t) reused for calculation practice.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {power-mechanical-formula} after REQUIRED_CORE adjudication; real curriculum support (EV-CUR-0081); no pending REVIEW_PROPOSED fact." },
  },
  "efficiency (calculation)": {
    ac: "AC3.4",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "efficiency-formula claim reused for calculation practice.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {efficiency-formula} after REQUIRED_CORE adjudication; real curriculum support (EV-CUR-0082); no pending REVIEW_PROPOSED fact." },
  },
  "values of mechanical energy, power and efficiency": {
    ac: "AC3.4",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes:
      "PRIMARY_REQUIREMENT umbrella for AC3.4's three CALCULATE candidates (mechanical energy / power / efficiency calculation) -- but none of them refinesSubject to this candidate, so it has zero own facts and zero children in the pipeline's structural sense, despite the three siblings being individually addressed. Umbrella-not-linked systemic pattern. Stays UNRESOLVED.",
  },

  // ===================================================================
  // AC4 -- DC circuits.
  // ===================================================================
  "basic principles of electron theory": {
    ac: "AC4.1",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "conventional-vs-electron-flow and current-charge-flow claims cover electron theory/conduction and conventional-vs-electron-flow at appropriate depth.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {conventional-vs-electron-flow, current-charge-flow} after REQUIRED_CORE adjudication; real curriculum support (EV-CUR-0083); no pending REVIEW_PROPOSED fact." },
  },
  "conductors (good electrical conductor materials)": {
    ac: "AC4.2",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "conductor-definition claim (free electrons) covers conductors adequately.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {conductor-definition} after REQUIRED_CORE adjudication (both IDENTIFY and DISTINGUISH performance types); real curriculum support; no pending REVIEW_PROPOSED fact." },
  },
  "insulators (electrical insulator materials)": {
    ac: "AC4.2",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "insulator-definition claim covers insulators adequately.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {insulator-definition} after REQUIRED_CORE adjudication (both IDENTIFY and DISTINGUISH performance types); real curriculum support; no pending REVIEW_PROPOSED fact." },
  },
  "resistance and resistivity in relation to electrical circuits": {
    ac: "AC4.3",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "ohms-law (R=V/I) and resistance-resistivity-relation (R = rho L/A) claims cover PA's required resistance/resistivity relationship, rho symbol, and formula fully.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {ohms-law, resistance-resistivity-relation} after REQUIRED_CORE adjudication; real curriculum support (EV-CUR-0088); no pending REVIEW_PROPOSED fact." },
  },
  "relationship between current, voltage and resistance in parallel and series D.C. circuits": {
    ac: "AC4.4",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "ohms-law, parallel-resistance, and series-resistance claims cover series circuits, parallel circuits, and Ohm's law fully.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {ohms-law, parallel-resistance, series-resistance} after REQUIRED_CORE adjudication; real curriculum support (EV-CUR-0089); no pending REVIEW_PROPOSED fact." },
  },
  "current (calculation, D.C. circuits)": aC45Calculation("EV-CUR-0091"),
  "voltage (calculation, D.C. circuits)": aC45Calculation("EV-CUR-0092"),
  "resistance (calculation, D.C. circuits)": aC45Calculation("EV-CUR-0093"),
  "values of current, voltage and resistance in parallel and series D.C. circuits": aC45Calculation("EV-CUR-0090"),
  "values of power in parallel and series D.C. circuits": {
    ac: "AC4.6",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "thermal-effect claim (P = I^2 R = V^2/R) covers electrical power calculations.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {thermal-effect} after REQUIRED_CORE adjudication; real curriculum support (EV-CUR-0094); no pending REVIEW_PROPOSED fact." },
  },
  "voltage drop": {
    ac: "AC4.7",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    notes:
      "Only claim is the generic ohms-law restatement (R=V/I) -- not distinctly framed as voltage-drop-along-a-conductor content (e.g. cable-resistance IR drop). The operative relationship is real and correct, but the claim's framing does not specifically address 'voltage drop' as its own phenomenon.",
    certification: {
      decision: "PARTIAL",
      rationale: "requiredFactKeys = {ohms-law} after REQUIRED_CORE adjudication -- real and curriculum-supported, but the claim content is generic Ohm's law rather than voltage-drop-specific framing. PARTIAL pending a voltage-drop-specific technical claim.",
    },
  },
  "chemical and thermal effects of electric currents": {
    ac: "AC4.8",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "chemical-effect (electrolysis) and thermal-effect (P=I^2R=V^2/R) claims cover both required effects fully.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {chemical-effect, thermal-effect} after REQUIRED_CORE adjudication; real curriculum support (EV-CUR-0096); no pending REVIEW_PROPOSED fact." },
  },

  // ===================================================================
  // AC5.1 / AC5.2 -- Magnetism.
  // ===================================================================
  "attraction and repulsion effects of magnetism": {
    ac: "AC5.1",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    notes:
      "magnetic-attraction-repulsion claim (like poles repel, unlike attract) covers attraction/repulsion. PA's 'magnetic field patterns' proposition (the shape of a permanent magnet's field) has no matching claim anywhere in the evidence -- the closest existing coverage of a magnetic field's geometry is AC5.3's 'production of a magnetic field', which is specifically about a current-carrying conductor's field, not a permanent magnet's field-line pattern.",
    certification: {
      decision: "PARTIAL",
      rationale: "requiredFactKeys = {magnetic-attraction-repulsion} after REQUIRED_CORE adjudication -- real and curriculum-supported, but 'magnetic field patterns' is entirely unrepresented. PARTIAL.",
    },
  },
  "difference between magnetic flux and flux density": {
    ac: "AC5.2",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "flux-vs-flux-density claim gives Phi in weber, B = flux/area in tesla (1 Wb/m^2 = 1 T) -- covers PA's flux, flux density, and B = Phi/A relationship.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {flux-vs-flux-density} after REQUIRED_CORE adjudication; real curriculum support (EV-CUR-0098); no pending REVIEW_PROPOSED fact." },
  },

  // ===================================================================
  // AC5.3 -- Electromagnetism. Relay/contactor material (PA:
  // contextual unless independently required) is entirely absent from
  // the evidence -- nothing to adjudicate or contextualise; noted, not a
  // row of its own.
  // ===================================================================
  "magnetic effects of electrical currents": {
    ac: "AC5.3",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes: "PRIMARY_REQUIREMENT umbrella; not structurally linked to the four AC5.3 candidates below. Zero own facts, never examined -- stays UNRESOLVED. Umbrella-not-linked systemic pattern.",
  },
  "production of a magnetic field": {
    ac: "AC5.3",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "E_MISSING_QUALIFICATION_SCOPE_EVIDENCE",
    notes:
      "magnetic-field-production claim (current-carrying wire field, right-hand direction rule) covers 'magnetic field around a current-carrying conductor; direction rule' well. PA explicitly names solenoid magnetic field, solenoid polarity, and basic electromagnet principle as calibrated required content -- but 'solenoid' does not appear ANYWHERE in the current curriculum, factRequirement, or technical-claim evidence (confirmed by exhaustive text search of the frozen input). This is EXACTLY the case PA itself pre-flagged (task section 5): 'the clean public run previously lacked usable assessment-question evidence for it. Do not pretend that missing evidence exists.' No candidate, no proposal, nothing to adjudicate -- genuine MISSING_QUALIFICATION_SCOPE_EVIDENCE, not merely a missing fact requirement, since even the SCOPE-establishing curriculum/assessment evidence for solenoids is absent.",
    certification: {
      decision: "PARTIAL",
      rationale:
        "requiredFactKeys = {magnetic-field-production} after REQUIRED_CORE adjudication -- real and curriculum-supported for conductor field/direction rule, but solenoid field/polarity/electromagnet content (PA-calibrated required) has zero scope evidence at all. PARTIAL, explicitly not blocked from certification by the missing solenoid content (which cannot even be proposed without new evidence) but the boundary is knowingly incomplete relative to the calibrated target.",
    },
  },
  "force on a current-carrying conductor in a magnetic field": {
    ac: "AC5.3",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    notes:
      "force-on-conductor claim gives F = BIl (motor effect) exactly as PA requires. MISSING: the Fleming left-hand rule mnemonic mapping (thumb/forefinger/middle-finger assignment) -- 'Fleming' does not appear anywhere in the evidence.",
    certification: {
      decision: "PARTIAL",
      rationale: "requiredFactKeys = {force-on-conductor} after REQUIRED_CORE adjudication -- F=BIL formula real and curriculum-supported, but the Fleming left-hand rule mapping PA separately requires is entirely unrepresented. PARTIAL.",
    },
  },
  "electromotive force": {
    ac: "AC5.3",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    notes:
      "faradays-law claim gives epsilon = -N dPhi/dt -- covers 'induced EMF' generally. MISSING: the specific motional-EMF formula e = Blv, and the Fleming right-hand (generator) rule mapping -- neither appears anywhere in the evidence.",
    certification: {
      decision: "PARTIAL",
      rationale: "requiredFactKeys = {faradays-law} after REQUIRED_CORE adjudication -- real and curriculum-supported for the general induced-EMF relationship, but e=Blv and the Fleming right-hand rule mapping are entirely unrepresented. PARTIAL.",
    },
  },
  electromagnetism: {
    ac: "AC5.3",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes: "PRIMARY_REQUIREMENT, zero own facts, not structurally linked to any child. Stays UNRESOLVED. Umbrella-not-linked systemic pattern (possibly intended to host the missing electromagnet-principle content named above).",
  },

  // ===================================================================
  // AC5.4 / AC5.5 -- AC generation / sine wave.
  // ===================================================================
  "basic principles of generating an A.C. supply": {
    ac: "AC5.4",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes: "PRIMARY_REQUIREMENT umbrella; not structurally linked to the five AC5.4 candidates below. Zero own facts, never examined -- stays UNRESOLVED. Umbrella-not-linked systemic pattern.",
  },
  "single-loop generator": {
    ac: "AC5.4",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    notes:
      "faradays-law claim covers the generator's operating causality (EMF induction) but not the physical COMPONENTS of a single-loop alternator/generator (coil, slip rings/brushes, field source) PA separately requires -- no such description exists anywhere.",
    certification: {
      decision: "PARTIAL",
      rationale: "requiredFactKeys = {faradays-law} after REQUIRED_CORE adjudication -- operating causality real and curriculum-supported, but the generator's physical components are entirely unrepresented. PARTIAL.",
    },
  },
  "sine-wave (AC generation principle)": {
    ac: "AC5.4",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "ac-sine-equation claim (V = V0 sin(2*pi*f*t)) covers the sine-wave-generation relationship on its own narrow terms.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {ac-sine-equation} after REQUIRED_CORE adjudication; real curriculum support (EV-CUR-0106); no pending REVIEW_PROPOSED fact." },
  },
  "frequency (AC generation principle)": {
    ac: "AC5.4",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    notes:
      "ac-sine-equation claim establishes f as the frequency term in the waveform equation, but PA's two explicitly-required frequency-generation formulas -- f = N x P (N in rev/s, P pole pairs) and the equivalent f = n_rpm x P / 60 -- are NOT present anywhere in the evidence.",
    certification: {
      decision: "PARTIAL",
      rationale: "requiredFactKeys = {ac-sine-equation} after REQUIRED_CORE adjudication -- real and curriculum-supported for the waveform's frequency term, but the two PA-named speed/pole-pairs formulas are entirely unrepresented. PARTIAL.",
    },
  },
  "EMF (AC generation principle)": {
    ac: "AC5.4",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "faradays-law claim adequately covers EMF in the AC-generation context.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {faradays-law} after REQUIRED_CORE adjudication; real curriculum support (EV-CUR-0108); no pending REVIEW_PROPOSED fact." },
  },
  "magnetic flux (AC generation principle)": {
    ac: "AC5.4",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "faradays-law claim (reused) is a reasonable fit for magnetic flux in the AC-generation context at calibrated depth, though it does not specifically address rotating flux linkage.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {faradays-law} after REQUIRED_CORE adjudication; real curriculum support (EV-CUR-0109); no pending REVIEW_PROPOSED fact." },
  },
  "characteristics of sine-waves": {
    ac: "AC5.5",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "Structural RANGE_CATEGORY parent for the six sine-wave characteristics below. STRUCTURALLY_DECOMPOSED via real children, no certification needed.",
  },
  "amplitude (sine-wave characteristic)": aC55Characteristic("the formal peak-value magnitude definition"),
  "RMS value (sine-wave characteristic)": aC55Characteristic("RMS = peak / sqrt(2) (approx. 0.707 x peak) and peak = approx. 1.414 x RMS"),
  "peak to peak value (sine-wave characteristic)": aC55Characteristic("the peak-to-peak = 2 x peak relationship"),
  "average value (sine-wave characteristic)": aC55Characteristic(
    "the one-alternation average (2/pi x peak, approx. 0.6366 x peak) AND the signed full-cycle average = 0 relationship -- both PA-required, neither represented",
  ),
  "periodic time (sine-wave characteristic)": aC55Characteristic("T = 1/f"),
  "frequency (sine-wave characteristic)": {
    ac: "AC5.5",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "ac-sine-equation claim establishes frequency as the waveform's f term -- adequate for this candidate's own narrow IDENTIFY scope (T=1/f itself is tracked under 'periodic time' above).",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {ac-sine-equation} after REQUIRED_CORE adjudication; real curriculum support (EV-CUR-0115); no pending REVIEW_PROPOSED fact." },
  },

  // ===================================================================
  // AC6.1 -- Electronic applications. ALL SIX application candidates
  // have ZERO CandidateFactRequirement -- the calibrated exemplars PA
  // names (SCR/thyristor latching+sounder, capacitor-ringer, TRIAC/DIAC
  // dimmer control, thermistor sensing, bridge rectifier AC-to-DC) are
  // real COMPONENT-level facts elsewhere (AC6.2) but are NOT linked to
  // these APPLICATION-level candidates at all.
  // ===================================================================
  "electrical systems (context for electronic component function/application)": {
    ac: "AC6.1",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes:
      "RANGE_CATEGORY sibling of 'function and application of electronic components...' -- the six real application children attach to THAT PRIMARY_REQUIREMENT sibling, not to this RANGE_CATEGORY node (same dual-parent anomaly as AC2.3). Zero own facts, zero real children. Stays UNRESOLVED.",
  },
  "function and application of electronic components used in electrical systems": {
    ac: "AC6.1",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes:
      "PRIMARY_REQUIREMENT umbrella; the six real application children (security alarms/telephones/dimmer/heating/motor/wireless) attach here via refinesSubject, but a PRIMARY_REQUIREMENT is never STRUCTURALLY_DECOMPOSED merely because children point to it (CC-20A) -- exactly the BY2 regression scenario, now observed in real production data. Zero own facts, never examined -- stays UNRESOLVED despite its six children existing.",
  },
  "electronic components function/application: security alarms": aC61Application(
    "Qualification-calibrated exemplar (SCR/thyristor latching and sounder role): the thyristor COMPONENT-level claim (thyristor-definition, 'An SCR/thyristor is a latching semiconductor...') exists under AC6.2, but no fact requirement connects the thyristor's latching behaviour to the alarm APPLICATION specifically.",
  ),
  "electronic components function/application: telephones": aC61Application(
    "Qualification-calibrated exemplar (capacitor-to-ringer function): the capacitor COMPONENT-level claim (capacitor-definition, generic charge-storage description) exists under AC6.2 but does not mention a ringer function, and no fact requirement connects it to the telephone APPLICATION.",
  ),
  "electronic components function/application: dimmer switches": aC61Application(
    "Required at calibrated depth (TRIAC AC switching/control, DIAC triggering, basic timing/control relationship): the triac-definition and diac-definition COMPONENT-level claims exist under AC6.2, but no fact requirement connects them to the dimmer APPLICATION or states the triggering/timing relationship between them.",
  ),
  "electronic components function/application: heating/boiler controls": aC61Application(
    "Required/supporting at calibrated depth (thermistor sensing role): the thermistor-definition COMPONENT-level claim exists under AC6.2, but no fact requirement connects it to the heating-control APPLICATION.",
  ),
  "electronic components function/application: motor control": aC61Application(
    "Qualification-calibrated exemplar (bridge rectifier converts AC to DC): only a GENERIC rectifier-definition claim exists under AC6.2 ('Rectification is the process of turning an AC...') -- it does not name a BRIDGE rectifier specifically, and no fact requirement connects rectification to the motor-control APPLICATION.",
  ),
  "electronic components function/application: wireless control systems": {
    ac: "AC6.1",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes:
      "PA requires only 'category/function as an electronic application' (no specific exemplar named); 'suitable advantages/applications' is separately marked teaching support only. Even the required category/function has zero CandidateFactRequirement. Less severe than the other five application candidates (no missing cross-AC exemplar linkage to trace), but still a real gap.",
  },

  // ===================================================================
  // AC6.2 -- Electronic components. 'schematic-symbol recognition at
  // qualification depth' (PA) is absent from every component's claim
  // (all are function/operating-principle definitions, none address
  // symbol shape/recognition) -- a cross-cutting gap noted once here and
  // reflected in every component's PARTIAL certification below.
  // ===================================================================
  "basic operating principles of electronic components and devices": {
    ac: "AC6.2",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes:
      "PRIMARY_REQUIREMENT umbrella; the 13 real component children attach to the SIBLING RANGE_CATEGORY 'electronic components and devices' (which IS correctly STRUCTURALLY_DECOMPOSED), not to this candidate. Zero own facts, zero children of its own. Stays UNRESOLVED. Same dual-parent anomaly as AC2.3/AC6.1.",
  },
  "electronic components and devices": {
    ac: "AC6.2",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "Structural RANGE_CATEGORY parent for the 13 component families below. STRUCTURALLY_DECOMPOSED via real children, no certification needed.",
  },
  capacitors: aC62Component(),
  diacs: aC62Component(),
  diodes: aC62Component(),
  invertors: aC62Component(),
  LED: aC62Component(),
  photo: {
    ac: "AC6.2",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "C_MISSING_FACT_REQUIREMENT",
    notes: "The only AC6.2 component family with NO CandidateFactRequirement at all -- not even REVIEW_PROPOSED. Cannot be adjudicated (nothing to adjudicate) or certified.",
  },
  rectifiers: aC62Component("Claim is generic rectification only, not a 'bridge rectifier' specifically -- see also the motor-control AC6.1 gap above."),
  resistors: {
    ac: "AC6.2",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT",
    notes:
      "The only technical claim attached to 'resistors::STATE' reuses the ohms-law claimKey (R=V/I) -- a circuit-calculation formula, not a resistor-component-specific description. PA's calibrated supporting performance (4-band resistor colour code) has NO fact requirement or technical claim anywhere in the evidence -- 'colour code' does not appear in the corpus at all.",
    certification: {
      decision: "PARTIAL",
      rationale:
        "requiredFactKeys = {ohms-law} after REQUIRED_CORE adjudication -- real and curriculum-supported, but generic (not resistor-specific) and does not cover the calibrated 4-band colour-code supporting performance PA names, nor schematic-symbol recognition. PARTIAL.",
    },
  },
  thermistors: aC62Component(),
  thyristors: aC62Component(),
  transistors: aC62Component(),
  triacs: aC62Component(),
  Zener: aC62Component(),
};

function aC22Quantity(extraNote?: string): SubjectNote {
  return {
    ac: "AC2.2",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: extraNote ?? "EXPLICIT_CURRICULUM_FACT fact requirement (no adjudication needed) with a real meaning/symbol/unit TECHNICAL_TRUTH claim -- adequate at Level-2 depth.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys already populated via EXPLICIT_CURRICULUM_FACT (no adjudication needed); real curriculum-sourced TECHNICAL_TRUTH claim; no pending REVIEW_PROPOSED fact." },
  };
}

function aC23Instrument(extraNote?: string): SubjectNote {
  return {
    ac: "AC2.3",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: extraNote ?? "Real technical claim explicitly states series/parallel connection topology -- meter connection topology is genuine required learner knowledge per PA, and it is present.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys populated after REQUIRED_CORE adjudication (matches PA's own worked example: 'meter connection topology -> REQUIRED_CORE'); real curriculum support; no pending REVIEW_PROPOSED fact." },
  };
}

function aC32LeverClass(): SubjectNote {
  return {
    ac: "AC3.2",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: "Fulcrum-position claim adequately distinguishes this lever class. PA's power-conservation/losses technical-model content applies at the simple-machines group level (see 'gears'/'pulleys'), not per lever class.",
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys populated after REQUIRED_CORE adjudication; real curriculum support; no pending REVIEW_PROPOSED fact." },
  };
}

function aC45Calculation(evidenceId: string): SubjectNote {
  return {
    ac: "AC4.5",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "A_NO_GAP",
    notes: `ohms-law claim (R=V/I) covers this calculation candidate. Real curriculum support ${evidenceId}.`,
    certification: { decision: "COMPLETE", rationale: "requiredFactKeys = {ohms-law} after REQUIRED_CORE adjudication; real curriculum support; no pending REVIEW_PROPOSED fact." },
  };
}

function aC55Characteristic(missing: string): SubjectNote {
  return {
    ac: "AC5.5",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    notes: `CandidateFactRequirement exists (REVIEW_PROPOSED) but has ZERO matching TECHNICAL_TRUTH claim -- missing specifically: ${missing}.`,
    certification: {
      decision: "PARTIAL",
      rationale: `Adjudicated REQUIRED_CORE per PA's classification (the calibrated decision remains visible), but no technical claim exists to support the boundary -- PARTIAL, never falsely certified COMPLETE (task section 2/12).`,
    },
  };
}

function aC61Application(exemplarNote: string): SubjectNote {
  return {
    ac: "AC6.1",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT",
    notes: `ZERO CandidateFactRequirement exists for this application candidate -- nothing to adjudicate. ${exemplarNote}`,
  };
}

function aC62Component(extraNote?: string): SubjectNote {
  return {
    ac: "AC6.2",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    notes: (extraNote ? extraNote + " " : "") + "Operating-principle claim is real and adequate, but 'schematic-symbol recognition at qualification depth' (PA) is unrepresented -- cross-cutting AC6.2 gap.",
    certification: {
      decision: "PARTIAL",
      rationale: "requiredFactKeys populated after REQUIRED_CORE adjudication; operating-principle content real and curriculum-supported, but schematic-symbol recognition is entirely unrepresented. PARTIAL.",
    },
  };
}

/**
 * AC2.1 subjects: PA gave no locked decision for AC2.1 in this package
 * (section 5 starts at AC1.1 then AC2.2 -- AC2.1 is never mentioned).
 * Per task section 9 ("If a proposal is not covered clearly by these
 * instructions: leave it unresolved and put it in the report for
 * Project Architect decision"), these are whitelisted OUT of the
 * "every subject must have a SUBJECT_NOTES entry" validation and
 * reported separately as AWAITING_PROJECT_ARCHITECT_DECISION.
 */
export const AC21_SUBJECTS_NOT_ADDRESSED_BY_PA = new Set([
  "SI units of measurement for general physical quantities",
  "length (SI unit)",
  "area (SI unit)",
  "volume (SI unit)",
  "mass (SI unit)",
  "density (SI unit)",
  "time (SI unit)",
  "velocity (SI unit)",
  "temperature (SI unit)",
]);

/**
 * (targetCandidateKey, claimKey) pairs whose adjudication is NOT the
 * script's default REQUIRED_CORE. Task section 9's own worked example:
 * "KE = 1/2 mv^2 -> REJECT_OVERDEPTH / equivalent existing rejection".
 * Both rows below are the SAME bundled claim (kinetic-potential-energy-
 * formula), cited by two separate CandidateFactRequirement records.
 */
export const ADJUDICATION_OVERRIDES: ReadonlyArray<{
  readonly targetCandidateKey: string;
  readonly claimKey: string;
  readonly decision: "REJECT_OVERDEPTH";
  readonly rationale: string;
}> = [
  {
    targetCandidateKey: "energy (kinetic and potential)::DESCRIBE",
    claimKey: "unit202.review-fact.kinetic-potential-energy-formula",
    decision: "REJECT_OVERDEPTH",
    rationale:
      "The cited claim bundles KE = 1/2 m v^2 with PE = mgh in one value. Task section 5/9: KE = 1/2 mv^2 is explicitly excluded from Unit-202 mastery ('overdepth/not necessary for this calibrated qualification boundary'). Because the claim is not separable at sub-value granularity, the whole citation is rejected rather than partially honoured -- new, PE-only technical evidence is needed to represent the PA-required PE concept cleanly (see SUBJECT_NOTES['energy (kinetic and potential)']).",
  },
  {
    targetCandidateKey: "mechanical energy (calculation)::CALCULATE",
    claimKey: "unit202.review-fact.kinetic-potential-energy-formula",
    decision: "REJECT_OVERDEPTH",
    rationale: "Same bundled claim, cited by a second, independent CandidateFactRequirement targeting the CALCULATE performance type. Same reasoning as above.",
  },
];

export interface MissingProposition {
  readonly reconciliationId: string;
  readonly ac: string;
  readonly proposition: string;
  readonly paClassification: PAClassification;
  readonly gapType: GapType;
  readonly closestCandidateKey: string | null;
  readonly notes: string;
}

/**
 * PA-locked propositions (task section 5) with NO real candidate at all
 * in the current curriculum evidence -- never reachable by iterating
 * `candidates`, so recorded here explicitly (task section 7: "No row may
 * disappear because the current pipeline failed to produce it").
 */
export const MISSING_PROPOSITIONS: readonly MissingProposition[] = [
  {
    reconciliationId: "MP-001",
    ac: "AC1.1",
    proposition: "standard / scientific notation",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "B_MISSING_NORMALIZED_CANDIDATE",
    closestCandidateKey: null,
    notes: "No curriculum Range member, no candidate, no fact requirement, no technical claim anywhere in the evidence for standard/scientific notation.",
  },
  {
    reconciliationId: "MP-002",
    ac: "AC1.1",
    proposition: "engineering notation",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "B_MISSING_NORMALIZED_CANDIDATE",
    closestCandidateKey: null,
    notes: "No curriculum Range member, no candidate, no fact requirement, no technical claim anywhere in the evidence for engineering notation.",
  },
  {
    reconciliationId: "MP-003",
    ac: "AC3.1",
    proposition: "mass/weight 'appropriate calculations' (numeric practice, distinct from the DEFINE candidate's own definitional content)",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "B_MISSING_NORMALIZED_CANDIDATE",
    closestCandidateKey: "mass and weight::DEFINE",
    notes: "Only a DEFINE-performance candidate exists for mass and weight; no CALCULATE-type candidate exists anywhere, despite F=mg (the operative formula) already being present in the weight-definition claim.",
  },
  {
    reconciliationId: "MP-004",
    ac: "AC3.2",
    proposition: "ideal power conservation in a simple machine (levers/gears/pulleys)",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    closestCandidateKey: "gears::EXPLAIN",
    notes: "No CandidateFactRequirement proposes this anywhere under AC3.2 -- see 'gears'/'pulleys' PARTIAL certification rationale.",
  },
  {
    reconciliationId: "MP-005",
    ac: "AC3.2",
    proposition: "real losses reduce output in a simple machine (levers/gears/pulleys)",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    closestCandidateKey: "gears::EXPLAIN",
    notes: "No CandidateFactRequirement proposes this anywhere under AC3.2.",
  },
  {
    reconciliationId: "MP-006",
    ac: "AC3.2",
    proposition: "explicit rejection of the misconception that gears 'create power'",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    closestCandidateKey: "gears::EXPLAIN",
    notes: "PA explicitly requires this rejection be preserved in the technical model; no claim anywhere states or denies it.",
  },
  {
    reconciliationId: "MP-007",
    ac: "AC5.3",
    proposition: "solenoid magnetic field",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "E_MISSING_QUALIFICATION_SCOPE_EVIDENCE",
    closestCandidateKey: "production of a magnetic field::DESCRIBE",
    notes: "PA's own explicit warning (task section 5): evidence for this was already known to be missing. Confirmed by exhaustive text search: 'solenoid' appears nowhere in curriculum, factRequirement, or factualClaim evidence.",
  },
  {
    reconciliationId: "MP-008",
    ac: "AC5.3",
    proposition: "solenoid polarity",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "E_MISSING_QUALIFICATION_SCOPE_EVIDENCE",
    closestCandidateKey: "production of a magnetic field::DESCRIBE",
    notes: "Same as MP-007 -- PA's own pre-flagged gap.",
  },
  {
    reconciliationId: "MP-009",
    ac: "AC5.3",
    proposition: "basic electromagnet principle",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "E_MISSING_QUALIFICATION_SCOPE_EVIDENCE",
    closestCandidateKey: "electromagnetism::DESCRIBE",
    notes: "No curriculum/technical evidence establishes electromagnet-specific content (as distinct from the general current-carrying-conductor field already covered).",
  },
  {
    reconciliationId: "MP-010",
    ac: "AC5.3",
    proposition: "Fleming left-hand rule mapping (motor effect)",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    closestCandidateKey: "force on a current-carrying conductor in a magnetic field::DESCRIBE",
    notes: "The underlying F=BIL formula is present and required; the Fleming mnemonic mapping itself is not.",
  },
  {
    reconciliationId: "MP-011",
    ac: "AC5.3",
    proposition: "Fleming right-hand (generator) rule mapping",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    closestCandidateKey: "electromotive force::DESCRIBE",
    notes: "Not represented anywhere in the evidence.",
  },
  {
    reconciliationId: "MP-012",
    ac: "AC5.3",
    proposition: "e = Blv (motional EMF formula)",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    closestCandidateKey: "electromotive force::DESCRIBE",
    notes: "Only the general Faraday's-law form (epsilon = -N dPhi/dt) is present; the motional form e=Blv is not.",
  },
  {
    reconciliationId: "MP-013",
    ac: "AC5.4",
    proposition: "f = N x P (N = rev/s, P = pole pairs)",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    closestCandidateKey: "frequency (AC generation principle)::DESCRIBE",
    notes: "Not represented anywhere -- only the general sine-waveform equation exists, which does not derive frequency from rotational speed and pole pairs.",
  },
  {
    reconciliationId: "MP-014",
    ac: "AC5.4",
    proposition: "f = n_rpm x P / 60 (equivalent rpm form)",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    closestCandidateKey: "frequency (AC generation principle)::DESCRIBE",
    notes: "Same as MP-013.",
  },
  {
    reconciliationId: "MP-015",
    ac: "AC5.4",
    proposition: "single-loop alternator/generator physical components (coil, slip rings/brushes, field source)",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    closestCandidateKey: "single-loop generator::DESCRIBE",
    notes: "Only the EMF-induction equation is present; the physical construction of the generator itself is not described anywhere.",
  },
  {
    reconciliationId: "MP-016",
    ac: "AC5.5",
    proposition: "RMS = peak / sqrt(2) (approx. 0.707 x peak); peak = approx. 1.414 x RMS",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    closestCandidateKey: "RMS value (sine-wave characteristic)::IDENTIFY",
    notes: "CandidateFactRequirement exists (REVIEW_PROPOSED) but has zero matching TECHNICAL_TRUTH claim.",
  },
  {
    reconciliationId: "MP-017",
    ac: "AC5.5",
    proposition: "average value over one alternation = 2/pi x peak (approx. 0.6366 x peak)",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    closestCandidateKey: "average value (sine-wave characteristic)::IDENTIFY",
    notes: "CandidateFactRequirement exists (REVIEW_PROPOSED) but has zero matching TECHNICAL_TRUTH claim.",
  },
  {
    reconciliationId: "MP-018",
    ac: "AC5.5",
    proposition: "signed full-cycle sine-wave average = 0",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    closestCandidateKey: "average value (sine-wave characteristic)::IDENTIFY",
    notes: "Same candidate as MP-017 (average value) but a logically distinct proposition per task section 12's decomposition requirement -- neither is represented.",
  },
  {
    reconciliationId: "MP-019",
    ac: "AC5.5",
    proposition: "T = 1/f (periodic time)",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    closestCandidateKey: "periodic time (sine-wave characteristic)::IDENTIFY",
    notes: "CandidateFactRequirement exists (REVIEW_PROPOSED) but has zero matching TECHNICAL_TRUTH claim.",
  },
  {
    reconciliationId: "MP-020",
    ac: "AC5.5",
    proposition: "peak-to-peak = 2 x peak",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    closestCandidateKey: "peak to peak value (sine-wave characteristic)::IDENTIFY",
    notes: "CandidateFactRequirement exists (REVIEW_PROPOSED) but has zero matching TECHNICAL_TRUTH claim.",
  },
  {
    reconciliationId: "MP-021",
    ac: "AC5.5",
    proposition: "suitable RMS/average/period/frequency calculation practice",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "B_MISSING_NORMALIZED_CANDIDATE",
    closestCandidateKey: null,
    notes: "Only IDENTIFY-performance candidates exist for sine-wave characteristics; no CALCULATE-type candidate exists for numeric sine-wave arithmetic practice.",
  },
  {
    reconciliationId: "MP-022",
    ac: "AC6.1",
    proposition: "thyristor/SCR latching and sounder role (security-alarm exemplar)",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT",
    closestCandidateKey: "electronic components function/application: security alarms::DESCRIBE",
    notes: "The thyristor's general latching behaviour is described under AC6.2 (component level); no fact requirement links it to the alarm/sounder application specifically.",
  },
  {
    reconciliationId: "MP-023",
    ac: "AC6.1",
    proposition: "capacitor-to-ringer function (telephone exemplar)",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT",
    closestCandidateKey: "electronic components function/application: telephones::DESCRIBE",
    notes: "The capacitor's generic charge-storage description exists under AC6.2; no fact requirement links it to a telephone ringer function.",
  },
  {
    reconciliationId: "MP-024",
    ac: "AC6.1",
    proposition: "TRIAC AC-switching/control + DIAC triggering + basic timing/control relationship (dimmer exemplar)",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT",
    closestCandidateKey: "electronic components function/application: dimmer switches::DESCRIBE",
    notes: "TRIAC/DIAC component definitions exist under AC6.2; no fact requirement links their triggering/timing relationship to the dimmer application.",
  },
  {
    reconciliationId: "MP-025",
    ac: "AC6.1",
    proposition: "thermistor sensing role (heating-control exemplar)",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT",
    closestCandidateKey: "electronic components function/application: heating/boiler controls::DESCRIBE",
    notes: "Thermistor component definition exists under AC6.2; no fact requirement links it to the heating-control application.",
  },
  {
    reconciliationId: "MP-026",
    ac: "AC6.1",
    proposition: "bridge rectifier converts AC to DC (motor-control exemplar)",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT",
    closestCandidateKey: "electronic components function/application: motor control::DESCRIBE",
    notes: "Only a generic rectifier claim exists under AC6.2 -- 'bridge rectifier' specifically, and its motor-control application, are both unrepresented.",
  },
  {
    reconciliationId: "MP-027",
    ac: "AC6.2",
    proposition: "4-band resistor colour code (calibrated supporting performance)",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "I_CALIBRATED_EXEMPLAR_NEEDS_PUBLIC_SUPPORT",
    closestCandidateKey: "resistors::STATE",
    notes: "'colour code' does not appear anywhere in the evidence. The resistor's own fact requirement reuses the generic ohms-law claim, not a resistor-specific description.",
  },
  {
    reconciliationId: "MP-028",
    ac: "AC6.2",
    proposition: "schematic-symbol recognition (all 13 component families, cross-cutting)",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    gapType: "G_MISSING_TECHNICAL_TRUTH",
    closestCandidateKey: "electronic components and devices::STATE",
    notes: "Every AC6.2 component claim describes function/operating principle only -- none address schematic symbol shape or recognition. Applies identically to all 13 members.",
  },
];
