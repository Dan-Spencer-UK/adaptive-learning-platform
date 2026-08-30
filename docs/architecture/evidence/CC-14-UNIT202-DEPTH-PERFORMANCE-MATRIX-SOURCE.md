<!--
Provenance note (added by Claude Code, 2026-08-30, CC-14): the body of this
file below the closing "-->" is preserved EXACTLY as received from the
Product Owner as the attached file `unit202-depth-performance-matrix.md`,
byte-for-byte, including this transfer artifact's own character-encoding
corruption (many Ω/²/ρ/Φ/√/° and dash characters appear as mojibake, e.g.
"Î©" for "Ω", "Â²" for "²" -- an artefact of how the source file was
transferred to this session, not a content difference). It is committed
here unmodified, exactly as received, as the historical provenance record
of the Project-Architect/ChatGPT-authored, Product-Owner-approved artefact.

The GOVERNED, machine-readable, correctly-encoded representation used by
the platform is scripts/content/data/unit202-depth-performance-matrix.ts
(validated by scripts/content/validate-unit202-depth-performance-matrix.ts
and scripts/content/validate-unit202-depth-performance-matrix.test.ts).
Where that encoding corrects this file's mojibake to the correct Unicode
symbol, the encoding module's own header says so explicitly -- no wording,
number or substantive judgment was altered by that normalisation. See
docs/architecture/evidence/CC-14-UNIT202-DEPTH-PERFORMANCE-MATRIX.md for
the encoding work's own evidence report.

Authorship, as stated in the document itself: "Substantive depth judgements
authored by Project Architect / ChatGPT; Claude Code did not author the
matrix." Status header below reads "PROPOSED FOR PRODUCT OWNER APPROVAL" as
originally authored; the Product Owner approved this matrix in the session
that produced this commit (2026-08-30) -- that later approval event is
recorded in the governed encoding's `authorship` field, not by silently
editing this file's own historical header text.
-->

# Unit 202 Depth & Performance Matrix

**Qualification:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02)  
**Unit:** 202 â Principles of Electrical Science  
**Status:** PROPOSED FOR PRODUCT OWNER APPROVAL  
**Authorship:** Substantive depth judgements authored by Project Architect / ChatGPT; Claude Code did not author the matrix.

## Governing depth decision

> For C&G exam-support packages, teach the minimum depth of understanding required for a learner to handle the full legitimate range of syllabus-valid assessment questions robustly, including unfamiliar variations. This is deeper than the shortest AC-satisfying answer but shall not expand into the depth of a full college course without evidence.

Unit 202 is a **learning-support / exam-preparation** package used alongside college tuition. This matrix does not attempt to replace full qualification delivery or practical competence.

### Evidence hierarchy

1. **Current C&G handbook/syllabus** â curriculum and examinable-scope authority.
2. **C&G Range** â mandatory breadth.
3. **C&G handouts / learner worksheets / tutor answers** â depth and expected-performance calibration only.
4. **Public sample assessment evidence** â assessment style/cognitive-demand calibration only; absence from a sample never removes syllabus scope.
5. **Independent authoritative technical references** â factual/technical truth, to be acquired in the next stage.

LLM internal knowledge is **never** source-of-truth provenance. Existing ALP assertions/capabilities/lessons were not used to decide this matrix.

### Unit 602 assessment envelope

| LO | Approx. questions | Weight |
|---|---:|---:|
| LO1 | 2 | 5% |
| LO2 | 5 | 13% |
| LO3 | 7 | 18% |
| LO4 | 15 | 37% |
| LO5 | 7 | 17% |
| LO6 | 4 | 10% |

90 minutes; closed book; non-programmable calculator; 40 questions; pass approximately 50% (current C&G handbook v1.12).

## Assessment-Criterion Matrix

### LO1 â Understand mathematical principles appropriate to electrical installation, maintenance and design work

#### AC 1.1 â Identify and apply appropriate mathematical principles which are relevant to electrical work tasks.

**Official Range:** Fractions and percentages; algebra; indices; transposition; triangles and trigonometry; statistics.

**Required learner performance:** Select and apply the appropriate Level-2 mathematical method in an unfamiliar electrical-work context; rearrange formulae to isolate an unknown (including square/root forms); solve right-triangle problems; use percentages/fractions and descriptive statistics accurately.

**Required depth dimensions:** Procedural; Calculation; Application; Integration

**Required supporting knowledge / next-stage source shopping list:** Fractions/decimals/percentages and proportional reasoning; algebraic substitution; powers, roots and scientific/engineering notation; formula transposition; Pythagoras; sin/cos/tan for right triangles; range/mean/median/mode; calculator use; unit consistency.

**Visual / representation requirement:** Right-triangle diagrams; worked formula transformations; progressive worked examples.

**Calculation / procedure requirement:** Direct and rearranged formulae; roots/squares; percentage; trigonometry; descriptive statistics. Formulae from electrical science may be used as mathematical operands without implying deeper AC theory.

**C&G teaching / worksheet calibration:** Handout 2; Worksheet 2/tutor answers: transposition of P=IV, P=VÂ²/R, pf=R/Z, Z=â(RÂ²+XLÂ²).

**Public sample-assessment calibration:** Sample A: formula transposition and cosine; Sample B: percentage and mean.

**Scope ceiling:** No calculus, complex numbers, advanced trigonometry, proof-based algebra, or deeper electrical theory solely because its formula appears in a maths exercise.

**Confidence / status:** HIGH â LOCKED

### LO2 â Understand standard units of measurement used in electrical installation, maintenance and design work

#### AC 2.1 â Identify and use internationally recognised base and derived (SI) units of measurement.

**Official Range:** Length; area; volume; mass; density; time; temperature; velocity.

**Required learner performance:** Correctly map each required physical quantity to its SI unit/symbol and use it in calculations, including the ordinary conversions required by Unit 202 problems.

**Required depth dimensions:** Recall/Recognition; Application; Calculation-support

**Required supporting knowledge / next-stage source shopping list:** metre (m); square metre (mÂ²); cubic metre (mÂ³); kilogram (kg); kilogram per cubic metre (kg/mÂ³); second (s); kelvin (K) as SI temperature unit, with Â°C recognised as common practical temperature scale; metre per second (m/s); common metric prefixes/conversions used elsewhere in the unit.

