# Reference Authority Register (CC-13B)

**Question:** does any real tool/code path let a Claude-discovered or Claude-cached reference get treated as approved without an actual external Project-Architect handoff record? Is `ReferenceDossier.reviewedBy` (fixed to the literal `"PROJECT_ARCHITECT"`) actually used anywhere in real production tooling?

## 1. `ReferenceDossier` — a real, structurally-sound schema with zero real instances

`packages/content-schema/src/visual-governance.ts` lines 487-500 declares `reviewedBy: z.literal("PROJECT_ARCHITECT")` — confirmed verbatim: this genuinely is a fixed literal, not a free string, so no object satisfying the schema can attribute review to Claude or anyone else. `visual-planning-governance.test.ts` (217 lines, 54 tests across the whole visual-governance schema file, independently re-run: **all 54 PASS**) includes a dedicated test asserting `reviewedBy: "Claude"` is rejected.

However: a repo-wide grep for `ReferenceDossier`/`VisualRequirement`/`VisualOpportunityAnalysis`/`VisualFamilyContract`/`ProductionVisualAsset` found only 9 files total, and only **one** usage site outside `packages/content-schema` itself/its tests/docs: `scripts/content/validate-v1-learning-package.ts`'s `validateVisualGovernance()` function. That function's own header comment admits: *"these operate on caller-supplied VisualRequirement/ReferenceDossier/ProductionVisualAsset sets rather than a live corpus — CC-13A does not populate a real Unit 202 visual requirement register."* It takes its inputs as parameters, never reads any real corpus, and is **never called from the validator script's own CLI entry point** — it appears only in its own test file, exercised exclusively against hand-built fixture objects.

**Verdict: `ReferenceDossier` (and the whole new VRR/ARL/AAL schema layer) exists as schema + a dormant validator function + tests only. No script, no `tools/visual-production-studio` file, and no content-data file constructs a real instance of any of these types.** `lesson-plan.ts`'s `visualOpportunityAnalysisId` field references the concept only in a doc-comment; no real lesson populates it (confirmed independently: 0/24 in `scripts/audit/lesson-structure-audit.ts`'s corpus scan).

## 2. `tools/visual-production-studio/reference-acquisition.ts` — CC-13A's claim independently re-verified TRUE

Read in full (182 lines). `acquireReference(assetId, rawSourceUrl)` (lines 92-155) does exactly: canonicalise a Wikimedia `File:` URL to its raw-file endpoint, `fetch()` it, magic-byte-sniff to reject HTML error pages (`detectRealImageOrSvg`), hash it, and rasterise SVG via Playwright. **There is no search, ranking, or selection logic anywhere in this file.** It is a pure "given assetId + URL, fetch/validate/cache/hash" function. CC-13A's own claim ("already only downloads a pre-approved URL, never performs autonomous search/selection") holds under independent re-read.

## 3. Where the real reference URLs actually come from: an external, named, human handover — not the new schema

`tools/visual-production-studio/reference-corrections.ts` (686 lines) is a hand-authored, per-`assetId` table of ~45 reference records, each with `sourceUrl`/`licence`/`qualityGrade`. The `qualityGrade` field literally reads `"A (Product Owner-approved reference handover, 2026-08-24)"` (repeated ~35 times) or a secondary-handover variant. The file's own header states these come from *"the Product Owner's external reference-research handover (2026-08-24), stored verbatim at `reports/instructional-visuals/reference-research/unit202/`."* No candidate/search step exists in code anywhere in this chain — every URL is hard-coded and attributed to a named external human handover, not selected by Claude and not expressed as a `ReferenceDossier`.

