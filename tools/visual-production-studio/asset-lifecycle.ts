/**
 * CC-11.13: the asset-lifecycle / gating model, separating CORRECTNESS
 * from APPEARANCE from APPROVAL -- the specific weakness the CC-11.13
 * hardening package exists to fix: the pipeline previously had only one
 * audit dimension expanded to three (CC-11.12's TECHNICAL /
 * PEDAGOGICAL_CLARITY / VISUAL_PRODUCT_QUALITY verdicts), but no explicit
 * LIFECYCLE STATE distinguishing "usable for ongoing product development"
 * from "fully finished" from "Product Owner signed off".
 *
 * KEY RULE: an asset may be development-usable while still POLISH_PENDING.
 * Do not require full polish before an asset can be used internally. But
 * an asset with a KNOWN TECHNICAL TEACHING ERROR must never be treated as
 * approved merely because it is aesthetically acceptable -- that is
 * exactly the CC-11.13 rule (§14 acceptance criterion 4) this file
 * encodes structurally: `isDevelopmentUsable()` checks BLOCKING_CORRECTNESS
 * membership first, before ever consulting polish/approval state.
 *
 * Applied as an additive overlay keyed by assetId (or `assetId.state.slug`
 * for per-state entries), the same proven pattern as
 * `reference-corrections.ts` / `semantic-reference-qa.ts` /
 * `production-mode.ts`.
 */

/**
 * The ordered lifecycle gates. Not strictly linear for every asset (a
 * DETERMINISTIC_TECHNICAL asset has no separate "reference" or "semantic
 * composition" step, for instance) -- `ASSET_LIFECYCLE` records each
 * asset's actual current gate, not a mandatory walk through all seven.
 *
 * - REFERENCE_APPROVED: a technically suitable reference has been sourced
 *   and semantically QA'd (semantic-reference-qa.ts's referenceDisposition
 *   is APPROVED_DIRECT/APPROVED_PREPARED).
 * - SEMANTIC_COMPOSITION_APPROVED: the exact frame/board to be redrawn
 *   (crop, prepared board, or the reference itself) is locked -- what will
 *   actually be shown to the generator, not just "a reference exists".
 * - TECHNICAL_MASTER_APPROVED: a generated/rendered master exists whose
 *   TECHNICAL verdict is PASS (geometry/topology/direction/polarity/
 *   labels/state all correct) -- pedagogical clarity and polish are NOT
 *   yet claimed.
 * - PEDAGOGICAL_MASTER_APPROVED: the master's PEDAGOGICAL_CLARITY verdict
 *   is also PASS -- the intended idea is quickly understandable, no
 *   competing/irrelevant visual ideas. This is the gate that matters for
 *   BLOCKING_CORRECTNESS vs DEVELOPMENT_USABLE (see visual-debt-register).
 * - POLISH_PENDING: technically and pedagogically correct, usable for
 *   ongoing product development now, but VISUAL_PRODUCT_QUALITY is not yet
 *   PASS (soft/fuzzy rendering, minor label-count mismatch, etc.).
 * - POLISHED: all three CC-11.12 verdicts PASS.
 * - PRODUCT_OWNER_APPROVED: a real, separate Product Owner sign-off has
 *   happened. Never inferred from an internal audit PASS, however good --
 *   see `docs/architecture/PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md`
 *   §20's own "Product Owner remains final approval authority" rule.
 */
export type LifecycleGate =
  | "REFERENCE_APPROVED"
  | "SEMANTIC_COMPOSITION_APPROVED"
  | "TECHNICAL_MASTER_APPROVED"
  | "PEDAGOGICAL_MASTER_APPROVED"
  | "POLISH_PENDING"
  | "POLISHED"
  | "PRODUCT_OWNER_APPROVED";

