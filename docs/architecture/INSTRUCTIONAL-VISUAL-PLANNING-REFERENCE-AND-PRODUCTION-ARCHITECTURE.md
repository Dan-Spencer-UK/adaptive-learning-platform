# Instructional Visual Planning, Reference Governance & Production Architecture

**Status:** Approved architecture direction — durable authority for deciding what visuals are needed, who may choose references, and how approved visual briefs reach production.

## 1. Purpose

This document closes a repeated failure mode in ALP: image production beginning before the instructional visual need and technical reference have been independently governed.

The mandatory order is:

> **identify the learning need → catalogue the required visual → independent catalogue review → select an authoritative reference → annotate exactly how it may be used → lock the visual brief and design-system rules → generate/render → independently QA → approve → integrate.**

Image generation is never the first visual-production step.

## 2. Authority boundaries

### 2.1 Claude / Implementation Engineer

Claude may:

- extract candidate visual needs from governed lessons and syllabus material;
- group candidate needs into visual families;
- populate mechanical catalogue fields;
- implement tooling and validators;
- orchestrate Gemini after the visual brief and reference dossier are approved;
- perform mechanical comparison against governed constraints;
- integrate approved assets.

Claude may **not** independently:

- decide that a technically important visual is unnecessary;
- select the authoritative technical reference for a new asset;
- infer technical geometry/direction/topology from visual memory;
- substitute an easier reference because the approved reference is inconvenient;
- invent missing technical relationships;
- approve a visual as pedagogically or aesthetically final.

### 2.2 ChatGPT / Project Architect

ChatGPT is responsible for independent visual-planning and reference-governance review, including:

- reviewing the candidate Visual Requirements Catalogue for missing, redundant or misclassified visuals;
- deciding whether each visual need is pedagogically justified;
- selecting or approving appropriate reference material;
- classifying the role of each reference;
- annotating what is authoritative, what must change, what may be simplified and what must not be copied;
- identifying answer-leak risks and required teaching/assessment variants;
- reviewing generated output against the brief and design system before Product Owner acceptance.

### 2.3 Product Owner

The Product Owner has final authority over:

- product visual ambition;
- major visual-family direction;
- design-system changes;
- final approval/rejection of production assets;
- any deliberate exception to a visual gate.

### 2.4 Gemini / renderer

Gemini is a rendering tool. It has no authority to determine technical truth, pedagogy, reference suitability or final approval.

## 3. The three governed visual catalogues

### 3.1 Visual Requirements Register (VRR)

Defines **what must exist**.

Minimum fields:

- `assetId`
- `qualificationId`
- `unitId`
- `lessonId`
- `conceptId` / assertion/capability references
- `instructionalPurpose`
- `visualRole`
- `needClassification`: REQUIRED | USEFUL | OPTIONAL | NOT_REQUIRED
- `productionClass`: DETERMINISTIC_TECHNICAL | ORIGINAL_REDRAW_FROM_REFERENCE | HYBRID_REDRAW_PLUS_DETERMINISTIC_OVERLAY | GENERATIVE_CONCEPTUAL | PHYSICAL_RECOGNITION | STANDARD_SYMBOL
- `learnerState`: TEACHING | FORMATIVE | ASSESSMENT | FEEDBACK | SHARED
- `mustShow`
- `mustNotShow`
- `answerLeakRisk`
- `variantRequirements`
- `familyId`
- `referenceStatus`
- `productionStatus`
- `approvalStatus`

A lesson cannot be marked visually complete merely because no asset was requested. Absence must be justified by the visual-opportunity analysis.

### 3.2 Approved Reference Library (ARL)

Defines **what reference material is approved and for what purpose**.

Each reference record must include:

- stable reference ID;
- source URL / local source identifier;
- source title/owner where known;
- rights/licence/redistribution note;
- acquisition date;
- file/hash where legitimately cached;
- reference role;
- technical authority level;
- approved use notes;
- prohibited use notes;
- relationship to visual family/assets.

### 3.3 Approved Asset Library (AAL)

