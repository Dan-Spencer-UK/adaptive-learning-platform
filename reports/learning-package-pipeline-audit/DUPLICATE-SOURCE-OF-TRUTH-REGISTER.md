# Duplicate Source-of-Truth Register (CC-13B)

Confirmed instances of more than one plausible authority for the same fact, found across the whole repository (see `SOURCE-OF-TRUTH-MAP.md` for the full 8-category inventory this register draws from).

## DUP-1: Visual asset production-eligibility — at least three independent per-asset status trackers, one with admitted "unclear provenance"

- `reports/instructional-visuals/premium-artwork/unit202-artwork-manifest.json` — the append-only approval manifest `tools/visual-production-studio/paths.ts`'s `MANIFEST_PATH` and `approval.ts` write to, and which `apps/mobile/src/assets/instructional/unit202/README.md` calls authoritative. **Does not exist in the repository** (not on disk, not in `git log --all` history) — the "authoritative" file is itself missing.
- `tools/visual-production-studio/data/studio-state.json` (via `state-store.ts`) — a separate workflow-status tracker (`STUDIO_STATUSES`: `REFERENCE_NOT_READY` … `APPROVED`/`SAVED`/`SUPERSEDED`).
- `reports/instructional-visuals/unit202-canonical-visual-registry.json` — a third, CC-11.11 "shipment-candidate registry," whose own generator script (`tools/visual-production-studio/generate-canonical-visual-registry.ts:17-19`) states verbatim: *"Deliberately does NOT touch `unit202-artwork-manifest.json` (a pre-existing file of unclear provenance from before this package's own work, left untouched throughout CC-11.9/CC-11.10/CC-11.11)."*
- Plus several further audit/debt-register JSONs (`unit202-visual-debt-register.json`, `unit202-final-state-completeness.json`, `mechanical-audit.json`, `semantic-audit.json`, `human-review-queue.json`) that overlap in what they record about the same assets.
- `apps/mobile/src/components/diagrams/DiagramRenderer.tsx`'s `CANONICAL_ASSET_LOCK` — a fourth, hand-maintained, test-verified table that is the one actually consulted at runtime, structurally unconnected to any of the above.

**No single reconciling authority exists.** The generator script's own comment self-acknowledges this. Severity: **P0** (this is the exact "multiple mutable sources of truth for lesson availability or asset selection" failure mode the audit plan's §5 "Runtime/source-of-truth" section explicitly names). HUMAN-REVIEW-REQUIRED (a genuine consolidation decision — which tracker becomes canonical, and a migration of the others).

## DUP-2: Release/lesson-availability — `course-definitions.ts` vs. `content-releases.ts`, with real prior-incident history

`scripts/content/data/content-releases.ts` declares `MOBILE_BUNDLED_RELEASE_ID = RELEASE_UNIT202_V8` — the single authored release manifest. `packages/diagnostic-engine/src/course-definitions.ts` (`UNIT202_ADAPTIVE_VERTICAL`) independently hardcodes its own `contentRelease: "release.unit202.v8"` field and its own 4-node lesson subset, structurally separate from the release manifest.

**This has already caused a real regression**: `course-definitions.ts:15-29`'s own header comment documents that this field previously drifted out of sync (`v2` while the real bundle advanced to `v7`), which would have thrown `UnknownCourseActivityError` for every real learner had it been exercised. It is currently back in sync at `v8`, but nothing except developer discipline (and whatever tests happen to cover it) prevents recurrence — the two declarations remain structurally independent, with no shared constant or mechanical cross-check.

