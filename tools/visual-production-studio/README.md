# ALP Visual Production Studio

**CC-11.5.** A local, localhost-only development tool for producing and
approving premium instructional artwork. **Not learner-facing product
functionality** -- never imported by `apps/mobile` or `apps/web`, never
part of the learner runtime.

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
   This establishes the session's standing art-direction rules once.
3. Use the **NEXT RECOMMENDED ASSET** panel (or browse the filtered
   catalogue grid) to pick the next visual to produce. Click **COPY
   PROMPT** (or the next-asset shortcut, keyboard `N`) to copy that
   asset's full, deterministically-generated production prompt.
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

- `catalogue.ts` -- the structured Unit 202 production catalogue (24
  entries). The single source of truth every prompt is built from.
- `master-prompt.ts` -- the permanent "start a new art session" prompt.
- `prompt-builder.ts` -- deterministically builds each asset's exact
  copyable prompt from its catalogue entry.
- `paths.ts` -- the safe local-save boundary. Every filesystem write
  goes through here; nothing else is permitted to turn client input into
  a real path.
- `image-utils.ts` -- dependency-free PNG/WEBP/JPEG format/dimension/
  alpha sniffing, SHA-256 hashing, and version-filename computation.
- `state-store.ts` -- local JSON status persistence
  (`data/studio-state.json`, gitignored -- ephemeral WIP, not governed
  content) and the append-only approval manifest
  (`reports/instructional-visuals/premium-artwork/unit202-artwork-manifest.json`,
  committed -- the real governed provenance record).
- `approval.ts` -- the APPROVE + SAVE orchestration: existing-file
  protection, versioning, hashing, manifest append.
- `next-asset.ts` -- the NEXT RECOMMENDED ASSET ranking (priority ->
  reference readiness -> status).
- `contact-sheet.ts` -- the EXPORT REVIEW CONTACT SHEET HTML generator.
- `server.ts` -- wires the above into a local-only HTTP API and serves
  `public/index.html` / `studio.css` / `studio.js`.

## Governed output locations

- Approved artwork: `apps/mobile/src/assets/instructional/unit202/{teaching,conceptual,hybrid,physical-components,deterministic-polish}/`
- Provenance manifest: `reports/instructional-visuals/premium-artwork/unit202-artwork-manifest.json`
- Review contact sheet (generated on demand): `reports/instructional-visuals/premium-artwork/contact-sheet.html`

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
