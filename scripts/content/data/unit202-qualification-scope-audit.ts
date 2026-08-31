/**
 * CC-16: Unit 202 Qualification-Scope Provenance / Contamination Audit
 * ledger. Read-only evidence, produced against the governed
 * `unit202DepthPerformanceMatrix` (scripts/content/data/unit202-depth-
 * performance-matrix.ts) -- see
 * docs/architecture/evidence/CC-16-UNIT202-QUALIFICATION-SCOPE-AUDIT.md
 * for the full evidence report, methodology and findings this ledger
 * supports.
 *
 * AUTHORITY BOUNDARY: no row in this file may assert a final scope
 * classification. See packages/content-schema/src/qualification-scope-
 * audit.ts's own header for the structural reasons this is enforced.
 * This package selected, added, removed, retained, or resolved nothing --
 * every `notes` field describes what evidence was or was not found, never
 * what should happen to the proposition.
 *
 * CRITICAL METHODOLOGY NOTE (see the evidence report for full detail): no
 * actual C&G SmartScreen handout, learner worksheet, tutor-answer sheet,
 * or public sample-assessment paper is checked into this repository.
 * Every `handoutSupport`/`worksheetSupport`/`tutorAnswerSupport`/
 * `sampleAssessmentSupport` value below of "MATRIX_CLAIMS_..." means the
 * governed matrix's OWN prose asserts that coverage -- this audit could
 * not independently retrieve or inspect the underlying artefact to
 * confirm it. This is the single largest, repo-wide evidence-access gap
 * this audit found, and it applies to essentially every row.
 */

import type { QualificationScopeAudit } from "@alp/content-schema";

