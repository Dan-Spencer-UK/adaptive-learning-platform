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
 * scripts/content/data manifests before SQL generation. Question
 * families and lessons remain later CC packages.
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
