# Phase 0 --- WP0.7: Consolidated Decision, Risk Register and Phase 1 Entry Gate

**Status:** Approved with Phase 1 design clarification v0.3\
**Date:** 13 August 2026\
**Market:** United Kingdom first\
**Depends on:** WP0.1--WP0.6\
**Purpose:** Close Phase 0 by consolidating the commercial, product,
knowledge, IP, security and bootstrap decisions; record the remaining
risks and hypotheses; freeze the first development scope; and define the
evidence required before the project is permitted to expand into
large-scale content and product development.

------------------------------------------------------------------------

# 1. Phase 0 decision

## Decision: GO

Phase 0 supports proceeding to Phase 1.

This is a **staged bootstrap GO**, not approval for uncontrolled
development, large pre-revenue expenditure or immediate construction of
the entire commercial platform.

The evidence supports the following proposition:

> A differentiated UK vocational-learning platform based on governed
> knowledge assertions, precise provenance, persistent learner evidence,
> prerequisite relationships and targeted remediation is sufficiently
> commercially and technically plausible to justify building a small
> production-shaped end-to-end proving slice.

The immediate investment decision is therefore:

> **Build enough of the real architecture and learner product to test
> the central thesis before investing heavily in corpus scale.**

Phase 0 does **not** establish that product-market fit exists.

It establishes that the opportunity is strong enough, the content model
is feasible enough, and the bootstrap economics are attractive enough to
justify testing it properly.

------------------------------------------------------------------------

# 2. What enterprise is being built

The intended product is not primarily:

-   a question bank;
-   a mock-exam website;
-   a generic AI tutor;
-   a repository of copied course notes;
-   an electronic textbook;
-   an LLM wrapper.

The intended product is a **knowledge-driven adaptive
vocational-learning platform**.

At its core:

``` text
GOVERNED KNOWLEDGE
        │
        ▼
ASSESS LEARNER
        │
        ▼
CAPTURE EVIDENCE
        │
        ▼
IDENTIFY WEAKNESS
        │
        ▼
INFER PROBABLE ROOT CAUSE
        │
        ▼
TARGET PREREQUISITE / MISCONCEPTION
        │
        ▼
REMEDIATE
        │
        ▼
RETEST FOUNDATION
        │
        ▼
TEST TRANSFER BACK INTO VOCATIONAL CONTEXT
        │
        ▼
UPDATE MASTERY / CONFIDENCE
        │
        ▼
SELECT NEXT BEST ACTIVITY
```

The platform should progressively learn **what the learner knows, what
they do not know, why they are likely getting something wrong, and what
should happen next**.

That learner model is intended to persist across sessions and eventually
across related qualifications.

------------------------------------------------------------------------

# 3. Core differentiation thesis

The principal competitive hypothesis is:

> Existing products commonly provide questions, mocks, explanations,
> progress scores or broad adaptive learning. The opportunity is to
> combine qualification-specific vocational knowledge with granular
> prerequisite diagnosis and targeted cross-domain remediation.

Example:

A learner repeatedly gets an electrical power question wrong.

The platform should not immediately conclude:

> "Weak on electrical power."

The underlying cause may be:

-   multiplication/division;
-   decimal handling;
-   unit conversion;
-   formula transposition;
-   misunderstanding energy versus power;
-   misunderstanding the electrical relationship;
-   selecting the wrong formula;
-   correct theory but careless calculation.

The system should accumulate evidence, distinguish plausible causes and
intervene at the appropriate layer.

Then it must test whether the learner can transfer the corrected
foundational knowledge back into the Electrical context.

This is the principal product thesis Phase 1 must prove.

------------------------------------------------------------------------

# 3.1 Learner-intent and layered-feedback decision

The diagnostic architecture must **not** force one pedagogical
experience on every learner.

The same governed knowledge and learner-evidence engine must support a
continuum of learner intents, including:

-   **minimal feedback** --- "just tell me if I am right";
-   **rapid exam preparation** --- "make me pass quickly";
-   **diagnostic support** --- "why do I keep getting these wrong?";
-   **guided learning** --- "teach me this";
-   **deep mastery** --- "help me understand and retain the course".

These should not become isolated products with separate learner models.

The system may maintain granular diagnostic evidence even when the
learner wants only concise feedback.

Therefore:

> **diagnostic depth and displayed feedback depth are separate
> concerns.**

A learner using an exam-focused path should still benefit from the
platform's internal diagnosis, but should not be forced through long
remediation merely because the system can provide it.

Feedback should use **progressive disclosure**: present the useful
minimum first, with deeper explanation, weakness diagnosis and targeted
remediation available naturally.

The product must support both:

> **MAKE ME PASS**

and:

> **MAKE ME UNDERSTAND**

smoothly from the same underlying knowledge/evidence architecture.

This is both a pedagogical and commercial requirement. Phase 0 does not
assume that the learning experience that produces maximum theoretical
understanding is always the experience a learner wants or will pay for
at a particular moment.

Phase 1 must therefore preserve and test multiple learner intents rather
than validating only a deep-remediation workflow.

------------------------------------------------------------------------

