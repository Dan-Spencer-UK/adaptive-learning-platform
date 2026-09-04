/**
 * CC-23 §15/§21; CC-24 §2 (Narrow Correction B): generic local-input
 * isolation / experiment access-guard utility. Any qualification-specific
 * blind-acquisition experiment configures ONE instance of this with its
 * own `LocalAccessGuardConfig`; no bespoke access-control code, and in
 * particular no qualification-name-branching conditional, may ever appear
 * in this file (mechanically checked, see planner.test.ts).
 *
 * Positive allowlist, default-deny (task §15): a path not matched by any
 * `AllowedLocalInput` rule is DENIED, unconditionally -- there is no
 * separate "denylist" mechanism here at all; a qualification's own
 * denylist (if it keeps one) is defence-in-depth documentation only, never
 * itself consulted by this guard.
 *
 * CC-24 §2 hardened three demonstrated weaknesses:
 *   1. `guardedReadUtf8` now performs the ACTUAL file read itself, only
 *      AFTER the path has been authorized -- a caller can no longer read
 *      a file and hand the guard content after the fact (the old
 *      `checkRead` remains for callers that already legitimately hold
 *      content from elsewhere, e.g. verifying a hash of already-fetched
 *      web content, but every REPOSITORY file read this package's own
 *      callers perform now goes through `guardedReadUtf8`).
 *   2. Canonical paths are genuinely normalized (`.`/`..` resolved, not
 *      merely backslash-swapped) BEFORE matching -- a path that starts
 *      with an allowlisted prefix but then walks back out of it via `..`
 *      segments resolves to its TRUE final location and is matched
 *      against THAT, never against the superficially-safe-looking prefix
 *      alone; an absolute path, or a relative path whose `..` segments
 *      net-escape the repository root entirely, is rejected outright.
 *   3. A rule declaring `requiredHash` can no longer return `ALLOWED`
 *      merely because no content was supplied to check -- omitted content
 *      against a hash-pinned rule is now itself a denial.
 *
 * Enforcement boundary, stated honestly: this guard controls only paths
 * that flow THROUGH it -- i.e., every read a caller performs via
 * `checkRead`/`guardedReadUtf8`. It is not process-wide sandboxing; it
 * cannot prevent code elsewhere in the process from calling
 * `node:fs` directly. Callers that need the guarantee must route every
 * repository-data read through one guard instance and contain no
 * alternative unguarded read path (verified for the Unit-202 pilot by a
 * dedicated source-scan test, never merely asserted).
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { AccessAuditRecord, AllowedLocalInput, LocalAccessGuardConfig } from "./types.ts";

/** Thrown on any non-allowlisted read attempt -- per task §13/§21, this must be a hard, unrecoverable failure: the calling experiment is invalid and must not continue. */
export class UnauthorizedLocalReadError extends Error {
  readonly canonicalPath: string;
  readonly experimentId: string;

  constructor(canonicalPath: string, experimentId: string) {
    super(`UnauthorizedLocalReadError: "${canonicalPath}" is not allowlisted for experiment "${experimentId}" -- access denied, experiment invalid, no continuation.`);
    this.name = "UnauthorizedLocalReadError";
    this.canonicalPath = canonicalPath;
    this.experimentId = experimentId;
  }
}

/** Thrown when a path matches an allowlist rule that declares a `requiredHash`, but the content actually read does not match it (or no content was supplied to check at all) -- fails safe: both cases are treated identically to no match, never a soft warning. */
export class LocalInputIntegrityError extends Error {
  readonly canonicalPath: string;
  readonly expectedHash: string;
  readonly actualHash: string | null;

  constructor(canonicalPath: string, expectedHash: string, actualHash: string | null) {
    super(
      actualHash === null
        ? `LocalInputIntegrityError: "${canonicalPath}" matched an allowlist rule requiring hash ${expectedHash}, but no content was supplied to verify against it -- an omitted-content read against a hash-pinned rule is never allowed.`
        : `LocalInputIntegrityError: "${canonicalPath}" matched an allowlist rule requiring hash ${expectedHash}, but actual content hash was ${actualHash}.`,
    );
    this.name = "LocalInputIntegrityError";
    this.canonicalPath = canonicalPath;
    this.expectedHash = expectedHash;
    this.actualHash = actualHash;
  }
}

