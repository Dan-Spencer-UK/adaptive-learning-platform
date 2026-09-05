# CC-24 Pilot-002 — Product Architect Review

**Reviewed run:** `pilot-002` (`reports/backtests/unit202-blind-acquisition-run/pilot-002/`, unchanged by this review)
**Correction artifacts:** `reports/backtests/unit202-blind-acquisition-run/pilot-002-review/`
**Machine-readable companion:** `CC-24-PILOT-002-PA-REVIEW.json`

## Erratum (applies to commit `58fe62a`)

Commit `58fe62a` remains in history and the pilot phase remains closed. Four audit-description corrections are recorded here, applied to this review and its correction artifacts **without rerunning the pilot review**:

1. **Timestamps were not contemporaneous.** `PILOT-002-REPAIR-RETRIEVAL-LOG.json`'s per-event timestamps were reconstructed after the repair research was performed — a one-off assembly script first hardcoded a placeholder date, then substituted an approximate "realistic window" of times after checking the actual clock, and those substituted times were written into the file as though they were observed event times. They were not. Every entry's `timestamp` is now `null`; the file now carries `auditStatus: "RECONSTRUCTED_NOT_CONTEMPORANEOUS"` and `eventTimestampStatus: "NOT_CAPTURED"`. Query order, candidates, source decisions, and locators were reconstructed from the session transcript and remain accurate to it; event timing was not captured.
2. **The QMUL retrieval record was mischaracterised.** The session transcript shows the Queen Mary University of London PDF was reported by the retrieval tool as fetched, but no substantive passage was ever inspected or captured from it. An earlier version of this review incorrectly called this an HTTP 500 server error. Corrected in every artifact that repeated it (this file, the JSON companion, both repair logs, and the reviewed-results file) to state it was rejected as unevaluated/insufficient.
3. **Requirement 3's source binding over-attributed content to BIPM's base-unit page.** That page supports only "The kelvin, symbol K, is the SI unit of thermodynamic temperature." — it does not state that Celsius has an arbitrary zero point. The first normalized claim is now trimmed to the supported sentence; the Celsius relationship is now bound solely to the BIPM SI Brochure Appendix 2 source. Requirement 3 remains VERIFIED.
4. **Requirement 8's SOURCE_GAP wording overclaimed.** Now stated precisely as "unresolved within the candidates evaluated during pilot-002 and its repair" — not a claim that no suitable public source exists.

No further Fleming's-rule research was performed as part of this erratum; requirements 7 and 8 return during the electromagnetism production batch.

**Pilot disposition after this erratum:** pilot-001 remains invalid; pilot-002 remains structurally useful; pilot-002's evidence output is usable subject to this PA overlay; pilot-002 is not a clean benchmark of contemporaneous acquisition logging; the pilot phase remains closed; no further pilot is authorised.

## Verdict

Pilot-002 is structurally useful and demonstrates that the acquisition approach can produce usable evidence, but its reported **13 VERIFIED / 2 SOURCE_GAP** result is not accepted unchanged. This review corrects one accepted requirement's normalization, repairs three requirements' evidence (upgrading two SOURCE_GAP results and completing one under-supported VERIFIED result), and confirms one requirement's SOURCE_GAP after a fresh, capped search.

## Why the original aggregate was not accepted unchanged

