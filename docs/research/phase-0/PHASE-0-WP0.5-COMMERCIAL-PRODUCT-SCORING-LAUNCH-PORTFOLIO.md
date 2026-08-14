# Phase 0 --- WP0.5: Commercial/Product Scoring and Launch-Portfolio Decision

**Status:** Draft for Product Owner review\
**Date:** 13 August 2026\
**Market:** United Kingdom first\
**Depends on:** WP0.1--WP0.4\
**Purpose:** Convert Phase 0 evidence into a disciplined decision about
the first knowledge foundations, first development slice, first
commercial vertical, likely launch portfolio, and explicit non-launch
scope.

------------------------------------------------------------------------

# 1. Decision in brief

Phase 0 evidence supports continuing.

The recommended sequence is:

``` text
FOUNDATIONAL KNOWLEDGE LAYER
├── Foundational Maths
└── Foundational Physics
          │
          ▼
SMALL ELECTRICAL / MATHS / PHYSICS
END-TO-END DEVELOPMENT SUB-SLICE
          │
          ▼
ELECTRICAL
FIRST FULL COMMERCIAL VERTICAL
          │
          ▼
SECOND TECHNICAL VERTICAL
selected after evidence checkpoint
          │
          ▼
MULTI-VERTICAL UK COMMERCIAL LAUNCH
```

The strongest current candidate for the second full technical vertical
is **Engineering**, but WP0.5 does **not** recommend irrevocably
committing to it yet.

Electrical should remain the first full vertical because it combines:

-   attractive learner lifecycle;
-   several qualification/entry routes;
-   substantial knowledge-based assessment;
-   strong maths and physics dependency;
-   good deterministic question potential;
-   career-long post-qualification learning;
-   fragmented learner resources;
-   plausible B2C willingness to pay;
-   later B2B opportunity;
-   unusually strong Product Owner domain-validation advantage.

Foundational Maths and Foundational Physics should be treated as
**horizontal knowledge domains**, not as electrical content.

------------------------------------------------------------------------

# 2. Important terminology

## Horizontal

A **horizontal** is reusable capability or knowledge that supports
several markets.

Example:

``` text
Foundational Maths
      ├── Electrical
      ├── Engineering
      ├── Plumbing/HVAC
      └── Automotive
```

It matters because we build the knowledge once and reuse it.

## Vertical

A **vertical** is a specific subject/professional market such as
Electrical or Automotive.

## Weighted score

A **weighted score** gives more important decision factors more
influence than less important ones.

It is useful for disciplined comparison, but it is **not objective
truth**. The evidence behind the score matters more than whether one
candidate scores 78 rather than 76.

## Option value

**Option value** means building something now that creates several
valuable choices later.

Foundational Maths and Physics have high option value because they can
support many future qualifications.

------------------------------------------------------------------------

# 3. Foundational Physics --- explicit architecture decision

WP0.5 adds **Foundational Physics** as a first-class reusable knowledge
domain.

The Electrical curriculum requires basic physical/scientific
understanding. Engineering and several later technical verticals will
reuse much of it.

It should therefore not be buried inside Electrical.

The intended architecture becomes:

``` text
              FOUNDATIONAL KNOWLEDGE

        ┌─────────────┴─────────────┐
        │                           │
      MATHS                       PHYSICS
        │                           │
        └─────────────┬─────────────┘
                      │
        ┌─────────────┼──────────────┐
        ▼             ▼              ▼
   ELECTRICAL     ENGINEERING     HVAC / etc.
```

Likely reusable physics areas include, at an appropriate vocational
depth:

-   units and measurement;
-   force;
-   mass and weight;
-   work;
-   energy;
-   power;
-   efficiency;
-   heat and temperature;
-   thermal transfer;
-   pressure;
-   basic mechanics;
-   materials and physical properties;
-   magnetism/electromagnetism foundations;
-   basic waves where required;
-   other elementary scientific relationships evidenced by target
    curricula.

The exact ontology must be derived from curriculum/source analysis
rather than from this preliminary list.

Some concepts sit at the boundary between physics and Electrical. The
architecture should favour **one canonical assertion with mappings**
rather than duplicating the same knowledge in several domains.

------------------------------------------------------------------------

# 4. What WP0.5 is deciding

There are four separate decisions.

