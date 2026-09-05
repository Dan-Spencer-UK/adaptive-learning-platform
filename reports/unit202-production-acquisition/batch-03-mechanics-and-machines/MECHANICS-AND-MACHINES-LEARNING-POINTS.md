# Mechanics and Machines — Learning Points

**Status:** `ACCEPTED_BY_PRODUCT_ARCHITECT` — accepted in principle at the appropriate early-stage depth; identities frozen as of this closure pass. Curriculum-review artifact, not finished lesson prose. Sequenced pedagogically, not alphabetically. Every learning point traces to at least one evidence-requirement claim in `EVIDENCE-RESULTS.json`.

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
**Knowledge:** A lever is a rigid bar that turns around a fixed pivot point called the fulcrum. The effort is the force applied to the lever; the load (or resistance) is the force being overcome or moved.
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
**Knowledge:** For a given rotation, the distance a point moves is proportional to its own arm length: effort and load move through distances in the SAME ratio as their arm lengths — the INVERSE of the force ratio.
**Prerequisites:** MM-LP-03. **Cross-domain:** FM-LP-04, FM-LP-13, FM-LP-16.
**Evidence:** basic-lever-effort-load-arm-relationship-at-appropriate-depth.
**Depth note:** Separately diagnosable from identifying parts/class, per PA instruction. **Corrected (PA narrow-correction pass):** the distance/arm-length ratio was previously stated backwards (as the inverse of the arm ratio); now stated correctly, with arm length kept distinct from distance travelled.
**Excludes:** formal torque/moment theory beyond the lever balance; compound (multi-lever) systems.

### MM-LP-06 — Gears: what they do, driver and driven gears
**Outcome:** Explain what gears do; identify driver/driven gear; state rotation direction of two directly-meshing external gears.
**Knowledge:** Gears transmit rotational motion and torque from one shaft to another via their meshing teeth.
**Prerequisites:** none. **Cross-domain:** none.
**Evidence:** gears.
**Depth note:** Kept separate from ratio/speed/torque calculation (MM-LP-07). Gears are never described as creating or increasing power. **Corrected (PA narrow-correction pass):** the general "what a gear does" definition was previously mis-attributed to a passage that did not support it; now bound to an exact passage from the already-registered Penn State source.
**Excludes:** internal (ring) gears; gear-ratio calculations (MM-LP-07).

### MM-LP-07 — Gear ratio: speed and torque relationships
**Outcome:** Calculate gear ratio from tooth counts, use it to find output speed from input speed, and explain that, in the ideal (lossless) model, the torque/speed trade-off is inverse.
**Knowledge:** GR = driven(output) teeth / driver(input) teeth. OutputSpeed = InputSpeed × (driver teeth/driven teeth) — speed scales by the inverse of GR, for any meshing pair. In the IDEAL (lossless) model, OutputTorque = InputTorque × GR; increasing torque proportionally decreases speed, and vice versa. Real gear trains lose some torque to friction, so actual output torque is somewhat less than this ideal value; the direction of the trade-off still holds.
**Prerequisites:** MM-LP-06. **Cross-domain:** FM-LP-04, FM-LP-08, FM-LP-13, FM-LP-16.
**Evidence:** gear-ratio-legitimate-speed-relationship, torque-speed-relationship-where-applicable.
**Depth note:** Speed calculation and torque/speed trade-off combined — same relationship viewed two ways. Numerator/denominator convention (output/input) confirmed consistent across two independent sources before combining. **Corrected (PA narrow-correction pass):** the torque equation is now explicitly framed as the ideal/lossless model, not an unconditional property of real gear trains.
**Excludes:** compound/multi-idler gear trains; gear efficiency losses as a calculated quantity (see MM-LP-11, qualitative only).

### MM-LP-08 — Pulleys: purpose and basic operation
**Outcome:** Explain what a pulley is for; describe how fixed vs. movable pulleys affect the force needed to lift a load.
**Knowledge:** A pulley is a wheel-and-rope mechanism used to lift objects. A single fixed pulley changes only the direction of the applied force, not its magnitude. Movable pulleys can reduce the required force.
**Prerequisites:** none. **Cross-domain:** none.
**Evidence:** pulleys.
**Excludes:** lifting-equipment regulation/inspection; mechanical-advantage calculation (MM-LP-09).

