# Unit 202 — Visual Debt Register (CC-11.13)

Generated: 2026-08-26T02:18:05.006Z

Concise triage register of KNOWN, INDIVIDUALLY-IDENTIFIED visual debt only -- not a full 98-state inventory (see `unit202-final-state-completeness.md` for that). Assets with no entry here carry no individually-identified defect, but see the suite-level status immediately below: they are NOT thereby claimed visually finished.

## UNIT202_GENERATIVE_SUITE — GLOBAL_POLISH_PENDING

Applies to: Every CC-11.9-CC-11.12 generative learner-visible output not individually listed in ASSET_LIFECYCLE above (45 of 51).

- NOT a blocker for ongoing product development -- these assets remain development-usable now.
- NOT Product Owner final visual approval -- no asset in this suite has that yet, regardless of polish state.
- A controlled polish pass (sharpening/crispness, line quality, consistent label treatment, family consistency, removal of generative softness, final ALP style normalisation) is recorded as needed, to be addressed only AFTER the BLOCKING_CORRECTNESS items in ASSET_LIFECYCLE are closed -- never before, and never as a substitute for closing them.

Recorded 2026-08-26 (CC-11.13A), correcting CC-11.13's implication that the 46 outputs with no individually-recorded debt were therefore visually finished. They are not claimed finished -- they are claimed correct and development-usable, with suite-wide polish intentionally deferred as a class, not asset-by-asset.

Of the 51 generative learner-visible outputs produced through CC-11.12, 6 carry an individually-identified debt finding below; the remaining 45 fall under the suite-level GLOBAL_POLISH_PENDING status above rather than being padded into per-asset entries here.

## BLOCKING_CORRECTNESS (0)

Wrong / misleading / technically unsafe for teaching -- **not development-usable as a correct teaching asset** until fixed.

## DEVELOPMENT_USABLE_POLISH_PENDING (4)

Correct enough to continue product development now; visually below the desired finish.

### `unit202.right-hand-grip.teaching` — Right-hand grip rule — teaching mnemonic
- Lifecycle gate: POLISH_PENDING
- Production mode: HYBRID_REDRAW_PLUS_DETERMINISTIC_OVERLAY
- Development-usable: yes
- CC-11.14: TECHNICAL_MASTER_APPROVED and PEDAGOGICAL_MASTER_APPROVED now both genuinely earned (master v4, audit v4, all three verdicts PASS). v3 = Gemini self-referential cleanup removing both defective field arrows (v2's two-arrowhead crescent and detached wrist arrow) while pixel-preserving the hand/thumb/conductor/labels; v4 = v3 plus a DETERMINISTIC (non-Gemini-generated) wrap-around field-circulation ellipse, geometry derived by rigidly rotating the Product-Owner-approved reference's own loop path to a vertical current direction -- provably correct by construction, independently cross-checked against the visible finger curl. See unit202.right-hand-grip.teaching-audit-v4.json for the full §10 special-verification checklist. Minor noted finish item (the new arrow lacks the rod's copper gradient/shading) deferred to the suite polish pass, not blocking.

### `unit202.emf.motional` — Motional EMF geometry
- Lifecycle gate: POLISH_PENDING
- Production mode: ORIGINAL_REDRAW_FROM_REFERENCE
- Development-usable: yes
- CC-11.14: TECHNICAL_MASTER_APPROVED and PEDAGOGICAL_MASTER_APPROVED now both genuinely earned (master v3, audit v3, all three verdicts PASS). Generated directly from a hand-authored prepared board with l already drawn vertically, along the active conductor, before Gemini saw it -- l/v/B are now mutually perpendicular (l vertical along the conductor, v horizontal, B into the page), correcting the CC-11.13A-identified wrong-dimension defect. See unit202.emf.motional-audit-v3.json for the full §11 special-verification checklist.

### `unit202.levers.class-3` — Lever — Class III
- Lifecycle gate: POLISH_PENDING
- Production mode: ORIGINAL_REDRAW_FROM_REFERENCE
- Development-usable: yes
- CC-11.14: TECHNICAL_MASTER_APPROVED and PEDAGOGICAL_MASTER_APPROVED now both genuinely earned (master v4, audit v4, all three verdicts PASS). Generated directly from a hand-authored prepared board (the approved reference's own composition with RESISTANCE and MOTION removed and the resistance glyph relabelled LOAD) as a clean, flat, original ALP redraw -- exactly FULCRUM/EFFORT/LOAD, no 3D beam, no decorative contamination, EFFORT verified strictly between FULCRUM and LOAD. See unit202.levers.class-3-audit-v4.json for the full §12 special-verification checklist. Noted, out-of-scope-for-this-package cross-asset style difference: Class I/II remain the pre-CC-11.13 soft-3D metallic-beam style, not revisited here.

### `unit202.electrolysis` — Chemical effect / electrolysis
- Lifecycle gate: POLISHED
- Production mode: ORIGINAL_REDRAW_FROM_REFERENCE
- Development-usable: yes
- Ion-arrow defect fixed and independently re-verified pixel-by-pixel (CC-11.12) -- technically and pedagogically correct. Listed here only for one real, specific, already-noted cosmetic finish gap: the 'current path' label renders twice (duplicated) in the current master. Not blocking; a targeted polish item, not a re-audit.

## DEFERRED_SCOPE (2)

Not worth further Unit 202 time right now.

### `unit202.components.physical.resistor` — Physical electronic component — resistor
- Lifecycle gate: PEDAGOGICAL_MASTER_APPROVED
- Production mode: ORIGINAL_REDRAW_FROM_REFERENCE
- Development-usable: yes
- Physical form strong; deterministic colour-band role labels (1st/2nd band, multiplier, tolerance) remain a real but not urgent gap -- CC-11.12's own KEEP_WITH_ANNOTATION finding, not yet wired to a deterministic overlay. See the corrected component-family rule (production-mode.ts, PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md's component-family note).

### `unit202.components.physical.capacitor` — Physical electronic component — capacitor
- Lifecycle gate: PEDAGOGICAL_MASTER_APPROVED
- Production mode: ORIGINAL_REDRAW_FROM_REFERENCE
- Development-usable: yes
- CC-11.13A correction: CC-11.12 removed this asset's baked UK/IEC symbol to achieve family consistency with the other components.physical.* assets, which had no symbol. That was NOT the desired product decision -- the intended long-term teaching grammar is PHYSICAL COMPONENT RECOGNITION IMAGE + DETERMINISTIC UK/IEC SYMBOL COMPANION, for every component, capacitor included. The correct direction was to give the OTHER component states a deterministic symbol companion, not to remove the capacitor's. Do not regenerate or modify this image now -- Unit 202 component-family cleanup (giving every components.physical.* asset a deterministic symbol companion, capacitor's included, and not as a baked-in raster element) remains explicitly deferred; recorded here so a future course-production package implements the correct rule from the start.
