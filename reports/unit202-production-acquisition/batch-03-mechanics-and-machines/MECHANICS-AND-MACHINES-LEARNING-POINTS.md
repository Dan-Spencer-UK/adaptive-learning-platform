# Mechanics and Machines — Proposed Learning Points

**Status:** PROPOSED_FOR_PA_REVIEW — not accepted, not identity-frozen. Curriculum-review artifact, not finished lesson prose. Sequenced pedagogically, not alphabetically. Every learning point traces to at least one evidence-requirement claim in `EVIDENCE-RESULTS.json`.

**Learning point count:** 18, covering all 28 mechanics-and-machines evidence requirements (see coverage matrix at the end).

Cross-domain prerequisites reference the accepted, frozen Batch 01 foundational-mathematics inventory (`FM-LP-01`–`FM-LP-25`). No `FM-LP-*` or `EFS-LP-*` ID is edited, renumbered, or duplicated here.

---

### MM-LP-01 — Mass and weight: meanings and the distinction between them
**Outcome:** State what mass is, state what weight is, and explain why they are distinct quantities.
**Knowledge:** Mass = amount of matter (inertial property, kg), unaffected by location. Weight = the gravitational force on a body (N), which does change with location. Colloquial "weight" as a synonym for mass is technically incorrect.
**Prerequisites (within-domain):** none. **Cross-domain:** none (purely conceptual, no calculation).
**Evidence:** mass-meaning, weight-meaning, mass-weight-distinction.
**Depth note:** Combined as one inseparable comparison — the comparison IS the concept, per Batch 01/02 precedent.
**Excludes:** F=mg and its calculations (MM-LP-02); relativistic/inertial-vs-gravitational mass.