/** CC-11.13 §12: the visual-debt triage classification -- see `unit202-visual-debt-register.{json,md}` for the actual Unit 202 register this type backs. */
export type VisualDebtClass = "BLOCKING_CORRECTNESS" | "DEVELOPMENT_USABLE_POLISH_PENDING" | "DEFERRED_SCOPE";

export interface AssetLifecycleRecord {
  gate: LifecycleGate;
  debtClass: VisualDebtClass;
  /** Why this gate/class, in plain language -- always traceable to a real audit/review finding, never asserted without evidence. */
  notes: string;
}

function record(gate: LifecycleGate, debtClass: VisualDebtClass, notes: string): AssetLifecycleRecord {
  return { gate, debtClass, notes };
}

/**
 * Unit 202's current lifecycle state, one entry per governed
 * learner-visible state actually produced (51 generative outputs from the
 * CC-11.9-CC-11.12 programme). DETERMINISTIC_TECHNICAL assets are not
 * listed here -- they have no separate lifecycle walk (a working renderer
 * IS their finished, approved state; see `production-mode.ts`).
 *
 * This is a DATA SNAPSHOT, not a live-computed view -- it reflects the
 * real audit/review findings as of CC-11.13 and must be updated by hand
 * (or a future tool) whenever an asset's real status changes, the same
 * discipline `semantic-reference-qa.ts`'s SEMANTIC_QA already follows.
 */
