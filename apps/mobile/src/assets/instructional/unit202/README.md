# Unit 202 premium instructional artwork

Approved premium/hybrid instructional artwork, produced and approved via
the ALP Visual Production Studio (`npm run visuals:studio`, see
`tools/visual-production-studio/README.md`). Governed by
[`docs/architecture/PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md`](../../../../../../docs/architecture/PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md)
and [`ADR-0004`](../../../../../../docs/architecture/adr/ADR-0004-deterministic-authority-over-generated-instructional-imagery.md).

This is a separate, additional/replacement presentation layer -- it does
**not** replace the existing deterministic SVG diagram renderers under
`apps/mobile/src/components/diagrams/` (governed by CC-05D). An approved
image here is not automatically wired into a lesson; that remains a
separate, deliberate step outside the Studio's own scope.

Every file's provenance (reference source, licence, immutable technical
facts, approval date, version, SHA-256 hash) is recorded in the
append-only, never-mutated manifest at
`reports/instructional-visuals/premium-artwork/unit202-artwork-manifest.json`.
A file's presence here without a corresponding manifest record should
never be trusted as approved.

## Subfolders

- `teaching/` -- hand-rule and other premium mnemonics that are TEACHING-ONLY (never shown in assessment mode).
- `conceptual/` -- premium conceptual illustrations where exact technical geometry is not itself the assessed fact.
- `hybrid/` -- a premium illustrated physical/context layer intended to carry a deterministic technical overlay on top.
- `physical-components/` -- physical-appearance companion images for governed electronic components (paired with their deterministic UK/IEC symbol cards).
- `deterministic-polish/` -- style/contrast reference material for visual families whose actual production geometry remains 100% deterministic (circuits, waveforms, schematic symbols, instrument connections) -- tracked for QA, not a replacement for the governed SVG renderer.
