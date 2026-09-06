# Batch 06 -- Electronic Devices and Applications: Proposed Learning Points

**Status:** `PROPOSED_FOR_PA_REVIEW` -- none of these learning points is accepted, frozen or identity-locked.

Curriculum-review artifact, not finished lesson prose. Sequenced pedagogically (see instructionalSequence), not alphabetically or by numeric identity. Every learning point traces to at least one evidence-requirement claim in EVIDENCE-RESULTS.json. No EDA-LP-* learning point in this file is accepted, frozen, or identity-locked -- all 29 are proposals for Product Architect review. Learning points whose underlying evidence is PARTIALLY_VERIFIED or SOURCE_GAP carry evidenceReadiness HELD_PENDING_EVIDENCE_CORRECTION together with an evidenceReadinessNote saying exactly what is missing; none is marked READY on evidence that does not support it.

**Readiness:** 19 READY, 10 HELD_PENDING_EVIDENCE_CORRECTION.

## Instructional sequence

1. `EDA-LP-01` -- Resistor: basic operating principle
2. `EDA-LP-02` -- Reading the 4-band resistor colour code
3. `EDA-LP-03` -- Capacitor: basic operating principle
4. `EDA-LP-04` -- Diode: basic operating principle
5. `EDA-LP-05` -- LED: basic operating principle
6. `EDA-LP-06` -- Zener diode: basic operating principle
7. `EDA-LP-07` -- Photodiode: basic operating principle
8. `EDA-LP-08` -- LDR (light-dependent resistor): basic operating principle
9. `EDA-LP-09` -- Thermistor: basic operating principle, and the NTC/PTC distinction
10. `EDA-LP-10` -- Transistor: basic operating principle
11. `EDA-LP-11` -- Thyristor (SCR): basic operating principle and latching
12. `EDA-LP-12` -- TRIAC: basic operating principle
13. `EDA-LP-13` -- DIAC: basic operating principle
14. `EDA-LP-14` -- Rectifier: basic operating principle
15. `EDA-LP-15` -- Inverter: basic operating principle
16. `EDA-LP-16` -- Recognising the schematic symbols for Unit 202 components
17. `EDA-LP-17` -- Recognising components by their physical appearance
18. `EDA-LP-18` -- Dimmer switches: what they do and how phase control works
19. `EDA-LP-19` -- Dimmer: exact RC timing implementation and component values
20. `EDA-LP-20` -- Heating and boiler controls: function and the thermistor sensing role
21. `EDA-LP-21` -- Heating: exact transistor/relay switching topology
22. `EDA-LP-22` -- Motor control: function and controlled electronic switching
23. `EDA-LP-23` -- Motor drives: the bridge rectifier converting AC to DC
24. `EDA-LP-24` -- Security alarms: application category and function
25. `EDA-LP-25` -- Security alarm circuit: NC loop, transistor switching and SCR latching
26. `EDA-LP-26` -- The legacy UK analogue PSTN and what a telephone service is
27. `EDA-LP-27` -- The UK master socket and extension sockets
28. `EDA-LP-28` -- Inside the UK master socket: ringer capacitor, line-test resistor and surge protector
29. `EDA-LP-29` -- Wireless control systems: function and practical advantages

---

### `EDA-LP-01` -- Resistor: basic operating principle

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain what a resistor does in a circuit and what happens to the energy it takes from the circuit.

**Knowledge / procedure:** A resistor is a component that OPPOSES AND LIMITS the current in a circuit, and deliberately loses energy in the form of heat (thermal energy). Its resistance is defined as the ratio of the voltage applied across it to the current that flows through it. QUALIFICATION: Ohm's law (I = V/R) predicts a component's behaviour only where the resistance is effectively constant over the range of voltage being applied -- it is not an unrestricted property of every component.

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** `EFS-LP-05`, `EFS-LP-08`

**Knowledge-target IDs:** `unit202::ACQ-178`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::resistor-basic-operating-principle::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-ENERGYEDU-RESISTOR: A resistor is an electrical component in an electric circuit that slows down (opposes and limits) the current ...
- SRC-HYPERPHYSICS-RESISTANCE: The electrical resistance of a circuit component or device is defined as the ratio of the voltage applied to t...

**Depth justification:** The foundational component of the batch, and prerequisite to the LDR, the thermistor and the colour code. Kept as its own point because "what a resistor does" (opposes current AND dissipates the energy as heat) is a distinct mastery from the accepted Batch 02 EFS-LP-05, which defines resistance as a QUANTITY; this point is about the COMPONENT and its energy behaviour. Carries EFS-LP-05 and EFS-LP-08 as genuine cross-domain prerequisites since the outcome uses both the quantity and Ohm's law.

**Explicit exclusions:**
- Resistor construction types (carbon film, metal film, wirewound)
- Power rating and derating
- Series and parallel resistor networks (covered in accepted Batch 02, EFS-LP-12 and EFS-LP-16)
- Temperature coefficient of resistance

**Representative application types:**
- State what a resistor does to the current in a circuit.
- Explain what happens to the electrical energy a resistor takes from a circuit.
- Explain why a resistor becomes warm in use.

---

### `EDA-LP-02` -- Reading the 4-band resistor colour code

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to determine the resistance value and tolerance of a 4-band resistor from its colour bands.

**Knowledge / procedure:** ORIENTATION: read the bands from the end OPPOSITE the tolerance band. The tolerance band is the last band, is typically separated from the value bands by a wider gap, and is usually gold or silver. BAND MEANINGS: band 1 = first significant digit; band 2 = second significant digit; band 3 = the decimal multiplier; band 4 = the tolerance. COLOUR-TO-DIGIT MAPPING: black 0, brown 1, red 2, orange 3, yellow 4, green 5, blue 6, violet 7, grey 8, white 9. GOLD AND SILVER: in the MULTIPLIER band they are fractional multipliers of x0.1 and x0.01 respectively; in the TOLERANCE band they mean plus/minus 5% and plus/minus 10% respectively. Where no fourth band is present the tolerance is plus/minus 20%. CALCULATION METHOD: R = (first digit x 10 + second digit) x multiplier, with the tolerance applied as a plus/minus percentage. WORKED EXAMPLES: red-violet-green-gold gives (2 x 10 + 7) x 10^5 = 2.7 x 10^6 ohms, i.e. 2.7 Mohm plus/minus 5%. Blue-grey-brown-gold gives 68 x 10 = 680 ohms plus/minus 5%. Yellow-violet-red gives 47 x 10^2 = 4,700 ohms, i.e. 4.7 kohm.

**Within-domain prerequisites:** `EDA-LP-01`

**Cross-domain prerequisites:** `FM-LP-06`, `FM-LP-14`, `FM-LP-19`

**Knowledge-target IDs:** `unit202::ACQ-185`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::4-band-resistor-colour-code::PROCEDURE_COVERAGE` -- **VERIFIED**

**Normalized claim references:**
- SRC-GRINNELL-CSC211-RESISTORS: On a 4-band resistor the bands are read from the end opposite the tolerance band; the tolerance band is the la...
- SRC-DUKE-PRATTWIKI-COLOR-CODES: The colour-to-digit mapping for the significant-figure bands is: black 0, brown 1, red 2, orange 3, yellow 4, ...
- SRC-DUKE-PRATTWIKI-COLOR-CODES: Gold and silver act as fractional multipliers of x0.1 and x0.01 respectively when they appear in the multiplie...
- SRC-UCF-EEL3123-COLOR-CODE: The calculation method for a 4-band resistor is R = (first digit x 10 + second digit) x multiplier, with the t...
- SRC-DUKE-PRATTWIKI-COLOR-CODES: Further worked examples: blue-grey-brown-gold gives 68 x 10 = 680 ohms +/- 5%; yellow-violet-red gives 47 x 10...

**Depth justification:** A pure procedural mastery, separated from the resistor principle (EDA-LP-01) because it is a decoding skill rather than an understanding of the component: a learner can explain perfectly what a resistor does and still misread the bands, and the reverse is equally possible. Carries genuine cross-domain prerequisites on the accepted Batch 01 inventory -- FM-LP-06 (percentage of a quantity) for the tolerance, FM-LP-14 (indices) for the powers-of-ten multiplier, and FM-LP-19 (SI prefixes) for expressing the answer in kohm/Mohm.

**Explicit exclusions:**
- 5-band and 6-band precision codes
- The E-series preferred-value system
- Surface-mount numeric marking codes
- Capacitor marking codes
- Measuring the resistor to confirm the decoded value

**Representative application types:**
- Decode a resistor banded brown-black-red-gold.
- A resistor reads yellow-violet-orange-silver. State its value and tolerance.
- Explain how you know which end of a resistor to start reading from.
- State the tolerance of a resistor with only three bands.

---

### `EDA-LP-03` -- Capacitor: basic operating principle

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain what a capacitor does, describe its basic construction, and state where the stored energy actually resides.

**Knowledge / procedure:** A capacitor is an electronic device that STORES CHARGE AND ENERGY. It consists of two conductors carrying equal and opposite charges; in the parallel-plate form these are two equally-sized metal plates (electrodes) separated by an insulator known as a DIELECTRIC. The equal and opposite charge build-up produces an ELECTRIC FIELD between the plates. IMPORTANT: the energy held by a charged capacitor is stored IN THE ELECTRIC FIELD -- as energy density in that field -- and NOT in the conducting plates themselves. Inserting a dielectric material between the charged plates INCREASES the capacitance, because polarisation of the dielectric produces an electric field opposing the field of the charges on the plates.

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-170`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::capacitor-basic-operating-principle::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-ENERGYEDU-CAPACITOR: A capacitor is an electronic device that stores charge and energy. It consists of two conductors carrying equa...
- SRC-HYPERPHYSICS-CAPACITOR-ENERGY: The energy held by a charged capacitor is stored in the electric field, in the form of energy density in that ...
- SRC-HYPERPHYSICS-DIELECTRIC: Inserting a dielectric material between the charged plates increases the capacitance, because polarization of ...

**Depth justification:** A single-component mastery. The "energy is stored in the electric field, not in the plates" statement is carried as explicit knowledge content because "a capacitor stores electricity" is the vague formulation this learning point exists to displace. Deliberately scoped to the component's operating principle; capacitance as an electrical QUANTITY with its symbol and unit belongs to Batch 04 (EQCT-LP-09) and is not re-taught here.

**Explicit exclusions:**
- Capacitance as a quantity, its symbol and unit (Batch 04, EQCT-LP-09)
- Capacitive reactance (Batch 04, EQCT-LP-10)
- Charge/discharge time constants and RC curves
- Capacitor types and their selection
- Series and parallel capacitor combination
- Working voltage and polarity as design topics

**Representative application types:**
- State what a capacitor stores.
- Describe the basic construction of a parallel-plate capacitor.
- State where the energy in a charged capacitor is stored.
- Explain the purpose of the dielectric.

---

### `EDA-LP-04` -- Diode: basic operating principle

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain that a diode conducts in one direction only and state why that property is useful.