### MM-LP-09 — Mechanical advantage
**Outcome:** State what mechanical advantage means generally; calculate ideal MA of a pulley system by counting load-supporting rope sections.
**Knowledge:** Mechanical advantage is the factor by which a machine multiplies an applied (effort) force to produce a larger output (load) force; for an ideal, frictionless machine, this is the ideal mechanical advantage. For a pulley system specifically, ideal MA equals the number of rope sections that directly support the load (the weight end) — not the total number of pulleys or the total rope length.
**Prerequisites:** MM-LP-08. **Cross-domain:** none.
**Evidence:** mechanical-advantage.
**Depth note:** Pulley-counting rule bound exactly as sourced — sections at the load end, not total rope length or pulley count. **Corrected (PA narrow-correction pass):** removed decimal-arithmetic/ratio-notation/substitution prerequisites — counting rope sections requires none of these skills.
**Excludes:** real (friction-reduced) MA as distinct from ideal MA (see MM-LP-11).

### MM-LP-10 — Ideal machines: the force-distance trade and the input/output power relationship
**Outcome:** Explain that an ideal machine trades reduced effort force for increased distance (and vice versa), that its work input equals its work output, and that — for such a machine with no internal energy storage, compared over the same time interval — input power equals output power; NOT that power is a generally conserved quantity.
**Knowledge:** Force_in × distance_in = Force_out × distance_out (ideal, frictionless case). Since P=W/t, comparing input and output over the SAME interval with no internal energy storage gives P_input=P_output for the ideal case — a restricted consequence of the work equality and the power definition, not an independent "power conservation law."
**Prerequisites:** MM-LP-09. **Cross-domain:** none.
**Evidence:** force-distance-trade, ideal-machine-conserves-power.
**Depth note:** Trade mechanism and the qualified power relationship combined — same principle, two angles. **Corrected (PA narrow-correction pass):** the power-equality claim is now an explicitly-derived, transparent synthesis of the ideal-machine work equality and the independently-evidenced P=W/t relationship, qualified to no-energy-storage and same-time-interval conditions — not an unrestricted "ideal machines conserve power" statement. Now purely conceptual (no calculation outcome), so cross-domain prerequisites were removed.
**Excludes:** real/non-ideal machines (MM-LP-11); hydraulic systems as taught content (evidence only); power as a generally conserved quantity independent of the stated conditions; machines that store/release internal energy (flywheels, springs).

### MM-LP-11 — Real machines: friction and losses reduce useful output
**Outcome:** Explain that real machines are never perfectly efficient because friction/losses convert input into heat rather than useful output.
**Knowledge:** Not all input work or power reaches the useful output; the lost portion becomes heat rather than useful mechanical output — so the useful output of a real machine is always less than its input.
**Prerequisites:** MM-LP-10. **Cross-domain:** none (qualitative; calculation is MM-LP-17).
**Evidence:** real-losses-reduce-useful-output.
**Depth note:** Independently diagnosable from the ideal case.
**Excludes:** friction-coefficient calculations; quantifying the loss (efficiency — MM-LP-17).

### MM-LP-12 — Force
**Outcome:** State that force is a push or pull, its possible effects, and its SI unit.
**Knowledge:** A force is a push or a pull exerted on a body; it may produce motion, change existing motion, or cause the body to deform. The SI unit of force is the newton (N): the force required to give a one-kilogram mass an acceleration of one metre per second squared.
**Prerequisites:** none. **Cross-domain:** none.
**Evidence:** force-concept-at-qualification-depth.
**Excludes:** F=ma as an independent topic; vector force resolution; Newton's three laws as a formal system.

### MM-LP-13 — Work: concept and W = Fd
**Outcome:** Explain what work means; use W=Fd for a force acting along the direction of displacement.
**Knowledge:** Work is done when a force acts on an object and moves it through a distance in the direction of the force: W=Fd (joules = newtons × metres). One joule is the work done when a force of one newton moves its point of application one metre in the direction of the force.
**Prerequisites:** MM-LP-12. **Cross-domain:** FM-LP-04, FM-LP-13.
**Evidence:** work, w-fd.
**Depth note:** Deliberately scoped to force-along-displacement; not generalised to an arbitrary angle. **Corrected (PA narrow-correction pass):** removed the formula-rearrangement prerequisite — only forward calculation (W from F and d) is evidenced.
**Excludes:** work at an angle (cos θ case); work against a force as a separate formal topic (gravity case is MM-LP-15).