**Visual / representation requirement:** Simple quantityâunit tables; dimensional callouts beside worked examples.

**Calculation / procedure requirement:** Unit conversion where needed (e.g. mmâm, mmÂ²âmÂ², minutesâseconds).

**C&G teaching / worksheet calibration:** Handout 1 SI table.

**Public sample-assessment calibration:** Sample A tests kelvin; Sample B tests seconds.

**Scope ceiling:** No formal dimensional-analysis course and no unnecessary SI derivations.

**Confidence / status:** HIGH â LOCKED_WITH_CORRECTION

**Review flag:** C&G Handout 1 lists Â°C as the temperature entry; public sample A tests kelvin. Technical source acquisition must use authoritative SI definitions rather than propagate the handout table uncritically.

#### AC 2.2 â Identify and determine values of base and derived SI units which apply specifically to electrical quantities.

**Official Range:** Resistance; resistivity; power; frequency; current; voltage; energy; impedance; inductance and inductive reactance; capacitance and capacitive reactance; power factor.

**Required learner performance:** Recognise each required electrical quantity, its conventional formula symbol and its SI unit; distinguish quantities that share a unit; interpret/convert straightforward numerical values and prefixes.

**Required depth dimensions:** Recall/Recognition; Conceptual distinction; Application

**Required supporting knowledge / next-stage source shopping list:** RâÎ©; resistivity ÏâÎ©Â·m; PâW; fâHz; IâA; VâV; E/WâJ; ZâÎ©; LâH and XLâÎ©; CâF and XCâÎ©; power factor as dimensionless. Enough meaning to distinguish each quantity, not merely memorise a list.

**Visual / representation requirement:** Quantity/symbol/unit comparison table; paired distinctions (R vs Ï, L vs XL, C vs XC).

**Calculation / procedure requirement:** Simple conversions/value interpretation. AC1.1 may use Z, XL or pf formulae as transposition exercises, but this AC does not by itself require full impedance/reactance/power-factor circuit calculations.

**C&G teaching / worksheet calibration:** Handout 1 quantity/symbol/unit table; Handout 2 formula appendix only as supporting maths context.

**Public sample-assessment calibration:** Sample A tests impedance unit, XL symbol, energy unit; Sample B tests resistivity unit, voltage unit, capacitance unit.

**Scope ceiling:** Do not infer Level-3 AC circuit analysis, phase-angle work, reactance formula calculations, or power-factor calculations from the Range list alone.

**Confidence / status:** HIGH â LOCKED_WITH_SCOPE_GUARD

**Review flag:** Important anti-overdepth guard. Handout 2's formula appendix contains material beyond what the direct 2.2 assessment evidence establishes.

#### AC 2.3 â Identify appropriate electrical instruments for the measurement of different electrical quantities.

**Official Range:** Resistance; power; current; voltage; energy.

**Required learner performance:** Choose the correct instrument for each quantity and recognise the basic connection topology needed to obtain the measurement safely and meaningfully.

**Required depth dimensions:** Recall/Recognition; Visual/Spatial; Procedural; Application

**Required supporting knowledge / next-stage source shopping list:** Ohmmeter/resistance measurement and de-energised-circuit requirement; ammeter in series and low internal resistance; voltmeter in parallel and high internal resistance; wattmeter current/voltage measuring paths at basic level; energy meter and kWh context.

**Visual / representation requirement:** Circuit diagrams showing correct ammeter, voltmeter and wattmeter placement; energy-meter context.

**Calculation / procedure requirement:** Energy-meter/kWh arithmetic is useful supporting practice but not the defining depth of AC2.3.

**C&G teaching / worksheet calibration:** Handout 8; Worksheet 8 requires ammeter/voltmeter/wattmeter connection diagrams and combined metering arrangement.

**Public sample-assessment calibration:** Sample A asks power instrument; Sample B asks resistance instrument.

**Scope ceiling:** No meter calibration theory, internal instrument design, CAT-rating syllabus extension, or advanced three-phase metering.

**Confidence / status:** HIGH â LOCKED

**Review flag:** Worksheet 8 clearly raises expected teaching depth above simple instrument-name recall by requiring diagrammatic connections.

### LO3 â Understand basic mechanics and the relationship between force, work, energy and power

#### AC 3.1 â Specify what is meant by mass and weight.

**Required learner performance:** Distinguish mass from weight, use correct units, explain why mass is invariant while weight depends on gravitational field strength, and perform simple massâweight calculations needed elsewhere in the unit.

**Required depth dimensions:** Conceptual; Relational; Calculation-support; Application

**Required supporting knowledge / next-stage source shopping list:** Mass = amount of matter (kg); weight = force due to gravity (N); gâ9.81 m/sÂ² on Earth; W=mg and rearrangement; gravitational field changes weight not mass.

**Visual / representation requirement:** Earth/Moon comparison; mass-vs-weight visual comparison.

**Calculation / procedure requirement:** W=mg and m=W/g. Calculation competence is shared with AC3.4.

**C&G teaching / worksheet calibration:** Handout 14; Worksheet 14 calculates weight from mass and mass from weight under Earth/Moon gravity.

**Public sample-assessment calibration:** Sample B includes mass-from-force calculation under LO3.

**Scope ceiling:** No gravitation theory, orbital mechanics or general field equations.

**Confidence / status:** HIGH â LOCKED

**Review flag:** The command verb 'specify' understates the worksheet depth; Worksheet 14 requires calculations in both directions.

#### AC 3.2 â Explain the principles of basic mechanics as they apply to levers, gears and pulleys.

**Official Range:** Levers: Class I; Class II; Class III.

**Required learner performance:** Recognise/classify lever arrangements and examples; reason about effort/load/fulcrum; solve simple lever balance problems; determine basic gear ratio, driven speed/direction and tooth-count relationships; determine simple pulley mechanical advantage/effort and explain the forceâdistance trade-off.

**Required depth dimensions:** Conceptual; Relational; Visual/Spatial; Calculation; Application

