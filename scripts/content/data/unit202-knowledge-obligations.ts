/**
 * CC-09B.1: Unit 202 knowledge-obligation decomposition.
 *
 * A durable authoring/audit artefact, NOT learner content (task brief
 * section 4) -- it exists so a curriculum requirement can never again be
 * declared "knowledge complete" merely because a coverage counter is
 * non-zero (the exact false-green failure mode CC-09B's mechanical
 * checks allowed: a curriculum node had *a* mapped assertion, which is
 * REFERENTIAL coverage, silently read as SEMANTIC completeness).
 *
 * For every official Assessment Criterion, this file declares the
 * discrete factual/procedural obligations that AC genuinely imposes (per
 * the official handbook's own AC/Range wording -- see
 * cc04-unit202-electrical-science.ts's UNIT202_R2_STRUCTURE, the single
 * source of truth for what the curriculum actually requires), and which
 * real governed assertion(s) satisfy each one. `scripts/content/report-
 * coverage-matrix.ts` cross-checks `satisfiedBy` against the live corpus
 * mechanically (an obligation naming an assertion that does not exist is
 * a structural defect, not silently ignored) and computes SEMANTIC
 * completeness from this -- never inferred from assertion count, Range-
 * item-mapping count, or any other proxy (task brief section 8's explicit
 * "do not make the validator pretend it can infer semantic completeness
 * from assertion count alone").
 *
 * An AC with no entry in `AC_OBLIGATIONS` is INCOMPLETE by definition --
 * absence of a decomposition is never silently read as "nothing to
 * decompose, therefore complete" (task brief section 7: "23/23 mapped
 * must NOT be visually or mechanically confused with 23/23 semantically
 * complete").
 *
 * This is deliberately NOT a new governed database entity/table -- it is
 * plain authoring data, validated the same way the knowledge-graph/
 * pedagogy manifests already are (a schema-independent script cross-
 * checks it against the live corpus), per task brief section 5's
 * explicit instruction not to overbuild a new domain model.
 *
 * CC-09B.6 (OFFICIAL TEACHING-MATERIAL RECONCILIATION): the qualification
 * handbook alone does not always provide enough detail to reconstruct the
 * intended teaching breadth, depth, examples or decomposition (task
 * section 0). Four source roles are kept strictly distinct (task section
 * 1): the NORMATIVE CURRICULUM SOURCE (handbook) sets the formal scope
 * boundary; the OFFICIAL TEACHING-SCOPE SOURCE (2365-202 SmartScreen/
 * course handouts) is evidence of intended teaching breadth/depth/
 * examples, never a scope boundary in its own right and never a factual
 * authority; the OFFICIAL ASSESSMENT-PATTERN SOURCE (public 2365-602
 * sample material) informs assessment-style/knowledge-gap evidence only,
 * never factual authority or curriculum scope (CC-09D exercised this role
 * against the v1.0 sample; CC-09F/CC-09I registered but could not yet
 * content-compare the current v1.2 edition -- see PROJECT-STATUS.md
 * §CC-09D/§CC-09F/§CC-09I for the current state; this sentence described a
 * still-deferred role only up to CC-09B.6, not the current architecture);
 * independent
 * authoritative technical/scientific sources establish factual truth. An
 * assertion earns required Unit 202 status only by passing BOTH gates
 * independently: (1) a `basis` here justifying its CURRICULUM SCOPE
 * (EXPLICIT/RANGE/NECESSARY_PREREQUISITE/OFFICIAL_TEACHING_INTERPRETATION),
 * and (2) its own genuine, independently-inspected FACTUAL provenance in
 * `cc04-unit202-electrical-science.ts` (never SmartScreen citing itself as
 * evidence -- task section 2's explicit governance rule: "official
 * teaching intent does not override physical truth", verified case by
 * case during this package's gear-power-trade-off audit, task section 8).
 *
 * CC-09C (COURSE EVIDENCE, CORPUS CONFIDENCE & RELEASE-GATE ARCHITECTURE):
 * the four source roles CC-09B.6 named informally above are now a generic,
 * reusable enum (`sourceRoleSchema` in `@alp/content-schema`'s
 * knowledge-graph.ts) rather than Unit-202/SmartScreen-specific prose --
 * NORMATIVE_CURRICULUM, AWARDING_BODY_SCOPE_INTERPRETATION,
 * OFFICIAL_ASSESSMENT and FACTUAL_AUTHORITY are that same distinction,
 * generalised. This file's own `basis` values are deliberately left
 * UNCHANGED (no renaming, per task section 8's explicit "do not blindly
 * rename the existing literal" guidance) -- `basis` answers a different
 * question (why is THIS obligation in Unit 202's scope) at a different
 * layer (the obligation-decomposition layer) than `sourceRole` (what
 * evidential job does THIS source play in the registry), and the two are
 * deliberately never conflated (task section 11). `scopeUnresolved` also
 * gained a required `materiality` field this package (see the interface
 * below) feeding a new, separate course-evidence release-confidence
 * assessment in `report-coverage-matrix.ts` -- unused by any real
 * obligation in this file today (Statistics, the one prior
 * `scopeUnresolved` case, was itself resolved by CC-09B.6).
 */