Defines **what final ALP visuals are production eligible**.

Each asset record must include:

- `assetId` + version;
- family;
- source VRR entry;
- approved reference dossier ID(s);
- final file path/hash;
- teaching/assessment/feedback state;
- technical QA result;
- pedagogical QA result;
- design-system QA result;
- Product Owner approval status;
- supersession/archive status;
- known polish debt if any.

Superseded assets must be excluded from production resolution. Historical provenance may remain in archive/evidence locations.

## 4. Reference roles

Every reference must be explicitly classified. A single reference may have more than one role only when stated.

### TECHNICAL_AUTHORITY
Authoritative for geometry, direction, topology, relationship or standard form. These relationships must be preserved exactly.

### SYMBOL_AUTHORITY
Authoritative standard/IEC/BS/UK symbol geometry or convention.

### PHYSICAL_APPEARANCE_REFERENCE
Shows what a real component/object looks like. It is not automatically authoritative for diagram geometry or pedagogy.

### LAYOUT_REFERENCE
Useful for arrangement only. Content/geometry may not be copied unless separately authoritative.

### STYLE_INSPIRATION
Useful for visual mood/material/rendering language only. Never a technical authority.

### PEDAGOGICAL_REFERENCE
Useful because it demonstrates a particularly effective explanation/sequence. Must still be independently authored for ALP.

## 5. Reference dossier — mandatory annotations

Before any production run, ChatGPT must produce a per-asset Reference Dossier recording:

### Preserve exactly
- immutable technical relationships;
- directionality;
- topology;
- spatial relationships where pedagogically authoritative;
- standard symbol geometry where applicable.

### Change deliberately
- styling;
- colours;
- background;
- labels;
- composition where not technically meaningful;
- copyrighted expressive choices;
- irrelevant clutter.

### Remove
- answer-bearing labels inappropriate for the target state;
- branding/watermarks;
- extraneous components;
- misleading perspective or annotation.

### Add
- ALP-required annotations;
- missing but governed teaching cues;
- deterministic overlays;
- accessibility-related distinctions.

### Never infer
A list of relationships Gemini/Claude are forbidden to invent.

A reference URL without these annotations is not production-ready.

## 6. Reference selection quality gate

Reference selection must verify that the chosen reference establishes the exact learner-visible technical relationship needed by the target asset.

An authoritative source that does not show the required geometry is insufficient.

Example: a generally authoritative electromagnetism source is not enough for a right-hand-grip teaching asset unless the selected reference state itself unambiguously establishes thumb/current and field-circulation relationships.

## 7. Family planning before asset generation

Related visuals must be designed as a family before generation begins.

The family plan defines:

- common viewpoint or representation grammar where useful;
- scale/proportion conventions;
- colour semantics;
- line/stroke rules;
- label treatment;
- teaching vs assessment variants;
- deterministic overlay strategy;
- component/symbol pairing rules.

Generating one asset at a time without a family plan is prohibited when the concept clearly belongs to a reusable family.

## 8. Physical component + symbol rule

Where learners are expected to recognise electrical/electronic components, the default product pattern is:

1. **physical recognition visual** — what the component looks like in the real world;
2. **deterministic standard symbol companion** — how it appears in circuit/schematic notation.

Where multiple variants exist (e.g. diode family), the lesson/asset family must include the relevant standard symbols and, where pedagogically useful, physical examples.

The governed symbol library is deterministic and product-wide; it is not regenerated by Gemini.

## 9. Teaching and assessment variants

Teaching and assessment states must be planned together.

Teaching variants may include labels, arrows, legends and explanatory overlays.

Assessment variants must remove any cue that would disclose the answer while preserving enough stimulus to ask a valid question.

A teaching master may not be silently reused for assessment if it leaks the target relationship.

## 10. Production handoff packet

Claude may trigger Gemini only after a complete production packet exists:

- VRR entry;
- approved Reference Dossier;
- product-wide Visual Design System version;
- family rules;
- immutable technical facts;
- learner-state role;
- output requirements;
- acceptance checklist.

