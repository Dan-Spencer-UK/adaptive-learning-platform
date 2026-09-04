/**
 * CC-23 §15/§21: generic local-input isolation / experiment access-guard
 * utility. Any qualification-specific blind-acquisition experiment
 * configures ONE instance of this with its own `LocalAccessGuardConfig`;
 * no bespoke access-control code, and in particular no qualification-
 * name-branching conditional, may ever appear in this file (mechanically
 * checked, see planner.test.ts).
 *
 * Positive allowlist, default-deny (task §15): a path not matched by any
 * `AllowedLocalInput` rule is DENIED, unconditionally -- there is no
 * separate "denylist" mechanism here at all; a qualification's own
 * denylist (if it keeps one) is defence-in-depth documentation only, never
 * itself consulted by this guard.
 */

import { createHash } from "node:crypto";
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

/** Thrown when a path matches an allowlist rule that declares a `requiredHash`, but the content actually read does not match it -- fails safe: a hash mismatch is treated identically to no match at all, never a soft warning. */
export class LocalInputIntegrityError extends Error {
  readonly canonicalPath: string;
  readonly expectedHash: string;
  readonly actualHash: string;

  constructor(canonicalPath: string, expectedHash: string, actualHash: string) {
    super(`LocalInputIntegrityError: "${canonicalPath}" matched an allowlist rule requiring hash ${expectedHash}, but actual content hash was ${actualHash}.`);
    this.name = "LocalInputIntegrityError";
    this.canonicalPath = canonicalPath;
    this.expectedHash = expectedHash;
    this.actualHash = actualHash;
  }
}

function normalizePath(p: string): string {
  return p.replace(/\\/g, "/").replace(/^\.\//, "");
}

/** Minimal, dependency-free glob matcher: `**` matches across path separators, `*` matches within one segment. Sufficient for the small, hand-authored path rules this guard is configured with -- not a general-purpose glob library. */
function globToRegExp(glob: string): RegExp {
  const normalized = normalizePath(glob);
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

function matchRule(canonicalPath: string, rule: AllowedLocalInput): boolean {
  const normalized = normalizePath(canonicalPath);
  if (rule.matchKind === "EXACT_PATH") return normalized === normalizePath(rule.pathOrGlob);
  return globToRegExp(rule.pathOrGlob).test(normalized);
}

export function hashContent(content: string | Buffer): string {
  return createHash("sha256").update(content).digest("hex");
}

/**
 * A generic, config-driven local-read guard (task §15/§21). Every read a
 * blind-acquisition experiment performs against ITS OWN local repository
 * must go through `checkRead` before the content is used -- an attempt
 * against a non-allowlisted path throws `UnauthorizedLocalReadError`
 * immediately, and a hash-mismatched read against a hash-pinned rule
 * throws `LocalInputIntegrityError` immediately. Both are unrecoverable:
 * the experiment is invalid and must not continue (task §13).
 */
export class LocalAccessGuard {
  private readonly auditLog: AccessAuditRecord[] = [];
  private readonly config: LocalAccessGuardConfig;

  constructor(config: LocalAccessGuardConfig) {
    this.config = config;
  }

  /** Full, ordered audit trail of every `checkRead` call made so far -- required fields per task §13's access-audit contract: canonical path, content hash, reason, matched allowlist rule. */
  getAuditLog(): readonly AccessAuditRecord[] {
    return this.auditLog;
  }

  checkRead(canonicalPath: string, reason: string, content?: string | Buffer): AccessAuditRecord {
    const normalized = normalizePath(canonicalPath);
    const matched = this.config.allowedInputs.find((rule) => matchRule(normalized, rule));
    const contentHash = content === undefined ? null : hashContent(content);

    if (!matched) {
      const denied: AccessAuditRecord = { canonicalPath: normalized, contentHash, reason, matchedRule: null, outcome: "DENIED", recordedAt: new Date().toISOString() };
      this.auditLog.push(denied);
      throw new UnauthorizedLocalReadError(normalized, this.config.experimentId);
    }

    if (matched.requiredHash && content !== undefined && contentHash !== matched.requiredHash) {
      const denied: AccessAuditRecord = { canonicalPath: normalized, contentHash, reason, matchedRule: matched.rule, outcome: "DENIED", recordedAt: new Date().toISOString() };
      this.auditLog.push(denied);
      throw new LocalInputIntegrityError(normalized, matched.requiredHash, contentHash!);
    }

    const allowed: AccessAuditRecord = { canonicalPath: normalized, contentHash, reason, matchedRule: matched.rule, outcome: "ALLOWED", recordedAt: new Date().toISOString() };
    this.auditLog.push(allowed);
    return allowed;
  }

  /** Non-throwing check -- for callers that want to know in advance whether a path would be allowed, without performing (or auditing) a real read. */
  wouldAllow(canonicalPath: string): boolean {
    return this.config.allowedInputs.some((rule) => matchRule(normalizePath(canonicalPath), rule));
  }
}
