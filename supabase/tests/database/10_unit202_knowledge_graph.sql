-- CC-04B pgTAP: Unit 202 proving-slice knowledge graph
--
-- Proves the curriculum-grounded, corpus-expanded proving slice generated
-- by scripts/content/generate-seed.ts from
-- scripts/content/data/cc04-unit202-electrical-science.ts satisfies the
-- CC-04B acceptance criteria: the ELECTRICAL corpus specifically (not the
-- total graph) is in the Product-Owner-approved 140-160 range; Foundational
-- Maths/Physics assertions are additional reusable horizontal knowledge
-- and are never curriculum-mapped directly; stable identities resolve to
-- an approved version with complete, resolving, rights-compliant external
-- provenance (no UNKNOWN, no CURRENT placeholder record, no assertion
-- relying solely on this project's own ORIGINAL provenance); every
-- Electrical assertion maps to a real confirmed curriculum node spanning
-- LO1/LO2/LO3/LO4/LO5; the graph is healthy (no self-edges, duplicate
-- edges or unintended prerequisite cycles); and at least six qualitatively
-- distinct diagnostic root-cause substrate paths exist, including a
-- genuine multi-hop Foundational-to-Electrical chain and a path through
-- the magnetism/AC family that is structurally unrelated to the DC/
-- algebra paths. The CC-02/CC-03 security posture remains unaffected.
--
-- This file queries data already present after `db reset` (it does not
-- insert its own fixtures), the same pattern 04_rls_baseline.sql uses
-- for the CC-02 SAMPLE_DOMAIN fixture.
--
-- CC-09A addendum: the original CC-04B curriculum version
-- (cv-2365-02-v1-12) is superseded (never mutated) by the complete
-- official LO1-LO6/23-AC/58-Range-item extraction (cv-2365-02-v1-12-r2,
-- same handbook edition, verified directly against cityandguilds.com).
-- Gates below that assumed a single CURRENT curriculum version, or that
-- assumed zero uncovered Assessment Criteria across the whole
-- curriculum_nodes table, are re-scoped to the specific version each
-- invariant actually holds for -- see each gate's own comment.

begin;

select plan(46);

-- ===================================================================
-- 1-2. Corpus size: the ELECTRICAL corpus specifically is 140-160
-- (CC-04B target ~150); total graph size (including Foundational Maths/
-- Physics, which are additional and do not count toward the Electrical
-- target) is reported separately.
-- ===================================================================

select ok(
  (select count(*)::int from public.assertions a
   join public.domains d on d.id = a.domain_id
   where d.code = 'EL') between 140 and 160,
  'the Electrical corpus specifically contains between 140 and 160 stable assertions (CC-04B target ~150)'
);

select ok(
  (select count(*)::int from public.assertions a
   join public.domains d on d.id = a.domain_id
   where d.code in ('FM', 'FP', 'EL')) > 160,
  'the total proving-slice graph (Electrical plus additional Foundational Maths/Physics) exceeds the Electrical-only floor, confirming FM/FP are additional and not counted toward the Electrical target'
);

-- ===================================================================
-- 3. All stable assertion identities in the corpus are unique.
-- ===================================================================

select is(
  (select count(*)::int from (
     select identifier from public.assertions a
     join public.domains d on d.id = a.domain_id
     where d.code in ('FM', 'FP', 'EL')
     group by identifier having count(*) > 1
   ) dup),
  0,
  'no stable assertion identifier in the corpus is duplicated'
);

-- ===================================================================
-- 4-5. Every corpus assertion has a resolving APPROVED version, and
-- every APPROVED version has at least one provenance link.
-- ===================================================================

select is(
  (select count(*)::int from public.assertions a
   join public.domains d on d.id = a.domain_id
   join public.assertion_versions av on av.assertion_id = a.id
   where d.code in ('FM', 'FP', 'EL') and av.status = 'APPROVED'),
  (select count(*)::int from public.assertions a
   join public.domains d on d.id = a.domain_id
   where d.code in ('FM', 'FP', 'EL')),
  'every corpus assertion has exactly one resolving APPROVED current version'
);

select is(
  (select count(*)::int from public.assertions a
   join public.domains d on d.id = a.domain_id
   join public.assertion_versions av on av.assertion_id = a.id
   left join public.assertion_provenance_links apl on apl.assertion_version_id = av.id
   where d.code in ('FM', 'FP', 'EL') and av.status = 'APPROVED' and apl.id is null),
  0,
  'every APPROVED corpus assertion version has at least one provenance link (approved versions with no provenance = 0)'
);

-- ===================================================================
-- 6. Provenance resolves fully through source_locator -> source_version
-- -> source for every link (no broken chain).
-- ===================================================================

select is(
  (select count(*)::int from public.assertion_provenance_links apl
   join public.assertion_versions av on av.id = apl.assertion_version_id
   join public.assertions a on a.id = av.assertion_id
   join public.domains d on d.id = a.domain_id
   join public.source_locators sl on sl.id = apl.source_locator_id
   join public.source_versions sv on sv.id = sl.source_version_id
   join public.sources s on s.id = sv.source_id
   where d.code in ('FM', 'FP', 'EL')),
  (select count(*)::int from public.assertion_provenance_links apl
   join public.assertion_versions av on av.id = apl.assertion_version_id
   join public.assertions a on a.id = av.assertion_id
   join public.domains d on d.id = a.domain_id
   where d.code in ('FM', 'FP', 'EL')),
  'every corpus provenance link resolves through source_locator -> source_version -> source'
);

-- ===================================================================
-- 7-8. Rights classifications are valid and never ORIGINAL/UNKNOWN --
-- no assertion relies solely on this project's own collection.
-- ===================================================================

select is(
  (select count(*)::int from public.assertion_provenance_links apl
   join public.assertion_versions av on av.id = apl.assertion_version_id
   join public.assertions a on a.id = av.assertion_id
   join public.domains d on d.id = a.domain_id
   join public.source_locators sl on sl.id = apl.source_locator_id
   join public.source_versions sv on sv.id = sl.source_version_id
   where d.code in ('FM', 'FP', 'EL')
     and sv.rights_classification not in (
       'OPEN', 'OFFICIAL_OGL', 'PUBLIC_RESTRICTED', 'PROPRIETARY_REFERENCE', 'LICENSED', 'ORIGINAL'
     )),
  0,
  'every corpus provenance rights classification is one of the approved classes'
);

select is(
  (select count(*)::int from public.source_versions sv
   join public.source_locators sl on sl.source_version_id = sv.id
   join public.assertion_provenance_links apl on apl.source_locator_id = sl.id
   join public.assertion_versions av on av.id = apl.assertion_version_id
   join public.assertions a on a.id = av.assertion_id
   join public.domains d on d.id = a.domain_id
   where d.code in ('FM', 'FP', 'EL') and sv.rights_classification = 'ORIGINAL'),
  0,
  'no corpus assertion is provenanced solely by this project''s own ORIGINAL source (no circular internal-only provenance)'
);

-- ===================================================================
-- 9. Curriculum mappings point to the confirmed (non-placeholder)
-- curriculum version. CC-09A: cv-2365-02-v1-12 (CC-04B's deliberately-
-- scoped proving slice) is now SUPERSEDED by cv-2365-02-v1-12-r2 (the
-- complete official LO1-LO6/AC/Range-item extraction of the SAME
-- handbook edition, verified directly against cityandguilds.com) --
-- never a content mutation, a lifecycle status change only, so both
-- rows are checked: exactly one CURRENT row for 2365-02, and the
-- original CC-04B row preserved unchanged as SUPERSEDED.
-- ===================================================================

select results_eq(
  $$ select c.code, cv.version_label, cv.status
     from public.curricula c
     join public.curriculum_versions cv on cv.curriculum_id = c.id
     where c.code = '2365-02' and cv.status = 'CURRENT' $$,
  $$ values ('2365-02'::text, 'Version 1.12 (April 2026) -- complete LO1-LO6 extraction (CC-09A)'::text, 'CURRENT'::text) $$,
  'the 2365-02 CURRENT curriculum version is the CC-09A complete LO1-LO6 extraction, not a placeholder'
);

select results_eq(
  $$ select c.code, cv.version_label, cv.status
     from public.curricula c
     join public.curriculum_versions cv on cv.curriculum_id = c.id
     where c.code = '2365-02' and cv.status = 'SUPERSEDED' $$,
  $$ values ('2365-02'::text, 'Version 1.12 (April 2026)'::text, 'SUPERSEDED'::text) $$,
  'the original CC-04B curriculum version is preserved unchanged, now SUPERSEDED (never mutated or deleted)'
);

-- ===================================================================
-- 9a. CC-09A: the CURRENT (cv-2365-02-v1-12-r2) curriculum version has
-- exactly the official Unit 202 skeleton -- 6 Learning Outcomes, 23
-- Assessment Criteria, 58 Range items -- and every Range item is
-- parented under an Assessment Criterion (never directly under a
-- Learning Outcome). These are the mechanical completeness gates for
-- the TRANSCRIPTION itself; assertion/lesson/question-blueprint
-- coverage of that transcription is deliberately NOT gated here -- see
-- scripts/content/report-coverage-matrix.ts, which is expected to
-- report real backlog at this stage.
-- ===================================================================

select is(
  (select count(*)::int from public.curriculum_nodes cn
   join public.curriculum_versions cv on cv.id = cn.curriculum_version_id
   where cv.version_label = 'Version 1.12 (April 2026) -- complete LO1-LO6 extraction (CC-09A)'
     and cn.node_type = 'LEARNING_OUTCOME'),
  6,
  'the CC-09A curriculum version declares exactly the official 6 Unit 202 Learning Outcomes'
);

select is(
  (select count(*)::int from public.curriculum_nodes cn
   join public.curriculum_versions cv on cv.id = cn.curriculum_version_id
   where cv.version_label = 'Version 1.12 (April 2026) -- complete LO1-LO6 extraction (CC-09A)'
     and cn.node_type = 'ASSESSMENT_CRITERION'),
  23,
  'the CC-09A curriculum version declares exactly the official 23 Unit 202 Assessment Criteria'
);

select is(
  (select count(*)::int from public.curriculum_nodes cn
   join public.curriculum_versions cv on cv.id = cn.curriculum_version_id
   where cv.version_label = 'Version 1.12 (April 2026) -- complete LO1-LO6 extraction (CC-09A)'
     and cn.node_type = 'RANGE_ITEM'),
  58,
  'the CC-09A curriculum version declares exactly the official 58 mandatory Unit 202 Range items'
);

select is(
  (select count(*)::int from public.curriculum_nodes item
   join public.curriculum_nodes parent on parent.id = item.parent_node_id
   join public.curriculum_versions cv on cv.id = item.curriculum_version_id
   where cv.version_label = 'Version 1.12 (April 2026) -- complete LO1-LO6 extraction (CC-09A)'
     and item.node_type = 'RANGE_ITEM'
     and parent.node_type <> 'ASSESSMENT_CRITERION'),
  0,
  'every CC-09A Range item is parented under an Assessment Criterion (never directly under a Learning Outcome)'
);

select is(
  (select count(*)::int from public.curriculum_versions
   where status = 'CURRENT' and (
     version_label ilike '%unconfirmed%' or version_label ilike '%placeholder%'
     or version_label ilike '%tbd%' or version_label ilike '%draft%'
   )),
  0,
  'no CURRENT curriculum version in the database is labelled as an unconfirmed placeholder'
);

-- ===================================================================
-- 10-11. Every Electrical assertion maps to at least one real curriculum
-- node (unmapped Electrical count = 0); every referenced Assessment
-- Criterion node has at least one mapped assertion (no unexplained gap).
-- ===================================================================

select is(
  (select count(*)::int from public.assertions a
   join public.domains d on d.id = a.domain_id
   where d.code = 'EL'
     and not exists (
       select 1 from public.assertion_curriculum_mappings m where m.assertion_id = a.id
     )),
  0,
  'every Electrical assertion has at least one curriculum mapping (unmapped Electrical count = 0)'
);

-- Scoped to the original CC-04B curriculum version specifically (never
-- the CC-09A complete extraction) -- CC-04B's own deliberately-scoped 19
-- Assessment Criteria are, and must remain, fully covered; the CC-09A
-- version's additional Assessment Criteria (AC3.1, AC3.2, LO6's AC6.1/
-- AC6.2) have no assertion authored yet by design, and asserting zero
-- uncovered ACs against that version would be false: that real,
-- mechanically-derived backlog is scripts/content/report-coverage-matrix.ts's
-- job to expose, not this gate's.
select is(
  (select count(*)::int from public.curriculum_nodes cn
   join public.curriculum_versions cv on cv.id = cn.curriculum_version_id
   where cn.node_type = 'ASSESSMENT_CRITERION'
     and cv.version_label = 'Version 1.12 (April 2026)'
     and cv.status = 'SUPERSEDED'
     and not exists (
       select 1 from public.assertion_curriculum_mappings m where m.curriculum_node_id = cn.id
     )),
  0,
  'no Assessment Criterion node in the original CC-04B proving slice has zero mapped assertions'
);

