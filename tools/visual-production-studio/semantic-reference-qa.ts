/**
 * CC-11.12: semantic reference QA data model and the 51-record Product
 * Owner / ChatGPT semantic review of every CC-11.9–CC-11.11 generative
 * output, stored verbatim at
 * reports/instructional-visuals/reference-research/unit202/semantic-qa-cc11.12/.
 *
 * PERMANENT PRODUCT/CONTENT GOVERNANCE (VISUAL-REFERENCE-SEMANTIC-QA-
 * PRODUCT-DECISION.md, applies to all future modules/courses/
 * qualifications): a technical reference being authoritative, relevant,
 * licensed and mechanically `READY` (`reference-corrections.ts`'s own
 * `effectiveReferenceReadiness()`) does NOT by itself mean the actual
 * frame supplied to the image model is fit to compose from. This file is
 * the additive overlay recording that separate semantic judgement, one
 * record per governed learner-visible state (keyed by the exact
 * `stateId`/`assetId` the state QA was performed against, matching
 * catalogue.ts one-for-one), applied the same "additive overlay, never
 * an in-place rewrite" way `reference-corrections.ts` already is.
 *
 * `requiresApprovedSemanticQa()` is the hard gate: a generative job may
 * only proceed for a state whose `referenceDisposition` is
 * `APPROVED_DIRECT` or `APPROVED_PREPARED`. `REPLACE_REFERENCE` and
 * `REJECT_REFERENCE` block generation until a new frame is prepared and
 * re-reviewed -- there are none of the latter two in this package's own
 * 51-record review (every REDO entry resolves to a disposition this
 * package itself satisfies before generating), but the gate exists for
 * future reviews that may find one.
 */

export type SemanticQaStatus = "APPROVED" | "APPROVED_WITH_ANNOTATION" | "REDO_REQUIRED" | "REDO_MINOR_REQUIRED" | "REDO_FAMILY_REQUIRED";

export type ReferenceDisposition = "APPROVED_DIRECT" | "APPROVED_PREPARED" | "REPLACE_REFERENCE" | "REJECT_REFERENCE";

export interface SemanticQa {
  /** Source review-pack page, preserved for traceability back to the handover PDF. */
  reviewPage: number;
  semanticQaStatus: SemanticQaStatus;
  exactLearnerVisiblePurpose: string;
  keepElements: string[];
  cropRemoveElements: string[];
  requiredFinalElements: string[];
  prohibitedFinalElements: string[];
  modelMustNotInfer: string[];
  familyConsistencyRequirements: string[];
  assessmentLeakageConstraints: string[];
  ambiguityRisk: string;
  referenceDisposition: ReferenceDisposition;
  /** Verbatim from the Product Owner / ChatGPT handover -- never paraphrased. */
  semanticFinding: string;
  requiredAction: string;
}

function keep(reviewPage: number, purpose: string, finding: string, disposition: ReferenceDisposition = "APPROVED_DIRECT"): SemanticQa {
  return {
    reviewPage,
    semanticQaStatus: "APPROVED",
    exactLearnerVisiblePurpose: purpose,
    keepElements: ["entire existing approved composition"],
    cropRemoveElements: [],
    requiredFinalElements: [],
    prohibitedFinalElements: [],
    modelMustNotInfer: [],
    familyConsistencyRequirements: [],
    assessmentLeakageConstraints: [],
    ambiguityRisk: "None found on semantic review.",
    referenceDisposition: disposition,
    semanticFinding: finding,
    requiredAction: "Keep current output/reference.",
  };
}

