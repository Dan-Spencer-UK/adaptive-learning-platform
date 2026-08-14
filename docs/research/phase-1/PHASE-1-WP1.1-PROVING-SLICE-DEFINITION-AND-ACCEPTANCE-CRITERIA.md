# Phase 1 — WP1.1: Proving Slice Definition & Acceptance Criteria

**Status:** Draft v0.2 for Product Owner review  
**Date:** 14 August 2026  
**Phase:** Phase 1 — Architecture & End-to-End Proving Slice  
**Market:** United Kingdom  
**Initial qualification context:** City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02)  
**Primary unit:** Unit 202 — Principles of Electrical Science  
**Primary assessment:** 602 — Principles of Electrical Science online multiple-choice test

---

# 1. Purpose

WP1.1 defines the bounded subject domain that Phase 1 will use to prove the platform's core learning architecture.

The objective is not to build complete Unit 202 coverage.

The objective is to choose a sufficiently rich connected body of knowledge that can genuinely test whether the platform can:

- represent knowledge at assertion level;
- preserve exact curriculum/source provenance;
- model prerequisites across Foundational Maths, Foundational Physics and Electrical;
- represent multiple plausible misconceptions;
- collect overlapping learner evidence;
- distinguish domain weakness from foundational weakness;
- target remediation at the probable root cause;
- retest the underlying skill;
- verify transfer back into Electrical;
- update a persistent learner model;
- support both rapid pass-focused feedback and deeper teaching from the same underlying intelligence.

The proving slice must be large enough that diagnosis cannot succeed merely because the test has only one plausible explanation for each error.

---

# 2. Source baseline

The primary source for this work package is the current City & Guilds qualification handbook:

**City & Guilds Level 2 Diploma in Electrical Installations (Buildings and Structures) (2365-02), Qualification Handbook, Version 1.12, April 2026.**

Official source:

https://www.cityandguilds.com/-/media/productdocuments/building_services_engineering/electrical_installation/2365/2365_level_2/centre_documents/2365-02_l2_electrical_installation_qualification_handbook_v1-12-pdf.pdf

The current City & Guilds qualification page is:

https://www.cityandguilds.com/qualifications-and-apprenticeships/building-services-industry/electrical-installation/2365-electrotechnical-craft

A useful nomenclature clarification is required.

The curriculum unit remains:

> **Unit 202 — Principles of Electrical Science**

The associated online assessment is:

> **602 — Principles of Electrical Science**

Therefore this project should refer to the curriculum unit as **Unit 202** and to the assessment as **Test 602** unless a source specifically uses another identifier.

The handbook gives Unit 202:

- Level 2;
- credit value 10;
- 89 guided learning hours;
- six learning outcomes;
- assessment by a 90-minute, 40-question, closed-book online multiple-choice test;
- a non-programmable calculator is permitted;
- approximate pass boundary 50%.

The official assessment weighting is:

- Outcome 1 — mathematical principles: **5% / 2 questions**
- Outcome 2 — units and measurement: **13% / 5 questions**
- Outcome 3 — mechanics, force, work, energy and power: **18% / 7 questions**
- Outcome 4 — resistance, resistivity, voltage, current and power: **37% / 15 questions**
- Outcome 5 — magnetism and electricity: **17% / 7 questions**
- Outcome 6 — electronic components: **10% / 4 questions**

Outcome 4 is therefore the largest single assessed area and is especially suitable for a proving domain, but assessment weighting alone must not determine the slice.

---

# 2.1 SmartScreen teaching-pack review

In addition to the qualification handbook and sample assessment papers,
WP1.1 reviewed the supplied 2018 City & Guilds SmartScreen teaching pack:

- sample scheme of work;
- 18 learner handouts;
- 18 PowerPoint presentations;
- 18 tutor worksheets/answer guides;
- sample-question sets A and B.

The detailed review concentrated on Sessions 1–8 and 14–15 because
these contain the knowledge most relevant to the proposed proving
domain.

The supplied SmartScreen material is copyrighted City & Guilds material.
It is a development/reference input. It must not be copied into the
production knowledge corpus merely because it is available to the
Product Owner.

