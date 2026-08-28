/**
 * CC-11: the shared governed diagram registry (task brief §7 -- "Fix this
 * GENERICALLY... prefer something conceptually like: DiagramBlueprint ->
 * runtime diagram payload -> shared DiagramRenderer -> appropriate native
 * SVG/component"). This is the ONE place that maps a governed
 * `DiagramBlueprint.id` to its native renderer, used by both the Lesson
 * Player (`LessonStepView.tsx`) and any future practice/assessment
 * surface -- no second per-screen switch statement.
 *
 * Every diagram blueprint actually used by any lesson/question must be
 * registered here; `scripts/content/validate-diagram-renderer-coverage.ts`
 * mechanically proves the registry has an entry for every
 * `diagramBlueprintId` referenced anywhere in the governed corpus
 * (task brief §8: "unsupported blueprint IDs must fail loudly rather than
 * silently disappear"). `resolveDiagramComponent` throws for an
 * unregistered id rather than silently rendering nothing -- by the time
 * code ships, the mechanical gate guarantees this throw is unreachable in
 * production; it exists so a regression is a loud CI/test failure, never a
 * silently missing diagram a learner just never sees.
 */
import type { DiagramInstance } from "@alp/calculation-engine";
import type { DiagramBlueprint } from "@alp/content-schema";
import { Image, StyleSheet, View, type ImageSourcePropType } from "react-native";

import { color, radius, spacing } from "@/lib/tokens";
import { ACGeneratorDiagram } from "./ACGeneratorDiagram";
import { CapacitorTransientDiagram } from "./CapacitorTransientDiagram";
import { ComponentSymbolCard } from "./ComponentSymbolCard";
import { ElectronFlowVsConventionalDiagram } from "./ElectronFlowVsConventionalDiagram";
import { GearDiagram } from "./GearDiagram";
import { InstrumentConnectionDiagram } from "./InstrumentConnectionDiagram";
import { LeverDiagram } from "./LeverDiagram";
import { MagneticFluxDiagram } from "./MagneticFluxDiagram";
import { MagneticForceDiagram } from "./MagneticForceDiagram";
import { MagneticPoleDiagram } from "./MagneticPoleDiagram";
import { MotionalEmfDiagram } from "./MotionalEmfDiagram";
import { ParallelCircuitDiagram } from "./ParallelCircuitDiagram";
import { PulleyDiagram } from "./PulleyDiagram";
import { RectificationWaveformDiagram } from "./RectificationWaveformDiagram";
import { ResistivityDimensionsDiagram } from "./ResistivityDimensionsDiagram";
import { RightHandGripRuleDiagram } from "./RightHandGripRuleDiagram";
import { SeriesCircuitDiagram } from "./SeriesCircuitDiagram";
import { SeriesParallelMixedCircuitDiagram } from "./SeriesParallelMixedCircuitDiagram";
import { WaveformSineDiagram } from "./WaveformSineDiagram";

/**
 * The two magnetism diagrams accept an optional, separately-supplied
 * "reveal" value (the assessed answer -- field-curl direction / force
 * direction) that this registry never derives itself (CC-05C's original
 * design principle, preserved here: see MagneticForceDiagram.tsx's header
 * comment). `revealProps` is deliberately a loosely-typed bag rather than
 * a per-blueprint union: the registry's job is dispatch, not encoding
 * every diagram's bespoke prop shape. Callers that need a specific
 * reveal-capable diagram at a specific moment (this repository's own
 * `LessonStepView.tsx`, matching text-answer reveal timing) pass the
 * matching key explicitly.
 */
export interface DiagramRevealProps {
  readonly fieldRotation?: "clockwise" | "counterclockwise";
  readonly forceDirection?: "up" | "down" | "left" | "right";
  /** CC-11.3: whether MagneticPoleDiagram's force arrows (the assessed attract/repel answer) are shown. */
  readonly showPoleForce?: boolean;
}

interface DiagramComponentProps {
  readonly diagram: DiagramInstance;
  readonly testID?: string;
  readonly reveal?: DiagramRevealProps;
}

type DiagramComponent = (props: DiagramComponentProps) => React.JSX.Element;

