# Contributing

This repository is currently a founder-led, AI-assisted commercial product project. This file defines how any human developer or AI coding agent works in it.

## Before changing anything

Read:

1. `docs/START-HERE.md`
2. `PROJECT-STATUS.md`
3. the current task brief and only the task-relevant authoritative documents it identifies.

Then verify repository path, branch, HEAD, remote alignment where available, working-tree status and relevant tests. If repository state materially disagrees with the task brief or `PROJECT-STATUS.md`, stop and report it.

## Scope rule

Work only on the authorised task. Do not begin the next task automatically, perform unrelated refactors, introduce major dependencies casually, silently replace approved architecture, weaken tests, populate deferred functionality or edit unrelated documentation for style.

## Architecture changes

If implementation reveals that approved architecture appears unsuitable, do not silently work around it. Describe the conflict, proposed alternative and consequences, then stop where a material decision is required. Expensive-to-reverse changes require an ADR.

## Tests

A change is not complete merely because it runs locally. Applicable tests must be added or updated. Security boundaries, deterministic learning logic and learner-state transitions require explicit tests.

## Documentation impact

At the end of every material task ask: **Did this change make an authoritative or live-state document inaccurate?** Update the owning document when necessary. Do not duplicate live state outside `PROJECT-STATUS.md`.

## Commit rule

Claude Code may recommend a commit message but must not stage, commit or push unless explicitly instructed after review/approval.

## Completion report

Every implementation task ends with the canonical completion-report format defined in `docs/development/DEVELOPMENT-WORKFLOW.md`, then stop.
