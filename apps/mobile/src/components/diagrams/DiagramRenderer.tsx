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
 * CANONICAL_TEACHING_VISUAL_LOCK below, which pins exactly that, and the
 * governance test (`DiagramRenderer.test.tsx`, "CC-12C" block) that proves
 * the shipped file's own SHA-256 still matches it. Deliberately
 * teaching-state only: assessment rendering keeps using the SVG registry
 * above unchanged, which already withholds the assessed answer until after
 * submission (`reveal` prop, LessonStepView.tsx). A blueprint with no
 * entry here (or a `context` of `"assessment"`) always falls through to
 * the SVG registry, so this is purely additive over the existing dispatch,
 * never a replacement of it.
 */
interface CanonicalTeachingVisual {
  readonly canonicalAssetId: string;
  readonly source: ImageSourcePropType;
  readonly accessibilityLabel: string;
}

const CANONICAL_TEACHING_VISUALS: Readonly<Record<string, CanonicalTeachingVisual>> = {
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
    accessibilityLabel:
      "A conductor of length l moving with velocity v through a magnetic field of flux density B, with l, v and B mutually perpendicular, inducing an EMF in the conductor.",
  },
};

/**
 * CC-12C: the exact currently-approved master for each canonical teaching
 * visual above, pinned to the specific audit file that gave it its final
 * all-PASS verdict -- never the (proven stale) canonical-visual-registry.json.
 * `DiagramRenderer.test.tsx`'s "CC-12C" block recomputes each shipped
 * file's real SHA-256 and asserts it against this table, so a future silent
 * asset swap -- stale, superseded, or simply wrong -- fails a test loudly
 * instead of shipping unnoticed.
 */
export const CANONICAL_TEACHING_VISUAL_LOCK: Readonly<
  Record<string, { readonly canonicalAssetId: string; readonly approvedVersion: string; readonly sha256: string; readonly auditFile: string }>
> = {
  "magnetic.field_conductor_direction": {
    canonicalAssetId: "unit202.right-hand-grip.teaching",
    approvedVersion: "v4",
    sha256: "85f1ff3141ac5fba12254372667d7f82701f7a02f786fd19c2c205d12645cac6",
    auditFile: "reports/instructional-visuals/premium-artwork/proof/unit202.right-hand-grip.teaching/unit202.right-hand-grip.teaching-audit-v4.json",
  },
  "motor.force_field_current": {
    canonicalAssetId: "unit202.motor.effect.horizontal-poles.state.into-page-teaching",
    approvedVersion: "v2",
    sha256: "baacf82389470774488677dcb655e0765ae1dbf405bdbfb644da45b04d960546",
    auditFile:
      "reports/instructional-visuals/premium-artwork/proof/unit202.motor.effect.horizontal-poles/unit202.motor.effect.horizontal-poles.state.into-page-teaching-audit-v2.json",
  },
  "emf.motional_emf_geometry": {
    canonicalAssetId: "unit202.emf.motional",
    approvedVersion: "v3",
    sha256: "6272b40a0c4455eb72b8a5514beba492db8ea8ff029212bf352e388cf5f3ae78",
    auditFile: "reports/instructional-visuals/premium-artwork/proof/unit202.emf.motional/unit202.emf.motional-audit-v3.json",
  },
};

export interface DiagramRendererProps {
  readonly blueprint: DiagramBlueprint;
  readonly diagram: DiagramInstance;
  readonly reveal?: DiagramRevealProps;
  /**
   * CC-12B: which presentation context this render is for. `"teaching"`
   * may resolve to a governed premium master (falling back to the SVG
   * registry if none is registered for this blueprint); `"assessment"`
   * (the default -- the safe choice for any caller that doesn't pass this
   * explicitly) always uses the SVG registry, whose reveal is separately
   * gated by the `reveal` prop above. Callers should pass this explicitly
   * rather than relying on the default whenever the render context is
   * actually known.
   */
  readonly context?: "teaching" | "assessment";
  readonly testID?: string;
}

/**
 * Resolves and renders any governed diagram blueprint -- the single call
 * site both the Lesson Player and any future practice surface should use.
 * In `"teaching"` context, prefers a governed premium master image
 * (CANONICAL_TEACHING_VISUALS above) when one is registered for this
 * blueprint id; otherwise (assessment context, or no premium master
 * registered) resolves and invokes the SVG registry component as a plain
 * function (never `<Component .../>`) -- every registry entry is a
 * stateless presentational SVG component with nothing to lose across
 * re-renders, and this avoids resolving a fresh "component identity" on
 * every render (react-hooks/static-components) that a JSX-position call
 * would create.
 */
export function DiagramRenderer({ blueprint, diagram, reveal, context = "assessment", testID }: DiagramRendererProps): React.JSX.Element {
  const canonical = context === "teaching" ? CANONICAL_TEACHING_VISUALS[blueprint.id] : undefined;
  if (canonical) {
    return (
      <View style={styles.canonicalTeachingCard} testID={testID}>
        <Image
          source={canonical.source}
          accessibilityLabel={canonical.accessibilityLabel}
          accessibilityRole="image"
          accessible
          resizeMode="contain"
          style={styles.canonicalTeachingImage}
        />
      </View>
    );
  }
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
