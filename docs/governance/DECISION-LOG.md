---
id: GOV-005
status: approved
owner: product-owner
last_reviewed: 2026-08-15
---

# Decision Log

| Date | Decision | Rationale / notes |
|---|---|---|
| 2026-08-14 | Initial launch has no learner-runtime AI dependency. | AI is used for development/content production; a future AI tutor may be a separate premium feature. |
| 2026-08-14 | Use selective shadcn/ui open-code primitives for commodity UI mechanics. | Avoid rebuilding solved accessible controls while preserving project-owned learner UX/design. |
| 2026-08-14 | Replit is not part of the canonical development workflow. | Local Git + VS Code + bounded Claude Code + review provides stronger architectural control. |
| 2026-08-14 | `PROJECT-STATUS.md` is the sole authoritative home for live current state. | Prevent drift caused by multiple handover/current-state documents. |
| 2026-08-15 | Native iOS and Android are the primary learner platforms; web is secondary. | Prior documentation implicitly framed the web/Next.js client as the primary learner surface; this corrects that for all future work. Opened as CC-04M (governance/evaluation stage). The specific native technology (React Native/Expo or otherwise) is deliberately not decided here and requires its own future ADR before implementation. |
| 2026-08-15 | CC-04M formally accepts Expo + React Native (React Native New Architecture) as the native-client technology. | See [`ADR-0001`](../architecture/adr/ADR-0001-mobile-client-technology.md) (status: accepted) for the full decision, alternatives considered and rationale. Closes the deferred-technology-choice item recorded above. |
