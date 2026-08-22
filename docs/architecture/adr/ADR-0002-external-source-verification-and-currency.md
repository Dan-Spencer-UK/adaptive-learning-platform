---
id: ADR-0002
status: accepted
owner: project-architect
last_reviewed: 2026-08-21
---

# ADR-0002: External-Source Verification and Currency

## Status

Accepted — 2026-08-21. Recorded per a Project-Architect-issued closeout task brief (CC-09A closeout) under [`DECISION-STANDARD.md`](../../governance/DECISION-STANDARD.md)'s authority rule ("The Project Architect prepares/recommends architecture decisions... The Implementation Engineer does not silently create architectural precedent"): the Implementation Engineer (Claude Code / Sonnet) mechanically records here a decision already directed by the Project Architect, exactly as [`ADR-0001`](ADR-0001-mobile-client-technology.md) records its own already-granted approval rather than self-authorising it.

## Context

During pre-CC-09A architecture planning, an AI architecture review (Fable) incorrectly identified a stale, pre-2017, third-party-hosted seven-Learning-Outcome Unit 202 structure as the *current* City & Guilds 2365-02 curriculum. The review had fetched a plausible-looking document, but never independently confirmed it against the actual current official publication. Independent checking — fetching the handbook directly from `cityandguilds.com` and reading its own version-history table — caught the error before any implementation began. CC-09A then re-verified, and implemented against, the correct current structure: six Learning Outcomes, 23 Assessment Criteria, 58 mandatory Range items, and the Unit 602 online test's real 90-minute/40-question/2-5-7-15-7-4 structure (see `PROJECT-STATUS.md` §CC-09A).

This incident demonstrates two separable, recurring risks this governed product will face for as long as it derives learner content from externally-owned authoritative sources (qualification handbooks, standards, sample assessments):

