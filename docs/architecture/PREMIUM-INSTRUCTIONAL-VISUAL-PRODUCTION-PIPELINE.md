# Premium Instructional Visual Production Pipeline

**Project:** Adaptive Learning Platform
**Status:** Approved durable design specification — production methodology and art-direction governance (Product Owner / Project Architect, 2026-08-23). **Not approved by this document**: any specific piece of artwork, any specific reference image's fitness for use, any specific vendor/tool selection for image generation. This document governs *how* premium instructional artwork is produced and *what technical authority it does and does not carry* — it does not itself approve, commission or generate anything.
**Applies to:** every instructional visual the platform ever produces, across every qualification, present and future — the same universal scope as [`CC-05D`](CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md).
**Follows / extends:** [`CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md`](CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-AND-SEMANTIC-QA.md) (the governed-contract/mechanical-QA/semantic-QA architecture for how a visual is *validated*) and [`ADR-0004`](adr/ADR-0004-deterministic-authority-over-generated-instructional-imagery.md) (the hard authority boundary between deterministic technical geometry and generated imagery). This document is the *production methodology* layer: how a visual is *made* before it ever reaches CC-05D's QA pipeline.
**Design intent:** instructional visuals for a paid, category-leading consumer learning product must be premium, technically correct and pedagogically clear at once — never trading one for another. This document records how those three requirements are reconciled without introducing an unverified AI-imagined-geometry dependency into anything a learner is assessed against.

---

## 1. Instructional visuals are governed content, not decoration

A visual can encode topology, geometry, direction, sequence, spatial relationships, component recognition, formula relationships, misconceptions and assessment evidence. Visual correctness and visual completeness are therefore part of learner-content quality, on the same footing as a governed assertion's factual correctness — not a cosmetic layer applied afterward. This is the founding premise CC-05D already established (its §2: "not acceptable merely because it type-checks, renders, and structurally snapshot-matches"); this document extends the same premise to *how the artwork itself is produced*, not only how it is checked once it exists.

## 2. Visual production classes

Every instructional visual should be classified as one of three production classes. The classification is a property of the visual family, decided once and recorded alongside its governed contract (§7):

- **A. DETERMINISTIC TECHNICAL** — for content where exact geometry is itself the taught or assessed fact: circuit diagrams, UK/IEC schematic symbols, waveforms/graphs, formula visuals, mathematical geometry, instrument connections, exact force/current/field/motion relationships, and any assessment answer geometry. Produced as deterministic vector renderers (the existing `apps/mobile/src/components/diagrams/*` pattern), never as generated raster imagery. Every visual currently governed under CC-05D (all 16 diagram blueprints as of CC-11.3) is class A.
- **B. PREMIUM CONCEPTUAL ILLUSTRATION** — for physical/intuitive concepts where exact technical geometry is not itself the assessed fact: e.g. a workshop context photo-realistic impression, a material-texture comparison, an "apprentice using a tool" scene. Exact pixel geometry is not load-bearing; finish, mood, and intuitive recognisability are.
- **C. HYBRID** — a premium illustrated physical/context layer (class B) with deterministic technical overlays (class A) composited on top — e.g. a premium-illustrated motor housing with a deterministic force-arrow/pole-label overlay. **Hybrid is preferred wherever premium presentation is valuable but technical truth must remain exact** — it is not a compromise class, it is the default target for any visual that has both a "look premium" need and a "must be exactly correct" need.