The materials are useful here for three distinct purposes:

1. establishing the **expected instructional depth** beneath the terse
   qualification handbook;
2. exposing the **problem types and calculation chains** learners are
   expected to handle;
3. identifying candidate **prerequisites, strategies, misconceptions
   and diagnostic probes**.

## Session-level findings relevant to the proving slice

### Session 1 — Principles of electricity

The teaching pack goes beyond simple terminology and links:

- basic electron theory;
- current as electron flow in a complete circuit;
- conductor/insulator behaviour;
- thermal and chemical effects of current;
- general SI quantities;
- specifically electrical quantities and their units/symbols.

This supports retaining a small conceptual Electrical-foundations layer
rather than treating the proving slice as calculations only.

### Session 2 — Mathematical principles

The pack explicitly teaches:

- vulgar fractions;
- decimal fractions;
- percentages;
- algebra;
- transposition/changing the subject;
- indices;
- scientific notation;
- engineering notation;
- triangles/Pythagoras;
- trigonometry;
- basic statistics.

It also teaches **formula triangles** as a practical method for selecting
or rearranging simple three-variable Electrical relationships.

For the proving slice, not all of Session 2 is required. However,
fractions/reciprocals, decimals, algebra, transposition, indices,
scientific/engineering notation and unit-prefix handling have direct
diagnostic relevance.

### Session 3 — Ohm's law

The material explicitly distinguishes:

- current;
- EMF/voltage;
- resistance;
- their units and symbols;
- direct proportionality between current and voltage;
- inverse proportionality between current and resistance;
- calculation of any of V, I or R.

The worksheet repeatedly varies which quantity is unknown. This is
valuable because the same conceptual relationship can generate evidence
about:

- relationship understanding;
- formula selection;
- rearrangement strategy;
- arithmetic;
- units.

### Session 4 — Resistors in series

The material teaches:

- total series resistance as the sum of component resistances;
- a method for obtaining total current;
- current being the same throughout a series circuit;
- voltage drop across individual resistances;
- Kirchhoff's voltage law;
- multi-step calculations combining all of the above.

The worksheets also deliberately mix Ω, mΩ, kΩ and MΩ values. This makes
prefix conversion a real prerequisite rather than an artificial
diagnostic feature invented by the project.

### Session 5 — Resistors in parallel

The material teaches:

- reciprocal calculation of total resistance;
- special-case formula for two parallel resistors;
- equal-value parallel-resistor shortcut;
- total parallel resistance being less than the smallest branch
  resistance;
- voltage being common across parallel branches;
- branch current depending on resistance;
- Kirchhoff's current law;
- multi-step verification of current relationships.

This substantially strengthens the case for including a bounded
parallel-circuit cluster in Phase 1. It introduces **reciprocal/fraction
reasoning**, circuit-structure reasoning and useful plausibility checks
that can distinguish mathematical from Electrical misconceptions.

### Session 6 — Power

The material teaches electrical power as the rate of doing electrical
work and uses:

- P = VI;
- P = I²R;
- P = V²/R;

with derivation of the latter relationships by substitution from Ohm's
law.

The worksheet requires learners to move among power, voltage, current
and resistance and includes practical power-loss/wasted-power contexts.

This is particularly valuable for distinguishing a learner who merely
memorises one formula from a learner who understands the relationships
well enough to select or derive an appropriate form.

### Session 7 — Resistivity and voltage drop

This is more diagnostically valuable than the curriculum heading alone
suggests.

The material develops resistance as dependent on:

- conductor length;
- cross-sectional area;
- material/resistivity;
- temperature.

It explicitly teaches:

- direct proportionality of resistance to length;
- inverse proportionality of resistance to cross-sectional area;
- resistivity as a material property;
- R = ρL/A;
- scientific notation;
- unit conversion between mm² and m²;
- conductor resistance contributing to circuit voltage drop;
- combined cable/load calculations.

The worksheet includes rearranging the resistivity relationship to find
different unknowns, plus voltage-drop and maximum-length problems.

This creates an unusually rich intersection of Maths, Physics/material
properties and Electrical application. A **bounded subset of resistivity
must therefore remain inside the proving domain**, rather than being
treated as optional peripheral content.

