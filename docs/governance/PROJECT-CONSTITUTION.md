---
id: GOV-001
status: approved
owner: product-owner
last_reviewed: 2026-08-15
---

# Project Constitution

## Constitutional role

This is the highest internal product-governance document for the Adaptive Learning Platform. A lower-authority document or implementation detail must not silently override it.

## Vision

Build a class-leading adaptive vocational-learning platform that helps learners both **pass assessments efficiently** and **understand underlying knowledge deeply**. Where evidence supports it, identify the likely reason behind an error, provide proportionate teaching and verify transfer back into vocational context.

## Initial market and domains

Initial market: United Kingdom. First full vocational vertical: Electrical. First reusable horizontal domains: Foundational Maths and Foundational Physics. Later expansion must reuse proven architecture rather than prematurely generalising the first product.

## Learning is first-class

Learning does not need to begin with assessment. Learners must be able to select qualification, unit and lesson and work systematically through supported curricula. Assessment-led adaptation, direct learning, weak-area repair, quick revision and mock/exam practice are entry routes into the same governed learning system.

## Core teaching loop

```text
explain
→ demonstrate
→ guided practice
→ independent check
→ diagnose/remediate where useful
→ foundational retest
→ vocational transfer
→ update learner state
→ later retrieval
```

## Learner intent

The same platform must support learners who want fast confirmation, exam preparation, weakness diagnosis, teaching or deeper mastery. Diagnostic depth and displayed feedback depth are separate. A learner asking for less explanation must not receive poorer evidence modelling or be punished for that preference.

## Knowledge principle

The durable knowledge asset is a governed system of source → exact version → precise locator → independently expressed assertion/capability → relationships/prerequisites → curriculum mappings → misconceptions → evidence → lessons/questions/remediation.

Assertions are optimised for governance, evidence, reuse and diagnosis. Lessons are coherent instructional units built from assertion families.

## Provenance and source integrity

Material governed knowledge must remain traceable to source evidence. Authority, rights, version and locator must be represented explicitly. Proprietary sources may inform development where lawfully accessed and permitted, but do not automatically become production learner assets. Do not reproduce protected wording, tables, figures or distinctive structure merely because a source was available in development.

## AI principle

Initial learner runtime has **no AI dependency**. Core teaching, question generation, marking, evidence, learner-state updates, diagnosis, remediation and progression are deterministic/governed. AI may be used extensively for development and content production/verification. A future AI tutor may be a separate higher-tier feature but must not become the source of truth or canonical marking/mastery/diagnostic engine.

## Product quality principle

Backend sophistication is insufficient. The learner product must be class-leading within the narrow supported scope. Native mobile UX, accessibility, clear navigation, preserved context and fast deterministic interaction are release concerns, not later polish.

## Client platform principle

Native iOS and Android are the primary learner platforms; web is secondary. The product must not be architected as a wrapped responsive website. Shared business/domain logic must remain platform-independent so any client consumes the same governed services. The specific native client technology is not fixed by this document and requires an accepted ADR before implementation.

## Practical competence boundary

The platform may teach knowledge/reasoning and prepare learners for practical assessment. It must not claim that digital questions alone verify observed practical competence.

## Security principle

Security is part of architecture from the first slice: deny by default, least privilege, server-side authorisation, RLS where applicable, secret separation, input validation, rate/resource limits, safe errors, audit/security logging, reproducible migrations/deployment and tested recovery before meaningful scale.

## Scalability principle

Design for substantial growth without premature distributed-system complexity. Prefer a modular monolith, relational database, bounded queries and queues only when needed. Do not introduce microservices, Kubernetes or dedicated graph databases without measured need.

## Commercial principle

The project is bootstrapped. Founder time and AI-assisted development substitute for market-rate development expenditure during proving stages. Keep cash expenditure constrained before revenue. Prove willingness to pay and content-production economics rather than assuming educational sophistication creates demand.

## Evidence over appearance

A plausible diagnosis is not enough. A confidence score is not evidence. Preserve uncertainty and distinguish direct evidence, inferred evidence, misconception evidence, strategy evidence and inconclusive evidence.

## Incremental proof principle

Development progression is **prove → move on → expand → scale → refine when justified**. "Could be improved" is not by itself a reason to delay the next proof.

## Repository memory principle

The Git repository and approved documentation are durable project memory. Material decisions must not exist only in chat. `PROJECT-STATUS.md` is the sole authoritative home for current task, blockers and next task.

## Final authority

The Product Owner retains final authority over product vision, scope, commercial priorities, acceptable trade-offs, phase progression, risk acceptance and approval/rejection of material changes. The Product Owner is not required to design each technical mechanism personally.
