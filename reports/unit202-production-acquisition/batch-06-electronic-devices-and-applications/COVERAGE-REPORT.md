# Batch 06 -- Electronic Devices and Applications: Coverage Report

## Scope

40 requirements / 40 unique `evidenceRequirementId`s were taken from the frozen
`reports/backtests/unit202-evidence-acquisition-preflight/UNIT202-EVIDENCE-REQUIREMENT-PLAN.json`
(all with `canonicalRequirementKey` containing `::electronic-devices-and-applications::`). Requirement metadata
is copied mechanically from the frozen plan during assembly rather than transcribed, so it cannot drift. Exact
40-ID set equality against the frozen plan is proved by the batch validation script and holds.

Work proceeded through four parallel research clusters:

| Cluster | Scope | Requirements |
|---|---|---|
| B06-A | Passive and basic semiconductor component operating principles + resistor colour code | 12 |
| B06-B | Thyristor family principles and component recognition (symbols and physical appearance) | 5 |
| B06-C | Dimmer, heating/boiler control and motor-control applications | 11 |
| B06-D | Security alarm, legacy PSTN telephone, and wireless-control applications | 12 |
| **Total** | | **40** |

## Evidence status totals

**27 VERIFIED, 12 PARTIAL, 1 GAP.**

Unlike Batch 05, **this batch returned ZERO authority-class violations** -- every citation already sat within its
own requirement's permitted classes.

