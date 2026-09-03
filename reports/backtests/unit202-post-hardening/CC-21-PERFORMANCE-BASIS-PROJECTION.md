# CC-21 -- Mechanical Performance-Basis Projection

Derived exclusively from the already-frozen `layerB.normalizationConfidence` value recorded on each `CurriculumEvidence` entry in the accepted Unit-202 clean-room ledger. No subject text, command-verb text, AC number, model judgement, calibration material, or the current Unit-202 matrix was read.

## Rules

- `commandVerbPerformanceType` populated AND `normalizationConfidence === "EXPLICIT"` → `commandVerbPerformanceBasis: "SOURCE_EXPLICIT"`
- `commandVerbPerformanceType` populated AND `normalizationConfidence === "STRONG_INFERENCE"` → `commandVerbPerformanceBasis: "STRONG_INFERENCE"`
- anything else → left untouched (no field added)

## Counts

- CurriculumEvidence total: 139
- With populated commandVerbPerformanceType: 139
- Projected SOURCE_EXPLICIT: 53
- Projected STRONG_INFERENCE: 86
- Performance field absent (untouched): 0
- Left untouched for another reason (untouched): 0

## Mechanical proof

- FULL_PUBLIC projection verification: PASS -- only commandVerbPerformanceBasis was added
- DEGRADED_NO_ASSESSMENT projection verification: PASS -- only commandVerbPerformanceBasis was added
