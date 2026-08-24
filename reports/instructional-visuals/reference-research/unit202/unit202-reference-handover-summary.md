# Unit 202 — Reference Handover Summary

Prepared: 2026-08-24

## Coverage
- Catalogue assets covered: **53 / 53**
- Underlying canonical learner-visible states in source catalogue: **98**
- REQUIRED: **42**
- USEFUL: **10**
- DEFERRED_SCOPE: **1**

## Research decisions
- APPROVED_PRODUCTION_REFERENCE: **21**
- APPROVED_WITH_PREPARATION: **19**
- CONTRACT_CORRECTION_REQUIRED: **3**
- DETERMINISTIC_INTERNAL_AUTHORITY: **10**

## Reference input policies
- CROP_SOURCE_IMAGE: **9**
- DERIVED_TRANSFORM_REFERENCE: **1**
- DETERMINISTIC_NO_GEMINI: **11**
- DIRECT_SOURCE_IMAGE: **24**
- INTERNAL_REFERENCE_SHEET: **6**
- MULTI_REFERENCE_SHEET: **2**

## Critical corrections before bulk generation
- Replace the dark/slate style default with **white / near-white** in the canonical style guide and every production prompt builder.
- Mark the prior `unit202.magnet.field` Gemini proof as **rejected**: N/S labels are required and the generated partial-field-line arrowheads were wrong.
- Stop treating all direction-sensitive assets as one direction-neutral raster base. Use state-specific generation where the visible technical state itself changes.
- Generator contracts must explicitly lock complete coil/shaft/slip-ring/brush/output topology.
- Lever references must be cropped per class before generation.
- Replace the existing compound pulley reference with separate fixed- and movable-pulley references.
- Add missing immutable technical facts to heating-effect and conductor/insulator contracts.
- Correct the overbroad inverter-waveform statement.
- Explicitly prohibit invented electrode-to-electrode shorting in electrolysis.
- Treat IEC 60617 as standards authority for symbols, not a generative image source.

## Implementation rule
No asset is blocked merely because it lacks a previous pictorial URL. Each asset now has one of:
1. an approved external production reference,
2. an approved source that must be cropped/converted into an internal reference sheet,
3. a multi-reference sheet recipe,
4. or an explicit deterministic/internal authority pathway.

Claude Code should ingest this handover, acquire the actual source files, build any specified crops/reference sheets, update the governed catalogue/contracts/style guide, and only then begin automated Gemini production.
