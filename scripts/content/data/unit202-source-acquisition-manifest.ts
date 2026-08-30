/**
 * CC-14: the Unit 202 Source-Acquisition Manifest, derived from the
 * approved `unit202DepthPerformanceMatrix` (./unit202-depth-performance-
 * matrix.ts). This is the next work package's deterministic shopping
 * list -- WHAT reusable domain-knowledge topics still need an
 * authoritative external technical source found for them, WHY (which
 * Unit 202 ACs/Range items need it and at what depth), and WHAT KIND of
 * source would count as authoritative. It is NOT a technical knowledge
 * corpus and asserts no fact of its own.
 *
 * Clustering: requirements are grouped by reusable domain-knowledge topic
 * (docs/governance/PROJECT-CONSTITUTION.md "Knowledge principle" --
 * knowledge is reusable, learning purpose/depth/pedagogy are contextual),
 * not mechanically one cluster per AC. Three clusters below deliberately
 * span two Assessment Criteria each (work/energy/power/efficiency spans
 * AC3.3+AC3.4; DC circuit current/voltage/resistance spans AC4.4+AC4.5;
 * magnetism/flux spans AC5.1+AC5.2) because the matrix's own text
 * describes each such pair as one conceptual+calculation continuum, not
 * two independent topics.
 *
 * SOURCING STATUS: every cluster below is `UNSOURCED`. This was verified,
 * not assumed -- the live Unit 202 corpus
 * (scripts/content/data/cc04-unit202-electrical-science.ts) was inspected
 * for any source already carrying `sourceRole: "FACTUAL_AUTHORITY"`
 * (@alp/content-schema's generic evidential-role registry, ADR-0003) and
 * none exists: only the C&G handbook (`NORMATIVE_CURRICULUM`) and the
 * public sample papers (`OFFICIAL_ASSESSMENT`) currently carry an explicit
 * `sourceRole` anywhere in that corpus. Some individual assertions already
 * cite external technical sources informally (e.g. BIPM, OpenStax,
 * NIST/SEMATECH), but per this task's own governance (§12: "C&G teaching
 * material is NOT sufficient to mark technical knowledge sourced" and the
 * matrix/manifest's independence from the existing corpus, ROLES-AND-
 * AUTHORITY.md "Reuse-assessment sequencing"), that informal, unaudited
 * citation is not treated as exact, sufficient repo evidence here -- a
 * later, separately-reviewed package must make and record that
 * determination deliberately, per requirement, not inherit it silently
 * from this manifest.
 */

import type { SourceAcquisitionManifest } from "@alp/content-schema";