**Required supporting knowledge / next-stage source shopping list:** Lever classes; effort/load/fulcrum; moments/turning effect and FÃdistance balance; mechanical advantage; driver/driven gears, teeth ratio, speed ratio and direction; idler effect; pulley supporting strands and ideal MA; ideal machines trade force for distance rather than create power.

**Visual / representation requirement:** Class I/II/III diagrams; driver/driven gear diagrams; pulley systems with supporting strands and force/distance.

**Calculation / procedure requirement:** Lever effort/load/distance; gear tooth/speed ratios; simple pulley effort from MA.

**C&G teaching / worksheet calibration:** Handout 16 levers/gears/pulleys; Worksheet 16 lever calculations.

**Public sample-assessment calibration:** Sample A tests lever class, lever effort, gear speed, pulley effort; Sample B tests lever class, pulley MA and gear ratio.

**Scope ceiling:** No detailed machine design, gear geometry, friction modelling or complex block-and-tackle analysis.

**Confidence / status:** HIGH â LOCKED_WITH_CORRECTION

**Review flag:** C&G Handout 16 says gearing can provide 'twice as much power' at the slower gear. This is not acceptable technical truth; authoritative sourcing must teach the correct torque/speed/power relationship.

#### AC 3.3 â Describe the main principles of force, work, energy (kinetic and potential), power and efficiency, and their interrelationships.

**Required learner performance:** Explain how force, work, energy, power and efficiency relate; distinguish kinetic from potential energy at the required Level-2 conceptual depth; recognise losses and the relationship between input and output.

**Required depth dimensions:** Conceptual; Causal/Mechanistic; Relational; Application

**Required supporting knowledge / next-stage source shopping list:** Force as push/pull and effects on motion/deformation/equilibrium; force due to gravity; work when force causes displacement; work/energy equivalence; kinetic vs potential energy concepts; power as rate of doing work; efficiency as output/input; losses.

**Visual / representation requirement:** Energy/work flow diagrams; inputâuseful output+losses; kinetic vs potential examples.

**Calculation / procedure requirement:** Formulae may illustrate the relationships, but calculation mastery is governed by AC3.4.

**C&G teaching / worksheet calibration:** Handout 15 explains force/work/energy/power/efficiency.

**Public sample-assessment calibration:** Sample A tests work formula; Sample B tests force as massÃgravity.

**Scope ceiling:** Do not add general Newtonian mechanics, vector work or the kinetic-energy formula Â½mvÂ² unless later assessment/source evidence specifically requires it.

**Confidence / status:** HIGH â LOCKED

**Review flag:** Potential-energy calculation is effectively exercised through work done against gravity; quantitative kinetic-energy depth is not established by the C&G evidence reviewed.

#### AC 3.4 â Calculate values of mechanical energy, power and efficiency.

**Required learner performance:** Solve unfamiliar but Level-2 multi-step mechanical calculations, select/rearrange the required relationships, maintain units, and combine mass/weight, work/energy, time and efficiency where necessary.

**Required depth dimensions:** Calculation; Procedural; Application; Integration

**Required supporting knowledge / next-stage source shopping list:** F=mg; work/energy=FÃd; power=work/time; efficiency=(useful output/input)Ã100%; input=output+losses; unit/time conversions; kW/W; simple volume/mass contexts when data are provided; linked motor/pump efficiency problems.

**Visual / representation requirement:** Worked multi-step problem maps; unit-flow annotations.

**Calculation / procedure requirement:** Direct/rearranged and multi-step calculations, including chained efficiency examples at the level of Worksheet 15 and simple lever/gear/pulley computations where assessment evidence integrates them.

**C&G teaching / worksheet calibration:** Worksheet 15 has 17 multi-step work/power/efficiency problems including pump/motor chains; Worksheets 14/16 support linked mechanics.

**Public sample-assessment calibration:** Sample A/B test mass/force, power, efficiency and simple machines.

**Scope ceiling:** No advanced dynamics, fluid mechanics or energy equations not evidenced by Level-2 requirements.

**Confidence / status:** HIGH â LOCKED

**Review flag:** Public sample question labels sometimes blur AC3.2/3.4 boundaries; the matrix follows substantive performance rather than trusting sample labels mechanically.

### LO4 â Understand the relationship between resistance, resistivity, voltage, current and power

#### AC 4.1 â Describe the basic principles of electron theory.

**Required learner performance:** Describe the charge structure needed to understand metallic conduction; explain free-electron movement/current in a closed circuit; distinguish electron-flow direction from conventional-current direction.

**Required depth dimensions:** Recall/Recognition; Conceptual; Causal/Mechanistic; Visual/Spatial

**Required supporting knowledge / next-stage source shopping list:** Protons positive, electrons negative, neutrons neutral at basic level; nucleus/outer electrons; neutral atoms and simple charge imbalance; loosely bound/free electrons in metals; closed-circuit requirement; EMF/potential difference as the driver; electron flow ââ+ and conventional current +ââ.

**Visual / representation requirement:** Simple atom model; conductor/free-electron model; persistent circuit with opposite electron/conventional-current arrows.

**Calculation / procedure requirement:** None intrinsic.

**C&G teaching / worksheet calibration:** Handout 1 electron theory; Worksheet 1 asks atom parts/charge, electron-flow direction, conventional current.

**Public sample-assessment calibration:** Sample A tests charges; Sample B tests current as electron movement in closed circuit.

**Scope ceiling:** No quantum mechanics, band theory, drift-velocity calculation or detailed atomic physics.

**Confidence / status:** HIGH â LOCKED

**Review flag:** The visual teaching should explicitly resolve the electron-flow/conventional-current apparent contradiction rather than present two disconnected facts.

#### AC 4.2 â Identify and distinguish between materials which are good conductors and insulators.

**Required learner performance:** Classify common materials as conductors/insulators and explain the distinction using availability/binding of charge carriers at the basic electron-theory level.

**Required depth dimensions:** Recall/Recognition; Conceptual; Application

**Required supporting knowledge / next-stage source shopping list:** Good conductors generally have readily available/free electrons; insulators tightly bind outer electrons and present high resistance; common metal/non-metal examples; practical recognition (e.g. copper/tungsten vs porcelain/glass/plastics).

**Visual / representation requirement:** Material comparison panels; electron-binding concept illustration.

**Calculation / procedure requirement:** None required here.