-- ===================================================================
-- 12. Curriculum coverage spans multiple Learning Outcomes (LO1 via
-- EXEMPLIFIES, LO2, LO3, LO4, LO5), proving CC-04B's breadth expansion
-- beyond the CC-04A LO2/LO4-only slice.
-- ===================================================================

select is(
  (select count(distinct cn.code)::int
   from public.assertion_curriculum_mappings m
   join public.assertions a on a.id = m.assertion_id
   join public.domains d on d.id = a.domain_id and d.code = 'EL'
   join public.curriculum_nodes cn on cn.id = m.curriculum_node_id
   join public.curriculum_nodes lo on lo.id = cn.parent_node_id and lo.node_type = 'LEARNING_OUTCOME'
   ),
  19,
  'Electrical assertions map to all 19 selected Assessment Criterion nodes across LO1/LO2/LO3/LO4/LO5 (scoped to the 2365-02 corpus, excluding the unrelated pre-existing CC-02 SAMPLE_DOMAIN fixture mapping)'
);

-- ===================================================================
-- 13. Horizontal (Foundational Maths/Physics) assertions are NEVER
-- curriculum-mapped directly, and are all connected into the graph via
-- at least one relationship (no true orphans). Per explicit Product
-- Owner direction (CC-04B), a Foundational assertion that does not
-- currently reach an Electrical target is not itself a defect -- see
-- the used-vs-unused-but-retained counts below.
-- ===================================================================

