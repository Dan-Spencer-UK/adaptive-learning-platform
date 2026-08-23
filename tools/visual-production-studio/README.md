# ALP Visual Production Studio

**CC-11.5–CC-11.7B.** A local, localhost-only development tool for
producing and approving premium instructional artwork. **Not
learner-facing product functionality** -- never imported by
`apps/mobile` or `apps/web`, never part of the learner runtime.

The production catalogue is organised by a three-level hierarchy:

```text
VISUAL FAMILY -> PRODUCTION/BASE ASSET -> CANONICAL LEARNER-VISIBLE STATE
```

A VisualFamily is the complete governed set of assets needed to teach one
concept (a single asset for most families; several for a phenomenon plus
its mnemonic, or genuinely distinct configurations). A production/base
asset may itself support several canonical states (e.g. one illustrated
base carrying both a TEACHING and an ASSESSMENT presentation, or all 8
pole/current combinations an existing deterministic overlay system
already governs) -- states are never collapsed merely because they share
a base. **Neither level ever reduces prompt granularity**: every
individual asset, even one nested inside a multi-asset family, gets its
own fully independent, individually copyable ASSET-SPECIFIC PROMPT that
enumerates every state it must safely support. See
[`docs/architecture/PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md`](../../docs/architecture/PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md)
§14/§15/§17 for the full architecture, and
[`reports/instructional-visuals/unit202-comprehensive-visual-audit.md`](../../reports/instructional-visuals/unit202-comprehensive-visual-audit.md)
for the full-corpus audit this catalogue is derived from.

The Studio is the **complete** Unit 202 visual production queue, not only
the minimum-REQUIRED one: every REQUIRED asset and every USEFUL
(optional-enrichment) finding from the CC-11.7 audit has a live catalogue
presence, tracked in fully independent REQUIRED/USEFUL dashboard buckets
so optional work can never make REQUIRED completeness look incomplete (or
vice versa) -- see
[`unit202-comprehensive-visual-audit.md`](../../reports/instructional-visuals/unit202-comprehensive-visual-audit.md)
§7 for the CC-11.7A materialisation pass and §8 for the CC-11.7B final
shared-base validation.

Before any artwork is generated, review
[`reports/instructional-visuals/unit202-final-visual-production-review.pdf`](../../reports/instructional-visuals/unit202-final-visual-production-review.pdf)
(regenerate with `npm run visuals:studio:final-review`) -- the Product
Owner's pre-production review pack, self-contained and uploadable to an
independent reviewer without opening this repository.

This is the manual-assisted production implementation of the approved
reference-first pipeline recorded in
[`docs/architecture/PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md`](../../docs/architecture/PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md)
and [`ADR-0004`](../../docs/architecture/adr/ADR-0004-deterministic-authority-over-generated-instructional-imagery.md).
It does not call any image-generation API itself -- the Product Owner
manually runs a separate ChatGPT browser session as the actual art
producer; this tool removes the orchestration burden around that session
(prompts, filenames, directories, provenance records).

## Launch

```
npm run visuals:studio
```

Starts a local HTTP server bound to `127.0.0.1` only (never reachable
from another machine) and opens `http://127.0.0.1:4756/` in your default
browser. Set `STUDIO_PORT` to use a different port, or `STUDIO_NO_OPEN=1`
to skip the automatic browser launch.

## Workflow

1. Start the Studio (`npm run visuals:studio`).
2. Click **COPY MASTER PROMPT** and paste it as the first message in a
   new ChatGPT conversation (or click **OPEN CHATGPT** to open a fresh tab).
   This establishes the session's standing art-direction rules once, for
   the whole session -- it is never repeated per asset.
3. Use the **NEXT RECOMMENDED ASSET** panel (or browse the family-grouped,
   filtered catalogue -- each family is a collapsible section, with every
   individual asset inside it fully visible and independently actionable)
   to pick the next visual to produce. Click **COPY PROMPT** (or the
   next-asset shortcut, keyboard `N`) to copy that *specific asset's*
   full, deterministically-generated ASSET-SPECIFIC PROMPT. If several
   assets belong to the same family (e.g. a pulley family's fixed and
   movable configurations), each still gets its own separate prompt --
   copy and produce them one at a time, never edit one asset's prompt
   into another's.
4. Paste the prompt into the ChatGPT session. Review the authoritative
   reference shown on the asset's card (**OPEN REFERENCE**) alongside
   what ChatGPT produces.
5. Iterate in ChatGPT (edit/revise, per the master prompt's own
   instruction to prefer editing over regenerating once close) until the
   image is genuinely correct -- inspect the actual geometry yourself,
   never accept a caption's claim of correctness (see the CRITICAL RULE
   included in every generated prompt).