export const SEMANTIC_QA: Record<string, SemanticQa> = {
  // --- KEEP (current-conductor.magnetic-field states) ---
  "unit202.current-conductor.magnetic-field.state.into-page-teaching": keep(2, "Teach that current into the page produces a clockwise field circulation.", "Simple, legible state-specific 2D teaching diagram.", "APPROVED_PREPARED"),
  "unit202.current-conductor.magnetic-field.state.into-page-assessment": keep(3, "Assess field-circulation direction given the current-into-page stimulus.", "Assessment retains X stimulus and withholds circulation.", "APPROVED_PREPARED"),
  "unit202.current-conductor.magnetic-field.state.out-of-page-teaching": keep(4, "Teach that current out of the page produces a counter-clockwise field circulation.", "Dot stimulus and counter-clockwise field circulation are clear.", "APPROVED_PREPARED"),
  "unit202.current-conductor.magnetic-field.state.out-of-page-assessment": keep(5, "Assess field-circulation direction given the current-out-of-page stimulus.", "Assessment withholds circulation.", "APPROVED_PREPARED"),

  // --- REDO: right-hand grip ---
  "unit202.right-hand-grip.teaching": {
    reviewPage: 6,
    semanticQaStatus: "REDO_REQUIRED",
    exactLearnerVisiblePurpose: "Teach that gripping a current-carrying conductor with the right hand, thumb along conventional current, gives the field-circulation direction shown by the CURL of the fingers -- the field arrow must visually trace the finger curl, not float as a separate cue.",
    keepElements: ["right hand", "thumb = conventional current direction", "conductor"],
    cropRemoveElements: ["the detached little-finger-to-index-finger arrow (reads as an unrelated hand-internal gesture, not field circulation)"],
    requiredFinalElements: ["a field-direction arrow that follows the curl of the fingers around the conductor (a curved arrow tracing the finger wrap, not a straight or detached stroke)"],
    prohibitedFinalElements: ["any arrow disconnected from the finger curl", "left hand", "thumb pointing away from conventional current"],
    modelMustNotInfer: ["which way the fingers curl -- must match the already-correct right-hand grip geometry, not be redrawn ambiguously"],
    familyConsistencyRequirements: ["remains visually distinct from the current-conductor.magnetic-field PHENOMENON asset (no hand there)"],
    assessmentLeakageConstraints: ["never appears in assessment -- teaching only, unchanged"],
    ambiguityRisk: "Detached arrow reads as an unrelated hand gesture rather than 'this is the direction the curled fingers point'.",
    referenceDisposition: "APPROVED_PREPARED",
    semanticFinding: "Handedness is correct, but the field-direction cue does not visually teach curled fingers = field circulation.",
    requiredAction: "Keep right-hand reference but require the magnetic-field arrow to follow the curl of the fingers around the conductor; remove detached little-finger-to-index-finger arrow.",
  },

  // --- REDO_FAMILY: motor effect, 8 states (horizontal + vertical, into/out, teaching/assessment) ---
  ...buildMotorEffectSemanticQa(),

  // --- KEEP (fleming mnemonics) ---
  "unit202.fleming-left-hand.teaching": keep(15, "Teach the Force/Field/Current mnemonic via the left hand.", "Clear mnemonic."),
  "unit202.fleming-right-hand.teaching": keep(18, "Teach the EMF/Field/Motion mnemonic via the right hand.", "Clear mnemonic."),

  // --- REDO: AC generator, both poses ---
  "unit202.generator.rotating-loop.horizontal": {
    reviewPage: 16,
    semanticQaStatus: "REDO_REQUIRED",
    exactLearnerVisiblePurpose: "Teach the elementary AC generator: one rectangular coil loop rotating on a shaft between fixed poles, connected via two separate slip rings and two stationary brushes to an external output -- the face-on pose (loop plane facing the poles, near-zero instantaneous EMF).",
    keepElements: ["one N/S pole pair", "one shaft", "two separate slip rings, concentric on the shaft", "two stationary brushes", "one rectangular loop", "output leads from the brushes"],
    cropRemoveElements: ["any second loop/coil-like structure", "any part of the reference beyond the elementary single-loop generator"],
    requiredFinalElements: ["exactly ONE unmistakable rectangular loop (must not be readable as two coils)", "one shaft", "two slip rings", "two brushes", "N/S pole labels", "a coherent electrical path from loop to output"],
    prohibitedFinalElements: ["a second/duplicate coil", "a split-ring commutator (that is a DC motor, not this AC generator)", "floating/disconnected rings", "decorative output wiring with no coherent path"],
    modelMustNotInfer: ["loop/shaft/slip-ring topology -- must be preserved exactly from the prepared reference, never reconstructed from memory or prose"],
    familyConsistencyRequirements: ["vertical sibling must show the SAME one-loop/one-shaft/two-ring system, only rotated to the edge-on pose"],
    assessmentLeakageConstraints: [],
    ambiguityRisk: "Prior output could reasonably be read as two loops/coils -- a genuine topology-reading ambiguity, not a cosmetic issue.",
    referenceDisposition: "APPROVED_PREPARED",
    semanticFinding: "Review says reference preview not found; generated topology is visually ambiguous and can read as two loops/coils.",
    requiredAction: "Use an actual visible exact reference. Preferred: FAA-derived public-domain Elementary generator.svg or explicit DOE Figure 1 crop. Prepare simplified face-on frame: ONE loop, shaft, two slip rings, two brushes, N/S, output.",
  },
  "unit202.generator.rotating-loop.vertical": {
    reviewPage: 17,
    semanticQaStatus: "REDO_REQUIRED",
    exactLearnerVisiblePurpose: "Same elementary AC generator, edge-on pose (loop plane edge-on to the poles, near-peak instantaneous EMF) -- must visibly be the same one-loop/one-shaft/two-ring system as the horizontal sibling, only rotated.",
    keepElements: ["one N/S pole pair", "one shaft", "two separate slip rings, concentric on the shaft", "two stationary brushes", "one rectangular loop", "output leads from the brushes"],
    cropRemoveElements: ["any second loop/coil-like structure"],
    requiredFinalElements: ["exactly ONE loop, visibly the SAME apparatus as the horizontal sibling, rotated to edge-on", "two slip rings", "two brushes", "N/S", "coherent output path"],
    prohibitedFinalElements: ["a second/duplicate coil", "a split-ring commutator", "an apparatus that looks like a different machine from its horizontal sibling"],
    modelMustNotInfer: ["the edge-on rotation -- the prepared reference frame itself must already show this pose, not be derived by the model rotating the face-on pose in its head"],
    familyConsistencyRequirements: ["must read as the same physical rig as unit202.generator.rotating-loop.horizontal, differing only in shaft rotation angle"],
    assessmentLeakageConstraints: [],
    ambiguityRisk: "Prior output was too complicated / not clearly the same one-loop system as its sibling.",
    referenceDisposition: "APPROVED_PREPARED",
    semanticFinding: "Current output is too complicated.",
    requiredAction: "Second exact frame from the same one-loop topology, rotated to edge-on/near-peak state. Must visibly be the same one loop/shaft/two-ring system.",
  },

  // --- KEEP (levers 1/2, pulleys) ---
  "unit202.levers.class-1": keep(19, "Teach Class I lever recognition.", "Single-class crop worked.", "APPROVED_PREPARED"),
  "unit202.levers.class-2": keep(20, "Teach Class II lever recognition.", "Clear Class II geometry and label defect resolved.", "APPROVED_PREPARED"),

  // --- REDO: Class III lever ---
  "unit202.levers.class-3": {
    reviewPage: 21,
    semanticQaStatus: "REDO_REQUIRED",
    exactLearnerVisiblePurpose: "Teach Class III lever recognition (effort between fulcrum and load) via the same abstract beam/fulcrum/block visual grammar as Class I and Class II.",
    keepElements: ["abstract Class-III beam/fulcrum/effort/load arrangement from the PSF source (or ThirdClassLever.svg directly)"],
    cropRemoveElements: ["the excavator/digger real-world example -- must never be passed to Gemini at all, not even as background context"],
    requiredFinalElements: ["ONE Class III arrangement only (fulcrum at one end, effort between fulcrum and load, load at the other end)", "EFFORT / LOAD / FULCRUM labels", "premium metallic beam finish matching Class I/II"],
    prohibitedFinalElements: ["any excavator, digger, bucket, hydraulic-arm or other real-world machine iconography", "Class I or Class II geometry mixed in"],
    modelMustNotInfer: [],
    familyConsistencyRequirements: ["must match the Class I/Class II family: same abstract beam-and-triangle-pivot grammar, same metallic finish, same white/light background, same label style"],
    assessmentLeakageConstraints: [],
    ambiguityRisk: "The excavator/digger reference cue previously contaminated generation into gearbox/actuator/bucket imagery entirely unlike the Class I/II family.",
    referenceDisposition: "APPROVED_PREPARED",
    semanticFinding: "Digger cue contaminated generation into gearbox/actuator/bucket.",
    requiredAction: "Crop ONLY abstract Class-III schematic from PSF source, excluding excavator/digger, or use direct ThirdClassLever.svg. Match Class I/II family.",
  },

  "unit202.pulleys.fixed": keep(22, "Teach fixed-pulley recognition.", "Clear."),
  "unit202.pulleys.movable": keep(23, "Teach movable-pulley recognition.", "Clear."),
  "unit202.magnet.field": keep(24, "Teach the bar-magnet external field pattern, N to S.", "Field direction and topology now good.", "APPROVED_PREPARED"),

  // --- REDO_MINOR: like/unlike magnet poles ---
  "unit202.magnet.poles.like": {
    reviewPage: 25,
    semanticQaStatus: "REDO_MINOR_REQUIRED",
    exactLearnerVisiblePurpose: "Teach that like poles repel, communicated entirely through field-line geometry (compressed/deflected between the magnets) and N/S labels -- no answer-bearing text.",
    keepElements: ["two bar magnets, like poles facing", "N/S labels", "compressed/deflected field-line geometry between the magnets"],
    cropRemoveElements: ["the word 'Repel'", "any explanatory force label/caption"],
    requiredFinalElements: ["sharp, crisp field-line rendering (prior output was fuzzy)", "N/S labels on both magnets", "field geometry that itself communicates repulsion (visible gap, deflected/compressed lines)"],
    prohibitedFinalElements: ["the word 'Repel' or any textual restatement of the answer", "force-arrow callout text"],
    modelMustNotInfer: [],
    familyConsistencyRequirements: ["same visual grammar as unit202.magnet.poles.unlike -- differ only in pole arrangement/spacing, not in labelling policy"],
    assessmentLeakageConstraints: ["this TEACHING asset's own labels are not an assessment-answer leak (the separate deterministic magnetic.pole_interaction diagram governs assessment reveal/withhold) -- but removing the explanatory text still improves pedagogical clarity"],
    ambiguityRisk: "Fuzzy rendering plus an explicit 'Repel' word makes the image read as an answer key rather than a phenomenon to interpret.",
    referenceDisposition: "APPROVED_PREPARED",
    semanticFinding: "Current output is fuzzy and adds unnecessary answer-like text.",
    requiredAction: "Clean/regenerate: no Repel word, no explanatory force label; field geometry and N/S should communicate repulsion; improve sharpness.",
  },
  "unit202.magnet.poles.unlike": {
    reviewPage: 26,
    semanticQaStatus: "REDO_MINOR_REQUIRED",
    exactLearnerVisiblePurpose: "Teach that unlike poles attract, communicated entirely through field-line geometry (merging lines between the magnets, close spacing) and N/S labels -- no answer-bearing text or arrow.",
    keepElements: ["two bar magnets, unlike poles facing", "N/S labels", "merging field-line geometry between the magnets"],
    cropRemoveElements: ["the word 'Attract'", "the double-headed attraction arrow"],
    requiredFinalElements: ["N/S labels on both magnets", "physically meaningful connecting field lines (merging between the magnets, consistent with attraction)"],
    prohibitedFinalElements: ["the word 'Attract'", "any double-headed arrow or other explicit force-direction callout"],
    modelMustNotInfer: [],
    familyConsistencyRequirements: ["same visual grammar as unit202.magnet.poles.like -- differ only in pole arrangement/spacing, not in labelling policy"],
    assessmentLeakageConstraints: ["this TEACHING asset's own labels are not an assessment-answer leak (the separate deterministic magnetic.pole_interaction diagram governs assessment reveal/withhold)"],
    ambiguityRisk: "Baked 'Attract' word and arrow read as an answer key rather than a phenomenon to interpret from field geometry.",
    referenceDisposition: "APPROVED_PREPARED",
    semanticFinding: "Field pattern should communicate attraction without baked answer words.",
    requiredAction: "Clean/regenerate: remove Attract and double-headed arrow; retain N/S and physically meaningful connecting field lines.",
  },

  "unit202.magnet.permanent-vs-electromagnet": keep(27, "Compare a permanent magnet with an electromagnet, showing an unmistakable current path.", "Battery/current-path defect fixed."),
  "unit202.instrument.clamp-meter": keep(28, "Physical recognition of a clamp meter.", "Good recognition asset."),
  "unit202.instrument.oscilloscope": keep(29, "Physical recognition of an oscilloscope.", "Good recognition asset."),
  "unit202.gears.driven-larger": keep(30, "Teach driven-gear-larger-than-driver size relationship.", "Clear."),
  "unit202.gears.driven-smaller": keep(31, "Teach driven-gear-smaller-than-driver size relationship.", "Clear."),
  "unit202.gears.equal": keep(32, "Teach equal-size driver/driven gears.", "Clear."),

  // --- REDO_FAMILY: resistivity length/area comparison ---
  "unit202.resistivity.length-comparison": {
    reviewPage: 33,
    semanticQaStatus: "REDO_FAMILY_REQUIRED",
    exactLearnerVisiblePurpose: "Teach R proportional to L: two wires of the same material and cross-sectional area, differing only in length, using the course's own governed notation (L, A).",
    keepElements: ["same-material wire comparison composition", "clear length difference between the two samples"],
    cropRemoveElements: ["the inherited 'S' cross-sectional-area notation from the source geometry reference"],
    requiredFinalElements: ["length labelled L (or L / 2L, etc.)", "cross-sectional area labelled A if labelled at all -- never S", "same material/finish on both samples", "only length varies"],
    prohibitedFinalElements: ["the symbol S for area or any other course-inconsistent notation", "a second varying variable (area or material must stay fixed)"],
    modelMustNotInfer: ["which variable is fixed vs varied -- both samples must be visibly the same material and area, only length different"],
    familyConsistencyRequirements: ["matched sibling with unit202.resistivity.area-comparison: same rendering style, same notation (L, A), same minimal-label policy"],
    assessmentLeakageConstraints: ["keep labels neutral/minimal where this asset may be reused for assessment -- do not bake a conclusion (e.g. 'longer = more resistance') as text"],
    ambiguityRisk: "Source notation S directly conflicts with the course's governed R = ρL/A notation, teaching the wrong symbol.",
    referenceDisposition: "APPROVED_PREPARED",
    semanticFinding: "Source notation S conflicts with course R=ρL/A.",
    requiredAction: "Prepare controlled board using A for cross-sectional area or no area symbol. Remove inherited S. Same material/A, vary only L; avoid baked conclusion if reuse/assessment needs neutrality.",
  },
  "unit202.resistivity.area-comparison": {
    reviewPage: 34,
    semanticQaStatus: "REDO_FAMILY_REQUIRED",
    exactLearnerVisiblePurpose: "Teach R inversely proportional to A: two wires of the same material and length, differing only in cross-sectional area, using the course's own governed notation (L, A).",
    keepElements: ["same-material wire comparison composition", "clear area difference between the two samples"],
    cropRemoveElements: ["the inherited 'S' cross-sectional-area notation from the source geometry reference"],
    requiredFinalElements: ["cross-sectional area labelled A / 2A consistently", "length labelled L if labelled at all, held fixed", "same material/finish on both samples", "only area varies"],
    prohibitedFinalElements: ["the symbol S for area", "a second varying variable (length or material must stay fixed)"],
    modelMustNotInfer: ["which variable is fixed vs varied -- both samples must be visibly the same material and length, only area different"],
    familyConsistencyRequirements: ["matched sibling with unit202.resistivity.length-comparison: same rendering style, same notation (L, A), same minimal-label policy"],
    assessmentLeakageConstraints: ["minimal labels where reuse/assessment needs neutrality"],
    ambiguityRisk: "Family must use one governed notation/grammar, not each sibling inventing its own.",
    referenceDisposition: "APPROVED_PREPARED",
    semanticFinding: "Family should use one governed notation/grammar.",
    requiredAction: "Rebuild as matched sibling: same material/L, vary only A; use A/2A consistently; minimal labels.",
  },

  // --- REDO: motional EMF ---
  "unit202.emf.motional": {
    reviewPage: 35,
    semanticQaStatus: "REDO_REQUIRED",
    exactLearnerVisiblePurpose: "Teach motional EMF geometry: one conductor moving with velocity v through a magnetic field B, generating an EMF along length L -- a minimal, unambiguous 2D technical diagram, not a photoreal apparatus render.",
    keepElements: ["one moving conductor", "B-field convention (dot/cross or arrows)", "v arrow", "L dimension"],
    cropRemoveElements: ["photoreal pipe-like / 3D-surface apparatus rendering from any prior attempt"],
    requiredFinalElements: ["one conductor (rails only if strictly needed for the circuit)", "one B convention", "one v arrow", "one L dimension label"],
    prohibitedFinalElements: ["photoreal 3D pipes, tubes, or apparatus casings", "any second competing conductor/rail system not needed for the minimal circuit"],
    modelMustNotInfer: ["the B/v/l geometric relationship -- must be preserved from the authoritative motional-EMF panel, not re-imagined as a 3D scene"],
    familyConsistencyRequirements: [],
    assessmentLeakageConstraints: [],
    ambiguityRisk: "Prior pseudo-3D photoreal rendering destroyed the clarity a minimal technical diagram needs.",
    referenceDisposition: "APPROVED_PREPARED",
    semanticFinding: "Current pseudo-3D output destroys clarity.",
    requiredAction: "Minimal verified 2D reference: one moving conductor, rails only if needed, one B convention, one v arrow, one l dimension. Forbid photoreal/3D pipe-like apparatus.",
  },

  // --- KEEP_WITH_ANNOTATION: resistor ---
  "unit202.components.physical.resistor": {
    reviewPage: 36,
    semanticQaStatus: "APPROVED_WITH_ANNOTATION",
    exactLearnerVisiblePurpose: "Physical recognition of an axial resistor, with its colour bands available for deterministic colour-code teaching composition (1st band, 2nd band, multiplier, tolerance).",
    keepElements: ["existing approved physical resistor raster"],
    cropRemoveElements: [],
    requiredFinalElements: ["native/deterministic role labels for 1st band, 2nd band, multiplier, tolerance, added at the composition layer (not baked into the raster), when colour-code teaching is active"],
    prohibitedFinalElements: ["re-generating the raster itself -- the physical form is already correct and strong"],
    modelMustNotInfer: [],
    familyConsistencyRequirements: ["matches the rest of the components.physical.* family in background/scale/label treatment"],
    assessmentLeakageConstraints: [],
    ambiguityRisk: "None in the raster itself; the gap is missing deterministic band-role labelling for teaching composition, not a defect in the image.",
    referenceDisposition: "APPROVED_DIRECT",
    semanticFinding: "Physical form is strong; band-role labels are pedagogically important.",
    requiredAction: "Keep physical resistor; add native/deterministic labels for 1st band, 2nd band, multiplier, tolerance when colour-code teaching is active.",
  },

  // --- REDO_MINOR: capacitor (remove baked symbol) ---
  "unit202.components.physical.capacitor": {
    reviewPage: 37,
    semanticQaStatus: "REDO_MINOR_REQUIRED",
    exactLearnerVisiblePurpose: "Physical recognition of a capacitor component only -- the UK/IEC schematic symbol is a separate, deterministic card, never baked into the physical-recognition raster.",
    keepElements: ["existing approved physical capacitor reference/geometry"],
    cropRemoveElements: ["the UK/IEC circuit symbol, if present anywhere in the physical-recognition raster"],
    requiredFinalElements: ["physical capacitor component + name only"],
    prohibitedFinalElements: ["any schematic/circuit symbol baked into this raster"],
    modelMustNotInfer: [],
    familyConsistencyRequirements: ["must match every other components.physical.* asset: component + name, no baked symbol -- capacitor was the sole outlier"],
    assessmentLeakageConstraints: [],
    ambiguityRisk: "Including the symbol only on this one asset breaks the family's own consistency rule (component-recognition vs symbol-recognition are governed as separate concerns).",
    referenceDisposition: "APPROVED_PREPARED",
    semanticFinding: "Capacitor breaks family consistency if it alone includes the symbol.",
    requiredAction: "Keep physical capacitor reference but remove UK/IEC symbol from physical-recognition raster if present. Symbol remains separate deterministic card.",
  },

  "unit202.components.physical.diode": keep(38, "Physical recognition of a diode.", "Good recognition asset."),
  "unit202.components.physical.led": keep(39, "Physical recognition of an LED.", "Good recognition asset."),
  "unit202.components.physical.thermistor": keep(40, "Physical recognition of a thermistor.", "Good recognition asset."),
  "unit202.components.physical.transistor": keep(41, "Physical recognition of a transistor.", "Good recognition asset."),

  // --- REDO_FAMILY: diode bias forward/reverse ---
  "unit202.diode.bias-direction.forward": {
    reviewPage: 42,
    semanticQaStatus: "REDO_FAMILY_REQUIRED",
    exactLearnerVisiblePurpose: "Teach forward bias: anode more positive than cathode, current flows -- a simplified Level-2 circuit diagram (governed diode symbol + simple DC source + conventional-current arrow), not a semiconductor-physics band diagram.",
    keepElements: ["governed diode schematic symbol", "simple DC source", "conventional-current arrow"],
    cropRemoveElements: ["any semiconductor-band-diagram composition authority from a prior attempt"],
    requiredFinalElements: ["diode symbol oriented for forward bias", "source polarity matching forward bias (anode side more positive)", "visible current-flow indicator", "FORWARD BIAS label"],
    prohibitedFinalElements: ["semiconductor depletion-band/energy-band imagery as the composition basis", "any current indicator suggesting current is blocked"],
    modelMustNotInfer: ["which terminal is anode/cathode or which way current flows -- the prepared circuit reference must already encode this exactly"],
    familyConsistencyRequirements: ["identical circuit layout to unit202.diode.bias-direction.reverse -- only source polarity/current state differs, a true one-variable comparison"],
    assessmentLeakageConstraints: [],
    ambiguityRisk: "A semiconductor-band reference is the wrong composition authority for Level-2 teaching -- it is a different, more advanced representation than the syllabus depth requires.",
    referenceDisposition: "APPROVED_PREPARED",
    semanticFinding: "Current image is hard to understand; semiconductor-band reference is the wrong composition authority.",
    requiredAction: "Build exact Level-2 reference using governed diode symbol, simple DC source and conventional-current arrow. Same composition as reverse sibling.",
  },
  "unit202.diode.bias-direction.reverse": {
    reviewPage: 43,
    semanticQaStatus: "REDO_FAMILY_REQUIRED",
    exactLearnerVisiblePurpose: "Teach reverse bias: cathode more positive than anode, current blocked -- identical circuit layout to the forward sibling, only source polarity/current state changes.",
    keepElements: ["governed diode schematic symbol", "simple DC source", "same circuit layout as the forward sibling"],
    cropRemoveElements: ["any semiconductor-band-diagram composition authority from a prior attempt"],
    requiredFinalElements: ["diode symbol oriented for reverse bias", "source polarity matching reverse bias (cathode side more positive)", "current clearly shown as blocked (e.g. a blocked/X indicator)", "REVERSE BIAS label"],
    prohibitedFinalElements: ["semiconductor depletion-band/energy-band imagery as the composition basis", "any indicator suggesting current flows"],
    modelMustNotInfer: ["which terminal is anode/cathode or the blocked-current state -- the prepared circuit reference must already encode this exactly"],
    familyConsistencyRequirements: ["identical circuit layout to unit202.diode.bias-direction.forward -- only source polarity/current state differs, a true one-variable comparison"],
    assessmentLeakageConstraints: [],
    ambiguityRisk: "Same wrong-composition-authority risk as the forward sibling; also the specific historical risk (CC-11.10) of accidentally wiring this as forward bias despite the REVERSE BIAS caption.",
    referenceDisposition: "APPROVED_PREPARED",
    semanticFinding: "Forward/reverse should be a one-variable comparison.",
    requiredAction: "Use same circuit as forward sibling; reverse only source polarity/state and show blocked current clearly.",
  },

  "unit202.components.physical.zener-diode": keep(44, "Physical recognition of a zener diode.", "Good recognition asset."),
  "unit202.components.physical.photodiode": keep(45, "Physical recognition of a photodiode.", "Good recognition asset."),
  "unit202.components.physical.diac": keep(46, "Physical recognition of a DIAC.", "Good recognition asset."),
  "unit202.components.physical.triac": keep(47, "Physical recognition of a TRIAC.", "Good recognition asset."),
  "unit202.components.physical.thyristor-scr": keep(48, "Physical recognition of a thyristor/SCR.", "Crop was appropriate.", "APPROVED_PREPARED"),

  // --- REDO: electrolysis ---
  "unit202.electrolysis": {
    reviewPage: 49,
    semanticQaStatus: "REDO_REQUIRED",
    exactLearnerVisiblePurpose: "Teach the electrolysis current path: battery, electrolyte, two electrodes, and correct ion migration -- every cation arrow points to the cathode, every anion arrow points to the anode, with no measurement instruments.",
    keepElements: ["battery/source with +/- terminals", "cathode and anode electrodes", "electrolyte vessel", "current-path wiring"],
    cropRemoveElements: ["voltmeter, ammeter, or any other measurement instrument if reintroduced"],
    requiredFinalElements: ["battery", "electrodes (labelled cathode/anode)", "electrolyte", "EVERY ion arrow already correct in the prepared board: all cations -> cathode, all anions -> anode"],
    prohibitedFinalElements: ["voltmeter", "ammeter", "any bench power-supply box in addition to the simple battery symbol", "any invented wire directly shorting the two electrodes"],
    modelMustNotInfer: ["ion-migration direction -- every arrow must already be correct in the prepared board; Gemini may restyle rendering but must not add, remove, or reverse any arrow"],
    familyConsistencyRequirements: [],
    assessmentLeakageConstraints: [],
    ambiguityRisk: "A prior automated technical PASS missed at least one visibly wrong cation-side arrow -- this is exactly the class of micro-directional defect pixel-level audit must catch, not just a plausible-looking overall composition.",
    referenceDisposition: "APPROVED_PREPARED",
    semanticFinding: "At least one cation-side arrow is visibly wrong despite automated PASS.",
    requiredAction: "Prepare exact board with battery, electrodes, electrolyte, cations/anions and EVERY ion arrow already correct. Cations→cathode; anions→anode. No meters. Gemini may restyle but not add/remove/reverse arrows.",
  },

  "unit202.heating-effect": keep(50, "Teach the heating effect of electric current at a Level-2 conceptual level.", "Adequate Level-2 phenomenon image."),

  // --- REDO: conductor vs insulator ---
  "unit202.conductor-insulator": {
    reviewPage: 51,
    semanticQaStatus: "REDO_REQUIRED",
    exactLearnerVisiblePurpose: "Teach the conceptual comparison between a conductor and an insulator with unmistakable, visually distinct roles -- not two near-identical stripped cables.",
    keepElements: ["conductive metal core", "insulating polymer sheath"],
    cropRemoveElements: ["'Stranded lamp wire.jpg' retired as the primary composition reference (two near-identical stripped cables do not teach the comparison)"],
    requiredFinalElements: ["an unmistakable conductor role (bare/exposed conductive metal, clearly current-carrying)", "an unmistakable insulator role (clearly non-conductive polymer/sheath material)", "purpose-built cutaway or controlled metal-vs-polymer comparison composition"],
    prohibitedFinalElements: ["two visually near-identical stripped cable ends as the sole comparison"],
    modelMustNotInfer: [],
    familyConsistencyRequirements: [],
    assessmentLeakageConstraints: [],
    ambiguityRisk: "The prior reference was technically relevant (a real stripped cable) but pedagogically weak -- it did not visually teach the conceptual distinction.",
    referenceDisposition: "APPROVED_PREPARED",
    semanticFinding: "Two near-identical stripped cables do not teach the conceptual comparison.",
    requiredAction: "Retire Stranded lamp wire.jpg as primary teaching reference. Build purpose-specific cable cutaway or controlled metal-vs-polymer comparison with unmistakable conductor/insulator roles.",
  },

  "unit202.protective-devices": keep(52, "Compare a generic fuse and a generic circuit breaker.", "Clear generic comparison."),
};

