# Phase 0 --- WP0.4: Knowledge Sources, Provenance, IP and Content Feasibility

**Status:** Draft for Product Owner review\
**Date:** 13 August 2026\
**Scope:** Foundational Maths + Electrical first product cluster\
**Depends on:** Approved WP0.1, WP0.2; WP0.3 competitor findings\
**Purpose:** Determine whether the first product can be populated
accurately, maintainably and commercially without depending on unlawful
reproduction of proprietary content.

------------------------------------------------------------------------

# 1. Executive outcome

**Preliminary outcome: PASS, with controlled proprietary-reference
dependency.**

Nothing found in this work package indicates that Foundational Maths +
Electrical is infeasible as the first product cluster.

The two domains have different source profiles:

## Foundational Maths

**Source feasibility: VERY STRONG.**

The Department for Education publishes the Functional Skills Maths
subject content from Entry Level 1 through Level 2 under the Open
Government Licence (OGL) v3.0. Ofqual separately publishes the
qualification conditions and assessment guidance under the OGL.

This gives the project a strong openly reusable authoritative basis for:

-   curriculum structure;
-   expected mathematical capabilities;
-   level progression;
-   assessment characteristics.

The underlying mathematics itself can then be represented in our own
granular knowledge model and taught through independently authored
examples/questions.

## Electrical

**Source feasibility: STRONG, but requires a mixed-source
architecture.**

The electrical knowledge ecosystem contains:

-   official/open legislation and HSE guidance;
-   publicly accessible qualification specifications and assessment
    guidance;
-   NET assessment-preparation material;
-   proprietary professional references such as BS 7671, Guidance Note 3
    and the On-Site Guide;
-   general engineering/scientific facts and calculations;
-   independently authored educational explanations.

This is workable **provided the system treats proprietary works as
authoritative references/provenance rather than as a corpus we are
entitled to redistribute**.

The core content strategy should therefore be:

``` text
OPEN / OFFICIAL SOURCES ──────────────┐
                                      │
PROPRIETARY AUTHORITIES ── reference ─┤
                                      ▼
                           KNOWLEDGE ASSERTION LAYER
                                      │
                                      ▼
                       INDEPENDENT EDUCATIONAL CONTENT
                                      │
                 questions / explanations / examples /
                 diagrams / remediation / calculations
```

The project should not ingest a proprietary book and then expose
paraphrased/reconstructed book content at scale without legal review.

------------------------------------------------------------------------

# 1.1 Adopted proprietary-reference operating model

For proprietary electrical references that the content-development team
lawfully possesses or can lawfully access, the intended architecture is:

``` text
LAWFULLY ACCESSED PROPRIETARY REFERENCE
                 │
                 ▼
TEMPORARY CONTENT-DEVELOPMENT ENVIRONMENT
                 │
        LLM-assisted processing may:
        - identify candidate propositions;
        - propose independently worded assertions;
        - identify source locators;
        - propose mappings/prerequisites;
                 │
                 ▼
       CANDIDATE KNOWLEDGE ASSERTIONS
                 │
        validation / normalisation /
        source verification / review
                 │
══════════ GOVERNANCE / PUBLICATION BOUNDARY ══════════
                 │
                 ▼
          APPROVED KNOWLEDGE STORE
                 │
        assertion + provenance +
        rights/version/audit metadata
                 │
                 ▼
           PRODUCTION PLATFORM
```

The intended principle is:

> **The proprietary publication is a temporary development/reference
> input, not a production knowledge asset and not learner-facing product
> content.**

No proprietary source PDF, scan, page image, extracted source-text
corpus, source-text chunk, or source-text embedding should cross the
publication boundary merely because it was used to develop or verify an
assertion.

The learner-facing platform should consume approved knowledge assertions
and original educational assets, not retrieve proprietary source text.

### Important legal status

The Product Owner considers LLM-assisted extraction conceptually
analogous to a human reading a lawfully held reference and recording
independently expressed knowledge at much greater speed.

That is the **intended content-production model**, but Phase 0 does not
declare the automated-processing question legally settled.