**Conclusion for the authority-boundary question posed by ADR-0005/the Visual Reference Review Protocol**: in substance, reference selection genuinely is externally/human-governed today (real Product Owner handover, real per-asset attribution) — the authority boundary the architecture cares about is not being silently violated by Claude. But it is enforced by an ad hoc convention (a hard-coded table with a descriptive string), not by the new `ReferenceDossier` mechanism the architecture specifies, and nothing in the codebase would currently detect or block a *future* reference entry added without going through the same discipline — there is no schema gate on `reference-corrections.ts` at all (it's a plain exported object literal, not validated against any schema).

## 4. `tools/visual-production-studio/approval.ts` — a separate, older, real approval mechanism, unrelated to the new schema

`approveStagedImage()` (123 lines) writes `approvalStatus: "APPROVED"` into a manifest entry, but only when called from the Visual Production Studio's human-operated local web UI (`server.ts` → `public/index.html`/`studio.js`) — i.e. a human clicks "Approve" in the Studio. This approves the *rendered image*, not a reference, and is structurally unconnected to `ReferenceDossier.status`/`ProductionVisualAsset.eligibility` in the new schema. No other file in the directory sets any "APPROVED"-like status without a human step.

## 5. The documented "authoritative manifest" does not exist in the repository

`tools/visual-production-studio/paths.ts` defines `MANIFEST_PATH = reports/instructional-visuals/premium-artwork/unit202-artwork-manifest.json`, which `approval.ts` writes to and which `apps/mobile/src/assets/instructional/unit202/README.md` calls authoritative. **This file does not exist on disk and does not exist anywhere in `git log --all` history** (`git ls-tree HEAD reports/instructional-visuals/premium-artwork/` shows only a `proof/` subtree). It appears only as prose inside a CC-12C commit message describing it as stale/frozen/disconnected/never-audited — i.e. the documented "authoritative manifest" was already known to be dead, and the real system runs on a second, ad hoc, hand-maintained table (`CANONICAL_ASSET_LOCK`, see `VISUAL-GOVERNANCE-AND-COVERAGE-REGISTER.md` §2) that a human/agent must keep in sync by re-copying SHA-256s from audit files.

*Note: `reports/instructional-visuals/premium-artwork/unit202-artwork-manifest.json` appears as an untracked file in this session's initial `git status` snapshot (present on disk, never committed) — consistent with "does not exist in the repository" as a governed/committed artefact, and this audit did not read or rely on its contents since it is not part of any governed chain.*

## 6. Design-system version binding: declared but never actually bound

`CURRENT_DESIGN_SYSTEM_VERSION = "ALP-VDS-2026-08-29"` (`visual-governance.ts`) and `designSystemVersion`/`ALP-VDS` occur in exactly 6 files total: the schema itself, 2 test files, the dormant `validate-v1-learning-package.ts`, and 2 docs. **Zero real asset records anywhere** (`catalogue.ts`, any manifest/audit JSON, `CANONICAL_ASSET_LOCK`) reference it.

## 7. Top-line conclusions

- **Reference authority chain: TOP-DOWN GOVERNED IN SUBSTANCE, via an ad hoc mechanism, not the new schema.** Real human/external authority (a named, dated Product Owner handover) governs every real reference URL in use today; Claude/automated tooling performs candidate discovery/caching only, confirmed by direct code read. But none of this is expressed as the new `ReferenceDossier` object, so the schema's authority boundary is enforced nowhere in practice — because nothing constructs the object, not because anything violates it.
- **No bypass found**: no code path lets a Claude-cached/discovered reference get silently treated as approved without human involvement. The closest thing to a gap is structural, not behavioural: `reference-corrections.ts` is a plain, schema-unvalidated object literal, so a *future* entry added without the same handover discipline would not be caught by anything mechanical.

## 8. Severity summary

| Finding | Severity | Root cause / Symptom | Fix type |
|---|---|---|---|
| `ReferenceDossier`/VRR/ARL/AAL schema layer has zero real production usages (dormant) | P1 | Root cause: CC-13A deliberately scoped to schema-only | HUMAN-REVIEW-REQUIRED (wiring is a content/tooling package, not mechanical) |
| Real reference governance runs on an ad hoc, schema-unvalidated table (`reference-corrections.ts`) rather than the new `ReferenceDossier` mechanism | P1 | Root cause | BOTH (schema binding is machine-fixable; migrating ~45 real entries is human-review-required) |
| No mechanical gate prevents a future reference entry from skipping the handover discipline | P2 | Root cause | MACHINE-FIXABLE (validate `reference-corrections.ts` entries against a schema requiring the same attribution fields) |
| The documented "authoritative manifest" (`unit202-artwork-manifest.json`) does not exist / was already known dead | P2 | Symptom (stale documentation pointing at a non-existent file) | HUMAN-REVIEW-REQUIRED (doc correction — point at `CANONICAL_ASSET_LOCK` instead, or resurrect the manifest) |
| `CURRENT_DESIGN_SYSTEM_VERSION` declared but bound to zero real assets | P2 | Root cause: same as above, schema exists but unused | HUMAN-REVIEW-REQUIRED |
