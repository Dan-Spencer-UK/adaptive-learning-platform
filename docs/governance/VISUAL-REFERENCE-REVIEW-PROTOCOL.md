# Visual Reference Review Protocol

## Purpose

Defines the mandatory handoff between candidate visual planning, ChatGPT reference review, Claude/Gemini production and Product Owner approval.

## 1. Claude → ChatGPT handoff

Claude supplies a candidate catalogue containing only governed learning needs, not preselected technical references unless a source was explicitly supplied by the Product Owner.

For each candidate asset provide:
- asset ID/family;
- lesson/capability/assertion links;
- instructional purpose;
- teaching/assessment role;
- proposed production class;
- immutable facts already known from governed content;
- visual questions/uncertainties;
- candidate references only as suggestions, clearly unapproved.

## 2. ChatGPT review

ChatGPT must independently:
- confirm whether visual is required/useful/not required;
- detect missing visual needs;
- merge/split family entries where appropriate;
- search/select the technical/physical/symbol references;
- reject inadequate references even if authoritative generally;
- classify each reference's role;
- write the Reference Dossier annotations.

## 3. Reference acceptance checklist

A reference is APPROVED only when:
- source is identifiable;
- rights/use position is recorded sufficiently for the workflow;
- it actually demonstrates the required relationship;
- its authoritative scope is explicit;
- misleading/non-authoritative elements are called out;
- preserve/change/remove/add/never-infer notes exist.

## 4. ChatGPT → Claude production handoff

Return a locked production catalogue/dossier. Claude must not silently substitute another reference.

If the reference cannot be acquired/read by the production environment, Claude stops that asset and reports the technical problem; it does not replace the reference without review.

## 5. Output review

Claude may run mechanical/technical checks and build comparison packs. ChatGPT performs independent review of generated output against:
- approved reference dossier;
- immutable technical relationships;
- visual design system;
- teaching/assessment state.

Product Owner gives final approval.

## 6. Audit trail

Store:
- candidate catalogue version;
- reviewed catalogue version;
- reference dossier;
- reference source/hash where applicable;
- production prompt packet;
- generated master hash;
- QA records;
- approval/supersession status.