## Decision A --- shared foundations

What reusable knowledge should be built from the beginning?

**Recommendation: Foundational Maths + Foundational Physics.**

## Decision B --- first development proof

What is the smallest product that proves the architecture and
differentiation?

**Recommendation: Electrical/Maths/Physics end-to-end sub-slice.**

## Decision C --- first full commercial vertical

Which complete vocational ecosystem should be built first?

**Recommendation: Electrical.**

## Decision D --- launch breadth

Should the company launch commercially after Electrical alone is
complete?

**Recommendation: No.**

The intended commercial launch should demonstrate that the platform is
genuinely multi-domain rather than a sophisticated single-qualification
question bank.

------------------------------------------------------------------------

# 5. Scoring methodology

Candidates are scored 1--5 on each criterion:

**1 = poor**\
**2 = weak**\
**3 = acceptable/mixed**\
**4 = strong**\
**5 = exceptional**

The scores are **Phase 0 decision aids**, not audited market statistics.

Three evidence classes are used:

-   **E** --- evidenced reasonably strongly by Phase 0 research;
-   **I** --- informed inference from available evidence;
-   **J** --- strategic judgement requiring later validation.

------------------------------------------------------------------------

# 6. Weighted criteria

The proposed weights total 100.

## A. UK learner/commercial opportunity --- 15

Does the subject have enough learners and repeat commercial opportunity?

## B. Willingness to pay / economic value --- 10

Do learners/providers already spend money solving the problem?

## C. Competitive opportunity --- 10

Can we plausibly create a materially better product?

A weak market with no competitors does not automatically score highly;
absence of competition may indicate absence of demand.

## D. Knowledge-source/IP feasibility --- 10

Can we build the knowledge asset sustainably without unacceptable
licensing dependency?

## E. Deterministic-delivery potential --- 8

Can substantial learning, marking, scheduling and question variation run
without expensive LLM inference?

## F. Diagnostic/adaptive value --- 10

Does identifying underlying misconceptions/prerequisites materially
improve learning?

## G. Cross-domain knowledge reuse --- 12

How much of what we build becomes useful elsewhere?

## H. Learner lifecycle / repeat use --- 8

Can the learner remain valuable across several stages/qualifications?

## I. B2B expansion potential --- 7

Could colleges, training providers or employers gain meaningful value
later?

## J. Content-production feasibility --- 5

How feasible is it to produce sufficient high-quality governed content?

## K. Product Owner validation advantage --- 5

Can the Product Owner personally sense-check the first product and
qualification journey?

This factor matters disproportionately at the beginning even though it
should matter less as the company matures.

------------------------------------------------------------------------

# 7. Candidate scoring summary

The current Phase 0 strategic scores are:

``` text
Electrical                 88 / 100
Engineering                80 / 100
Foundational Maths         79 / 100
Foundational Physics       75 / 100*
HVAC / Refrigeration       74 / 100
Plumbing / Heating         72 / 100
Automotive                 72 / 100
Accounting / AAT           68 / 100
Welding / Fabrication      61 / 100
```

`*` Foundational Physics is not being proposed primarily as a standalone
launch market. Its score reflects its strategic value as a reusable
knowledge domain. Its standalone commercial score would be lower.

These numbers should **not** be read as market valuations.

A difference of a few points is not meaningful enough to determine
investment by itself.

------------------------------------------------------------------------

# 8. Electrical --- 88/100

## Commercial opportunity --- 5/5

The relevant ecosystem extends beyond the apprenticeship route:

-   apprentices;
-   de novo/non-apprentice learners;
-   NVQ/competence learners;
-   Experienced Worker/qualification-gap learners;
-   AM2-family candidates;
-   post-qualification learners.

## Willingness to pay --- 4/5

The market already supports:

-   paid apps;
-   £20-ish exam simulators;
-   books;
-   expensive training packages;
-   specialist qualification courses.

Free competition means price cannot be justified by question access
alone.

## Competitive opportunity --- 5/5

Good revision products exist, but Phase 0 found no clear dominant
electrical product implementing our proposed:

> root-cause diagnosis → prerequisite remediation → transfer retest

model across maths/physics/electrical knowledge.

## IP/source feasibility --- 4/5

Mixed source environment.

