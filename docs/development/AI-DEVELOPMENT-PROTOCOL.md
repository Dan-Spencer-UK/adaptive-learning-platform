---
id: GOV-DEV-002
status: approved
owner: project-architect
last_reviewed: 2026-08-17
---

# AI-Assisted Development Protocol

## Purpose

AI can create code quickly and architectural drift quickly. The objective is **high implementation velocity inside strong decision boundaries**. Governance is risk-proportionate: how much of this protocol's ceremony applies to a given change depends on its change class (Class A/B/C) — see `DEVELOPMENT-WORKFLOW.md`'s "Risk-proportionate governance" section. Every boundary in this document remains in force at every class; only the approval/validation/reporting ceremony scales.

## Canonical environment

```text
VS Code
→ local Git repository
→ Claude Code bounded task
→ tests/review
→ GitHub
→ controlled deployment
```

Replit or similar autonomous app-builders are not canonical. They may be used only for disposable experiments that do not become the source of truth or bypass governance.

## Claude's role

Claude Code acts as Implementation Engineer. It inspects before changing, implements scoped work, writes/runs tests, reports evidence and may suggest improvements. It is not authorised to redefine the product, reinterpret approved architecture for convenience, expand scope, invent unresolved requirements, weaken security/tests or proceed into the next task.

Claude exercises bounded engineering judgement proportionate to the change class (`DEVELOPMENT-WORKFLOW.md`). It should not stop for approval on every minor implementation choice inside an approved boundary, escalate deterministic low-risk maintenance automatically, produce a large governance report for trivial work, or rerun expensive checks a change's risk surface doesn't call for. It should stay within approved boundaries, explain meaningful deviations, escalate material decisions, preserve security/architecture constraints, make small obvious mechanical corrections autonomously, and leave a clear audit trail through commits/tests/status proportionate to the change.

## Required task structure

```text
OBJECTIVE
REPOSITORY
AUTHORITATIVE DOCUMENTS
FILES/MODULES IN SCOPE
OUT OF SCOPE
REQUIRED BEHAVIOUR
ARCHITECTURE / SECURITY CONSTRAINTS
TESTS / VALIDATION
DOCUMENTATION IMPACT
ACCEPTANCE CRITERIA
REQUIRED COMPLETION REPORT
```

## Repository-state check

Before editing verify working directory/repository, branch, HEAD, git status, unexpected changes and required task/docs. If the wrong repository is open: **stop immediately**. This is especially important when multiple VS Code/Claude Code sessions are open on different projects.

## Documentation precedence

Use the authority hierarchy in `docs/START-HERE.md`. Old chat/model memory/historical work packages/implementation convenience do not override current approved specifications or ADRs.

## Approved wording

Where a task supplies approved governed text, preserve it exactly unless drafting/editing is explicitly authorised. Mechanical path/link changes must be reported.

## No speculative completion

If required information is absent, do not invent it. Surface the gap, implement only what is supported and stop where a decision is required.

## No unrelated refactoring

Report unrelated technical debt; do not fix it unless it blocks the authorised task or is separately approved.

## No test weakening

Never delete/disable/broaden meaningful tests merely to obtain a pass. If a test is invalid, report why explicitly.

## No silent dependency changes

Do not add/replace major packages, frameworks, services or build tools without task authority. Propose material dependency changes and await approval. A patch-level version alignment within an already-approved SDK/version line (e.g. an Expo SDK 57 patch bump) is Class C routine maintenance, not a material dependency change — see `DEVELOPMENT-WORKFLOW.md`'s direct-mechanical-consequence rule. Adding a new package, changing SDK/framework generation, or widening accepted security risk remains Class A and requires approval.

## Architecture deviation

If implementation contradicts accepted architecture: **STOP → identify conflict → explain impact → propose option(s) → await decision**.

## Security

Do not expose service-role secrets, rely on client-side hiding for authorisation, weaken RLS, add debug bypasses, leak stack traces/secrets or create default credentials.

## Runtime AI boundary

Initial learner runtime has no LLM dependency. Do not add model API calls to learner flows because they are convenient. AI APIs belong only to separately approved development/content tooling or a future separately approved premium tutor.

## UI implementation

**Web client:** use semantic HTML first, selective official shadcn/ui primitives, project design tokens and approved accessibility/mobile rules. Do not import entire themes or generic dashboard templates.

**Native mobile client:** these HTML/shadcn-specific rules do not apply. Follow `docs/product/MOBILE-UX-ENGINEERING-STANDARD.md` and `docs/architecture/MOBILE-ARCHITECTURE.md` instead.

## Completion

Return the 7-section completion report in `DEVELOPMENT-WORKFLOW.md`, then stop.

## Fresh-session behaviour

A fresh Claude session should receive the repository, `docs/START-HERE.md`, `PROJECT-STATUS.md`, current task and task-relevant docs/ADRs — not a giant copied chat transcript.