**Knowledge / procedure:** A diode is a component built on a P-N JUNCTION. It conducts current in the FORWARD direction (when forward biased, holes being driven to the junction from the p-type material and electrons from the n-type material so that a continuing current flows). In the REVERSE direction it blocks: the current will not flow, subject only to a small leakage. This ONE-DIRECTIONAL conduction property is what makes conversion of alternating current into direct current possible, which is why diodes are found in AC adapters and other rectifier circuits.

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** `EFS-LP-03`

**Knowledge-target IDs:** `unit202::ACQ-172`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::diode-basic-operating-principle::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-HYPERPHYSICS-PN-DIODE: A diode is a component built on a p-n junction that conducts current in the forward direction (when forward bi...
- SRC-ENERGYEDU-DIODE: The one-directional conduction property of the diode is what makes conversion of alternating current into dire...

**Depth justification:** The parent component for four further learning points (LED, Zener, photodiode, rectifier), so it is taught first and carried as their prerequisite. Kept minimal and qualitative at this level: the forward/reverse behaviour and its consequence, without semiconductor physics.

**Explicit exclusions:**
- A numeric forward threshold/knee voltage -- NOT evidenced in this batch and must not be taught as established here
- Semiconductor physics of the p-n junction beyond naming it
- Diode I-V characteristic curves and small-signal models
- Reverse breakdown as a normal operating mode (see EDA-LP-06 for the Zener diode)
- Diode selection, ratings and derating

**Representative application types:**
- State the direction in which a diode conducts.
- Explain why a diode can be used to change AC into DC.
- State what a diode does when it is reverse biased.

---

### `EDA-LP-05` -- LED: basic operating principle

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain how an LED produces light and state the bias condition it requires.

**Knowledge / procedure:** A light-emitting diode (LED) is a P-N JUNCTION device, constructed of compound semiconductors such as gallium arsenide, gallium arsenide phosphide or gallium phosphide. Its junction is FORWARD BIASED, and when electrons cross the junction they combine with holes and release energy as LIGHT. The forward-bias condition is essential: an LED emits light only when it is appropriately forward biased.

**Within-domain prerequisites:** `EDA-LP-04`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-174`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::led-basic-operating-principle::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-HYPERPHYSICS-LED: A light-emitting diode (LED) is a p-n junction device (constructed of compound semiconductors such as gallium ...

**Depth justification:** Separated from the plain diode (EDA-LP-04) as its own mastery because the distinguishing content -- that light is emitted at the junction on forward bias -- is exactly what a learner must be able to state, and because LED/diode/Zener/photodiode confusion is the characteristic failure in this component family. Each member gets its own point, each naming its distinguishing property.

**Explicit exclusions:**
- A numeric forward voltage, and the practical need for a current-limiting series resistor -- NEITHER is evidenced in this batch and must not be taught as established here
- Colour versus semiconductor material as a design topic
- LED lighting efficacy, driver circuits and thermal management
- Laser diodes and displays

**Representative application types:**
- State the condition an LED needs in order to emit light.
- Explain what happens at the junction of an LED when it is conducting.
- State what an LED does if it is connected the wrong way round.

---

### `EDA-LP-06` -- Zener diode: basic operating principle

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain how a Zener diode is operated and what makes it useful for voltage regulation.

**Knowledge / procedure:** A Zener diode uses a P-N junction in REVERSE BIAS to exploit the Zener effect -- a breakdown phenomenon which holds the voltage close to a constant value called the ZENER VOLTAGE. Its regulating behaviour is scoped specifically to REVERSE-BREAKDOWN operation: with sufficient reverse voltage applied, the junction breaks down and conducts in the reverse direction while maintaining a nearly constant voltage across itself. This is the opposite of how an ordinary diode is used, where reverse conduction is the failure to be avoided; in a Zener diode it is the intended working mode.

**Within-domain prerequisites:** `EDA-LP-04`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-183`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::zener-diode-basic-operating-principle::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-HYPERPHYSICS-ZENER: A Zener diode uses a p-n junction in REVERSE BIAS to make use of the Zener effect, a breakdown phenomenon whic...

**Depth justification:** Its own point because the distinguishing idea -- that reverse breakdown is the INTENDED operating region, in direct contrast to the ordinary diode taught in EDA-LP-04 -- is a genuine conceptual step and a common point of confusion. Prerequisite on EDA-LP-04 so the contrast is available to the learner.

**Explicit exclusions:**
- Zener versus avalanche breakdown as distinct physical mechanisms -- the retrieved source does not draw this distinction and it must not be asserted on its authority
- Zener regulator circuit design, series resistor sizing and load regulation
- Power dissipation and Zener ratings
- Temperature coefficient of the Zener voltage

**Representative application types:**
- State the bias condition in which a Zener diode is designed to operate.
- Explain what a Zener diode does to the voltage across it once breakdown is reached.
- Explain how a Zener diode differs in use from an ordinary diode.

---

### `EDA-LP-07` -- Photodiode: basic operating principle

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain how a photodiode responds to light, and state that its behaviour depends on its operating mode.

**Knowledge / procedure:** A photodiode is fundamentally a CURRENT GENERATOR. When light is absorbed in its active area an electron-hole pair is formed; the electrons and holes are separated, electrons passing to the n region and holes to the p region, producing a photocurrent. BEHAVIOUR MUST BE QUALIFIED BY OPERATING MODE: in ZERO-BIAS (photovoltaic) operation the generated photocurrent flows through a fixed load resistance and the resulting voltage depends on the incident radiation level; in REVERSE-BIASED (photoconductive) operation the device behaves differently again. It is therefore wrong to state a single unqualified photodiode behaviour without saying which mode is meant.

**Within-domain prerequisites:** `EDA-LP-04`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-175`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::photodiode-basic-operating-principle::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-SANDIEGO-CENTROVISION-PHOTODIODE: A photodiode is fundamentally a current generator: when light is absorbed in its active area an electron-hole ...
- SRC-SANDIEGO-CENTROVISION-PHOTODIODE: Behaviour must be qualified by operating mode. In zero-bias (photovoltaic) operation the generated photocurren...

**Depth justification:** Its own point, prerequisite on the diode, because the distinguishing property is that light rather than applied bias drives the current. The mode qualification is carried as explicit knowledge content per this batch's guardrail, since presenting one mode as the whole story is the characteristic overclaim for this component.

**Explicit exclusions:**
- Detailed photovoltaic versus photoconductive circuit design
- Responsivity, quantum efficiency, spectral response and noise
- Solar cells as a power-generation topic
- Phototransistors and photomultipliers

**Representative application types:**
- State what a photodiode produces when light falls on it.
- Explain why a photodiode's behaviour cannot be described without saying how it is biased.
- Describe what happens inside a photodiode when light is absorbed.

---

### `EDA-LP-08` -- LDR (light-dependent resistor): basic operating principle

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to state how an LDR's resistance changes with the light falling on it.

**Knowledge / procedure:** A light-dependent resistor (LDR), also called a photoresistor, changes its ELECTRICAL RESISTANCE as the light falling upon it changes. Specifically, its resistance DECREASES as the incident light INCREASES, and correspondingly RISES as the light falls. Note the direction carefully -- more light means LESS resistance. This is the property that lets an LDR be used as a light sensor in a circuit.

**Within-domain prerequisites:** `EDA-LP-01`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-176`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::ldr-light-dependent-resistor-basic-operating-principle::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-NAPIER-LDR: A light-dependent resistor (LDR), also called a photoresistor, changes its electrical resistance as the light ...

**Depth justification:** A single, small, high-value mastery. It is kept separate rather than bundled with the thermistor because, although both are variable resistors responding to an environmental quantity, the direction of the LDR effect is unambiguous whereas the thermistor has two opposite families (EDA-LP-09) -- bundling them would invite the learner to generalise a single direction across both. The direction of the effect is stated emphatically because reversing it is the characteristic error.

**Explicit exclusions:**
- Representative dark and illuminated resistance values -- NOT evidenced in this batch
- Spectral response and response time
- LDR sensing-circuit design (potential dividers, comparators)
- Cadmium sulphide material chemistry and RoHS considerations

**Representative application types:**
- State what happens to an LDR's resistance when the light on it increases.
- Explain how an LDR can be used to detect darkness.

---

### `EDA-LP-09` -- Thermistor: basic operating principle, and the NTC/PTC distinction

**Evidence readiness:** READY

**Evidence readiness note:** [Correction, Stage 1.1/5.6] Previously held on disclosed compounding of NTC and PTC evidence across separate Murata pages. Corrected: multi-source composition is valid verification, never a partial result. Now fully VERIFIED.

**Learner outcome:** The learner will be able to explain what a thermistor does and distinguish NTC from PTC types by the direction of their resistance change.

**Knowledge / procedure:** A thermistor is a resistive element whose RESISTANCE CHANGES WITH TEMPERATURE, and thermistors are used as temperature sensors by exploiting that change. CRITICALLY, THERMISTORS ARE NOT ALL OF ONE POLARITY. NTC (negative temperature coefficient) thermistors have a resistance that FALLS as temperature RISES; they are made from a mixture of metal oxides and are the type used for general temperature sensing. PTC (positive temperature coefficient) thermistors behave in the opposite direction, but with an important scope limitation stated by the source: between room temperature and the Curie point a PTC's resistance decreases slightly or is almost constant, and only ABOVE the Curie point does the resistance increase sharply. It is therefore wrong to say either that "a thermistor's resistance falls as temperature rises" without qualification, or that a PTC's resistance rises steadily across its whole range.

**Within-domain prerequisites:** `EDA-LP-01`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-179`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::thermistor-basic-operating-principle::EXACT_FACT` -- **PARTIALLY_VERIFIED**

**Normalized claim references:**
- SRC-MURATA-PTC-ABOUT: A thermistor is a resistive element whose resistance changes with temperature, and thermistors are used as tem...
- SRC-MURATA-NTC-OVERVIEW: NTC (negative temperature coefficient) thermistors are elements whose resistance FALLS with an increase in tem...
- SRC-MURATA-PTC-RT: PTC (positive temperature coefficient) thermistors behave in the opposite direction, but with an important sco...

**Depth justification:** The NTC/PTC distinction is carried inside this single learning point rather than split into two, because the whole mastery is knowing that two opposite families exist -- two separate points would each teach one direction and would recreate exactly the overgeneralisation this content exists to prevent. The PTC Curie-point qualification is retained because the evidence does not support a simpler statement.

**Explicit exclusions:**
- Beta values, resistance-temperature curves and linearisation
- Self-heating effects and dissipation constants
- Inrush-current-limiting and self-resetting-fuse applications of PTCs
- Thermistor circuit design beyond the sensing role in EDA-LP-20

**Representative application types:**
- State what happens to an NTC thermistor's resistance as it gets hotter.
- Explain why "a thermistor's resistance falls as temperature rises" is not a safe general statement.
- State the difference between an NTC and a PTC thermistor.

---

### `EDA-LP-10` -- Transistor: basic operating principle

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to state the two things a transistor can do in a circuit and name its three terminals.

**Knowledge / procedure:** A transistor is a component of electric circuits that can act as an AMPLIFIER and as a SWITCH. It comprises three doped semiconductor regions. In a BIPOLAR JUNCTION transistor the end regions are the COLLECTOR and the EMITTER, and the middle region is the BASE; for an NPN transistor conventional current flows from collector to emitter. A small current or voltage at the base controls a much larger current between collector and emitter, which is what makes both the amplifying and the switching functions possible.

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** `EFS-LP-03`

**Knowledge-target IDs:** `unit202::ACQ-181`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::transistor-basic-operating-principle::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-ENERGYEDU-TRANSISTOR: A transistor is a component of electric circuits that can act as an amplifier and as a switch. It comprises th...

**Depth justification:** A single-component mastery covering the dual amplifier/switch role and the terminal names, which is the whole of what this qualification requires. The switching role reappears in application context in EDA-LP-25 (security alarm), where the cutoff/saturation framing is added; keeping the general principle here avoids repeating it in every application.

**Explicit exclusions:**
- Field-effect transistors -- the retrieved terminal names are BJT-specific and FETs are not covered by this batch's evidence
- Bias design, operating-point calculation and load lines
- Current gain (hFE/beta) as a calculated quantity
- Amplifier classes and configurations
- Semiconductor physics of the junctions

**Representative application types:**
- State the two functions a transistor can perform in a circuit.
- Name the three terminals of a bipolar junction transistor.
- Explain what controls the current between collector and emitter.

---

### `EDA-LP-11` -- Thyristor (SCR): basic operating principle and latching

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain how an SCR is turned on, why it is described as latching, and what is required to turn it off.

**Knowledge / procedure:** A thyristor, or SCR (silicon controlled rectifier), is a four-layer PNPN semiconductor switch that is UNIDIRECTIONAL -- a unilateral device requiring a POSITIVE GATE SIGNAL with respect to the cathode to turn on. It is LATCHING: for the SCR to latch on, the anode-to-cathode current must exceed the LATCHING CURRENT (IL). Once latched on, it REMAINS CONDUCTING EVEN AFTER THE GATE SIGNAL IS REMOVED, and stays on until the anode-to-cathode current falls below the HOLDING CURRENT (IH) -- the minimum principal current required to maintain the device in the on state. A momentary positive pulse at the gate therefore initiates self-sustaining conduction: a small gate current switches a large principal current.

**Within-domain prerequisites:** `EDA-LP-04`, `EDA-LP-10`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-180`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::thyristor-scr-basic-operating-principle::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-LITTELFUSE-AN1002-GATING-LATCHING-HOLDING: A thyristor (SCR, silicon controlled rectifier) is a four-layer PNPN semiconductor switch that is UNIDIRECTION...
- SRC-LITTELFUSE-AN1002-GATING-LATCHING-HOLDING: The SCR is LATCHING: for the SCR to latch on, the anode-to-cathode current (IT) must exceed the latching curre...
- SRC-LITTELFUSE-AN1001-THYRISTOR-FUNDAMENTALS: A small gate current switches a large principal current: a momentary positive pulse applied to the gate initia...

**Depth justification:** The parent of the thyristor family, taught before the TRIAC and DIAC so that "bidirectional" and "trigger device" have a reference point. The latching property, together with its holding-current turn-off condition, is the core content -- it is what distinguishes an SCR from a transistor switch and what makes it useful in an alarm (EDA-LP-25). Stating the turn-off condition precisely (current below IH) rather than loosely ("until the supply is removed") reflects a genuine precision conflict between the retrieved sources, resolved in favour of the manufacturer's exact criterion.

**Explicit exclusions:**
- Gate-trigger circuit design, dV/dt and dI/dt ratings, snubbers
- Commutation methods and forced turn-off circuits
- Gate turn-off (GTO) thyristors
- Detailed four-layer device physics beyond naming the PNPN structure

**Representative application types:**
- Explain what is meant by saying an SCR latches.
- State what must happen for a conducting SCR to turn off.
- Explain why removing the gate signal does not stop an SCR conducting.

---

### `EDA-LP-12` -- TRIAC: basic operating principle

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain what a TRIAC does and how it differs from an SCR.

**Knowledge / procedure:** A TRIAC (triode AC switch) is a three-terminal BIDIRECTIONAL thyristor whose primary function is to CONTROL POWER BILATERALLY IN AN AC CIRCUIT. Its operation can be related to two SCRs connected in parallel in opposite directions, but it has a SINGLE gate, and it can be triggered on by a gate signal of EITHER POLARITY. Because it operates in both directions, it behaves in either direction essentially as an SCR behaves in its forward direction. [Correction, Stage 5 hard factual correction] In response to a trigger it LATCHES ON and remains conducting until the current through it falls below its HOLDING CURRENT (IH) -- the same latching mechanism already taught for the SCR (EDA-LP-11) -- NOT simply "until the applied AC voltage reaches zero". With a RESISTIVE AC load, current and voltage cross zero together, so turn-off happens close to the voltage zero crossing and the two descriptions coincide in that one case. With an INDUCTIVE load (e.g. a motor), current lags voltage, so the current's own zero crossing -- and therefore the TRIAC's actual turn-off point -- does NOT necessarily coincide with the applied voltage reaching zero. Once it turns off, it blocks current flow until the next trigger occurs -- which is what makes it an efficient AC power-control switch.

**Within-domain prerequisites:** `EDA-LP-11`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-182`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::triac-basic-operating-principle::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-LITTELFUSE-AN1001-THYRISTOR-FUNDAMENTALS: A TRIAC (triode AC switch) is a three-terminal BIDIRECTIONAL thyristor whose primary function is to control po...
- SRC-HYPERPHYSICS-GSU-DIAC-TRIAC-THYRISTOR: Because a TRIAC operates in both directions, it behaves essentially the same in either direction as an SCR wou...

**Depth justification:** Taught immediately after and prerequisite on the SCR, because the evidenced definition of a TRIAC is expressed in terms of SCRs ("two SCRs in inverse parallel, but with a single gate"). Its distinguishing property -- BIDIRECTIONAL, hence suitable for full-wave AC control -- is the single most important contrast in this family and is what makes it the device used in the dimmer (EDA-LP-18).

**Explicit exclusions:**
- Quadrant triggering and gate sensitivity by quadrant
- Commutating dV/dt, dI/dt and snubber design
- Alternistors and logic-level triacs as device variants
- Heat sinking and package power ratings

**Representative application types:**
- State what makes a TRIAC different from an SCR.
- Explain why a TRIAC is suitable for controlling an AC load.
- State what happens to a conducting TRIAC when the AC supply voltage passes through zero.

---

### `EDA-LP-13` -- DIAC: basic operating principle

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain what a DIAC does, state that it has no gate, and describe what it is used for.

**Knowledge / procedure:** A DIAC is a TWO-TERMINAL, BIDIRECTIONAL thyristor-family device WITH NO GATE. It holds a high-impedance blocking state until the applied voltage reaches a BREAKOVER voltage (VBO), at which point it breaks down and conducts; because its structure is symmetrical it does this in EITHER polarity. It is a form of solid-state switch used with AC, accomplishing its switching action by breakdown at a certain voltage. Its single major application is TO SWITCH ON (TRIGGER) TRIACS -- it is a trigger device, not a power-handling device, and must not be confused with the TRIAC it triggers.

**Within-domain prerequisites:** `EDA-LP-12`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-171`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::diac-basic-operating-principle::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-LITTELFUSE-AN1001-THYRISTOR-FUNDAMENTALS: A DIAC is a two-terminal bidirectional thyristor-family device with no gate. Its bidirectional, transistor-lik...
- SRC-HYPERPHYSICS-GSU-DIAC-TRIAC-THYRISTOR: A DIAC is a form of solid-state switch used to switch AC voltage and belongs to the class of switches known as...

**Depth justification:** Taught last in the thyristor family and prerequisite on the TRIAC, because its purpose is defined by what it triggers. The three-way distinction that this sequence establishes -- SCR unidirectional and latching, TRIAC bidirectional and power-handling, DIAC bidirectional and gateless trigger -- is precisely the discrimination the qualification requires, and it is only diagnosable if the three are separate learning points that each name the others.

**Explicit exclusions:**
- SIDACs and other breakover devices
- Negative-resistance characteristics and device modelling
- Breakover-voltage tolerance and selection
- Trigger-circuit design beyond the dimmer application in EDA-LP-18

**Representative application types:**
- State how many terminals a DIAC has and whether it has a gate.
- Explain what causes a DIAC to start conducting.
- State the main use of a DIAC.
- Explain the difference between a DIAC and a TRIAC.

---

### `EDA-LP-14` -- Rectifier: basic operating principle

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain what rectification does, describe half-wave and full-wave bridge arrangements, and state honestly what the output waveform is like.

**Knowledge / procedure:** A rectifier performs RECTIFICATION: turning an ALTERNATING current waveform into a DIRECT current waveform -- creating a signal that has only a SINGLE POLARITY. This rests on the diode's property of allowing current to flow in one direction but not the other. In a HALF-WAVE rectifier only half of the input waveform is passed. A FULL-WAVE BRIDGE rectifier uses FOUR diodes in a bridge arrangement: for both the positive and the negative swings of the supply there is a forward path through the bridge, so both halves of the input contribute to the output. IMPORTANT QUALIFICATION: the output of a rectifier alone is a PULSATING DC waveform of a single polarity, NOT smooth DC. Any claim that a rectifier by itself produces smooth DC is unsupported.

**Within-domain prerequisites:** `EDA-LP-04`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-177`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::rectifier-basic-operating-principle::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-LIBRETEXTS-FIORE-RECTIFICATION: A rectifier performs rectification, which is the process of turning an alternating current waveform into a dir...
- SRC-ENERGYEDU-DIODE: The rectifier's AC-to-DC conversion rests on the diode's property of allowing current to flow in one direction...

**Depth justification:** The application-level counterpart to the diode principle, kept separate because rectification is a circuit FUNCTION rather than a component property. The "pulsating DC, not smooth DC" qualification is carried as explicit knowledge content because it is the standard overclaim, and because smoothing is deliberately out of scope here.

**Explicit exclusions:**
- Smoothing capacitors, ripple and filter design
- Peak inverse voltage, diode ratings and selection
- Three-phase rectification
- Controlled rectification using SCRs as a topic in its own right

**Representative application types:**
- State what a rectifier does.
- State how many diodes a bridge rectifier uses.
- Explain the difference between half-wave and full-wave rectification.
- Explain why the output of a rectifier alone is not smooth DC.

---

### `EDA-LP-15` -- Inverter: basic operating principle

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to state what an inverter does.

**Knowledge / procedure:** An inverter is a device that converts DIRECT CURRENT (DC) electricity into ALTERNATING CURRENT (AC) electricity. It is therefore the functional OPPOSITE of a rectifier, which converts AC into DC. A familiar example is a solar installation, where the DC produced by a solar panel is converted by an inverter into the AC used by the building and the grid.

**Within-domain prerequisites:** `EDA-LP-14`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-173`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::inverter-basic-operating-principle::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-DOE-EERE-INVERTERS: An inverter is a device that converts direct current (DC) electricity into alternating current (AC) electricit...

**Depth justification:** A short, single-fact learning point, kept separate and taught immediately after the rectifier so the two can be defined against each other -- DC-to-AC versus AC-to-DC. That pairing is the whole of the required mastery at this level, and it is also the guard against the common error of defining an inverter only as a variable-speed motor drive.

**Explicit exclusions:**
- The switching mechanism by which DC-to-AC conversion is achieved -- NOT evidenced in this batch and deliberately out of scope at this level
- Variable-speed drives and motor inverters as a topic -- an inverter must NOT be defined only as a VSD
- Pure sine versus modified sine output
- Grid-tie synchronisation, islanding and inverter standards

**Representative application types:**
- State what an inverter converts.
- Explain the difference between an inverter and a rectifier.

---

### `EDA-LP-16` -- Recognising the schematic symbols for Unit 202 components

**Evidence readiness:** HELD_PENDING_EVIDENCE_CORRECTION

**Evidence readiness note:** Underlying evidence is PARTIALLY_VERIFIED on BOTH BREADTH and STANDARD CURRENCY, and this learning point must not be published as-is without a Product Architect decision. (1) BREADTH: retrieved symbol evidence covers 13 of the 15 component families. There is NO evidence for the LED symbol -- the standard read does not list a symbol named "light-emitting diode", the nearest being a "photoemissive type" item -- and NO distinct symbol for an INVERTER, which appears only as a lettered general circuit-element rectangle. The LED entry above is therefore ABSENT from the knowledge content deliberately, and must not be filled in from memory. (2) CURRENCY: all symbol evidence traces to the 1975 ANSI Y32.2 / CSA Z99 / IEEE Std 315 standard (self-described as harmonised with IEC Publication 117), read from a third-party university-hosted scan because the IEC 60617 official database and IEC Electropedia both returned 403. NOTHING is verified against current BS EN 60617, which is the standard a UK qualification would be expected to follow. (3) The resistor has two alternative standard forms (zigzag and rectangle) with no stated preference; the UK convention was not confirmed from a retrieved source.

**Learner outcome:** The learner will be able to identify the standard schematic symbol for each of the Unit 202 component families on a circuit diagram.

**Knowledge / procedure:** Standard graphic symbols for these component families are defined in a recognised graphic-symbols standard. RESISTOR: shown in two alternative forms, a zigzag line and a plain rectangle. THERMISTOR and LDR: the resistor symbol with the appropriate modifier. CAPACITOR: two parallel plates, with the polarised form distinguished. DIODE / RECTIFIER DIODE: a triangle against a bar, between anode (A) and cathode (K). ZENER (breakdown) DIODE: the diode symbol with a bent/flagged bar. PHOTODIODE: the diode symbol with incoming light arrows. TRANSISTOR: the three-terminal symbol with an arrow on the emitter indicating type. SCR: a triangle-and-bar with anode and cathode terminals and a GATE lead entering at the bar. TRIAC: two triangle-and-bar structures in inverse parallel with a single gate lead. DIAC: the bidirectional two-terminal structure with NO gate lead. BRIDGE RECTIFIER: four diode symbols in a diamond bridge. RELAY: a coil rectangle with an associated changeover contact set (a basic form is a circle enclosing the letter R).

**Within-domain prerequisites:** `EDA-LP-01`, `EDA-LP-03`, `EDA-LP-04`, `EDA-LP-10`, `EDA-LP-13`, `EDA-LP-14`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-184`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::schematic-symbol-recognition-for-each-named-ac6-2-component-device-family-at-qualification-depth::SYMBOL_OR_CONVENTION` -- **PARTIALLY_VERIFIED**

**Normalized claim references:**
- SRC-IEEE315-1975-ANSI-Y32-2-GRAPHIC-SYMBOLS: The standard graphic symbols for the Unit 202 component families are defined in ANSI Y32.2-1975 / CSA Z99-1975...
- SRC-IEEE315-1975-ANSI-Y32-2-GRAPHIC-SYMBOLS: RESISTOR - item 2.1.1 'Resistor / General', shown in two alternative forms both marked IEC: a zigzag line, and...
- SRC-IEEE315-1975-ANSI-Y32-2-GRAPHIC-SYMBOLS: DIODE - item 8.5.1 'Semiconductor diode; semiconductor rectifier diode; metallic rectifier', a triangle agains...
- SRC-IEEE315-1975-ANSI-Y32-2-GRAPHIC-SYMBOLS: RELAY - item 4.30 'Relay', with 4.30.1 'Basic' shown as a circle enclosing the letter R, and 4.30.2 'Applicati...
- SRC-IEEE315-1975-ANSI-Y32-2-GRAPHIC-SYMBOLS: LED - QUALIFIED / PARTIALLY_VERIFIED. This 1975 standard does NOT list a symbol under the name 'light-emitting diode' in ...
- SRC-IEEE315-1975-ANSI-Y32-2-GRAPHIC-SYMBOLS: INVERTER - QUALIFIED / NOT COVERED as a distinct graphic symbol. In this standard a static inverter is represe...
- SRC-LITTELFUSE-AN1001-THYRISTOR-FUNDAMENTALS: Manufacturer corroboration for the three thyristor-family symbols specifically: Littelfuse AN1001 Figure AN100...

**Depth justification:** A single recognition point spanning the whole component set, because symbol recognition is one skill exercised across a symbol table, not a separate mastery per component. Prerequisite on the principle learning points for the main families, so the learner attaches each symbol to a component they already understand rather than memorising shapes.

**Explicit exclusions:**
- Drawing complete circuit diagrams to standard
- Reference designators, part numbering and netlist conventions
- PCB layout and land-pattern symbols
- Symbol variants beyond those retrieved

**Representative application types:**
- Identify the component represented by a given symbol on a circuit diagram.
- Distinguish the SCR symbol from the TRIAC symbol.
- Explain how the DIAC symbol shows that the device has no gate.

---

### `EDA-LP-17` -- Recognising components by their physical appearance

**Evidence readiness:** HELD_PENDING_EVIDENCE_CORRECTION

**Evidence readiness note:** Underlying evidence is PARTIALLY_VERIFIED on BREADTH, and this learning point covers only part of the component set. Appearance evidence was obtained for 4 of 15 families (diode/rectifier, aluminium electrolytic capacitor, bipolar transistor, and thyristor-family devices at PACKAGE-NAME level only). NO appearance evidence was obtained for: resistor, LED, Zener diode, photodiode, LDR, thermistor, bridge-rectifier assembly, inverter or relay. Furthermore NO PHOTOGRAPHS were retrieved at all -- all evidence is manufacturer mechanical data, package-outline drawings and marking diagrams, and none was invented. A Product Architect decision is needed on whether to commission or license photographic material before this outcome can be delivered.

**Learner outcome:** The learner will be able to recognise common components from their typical physical appearance and markings, and explain why appearance alone is not conclusive.

**Knowledge / procedure:** Components are recognised from a combination of PACKAGE SHAPE, MARKINGS and CONTEXT. DIODE / RECTIFIER DIODE (1N4001-1N4007 family): a small axial-leaded, moulded epoxy cylindrical body; POLARITY is indicated by a colour band marking the CATHODE end. ALUMINIUM ELECTROLYTIC CAPACITOR: a polarised part in a cylindrical aluminium case with a pressure relief, insulated with a sleeve, with radial leads, and with negative-terminal identification marked on the body. BIPOLAR TRANSISTOR (e.g. 2N3903/2N3904): supplied in the TO-92 package, a small moulded three-lead package, with the type number printed on the flat face. THYRISTOR-FAMILY DEVICES (SCRs, TRIACs, DIACs): supplied in a range of packages including TO-92, DO-15, TO-220 and TO-218. CRITICAL CAVEAT: PACKAGE OUTLINE ALONE DOES NOT DETERMINE WHICH COMPONENT FAMILY A DEVICE BELONGS TO. The TO-92 package, for instance, is used both for NPN bipolar transistors and for thyristor-family devices. Identification therefore rests on the PRINTED TYPE MARKING together with the circuit context, not on shape alone.

**Within-domain prerequisites:** `EDA-LP-16`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-186`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::physical-photo-appearance-recognition-of-each-component::SCHEMATIC_OR_DIAGRAM_RECOGNITION` -- **PARTIALLY_VERIFIED**

**Normalized claim references:**
- SRC-VISHAY-1N4001-DO41-PLASTIC-RECTIFIER: Diode / rectifier diode (1N4001-1N4007 family): typical physical appearance is a small axial-leaded, molded ep...
- SRC-VISHAY-048RML-ALU-ELECTROLYTIC-CAPACITOR: Aluminium electrolytic capacitor (Vishay 048 RML radial series): typical physical appearance is a polarized, n...
- SRC-ONSEMI-2N3903-2N3904-TO92: Bipolar transistor (onsemi 2N3903 / 2N3904, NPN silicon general purpose): supplied in the TO-92 package (CASE ...
- SRC-LITTELFUSE-AN1004-MOUNTING-AND-PACKAGES: Thyristor-family devices (SCRs, TRIACs, DIACs and related Littelfuse Teccor power semiconductors) are supplied...
- SRC-ONSEMI-2N3903-2N3904-TO92: IMPORTANT RECOGNITION CAVEAT supported by cross-reading the retrieved manufacturer sources: package outline al...

**Depth justification:** A practical bench-recognition skill, separate from symbol recognition (EDA-LP-16) because one is about reading a drawing and the other about identifying a physical object. The "appearance alone is not conclusive" caveat is carried as central knowledge content rather than a footnote, because it is both evidenced by cross-reading the manufacturer sources and the single most important safeguard against confident misidentification.

**Explicit exclusions:**
- Identifying a component's exact value or rating from its appearance
- Full package-outline dimensional data
- Surface-mount package identification
- Decoding manufacturer date and lot codes

**Representative application types:**
- Identify the cathode end of an axial rectifier diode.
- Explain why a TO-92 package does not by itself tell you that a device is a transistor.
- State what you would look at, besides shape, to identify an unknown three-legged component.

---

### `EDA-LP-18` -- Dimmer switches: what they do and how phase control works

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain the function of a dimmer, describe how phase control varies the power delivered to a lamp, and state the roles of the TRIAC and the DIAC in the circuit.

**Knowledge / procedure:** FUNCTION: a light dimmer operates directly on the mains, connected in series with the line conductor in place of a mechanical switch, and controls lamps supplied directly from the mains. Light dimming is one of a family of phase-control applications alongside heat control and motor speed control. HOW PHASE CONTROL WORKS: the trigger point within each half-cycle is set by an RC charging network. Varying the RC time constant makes the trigger device break down at different phase angles within the cycle, which varies the CONDUCTION ANGLE -- the portion of each half-cycle for which the power device conducts -- and hence the power delivered to the load. THE RELATIONSHIP IS STRONGLY NON-LINEAR: in a full-wave circuit a conduction angle of 150 degrees delivers about 97% of full power, while 30 degrees delivers only about 3%. ROLE OF THE TRIAC: the TRIAC is the power switching device operating directly on the mains. It provides full-wave AC control, remaining off and blocking all current except a minute leakage until triggered, then conducting for the remainder of that half-cycle. ROLE OF THE DIAC: the DIAC is the trigger. When the voltage across the timing capacitor reaches the DIAC's breakover voltage, the capacitor discharges through the DIAC into the TRIAC gate, firing it. Because the DIAC is bidirectional it provides triggering on both the positive and negative half-cycles. QUALIFICATION: the power-versus-conduction-angle figures above are stated for a RESISTIVE / constant-impedance load; lamps and motors change impedance with applied voltage, so the relationship differs for those loads.

**Within-domain prerequisites:** `EDA-LP-12`, `EDA-LP-13`, `EDA-LP-03`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-149`, `unit202::ACQ-161`, `unit202::ACQ-162`, `unit202::ACQ-163`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::dimmer-switches-application-category-function::EXACT_FACT` -- **VERIFIED**
- `ER::provisional::unit202::electronic-devices-and-applications::dimmer-triac-ac-switching-control::EXACT_FACT` -- **VERIFIED**
- `ER::provisional::unit202::electronic-devices-and-applications::dimmer-diac-triggering::EXACT_FACT` -- **VERIFIED**
- `ER::provisional::unit202::electronic-devices-and-applications::dimmer-basic-timing-control-delivered-power-relationship::RELATIONSHIP` -- **VERIFIED**

**Normalized claim references:**
- SRC-ST-AN392-MCU-TRIAC-MAINS: Dimmer (light dimming) is one of the named domestic application categories for electronic power-control device...
- SRC-ST-AN392-MCU-TRIAC-MAINS: The function of a light dimmer is to operate directly on the 110 V or 240 V mains, connected in series with th...
- SRC-LITTELFUSE-TECCOR-AN1003-PHASE-CONTROL: Light dimming is implemented as a phase control application: the same phase-control circuit family serves inca...
- SRC-ST-AN392-MCU-TRIAC-MAINS: The triac is the power switching device that operates directly on the 110/240 V mains and is described as the ...
- SRC-LITTELFUSE-TECCOR-AN1003-PHASE-CONTROL: The triac provides full-wave AC control: for full-wave AC control a single triac (or, alternatively, two SCRs ...
- SRC-LITTELFUSE-TECCOR-AN1003-PHASE-CONTROL: In phase-control operation the triac is held off (blocking all current except a minute leakage current) until ...
- SRC-ST-AN392-MCU-TRIAC-MAINS: Qualification preserved: in a dimmer the load is treated as resistive and dynamic constraints on the triac are...
- SRC-LITTELFUSE-TECCOR-AN1003-PHASE-CONTROL: In a basic full-wave diac-triac phase control (dimmer) circuit the adjustable resistor R1 and capacitor C1 for...
- SRC-LITTELFUSE-TECCOR-AN1003-PHASE-CONTROL: The diac is a bidirectional trigger: the source plots both a positive and a negative diac breakover threshold ...
- SRC-LITTELFUSE-TECCOR-AN1003-PHASE-CONTROL: The source records a hysteresis or 'snap back' consequence of capacitor-diac triggering: after the gate pulse ...
- SRC-LITTELFUSE-TECCOR-AN1003-PHASE-CONTROL: In a thyristor phase-control dimmer the trigger point is set by an RC charging network: varying the RC time co...
- SRC-LITTELFUSE-TECCOR-AN1003-PHASE-CONTROL: The relationship between conduction angle and delivered power is strongly non-linear: in a full-wave circuit a...
- SRC-LITTELFUSE-TECCOR-AN1003-PHASE-CONTROL: The source states this power-versus-conduction-angle relationship for a resistive/constant-impedance load (the...
- SRC-ST-AN392-MCU-TRIAC-MAINS: Independently, in an MCU-driven mains light dimmer the power delivered to the lamp is controlled by the phase ...

**Depth justification:** The four VERIFIED dimmer requirements are combined because they describe one circuit doing one job: the function, the phase-control mechanism, and the two device roles are only meaningful in relation to each other, and separating them would produce four points that each have to restate the circuit. The exact component-value requirement is deliberately held OUT of this point (see EDA-LP-19) precisely so that the well-evidenced conceptual content is not blocked by the unevidenced exact implementation. SAFETY: treatment is function and conceptual topology only -- this is mains equipment and no construction or wiring instruction is given.

**Explicit exclusions:**
- ANY construction, wiring or installation instruction -- this is a mains circuit and treatment is conceptual only
- Exact component values (see EDA-LP-19, which is held)
- Snubber design, dV/dt and commutation constraints
- Electronic transformers, LED-lamp dimming compatibility and trailing/leading-edge dimmer types
- A closed-form algebraic power-versus-firing-angle equation -- not evidenced at this level

**Representative application types:**
- Explain how a dimmer reduces the brightness of a lamp without wasting energy as heat in a resistor.
- State the function of the TRIAC in a dimmer circuit.
- Explain what the DIAC does in a dimmer circuit.
- Explain why halving the conduction angle does not halve the power delivered.

---

### `EDA-LP-19` -- Dimmer: exact RC timing implementation and component values [RETIRED_OUT_OF_SCOPE]

**Evidence readiness:** RETIRED_OUT_OF_SCOPE

**Evidence readiness note (Stage 5 exemplar decision 1):** Retired rather than left held. The exact dimmer RC timing values are never canonical technical truth for this qualification: the frozen requirement text names no figure, no circuit and no source document, so there is no determinate circuit against which any retrieved values can be checked, and the one manufacturer application note relied upon gives FOUR mutually inconsistent value sets across its own figures, while a second manufacturer implements the same function with no RC network at all (firmware timing). Selecting one set would be an editorial invention presented as fact. This is a scope decision, not an unresolved technical-evidence gap. The conceptual dimmer content (what a dimmer does, how phase control works, the TRIAC's and DIAC's roles) remains fully evidenced and READY under EDA-LP-18.

**Learner outcome:** (retired -- not taught as canonical mastery)

**Knowledge / procedure:** RETIRED_OUT_OF_SCOPE. No exact RC implementation is, or ever will be, taught as canonical mastery for this qualification. See the evidence readiness note. Manufacturer reference circuits do specify exact values for their OWN named circuits (for example a basic DIAC-TRIAC phase control using R1 = 250K adjustable, R2 = 3.3K, C1 = 0.1 uF with a named DIAC and TRIAC), but which circuit this requirement intends is not determinable, and the manufacturer note itself gives several mutually inconsistent value sets for different supply voltages and load currents.

**Within-domain prerequisites:** `EDA-LP-18`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-164`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::dimmer-exact-rc-timing-implementation-component-values::EXACT_FACT` -- **PARTIALLY_VERIFIED**

**Normalized claim references:**
- SRC-LITTELFUSE-TECCOR-AN1003-PHASE-CONTROL: Littelfuse/Teccor AN1003 states exact RC timing component values for its OWN named reference circuits: Figure ...
- SRC-LITTELFUSE-TECCOR-AN1003-PHASE-CONTROL: AN1003 Figure 16.14, a single-time-constant circuit for incandescent light dimming, heat control and motor spe...
- SRC-LITTELFUSE-TECCOR-AN1003-PHASE-CONTROL: AN1003 shows the method by which such values are derived for a stated set of assumptions (S2010L SCR, 32 V tri...

**Depth justification:** Deliberately separated from EDA-LP-18 so that a genuinely unevidenced exact-implementation requirement does not block the well-evidenced conceptual dimmer content. This is the correct structural response to a requirement whose object cannot be identified: isolate it, hold it, and leave the rest of the topic deliverable.

**Explicit exclusions:**
- Any specific component values as taught content, pending Product Architect adjudication
- Circuit construction or wiring instruction of any kind
- Component selection and design calculation

**Representative application types:**
- (Held pending adjudication -- no application types are proposed while the intended circuit is unidentified.)

---

### `EDA-LP-20` -- Heating and boiler controls: function and the thermistor sensing role

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain what electronic heating controls do and describe the role of the thermistor within them.

**Knowledge / procedure:** FUNCTION: heating and boiler control is an established application category for electronic devices. Its function at this level is to SENSE the temperature of the medium and SWITCH OR PROPORTION the power to the heating element accordingly -- a sensing element plus a power-switching element. Heat control is one of the application categories served by the thyristor phase-control circuit family, alongside light dimming and motor speed control. THERMISTOR SENSING ROLE: an NTC thermistor is the temperature-sensing element. Its resistance has a NEGATIVE relationship with temperature, and the relatively large negative slope means even small temperature changes cause a significant change in resistance -- which is what makes it suited to sensing. In heating applications specifically, an immersion NTC thermistor is fitted directly into the medium in heat pumps, heat exchangers, storage tanks and boilers to acquire the medium temperature. In a thyristor heating-control circuit the thermistor appears as the temperature-sensing resistance within the trigger network. TYPE QUALIFICATION: the evidence here is specifically for NTC thermistors. Do not assume a PTC would behave the same way -- see EDA-LP-09.

**Within-domain prerequisites:** `EDA-LP-09`, `EDA-LP-11`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-150`, `unit202::ACQ-165`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::heating-boiler-controls-application-category-function::EXACT_FACT` -- **VERIFIED**
- `ER::provisional::unit202::electronic-devices-and-applications::heating-thermistor-sensing-role::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-VISHAY-NTCASCW78A-IMMERSION-SENSOR: Heating and boiler control is an established application category for electronic devices: an NTC thermistor im...
- SRC-VISHAY-AN29053-NTC-THERMISTORS: Central-heating systems are named as one of the domestic-appliance categories in which NTC temperature sensors...
- SRC-LITTELFUSE-TECCOR-AN1003-PHASE-CONTROL: Heat control is one of the three application categories served by the same thyristor phase-control circuit fam...
- SRC-VISHAY-NTCASCW78A-IMMERSION-SENSOR: The function of heating control at this level is to sense the temperature of the medium and switch or proporti...
- SRC-VISHAY-AN29053-NTC-THERMISTORS: An NTC thermistor is a temperature-sensing element whose electrical resistance has a NEGATIVE relationship wit...
- SRC-VISHAY-AN29053-NTC-THERMISTORS: The sensing role rests on that steep characteristic: the relatively large negative slope means that even small...
- SRC-VISHAY-NTCASCW78A-IMMERSION-SENSOR: In heating applications specifically, the thermistor's role is to acquire the temperature of the medium: an im...
- SRC-LITTELFUSE-TECCOR-AN1003-PHASE-CONTROL: In a thyristor heating-control circuit the thermistor appears as the temperature-sensing resistance in the tri...

**Depth justification:** Function and sensing role are combined because the thermistor's role IS the sensing half of the function -- the application cannot be described without saying what senses the temperature. The exact switching topology is deliberately held out (EDA-LP-21) for the same reason as in the dimmer: an unevidenced exact circuit should not block evidenced conceptual content. The NTC type qualification is carried explicitly per this batch's guardrail.

**Explicit exclusions:**
- The exact transistor/relay switching topology (see EDA-LP-21, which is held)
- UK domestic heating control architecture -- programmers, room and cylinder thermostats, boiler interlock, TRVs -- which is a heating-systems topic and was NOT evidenced here
- Gas boiler internal control and ignition sequences
- Control theory: proportional, hysteresis and PID behaviour
- Building Regulations heating-control compliance requirements

**Representative application types:**
- State the two things an electronic heating control must do.
- Explain the role of the thermistor in a heating control.
- Explain why an NTC thermistor is well suited to temperature sensing.

---

### `EDA-LP-21` -- Heating: exact transistor/relay switching topology [RETIRED_OUT_OF_SCOPE]

**Evidence readiness:** RETIRED_OUT_OF_SCOPE

**Evidence readiness note (Stage 5 exemplar decision 2):** Retired rather than left held. The exact heating transistor/relay topology is never canonical technical truth for this qualification: the frozen requirement names no figure, circuit or source document, so there is no determinate topology to verify. The only authoritative topology retrieved is a manufacturer's GENERIC discrete relay driver (bipolar transistor, two bias resistors, free-wheeling diode), and that source itself scopes it to INDUSTRIAL AND AUTOMOTIVE applications with the relay driven by a microprocessor -- never to heating. The authoritative HEATING circuits that WERE located are THYRISTOR-switched, not relay-switched, so the generic relay evidence does not even concern the right device family. This is a scope decision, not an unresolved technical-evidence gap. The conceptual heating-control content (function, thermistor sensing role) remains fully evidenced and READY under EDA-LP-20.

**Learner outcome:** (retired -- not taught as canonical mastery)

**Knowledge / procedure:** RETIRED_OUT_OF_SCOPE. No exact heating transistor/relay topology is, or ever will be, taught as canonical mastery for this qualification. See the evidence readiness note. A generic discrete relay-driver topology is evidenced (a bipolar transistor, two bias resistors and a free-wheeling diode), but its source scopes it explicitly to industrial and automotive applications, never to heating, and the authoritative heating circuits actually found use a different device family (thyristors).

**Within-domain prerequisites:** `EDA-LP-20`, `EDA-LP-10`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-166`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::heating-exact-transistor-relay-topology::EXACT_FACT` -- **PARTIALLY_VERIFIED**

**Normalized claim references:**
- SRC-ONSEMI-AND8116D-RELAY-DRIVERS: The traditional and most popular discrete relay-driver topology, as stated by an established semiconductor man...
- SRC-ONSEMI-AND8116D-RELAY-DRIVERS: SCOPE LIMITATION, stated by the source itself: this topology is presented for INDUSTRIAL AND AUTOMOTIVE applic...

**Depth justification:** Isolated from EDA-LP-20 so that the unevidenced exact topology does not block the evidenced heating-control content, exactly as EDA-LP-19 is isolated from EDA-LP-18.

**Explicit exclusions:**
- Any specific circuit topology as taught content, pending Product Architect adjudication
- Relay-driver design, flyback protection sizing and transistor selection
- Mains switching construction or wiring instruction

**Representative application types:**
- (Held pending adjudication -- no application types are proposed while the intended circuit is unidentified.)

---

### `EDA-LP-22` -- Motor control: function and controlled electronic switching

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain what electronic motor control does and how phase-controlled switching regulates motor speed.

**Knowledge / procedure:** FUNCTION: motor control is a named application category for electronic power-control devices, appearing alongside light dimming and heat control as one of the three applications served by the same thyristor phase-control circuit family. Its function at this level is to REGULATE THE POWER delivered to the motor and thereby its SPEED. HOW THE SWITCHING WORKS: an electronic switching device -- a TRIAC for full-wave AC control, or an SCR for half-wave control -- is held in the off condition, blocking all current except a minute leakage, until it is triggered into conduction within each half-cycle. Because the device can be triggered earlier or later within the half-cycle, the output power, and therefore the motor speed, is controlled by the PHASE DELAY of the drive. A half-wave phase-control circuit using an SCR is used for controlling a universal motor, the RC network's phase-shifting characteristics permitting firing beyond the peak of the applied voltage to give small conduction angles. QUALIFICATION [Correction, Stage 5 hard factual correction]: a universal motor is an INDUCTIVE load, so its current LAGS its voltage. Both the SCR and the TRIAC turn off when current falls below the holding current, not simply when the applied voltage reaches zero (see EDA-LP-11, EDA-LP-12); for this inductive load, the current's own zero crossing does not coincide with the voltage's zero crossing, so turn-off happens at a different point in the cycle than it would for a resistive load -- which is why motor control is more demanding of the device than the resistive-load dimmer case.

**Within-domain prerequisites:** `EDA-LP-11`, `EDA-LP-12`, `EDA-LP-18`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-151`, `unit202::ACQ-167`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::motor-control-application-category-function::EXACT_FACT` -- **VERIFIED**
- `ER::provisional::unit202::electronic-devices-and-applications::motor-controlled-electronic-switching-at-general-level-2-depth::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-ST-AN392-MCU-TRIAC-MAINS: Motor control is a named application category for electronic power-control devices, appearing alongside light ...
- SRC-ST-AN392-MCU-TRIAC-MAINS: The function of electronic motor control at this level is to regulate the power delivered to the motor and the...
- SRC-LITTELFUSE-TECCOR-AN1003-PHASE-CONTROL: The sources present distinct motor-control circuits for distinct motor types: a universal motor drive and a ha...
- SRC-LITTELFUSE-TECCOR-AN1003-PHASE-CONTROL: Motor control by electronic switching works by holding an electronic switching device (a triac for full-wave A...
- SRC-ST-AN392-MCU-TRIAC-MAINS: Because the switching device is triggered later or earlier within the half-cycle, the output power and therefo...
- SRC-LITTELFUSE-TECCOR-AN1003-PHASE-CONTROL: A half-wave phase control circuit using an SCR is given for controlling a universal motor, in which the RC net...
- SRC-ST-AN392-MCU-TRIAC-MAINS: Qualification preserved: a universal motor is an INDUCTIVE load which generates strong dynamic constraints on ...

**Depth justification:** The application category and its switching mechanism are combined because the function IS the switching -- describing motor control without saying how the power is regulated would leave the point empty. Prerequisite on the dimmer (EDA-LP-18) because phase control is taught there first and this point applies the same mechanism to a different, harder load; that ordering avoids teaching phase control twice.

**Explicit exclusions:**
- PWM, variable-frequency drives and field-oriented control -- explicitly beyond this level and NOT evidenced here
- Motor starting, stopping, reversing and protection functions -- NOT covered by the retrieved evidence
- Three-phase induction motor control and BS EN 60947 motor starters
- Snubber, dV/dt and commutation design
- Motor construction and characteristics

**Representative application types:**
- State what electronic motor control regulates.
- Explain how delaying the trigger point reduces motor speed.
- State which device is used for full-wave AC control and which for half-wave.
- Explain why controlling a motor is more demanding on the switching device than dimming a lamp.

---

### `EDA-LP-23` -- Motor drives: the bridge rectifier converting AC to DC

**Evidence readiness:** READY

**Evidence readiness note:** [Correction, Stage 1.1/5.7] Previously held on disclosed compounding across three passages in two manufacturer documents. Corrected: multi-source composition is valid verification, never a partial result. Now fully VERIFIED.

**Learner outcome:** The learner will be able to explain why a bridge rectifier is used in a DC motor drive and how it is connected.

**Knowledge / procedure:** The function of rectification is to convert alternating current to direct current. A FULL-WAVE BRIDGE is one of the three basic single-phase rectifier circuits, using FOUR diodes in a bridge arrangement so that both the positive and the negative swings of the supply have a forward path through the bridge. IN THE MOTOR APPLICATION: a permanent-magnet DC motor requires full-wave DC, so the AC-side controller is connected in series with the AC INPUT side of the rectifier bridge, with the bridge's DC output feeding the motor. This allows an AC-side phase-control device to regulate a DC motor.

**Within-domain prerequisites:** `EDA-LP-14`, `EDA-LP-22`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-168`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::motor-bridge-rectifier-converts-ac-to-dc::EXACT_FACT` -- **PARTIALLY_VERIFIED**

**Normalized claim references:**
- SRC-ONSEMI-HB214D-RECTIFIER-HANDBOOK: The function of rectification is to convert alternating current to direct current....
- SRC-ONSEMI-HB214D-RECTIFIER-HANDBOOK: The full-wave bridge is one of the three basic single-phase rectifier circuits (alongside half-wave and full-w...
- SRC-GSU-HYPERPHYSICS-BRIDGE-RECTIFIER: A bridge rectifier makes use of four diodes in a bridge arrangement to achieve full-wave rectification; for bo...
- SRC-LITTELFUSE-TECCOR-AN1003-PHASE-CONTROL: In the motor application specifically, a permanent-magnet DC motor normally requires full-wave DC rectificatio...

**Depth justification:** Kept as its own point rather than folded into EDA-LP-22 because it concerns a different motor type (a DC motor rather than the AC universal motor) and a different circuit element (the rectifier rather than the phase-control switch). Folding them together would blur the AC-motor and DC-motor cases, which is a genuine source of confusion.

**Explicit exclusions:**
- Smoothing and ripple in the DC link
- Regenerative braking and four-quadrant operation
- Diode ratings, peak inverse voltage and thermal design
- Brushless DC and electronically commutated motors

**Representative application types:**
- State what the bridge rectifier does in a DC motor drive.
- State how many diodes a bridge rectifier contains.
- Explain where the AC-side controller is connected relative to the bridge.

---

### `EDA-LP-24` -- Security alarms: application category and function

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain what an intruder alarm system does and describe the main types found in UK domestic practice.

**Knowledge / procedure:** An alarm system is a device whose main function is to INDICATE AN ALERT to a system or to a person at a distant location when a problem or specific situation occurs. In UK domestic security practice, burglar (intruder) alarms come in three types: MONITORED, where once triggered an alarm company or designated key holder checks whether it is a false alarm; UNMONITORED, which once activated simply sounds an audible alarm locally; and types combining features of both. UK police will typically respond to an alarm if requested by a monitoring company, but are less likely to respond to an unmonitored alarm. Visible audible alarm boxes should be mounted high at front and rear to resist tampering. The British/European standard series governing intrusion and hold-up alarm systems is BS EN 50131, whose parts separately cover general requirements, magnetic opening contacts, and control and indicating equipment among others. JURISDICTION: this is UK practice and UK police guidance.

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-147`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::security-alarms-application-category-function::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-SBD-POLICE-HANDBOOK: In UK domestic security practice, burglar (intruder) alarms come in three types: monitored, where once trigger...
- SRC-SBD-POLICE-HANDBOOK: UK police will typically respond to a burglar alarm if requested to do so by a monitoring company but are less...
- SRC-OFCOM-IR2030: In UK spectrum regulation, an alarm system is defined as a device whose main functionality is indicating an al...
- SRC-BSI-EN50131-SERIES: The British/European standard series governing intrusion and hold-up alarm systems is BS EN 50131, whose parts...

**Depth justification:** Deliberately kept separate from the alarm CIRCUIT requirements (EDA-LP-25). The distinction matters: a source describing what alarms are for genuinely satisfies this application-category requirement but says nothing whatever about loop topology, SCR latching or transistor switching. Keeping them apart means the well-evidenced application content is deliverable while the circuit content is held.

**Explicit exclusions:**
- The internal circuit of any specific alarm (see EDA-LP-25, which is held)
- BS EN 50131 grading, alarm confirmation and police response policy in detail
- System design, zoning, detector siting and commissioning
- Detector technologies (PIR, magnetic contact, vibration) as a topic

**Representative application types:**
- State the main function of an intruder alarm system.
- Explain the difference between a monitored and an unmonitored alarm.
- Name the standard series covering intruder alarm systems.

---

### `EDA-LP-25` -- Security alarm application: transferable component roles (NC detection, transistor switching, SCR latching) [TRANSFORMED_TO_EXEMPLAR]

**Evidence readiness:** READY

**Outstanding production dependency:** REPRESENTATIVE_EXEMPLAR_AUTHORING (a validated worked alarm circuit, not a technical-evidence gap)

**Evidence readiness note (Stage 5 exemplar decision 3):** Transformed rather than left held. The exact NC-loop/bias topology of a specific security alarm circuit is never canonical technical truth for this qualification (the frozen requirement names no circuit, figure or source document, and the generic pattern found appears only on vendor blogs/installer marketing/DIY sites, all outside permitted authority classes) and is retired from canonical mastery. The TRANSFERABLE roles -- transistor switching and SCR latching -- ARE fully and genuinely evidenced as general device behaviour and are retained as READY technical content. The claim that an SCR specifically "keeps a sounder energised" is NOT evidenced by any retrieved source and is dropped. A representative, validated worked alarm circuit remains an outstanding REPRESENTATIVE_EXEMPLAR_AUTHORING dependency for downstream lesson production -- this may block final lesson production without making the underlying transferable-role technical facts unsupported.

**Learner outcome:** The learner will be able to explain the transistor's cutoff/saturation switching role and the SCR's latching behaviour as transferable building blocks that a security-alarm detection circuit can use, without reference to any one specific, unnamed circuit.

**Knowledge / procedure:** TRANSFERABLE ROLES (retained as technical truth, general device behaviour): a bipolar transistor used as a switch operates as a NON-LINEAR switch alternating between the CUTOFF region (an open switch, both junctions reverse biased) and the SATURATION region (a closed switch) -- this is the switching role a transistor can play in a normally-closed detection loop. An SCR LATCHES -- once a momentary gate pulse has triggered it and the anode current exceeds the latching current, it remains conducting even after the trigger is removed, until the current falls below the holding current -- this latching property is why an SCR is a plausible building block for maintaining an alarm condition once triggered. NOT TAUGHT (retired/outstanding): no exact normally-closed loop, bias topology, or SCR-to-sounder connection is taught as canonical mastery -- no governed public exemplar circuit exists in the evidence, and the widely-repeated vendor/installer pattern is excluded as out-of-class. Authoring a validated representative exemplar circuit is a downstream production task, not a technical-evidence gap.

**Within-domain prerequisites:** `EDA-LP-24`, `EDA-LP-10`, `EDA-LP-11`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-155`, `unit202::ACQ-153`, `unit202::ACQ-154`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::security-alarm-exact-nc-contact-bias-topology::EXACT_FACT` -- **RETIRED_OUT_OF_SCOPE**
- `ER::provisional::unit202::electronic-devices-and-applications::security-alarm-scr-thyristor-latching-sounder-role::EXACT_FACT` -- **PARTIALLY_VERIFIED** (latching itself is fully evidenced; the sounder-energising claim is dropped as unevidenced)
- `ER::provisional::unit202::electronic-devices-and-applications::security-alarm-transistor-switching::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-LITTELFUSE-THYRISTOR-APPNOTES: An SCR (silicon controlled rectifier) latches: once a momentary gate pulse has triggered it and the anode-to-c...
- SRC-LITTELFUSE-THYRISTOR-APPNOTES: Holding current (IH) is defined by the manufacturer as the minimum principal current required to maintain the ...
- SRC-OSU-ECE322-BJT: A bipolar junction transistor used as a switch operates as a non-linear switch, alternating between the cutoff...

**Depth justification:** The three circuit-level alarm requirements were originally combined into one held learning point because all three presuppose the SAME unidentified circuit. Stage 5 resolves that shared dependency by disposition rather than leaving it held indefinitely: the transferable device-level roles are separated out and retained as READY technical content, independent of which exact circuit a downstream author eventually validates as the representative exemplar. Kept separate from EDA-LP-24 so the application-category content remains independently deliverable.

**Explicit exclusions:**
- Any specific alarm circuit topology as canonical taught content -- retired out of scope (Stage 5 exemplar decision 3); authoring one is a downstream REPRESENTATIVE_EXEMPLAR_AUTHORING production task, not technical evidence
- The sounder role within an alarm circuit -- NOT evidenced by any retrieved source; not claimed
- End-of-line resistor supervision and tamper-loop design
- Alarm panel programming and installation practice

**Representative application types:**
- Identify whether a transistor is in cutoff or saturation given a described bias condition.
- Explain why an SCR, once triggered, continues conducting even after the triggering signal is removed.
- Explain in general terms why a normally-closed loop and a latching device are useful building blocks for a security-alarm detection circuit (without reference to any one specific circuit).

---

### `EDA-LP-26` -- The legacy UK analogue PSTN and what a telephone service is

**Evidence readiness:** HELD_PENDING_EVIDENCE_CORRECTION

**Evidence readiness note:** The legacy-PSTN framing requirement is fully VERIFIED from Ofcom and Openreach sources. The telephones-application-category requirement is PARTIALLY_VERIFIED: the UK regulatory definition of the telephone SERVICE and the network's role at the termination point are well evidenced, but no retrieved source gives a device-level definition of a telephone (Encyclopaedia Britannica returned 403 throughout, and legislation.gov.uk defines the service rather than the device).

**Learner outcome:** The learner will be able to explain what the legacy PSTN is, describe its current status in the UK, and state what the telephone service provides.

**Knowledge / procedure:** The PUBLIC SWITCHED TELEPHONE NETWORK (PSTN) is the traditional UK telephone network. Ofcom describes providers still offering it as "providers of legacy PSTN services". THE NETWORK IS BEING RETIRED: BT plans to retire its PSTN by 31 JANUARY 2027, because the technology is beyond its intended lifespan and is becoming increasingly unreliable; landlines are moving to digital technology ("digital landlines"). Businesses use the PSTN to support non-voice devices such as alarms, telemetry and monitoring equipment, some of which may need reconfiguring or replacing. THE LINE: Openreach specifies the technical characteristics of a single ANALOGUE line interface of the PSTN, commonly known as a DIRECT EXCHANGE LINE (DEL), delivered to the customer at the NETWORK TERMINATION POINT (NTP). The telephone is the terminal connected at that point, and the network provides it with call arrival indication (ringing) when on-hook. IN UK LAW a "publicly available telephone service" is a service available to the public for originating and receiving national and international calls and access to emergency services through numbers in a national numbering plan. JURISDICTION AND ERA: all of this is UK-specific and describes the LEGACY ANALOGUE PSTN. None of it may be generalised to VoIP, to digital voice, or to telephone systems in other countries.

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-160`, `unit202::ACQ-148`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::telephone-legacy-pstn-framing::EXACT_FACT` -- **VERIFIED**
- `ER::provisional::unit202::electronic-devices-and-applications::telephones-application-category-function::EXACT_FACT` -- **PARTIALLY_VERIFIED**

**Normalized claim references:**
- SRC-OFCOM-PSTN-LETTER-2026: The public switched telephone network (PSTN) is the traditional UK telephone network; Ofcom describes provider...
- SRC-OFCOM-PSTN-LETTER-2026: BT is planning to retire its public switched telephone network (PSTN) by 31 January 2027; Ofcom states this tr...
- SRC-OFCOM-LANDLINE-CONSUMER: Ofcom states that the traditional telephone network, known as the public switched telephone network (PSTN), is...
- SRC-OPENREACH-SIN351: Openreach specifies the technical characteristics of a single ANALOGUE line interface of the PSTN, commonly kn...
- SRC-OFCOM-PSTN-LETTER-2026: Ofcom records that businesses use the PSTN to support non-voice devices such as alarms, telemetry and monitori...
- SRC-UKSI-2003-1904-USO: In UK law, a 'publicly available telephone service' is a service available to the public for originating and r...
- SRC-UKSI-2003-1904-USO: UK universal service obligations require designated providers to meet reasonable requests for connection at a ...
- SRC-OPENREACH-SIN351: On the UK legacy analogue PSTN, the telephone is the terminal connected at the Network Termination Point of a ...

**Depth justification:** The framing and the application/function requirements are combined because at this level "what a telephone service is" and "what the legacy PSTN is" are answered by the same regulatory and network description; separating them would split one account across two points. The jurisdiction and era qualifications are carried as prominent knowledge content, per this batch's guardrail, because the whole topic is time-limited and country-specific.

**Explicit exclusions:**
- VoIP, digital voice and SIP as topics in their own right
- PSTN internal architecture (exchanges, local loop, circuit switching) -- NOT evidenced by any retrieved source
- Telephone handset internals, dialling and speech circuits
- Non-UK telephone practice, including US RJ11 wiring conventions

**Representative application types:**
- State what the letters PSTN stand for and what the network is.
- State the date by which BT plans to retire the PSTN.
- Explain why legacy PSTN wiring details must not be applied to a digital voice service.

---

### `EDA-LP-27` -- The UK master socket and extension sockets

**Evidence readiness:** HELD_PENDING_EVIDENCE_CORRECTION

**Evidence readiness note:** Underlying evidence is PARTIALLY_VERIFIED on TERMINOLOGY and BREADTH. The master socket is very well evidenced from Openreach SIN 351, including the full contact table, the IDC map and the cable specification. However: (1) TERMINOLOGY MISMATCH -- the frozen requirement says "secondary socket", but Openreach only ever uses the term "extension socket"; a reviewer must adjudicate whether these are intended as the same thing. (2) NO retrieved source describes the INTERNALS of a secondary/extension socket, so only the master socket is genuinely evidenced at component level.

**Learner outcome:** The learner will be able to describe the UK master socket arrangement, state where the customer boundary lies, and explain the contact and IDC numbering hazard.

**Knowledge / procedure:** THE INTERFACE: the Openreach network interface consists of two conductors, the "A" and "B" wires. Customer access is via an Openreach MASTER SOCKET or an insulation displacement connection. Openreach fits the master socket -- the Network Terminating Equipment (NTE) -- which REMAINS OPENREACH PROPERTY. The customer connection point is at the back of the REMOVABLE FRONT PLATE of the master NTE5, and extension sockets are wired from there. RESPONSIBILITY BOUNDARY: internal wiring beyond the master socket is normally the customer's responsibility. MASTER SOCKET CONTACTS: 1 = not used for PSTN; 2 = "A" or "B" wire; 3 = local earth when required; 4 = shunt connection when required; 5 = "B" or "A" wire; 6 = not used for PSTN. EXTENSION WIRING IDCs USE DIFFERENT NUMBERING: IDC 2 = "A" or "B" wire; IDC 3 = shunt connection (the "Bell wire"); IDC 4 = local earth when required. IMPORTANT HAZARD: the SAME shunt/bell connection is IDC 3 on the extension wiring but CONTACT 4 on the master socket. Any statement that simply refers to "pin 3" without saying which numbering scheme is meant will be wrong for one of them. EXTENSION CABLE: telephone/data-grade solid copper, 0.5 to 0.63 mm diameter, in twisted-pair format. JURISDICTION AND ERA: UK legacy analogue PSTN only.

**Within-domain prerequisites:** `EDA-LP-26`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-159`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::telephone-master-secondary-socket-details::EXACT_FACT` -- **PARTIALLY_VERIFIED**

**Normalized claim references:**
- SRC-OPENREACH-SIN351: In the UK legacy analogue PSTN the Openreach network interface consists of two conductors, the 'A' and 'B' wir...
- SRC-OPENREACH-SIN351: Openreach master socket contact assignment (SIN 351 Table 1): 1 = not used for PSTN; 2 = 'A' wire or 'B' wire;...
- SRC-OPENREACH-SIN351: Internal extension wiring is terminated on IDCs inside the Openreach PSTN NTE with a DIFFERENT numbering from ...
- SRC-OPENREACH-COPPER-HANDBOOK: Openreach fits the master socket (Network Terminating Equipment, NTE), which remains Openreach property; the c...
- SRC-OPENREACH-COPPER-HANDBOOK: Internal wiring beyond the Openreach master socket is normally the responsibility of the customer/developer; e...

**Depth justification:** Its own point because it is a distinct practical/installation mastery rather than a conceptual one, and because the contact-versus-IDC numbering hazard is a specific, high-consequence, diagnosable error that deserves to be taught deliberately rather than buried inside a broader telephony point.

**Explicit exclusions:**
- Wiring or installation instruction for work on the Openreach side of the boundary
- Master socket internal components (see EDA-LP-28)
- Modern NTE5C/filtered faceplate and broadband splitter variants beyond what was retrieved
- Non-UK socket types including RJ11

**Representative application types:**
- State who owns the master socket in a UK property.
- State where the customer's responsibility for telephone wiring begins.
- Explain why "pin 3" is an ambiguous instruction in UK telephone wiring.

---

### `EDA-LP-28` -- Inside the UK master socket: ringer capacitor, line-test resistor and surge protector

**Evidence readiness:** HELD_PENDING_EVIDENCE_CORRECTION

**Evidence readiness note:** Two of the three underlying requirements are PARTIALLY_VERIFIED, and the shortfall is specifically about FUNCTION rather than presence. Openreach SIN 351 authoritatively establishes that the 1.8 uF capacitor, the 470 kohm resistor and the over-voltage protection device are present, their values, and how they are connected. It does NOT state that the capacitor blocks DC and passes AC ringing current to the ringer, nor that the resistor serves line testing -- both are widely repeated attributions that no retrieved authoritative source confirms, and both have therefore been excluded from the taught content rather than assumed. A further CURRENCY CONFLICT is recorded and not harmonised: many excluded sources claim sockets have omitted the surge arrester since around 2012, whereas the current Openreach SIN still specifies one as present.

**Learner outcome:** The learner will be able to identify the components inside a UK master socket and state what is authoritatively known about each.

**Knowledge / procedure:** Openreach specifies that the master socket contains, connected ACROSS the "A" and "B" wires: a 1.8 MICROFARAD CAPACITOR in series with a 470 KILOHM RESISTOR, with the socket's SHUNT CONNECTION taken from the CENTRE POINT between the two; and, separately, an OVER-VOLTAGE PROTECTION DEVICE connected across the "A" and "B" wires. THE SHUNT CONNECTION is designated by Openreach as the "BELL WIRE" where presented for internal extension wiring, appearing on extension IDC 3 and master socket contact 4. RINGING: the UK call arrival indication is an alternating signal between 100 V and 40 V a.c. r.m.s. between the "A" and "B" wires, at 25 Hz (+1 / -5 Hz). LINE TESTING: Openreach has for many years run automatic test routines on its local line plant, now approaching once every 24 hours, applying up to 50 V battery with a source resistance between 0 and 120 kilohms. SURGE PROTECTION: the analogue line is subject to noise, induced voltages and line surges, which is what the over-voltage protection device guards against. IMPORTANT LIMIT ON WHAT IS KNOWN: Openreach documents that these components are PRESENT and how they are CONNECTED, but no retrieved authoritative source states the FUNCTION of the capacitor as passing ringing current to the ringer, nor the function of the 470 kilohm resistor as a line-test resistor. Those functional attributions are widely repeated but were NOT authoritatively evidenced and must not be taught as established. JURISDICTION AND ERA: UK legacy analogue PSTN only.

**Within-domain prerequisites:** `EDA-LP-27`, `EDA-LP-03`, `EDA-LP-01`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-156`, `unit202::ACQ-157`, `unit202::ACQ-158`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::telephone-capacitor-ringer::EXACT_FACT` -- **PARTIALLY_VERIFIED**
- `ER::provisional::unit202::electronic-devices-and-applications::telephone-resistor-line-testing::EXACT_FACT` -- **PARTIALLY_VERIFIED**
- `ER::provisional::unit202::electronic-devices-and-applications::telephone-surge-protector::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-OPENREACH-SIN351: In the UK legacy analogue PSTN, the Openreach master socket contains a 1.8 microfarad capacitor connected in s...
- SRC-OPENREACH-SIN351: Openreach designates that same shunt connection as the 'Bell wire' where it is presented for internal extensio...
- SRC-OPENREACH-SIN351: The UK PSTN call arrival indication (ringing) is an alternating signal of between 100 V and 40 V a.c. r.m.s. m...
- SRC-OPENREACH-SIN351: A 470 kilohm resistor is present inside the UK Openreach master socket, connected in series with a 1.8 microfa...
- SRC-OPENREACH-SIN351: Openreach has for many years carried out automatic test routines on its local line plant, and the frequency of...
- SRC-OPENREACH-SIN351: Openreach line test conditions may apply up to 50 V battery (positive and negative with respect to earth) with...
- SRC-OPENREACH-SIN351: In the UK Openreach master socket for the legacy analogue PSTN, in addition to the 470 kilohm resistor and 1.8...
- SRC-OPENREACH-SIN351: Openreach documents that the analogue line is subject to noise, induced voltages and line surges: permanent lo...

**Depth justification:** The three master-socket component requirements are combined because they describe three parts of ONE socket, specified together in one clause of one Openreach document, and because they share exactly the same evidential situation -- presence and connection well evidenced, function much less so. Teaching them together makes that shared limitation statable once and clearly.

**Explicit exclusions:**
- The FUNCTION of the capacitor as a ringer-coupling component and of the resistor as a line-test component -- widely repeated but NOT authoritatively evidenced here
- The physical technology of the surge protector (gas discharge tube, 3-electrode arrester), its rating, and legacy 11A/26A arrester designations -- NOT evidenced
- Any work on or modification of the Openreach-owned master socket
- Non-UK telephone socket components

**Representative application types:**
- State the components Openreach specifies inside the UK master socket.
- State the value of the capacitor and of the resistor in the master socket.
- Explain what the "bell wire" refers to and where it appears.

---

### `EDA-LP-29` -- Wireless control systems: function and practical advantages

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain what a wireless control system is and state its practical advantages over wired control.

**Knowledge / procedure:** WHAT IT IS: wireless networked control systems are composed of spatially distributed SENSORS, ACTUATORS AND CONTROLLERS that communicate through WIRELESS NETWORKS instead of conventional point-to-point wired connections. They are used as an infrastructure technology for control systems in automotive electrical systems, avionics, building automation and similar fields. In UK spectrum regulation, telemetry and telecommand short-range devices are used "for the control of remote equipment or transmission of data from that equipment", and Ofcom lists wireless control systems among the typical uses of licence-exempt short-range devices. PRACTICAL ADVANTAGES: they replace conventional point-to-point wired connections; they REDUCE DEPLOYMENT AND MAINTENANCE COSTS; they offer LARGE FLEXIBILITY; they are EASY TO INSTALL AND MAINTAIN; and they possibly ENHANCE SAFETY. Applied to buildings specifically, wireless building automation provides significant savings in installation cost, which allows a large RETROFIT market to be addressed as well as new construction.

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-152`, `unit202::ACQ-169`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electronic-devices-and-applications::wireless-control-systems-application-category-function::EXACT_FACT` -- **VERIFIED**
- `ER::provisional::unit202::electronic-devices-and-applications::wireless-practical-advantages-applications::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-WNCS-SURVEY: Wireless networked control systems are composed of spatially distributed sensors, actuators and controllers co...
- SRC-OFCOM-IR2030: In UK spectrum regulation, industrial/commercial telemetry and telecommand short range devices are 'used for t...
- SRC-WNCS-SURVEY: The practical advantages of wireless control systems, as stated in an academic survey of wireless networked co...
- SRC-WNCS-SURVEY: Applied to buildings specifically, wireless network based building automation provides significant savings in ...

**Depth justification:** Function and advantages are combined because the advantages ARE the reason the application category exists -- describing wireless control without saying why anyone uses it in preference to wiring would leave the point without purpose. Treatment is kept strictly at practical-application level, per this batch's guardrail.

**Explicit exclusions:**
- Radio engineering: modulation, propagation, antenna and link-budget design
- Specific protocols (Zigbee, Z-Wave, Bluetooth, Thread) and their comparison
- Spectrum licensing and compliance requirements in detail
- Wireless security, encryption and interference mitigation
- Battery life and power budgeting for wireless nodes

**Representative application types:**
- State what a wireless control system replaces.
- Give three practical advantages of wireless control over wired control.
- Explain why wireless control is particularly attractive when upgrading an existing building.

---