const REGISTRY: Readonly<Record<string, DiagramComponent>> = {
  "circuit.series_resistors": ({ diagram, testID }) => <SeriesCircuitDiagram diagram={diagram} testID={testID} />,
  "circuit.parallel_resistors": ({ diagram, testID }) => <ParallelCircuitDiagram diagram={diagram} testID={testID} />,
  "circuit.series_parallel_mixed": ({ diagram, testID }) => <SeriesParallelMixedCircuitDiagram diagram={diagram} testID={testID} />,
  "magnetic.field_conductor_direction": ({ diagram, testID, reveal }) => (
    <RightHandGripRuleDiagram diagram={diagram} fieldRotation={reveal?.fieldRotation} testID={testID} />
  ),
  "motor.force_field_current": ({ diagram, testID, reveal }) => (
    <MagneticForceDiagram diagram={diagram} forceDirection={reveal?.forceDirection} testID={testID} />
  ),
  "graph.waveform_sine": ({ diagram, testID }) => <WaveformSineDiagram diagram={diagram} testID={testID} />,
  "instrument.measurement_connection": ({ diagram, testID }) => <InstrumentConnectionDiagram diagram={diagram} testID={testID} />,
  // CC-11.3: whole-course instructional visual coverage closeout.
  "mechanical.lever_arrangement": ({ diagram, testID }) => <LeverDiagram diagram={diagram} testID={testID} />,
  "mechanical.gear_mesh": ({ diagram, testID }) => <GearDiagram diagram={diagram} testID={testID} />,
  "mechanical.pulley_arrangement": ({ diagram, testID }) => <PulleyDiagram diagram={diagram} testID={testID} />,
  "mechanical.resistivity_dimensions": ({ diagram, testID }) => <ResistivityDimensionsDiagram diagram={diagram} testID={testID} />,
  "magnetic.pole_interaction": ({ diagram, testID, reveal }) => (
    <MagneticPoleDiagram diagram={diagram} showForceArrows={reveal?.showPoleForce} testID={testID} />
  ),
  "magnetic.flux_field_lines": ({ diagram, testID }) => <MagneticFluxDiagram diagram={diagram} testID={testID} />,
  "emf.motional_emf_geometry": ({ diagram, testID }) => <MotionalEmfDiagram diagram={diagram} testID={testID} />,
  "generator.rotating_loop": ({ diagram, testID }) => <ACGeneratorDiagram diagram={diagram} testID={testID} />,
  "electronics.component_symbol_card": ({ diagram, testID }) => <ComponentSymbolCard diagram={diagram} testID={testID} />,
  // CC-11.11: Unit 202 visual-completeness pass -- three canonical states
  // (rectification.waveforms x3, capacitor.transient x2,
  // current-direction.electron-flow-vs-conventional x1) had a governed
  // DETERMINISTIC_TECHNICAL production class but no renderer at all. Added
  // here as real, working, production-ready renderers; not yet referenced
  // by any lesson step's `representation.diagramBlueprintId` (that wiring
  // is content-layer integration work for a future package).
  "electronics.rectification_waveform": ({ diagram, testID }) => <RectificationWaveformDiagram diagram={diagram} testID={testID} />,
  "electronics.capacitor_transient_curve": ({ diagram, testID }) => <CapacitorTransientDiagram diagram={diagram} testID={testID} />,
  "electronics.electron_flow_vs_conventional_current": ({ diagram, testID }) => <ElectronFlowVsConventionalDiagram diagram={diagram} testID={testID} />,
};

/** The exact set of diagram blueprint ids this registry can render -- the mechanical renderer-coverage gate cross-checks the live corpus against this list. */
export const SUPPORTED_DIAGRAM_BLUEPRINT_IDS: readonly string[] = Object.freeze(Object.keys(REGISTRY).sort());

export class UnsupportedDiagramBlueprintError extends Error {
  constructor(blueprintId: string) {
    super(
      `No registered renderer for diagram blueprint '${blueprintId}'. Every diagram blueprint referenced by governed content must be registered in DiagramRenderer.tsx's REGISTRY -- see scripts/content/validate-diagram-renderer-coverage.ts, the mechanical gate that should have caught this before it ever reached runtime.`,
    );
    this.name = "UnsupportedDiagramBlueprintError";
  }
}

/**
 * The registry lookup itself, keyed by bare blueprint id -- the one
 * primitive every caller shares. `DiagramRenderer` below (Lesson Player,
 * any future practice surface) wraps this around a full governed
 * `DiagramBlueprint`; `apps/mobile/src/lib/visual-governance/capture-
 * renders.test.tsx` (CC-05D's render-capture/QA-catalogue pipeline) calls
 * it directly by id, since that tooling works from `CanonicalVariant`
 * fixtures, not full blueprint objects -- this is the single dispatch
 * point task brief §7 asks for; neither caller hand-rolls its own switch.
 */
export function resolveDiagramComponent(blueprintId: string): DiagramComponent {
  const Component = REGISTRY[blueprintId];
  if (!Component) throw new UnsupportedDiagramBlueprintError(blueprintId);
  return Component;
}

/**
 * CC-12B/CC-12C: governed CC-11 premium teaching masters, keyed by the SAME
 * governed `DiagramBlueprint.id` the SVG registry above uses -- one
 * governed identity, not a parallel one.
 *
 * CC-12C correction: CC-12B's own right-hand-grip entry shipped a stale,
 * orphaned file -- byte-identical to an early, disconnected approval
 * record (`unit202-artwork-manifest.json`, 2026-08-24) that predates and
 * was never reconciled with the real audit lineage
 * (`reports/instructional-visuals/premium-artwork/proof/unit202.right-hand-grip.teaching/`,
 * v1 through the CC-11.14-proven v4). The canonical-visual-registry.json
 * generated-artifact is ALSO not a safe source of truth here: CC-12C found
 * it frozen at v2 for this same asset and at v2 for emf.motional, one and
 * two revisions behind their actual final-PASS masters respectively. The
 * only trustworthy source of truth is the highest-numbered `*-audit-vN.json`
 * with `verdict/technicalVerdict/pedagogicalClarityVerdict/
 * visualProductQualityVerdict` all `"PASS"` for a given assetId -- see
 * CANONICAL_ASSET_LOCK below, which pins exactly that, and the governance
 * test (`DiagramRenderer.test.tsx`, "CC-12C"/"CC-13" blocks) that proves
 * each shipped file's own SHA-256 still matches it.
 *
 * Entries here resolve only in `context="teaching"` (or, for
 * `CONTEXT_AGNOSTIC_BLUEPRINT_IDS` below, in either context) -- see
 * CANONICAL_ASSESSMENT_VISUALS and CANONICAL_PARAMETER_VISUALS further
 * down for the other two resolution paths `DiagramRenderer` tries first.
 */
interface CanonicalVisual {
  readonly canonicalAssetId: string;
  readonly source: ImageSourcePropType;
  readonly accessibilityLabel: string;
}

