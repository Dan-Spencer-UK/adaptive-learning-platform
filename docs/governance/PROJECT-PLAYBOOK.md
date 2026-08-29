# PROJECT-PLAYBOOK.md

**Working version:** 0.12 (draft for Product Owner review)\
**Last revised:** 2026-08-15

## Purpose

This file is the human operating manual for the project.

It exists to keep the Product Owner, ChatGPT, Claude Code, and any
future contributors aligned as the project grows. It is deliberately
different from architecture documents, ADRs, governance documents,
specifications, and code comments.

When unsure what to work on, how to use an AI service, whether a new
idea belongs in the current phase, or whether a task is complete,
consult this file first.

The project must be built from the beginning as a secure, scalable,
high-quality SaaS platform capable of growing from an initial UK/Ireland
launch to millions of users across multiple jurisdictions. Security,
maintainability, observability, data isolation, performance, and scale
are architectural constraints from day one, not later hardening tasks.

------------------------------------------------------------------------

# 1. Roles and decision authority

## Product Owner --- human

The Product Owner owns:

-   product vision;
-   commercial priorities;
-   scope;
-   phase transitions;
-   acceptance of product and architecture decisions;
-   launch criteria;
-   final approval of material changes.

AI systems advise and implement. They do not own the product.

No AI may silently redefine the product, broaden scope, change a
governing principle, or substitute its preferred architecture for an
approved decision.

## ChatGPT --- product, research and design partner

Use ChatGPT primarily for:

-   product thinking;
-   market research;
-   challenge and critique;
-   requirements definition;
-   architecture discussion;
-   security and scalability review;
-   data-model design;
-   phase planning;
-   work-package preparation;
-   reviewing completed work against the agreed objective;
-   identifying drift, contradictions and missing decisions.

ChatGPT is normally upstream of implementation.

## Claude Code --- repository implementation agent

Use Claude Code primarily for:

-   inspecting the repository;
-   implementing bounded work packages;
-   writing/refactoring code;
-   tests;
-   migrations;
-   repository documentation updates;
-   static analysis;
-   validating implementation against existing governance and
    architecture.

Claude Code should not be given vague instructions such as "continue
building the platform".

Every substantial Claude Code task should have an explicit objective,
scope, constraints and acceptance criteria.

------------------------------------------------------------------------

# 2. Sources of truth

The project must not depend on AI conversation memory.

Authority should flow roughly as follows:

1.  Approved governance / constitutional documents.
2.  Approved ADRs and architecture documents.
3.  Approved product specifications and data contracts.
4.  Repository code, migrations and tests.
5.  Current project status and approved work package.
6.  AI conversations.

If an AI conversation conflicts with an approved repository document,
the repository document wins unless the Product Owner explicitly changes
the decision.

Important decisions made in conversation must be moved into the
repository rather than left trapped in chat history.

------------------------------------------------------------------------

# 3. Project operating principle

Work in small, explicit, inspectable increments.

The normal cycle is:

``` text
QUESTION / IDEA
      ↓
INVESTIGATE
      ↓
DECIDE
      ↓
RECORD DECISION
      ↓
DEFINE BOUNDED WORK PACKAGE
      ↓
IMPLEMENT
      ↓
TEST / VERIFY
      ↓
REVIEW AGAINST OBJECTIVE
      ↓
ACCEPT / REJECT
      ↓
UPDATE PROJECT STATUS
      ↓
NEXT TASK
```

Do not collapse investigation, product decisions and implementation into
one uncontrolled AI session.

------------------------------------------------------------------------

# 4. Phase discipline

The project is organised into explicit phases.

Each phase must have:

-   an objective;
-   in-scope work;
-   explicitly out-of-scope work;
-   required artefacts;
-   acceptance criteria;
-   exit criteria.

A phase is not complete because most of the work appears finished. It is
complete only when its exit criteria are satisfied and the Product Owner
records it as complete.

New ideas discovered during a phase go to the backlog unless they are
required to satisfy the current phase objective.

Avoid "while we are here" development.

If an attractive feature does not contribute to the current phase gate,
defer it.

------------------------------------------------------------------------

# 5. Current high-level programme

The working programme is deliberately **vertical-slice first**.

A **vertical slice** means building one narrow but complete learner
journey through the whole product --- from curriculum and knowledge,
through questions and adaptive learning, to the actual user interface
--- before attempting to fill every subject area. This matters because
it proves that the product is genuinely useful to a learner, not merely
that its database and backend architecture work.

After that, use **horizontal expansion**: apply the proven engine across
more topics, qualifications and professions without repeatedly
redesigning the product.

``` text
Phase 0  — Market validation and launch-SAM definition
Phase 1  — Product contract + core knowledge/curriculum architecture
Phase 2  — End-to-end electrical vertical slice
           Onboarding → assessment → weakness detection → targeted learning
           → retesting → mastery/progress → explanation/help.
Phase 3  — Complete and harden the first electrical product
Phase 4  — Cross-qualification electrical reuse
Phase 5  — Shared vocational mathematics layer
Phase 6  — Second vertical
Phase 7  — Third vertical + closed beta
Phase 8  — Commercial validation
Phase 9  — Repeatable content/governance production line
Phase 10 — UK/Ireland SAM launch
```

This sequence may change through explicit Product Owner decisions. It
must not drift implicitly.

Electrical is the proving ground. Public launch should demonstrate a
multi-vertical platform with a class-leading learner experience rather
than a single-qualification revision application.

------------------------------------------------------------------------

# 6. Learner-facing product standard

The backend, knowledge architecture and governance are only valuable if
they produce an excellent learning product.

The launch product must not be a thin interface over a question bank and
must not be a generic chatbot with course material attached.

The intended product is:

> **A curriculum-aware adaptive learning system that identifies what the
> learner knows, finds the actual cause of what they do not know,
> teaches the missing knowledge, verifies that the weakness has been
> corrected, and continually directs the learner to the highest-value
> next activity.**

The user should feel that the platform understands what qualification
they are studying, exactly what it requires, what they already know,
where they are weak, why they are getting particular questions wrong,
what they should do next, whether the real weakness is a prerequisite
such as maths, and how close they are to being ready for assessment.

The learner experience is a first-class product requirement. It is not a
presentation layer to be added after the knowledge system has been
built.

## 6.1 More than a question bank

A conventional revision product often behaves like:

``` text
Choose unit → answer questions → receive percentage score → repeat
```

Our target experience is:

``` text
Understand curriculum
        ↓
Estimate learner knowledge
        ↓
Select the most useful thing to test
        ↓
Observe answer + error pattern
        ↓
Identify missing knowledge / misconception
        ↓
Teach or remediate that weakness
        ↓
Give an appropriate worked example or easier bridge question
        ↓
Retest the underlying concept
        ↓
Return to the original curriculum problem
        ↓
Update mastery and future revision priority
```

The platform should therefore answer a much more useful question than
"what percentage did I get?":

> **What exactly is stopping me from being good at this, and what should
> I do next?**

## 6.2 Curriculum-aware from onboarding

The learner should begin by selecting the qualification/pathway they are
actually studying. The platform should know the qualification, level,
unit/module structure, learning outcomes, assessment requirements,
applicable version, and jurisdiction where rules differ.

The system should distinguish between:

-   **curriculum requirements** --- what the learner is expected to know
    or be able to do; and
-   **knowledge assertions/capabilities** --- the underlying facts,
    principles, relationships, procedures and skills needed to satisfy
    those requirements.

This allows one piece of knowledge to support many qualifications
without duplication. The learner should not need to understand this
architecture; they should simply experience accurate, complete and
personalised coverage.

## 6.3 A learner model, not just a score

The application should maintain a structured estimate of mastery at the
level of individual knowledge assertions or capabilities, for example:

``` text
Ohm's law concept                  strong
Equation rearrangement             weak
Power relationships                strong
Unit conversion                    moderate
Voltage-drop application           weak
```

A **learner model** is simply the structured record of what the system
currently believes the learner understands. It matters because the
system can personalise revision rather than showing everybody the same
sequence.

The learner model may consider correctness, repeated attempts, question
difficulty, recency, hint/explanation use, application in different
contexts, and repeated misconception patterns. The mastery calculation
should normally be deterministic software, not an LLM opinion.

## 6.4 Weakness identification and root-cause diagnosis

The product should distinguish between the topic in which an error
appears and the actual cause of the error.

Example:

``` text
Learner fails: voltage-drop calculation

Electrical concept understanding       strong
Multiplication                          strong
Unit conversion                        strong
Equation transposition                 weak
                                      ↑
                              likely root weakness
```