/**
 * CC-24 §2: genuinely resolves `.`/`..` segments (never merely a
 * backslash swap) and rejects anything that is absolute or nets outside
 * the allowed root. Returns `null` for an invalid/escaping path -- the
 * caller treats `null` as an immediate, unconditional denial, before any
 * rule matching (and therefore before any filesystem access) is even
 * attempted.
 */
export function normalizeCanonicalPath(rawPath: string): string | null {
  const slashed = rawPath.replace(/\\/g, "/");
  if (slashed.startsWith("/") || slashed.startsWith("//") || /^[A-Za-z]:/.test(slashed)) return null; // absolute (POSIX, UNC, or Windows drive letter)
  const segments = slashed.split("/");
  const resolved: string[] = [];
  for (const segment of segments) {
    if (segment === "" || segment === ".") continue;
    if (segment === "..") {
      if (resolved.length === 0) return null; // nets outside the allowed root -- not merely "unsafe-looking", genuinely unresolvable within it
      resolved.pop();
      continue;
    }
    resolved.push(segment);
  }
  return resolved.join("/");
}

/** Minimal, dependency-free glob matcher: `**` matches across path separators, `*` matches within one segment. Sufficient for the small, hand-authored path rules this guard is configured with -- not a general-purpose glob library. Operates ONLY on already-normalized paths (never raw input) -- see `normalizeCanonicalPath`. */
function globToRegExp(glob: string): RegExp {
  const normalized = normalizeCanonicalPath(glob) ?? glob.replace(/\\/g, "/");
  let pattern = "";
  for (let i = 0; i < normalized.length; i++) {
    const c = normalized[i];
    if (c === "*" && normalized[i + 1] === "*") {
      pattern += ".*";
      i++;
    } else if (c === "*") {
      pattern += "[^/]*";
    } else {
      pattern += c!.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
    }
  }
  return new RegExp(`^${pattern}$`);
}

function matchRule(normalizedPath: string, rule: AllowedLocalInput): boolean {
  if (rule.matchKind === "EXACT_PATH") return normalizedPath === (normalizeCanonicalPath(rule.pathOrGlob) ?? rule.pathOrGlob);
  return globToRegExp(rule.pathOrGlob).test(normalizedPath);
}

export function hashContent(content: string | Buffer): string {
  return createHash("sha256").update(content).digest("hex");
}

/**
 * A generic, config-driven local-read guard (task §15/§21; CC-24 §2).
 * Every read a blind-acquisition experiment performs against ITS OWN
 * local repository must go through this guard before the content is
 * used -- an attempt against a non-allowlisted (or invalid/traversing)
 * path throws `UnauthorizedLocalReadError` immediately, and a hash-
 * mismatched (or hash-required-but-omitted) read against a hash-pinned
 * rule throws `LocalInputIntegrityError` immediately. Both are
 * unrecoverable: the experiment is invalid and must not continue (task
 * §13).
 */
export class LocalAccessGuard {
  private readonly auditLog: AccessAuditRecord[] = [];
  private readonly config: LocalAccessGuardConfig;
  private readonly repoRoot: string | null;

  /** `repoRoot` is required only for `guardedReadUtf8` (it performs the actual filesystem read); omit it for a guard used only via `checkRead`/`wouldAllow` against already-in-memory content. */
  constructor(config: LocalAccessGuardConfig, repoRoot?: string) {
    this.config = config;
    this.repoRoot = repoRoot ?? null;
  }

  /** Full, ordered audit trail of every read attempted so far (via `checkRead` or `guardedReadUtf8`) -- required fields per task §13's access-audit contract: canonical path, content hash, reason, matched allowlist rule, outcome. */
  getAuditLog(): readonly AccessAuditRecord[] {
    return this.auditLog;
  }

  /** True only if every recorded attempt so far was ALLOWED -- a single DENIED entry invalidates the whole run (task §13/§2). */
  allReadsAllowed(): boolean {
    return this.auditLog.every((r) => r.outcome === "ALLOWED");
  }

