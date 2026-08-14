---
id: GOV-DEV-002
status: approved
owner: project-architect
last_reviewed: 2026-08-14
---

# AI-Assisted Development Protocol

## Purpose

AI can create code quickly and architectural drift quickly. The objective is **high implementation velocity inside strong decision boundaries**.

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

Do not add/replace major packages, frameworks, services or build tools without task authority. Propose material dependency changes and await approval.

## Architecture deviation

If implementation contradicts accepted architecture: **STOP → identify conflict → explain impact → propose option(s) → await decision**.

## Security

Do not expose service-role secrets, rely on client-side hiding for authorisation, weaken RLS, add debug bypasses, leak stack traces/secrets or create default credentials.

## Runtime AI boundary

Initial learner runtime has no LLM dependency. Do not add model API calls to learner flows because they are convenient. AI APIs belong only to separately approved development/content tooling or a future separately approved premium tutor.

## UI implementation

Use semantic HTML first, selective official shadcn/ui primitives, project design tokens and approved accessibility/mobile rules. Do not import entire themes or generic dashboard templates.

## Completion

Return the 7-section completion report in `DEVELOPMENT-WORKFLOW.md`, then stop.

## Fresh-session behaviour

A fresh Claude session should receive the repository, `docs/START-HERE.md`, `PROJECT-STATUS.md`, current task and task-relevant docs/ADRs — not a giant copied chat transcript.
