# Unit 202 -- Final State-Level Completeness Matrix (CC-11.11)

Generated: 2026-08-25T23:38:27.850Z

## Summary

- Live canonical-state total: **98**
- Live ProductionAsset total: **53**
- GENERATED: 47
- DETERMINISTIC: 42
- REUSED_CANONICAL: 0
- SHARED_BASE_VALID: 8
- DEFERRED_SCOPE: 1
- UNRESOLVED: 0 (of which REQUIRED-need: 0)
- PASS: 55
- HUMAN_REVIEW_REQUIRED: 0
- RETRY (incomplete): 0
- Assessment states needing leakage review: 0

## Mixed series/parallel circuit (`unit202.family.circuit-mixed`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.circuit.mixed.state.series-of-parallel` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "circuit.series_parallel_mixed". |
| `unit202.circuit.mixed.state.parallel-of-series` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "circuit.series_parallel_mixed". |

## Parallel circuit (`unit202.family.circuit-parallel`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.circuit.parallel.state.2-branch` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "circuit.parallel_resistors". |
| `unit202.circuit.parallel.state.3-branch` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "circuit.parallel_resistors". |
| `unit202.circuit.parallel.state.4-branch` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "circuit.parallel_resistors". |

## Series circuit (`unit202.family.circuit-series`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.circuit.series.state.2-component` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "circuit.series_resistors". |
| `unit202.circuit.series.state.3-component` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "circuit.series_resistors". |
| `unit202.circuit.series.state.4-component` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "circuit.series_resistors". |

## Conductor vs insulator (`unit202.family.conductor-insulator`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.conductor-insulator.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 2. |

## Conventional current vs electron flow (`unit202.family.current-direction`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.current-direction.electron-flow-vs-conventional.state.teaching` | DETERMINISTIC | N/A_DETERMINISTIC | USEFUL | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.electron_flow_vs_conventional_current". CC-11.11: renderer newly add |

## Chemical effect / electrolysis (`unit202.family.electrolysis`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.electrolysis.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 3. |

## Electronic components — recognition (`unit202.family.electronic-components`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.components.symbols.state.resistor` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.component_symbol_card". |
| `unit202.components.symbols.state.capacitor` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.component_symbol_card". |
| `unit202.components.symbols.state.diode` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.component_symbol_card". |
| `unit202.components.symbols.state.zener-diode` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.component_symbol_card". |
| `unit202.components.symbols.state.led` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.component_symbol_card". |
| `unit202.components.symbols.state.photodiode` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.component_symbol_card". |
| `unit202.components.symbols.state.thermistor` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.component_symbol_card". |
| `unit202.components.symbols.state.diac` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.component_symbol_card". |
| `unit202.components.symbols.state.triac` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.component_symbol_card". |
| `unit202.components.symbols.state.transistor` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.component_symbol_card". |
| `unit202.components.symbols.state.thyristor-scr` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.component_symbol_card". |
| `unit202.components.symbols.state.rectifier` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.component_symbol_card". |
| `unit202.components.symbols.state.inverter` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.component_symbol_card". |
| `unit202.components.physical.resistor.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |
| `unit202.components.physical.capacitor.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 2. |
| `unit202.components.physical.diode.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |
| `unit202.components.physical.led.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |
| `unit202.components.physical.thermistor.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |
| `unit202.components.physical.transistor.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |
| `unit202.diode.bias-direction.forward.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 2. |
| `unit202.diode.bias-direction.reverse.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 4. |
| `unit202.rectification.waveforms.state.half-wave` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.rectification_waveform". CC-11.11: renderer newly added this package |
| `unit202.rectification.waveforms.state.full-wave` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.rectification_waveform". CC-11.11: renderer newly added this package |
| `unit202.rectification.waveforms.state.inverter` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.rectification_waveform". CC-11.11: renderer newly added this package |
| `unit202.capacitor.transient.state.charge` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.capacitor_transient_curve". CC-11.11: renderer newly added this pack |
| `unit202.capacitor.transient.state.discharge` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "electronics.capacitor_transient_curve". CC-11.11: renderer newly added this pack |
| `unit202.components.physical.zener-diode.state.teaching` | GENERATED | PASS | USEFUL | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |
| `unit202.components.physical.photodiode.state.teaching` | GENERATED | PASS | USEFUL | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |
| `unit202.components.physical.diac.state.teaching` | GENERATED | PASS | USEFUL | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |
| `unit202.components.physical.triac.state.teaching` | GENERATED | PASS | USEFUL | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |
| `unit202.components.physical.thyristor-scr.state.teaching` | GENERATED | PASS | USEFUL | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |

## Motional EMF geometry (`unit202.family.emf-motional`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.emf.motional.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 2. |