Before proprietary publications are processed by AI at production scale,
focused UK IP advice must confirm the implemented workflow, including
any copyright/text-and-data-mining implications and any relevant
licence/contract restrictions.

This legal gate should constrain processing policy, not force the
architecture to assume that manual transcription is the permanent
production method.

------------------------------------------------------------------------

# 2. Important terminology

## Provenance

**Provenance** means the record of where a knowledge claim came from and
how it was verified.

Example:

``` text
Assertion:
[our independently expressed electrical rule]

Provenance:
Authority: BS 7671
Edition: current applicable edition
Reference: Regulation [identifier]
Source class: PROPRIETARY_REFERENCE
Verified by: [...]
Verified date: [...]
```

Provenance is not the same as copying the source.

## OGL --- Open Government Licence

The **Open Government Licence** is a UK licence allowing broad reuse of
public-sector information subject to its conditions, including
attribution.

This is particularly valuable for Functional Skills and HSE/government
material.

## Source of truth

A **source of truth** is the authority against which the platform
determines whether a knowledge assertion is correct/current.

The source of truth does not have to be displayed verbatim to the
learner.

## Derived content

For this project, **derived content** means educational material we
create after establishing the underlying knowledge.

Because copyright/IP questions around derivation can be fact-specific,
the safest operating model is independently authored content rather than
close paraphrase of protected text.

------------------------------------------------------------------------

# 3. Foundational Maths source stack

## 3.1 Department for Education Functional Skills Maths subject content

DfE publishes the complete Functional Skills Maths content for:

-   Entry Level 1;
-   Entry Level 2;
-   Entry Level 3;
-   Level 1;
-   Level 2.

The current GOV.UK publication explicitly states that it is Crown
copyright and licensed under **OGL v3.0 except where otherwise stated**.

It defines the progression and expected capabilities across:

-   numbers and the number system;
-   measures, shape and space;
-   information and data;
-   mathematical problem solving.

It also explicitly states that higher levels build on lower-level
content.

### Feasibility conclusion

**GREEN --- excellent source.**

We can use this to build curriculum mappings and a foundational
knowledge hierarchy, subject to OGL attribution and any identified
third-party exceptions.

------------------------------------------------------------------------

## 3.2 Ofqual Functional Skills Maths requirements

Ofqual publishes:

-   Functional Skills Maths conditions;
-   assessment requirements;
-   interpretation guidance.

These are also published under OGL v3.0 except where otherwise stated.

They help establish:

-   what the qualification assesses;
-   calculator/non-calculator requirements;
-   expected demand;
-   problem-solving expectations;
-   relationship between underpinning skills and applied problems.

### Feasibility conclusion

**GREEN.**

Useful for curriculum/assessment mapping, but we should still author our
own learning and practice questions rather than trying to recreate live
awarding-body assessments.

------------------------------------------------------------------------

## 3.3 General mathematical knowledge

The platform's maths ontology should **not simply be a copy of the
Functional Skills document**.

Instead:

``` text
GENERAL MATHS KNOWLEDGE
       │
       ├── arithmetic
       ├── fractions
       ├── decimals
       ├── percentages
       ├── ratio/proportion
       ├── algebra
       ├── formulae
       ├── units/measurement
       ├── geometry
       ├── data/statistics
       └── mathematical reasoning

               ▲
               │ mappings
               │
      FUNCTIONAL SKILLS CURRICULUM
               │
               ├── Entry 1
               ├── Entry 2
               ├── Entry 3
               ├── Level 1
               └── Level 2
```

This prevents qualification structure from becoming our knowledge
architecture.

It also permits Electrical and Engineering to consume mathematical
knowledge that lies beyond or between particular Functional Skills
statements.

------------------------------------------------------------------------

# 4. Electrical curriculum/source stack

Electrical requires several source classes.

## 4.1 Qualification specifications --- City & Guilds and equivalents

City & Guilds currently publishes substantial 2365 material publicly,
including:

-   Level 2 qualification handbook;
-   Level 3 qualification handbook;
-   candidate packs;
-   assessor guidance;
-   sample papers;
-   sample mark schemes;
-   permitted reference-material guidance;
-   assessment documents.

These documents are extremely useful for establishing:

-   units;
-   learning outcomes;
-   assessment structure;
-   expected scope;
-   progression;
-   qualification relationships.

However, public accessibility does **not** equal unrestricted commercial
reuse.

City & Guilds' copyright page says its website/material is copyright
protected and directs users to seek permission for use of City & Guilds
copyright material in publications unless the document's own copying
conditions permit the intended use.

Its Standard Copying Conditions, where explicitly applicable, also state
that copies may not be sold.

### Feasibility conclusion

**AMBER --- excellent curriculum evidence; reproduction rights must be
controlled.**

Use qualification documents to understand/map the curriculum and
maintain precise provenance.

Do **not** copy City & Guilds questions, mark schemes, diagrams, wording
or substantial protected material into the commercial learner product
without permission.

------------------------------------------------------------------------

# 5. Electrical open/official knowledge sources

A substantial portion of electrical knowledge can be anchored in
official sources rather than proprietary textbooks.

## 5.1 Legislation

Relevant law includes, depending on topic:

-   Electricity at Work Regulations 1989;
-   Health and Safety at Work etc. Act;
-   Management of Health and Safety at Work Regulations;
-   Provision and Use of Work Equipment Regulations;
-   electrical product/safety regulations;
-   applicable Building Regulations.

Legislation can be linked to authoritative government sources.

### Feasibility

**GREEN**, subject to the applicable government reuse terms and accurate
jurisdiction/version control.

------------------------------------------------------------------------

## 5.2 HSE electrical guidance

HSE publishes extensive electrical-safety material, including:

-   HSG85 --- Electricity at work: Safe working practices;
-   HSR25 --- Memorandum of guidance on the Electricity at Work
    Regulations 1989;
-   INDG231 --- Electrical safety and you;
-   other electrical testing/safety guidance.

HSE currently states that its Health and Safety Regulations content is
available under OGL v3.0 except where otherwise stated.

### Feasibility

**GREEN / GREEN-AMBER depending on individual document notices.**

Every source still needs its own licence metadata; we should not assume
one site's general licence overrides a document-specific third-party
notice.

------------------------------------------------------------------------

# 6. Proprietary electrical authority stack

Some of the most important professional references are proprietary.

These include:

-   BS 7671 Requirements for Electrical Installations;
-   IET Guidance Note 3;
-   IET On-Site Guide;
-   other IET Guidance Notes;
-   some British Standards;
-   commercial textbooks.

These references are central to professional electrical practice and
qualification assessment.

NET's current AM2 preparation material explicitly says that candidates
are provided with BS 7671, Guidance Note 3, the On-Site Guide and the
Electrician's Guide to the Building Regulations for the
applied-knowledge assessment. It also directs candidates to use GN3/OSG
during inspection/testing.

This demonstrates that proprietary reference navigation is itself part
of real assessment/professional behaviour.

## Feasibility conclusion

**AMBER, not RED.**

The existence of proprietary authority does not prevent us building the
product.

It means we need a disciplined architecture:

``` text
PROPRIETARY SOURCE
      │
      ├── source identity
      ├── edition/version
      ├── regulation/section identifier
      ├── verification record
      └── access/reproduction status
                 │
                 ▼
       OUR KNOWLEDGE ASSERTION
                 │
                 ▼
      OUR QUESTION / EXPLANATION
```

IET itself provides a permissions route for reproducing its published
material. That reinforces the distinction between **referencing/using
authority** and **reproducing protected content**.

------------------------------------------------------------------------

# 7. What the platform should and should not ingest

The word **ingest** needs to distinguish temporary development
processing from permanent production storage.

## 7.1 Open/licensed curriculum ingestion

Purpose:

> determine what learners are required to know.

Where the licence permits it, automated extraction can:

-   read source content;
-   identify curriculum requirements;
-   propose assertions;
-   retain permitted extracts where genuinely useful;
-   create mappings and provenance.

The exact licence still governs storage/reproduction.

## 7.2 Proprietary-reference processing

For a proprietary publication lawfully available to the
content-development process, the proposed workflow is:

``` text
source temporarily available to controlled processor
        ↓
LLM/human identifies candidate technical propositions
        ↓
independently expressed candidate assertions
        ↓
exact source-version + locator captured
        ↓
candidate reviewed/verified
        ↓
temporary proprietary source representation discarded
        ↓
approved assertion + provenance retained
```

The LLM may accelerate the work that would otherwise require manual
reading, but its output is a **candidate**, not trusted knowledge merely
because the model produced it.

The approved knowledge store should not retain proprietary source text
merely to make future generation convenient.

## 7.3 Learner-content generation

Learner-facing questions, explanations, remediation and examples should
ordinarily be generated/authored from **approved governed assertions**.

Preferred:

``` text
approved assertions
        ↓
original educational scenario
        ↓
original question/explanation
```

Avoid as the normal production architecture:

``` text
proprietary source chunk
        ↓
live LLM paraphrase
        ↓
learner
```

This creates a clean rights, governance and quality boundary.

## 7.4 No-source-retention rule for proprietary references

Unless an explicit licence/legal review authorises otherwise,
proprietary source material must not be retained in the production
product/repository as:

-   PDFs;
-   scans;
-   page images;
-   copied paragraphs;
-   extracted text corpora;
-   RAG chunks;
-   embeddings representing the proprietary text;
-   reconstructed substitute publications.

Development tooling may require temporary working copies or transient
processing representations. Those must remain outside the governed
production repository/knowledge store, have controlled access and a
defined deletion lifecycle.

The surviving production artifacts are:

-   source identity;
-   source version/edition/amendment;
-   precise locator;
-   page number where useful;
-   rights metadata;
-   independently expressed approved assertions;
-   mappings;
-   verification/audit records;
-   original learner content.

------------------------------------------------------------------------

# 8. Recommended source, version and locator model

Provenance must be sufficiently precise to support both:

1.  **governance** --- proving exactly what authority was used to verify
    an assertion; and
2.  **learner reference navigation** --- helping the learner locate the
    authoritative material in their own/current reference.

A simple `source = BS 7671` field is insufficient.

The model should separate the publication itself, the exact version
used, and the location within that version.

## 8.1 Source

Minimum proposed source metadata:

``` text
source_id
title
publisher / authority
source_type
authority_level
jurisdiction

access_class
licence
licence_url
copyright_owner
third_party_content_present

internal_access_permitted
automated_processing_status
learner_reproduction_status
quotation_status

reviewed_by
rights_review_date
notes
```

Suggested `access_class` values:

-   OPEN
-   OFFICIAL_OGL
-   PUBLIC_RESTRICTED
-   PROPRIETARY_REFERENCE
-   LICENSED
-   ORIGINAL

Suggested learner-reproduction states:

-   PERMITTED
-   PERMITTED_WITH_ATTRIBUTION
-   LIMITED / REVIEW_REQUIRED
-   NOT_PERMITTED
-   UNKNOWN

**UNKNOWN should behave as NOT PERMITTED until reviewed.**

## 8.2 Source version

A separate version record should capture, where applicable:

``` text
source_version_id
source_id

edition
revision
amendment
corrigendum
publication/version_identifier

publication_date
effective_from
effective_to

version_status
supersedes_source_version_id
superseded_by_source_version_id

verified_current_date
notes
```

Example conceptually:

``` text
Source:
BS 7671

Edition:
18th Edition

Amendment:
Amendment [applicable identifier]

Version identifier:
[exact publication/version designation]
```

The platform must not assume that a reference title identifies a single
stable body of knowledge.

## 8.3 Source locator

The location within a source version should be granular and flexible.

Potential fields include:

``` text
source_locator_id
source_version_id

part
chapter
section
subsection
paragraph
regulation
subregulation
clause
subclause
appendix
schedule
table
figure

page
page_end

locator_display
notes
```

Not every publication uses every hierarchy, so the model must not
hard-code provenance around `regulation` alone.

### Semantic locator versus physical locator

The **semantic locator** --- for example a regulation, section, clause
or table identifier --- should normally be the primary durable
reference.

The **physical locator** --- normally page number --- should also be
stored when known because it is extremely useful to learners.

