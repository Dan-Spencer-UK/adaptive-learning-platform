# Mismatch Register (CC-13B)

Confirmed mismatches between what a governing document/prior commit claims and what direct code/content inspection actually shows. This is narrower than the bypass/duplicate registers — it specifically catches places where trusting the documentation alone would have led this audit to a wrong conclusion, which is exactly why the audit's core principle insists on tracing real code/content rather than inferring from docs.

## MM-1: `PROJECT-STATUS.md` §CC-13A point 7 overstates what changed in `select-next-activity.ts`

**Claim**: *"`packages/learning-engine/src/assembler.ts` and `branching.ts`, and `packages/diagnostic-engine/src/select-next-activity.ts` each gained a header-comment addendum stating the ADR-0006 status verbatim and explaining mechanically why the code is safe as-is (`decideStep` degenerates to unconditional inclusion for a `CANONICAL_FIXED_ROUTE` lesson because such a lesson's schema forbids conditional steps)."*

**Reality**: accurate for `assembler.ts`/`branching.ts` (verified verbatim). `select-next-activity.ts`'s header addendum discusses ADR-0006/CC-13A status in different terms (course-level next-activity selection is not the V1 path) and contains **zero** occurrences of `decideStep`, `degenerat`, `CANONICAL_FIXED_ROUTE`, or `routePolicy` — unsurprising, since this file has no `decideStep`-equivalent function to degenerate, but the sentence as written, read literally, claims all three files contain the same specific reasoning, and only two do.

