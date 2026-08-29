---
id: GOV-DEV-001
status: approved
owner: project-architect
last_reviewed: 2026-08-17
---

# Development Workflow

## Objective

Enable founder-led AI-assisted development to move quickly **without losing architectural control**.

## Risk-proportionate governance (change classes)

> Heavy governance for product/architecture decisions. Moderate governance for substantive feature implementation. Lightweight governance for routine maintenance and direct mechanical consequences of already-approved work.

Every change falls into exactly one of three classes. The class determines how much of the workflow below applies — it does not remove the safeguards against architectural drift, security mistakes, hidden scope expansion or AI-assisted-development inconsistency; it scales *ceremony* to *risk*.

**Class A — Architecture / product / high-risk.** Product philosophy or behaviour, fundamental UX model, architecture, security model/trust boundary, data model with meaningful migration implications, learner-runtime behaviour, diagnostic/adaptive model, knowledge architecture, authentication model, a new external service/provider, an accepted security risk, scope expansion, or an irreversible/expensive technical decision. Runs the **full** 14-step "Normal workflow" below: explicit approval before implementation, durable architecture documentation, bounded package, full validation, review, CI green, explicit closeout.

**Class B — Substantive feature / behavioural implementation.** Implementing already-approved architecture, meaningful new learner functionality, lesson-engine behaviour, a new governed content pipeline, a new user workflow, meaningful component/system integration — anything that changes observable behaviour without reopening architecture. Runs within an approved bounded brief; Claude does not re-ask permission for every internal implementation choice inside that boundary. Targeted tests plus the relevant broader validation, one coherent implementation commit where practical, CI, review, and a status update proportionate to the package's significance — not a fresh Class-A-style closeout ceremony for work that was already scoped.

**Class C — Routine maintenance / direct mechanical follow-on.** Patch-level dependency alignment within an already-approved SDK/version line, formatting, typo/docs correction, updating generated output, deterministic metadata synchronisation, test-timing hardening after diagnosis, a lockfile refresh caused by an approved package patch, an exact dependency-path metadata update caused directly by an approved dependency change, a narrow test-fixture correction, or another low-risk change that does not alter product behaviour, architecture, accepted security scope, data semantics or public contracts. Claude may handle these autonomously: diagnose/verify → smallest defensible change → proportionate targeted validation (not the full suite by default — run what the changed risk surface actually calls for) → one coherent commit → normal CI as the broader regression gate → report what changed. No Product Owner interruption is needed for each one.

**Direct-mechanical-consequence rule**: Claude may autonomously make narrow mechanical corrections that are a direct consequence of an already-approved change, provided they do not alter product behaviour, architecture, security scope, accepted risk, data semantics, or externally observable contracts. Example: an approved Expo patch bump (57.0.13→57.0.14) mechanically shifts the exact dependency path recorded in an already-accepted security exception; updating that path string is Class C. A patch that introduces a *new* advisory, or requires *widening* accepted-risk scope, is not mechanical and escalates to Class A.

**Escalation**: if a Class C task unexpectedly touches product behaviour, architecture, security-scope expansion, new-vulnerability acceptance, a data-model change, a destructive action, a materially wider dependency upgrade, a new external service, or unresolved ambiguity with meaningful consequences — stop and escalate to Class A/B rather than continuing autonomously.

**CI**: push, record/find the CI run, continue independent local/documentation work that doesn't depend on the result, check CI before any action that *does* depend on it. Bounded waiting is fine when the next step genuinely needs the result; indefinite polling loops are not. If CI hasn't completed within a bounded check, report the run ID/state and stop or continue only independent work. A red CI must still be investigated — this principle is never licence to ignore a failing gate. A package is not formally complete until its required CI is green.

**Commits**: prefer one coherent commit for a bounded change and its directly associated documentation. Separate commits remain appropriate when an architecture decision and its implementation should be independently reviewable, unrelated maintenance surfaces mid-task, security/governance history materially benefits from a distinct record, the work packages are genuinely distinct, or rollback boundaries matter — not merely to give every package its own commit/CI/commit/CI cycle by default. A `PROJECT-STATUS.md` update can ride in the same commit as the package it describes rather than forcing its own cycle.

**One-package-at-a-time, interpreted sensibly**: this still prevents genuinely unrelated substantive feature work from drifting into an unapproved package. It does not mean small maintenance needed to unblock the current package becomes a new major work package of its own — a direct mechanical follow-on stays part of the current maintenance context.

**Reporting**: proportional to the work. Class C reports what changed, why, the targeted validation run, commit SHA, and CI result/status — not a 15-20 item completion report. Class A/B retain the full completion report below and, for Class A, may retain a detailed acceptance write-up.

