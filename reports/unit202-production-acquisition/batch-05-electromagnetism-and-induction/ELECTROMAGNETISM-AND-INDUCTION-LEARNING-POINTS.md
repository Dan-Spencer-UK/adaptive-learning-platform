# Batch 05 -- Electromagnetism and Induction: Proposed Learning Points

**Status:** `PROPOSED_FOR_PA_REVIEW` -- none of these learning points is accepted, frozen or identity-locked.

Curriculum-review artifact, not finished lesson prose. Sequenced pedagogically (see instructionalSequence), not alphabetically or by numeric identity. Every learning point traces to at least one evidence-requirement claim in EVIDENCE-RESULTS.json. No EMI-LP-* learning point in this file is accepted, frozen, or identity-locked -- all 22 are proposals for Product Architect review. Learning points whose underlying evidence is PARTIALLY_VERIFIED or SOURCE_GAP carry evidenceReadiness HELD_PENDING_EVIDENCE_CORRECTION together with an evidenceReadinessNote saying exactly what is missing; none is marked READY on evidence that does not support it.

**Readiness:** 20 READY, 1 HELD_PENDING_EVIDENCE_CORRECTION, 1 DEFERRED_CONTEXT_ONLY. **Curriculum role:** 20 REQUIRED_MASTERY, 2 CONTEXTUAL_SUPPORT_ONLY.

## Instructional sequence

1. `EMI-LP-01` -- Magnetic poles, and attraction and repulsion between them
2. `EMI-LP-02` -- Recognising magnetic field patterns
3. `EMI-LP-03` -- The dot-and-cross page convention for field and current direction
4. `EMI-LP-04` -- The magnetic field around a current-carrying conductor
5. `EMI-LP-05` -- The right-hand grip rule for a current-carrying conductor
6. `EMI-LP-06` -- The solenoid: its magnetic field and how to find its polarity
7. `EMI-LP-07` -- The electromagnet
8. `EMI-LP-08` -- Relays and contactors: electromagnetically operated switches
9. `EMI-LP-09` -- Magnetic flux: meaning, symbol and unit
10. `EMI-LP-10` -- Magnetic flux density: meaning, symbol and unit
11. `EMI-LP-11` -- Using B = flux/area, including rearrangement
12. `EMI-LP-12` -- The motor effect and the force on a current-carrying conductor
13. `EMI-LP-13` -- Fleming's left-hand (motor) rule
14. `EMI-LP-14` -- Electromagnetic induction: motion, flux cutting, and when EMF is greatest or zero
15. `EMI-LP-15` -- Using e = Blv for a moving conductor
16. `EMI-LP-16` -- Fleming's right-hand (generator) rule
17. `EMI-LP-17` -- The simple AC generator: parts and how they work together
18. `EMI-LP-18` -- Alternating output: the sine wave, the cycle, periodic time and frequency
19. `EMI-LP-19` -- AC magnitude: peak (amplitude) and peak-to-peak values
20. `EMI-LP-20` -- RMS and average values of a sine wave, and what each one means
21. `EMI-LP-21` -- Carrying out sine-wave conversion calculations
22. `EMI-LP-22` -- Generated frequency, pole pairs and rotational speed

---

### `EMI-LP-01` -- Magnetic poles, and attraction and repulsion between them

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to identify the north and south poles on a diagram of a magnet, and state whether a given pair of poles will attract or repel.

**Knowledge / procedure:** A magnet has two poles, a north (N) pole and a south (S) pole. On a diagram the poles are identified by their labelling together with the magnetic lines of force drawn leaving one pole and entering the other. LIKE poles repel each other (N with N, or S with S); OPPOSITE poles attract (N with S). In an iron-filing figure, a pair of opposite poles attracting is recognised from the filing pattern running between the two poles, showing the magnetic force bridging them.

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-124`, `unit202::ACQ-102`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::magnetic-poles::SCHEMATIC_OR_DIAGRAM_RECOGNITION` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::magnetic-attraction-repulsion::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-USF-ETC-MAGPOLES-20143: Magnetic poles are recognised in a diagram from the bar magnet's outline together with the influence of its po...
- SRC-USF-ETC-ATTRACTPOLES-20144: A pair of OPPOSITE poles attracting is recognised from the iron-filing pattern running between the two poles, ...
- SRC-USF-ETC-MAGFIELD-POLES-35728: North and south poles are identified on a diagram by their labelling together with the magnetic lines of force...
- SRC-MIT802-CH8-MAGFIELDS: When two bar magnets are held close to each other, like poles (N with N, or S with S) repel each other and opp...
- SRC-OPENSTAX-UP2-11-1: Magnetic poles repel if they are alike (both N or both S) and attract if they are opposite (one N and the othe...

**Depth justification:** Recognising poles and knowing the attract/repel rule are a single indivisible mastery at this level -- a learner who can label N and S but cannot say what happens when two N poles meet has not learned anything usable, and the two are always taught and assessed together. Kept deliberately separate from field PATTERNS (EMI-LP-02), which is a different recognition skill about the shape of the field rather than the identity of the poles.

**Explicit exclusions:**
- Magnetic domain theory and why materials become magnetised
- The Earth's magnetic field and magnetic declination
- Calculating the force between two poles
- Ferromagnetic/paramagnetic/diamagnetic material classification

**Representative application types:**
- Given a labelled diagram of two bar magnets placed end to end, state whether they will attract or repel.
- Identify the north and south poles on a field-line diagram of a bar magnet.
- Explain why two magnets pushed together the wrong way round resist each other.

---

### `EMI-LP-02` -- Recognising magnetic field patterns (bar magnet and straight conductor)

**Evidence readiness:** READY

**Evidence readiness note (Stage 4 item 1/2 correction):** The vague, open-ended "magnetic field patterns" (plural, unenumerated) framing is replaced by an explicit, closed set of exactly three patterns this batch actually addresses: the bar magnet, the straight current-carrying conductor, and the solenoid/coil. This learning point's own DIAGRAM-RECOGNITION evidence genuinely covers only the first two (bar magnet, straight conductor); it is scoped to exactly those two and is fully READY on that explicit scope, not held pending a third pattern it never claimed. The third pattern (solenoid/coil) is not a gap: its field shape is already taught, with genuine VERIFIED evidence, as part of EMI-LP-06 (which additionally teaches solenoid polarity, so field-shape and polarity are learned together for the one case where they are one practical skill, per EMI-LP-06's own depth justification). No diagnostic value is lost by this split -- EMI-LP-02 and EMI-LP-06 remain independently assessable, and a learner can be tested on solenoid field recognition via EMI-LP-06's own application types.

**Learner outcome:** The learner will be able to recognise, from a diagram, the magnetic field pattern surrounding a straight current-carrying conductor and the field pattern of a bar magnet.

**Knowledge / procedure:** A magnetic field is drawn as lines of force. Around a STRAIGHT CONDUCTOR carrying a current the lines of force encircle the conductor. Around a BAR MAGNET the lines of force run between its north and south poles. Iron filings sprinkled near a magnet or a current-carrying conductor line up along these lines of force, which is how the patterns are made visible experimentally.

**Within-domain prerequisites:** `EMI-LP-01`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-103`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::magnetic-field-patterns::SCHEMATIC_OR_DIAGRAM_RECOGNITION` -- **VERIFIED**

**Normalized claim references:**
- SRC-USF-ETC-CONDUCTORFIELD-35665: The magnetic field pattern surrounding a straight conductor carrying an electric current is recognised from th...
- SRC-USF-ETC-MAGFIELD-POLES-35728: The magnetic field pattern of a bar magnet is recognised from the drawn lines of force running between, and id...

**Depth justification:** Field-pattern recognition is separated from pole identification (EMI-LP-01) because they are diagnosably different: a learner can label poles correctly and still not recognise that the field around a current-carrying wire is circular. It is also kept separate from the right-hand grip rule (EMI-LP-05), which is about the DIRECTION of that field rather than its shape -- shape is recognisable before direction is determinable.

**Explicit exclusions:**
- Determining the DIRECTION of the field (see EMI-LP-05 for the grip rule)
- Calculating field strength at a distance from a conductor
- Field patterns of arrangements not covered by retrieved evidence (e.g. two adjacent conductors, horseshoe magnets)
- Flux-line density as a quantitative measure

**Representative application types:**
- Given a diagram of a straight conductor carrying current, describe the shape of the magnetic field around it.
- Identify which of several diagrams correctly shows the field pattern of a bar magnet.

---

### `EMI-LP-03` -- The dot-and-cross page convention for field and current direction

**Evidence readiness:** DEFERRED_CONTEXT_ONLY

