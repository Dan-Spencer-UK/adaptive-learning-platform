# ALP Product-Wide Visual Design System

**Status:** Governing design system for instructional visuals and deterministic technical diagrams across the entire ALP product.

This document strengthens and supersedes any vague or unit-local style guidance. Existing approved visual decisions remain valid unless explicitly changed here. Unit-specific prompts may add facts, never contradict this system.

## 1. Product character

ALP instructional visuals must feel like one premium adult vocational-learning product:

- technically credible;
- calm and contemporary;
- purposeful rather than decorative;
- high-contrast and mobile-readable;
- visually sophisticated without becoming cinematic or distracting;
- consistent across qualifications, units and lessons.

Avoid:

- cartoon-schoolbook aesthetics;
- clip-art;
- arbitrary gradients/effects;
- unrelated stock photography;
- decorative 3D that reduces clarity;
- inconsistent diagram dialects between units.

## 2. Design-token philosophy

Visual production uses named product tokens, not per-image improvised values.

A future implementation should expose these tokens machine-readably. Until then, the following roles are authoritative even where exact UI hex values are inherited from the app theme.

### Background roles and exact values

The canonical illustrated-visual background established in the existing ALP style guide remains authoritative and is promoted to the product-wide system:

| Token | Value | Use |
|---|---:|---|
| `VISUAL_CANVAS_LIGHT` | `#FBFBFA` | default illustrated teaching canvas |
| `VISUAL_CANVAS_LIGHT_DEPTH` | `#F0F1F3` | optional subtle cool-grey tonal depth/gradient endpoint |
| `VISUAL_STRUCTURAL` | `#1F2937` | primary neutral technical line/text |
| `VISUAL_STRUCTURAL_SECONDARY` | `#64748B` | secondary/de-emphasised technical line/text |
| `VISUAL_CURRENT` | `#2563EB` | conventional-current/electrical-flow cue |
| `VISUAL_MAGNETIC_FIELD` | `#16A34A` | magnetic-field cue |
| `VISUAL_FORCE_MOTION` | `#DC2626` | force/motion cue |
| `VISUAL_WARNING` | `#D97706` | caution/warning cue |
| `VISUAL_CORRECT` | `#16A34A` | correct-state cue; never colour-only |
| `VISUAL_INCORRECT` | `#DC2626` | incorrect-state cue; never colour-only |
| `VISUAL_N_POLE` | `#2563EB` | north-pole family cue |
| `VISUAL_S_POLE` | `#16A34A` | south-pole family cue |

Illustrated assets may use a very subtle gradient from `#FBFBFA` toward `#F0F1F3`. Shadow/depth is neutral grey at **≤12% opacity**, soft and short-throw. No tinted shadow.

`VISUAL_CANVAS_DARK` is **not a general alternative default**. The prior dark-slate default is retired. A dark surface is allowed only when the depicted apparatus itself contains one (for example an oscilloscope screen), or when the Product Owner explicitly approves a new family-wide exception.

`APP_SURFACE_DARK` is learner-app chrome and must not be confused with the instructional-art canvas.

`DETERMINISTIC_TECHNICAL` diagrams should normally render on a transparent/neutral card surface or the canonical light technical canvas; they do not receive decorative illustrated backgrounds.

Colour alone may never encode required meaning.

## 3. Canvas and layout

### Standard outputs
Every visual family must declare a target aspect ratio suitable for the real mobile card. Prefer a small controlled set such as:
- 4:3 technical teaching diagram;
- 1:1 component/symbol tile;
- 16:9 wide comparison/sequence where justified.

Do not create arbitrary aspect ratios per generation call.

### Safe margins
- maintain a clear outer safe margin;
- no critical label may touch or nearly touch the crop;
- arrowheads and field lines must remain within the safe area unless deliberately depicting continuation.

### Visual hierarchy
One visual = one primary teaching idea unless explicitly a comparison/sequence visual.

## 4. Typography

Learner-facing labels must use the approved product typeface or a deterministic rendering equivalent. Do not allow generative models to invent typography where text accuracy matters.