# 3.2 Learning Mode and syllabus-led teaching decision

The platform must not require assessment or detected weakness before a
learner can be taught.

A first-class **Learning Mode** must allow a learner to:

- choose their qualification;
- choose a unit/module;
- work through the complete approved lesson sequence;
- resume/revisit lessons;
- see progression through the syllabus.

Lessons must also be discoverable through canonical/fundamental domains
such as:

- Foundational Maths;
- Foundational Physics;
- Electrical.

The same lesson/learning asset may therefore be classified by both
qualification/unit and underlying domain/topic.

Atomic assertions remain the diagnostic/governance layer.

Coherent **lessons/learning units** form the instructional layer.

The platform's teaching engine must support:

> **explain → demonstrate → guided practice → independent check → diagnose/remediate if needed → retest → transfer → later retrieval**

Assessment-led adaptation and direct syllabus-led learning are both
first-class routes into the same engine.

------------------------------------------------------------------------

# 4. Initial knowledge architecture decision

The initial architecture contains two reusable horizontal domains and
one first vocational vertical.

``` text
            FOUNDATIONAL KNOWLEDGE

       ┌────────────┴────────────┐
       │                         │
       ▼                         ▼
FOUNDATIONAL MATHS      FOUNDATIONAL PHYSICS
       │                         │
       └────────────┬────────────┘
                    │
                    ▼
                ELECTRICAL
```

## Foundational Maths

A canonical reusable domain.

It must not be architecturally subordinate to Electrical.

Initial coverage is nevertheless driven by the Electrical proving slice
to prevent overbuilding.

## Foundational Physics

Also a canonical reusable domain.

It should contain reusable physical/scientific concepts rather than
duplicating them inside Electrical.

Again, initial coverage should be limited to what the proving slice
requires.

## Electrical

Electrical is the first full commercial vocational vertical.

The initial proving slice will use only a deliberately narrow part of
Electrical.

------------------------------------------------------------------------

# 5. Knowledge-asset decision

The durable product asset is not a pile of source documents.

It is the governed knowledge system built from them.

Conceptually:

``` text
SOURCE
   ↓
SOURCE VERSION / EDITION / AMENDMENT
   ↓
PRECISE LOCATOR
   ↓
INDEPENDENTLY EXPRESSED KNOWLEDGE ASSERTION
   ↓
RELATIONSHIPS / PREREQUISITES
   ↓
CURRICULUM MAPPINGS
   ↓
MISCONCEPTIONS
   ↓
QUESTIONS / REMEDIATION / EVIDENCE
```

A knowledge assertion should represent one sufficiently atomic
proposition that the platform can reason about, teach, test, map and
version.

Assertions should be independently expressed rather than copied source
passages.

------------------------------------------------------------------------

# 6. Provenance decision

Provenance is a first-class architectural requirement.

Where available and appropriate, the system should capture:

-   source;
-   publisher/authority;
-   source type;
-   jurisdiction;
-   exact edition;
-   revision;
-   amendment;
-   corrigendum;
-   effective date;
-   section;
-   subsection;
-   regulation;
-   sub-regulation;
-   clause;
-   appendix;
-   table;
-   figure;
-   page/page range;
-   rights/access classification;
-   verification status;
-   reviewer;
-   verification date.

Not every source uses every locator type.

The model must therefore support flexible locators.

## Semantic locator first

A semantic identifier such as:

> Regulation X / Section Y / Table Z

is normally more durable than a page number.

## Page number also retained where useful

Page number is valuable for learner reference navigation and should be
stored when known, but must not be the only locator because pagination
can change between editions/formats.

------------------------------------------------------------------------

# 7. Provenance has two jobs

## Governance provenance

Allows the platform/team to answer:

> Why do we believe this assertion is correct and current?

## Learner reference navigation

Allows the learner to answer:

> Where can I find the authoritative material myself?

This is particularly important in Electrical because using and
navigating professional reference material is itself a useful vocational
skill.

The learner may therefore see something such as:

``` text
Professional reference

BS 7671
[exact applicable edition/amendment]
Regulation: [...]
Page: [...] in specified edition/format
```

without the platform reproducing the proprietary source text.

------------------------------------------------------------------------

# 8. Proprietary-reference/IP operating decision

Phase 0 adopts the following intended operating model.

A proprietary publication that the content-development process lawfully
possesses/accesses may be used as a **temporary development/reference
input**.

The intended process is:

``` text
LAWFULLY ACCESSED REFERENCE
          │
          ▼
CONTROLLED TEMPORARY PROCESSING
          │
          ▼
LLM/HUMAN PROPOSES CANDIDATE ASSERTIONS
          │
          ▼
INDEPENDENT WORDING + PRECISE PROVENANCE
          │
          ▼
VALIDATION / VERIFICATION
          │
════════ PUBLICATION BOUNDARY ════════
          │
          ▼
APPROVED KNOWLEDGE ASSERTION
+ PROVENANCE / RIGHTS / AUDIT DATA
          │
          ▼
PRODUCTION PLATFORM
```

Unless explicitly licensed/approved, proprietary source material should
not become a production product asset in the form of:

-   source PDFs;
-   scans;
-   page images;
-   copied passages;
-   extracted proprietary corpora;
-   RAG source-text chunks;
-   source-text embeddings;
-   reconstructed substitute publications.

**RAG --- Retrieval-Augmented Generation** means giving an AI retrieved
source material at the time it answers. It matters here because
retaining proprietary text for live retrieval would create a different
rights architecture from retaining independently expressed assertions.

The Product Owner accepts that focused legal/IP review may eventually be
desirable or necessary but does not require broad pre-revenue legal
expenditure before the proving slice.

The exact legal risk remains an explicitly managed risk rather than a
hidden assumption.

------------------------------------------------------------------------

# 9. Content-production principle

LLMs may accelerate content-development work.

They are not the authority.

The intended pipeline is:

``` text
source/curriculum
      ↓
AI-assisted candidate extraction/drafting
      ↓
normalisation
      ↓
provenance verification
      ↓
validation
      ↓
approved assertion
      ↓
question/remediation generation
      ↓
validation
      ↓
production
```

The first slice must measure:

-   candidate assertions/hour;
-   approved assertions/hour;
-   review/rejection rate;
-   provenance-capture effort;
-   question-production rate;
-   question-review rate;
-   correction rate;
-   human intervention required.

These metrics are necessary to determine whether large-scale corpus
development is economically viable.

------------------------------------------------------------------------

# 10. First commercial vertical decision

## Electrical remains first

Electrical is selected because it combines:

-   substantial UK vocational demand;
-   multiple qualification pathways;
-   adult/de novo routes as well as apprenticeships;
-   strong knowledge-assessment component;
-   Maths dependency;
-   Physics dependency;
-   deterministic calculations;
-   diagnostic potential;
-   existing learner willingness to pay;
-   long potential learner lifecycle;
-   future B2B opportunity;
-   strong Product Owner sense-checking advantage.

The project must not describe the market as merely a 54-month
apprenticeship pathway.

The relevant ecosystem includes multiple routes into qualification and
later professional learning.

------------------------------------------------------------------------

# 11. Provisional second vertical decision

**Engineering remains the provisional leading candidate.**

However:

> "Engineering" is not sufficiently precise to be a development scope.

Later selection should consider specific qualification families such as:

-   Engineering Operations;
-   Advanced Manufacturing Engineering;
-   Engineering Maintenance;
-   Electrical/Electronic Engineering;
-   Mechanical/Manufacturing pathways.

There is a strategic choice between:

### Maximum reuse

A closely related Electrical/Electronic or Maintenance pathway may reuse
unusually large amounts of existing knowledge.

### Stronger generalisability proof

A Mechanical/Manufacturing/Engineering Operations route may provide a
stronger test that the Maths + Physics + learner architecture transfers
into a meaningfully different domain.

The choice is deliberately deferred.

Engineering must be re-scored after the proving slice provides real
development economics.

Reserve candidates include:

1.  HVAC/Refrigeration;
2.  Plumbing/Heating;
3.  Automotive.

------------------------------------------------------------------------

# 12. Launch strategy decision

The full marketed platform should not launch as merely one narrow
Electrical revision product.

The intended sequence is:

``` text
PHASE 1 PROVING SLICE
        ↓
ELECTRICAL EXPANSION
        ↓
CLOSED ALPHA
        ↓
BETA
        ↓
PAID ELECTRICAL EARLY ACCESS
        ↓
COMPLETE AGREED ELECTRICAL SCOPE
        ↓
SECOND VOCATIONAL VERTICAL
        ↓
MULTI-VERTICAL UK COMMERCIAL LAUNCH
```

This does **not** mean waiting until the second vertical before putting
the product in front of users.

Real learner evidence and paid validation should begin much earlier.

------------------------------------------------------------------------

# 13. Bootstrap financing decision

The enterprise will be bootstrapped.

The default financing model is:

> **Founder + AI → minimum pre-revenue cash → first users → first
> revenue → cash-neutral operation → up to 100% revenue reinvestment →
> revenue-funded professionalisation → scale.**

No external funding requirement is assumed.

## Pre-revenue target

> **Reach first paying users for less than £1,000 of incremental project
> cash expenditure, excluding general AI subscriptions already
> maintained by the Product Owner.**

This is an operating discipline rather than an absolute blocker.

## Paid CAC

Initial target:

> **£0 paid CAC.**

Initial distribution should rely on:

-   founder outreach;
-   relevant social communities;
-   electrical influencers/creators/thought leaders;
-   tutors/trainers;
-   free trials;
-   referrals;
-   organic qualification-specific discovery.

**CAC --- Customer Acquisition Cost** means the cost of obtaining a
paying customer. Founder outreach has an economic/time cost even when
its cash CAC is £0, so founder acquisition effort should still be
measured.

------------------------------------------------------------------------

# 14. Revenue-reinvestment decision

The Product Owner is willing to reinvest up to **100% of early
revenue**.

The company does not need to provide founder income during bootstrap.

However:

> **Revenue availability does not itself justify expenditure.**

Early expenditure should normally satisfy at least one of:

1.  materially improves learner experience;
2.  removes/reduces a significant risk;
3.  increases development/content throughput;
4.  produces customers at demonstrated favourable economics.

Preferred reinvestment order:

``` text
reliability/security
       ↓
learner product
       ↓
content/development bottlenecks
       ↓
professional assurance where justified
       ↓
knowledge expansion
       ↓
second vertical
       ↓
proven acquisition
       ↓
permanent organisational cost
```

------------------------------------------------------------------------

# 15. Two financial models must continue

## Bootstrap cash model

Question:

> Can this founder actually build and grow the product without
> significant external capital?

Founder labour is £0 cash.

## Mature economic model

Question:

> Would the business still work if engineering, content, support,
> security, sales and operations eventually had to be paid commercially?

Founder labour must not be treated as permanently free here.

Both models are required.

------------------------------------------------------------------------

# 16. Current commercial thresholds

WP0.6 established the following provisional operating targets.

### Initial B2C price test

-   £9.99/month including VAT;
-   £79.99/year including VAT.

### AI inference

Target:

> ≤ £3 per paid learner-year.

### Direct variable delivery cost

Target:

> ≤ £12 per paid learner-year.

### Contribution before paid acquisition

Target:

> ≥ £50 per paid learner-year.

### Paid validation

-   100 paying learners --- proof that strangers will pay;
-   500 --- useful cohort evidence;
-   1,000--2,500 --- strong initial commercial evidence and meaningful
    reinvestment capacity.

These are hypotheses, not promises.

------------------------------------------------------------------------

# 17. Deterministic-first product economics

Routine learning should run deterministically wherever practical.

**Deterministic** means the same defined inputs produce predictable
outputs according to explicit code/rules rather than requiring an AI
model to decide each time.

Likely deterministic functions include:

-   objective marking;
-   numerical question variation;
-   formula/calculation checking;
-   mastery updates;
-   prerequisite traversal;
-   curriculum coverage;
-   spaced-repetition scheduling;
-   question selection;
-   progress calculation;
-   many recommendation rules;
-   entitlement/billing logic.

AI should be reserved for functions where it materially improves value,
such as:

-   nuanced explanations;
-   natural-language interpretation;
-   content-development assistance;
-   selected free-text assessment;
-   difficult misconception explanation;
-   optional/premium tutoring.

The proving slice must demonstrate that live AI is **not required for
every learner interaction**.

------------------------------------------------------------------------

# 18. Security decision

Security is an architectural property from the beginning, not a
launch-hardening exercise.

The product is intended eventually to scale from thousands to
potentially very large user populations.

Phase 1 must therefore use production-shaped security patterns even
though the initial cohort is tiny.

Minimum principles include:

-   authentication on protected routes;
-   Row Level Security on learner-owned database data;
-   least-privilege access;
-   no fully public application tables without explicit justification;
-   server-side API keys/secrets;
-   secrets supplied through environment/configuration management rather
    than committed to the repository;
-   rate limiting;
-   input validation and sanitisation;
-   safe production error messages;
-   no stack traces exposed to learners;
-   locked-down/disabled debugging and administration endpoints;
-   dependency management/scanning;
-   security headers where applicable;
-   logging/monitoring;
-   backup/recovery thinking;
-   auditability for sensitive administrative actions.

**RLS --- Row Level Security** means the database itself restricts which
records a user is allowed to access. It provides protection even if
application code makes certain mistakes.

Security requirements should be informed by established frameworks such
as **OWASP ASVS** rather than invented ad hoc.

**OWASP ASVS --- Open Worldwide Application Security Project Application
Security Verification Standard** is a structured set of web-application
security requirements. It matters because it gives the project a
recognised checklist against which security decisions can be assessed.

External penetration testing is not required to build the proving slice,
but the architecture should not knowingly create debt that makes later
independent assurance difficult.

------------------------------------------------------------------------

# 19. Development-stream decision

Development must remain separated into coordinated streams.

## Stream A --- Knowledge gathering and processing

Sources → assertions → provenance → relationships → mappings.

## Stream B --- Question and learning-content development

Assertions → questions → distractors/misconceptions → explanations →
remediation → retests.

## Stream C --- Learning-delivery intelligence

Learner evidence → mastery → diagnosis → scheduling → remediation
selection → transfer testing.

## Stream D --- Platform/application development

Authentication → database → APIs → learner UI → administration →
security → observability → deployment.

These streams are separate for governance and development control but
must remain aware of one another.

Architecture changes in one stream must be assessed for
regression/compatibility effects on the others.

------------------------------------------------------------------------

# 20. Learner-facing quality decision

Backend sophistication does not compensate for a mediocre product.

Before commercial launch, the learner-facing application must be
class-leading relative to the relevant competition.

This includes:

-   excellent mobile experience;
-   fast interaction;
-   clear progress;
-   obvious next action;
-   useful feedback;
-   targeted learning;
-   transparent readiness/mastery;
-   low friction;
-   accessibility;
-   trust;
-   useful reference navigation;
-   coherent qualification journey;
-   progressive disclosure of feedback;
-   a fast exam-focused route for learners who want minimum
    intervention;