**C&G teaching / worksheet calibration:** Handout 1 conductors/insulators; Worksheet 1 context.

**Public sample-assessment calibration:** Sample B tests porcelain, electron binding in insulators, tungsten as conductor.

**Scope ceiling:** No semiconductor band diagrams or quantitative conductivity/resistivity analysis under this AC.

**Confidence / status:** HIGH â LOCKED

#### AC 4.3 â Describe what is meant by resistance and resistivity in relation to electrical circuits.

**Required learner performance:** Distinguish resistance from material resistivity; explain how conductor material, length and cross-sectional area affect resistance; solve R=ÏL/A problems for any simple unknown and integrate the result into cable voltage-drop contexts.

**Required depth dimensions:** Conceptual; Relational; Calculation; Application; Integration

**Required supporting knowledge / next-stage source shopping list:** Resistance R (Î©); resistivity Ï as material property (Î©Â·m); R=ÏL/A and rearrangements; RâL, Râ1/A; material comparison (e.g. copper/aluminium); correct area/length unit conversions; twin-path length where explicitly relevant.

**Visual / representation requirement:** Conductor diagrams varying material, length and CSA; proportionality comparisons.

**Calculation / procedure requirement:** R, Ï, L or A; mmÂ²âmÂ²; provided resistivity data; combine with V=IR where a cable-voltage problem requires it.

**C&G teaching / worksheet calibration:** Handout 7 Resistivity; Worksheet 7 has extensive R=ÏL/A, material/length/CSA and cable-drop calculations.

**Public sample-assessment calibration:** Sample B tests CSA from R/Ï/L, copperâaluminium comparison and conductor length.

**Scope ceiling:** No temperature-coefficient modelling, microscopic resistivity derivation or materials-science depth unless separately evidenced.

**Confidence / status:** HIGH â LOCKED_WITH_CORRECTION

**Review flag:** C&G Handout/Worksheet 7 print erroneous resistivity-unit forms such as ohm/metreÂ³. Technical sourcing must use Î©Â·m and correct dimensional treatment.

#### AC 4.4 â Explain the relationship between current, voltage and resistance in parallel and series D.C. circuits.

**Required learner performance:** Explain Ohm's-law relationships and how current, voltage and equivalent resistance behave differently in simple series and simple parallel DC circuits; reason qualitatively about changes before calculating.

**Required depth dimensions:** Conceptual; Relational; Visual/Spatial; Application

**Required supporting knowledge / next-stage source shopping list:** Ohm's law V=IR (for an ohmic conductor under stated/appropriate conditions); series: same current, voltage shares, resistances add; parallel: same branch voltage, currents divide/add, equivalent resistance below smallest branch; basic KVL/KCL conservation ideas.

**Visual / representation requirement:** Series/parallel circuit diagrams with persistent current/voltage annotations; qualitative change comparisons.

**Calculation / procedure requirement:** Illustrative calculations support explanation; full computation is governed by AC4.5.

**C&G teaching / worksheet calibration:** Handout 3 Ohm's law plus conceptual series/parallel rules in Handouts 4/5.

**Public sample-assessment calibration:** Public samples include qualitative/relationship tasks but printed AC tags sometimes blur 4.3â4.5.

**Scope ceiling:** No network theorems, complex mixed networks or transient circuit theory.

**Confidence / status:** HIGH â LOCKED

**Review flag:** Some sample-question labels blur 4.3/4.4/4.5; use the actual task semantics, not the printed tag, to define depth.

#### AC 4.5 â Calculate the values of current, voltage and resistance in parallel and series D.C. circuits.

**Required learner performance:** Calculate total/branch resistance, current and voltage in pure series and pure parallel DC circuits; find unknown component values; solve multi-step problems and verify simple Kirchhoff voltage/current relationships.

**Required depth dimensions:** Calculation; Procedural; Visual/Spatial; Application; Integration

**Required supporting knowledge / next-stage source shopping list:** Series Rt=Î£R; parallel 1/Rt=Î£(1/R); two-resistor product/sum as useful shortcut; V=IR; series current rule; parallel voltage rule; KVL and KCL at simple level; unit prefixes.

**Visual / representation requirement:** Circuit diagrams where values are progressively solved and retained.

**Calculation / procedure requirement:** Unknown R/I/V; branch currents; voltage drops; total current; equivalent resistance; equal-resistor shortcuts; simple combined use of Ohm/Kirchhoff relationships.

**C&G teaching / worksheet calibration:** Handouts 4/5; Worksheets 4/5 include total R, branch/current, voltage drop, unknown values and KVL/KCL.

**Public sample-assessment calibration:** Sample A tests series/parallel R and current; Sample B tests parallel R and missing series voltage.

**Scope ceiling:** Do not require complex series-parallel reduction, bridge circuits, simultaneous equations or network theorems unless new C&G evidence establishes them.

**Confidence / status:** HIGH â LOCKED

#### AC 4.6 â Calculate values of power in parallel and series D.C. circuits.

**Required learner performance:** Select and use the appropriate DC power relationship to calculate power for individual components, whole circuits and resistive losses, including rearrangement and multi-step series/parallel contexts.

**Required depth dimensions:** Calculation; Procedural; Application; Integration

**Required supporting knowledge / next-stage source shopping list:** P=VI; P=IÂ²R; P=VÂ²/R; rearrangements; individual vs total power; cable/joint resistive loss; W/kW and A/mA conversions.

**Visual / representation requirement:** Circuit diagrams with power traced component-by-component; formula-choice worked examples.

**Calculation / procedure requirement:** Direct and rearranged P/V/I/R problems; individual and total power in simple series/parallel circuits.

**C&G teaching / worksheet calibration:** Handout 6; Worksheet 6 uses P=VI, IÂ²R, VÂ²/R in component/cable contexts.

**Public sample-assessment calibration:** Sample A tests total circuit/heater power.

**Scope ceiling:** No AC real/reactive/apparent power or power-factor calculations under AC4.6.

**Confidence / status:** HIGH â LOCKED

#### AC 4.7 â State what is meant by the term voltage drop in relation to electrical circuits.

**Required learner performance:** Define voltage drop, calculate it from current and circuit/cable resistance, and explain its practical consequence for the voltage available at the load.