### Session 8 — Connection of meters

The material maps quantities to measurement methods:

- ammeter/current;
- voltmeter/voltage;
- wattmeter/power;
- ohmmeter/resistance;
- energy meter/energy.

The full instrument-connection lesson is not required for the root-cause
proving slice, but a small set of quantity↔unit↔instrument assertions can
provide useful conceptual evidence independent of calculation ability.

### Sessions 14–15 — Mechanics, work, energy, power and efficiency

The supplied presentation/worksheet material distinguishes:

- mass and weight;
- force;
- work;
- energy;
- power;
- efficiency;

and includes multi-step mechanical power/efficiency calculations.

For Phase 1, the whole mechanics domain would create unnecessary scope.
The useful part is the **transfer bridge**:

- work/energy;
- power as a rate;
- efficiency;
- selected mechanical power calculations.

Mass, weight and force should be included only to the extent needed by
specific transfer questions. Levers, gears and pulleys remain outside
the deep proving slice.

## Consequence

The supplied teaching pack supports the chosen proving domain, but
refines it from a generic "DC circuits + power" slice into a network
with four deliberately overlapping calculation/concept families:

1. **V-I-R / Ohm's law**
2. **series and parallel DC circuits**
3. **electrical power**
4. **resistivity / conductor voltage drop**

supported by a deliberately bounded **mechanical work-energy-power
transfer bridge**.

This is rich enough to create repeated evidence about the same
Foundational Maths capabilities in substantially different Electrical
contexts.

---

# 3. Curriculum-level map of Unit 202

This is a high-level map only.

It deliberately does not yet decompose the whole unit into atomic knowledge assertions.

## Outcome 1 — Mathematical principles

Curriculum scope includes:

- fractions and percentages;
- algebra;
- indices;
- transposition;
- triangles and trigonometry;
- statistics.

**Horizontal-domain interpretation:** much of this belongs canonically in Foundational Maths rather than being duplicated as "Electrical Maths".

## Outcome 2 — Units and measurement

Curriculum scope includes general SI measurement concepts associated with:

- length;
- area;
- volume;
- mass;
- density;
- time;
- temperature;
- velocity.

Electrical quantities include:

- resistance;
- resistivity;
- power;
- frequency;
- current;
- voltage;
- energy;
- impedance;
- inductance / inductive reactance;
- capacitance / capacitive reactance;
- power factor.

The learner must also identify suitable instruments for measuring electrical quantities such as resistance, power, current, voltage and energy.

**Horizontal-domain interpretation:** quantity, unit, dimensional meaning, prefixes and conversion should be modelled so they can be reused outside Electrical.

## Outcome 3 — Basic mechanics; force, work, energy and power

Curriculum scope includes:

- mass versus weight;
- levers;
- gears;
- pulleys;
- force;
- work;
- kinetic energy;
- potential energy;
- power;
- efficiency;
- calculations involving mechanical energy, power and efficiency.

**Horizontal-domain interpretation:** this is a strong Foundational Physics domain and provides an unusually useful transfer opportunity because the concept of power appears in both mechanical and electrical contexts.

## Outcome 4 — Resistance, resistivity, voltage, current and power

Curriculum scope includes:

- basic electron theory;
- conductors and insulators;
- resistance;
- resistivity;
- relationships among current, voltage and resistance;
- series DC circuits;
- parallel DC circuits;
- calculations of current, voltage and resistance;
- electrical power;
- voltage drop;
- chemical effects of current;
- thermal effects of current.

This outcome represents **37% of Test 602**.

It is the strongest candidate centre of gravity for the proving slice.

## Outcome 5 — Magnetism and electricity

Curriculum scope includes:

- attraction and repulsion;
- magnetic flux;
- flux density;
- magnetic effects of electrical current;
- magnetic fields;
- force on a current-carrying conductor;
- electromagnetism;
- electromotive force;
- single-loop AC generation;
- sine waves;
- frequency;
- RMS;
- average;
- peak-to-peak;
- periodic time;
- amplitude.