const CANONICAL_TEACHING_VISUALS: Readonly<Record<string, CanonicalVisual>> = {
  "magnetic.field_conductor_direction": {
    canonicalAssetId: "unit202.right-hand-grip.teaching",
    // Metro's asset resolver does not honour the "@/" module alias for
    // require() image literals (only the JS/TS module graph does) -- a
    // relative path is required here even though every other import in
    // this file uses "@/".
    source: require("../../assets/instructional/unit202/teaching/right-hand-grip-teaching-master-v4.png"),
    accessibilityLabel:
      "Right-hand grip rule. A right hand grips a straight current-carrying conductor with the thumb extended along it, pointing in the direction of the conventional current. The four curled fingers wrap around the conductor showing the direction the magnetic field circulates, with a single arrow showing the field wrapping the conductor.",
  },
  "motor.force_field_current": {
    canonicalAssetId: "unit202.motor.effect.horizontal-poles.state.into-page-teaching",
    source: require("../../assets/instructional/unit202/hybrid/motor-effect-horizontal-poles-into-page-teaching-base-v1.png"),
    accessibilityLabel:
      "A current-carrying conductor between a north pole on the left and a south pole on the right, with the magnetic field running left to right between them. The conventional current flows into the page. The resulting force on the conductor is shown acting downward.",
  },
  "emf.motional_emf_geometry": {
    canonicalAssetId: "unit202.emf.motional",
    source: require("../../assets/instructional/unit202/teaching/emf-motional-teaching-master-v3.png"),
    // CC-12G: the governed length symbol is "L" (see MotionalEmfDiagram.tsx's
    // own header comment) -- this text label is updated accordingly, even
    // though the approved image asset itself (out of this package's "no
    // image regen" scope) still bakes in a lowercase "l" pixel label with
    // no adjacent "I" to be ambiguous with.
    accessibilityLabel:
      "A conductor of length L moving with velocity v through a magnetic field of flux density B, with L, v and B mutually perpendicular, inducing an EMF in the conductor.",
  },
  // CC-13: bar-magnet pole interaction. This asset never bakes in the
  // attract/repel force arrows (audit-verified absent), so it is safe as a
  // structural illustration in teaching context -- but with no revealed
  // variant, it cannot replace the SVG's post-submission force-arrow
  // reveal in assessment context (LessonStepView.tsx's `showPoleForce`),
  // so this entry deliberately stays teaching-only, never added to
  // CONTEXT_AGNOSTIC_BLUEPRINT_IDS.
  "magnetic.pole_interaction": {
    canonicalAssetId: "unit202.magnet.poles.like",
    source: require("../../assets/instructional/unit202/teaching/magnet-poles-like-teaching-master-v2.png"),
    accessibilityLabel:
      "Two bar magnets facing each other across a central gap. The right-hand pole of the left magnet and the left-hand pole of the right magnet -- the two facing poles -- are both labelled N (north).",
  },
};

/**
 * CC-13: blueprints whose CANONICAL_TEACHING_VISUALS entry never depends on
 * teaching-vs-assessment context, because the underlying SVG component has
 * no `reveal` prop at all for this blueprint -- the same fixed picture is
 * given information in every context, never an assessed answer. Currently
 * only `emf.motional_emf_geometry` (MotionalEmfDiagram always shows the
 * full B/l/v geometry unconditionally); `magnetic.pole_interaction` is
 * deliberately NOT here (see its entry's own comment above).
 */
const CONTEXT_AGNOSTIC_BLUEPRINT_IDS: ReadonlySet<string> = new Set(["emf.motional_emf_geometry"]);

/**
 * CC-13: reveal-sensitive, per-parameter-state canonical visuals for
 * `context="assessment"` -- the fix for the defect a Product Owner
 * emulator finding traced live: `guided_interpret_field_direction`
 * (magnetic.field_conductor_direction) and `guided_interpret_force_direction`
 * / `recheck_force_direction` (motor.force_field_current) both drive a
 * REAL randomly-generated `DiagramInstance` (see
 * @alp/calculation-engine's `interpretFieldDirection`/`interpretForceDirection`),
 * so `context` alone is not enough to pick one static image -- the actual
 * generated parameter combination (current direction; pole orientation +
 * current direction) must select among several state-specific masters,
 * each independently produced and audited in both a "withheld" variant
 * (the given stimulus only, answer-bearing element absent -- shown before
 * submission) and a "revealed" variant (same stimulus, answer-bearing
 * element present -- shown after submission, replacing the SVG registry's
 * own `reveal` prop for these two blueprints specifically).
 *
 * `motor.force_field_current`'s `N_S_vertical` states are deliberately
 * NOT included: independently re-deriving F = I L x B for this course's
 * own axis convention (cross-checked against @alp/calculation-engine's
 * `FORCE_DIRECTION` table, which matches the N_S_horizontal states'
 * shipped imagery exactly) found the vertical-pole assets' own audit
 * files self-contradict that physics -- both `state.into-page-teaching`
 * and `state.out-of-page-teaching`'s audit records describe a force
 * arrow direction that is the MIRROR of the governed engine's actual
 * expected value for that same state (a real content defect in the
 * asset production/audit run, not a provenance or wiring question this
 * package is scoped to fix -- see the completion report). Wiring a
 * physically wrong revealed force direction to a learner would be worse
 * than the SVG gap it would replace, so `N_S_vertical` stays on the SVG
 * registry (verified correct) until that defect is independently
 * corrected by a future content-production package.
 */
interface CanonicalAssessmentState {
  readonly withheld: CanonicalVisual;
  readonly revealed: CanonicalVisual;
}
interface CanonicalAssessmentFamily {
  readonly paramNames: readonly string[];
  readonly variants: Readonly<Record<string, CanonicalAssessmentState>>;
}

function assessmentStateKey(diagram: DiagramInstance, paramNames: readonly string[]): string {
  return paramNames.map((name) => String(diagram.parameters[name])).join("|");
}