export const unit202SourceAcquisitionManifest: SourceAcquisitionManifest = {
  derivedFromMatrix: "unit202DepthPerformanceMatrix (scripts/content/data/unit202-depth-performance-matrix.ts)",
  reusableKnowledgePrinciple:
    "The resulting governed knowledge should normally be reusable domain knowledge with course/unit mappings, not Unit-202-owned duplicates.",

  clusters: [
    {
      clusterKey: "foundational-mathematics-for-electrical-work",
      title: "Foundational mathematics for electrical work",
      domainReuseNote:
        "Generic Level-2 mathematics (fractions/percentages, algebra, indices, transposition, trigonometry, descriptive " +
        "statistics) with no electrical-domain dependency -- the strongest reuse candidate in this manifest, applicable to " +
        "any C&G Level 2 electrical/building-services qualification and to non-C&G numeracy contexts alike (aligns with the " +
        "existing 'FM' reusable domain code).",
      relatedAcNumbers: ["1.1"],
      relatedRangeItems: [
        { acNumber: "1.1", rangeItem: "Fractions and percentages" },
        { acNumber: "1.1", rangeItem: "Algebra" },
        { acNumber: "1.1", rangeItem: "Indices" },
        { acNumber: "1.1", rangeItem: "Transposition" },
        { acNumber: "1.1", rangeItem: "Triangles and trigonometry" },
        { acNumber: "1.1", rangeItem: "Statistics" },
      ],
      factualPropositionsRequiringSupport: [
        "The four operations on fractions, decimals and percentages, and proportional reasoning.",
        "Laws of indices (multiplying/dividing powers of the same base; fractional indices as roots).",
        "Pythagoras' theorem and the sine/cosine/tangent ratios for a right triangle.",
        "Definitions of range, mean, median and mode for a small dataset.",
      ],
      relationshipsOrMechanismsRequiringSupport: [
        "Formula transposition: rearranging an equation to isolate an unknown, including squared/root forms.",
      ],
      proceduresOrCalculationRulesRequiringSupport: [
        "Solving a right-triangle side/angle from Pythagoras or a trig ratio.",
        "Computing range/mean/median/mode from a small dataset.",
        "Rearranging and evaluating a formula for an unknown quantity, including a square/root form.",
      ],
      symbolsOrConventionsRequiringSupport: [],
      physicalOrComponentRecognitionRequirements: [],
      unit202RequiredUseAndDepth:
        "AC1.1 requires selecting and applying the correct Level-2 method in an unfamiliar electrical-work context, including " +
        "transposing formulae with squared/root terms and solving right-triangle problems -- procedural/calculation depth, not " +
        "proof-based algebra or calculus.",
      reviewOrCorrectionFlags: [],
      requiredSourceCharacteristics: ["GOVERNMENT_OR_PUBLIC_AUTHORITY", "UNIVERSITY_OR_OPEN_EDUCATIONAL_RESOURCE", "AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "si-units-and-physical-quantities",
      title: "SI units and general physical quantities",
      domainReuseNote:
        "General-physics SI unit knowledge (length, area, volume, mass, density, time, temperature, velocity) with no " +
        "electrical-domain dependency -- reusable across any qualification requiring SI literacy (aligns with the existing " +
        "'FP' reusable domain code).",
      relatedAcNumbers: ["2.1"],
      relatedRangeItems: [
        { acNumber: "2.1", rangeItem: "Length" },
        { acNumber: "2.1", rangeItem: "Area" },
        { acNumber: "2.1", rangeItem: "Volume" },
        { acNumber: "2.1", rangeItem: "Mass" },
        { acNumber: "2.1", rangeItem: "Density" },
        { acNumber: "2.1", rangeItem: "Time" },
        { acNumber: "2.1", rangeItem: "Temperature" },
        { acNumber: "2.1", rangeItem: "Velocity" },
      ],
      factualPropositionsRequiringSupport: [
        "The SI base/derived units for length (m), area (m²), volume (m³), mass (kg), density (kg/m³), time (s), temperature " +
          "(K) and velocity (m/s).",
        "Kelvin is the SI base unit of thermodynamic temperature; Celsius is a common practical scale related to it, not the SI " +
          "unit itself.",
      ],
      relationshipsOrMechanismsRequiringSupport: ["The distinction between an SI base unit and an SI derived unit."],
      proceduresOrCalculationRulesRequiringSupport: ["Practical unit conversions used elsewhere in the unit (e.g. mm→m, mm²→m², minutes→seconds)."],
      symbolsOrConventionsRequiringSupport: [],
      physicalOrComponentRecognitionRequirements: [],
      unit202RequiredUseAndDepth:
        "AC2.1 requires mapping each listed physical quantity to its correct SI unit/symbol and using ordinary conversions -- " +
        "recognition/application depth, not a dimensional-analysis course.",
      reviewOrCorrectionFlags: [
        "Temperature: C&G Handout 1 lists °C as the temperature entry while public Sample A tests kelvin -- authoritative SI " +
          "definitions are required rather than propagating the handout table uncritically.",
      ],
      requiredSourceCharacteristics: ["NATIONAL_OR_INTERNATIONAL_STANDARDS_BODY", "GOVERNMENT_OR_PUBLIC_AUTHORITY"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "electrical-quantities-and-si-units",
      title: "Electrical quantities and their SI units",
      domainReuseNote:
        "Core electrical-domain quantity/symbol/unit knowledge (resistance, resistivity, power, frequency, current, voltage, " +
        "energy, impedance, inductance/reactance, capacitance/reactance, power factor) -- reusable across every C&G " +
        "electrical/electronic qualification, not owned by Unit 202 (aligns with the existing 'EL' reusable domain code).",
      relatedAcNumbers: ["2.2"],
      relatedRangeItems: [
        { acNumber: "2.2", rangeItem: "Resistance" },
        { acNumber: "2.2", rangeItem: "Resistivity" },
        { acNumber: "2.2", rangeItem: "Power" },
        { acNumber: "2.2", rangeItem: "Frequency" },
        { acNumber: "2.2", rangeItem: "Current" },
        { acNumber: "2.2", rangeItem: "Voltage" },
        { acNumber: "2.2", rangeItem: "Energy" },
        { acNumber: "2.2", rangeItem: "Impedance" },
        { acNumber: "2.2", rangeItem: "Inductance and inductive reactance" },
        { acNumber: "2.2", rangeItem: "Capacitance and capacitive reactance" },
        { acNumber: "2.2", rangeItem: "Power factor" },
      ],
      factualPropositionsRequiringSupport: [
        "The conventional symbol and SI unit for resistance (R, Ω), resistivity (ρ, Ω·m), power (P, W), frequency (f, Hz), " +
          "current (I, A), voltage (V, V), energy (E/W, J), impedance (Z, Ω), inductance (L, H), inductive reactance (XL, Ω), " +
          "capacitance (C, F), capacitive reactance (XC, Ω), and power factor as a dimensionless ratio.",
      ],
      relationshipsOrMechanismsRequiringSupport: [
        "Why resistance and resistivity, or inductance and inductive reactance, or capacitance and capacitive reactance, are " +
          "distinct quantities that happen to share a family relationship.",
      ],
      proceduresOrCalculationRulesRequiringSupport: [],
      symbolsOrConventionsRequiringSupport: ["Standard formula-symbol conventions for each listed electrical quantity."],
      physicalOrComponentRecognitionRequirements: [],
      unit202RequiredUseAndDepth:
        "AC2.2 requires quantity/symbol/unit recognition and conceptual distinction only -- explicitly NOT full impedance/" +
        "reactance/power-factor circuit calculation (that scope belongs to a possible future AC/course, never inferred here).",
      reviewOrCorrectionFlags: [
        "Resistivity: C&G Handout/Worksheet 7 print erroneous unit forms (e.g. ohm/metre³) -- correct dimensional treatment " +
          "(Ω·m) is required from the authoritative source.",
        "Impedance, inductance/inductive reactance and capacitance/capacitive reactance are anti-overdepth guarded: recognition/" +
          "distinction only, not Level-3 calculation, regardless of what a handout formula appendix contains.",
        "Power factor: no standalone power-factor calculation is required by AC2.2 evidence; only identification of what it " +
          "represents.",
      ],
      requiredSourceCharacteristics: ["NATIONAL_OR_INTERNATIONAL_STANDARDS_BODY", "AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE", "UNIVERSITY_OR_OPEN_EDUCATIONAL_RESOURCE"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "electrical-measurement-instruments",
      title: "Electrical measurement instruments",
      domainReuseNote:
        "Instrument selection/connection knowledge (ohmmeter, ammeter, voltmeter, wattmeter, energy meter) is generic " +
        "electrical-measurement practice, reusable across any electrical qualification requiring practical measurement " +
        "competence.",
      relatedAcNumbers: ["2.3"],
      relatedRangeItems: [
        { acNumber: "2.3", rangeItem: "Resistance" },
        { acNumber: "2.3", rangeItem: "Power" },
        { acNumber: "2.3", rangeItem: "Current" },
        { acNumber: "2.3", rangeItem: "Voltage" },
        { acNumber: "2.3", rangeItem: "Energy" },
      ],
      factualPropositionsRequiringSupport: [
        "An ammeter is connected in series and has very low internal resistance.",
        "A voltmeter is connected in parallel and has high internal resistance.",
        "An ohmmeter requires the circuit under test to be de-energised.",
        "A wattmeter measures power via combined current- and voltage-sensing paths.",
        "An energy meter integrates power over time (kWh).",
      ],
      relationshipsOrMechanismsRequiringSupport: [],
      proceduresOrCalculationRulesRequiringSupport: ["Correct connection topology for each instrument in a given circuit."],
      symbolsOrConventionsRequiringSupport: [],
      physicalOrComponentRecognitionRequirements: ["Recognise the correct instrument for a stated quantity, including a combined multimeter."],
      unit202RequiredUseAndDepth:
        "AC2.3 requires correct instrument selection plus diagrammatic connection topology (Worksheet 8 raises this above bare " +
        "recall) -- not meter calibration theory or internal instrument design.",
      reviewOrCorrectionFlags: [],
      requiredSourceCharacteristics: ["AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE", "MANUFACTURER_TECHNICAL_DOCUMENTATION", "PROFESSIONAL_BODY"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "mass-and-weight",
      title: "Mass and weight",
      domainReuseNote: "General mechanics knowledge (mass vs. weight, gravitational field strength) with no electrical-domain dependency -- reusable across any physics/mechanics-bearing qualification.",
      relatedAcNumbers: ["3.1"],
      relatedRangeItems: [],
      factualPropositionsRequiringSupport: [
        "Mass is the amount of matter in an object (kg) and is invariant with location.",
        "Weight is the force due to gravity acting on a mass (N) and depends on gravitational field strength.",
        "Standard gravitational field strength on Earth is approximately 9.81 m/s².",
      ],
      relationshipsOrMechanismsRequiringSupport: ["W = mg and its rearrangement m = W/g."],
      proceduresOrCalculationRulesRequiringSupport: ["Calculating weight from mass (and vice versa) under a stated gravitational field strength."],
      symbolsOrConventionsRequiringSupport: [],
      physicalOrComponentRecognitionRequirements: [],
      unit202RequiredUseAndDepth:
        "AC3.1 requires calculation in both directions (Worksheet 14 exercises Earth/Moon gravity) despite the terse 'specify' " +
        "verb -- no gravitation theory or orbital mechanics.",
      reviewOrCorrectionFlags: ["The command verb 'specify' understates the worksheet's calculation depth; both mass-from-weight and weight-from-mass are required."],
      requiredSourceCharacteristics: ["NATIONAL_OR_INTERNATIONAL_STANDARDS_BODY", "UNIVERSITY_OR_OPEN_EDUCATIONAL_RESOURCE"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "simple-machines-levers-gears-pulleys",
      title: "Simple machines: levers, gears and pulleys",
      domainReuseNote: "Classical simple-machine mechanics (levers, gears, pulleys, mechanical advantage) with no electrical-domain dependency -- reusable across any mechanics-bearing qualification.",
      relatedAcNumbers: ["3.2"],
      relatedRangeItems: [
        { acNumber: "3.2", rangeItem: "Class I" },
        { acNumber: "3.2", rangeItem: "Class II" },
        { acNumber: "3.2", rangeItem: "Class III" },
      ],
      factualPropositionsRequiringSupport: [
        "The three lever classes are distinguished by the relative arrangement of fulcrum, effort and load.",
        "A gear transmits rotary motion; gear ratio relates tooth count to speed ratio and direction (including the idler effect).",
        "A pulley system's mechanical advantage relates to the number of supporting strands.",
        "An ideal machine trades force for distance; it does not create power.",
      ],
      relationshipsOrMechanismsRequiringSupport: ["Moment/turning-effect balance: effort × effort-arm = load × load-arm."],
      proceduresOrCalculationRulesRequiringSupport: [
        "Solving a lever balance problem for an unknown effort, load or distance.",
        "Determining driven-gear speed/direction from tooth-count ratio.",
        "Determining pulley effort from mechanical advantage.",
      ],
      symbolsOrConventionsRequiringSupport: [],
      physicalOrComponentRecognitionRequirements: [],
      unit202RequiredUseAndDepth:
        "AC3.2 requires classification, qualitative reasoning and calculation for all three simple-machine families -- no " +
        "machine design, gear geometry, friction modelling or complex block-and-tackle analysis.",
      reviewOrCorrectionFlags: [
        "C&G Handout 16 states gearing can provide 'twice as much power' at the slower gear -- this is not acceptable " +
          "technical truth; the authoritative source must establish the correct torque/speed/power relationship instead.",
      ],
      requiredSourceCharacteristics: ["UNIVERSITY_OR_OPEN_EDUCATIONAL_RESOURCE", "AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "work-energy-power-efficiency",
      title: "Force, work, energy, power and efficiency",
      domainReuseNote: "General mechanics/energy principles (force, work, kinetic/potential energy, power, efficiency) with no electrical-domain dependency -- reusable across any mechanics-bearing qualification, and the calculation layer bridges directly to electrical power/efficiency contexts.",
      relatedAcNumbers: ["3.3", "3.4"],
      relatedRangeItems: [],
      factualPropositionsRequiringSupport: [
        "A force is a push or pull that can cause or resist motion, deformation or equilibrium; weight is one example (force due to gravity).",
        "Work is done when a force causes a displacement; work and energy are equivalent in this context.",
        "Kinetic energy and potential energy are distinct forms of mechanical energy at Level-2 conceptual depth.",
        "Efficiency is the ratio of useful output to total input; total input equals useful output plus losses.",
      ],
      relationshipsOrMechanismsRequiringSupport: [
        "Work/energy = force × distance.",
        "Power = work (or energy) / time.",
        "Efficiency (%) = (useful output / input) × 100.",
      ],
      proceduresOrCalculationRulesRequiringSupport: [
        "Multi-step mechanical calculations combining mass/weight, work/energy, time and efficiency (including chained motor/pump efficiency problems).",
      ],
      symbolsOrConventionsRequiringSupport: [],
      physicalOrComponentRecognitionRequirements: [],
      unit202RequiredUseAndDepth:
        "AC3.3 requires conceptual/relational understanding of how force, work, energy, power and efficiency interrelate; " +
        "AC3.4 requires full Level-2 multi-step calculation competence over the same relationships (Worksheet 15's 17 " +
        "multi-step problems, including pump/motor efficiency chains) -- no general Newtonian mechanics, vector work, or the " +
        "kinetic-energy formula ½mv² unless separately evidenced.",
      reviewOrCorrectionFlags: [
        "Potential-energy calculation is effectively exercised only through work done against gravity; quantitative kinetic-" +
          "energy depth is not established by the C&G evidence reviewed.",
        "Public sample question labels sometimes blur the AC3.2/AC3.4 boundary; substantive task performance governs depth, not the printed label.",
      ],
      requiredSourceCharacteristics: ["UNIVERSITY_OR_OPEN_EDUCATIONAL_RESOURCE", "AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "electron-theory-and-conduction",
      title: "Electron theory and electrical conduction",
      domainReuseNote: "Foundational electrical-domain physics (atomic charge structure, free electrons, current direction conventions) -- reusable across every electrical/electronics qualification.",
      relatedAcNumbers: ["4.1"],
      relatedRangeItems: [],
      factualPropositionsRequiringSupport: [
        "At a basic level, protons are positive, electrons are negative and neutrons are neutral; atoms are normally neutral with a nucleus and outer electrons.",
        "Metals have loosely bound/free electrons available to carry current.",
        "Current requires a closed circuit and an EMF/potential-difference driver.",
        "Conventional current flow (+ to −) is the opposite direction to electron flow (− to +).",
      ],
      relationshipsOrMechanismsRequiringSupport: ["Current as the flow of free electrons through a conductor under an applied potential difference."],
      proceduresOrCalculationRulesRequiringSupport: [],
      symbolsOrConventionsRequiringSupport: [],
      physicalOrComponentRecognitionRequirements: [],
      unit202RequiredUseAndDepth:
        "AC4.1 requires recall/conceptual/causal understanding sufficient to resolve the electron-flow vs. conventional-current " +
        "direction apparent contradiction -- no quantum mechanics, band theory or drift-velocity calculation.",
      reviewOrCorrectionFlags: ["Teaching must explicitly resolve the electron-flow/conventional-current apparent contradiction rather than presenting the two facts as disconnected."],
      requiredSourceCharacteristics: ["UNIVERSITY_OR_OPEN_EDUCATIONAL_RESOURCE", "AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "conductors-and-insulators",
      title: "Conductors and insulators",
      domainReuseNote: "Basic materials-science/electron-theory distinction, reusable across every electrical qualification.",
      relatedAcNumbers: ["4.2"],
      relatedRangeItems: [],
      factualPropositionsRequiringSupport: [
        "A good conductor has readily available/free charge carriers; an insulator tightly binds its outer electrons and presents high resistance.",
        "Common conductor examples (e.g. copper, tungsten) and insulator examples (e.g. porcelain, glass, plastics).",
      ],
      relationshipsOrMechanismsRequiringSupport: [],
      proceduresOrCalculationRulesRequiringSupport: [],
      symbolsOrConventionsRequiringSupport: [],
      physicalOrComponentRecognitionRequirements: [],
      unit202RequiredUseAndDepth:
        "AC4.2 requires classification plus a basic electron-theory explanation of the distinction -- no semiconductor band " +
        "diagrams or quantitative conductivity/resistivity analysis.",
      reviewOrCorrectionFlags: [],
      requiredSourceCharacteristics: ["UNIVERSITY_OR_OPEN_EDUCATIONAL_RESOURCE", "AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "resistance-and-resistivity",
      title: "Resistance and resistivity of conductors",
      domainReuseNote: "Core electrical-domain relationship (R = ρL/A) reusable across every electrical qualification involving cable/conductor sizing.",
      relatedAcNumbers: ["4.3"],
      relatedRangeItems: [],
      factualPropositionsRequiringSupport: [
        "Resistance (R, Ω) is distinct from resistivity (ρ, Ω·m), a material property.",
        "Resistance is directly proportional to conductor length and inversely proportional to cross-sectional area.",
      ],
      relationshipsOrMechanismsRequiringSupport: ["R = ρL/A and its rearrangements for ρ, L or A."],
      proceduresOrCalculationRulesRequiringSupport: [
        "Solving R = ρL/A for any unknown, with correct area/length unit conversion (e.g. mm²→m²).",
        "Combining a resistivity calculation with V = IR in a cable voltage-drop context.",
      ],
      symbolsOrConventionsRequiringSupport: [],
      physicalOrComponentRecognitionRequirements: [],
      unit202RequiredUseAndDepth:
        "AC4.3 requires full calculation and integration depth (R=ρL/A, material comparisons, cable-drop integration) -- no " +
        "temperature-coefficient modelling or microscopic resistivity derivation unless separately evidenced.",
      reviewOrCorrectionFlags: ["C&G Handout/Worksheet 7 print erroneous resistivity-unit forms (e.g. ohm/metre³); the authoritative source must establish Ω·m and correct dimensional treatment."],
      requiredSourceCharacteristics: ["NATIONAL_OR_INTERNATIONAL_STANDARDS_BODY", "AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "dc-circuit-theory-series-parallel",
      title: "DC circuit theory: series and parallel current/voltage/resistance",
      domainReuseNote: "Ohm's law and series/parallel DC circuit behaviour is foundational electrical-domain knowledge reusable across every electrical/electronics qualification.",
      relatedAcNumbers: ["4.4", "4.5"],
      relatedRangeItems: [],
      factualPropositionsRequiringSupport: [
        "Ohm's law V = IR holds for an ohmic conductor under stated/appropriate conditions.",
        "In a series circuit: current is common, voltage divides across components, and resistances add.",
        "In a parallel circuit: voltage is common across branches, current divides, and equivalent resistance is below the smallest branch resistance.",
        "Basic Kirchhoff voltage/current conservation (KVL/KCL) at simple-circuit level.",
      ],
      relationshipsOrMechanismsRequiringSupport: [
        "Series total resistance Rt = ΣR.",
        "Parallel total resistance 1/Rt = Σ(1/R), including the two-resistor product-over-sum shortcut.",
      ],
      proceduresOrCalculationRulesRequiringSupport: [
        "Calculating total/branch resistance, current and voltage in pure series and pure parallel DC circuits, including multi-step and unknown-component problems.",
        "Verifying simple KVL/KCL relationships in a solved circuit.",
      ],
      symbolsOrConventionsRequiringSupport: [],
      physicalOrComponentRecognitionRequirements: [],
      unit202RequiredUseAndDepth:
        "AC4.4 requires conceptual/relational/qualitative understanding of series vs. parallel behaviour; AC4.5 requires full " +
        "calculation competence over the same circuits -- no complex series-parallel reduction, bridge circuits, simultaneous " +
        "equations or network theorems unless separately evidenced.",
      reviewOrCorrectionFlags: ["Some public sample-question labels blur AC4.3/AC4.4/AC4.5; the matrix follows actual task semantics rather than the printed AC tag."],
      requiredSourceCharacteristics: ["UNIVERSITY_OR_OPEN_EDUCATIONAL_RESOURCE", "AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "dc-circuit-power",
      title: "DC circuit power calculations",
      domainReuseNote: "P=VI and its derived forms are foundational electrical-domain knowledge reusable across every electrical qualification.",
      relatedAcNumbers: ["4.6"],
      relatedRangeItems: [],
      factualPropositionsRequiringSupport: [
        "Electrical power in a DC circuit can be calculated from voltage and current, or equivalently from current/resistance or voltage/resistance alone.",
      ],
      relationshipsOrMechanismsRequiringSupport: ["P = VI, and its derived forms P = I²R and P = V²/R."],
      proceduresOrCalculationRulesRequiringSupport: [
        "Calculating power for an individual component, a whole circuit, or a resistive loss, selecting and rearranging the correct P/V/I/R relationship.",
        "Summing individual component powers to total circuit power in simple series/parallel circuits.",
      ],
      symbolsOrConventionsRequiringSupport: [],
      physicalOrComponentRecognitionRequirements: [],
      unit202RequiredUseAndDepth: "AC4.6 requires full calculation/rearrangement/integration competence over DC power relationships -- no AC real/reactive/apparent power or power-factor calculation.",
      reviewOrCorrectionFlags: [],
      requiredSourceCharacteristics: ["UNIVERSITY_OR_OPEN_EDUCATIONAL_RESOURCE", "AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "voltage-drop",
      title: "Voltage drop in electrical circuits",
      domainReuseNote: "Voltage-drop concept and calculation is foundational electrical-domain knowledge reusable across every electrical installation qualification.",
      relatedAcNumbers: ["4.7"],
      relatedRangeItems: [],
      factualPropositionsRequiringSupport: [
        "Voltage drop is the voltage developed across a resistance carrying current (Vdrop = IR).",
        "In a simple circuit, the voltage available at the load equals the supply voltage minus upstream voltage drops.",
      ],
      relationshipsOrMechanismsRequiringSupport: ["Vdrop = IR."],
      proceduresOrCalculationRulesRequiringSupport: ["Calculating voltage drop from current and cable/circuit resistance, and simple supply-minus-drop load-terminal-voltage arithmetic."],
      symbolsOrConventionsRequiringSupport: [],
      physicalOrComponentRecognitionRequirements: [],
      unit202RequiredUseAndDepth:
        "AC4.7 requires definition plus calculation and the practical consequence of excessive resistance -- explicitly excludes " +
        "BS 7671 permitted voltage-drop limits or installation-design rules.",
      reviewOrCorrectionFlags: [],
      requiredSourceCharacteristics: ["UNIVERSITY_OR_OPEN_EDUCATIONAL_RESOURCE", "AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "thermal-and-chemical-effects-of-current",
      title: "Thermal and chemical effects of electric current",
      domainReuseNote: "General effects-of-current knowledge (resistive heating, electrolysis) reusable across any electrical qualification.",
      relatedAcNumbers: ["4.8"],
      relatedRangeItems: [],
      factualPropositionsRequiringSupport: [
        "Current through a resistance converts electrical energy to heat, with greater heating at greater power/current.",
        "Current through a suitable liquid can produce a chemical change (electrolysis); electroplating is a practical application.",
      ],
      relationshipsOrMechanismsRequiringSupport: [],
      proceduresOrCalculationRulesRequiringSupport: [],
      symbolsOrConventionsRequiringSupport: [],
      physicalOrComponentRecognitionRequirements: ["Fuse operation as a practical application of the thermal effect."],
      unit202RequiredUseAndDepth: "AC4.8 requires recognition/discrimination of thermal vs. chemical effects at Level-2 recognition/application depth -- no electrochemistry equations or electrode-potential chemistry.",
      reviewOrCorrectionFlags: ["The magnetic effect is taught alongside these effects in the same handout/worksheet but is governed substantively by LO5, not AC4.8 -- must not be conflated."],
      requiredSourceCharacteristics: ["UNIVERSITY_OR_OPEN_EDUCATIONAL_RESOURCE", "AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "magnetism-flux-and-flux-density",
      title: "Magnetism, magnetic flux and flux density",
      domainReuseNote: "Foundational magnetism concepts (poles, fields, flux, flux density) reusable across every electrical/electronics qualification touching motors, generators or magnetic components.",
      relatedAcNumbers: ["5.1", "5.2"],
      relatedRangeItems: [],
      factualPropositionsRequiringSupport: [
        "Like magnetic poles repel; unlike poles attract.",
        "A magnetic field is the region in which a magnetic effect can be observed; field-line conventions (closed loops, external N→S direction, non-crossing lines).",
        "Magnetic flux (Φ, weber) is distinct from flux density (B, tesla = Wb/m²), which is flux concentration per unit area.",
      ],
      relationshipsOrMechanismsRequiringSupport: ["B = Φ/A, and its rearrangements Φ = BA and A = Φ/B."],
      proceduresOrCalculationRulesRequiringSupport: ["Solving B = Φ/A for any unknown, with area unit conversion where required."],
      symbolsOrConventionsRequiringSupport: ["Standard B (flux density) and Φ (flux) symbol notation."],
      physicalOrComponentRecognitionRequirements: [],
      unit202RequiredUseAndDepth:
        "AC5.1 requires prediction/interpretation of attraction/repulsion and field patterns; AC5.2 requires full quantitative " +
        "flux/flux-density distinction and calculation -- no magnetic-domain theory, hysteresis, field strength H, permeability " +
        "or magnetic-circuit calculations.",
      reviewOrCorrectionFlags: [
        "Worksheet 9 makes field-pattern understanding part of expected performance even though AC5.1's own wording is terse.",
        "The C&G handout renders the flux-density symbol anomalously; authoritative technical sources should use standard B notation.",
      ],
      requiredSourceCharacteristics: ["NATIONAL_OR_INTERNATIONAL_STANDARDS_BODY", "UNIVERSITY_OR_OPEN_EDUCATIONAL_RESOURCE", "AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "electromagnetism-motor-effect-and-induced-emf",
      title: "Electromagnetism, the motor effect and induced EMF",
      domainReuseNote: "Core electromagnetism (field around a current-carrying conductor, motor effect F=BIl, Fleming's rules, motional EMF e=Blv) reusable across every electrical qualification touching motors or generators.",
      relatedAcNumbers: ["5.3"],
      relatedRangeItems: [],
      factualPropositionsRequiringSupport: [
        "A current-carrying conductor produces a magnetic field around it.",
        "A current-carrying conductor placed in a magnetic field experiences a force (the motor effect).",
        "A conductor moving through a magnetic field has an EMF induced in it (motional EMF).",
      ],
      relationshipsOrMechanismsRequiringSupport: [
        "Right-hand grip / Maxwell's screw rule for field direction around a straight conductor.",
        "Fleming's left-hand rule for force direction on a current-carrying conductor in a field.",
        "Fleming's right-hand rule for induced-current direction in a conductor moving through a field.",
        "F = BIl for a conductor perpendicular to the field; reversing B or I reverses the force.",
        "e = Blv for a conductor moving perpendicular to the field.",
      ],
      proceduresOrCalculationRulesRequiringSupport: ["Calculating force from F=BIl or induced EMF from e=Blv, including simple rearrangements and unit conversions."],
      symbolsOrConventionsRequiringSupport: ["Dot/cross page convention for field direction into/out of the page."],
      physicalOrComponentRecognitionRequirements: ["Coil/solenoid field and polarity; basic electromagnet/relay/contactor principle."],
      unit202RequiredUseAndDepth:
        "AC5.3 is materially deeper than its 'describe' verb suggests: directional/spatial reasoning plus F=BIl and e=Blv " +
        "calculation are required -- no vector cross products, general Faraday/Lenz-law calculus, self/mutual inductance " +
        "equations, magnetic-energy formulae or machine design.",
      reviewOrCorrectionFlags: ["Official handouts, worksheets and sample questions all require directional/spatial reasoning and simple calculations well beyond the bare word 'describe'."],
      requiredSourceCharacteristics: ["UNIVERSITY_OR_OPEN_EDUCATIONAL_RESOURCE", "AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "ac-generation-single-loop-alternator",
      title: "AC generation: the single-loop alternator",
      domainReuseNote: "Single-loop alternator principles (slip rings, rotation-to-waveform mapping, f=N×P) are foundational AC-machine knowledge reusable across any qualification touching AC generation.",
      relatedAcNumbers: ["5.4"],
      relatedRangeItems: [],
      factualPropositionsRequiringSupport: [
        "A single loop rotating within a magnetic field, connected via slip rings and brushes, produces an alternating EMF.",
        "No EMF is induced for motion parallel to the field; maximum EMF occurs for motion perpendicular to (cutting) the field.",
        "The generator's output EMF varies as a sine wave as the loop rotates.",
      ],
      relationshipsOrMechanismsRequiringSupport: [
        "f = N×P where N is rotational speed in rev/s and P is the number of pole pairs (per the C&G handout's own convention -- pole-pair definition requires independent verification, see review flag).",
        "One cycle of output corresponds to one revolution per pole pair.",
      ],
      proceduresOrCalculationRulesRequiringSupport: ["Simple f=N×P calculations and rearrangements; cycle/period/time relations."],
      symbolsOrConventionsRequiringSupport: [],
      physicalOrComponentRecognitionRequirements: ["Slip rings, brushes, poles and coil as the core parts of a single-loop alternator."],
      unit202RequiredUseAndDepth:
        "AC5.4 requires causal/mechanistic explanation of the alternator as a system plus calculation of frequency/period/" +
        "induced-EMF -- no three-phase generation, winding distribution, alternator regulation, synchronous-machine design or " +
        "detailed electromagnetic field theory.",
      reviewOrCorrectionFlags: [
        "The pole-count convention (P as pole pairs, per C&G Handout 12) requires independent authoritative verification and " +
          "clear documentation before being taught as technical truth; any prior ALP decision on whether f=N×P was previously " +
          "included/excluded carries zero authority over this requirement.",
      ],
      requiredSourceCharacteristics: ["UNIVERSITY_OR_OPEN_EDUCATIONAL_RESOURCE", "AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE", "MANUFACTURER_TECHNICAL_DOCUMENTATION"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "sine-wave-characteristics",
      title: "Sine-wave characteristics",
      domainReuseNote: "RMS/average/peak/period/frequency relationships are foundational AC-waveform knowledge reusable across any AC-bearing electrical/electronics qualification.",
      relatedAcNumbers: ["5.5"],
      relatedRangeItems: [
        { acNumber: "5.5", rangeItem: "Root Mean Square (RMS) value" },
        { acNumber: "5.5", rangeItem: "Average value" },
        { acNumber: "5.5", rangeItem: "Peak to peak value" },
        { acNumber: "5.5", rangeItem: "Periodic time" },
        { acNumber: "5.5", rangeItem: "Frequency" },
        { acNumber: "5.5", rangeItem: "Amplitude" },
      ],
      factualPropositionsRequiringSupport: [
        "Definitions of amplitude/peak, peak-to-peak, periodic time, frequency, RMS value and average value for a sine wave.",
        "The signed average of a complete symmetrical sine-wave cycle is zero; the 'average value' used in AC calculations is the average of one alternation.",
      ],
      relationshipsOrMechanismsRequiringSupport: [
        "Vpp = 2×Vpeak.",
        "T = 1/f.",
        "Vrms ≈ 0.707×Vpeak (and Vpeak ≈ 1.414×Vrms).",
        "Vavg ≈ 0.636×Vpeak (average of one alternation), and the analogous current relationships.",
      ],
      proceduresOrCalculationRulesRequiringSupport: ["Converting between frequency and period, and between peak, RMS and average-of-one-alternation values."],
      symbolsOrConventionsRequiringSupport: [],
      physicalOrComponentRecognitionRequirements: [],
      unit202RequiredUseAndDepth:
        "AC5.5 requires identification of each characteristic on a waveform plus the straightforward conversions above -- no " +
        "phasors, phase angle, harmonics, complex impedance or AC power calculations.",
      reviewOrCorrectionFlags: ["'Average value' must be taught carefully as the average of one alternation in the C&G formula context, distinct from the signed full-cycle average, which is zero."],
      requiredSourceCharacteristics: ["UNIVERSITY_OR_OPEN_EDUCATIONAL_RESOURCE", "AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "electronic-systems-and-applications",
      title: "Electronic systems and their applications",
      domainReuseNote: "Applied electronic-systems knowledge (security alarms, dimmers, heating/boiler controls, motor control, wireless control, telephony) -- reusable wherever a course teaches applied electronics in domestic/building-services systems, though the telephony sub-topic's currency needs independent review before reuse.",
      relatedAcNumbers: ["6.1"],
      relatedRangeItems: [
        { acNumber: "6.1", rangeItem: "Security alarms" },
        { acNumber: "6.1", rangeItem: "Telephones" },
        { acNumber: "6.1", rangeItem: "Dimmer switches" },
        { acNumber: "6.1", rangeItem: "Heating/boiler controls" },
        { acNumber: "6.1", rangeItem: "Motor control" },
        { acNumber: "6.1", rangeItem: "Wireless control systems" },
      ],
      factualPropositionsRequiringSupport: [
        "Security alarm: a transistor provides a switching role and a thyristor provides a latching/sounder role within the circuit.",
        "Dimmer switch: a capacitor provides timing, a DIAC triggers, and a TRIAC provides phase control.",
        "Heating/boiler control: a thermistor senses temperature, feeding a switching/relay chain.",
        "Motor control: rectification and controlled switching/protection at block-function level.",
        "Wireless control: transmitter/receiver arrangement and its practical advantages.",
        "Telephone system: whether any specific master-socket component role remains qualification-relevant and current is itself unestablished -- currency must be independently verified before any such role is taught as current general technical truth.",
      ],
      relationshipsOrMechanismsRequiringSupport: [],
      proceduresOrCalculationRulesRequiringSupport: [],
      symbolsOrConventionsRequiringSupport: [],
      physicalOrComponentRecognitionRequirements: [],
      unit202RequiredUseAndDepth:
        "AC6.1 requires simple functional/cause-effect explanation and plausible component selection for each listed system -- " +
        "no circuit design, IC pin-level operation, component-value troubleshooting, telephone-network engineering or wireless " +
        "protocol stacks.",
      reviewOrCorrectionFlags: [
        "Telephone-system details in the 2019 C&G handout may be legacy-specific; independent currency verification is required " +
          "before this sub-topic is taught as current general technical truth.",
      ],
      requiredSourceCharacteristics: ["MANUFACTURER_TECHNICAL_DOCUMENTATION", "AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE", "PROFESSIONAL_BODY"],
      status: "UNSOURCED",
    },

    {
      clusterKey: "electronic-components-operating-principles",
      title: "Electronic component operating principles",
      domainReuseNote: "Basic operating-principle knowledge for common electronic components (capacitors, resistors, rectifiers, diodes, Zener, LED, photo-sensitive devices, thermistors, DIAC, TRIAC, transistors, thyristors, inverters) is core electronics-domain knowledge reusable across any electronics-bearing qualification.",
      relatedAcNumbers: ["6.2"],
      relatedRangeItems: [
        { acNumber: "6.2", rangeItem: "Capacitors" },
        { acNumber: "6.2", rangeItem: "Resistors" },
        { acNumber: "6.2", rangeItem: "Rectifiers" },
        { acNumber: "6.2", rangeItem: "Diodes" },
        { acNumber: "6.2", rangeItem: "Zener" },
        { acNumber: "6.2", rangeItem: "LED" },
        { acNumber: "6.2", rangeItem: "Photo" },
        { acNumber: "6.2", rangeItem: "Thermistors" },
        { acNumber: "6.2", rangeItem: "DIACs" },
        { acNumber: "6.2", rangeItem: "TRIACs" },
        { acNumber: "6.2", rangeItem: "Transistors" },
        { acNumber: "6.2", rangeItem: "Thyristors" },
        { acNumber: "6.2", rangeItem: "Inverters" },
      ],
      factualPropositionsRequiringSupport: [
        "A capacitor stores charge/energy in an electric field.",
        "A resistor opposes current flow; resistors carry a 4-band colour-code rating.",
        "A rectifier converts AC to unidirectional/pulsating DC, with distinct half-wave and full-wave circuit forms.",
        "A diode conducts in one direction only, with anode/cathode terminals.",
        "A Zener diode provides controlled reverse conduction for simple regulation/reference use.",
        "An LED emits light when correctly forward biased.",
        "A photo-sensitive device's behaviour depends on light -- both a photodiode and a light-dependent resistor (LDR) are candidate devices for the Range's terse 'photo' entry (see review flag).",
        "A thermistor's resistance changes with temperature; PTC and NTC are the two types.",
        "A DIAC is a bidirectional breakover device commonly used to trigger a TRIAC.",
        "A TRIAC is a bidirectional gated AC switching device.",
        "A transistor can switch or amplify; NPN and PNP are distinguished by symbol.",
        "A thyristor (SCR) is a gate-triggered, latching, unidirectional controlled switch.",
        "An inverter converts DC to AC, the reverse of a rectifier.",
      ],
      relationshipsOrMechanismsRequiringSupport: [],
      proceduresOrCalculationRulesRequiringSupport: [],
      symbolsOrConventionsRequiringSupport: ["Standard schematic symbols for each listed component, including the NPN/PNP transistor distinction."],
      physicalOrComponentRecognitionRequirements: ["Physical appearance of each listed component as supporting recognition where useful."],
      unit202RequiredUseAndDepth:
        "AC6.2 requires basic operating-principle recall plus symbol recognition and basic waveform/colour-code interpretation " +
        "for every listed device -- no semiconductor band theory, transistor bias design, detailed I-V curves, switching-" +
        "frequency design, component-selection calculations or power-electronics engineering.",
      reviewOrCorrectionFlags: [
        "The C&G Range names the item only 'photo'; the official handout teaches photodiode while the public sample paper " +
          "tests a light-dependent resistor (LDR) -- both should be taught and clearly distinguished at basic level pending " +
          "authoritative C&G clarification of the intended taxonomy.",
      ],
      requiredSourceCharacteristics: ["MANUFACTURER_TECHNICAL_DOCUMENTATION", "AUTHORITATIVE_ENGINEERING_OR_SCIENCE_REFERENCE", "UNIVERSITY_OR_OPEN_EDUCATIONAL_RESOURCE"],
      status: "UNSOURCED",
    },
  ],
};