This is a rich domain, but its prerequisite structure is somewhat different from the arithmetic/algebra/unit-conversion diagnostic problem we most urgently need to prove.

## Outcome 6 — Electronic components

Curriculum scope includes functions, applications and basic operating principles of components/devices including:

- capacitors;
- resistors;
- rectifiers;
- diodes;
- Zener devices;
- LEDs;
- photo-sensitive devices;
- thermistors;
- diacs;
- triacs;
- transistors;
- thyristors;
- inverters.

Again, this is useful later but less suitable as the principal Phase 1 diagnostic proving domain.

---

# 4. Revised proving-slice size

The original Phase 0 planning range of approximately **20–50 assertions** is too small for the intended diagnostic claim.

That size could prove:

- schema viability;
- provenance;
- basic prerequisite linking;
- simple question mapping.

It risks failing to prove genuine root-cause discrimination because each learner error may have only one obvious explanatory path.

## Revised planning range

Phase 1 should instead build:

> **approximately 80–150 approved, sufficiently atomic, connected knowledge assertions across Foundational Maths, Foundational Physics and Electrical.**

This remains a planning range, not a quota.

The slice should stop growing when it is diagnostically sufficient.

It should grow beyond 150 only if a specific missing dependency prevents a fair test of the learning-engine thesis.

## More important than assertion count

The proving domain must contain:

- overlapping prerequisites;
- shared prerequisites used by multiple Electrical problem families;
- competing plausible root causes;
- misconception mappings;
- diagnostic probes;
- repeated evidence opportunities;
- foundational remediation;
- near transfer;
- far/novel transfer within the chosen Level 2 scope.

A graph of 100 poorly connected assertions is less useful than 80 strongly connected assertions with meaningful evidence paths.

---

# 5. Candidate proving domains considered

Four candidate slices are identified from Unit 202.

## Candidate A — DC electrical quantities and circuit relationships

### Core Electrical scope

- current;
- voltage;
- resistance;
- resistivity at introductory level;
- Ohm-type relationships;
- series circuits;
- parallel circuits;
- electrical power;
- voltage drop concept;
- electrical quantities and units.

### Maths dependencies

- arithmetic;
- multiplication and division;
- decimals;
- fractions where relevant;
- ratios/proportion;
- algebra;
- substitution;
- formula transposition;
- powers/indices where relevant;
- prefixes;
- unit conversion.

### Physics dependencies

- physical quantity versus unit;
- energy;
- power;
- proportional relationships;
- potentially basic charge/current meaning.

### Diagnostic richness

**Very high.**

The same wrong numerical answer can plausibly arise from:

- incorrect Electrical concept;
- wrong relationship/formula;
- poor formula transposition;
- substitution error;
- arithmetic error;
- prefix conversion error;
- quantity/unit confusion;
- series/parallel misconception;
- failure to interpret the wording of the problem.

### Assessment relevance

**Very high.**

Outcome 4 alone accounts for 37% of Test 602, while Outcomes 1 and 2 directly support it.

### Verdict

**Strong candidate.**

## Candidate B — Energy, power and efficiency across mechanical and electrical contexts

### Core scope

- work;
- energy;
- kinetic/potential energy;
- power;
- efficiency;
- electrical power;
- potentially electrical energy.

### Maths dependencies

- multiplication/division;
- ratios;
- percentages;
- formula transposition;
- units/prefixes.

### Physics dependencies

- work;
- energy;
- power;
- efficiency;
- transfer/conservation concepts at the level required.

### Diagnostic richness

**Very high**, particularly for cross-domain transfer.

A learner can demonstrate whether "power" is understood as a transferable physical concept rather than memorised as an Electrical formula.

### Assessment relevance

High: Outcome 3 is 18%, and power also appears in Outcome 4.

### Limitation

Narrower for testing series/parallel circuit reasoning and quantity-specific Electrical misconceptions.

### Verdict

**Excellent supporting cluster rather than sole proving domain.**

## Candidate C — Magnetism, electromagnetism and AC generation

### Core scope

- magnetic fields;
- flux;
- flux density;
- electromagnetism;
- force on conductor;
- EMF;
- AC generation;
- sine-wave characteristics;
- frequency.

