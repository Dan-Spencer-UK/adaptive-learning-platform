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

import { InstrumentConnectionDiagram } from "./InstrumentConnectionDiagram";
import { MagneticForceDiagram } from "./MagneticForceDiagram";
import { ParallelCircuitDiagram } from "./ParallelCircuitDiagram";
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

export interface DiagramRendererProps {
  readonly blueprint: DiagramBlueprint;
  readonly diagram: DiagramInstance;
  readonly reveal?: DiagramRevealProps;
  readonly testID?: string;
}

/**
 * Resolves and renders any governed diagram blueprint via the shared
 * registry -- the single call site both the Lesson Player and any future
 * practice surface should use. Invokes the resolved component as a plain
 * function (never `<Component .../>`) -- every registry entry is a
 * stateless presentational SVG component with nothing to lose across
 * re-renders, and this avoids resolving a fresh "component identity" on
 * every render (react-hooks/static-components) that a JSX-position call
 * would create.
 */
export function DiagramRenderer({ blueprint, diagram, reveal, testID }: DiagramRendererProps): React.JSX.Element {
  return resolveDiagramComponent(blueprint.id)({ diagram, reveal, testID });
}

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
 */
export function buildTeachingDiagramInstance(blueprint: DiagramBlueprint, labels: readonly string[] = []): DiagramInstance {
  const parameters: Record<string, string | number | boolean> = {};
  for (const param of blueprint.parameters) {
    if (param.kind === "boolean") {
      parameters[param.name] = true;
    } else if (param.kind === "number_range") {
      parameters[param.name] = param.min ?? 1;
    } else if (param.kind === "enum" && param.allowed && param.allowed.length > 0) {
      parameters[param.name] = param.allowed[0]!;
    }
  }
  return { blueprintId: blueprint.id, parameters, labels };
}
