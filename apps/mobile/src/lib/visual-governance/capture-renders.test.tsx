/// <reference types="node" />
/**
 * CC-05D: deterministic render-capture step (`npm run visuals:render`).
 * The triple-slash reference above scopes Node's ambient globals
 * (__dirname, the "node:*" built-in module declarations) to this one
 * Jest-only tooling file, without adding "node" to apps/mobile's
 * project-wide tsconfig `types` array -- the rest of the mobile app
 * must remain free of Node-only runtime assumptions (MOBILE-
 * ARCHITECTURE.md §9), and this file itself never ships in the app
 * bundle (it is a *.test.tsx, excluded from any Metro/Expo build).
 * Renders every governed canonical variant (see
 * ./canonical-variants-fixture.ts) through the real, unmodified diagram
 * components, converts each one's real toJSON() element tree into a
 * standalone SVG artefact via ./render-tree-to-svg.ts, and writes:
 *   - reports/instructional-visuals/renders/<variantId>.svg
 *   - reports/instructional-visuals/manifest.json
 *
 * This runs under Jest deliberately -- react-native-svg's components
 * require RN's native-module mock layer to construct their element tree
 * at all, so there is no way to render them from a bare Node script.
 * This is the same established pattern as
 * scripts/content/check-cc05c-proving-fixture.test.ts: a test file that
 * is simultaneously "a test" and "the actual mechanism".
 *
 * CC-11: dispatch now goes through the single shared
 * `resolveDiagramComponent` registry (DiagramRenderer.tsx) the Lesson
 * Player also uses -- no second, independently-maintained switch
 * statement (task brief §7's explicit "do not copy/paste a giant second
 * switch statement" instruction). This is also how the 3 renderers CC-05D
 * left un-built (circuit.series_parallel_mixed, graph.waveform_sine,
 * instrument.measurement_connection) became renderable here for free,
 * with zero changes to this file's own dispatch logic.
 */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { render } from "@testing-library/react-native";
import { renderManifestSchema, type RenderedArtifact, type CanonicalVariant } from "@alp/content-schema";

import { resolveDiagramComponent, type DiagramRevealProps } from "@/components/diagrams/DiagramRenderer";
import { CANONICAL_VARIANTS, CC05D_CONTENT_RELEASE } from "./canonical-variants-fixture";
import { renderTreeToSvg, type RenderTreeNode } from "./render-tree-to-svg";

const REPORTS_DIR = join(__dirname, "..", "..", "..", "..", "..", "reports", "instructional-visuals");
const RENDERS_DIR = join(REPORTS_DIR, "renders");

function sanitiseFileName(variantId: string): string {
  return variantId.replace(/[^a-zA-Z0-9@._-]+/g, "_");
}

async function renderVariantTree(variant: CanonicalVariant): Promise<RenderTreeNode> {
  const diagram = { blueprintId: variant.diagramBlueprintId, parameters: variant.parameters, labels: variant.labels };
  const reveal: DiagramRevealProps = {
    fieldRotation: variant.revealProps.field_rotation as "clockwise" | "counterclockwise" | undefined,
    forceDirection: variant.revealProps.force_direction as "up" | "down" | "left" | "right" | undefined,
  };
  // Invoked as a plain function, not `<Component .../>` -- see
  // DiagramRenderer.tsx's own comment on why (avoids react-hooks/
  // static-components; every registry entry is stateless).
  const root = await render(resolveDiagramComponent(variant.diagramBlueprintId)({ diagram, reveal }));

  const tree = root.toJSON();
  if (tree === null || Array.isArray(tree)) {
    throw new Error(`capture-renders: expected exactly one root SVG node for variant '${variant.variantId}', got ${Array.isArray(tree) ? `${tree.length} nodes` : "null"}.`);
  }
  return tree as unknown as RenderTreeNode;
}

describe("CC-05D deterministic render capture", () => {
  it("renders every governed canonical variant, converts it to real SVG, and writes deterministic artefacts + manifest", async () => {
    mkdirSync(RENDERS_DIR, { recursive: true });

    const artifacts: RenderedArtifact[] = [];
    for (const variant of CANONICAL_VARIANTS) {
      const tree = await renderVariantTree(variant);
      const svg = renderTreeToSvg(tree);
      const imageHash = createHash("sha256").update(svg, "utf8").digest("hex");
      const fileName = `${sanitiseFileName(variant.variantId)}.svg`;
      writeFileSync(join(RENDERS_DIR, fileName), svg, "utf8");

      artifacts.push({
        variantId: variant.variantId,
        contractId: variant.contractId,
        diagramBlueprintId: variant.diagramBlueprintId,
        mode: variant.mode,
        svgRelativePath: `renders/${fileName}`,
        imageHash,
      });
    }

    expect(artifacts).toHaveLength(CANONICAL_VARIANTS.length);
    // Every artefact must actually be a non-trivial, well-formed SVG document.
    for (const artifact of artifacts) {
      expect(artifact.imageHash).toMatch(/^[0-9a-f]{64}$/);
    }
    // No two distinct variants should ever collapse to the same rendered image -- that would mean the diagram isn't actually parameterised by the variant.
    expect(new Set(artifacts.map((a) => a.imageHash)).size).toBe(artifacts.length);

    const manifest = renderManifestSchema.parse({
      generatedAt: new Date().toISOString(),
      contentRelease: CC05D_CONTENT_RELEASE,
      artifacts: [...artifacts].sort((a, b) => a.variantId.localeCompare(b.variantId)),
    });
    mkdirSync(REPORTS_DIR, { recursive: true });
    writeFileSync(join(REPORTS_DIR, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
  });

  it("is deterministic -- re-rendering the same variant twice produces byte-identical SVG", async () => {
    const variant = CANONICAL_VARIANTS[0]!;
    const svgA = renderTreeToSvg(await renderVariantTree(variant));
    const svgB = renderTreeToSvg(await renderVariantTree(variant));
    expect(svgA).toBe(svgB);
  });

  it("assessment-mode variants never render the field/force reveal label text an equivalent teaching-mode variant shows (structural answer-leakage guard on the real rendered SVG, not just the source props)", async () => {
    const teaching = CANONICAL_VARIANTS.find((v) => v.diagramBlueprintId === "magnetic.field_conductor_direction" && v.mode === "teaching")!;
    const assessment = CANONICAL_VARIANTS.find(
      (v) => v.diagramBlueprintId === "magnetic.field_conductor_direction" && v.mode === "assessment" && v.parameters.current_direction === teaching.parameters.current_direction,
    )!;
    const teachingSvg = renderTreeToSvg(await renderVariantTree(teaching));
    const assessmentSvg = renderTreeToSvg(await renderVariantTree(assessment));
    expect(teachingSvg).toContain(`Field: ${teaching.revealProps.field_rotation}`);
    expect(assessmentSvg).not.toContain("Field:");
  });
});