function buildMotorEffectSemanticQa(): Record<string, SemanticQa> {
  const out: Record<string, SemanticQa> = {};
  const families: Array<{ slug: "horizontal-poles" | "vertical-poles"; poleLabel: string; forcePlane: string }> = [
    { slug: "horizontal-poles", poleLabel: "N/S poles arranged horizontally (side by side)", forcePlane: "vertical (up/down)" },
    { slug: "vertical-poles", poleLabel: "N/S poles arranged vertically (stacked)", forcePlane: "horizontal (left/right)" },
  ];
  const pages: Record<string, number> = {
    "horizontal-poles.into-page-teaching": 7,
    "horizontal-poles.into-page-assessment": 8,
    "horizontal-poles.out-of-page-teaching": 9,
    "horizontal-poles.out-of-page-assessment": 10,
    "vertical-poles.into-page-teaching": 11,
    "vertical-poles.into-page-assessment": 12,
    "vertical-poles.out-of-page-teaching": 13,
    "vertical-poles.out-of-page-assessment": 14,
  };
  for (const { slug, poleLabel, forcePlane } of families) {
    for (const direction of ["into-page", "out-of-page"] as const) {
      for (const mode of ["teaching", "assessment"] as const) {
        const stateId = `unit202.motor.effect.${slug}.state.${direction}-${mode}`;
        const pageKey = `${slug}.${direction}-${mode}`;
        const isTeaching = mode === "teaching";
        out[stateId] = {
          reviewPage: pages[pageKey]!,
          semanticQaStatus: "REDO_FAMILY_REQUIRED",
          exactLearnerVisiblePurpose: `${isTeaching ? "Teach" : "Assess"} the motor effect for ${poleLabel}, current ${direction.replace("-", " ")}${isTeaching ? " -- force direction revealed" : " -- force direction withheld, current direction given"}.`,
          keepElements: ["ONE N/S pole pair", `ONE N→S magnetic-field-line system (${poleLabel})`, "ONE X/dot current marker at the conductor"],
          cropRemoveElements: ["any competing/duplicated second field-line or force-line system"],
          requiredFinalElements: isTeaching
            ? ["ONE N/S pair", "ONE field-line system", "ONE current marker (X for into-page, dot for out-of-page)", "ONE force arrow, already correct in the prepared reference board (never re-derived during generation)"]
            : ["ONE N/S pair", "ONE field-line system", "ONE current marker matching the teaching sibling (the given stimulus)"],
          prohibitedFinalElements: isTeaching
            ? ["a second/competing field or force line system", "any force arrow not already authorised by the prepared board"]
            : ["any force arrow or other reveal of the assessed force direction", "text such as 'Force' unless used consistently across the whole family"],
          modelMustNotInfer: ["force direction -- must come from the prepared, reference-authorised board only; Claude/Gemini must never independently re-derive it during generation"],
          familyConsistencyRequirements: [
            "exact same apparatus (pole pair, field system, current marker) as its teaching/assessment sibling -- assessment differs from teaching ONLY by the withheld force arrow",
            `same one-N/S-pair, one-field-system, one-marker grammar as the ${slug === "horizontal-poles" ? "vertical-poles" : "horizontal-poles"} sibling family, force plane differing (${forcePlane}) because the pole orientation genuinely differs`,
          ],
          assessmentLeakageConstraints: isTeaching ? [] : ["force direction is the assessed answer and must not appear anywhere in the image"],
          ambiguityRisk: "Pedagogically opaque; competing/duplicated field/force cues made the prior output hard to interpret as one coherent apparatus.",
          referenceDisposition: "APPROVED_PREPARED",
          semanticFinding: isTeaching ? "Pedagogically opaque; competing/duplicated field/force cues." : "Assessment sibling should differ only by answer cue.",
          requiredAction: isTeaching
            ? "Build exact state reference: one N/S pair, one N→S magnetic-field-line system, X/dot conductor marker, one reference-authorised force arrow. No direction re-derivation."
            : "Same exact apparatus as teaching sibling but withhold force arrow only.",
        };
      }
    }
  }
  return out;
}

/** CC-11.12 hard gate: a generative job may only proceed for a state whose semantic-QA disposition is APPROVED_DIRECT or APPROVED_PREPARED. */
export function requiresApprovedSemanticQa(visualId: string): boolean {
  const qa = SEMANTIC_QA[visualId];
  if (!qa) return false; // no QA record yet -- caller decides whether that itself blocks (e.g. a brand-new asset never reviewed).
  return qa.referenceDisposition === "APPROVED_DIRECT" || qa.referenceDisposition === "APPROVED_PREPARED";
}

export function semanticQaFor(visualId: string): SemanticQa | undefined {
  return SEMANTIC_QA[visualId];
}
