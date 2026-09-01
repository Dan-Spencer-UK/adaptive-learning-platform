/**
 * CC-17B: frozen snapshot of every CC-17 row's own blind-baseline-defining
 * fields, extracted from the ACTUAL COMMITTED CC-17 STATE -- not from the
 * current worktree -- so the CC-17B/downstream regression test genuinely
 * proves later packages preserved these values, rather than merely
 * re-asserting whatever the worktree happened to contain when the fixture
 * was generated (the provenance weakness CC-17A's own first snapshot had,
 * per the Project Architect's CC-17B finding).
 *
 * SOURCE COMMIT: 5d4595314f17dbadcf8bf971ad0fa522ceb1715c ("5d45953", "audit: export Unit 202 blind calibration baseline")
 * SOURCE PATH:   scripts/content/data/unit202-blind-calibration-baseline.ts (at that commit)
 * GENERATION METHOD: `git show 5d45953:scripts/content/data/unit202-blind-calibration-baseline.ts`
 *   piped to a temporary file inside scripts/content/data/ (so its own
 *   relative imports and @alp/content-schema package resolution work
 *   identically to the live file), imported by a one-off generator script,
 *   and serialised field-by-field into the object below -- never hand-typed
 *   and never sourced from the current worktree ledger. The temporary copy
 *   was deleted immediately after generation; this file is the only
 *   persisted artefact of that extraction.
 *
 * FIELDS CAPTURED per calibrationKey: publicSpecificationAnchor,
 * publicRangeAnchor, publicAssessmentAnchor,
 * transferablePrerequisiteJustification, blindBaselineRequirement,
 * blindBaselineDepth, blindBaselineRationale, blindConfidence -- exactly
 * the fields CC-17B's own governing instruction requires proving unchanged.
 *
 * AUTHORISED EXCEPTION: CC-17B explicitly authorised exactly one blind-field
 * correction on top of this historical baseline -- the
 * `cross-cutting-matrix-vs-baseline-scope-of-analysis` row's own
 * `blindBaselineRequirement` (a stale, arithmetically-inconsistent
 * methodology-record hand-count, not learner-content). The comparison test
 * in validate-unit202-blind-calibration-baseline.test.ts explicitly allows
 * and names only that one field on that one row as a permitted difference
 * from this snapshot -- every other row/field must remain byte-identical.
 */

export const unit202BlindCalibrationBaseline5d45953Snapshot: Record<
  string,
  {
    publicSpecificationAnchor: string;
    publicRangeAnchor?: string;
    publicAssessmentAnchor?: string;
    transferablePrerequisiteJustification?: string;
    blindBaselineRequirement: string;
    blindBaselineDepth: string;
    blindBaselineRationale: string;
    blindConfidence: string;
  }