The platform should then target equation transposition rather than
repeatedly giving the learner more voltage-drop questions.

Where knowledge has prerequisite relationships, the system should be
capable of following those relationships backwards to find likely
foundational weaknesses. This is a core differentiator.

## 6.5 Targeted remediation

When a weakness is found, the platform should do more than display the
correct answer.

A remediation sequence may include a concise explanation, a worked
example, an easier prerequisite question, a second question applying the
same concept differently, return to the original curriculum context, and
later spaced retesting.

**Remediation** means targeted teaching intended to correct a specific
weakness. It matters because the platform should improve knowledge, not
merely measure it.

The learner should move naturally between testing, learning, worked
examples, practice and revision.

## 6.6 Shared foundational knowledge across subjects

The system should recognise when a weakness belongs to a reusable
foundational domain such as mathematics rather than to the current
trade.

``` text
                 Rearranging equations
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   Electrical        Engineering       Plumbing
      V = IR             F = ma         formula X
```

The underlying mathematical knowledge should exist once and be applied
in multiple professional contexts. This gives better learner diagnosis
and makes each new vertical cheaper to add.

Vocational maths should therefore become a shared horizontal layer
rather than a separate silo.

## 6.7 Adaptive question selection

Questions should be chosen because they are useful to the learner, not
merely because they are next in a list.

Selection may consider curriculum importance, current mastery,
prerequisite weaknesses, time since last successful retrieval,
difficulty, previous misconceptions, upcoming assessment and uncovered
requirements.

**Adaptive learning** means the next activity changes in response to the
learner's demonstrated knowledge. It matters because learner time should
be spent where it has the greatest value.

The learner must still retain manual control: choose a unit/topic,
revise a specific area, or run a mock assessment whenever wanted.

## 6.8 Spaced retrieval and retention

Getting something right once does not prove it will still be known
later.

The platform should revisit knowledge at suitable intervals so mastery
reflects retention as well as immediate performance.

**Spaced retrieval** means testing knowledge again after a delay. It
matters because delayed recall strengthens memory and exposes knowledge
that was only temporarily familiar.

The platform should distinguish newly learned, currently strong,
becoming stale, repeatedly weak and not yet tested knowledge.

## 6.9 Question quality must be engineered

The product must not depend on uncontrolled live AI generation of every
question.

Prefer validated stored questions, governed parameterised templates,
deterministic numerical generation, known misconception-based
distractors and controlled variation.

For calculations, deterministic code should calculate the correct result
wherever practical. Incorrect multiple-choice answers should preferably
represent plausible mistakes or misconceptions rather than arbitrary
wrong values.

Every question should be traceable to the curriculum requirement(s) and
knowledge assertion(s) it tests, its expected answer, explanation,
intended difficulty and known misconception where relevant.

Learner reports of ambiguous or incorrect questions must enter a review
workflow.

## 6.10 Explanations should teach, not merely reveal

Wrong-answer feedback should support different depths where appropriate:
one-line correction, normal explanation, step-by-step working, worked
example, simpler explanation, common mistake and source/reference
information.

Stored governed explanations should be preferred when sufficient. Live
AI should be used when something genuinely personalised or
conversational adds value.

## 6.11 AI tutor: useful, bounded and grounded

AI should enhance the product without becoming the product.

Useful requests include:

> "I still don't understand this."
>
> "Explain this another way."
>
> "Why is my answer wrong?"
>
> "Give me a simpler example."

The AI tutor should be supplied with the relevant governed knowledge and
curriculum context and must not be treated as an independent source of
truth.

Routine revision should continue to work well if no AI call is made. The
user should experience AI as a knowledgeable tutor available when
needed, not as a mandatory chat interface between them and every
learning activity.

## 6.12 Core learner modes

The final interface will be tested, but the product should support the
functional equivalents of:

-   **Learn** --- structured teaching, examples and checks for
    understanding;
-   **Practice** --- adaptive questions that strengthen knowledge and
    expose weaknesses;
-   **Target weaknesses** --- focused sessions driven by the learner
    model;
-   **Quick revision** --- useful revision for a chosen amount of time
    or number of questions;
-   **Mock / assessment practice** --- more exam-like sessions with
    reduced intervention and appropriate feedback afterwards;
-   **Review progress** --- curriculum coverage, mastery, weak areas and
    readiness.

These modes should share one learner model rather than behaving as
unrelated mini-apps.

## 6.13 Layered learner intent and progressive feedback

The platform must support different learner intents **without
fragmenting into separate products or separate learner models**.

The same governed knowledge, evidence, diagnostic and mastery systems
should be capable of serving learners who want very different things at
a particular moment.

Examples include:

-   **"Just tell me if I'm right."** --- result, minimal correction and
    immediate continuation;
-   **"Help me pass quickly."** --- exam-focused feedback, high-yield
    weaknesses, targeted practice and readiness priorities;
-   **"Why do I keep getting these wrong?"** --- diagnostic feedback
    identifying likely underlying weaknesses or misconceptions;
-   **"Teach me this."** --- fuller explanation, prerequisite
    remediation, worked examples and guided practice;
-   **"I want to master the course."** --- deeper learning, prerequisite
    repair, spaced retrieval, transfer testing and comprehensive mastery
    tracking.

These are **learner intents and feedback depths**, not necessarily five
permanent interface modes. The UX should make the appropriate depth
available naturally and should learn from behaviour/preferences where
appropriate rather than forcing the learner to configure the learning
engine before every session.

### Progressive disclosure

Feedback should normally show the useful minimum first and make deeper
help available smoothly.

For example:

``` text
Incorrect
Correct answer: 11.5 A

You divided correctly, but the formula was rearranged incorrectly.

[Quick explanation]    [Fix this weakness]    [Next]
```

A learner who is cramming should be able to continue immediately.

A learner who wants to understand should be able to expand the
explanation or enter targeted remediation without leaving the coherent
learning journey.

### Diagnostic depth is not display depth

The platform may collect and update granular learner evidence even when
the learner requests minimal feedback.

For example, a "pass quickly" learner may still build an internal model
such as:

``` text
Electrical power relationship    strong
Unit selection                    strong
Arithmetic                        strong
Formula transposition             weak
Decimal manipulation              probable weakness
```

The platform should then use that intelligence to optimise the learner's
chosen outcome. It might recommend a five-minute formula-transposition
repair because that is likely to recover more marks than another block
of random Electrical questions.

The diagnostic system therefore exists to improve outcomes; learners
must not be required to consume all of the diagnostic detail merely
because the platform can produce it.

### Never punish a learner for wanting less explanation

The platform must not force deep remediation, long explanations or
pedagogical detours simply because the system has identified a possible
weakness.

Where safety, assessment integrity or a genuine prerequisite does not
require otherwise, the learner should be able to defer deeper
remediation and continue.

The product should support both:

> **MAKE ME PASS**

and:

> **MAKE ME UNDERSTAND**

using the same underlying knowledge and learner model.

Neither intent should feel like a degraded version of the other.

### Commercial and product implication

"Better learning" and "what a learner is willing to pay for" must not be
assumed to be identical.

The platform should test which outcomes learners actually value,
including:

-   rapid exam preparation;
-   assessment readiness/confidence;
-   weakness identification;
-   deeper understanding;
-   efficient targeted remediation;
-   long-term mastery.

The architecture should preserve the ability to serve all of these
without requiring separate products.

## 6.14 Learning Mode and dual lesson navigation

Learning is a first-class product mode and must not depend on a learner
failing an assessment first.

A learner must be able to select a qualification/unit and work through
its lessons systematically.

The same learning assets must also be discoverable through canonical
fundamental domains such as Foundational Maths, Foundational Physics and
Electrical.

Therefore:

-   atomic assertions are the knowledge/diagnostic layer;
-   lessons are coherent instructional units composed from assertion
    families;
-   lessons can have multiple structured mappings rather than belonging
    to only one folder/tree;
-   qualification sequence and prerequisite graph remain distinct;
-   Learning Mode and assessment-led adaptive learning use the same
    underlying learner model.

The core teaching loop is:

``` text
explain
→ demonstrate
→ guided practice
→ independent check
→ diagnose/remediate if required
→ retest
→ transfer
→ later retrieval
```

The learner may enter this loop through syllabus study, direct lesson
selection, diagnostic recommendation, weakness repair or revision.

## 6.15 Progress should be meaningful

The dashboard should not reduce progress to "you answered 1,248
questions".