const CANONICAL_ASSESSMENT_VISUALS: Readonly<Record<string, CanonicalAssessmentFamily>> = {
  "magnetic.field_conductor_direction": {
    paramNames: ["current_direction"],
    variants: {
      into_page: {
        withheld: {
          canonicalAssetId: "unit202.current-conductor.magnetic-field.state.into-page-assessment",
          source: require("../../assets/instructional/unit202/hybrid/current-conductor-magnetic-field-state-into-page-assessment-master-v1.png"),
          accessibilityLabel:
            "A straight current-carrying conductor, seen end-on, with the conventional current flowing into the page. Concentric circles around the conductor show where the magnetic field acts, but the direction it circulates is not shown.",
        },
        revealed: {
          canonicalAssetId: "unit202.current-conductor.magnetic-field.state.into-page-teaching",
          source: require("../../assets/instructional/unit202/hybrid/current-conductor-magnetic-field-state-into-page-teaching-master-v2.png"),
          accessibilityLabel:
            "A straight current-carrying conductor, seen end-on, with the conventional current flowing into the page. The magnetic field circulates clockwise around the conductor, as seen by the viewer.",
        },
      },
      out_of_page: {
        withheld: {
          canonicalAssetId: "unit202.current-conductor.magnetic-field.state.out-of-page-assessment",
          source: require("../../assets/instructional/unit202/hybrid/current-conductor-magnetic-field-state-out-of-page-assessment-master-v1.png"),
          accessibilityLabel:
            "A straight current-carrying conductor, seen end-on, with the conventional current flowing out of the page. Concentric circles around the conductor show where the magnetic field acts, but the direction it circulates is not shown.",
        },
        revealed: {
          canonicalAssetId: "unit202.current-conductor.magnetic-field.state.out-of-page-teaching",
          source: require("../../assets/instructional/unit202/hybrid/current-conductor-magnetic-field-state-out-of-page-teaching-master-v1.png"),
          accessibilityLabel:
            "A straight current-carrying conductor, seen end-on, with the conventional current flowing out of the page. The magnetic field circulates counterclockwise around the conductor, as seen by the viewer.",
        },
      },
    },
  },
  "motor.force_field_current": {
    paramNames: ["pole_labels", "current_direction"],
    variants: {
      "N_S_horizontal|into_page": {
        withheld: {
          canonicalAssetId: "unit202.motor.effect.horizontal-poles.state.into-page-assessment",
          source: require("../../assets/instructional/unit202/hybrid/motor-effect-horizontal-poles-into-page-assessment-master-v2.png"),
          accessibilityLabel:
            "A current-carrying conductor between a north pole on the left and a south pole on the right, with the magnetic field running left to right between them. The conventional current flows into the page. The resulting force on the conductor is not shown.",
        },
        revealed: {
          canonicalAssetId: "unit202.motor.effect.horizontal-poles.state.into-page-teaching",
          source: require("../../assets/instructional/unit202/hybrid/motor-effect-horizontal-poles-into-page-teaching-base-v1.png"),
          accessibilityLabel:
            "A current-carrying conductor between a north pole on the left and a south pole on the right, with the magnetic field running left to right between them. The conventional current flows into the page. The resulting force on the conductor is shown acting downward.",
        },
      },
      "N_S_horizontal|out_of_page": {
        withheld: {
          canonicalAssetId: "unit202.motor.effect.horizontal-poles.state.out-of-page-assessment",
          source: require("../../assets/instructional/unit202/hybrid/motor-effect-horizontal-poles-out-of-page-assessment-master-v2.png"),
          accessibilityLabel:
            "A current-carrying conductor between a north pole on the left and a south pole on the right, with the magnetic field running left to right between them. The conventional current flows out of the page. The resulting force on the conductor is not shown.",
        },
        revealed: {
          canonicalAssetId: "unit202.motor.effect.horizontal-poles.state.out-of-page-teaching",
          source: require("../../assets/instructional/unit202/hybrid/motor-effect-horizontal-poles-out-of-page-teaching-master-v2.png"),
          accessibilityLabel:
            "A current-carrying conductor between a north pole on the left and a south pole on the right, with the magnetic field running left to right between them. The conventional current flows out of the page. The resulting force on the conductor is shown acting upward.",
        },
      },
    },
  },
};

/**
 * CC-13: context-agnostic, per-parameter-state canonical visuals -- for
 * blueprints whose SVG component has no `reveal` prop at all (the picture
 * is always fully shown, in every context, per each component's own
 * header comment: LeverDiagram "the class is never withheld", GearDiagram/
 * PulleyDiagram/ACGeneratorDiagram likewise), so the same single image per
 * parameter state is safe for both teaching and assessment. Governed
 * lesson content never overrides these parameters (each state is reached
 * only through the corresponding question blueprint's own randomised
 * generation -- see `lesson-simple-machines.ts` / `lesson-ac-generation-
 * principles.ts`), so every reachable state is covered here.
 *
 * `mechanical.lever_arrangement`'s `guard` is load-bearing: the audited
 * masters show only FULCRUM/EFFORT/LOAD labels, never the `show_distances`
 * distance-bracket (de/dl) overlay `worked_example_lever_balance` /
 * `guided_calculate_lever_balance` / `independent_calculate_lever_balance`
 * require -- using the static image there would silently drop essential
 * calculation-teaching content, so those steps always fall through to the
 * SVG registry, unchanged.
 */
interface CanonicalParameterFamily {
  readonly paramName: string;
  readonly variants: Readonly<Record<string, CanonicalVisual>>;
  readonly guard?: (diagram: DiagramInstance) => boolean;
}