Rules:
- sentence case by default;
- uppercase only for conventional symbols/short technical labels;
- avoid tiny explanatory prose baked into raster images;
- mathematical variables follow course notation exactly;
- multiplication displayed as `×`, not the word `times`;
- Unit/course conventions override typographic cleverness (e.g. use `L` if the course uses capital L; do not substitute `ℓ` merely for visual distinction).

Formula variables and unit symbols must be distinguishable at phone scale.

## 5. Stroke and line system

Technical diagrams must use a controlled stroke hierarchy rather than arbitrary widths.

Define implementation tokens equivalent to:
- `STROKE_PRIMARY` — main conductor/component outline;
- `STROKE_SECONDARY` — supporting geometry;
- `STROKE_FIELD` — field/trajectory lines;
- `STROKE_DIMENSION` — dimension/construction lines;
- `STROKE_HAIRLINE` — subtle guides only.

Canonical stroke widths are defined at a **1024 px reference export** and scale proportionally with the canvas:

| Token | 1024 px reference width | Use |
|---|---:|---|
| `STROKE_PRIMARY` | 4 px | conductor/component/main geometry |
| `STROKE_SECONDARY` | 3 px | supporting geometry |
| `STROKE_FIELD` | 3 px | magnetic/trajectory/flow lines |
| `STROKE_DIMENSION` | 2 px | dimensions/construction lines |
| `STROKE_HAIRLINE` | 1.5 px | subtle guides only |

At other export sizes multiply these widths by `exportWidth / 1024`. On-device SVG rendering should preserve the same perceived hierarchy rather than blindly retaining pixel values.

Arrow shafts use the applicable stroke token. Default arrowhead length is **3.0× shaft width** and arrowhead width is **2.25× shaft width**. Assessment-safe diagrams must use the same geometry family as teaching diagrams; they differ only in governed information state.

### End caps and joins
- circuit/conductor lines: round joins with butt/square terminal ends unless the governed symbol requires otherwise;
- field/trajectory lines: round caps and round joins;
- explanatory arrows: product-standard triangular arrowheads using the geometry above;
- no mixed hand-drawn/engineering strokes within one family.

### Corner and junction geometry
- circuit-routing bends: 90° orthogonal by default, no decorative radius;
- card/legend boxes: use current app radius token, not baked image-specific radii;
- electrical junction dot diameter: **2.5× primary stroke width**;
- crossing-without-connection must not use a junction dot and must remain visually unambiguous at phone scale.

## 6. Circuit and schematic drawing grammar

### Wires
- orthogonal routing by default;
- avoid decorative curves unless the physical concept requires them;
- junctions use deterministic junction-dot convention;
- crossings without connection must be visually unambiguous.

### Components
- use the governed UK/IEC symbol library;
- symbol proportions and terminal geometry are deterministic;
- no generative interpretation of schematic symbols;
- labels are aligned consistently and kept outside symbol geometry where practical.

### Direction and polarity
- conventional current arrows use one global arrow style;
- voltage polarity markers use one global plus/minus treatment;
- `×` = into the page;
- `•` = out of the page;
- these symbols must be taught explicitly before they are relied upon in assessment.

## 7. Electronics component family grammar

For recognition content, each component family should support:

- physical-recognition image;
- standard symbol companion;
- labelled teaching state;
- unlabelled/assessment-safe state where appropriate;
- consistent crop/scale/background treatment.

Diode-family symbols, thermistors, capacitors, resistors, transistors, TRIACs, thyristors etc. must not appear as isolated one-off styles.

## 8. Electromagnetism grammar

- N/S pole blocks use a stable product-wide treatment;
- magnetic field lines use a consistent field cue and arrowhead system;
- current direction uses a distinct but consistent cue;
- force/motion uses a third cue;
- Fleming/right-hand relationships are reference-locked, not generated from memory;
- `×`/`•` direction symbols follow the global convention;
- hand-rule artwork must use the correct hand and exact finger/thumb correspondences.

## 9. Mechanics grammar

- fulcrum/pivot marker is consistent across lever families;
- effort/load arrows share one geometry system;
- labels use a consistent placement pattern;
- mechanical diagrams default to clean 2D unless 3D materially improves understanding.