export interface KnowledgeObligation {
  /** Stable slug, unique within its AC, e.g. "force-meaning". */
  id: string;
  /** The discrete factual/procedural obligation this AC imposes, in plain English -- never learner-facing content. */
  description: string;
  /** Governed assertion identifier(s) that satisfy this obligation. Cross-checked against the live corpus; an unresolved id is a structural defect, not a silent gap. */
  satisfiedBy: string[];
  /**
   * CC-09B.4 (task section 15): distinguishes SOURCE-SUPPORTED KNOWLEDGE
   * (the assertions in `satisfiedBy` are genuinely, directly sourced --
   * unaffected) from CURRICULUM-SCOPE CERTAINTY (whether those assertions
   * exhaust everything the official Range item's own single-word/short
   * heading was actually intended to require). Set only when the
   * official handbook/public assessment material genuinely does not
   * itself specify the intended breadth, and no further scope may be
   * invented from model memory or a foundational source's own broader
   * coverage merely because it happens to be available (e.g. GCSE maths
   * covering median/mode/quartiles does not by itself prove Unit 202's
   * "Statistics" Range item requires them). This obligation still counts
   * as satisfied for semantic-completeness purposes (its `satisfiedBy`
   * assertions ARE genuinely sourced) -- this flag is a separate, explicit
   * note for the Project Architect/future assessment-pattern package, not
   * a semantic-completeness gate.
   *
   * CC-09C (task sections 15-16): `materiality` distinguishes an
   * unresolved question that could genuinely change what a learner needs
   * to know/do or a credible alignment claim (MATERIAL -- e.g. whether a
   * whole subtopic sits under a terse Range item, or whether a formula is
   * expected at all) from one that could not (NON_MATERIAL -- e.g. which
   * of several equally valid illustrative examples a source happens to
   * use). `report-coverage-matrix.ts`'s course-evidence release-confidence
   * assessment reads this field directly: any MATERIAL unresolved
   * obligation caps confidence at LIMITED regardless of otherwise-complete
   * formal/semantic coverage (task section 34, gate A); a NON_MATERIAL one
   * never blocks release on its own (gate B). Required whenever
   * `scopeUnresolved` is set -- an unresolved question with no stated
   * materiality would be exactly the kind of hidden gap this package
   * exists to prevent.
   */
  scopeUnresolved?: { note: string; materiality: "MATERIAL" | "NON_MATERIAL" };
  /**
   * CC-09B.5 (task section 20, SYLLABUS-SCOPE FIDELITY AND DEPTH CONTROL):
   * a concise, mechanically-checkable rationale for WHY this obligation is
   * genuinely part of Unit 202's required scope -- never "the source
   * happened to contain this fact" (explicitly prohibited, task section 20
   * "D"). One of:
   *  - EXPLICIT: directly named by the official AC's own wording/verb.
   *  - RANGE: directly named as an official handbook Range item.
   *  - NECESSARY_PREREQUISITE: not itself literally named by the AC/Range
   *    wording, but reasonably necessary background to understand,
   *    perform, explain, identify, state or calculate the AC/Range
   *    requirement at Level 2 depth (never merely "interesting and true").
   *  - OFFICIAL_TEACHING_INTERPRETATION (CC-09B.6, task section 22): the
   *    official handbook's AC/Range wording alone does not itself resolve
   *    the intended teaching breadth, depth, decomposition or worked
   *    example, but the official 2365-202 SmartScreen/course teaching
   *    material genuinely does -- and every such obligation still requires
   *    its own independent factual-source entailment (SmartScreen resolves
   *    SCOPE only, never FACT; see the two-gate model in CC-09B.6's own
   *    module-header note below). Reserved for genuine teaching-scope
   *    evidence, never for "SmartScreen happened to also mention this."
   *  - OFFICIAL_ASSESSMENT_EVIDENCE (task section 22): reserved for a
   *    future package once the public 2365-602 sample assessment material
   *    is systematically reconciled -- deliberately never populated from
   *    guesswork in CC-09B.6 itself.
   * A final value, SCOPE_UNRESOLVED, is reserved for an obligation whose
   * basis cannot be defensibly assigned from available official material
   * (distinct from `scopeUnresolved` above, which flags BREADTH within an
   * already-basis-justified obligation).
   */
  basis: "EXPLICIT" | "RANGE" | "NECESSARY_PREREQUISITE" | "OFFICIAL_TEACHING_INTERPRETATION" | "OFFICIAL_ASSESSMENT_EVIDENCE" | "SCOPE_UNRESOLVED";
}

export interface AcObligationSet {
  /** Official AC number, e.g. "3.3". */
  acNumber: string;
  obligations: KnowledgeObligation[];
}