6. Copy the final approved image from ChatGPT.
7. Click into the asset's paste zone in the Studio and press `Ctrl+V`
   (or drag-and-drop the image, or use the file picker). The Studio
   previews it and reports detected dimensions/format/size/transparency.
8. Click **APPROVE + SAVE**. The Studio validates the destination path
   against the governed asset root, computes a SHA-256 hash, writes the
   file under its deterministic versioned filename, and appends a
   provenance record to the manifest. If a version already exists for
   this asset, you are asked to CANCEL / SAVE AS NEW VERSION / REPLACE
   WITH EXPLICIT CONFIRMATION -- nothing is silently overwritten.
9. Repeat from step 3.

Use **MARK NEEDS REVIEW** (with an optional note) for a candidate you
want to flag rather than approve immediately. Use **EXPORT REVIEW
CONTACT SHEET** at any point to generate a single local HTML page
showing every currently-approved asset for whole-family review.

## Architecture

Zero new npm dependencies -- a plain `node:http` server plus a static,
unbundled HTML/CSS/JS page (`public/`), per the task brief's own
"choose the simplest architecture" guidance.

- `catalogue.ts` -- the structured Unit 202 production catalogue: 21
  `VisualFamily` entries containing 53 `VisualAsset` (production/base
  asset) entries (42 REQUIRED -- 39 ready, 3 blocked; 10
  USEFUL/optional-enrichment via `needOverride: "USEFUL"` -- 2 ready, 8
  blocked), each carrying one or more `CanonicalState` (canonical
  learner-visible state) entries -- 98 states in total. The single source
  of truth every prompt is built from. Exposes `FAMILIES`, `allAssets()`,
  `findAsset()`, `findFamily()`, `familyForAsset()`, `isPromptable()`,
  `promptableAssets()`, `visualNeedClassificationFor()` (pedagogical need
  only -- REQUIRED/USEFUL/DEFERRED_SCOPE/NOT_NEEDED), `isReferenceBlocked()`
  (production readiness, a fully independent dimension since CC-11.7B),
  and `validateCatalogue()` -- the latter also enforces "one art prompt
  per distinct image job": a `PHYSICAL_RECOGNITION`-role asset (one
  specific physical component/instrument) may never carry more than one
  `CanonicalState`. Also exports `reconciledVariantId()`, which
  reproduces the real CC-05D `stableVariantId` algorithm so every
  `CanonicalState.existingCanonicalVariantId` is computed from real
  inputs, never hand-transcribed, and `sharedBaseAudit` (CC-11.7B) on
  every multi-state asset, recording whether its proposed image sharing
  is `SAFE_SHARED_BASE`, `SHARED_BASE_WITH_CONDITIONS`, or was found
  `SEPARATE_ARTWORK_REQUIRED` and split.
- `audit.ts` -- the comprehensive catalogue's own completeness gate
  (`npm run visuals:studio:audit`). Fails if any of the 66 pre-existing
  CC-05D canonical variants is no longer reconciled by any state, any of
  the 10 CC-11.7 USEFUL findings (`EXPECTED_USEFUL_FINDING_ASSET_IDS`) is
  missing from the live catalogue, a premium/hybrid asset has no working
  prompt or no reference/blocked status, a canonical state has no
  pedagogical state, an ASSESSMENT state leaks a known answer-bearing
  mnemonic dependency, any structural rule from `validateCatalogue()` is
  violated (incl. a multi-state asset with no `sharedBaseAudit` decision,
  or a `SEPARATE_ARTWORK_REQUIRED` decision that was never actually
  applied as a traceable split), a REQUIRED-but-blocked asset is excluded
  from the REQUIRED total, or any id is duplicated.
- `generate-final-review.ts` -- the Product Owner's pre-production review
  pack (`npm run visuals:studio:final-review`), generating
  `reports/instructional-visuals/unit202-final-visual-production-review.{pdf,json}`
  directly from the live catalogue/dashboard/audit data via Playwright
  chromium (the same PDF-rendering approach `scripts/visual-governance/generate-review-package.ts`
  already uses -- zero new dependencies). Embeds real deterministic SVG
  previews where governed renders already exist; shows an honest "ARTWORK
  NOT YET PRODUCED" placeholder everywhere else -- never a fabricated
  mockup.
- `dashboard.ts` -- computes the Studio's dashboard counts (families /
  production assets / canonical states / REQUIRED total-ready-blocked /
  USEFUL total-ready-blocked / deterministic-only / REQUIRED art jobs /
  USEFUL art jobs (each further split ready/blocked/approved) /
  DEFERRED_SCOPE / SUPERSEDED, plus a `requiredVisualProductionComplete`
  boolean) mechanically from live catalogue + status data -- pedagogical
  need (REQUIRED/USEFUL) and production readiness (ready/blocked) are two
  fully independent dimensions throughout (CC-11.7B correction), never a
  single misleading total.