## Fleming's left-hand rule / motor effect (`unit202.family.fleming-left-hand-motor`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.motor.effect.horizontal-poles.state.into-page-teaching` | GENERATED | PASS | REQUIRED | N/A | State-specific final generated output (CC-11.10/CC-11.11), attempt 2. |
| `unit202.motor.effect.horizontal-poles.state.into-page-assessment` | GENERATED | PASS | REQUIRED | OK_NO_LEAKAGE | State-specific final generated output (CC-11.10/CC-11.11), attempt 2. |
| `unit202.motor.effect.horizontal-poles.state.out-of-page-teaching` | GENERATED | PASS | REQUIRED | N/A | State-specific final generated output (CC-11.10/CC-11.11), attempt 2. |
| `unit202.motor.effect.horizontal-poles.state.out-of-page-assessment` | GENERATED | PASS | REQUIRED | OK_NO_LEAKAGE | State-specific final generated output (CC-11.10/CC-11.11), attempt 2. |
| `unit202.motor.effect.vertical-poles.state.into-page-teaching` | GENERATED | PASS | REQUIRED | N/A | State-specific final generated output (CC-11.10/CC-11.11), attempt 2. |
| `unit202.motor.effect.vertical-poles.state.into-page-assessment` | GENERATED | PASS | REQUIRED | OK_NO_LEAKAGE | State-specific final generated output (CC-11.10/CC-11.11), attempt 2. |
| `unit202.motor.effect.vertical-poles.state.out-of-page-teaching` | GENERATED | PASS | REQUIRED | N/A | State-specific final generated output (CC-11.10/CC-11.11), attempt 2. |
| `unit202.motor.effect.vertical-poles.state.out-of-page-assessment` | GENERATED | PASS | REQUIRED | OK_NO_LEAKAGE | State-specific final generated output (CC-11.10/CC-11.11), attempt 3. |
| `unit202.fleming-left-hand.teaching.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |

## Fleming's right-hand rule / AC generator effect (`unit202.family.fleming-right-hand-generator`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.generator.rotating-loop.horizontal.state.near-zero-emf` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 2. |
| `unit202.generator.rotating-loop.vertical.state.near-peak-emf` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 3. |
| `unit202.fleming-right-hand.teaching.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |

## Driver/driven gears (`unit202.family.gears`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.gears.driven-larger.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |
| `unit202.gears.driven-smaller.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |
| `unit202.gears.equal.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |
| `unit202.gears.rotation-direction.state.direct-mesh-opposite-directions` | DETERMINISTIC | N/A_DETERMINISTIC | USEFUL | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "mechanical.gear_mesh". |
| `unit202.gears.rotation-direction.state.idler-preserves-driver-direction` | DETERMINISTIC | N/A_DETERMINISTIC | USEFUL | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "mechanical.gear_mesh". |

## Heating effect of electric current (`unit202.family.heating-effect`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.heating-effect.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |

## Instrument connections (`unit202.family.instrument-connections`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.instrument.connections.state.voltmeter-parallel` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "instrument.measurement_connection". |
| `unit202.instrument.connections.state.voltmeter-series` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "instrument.measurement_connection". |
| `unit202.instrument.connections.state.ammeter-series` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "instrument.measurement_connection". |
| `unit202.instrument.connections.state.ammeter-parallel` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "instrument.measurement_connection". |
| `unit202.instrument.connections.state.ohmmeter-isolated` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "instrument.measurement_connection". |
| `unit202.instrument.clamp-meter.state.teaching` | GENERATED | PASS | USEFUL | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |
| `unit202.instrument.oscilloscope.state.teaching` | GENERATED | PASS | USEFUL | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |

## Lever classes (`unit202.family.levers`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.levers.class-1.state.recognition` | SHARED_BASE_VALID | PASS | REQUIRED | N/A | Governed SAFE_SHARED_BASE (CC-11.7B: 'recognition' and 'moment-balance' states depict the identical physical lever rig (same fulcrum/effort/load positions) -- the only difference is whether determinis |
| `unit202.levers.class-1.state.moment-balance` | SHARED_BASE_VALID | PASS | REQUIRED | N/A | Governed SAFE_SHARED_BASE (CC-11.7B: 'recognition' and 'moment-balance' states depict the identical physical lever rig (same fulcrum/effort/load positions) -- the only difference is whether determinis |
| `unit202.levers.class-2.state.recognition` | SHARED_BASE_VALID | PASS | REQUIRED | N/A | Governed SAFE_SHARED_BASE (CC-11.7B: 'recognition' and 'moment-balance' states depict the identical physical lever rig (same fulcrum/effort/load positions) -- the only difference is whether determinis |
| `unit202.levers.class-2.state.moment-balance` | SHARED_BASE_VALID | PASS | REQUIRED | N/A | Governed SAFE_SHARED_BASE (CC-11.7B: 'recognition' and 'moment-balance' states depict the identical physical lever rig (same fulcrum/effort/load positions) -- the only difference is whether determinis |
| `unit202.levers.class-3.state.recognition` | SHARED_BASE_VALID | PASS | REQUIRED | N/A | Governed SAFE_SHARED_BASE (CC-11.7B: 'recognition' and 'moment-balance' states depict the identical physical lever rig (same fulcrum/effort/load positions) -- the only difference is whether determinis |
| `unit202.levers.class-3.state.moment-balance` | SHARED_BASE_VALID | PASS | REQUIRED | N/A | Governed SAFE_SHARED_BASE (CC-11.7B: 'recognition' and 'moment-balance' states depict the identical physical lever rig (same fulcrum/effort/load positions) -- the only difference is whether determinis |

## Magnetism — field and pole interaction (`unit202.family.magnetism`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.magnet.field.state.field-only` | SHARED_BASE_VALID | PASS | REQUIRED | N/A | Governed SAFE_SHARED_BASE (CC-11.7B: the density-comparison state adds a deterministic comparison callout to the same bar magnet + field-line composition -- the magnet's position and field-line geomet |
| `unit202.magnet.field.state.density-comparison` | SHARED_BASE_VALID | PASS | REQUIRED | N/A | Governed SAFE_SHARED_BASE (CC-11.7B: the density-comparison state adds a deterministic comparison callout to the same bar magnet + field-line composition -- the magnet's position and field-line geomet |
| `unit202.magnet.poles.like.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork (the other canonicalState resolves via a separate deterministic diagram, see that state' |
| `unit202.magnet.poles.like.state.assessment` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | OK_NO_LEAKAGE | Per this asset's own governed prohibitedChanges: the premium TEACHING image is never reused/withheld for assessment -- the assessment reveal/withhold state is governed entirely by the separate determi |
| `unit202.magnet.poles.unlike.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork (the other canonicalState resolves via a separate deterministic diagram, see that state' |
| `unit202.magnet.poles.unlike.state.assessment` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | OK_NO_LEAKAGE | Per this asset's own governed prohibitedChanges: the premium TEACHING image is never reused/withheld for assessment -- the assessment reveal/withhold state is governed entirely by the separate determi |
| `unit202.magnet.permanent-vs-electromagnet.state.teaching` | GENERATED | PASS | USEFUL | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 2. |

## Fuse vs circuit breaker comparison (`unit202.family.protective-devices`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.protective-devices.state.fuse-vs-breaker` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 2. |

## Pulleys (`unit202.family.pulleys`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.pulleys.fixed.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |
| `unit202.pulleys.movable.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 1. |

## Resistance vs conductor dimensions (`unit202.family.resistivity`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.resistivity.length-comparison.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 2. |
| `unit202.resistivity.area-comparison.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 2. |

## Right-hand grip rule / field around a conductor (`unit202.family.right-hand-grip`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.current-conductor.magnetic-field.state.into-page-teaching` | GENERATED | PASS | REQUIRED | N/A | State-specific final generated output (CC-11.10/CC-11.11), attempt 2. |
| `unit202.current-conductor.magnetic-field.state.into-page-assessment` | GENERATED | PASS | REQUIRED | OK_NO_LEAKAGE | State-specific final generated output (CC-11.10/CC-11.11), attempt 1. |
| `unit202.current-conductor.magnetic-field.state.out-of-page-teaching` | GENERATED | PASS | REQUIRED | N/A | State-specific final generated output (CC-11.10/CC-11.11), attempt 1. |
| `unit202.current-conductor.magnetic-field.state.out-of-page-assessment` | GENERATED | PASS | REQUIRED | OK_NO_LEAKAGE | State-specific final generated output (CC-11.10/CC-11.11), attempt 1. |
| `unit202.right-hand-grip.teaching.state.teaching` | GENERATED | PASS | REQUIRED | N/A | The asset's own base generated image fully represents this, its only state actually requiring generated artwork, attempt 2. |

## Right-angle triangle / SOHCAHTOA (`unit202.family.trigonometry`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.trigonometry.state.teaching` | DEFERRED_SCOPE | N/A_DEFERRED | DEFERRED_SCOPE | N/A | Governed DEFERRED_SCOPE: no lesson exists yet to host this asset (tracked for future commissioning only per catalogue.ts visualNeedClassificationFor). |

## AC sine waveform (`unit202.family.waveform-sine`)

| stateId | resolutionType | approvalStatus | needClassification | assessmentLeakage | notes |
|---|---|---|---|---|---|
| `unit202.waveform.sine.state.progression-1` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "graph.waveform_sine". |
| `unit202.waveform.sine.state.progression-2` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "graph.waveform_sine". |
| `unit202.waveform.sine.state.progression-3` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "graph.waveform_sine". |
| `unit202.waveform.sine.state.progression-4` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "graph.waveform_sine". |
| `unit202.waveform.sine.state.progression-5` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "graph.waveform_sine". |
| `unit202.waveform.sine.state.progression-6` | DETERMINISTIC | N/A_DETERMINISTIC | REQUIRED | N/A | Deterministic vector renderer registered in apps/mobile/src/components/diagrams/DiagramRenderer.tsx under blueprint id "graph.waveform_sine". |