Page number must not be the sole locator because pagination can change
between editions, printings or digital formats.

Example learner-facing reference:

``` text
Professional reference
BS 7671: [exact applicable version]
Regulation: [identifier]
Page: [page in specified edition/format]
```

The page is navigation assistance; the regulation/section is the more
durable identity.

------------------------------------------------------------------------

# 9. Assertion-level provenance model

Provenance is **many-to-many**.

One assertion may depend on several authorities, and one source location
may support many assertions.

Example:

``` text
                  HSE HSG85
                     │
                     ▼
BS 7671 ───────► ASSERTION ◄──── Electricity at Work Regulations
                     ▲
                     │
              qualification specification
```

A conceptual assertion record:

``` text
ASSERTION E-00127

Statement:
[our independently authored proposition]

Domain:
Electrical

Prerequisites:
M-0042
E-00110

Provenance links:

1. source_version: BS 7671 [version]
   locator: Regulation [...]
   page: [...]
   relationship: AUTHORITATIVE_REQUIREMENT

2. source_version: HSE HSG85 [version]
   locator: Section [...]
   page: [...]
   relationship: SUPPORTS / INTERPRETS

3. source_version: Electricity at Work Regulations
   locator: Regulation [...]
   relationship: LEGAL_BASIS

Curriculum mapping:
City & Guilds / other qualification
unit / learning outcome [...]
relationship: CURRICULUM_REQUIRES

Status:
VERIFIED

verified_by:
[...]

verified_at:
[...]

Learner wording:
[our independently authored explanation]
```

The production knowledge asset is the independently expressed assertion
and its metadata --- **not the source passage used during
verification**.

------------------------------------------------------------------------

# 10. Source relationships

Not all provenance means the same thing.

Useful relationship types include:

-   **REQUIRES** --- curriculum says learner must know/do this;
-   **AUTHORITATIVE_REQUIREMENT** --- professional/regulatory authority
    establishes the requirement;
-   **SUPPORTS** --- source supports/explains the assertion;
-   **DERIVES_FROM** --- calculation/logical result follows from other
    assertions;
-   **ILLUSTRATES** --- source provides context/example;
-   **SUPERSEDES** --- newer source/version replaces older;
-   **CONFLICTS_WITH** --- temporary governance flag requiring
    resolution.

This matters because:

> "City & Guilds requires this learning outcome"

is different from:

> "BS 7671 establishes this electrical requirement."

The data model should preserve that distinction.

------------------------------------------------------------------------

# 11. Question-development policy

Questions should be **platform-authored assets**.

Each question should know which assertions it tests.

Example:

``` text
Question Q-1019
   tests:
      E-00127
      M-0042

   context:
      independently authored scenario

   answer:
      deterministically calculated

   distractors:
      misconception MISC-008
      misconception MISC-014

   provenance:
      inherited through tested assertions

   qualification mappings:
      2365 [...]
      NVQ [...]
```

This is preferable to saying:

> "Generate a question from page 87 of Book X."

The first model tests governed knowledge.

The second risks making a proprietary publication the content-generation
substrate.

------------------------------------------------------------------------

# 12. Deterministic content opportunity

Electrical/Maths has an unusually strong opportunity for deterministic
generation.

Examples:

-   Ohm's law;
-   power/current/voltage;
-   resistance combinations;
-   energy;
-   efficiency;
-   unit conversion;
-   percentages;
-   ratio;
-   formula substitution;
-   formula transposition;
-   areas/volumes;
-   cable-related calculations where all necessary lawful parameters are
    supplied;
-   test-result interpretation where rules are represented as governed
    assertions.

A deterministic generator can vary:

-   values;
-   units;
-   context;
-   requested variable;
-   plausible distractors;
-   difficulty.

Benefits:

-   very low runtime cost;
-   essentially unlimited numerical variants;
-   known correct answers;
-   reproducibility;
-   easier quality assurance;
-   reduced memorisation of question banks.

This should be a major content-production strategy.

------------------------------------------------------------------------

# 13. AI-assisted content pipeline

AI should accelerate content production but should **not be the
authority**.

Recommended pipeline:

``` text
SOURCE / CURRICULUM
        ↓
candidate extraction
        ↓
candidate knowledge assertions
        ↓
normalisation / deduplication
        ↓
prerequisite + misconception proposals
        ↓
question/explanation proposals
        ↓
DETERMINISTIC VALIDATION where possible
        ↓
SOURCE / SME REVIEW according to risk
        ↓
approved governed content
        ↓
production
```

**SME** means *Subject Matter Expert*: a person with appropriate
expertise in the subject.

The AI can perform high-volume drafting.

The governance system determines what becomes trusted production
knowledge.

------------------------------------------------------------------------

# 14. Human review should be risk-based

It would be economically undesirable to require an electrician or maths
teacher to manually author every assertion and every numerical question.

Instead classify content by risk.

## Low-risk

Examples:

-   arithmetic;
-   deterministic algebra;
-   unit conversion;
-   straightforward mathematical identities.

Possible workflow:

AI/rule generation → automated tests → sampled human QA.

## Medium-risk

Examples:

-   established electrical theory;
-   standard calculations;
-   qualification mappings.

Workflow:

AI extraction/drafting → deterministic checks where possible →
structured reviewer approval.

## High-risk

Examples:

-   safety-critical procedures;
-   regulatory requirements;
-   BS 7671 requirements;
-   inspection/testing interpretation;
-   changing legislation;
-   professional practice claims.

Workflow:

authoritative source verification → qualified review → explicit
version/provenance → controlled publication.

This is likely essential to making content economics work.

------------------------------------------------------------------------

# 15. Versioning is mandatory

Electrical knowledge changes.

The platform must be able to answer:

-   which edition did this assertion come from?
-   when did it become effective?
-   what did it replace?
-   which questions depend on it?
-   which qualifications currently require it?
-   which learner explanations need updating?

Example:

``` text
SOURCE VERSION CHANGES
        ↓
affected assertions identified
        ↓
assertions reviewed/versioned
        ↓
dependent questions identified
        ↓
questions regenerated/reviewed
        ↓
curriculum mappings checked
        ↓
learner product updated
```

This is a major advantage of assertions over storing chapters/documents
as undifferentiated text.

------------------------------------------------------------------------

# 16. Required update propagation

Every assertion should be able to expose its dependants.

For example:

``` text
BS 7671 reference changes
        ↓
12 assertions affected
        ↓
43 questions affected
        ↓
6 explanations affected
        ↓
3 qualification mappings checked
```

The platform should not require a human to remember where an old rule
was mentioned.

This should become an architectural requirement.

------------------------------------------------------------------------

# 17. Provenance visible to learners

Not all internal provenance needs to clutter the learner interface.
Provenance has two distinct functions: **governance provenance** (how
the platform knows an assertion is authoritative) and **learner
reference navigation** (helping the learner find and use the
authoritative reference).

However, appropriate learner-facing provenance can strengthen trust.

Possible display:

``` text
Why am I learning this?
2365 Level 3 → [curriculum area]

Professional reference
BS 7671 → Regulation [reference]

Also supported by
HSE → [guidance]
```

For proprietary sources:

> Consult the current edition of the referenced publication for
> authoritative wording.

The platform should not imply that its independently authored
explanation **is** the official wording.

------------------------------------------------------------------------

# 18. Reference-navigation learning

WP0.3 identified reference navigation as a real electrical skill.

NET's official AM2 preparation guidance confirms that candidates use
professional publications during parts of the assessment and
specifically warns that candidates can struggle to access information in
BS 7671.

Therefore our product should be capable of teaching:

-   which reference is appropriate;
-   how the reference is organised;
-   how to locate the relevant section/regulation;
-   when to consult the authoritative source.

This can be done without reproducing the source.

Example question type:

> Which part/section of the permitted reference would you consult to
> verify this requirement?

or:

> Locate Regulation \[identifier\] in your current copy and use it to
> answer the following independently authored scenario.

This could be a valuable differentiator.

------------------------------------------------------------------------

# 19. Content we should not build without explicit rights review

Red-flag content includes:

-   copied City & Guilds live questions;
-   copied sample questions used beyond their permitted terms;
-   reconstructed exam banks;
-   copied BS 7671 tables;
-   copied GN3 diagrams;
-   copied On-Site Guide tables/diagrams;
-   close paraphrases that collectively reconstruct a protected work;
-   screenshots/scans of proprietary pages;
-   large quotations;
-   proprietary book content placed into learner-facing RAG.

**RAG --- Retrieval-Augmented Generation** means giving an AI selected
source passages at answer time so it can formulate a response.

A private licensed RAG implementation might later be possible under
appropriate rights, but it should not be assumed in the launch
architecture.

------------------------------------------------------------------------

# 20. Source feasibility by content type

## Foundational maths concepts

**Status: GREEN**

Strong open official curriculum plus independently expressible
mathematics.

## Functional Skills curriculum mapping

**Status: GREEN**

DfE/Ofqual OGL sources.

## General electrical science

**Status: GREEN / GREEN-AMBER**

Physical/mathematical principles can be independently represented;
verify educational scope using qualification sources.

## Electrical health and safety

**Status: GREEN / AMBER**

Substantial legislation/HSE material is openly available; professional
practices may also reference proprietary/industry sources.

## 2365 curriculum mapping

**Status: AMBER**

Public handbooks are excellent evidence but City & Guilds
copyright/reuse conditions require controlled use.

## NVQ/occupational route mapping

**Status: AMBER**

Public qualification/industry materials can establish structure; rights
metadata required.

## AM2/AM2S/AM2E preparation

**Status: AMBER**

NET provides unusually useful public preparation information. Build
independent preparation rather than copying assessment material.

## BS 7671 knowledge

**Status: AMBER**

Essential proprietary authority. Use precise references/provenance and
independent content. Legal review required before launch implementation
is finalised.

## Guidance Note 3 / On-Site Guide

**Status: AMBER**

Same principle.

## Actual awarding-body exam content

**Status: RED unless expressly released/licensed for the intended use**

Do not build the product around access to live/protected assessments.

------------------------------------------------------------------------

# 21. Can we build a complete first sub-slice now?

**Yes.**

A first development sub-slice can deliberately use a source mix with
very low rights ambiguity.

Example knowledge chain:

``` text
DfE/open maths
     ↓
arithmetic / algebra / units
     ↓
general electrical science
     ↓
Ohm's law / power relationships
     ↓
qualification curriculum mapping
     ↓
independently generated applied questions
```

This is sufficient to prove:

-   assertions;
-   provenance;
-   prerequisites;
-   question generation;
-   deterministic marking;
-   cross-domain diagnosis;
-   remediation;
-   learner mastery;
-   learner-facing references.

We do **not** need to solve every BS 7671 licensing question before
building this experimental sub-slice.

We **do** need to solve the production policy before scaling
proprietary-reference-dependent content toward launch.

------------------------------------------------------------------------

# 22. Can content production scale economically?

**Preliminary answer: probably yes, if the assertion system is designed
for automation and risk-based review.**

The economics look favourable because:

1.  maths supports extensive deterministic generation;
2.  much electrical science is calculation/rule based;
3.  one assertion can support many questions;
4.  one question template can create many safe numerical variants;
5.  assertions can map to several qualifications;
6.  foundational maths is reusable across future verticals;
7.  AI can draft assertions/mappings/questions;
8.  human review can concentrate on high-risk content;
9.  provenance makes later updates targeted rather than requiring
    complete course rewrites.

The main cost risk is **high-risk regulatory/professional knowledge**.

We should measure this during development rather than assume it away.

------------------------------------------------------------------------

# 23. Content-economics metrics to capture during the sub-slice

The development experiment should record:

-   source pages/sections reviewed;
-   candidate assertions extracted;
-   assertions accepted/rejected;
-   human review minutes per assertion;
-   automated validation rate;
-   duplicate assertion rate;
-   average curriculum mappings per assertion;
-   average questions/templates per assertion;
-   question rejection rate;
-   reviewer minutes per question;
-   proportion low/medium/high risk;
-   number of generated deterministic variants;
-   update propagation time.

These measurements will allow us to estimate the cost of building a
complete vertical.

