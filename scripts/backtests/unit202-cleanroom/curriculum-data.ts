/**
 * CC-19R clean-room curriculum data -- Unit 202 Principles of Electrical
 * Science, City & Guilds Level 2 Diploma in Electrical Installations
 * (Buildings and Structures) (2365-02), Qualification Handbook v1-12.
 *
 * Every string in `wording`, `label`, and `raw` fields below is verbatim
 * source text (transcribed from the downloaded PDF, pages 23-29; bullet
 * characters normalized from PDF-extraction artifacts to plain "-").
 * Normalization/expansion logic lives in build-ledger.ts, NOT here --
 * this file is Layer-A raw material only.
 *
 * Source: reports/backtests/unit202-cleanroom/raw-sources/2365-02_L2_handbook_v1-12.pdf
 * SHA-256: f6bc7a6c76e37a60a9d9830f873ab1079d230015d1ad95f458d69caa82dc9515
 */

export const HANDBOOK_SOURCE_REF = "City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02) Qualification Handbook, Version 1.12";
export const HANDBOOK_SOURCE_URL =
  "https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/centre_documents/2365-02_l2_electrical_installation_qualification_handbook_v1-12-pdf.pdf";

export interface RawPerformance {
  readonly rawVerb: string;
  readonly mapped:
    | "DEFINE"
    | "STATE"
    | "DESCRIBE"
    | "EXPLAIN"
    | "IDENTIFY"
    | "RECOGNISE"
    | "DISTINGUISH"
    | "CALCULATE"
    | "APPLY"
    | "OTHER";
  readonly confidence: "EXPLICIT" | "STRONG_INFERENCE";
  readonly rationale: string;
}

export interface ExplicitChild {
  readonly subject: string;
  readonly rawWording: string;
  readonly performances?: readonly RawPerformance[];
  readonly structuralReviewNote?: string;
}

export interface RangeMember {
  readonly raw: string;
  readonly subject: string;
  readonly structuralReviewNote?: string;
}

export interface RangeGroup {
  readonly categoryLabel: string;
  readonly categorySubject: string;
  readonly breadthStatus: "ENUMERATED_COMPLETE" | "OPEN_OR_UNDERSPECIFIED" | "UNKNOWN";
  readonly refinesSubject: string;
  readonly coincidesWithParentSubject: boolean;
  readonly members: readonly RangeMember[];
  readonly memberPerformances?: readonly RawPerformance[];
  readonly pageRef: number;
}

export interface RawAC {
  readonly id: string;
  readonly loId: string;
  readonly wording: string;
  readonly pageRef: number;
  readonly performances: readonly RawPerformance[];
  readonly parentSubject?: string;
  readonly explicitChildren?: readonly ExplicitChild[];
  readonly rangeGroups?: readonly RangeGroup[];
  readonly notes?: string;
}

export interface RawLO {
  readonly id: string;
  readonly wording: string;
  readonly pageRef: number;
}

export const UNIT_202_HEADER = {
  unitId: "Unit 202",
  unitTitle: "Principles of Electrical Science",
  uan: "R/503/9937",
  level: "Level 2",
  creditValue: "10",
  glh: "89",
  aimWording:
    "The aim of this unit is to enable the candidate to know the basic principles of electrical science. This knowledge provides the foundation for electrical installations which can be applied when designing wiring systems for clients and when inspection and testing electrical installations.",
  pageRef: 25,
};

export const LEARNING_OUTCOMES: readonly RawLO[] = [
  { id: "LO1", wording: "Understand mathematical principles which are appropriate to electrical installation, maintenance and design work", pageRef: 25 },
  { id: "LO2", wording: "Understand standard units of measurement used in electrical installation, maintenance and design work", pageRef: 25 },
  { id: "LO3", wording: "Understand basic mechanics and the relationship between force, work, energy and power", pageRef: 26 },
  { id: "LO4", wording: "Understand the relationship between resistance, resistivity, voltage, current and power", pageRef: 26 },
  { id: "LO5", wording: "Understand the fundamental principles which underpin the relationship between magnetism and electricity", pageRef: 27 },
  { id: "LO6", wording: "Understand the types, applications and limitations of electronic components in electrical systems and equipment", pageRef: 28 },
];

