# Unit 202 -- Visual Reference Research Pack: Summary

Generated: 2026-08-24T21:58:24.209Z

## Totals

- **Total distinct required final images exported:** 53
  (each row = one `VisualAsset`/assetId in `tools/visual-production-studio/catalogue.ts` -- CC-11.7B's own governed shared-base-vs-split decision already determines what counts as one distinct final image; this export does not invent a different splitting scheme. Total underlying learner-visible canonical states across all rows: 98.)
- **By production class:** HYBRID=26, DETERMINISTIC_TECHNICAL=11, PREMIUM_CONCEPTUAL=16
- **By need classification:** REQUIRED=42, USEFUL=10, DEFERRED_SCOPE=1
- **By pedagogical state(s) present:** TEACHING+ASSESSMENT=5, TEACHING=26, MULTI_STATE=22

## Reference status

- APPROVED_EXISTING: 23
- MISSING: 26
- COMPOSITE_NEEDS_CROP: 3
- SUSPECT_UNSUITABLE: 1
- BLOCKED: 0
- Total requiring reference-research action (requiresReferenceResearch=true): 38

## Hidden from the current Studio queue

11 item(s) are not surfaced as an actionable art-generation prompt in the current Visual Production Studio, but ARE included in full in this export. "Hidden" here means: DETERMINISTIC_TECHNICAL assets (CC-11.7C removed these from the Studio's promptable/art-job flow entirely -- their authoritative output is vector geometry, not a Gemini/ChatGPT art job) plus the one DEFERRED_SCOPE asset (excluded from REQUIRED/USEFUL completion accounting pending a scope decision). This is not a claim that they are missing or wrong -- only that a reviewer using the Studio's own UI would not see them in its active queue.

- `unit202.circuit.series` -- Series circuit (DETERMINISTIC_TECHNICAL)
- `unit202.circuit.parallel` -- Parallel circuit (DETERMINISTIC_TECHNICAL)
- `unit202.circuit.mixed` -- Mixed series/parallel circuit (DETERMINISTIC_TECHNICAL)
- `unit202.instrument.connections` -- Ammeter / voltmeter / ohmmeter connections (DETERMINISTIC_TECHNICAL)
- `unit202.current-direction.electron-flow-vs-conventional` -- Conventional current vs electron flow (DETERMINISTIC_TECHNICAL)
- `unit202.gears.rotation-direction` -- Gear rotation-direction reversal / idler gear (DETERMINISTIC_TECHNICAL)
- `unit202.waveform.sine` -- AC sine waveform (DETERMINISTIC_TECHNICAL)
- `unit202.components.symbols` -- Electronic component symbol system (DETERMINISTIC_TECHNICAL)
- `unit202.rectification.waveforms` -- Rectifier/inverter output waveform shapes (DETERMINISTIC_TECHNICAL)
- `unit202.capacitor.transient` -- Capacitor RC charge/discharge transient curve (DETERMINISTIC_TECHNICAL)
- `unit202.trigonometry` -- Right-angle triangle / SOHCAHTOA (DETERMINISTIC_TECHNICAL, DEFERRED_SCOPE)

## Source traceability

This export was built entirely from the live, unmodified production catalogue -- no catalogue logic was changed, no new audit was performed, no web research was done:

- `tools/visual-production-studio/catalogue.ts` -- the 53-asset / 21-family governed Unit 202 visual catalogue (`FAMILIES`, `allAssets()`), including `VisualAsset.primaryReference`/`referenceReadiness`/`immutableFacts`/`prohibitedChanges`/`canonicalStates`/`sharedBaseAudit` etc.
- `tools/visual-production-studio/catalogue.ts`'s `visualNeedClassificationFor()` -- REQUIRED/USEFUL/DEFERRED_SCOPE classification, used unmodified.
- `tools/visual-production-studio/state-store.ts`'s `loadState()` -- current per-asset Studio workflow status.
- `tools/visual-production-studio/visual-proof/proof-config.ts` and the CC-11.8 proof session's own recorded findings -- the source of the two directly-evidenced SUSPECT_UNSUITABLE/COMPOSITE_NEEDS_CROP verdicts (unit202.pulleys.fixed, unit202.levers.class-1/.class-2/.class-3); every other reference-status verdict in this pack is a mechanical read of catalogue data (empty sourceUrl, quality grade, duplicate reference URLs across siblings), never a fresh visual re-audit.

**Does the Studio under-represent the true required catalogue?** Yes, by design, for one dimension only: the Studio's default art-generation queue does not surface `DETERMINISTIC_TECHNICAL` assets (11 of them) or the 1 `DEFERRED_SCOPE` asset as actionable prompt items, because they are not art-generation jobs / not yet in scope. This export includes all of them. On every other dimension (REQUIRED vs USEFUL, READY vs NOT_READY/blocked), the Studio and this export read the same live catalogue and agree exactly.

**True total distinct final images currently required by the governed catalogue: 53** (42 REQUIRED + 10 USEFUL + 1 DEFERRED_SCOPE).

## Production-direction note (recorded only -- not acted on in this task)

The Product Owner has indicated the preferred instructional-visual background direction has changed: **drop the dark/slate background default and move to a white / very light background default.** This is recorded here as a direction note only -- no prompt, style guide, or catalogue field has been changed as part of this export task (out of scope: "Do NOT redesign prompts in this task"). The existing style guide (`docs/design/ALP-INSTRUCTIONAL-VISUAL-STYLE-GUIDE.md`) and prompt builders (`tools/visual-production-studio/prompt-builder.ts`, `tools/visual-production-studio/visual-proof/prompt-builder-gemini.ts`) still specify the dark slate/blue-grey background (`#151821` -> `#262B38`) and have NOT yet been updated to reflect this new direction -- a future package's job.