Without them, "AI will make content cheap" is only an assumption.

------------------------------------------------------------------------

# 24. Legal review gate

Before commercial launch, obtain focused UK IP advice on the **actual
implemented workflow**, particularly:

1.  internal use of lawfully acquired proprietary references to verify
    assertions;
2.  storage of regulation/section identifiers;
3.  independent paraphrase versus impermissible reconstruction;
4.  question creation based on requirements in proprietary standards;
5.  learner-facing references/citations;
6.  automated processing of proprietary publications;
7.  use of sample assessment materials;
8.  whether any proposed quotation/display requires permission;
9.  trademark/qualification-name presentation;
10. whether specific source licences are desirable commercially.

This should be a focused review of a concrete system, not an abstract
request for a lawyer to design the product.

------------------------------------------------------------------------

# 25. WP0.4 decisions proposed

1.  **PASS Foundational Maths source feasibility.**
2.  **PASS Electrical source feasibility with controlled
    proprietary-reference dependency.**
3.  Treat proprietary professional references as first-class provenance,
    not as redistributable corpus content.
4.  Build learner-facing educational content independently unless a
    licence explicitly permits reuse.
5.  Store machine-readable source rights metadata.
6.  Make `UNKNOWN` rights behave as `NOT PERMITTED` for learner
    reproduction.
7.  Support multiple provenance relationships per assertion.
8.  Separate curriculum authority from professional/technical authority.
9.  Use deterministic question generation aggressively where
    mathematically appropriate.
10. Use AI for candidate/draft content, never as the authority.
11. Apply risk-based human review.
12. Make source/assertion/question version propagation an architectural
    requirement.
13. Include reference-navigation learning in Electrical.
14. Do not depend on live/protected awarding-body questions.
15. Measure actual content-production economics during the first
    sub-slice.
16. Obtain focused UK IP review before commercial launch and before
    large-scale proprietary-source processing.

------------------------------------------------------------------------

# 26. Effect on the project go/no-go position

WP0.4 does **not** identify a source/licensing obstacle serious enough
to stop development.

The source profile is actually attractive:

### Maths

Open official curriculum + deterministic subject matter.

### Electrical

Mixed open/proprietary authority, but large amounts of official
safety/regulatory material and independently expressible
scientific/technical knowledge.

The proprietary-source problem is manageable **if we build for
provenance rather than copying**.

Therefore the Phase 0 source-feasibility result is:

> **GO --- proceed with the Electrical/Maths product hypothesis.**

This is not yet the final commercial go/no-go. Competition, market
economics, pricing and the working sub-slice still need to validate the
business.

------------------------------------------------------------------------

# 27. WP0.4 exit criteria

WP0.4 is complete when the Product Owner accepts or amends:

-   the source classifications;
-   Foundational Maths GREEN status;
-   Electrical AMBER-but-viable proprietary-reference model;
-   the proposed source-rights metadata;
-   the assertion/provenance relationships;
-   independent question/content policy;
-   risk-based review;
-   version/update propagation requirement;
-   content-economics measurements;
-   pre-launch legal review gate.

After approval, proceed to:

> **WP0.5 --- Commercial/product scoring and launch-portfolio
> shortlist.**

WP0.5 should combine the evidence from market size, competition, source
feasibility, reuse, Product Owner validation advantage, content cost and
product differentiation into a scored decision framework.

------------------------------------------------------------------------

# 28. Principal evidence used

-   Department for Education --- Functional Skills Maths subject
    content, OGL v3.0.
-   Ofqual --- Functional Skills Maths conditions/guidance, OGL v3.0.
-   City & Guilds --- current 2365 qualification/material listings.
-   City & Guilds --- copyright and copying-conditions policy.
-   HSE --- electrical safety guidance and Electricity at Work
    resources.
-   IET --- permissions guidance for reproduction of IET published
    material.
-   NET --- current AM2/AM2S/AM2E pre-assessment and candidate guidance.

Point-in-time source licences and publication terms must be captured
when material is actually ingested/reviewed; this Phase 0 analysis is
not a substitute for per-source rights metadata.

------------------------------------------------------------------------

**End of WP0.4**
