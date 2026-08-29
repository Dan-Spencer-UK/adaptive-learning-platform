# Contract Adoption Matrix (CC-13B)

Structured companions: `contract-adoption-matrix.json`, `contract-adoption-matrix.csv` (same data, machine-readable). All numbers below are real, computed against the live corpus (`release.unit202.v8`: 24 distinct lessons, 270 distinct steps, 114 question blueprints), not estimated.

**Headline: adoption is 0% across every single ADR-0005/ADR-0006/CC-13A governance field, corpus-wide, with no exceptions.** This confirms CC-13A's own stated expectation (`PROJECT-STATUS.md` §CC-13A point 5) precisely — every field remains genuinely optional in the schema (never defaulted to look adopted), and no content re-authoring has happened yet. This is the honest baseline the next remediation phase starts from.

## Lesson-plan-level fields (real corpus: 24 lessons / 270 steps)

| Field | Level | Total | Adopting | Not adopting | Omission passes validation? | Should become mandatory? | Proposed mandatory stage |
|---|---|---:|---:|---:|---|---|---|
| `routePolicy` | lesson | 24 | 0 | 24 | Yes | No (not retroactive) | Storyboard stage, for lessons targeting V1 canonical route |
| `semanticUnit` | step | 270 | 0 | 270 | Yes | Yes | Storyboard stage (re-authoring) |
| `deliberateShortSectionReason` | step | 270 | 0 | 270 | Yes | Yes | Storyboard stage |
| `textOnlyJustification` | lesson | 24 | 0 | 24 | Yes | Yes | Visual-opportunity-analysis stage |
| `mayRevealTargetAnswer` | step | 270 | 0 | 270 | Yes | Yes | Content-implementation stage |
| `visualOpportunityAnalysisId` | lesson | 24 | 0 | 24 | Yes | Yes | Visual-opportunity-analysis stage |
| `assessmentMappingIds` | lesson | 24 | 0 | 24 | Yes | Yes | Assessment-mapping stage (once formative content exists) |

## Question-blueprint-level fields (real corpus: 114 blueprints)

| Field | Total | Adopting | Not adopting | Omission passes validation? | Should become mandatory? | Proposed mandatory stage |
|---|---:|---:|---:|---|---|---|
| `requiredKnowledgeIds` | 114 | 0 | 114 | Yes | Yes | Lesson-check / assessment plan stage |
| `v1PedagogicalRole` | 114 | 0 | 114 | Yes | Yes | Lesson-check / assessment plan stage |
| `revisionLessonIds` | 114 | 0 | 114 | Yes | Yes | Assessment plan stage |

## Visual-governance object contracts (real catalogued corpus: 53 assets; 21 shipped)

| Contract | Total applicable | Real instances | Omission passes validation? | Should become mandatory? | Proposed mandatory stage |
|---|---:|---:|---|---|---|
| `VisualOpportunityAnalysis` | 24 (one per lesson) | 0 | Yes | Yes | Visual-opportunity-analysis stage |
| `VisualRequirement` (VRR entries) | 53 | 0 | Yes | Yes | VRR/catalogue stage |
| `ReferenceDossier` (approved) | 53 | 0 | Yes | Yes | Reference-research/approval stage |
| `designSystemVersion` binding | 53 | 0 | Yes | Yes | Visual-production-brief stage |
| `ProductionVisualAsset` eligibility | 21 (shipped) | 0 | Yes | Yes | Visual-production-integration stage |

## Assessment/Guided-Revision/publication object contracts

| Contract | Total applicable | Real instances | Notes |
|---|---:|---:|---|
| `FormativeAssessmentInstance`/`SubmittedAssessmentResult` | 0 | 0 | No formative assessment feature exists at all — `totalApplicable` is genuinely 0, not merely low adoption. |
| `GuidedRevisionPlan` | 0 | 0 | No caller/storage/UI exists anywhere — nothing could currently produce a real plan. |
| `LearningPackageGateResult` | 24 (one set per lesson, minimum) | 0 | `isPublicationReady()` never called outside its own test. |

## Reading this matrix correctly

1. **A field showing 0/N adoption is not itself a defect** — every field is deliberately optional per CC-13A's own design discipline (never `.default()`), so the existing corpus validates cleanly without them. The defect, where one exists, is upstream: the feature/process the field is meant to represent (a real visual opportunity analysis, a real formative assessment, a real Guided Revision plan) mostly doesn't exist yet either.
2. **Two rows are qualitatively different from the rest**: `FormativeAssessmentInstance`/`GuidedRevisionPlan` have `totalApplicable: 0`, meaning there is no unit of content to even be non-adopting — these represent missing runtime features, not a coverage gap in existing content. Every other row has a real, non-zero `totalApplicable` denominator (real lessons, real steps, real blueprints, real catalogued visual assets) that genuinely isn't adopting the new field yet.
3. **The visual-governance rows understate the true gap**: 53 is the real catalogued/produced asset count from the pre-CC-13A ad hoc pipeline (`tools/visual-production-studio/catalogue.ts`), which used a structurally different data shape throughout — so "0/53 use the new schema" is accurate, but it is not simply "53 assets waiting to be tagged"; the underlying visual planning process itself needs reconciling with the new architecture, not just the record format (see `VISUAL-GOVERNANCE-AND-COVERAGE-REGISTER.md` §1, `REPRESENTATIVE-FAILURE-ROOT-CAUSE-TRACE.md` #10).
4. **Do not mass-edit content to improve these numbers.** Per this audit's own constraints and CC-13A's stated intent, adoption should rise only through genuine, Product-Owner-reviewed re-authoring under the corrected pipeline — never by mechanically stamping placeholder values into the new fields to make this matrix look better.