select is(
  (select count(*)::int from public.assertion_curriculum_mappings m
   join public.assertions a on a.id = m.assertion_id
   join public.domains d on d.id = a.domain_id
   where d.code in ('FM', 'FP')),
  0,
  'no Foundational Maths/Physics assertion is directly curriculum-mapped (horizontal knowledge, not syllabus statements)'
);

select is(
  (select count(*)::int from public.assertions a
   join public.domains d on d.id = a.domain_id
   where d.code in ('FM', 'FP')
     and not exists (
       select 1 from public.assertion_relationships r
       where r.from_assertion_id = a.id or r.to_assertion_id = a.id
     )),
  0,
  'every Foundational Maths/Physics assertion participates in at least one relationship (zero true orphans)'
);

-- Currently-used (reaches an Electrical target) vs currently-unused-but-
-- retained Foundational assertions -- informational per Product Owner
-- direction, not a pass/fail count on its own.
select ok(
  (select count(*)::int from public.assertions h
   join public.domains hd on hd.id = h.domain_id and hd.code in ('FM', 'FP')
   where exists (
     with recursive downstream as (
       select r.to_assertion_id as aid from public.assertion_relationships r
       where r.from_assertion_id = h.id and r.relationship_type = 'PREREQUISITE_OF'
       union
       select r.to_assertion_id from public.assertion_relationships r
       join downstream d on r.from_assertion_id = d.aid
       where r.relationship_type = 'PREREQUISITE_OF'
     )
     select 1 from downstream
     join public.assertions el on el.id = downstream.aid
     join public.domains eld on eld.id = el.domain_id and eld.code = 'EL'
   )) between 1 and 30,
  'a mechanically countable number of Foundational Maths/Physics assertions currently reach an Electrical target (used-vs-unused split is reported, not treated as pass/fail)'
);