1. **Requirement 5** (weight/mass) — the normalized claim implied `w = mg` applies only when weight is the net external force, confusing the general definition of weight with a special-case condition (e.g. free fall). This is a defect in the *normalization*, not in the underlying source.
2. **Requirement 3** (kelvin/Celsius) — the claim named the distinction from Celsius only qualitatively. A claim covering the kelvin/Celsius relationship needs the actual quantitative relationship, which pilot-002 did not acquire.
3. **Requirement 13** (wireless control systems) — sourced only to one manufacturer (Somfy); insufficient on its own for a category-wide claim, and the requirement's own depth ceiling explicitly excludes generalising from one manufacturer's product.
4. **Requirement 15** (telephone capacitor→ringer) — the sole source (Bell System Practices) documents that a ringer and capacitor are co-located, but never states *why* — it does not establish the capacitor's causal signalling role.
5. **Requirements 7 and 8** (Fleming's hand rules) — left as full SOURCE_GAP without the leads now supplied by the Project Architect having been tried.

## The ten accepted/usable requirements

Carried over from pilot-002 **unchanged** (no new research, no wording change) — full detail remains in the sealed `pilot-002/PILOT-RESULTS.json`:

| # | Requirement | Status |
|---|---|---|
| 1 | Fractions (topic breadth) | VERIFIED |
| 2 | Formula transposition | VERIFIED |
| 4 | V = IR (Ohm's law) | VERIFIED |
| 6 | Right-hand grip rule | VERIFIED |
| 9 | f = N × P (rotational frequency / pole pairs) | VERIFIED |
| 10 | Vrms ≈ 0.707 × Vpeak | VERIFIED |
| 11 | Capacitor operating principle | VERIFIED |
| 12 | TRIAC basic operation | VERIFIED |
| 14 | Wattmeter operation | VERIFIED |

**Requirement 5** (mass and weight) is also accepted, **subject to the correction below**.

## Correction to requirement 5

**Defect:** the claim read as if `w = mg` were conditional on weight being the net external force on the object — a free-fall-like special case, not the general definition of weight.

**Correction (same source, same passage, no new research):**

> Weight is the gravitational force acting on an object. Its magnitude is `w = mg`, where `m` is mass and `g` is the local gravitational acceleration. On Earth `g = 9.80 m/s²`, so a 1.00 kg mass has a weight of 9.80 N. Mass remains constant when location changes, while weight changes if `g` changes.

Source: OpenStax University Physics Vol. 1, §5.5 "Mass and Weight", Eq. 5.9 (unchanged locator/passage). **Status: VERIFIED.**

## The five targeted repairs

### Requirement 3 — kelvin / Celsius distinction
- **Prior:** VERIFIED, but incomplete for any claim including the Celsius relationship, and (per the erratum above) its first claim over-attributed the Celsius "arbitrary zero point" gloss to the BIPM base-unit page, which does not state it.
- **Repair:** 2 candidates opened. BIPM's "Thermodynamic temperature" annex page was opened and rejected (loaded, but the retrieved excerpt didn't contain the relationship). BIPM's own **SI Brochure, 9th edition, Appendix 2** ("Mise en pratique for the definition of the kelvin") was accepted: *"It remains common practice to call the difference T − 273.15 K Celsius temperature, symbol t. The unit of Celsius temperature is the degree Celsius, symbol °C, which is by definition equal in magnitude to the kelvin."*
- **Final: VERIFIED.** First claim (BIPM base-unit page) now trimmed to exactly: *"The kelvin, symbol K, is the SI unit of thermodynamic temperature."* Second claim (BIPM SI Brochure Appendix 2, sole binding for the Celsius relationship): *"The degree Celsius is equal in magnitude to the kelvin, and Celsius temperature t and thermodynamic temperature T are related by t = T − 273.15."*

### Requirement 7 — Fleming's left-hand rule
- **Prior:** SOURCE_GAP.
- **Repair:** 4 candidates opened. The Project Architect's **University of Oxford** lead (`web.chem.ox.ac.uk`) was accepted: *"the thumb represents force, the index finger the field and the middle finger the current."* Three further candidates were rejected: Newcastle University's "hand" page (off-topic — anatomy), University of Surrey's coil-force page (TLS certificate expired), Exeter Mathematics School (HTTP 404).
- **Final: PARTIALLY_VERIFIED** — `DIRECTIONAL_MAPPING` and `ROLE_MAPPING` satisfied; `CORRECT_USE_CONDITIONS` (mutually perpendicular fingers, explicit conductor/motor framing) remains unresolved after the cap.

### Requirement 8 — Fleming's right-hand (generator) rule
- **Prior:** SOURCE_GAP.
- **Repair:** 4 fresh candidates opened: University of Leicester (HTTP 403, as in pilot-002), a Welsh Government engineering resource (domain no longer resolves), a Queen Mary University of London handout (reported fetched, but no substantive passage was inspected or captured — rejected as unevaluated/insufficient, corrected from an earlier, inaccurate "HTTP 500" description), and PASCO's "Right Hand Rule" article (states a structurally related but differently-framed rule for the force on a moving positive charge — not explicitly named as the generator rule, no explicit "current", no generator condition).
- **Final: SOURCE_GAP, unchanged** — precisely, *unresolved within the candidates evaluated during pilot-002 and its repair*, not a claim that no suitable public source exists. Accepting PASCO's related-but-different rule would require an inference beyond what it states; declined per the instruction not to weaken the requirement to obtain VERIFIED status.

### Requirement 13 — wireless control systems
- **Prior:** VERIFIED, but sourced only to Somfy (one manufacturer).
- **Repair:** 1 candidate opened and accepted: **Edison Tech Center**, a nonprofit engineering-education organisation — *"Remote control systems consist of the input, computer for transfer into electrical signal, transmission, receiver and computer for translating signals,"* with signals travelling "through either infrared light ..., visible light, radio waves, wires, fiber optics, or by soundwaves."
- **Final: VERIFIED** — category-level claim now bound to Edison Tech Center; the original Somfy claim is kept, explicitly labelled a representative example rather than the category definition.

### Requirement 15 — telephone capacitor → ringer
- **Prior:** VERIFIED, but the source only established component co-location, not the causal role.
- **Repair:** 1 candidate opened and accepted: the Project Architect's **Andrews & Arnold (aa.net.uk)** lead — *"In order to separate the ringing current from the rest of the telephone, a bell capacitor is used to route the ringing current to the bell."*
- **Final: VERIFIED** — the causal function (routing/separating the AC ringing signal to the bell) is now bound to this source, alongside the kept Bell System Practices component-pairing claim. Both sources are cited only for the general principle each individually states (the two describe different national wiring traditions — US internal subscriber-set wiring vs UK external bell-wire wiring — and are not merged into one claimed circuit topology).

## Final disposition of all 15 requirements

| # | Requirement | Final status | Changed this review? |
|---|---|---|---|
| 1 | Fractions | VERIFIED | No |
| 2 | Formula transposition | VERIFIED | No |
| 3 | Kelvin / Celsius | VERIFIED | **Yes** |
| 4 | V = IR | VERIFIED | No |
| 5 | Weight / mass | VERIFIED | **Yes (correction)** |
| 6 | Right-hand grip rule | VERIFIED | No |
| 7 | Fleming's left-hand rule | **PARTIALLY_VERIFIED** | **Yes** |
| 8 | Fleming's right-hand rule | **SOURCE_GAP** | No (repair attempted, unchanged) |
| 9 | f = N × P | VERIFIED | No |
| 10 | Vrms ≈ 0.707×Vpeak | VERIFIED | No |
| 11 | Capacitor operating principle | VERIFIED | No |
| 12 | TRIAC basic operation | VERIFIED | No |
| 13 | Wireless control systems | VERIFIED | **Yes** |
| 14 | Wattmeter operation | VERIFIED | No |
| 15 | Telephone capacitor→ringer | VERIFIED | **Yes** |

**Totals: 13 VERIFIED · 1 PARTIALLY_VERIFIED · 1 SOURCE_GAP · 0 CONFLICTED**

## Remaining gaps

- **Requirement 8** (Fleming's right-hand rule): SOURCE_GAP, precisely *unresolved within the candidates evaluated during pilot-002 and its repair* (8 total candidates: 4 in pilot-002 + 4 in this repair) — none stated the rule's mapping precisely enough to cite without inference. This is not evidence that no suitable public source exists.
- **Requirement 7** (Fleming's left-hand rule): PARTIALLY_VERIFIED. The finger mapping is sourced (Oxford); the perpendicularity/correct-use condition is not.

## Explicit scope statement

This review does not treat pilot-002 or this repair as production-complete evidence for Unit 202. The 15 reviewed requirements remain a stratified sample of the 213 Unit 202 evidence requirements, not the complete source set. Source count is not equivalent to evidence-requirement count. No new pilot was created; no other Unit 202 requirement was researched; no learner-facing content, lesson, assertion, or storyboard was generated.

## Next action

Acquire the remaining Unit 202 evidence requirements in manageable, production-sized batches; on completion, generate and review the complete Unit 202 learning-point list.
