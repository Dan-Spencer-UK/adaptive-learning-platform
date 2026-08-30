# Learning Package Quality Gates

**Status:** Mandatory release governance for all new or materially re-authored learning packages.

**V1 learner-model authority:** ADR-0006 and `V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md`.

## 1. Principle

A green unit test or successful emulator walk proves runtime compatibility, not educational quality. ALP therefore applies independent publication gates across curriculum, pedagogy, visuals, assessment integrity, learner presentation, runtime and the V1 assessment–Guided Revision loop.

The V1 quality target is intentionally focused:

> **one excellent canonical lesson route + premium visuals + valid submitted formative/mock assessment + deterministic Guided Revision.**

Do not impose post-V1 adaptive-branch complexity on V1 lesson production.

**Two separate acceptance questions (governance addition):** every material package is judged against two non-substitutable questions, owned by different roles ([`docs/governance/ROLES-AND-AUTHORITY.md`](ROLES-AND-AUTHORITY.md)):

1. **Implementation correctness** — does the implementation correctly satisfy the agreed architecture/contracts (tests, validators, schema conformance, production/runtime traces, real-content adoption evidence)? Claude Code generates and reports this evidence and may state its own technical conclusion, but cannot self-approve it — the Project Architect independently judges whether the evidence is actually sufficient and whether Claude's claimed conclusion follows from it.
2. **Product/learning quality** — is the architecture, content model, instructional design and learner experience itself good enough for a best-in-class learning product? Decided by independent Project Architect review and Product Owner approval, never by Claude Code alone.

Passing question 1 never implies passing question 2. A technically correct implementation of a weak design is a rejection, not a pass, regardless of how green the automated evidence is — this applies without exception to every gate below. Tests and validators are evidence only for what they actually assert; they are never a substitute for independent product, pedagogical or learner-experience review. Neither question is self-approving: Claude Code's own technical completion report is evidence/proposal pending the Project Architect's independent judgement, exactly like every other claimed conclusion this document governs (§14).

Best-in-class here means excellent execution of the intentionally constrained V1 product described above — it is not licence for uncontrolled scope growth, post-V1 adaptive complexity, or bureaucracy for its own sake (§15).

## 2. Required statuses

Recommended package lifecycle:

`SOURCE_VERIFIED`
→ `CURRICULUM_MAPPED`
→ `KNOWLEDGE_GOVERNED`
→ `CANONICAL_STORYBOARD_APPROVED`
→ `VISUAL_PLAN_APPROVED`
→ `LESSON_CHECK_PLAN_APPROVED`
→ `ASSESSMENT_MAPPING_APPROVED`
→ `REFERENCES_APPROVED`
→ `CONTENT_IMPLEMENTED`
→ `VISUALS_PRODUCED`
→ `ASSESSMENT_IMPLEMENTED`
→ `AUTOMATED_GATES_PASSED`
→ `RUNTIME_QUALIFIED`
→ `GUIDED_REVISION_QUALIFIED`
→ `PRODUCT_OWNER_REVIEWED`
→ `LEARNER_READY`

No status may be self-awarded by simply skipping required evidence.

## 3. Curriculum gate

PASS requires:
- syllabus/source version recorded;
- every taught/assessed capability traceable;
- enabling/off-syllabus knowledge explicitly justified;
- no unapproved content drift;
- prerequisite/dependency graph sufficient for taught-before-tested validation;
- taught-before-tested validator green;
- assessment capabilities map to canonical revision lessons;
- an explicit learning-purpose/depth definition exists for the package before lesson authoring (see [`docs/architecture/SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md`](../architecture/SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md) §1.1).

## 4. Pedagogy gate

**Storyboard standard:** a canonical lesson storyboard is not a list of screens, a UI wireframe, a collection of content blocks, a checklist of syllabus statements, or a visual-asset inventory. It must express the pedagogical job of the lesson and of each semantic section — what the learner should understand/do, prior knowledge being activated, the section's instructional purpose (explanation/model/example/practice/retrieval), sequencing rationale, relationship to governed learning requirements/knowledge, visual teaching opportunity, question/check purpose, and progression toward the lesson outcome. Enough structure to produce excellent, repeatable pedagogy; no field is added merely for bureaucracy (§15).

