---
id: GOV-DEV-001
status: approved
owner: project-architect
last_reviewed: 2026-08-14
---

# Development Workflow

## Objective

Enable founder-led AI-assisted development to move quickly **without losing architectural control**.

## Normal workflow

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

## Scope change

If completion requires material scope expansion, stop, explain why, propose the smallest change and identify affected decisions/docs. Do not expand silently.

## Dependency changes

Adding a material dependency requires a concrete reason and review of maintenance/security/licence/lock-in implications. Do not add packages to shorten trivial code.

## Testing

Tests are evidence. Priority areas include deterministic calculations, variant invariants, learner-state transitions, diagnostic branching, RLS/security boundaries, publication gates, critical learner journeys and accessibility.

## Documentation impact

After implementation ask whether product truth, architecture, durable decisions, security requirements, roadmap sequence or live current state changed. Update only owning documents. `PROJECT-STATUS.md` owns live state.

## Completion report

Return exactly:

1. What changed
2. Files changed
3. Tests / validation
4. Acceptance criteria
5. Deviations / assumptions
6. Risks / debt / unresolved issues
7. Recommended commit message

Then stop.

## Commit checkpoint

When authorised: stage intended files, commit coherently, push intended branch, confirm local/remote alignment where possible and confirm a clean working tree. This clean checkpoint is the durable handover boundary.

## Anti-drift rule

**Prove → move on → expand → scale → refine when justified.** Further refinement needs a defect, UX/security/correctness issue, scale blocker, downstream dependency or Product Owner priority change — not merely "could be improved."

## Stop rule

Claude Code does not automatically begin the next work package. Every task ends at review.