Useful measures may include:

``` text
Curriculum coverage       91%
Current mastery           78%
Retention confidence      71%
Uncovered requirements    12
Weak knowledge areas       7
Topics due for review      9
```

Exact metrics must be validated and must not imply precision the system
cannot justify.

The learner should understand what they have covered, what they know
well, what they are weak at, what they have never demonstrated, what is
becoming stale and what they should do next.

## 6.16 Assessment readiness must be evidence-based

The platform may provide an assessment-readiness indicator, but it must
not be a decorative percentage.

Any readiness model should be explainable and based on curriculum
coverage, mastery, retention, representative assessment performance and
repeated weak areas. It should be possible to explain why readiness is
low and what would improve it.

Do not promise that a learner will pass an external examination.

## 6.17 Practical competence must not be faked

Some vocational qualifications assess practical competence as well as
knowledge.

The platform may teach what to do, why it is done, sequence/procedure,
calculations, interpretation, common errors and safety considerations.
It must not claim that answering questions proves a learner can safely
perform a practical task requiring observation or assessor verification.

Theory mastery and externally observed practical competence should
remain distinguishable.

## 6.18 User control and transparency

Personalisation should not feel mysterious. Where useful, the learner
should be able to understand why something is recommended, for example:

> "We're revisiting equation rearrangement because it caused errors in
> three recent electrical calculations."

The learner should be able to choose a topic manually, override a
suggested session, repeat an explanation, report a question, see
progress and understand which qualification/version they are working
against.

## 6.19 Native-mobile-first, fast and low-friction

Many learners will revise in short sessions on a phone. Native iOS and
Android are the primary learner platforms; web is secondary (see
`docs/product/PRODUCT-PRINCIPLES.md` and
`docs/governance/PROJECT-CONSTITUTION.md`). The Phase 1 proving slice is
implemented as a web client to prove the deterministic domain engines
quickly; this is a proving-slice implementation choice, not a decision
that web is the durable primary learner surface.

Design for quick entry into a useful session, readable
questions/diagrams, easy numerical input, clear progress, responsive
interaction, accessibility and good tablet/desktop use as well as
phone.

The application should feel like a purpose-built learning product, not a
database administration screen or reskinned chatbot. Performance
problems are product defects.

## 6.20 Qualification completeness and version awareness

If the product advertises support for a qualification, coverage must be
measurable.

The system should know which curriculum requirements are mapped, which
have sufficient knowledge and assessment coverage, which remain
incomplete and which qualification/version applies.

"Mostly covered" must not silently appear to the learner as complete
coverage.

## 6.21 The first vertical slice

The first end-to-end electrical slice should prove the complete product
behaviour on a representative portion of the qualification:

``` text
Create/sign in to account
        ↓
Select qualification
        ↓
Initial knowledge assessment or first-learning path
        ↓
Learner model created/updated
        ↓
Adaptive question selection
        ↓
Correct deterministic marking
        ↓
Weakness/misconception identified
        ↓
Targeted explanation/remediation
        ↓
Prerequisite teaching where required
        ↓
Retest
        ↓
Mastery updated
        ↓
Progress shown
        ↓
Next activity recommended
        ↓
Optional grounded AI help
```

The purpose is to discover whether the complete product loop is
genuinely good before multiplying content.

Do not build all electrical content first and postpone the learner
experience until afterwards.

## 6.22 Horizontal expansion after the slice works

Once the complete learner loop works well, expand it across:

1.  the rest of the first electrical qualification;
2.  related electrical qualifications through knowledge reuse;
3.  shared vocational maths;
4.  the second subject vertical;
5.  the third subject vertical.

Each expansion should reuse the same core capabilities unless a genuine
domain requirement proves that change is necessary.

A new vertical should not receive a separate learning engine, progress
model or UI merely because its content differs.

## 6.23 Competitive standard

The launch standard is not "works".

The launch standard is:

> **A learner choosing between this platform and an established
> specialist revision product should have clear, material reasons to
> choose this platform from day one.**

At minimum, the product should compete strongly on curriculum
completeness, question quality, adaptive learning, weakness diagnosis,
targeted remediation, explanation quality, progress insight, assessment
readiness, ease of use, mobile experience, speed, trust/correctness and
breadth across multiple qualifications/verticals.

We do not need to copy every competitor feature. We do need a clearly
better core learning proposition.

## 6.24 Learner-facing launch gates

Public UK/Ireland launch should not occur until the Product Owner is
satisfied that the following are true.

### Product breadth

-   The platform supports multiple genuine verticals, not merely
    multiple electrical qualifications.
-   A shared foundational layer such as vocational maths functions where
    it materially improves learning.
-   Supported qualification/version boundaries are clear.

### Core learning loop

-   Onboarding gets the learner into the correct qualification quickly.
-   Mastery is tracked below the coarse unit-score level.
-   The platform can identify specific weaknesses.
-   The platform responds to weaknesses with targeted learning.
-   Prerequisite/root-cause remediation works in meaningful cases.
-   Retesting verifies whether remediation worked.
-   Spaced review revisits knowledge over time.
-   The system recommends an appropriate next activity.

### Assessment

-   Questions are traceable to governed knowledge/curriculum.
-   Deterministic questions/calculations are marked deterministically
    where appropriate.
-   Question quality has a controlled review process.
-   Mock/assessment-style practice exists where appropriate.
-   The learner can practise manually selected topics as well as use
    adaptive sessions.

### Explanation and tutoring

-   Normal wrong-answer feedback is useful without requiring a frontier
    AI model.
-   Personalised AI explanation is available where it materially adds
    value.
-   AI responses are grounded in governed knowledge.
-   AI failure or temporary unavailability does not make routine
    revision unusable.

### Progress

-   The learner can see curriculum coverage.
-   The learner can see meaningful mastery/weakness information.
-   Untested/uncovered knowledge is visible rather than hidden by an
    aggregate score.
-   Readiness indicators are evidence-based and appropriately qualified.

### User experience

-   The product is polished and coherent across native iOS/Android (primary) and the secondary web client (mobile and desktop web).
-   Common journeys are fast and low-friction.
-   Accessibility has been considered and tested.
-   Users do not need to understand the underlying knowledge
    architecture.
-   Feedback supports progressive disclosure from minimal correction to
    deep remediation.
-   A learner can pursue a fast exam-focused path without being forced
    through unnecessary explanation.
-   A learner who wants deeper understanding can reach diagnostic,
    prerequisite and remediation detail smoothly.
-   The same underlying learner model supports both shallow and deep
    feedback experiences.
-   Beta learners can use the product without developer assistance.

### Competitive validation

Before launch, beta testing should provide evidence that the core
learning experience is materially valuable compared with ordinary
question-bank revision.

Where practical, test preference versus existing revision
methods/products, repeat voluntary usage, improvement in identified weak
areas, whether targeted remediation changes later performance, whether
users understand/trust progress information, willingness to pay, and
tutor/training-provider feedback.

Launch should not be driven solely by completion of the development
roadmap.

## 6.25 Product metrics from beta onward

Measure learner activation, repeat usage/retention, questions attempted,
concepts mastered, remediation success, performance after remediation,
weak-area recurrence, curriculum coverage, session completion, AI-help
requests, learner-reported question problems, time to useful first
session, cost per learner-hour and voluntary use of adaptive versus
manual revision.

**Retention** means whether learners keep coming back over time. It
matters because a product can look excellent in a demo but still fail if
learners do not choose to return.

Avoid vanity metrics that look large but do not indicate learning or
product value.

## 6.26 Product principle for every feature

Before adding a learner-facing feature ask:

> **Does this help the learner know what to learn, learn it better,
> prove they know it, or understand their progress?**

If not, it needs a strong alternative justification.

Features should not accumulate simply to make the application look
larger.

------------------------------------------------------------------------

# 7. Development workstreams and integration discipline

The project must be developed as **four distinct but interdependent
workstreams**.

A **workstream** is a major area of development with its own
responsibilities and outputs. Separating workstreams matters because it
prevents, for example, user-interface work from silently redefining the
knowledge model or platform infrastructure from dictating how learning
must work.

The four workstreams are:

``` text
A. KNOWLEDGE & CURRICULUM
          │
          ▼
B. ASSESSMENT & LEARNING ENGINE
          │
          ▼
C. LEARNER EXPERIENCE
          │
          │
          └──────────────┐
                         ▼
                  INTEGRATED PRODUCT
                         ▲
                         │
D. SAAS PLATFORM ────────┘
```

