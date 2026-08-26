/**
 * CC-11.13: the governed production-mode model -- how an asset's final
 * learner-visible master is actually made, distinct from (and more
 * specific than) catalogue.ts's own coarse `productionClass`
 * ("DETERMINISTIC_TECHNICAL" | "PREMIUM_CONCEPTUAL" | "HYBRID").
 *
 * PRODUCT OWNER DECISION (permanent, all future modules/courses/
 * qualifications), the direct trigger for this file: simply vectorising or
 * tracing a reference image is NOT an acceptable final production method.
 * A technically suitable reference is authority for geometry/direction/
 * topology; the final ALP learner-facing image is normally an ORIGINAL
 * redraw in ALP style grounded on that authority, never a lifted/traced
 * copy, and never a free re-interpretation that drifts from the reference's
 * governed technical relationships. See
 * `docs/design/ALP-INSTRUCTIONAL-VISUAL-STYLE-GUIDE.md` §10 and
 * `docs/architecture/PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md`
 * §23 for the full decision record.
 *
 * Applied as an additive overlay keyed by assetId (or `assetId.state.slug`
 * for the handful of assets whose states materially differ), the same
 * proven pattern as `reference-corrections.ts` and
 * `semantic-reference-qa.ts` -- never an in-place rewrite of catalogue.ts,
 * several of whose asset families are generated programmatically from
 * shared template tables.
 */

/**
 * 1. DETERMINISTIC_TECHNICAL -- exact technical/vector content only
 *    (circuit symbols, switching symbols, waveforms, exact geometry
 *    overlays, arrows/directions, exact schematic/topological content).
 *    Never a generative image. 1:1 with catalogue.ts's own
 *    `productionClass: "DETERMINISTIC_TECHNICAL"`.
 * 2. ORIGINAL_REDRAW_FROM_REFERENCE -- a clean, original ALP diagram
 *    redraw grounded on a clear authoritative reference, with NO technical
 *    reinterpretation: direction, handedness, topology, polarity and every
 *    other governed relationship the reference establishes are preserved
 *    exactly. This is the DEFAULT mode for premium teaching diagrams --
 *    the direct implementation of the Product Owner's "no artistic
 *    licence" decision.
 * 3. HYBRID_REDRAW_PLUS_DETERMINISTIC_OVERLAY -- the base teaching image
 *    is an original redraw (mode 2), but at least one state-varying
 *    technical fact (a numeric dimension callout, a comparison caption, a
 *    rotation-direction indicator) is added deterministically on top,
 *    rather than baked separately into every sibling state's own master.
 *    Reserved for facts that are genuinely overlay-appropriate (simple
 *    measurement/comparison annotations) -- NEVER used as an excuse to
 *    defer a governed directional/topological fact that must be visible
 *    in the base image itself (see the "no generative inference" list
 *    below; CC-11.9 §3's own correction of the opposite mistake).
 * 4. GENERATIVE_CONCEPTUAL -- original/conceptual generation appropriate
 *    where no single authoritative reference's exact relationships must be
 *    preserved (a generic, brand-neutral conceptual illustration). Must
 *    never invent a governed technical relationship that belongs in the
 *    "no generative inference" list.
 * 5. DEFERRED_POLISH -- NOT a production method. A status meaning: this
 *    asset is technically/pedagogically correct and usable for ongoing
 *    product development, but its final visual polish pass is
 *    intentionally postponed. Recorded here (not only in the lifecycle
 *    overlay) so a caller asking "how would this be finished" gets a
 *    direct answer without cross-referencing two files.
 */
export type ProductionMode = "DETERMINISTIC_TECHNICAL" | "ORIGINAL_REDRAW_FROM_REFERENCE" | "HYBRID_REDRAW_PLUS_DETERMINISTIC_OVERLAY" | "GENERATIVE_CONCEPTUAL" | "DEFERRED_POLISH";

export interface ProductionModeRecord {
  mode: ProductionMode;
  rationale: string;
  /** Set only when the CURRENT mode is a known-imperfect stopgap and a different mode is the recommended target for the next bounded fix -- e.g. right-hand-grip.teaching's recommended move to a deterministic wrap-around overlay. Never acted on automatically; a future package decides when to change the actual mode. */
  recommendedFutureMode?: ProductionMode;
  recommendedFutureModeRationale?: string;
}