Open government/HSE/scientific knowledge is strong, but professional
references such as BS 7671/GN3/OSG require controlled provenance/IP
handling.

## Deterministic potential --- 5/5

Excellent for:

-   calculations;
-   numerical variants;
-   marking;
-   scheduling;
-   mastery updates;
-   many diagnostic rules.

## Diagnostic value --- 5/5

Electrical failures can originate in:

-   electrical understanding;
-   maths;
-   foundational physics;
-   units;
-   formula manipulation;
-   misconceptions;
-   reference-navigation weakness.

This is exceptionally well aligned with the proposed product.

## Reuse --- 5/5

Maths, physics, safety, measurement and some technical foundations
transfer strongly to later domains.

## Learner lifecycle --- 5/5

Potential relationship from entry through qualification and later
specialist/updating qualifications.

## B2B --- 4/5

Strong future potential with colleges/training providers.

## Content feasibility --- 4/5

Large corpus, but highly structured and partly deterministic.

## Product Owner validation --- 5/5

Exceptional for the first build because the Product Owner is undertaking
the relevant qualification pathway.

### Decision

> **FIRST FULL VERTICAL.**

------------------------------------------------------------------------

# 9. Engineering --- 80/100

Engineering is currently the strongest second-vertical candidate.

## Why it scores strongly

Engineering has:

-   substantial vocational qualification breadth;
-   heavy reuse of Maths;
-   heavy reuse of Physics;
-   electrical/electronic overlap;
-   mechanical knowledge opportunities;
-   deterministic calculations;
-   strong diagnostic potential;
-   broad employer/training-provider relevance.

City & Guilds' wider vocational portfolio confirms substantial
engineering-related qualification infrastructure, while learner evidence
shows adult career changers using Level 3 engineering routes.

## Strategic attraction

By the time Engineering is started, we should already possess:

``` text
Maths
Physics
some Electrical
measurement concepts
units
formula handling
scientific reasoning
learner mastery engine
question engine
```

So Engineering becomes the first major test of whether the horizontal
architecture genuinely reduces marginal vertical cost.

**Marginal cost** here means the additional cost of adding the next
subject after the shared platform already exists.

### Main uncertainty

"Engineering" is too broad to be a launch specification.

Before development it must be narrowed into a coherent qualification
family, for example:

-   mechanical;
-   electrical/electronic;
-   maintenance;
-   manufacturing;
-   a defined City & Guilds/BTEC pathway.

### Decision

> **LEADING CANDIDATE FOR SECOND FULL VERTICAL --- further
> qualification-level validation required.**

------------------------------------------------------------------------

# 10. Foundational Maths --- 79/100

Maths scores extremely strongly strategically but differently
commercially.

## Strengths

-   exceptionally reusable;
-   excellent open authoritative curriculum sources;
-   deterministic;
-   inexpensive runtime;
-   easy to generate safe variants;
-   highly diagnostic;
-   required by many vocational learners;
-   potential standalone Functional Skills market.

## Weakness

Competition is strong.

CENTURY and specialist Functional Skills platforms already provide
adaptive/personalised maths learning.

### Decision

> **BUILD AS FOUNDATIONAL HORIZONTAL FROM DAY ONE.**

Standalone Functional Skills should be enabled by the architecture, but
we should not allow building a complete generic maths competitor to
delay proof of the Electrical product.

The initial Maths corpus should prioritise:

1.  concepts required by the Electrical development sub-slice;
2.  reusable foundational structure;
3.  expansion toward complete Functional Skills coverage.

------------------------------------------------------------------------

# 11. Foundational Physics --- 75/100 strategic score

Physics has enormous reuse value but weaker standalone vocational
consumer positioning than Maths.

## Strengths

-   highly reusable across Electrical and Engineering;
-   substantial deterministic content;
-   excellent prerequisite structure;
-   relatively stable fundamental knowledge;
-   useful for identifying whether an apparent vocational weakness is
    actually scientific misunderstanding.

## Example

A learner may correctly manipulate an electrical formula but
misunderstand:

> energy versus power.

That is not fundamentally an algebra failure.

A properly structured system should be capable of distinguishing those
causes.

## Standalone market

The project should **not initially build or market "Foundational
Physics" as a standalone consumer product**.

It is primarily infrastructure.

### Decision