const CANONICAL_PARAMETER_VISUALS: Readonly<Record<string, CanonicalParameterFamily>> = {
  "mechanical.gear_mesh": {
    paramName: "size_ratio",
    variants: {
      equal: {
        canonicalAssetId: "unit202.gears.equal",
        source: require("../../assets/instructional/unit202/hybrid/gears-equal-master-v1.png"),
        accessibilityLabel: "The driver gear meshes with the driven gear. The driven gear is the same size as the driver gear, so speed and torque are unchanged.",
      },
      driven_larger: {
        canonicalAssetId: "unit202.gears.driven-larger",
        source: require("../../assets/instructional/unit202/hybrid/gears-driven-larger-master-v1.png"),
        accessibilityLabel:
          "The driver gear meshes with the driven gear. The driven gear is larger than the driver gear, meaning it turns more slowly and produces higher output torque.",
      },
      driven_smaller: {
        canonicalAssetId: "unit202.gears.driven-smaller",
        source: require("../../assets/instructional/unit202/hybrid/gears-driven-smaller-master-v1.png"),
        accessibilityLabel:
          "The driver gear meshes with the driven gear. The driven gear is smaller than the driver gear, meaning it turns faster and produces lower output torque.",
      },
    },
  },
  "mechanical.pulley_arrangement": {
    paramName: "arrangement",
    variants: {
      fixed: {
        canonicalAssetId: "unit202.pulleys.fixed",
        source: require("../../assets/instructional/unit202/hybrid/pulleys-fixed-master-v1.png"),
        accessibilityLabel:
          "A fixed pulley: the wheel is mounted to a fixed anchor at the top. Effort pulls down on one side of the rope, and the load hangs from the other side. One rope segment supports the load -- the pulley changes the direction of the force but gives no mechanical advantage.",
      },
      movable: {
        canonicalAssetId: "unit202.pulleys.movable",
        source: require("../../assets/instructional/unit202/hybrid/pulleys-movable-master-v1.png"),
        accessibilityLabel:
          "A movable pulley: the wheel is attached directly to the load and moves with it. One end of the rope is anchored to a fixed point at the top; the rope runs down around the movable pulley and back up to where the effort pulls. Two rope segments support the load, giving a mechanical advantage of approximately 2.",
      },
    },
  },
  "mechanical.lever_arrangement": {
    paramName: "lever_class",
    guard: (diagram) => diagram.parameters.show_distances !== true,
    variants: {
      class_1: {
        canonicalAssetId: "unit202.levers.class-1",
        source: require("../../assets/instructional/unit202/hybrid/levers-class-1-master-v3.png"),
        accessibilityLabel: "A Class I lever with the fulcrum positioned between the effort point and the load point.",
      },
      class_2: {
        canonicalAssetId: "unit202.levers.class-2",
        source: require("../../assets/instructional/unit202/hybrid/levers-class-2-master-v6.png"),
        accessibilityLabel: "A Class II lever with the load positioned between the fulcrum and the effort point.",
      },
      class_3: {
        canonicalAssetId: "unit202.levers.class-3",
        source: require("../../assets/instructional/unit202/hybrid/levers-class-3-master-v4.png"),
        accessibilityLabel: "A Class III lever with the effort positioned between the fulcrum and the load point.",
      },
    },
  },
  "generator.rotating_loop": {
    paramName: "rotation_phase",
    variants: {
      vertical: {
        canonicalAssetId: "unit202.generator.rotating-loop.vertical",
        source: require("../../assets/instructional/unit202/hybrid/generator-rotating-loop-vertical-master-v3.png"),
        accessibilityLabel:
          "A single rectangular wire loop rotates on a shaft between a north pole and a south pole, connected via two slip rings and brushes to an external load. The loop is shown edge-on, its plane aligned with the field lines -- the position where it cuts the magnetic flux at the fastest rate, producing an EMF near its peak.",
      },
      horizontal: {
        canonicalAssetId: "unit202.generator.rotating-loop.horizontal",
        source: require("../../assets/instructional/unit202/hybrid/generator-rotating-loop-horizontal-master-v2.png"),
        accessibilityLabel:
          "A single rectangular wire loop rotates on a shaft between a north pole and a south pole, connected via two slip rings and brushes to an external load. The loop is shown face-on, its plane at right angles to the field lines -- the position where it is momentarily not cutting flux lines, producing an EMF near zero.",
      },
    },
  },
};

/**
 * CC-12C/CC-13: the exact currently-approved master for every shipped
 * canonical visual above, pinned to the specific audit file that gave it
 * its final all-PASS verdict -- never the (proven stale)
 * canonical-visual-registry.json. `DiagramRenderer.test.tsx`'s
 * "CC-12C"/"CC-13" blocks recompute each shipped file's real SHA-256 and
 * assert it against this table, so a future silent asset swap -- stale,
 * superseded, or simply wrong -- fails a test loudly instead of shipping
 * unnoticed. `shippedAssetRelativePath` is relative to
 * `apps/mobile/src/assets/instructional/unit202/`.
 */
export interface CanonicalAssetLockEntry {
  readonly canonicalAssetId: string;
  readonly approvedVersion: string;
  readonly sha256: string;
  readonly auditFile: string;
  readonly shippedAssetRelativePath: string;
}

const PROOF = "reports/instructional-visuals/premium-artwork/proof";