export const unit202QualificationScopeAudit: QualificationScopeAudit = {
  auditTitle: "CC-16 Unit 202 Qualification-Scope Provenance / Contamination Audit",
  derivedFromMatrix: "unit202DepthPerformanceMatrix (scripts/content/data/unit202-depth-performance-matrix.ts)",
  methodologyNote:
    "Every row traces one distinct, non-trivial required-knowledge proposition drawn from the governed Depth & " +
    "Performance Matrix's own text (requiredSupportingKnowledge, officialRangeCoverage depthTreatment, " +
    "requiredLearnerPerformance) against: (A) whether the AC's own title/verb wording names it directly; " +
    "(B) whether an explicit official Range item names it; (C-F) what the matrix's own " +
    "cgTeachingWorksheetCalibration/publicSampleAssessmentCalibration text claims about handout/worksheet/tutor-" +
    "answer/sample-assessment coverage -- never independently verified against a retrieved artefact, since none " +
    "exists in this repository. (G) current unit202-knowledge-obligations.ts obligation keys and their own " +
    "recorded `basis` value; (H) current cc04-unit202-electrical-science.ts assertion keys implementing the same " +
    "proposition, where checked; (I) that assertion's own cited source class, where checked. G/H/I are diagnostic " +
    "only per this package's governing instruction and were traced exhaustively for every row flagged at least " +
    "POSSIBLE_CONTEXT_ONLY/POSSIBLE_OVERBUNDLED_PROPOSITION/OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION or matching " +
    "task-section-12's high-risk pattern list, and spot-checked for a sample of routine rows -- not exhaustively " +
    "traced for every one of the ~100+ rows below given the corpus's scale (6,015 lines); this scoping decision is " +
    "recorded explicitly in the evidence report's methodology section, not silently applied.",
  rows: [
    // =====================================================================
    // AC1.1 -- Mathematical principles (LO1). Range: 6 items, all present
    // in officialRangeCoverage. Routine, well-evidenced Level-2 maths
    // content; lowest-risk AC in the matrix overall.
    // =====================================================================
    {
      propositionKey: "ac1-1-fractions-percentages",
      acNumber: "1.1",
      rangeItems: ["Fractions and percentages"],
      matrixRequirementText: "Fractions/decimals/percentages and proportional reasoning.",
      requirementType: "PROCEDURE_OR_CALCULATION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["1.1/fractions-percentages"],
      currentAssertionKeys: ["FM-ARITH-FRACTION-OPS-001", "FM-ARITH-PERCENTAGE-001"],
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes:
        "Matrix cites 'Handout 2' generically (no specific performance clause quoted) and Sample B tests percentage " +
        "directly (publicSampleAssessmentCalibration: 'Sample B: percentage and mean'). Governed obligation basis is RANGE.",
    },
    {
      propositionKey: "ac1-1-algebra-transposition",
      acNumber: "1.1",
      rangeItems: ["Algebra", "Transposition"],
      matrixRequirementText: "Algebraic substitution; formula transposition (including squared/root forms).",
      requirementType: "PROCEDURE_OR_CALCULATION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["1.1/algebra", "1.1/transposition"],
      currentAssertionKeys: ["FM-ALG-TRANSPOSE-MULT-001", "FM-ALG-TRANSPOSE-ADD-001", "FM-ALG-SUBSTITUTION-001"],
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes:
        "cgTeachingWorksheetCalibration names exact formulae transposed (P=IV, P=V^2/R, pf=R/Z, Z=sqrt(R^2+XL^2)) and " +
        "publicSampleAssessmentCalibration confirms 'Sample A: formula transposition'. Range items 'Algebra' and " +
        "'Transposition' are combined here since the matrix's own requiredSupportingKnowledge treats them as one " +
        "continuum (substitute, then rearrange); each also individually anchored in officialRangeCoverage.",
    },
    {
      propositionKey: "ac1-1-indices-and-notation",
      acNumber: "1.1",
      rangeItems: ["Indices"],
      matrixRequirementText: "Powers, roots and scientific/engineering notation.",
      requirementType: "FACTUAL_PROPOSITION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: ["1.1/indices"],
      currentAssertionKeys: ["FM-NUM-INDICES-LAWS-001"],
      evidenceStrength: "RANGE_ANCHORED_NO_DEPTH_EVIDENCE_LOCATED",
      scopeRiskFlags: ["NO_TUTOR_OR_ASSESSMENT_SUPPORT"],
      notes:
        "The matrix's own publicSampleAssessmentCalibration for AC1.1 names formula transposition and " +
        "percentage/mean specifically but never indices/notation -- no worksheet- or sample-specific performance " +
        "claim located for this Range item, only the generic Handout 2 reference shared by the whole AC.",
    },
    {
      propositionKey: "ac1-1-pythagoras-trig",
      acNumber: "1.1",
      rangeItems: ["Triangles and trigonometry"],
      matrixRequirementText: "Pythagoras; sin/cos/tan for right triangles.",
      requirementType: "PROCEDURE_OR_CALCULATION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["1.1/triangles-trigonometry"],
      currentAssertionKeys: ["FM-GEOM-PYTHAGORAS-001", "FM-GEOM-TRIG-RATIOS-001", "FM-CALC-PYTHAGORAS-001", "FM-CALC-TRIG-RATIO-001"],
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes: "publicSampleAssessmentCalibration names 'Sample A: ...cosine' as a specific performance claim.",
    },
    {
      propositionKey: "ac1-1-statistics-range-mean-median-mode",
      acNumber: "1.1",
      rangeItems: ["Statistics"],
      matrixRequirementText: "Range/mean/median/mode.",
      requirementType: "FACTUAL_PROPOSITION",
      explicitSpecSupport: "AC_TEXT_ADJACENT_NOT_DIRECT",
      explicitRangeSupport: "RANGE_ITEM_DEPTH_TREATMENT_ADDS_DETAIL_BEYOND_ITEM_LABEL",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["1.1/statistics"],
      currentAssertionKeys: ["FM-STATS-MEAN-001", "FM-STATS-MEDIAN-001", "FM-STATS-MODE-001", "FM-STATS-RANGE-001"],
      legacySourceClass: "NIST/SEMATECH e-Handbook of Statistical Methods (FACTUAL_AUTHORITY-tier technical source, not a C&G artefact)",
      evidenceStrength: "RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY",
      scopeRiskFlags: ["DEPTH_ONLY_FROM_HANDOUT", "OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION_NOT_EXPLICIT_OR_RANGE"],
      notes:
        "The official Range box names this item only 'Statistics' -- no sub-items. unit202-knowledge-" +
        "obligations.ts's own 'statistics' obligation (AC1.1) records basis OFFICIAL_TEACHING_INTERPRETATION, not " +
        "RANGE, and its own code comment states the four-item breadth (range/mean/median/mode, explicitly excluding " +
        "quartiles) rests on a quoted Handout 2 passage -- a handout not present in this repository, so " +
        "unverifiable this session (matrix itself records no specific worksheet/sample-assessment performance " +
        "claim for 'range' specifically, though Sample B does test 'mean' per publicSampleAssessmentCalibration).",
    },

    // =====================================================================
    // AC2.1 -- SI units of measurement (LO2). Range: 8 items, all in
    // officialRangeCoverage. Routine, low risk except the matrix's own
    // self-flagged temperature/Celsius discrepancy.
    // =====================================================================
    {
      propositionKey: "ac2-1-length-area-volume-mass-density-time-velocity",
      acNumber: "2.1",
      rangeItems: ["Length", "Area", "Volume", "Mass", "Density", "Time", "Velocity"],
      matrixRequirementText: "Metre (m); square metre (m2); cubic metre (m3); kilogram (kg); kilogram per cubic metre (kg/m3); second (s); metre per second (m/s).",
      requirementType: "SYMBOL_OR_CONVENTION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: ["2.1/length", "2.1/area", "2.1/volume", "2.1/mass", "2.1/density", "2.1/time", "2.1/velocity"],
      evidenceStrength: "RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY",
      scopeRiskFlags: ["POSSIBLE_OVERBUNDLED_PROPOSITION"],
      notes:
        "Combined into one row as they share identical, undifferentiated evidence (generic 'Handout 1 SI table' " +
        "only) -- each is independently anchored by its own explicit Range item (length/area/volume/mass/density/" +
        "time/velocity all appear separately in officialRangeCoverage), so a Project Architect wanting per-item " +
        "resolution can split this row along those 7 already-explicit Range items.",
    },
    {
      propositionKey: "ac2-1-temperature-kelvin-celsius",
      acNumber: "2.1",
      rangeItems: ["Temperature"],
      matrixRequirementText: "Kelvin (K) as SI temperature unit, with C recognised as common practical temperature scale.",
      requirementType: "FACTUAL_PROPOSITION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["2.1/temperature"],
      currentAssertionKeys: ["FP-UNIT-KELVIN-CELSIUS-001"],
      legacySourceClass: "CC-15/CC-15A BIPM SI Brochure (approved dossier FACTUAL_AUTHORITY)",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: ["MATRIX_SELF_FLAGGED_REVIEW_NOTE", "CURRENTNESS_OR_JURISDICTION_DEPENDENT"],
      notes:
        "The matrix's own reviewFlag records a direct handout/sample-assessment discrepancy: 'C&G Handout 1 lists " +
        "degrees C as the temperature entry; public sample A tests kelvin.' This is the matrix authoring its own " +
        "doubt, not a finding of this audit -- reported here because it is exactly the kind of self-flagged " +
        "currency/consistency question this audit is designed to surface.",
    },

    // =====================================================================
    // AC2.2 -- Electrical quantities (SI units) (LO2). Range: 11 items.
    // Matrix already carries an explicit anti-overdepth scope guard
    // (matrixStatus LOCKED_WITH_SCOPE_GUARD) -- opposite-direction risk
    // (protecting against too much depth) rather than contamination, but
    // audited on the same terms as every other AC.
    // =====================================================================
    {
      propositionKey: "ac2-2-quantity-symbol-unit-table",
      acNumber: "2.2",
      rangeItems: [
        "Resistance", "Resistivity", "Power", "Frequency", "Current", "Voltage", "Energy",
        "Impedance", "Inductance and inductive reactance", "Capacitance and capacitive reactance", "Power factor",
      ],
      matrixRequirementText: "R->ohm; P->W; f->Hz; I->A; V->V; E/W->J; Z->ohm; L->H and XL->ohm; C->F and XC->ohm; power factor as dimensionless.",
      requirementType: "SYMBOL_OR_CONVENTION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: [
        "2.2/resistance", "2.2/resistivity", "2.2/power", "2.2/frequency", "2.2/current", "2.2/voltage", "2.2/energy",
        "2.2/impedance", "2.2/inductance-and-inductive-reactance", "2.2/capacitance-and-capacitive-reactance", "2.2/power-factor",
      ],
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: ["POSSIBLE_OVERBUNDLED_PROPOSITION"],
      notes:
        "Combined all 11 Range items' symbol/unit pairing into one row (identical, undifferentiated recognition-" +
        "level evidence: 'Handout 1 quantity/symbol/unit table' + Sample A/B both name specific quantities tested) " +
        "-- each individually anchored by its own explicit Range item; a Project Architect wanting per-quantity " +
        "resolution can split along the 11 already-explicit Range entries.",
    },
    {
      propositionKey: "ac2-2-anti-overdepth-guard-impedance-reactance-pf",
      acNumber: "2.2",
      rangeItems: ["Impedance", "Inductance and inductive reactance", "Capacitance and capacitive reactance", "Power factor"],
      matrixRequirementText: "Recognition/distinction only at this depth unless other evidence requires more (impedance, inductance/inductive reactance, capacitance/capacitive reactance, power factor).",
      requirementType: "FACTUAL_PROPOSITION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["2.2/impedance-calculation", "2.2/reactance-general"],
      currentAssertionKeys: ["EL-REL-IMPEDANCE-001", "EL-CONCEPT-REACTANCE-001"],
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: ["MATRIX_SELF_FLAGGED_REVIEW_NOTE"],
      notes:
        "Matrix reviewFlag: 'Important anti-overdepth guard. Handout 2's formula appendix contains material beyond " +
        "what the direct 2.2 assessment evidence establishes.' Reported for completeness -- this is the matrix " +
        "itself constraining depth downward, not a finding that more evidence exists than the matrix records. " +
        "Diagnostic note: unit202-knowledge-obligations.ts's 'impedance-calculation' obligation " +
        "(OFFICIAL_ASSESSMENT_EVIDENCE basis, sample item 6) already asserts full Z=sqrt(R^2+X^2) formula recall -- " +
        "worth the Project Architect's attention as a possible tension with the matrix's own scope-guard text, " +
        "since the obligations file is a separate governed artefact from the matrix under audit here.",
    },

    // =====================================================================
    // AC2.3 -- Electrical measurement instruments (LO2). Range: 5 items.
    // =====================================================================
    {
      propositionKey: "ac2-3-instrument-selection-and-connection",
      acNumber: "2.3",
      rangeItems: ["Resistance", "Current", "Voltage"],
      matrixRequirementText: "Ohmmeter/resistance measurement and de-energised-circuit requirement; ammeter in series and low internal resistance; voltmeter in parallel and high internal resistance.",
      requirementType: "PROCEDURE_OR_CALCULATION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["2.3/ammeter", "2.3/voltmeter", "2.3/ohmmeter"],
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes: "cgTeachingWorksheetCalibration: 'Worksheet 8 requires ammeter/voltmeter/wattmeter connection diagrams' -- specific performance claim.",
    },
    {
      propositionKey: "ac2-3-wattmeter-energy-meter",
      acNumber: "2.3",
      rangeItems: ["Power", "Energy"],
      matrixRequirementText: "Wattmeter current/voltage measuring paths at basic level; energy meter and kWh context.",
      requirementType: "FACTUAL_PROPOSITION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["2.3/wattmeter", "2.3/energy-meter"],
      currentAssertionKeys: ["EL-INSTRUMENT-WATTMETER-001", "EL-INSTRUMENT-ENERGY-METER-001"],
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes:
        "Note per CC-15A/B: the wattmeter's own FACTUAL technical sourcing (SRC-YOKOGAWA) is RETRIEVAL_FAILED in the " +
        "technical-source-verification package -- a factual-sourcing gap, tracked separately from this curriculum-" +
        "scope question, which concerns whether C&G requires it at all (it does, per Range item 'Power').",
    },

    // =====================================================================
    // AC3.1 -- Mass and weight (LO3). No official Range list for this AC.
    // =====================================================================
    {
      propositionKey: "ac3-1-mass-weight-definitions-and-relationship",
      acNumber: "3.1",
      matrixRequirementText: "Mass = amount of matter (kg); weight = force due to gravity (N); g~9.81 m/s2 on Earth; W=mg and rearrangement; gravitational field changes weight not mass.",
      requirementType: "RELATIONSHIP_OR_FORMULA",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["3.1/mass-meaning", "3.1/weight-meaning", "3.1/weight-mass-relationship"],
      currentAssertionKeys: ["FP-CONCEPT-MASS-001", "FP-CONCEPT-WEIGHT-001", "FP-REL-WEIGHT-MASS-001"],
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes:
        "AC3.1 title itself ('Specify what is meant by mass and weight') directly names both terms; no separate " +
        "Range box exists for this AC (officialRangeSummary is absent in the matrix's own AC3.1 record). " +
        "cgTeachingWorksheetCalibration: 'Worksheet 14 calculates weight from mass and mass from weight under " +
        "Earth/Moon gravity' -- specific bidirectional performance claim, and the matrix's own reviewFlag notes " +
        "the command verb 'specify' understates this worksheet depth.",
    },

    // =====================================================================
    // AC3.2 -- Levers, gears and pulleys (LO3). officialRangeCoverage lists
    // ONLY the 3 lever classes -- gears and pulleys, though named in the
    // AC's own title, have NO structured Range-item entry at all. This is
    // a genuine, previously-unremarked structural finding of this audit.
    // =====================================================================
    {
      propositionKey: "ac3-2-lever-classes",
      acNumber: "3.2",
      rangeItems: ["Class I", "Class II", "Class III"],
      matrixRequirementText: "Lever classes; effort/load/fulcrum; moments/turning effect and F x distance balance; mechanical advantage.",
      requirementType: "PHYSICAL_OR_COMPONENT_RECOGNITION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["3.2/lever-principle-and-classes", "3.2/lever-calculation"],
      currentAssertionKeys: ["FP-CONCEPT-LEVER-PRINCIPLE-001", "FP-LEVER-CLASS-I-001", "FP-REL-LEVER-BALANCE-001"],
      legacySourceClass: "OpenStax University Physics Volume 1 (torque/static-equilibrium chapter) -- first-party academic textbook",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: ["OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION_NOT_EXPLICIT_OR_RANGE"],
      notes:
        "One row covers all three Class I/II/III Range items (identical evidence pattern: 'Sample A tests lever " +
        "class, lever effort... Sample B tests lever class...'). unit202-knowledge-obligations.ts's own " +
        "'lever-calculation' obligation (moment-balance formula) is basis OFFICIAL_TEACHING_INTERPRETATION, not " +
        "EXPLICIT (AC3.2's own verb is 'explain', not 'calculate') -- its code comment states this rests on the " +
        "official handout genuinely teaching worked numeric examples, unverifiable this session (no persisted artefact).",
    },
    {
      propositionKey: "ac3-2-gears-and-pulleys-no-range-item",
      acNumber: "3.2",
      matrixRequirementText: "Driver/driven gears, teeth ratio, speed ratio and direction; idler effect; pulley supporting strands and ideal MA; ideal machines trade force for distance rather than create power.",
      requirementType: "RELATIONSHIP_OR_FORMULA",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "NO_RANGE_ITEM",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["3.2/mechanical-advantage-principle", "3.2/gears", "3.2/pulleys"],
      currentAssertionKeys: ["FP-CONCEPT-GEAR-001", "FP-REL-GEAR-RATIO-001", "FP-CONCEPT-PULLEY-001", "FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001"],
      evidenceStrength: "AC_TEXT_ONLY_NO_RANGE_ITEM",
      scopeRiskFlags: ["NO_EXPLICIT_AC_OR_RANGE_ANCHOR"],
      notes:
        "STRUCTURAL FINDING: AC3.2's own title names 'levers, gears and pulleys', and its officialRangeSummary " +
        "field in the matrix says only 'Levers: Class I; Class II; Class III' -- the matrix's own " +
        "officialRangeCoverage array contains NO gear or pulley Range-item rows at all (confirmed by this audit's " +
        "validator: only 3 Class-I/II/III rows exist for AC3.2). Gears/pulleys are therefore anchored only by the " +
        "AC's own title wording, never by a distinct official Range entry, despite carrying substantial " +
        "requiredSupportingKnowledge (idler effect, supporting-strand counting, ideal-machine energy conservation) " +
        "-- flagged NO_EXPLICIT_AC_OR_RANGE_ANCHOR specifically for the RANGE half of that pairing, since AC-title " +
        "anchoring alone is present. publicSampleAssessmentCalibration does independently confirm 'Sample A tests " +
        "...gear speed, pulley effort; Sample B tests ...pulley MA and gear ratio' as specific performance claims.",
    },

    // =====================================================================
    // AC3.3 / AC3.4 -- Force, work, energy, power, efficiency (LO3). No
    // official Range list for either AC.
    // =====================================================================
    {
      propositionKey: "ac3-3-force-work-energy-power-efficiency-concepts",
      acNumber: "3.3",
      matrixRequirementText: "Force as push/pull and effects on motion/deformation/equilibrium; work when force causes displacement; work/energy equivalence; kinetic vs potential energy concepts; power as rate of doing work; efficiency as output/input; losses.",
      requirementType: "FACTUAL_PROPOSITION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: [
        "3.3/force-meaning", "3.3/energy-meaning", "3.3/work-meaning-and-relationship",
        "3.3/kinetic-energy-meaning-and-relationship", "3.3/potential-energy-meaning-and-relationship",
        "3.3/power-meaning-and-relationship", "3.3/efficiency-meaning",
      ],
      evidenceStrength: "AC_TEXT_ONLY_NO_RANGE_ITEM",
      scopeRiskFlags: [],
      notes:
        "AC3.3's own title directly names every one of these terms ('force, work, energy (kinetic and potential), " +
        "power and efficiency, and their interrelationships'). Sample A/B both test specific formulae per " +
        "publicSampleAssessmentCalibration. Matrix's own scopeCeiling explicitly excludes the KE=1/2mv^2 formula " +
        "'unless later assessment/source evidence specifically requires it' -- a self-imposed depth guard, not a " +
        "finding of this audit.",
    },
    {
      propositionKey: "ac3-4-mechanics-calculation-procedures",
      acNumber: "3.4",
      matrixRequirementText: "F=mg; work/energy=F x d; power=work/time; efficiency=(useful output/input) x 100%; input=output+losses; linked motor/pump efficiency problems.",
      requirementType: "PROCEDURE_OR_CALCULATION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "NO_CLAIM_IN_MATRIX",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["3.4/work-calculation", "3.4/kinetic-energy-calculation", "3.4/power-calculation", "3.4/efficiency-calculation"],
      evidenceStrength: "AC_TEXT_ONLY_NO_RANGE_ITEM",
      scopeRiskFlags: [],
      notes:
        "cgTeachingWorksheetCalibration: 'Worksheet 15 has 17 multi-step work/power/efficiency problems including " +
        "pump/motor chains' -- strong, specific worksheet-performance claim. NOTE (diagnostic only): unit202-" +
        "knowledge-obligations.ts's '3.4/kinetic-energy-calculation' obligation (basis EXPLICIT) implements " +
        "KE=1/2mv^2 as a REQUIRED assertion, which appears in tension with AC3.3's matrix-recorded scopeCeiling " +
        "excluding that exact formula 'unless... specifically requires it' -- reported for Project Architect " +
        "attention, not resolved here.",
    },

    // =====================================================================
    // AC4.1 -- Electron theory (LO4). No official Range list.
    // =====================================================================
    {
      propositionKey: "ac4-1-atomic-structure-and-current",
      acNumber: "4.1",
      matrixRequirementText: "Protons positive, electrons negative, neutrons neutral at basic level; nucleus/outer electrons; loosely bound/free electrons in metals; electron flow -to+ and conventional current +to-.",
      requirementType: "FACTUAL_PROPOSITION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["4.1/atomic-charge-structure", "4.1/electron-theory-of-current"],
      currentAssertionKeys: ["EL-CONCEPT-ATOMIC-CHARGE-STRUCTURE-001", "EL-CONCEPT-ELECTRON-THEORY-001"],
      legacySourceClass: "CC-15/CC-15A OpenStax University Physics Volume 2 (approved dossier FACTUAL_AUTHORITY, includes explicit neutron-neutrality statement)",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes: "cgTeachingWorksheetCalibration: 'Worksheet 1 asks atom parts/charge, electron-flow direction, conventional current' -- specific performance claim.",
    },

    // =====================================================================
    // AC4.2 -- Conductors and insulators (LO4). No official Range list.
    // =====================================================================
    {
      propositionKey: "ac4-2-conductor-insulator-distinction",
      acNumber: "4.2",
      matrixRequirementText: "Good conductors generally have readily available/free electrons; insulators tightly bind outer electrons and present high resistance.",
      requirementType: "FACTUAL_PROPOSITION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["4.2/conductor-meaning", "4.2/insulator-meaning"],
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes: "AC4.2 title directly names 'good conductors and insulators'; Sample B directly tests electron binding in insulators per publicSampleAssessmentCalibration.",
    },
    {
      propositionKey: "ac4-2-material-examples",
      acNumber: "4.2",
      matrixRequirementText: "Common metal/non-metal examples; practical recognition (e.g. copper/tungsten vs porcelain/glass/plastics).",
      requirementType: "PHYSICAL_OR_COMPONENT_RECOGNITION",
      explicitSpecSupport: "AC_TEXT_ADJACENT_NOT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["4.2/examples-and-breakdown"],
      currentAssertionKeys: ["EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001"],
      legacySourceClass: "OpenStax University Physics Volume 2 + Prysmian 6242Y manufacturer cable datasheet (technical sources, not C&G artefacts)",
      evidenceStrength: "RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY",
      scopeRiskFlags: ["POSSIBLE_OVERBUNDLED_PROPOSITION", "PHYSICAL_RECOGNITION_EVIDENCE_ONLY"],
      notes:
        "FINDING: the matrix's own named example set is 'copper/tungsten vs porcelain/glass/plastics' " +
        "(publicSampleAssessmentCalibration: 'Sample B tests porcelain..., tungsten as conductor'), while the " +
        "current governed assertion EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001 names a DIFFERENT material set " +
        "entirely ('copper and aluminium... PVC and rubber', sourced from a resistivity table and a cable " +
        "datasheet, chosen for installation-work relevance). Neither list traces to an explicit C&G Range " +
        "enumeration (AC4.2 carries no Range box) -- both are plausible illustrative choices, not a single " +
        "C&G-mandated material list. Reported as a genuine specific-material-choice divergence for Project " +
        "Architect attention.",
    },

    // =====================================================================
    // AC4.3 -- Resistance and resistivity (LO4). No official Range list.
    // =====================================================================
    {
      propositionKey: "ac4-3-resistance-resistivity-relationship",
      acNumber: "4.3",
      matrixRequirementText: "Resistance R (ohm); resistivity rho as material property (ohm.m); R=rhoL/A and rearrangements; R directly proportional to L, inversely proportional to A.",
      requirementType: "RELATIONSHIP_OR_FORMULA",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["4.3/resistance-meaning", "4.3/resistivity-meaning-and-relationship", "4.3/factors-affecting-resistance"],
      legacySourceClass: "CC-15/CC-15A OpenStax University Physics Volume 2 section 9.3 (approved dossier FACTUAL_AUTHORITY)",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes:
        "AC4.3 title directly names both terms. cgTeachingWorksheetCalibration: 'Worksheet 7 has extensive R=rhoL/A, " +
        "material/length/CSA and cable-drop calculations' -- specific, extensive performance claim.",
    },

    // =====================================================================
    // AC4.4 / AC4.5 -- DC circuit theory (series/parallel) (LO4). No
    // official Range list for either AC.
    // =====================================================================
    {
      propositionKey: "ac4-4-ohms-law-series-parallel-concepts",
      acNumber: "4.4",
      matrixRequirementText: "Ohm's law V=IR; series: same current, voltage shares, resistances add; parallel: same branch voltage, currents divide/add, equivalent resistance below smallest branch; basic KVL/KCL conservation ideas.",
      requirementType: "RELATIONSHIP_OR_FORMULA",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      currentKnowledgeObligationKeys: ["4.4/ohms-law-relationship", "4.4/series-behaviour", "4.4/parallel-behaviour"],
      evidenceStrength: "AC_TEXT_ONLY_NO_RANGE_ITEM",
      scopeRiskFlags: [],
      notes:
        "Matrix's own reviewFlag: 'Some sample-question labels blur 4.3/4.4/4.5; use the actual task semantics, " +
        "not the printed tag, to define depth' -- the matrix already discounts a naive sample-assessment-label " +
        "reading here, so sampleAssessmentSupport is recorded as generic-only rather than specific.",
    },
    {
      propositionKey: "ac4-5-series-parallel-calculation",
      acNumber: "4.5",
      matrixRequirementText: "Series Rt=SumR; parallel 1/Rt=Sum(1/R); two-resistor product/sum shortcut; branch currents; voltage drops; total current; equivalent resistance.",
      requirementType: "PROCEDURE_OR_CALCULATION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["4.5/ohms-law-calculation", "4.5/series-resistance-calculation", "4.5/parallel-resistance-calculation", "4.5/supply-current-calculation"],
      legacySourceClass: "CC-15/CC-15A OpenStax University Physics Volume 2 sections 9.4/10.2/10.3 (approved dossier FACTUAL_AUTHORITY)",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes: "cgTeachingWorksheetCalibration: 'Worksheets 4/5 include total R, branch/current, voltage drop, unknown values and KVL/KCL' -- specific, extensive claim.",
    },

    // =====================================================================
    // AC4.6 -- DC circuit power (LO4). No official Range list.
    // =====================================================================
    {
      propositionKey: "ac4-6-power-calculation",
      acNumber: "4.6",
      matrixRequirementText: "P=VI; P=I^2R; P=V^2/R; rearrangements; individual vs total power; cable/joint resistive loss.",
      requirementType: "PROCEDURE_OR_CALCULATION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["4.6/power-relationship", "4.6/power-calculation", "4.6/series-parallel-power-calculation"],
      legacySourceClass: "CC-15/CC-15A OpenStax University Physics Volume 2 section 9.5 (approved dossier FACTUAL_AUTHORITY)",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes: "cgTeachingWorksheetCalibration: 'Worksheet 6 uses P=VI, I^2R, V^2/R in component/cable contexts' -- specific performance claim.",
    },

    // =====================================================================
    // AC4.7 -- Voltage drop (LO4). No official Range list.
    // =====================================================================
    {
      propositionKey: "ac4-7-voltage-drop",
      acNumber: "4.7",
      matrixRequirementText: "Voltage developed across resistance Vdrop=IR; supply voltage allocation; load-terminal voltage = supply minus upstream drops in simple cases.",
      requirementType: "RELATIONSHIP_OR_FORMULA",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["4.7/voltage-drop-meaning"],
      currentAssertionKeys: ["EL-VOLTAGE-DROP-001"],
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes: "AC4.7 title directly names 'voltage drop'. Matrix's own scopeCeiling explicitly excludes BS 7671 permitted-drop limits -- a self-imposed depth guard.",
    },

    // =====================================================================
    // AC4.8 -- Thermal and chemical effects (LO4). No official Range list.
    // =====================================================================
    {
      propositionKey: "ac4-8-thermal-chemical-effects",
      acNumber: "4.8",
      matrixRequirementText: "Resistance heating/energy conversion; current through suitable liquids producing chemical change/electrolysis; electroplating as an application.",
      requirementType: "FACTUAL_PROPOSITION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["4.8/thermal-effect", "4.8/chemical-effect"],
      legacySourceClass: "CC-15/CC-15A OpenStax University Physics Volume 2 / Chemistry (approved dossier FACTUAL_AUTHORITY)",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes: "AC4.8 title directly names 'chemical and thermal effects'. Sample A/B each test one effect specifically.",
    },
    {
      propositionKey: "ac4-8-fuse-operation",
      acNumber: "4.8",
      matrixRequirementText: "Practical heating and fuse operation.",
      requirementType: "APPLICATION_OR_COMPONENT_ROLE_CLAIM",
      explicitSpecSupport: "AC_TEXT_ADJACENT_NOT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["4.8/protective-devices"],
      currentAssertionKeys: ["EL-PROTECTIVE-DEVICE-PURPOSE-001", "EL-FUSE-OPERATION-001"],
      legacySourceClass: "CC-15A OpenStax University Physics Volume 2 section 9.5 fuse passage (approved dossier FACTUAL_AUTHORITY)",
      evidenceStrength: "RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY",
      scopeRiskFlags: ["MENTION_ONLY_NOT_PERFORMANCE"],
      notes:
        "cgTeachingWorksheetCalibration for AC4.8 says only 'Handout 1 thermal/chemical effects; Worksheet 1 " +
        "identifies effects' -- generic, not naming fuse operation specifically; publicSampleAssessmentCalibration " +
        "names 'Sample B tests fuse operation as thermal' as a specific claim, so this is not evidence-free, but " +
        "the worksheet-level claim itself does not single out fuse detail. Governed obligation basis is " +
        "NECESSARY_PREREQUISITE, not EXPLICIT/RANGE.",
    },

    // =====================================================================
    // AC5.1 -- Magnetism attraction/repulsion (LO5). No official Range list.
    // =====================================================================
    {
      propositionKey: "ac5-1-attraction-repulsion-field-lines",
      acNumber: "5.1",
      matrixRequirementText: "North/south poles; like poles repel and unlike poles attract; magnetic field as region of effect; simple flux-line conventions.",
      requirementType: "FACTUAL_PROPOSITION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: ["5.1/magnetism-attraction-repulsion"],
      currentAssertionKeys: ["EL-CONCEPT-MAGNETISM-001"],
      legacySourceClass: "CC-15/CC-15A OpenStax University Physics Volume 2 section 11.2 (approved dossier FACTUAL_AUTHORITY)",
      evidenceStrength: "RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY",
      scopeRiskFlags: ["NO_TUTOR_OR_ASSESSMENT_SUPPORT"],
      notes:
        "AC5.1 title directly names attraction/repulsion. Matrix's own publicSampleAssessmentCalibration says: 'No " +
        "direct item captured in the reviewed public sample extracts; LO5 coverage and worksheet evidence remain " +
        "strong' -- the matrix honestly records the sample-assessment gap itself; worksheet claim ('Worksheet 9 " +
        "requires completing field patterns') is specific.",
    },

    // =====================================================================
    // AC5.2 -- Flux and flux density (LO5). No official Range list.
    // =====================================================================
    {
      propositionKey: "ac5-2-flux-flux-density-relationship",
      acNumber: "5.2",
      matrixRequirementText: "Magnetic flux Phi in webers (Wb); flux density B in teslas (T = Wb/m2); B=Phi/A, Phi=BA, A=Phi/B.",
      requirementType: "RELATIONSHIP_OR_FORMULA",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["5.2/flux-meaning", "5.2/flux-density-meaning", "5.2/flux-unit", "5.2/flux-density-unit"],
      legacySourceClass: "CC-15/CC-15A OpenStax University Physics Volume 2 section 13.1 + BIPM (approved dossier FACTUAL_AUTHORITY; B=Phi/A itself is a governed-algebra rearrangement of the source's own printed Phi=BA, per CC-15A's own correction)",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes:
        "AC5.2 title directly names 'magnetic flux and flux density'. Sample A/B both test specific formula use per " +
        "publicSampleAssessmentCalibration. See CC-15A evidence report for the B=Phi/A source-form nuance " +
        "(technical-sourcing question, not curriculum-scope).",
    },

    // =====================================================================
    // AC5.3 -- Magnetic effects of current (LO5). No official Range list.
    // The densest, highest-risk non-LO6 AC: directional hand rules,
    // calculation formulae and a named application (relay/contactor) all
    // rest on OFFICIAL_TEACHING_INTERPRETATION per the obligations file's
    // own admission, not the AC's bare title wording.
    // =====================================================================
    {
      propositionKey: "ac5-3-field-around-conductor-and-direction-rule",
      acNumber: "5.3",
      matrixRequirementText: "Magnetic field around current-carrying conductor; dot/cross page convention; right-hand grip/Maxwell screw direction.",
      requirementType: "RELATIONSHIP_OR_FORMULA",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: ["5.3/field-from-current", "5.3/field-direction-rule"],
      currentAssertionKeys: ["EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001", "EL-CONCEPT-FIELD-DIRECTION-RULE-001"],
      legacySourceClass: "CC-15/CC-15A OpenStax University Physics Volume 2 section 12.2 (approved dossier FACTUAL_AUTHORITY)",
      evidenceStrength: "AC_TEXT_ONLY_NO_RANGE_ITEM",
      scopeRiskFlags: ["OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION_NOT_EXPLICIT_OR_RANGE", "NO_TUTOR_OR_ASSESSMENT_SUPPORT"],
      notes:
        "'Production of a magnetic field' is EXPLICIT in AC5.3's own title, but the specific DIRECTION rule " +
        "(Maxwell's screw / right-hand grip) is not itself named by the title -- unit202-knowledge-obligations.ts's " +
        "own 'field-direction-rule' obligation records basis OFFICIAL_TEACHING_INTERPRETATION with a code comment " +
        "citing 'Handout 9' as the source of this specific direction-rule requirement, unverifiable this session.",
    },
    {
      propositionKey: "ac5-3-force-on-conductor-and-flemings-left-hand",
      acNumber: "5.3",
      matrixRequirementText: "Motor effect and F=BIl for perpendicular conductor; reversal of B or I reverses force; Fleming left-hand rule.",
      requirementType: "RELATIONSHIP_OR_FORMULA",
      explicitSpecSupport: "AC_TEXT_ADJACENT_NOT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["5.3/force-on-conductor", "5.3/force-on-conductor-calculation"],
      currentAssertionKeys: ["EL-CONCEPT-FORCE-ON-CONDUCTOR-001", "EL-REL-FORCE-ON-CONDUCTOR-001", "EL-CONCEPT-FLEMING-LEFT-HAND-001"],
      legacySourceClass: "F=BIl: CC-15/CC-15A OpenStax University Physics Volume 2 section 11.4 (approved dossier FACTUAL_AUTHORITY). Fleming's left-hand rule NAME/mnemonic specifically: Wikipedia (encyclopedia article) per this assertion's own provenance -- a DIFFERENT, pre-existing citation from CC-15's own separate Nagoya-OCW technical-source attempt for the same directional convention.",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [
        "OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION_NOT_EXPLICIT_OR_RANGE",
        "ENCYCLOPEDIA_SOURCE",
      ],
      notes:
        "'Force on a current-carrying conductor in a magnetic field' is EXPLICIT in AC5.3's title, but F=BIl as a " +
        "CALCULATION and 'Fleming's left-hand rule' as the specific NAMED mnemonic are not themselves in the title " +
        "wording -- obligations file basis is OFFICIAL_TEACHING_INTERPRETATION with a code comment citing an " +
        "entire dedicated handout. cgTeachingWorksheetCalibration corroborates with a specific claim ('Worksheets " +
        "10/11 require e=Blv, F=BIl and Fleming right/left hand rules'). SEPARATE PROVENANCE FINDING: the current " +
        "governed assertion EL-CONCEPT-FLEMING-LEFT-HAND-001 cites Wikipedia ('loc-wikipedia-flemings-left-hand-" +
        "rule') for the rule's own directional definition -- a second, independent Wikipedia citation in this " +
        "corpus (alongside the telephone master-socket one already found by CC-15A/B), predating and separate from " +
        "CC-15's own approved-dossier Nagoya-OCW attempt at the same fact, which CC-15A found could not be verified " +
        "past a course-index heading.",
    },
    {
      propositionKey: "ac5-3-electromagnetism-and-emf-meaning",
      acNumber: "5.3",
      matrixRequirementText: "Electromagnetism; electromotive force.",
      requirementType: "FACTUAL_PROPOSITION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: ["5.3/electromagnetism-meaning", "5.3/emf-meaning"],
      evidenceStrength: "AC_TEXT_ONLY_NO_RANGE_ITEM",
      scopeRiskFlags: ["NO_TUTOR_OR_ASSESSMENT_SUPPORT"],
      notes: "Both terms directly named by AC5.3's own title.",
    },
    {
      propositionKey: "ac5-3-coil-solenoid-electromagnet-relay-contactor",
      acNumber: "5.3",
      matrixRequirementText: "Coil/solenoid field and polarity; electromagnet/relay/contactor basic principle.",
      requirementType: "APPLICATION_OR_COMPONENT_ROLE_CLAIM",
      explicitSpecSupport: "NOT_IN_AC_TEXT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: [],
      evidenceStrength: "NO_AC_OR_RANGE_ANCHOR_LOCATED",
      scopeRiskFlags: ["NO_EXPLICIT_AC_OR_RANGE_ANCHOR", "NO_TUTOR_OR_ASSESSMENT_SUPPORT", "POSSIBLE_OVERBUNDLED_PROPOSITION"],
      notes:
        "FINDING: AC5.3's own title text is 'production of a magnetic field; force on a current-carrying conductor " +
        "in a magnetic field; electromagnetism; electromotive force' -- it names none of 'coil', 'solenoid', " +
        "'electromagnet', 'relay' or 'contactor'. No Range box exists for this AC to check either. This is a named-" +
        "application-example proposition (relay/contactor are specific devices, not generic 'electromagnetism') " +
        "with no located AC-text, Range, worksheet or sample-assessment anchor at all in the matrix's own text -- " +
        "the matrix's cgTeachingWorksheetCalibration for AC5.3 ('Handouts 9-11; Worksheets 10/11 require e=Blv, " +
        "F=BIl and Fleming right/left hand rules; Worksheet 9 field patterns') never specifically names relay/" +
        "contactor either. This audit's own knowledge-obligations cross-reference (G) found NO corresponding " +
        "obligation entry for relay/contactor under AC5.3 at all -- the governed obligations file itself appears " +
        "not to carry this specific clause, a further diagnostic data point.",
    },
    {
      propositionKey: "ac5-3-induced-emf-and-flemings-right-hand",
      acNumber: "5.3",
      matrixRequirementText: "Electromagnetic induction by cutting flux; e=Blv for perpendicular motion; factors B,l,v; Fleming right-hand generator rule.",
      requirementType: "RELATIONSHIP_OR_FORMULA",
      explicitSpecSupport: "AC_TEXT_ADJACENT_NOT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["5.3/induced-emf-calculation"],
      currentAssertionKeys: ["EL-REL-INDUCED-EMF-001", "EL-CONCEPT-FLEMING-RIGHT-HAND-001"],
      legacySourceClass: "e=Blv: CC-15/CC-15A OpenStax University Physics Volume 2 section 13.3 (approved dossier FACTUAL_AUTHORITY). Fleming's right-hand rule name/mnemonic: same governed assertion's own provenance is OpenStax motional-EMF (Lenz's-law direction), not an encyclopedia source for this one.",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: ["OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION_NOT_EXPLICIT_OR_RANGE"],
      notes:
        "'Electromotive force' is EXPLICIT in the AC5.3 title but induction-by-cutting-flux and e=Blv specifically " +
        "are not -- obligations file basis is OFFICIAL_TEACHING_INTERPRETATION citing 'Handout 10' by name, " +
        "unverifiable this session. Sample A/B both test the formula specifically per publicSampleAssessmentCalibration.",
    },

    // =====================================================================
    // AC5.4 -- Single-loop AC generator (LO5). No official Range list.
    // =====================================================================
    {
      propositionKey: "ac5-4-alternator-principle-and-parts",
      acNumber: "5.4",
      matrixRequirementText: "Single loop between magnetic poles; slip rings and brushes; cutting flux; no EMF for motion parallel to field and maximum for perpendicular cutting; alternating polarity through rotation.",
      requirementType: "FACTUAL_PROPOSITION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["5.4/ac-generator-principle", "5.4/sine-wave-output"],
      legacySourceClass: "CC-15/CC-15A OpenStax University Physics Volume 2 section 13.6 + eCampusOntario (approved dossier FACTUAL_AUTHORITY)",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes: "AC5.4 title directly names 'single-loop generator, sine-wave'. cgTeachingWorksheetCalibration names Handout 12/Worksheet 12 specifically.",
    },
    {
      propositionKey: "ac5-4-frequency-pole-pair-relationship",
      acNumber: "5.4",
      matrixRequirementText: "One cycle/revolution for one pole pair; frequency in Hz; f=NxP where N is rev/s and P is pole pairs (per C&G handout convention).",
      requirementType: "RELATIONSHIP_OR_FORMULA",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: [],
      legacySourceClass: "CC-15A eCampusOntario + ABB Technical Application Papers (approved dossier FACTUAL_AUTHORITY, independently cross-checked pole-pair convention)",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: ["MATRIX_SELF_FLAGGED_REVIEW_NOTE", "CURRENTNESS_OR_JURISDICTION_DEPENDENT"],
      notes:
        "Matrix's own reviewFlag: 'Technical sourcing must verify and clearly document the pole-count convention " +
        "because C&G Handout 12 defines P as pole pairs. Existing ALP decisions about whether f=NxP was previously " +
        "included/excluded have zero authority over this matrix.' -- the matrix explicitly anticipating and " +
        "rejecting legacy-assertion influence on its own scope decision, exactly the discipline this audit checks " +
        "for; reported as a positive self-governance example, not a defect. CC-15A's own technical-source " +
        "verification independently resolved the factual pole-pair-vs-total-pole ambiguity (not a curriculum-scope " +
        "question).",
    },

    // =====================================================================
    // AC5.5 -- Sine-wave characteristics (LO5). Range: 6 items, all in
    // officialRangeCoverage. Routine, well-evidenced.
    // =====================================================================
    {
      propositionKey: "ac5-5-waveform-characteristics-and-relationships",
      acNumber: "5.5",
      rangeItems: ["Root Mean Square (RMS) value", "Average value", "Peak to peak value", "Periodic time", "Frequency", "Amplitude"],
      matrixRequirementText: "Amplitude/peak; Vpp=2Vpeak; period T; f=1/T; RMS/effective meaning and Vrms~=0.707Vpeak; average over one alternation Vavg~=0.636Vpeak; full-cycle signed average = 0.",
      requirementType: "RELATIONSHIP_OR_FORMULA",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: [
        "5.5/rms-value", "5.5/average-value", "5.5/peak-to-peak-value", "5.5/periodic-time", "5.5/frequency", "5.5/amplitude",
        "5.5/rms-peak-relationship-and-calculation", "5.5/frequency-period-relationship-and-calculation",
      ],
      currentAssertionKeys: ["EL-WAVEFORM-RMS-001", "EL-WAVEFORM-AVERAGE-VALUE-001", "EL-WAVEFORM-PEAK-TO-PEAK-001"],
      legacySourceClass: "CC-15/CC-15A/CC-15B OpenStax University Physics Volume 2 + Iowa State Applied Industrial Electricity (approved dossier FACTUAL_AUTHORITY)",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes:
        "One row covers all 6 Range items (RMS/average/peak-to-peak/periodic time/frequency/amplitude) as the " +
        "matrix's own requiredSupportingKnowledge treats them as one integrated waveform-characteristics set; each " +
        "is independently anchored by its own explicit Range item. See CC-15A/CC-15B for the T=1/f technical-" +
        "sourcing false-negative history (technical sourcing, not curriculum scope -- 'periodic time' and " +
        "'frequency' are both explicit Range items regardless of that history).",
    },

    // =====================================================================
    // AC6.1 -- Electronic systems and their applications (LO6). Range: 6
    // items. HIGHEST-RISK AC IN THE MATRIX -- mandated exemplar traces
    // for telephone and security-alarm below; every other application
    // decomposed to the same standard per task section 12.
    // =====================================================================
    {
      propositionKey: "ac6-1-security-alarm-category",
      acNumber: "6.1",
      rangeItems: ["Security alarms"],
      matrixRequirementText: "Security alarms (as a named application category the learner must recognise and explain components within).",
      requirementType: "APPLICATION_OR_COMPONENT_ROLE_CLAIM",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: [],
      evidenceStrength: "RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY",
      scopeRiskFlags: [],
      notes:
        "'Security alarms' as a category is unambiguously an explicit official Range item -- direct qualification " +
        "evidence found for the category itself, distinct from the specific topology claim traced in the next row.",
    },
    {
      propositionKey: "ac6-1-security-alarm-transistor-thyristor-topology",
      acNumber: "6.1",
      rangeItems: ["Security alarms"],
      matrixRequirementText: "Security alarm: transistor switching + thyristor latching/sounder role.",
      requirementType: "APPLICATION_OR_COMPONENT_ROLE_CLAIM",
      explicitSpecSupport: "NOT_IN_AC_TEXT",
      explicitRangeSupport: "RANGE_ITEM_DEPTH_TREATMENT_ADDS_DETAIL_BEYOND_ITEM_LABEL",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: ["6.1/security-alarm-application"],
      currentAssertionKeys: ["EL-APPLICATION-SECURITY-ALARM-TRANSISTOR-THYRISTOR-001", "EL-APPLICATION-SECURITY-ALARM-001"],
      downstreamLessonFootprint: [
        "scripts/content/data/lesson-cc11-3-historical-snapshot.ts",
        "scripts/content/data/lesson-electronic-components-switching-control.ts",
      ],
      legacySourceClass:
        "ElProCus tutorial site (PARTIAL support, general electronics how-to, not first-party manufacturer or C&G) " +
        "+ Kuphaldt 'All About Circuits' (PARTIAL support, general electronics textbook) for the exact topology; " +
        "a THIRD, previously-considered example (EL-APPLICATION-SECURITY-ALARM-001, an infrared-beam sensor, " +
        "SECO-LARM manufacturer-sourced) exists in the same corpus, downgraded from REQUIRED_FOR to SUPPORTS by a " +
        "prior package specifically because it was judged not to match the official handout's intended example.",
      evidenceStrength: "RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY",
      scopeRiskFlags: [
        "MENTION_ONLY_NOT_PERFORMANCE",
        "OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION_NOT_EXPLICIT_OR_RANGE",
        "POSSIBLE_CONTEXT_ONLY",
        "CURRENTNESS_OR_JURISDICTION_DEPENDENT",
      ],
      notes:
        "SECURITY-ALARM EXEMPLAR TRACE (task section 11). (1) 'Security alarms' IS an explicit Range item (prior " +
        "row). (2) The EXACT transistor-switching + thyristor-latching TOPOLOGY is not itself quoted anywhere in " +
        "the matrix's own text as a Worksheet/tutor-answer performance requirement -- cgTeachingWorksheetCalibration " +
        "for AC6.1 says only 'Handout 18 system examples; Worksheet 18 asks roles of thyristor, telephone " +
        "capacitor, bridge rectifier, thermistor and DIAC' -- this names 'thyristor' generically, never 'transistor' " +
        "and never the specific normally-closed-loop/transistor-triggers-thyristor/latched-sounder circuit as a " +
        "worksheet performance item. (3) No tutor-answer or sample-assessment evidence for this exact topology is " +
        "recorded in the matrix at all. (4) It is one teaching example among at least two considered in this " +
        "corpus's own history (the beam-sensor alternative). (5) The governed obligation's own basis is " +
        "OFFICIAL_TEACHING_INTERPRETATION (not EXPLICIT/RANGE), and its own code comment states plainly: " +
        "'SmartScreen itself is used only to identify which proportionate proposition to source and govern, never " +
        "as the factual authority for the proposition itself' -- meaning even the governed corpus's own authors " +
        "did not treat the (unpersisted, unverifiable) handout as establishing this exact topology as factually or " +
        "curricularly settled, only as a hint of what example to look for. REQUIRES PROJECT ARCHITECT SCOPE DECISION.",
    },
    {
      propositionKey: "ac6-1-telephone-category",
      acNumber: "6.1",
      rangeItems: ["Telephones"],
      matrixRequirementText: "Telephones (as a named application category).",
      requirementType: "APPLICATION_OR_COMPONENT_ROLE_CLAIM",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: [],
      evidenceStrength: "RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY",
      scopeRiskFlags: ["MATRIX_SELF_FLAGGED_REVIEW_NOTE", "CURRENTNESS_OR_JURISDICTION_DEPENDENT"],
      notes:
        "TELEPHONE EXEMPLAR TRACE (task section 10), item 1 of 6. 'Telephones' as a category is unambiguously an " +
        "explicit official Range item -- direct qualification evidence found for the category itself. The " +
        "officialRangeCoverage depthTreatment for this item already carries its own reviewFlag: 'Legacy/current-" +
        "technology review required' -- the matrix authoring its own currency doubt about the category, distinct " +
        "from the component-role questions traced in the next four rows.",
    },
    {
      propositionKey: "ac6-1-telephone-capacitor-role",
      acNumber: "6.1",
      rangeItems: ["Telephones"],
      matrixRequirementText: "Telephone example: role of master-socket components only if current/qualification-context evidence supports it.",
      requirementType: "APPLICATION_OR_COMPONENT_ROLE_CLAIM",
      explicitSpecSupport: "NOT_IN_AC_TEXT",
      explicitRangeSupport: "RANGE_ITEM_DEPTH_TREATMENT_ADDS_DETAIL_BEYOND_ITEM_LABEL",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: ["6.1/telephone-application"],
      currentAssertionKeys: ["EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001", "EL-APPLICATION-TELEPHONE-001"],
      downstreamLessonFootprint: [
        "scripts/content/data/lesson-cc11-3-historical-snapshot.ts",
        "scripts/content/data/lesson-electronic-components-passive.ts",
      ],
      legacySourceClass: "Wikipedia 'British telephone sockets' (encyclopedia article; cited BS 6312/BT SIN 351/352 but the article itself, not those primary standards, is the actual source used)",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: ["ENCYCLOPEDIA_SOURCE", "LEGACY_ASSERTION_ONLY", "OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION_NOT_EXPLICIT_OR_RANGE"],
      notes:
        "TELEPHONE EXEMPLAR TRACE, item 2 of 6 (capacitor/ringing role). C&G EVIDENCE: cgTeachingWorksheetCalibration " +
        "states verbatim 'Worksheet 18 asks roles of thyristor, telephone capacitor, bridge rectifier, thermistor " +
        "and DIAC' -- this IS a specific, named worksheet-performance claim for the capacitor role specifically " +
        "(the only one of the four telephone sub-clauses in this trace with such a claim). MATRIX SAYS C&G ASKS " +
        "THIS: yes, per the above. LEGACY ASSERTION SAYS THIS (diagnostic only, not evidence for the above): " +
        "EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001 cites Wikipedia as its sole factual source (already found by " +
        "CC-15A/CC-15B's own audit of this exact assertion for a different purpose -- technical-source dossier " +
        "approval, not curriculum scope; repeated here because it is diagnostically relevant to this audit too). " +
        "The governed obligation's own basis is OFFICIAL_TEACHING_INTERPRETATION.",
    },
    {
      propositionKey: "ac6-1-telephone-resistor-role",
      acNumber: "6.1",
      rangeItems: ["Telephones"],
      matrixRequirementText: "Telephone example: role of master-socket components only if current/qualification-context evidence supports it.",
      requirementType: "APPLICATION_OR_COMPONENT_ROLE_CLAIM",
      explicitSpecSupport: "NOT_IN_AC_TEXT",
      explicitRangeSupport: "RANGE_ITEM_DEPTH_TREATMENT_ADDS_DETAIL_BEYOND_ITEM_LABEL",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: ["6.1/telephone-application"],
      currentAssertionKeys: ["EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001"],
      downstreamLessonFootprint: [
        "scripts/content/data/lesson-cc11-3-historical-snapshot.ts",
        "scripts/content/data/lesson-electronic-components-passive.ts",
      ],
      legacySourceClass: "Wikipedia 'British telephone sockets' (encyclopedia article)",
      evidenceStrength: "RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY",
      scopeRiskFlags: ["MENTION_ONLY_NOT_PERFORMANCE", "ENCYCLOPEDIA_SOURCE", "LEGACY_ASSERTION_ONLY", "OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION_NOT_EXPLICIT_OR_RANGE"],
      notes:
        "TELEPHONE EXEMPLAR TRACE, item 3 of 6 (resistor/remote line-testing role). C&G EVIDENCE: the matrix's " +
        "Worksheet-18 calibration text names only 'telephone capacitor', never a resistor role -- no worksheet-, " +
        "tutor-answer- or sample-assessment-level performance evidence located for the resistor clause " +
        "specifically. This is a weaker evidence position than the capacitor clause in the prior row despite both " +
        "coming from the same single governed obligation/assertion pair -- exactly the compound-proposition risk " +
        "task section 13 requires reporting per-clause rather than as one bundled 'master-socket role' claim.",
    },
    {
      propositionKey: "ac6-1-telephone-surge-protector-role",
      acNumber: "6.1",
      rangeItems: ["Telephones"],
      matrixRequirementText: "Telephone example: role of master-socket components only if current/qualification-context evidence supports it.",
      requirementType: "APPLICATION_OR_COMPONENT_ROLE_CLAIM",
      explicitSpecSupport: "NOT_IN_AC_TEXT",
      explicitRangeSupport: "RANGE_ITEM_DEPTH_TREATMENT_ADDS_DETAIL_BEYOND_ITEM_LABEL",
      handoutSupport: "NO_CLAIM_IN_MATRIX",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: ["6.1/telephone-application"],
      currentAssertionKeys: ["EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001"],
      downstreamLessonFootprint: [
        "scripts/content/data/lesson-cc11-3-historical-snapshot.ts",
        "scripts/content/data/lesson-electronic-components-passive.ts",
      ],
      legacySourceClass: "Wikipedia 'British telephone sockets' (encyclopedia article) -- the article's own text scopes the surge protector to OLDER master sockets specifically, already reflected in the current assertion's wording",
      evidenceStrength: "NO_AC_OR_RANGE_ANCHOR_LOCATED",
      scopeRiskFlags: [
        "NO_EXPLICIT_AC_OR_RANGE_ANCHOR", "MENTION_ONLY_NOT_PERFORMANCE", "ENCYCLOPEDIA_SOURCE",
        "LEGACY_ASSERTION_ONLY", "CURRENTNESS_OR_JURISDICTION_DEPENDENT", "OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION_NOT_EXPLICIT_OR_RANGE",
      ],
      notes:
        "TELEPHONE EXEMPLAR TRACE, item 4 of 6 (older surge-protector role). Weakest of the four component-role " +
        "clauses: not named anywhere in the matrix's own text at all (neither cgTeachingWorksheetCalibration nor " +
        "publicSampleAssessmentCalibration mention it), present only in the governed obligation's own description " +
        "text and the Wikipedia-sourced assertion. No learner-performance evidence located.",
    },
    {
      propositionKey: "ac6-1-telephone-master-vs-extension-distinction",
      acNumber: "6.1",
      rangeItems: ["Telephones"],
      matrixRequirementText: "Telephone example: role of master-socket components only if current/qualification-context evidence supports it.",
      requirementType: "APPLICATION_OR_COMPONENT_ROLE_CLAIM",
      explicitSpecSupport: "NOT_IN_AC_TEXT",
      explicitRangeSupport: "RANGE_ITEM_DEPTH_TREATMENT_ADDS_DETAIL_BEYOND_ITEM_LABEL",
      handoutSupport: "NO_CLAIM_IN_MATRIX",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: [],
      currentAssertionKeys: ["EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001"],
      downstreamLessonFootprint: [
        "scripts/content/data/lesson-cc11-3-historical-snapshot.ts",
        "scripts/content/data/lesson-electronic-components-passive.ts",
      ],
      legacySourceClass: "Wikipedia 'British telephone sockets' (encyclopedia article) -- present only in the assertion's own statement text, not named in the governed obligation's description at all",
      evidenceStrength: "NO_AC_OR_RANGE_ANCHOR_LOCATED",
      scopeRiskFlags: ["NO_EXPLICIT_AC_OR_RANGE_ANCHOR", "MENTION_ONLY_NOT_PERFORMANCE", "ENCYCLOPEDIA_SOURCE", "LEGACY_ASSERTION_ONLY"],
      notes:
        "TELEPHONE EXEMPLAR TRACE, item 5 of 6 (master-vs-extension-socket distinction). Weakest of all five " +
        "telephone clauses: not present in the matrix's requiredSupportingKnowledge text at all, not present in " +
        "the governed knowledge-obligation's own description text (which stops at 'capacitor for ringing, resistor " +
        "for line testing, and -- on older sockets -- a surge protector'), found only one level further removed, " +
        "inside the underlying assertion's own statement/locator text. No curriculum evidence of any kind located.",
    },
    {
      propositionKey: "ac6-1-telephone-other-detail-check",
      acNumber: "6.1",
      rangeItems: ["Telephones"],
      matrixRequirementText: "(No further telephone-specific detail is asserted as required knowledge anywhere else in the current governed matrix, obligations file, or corpus beyond the four component-role clauses traced above.)",
      requirementType: "APPLICATION_OR_COMPONENT_ROLE_CLAIM",
      explicitSpecSupport: "NOT_IN_AC_TEXT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "NO_CLAIM_IN_MATRIX",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: [],
      evidenceStrength: "NO_AC_OR_RANGE_ANCHOR_LOCATED",
      scopeRiskFlags: [],
      notes:
        "TELEPHONE EXEMPLAR TRACE, item 6 of 6 (task section 10's 'any other telephone detail currently represented " +
        "as required knowledge'). This audit's search of the matrix, unit202-knowledge-obligations.ts's AC6.1 " +
        "block, and the assertion IDs it names found no further telephone-specific component-role detail beyond " +
        "the four clauses traced above (capacitor, resistor, surge protector, master-vs-extension). Recorded as a " +
        "negative-result row so the exemplar trace is explicitly complete, not silently truncated.",
    },
    {
      propositionKey: "ac6-1-dimmer-switch-topology",
      acNumber: "6.1",
      rangeItems: ["Dimmer switches"],
      matrixRequirementText: "Dimmer: capacitor timing, DIAC trigger and TRIAC phase control at conceptual level.",
      requirementType: "APPLICATION_OR_COMPONENT_ROLE_CLAIM",
      explicitSpecSupport: "NOT_IN_AC_TEXT",
      explicitRangeSupport: "RANGE_ITEM_DEPTH_TREATMENT_ADDS_DETAIL_BEYOND_ITEM_LABEL",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: ["6.1/dimmer-switch-application"],
      currentAssertionKeys: ["EL-APPLICATION-DIMMER-SWITCH-001"],
      legacySourceClass: "Kuphaldt 'All About Circuits' (general electronics textbook, not first-party manufacturer or C&G)",
      evidenceStrength: "RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY",
      scopeRiskFlags: ["MENTION_ONLY_NOT_PERFORMANCE", "POSSIBLE_CONTEXT_ONLY"],
      notes:
        "'Dimmer switches' is an explicit Range item, but the matrix's Worksheet-18 calibration text (which does " +
        "name 'thyristor, telephone capacitor, bridge rectifier, thermistor and DIAC' specifically) does not name " +
        "the DIMMER application by name at all -- 'DIAC' is named generically, not tied to the dimmer-timing-" +
        "capacitor-TRIAC topology specifically. Governed obligation basis is RANGE (the component-to-application " +
        "link itself), but the SPECIFIC circuit topology's own factual source (Kuphaldt) is a general electronics " +
        "textbook describing a generic/typical dimmer circuit, not a C&G-specific worked example. NOTE (CC-15A): " +
        "the dossier's own primary source for this exact chain (SRC-ST-AN3168-DIAC-TRIAC-DIMMER) was " +
        "RETRIEVAL_FAILED throughout CC-15/CC-15A/CC-15B -- a technical-sourcing gap layered on top of this " +
        "curriculum-scope question.",
    },
    {
      propositionKey: "ac6-1-heating-boiler-topology",
      acNumber: "6.1",
      rangeItems: ["Heating/boiler controls"],
      matrixRequirementText: "Heating/boiler: thermistor sensing with switching/relay chain.",
      requirementType: "APPLICATION_OR_COMPONENT_ROLE_CLAIM",
      explicitSpecSupport: "NOT_IN_AC_TEXT",
      explicitRangeSupport: "RANGE_ITEM_DEPTH_TREATMENT_ADDS_DETAIL_BEYOND_ITEM_LABEL",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["6.1/heating-boiler-control-application"],
      currentAssertionKeys: ["EL-APPLICATION-HEATING-BOILER-CONTROL-001"],
      legacySourceClass: "Vishay NTC thermistor datasheet (first-party manufacturer, names 'heating and ventilation'/'central-heating' applications directly -- comparatively strong technical evidence, though still not a C&G artefact)",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: ["POSSIBLE_CONTEXT_ONLY"],
      notes:
        "'Heating/boiler controls' is an explicit Range item; Sample A tests 'which device detects temperature " +
        "change' per publicSampleAssessmentCalibration -- reasonable performance evidence for the thermistor-" +
        "sensing HALF of this claim. The 'switching/relay chain' half has no equivalently specific evidence beyond " +
        "the same generic Handout 18 reference and the manufacturer datasheet's own generic thermostat-circuit example.",
    },
    {
      propositionKey: "ac6-1-motor-control-topology",
      acNumber: "6.1",
      rangeItems: ["Motor control"],
      matrixRequirementText: "Motor control: rectification and controlled switching/protection at block-function level.",
      requirementType: "APPLICATION_OR_COMPONENT_ROLE_CLAIM",
      explicitSpecSupport: "NOT_IN_AC_TEXT",
      explicitRangeSupport: "RANGE_ITEM_DEPTH_TREATMENT_ADDS_DETAIL_BEYOND_ITEM_LABEL",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: ["6.1/motor-control-application"],
      currentAssertionKeys: ["EL-APPLICATION-MOTOR-CONTROL-001"],
      legacySourceClass: "Kuphaldt 'All About Circuits' (general electronics textbook, generic SCR motor-control description, not first-party manufacturer or C&G)",
      evidenceStrength: "RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY",
      scopeRiskFlags: ["MENTION_ONLY_NOT_PERFORMANCE", "POSSIBLE_CONTEXT_ONLY"],
      notes:
        "'Motor control' is an explicit Range item; no worksheet or sample-assessment performance evidence located " +
        "for the specific 'rectification and controlled switching/protection' block-function claim -- only the " +
        "generic Handout 18 reference shared by the whole AC. Note per CC-15A/B: the dossier's own approved source " +
        "for this application (SRC-ABB-DRIVE-SYSTEM) is VERIFIED and manufacturer-first-party, but establishes " +
        "only rectifier/DC-link/inverter block structure -- explicitly not a 'protection' function, per CC-15A's " +
        "own correction (a factual-sourcing finding, layered on top of this curriculum-scope question).",
    },
    {
      propositionKey: "ac6-1-wireless-control-topology",
      acNumber: "6.1",
      rangeItems: ["Wireless control systems"],
      matrixRequirementText: "Wireless control: transmitter/receiver/control applications and practical advantages.",
      requirementType: "APPLICATION_OR_COMPONENT_ROLE_CLAIM",
      explicitSpecSupport: "NOT_IN_AC_TEXT",
      explicitRangeSupport: "RANGE_ITEM_DEPTH_TREATMENT_ADDS_DETAIL_BEYOND_ITEM_LABEL",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: ["6.1/wireless-control-application"],
      currentAssertionKeys: ["EL-APPLICATION-WIRELESS-CONTROL-001"],
      legacySourceClass: "Holtek HT12D/HT12F decoder IC datasheet (first-party manufacturer, real remote-control IC naming garage-door/car-door/alarm applications)",
      evidenceStrength: "RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY",
      scopeRiskFlags: ["MENTION_ONLY_NOT_PERFORMANCE"],
      notes:
        "'Wireless control systems' is an explicit Range item; no worksheet- or sample-assessment-specific " +
        "performance evidence located, only the generic Handout 18 reference. A prior package's own comment " +
        "(EL-APPLICATION-WIRELESS-CONTROL-001's registration) records that source-specific implementation " +
        "vocabulary (product/IC names) was deliberately narrowed out of the learner-facing statement to avoid " +
        "source specificity exceeding syllabus scope -- a positive self-governance precedent for exactly the " +
        "pattern this audit checks for.",
    },

    // =====================================================================
    // AC6.2 -- Electronic component operating principles (LO6). Range: 13
    // items, all in officialRangeCoverage. Mostly routine recognition-
    // level content with strong worksheet support; several items carry
    // OFFICIAL_TEACHING_INTERPRETATION-basis extra depth beyond the bare
    // Range label, and the matrix's own self-flagged photo/LDR ambiguity.
    // =====================================================================
    {
      propositionKey: "ac6-2-capacitor-resistor-basic-principle",
      acNumber: "6.2",
      rangeItems: ["Capacitors"],
      matrixRequirementText: "Capacitor stores charge/energy and capacitance unit; resistor opposes current plus basic rating/tolerance.",
      requirementType: "FACTUAL_PROPOSITION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["6.2/capacitors", "6.2/resistors"],
      legacySourceClass: "CC-15/CC-15A OpenStax University Physics Volume 2 sections 8.1/8.3 (approved dossier FACTUAL_AUTHORITY)",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes: "Sample A tests capacitor per publicSampleAssessmentCalibration.",
    },
    {
      propositionKey: "ac6-2-resistor-4band-colour-code",
      acNumber: "6.2",
      rangeItems: ["Resistors"],
      matrixRequirementText: "4-band colour-code recognition from worksheet evidence.",
      requirementType: "PHYSICAL_OR_COMPONENT_RECOGNITION",
      explicitSpecSupport: "NOT_IN_AC_TEXT",
      explicitRangeSupport: "RANGE_ITEM_DEPTH_TREATMENT_ADDS_DETAIL_BEYOND_ITEM_LABEL",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: [],
      legacySourceClass: "CC-15/CC-15A TE Connectivity resistor colour-code page (approved dossier FACTUAL_AUTHORITY, manufacturer)",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: ["DEPTH_ONLY_FROM_HANDOUT", "PHYSICAL_RECOGNITION_EVIDENCE_ONLY"],
      notes:
        "The matrix's own requiredSupportingKnowledge text explicitly attributes this depth to worksheet evidence " +
        "('...4-band colour-code recognition from worksheet evidence' -- the matrix's own wording, not this " +
        "audit's characterisation) and cgTeachingWorksheetCalibration confirms: 'Worksheet 17 covers resistor " +
        "colour code'. 'Resistors' is the Range item; the specific 4-band decoding depth is not itself in the " +
        "Range label, self-flagged by the matrix as depth-from-worksheet.",
    },
    {
      propositionKey: "ac6-2-rectifier-diode-zener-led",
      acNumber: "6.2",
      rangeItems: ["Rectifiers", "Diodes", "Zener", "LED"],
      matrixRequirementText: "Rectifier AC->pulsating DC and half/full-wave idea; diode one-way conduction with anode/cathode; Zener controlled reverse conduction/regulation concept; LED emits light when forward-biased.",
      requirementType: "FACTUAL_PROPOSITION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["6.2/rectifiers", "6.2/diodes", "6.2/zener", "6.2/led"],
      legacySourceClass: "CC-15/CC-15A ROHM Semiconductor manufacturer pages (approved dossier FACTUAL_AUTHORITY)",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes: "Combined 4 Range items sharing identical evidence pattern (Handout 17/Worksheet 17, Sample A/B both name diode terminals/symbols specifically).",
    },
    {
      propositionKey: "ac6-2-rectifier-half-vs-full-wave-distinction",
      acNumber: "6.2",
      rangeItems: ["Rectifiers"],
      matrixRequirementText: "half/full-wave idea (distinguishing single-diode half-wave from four-diode full-wave bridge rectification).",
      requirementType: "FACTUAL_PROPOSITION",
      explicitSpecSupport: "NOT_IN_AC_TEXT",
      explicitRangeSupport: "RANGE_ITEM_DEPTH_TREATMENT_ADDS_DETAIL_BEYOND_ITEM_LABEL",
      handoutSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["6.2/rectifier-half-vs-full-wave"],
      currentAssertionKeys: ["EL-COMPONENT-RECTIFIER-HALF-WAVE-001", "EL-COMPONENT-RECTIFIER-FULL-WAVE-001"],
      legacySourceClass: "Kuphaldt 'All About Circuits' section 3.4 Rectifier Circuits (general electronics textbook, not first-party manufacturer or C&G)",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: ["OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION_NOT_EXPLICIT_OR_RANGE"],
      notes:
        "cgTeachingWorksheetCalibration: 'Worksheet 17 covers... half-wave rectifier waveform' -- specific claim, " +
        "though it names half-wave only, not the four-diode full-wave/bridge distinction specifically. Governed " +
        "obligation basis is OFFICIAL_TEACHING_INTERPRETATION with a code comment citing Handout 17 explicitly, " +
        "unverifiable this session. CC-15A's own technical-source audit separately found the approved dossier " +
        "source (ROHM) covers half-wave only, not full-wave -- a factual-sourcing gap layered on this question.",
    },
    {
      propositionKey: "ac6-2-photo-device-ambiguity",
      acNumber: "6.2",
      rangeItems: ["Photo"],
      matrixRequirementText: "Photo-sensitive device behaviour (Range says 'photo'; handout teaches photodiode; public sample tests LDR).",
      requirementType: "PHYSICAL_OR_COMPONENT_RECOGNITION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "NO_CLAIM_IN_MATRIX",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: [],
      currentAssertionKeys: ["EL-COMPONENT-PHOTODIODE-001"],
      legacySourceClass: "CC-15/CC-15A Hamamatsu (photodiode) + Advanced Photonix (LDR) manufacturer pages (approved dossier FACTUAL_AUTHORITY)",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: ["MATRIX_SELF_FLAGGED_REVIEW_NOTE"],
      notes:
        "'Photo' IS an explicit Range item (the single-word label itself). The matrix's own reviewFlag already " +
        "names the exact ambiguity this audit would otherwise flag: 'C&G Range says photo; Handout 17 teaches " +
        "photodiode while public Sample B tests a light-dependent resistor (LDR)' -- reported here for " +
        "completeness as the matrix authoring its own doubt, not a new finding. Governed obligation " +
        "('6.2/photo') currently satisfies only the photodiode reading; no obligation-file entry exists yet for LDR.",
    },
    {
      propositionKey: "ac6-2-thermistor-ptc-ntc",
      acNumber: "6.2",
      rangeItems: ["Thermistors"],
      matrixRequirementText: "Thermistor PTC/NTC.",
      requirementType: "FACTUAL_PROPOSITION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_GENERIC_COVERAGE_ONLY",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: ["6.2/thermistors", "6.2/thermistors-ptc"],
      currentAssertionKeys: ["EL-COMPONENT-THERMISTOR-PTC-001"],
      legacySourceClass: "CC-15/CC-15A Murata NTC + Murata PTC manufacturer pages (approved dossier FACTUAL_AUTHORITY)",
      evidenceStrength: "RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY",
      scopeRiskFlags: ["OBLIGATION_BASIS_IS_TEACHING_INTERPRETATION_NOT_EXPLICIT_OR_RANGE"],
      notes:
        "'Thermistors' is an explicit Range item; NTC alone might be read from AC6.2's generic requirement, but the " +
        "PTC-specifically obligation's own basis is OFFICIAL_TEACHING_INTERPRETATION (code comment: 'PTC was " +
        "genuinely missing, not merely under-decomposed', citing Handout 17 by name, unverifiable this session).",
    },
    {
      propositionKey: "ac6-2-diac-triac-transistor-thyristor-inverter",
      acNumber: "6.2",
      rangeItems: ["DIACs", "TRIACs", "Transistors", "Thyristors", "Inverters"],
      matrixRequirementText: "DIAC bidirectional breakover trigger; TRIAC bidirectional AC switch when gated; transistor switching/amplification and NPN/PNP symbol distinction; thyristor/SCR gate-triggered latching unidirectional switch; inverter DC->AC.",
      requirementType: "FACTUAL_PROPOSITION",
      explicitSpecSupport: "AC_TEXT_DIRECT",
      explicitRangeSupport: "EXPLICIT_RANGE_ITEM_DIRECT",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      currentKnowledgeObligationKeys: ["6.2/diacs", "6.2/triacs", "6.2/transistors", "6.2/thyristors", "6.2/invertors"],
      legacySourceClass: "CC-15/CC-15A/CC-15B STMicroelectronics (DIAC/thyristor) + ROHM (transistor) manufacturer pages (approved dossier FACTUAL_AUTHORITY)",
      evidenceStrength: "RANGE_ANCHORED_WITH_WORKSHEET_OR_ASSESSMENT_PERFORMANCE_CLAIMED",
      scopeRiskFlags: [],
      notes: "Combined 5 Range items sharing identical evidence pattern; Worksheet 17 and Sample A/B both name DIAC/TRIAC/NPN/PNP symbols specifically per the matrix's calibration text.",
    },

    // =====================================================================
    // Cross-cutting / other high-risk finding not tied to a single AC row
    // above (task section 12's own instruction to look beyond the two
    // named examples).
    // =====================================================================
    {
      propositionKey: "cross-cutting-fleming-rule-mnemonic-vocabulary",
      acNumber: "5.3",
      matrixRequirementText: "Fleming left-hand rule; Fleming right-hand generator rule (the specific named mnemonic device, as opposed to the underlying directional physics it encodes).",
      requirementType: "SYMBOL_OR_CONVENTION",
      explicitSpecSupport: "NOT_IN_AC_TEXT",
      explicitRangeSupport: "AC_HAS_NO_OFFICIAL_RANGE_LIST",
      handoutSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      worksheetSupport: "MATRIX_CLAIMS_SPECIFIC_PERFORMANCE",
      tutorAnswerSupport: "NO_CLAIM_IN_MATRIX",
      sampleAssessmentSupport: "NO_CLAIM_IN_MATRIX",
      currentKnowledgeObligationKeys: ["5.3/force-on-conductor-calculation", "5.3/induced-emf-calculation"],
      currentAssertionKeys: ["EL-CONCEPT-FLEMING-LEFT-HAND-001", "EL-CONCEPT-FLEMING-RIGHT-HAND-001"],
      legacySourceClass: "Fleming's left-hand rule: Wikipedia (encyclopedia article). Fleming's right-hand rule: OpenStax University Physics Volume 2 motional-EMF section (technical source, Lenz's-law direction only -- the 'Fleming' naming/mnemonic itself is this corpus's own vocabulary choice, not sourced from OpenStax, which does not use that name).",
      evidenceStrength: "RANGE_ANCHORED_HANDOUT_ADJACENCY_CLAIMED_ONLY",
      scopeRiskFlags: ["ENCYCLOPEDIA_SOURCE", "LEGACY_ASSERTION_ONLY"],
      notes:
        "Cross-cutting finding, reported once here rather than duplicated across the two AC5.3 rows above: the " +
        "matrix itself names 'Fleming left-hand rule'/'Fleming right-hand generator rule' as the required " +
        "directional CONVENTION (matching the vocational-trade term a C&G question would plausibly use, per this " +
        "corpus's own registration comments), but the corpus's factual sourcing for the LEFT-hand rule specifically " +
        "is an encyclopedia article, and the RIGHT-hand rule's 'Fleming' name is this corpus's own vocabulary " +
        "layered onto an OpenStax source that does not itself use that name. This is a symbol/convention-naming " +
        "provenance question distinct from the underlying force/EMF physics (F=BIl, e=Blv), which is well-" +
        "evidenced by the approved technical-source dossier per CC-15/CC-15A.",
    },
  ],
};
