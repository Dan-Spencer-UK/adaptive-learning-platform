---
id: PROD-ROADMAP-001
status: approved
owner: product-owner
last_reviewed: 2026-08-15
---

# Roadmap

## Purpose

This document owns **development sequence**: what must be proven in what order and what deliberately waits. It does not own live branch/commit/blocker state; see root `PROJECT-STATUS.md`.

## Master progression rule

**Prove → move on → expand → scale → refine when justified.** A successful slice is not an invitation to polish indefinitely.

## Phase 0 — Market/Product/Commercial Feasibility

Scope: market definition, learner-population research, competitors, source/IP feasibility, product/vertical scoring, pricing/unit economics and a consolidated decision/risk register. Concluding decision: GO to Phase 1 as a staged founder-funded experiment.

## Phase 1 — Architecture & End-to-End Proving Slice

Scope: work packages WP1.1–WP1.11, covering architecture/specification research through building and evaluating the end-to-end proving slice. WP1.10 (build the proving slice) is subdivided into the CC implementation-package sequence below.

Current phase, current work package and per-work-package approval status are live state and are tracked in `PROJECT-STATUS.md`, not here.

WP1.10 implementation sequence:

```text
CC-00 Repository Operating System
CC-01 Repository Foundation
CC-02 Local Supabase + Database Baseline
CC-03 Authentication + Learner Isolation
CC-04 Minimum Ohm's-Law Knowledge Graph
CC-04M Mobile-Native-First Architecture Transition (governance/evaluation; no
        native client implementation and no CC-05 work occurs inside it)
CC-05 Deterministic Calculation / Question Engine
CC-06 First Governed Lesson
CC-07 Evidence + Learner State
CC-08 Diagnostic Golden Path
CC-09 Content Admin / Governance Minimum
CC-10 AI Content Pipeline Proof — internal/development only
CC-11 Parallel Circuits Slice
CC-12 Electrical Power Slice
CC-13 Learner Home / Progress / Weak Areas
CC-14 UX / Security Hardening
CC-15 Production-Like Deployment
CC-16 Integrated Proving-Slice Evaluation
```

Each CC package may be subdivided further.

## Phase 1 exit evidence

Must demonstrate real governed knowledge/provenance; plausible content pipeline; learning from zero evidence; persistent interpretable evidence; bounded diagnosis across foundational/vocational causes; targeted remediation; transfer; deterministic no-LLM routine operation; materially better-than-question-bank UX; tested auth/isolation/security; and scale-readiness without fundamental redesign.

## Phase 2 — Expand Electrical Product

**Not yet defined in implementation detail.** If Phase 1 passes, likely direction is to expand toward commercially useful Electrical coverage, improve content-authoring throughput, broaden remediation/question coverage, prove real learner demand/usability and begin paid-user experiments. Scope must be decided from Phase 1 evidence.

## Later direction, not current scope

Broader Electrical qualifications; post-qualified electrician learning; Engineering; standalone foundational Maths where justified; Ireland/Australia/international expansion; B2B/institutional capabilities; optional premium AI tutor.

## Anti-scope-creep before Phase 1 exit

Do not build every Electrical qualification, Engineering product, full Functional Skills Maths product, native mobile app, enterprise SSO, employer HR tooling, full LMS/ePortfolio, social features, unrestricted AI tutor, proprietary content library, microservices, Kubernetes or dedicated graph DB.

## Current work

Live current task is intentionally not maintained here. See root `PROJECT-STATUS.md`.