export const CANONICAL_ASSET_LOCK: readonly CanonicalAssetLockEntry[] = [
  {
    canonicalAssetId: "unit202.right-hand-grip.teaching",
    approvedVersion: "v4",
    sha256: "85f1ff3141ac5fba12254372667d7f82701f7a02f786fd19c2c205d12645cac6",
    auditFile: `${PROOF}/unit202.right-hand-grip.teaching/unit202.right-hand-grip.teaching-audit-v4.json`,
    shippedAssetRelativePath: "teaching/right-hand-grip-teaching-master-v4.png",
  },
  {
    canonicalAssetId: "unit202.current-conductor.magnetic-field.state.into-page-assessment",
    approvedVersion: "v1",
    sha256: "df8da72332d5ace44e149508ed608bf1cab5097bfcc678a5f2939317daab88ef",
    auditFile: `${PROOF}/unit202.current-conductor.magnetic-field/unit202.current-conductor.magnetic-field.state.into-page-assessment-audit-v1.json`,
    shippedAssetRelativePath: "hybrid/current-conductor-magnetic-field-state-into-page-assessment-master-v1.png",
  },
  {
    canonicalAssetId: "unit202.current-conductor.magnetic-field.state.into-page-teaching",
    approvedVersion: "v2",
    sha256: "1923cfcbcd51df84f78940cb51f25bc36d496e30f692861afb9d719b1df326dc",
    auditFile: `${PROOF}/unit202.current-conductor.magnetic-field/unit202.current-conductor.magnetic-field.state.into-page-teaching-audit-v2.json`,
    shippedAssetRelativePath: "hybrid/current-conductor-magnetic-field-state-into-page-teaching-master-v2.png",
  },
  {
    canonicalAssetId: "unit202.current-conductor.magnetic-field.state.out-of-page-assessment",
    approvedVersion: "v1",
    sha256: "667d3319d477e9570da6851be0802330da1959987037aa89c22d3d375c22fbe0",
    auditFile: `${PROOF}/unit202.current-conductor.magnetic-field/unit202.current-conductor.magnetic-field.state.out-of-page-assessment-audit-v1.json`,
    shippedAssetRelativePath: "hybrid/current-conductor-magnetic-field-state-out-of-page-assessment-master-v1.png",
  },
  {
    canonicalAssetId: "unit202.current-conductor.magnetic-field.state.out-of-page-teaching",
    approvedVersion: "v1",
    sha256: "ac25a9bb00d8b60a991a1b03afecdce2a0fc24273f3fd18569cc3fc6151c14f5",
    auditFile: `${PROOF}/unit202.current-conductor.magnetic-field/unit202.current-conductor.magnetic-field.state.out-of-page-teaching-audit-v1.json`,
    shippedAssetRelativePath: "hybrid/current-conductor-magnetic-field-state-out-of-page-teaching-master-v1.png",
  },
  {
    canonicalAssetId: "unit202.motor.effect.horizontal-poles.state.into-page-teaching",
    approvedVersion: "v2",
    sha256: "baacf82389470774488677dcb655e0765ae1dbf405bdbfb644da45b04d960546",
    auditFile: `${PROOF}/unit202.motor.effect.horizontal-poles/unit202.motor.effect.horizontal-poles.state.into-page-teaching-audit-v2.json`,
    shippedAssetRelativePath: "hybrid/motor-effect-horizontal-poles-into-page-teaching-base-v1.png",
  },
  {
    canonicalAssetId: "unit202.motor.effect.horizontal-poles.state.into-page-assessment",
    approvedVersion: "v2",
    sha256: "0b676366d93f12aa3f8b70ca2c0d23d7d32637ec8da258f8932256bd2802f60a",
    auditFile: `${PROOF}/unit202.motor.effect.horizontal-poles/unit202.motor.effect.horizontal-poles.state.into-page-assessment-audit-v2.json`,
    shippedAssetRelativePath: "hybrid/motor-effect-horizontal-poles-into-page-assessment-master-v2.png",
  },
  {
    canonicalAssetId: "unit202.motor.effect.horizontal-poles.state.out-of-page-teaching",
    approvedVersion: "v2",
    sha256: "3fd0cb57be2c9f57be8729e9991b50a5500db4e08858a0f77b26e59307293375",
    auditFile: `${PROOF}/unit202.motor.effect.horizontal-poles/unit202.motor.effect.horizontal-poles.state.out-of-page-teaching-audit-v2.json`,
    shippedAssetRelativePath: "hybrid/motor-effect-horizontal-poles-out-of-page-teaching-master-v2.png",
  },
  {
    canonicalAssetId: "unit202.motor.effect.horizontal-poles.state.out-of-page-assessment",
    approvedVersion: "v2",
    sha256: "d1b12c67973561fa2ec7f3d78d8be3661cf0eda18aff6e08446ceaee5716c292",
    auditFile: `${PROOF}/unit202.motor.effect.horizontal-poles/unit202.motor.effect.horizontal-poles.state.out-of-page-assessment-audit-v2.json`,
    shippedAssetRelativePath: "hybrid/motor-effect-horizontal-poles-out-of-page-assessment-master-v2.png",
  },
  {
    canonicalAssetId: "unit202.emf.motional",
    approvedVersion: "v3",
    sha256: "6272b40a0c4455eb72b8a5514beba492db8ea8ff029212bf352e388cf5f3ae78",
    auditFile: `${PROOF}/unit202.emf.motional/unit202.emf.motional-audit-v3.json`,
    shippedAssetRelativePath: "teaching/emf-motional-teaching-master-v3.png",
  },
  {
    canonicalAssetId: "unit202.magnet.poles.like",
    approvedVersion: "v2",
    sha256: "ba3cf983ba11d59f3dce870b5e80975ac09894adeb54bae4fd3682373c6c2043",
    auditFile: `${PROOF}/unit202.magnet.poles.like/unit202.magnet.poles.like-audit-v2.json`,
    shippedAssetRelativePath: "teaching/magnet-poles-like-teaching-master-v2.png",
  },
  {
    canonicalAssetId: "unit202.gears.equal",
    approvedVersion: "v1",
    sha256: "16197e868f2fdcf8cad68709be2b4febd11481a2baaa14d8e73542cc3ac4e5f3",
    auditFile: `${PROOF}/unit202.gears.equal/unit202.gears.equal-audit-v1.json`,
    shippedAssetRelativePath: "hybrid/gears-equal-master-v1.png",
  },
  {
    canonicalAssetId: "unit202.gears.driven-larger",
    approvedVersion: "v1",
    sha256: "e7759fd4bfaf48ed2f9d5f9790ea2c25226589f1574ea47031d535b30d1ace59",
    auditFile: `${PROOF}/unit202.gears.driven-larger/unit202.gears.driven-larger-audit-v1.json`,
    shippedAssetRelativePath: "hybrid/gears-driven-larger-master-v1.png",
  },
  {
    canonicalAssetId: "unit202.gears.driven-smaller",
    approvedVersion: "v1",
    sha256: "7710e3562dfc986d9e6a65097388fde9b4dafe3d775a5f9526000335616b4e7d",
    auditFile: `${PROOF}/unit202.gears.driven-smaller/unit202.gears.driven-smaller-audit-v1.json`,
    shippedAssetRelativePath: "hybrid/gears-driven-smaller-master-v1.png",
  },
  {
    canonicalAssetId: "unit202.pulleys.fixed",
    approvedVersion: "v1",
    sha256: "3ec46b4f802c99951b081ac43bca2f73a2ba1aee5716d6988a71c1bcac7fe2d2",
    auditFile: `${PROOF}/unit202.pulleys.fixed/unit202.pulleys.fixed-audit-v1.json`,
    shippedAssetRelativePath: "hybrid/pulleys-fixed-master-v1.png",
  },
  {
    canonicalAssetId: "unit202.pulleys.movable",
    approvedVersion: "v1",
    sha256: "b34c94ebbccfc14f0b366a3c5d8271caf386f1cb36521b0b85c41e50f3348cc7",
    auditFile: `${PROOF}/unit202.pulleys.movable/unit202.pulleys.movable-audit-v1.json`,
    shippedAssetRelativePath: "hybrid/pulleys-movable-master-v1.png",
  },
  {
    canonicalAssetId: "unit202.levers.class-1",
    approvedVersion: "v3",
    sha256: "44a8e608cd66113cc831e6163bd743c513b01108bb68717063301d67f3333f43",
    auditFile: `${PROOF}/unit202.levers.class-1/unit202.levers.class-1-audit-v3.json`,
    shippedAssetRelativePath: "hybrid/levers-class-1-master-v3.png",
  },
  {
    canonicalAssetId: "unit202.levers.class-2",
    approvedVersion: "v6",
    sha256: "624b665096a859c821cfb565ffe4e008d0ec7d901f9624fc8b8ac91654fac94e",
    auditFile: `${PROOF}/unit202.levers.class-2/unit202.levers.class-2-audit-v6.json`,
    shippedAssetRelativePath: "hybrid/levers-class-2-master-v6.png",
  },
  {
    canonicalAssetId: "unit202.levers.class-3",
    approvedVersion: "v4",
    sha256: "7c14e7602aba5218c9e0dca0a9a1e6f55a093c3feaea1fb39ebca4f779767e6a",
    auditFile: `${PROOF}/unit202.levers.class-3/unit202.levers.class-3-audit-v4.json`,
    shippedAssetRelativePath: "hybrid/levers-class-3-master-v4.png",
  },
  {
    canonicalAssetId: "unit202.generator.rotating-loop.horizontal",
    approvedVersion: "v2",
    sha256: "eaae96ee2744ff83ec632ac2da466f3115e8949d2a9d62f4e651c2201d88dd0c",
    auditFile: `${PROOF}/unit202.generator.rotating-loop.horizontal/unit202.generator.rotating-loop.horizontal-audit-v2.json`,
    shippedAssetRelativePath: "hybrid/generator-rotating-loop-horizontal-master-v2.png",
  },
  {
    canonicalAssetId: "unit202.generator.rotating-loop.vertical",
    approvedVersion: "v3",
    sha256: "9842eb16624ceebc4429248aa5f3b1f078c18cc475ec0e25c3085a0f77bf4047",
    auditFile: `${PROOF}/unit202.generator.rotating-loop.vertical/unit202.generator.rotating-loop.vertical-audit-v3.json`,
    shippedAssetRelativePath: "hybrid/generator-rotating-loop-vertical-master-v3.png",
  },
];

