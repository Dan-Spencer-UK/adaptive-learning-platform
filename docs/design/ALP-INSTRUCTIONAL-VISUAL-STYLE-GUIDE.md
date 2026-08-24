# ALP Instructional Visual Style Guide

**Single source of truth for every generated (premium/hybrid) instructional image.** Consolidates the visual direction already established and approved across CC-11.5–CC-11.7C (recorded piecemeal inside `tools/visual-production-studio/catalogue.ts` prompt fields and `docs/architecture/PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md`) into one governed document. Nothing in this file is a new art-direction decision -- it is the same standard, written down once instead of duplicated per-asset.

Every generation call (Gemini or any future renderer) must include this document's rules verbatim or by direct reference. A per-asset prompt may add asset-specific immutable facts on top of this guide; it may never contradict it.

---

## 1. Product character

**INDUSTRIAL PRECISION + PREMIUM CONSUMER LEARNING PRODUCT.**

ALP is adult/vocational technical training, not a schoolbook. Every generated image must read as:

- adult, vocational, technically credible;
- contemporary and calm, never busy or decorative;
- tactile -- real materials, real surfaces, real light;
- premium -- the visual quality of a well-designed physical tool, not a stock-art placeholder;
- mobile-first -- legible and well-composed at phone scale, not designed for a poster then shrunk.

Explicitly **not**:

- children's educational artwork (no cartoon proportions, no mascot energy);
- white textbook diagrams (no clinical white backgrounds, no clip-art line icons);
- corporate clip-art (no generic "business illustration" style, no flat-icon people);
- cyberpunk / neon (no glow, no saturated magenta-cyan lighting, no sci-fi HUD framing);
- advertising-style dramatic imagery (no hero lighting, no lens flare, no aspirational lifestyle framing -- the subject is the apparatus, not a mood).

## 2. Background standard (governed, not improvised)

Every prior manually-produced batch drifted on background treatment because each session re-invented it from an adjective ("dark and premium"). That drift is unacceptable. The background is **governed**: a generation request states it explicitly and must never leave it to model interpretation.

**Canonical values** -- reused directly from the shipped app's own token file (`apps/mobile/src/lib/tokens.ts`, `color` export), never invented separately:

| Role | Token | Hex |
|---|---|---|
| Background gradient start | `color.surface` | `#151821` |
| Background gradient end | `color.border` | `#262B38` |

**Instruction text (use verbatim in generation prompts):**

> Background: a muted, medium-dark slate/blue-grey surface with a subtle, restrained gradient from `#151821` toward `#262B38`. Visibly softer and less harsh than pure black (`#0B0D12`, the app's own UI background, is deliberately NOT used for illustration backgrounds -- it reads as a void behind artwork). Low saturation. No visible texture, no scenery, no vignette beyond the gradient itself, no neon or cyberpunk treatment, no pure-black void.

**Tolerance:** the gradient may vary in angle/softness for compositional reasons, but both endpoint colours must stay within roughly ±10% lightness/hue of the values above. A background that reads as pure black, pure white, saturated colour, or a photographic scene is a style-guide violation regardless of technical correctness elsewhere in the image.

**Exemption:** `DETERMINISTIC_TECHNICAL` assets (schematics, waveforms, symbol cards, assessment-tile geometry) have no illustrated background at all -- this section does not apply to them (see §3).

## 3. Raster vs. vector responsibility

This is the load-bearing governance boundary of the whole pipeline (see `docs/architecture/adr/ADR-0004-deterministic-authority-over-generated-instructional-imagery.md`): **generated raster art is never technical authority.**

**Raster (Gemini-generated) is responsible for:**

- physical object rendering (materials, forms, proportions as established by the technical reference);
- material appearance and finish;
- lighting and shading;
- non-authoritative environmental/contextual appearance (composition, framing, incidental background detail within the governed background standard).

**Deterministic overlay (ALP's own rendering code, never Gemini) is responsible for:**

- labels, callouts, and captions;
- arrows and direction indicators;
- dimensions and measurements;
- exact current/field/force direction;
- circuit topology and connectivity;
- waveform shapes and curves;
- schematic symbols (UK/IEC convention);
- assessment-state information (what is shown vs withheld);
- any answer-revealing annotation;
- any geometry where numerical/relational exactness matters more than appearance.

If a governed fact must be exact (a direction, a count, a topology, an answer), it is drawn by ALP's own code on top of a clean raster base -- never requested from, or trusted from, the generative model.

## 4. Label policy (default: clean base art)

**Default: generate clean base art. Do not bake ordinary instructional labels, arrows, or teaching callouts into the raster image.**

This is a correction of an earlier (CC-11.5) default that assumed labels should usually be omitted for aesthetic cleanliness -- the corrected rule (CC-11.6, "ANNOTATION FOLLOWS PEDAGOGICAL STATE") is that a teaching image legitimately needs explanatory labels, but the *mechanism* for adding them still defaults to deterministic overlay wherever the asset contract allows it, because that:

- lets one master image resize correctly across device sizes without label distortion;
- keeps text sharp at every resolution (raster-baked text degrades on scaling);
- supports localisation (a baked English label cannot be translated without regenerating the artwork);
- lets the same master serve teaching, assessment, and feedback states with different (or no) labels, without three separate generation jobs;
- keeps every answer-bearing label under ALP's own deterministic control, never dependent on a generative model correctly omitting or including it.

An individual asset contract may explicitly require labels to be baked into the artwork itself (e.g. a hand-rule mnemonic where the label is inseparable from the composition) -- that is a deliberate, recorded exception per asset, not a default. See each asset's own `annotationPolicy`/`requiredLabels` in `tools/visual-production-studio/catalogue.ts`.

## 5. Technical reference vs. style reference

Two different kinds of reference material feed a generation job, and they must never be conflated:

- **Technical reference** = *what* the object/geometry/topology must depict. Supplied as an actual reference image (never only a URL or a text description -- see the production pipeline doc). It is the authoritative geometry/topology skeleton: component count, connectivity, spatial relationships, directional facts. **Technical truth always wins over stylistic composition.**
- **Style reference** = *how* ALP artwork should look (this document, plus an optional approved style-reference image -- see §7). It governs rendering language, background, material treatment, lighting, and composition -- never the underlying facts.

A generation prompt must state both, and must state explicitly that the technical reference's relationships are preserved exactly while its appearance is re-illustrated in ALP style.

## 6. Family consistency

Assets in the same `VisualFamily` (e.g. the three lever classes, or fixed/movable pulleys) must look like they belong to the same physical product line:

- same rendering language (illustration style, level of realism);
- same background treatment (§2);
- same material treatment (finish, texture language);
- same visual scale/proportion conventions;
- same lighting approach (direction, softness, contrast);
- same label/overlay conventions (§4).

Do not allow every generation call to reinterpret the brand independently. When producing more than one asset from the same family in a session, the master art session prompt (this document plus `tools/visual-production-studio/master-prompt.ts`) is supplied once and referenced by every subsequent per-asset job in that session, precisely so consistency is inherited rather than re-derived each time.

## 7. Style-reference assets

Approved canonical style-reference images (once any exist) live at `docs/design/visual-style-references/` -- see that directory's own `README.md` for the registration process and current inventory. A style-reference image, when one has been approved, is supplied to the generative model *alongside* this text guide and the per-asset technical reference; it is never a substitute for either.

---

*This document is the durable design authority for how generated instructional imagery looks. It does not establish what any specific asset must depict -- that is the technical reference and the asset's own contract in `tools/visual-production-studio/catalogue.ts`. See `docs/architecture/PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md` for the full production pipeline this guide is one input to.*
