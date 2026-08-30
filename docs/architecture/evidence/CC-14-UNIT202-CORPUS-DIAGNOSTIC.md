# CC-14 — Existing Unit 202 Corpus vs. Depth & Performance Matrix: Diagnostic Report

**Status:** diagnostic only. **Approves nothing for production reuse.** Performed read-only by an independent fresh subagent with no context on the matrix-encoding work; the existing corpus was not modified — confirmed by `git status`/`git diff --stat` before and after (byte-identical). This report is input for a future, separately-reviewed source-acquisition/content package; per this task's own governance, the existing corpus has zero design or sourcing authority over the new matrix, and nothing here counts as authoritative-source verification.

## Actual corpus counts (recomputed, not assumed)

From `scripts/content/data/cc04-unit202-electrical-science.ts` (6,015 lines): **EL 189, FP 44, FM 27**, total **260** assertions; **22** misconceptions (`MIS-*`). The task brief's carried-forward figures (~259 total, 26 FM) were off by one on FM/total — corrected here. `cc05a-pedagogy-unit202.ts` (4,857 lines) references 16 of the 22 misconception IDs directly.

## The 8 explicitly flagged review topics — what the existing corpus currently does

| Topic (matrix AC) | Existing corpus finding |
|---|---|
| Temperature: Celsius vs. Kelvin (AC2.1) | Correct: `FP-UNIT-KELVIN-CELSIUS-001` states kelvin is the SI base unit and Celsius a related practical scale (t = T − 273.15). No conflicting Celsius-as-SI claim found. |
| Resistivity units (AC4.3) | Correct: `EL-UNIT-OHM-METRE-001` states the ohm-metre (Ω·m) is the SI derived unit of resistivity. No erroneous unit form found. |
| AC2.2 impedance/reactance/power-factor depth | **Worth attention.** The corpus header explicitly disclaims full AC calculation, but `EL-REL-IMPEDANCE-001` (full Z=√(R²+X²) formula) and a "select the correct impedance formula among distractors" capability already exist, with no active lesson built on them yet. This sits closer to the matrix's explicit AC2.2 anti-overdepth guard (recognition/distinction only) than is ideal, though it stops short of full worked numeric calculation. |
| Gears: torque/speed/power (AC3.2) | Already correct, and self-documenting: a code comment records that the official SmartScreen handout's "twice as much power at the driven cog" claim is wrong, and states the corpus was deliberately not contaminated by it — `FP-GEAR-SPEED-TORQUE-TRADEOFF-001` asserts power is conserved (P=τω constant), only torque/speed trade off. |
| AC5.4 alternator frequency (f=N×P) | **Gap, not a wrong-convention issue.** No "alternator," "pole pair," or f=N×P content found anywhere in assertions, lessons, or pedagogy — this AC's content is currently entirely absent from the corpus. |
| "Photo" component: photodiode vs. LDR (AC6.2) | **Gap matching the matrix's own flagged ambiguity.** Only photodiode is taught (`EL-COMPONENT-PHOTODIODE-001`); no light-dependent-resistor (LDR) content exists anywhere. `unit202-knowledge-obligations.ts` records the "photo" Range obligation as satisfied by the photodiode assertion alone. |
| Telephone systems (AC6.1) | Present and substantial (diode-bridge-in-telephone-equipment assertion; a detailed UK master-telephone-socket assertion sourced from a Wikipedia article on British telephone sockets) — legacy BT analogue landline wiring, consistent with the matrix's currency-review flag. |
| Sine-wave average value (AC5.5) | Already correct: `EL-WAVEFORM-AVERAGE-VALUE-001` and `EL-WAVEFORM-AVERAGE-ZERO-INTERPRETATION-001` distinguish the conventional (non-zero, one-alternation) average from the full-cycle signed average of zero. No explicit 0.636 constant found stated, but the conceptual distinction required by the matrix is present. |

## Reuse-candidate classification (qualitative)

Roughly two-thirds of the corpus's ~24 active lessons (LO1 units/quantities, LO2 core electrical quantities/Ohm's law/resistivity/resistors, LO4 fault protection, LO5 magnetism/AC generation/sine-wave, LO3 mechanics basics) look like plausible reuse candidates on this diagnostic pass — internally consistent, several with above-average correctness diligence already documented in-repo (the gears and sine-wave-average topics above). LO6 electronic components (AC6.1/6.2) are mixed: solid on diode-family recognition and switching-control components, but missing LDR entirely and dated on telephony. Four lesson files are explicitly named and treated as historical/superseded snapshots (`lesson-cc11-3-historical-snapshot.ts`, `lesson-cc12-v7-historical-snapshot.ts`, `lesson-conductors-and-insulators-v3-v5-historical-snapshot.ts`, `lesson-lo5-v4-historical-snapshot.ts`) and are not current. The clearest "needs rework or missing entirely" areas are full AC-circuit numeric calculation (impedance/reactance/power-factor arithmetic, which the matrix explicitly excludes from AC2.2's depth) and AC5.4's alternator-frequency content (currently absent).

## What this diagnostic does not do

It does not judge whether any existing assertion is factually correct against an authoritative external source (that is the next package's job, per the matrix's own evidence hierarchy — C&G teaching material and existing ALP corpus content are never treated as factual authority). It does not approve, promote, or mark any cluster in the Source-Acquisition Manifest as `SOURCED`. It does not change, re-extract, or re-author any assertion, capability, lesson, or pedagogy content.