They are separate for planning and ownership, but they must never be
developed in isolation.


## Security standards hierarchy and verification

Security instructions must never collapse to a vague "follow OWASP" or
"follow best practice".

The durable project security hierarchy is:

```text
Application-security requirements / verification:
OWASP ASVS

Secure-development lifecycle:
NIST SSDF

Contemporary web-risk cross-check:
OWASP Top 10

Technology-specific secure configuration:
Applicable CIS Benchmarks
```

At the time this rule was adopted, the project baselines are:

- OWASP ASVS 5.0.0 as the current stable ASVS baseline;
- NIST SP 800-218 SSDF Version 1.1 as the current final SSDF baseline;
- OWASP Top 10:2025 as the current web-risk awareness cross-check.

The precise project baseline must remain version-pinned. New releases
are reviewed deliberately rather than silently adopted.

Once the actual stack is selected, applicable CIS Benchmarks must be
identified for the technologies in use.

The project must maintain a **Security Verification Matrix** that maps:

```text
standard/version requirement
→ applicability
→ implementation/control
→ automated/manual verification
→ evidence
→ status
```

Applicable security requirements are part of implementation acceptance
criteria and release gates. Where a requirement can be verified
automatically, the check should run in CI.

Non-applicable requirements require explicit rationale.

Do not claim blanket standards compliance without evidence.


## 7.1 Workstream A --- Knowledge & Curriculum

Purpose:

> Produce trusted, structured, versioned knowledge and prove how it maps
> to what learners are required to know.

Typical flow:

``` text
Qualification specification
        ↓
Curriculum structure
        ↓
Source acquisition
        ↓
Knowledge extraction
        ↓
Knowledge assertions
        ↓
Provenance / versioning
        ↓
Validation
        ↓
Curriculum ↔ knowledge mapping
```

Primary responsibilities include:

-   qualification and syllabus ingestion;
-   curriculum requirements;
-   authoritative source management;
-   knowledge assertions;
-   provenance;
-   versioning and supersession;
-   jurisdiction;
-   prerequisite relationships;
-   knowledge reuse across qualifications;
-   completeness measurement;
-   content governance.

Its output is not a finished course screen. Its output is trustworthy
structured knowledge that the other workstreams can safely consume.

## 7.2 Workstream B --- Assessment & Learning Engine

Purpose:

> Turn governed knowledge into an adaptive learning process.

Typical flow:

``` text
Knowledge assertions
        ↓
Questions / templates
        ↓
Correct answers
        ↓
Misconceptions
        ↓
Learner evidence
        ↓
Mastery model
        ↓
Weakness diagnosis
        ↓
Targeted remediation
        ↓
Spaced review
        ↓
Next-best activity
```

Primary responsibilities include:

-   question definitions and templates;
-   deterministic numerical generation;
-   deterministic marking where appropriate;
-   misconception modelling;
-   question difficulty;
-   learner mastery;
-   prerequisite/root-cause weakness detection;
-   remediation;
-   spaced retrieval;
-   adaptive question selection;
-   assessment-readiness logic;
-   learning-effectiveness measurement.

This workstream must not invent knowledge independently of the governed
knowledge layer.

## 7.3 Workstream C --- Learner Experience

Purpose:

> Turn the learning engine into a product that learners actively want to
> use.

Primary responsibilities include:

-   onboarding;
-   qualification selection;
-   Learn;
-   Practice;
-   Target Weaknesses;
-   Quick Revision;
-   mock/assessment practice;
-   explanations;
-   optional AI tutoring;
-   progress and readiness views;
-   learner control over adaptive recommendations;
-   native mobile experience (primary) and web experience (secondary);
-   accessibility;
-   interaction design;
-   perceived speed and clarity;
-   learner feedback/reporting.

This workstream is not merely "frontend development".

It owns the quality of the learner's experience and must continuously
test whether the underlying knowledge and learning capabilities are
being presented in a way that is understandable, motivating and useful.

## 7.4 Workstream D --- SaaS Platform

**SaaS** means *Software as a Service*: software operated centrally and
accessed by users over the internet, normally through subscriptions or
organisational access. This workstream is the secure commercial
machinery around the learning product.

Purpose:

> Provide the secure, reliable and scalable platform on which the
> learner experience operates.

Primary responsibilities include:

-   accounts and user identity;
-   authentication and authorization;
-   database and data isolation;
-   APIs;
-   RLS;
-   subscriptions and payments;
-   entitlements;
-   rate limiting;
-   logging and monitoring;
-   administration;
-   deployment;
-   backups and recovery;
-   analytics infrastructure;
-   background jobs;
-   infrastructure;
-   performance and scaling.

The SaaS platform must support the learning product. It should not
dictate unnecessary learning-product constraints simply because an
infrastructure choice is convenient.

## 7.5 The four workstreams must remain mutually aware

Separation does **not** mean four independent projects.

Every material decision in one workstream must consider its effects on
the other three.

Examples:

-   Changing the knowledge assertion schema may affect question
    mappings, learner explanations and database/API contracts.
-   Changing the learner mastery model may affect stored learner data,
    progress screens and analytics.
-   Changing authentication may affect onboarding, saved progress,
    organisation access and RLS.
-   Changing curriculum versioning may affect questions, learner
    progress and what qualification/version is shown in the UI.
-   Changing question representation may affect content governance,
    adaptive selection, reporting and storage.
-   Changing tenancy or organisation architecture may affect learner
    identity, tutor dashboards and data access.

Before approving a material change, ask:

``` text
What changes in Workstream A?
What changes in Workstream B?
What changes in Workstream C?
What changes in Workstream D?
```

"No impact" is a valid answer, but it should be considered rather than
assumed.

## 7.6 Interface contracts between workstreams

The boundaries between workstreams should have explicit **contracts**.

A contract means an agreed structure or behaviour that one part of the
system can rely on another part to provide. This matters because one
workstream can then evolve internally without unexpectedly breaking
everything that consumes it.

Examples include:

-   the structure of a knowledge assertion;
-   how a curriculum requirement references knowledge;
-   the data a question must provide to the learning engine;
-   the learner-state data supplied to the progress UI;
-   API request/response structures;
-   authentication identity supplied to server-side authorization;
-   events supplied to analytics.

Material contract changes require impact assessment and appropriate
tests.

## 7.7 Regression protection across workstreams

A **regression** is when a change that improves or alters one part of
the system accidentally breaks something that previously worked.
Preventing regressions is particularly important in this project because
the four workstreams are tightly connected.

Every material architecture or contract change must include a
regression-impact review.

Ask:

1.  What existing behaviour could this break?
2.  Which workstreams consume the thing being changed?
3.  Which automated tests prove those behaviours still work?
4.  Do any stored data or migrations need updating?
5.  Could security/access behaviour change?
6.  Could learner progress/mastery calculations change?
7.  Could curriculum or provenance traceability be lost?
8.  Could the learner-facing experience change unexpectedly?
9.  Could performance or operating cost materially worsen?

Where a previous bug or integration failure is important enough to
prevent recurring, add a **regression test** --- an automated test
specifically proving that the old failure does not return.

## 7.8 Integration tests are mandatory at important boundaries

A **unit test** checks one small component in isolation.

An **integration test** checks that multiple parts work correctly
together.

Integration tests matter here because each individual workstream could
pass its own tests while the complete learner journey is broken.

Important integration paths should eventually include:

``` text
Curriculum
 → assertion
 → question
 → learner answer
 → marking
 → mastery update
 → weakness detection
 → remediation
 → progress display
```

and:

``` text
Authenticated user
 → protected request
 → server authorization
 → RLS
 → correct user's data
 → safe API response
 → learner interface
```

Changes to shared architecture should not be considered complete until
relevant end-to-end/integration behaviour remains verified.

## 7.9 Architecture-change impact statement

Every material architecture change should contain a short impact
statement:

``` text
Workstream A — impact:
Workstream B — impact:
Workstream C — impact:
Workstream D — impact:

Security impact:
Data/migration impact:
Performance/scale impact:
Cost impact:
Tests required:
Documentation affected:
```

This does not need to become bureaucracy for tiny changes. It is
required when a change affects shared architecture, persistent data,
security boundaries or a workstream contract.

## 7.10 Build vertically first, then expand horizontally

The first development objective is not to complete Workstream A and then
begin B, then C, then D.

Instead, build a thin but complete slice through all four.

For example:

``` text
Small representative electrical curriculum area
        ↓
Governed assertions
        ↓
Validated questions
        ↓
Learner mastery / weakness detection
        ↓
Targeted remediation
        ↓
Polished learner UI
        ↓
Secure account + stored progress
        ↓
Logging / rate limits / RLS
```

Only enough content is needed initially to prove that the complete
product loop works.

Once it does, expand horizontally:

``` text
More electrical knowledge
        ↓
Complete first qualification
        ↓
Related electrical qualifications
        ↓
Shared vocational maths
        ↓
Second vertical
        ↓
Third vertical
```

This reduces the risk of spending months perfecting one layer only to
discover later that it does not produce a good product.

## 7.11 Passwordless-first authentication direction

The preferred initial authentication direction is
**passwordless-first**, subject to architecture review before provider
selection.

**Passwordless authentication** means the platform does not require
users to create and remember a platform-specific password.

A likely learner flow is:

``` text
Enter email address
        ↓
Receive short-lived sign-in link or one-time code
        ↓
Verify
        ↓
Secure session created
```

An emailed sign-in URL is commonly called a **magic link**.

Why this is attractive:

-   low friction for learners;
-   no platform password for the learner to forget;
-   no password-reset flow for us to maintain;
-   avoids storing/managing platform passwords ourselves;
-   reduces exposure to password reuse and credential-stuffing attacks;
-   relatively cheap and straightforward when provided by a mature
    authentication service.

Possible additional methods later include:

-   Continue with Google;
-   Continue with Apple;
-   institutional SSO.

**SSO (Single Sign-On)** means using an organisation's existing identity
system --- for example a college Microsoft account --- to access the
platform. It may become valuable for institutional customers.

Authentication should use a mature, maintained authentication
service/library rather than custom-built cryptographic/login code.

The specific provider is not selected by this playbook.

## 7.12 Passwordless security requirements

Passwordless does not remove the need for authentication security.

At minimum:

-   sign-in links/codes must expire;
-   tokens/codes should be single-use where supported;
-   authentication requests must be rate-limited;
-   responses should not unnecessarily reveal whether an email address
    has an account;
-   redirects must be controlled;
-   sessions must be securely managed;
-   authentication events must be logged appropriately;
-   email/authentication providers must be monitored for abuse and cost;
-   account-recovery and email-change flows require deliberate design;
-   privileged/admin access may require stronger authentication than
    ordinary learner access.

The objective is secure and low-friction authentication, not merely
removal of passwords.

------------------------------------------------------------------------

# 8. Intellectual property and source-use policy

The platform must be able to acknowledge and use authoritative reference
ecosystems without unlawfully reproducing proprietary works.

This is a product and architecture requirement from the beginning, not a
legal check to perform after the knowledge corpus has been built.

## 8.1 Core rule

A vertical does **not** require every authoritative reference source to
be freely licensed.

The requirement is instead:

> **The platform must be capable of creating, maintaining and delivering
> its commercial knowledge and educational content lawfully, without
> depending on unlicensed reproduction or redistribution of proprietary
> source material.**

A proprietary standard, handbook or professional reference may still be
important evidence for a knowledge assertion.

The platform should distinguish:

``` text
REFERENCE / AUTHORITY
        ↓
provenance and verification
        ↓
INDEPENDENT KNOWLEDGE ASSERTION
        ↓
independently authored questions,
explanations, examples and teaching
```

## 8.2 Facts and expression

Copyright generally protects the author's **expression** --- for example
the particular wording, illustrations, tables, selection or arrangement
in a work --- rather than giving ownership of every underlying fact or
general idea.

That distinction does not give the project permission to reconstruct a
proprietary publication in disguised form.

The project must avoid copying protected wording, tables, diagrams,
distinctive structure, substantial selections or other protected
material unless an appropriate licence or legal basis permits it.

## 8.3 Proprietary references may remain first-class provenance

Important professional references must not disappear from the knowledge
model merely because the platform cannot redistribute them.

Where appropriate, provenance may record:

``` text
Source: [authoritative publication]
Edition/version: [...]
Section/regulation/reference: [...]
Access class: PROPRIETARY_REFERENCE
Verification status: [...]
Reproduction permission: NOT ASSUMED
```

The learner-facing product may identify an authoritative reference and
direct the learner to consult the current source where appropriate,
without reproducing protected content.

## 8.4 Source-access classifications

Knowledge sources should be classified explicitly:

-   **OPEN** --- reusable under an applicable open/public licence,
    subject to its terms.
-   **PUBLIC_RESTRICTED** --- publicly accessible but copying/reuse is
    restricted.
-   **PROPRIETARY_REFERENCE** --- authoritative proprietary source that
    may be cited or used for verification where lawful, but whose
    content is not assumed redistributable.
-   **LICENSED** --- the project has an explicit licence defining
    permitted use.
-   **LEGISLATION / OFFICIAL PUBLIC MATERIAL** --- official source;
    applicable reuse terms must still be recorded.
-   **ORIGINAL / INDEPENDENT** --- platform-authored teaching,
    questions, explanations, examples or independently established
    knowledge.

Access classification and authority are separate concepts: a source can
be highly authoritative while remaining proprietary.

## 8.5 Educational content must be independently authored

Unless a licence explicitly permits otherwise, learner-facing content
should be independently created, including:

-   knowledge explanations;
-   questions;
-   worked examples;
-   calculations;
-   scenarios;
-   diagrams;
-   hints;
-   misconception-based distractors;
-   remediation material.

Questions may assess knowledge established or verified using
authoritative references, but the question bank must not become a
substitute reproduction of a proprietary publication.

Where deterministic calculations can establish the answer independently,
use them.

## 8.6 Referencing is not redistribution

The architecture should support precise references such as publication,
edition and section/regulation identifiers.

A reference tells us and, where appropriate, the learner **where
authority resides**. It does not automatically grant permission to copy
the referenced content.

The system should therefore be capable of displaying an appropriate
reference such as:

> Consult the current edition of \[source\], \[section/regulation
> reference\], for the authoritative wording.

without needing to reproduce that wording.

## 8.7 No reliance on broad copyright exceptions as the business model

UK law contains limited copyright exceptions such as fair dealing and
quotation.

The commercial content strategy should not depend on stretching those
exceptions to reproduce substantial proprietary educational or standards
material.

Where quotation is genuinely necessary, its purpose, amount,
acknowledgement and legal basis should be considered explicitly.

If commercial viability depends on reproducing material for which rights
are unclear, the issue must be resolved before that vertical is
approved.

## 8.8 Phase 0 source-feasibility gate

Every candidate vertical must eventually answer:

1.  What are the authoritative curriculum sources?
2.  What are the authoritative knowledge/reference sources?
3.  Which are open, restricted, proprietary, licensed, official or
    original?
4.  Can the required knowledge be independently represented and taught?
5.  Can questions and explanations be independently authored?
6.  Would the product accidentally substitute for a proprietary
    reference work?
7.  Are there essential tables, diagrams, datasets or wording that
    genuinely require a licence?
8.  Can provenance still identify required proprietary references
    without reproducing them?
9.  Is specialist legal review required before commercial use?

A vertical should fail the source-feasibility gate if a commercially
credible product cannot be produced without unlicensed use of protected
material.

## 8.9 Legal review before launch

This playbook defines the project's conservative operating policy; it is
not a substitute for legal advice.

Before public commercial launch, the project's actual source-ingestion,
provenance, citation, question-generation and learner-display practices
should receive appropriate UK intellectual-property review, particularly
where proprietary standards or professional reference works are material
to the product.

------------------------------------------------------------------------

# 8. Security is a product invariant

Security is not a later phase.

Every architecture decision, schema, API, deployment choice and
implementation task must assume the platform may eventually hold data
for millions of users and multiple organisations.

The default posture is:

**deny by default, expose deliberately, validate at trust boundaries,
minimise privilege, log important security events, and never rely on the
client for enforcement.**

The project should use recognised secure-development practices and
should eventually be verified against an appropriate current OWASP ASVS
target and a formal secure software development framework.

## Mandatory baseline

### Authentication and authorization

-   Protected routes require authentication.
-   Authentication and authorization are separate concerns.
-   Authorization is enforced server-side for every protected operation.
-   Object-level access is checked on every request involving user-,
    tenant-, organisation- or resource-specific identifiers.
-   Client-side hiding is never treated as access control.
-   Administrative functions require explicit elevated authorization.
-   Privileged roles follow least privilege.
-   Sensitive or destructive operations should support stronger
    safeguards where appropriate.

### Database isolation and row-level security