### MM-LP-14 — Energy, kinetic energy and potential energy: concepts
**Outcome:** State what energy is; explain the qualitative KE-vs-PE distinction.
**Knowledge:** Energy is the capacity of a system to do work, measured in joules. Kinetic energy is the energy an object possesses because of its motion. Potential energy is energy associated with an object's position or configuration (a stored capacity to do work) — qualitatively distinct from kinetic energy: an object can possess potential energy at rest (zero KE), and vice versa.
**Prerequisites:** MM-LP-13. **Cross-domain:** none (no formula bound).
**Evidence:** energy, kinetic-versus-potential-energy-concept.
**Depth note:** KE remains qualitative only — KE=½mv² explicitly excluded from mastery. PE's formula lives separately in MM-LP-15.
**Excludes:** KE=½mv²; other energy forms (elastic, chemical); conservation-of-mechanical-energy calculations.

### MM-LP-15 — Gravitational potential energy and work done against gravity
**Outcome:** Explain that lifting does work against gravity stored as gravitational PE; calculate PE gained using PE=mgh.
**Knowledge:** Δh is the change in vertical height (not path length); consistent g throughout.
**Prerequisites:** MM-LP-14, MM-LP-02. **Cross-domain:** FM-LP-04, FM-LP-10, FM-LP-13.
**Evidence:** gravitational-lifting-work-against-gravity, pe-mgh-work-against-gravity-equivalence.
**Depth note (PA narrow-correction pass):** removed the formula-rearrangement prerequisite — only forward calculation (PE from m, g and h) is evidenced.
**Excludes:** non-vertical path calculations beyond net vertical rise; non-gravitational PE forms.

### MM-LP-16 — Power: concept and P = W/t
**Outcome:** State power is the rate of doing work; use P=W/t.
**Knowledge:** Power is the rate of doing work (equivalently, the rate energy is transferred): P=W/t, where W is work done and t is time taken. Power's SI unit is the watt, equal to one joule per second.
**Prerequisites:** MM-LP-13. **Cross-domain:** FM-LP-04, FM-LP-13.
**Evidence:** power, p-w-t.
**Depth note (PA narrow-correction pass):** removed the formula-rearrangement prerequisite — rearranging P=W/t for W or t is substitution-level algebra already covered by FM-LP-13, not the more involved rearrangement skill FM-LP-16 represents elsewhere in this inventory.
**Excludes:** instantaneous/calculus-based power; electrical power (already evidenced in Batch 02).

### MM-LP-17 — Efficiency: concept and calculation
**Outcome:** State what efficiency means; calculate it as useful output/total input (ratio or %), using either energy/work values or power values, never mixed.
**Knowledge:** η = W_out/W_in OR η = P_out/P_in — never W_out/P_in or similar. Cannot legitimately exceed 100%.
**Prerequisites:** MM-LP-11. **Cross-domain:** FM-LP-04, FM-LP-06, FM-LP-07, FM-LP-13.
**Evidence:** efficiency, efficiency-relationship.
**Excludes:** mixing an energy numerator with a power denominator (or vice versa); loss-mechanism breakdowns.

