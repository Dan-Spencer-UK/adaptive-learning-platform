# Unit 202 -- Complete Visual Reference Research Pack

Generated: 2026-08-24T21:58:24.205Z

One entry per distinct required final image (53 total). Source: `tools/visual-production-studio/catalogue.ts` (live, unmodified). See `unit202-reference-research-summary.md` for totals and traceability.

## Right-hand grip rule / field around a conductor

*Family:* `unit202.family.right-hand-grip` -- 2 distinct final image(s). Teach both the electromagnetic phenomenon (a current-carrying conductor is surrounded by a circulating magnetic field) and the mnemonic used to predict that field's direction from the current's direction.

*Family notes:* Two assets, not one: the phenomenon a learner must recognise (a field genuinely circulates around any current-carrying conductor) is a distinct fact from the mnemonic used to predict its direction, and conflating them into a single image risks the learner memorising the hand gesture without understanding what it predicts. A third role, ASSESSMENT_SUPPORT (a deterministic technical stimulus with no hand), already exists as the governed CC-05D deterministic diagram `magnetic.field_conductor_direction` (see apps/mobile/src/components/diagrams/RightHandGripRuleDiagram.tsx) -- it is not duplicated here as a premium asset because its correctness is already fully governed and pixel-reviewed by the existing deterministic pipeline.

### Magnetic field around a current-carrying conductor

- **assetId:** `unit202.current-conductor.magnetic-field`
- **Role / production class:** PHENOMENON / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P0
- **Curriculum context:** LO5 — lesson.magnetism.effects-of-current
- **Instructional purpose:** Show the actual electromagnetic phenomenon that the right-hand grip mnemonic predicts, independent of the mnemonic itself.
- **Learner-visible deliverable:** One premium illustration of a straight conductor with concentric magnetic field lines circulating around it -- direction-neutral, with no baked current-direction or circulation arrowheads (those are added deterministically per state), matching the reference field geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - straight current-carrying conductor
  - magnetic field circulates around the conductor (closed concentric loops, not radiating outward)
  - reversing the current reverses the direction of circulation
  - any depiction of field strength must not contradict a stronger field nearer the conductor
  - the concentric field-line pattern is rotationally symmetric -- do not bake in a specific current direction or circulation sense
- **Prohibited changes:**
  - do not include a hand in this asset -- that is the separate MNEMONIC asset in this family
  - do not bake a specific current direction or circulation-arrow sense into the base artwork -- CC-11.7B correction: this base must safely serve BOTH current directions via deterministic overlay, never a redraw
- **Labels:** required=false pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=CLEAN_BASE_ART_WITH_DETERMINISTIC_OVERLAY
- **Canonical learner-visible states (4):**
  - Current into page — field circulation revealed (teaching) [TEACHING]
  - Current into page — field circulation withheld (assessment) [ASSESSMENT]
  - Current out of page — field circulation revealed (teaching) [TEACHING]
  - Current out of page — field circulation withheld (assessment) [ASSESSMENT]

**Current reference**
- Title: Wikimedia Commons — Right-hand grip rule.svg (field-line geometry only, not the hand)
- URL: https://commons.wikimedia.org/wiki/File:Right-hand_grip_rule.svg
- Licence: Public-domain dedication
- Quality grade: A

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **MEDIUM**
- notesForReferenceResearch: No confirmed problem on record. Shares the identical reference URL with 1 sibling asset(s) (unit202.right-hand-grip.teaching) -- verify this file is not an unlabelled composite requiring per-asset isolation (cf. unit202.levers.class-1, confirmed composite in the CC-11.8 proof) before treating it as fully approved for this specific asset.
- Shares its reference URL with: unit202.right-hand-grip.teaching

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/current-conductor-magnetic-field-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: SAVED
- Governed diagram blueprint: magnetic.field_conductor_direction

---

### Right-hand grip rule — teaching mnemonic

- **assetId:** `unit202.right-hand-grip.teaching`
- **Role / production class:** MNEMONIC / HYBRID / PREMIUM TEACHING
- **Need classification:** REQUIRED
- **Priority:** P0
- **Curriculum context:** LO5 — lesson.magnetism.effects-of-current
- **Instructional purpose:** Teach that gripping a current-carrying conductor with the right hand, thumb along conventional current direction, gives the direction the magnetic field circulates as shown by the curled fingers.
- **Learner-visible deliverable:** One premium illustration of a right hand gripping a straight current-carrying conductor, thumb and curled fingers clearly demonstrating the rule. Include the explanatory annotations THUMB = CURRENT and FINGERS = MAGNETIC FIELD plus the correct current and magnetic-field direction indicators -- this is a TEACHING asset and clear labels are part of the deliverable, not something to omit for visual cleanliness. Matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - RIGHT hand
  - thumb = conventional current direction
  - curled fingers = magnetic-field circulation direction
  - reversing current reverses magnetic-field rotation
  - straight conductor axis
- **Prohibited changes:**
  - do not swap to the left hand
  - do not depict the thumb pointing anywhere other than along the conductor's conventional current direction
  - DO NOT MIRROR OR HORIZONTALLY FLIP HAND-RULE ARTWORK. Mirroring may change handedness (a mirrored right hand can read as a left hand) and invalidate the mnemonic -- never use a mirror/flip transform of this image to represent a reversed current direction.
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Right-hand grip mnemonic (teaching only) [TEACHING]

**Current reference**
- Title: Wikimedia Commons — Right-hand grip rule.svg
- URL: https://commons.wikimedia.org/wiki/File:Right-hand_grip_rule.svg
- Licence: Public-domain dedication
- Quality grade: A

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **MEDIUM**
- notesForReferenceResearch: No confirmed problem on record. Shares the identical reference URL with 1 sibling asset(s) (unit202.current-conductor.magnetic-field) -- verify this file is not an unlabelled composite requiring per-asset isolation (cf. unit202.levers.class-1, confirmed composite in the CC-11.8 proof) before treating it as fully approved for this specific asset.
- Shares its reference URL with: unit202.current-conductor.magnetic-field

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/teaching/right-hand-grip-teaching-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: SAVED
- Governed diagram blueprint: magnetic.field_conductor_direction

---

## Fleming's left-hand rule / motor effect

*Family:* `unit202.family.fleming-left-hand-motor` -- 3 distinct final image(s). Teach the motor-effect phenomenon (a force on a current-carrying conductor in a magnetic field) and the mnemonic used to predict its direction.

*Family notes:* Phenomenon and mnemonic are genuinely distinct facts, same reasoning as the right-hand-grip family -- these two assets already existed separately in the prior flat catalogue and are grouped here without any content change.

### Motor effect — conductor in magnetic field (N/S poles arranged horizontally)

- **assetId:** `unit202.motor.effect.horizontal-poles`
- **Role / production class:** PHENOMENON / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P0
- **Curriculum context:** LO5 — lesson.magnetism.effects-of-current
- **Instructional purpose:** Show a current-carrying conductor between magnetic poles (N/S poles arranged horizontally) experiencing a force perpendicular to both the field and the current (the motor effect), distinct from the Fleming's-left-hand mnemonic itself.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium illustration of magnet poles arranged horizontally with a conductor between them, direction-neutral (no baked current/force arrows), ready to receive deterministic N/S, current and force overlays, matching the existing governed motor-effect geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - N to S field direction
  - conductor positioned between the poles
  - poles arranged horizontally -- this specific orientation is the defining physical fact of this asset, never mixed with the sibling orientation asset
  - current explicitly into or out of the page -- the base artwork must not bake in either direction (deterministic overlay per state)
  - resulting force perpendicular to both field and current
  - must remain visually distinct from the hand-rule mnemonic asset
- **Prohibited changes:**
  - do not include a hand in this asset -- that is the separate MNEMONIC asset in this family
  - do not depict the vertical pole arrangement in this asset -- that is the sibling ProductionAsset
  - do not bake a specific current or force direction into the base artwork -- this base must safely serve both current directions via deterministic overlay
- **Labels:** required=false pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=CLEAN_BASE_ART_WITH_DETERMINISTIC_OVERLAY
- **Canonical learner-visible states (4):**
  - N/S/horizontal poles, current into page — force revealed (teaching) [TEACHING]
  - N/S/horizontal poles, current into page — force withheld (assessment) [ASSESSMENT]
  - N/S/horizontal poles, current out of page — force revealed (teaching) [TEACHING]
  - N/S/horizontal poles, current out of page — force withheld (assessment) [ASSESSMENT]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/motor-effect-horizontal-poles-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: motor.force_field_current

---

### Motor effect — conductor in magnetic field (N/S poles arranged vertically)

- **assetId:** `unit202.motor.effect.vertical-poles`
- **Role / production class:** PHENOMENON / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P0
- **Curriculum context:** LO5 — lesson.magnetism.effects-of-current
- **Instructional purpose:** Show a current-carrying conductor between magnetic poles (N/S poles arranged vertically) experiencing a force perpendicular to both the field and the current (the motor effect), distinct from the Fleming's-left-hand mnemonic itself.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium illustration of magnet poles arranged vertically with a conductor between them, direction-neutral (no baked current/force arrows), ready to receive deterministic N/S, current and force overlays, matching the existing governed motor-effect geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - N to S field direction
  - conductor positioned between the poles
  - poles arranged vertically -- this specific orientation is the defining physical fact of this asset, never mixed with the sibling orientation asset
  - current explicitly into or out of the page -- the base artwork must not bake in either direction (deterministic overlay per state)
  - resulting force perpendicular to both field and current
  - must remain visually distinct from the hand-rule mnemonic asset
- **Prohibited changes:**
  - do not include a hand in this asset -- that is the separate MNEMONIC asset in this family
  - do not depict the horizontal pole arrangement in this asset -- that is the sibling ProductionAsset
  - do not bake a specific current or force direction into the base artwork -- this base must safely serve both current directions via deterministic overlay
- **Labels:** required=false pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=CLEAN_BASE_ART_WITH_DETERMINISTIC_OVERLAY
- **Canonical learner-visible states (4):**
  - N/S/vertical poles, current into page — force revealed (teaching) [TEACHING]
  - N/S/vertical poles, current into page — force withheld (assessment) [ASSESSMENT]
  - N/S/vertical poles, current out of page — force revealed (teaching) [TEACHING]
  - N/S/vertical poles, current out of page — force withheld (assessment) [ASSESSMENT]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/motor-effect-vertical-poles-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: motor.force_field_current

---

### Fleming left-hand rule — motor teaching mnemonic

- **assetId:** `unit202.fleming-left-hand.teaching`
- **Role / production class:** MNEMONIC / HYBRID / PREMIUM TEACHING
- **Need classification:** REQUIRED
- **Priority:** P0
- **Curriculum context:** LO5 — lesson.magnetism.effects-of-current
- **Instructional purpose:** Teach the motor-effect hand mnemonic: thuMb = Motion/force, First finger = Field, seCond finger = Current, each mutually perpendicular on the left hand.
- **Learner-visible deliverable:** One premium illustration of a left hand with thumb, first finger and second finger held mutually perpendicular, clearly and unambiguously demonstrating Force/Field/Current correspondence. Include the explanatory annotations MOTION / FORCE, FIELD and CURRENT on the corresponding digit -- this is a TEACHING asset and clear labels are part of the deliverable. Matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - LEFT hand
  - thumb = force/motion
  - first (index) finger = magnetic FIELD
  - second (middle) finger = conventional CURRENT
  - mutually perpendicular relationship between all three
