/**
 * CC-11.9: reference corrections from the Product Owner's external
 * reference-research handover (2026-08-24), stored verbatim at
 * reports/instructional-visuals/reference-research/unit202/.
 *
 * ARCHITECTURAL CHOICE: applied as an additive overlay keyed by assetId,
 * not as an in-place rewrite of catalogue.ts's own asset declarations.
 * Several asset families in catalogue.ts (motor.effect.*, generator.*,
 * magnet.poles.*, gears.*, components.physical.*, diode.bias-direction.*,
 * instrument.*) are generated programmatically from shared loop/template
 * data tables, not as one hand-written block per assetId -- an automated
 * text-block rewrite against those templates was attempted first and
 * proven unsafe (it could not reliably find a unique per-asset region to
 * replace). This overlay achieves the same correction -- every generative
 * asset resolves to a real, Product-Owner-approved reference -- without
 * risking corruption of the generator code. Consumers that need an
 * asset's real primary/secondary reference or true readiness must call
 * effectivePrimaryReference()/effectiveSecondaryReference()/
 * effectiveReferenceReadiness() below, not asset.primaryReference directly.
 *
 * CC-11.12: a reference resolving READY here is necessary but NOT
 * sufficient for a generative job to proceed -- see the sibling additive
 * overlay `semantic-reference-qa.ts` (`SEMANTIC_QA`,
 * `requiresApprovedSemanticQa()`). That file records the separate,
 * permanent product/content-governance judgement of whether the *exact
 * frame* this overlay resolves to has itself passed semantic reference QA
 * against the exact governed learner-visible state. `run-production.ts`
 * checks both gates.
 */

import type { CatalogueReference, ReferenceReadiness, VisualAsset } from "./catalogue.ts";

export interface ReferenceCorrection {
  researchDecision: "APPROVED_PRODUCTION_REFERENCE" | "APPROVED_WITH_PREPARATION" | "DETERMINISTIC_INTERNAL_AUTHORITY" | "CONTRACT_CORRECTION_REQUIRED";
  primaryReference: CatalogueReference;
  secondaryReference?: CatalogueReference;
  referencePreparation: string;
  contractCorrections: string[];
}

