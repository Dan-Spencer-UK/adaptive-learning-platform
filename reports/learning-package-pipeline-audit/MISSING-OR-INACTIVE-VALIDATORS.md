# Missing or Inactive Validators (CC-13B)

Classifies every relevant validator as **ACTIVE** (runs against real corpus, real failures would fail it), **INACTIVE** (exists, correct, but never invoked outside its own tests — nothing exercises it against real data), or **MISSING** (no mechanical check exists at all for a rule the architecture requires).

## ACTIVE validators (real, run against the live corpus today, currently PASS)

| Validator | Script | What it checks | Live result |
|---|---|---|---|
| Curriculum/knowledge graph integrity | (inside `knowledgeGraphManifestSchema`'s `superRefine`, `packages/content-schema/src/knowledge-graph.ts`) | FK resolution, no duplicate ids, no self-referencing relationships, `APPROVED`/`PUBLISHED` assertions must have provenance | Enforced at parse time on every corpus load |
| Lesson-plan cross-reference integrity | `scripts/content/validate-lesson-plan.ts` (`npm run lesson:validate`) | Every lesson's assertion/capability/blueprint ids resolve against `cc04`/`cc05a` | 140 lesson entries (24 distinct lessons × ~5.8 release memberships — see note below), 1544 step entries, 18 named gates, all 0. PASS |
| Pedagogy corpus coverage | `scripts/content/validate-pedagogy.ts` (`npm run content:pedagogy:report`) | Assertion-family completeness, dangling refs, formula/blueprint coverage | 29 families / 258 memberships / 259 assertions / 114 blueprints, all gates 0. PASS |
| Coverage matrix / syllabus-scope fidelity | `scripts/content/report-coverage-matrix.ts` (`npm run coverage:matrix`) | Referential + semantic completeness per LO/AC/Range item; `IN_SCOPE`/`OUT_OF_SCOPE`/etc. classification | 6 LOs/23 ACs/58 Range items, 23/23 complete, 172/69/6/0/0/0 scope split, 0 structural defects. PASS |
| Taught-before-tested / off-syllabus-dependency (NEW, CC-13A) | `scripts/content/validate-v1-learning-package.ts` (`npm run v1-package:report`) | Every question blueprint's `requiredKnowledgeIds` is taught somewhere; taught earlier in the same lesson or via a declared `prerequisiteKnowledge` link | 0 off-syllabus, 0 undeclared-other-lesson, 0 dangling FORMATIVE_MOCK mappings, 0 POST_V1_ADAPTIVE-in-CANONICAL_FIXED_ROUTE. PASS (vacuous — see note) |
| `CANONICAL_FIXED_ROUTE` step-requirement gate (NEW, CC-13A) | `lesson-plan.ts` `superRefine` | Every step in a `CANONICAL_FIXED_ROUTE` lesson must be `requirement: "required"` | Real, tested (3/3 tests pass), but **has a gap** — see `V1-ROUTE-DRIFT-REGISTER.md` §2 (`branchRoutes` not covered) |
| Embedded-check answer-leak gate (NEW, CC-13A) | `lesson-plan.ts` `superRefine` | A step marked `mayRevealTargetAnswer` must not precede a graded step testing overlapping capability/knowledge | Real, correctly implemented; 0/270 real steps currently adopt `mayRevealTargetAnswer`, so unexercised against real content |
| `FORMATIVE_MOCK` requires `revisionLessonIds` (NEW, CC-13A) | `pedagogy.ts` `superRefine` | Every `v1PedagogicalRole: "FORMATIVE_MOCK"` blueprint has ≥1 `revisionLessonIds` | Real; 0/114 blueprints currently declare `v1PedagogicalRole` at all, so unexercised |
| `ProductionVisualAsset` eligibility gate (NEW, CC-13A) | `visual-governance.ts` `superRefine` | `PRODUCTION_ELIGIBLE` requires all QA dimensions PASS + Product Owner approval + ≥1 reference dossier | Real, correctly implemented; **zero real `ProductionVisualAsset` instances exist anywhere in the repo**, so unexercised |
| `ReferenceDossier.reviewedBy` literal type | `visual-governance.ts` | Structurally impossible to construct a dossier claiming a non-`PROJECT_ARCHITECT` reviewer | Real, correctly implemented; **zero real `ReferenceDossier` instances exist**, so unexercised |
| `CANONICAL_ASSET_LOCK` SHA-256 tripwire | `DiagramRenderer.test.tsx` | Every shipped asset's hash matches the locked table | Real, but **test-only** — not a build/CI-blocking content validator in the same sense as the others, and the lock table itself is hand-maintained (see `BYPASS-PATH-REGISTER.md` BP-4) |

**Corpus-size note** (from the curriculum trace): `validate-lesson-plan.ts`/`validate-v1-learning-package.ts` both report "140 lessons" — this is 24 distinct authored lesson bodies × ~5.8 average `ContentRelease` memberships each (each of the 8 successive releases re-lists the same lesson content, spread-copied with only `contentRelease` overridden), **not** 140 distinct lesson designs. Similarly "1544 steps" = 270 distinct steps × the same multiplier. Any report or summary quoting these raw tool-output numbers without this context materially overstates real corpus size — this audit uses the real 24-lesson/270-step figures throughout (computed independently via `scripts/audit/lesson-structure-audit.ts` against `release.unit202.v8` specifically).

**"Vacuous PASS" note**: `v1-package:report`'s 0-failure result is real and correctly computed, but every one of its gates currently has nothing to check — 0/140 lesson entries declare `routePolicy`, 0/114 blueprints declare `v1PedagogicalRole`. A PASS here proves the gate logic doesn't currently reject anything; it does not prove the gate would correctly catch a real violation once content adopts these fields. This should not be read as evidence of ADR-0005/0006 learner-readiness.

## INACTIVE validators (real, correct logic, never invoked against real data outside their own tests)

| Validator/function | File | Why inactive |
|---|---|---|
| `validateVisualGovernance()` | `scripts/content/validate-v1-learning-package.ts` | Exported, real, correctly written — but takes `requirements`/`dossiers`/`assets` as caller-supplied parameters rather than reading any corpus, and is **never called from the script's own CLI entry point** (`isMainModule()` block calls only `computeReport()`/`formatReport()`). Only ever invoked from its own test file with hand-built fixtures. |
| `validateGuidedRevisionPlanLessons()` | `scripts/content/validate-v1-learning-package.ts` | Same pattern — real function, no real-corpus caller, no CLI wiring. |
| `isPublicationReady()` | `packages/content-schema/src/learning-package-gate.ts` | Real, correct. Grepped the entire repo (`scripts/`, `package.json`, no CI config beyond npm scripts): the only hits are inside its own test file. No validator script, no `npm run` script, no CI workflow calls it. There is currently no mechanical way to actually compute "is this lesson/package learner-ready." |
| `buildSubmittedAssessmentResult()` / `buildGuidedRevisionPlan()` / `selectLatestSubmittedResultInScope()` | `packages/content-schema/src/assessment-instance.ts` / `guided-revision.ts` | Real, deterministic, 33/33 tests pass — but zero callers anywhere outside their own test files (no runtime, no other script). |

## MISSING validators (no mechanical check exists at all)

| Rule required by the architecture | Where it's required | Current state |
|---|---|---|
| Taught-before-tested derived directly from `tests:` arrays, not just via blueprint `requiredKnowledgeIds` | `SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md` §3.3 | **Partial gap**: `validate-v1-learning-package.ts` only checks a blueprint's own declared `requiredKnowledgeIds`; it does not independently derive/cross-check that a step's `tests: [...]` ids were actually taught earlier via that step's own lesson `teaches` history if the blueprint itself omits `requiredKnowledgeIds` (0/114 blueprints currently declare it, so this path is entirely untested today). |
| "Does this content plausibly belong in this qualification" relevance/proportionality check (as opposed to official curriculum-node traceability) | Implicit in `PREMIUM-LEARNING-PACKAGE-STANDARD.md` ("no unrelated 'interesting' content drift") and the Product Owner's own telephone-socket finding | **MISSING.** Confirmed no validator encodes this; the telephone-socket content is mechanically `IN_SCOPE_REQUIRED` (traces to the handbook's own AC6.1 Range item) yet still reads as tangential to a human reviewer. This is fundamentally a human-judgement call the architecture does not currently attempt to mechanise, and probably should not attempt to fully mechanise — but no register/flag exists to let a human reviewer specifically re-examine "technically-in-scope-but-narrow" Range items. |
| Cross-check that a shipped runtime asset file matches an actually-declared `ProductionVisualAsset`/current `CANONICAL_ASSET_LOCK` entry (automated, not test-only) | `LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md` §14 ("active/superseded asset eligibility") | **MISSING** as a build/CI gate — only exists as a Jest test that must be manually kept passing; no script diffs the shipped asset folder against the lock table automatically on every content change. |
| `branchRoutes` forbidden on `CANONICAL_FIXED_ROUTE` lesson steps | ADR-0006, `LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md` §2 | **MISSING** — see `V1-ROUTE-DRIFT-REGISTER.md` §2 / `BYPASS-PATH-REGISTER.md` BP-1. |
| A real release-check/CI step that actually calls `isPublicationReady()` against real `LearningPackageGateResult` records | `docs/governance/LEARNING-PACKAGE-QUALITY-GATES.md` §2 | **MISSING** entirely — no code path produces real `LearningPackageGateResult` records for any lesson today. |

## Severity summary

| Finding | Severity | Fix type |
|---|---|---|
| `branchRoutes` gate missing (route-drift bypass) | P0 | MACHINE-FIXABLE |
| No real caller for `isPublicationReady()`/gate results anywhere | P1 | HUMAN-REVIEW-REQUIRED (needs a real release-check script + a source of `LearningPackageGateResult` records) |
| `validateVisualGovernance()`/`validateGuidedRevisionPlanLessons()` unwired from their own script's CLI | P1 | MACHINE-FIXABLE (wire into `isMainModule()` once real VRR/dossier/plan data exists to check) |
| Taught-before-tested gate trusts blueprint-declared `requiredKnowledgeIds` rather than deriving from `tests:` directly | P2 | MACHINE-FIXABLE |
| No relevance/proportionality flag for technically-in-scope-but-narrow content | P2 | HUMAN-REVIEW-REQUIRED (process design, not pure mechanism) |
| No automated (non-test) cross-check of shipped assets vs. lock table | P2 | MACHINE-FIXABLE |
| "140 lessons"/"1544 steps" report figures are release-membership-multiplied and easily misread | P2 | MACHINE-FIXABLE (report scripts could additionally print the distinct-lesson-body count) |
