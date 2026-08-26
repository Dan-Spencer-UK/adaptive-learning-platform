/**
 * CC-11.14: explicit PRESERVE/ADD/REMOVE/REPLACE remediation contracts for
 * the three-asset bounded correctness package, authored BEFORE any
 * image-generation call per the task brief's own §8/§3 requirement. Uses
 * `asset-lifecycle.ts`'s `RemediationContract` type -- the schema every
 * remediation package should use, per CC-11.13 §4.
 */
import type { RemediationContract } from "./asset-lifecycle.ts";

export const CC_11_14_REMEDIATION_CONTRACTS: Record<string, RemediationContract> = {
  "unit202.right-hand-grip.teaching": {
    preserve: [
      "right hand identity and pose",
      "thumb pointing along the conductor (current direction)",
      "copper conductor rod",
      "\"THUMB = CURRENT\" label and its pointer arrow",
      "\"FINGERS = MAGNETIC FIELD\" label and its pointer arrow",
    ],
    add: [
      "a single deterministic, geometry-locked wrap-around field-circulation cue: an ellipse encircling the conductor at the hand's grip height, ONE arrowhead only, sweeping right-to-left across the front of the rod (matching the visible finger curl from base near the palm to fingertip, and matching the direction independently measured from the Product-Owner-approved Wikimedia \"Right-hand grip rule.svg\" reference after rigidly rotating it to a vertical current direction) -- composited programmatically, not generated, so its correctness is provable by construction",
    ],
    remove: [
      "the existing copper-coloured crescent arrow (defective: two arrowheads on one stroke, ambiguous direction)",
      "the existing dark detached arrow near the wrist/thumb (defective: does not wrap the conductor, reads as a separate hand gesture, fails audit criterion #5)",
    ],
    replace: [
      { from: "both existing field-circulation arrows", to: "one deterministic wrap-around ellipse arrow, geometry derived from the reference, not generated" },
    ],
  },
  "unit202.emf.motional": {
    preserve: [
      "simple flat 2D board treatment (no photoreal rails/pipes, no pseudo-3D)",
      "two horizontal rails",
      "one active conductor (the red vertical bar)",
      "B-field convention: uniform field into the page, drawn as a grid of X marks",
      "v arrow: horizontal, perpendicular to the conductor, in the direction of motion",
    ],
    add: [
      "a correct l dimension bracket, drawn VERTICALLY along the active conductor, spanning exactly the conductor's length between the two rails",
    ],
    remove: [
      "the incorrect horizontal l bracket at the bottom of the diagram (measured a horizontal rail-span, not the conductor's length -- the named CC-11.13A defect)",
    ],
    replace: [
      { from: "horizontal l bracket (wrong dimension)", to: "vertical l bracket along the active conductor (l ⊥ v, l ⊥ B, v ⊥ B all satisfied)" },
    ],
  },
  "unit202.levers.class-3": {
    preserve: [
      "Class III ordering: FULCRUM at one end, LOAD at the other end, EFFORT positioned between them (the catalogue's own governed immutableFact for this asset -- no additional relative-distance requirement)",
      "the approved reference's simple flat line-diagram composition (beam, load glyph, effort arrow, fulcrum marker) as the geometry/composition skeleton",
    ],
    add: [
      "clean, flat, original ALP visual styling only (premium typography and line work) -- no new semantic content",
    ],
    remove: [
      "the \"RESISTANCE\" label (inherited from the raw reference, not part of the governed FULCRUM/EFFORT/LOAD label set)",
      "the \"MOTION\" label and its arrow (inherited from the raw reference, not part of the governed label set)",
      "the 3D photoreal metallic beam/wedge rendering, the beam-geometry regression from the CC-11.12 attempt, and all decorative/contextual elements",
    ],
    replace: [
      { from: "\"RESISTANCE\" box+arrow", to: "\"LOAD\" box+arrow (same glyph, governed label)" },
      { from: "3D photoreal redraw with 5 labels", to: "clean flat 2D original ALP redraw with exactly 3 labels: FULCRUM, EFFORT, LOAD" },
    ],
  },
};
