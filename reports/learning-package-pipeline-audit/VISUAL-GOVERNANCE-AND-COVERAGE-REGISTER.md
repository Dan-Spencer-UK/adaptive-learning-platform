# Visual Governance & Coverage Register (CC-13B)

**Structured data companion:** `visual-governance-coverage-data.json` (real corpus visual coverage, production-vs-shipped counts, new-schema adoption, duplicate-authority tracker list — all numbers below).

Combines: (a) the mechanical per-lesson visual-reference coverage numbers computed directly against the real corpus (`scripts/audit/lesson-structure-audit.ts`, see `LESSON-DEPTH-AND-FRAGMENTATION-REGISTER.md` §5 for the full 11-lesson zero-visual table), and (b) the whole-pipeline authority-chain trace (catalogue authorship, reference governance, runtime asset resolution, design-system binding).

## 1. Two structurally disconnected visual-catalogue systems exist

**System A — the real, currently-operative pipeline** (`tools/visual-production-studio/catalogue.ts` plus `reports/instructional-visuals/`): an ad hoc, hand-written TS module (not the new `visual-governance.ts` Zod types). `reports/instructional-visuals/unit202-comprehensive-visual-audit.md` documents a genuinely requirement-before-production process: three independent research passes → `needClassification` (`REQUIRED`/`USEFUL`/`NOT_NEEDED`/`DEFERRED_SCOPE`/`BLOCKED_REFERENCE`) assigned per asset → only then reference acquisition → then Gemini generation → then audit. Commit chronology confirms this ordering is genuine (catalogue/audit commits predate acquisition/generation commits). **Within its own (pre-CC-13A) discipline, this system is genuinely top-down governed** — need was classified before assets were produced.

**System B — the new CC-13A schema layer** (`VisualOpportunityAnalysis`/`VisualRequirement`/`ReferenceDossier`/`ProductionVisualAsset` in `packages/content-schema/src/visual-governance.ts`): structurally unrelated types, zero real instances (see `REFERENCE-AUTHORITY-REGISTER.md` §1). It did not precede anything and governs nothing yet, because nothing has been authored into it.

**Finding**: the operative system and the governed system are not the same system. The one that actually ran is not schema-typed against the architecture that is now supposed to govern it; the one the architecture specifies has never been used. Severity: **P0 (architecture-integrity defect)** — a fresh engineer reading only `visual-governance.ts`/the ADR-0005 docs would have no visibility into how Unit 202's real 53-asset catalogue was actually produced or governed. HUMAN-REVIEW-REQUIRED (reconciling or migrating one system into the other is a design decision, not a mechanical fix).

## 2. Runtime asset resolution: a second ad hoc table, unconnected to the new eligibility schema

`apps/mobile/src/components/diagrams/DiagramRenderer.tsx` resolves diagrams via three static tables (`CANONICAL_ASSESSMENT_VISUALS` → `CANONICAL_PARAMETER_VISUALS` → `CANONICAL_TEACHING_VISUALS`), each entry a hard-coded `require(...)` of a specific file path, plus an SVG registry fallback.

