# Adaptive Learning Platform

A governed adaptive vocational-learning platform designed to identify not only **what** a learner gets wrong, but **why**, then teach the smallest useful missing foundation and verify transfer back into the vocational context.

Initial market: **UK vocational education**. First full vertical: **Electrical**. Reusable horizontal domains begin with **Foundational Maths** and **Foundational Physics**.

The initial learner product has **no runtime AI dependency**. Teaching, question generation, marking, evidence updates, diagnosis, remediation, retesting and progression are deterministic and governed. AI is used for development and content production/verification. A future premium AI tutor may be added without becoming the core marking/mastery/diagnostic engine.

## Current state

See [`PROJECT-STATUS.md`](PROJECT-STATUS.md). It is the sole authoritative home for the current task, blockers and exact next task.

## Start here

A new human developer or AI coding agent should read:

1. [`docs/START-HERE.md`](docs/START-HERE.md)
2. [`PROJECT-STATUS.md`](PROJECT-STATUS.md)
3. only the task-relevant authoritative documents identified there.

Do not reconstruct product intent from chat history.

## Core product loop

```text
teach or assess
→ collect evidence
→ update learner state
→ identify weakness
→ infer likely root cause where evidence supports it
→ targeted remediation
→ foundational retest
→ vocational transfer retest
→ update mastery/readiness
→ choose next useful activity
→ later spaced retrieval
```

Learning does not have to begin with assessment. A learner may select qualification → unit → lesson and work systematically through the syllabus.

## Initial proving slice

The first implementation proves the architecture through a deliberately narrow Electrical/Foundational Maths/Foundational Physics proving slice rather than broad content coverage. See [`PROJECT-STATUS.md`](PROJECT-STATUS.md) for the current proving-slice content and diagnostic golden path.

## Technical baseline

The platform is built on the approved TypeScript/Next.js/Supabase stack, with a deterministic, no-runtime-AI learner engine. The full technical baseline — languages, frameworks, hosting, testing tools and internal package structure — is owned by [`docs/architecture/ARCHITECTURE-OVERVIEW.md`](docs/architecture/ARCHITECTURE-OVERVIEW.md); this README does not maintain an independent copy.

## Development model

```text
Product Owner decision
→ Project Architect specification/task
→ Claude Code bounded implementation
→ tests and evidence
→ Project Architect review
→ Product Owner approval/rejection
→ commit/push
→ PROJECT-STATUS update
→ next task
```

Claude Code does not independently expand scope or redesign approved architecture.

## Repository as project memory

The Git repository and its approved documentation are the durable project memory. Chat history, model memory and informal summaries are not authoritative.