> **BUILD AS FOUNDATIONAL HORIZONTAL FROM DAY ONE, initially to the
> depth demanded by Electrical.**

------------------------------------------------------------------------

# 12. HVAC / Refrigeration --- 74/100

This remains attractive.

Strengths include:

-   strong maths/physics reuse;
-   electrical overlap;
-   thermodynamics/heat-transfer knowledge;
-   pressure and units;
-   F-Gas/specialist learning;
-   adult career-changer interest;
-   continuing technical upskilling.

Recent learner discussions continue to show adult career changers
investigating short City & Guilds/F-Gas pathways and seeing substantial
HVAC job demand.

### Why not second by default?

The source/regulatory structure and practical competence pathways
require more specific investigation, and Engineering currently offers
broader reuse of the foundational knowledge we're already building.

### Decision

> **HIGH-PRIORITY POST-ELECTRICAL CANDIDATE.**

------------------------------------------------------------------------

# 13. Plumbing / Heating --- 72/100

Strengths:

-   substantial UK trade;
-   qualification progression;
-   adult learners;
-   maths/measurement;
-   physics;
-   pressure/flow/heat;
-   overlap with HVAC;
-   later gas/heating specialisms.

Current learner/provider discussions also indicate pathway/funding
complexity, which can create both learner need and product-maintenance
burden.

### Decision

> **ATTRACTIVE, but currently behind Engineering/HVAC for immediate
> expansion.**

------------------------------------------------------------------------

# 14. Automotive --- 72/100

Automotive deserves continued attention.

The Institute of the Motor Industry reported **25,437 certificates in Q3
2025 alone**, up 12% year-on-year, with 55% of training focused on light
vehicle/general maintenance.

The market also has:

-   Level 2/3 qualification pathways;
-   apprenticeships;
-   EV/hybrid upskilling;
-   MOT learning;
-   diagnostics;
-   continuing professional development.

## Strengths

-   large training ecosystem;
-   technical knowledge;
-   strong physics/electrical reuse as vehicles electrify;
-   long post-qualification lifecycle;
-   substantial B2B potential.

## Why not earlier?

Automotive introduces a large new domain and strong specialist
incumbents such as IMI.

It is attractive enough to remain on the strategic shortlist but not
attractive enough to displace Electrical or the first high-reuse
expansion.

### Decision

> **POST-LAUNCH / LATER LAUNCH CANDIDATE pending deeper
> competitor/source analysis.**

------------------------------------------------------------------------

# 15. Accounting / AAT --- 68/100

Accounting remains commercially interesting.

Strengths:

-   large structured qualification ecosystem;
-   highly deterministic calculations;
-   clear progression;
-   learner willingness to pay;
-   strong online-learning fit.

Weakness:

AAT itself provides significant learner support, practice assessments,
Green Light tests and progress tools.

It also shares less knowledge with the initial technical-trades
foundations than Engineering/HVAC/Plumbing.

### Decision

> **GOOD FUTURE DIVERSIFICATION VERTICAL, NOT FIRST CLUSTER.**

Its strategic value later may be precisely that it proves the platform
works beyond technical trades.

------------------------------------------------------------------------

# 16. Welding / Fabrication --- 61/100

Potential advantages:

-   vocational market;
-   engineering overlap;
-   maths/measurement;
-   materials knowledge;
-   qualification-based progression.

However, a larger proportion of competence is practical/physical,
reducing the proportion of learner outcome that our knowledge platform
can directly improve.

### Decision

> **DO NOT PRIORITISE BEFORE HIGHER-SCORING KNOWLEDGE-HEAVY VERTICALS.**

------------------------------------------------------------------------

# 17. Recommended first development sub-slice

The sub-slice should now include all three knowledge layers:

``` text
FOUNDATIONAL MATHS
       +
FOUNDATIONAL PHYSICS
       +
ELECTRICAL
       ↓
learner question
       ↓
evidence capture
       ↓
root-cause inference
       ↓
targeted remediation
       ↓
foundational retest
       ↓
electrical transfer retest
       ↓
updated mastery
       ↓
next activity
```

A good sub-slice should contain deliberately ambiguous failure modes.

For example, questions where the wrong answer could result from:

-   arithmetic;
-   algebra/formula transposition;
-   units;
-   misunderstanding power;
-   misunderstanding an electrical relationship;
-   incorrect application of a correct relationship.

The platform must accumulate enough evidence before diagnosing the
cause.

One wrong answer must **not** produce false certainty.

------------------------------------------------------------------------

# 18. Launch portfolio recommendation

The Product Owner has already indicated that public commercial launch
should not occur with only a single narrow vertical.

WP0.5 supports that decision.

However, "multiple verticals" should not become uncontrolled scope.

## Recommended minimum launch architecture

``` text
FOUNDATIONAL MATHS
        +
FOUNDATIONAL PHYSICS
        │
        ├────────── ELECTRICAL
        │          complete first commercial vertical
        │
        └────────── SECOND TECHNICAL VERTICAL
                   coherent useful qualification scope
```

The second vertical does **not necessarily need every qualification in
its profession**.

It needs enough coherent coverage to demonstrate genuine cross-domain
reuse and deliver a product someone would independently pay for.

## Current preferred second vertical

**Engineering**, subject to a later checkpoint selecting the exact
qualification family.

## Reserve candidates

1.  HVAC / Refrigeration
2.  Plumbing / Heating
3.  Automotive

------------------------------------------------------------------------

# 19. Why not launch Electrical immediately when it is ready?

There is a legitimate argument for doing so.

Earlier revenue would:

-   validate willingness to pay;
-   expose real learner behaviour;
-   generate usage data;
-   fund further content.

However, there is also a strategic reason to delay the **full marketed
platform launch** until multi-domain capability exists.

A one-domain launch risks the product being perceived as:

> another electrical revision app.

A multi-domain launch demonstrates:

> a learning platform whose intelligence and knowledge architecture
> transfer between qualifications.

## Recommended compromise

Do **not** wait to put Electrical in front of users.

Instead distinguish:

### Development/internal testing

Very early.

### Closed alpha

Small invited cohort using the Electrical sub-slice.

### Beta

Real Electrical learners use increasingly complete coverage.

### Paid pilot / early access

Permissible before the full portfolio launch if product quality is
sufficient.

### Full commercial platform launch

After Electrical + foundations + second coherent vertical meet launch
quality.

This gives us market evidence without prematurely declaring the platform
complete.

------------------------------------------------------------------------

# 20. Explicit pre-launch non-goals

Unless later evidence changes the decision, the following should **not**
be required for first full commercial launch:

-   Automotive;
-   Accounting/AAT;
-   every Engineering discipline;
-   every Electrical qualification ever issued;
-   Ireland;
-   Australia;
-   United States;
-   native iOS/Android apps if a first-class web/PWA experience is
    sufficient;
-   employer HR functionality;
-   full college LMS replacement;
-   complete ePortfolio/NVQ evidence-management replacement;
-   live tutor marketplace;
-   social network/community;
-   elaborate gamification;
-   unrestricted general-purpose AI chat;
-   proprietary publication replacement/library;
-   practical-skills certification.

**PWA --- Progressive Web App** means a website designed to behave much
like an installed app on phones/computers. It can reduce the cost of
maintaining separate iOS and Android applications.

These exclusions exist to protect launch.

------------------------------------------------------------------------

# 21. Product capabilities that ARE launch-critical

Across the selected launch portfolio, the platform must demonstrate:

## Knowledge

-   governed assertions;
-   precise provenance;
-   curriculum mappings;
-   prerequisites;
-   versioning;
-   source-rights controls.

## Assessment

-   strong original question inventory;
-   deterministic marking where possible;
-   realistic applied questions;
-   misconception-linked distractors;
-   mock/exam modes where appropriate.

## Learner intelligence

-   persistent mastery;
-   evidence confidence;
-   prerequisite/root-cause diagnosis;
-   cross-domain diagnosis;
-   retention/decay;
-   targeted next activity.

## Learning

-   concise remediation;
-   progressive practice;
-   foundational remediation;
-   transfer back into vocational context;
-   spaced retrieval.

## UX

-   excellent phone experience;
-   obvious next action;
-   transparent progress;
-   useful learner control;
-   fast interaction;
-   accessible design.

## Trust

-   learner-facing reference navigation where appropriate;
-   clear source/version information;
-   no false claim of official endorsement;
-   grounded AI where AI is used.

