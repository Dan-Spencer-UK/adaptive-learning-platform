/**
 * CC-14: the approved Unit 202 Depth & Performance Matrix, encoded as
 * governed `DepthPerformanceMatrix` data.
 *
 * AUTHORITY BOUNDARY (docs/governance/ROLES-AND-AUTHORITY.md, "C&G
 * depth-inference and the Unit 202 Depth & Performance Matrix are Product
 * Owner / Project Architect decisions"): every substantive depth/
 * performance/scope judgment in this file -- required learner performance,
 * required depth dimensions, supporting-knowledge scope, scope ceilings,
 * confidence, matrix status, and every review flag -- was authored by the
 * Project Architect/ChatGPT and approved by the Product Owner in the
 * source document `unit202-depth-performance-matrix.md` (2026-08-30
 * session). Claude Code performed the mechanical encoding only: it did not
 * decide, narrow, expand, resolve or reinterpret any depth/performance/
 * scope judgment, and it did not resolve any review flag from its own
 * knowledge. Where the source document's own text used a mojibake-corrupted
 * encoding of standard symbols (Ω, ², Φ, ρ, √, °, →, en/em dashes -- an
 * artefact of how the source file was transferred, not a content
 * difference), this encoding normalises the symbol to its correct Unicode
 * character; no wording, judgment or number was altered by that
 * normalisation.
 *
 * This is a course-specific DEPTH/PERFORMANCE specification, not a
 * technical knowledge corpus, not a lesson, and not a storyboard (see
 * docs/architecture/SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md
 * §4.3). Technical/factual claims implied by `requiredSupportingKnowledge`
 * remain UNVERIFIED until a later, separately-reviewed source-acquisition
 * package supports them with an authoritative external reference (see
 * ./unit202-source-acquisition-manifest.ts, derived from this file) --
 * existing Unit 202 assertions/capabilities/lessons are never treated as
 * that verification, and this file does not verify anything itself.
 *
 * Per the source document's own evidence-hierarchy section: "LLM internal
 * knowledge is never source-of-truth provenance. Existing ALP assertions/
 * capabilities/lessons were not used to decide this matrix." -- recorded
 * here verbatim because the `evidenceHierarchy` field below only carries
 * the five ranked tiers, not this governing caveat about them.
 *
 * The assessment envelope/conditions below are DERIVED from the existing
 * governed `unit202AssessmentSpecification`
 * (./unit202-assessment-specification.ts) rather than re-typed as a
 * second, independently-editable copy of the same official numbers --
 * `validate-unit202-depth-performance-matrix.test.ts` cross-checks the
 * two stay identical.
 */

import type { DepthPerformanceMatrix } from "@alp/content-schema";

import { unit202AssessmentSpecification } from "./unit202-assessment-specification.ts";

const spec = unit202AssessmentSpecification.specifications[0];
if (!spec) {
  throw new Error("unit202DepthPerformanceMatrix: unit202AssessmentSpecification has no specification to derive the assessment envelope from");
}
if (spec.approximatePassPercentage === undefined) {
  throw new Error(
    "unit202DepthPerformanceMatrix: unit202AssessmentSpecification's specification has no approximatePassPercentage to derive assessmentConditions from",
  );
}
const approxPassPercentage = spec.approximatePassPercentage;

