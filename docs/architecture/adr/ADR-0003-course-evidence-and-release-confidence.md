---
id: ADR-0003
status: accepted
owner: project-architect
last_reviewed: 2026-08-22
---

# ADR-0003: Course Evidence Roles and Release-Confidence Governance

## Status

Accepted — 2026-08-22. Recorded per a Project-Architect-issued task brief (CC-09C), the same authority pattern [`ADR-0001`](ADR-0001-mobile-client-technology.md) and [`ADR-0002`](ADR-0002-external-source-verification-and-currency.md) follow: the Implementation Engineer (Claude Code / Sonnet) mechanically records here an architecture direction already approved by the Product Owner and specified by the Project Architect.

## Context

CC-09B through CC-09B.6 progressively hardened Unit 202's governed corpus and, in doing so, exposed a structural limit in the original completeness idea: **formal specification coverage (every AC/Range item has ≥1 governed assertion) is necessary but not sufficient for a truthful high-confidence alignment claim.** Two concrete Unit 202 findings drove this:

1. **Statistics** (AC1.1): the official handbook names the Range item only as "Statistics" — no sub-items. A public factual maths source could support many possible statistical concepts; it could not itself say which ones City & Guilds intends. CC-09B.6 resolved this only by introducing a *second* evidence layer — the official 2365-202 SmartScreen teaching handouts — as scope/depth evidence distinct from both the formal specification and factual truth.
2. **The curriculum-vs-factual source split was hardcoded.** `report-coverage-matrix.ts` decided whether a provenance link counted as "factual" (as opposed to curriculum-authority) by literally comparing a source's stable key against the string `"src-cg-2365-02"` — correct for Unit 202, but City & Guilds/Unit-202-specific in exactly the way the underlying architecture must not be if a second qualification or awarding body is ever onboarded (an independent adversarial-review question this ADR closes, see §Consequences).