export const REFERENCE_CORRECTIONS: Record<string, ReferenceCorrection> = {
  "unit202.current-conductor.magnetic-field": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — Wire fieldlines.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Wire_fieldlines.svg",
      licence: "CC BY 3.0",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire original SVG and a high-quality raster input. Use it as the dedicated phenomenon reference rather than the hand mnemonic.",
    contractCorrections: ["Revise the old 'one direction-neutral base for both current directions' assumption. For direction-sensitive teaching/assessment, commission state-specific final imagery so the visible arrows/current marker are correct in the image itself."],
  },
  "unit202.right-hand-grip.teaching": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — Right-hand grip rule.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Right-hand_grip_rule.svg",
      licence: "Public domain",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire original SVG; pass it directly to Gemini.",
    contractCorrections: ["Keep required teaching labels in the final illustration; do not defer them to a later overlay."],
  },
  "unit202.motor.effect.horizontal-poles": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Wikimedia Commons — VFPt wire-in-homogenous-magnetic-field-with-magnets-and-lorentz-force.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:VFPt_wire-in-homogenous-magnetic-field-with-magnets-and-lorentz-force.svg",
      licence: "CC BY-SA 4.0",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    secondaryReference: {
      sourceName: "Wikimedia Commons -- VFPt wire-in-homogenous-magnetic-field-with-magnets.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:VFPt_wire-in-homogenous-magnetic-field-with-magnets.svg",
      licence: "CC BY-SA 4.0",
      qualityGrade: "A (Product Owner handover secondary -- same apparatus without the force arrow)",
    },
    referencePreparation: "Create an approved isolated reference sheet from the source: show only the magnet pair and conductor for the requested horizontal pole arrangement. For the vertical sibling, rotate the ENTIRE technical geometry together by 90°—magnets, N/S, current marker and force relationship—rather than rotating individual elements independently.",
    contractCorrections: ["Replace the old direction-neutral-base requirement with state-specific final imagery for teaching and assessment where current/force direction is visible."],
  },
  "unit202.motor.effect.vertical-poles": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Wikimedia Commons — VFPt wire-in-homogenous-magnetic-field-with-magnets-and-lorentz-force.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:VFPt_wire-in-homogenous-magnetic-field-with-magnets-and-lorentz-force.svg",
      licence: "CC BY-SA 4.0",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    secondaryReference: {
      sourceName: "Wikimedia Commons -- VFPt wire-in-homogenous-magnetic-field-with-magnets.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:VFPt_wire-in-homogenous-magnetic-field-with-magnets.svg",
      licence: "CC BY-SA 4.0",
      qualityGrade: "A (Product Owner handover secondary -- same apparatus without the force arrow)",
    },
    referencePreparation: "Create an approved isolated reference sheet from the source: show only the magnet pair and conductor for the requested vertical pole arrangement. For the vertical sibling, rotate the ENTIRE technical geometry together by 90°—magnets, N/S, current marker and force relationship—rather than rotating individual elements independently.",
    contractCorrections: ["Replace the old direction-neutral-base requirement with state-specific final imagery for teaching and assessment where current/force direction is visible."],
  },
  "unit202.fleming-left-hand.teaching": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — Fleming's Left Hand Rule.png",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Fleming%27s_Left_Hand_Rule.png",
      licence: "CC BY-SA 3.0 / GFDL as recorded on Commons",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire the actual image; use as geometry/semantic reference, not as style reference.",
    contractCorrections: ["Keep required mnemonic labels in the final artwork."],
  },
  "unit202.generator.rotating-loop.horizontal": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Wikimedia Commons — Elementary generator.svg (FAA, public domain)",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Elementary_generator.svg",
      licence: "U.S. Government work / public domain",
      qualityGrade: "A (CC-11.12 semantic-QA REDO: real visible reference replacing the prior DOE-PDF-only source, whose absence from the review pack -- 'reference preview not found' -- was itself the finding)",
    },
    secondaryReference: {
      sourceName: "U.S. DOE Fundamentals Handbook — Electrical Science, Volume 3 — AC Generators, Figure 1",
      sourceUrl: "https://www.energy.gov/sites/default/files/2026-04/DOE-HDBK-1011-92_VOL3.pdf",
      licence: "U.S. Government work / public-domain reference",
      qualityGrade: "Topology cross-check only, per unit202-revised-reference-strategy.md",
    },
    referencePreparation: "Elementary_generator.svg is used directly (already an unambiguous single-loop/two-slip-ring/two-brush topology with labelled parts) for the face-on pose. The DOE Figure 1 remains a cross-check only, never the sole composition authority.",
    contractCorrections: ["CC-11.12: replaced the prior reference (never actually visible in review) with a real, visible, unambiguous public-domain source. Immutable facts: ONE rectangular loop only, never two; two separate slip rings; two brushes; coherent output path; no split-ring commutator."],
  },
  "unit202.generator.rotating-loop.vertical": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Wikimedia Commons — Elementary generator.svg (FAA, public domain)",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Elementary_generator.svg",
      licence: "U.S. Government work / public domain",
      qualityGrade: "A (CC-11.12 semantic-QA REDO: same real reference as the horizontal sibling, rotated to the edge-on pose)",
    },
    secondaryReference: {
      sourceName: "U.S. DOE Fundamentals Handbook — Electrical Science, Volume 3 — AC Generators, Figure 1",
      sourceUrl: "https://www.energy.gov/sites/default/files/2026-04/DOE-HDBK-1011-92_VOL3.pdf",
      licence: "U.S. Government work / public-domain reference",
      qualityGrade: "Topology cross-check only, per unit202-revised-reference-strategy.md",
    },
    referencePreparation: "Same Elementary_generator.svg topology authority as the horizontal sibling, rotated to the edge-on/near-peak-EMF pose -- must visibly be the same one-loop/one-shaft/two-ring system, not a different apparatus.",
    contractCorrections: ["CC-11.12: replaced the prior reference with the same real, visible source as the horizontal sibling. Immutable facts: ONE rectangular loop only, never two; two separate slip rings; two brushes; coherent output path; no split-ring commutator; must read as the same physical rig as the horizontal sibling."],
  },
  "unit202.fleming-right-hand.teaching": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — Fleming's right hand rule.png",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Fleming%27s_right_hand_rule.png",
      licence: "Public-domain historical work",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire original historical figure; use only as geometry authority.",
    contractCorrections: ["Keep required mnemonic labels in final artwork."],
  },
  "unit202.levers.class-1": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Pearson Scott Foresman — Lever (PSF).svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Lever_(PSF).svg",
      licence: "Public domain",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Deterministically crop/isolate ONLY the TOP / Class I subfigure. Remove the other two lever classes before Gemini sees the reference.",
    contractCorrections: ["Reference status should become APPROVED_WITH_CROP after storing the per-class crop."],
  },
  "unit202.levers.class-2": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Pearson Scott Foresman — Lever (PSF).svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Lever_(PSF).svg",
      licence: "Public domain",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Deterministically crop/isolate ONLY the MIDDLE / Class II subfigure. Remove the other two lever classes before Gemini sees the reference.",
    contractCorrections: ["Reference status should become APPROVED_WITH_CROP after storing the per-class crop."],
  },
  "unit202.levers.class-3": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Pearson Scott Foresman — Lever (PSF).svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Lever_(PSF).svg",
      licence: "Public domain",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Deterministically crop/isolate ONLY the BOTTOM / Class III subfigure. Remove the other two lever classes before Gemini sees the reference.",
    contractCorrections: ["Reference status should become APPROVED_WITH_CROP after storing the per-class crop."],
  },
  "unit202.pulleys.fixed": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — Polea-simple 01.png",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Polea-simple_01.png",
      licence: "CC BY-SA 4.0",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire the full source; crop whitespace only if needed.",
    contractCorrections: ["Replace current Pulley1a.svg primary reference."],
  },
  "unit202.pulleys.movable": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Wikimedia Commons — Pulley1.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Pulley1.svg",
      licence: "Public domain",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire original SVG and isolate the simple movable-pulley diagram only. If the source includes force labels, preserve geometry but redraw labels to ALP wording.",
    contractCorrections: ["Replace current Pulley1a.svg primary reference."],
  },
  "unit202.magnet.field": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Wikimedia Commons — DipolMagnet.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:DipolMagnet.svg",
      licence: "Public-domain dedication",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire the original SVG. In the Gemini instruction, explicitly preserve the source's arrow-placement policy: do not invent arrowheads on cropped/incomplete field lines.",
    contractCorrections: ["The previous proof PASS is invalid. Mark it failed/rejected. N/S and correct field-direction arrows are required in the final image, not deferred."],
  },
  "unit202.magnet.poles.like": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — VFPt cylindrical magnets repelling.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:VFPt_cylindrical_magnets_repelling.svg",
      licence: "CC BY-SA 3.0 / GFDL",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire original SVG and use the two-magnet repulsion geometry.",
    contractCorrections: [],
  },
  "unit202.magnet.poles.unlike": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — VFPt cylindrical magnets attracting.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:VFPt_cylindrical_magnets_attracting.svg",
      licence: "CC BY-SA 3.0 / GFDL",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire original SVG and use the two-magnet attraction geometry.",
    contractCorrections: [],
  },
  "unit202.magnet.permanent-vs-electromagnet": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Wikimedia Commons — VFPt cylindrical tightly-wound coil-and-bar-magnet-comparison.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:VFPt_cylindrical_tightly-wound_coil-and-bar-magnet-comparison.svg",
      licence: "CC BY-SA 3.0 / GFDL",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    secondaryReference: {
      sourceName: "Wikimedia Commons -- Simple electromagnet2.gif",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Simple_electromagnet2.gif",
      licence: "Public domain",
      qualityGrade: "A (Product Owner handover secondary -- physical-topology cross-check)",
    },
    referencePreparation: "Build one approved side-by-side reference sheet: solid permanent magnet on one side; coil wound around ferromagnetic core with visible current source/path on the other. Use the comparison SVG for field analogy and Simple electromagnet2.gif for physical topology.",
    contractCorrections: ["Replace missing-reference placeholder with this two-source prepared reference sheet."],
  },
  "unit202.circuit.series": {
    researchDecision: "DETERMINISTIC_INTERNAL_AUTHORITY",
    primaryReference: {
      sourceName: "Wikimedia Commons — Battery symbols and circuit.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Battery_symbols_and_circuit.svg",
      licence: "recorded per source page",
      qualityGrade: "n/a (deterministic, internal authority)",
    },
    referencePreparation: "Keep the existing deterministic SVG/React-Native renderer as output authority. External diagram is cross-check only.",
    contractCorrections: ["No Gemini art generation for this asset."],
  },
  "unit202.circuit.parallel": {
    researchDecision: "DETERMINISTIC_INTERNAL_AUTHORITY",
    primaryReference: {
      sourceName: "Same circuit reference family as series (see unit202.circuit.series)",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Series_and_parallel_circuits2.svg",
      licence: "recorded per source page",
      qualityGrade: "n/a (deterministic, internal authority)",
    },
    referencePreparation: "Keep the existing deterministic SVG/React-Native renderer as output authority. External diagram is cross-check only.",
    contractCorrections: ["No Gemini art generation for this asset."],
  },
  "unit202.circuit.mixed": {
    researchDecision: "DETERMINISTIC_INTERNAL_AUTHORITY",
    primaryReference: {
      sourceName: "Wikimedia Commons — SeriesParallelCircuit.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:SeriesParallelCircuit.svg",
      licence: "use only as topology/reference, not a close stylistic derivative",
      qualityGrade: "n/a (deterministic, internal authority)",
    },
    referencePreparation: "Keep the existing deterministic SVG/React-Native renderer as output authority. External diagram is cross-check only.",
    contractCorrections: ["No Gemini art generation for this asset."],
  },
  "unit202.instrument.connections": {
    researchDecision: "DETERMINISTIC_INTERNAL_AUTHORITY",
    primaryReference: {
      sourceName: "Wikimedia Commons — SimpleCircuit.SVG",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:SimpleCircuit.SVG",
      licence: "recorded per source page",
      qualityGrade: "n/a (deterministic, internal authority)",
    },
    referencePreparation: "Keep the existing deterministic SVG/React-Native renderer as output authority. External diagram is cross-check only.",
    contractCorrections: ["No Gemini art generation for this asset."],
  },
  "unit202.instrument.clamp-meter": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — Clampmeter.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Clampmeter.jpg",
      licence: "CC BY-SA 3.0",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire the photo and crop to the instrument. Redraw without brand-specific markings.",
    contractCorrections: ["Replace missing-reference placeholder."],
  },
  "unit202.instrument.oscilloscope": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — Oscilloscope Clean.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Oscilloscope_Clean.svg",
      licence: "CC0 / public-domain dedication where recorded",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire SVG; use front-panel/screen layout as the recognition reference while simplifying controls.",
    contractCorrections: ["Replace missing-reference placeholder."],
  },
  "unit202.current-direction.electron-flow-vs-conventional": {
    researchDecision: "DETERMINISTIC_INTERNAL_AUTHORITY",
    primaryReference: {
      sourceName: "ALP governed current-direction diagram",
      sourceUrl: "internal://current-direction/electron-flow-vs-conventional",
      licence: "Internal governed geometry",
      qualityGrade: "n/a (deterministic, internal authority)",
    },
    referencePreparation: "Use the existing governed deterministic blueprint; no external pictorial reference is necessary.",
    contractCorrections: ["Change catalogue's empty external reference to INTERNAL_AUTHORITY rather than 'missing'."],
  },
  "unit202.gears.driven-larger": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — Two spur gears 1 2.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Two_spur_gears_1_2.svg",
      licence: "CC0",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire CC0 SVG. Treat the small gear as DRIVER and large gear as DRIVEN in the final labelled illustration.",
    contractCorrections: ["Replace compound gear-train reference."],
  },
  "unit202.gears.driven-smaller": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Wikimedia Commons — Two spur gears 1 2.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Two_spur_gears_1_2.svg",
      licence: "CC0",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Create an approved role-specific reference copy of the same 1:2 geometry with the LARGE gear explicitly designated DRIVER and SMALL gear DRIVEN. Do not mirror tooth geometry; role assignment changes, not geometry.",
    contractCorrections: ["Replace compound gear-train reference."],
  },
  "unit202.gears.equal": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — Two spur gears 1 1.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Two_spur_gears_1_1.svg",
      licence: "CC0",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire CC0 1:1 SVG.",
    contractCorrections: ["Replace compound gear-train reference."],
  },
  "unit202.gears.rotation-direction": {
    researchDecision: "DETERMINISTIC_INTERNAL_AUTHORITY",
    primaryReference: {
      sourceName: "Wikimedia Commons — Two spur gears 1 1.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Two_spur_gears_1_1.svg",
      licence: "CC0",
      qualityGrade: "n/a (deterministic, internal authority)",
    },
    referencePreparation: "Use CC0 two-gear geometry as cross-check; draw rotation arrows deterministically.",
    contractCorrections: [],
  },
  "unit202.resistivity.length-comparison": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Wikimedia Commons — Resistivity geometry-1.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Resistivity_geometry-1.svg",
      licence: "CC0",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Build an approved two-specimen reference sheet from the CC0 geometry. Keep material and cross-sectional area identical; vary ONLY length.",
    contractCorrections: ["Replace missing reference with prepared comparison sheet."],
  },
  "unit202.resistivity.area-comparison": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Wikimedia Commons — Resistivity geometry-1.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Resistivity_geometry-1.svg",
      licence: "CC0",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Build an approved two-specimen reference sheet from the CC0 geometry. Keep material and length identical; vary ONLY cross-sectional area.",
    contractCorrections: ["Replace missing reference with prepared comparison sheet."],
  },
  "unit202.waveform.sine": {
    researchDecision: "DETERMINISTIC_INTERNAL_AUTHORITY",
    primaryReference: {
      sourceName: "Wikimedia Commons — Sine wave 2.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Sine_wave_2.svg",
      licence: "Public-domain dedication",
      qualityGrade: "n/a (deterministic, internal authority)",
    },
    referencePreparation: "Retain current sine-wave reference as cross-check; output remains deterministic.",
    contractCorrections: [],
  },
  "unit202.emf.motional": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Wikimedia Commons — Faraday's law of induction.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Faraday%27s_law_of_induction.svg",
      licence: "CC0 / public-domain dedication where recorded",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire source and crop/isolate ONLY the motional-EMF panel. Simplify the prepared reference to the governed conductor/rails, B-field and motion geometry.",
    contractCorrections: ["Replace missing-reference placeholder."],
  },
  "unit202.components.symbols": {
    researchDecision: "DETERMINISTIC_INTERNAL_AUTHORITY",
    primaryReference: {
      sourceName: "IEC — IEC 60617 Graphical Symbols for Diagrams database",
      sourceUrl: "https://std.iec.ch/iec60617",
      licence: "Official standards database; subscription/reuse restrictions apply",
      qualityGrade: "n/a (deterministic, internal authority)",
    },
    referencePreparation: "Use IEC 60617 as standards authority and the existing ALP symbol renderer for production. Do not feed restricted IEC symbol artwork to Gemini.",
    contractCorrections: ["Catalogue should explicitly record IEC 60617 as standards authority, not a generative reference."],
  },
  "unit202.components.physical.resistor": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — 4-Band Resistor.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:4-Band_Resistor.svg",
      licence: "Public domain",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire the actual source image/vector; isolate one representative component package and remove branding/background clutter before generation.",
    contractCorrections: ["Replace missing-reference placeholder."],
  },
  "unit202.components.physical.capacitor": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — Electrolytic Capacitor, Radial, 16x30 (Coloured).svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Electrolytic_Capacitor,_Radial,_16x30_(Coloured).svg",
      licence: "Public domain",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire the actual source image/vector; isolate one representative component package and remove branding/background clutter before generation.",
    contractCorrections: ["Replace missing-reference placeholder."],
  },
  "unit202.components.physical.diode": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — DO-41 (shaded).svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:DO-41_(shaded).svg",
      licence: "Public domain",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire the actual source image/vector; isolate one representative component package and remove branding/background clutter before generation.",
    contractCorrections: ["Replace missing-reference placeholder."],
  },
  "unit202.components.physical.led": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — LED, 5mm, clear (unlabelled, full).svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:LED,_5mm,_clear_(unlabelled,_full).svg",
      licence: "Public domain",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire the actual source image/vector; isolate one representative component package and remove branding/background clutter before generation.",
    contractCorrections: ["Replace missing-reference placeholder."],
  },
  "unit202.components.physical.thermistor": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — NTC Thermistor.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:NTC_Thermistor.jpg",
      licence: "CC BY-SA 4.0",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire the actual source image/vector; isolate one representative component package and remove branding/background clutter before generation.",
    contractCorrections: ["Replace missing-reference placeholder."],
  },
  "unit202.components.physical.transistor": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — TO-92, BC548 (front, shaded).svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:TO-92,_BC548_(front,_shaded).svg",
      licence: "Public domain",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire the actual source image/vector; isolate one representative component package and remove branding/background clutter before generation.",
    contractCorrections: ["Replace missing-reference placeholder."],
  },
  "unit202.diode.bias-direction.forward": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Wikimedia Commons — Forward-Biased pn Junction.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Forward-Biased_pn_Junction.svg",
      licence: "Public domain",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Use the source only to verify forward-bias polarity. Build a simplified Level-2 reference sheet showing a diode, source polarity, and conventional current flowing; omit semiconductor depletion-zone detail.",
    contractCorrections: ["Replace missing reference; require final semantic labels/current arrow in the image."],
  },
  "unit202.diode.bias-direction.reverse": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Wikimedia Commons — Reverse-Biased pn Junction Bands.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Reverse-Biased_pn_Junction_Bands.svg",
      licence: "Public domain",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Use the source only to verify reverse-bias polarity. Build a simplified Level-2 reference sheet showing a diode, source polarity, and blocked-current indication; omit semiconductor band/depletion detail.",
    contractCorrections: ["Replace missing reference; require final semantic labels/blocked-current indication in the image."],
  },
  "unit202.rectification.waveforms": {
    researchDecision: "CONTRACT_CORRECTION_REQUIRED",
    primaryReference: {
      sourceName: "Wikimedia Commons — Rectification.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Rectification.svg",
      licence: "Public domain",
      qualityGrade: "A (Product Owner handover, contract correction applied)",
    },
    secondaryReference: {
      sourceName: "Wikimedia Commons -- Ausgangsspanung Trapezwechselrichter.JPG",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Ausgangsspanung_Trapezwechselrichter.JPG",
      licence: "Openly licensed -- verify exact Commons licence at acquisition",
      qualityGrade: "B (Product Owner handover secondary -- example switched inverter output, do not generalise)",
    },
    referencePreparation: "Use Rectification.svg for half/full-wave cross-check and an inverter switched-output reference only for the governed inverter state. Continue rendering all waveforms deterministically.",
    contractCorrections: ["Replace 'never a smooth sine wave for any of the three' with state-specific wording: for this governed inverter waveform state, draw the specified switched/square/modified waveform; do not imply all inverter outputs are non-sinusoidal."],
  },
  "unit202.capacitor.transient": {
    researchDecision: "DETERMINISTIC_INTERNAL_AUTHORITY",
    primaryReference: {
      sourceName: "ALP governed RC charge/discharge equations and curve renderer",
      sourceUrl: "internal://capacitor-transient/rc-exponential",
      licence: "Internal governed geometry",
      qualityGrade: "n/a (deterministic, internal authority)",
    },
    referencePreparation: "Generate the exponential charge/discharge curves from governed RC relationships; no pictorial reference is needed.",
    contractCorrections: ["Replace placeholder external-reference wording with internal mathematical authority."],
  },
  "unit202.components.physical.zener-diode": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — 1N829 Zener Diode.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:1N829_Zener_Diode.jpg",
      licence: "CC BY-SA 4.0",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire the actual source image/vector; isolate one representative component package and remove branding/background clutter before generation.",
    contractCorrections: ["Replace missing-reference placeholder."],
  },
  "unit202.components.physical.photodiode": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — Photodiode-closeup.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Photodiode-closeup.jpg",
      licence: "CC BY-SA 2.5",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire the actual source image/vector; isolate one representative component package and remove branding/background clutter before generation.",
    contractCorrections: ["Replace missing-reference placeholder."],
  },
  "unit202.components.physical.diac": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — Diac 01.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Diac_01.jpg",
      licence: "CC BY-SA 4.0",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire the actual source image/vector; isolate one representative component package and remove branding/background clutter before generation.",
    contractCorrections: ["Replace missing-reference placeholder."],
  },
  "unit202.components.physical.triac": {
    researchDecision: "APPROVED_PRODUCTION_REFERENCE",
    primaryReference: {
      sourceName: "Wikimedia Commons — TRIAC Image.png",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:TRIAC_Image.png",
      licence: "CC BY-SA 4.0",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire the actual source image/vector; isolate one representative component package and remove branding/background clutter before generation.",
    contractCorrections: ["Replace missing-reference placeholder."],
  },
  "unit202.components.physical.thyristor-scr": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Wikimedia Commons — Thyristors thyristoren.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Thyristors_thyristoren.jpg",
      licence: "CC BY-SA 3.0",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire the source photo and crop ONLY the small TO-220-style thyristor/SCR; exclude the larger modules before Gemini receives it.",
    contractCorrections: ["Replace missing-reference placeholder."],
  },
  "unit202.electrolysis": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Wikimedia Commons — Elektrolyse Allgemein.svg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Elektrolyse_Allgemein.svg",
      licence: "CC0",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    referencePreparation: "Acquire the CC0 source and simplify/crop it to the governed source–electrolyte–electrode circuit. Remove chemistry detail outside Unit 202.",
    contractCorrections: ["Require final labelled artwork; explicitly prohibit an invented wire path directly joining the electrodes."],
  },
  "unit202.heating-effect": {
    researchDecision: "CONTRACT_CORRECTION_REQUIRED",
    primaryReference: {
      sourceName: "Wikimedia Commons — 30kw resistance heating coil.JPG",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:30kw_resistance_heating_coil.JPG",
      licence: "CC BY-SA 3.0",
      qualityGrade: "A (Product Owner handover, contract correction applied)",
    },
    referencePreparation: "Acquire the actual heating-coil photo and use it as physical-context reference. Redraw a generic resistive element on white/light background.",
    contractCorrections: ["Add immutable facts: resistive element carries current and dissipates electrical energy as heat; no flame/combustion; do not imply all conductors visibly glow. Remove 'do not generate until primary reference READY' placeholder."],
  },
  "unit202.conductor-insulator": {
    researchDecision: "CONTRACT_CORRECTION_REQUIRED",
    primaryReference: {
      sourceName: "Wikimedia Commons — Stranded lamp wire.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Stranded_lamp_wire.jpg",
      licence: "Public domain",
      qualityGrade: "A (Product Owner handover, contract correction applied)",
    },
    referencePreparation: "Acquire the public-domain cable photo. Use the exposed copper strands and insulating sheath as the geometry reference; redraw cleanly on white/light background.",
    contractCorrections: ["Add immutable facts for conductive core and insulating sheath; remove reference-block placeholder."],
  },
  "unit202.protective-devices": {
    researchDecision: "APPROVED_WITH_PREPARATION",
    primaryReference: {
      sourceName: "Wikimedia Commons — 10A ceramic 6x32 fuse.JPG",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:10A_ceramic_6x32_fuse.JPG",
      licence: "CC BY-SA 3.0",
      qualityGrade: "A (Product Owner-approved reference handover, 2026-08-24)",
    },
    secondaryReference: {
      sourceName: "Wikimedia Commons -- MCB Circuit breakers for DIN rail.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:MCB_Circuit_breakers_for_DIN_rail.jpg",
      licence: "CC BY-SA 4.0",
      qualityGrade: "A (Product Owner handover secondary -- representative DIN-rail breaker)",
    },
    referencePreparation: "Build one approved side-by-side reference sheet from a single generic cartridge fuse and a single generic DIN-rail circuit breaker selected/cropped from the two sources. Remove logos/brand-specific markings before Gemini.",
    contractCorrections: ["Replace missing-reference placeholder."],
  },
  "unit202.trigonometry": {
    researchDecision: "DETERMINISTIC_INTERNAL_AUTHORITY",
    primaryReference: {
      sourceName: "ALP governed right-triangle/SOHCAHTOA geometry",
      sourceUrl: "internal://trigonometry/right-triangle",
      licence: "Internal governed geometry",
      qualityGrade: "n/a (deterministic, internal authority)",
    },
    referencePreparation: "If/when scope is activated, construct the triangle deterministically from geometry; no external image is required.",
    contractCorrections: ["Change placeholder reference to internal mathematical authority; retain DEFERRED_SCOPE until curriculum integration decision."],
  },
};

export function effectivePrimaryReference(asset: VisualAsset): CatalogueReference {
  return REFERENCE_CORRECTIONS[asset.assetId]?.primaryReference ?? asset.primaryReference;
}

export function effectiveSecondaryReference(asset: VisualAsset): CatalogueReference | undefined {
  return REFERENCE_CORRECTIONS[asset.assetId]?.secondaryReference ?? asset.secondaryReference;
}

/** Every asset in the handover resolved to a real reference or an internal-authority pathway, so every corrected asset is READY. */
export function effectiveReferenceReadiness(asset: VisualAsset): ReferenceReadiness {
  return REFERENCE_CORRECTIONS[asset.assetId] ? "READY" : asset.referenceReadiness;
}

export function referencePreparationFor(asset: VisualAsset): string | undefined {
  return REFERENCE_CORRECTIONS[asset.assetId]?.referencePreparation;
}

