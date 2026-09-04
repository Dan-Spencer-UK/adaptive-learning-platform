/**
 * CC-22A: maps each Source-Acquisition-Manifest clusterKey to the real
 * curriculum `subject` strings it corresponds to in the frozen Unit-202
 * qualification-pipeline evidence (reports/backtests/unit202-post-
 * hardening/CC-21-FULL-PUBLIC-INPUT.json). build-reconciliation.ts
 * expands each subject to its real candidateKey(s) (subject x real
 * performanceType, cross-product against the actual frozen curriculum
 * data -- never a hand-typed candidateKey) and validates every subject
 * named here actually exists, and every AC1-6 curriculum subject is
 * covered by some cluster, erroring loudly otherwise.
 */
export const CLUSTER_TO_SUBJECTS: Record<string, readonly string[]> = {
  "foundational-mathematics-for-electrical-work": ["mathematical principles", "fractions and percentages", "algebra", "indices", "transposition", "triangles and trigonometry", "statistics"],
  "si-units-and-physical-quantities": [
    "SI units of measurement for general physical quantities",
    "length (SI unit)",
    "area (SI unit)",
    "volume (SI unit)",
    "mass (SI unit)",
    "density (SI unit)",
    "time (SI unit)",
    "velocity (SI unit)",
    "temperature (SI unit)",
  ],
  "electrical-quantities-and-si-units": [
    "electrical quantities (SI units)",
    "current (SI unit)",
    "voltage (SI unit)",
    "resistance (SI unit)",
    "resistivity (SI unit)",
    "power (SI unit)",
    "energy (SI unit)",
    "frequency (SI electrical quantity)",
    "impedance (SI unit)",
    "capacitance and capacitive reactance (SI unit)",
    "inductance and inductive reactance (SI unit)",
    "power factor (SI unit / dimensional status)",
  ],
  "electrical-measurement-instruments": [
    "electrical instruments for the measurement of electrical quantities",
    "electrical quantities requiring instrument identification (measurement)",
    "instrument for measuring current",
    "instrument for measuring voltage",
    "instrument for measuring resistance",
    "instrument for measuring power",
    "instrument for measuring energy",
  ],
  "mass-and-weight": ["mass and weight"],
  "simple-machines-levers-gears-pulleys": ["principles of basic mechanics as applied to levers, gears and pulleys", "levers", "lever class I", "lever class II", "lever class III", "gears", "pulleys"],
  "work-energy-power-efficiency": [
    "principles of force, work, energy, power and efficiency",
    "force",
    "work",
    "energy (kinetic and potential)",
    "power (mechanical)",
    "efficiency",
    "inter-relationships between force, work, energy, power and efficiency",
    "values of mechanical energy, power and efficiency",
    "mechanical energy (calculation)",
    "power (calculation, mechanical)",
    "efficiency (calculation)",
  ],
  "electron-theory-and-conduction": ["basic principles of electron theory"],
  "conductors-and-insulators": ["conductors (good electrical conductor materials)", "insulators (electrical insulator materials)"],
  "resistance-and-resistivity": ["resistance and resistivity in relation to electrical circuits"],
  "dc-circuit-theory-series-parallel": [
    "relationship between current, voltage and resistance in parallel and series D.C. circuits",
    "current (calculation, D.C. circuits)",
    "voltage (calculation, D.C. circuits)",
    "resistance (calculation, D.C. circuits)",
    "values of current, voltage and resistance in parallel and series D.C. circuits",
  ],
  "dc-circuit-power": ["values of power in parallel and series D.C. circuits"],
  "voltage-drop": ["voltage drop"],
  "thermal-and-chemical-effects-of-current": ["chemical and thermal effects of electric currents"],
  "magnetism-flux-and-flux-density": ["attraction and repulsion effects of magnetism", "difference between magnetic flux and flux density"],
  "electromagnetism-motor-effect-and-induced-emf": [
    "magnetic effects of electrical currents",
    "production of a magnetic field",
    "force on a current-carrying conductor in a magnetic field",
    "electromotive force",
    "electromagnetism",
  ],
  "ac-generation-single-loop-alternator": ["basic principles of generating an A.C. supply", "single-loop generator", "sine-wave (AC generation principle)", "frequency (AC generation principle)", "EMF (AC generation principle)", "magnetic flux (AC generation principle)"],
  "sine-wave-characteristics": [
    "characteristics of sine-waves",
    "amplitude (sine-wave characteristic)",
    "RMS value (sine-wave characteristic)",
    "peak to peak value (sine-wave characteristic)",
    "average value (sine-wave characteristic)",
    "periodic time (sine-wave characteristic)",
    "frequency (sine-wave characteristic)",
  ],
  "electronic-systems-and-applications": [
    "electrical systems (context for electronic component function/application)",
    "function and application of electronic components used in electrical systems",
    "electronic components function/application: security alarms",
    "electronic components function/application: telephones",
    "electronic components function/application: dimmer switches",
    "electronic components function/application: heating/boiler controls",
    "electronic components function/application: motor control",
    "electronic components function/application: wireless control systems",
  ],
  "electronic-components-operating-principles": [
    "basic operating principles of electronic components and devices",
    "electronic components and devices",
    "capacitors",
    "diacs",
    "diodes",
    "invertors",
    "LED",
    "photo",
    "rectifiers",
    "resistors",
    "thermistors",
    "thyristors",
    "transistors",
    "triacs",
    "Zener",
  ],
};