Severity: **P1** (already caused one near-incident; currently in sync but fragile). MACHINE-FIXABLE (derive `course-definitions.ts`'s `contentRelease` from `MOBILE_BUNDLED_RELEASE_ID` directly, or add a test asserting they match).

## DUP-3: Curriculum representation — five places a single curriculum fact must independently stay consistent

From the curriculum trace (`SOURCE-OF-TRUTH-MAP.md` §1 / the A-C investigation): a curriculum fact (e.g. "AC6.1 requires Telephones") exists independently in: (1) the handbook-derived curriculum node (`cc04-unit202-electrical-science.ts`), (2) the knowledge-obligation entry (`unit202-knowledge-obligations.ts`), (3) the assertion's own `curriculum:` mapping (also in `cc04...ts`, a second place within the same file), (4) the lesson's `targetAssertionIdentifiers` (the relevant `lesson-*.ts` file), and (5) the assessment-spec's LO allocation (`unit202-assessment-specification.ts`). All five are currently held consistent **only by dedicated validator scripts** (`validate-pedagogy.ts`, `report-coverage-matrix.ts`, `validate-lesson-plan.ts`), not by a single canonical structure — the validators are real and currently all pass, but the multiplicity itself is a standing structural risk (a sixth place — e.g. a future formative-assessment content file — would need its own new validator, not an automatic guarantee).

Severity: **P2** (currently well-guarded by real, passing validators; the risk is structural fragility for future additions, not a live defect). MACHINE-FIXABLE only partially — full consolidation into one structure would be a significant refactor; the pragmatic mitigation is ensuring every new representation gets its own validator, which is already the pattern in use.

## DUP-4: Design-system tokens — mobile and web maintain fully independent token sets, by design, neither final

`apps/mobile/src/lib/tokens.ts` (React Native `StyleSheet` constants, explicitly self-documented as *"NOT the final learner-facing design system... do not copy the web client's Tailwind token system"*) vs. `apps/web/app/globals.css` (Tailwind CSS variables). Materially different palettes (mobile dark-only `#0B0D12`/`#4C8DFF`; web light+dark `#ffffff`/`#0b0d10`, `#2563eb`/`#60a5fa`), no shared version identifier, no `packages/design-system`.

This is distinct from — and layered underneath — the separately-tracked `ALP-VDS-2026-08-29` instructional-visual design-system version (`docs/design/ALP-PRODUCT-WIDE-VISUAL-DESIGN-SYSTEM.md`, `CURRENT_DESIGN_SYSTEM_VERSION` in `visual-governance.ts`), which governs illustrated/diagram artwork, not UI chrome tokens. Both mobile and web token sets self-describe as provisional/proving-shell, so this reads less as "conflicting truth" and more as "no canonical UI design-system source of truth exists yet at all."

Severity: **P2** (acknowledged provisional state on both sides, not an active conflict). HUMAN-REVIEW-REQUIRED (a genuine product/design decision, out of scope for mechanical remediation).

## Confirmed NOT a duplicate (investigated and ruled out)

- **Question/assessment content** (`pedagogy.ts` blueprint schema vs. `assessment-specification.ts` official test structure vs. `assessment-instance.ts` attempt lifecycle): three schemas with deliberately separated, non-overlapping scopes, each self-documented as such. Not duplicative.
- **Visual asset requirements** (`visual-governance.ts`'s `VisualSemanticContract` "meaning" layer vs. `pedagogy.ts`'s diagram/visual-aid "rendering parameter" schemas): an explicitly documented split, not a conflict.
- **Guided Revision plan state**: no persisted/runtime state exists anywhere — a single schema+pure-function, correctly not duplicated (see `GUIDED-REVISION-INTEGRITY-REGISTER.md`).
- **Lesson content aggregation**: `scripts/content/data/lessons.ts` is the single documented aggregation point ("import from here, never an individual file") — the per-lesson files and the release-membership overrides are correctly a one-authored-source/many-membership-entries pattern, not duplication (confirmed by the curriculum trace's "24 distinct lessons × ~5.8 release memberships = 140 reported entries" finding — see `MISSING-OR-INACTIVE-VALIDATORS.md`).

## Severity summary

| ID | Finding | Severity | Fix type |
|---|---|---|---|
| DUP-1 | Visual asset eligibility: 3+ disconnected trackers, one admitted unclear-provenance | P0 | HUMAN-REVIEW-REQUIRED |
| DUP-2 | `course-definitions.ts` vs. `content-releases.ts` release-id drift (already caused a near-incident) | P1 | MACHINE-FIXABLE |
| DUP-3 | Curriculum fact represented in 5 places, held together only by validators | P2 | MACHINE-FIXABLE (partial) |
| DUP-4 | Mobile/web design tokens fully independent, no canonical source | P2 | HUMAN-REVIEW-REQUIRED |