  private recordDenied(canonicalPath: string, reason: string, matchedRule: string | null, contentHash: string | null): AccessAuditRecord {
    const denied: AccessAuditRecord = { canonicalPath, contentHash, reason, matchedRule, outcome: "DENIED", recordedAt: new Date().toISOString() };
    this.auditLog.push(denied);
    return denied;
  }

  private recordAllowed(canonicalPath: string, reason: string, matchedRule: string, contentHash: string | null): AccessAuditRecord {
    const allowed: AccessAuditRecord = { canonicalPath, contentHash, reason, matchedRule, outcome: "ALLOWED", recordedAt: new Date().toISOString() };
    this.auditLog.push(allowed);
    return allowed;
  }

  /**
   * Verifies a path is authorized for content the CALLER already holds
   * (e.g. already-fetched web content being hash-checked, or a caller
   * migrating from the pre-CC-24 pattern of reading first). Prefer
   * `guardedReadUtf8` for any REPOSITORY file read -- it enforces
   * authorization strictly before the read happens; this method cannot,
   * by construction, since the content already exists by the time it is
   * called.
   */
  checkRead(canonicalPath: string, reason: string, content?: string | Buffer): AccessAuditRecord {
    const normalized = normalizeCanonicalPath(canonicalPath);
    const contentHash = content === undefined ? null : hashContent(content);

    if (normalized === null) {
      this.recordDenied(canonicalPath, reason, null, contentHash);
      throw new UnauthorizedLocalReadError(canonicalPath, this.config.experimentId);
    }

    const matched = this.config.allowedInputs.find((rule) => matchRule(normalized, rule));
    if (!matched) {
      this.recordDenied(normalized, reason, null, contentHash);
      throw new UnauthorizedLocalReadError(normalized, this.config.experimentId);
    }

    if (matched.requiredHash) {
      // CC-24 §2 fix: omitted content against a hash-pinned rule is a denial, never a pass-through.
      if (content === undefined || contentHash !== matched.requiredHash) {
        this.recordDenied(normalized, reason, matched.rule, contentHash);
        throw new LocalInputIntegrityError(normalized, matched.requiredHash, contentHash);
      }
    }

    return this.recordAllowed(normalized, reason, matched.rule, contentHash);
  }

  /**
   * CC-24 §2: the ONE guarded read helper repository-data callers should
   * use. Authorization (path normalization + rule matching) happens
   * FIRST, with zero filesystem access; the actual `readFileSync` call
   * happens ONLY after a path is confirmed authorized, and a
   * `requiredHash` rule's content is verified before the caller ever
   * receives it. Requires `repoRoot` to have been supplied to the
   * constructor.
   */
  guardedReadUtf8(canonicalPath: string, reason: string): { content: string; audit: AccessAuditRecord } {
    if (this.repoRoot === null) {
      throw new Error("LocalAccessGuard.guardedReadUtf8: this guard was constructed without repoRoot -- cannot perform a real filesystem read.");
    }
    const normalized = normalizeCanonicalPath(canonicalPath);
    if (normalized === null) {
      this.recordDenied(canonicalPath, reason, null, null);
      throw new UnauthorizedLocalReadError(canonicalPath, this.config.experimentId);
    }

    const matched = this.config.allowedInputs.find((rule) => matchRule(normalized, rule));
    if (!matched) {
      this.recordDenied(normalized, reason, null, null);
      throw new UnauthorizedLocalReadError(normalized, this.config.experimentId);
    }

    // Path is authorized -- ONLY NOW does this guard touch the filesystem.
    const absolutePath = path.join(this.repoRoot, normalized);
    const content = readFileSync(absolutePath, "utf-8");
    const contentHash = hashContent(content);

    if (matched.requiredHash && contentHash !== matched.requiredHash) {
      this.recordDenied(normalized, reason, matched.rule, contentHash);
      throw new LocalInputIntegrityError(normalized, matched.requiredHash, contentHash);
    }

    const audit = this.recordAllowed(normalized, reason, matched.rule, contentHash);
    return { content, audit };
  }

  /** Non-throwing check -- for callers that want to know in advance whether a path would be allowed, without performing (or auditing) a real read. */
  wouldAllow(canonicalPath: string): boolean {
    const normalized = normalizeCanonicalPath(canonicalPath);
    if (normalized === null) return false;
    return this.config.allowedInputs.some((rule) => matchRule(normalized, rule));
  }
}