**Required depth dimensions:** Conceptual; Relational; Calculation; Application

**Required supporting knowledge / next-stage source shopping list:** Voltage developed across resistance Vdrop=IR; supply voltage allocation; cable/conductor resistance; load-terminal voltage = supply minus upstream drops in simple cases; excessive resistance causes inadequate load voltage.

**Visual / representation requirement:** Supplyâcableâload diagram showing voltage allocation.

**Calculation / procedure requirement:** Vdrop=IR and simple supply/load subtraction; integration with resistivity calculations where data require it.

**C&G teaching / worksheet calibration:** Handouts 3/4/7; Worksheets 3 and 7 include voltage-drop calculations and load-terminal voltage.

**Public sample-assessment calibration:** Sample A directly calculates cable voltage drop; Sample B tests consequence of high cable resistance.

**Scope ceiling:** Do not import BS 7671 permitted voltage-drop limits or installation-design rules into Unit 202 merely because percentage voltage drop appears in maths examples.

**Confidence / status:** HIGH â LOCKED

#### AC 4.8 â Describe the chemical and thermal effects of electric currents.

**Required learner performance:** Describe what thermal and chemical effects are, identify common uses/consequences, and discriminate which effect explains a simple device or process.

**Required depth dimensions:** Recall/Recognition; Conceptual; Causal/Mechanistic; Application

**Required supporting knowledge / next-stage source shopping list:** Resistance heating/energy conversion and increased heating with greater electrical power/current; practical heating and fuse operation; current through suitable liquids producing chemical change/electrolysis; electroplating as an application; battery chemistry only at broad context level.

**Visual / representation requirement:** Heating conductor/fuse sequence; simple electrolysis/electroplating cell diagram.

**Calculation / procedure requirement:** No dedicated electrochemical calculation. Power relationships may support thermal intuition.

**C&G teaching / worksheet calibration:** Handout 1 thermal/chemical effects; Worksheet 1 identifies effects.

**Public sample-assessment calibration:** Sample A tests electroplating as chemical; Sample B tests fuse operation as thermal.

**Scope ceiling:** No electrochemistry equations, electrode-potential chemistry or plating-process detail beyond Level-2 recognition/application.

**Confidence / status:** HIGH â LOCKED

**Review flag:** Magnetic effect is taught alongside these effects in Handout/Worksheet 1 but is governed substantively by LO5, not AC4.8.

### LO5 â Understand the fundamental principles which underpin the relationship between magnetism and electricity

#### AC 5.1 â Describe the effects of magnetism in terms of attraction and repulsion.

**Required learner performance:** Predict attraction/repulsion from pole arrangement and interpret or complete simple magnetic field/flux patterns.

**Required depth dimensions:** Recall/Recognition; Conceptual; Visual/Spatial; Application

**Required supporting knowledge / next-stage source shopping list:** North/south poles; like poles repel and unlike poles attract; magnetic field as region of effect; simple flux-line conventions including closed loops, external NâS direction and non-crossing lines.

**Visual / representation requirement:** Bar-magnet and pole-pair field patterns; learner completes/predicts field patterns.

**Calculation / procedure requirement:** None.

**C&G teaching / worksheet calibration:** Handout 9 pole attraction/repulsion and flux-line conventions; Worksheet 9 requires completing field patterns.

**Public sample-assessment calibration:** No direct item captured in the reviewed public sample extracts; LO5 coverage and worksheet evidence remain strong.

**Scope ceiling:** No magnetic-domain theory, hysteresis or material magnetisation curves.

**Confidence / status:** HIGH â LOCKED

**Review flag:** Worksheet 9 makes field-pattern understanding part of the expected post-teaching performance even though AC5.1's wording is terse.

#### AC 5.2 â State the difference between magnetic flux and flux density.

**Required learner performance:** Distinguish total magnetic flux from flux per unit area, use correct symbols/units, and solve simple B=Î¦/A problems and rearrangements with area conversion.

**Required depth dimensions:** Recall/Recognition; Conceptual; Relational; Calculation; Application

**Required supporting knowledge / next-stage source shopping list:** Magnetic flux Î¦ in webers (Wb); flux density B in teslas (T = Wb/mÂ²); density as concentration of flux through area; B=Î¦/A, Î¦=BA, A=Î¦/B; area conversion.

**Visual / representation requirement:** Same flux spread over different areas; field-line concentration comparison.

**Calculation / procedure requirement:** B, Î¦ or A from B=Î¦/A; mmÂ²âmÂ² where required.

**C&G teaching / worksheet calibration:** Handout 9 definitions and B=Î¦/A; Worksheet 9 supports field visualisation.

**Public sample-assessment calibration:** Sample A tests Tesla and B=Î¦/A formula; Sample B tests definition and calculates flux from BÃA.

**Scope ceiling:** No field strength H, permeability or magnetic-circuit calculations unless separately required.

**Confidence / status:** HIGH â LOCKED

**Review flag:** The C&G handout renders the flux-density symbol anomalously; authoritative technical sources should use standard B notation.

#### AC 5.3 â Describe the magnetic effects of electrical currents in terms of: production of a magnetic field; force on a current-carrying conductor in a magnetic field; electromagnetism; electromotive force.

**Required learner performance:** Reason from diagrams about magnetic-field/current/force/EMF direction; explain straight-conductor, coil/solenoid and electromagnet behaviour; predict reversals; calculate simple induced EMF and conductor force and identify the correct directional hand rule.

**Required depth dimensions:** Conceptual; Causal/Mechanistic; Relational; Visual/Spatial/Directional; Calculation; Application; Integration

**Required supporting knowledge / next-stage source shopping list:** Magnetic field around current-carrying conductor; dot/cross page convention; right-hand grip/Maxwell screw direction; coil/solenoid field and polarity; electromagnet/relay/contactor basic principle; field interaction of parallel conductors at simple level; motor effect and F=BIl for perpendicular conductor; reversal of B or I reverses force; Fleming left-hand rule; electromagnetic induction by cutting flux; e=Blv for perpendicular motion; factors B,l,v; Fleming right-hand generator rule.