Gemini receives the packet; it does not reinterpret the task from a bare prose prompt.

## 11. Generation modes

### DETERMINISTIC_TECHNICAL
Used where correctness depends on exact topology, standard geometry or vector relationships. No generative inference.

### ORIGINAL_REDRAW_FROM_REFERENCE
Original ALP rendering preserving governed reference relationships. Never a trace/vectorisation of the source artwork.

### HYBRID_REDRAW_PLUS_DETERMINISTIC_OVERLAY
Generated/redrawn base art plus deterministic labels/arrows/geometry where generative precision is unsafe.

### GENERATIVE_CONCEPTUAL
Permitted for non-technical conceptual illustration where technical geometry is not authoritative.

### PHYSICAL_RECOGNITION
Realistic depiction guided by physical references; standard schematic companion remains deterministic.

## 12. Quality assurance

Every asset must pass three independent checks:

### Technical QA
Does it preserve immutable facts and reference-authoritative relationships?

### Pedagogical QA
Does it teach the intended concept clearly at phone scale without misconception or answer leakage?

### Design-system QA
Does it conform to the product-wide visual design system and family grammar?

A PASS generated by the same process that created the image is evidence, not independent approval.

## 13. Lifecycle

Recommended lifecycle:

`VISUAL_NEED_IDENTIFIED`
→ `CATALOGUE_REVIEWED`
→ `REFERENCE_REQUIRED`
→ `REFERENCE_APPROVED`
→ `BRIEF_LOCKED`
→ `PRODUCTION_READY`
→ `MASTER_GENERATED`
→ `TECHNICAL_QA_PASSED`
→ `PEDAGOGICAL_QA_PASSED`
→ `DESIGN_QA_PASSED`
→ `PRODUCT_OWNER_APPROVED`
→ `PRODUCTION_ELIGIBLE`
→ `SUPERSEDED_ARCHIVE`

Development-use exceptions may exist, but must be explicit and may never masquerade as final Product Owner approval.

## 14. Pipeline audit requirement

The existing visual-production tooling must be audited after this architecture is adopted. The audit must verify:

- no automatic reference-selection path can bypass ChatGPT/reference review;
- catalogue generation cannot mark a visual `NOT_REQUIRED` merely because no asset exists;
- Gemini cannot be invoked without a locked brief/reference dossier;
- old/disconnected manifests cannot resolve production assets;
- production assets resolve through one authoritative library/registry;
- teaching/assessment variants are explicit;
- design-system version is recorded with each production job;
- asset-family consistency can be mechanically checked where possible.

## 15. Start-to-finish qualification

After implementation, test the complete workflow on a bounded pilot lesson:

syllabus source → assertions/capabilities → storyboard → VRR → ChatGPT review → reference research → reference dossier → production packet → Claude orchestration → Gemini output → independent QA → Product Owner review → asset registration → lesson integration → formative assessment-safe variant → runtime qualification.

Do not claim the pipeline proven until that full chain has been executed without manual hidden state or bypasses.

## 16. V1 canonical-lesson visual scope

ADR-0006 narrows the Version 1 learner model without weakening this visual-governance architecture.

For V1:

- visual planning is performed against the **one canonical full lesson route**;
- richer scrollable teaching is expected to use enough visual support to genuinely teach and reinforce the concept;
- the Visual Opportunity Analysis must consider whether more than one representation is pedagogically useful, not merely whether the lesson contains at least one image;
- production priority is the canonical teaching family plus any visual states needed for embedded checks and dedicated formative/mock assessment;
- assessment-safe variants remain mandatory where an assessment uses the same underlying visual concept;
- bespoke misconception-specific remediation visual families are **not a V1 requirement** merely because post-V1 adaptive engines could use them;
- Claude must not manufacture extra adaptive visual variants as a way of appearing complete.

The V1 goal is to concentrate visual-production effort on making the canonical lesson experience class-leading, cohesive and reusable in both normal Learn and Guided Revision.
