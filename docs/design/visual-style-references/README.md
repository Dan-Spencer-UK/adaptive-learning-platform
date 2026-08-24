# ALP visual style-reference assets

Approved canonical style-reference images for generated instructional artwork -- registered here once approved, never invented or auto-generated speculatively.

**Current inventory: none.** No style-reference master has been approved yet. The production pipeline (see `docs/architecture/PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md` and `docs/design/ALP-INSTRUCTIONAL-VISUAL-STYLE-GUIDE.md`) runs correctly with zero style-reference images -- the text style guide alone is supplied to the generative model. A style-reference image, when approved, is an *additional* input on top of the text guide, never a replacement for it.

## What belongs here

A style-reference image shows **how ALP artwork should look** -- rendering language, material treatment, lighting, background execution -- as opposed to a technical reference image, which shows **what a specific asset must depict** (see the style guide §5). A style-reference image is typically:

- an already-approved, Product-Owner-sighed-off piece of ALP generated artwork chosen as the exemplar for future generation jobs to match, or
- a deliberately commissioned single style-board image whose sole purpose is establishing the look, not teaching any specific concept.

## Registration process

1. The Product Owner approves a specific image as the canonical style exemplar (via the same review process as any other generated asset -- see the Visual Production Studio / the pre-production review pack).
2. Copy the approved file into this directory using a descriptive, stable filename (e.g. `alp-style-master-v1.png`).
3. Add an entry to `manifest.json` in this directory (create it if this is the first entry) recording: `filename`, `approvedAt`, `sourceAssetId` (if it was promoted from a real production asset), `sha256`, and a one-line note on why it was chosen as exemplar.
4. Reference the file's relative path from the relevant production job when supplying a style-reference image to the generative model.

## What does not belong here

- Unapproved generation candidates (those live under `reports/instructional-visuals/premium-artwork/...`, per the existing Studio manifest/provenance convention).
- Third-party mood-board or inspiration images with no clear licence for redistribution inside this repository.
- A large speculative style board assembled without a specific approval. This directory intentionally starts empty rather than guessing.