-- ===================================================================
-- 14-15. Upstream / downstream traversal.
-- ===================================================================

select results_eq(
  $$
  with recursive upstream as (
    select r.from_assertion_id as assertion_id
    from public.assertion_relationships r
    join public.assertions target on target.id = r.to_assertion_id
    where target.identifier = 'EL-OHM-SOLVE-I-001' and r.relationship_type = 'PREREQUISITE_OF'
    union
    select r.from_assertion_id
    from public.assertion_relationships r
    join upstream u on r.to_assertion_id = u.assertion_id
    where r.relationship_type = 'PREREQUISITE_OF'
  )
  select a.identifier from upstream u join public.assertions a on a.id = u.assertion_id order by a.identifier
  $$,
  $$ values
    ('EL-CONCEPT-CURRENT-001'), ('EL-CONCEPT-RESISTANCE-001'), ('EL-CONCEPT-VOLTAGE-001'),
    ('EL-OHM-REARRANGE-001'), ('EL-OHM-RELATIONSHIP-001'),
    ('FM-ALG-EQUALITY-MULT-001'), ('FM-ALG-INVERSE-OPS-MULT-001'), ('FM-ALG-SUBSTITUTION-001'),
    ('FM-ALG-TRANSPOSE-MULT-001'), ('FM-NUM-SI-PREFIX-001'), ('FM-NUM-SI-PREFIX-CONVERT-001'),
    ('FM-NUM-STANDARD-FORM-001'), ('FP-CONCEPT-ENERGY-001'), ('FP-CONCEPT-FORCE-001'), ('FP-CONCEPT-WORK-001')
  $$,
  'recursive upstream traversal from EL-OHM-SOLVE-I-001 returns the exact expected 15-assertion prerequisite set, spanning Electrical, Foundational Maths and Foundational Physics'
);