## 10. Background policy

Default technical diagrams should normally use the light technical canvas because it maximises line/symbol clarity and supports cohesive printing/export.

Dark slate/blue-grey backgrounds remain available for approved illustration families where they materially improve presentation. A family must not switch light/dark arbitrarily between assets.

The Product Owner may approve a family-specific background treatment; once approved it becomes part of that family contract.

## 11. Raster vs deterministic overlay

Use deterministic/native/SVG rendering for:
- exact labels;
- formulae;
- standard symbols;
- topology;
- direction arrows where correctness is critical;
- dimensions;
- assessment-state masking/highlighting.

Use generated raster/vector art for:
- realistic objects;
- hands/body parts;
- material rendering;
- conceptual scenes;
- premium illustrative base art.

Hybrid is preferred when artistic realism and exact technical annotation are both needed.

## 12. Label policy

A clean base master should avoid baked text unless text is part of the intentional illustration and is reliably rendered.

Teaching labels should preferably be deterministic overlays so:
- wording can be changed;
- localisation remains possible;
- assessment-safe variants can remove labels;
- accessibility descriptions can stay aligned.

## 13. Family consistency checklist

Within a visual family, lock:
- canvas/background;
- rendering style;
- line-weight grammar;
- palette roles;
- viewing angle;
- material/lighting language;
- label typography;
- arrow style;
- scale/crop conventions.

A new asset that breaks family grammar requires explicit design-system review.

## 14. Accessibility and mobile readability

At target phone scale:
- critical labels must remain readable without zoom;
- contrast must meet app accessibility requirements;
- no distinction may rely solely on hue;
- diagrams need meaningful accessibility descriptions;
- touch regions for interactive diagrams must meet mobile touch-target requirements.

## 15. Teaching vs assessment states

Teaching state may reveal labels/arrows/relationships.

Assessment state must suppress answer-bearing information but retain the visual stimulus necessary to solve the problem.

The transformation between the two states should be deterministic and recorded in the asset/diagram contract.

## 16. Technical correctness over aesthetics

When a premium-looking output conflicts with the authoritative technical reference, the premium-looking output loses.

When deterministic geometry and generated imagery disagree, deterministic geometry wins.

## 17. Product-wide change control

Any change to:
- core background treatment;
- semantic colour roles;
- circuit-symbol grammar;
- line-weight system;
- typography/formula notation;
- technical arrow grammar;
- component-recognition treatment;

is a product-wide design-system change, not a local unit tweak. It requires Project Architect review and Product Owner approval.

### 17.1 Machine-readable version binding (CC-13A)

This document's own governed identity, for `VisualRequirement.designSystemVersion` / `VisualFamilyContract.designSystemVersion` (`docs/architecture/LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md` §5/§7, implemented in `@alp/content-schema`'s `visual-governance.ts`) to bind against, is:

```
CURRENT_DESIGN_SYSTEM_VERSION = "ALP-VDS-2026-08-29"
```

Every governed `VisualRequirement`/`VisualFamilyContract`/`ProductionVisualAsset` must declare this exact string until §17 records a superseding product-wide change (at which point this section is updated to the new version and the schema/validator constant is updated in the same change). A visual artefact declaring a version string other than the current one is a stale-binding review trigger, never a silent pass.

## 18. V1 lesson-composition implications

ADR-0006 establishes one canonical premium lesson route for V1.

Visual composition must therefore support **substantive scrollable teaching**, not optimise artwork around a one-image-per-viewport or slide-deck assumption.

For V1:
- a teaching section may contain multiple coordinated visual assets when they explain/reinforce different aspects of the same concept;
- images must be sized for legibility and instructional impact, not shrunk merely to keep Continue visible without scrolling;
- visual rhythm should support longer coherent sections using spacing, headings, captions and deterministic overlays;
- the floating more-content-below affordance belongs to the app UI, not to the artwork;
- asset families should prioritise canonical lesson use plus assessment-safe states;
- bespoke adaptive-remediation visual branches are post-V1 unless explicitly approved.

The design system must make a long, well-composed teaching section feel intentional and premium rather than like a document pasted into an app.