`CANONICAL_ASSET_LOCK` (a 21-entry table of `{canonicalAssetId, approvedVersion, sha256, auditFile, shippedAssetRelativePath}`) is:
- **(a) Not consulted at runtime.** It appears in exactly 3 files: its own definition, its test (`DiagramRenderer.test.tsx`, where it is used purely as a test-time SHA-256 tripwire re-verifying each shipped file's hash), and `PROJECT-STATUS.md` prose. `DiagramRenderer()`'s own resolution logic never imports or reads it.
- **(b) Totally unconnected to `ProductionVisualAsset.eligibility`.** No shared code or data; entries have no `eligibility`/`PRODUCTION_ELIGIBLE` field, and design-system-version binding is absent from all of them (see §5).

A separate, genuinely working `obsolete-assets/` mechanism exists (`apps/mobile/src/assets/instructional/obsolete-assets/unit202/{hybrid,teaching}/`, 13 superseded PNGs) — but it works by simple physical relocation out of the `require()` tree, not by any schema flag. **Superseded assets cannot resolve at runtime, but the mechanism proving this is folder placement, not the governed `eligibility: "SUPERSEDED_ARCHIVE"` field.**

Severity: **P1** — the mechanism works today (superseded assets genuinely can't resolve) but is fragile (a human must manually relocate files and keep `CANONICAL_ASSET_LOCK` in sync) and disconnected from the schema meant to govern it. MACHINE-FIXABLE to formalise; HUMAN-REVIEW-REQUIRED to decide the migration approach.

## 3. Large gap between QA-`PASS` produced imagery and what actually ships

Produced/audited corpus: `reports/instructional-visuals/unit202-final-state-completeness.md` reports 98 canonical states / 53 `ProductionAsset`s (47 GENERATED + 42 DETERMINISTIC), 55 with `approvalStatus: PASS`. Runtime-resolvable (shipped): **21** PNG assets total.

Of the 47 GENERATED/PASS states, only the 21 in `CANONICAL_ASSET_LOCK` ever reached `apps/mobile`. Named, cited gap: **all 6 REQUIRED `components.physical.*` assets** (resistor/capacitor/diode/led/thermistor/transistor physical-recognition photos, each individually QA-`PASS` per `unit202-visual-debt-register.md` §DEFERRED_SCOPE) sit only in the production-tool cache/proof tree; `apps/mobile/src/assets/instructional/unit202/physical-components/` is confirmed **empty**. Same gap pattern for electrolysis, heating-effect, protective-devices, diode bias-direction states, instrument clamp-meter/oscilloscope, magnet-pole comparisons, resistivity comparisons, and Fleming left/right-hand states. Three deterministic diagram renderers (`electronics.rectification_waveform`, `electronics.capacitor_transient_curve`, `electronics.electron_flow_vs_conventional_current`) are built, QA'd and registered in `DiagramRenderer.tsx` but "not yet referenced by any lesson step's `representation.diagramBlueprintId`" per that file's own comment — wired to zero lessons.

This is the mechanical root cause behind the "missing component symbol imagery" Product-Owner finding: the deterministic UK/IEC symbol cards (all 13 present) are shipped and correct, but their intended physical-recognition photo companions — explicitly documented as the product's intended teaching grammar in `unit202-visual-debt-register.md` — were produced, QA-passed, and never integrated. Severity: **P1** — HUMAN-REVIEW-REQUIRED. **Corrected by CC-13B.2**: this old QA-`PASS` status under the pre-ADR-0005 system is reusable evidence, not itself sufficient authorisation to ship — per `REMEDIATION-PLAN.md` Package 6, these are candidate reusable legacy assets that must be qualified through the current production authority (Packages 3-5: a real `VisualRequirement` mapping, reference-governance compliance where required, and a real `PRODUCTION_ELIGIBLE` `ProductionVisualAsset` record) before integration — "ship as-is" is not a legitimate fast path.

## 4. Per-lesson zero-visual-coverage numbers (real corpus)

11 of 24 real bundled lessons (45.8%) carry zero diagram/visual-aid references anywhere; only 52/270 steps (19.3%) carry any visual attachment; only 16 distinct diagrams + 1 distinct visual aid are referenced across the entire 24-lesson corpus. None of the 11 zero-visual lessons declares a `textOnlyJustification`. Full table and a read representative example (`lesson.electrical.core-quantities`) in `LESSON-DEPTH-AND-FRAGMENTATION-REGISTER.md` §5.

## 5. Design-system version binding: schema exists, zero real bindings

`CURRENT_DESIGN_SYSTEM_VERSION = "ALP-VDS-2026-08-29"` and `designSystemVersion`/`ALP-VDS` occur in exactly 6 files repo-wide (the schema, 2 tests, the dormant validator, 2 docs). Zero real asset records — not `catalogue.ts`, not any manifest/audit JSON, not `CANONICAL_ASSET_LOCK` — bind to it.

## 6. Top-line conclusions

- **Catalogue authority: MIXED.** Operative-but-non-conformant (System A, genuinely top-down within its own discipline) vs. conformant-but-empty (System B, the new schema).
- **Reference authority: TOP-DOWN GOVERNED in substance, via an ad hoc mechanism** — see `REFERENCE-AUTHORITY-REGISTER.md`.
- **Asset eligibility: BOTTOM-UP AD HOC, and materially incomplete.** Runtime resolution is 21 hard-coded `require()` statements plus a test-only tripwire; the documented "authoritative manifest" doesn't exist in the repo; the new `ProductionVisualAsset.eligibility` gate is fully unconnected to any of it; and a large fraction of QA-PASS produced imagery (all 6 REQUIRED physical-component images, several other REQUIRED families) never reached the shipped app.

## 7. Severity summary

| Finding | Severity | Root cause / Symptom | Fix type |
|---|---|---|---|
| Two disconnected visual-catalogue systems (operative vs. governed) | P0 | Root cause | HUMAN-REVIEW-REQUIRED |
| Runtime asset resolution disconnected from `ProductionVisualAsset.eligibility` | P1 | Root cause | BOTH |
| 6 REQUIRED physical-component images + several other REQUIRED assets produced/QA-PASS but never shipped | P1 | Symptom of missing integration step | HUMAN-REVIEW-REQUIRED |
| 45.8% of real lessons have zero visual coverage, none justified | P1 | Symptom of the above governance gap | HUMAN-REVIEW-REQUIRED |
| `designSystemVersion` schema exists, zero real bindings | P2 | Root cause: unused schema | HUMAN-REVIEW-REQUIRED |
| 3 deterministic diagram renderers built/QA'd but wired into zero lessons | P2 | Symptom | MACHINE-FIXABLE (wire into the relevant lesson steps) once a Project Architect confirms which lessons should use them |
