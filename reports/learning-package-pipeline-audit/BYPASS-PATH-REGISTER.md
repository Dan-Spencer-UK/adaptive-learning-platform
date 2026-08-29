# Bypass Path Register (CC-13B)

A "bypass" here means: a real, currently-exploitable code path by which a governance rule described in the architecture docs could be silently circumvented — as opposed to a rule that is simply not yet adopted by content (that is a coverage gap, tracked in the contract-adoption matrix and per-layer registers, not a bypass).

## Confirmed bypass paths (real, exploitable today)

### BP-1: `CANONICAL_FIXED_ROUTE` lessons can still branch via `branchRoutes`

The schema gate (`lesson-plan.ts` `superRefine`) checks only `step.requirement`, never `step.branchRoutes`. A step can be `requirement: "required"` (passes the gate) while carrying a non-empty `branchRoutes` array. `packages/learning-engine/src/branching.ts`'s `resolveWithinSessionBranch` and `apps/mobile/src/lib/lesson-session/lesson-controller.ts`'s `resolveBranchDestination` apply unconditionally, with zero `routePolicy` awareness anywhere in the call chain. **This is a real, mechanically-exploitable bypass of the ADR-0006 route-invariance invariant** — currently inert only because 0/140 real lessons declare `routePolicy` at all. Full detail: `V1-ROUTE-DRIFT-REGISTER.md` §2. Severity: **P0**. MACHINE-FIXABLE.

### BP-2: schema validation of `CANONICAL_FIXED_ROUTE`/answer-leak/FORMATIVE_MOCK rules is build-time only, with no runtime defense-in-depth

`lessonPlanManifestSchema.parse()` runs once, inside `scripts/content/generate-mobile-projection.ts`, at content-generation time. `apps/mobile/src/lib/lesson-content/local-content-registry.ts` performs zero runtime re-validation (`.parse(`, `safeParse`, `Schema` — all 0 occurrences) and simply returns typed objects from the generated file. `lesson-player.tsx` calls `assembleLessonInstance` directly on that build-time-validated object. **This is not currently exploitable via the normal pipeline** (a schema violation fails `content:mobile:generate` and never reaches the bundle), but it is a real defense-in-depth gap: any future direct-write path to the generated projection file, a hand-edited fixture, or a generator bug would ship ungoverned content with no runtime check to catch it. Severity: **P1**. MACHINE-FIXABLE (add a lightweight runtime schema check at app startup or content-load time) but a Project-Architect judgement call on whether it's worth the perf cost given the build-time gate already exists.

### BP-3: `reference-corrections.ts` is a schema-unvalidated plain object literal

Every real reference URL in production use traces to `tools/visual-production-studio/reference-corrections.ts`, a hand-authored table with no schema validation of any kind. Today it is genuinely populated only from a named, dated Product Owner handover (confirmed, see `REFERENCE-AUTHORITY-REGISTER.md`) — so there is no *current* violation. But nothing mechanical would catch a future entry added without the same discipline (e.g. a URL added by an engineer or by Claude under time pressure, without the `qualityGrade`-style attribution convention actually being enforced — it's a comment-like string field, not a validated provenance record). Severity: **P2** (latent, not currently exploited). MACHINE-FIXABLE (validate against a schema requiring the same attribution fields the convention already informally uses).

### BP-4: `CANONICAL_ASSET_LOCK` is a hand-maintained table with no automated sync to the real produced-asset corpus

Superseded/obsolete assets are excluded from runtime resolution by physical folder placement (`obsolete-assets/`), which does work today, but the "which asset version is current" decision lives in a hand-maintained 21-entry table (`DiagramRenderer.tsx`) that a human/agent must keep in sync by re-copying SHA-256 hashes from audit files. A future edit that updates a shipped asset file without also updating `CANONICAL_ASSET_LOCK` would silently pass everywhere except the one test file that recomputes hashes against it. There is no schema/CI-level cross-check between "what's on disk in the shipped asset folder" and "what `CANONICAL_ASSET_LOCK` declares should be there." Severity: **P2**. MACHINE-FIXABLE (a script that diffs the shipped folder contents against the lock table).

## Investigated and confirmed NOT bypassable

- **`tools/visual-production-studio/reference-acquisition.ts`**: confirmed pure download/validate/hash, no search/ranking/selection logic — cannot be used to smuggle an unapproved reference in as "found," because it never picks a reference, it only fetches one it's told to fetch. No bypass.
- **`approval.ts` (Visual Production Studio)**: `approveStagedImage()` only reachable through the human-operated local web UI (`server.ts`/`studio.js`) — no programmatic/automated path sets `approvalStatus: "APPROVED"` without a human clicking Approve. No bypass.
- **Learn hub / lesson catalogue** (pending final confirmation from the N-P projection trace, see `SOURCE-OF-TRUTH-MAP.md`/`PIPELINE-TRACE.md`): no prerequisite hard-gate found in the code read so far consistent with the CC-12H fix remaining intact.

## Non-bypass items correctly ruled out during this audit

- The 4 known within-lesson branching lessons (`lesson.electrical.ohms-law`, `lesson.electrical.resistors-parallel`, `lesson.magnetism.effects-of-current`, `lesson.waveforms.ac-dc-and-sine-wave-quantities`) are **not** a bypass of ADR-0006 — none declares `routePolicy` at all, so they are correctly outside the V1-canonical-route contract's scope (retained platform capability, exactly as ADR-0006 permits).
- CC-07 evidence/mastery (`packages/evidence-engine`) feeding `assembleLessonInstance` as an input is not a bypass — it is a correctly-separated input to step-inclusion decisions that, for a properly-gated `CANONICAL_FIXED_ROUTE` lesson (once BP-1 is fixed), would have no effect on the required-step sequence.

## Severity summary

| ID | Finding | Severity | Fix type |
|---|---|---|---|
| BP-1 | `branchRoutes` bypasses the CANONICAL_FIXED_ROUTE gate | P0 | MACHINE-FIXABLE |
| BP-2 | No runtime defense-in-depth beyond build-time schema validation | P1 | MACHINE-FIXABLE |
| BP-3 | `reference-corrections.ts` unvalidated against any schema | P2 | MACHINE-FIXABLE |
| BP-4 | `CANONICAL_ASSET_LOCK` hand-sync, no automated cross-check | P2 | MACHINE-FIXABLE |
