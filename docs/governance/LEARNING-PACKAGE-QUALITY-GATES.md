# Learning Package Quality Gates

**Status:** Mandatory release governance for all new or materially re-authored learning packages.

**V1 learner-model authority:** ADR-0006 and `V1-LEARNING-ASSESSMENT-AND-GUIDED-REVISION-ARCHITECTURE.md`.

## 1. Principle

A green unit test or successful emulator walk proves runtime compatibility, not educational quality. ALP therefore applies independent publication gates across curriculum, pedagogy, visuals, assessment integrity, learner presentation, runtime and the V1 assessment–Guided Revision loop.

The V1 quality target is intentionally focused:

> **one excellent canonical lesson route + premium visuals + valid submitted formative/mock assessment + deterministic Guided Revision.**

Do not impose post-V1 adaptive-branch complexity on V1 lesson production.

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
- assessment capabilities map to canonical revision lessons.

## 4. Pedagogy gate

PASS requires:
- canonical lesson storyboard exists before final copy;
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