Both findings point at the same root cause: the architecture modelled *what a source is cited for* (a specific assertion's provenance link) and *how confident the corpus is* (bare AC/Range coverage counts) but never modelled *what evidential job a source itself plays*, nor *whether an unresolved question is significant enough to block a credible release claim*. This ADR adds both, generically, so the next qualification (a different awarding body, entirely different document types) does not depend on Unit-202-shaped assumptions.

## Decision

### A. Course Evidence Registry: a generic source-role classification, replacing the hardcoded split

`@alp/content-schema`'s `sourceManifestSchema` gains an optional `sourceRole` field (`sourceRoleSchema`, `packages/content-schema/src/knowledge-graph.ts`): `NORMATIVE_CURRICULUM | AWARDING_BODY_SCOPE_INTERPRETATION | OFFICIAL_ASSESSMENT | OFFICIAL_PERFORMANCE_FEEDBACK | ENDORSED_OR_ASSOCIATED | EXTERNAL_DISCOVERY_OR_CORROBORATION | FACTUAL_AUTHORITY | SME_ADJUDICATION`. This is the source-identity-level generalisation of the four evidence roles CC-09B.6 named informally (normative curriculum source / official teaching-scope source / official assessment-pattern source / independent factual source) — SmartScreen becomes one example of `AWARDING_BODY_SCOPE_INTERPRETATION`, never the architectural concept itself. `report-coverage-matrix.ts`'s `isNonFactualAuthoritySource()` now derives the factual-vs-non-factual split from `sourceRole` instead of the hardcoded key; the City & Guilds handbook is the one source classified this way in the live corpus (a narrow, evidence-backed classification — it is the sole source ever cited with a curriculum-authority provenance role), every other existing source is deliberately left unclassified rather than retroactively mass-labelled.

**Every non-factual-authority role is excluded from entailment, not just the one Unit 202 happens to use.** An independent read-only adversarial review of this package (see §Consequences) found that an earlier version of this check excluded only `sourceRole === "NORMATIVE_CURRICULUM"` — meaning a source later classified `AWARDING_BODY_SCOPE_INTERPRETATION` (an official teaching-scope-interpretation source, the generic SmartScreen equivalent) would have silently started counting as factual evidence the moment anyone classified it, directly contradicting this ADR's own §Decision A doc comment ("never itself... a factual authority") and reopening exactly the "official teaching material becomes factual truth by accident" failure mode CC-09B.6 exists to prevent. Corrected before any source was actually reclassified this way: `isNonFactualAuthoritySource()` now excludes every role that is not itself a factual authority by this architecture's own governing rule — `NORMATIVE_CURRICULUM`, `AWARDING_BODY_SCOPE_INTERPRETATION`, `OFFICIAL_ASSESSMENT`, `OFFICIAL_PERFORMANCE_FEEDBACK` and `SME_ADJUDICATION` — while `FACTUAL_AUTHORITY`, `ENDORSED_OR_ASSOCIATED`, `EXTERNAL_DISCOVERY_OR_CORROBORATION` and every unclassified source continue to count as factual, unchanged. Mechanically regression-tested (`report-coverage-matrix.test.ts`, CC-09C test A2).

**Source role is not source authority.** `sourceRole` answers "what evidential job does this source do"; `publisher`/`sourceFamily`/`sourceType` (unchanged, free text) answer "who produced it and what kind of document is it." A City & Guilds document can be `NORMATIVE_CURRICULUM` (the handbook) or `OFFICIAL_ASSESSMENT` (a sample paper) — the same publisher, different roles. No new "authority class" enum is introduced: the existing free-text fields already carry this informally and forcing ~20 legacy sources into a new rigid enum without individually reviewed evidence would itself violate the no-retroactive-mass-labelling discipline this ADR otherwise enforces.

**Source role is not access/rights classification.** The existing `rightsClassificationSchema` (`OPEN | OFFICIAL_OGL | PUBLIC_RESTRICTED | PROPRIETARY_REFERENCE | LICENSED | ORIGINAL`, already on `sourceVersionManifestSchema`) already answers the access/rights axis this package's task brief asked for (§12: OPEN/OGL-equivalent/public-reference-only/proprietary-public/subscription/etc.) closely enough that a second, parallel field would duplicate rather than clarify — reused as-is, unchanged.

**Source role is not `basis`.** `unit202-knowledge-obligations.ts`'s existing `basis` field (`EXPLICIT | RANGE | NECESSARY_PREREQUISITE | OFFICIAL_TEACHING_INTERPRETATION | OFFICIAL_ASSESSMENT_EVIDENCE | SCOPE_UNRESOLVED`) answers a different question at a different layer — *why this specific knowledge obligation is in scope* — and is deliberately left unrenamed (renaming `OFFICIAL_TEACHING_INTERPRETATION` would be pure churn against an already-reviewed, historically clear literal, with no architectural benefit `sourceRole` does not already provide at its own layer).

Persisted as a nullable `sources.source_role` column with a `CHECK` constraint (`supabase/migrations/20260822090000_source_role.sql`), mirroring how `rightsClassification` is persisted on `source_versions` — source identity metadata the future Course Evidence Registry (and any future source-ingestion tooling) genuinely needs to read/write, not authoring-only governance metadata.

### B. Official assessment evidence is a first-class, reserved role — never built out this package

`OFFICIAL_ASSESSMENT` (source role) and `OFFICIAL_ASSESSMENT_EVIDENCE` (knowledge-obligation `basis`, already reserved-but-unpopulated since CC-09B.6) together give the architecture a place to record "official public assessment material positively supports knowledge obligation X" once the next package (Unit 202 Official Public Assessment Calibration) performs that analysis. This ADR does **not** analyse the 2365-602 sample assessment, extract assessment patterns, or add any assessment-derived Unit 202 obligation — it only proves the architectural seam exists and is safe.

**The asymmetry is structural, not merely documented**: no code path in `report-coverage-matrix.ts` derives `ScopeStatus.OUT_OF_SCOPE` from the absence of any evidence, sample-assessment or otherwise (mechanically regression-tested — see `report-coverage-matrix.test.ts`'s CC-09C describe block, test G). Official sample presence is positive evidence; official sample absence is never treated as exclusion evidence.

### C. Formal coverage, semantic completeness and course-evidence release confidence are three independent, never-collapsed dimensions

CC-09B.1 already separated FORMAL COVERAGE from SEMANTIC KNOWLEDGE COMPLETENESS. This ADR adds a fourth: **course-evidence RELEASE CONFIDENCE**, computed purely from dimensions the report already derives — never a new authored source of truth. A corpus can show 100% formal coverage and 100% semantic completeness while release confidence is still `LIMITED`, if a `MATERIAL` unresolved knowledge-obligation question remains.

### D. Materiality: extending an existing field, not building a risk matrix

`unit202-knowledge-obligations.ts`'s pre-existing `scopeUnresolved` field (CC-09B.4: `{ note: string }`, used for exactly one historical case — Statistics, since resolved by CC-09B.6) gains a required companion, `materiality: "MATERIAL" | "NON_MATERIAL"`. The question is always: *could this unresolved issue materially change what the learner needs to know/do, the expected depth, or a credible alignment claim?* No real obligation in the live corpus currently sets `scopeUnresolved` (Statistics was resolved), so this is a zero-risk schema extension proven by synthetic test fixtures rather than live-data migration.

### E. Release-confidence levels: HIGH / GOOD / LIMITED, deliberately categorical

`report-coverage-matrix.ts`'s new `ReleaseConfidenceAssessment` (`ReleaseConfidenceLevel = "HIGH" | "GOOD" | "LIMITED"`) is computed deterministically, never as a fabricated percentage (there is no mathematically defensible model for one here):

- **GOOD** (the commercial-quality release bar) requires: formal coverage complete; semantic knowledge 100% complete; entailment clean (no `UNSUPPORTED`/`PARTIALLY_SUPPORTED` assertion among Unit-202-scoped knowledge); syllabus-scope-fidelity clean (no `OUT_OF_SCOPE`/`ENRICHMENT_NOT_REQUIRED`/`SCOPE_UNRESOLVED` assertion); and zero `MATERIAL` unresolved uncertainty. Perfection/independent verification is **not** required.
- **HIGH** requires everything GOOD requires, plus every source backing an `IN_SCOPE_REQUIRED` assertion is independently `VERIFIED` per ADR-0002. Honestly unreachable by the real Unit 202 corpus today (only the handbook's own `sourceVersion` is `VERIFIED`, and it is always excluded from "factual" sourcing by its `NORMATIVE_CURRICULUM` role) — an accurate reflection of real project state, not a defect in the model.
- **LIMITED** is any state failing GOOD's criteria. Not a failure label — appropriate for internal development, research, beta, or a course not yet ready for a strong alignment claim.

`releaseReady` is `true` for `GOOD` or `HIGH`. The live Unit 202 corpus, as of this ADR, resolves to `GOOD` and `releaseReady: true` (mechanically proven, `report-coverage-matrix.test.ts` CC-09C test F) — the project's actual, current, honest release-confidence state.

### F. Targeted SME adjudication needs no new workflow

A `MATERIAL`-marked `scopeUnresolved` obligation already is the structured "this needs human adjudication" marker the task brief's targeted-SME-role requirement asked for — surfaced in `formatReport()`'s new COURSE-EVIDENCE RELEASE CONFIDENCE section without any free-text archaeology. No SME user role, workflow, ticketing or UI is built by this ADR.

### G. Proprietary-source firebreak, unchanged

Nothing in this ADR alters `SOURCE ARTEFACT → DERIVED SCOPE/KNOWLEDGE OBLIGATION → INDEPENDENT FACTUAL ASSERTION → ORIGINAL LEARNER CONTENT` (CC-09B.6, reaffirmed). `sourceRole` and the release-confidence assessment are both authoring/governance-side classifications of already-existing source/obligation metadata; neither touches `runtime-projection.ts` or any learner-facing content path.

## Alternatives considered

| Option | Rejected primarily because |
|---|---|
| A new, parallel "SourceEvidenceRole" entity separate from `sources` | `sources` already *is* the source-identity registry (title, publisher, family, type, jurisdiction, access location); a parallel entity would duplicate that identity rather than extend it, against the repository's established "prefer extending existing architecture" discipline (ADR-0002 made the identical choice for source-snapshot verification metadata). |
| A separate "authority class" enum distinct from `sourceRole` | The task brief's own worked examples (§11) show authority and role vary independently for the same publisher, which is real and worth keeping distinct conceptually — but the existing free-text `sourceFamily`/`sourceType`/`publisher` fields already carry this informally for every source in the live corpus, and forcing ~20 already-authored sources into a new rigid enum with no fresh individually-reviewed evidence would itself be exactly the retroactive mass-labelling this ADR's own migration discipline (§A) prohibits. Deferred until a genuine need (e.g. automated ingestion) requires it. |
| A fabricated numeric confidence score (e.g. "93.7% aligned") | No mathematically defensible model exists for combining these dimensions into a single number; false precision would misrepresent the actual evidential state worse than a categorical HIGH/GOOD/LIMITED does. |
| Requiring HIGH (full independent verification) as the release bar | Would make ordinary commercial release impossible under the Product Owner's explicit "as close to perfect as practicably achievable is acceptable" direction; GOOD is deliberately the practical release bar, HIGH the aspirational one. |
| Building the SME-adjudication workflow/UI now | Out of scope for this package (task brief §18/§20) — the `MATERIAL` uncertainty marker is the minimal governed surface a future targeted-review workflow needs; the workflow itself is deferred until genuinely needed. |

## Rationale

The governed content model already had almost everything CC-09C needed: `sources` for source identity, `rightsClassificationSchema` for access/rights, `basis` for obligation-level scope justification, and a `scopeUnresolved` field anticipating exactly the materiality question. The gap was narrow and specific: the curriculum-vs-factual split was hardcoded to one qualification's source key, and there was no derived signal answering "is this corpus credibly releaseable" independent of raw coverage counts. This ADR closes both gaps with the smallest possible extension (one new optional enum field on an existing entity, one required companion field on an existing-but-unused optional field, and one new report dimension computed entirely from data the report already had) rather than new infrastructure.

## Consequences / trade-offs

- `sources.source_role` is null for every source in the live corpus except the City & Guilds handbook. This is an honestly incomplete classification, not a defect — populating it further requires the same individually-reviewed evidence discipline ADR-0002 applied to source verification, and is left as a tracked future item, not fabricated here.
- Release confidence for the live Unit 202 corpus is `GOOD`, not `HIGH` — an accurate reflection that independent source verification (ADR-0002) has only happened for one source (the handbook itself) at the time of this ADR, not a defect this package introduces.
- The adversarial-review finding that motivated §A (a hardcoded Unit-202-specific source key inside otherwise-generic reporting logic) is now closed for the curriculum-vs-factual split specifically; other places in the codebase that are Unit-202-shaped by design (e.g. `CV_KEY_R2`, the 6/23/58 structural counts) remain intentionally qualification-specific and are out of this ADR's scope — those become generic only when a second qualification is actually onboarded, per the existing anti-drift/YAGNI discipline.
- No `ContentRelease` was minted or mutated; no learner-runtime behaviour changed; no DB migration touches any learner-facing table.

## Adversarial review

An independent read-only subagent reviewed the implementation against the twelve adversarial questions the governing task brief specified (terse-spec false-completeness, sample-assessment over-generalisation, absence-as-exclusion, fact-expands-scope, scope-becomes-fact, stale-source-override, proprietary-runtime-leak, unrealistic-perfection, non-material-blocking, GOOD-vs-weak distinguishability, vendor-terminology leakage, second-source-of-truth). Verdict: 10 of 12 PASS outright; 2 genuine findings, both adjudicated:

1. **Fixed**: `AWARDING_BODY_SCOPE_INTERPRETATION`-role sources were not excluded from factual entailment, contradicting this ADR's own stated rule. See §Decision A above for the fix and its regression test.
2. **Adjudicated, not changed**: the `entailmentClean` release-confidence criterion treats `PENDING_REVIEW` (a factual link that exists but has not yet been individually classified `DIRECT`/`PARTIAL`) as non-blocking, matching CC-09B.3's own deliberate, extensively-reasoned rule ("not yet classified" must never be conflated with "found deficient"). The reviewer correctly noted this makes it theoretically possible for a corpus whose citations are real but never individually inspected to reach `GOOD`. This is pre-existing CC-09B.3 architecture, not introduced by this package, and strengthening it is outside this package's bounded scope — it would need its own review, most naturally as sources accumulate real ADR-0002 verification en route to `HIGH`. Recorded here as a known, deliberate limitation rather than silently left unaddressed.

A third, minor observation (test G's original form proved the invariant only empirically against the live corpus, not by mutation) was also addressed — see `report-coverage-matrix.test.ts`'s CC-09C test G2, which mutates a real obligation away and proves the result is `SCOPE_UNRESOLVED`, never `OUT_OF_SCOPE`.

## Review triggers

- The first time a second qualification/awarding body is onboarded — confirms whether `sourceRole`'s eight values are sufficient, or whether a genuinely new evidential role is needed (per the task brief's explicit "no awarding-body-specific enum explosion" instruction, a new value should still describe a generic evidential job, never a vendor name).
- ~~The first time the Unit 202 Official Public Assessment Calibration package (the deferred next package) actually populates `OFFICIAL_ASSESSMENT`/`OFFICIAL_ASSESSMENT_EVIDENCE`~~ — **fired: CC-09D (2026-08-22)**. The seam worked as designed: the real public 2365-602 sample assessment was registered as two `OFFICIAL_ASSESSMENT`-role sources (question paper + mark scheme, zero provenance links from either — confirming the "never factual authority" invariant held under real use, not just synthetic tests) and `OFFICIAL_ASSESSMENT_EVIDENCE` was populated for the first time on three genuine knowledge-obligation gaps the sample calibration found (an impedance formula, a flux-density SI unit, a quantitative Faraday's-law relationship), each still requiring its own independently-inspected technical source (OpenStax University Physics Volume 2) before becoming a governed assertion — exactly the two-gate model this ADR specifies. One refinement the exercise surfaced: `scopeStatusFor`'s admissibility check (§Decision E/CC-09C) had to be extended from three to four admissible `basis` values to actually recognise the newly-populated `OFFICIAL_ASSESSMENT_EVIDENCE` case — an oversight of exactly the same shape CC-09B.6 hit for `OFFICIAL_TEACHING_INTERPRETATION` and self-detected via its own regression test; CC-09D caught and fixed it proactively before any test ran red. See `docs/architecture/evidence/CC-09D-UNIT202-ASSESSMENT-CALIBRATION.md` for the full calibration report.
- The §Adjudicated-not-changed `PENDING_REVIEW` limitation (above) was re-examined under CC-09D: the live corpus currently has **zero** `PENDING_REVIEW` assertions (the corpus compiler's own `DIRECT` default classifies every factual link), so the theoretical gap the CC-09C adversarial review flagged is not, in practice, currently load-bearing. A regression test (`report-coverage-matrix.test.ts`, CC-09D describe block, test D) now proves the gate's soundness under the worst-case construction anyway: an assertion resting on unclassified evidence does not by itself block `GOOD`, but if that evidence is retargeted to simulate not existing at all, the release-confidence gate correctly demotes to `LIMITED`.
- The first time any real obligation sets `scopeUnresolved` again — confirms the `materiality` field's MATERIAL/NON_MATERIAL split holds up against a genuine (not synthetic-test) case.
- The first time a second source is defensibly classified with `sourceRole` — an opportunity to review whether a lighter-weight, more systematic classification pass (still evidence-based, never bulk-guessed) is now warranted.

## Related documents

- [`PROJECT-STATUS.md`](../../../PROJECT-STATUS.md) §CC-09C — the implementation package this ADR generalises a durable rule from.
- [`docs/governance/DECISION-LOG.md`](../../governance/DECISION-LOG.md) — pointer entries for this ADR.
- [`ADR-0002`](ADR-0002-external-source-verification-and-currency.md) — source-snapshot verification/currency, reused unchanged as the HIGH-confidence gate's own evidence source.
- `packages/content-schema/src/knowledge-graph.ts` — `sourceRoleSchema`, `sourceManifestSchema.sourceRole`.
- `scripts/content/data/unit202-knowledge-obligations.ts` — `KnowledgeObligation.scopeUnresolved.materiality`.
- `scripts/content/report-coverage-matrix.ts` — `isCurriculumAuthoritySource()`, `ReleaseConfidenceAssessment`, `buildReport()`'s release-confidence computation.
- `supabase/migrations/20260822090000_source_role.sql` — the corresponding DB column/constraint.