export const ASSET_LIFECYCLE: Record<string, AssetLifecycleRecord> = {
  // --- DEVELOPMENT_USABLE_POLISH_PENDING: correct, usable now, but with a genuinely identified (not merely presumed) finish gap ---
  // CC-11.14 correction: all three of the CC-11.13A-named next-fix candidates were remediated in the CC-11.14
  // three-asset bounded correctness package (masters v4/v3/v4, one Gemini call each, technical/pedagogical/
  // visual verdicts independently re-audited by inspecting actual pixels -- see
  // unit202-cc-11.14-three-asset-review.{json,pdf}). None are BLOCKING_CORRECTNESS any longer. All three land at
  // POLISH_PENDING, not POLISHED: they have not been through the suite-wide controlled polish pass (sharpening/
  // line-quality/family-consistency normalisation) that CC-11.14 was explicitly told NOT to perform, so they join
  // the same polish queue as the rest of the suite rather than being marked fully finished.
  "unit202.right-hand-grip.teaching": record(
    "POLISH_PENDING",
    "DEVELOPMENT_USABLE_POLISH_PENDING",
    "CC-11.14: TECHNICAL_MASTER_APPROVED and PEDAGOGICAL_MASTER_APPROVED now both genuinely earned (master v4, audit v4, all three verdicts PASS). v3 = Gemini self-referential cleanup removing both defective field arrows (v2's two-arrowhead crescent and detached wrist arrow) while pixel-preserving the hand/thumb/conductor/labels; v4 = v3 plus a DETERMINISTIC (non-Gemini-generated) wrap-around field-circulation ellipse, geometry derived by rigidly rotating the Product-Owner-approved reference's own loop path to a vertical current direction -- provably correct by construction, independently cross-checked against the visible finger curl. See unit202.right-hand-grip.teaching-audit-v4.json for the full §10 special-verification checklist. Minor noted finish item (the new arrow lacks the rod's copper gradient/shading) deferred to the suite polish pass, not blocking.",
  ),
  "unit202.emf.motional": record(
    "POLISH_PENDING",
    "DEVELOPMENT_USABLE_POLISH_PENDING",
    "CC-11.14: TECHNICAL_MASTER_APPROVED and PEDAGOGICAL_MASTER_APPROVED now both genuinely earned (master v3, audit v3, all three verdicts PASS). Generated directly from a hand-authored prepared board with l already drawn vertically, along the active conductor, before Gemini saw it -- l/v/B are now mutually perpendicular (l vertical along the conductor, v horizontal, B into the page), correcting the CC-11.13A-identified wrong-dimension defect. See unit202.emf.motional-audit-v3.json for the full §11 special-verification checklist.",
  ),
  "unit202.levers.class-3": record(
    "POLISH_PENDING",
    "DEVELOPMENT_USABLE_POLISH_PENDING",
    "CC-11.14: TECHNICAL_MASTER_APPROVED and PEDAGOGICAL_MASTER_APPROVED now both genuinely earned (master v4, audit v4, all three verdicts PASS). Generated directly from a hand-authored prepared board (the approved reference's own composition with RESISTANCE and MOTION removed and the resistance glyph relabelled LOAD) as a clean, flat, original ALP redraw -- exactly FULCRUM/EFFORT/LOAD, no 3D beam, no decorative contamination, EFFORT verified strictly between FULCRUM and LOAD. See unit202.levers.class-3-audit-v4.json for the full §12 special-verification checklist. Noted, out-of-scope-for-this-package cross-asset style difference: Class I/II remain the pre-CC-11.13 soft-3D metallic-beam style, not revisited here.",
  ),
  "unit202.electrolysis": record(
    "POLISHED",
    "DEVELOPMENT_USABLE_POLISH_PENDING",
    "Ion-arrow defect fixed and independently re-verified pixel-by-pixel (CC-11.12) -- technically and pedagogically correct. Listed here only for one real, specific, already-noted cosmetic finish gap: the 'current path' label renders twice (duplicated) in the current master. Not blocking; a targeted polish item, not a re-audit.",
  ),
  // Deliberately NOT listing every other CC-11.12 REDO-remediated asset here: each already carries three
  // independent PASS verdicts (technical/pedagogical/visual-product-quality -- see
  // unit202-semantic-qa-remediation-review.json) with no individually-identified finish complaint. Padding
  // this register with "no known defect, general backlog" entries would contradict their own POLISHED gate
  // and bloat the list the task brief explicitly asks to keep lean -- see this file's generator summary line
  // instead for that class of asset.

  // --- DEFERRED_SCOPE: not worth further Unit 202 time now ---
  "unit202.components.physical.resistor": record(
    "PEDAGOGICAL_MASTER_APPROVED",
    "DEFERRED_SCOPE",
    "Physical form strong; deterministic colour-band role labels (1st/2nd band, multiplier, tolerance) remain a real but not urgent gap -- CC-11.12's own KEEP_WITH_ANNOTATION finding, not yet wired to a deterministic overlay. See the corrected component-family rule (production-mode.ts, PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md's component-family note).",
  ),
  "unit202.components.physical.capacitor": record(
    "PEDAGOGICAL_MASTER_APPROVED",
    "DEFERRED_SCOPE",
    "CC-11.13A correction: CC-11.12 removed this asset's baked UK/IEC symbol to achieve family consistency with the other components.physical.* assets, which had no symbol. That was NOT the desired product decision -- the intended long-term teaching grammar is PHYSICAL COMPONENT RECOGNITION IMAGE + DETERMINISTIC UK/IEC SYMBOL COMPANION, for every component, capacitor included. The correct direction was to give the OTHER component states a deterministic symbol companion, not to remove the capacitor's. Do not regenerate or modify this image now -- Unit 202 component-family cleanup (giving every components.physical.* asset a deterministic symbol companion, capacitor's included, and not as a baked-in raster element) remains explicitly deferred; recorded here so a future course-production package implements the correct rule from the start.",
  ),
};

/**
 * CC-11.13A: a concise SUITE-LEVEL polish status, distinct from any single
 * asset's own lifecycle record. Product Owner review found the CC-11.9
 * -CC-11.12 generative suite as a whole reads generally below the desired
 * final visual-quality bar (sharpness/crispness, line quality, consistent
 * label treatment, family consistency, generative softness, final ALP
 * style normalisation) -- this is real, recorded debt, but it is
 * deliberately NOT expressed as 46 individual per-asset debt records (that
 * would misrepresent a genuine suite-wide finish concern as 46 unrelated
 * defects, and would contradict each asset's own real, specific
 * three-verdict PASS history). `UNIT202_GENERATIVE_SUITE_STATUS` is the
 * single, honest place this concern lives.
 *
 * This status is explicitly NOT a blocker for ongoing product development
 * and explicitly NOT Product Owner final visual approval -- it is a
 * recorded intent to run a controlled polish pass after the technical/
 * pedagogical BLOCKING_CORRECTNESS items above are closed, never before.
 */