/**
 * PERMANENT STYLE DEFAULT (Product Owner decision, CC-11.13): governed
 * teaching diagrams do NOT default to 3D. These are teaching diagrams, not
 * product-shot renders -- clean 2D/flat/diagrammatic treatment is usually
 * the CLEARER choice. Perspective/depth/3D rendering is opt-in only, used
 * when it materially improves comprehension of a genuinely 3D relationship
 * (e.g. the AC generator's loop/shaft/slip-ring topology, where a flat 2D
 * projection would itself be ambiguous) -- never as a default "premium"
 * aesthetic applied uniformly. See style guide §10.
 */
export const DEFAULT_STYLE_TREATMENT = "2D_DIAGRAMMATIC" as const;
export type StyleTreatment = "2D_DIAGRAMMATIC" | "PERSPECTIVE_3D_OPT_IN";

/**
 * GOVERNED "NO GENERATIVE INFERENCE" RELATIONSHIPS (CC-11.13, strengthens
 * and consolidates the rule CC-11.12 first applied piecemeal via
 * `semantic-reference-qa.ts`'s per-asset `modelMustNotInfer` fields into
 * one platform-wide, permanently documented list). For every relationship
 * below, if the final learner-visible image depicts it, the depiction must
 * come from one of: (a) deterministic vector geometry, (b) an
 * ORIGINAL_REDRAW_FROM_REFERENCE whose prepared reference frame already
 * encodes the exact relationship (never re-derived during generation), or
 * (c) a HYBRID_REDRAW_PLUS_DETERMINISTIC_OVERLAY where the relationship
 * itself is the deterministic layer. A generative model is never the
 * authority for any of these, regardless of production mode.
 */
export const NO_GENERATIVE_INFERENCE_RELATIONSHIPS: readonly string[] = [
  "Right-hand grip field-rotation geometry (curl direction must wrap the conductor in the plane of the curled fingers, base-to-fingertip)",
  "Fleming's-rule directional correspondences where exact answer correctness depends on them (thumb/first-finger/second-finger assignment and mutual perpendicularity)",
  "Motor-effect and generator current/field/force/motion relationships (F = BIL direction, EMF polarity, rotation sense)",
  "B / l / v geometry for motional EMF (field convention, conductor motion direction, effective-length dimension)",
  "Lever-class relationships (fulcrum/effort/load ordering that defines Class I/II/III)",
  "Circuit topology (component count, connectivity, loop structure)",
  "Diode polarity / forward-reverse current-state logic",
  "Electrolysis ion-migration direction (cation-to-cathode, anion-to-anode)",
  "UK/IEC schematic symbol geometry",
  "Switching-symbol geometry (contact state, pole/way configuration)",
] as const;

function mode(mode: ProductionMode, rationale: string, extra?: Partial<Pick<ProductionModeRecord, "recommendedFutureMode" | "recommendedFutureModeRationale">>): ProductionModeRecord {
  return { mode, rationale, ...extra };
}

/**
 * Keyed by assetId for single-mode assets, or `${assetId}.state.${slug}`
 * for the 3 direction-sensitive assets whose states are independently
 * produced (current-conductor.magnetic-field, motor.effect.horizontal/
 * vertical-poles) -- `productionModeFor()` below falls back from a
 * state-specific key to the asset-level key so every one of the 98
 * governed states resolves to a mode without needing 98 explicit entries.
 */