### Maths dependencies

- arithmetic;
- frequency/period relationships;
- potentially ratio and waveform calculations.

### Physics dependencies

Very strong.

### Diagnostic richness

Good for conceptual misconception detection, but less rich for distinguishing mathematical versus Electrical failure across repeated calculation families.

### Assessment relevance

17%.

### Verdict

**Valuable future diagnostic domain, but not the best first proving slice.**

## Candidate D — Electronic components and applications

### Core scope

- component recognition;
- function;
- operating principle;
- application.

### Diagnostic richness

Moderate.

This can test conceptual knowledge and classification but offers fewer rich overlapping foundational causes.

### Assessment relevance

10%.

### Verdict

**Poor first proving slice.**

---

# 6. Recommended Phase 1 proving domain

## Recommendation

Do **not** choose a single narrow curriculum topic.

Use a bounded **diagnostic proving domain** centred on:

> **Electrical quantities and units; V-I-R relationships; series and parallel DC circuits; electrical power; a bounded resistivity/voltage-drop cluster; and selected transferable work-energy-power concepts.**

This combines the strongest elements of Candidate A with a deliberately bounded part of Candidate B.

The slice should draw mainly from:

- Outcome 1 — relevant mathematical prerequisites;
- Outcome 2 — relevant quantities, SI units, prefixes and measurement concepts;
- Outcome 3 — selected work/energy/power/efficiency foundations;
- Outcome 4 — DC quantities, relationships, circuit calculations and electrical power.

Outcomes 5 and 6 should be mapped at curriculum level but **not deeply assertion-mapped in Phase 1** unless an identified dependency requires them.

---

# 7. Why this is the strongest proving domain

The recommended domain creates multiple Electrical contexts that share the same foundational knowledge.

This is essential.

If a learner fails formula transposition in:

- a voltage/current/resistance problem;
- an electrical power problem;
- an energy/power/time problem;

the platform receives evidence for a reusable mathematical weakness rather than three unrelated Electrical topic weaknesses.

Likewise, if the learner succeeds on pure algebra probes but fails repeatedly when selecting an Electrical relationship, the evidence should shift toward Electrical conceptual/formula-selection weakness.

This permits genuine competing hypotheses.

---

# 8. Provisional knowledge topology

This topology is illustrative.

The actual assertion inventory belongs to WP1.2 after WP1.1 approval.

```text
FOUNDATIONAL MATHS
│
├── number operations
├── decimals
├── fractions / percentages where relevant
├── ratio and proportion
├── algebraic symbols
├── substitution
├── equality
├── inverse operations
├── formula transposition
├── powers / indices where relevant
├── SI prefixes
└── unit conversion
        │
        ├───────────────────────────────┐
        │                               │
        ▼                               ▼
FOUNDATIONAL PHYSICS                ELECTRICAL FOUNDATIONS
│                                   │
├── physical quantity               ├── charge/current concept
├── unit                            ├── voltage concept
├── measurement                     ├── resistance concept
├── force                           ├── conductor/insulator
├── work                            ├── resistivity intro
├── energy                          ├── V-I-R relationship
├── power                           ├── series relationships
├── efficiency                      ├── parallel relationships
└── proportional reasoning          ├── electrical power
                                    ├── electrical energy
                                    └── voltage drop concept
```

The graph must allow assertions in one horizontal domain to serve multiple vocational assertions.

---

# 8.1 Strategy-aware diagnosis

The SmartScreen material reveals an important design requirement.

A learner may solve a simple three-variable relationship by:

- formal algebraic transposition;
- a remembered rearranged formula;
- a formula triangle;
- another valid procedural strategy.

The root-cause engine must not confuse **strategy choice** with
**knowledge failure**.

For example, a learner may be unable to perform general algebraic
transposition but may reliably use an Ohm's-law triangle to answer the
assessment question correctly.

For a learner whose intent is:

> **MAKE ME PASS QUICKLY**

that may be an effective immediate strategy and should not be punished.

For a learner whose intent is:

> **MAKE ME UNDERSTAND / MASTER THIS**

the platform may additionally identify that general formula
transposition remains weak and offer deeper remediation.