This section does not weaken: Product Owner authority over product direction; Project Architect authority over architecture; the no-learner-runtime-LLM rule; mobile-native-first direction; security boundary controls; the prohibition on silently accepting new HIGH/CRITICAL findings; time-bounded security exceptions; deterministic learner-runtime requirements; the governed knowledge/content architecture; CI as a required completion gate for substantive code changes; truthful distinction between implemented/tested/not-run/deferred; working-tree/repository hygiene; or protection against scope drift. Those remain in force at every class.

## Normal workflow

The full sequence below is the Class A model. Class B runs it within an already-approved bounded brief (steps 2-3 are the brief itself, not repeated per internal choice). Class C compresses it to diagnose → smallest defensible change → proportionate validation → commit → normal CI → report, per the change-classes section above.

```text
1. Product/research decision
2. Project Architect defines bounded task
3. Product Owner approves direction
4. Implementation Engineer verifies repository state
5. Implementation
6. Tests / validation
7. Documentation-impact review
8. Completion report
9. Project Architect review
10. Product Owner APPROVE / APPROVE WITH COMMENTS / REJECT
11. Stage / commit / push when authorised
12. Verify repository checkpoint
13. Update PROJECT-STATUS
14. Begin next approved task
```

## Repository verification before work

Every implementation task begins by reporting repository path, branch, HEAD, remote status, working-tree status, current task and relevant test state. Unexpected/unreviewed changes stop the task before editing.

## One bounded task at a time

A task defines: objective, authoritative documents, in-scope files/modules, out-of-scope areas, required behaviour, security constraints, tests, documentation impact, acceptance criteria and evidence to return.

Never issue or act on a broad instruction such as "continue building the platform."

## Vertical slices

Prefer thin end-to-end slices over constructing whole infrastructure layers. A slice should prove something observable or testable.

**Learning-package reset correction (ADR-0005, CC-13A):** "thin end-to-end slice" must never be read as "a downstream layer (e.g. runtime) succeeding while an upstream layer (curriculum, pedagogy, visual planning) remains incomplete." A vertical slice builds through every applicable gate in [`docs/governance/LEARNING-PACKAGE-QUALITY-GATES.md`](../governance/LEARNING-PACKAGE-QUALITY-GATES.md), not merely to the first gate that happens to be convenient to satisfy. No feature package may create a production path around an unmet curriculum, visual, or pedagogy contract merely because the runtime happens to render successfully — runtime PASS is one gate among several, not a substitute for the others. Before accepting a local fix, audit which upstream and downstream contracts it touches; a fix that satisfies its own layer while silently breaking an upstream contract's assumption is not complete.

**V1 content-production discipline (ADR-0006):** V1 content production optimises for one excellent canonical lesson route per ordinary lesson. Do not multiply lesson branches/variants (adaptive remediation copies, mastery-conditional steps) until the core V1 loop — canonical lesson → dedicated formative/mock assessment → explicit submission → Guided Revision — is proven end-to-end. The formative/mock assessment + submit + Guided Revision loop is itself a required V1 product vertical, not an optional enhancement layered on afterward; see [`docs/architecture/V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md`](../architecture/V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md).

## Scope change

If completion requires material scope expansion, stop, explain why, propose the smallest change and identify affected decisions/docs. Do not expand silently.

## Dependency changes

Adding a material dependency requires a concrete reason and review of maintenance/security/licence/lock-in implications. Do not add packages to shorten trivial code.

## Testing

Tests are evidence. Priority areas include deterministic calculations, variant invariants, learner-state transitions, diagnostic branching, RLS/security boundaries, publication gates, critical learner journeys and accessibility.

## Documentation impact

After implementation ask whether product truth, architecture, durable decisions, security requirements, roadmap sequence or live current state changed. Update only owning documents. `PROJECT-STATUS.md` owns live state.

## Completion report

For Class A/B work, return exactly:

1. What changed
2. Files changed
3. Tests / validation
4. Acceptance criteria
5. Deviations / assumptions
6. Risks / debt / unresolved issues
7. Recommended commit message

Then stop. For Class C, report proportionally instead — see "Risk-proportionate governance" above.

## Commit checkpoint

Stage intended files, commit coherently, push the intended branch, confirm local/remote alignment where possible and confirm a clean working tree. This clean checkpoint is the durable handover boundary. Class A/B commits are made when authorised per the Normal workflow above; Class C commits proceed as part of the autonomous maintenance flow in "Risk-proportionate governance." Prefer one coherent commit per bounded change over a mechanical commit/CI cycle per file — see that section for when separate commits remain appropriate.

## Anti-drift rule

**Prove → move on → expand → scale → refine when justified.** Further refinement needs a defect, UX/security/correctness issue, scale blocker, downstream dependency or Product Owner priority change — not merely "could be improved."

## Stop rule

Claude Code does not automatically begin the next work package. Every task ends at review. This governs *packages*, not the direct mechanical follow-ons described in "Risk-proportionate governance" above, which remain part of the current maintenance context rather than a new package.