**Multimodal storyboard consequence (2026-08-30):** a best-in-class storyboard must be capable of expressing the pedagogical and multimodal teaching plan for each meaningful instructional beat — it is not enough to list screens, content blocks, lesson steps, syllabus statements or asset IDs. Where relevant it expresses: learning objective/intended understanding → prior-knowledge connection → teaching/explanation approach → what the learner sees → what the learner reads/hears → worked example/model/comparison → misconception being prevented or corrected → interaction/retrieval/check → rationale for the next instructional beat. This is the directorial/instructional-design plan for how learning is created, not a duplication of final learner-facing prose. A storyboard must actively consider, for each instructional beat: what the learner needs to understand; what mental model should be formed; whether the concept is better shown than described; whether a visual representation reduces cognitive load; whether physical recognition is required; whether a mechanism/process should be shown across states; whether comparison should be visual; whether calculations should be demonstrated progressively; whether key visual context should remain visible while explanation proceeds; and what retrieval/check should follow the teaching move. See [`docs/governance/PROJECT-CONSTITUTION.md`](PROJECT-CONSTITUTION.md) "Multimodal teaching principle" and [`docs/architecture/LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md`](../architecture/LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md) §2 for the conceptual/governance requirements this constrains; the concrete schema remains undecided. This is a Product Owner/Project Architect architecture decision — see [`docs/governance/ROLES-AND-AUTHORITY.md`](ROLES-AND-AUTHORITY.md).

**Single authored artefact (2026-08-30):** the canonical lesson IS the storyboard — there is no separately authored storyboard synchronised with a separate lesson plan. Internal instructional-design intent and the actual learner-facing multimodal composition are properties of the same authored artefact; the runtime receives a learner-facing projection with internal design rationale removed. See [`docs/architecture/LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md`](../architecture/LEARNING-PACKAGE-GOVERNANCE-CONTRACTS.md) §2.

PASS requires:
- the canonical lesson is authored as one artefact (instructional-design intent + learner-facing composition), never a separately maintained storyboard requiring synchronisation with a separate lesson plan;
- the lesson expresses the pedagogical/multimodal teaching plan above for each meaningful instructional beat, not merely screens/blocks/steps/asset IDs;
- one V1 route is defined and does not depend on mastery/evidence;
- every section has an explicit purpose;
- no duplicate/empty/engine-generated filler section;
- no arbitrary one-sentence → Continue fragmentation;
- coherent teaching is allowed to scroll rather than being split for viewport fit;
- explanation is sufficiently substantive for the learning objective;
- reinforcement/examples are present where they materially aid understanding;
- orientation matches actual lesson purpose;
- worked examples and embedded checks are sequenced intentionally;
- recap accurately represents what was taught;
- terminal completion is not redundantly pre-announced by a duplicate prior screen.

Dynamic diagnostic/remediation/recheck branches are **not a V1 pedagogy-gate requirement**.

## 5. Visual gate

**Multimodal teaching principle (constitutional, 2026-08-30):** ALP teaching must be deliberately visually rich and multimodal — see [`docs/governance/PROJECT-CONSTITUTION.md`](PROJECT-CONSTITUTION.md) "Multimodal teaching principle" for the full governing statement and representation list. The operative rule for this gate: **use a representation when it materially improves learning.** A visual is one governed representation among several — prose, diagrams, physical/component imagery, symbols/schematics, comparison views, process/state sequences, worked examples, equations, tables, progressive reveals, interaction/retrieval — and none is preferred by default; the right choice is whichever representation, for that specific instructional beat, most reduces cognitive load and best builds the intended mental model. This principle is unchanged and remains locked by the 2026-08-30 learning-purpose/depth and canonical-lesson decisions recorded in [`docs/governance/DECISION-LOG.md`](DECISION-LOG.md); the target remains efficient exam-ready or competence-ready understanding, not maximum content volume.

**Visual pedagogy standard:** visual planning is pedagogically driven, never quota-driven — "every lesson needs N images" is not a rule this gate enforces or accepts. A visual is required when it materially improves learning: spatial understanding, recognition, comparison, physical appearance, process/mechanism, direction/topology, procedural understanding, conceptual relationships, memory/recall, or reduced text burden. An important concept must not remain text-only merely because a visual is technically optional when one would materially improve comprehension. An explicit, governed "no visual required" decision is valid; a silent default or an omitted planning decision is not equivalent to deliberate analysis and does not satisfy this gate. Technical correctness of a visual is governed separately (§9/§13) from whether it is pedagogically useful — the two are never conflated.

PASS requires:
- visual-opportunity analysis completed for every lesson;
- REQUIRED visual needs have VRR entries;
- no concept-heavy/physical-recognition lesson remains text-only without explicit justification;
- reinforcing visuals were considered, not merely a single token image;
- approved reference dossier exists for every generated/redrawn technical visual;
- design-system version recorded;
- teaching/assessment variants complete where necessary;
- technical, pedagogical and design-system QA passed;
- obsolete/superseded assets cannot resolve in production.