-   deeper diagnosis/remediation for learners who want or need it;
-   one coherent learner model underneath both experiences.

The proving slice must therefore contain a real learner interface.

It must demonstrate that diagnostic sophistication improves the chosen
learner outcome without requiring every learner to consume the deepest
available explanation.

A command-line/backend demonstration is insufficient.

------------------------------------------------------------------------

# 21. Phase 1 definition

## Phase 1 --- Architecture & End-to-End Proving Slice

### Objective

Build a deliberately small but production-shaped slice of the real
system that proves the complete chain:

``` text
AUTHORITATIVE SOURCE
        ↓
KNOWLEDGE ASSERTION
        ↓
PRECISE PROVENANCE
        ↓
PREREQUISITE RELATIONSHIP
        ↓
MISCONCEPTION
        ↓
QUESTION
        ↓
LEARNER RESPONSE
        ↓
EVIDENCE
        ↓
MASTERY UPDATE
        ↓
ROOT-CAUSE INFERENCE
        ↓
TARGETED REMEDIATION
        ↓
FOUNDATIONAL RETEST
        ↓
ELECTRICAL TRANSFER RETEST
        ↓
UPDATED LEARNER MODEL
        ↓
NEXT ACTIVITY
```

The purpose is **not breadth**.

It is to prove that the architecture and learner experience work
end-to-end before multiplying content.

------------------------------------------------------------------------

# 22. Phase 1 knowledge scope

The exact assertions should be chosen during Phase 1 planning, but the
proving slice should be deliberately small.

Provisional order of magnitude:

> **20--50 tightly related approved assertions.**

This is not a quota.

Use the smallest corpus that can genuinely demonstrate:

-   Maths prerequisites;
-   Physics prerequisites;
-   Electrical domain knowledge;
-   multiple plausible causes for learner failure;
-   misconception-linked distractors;
-   remediation;
-   transfer testing.

The slice should be selected because it stresses the architecture, not
because it is the easiest material to implement.

------------------------------------------------------------------------

# 23. What Phase 1 must build

At minimum:

## Knowledge

-   source records;
-   source versions;
-   source locators;
-   assertions;
-   prerequisite relationships;
-   curriculum mappings;
-   misconception representation;
-   version/status/audit model.

## Learning content

-   original questions;
-   deterministic variants where useful;
-   mapped distractors;
-   explanations;
-   remediation;
-   foundational retests;
-   Electrical transfer questions.

## Learner model

-   persistent learner;
-   evidence records;
-   mastery state;
-   confidence/evidence strength;
-   diagnosis;
-   next-activity selection.

## Application

-   secure sign-in;
-   protected learner account;
-   question flow;
-   feedback/remediation UI;
-   progress/mastery UI;
-   mobile-first responsive interface;
-   basic account controls.

## Operations

-   environment separation/configuration;
-   safe secrets handling;
-   logging;
-   basic monitoring;
-   backups/recovery approach;
-   automated testing;
-   reproducible deployment.

------------------------------------------------------------------------

# 24. What Phase 1 must NOT become

The following are explicitly outside Phase 1 unless required to prove
the slice:

-   complete 2365 coverage;
-   complete 2357 coverage;
-   complete AM2 preparation;
-   complete BS 7671 revision product;
-   complete Functional Skills Maths;
-   complete Foundational Physics;
-   Engineering;
-   HVAC;
-   Plumbing;
-   Automotive;
-   Ireland;
-   Australia;
-   USA;
-   native iOS app;
-   native Android app;
-   full college dashboards;
-   LMS integrations;
-   NVQ/ePortfolio replacement;
-   employer HR functionality;
-   tutor marketplace;
-   social network/community;
-   elaborate gamification;
-   unrestricted AI chat;
-   mass proprietary-source ingestion;
-   large question-bank generation;
-   premature performance engineering for millions of users;
-   paid marketing system.

A requirement may be designed for future extensibility without being
implemented now.

------------------------------------------------------------------------

# 25. Phase 1 architectural rule

> **Build production-shaped, not production-sized.**

Meaning:

Use patterns that can plausibly scale and remain secure, but do not pay
for or build capacity that current evidence does not require.

Examples:

Good:

-   RLS from day one;
-   clean database migrations;
-   modular domain boundaries;
-   source/version-aware assertions;
-   secure secrets;
-   automated tests;
-   structured logging.

Not required:

-   multi-region infrastructure;
-   Kubernetes;
-   complex microservices;
-   enterprise data warehouse;
-   huge event-streaming architecture;
-   premature sharding.

**Microservices** means splitting a system into separately deployed
network services. This can help very large organisations/systems but
adds significant operational complexity. Phase 1 should not adopt it
merely because the eventual ambition is large.

------------------------------------------------------------------------

# 26. Phase 1 measurement requirements

Phase 1 must produce evidence, not merely software.

Measure:

## Content economics

-   source-processing time;
-   candidate assertions/hour;
-   approved assertions/hour;
-   rejection/correction rate;
-   provenance effort;
-   question creation/review time;
-   remediation creation/review time.

## Runtime economics