No visual currently in the corpus is produced as class B or C — every one built through CC-05C/CC-05D/CC-11.x is class A, functional but not yet premium artwork (see §11's honest status record). Classes B and C describe the target state this pipeline exists to reach, not work already done.

## 3. Human-readable reference-first workflow

Do not default to an LLM or image generator inventing instructional visuals from first principles. The required production sequence for any new or replaced visual family:

```text
GOVERNED CONCEPT
  ↓
CURATED HUMAN-READABLE REFERENCE
  ↓
TECHNICAL VERIFICATION
  ↓
ALP REDESIGN / ILLUSTRATION
  ↓
DETERMINISTIC OVERLAYS
  ↓
REAL PIXEL REVIEW
```

The governed concept comes from the existing pedagogical chain (assertion family → capability → diagram blueprint, per CC-05D §B) — never invented at the artwork stage. A curated human-readable reference is then sourced before any illustration begins: public-domain historical diagrams, CC0/openly-licensed educational diagrams, standards-based technical references (e.g. IEC 60617 itself), reputable human-authored instructional diagrams, or physical reference photography where useful. **The reference exists for technical/pedagogical grounding, not stylistic copying** — it establishes that the depicted relationship is real and conventional, not that the final artwork must resemble it visually. Technical verification (checking the reference against an independent authoritative source, not merely trusting the first search result) precedes any redesign work, matching the same "independent verification before treating extraction as governed" discipline [`ADR-0002`](adr/ADR-0002-external-source-verification-and-currency.md) already established for factual content. ALP's own illustration is produced only after that grounding exists, with deterministic overlays (§6) added on top where the visual is class A or C, and real pixel review (CC-05D §D/§H, this document's §9) closing the sequence — the same "no self-approval" discipline already governing every visual in production today.

For each reusable visual family, record where practical: primary reference; source; licence/status; what relationship the reference establishes; secondary verification source(s); and which aspects are immutable technical invariants (the facts that must never change regardless of restyling — e.g. "conventional current flows from + to − outside the source" for any circuit reference, or "the thumb points along conventional current direction, fingers curl in the field's direction" for any right-hand-grip-rule reference).

## 4. Reference library as course-factory asset

The curated human-readable reference library is reusable platform infrastructure, not a one-off Unit 202 artefact. Its purpose is so the system never has to ask an LLM to rediscover, from scratch, how to correctly depict recurring concepts every vocational qualification eventually needs: levers, pulleys, gears, circuits, motors, generators, magnetic-field rules, component symbols, measurement arrangements, and their equivalents in future qualifications. Reference provenance and licensing must be retained alongside each entry, with the same discipline the Proprietary-source boundary (`ARCHITECTURE-OVERVIEW.md`) already requires for factual-content references: a reference's presence in the library never by itself grants it a licence to become a production asset if it is proprietary — only openly licensed or properly cleared references may feed a shipped visual.

## 5. Image generation is not technical authority

Generated imagery (from any current or future image-generation tool) may establish finish, style, material impression, anatomy, depth, context and visual polish. **It must never establish**: circuit topology; schematic symbol geometry; mathematical geometry; directional electromagnetism; hand-rule correspondence; exact force/current/field/motion direction; or assessment answer state. Where generated art and governed deterministic geometry disagree, **deterministic geometry wins** — this is not a style preference, it is a correctness rule, and it is recorded as a hard architectural boundary in [`ADR-0004`](adr/ADR-0004-deterministic-authority-over-generated-instructional-imagery.md) because it is exactly the kind of choice that is expensive to reverse if violated (a learner memorising an AI-hallucinated field direction is a genuine harm, not a cosmetic defect).

## 6. Direction-sensitive electromagnetism — locked-skeleton rule

For the right-hand grip rule, Fleming's left-hand (motor) rule, Fleming's right-hand (generator) rule, and any other magnetic field/current/force relationship, the artwork workflow **must begin from a technically authoritative reference construction** (§3) — never from generated imagery or an image model's/illustrator's visual memory of "what a hand-rule diagram typically looks like," which is exactly the failure mode CC-05D §0 already documented once (a structurally valid, correctly-wired diagram that was nonetheless the wrong teaching visual, and — separately, CC-11.3 — a thumb that did not actually communicate current direction). Before any illustration work begins, the following must be locked against the authoritative reference and treated as immutable for that visual family: hand orientation; digit correspondence; current direction; magnetic-field direction; force direction; motion direction; and N/S relationship. Premium illustration is then created *around* that locked skeleton — restyling the hand, the field lines, the motor housing — never redrawing the skeleton itself from artistic impression.

## 7. UK/IEC technical drawing convention

