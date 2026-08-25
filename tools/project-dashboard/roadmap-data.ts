/**
 * CC-11.8 §G1 -- the version-controlled roadmap data source.
 *
 * ARCHITECTURAL RULE: MATERIAL ROADMAP CHANGES MUST UPDATE THIS FILE.
 * The dashboard (tools/project-dashboard) renders this file; it never
 * hardcodes roadmap prose of its own. If the current phase, work
 * package, CC-stage status, dependency, gate or blocker changes, update
 * the relevant entry here in the same change that causes the change --
 * do not let this file drift from docs/roadmap/ROADMAP.md or
 * PROJECT-STATUS.md, which remain the authoritative prose sources this
 * data is transcribed from.
 *
 * Status is intentionally a closed 4-value set (task brief §G1). Where
 * PROJECT-STATUS.md records a finer-grained state (e.g. "implementation-
 * complete, review-ready" -- implementation done but not yet Product
 * Owner-approved), that nuance is preserved in `notes`, not invented as
 * a new status value.
 */

export type RoadmapStatus = "NOT_STARTED" | "IN_PROGRESS" | "BLOCKED" | "COMPLETE";

export interface RoadmapItem {
  id: string;
  label: string;
  kind: "PHASE" | "WORK_PACKAGE" | "STAGE";
  status: RoadmapStatus;
  dependsOn: string[];
  gate?: string;
  evidence?: string;
  notes?: string;
  isCurrentPosition?: boolean;
}