-   Row-level security is default-on for application tables.
-   No user- or tenant-sensitive table may rely solely on application
    convention to prevent cross-user access.
-   RLS complements server-side authorization; it does not replace it.
-   Service roles that can bypass RLS are tightly restricted to trusted
    server-side contexts.
-   Tables must not be made anonymously writable.
-   Any deliberately public/readable dataset must be explicitly
    classified and approved rather than becoming public by accident.
-   Schema changes must be reviewed for data-isolation implications.

### Secrets and credentials

-   API keys, database credentials, signing secrets and privileged
    tokens remain server-side.
-   Secrets are never embedded in client bundles.
-   Secrets and production credentials are never committed to the
    repository.
-   Environment-specific secrets use secure environment/configuration
    mechanisms.
-   `.env` files containing secrets are excluded from source control.
-   Production secrets should support rotation.
-   Logs must not contain passwords, authentication tokens, secret keys
    or other unnecessary sensitive data.

### Input and output handling

-   Treat all external input as untrusted.
-   Validate input at trusted server boundaries.
-   Prefer allow-list/schema validation over ad-hoc filtering.
-   Sanitize or safely encode where context requires it.
-   Parameterise database operations.
-   Validate file type, size and content where uploads exist.
-   Protect against injection, mass assignment, malformed payloads and
    unexpected object properties.
-   Enforce sensible length, complexity and resource limits.

### API protection and rate limiting

-   Rate limiting is designed into the API architecture.
-   Limits may differ by IP, authenticated user, organisation, endpoint,
    operation cost and abuse risk.
-   Authentication, password-reset, AI-generation, search, export and
    expensive compute endpoints receive particular attention.
-   Resource limits exist for payload size, pagination, uploads,
    queries, compute-heavy operations and concurrency.
-   Rate limits are enforced server-side.
-   The system should fail safely under excessive load.

### Error handling

-   User-facing production errors do not expose stack traces.
-   Internal exception details, SQL, filesystem paths, secrets and
    infrastructure information are not returned to users.
-   Users receive useful but non-sensitive error messages.
-   Detailed diagnostic data is written to protected observability
    systems.
-   Development diagnostics are not exposed in production.

### Administrative and debugging surfaces

-   Development/debug endpoints are disabled or inaccessible in
    production.
-   Administrative endpoints are authenticated, authorized and
    auditable.
-   Internal management interfaces are not exposed publicly without a
    deliberate security design.
-   Default credentials and unnecessary services are prohibited.
-   Test utilities, seed endpoints and temporary bypasses must not
    survive unnoticed into production.

### Logging, monitoring and audit

-   Logging is part of initial architecture, not an afterthought.
-   Record important authentication events.
-   Record authorization failures.
-   Record rate-limit and abuse events.
-   Record relevant validation failures.
-   Record privileged administrative actions.
-   Record security-significant configuration changes where practical.
-   Logs must be structured enough to investigate incidents.
-   Logs must avoid unnecessary sensitive data.
-   Production must have a mechanism for monitoring and alerting on
    meaningful security events.
-   Security incidents should be detectable rather than discovered only
    through user reports.

### Dependencies and supply chain

-   Dependencies should be deliberate and kept reasonably current.
-   Lock files are committed.
-   Automated dependency/security scanning should be part of CI.
-   Avoid unnecessary packages, especially packages with extensive
    privileges or weak maintenance.
-   Secrets scanning should be part of the development workflow.
-   Production builds should be reproducible and deployed through
    controlled pipelines.

------------------------------------------------------------------------

# 9. Scalability is also a product invariant

Do not prematurely optimise every component, but do not make
architectural choices that assume a few hundred users forever.

Design so that growth from thousands to millions does not require
replacing the whole application.

Prefer:

-   stateless application services where practical;
-   explicit service boundaries rather than accidental coupling;
-   indexed, queryable relational data models;
-   bounded queries and pagination;
-   background jobs for slow/non-interactive work;
-   caching where measurement justifies it;
-   queues for bursty workloads;
-   idempotent jobs and retry-safe operations;
-   horizontal scaling of user-facing services;
-   CDN/object storage for suitable static assets;
-   observability of latency, throughput, errors and resource use;
-   explicit quotas for expensive AI operations;
-   deterministic computation wherever an LLM is unnecessary.

Do not build distributed complexity before it is needed.

The goal is **scale-ready architecture, not premature microservices**.

------------------------------------------------------------------------

# 10. Cost discipline

The product should avoid an inference tax on routine user activity.

For every feature ask, in order:

1.  Can this be done deterministically?
2.  Can it use precomputed or governed stored content?
3.  Can a small/cheap model do the bounded task?
4.  Does it genuinely require a frontier model?

Routine functions such as curriculum navigation, question selection,
deterministic marking, calculations, mastery updates, scheduling,
progress reporting and analytics should not require live LLM inference.

Measure:

-   infrastructure cost per active learner;
-   AI cost per learner-hour;
-   AI calls per 100 learner interactions;
-   storage/query cost;
-   cost per supported qualification;
-   marginal cost of adding a related qualification.

Cost is an architectural metric.

------------------------------------------------------------------------

# 11. How to run a ChatGPT session

Use a ChatGPT session when a problem requires thinking before
implementation.

At the beginning provide or establish:

-   current phase;
-   current objective;
-   relevant approved constraints;
-   the specific question/decision required.

During the session:

-   distinguish facts from assumptions;
-   challenge attractive but unnecessary scope;
-   identify conflicts with existing decisions;
-   identify security and scale implications;
-   make decisions explicit;
-   avoid designing unrelated future functionality.

At the end obtain:

-   decision(s) reached;
-   unresolved questions;
-   repository documents that need updating;
-   a bounded implementation work package if implementation is next.

Do not leave important architectural decisions only in chat.

For long-running topics, start a fresh conversation when context becomes
unwieldy. Use authoritative repository documents and a concise handover
rather than relying on chat history.

------------------------------------------------------------------------

# 12. How to run a Claude Code session

Claude Code should receive a bounded work package.

Before implementation it should:

1.  inspect the relevant repository files;
2.  identify the governing documents;
3.  state material conflicts or ambiguity before making broad changes;
4.  avoid modifying unrelated areas.

A normal work package contains:

## Objective

One clear outcome.

## Context

Why the change exists and which phase objective it serves.

## Authoritative documents

Specific repo files/ADRs/specifications that govern the work.

## In scope

Explicit list.

## Out of scope

Explicit list.

## Security constraints

Applicable authentication, authorization, RLS, secret-handling,
validation, logging, rate-limit and error-handling requirements.

## Scalability constraints

Expected access patterns, data volumes, bounded queries, background
work, caching or concurrency considerations where relevant.

## Acceptance criteria

Observable conditions that prove the task is complete.

## Tests required

Unit, integration, authorization/RLS, validation, migration, security
and/or performance tests as appropriate.

## Completion report

Claude must report:

-   files changed;
-   behaviour changed;
-   migrations created;
-   tests executed and results;
-   security considerations;
-   unresolved issues;
-   documentation updated;
-   anything deliberately deferred.

One work package should normally produce one coherent, reviewable
change.

------------------------------------------------------------------------

# 13. Security review is part of "done"

A feature is not complete merely because the happy path works.

For every feature involving data or protected functionality, ask:

-   Who can call this?
-   Who should be able to see this object?
-   Who can modify/delete it?
-   What happens if the object ID is changed?
-   What does RLS permit?
-   What does server authorization permit?
-   What input is accepted?
-   Can it be abused at scale?
-   Is the endpoint rate-limited where appropriate?
-   Could the response leak another user's data?
-   Could an error reveal internal details?
-   What security event would be logged?
-   What happens if the client is malicious rather than cooperative?

Security acceptance criteria belong in the work package, not in a later
audit backlog.

------------------------------------------------------------------------

# 14. Data model rule

Do not casually create tables.

Every persistent data object should have:

-   a clear owner or access model;
-   a purpose;
-   lifecycle expectations;
-   classification of whether it is public, user-owned, tenant-owned,
    internal or privileged;
-   authorization rules;
-   RLS policy where applicable;
-   indexes appropriate to expected queries;
-   migration coverage;
-   deletion/retention implications where relevant.

For user/tenant data, access isolation must be testable.

------------------------------------------------------------------------

# 15. Architecture change rule

A material architecture change requires an explicit decision before
implementation.

It must also assess effects across all four development workstreams. A
change is not accepted merely because the workstream that requested it
still works.

Examples:

-   changing authentication provider;
-   changing database platform;
-   introducing a queue;
-   splitting a service;
-   introducing a vector store;
-   changing tenancy model;
-   changing the knowledge assertion model;
-   changing curriculum/assertion separation;
-   changing public API contracts;
-   changing the security model;
-   introducing client-accessible third-party credentials.

Material decisions should produce or update an ADR.

Do not permit "Claude refactored it this way because it was cleaner" to
become de facto architecture.

------------------------------------------------------------------------

# 16. Documentation discipline

Documentation must serve a purpose.

Use:

-   governance documents for principles and authority;
-   ADRs for important architectural decisions and rationale;
-   architecture documents for system structure;
-   specifications for required behaviour/contracts;
-   this playbook for project operation;
-   a status file for immediate project state.

Avoid duplicating the same truth across many documents.

If duplication is unavoidable, identify the authoritative source.

------------------------------------------------------------------------

# 17. Recommended companion status file

Maintain a short `PROJECT-STATUS.md`.

It should be possible to read it in two minutes.

Suggested structure:

``` markdown
# Project Status

## Current phase
Phase X — ...

## Phase objective
...

## Current task
...

## Completed in this phase
- ...

## Next tasks
1. ...
2. ...

## Blockers
- ...

## Decisions required
- ...

## Deferred / backlog
- ...

## Last reviewed
YYYY-MM-DD
```

This file records where the project is **now**.

This playbook records **how the project is run**.

Do not turn the status file into a history book.

------------------------------------------------------------------------

# 18. Backlog rule

Capture ideas without allowing them to hijack current work.

Each new idea should be one of:

-   required now;
-   candidate for current phase;
-   future phase;
-   research item;
-   rejected / not pursuing.

Interesting does not mean urgent.

An idea enters implementation only through an explicit work package.

------------------------------------------------------------------------

# 19. Testing philosophy

Tests are part of the product, not cleanup work.

Prioritise automated testing around:

-   knowledge/curriculum invariants;
-   deterministic calculations;
-   question correctness;
-   mastery updates;
-   authentication;
-   authorization;
-   RLS/data isolation;
-   input validation;
-   payment/entitlement boundaries;
-   migrations;
-   critical APIs;
-   security regressions.

Every serious bug should trigger consideration of a regression test.

For security-sensitive access rules, test both:

-   the permitted case; and
-   the forbidden cross-user/cross-tenant case.

------------------------------------------------------------------------

# 20. Production-readiness principle

Development convenience must never silently become production
configuration.

Before anything reaches production verify at minimum:

-   production environment configuration is explicit;
-   debug mode is off;
-   development/admin endpoints are locked down or absent;
-   secrets are external to the repository/client;
-   authentication is enforced;
-   authorization/RLS policies are active;
-   rate limits/resource limits are active;
-   HTTPS is enforced by the deployment architecture;
-   errors are sanitised;
-   structured logging/monitoring is active;
-   backup/recovery expectations are understood;
-   migrations are controlled;
-   dependency/security checks pass.

------------------------------------------------------------------------

# 21. Definition of done for a work package

A work package is done only when:

-   acceptance criteria are met;
-   tests pass;
-   applicable security controls are implemented and tested;
-   no known cross-user/tenant data exposure exists;
-   secrets/configuration are handled correctly;
-   failure behaviour is acceptable;
-   observability is adequate for the feature;
-   relevant documentation is updated;
-   unrelated scope has not been introduced;
-   relevant cross-workstream integration/regression tests pass;
-   material shared changes include a four-workstream impact assessment;
-   deferred work is explicitly recorded;
-   the Product Owner accepts the result.

"Claude says complete" is not a completion criterion.

------------------------------------------------------------------------

# 22. Periodic project health review

At the end of each phase, and periodically during long phases, perform a
project health review.

Ask:

### Product

Are we still building the product we intended?

### Scope

Has unapproved functionality crept in?

### Architecture

Are implementation choices still consistent with approved architecture?

### Knowledge

Can we prove curriculum coverage and provenance?

### Security

Have we introduced access-control, secret, validation, logging,
dependency or exposure weaknesses?

### Scale

Are there emerging bottlenecks or unbounded patterns?

### Cost

Are deterministic paths being used where possible?

### Documentation

Does the repository still accurately describe the system?

### Technical debt

What have we knowingly deferred?

### Next phase

Are the exit criteria genuinely satisfied?

Do not advance because of momentum.

------------------------------------------------------------------------

# 23. Rules for AI-assisted development

1.  AI output is a proposal until inspected or tested.
2.  Never give an AI unrestricted permission to redesign the project.
3.  Do not combine major architectural decisions and implementation in
    an uncontrolled step.
4.  Prefer small diffs and reviewable commits.
5.  Require AI to cite/refer to governing repo documents when
    implementing governed behaviour.
6.  Ask AI to state assumptions explicitly.
7.  Do not allow AI to invent missing security requirements silently.
8.  Do not paste production secrets into AI prompts.
9.  Do not permit generated code to bypass security "temporarily"
    without an explicit tracked exception.
10. If an AI finds a contradiction, stop the affected scope and resolve
    the contradiction deliberately.
11. Use fresh sessions when context becomes unreliable.
12. Repository truth outranks conversational confidence.

------------------------------------------------------------------------

# 24. Core product principles to preserve

The following working principles should inform development unless
superseded by an approved decision:

-   governed knowledge is an asset;
-   knowledge assertions and curriculum requirements are separate
    entities;
-   provenance and versioning matter;
-   deterministic software should perform deterministic work;
-   LLMs should be used where language/reasoning adds real value;
-   learner state belongs to structured software, not model memory;
-   the learner experience is a first-class product requirement, not a
    later UI layer;
-   the platform must identify and remediate weaknesses, not merely
    score questions;
-   prerequisite/root-cause weaknesses should be addressed where the
    knowledge graph supports it;
-   progress should reflect curriculum coverage, mastery and retention
    rather than question counts alone;
-   content should be reusable across qualifications and jurisdictions;
-   shared foundational knowledge such as maths should support multiple
    verticals;
-   jurisdiction-specific knowledge must remain distinguishable from
    universal knowledge;
-   build one complete vertical slice before broad horizontal expansion;
-   security and privacy are architectural requirements;
-   scale readiness matters from the beginning;
-   the launch product should demonstrate multiple genuine verticals;
-   the platform must be measurably more useful than a static question
    bank;
-   public launch requires competitive learner-facing quality, not
    merely technical completion.

------------------------------------------------------------------------

# 25. When the project feels out of control

Stop adding work.

Then:

1.  Read this playbook.
2.  Read `PROJECT-STATUS.md`.
3.  Identify the current phase and its exit criteria.
4.  List all active tasks.
5.  Suspend anything that does not serve the current phase.
6.  Resolve contradictory decisions.
7.  Choose one bounded next work package.
8.  Complete and review it.
9.  Update status.
10. Continue.

The cure for project drift is not a longer AI context window. It is a
smaller number of explicit decisions and active tasks.

------------------------------------------------------------------------

# 26. Standard question before starting work

Before beginning any material task, answer:

> **What current project objective does this advance, what exact outcome
> will prove it is complete, and what am I deliberately not doing as
> part of it?**

If that cannot be answered clearly, the task is not ready for
implementation.

------------------------------------------------------------------------

# 27. Security standards direction

The project should progressively formalise its security baseline rather
than relying only on this checklist.

Current direction:

-   use OWASP ASVS as the application-security verification baseline;
-   use OWASP API Security guidance for API-specific threat coverage;
-   use a recognised secure software development framework such as NIST
    SSDF to structure secure development practices;
-   translate applicable requirements into repository-controlled
    security requirements and automated/manual verification;
-   perform independent security testing before meaningful public scale.

This playbook establishes the operating expectation. Detailed security
architecture and verification requirements should live in dedicated
governed documents as the project matures.


## UX engineering and interaction quality baseline

The learner-facing product must not treat UX as post-build polish. The durable rules below are written for the web client (they use web-specific units/mechanisms such as CSS pixels and page reflow). The native mobile client — the primary learner platform — has its own equivalent standard in `docs/product/MOBILE-UX-ENGINEERING-STANDARD.md`, which is stricter, not looser, than what follows.

Durable rules:

- design critical flows small-screen-first;
- target WCAG 2.2 AA as the minimum accessibility baseline;
- ordinary learner content must reflow without horizontal scrolling;
- frequent standalone touch targets should be approximately 44×44 CSS
  pixels or larger where practical (web client; the native client's
  touch-target rule is in `docs/product/MOBILE-UX-ENGINEERING-STANDARD.md`);