1. **Source interpretation risk.** "AI-generated/transcribed from what looks like an official source" is not the same claim as "independently verified against the actual official source." A model can genuinely believe it has found the right document and still be wrong — as happened here.
2. **Source currency risk.** "Verified against an authoritative source" is a point-in-time claim, not a permanent one. Awarding bodies revise handbooks (the fetched v1.12 PDF's own version-history table records a `1.6 July 2017` revision to Units 201/202, and a `1.12 April 2026` revision "Updates from BS 7671 Amendment 4" — both real, dated, upstream changes this product must be able to detect and respond to without silently mutating history).

Both risks apply to every load-bearing externally anchored fact this product governs: qualification/unit identity and version, Learning Outcome/Assessment Criterion/Range structure, assessment specifications (duration, question count, weighting, permitted materials), source-to-corpus mappings, externally sourced factual assertions, and structural observations drawn from public sample/mock assessment material.

## Decision

### A. Independent verification is required before externally anchored content counts as governed truth

An AI model's own extraction, transcription, interpretation or mapping of an external source is **never sufficient by itself** for that content to be treated as verified governed truth, however confident the extraction. The model that authored/extracted/mapped the content **must not be the sole verifier of its own externally sourced work.**

**Roles, for the current development workflow:**
- **Claude Code / Sonnet / Fable** (the Implementation Engineer) performs implementation, extraction and authoring.
- **Independent verification** is performed by the **Project Architect / ChatGPT**, checking the extraction against the actual authoritative source content — not merely confirming a title or URL exists.
- **The Product Owner is explicitly NOT the routine factual-verification layer.** No process requires the Product Owner to manually compare syllabus tables, Assessment Criteria, Range items, sample assessments or corpus mappings line-by-line. Product Owner approval remains required for product/architecture *decisions* (scope, priority, trade-offs) — a separate responsibility from source-fact verification.

**Scope — at minimum, this covers:**
qualification/unit identifiers and versions; curriculum structure (Learning Outcomes, Assessment Criteria, mandatory Range items); assessment specifications (duration, question count, weighting, format, permitted materials); source-derived curriculum/corpus mappings; externally sourced factual assertions entering the governed corpus; assessment examples used to infer exam style; sample/mock-paper structural observations; and any assessment-pattern taxonomy inferred from external examples.

**Verification standard.** Use the strongest available authoritative source: (1) the current official primary-source publication; (2) other official awarding-body/regulator material; (3) another authoritative technical primary source; (4) a secondary source only when no primary source is available. Search-result snippets, third-party training-provider summaries, forum posts, mirrors and model memory are never sufficient where the current primary source is reachable. Verification must inspect the actual source content (structure, counts, codes, load-bearing wording, mandatory sub-items, assessment structure), not merely confirm a title/URL/apparent version exists. For large corpora, prefer the most efficient combination of deterministic set/count comparison (as `report-coverage-matrix.ts`'s own structural gates already do for LO/AC/Range-item counts), structured extraction comparison, and targeted semantic verification over sampling — exhaustive manual re-reading is not mandated where deterministic comparison proves the same thing.

**Verification states.** Reused, not reinvented: `@alp/content-schema`'s `assertionVersionStatusSchema` already carries a per-assertion `VERIFIED` state (`CANDIDATE → SOURCE_LINKED → VERIFIED → APPROVED → PUBLISHED → SUPERSEDED → WITHDRAWN`) that had never actually been exercised in the live corpus before this ADR (every real assertion currently jumps straight to `APPROVED`) — this ADR gives that existing state real teeth: an assertion must not be marked `VERIFIED` while the source it cites is itself `UNVERIFIED`. A new, small, source-*snapshot*-level `sourceVerificationStatusSchema` (`UNVERIFIED | VERIFIED | VERIFICATION_FAILED`, default `UNVERIFIED`) is added to `sourceVersionManifestSchema` for the separate question "has this exact source document been independently confirmed" — deliberately distinct from the per-assertion state, since one source snapshot backs many assertions.

**Verification evidence.** For a material verification checkpoint, record enough to reproduce the conclusion: authoritative source identity, source version/date, verifier role/identity, scope, method, discrepancies found, resolution, final result. Record evidence and conclusions only — never hidden chain-of-thought. Structured facts (source identity, dates, fingerprint, verifier, status) live on the governed `sourceVersion` record itself (schema below); narrative verification context lives in the citing content's own header comments and in `PROJECT-STATUS.md`, matching this repository's existing narrative-provenance convention.

**Verification failure behaviour.** If independent verification materially disagrees with authored/extracted content, the discrepancy is never silently resolved by picking one side: identify it, resolve it against the authoritative source, and re-run verification. This is a blocking condition for any claim of complete curriculum coverage, assessment fidelity, release readiness, or current/verified external-source status.

### B. Externally anchored content must remain traceable to a specific source snapshot, and its currency must be checkable over time

"Correct today" is not sufficient. The product must be able to answer: which external source was used; which version/date; what exact snapshot was verified; whether that source is still current; when it was last checked; whether a newer/changed source exists; and which governed versions/releases were derived from it.

**Source-snapshot identity (extending the existing `sourceVersion` entity — no new entity created).** `@alp/content-schema`'s `sourceVersionManifestSchema` already carries edition/revision/publication/effective date and status; this ADR adds five small, optional/defaulted fields (`packages/content-schema/src/knowledge-graph.ts`, migration `supabase/migrations/20260821091500_source_version_verification_and_currency.sql`):

| Field | Purpose |
|---|---|
| `retrievedDate` | when this exact artefact was actually fetched/inspected (distinct from the publisher's own dates) |
| `contentFingerprintSha256` | SHA-256 of the actual fetched bytes — never fabricated; left unset when not actually computed |
| `verificationStatus` | `UNVERIFIED \| VERIFIED \| VERIFICATION_FAILED` (see Decision A) |
| `verifiedBy` | the independent verifier's role/identity — schema-enforced (`superRefine`) to be present whenever `verificationStatus !== UNVERIFIED`, so verification can never be asserted anonymously |
| `lastCurrencyCheckDate` | most recent "is this still the same/current" check, which may be lighter-weight and more recent than a full re-verification |

The fingerprint is deliberately load-bearing: URL, filename and visible version label are each things a source can keep unchanged while its actual content changes (a publisher can silently revise a PDF at the same URL under the same visible edition label). A content fingerprint is the only field here capable of detecting "same URL + same apparent version + changed bytes."

**External version vs. internal governed version — kept strictly separate.** An external version (e.g. "City & Guilds handbook v1.12") is owned by the publisher and lives on `sourceVersion`. An internal governed version (`curriculumVersion`, an assertion/corpus version, `AssessmentSpecification`, `LessonPlan.version`, `ContentRelease`) is owned by this product. **A change to an external source must never cause silent mutation of an existing internal governed version.** The required flow is: external change → detect → verify → impact-analyse → create new governed version(s) where needed → validate → publish a new `ContentRelease` where appropriate. This is exactly the discipline CC-09A already applied manually (the original `cv-2365-02-v1-12` was superseded, never rewritten in place, by `cv-2365-02-v1-12-r2`) — this ADR generalises it as a durable rule rather than a one-off correction.

**Historical interpretability.** Old, superseded governed versions/releases remain valid historical snapshots, never silently reinterpreted against newer curriculum content. `NOT CURRENT` is not `INVALID`: distinguish current-active, superseded-but-historically-valid, withdrawn/invalid, and disputed/unverified, following the existing `curriculumVersionStatusSchema`/`sourceVersionStatusSchema` `CURRENT/SUPERSEDED/WITHDRAWN` model, now joined by the new `sourceVerificationStatusSchema` for the orthogonal verification-currency question.

**Release currency.** A `ContentRelease` does not need new duplicated metadata to answer "which curriculum/assessment specification does this release implement" — that is already mechanically derivable via `ContentRelease.knowledgeCorpusId`/`pedagogyCorpusId` → the governed corpus → its `curriculumVersion`/`AssessmentSpecification` → their `sourceVersion` snapshot identity. Prefer this derivation path over adding a parallel field to `ContentRelease` itself.

**Periodic maintenance — seam only, not built now.** A future lightweight, source-specific-cadence maintenance job is required *before this product is considered production-ready for long-lived use*, but is explicitly out of scope to build in this closeout. Its contract: `registered source → scheduled currency check → CURRENT (no change) | POTENTIAL_UPDATE | SOURCE_UNAVAILABLE | WITHDRAWN_OR_REPLACED | VERIFICATION_REQUIRED`. A detected change (new version, changed bytes at the same URL/edition label, changed assessment specification, changed sample material, withdrawal, replacement qualification, teach-out notice, source moved/unavailable) **creates an update candidate — it never auto-edits production governed content.** Cadence is source-type-specific (a qualification handbook and a sample-paper page do not need the same check frequency) and is deliberately not hard-coded here. This job's home is a future `scripts/content/check-source-currency.ts`-shaped script (or equivalent), tracked as a backlog item in `PROJECT-STATUS.md`, not built by this ADR.

**Change impact analysis.** When an upstream change is verified, determine a *bounded* set of potentially affected governed layers (external source → `curriculumVersion` → curriculum nodes → assertion mappings → assertions → capabilities/families → `AssessmentSpecification` → pedagogy/question blueprints → lessons → course definition → `ContentRelease`) rather than assuming every change cascades to every layer — e.g. a sample-paper update affects assessment-pattern evidence only, not curriculum assertions.

**Sample/mock assessment currency.** Public sample papers, mark schemes and assessment guidance are themselves external sources subject to the same currency discipline. A new sample paper does not automatically invalidate existing independently authored questions; it creates new evidence about style/cognitive-demand/weighting/diagrams/distractor-patterns/unit-handling that should trigger reassessment of the assessment-pattern taxonomy, not wholesale replacement by default.

**Copyright boundary (reaffirmed, unchanged from CC-09A).** Verification and currency monitoring may inspect public official assessment material to confirm/refresh structural observations. It must never cause the product to ingest or reproduce source question text, answer options, scenarios, or specific numeric values as learner-facing content. Only derived structural observations and source references are stored — never a copied question bank.

## Alternatives considered

| Option | Rejected primarily because |
|---|---|
| Trust the extracting/authoring model's own confidence as sufficient verification | This is exactly the failure mode that produced the pre-CC-09A seven-LO error — the model was confident and wrong. A single-model process has no structural way to catch its own source-identification mistakes. |
| Require the Product Owner to manually verify every syllabus/assessment fact | Does not scale, turns routine content maintenance into a permanent Product Owner bottleneck, and duplicates work an independent AI verifier role can do at far lower cost — explicitly rejected in the task brief driving this decision. |
| Build a full source-monitoring/crawler platform with scheduled polling now | Disproportionate to current scale (one qualification, five sources); the task brief explicitly calls for a documented seam and minimal schema support, not a platform, deferring the scheduler until it is genuinely needed. |
| A new, parallel "SourceVerificationRecord" entity separate from `sourceVersion` | `sourceVersion` already *is* the "specific source snapshot" concept (edition/revision/publication/effective date); a parallel entity would duplicate that identity rather than extend it, against `DECISION-STANDARD.md`'s general "prefer extending existing architecture" discipline already used throughout CC-09A (e.g. `AssessmentSpecification` was added as one small new contract only where no existing one could represent the fact; here, extension suffices entirely). |

## Rationale

The governed content model already had almost everything this decision needed: `sourceVersion` for source-snapshot identity, `SUPERSEDED`/`WITHDRAWN` status enums for the supersession discipline, and an unused per-assertion `VERIFIED` state anticipating exactly this need. The gap was never structural capacity — it was that no rule required verification to actually happen, and no field could prove it had. This ADR closes that gap with the smallest possible extension (one new small enum, five optional/defaulted fields on one existing entity, one schema-enforced attribution rule) rather than new architecture, and assigns the verification responsibility to a role (independent AI verifier) that scales with content volume instead of one that does not (manual Product Owner fact-checking).

## Consequences / trade-offs

- No existing assertion or source version is retroactively marked `VERIFIED` by this ADR. The Unit 202 handbook `sourceVersion` (`SV_CG`) is recorded with a real, computed `contentFingerprintSha256` and `retrievedDate`/`lastCurrencyCheckDate` of `2026-08-21`, but `verificationStatus: "UNVERIFIED"` — the model that fetched and transcribed it (CC-09A, this same Implementation Engineer role) is not a valid independent verifier of its own extraction under this ADR's own rule. Independent verification by the Project Architect role against the recorded fingerprint is the next required step before any assertion citing it may be marked `VERIFIED`, and before "complete Unit 202 coverage" can be truthfully claimed.
- The four pre-existing CC-04A/B sources (BIPM SI Brochure, DfE GCSE Maths, OpenStax University Physics Vol. 1/2) are recorded with `verificationStatus: "UNVERIFIED"` and no fingerprint — their original fetched bytes are not available in the current environment to honestly compute one. Fabricating a fingerprint was explicitly rejected; this is recorded as a known gap for the next time each source is (re-)fetched, not silently ignored.
- The future maintenance script (§ periodic maintenance above) is a tracked backlog item, not yet built. Nothing in the current Unit 202 lesson-authoring backlog is blocked on it — the version/source architecture this ADR establishes is what matters before the next batch, per the task brief driving this decision.
- Any future assertion-authoring or curriculum-correction task must now record `verifiedBy` whenever it claims a `sourceVersion`'s `verificationStatus` is anything other than `UNVERIFIED` — enforced mechanically (`sourceVersionManifestSchema`'s `superRefine`, plus a matching DB CHECK constraint), not merely by convention.

## Review triggers

- The first time a future maintenance/currency-check script is actually built — this ADR's §Periodic maintenance seam should be reviewed against the real implementation and updated or superseded if the real design differs materially.
- The first time an external source is detected as changed (new edition, changed bytes, withdrawal) — confirms or revises the change-impact-analysis model in practice. **Fired 2026-08-22 (CC-09F):** the 2365-602 sample question paper (`SRC_CG_602_SAMPLE_QUESTIONS`) was found republished as v1.2 at the same URL pattern; the detect → verify flow held up (new edition registered, fingerprinted, old edition reclassified `SUPERSEDED`), but the "verify" step could not complete because the retrieved v1.2 artefact is encrypted and unreadable by every extraction tool available in this environment. This is a genuinely new sub-case the original decision did not anticipate: a source can be detected-as-changed and have its bibliographic identity honestly registered while remaining content-unverifiable for reasons outside this product's control. No schema/process change was needed — `verificationStatus: UNVERIFIED` already represents this correctly — but future maintenance-script design (still not built) should account for "detected, registered, blocked on access" as a distinct, expected terminal state, not an error case.
- If a second qualification/vertical is added and its sources reveal a currency-check need this ADR's per-source-type cadence framing does not actually fit.

## Related documents

- [`PROJECT-STATUS.md`](../../../PROJECT-STATUS.md) §CC-09A — the curriculum-correction incident this ADR generalises a durable rule from, and the source-record populated under it.
- [`docs/governance/DECISION-LOG.md`](../../governance/DECISION-LOG.md) — pointer entries for this ADR.
- [`docs/governance/DECISION-STANDARD.md`](../../governance/DECISION-STANDARD.md) — the ADR lifecycle/authority model this ADR follows.
- `packages/content-schema/src/knowledge-graph.ts` — `sourceVerificationStatusSchema`, `sourceVersionManifestSchema`'s new fields.
- `supabase/migrations/20260821091500_source_version_verification_and_currency.sql` — the corresponding DB columns/constraints.
