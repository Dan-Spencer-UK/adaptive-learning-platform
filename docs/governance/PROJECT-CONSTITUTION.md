---
id: GOV-001
status: approved
owner: product-owner
last_reviewed: 2026-08-30
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

Governed knowledge is optimised for governance, evidence, reuse and diagnosis. A canonical lesson draws on the governed knowledge required by its package's learning-purpose/depth definition and required learner performance. The concrete future knowledge decomposition (whether, and in what shape, knowledge is grouped for teaching) is not fixed here.

Required learning depth is not an inherent property of an assertion or fact — different learning packages may use the same governed knowledge at different depths and for different purposes. Every unit/package must therefore have an explicit learning-purpose/depth definition before lesson authoring, conceptually establishing, where relevant: purpose; target learner; assumed prior knowledge; intended learner end state; scope authority; required conceptual depth; required application/performance depth; recognition/visual depth; calculation/procedural depth; safety/consequence depth; assessment purpose; and the practical/competence boundary. Core rule: **knowledge is reusable; learning purpose, depth and pedagogy are contextual.** This document does not fix the final schema or field names for that definition — see [`docs/architecture/SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md`](../architecture/SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md) §1.1.

## Learning-support and from-scratch package principle

ALP must support both learning-support/exam-preparation packages and from-scratch initial-training packages as configurations of one production architecture, never as separate platform architectures. For City & Guilds Unit 202, ALP is primarily a learning-support and exam-preparation product used alongside college tuition, which remains responsible for full qualification delivery and practical competence; target depth is the minimum conceptual depth that makes the examinable requirement reliably understandable, transferable and assessable — never the shortest answer satisfying an Assessment Criterion, and never a reproduction of every hour of college tuition. A from-scratch package (for example, a future pharmacy OTC initial-training package) may legitimately assume near-zero prior knowledge and must provide sufficient explanatory scaffolding and guided application to reach its defined end state unaided. A refresher package may reuse the same governed knowledge while assuming greater prior knowledge and using more retrieval/application-focused pedagogy. Full detail: [`docs/architecture/SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md`](../architecture/SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md) §3.5.

## Provenance and source integrity

Material governed knowledge must remain traceable to source evidence. Authority, rights, version and locator must be represented explicitly. Proprietary sources may inform development where lawfully accessed and permitted, but do not automatically become production learner assets. Do not reproduce protected wording, tables, figures or distinctive structure merely because a source was available in development.

## AI principle

Initial learner runtime has **no AI dependency**. Core teaching, question generation, marking, evidence, learner-state updates, diagnosis, remediation and progression are deterministic/governed. AI may be used extensively for development and content production/verification. A future AI tutor may be a separate higher-tier feature but must not become the source of truth or canonical marking/mastery/diagnostic engine.

## Product quality principle

Backend sophistication is insufficient. The learner product must be class-leading within the narrow supported scope. Native mobile UX, accessibility, clear navigation, preserved context and fast deterministic interaction are release concerns, not later polish.

## Learning-quality governance principle

The ALP must be governed for best-in-class learning quality, not merely technical correctness. Implementation correctness and product/learning quality are two separate acceptance questions, and passing the first never implies passing the second: a package may satisfy every agreed schema, validator and test and still be an inferior piece of instructional design — that outcome is a rejection, not a pass, regardless of how green the automated evidence is. Claude Code, as Implementation Engineer, is not the final authority on implementation correctness, product architecture, instructional design, pedagogy, storyboard quality, assessment design, visual pedagogy or learner experience: Claude produces implementation evidence (tests, validators, production/runtime traces) and may report its own technical conclusion, but cannot self-approve that the evidence actually satisfies the approved architecture. The Project Architect independently reviews both whether that evidence is sufficient and whether the design itself is good enough, and the Product Owner retains final approval. Full authority split: [`docs/governance/ROLES-AND-AUTHORITY.md`](ROLES-AND-AUTHORITY.md). Full quality gates and the representative real-lesson qualification gate that must pass before systematic content rebuilding: [`docs/governance/LEARNING-PACKAGE-QUALITY-GATES.md`](LEARNING-PACKAGE-QUALITY-GATES.md). Existing downstream artefacts — including existing Unit 202 content, prior implementation choices and the current governed knowledge corpus — do not gain architectural authority merely because they already exist; they may inform diagnosis but must not constrain the best available design merely to preserve prior work.

## Multimodal teaching principle

ALP teaching must be deliberately visually rich and multimodal: this is a product/learning architecture requirement, not optional polish. The target is not "learn by pictures" and not an arbitrary image quota — it is that each lesson uses the most effective governed representation for the knowledge being taught, including where appropriate explanatory prose, annotated diagrams, technical illustrations, physical/component imagery, symbols and schematics, comparison views, process/state sequences, direction/topology visuals, worked examples, equations/formulae, tables, progressive reveals, interaction/retrieval, or another governed representation that materially improves comprehension. The governing rule: use a representation when it materially improves learning; do not add decorative imagery merely to satisfy a quota; conversely, do not leave inherently spatial, physical, directional, symbolic, mechanistic, procedural or recognition-heavy knowledge as text-only when a visual representation would materially improve understanding. The intended learner experience is closer to a carefully produced, premium interactive textbook/tutorial than a sequence of text cards. Full standard, storyboard consequence and the Claude role boundary for this decision: [`docs/governance/LEARNING-PACKAGE-QUALITY-GATES.md`](LEARNING-PACKAGE-QUALITY-GATES.md) §4-§5; [`docs/architecture/LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md`](../architecture/LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md) §2; [`docs/governance/ROLES-AND-AUTHORITY.md`](ROLES-AND-AUTHORITY.md).

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