- adaptive intelligence may change content/sequence but interaction
  patterns must remain stable and predictable;
- preserve learner context through diagnostic/remediation branches;
- every interruption must earn its interruption;
- meaningful progress/state must survive ordinary interruptions where
  practical;
- loading, empty, error and success states are designed states, not
  afterthoughts;
- deterministic marking/feedback must not wait on optional AI;
- formulas/diagrams must have explicit narrow-screen behaviour;
- keyboard, focus, screen-reader semantics and text zoom/reflow are core
  requirements;
- real-device and manual accessibility testing supplement automated
  checks;
- the proving slice should be narrow but commercial-quality in the
  learner flows it implements.

Production web performance should target current "good" Core Web Vitals
thresholds and be measured in real-user conditions once traffic exists.

Core UX defects such as broken mobile layouts, lost progress,
inaccessible controls, confusing navigation or unreliable remediation
return paths are phase-gate failures, not cosmetic backlog items.



## AI generation and AI verification of governed content

The content pipeline must not be modelled as:

```text
AI writes
→ human checks every item forever
```

The intended scalable model is:

```text
AI generation
→ independent source-grounded AI verification
→ deterministic validation
→ risk-based human review / sampling
→ governed publication
```

Generation and verification must remain logically independent stages.

The verifier should produce structured evidence against:

- source/version/locator;
- correctness;
- wording independence;
- granularity;
- domain;
- duplication;
- curriculum mapping;
- rights constraints.

AI verification is evidence, not absolute proof.

High-risk or ambiguous content receives direct human review. Proven
low-risk content may eventually use sampling-based human review if
measured error rates justify it.

No single AI generation call may directly publish learner-visible
approved content.

Any future automated publication path must be explicitly authorised for
a defined low-risk class and require independent verification,
deterministic checks, rights checks, audit evidence and rollback.

Track generation throughput, verification throughput, approved
publication throughput, verification cost and escaped-error rate
separately.



## Initial launch has no learner-runtime AI

The initial learner product must have **zero runtime LLM dependency**.

Core launch functionality is delivered through governed content and
deterministic engines:

```text
teaching
question generation
marking
evidence
mastery
diagnosis
remediation
next activity
progress/readiness
```

AI is used extensively for:

- software development;
- candidate assertion generation;
- independent assertion verification;
- question/lesson/remediation drafting;
- content-production tooling;
- review assistance.

Those AI operations belong to development/content production and do not
sit in the learner request path.

The initial launch therefore targets:

> **£0 learner-runtime AI inference cost**

Any future AI tutor is a separate optional/premium enhancement. It must:

- be entitlement-gated;
- be server-side/provider-neutral;
- be grounded in approved knowledge/content;
- have explicit cost/rate limits;
- fail without breaking the base product;
- never replace deterministic marking/mastery/diagnosis as canonical
  truth.

The base learning platform must remain fully functional if all model
providers are unavailable.



## Open-source UI primitives and governed development environment

This section describes the web client. It does not apply to the native
mobile client, whose UI/design-system rules are in
`docs/product/MOBILE-UX-ENGINEERING-STANDARD.md`.

The project should not waste founder/AI development effort rebuilding
solved commodity UI mechanics.

Use mature open-source primitives selectively.

The default UI primitive source is **shadcn/ui**, because the component
code becomes part of the repository and can be inspected, customised,
tested and governed.

Rules:

- native semantic HTML remains preferred where sufficient;
- import only components an approved flow requires;
- all imported code must satisfy the project's WCAG 2.2 AA, touch,
  focus, mobile and design-token rules;
- third-party/community component registries require review;
- do not import a wholesale SaaS theme/template;
- open-source components solve mechanics, not product design.

The learner experience, diagnostic/remediation flows, lessons,
progress/readiness and visual identity remain project-owned.

The canonical development workflow remains:

```text
VS Code
→ local Git repository
→ bounded Claude Code task
→ tests/review
→ GitHub
→ controlled deployment
```

Replit or similar autonomous/browser app builders are **not part of the
primary governed development environment**.

They may be used for disposable isolated prototypes, but must not become
the source of truth, production dependency, or a bypass around ADRs,
tests, migrations and review.

The reason is control: the project's main AI-development risk is
architectural drift, not inability to generate screens quickly.

# 28. Learning-Package Architecture Reset and V1 Learning Model (2026-08-29)

Real Product Owner review of Unit 202 after full Android runtime qualification found that runtime PASS does not equal learner-ready quality (learner-visible internal/debug language, teaching leaking formative answers, redundant steps, off-syllabus content, weak diagnostic framing, text-only lessons with no imagery). Two accepted architecture decisions followed: [`ADR-0005`](../architecture/adr/ADR-0005-learning-package-production-and-visual-governance.md) (ground-up learning-package production and independent visual governance) and [`ADR-0006`](../architecture/adr/ADR-0006-v1-canonical-lessons-and-assessment-driven-guided-revision.md) (V1 canonical lessons and assessment-driven Guided Revision). This section records the durable programme shape those decisions establish; it does not restate their full detail, which lives in the linked documents.

**Syllabus-to-learning-package sequence.** A learning package is authored source/syllabus → knowledge → canonical storyboard → visual plan → lesson checks → formative/mock assessment mapping → reference governance → production → publication gates → runtime → submitted-assessment Guided Revision — never assembled backward from convenient existing content or repaired after the fact. See [`docs/architecture/SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md`](../architecture/SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md).

**Rich scrollable canonical lesson standard.** V1 ordinary lessons use one canonical premium route (no per-learner skip/branch/reorder). Teaching may scroll and should not be fragmented into one-sentence-then-Continue steps merely to fit a viewport. See [`docs/architecture/LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md`](../architecture/LESSON-PLAYER-AND-LESSON-PLAN-ARCHITECTURE.md) §4/§20.

**Visual-first planning and reference governance.** Every lesson receives a visual-opportunity analysis before learner-ready status; visual requirements are planned before authoring, not repaired afterward. Claude/automated tooling may extract candidate visual needs and discover/cache candidate references only — final technical-reference selection/annotation requires independent Project Architect (ChatGPT) review, never Implementation Engineer self-approval. See [`docs/architecture/INSTRUCTIONAL-VISUAL-PLANNING-REFERENCE-AND-PRODUCTION-ARCHITECTURE.md`](../architecture/INSTRUCTIONAL-VISUAL-PLANNING-REFERENCE-AND-PRODUCTION-ARCHITECTURE.md) and [`docs/governance/VISUAL-REFERENCE-REVIEW-PROTOCOL.md`](VISUAL-REFERENCE-REVIEW-PROTOCOL.md).

**Independent quality gates.** Publication requires independent curriculum, pedagogy, visual, assessment-integrity, learner-presentation and runtime gates — runtime compatibility is one gate, not the overall definition of learner readiness. See [`docs/governance/LEARNING-PACKAGE-QUALITY-GATES.md`](LEARNING-PACKAGE-QUALITY-GATES.md).

**V1 assessment-driven Guided Revision.** V1 learner adaptation happens only after a dedicated formative/mock assessment is completed and explicitly submitted, producing a deterministic Guided Revision plan ranking full canonical lessons by weakness. Embedded lesson checks reinforce learning but never update the plan; incomplete/abandoned assessments never update it either. See [`docs/architecture/V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md`](../architecture/V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md).

**Pipeline audit and pilot precede horizontal expansion.** Further syllabus-scale content expansion is paused until: the new architecture is integrated into current authoritative docs/tooling; the existing pipeline is audited against it; gaps are remediated; and a start-to-finish pilot (including assessment → Guided Revision) succeeds and is reviewed by the Product Owner. See [`docs/architecture/LEARNING-PACKAGE-PIPELINE-AUDIT-AND-QUALIFICATION-PLAN.md`](../architecture/LEARNING-PACKAGE-PIPELINE-AUDIT-AND-QUALIFICATION-PLAN.md).

**What is retained, not deleted.** Existing richer within-lesson/cross-lesson adaptive machinery (CC-07 evidence/sync, CC-08 diagnostic golden path, CC-12's real diagnostic-chain proof) is retained implemented platform capability / post-V1 option — it is not deleted and this reset does not revoke it — but it is no longer a V1 ordinary-lesson production requirement, and V1 gates must not require it.

This section does not alter §1-§27 above; where an existing passage in this playbook describes lesson production or adaptive routing in general terms, read it alongside this section rather than as contradicting it.