export interface DiagramRendererProps {
  readonly blueprint: DiagramBlueprint;
  readonly diagram: DiagramInstance;
  readonly reveal?: DiagramRevealProps;
  /**
   * CC-12B/CC-13: which presentation context this render is for.
   * `"teaching"` may resolve to a governed premium master (falling back
   * to the SVG registry if none is registered for this blueprint).
   * `"assessment"` (the default -- the safe choice for any caller that
   * doesn't pass this explicitly) may ALSO resolve to a governed premium
   * master, but only for blueprints with a registered, reveal-sensitive
   * `CANONICAL_ASSESSMENT_VISUALS` state family (picked withheld/revealed
   * by whether `reveal` is supplied) or a context-agnostic
   * `CANONICAL_PARAMETER_VISUALS` family (no reveal semantics at all);
   * every other blueprint still always uses the SVG registry, whose
   * reveal is separately gated by the `reveal` prop above. Callers should
   * pass this explicitly rather than relying on the default whenever the
   * render context is actually known.
   */
  readonly context?: "teaching" | "assessment";
  readonly testID?: string;
}

function renderCanonicalVisual(visual: CanonicalVisual, testID: string | undefined): React.JSX.Element {
  return (
    <View style={styles.canonicalTeachingCard} testID={testID}>
      <Image
        source={visual.source}
        accessibilityLabel={visual.accessibilityLabel}
        accessibilityRole="image"
        accessible
        resizeMode="contain"
        style={styles.canonicalTeachingImage}
      />
    </View>
  );
}