- **Prohibited changes:**
  - do not swap to the right hand
  - do not reassign which finger represents which quantity
  - DO NOT MIRROR OR HORIZONTALLY FLIP HAND-RULE ARTWORK. Mirroring may change handedness (a mirrored left hand can read as a right hand) and invalidate the mnemonic -- never use a mirror/flip transform of this image for any other pole/current combination.
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Fleming's left-hand mnemonic (teaching only) [TEACHING]

**Current reference**
- Title: Wikimedia Commons — Fleming's Left Hand Rule.png
- URL: https://commons.wikimedia.org/wiki/File:Fleming%27s_Left_Hand_Rule.png
- Licence: Openly licensed -- treat primarily as geometry/reference, not artwork to imitate
- Quality grade: B visual / strong semantic cross-check

**Reference-research flags**
- requiresReferenceResearch: **false**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **MEDIUM**
- notesForReferenceResearch: No confirmed problem on record. Standard appraisal welcome (geometry/topology match, licence, provenance) as part of this pack's general research pass.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/teaching/fleming-left-hand-teaching-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: SAVED
- Governed diagram blueprint: (none)

---

## Fleming's right-hand rule / AC generator effect

*Family:* `unit202.family.fleming-right-hand-generator` -- 3 distinct final image(s). Teach the generator-effect phenomenon (a rotating loop between magnetic poles induces an EMF) and the mnemonic used to predict induced-current direction.

*Family notes:* Groups the rotating-loop generator phenomenon with its own hand-rule mnemonic, the same phenomenon+mnemonic pattern as the other two hand-rule families -- unifies what were two separately-lesson-linked but pedagogically inseparable assets in the prior flat catalogue.

### Simple rotating-loop AC generator — loop plane facing poles — near-zero EMF

- **assetId:** `unit202.generator.rotating-loop.horizontal`
- **Role / production class:** PHENOMENON / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P0
- **Curriculum context:** LO5 — lesson.emf.ac-generation-principles
- **Instructional purpose:** Show a single loop of wire, loop plane facing the poles head-on (widest visible loop face), rotating on a central axis between N and S poles, establishing the physical basis of single-loop AC generation at Level 2 depth.
- **Learner-visible deliverable:** One premium illustration of a single wire loop, loop plane facing the poles head-on (widest visible loop face), rotating on a central axis between clearly labelled N and S poles, with a minimal slip-ring/output connection concept, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - N/S magnetic poles
  - loop/coil between the poles
  - loop plane facing the poles head-on (widest visible loop face) -- this specific pose is the defining physical fact of this asset, never mixed with the sibling pose asset
  - central rotational axis
  - output/slip-ring concept at governed Level-2 abstraction
  - rotating conductor cuts magnetic flux
- **Prohibited changes:**
  - do not substitute a detailed modern alternator
  - do not add three-phase windings, phasors or brushes/commutator detail beyond governed scope
  - do not depict the edge-on loop pose in this asset -- that is the sibling ProductionAsset
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Loop plane facing poles — near-zero EMF [MULTI_STATE]

**Current reference**
- Title: Wikimedia Commons — Diagram of single-phase generator with two poles.svg
- URL: https://commons.wikimedia.org/wiki/File:Diagram_of_single-phase_generator_with_two_poles.svg
- Licence: CC0/public-domain reference material where recorded
- Quality grade: A concept
- Secondary reference: Pearson Scott Foresman — Dynamo (PSF).png -- https://commons.wikimedia.org/wiki/File:Dynamo_(PSF).png (CC0/public-domain)

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **MEDIUM**
- notesForReferenceResearch: No confirmed problem on record. Shares the identical reference URL with 1 sibling asset(s) (unit202.generator.rotating-loop.vertical) -- verify this file is not an unlabelled composite requiring per-asset isolation (cf. unit202.levers.class-1, confirmed composite in the CC-11.8 proof) before treating it as fully approved for this specific asset.
- Shares its reference URL with: unit202.generator.rotating-loop.vertical

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/generator-rotating-loop-horizontal-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: READY_TO_PROMPT
- Governed diagram blueprint: generator.rotating_loop

---

### Simple rotating-loop AC generator — loop plane edge-on to poles — near-peak EMF

- **assetId:** `unit202.generator.rotating-loop.vertical`
- **Role / production class:** PHENOMENON / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P0
- **Curriculum context:** LO5 — lesson.emf.ac-generation-principles
- **Instructional purpose:** Show a single loop of wire, loop plane edge-on to the poles (loop seen from the side, near its thinnest silhouette), rotating on a central axis between N and S poles, establishing the physical basis of single-loop AC generation at Level 2 depth.
- **Learner-visible deliverable:** One premium illustration of a single wire loop, loop plane edge-on to the poles (loop seen from the side, near its thinnest silhouette), rotating on a central axis between clearly labelled N and S poles, with a minimal slip-ring/output connection concept, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - N/S magnetic poles
  - loop/coil between the poles
  - loop plane edge-on to the poles (loop seen from the side, near its thinnest silhouette) -- this specific pose is the defining physical fact of this asset, never mixed with the sibling pose asset
  - central rotational axis
  - output/slip-ring concept at governed Level-2 abstraction
  - rotating conductor cuts magnetic flux
- **Prohibited changes:**
  - do not substitute a detailed modern alternator
  - do not add three-phase windings, phasors or brushes/commutator detail beyond governed scope
  - do not depict the face-on loop pose in this asset -- that is the sibling ProductionAsset
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Loop plane edge-on to poles — near-peak EMF [MULTI_STATE]

**Current reference**
- Title: Wikimedia Commons — Diagram of single-phase generator with two poles.svg
- URL: https://commons.wikimedia.org/wiki/File:Diagram_of_single-phase_generator_with_two_poles.svg
- Licence: CC0/public-domain reference material where recorded
- Quality grade: A concept
- Secondary reference: Pearson Scott Foresman — Dynamo (PSF).png -- https://commons.wikimedia.org/wiki/File:Dynamo_(PSF).png (CC0/public-domain)

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **MEDIUM**
- notesForReferenceResearch: No confirmed problem on record. Shares the identical reference URL with 1 sibling asset(s) (unit202.generator.rotating-loop.horizontal) -- verify this file is not an unlabelled composite requiring per-asset isolation (cf. unit202.levers.class-1, confirmed composite in the CC-11.8 proof) before treating it as fully approved for this specific asset.
- Shares its reference URL with: unit202.generator.rotating-loop.horizontal

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/generator-rotating-loop-vertical-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: READY_TO_PROMPT
- Governed diagram blueprint: generator.rotating_loop

---

### Fleming right-hand rule — generator teaching mnemonic

- **assetId:** `unit202.fleming-right-hand.teaching`
- **Role / production class:** MNEMONIC / HYBRID / PREMIUM TEACHING
- **Need classification:** REQUIRED
- **Priority:** P0
- **Curriculum context:** LO5 — lesson.magnetism.effects-of-current
- **Instructional purpose:** Teach the generator-effect hand mnemonic: thuMb = Motion of the conductor, First finger = Field, seCond finger = induced Current/EMF, each mutually perpendicular on the right hand.
- **Learner-visible deliverable:** One premium illustration of a right hand with thumb, first finger and second finger held mutually perpendicular, clearly and unambiguously demonstrating Motion/Field/induced-Current correspondence. Include the explanatory annotations MOTION, FIELD and INDUCED CURRENT / EMF on the corresponding digit -- this is a TEACHING asset and clear labels are part of the deliverable. Matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - RIGHT hand
  - thumb = conductor MOTION
  - first (index) finger = magnetic FIELD
  - second (middle) finger = induced current/EMF
  - three directions mutually perpendicular
- **Prohibited changes:**
  - do not swap to the left hand
  - do not reassign which finger represents which quantity
  - DO NOT MIRROR OR HORIZONTALLY FLIP HAND-RULE ARTWORK. Mirroring may change handedness (a mirrored right hand can read as a left hand) and invalidate the mnemonic -- never use a mirror/flip transform of this image for any other rotation phase.
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Fleming's right-hand mnemonic (teaching only) [TEACHING]

**Current reference**
- Title: Fleming's original 1902 right-hand-rule figure (Wikimedia Commons)
- URL: https://commons.wikimedia.org/wiki/File:Fleming%27s_right_hand_rule.png
- Licence: Public-domain historical work
- Quality grade: A+

**Reference-research flags**
- requiresReferenceResearch: **false**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **HIGH**
- notesForReferenceResearch: No confirmed problem on record. Standard appraisal welcome (geometry/topology match, licence, provenance) as part of this pack's general research pass.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/teaching/fleming-right-hand-teaching-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: SAVED
- Governed diagram blueprint: (none)

---

## Lever classes

*Family:* `unit202.family.levers` -- 3 distinct final image(s). Teach the three lever classes as distinct, individually recognisable fulcrum/effort/load arrangements.