## Platform

-   secure authentication;
-   strict learner-data isolation;
-   rate limiting;
-   server-side secrets;
-   input validation;
-   production-safe errors;
-   monitoring/logging;
-   scalable architecture.

------------------------------------------------------------------------

# 22. AI role at launch

AI should be used where it adds genuine value.

It should **not** be required for routine actions that deterministic
software can perform better/cheaper.

Likely deterministic:

-   marking objective answers;
-   numerical generation;
-   scoring;
-   mastery updates;
-   spaced-repetition scheduling;
-   curriculum coverage;
-   prerequisite traversal;
-   progress;
-   many recommendations;
-   question selection;
-   analytics.

Likely AI-assisted:

-   nuanced explanation;
-   learner questions requiring natural-language interpretation;
-   misconception explanation;
-   content-development drafting;
-   some free-text marking;
-   personalised tutoring where deterministic content is insufficient.

This supports low operating cost at scale.

------------------------------------------------------------------------

# 23. Reuse economics hypothesis

The central economic hypothesis is now explicit:

> **Each additional technical vertical should become cheaper to build
> because it consumes already-governed foundational knowledge and
> platform capabilities.**

Example:

``` text
VERTICAL 1 — ELECTRICAL

Must build:
Maths foundation
Physics foundation
learner engine
question engine
diagnostic engine
content governance
platform
Electrical content

                 ↓ reuse

VERTICAL 2 — ENGINEERING

Already exists:
Maths ✓
Physics ✓
learner engine ✓
question engine ✓
diagnostic engine ✓
governance ✓
platform ✓

Main incremental work:
Engineering-specific knowledge
curriculum mappings
questions/remediation
domain validation
```

This hypothesis must be measured when the second vertical is built.

If the second vertical costs essentially the same as the first, a major
part of the platform thesis has failed.

------------------------------------------------------------------------

# 24. Commercial moat after WP0.5

The intended moat is the accumulated system of:

``` text
GOVERNED KNOWLEDGE
        +
PRECISE PROVENANCE
        +
PREREQUISITE STRUCTURE
        +
MISCONCEPTION MODEL
        +
QUESTION / EVIDENCE MAPPINGS
        +
LEARNER MASTERY HISTORY
        +
CROSS-DOMAIN DIAGNOSIS
        +
ADAPTIVE DELIVERY
```

The moat strengthens as:

-   more assertions are validated;
-   more qualifications map onto them;
-   more misconceptions are modelled;
-   diagnostic rules improve;
-   more learner evidence accumulates;
-   more domains reuse the same foundations.

This is much harder to reproduce than a large question bank.

------------------------------------------------------------------------

# 25. Principal commercial risks

## Risk A --- diagnosis is not sufficiently accurate

Mitigation:

Prove it in the first small sub-slice before corpus-scale investment.

## Risk B --- content production is too expensive

Mitigation:

Capture WP0.4 content-economics metrics.

## Risk C --- learners will not pay enough

Mitigation:

Closed testing → beta → paid Electrical early access before full launch.

## Risk D --- second vertical does not reuse enough

Mitigation:

Measure reused assertions/platform components and marginal content cost.

## Risk E --- launch scope expands indefinitely

Mitigation:

Treat Section 20 as explicit non-goals unless formally changed.

## Risk F --- excellent backend, mediocre learner product

Mitigation:

Learner-facing quality is a launch gate, not post-launch polish.

The platform must beat incumbent experiences in usefulness, clarity and
responsiveness from day one.

------------------------------------------------------------------------

# 26. Evidence checkpoint before selecting second vertical

Do not select Engineering solely because it currently scores highest.

After the Electrical sub-slice and before major second-vertical content
investment, compare Engineering, HVAC/Refrigeration and Plumbing/Heating
using actual evidence from development.

At that point we will know:

-   true assertion-production cost;
-   true maths reuse;
-   true physics reuse;
-   question-production cost;
-   diagnostic performance;
-   learner response;
-   runtime cost;
-   likely pricing.

The second-vertical decision should therefore be **evidence-informed
twice**:

1.  Phase 0 preliminary selection;
2.  post-sub-slice confirmation.

------------------------------------------------------------------------

# 27. Current product roadmap decision

Subject to Product Owner approval, WP0.5 establishes:

## Stage 1 --- Foundations

Design canonical:

-   Foundational Maths;
-   Foundational Physics.

Only build enough initial coverage to support the proving slice, while
ensuring the ontology can expand correctly.

## Stage 2 --- Proving slice

Build a deliberately small Electrical/Maths/Physics chain through the
complete production-shaped architecture.

## Stage 3 --- Electrical expansion

Expand into the complete agreed first Electrical commercial scope.

## Stage 4 --- Real-user validation

Closed alpha → beta → potentially paid early access.

## Stage 5 --- Second vertical

Default candidate: Engineering.

Re-score before committing.

## Stage 6 --- Full UK launch

Launch the multi-domain platform when:

-   Electrical meets launch quality;
-   Foundational Maths/Physics support required coverage;
-   second vertical is independently useful;
-   diagnosis works;
-   content economics are acceptable;
-   security/reliability gates pass;
-   learner UX beats the relevant competitors.

------------------------------------------------------------------------

# 28. WP0.5 decision record proposed

Approve the following:

1.  Foundational Maths is a first-class horizontal knowledge domain.
2.  Foundational Physics is a first-class horizontal knowledge domain.
3.  Neither should be architecturally subordinate to Electrical.
4.  Initial foundational coverage should nevertheless be driven by the
    first proving slice to avoid overbuilding.
5.  Electrical remains the first full commercial vertical.
6.  The first sub-slice must span Maths + Physics + Electrical where
    appropriate.
7.  Engineering is the preliminary preferred second vertical.
8.  HVAC/Refrigeration and Plumbing/Heating remain reserve high-priority
    candidates.
9.  Automotive remains attractive but later.
10. Accounting/AAT remains a future diversification candidate rather
    than an initial technical-cluster priority.
11. Full commercial launch should demonstrate more than one vocational
    vertical.
12. Real Electrical learners should still be used before that launch
    through alpha/beta/paid early access.
13. The second vertical must be re-scored after the first sub-slice
    produces real development economics.
14. Cross-domain reuse must be measured, not merely claimed.
15. Section 20 establishes explicit launch non-goals.
16. Learner-facing product quality is a launch gate equal in importance
    to knowledge/architecture quality.

------------------------------------------------------------------------

# 29. WP0.5 exit criteria

WP0.5 is complete when the Product Owner accepts or amends:

-   Foundational Maths + Foundational Physics architecture;
-   Electrical as first full vertical;
-   the scoring criteria and broad ranking;
-   Engineering as provisional second vertical;
-   multi-vertical full-launch strategy;
-   early Electrical user-validation strategy;
-   launch-critical capabilities;
-   explicit non-goals;
-   post-sub-slice second-vertical checkpoint;
-   reuse-economics hypothesis.

------------------------------------------------------------------------

# 30. What follows WP0.5

The next Phase 0 work should turn the selected product strategy into an
economic model.

Recommended:

> **WP0.6 --- Pricing, Unit Economics and Commercial Scenario Model**

It should model:

-   B2C price points;
-   free trial/freemium assumptions if applicable;
-   conversion;
-   churn;
-   learner lifetime;
-   payment fees;
-   hosting/database costs;
-   deterministic runtime costs;
-   LLM usage/cost;
-   support;
-   content maintenance;
-   content creation;
-   legal/compliance overhead;
-   B2B pricing hypotheses;
-   break-even;
-   conservative/base/upside scenarios;
-   sensitivity analysis.

Only after that should Phase 0 make its final commercial go/no-go
recommendation.

------------------------------------------------------------------------

# 31. Evidence note

WP0.5 synthesises WP0.1--WP0.4 rather than replacing their underlying
research.

Additional current checks support the continued shortlist:

-   City & Guilds continues to maintain a very broad UK vocational
    portfolio across building services and technical sectors.
-   IMI's March 2026 Automotive Education Report records 25,437
    automotive certificates in Q3 2025, up 12% year-on-year, supporting
    Automotive as a substantial later market.
-   Current vocational learner discussions continue to show
    adult/career-change demand across Electrical, Engineering, Plumbing
    and HVAC.
-   These signals support portfolio prioritisation but do not replace
    the detailed qualification-level SAM model.

------------------------------------------------------------------------

**End of WP0.5**