**Impact**: low — the underlying "safe as-is" conclusion for `select-next-activity.ts` is not disproven (it genuinely has no step-level entry point that could touch a `CANONICAL_FIXED_ROUTE` lesson's route), but a reader trusting the sentence literally would misdescribe that file's own content if asked to quote it. Severity: **P2**. Fix: HUMAN-REVIEW-REQUIRED (one-sentence PROJECT-STATUS.md correction, out of this audit's own scope to make).

## MM-2: the documented "authoritative" visual artwork manifest does not exist in the repository

**Claim**: `apps/mobile/src/assets/instructional/unit202/README.md` calls `reports/instructional-visuals/premium-artwork/unit202-artwork-manifest.json` authoritative; `tools/visual-production-studio/paths.ts`'s `MANIFEST_PATH` and `approval.ts` both write to it as though it is the durable record.

**Reality**: this file does not exist on disk in the committed repository and does not exist anywhere in `git log --all` history (`git ls-tree HEAD reports/instructional-visuals/premium-artwork/` shows only a `proof/` subtree). It appears only as prose inside a CC-12C commit message describing it as stale/frozen/disconnected/never-audited — i.e. its own unreliability was already known and documented in a commit message, but the README/`paths.ts` documentation pointing to it as authoritative was never updated to reflect that. *(Note: an untracked copy of this filename was present on disk in this session's initial `git status` snapshot, per the environment context, but it is not part of any governed/committed chain and this audit did not read or rely on it.)*

**Impact**: a fresh engineer following the README/`paths.ts` documentation would look for the wrong file and might not discover that `CANONICAL_ASSET_LOCK` (`DiagramRenderer.tsx`) is the real, currently-live mechanism. Severity: **P2**. Fix: HUMAN-REVIEW-REQUIRED (doc correction — point at `CANONICAL_ASSET_LOCK` instead, or resurrect the manifest as a genuine, mechanically-generated artefact).

## MM-3: `LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md` §2 describes a `LessonStoryboard.syllabusNodeIds` field that has no real schema equivalent

**Claim**: the governance-contracts document's conceptual `LessonStoryboard` interface (§2) includes `syllabusNodeIds: string[]`.

**Reality**: the real `lessonPlanSchema` (`packages/content-schema/src/lesson-plan.ts`) has no field of that name. The closest real analogues are `targetAssertionFamilyIds`/`targetAssertionIdentifiers`/`prerequisiteKnowledge`, which predate CC-13A and are not the new governance-contract shape.

**Impact**: minor — the governance-contracts document is explicitly described as "conceptual TypeScript shapes; the Implementation Engineer must map them onto existing schemas rather than duplicating equivalent types" (its own header), so this is arguably within its documented latitude. But it means the contract-adoption matrix cannot literally test `syllabusNodeIds` adoption as named — this audit tested the real analogue fields instead and noted the gap explicitly (`LESSON-DEPTH-AND-FRAGMENTATION-REGISTER.md` §6). Severity: **P2**. Fix: HUMAN-REVIEW-REQUIRED (either add the field for real, or update the governance-contracts doc to name the real field it maps to).

## MM-4: `npm run v1-package:report`'s "PASS" reads as a stronger claim than it is

**Claim**: the script's own output literally prints `PASS: all V1 learning-package governance gates are zero.`

**Reality**: every gate is zero because nothing has adopted the fields being checked (0/24 lessons, 0/114 blueprints — see `CONTRACT-ADOPTION-MATRIX.md`), not because real adopted content has been proven correct against the gates. This is a **vacuous pass**, correctly computed, but easy to misread as "the V1 pipeline is validated" if quoted out of context.

**Impact**: real risk of misinterpretation in future status reporting (exactly the class of error `PROJECT-STATUS.md`'s own history shows this team is alert to — see the CC-12E.1 "false-green Tier-1 currency conclusion" fix referenced in this repo's git log). Severity: **P1** (interpretation risk, not a code defect). Fix: HUMAN-REVIEW-REQUIRED — this audit's own `PROJECT-STATUS.md` §CC-13B entry deliberately states the honest baseline rather than characterising this PASS as validating readiness; recommend the script itself eventually prints an explicit "N/A — 0 applicable objects" distinction from a genuine zero-defects-found-against-real-content result.

## MM-5: `unit202-canonical-visual-registry.json`'s own generator documents a known, unreconciled duplicate authority

**Claim (implicit, from the file's role)**: this registry is presented as the CC-11.11 "shipment-candidate" source of truth for which visual assets are ready.

**Reality**: the generator script's own comment (`tools/visual-production-studio/generate-canonical-visual-registry.ts:17-19`) states verbatim that it deliberately does not touch `unit202-artwork-manifest.json`, "a pre-existing file of unclear provenance." This is not a hidden mismatch — it is a self-documented one — but it means the repository currently contains a written acknowledgment that two competing visual-authority files exist, with no plan recorded anywhere for reconciling them.

**Impact**: this is really a duplicate-source-of-truth finding rather than a doc-vs-reality mismatch per se; cross-referenced here because the comment itself is the clearest single piece of evidence for `DUPLICATE-SOURCE-OF-TRUTH-REGISTER.md` DUP-1. Severity: **P0** (tracked under DUP-1, not double-counted here). Fix: see `DUPLICATE-SOURCE-OF-TRUTH-REGISTER.md`.

## Severity summary

| ID | Finding | Severity | Fix type |
|---|---|---|---|
| MM-1 | PROJECT-STATUS.md overstates `select-next-activity.ts` header content | P2 | HUMAN-REVIEW-REQUIRED |
| MM-2 | Documented "authoritative" visual manifest doesn't exist in the repo | P2 | HUMAN-REVIEW-REQUIRED |
| MM-3 | Governance-contracts doc names a field with no real schema equivalent | P2 | HUMAN-REVIEW-REQUIRED |
| MM-4 | `v1-package:report` PASS is vacuous, risk of misreading as readiness proof | P1 | HUMAN-REVIEW-REQUIRED |
| MM-5 | Self-documented unreconciled duplicate visual-authority file (see DUP-1) | P0 (tracked under DUP-1) | see `DUPLICATE-SOURCE-OF-TRUTH-REGISTER.md` |