Therefore Phase 1 must distinguish, where evidence permits:

- conceptual mastery;
- procedural strategy;
- general foundational capability;
- exam-task performance.

A valid compensating strategy can improve pass readiness without
falsely upgrading the learner's underlying Foundational Maths mastery.

This is a concrete example of why **displayed outcome, diagnostic state
and underlying mastery state must remain separable**.

---

# 9. Required competing diagnostic hypotheses

Phase 1 should be designed so that at least the following root-cause families can genuinely compete.

## A. Electrical concept failure

Examples:

- misunderstanding current;
- misunderstanding voltage;
- misunderstanding resistance;
- misunderstanding series/parallel behaviour;
- confusing power with energy.

## B. Relationship/formula selection failure

The learner understands the quantities but chooses an inappropriate relationship.

## C. Formula transposition failure

The learner selects the correct governing relationship but rearranges it incorrectly.

## D. Substitution failure

Correct relationship and rearrangement, but values are inserted incorrectly.

## E. Arithmetic failure

The learner reaches the correct numerical operation but calculates incorrectly.

## F. Units/prefix/scientific-notation failure

Examples:

- mA versus A;
- mΩ / Ω / kΩ / MΩ;
- W versus kW;
- mm² versus m² where relevant;
- powers of ten in resistivity;
- minutes versus seconds where relevant.

## G. Quantity/unit conceptual confusion

The learner can manipulate numbers but does not reliably distinguish the underlying quantity from its unit.

## H. Series/parallel structural misconception

The mathematical process is adequate but the learner applies the wrong circuit rule.

## I. Reciprocal/fraction reasoning failure

The learner understands parallel-circuit structure but cannot correctly
perform reciprocal arithmetic or combine reciprocal terms.

## J. Proportionality failure

The learner does not reliably reason that, all else equal:

- resistance increases with conductor length;
- resistance decreases as cross-sectional area increases;
- current increases with voltage at fixed resistance;
- current decreases as resistance increases at fixed voltage.

## K. Plausibility/checking failure

The learner can perform a calculation but does not recognise an
impossible or implausible result, for example:

- parallel total resistance greater than a branch resistance;
- series current changing from one component to the next;
- branch voltages differing in an ideal parallel network.

## L. Power/energy conceptual failure

The learner confuses rate of energy transfer with energy itself, or carries a memorised Electrical formula without transferable understanding.

## M. Question interpretation failure

The learner possesses the relevant knowledge but misidentifies what is being asked or which data matter.

The engine does not need to infer all of these perfectly in Phase 1.

It must demonstrate that its evidence model can distinguish several plausible causes without collapsing everything into a single "topic weakness" score.

---

# 10. Evidence design requirement

The question bank cannot consist of one question per assertion.

The proving slice needs **overlapping evidence-generating interactions**.

For example, evidence about formula transposition might come from:

1. a pure algebra problem;
2. an Electrical V-I-R problem;
3. an Electrical power problem;
4. a mechanical/physical power problem;
5. a diagnostic probe with the arithmetic removed;
6. a transfer question with unfamiliar surface wording.

The system should be able to compare performance across those contexts.

The detailed SmartScreen review adds several useful diagnostic
interaction types:

- ask for **formula/relationship selection without calculation**;
- ask for **rearrangement only**;
- ask for **prefix/unit conversion only**;
- ask the learner to identify whether a result is **physically/circuit
  plausible**;
- vary which V/I/R/P quantity is unknown while holding the underlying
  relationship constant;
- present the same Maths operation in a pure Maths context and in an
  Electrical context;
- compare simple Ohm's-law rearrangement with resistivity rearrangement
  to test whether transposition generalises;
- use parallel-resistance questions to separate reciprocal arithmetic
  from circuit-rule understanding;
- use mechanical power questions to test transfer of the concept of
  power outside an Electrical surface context.

---

# 11. Provisional interaction volume

A planning target for the Phase 1 content set is:

> **80–150 approved assertions supporting approximately 200–400 authored or deterministically generated learner interactions/variants.**

This does not mean 400 manually written unique exam questions.

Interactions can include:

- assessment-style multiple choice;
- parameterised numerical questions;
- concept checks;
- relationship/formula selection;
- unit-conversion probes;
- diagnostic probes;
- worked-step identification;
- remediation checks;
- foundational retests;
- transfer questions.

Quality and information value are more important than the raw count.

---

# 12. Assessment authenticity requirement

The real Unit 202 assessment is a closed-book, online multiple-choice test with 40 questions in 90 minutes.

Phase 1 therefore needs credible multiple-choice assessment interactions.

However, the learning platform must not restrict itself to the final assessment format when another interaction type provides better diagnostic evidence.

For example:

- final exam practice may be multiple choice;
- diagnosis might ask which formula the learner would use;
- remediation might ask the learner to perform only the transposition step;
- transfer might return to a multiple-choice Electrical problem.

The product should distinguish:

> **assessment authenticity**

from:

> **diagnostic usefulness**.

Both matter.

---

# 13. Layered learner-intent requirement

The same proving domain must support at least two substantially different learner journeys.

## Journey A — "Make me pass quickly"

The learner should be able to:

- answer assessment-style questions;
- receive concise feedback;
- continue quickly;
- be shown high-yield weakness priorities;
- accept or defer targeted remediation.

The platform may still update deep learner evidence in the background.

## Journey B — "Help me understand"

The learner should be able to:

- expose the likely reason for the error;
- inspect the underlying prerequisite;
- enter a short targeted explanation;
- complete foundational practice;
- retest;
- return to Electrical application.

## Requirement

These must use the **same underlying learner model and knowledge graph**.

They must not be two independent products.

The learner should be able to move between feedback depths smoothly.

---

# 14. Example Phase 1 diagnostic sequence

Illustrative only:

```text
Electrical question:
230 V supply, resistance given, determine current
                  │
                  ▼
wrong response
                  │
       multiple causes remain
                  │
                  ▼
relationship-selection probe
                  │
          selects V = IR correctly
                  │
                  ▼
transposition probe
                  │
             fails
                  │
                  ▼
pure algebra probe
                  │
             fails
                  │
                  ▼
probable foundational weakness:
formula transposition
                  │
                  ▼
brief Maths remediation
                  │
                  ▼
pure Maths retest
                  │
              passes
                  │
                  ▼
new V-I-R transfer question
                  │
              passes
                  │
                  ▼
power-formula transfer question
                  │
              passes
                  │
                  ▼
learner evidence updated
```

The engine should not merely reproduce this fixed script.

This example exists to specify the kind of causal discrimination the implemented model must be capable of.

---

# 15. What must be mapped broadly versus deeply

## Broad curriculum map

Map all six Unit 202 outcomes at curriculum level.

Purpose:

- preserve context;
- avoid designing a slice that conflicts with the remainder of the unit;
- understand later expansion;
- maintain assessment/curriculum coverage awareness.

## Deep assertion map

Deep-map only the chosen proving domain.

Expected domains:

- relevant Foundational Maths;
- relevant Foundational Physics;
- relevant Outcome 2 quantity/unit/instrument knowledge;
- selected Outcome 3 work/energy/power/efficiency knowledge;
- substantial Outcome 4 V-I-R, series/parallel, power and bounded
  resistivity/voltage-drop knowledge.

## Explicitly defer deep mapping

Unless required by dependency discovery:

- full trigonometry;
- full statistics;
- full mechanics/levers/gears/pulleys;
- full magnetism;
- full AC waveform theory;
- full electronics/components;
- complete Unit 202.

---

# 16. Source sufficiency for WP1.2

The Product Owner is following a self-directed route and does not have
provider-authored course notes.

For the Phase 1 proving domain, this is not currently a blocker.

The available source set now includes:

- the current qualification handbook;
- City & Guilds SmartScreen sample scheme of work;
- City & Guilds SmartScreen handouts;
- City & Guilds SmartScreen PowerPoints;
- City & Guilds SmartScreen tutor worksheets/answers;
- two City & Guilds sample-question sets.

Together these are sufficient to design the knowledge architecture and
to construct the initial candidate assertion inventory for the proving
slice.