export const unit202DepthPerformanceMatrix: DepthPerformanceMatrix = {
  qualificationCode: "2365-02",
  qualificationTitle: "City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures)",
  unitNumber: "202",
  unitTitle: "Principles of Electrical Science",

  governingDepthDecision:
    "For C&G exam-support packages, teach the minimum depth of understanding required for a learner to " +
    "handle the full legitimate range of syllabus-valid assessment questions robustly, including " +
    "unfamiliar variations. This is deeper than the shortest AC-satisfying answer but shall not expand " +
    "into the depth of a full college course without evidence. Unit 202 is a learning-support / " +
    "exam-preparation package used alongside college tuition. This matrix does not attempt to replace " +
    "full qualification delivery or practical competence.",

  evidenceHierarchy: [
    { rank: 1, name: "Current C&G handbook/syllabus", role: "Curriculum and examinable-scope authority." },
    { rank: 2, name: "C&G Range", role: "Mandatory breadth." },
    { rank: 3, name: "C&G handouts / learner worksheets / tutor answers", role: "Depth and expected-performance calibration only." },
    {
      rank: 4,
      name: "Public sample assessment evidence",
      role: "Assessment style/cognitive-demand calibration only; absence from a sample never removes syllabus scope.",
    },
    { rank: 5, name: "Independent authoritative technical references", role: "Factual/technical truth, to be acquired in the next stage." },
  ],

  // Derived from the existing governed AssessmentSpecificationManifest --
  // never a second hand-typed copy of the same official numbers.
  assessmentEnvelope: spec.outcomeAllocations.map((a) => ({
    loNumber: a.outcomeNumber,
    approxQuestionCount: a.questionCount,
    weightPercent: a.questionPercentage,
  })),
  assessmentConditions: {
    durationMinutes: spec.durationMinutes,
    closedBook: spec.permittedMaterials.closedBook,
    calculator: spec.permittedMaterials.calculator,
    totalQuestionCount: spec.totalQuestionCount,
    approxPassPercentage,
    handbookVersion: "v1.12",
  },

  reusableKnowledgePrinciple:
    "The resulting governed knowledge should normally be reusable domain knowledge with course/unit " +
    "mappings, not Unit-202-owned duplicates.",

  nextProductionGate:
    "Do not author lessons from this matrix yet. First convert the required-supporting-knowledge " +
    "entries into a technical-source acquisition plan and find suitable authoritative/public references. " +
    "The resulting governed knowledge should normally be reusable domain knowledge with course/unit " +
    "mappings, not Unit-202-owned duplicates.",

  sourceReferences: [
    {
      title: "Current C&G qualification handbook v1.12",
      url:
        "https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/centre_documents/2365-02_l2_electrical_installation_qualification_handbook_v1-12-pdf.pdf",
    },
    {
      title: "C&G 2365 qualification page",
      url: "https://www.cityandguilds.com/qualifications-and-apprenticeships/building-services-industry/electrical-installation/2365-electrotechnical-craft",
    },
    {
      title: "Public mirror of C&G/SmartScreen Sample B (calibration only)",
      url: "https://pdfcoffee.com/2365-202-sample-questions-b-answers-pdf-free.html",
    },
    {
      title: "Public mirror of C&G/SmartScreen Sample A (calibration only)",
      url: "https://www.scribd.com/document/636018535/2365-202-Mock-Paper-1",
    },
    {
      title:
        "User-supplied official C&G SmartScreen evidence: 18 handouts, 18 learner worksheets, 18 tutor-answer worksheets, and the Unit 202 sample scheme of work.",
    },
  ],

  authorship: {
    substantiveAuthor: "Project Architect / ChatGPT",
    implementerRoleNote: "Claude Code did not author the matrix; Claude Code performed mechanical encoding, validation and mapping-trace only.",
    approvalStatus: "APPROVED",
    approvedBy: "Product Owner",
    approvedDate: "2026-08-30",
    documentHeaderStatusAsAuthored: "PROPOSED FOR PRODUCT OWNER APPROVAL",
  },

  assessmentCriteria: [
    // ---------------------------------------------------------------
    // LO1 -- Understand mathematical principles appropriate to
    // electrical installation, maintenance and design work
    // ---------------------------------------------------------------
    {
      acNumber: "1.1",
      loNumber: 1,
      title: "Identify and apply appropriate mathematical principles which are relevant to electrical work tasks.",
      officialRangeSummary: "Fractions and percentages; algebra; indices; transposition; triangles and trigonometry; statistics.",
      requiredLearnerPerformance:
        "Select and apply the appropriate Level-2 mathematical method in an unfamiliar electrical-work context; rearrange formulae " +
        "to isolate an unknown (including square/root forms); solve right-triangle problems; use percentages/fractions and " +
        "descriptive statistics accurately.",
      requiredDepthDimensions: ["Procedural", "Calculation", "Application", "Integration"],
      requiredSupportingKnowledge:
        "Fractions/decimals/percentages and proportional reasoning; algebraic substitution; powers, roots and " +
        "scientific/engineering notation; formula transposition; Pythagoras; sin/cos/tan for right triangles; range/mean/median/mode; " +
        "calculator use; unit consistency.",
      visualRepresentationRequirement: "Right-triangle diagrams; worked formula transformations; progressive worked examples.",
      calculationProcedureRequirement:
        "Direct and rearranged formulae; roots/squares; percentage; trigonometry; descriptive statistics. Formulae from electrical " +
        "science may be used as mathematical operands without implying deeper AC theory.",
      cgTeachingWorksheetCalibration: "Handout 2; Worksheet 2/tutor answers: transposition of P=IV, P=V²/R, pf=R/Z, Z=√(R²+XL²).",
      publicSampleAssessmentCalibration: "Sample A: formula transposition and cosine; Sample B: percentage and mean.",
      scopeCeiling:
        "No calculus, complex numbers, advanced trigonometry, proof-based algebra, or deeper electrical theory solely because its " +
        "formula appears in a maths exercise.",
      confidence: "HIGH",
      matrixStatus: "LOCKED",
    },

    // ---------------------------------------------------------------
    // LO2 -- Understand standard units of measurement used in
    // electrical installation, maintenance and design work
    // ---------------------------------------------------------------
    {
      acNumber: "2.1",
      loNumber: 2,
      title: "Identify and use internationally recognised base and derived (SI) units of measurement.",
      officialRangeSummary: "Length; area; volume; mass; density; time; temperature; velocity.",
      requiredLearnerPerformance:
        "Correctly map each required physical quantity to its SI unit/symbol and use it in calculations, including the ordinary " +
        "conversions required by Unit 202 problems.",
      requiredDepthDimensions: ["Recall/Recognition", "Application", "Calculation-support"],
      requiredSupportingKnowledge:
        "Metre (m); square metre (m²); cubic metre (m³); kilogram (kg); kilogram per cubic metre (kg/m³); second (s); kelvin (K) as " +
        "SI temperature unit, with °C recognised as common practical temperature scale; metre per second (m/s); common metric " +
        "prefixes/conversions used elsewhere in the unit.",
      visualRepresentationRequirement: "Simple quantity-unit tables; dimensional callouts beside worked examples.",
      calculationProcedureRequirement: "Unit conversion where needed (e.g. mm→m, mm²→m², minutes→seconds).",
      cgTeachingWorksheetCalibration: "Handout 1 SI table.",
      publicSampleAssessmentCalibration: "Sample A tests kelvin; Sample B tests seconds.",
      scopeCeiling: "No formal dimensional-analysis course and no unnecessary SI derivations.",
      confidence: "HIGH",
      matrixStatus: "LOCKED_WITH_CORRECTION",
      reviewFlag:
        "C&G Handout 1 lists °C as the temperature entry; public sample A tests kelvin. Technical source acquisition must use " +
        "authoritative SI definitions rather than propagate the handout table uncritically.",
    },
    {
      acNumber: "2.2",
      loNumber: 2,
      title: "Identify and determine values of base and derived SI units which apply specifically to electrical quantities.",
      officialRangeSummary:
        "Resistance; resistivity; power; frequency; current; voltage; energy; impedance; inductance and inductive reactance; " +
        "capacitance and capacitive reactance; power factor.",
      requiredLearnerPerformance:
        "Recognise each required electrical quantity, its conventional formula symbol and its SI unit; distinguish quantities that " +
        "share a unit; interpret/convert straightforward numerical values and prefixes.",
      requiredDepthDimensions: ["Recall/Recognition", "Conceptual distinction", "Application"],
      requiredSupportingKnowledge:
        "R→Ω; resistivity ρ→Ω·m; P→W; f→Hz; I→A; V→V; E/W→J; Z→Ω; L→H and XL→Ω; C→F and XC→Ω; power factor as dimensionless. " +
        "Enough meaning to distinguish each quantity, not merely memorise a list.",
      visualRepresentationRequirement: "Quantity/symbol/unit comparison table; paired distinctions (R vs ρ, L vs XL, C vs XC).",
      calculationProcedureRequirement:
        "Simple conversions/value interpretation. AC1.1 may use Z, XL or pf formulae as transposition exercises, but this AC does " +
        "not by itself require full impedance/reactance/power-factor circuit calculations.",
      cgTeachingWorksheetCalibration: "Handout 1 quantity/symbol/unit table; Handout 2 formula appendix only as supporting maths context.",
      publicSampleAssessmentCalibration: "Sample A tests impedance unit, XL symbol, energy unit; Sample B tests resistivity unit, voltage unit, capacitance unit.",
      scopeCeiling:
        "Do not infer Level-3 AC circuit analysis, phase-angle work, reactance formula calculations, or power-factor calculations " +
        "from the Range list alone.",
      confidence: "HIGH",
      matrixStatus: "LOCKED_WITH_SCOPE_GUARD",
      reviewFlag: "Important anti-overdepth guard. Handout 2's formula appendix contains material beyond what the direct 2.2 assessment evidence establishes.",
    },
    {
      acNumber: "2.3",
      loNumber: 2,
      title: "Identify appropriate electrical instruments for the measurement of different electrical quantities.",
      officialRangeSummary: "Resistance; power; current; voltage; energy.",
      requiredLearnerPerformance:
        "Choose the correct instrument for each quantity and recognise the basic connection topology needed to obtain the " +
        "measurement safely and meaningfully.",
      requiredDepthDimensions: ["Recall/Recognition", "Visual/Spatial", "Procedural", "Application"],
      requiredSupportingKnowledge:
        "Ohmmeter/resistance measurement and de-energised-circuit requirement; ammeter in series and low internal resistance; " +
        "voltmeter in parallel and high internal resistance; wattmeter current/voltage measuring paths at basic level; energy meter " +
        "and kWh context.",
      visualRepresentationRequirement: "Circuit diagrams showing correct ammeter, voltmeter and wattmeter placement; energy-meter context.",
      calculationProcedureRequirement: "Energy-meter/kWh arithmetic is useful supporting practice but not the defining depth of AC2.3.",
      cgTeachingWorksheetCalibration: "Handout 8; Worksheet 8 requires ammeter/voltmeter/wattmeter connection diagrams and combined metering arrangement.",
      publicSampleAssessmentCalibration: "Sample A asks power instrument; Sample B asks resistance instrument.",
      scopeCeiling: "No meter calibration theory, internal instrument design, CAT-rating syllabus extension, or advanced three-phase metering.",
      confidence: "HIGH",
      matrixStatus: "LOCKED",
      reviewFlag: "Worksheet 8 clearly raises expected teaching depth above simple instrument-name recall by requiring diagrammatic connections.",
    },

    // ---------------------------------------------------------------
    // LO3 -- Understand basic mechanics and the relationship between
    // force, work, energy and power
    // ---------------------------------------------------------------
    {
      acNumber: "3.1",
      loNumber: 3,
      title: "Specify what is meant by mass and weight.",
      requiredLearnerPerformance:
        "Distinguish mass from weight, use correct units, explain why mass is invariant while weight depends on gravitational field " +
        "strength, and perform simple mass-weight calculations needed elsewhere in the unit.",
      requiredDepthDimensions: ["Conceptual", "Relational", "Calculation-support", "Application"],
      requiredSupportingKnowledge:
        "Mass = amount of matter (kg); weight = force due to gravity (N); g≈9.81 m/s² on Earth; W=mg and rearrangement; " +
        "gravitational field changes weight not mass.",
      visualRepresentationRequirement: "Earth/Moon comparison; mass-vs-weight visual comparison.",
      calculationProcedureRequirement: "W=mg and m=W/g. Calculation competence is shared with AC3.4.",
      cgTeachingWorksheetCalibration: "Handout 14; Worksheet 14 calculates weight from mass and mass from weight under Earth/Moon gravity.",
      publicSampleAssessmentCalibration: "Sample B includes mass-from-force calculation under LO3.",
      scopeCeiling: "No gravitation theory, orbital mechanics or general field equations.",
      confidence: "HIGH",
      matrixStatus: "LOCKED",
      reviewFlag: "The command verb 'specify' understates the worksheet depth; Worksheet 14 requires calculations in both directions.",
    },
    {
      acNumber: "3.2",
      loNumber: 3,
      title: "Explain the principles of basic mechanics as they apply to levers, gears and pulleys.",
      officialRangeSummary: "Levers: Class I; Class II; Class III.",
      requiredLearnerPerformance:
        "Recognise/classify lever arrangements and examples; reason about effort/load/fulcrum; solve simple lever balance problems; " +
        "determine basic gear ratio, driven speed/direction and tooth-count relationships; determine simple pulley mechanical " +
        "advantage/effort and explain the force-distance trade-off.",
      requiredDepthDimensions: ["Conceptual", "Relational", "Visual/Spatial", "Calculation", "Application"],
      requiredSupportingKnowledge:
        "Lever classes; effort/load/fulcrum; moments/turning effect and F×distance balance; mechanical advantage; driver/driven " +
        "gears, teeth ratio, speed ratio and direction; idler effect; pulley supporting strands and ideal MA; ideal machines trade " +
        "force for distance rather than create power.",
      visualRepresentationRequirement: "Class I/II/III diagrams; driver/driven gear diagrams; pulley systems with supporting strands and force/distance.",
      calculationProcedureRequirement: "Lever effort/load/distance; gear tooth/speed ratios; simple pulley effort from MA.",
      cgTeachingWorksheetCalibration: "Handout 16 levers/gears/pulleys; Worksheet 16 lever calculations.",
      publicSampleAssessmentCalibration: "Sample A tests lever class, lever effort, gear speed, pulley effort; Sample B tests lever class, pulley MA and gear ratio.",
      scopeCeiling: "No detailed machine design, gear geometry, friction modelling or complex block-and-tackle analysis.",
      confidence: "HIGH",
      matrixStatus: "LOCKED_WITH_CORRECTION",
      reviewFlag:
        "C&G Handout 16 says gearing can provide 'twice as much power' at the slower gear. This is not acceptable technical truth; " +
        "authoritative sourcing must teach the correct torque/speed/power relationship.",
    },
    {
      acNumber: "3.3",
      loNumber: 3,
      title:
        "Describe the main principles of force, work, energy (kinetic and potential), power and efficiency, and their " +
        "interrelationships.",
      requiredLearnerPerformance:
        "Explain how force, work, energy, power and efficiency relate; distinguish kinetic from potential energy at the required " +
        "Level-2 conceptual depth; recognise losses and the relationship between input and output.",
      requiredDepthDimensions: ["Conceptual", "Causal/Mechanistic", "Relational", "Application"],
      requiredSupportingKnowledge:
        "Force as push/pull and effects on motion/deformation/equilibrium; force due to gravity; work when force causes " +
        "displacement; work/energy equivalence; kinetic vs potential energy concepts; power as rate of doing work; efficiency as " +
        "output/input; losses.",
      visualRepresentationRequirement: "Energy/work flow diagrams; input→useful output+losses; kinetic vs potential examples.",
      calculationProcedureRequirement: "Formulae may illustrate the relationships, but calculation mastery is governed by AC3.4.",
      cgTeachingWorksheetCalibration: "Handout 15 explains force/work/energy/power/efficiency.",
      publicSampleAssessmentCalibration: "Sample A tests work formula; Sample B tests force as mass×gravity.",
      scopeCeiling:
        "Do not add general Newtonian mechanics, vector work or the kinetic-energy formula ½mv² unless later assessment/source " +
        "evidence specifically requires it.",
      confidence: "HIGH",
      matrixStatus: "LOCKED",
      reviewFlag:
        "Potential-energy calculation is effectively exercised through work done against gravity; quantitative kinetic-energy depth " +
        "is not established by the C&G evidence reviewed.",
    },
    {
      acNumber: "3.4",
      loNumber: 3,
      title: "Calculate values of mechanical energy, power and efficiency.",
      requiredLearnerPerformance:
        "Solve unfamiliar but Level-2 multi-step mechanical calculations, select/rearrange the required relationships, maintain " +
        "units, and combine mass/weight, work/energy, time and efficiency where necessary.",
      requiredDepthDimensions: ["Calculation", "Procedural", "Application", "Integration"],
      requiredSupportingKnowledge:
        "F=mg; work/energy=F×d; power=work/time; efficiency=(useful output/input)×100%; input=output+losses; unit/time " +
        "conversions; kW/W; simple volume/mass contexts when data are provided; linked motor/pump efficiency problems.",
      visualRepresentationRequirement: "Worked multi-step problem maps; unit-flow annotations.",
      calculationProcedureRequirement:
        "Direct/rearranged and multi-step calculations, including chained efficiency examples at the level of Worksheet 15 and " +
        "simple lever/gear/pulley computations where assessment evidence integrates them.",
      cgTeachingWorksheetCalibration:
        "Worksheet 15 has 17 multi-step work/power/efficiency problems including pump/motor chains; Worksheets 14/16 support " +
        "linked mechanics.",
      publicSampleAssessmentCalibration: "Sample A/B test mass/force, power, efficiency and simple machines.",
      scopeCeiling: "No advanced dynamics, fluid mechanics or energy equations not evidenced by Level-2 requirements.",
      confidence: "HIGH",
      matrixStatus: "LOCKED",
      reviewFlag: "Public sample question labels sometimes blur AC3.2/3.4 boundaries; the matrix follows substantive performance rather than trusting sample labels mechanically.",
    },

    // ---------------------------------------------------------------
    // LO4 -- Understand the relationship between resistance,
    // resistivity, voltage, current and power
    // ---------------------------------------------------------------
    {
      acNumber: "4.1",
      loNumber: 4,
      title: "Describe the basic principles of electron theory.",
      requiredLearnerPerformance:
        "Describe the charge structure needed to understand metallic conduction; explain free-electron movement/current in a " +
        "closed circuit; distinguish electron-flow direction from conventional-current direction.",
      requiredDepthDimensions: ["Recall/Recognition", "Conceptual", "Causal/Mechanistic", "Visual/Spatial"],
      requiredSupportingKnowledge:
        "Protons positive, electrons negative, neutrons neutral at basic level; nucleus/outer electrons; neutral atoms and simple " +
        "charge imbalance; loosely bound/free electrons in metals; closed-circuit requirement; EMF/potential difference as the " +
        "driver; electron flow −→+ and conventional current +→−.",
      visualRepresentationRequirement: "Simple atom model; conductor/free-electron model; persistent circuit with opposite electron/conventional-current arrows.",
      calculationProcedureRequirement: "None intrinsic.",
      cgTeachingWorksheetCalibration: "Handout 1 electron theory; Worksheet 1 asks atom parts/charge, electron-flow direction, conventional current.",
      publicSampleAssessmentCalibration: "Sample A tests charges; Sample B tests current as electron movement in closed circuit.",
      scopeCeiling: "No quantum mechanics, band theory, drift-velocity calculation or detailed atomic physics.",
      confidence: "HIGH",
      matrixStatus: "LOCKED",
      reviewFlag: "The visual teaching should explicitly resolve the electron-flow/conventional-current apparent contradiction rather than present two disconnected facts.",
    },
    {
      acNumber: "4.2",
      loNumber: 4,
      title: "Identify and distinguish between materials which are good conductors and insulators.",
      requiredLearnerPerformance:
        "Classify common materials as conductors/insulators and explain the distinction using availability/binding of charge " +
        "carriers at the basic electron-theory level.",
      requiredDepthDimensions: ["Recall/Recognition", "Conceptual", "Application"],
      requiredSupportingKnowledge:
        "Good conductors generally have readily available/free electrons; insulators tightly bind outer electrons and present high " +
        "resistance; common metal/non-metal examples; practical recognition (e.g. copper/tungsten vs porcelain/glass/plastics).",
      visualRepresentationRequirement: "Material comparison panels; electron-binding concept illustration.",
      calculationProcedureRequirement: "None required here.",
      cgTeachingWorksheetCalibration: "Handout 1 conductors/insulators; Worksheet 1 context.",
      publicSampleAssessmentCalibration: "Sample B tests porcelain, electron binding in insulators, tungsten as conductor.",
      scopeCeiling: "No semiconductor band diagrams or quantitative conductivity/resistivity analysis under this AC.",
      confidence: "HIGH",
      matrixStatus: "LOCKED",
    },
    {
      acNumber: "4.3",
      loNumber: 4,
      title: "Describe what is meant by resistance and resistivity in relation to electrical circuits.",
      requiredLearnerPerformance:
        "Distinguish resistance from material resistivity; explain how conductor material, length and cross-sectional area affect " +
        "resistance; solve R=ρL/A problems for any simple unknown and integrate the result into cable voltage-drop contexts.",
      requiredDepthDimensions: ["Conceptual", "Relational", "Calculation", "Application", "Integration"],
      requiredSupportingKnowledge:
        "Resistance R (Ω); resistivity ρ as material property (Ω·m); R=ρL/A and rearrangements; R∝L, R∝1/A; material comparison " +
        "(e.g. copper/aluminium); correct area/length unit conversions; twin-path length where explicitly relevant.",
      visualRepresentationRequirement: "Conductor diagrams varying material, length and CSA; proportionality comparisons.",
      calculationProcedureRequirement: "R, ρ, L or A; mm²→m²; provided resistivity data; combine with V=IR where a cable-voltage problem requires it.",
      cgTeachingWorksheetCalibration: "Handout 7 Resistivity; Worksheet 7 has extensive R=ρL/A, material/length/CSA and cable-drop calculations.",
      publicSampleAssessmentCalibration: "Sample B tests CSA from R/ρ/L, copper-aluminium comparison and conductor length.",
      scopeCeiling: "No temperature-coefficient modelling, microscopic resistivity derivation or materials-science depth unless separately evidenced.",
      confidence: "HIGH",
      matrixStatus: "LOCKED_WITH_CORRECTION",
      reviewFlag:
        "C&G Handout/Worksheet 7 print erroneous resistivity-unit forms such as ohm/metre³. Technical sourcing must use Ω·m and " +
        "correct dimensional treatment.",
    },
    {
      acNumber: "4.4",
      loNumber: 4,
      title: "Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits.",
      requiredLearnerPerformance:
        "Explain Ohm's-law relationships and how current, voltage and equivalent resistance behave differently in simple series and " +
        "simple parallel DC circuits; reason qualitatively about changes before calculating.",
      requiredDepthDimensions: ["Conceptual", "Relational", "Visual/Spatial", "Application"],
      requiredSupportingKnowledge:
        "Ohm's law V=IR (for an ohmic conductor under stated/appropriate conditions); series: same current, voltage shares, " +
        "resistances add; parallel: same branch voltage, currents divide/add, equivalent resistance below smallest branch; basic " +
        "KVL/KCL conservation ideas.",
      visualRepresentationRequirement: "Series/parallel circuit diagrams with persistent current/voltage annotations; qualitative change comparisons.",
      calculationProcedureRequirement: "Illustrative calculations support explanation; full computation is governed by AC4.5.",
      cgTeachingWorksheetCalibration: "Handout 3 Ohm's law plus conceptual series/parallel rules in Handouts 4/5.",
      publicSampleAssessmentCalibration: "Public samples include qualitative/relationship tasks but printed AC tags sometimes blur 4.3-4.5.",
      scopeCeiling: "No network theorems, complex mixed networks or transient circuit theory.",
      confidence: "HIGH",
      matrixStatus: "LOCKED",
      reviewFlag: "Some sample-question labels blur 4.3/4.4/4.5; use the actual task semantics, not the printed tag, to define depth.",
    },
    {
      acNumber: "4.5",
      loNumber: 4,
      title: "Calculate the values of current, voltage and resistance in parallel and series D.C. circuits.",
      requiredLearnerPerformance:
        "Calculate total/branch resistance, current and voltage in pure series and pure parallel DC circuits; find unknown " +
        "component values; solve multi-step problems and verify simple Kirchhoff voltage/current relationships.",
      requiredDepthDimensions: ["Calculation", "Procedural", "Visual/Spatial", "Application", "Integration"],
      requiredSupportingKnowledge:
        "Series Rt=ΣR; parallel 1/Rt=Σ(1/R); two-resistor product/sum as useful shortcut; V=IR; series current rule; parallel " +
        "voltage rule; KVL and KCL at simple level; unit prefixes.",
      visualRepresentationRequirement: "Circuit diagrams where values are progressively solved and retained.",
      calculationProcedureRequirement:
        "Unknown R/I/V; branch currents; voltage drops; total current; equivalent resistance; equal-resistor shortcuts; simple " +
        "combined use of Ohm/Kirchhoff relationships.",
      cgTeachingWorksheetCalibration: "Handouts 4/5; Worksheets 4/5 include total R, branch/current, voltage drop, unknown values and KVL/KCL.",
      publicSampleAssessmentCalibration: "Sample A tests series/parallel R and current; Sample B tests parallel R and missing series voltage.",
      scopeCeiling: "Do not require complex series-parallel reduction, bridge circuits, simultaneous equations or network theorems unless new C&G evidence establishes them.",
      confidence: "HIGH",
      matrixStatus: "LOCKED",
    },
    {
      acNumber: "4.6",
      loNumber: 4,
      title: "Calculate values of power in parallel and series D.C. circuits.",
      requiredLearnerPerformance:
        "Select and use the appropriate DC power relationship to calculate power for individual components, whole circuits and " +
        "resistive losses, including rearrangement and multi-step series/parallel contexts.",
      requiredDepthDimensions: ["Calculation", "Procedural", "Application", "Integration"],
      requiredSupportingKnowledge: "P=VI; P=I²R; P=V²/R; rearrangements; individual vs total power; cable/joint resistive loss; W/kW and A/mA conversions.",
      visualRepresentationRequirement: "Circuit diagrams with power traced component-by-component; formula-choice worked examples.",
      calculationProcedureRequirement: "Direct and rearranged P/V/I/R problems; individual and total power in simple series/parallel circuits.",
      cgTeachingWorksheetCalibration: "Handout 6; Worksheet 6 uses P=VI, I²R, V²/R in component/cable contexts.",
      publicSampleAssessmentCalibration: "Sample A tests total circuit/heater power.",
      scopeCeiling: "No AC real/reactive/apparent power or power-factor calculations under AC4.6.",
      confidence: "HIGH",
      matrixStatus: "LOCKED",
    },
    {
      acNumber: "4.7",
      loNumber: 4,
      title: "State what is meant by the term voltage drop in relation to electrical circuits.",
      requiredLearnerPerformance:
        "Define voltage drop, calculate it from current and circuit/cable resistance, and explain its practical consequence for " +
        "the voltage available at the load.",
      requiredDepthDimensions: ["Conceptual", "Relational", "Calculation", "Application"],
      requiredSupportingKnowledge:
        "Voltage developed across resistance Vdrop=IR; supply voltage allocation; cable/conductor resistance; load-terminal " +
        "voltage = supply minus upstream drops in simple cases; excessive resistance causes inadequate load voltage.",
      visualRepresentationRequirement: "Supply-cable-load diagram showing voltage allocation.",
      calculationProcedureRequirement: "Vdrop=IR and simple supply/load subtraction; integration with resistivity calculations where data require it.",
      cgTeachingWorksheetCalibration: "Handouts 3/4/7; Worksheets 3 and 7 include voltage-drop calculations and load-terminal voltage.",
      publicSampleAssessmentCalibration: "Sample A directly calculates cable voltage drop; Sample B tests consequence of high cable resistance.",
      scopeCeiling: "Do not import BS 7671 permitted voltage-drop limits or installation-design rules into Unit 202 merely because percentage voltage drop appears in maths examples.",
      confidence: "HIGH",
      matrixStatus: "LOCKED",
    },
    {
      acNumber: "4.8",
      loNumber: 4,
      title: "Describe the chemical and thermal effects of electric currents.",
      requiredLearnerPerformance:
        "Describe what thermal and chemical effects are, identify common uses/consequences, and discriminate which effect " +
        "explains a simple device or process.",
      requiredDepthDimensions: ["Recall/Recognition", "Conceptual", "Causal/Mechanistic", "Application"],
      requiredSupportingKnowledge:
        "Resistance heating/energy conversion and increased heating with greater electrical power/current; practical heating and " +
        "fuse operation; current through suitable liquids producing chemical change/electrolysis; electroplating as an application; " +
        "battery chemistry only at broad context level.",
      visualRepresentationRequirement: "Heating conductor/fuse sequence; simple electrolysis/electroplating cell diagram.",
      calculationProcedureRequirement: "No dedicated electrochemical calculation. Power relationships may support thermal intuition.",
      cgTeachingWorksheetCalibration: "Handout 1 thermal/chemical effects; Worksheet 1 identifies effects.",
      publicSampleAssessmentCalibration: "Sample A tests electroplating as chemical; Sample B tests fuse operation as thermal.",
      scopeCeiling: "No electrochemistry equations, electrode-potential chemistry or plating-process detail beyond Level-2 recognition/application.",
      confidence: "HIGH",
      matrixStatus: "LOCKED",
      reviewFlag: "Magnetic effect is taught alongside these effects in Handout/Worksheet 1 but is governed substantively by LO5, not AC4.8.",
    },

    // ---------------------------------------------------------------
    // LO5 -- Understand the fundamental principles which underpin the
    // relationship between magnetism and electricity
    // ---------------------------------------------------------------
    {
      acNumber: "5.1",
      loNumber: 5,
      title: "Describe the effects of magnetism in terms of attraction and repulsion.",
      requiredLearnerPerformance: "Predict attraction/repulsion from pole arrangement and interpret or complete simple magnetic field/flux patterns.",
      requiredDepthDimensions: ["Recall/Recognition", "Conceptual", "Visual/Spatial", "Application"],
      requiredSupportingKnowledge:
        "North/south poles; like poles repel and unlike poles attract; magnetic field as region of effect; simple flux-line " +
        "conventions including closed loops, external N→S direction and non-crossing lines.",
      visualRepresentationRequirement: "Bar-magnet and pole-pair field patterns; learner completes/predicts field patterns.",
      calculationProcedureRequirement: "None.",
      cgTeachingWorksheetCalibration: "Handout 9 pole attraction/repulsion and flux-line conventions; Worksheet 9 requires completing field patterns.",
      publicSampleAssessmentCalibration: "No direct item captured in the reviewed public sample extracts; LO5 coverage and worksheet evidence remain strong.",
      scopeCeiling: "No magnetic-domain theory, hysteresis or material magnetisation curves.",
      confidence: "HIGH",
      matrixStatus: "LOCKED",
      reviewFlag: "Worksheet 9 makes field-pattern understanding part of the expected post-teaching performance even though AC5.1's wording is terse.",
    },
    {
      acNumber: "5.2",
      loNumber: 5,
      title: "State the difference between magnetic flux and flux density.",
      requiredLearnerPerformance:
        "Distinguish total magnetic flux from flux per unit area, use correct symbols/units, and solve simple B=Φ/A problems and " +
        "rearrangements with area conversion.",
      requiredDepthDimensions: ["Recall/Recognition", "Conceptual", "Relational", "Calculation", "Application"],
      requiredSupportingKnowledge:
        "Magnetic flux Φ in webers (Wb); flux density B in teslas (T = Wb/m²); density as concentration of flux through area; " +
        "B=Φ/A, Φ=BA, A=Φ/B; area conversion.",
      visualRepresentationRequirement: "Same flux spread over different areas; field-line concentration comparison.",
      calculationProcedureRequirement: "B, Φ or A from B=Φ/A; mm²→m² where required.",
      cgTeachingWorksheetCalibration: "Handout 9 definitions and B=Φ/A; Worksheet 9 supports field visualisation.",
      publicSampleAssessmentCalibration: "Sample A tests Tesla and B=Φ/A formula; Sample B tests definition and calculates flux from B×A.",
      scopeCeiling: "No field strength H, permeability or magnetic-circuit calculations unless separately required.",
      confidence: "HIGH",
      matrixStatus: "LOCKED",
      reviewFlag: "The C&G handout renders the flux-density symbol anomalously; authoritative technical sources should use standard B notation.",
    },
    {
      acNumber: "5.3",
      loNumber: 5,
      title:
        "Describe the magnetic effects of electrical currents in terms of: production of a magnetic field; force on a " +
        "current-carrying conductor in a magnetic field; electromagnetism; electromotive force.",
      requiredLearnerPerformance:
        "Reason from diagrams about magnetic-field/current/force/EMF direction; explain straight-conductor, coil/solenoid and " +
        "electromagnet behaviour; predict reversals; calculate simple induced EMF and conductor force and identify the correct " +
        "directional hand rule.",
      requiredDepthDimensions: [
        "Conceptual",
        "Causal/Mechanistic",
        "Relational",
        "Visual/Spatial/Directional",
        "Calculation",
        "Application",
        "Integration",
      ],
      requiredSupportingKnowledge:
        "Magnetic field around current-carrying conductor; dot/cross page convention; right-hand grip/Maxwell screw direction; " +
        "coil/solenoid field and polarity; electromagnet/relay/contactor basic principle; field interaction of parallel conductors " +
        "at simple level; motor effect and F=BIl for perpendicular conductor; reversal of B or I reverses force; Fleming left-hand " +
        "rule; electromagnetic induction by cutting flux; e=Blv for perpendicular motion; factors B,l,v; Fleming right-hand " +
        "generator rule.",
      visualRepresentationRequirement:
        "Persistent directional diagrams; dot/cross notation; right-hand grip; solenoid polarity; Fleming left/right hand rules; " +
        "field interaction; force/motion state changes.",
      calculationProcedureRequirement: "F=BIl and e=Blv, including simple rearrangements and unit conversions.",
      cgTeachingWorksheetCalibration:
        "Handouts 9-11; Worksheets 10/11 require e=Blv, F=BIl and Fleming right/left hand rules; Worksheet 9 field patterns.",
      publicSampleAssessmentCalibration: "Sample A tests parallel conductor interaction, solenoid polarity and force direction; Sample B tests induction condition.",
      scopeCeiling: "No vector cross products, general Faraday/Lenz-law calculus, self/mutual inductance equations, magnetic-energy formulae or machine design.",
      confidence: "HIGH",
      matrixStatus: "LOCKED",
      reviewFlag:
        "This AC is materially deeper than the verb 'describe' suggests; official handouts, worksheets and sample questions all " +
        "require directional/spatial reasoning and simple calculations.",
    },
    {
      acNumber: "5.4",
      loNumber: 5,
      title:
        "Describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF " +
        "and magnetic flux.",
      requiredLearnerPerformance:
        "Explain a single-loop alternator as a causal system; map rotational position/motion to zero, intermediate and maximum " +
        "induced EMF and polarity reversal; identify core parts; relate rotation/pole pairs to waveform frequency; solve the simple " +
        "frequency/period/induced-EMF problems evidenced by C&G.",
      requiredDepthDimensions: [
        "Conceptual",
        "Causal/Mechanistic",
        "Relational",
        "Visual/Spatial/Directional",
        "Calculation",
        "Application",
        "Integration",
      ],
      requiredSupportingKnowledge:
        "Single loop between magnetic poles; slip rings and brushes; cutting flux; no EMF for motion parallel to field and maximum " +
        "for perpendicular cutting; alternating polarity through rotation; coil position→waveform position; one cycle/revolution " +
        "for one pole pair; frequency in Hz; f=N×P where N is rev/s and P is pole pairs (per C&G handout convention); e=Blv as " +
        "inherited supporting relationship; period/revolution relationship.",
      visualRepresentationRequirement: "Progressive rotating-loop states synchronised with an emerging sine wave; labelled slip rings/brushes/poles/coil; zero/max EMF states.",
      calculationProcedureRequirement: "Simple f=N×P/rearrangements; cycle/period/time relations; e=Blv/rearrangements where assessment treats them under AC5.4.",
      cgTeachingWorksheetCalibration:
        "Handout 12 single-loop alternator, position/EMF, slip rings, f=N×P; Worksheet 12 produces a sine wave; Handout 10 supports " +
        "e=Blv.",
      publicSampleAssessmentCalibration: "Sample A tests frequency/time and e=Blv; Sample B tests slip rings, e=vBl formula and length calculation.",
      scopeCeiling: "No three-phase generation, winding distribution, alternator regulation, synchronous-machine design or detailed electromagnetic field theory.",
      confidence: "HIGH",
      matrixStatus: "LOCKED_WITH_SOURCE_CHECK",
      reviewFlag:
        "Technical sourcing must verify and clearly document the pole-count convention because C&G Handout 12 defines P as pole " +
        "pairs. Existing ALP decisions about whether f=N×P was previously included/excluded have zero authority over this matrix.",
    },
    {
      acNumber: "5.5",
      loNumber: 5,
      title: "Identify the characteristics of sine-waves.",
      officialRangeSummary: "Root Mean Square (RMS) value; average value; peak to peak value; periodic time; frequency; amplitude.",
      requiredLearnerPerformance:
        "Identify each characteristic on a waveform and calculate the straightforward relationships between peak, peak-to-peak, " +
        "RMS, average, period and frequency used in the C&G teaching/worksheet material.",
      requiredDepthDimensions: ["Recall/Recognition", "Conceptual", "Visual/Spatial", "Calculation", "Application"],
      requiredSupportingKnowledge:
        "Cycle; instantaneous value; amplitude/peak; Vpp=2Vpeak; period T; f=1/T; RMS/effective meaning and Vrms≈0.707Vpeak, " +
        "Vpeak≈1.414Vrms; average over one alternation Vavg≈0.636Vpeak; full-cycle signed average = 0; analogous current " +
        "relationships.",
      visualRepresentationRequirement: "Fully labelled sine wave; progressive highlight of each characteristic; comparison of RMS/peak/average.",
      calculationProcedureRequirement: "f↔T; peak↔peak-to-peak; RMS↔peak; average-from-peak at the C&G worksheet level.",
      cgTeachingWorksheetCalibration: "Handout 13; Worksheet 13 performs peak↔RMS and peak↔average calculations.",
      publicSampleAssessmentCalibration: "Sample B asks identification of waveform period.",
      scopeCeiling: "No phasors, phase angle, harmonics, complex impedance or AC power calculations.",
      confidence: "HIGH",
      matrixStatus: "LOCKED",
      reviewFlag:
        "Average must be taught carefully as the average of one alternation in the C&G formula context; the signed average of a " +
        "complete symmetrical cycle is zero.",
    },

    // ---------------------------------------------------------------
    // LO6 -- Understand the types, applications and limitations of
    // electronic components in electrical systems and equipment
    // ---------------------------------------------------------------
    {
      acNumber: "6.1",
      loNumber: 6,
      title: "Describe the function and application of electronic components that are used in electrical systems.",
      officialRangeSummary: "Security alarms; telephones; dimmer switches; heating/boiler controls; motor control; wireless control systems.",
      requiredLearnerPerformance:
        "Recognise the listed systems and explain, at simple functional/cause-effect level, what key electronic components do " +
        "within them; select a plausible component for a stated sensing, switching, rectifying, latching or control role.",
      requiredDepthDimensions: ["Recall/Recognition", "Conceptual", "Causal/Mechanistic", "Visual/Schematic", "Application", "Integration"],
      requiredSupportingKnowledge:
        "Security alarm: transistor switching + thyristor latching/sounder role; telephone example: role of master-socket " +
        "components only if current/qualification-context evidence supports it; dimmer: capacitor timing, DIAC trigger and TRIAC " +
        "phase control at conceptual level; heating/boiler: thermistor sensing with switching/relay chain; motor control: " +
        "rectification and controlled switching/protection at block-function level; wireless control: transmitter/receiver/control " +
        "applications and practical advantages.",
      visualRepresentationRequirement: "Simplified annotated schematics and functional block flows; component-role highlighting rather than dense circuit copying.",
      calculationProcedureRequirement: "None intrinsically required.",
      cgTeachingWorksheetCalibration: "Handout 18 system examples; Worksheet 18 asks roles of thyristor, telephone capacitor, bridge rectifier, thermistor and DIAC.",
      publicSampleAssessmentCalibration: "Sample A asks which device detects temperature change.",
      scopeCeiling:
        "No requirement to design these circuits, know IC pin-level operation, troubleshoot component values, learn " +
        "telephone-network engineering or wireless protocol stacks.",
      confidence: "MEDIUM_HIGH",
      matrixStatus: "LOCKED_WITH_CURRENCY_REVIEW",
      reviewFlag:
        "Telephone-system details in the 2019 handout may be legacy-specific and must be independently checked before being " +
        "stated as current general technical truth. Teach qualification-relevant role only when source-backed.",
    },
    {
      acNumber: "6.2",
      loNumber: 6,
      title: "State the basic operating principles of electronic components and devices.",
      officialRangeSummary: "Capacitors; resistors; rectifiers; diodes; Zener; LED; photo; thermistors; DIACs; TRIACs; transistors; thyristors; inverters.",
      requiredLearnerPerformance:
        "State the basic operating principle of every listed device, recognise its schematic symbol where C&G evidence expects it, " +
        "distinguish commonly confused devices, and interpret basic rectification/control behaviour in simple circuits/waveforms.",
      requiredDepthDimensions: ["Recall/Recognition", "Conceptual", "Causal/Mechanistic", "Visual/Symbolic", "Application"],
      requiredSupportingKnowledge:
        "Capacitor stores charge/energy and capacitance unit; resistor opposes current plus basic rating/tolerance and 4-band " +
        "colour-code recognition; rectifier AC→pulsating DC and half/full-wave idea; diode one-way conduction with " +
        "anode/cathode; Zener controlled reverse conduction/regulation concept; LED emits light when forward-biased; " +
        "photo-sensitive device behaviour; thermistor PTC/NTC; DIAC bidirectional breakover trigger; TRIAC bidirectional AC switch " +
        "when gated; transistor switching/amplification and NPN/PNP symbol distinction; thyristor/SCR gate-triggered latching " +
        "unidirectional switch; inverter DC→AC.",
      visualRepresentationRequirement:
        "Schematic-symbol family; terminal labels; physical appearance as supporting recognition where useful; half/full-wave " +
        "rectifier circuit and input/output waveforms; paired comparison panels (rectifier↔inverter, diode↔Zener↔LED/photo, " +
        "DIAC↔TRIAC↔thyristor).",
      calculationProcedureRequirement:
        "No semiconductor-device calculation required. Resistor colour-code decoding and simple waveform recognition are required " +
        "by worksheet calibration.",
      cgTeachingWorksheetCalibration:
        "Handout 17; Worksheet 17 covers resistor colour code, thermistor, capacitor unit, diode, DIAC/TRIAC/NPN/PNP symbols and " +
        "half-wave rectifier waveform.",
      publicSampleAssessmentCalibration: "Sample A tests capacitor, symbol and diode terminals; Sample B tests symbols, LDR application and rectifier function.",
      scopeCeiling:
        "No semiconductor band theory, transistor bias design, detailed I-V curves, switching-frequency design, " +
        "component-selection calculations or power-electronics engineering.",
      confidence: "HIGH",
      matrixStatus: "LOCKED_WITH_AMBIGUITY",
      reviewFlag:
        "C&G Range says 'photo'; Handout 17 teaches photodiode while public Sample B tests a light-dependent resistor (LDR). For " +
        "exam support, teach and clearly distinguish both at basic recognition/function depth until authoritative C&G clarification " +
        "resolves the taxonomy.",
    },
  ],

  officialRangeCoverage: [
    // LO1 / AC1.1 -- Mathematical principles (6)
    { loNumber: 1, acNumber: "1.1", rangeCategory: "Mathematical principles", rangeItem: "Fractions and percentages", depthTreatment: "Apply and convert in electrical-work problems; percentage-of-whole and percentage limits." },
    { loNumber: 1, acNumber: "1.1", rangeCategory: "Mathematical principles", rangeItem: "Algebra", depthTreatment: "Substitute values and solve for unknowns in Level-2 formulae." },
    { loNumber: 1, acNumber: "1.1", rangeCategory: "Mathematical principles", rangeItem: "Indices", depthTreatment: "Use powers, roots and scientific/engineering notation needed by electrical quantities." },
    { loNumber: 1, acNumber: "1.1", rangeCategory: "Mathematical principles", rangeItem: "Transposition", depthTreatment: "Rearrange formulae, including squared/root relationships." },
    { loNumber: 1, acNumber: "1.1", rangeCategory: "Mathematical principles", rangeItem: "Triangles and trigonometry", depthTreatment: "Use Pythagoras and sin/cos/tan on right triangles." },
    { loNumber: 1, acNumber: "1.1", rangeCategory: "Mathematical principles", rangeItem: "Statistics", depthTreatment: "Determine range, mean, median and mode from small datasets." },

    // LO2 / AC2.1 -- SI units of measurement (8)
    { loNumber: 2, acNumber: "2.1", rangeCategory: "SI units of measurement", rangeItem: "Length", depthTreatment: "Metre (m); practical prefix conversion." },
    { loNumber: 2, acNumber: "2.1", rangeCategory: "SI units of measurement", rangeItem: "Area", depthTreatment: "Square metre (m²); convert mm²→m² when required." },
    { loNumber: 2, acNumber: "2.1", rangeCategory: "SI units of measurement", rangeItem: "Volume", depthTreatment: "Cubic metre (m³); simple litre/m³ relationships when problem data require." },
    { loNumber: 2, acNumber: "2.1", rangeCategory: "SI units of measurement", rangeItem: "Mass", depthTreatment: "Kilogram (kg)." },
    { loNumber: 2, acNumber: "2.1", rangeCategory: "SI units of measurement", rangeItem: "Density", depthTreatment: "kg/m³; interpret and use when data are supplied." },
    { loNumber: 2, acNumber: "2.1", rangeCategory: "SI units of measurement", rangeItem: "Time", depthTreatment: "Second (s); minutes/hours conversion as needed." },
    {
      loNumber: 2, acNumber: "2.1", rangeCategory: "SI units of measurement", rangeItem: "Temperature",
      depthTreatment: "Kelvin (K) as SI; recognise °C as common practical scale.",
      reviewFlag: "Handout table uses °C; authoritative SI source required.",
    },
    { loNumber: 2, acNumber: "2.1", rangeCategory: "SI units of measurement", rangeItem: "Velocity", depthTreatment: "m/s; use in induction/mechanics calculations." },

    // LO2 / AC2.2 -- Electrical quantities (SI units) (11)
    { loNumber: 2, acNumber: "2.2", rangeCategory: "Electrical quantities (SI units)", rangeItem: "Resistance", depthTreatment: "R; ohm (Ω); distinguish from resistivity." },
    {
      loNumber: 2, acNumber: "2.2", rangeCategory: "Electrical quantities (SI units)", rangeItem: "Resistivity",
      depthTreatment: "ρ; ohm metre (Ω·m).",
      reviewFlag: "Handout unit notation is erroneous; correct via technical source.",
    },
    { loNumber: 2, acNumber: "2.2", rangeCategory: "Electrical quantities (SI units)", rangeItem: "Power", depthTreatment: "P; watt (W)." },
    { loNumber: 2, acNumber: "2.2", rangeCategory: "Electrical quantities (SI units)", rangeItem: "Frequency", depthTreatment: "f; hertz (Hz)." },
    { loNumber: 2, acNumber: "2.2", rangeCategory: "Electrical quantities (SI units)", rangeItem: "Current", depthTreatment: "I; ampere (A)." },
    { loNumber: 2, acNumber: "2.2", rangeCategory: "Electrical quantities (SI units)", rangeItem: "Voltage", depthTreatment: "V; volt (V), including potential difference/EMF context." },
    { loNumber: 2, acNumber: "2.2", rangeCategory: "Electrical quantities (SI units)", rangeItem: "Energy", depthTreatment: "E/W as context requires; joule (J); recognise kWh as practical energy billing unit." },
    {
      loNumber: 2, acNumber: "2.2", rangeCategory: "Electrical quantities (SI units)", rangeItem: "Impedance",
      depthTreatment: "Z; ohm (Ω); recognition/distinction only at this depth unless other evidence requires more.",
      reviewFlag: "Anti-overdepth guard.",
    },
    {
      loNumber: 2, acNumber: "2.2", rangeCategory: "Electrical quantities (SI units)", rangeItem: "Inductance and inductive reactance",
      depthTreatment: "L in henry (H); XL in ohm (Ω); recognition/distinction, not Level-3 reactance calculations.",
      reviewFlag: "Anti-overdepth guard.",
    },
    {
      loNumber: 2, acNumber: "2.2", rangeCategory: "Electrical quantities (SI units)", rangeItem: "Capacitance and capacitive reactance",
      depthTreatment: "C in farad (F); XC in ohm (Ω); recognition/distinction, not Level-3 reactance calculations.",
      reviewFlag: "Anti-overdepth guard.",
    },
    {
      loNumber: 2, acNumber: "2.2", rangeCategory: "Electrical quantities (SI units)", rangeItem: "Power factor",
      depthTreatment: "pf/cosφ conceptually dimensionless; recognise what it represents at identification level only here.",
      reviewFlag: "No standalone PF calculation required by AC2.2 evidence.",
    },

    // LO2 / AC2.3 -- Electrical quantities (measurement) (5)
    { loNumber: 2, acNumber: "2.3", rangeCategory: "Electrical quantities (measurement)", rangeItem: "Resistance", depthTreatment: "Ohmmeter; circuit de-energised; connected across item/circuit." },
    { loNumber: 2, acNumber: "2.3", rangeCategory: "Electrical quantities (measurement)", rangeItem: "Power", depthTreatment: "Wattmeter; basic current/voltage measurement connection concept." },
    { loNumber: 2, acNumber: "2.3", rangeCategory: "Electrical quantities (measurement)", rangeItem: "Current", depthTreatment: "Ammeter in series; very low internal resistance concept." },
    { loNumber: 2, acNumber: "2.3", rangeCategory: "Electrical quantities (measurement)", rangeItem: "Voltage", depthTreatment: "Voltmeter in parallel; high internal resistance concept." },
    { loNumber: 2, acNumber: "2.3", rangeCategory: "Electrical quantities (measurement)", rangeItem: "Energy", depthTreatment: "Energy meter; kWh context." },

    // LO3 / AC3.2 -- Levers (3)
    { loNumber: 3, acNumber: "3.2", rangeCategory: "Levers", rangeItem: "Class I", depthTreatment: "Fulcrum between effort and load; recognise examples and solve simple lever problems." },
    { loNumber: 3, acNumber: "3.2", rangeCategory: "Levers", rangeItem: "Class II", depthTreatment: "Load between fulcrum and effort; recognise examples." },
    { loNumber: 3, acNumber: "3.2", rangeCategory: "Levers", rangeItem: "Class III", depthTreatment: "Effort between fulcrum and load; recognise examples." },

    // LO5 / AC5.5 -- Characteristics of a sine-wave (6)
    { loNumber: 5, acNumber: "5.5", rangeCategory: "Characteristics of a sine-wave", rangeItem: "Root Mean Square (RMS) value", depthTreatment: "Identify/evaluate effective value; RMS≈0.707 peak for sine wave; reverse via 1.414." },
    { loNumber: 5, acNumber: "5.5", rangeCategory: "Characteristics of a sine-wave", rangeItem: "Average value", depthTreatment: "Average of one alternation≈0.636 peak; distinguish from signed full-cycle average of zero." },
    { loNumber: 5, acNumber: "5.5", rangeCategory: "Characteristics of a sine-wave", rangeItem: "Peak to peak value", depthTreatment: "Identify and use Vpp=2×Vpeak." },
    { loNumber: 5, acNumber: "5.5", rangeCategory: "Characteristics of a sine-wave", rangeItem: "Periodic time", depthTreatment: "Identify one-cycle time T; use T=1/f." },
    { loNumber: 5, acNumber: "5.5", rangeCategory: "Characteristics of a sine-wave", rangeItem: "Frequency", depthTreatment: "Identify cycles/second; Hz; use f=1/T." },
    { loNumber: 5, acNumber: "5.5", rangeCategory: "Characteristics of a sine-wave", rangeItem: "Amplitude", depthTreatment: "Identify maximum excursion/peak value." },

    // LO6 / AC6.1 -- Electrical systems (6)
    { loNumber: 6, acNumber: "6.1", rangeCategory: "Electrical systems", rangeItem: "Security alarms", depthTreatment: "Explain simple switching/latching/sounder roles of relevant components." },
    {
      loNumber: 6, acNumber: "6.1", rangeCategory: "Electrical systems", rangeItem: "Telephones",
      depthTreatment: "Understand qualification-relevant component roles only when independently current/source-backed.",
      reviewFlag: "Legacy/current-technology review required.",
    },
    { loNumber: 6, acNumber: "6.1", rangeCategory: "Electrical systems", rangeItem: "Dimmer switches", depthTreatment: "Explain timing/trigger/phase-control roles of capacitor, DIAC and TRIAC at conceptual level." },
    { loNumber: 6, acNumber: "6.1", rangeCategory: "Electrical systems", rangeItem: "Heating/boiler controls", depthTreatment: "Explain temperature sensing (thermistor) and switching/relay control chain." },
    { loNumber: 6, acNumber: "6.1", rangeCategory: "Electrical systems", rangeItem: "Motor control", depthTreatment: "Explain rectification and controlled-switching/protection roles at block-function level." },
    { loNumber: 6, acNumber: "6.1", rangeCategory: "Electrical systems", rangeItem: "Wireless control systems", depthTreatment: "Explain transmitter/receiver/control use and practical application/advantages; no protocol engineering." },

    // LO6 / AC6.2 -- Electronic components and devices (13)
    { loNumber: 6, acNumber: "6.2", rangeCategory: "Electronic components and devices", rangeItem: "Capacitors", depthTreatment: "Store charge/energy in electric field; F; basic ratings/polarity only where relevant." },
    { loNumber: 6, acNumber: "6.2", rangeCategory: "Electronic components and devices", rangeItem: "Resistors", depthTreatment: "Oppose current; Ω; basic power/tolerance and 4-band colour-code recognition from worksheet evidence." },
    { loNumber: 6, acNumber: "6.2", rangeCategory: "Electronic components and devices", rangeItem: "Rectifiers", depthTreatment: "Convert AC to unidirectional/pulsating DC; half/full-wave concept and waveform recognition." },
    { loNumber: 6, acNumber: "6.2", rangeCategory: "Electronic components and devices", rangeItem: "Diodes", depthTreatment: "One-way conduction; anode/cathode; symbol and forward/reverse concept." },
    { loNumber: 6, acNumber: "6.2", rangeCategory: "Electronic components and devices", rangeItem: "Zener", depthTreatment: "Controlled reverse conduction/breakdown for simple regulation/reference concept; symbol recognition." },
    { loNumber: 6, acNumber: "6.2", rangeCategory: "Electronic components and devices", rangeItem: "LED", depthTreatment: "Emits light when correctly forward biased; symbol/application recognition." },
    {
      loNumber: 6, acNumber: "6.2", rangeCategory: "Electronic components and devices", rangeItem: "Photo",
      depthTreatment: "Photo-sensitive device recognition/function.",
      reviewFlag: "Handout teaches photodiode; sample B tests LDR. Teach/distinguish both pending C&G clarification.",
    },
    { loNumber: 6, acNumber: "6.2", rangeCategory: "Electronic components and devices", rangeItem: "Thermistors", depthTreatment: "Resistance changes with temperature; distinguish PTC/NTC; sensing/application." },
    { loNumber: 6, acNumber: "6.2", rangeCategory: "Electronic components and devices", rangeItem: "DIACs", depthTreatment: "Bidirectional breakover device commonly used to trigger TRIAC; symbol recognition." },
    { loNumber: 6, acNumber: "6.2", rangeCategory: "Electronic components and devices", rangeItem: "TRIACs", depthTreatment: "Bidirectional gated AC switching/control; symbol recognition." },
    { loNumber: 6, acNumber: "6.2", rangeCategory: "Electronic components and devices", rangeItem: "Transistors", depthTreatment: "Basic switching/amplification; NPN/PNP symbol distinction; no bias-design depth." },
    { loNumber: 6, acNumber: "6.2", rangeCategory: "Electronic components and devices", rangeItem: "Thyristors", depthTreatment: "Gate-triggered latching unidirectional controlled switch; holding-current concept only at basic level." },
    { loNumber: 6, acNumber: "6.2", rangeCategory: "Electronic components and devices", rangeItem: "Inverters", depthTreatment: "Convert DC to AC; distinguish from rectifier." },
  ],
};
