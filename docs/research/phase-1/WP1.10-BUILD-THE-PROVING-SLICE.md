# WP1.10 — Build the Proving Slice

**Status:** Active  
**First implementation package:** CC-00 — Repository Operating System  
**Next implementation package:** CC-01 — Repository Foundation

`docs/roadmap/ROADMAP.md` owns current development sequence. If sequencing changes later, ROADMAP.md is authoritative and this document should be read as historical context, not a live override.

## Governing rule

WP1.10 is not one coding task.

It is implemented through bounded, reviewable Claude Code packages.

Workflow:

```text
scope
→ Product Owner approval
→ Claude implementation
→ automated tests
→ evidence
→ ChatGPT review
→ Product Owner accept/reject
→ commit
→ PROJECT-STATUS update
→ next package
```

## Planned implementation packages

1. CC-00 — Repository Operating System
2. CC-01 — Repository Foundation
3. CC-02 — Local Supabase + Database Baseline
4. CC-03 — Authentication + Learner Isolation
5. CC-04 — Minimum Ohm's-Law Knowledge Graph
6. CC-05 — Deterministic Calculation/Question Engine
7. CC-06 — First Governed Lesson
8. CC-07 — Evidence + Learner State
9. CC-08 — Diagnostic Golden Path
10. CC-09 — Content Admin/Governance Minimum
11. CC-10 — AI Content Pipeline Proof (internal/development only)
12. CC-11 — Parallel Circuits Slice
13. CC-12 — Electrical Power Slice
14. CC-13 — Learner Home/Progress/Weak Areas
15. CC-14 — UX/Security Hardening
16. CC-15 — Production-Like Deployment
17. CC-16 — Integrated Proving-Slice Evaluation

Each package may be subdivided further before implementation.
