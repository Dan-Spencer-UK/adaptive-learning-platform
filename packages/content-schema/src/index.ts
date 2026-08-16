/**
 * Framework-independent package boundary.
 *
 * This package owns the versioned import/export schemas for governed
 * content candidates. CC-01 proved the package boundary and Zod v4
 * wiring only, using a generic manifest shape. CC-04 added the real
 * knowledge-graph manifest schema (./knowledge-graph.ts) -- domain,
 * source/source-version/source-locator, curriculum/curriculum-version/
 * curriculum-node, assertion/assertion-version, assertion relationship,
 * assertion<->curriculum mapping, misconception -- used to validate
 * scripts/content/data manifests before SQL generation. CC-05A added the
 * pedagogical layer built on top of that knowledge graph (./pedagogy.ts)
 * -- assertion families, capabilities, formula families, teaching/
 * diagram/mnemonic representations, question blueprints -- consumed by
 * the future CC-05B deterministic engine. Lessons and the full learner-
 * runtime content-publication pipeline remain later CC packages.
 */

import { z } from "zod";

export const packageId = "content-schema" as const;

export type PackageId = typeof packageId;

export const packageManifestSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
});

export type PackageManifest = z.infer<typeof packageManifestSchema>;

export * from "./knowledge-graph.ts";
export * from "./pedagogy.ts";