export interface SupplementaryProposition {
  readonly reconciliationId: string;
  readonly ac: string;
  readonly clusterKey: string | null;
  readonly proposition: string;
  readonly paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE" | "FOUNDATIONAL_PREREQUISITE" | "CONTEXTUAL_TEACHING_SUPPORT" | "OUT_OF_SCOPE";
  readonly qualificationEvidenceState: "EXPLICIT_PUBLIC_CURRICULUM" | "PUBLIC_ASSESSMENT_SUPPORTED" | "CALIBRATED_ONLY_PUBLIC_SUPPORT_NEEDED" | "FOUNDATIONAL_NECESSITY" | "CONTEXT_ONLY" | "OUT_OF_SCOPE";
  readonly closestSubject: string | null;
  readonly notes: string;
}

/**
 * PA propositions the Source-Acquisition-Manifest clusters do not
 * decompose to (they only reach AC-level or broad-application-level
 * granularity) -- the AC6.1 required/exemplar/teaching-support/context/
 * out-of-scope breakdown (task section 12), the "gears create power"
 * rejected misconception (task section 9), and relay/contactor context
 * (task section 11). Every one of task section 12's named items appears
 * exactly once below, per task section 12's own closing instruction:
 * "Every one of these PA propositions must appear in the atomic
 * reconciliation even where there is no existing candidate/fact."
 */