**Evidence readiness note (Stage A reversion, narrow correction pass):** A prior pass's `CC-BATCH05-PA-AUTHORITY-ADJUDICATION-001` field is REMOVED: unlike the genuine, code-enforced, fail-closed `UNIT202_SOURCE_AUTHORITY_POLICY` widening that legitimately covers Unit 202's three `OPERATIONAL_USE_RULE` hand-rule targets (the right-hand grip rule and the two Fleming rules, traced to real Product Architect review of CC-24 pilot-001), this field applied to a different, unauthorised mode (`SYMBOL_OR_CONVENTION`), had no code-level backing, and is directly contradicted by PROJECT-STATUS.md's own batch-05 entry ("No frozen requirement's permitted authority classes were widened to make a result green"). This requirement's genuinely frozen permitted classes (`PRIMARY_NORMATIVE_OR_STANDARDS_BODY`, `PROFESSIONAL_BODY`, `AUTHORITATIVE_TECHNICAL_REFERENCE`) are not met by MIT 8.02 or OpenStax (both `ACADEMIC_OR_RESEARCH_INSTITUTION`/`AUTHORITATIVE_EDUCATIONAL_REFERENCE`). A fresh bounded re-search (IEC Electropedia, IEEE Std 315-1975/ANSI Y32.2-1975) found no in-class source. Genuinely re-adjudicated as `SOURCE_GAP`; reclassified `DEFERRED_CONTEXT_ONLY` since this LP is `CONTEXTUAL_SUPPORT_ONLY`/`CONTEXT_ONLY_NOT_ASSESSED` and this is therefore a non-blocking V1 deferral, not a core release blocker. See `EVIDENCE-RESULTS.json`.

**Learner outcome:** The learner will be able to interpret the dot and cross symbols used on diagrams to show a field or current directed out of, or into, the page.

**Knowledge / procedure:** On a two-dimensional diagram a quantity pointing OUT of the page (towards the reader) is drawn as a DOT; a quantity pointing INTO the page (away from the reader) is drawn as a CROSS. The convention is commonly explained as the tip of an approaching arrow (the dot) and the flights of a receding one (the cross).

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-121`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::dot-cross-page-convention::SYMBOL_OR_CONVENTION` -- **VERIFIED**

**Normalized claim references:**
- SRC-MIT802-CH9-SOURCES: dot = out of page; SRC-MIT802-CH8-MAGFIELDS: cross = into page; SRC-OPENSTAX-PHYSICS-20-1: dot as an approaching arrow's head