**Visual / representation requirement:** Persistent directional diagrams; dot/cross notation; right-hand grip; solenoid polarity; Fleming left/right hand rules; field interaction; force/motion state changes.

**Calculation / procedure requirement:** F=BIl and e=Blv, including simple rearrangements and unit conversions.

**C&G teaching / worksheet calibration:** Handouts 9â11; Worksheets 10/11 require e=Blv, F=BIl and Fleming right/left hand rules; Worksheet 9 field patterns.

**Public sample-assessment calibration:** Sample A tests parallel conductor interaction, solenoid polarity and force direction; Sample B tests induction condition.

**Scope ceiling:** No vector cross products, general Faraday/Lenz-law calculus, self/mutual inductance equations, magnetic-energy formulae or machine design.

**Confidence / status:** HIGH â LOCKED

**Review flag:** This AC is materially deeper than the verb 'describe' suggests; official handouts, worksheets and sample questions all require directional/spatial reasoning and simple calculations.

#### AC 5.4 â Describe the basic principles of generating an A.C. supply in terms of a single-loop generator, sine-wave, frequency, EMF and magnetic flux.

**Required learner performance:** Explain a single-loop alternator as a causal system; map rotational position/motion to zero, intermediate and maximum induced EMF and polarity reversal; identify core parts; relate rotation/pole pairs to waveform frequency; solve the simple frequency/period/induced-EMF problems evidenced by C&G.

**Required depth dimensions:** Conceptual; Causal/Mechanistic; Relational; Visual/Spatial/Directional; Calculation; Application; Integration

**Required supporting knowledge / next-stage source shopping list:** Single loop between magnetic poles; slip rings and brushes; cutting flux; no EMF for motion parallel to field and maximum for perpendicular cutting; alternating polarity through rotation; coil positionâwaveform position; one cycle/revolution for one pole pair; frequency in Hz; f=NÃP where N is rev/s and P is pole pairs (per C&G handout convention); e=Blv as inherited supporting relationship; period/revolution relationship.

**Visual / representation requirement:** Progressive rotating-loop states synchronised with an emerging sine wave; labelled slip rings/brushes/poles/coil; zero/max EMF states.

**Calculation / procedure requirement:** Simple f=NÃP/rearrangements; cycle/period/time relations; e=Blv/rearrangements where assessment treats them under AC5.4.

**C&G teaching / worksheet calibration:** Handout 12 single-loop alternator, position/EMF, slip rings, f=NÃP; Worksheet 12 produces a sine wave; Handout 10 supports e=Blv.

**Public sample-assessment calibration:** Sample A tests frequency/time and e=Blv; Sample B tests slip rings, e=vBl formula and length calculation.

**Scope ceiling:** No three-phase generation, winding distribution, alternator regulation, synchronous-machine design or detailed electromagnetic field theory.

**Confidence / status:** HIGH â LOCKED_WITH_SOURCE_CHECK

**Review flag:** Technical sourcing must verify and clearly document the pole-count convention because C&G Handout 12 defines P as pole pairs. Existing ALP decisions about whether f=NÃP was previously included/excluded have zero authority over this matrix.

#### AC 5.5 â Identify the characteristics of sine-waves.

**Official Range:** Root Mean Square (RMS) value; average value; peak to peak value; periodic time; frequency; amplitude.

**Required learner performance:** Identify each characteristic on a waveform and calculate the straightforward relationships between peak, peak-to-peak, RMS, average, period and frequency used in the C&G teaching/worksheet material.

**Required depth dimensions:** Recall/Recognition; Conceptual; Visual/Spatial; Calculation; Application

**Required supporting knowledge / next-stage source shopping list:** Cycle; instantaneous value; amplitude/peak; Vpp=2Vpeak; period T; f=1/T; RMS/effective meaning and Vrmsâ0.707Vpeak, Vpeakâ1.414Vrms; average over one alternation Vavgâ0.636Vpeak; full-cycle signed average = 0; analogous current relationships.

**Visual / representation requirement:** Fully labelled sine wave; progressive highlight of each characteristic; comparison of RMS/peak/average.

**Calculation / procedure requirement:** fâT; peakâpeak-to-peak; RMSâpeak; average-from-peak at the C&G worksheet level.

**C&G teaching / worksheet calibration:** Handout 13; Worksheet 13 performs peakâRMS and peakâaverage calculations.

**Public sample-assessment calibration:** Sample B asks identification of waveform period.

**Scope ceiling:** No phasors, phase angle, harmonics, complex impedance or AC power calculations.

**Confidence / status:** HIGH â LOCKED

**Review flag:** Average must be taught carefully as the average of one alternation in the C&G formula context; the signed average of a complete symmetrical cycle is zero.

### LO6 â Understand the types, applications and limitations of electronic components in electrical systems and equipment

#### AC 6.1 â Describe the function and application of electronic components that are used in electrical systems.

**Official Range:** Security alarms; telephones; dimmer switches; heating/boiler controls; motor control; wireless control systems.

**Required learner performance:** Recognise the listed systems and explain, at simple functional/cause-effect level, what key electronic components do within them; select a plausible component for a stated sensing, switching, rectifying, latching or control role.

**Required depth dimensions:** Recall/Recognition; Conceptual; Causal/Mechanistic; Visual/Schematic; Application; Integration

**Required supporting knowledge / next-stage source shopping list:** Security alarm: transistor switching + thyristor latching/sounder role; telephone example: role of master-socket components only if current/qualification-context evidence supports it; dimmer: capacitor timing, DIAC trigger and TRIAC phase control at conceptual level; heating/boiler: thermistor sensing with switching/relay chain; motor control: rectification and controlled switching/protection at block-function level; wireless control: transmitter/receiver/control applications and practical advantages.

**Visual / representation requirement:** Simplified annotated schematics and functional block flows; component-role highlighting rather than dense circuit copying.

**Calculation / procedure requirement:** None intrinsically required.

**C&G teaching / worksheet calibration:** Handout 18 system examples; Worksheet 18 asks roles of thyristor, telephone capacitor, bridge rectifier, thermistor and DIAC.

**Public sample-assessment calibration:** Sample A asks which device detects temperature change.

**Scope ceiling:** No requirement to design these circuits, know IC pin-level operation, troubleshoot component values, learn telephone-network engineering or wireless protocol stacks.