select ok(
  (select count(*)::int from (
    with recursive downstream as (
      select r.to_assertion_id as assertion_id
      from public.assertion_relationships r
      join public.assertions src on src.id = r.from_assertion_id
      where src.identifier = 'FM-ALG-TRANSPOSE-MULT-001' and r.relationship_type = 'PREREQUISITE_OF'
      union
      select r.to_assertion_id
      from public.assertion_relationships r
      join downstream d on r.from_assertion_id = d.assertion_id
      where r.relationship_type = 'PREREQUISITE_OF'
    )
    select a.identifier from downstream d join public.assertions a on a.id = d.assertion_id
  ) x) >= 6,
  'recursive downstream traversal from FM-ALG-TRANSPOSE-MULT-001 reaches at least 6 dependents (grows monotonically with the CC-04B expansion, e.g. now also reaching compound supply-current capabilities)'
);

-- ===================================================================
-- 16-21. Six qualitatively distinct diagnostic root-cause substrate
-- paths (CC-04B hard requirement).
-- ===================================================================

-- A -- transposition: depth-3 chain through general algebraic
-- transposition and its own prerequisites.
select ok(
  exists (
    select 1
    from public.assertion_relationships r1
    join public.assertions solve on solve.id = r1.to_assertion_id and solve.identifier = 'EL-OHM-SOLVE-I-001'
    join public.assertions rearrange on rearrange.id = r1.from_assertion_id and rearrange.identifier = 'EL-OHM-REARRANGE-001'
    join public.assertion_relationships r2 on r2.to_assertion_id = rearrange.id
    join public.assertions transpose on transpose.id = r2.from_assertion_id and transpose.identifier = 'FM-ALG-TRANSPOSE-MULT-001'
    join public.assertion_relationships r3 on r3.to_assertion_id = transpose.id
    join public.assertions root on root.id = r3.from_assertion_id and root.identifier = 'FM-ALG-EQUALITY-MULT-001'
    where r1.relationship_type = 'PREREQUISITE_OF' and r2.relationship_type = 'PREREQUISITE_OF' and r3.relationship_type = 'PREREQUISITE_OF'
  ),
  'path A (transposition): EL-OHM-SOLVE-I-001 <- EL-OHM-REARRANGE-001 <- FM-ALG-TRANSPOSE-MULT-001 <- FM-ALG-EQUALITY-MULT-001'
);

