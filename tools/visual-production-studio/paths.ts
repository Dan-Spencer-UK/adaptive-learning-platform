/**
 * CC-11.5 §7: the safe local-save boundary. Every filesystem write this
 * tool ever performs for an approved asset must go through
 * resolveApprovedAssetPath() -- it is the ONLY function permitted to turn
 * an (outputSubfolder, filename) pair into a real path, and it is
 * deliberately paranoid: a catalogue entry (or, worse, a malformed API
 * request) can never construct an arbitrary `../` filesystem path,
 * because both inputs are validated against closed allow-lists/regexes
 * BEFORE path resolution, and the resolved result is checked a second
 * time to still be a descendant of the approved root even after
 * resolution -- defense in depth, not a single check.
 */

import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { OUTPUT_SUBFOLDERS, type OutputSubfolder } from "./catalogue.ts";

/**
 * CC-11.7B fix: repo root is two levels above this file
 * (tools/visual-production-studio/paths.ts -> tools -> repo root), computed
 * via `fileURLToPath` + `dirname` rather than manually parsing
 * `new URL(".", import.meta.url).pathname`. The manual approach silently
 * broke under this repo's Vitest config (`environment: "jsdom"`): jsdom's
 * bundled WHATWG URL polyfill mishandles a Windows `file:///D:/...` URL's
 * drive letter, collapsing the resolved pathname down to a path relative
 * to the drive root (e.g. `/tools/visual-production-studio` instead of
 * `/D:/Development/.../tools/visual-production-studio`) -- every
 * REPO_ROOT-derived constant below was silently wrong under any test that
 * actually exercised a real filesystem path, undetected until CC-11.7B's
 * PDF-review generator's own test suite read real files from disk.
 * `fileURLToPath` is a Node builtin operating on the URL string directly,
 * not the jsdom-polyfilled `URL` class, so it is unaffected.
 */
function repoRoot(): string {
  const toolDir = dirname(fileURLToPath(import.meta.url));
  return resolve(toolDir, "..", "..");
}

export const REPO_ROOT = repoRoot();
export const APPROVED_ASSET_ROOT = resolve(REPO_ROOT, "apps", "mobile", "src", "assets", "instructional", "unit202");
export const STAGING_ROOT = resolve(REPO_ROOT, "tools", "visual-production-studio", "data", "staging");
export const MANIFEST_PATH = resolve(REPO_ROOT, "reports", "instructional-visuals", "premium-artwork", "unit202-artwork-manifest.json");
export const STATE_PATH = resolve(REPO_ROOT, "tools", "visual-production-studio", "data", "studio-state.json");
export const CONTACT_SHEET_PATH = resolve(REPO_ROOT, "reports", "instructional-visuals", "premium-artwork", "contact-sheet.html");

/** Strict, safe filename validation: lowercase kebab-case stem + optional -vN + one allow-listed extension. No path separators, no leading dot, no traversal sequences. */
const SAFE_FILENAME = /^[a-z0-9][a-z0-9-]*\.(png|webp|jpg|jpeg)$/;

export class UnsafePathError extends Error {}

/**
 * Resolves and validates a filename inside a governed output subfolder.
 * Throws UnsafePathError for anything that is not an exact, safe match --
 * never attempts to "sanitise" or coerce an unsafe input into a safe one.
 */
/** `assetRoot` is overridable ONLY so tests can point this at an isolated temp directory instead of the real governed tree -- production call sites never pass it. */
export function resolveApprovedAssetPath(outputSubfolder: OutputSubfolder, filename: string, assetRoot: string = APPROVED_ASSET_ROOT): string {
  if (!OUTPUT_SUBFOLDERS.includes(outputSubfolder)) {
    throw new UnsafePathError(`unknown output subfolder: ${String(outputSubfolder)}`);
  }
  if (!SAFE_FILENAME.test(filename)) {
    throw new UnsafePathError(`unsafe filename rejected: ${filename}`);
  }

  const resolved = resolve(assetRoot, outputSubfolder, filename);
  const rootWithSep = assetRoot.endsWith(sep) ? assetRoot : assetRoot + sep;
  if (!resolved.startsWith(rootWithSep)) {
    throw new UnsafePathError(`resolved path escapes the approved asset root: ${resolved}`);
  }

  return resolved;
}

/** Same paranoid discipline for the pre-approval staging area (an assetId, not a subfolder+filename, since staged files are keyed by asset while pending review). */
const SAFE_ASSET_ID = /^[a-z0-9]+(\.[a-z0-9-]+)*$/;

export function resolveStagingPath(assetId: string, extension: string, stagingRoot: string = STAGING_ROOT): string {
  if (!SAFE_ASSET_ID.test(assetId)) {
    throw new UnsafePathError(`unsafe assetId rejected: ${assetId}`);
  }
  if (!/^(png|webp|jpg|jpeg)$/.test(extension)) {
    throw new UnsafePathError(`unsafe extension rejected: ${extension}`);
  }

  const resolved = resolve(stagingRoot, `${assetId}.${extension}`);
  const rootWithSep = stagingRoot.endsWith(sep) ? stagingRoot : stagingRoot + sep;
  if (!resolved.startsWith(rootWithSep)) {
    throw new UnsafePathError(`resolved staging path escapes the staging root: ${resolved}`);
  }

  return resolved;
}
