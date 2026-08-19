/**
 * Local content-library persistence (task brief §25D/§25J): records
 * whether a lesson's governed content dependencies have been validated as
 * locally available, so the Lesson Player can enforce the LOCAL_READY
 * contract ("a LessonInstance may begin only when the content required to
 * execute it is locally available") from a single durable lookup, without
 * re-validating on every render. Built on the existing `local_lesson_content`
 * SQLite table (lib/storage/db.ts) -- no second persistence system.
 *
 * This module only records/reads content-availability STATUS. The actual
 * completeness check is ./content-availability.ts's pure
 * `findMissingDependencies` -- this module never re-implements that logic.
 */
import type { LessonContentDependencyManifest } from "@alp/learning-engine";

import { getFoundationDb } from "../storage/db.ts";
import { findMissingDependencies, type LocalContentInventory, type MissingDependency } from "./content-availability.ts";

export type LocalContentStatus = "ready" | "invalid" | "not_prepared";

export interface LocalContentRecord {
  readonly lessonId: string;
  readonly lessonVersion: number;
  readonly contentRelease: string;
  readonly status: LocalContentStatus;
  readonly missingDependencies: readonly MissingDependency[];
  readonly preparedAt: string | null;
  readonly updatedAt: string;
}

type LocalContentRow = {
  content_key: string;
  lesson_id: string;
  lesson_version: number;
  content_release: string;
  status: "ready" | "invalid";
  missing_dependencies: string;
  prepared_at: string | null;
  updated_at: string;
};

function contentKey(lessonId: string, lessonVersion: number, contentRelease: string): string {
  return `${lessonId}@${lessonVersion}::${contentRelease}`;
}

function toRecord(row: LocalContentRow): LocalContentRecord {
  return {
    lessonId: row.lesson_id,
    lessonVersion: row.lesson_version,
    contentRelease: row.content_release,
    status: row.status,
    missingDependencies: JSON.parse(row.missing_dependencies) as readonly MissingDependency[],
    preparedAt: row.prepared_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Validates a lesson's dependency manifest against a local content
 * inventory and durably records the result (task brief §25I: "downloaded
 * content -> identity/version check -> structural validation ->
 * completeness check -> mark locally available"). For this proving slice,
 * `inventory` describes bundled/seeded content (task brief §25B); the
 * same function works unchanged once content is genuinely downloaded.
 */
export async function prepareLessonContent(
  manifest: LessonContentDependencyManifest,
  inventory: LocalContentInventory,
): Promise<LocalContentRecord> {
  const db = await getFoundationDb();
  const now = new Date().toISOString();
  const missing = findMissingDependencies(manifest, inventory);
  const status: LocalContentStatus = missing.length === 0 ? "ready" : "invalid";
  const key = contentKey(manifest.lessonId, manifest.lessonVersion, manifest.contentRelease);

  await db.runAsync(
    `INSERT INTO local_lesson_content (content_key, lesson_id, lesson_version, content_release, status, missing_dependencies, prepared_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(content_key) DO UPDATE SET
       status = excluded.status,
       missing_dependencies = excluded.missing_dependencies,
       prepared_at = excluded.prepared_at,
       updated_at = excluded.updated_at`,
    key,
    manifest.lessonId,
    manifest.lessonVersion,
    manifest.contentRelease,
    status,
    JSON.stringify(missing),
    status === "ready" ? now : null,
    now,
  );

  return {
    lessonId: manifest.lessonId,
    lessonVersion: manifest.lessonVersion,
    contentRelease: manifest.contentRelease,
    status,
    missingDependencies: missing,
    preparedAt: status === "ready" ? now : null,
    updatedAt: now,
  };
}

export async function getLessonContentRecord(lessonId: string, lessonVersion: number, contentRelease: string): Promise<LocalContentRecord | null> {
  const db = await getFoundationDb();
  const row = await db.getFirstAsync<LocalContentRow>(
    "SELECT * FROM local_lesson_content WHERE content_key = ?",
    contentKey(lessonId, lessonVersion, contentRelease),
  );
  return row ? toRecord(row) : null;
}

/** The single boolean the Lesson Player actually gates entry on. */
export async function isLessonAvailableOffline(lessonId: string, lessonVersion: number, contentRelease: string): Promise<boolean> {
  const record = await getLessonContentRecord(lessonId, lessonVersion, contentRelease);
  return record?.status === "ready";
}
