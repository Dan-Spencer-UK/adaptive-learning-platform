/**
 * Framework-independent package boundary.
 *
 * This package will own shared domain types (assertions, curriculum,
 * provenance, relationships) in a later CC package. CC-01 establishes
 * only the package boundary, its build/test wiring and dependency
 * direction (no React, no Next.js, no Supabase, no runtime AI).
 */

export const packageId = "domain" as const;

export type PackageId = typeof packageId;

export type { Database } from "./database.types";