export const UNIT202_GENERATIVE_SUITE_STATUS = {
  id: "UNIT202_GENERATIVE_SUITE",
  status: "GLOBAL_POLISH_PENDING",
  appliesTo: "Every CC-11.9-CC-11.12 generative learner-visible output not individually listed in ASSET_LIFECYCLE above (45 of 51).",
  meaning: [
    "NOT a blocker for ongoing product development -- these assets remain development-usable now.",
    "NOT Product Owner final visual approval -- no asset in this suite has that yet, regardless of polish state.",
    "A controlled polish pass (sharpening/crispness, line quality, consistent label treatment, family consistency, removal of generative softness, final ALP style normalisation) is recorded as needed, to be addressed only AFTER the BLOCKING_CORRECTNESS items in ASSET_LIFECYCLE are closed -- never before, and never as a substitute for closing them.",
  ],
  notes:
    "Recorded 2026-08-26 (CC-11.13A), correcting CC-11.13's implication that the 46 outputs with no individually-recorded debt were therefore visually finished. They are not claimed finished -- they are claimed correct and development-usable, with suite-wide polish intentionally deferred as a class, not asset-by-asset.",
} as const;

/** True only when the asset is NOT in BLOCKING_CORRECTNESS -- polish state is irrelevant to this check by design (an asset can be POLISH_PENDING and still development-usable; it can never be BLOCKING_CORRECTNESS and usable). */
export function isDevelopmentUsable(visualId: string): boolean {
  const rec = ASSET_LIFECYCLE[visualId] ?? ASSET_LIFECYCLE[visualId.split(".state.")[0] ?? visualId];
  if (!rec) return true; // no known defect on record -- not blocked.
  return rec.debtClass !== "BLOCKING_CORRECTNESS";
}

export function lifecycleFor(visualId: string): AssetLifecycleRecord | undefined {
  return ASSET_LIFECYCLE[visualId] ?? ASSET_LIFECYCLE[visualId.split(".state.")[0] ?? visualId];
}

/**
 * CC-11.13 §7: the PRESERVE / ADD / REMOVE / REPLACE remediation
 * instruction contract. Every future remediation package's per-asset
 * instruction should be expressed in this shape (not free prose alone) so
 * the pipeline can mechanically enforce "preserve-lists are first-class" --
 * the specific failure this closes is deleting an approved element (e.g. a
 * correct symbol) when the real instruction only asked for something else
 * to be ADDED elsewhere.
 *
 * `preserve` is deliberately never optional: a remediation instruction
 * with an empty preserve list is a full redraw, which must be a deliberate
 * choice (e.g. `unit202.electrolysis`'s CC-11.12 rebuild), not a default.
 */
export interface RemediationContract {
  /** Elements that MUST remain exactly as they are -- the pipeline must make it hard to accidentally remove these during a fix. Empty array is a deliberate full-redraw choice, not an omission. */
  preserve: string[];
  /** Elements to add that do not currently exist (e.g. a missing companion symbol). */
  add: string[];
  /** Elements to remove entirely (e.g. baked answer-revealing text). */
  remove: string[];
  /** Elements to replace -- implies both a remove and an add of a specific named replacement, kept distinct from a bare remove+add pair so intent ("this becomes that") is not lost. */
  replace: Array<{ from: string; to: string }>;
}

export function emptyRemediationContract(): RemediationContract {
  return { preserve: [], add: [], remove: [], replace: [] };
}