export const PRODUCTION_MODE: Record<string, ProductionModeRecord> = {
  // --- DETERMINISTIC_TECHNICAL: 1:1 with catalogue.ts productionClass ---
  "unit202.circuit.series": mode("DETERMINISTIC_TECHNICAL", "Exact circuit topology -- deterministic vector renderer (SeriesCircuitDiagram.tsx)."),
  "unit202.circuit.parallel": mode("DETERMINISTIC_TECHNICAL", "Exact circuit topology -- deterministic vector renderer."),
  "unit202.circuit.mixed": mode("DETERMINISTIC_TECHNICAL", "Exact circuit topology -- deterministic vector renderer."),
  "unit202.instrument.connections": mode("DETERMINISTIC_TECHNICAL", "Exact meter-connection geometry -- deterministic vector renderer."),
  "unit202.current-direction.electron-flow-vs-conventional": mode("DETERMINISTIC_TECHNICAL", "Exact dual-arrow geometry -- deterministic vector renderer (ElectronFlowVsConventionalDiagram.tsx, CC-11.11)."),
  "unit202.gears.rotation-direction": mode("DETERMINISTIC_TECHNICAL", "Exact rotation-direction arrows -- deterministic vector renderer (GearDiagram.tsx)."),
  "unit202.waveform.sine": mode("DETERMINISTIC_TECHNICAL", "Exact waveform geometry -- deterministic vector renderer (WaveformSineDiagram.tsx)."),
  "unit202.components.symbols": mode("DETERMINISTIC_TECHNICAL", "IEC 60617 symbol geometry -- deterministic vector renderer (ComponentSymbolCard.tsx), never a generative source per the platform's own governed-symbol rule."),
  "unit202.rectification.waveforms": mode("DETERMINISTIC_TECHNICAL", "Exact waveform-shape geometry -- deterministic vector renderer (RectificationWaveformDiagram.tsx, CC-11.11)."),
  "unit202.capacitor.transient": mode("DETERMINISTIC_TECHNICAL", "Exact exponential-curve geometry -- deterministic vector renderer (CapacitorTransientDiagram.tsx, CC-11.11)."),
  "unit202.trigonometry": mode("DETERMINISTIC_TECHNICAL", "Exact triangle geometry -- deferred-scope, no renderer commissioned yet."),

  // --- Direction-sensitive states: baked per-state original redraws (CC-11.10/CC-11.12), not overlay ---
  "unit202.current-conductor.magnetic-field": mode(
    "ORIGINAL_REDRAW_FROM_REFERENCE",
    "Each of the 4 states is an independent original redraw from its own hand-authored exact-state reference board (flat 2D cross-section) -- current-direction marker and field-circulation direction are baked into each state's own master, never left to a shared neutral base plus overlay (CC-11.9 §3's own correction of the opposite mistake).",
  ),
  "unit202.motor.effect.horizontal-poles": mode(
    "ORIGINAL_REDRAW_FROM_REFERENCE",
    "Each of the 4 states is an independent original redraw from its own hand-authored exact-state reference board (one N/S pair, one field system, one current marker, one reference-authorised force arrow) -- CC-11.12 REDO_FAMILY remediation.",
  ),
  "unit202.motor.effect.vertical-poles": mode(
    "ORIGINAL_REDRAW_FROM_REFERENCE",
    "Same as the horizontal sibling -- 4 independent state-specific original redraws from hand-authored boards.",
  ),

  // --- right-hand-grip: the flagged model case (Product Owner decision item 6) ---
  "unit202.right-hand-grip.teaching": mode(
    "ORIGINAL_REDRAW_FROM_REFERENCE",
    "Grounded on the Wikimedia right-hand-grip-rule reference; hand/thumb/conductor geometry is correctly preserved across two attempts, but the field-circulation cue (which must wrap the conductor in the plane of the curled fingers, base-to-fingertip) has been freely invented by the generative model both times and has NOT reliably matched the governed relationship -- see the CC-11.13 visual-debt register (BLOCKING_CORRECTNESS) and PROJECT-STATUS.md §CC-11.13.",
    {
      recommendedFutureMode: "HYBRID_REDRAW_PLUS_DETERMINISTIC_OVERLAY",
      recommendedFutureModeRationale: "The hand/thumb/conductor base is reliably correct as a pure redraw; the field-circulation wrap cue is exactly the class of directional geometry this platform's own rule says must never be left to generative inference (see NO_GENERATIVE_INFERENCE_RELATIONSHIPS above). Recommended target: keep the original ALP hand redraw as the base, add the wrap-around circulation cue as a deterministic overlay (a governed curved-arrow primitive following the finger curl geometrically, not a freehand generative stroke).",
    },
  ),

  "unit202.fleming-left-hand.teaching": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Grounded on the Fleming's-left-hand-rule reference; digit assignment and mutual perpendicularity preserved correctly. Broadly acceptable per Product Owner review."),
  "unit202.fleming-right-hand.teaching": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Grounded on the Fleming's-right-hand-rule reference; broadly acceptable per Product Owner review."),

  "unit202.generator.rotating-loop.horizontal": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Grounded on the real, visible FAA Elementary_generator.svg reference (CC-11.12) -- topology (one loop, one shaft, two slip rings, two brushes) preserved exactly. Broadly acceptable per Product Owner review."),
  "unit202.generator.rotating-loop.vertical": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Same reference as the horizontal sibling, rotated to the edge-on pose. Broadly acceptable per Product Owner review."),

  // --- levers / pulleys / gears / magnet.field: original redrawn base + deterministic overlay for the state-varying annotation ---
  "unit202.levers.class-1": mode("HYBRID_REDRAW_PLUS_DETERMINISTIC_OVERLAY", "Base beam/fulcrum/effort/load redraw is original; the moment-balance state's effort-arm/load-arm distance callouts are a governed deterministic overlay on the same base (SAFE_SHARED_BASE)."),
  "unit202.levers.class-2": mode("HYBRID_REDRAW_PLUS_DETERMINISTIC_OVERLAY", "Same pattern as Class I; base redraw includes the corrected single FULCRUM label (CC-11.11), distance callouts are the deterministic overlay."),
  "unit202.levers.class-3": mode(
    "ORIGINAL_REDRAW_FROM_REFERENCE",
    "Excavator contamination removed (CC-11.12), correct Class III geometry (effort between fulcrum and load) achieved -- but the result is technically interpretable rather than pedagogically clear, and carries 2 extra inherited labels (RESISTANCE/MOTION) beyond the governed EFFORT/LOAD/FULCRUM set; one correction attempt made this worse (a bent-beam regression), not better. Not accepted as a successful improvement merely because it is interpretable -- see the CC-11.13 visual-debt register.",
    {
      recommendedFutureMode: "ORIGINAL_REDRAW_FROM_REFERENCE",
      recommendedFutureModeRationale: "Mode itself is correct and does not need to change -- the fix is a cleaner, more carefully constrained redraw pass (exact label set enforced up front, beam geometry locked from the reference, no mid-generation reinterpretation), not a different production mode. Evidence for why ORIGINAL_REDRAW_FROM_REFERENCE (never a forced 3D flourish, never continued retrying a poor re-interpretation) is the right default for this asset family.",
    },
  ),
  "unit202.pulleys.fixed": mode("HYBRID_REDRAW_PLUS_DETERMINISTIC_OVERLAY", "Base pulley-rig redraw is original; any state-varying rope/load annotation is a deterministic overlay."),
  "unit202.pulleys.movable": mode("HYBRID_REDRAW_PLUS_DETERMINISTIC_OVERLAY", "Same pattern as the fixed-pulley sibling."),
  "unit202.gears.driven-larger": mode("HYBRID_REDRAW_PLUS_DETERMINISTIC_OVERLAY", "Base gear-pair redraw is original; rotation-direction indication is the separate deterministic gears.rotation-direction asset, not baked here."),
  "unit202.gears.driven-smaller": mode("HYBRID_REDRAW_PLUS_DETERMINISTIC_OVERLAY", "Same pattern as the driven-larger sibling."),
  "unit202.gears.equal": mode("HYBRID_REDRAW_PLUS_DETERMINISTIC_OVERLAY", "Same pattern as the other gear-pair siblings."),
  "unit202.magnet.field": mode("HYBRID_REDRAW_PLUS_DETERMINISTIC_OVERLAY", "Base bar-magnet-and-field-line redraw is original (cleaned in CC-11.9); the density-comparison state adds a deterministic comparison callout to the same base (SAFE_SHARED_BASE)."),

  // --- other original redraws grounded on an exact technical reference ---
  "unit202.magnet.poles.like": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Grounded on the VFPt repelling-magnets reference; answer-bearing text removed, sharpened (CC-11.12)."),
  "unit202.magnet.poles.unlike": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Grounded on the VFPt attracting-magnets reference; answer-bearing text removed (CC-11.12)."),
  "unit202.magnet.permanent-vs-electromagnet": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Grounded on the coil-and-bar-magnet comparison reference; unmistakable battery/current-path added (CC-11.10)."),
  "unit202.resistivity.length-comparison": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Course-governed L/A notation enforced, baked conclusion removed (CC-11.12)."),
  "unit202.resistivity.area-comparison": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Course-governed L/A notation enforced, unified with its sibling's bar-shape style (CC-11.12)."),
  "unit202.emf.motional": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Redrawn as a minimal flat 2D board (B/v/l geometry preserved exactly) after CC-11.12 removed a photoreal 3D pipe-apparatus treatment -- direct evidence for the 2D-diagrammatic default (item D)."),
  "unit202.diode.bias-direction.forward": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Rebuilt as a flat schematic circuit (governed diode symbol + simple DC source + conventional-current arrow), replacing a photoreal/semiconductor-band composition (CC-11.12)."),
  "unit202.diode.bias-direction.reverse": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Same flat schematic family as the forward sibling -- only source polarity/current state differs (CC-11.12)."),
  "unit202.electrolysis": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Redrawn from a hand-authored exact-ion-arrow board; every cation/anion arrow direction preserved exactly, independently re-verified pixel-by-pixel (CC-11.12)."),
  "unit202.conductor-insulator": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Redrawn as a single labelled cutaway (conductor core / insulator sheath), replacing two near-identical cable photos (CC-11.12)."),

  // --- physical-recognition components: reference photo is the authority for physical form ---
  "unit202.instrument.clamp-meter": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Physical form grounded on a real reference photo."),
  "unit202.instrument.oscilloscope": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Physical form grounded on a real reference photo."),
  "unit202.components.physical.resistor": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Physical form grounded on a real reference photo; deterministic colour-band role labels (1st/2nd band, multiplier, tolerance) are the separate overlay concern noted in CC-11.12's KEEP_WITH_ANNOTATION finding, not yet wired."),
  "unit202.components.physical.capacitor": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Physical form grounded on a real reference photo; baked UK/IEC symbol removed for family consistency (CC-11.12)."),
  "unit202.components.physical.diode": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Physical form grounded on a real reference photo."),
  "unit202.components.physical.led": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Physical form grounded on a real reference photo."),
  "unit202.components.physical.thermistor": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Physical form grounded on a real reference photo."),
  "unit202.components.physical.transistor": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Physical form grounded on a real reference photo."),
  "unit202.components.physical.zener-diode": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Physical form grounded on a real reference photo."),
  "unit202.components.physical.photodiode": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Physical form grounded on a real reference photo."),
  "unit202.components.physical.diac": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Physical form grounded on a real reference photo."),
  "unit202.components.physical.triac": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Physical form grounded on a real reference photo."),
  "unit202.components.physical.thyristor-scr": mode("ORIGINAL_REDRAW_FROM_REFERENCE", "Physical form grounded on a cropped reference photo (isolated from a multi-package composite)."),

  // --- genuinely conceptual / generic, no single reference's exact geometry to preserve ---
  "unit202.heating-effect": mode("GENERATIVE_CONCEPTUAL", "Level-2 conceptual illustration of resistive heating; reference photo used as loose physical context only, not strict geometric authority."),
  "unit202.protective-devices": mode("GENERATIVE_CONCEPTUAL", "Generic, brand-neutral fuse/breaker comparison; no single reference's exact geometry is the authority."),
};

/** Resolves a state's production mode: exact state-key match first, then the owning assetId, matching how `semantic-reference-qa.ts`'s SEMANTIC_QA and this file are both keyed. */
export function productionModeFor(visualId: string): ProductionModeRecord | undefined {
  return PRODUCTION_MODE[visualId] ?? PRODUCTION_MODE[visualId.split(".state.")[0] ?? visualId];
}