**Depth justification:** A pure notation-reading skill, kept as its own learning point because it is a prerequisite for interpreting almost every subsequent directional diagram (Fleming's rules, the grip rule, motor and generator figures) yet is diagnosably separate from any of the physics. A learner who misreads a cross as "out of the page" will get every direction question wrong for a reason that has nothing to do with electromagnetism.

**Explicit exclusions:**
- Any physics of the quantity being represented -- this is notation only
- Three-dimensional vector drawing conventions
- Right-hand/left-hand rules themselves (see EMI-LP-05, EMI-LP-13, EMI-LP-16)

**Representative application types:** (none currently assessable -- see contextual examples below and/or evidence readiness note)

**Contextual examples (non-assessable, background only):**
- State whether a cross on a field diagram means the field is directed into or out of the page.
- Given a diagram using dots and crosses, describe the direction of the current in each conductor.

---

### `EMI-LP-04` -- The magnetic field around a current-carrying conductor

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to state that a conductor carrying an electric current is surrounded by a magnetic field, and describe the shape of that field.

**Knowledge / procedure:** An electric current produces a magnetic field: currents arising from the motion of charge are the source of magnetic fields. A long straight wire carrying a current is surrounded by magnetic field lines forming concentric circles centred on the wire, lying in planes perpendicular to the wire. This concentric-circle description is strictly the LONG/straight-wire idealisation -- it is the result for the infinite-length limit, with the finite-wire case derived separately.

**Within-domain prerequisites:** `EMI-LP-02`

**Cross-domain prerequisites:** `EFS-LP-02`

**Knowledge-target IDs:** `unit202::ACQ-107`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::magnetic-field-around-a-current-carrying-conductor::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-HYPERPHYSICS-MAGCUR: A long straight wire carrying an electric current is surrounded by magnetic field lines that form concentric c...
- SRC-MIT802-CH9-SOURCES: MIT states the circular field-line result explicitly for the infinite-length limit of a straight wire (cylindr...

**Depth justification:** This is the foundational causal fact of the whole domain -- current produces magnetism -- and everything from the solenoid to the motor effect rests on it. Kept separate from the grip rule (EMI-LP-05) because knowing THAT a field exists and what shape it is, is diagnosably prior to determining WHICH WAY round it points. Carries a genuine cross-domain prerequisite on the accepted Batch 02 EFS-LP-02, since the outcome presupposes knowing what a current is.

**Explicit exclusions:**
- The direction of the field (see EMI-LP-05)
- Calculating field strength (B = mu0*I/2*pi*r) -- not required at this level
- The finite-conductor derivation
- Force between two parallel current-carrying conductors

**Representative application types:**
- State what surrounds a conductor when it carries a current.
- Describe the shape of the magnetic field around a long straight current-carrying wire.

---

### `EMI-LP-05` -- The right-hand grip rule for a current-carrying conductor

**Evidence readiness:** READY

**Evidence readiness note (Stage 2.1/4.4 correction):** Previously held as an authority-tier gap: the strongest statements (MIT 8.02, LibreTexts, HyperPhysics) were genuinely retrieved and read but excluded because this result's recorded sourceAuthorityClasses had never been updated to this qualification's own widened directional-rule policy (already adopted for the Fleming rules). Corrected -- academic sources are accepted for this low-risk, non-safety directional physics rule, per the qualification's risk-based authority policy. Now VERIFIED on all three dimensions, including CORRECT_USE_CONDITIONS via LibreTexts' explicit statement that the rule is for conventional current and the left hand must be used for electron flow.

**Learner outcome:** The learner will be able to apply the right-hand grip rule to determine the direction of the magnetic field around a straight current-carrying conductor.

**Knowledge / procedure:** Point the RIGHT hand's THUMB along the direction of the current -- meaning CONVENTIONAL current, the direction in which positive charge flows -- and curl the fingers as if wrapping around the wire. The curled FINGERS then give the direction of the magnetic field encircling the conductor. The rule is tied to the conventional-current convention: it is the conventional-current direction that goes with the right hand.

**Within-domain prerequisites:** `EMI-LP-04`, `EMI-LP-03`

**Cross-domain prerequisites:** `EFS-LP-03`

**Knowledge-target IDs:** `unit202::ACQ-108`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::right-hand-grip-rule::OPERATIONAL_USE_RULE` -- **VERIFIED**

**Normalized claim references:**
- SRC-ARBORSCI-RHR-THREE-RULES: Right-hand grip rule, directional and role mapping: point the RIGHT hand's THUMB along the flow of current -- ...

**Depth justification:** A directional rule kept as its own learning point because it is exactly where learners make reproducible errors, and because the error is diagnosable: using the wrong hand, or applying the right hand to electron flow. Carries a genuine cross-domain prerequisite on the accepted Batch 02 EFS-LP-03 (conventional current and electron flow), since the rule is only correct for one of those two conventions and a learner who has not distinguished them cannot apply it safely.

**Explicit exclusions:**
- The solenoid/coil form of the grip rule (see EMI-LP-06) -- the hand roles differ and must not be conflated
- The right-hand PALM rule, which is a different rule
- Fleming's left-hand and right-hand rules (see EMI-LP-13, EMI-LP-16)
- Vector cross-product formulations

**Representative application types:**
- Given a vertical conductor with current flowing upwards, state the direction of the magnetic field in front of it.
- Explain why the right-hand grip rule gives the wrong answer if applied to the direction of electron flow.

---

### `EMI-LP-06` -- The solenoid: its magnetic field and how to find its polarity

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to describe the magnetic field produced by a current-carrying solenoid and determine which end is its north pole.

**Knowledge / procedure:** A solenoid is a long coil of wire wound in helical form. When it carries a steady current and its turns are closely spaced, the magnetic field INSIDE it is fairly uniform and parallel to its axis, provided its length is much greater than its diameter. Externally it behaves like a bar magnet: it has an identifiable N end and S end, with field lines leaving the N end and entering the S end. The flux density B inside is proportional to the current I in the coil. POLARITY IS FOUND BY THE RIGHT-HAND GRIP RULE APPLIED TO THE COIL: grasp the solenoid in the right hand so that the FINGERS point in the direction the current flows in the wires; the EXTENDED THUMB then points toward the solenoid's NORTH pole. Note carefully that the hand roles are REVERSED compared with the straight-conductor grip rule (EMI-LP-05), where the thumb is the current and the fingers are the field -- this reversal is a predictable source of error.

**Within-domain prerequisites:** `EMI-LP-05`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-109`, `unit202::ACQ-110`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::solenoid-magnetic-field::EXACT_FACT` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::solenoid-polarity::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-MIT802-CH9-SOURCES: A solenoid is a long coil of wire tightly wound in helical form. When it carries a steady current and its turn...
- SRC-HYPERPHYSICS-SOLENOID: A long straight coil of wire generates a nearly uniform magnetic field similar to that of a bar magnet, and th...
- SRC-USF-ETC-RHR-SOLENOID-35671: Solenoid end-polarity is determined by the right-hand grip rule applied to the COIL: grasp the solenoid in the...
- SRC-MIT802-CH9-SOURCES: A current-carrying solenoid has an identifiable S end and N end, with external field lines leaving the N end a...

**Depth justification:** Field shape and polarity determination for a solenoid are combined because they are one practical skill -- a learner asked about a solenoid is asked simultaneously what its field looks like and which end is north, and the polarity rule only makes sense once the bar-magnet-like field is understood. The explicit warning about the hand-role reversal versus EMI-LP-05 is included as knowledge content precisely because it is the misconception this pairing generates.

**Explicit exclusions:**
- Calculating the internal flux density from turns and current (B = mu0*n*I)
- The idealised infinite-solenoid result that the external field vanishes entirely -- a real long solenoid has a small but non-zero external field
- Toroids and other coil geometries
- Inductance of a coil (covered as an electrical quantity in Batch 04)

**Representative application types:**
- Given a diagram of a solenoid with the current direction marked, identify which end is the north pole.
- Describe the magnetic field inside a long current-carrying solenoid.
- Explain why the right-hand rule is applied differently to a solenoid than to a straight wire.

---

### `EMI-LP-07` -- The electromagnet

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain the basic principle of an electromagnet and state why its magnetism can be switched on and off.

**Knowledge / procedure:** An electromagnet is a TEMPORARY magnet whose magnetic field is created by an electric current. Coiling the current-carrying wire concentrates the magnetic field in the centre of the coil, producing a much stronger field than a straight conductor would. Because the field exists only while current flows, it DISAPPEARS when the current is turned off -- this switchability is what makes electromagnets useful in devices such as relays and contactors.

**Within-domain prerequisites:** `EMI-LP-06`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-111`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::basic-electromagnet-principle::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-MAGLAB-ELECTROMAGNETS: An electromagnet is a temporary magnet whose magnetic field is created by an electric current; coiling the cur...
- SRC-MIT802-CH9-SOURCES: Currents arising from the motion of charges are the source of magnetic fields....

**Depth justification:** A short, single-idea learning point, but a genuinely separate mastery from the solenoid (EMI-LP-06): the solenoid point is about field shape and polarity, whereas this is about the electromagnet as a controllable DEVICE, and specifically about the on/off property that motivates every application in EMI-LP-08. A learner can describe a solenoid's field correctly and still not have grasped that switching the current off removes the magnetism.

**Explicit exclusions:**
- The role and effect of a soft-iron core -- NOT evidenced in this batch (the acquisition returned a description but never a verbatim passage), so it must not be taught as established here
- Magnetic materials, hysteresis and remanence
- Calculating magnetomotive force or ampere-turns
- Permanent-magnet manufacture

**Representative application types:**
- Explain what happens to an electromagnet's magnetic field when the current is switched off.
- State why the wire in an electromagnet is wound into a coil rather than left straight.

---

### `EMI-LP-08` -- Relays and contactors: electromagnetically operated switches

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain how a relay works, state the two benefits it provides, and explain how a contactor differs from a relay.

**Knowledge / procedure:** A RELAY is a solenoid arranged to actuate switch contacts when its coil is energised. It provides two distinct benefits: (1) a relatively SMALL electrical signal can switch a relatively LARGE one; and (2) it provides electrical ISOLATION between the coil circuit and the contact circuit -- the two are electrically insulated from one another, so one may be DC and the other AC, and/or they may sit at completely different voltage levels. A CONTACTOR is a relay used to switch a LARGE amount of electrical POWER through its contacts. Contactors typically have multiple contacts, usually (but not always) normally-open, so that power to the load is shut off when the coil is de-energised. The most common industrial use for contactors is the control of electric motors. The two terms are therefore NOT interchangeable: a contactor is a particular kind of relay, distinguished by the power level it is built to switch.

**Within-domain prerequisites:** `EMI-LP-07`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-119`, `unit202::ACQ-120`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::relay::EXACT_FACT` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::contactor::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-LIBRETEXTS-WF-RELAY-5-1: A relay is a solenoid arranged to actuate switch contacts when its coil is energised. It allows a relatively s...
- SRC-LIBRETEXTS-WF-CONTACTOR-5-2: A contactor is a relay used to switch a large amount of electrical power through its contacts. Contactors typi...

**Depth justification:** Relay and contactor are combined into one learning point because the evidenced definition of a contactor is literally "a relay used to switch a large amount of electrical power" -- they cannot be taught independently without either duplicating the relay explanation or leaving the contactor undefined. The batch guardrail requiring the two to be kept DISTINCT is satisfied within the learning point by stating the distinguishing property explicitly, rather than by splitting into two points that would each have to restate the other.

**Explicit exclusions:**
- Relay contact arrangements and terminology beyond normally-open/normally-closed
- Contactor sizing, utilisation categories and BS EN 60947 classification
- Motor starter circuits and control-circuit design
- Solid-state relays and semiconductor switching (Batch 06 covers electronic switching devices)

**Representative application types:** (none currently assessable -- see contextual examples below and/or evidence readiness note)

**Contextual examples (non-assessable, background only):**
- Explain how a small switch can be used to control a large motor current using a contactor.
- State the difference between a relay and a contactor.
- Explain what is meant by saying a relay provides electrical isolation.

---

### `EMI-LP-09` -- Magnetic flux: meaning, symbol and unit

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to state what magnetic flux is, and give its quantity symbol and its SI unit name and symbol.

**Knowledge / procedure:** Magnetic flux is the product of the magnetic field and the perpendicular area it penetrates -- that is, the total amount of magnetic field passing through a given surface. Its quantity symbol is the Greek capital letter phi, written as the Greek capital phi in engineering usage. Its SI unit is the WEBER, unit symbol Wb, where 1 Wb = 1 T*m^2.

**Within-domain prerequisites:** (none)

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-104`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::magnetic-flux-meaning-symbol-unit::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-MIT802-CH10-FLUX: Magnetic flux is denoted by the Greek capital phi, written Φ_B in MIT's notation and Φ in engineering usage; i...
- SRC-HYPERPHYSICS-MAGFLUX: Expressed as a plain meaning: magnetic flux is the product of the average magnetic field and the perpendicular...

**Depth justification:** An identity/recall mastery for one quantity, held separate from flux density (EMI-LP-10) because the pair is precisely where learners conflate two different quantities with two different units, and separating them makes the confusion diagnosable. This mirrors the split the accepted Batch 04 inventory made between capacitance and capacitive reactance, and between inductance and inductive reactance, for the same reason.

**Explicit exclusions:**
- The surface-integral definition for a non-uniform field
- Flux linkage and the number of turns
- Calculating flux from B and A (see EMI-LP-11)
- Magnetic circuits, reluctance and permeability

**Representative application types:**
- State the SI unit of magnetic flux and its unit symbol.
- Give the quantity symbol used for magnetic flux.

---

### `EMI-LP-10` -- Magnetic flux density: meaning, symbol and unit

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to state what magnetic flux density is, give its quantity symbol and SI unit name and symbol, and distinguish it from magnetic flux.

**Knowledge / procedure:** Magnetic flux density is the magnetic flux PER UNIT AREA -- which is why it is called a flux "density". Its quantity symbol is B. Its SI unit is the TESLA, unit symbol T, equivalently webers per square metre, where 1 Wb/m^2 = 1 T. Flux and flux density are NOT the same quantity: flux (phi, webers) is a total amount passing through a surface, whereas flux density (B, teslas) is how much of that flux is concentrated into each square metre.

**Within-domain prerequisites:** `EMI-LP-09`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-105`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::magnetic-flux-density-meaning-symbol-unit::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-LIBRETEXTS-ELLINGSON-FLUXDENSITY: Magnetic flux density is denoted by the symbol B and has SI units of tesla (T), equivalently webers per square...

**Depth justification:** Deliberately taught immediately after, and prerequisite on, magnetic flux (EMI-LP-09), because flux density is defined in terms of flux and cannot be understood first. The explicit flux-vs-flux-density contrast is included as knowledge content here rather than in EMI-LP-09 so that the distinction is taught once, at the point where both quantities are available to the learner.

**Explicit exclusions:**
- The force-based definition of B via F = qv x B
- Non-SI units such as the gauss
- Calculating B from phi and A (see EMI-LP-11)
- Field strength H and the B-H relationship

**Representative application types:**
- State the SI unit of magnetic flux density and its unit symbol.
- Explain the difference between magnetic flux and magnetic flux density.
- Identify which of a list of units (Wb, T, Wb/m^2, A/m) are units of flux density.

---

### `EMI-LP-11` -- Using B = flux/area, including rearrangement

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to use B = phi/A to calculate flux density, magnetic flux or area, rearranging the formula as required, and state the conditions under which the formula applies.

**Knowledge / procedure:** Where magnetic flux is distributed over a cross-sectional area, the magnetic flux density is B = phi/A, in which B is the flux density in teslas, phi is the magnetic flux in webers and A is the area in square metres. It rearranges to phi = B x A and to A = phi/B. METHOD: (1) convert the stated dimensions to SI and compute the cross-sectional area A from the core dimensions; (2) apply the formula in the direction required. Worked instances: 6E-5 Wb distributed over 2E-4 m^2 gives B = 0.3 T; a flux density of 0.52 T over an area of 4E-4 m^2 gives phi = 2.08E-4 Wb. CONDITION OF USE: this simple form is valid for the UNIFORM-field case with the field PERPENDICULAR to the area (parallel to the area's normal). In general the flux is phi = BA cos(theta), where theta is the angle between the field and the normal to the surface, so B = phi/A holds when theta = 0; and only the COMPONENT of the field perpendicular to the area contributes. It is not the unrestricted general definition.

**Within-domain prerequisites:** `EMI-LP-09`, `EMI-LP-10`

**Cross-domain prerequisites:** `FM-LP-13`, `FM-LP-16`, `FM-LP-18`, `FM-LP-19`

**Knowledge-target IDs:** `unit202::ACQ-106`, `unit202::ACQ-118`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::b-phi-a-and-appropriate-rearrangement-use::FORMULA_OR_RULE` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::suitable-simple-electromagnetism-calculations-rearrangements::PROCEDURE_COVERAGE` -- **VERIFIED**

**Normalized claim references:**
- SRC-LIBRETEXTS-FIORE-MAGCIRCUITS: Where magnetic flux Φ is constrained within (i.e. distributed over) a cross-sectional area A, the magnetic flu...
- SRC-MIT802-CH10-FLUX: The rearrangement Φ = BA is valid only for the uniform-field, field-normal-to-the-area case: MIT states Φ_B = ...
- SRC-HYPERPHYSICS-MAGFLUX: In the general case the contribution to magnetic flux for a given area equals the area times the COMPONENT of ...
- SRC-LIBRETEXTS-MAGNETIC-CIRCUITS-14-03: Worked method for simple electromagnetism calculations with formula rearrangement: (1) convert the stated dime...

**Depth justification:** The formula and the calculation procedure are combined because the retrieved procedural evidence IS a set of worked B = phi/A rearrangements -- there is no separate body of "simple electromagnetism calculations" in this batch's evidence beyond this relationship, so splitting them would create a learning point with no distinct content. Carries genuine cross-domain prerequisites on the accepted Batch 01 inventory: FM-LP-13 (substitution) and FM-LP-16 (rearrangement) because the outcome explicitly requires solving for a different unknown, and FM-LP-18/FM-LP-19 because the worked values are in standard form with SI prefixes.

**Explicit exclusions:**
- The surface-integral form for non-uniform fields
- Calculations involving the angle theta -- the cos(theta) qualification is taught as a CONDITION OF USE, not as a calculation outcome
- Magnetic circuit calculations involving reluctance, permeability or ampere-turns
- Deriving the formula

**Representative application types:**
- A flux of 4E-4 Wb passes uniformly and perpendicularly through a core of cross-sectional area 5E-4 m^2. Calculate the flux density.
- A core of area 2E-4 m^2 carries a flux density of 0.8 T. Calculate the magnetic flux.
- State the condition under which B = phi/A may be used.

---

### `EMI-LP-12` -- The motor effect and the force on a current-carrying conductor

**Evidence readiness:** READY

**Evidence readiness note:** [Correction, Stage 2.1/4.5] Previously held because no in-class source used the UK term "motor effect" itself. Corrected: the qualification source supplies the curricular term; a technical source does not need to use that exact phrase if it explicitly establishes the phenomenon the qualification names, which it does. Now fully VERIFIED.

**Learner outcome:** The learner will be able to state that a current-carrying conductor in a magnetic field experiences a force, and use F = BIl to calculate the size of that force in the perpendicular case.

**Knowledge / procedure:** A conductor carrying a current in a magnetic field experiences a FORCE. The magnetic force acts on the charges moving in the conductor and, because those charges ordinarily cannot escape the conductor, that force is transmitted to the conductor itself. The resulting force is PERPENDICULAR to both the wire and the magnetic field. SIZE OF THE FORCE: the general relationship is F = BIl sin(theta), where theta is the angle between the current direction and the field. The scalar form F = BIl is the SPECIAL CASE in which the current is PERPENDICULAR to the magnetic field (theta = 90 degrees, so sin theta = 1). F = BIl must therefore not be presented as unconditionally general -- it is the perpendicular-conductor case, in which B is the flux density in teslas, I the current in amperes and l the length of conductor in the field in metres.

**Within-domain prerequisites:** `EMI-LP-10`, `EMI-LP-04`

**Cross-domain prerequisites:** `FM-LP-13`, `FM-LP-16`

**Knowledge-target IDs:** `unit202::ACQ-112`, `unit202::ACQ-113`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::motor-effect::EXACT_FACT` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::scalar-f-bil::RELATIONSHIP` -- **VERIFIED**

**Normalized claim references:**
- SRC-OPENSTAX-CP2E-22-7: The motor effect: a conductor carrying a current in a magnetic field experiences a force. The magnetic force a...
- SRC-OPENSTAX-CP2E-22-7: The general relationship for the magnitude of the magnetic force on a length l of wire carrying current I in a...
- SRC-HYPERPHYSICS-FORWIR: The force so produced is perpendicular to both the wire and the magnetic field; its direction is given by the ...

**Depth justification:** The qualitative effect and its quantitative formula are combined because F = BIl is the size of the very force the motor effect describes; teaching them separately would either duplicate the setup or leave the formula's physical meaning unstated. The perpendicular-case qualification is carried as explicit knowledge content, per this batch's guardrail, rather than being relegated to an exclusion.

**Explicit exclusions:**
- The general F = BIl sin(theta) case as a CALCULATION outcome -- the sin(theta) form is taught as a scope qualification only
- Vector cross-product formulation F = Il x B
- The direction of the force (see EMI-LP-13 for Fleming's left-hand rule)
- Torque on a current loop, and motor design
- Force between parallel conductors

**Representative application types:**
- A conductor of length 0.2 m carrying 5 A lies perpendicular to a field of 0.4 T. Calculate the force on it.
- State what happens to a current-carrying wire placed at right angles to a magnetic field.
- Explain why F = BIl cannot be used when the conductor lies along the field direction.

---

### `EMI-LP-13` -- Fleming's left-hand (motor) rule

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to apply Fleming's left-hand rule to determine the direction of the force produced on a current-carrying conductor in a magnetic field.

**Knowledge / procedure:** Fleming's LEFT-hand rule is the MOTOR (force) rule. Using the LEFT hand, hold the thumb, first finger and second finger mutually at right angles. The mapping runs "F, B, I" from the thumb: THUMB = Force (the direction of the force or motion produced on the conductor); FIRST/fore FINGER = B (the magnetic field); SECOND/middle FINGER = I (the current). CONDITIONS OF USE: the rule applies to a current-carrying conductor placed across a magnetic field, and gives the direction of the force generated on that conductor when current passes through it. The magnitude of that force is given separately by F = BIl (EMI-LP-12). Fleming's LEFT hand is for the MOTOR case; the RIGHT hand is the generator rule (EMI-LP-16) and the two must never be interchanged.

**Within-domain prerequisites:** `EMI-LP-12`, `EMI-LP-03`

**Cross-domain prerequisites:** `EFS-LP-03`

**Knowledge-target IDs:** `unit202::ACQ-114`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::fleming-left-hand-rule::OPERATIONAL_USE_RULE` -- **VERIFIED**

**Normalized claim references:**
- SRC-NIDEC-BASIC-00012: Fleming's LEFT-hand rule is the motor/force rule. Using the left hand, the finger-to-quantity mapping runs 'F,...
- SRC-NIDEC-GLOSSARY-FLEMING: Correct-use conditions: the rule applies to a current-carrying conductor placed across (in) a magnetic field, ...

**Depth justification:** A directional rule kept as its own learning point for the same reason as the grip rule (EMI-LP-05): it is a discrete, highly error-prone procedural skill whose failure mode (wrong hand, or wrong finger-to-quantity assignment) is specifically diagnosable and specifically remediable. The explicit left-is-motor / right-is-generator contrast is carried as knowledge content because confusing the two is the single most common error in this topic.

**Explicit exclusions:**
- Fleming's right-hand rule (see EMI-LP-16)
- The right-hand grip rule (see EMI-LP-05) -- a different rule with different hand roles
- The vector right-hand rule used with cross products, which gives the same direction by a different mnemonic
- Calculating the magnitude of the force (see EMI-LP-12)
- Commutation and practical motor construction

**Representative application types:**
- Given a diagram showing the field direction and the current direction in a conductor, state the direction of the force on it.
- State which hand is used for the motor rule and which for the generator rule.
- Identify the quantity represented by the first finger in Fleming's left-hand rule.

---

### `EMI-LP-14` -- Electromagnetic induction: motion, flux cutting, and when EMF is greatest or zero

**Evidence readiness:** READY

**Evidence readiness note:** [Correction, Stage 1.1/4.6] Previously held on a disclosed two-passage compounding for the motional-EMF causal concept. Corrected: multi-source composition is valid verification, never a partial result, provided each constituent claim retains its own source binding (it does). Now fully VERIFIED.

**Learner outcome:** The learner will be able to explain that moving a conductor so that it cuts magnetic flux induces an EMF, and state the positions of maximum and zero induced EMF for a conductor rotating in a magnetic field.

**Knowledge / procedure:** MOTIONAL EMF is the EMF induced because a conductor MOVES relative to a magnetic field. Its cause can be stated two equivalent ways: the magnetic force acting on the free charges within the moving conductor drives them along it, separating charge and establishing an EMF; equivalently, the motion changes the magnetic flux enclosed by the circuit, and a changing flux induces an EMF. ROTATION AND FLUX CUTTING: rotating a conductor loop in a magnetic field causes the loop sides to CUT ACROSS the magnetic flux, and it is that cutting which induces the EMF. The induced EMF therefore varies continuously through each revolution. MAXIMUM: the induced EMF is greatest at the instant the conductor is cutting PERPENDICULARLY across the field -- when the rate at which flux is being cut is at its maximum. For a rotating loop this is when the plane of the loop is PARALLEL to the field, the instant at which the flux linking the loop is momentarily ZERO but its rate of change is greatest. ZERO: when the conductor's motion is PARALLEL to the field lines it is not cutting across the field at all and the induced EMF is zero; for a rotating loop this is when the loop plane is PERPENDICULAR to the field, where the flux linking the loop is at its MAXIMUM but its rate of change is zero. Note the trap carefully: maximum FLUX and maximum EMF occur at OPPOSITE instants -- it is the RATE of flux cutting, not the amount of flux, that determines the EMF.

**Within-domain prerequisites:** `EMI-LP-09`, `EMI-LP-10`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-115`, `unit202::ACQ-127`, `unit202::ACQ-129`, `unit202::ACQ-128`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::motional-induced-emf-causal-concept::RELATIONSHIP` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::rotation-field-cutting-causality::RELATIONSHIP` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::maximum-induced-emf-when-cutting-is-maximum::EXACT_FACT` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::no-minimum-induced-emf-when-motion-does-not-cut-flux-appropriately::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-LIBRETEXTS-UP2-13-4: Motional EMF is the emf induced because a conductor MOVES relative to a magnetic field. Its cause can be state...
- SRC-LIBRETEXTS-COALINGA-GENERATOR: Rotating a conductor loop in a magnetic field causes the loop sides to cut across the magnetic flux, and it is...
- SRC-LIBRETEXTS-ELLINGSON-8-7: For a rudimentary single-loop generator rotating in a time-invariant, spatially-uniform magnetic flux density,...
- SRC-LIBRETEXTS-COALINGA-GENERATOR: The induced EMF is greatest at the instant when the conductor is cutting perpendicularly across the magnetic f...
- SRC-LIBRETEXTS-ELLINGSON-8-7: For a loop rotating in a uniform field, the maximum voltage magnitude is achieved when the plane of the loop i...
- SRC-LIBRETEXTS-COALINGA-GENERATOR: When the conductor's motion is PARALLEL to the magnetic field lines it is not cutting across the field at all,...

**Depth justification:** Four requirements are combined here because they form one continuous causal story that cannot be split without breaking it: motion causes flux cutting, flux cutting causes EMF, and the maximum and zero cases are the two ends of that same continuous variation through a revolution. Teaching "maximum EMF" and "zero EMF" as separate learning points would present as two isolated facts what is actually a single understanding, and would lose the crucial maximum-flux-versus-maximum-EMF contrast, which only exists when both cases are held together. This contrast is the domain's principal misconception and is stated explicitly as knowledge content.

**Explicit exclusions:**
- Faraday's law as a quantitative formula, and Lenz's law
- The direction of the induced current (see EMI-LP-16)
- The magnitude of the induced EMF (see EMI-LP-15)
- Self-inductance and mutual inductance
- Eddy currents and transformer action

**Representative application types:**
- Explain why an EMF is induced when a conductor is moved across a magnetic field.
- State the position of a rotating loop at which the induced EMF is greatest.
- Explain why the induced EMF is zero at the instant the flux linking a rotating loop is at its maximum.

---

### `EMI-LP-15` -- Using e = Blv for a moving conductor

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to use e = Blv to calculate the EMF induced in a straight conductor moving through a magnetic field, and state the conditions under which the formula applies.

**Knowledge / procedure:** For a straight conductor of length l moving with velocity v through a uniform magnetic field of flux density B, the magnitude of the motional EMF is e = Blv, where e is in volts, B in teslas, l in metres and v in metres per second. CONDITIONS OF USE: this scalar form holds only when B, l and v are MUTUALLY PERPENDICULAR, and B and l must be constant over the moving conductor. This is the maximum-flux-cutting case -- the same instant identified in EMI-LP-14 as giving maximum induced EMF. If the motion is not perpendicular to the field, less flux is cut per second and the induced EMF is correspondingly smaller, falling to zero when the motion is parallel to the field.

**Within-domain prerequisites:** `EMI-LP-14`

**Cross-domain prerequisites:** `FM-LP-13`, `FM-LP-16`

**Knowledge-target IDs:** `unit202::ACQ-116`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::e-blv::RELATIONSHIP` -- **VERIFIED**

**Normalized claim references:**
- SRC-OPENSTAX-CP2E-23-3: For a straight conductor of length l moving with velocity v through a uniform magnetic field of flux density B...
- SRC-OPENSTAX-UP2-13-3: e = Blv is obtained from Faraday's law for a conducting rod sliding on rails: the flux through the circuit is ...

**Depth justification:** The quantitative counterpart to EMI-LP-14, kept separate because it is a calculation mastery rather than a conceptual one -- a learner may understand flux cutting perfectly and still be unable to substitute into and rearrange e = Blv, and vice versa. Its perpendicularity condition is carried as explicit knowledge content per this batch's guardrail, and is tied back to the maximum-cutting case so the formula is not learned as a context-free string of letters.

**Explicit exclusions:**
- Faraday's law in its general form
- The direction/polarity of the induced EMF (see EMI-LP-16)
- Non-perpendicular cases as a CALCULATION outcome -- taught as a scope qualification only
- EMF induced by a changing field rather than by motion

**Representative application types:**
- A conductor 0.25 m long moves at 4 m/s perpendicular to a field of 0.6 T. Calculate the induced EMF.
- State the three quantities that must be mutually perpendicular for e = Blv to apply.
- Explain what happens to the induced EMF if the conductor moves parallel to the field lines.

---

### `EMI-LP-16` -- Fleming's right-hand (generator) rule

**Evidence readiness:** READY

**Evidence readiness note:** [Section E, third narrow correction pass -- RESOLVED] DIRECTIONAL_MAPPING is now VERIFIED via a directly retrieved and read passage from the published Hughes textbook: Edward Hughes (revised by Hiley, Brown and McKenzie Smith), "Hughes Electrical and Electronic Technology", 10th edition, Pearson Education Limited, 2008, ISBN 978-0-13-206011-0, Chapter 6, section 6.9(a) "Fleming's right-hand rule", printed page 141 -- accessed via a FlipHTML5-hosted page-image scan, disclosed only as the retrieval route (the cited authority is the published textbook itself). The passage states in text: "If the first finger of the right hand is pointed in the direction of the magnetic flux ... and if the thumb is pointed in the direction of motion of the conductor relative to the magnetic field, then the second finger, held at right angles to both the thumb and the first finger, represents the direction of the e.m.f." This directly confirms the finger mapping already taught in this LP's knowledgeOrProcedure (thumb = motion, first finger = field, second finger = EMF/current), which had previously rested only on the ROLE_MAPPING/CORRECT_USE_CONDITIONS evidence and was correctly withheld from READY pending this dimension. All three required dimensions (DIRECTIONAL_MAPPING, ROLE_MAPPING, CORRECT_USE_CONDITIONS) are now VERIFIED. The prior held state's extensive, genuinely-exhausted access attempts against the Hughes 12th edition (p.145) are superseded, not contradicted: this pass located and read the equivalent passage in the 10th edition instead, at the user-identified FlipHTML5 URL. The current-flow-convention conflict against a LEFT-hand, electron-flow source (SRC-LIBRETEXTS-COALINGA-GENERATOR) remains recorded on the evidence row as a genuine, disclosed distinct-convention note -- it does not affect this UK-practice, conventional-current requirement.

**Learner outcome:** The learner will be able to apply Fleming's right-hand rule to determine the direction of the induced EMF and current in a conductor moving through a magnetic field.

**Knowledge / procedure:** Fleming's RIGHT-hand rule is the GENERATOR rule: it gives the direction of the electromotive force -- and hence of the induced current -- generated in a conductor that is MOVING through a magnetic field. Using the RIGHT hand with thumb, first finger and second finger mutually at right angles: THUMB = motion of the conductor; FIRST finger = field; SECOND finger = induced current/EMF. CONDITIONS OF USE: the rule applies where a conductor of length l in a field of flux density B moves with velocity v through the magnetic flux, producing a generated voltage of magnitude e = Blv (EMI-LP-15); the right-hand rule determines the DIRECTION of that voltage. It is one of a PAIR of Fleming's rules, the other (left-hand) being the force/motor rule (EMI-LP-13); the two must not be interchanged. The memory aid is that geNerator goes with the riGht hand and moTor with the lefT hand.

**Within-domain prerequisites:** `EMI-LP-14`, `EMI-LP-13`

**Cross-domain prerequisites:** `EFS-LP-03`

**Knowledge-target IDs:** `unit202::ACQ-117`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::fleming-right-hand-generator-rule::OPERATIONAL_USE_RULE` -- **VERIFIED**

**Normalized claim references:**
- SRC-NIDEC-GLOSSARY-FLEMING: Fleming's RIGHT-hand rule is the generator rule: it gives the direction of the electromotive force (and hence ...
- SRC-NIDEC-BASIC-00013: Correct-use conditions: the rule applies where a conductor of length L in a field of flux density B moves with...
- SRC-HUGHES-EET-10E-P141: The published Hughes textbook directly states, in text, the exact right-hand generator-rule finger mapping: first finger = magnetic flux (field); thumb = motion of the conductor relative to the field; second finger, held at right angles to both, = direction of the induced e.m.f.

**Depth justification:** Kept separate from Fleming's left-hand rule (EMI-LP-13) despite the structural similarity, because the whole pedagogical problem here is that learners merge the two. Two separate learning points, each explicitly naming the other as the thing it is not, is the arrangement that makes the confusion diagnosable; a single combined "Fleming's rules" point would hide exactly the error it needs to surface. Prerequisite on EMI-LP-13 so the contrast is available.

**Explicit exclusions:**
- Fleming's left-hand rule (see EMI-LP-13)
- The right-hand grip rule (see EMI-LP-05)
- Lenz's law and the sign conventions of Faraday's law
- The magnitude of the induced EMF (see EMI-LP-15)

**Representative application types:**
- Given a diagram showing a conductor moving upwards through a field directed to the right, state the direction of the induced current.
- State which of Fleming's rules applies to a generator and which to a motor.

---

### `EMI-LP-17` -- The simple AC generator: parts and how they work together

**Evidence readiness:** READY

**Outstanding production dependency:** REPRESENTATIVE_DIAGRAM_AUTHORING (a diagram merging the single-loop framing with full slip-ring/brush labelling, not yet authored/validated)

**Correction note (false-green re-adjudication):** Previously marked READY despite two of its four underlying requirements being PARTIALLY_VERIFIED. This learner outcome explicitly requires identifying a SINGLE-LOOP generator on a diagram, but no permitted-class source shows one diagram both captioned single-loop and fully labelled with slip rings/brushes (single-loop-alternator-generator-parts), and no labelled coil callout or symbol was obtained from an in-class source (coil). Reverted to HELD_PENDING_EVIDENCE_CORRECTION.

**Evidence readiness note:** [Resolved, Stage C re-adjudication, narrow correction pass] The fourth and final requirement (coil) is now VERIFIED: it was genuinely conflated with a different, AC6.2 question (a generic IEC 60617 circuit-schematic symbol for an inductor, EDA-LP-16's territory) -- the qualification's own manifest confirms this requirement (ACQ-123) belongs to AC5.4, and its genuine intended mastery (recognising the coil/winding as a labelled part of a simple AC generator diagram) is directly answered by the already-registered DOE Fundamentals Handbook evidence. All four required dimensions (single-loop-alternator-generator-parts, slip-rings, brushes, coil) are now VERIFIED. The DOE Module ES-07 'Simple AC Generator' Figure 1, used for single-loop-alternator-generator-parts, already shows the loop, field, slip rings and brushes together in one labelled diagram -- the outstanding REPRESENTATIVE_DIAGRAM_AUTHORING production dependency is resolved, since a suitable source diagram now exists to derive learner-facing artwork from deterministically.

**Learner outcome:** The learner will be able to identify the parts of a simple single-loop AC generator on a diagram and state the function of each.

**Knowledge / procedure:** A simple AC generator (alternator) is recognised by three functional elements plus its output connection: (a) a strong MAGNETIC FIELD, shown as poles marked N and S; (b) CONDUCTORS -- the rotating loop or winding -- that rotate through that field; and (c) a means of continuous connection to the rotating conductors as they turn, namely SLIP RINGS with BRUSHES. COIL: a coil is a set of turns of wire wound on a former or into machine slots; the field coils receive excitation and produce the magnetic flux, and the armature consists of coils of wire large enough to carry the machine's full-load current. SLIP RING: a continuous circular conducting ring fixed to, but insulated from, the rotor shaft and connected to the rotor windings, with a brush riding on it to connect to the stationary circuit; its function is to transfer power between a stationary and a rotating structure. BRUSH: a sliding contact, made of one or more carbon blocks, that transmits current between the stationary part and the rotating part; in a diagram it is the block-shaped contact pressed against and riding on the slip ring. CRITICAL DISTINCTION: an AC generator uses SLIP RINGS, not a split-ring commutator, because the desired output is a sine wave -- slip rings allow the output current and voltage to oscillate through positive and negative values, whereas a DC generator's commutator produces an output whose current always flows in the positive direction (pulsating DC). The two are distinct components producing distinct output waveforms and must never be substituted for one another.

**Within-domain prerequisites:** `EMI-LP-14`, `EMI-LP-16`

**Cross-domain prerequisites:** (none)

**Knowledge-target IDs:** `unit202::ACQ-122`, `unit202::ACQ-125`, `unit202::ACQ-126`, `unit202::ACQ-123`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::single-loop-alternator-generator-parts::SCHEMATIC_OR_DIAGRAM_RECOGNITION` -- **PARTIALLY_VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::slip-rings::SCHEMATIC_OR_DIAGRAM_RECOGNITION` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::brushes::SCHEMATIC_OR_DIAGRAM_RECOGNITION` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::coil::SCHEMATIC_OR_DIAGRAM_RECOGNITION` -- **PARTIALLY_VERIFIED**

**Normalized claim references:**
- SRC-DOE-HDBK-1011-3-ES10: A simple AC generator/alternator diagram is recognised by three functional elements plus the output connection...
- SRC-DOE-HDBK-1011-3-ES10: In the small-machine arrangement corresponding to the classic single-loop alternator — stationary field, rotat...
- SRC-DOE-HDBK-1011-3-ES10: A slip ring is recognised in a machine diagram as a continuous circular conducting ring fixed to (but insulate...
- SRC-DOE-HDBK-1011-3-ES10: Slip rings, not a split-ring commutator, are what an AC generator uses, because the desired output is a sine w...
- SRC-MOOG-SLIPRING-FUNDAMENTALS: The basic slip ring configuration is drawn as: the ring (the electrically conductive rotating conductor path),...
- SRC-MERSEN-CARBON-BRUSH-GUIDE: A (carbon) brush is a sliding contact used to transmit electrical current between a stationary part and a rota...
- SRC-MERSEN-CARBON-BRUSH-GUIDE: In a machine diagram a brush is recognised as the block-shaped contact pressed against, and riding on, the rot...
- SRC-DOE-HDBK-1011-3-ES10: In an AC generator schematic the brush appears as the stationary contact riding on the slip ring, labelled 'Br...
- SRC-DOE-HDBK-1011-3-ES10: In a generator/motor diagram a coil is recognised as a set of turns of wire wound on a former or into machine ...

**Depth justification:** The four part-recognition requirements are combined into one learning point because they are parts of ONE object and are only meaningful in relation to each other -- a slip ring is defined by the brush riding on it, and both exist to serve the rotating coil. Four separate recognition points would fragment a single diagram-reading skill into four trivial ones. The slip-ring-versus-commutator distinction is carried as explicit knowledge content, per this batch's guardrail, because substituting a commutator is the characteristic error and it changes the output waveform.

**Explicit exclusions:**
- Split-ring commutators and DC generator operation as a mastery topic -- named here only as the contrast to be avoided
- Rotating-field versus rotating-armature machine variants and when each is used
- Field excitation systems, exciters and rheostats beyond identifying them on a diagram
- Winding design, pitch and distribution factors
- Three-phase generation

**Representative application types:**
- Label the slip rings and brushes on a diagram of a simple AC generator.
- State the function of the slip rings in an AC generator.
- Explain why an AC generator uses slip rings rather than a commutator.

---

### `EMI-LP-18` -- Alternating output: the sine wave, the cycle, periodic time and frequency

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to describe the sinusoidal output of an AC generator, define one cycle, periodic time and frequency, and convert between periodic time and frequency.

**Knowledge / procedure:** ALTERNATING CURRENT is a flow of electric charge that periodically REVERSES DIRECTION. The alternating voltage produced by the simple alternator taught in EMI-LP-17 (a rotating loop/armature turning within a stationary magnetic field) traces a SINE WAVE, because the rate of magnetic flux change as the loop rotates follows a sine function, so the induced voltage follows that same function. [Correction, Stage 4 item 9] What actually matters physically is the RELATIVE rotation between the coil and the field -- a rotating field with a stationary coil produces the identical sinusoidal result -- but the one consistent taught model in this batch is the rotating loop/armature of EMI-LP-17, and this learning point is corrected to match it rather than silently switching to a rotating-magnet description. ONE CYCLE is the interval from any point on the sine-wave graph to the point at which the wave shape begins to repeat itself. PERIODIC TIME (the period) is the time taken to complete one complete cycle; its symbol is T and, with frequency in hertz, T is in seconds. FREQUENCY is the number of complete cycles completed in a given amount of time -- how many cycles occur in one second -- measured in HERTZ (Hz), where 1 Hz is one complete cycle per second. RELATIONSHIP: period and frequency are reciprocals, T = 1/f and equivalently f = 1/T.

**Within-domain prerequisites:** `EMI-LP-17`

**Cross-domain prerequisites:** `FM-LP-13`, `FM-LP-16`, `FM-LP-19`

**Knowledge-target IDs:** `unit202::ACQ-130`, `unit202::ACQ-137`, `unit202::ACQ-138`, `unit202::ACQ-139`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::alternating-sinusoidal-output-concept::EXACT_FACT` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::periodic-time::EXACT_FACT` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::frequency::EXACT_FACT` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::t-1-f::RELATIONSHIP` -- **VERIFIED**

**Normalized claim references:**
- SRC-LIBRETEXTS-KUPHALDT-AC-1-02: Alternating current is a flow of electric charge that periodically reverses direction; the alternating voltage...
- SRC-OPENSTAX-UP2-15-1: Alternating current (ac) is the flow of electric charge that periodically reverses direction....
- SRC-LIBRETEXTS-FIORE-AC-1-2: The period (periodic time) is the amount of time taken to complete one complete cycle of the waveform - one cy...
- SRC-LIBRETEXTS-KUPHALDT-AC-1-02: Frequency is the number of complete cycles a wave completes in a given amount of time; it is the reciprocal of...
- SRC-LIBRETEXTS-KUPHALDT-AC-1-02: Period and frequency are reciprocals: f = 1/T, and equivalently T = 1/f, with the period T being the time in s...

**Depth justification:** These four requirements are combined because period and frequency are defined in terms of the cycle, and T = 1/f simply states that the two are reciprocals -- they are one interlocking definition set, taught and assessed together, and separating them would produce learning points that each have to restate the others to make sense. Note that Batch 04's EQCT-LP-08 covers frequency as an ELECTRICAL QUANTITY (meaning, symbol, unit); this learning point covers it as a property of the generated AC WAVEFORM, tied to the cycle and the period. See the overlap audit -- that relationship is flagged for Product Architect confirmation.

**Explicit exclusions:**
- Angular frequency (omega = 2*pi*f) and radian measure
- Phase, phase difference and phasor representation
- Harmonics and non-sinusoidal waveforms
- Three-phase supply
- Deriving the sine function from the rotating geometry

**Representative application types:**
- State the periodic time of a 50 Hz supply.
- A waveform has a period of 20 ms. Calculate its frequency.
- Explain what is meant by one cycle of an alternating waveform.

---

### `EMI-LP-19` -- AC magnitude: peak (amplitude) and peak-to-peak values

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to define the peak and peak-to-peak values of an AC waveform and convert between them for a sine wave.

**Knowledge / procedure:** The AMPLITUDE of an AC waveform expressed as a PEAK (or crest) value is the change measured from the centre zero line to the most positive value -- that is, from zero to the maximum point of the cycle. The PEAK-TO-PEAK value is the total height between opposite peaks: the distance from the most negative to the most positive value, i.e. cycle minimum to cycle maximum. It is obtained by subtracting the cycle minimum from the cycle maximum. For a SINE WAVE the peak-to-peak value is always TWICE the peak value. Worked instance: a waveform peaking at +130 V and -130 V has a peak-to-peak value of 260 V, since 130 - (-130) = 260.

**Within-domain prerequisites:** `EMI-LP-18`

**Cross-domain prerequisites:** `FM-LP-04`

**Knowledge-target IDs:** `unit202::ACQ-135`, `unit202::ACQ-136`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::amplitude-peak::EXACT_FACT` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::peak-to-peak::EXACT_FACT` -- **VERIFIED**

**Normalized claim references:**
- SRC-LIBRETEXTS-FIORE-AC-1-2: The amplitude of an AC waveform expressed as a peak (or crest) value is the change measured from the centre ze...
- SRC-MST-COTTRELL-BASIC-INSTRUMENTATION: Peak voltage is the voltage value at the local maximum point in the cycle graph, measured from 0 to that maxim...
- SRC-LIBRETEXTS-KUPHALDT-AC-1-03: The intensity or magnitude of an AC quantity - also called the amplitude - may be expressed by its peak height...
- SRC-LIBRETEXTS-FIORE-AC-1-2: The peak-to-peak value of an AC waveform is the total height between opposite peaks - the distance from the mo...

**Depth justification:** Peak and peak-to-peak are combined because peak-to-peak is defined by reference to the peaks and the conversion between them is the whole of the mastery; taught apart, the second point would consist of nothing but the relationship to the first. The "twice the peak" relation is stated with its symmetrical-sine-wave qualification retained, because the evidence states it specifically for a sine wave.

**Explicit exclusions:**
- RMS and average values (see EMI-LP-20)
- Instantaneous values and the v = Vpk sin(theta) expression
- Crest factor and form factor
- Peak values of non-sinusoidal waveforms

**Representative application types:**
- A sinusoidal waveform has a peak value of 100 V. State its peak-to-peak value.
- An oscilloscope trace shows a waveform reaching +12 V and -12 V. State its peak and peak-to-peak values.

---

### `EMI-LP-20` -- RMS and average values of a sine wave, and what each one means

**Evidence readiness:** READY

**Learner outcome:** The learner will be able to explain what the RMS value of an AC waveform means, convert between RMS and peak values for a sine wave, and distinguish the half-cycle average value from the zero signed average over a complete cycle.

**Knowledge / procedure:** RMS (root-mean-square), also called the EFFECTIVE value, is the EQUIVALENT DC value of an AC quantity: the magnitude of DC voltage or current that would produce the SAME POWER DISSIPATION AND HEATING through an equal resistance. A 1 V RMS sine produces the same heating in a given resistor as 1 V DC. RMS is explicitly NOT the same thing as the average value -- it is a measure of how much work the AC source can do, and power in a resistor must be computed from RMS values, never from peak or peak-to-peak values. CONVERSIONS (PURE SINE WAVES ONLY): Vrms = 0.707 x Vpeak (0.707 being 1/root2), and Vpeak = 1.414 x Vrms (1.414 being root2). These constants hold only for pure sine waves; for non-sinusoidal or non-symmetric signals the RMS value departs from them and must be computed from the root-mean-square definition itself. THE TWO AVERAGES -- do not confuse them: (1) the SIGNED average over one COMPLETE cycle of a symmetrical waveform is ZERO, because the positive points cancel the negative points; (2) the PRACTICAL average, taken over ONE ALTERNATION (one half-cycle) or equivalently by treating all points as positive (the rectified average), is approximately 0.637 -- that is 2/pi, about 0.6366 -- times the peak value, i.e. 63.6% of peak. The 0.637 figure is a HALF-CYCLE/rectified quantity and is NOT the signed full-cycle average; and it is distinct again from the 70.7%-of-peak RMS value. CURRENT BEHAVES THE SAME WAY: the same peak/RMS/average relationships defined for voltage hold for current in a pure sine wave, so Irms = 0.707 x Ipeak, and the mean rate of energy dissipation in a resistor over a complete cycle is Irms^2 x R.

**Within-domain prerequisites:** `EMI-LP-19`

**Cross-domain prerequisites:** `FM-LP-04`, `FM-LP-13`

**Knowledge-target IDs:** `unit202::ACQ-140`, `unit202::ACQ-141`, `unit202::ACQ-142`, `unit202::ACQ-143`, `unit202::ACQ-145`, `unit202::ACQ-144`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::rms::EXACT_FACT` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::vrms-0-707-x-vpeak::RELATIONSHIP` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::vpeak-1-414-x-vrms::RELATIONSHIP` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::average-over-one-alternation-0-6366-x-vpeak::RELATIONSHIP` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::signed-average-of-a-complete-symmetrical-sine-wave-cycle-0::RELATIONSHIP` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::analogous-current-relationship-where-applicable::RELATIONSHIP` -- **VERIFIED**

**Normalized claim references:**
- SRC-LIBRETEXTS-FIORE-AC-1-2: RMS (root-mean-square), also called the effective value, is the equivalent DC value of an AC quantity: the mag...
- SRC-LIBRETEXTS-TATUM-EM-13-11: Mathematically the RMS value is obtained by squaring the instantaneous values, taking the mean over the period...
- SRC-MST-COTTRELL-BASIC-INSTRUMENTATION: RMS is explicitly NOT the same thing as the average value of the waveform; it is the measure of how much work ...
- SRC-LIBRETEXTS-FIORE-AC-1-2: For a PURE SINE WAVE the RMS (effective) value is 0.707 - that is, 1/√2 - times the peak value; this follows f...
- SRC-MST-COTTRELL-BASIC-INSTRUMENTATION: Worked instance: a sinusoidal waveform of 130 V peak has an RMS value of 91.9 V....
- SRC-LIBRETEXTS-FIORE-AC-1-2: For a pure sine wave the peak value is approximately 1.414 (i.e. √2) times the RMS value - stated by Fiore in ...
- SRC-MST-COTTRELL-BASIC-INSTRUMENTATION: Peak-reading (non-true-RMS) meters obtain the RMS reading from the measured peak value via a 1.414:1 divider, ...
- SRC-MST-COTTRELL-BASIC-INSTRUMENTATION: The average value of a sinusoidal waveform taken as the arithmetic average of the positive half of the cycle (...
- SRC-LIBRETEXTS-KUPHALDT-AC-1-03: The practical average value of an AC waveform, obtained by considering all points on the wave as positive quan...
- SRC-LIBRETEXTS-TATUM-EM-13-11: Taken algebraically - that is, retaining the sign of each instantaneous value - the average of a symmetrical A...
- SRC-LIBRETEXTS-KUPHALDT-AC-1-03: The signed full-cycle average being zero is the reason the 'average value' quoted for a sine wave (0.637 x pea...
- SRC-LIBRETEXTS-TATUM-EM-13-11: The same peak-to-RMS relationship that holds for voltage holds for current in a pure sine wave: for I = Î sin(...
- SRC-LIBRETEXTS-KUPHALDT-AC-1-03: The magnitude measures (peak, peak-to-peak, average, RMS) are defined for an AC quantity generally, and the RM...

**Depth justification:** Six requirements are combined because they form one tightly coupled set of facts about the SAME question -- "how big is this AC waveform?" -- and the principal learning hazard is precisely that learners conflate the three answers (RMS 0.707, half-cycle average 0.637, signed full-cycle average 0). Those three can only be distinguished if they are held side by side; splitting them into separate learning points would remove the contrast that makes each one meaningful and would practically guarantee the conflation. The current-analogous requirement is included here rather than duplicated as its own point because the evidence establishes it as the same relationships applied to current, not as new content. All sine-wave-only restrictions and the heating-equivalence meaning of RMS are carried as explicit knowledge content, per this batch's guardrails.

**Explicit exclusions:**
- Deriving the 1/root2 and 2/pi constants from the mean-square integral
- RMS of non-sinusoidal waveforms as a calculation outcome
- True-RMS versus averaging meter construction as an engineering topic
- Form factor and crest factor as named quantities
- Power-factor and reactive-power calculations (Batch 04 covers power factor)

**Representative application types:**
- A sinusoidal supply has a peak value of 340 V. Calculate its RMS value.
- A 230 V RMS supply is sinusoidal. Calculate its peak value.
- Explain why the average value of a complete sine-wave cycle is zero but its RMS value is not.
- State what the RMS value of an alternating current tells you about its heating effect.

---

### `EMI-LP-21` -- Carrying out sine-wave conversion calculations

**Evidence readiness:** READY

**Evidence readiness note (Stage 4 item 10 correction):** Previously held on a CALCULATION_METHOD breadth gap (worked method evidenced for peak-to-peak and RMS-from-peak, but not for the average-value or reverse peak-from-RMS directions). Corrected: this is an integration target, structurally satisfied by its already-verified constituent conversion relationships (all four factors are separately and fully VERIFIED in EMI-LP-20) plus the foundational calculation capability -- a separate published worked example for every algebraic direction is not required evidence once the relationships themselves and the general method (identify what is given/asked, apply the correct factor) are established.

**Learner outcome:** The learner will be able to carry out conversions between peak, peak-to-peak and RMS values for a sinusoidal waveform, selecting the correct conversion for the quantities given.

**Knowledge / procedure:** METHOD: (1) identify which value you have been given and which you are asked for; (2) apply the correct conversion. Peak-to-peak is obtained by subtracting the cycle minimum from the cycle maximum (worked: a waveform with +130 V and -130 V peaks has a peak-to-peak value of 260 V). RMS is obtained for a sinusoid by multiplying the peak value by 0.707 (worked: a sinusoidal waveform of 130 V peak has an RMS value of 91.9 V -- the value a typical multimeter reads in AC mode). Peak is obtained from RMS by multiplying by 1.414. IMPORTANT RESTRICTION: peak, peak-to-peak, average and RMS are alternative expressions of a waveform's magnitude related by FIXED conversion constants, but those constants hold true only for PURE forms of the named waveshapes. For a non-sinusoidal waveform these conversions do not apply.

**Within-domain prerequisites:** `EMI-LP-19`, `EMI-LP-20`

**Cross-domain prerequisites:** `FM-LP-04`, `FM-LP-13`

**Knowledge-target IDs:** `unit202::ACQ-146`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::appropriate-sine-wave-conversions-calculations::PROCEDURE_COVERAGE` -- **STRUCTURALLY_SATISFIED** (integration target; satisfied by EMI-LP-20's constituent conversion relationships plus the foundational calculation capability)

**Normalized claim references:**
- SRC-MST-COTTRELL-BASIC-INSTRUMENTATION: Sine-wave conversion method: peak-to-peak is obtained by subtracting the cycle minimum from the cycle maximum ...
- SRC-LIBRETEXTS-KUPHALDT-AC-1-03: Peak, peak-to-peak, average and RMS are alternative expressions of an AC waveform's magnitude related by fixed...

**Depth justification:** Separated from EMI-LP-20 as a procedural/calculation mastery rather than a conceptual one. The distinction is diagnosable and practically important: a learner may be able to explain correctly what RMS means and still pick the wrong conversion constant, or apply a sine-wave constant to a square wave. This point is where the selection and execution of the conversion is practised, on the understanding established in EMI-LP-20.

**Explicit exclusions:**
- Deriving the conversion constants
- Conversions for non-sinusoidal waveforms -- excluded and explicitly flagged as invalid
- Instantaneous-value calculations requiring trigonometry
- Power calculations from the converted values

**Representative application types:**
- An oscilloscope shows a sine wave of 340 V peak-to-peak. Calculate its RMS value.
- A multimeter reads 110 V RMS on a sinusoidal supply. Calculate the peak-to-peak value.
- Explain why the 0.707 factor must not be used on a square wave.

---

### `EMI-LP-22` -- Generated frequency, pole pairs and rotational speed

**Evidence readiness:** READY

**Evidence readiness note (Stage 1.1/4.11/4.12 correction):** Previously held with all three underlying requirements PARTIALLY_VERIFIED. Corrected: (1) `rotational-frequency-pole-pairs-relationship` is VERIFIED -- its multi-passage compounding (MIT 6.685's angular-form relation plus its own pole-pairs definition, connected by the elementary omega=2*pi*f identity) is legitimate multi-source composition, not a reason to downgrade. (2) `equivalent-rpm-relationship` is VERIFIED as a disclosed algebraic derivation (N = n_rpm/60 substituted into the now-verified base relationship) via the same foundational rearrangement capability already accepted elsewhere in this qualification -- not a second technical-domain source requirement. The pole-pairs-vs-total-poles difference is confirmed to be equivalent notation once P_total = 2 x P_pairs is applied, per the Product Architect's accepted pole-pair-convention decision -- not a technical conflict. (3) `appropriate-simple-ac-generation-calculations` is now a structurally-satisfied integration target (see below), not a standalone breadth gap for EMF-magnitude calculation, which is itself a separate, independently-evidenced relationship.

**Learner outcome:** The learner will be able to calculate the frequency generated by an alternator from its rotational speed and its number of pole pairs.

**Knowledge / procedure:** One full mechanical rotation of a two-pole (one pole-PAIR) alternator produces one complete sine wave. A four-pole (two pole-pair) machine produces two complete sine waves per revolution. The number of cycles generated per revolution therefore equals the number of POLE PAIRS. This gives f = N x P, where f is the frequency in hertz, N is the rotational speed in revolutions per SECOND, and P is the number of POLE PAIRS (not the total number of poles). When the speed is given in revolutions per MINUTE it must first be divided by 60, giving the equivalent form f = n_rpm x P / 60. METHOD for a simple AC-generation calculation: (1) convert the machine's rotational speed from rev/min to rev/s by dividing by 60; (2) determine the number of pole pairs; (3) multiply. CONVENTION WARNING: sources differ. Some write this relationship using the TOTAL number of poles instead of pole pairs, in the forms f = P_total x N / 120 or synchronous speed n_s = 120f / P_total. Those are equivalent only because P_total = 2 x P_pairs. Always check which convention a formula uses before substituting, because using total poles in a pole-pair formula doubles the answer.

**Within-domain prerequisites:** `EMI-LP-18`, `EMI-LP-17`

**Cross-domain prerequisites:** `FM-LP-13`, `FM-LP-16`

**Knowledge-target IDs:** `unit202::ACQ-131`, `unit202::ACQ-132`, `unit202::ACQ-133`, `unit202::ACQ-134`

**Evidence-requirement IDs and their status:**
- `ER::provisional::unit202::electromagnetism-and-induction::rotational-frequency-pole-pairs-relationship::FORMULA_OR_RULE` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::equivalent-rpm-relationship-f-n-rpm-x-p-60::RELATIONSHIP` -- **VERIFIED**
- `ER::provisional::unit202::electromagnetism-and-induction::appropriate-simple-ac-generation-calculations::PROCEDURE_COVERAGE` -- **STRUCTURALLY_SATISFIED** (integration target; satisfied by the two requirements above plus the foundational calculation capability)

**Normalized claim references:**
- SRC-MITOCW-6685-CH8: In an AC machine the electrical rotation speed equals the number of pole pairs multiplied by the mechanical ro...
- SRC-LIBRETEXTS-FLINN-3-05: One full mechanical rotation of the armature creates one full sine wave on a two-pole (one pole-pair) alternat...
- SRC-SIU-ET332B-LESSON17: Synchronous speed n_s = 120 f / P, where f is the power-system frequency in Hz and P is the number of motor po...
- SRC-LIBRETEXTS-FLINN-3-05: Procedure for a simple AC-generation frequency calculation: (1) convert the machine's rotational speed from re...

**Depth justification:** The formula, its rpm variant and the calculation procedure are combined because the rpm form is the same relationship with a unit conversion folded in, and the procedure is simply applying it -- three separate learning points would teach one relationship three times. The pole-pairs-versus-total-poles warning is carried as explicit knowledge content rather than hidden, because it is a genuine cross-source conflict that will otherwise produce silent factor-of-two errors.

**Explicit exclusions:**
- Synchronous motor and induction motor speed/slip calculations as a topic in their own right
- Machine construction, winding arrangements and pole design
- Variable-frequency drives and frequency conversion
- Why the relationship holds, beyond the cycles-per-revolution argument

**Representative application types:**
- A four-pole alternator runs at 1500 rev/min. Calculate the frequency it generates.
- State how many pole pairs a six-pole machine has.
- A two-pole alternator must generate 50 Hz. Calculate the required speed in rev/min.
- Explain why it matters whether a formula uses pole pairs or total poles.

---