- `generate-matrix.ts` -- generates the machine-readable comprehensive
  visual-coverage matrix (`npm run visuals:studio:matrix`,
  `reports/instructional-visuals/unit202-visual-coverage-matrix.json`).
- `master-prompt.ts` -- the permanent "start a new art session" prompt
  (PROMPT 1, used once per session).
- `prompt-builder.ts` -- deterministically builds each individual
  asset's exact copyable ASSET-SPECIFIC PROMPT (PROMPT 2, used once per
  asset -- never once per family) from its catalogue entry plus its
  containing family's context, including an explicit per-asset
  annotation instruction (REQUIRED / PERMITTED-non-revealing / OMIT)
  derived from that asset's `annotationPolicy`.
- `paths.ts` -- the safe local-save boundary. Every filesystem write
  goes through here; nothing else is permitted to turn client input into
  a real path.
- `image-utils.ts` -- dependency-free PNG/WEBP/JPEG format/dimension/
  alpha sniffing, SHA-256 hashing, and version-filename computation.
- `state-store.ts` -- local JSON status persistence
  (`data/studio-state.json`, gitignored -- ephemeral WIP, not governed
  content) and the append-only approval manifest
  (`reports/instructional-visuals/premium-artwork/unit202-artwork-manifest.json`,
  committed -- the real governed provenance record, now recording both
  the owning `visualFamilyId` and, where one exists, the related
  `governedDiagramBlueprintId` from the CC-05D deterministic pipeline).
- `approval.ts` -- the APPROVE + SAVE orchestration: existing-file
  protection, versioning, hashing, manifest append.
- `next-asset.ts` -- the NEXT RECOMMENDED ASSET ranking (priority ->
  reference readiness -> status), family-aware in the sense that
  matters: a blocked/not-ready sibling in the same family never prevents
  an otherwise-actionable co-member from being recommended.
- `contact-sheet.ts` -- the EXPORT REVIEW CONTACT SHEET HTML generator,
  grouping approved assets by family and showing them in family order.
- `server.ts` -- wires the above into a local-only HTTP API and serves
  `public/index.html` / `studio.css` / `studio.js` (the client renders
  the family-grouped catalogue as collapsible sections, each containing
  its own fully independent per-asset cards).

## Governed output locations

- Approved artwork: `apps/mobile/src/assets/instructional/unit202/{teaching,conceptual,hybrid,physical-components,deterministic-polish}/`
- Provenance manifest: `reports/instructional-visuals/premium-artwork/unit202-artwork-manifest.json`
- Review contact sheet (generated on demand): `reports/instructional-visuals/premium-artwork/contact-sheet.html`
- Comprehensive coverage matrix: `reports/instructional-visuals/unit202-visual-coverage-matrix.json`
- Pre-production review pack (generate with `npm run visuals:studio:final-review`): `reports/instructional-visuals/unit202-final-visual-production-review.{pdf,json}`

## Safety

- Binds to `127.0.0.1` only.
- Every save path is validated against `APPROVED_ASSET_ROOT` before any
  write -- a catalogue entry (or a malformed request) can never construct
  an arbitrary `../` filesystem path (`paths.ts`, `paths.test.ts`).
- Filenames are deterministic and validated against a strict allow-list
  regex, never taken as free text from a request.
- An existing approved version is never silently overwritten
  (`approval.ts`'s conflict handling, `approval.test.ts`).

## Known limitations

- A pasted/dropped image is staged to a local scratch file
  (`data/staging/`, gitignored) but the in-progress `status` for an
  asset that has never been approved is only durable once the Studio
  itself has written it to `data/studio-state.json` -- a browser reload
  before the first status-changing action shows the catalogue default,
  not literally "what you were about to do."
- **OPEN SAVED FILE** and the automatic post-launch browser open use a
  best-effort platform-appropriate open command (`start`/`open`/
  `xdg-open`); on a machine with no GUI or default image viewer
  configured this silently does nothing rather than erroring.
- Reference thumbnails are not fetched/cached by the Studio (task brief
  §14: "do not permanently download or redistribute a reference whose
  rights do not permit it") -- each card links out to the reference's
  own source page instead of embedding a copy.
- WEBP dimension/alpha detection covers the VP8X (extended), VP8L
  (lossless) and VP8 (lossy) container variants; an unusual/animated WEBP
  variant outside those three may report `null` dimensions rather than
  failing outright.