-   AI calls per learner activity;
-   AI tokens/cost;
-   database/compute usage;
-   transactional-email usage;
-   approximate cost per active learner.

## Learning-engine behaviour

-   evidence required before diagnosis;
-   diagnostic confidence;
-   false/ambiguous diagnosis cases;
-   remediation selection;
-   retest outcomes;
-   transfer outcomes.

## Product behaviour

With test learners when appropriate:

-   completion;
-   abandonment;
-   return usage;
-   confusing interactions;
-   time to useful feedback;
-   perceived usefulness.

## Engineering

-   automated-test coverage where meaningful;
-   deployment reliability;
-   security failures/findings;
-   performance;
-   error rates.

------------------------------------------------------------------------

# 27. Phase 1 exit gate

Phase 1 is complete only when the Product Owner can make an
evidence-based decision on the following.

## Gate A --- Knowledge model

Can assertions, provenance, versions, prerequisites and mappings
represent the real subject matter without awkward workarounds?

## Gate B --- Content pipeline

Can high-quality governed content be produced at a plausible rate?

## Gate C --- Learner evidence

Can learner responses be converted into persistent, interpretable
evidence?

## Gate D --- Diagnosis

Can the system distinguish at least the intended
Maths/Physics/Electrical failure modes without pretending to certainty
from insufficient evidence?

## Gate E --- Remediation

Can it select targeted learning that addresses the probable underlying
problem?

## Gate F --- Transfer

Can it test whether foundational remediation transfers back into
Electrical application?

## Gate G --- Deterministic economics

Can the core loop operate predominantly without live AI inference?

## Gate H --- UX and learner intent

Does the real learner-facing mobile experience feel materially
better/more useful than an ordinary question bank?

Can a learner move quickly with minimal feedback when that is their
goal, while another learner can smoothly access diagnosis, prerequisite
repair and deeper teaching from the same underlying system?

Does the platform avoid forcing deep remediation merely because it has
identified a possible weakness?

## Gate I --- Security

Are production-shaped authentication, data isolation, secrets, rate
limiting, validation, safe errors and logging in place?

## Gate J --- Scalability

Can the architecture plausibly expand from tens of assertions to
thousands without fundamental redesign?

If one or more gates fail, the response is not automatically
abandonment.

The correct response may be:

> redesign → rerun proving slice → reassess.

But corpus-scale expansion must not proceed merely because substantial
development work has already been completed.

------------------------------------------------------------------------

# 28. Expansion gate after Phase 1

The next major decision is:

> **Do we expand from the proving corpus into the full agreed Electrical
> knowledge/product scope?**

Approval requires:

-   architecture proven;
-   content economics acceptable;
-   learner loop credible;
-   deterministic runtime demonstrated;
-   security foundation sound;
-   no unresolved fatal IP issue;
-   learner-facing experience strong enough to justify further
    investment.

This prevents sunk-cost momentum.

**Sunk cost** means resources already spent that cannot be recovered.
Good decisions should be based on future value, not on continuing merely
because substantial work has already been done.

------------------------------------------------------------------------

# 29. Principal Phase 0 risk register

Scales:

**Likelihood:** Low / Medium / High\
**Impact:** Moderate / High / Critical

------------------------------------------------------------------------

## R1 --- Product differentiation is insufficient

**Likelihood:** Medium\
**Impact:** Critical

### Risk

Learners may regard the product as a complicated question bank and
prefer free mocks + ChatGPT/Claude/general web resources.

### Mitigation

Do not require learners to value diagnosis as an end in itself. Use the
diagnostic engine to improve different outcomes, including rapid exam
preparation, readiness, targeted weakness repair and deeper mastery.

Expose feedback progressively so learners can choose or naturally
receive the depth appropriate to their goal.

### Evidence required

Real learner feedback and behaviour across different learner intents,
including whether learners prefer rapid exam-focused support, deeper
diagnosis/remediation, or move between them.

### Rethink trigger

Users consistently report little incremental value from the
adaptive/root-cause workflow.

------------------------------------------------------------------------

## R2 --- Diagnostic accuracy is inadequate

**Likelihood:** Medium\
**Impact:** Critical

### Risk

The platform incorrectly attributes errors to Maths, Physics or
Electrical misconceptions.

### Mitigation

-   evidence accumulation;
-   confidence thresholds;
-   multiple diagnostic probes;
-   no diagnosis from one answer;
-   explicit uncertainty;
-   transfer testing.

### Rethink trigger

False diagnosis remains common after reasonable iteration.

------------------------------------------------------------------------

## R3 --- Content-production economics fail

**Likelihood:** Medium\
**Impact:** Critical

### Risk

Assertions/questions/remediation require too much manual review to
scale.

### Mitigation

Measure the complete pipeline in Phase 1 and improve tooling before
corpus expansion.

### Rethink trigger

Production remains prohibitively slow despite AI-assisted workflow
improvements.

------------------------------------------------------------------------

## R4 --- Proprietary-source/IP model is unacceptable

**Likelihood:** Low--Medium / unresolved\
**Impact:** Critical

### Risk