Electrical/electronic schematic symbols must use the governed UK/IEC convention appropriate to UK vocational electrical training — **BS EN 60617 / IEC 60617** is the current project direction (verified via the LO6 discovery workstream during CC-11.3, e.g. the plain-rectangle resistor symbol rather than the US/ANSI zigzag). US/ANSI conventions must not be substituted where they differ. This is mechanically governed today: `VisualSemanticContract.symbolStandard` (`packages/content-schema/src/visual-governance.ts`) carries the enum value `UK_IEC`, and `scripts/visual-governance/check-visual-completeness.ts` fails any REQUIRED component-symbol visual whose contract does not declare it (see CC-05D's own §A for the contract schema this field extends). The same governed symbol is reusable across lessons, questions, worked examples, assessment diagrams, mocks and future courses via the existing `electronics.component_symbol_card` blueprint/`ComponentSymbols.tsx` pattern — one symbol asset, many consumption points, exactly CC-05D §B's traceability model.

## 8. No baked technical text where a deterministic overlay is better

As a default, premium/raster illustrations (class B, and class B's illustrated layer within a class C hybrid) should not bake in N/S labels, current arrows, force arrows, field arrows, motion arrows, formulae, variable labels, values, or any answer-bearing text. These remain deterministic UI/vector overlays wherever practical — for accuracy (a baked label can silently go stale or wrong in a way a governed overlay cannot), localisation (text baked into a raster cannot be translated), accessibility (overlay text can be a real, screen-reader-visible string; baked text cannot), assessment-state control (CC-05D's teaching/assessment mode gating requires an element that can genuinely be present or absent, not merely visually similar), and future correction (fixing a wrong overlay label is a data change; fixing wrong baked pixels is a re-illustration).

## 9. Teaching / assessment / feedback states

Visual families should support state-aware presentation exactly as CC-05D §H and §K already govern for class-A visuals, extended here to classes B and C: TEACHING may reveal labels, directions, highlighted paths and explanatory overlays; ASSESSMENT must remove answer-bearing information while preserving fair context; FEEDBACK may reveal the correct governed relationship. Do not create unrelated visual assets for each state — one governed visual skeleton (the class-B/C illustrated base) should support all three states via deterministic overlay presence/absence, exactly the pattern `DiagramRevealProps` already establishes for class-A diagrams (`apps/mobile/src/components/diagrams/DiagramRenderer.tsx`).

## 10. Premium quality standard

The target is a category-leading paid consumer learning product (Product Principle 24: "narrow commercial quality beats broad rough coverage"). A visual is not finished merely because it is technically valid, rendered, and mechanically governed — production approval requires all five of: **technical correctness** + **pedagogical clarity** + **mobile legibility** + **visual quality** + **consistency with ALP's visual language**. Real pixel-level review remains required for every one of these five, not only the first — automated/mock semantic checks (CC-05D §F/§N's explicit "informational only" framing) do not, on their own, constitute visual approval, and neither does a class-A mechanical governance pass on its own constitute approval of a class B/C visual's illustration quality (mechanical governance can prove a deterministic overlay is present and correct; it cannot judge whether the illustrated layer around it looks premium).

## 11. Art direction / style system

ALP will maintain an instructional-visual style guide ("illustration bible") governing: visual personality; line hierarchy; semantic colour roles; arrow/motion grammar; physical-object simplification; perspective; dark-theme behaviour; mobile composition; technical-overlay rules; teaching/assessment states; accessibility; and consistency across future qualifications. The target character: premium, contemporary, technically credible, mature enough for adult learners, approachable to apprentices — explicitly **not** childish, **not** generic corporate vector art, and **not** textbook-only line art where a physical concept genuinely deserves illustration. The style guide itself is not built by this document; this document records that it is required and what it must govern, matching CC-05D's own established pattern of recording an architectural requirement before the implementation package that fulfils it exists (e.g. CC-05D §1's explicitly out-of-scope items, later closed by CC-11/CC-11.3).