| Requirement | Status | Why |
|---|---|---|
| `dimmer-exact-rc-timing-implementation-component-values::EXACT_FACT` | PARTIAL | What is missing is authoritative evidence identifying the specific dimmer circuit the qualification content refers to. |
| `heating-exact-transistor-relay-topology::EXACT_FACT` | PARTIAL | What is missing is authoritative evidence of the exact transistor/relay arrangement in the specific heating circuit the qualification refers to: which transistor type and configuration (common-emitter low-side switch vs high-side vs Darlington), the exact base/bias resistor arrangement, whether the relay contacts switch the boiler/heating load directly or via a further contactor, and the exact protection components. |
| `motor-bridge-rectifier-converts-ac-to-dc::EXACT_FACT` | PARTIAL | DISCLOSED COMPOUNDING: no single retrieved passage states the complete claim 'in a motor application, a bridge rectifier converts AC to DC'. |
| `physical-photo-appearance-recognition-of-each-component::SCHEMATIC_OR_DIAGRAM_RECOGNITION` | PARTIAL | BREADTH GAP. |
| `schematic-symbol-recognition-for-each-named-ac6-2-component-device-family-at-qualification-depth::SYMBOL_OR_CONVENTION` | PARTIAL | 13 of the 15 Unit 202 component families have a named, directly-read graphic symbol in the retrieved standard: resistor (2. |
| `security-alarm-exact-nc-contact-bias-topology::EXACT_FACT` | GAP | No authoritative source was found and read that states an exact normally-closed contact / bias topology for any specific, identified security alarm circuit. |
| `security-alarm-scr-thyristor-latching-sounder-role::EXACT_FACT` | PARTIAL | The LATCHING half of the requirement is fully and explicitly supported, including the holding-current condition and the fact that latching persists after the gate signal is removed. |
| `security-alarm-transistor-switching::EXACT_FACT` | PARTIAL | The generic framing required by the guardrail - the transistor operating as a switch (saturated/off), NOT as a linear amplifier - is explicitly and verbatim supported, and the source itself makes the amplifier-vs-switch contrast. |
| `telephone-capacitor-ringer::EXACT_FACT` | PARTIAL | What IS evidenced: the existence, value (1. |
| `telephone-master-secondary-socket-details::EXACT_FACT` | PARTIAL | Status is PARTIAL because the full picture rests on a disclosed compounding of two separate Openreach documents (SIN 351 for the electrical/contact detail, the Copper handbook for the physical master-vs-extension arrangement). |
| `telephone-resistor-line-testing::EXACT_FACT` | PARTIAL | The two halves of this requirement are each evidenced, but the CAUSAL LINK between them is not. |
| `telephones-application-category-function::EXACT_FACT` | PARTIAL | PARTIAL because the answer rests on a disclosed compounding of two sources, AND because both define the SERVICE and the NETWORK rather than the DEVICE. |
| `thermistor-basic-operating-principle::EXACT_FACT` | PARTIAL | COMPOUNDING DISCLOSED: no single read passage covers both NTC and PTC behaviour with their directions. |

## The dominant finding: a specification ambiguity in the frozen plan

**Four requirements demand an EXACT circuit topology or exact component values, but none of them names a circuit,
a figure or a source document.** There is therefore no determinate object against which retrieved material can be
checked, and no amount of further searching would resolve it:

- `dimmer-exact-rc-timing-implementation-component-values`
- `heating-exact-transistor-relay-topology`
- `security-alarm-exact-nc-contact-bias-topology` (the one **GAP**)
- and, by propagation, `security-alarm-scr-thyristor-latching-sounder-role` and
  `security-alarm-transistor-switching`, which presuppose the same unnamed alarm circuit

**These were deliberately not resolved by inference.** Exact dimmer values *were* found and are recorded verbatim
-- but the single manufacturer note relied upon gives **four mutually inconsistent value sets** across its own
figures, and a second manufacturer implements the same function with **no RC network at all** because timing is
done in firmware. Choosing one would be an editorial decision presented as a fact. For the heating topology, the
only authoritative circuit found is a **generic** relay driver that its own source scopes to *industrial and
automotive* use, never heating -- and, tellingly, the authoritative *heating* circuits that were located are
**thyristor-switched, not relay-switched**, so the generic evidence may not even concern the right device family.
For the alarm, the familiar NC-loop-plus-end-of-line-resistor pattern appears only on vendor blogs, installer
marketing and DIY sites; all were excluded as outside the permitted authority classes and appear **nowhere** in
these artifacts.

The structural response was to **isolate** each exact requirement into its own learning point
(`EDA-LP-19`, `EDA-LP-21`, `EDA-LP-25`) carrying **no taught content**, so that the well-evidenced conceptual
content beside it (`EDA-LP-18` dimmer phase control, `EDA-LP-20` heating controls, `EDA-LP-24` alarm function)
remains deliverable rather than being blocked.

Note that the dimmer and heating exact requirements are **`OPTIONAL_CONTEXT`** priority in the frozen plan, so
descoping them is a legitimate option open to the Product Architect.

## Sources

46 sources are registered, all genuinely opened and read. `supportsRequirementSuffixes` is derived
mechanically from actual citations, so the register cannot over-claim.

**No `PRIMARY_NORMATIVE_OR_STANDARDS_BODY` source was reachable anywhere in this batch.** IEC Electropedia
returned 403 on every attempt (including IEV 551-12-07 "rectifier", which would likely have upgraded the
bridge-rectifier result); IEC 60062 (the normative resistor colour-code standard) is paywalled; BS EN 50131 sits
behind the BSI paywall; Britannica returned 403 throughout. Several manufacturer application notes were read from
**third-party university-hosted mirrors** after the publishers returned 403/429 -- the host is disclosed on every
affected source record, each document self-identifies via its own front matter and page footers, and each carries
a re-verify-before-publication caveat.

Where fetch returned only PDF stream markers, files were downloaded and read as **rendered page images**; every
symbol table, figure and datasheet passage cited was actually viewed.

## Depth guardrail compliance

- **Device families kept distinct.** Separate learning points for diode (`EDA-LP-04`), LED (`-05`), Zener
  (`-06`), photodiode (`-07`), LDR (`-08`), thermistor (`-09`), transistor (`-10`), SCR (`-11`),
  TRIAC (`-12`) and DIAC (`-13`), each naming its distinguishing property.
- **SCR unidirectional and latching**, with the precise turn-off condition (principal current below the holding
  current) rather than the looser "until the supply is removed" -- a genuine source conflict resolved toward the
  manufacturer's exact criterion.
- **TRIAC bidirectional**; **DIAC a two-terminal, gateless, bidirectional TRIGGER device**, explicitly not to be
  confused with the TRIAC it fires.
- **Rectifier converts AC to DC**, with the honest qualification that a rectifier alone gives **pulsating** DC,
  not smooth DC.
- **Inverter converts DC to AC**, taught against the rectifier -- and explicitly **not** defined only as a
  variable-speed drive.
- **Capacitor stores charge and energy in the ELECTRIC FIELD**, not in the plates.
- **Resistor opposes and limits current and dissipates energy as heat**, with Ohm's law qualified to the range
  over which resistance is effectively constant.
- **LDR resistance DECREASES as illumination increases** -- stated emphatically, since reversing it is the
  characteristic error.
- **NTC and PTC thermistors distinguished** (`EDA-LP-09`), including the evidenced PTC scope limitation that its
  resistance only rises sharply *above the Curie point*. No claim that all thermistors behave one way.
- **Photodiode qualified by operating mode** (zero-bias/photovoltaic versus reverse-biased/photoconductive).
- **LED emits light when appropriately FORWARD BIASED**; **Zener regulation scoped to reverse breakdown**.
- **Four-band colour code complete** (`EDA-LP-02`): orientation, both significant digits, multiplier, tolerance,
  the full black-0 to white-9 mapping, gold/silver as both fractional multipliers and tolerances, the no-fourth-
  band ±20% case, the calculation method, and three worked examples.
- **Recognition based on typical appearance, markings and context** -- with the evidenced caveat that **package
  outline alone does NOT determine the component family** (TO-92 houses both bipolar transistors and thyristors).
  No appearance evidence was invented, and no photographs were retrieved.
- **Mains safety:** dimmer and heating treatment is function and conceptual topology only. **No construction or
  wiring instruction of any kind is recorded**, and the manufacturer value tables are flagged as design-reference
  data rather than build guidance.
- **Telephone content is UK legacy analogue PSTN throughout**, with jurisdiction and era carried on every claim.
  Nothing generalised to VoIP or digital voice; no US practice used.
- **Wireless kept at practical application level**; radio engineering, modulation and protocol comparison excluded.
- **Excluded throughout:** semiconductor physics, detailed bias design, mains construction instructions, advanced
  radio engineering, PWM/VFD/field-oriented control.

## Proposed learning-point summary

29 proposed learning points (`EDA-LP-01` through `EDA-LP-29`), all
`status: PROPOSED_FOR_PA_REVIEW` -- none accepted, frozen or identity-locked.
**19 READY, 10 HELD_PENDING_EVIDENCE_CORRECTION.**

Every requirement maps to exactly one learning point (proved by the validation script). Readiness is derived
mechanically from the underlying evidence statuses, and the generator refuses to emit a learning point marked
READY over PARTIAL or GAP evidence.

The held learning points are:

- `EDA-LP-09` (Thermistor: basic operating principle, and the NTC/PTC distinction) -- Underlying evidence is PARTIAL on DISCLOSED COMPOUNDING.
- `EDA-LP-16` (Recognising the schematic symbols for Unit 202 components) -- Underlying evidence is PARTIAL on BOTH BREADTH and STANDARD CURRENCY, and this learning point must not be published as-is without a Product Architect decision.
- `EDA-LP-17` (Recognising components by their physical appearance) -- Underlying evidence is PARTIAL on BREADTH, and this learning point covers only part of the component set.
- `EDA-LP-19` (Dimmer: exact RC timing implementation and component values) -- Underlying evidence is PARTIAL, and the root problem is a SPECIFICATION AMBIGUITY that only the Product Architect can resolve.
- `EDA-LP-21` (Heating: exact transistor/relay switching topology) -- Underlying evidence is PARTIAL, with the same SPECIFICATION AMBIGUITY problem as EDA-LP-19: the frozen requirement names no figure, circuit or source document, so there is no determinate topology to verify.
- `EDA-LP-23` (Motor drives: the bridge rectifier converting AC to DC) -- Underlying evidence is PARTIAL on DISCLOSED COMPOUNDING.
- `EDA-LP-25` (Security alarm circuit: NC loop, transistor switching and SCR latching) -- One underlying requirement is a GAP and two are PARTIAL.
- `EDA-LP-26` (The legacy UK analogue PSTN and what a telephone service is) -- The legacy-PSTN framing requirement is fully VERIFIED from Ofcom and Openreach sources.
- `EDA-LP-27` (The UK master socket and extension sockets) -- Underlying evidence is PARTIAL on TERMINOLOGY and BREADTH.
- `EDA-LP-28` (Inside the UK master socket: ringer capacitor, line-test resistor and surge protector) -- Two of the three underlying requirements are PARTIAL, and the shortfall is specifically about FUNCTION rather than presence.

## Matters flagged for the consolidated Product Architect review

1. **The specification ambiguity above** is the headline item: four requirements name no circuit. Decide whether
   a specific course circuit must be supplied, whether they should be rewritten in general-behaviour terms, or
   whether the two `OPTIONAL_CONTEXT` ones should be descoped.
2. **No normative source anywhere in this batch** (IEC, BSI, Britannica all blocked or paywalled).
3. **Symbol evidence is from the 1975 ANSI/CSA/IEEE standard, not current BS EN 60617** -- and it covers 13 of 15
   families, with **no LED symbol** and **no distinct inverter symbol**. A UK qualification would normally expect
   BS EN 60617. `EDA-LP-16` must not be published as-is without this decision.
4. **No photographs were retrieved for appearance recognition**, and only 4 of 15 families have any appearance
   evidence at all. `EDA-LP-17` likely needs commissioned or licensed photographic material.
5. **Master-socket component FUNCTIONS are unevidenced.** Openreach establishes that the 1.8 µF capacitor and
   470 kΩ resistor are present and how they are connected, but **not** that the capacitor passes ringing current
   to the ringer or that the resistor serves line testing. Both are widely repeated and both are excluded here.
6. **Terminology mismatch:** the frozen requirement says "secondary socket"; Openreach says only "extension
   socket". And no source describes an extension socket's internals.
7. **Currency conflict on the telephone surge protector:** many (excluded) sources claim sockets have omitted the
   arrester since around 2012, while the current Openreach SIN still specifies one.
8. **Contact-versus-IDC numbering hazard:** the same shunt/bell connection is IDC 3 on extension wiring but
   contact 4 on the master socket. Downstream content referring to "pin 3" without qualification will be wrong.
9. **PSTN retirement by 31 January 2027** makes this entire telephone topic time-limited; confirm it should
   remain in scope.
10. **Third-party mirrors** were used for several manufacturer application notes; re-verify against publisher
    originals before publication.

## Validation

Run `node validate-batch.js` (see the consolidated review pack) for the deterministic checks: exact 40-ID set
equality with the frozen plan; no duplicate or omitted requirement IDs; valid JSON throughout; every cited source
and normalized-claim reference resolves; every cited authority class permitted by its own requirement;
prerequisite references resolve with no cycles; Markdown and JSON learning-point inventories agree; and no
learning point marked READY over non-VERIFIED evidence.