// Transcribed from docs/roadmap/ROADMAP.md and PROJECT-STATUS.md as of 2026-08-24.
export const ROADMAP: RoadmapItem[] = [
  {
    id: "phase-0",
    label: "Phase 0 -- Market / Product / Commercial Feasibility",
    kind: "PHASE",
    status: "COMPLETE",
    dependsOn: [],
    evidence: "Concluding decision recorded in docs/roadmap/ROADMAP.md: GO to Phase 1 as a staged founder-funded experiment.",
  },
  {
    id: "phase-1",
    label: "Phase 1 -- Architecture & End-to-End Proving Slice",
    kind: "PHASE",
    status: "IN_PROGRESS",
    dependsOn: ["phase-0"],
    notes: "Current phase. Exit requires WP1.11 (Evaluation & Phase 1 Exit Gate).",
  },

  // -- Work packages WP1.1-WP1.9 (architecture/specification), collapsed to one row each per ROADMAP.md/PROJECT-STATUS.md --
  { id: "wp1.1", label: "WP1.1 -- Proving Slice Definition & Acceptance Criteria", kind: "WORK_PACKAGE", status: "COMPLETE", dependsOn: ["phase-1"] },
  { id: "wp1.2", label: "WP1.2 -- Domain & Knowledge Architecture", kind: "WORK_PACKAGE", status: "COMPLETE", dependsOn: ["phase-1"] },
  { id: "wp1.3", label: "WP1.3 -- Learner Evidence & Mastery Architecture", kind: "WORK_PACKAGE", status: "COMPLETE", dependsOn: ["phase-1"] },
  { id: "wp1.4", label: "WP1.4 -- Diagnostic & Remediation Engine", kind: "WORK_PACKAGE", status: "COMPLETE", dependsOn: ["phase-1"] },
  { id: "wp1.5", label: "WP1.5 -- Teaching, Question & Learning-Content Architecture", kind: "WORK_PACKAGE", status: "COMPLETE", dependsOn: ["phase-1"] },
  { id: "wp1.6", label: "WP1.6 -- Platform, Data & Security Architecture", kind: "WORK_PACKAGE", status: "COMPLETE", dependsOn: ["phase-1"] },
  { id: "wp1.7", label: "WP1.7 -- Learner UX & Product Specification", kind: "WORK_PACKAGE", status: "COMPLETE", dependsOn: ["phase-1"] },
  { id: "wp1.8", label: "WP1.8 -- Content Production & Governance Pipeline", kind: "WORK_PACKAGE", status: "COMPLETE", dependsOn: ["phase-1"] },
  { id: "wp1.9", label: "WP1.9 -- Technical Architecture Decision & Implementation Plan", kind: "WORK_PACKAGE", status: "COMPLETE", dependsOn: ["phase-1"] },

  {
    id: "wp1.10",
    label: "WP1.10 -- Build the Proving Slice",
    kind: "WORK_PACKAGE",
    status: "IN_PROGRESS",
    dependsOn: ["wp1.1", "wp1.2", "wp1.3", "wp1.4", "wp1.5", "wp1.6", "wp1.7", "wp1.8", "wp1.9"],
    notes: "Subdivided into the CC implementation-package sequence below (docs/roadmap/ROADMAP.md).",
  },

  // -- CC implementation sequence (WP1.10) --
  { id: "cc-00", label: "CC-00 -- Repository Operating System", kind: "STAGE", status: "COMPLETE", dependsOn: ["wp1.10"], evidence: "Baseline checkpoint 50ab9b1e." },
  { id: "cc-01", label: "CC-01 -- Repository Foundation", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-00"], evidence: "Commit 8a678715, CI green." },
  { id: "cc-02", label: "CC-02 -- Local Supabase + Database Baseline", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-01"], evidence: "Commit b075fddc, CI green incl. pgTAP." },
  { id: "cc-03", label: "CC-03 -- Authentication + Learner Isolation", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-02"], evidence: "Commit ce9c8bb4 (+ CI-fix 977257d), CI run 31852486647 green." },
  { id: "cc-04", label: "CC-04 -- Minimum Ohm's-Law Knowledge Graph", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-03"], evidence: "Commit c67c5674, CI run 31882580990 green." },
  { id: "cc-04m", label: "CC-04M -- Mobile-Native-First Architecture Transition", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-04"], notes: "Governance/evaluation only -- no native client implementation.", evidence: "Commit 3d9c370e, CI run 31888986084 green." },
  { id: "cc-04n", label: "CC-04N -- Mobile Foundation Implementation", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-04m"], evidence: "Commit 43bf2828, CI run 31900574774 green." },
  {
    id: "cc-05",
    label: "CC-05 -- Deterministic Calculation / Question Engine",
    kind: "STAGE",
    status: "COMPLETE",
    dependsOn: ["cc-04n"],
    notes: "CC-05A/05B/05C/05D all APPROVED / COMPLETE.",
  },
  { id: "cc-06", label: "CC-06 -- First Governed Lesson", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-05"], notes: "Implementation-complete, review-ready -- Product Owner sign-off recorded in PROJECT-STATUS.md §CC-06." },
  { id: "cc-07", label: "CC-07 -- Evidence + Learner State", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-06"], notes: "Implementation-complete, Android-smoke-verified, review-ready." },
  { id: "cc-08", label: "CC-08 -- Diagnostic Golden Path", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-07"], evidence: "Commit 7d774180; CI-fix follow-up 367b346b." },
  { id: "cc-09", label: "CC-09 -- Content Admin / Governance Minimum (Unit 202 corpus)", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-08"], notes: "258 assertions, 109 question blueprints, 23/23 AC + 58/58 Range items covered. CC-09F v1.2 official-sample comparison remains open but non-blocking." },
  { id: "cc-10", label: "CC-10 -- AI Content Pipeline Proof (Unit 202 course production build)", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-09"], notes: "Implementation-complete for its authored scope." },
  {
    id: "cc-11",
    label: "CC-11 -- Complete Unit 202 Course + Instructional Visuals",
    kind: "STAGE",
    status: "COMPLETE",
    dependsOn: ["cc-10"],
    notes: "All 6 LOs / 23 ACs learner-ready (release.unit202.v4, 24 lessons). Every governed diagram blueprint (7/7) has a real renderer + VisualSemanticContract.",
  },
  { id: "cc-11.1", label: "CC-11.1 -- Unit 202 Content & Visual Gate Closeout", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-11"] },
  { id: "cc-11.2", label: "CC-11.2 -- Final Unit 202 Content-Gate Closeout", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-11.1"] },
  { id: "cc-11.3", label: "CC-11.3 -- Full Unit 202 Instructional Visual Coverage + Correction Gate", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-11.2"] },
  { id: "cc-11.5", label: "CC-11.5 -- ALP Local Instructional Visual Production Studio", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-11.3"], notes: "Production tooling only." },
  { id: "cc-11.6", label: "CC-11.6 -- Variable-Size Visual Families + Studio Two-Prompt Model", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-11.5"], notes: "Production tooling only." },
  { id: "cc-11.7", label: "CC-11.7 -- Full Unit 202 Visual Pedagogy Audit + Production Catalogue", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-11.6"], notes: "Audit + catalogue + governance, no artwork." },
  { id: "cc-11.7a", label: "CC-11.7A -- Materialise Complete Visual Production Queue", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-11.7"], notes: "Studio tooling only, no re-audit." },
  { id: "cc-11.7b", label: "CC-11.7B -- Final Pre-Production Visual Asset Audit + PDF Review Pack", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-11.7a"], gate: "Product Owner must review unit202-final-visual-production-review.pdf before artwork generation begins." },
  { id: "cc-11.7c", label: "CC-11.7C -- Tighten Visual Production Readiness", kind: "STAGE", status: "COMPLETE", dependsOn: ["cc-11.7b"], evidence: "Commit 34318a2 -- corrected reference-readiness for 15 assets, hand-rule mirror prohibition, deterministic-technical assets excluded from promptable/art-job flow." },
  {
    id: "cc-11.8",
    label: "CC-11.8 -- Automated Visual-Production Architecture, Two-Asset Gemini Proof & Project Dashboards",
    kind: "STAGE",
    status: "COMPLETE",
    dependsOn: ["cc-11.7c"],
    notes:
      "Established the canonical Claude-orchestrates / Gemini-renders / ChatGPT-researches-references division of responsibility, the ALP instructional visual style guide, and proved the pipeline end-to-end on 2 real assets via the live Gemini API. Also built this dashboard.",
    gate: "Superseded by CC-11.9's four-asset pilot gate.",
  },
  {
    id: "cc-11.9",
    label: "CC-11.9 -- External Reference Handover, White/Light Style Correction, Four-Asset Pilot & Full Unit 202 Production",
    kind: "STAGE",
    status: "COMPLETE",
    dependsOn: ["cc-11.8"],
    notes:
      "Ingested a Product Owner external reference-research handover (53/53 assets matched), corrected the style default to white/near-white, corrected required-labels-are-part-of-acceptance, completed reference acquisition/preparation for all 42 generative assets (Hard Reference Gate: 42/42 READY, PASS), and ran the four-asset pilot then full Unit 202 production: 42/42 generative assets attempted, 41 PASS / 1 HUMAN_REVIEW_REQUIRED. Superseded in part by CC-11.10's bounded remediation pass -- see that entry for the current true state.",
    gate: "Superseded by CC-11.10's remediation gate.",
  },
  {
    id: "cc-11.10",
    label: "CC-11.10 -- Bounded Remediation of the Unit 202 Visual Production Package",
    kind: "STAGE",
    status: "COMPLETE",
    dependsOn: ["cc-11.9"],
    notes:
      "External review of the CC-11.9 package identified specific defects; this package fixed them without re-opening architecture/reference-research. Generated all 12 missing canonicalState learner-visible outputs for the 3 direction-sensitive assets, corrected magnet.permanent-vs-electromagnet and electrolysis, applied a low-risk cleanup to magnet.poles.unlike, and fixed a review-package reference-display bug. unit202.levers.class-2's duplicate FULCRUM label was left HUMAN_REVIEW_REQUIRED, resolved in CC-11.11. Net tally: 51 attempted, 50 PASS, 1 HUMAN_REVIEW_REQUIRED, 66 total Gemini calls.",
    gate: "Superseded by CC-11.11's completeness gate.",
  },
  {
    id: "cc-11.11",
    label: "CC-11.11 -- Complete Unit 202 Canonical Visual-State Suite",
    kind: "STAGE",
    status: "IN_PROGRESS",
    dependsOn: ["cc-11.10"],
    isCurrentPosition: true,
    notes:
      "Final visual-completeness/reconciliation pass: mechanically classified all 98 governed canonical learner-visible states (53 ProductionAssets) into an explicit resolution record each -- 47 GENERATED, 42 DETERMINISTIC, 8 SHARED_BASE_VALID, 1 DEFERRED_SCOPE (trigonometry, no lesson yet), 0 UNRESOLVED. Closed 3 real deterministic-renderer gaps (rectification.waveforms, capacitor.transient, current-direction.electron-flow-vs-conventional) by adding new, tested React Native SVG renderer components to DiagramRenderer.tsx -- not yet wired to any lesson step (content-layer integration is the next workstream, deliberately out of this pass's scope). Resolved unit202.levers.class-2's duplicate FULCRUM label (HUMAN_REVIEW_REQUIRED -> PASS) by feeding the already-correct image back to Gemini as its own reference with a cleanup-only instruction, after two raster-patch attempts left visible artifacts. Fixed the production/pilot review JSON files' ~54.67 MB base64-bloat (now ~160 KB / ~17 KB) and produced a new state-level unit202-final-visual-suite-review.pdf/json plus a canonical visual registry (63 entries, all AWAITING_PRODUCT_OWNER_APPROVAL, no ContentRelease touched).",
    gate: "UNIT 202 VISUAL SUITE COMPLETE -- AWAITING PRODUCT OWNER / CHATGPT FINAL VISUAL APPROVAL. See reports/instructional-visuals/unit202-final-visual-suite-review.pdf. Once approved, next workstream is lesson/activity integration (wiring the 3 new deterministic renderers and the reusable-canonical-asset model into real lesson steps), then assessment/question generation, remediation/root-cause routing, learner flow/mastery/retest, and release readiness.",
  },
  { id: "cc-12", label: "CC-12 -- Electrical Power Slice", kind: "STAGE", status: "NOT_STARTED", dependsOn: ["cc-11.11"], notes: "Explicitly not started -- next course after Unit 202. Blocked on: Product Owner / ChatGPT final visual approval of the completed Unit 202 canonical visual-state suite." },
  { id: "cc-13", label: "CC-13 -- Learner Home / Progress / Weak Areas", kind: "STAGE", status: "NOT_STARTED", dependsOn: ["cc-12"] },
  { id: "cc-14", label: "CC-14 -- UX / Security Hardening", kind: "STAGE", status: "NOT_STARTED", dependsOn: ["cc-13"] },
  { id: "cc-15", label: "CC-15 -- Production-Like Deployment", kind: "STAGE", status: "NOT_STARTED", dependsOn: ["cc-14"] },
  { id: "cc-16", label: "CC-16 -- Integrated Proving-Slice Evaluation", kind: "STAGE", status: "NOT_STARTED", dependsOn: ["cc-15"] },

  {
    id: "wp1.11",
    label: "WP1.11 -- Evaluation & Phase 1 Exit Gate",
    kind: "WORK_PACKAGE",
    status: "NOT_STARTED",
    dependsOn: ["cc-16"],
    gate: "Must demonstrate: real governed knowledge/provenance; plausible content pipeline; learning from zero evidence; persistent interpretable evidence; bounded diagnosis; targeted remediation; transfer; deterministic no-LLM routine operation; materially better-than-question-bank UX; tested auth/isolation/security; scale-readiness without fundamental redesign.",
  },

  {
    id: "phase-2",
    label: "Phase 2 -- Expand Electrical Product",
    kind: "PHASE",
    status: "NOT_STARTED",
    dependsOn: ["wp1.11"],
    notes: "Not yet defined in implementation detail. Scope to be decided from Phase 1 evidence, per docs/roadmap/ROADMAP.md.",
  },
];

export function currentPositionItem(): RoadmapItem | undefined {
  return ROADMAP.find((item) => item.isCurrentPosition);
}