export const AC_OBLIGATIONS: readonly AcObligationSet[] = [
  {
    acNumber: "1.1",
    obligations: [
      { id: "fractions-percentages", basis: "RANGE", description: "Apply the four operations to fractions; interpret and use percentages.", satisfiedBy: ["FM-ARITH-FRACTION-OPS-001", "FM-ARITH-PERCENTAGE-001"] },
      { id: "algebra", basis: "RANGE", description: "Understand inverse operations and the principle that an equation's equality is preserved by an operation applied to both sides.", satisfiedBy: ["FM-ALG-INVERSE-OPS-MULT-001", "FM-ALG-INVERSE-OPS-ADD-001", "FM-ALG-EQUALITY-MULT-001", "FM-ALG-EQUALITY-ADD-001"] },
      { id: "indices", basis: "RANGE", description: "Apply the laws of indices (multiplying/dividing powers of the same base; fractional indices as roots).", satisfiedBy: ["FM-NUM-INDICES-LAWS-001"] },
      { id: "transposition", basis: "RANGE", description: "Rearrange a formula to change its subject, and substitute known values to find an unknown.", satisfiedBy: ["FM-ALG-TRANSPOSE-MULT-001", "FM-ALG-TRANSPOSE-ADD-001", "FM-ALG-SUBSTITUTION-001"] },
      { id: "triangles-trigonometry", basis: "RANGE", description: "State Pythagoras' theorem and the sine/cosine/tangent ratios, AND apply them to find an unknown side or angle.", satisfiedBy: ["FM-GEOM-PYTHAGORAS-001", "FM-GEOM-TRIG-RATIOS-001", "FM-CALC-PYTHAGORAS-001", "FM-CALC-TRIG-RATIO-001"] },
      {
        id: "statistics",
        basis: "OFFICIAL_TEACHING_INTERPRETATION",
        description: "Interpret the mean, median, mode and range of a data set.",
        satisfiedBy: ["FM-STATS-MEAN-001", "FM-STATS-MEDIAN-001", "FM-STATS-MODE-001", "FM-STATS-RANGE-001"],
        // CC-09B.4 (task section 15) left this obligation's breadth
        // scopeUnresolved: the official handbook's Range box names this
        // item only as "Statistics", with no sub-items, and quartiles
        // were NOT added merely because DfE's broader GCSE Maths coverage
        // happens to include them.
        //
        // CC-09B.6 (task section 6) RESOLVES this using the official
        // 2365-202 SmartScreen handout (Handout 2, "Mathematical
        // principles"), which explicitly states: "the data has been
        // collected it can then be analysed using simple statistical
        // tools including range, average (mean), median and mode" --
        // genuine OFFICIAL_TEACHING_INTERPRETATION evidence of the
        // intended breadth (four named tools, no more). basis changes
        // from RANGE to OFFICIAL_TEACHING_INTERPRETATION because the
        // handbook's bare "Statistics" wording alone still cannot justify
        // this specific four-item breadth -- the SmartScreen evidence is
        // what does. The FACTUAL entailment gate is independently
        // satisfied: FM-STATS-MEDIAN-001/FM-STATS-MODE-001 cite the SAME
        // already-verified DfE Maths locator already used for mean/range
        // (its own locatorSummary already named "median, mean, mode and
        // modal class" -- SmartScreen was never treated as the factual
        // authority, only as scope evidence). Quartiles/inter-quartile
        // range remain deliberately excluded -- SmartScreen itself
        // confirms the intended breadth stops at range/mean/median/mode.
        //
        // CC-09G amendment (task section 2): the DfE locator's own text
        // was re-inspected and found to establish curriculum SCOPE only
        // ("interpret, analyse and compare... through appropriate
        // measures of..."), never the actual mathematical definitions --
        // it was never a valid factual DEFINES source for what these four
        // measures ARE, only for the fact that they are taught. All four
        // FM-STATS-*-001 assertions now cite the NIST/SEMATECH e-Handbook
        // of Statistical Methods for their factual definitions instead;
        // DfE is retained CURRICULUM_REQUIRES (scope) only. This
        // obligation's own basis/breadth reasoning above is unaffected.
      },
    ],
  },
  {
    acNumber: "2.1",
    obligations: [
      { id: "length", basis: "RANGE", description: "Identify the SI unit of length.", satisfiedBy: ["FP-UNIT-METRE-001"] },
      { id: "area", basis: "RANGE", description: "Identify the SI unit of area.", satisfiedBy: ["FP-UNIT-SQUARE-METRE-001"] },
      { id: "volume", basis: "RANGE", description: "Identify the SI unit of volume.", satisfiedBy: ["FP-UNIT-CUBIC-METRE-001"] },
      { id: "mass", basis: "RANGE", description: "Identify the SI unit of mass.", satisfiedBy: ["FP-UNIT-KILOGRAM-001"] },
      { id: "density", basis: "RANGE", description: "Identify the SI unit of density.", satisfiedBy: ["FP-UNIT-DENSITY-001"] },
      { id: "time", basis: "RANGE", description: "Identify the SI unit of time.", satisfiedBy: ["FP-UNIT-SECOND-001"] },
      { id: "temperature", basis: "RANGE", description: "Identify the SI unit of temperature and its relationship to Celsius.", satisfiedBy: ["FP-UNIT-KELVIN-CELSIUS-001"] },
      { id: "velocity", basis: "RANGE", description: "Identify the SI unit of velocity.", satisfiedBy: ["FP-UNIT-METRE-PER-SECOND-001"] },
      { id: "base-vs-derived", basis: "EXPLICIT", description: "Distinguish an SI base unit from an SI derived unit.", satisfiedBy: ["EL-UNIT-BASE-VS-DERIVED-001"] },
    ],
  },
  {
    acNumber: "2.2",
    obligations: [
      { id: "resistance", basis: "RANGE", description: "Identify the SI unit of resistance.", satisfiedBy: ["EL-UNIT-OHM-001", "EL-CONCEPT-RESISTANCE-001"] },
      { id: "resistivity", basis: "RANGE", description: "Identify the SI unit of resistivity.", satisfiedBy: ["EL-UNIT-OHM-METRE-001"] },
      { id: "power", basis: "RANGE", description: "Identify the SI unit of power.", satisfiedBy: ["EL-UNIT-WATT-001", "EL-CONCEPT-POWER-001"] },
      { id: "frequency", basis: "RANGE", description: "Identify the SI unit of frequency.", satisfiedBy: ["EL-UNIT-HERTZ-001", "EL-CONCEPT-FREQUENCY-001"] },
      { id: "current", basis: "RANGE", description: "Identify the SI unit of current.", satisfiedBy: ["EL-UNIT-AMPERE-001", "EL-CONCEPT-CURRENT-001"] },
      { id: "voltage", basis: "RANGE", description: "Identify the SI unit of voltage.", satisfiedBy: ["EL-UNIT-VOLT-001", "EL-CONCEPT-VOLTAGE-001"] },
      { id: "energy", basis: "RANGE", description: "Identify the SI unit of energy.", satisfiedBy: ["EL-UNIT-JOULE-001", "EL-CONCEPT-ENERGY-001"] },
      { id: "energy-calculation", basis: "NECESSARY_PREREQUISITE", description: "Determine values of energy using E = P x t and its rearrangements.", satisfiedBy: ["EL-ENERGY-POWER-TIME-RELATIONSHIP-001", "EL-ENERGY-REARRANGE-001", "EL-ENERGY-CALC-001"] },
      { id: "charge", basis: "RANGE", description: "Identify the SI unit of charge (coulomb) and determine values of charge/current using I = Q / t.", satisfiedBy: ["EL-UNIT-COULOMB-001", "EL-CURRENT-CHARGE-CALC-001"] },
      { id: "impedance", basis: "RANGE", description: "Understand impedance as combined resistance/reactance and its unit.", satisfiedBy: ["EL-CONCEPT-IMPEDANCE-001"] },
      {
        // CC-09D (Unit 202 Official Public Assessment Calibration): the
        // first real use of OFFICIAL_ASSESSMENT_EVIDENCE (reserved since
        // CC-09B.6, populated here for the first time from genuine
        // official 2365-602 sample-assessment evidence, not guesswork).
        // Sample item 6 tests selecting the correct impedance formula
        // among plausible distractors -- positive evidence that AC2.2's
        // "impedance" Range item extends to formula recall/calculation,
        // not merely the qualitative "understand impedance" depth the
        // pre-existing obligation above already covers.
        id: "impedance-calculation", basis: "OFFICIAL_ASSESSMENT_EVIDENCE",
        description: "Recall and apply the impedance formula Z = sqrt(R^2 + X^2).",
        satisfiedBy: ["EL-REL-IMPEDANCE-001"],
      },
      { id: "reactance-general", basis: "RANGE", description: "Reactance as the frequency-dependent opposition to current in an AC circuit, underlying its inductive and capacitive forms.", satisfiedBy: ["EL-CONCEPT-REACTANCE-001"] },
      { id: "inductance-and-inductive-reactance", basis: "RANGE", description: "Distinguish inductance (henry) from inductive reactance (ohm), and state inductive reactance's frequency dependence.", satisfiedBy: ["EL-UNIT-HENRY-001", "EL-CONCEPT-INDUCTANCE-001", "EL-CONCEPT-INDUCTIVE-REACTANCE-001"] },
      { id: "capacitance-and-capacitive-reactance", basis: "RANGE", description: "Distinguish capacitance (farad) from capacitive reactance (ohm), and state capacitive reactance's frequency dependence.", satisfiedBy: ["EL-UNIT-FARAD-001", "EL-CONCEPT-CAPACITANCE-001", "EL-CONCEPT-CAPACITIVE-REACTANCE-001"] },
      { id: "power-factor", basis: "RANGE", description: "Understand power factor as real power / apparent power.", satisfiedBy: ["EL-CONCEPT-POWER-FACTOR-001"] },
    ],
  },
  {
    acNumber: "2.3",
    obligations: [
      { id: "voltmeter", basis: "RANGE", description: "Voltmeter: purpose, connection, and internal-resistance property.", satisfiedBy: ["EL-INSTRUMENT-VOLTMETER-001", "EL-INSTRUMENT-VOLTMETER-INTERNAL-RESISTANCE-001"] },
      { id: "ammeter", basis: "RANGE", description: "Ammeter: purpose, connection, and internal-resistance property.", satisfiedBy: ["EL-INSTRUMENT-AMMETER-001", "EL-INSTRUMENT-AMMETER-INTERNAL-RESISTANCE-001"] },
      { id: "ohmmeter", basis: "RANGE", description: "Ohmmeter: purpose and the de-energised-circuit requirement.", satisfiedBy: ["EL-INSTRUMENT-OHMMETER-001"] },
      { id: "wattmeter", basis: "RANGE", description: "Wattmeter: purpose (senses current and voltage to compute power).", satisfiedBy: ["EL-INSTRUMENT-WATTMETER-001"] },
      { id: "energy-meter", basis: "RANGE", description: "Energy meter: purpose (integrates power over time).", satisfiedBy: ["EL-INSTRUMENT-ENERGY-METER-001"] },
      { id: "multimeter-and-selection", basis: "EXPLICIT", description: "Multimeter as a combined instrument, and selecting the correct instrument for a given quantity.", satisfiedBy: ["EL-INSTRUMENT-MULTIMETER-001", "EL-INSTRUMENT-SELECT-001"] },
    ],
  },
  {
    acNumber: "3.1",
    obligations: [
      { id: "mass-meaning", basis: "EXPLICIT", description: "Specify what is meant by mass.", satisfiedBy: ["FP-CONCEPT-MASS-001"] },
      { id: "weight-meaning", basis: "EXPLICIT", description: "Specify what is meant by weight.", satisfiedBy: ["FP-CONCEPT-WEIGHT-001"] },
      { id: "weight-mass-relationship", basis: "NECESSARY_PREREQUISITE", description: "Relate weight to mass and gravitational field strength.", satisfiedBy: ["FP-REL-WEIGHT-MASS-001"] },
    ],
  },
  {
    acNumber: "3.2",
    obligations: [
      { id: "mechanical-advantage-principle", basis: "NECESSARY_PREREQUISITE", description: "General principle of mechanical advantage shared by levers/gears/pulleys.", satisfiedBy: ["FP-CONCEPT-MECHANICAL-ADVANTAGE-001"] },
      { id: "lever-principle-and-classes", basis: "RANGE", description: "Lever principle, and the three lever classes distinguished by pivot/effort/load arrangement.", satisfiedBy: ["FP-CONCEPT-LEVER-PRINCIPLE-001", "FP-LEVER-CLASS-I-001", "FP-LEVER-CLASS-II-001", "FP-LEVER-CLASS-III-001"] },
      {
        // CC-09B.6 (task section 7): AC3.2's own verb is "explain", not
        // "calculate", so the moment-balance relationship is not EXPLICIT
        // from the AC wording alone -- but the official SmartScreen
        // handout (Handout 16, "Levers") genuinely teaches lever
        // calculation with worked numeric examples, exactly analogous to
        // how gear-ratio and pulley-mechanical-advantage calculation are
        // already governed RANGE-basis content under this same AC.
        id: "lever-calculation", basis: "OFFICIAL_TEACHING_INTERPRETATION",
        description: "Calculate the effort or load in a balanced lever using the moment-balance relationship (effort x effort-arm = load x load-arm).",
        satisfiedBy: ["FP-REL-LEVER-BALANCE-001"],
      },
      { id: "gears", basis: "RANGE", description: "Gear principle (transmitting rotary motion) and gear-ratio mechanical advantage.", satisfiedBy: ["FP-CONCEPT-GEAR-001", "FP-REL-GEAR-RATIO-001"] },
      { id: "pulleys", basis: "RANGE", description: "Pulley principle, fixed-vs-movable distinction, and pulley mechanical advantage.", satisfiedBy: ["FP-CONCEPT-PULLEY-001", "FP-PULLEY-FIXED-VS-MOVABLE-001", "FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001"] },
    ],
  },
  {
    acNumber: "3.3",
    obligations: [
      { id: "force-meaning", basis: "EXPLICIT", description: "Describe what a force is.", satisfiedBy: ["FP-CONCEPT-FORCE-001"] },
      { id: "energy-meaning", basis: "EXPLICIT", description: "Describe energy in general, as the capacity to do work, before distinguishing its kinetic and potential forms.", satisfiedBy: ["FP-CONCEPT-ENERGY-001"] },
      { id: "work-meaning-and-relationship", basis: "EXPLICIT", description: "Describe work, and its relationship to force and distance (W = F x d).", satisfiedBy: ["FP-CONCEPT-WORK-001", "FP-REL-WORK-FORCE-DISTANCE-001"] },
      { id: "kinetic-energy-meaning-and-relationship", basis: "EXPLICIT", description: "Describe kinetic energy and its relationship to mass and speed (KE = half m v squared).", satisfiedBy: ["FP-CONCEPT-KINETIC-ENERGY-001", "FP-REL-KINETIC-ENERGY-001"] },
      { id: "potential-energy-meaning-and-relationship", basis: "EXPLICIT", description: "Describe gravitational potential energy and its relationship to mass, g and height (GPE = mgh).", satisfiedBy: ["FP-CONCEPT-POTENTIAL-ENERGY-001", "FP-REL-POTENTIAL-ENERGY-001"] },
      { id: "power-meaning-and-relationship", basis: "EXPLICIT", description: "Describe power and its relationship to work/energy and time.", satisfiedBy: ["FP-CONCEPT-POWER-001", "FP-REL-POWER-WORK-TIME-001"] },
      { id: "efficiency-meaning", basis: "EXPLICIT", description: "Describe efficiency as useful output over total input.", satisfiedBy: ["FP-CONCEPT-EFFICIENCY-001"] },
      { id: "interrelationships", basis: "NECESSARY_PREREQUISITE", description: "The electrical-efficiency bridge connecting these general-mechanics concepts to electrical power/energy.", satisfiedBy: ["EL-CONCEPT-ELECTRICAL-EFFICIENCY-001"] },
    ],
  },
  {
    acNumber: "3.4",
    obligations: [
      { id: "work-calculation", basis: "EXPLICIT", description: "Calculate work done from force and distance.", satisfiedBy: ["FP-CALC-WORK-001"] },
      { id: "kinetic-energy-calculation", basis: "EXPLICIT", description: "Calculate kinetic energy from mass and speed.", satisfiedBy: ["FP-CALC-KINETIC-ENERGY-001"] },
      { id: "potential-energy-calculation", basis: "EXPLICIT", description: "Calculate gravitational potential energy from mass, g and height.", satisfiedBy: ["FP-CALC-POTENTIAL-ENERGY-001"] },
      { id: "power-calculation", basis: "EXPLICIT", description: "Calculate power from work/energy and time.", satisfiedBy: ["FP-CALC-POWER-001"] },
      { id: "efficiency-calculation", basis: "EXPLICIT", description: "Calculate efficiency as a percentage from useful and total input/output.", satisfiedBy: ["FP-CALC-EFFICIENCY-001", "EL-CALC-ELECTRICAL-EFFICIENCY-001"] },
    ],
  },
  {
    acNumber: "4.1",
    obligations: [
      { id: "atomic-charge-structure", basis: "NECESSARY_PREREQUISITE", description: "Minimal atomic context: protons/electrons, free electrons in a conductor.", satisfiedBy: ["EL-CONCEPT-ATOMIC-CHARGE-STRUCTURE-001"] },
      { id: "charge-meaning", basis: "NECESSARY_PREREQUISITE", description: "Describe electric charge.", satisfiedBy: ["EL-CONCEPT-CHARGE-001"] },
      { id: "electron-theory-of-current", basis: "EXPLICIT", description: "Current as the flow of free electrons driven by potential difference.", satisfiedBy: ["EL-CONCEPT-ELECTRON-THEORY-001"] },
      { id: "current-charge-relationship", basis: "NECESSARY_PREREQUISITE", description: "Relate current to the rate of flow of charge (I = Q / t).", satisfiedBy: ["EL-CURRENT-CHARGE-RELATIONSHIP-001"] },
    ],
  },
  {
    acNumber: "4.2",
    obligations: [
      { id: "conductor-meaning", basis: "EXPLICIT", description: "Describe a conductor.", satisfiedBy: ["EL-CONCEPT-CONDUCTOR-001"] },
      { id: "insulator-meaning", basis: "EXPLICIT", description: "Describe an insulator.", satisfiedBy: ["EL-CONCEPT-INSULATOR-001"] },
      { id: "examples-and-breakdown", basis: "NECESSARY_PREREQUISITE", description: "Real conductor/insulator examples, and insulator voltage breakdown.", satisfiedBy: ["EL-MATERIAL-CONDUCTOR-INSULATOR-EXAMPLES-001", "EL-INSULATOR-BREAKDOWN-001"] },
    ],
  },
  {
    acNumber: "4.3",
    obligations: [
      { id: "resistance-meaning", basis: "EXPLICIT", description: "Describe resistance.", satisfiedBy: ["EL-CONCEPT-RESISTANCE-001"] },
      { id: "resistivity-meaning-and-relationship", basis: "EXPLICIT", description: "Describe resistivity and R = rho L / A.", satisfiedBy: ["EL-CONCEPT-RESISTIVITY-001", "EL-RESISTIVITY-RELATIONSHIP-001"] },
      { id: "factors-affecting-resistance", basis: "EXPLICIT", description: "How length, area, resistivity and temperature affect resistance.", satisfiedBy: ["EL-CONDUCTOR-RESISTANCE-FACTORS-001", "EL-RESISTIVITY-LENGTH-EFFECT-001", "EL-RESISTIVITY-AREA-EFFECT-001"] },
    ],
  },
  {
    acNumber: "4.4",
    obligations: [
      { id: "ohms-law-relationship", basis: "EXPLICIT", description: "State V = I R and the direct/inverse proportionality it implies.", satisfiedBy: ["EL-OHM-RELATIONSHIP-001", "EL-OHM-PROPORTIONALITY-001"] },
      { id: "series-behaviour", basis: "EXPLICIT", description: "Series circuit structure, current, voltage-sharing and total resistance.", satisfiedBy: ["EL-CIRCUIT-SERIES-STRUCTURE-001", "EL-SERIES-CURRENT-001", "EL-SERIES-VOLTAGE-001", "EL-SERIES-RESISTANCE-001"] },
      { id: "parallel-behaviour", basis: "EXPLICIT", description: "Parallel circuit structure, common voltage, current division and total resistance.", satisfiedBy: ["EL-CIRCUIT-PARALLEL-STRUCTURE-001", "EL-PARALLEL-VOLTAGE-001", "EL-PARALLEL-CURRENT-001", "EL-PARALLEL-RESISTANCE-001"] },
      { id: "equivalent-resistance-meaning", basis: "NECESSARY_PREREQUISITE", description: "What equivalent resistance means, underlying the series/parallel total-resistance relationships.", satisfiedBy: ["EL-CIRCUIT-EQUIVALENT-RESISTANCE-DEFINITION-001"] },
    ],
  },
  {
    acNumber: "4.5",
    obligations: [
      { id: "ohms-law-calculation", basis: "EXPLICIT", description: "Calculate the unknown of V, I or R given the other two.", satisfiedBy: ["EL-OHM-SOLVE-V-001", "EL-OHM-SOLVE-I-001", "EL-OHM-SOLVE-R-001"] },
      { id: "ohms-law-rearrangement-and-selection", basis: "NECESSARY_PREREQUISITE", description: "Algebraically rearrange V = I R and select the correct arrangement for the quantity required.", satisfiedBy: ["EL-OHM-REARRANGE-001", "EL-OHM-SELECT-RELATIONSHIP-001"] },
      { id: "series-resistance-calculation", basis: "EXPLICIT", description: "Calculate total series resistance and an individual series voltage drop.", satisfiedBy: ["EL-SERIES-RESISTANCE-CALC-001", "EL-SERIES-VOLTAGE-CALC-001"] },
      { id: "parallel-resistance-calculation", basis: "EXPLICIT", description: "Calculate total parallel resistance and an individual branch current.", satisfiedBy: ["EL-PARALLEL-RESISTANCE-CALC-001", "EL-PARALLEL-CURRENT-CALC-001"] },
      { id: "supply-current-calculation", basis: "EXPLICIT", description: "Calculate supply current in a series or parallel circuit.", satisfiedBy: ["EL-CIRCUIT-SUPPLY-CURRENT-SERIES-001", "EL-CIRCUIT-SUPPLY-CURRENT-PARALLEL-001"] },
    ],
  },
  {
    acNumber: "4.6",
    obligations: [
      { id: "power-relationship", basis: "EXPLICIT", description: "State P = V I and its I^2 R / V^2/R derived forms.", satisfiedBy: ["EL-POWER-RELATIONSHIP-001", "EL-POWER-DERIVED-VIR-001", "EL-POWER-DERIVED-V2R-001"] },
      { id: "power-rearrangement", basis: "NECESSARY_PREREQUISITE", description: "Algebraically rearrange P = V I to make voltage or current the subject.", satisfiedBy: ["EL-POWER-REARRANGE-001"] },
      { id: "power-calculation", basis: "EXPLICIT", description: "Calculate power from VI, I^2R or V^2/R.", satisfiedBy: ["EL-POWER-SOLVE-001", "EL-POWER-SOLVE-IR-001", "EL-POWER-SOLVE-V2R-001"] },
      { id: "series-parallel-power-calculation", basis: "EXPLICIT", description: "Calculate power dissipated by an individual series/parallel component.", satisfiedBy: ["EL-SERIES-POWER-CALC-001", "EL-PARALLEL-POWER-CALC-001"] },
      { id: "total-power", basis: "NECESSARY_PREREQUISITE", description: "Total circuit power is the sum of individual component powers.", satisfiedBy: ["EL-CIRCUIT-POWER-TOTAL-001"] },
    ],
  },
  {
    acNumber: "4.7",
    obligations: [
      { id: "voltage-drop-meaning", basis: "EXPLICIT", description: "State what is meant by voltage drop.", satisfiedBy: ["EL-VOLTAGE-DROP-001"] },
    ],
  },
  {
    acNumber: "4.8",
    obligations: [
      { id: "thermal-effect", basis: "EXPLICIT", description: "Describe the thermal effect of current.", satisfiedBy: ["EL-CURRENT-THERMAL-EFFECT-001"] },
      { id: "chemical-effect", basis: "EXPLICIT", description: "Describe the chemical effect of current.", satisfiedBy: ["EL-CURRENT-CHEMICAL-EFFECT-001"] },
      { id: "protective-devices", basis: "NECESSARY_PREREQUISITE", description: "Fuses/circuit breakers as an application of the thermal effect.", satisfiedBy: ["EL-PROTECTIVE-DEVICE-PURPOSE-001", "EL-FUSE-OPERATION-001"] },
    ],
  },
  {
    acNumber: "5.1",
    obligations: [
      { id: "magnetism-attraction-repulsion", basis: "EXPLICIT", description: "Describe magnetic attraction and repulsion.", satisfiedBy: ["EL-CONCEPT-MAGNETISM-001"] },
    ],
  },
  {
    acNumber: "5.2",
    obligations: [
      { id: "flux-meaning", basis: "EXPLICIT", description: "State what magnetic flux is.", satisfiedBy: ["EL-CONCEPT-MAGNETIC-FLUX-001"] },
      { id: "flux-density-meaning", basis: "EXPLICIT", description: "State the difference between flux and flux density.", satisfiedBy: ["EL-CONCEPT-MAGNETIC-FLUX-DENSITY-001"] },
      {
        // CC-09D: naming the SI unit alongside the quantity is the same
        // paired quantity+unit pattern every other electrical quantity in
        // this corpus already carries -- background knowledge necessary to
        // fully identify magnetic flux, not itself assessment-evidenced.
        id: "flux-unit", basis: "NECESSARY_PREREQUISITE",
        description: "Identify the SI unit of magnetic flux (weber).",
        satisfiedBy: ["EL-UNIT-WEBER-001"],
      },
      {
        // CC-09D: sample item 31 directly tests naming the SI unit of
        // magnetic flux density among real-but-wrong SI-unit distractors
        // (weber, henry, farad) -- positive OFFICIAL_ASSESSMENT_EVIDENCE
        // this specific unit-recognition fact is assessable.
        id: "flux-density-unit", basis: "OFFICIAL_ASSESSMENT_EVIDENCE",
        description: "Identify the SI unit of magnetic flux density (tesla).",
        satisfiedBy: ["EL-UNIT-TESLA-001"],
      },
    ],
  },
  {
    acNumber: "5.3",
    obligations: [
      { id: "field-from-current", basis: "EXPLICIT", description: "A current-carrying conductor produces a magnetic field.", satisfiedBy: ["EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001"] },
      {
        // CC-09B.6 (task section 9): "production of a magnetic field" is
        // EXPLICIT in AC5.3's own wording, and the official SmartScreen
        // handout (Handout 9) teaches the field's DIRECTION (Maxwell's
        // screw rule) as part of describing that production -- necessary
        // to fully "describe" this AC5.3 sub-topic, not merely that a
        // field exists.
        id: "field-direction-rule", basis: "OFFICIAL_TEACHING_INTERPRETATION",
        description: "Determine the direction of the magnetic field around a straight current-carrying conductor (Maxwell's screw rule / right-hand rule).",
        satisfiedBy: ["EL-CONCEPT-FIELD-DIRECTION-RULE-001"],
      },
      { id: "force-on-conductor", basis: "EXPLICIT", description: "A current-carrying conductor in a field experiences a force.", satisfiedBy: ["EL-CONCEPT-FORCE-ON-CONDUCTOR-001"] },
      {
        // CC-09B.6 (adversarial gap review, task section 30): the official
        // SmartScreen handout dedicates an entire handout to F = B I l and
        // Fleming's left-hand rule under this exact AC5.3 sub-topic.
        id: "force-on-conductor-calculation", basis: "OFFICIAL_TEACHING_INTERPRETATION",
        description: "Calculate the force on a current-carrying conductor using F = B I l, and determine its direction using Fleming's left-hand rule.",
        satisfiedBy: ["EL-REL-FORCE-ON-CONDUCTOR-001", "EL-CONCEPT-FLEMING-LEFT-HAND-001"],
      },
      { id: "electromagnetism-meaning", basis: "EXPLICIT", description: "Describe electromagnetism as the current/magnetism relationship.", satisfiedBy: ["EL-CONCEPT-ELECTROMAGNETISM-001"] },
      { id: "emf-meaning", basis: "EXPLICIT", description: "Describe electromotive force.", satisfiedBy: ["EL-CONCEPT-EMF-001"] },
      {
        // CC-09B.6: as above, for e = B l v and Fleming's right-hand rule
        // (Handout 10, "Generation of an EMF").
        id: "induced-emf-calculation", basis: "OFFICIAL_TEACHING_INTERPRETATION",
        description: "Calculate the EMF induced in a conductor moving through a magnetic field using e = B l v, and determine the induced current's direction using Fleming's right-hand rule.",
        satisfiedBy: ["EL-REL-INDUCED-EMF-001", "EL-CONCEPT-FLEMING-RIGHT-HAND-001"],
      },
    ],
  },
  {
    acNumber: "5.4",
    obligations: [
      { id: "electromagnetic-induction", basis: "NECESSARY_PREREQUISITE", description: "A changing flux induces an EMF (the causal principle underlying generation).", satisfiedBy: ["EL-CONCEPT-ELECTROMAGNETIC-INDUCTION-001"] },
      {
        // CC-09D: sample item 35 requires CALCULATING the flux change from
        // a given induced EMF and time interval -- positive
        // OFFICIAL_ASSESSMENT_EVIDENCE that this AC extends to the
        // quantitative Faraday's-law relationship, not merely the
        // qualitative causal principle above.
        id: "flux-change-emf-calculation", basis: "OFFICIAL_ASSESSMENT_EVIDENCE",
        // CC-09D.1: narrowed to "single loop" alongside the assertion's own
        // correction -- matches both the formula (no N-turn factor) and
        // AC5.4's own "single-loop generator" wording.
        description: "Calculate the EMF induced in a single loop by a changing magnetic flux (or the flux change from a given EMF and time), e = (change in flux) / (time taken).",
        satisfiedBy: ["EL-REL-FLUX-CHANGE-EMF-001"],
      },
      { id: "ac-generator-principle", basis: "EXPLICIT", description: "A single-loop generator produces alternating EMF by rotating within a field.", satisfiedBy: ["EL-CONCEPT-AC-GENERATOR-001"] },
      { id: "sine-wave-output", basis: "EXPLICIT", description: "The generator's EMF varies as a sine wave.", satisfiedBy: ["EL-CONCEPT-SINE-WAVE-001"] },
      { id: "ac-dc-distinction", basis: "EXPLICIT", description: "Distinguish A.C. from D.C.", satisfiedBy: ["EL-CONCEPT-AC-DC-DISTINCTION-001"] },
    ],
  },
  {
    acNumber: "5.5",
    obligations: [
      { id: "rms-value", basis: "RANGE", description: "Define RMS value.", satisfiedBy: ["EL-WAVEFORM-RMS-001"] },
      { id: "average-value", basis: "RANGE", description: "Define the average value used in AC calculations.", satisfiedBy: ["EL-WAVEFORM-AVERAGE-VALUE-001"] },
      { id: "peak-to-peak-value", basis: "RANGE", description: "Define peak-to-peak value.", satisfiedBy: ["EL-WAVEFORM-PEAK-TO-PEAK-001"] },
      { id: "periodic-time", basis: "RANGE", description: "Define periodic time.", satisfiedBy: ["EL-WAVEFORM-PERIODIC-TIME-001"] },
      { id: "frequency", basis: "RANGE", description: "Define frequency.", satisfiedBy: ["EL-CONCEPT-FREQUENCY-001"] },
      { id: "amplitude", basis: "RANGE", description: "Define amplitude.", satisfiedBy: ["EL-WAVEFORM-AMPLITUDE-001"] },
      { id: "rms-peak-relationship-and-calculation", basis: "NECESSARY_PREREQUISITE", description: "Relate RMS to peak, and calculate one from the other.", satisfiedBy: ["EL-WAVEFORM-RMS-PEAK-RELATIONSHIP-001", "EL-WAVEFORM-RMS-CALC-001"] },
      { id: "frequency-period-relationship-and-calculation", basis: "NECESSARY_PREREQUISITE", description: "Relate frequency to periodic time, and calculate one from the other.", satisfiedBy: ["EL-WAVEFORM-FREQUENCY-PERIOD-RELATIONSHIP-001", "EL-WAVEFORM-FREQUENCY-CALC-001"] },
    ],
  },
  {
    acNumber: "6.1",
    obligations: [
      { id: "dimmer-switch-application", basis: "RANGE", description: "Which component and why: dimmer switches.", satisfiedBy: ["EL-APPLICATION-DIMMER-SWITCH-001"] },
      { id: "motor-control-application", basis: "RANGE", description: "Which component and why: motor control.", satisfiedBy: ["EL-APPLICATION-MOTOR-CONTROL-001"] },
      { id: "heating-boiler-control-application", basis: "RANGE", description: "Which component and why: heating/boiler controls.", satisfiedBy: ["EL-APPLICATION-HEATING-BOILER-CONTROL-001"] },
      {
        // CC-09B.6 correction (task section 14): the official SmartScreen
        // handout (Handout 18, "Electronic systems") teaches a transistor/
        // thyristor switching-and-latching circuit, not a beam-break
        // sensor. EL-APPLICATION-SECURITY-ALARM-001 (beam-break) is
        // retained as valid reusable EL knowledge (now SUPPORTS-mapped,
        // not REQUIRED_FOR) but no longer satisfies this obligation alone.
        id: "security-alarm-application", basis: "OFFICIAL_TEACHING_INTERPRETATION",
        description: "Which component and why: security alarms (transistor senses a break in a normally-closed loop; a thyristor latches on to hold a sounder active).",
        satisfiedBy: ["EL-APPLICATION-SECURITY-ALARM-TRANSISTOR-THYRISTOR-001"],
      },
      {
        // CC-09B.6 correction (task section 15): the official SmartScreen
        // handout teaches the master telephone socket's capacitor/
        // resistor/surge-protector, not the DAA diode-bridge.
        // EL-APPLICATION-TELEPHONE-001 (diode bridge) is retained as valid
        // reusable EL knowledge (now SUPPORTS-mapped) but no longer
        // satisfies this obligation alone.
        id: "telephone-application", basis: "OFFICIAL_TEACHING_INTERPRETATION",
        description: "Which component and why: the traditional UK master socket arrangement (capacitor for ringing, resistor for line testing, and -- on older sockets -- a surge protector).",
        satisfiedBy: ["EL-APPLICATION-TELEPHONE-MASTER-SOCKET-001"],
      },
      // CC-09B.3: re-closed via the Holtek HT12D/HT12F decoder datasheet
      // (a real, first-party remote-control IC datasheet explicitly
      // naming garage-door/car-door/alarm/remote-control applications).
      // CC-09B.6 (task section 16): confirmed directionally appropriate --
      // the official SmartScreen handout names comparable generic
      // application categories (lighting, shutters/blinds, gates/latches)
      // without requiring decoder-IC implementation detail, matching the
      // already-narrowed CC-09B.5 statement. No change.
      { id: "wireless-control-application", basis: "RANGE", description: "Which component and why: wireless control systems.", satisfiedBy: ["EL-APPLICATION-WIRELESS-CONTROL-001"] },
    ],
  },
  {
    acNumber: "6.2",
    obligations: [
      { id: "capacitors", basis: "RANGE", description: "Basic operating principle of a capacitor as a component.", satisfiedBy: ["EL-COMPONENT-CAPACITOR-001"] },
      { id: "resistors", basis: "RANGE", description: "Basic operating principle of a resistor as a component.", satisfiedBy: ["EL-COMPONENT-RESISTOR-001"] },
      { id: "rectifiers", basis: "RANGE", description: "Basic operating principle of a rectifier.", satisfiedBy: ["EL-COMPONENT-RECTIFIER-001"] },
      {
        // CC-09B.6 (task section 19): the official SmartScreen handout
        // (Handout 17) explicitly distinguishes half-wave (one diode) from
        // full-wave/bridge (four diodes) rectification as named Level-2
        // teaching content, beyond the generic rectifier concept above.
        id: "rectifier-half-vs-full-wave", basis: "OFFICIAL_TEACHING_INTERPRETATION",
        description: "Distinguish half-wave rectification (single diode, blocks one AC half-cycle) from full-wave bridge rectification (four diodes, both half-cycles converted to the same output polarity).",
        satisfiedBy: ["EL-COMPONENT-RECTIFIER-HALF-WAVE-001", "EL-COMPONENT-RECTIFIER-FULL-WAVE-001"],
      },
      { id: "diodes", basis: "RANGE", description: "Basic operating principle of a diode.", satisfiedBy: ["EL-COMPONENT-DIODE-001"] },
      { id: "zener", basis: "RANGE", description: "Basic operating principle of a Zener diode.", satisfiedBy: ["EL-COMPONENT-ZENER-DIODE-001"] },
      { id: "led", basis: "RANGE", description: "Basic operating principle of an LED.", satisfiedBy: ["EL-COMPONENT-LED-001"] },
      { id: "photo", basis: "RANGE", description: "Basic operating principle of a photodiode.", satisfiedBy: ["EL-COMPONENT-PHOTODIODE-001"] },
      { id: "thermistors", basis: "RANGE", description: "Basic operating principle of a thermistor.", satisfiedBy: ["EL-COMPONENT-THERMISTOR-001"] },
      {
        // CC-09B.6 (task section 18): the official SmartScreen handout
        // (Handout 17) explicitly names both PTC and NTC as the two
        // thermistor types; PTC was genuinely missing, not merely
        // under-decomposed.
        id: "thermistors-ptc", basis: "OFFICIAL_TEACHING_INTERPRETATION",
        description: "Basic operating principle of a PTC thermistor, in contrast to the NTC type.",
        satisfiedBy: ["EL-COMPONENT-THERMISTOR-PTC-001"],
      },
      { id: "diacs", basis: "RANGE", description: "Basic operating principle of a DIAC.", satisfiedBy: ["EL-COMPONENT-DIAC-001"] },
      { id: "triacs", basis: "RANGE", description: "Basic operating principle of a TRIAC.", satisfiedBy: ["EL-COMPONENT-TRIAC-001"] },
      { id: "transistors", basis: "RANGE", description: "Basic operating principle of a transistor.", satisfiedBy: ["EL-COMPONENT-TRANSISTOR-001"] },
      { id: "thyristors", basis: "RANGE", description: "Basic operating principle of a thyristor (SCR).", satisfiedBy: ["EL-COMPONENT-THYRISTOR-SCR-001"] },
      { id: "invertors", basis: "RANGE", description: "Basic operating principle of an inverter.", satisfiedBy: ["EL-COMPONENT-INVERTER-001"] },
    ],
  },
];