A missing visual may not be waived merely because it takes time to create.

## 6. Embedded lesson-check integrity gate

**Assessment quality standard (applies to this gate and §7):** assessment quality is evaluated pedagogically, not merely structurally. Every item must be traceable to governed learning, taught/prior/retrieval-provenance-aware, appropriate to its intended cognitive demand, free from answer leakage and accidental clueing, supported by plausible distractors where applicable, free from unnecessary double negatives/trick wording, and capable of producing meaningful evidence. Embedded lesson questions (this gate) and submitted formative/mock assessment (§7) serve different purposes and must not be conflated. Completion is not mastery (Product Principle 10). Schema/blueprint validity establishes that a question is well-formed, never that it is a good question.

PASS requires:
- check does not reveal its answer before response;
- assessed/checked knowledge was taught or explicitly declared prior;
- one defensible best answer exists;
- option order is stable/randomised appropriately where order is not semantic;
- learner feedback is useful and human-readable;
- check outcome does not change the canonical V1 lesson route;
- check outcome does not directly rebuild Guided Revision.

## 7. Formative/mock assessment integrity gate

PASS requires:
- assessment is a distinct experience from teaching;
- assessment scope/coverage is governed;
- stable question instances survive resume;
- answer-bearing lesson teaching is unavailable during the attempt;
- one defensible best answer per applicable item;
- distractors are plausible/non-overlapping;
- all items map to governed capabilities;
- all weakness-producing capabilities map to canonical lesson(s);
- assessment does not adapt its question route mid-attempt in V1;
- explicit completion and submission state exists;
- incomplete/unsubmitted attempts cannot trigger Guided Revision.

## 8. Learner-presentation gate

PASS requires:
- no IDs, step-type labels, internal codes or engine metadata visible;
- raw tolerance/delta/reason codes translated to learner language;
- formula notation follows course/product conventions;
- copy reads naturally and vocationally;
- scrolling is intentional and continuation discoverable;
- key controls are accessible;
- visual/text density is appropriate for phone use;
- short screens are purposeful rather than artefacts of viewport slicing.

## 9. Runtime gate

PASS requires:
- release/runtime contract audit passes;
- all production-referenced answer types are supported;
- formula/worked-example bindings resolve;
- diagram/visual states resolve;
- lesson navigation reaches completion;
- every ordinary lesson remains directly accessible;
- canonical V1 lesson route is invariant to learner mastery/evidence/prerequisite state;
- evidence events persist correctly;
- target-device walk succeeds.

Existing richer adaptive branches may retain their own regression tests as platform capability, but they are not required to execute in the V1 ordinary lesson route.

## 10. Guided Revision gate

PASS requires:
- a started assessment does not alter the current plan;
- an in-progress/suspended assessment does not alter the current plan;
- a completed-but-unsubmitted assessment does not alter the current plan;
- a completed + submitted assessment triggers exactly one deterministic plan rebuild;
- plan source is the latest submitted assessment in scope;
- plan ranks weakest lesson needs first;
- multiple weak capabilities mapping to one lesson are deduplicated;
- every plan item resolves to the same canonical production lesson exposed in Learn;
- completing/reviewing a Guided Revision lesson does not itself alter weakness ranking;
- the next completed/submitted assessment rebuilds/replaces the current plan;
- plan generation is explainable and does not rely on runtime AI/ML.

## 11. Human Product Owner gate

Automated gates cannot mark `PRODUCT_OWNER_REVIEWED`.

The Product Owner reviews a representative V1 loop:
- full premium canonical lesson;
- teaching depth/scroll experience;
- imagery;
- embedded lesson check;
- complete formative/mock assessment;
- submit;
- resulting Guided Revision plan;
- revision lesson opening;
- later assessment plan refresh where available.

The Product Owner may return:
- APPROVED;
- APPROVED_WITH_RECORDED_DEBT;
- CHANGES_REQUIRED;
- REJECTED.

## 12. Exceptions

Any exception must record:
- gate waived;
- exact reason;
- scope;
- risk;
- owner;
- expiry/review trigger.

Post-V1 adaptive capability is not a reason to block V1 unless its absence threatens data integrity or compatibility.

## 13. Anti-drift rule

The publication pipeline must make it mechanically impossible for a new V1 lesson/package to become learner-ready without satisfying the mandatory records.

It must also make it difficult for old adaptive proving-slice assumptions to silently become V1 production requirements.

If a gate exists only in prose and can be bypassed silently, it is not implemented.

## 14. False-green state model

The repository must keep these states distinct and must never collapse one into another when reporting status:

- schema-capable
- validator-capable
- synthetically tested
- runtime-wired
- adopted by real production content
- mechanically enforced
- pedagogically reviewed
- learner-experience reviewed
- learner-ready

None of these implies any of the others. In particular:

- schema-capable ≠ production-adopted
- runtime-wired ≠ pedagogically good
- green tests ≠ learner-ready
- curriculum coverage ≠ good instruction
- visual present ≠ pedagogically useful
- question valid ≠ good assessment

A status report, PR description or completion claim that uses "PASS"/"complete"/"proved" language must state which of these states it actually demonstrates. Reporting a narrower state as if it were a broader one (e.g. "runtime-wired" reported as "learner-ready") is itself a governance defect, independent of whether the narrower claim is true.

## 15. Authoring economics / governance proportionality

Best-in-class does not mean maximal bureaucracy. Architecture review must weigh authoring cost and maintainability alongside rigour. If producing one lesson requires numerous manually synchronised artefacts carrying duplicate information, that is an architectural defect unless the duplication provides demonstrable governance value.

Prefer: canonical sources of truth; generated projections; mechanically derived evidence; explicit human decisions only where human judgement genuinely adds value.

Avoid: duplicated metadata; unnecessary manual registries; checklist theatre; governance fields that exist only to satisfy a validator and carry no learner or review value.

## 16. Representative real-lesson qualification gate

Before systematic rebuilding/migration of Unit 202 (or any future unit) through a new or materially changed production pipeline, at least one representative, pedagogically demanding real lesson must be taken through the full qualified production chain end-to-end — full sequence and success criteria: [`docs/architecture/LEARNING-PACKAGE-PIPELINE-AUDIT-AND-QUALIFICATION-PLAN.md`](../architecture/LEARNING-PACKAGE-PIPELINE-AUDIT-AND-QUALIFICATION-PLAN.md) §7-§9. Synthetic fixtures alone never satisfy this gate.

The pilot lesson requires independent review of both dimensions together, neither substituting for the other:

1. **Technical qualification** — the automated gates above (§3-§10) pass against real content.
2. **Pedagogical / product-quality qualification** — instructional coherence, depth, sequencing, cognitive load, storyboard quality, visual pedagogy, teach-before-test integrity, question quality, feedback quality, mobile UX, learner-facing wording, absence of internal/debug leakage, and overall premium-product quality (§11, Human Product Owner gate).

If meaningful defects are found, the first question is always: **is this an isolated content defect, or evidence that the production architecture/rules allowed the defect?** Where practical, defect classes are prevented upstream (schema, validator or process correction) before content production scales — repairing every future lesson individually is not an acceptable substitute for closing the upstream gap.

Systematic Unit 202 rebuilding is blocked until the representative pilot demonstrates the pipeline is both technically qualified and pedagogically/product-quality qualified.

**The pilot proves the new pipeline, not legacy reproduction.** The representative real lesson is not intended to prove that the legacy lesson can be migrated successfully — it is intended to prove that the new pipeline can create an excellent lesson from authoritative/governed upstream inputs. The preferred quality question is "can this pipeline produce the lesson we would design today from first principles?", never "can this pipeline reproduce the lesson we already have?" Legacy-lesson comparison may be diagnostically useful but is not the acceptance target. This gate is itself preceded by the knowledge-adequacy review — see [`docs/architecture/SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md`](../architecture/SYLLABUS-TO-LEARNING-PACKAGE-PRODUCTION-ARCHITECTURE.md) §4.1-§4.2 — the downstream lesson-production pipeline must not be qualified on top of an unexamined knowledge foundation.

## 17. Scale-only-after-qualification

The required workflow order is: architecture mechanically works → one representative real lesson authored through the real pipeline → independent technical + pedagogical + learner-experience review → defect classes traced upstream → production rules refined where necessary → representative lesson revalidated → pipeline accepted → systematic Unit 202 rebuild/migration begins.

Do not build all lessons first and attempt to repair the production architecture afterward. This principle governs Package 3 (storyboard/visual-opportunity planning) and every later content-production package equally — a package's own proposed "minimum correct contract" is not self-approving merely because Claude Code produced it; it remains evidence/proposal only until the Project Architect independently accepts it.

This governance addition concerns quality authority and pipeline qualification only. It does not reopen, weaken or extend the ADR-0006 V1 canonical-route/Guided-Revision model — the one-canonical-route, no-within-lesson-branching, assessment-driven-Guided-Revision product decision stands unchanged (see [`docs/governance/ROLES-AND-AUTHORITY.md`](ROLES-AND-AUTHORITY.md) "V1 learner-model changes are Product Owner / Project Architect decisions").