Legal/licensing restrictions make the intended scalable
proprietary-reference workflow impractical.

### Mitigation

-   no proprietary source corpus in production;
-   independent assertion wording;
-   precise provenance;
-   temporary controlled processing;
-   rights metadata;
-   focused professional advice when justified.

### Rethink trigger

Credible legal review indicates the intended workflow creates
unacceptable infringement/licensing exposure.

------------------------------------------------------------------------

## R5 --- Free competition prevents willingness to pay

**Likelihood:** Medium\
**Impact:** High

### Risk

Free electrical questions/resources satisfy enough learners.

### Mitigation

Compete on diagnosis, targeted learning, progress, confidence/readiness
and cross-qualification value rather than question volume.

### Evidence required

100 → 500 → 1,000 paid learner milestones.

### Rethink trigger

Strong usage but persistent refusal to pay at reasonable tested prices.

------------------------------------------------------------------------

## R6 --- Organic distribution fails

**Likelihood:** Medium\
**Impact:** High

### Risk

Founder outreach/influencer/trainer/referral channels do not generate
sufficient relevant users.

### Mitigation

Track acquisition by channel and iterate positioning.

### Rethink trigger

Meaningful product validation requires persistently expensive
acquisition with weak LTV.

------------------------------------------------------------------------

## R7 --- Retention is too short

**Likelihood:** Medium\
**Impact:** High

### Risk

Learners subscribe only immediately before an exam and cancel.

### Mitigation

-   qualification journey;
-   persistent mastery;
-   progression across modules;
-   later qualification products;
-   annual plan;
-   useful continuous readiness.

### Rethink trigger

Actual LTV cannot support acquisition/content economics.

------------------------------------------------------------------------

## R8 --- AI operating costs grow excessively

**Likelihood:** Low--Medium\
**Impact:** High

### Risk

Product quality becomes dependent on frequent expensive model calls.

### Mitigation

Deterministic-first architecture and AI cost monitoring.

### Rethink trigger

Routine product usage requires \>£7/learner-year AI cost without
corresponding premium revenue; \>£15 is a major architecture warning.

------------------------------------------------------------------------

## R9 --- Security failure

**Likelihood:** Low--Medium\
**Impact:** Critical

### Risk

Account/data exposure damages learners, reputation or regulatory
position.

### Mitigation

Security-by-design, RLS, least privilege, secrets management, rate
limiting, validation, logging, testing and later independent assurance.

### Rethink trigger

Unresolved high-severity vulnerabilities or architecture that cannot
enforce tenant/user isolation.

------------------------------------------------------------------------

## R10 --- Founder dependency

**Likelihood:** High initially\
**Impact:** High later

### Risk

Development/content/product knowledge remains dependent on one person.

### Mitigation

-   documentation;
-   governed workflows;
-   automated tests;
-   reproducible tooling;
-   provenance;
-   explicit architecture;
-   revenue-funded delegation later.

### Rethink trigger

Core processes cannot be delegated/reproduced without founder memory.

------------------------------------------------------------------------

## R11 --- Scope creep

**Likelihood:** High\
**Impact:** High

### Risk

AI-assisted development makes it easy to continually add attractive
features/domains.

### Mitigation

WP0.7 and Phase 1 explicit non-goals; formal scope-change decisions.

### Rethink trigger

Phase 1 begins implementing full qualifications or unrelated platform
features before exit gates are met.

------------------------------------------------------------------------

## R12 --- Second-vertical reuse is weaker than expected

**Likelihood:** Medium\
**Impact:** High

### Risk

Engineering requires almost as much foundational/platform work as
Electrical.

### Mitigation

Measure Marginal Vertical Cost Ratio after Electrical.

### Rethink trigger

Shared Maths/Physics/learning architecture produces little measurable
reduction in second-vertical effort.

------------------------------------------------------------------------

## R13 --- Source/version maintenance becomes burdensome

**Likelihood:** Medium\
**Impact:** High

### Risk

Regulations/guidance/curricula change and create large maintenance
workload.

### Mitigation

Versioned sources, precise assertion provenance, impact analysis and
mappings.

### Rethink trigger

A source update cannot be mechanically traced to affected
assertions/content.

------------------------------------------------------------------------

## R14 --- Learner-facing UX underperforms

**Likelihood:** Medium\
**Impact:** Critical

### Risk

Technically sophisticated backend but poor mobile experience prevents
adoption.

### Mitigation

Build learner UI in the proving slice and test continuously.

### Rethink trigger

Users prefer simpler incumbent products despite better underlying
intelligence.

------------------------------------------------------------------------

## R15 --- Platform architecture over-engineers the problem

**Likelihood:** Medium\
**Impact:** High

### Risk

Ambition to serve millions produces unnecessary complexity and delays
validation.

### Mitigation

"Production-shaped, not production-sized."

### Rethink trigger

Infrastructure/platform work materially outruns learner/product
evidence.

------------------------------------------------------------------------

# 30. Phase 0 assumptions register

The following remain hypotheses rather than facts:

-   £9.99/month and £79.99/year are acceptable prices;
-   learners value root-cause diagnosis enough to pay;
-   annual subscriptions will be attractive;
-   AI cost can remain ≤£3/learner-year;
-   direct variable delivery cost can remain ≤£12;
-   contribution can remain ≥£50/learner-year;
-   first users can be acquired with £0 paid CAC;
-   \<£1,000 incremental cash to first paying users is achievable;
-   Electrical customers can have \>1 qualification/module relationship;
-   assertion production becomes efficient enough to scale;
-   proprietary-source processing is legally/commercially acceptable;
-   Engineering will reuse substantial Maths/Physics/platform assets;
-   B2B providers will eventually pay for cohort access;
-   the UK market alone can support a meaningful initial company.

These should progressively move from assumptions to measured facts.

------------------------------------------------------------------------

# 31. Phase 0 decisions frozen unless evidence changes

The following should now be treated as established project decisions
rather than repeatedly reopened during implementation:

1.  UK first.
2.  Electrical first full vocational vertical.
3.  Foundational Maths is reusable horizontal knowledge.
4.  Foundational Physics is reusable horizontal knowledge.
5.  First proving slice spans these domains where useful.
6.  Governed knowledge assertions are the core durable knowledge
    representation.
7.  Precise provenance is mandatory.
8.  Proprietary source documents are not the production knowledge asset.
9.  Deterministic-first learner delivery.
10. Root-cause diagnosis/remediation is central differentiation.
11. Learner-facing quality is a launch gate.
12. Security is designed from the beginning.
13. Founder + AI bootstrap.
14. £0 paid CAC initially.
15. \<£1,000 incremental cash-to-first-paying-user target.
16. Up to 100% early revenue reinvestment.
17. No requirement for founder income during bootstrap.
18. Full marketed launch should demonstrate multiple vocational
    verticals.
19. Electrical users should be tested/monetised before full
    multi-vertical launch.
20. Engineering is provisional, not yet a frozen second-vertical scope.
21. Phase 1 proves architecture at small scale before mass content
    production.

A decision may be reopened when **new evidence** contradicts it.

It should not be reopened merely because an AI assistant, developer or
new session proposes a different approach without new evidence.

------------------------------------------------------------------------

# 32. Project-control rule for AI-assisted development

Because much of the project will be developed with AI assistance, every
major AI coding/research session should be constrained by:

1.  current approved project documentation;
2.  current phase/work-package objective;
3.  explicit in-scope work;
4.  explicit non-goals;
5.  architecture/security constraints;
6.  required evidence/output;
7.  stop/approval point.

AI services should not be allowed to silently redefine:

-   product scope;
-   architecture;
-   security posture;
-   knowledge governance;
-   IP policy;
-   launch strategy;
-   commercial assumptions.

Where implementation reveals a conflict, the AI should surface the
conflict for Product Owner decision rather than silently changing the
governing decision.

------------------------------------------------------------------------

# 33. Phase 1 entry gate

Phase 1 may begin when WP0.7 is approved.

Before implementation starts, Phase 1 should itself be decomposed into
controlled work packages covering at least:

-   proving-slice subject selection;
-   knowledge/assertion schema;
-   provenance/source schema;
-   curriculum mapping;
-   misconception/prerequisite model;
-   question/content model;
-   learner evidence/mastery model;
-   diagnostic logic;
-   deterministic runtime architecture;
-   platform/data/security architecture;
-   learner UX;
-   testing/evidence plan;
-   deployment/operations.

The exact sequence should be designed before coding begins.

------------------------------------------------------------------------

# 34. Phase 0 final verdict

Phase 0 began with a broad question:

> Could a governed knowledge-assertion architecture be used to build a
> commercially successful vocational learning/revision platform?

The resulting thesis is substantially stronger and more specific:

> **Build a UK-first, secure, deterministic-first adaptive vocational
> learning platform whose durable asset is a precisely sourced knowledge
> system and whose learner advantage is the ability to identify probable
> underlying weaknesses, remediate them at the correct
> foundational/domain layer, and verify transfer back into vocational
> application.**

The first knowledge foundations are:

> **Maths + Physics.**

The first full vocational vertical is:

> **Electrical.**

The initial development method is:

> **a tiny production-shaped end-to-end proving slice.**

The financing method is:

> **ultra-lean founder + AI bootstrap, followed by aggressive but
> disciplined revenue reinvestment.**

The immediate commercial objective is not millions of users.

It is:

> **prove the learning thesis → prove people will pay → allow revenue to
> finance the next level of product quality and scope.**

On the evidence available at the end of Phase 0:

# GO TO PHASE 1

subject to Product Owner approval of this work package.

------------------------------------------------------------------------

# 35. Phase 0 closure

If WP0.7 is approved:

-   WP0.1--WP0.7 collectively constitute the Phase 0 evidence/decision
    set;
-   broad preliminary market feasibility is considered complete;
-   further research should be driven by a specific unresolved Phase
    1/commercial decision rather than open-ended exploration;
-   the next task is to create the detailed Phase 1 plan and
    work-package sequence;
-   implementation should not begin until that Phase 1 plan is approved.

------------------------------------------------------------------------

**End of WP0.7**