*Family notes:* Split into three separate CONFIGURATION assets rather than one image showing all three classes at once (task brief's own explicit example): forcing all three arrangements into a single illustration would either cramp the composition or blur the very distinction the learner must be able to recognise. Each class gets its own clean, unambiguous illustration.

### Lever — Class I

- **assetId:** `unit202.levers.class-1`
- **Role / production class:** CONFIGURATION / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P0
- **Curriculum context:** LO3 — lesson.foundation.physics.simple-machines
- **Instructional purpose:** Show a Class I lever arrangement (fulcrum between effort and load) so a learner can recognise it from the arrangement itself.
- **Learner-visible deliverable:** One premium illustration of a bar with the fulcrum positioned between a clearly marked effort point and load point, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - fulcrum positioned between the effort point and the load point
- **Prohibited changes:**
  - do not blend this with the Class II or Class III arrangement
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (2):**
  - Class I recognition (no distances) [MULTI_STATE]
  - Class I with effort-arm/load-arm distances [MULTI_STATE]

**Current reference**
- Title: Pearson Scott Foresman — Lever (PSF).svg
- URL: https://commons.wikimedia.org/wiki/File:Lever_(PSF).svg
- Licence: Public domain
- Quality grade: A+

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **COMPOSITE_NEEDS_CROP**
- currentReferenceConfidence: **MEDIUM**
- notesForReferenceResearch: Confirmed composite (CC-11.8 proof): Lever_(PSF).svg contains 3 stacked lever-class diagrams. This asset is the TOP diagram.
- Shares its reference URL with: unit202.levers.class-2, unit202.levers.class-3

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/levers-class-1-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: SAVED
- Governed diagram blueprint: mechanical.lever_arrangement

---

### Lever — Class II

- **assetId:** `unit202.levers.class-2`
- **Role / production class:** CONFIGURATION / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P0
- **Curriculum context:** LO3 — lesson.foundation.physics.simple-machines
- **Instructional purpose:** Show a Class II lever arrangement (load between fulcrum and effort) so a learner can recognise it from the arrangement itself.
- **Learner-visible deliverable:** One premium illustration of a bar with the load positioned between a clearly marked fulcrum and effort point, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - load positioned between the fulcrum and the effort point
- **Prohibited changes:**
  - do not blend this with the Class I or Class III arrangement
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (2):**
  - Class II recognition (no distances) [MULTI_STATE]
  - Class II with effort-arm/load-arm distances [MULTI_STATE]

**Current reference**
- Title: Pearson Scott Foresman — Lever (PSF).svg
- URL: https://commons.wikimedia.org/wiki/File:Lever_(PSF).svg
- Licence: Public domain
- Quality grade: A+

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **COMPOSITE_NEEDS_CROP**
- currentReferenceConfidence: **MEDIUM**
- notesForReferenceResearch: Shares the identical Lever_(PSF).svg file with unit202.levers.class-1 (confirmed composite, CC-11.8 proof). This asset is the MIDDLE diagram.
- Shares its reference URL with: unit202.levers.class-1, unit202.levers.class-3

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/levers-class-2-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: SAVED
- Governed diagram blueprint: mechanical.lever_arrangement

---

### Lever — Class III

- **assetId:** `unit202.levers.class-3`
- **Role / production class:** CONFIGURATION / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P0
- **Curriculum context:** LO3 — lesson.foundation.physics.simple-machines
- **Instructional purpose:** Show a Class III lever arrangement (effort between fulcrum and load) so a learner can recognise it from the arrangement itself.
- **Learner-visible deliverable:** One premium illustration of a bar with the effort positioned between a clearly marked fulcrum and load point, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - effort positioned between the fulcrum and the load point
- **Prohibited changes:**
  - do not blend this with the Class I or Class II arrangement
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (2):**
  - Class III recognition (no distances) [MULTI_STATE]
  - Class III with effort-arm/load-arm distances [MULTI_STATE]

**Current reference**
- Title: Pearson Scott Foresman — Lever (PSF).svg
- URL: https://commons.wikimedia.org/wiki/File:Lever_(PSF).svg
- Licence: Public domain
- Quality grade: A+

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **COMPOSITE_NEEDS_CROP**
- currentReferenceConfidence: **MEDIUM**
- notesForReferenceResearch: Shares the identical Lever_(PSF).svg file with unit202.levers.class-1 (confirmed composite, CC-11.8 proof). This asset is the BOTTOM diagram.
- Shares its reference URL with: unit202.levers.class-1, unit202.levers.class-2

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/levers-class-3-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: SAVED
- Governed diagram blueprint: mechanical.lever_arrangement

---

## Pulleys

*Family:* `unit202.family.pulleys` -- 2 distinct final image(s). Teach the fixed-vs-movable pulley distinction and the mechanical-advantage consequence each configuration has.

*Family notes:* CONFIRMED, not assumed: two assets (fixed; movable), not more. Reviewed the full governed evidence before finalising this count -- FP-CONCEPT-PULLEY-001, FP-PULLEY-FIXED-VS-MOVABLE-001, FP-REL-PULLEY-MECHANICAL-ADVANTAGE-001 and FP-REL-PULLEY-FORCE-DISTANCE-TRADEOFF-001 (scripts/content/data/cc04-unit202-electrical-science.ts) and cap.foundational.pulleys.recognise together teach fixed-vs-movable and the qualitative MA-vs-supporting-segments relationship, never a specific two-/three-pulley or block-and-tackle configuration; the calculation engine's own PULLEY_SCENARIOS is a two-way more/fewer-supporting-sections comparator, not an N-pulley model. Multiple governed artefacts explicitly declare multi-pulley/block-and-tackle content out of scope (the existing visual-semantic-contract's mustNotShow, PulleyDiagram.tsx's own header comment). No third asset is added here -- doing so would manufacture syllabus content that was never governed, exactly what task brief §11 warns against.

### Fixed pulley

- **assetId:** `unit202.pulleys.fixed`
- **Role / production class:** CONFIGURATION / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P0
- **Curriculum context:** LO3 — lesson.foundation.physics.simple-machines
- **Instructional purpose:** Show a fixed pulley: direction change only, mechanical advantage approximately 1.
- **Learner-visible deliverable:** One premium illustration of a fixed pulley wheel with a fixed anchor point and a physically plausible rope path with effort/load ends, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - fixed anchor point
  - pulley wheel changes rope direction only
  - mechanical advantage approximately 1
  - physically continuous/plausible rope path
- **Prohibited changes:**
  - do NOT introduce block-and-tackle complexity
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Fixed pulley [MULTI_STATE]

**Current reference**
- Title: Wikimedia Commons — Pulley1a.svg
- URL: https://commons.wikimedia.org/wiki/File:Pulley1a.svg
- Licence: Public-domain where recorded
- Quality grade: B+ overall -- simplify to governed Unit 202 scope

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **SUSPECT_UNSUITABLE**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: CONFIRMED unsuitable in the CC-11.8 Gemini proof session: the cited reference depicts a compound fixed+movable block-and-tackle pulley system, directly contradicting this asset's own prohibitedChanges ("do NOT introduce block-and-tackle complexity"). Needs a genuinely isolated fixed-pulley-only reference.
- Shares its reference URL with: unit202.pulleys.movable

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/pulleys-fixed-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: SAVED
- Governed diagram blueprint: mechanical.pulley_arrangement

---

### Movable pulley

- **assetId:** `unit202.pulleys.movable`
- **Role / production class:** CONFIGURATION / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P0
- **Curriculum context:** LO3 — lesson.foundation.physics.simple-machines
- **Instructional purpose:** Show a simple movable pulley: two supporting rope segments, mechanical advantage approximately 2.
- **Learner-visible deliverable:** One premium illustration of a movable pulley with exactly two supporting rope segments and a physically plausible rope path with effort/load ends, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - exactly two supporting rope segments
  - mechanical advantage approximately 2
  - physically continuous/plausible rope path
- **Prohibited changes:**
  - do NOT introduce block-and-tackle complexity
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Movable pulley [MULTI_STATE]

**Current reference**
- Title: Wikimedia Commons — Pulley1a.svg
- URL: https://commons.wikimedia.org/wiki/File:Pulley1a.svg
- Licence: Public-domain where recorded
- Quality grade: B+ overall -- simplify to governed Unit 202 scope

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **LOW**
- notesForReferenceResearch: Shares the identical Pulley1a.svg reference file with unit202.pulleys.fixed, which was directly inspected in the CC-11.8 proof and found to depict a compound block-and-tackle system contradicting its own prohibitedChanges. This asset's own suitability against its own prohibitedChanges has NOT been independently re-verified -- treat with the same scrutiny before use.
- Shares its reference URL with: unit202.pulleys.fixed

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/pulleys-movable-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: SAVED
- Governed diagram blueprint: mechanical.pulley_arrangement

---

## Magnetism — field and pole interaction

*Family:* `unit202.family.magnetism` -- 4 distinct final image(s). Teach the bar-magnet field pattern and the attraction/repulsion relationship between two magnets' poles.

*Family notes:* Two assets covering two genuinely distinct governed relationships (a single magnet's own field pattern; the interaction between two magnets' poles). A separate flux-density-comparison asset is not currently included -- the existing deterministic `magnetic.flux_field_lines` diagram already covers density comparison and no additional premium illustration is currently justified for it.

### Bar magnet and magnetic field

- **assetId:** `unit202.magnet.field`
- **Role / production class:** PHENOMENON / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P0
- **Curriculum context:** LO5 — lesson.magnetism.fundamentals
- **Instructional purpose:** Show a bar magnet with its external magnetic field pattern, N to S, as the basis for flux/flux-density teaching.
- **Learner-visible deliverable:** One premium illustration of a bar magnet body ready to receive a deterministic N/S-labelled field-line overlay, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - meaningful field-line geometry
  - external field direction runs N to S
  - field-line density used meaningfully where density is taught
- **Prohibited changes:**
  - do not draw field lines that reverse direction or cross incorrectly
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (2):**
  - Bar magnet field pattern (no density comparison) [MULTI_STATE]
  - Bar magnet field with flux-density comparison (same flux, different cross-section) [MULTI_STATE]

**Current reference**
- Title: Wikimedia Commons — DipolMagnet.svg
- URL: https://commons.wikimedia.org/wiki/File:DipolMagnet.svg
- Licence: Public-domain dedication
- Quality grade: A+

**Reference-research flags**
- requiresReferenceResearch: **false**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **HIGH**
- notesForReferenceResearch: No confirmed problem on record. Standard appraisal welcome (geometry/topology match, licence, provenance) as part of this pack's general research pass.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/magnet-field-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: SAVED
- Governed diagram blueprint: magnetic.flux_field_lines

---

### Magnetic pole repulsion — like poles facing (repel)

- **assetId:** `unit202.magnet.poles.like`
- **Role / production class:** COMPARISON / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P1
- **Curriculum context:** LO5 — lesson.magnetism.fundamentals
- **Instructional purpose:** Show like poles facing (repel) from the pole labels on two bar magnets.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium illustration of two bar magnets arranged like poles facing (repel), matching the reference relationship exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - like poles repel
  - magnets must be composed with a spacing appropriate to repulsion (visible gap, compressed/deflected field lines) -- this specific spacing is the defining physical fact of this asset, never mixed with the sibling asset
  - field behaviour between the two magnets must remain physically meaningful
- **Prohibited changes:**
  - this premium asset is TEACHING-only -- the separate deterministic magnetic.pole_interaction diagram (not this asset) is what governs the assessment-mode reveal/withhold state; do not treat this teaching image's own labels as an assessment-answer leak
  - do not depict the unlike-poles/attracting arrangement in this asset -- that is the sibling ProductionAsset
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (2):**
  - like poles facing (repel) — force revealed (teaching) [TEACHING]
  - like poles facing (repel) — force withheld (assessment) [ASSESSMENT]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/magnet-poles-like-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: magnetic.pole_interaction

---

### Magnetic pole attraction — unlike poles facing (attract)

- **assetId:** `unit202.magnet.poles.unlike`
- **Role / production class:** COMPARISON / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P1
- **Curriculum context:** LO5 — lesson.magnetism.fundamentals
- **Instructional purpose:** Show unlike poles facing (attract) from the pole labels on two bar magnets.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium illustration of two bar magnets arranged unlike poles facing (attract), matching the reference relationship exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - unlike poles attract
  - magnets must be composed with a spacing appropriate to attraction (close together, merging field lines) -- this specific spacing is the defining physical fact of this asset, never mixed with the sibling asset
  - field behaviour between the two magnets must remain physically meaningful
- **Prohibited changes:**
  - this premium asset is TEACHING-only -- the separate deterministic magnetic.pole_interaction diagram (not this asset) is what governs the assessment-mode reveal/withhold state; do not treat this teaching image's own labels as an assessment-answer leak
  - do not depict the like-poles/repelling arrangement in this asset -- that is the sibling ProductionAsset
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (2):**
  - unlike poles facing (attract) — force revealed (teaching) [TEACHING]
  - unlike poles facing (attract) — force withheld (assessment) [ASSESSMENT]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/magnet-poles-unlike-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: magnetic.pole_interaction

---

### Permanent magnet vs electromagnet comparison

- **assetId:** `unit202.magnet.permanent-vs-electromagnet`
- **Role / production class:** COMPARISON / HYBRID
- **Need classification:** USEFUL (USEFUL)
- **Priority:** P2 (USEFUL, not REQUIRED)
- **Curriculum context:** LO5 — lesson.magnetism.fundamentals
- **Instructional purpose:** CC-11.7 audit finding: a genuine physical-topology comparison (coiled wire around a core vs a solid bar magnet) the learner can use to distinguish the two magnet types by appearance -- USEFUL enrichment, Level 2 depth keeps it below REQUIRED.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium side-by-side illustration (permanent magnet | electromagnet), matching the immutable facts exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - permanent magnet depicted as a solid bar/horseshoe magnet, no coil or power source
  - electromagnet depicted as a coil of wire around a core with a visible power source/current path
  - one side-by-side comparison image, not two separate images
- **Prohibited changes:**
  - do not generate until a primary reference is marked READY
  - do not split into two separate images -- this is one comparison deliverable
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Permanent magnet vs electromagnet (blocked) [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/magnet-permanent-vs-electromagnet-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

## Series circuit

*Family:* `unit202.family.circuit-series` -- 1 distinct final image(s). A single, simple concept: a series circuit's topology is already fully governed by the deterministic renderer.

*Family notes:* Single-asset family -- a simple, already-governed concept does not need a manufactured family structure.

### Series circuit

- **assetId:** `unit202.circuit.series`
- **Role / production class:** TECHNICAL_DIAGRAM / DETERMINISTIC TECHNICAL
- **Need classification:** REQUIRED -- HIDDEN FROM CURRENT STUDIO QUEUE
- **Priority:** P1
- **Curriculum context:** LO4 — lesson.electrical.resistors-series
- **Instructional purpose:** A visually polished series-circuit reference for style/contrast QA against the existing deterministic renderer -- topology and correctness are already governed.
- **Learner-visible deliverable:** A style/contrast reference only (not a replacement asset): include an unmistakable cell/battery/source wherever current direction is being taught, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - complete source
  - one continuous loop
  - UK/IEC component convention
  - current direction consistent with polarity when shown
- **Prohibited changes:**
  - do not replace the governed deterministic SVG renderer's output with generated raster geometry
- **Labels:** required=false pedagogicallyRequired=false annotationPolicy=NONE artExpectation=DETERMINISTIC_VECTOR_NOT_ART_GENERATED
- **Canonical learner-visible states (3):**
  - Series circuit — 2 components [MULTI_STATE]
  - Series circuit — 3 components [MULTI_STATE]
  - Series circuit — 4 components [MULTI_STATE]

**Current reference**
- Title: Wikimedia Commons — Battery symbols and circuit.svg
- URL: https://commons.wikimedia.org/wiki/File:Battery_symbols_and_circuit.svg
- Licence: recorded per source page
- Quality grade: A
- Secondary reference: Wikimedia Commons — Series and parallel circuits2.svg -- https://commons.wikimedia.org/wiki/File:Series_and_parallel_circuits2.svg (recorded per source page)

**Reference-research flags**
- requiresReferenceResearch: **false**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **HIGH**
- notesForReferenceResearch: No confirmed problem on record. Standard appraisal welcome (geometry/topology match, licence, provenance) as part of this pack's general research pass.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/deterministic-polish/circuit-series-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: READY_TO_PROMPT
- Governed diagram blueprint: circuit.series_resistors

---

## Parallel circuit

*Family:* `unit202.family.circuit-parallel` -- 1 distinct final image(s). A single, simple concept: a parallel circuit's topology is already fully governed by the deterministic renderer.

*Family notes:* Single-asset family -- a simple, already-governed concept does not need a manufactured family structure.

### Parallel circuit

- **assetId:** `unit202.circuit.parallel`
- **Role / production class:** TECHNICAL_DIAGRAM / DETERMINISTIC TECHNICAL
- **Need classification:** REQUIRED -- HIDDEN FROM CURRENT STUDIO QUEUE
- **Priority:** P1
- **Curriculum context:** LO4 — lesson.electrical.resistors-parallel
- **Instructional purpose:** A visually polished parallel-circuit reference for style/contrast QA against the existing deterministic renderer -- topology and correctness are already governed.
- **Learner-visible deliverable:** A style/contrast reference only (not a replacement asset), matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - source present
  - common pair of nodes/rails
  - separate branches
  - current direction consistent with source polarity
- **Prohibited changes:**
  - do not replace the governed deterministic SVG renderer's output with generated raster geometry
- **Labels:** required=false pedagogicallyRequired=false annotationPolicy=NONE artExpectation=DETERMINISTIC_VECTOR_NOT_ART_GENERATED
- **Canonical learner-visible states (3):**
  - Parallel circuit — 2 branches [MULTI_STATE]
  - Parallel circuit — 3 branches [MULTI_STATE]
  - Parallel circuit — 4 branches [MULTI_STATE]

**Current reference**
- Title: Same circuit reference family as series (see unit202.circuit.series)
- URL: https://commons.wikimedia.org/wiki/File:Series_and_parallel_circuits2.svg
- Licence: recorded per source page
- Quality grade: A

**Reference-research flags**
- requiresReferenceResearch: **false**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **HIGH**
- notesForReferenceResearch: No confirmed problem on record. Standard appraisal welcome (geometry/topology match, licence, provenance) as part of this pack's general research pass.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/deterministic-polish/circuit-parallel-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: READY_TO_PROMPT
- Governed diagram blueprint: circuit.parallel_resistors

---

## Mixed series/parallel circuit

*Family:* `unit202.family.circuit-mixed` -- 1 distinct final image(s). A single, simple concept: a mixed circuit's topology is already fully governed by the deterministic renderer.

*Family notes:* Single-asset family -- a simple, already-governed concept does not need a manufactured family structure.

### Mixed series/parallel circuit

- **assetId:** `unit202.circuit.mixed`
- **Role / production class:** TECHNICAL_DIAGRAM / DETERMINISTIC TECHNICAL
- **Need classification:** REQUIRED -- HIDDEN FROM CURRENT STUDIO QUEUE
- **Priority:** P1
- **Curriculum context:** LO4 — lesson.electrical.series-vs-parallel-comparison
- **Instructional purpose:** A visually polished mixed-topology reference for style/contrast QA against the existing deterministic renderer -- topology and correctness are already governed.
- **Learner-visible deliverable:** A style/contrast reference only (not a replacement asset), matching the reference topology exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - genuinely mixed topology
  - obvious junctions
  - traceable current paths
  - source included where pedagogically necessary
- **Prohibited changes:**
  - use only as topology/reference, not a close stylistic derivative
  - do not replace the governed deterministic SVG renderer's output with generated raster geometry
- **Labels:** required=false pedagogicallyRequired=false annotationPolicy=NONE artExpectation=DETERMINISTIC_VECTOR_NOT_ART_GENERATED
- **Canonical learner-visible states (2):**
  - Mixed circuit — series of parallel [MULTI_STATE]
  - Mixed circuit — parallel of series [MULTI_STATE]

**Current reference**
- Title: Wikimedia Commons — SeriesParallelCircuit.svg
- URL: https://commons.wikimedia.org/wiki/File:SeriesParallelCircuit.svg
- Licence: use only as topology/reference, not a close stylistic derivative
- Quality grade: B

**Reference-research flags**
- requiresReferenceResearch: **false**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **MEDIUM**
- notesForReferenceResearch: No confirmed problem on record. Standard appraisal welcome (geometry/topology match, licence, provenance) as part of this pack's general research pass.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/deterministic-polish/circuit-mixed-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: READY_TO_PROMPT
- Governed diagram blueprint: circuit.series_parallel_mixed

---

## Instrument connections

*Family:* `unit202.family.instrument-connections` -- 3 distinct final image(s). A single, simple concept: ammeter/voltmeter/ohmmeter connection correctness is already fully governed by the deterministic renderer.

*Family notes:* Single-asset family -- a simple, already-governed concept does not need a manufactured family structure.

### Ammeter / voltmeter / ohmmeter connections

- **assetId:** `unit202.instrument.connections`
- **Role / production class:** TECHNICAL_DIAGRAM / DETERMINISTIC TECHNICAL / SELECTIVE HYBRID
- **Need classification:** REQUIRED -- HIDDEN FROM CURRENT STUDIO QUEUE
- **Priority:** P1
- **Curriculum context:** LO2 — lesson.electrical.instrumentation
- **Instructional purpose:** A visually polished instrument-connection reference for style/contrast QA against the existing deterministic renderer -- connection correctness is already governed.
- **Learner-visible deliverable:** A style/contrast reference only (not a replacement asset), matching the reference connection geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - ammeter connects in series
  - voltmeter connects in parallel
  - resistance measurement requires a de-energised circuit
  - isolation/disconnection of an individual component is required only where necessary to avoid parallel-path readings, never claimed as a universal requirement
  - source/load context understandable
- **Prohibited changes:**
  - do not restate isolation as a universal requirement -- see immutable facts
- **Labels:** required=false pedagogicallyRequired=false annotationPolicy=NONE artExpectation=DETERMINISTIC_VECTOR_NOT_ART_GENERATED
- **Canonical learner-visible states (5):**
  - voltmeter — parallel (standard) [MULTI_STATE]
  - voltmeter — series (non-standard, deliberate teaching contrast) [MULTI_STATE]
  - ammeter — series (standard) [MULTI_STATE]
  - ammeter — parallel (non-standard, deliberate teaching contrast) [MULTI_STATE]
  - ohmmeter — isolated (standard) [MULTI_STATE]

**Current reference**
- Title: Wikimedia Commons — SimpleCircuit.SVG
- URL: https://commons.wikimedia.org/wiki/File:SimpleCircuit.SVG
- Licence: recorded per source page
- Quality grade: A

**Reference-research flags**
- requiresReferenceResearch: **false**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **HIGH**
- notesForReferenceResearch: No confirmed problem on record. Standard appraisal welcome (geometry/topology match, licence, provenance) as part of this pack's general research pass.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/deterministic-polish/instrument-connections-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: READY_TO_PROMPT
- Governed diagram blueprint: instrument.measurement_connection

---

### Clamp meter recognition

- **assetId:** `unit202.instrument.clamp-meter`
- **Role / production class:** PHYSICAL_RECOGNITION / PREMIUM CONCEPTUAL
- **Need classification:** USEFUL (USEFUL)
- **Priority:** P2 (USEFUL, not REQUIRED)
- **Curriculum context:** LO2 — lesson.electrical.instrumentation
- **Instructional purpose:** CC-11.7 audit finding: physical recognition of a clamp meter by its distinctive ferrite-jaw form -- genuinely different from the series/parallel/isolated connection topology the sibling TECHNICAL_DIAGRAM asset models. USEFUL enrichment, not REQUIRED.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium physical-appearance illustration of a clamp meter. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - ferrite clamp jaw must be clearly visible and open-able around a conductor -- the defining recognition feature
- **Prohibited changes:**
  - do not generate until a primary reference is marked READY
  - do not make one manufacturer's product appearance canonical
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Clamp meter recognition (blocked) [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/physical-components/instrument-clamp-meter-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

### Oscilloscope recognition

- **assetId:** `unit202.instrument.oscilloscope`
- **Role / production class:** PHYSICAL_RECOGNITION / PREMIUM CONCEPTUAL
- **Need classification:** USEFUL (USEFUL)
- **Priority:** P2 (USEFUL, not REQUIRED)
- **Curriculum context:** LO2 — lesson.electrical.instrumentation
- **Instructional purpose:** CC-11.7 audit finding: physical recognition of an oscilloscope by its distinctive screen/trace form. USEFUL enrichment, not REQUIRED.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium physical-appearance illustration of a oscilloscope. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - screen with a visible waveform trace must be clearly depicted -- the defining recognition feature
- **Prohibited changes:**
  - do not generate until a primary reference is marked READY
  - do not make one manufacturer's product appearance canonical
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Oscilloscope recognition (blocked) [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/physical-components/instrument-oscilloscope-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

## Conventional current vs electron flow

*Family:* `unit202.family.current-direction` -- 1 distinct final image(s). A single deterministic dual-arrow diagram distinguishing conventional current direction from actual electron-flow direction.

*Family notes:* CC-11.7 audit finding 3 (reports/instructional-visuals/unit202-comprehensive-visual-audit.md §4): targets the named misconception MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001. USEFUL, not REQUIRED -- cheap and high-value, but not yet corroborated by a dedicated QuestionBlueprint. A simple dual-arrow wire diagram is a geometric fact (conventional current: + to -; electron flow: - to +, opposite direction, same wire), not an artistic subject -- DETERMINISTIC_TECHNICAL, no ChatGPT art job, and no risk of generated artwork ever establishing arrow direction (task brief §16's own explicit warning).

### Conventional current vs electron flow

- **assetId:** `unit202.current-direction.electron-flow-vs-conventional`
- **Role / production class:** TECHNICAL_DIAGRAM / DETERMINISTIC TECHNICAL
- **Need classification:** USEFUL (USEFUL) -- HIDDEN FROM CURRENT STUDIO QUEUE
- **Priority:** P2 (USEFUL, not REQUIRED)
- **Curriculum context:** LO4 — lesson.electrical.charge-and-current
- **Instructional purpose:** CC-11.7 audit finding: a single wire with two labelled arrows -- conventional current (+ to -) and actual electron flow (- to +) -- shown together so the direction distinction and the underlying reason (electrons are negative, so they physically move opposite to the conventional-current convention) are both visible at a glance.
- **Learner-visible deliverable:** Deterministic vector dual-arrow diagram -- not a premium art-generation deliverable.
- **Immutable technical facts:**
  - conventional current direction: positive terminal to negative terminal
  - electron flow direction: negative terminal to positive terminal -- opposite to conventional current
  - both arrows on the same single wire/conductor, never on separate wires
- **Prohibited changes:**
  - do not draw the two arrows pointing the same direction
  - do not omit either arrow
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=DETERMINISTIC_VECTOR_NOT_ART_GENERATED
- **Canonical learner-visible states (1):**
  - Conventional current vs electron flow (dual arrow) [TEACHING]

**Current reference**
- Title: Standard conventional-current/electron-flow dual-arrow reference -- to be selected when this asset is commissioned
- URL: (none)
- Licence: to be recorded when selected
- Quality grade: to be assessed

**Reference-research flags**
- requiresReferenceResearch: **false**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: Deterministic vector asset -- no external pictorial reference required; authoritative geometry is governed by ALP's own deterministic renderer, not redrawn from an external image. No reference research action needed.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/deterministic-polish/current-direction-electron-flow-vs-conventional-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: READY_TO_PROMPT
- Governed diagram blueprint: (none)

---

## Driver/driven gears

*Family:* `unit202.family.gears` -- 4 distinct final image(s). The driver/driven relative-size relationship, plus the optional rotation-direction/idler concept.

*Family notes:* CC-11.7B correction: the original single unit202.gears asset packed 3 genuinely different gear-size relationships (driven larger/smaller/equal) behind one prompt -- a real physical size change to a rendered object in the scene, with no deterministic overlay mechanism (only rotation-direction is an overlay responsibility) able to resize a gear in generated artwork. Split into 3 size-specific ProductionAssets. The optional rotation-direction/idler USEFUL finding remains a separate deterministic-only asset, unaffected by the split.

### Driver/driven gears — driven gear larger than the driver

- **assetId:** `unit202.gears.driven-larger`
- **Role / production class:** CONFIGURATION / POLISHED DETERMINISTIC / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P1
- **Curriculum context:** LO3 — lesson.foundation.physics.simple-machines
- **Instructional purpose:** Show a driver gear meshed with a driven gear, driven gear larger than the driver, representing the gear ratio and the resulting torque/speed trade-off.
- **Learner-visible deliverable:** One premium illustration of two meshed gears, driven gear larger than the driver, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - meaningful driver/driven relationship
  - physically plausible mesh
  - driven gear larger than the driver -- this specific size relationship is the defining physical fact of this asset, never mixed with a sibling size-ratio asset
  - correct rotation relationship when shown
- **Prohibited changes:**
  - do not depict a mesh that is not physically plausible
  - do not depict a different size relationship than stated -- that is a sibling ProductionAsset
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Driver/driven gears — driven larger [MULTI_STATE]

**Current reference**
- Title: Wikimedia Commons — Example of a Compound Gear Train.png
- URL: https://commons.wikimedia.org/wiki/File:Example_of_a_Compound_Gear_Train.png
- Licence: CC0
- Quality grade: A

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **MEDIUM**
- notesForReferenceResearch: No confirmed problem on record. Shares the identical reference URL with 2 sibling asset(s) (unit202.gears.driven-smaller, unit202.gears.equal) -- verify this file is not an unlabelled composite requiring per-asset isolation (cf. unit202.levers.class-1, confirmed composite in the CC-11.8 proof) before treating it as fully approved for this specific asset.
- Shares its reference URL with: unit202.gears.driven-smaller, unit202.gears.equal

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/gears-driven-larger-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: SAVED
- Governed diagram blueprint: mechanical.gear_mesh

---

### Driver/driven gears — driven gear smaller than the driver

- **assetId:** `unit202.gears.driven-smaller`
- **Role / production class:** CONFIGURATION / POLISHED DETERMINISTIC / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P1
- **Curriculum context:** LO3 — lesson.foundation.physics.simple-machines
- **Instructional purpose:** Show a driver gear meshed with a driven gear, driven gear smaller than the driver, representing the gear ratio and the resulting torque/speed trade-off.
- **Learner-visible deliverable:** One premium illustration of two meshed gears, driven gear smaller than the driver, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - meaningful driver/driven relationship
  - physically plausible mesh
  - driven gear smaller than the driver -- this specific size relationship is the defining physical fact of this asset, never mixed with a sibling size-ratio asset
  - correct rotation relationship when shown
- **Prohibited changes:**
  - do not depict a mesh that is not physically plausible
  - do not depict a different size relationship than stated -- that is a sibling ProductionAsset
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Driver/driven gears — driven smaller [MULTI_STATE]

**Current reference**
- Title: Wikimedia Commons — Example of a Compound Gear Train.png
- URL: https://commons.wikimedia.org/wiki/File:Example_of_a_Compound_Gear_Train.png
- Licence: CC0
- Quality grade: A

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **MEDIUM**
- notesForReferenceResearch: No confirmed problem on record. Shares the identical reference URL with 2 sibling asset(s) (unit202.gears.driven-larger, unit202.gears.equal) -- verify this file is not an unlabelled composite requiring per-asset isolation (cf. unit202.levers.class-1, confirmed composite in the CC-11.8 proof) before treating it as fully approved for this specific asset.
- Shares its reference URL with: unit202.gears.driven-larger, unit202.gears.equal

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/gears-driven-smaller-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: SAVED
- Governed diagram blueprint: mechanical.gear_mesh

---

### Driver/driven gears — driver and driven gears equal size

- **assetId:** `unit202.gears.equal`
- **Role / production class:** CONFIGURATION / POLISHED DETERMINISTIC / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P1
- **Curriculum context:** LO3 — lesson.foundation.physics.simple-machines
- **Instructional purpose:** Show a driver gear meshed with a driven gear, driver and driven gears equal size, representing the gear ratio and the resulting torque/speed trade-off.
- **Learner-visible deliverable:** One premium illustration of two meshed gears, driver and driven gears equal size, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - meaningful driver/driven relationship
  - physically plausible mesh
  - driver and driven gears equal size -- this specific size relationship is the defining physical fact of this asset, never mixed with a sibling size-ratio asset
  - correct rotation relationship when shown
- **Prohibited changes:**
  - do not depict a mesh that is not physically plausible
  - do not depict a different size relationship than stated -- that is a sibling ProductionAsset
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Driver/driven gears — equal [MULTI_STATE]

**Current reference**
- Title: Wikimedia Commons — Example of a Compound Gear Train.png
- URL: https://commons.wikimedia.org/wiki/File:Example_of_a_Compound_Gear_Train.png
- Licence: CC0
- Quality grade: A

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **MEDIUM**
- notesForReferenceResearch: No confirmed problem on record. Shares the identical reference URL with 2 sibling asset(s) (unit202.gears.driven-larger, unit202.gears.driven-smaller) -- verify this file is not an unlabelled composite requiring per-asset isolation (cf. unit202.levers.class-1, confirmed composite in the CC-11.8 proof) before treating it as fully approved for this specific asset.
- Shares its reference URL with: unit202.gears.driven-larger, unit202.gears.driven-smaller

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/gears-equal-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: SAVED
- Governed diagram blueprint: mechanical.gear_mesh

---

### Gear rotation-direction reversal / idler gear

- **assetId:** `unit202.gears.rotation-direction`
- **Role / production class:** TECHNICAL_DIAGRAM / DETERMINISTIC TECHNICAL (annotation overlay on whichever sibling driver/driven gear base artwork applies)
- **Need classification:** USEFUL (USEFUL) -- HIDDEN FROM CURRENT STUDIO QUEUE
- **Priority:** P2 (USEFUL, not REQUIRED)
- **Curriculum context:** LO3 — lesson.foundation.physics.simple-machines
- **Instructional purpose:** CC-11.7 audit finding: two meshed gears rotate in opposite directions; adding a third idler gear reverses the output direction back to match the driver without changing the overall ratio. Governed SUPPORTS-only content (non-mandatory).
- **Learner-visible deliverable:** Deterministic rotation-direction overlay states on a sibling driver/driven gear base artwork -- not a separate premium art-generation deliverable.
- **Immutable technical facts:**
  - two directly meshed gears rotate in opposite directions
  - an idler gear between driver and driven reverses the output direction back to match the driver's own direction
  - an idler gear does not change the overall driver:driven ratio
- **Prohibited changes:**
  - do not commission a new premium base image for this asset -- it reuses a sibling gear asset's own overlay system
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=DETERMINISTIC_VECTOR_NOT_ART_GENERATED
- **Canonical learner-visible states (2):**
  - Two directly meshed gears — opposite rotation directions [TEACHING]
  - Idler gear — output direction matches driver, ratio unchanged [TEACHING]

**Current reference**
- Title: Deterministic rotation-direction annotation on the sibling driver/driven gear reference geometry -- no separate photographic reference required
- URL: (none)
- Licence: n/a -- deterministic annotation, not generated artwork
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **false**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: Deterministic vector asset -- no external pictorial reference required; authoritative geometry is governed by ALP's own deterministic renderer, not redrawn from an external image. No reference research action needed.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/deterministic-polish/gears-rotation-direction-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: READY_TO_PROMPT
- Governed diagram blueprint: mechanical.gear_mesh

---

## Resistance vs conductor dimensions

*Family:* `unit202.family.resistivity` -- 2 distinct final image(s). Teach the two independent qualitative relationships that together make up R = ρL/A: length's effect on resistance, and area's effect on resistance.

*Family notes:* Split into two COMPARISON assets: length and area are two independently-varying quantities the learner must predict the qualitative consequence of separately -- one image cannot show both comparisons without conflating which variable is changing.

### Resistance vs conductor length

- **assetId:** `unit202.resistivity.length-comparison`
- **Role / production class:** COMPARISON / HYBRID / POLISHED DETERMINISTIC
- **Need classification:** REQUIRED
- **Priority:** P1
- **Curriculum context:** LO4 — lesson.electrical.resistivity
- **Instructional purpose:** Show two conductor rods differing only in length so a learner predicts the qualitative effect on resistance.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium illustration of two conductor rods differing only in length, matching the reference relationship exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - increased length -> greater resistance (cross-sectional area unchanged)
- **Prohibited changes:**
  - do not embed a numeric R = rho L / A calculation
  - do not also vary cross-sectional area in this asset
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Resistance vs conductor length [MULTI_STATE]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/resistivity-length-comparison-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: mechanical.resistivity_dimensions

---

### Resistance vs conductor cross-sectional area

- **assetId:** `unit202.resistivity.area-comparison`
- **Role / production class:** COMPARISON / HYBRID / POLISHED DETERMINISTIC
- **Need classification:** REQUIRED
- **Priority:** P1
- **Curriculum context:** LO4 — lesson.electrical.resistivity
- **Instructional purpose:** Show two conductor rods differing only in cross-sectional area so a learner predicts the qualitative effect on resistance.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium illustration of two conductor rods differing only in cross-sectional area, matching the reference relationship exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - increased cross-sectional area -> lower resistance (length unchanged)
- **Prohibited changes:**
  - do not embed a numeric R = rho L / A calculation
  - do not also vary length in this asset
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Resistance vs conductor cross-sectional area [MULTI_STATE]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/resistivity-area-comparison-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: mechanical.resistivity_dimensions

---

## AC sine waveform

*Family:* `unit202.family.waveform-sine` -- 1 distinct final image(s). A single, simple concept: sine-waveform characteristics are already fully governed by the deterministic renderer.

*Family notes:* Single-asset family -- a simple, already-governed concept does not need a manufactured family structure.

### AC sine waveform

- **assetId:** `unit202.waveform.sine`
- **Role / production class:** TECHNICAL_DIAGRAM / DETERMINISTIC TECHNICAL
- **Need classification:** REQUIRED -- HIDDEN FROM CURRENT STUDIO QUEUE
- **Priority:** P1
- **Curriculum context:** LO5 — lesson.waveforms.ac-dc-and-sine-wave-quantities
- **Instructional purpose:** A visually polished sine-waveform reference for style/contrast QA against the existing deterministic renderer -- waveform correctness is already governed.
- **Learner-visible deliverable:** A style/contrast reference only (not a replacement asset), matching the reference waveform exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - mathematically correct sine curve
  - zero axis shown
  - peak shown
  - peak-to-peak shown
  - period shown
  - RMS is approximately 0.707 x peak where taught
- **Prohibited changes:**
  - do not approximate the sine curve with a freehand/raster curve
- **Labels:** required=false pedagogicallyRequired=false annotationPolicy=NONE artExpectation=DETERMINISTIC_VECTOR_NOT_ART_GENERATED
- **Canonical learner-visible states (6):**
  - Sine waveform — bare cycle (zero-axis reference only) (2 cycles) [MULTI_STATE]
  - Sine waveform — peak revealed (2 cycles) [MULTI_STATE]
  - Sine waveform — peak + RMS revealed (2 cycles) [MULTI_STATE]
  - Sine waveform — peak + RMS + period revealed (2 cycles) [MULTI_STATE]
  - Sine waveform — single cycle, fully annotated (1 cycle) [MULTI_STATE]
  - Sine waveform — three cycles, fully annotated (3 cycles) [MULTI_STATE]

**Current reference**
- Title: Wikimedia Commons — Sine wave 2.svg
- URL: https://commons.wikimedia.org/wiki/File:Sine_wave_2.svg
- Licence: Public-domain dedication
- Quality grade: A+

**Reference-research flags**
- requiresReferenceResearch: **false**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **HIGH**
- notesForReferenceResearch: No confirmed problem on record. Standard appraisal welcome (geometry/topology match, licence, provenance) as part of this pack's general research pass.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/deterministic-polish/waveform-sine-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: READY_TO_PROMPT
- Governed diagram blueprint: graph.waveform_sine

---

## Motional EMF geometry

*Family:* `unit202.family.emf-motional` -- 1 distinct final image(s). A single, simple concept: one mutually-perpendicular geometric relationship (B, l, v) behind e = Blv.

*Family notes:* Single-asset family -- one geometric fact, no distinct states or configurations to separate.

### Motional EMF geometry

- **assetId:** `unit202.emf.motional`
- **Role / production class:** PHENOMENON / DETERMINISTIC / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P1
- **Curriculum context:** LO5 — lesson.magnetism.effects-of-current
- **Instructional purpose:** Show that conductor length, its velocity and the magnetic field are mutually perpendicular -- the geometric fact behind e = Blv.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium illustration of a conductor rod across two rails ready to receive B/l/v overlay arrows, matching the existing governed geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - B, l and v mutually perpendicular for the governed e = Blv case
  - rod across rails
  - velocity along the rails
  - field perpendicular to the rail plane
- **Prohibited changes:**
  - do not draw B, l or v as anything other than mutually perpendicular
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Motional EMF — B, l, v mutually perpendicular [MULTI_STATE]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/emf-motional-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: emf.motional_emf_geometry

---

## Electronic components — recognition

*Family:* `unit202.family.electronic-components` -- 16 distinct final image(s). Teach component recognition through the governed UK/IEC schematic symbol and, where genuinely useful, a physical-appearance companion image.

*Family notes:* Two assets covering two distinct recognition modes (schematic symbol vs physical appearance) rather than one combined image, since a learner needs to recognise a component both on a circuit diagram and in physical form. The 13-component physical-recognition set is not split into one asset per component in this pass -- tracked as one family member (task brief scope: reorganise where straightforward, do not mechanically split every entry).

### Electronic component symbol system

- **assetId:** `unit202.components.symbols`
- **Role / production class:** TECHNICAL_DIAGRAM / DETERMINISTIC TECHNICAL
- **Need classification:** REQUIRED -- HIDDEN FROM CURRENT STUDIO QUEUE
- **Priority:** P1
- **Curriculum context:** LO6 — lesson.electrical.electronic-components-passive / -switching-control
- **Instructional purpose:** The governed UK/IEC schematic-symbol system for component recognition -- symbol geometry must never be AI-generated.
- **Learner-visible deliverable:** No image-generation deliverable -- this catalogue entry exists for tracking/QA only; symbols remain produced by ComponentSymbols.tsx.
- **Immutable technical facts:**
  - every symbol must match the governed BS EN 60617 / IEC 60617 convention exactly
- **Prohibited changes:**
  - do NOT use AI-generated schematic symbols
  - do NOT use US/ANSI substitutes where UK/IEC differs
- **Labels:** required=false pedagogicallyRequired=false annotationPolicy=NONE artExpectation=DETERMINISTIC_VECTOR_NOT_ART_GENERATED
- **Canonical learner-visible states (13):**
  - UK/IEC symbol — resistor [MULTI_STATE]
  - UK/IEC symbol — capacitor [MULTI_STATE]
  - UK/IEC symbol — diode [MULTI_STATE]
  - UK/IEC symbol — zener diode [MULTI_STATE]
  - UK/IEC symbol — led [MULTI_STATE]
  - UK/IEC symbol — photodiode [MULTI_STATE]
  - UK/IEC symbol — thermistor [MULTI_STATE]
  - UK/IEC symbol — diac [MULTI_STATE]
  - UK/IEC symbol — triac [MULTI_STATE]
  - UK/IEC symbol — transistor [MULTI_STATE]
  - UK/IEC symbol — thyristor scr [MULTI_STATE]
  - UK/IEC symbol — rectifier [MULTI_STATE]
  - UK/IEC symbol — inverter [MULTI_STATE]

**Current reference**
- Title: IEC 60617 graphical-symbol system / current UK technical-drawing convention
- URL: (none)
- Licence: standards reference -- verify against the current governed BS EN 60617 / IEC 60617 convention
- Quality grade: A (standards authority)

**Reference-research flags**
- requiresReferenceResearch: **false**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: Deterministic vector asset -- no external pictorial reference required; authoritative geometry is governed by ALP's own deterministic renderer, not redrawn from an external image. No reference research action needed.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/deterministic-polish/components-symbols-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: READY_TO_PROMPT
- Governed diagram blueprint: electronics.component_symbol_card

---

### Physical electronic component — resistor

- **assetId:** `unit202.components.physical.resistor`
- **Role / production class:** PHYSICAL_RECOGNITION / PREMIUM CONCEPTUAL + deterministic UK/IEC symbol
- **Need classification:** REQUIRED
- **Priority:** P1/P2
- **Curriculum context:** LO6 — lesson.electrical.electronic-components-passive / -switching-control
- **Instructional purpose:** A physical-appearance companion image for the resistor, paired with its existing deterministic UK/IEC symbol card, so a learner can recognise this component both on a circuit diagram and in physical form.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium physical-appearance illustration of a resistor, matching a real, representative package form. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - package form must be a real, representative physical form for a resistor
- **Prohibited changes:**
  - do not invent a misleading package form for the resistor
  - do not depict any other component in this asset
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Physical appearance — resistor [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/physical-components/components-physical-resistor-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

### Physical electronic component — capacitor

- **assetId:** `unit202.components.physical.capacitor`
- **Role / production class:** PHYSICAL_RECOGNITION / PREMIUM CONCEPTUAL + deterministic UK/IEC symbol
- **Need classification:** REQUIRED
- **Priority:** P1/P2
- **Curriculum context:** LO6 — lesson.electrical.electronic-components-passive / -switching-control
- **Instructional purpose:** A physical-appearance companion image for the capacitor, paired with its existing deterministic UK/IEC symbol card, so a learner can recognise this component both on a circuit diagram and in physical form.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium physical-appearance illustration of a capacitor, matching a real, representative package form. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - package form must be a real, representative physical form for a capacitor
- **Prohibited changes:**
  - do not invent a misleading package form for the capacitor
  - do not depict any other component in this asset
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Physical appearance — capacitor [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/physical-components/components-physical-capacitor-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

### Physical electronic component — diode

- **assetId:** `unit202.components.physical.diode`
- **Role / production class:** PHYSICAL_RECOGNITION / PREMIUM CONCEPTUAL + deterministic UK/IEC symbol
- **Need classification:** REQUIRED
- **Priority:** P1/P2
- **Curriculum context:** LO6 — lesson.electrical.electronic-components-passive / -switching-control
- **Instructional purpose:** A physical-appearance companion image for the diode, paired with its existing deterministic UK/IEC symbol card, so a learner can recognise this component both on a circuit diagram and in physical form.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium physical-appearance illustration of a diode, matching a real, representative package form. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - package form must be a real, representative physical form for a diode
- **Prohibited changes:**
  - do not invent a misleading package form for the diode
  - do not depict any other component in this asset
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Physical appearance — diode [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/physical-components/components-physical-diode-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

### Physical electronic component — led

- **assetId:** `unit202.components.physical.led`
- **Role / production class:** PHYSICAL_RECOGNITION / PREMIUM CONCEPTUAL + deterministic UK/IEC symbol
- **Need classification:** REQUIRED
- **Priority:** P1/P2
- **Curriculum context:** LO6 — lesson.electrical.electronic-components-passive / -switching-control
- **Instructional purpose:** A physical-appearance companion image for the led, paired with its existing deterministic UK/IEC symbol card, so a learner can recognise this component both on a circuit diagram and in physical form.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium physical-appearance illustration of a led, matching a real, representative package form. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - package form must be a real, representative physical form for a led
- **Prohibited changes:**
  - do not invent a misleading package form for the led
  - do not depict any other component in this asset
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Physical appearance — led [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/physical-components/components-physical-led-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

### Physical electronic component — thermistor

- **assetId:** `unit202.components.physical.thermistor`
- **Role / production class:** PHYSICAL_RECOGNITION / PREMIUM CONCEPTUAL + deterministic UK/IEC symbol
- **Need classification:** REQUIRED
- **Priority:** P1/P2
- **Curriculum context:** LO6 — lesson.electrical.electronic-components-passive / -switching-control
- **Instructional purpose:** A physical-appearance companion image for the thermistor, paired with its existing deterministic UK/IEC symbol card, so a learner can recognise this component both on a circuit diagram and in physical form.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium physical-appearance illustration of a thermistor, matching a real, representative package form. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - package form must be a real, representative physical form for a thermistor
- **Prohibited changes:**
  - do not invent a misleading package form for the thermistor
  - do not depict any other component in this asset
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Physical appearance — thermistor [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/physical-components/components-physical-thermistor-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

### Physical electronic component — transistor

- **assetId:** `unit202.components.physical.transistor`
- **Role / production class:** PHYSICAL_RECOGNITION / PREMIUM CONCEPTUAL + deterministic UK/IEC symbol
- **Need classification:** REQUIRED
- **Priority:** P1/P2
- **Curriculum context:** LO6 — lesson.electrical.electronic-components-passive / -switching-control
- **Instructional purpose:** A physical-appearance companion image for the transistor, paired with its existing deterministic UK/IEC symbol card, so a learner can recognise this component both on a circuit diagram and in physical form.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium physical-appearance illustration of a transistor, matching a real, representative package form. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - package form must be a real, representative physical form for a transistor
- **Prohibited changes:**
  - do not invent a misleading package form for the transistor
  - do not depict any other component in this asset
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Physical appearance — transistor [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/physical-components/components-physical-transistor-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

### Diode forward bias — conducting

- **assetId:** `unit202.diode.bias-direction.forward`
- **Role / production class:** PHENOMENON / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P1
- **Curriculum context:** LO6 — lesson.electrical.electronic-components-passive
- **Instructional purpose:** CC-11.7 audit finding (new, beyond the original 66): show current flowing easily in forward bias, distinct from the static IEC symbol -- directly targets EL-COMPONENT-DIODE-001 and the named misconception MIS-EL-DIODE-DIRECTION-CONFUSION-001 (confusing which direction a diode conducts), which the existing `electronics.component_symbol_card` blueprint cannot represent since it renders only the static symbol, never current flow.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium illustration (forward bias — conducting) of a diode in a simple test circuit, matching the immutable facts exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - diode conducts easily in forward bias (anode more positive than cathode)
  - must remain visually distinct from the plain IEC diode symbol asset
  - must depict ONLY the forward-bias state -- the sibling ProductionAsset covers the other
- **Prohibited changes:**
  - do not depict blocked/no current flow -- that is the reverse-bias sibling asset
  - do not conflate with the zener/LED/photodiode symbol variants
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Forward bias — conducting [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/diode-bias-direction-forward-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

### Diode reverse bias — blocked

- **assetId:** `unit202.diode.bias-direction.reverse`
- **Role / production class:** PHENOMENON / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P1
- **Curriculum context:** LO6 — lesson.electrical.electronic-components-passive
- **Instructional purpose:** CC-11.7 audit finding (new, beyond the original 66): show current blocked in reverse bias, distinct from the static IEC symbol -- directly targets EL-COMPONENT-DIODE-001 and the named misconception MIS-EL-DIODE-DIRECTION-CONFUSION-001 (confusing which direction a diode conducts), which the existing `electronics.component_symbol_card` blueprint cannot represent since it renders only the static symbol, never current flow.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium illustration (reverse bias — blocked) of a diode in a simple test circuit, matching the immutable facts exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - diode blocks current in reverse bias (cathode more positive than anode)
  - must remain visually distinct from the plain IEC diode symbol asset
  - must depict ONLY the reverse-bias state -- the sibling ProductionAsset covers the other
- **Prohibited changes:**
  - do not depict current flowing -- that is the forward-bias sibling asset
  - do not conflate with the zener/LED/photodiode symbol variants
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Reverse bias — blocked [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/diode-bias-direction-reverse-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

### Rectifier/inverter output waveform shapes

- **assetId:** `unit202.rectification.waveforms`
- **Role / production class:** TECHNICAL_DIAGRAM / DETERMINISTIC TECHNICAL
- **Need classification:** REQUIRED -- HIDDEN FROM CURRENT STUDIO QUEUE
- **Priority:** P1
- **Curriculum context:** LO6 — lesson.electrical.electronic-components-switching-control
- **Instructional purpose:** CC-11.7 audit finding (new, beyond the original 66): the three distinct output-waveform SHAPES (half-wave rectified, full-wave rectified, inverter-synthesised AC) directly targeted by question blueprint `electronics.recognise_rectifier_type`, which the existing `graph.waveform_sine` blueprint cannot represent (it renders only a plain sine wave) and the existing `electronics.component_symbol_card`'s rectifier/inverter entries cannot represent either (they render only the functional-block symbol, never the resulting waveform shape).
- **Learner-visible deliverable:** Deterministic vector waveform plots -- not a premium art-generation deliverable.
- **Immutable technical facts:**
  - half-wave: blocks one half-cycle entirely, passes the other unchanged in shape
  - full-wave: converts both half-cycles to the same polarity (pulsating DC, never a flat line)
  - inverter: DC input synthesised into an AC-shaped output via controlled switching
  - never a smooth sine wave for any of the three -- that is the plain graph.waveform_sine blueprint's own separate, correct depiction
- **Prohibited changes:**
  - do not draw a smooth continuous sine wave for any of the three states
  - do not conflate half-wave and full-wave shapes
- **Labels:** required=false pedagogicallyRequired=false annotationPolicy=NONE artExpectation=DETERMINISTIC_VECTOR_NOT_ART_GENERATED
- **Canonical learner-visible states (3):**
  - Half-wave rectified output [MULTI_STATE]
  - Full-wave rectified output [MULTI_STATE]
  - Inverter-synthesised AC output [MULTI_STATE]

**Current reference**
- Title: Standard half-wave/full-wave rectification and inverter output waveform references -- to be selected when this asset is commissioned
- URL: (none)
- Licence: to be recorded when selected
- Quality grade: to be assessed

**Reference-research flags**
- requiresReferenceResearch: **false**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: Deterministic vector asset -- no external pictorial reference required; authoritative geometry is governed by ALP's own deterministic renderer, not redrawn from an external image. No reference research action needed.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/deterministic-polish/rectification-waveforms-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: READY_TO_PROMPT
- Governed diagram blueprint: (none)

---

### Capacitor RC charge/discharge transient curve

- **assetId:** `unit202.capacitor.transient`
- **Role / production class:** TECHNICAL_DIAGRAM / DETERMINISTIC TECHNICAL
- **Need classification:** REQUIRED -- HIDDEN FROM CURRENT STUDIO QUEUE
- **Priority:** P1
- **Curriculum context:** LO6 — lesson.electrical.electronic-components-passive
- **Instructional purpose:** CC-11.7 audit finding (new, beyond the original 66): the exponential RC charge/discharge curve directly targeted by EL-COMPONENT-CAPACITOR-TRANSIENT-001 and question blueprint `electronics.recognise_capacitor_behaviour` ('gradual_exponential_change' vs 'instant_step_change'), which no existing blueprint depicts -- an exponential curve is a genuinely different shape from the plain sine wave.
- **Learner-visible deliverable:** Deterministic vector exponential-curve plots -- not a premium art-generation deliverable.
- **Immutable technical facts:**
  - charge/discharge follows a genuine exponential curve, never a straight-line ramp or instant step
  - never a sine wave -- this is a transient response, not a periodic waveform
- **Prohibited changes:**
  - do not draw a straight-line ramp or instant step in place of the exponential curve
  - do not draw a periodic/sine shape
- **Labels:** required=false pedagogicallyRequired=false annotationPolicy=NONE artExpectation=DETERMINISTIC_VECTOR_NOT_ART_GENERATED
- **Canonical learner-visible states (2):**
  - Charge curve (exponential rise) [MULTI_STATE]
  - Discharge curve (exponential decay) [MULTI_STATE]

**Current reference**
- Title: Standard RC charge/discharge exponential-curve reference -- to be selected when this asset is commissioned
- URL: (none)
- Licence: to be recorded when selected
- Quality grade: to be assessed

**Reference-research flags**
- requiresReferenceResearch: **false**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: Deterministic vector asset -- no external pictorial reference required; authoritative geometry is governed by ALP's own deterministic renderer, not redrawn from an external image. No reference research action needed.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/deterministic-polish/capacitor-transient-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: READY_TO_PROMPT
- Governed diagram blueprint: (none)

---

### Physical electronic component — zener diode

- **assetId:** `unit202.components.physical.zener-diode`
- **Role / production class:** PHYSICAL_RECOGNITION / PREMIUM CONCEPTUAL + deterministic UK/IEC symbol
- **Need classification:** USEFUL (USEFUL)
- **Priority:** P2 (secondary queue)
- **Curriculum context:** LO6 — lesson.electrical.electronic-components-switching-control
- **Instructional purpose:** A physical-appearance companion image for the zener diode, paired with its existing deterministic UK/IEC symbol card -- more specialist than the six REQUIRED components, genuinely useful but not REQUIRED for Unit 202 visual completeness (CC-11.7 audit finding).
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium physical-appearance illustration of a zener diode, matching a real, representative package form.
- **Immutable technical facts:**
  - package form must be a real, representative physical form for a zener diode
- **Prohibited changes:**
  - do not invent a misleading package form for the zener diode
  - do not generate until a primary reference is marked READY
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Physical appearance — zener diode (blocked) [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/physical-components/components-physical-zener-diode-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

### Physical electronic component — photodiode

- **assetId:** `unit202.components.physical.photodiode`
- **Role / production class:** PHYSICAL_RECOGNITION / PREMIUM CONCEPTUAL + deterministic UK/IEC symbol
- **Need classification:** USEFUL (USEFUL)
- **Priority:** P2 (secondary queue)
- **Curriculum context:** LO6 — lesson.electrical.electronic-components-switching-control
- **Instructional purpose:** A physical-appearance companion image for the photodiode, paired with its existing deterministic UK/IEC symbol card -- more specialist than the six REQUIRED components, genuinely useful but not REQUIRED for Unit 202 visual completeness (CC-11.7 audit finding).
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium physical-appearance illustration of a photodiode, matching a real, representative package form.
- **Immutable technical facts:**
  - package form must be a real, representative physical form for a photodiode
- **Prohibited changes:**
  - do not invent a misleading package form for the photodiode
  - do not generate until a primary reference is marked READY
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Physical appearance — photodiode (blocked) [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/physical-components/components-physical-photodiode-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

### Physical electronic component — DIAC

- **assetId:** `unit202.components.physical.diac`
- **Role / production class:** PHYSICAL_RECOGNITION / PREMIUM CONCEPTUAL + deterministic UK/IEC symbol
- **Need classification:** USEFUL (USEFUL)
- **Priority:** P2 (secondary queue)
- **Curriculum context:** LO6 — lesson.electrical.electronic-components-switching-control
- **Instructional purpose:** A physical-appearance companion image for the DIAC, paired with its existing deterministic UK/IEC symbol card -- more specialist than the six REQUIRED components, genuinely useful but not REQUIRED for Unit 202 visual completeness (CC-11.7 audit finding).
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium physical-appearance illustration of a DIAC, matching a real, representative package form.
- **Immutable technical facts:**
  - package form must be a real, representative physical form for a DIAC
- **Prohibited changes:**
  - do not invent a misleading package form for the DIAC
  - do not generate until a primary reference is marked READY
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Physical appearance — DIAC (blocked) [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/physical-components/components-physical-diac-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

### Physical electronic component — TRIAC

- **assetId:** `unit202.components.physical.triac`
- **Role / production class:** PHYSICAL_RECOGNITION / PREMIUM CONCEPTUAL + deterministic UK/IEC symbol
- **Need classification:** USEFUL (USEFUL)
- **Priority:** P2 (secondary queue)
- **Curriculum context:** LO6 — lesson.electrical.electronic-components-switching-control
- **Instructional purpose:** A physical-appearance companion image for the TRIAC, paired with its existing deterministic UK/IEC symbol card -- more specialist than the six REQUIRED components, genuinely useful but not REQUIRED for Unit 202 visual completeness (CC-11.7 audit finding).
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium physical-appearance illustration of a TRIAC, matching a real, representative package form.
- **Immutable technical facts:**
  - package form must be a real, representative physical form for a TRIAC
- **Prohibited changes:**
  - do not invent a misleading package form for the TRIAC
  - do not generate until a primary reference is marked READY
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Physical appearance — TRIAC (blocked) [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/physical-components/components-physical-triac-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

### Physical electronic component — thyristor/SCR

- **assetId:** `unit202.components.physical.thyristor-scr`
- **Role / production class:** PHYSICAL_RECOGNITION / PREMIUM CONCEPTUAL + deterministic UK/IEC symbol
- **Need classification:** USEFUL (USEFUL)
- **Priority:** P2 (secondary queue)
- **Curriculum context:** LO6 — lesson.electrical.electronic-components-switching-control
- **Instructional purpose:** A physical-appearance companion image for the thyristor/SCR, paired with its existing deterministic UK/IEC symbol card -- more specialist than the six REQUIRED components, genuinely useful but not REQUIRED for Unit 202 visual completeness (CC-11.7 audit finding).
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium physical-appearance illustration of a thyristor/SCR, matching a real, representative package form.
- **Immutable technical facts:**
  - package form must be a real, representative physical form for a thyristor/SCR
- **Prohibited changes:**
  - do not invent a misleading package form for the thyristor/SCR
  - do not generate until a primary reference is marked READY
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Physical appearance — thyristor/SCR (blocked) [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/physical-components/components-physical-thyristor-scr-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

## Chemical effect / electrolysis

*Family:* `unit202.family.electrolysis` -- 1 distinct final image(s). A single, simple concept: one cell arrangement (source, electrolyte, electrodes, current path).

*Family notes:* Single-asset family -- one arrangement, no distinct states or configurations to separate. CC-11.7 audit corroboration: EL-CURRENT-CHEMICAL-EFFECT-001 (electrolysis) has no representation anywhere in the deterministic CC-05D system (none of the 16 blueprints depict a chemistry apparatus), confirming this asset is REQUIRED, not merely USEFUL as originally scoped.

### Chemical effect / electrolysis

- **assetId:** `unit202.electrolysis`
- **Role / production class:** PHENOMENON / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P1 (upgraded from P1/P2 -- CC-11.7 corpus corroboration)
- **Curriculum context:** LO4 — lesson.electrical.thermal-and-chemical-effects
- **Instructional purpose:** Show the chemical effect of current: a source, an electrolyte and electrodes, with a meaningful current path -- no chemistry beyond syllabus scope.
- **Learner-visible deliverable:** One premium illustration of an electrolysis cell showing source, electrolyte and electrodes, matching the reference geometry exactly. Produce ONLY this asset -- do not automatically create the other members of this visual family.
- **Immutable technical facts:**
  - source present
  - electrolyte present
  - electrodes present
  - meaningful current path
- **Prohibited changes:**
  - do not introduce chemistry detail beyond Unit 202 syllabus scope
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Electrolysis cell — source, electrolyte, electrodes, current path [TEACHING]

**Current reference**
- Title: Wikimedia Commons — Elektrolyse Allgemein.svg
- URL: https://commons.wikimedia.org/wiki/File:Elektrolyse_Allgemein.svg
- Licence: prefer CC0/public-domain reference where available
- Quality grade: B+
- Secondary reference: Wikimedia Commons — Electrolysis diagram.png -- https://commons.wikimedia.org/wiki/File:Electrolysis_diagram.png (recorded per source page)

**Reference-research flags**
- requiresReferenceResearch: **false**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **MEDIUM**
- notesForReferenceResearch: No confirmed problem on record. Standard appraisal welcome (geometry/topology match, licence, provenance) as part of this pack's general research pass.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/hybrid/electrolysis-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: SAVED
- Governed diagram blueprint: (none)

---

## Heating effect of electric current

*Family:* `unit202.family.heating-effect` -- 1 distinct final image(s). A single conceptual illustration of resistive heating -- blocked pending a primary reference.

*Family notes:* Single-asset family, reference not yet approved.

### Heating effect of electric current

- **assetId:** `unit202.heating-effect`
- **Role / production class:** PHENOMENON / PREMIUM CONCEPTUAL / HYBRID
- **Need classification:** REQUIRED
- **Priority:** P2
- **Curriculum context:** LO4 — lesson.electrical.thermal-and-chemical-effects
- **Instructional purpose:** Show the heating effect of electric current (resistive heating) at a conceptual level.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY.
- **Immutable technical facts:**
  - (none recorded)
- **Prohibited changes:**
  - do not generate until a primary reference is marked READY
- **Labels:** required=false pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=CLEAN_BASE_ART
- **Canonical learner-visible states (1):**
  - Heating effect of electric current (blocked) [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/conceptual/heating-effect-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

## Conductor vs insulator

*Family:* `unit202.family.conductor-insulator` -- 1 distinct final image(s). A single conceptual comparison -- blocked pending a primary reference.

*Family notes:* Single-asset family, reference not yet approved.

### Conductor vs insulator

- **assetId:** `unit202.conductor-insulator`
- **Role / production class:** COMPARISON / PREMIUM CONCEPTUAL
- **Need classification:** REQUIRED
- **Priority:** P2
- **Curriculum context:** LO4 — lesson.electrical.conductors-and-insulators
- **Instructional purpose:** Show a material-recognition comparison between conductors and insulators.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY.
- **Immutable technical facts:**
  - (none recorded)
- **Prohibited changes:**
  - do not generate until a primary reference is marked READY
- **Labels:** required=false pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=CLEAN_BASE_ART
- **Canonical learner-visible states (1):**
  - Conductor vs insulator (blocked) [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/conceptual/conductor-insulator-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

## Fuse vs circuit breaker comparison

*Family:* `unit202.family.protective-devices` -- 1 distinct final image(s). A single side-by-side comparison illustration -- blocked pending a primary reference.

*Family notes:* Single-asset family, reference not yet approved. CC-11.7 audit corroboration: a dedicated capability, cap.fault.compare_fuse_breaker, exists with zero visual representation anywhere in the corpus -- the fuse-vs-breaker reset/replace comparison is REQUIRED once a reference is sourced, upgraded from the original blocked/deferred framing. CC-11.7B correction: this asset's ROLE was PHYSICAL_RECOGNITION (a mismatch -- it does not depict one recognisable physical component) and its displayName/scope implied broader MCB/RCD physical-recognition coverage that was never actually modelled or corroborated; narrowed to what the governed capability actually asks for -- COMPARISON, fuse vs circuit breaker specifically -- per the explicit CC-11.7B pedagogical decision recorded on the asset's own sharedBaseAudit.

### Fuse vs circuit breaker comparison

- **assetId:** `unit202.protective-devices`
- **Role / production class:** COMPARISON / PREMIUM CONCEPTUAL + deterministic functional explanation
- **Need classification:** REQUIRED
- **Priority:** P2
- **Curriculum context:** LO4 — lesson.electrical.fault-conditions-protection
- **Instructional purpose:** Show a fuse and a circuit breaker side by side, supporting cap.fault.compare_fuse_breaker (fuse must be replaced once blown; breaker can be reset), without endorsing one manufacturer's product appearance as canonical.
- **Learner-visible deliverable:** BLOCKED -- primary reference still to be approved. Do not generate until reference is marked READY. Once ready: one premium side-by-side illustration (fuse | circuit breaker), matching the immutable facts exactly.
- **Immutable technical facts:**
  - one fuse and one circuit breaker shown side by side, not as two separate images
  - must not endorse one manufacturer's product appearance as canonical
- **Prohibited changes:**
  - do not generate until a primary reference is marked READY
  - avoid making one manufacturer's product appearance canonical
  - do not split into two separate images -- this is one comparison deliverable
- **Labels:** required=true pedagogicallyRequired=true annotationPolicy=TEACHING_EXPLANATORY artExpectation=LABELLED_ARTWORK
- **Canonical learner-visible states (1):**
  - Fuse vs circuit breaker comparison (blocked) [TEACHING]

**Current reference**
- Title: PRIMARY REFERENCE STILL TO BE APPROVED
- URL: (none)
- Licence: unknown -- not yet sourced
- Quality grade: n/a

**Reference-research flags**
- requiresReferenceResearch: **true**
- referenceStatus: **MISSING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: No reference has been sourced/approved yet. Needs ChatGPT reference research: a real image whose geometry/topology matches this asset's immutableFacts and does not conflict with its prohibitedChanges.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/conceptual/protective-devices-fuse-vs-breaker-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: REFERENCE_NOT_READY
- Governed diagram blueprint: (none)

---

## Right-angle triangle / SOHCAHTOA

*Family:* `unit202.family.trigonometry` -- 1 distinct final image(s). A single deterministic geometry illustration -- lesson integration remains deferred.

*Family notes:* Single-asset family, tracked for future commissioning only.

### Right-angle triangle / SOHCAHTOA

- **assetId:** `unit202.trigonometry`
- **Role / production class:** TECHNICAL_DIAGRAM / DETERMINISTIC TECHNICAL
- **Need classification:** DEFERRED_SCOPE -- HIDDEN FROM CURRENT STUDIO QUEUE
- **Priority:** future / P2
- **Curriculum context:** LO1 — no current lesson (integration deferred, see reports/instructional-visuals/visual-needs-matrix.md)
- **Instructional purpose:** A right-angle triangle showing hypotenuse/opposite/adjacent relative to a selected acute angle, supporting SOHCAHTOA -- lesson integration remains deferred.
- **Learner-visible deliverable:** No lesson exists to host this asset yet -- tracked for future commissioning only, not for current production.
- **Immutable technical facts:**
  - right angle present
  - hypotenuse opposite the right angle
  - opposite/adjacent sides correctly identified relative to the selected acute angle
- **Prohibited changes:**
  - do not build a new lesson to host this asset -- current lesson integration remains deferred per the content freeze
- **Labels:** required=false pedagogicallyRequired=false annotationPolicy=NONE artExpectation=DETERMINISTIC_VECTOR_NOT_ART_GENERATED
- **Canonical learner-visible states (1):**
  - Right-angle triangle / SOHCAHTOA [TEACHING]

**Current reference**
- Title: Standard right-triangle trigonometry reference -- to be selected when this asset is actually commissioned
- URL: (none)
- Licence: to be recorded when selected
- Quality grade: to be assessed

**Reference-research flags**
- requiresReferenceResearch: **false**
- referenceStatus: **APPROVED_EXISTING**
- currentReferenceConfidence: **NONE**
- notesForReferenceResearch: Deterministic vector asset -- no external pictorial reference required; authoritative geometry is governed by ALP's own deterministic renderer, not redrawn from an external image. No reference research action needed.

**Production/output**
- Expected output path stem: `apps/mobile/src/assets/instructional/unit202/deterministic-polish/trigonometry-base` (+ `-vN.{png|webp|jpg}` on approval)
- Current workflow status: READY_TO_PROMPT
- Governed diagram blueprint: (none)

---