export const SUPPLEMENTARY_PROPOSITIONS: readonly SupplementaryProposition[] = [
  {
    reconciliationId: "SP-001",
    ac: "AC3.2",
    clusterKey: "simple-machines-levers-gears-pulleys",
    proposition: "Rejected misconception: gears (or any simple machine) 'create power'.",
    paClassification: "OUT_OF_SCOPE",
    qualificationEvidenceState: "OUT_OF_SCOPE",
    closestSubject: "gears",
    notes: "Task section 9: this is a FALSE proposition to reject, never a separate REQUIRED learner proposition needing its own technical source. Correct power-conservation/loss knowledge (see gears/pulleys PARTIAL certification) is sufficient. Recorded here as a rejected misconception, not as a technical-evidence gap.",
  },
  {
    reconciliationId: "SP-002",
    ac: "AC5.3",
    clusterKey: "electromagnetism-motor-effect-and-induced-emf",
    proposition: "Relay/contactor as electromagnetism application context.",
    paClassification: "CONTEXTUAL_TEACHING_SUPPORT",
    qualificationEvidenceState: "CONTEXT_ONLY",
    closestSubject: "electromagnetism",
    notes: "Task section 11: CONTEXTUAL_TEACHING_SUPPORT unless independent qualification evidence requires more. No independent evidence found requiring more -- remains context only.",
  },
  {
    reconciliationId: "SP-003",
    ac: "AC6.1",
    clusterKey: "electronic-systems-and-applications",
    proposition: "Security alarm: transistor switching (teaching support).",
    paClassification: "CONTEXTUAL_TEACHING_SUPPORT",
    qualificationEvidenceState: "CONTEXT_ONLY",
    closestSubject: "electronic components function/application: security alarms",
    notes: "Task section 12.",
  },
  {
    reconciliationId: "SP-004",
    ac: "AC6.1",
    clusterKey: "electronic-systems-and-applications",
    proposition: "Security alarm: exact NC/contact/bias topology (context only).",
    paClassification: "CONTEXTUAL_TEACHING_SUPPORT",
    qualificationEvidenceState: "CONTEXT_ONLY",
    closestSubject: "electronic components function/application: security alarms",
    notes: "Task section 12: context only unless independently supported by qualification evidence. No such evidence found.",
  },
  {
    reconciliationId: "SP-005",
    ac: "AC6.1",
    clusterKey: "electronic-systems-and-applications",
    proposition: "Telephone: capacitor performs the ringer function (calibrated representative exemplar).",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    qualificationEvidenceState: "CALIBRATED_ONLY_PUBLIC_SUPPORT_NEEDED",
    closestSubject: "electronic components function/application: telephones",
    notes:
      "Task section 12's calibrated exemplar. NOT the same content as the Source-Acquisition-Manifest's telephone cluster row (which concerns master-socket-role currency, a separate issue) -- the capacitor-to-ringer function has no dedicated technical-source-verification coverage at all in the existing dossier. Genuinely requires new technical evidence tying the capacitor component to this specific application role.",
  },
  {
    reconciliationId: "SP-006",
    ac: "AC6.1",
    clusterKey: "electronic-systems-and-applications",
    proposition: "Telephone: resistor for line testing (context/support).",
    paClassification: "CONTEXTUAL_TEACHING_SUPPORT",
    qualificationEvidenceState: "CONTEXT_ONLY",
    closestSubject: "electronic components function/application: telephones",
    notes: "Task section 12.",
  },
  {
    reconciliationId: "SP-007",
    ac: "AC6.1",
    clusterKey: "electronic-systems-and-applications",
    proposition: "Telephone: surge protector (context/support).",
    paClassification: "CONTEXTUAL_TEACHING_SUPPORT",
    qualificationEvidenceState: "CONTEXT_ONLY",
    closestSubject: "electronic components function/application: telephones",
    notes: "Task section 12.",
  },
  {
    reconciliationId: "SP-008",
    ac: "AC6.1",
    clusterKey: "electronic-systems-and-applications",
    proposition: "Telephone: master-versus-secondary socket details (context/support).",
    paClassification: "CONTEXTUAL_TEACHING_SUPPORT",
    qualificationEvidenceState: "CONTEXT_ONLY",
    closestSubject: "electronic components function/application: telephones",
    notes: "Task section 12. Matches the Source-Acquisition-Manifest cluster's own review flag: telephone-system master-socket details' currency requires independent verification before being taught as current general technical truth (SOURCE_GAP in the existing dossier).",
  },
  {
    reconciliationId: "SP-009",
    ac: "AC6.1",
    clusterKey: "electronic-systems-and-applications",
    proposition: "Telephone: legacy PSTN implementation framing (context, treat as legacy/transitional).",
    paClassification: "CONTEXTUAL_TEACHING_SUPPORT",
    qualificationEvidenceState: "CONTEXT_ONLY",
    closestSubject: "electronic components function/application: telephones",
    notes: "Task section 12.",
  },
  {
    reconciliationId: "SP-010",
    ac: "AC6.1",
    clusterKey: "electronic-systems-and-applications",
    proposition: "Light dimmer: basic timing/control relationship to delivered power (required at calibrated depth).",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    qualificationEvidenceState: "CALIBRATED_ONLY_PUBLIC_SUPPORT_NEEDED",
    closestSubject: "electronic components function/application: dimmer switches",
    notes: "Task section 12. Distinct from the base cluster row's TRIAC/DIAC component roles -- this is specifically the timing-to-delivered-power relationship, not independently evidenced in the existing dossier.",
  },
  {
    reconciliationId: "SP-011",
    ac: "AC6.1",
    clusterKey: "electronic-systems-and-applications",
    proposition: "Light dimmer: exact RC timing network (context/support).",
    paClassification: "CONTEXTUAL_TEACHING_SUPPORT",
    qualificationEvidenceState: "CONTEXT_ONLY",
    closestSubject: "electronic components function/application: dimmer switches",
    notes: "Task section 12.",
  },
  {
    reconciliationId: "SP-012",
    ac: "AC6.1",
    clusterKey: "electronic-systems-and-applications",
    proposition: "Heating control: exact transistor/relay topology (context only).",
    paClassification: "CONTEXTUAL_TEACHING_SUPPORT",
    qualificationEvidenceState: "CONTEXT_ONLY",
    closestSubject: "electronic components function/application: heating/boiler controls",
    notes: "Task section 12.",
  },
  {
    reconciliationId: "SP-013",
    ac: "AC6.1",
    clusterKey: "electronic-systems-and-applications",
    proposition: "Motor control: bridge rectifier converts AC to DC (calibrated exemplar).",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    qualificationEvidenceState: "CALIBRATED_ONLY_PUBLIC_SUPPORT_NEEDED",
    closestSubject: "electronic components function/application: motor control",
    notes:
      "Task section 12. The base cluster row covers 'rectification...at block-function level' (CONDITIONAL_SOURCE_GAP) generally, not the BRIDGE topology specifically -- 'bridge rectifier' as a named exemplar is not independently evidenced in the existing dossier.",
  },
  {
    reconciliationId: "SP-014",
    ac: "AC6.1",
    clusterKey: "electronic-systems-and-applications",
    proposition: "Motor control: exact IC implementation (out of scope).",
    paClassification: "OUT_OF_SCOPE",
    qualificationEvidenceState: "OUT_OF_SCOPE",
    closestSubject: "electronic components function/application: motor control",
    notes: "Task section 12.",
  },
  {
    reconciliationId: "SP-015",
    ac: "AC6.1",
    clusterKey: "electronic-systems-and-applications",
    proposition: "Motor control: exact protection circuitry (out of scope).",
    paClassification: "OUT_OF_SCOPE",
    qualificationEvidenceState: "OUT_OF_SCOPE",
    closestSubject: "electronic components function/application: motor control",
    notes: "Task section 12.",
  },
  {
    reconciliationId: "SP-016",
    ac: "AC6.1",
    clusterKey: "electronic-systems-and-applications",
    proposition: "Motor control: noise-suppression network (out of scope).",
    paClassification: "OUT_OF_SCOPE",
    qualificationEvidenceState: "OUT_OF_SCOPE",
    closestSubject: "electronic components function/application: motor control",
    notes: "Task section 12.",
  },
  {
    reconciliationId: "SP-017",
    ac: "AC6.1",
    clusterKey: "electronic-systems-and-applications",
    proposition: "Wireless control: Wi-Fi engineering (out of scope).",
    paClassification: "OUT_OF_SCOPE",
    qualificationEvidenceState: "OUT_OF_SCOPE",
    closestSubject: "electronic components function/application: wireless control systems",
    notes: "Task section 12.",
  },
  {
    reconciliationId: "SP-018",
    ac: "AC6.1",
    clusterKey: "electronic-systems-and-applications",
    proposition: "Wireless control: protocol stacks (out of scope).",
    paClassification: "OUT_OF_SCOPE",
    qualificationEvidenceState: "OUT_OF_SCOPE",
    closestSubject: "electronic components function/application: wireless control systems",
    notes: "Task section 12.",
  },
  {
    reconciliationId: "SP-019",
    ac: "AC6.1",
    clusterKey: "electronic-systems-and-applications",
    proposition: "Wireless control: RF-frequency design (out of scope).",
    paClassification: "OUT_OF_SCOPE",
    qualificationEvidenceState: "OUT_OF_SCOPE",
    closestSubject: "electronic components function/application: wireless control systems",
    notes: "Task section 12.",
  },
  {
    reconciliationId: "SP-020",
    ac: "AC6.1",
    clusterKey: "electronic-systems-and-applications",
    proposition: "Wireless control: IoT engineering (out of scope).",
    paClassification: "OUT_OF_SCOPE",
    qualificationEvidenceState: "OUT_OF_SCOPE",
    closestSubject: "electronic components function/application: wireless control systems",
    notes: "Task section 12.",
  },
  {
    reconciliationId: "SP-021",
    ac: "AC6.2",
    clusterKey: "electronic-components-operating-principles",
    proposition: "'photo' Range entry resolves into photodiode and LDR as separate technical concepts.",
    paClassification: "REQUIRED_QUALIFICATION_KNOWLEDGE",
    qualificationEvidenceState: "EXPLICIT_PUBLIC_CURRICULUM",
    closestSubject: "photo",
    notes:
      "Task section 13. The existing source dossier already treats these as two candidate devices (VERIFIED: 'A photo-sensitive device's behaviour depends on light -- both a photodiode and a light-dependent resistor (LDR) are candidate devices for the Range's terse photo entry'). No CandidateFactRequirement exists at all for 'photo::STATE' in the frozen qualification-pipeline evidence -- nothing to adjudicate yet; a fact requirement needs authoring, decomposed into the two named devices, from the already-verified source.",
  },
];