**Confidence / status:** MEDIUM_HIGH â LOCKED_WITH_CURRENCY_REVIEW

**Review flag:** Telephone-system details in the 2019 handout may be legacy-specific and must be independently checked before being stated as current general technical truth. Teach qualification-relevant role only when source-backed.

#### AC 6.2 â State the basic operating principles of electronic components and devices.

**Official Range:** Capacitors; resistors; rectifiers; diodes; Zener; LED; photo; thermistors; DIACs; TRIACs; transistors; thyristors; inverters.

**Required learner performance:** State the basic operating principle of every listed device, recognise its schematic symbol where C&G evidence expects it, distinguish commonly confused devices, and interpret basic rectification/control behaviour in simple circuits/waveforms.

**Required depth dimensions:** Recall/Recognition; Conceptual; Causal/Mechanistic; Visual/Symbolic; Application

**Required supporting knowledge / next-stage source shopping list:** Capacitor stores charge/energy and capacitance unit; resistor opposes current plus basic rating/tolerance and 4-band colour-code recognition; rectifier ACâpulsating DC and half/full-wave idea; diode one-way conduction with anode/cathode; Zener controlled reverse conduction/regulation concept; LED emits light when forward-biased; photo-sensitive device behaviour; thermistor PTC/NTC; DIAC bidirectional breakover trigger; TRIAC bidirectional AC switch when gated; transistor switching/amplification and NPN/PNP symbol distinction; thyristor/SCR gate-triggered latching unidirectional switch; inverter DCâAC.

**Visual / representation requirement:** Schematic-symbol family; terminal labels; physical appearance as supporting recognition where useful; half/full-wave rectifier circuit and input/output waveforms; paired comparison panels (rectifierâinverter, diodeâZenerâLED/photo, DIACâTRIACâthyristor).

**Calculation / procedure requirement:** No semiconductor-device calculation required. Resistor colour-code decoding and simple waveform recognition are required by worksheet calibration.

**C&G teaching / worksheet calibration:** Handout 17; Worksheet 17 covers resistor colour code, thermistor, capacitor unit, diode, DIAC/TRIAC/NPN/PNP symbols and half-wave rectifier waveform.

**Public sample-assessment calibration:** Sample A tests capacitor, symbol and diode terminals; Sample B tests symbols, LDR application and rectifier function.

**Scope ceiling:** No semiconductor band theory, transistor bias design, detailed IâV curves, switching-frequency design, component-selection calculations or power-electronics engineering.

**Confidence / status:** HIGH â LOCKED_WITH_AMBIGUITY

**Review flag:** C&G Range says 'photo'; Handout 17 teaches photodiode while public Sample B tests a light-dependent resistor (LDR). For exam support, teach and clearly distinguish both at basic recognition/function depth until authoritative C&G clarification resolves the taxonomy.

## Exact official Range coverage (58 items)