### MM-LP-02 — Weight force: F = mg and mass/weight calculations
**Outcome:** State F=mg and use it (including rearranged) to calculate weight from mass or mass from weight.
**Knowledge:** F=mg (g ≈ 9.8 m/s² near Earth's surface); defines gravitational weight force generally, not restricted to free fall; rearranges to m=F/g.
**Prerequisites:** MM-LP-01. **Cross-domain:** FM-LP-04, FM-LP-10, FM-LP-13, FM-LP-16.
**Evidence:** weight-force-relationship, appropriate-mass-weight-calculations.
**Depth note:** Relationship and calculation combined (same skill applied to numbers). F=mg deliberately unconditional, not free-fall-restricted.
**Excludes:** F=ma as an independent topic; g varying with altitude as a calculated quantity.

### MM-LP-03 — Levers: parts and basic operation
**Outcome:** Identify fulcrum, effort and load; explain in outline how a lever works.
**Prerequisites:** none. **Cross-domain:** none.
**Evidence:** levers.
**Depth note:** Kept separate from classification and calculation — three independently diagnosable skills.
**Excludes:** classification (MM-LP-04); calculations (MM-LP-05).

### MM-LP-04 — Lever classes
**Outcome:** Classify a lever as first, second or third class by the relative position of fulcrum/effort/load.
**Knowledge:** First class: fulcrum between effort and load. Second class: load between fulcrum and effort. Third class: effort between fulcrum and load (mechanical disadvantage, but greater distance moved).
**Prerequisites:** MM-LP-03. **Cross-domain:** none.
**Evidence:** lever-classes.
**Depth note:** Mastery outcome is the positional rule, not memorising named example objects (crowbar, wheelbarrow, tweezers) — examples are illustrations only.
**Excludes:** memorising fixed example lists as the mastery outcome; numerical MA per class (MM-LP-05).

### MM-LP-05 — Lever calculations: effort, load and arm lengths
**Outcome:** Use Effort × Effort-Arm = Load × Load-Arm to find an unknown effort, load, or arm length.
**Prerequisites:** MM-LP-03. **Cross-domain:** FM-LP-04, FM-LP-13, FM-LP-16.
**Evidence:** basic-lever-effort-load-arm-relationship-at-appropriate-depth.
**Depth note:** Separately diagnosable from identifying parts/class, per PA instruction.
**Excludes:** formal torque/moment theory beyond the lever balance; compound (multi-lever) systems.

### MM-LP-06 — Gears: what they do, driver and driven gears
**Outcome:** Explain what gears do; identify driver/driven gear; state rotation direction of two directly-meshing external gears.
**Prerequisites:** none. **Cross-domain:** none.
**Evidence:** gears.
**Depth note:** Kept separate from ratio/speed/torque calculation (MM-LP-07). Gears are never described as creating or increasing power.
**Excludes:** internal (ring) gears; gear-ratio calculations (MM-LP-07).

### MM-LP-07 — Gear ratio: speed and torque relationships
**Outcome:** Calculate gear ratio from tooth counts, use it to find output speed from input speed, and explain the torque/speed trade-off.
**Knowledge:** GR = driven(output) teeth / driver(input) teeth. OutputSpeed = InputSpeed × (driver teeth/driven teeth) — speed scales by the inverse of GR. OutputTorque = InputTorque × GR. Increasing torque through a gear train proportionally decreases speed, and vice versa.
**Prerequisites:** MM-LP-06. **Cross-domain:** FM-LP-04, FM-LP-08, FM-LP-13, FM-LP-16.
**Evidence:** gear-ratio-legitimate-speed-relationship, torque-speed-relationship-where-applicable.
**Depth note:** Speed calculation and torque/speed trade-off combined — same relationship viewed two ways. Numerator/denominator convention (output/input) confirmed consistent across two independent sources before combining.
**Excludes:** compound/multi-idler gear trains; gear efficiency losses (see MM-LP-11).

### MM-LP-08 — Pulleys: purpose and basic operation
**Outcome:** Explain what a pulley is for; describe how fixed vs. movable pulleys affect the force needed to lift a load.
**Knowledge:** A single fixed pulley changes only the direction of the applied force, not its magnitude. Movable pulleys can reduce the required force.
**Prerequisites:** none. **Cross-domain:** none.
**Evidence:** pulleys.
**Excludes:** lifting-equipment regulation/inspection; mechanical-advantage calculation (MM-LP-09).

### MM-LP-09 — Mechanical advantage
**Outcome:** State what mechanical advantage means generally; calculate ideal MA of a pulley system by counting load-supporting rope sections.
**Prerequisites:** MM-LP-08. **Cross-domain:** FM-LP-04, FM-LP-08, FM-LP-13.
**Evidence:** mechanical-advantage.
**Depth note:** Pulley-counting rule bound exactly as sourced — sections at the load end, not total rope length or pulley count.
**Excludes:** real (friction-reduced) MA as distinct from ideal MA (see MM-LP-11).

### MM-LP-10 — Ideal machines: the force-distance trade and energy conservation
**Outcome:** Explain that an ideal machine trades reduced effort force for increased distance (and vice versa), and cannot create energy or power.
**Knowledge:** Force_in × distance_in = Force_out × distance_out (ideal, frictionless case); an ideal machine can never output more energy/power than supplied.
**Prerequisites:** MM-LP-09. **Cross-domain:** FM-LP-04, FM-LP-13, FM-LP-16.
**Evidence:** force-distance-trade, ideal-machine-conserves-power.
**Depth note:** Trade mechanism and energy-conservation statement combined — same principle, two angles.
**Excludes:** real/non-ideal machines (MM-LP-11); hydraulic systems as taught content (evidence only).

### MM-LP-11 — Real machines: friction and losses reduce useful output
**Outcome:** Explain that real machines are never perfectly efficient because friction/losses convert input into heat rather than useful output.
**Prerequisites:** MM-LP-10. **Cross-domain:** none (qualitative; calculation is MM-LP-17).
**Evidence:** real-losses-reduce-useful-output.
**Depth note:** Independently diagnosable from the ideal case.
**Excludes:** friction-coefficient calculations; quantifying the loss (efficiency — MM-LP-17).

### MM-LP-12 — Force
**Outcome:** State that force is a push or pull, its possible effects, and its SI unit.
**Prerequisites:** none. **Cross-domain:** none.
**Evidence:** force-concept-at-qualification-depth.
**Excludes:** F=ma as an independent topic; vector force resolution; Newton's three laws as a formal system.

### MM-LP-13 — Work: concept and W = Fd
**Outcome:** Explain what work means; use W=Fd for a force acting along the direction of displacement.
**Prerequisites:** MM-LP-12. **Cross-domain:** FM-LP-04, FM-LP-13, FM-LP-16.
**Evidence:** work, w-fd.
**Depth note:** Deliberately scoped to force-along-displacement; not generalised to an arbitrary angle.
**Excludes:** work at an angle (cos θ case); work against a force as a separate formal topic (gravity case is MM-LP-15).

### MM-LP-14 — Energy, kinetic energy and potential energy: concepts
**Outcome:** State what energy is; explain the qualitative KE-vs-PE distinction.
**Prerequisites:** MM-LP-13. **Cross-domain:** none (no formula bound).
**Evidence:** energy, kinetic-versus-potential-energy-concept.
**Depth note:** KE remains qualitative only — KE=½mv² explicitly excluded from mastery. PE's formula lives separately in MM-LP-15.
**Excludes:** KE=½mv²; other energy forms (elastic, chemical); conservation-of-mechanical-energy calculations.

### MM-LP-15 — Gravitational potential energy and work done against gravity
**Outcome:** Explain that lifting does work against gravity stored as gravitational PE; calculate PE gained using PE=mgh.
**Knowledge:** Δh is the change in vertical height (not path length); consistent g throughout.
**Prerequisites:** MM-LP-14, MM-LP-02. **Cross-domain:** FM-LP-04, FM-LP-10, FM-LP-13, FM-LP-16.
**Evidence:** gravitational-lifting-work-against-gravity, pe-mgh-work-against-gravity-equivalence.
**Excludes:** non-vertical path calculations beyond net vertical rise; non-gravitational PE forms.

### MM-LP-16 — Power: concept and P = W/t
**Outcome:** State power is the rate of doing work; use P=W/t.
**Prerequisites:** MM-LP-13. **Cross-domain:** FM-LP-04, FM-LP-13, FM-LP-16.
**Evidence:** power, p-w-t.
**Excludes:** instantaneous/calculus-based power; electrical power (already evidenced in Batch 02).

### MM-LP-17 — Efficiency: concept and calculation
**Outcome:** State what efficiency means; calculate it as useful output/total input (ratio or %), using either energy/work values or power values, never mixed.
**Knowledge:** η = W_out/W_in OR η = P_out/P_in — never W_out/P_in or similar. Cannot legitimately exceed 100%.
**Prerequisites:** MM-LP-11. **Cross-domain:** FM-LP-04, FM-LP-06, FM-LP-07, FM-LP-13.
**Evidence:** efficiency, efficiency-relationship.
**Excludes:** mixing an energy numerator with a power denominator (or vice versa); loss-mechanism breakdowns.

### MM-LP-18 — Legitimate multistep mechanical calculations
**Outcome:** Solve a multistep problem by chaining several simple relationships from this domain in sequence.
**Prerequisites:** MM-LP-05, MM-LP-07, MM-LP-09, MM-LP-13, MM-LP-16, MM-LP-17. **Cross-domain:** FM-LP-04, FM-LP-13, FM-LP-16.
**Evidence:** legitimate-multistep-mechanical-calculations.
**Depth note:** Distinct performance level from single-formula recognition. The evidencing worked example uses a hydraulic system, outside this batch's own scope, and is bound only as evidence of the general chaining procedure — this learning point's own applications use only this batch's lever/gear/pulley/work/power/efficiency relationships.
**Excludes:** hydraulic systems as taught Unit 202 content; single-formula calculations already covered by a prerequisite learning point.

---

## Coverage matrix (28 evidence requirements → learning points)

| Evidence requirement | Learning point(s) |
|---|---|
| mass-meaning | MM-LP-01 |
| weight-meaning | MM-LP-01 |
| mass-weight-distinction | MM-LP-01 |
| weight-force-relationship | MM-LP-02 |
| appropriate-mass-weight-calculations | MM-LP-02 |
| levers | MM-LP-03 |
| lever-classes | MM-LP-04 |
| basic-lever-effort-load-arm-relationship-at-appropriate-depth | MM-LP-05 |
| gears | MM-LP-06 |
| gear-ratio-legitimate-speed-relationship | MM-LP-07 |
| torque-speed-relationship-where-applicable | MM-LP-07 |
| pulleys | MM-LP-08 |
| mechanical-advantage | MM-LP-09 |
| force-distance-trade | MM-LP-10 |
| ideal-machine-conserves-power | MM-LP-10 |
| real-losses-reduce-useful-output | MM-LP-11 |
| force-concept-at-qualification-depth | MM-LP-12 |
| work | MM-LP-13 |
| w-fd | MM-LP-13 |
| energy | MM-LP-14 |
| kinetic-versus-potential-energy-concept | MM-LP-14 |
| gravitational-lifting-work-against-gravity | MM-LP-15 |
| pe-mgh-work-against-gravity-equivalence | MM-LP-15 |
| power | MM-LP-16 |
| p-w-t | MM-LP-16 |
| efficiency | MM-LP-17 |
| efficiency-relationship | MM-LP-17 |
| legitimate-multistep-mechanical-calculations | MM-LP-18 |

All 28 requirements map to exactly one learning point each (no many-to-one collapsing beyond the explicitly-justified pairs already described above, e.g. gear-ratio + torque-speed inside MM-LP-07).

## Cross-domain prerequisites used

| FM-LP | Used by |
|---|---|
| FM-LP-04 (decimal arithmetic) | MM-LP-02, 05, 07, 09, 10, 13, 15, 16, 17, 18 |
| FM-LP-06 (percentage of a quantity) | MM-LP-17 |
| FM-LP-07 (expressing output as % of input) | MM-LP-17 |
| FM-LP-08 (ratio notation) | MM-LP-07, 09 |
| FM-LP-10 (direct proportion) | MM-LP-02, 15 |
| FM-LP-13 (substitution/order of operations) | MM-LP-02, 05, 07, 09, 10, 13, 15, 16, 17, 18 |
| FM-LP-16 (rearranging simple formulae) | MM-LP-02, 05, 07, 10, 13, 15, 16, 18 |

## Readiness

All 18 learning points: **READY** (all 28 underlying evidence requirements are VERIFIED; no HELD or PARTIALLY_EVIDENCED learning points in this batch).

## Identity freeze status

**NOT FROZEN.** This inventory is proposed for Product Architect review only. No `MM-LP-*` ID is accepted or identity-frozen in this session.
