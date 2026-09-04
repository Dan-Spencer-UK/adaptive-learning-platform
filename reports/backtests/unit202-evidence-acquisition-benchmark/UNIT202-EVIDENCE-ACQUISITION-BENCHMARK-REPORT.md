# Unit 202 Evidence Acquisition Benchmark Freeze (CC-22C)

Parent HEAD: `8fa98b0` (audit: freeze Unit 202 acquisition benchmark).

This package hardens the CC-22B benchmark: the historical answer key is now derived exclusively from explicit, auditable bindings (historical-benchmark-bindings.ts) -- no fuzzy/token matching, no manual state overrides -- and a positive, default-deny local-input allowlist is frozen for the future blind acquisition runner.

**Blind target manifest hash unchanged (task section 15):** `3052aede77b472247fbdf7a9e04d62adb2e98bba3a2896dacd610267e4a754b4` -- matches the CC-22B-frozen hash exactly. Not regenerated, not reordered, not modified.

## PA proposition counts (unchanged from CC-22B -- pa-target.ts was not touched)

- REQUIRED_QUALIFICATION_KNOWLEDGE: 168
- FOUNDATIONAL_PREREQUISITE: 3
- OUT_OF_SCOPE: 17
- CONTEXTUAL_TEACHING_SUPPORT: 15

## Acquisition target counts

- Total acquisition targets (REQUIRED + OPTIONAL_CONTEXT): 186
- REQUIRED: 171
- OPTIONAL_CONTEXT: 15
- Representative-exemplar targets: 3

## Historical benchmark counts -- explicit bindings only (task section 9: no expected count)

**Previous (CC-22B heuristic, SUPERSEDED):** VERIFIED=101, CONDITIONAL=10, SOURCE_GAP=6, NONE=54 (fuzzy/token matcher + manual overrides -- both removed).

**Final (CC-22C explicit bindings, 143 bindings):**

- Historically VERIFIED: 118
- Historically CONDITIONAL: 17
- Historically SOURCE_GAP: 8
- No historical benchmark at all: 28

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

- `UNIT202-BLIND-ACQUISITION-TARGETS.json` (sha256 3052aede77b472247fbdf7a9e04d62adb2e98bba3a2896dacd610267e4a754b4, UNCHANGED from CC-22B)
- `UNIT202-HISTORICAL-ACQUISITION-BENCHMARK.json` (sealed, sha256 5581b126ae48cefce6745ad404034d8a1b50cdab06c885a642a9ac2987e11a28)
- `UNIT202-BLIND-ACQUISITION-ALLOWLIST.json` (authoritative, sha256 9672c5f47168b3e1eaed63b96ff5bb4c30cb92e9feb16aa76aa37d8d77e0d822)
- `UNIT202-BLIND-ACQUISITION-DENYLIST.json` (defence in depth only, sha256 750c70d99c73eea9c1524ee23709c1981a84bd57b8cc4b9365a6d9a722b6ffc0)
- `UNIT202-PA-PROPOSITION-LEDGER.json` (sha256 30ace35f9fd9f30c32d6c57e38d821d005a5c037b51ba1a8658bc510b0bc9479)
- `historical-benchmark-bindings.ts` (sha256 a4e513c98ba43164e6cf272657c03f22697cb55453ca509fd465c324d5c6946e)

Project-Architect decisions remaining: **0** (expected 0).

STOP. No acquisition performed. The next package inspects/builds the generic technical-evidence acquisition workflow and executes a mechanically isolated blind Unit-202 acquisition replay using ONLY `UNIT202-BLIND-ACQUISITION-TARGETS.json`, governed by `UNIT202-BLIND-ACQUISITION-ALLOWLIST.json`.