-- B -- relationship/concept: not knowing what the quantities mean,
-- distinct from a transposition failure.
select ok(
  exists (
    select 1 from public.assertion_relationships r
    join public.assertions rel on rel.id = r.to_assertion_id and rel.identifier = 'EL-OHM-RELATIONSHIP-001'
    join public.assertions concept on concept.id = r.from_assertion_id and concept.identifier = 'EL-CONCEPT-VOLTAGE-001'
    where r.relationship_type = 'PREREQUISITE_OF'
  ),
  'path B (relationship/concept): EL-OHM-RELATIONSHIP-001 depends on EL-CONCEPT-VOLTAGE-001'
);

-- C -- reciprocal/parallel: a qualitatively different mathematical root.
select ok(
  exists (
    with recursive upstream as (
      select r.from_assertion_id as assertion_id from public.assertion_relationships r
      join public.assertions target on target.id = r.to_assertion_id
      where target.identifier = 'EL-PARALLEL-RESISTANCE-CALC-001' and r.relationship_type = 'PREREQUISITE_OF'
      union
      select r.from_assertion_id from public.assertion_relationships r
      join upstream u on r.to_assertion_id = u.assertion_id where r.relationship_type = 'PREREQUISITE_OF'
    )
    select 1 from upstream u join public.assertions a on a.id = u.assertion_id where a.identifier = 'FM-ARITH-RECIPROCAL-SUM-001'
  ),
  'path C (reciprocal/parallel): EL-PARALLEL-RESISTANCE-CALC-001 depends on FM-ARITH-RECIPROCAL-SUM-001'
);

-- D -- unit/prefix: an SI-prefix conversion failure, distinct from all
-- of the above.
select ok(
  exists (
    with recursive upstream as (
      select r.from_assertion_id as assertion_id from public.assertion_relationships r
      join public.assertions target on target.id = r.to_assertion_id
      where target.identifier = 'EL-OHM-SOLVE-V-001' and r.relationship_type = 'PREREQUISITE_OF'
      union
      select r.from_assertion_id from public.assertion_relationships r
      join upstream u on r.to_assertion_id = u.assertion_id where r.relationship_type = 'PREREQUISITE_OF'
    )
    select 1 from upstream u join public.assertions a on a.id = u.assertion_id where a.identifier = 'FM-NUM-SI-PREFIX-CONVERT-001'
  ),
  'path D (unit/prefix): EL-OHM-SOLVE-V-001 depends on FM-NUM-SI-PREFIX-CONVERT-001'
);

-- E -- power/energy: a multi-hop Foundational-Physics-to-Electrical
-- chain grounding electrical energy in general physics.
select ok(
  exists (
    with recursive upstream as (
      select r.from_assertion_id as assertion_id from public.assertion_relationships r
      join public.assertions target on target.id = r.to_assertion_id
      where target.identifier = 'EL-ENERGY-CALC-001' and r.relationship_type = 'PREREQUISITE_OF'
      union
      select r.from_assertion_id from public.assertion_relationships r
      join upstream u on r.to_assertion_id = u.assertion_id where r.relationship_type = 'PREREQUISITE_OF'
    )
    select 1 from upstream u join public.assertions a on a.id = u.assertion_id where a.identifier = 'FP-CONCEPT-POWER-001'
  ),
  'path E (power/energy): EL-ENERGY-CALC-001 depends transitively on FP-CONCEPT-POWER-001 (via EL-CONCEPT-POWER-001, FP-CONCEPT-WORK-001/ENERGY-001)'
);

-- F -- magnetism/AC waveform family: a qualitatively different concept
-- family (CC-04B LO5 expansion) structurally unrelated to the DC/
-- algebra-rooted paths above.
select ok(
  exists (
    with recursive upstream as (
      select r.from_assertion_id as assertion_id from public.assertion_relationships r
      join public.assertions target on target.id = r.to_assertion_id
      where target.identifier = 'EL-WAVEFORM-RMS-CALC-001' and r.relationship_type = 'PREREQUISITE_OF'
      union
      select r.from_assertion_id from public.assertion_relationships r
      join upstream u on r.to_assertion_id = u.assertion_id where r.relationship_type = 'PREREQUISITE_OF'
    )
    select 1 from upstream u join public.assertions a on a.id = u.assertion_id where a.identifier = 'EL-CONCEPT-MAGNETIC-FLUX-001'
  ),
  'path F (magnetism/AC): EL-WAVEFORM-RMS-CALC-001 depends transitively on EL-CONCEPT-MAGNETIC-FLUX-001 (via EMF, AC generator, sine wave, RMS) -- a family structurally unrelated to Ohm''s law/DC circuits'
);