> = {
  "ac1-1-fractions-percentages": {
    "publicSpecificationAnchor": "AC1.1: 'Identify and apply appropriate mathematical principles which are relevant to electrical work tasks.'",
    "publicRangeAnchor": "Official Range: 'Fractions and percentages'.",
    "publicAssessmentAnchor": "Matrix records: 'Sample B: percentage and mean' (public sample-assessment evidence).",
    "blindBaselineRequirement": "Convert between fractions, decimals and percentages; perform the four arithmetic operations on fractions/decimals; calculate a percentage of a quantity and a percentage change, in an electrical-work numeric context.",
    "blindBaselineDepth": "Level-2 applied arithmetic: straightforward conversion and calculation with realistic electrical quantities as the numeric content. Does not include compound/repeated percentage problems or formal ratio/proportion theory beyond what 'apply' at Level 2 implies.",
    "blindBaselineRationale": "AC1.1's own verb 'apply' plus the Range's own label directly requires calculation-level performance, not mere recognition; Level 2 numeracy conventionally includes the four operations on fractions/decimals/percentages as prerequisite arithmetic for any applied calculation elsewhere in the unit.",
    "blindConfidence": "HIGH"
  },
  "ac1-1-algebra-transposition": {
    "publicSpecificationAnchor": "AC1.1: 'Identify and apply appropriate mathematical principles...'",
    "publicRangeAnchor": "Official Range: 'Algebra'; 'Transposition'.",
    "publicAssessmentAnchor": "Matrix records: 'Sample A: formula transposition' (public sample-assessment evidence).",
    "transferablePrerequisiteJustification": "Necessary prerequisite for AC3.4/4.5/4.6/4.7's own calculation performances, which require rearranging W=Fd, P=VI, R=rhoL/A etc.",
    "blindBaselineRequirement": "Substitute known values into a given electrical/mechanical formula; algebraically rearrange (transpose) a formula to isolate a different unknown, including squared and square-root forms.",
    "blindBaselineDepth": "Rearrangement of formulae already used elsewhere in the unit (single-step and simple multi-step transposition). Does not include simultaneous equations, quadratic formula derivation, or abstract algebraic proof.",
    "blindBaselineRationale": "Direct Range anchor for both 'Algebra' and 'Transposition'; sample-assessment evidence confirms transposition is tested. The specific formulae used are drawn from elsewhere in the unit (Ohm's law, power, etc.) as the natural numeric content for an 'apply' verb at Level 2, per general prerequisite reasoning -- a learner cannot perform later calculation ACs (4.5, 4.6, 3.4) without this.",
    "blindConfidence": "HIGH"
  },
  "ac1-1-indices-and-notation": {
    "publicSpecificationAnchor": "AC1.1: 'Identify and apply appropriate mathematical principles...'",
    "publicRangeAnchor": "Official Range: 'Indices'.",
    "transferablePrerequisiteJustification": "Necessary prerequisite for AC2.1's SI-prefix conversions and any calculation elsewhere in the unit involving milli-/kilo-/mega- prefixed values.",
    "blindBaselineRequirement": "Apply the laws of indices for multiplying/dividing powers of the same base; convert between standard/scientific notation and ordinary decimal form.",
    "blindBaselineDepth": "Integer-exponent laws and scientific notation sufficient to handle SI-prefixed electrical quantities (e.g. milliamps, kilowatts) in calculations. Whether fractional/negative indices (roots expressed as powers) are required cannot be confidently derived from the Range label 'Indices' alone -- the bare word does not specify integer-only vs. all-index-forms scope.",
    "blindBaselineRationale": "Direct Range anchor. Scientific/engineering notation is a necessary prerequisite for working with SI-prefixed electrical quantities used throughout the unit (Range item 'Length' etc. in AC2.1 explicitly requires 'common metric prefixes/conversions').",
    "blindConfidence": "MEDIUM"
  },
  "ac1-1-pythagoras-trig": {
    "publicSpecificationAnchor": "AC1.1: 'Identify and apply appropriate mathematical principles...'",
    "publicRangeAnchor": "Official Range: 'Triangles and trigonometry'.",
    "publicAssessmentAnchor": "Matrix records: 'Sample A: ...cosine' (public sample-assessment evidence).",
    "blindBaselineRequirement": "State and apply Pythagoras' theorem, and the sine/cosine/tangent ratios, to find an unknown side or angle of a right-angled triangle.",
    "blindBaselineDepth": "Right-triangle-only trigonometry at Level 2 (SOHCAHTOA and Pythagoras). No non-right-triangle trigonometry (sine/cosine rule), no radian measure, no trigonometric identities.",
    "blindBaselineRationale": "Direct Range anchor; sample-assessment evidence confirms at least cosine is tested. Level-2 qualifications conventionally cap trigonometry at right-triangle ratios.",
    "blindConfidence": "HIGH"
  },
  "ac1-1-statistics-mean-median-mode": {
    "publicSpecificationAnchor": "AC1.1: 'Identify and apply appropriate mathematical principles...'",
    "publicRangeAnchor": "Official Range: 'Statistics' (no sub-items named in the Range box itself).",
    "blindBaselineRequirement": "Calculate the mean, median and mode of a small numeric dataset.",
    "blindBaselineDepth": "The three most conventional Level-2 'descriptive statistics' measures (mean/median/mode). Whether 'range' (the spread measure) is also required cannot be confidently derived from the bare word 'Statistics' alone.",
    "blindBaselineRationale": "Direct Range anchor, though the Range label is terse (a single word with no enumerated sub-items). Mean/median/mode are the conventional minimum content any 'Statistics' topic at Level 2 numeracy would include; 'range' as a fourth measure is a common but not universal pairing.",
    "blindConfidence": "MEDIUM"
  },
  "ac2-1-base-quantity-units": {
    "publicSpecificationAnchor": "AC2.1: 'Identify and use internationally recognised base and derived (SI) units of measurement.'",
    "publicRangeAnchor": "Official Range: 'Length'; 'Area'; 'Volume'; 'Mass'; 'Density'; 'Time'; 'Velocity'.",
    "blindBaselineRequirement": "Identify the correct SI unit and symbol for each of length (m), area (m2), volume (m3), mass (kg), density (kg/m3), time (s) and velocity (m/s), and convert between common metric-prefixed values of each (e.g. mm to m).",
    "blindBaselineDepth": "Recognition/identification-level, including ordinary prefix conversion -- not derivation of the units from first principles, and no dimensional-analysis proofs.",
    "blindBaselineRationale": "Direct Range anchor for all seven items; AC's own verb is 'identify and use', which the technical-source dossier's approved BIPM SI Brochure factually supports as the correct unit set for each named quantity.",
    "blindConfidence": "HIGH"
  },
  "ac2-1-temperature-kelvin-celsius": {
    "publicSpecificationAnchor": "AC2.1: 'Identify and use internationally recognised base and derived (SI) units of measurement.'",
    "publicRangeAnchor": "Official Range: 'Temperature'.",
    "publicAssessmentAnchor": "Matrix records: 'Sample A tests kelvin' (public sample-assessment evidence).",
    "blindBaselineRequirement": "Identify kelvin (K) as the SI base unit of thermodynamic temperature, and recognise degree Celsius as a legitimate, commonly-used practical temperature scale related to it (not a replacement SI base unit).",
    "blindBaselineDepth": "Recognition of the correct SI base unit only -- no requirement to perform Kelvin<->Celsius numeric conversion unless a later AC's calculation context needs it (none currently does).",
    "blindBaselineRationale": "Direct Range anchor and direct public sample-assessment evidence (kelvin tested). The approved technical-source dossier's BIPM SI Brochure is unambiguous that kelvin, not Celsius, is the SI base unit -- this is a factual-truth ceiling independent of any teaching material's own table.",
    "blindConfidence": "HIGH"
  },
  "ac2-2-quantity-symbol-unit-recognition": {
    "publicSpecificationAnchor": "AC2.2: 'Identify and determine values of base and derived SI units which apply specifically to electrical quantities.'",
    "publicRangeAnchor": "Official Range: all 11 items listed (Resistance through Power factor).",
    "publicAssessmentAnchor": "Matrix records specific sample-assessment items for several quantities (e.g. 'Sample A tests impedance unit, XL symbol, energy unit; Sample B tests resistivity unit, voltage unit, capacitance unit').",
    "blindBaselineRequirement": "For each of the 11 named electrical quantities, identify its conventional symbol and correct SI unit, and distinguish quantities that share a unit (e.g. resistance and impedance both in ohms) or a name root (resistance vs resistivity; inductance vs inductive reactance; capacitance vs capacitive reactance).",
    "blindBaselineDepth": "Recognition/identification and conceptual distinction ONLY. Does not include calculation using any of the deeper AC-circuit relationships (Z=sqrt(R^2+X^2), XL=2*pi*f*L, XC=1/(2*pi*f*C), power-factor numeric calculation) -- see the dedicated calculation-depth row below for why.",
    "blindBaselineRationale": "AC2.2's own verb is 'identify and determine values of ... units' -- this is a unit-identification verb, not a circuit-analysis-calculation verb. Direct Range anchor for every item.",
    "blindConfidence": "HIGH"
  },
  "ac2-2-ac-quantity-calculation-depth-ceiling": {
    "publicSpecificationAnchor": "AC2.2: 'Identify and determine values of base and derived SI units...'",
    "publicRangeAnchor": "Official Range: 'Impedance'; 'Inductance and inductive reactance'; 'Capacitance and capacitive reactance'; 'Power factor'.",
    "blindBaselineRequirement": "Recognise that impedance/reactance/power factor are distinct AC-circuit quantities with their own units and general meaning (e.g. 'power factor is dimensionless, near 1 for a purely resistive load'), WITHOUT being required to calculate a numeric impedance, reactance or power-factor value from component values and frequency.",
    "blindBaselineDepth": "Explicitly a ceiling, not an addition: recognition/conceptual-distinction depth only. Full AC-circuit calculation (Z=sqrt(R^2+X^2), XL/XC formulae, numeric power-factor calculation) is Level-3-adjacent content that AC2.2's own unit-identification verb does not require, and which no other AC in this LO2 cluster explicitly requires either.",
    "blindBaselineRationale": "Command-verb analysis: 'identify and determine values of ... units' is about naming/recognising the unit for a quantity, not deriving that quantity's numeric value through circuit analysis. No AC in LO2 uses a calculation verb ('calculate') for these four Range items, unlike AC4.5/4.6 which explicitly use 'calculate' for DC quantities. Absent an explicit calculation verb or Range treatment, the transferable methodology defaults to the narrower (recognition-only) reading for genuinely Level-3-adjacent content.",
    "blindConfidence": "MEDIUM"
  },
  "ac2-3-instrument-selection-connection": {
    "publicSpecificationAnchor": "AC2.3: 'Identify appropriate electrical instruments for the measurement of different electrical quantities.'",
    "publicRangeAnchor": "Official Range: 'Resistance'; 'Current'; 'Voltage'.",
    "blindBaselineRequirement": "Identify the ohmmeter/ammeter/voltmeter as the correct instrument for resistance/current/voltage respectively; state the basic connection topology (ohmmeter across a de-energised item, ammeter in series with very low internal resistance, voltmeter in parallel with high internal resistance).",
    "blindBaselineDepth": "Instrument identification plus basic connection-topology recognition. The specific 'very low'/'high' internal-resistance qualifiers are a standard, textbook-level factual property of these instrument types (confirmed by the approved technical-source dossier), not an assumption from teaching material.",
    "blindBaselineRationale": "Direct Range anchor; AC's own verb is 'identify'. Connection topology is a necessary minimal elaboration of 'identify... instruments for measurement' -- an instrument identified without knowing how to connect it safely cannot be meaningfully used, which is implicit in the AC's practical framing (this is a vocational, not purely theoretical, qualification).",
    "blindConfidence": "HIGH"
  },
  "ac2-3-wattmeter-energy-meter": {
    "publicSpecificationAnchor": "AC2.3: 'Identify appropriate electrical instruments for the measurement of different electrical quantities.'",
    "publicRangeAnchor": "Official Range: 'Power'; 'Energy'.",
    "blindBaselineRequirement": "Identify the wattmeter as the power-measuring instrument (sensing both current and voltage to compute power) and the energy meter as the instrument that integrates power over time to measure energy (kWh).",
    "blindBaselineDepth": "Recognition-level: instrument identity and basic principle only, no internal-design detail.",
    "blindBaselineRationale": "Direct Range anchor. 'Integrates power over time' is a definitionally necessary elaboration of what an energy meter IS (distinguishing it from an instantaneous-power wattmeter) -- this is basic dimensional reasoning (energy = power x time) rather than teaching-material-derived detail.",
    "blindConfidence": "HIGH"
  },
  "ac3-1-mass-weight-definitions-relationship": {
    "publicSpecificationAnchor": "AC3.1: 'Specify what is meant by mass and weight.'",
    "publicAssessmentAnchor": "Matrix records: 'Sample B includes mass-from-force calculation under LO3' (public sample-assessment evidence).",
    "blindBaselineRequirement": "Define mass (amount of matter, kg, invariant with location) and weight (force due to gravity, N, depends on gravitational field strength); state and apply W=mg (and its rearrangement m=W/g) using g~=9.81 m/s^2 on Earth.",
    "blindBaselineDepth": "Definitional distinction plus a single calculation relationship in both directions. No gravitation theory, orbital mechanics, or field-strength derivation.",
    "blindBaselineRationale": "AC's own verb 'specify' is definitional, but sample-assessment evidence confirms calculation is genuinely tested -- so the blind baseline includes W=mg calculation despite the milder verb, on the strength of tier-2 (public assessment) evidence alone. g's numeric value is drawn from the approved technical-source dossier (NIST SP811 Appendix B.8), a factual-truth tier.",
    "blindConfidence": "HIGH"
  },
  "ac3-2-lever-classes-and-balance": {
    "publicSpecificationAnchor": "AC3.2: 'Explain the principles of basic mechanics as they apply to levers, gears and pulleys.'",
    "publicRangeAnchor": "Official Range: 'Class I'; 'Class II'; 'Class III' (the ONLY structured Range items this AC has -- see the dedicated structural-gap row below).",
    "publicAssessmentAnchor": "Matrix records: 'Sample A tests lever class, lever effort...; Sample B tests lever class...' (public sample-assessment evidence).",
    "transferablePrerequisiteJustification": "The moment-balance relationship is standard introductory mechanics (torque balance about a pivot); AC3.2's own verb 'explain the principles' plausibly extends to the relationship that DEFINES lever mechanical advantage, not merely naming the three classes.",
    "blindBaselineRequirement": "Classify a lever arrangement by its Class (I/II/III, by fulcrum/effort/load position) and recognise common examples of each; state and apply the moment-balance relationship (effort x effort-distance = load x load-distance) to find an unknown effort or load.",
    "blindBaselineDepth": "Classification plus single-relationship calculation. No detailed machine design or friction modelling.",
    "blindBaselineRationale": "Direct Range anchor for the three classes; sample-assessment evidence confirms both classification AND effort-calculation are tested. The moment-balance formula itself is a necessary-prerequisite physical relationship (basic static-equilibrium torque balance), independently derivable from general Level-2 mechanics.",
    "blindConfidence": "MEDIUM"
  },
  "ac3-2-structural-gap-gears-pulleys-no-range-item": {
    "publicSpecificationAnchor": "AC3.2: 'Explain the principles of basic mechanics as they apply to levers, gears AND PULLEYS.'",
    "publicRangeAnchor": "NONE -- the official Range box for AC3.2 in the governed matrix's own encoding contains only 'Class I'/'Class II'/'Class III' (lever classes); no gear or pulley Range item exists at all.",
    "blindBaselineRequirement": "STRUCTURAL FINDING, not a proposition: AC3.2's own title names three mechanisms (levers, gears, pulleys) but the governed matrix's structured official-Range encoding only enumerates lever classes. Under the blind method, gears and pulleys are anchored ONLY by the AC's own title wording (tier-1 evidence), never by a distinct Range entry (no tier-1 Range anchor exists for them at all).",
    "blindBaselineDepth": "Not applicable to this row (structural-gap record, not a content proposition) -- see the two following rows for the blind baseline's own gear/pulley content reconstruction.",
    "blindBaselineRationale": "This is a factual observation about the governed matrix's own data structure (independently confirmed by CC-16's audit and its own regression test asserting AC3.2's officialRangeCoverage contains exactly the three lever-class rows and nothing else), reported here so the Project Architect can see it in the calibration pack alongside the gear/pulley content it explains the weaker anchoring of.",
    "blindConfidence": "HIGH"
  },
  "ac3-2-gears": {
    "publicSpecificationAnchor": "AC3.2: 'Explain the principles of basic mechanics as they apply to levers, gears and pulleys.'",
    "publicRangeAnchor": "None (see structural-gap row above) -- anchored by the AC's own title wording only.",
    "publicAssessmentAnchor": "Matrix records: 'Sample A tests... gear speed...; Sample B tests... gear ratio' (public sample-assessment evidence).",
    "blindBaselineRequirement": "Explain that a gear transmits rotary motion between a driver and driven gear; state that gear ratio relates tooth-count to speed ratio and to direction of rotation (meshed gears reverse direction; an idler gear between them restores the original direction without changing the ratio); calculate driven-gear speed from tooth-count ratio.",
    "blindBaselineDepth": "Basic gear-train kinematics (ratio, direction, idler effect) and a single calculation relationship. No gear-geometry design or force/torque-through-gear-train calculation beyond the basic trade-off that a slower gear delivers more torque, less speed (ideal energy conservation, not power creation).",
    "blindBaselineRationale": "Anchored by the AC's own title word 'gears'; sample-assessment evidence confirms gear-speed/ratio calculation is tested. The idler-direction-reversal fact and the force/speed trade-off (never creating power) are basic mechanical facts confirmed by the approved technical-source dossier.",
    "blindConfidence": "MEDIUM"
  },
  "ac3-2-pulleys": {
    "publicSpecificationAnchor": "AC3.2: 'Explain the principles of basic mechanics as they apply to levers, gears and pulleys.'",
    "publicRangeAnchor": "None (see structural-gap row above) -- anchored by the AC's own title wording only.",
    "publicAssessmentAnchor": "Matrix records: 'Sample A tests... pulley effort; Sample B tests... pulley MA' (public sample-assessment evidence).",
    "blindBaselineRequirement": "Explain that a pulley system's ideal mechanical advantage equals the number of rope strands supporting the load; calculate the effort needed to lift a given load from the mechanical advantage (or vice versa).",
    "blindBaselineDepth": "Single relationship and its calculation. No block-and-tackle design detail or friction/efficiency-loss modelling beyond the general 'ideal machines trade force for distance, never create power' principle shared with levers/gears.",
    "blindBaselineRationale": "Anchored by the AC's own title word 'pulleys'; sample-assessment evidence confirms pulley-effort/MA calculation is tested (matching the exact approved technical-source dossier finding, CC-15A, that OpenStax Physics 9.3's own worked practice problem tests precisely this calculation).",
    "blindConfidence": "MEDIUM"
  },
  "ac3-3-mechanics-concepts": {
    "publicSpecificationAnchor": "AC3.3: 'Describe the main principles of force, work, energy (kinetic and potential), power and efficiency, and their interrelationships.'",
    "publicAssessmentAnchor": "Matrix records: 'Sample A tests work formula; Sample B tests force as mass x gravity' (public sample-assessment evidence).",
    "blindBaselineRequirement": "Describe force (a push/pull affecting motion, deformation or equilibrium, including gravity as a specific force); work (done when a force causes displacement, W=Fd); energy (capacity to do work; kinetic vs potential as distinct conceptual forms); power (rate of doing work); efficiency (useful output over total input, with the remainder as losses); and explain qualitatively how they interrelate.",
    "blindBaselineDepth": "Conceptual/definitional depth for all five terms plus their interrelationship, at the level the AC's own verb 'describe' implies -- explicitly NOT including the quantitative kinetic-energy formula (1/2 m v^2) or potential-energy formula (mgh) UNLESS assessment evidence specifically requires them (see below).",
    "blindBaselineRationale": "AC's own title directly names all five terms and 'their interrelationships'. The verb is 'describe', a conceptual verb distinct from AC3.4's 'calculate' -- so quantitative depth for kinetic/potential energy specifically is not derivable from AC3.3's own wording alone.",
    "blindConfidence": "MEDIUM"
  },
  "ac3-4-mechanics-calculation": {
    "publicSpecificationAnchor": "AC3.4: 'Calculate values of mechanical energy, power and efficiency.'",
    "publicAssessmentAnchor": "Matrix records: 'Sample A/B test mass/force, power, efficiency and simple machines' (public sample-assessment evidence).",
    "blindBaselineRequirement": "Calculate work/energy (W=Fd), power (P=work/time), and efficiency (useful-output/input x 100%) for multi-step Level-2 problems, including combining mass/weight (F=mg), time, and simple-machine (lever/gear/pulley) relationships from earlier ACs where a problem requires it.",
    "blindBaselineDepth": "Multi-step calculation integrating this AC's own relationships with earlier ACs' (3.1, 3.2) -- explicit 'calculate' verb licenses full numeric problem-solving, unlike AC3.3's 'describe'. Kinetic-energy (1/2mv^2) and potential-energy (mgh) calculation are plausible candidates for this AC given its explicit calculation verb, though not independently confirmable from the AC's bare title alone (see uncertainty).",
    "blindBaselineRationale": "AC's own verb 'calculate' directly licenses numeric problem-solving for 'mechanical energy, power and efficiency' -- multi-step integration with earlier ACs is standard Level-2 assessment-design practice (assessment criteria within one LO are conventionally tested together in applied problems, not in isolation).",
    "blindConfidence": "MEDIUM"
  },
  "ac4-1-atomic-structure-and-current": {
    "publicSpecificationAnchor": "AC4.1: 'Describe the basic principles of electron theory.'",
    "publicAssessmentAnchor": "Matrix records: 'Sample A tests charges; Sample B tests current as electron movement in closed circuit' (public sample-assessment evidence).",
    "blindBaselineRequirement": "Describe basic atomic charge structure (protons positive, electrons negative, neutrons neutral; nucleus and outer/free electrons); describe current as the flow of free electrons driven by a potential difference around a closed circuit; distinguish conventional-current direction (+ to -) from electron-flow direction (- to +).",
    "blindBaselineDepth": "Basic descriptive atomic model and current mechanism sufficient to explain metallic conduction -- no quantum mechanics, band theory, or drift-velocity calculation.",
    "blindBaselineRationale": "AC's own title directly names 'electron theory'; sample-assessment evidence confirms both charge structure and current-as-electron-flow are tested. Depth ceiling (no quantum/band theory) is a factual-truth-tier judgement (this content is genuinely beyond Level 2, confirmed by the approved technical-source dossier's own depth-clipped OpenStax citation).",
    "blindConfidence": "HIGH"
  },
  "ac4-2-conductor-insulator-distinction": {
    "publicSpecificationAnchor": "AC4.2: 'Identify and distinguish between materials which are good conductors and insulators.'",
    "publicAssessmentAnchor": "Matrix records: 'Sample B tests porcelain, electron binding in insulators, tungsten as conductor' (public sample-assessment evidence).",
    "blindBaselineRequirement": "Distinguish good conductors (readily available/free charge carriers) from insulators (tightly bound outer electrons, high resistance); identify at least one common material example of each.",
    "blindBaselineDepth": "Conceptual distinction plus basic material recognition. No semiconductor band theory or quantitative conductivity/resistivity analysis under this AC.",
    "blindBaselineRationale": "Direct AC title anchor for the distinction itself. Material examples are necessarily required by the AC's own verb 'identify' (which requires naming actual materials, not just describing the abstract distinction) -- sample-assessment evidence confirms tungsten and porcelain specifically are tested, so the blind baseline can anchor to those two named examples with confidence, though a complete list cannot be derived from tiers 1-4 alone.",
    "blindConfidence": "MEDIUM"
  },
  "ac4-3-resistance-resistivity-relationship": {
    "publicSpecificationAnchor": "AC4.3: 'Describe what is meant by resistance and resistivity in relation to electrical circuits.'",
    "publicAssessmentAnchor": "Matrix records: 'Sample B tests CSA from R/rho/L, copper-aluminium comparison and conductor length' (public sample-assessment evidence).",
    "blindBaselineRequirement": "Distinguish resistance (R, ohm, a property of a specific conductor) from resistivity (rho, ohm-metre, an intrinsic material property); state and apply R=rhoL/A and its rearrangements, including how length and cross-sectional area affect resistance.",
    "blindBaselineDepth": "Full R=rhoL/A calculation and rearrangement, including material comparison and unit conversion (mm^2 to m^2) -- sample-assessment evidence confirms this depth despite the AC's milder 'describe' verb.",
    "blindBaselineRationale": "AC's own title directly names both terms; sample-assessment evidence confirms calculation-level depth (CSA/length/material problems) is genuinely tested, overriding the milder reading the bare verb 'describe' alone would suggest.",
    "blindConfidence": "HIGH"
  },
  "ac4-4-series-parallel-concepts": {
    "publicSpecificationAnchor": "AC4.4: 'Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits.'",
    "transferablePrerequisiteJustification": "Ohm's law and basic series/parallel behaviour are necessary prerequisites for every later DC-circuit calculation AC (4.5, 4.6, 4.7).",
    "blindBaselineRequirement": "State Ohm's law (V=IR); explain qualitatively how current, voltage and equivalent resistance behave in series circuits (same current, voltage divides, resistances add) versus parallel circuits (same branch voltage, current divides, equivalent resistance below the smallest branch).",
    "blindBaselineDepth": "Conceptual/qualitative explanation, illustrated by simple calculation where useful -- full numeric problem-solving is the explicit remit of the companion AC4.5 ('calculate'), so this AC's own 'explain' verb caps it at qualitative reasoning plus illustrative examples.",
    "blindBaselineRationale": "AC's own verb 'explain' plus its direct pairing with AC4.5's 'calculate' verb for the identical subject matter -- a standard C&G pattern (explain-then-calculate pairs recur at 3.3/3.4, 4.4/4.5) that licenses reading AC4.4 as conceptual and AC4.5 as the numeric-depth AC for the same content.",
    "blindConfidence": "HIGH"
  },
  "ac4-5-series-parallel-calculation": {
    "publicSpecificationAnchor": "AC4.5: 'Calculate the values of current, voltage and resistance in parallel and series D.C. circuits.'",
    "publicAssessmentAnchor": "Matrix records: 'Sample A tests series/parallel R and current; Sample B tests parallel R and missing series voltage' (public sample-assessment evidence).",
    "blindBaselineRequirement": "Calculate total/branch resistance, current and voltage in pure series and pure parallel DC circuits (Rt=SumR series; 1/Rt=Sum(1/R) parallel, including the two-resistor product-over-sum shortcut); solve for an unknown component value; verify simple Kirchhoff voltage/current conservation.",
    "blindBaselineDepth": "Full numeric calculation for pure series and pure parallel circuits, multi-step where a problem requires finding several unknowns in sequence. No complex mixed series-parallel network reduction, bridge circuits, or simultaneous-equation network theorems.",
    "blindBaselineRationale": "AC's own verb 'calculate' directly licenses full numeric problem-solving; sample-assessment evidence confirms this exact depth (total R, branch current, missing-voltage problems). The product-over-sum shortcut and KVL/KCL are standard, factually-necessary consequences of the parallel-resistance relationship (confirmed by the approved technical-source dossier as governed-algebra rearrangements, not additional content).",
    "blindConfidence": "HIGH"
  },
  "ac4-6-power-calculation": {
    "publicSpecificationAnchor": "AC4.6: 'Calculate values of power in parallel and series D.C. circuits.'",
    "publicAssessmentAnchor": "Matrix records: 'Sample A tests total circuit/heater power' (public sample-assessment evidence).",
    "blindBaselineRequirement": "Calculate power using P=VI, P=I^2R, P=V^2/R (and rearrangements) for an individual component or a whole series/parallel circuit; sum individual component powers to find total circuit power.",
    "blindBaselineDepth": "Full numeric calculation, component-level and circuit-level, integrating AC4.5's own resistance/current/voltage results. No AC power (real/reactive/apparent) or power-factor calculation under this DC-only AC.",
    "blindBaselineRationale": "AC's own verb 'calculate' directly licenses this; sample-assessment evidence confirms it; the DC-only scope ceiling is a direct consequence of the AC's own title ('D.C. circuits'), not an inferred restriction.",
    "blindConfidence": "HIGH"
  },
  "ac4-7-voltage-drop": {
    "publicSpecificationAnchor": "AC4.7: 'State what is meant by the term voltage drop in relation to electrical circuits.'",
    "publicAssessmentAnchor": "Matrix records: 'Sample A directly calculates cable voltage drop; Sample B tests consequence of high cable resistance' (public sample-assessment evidence).",
    "blindBaselineRequirement": "Define voltage drop (Vdrop=IR, the voltage developed across a resistance carrying current); calculate it for a given current and cable/conductor resistance; explain that load-terminal voltage equals supply voltage minus upstream drops, and that excessive resistance causes inadequate load voltage.",
    "blindBaselineDepth": "Definition plus calculation and its practical consequence -- sample-assessment evidence confirms calculation depth despite the milder 'state' verb. No BS 7671 permitted voltage-drop limits or installation-design rules (a regulatory/design-standard topic outside this science-principles unit's own remit).",
    "blindBaselineRationale": "AC's own title names the term; sample-assessment evidence confirms both direct calculation and the practical-consequence reasoning are tested, overriding the milder 'state' verb's literal reading. The BS 7671 exclusion is a scope-boundary judgement about what belongs to THIS unit (electrical science principles) versus a different unit (installation design/regulations) within the same qualification.",
    "blindConfidence": "HIGH"
  },
  "ac4-8-thermal-chemical-effects": {
    "publicSpecificationAnchor": "AC4.8: 'Describe the chemical and thermal effects of electric currents.'",
    "publicAssessmentAnchor": "Matrix records: 'Sample A tests electroplating as chemical; Sample B tests fuse operation as thermal' (public sample-assessment evidence).",
    "blindBaselineRequirement": "Describe resistive/Joule heating (current through a resistance converts electrical energy to heat, greater at greater power/current) and its practical application in heating devices and fuse operation; describe electrolysis (current through a suitable liquid produces chemical change) and electroplating as a practical application.",
    "blindBaselineDepth": "Conceptual/descriptive depth with named practical applications (fuse, electroplating) -- both applications confirmed by public sample-assessment evidence specifically. No electrochemistry equations or electrode-potential chemistry.",
    "blindBaselineRationale": "AC's own title directly names both effects; sample-assessment evidence directly confirms both named applications (fuse for thermal, electroplating for chemical) are tested, giving high confidence in exactly those two applications despite the AC's own title not naming them.",
    "blindConfidence": "HIGH"
  },
  "ac5-1-attraction-repulsion-field-lines": {
    "publicSpecificationAnchor": "AC5.1: 'Describe the effects of magnetism in terms of attraction and repulsion.'",
    "blindBaselineRequirement": "State that like magnetic poles repel and unlike poles attract; describe a magnetic field as the region in which this effect can be observed, using standard field-line conventions (closed loops, external field lines running from north to south, lines never crossing).",
    "blindBaselineDepth": "Basic descriptive/predictive depth, including standard field-line convention -- no magnetic-domain theory, hysteresis or magnetisation curves.",
    "blindBaselineRationale": "AC's own title directly names attraction/repulsion. Field-line conventions are a necessary minimal elaboration of 'describe the effects of magnetism' at any introductory physics level, confirmed factually by the approved technical-source dossier's own OpenStax citation.",
    "blindConfidence": "MEDIUM"
  },
  "ac5-2-flux-flux-density-relationship": {
    "publicSpecificationAnchor": "AC5.2: 'State the difference between magnetic flux and flux density.'",
    "publicAssessmentAnchor": "Matrix records: 'Sample A tests Tesla and B=Phi/A formula; Sample B tests definition and calculates flux from BxA' (public sample-assessment evidence).",
    "blindBaselineRequirement": "State the distinction between magnetic flux (Phi, weber) and flux density (B, tesla = Wb/m^2, flux concentrated per unit area); state and apply B=Phi/A (and rearrangements Phi=BA, A=Phi/B), with area-unit conversion where required.",
    "blindBaselineDepth": "Full calculation depth despite the AC's milder 'state' verb -- justified directly by sample-assessment evidence, which tests exactly this formula both directions. No field-strength H, permeability, or magnetic-circuit calculations.",
    "blindBaselineRationale": "AC's own title directly names the distinction; sample-assessment evidence directly confirms calculation-level depth (both B=Phi/A and Phi=BxA tested). The technical-source dossier confirms Phi=BA is the directly-sourced relationship, with B=Phi/A as its governed-algebra rearrangement -- factually sound either way.",
    "blindConfidence": "HIGH"
  },
  "ac5-3-field-around-conductor": {
    "publicSpecificationAnchor": "AC5.3: '...production of a magnetic field...'",
    "blindBaselineRequirement": "Describe that a current-carrying conductor produces a magnetic field around it.",
    "blindBaselineDepth": "Basic descriptive fact only, at this row's scope.",
    "blindBaselineRationale": "Directly and explicitly named by AC5.3's own title ('production of a magnetic field').",
    "blindConfidence": "HIGH"
  },
  "ac5-3-field-direction-rule": {
    "publicSpecificationAnchor": "AC5.3: '...production of a magnetic field...' (direction is not itself named by the AC title).",
    "transferablePrerequisiteJustification": "Necessary prerequisite for the dot/cross field-direction diagrams implied by a vocational electrical qualification's practical framing, and for the solenoid-polarity reasoning later in this same AC.",
    "blindBaselineRequirement": "Determine the direction of the magnetic field around a straight current-carrying conductor using the right-hand grip (Maxwell's screw) rule.",
    "blindBaselineDepth": "Directional-rule application only.",
    "blindBaselineRationale": "Not itself named by AC5.3's title, which stops at 'production of a magnetic field' without specifying direction -- included as a necessary-prerequisite elaboration (a field with no stated direction convention cannot be meaningfully drawn or reasoned about in the dot/cross diagrams the qualification's own visual/practical framing implies), but this is an inference, not a direct citation.",
    "blindConfidence": "MEDIUM"
  },
  "ac5-3-force-on-conductor": {
    "publicSpecificationAnchor": "AC5.3: '...force on a current-carrying conductor in a magnetic field...'",
    "publicAssessmentAnchor": "Matrix records: 'Sample A tests... force direction' (public sample-assessment evidence, for the direction half of this cluster).",
    "blindBaselineRequirement": "State that a current-carrying conductor in a magnetic field experiences a force (the motor effect); calculate this force using F=BIl for the perpendicular case, and state that reversing B or I reverses the force direction.",
    "blindBaselineDepth": "Calculation-level depth for the perpendicular special case only -- no vector cross-product treatment or general-angle force calculation.",
    "blindBaselineRationale": "Directly and explicitly named by AC5.3's own title. F=BIl is the standard, factually-necessary perpendicular-case formula for this named effect (confirmed by the approved technical-source dossier), not an addition beyond what 'force on a current-carrying conductor' already implies for a calculation-capable Level-2 learner.",
    "blindConfidence": "MEDIUM"
  },
  "ac5-3-flemings-left-hand-rule": {
    "publicSpecificationAnchor": "AC5.3: '...force on a current-carrying conductor...' (the specific named mnemonic is not itself in the AC title).",
    "transferablePrerequisiteJustification": "Necessary prerequisite for fully describing the motor effect named in the previous row, and for AC5.4's generator-direction reasoning (Fleming's right-hand rule, the companion convention).",
    "blindBaselineRequirement": "Determine the direction of the force on a current-carrying conductor in a magnetic field using a systematic three-axis directional rule (conventionally, in UK vocational electrical training, Fleming's left-hand rule).",
    "blindBaselineDepth": "Directional-rule application. The specific NAME 'Fleming's left-hand rule' is a UK/vocational-trade convention, not itself stated in the AC wording -- the blind method can confidently predict that SOME systematic directional convention is required (force, field and current are mutually perpendicular and a rule is needed to relate their directions), but cannot independently confirm the specific mnemonic name without external evidence.",
    "blindBaselineRationale": "Necessary-prerequisite elaboration of the force-on-conductor effect (the previous row) -- a force whose magnitude is calculable but whose direction has no stated method is an incomplete physical description for a Level-2 vocational learner expected to reason about motor-effect direction.",
    "blindConfidence": "MEDIUM"
  },
  "ac5-3-induced-emf": {
    "publicSpecificationAnchor": "AC5.3: '...electromotive force...'",
    "publicAssessmentAnchor": "Matrix records: 'Sample B tests induction condition' (public sample-assessment evidence).",
    "blindBaselineRequirement": "State that a conductor moving through a magnetic field has an EMF induced in it (electromagnetic induction by cutting flux); calculate this EMF using e=Blv for the perpendicular case.",
    "blindBaselineDepth": "Calculation-level depth for the perpendicular special case only -- same scope pattern as the force-on-conductor row above (its motional-EMF counterpart).",
    "blindBaselineRationale": "Directly and explicitly named by AC5.3's own title ('electromotive force'); sample-assessment evidence confirms induction is tested. e=Blv is the standard perpendicular-case formula for this named effect (confirmed by the approved technical-source dossier), following the same 'named quantifiable effect implies calculation at Level 2' reasoning as the force-on-conductor row.",
    "blindConfidence": "MEDIUM"
  },
  "ac5-3-flemings-right-hand-rule": {
    "publicSpecificationAnchor": "AC5.3: '...electromotive force...' (the specific named mnemonic is not itself in the AC title).",
    "transferablePrerequisiteJustification": "Companion convention to Fleming's left-hand rule; necessary prerequisite for AC5.4's single-loop-generator direction reasoning.",
    "blindBaselineRequirement": "Determine the direction of the current induced in a conductor moving through a magnetic field using a systematic three-axis directional rule (conventionally, in UK vocational electrical training, Fleming's right-hand rule).",
    "blindBaselineDepth": "Directional-rule application, same pattern as the left-hand-rule row.",
    "blindBaselineRationale": "Necessary-prerequisite elaboration of induced EMF's own direction, mirroring the force-on-conductor/left-hand-rule pairing above.",
    "blindConfidence": "MEDIUM"
  },
  "ac5-3-coil-solenoid-field": {
    "publicSpecificationAnchor": "AC5.3 title does not itself name 'coil' or 'solenoid'.",
    "transferablePrerequisiteJustification": "Plausible prerequisite bridge between 'field around a straight conductor' and the electromagnet/relay/contactor application rows below, if those are in scope at all (see their own, weaker rows).",
    "blindBaselineRequirement": "Describe that a coil/solenoid concentrates and shapes the magnetic field produced by a current-carrying conductor, with a polarity determined by the current direction (via the same right-hand convention).",
    "blindBaselineDepth": "Basic descriptive/directional fact only.",
    "blindBaselineRationale": "Not named in AC5.3's own title at all -- included only as a plausible necessary elaboration of 'production of a magnetic field', since a coil/solenoid is a standard, general-physics way of concentrating a conductor's field and is a natural bridge to the electromagnet concept a vocational electrical course would plausibly need. This is a weaker inference than the field-around-a-straight-conductor row.",
    "blindConfidence": "LOW"
  },
  "ac5-3-electromagnet": {
    "publicSpecificationAnchor": "AC5.3 title does not itself name 'electromagnet'.",
    "blindBaselineRequirement": "NOT CONFIDENTLY DERIVABLE from tiers 1-4 alone as a distinct required proposition beyond the general coil/solenoid-field content above.",
    "blindBaselineDepth": "No independent depth statement -- see rationale.",
    "blindBaselineRationale": "The word 'electromagnet' does not appear anywhere in AC5.3's own title, and this AC carries no Range box to check either. An electromagnet is simply a named APPLICATION of the coil/solenoid field already covered above; whether it is explicitly required as its own named topic (vs. an unlabelled example within the general field content) cannot be resolved from specification/Range/level/verb reasoning alone.",
    "blindConfidence": "LOW"
  },
  "ac5-3-relay": {
    "publicSpecificationAnchor": "AC5.3 title does not itself name 'relay'.",
    "blindBaselineRequirement": "NOT CONFIDENTLY DERIVABLE from tiers 1-4 alone as a required proposition under this AC.",
    "blindBaselineDepth": "No independent depth statement -- see rationale.",
    "blindBaselineRationale": "A relay is a specific, named ELECTROMECHANICAL COMPONENT (an application of the electromagnet principle to switch a separate circuit) -- a further, more specific step beyond the already-weakly-anchored 'electromagnet' row above. Nothing in AC5.3's title, or in any other AC's title/Range in the matrix, names 'relay' as required content.",
    "blindConfidence": "LOW"
  },
  "ac5-3-contactor": {
    "publicSpecificationAnchor": "AC5.3 title does not itself name 'contactor'.",
    "blindBaselineRequirement": "NOT CONFIDENTLY DERIVABLE from tiers 1-4 alone as a required proposition under this AC.",
    "blindBaselineDepth": "No independent depth statement -- see rationale.",
    "blindBaselineRationale": "A contactor is a specific, named heavier-duty industrial relay variant -- an even more specific application than 'relay' itself. Nothing in AC5.3's title, or any Range item anywhere in the matrix, names 'contactor'.",
    "blindConfidence": "LOW"
  },
  "ac5-4-alternator-principle-and-parts": {
    "publicSpecificationAnchor": "AC5.4: 'Describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF and magnetic flux.'",
    "publicAssessmentAnchor": "Matrix records: 'Sample A tests frequency/time and e=Blv; Sample B tests slip rings, e=vBl formula and length calculation' (public sample-assessment evidence).",
    "blindBaselineRequirement": "Explain a single loop rotating between magnetic poles, connected via slip rings and brushes, as a causal system producing alternating EMF by cutting flux (zero EMF for motion parallel to the field, maximum for perpendicular cutting, alternating polarity through rotation); identify slip rings/brushes/poles/coil as the core parts.",
    "blindBaselineDepth": "Full causal-mechanism explanation with named parts, at the depth the AC's own detailed title (naming five distinct sub-concepts) implies -- sample-assessment evidence confirms slip-ring identification specifically is tested.",
    "blindBaselineRationale": "AC's own title is unusually detailed for this matrix (naming single-loop generator, sine-wave, frequency, EMF and magnetic flux all explicitly), directly licensing this depth; sample-assessment evidence corroborates the specific slip-ring/brush detail.",
    "blindConfidence": "HIGH"
  },
  "ac5-4-frequency-pole-pair-relationship": {
    "publicSpecificationAnchor": "AC5.4: '...in terms of...frequency...'",
    "publicAssessmentAnchor": "Matrix records: 'Sample A tests frequency/time' (public sample-assessment evidence).",
    "blindBaselineRequirement": "State that one cycle of output corresponds to one revolution per pole pair, and calculate frequency from rotational speed and pole-pair count (f=N x P, with N in rev/s and P the number of pole PAIRS, not total poles).",
    "blindBaselineDepth": "Full calculation depth -- directly named ('frequency') in the AC's own title and confirmed by sample-assessment evidence.",
    "blindBaselineRationale": "AC's own title directly names 'frequency' as a required sub-concept. The pole-PAIRS (not total-poles) convention is confirmed as the correct technical reading by the approved technical-source dossier's own independent cross-check against two independent manufacturer/educational sources (CC-15A) -- a factual-truth-tier resolution the blind method reaches through that independent technical verification alone.",
    "blindConfidence": "HIGH"
  },
  "ac5-5-waveform-characteristics-and-relationships": {
    "publicSpecificationAnchor": "AC5.5: 'Identify the characteristics of sine-waves.'",
    "publicRangeAnchor": "Official Range: all six items listed.",
    "publicAssessmentAnchor": "Matrix records: 'Sample B asks identification of waveform period' (public sample-assessment evidence).",
    "blindBaselineRequirement": "Identify amplitude/peak, peak-to-peak (Vpp=2Vpeak), periodic time (T=1/f), frequency (f=1/T), RMS (Vrms~=0.707Vpeak) and average-of-one-alternation (Vavg~=0.636Vpeak) values on a sine wave, and convert between them; state that the signed average over a full cycle is zero, distinct from the average-of-one-alternation value used in AC calculations.",
    "blindBaselineDepth": "Full identification-and-conversion depth for all six named Range items, including the two forms of 'average' distinction, which is a factually necessary clarification: the technical-source dossier confirms both the zero full-cycle average and the ~0.637xpeak rectified-average are simultaneously true, non-contradictory facts about the same waveform.",
    "blindBaselineRationale": "Direct Range anchor for all six items; the two-forms-of-average distinction is a factual-truth-tier necessity (both values are simultaneously true and a Level-2 learner working with 'average value' calculations needs to know which one is meant), not proprietary-material-derived. Sample-assessment evidence confirms period identification specifically is tested.",
    "blindConfidence": "HIGH"
  },
  "ac6-1-security-alarms-category": {
    "publicSpecificationAnchor": "AC6.1: 'Describe the function and application of electronic components that are used in electrical systems.'",
    "publicRangeAnchor": "Official Range: 'Security alarms'.",
    "blindBaselineRequirement": "Recognise 'security alarm' as a named application category and explain, at simple functional level, that electronic components within it perform sensing, switching and latching/sounding roles.",
    "blindBaselineDepth": "Category-level recognition plus the generic functional roles (sensing/switching/latching) a security alarm must logically perform -- see the following three rows for how far component-specific detail can be independently derived.",
    "blindBaselineRationale": "Direct Range anchor. The generic sensing/switching/latching functional decomposition is a necessary-prerequisite consequence of what ANY security alarm must logically do (detect a change, switch a response, keep the alarm sounding), independent of which specific components a particular course chooses to illustrate it with.",
    "blindConfidence": "HIGH"
  },
  "ac6-1-security-alarm-transistor-switching-generic": {
    "publicSpecificationAnchor": "AC6.1 (application) + AC6.2 (generic component principle, 'Transistors' Range item).",
    "publicRangeAnchor": "Official Range: 'Security alarms' (AC6.1); 'Transistors' (AC6.2).",
    "transferablePrerequisiteJustification": "Depends on AC6.2's own transistor-switching content (see ac6-2-transistors row) as its factual/conceptual prerequisite.",
    "blindBaselineRequirement": "Recognise that a transistor's generic switching capability (established under AC6.2) can plausibly be applied to sense a change of state (e.g. a loop opening or closing) as one component within a security-alarm system.",
    "blindBaselineDepth": "Generic component-capability recognition applied to this named category -- NOT a specific worked circuit topology (see the next row for why the exact topology is not independently derivable).",
    "blindBaselineRationale": "This is a necessary-prerequisite/cross-AC inference: AC6.2 independently and confidently establishes that transistors can switch (see the AC6.2 rows below); applying that generic capability to the AC6.1 'security alarms' category is a plausible, low-risk combination any reasonable course-designer would make, without needing to know the exact circuit a specific course teaches.",
    "blindConfidence": "MEDIUM"
  },
  "ac6-1-security-alarm-thyristor-latching-generic": {
    "publicSpecificationAnchor": "AC6.1 (application) + AC6.2 (generic component principle, 'Thyristors' Range item).",
    "publicRangeAnchor": "Official Range: 'Security alarms' (AC6.1); 'Thyristors' (AC6.2).",
    "transferablePrerequisiteJustification": "Depends on AC6.2's own thyristor-latching content (see ac6-2-thyristors row) as its factual/conceptual prerequisite.",
    "blindBaselineRequirement": "Recognise that a thyristor's generic latching capability (established under AC6.2: gate-triggered, stays conducting until current falls below holding current) can plausibly be applied to keep a sounder active after a security-alarm trigger, until deliberately reset.",
    "blindBaselineDepth": "Generic component-capability recognition applied to this named category -- same pattern and same caveat as the transistor row above.",
    "blindBaselineRationale": "Same cross-AC inference pattern as the transistor row: AC6.2 independently establishes thyristor latching; applying it to 'keep an alarm sounding' is the single most obvious use of a latching device in a security context, a low-risk plausible combination.",
    "blindConfidence": "MEDIUM"
  },
  "ac6-1-security-alarm-exact-topology": {
    "publicSpecificationAnchor": "AC6.1: 'Describe the function and application of electronic components...'",
    "blindBaselineRequirement": "NOT CONFIDENTLY DERIVABLE from tiers 1-4 alone: the EXACT combined circuit topology (e.g. specifically 'a transistor senses a break in a normally-closed loop and triggers a thyristor gate, which then latches to hold a sounder active until manually reset') cannot be independently reconstructed -- only that SOME topology combining a sensing/switching component with a latching component is plausible (the two preceding rows).",
    "blindBaselineDepth": "No independent depth statement for the SPECIFIC topology -- see rationale. The generic component-role combination (prior two rows) is as far as the blind method can confidently go.",
    "blindBaselineRationale": "Many electrically-plausible security-alarm topologies exist (normally-closed-loop vs. normally-open, transistor-plus-thyristor vs. transistor-plus-relay vs. a dedicated alarm IC, etc.) -- the specification/Range/level/verb evidence available cannot distinguish which ONE a given course teaches as its representative example, since AC6.1's own verb ('describe the function and application') requires only that A plausible, functionally-correct example be taught, not a UNIQUELY specified one.",
    "blindConfidence": "LOW"
  },
  "ac6-1-telephone-category": {
    "publicSpecificationAnchor": "AC6.1: 'Describe the function and application of electronic components...'",
    "publicRangeAnchor": "Official Range: 'Telephones'.",
    "blindBaselineRequirement": "Recognise 'telephone' as a named application category involving electronic components.",
    "blindBaselineDepth": "Category-level recognition only -- see the following four rows for how far specific component-role detail can be independently derived (spoiler: not far, at HIGH confidence).",
    "blindBaselineRationale": "Direct Range anchor for the category itself.",
    "blindConfidence": "HIGH"
  },
  "ac6-1-telephone-capacitor-role": {
    "publicSpecificationAnchor": "AC6.1: 'Describe the function and application of electronic components...'",
    "blindBaselineRequirement": "NOT CONFIDENTLY DERIVABLE from tiers 1-4 alone as a specific required component role.",
    "blindBaselineDepth": "No independent depth statement -- see rationale.",
    "blindBaselineRationale": "'Capacitor' is not named anywhere in AC6.1's own title, and the bare Range label 'Telephones' does not itself specify which internal component(s) play which role. A telephone is a complex real-world device with many possible components worth discussing (microphone/speaker transducers, ringer circuit, line-interface components, dialling circuitry, and in the traditional UK context specifically a master-socket capacitor) -- specification/Range/level/verb evidence alone cannot select which one(s) a given course emphasises.",
    "blindConfidence": "LOW"
  },
  "ac6-1-telephone-resistor-role": {
    "publicSpecificationAnchor": "AC6.1: 'Describe the function and application of electronic components...'",
    "blindBaselineRequirement": "NOT CONFIDENTLY DERIVABLE from tiers 1-4 alone.",
    "blindBaselineDepth": "No independent depth statement -- see rationale.",
    "blindBaselineRationale": "Same reasoning as the capacitor row -- 'resistor' (in any telephone-specific role such as remote line-testing) is not named by the AC title or a Range sub-item, and multiple equally-plausible components could be chosen.",
    "blindConfidence": "LOW"
  },
  "ac6-1-telephone-surge-protector-role": {
    "publicSpecificationAnchor": "AC6.1: 'Describe the function and application of electronic components...'",
    "blindBaselineRequirement": "NOT CONFIDENTLY DERIVABLE from tiers 1-4 alone.",
    "blindBaselineDepth": "No independent depth statement -- see rationale.",
    "blindBaselineRationale": "Same reasoning as the capacitor/resistor rows, with an additional currency concern: even the existing governed corpus's own cited source scopes this component to OLDER master sockets specifically, not current ones -- a further reason the blind method (which has no currency-verification mechanism of its own beyond the approved technical-source dossier) cannot confidently include it.",
    "blindConfidence": "LOW"
  },
  "ac6-1-telephone-master-vs-extension-distinction": {
    "publicSpecificationAnchor": "AC6.1: 'Describe the function and application of electronic components...'",
    "blindBaselineRequirement": "NOT CONFIDENTLY DERIVABLE from tiers 1-4 alone.",
    "blindBaselineDepth": "No independent depth statement -- see rationale.",
    "blindBaselineRationale": "Master-vs-extension-socket wiring distinction is installation-practice detail (which components a wired socket physically contains, depending on its position in the network) rather than an electronic-COMPONENT operating principle, which is what AC6.1's own title asks for ('function and application of electronic components'). Even setting aside the component-choice uncertainty of the other telephone rows, this specific installation-topology distinction is a further step removed from what the AC title itself asks about.",
    "blindConfidence": "LOW"
  },
  "ac6-1-telephone-other-component-detail-check": {
    "publicSpecificationAnchor": "AC6.1: 'Describe the function and application of electronic components...'",
    "blindBaselineRequirement": "STRUCTURAL CHECK, not a positive proposition: beyond the four specific component/wiring clauses already addressed above (capacitor, resistor, surge-protector, master-vs-extension), no FURTHER telephone-internal component role (e.g. a hook-switch, ringer coil/transducer, hybrid transformer, dialling circuit) is confidently derivable from tiers 1-4 as separately required.",
    "blindBaselineDepth": "No independent depth statement -- this row exists to make explicit that the four rows above are not being silently treated as an exhaustive list of 'whatever the private material happens to cover'; it is a deliberate closure check.",
    "blindBaselineRationale": "Recorded to satisfy this package's own granularity requirement that the telephone cluster's 'other' residual category be examined explicitly rather than left implicit -- consistent with the same weak-anchor reasoning (no AC-title or Range-sub-item naming) already established for the capacitor/resistor/surge-protector rows above.",
    "blindConfidence": "LOW"
  },
  "ac6-1-dimmer-switch-category": {
    "publicSpecificationAnchor": "AC6.1: 'Describe the function and application of electronic components...'",
    "publicRangeAnchor": "Official Range: 'Dimmer switches'.",
    "transferablePrerequisiteJustification": "Depends on AC6.2's own TRIAC/DIAC operating-principle content.",
    "blindBaselineRequirement": "Recognise 'dimmer switch' as a named application category; recognise that phase-control (switching on partway through each AC half-cycle to reduce average power delivered) is the general operating principle such a device plausibly uses, drawing on AC6.2's own generic TRIAC/DIAC operating-principle content.",
    "blindBaselineDepth": "Category recognition plus the generic phase-control PRINCIPLE (a necessary-prerequisite combination of AC6.2's own TRIAC/DIAC content with this category) -- not the specific capacitor-timing-network component values or circuit topology.",
    "blindBaselineRationale": "Direct Range anchor for the category; phase control is the only physically-sensible way a solid-state (non-transformer, non-rheostat) dimmer can work given AC6.2's own established TRIAC/DIAC switching behaviour, so this is a low-risk cross-AC inference.",
    "blindConfidence": "MEDIUM"
  },
  "ac6-1-heating-boiler-control-category": {
    "publicSpecificationAnchor": "AC6.1: 'Describe the function and application of electronic components...'",
    "publicRangeAnchor": "Official Range: 'Heating/boiler controls'.",
    "publicAssessmentAnchor": "Matrix records: 'Sample A asks which device detects temperature change' (public sample-assessment evidence).",
    "transferablePrerequisiteJustification": "Depends on AC6.2's own thermistor operating-principle content.",
    "blindBaselineRequirement": "Recognise 'heating/boiler control' as a named application category; recognise that a thermistor (established under AC6.2 as a temperature-sensitive resistor) is the natural sensing component for a temperature-feedback control chain switching a heating load on/off.",
    "blindBaselineDepth": "Category recognition plus thermistor-as-sensor role, confirmed directly by sample-assessment evidence naming temperature-change detection specifically. The remainder of the control chain (relay/switching detail) is a plausible but not independently confirmable elaboration.",
    "blindBaselineRationale": "Direct Range anchor; sample-assessment evidence directly confirms temperature-sensing-device identification is tested, which strongly implies the thermistor (the only temperature-sensitive component named anywhere in AC6.2's own Range) is the intended answer.",
    "blindConfidence": "HIGH"
  },
  "ac6-1-motor-control-category": {
    "publicSpecificationAnchor": "AC6.1: 'Describe the function and application of electronic components...'",
    "publicRangeAnchor": "Official Range: 'Motor control'.",
    "transferablePrerequisiteJustification": "Depends on AC6.2's own rectifier and thyristor/TRIAC operating-principle content.",
    "blindBaselineRequirement": "Recognise 'motor control' as a named application category; recognise that rectification (AC6.2's own rectifier content) and controlled switching (AC6.2's own thyristor/TRIAC content) are the natural block-function building blocks of an electronic motor-control/drive system.",
    "blindBaselineDepth": "Category recognition plus generic block-function role (rectify, then controllably switch) -- not a specific manufacturer drive's own internal architecture or a 'protection' function specifically, which is not independently derivable.",
    "blindBaselineRationale": "Direct Range anchor; rectification-plus-controlled-switching is the standard, physically-necessary building-block pattern for ANY electronic motor drive (a motor ultimately needs controllable DC or controlled AC, and both require a rectifier and a switching device given AC6.2's own component set) -- a low-risk cross-AC inference from general principles alone.",
    "blindConfidence": "MEDIUM"
  },
  "ac6-1-wireless-control-category": {
    "publicSpecificationAnchor": "AC6.1: 'Describe the function and application of electronic components...'",
    "publicRangeAnchor": "Official Range: 'Wireless control systems'.",
    "blindBaselineRequirement": "Recognise 'wireless control system' as a named application category involving a transmitter and receiver arrangement that switches or controls a remote device without a physical wired connection.",
    "blindBaselineDepth": "Category-level and general transmitter/receiver-arrangement recognition only -- no specific IC/protocol/frequency-band detail, and the 'practical advantages' half of the matrix's own requirement (why use wireless at all) is a plausible but not independently confirmable elaboration.",
    "blindBaselineRationale": "Direct Range anchor. A transmitter/receiver arrangement is the definitionally necessary minimum content for anything called a 'wireless control system' (a system that controls something without wires must, by definition, transmit and receive a signal) -- this reasoning is purely analytic/definitional.",
    "blindConfidence": "MEDIUM"
  },
  "ac6-2-generic-operating-principles": {
    "publicSpecificationAnchor": "AC6.2: 'State the basic operating principles of electronic components and devices.'",
    "publicRangeAnchor": "Official Range: all 13 items listed.",
    "publicAssessmentAnchor": "Matrix records specific sample-assessment items for several components (e.g. 'Sample A tests capacitor, symbol and diode terminals; Sample B tests symbols, LDR application and rectifier function').",
    "blindBaselineRequirement": "For each of the 13 named components, state its basic operating principle: capacitor (stores charge/energy in an electric field); resistor (opposes current flow); rectifier (converts AC to unidirectional/pulsating DC); diode (one-way conduction); Zener (controlled reverse-conduction regulation); LED (emits light when forward-biased); photo-sensitive device (behaviour depends on incident light); thermistor (resistance varies with temperature); DIAC (bidirectional breakover trigger device); TRIAC (bidirectional gated AC switch); transistor (can switch or amplify); thyristor/SCR (gate-triggered, latching, unidirectional controlled switch); inverter (converts DC to AC).",
    "blindBaselineDepth": "Basic operating-principle statement only, matching the AC's own verb 'state' -- no semiconductor band theory, bias-design calculation, detailed I-V curves, or component-selection engineering for any of the 13.",
    "blindBaselineRationale": "AC's own verb directly licenses this depth ('state the basic operating principles'); direct Range anchor for all 13 items; each principle stated is the factually-necessary minimum content that DEFINES what the component IS (confirmed by the approved technical-source dossier for every one of the 13), independent of any teaching material's own phrasing.",
    "blindConfidence": "HIGH"
  },
  "ac6-2-schematic-symbol-recognition": {
    "publicSpecificationAnchor": "AC6.2: 'State the basic operating principles...' (symbol recognition is not itself named by this verb).",
    "publicAssessmentAnchor": "Matrix records: 'Sample A tests capacitor, symbol and diode terminals; Sample B tests symbols, LDR application...' (public sample-assessment evidence CONFIRMS symbol recognition is tested, despite the AC's own verb not naming it).",
    "blindBaselineRequirement": "Recognise the standard schematic circuit symbol for each of the 13 components, including specifically distinguishing the NPN and PNP transistor symbols.",
    "blindBaselineDepth": "Visual symbol recognition, separate from and additional to the verbal operating-principle statement above -- justified by sample-assessment evidence despite not being named by the AC's own verb.",
    "blindBaselineRationale": "The AC's own verb 'state the basic operating principles' is a verbal/conceptual verb, not obviously a visual-recognition one -- BUT direct public sample-assessment evidence confirms symbol recognition is genuinely tested ('Sample A tests... symbol...; Sample B tests symbols...'), so the blind method includes this on tier-2 evidence despite the AC's own tier-1 wording alone not requiring it.",
    "blindConfidence": "MEDIUM"
  },
  "ac6-2-physical-appearance-recognition": {
    "publicSpecificationAnchor": "AC6.2's own verb ('state the basic operating principles') does not name physical appearance.",
    "blindBaselineRequirement": "NOT CONFIDENTLY DERIVABLE as a REQUIRED assessment performance from tiers 1-4 alone, though plausible as generically useful pedagogical support.",
    "blindBaselineDepth": "No independent depth statement as a required item -- see rationale.",
    "blindBaselineRationale": "Neither the AC's own verb nor any Range item names physical appearance, and no public sample-assessment evidence for physical-appearance recognition (as distinct from schematic-symbol recognition) was located. Physical-component-appearance images are common, generically useful TEACHING SUPPORT for any electronics topic (helping a learner connect a symbol to a real part), but that pedagogical usefulness does not, on its own, establish it as a required assessed performance under this AC's own wording.",
    "blindConfidence": "LOW"
  },
  "ac6-2-resistor-colour-code": {
    "publicSpecificationAnchor": "AC6.2's own verb ('state the basic operating principles') does not itself name colour-code decoding.",
    "transferablePrerequisiteJustification": "Practically relevant for a vocational electrical-installation qualification, where a learner may need to identify real component values -- but this is a vocational-context inference, not a specification-textual one.",
    "blindBaselineRequirement": "NOT CONFIDENTLY DERIVABLE as required from tiers 1-4 alone, though a highly plausible vocational-relevance addition.",
    "blindBaselineDepth": "No independent depth statement as a required item -- see rationale.",
    "blindBaselineRationale": "4-band resistor colour-code decoding is a specific, standardised (IEC 60062) skill that goes beyond 'stating the basic operating principle' of a resistor (which is simply 'opposes current flow') -- it is a practical, vocationally-relevant IDENTIFICATION skill a real electrician plausibly needs, but this practical-relevance argument is a plausibility inference, not a direct citation from the Range item 'Resistors' alone.",
    "blindConfidence": "LOW"
  },
  "cross-cutting-matrix-vs-baseline-scope-of-analysis": {
    "publicSpecificationAnchor": "N/A -- methodology-scope record, not a content proposition.",
    "blindBaselineRequirement": "METHODOLOGY RECORD: this baseline's 45 content rows (excluding this record and the AC3.2 structural-gap record) map to 42 of CC-16's 56 audit propositions by shared (acNumber, rangeItems); the remaining 14 CC-16 propositions were either merged into a broader blind-baseline row (e.g. CC-16's separate quantity-symbol-unit and anti-overdepth-guard AC2.2 rows both feed this baseline's two AC2.2 rows), or are CC-16's own cross-cutting/diagnostic-only findings (e.g. 'cross-cutting-fleming-rule-mnemonic-vocabulary') that this baseline treats as tier-6 diagnostic input to individual rows (e.g. the Fleming's-rule rows above) rather than a separate calibration row of their own, since they are not independently AC/Range-anchored propositions in their own right.",
    "blindBaselineDepth": "N/A.",
    "blindBaselineRationale": "Recorded to satisfy this package's own validation requirement that every CC-16 proposition is either mapped to a calibrationKey or explicitly recorded as diagnostic/non-baseline -- see the validator's own explicit CC16_MAPPING table for the precise per-key correspondence, cross-checked mechanically against CC-16's real ledger.",
    "blindConfidence": "HIGH"
  }
};