| LO | AC | Range category | Range item | Depth treatment | Review flag |
|---|---|---|---|---|---|
| LO1 | 1.1 | Mathematical principles | Fractions and percentages | Apply and convert in electrical-work problems; percentage-of-whole and percentage limits. |  |
| LO1 | 1.1 | Mathematical principles | Algebra | Substitute values and solve for unknowns in Level-2 formulae. |  |
| LO1 | 1.1 | Mathematical principles | Indices | Use powers, roots and scientific/engineering notation needed by electrical quantities. |  |
| LO1 | 1.1 | Mathematical principles | Transposition | Rearrange formulae, including squared/root relationships. |  |
| LO1 | 1.1 | Mathematical principles | Triangles and trigonometry | Use Pythagoras and sin/cos/tan on right triangles. |  |
| LO1 | 1.1 | Mathematical principles | Statistics | Determine range, mean, median and mode from small datasets. |  |
| LO2 | 2.1 | SI units of measurement | Length | Metre (m); practical prefix conversion. |  |
| LO2 | 2.1 | SI units of measurement | Area | Square metre (mÂ²); convert mmÂ²âmÂ² when required. |  |
| LO2 | 2.1 | SI units of measurement | Volume | Cubic metre (mÂ³); simple litre/mÂ³ relationships when problem data require. |  |
| LO2 | 2.1 | SI units of measurement | Mass | Kilogram (kg). |  |
| LO2 | 2.1 | SI units of measurement | Density | kg/mÂ³; interpret and use when data are supplied. |  |
| LO2 | 2.1 | SI units of measurement | Time | Second (s); minutes/hours conversion as needed. |  |
| LO2 | 2.1 | SI units of measurement | Temperature | Kelvin (K) as SI; recognise Â°C as common practical scale. | Handout table uses Â°C; authoritative SI source required. |
| LO2 | 2.1 | SI units of measurement | Velocity | m/s; use in induction/mechanics calculations. |  |
| LO2 | 2.2 | Electrical quantities (SI units) | Resistance | R; ohm (Î©); distinguish from resistivity. |  |
| LO2 | 2.2 | Electrical quantities (SI units) | Resistivity | Ï; ohm metre (Î©Â·m). | Handout unit notation is erroneous; correct via technical source. |
| LO2 | 2.2 | Electrical quantities (SI units) | Power | P; watt (W). |  |
| LO2 | 2.2 | Electrical quantities (SI units) | Frequency | f; hertz (Hz). |  |
| LO2 | 2.2 | Electrical quantities (SI units) | Current | I; ampere (A). |  |
| LO2 | 2.2 | Electrical quantities (SI units) | Voltage | V; volt (V), including potential difference/EMF context. |  |
| LO2 | 2.2 | Electrical quantities (SI units) | Energy | E/W as context requires; joule (J); recognise kWh as practical energy billing unit. |  |
| LO2 | 2.2 | Electrical quantities (SI units) | Impedance | Z; ohm (Î©); recognition/distinction only at this depth unless other evidence requires more. | Anti-overdepth guard. |
| LO2 | 2.2 | Electrical quantities (SI units) | Inductance and inductive reactance | L in henry (H); XL in ohm (Î©); recognition/distinction, not Level-3 reactance calculations. | Anti-overdepth guard. |
| LO2 | 2.2 | Electrical quantities (SI units) | Capacitance and capacitive reactance | C in farad (F); XC in ohm (Î©); recognition/distinction, not Level-3 reactance calculations. | Anti-overdepth guard. |
| LO2 | 2.2 | Electrical quantities (SI units) | Power factor | pf/cosÏ conceptually dimensionless; recognise what it represents at identification level only here. | No standalone PF calculation required by AC2.2 evidence. |
| LO2 | 2.3 | Electrical quantities (measurement) | Resistance | Ohmmeter; circuit de-energised; connected across item/circuit. |  |
| LO2 | 2.3 | Electrical quantities (measurement) | Power | Wattmeter; basic current/voltage measurement connection concept. |  |
| LO2 | 2.3 | Electrical quantities (measurement) | Current | Ammeter in series; very low internal resistance concept. |  |
| LO2 | 2.3 | Electrical quantities (measurement) | Voltage | Voltmeter in parallel; high internal resistance concept. |  |
| LO2 | 2.3 | Electrical quantities (measurement) | Energy | Energy meter; kWh context. |  |
| LO3 | 3.2 | Levers | Class I | Fulcrum between effort and load; recognise examples and solve simple lever problems. |  |
| LO3 | 3.2 | Levers | Class II | Load between fulcrum and effort; recognise examples. |  |
| LO3 | 3.2 | Levers | Class III | Effort between fulcrum and load; recognise examples. |  |
| LO5 | 5.5 | Characteristics of a sine-wave | Root Mean Square (RMS) value | Identify/evaluate effective value; RMSâ0.707 peak for sine wave; reverse via 1.414. |  |
| LO5 | 5.5 | Characteristics of a sine-wave | Average value | Average of one alternationâ0.636 peak; distinguish from signed full-cycle average of zero. |  |
| LO5 | 5.5 | Characteristics of a sine-wave | Peak to peak value | Identify and use Vpp=2ÃVpeak. |  |
| LO5 | 5.5 | Characteristics of a sine-wave | Periodic time | Identify one-cycle time T; use T=1/f. |  |
| LO5 | 5.5 | Characteristics of a sine-wave | Frequency | Identify cycles/second; Hz; use f=1/T. |  |
| LO5 | 5.5 | Characteristics of a sine-wave | Amplitude | Identify maximum excursion/peak value. |  |
| LO6 | 6.1 | Electrical systems | Security alarms | Explain simple switching/latching/sounder roles of relevant components. |  |
| LO6 | 6.1 | Electrical systems | Telephones | Understand qualification-relevant component roles only when independently current/source-backed. | Legacy/current-technology review required. |
| LO6 | 6.1 | Electrical systems | Dimmer switches | Explain timing/trigger/phase-control roles of capacitor, DIAC and TRIAC at conceptual level. |  |
| LO6 | 6.1 | Electrical systems | Heating/boiler controls | Explain temperature sensing (thermistor) and switching/relay control chain. |  |
| LO6 | 6.1 | Electrical systems | Motor control | Explain rectification and controlled-switching/protection roles at block-function level. |  |
| LO6 | 6.1 | Electrical systems | Wireless control systems | Explain transmitter/receiver/control use and practical application/advantages; no protocol engineering. |  |
| LO6 | 6.2 | Electronic components and devices | Capacitors | Store charge/energy in electric field; F; basic ratings/polarity only where relevant. |  |
| LO6 | 6.2 | Electronic components and devices | Resistors | Oppose current; Ω; basic power/tolerance and 4-band colour-code recognition from worksheet evidence. |  |
| LO6 | 6.2 | Electronic components and devices | Rectifiers | Convert AC to unidirectional/pulsating DC; half/full-wave concept and waveform recognition. |  |
| LO6 | 6.2 | Electronic components and devices | Diodes | One-way conduction; anode/cathode; symbol and forward/reverse concept. |  |
| LO6 | 6.2 | Electronic components and devices | Zener | Controlled reverse conduction/breakdown for simple regulation/reference concept; symbol recognition. |  |
| LO6 | 6.2 | Electronic components and devices | LED | Emits light when correctly forward biased; symbol/application recognition. |  |
| LO6 | 6.2 | Electronic components and devices | Photo | Photo-sensitive device recognition/function. | Handout teaches photodiode; sample B tests LDR. Teach/distinguish both pending C&G clarification. |
| LO6 | 6.2 | Electronic components and devices | Thermistors | Resistance changes with temperature; distinguish PTC/NTC; sensing/application. |  |
| LO6 | 6.2 | Electronic components and devices | DIACs | Bidirectional breakover device commonly used to trigger TRIAC; symbol recognition. |  |
| LO6 | 6.2 | Electronic components and devices | TRIACs | Bidirectional gated AC switching/control; symbol recognition. |  |
| LO6 | 6.2 | Electronic components and devices | Transistors | Basic switching/amplification; NPN/PNP symbol distinction; no bias-design depth. |  |
| LO6 | 6.2 | Electronic components and devices | Thyristors | Gate-triggered latching unidirectional controlled switch; holding-current concept only at basic level. |  |
| LO6 | 6.2 | Electronic components and devices | Inverters | Convert DC to AC; distinguish from rectifier. |  |

## Source references

- Current C&G qualification handbook v1.12: https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/centre_documents/2365-02_l2_electrical_installation_qualification_handbook_v1-12-pdf.pdf
- C&G 2365 qualification page: https://www.cityandguilds.com/qualifications-and-apprenticeships/building-services-industry/electrical-installation/2365-electrotechnical-craft
- Public mirror of C&G/SmartScreen Sample B (calibration only): https://pdfcoffee.com/2365-202-sample-questions-b-answers-pdf-free.html
- Public mirror of C&G/SmartScreen Sample A (calibration only): https://www.scribd.com/document/636018535/2365-202-Mock-Paper-1
- User-supplied official C&G SmartScreen evidence: 18 handouts, 18 learner worksheets, 18 tutor-answer worksheets, and the Unit 202 sample scheme of work.

## Next production gate

Do **not** author lessons from this matrix yet. First convert the required-supporting-knowledge entries into a technical-source acquisition plan and find suitable authoritative/public references. The resulting governed knowledge should normally be reusable domain knowledge with course/unit mappings, not Unit-202-owned duplicates.