-- ===================================================================
-- 22-23. One horizontal assertion influences multiple vocational
-- targets; a vocational target has multiple (3+) converging prerequisite
-- branches.
-- ===================================================================

select ok(
  (select count(*)::int from public.assertion_relationships r
   join public.assertions fm on fm.id = r.from_assertion_id and fm.identifier = 'FM-ALG-SUBSTITUTION-001'
   join public.assertions el on el.id = r.to_assertion_id
   join public.domains eld on eld.id = el.domain_id and eld.code = 'EL'
   where r.relationship_type = 'PREREQUISITE_OF') >= 5,
  'FM-ALG-SUBSTITUTION-001 is a direct PREREQUISITE_OF at least five distinct Electrical (vocational) capabilities'
);

select ok(
  (select count(*)::int from public.assertion_relationships r
   join public.assertions target on target.id = r.to_assertion_id and target.identifier = 'EL-OHM-RELATIONSHIP-001'
   where r.relationship_type = 'PREREQUISITE_OF') >= 3,
  'EL-OHM-RELATIONSHIP-001 has three or more converging direct prerequisites'
);

-- ===================================================================
-- 24-27. Graph health: self edges, duplicate edges, unintended
-- prerequisite cycles, broken relationship targets -- all zero.
-- ===================================================================

select is(
  (select count(*)::int from public.assertion_relationships where from_assertion_id = to_assertion_id),
  0,
  'self edges = 0'
);

select is(
  (select count(*)::int from (
     select from_assertion_id, to_assertion_id, relationship_type
     from public.assertion_relationships
     group by from_assertion_id, to_assertion_id, relationship_type
     having count(*) > 1
   ) dup),
  0,
  'duplicate edges = 0'
);

select is(
  (with recursive walk(start_id, current_id, depth) as (
     select r.from_assertion_id, r.to_assertion_id, 1
     from public.assertion_relationships r
     where r.relationship_type = 'PREREQUISITE_OF'
     union all
     select w.start_id, r.to_assertion_id, w.depth + 1
     from public.assertion_relationships r
     join walk w on r.from_assertion_id = w.current_id
     where r.relationship_type = 'PREREQUISITE_OF' and w.depth < 25
   )
   select count(*)::int from walk where current_id = start_id),
  0,
  'unintended prerequisite cycles = 0 (depth-capped self-reachability check, cap 25, above the corpus''s actual max depth)'
);

select is(
  (select count(*)::int from public.assertion_relationships r
   left join public.assertions f on f.id = r.from_assertion_id
   left join public.assertions t on t.id = r.to_assertion_id
   where f.id is null or t.id is null),
  0,
  'broken relationship targets = 0 (every edge resolves to two existing assertions)'
);

-- ===================================================================
-- 28-29. Misconception links resolve; exact deterministic count.
-- ===================================================================

select is(
  (select count(*)::int from public.misconception_assertion_conflicts c
   left join public.misconceptions m on m.id = c.misconception_id
   left join public.assertions a on a.id = c.assertion_id
   where m.id is null or a.id is null),
  0,
  'every misconception-assertion conflict resolves to an existing misconception and assertion'
);

select is(
  (select count(*)::int from public.misconceptions), 20,
  'exactly 20 misconceptions exist (deterministic import, no duplication)'
);