/**
 * Resolves and renders any governed diagram blueprint -- the single call
 * site both the Lesson Player and any future practice surface should use.
 * Prefers a governed premium master image when one is registered for this
 * exact blueprint id + parameter state + context (see the resolution
 * order in the function body); otherwise resolves and invokes the SVG
 * registry component as a plain function (never `<Component .../>`) --
 * every registry entry is a stateless presentational SVG component with
 * nothing to lose across re-renders, and this avoids resolving a fresh
 * "component identity" on every render (react-hooks/static-components)
 * that a JSX-position call would create.
 */
export function DiagramRenderer({ blueprint, diagram, reveal, context = "assessment", testID }: DiagramRendererProps): React.JSX.Element {
  // CC-13, resolution order:
  // 1. context="assessment" reveal-sensitive, per-parameter-state visuals
  //    (the actual generated question instance's state selects among
  //    several independently-audited withheld/revealed masters).
  // 2. context-agnostic, per-parameter-state visuals with no reveal
  //    semantics at all (guarded where a parameter combination isn't
  //    covered, e.g. mechanical.lever_arrangement's show_distances).
  // 3. the single fixed-default teaching master (context="teaching", or
  //    CONTEXT_AGNOSTIC_BLUEPRINT_IDS in either context).
  // 4. the SVG registry -- the safe fallback whenever nothing above
  //    matches, exactly as before CC-13.
  if (context === "assessment") {
    const assessmentFamily = CANONICAL_ASSESSMENT_VISUALS[blueprint.id];
    if (assessmentFamily) {
      const key = assessmentStateKey(diagram, assessmentFamily.paramNames);
      const state = assessmentFamily.variants[key];
      if (state) return renderCanonicalVisual(reveal ? state.revealed : state.withheld, testID);
    }
  }

  const parameterFamily = CANONICAL_PARAMETER_VISUALS[blueprint.id];
  if (parameterFamily && (!parameterFamily.guard || parameterFamily.guard(diagram))) {
    const value = String(diagram.parameters[parameterFamily.paramName]);
    const variant = parameterFamily.variants[value];
    if (variant) return renderCanonicalVisual(variant, testID);
  }

  const canonical = context === "teaching" || CONTEXT_AGNOSTIC_BLUEPRINT_IDS.has(blueprint.id) ? CANONICAL_TEACHING_VISUALS[blueprint.id] : undefined;
  if (canonical) return renderCanonicalVisual(canonical, testID);

  return resolveDiagramComponent(blueprint.id)({ diagram, reveal, testID });
}

const styles = StyleSheet.create({
  // Premium masters are produced on a white/near-white photographic
  // background (CC-11 style guide); a plain light card, rather than
  // letting that white rectangle sit directly on the app's dark theme,
  // reads as an intentional "artwork" treatment instead of a layout bug.
  canonicalTeachingCard: {
    width: "100%",
    maxWidth: 340,
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: color.text,
    padding: spacing.sm,
  },
  canonicalTeachingImage: { width: "100%", height: "100%" },
});

/**
 * Builds a deterministic, symbolic-only `DiagramInstance` straight from a
 * governed `DiagramBlueprint`'s own parameter declarations -- for pure
 * TEACHING steps (task brief §7's runtime gap: a lesson step that
 * references a diagram but has no generated question instance of its own
 * driving it). Every parameter takes its declared default: the first
 * `allowed` value for an `enum`, `true` for a `boolean` (teaching context
 * shows the full picture -- arrows, value markers -- by default; a
 * `boolean` parameter never carries an answer by itself, unlike the
 * separate `reveal` prop above), and `min` for a `number_range`. This is
 * pure, generic and never diagram-specific -- exactly the "resolver, not a
 * second switch statement" task brief §7 asks for.
 *
 * CC-11.3: `overrides` (from the step's own governed
 * `representation.diagramParameters`, see lesson-plan.ts) replaces the
 * generic default for any parameter it names -- needed the moment more
 * than one lesson step shares a single multi-value blueprint (e.g.
 * `electronics.component_symbol_card`'s `component_type` enum) and each
 * step must show a DIFFERENT one, not all silently defaulting to the
 * same first-declared value. Never overrides a parameter the blueprint
 * doesn't itself declare -- an override key with no matching parameter
 * is simply ignored, never injected as new, ungoverned state.
 */
export function buildTeachingDiagramInstance(
  blueprint: DiagramBlueprint,
  labels: readonly string[] = [],
  overrides?: Readonly<Record<string, string | number | boolean>>,
): DiagramInstance {
  const parameters: Record<string, string | number | boolean> = {};
  for (const param of blueprint.parameters) {
    if (overrides && Object.prototype.hasOwnProperty.call(overrides, param.name)) {
      parameters[param.name] = overrides[param.name]!;
    } else if (param.kind === "boolean") {
      parameters[param.name] = true;
    } else if (param.kind === "number_range") {
      parameters[param.name] = param.min ?? 1;
    } else if (param.kind === "enum" && param.allowed && param.allowed.length > 0) {
      parameters[param.name] = param.allowed[0]!;
    }
  }
  return { blueprintId: blueprint.id, parameters, labels };
}
