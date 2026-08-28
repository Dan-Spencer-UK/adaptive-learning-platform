---
id: GOV-006
status: approved
owner: project-architect
last_reviewed: 2026-08-28
---

# Documentation Currency Register

Produced by CC-12E as a compact, efficient audit of repository documentation currency — not a rewrite of every document. Statuses:

- **AUTHORITATIVE_CURRENT** — accurate, owns the fact(s) it states, no correction needed.
- **CURRENT_WITH_MINOR_UPDATE** — accurate after a small correction made in this package.
- **STALE_REQUIRES_UPDATE** — found materially stale; not corrected in this package (none found at Tier 1/2 — see below).
- **SUPERSEDED_ARCHIVE/HISTORICAL** — correctly describes a past state; not current authority, not rewritten.
- **DUPLICATE_SOURCE_OF_TRUTH** — overlaps another document's owned fact; flagged, not merged (none required a merge this pass).
- **UNCLEAR_OWNERSHIP / NOT AUDITED THIS PASS** — large or low-churn document not read in full this pass; a targeted grep for known stale terms found nothing wrong in it.

## Method

Tier 1 (read in full or near-full): README, PROJECT-STATUS, START-HERE, ROADMAP, ARCHITECTURE-OVERVIEW, PROJECT-CONSTITUTION, PRODUCT-PRINCIPLES, DECISION-LOG, DOCUMENTATION-STANDARD, LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE. Tier 2 (targeted grep across every file under `docs/` plus README/PROJECT-STATUS/CONTRIBUTING for ten known-stale terms — see CC-12E's own report for the exact term list and results). Tier 3 (historical evidence/research documents): filenames inventoried, not read line-by-line; nothing in Tier 2's grep flagged a problem inside them.

## Register

| Document | Status | Note |
|---|---|---|
| `README.md` | AUTHORITATIVE_CURRENT | Pointer document; correctly defers current state to `PROJECT-STATUS.md`. |
| `PROJECT-STATUS.md` | CURRENT_WITH_MINOR_UPDATE | Header block and §CC-12 area had not been updated since before CC-12A; corrected by CC-12E (CC-12A-D + imagery-cleanup entries, new invariants 13-16, UX debt register, §CC-12E entry). |
| `CONTRIBUTING.md` | AUTHORITATIVE_CURRENT | No stale-term hits; not read in full this pass (process document, low churn). |
| `docs/START-HERE.md` | AUTHORITATIVE_CURRENT | Orientation document; authority order and reading list still accurate. |
| `docs/roadmap/ROADMAP.md` | AUTHORITATIVE_CURRENT | Phase-level sequencing only; correctly defers live state to `PROJECT-STATUS.md`. The illustrative CC-11-16 label list is explicitly non-binding ("each CC package may be subdivided further") and has long since diverged in practice — not a defect, since this document never claimed to track exact CC numbering. |
| `docs/governance/PROJECT-CONSTITUTION.md` | AUTHORITATIVE_CURRENT | Highest-authority document; no drift found against implemented architecture. |
| `docs/governance/DECISION-LOG.md` | CURRENT_WITH_MINOR_UPDATE | New 2026-08-28 row added recording the CC-12E Product Owner decisions. |
| `docs/governance/DOCUMENTATION-STANDARD.md` | AUTHORITATIVE_CURRENT | Governs this very register's format; followed, not amended. |
| `docs/governance/DECISION-STANDARD.md` | UNCLEAR_OWNERSHIP / NOT AUDITED THIS PASS | Small; no stale-term hits. |
| `docs/governance/ROLES-AND-AUTHORITY.md` | UNCLEAR_OWNERSHIP / NOT AUDITED THIS PASS | Small; no stale-term hits. |
| `docs/governance/PROJECT-PLAYBOOK.md` | UNCLEAR_OWNERSHIP / NOT AUDITED THIS PASS | Large (~80 KB); not read in full — out of proportion to this package's scope. No stale-term hits from the targeted grep. Recommend a future dedicated pass if it is still meant to be actively read. |
| `docs/architecture/ARCHITECTURE-OVERVIEW.md` | CURRENT_WITH_MINOR_UPDATE | New "Generated reports are not runtime authority" section added. |
| `docs/architecture/LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md` | CURRENT_WITH_MINOR_UPDATE | Substantially extended by CC-12E: §4 (scrolling/discoverability), §12 (completion vs mastery), new §17 (pedagogical interaction-class taxonomy), §18 (evidence context), §19 (assessment hierarchy). Still documentation-only — no implementation authorised by these additions. |
| `docs/architecture/MOBILE-ARCHITECTURE.md` | AUTHORITATIVE_CURRENT | No stale-term hits; not re-read in full this pass. |
| `docs/architecture/CC-05-PEDAGOGICAL-KNOWLEDGE-AND-QUESTION-ARCHITECTURE.md` | AUTHORITATIVE_CURRENT | No stale-term hits. Owns the assertion→capability→blueprint chain; CC-12E's new §17 taxonomy references it rather than duplicating it. |
| `docs/architecture/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md` | AUTHORITATIVE_CURRENT (governance/QA workflow scope only) | Production methodology detail now lives in `PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md` (owns current production methodology) — no conflict, no merge needed, distinct scopes. |
| `docs/architecture/PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md` | AUTHORITATIVE_CURRENT | Owns current visual-production methodology; CC-12's imagery cleanup followed it, did not amend it. |
| `docs/design/ALP-INSTRUCTIONAL-VISUAL-STYLE-GUIDE.md` | AUTHORITATIVE_CURRENT | No stale-term hits. |
| `docs/architecture/adr/ADR-0001` .. `ADR-0004` | AUTHORITATIVE_CURRENT | All four `status: accepted`; none superseded. No new ADR opened by CC-12E — see its DECISION-LOG entry for why. |
| `docs/architecture/evidence/*.md` (9 files) | SUPERSEDED_ARCHIVE/HISTORICAL | Correctly labelled evidence/proving-slice snapshots (e.g. `CC-05C-NATIVE-LEARNER-PROVING-SLICE.md` still names `RightHandGripRuleDiagram` and `/learn/[family]` as they existed *at that time* — accurate history, not current guidance; nothing currently treats them as live authority). |
| `docs/product/PRODUCT-OVERVIEW.md` | AUTHORITATIVE_CURRENT | No stale-term hits. |
| `docs/product/PRODUCT-PRINCIPLES.md` | CURRENT_WITH_MINOR_UPDATE | Three new principles (30-32) added, cross-referencing the extended Lesson Player architecture, mirroring the existing precedent set by principles 25-28. |
| `docs/product/MOBILE-UX-ENGINEERING-STANDARD.md` | AUTHORITATIVE_CURRENT | No scrolling-specific claims to correct; the scrolling/discoverability principle is owned by `LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md` per the single-owner rule, not duplicated here. |
| `docs/security/SECURITY-BASELINE.md`, `SECURITY-VERIFICATION-MATRIX.md` | AUTHORITATIVE_CURRENT | Out of this package's scope; no stale-term hits. |
| `docs/development/AI-DEVELOPMENT-PROTOCOL.md`, `DEVELOPMENT-WORKFLOW.md` | AUTHORITATIVE_CURRENT | No stale-term hits. |
| `docs/research/phase-1/PHASE-1-WP1.3-LEARNER-EVIDENCE-AND-MASTERY-ARCHITECTURE.md` | DUPLICATE_SOURCE_OF_TRUTH (flagged, not merged) | Still `APPROVED` (README's Phase 1 work list) and not contradicted by anything found. `LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md` §17/§18 (new) now also discusses evidence/interaction semantics at a more current, implementation-grounded level of detail. WP1.3 remains the foundational research-phase document (broader scope, original rationale); ARCH-003 §17/§18 is the more current, narrower elaboration for the lesson-player specifically. No conflict found — flagged so a future reader knows which to prefer for which question (lesson-player-specific interaction taxonomy → ARCH-003; the fuller original evidence/mastery research → WP1.3), not merged in this package. |
| `docs/research/phase-1/PHASE-1-WP1.4-DIAGNOSTIC-AND-REMEDIATION-ENGINE.md` | AUTHORITATIVE_CURRENT (foundational) | Still `APPROVED`; no contradiction found. Not re-read in full this pass (1,717 lines) — targeted grep found nothing stale. |
| `docs/research/phase-1/PHASE-1-WP1.1` / `WP1.2` / `WP1.5` – `WP1.9` | AUTHORITATIVE_CURRENT (foundational) | Still `APPROVED`; no stale-term hits from the targeted grep. Not re-read in full this pass. |
| `docs/research/phase-1/WP1.10-BUILD-THE-PROVING-SLICE.md` | SUPERSEDED_ARCHIVE/HISTORICAL | `ROADMAP.md` itself says WP1.10 "is subdivided into the CC implementation-package sequence" now tracked live in `PROJECT-STATUS.md` — this document is the original work-package framing, not live state. |
| `docs/research/phase-0/*.md` (7 files) | SUPERSEDED_ARCHIVE/HISTORICAL | Phase 0 market/feasibility research, concluded with a GO decision to Phase 1 (`ROADMAP.md`). Historical by design. |

## Findings requiring no action

The targeted stale-term search (old release versions as current, `/learn/[family]`, `RightHandGripRuleDiagram` as current source of truth, the disconnected artwork manifest / stale canonical-visual-registry, "no scrolling"/"one viewport" hard rules, question/assessment conflation, mandatory per-lesson exams, deprecated tooling, the old static lesson screen, the pre-rename `CANONICAL_TEACHING_VISUAL_LOCK` name) found **zero problematic hits in any Tier-1 or Tier-2 document** — every match sits inside `PROJECT-STATUS.md`'s own dated changelog or a labelled `docs/architecture/evidence/` snapshot, correctly framed as history. This repository's documentation discipline (single-owner rule, dated changelog entries, explicit historical-snapshot labelling) was already working as designed; CC-12E's job was mostly to add the missing current-state entries, not to correct false ones.
