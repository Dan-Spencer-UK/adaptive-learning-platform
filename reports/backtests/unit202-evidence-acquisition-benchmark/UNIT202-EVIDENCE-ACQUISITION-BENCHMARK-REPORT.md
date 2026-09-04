# Unit 202 Evidence Acquisition Benchmark Freeze (CC-22B)

Parent HEAD: `48b1a98` (fix: correct Unit 202 evidence reconciliation).

This package freezes (A) the actual Project-Architect-approved Unit-202 knowledge target, and (B) a historical evidence benchmark hidden from the future blind acquisition process until after it runs.

## PA proposition counts

- REQUIRED_QUALIFICATION_KNOWLEDGE: 168
- FOUNDATIONAL_PREREQUISITE: 3
- OUT_OF_SCOPE: 17
- CONTEXTUAL_TEACHING_SUPPORT: 15

## Acquisition target counts

- Total acquisition targets (REQUIRED + OPTIONAL_CONTEXT): 186
- REQUIRED: 171
- OPTIONAL_CONTEXT: 15
- Representative-exemplar targets: 3

## Benchmark denominators (REQUIRED targets only, no scoring)

- Historically VERIFIED: 101
- Historically CONDITIONAL: 10
- Historically SOURCE_GAP: 6
- No historical benchmark at all: 54

## Targets by AC

- AC1.1: 16
- AC2.1: 9
- AC2.2: 11
- AC2.3: 7
- AC3.1: 5
- AC3.2: 11
- AC3.3: 11
- AC3.4: 3
- AC4.1: 3
- AC4.2: 2
- AC4.3: 5
- AC4.4: 8
- AC4.6: 4
- AC4.7: 3
- AC4.8: 3
- AC5.1: 2
- AC5.2: 3
- AC5.3: 15
- AC5.4: 13
- AC5.5: 12
- AC6.1: 23
- AC6.2: 17

## Files frozen

- `UNIT202-BLIND-ACQUISITION-TARGETS.json` (sha256 3052aede77b472247fbdf7a9e04d62adb2e98bba3a2896dacd610267e4a754b4)
- `UNIT202-HISTORICAL-ACQUISITION-BENCHMARK.json` (sealed, sha256 9ab74638cee663caafdc1f3ef9af7a4b31790c5dd42ec38ba1d5b72c7ed07b80)
- `UNIT202-BLIND-ACQUISITION-DENYLIST.json` (sha256 cd547a67d0dc24a4d26973af6cddd6425f4fb51e12a95cbb82f1c1448e5d8465)
- `UNIT202-PA-PROPOSITION-LEDGER.json` (sha256 f809779858e946401a7fac3cd0651f826dadacd8482964de49f606c23020fda6)

Project-Architect decisions remaining: **0** (expected 0).

STOP. No acquisition performed. The next package inspects/builds the generic technical-evidence acquisition workflow and executes a mechanically isolated blind Unit-202 acquisition replay using ONLY `UNIT202-BLIND-ACQUISITION-TARGETS.json`.
