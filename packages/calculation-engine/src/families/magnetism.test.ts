import { describe, expect, it } from "vitest";
import type { DiagramBlueprint, FormulaFamily, QuestionBlueprint, WorkedExampleBlueprint } from "@alp/content-schema";
import { createRngFromIdentity, type DeterministicIdentity } from "../seed.ts";
import { magnetismExecutors, __internal } from "./magnetism.ts";
import type { GenerationContext } from "./shared.ts";

/**
 * Independently re-derives F = I L x B (axes x=right, y=up, z=out-of-page,
 * standard right-hand cross product) from first principles for every
 * (pole_labels, current_direction) combination magnetism.ts's
 * FORCE_DIRECTION lookup table covers, and cross-checks the table against
 * this independent computation -- proving the table is not merely
 * "whatever the code happens to say" but matches the physics.
 */
function crossProduct(a: readonly [number, number, number], b: readonly [number, number, number]): [number, number, number] {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function vectorToDirectionLabel(v: readonly [number, number, number]): "up" | "down" | "left" | "right" {
  const [x, y] = v;
  if (Math.abs(x) > Math.abs(y)) return x > 0 ? "right" : "left";
  return y > 0 ? "up" : "down";
}

const B_FIELD: Readonly<Record<"N_S_horizontal" | "N_S_vertical", [number, number, number]>> = {
  N_S_horizontal: [1, 0, 0], // field points right
  N_S_vertical: [0, -1, 0], // field points down
};

const CURRENT_VECTOR: Readonly<Record<"into_page" | "out_of_page", [number, number, number]>> = {
  into_page: [0, 0, -1],
  out_of_page: [0, 0, 1],
};

describe("magnetism.ts FORCE_DIRECTION table matches F = I L x B independently re-derived", () => {
  const poleLabelOptions = ["N_S_horizontal", "N_S_vertical"] as const;
  const currentDirectionOptions = ["into_page", "out_of_page"] as const;

  for (const poleLabels of poleLabelOptions) {
    for (const currentDirection of currentDirectionOptions) {
      it(`${poleLabels} + ${currentDirection}`, () => {
        const force = crossProduct(CURRENT_VECTOR[currentDirection], B_FIELD[poleLabels]);
        const expectedLabel = vectorToDirectionLabel(force);
        expect(__internal.FORCE_DIRECTION[poleLabels][currentDirection]).toBe(expectedLabel);
      });
    }
  }
});

describe("magnetism.ts FIELD_ROTATION_BY_CURRENT_DIRECTION matches the right-hand grip rule", () => {
  it("current out of the page (toward viewer) curls the field counterclockwise", () => {
    expect(__internal.FIELD_ROTATION_BY_CURRENT_DIRECTION.out_of_page).toBe("counterclockwise");
  });

  it("current into the page (away from viewer) curls the field clockwise", () => {
    expect(__internal.FIELD_ROTATION_BY_CURRENT_DIRECTION.into_page).toBe("clockwise");
  });
});

// --- Executor-level proof using minimal synthetic fixtures (not the real CC-05A content) ---

const FIELD_DIAGRAM_BLUEPRINT: DiagramBlueprint = {
  id: "magnetic.field_conductor_direction",
  type: "magnetic_field",
  renderer: "svg",
  parameters: [],
  accessibility: { semanticDescriptionRequired: true, colourOnlyEncodingProhibited: true, identifierLabelPattern: "arrow-{index}" },
  valueEmbedding: "symbolic_only",
};

const FORCE_DIAGRAM_BLUEPRINT: DiagramBlueprint = { ...FIELD_DIAGRAM_BLUEPRINT, id: "motor.force_field_current" };

function fixtureBlueprint(id: string, capabilityId: string, diagramBlueprintId?: string): QuestionBlueprint {
  return {
    id,
    assertionFamilyId: "electrical.magnetism_and_electromagnetism",
    capabilityId,
    title: id,
    representation: diagramBlueprintId ? { diagram: { required: true, blueprintId: diagramBlueprintId } } : {},
    variantDimensions: {},
    parameterGenerators: [],
    answer: { type: "direction" },
    marking: { type: "direction_match" },
    evidence: {
      primaryCapabilityId: capabilityId,
      familyId: "electrical.magnetism_and_electromagnetism",
      assertionIdentifiers: ["EL-CONCEPT-MAGNETIC-FIELD-CURRENT-001"],
      supportingCapabilityIds: [],
      representationDependency: [],
      misconceptionTargets: [],
    },
    difficultyBand: "advanced",
  };
}

function contextFor(blueprint: QuestionBlueprint, identity: DeterministicIdentity): GenerationContext {
  const formulaFamilies: FormulaFamily[] = [];
  const diagramBlueprints: DiagramBlueprint[] = [FIELD_DIAGRAM_BLUEPRINT, FORCE_DIAGRAM_BLUEPRINT];
  const workedExampleBlueprints: WorkedExampleBlueprint[] = [];
  return {
    blueprint,
    formulaFamiliesById: new Map(formulaFamilies.map((f) => [f.id, f])),
    diagramBlueprintsById: new Map(diagramBlueprints.map((d) => [d.id, d])),
    workedExampleBlueprintsById: new Map(workedExampleBlueprints.map((w) => [w.id, w])),
    identity,
    rng: createRngFromIdentity(identity),
  };
}

describe("magnetismExecutors: interpret_field_direction / interpret_force_direction", () => {
  it("interpret_field_direction always answers with a rotation-sense value consistent with the table", () => {
    for (let seed = 0; seed < 20; seed++) {
      const identity: DeterministicIdentity = { blueprintId: "magnetism.interpret_field_direction", blueprintVersion: 1, contentRelease: "test", seed };
      const blueprint = fixtureBlueprint("magnetism.interpret_field_direction", "cap.magnetism.interpret_field_direction", "magnetic.field_conductor_direction");
      const instance = magnetismExecutors["magnetism.interpret_field_direction"]!(contextFor(blueprint, identity));
      const currentDirection = instance.parameters.current_direction as "into_page" | "out_of_page";
      expect(instance.expected.value).toBe(__internal.FIELD_ROTATION_BY_CURRENT_DIRECTION[currentDirection]);
      expect(["into_page", "out_of_page"]).toContain(currentDirection);
    }
  });

  it("interpret_force_direction always answers with a value consistent with the table", () => {
    for (let seed = 0; seed < 20; seed++) {
      const identity: DeterministicIdentity = { blueprintId: "magnetism.interpret_force_direction", blueprintVersion: 1, contentRelease: "test", seed };
      const blueprint = fixtureBlueprint("magnetism.interpret_force_direction", "cap.magnetism.interpret_force_direction", "motor.force_field_current");
      const instance = magnetismExecutors["magnetism.interpret_force_direction"]!(contextFor(blueprint, identity));
      const poleLabels = instance.parameters.pole_labels as "N_S_horizontal" | "N_S_vertical";
      const currentDirection = instance.parameters.current_direction as "into_page" | "out_of_page";
      expect(instance.expected.value).toBe(__internal.FORCE_DIRECTION[poleLabels][currentDirection]);
    }
  });
});