const explicit = (rawVerb: string, mapped: RawPerformance["mapped"]): RawPerformance => ({
  rawVerb,
  mapped,
  confidence: "EXPLICIT",
  rationale: `Raw command verb "${rawVerb}" is itself the governed performance term ${mapped}; trivial grammatical normalization only (CC-19R section 11).`,
});

export const ASSESSMENT_CRITERIA: readonly RawAC[] = [
  // ---------------------------------------------------------------- LO1
  {
    id: "AC1.1",
    loId: "LO1",
    wording: "identify and apply appropriate mathematical principles which are relevant to electrical work tasks",
    pageRef: 25,
    performances: [explicit("identify", "IDENTIFY"), explicit("apply", "APPLY")],
    rangeGroups: [
      {
        categoryLabel: "Mathematical principles:",
        categorySubject: "mathematical principles",
        breadthStatus: "ENUMERATED_COMPLETE",
        refinesSubject: "mathematical principles",
        coincidesWithParentSubject: true,
        pageRef: 25,
        members: [
          { raw: "Fractions and percentages", subject: "fractions and percentages" },
          { raw: "Algebra", subject: "algebra" },
          { raw: "Indices", subject: "indices" },
          { raw: "Transposition", subject: "transposition" },
          { raw: "Triangles and trigonometry", subject: "triangles and trigonometry" },
          { raw: "Statistics", subject: "statistics" },
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- LO2
  {
    id: "AC2.1",
    loId: "LO2",
    wording: "identify and use internationally recognised base and derived (SI) units of measurement",
    pageRef: 25,
    performances: [
      explicit("identify", "IDENTIFY"),
      {
        rawVerb: "use",
        mapped: "APPLY",
        confidence: "STRONG_INFERENCE",
        rationale:
          'LOCKED CC-19R section 11.A: "use" in AC2.1 normalizes to APPLY, but is STRONG_INFERENCE (synonym mapping), never EXPLICIT. rawPerformanceWording = "use".',
      },
    ],
    rangeGroups: [
      {
        categoryLabel: "(SI) Units of measurement for:",
        categorySubject: "SI units of measurement for general physical quantities",
        breadthStatus: "ENUMERATED_COMPLETE",
        refinesSubject: "SI units of measurement for general physical quantities",
        coincidesWithParentSubject: true,
        pageRef: 25,
        members: [
          { raw: "Length", subject: "length (SI unit)" },
          { raw: "Area", subject: "area (SI unit)" },
          { raw: "Volume", subject: "volume (SI unit)" },
          { raw: "Mass", subject: "mass (SI unit)" },
          { raw: "Density", subject: "density (SI unit)" },
          { raw: "Time", subject: "time (SI unit)" },
          { raw: "Temperature", subject: "temperature (SI unit)" },
          { raw: "Velocity", subject: "velocity (SI unit)" },
        ],
      },
    ],
  },
  {
    id: "AC2.2",
    loId: "LO2",
    wording: "identify and determine values of base and derived SI units which apply specifically to electrical quantities",
    pageRef: 25,
    performances: [
      explicit("identify", "IDENTIFY"),
      {
        rawVerb: "determine values of",
        mapped: "OTHER",
        confidence: "STRONG_INFERENCE",
        rationale:
          'LOCKED CC-19R section 11.C: "determine values of ... SI units" (AC2.2) is NOT normalized to DEFINE (no semantically exact DETERMINE performance exists in the governed vocabulary) and NOT relabelled CALCULATE. Represented as OTHER. rawPerformanceWording = "determine values of".',
      },
    ],
    rangeGroups: [
      {
        categoryLabel: "Electrical quantities (SI units):",
        categorySubject: "electrical quantities (SI units)",
        breadthStatus: "ENUMERATED_COMPLETE",
        refinesSubject: "electrical quantities (SI units)",
        coincidesWithParentSubject: true,
        pageRef: 25,
        members: [
          { raw: "Resistance", subject: "resistance (SI unit)" },
          { raw: "Resistivity", subject: "resistivity (SI unit)" },
          { raw: "Power", subject: "power (SI unit)" },
          { raw: "Frequency", subject: "frequency (SI electrical quantity)" },
          { raw: "Current", subject: "current (SI unit)" },
          { raw: "Voltage", subject: "voltage (SI unit)" },
          { raw: "Energy", subject: "energy (SI unit)" },
          { raw: "Impedance", subject: "impedance (SI unit)" },
          { raw: "Inductance and inductive reactance", subject: "inductance and inductive reactance (SI unit)" },
          { raw: "Capacitance and capacitive reactance", subject: "capacitance and capacitive reactance (SI unit)" },
          { raw: "Power factor", subject: "power factor (SI unit / dimensional status)" },
        ],
      },
    ],
  },
  {
    id: "AC2.3",
    loId: "LO2",
    wording: "identify appropriate electrical instruments for the measurement of different electrical quantities",
    pageRef: 25,
    performances: [explicit("identify", "IDENTIFY")],
    parentSubject: "electrical instruments for the measurement of electrical quantities",
    rangeGroups: [
      {
        categoryLabel: "Electrical quantities (measurement):",
        categorySubject: "electrical quantities requiring instrument identification (measurement)",
        breadthStatus: "ENUMERATED_COMPLETE",
        refinesSubject: "electrical instruments for the measurement of electrical quantities",
        coincidesWithParentSubject: false,
        pageRef: 25,
        members: [
          { raw: "Resistance", subject: "instrument for measuring resistance" },
          { raw: "Power", subject: "instrument for measuring power" },
          { raw: "Current", subject: "instrument for measuring current" },
          { raw: "Voltage", subject: "instrument for measuring voltage" },
          { raw: "Energy", subject: "instrument for measuring energy" },
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- LO3
  {
    id: "AC3.1",
    loId: "LO3",
    wording: "specify what is meant by mass and weight",
    pageRef: 26,
    performances: [
      {
        rawVerb: "specify what is meant by",
        mapped: "DEFINE",
        confidence: "STRONG_INFERENCE",
        rationale:
          'LOCKED CC-19R section 11.B: "specify what is meant by" in AC3.1 normalizes to DEFINE, STRONG_INFERENCE (paraphrase, not the exact governed verb). rawPerformanceWording = "specify what is meant by".',
      },
    ],
    parentSubject: "mass and weight",
  },
  {
    id: "AC3.2",
    loId: "LO3",
    wording: "explain the principles of basic mechanics as they apply to levers, gears and pulleys",
    pageRef: 26,
    performances: [explicit("explain", "EXPLAIN")],
    parentSubject: "principles of basic mechanics as applied to levers, gears and pulleys",
    // CC-19R1 fix: "levers" is deliberately NOT listed as an explicit child
    // here (only "gears"/"pulleys" are) -- it is already created exactly
    // once below via the coincident RANGE_CATEGORY entry (categorySubject
    // "levers"). Listing it in both places produced a duplicate
    // candidateKey ("levers"::EXPLAIN twice), a genuine candidate-key
    // resolution bug caught by CC-19R1's decomposition-attempt uniqueness
    // check (task section 2 item C).
    explicitChildren: [
      { subject: "gears", rawWording: "gears" },
      { subject: "pulleys", rawWording: "pulleys" },
    ],
    rangeGroups: [
      {
        categoryLabel: "Levers:",
        categorySubject: "levers",
        breadthStatus: "ENUMERATED_COMPLETE",
        refinesSubject: "levers",
        coincidesWithParentSubject: true,
        pageRef: 27,
        members: [
          { raw: "class I", subject: "lever class I" },
          { raw: "class II", subject: "lever class II" },
          { raw: "class III", subject: "lever class III" },
        ],
      },
    ],
    notes: "No orphan 'lever-classes' parent: Range members 'class I/II/III' refine subject 'levers' directly (CC-19R section 13 locked example).",
  },
  {
    id: "AC3.3",
    loId: "LO3",
    wording:
      "describe the main principles of the following and their inter-relationships: a. force b. work c. energy (kinetic and potential) d. power e. efficiency.",
    pageRef: 26,
    performances: [explicit("describe", "DESCRIBE")],
    parentSubject: "principles of force, work, energy, power and efficiency",
    explicitChildren: [
      { subject: "force", rawWording: "a. force" },
      { subject: "work", rawWording: "b. work" },
      { subject: "energy (kinetic and potential)", rawWording: "c. energy (kinetic and potential)" },
      { subject: "power (mechanical)", rawWording: "d. power" },
      { subject: "efficiency", rawWording: "e. efficiency" },
      { subject: "inter-relationships between force, work, energy, power and efficiency", rawWording: "and their inter-relationships" },
    ],
  },
  {
    id: "AC3.4",
    loId: "LO3",
    wording: "calculate values of mechanical energy, power and efficiency",
    pageRef: 26,
    performances: [explicit("calculate", "CALCULATE")],
    parentSubject: "values of mechanical energy, power and efficiency",
    explicitChildren: [
      { subject: "mechanical energy (calculation)", rawWording: "mechanical energy" },
      { subject: "power (calculation, mechanical)", rawWording: "power" },
      { subject: "efficiency (calculation)", rawWording: "efficiency" },
    ],
  },
  // ---------------------------------------------------------------- LO4
  {
    id: "AC4.1",
    loId: "LO4",
    wording: "describe the basic principles of electron theory",
    pageRef: 26,
    performances: [explicit("describe", "DESCRIBE")],
    parentSubject: "basic principles of electron theory",
  },
  {
    id: "AC4.2",
    loId: "LO4",
    wording: "identify and distinguish between materials which are good conductors and insulators",
    pageRef: 26,
    performances: [explicit("identify", "IDENTIFY"), explicit("distinguish", "DISTINGUISH")],
    explicitChildren: [
      { subject: "conductors (good electrical conductor materials)", rawWording: "materials which are good conductors" },
      { subject: "insulators (electrical insulator materials)", rawWording: "insulators" },
    ],
    notes: "'distinguish between X and Y' structurally requires both named categories; both are EXPLICIT since the same clause/verb governs both directly.",
  },
  {
    id: "AC4.3",
    loId: "LO4",
    wording: "describe what is meant by resistance and resistivity in relation to electrical circuits",
    pageRef: 26,
    performances: [explicit("describe", "DESCRIBE")],
    parentSubject: "resistance and resistivity in relation to electrical circuits",
    notes: 'Raw command verb is literally "describe" (unlike AC3.1\'s "specify"), so EXPLICIT applies directly -- not a paraphrase case.',
  },
  {
    id: "AC4.4",
    loId: "LO4",
    wording: "explain the relationship between current, voltage and resistance in parallel and series D.C. circuits",
    pageRef: 26,
    performances: [explicit("explain", "EXPLAIN")],
    parentSubject: "relationship between current, voltage and resistance in parallel and series D.C. circuits",
  },
  {
    id: "AC4.5",
    loId: "LO4",
    wording: "calculate the values of current, voltage and resistance in parallel and series D.C. circuits",
    pageRef: 26,
    performances: [explicit("calculate", "CALCULATE")],
    parentSubject: "values of current, voltage and resistance in parallel and series D.C. circuits",
    explicitChildren: [
      { subject: "current (calculation, D.C. circuits)", rawWording: "current" },
      { subject: "voltage (calculation, D.C. circuits)", rawWording: "voltage" },
      { subject: "resistance (calculation, D.C. circuits)", rawWording: "resistance" },
    ],
    notes: "LOCKED CC-19R section 13 AC4.5: preserve relational parent AND explicit named quantity children; do NOT invent a current x series/parallel cross-product.",
  },
  {
    id: "AC4.6",
    loId: "LO4",
    wording: "calculate values of power in parallel and series D.C. circuits",
    pageRef: 26,
    performances: [explicit("calculate", "CALCULATE")],
    parentSubject: "values of power in parallel and series D.C. circuits",
  },
  {
    id: "AC4.7",
    loId: "LO4",
    wording: "state what is meant by the term voltage drop in relation to electrical circuits",
    pageRef: 26,
    performances: [explicit("state", "STATE")],
    parentSubject: "voltage drop",
    notes: 'Raw command verb is literally "state" -- EXPLICIT, not a paraphrase case (contrast with AC3.1).',
  },
  {
    id: "AC4.8",
    loId: "LO4",
    wording: "describe the chemical and thermal effects of electric currents",
    pageRef: 26,
    performances: [explicit("describe", "DESCRIBE")],
    parentSubject: "chemical and thermal effects of electric currents",
  },
  // ---------------------------------------------------------------- LO5
  {
    id: "AC5.1",
    loId: "LO5",
    wording: "describe the effects of magnetism in terms of attraction and repulsion",
    pageRef: 27,
    performances: [explicit("describe", "DESCRIBE")],
    parentSubject: "attraction and repulsion effects of magnetism",
  },
  {
    id: "AC5.2",
    loId: "LO5",
    wording: "state the difference between magnetic flux and flux density",
    pageRef: 27,
    performances: [explicit("state", "STATE")],
    parentSubject: "difference between magnetic flux and flux density",
  },
  {
    id: "AC5.3",
    loId: "LO5",
    wording:
      "describe the magnetic effects of electrical currents in terms of: a. production of a magnetic field b. force on a current-carrying conductor in a magnetic field c. electromagnetism d. electromotive force.",
    pageRef: 27,
    performances: [explicit("describe", "DESCRIBE")],
    parentSubject: "magnetic effects of electrical currents",
    explicitChildren: [
      { subject: "production of a magnetic field", rawWording: "a. production of a magnetic field" },
      { subject: "force on a current-carrying conductor in a magnetic field", rawWording: "b. force on a current-carrying conductor in a magnetic field" },
      { subject: "electromagnetism", rawWording: "c. electromagnetism" },
      { subject: "electromotive force", rawWording: "d. electromotive force" },
    ],
    notes: "LOCKED CC-19R section 13: retain each explicit lettered item as its own required member.",
  },
  {
    id: "AC5.4",
    loId: "LO5",
    wording:
      "describe the basic principles of generating an A.C. supply in terms of: a. a single-loop generator b. sine-wave c. frequency d. EMF e. magnetic flux.",
    pageRef: 27,
    performances: [explicit("describe", "DESCRIBE")],
    parentSubject: "basic principles of generating an A.C. supply",
    explicitChildren: [
      { subject: "single-loop generator", rawWording: "a. a single-loop generator" },
      { subject: "sine-wave (AC generation principle)", rawWording: "b. sine-wave" },
      { subject: "frequency (AC generation principle)", rawWording: "c. frequency" },
      { subject: "EMF (AC generation principle)", rawWording: "d. EMF" },
      { subject: "magnetic flux (AC generation principle)", rawWording: "e. magnetic flux" },
    ],
    notes: "LOCKED CC-19R section 13: retain each explicit lettered item as its own required member.",
  },
  {
    id: "AC5.5",
    loId: "LO5",
    wording: "identify the characteristics of sine-waves",
    pageRef: 27,
    performances: [explicit("identify", "IDENTIFY")],
    rangeGroups: [
      {
        categoryLabel: "Characteristics of a sine-wave:",
        categorySubject: "characteristics of sine-waves",
        breadthStatus: "ENUMERATED_COMPLETE",
        refinesSubject: "characteristics of sine-waves",
        coincidesWithParentSubject: true,
        pageRef: 27,
        members: [
          { raw: "Root Mean Square (RMS) value", subject: "RMS value (sine-wave characteristic)" },
          { raw: "Average value", subject: "average value (sine-wave characteristic)" },
          { raw: "Peak to peak value", subject: "peak to peak value (sine-wave characteristic)" },
          { raw: "Periodic time", subject: "periodic time (sine-wave characteristic)" },
          { raw: "Frequency", subject: "frequency (sine-wave characteristic)" },
          { raw: "Amplitude", subject: "amplitude (sine-wave characteristic)" },
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- LO6
  {
    id: "AC6.1",
    loId: "LO6",
    wording: "describe the function and application of electronic components that are used in electrical systems",
    pageRef: 27,
    performances: [explicit("describe", "DESCRIBE")],
    parentSubject: "function and application of electronic components used in electrical systems",
    rangeGroups: [
      {
        categoryLabel: "Electrical systems:",
        categorySubject: "electrical systems (context for electronic component function/application)",
        breadthStatus: "ENUMERATED_COMPLETE",
        refinesSubject: "function and application of electronic components used in electrical systems",
        coincidesWithParentSubject: false,
        pageRef: 27,
        members: [
          { raw: "Security alarms", subject: "electronic components function/application: security alarms" },
          { raw: "Telephones", subject: "electronic components function/application: telephones" },
          { raw: "Dimmer switches", subject: "electronic components function/application: dimmer switches" },
          { raw: "Heating/boiler controls", subject: "electronic components function/application: heating/boiler controls" },
          { raw: "Motor control", subject: "electronic components function/application: motor control" },
          { raw: "Wireless control systems", subject: "electronic components function/application: wireless control systems" },
        ],
      },
    ],
    notes: "LOCKED CC-19R section 13: retain every explicit Range member separately.",
  },
  {
    id: "AC6.2",
    loId: "LO6",
    wording: "state the basic operating principles of electronic components and devices",
    pageRef: 27,
    performances: [explicit("state", "STATE")],
    parentSubject: "basic operating principles of electronic components and devices",
    rangeGroups: [
      {
        categoryLabel: "Electronic components and devices:",
        categorySubject: "electronic components and devices",
        breadthStatus: "ENUMERATED_COMPLETE",
        refinesSubject: "basic operating principles of electronic components and devices",
        coincidesWithParentSubject: false,
        pageRef: 27,
        members: [
          { raw: "Capacitors", subject: "capacitors" },
          { raw: "Resistors", subject: "resistors" },
          { raw: "Rectifiers", subject: "rectifiers" },
          { raw: "Diodes", subject: "diodes" },
          {
            raw: "Zener",
            subject: "Zener",
            structuralReviewNote:
              "CC-19R section 15: printed layout (page 29) is a genuinely flat bulleted list -- 'Zener' carries no visual/textual nesting under 'Diodes'. Represented as its own required member. Any 'Zener diode' subtype relationship is REVIEW_PROPOSED, not asserted.",
          },
          { raw: "LED", subject: "LED" },
          {
            raw: "photo",
            subject: "photo",
            structuralReviewNote:
              "CC-19R section 15: printed layout (page 29) shows 'photo' as its own flat bullet, same indentation as all siblings -- no nesting under 'Diodes' or 'LED'. Verbatim raw term preserved as printed ('photo'). Any expansion (e.g. photodiode/phototransistor) is REVIEW_PROPOSED, not asserted.",
          },
          { raw: "Thermistors", subject: "thermistors" },
          { raw: "Diacs", subject: "diacs" },
          { raw: "Triacs", subject: "triacs" },
          { raw: "Transistors", subject: "transistors" },
          { raw: "Thyristors", subject: "thyristors" },
          { raw: "Invertors", subject: "invertors" },
        ],
      },
    ],
    notes: "LOCKED CC-19R section 13/15: retain every explicit Range member separately; Zener/photo structural ambiguity handled per section 15.",
  },
];