### MM-LP-18 — Legitimate multistep mechanical calculations
**Outcome:** Solve a multistep problem by chaining the weight/lifting-work relationship and the power relationship in sequence — specifically, finding the work done lifting an object against gravity from its weight force and height, then using that work and a stated time to calculate the power required — rather than relying on a single formula.
**Knowledge:** (1) Work done raising an object against gravity = weight force × vertical height (the same relationship as gravitational-lifting-work-against-gravity/PE=mgh); (2) that work ÷ time taken = power required (P=W/t). Both steps reuse relationships already evidenced elsewhere in this batch; no new formula is introduced. The general chaining SKILL could in principle extend to other combinations of this batch's relationships, but this learning point's own EVIDENCE is specifically the weight-to-work-to-power chain — it does not itself evidence a lever/gear/pulley-to-work/power/efficiency chain.
**Prerequisites:** MM-LP-15, MM-LP-16. **Cross-domain:** FM-LP-04, FM-LP-13.
**Evidence:** legitimate-multistep-mechanical-calculations.
**Depth note:** Distinct performance level from single-formula recognition. **Corrected (PA narrow-correction pass):** the sole procedure evidence was previously a hydraulic worked example, rejected because hydraulics is explicitly excluded from this batch's mastery scope. Replaced with a genuinely in-scope worked example (Penn State power source, its worked-solution PDF now separately registered as `SRC-PSU-POWER-P2SOLUTION` for exact provenance): work done lifting a car against gravity (weight force × height), then power from that work and a time. Its own units are imperial (lbs, ft, hp), but the chaining PROCEDURE evidenced is unit-system-independent. The formula-rearrangement prerequisite was also removed, since the replacement example uses only forward substitution. **Narrowed further (PA closure pass):** the prerequisite list and application examples previously implied an unrestricted omnibus procedure spanning levers, gears, pulleys and efficiency, none of which this requirement's own evidence demonstrates chaining into a work/power calculation. Prerequisites are now limited to MM-LP-15 and MM-LP-16 — the two relationships this example actually uses; MM-LP-05, MM-LP-07, MM-LP-09, MM-LP-13, and MM-LP-17 were removed as prerequisites of THIS learning point specifically (they remain independently evidenced learning points in their own right).
**Excludes:** hydraulic systems as taught Unit 202 content (the rejected example is retained, clearly marked rejected, in `ACQUISITION-LOG.json` and `SOURCE-REGISTER.json`); single-formula calculations already covered by a prerequisite learning point; a lever, gear, or pulley calculation chained into a work/power/efficiency calculation — not directly evidenced by this requirement's own worked example, even though each individual relationship is separately evidenced elsewhere in this batch.

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
| FM-LP-04 (decimal arithmetic) | MM-LP-02, 05, 07, 13, 15, 16, 17, 18 |
| FM-LP-06 (percentage of a quantity) | MM-LP-17 |
| FM-LP-07 (expressing output as % of input) | MM-LP-17 |
| FM-LP-08 (ratio notation) | MM-LP-07 |
| FM-LP-10 (direct proportion) | MM-LP-02, 15 |
| FM-LP-13 (substitution/order of operations) | MM-LP-02, 05, 07, 13, 15, 16, 17, 18 |
| FM-LP-16 (rearranging simple formulae) | MM-LP-02, 05, 07 |

**Corrected (Product Architect narrow-correction pass):** MM-LP-09 and MM-LP-10 had all cross-domain arithmetic prerequisites removed (counting rope sections and explaining a conceptual relationship require none of those skills); FM-LP-16 was removed from MM-LP-13, MM-LP-15, MM-LP-16, and MM-LP-18, since none of their evidenced worked examples demonstrate rearranging the relevant formula for a different unknown — only forward substitution is evidenced. FM-LP-16 is retained only on MM-LP-02, MM-LP-05, and MM-LP-07, whose outcomes and evidence genuinely include solving for a different unknown by rearrangement.

## Readiness

All 18 learning points: **READY** (all 28 underlying evidence requirements are VERIFIED; no HELD or PARTIALLY_EVIDENCED learning points in this batch). This remains true after both the Product Architect narrow-correction pass (MM-LP-06, MM-LP-07, MM-LP-10, and MM-LP-18 corrected with genuinely-supporting or properly-qualified evidence) and this closure pass (MM-LP-18 narrowed to its genuinely-evidenced scope) — none was merely left READY to preserve a total.

## Identity freeze status

**FROZEN as of this closure pass.** Following the Product Architect's final closure review — a substantive JSON/Markdown field comparison, an MM-LP-18 scope check, a Penn State PDF provenance check, and an ideal-machine power-qualification reconfirmation, all of which passed (with corrections applied where needed) — `MM-LP-01` through `MM-LP-18` are declared the approved Batch 03 learning-point identity baseline: an ID is never reassigned, future genuinely-new learning points are appended (`MM-LP-19` onward) rather than inserted, removed learning points are deprecated rather than renumbered or reused, and instructional order remains tracked separately from stable identity. No ID was renumbered in this closure pass.