-- ===================================================================
-- 30-31. Deterministic import does not duplicate logical records (exact
-- counts, combined with re-executing supabase/seed-content/*.sql a
-- second time against a live database -- see the completion report).
-- ===================================================================

select is(
  (select count(*)::int from public.assertions a
   join public.domains d on d.id = a.domain_id where d.code in ('FM', 'FP', 'EL')),
  176,
  'exactly 176 total corpus assertions exist (deterministic import, no duplication)'
);

select is(
  (select count(*)::int from public.assertions a
   join public.domains d on d.id = a.domain_id where d.code = 'EL'),
  146,
  'exactly 146 Electrical assertions exist (deterministic import, no duplication)'
);

-- ===================================================================
-- 32-33. Diagnostic diversity: distinct declarative/relational,
-- procedural/calculation, comparison, interpretation, unit/measurement
-- and multi-prerequisite capability types are all mechanically present.
-- ===================================================================

select ok(
  exists (select 1 from public.assertions where identifier = 'EL-CIRCUIT-COMPARE-RESISTANCE-001')
  and exists (select 1 from public.assertions where identifier = 'EL-OHM-SELECT-RELATIONSHIP-001')
  and exists (select 1 from public.assertions where identifier = 'EL-SERIES-PREDICT-OPEN-001')
  and exists (select 1 from public.assertions where identifier = 'EL-INTERPRET-PARALLEL-RESULT-001')
  and exists (select 1 from public.assertions where identifier = 'EL-UNIT-HERTZ-001')
  and exists (select 1 from public.assertions where identifier = 'EL-OHM-SOLVE-I-001'),
  'the corpus mechanically contains comparison, selection, prediction, interpretation, unit/measurement and calculation capability types (vocational diversity requirement)'
);

select ok(
  (select count(*)::int from (
    select to_assertion_id, count(*) c from public.assertion_relationships
    where relationship_type = 'PREREQUISITE_OF'
    group by to_assertion_id having count(*) >= 2
  ) x) >= 10,
  'at least ten Electrical/Foundational assertions have two or more direct prerequisites (multi-prerequisite capabilities)'
);

-- ===================================================================
-- 34. Different misconception families exist (relationship, transposition,
-- wrong-operation, reciprocal, series/parallel, current/voltage, unit,
-- SI-prefix, power/energy, resistance/resistivity, instrument-selection,
-- electron/current-direction, AC/DC, peak/RMS, EMF/voltage).
-- ===================================================================

select ok(
  (select count(distinct identifier)::int from public.misconceptions
   where identifier in (
     'MIS-EL-OHM-UNRELATED-SYMBOLS-001', 'MIS-EL-OHM-REARRANGE-ERROR-001',
     'MIS-EL-PARALLEL-RESISTANCE-ADDITION-001', 'MIS-EL-SI-PREFIX-ERROR-001',
     'MIS-EL-RESISTANCE-RESISTIVITY-CONFUSION-001', 'MIS-EL-INSTRUMENT-CONNECTION-CONFUSION-001',
     'MIS-EL-ELECTRON-CURRENT-DIRECTION-CONFUSION-001', 'MIS-EL-AC-DC-CONFUSION-001',
     'MIS-EL-PEAK-RMS-CONFUSION-001', 'MIS-EL-EMF-VOLTAGE-CONFUSION-001'
   )) = 10,
  'at least ten distinct diagnostically-meaningful misconception families exist, spanning relationship, transposition, reciprocal, unit, resistance/resistivity, instrument, electron-direction, AC/DC and EMF confusions'
);

-- ===================================================================
-- 35-38. Existing CC-02/CC-03 governed-table security posture is
-- unaffected by CC-04B's expanded content.
-- ===================================================================

set role anon;
select throws_ok(
  $$ select 1 from public.assertions $$,
  '42501',
  null,
  'anon role still cannot read assertions after CC-04B (CC-02 posture unaffected)'
);
select throws_ok(
  $$ select 1 from public.misconceptions $$,
  '42501',
  null,
  'anon role still cannot read misconceptions after CC-04B'
);
reset role;

set role authenticated;
select throws_ok(
  $$ insert into public.assertions (identifier, domain_id) values ('CC04B-TEST', (select id from public.domains where code = 'EL')) $$,
  '42501',
  null,
  'authenticated role still cannot insert into assertions after CC-04B (CC-02 posture unaffected)'
);
select throws_ok(
  $$ select 1 from public.assertion_curriculum_mappings $$,
  '42501',
  null,
  'authenticated role still cannot read assertion_curriculum_mappings after CC-04B'
);
reset role;

select * from finish();

rollback;