One durable, already-governed fact the future style guide must build on rather than replace: every current class-A diagram uses the app's real dark-theme design tokens (`apps/mobile/src/lib/tokens.ts` — background `#0B0D12`, text `#F2F4F8`, secondary text `#9AA3B2`), confirmed correct during CC-11.3's real pixel review (the actual defect found there was in the review-tooling's own mockup background, not in the diagrams — see `PROJECT-STATUS.md` §CC-11.3 item 4). Dark-theme behaviour for premium illustration (classes B/C) must be specified against these same tokens, not a separately invented palette.

## 12. Visual completeness must be demand-driven

Do not validate only "every existing visual has a renderer." Visual completeness must be assessed from lesson / capability / misconception / instructional need → required visual → governed asset → renderer → semantic contract → lesson integration, in that direction — never the reverse ("we have this asset, where can we use it"). A missing visual must not be invisible merely because no blueprint was ever created for it. This principle is now mechanically enforced for class-A visuals by `scripts/visual-governance/check-visual-completeness.ts` (`npm run visuals:completeness:check`, built in CC-11.3, walking every current lesson step's declared visual need and verifying the asset/renderer/contract/symbol-convention chain exists) — the same demand-driven gate applies conceptually to classes B/C once they exist, extended to also verify illustration-production status (referenced, not yet illustrated, illustrated-pending-review, approved) rather than only renderer/contract presence.

## 13. Current Unit 202 status (honest record)

- A governed visual architecture exists (CC-05D) and has been mechanically proven end-to-end (CC-05D, CC-11, CC-11.1–CC-11.3).
- A whole-course visual-needs audit has been performed for Unit 202 (CC-11.3; see `reports/instructional-visuals/visual-needs-matrix.md`), classifying every lesson's visual need as REQUIRED/USEFUL/NOT_NEEDED rather than working backward from existing assets.
- Deterministic (class-A) visual coverage has materially expanded: 16 diagram blueprints, 16 renderers, 16 semantic contracts, 66 canonical variants, 0 REQUIRED-visual gaps as of CC-11.3.
- **Current production SVGs are functional, mechanically governed, and pixel-reviewed for correctness/legibility — they are class A by design (deterministic technical), not premium illustration, and were never intended to be final class-B/C artwork.** No visual in the current corpus has been through the reference-first premium illustration workflow this document establishes.
- Real visual quality/presentation refinement toward the premium standard (§10) is not yet started; it is future work this document exists to govern once undertaken.
- Selected visual families (candidates: motor/generator housings, lever/pulley/gear physical context, component photography-adjacent illustration) will be replaced or enhanced through the reference-first premium illustration workflow (§3) as class B or C visuals when that work is commissioned — a future package, not this one.
- **CC-12 and any future product-integration package must not assume the current class-A SVG artwork is final production quality.** It is correct and shippable (real pixel review has confirmed legibility and technical accuracy), but it is a functional deterministic layer, not the premium illustrated product the commercial quality bar (§10, Product Principle 24) ultimately targets.

This document does not reopen the Unit 202 knowledge/content gate — nothing above changes any assertion, capability, question blueprint, or governed factual content; it governs artwork production methodology only.

## 14. Relationship to CC-05D

This document adds no new field to `VisualSemanticContract` beyond what CC-11.3 already added (`symbolStandard`, §7 above) and changes no CC-05D mechanical/semantic QA behaviour. CC-05D remains the sole authority for *how a visual is validated once it exists* (contracts, canonical variants, mechanical checks, two-pass semantic QA, human-review escalation, publication gating). This document is the sole authority for *how a visual is produced before it reaches that pipeline*. A future class-B/C visual still needs a `VisualSemanticContract`, still needs canonical variants for its deterministic overlay elements, and still needs to pass every CC-05D gate — premium production status is an additional property recorded alongside, never a substitute for, CC-05D governance.

---

*This document is the durable design authority for premium instructional artwork production methodology. It does not itself constitute implementation evidence — no artwork was produced or changed by this document. See [`ADR-0004`](adr/ADR-0004-deterministic-authority-over-generated-instructional-imagery.md) for the specific hard authority-boundary decision, and `PROJECT-STATUS.md` §CC-11.3 for the current, honest state of Unit 202's visual layer.*
