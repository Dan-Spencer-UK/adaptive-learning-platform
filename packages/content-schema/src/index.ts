/**
 * Framework-independent package boundary.
 *
 * This package will own the versioned import/export schemas for
 * governed content candidates (assertions, question families, lessons)
 * in later CC packages (from CC-04 onward). CC-01 proves the package
 * boundary and Zod v4 wiring only, using a generic manifest shape --
 * it does not define any part of the real content schema yet.
 */

import { z } from "zod";

export const packageId = "content-schema" as const;

export type PackageId = typeof packageId;

export const packageManifestSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
});

export type PackageManifest = z.infer<typeof packageManifestSchema>;