Additional authoritative/reference sources may still be required for
particular assertions. Source sufficiency must be decided **assertion by
assertion**, not assumed because a teaching pack exists.

The SmartScreen pack remains a copyrighted development/reference input.
Production assertions, explanations and questions must be independently
authored and governed under the Phase 0 IP/provenance rules.

---

# 17. WP1.1 acceptance criteria

WP1.1 is accepted when the Product Owner agrees that:

1. Unit 202 / Test 602 nomenclature is correct for the project's initial qualification context.
2. The whole Unit 202 has been mapped sufficiently at curriculum level for slice selection.
3. Phase 1 will not deep-map the entire unit before testing the architecture.
4. The original 20–50 assertion range is superseded.
5. The planning range is approximately 80–150 approved assertions, governed by diagnostic sufficiency rather than quota.
6. The proving slice contains multiple Electrical problem families sharing Foundational Maths/Physics prerequisites.
7. The principal proving domain is electrical quantities, units, DC circuit relationships and power, with selected transferable energy/power foundations.
8. The slice must support competing diagnostic explanations, not one pre-scripted cause per wrong answer.
9. The content set should create roughly 200–400 high-information learner interactions/variants, subject to refinement during implementation.
10. Assessment-style multiple choice is required, but diagnostic/remediation interactions may use other formats.
11. Both pass-focused and deeper-understanding learner intents must work from the same learner model.
12. Deep mapping of magnetism, AC generation and electronics is deferred unless dependency discovery demonstrates a need.
13. The supplied SmartScreen teaching pack is sufficient as the principal instructional-depth reference for the proving slice, while individual assertions may require additional authoritative sources.
14. A bounded resistivity/voltage-drop cluster is included because it provides valuable proportionality, scientific-notation, unit-conversion and formula-transposition evidence.
15. Parallel circuits are included deeply enough to test reciprocal/fraction reasoning, structural circuit rules and plausibility checks.
16. The learner model must distinguish valid problem-solving strategy from underlying mastery; use of a formula triangle must not automatically imply general algebraic transposition mastery.
17. The mechanical domain is bounded to the work/energy/power/efficiency transfer bridge, with mass/force included only where required by selected transfer questions.

---

# 18. Inputs to WP1.2

If WP1.1 is approved, WP1.2 should not immediately begin writing all 80–150 assertions.

WP1.2 must first define the **Domain & Knowledge Architecture** capable of representing them.

It must specify at least:

- assertion identity;
- assertion granularity rules;
- domain ownership;
- proposition type;
- prerequisite/dependency relationships;
- equivalent/related/contrasting relationships;
- misconception objects;
- source/version/locator provenance;
- curriculum mapping;
- risk/importance metadata where appropriate;
- lifecycle/status;
- supersession/version behaviour;
- validation/audit data;
- how an assertion can be reused across qualifications and verticals.

Only after the schema and modelling rules are approved should the Phase 1 assertion inventory be populated at scale.

---

# 19. Decision recommendation

**APPROVE WP1.1 with the recommended proving domain.**

Recommended Phase 1 subject boundary:

> **A diagnostically rich connected graph spanning the Maths, Physics and Electrical knowledge required for electrical quantities and units, V-I-R relationships, series and parallel DC circuits, electrical power, bounded resistivity/voltage-drop calculations and selected transferable work-energy-power concepts.**

Planning scale:

> **80–150 approved assertions and approximately 200–400 evidence-generating interactions/variants.**

The purpose of this larger slice is not content breadth.

It is to ensure that the root-cause engine is forced to reason among **genuinely competing explanations** and demonstrate cross-context transfer rather than succeeding on a small scripted demonstration.

The detailed SmartScreen review further confirms that the slice must
test **strategy-aware diagnosis**: successful use of a formula triangle
or memorised relationship can support immediate exam performance while
remaining distinct from evidence of general algebraic transposition
mastery.

---

# 20. Phase 1 control point

No Phase 1 implementation begins on approval of WP1.1 alone.

The next work package is:

> **WP1.2 — Domain & Knowledge Architecture**

WP1.2 defines how the knowledge graph is represented before the proving corpus is populated.

---

**End of WP1.1**
