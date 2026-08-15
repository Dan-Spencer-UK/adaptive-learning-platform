#!/usr/bin/env node
/**
 * Governed npm-audit gate (CC-04N-S, hardened in CC-04N-S1). Runs the real
 * `npm audit --json` data collection and fails on ANY HIGH/CRITICAL
 * finding by default, except for the exact advisory/package/version/
 * dependency-path tuples explicitly listed in npm-audit-exceptions.json --
 * and even those only while the exception is `status: "accepted"` (NORMAL
 * mode -- see below), unexpired, and the installed version/dependency
 * path still match exactly.
 *
 * npm's audit graph fans a single root-cause vulnerability out across
 * every ancestor package that transitively depends on it (confirmed
 * empirically 2026-08-15: 15 "high" entries in this repository's tree,
 * all tracing to the same two image-size advisories). Those ancestor
 * entries' `via` arrays contain only strings (other package names), never
 * advisory objects -- so this gate only requires an allowlist entry per
 * REAL advisory (an object with a GHSA url), not per fanout package name,
 * which would be fragile and miss the actual point. See the exported pure
 * functions below (used directly by check-npm-audit.test.ts) for the
 * exact logic; this file's bottom section is the CLI wrapper.
 *
 * Two modes (CC-04N-S1):
 *  - NORMAL mode (default; what CI/`npm run security:audit` always uses):
 *    only `status: "accepted"` exceptions may suppress a finding. A
 *    `status: "proposed"` exception FAILs normal mode with
 *    EXCEPTION_NOT_ACCEPTED -- a proposed-but-not-yet-approved exception
 *    must never make mandatory CI green.
 *  - REVIEW mode (`--allow-proposed` / `npm run security:audit:review`,
 *    never used by CI): proves a still-`proposed` exception WOULD work
 *    once accepted. Every other protection (unexpected HIGH/CRITICAL,
 *    expiry, version mismatch, dependency-path mismatch, stale exceptions)
 *    remains fully active in review mode -- only the accepted-vs-proposed
 *    gate itself is relaxed.
 *
 * This script deliberately does NOT lower the audit threshold globally,
 * does not skip the audit, and does not use `continue-on-error`/`|| true`
 * anywhere in CI -- see .github/workflows/ci.yml.
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const EXCEPTIONS_PATH = path.join(__dirname, "npm-audit-exceptions.json");

/** @typedef {{url: string, title?: string, severity: string, range?: string, package: string}} RealAdvisory */

export function loadExceptions(exceptionsPath = EXCEPTIONS_PATH) {
  const data = JSON.parse(readFileSync(exceptionsPath, "utf8"));
  return data.exceptions;
}

/**
 * Extracts every "real" advisory object (an object with a GHSA url --
 * i.e. an actual, independently-reportable vulnerability) from a raw
 * `npm audit --json` result. Ancestor packages that are merely "depends
 * on vulnerable versions of X" have `via` arrays containing only strings
 * and contribute nothing here.
 * @returns {RealAdvisory[]}
 */
export function extractRealAdvisories(auditJson) {
  const vulnerabilities = auditJson.vulnerabilities || {};
  const advisories = [];
  const seenUrls = new Set();

  for (const [pkgName, finding] of Object.entries(vulnerabilities)) {
    for (const via of finding.via || []) {
      if (typeof via !== "object" || via === null || !via.url) continue;
      if (seenUrls.has(via.url)) continue;
      seenUrls.add(via.url);
      advisories.push({
        url: via.url,
        title: via.title,
        severity: via.severity,
        range: via.range,
        package: via.name || pkgName,
      });
    }
  }

  return advisories;
}

function findException(advisory, exceptions) {
  return exceptions.find((e) => e.advisoryUrl === advisory.url);
}

function isExpired(exception, now) {
  return new Date(exception.expiresOn).getTime() < now.getTime();
}

/**
 * Walks a `npm ls <pkg> --json --all` (or whole-tree `npm ls --json --all`)
 * dependency tree and returns every distinct path from the repository root
 * to an occurrence of `targetPackageName`, as canonical strings in the
 * same "pkg@version > pkg@version > ... > target@version" shape the
 * exception records themselves use -- built from npm's own structural
 * JSON (`dependencies`/`version`/`resolved`), never by parsing npm's
 * human-readable tree-drawing text output.
 *
 * Local npm workspace members (detected structurally via `resolved`
 * starting with "file:", not by hard-coding a workspace name like
 * "mobile") are skipped as path segments -- they are not real published
 * dependencies and the exception records never mention them.
 */
export function findAllDependencyPaths(lsTreeJson, targetPackageName) {
  const paths = [];

  function walk(node, prefix) {
    const deps = node.dependencies || {};
    for (const [depName, depNode] of Object.entries(deps)) {
      const isWorkspaceLocal =
        typeof depNode.resolved === "string" && depNode.resolved.startsWith("file:");
      const nextPrefix = isWorkspaceLocal ? prefix : [...prefix, `${depName}@${depNode.version}`];

      if (depName === targetPackageName && !isWorkspaceLocal) {
        paths.push(nextPrefix.join(" > "));
      }

      walk(depNode, nextPrefix);
    }
  }

  walk(lsTreeJson, []);
  return paths;
}

/**
 * Pure evaluation function: given a parsed `npm audit --json` payload, the
 * exception allowlist, and (optionally) independently-verified installed
 * versions/dependency paths, decides PASS/FAIL and explains exactly why.
 * No process spawning, no filesystem access -- fully unit-testable with
 * fixtures.
 *
 * @param {object} options
 * @param {object} options.auditJson Parsed `npm audit --json` output.
 * @param {object[]} options.exceptions The loaded exception allowlist.
 * @param {Record<string, string>} [options.installedVersions] Package name -> independently-verified installed version (e.g. via `npm ls`).
 * @param {Record<string, string[]>} [options.dependencyPaths] Package name -> every actual current dependency path to it (via findAllDependencyPaths).
 * @param {boolean} [options.allowProposed] REVIEW mode switch. Defaults to
 *   false (NORMAL mode): only `status: "accepted"` exceptions may cover a
 *   finding. When true, `status: "proposed"` exceptions are also allowed
 *   to cover a finding, so a not-yet-approved exception can be proven
 *   correct ahead of Product Owner / Project Architect acceptance -- every
 *   other check (expiry/version/path/unexpected-finding/stale) still runs.
 * @param {Date} [options.now]
 */
export function evaluate({
  auditJson,
  exceptions,
  installedVersions = {},
  dependencyPaths = {},
  allowProposed = false,
  now = new Date(),
}) {
  const advisories = extractRealAdvisories(auditJson);
  const highOrCritical = advisories.filter(
    (a) => a.severity === "high" || a.severity === "critical",
  );

  const failures = [];
  const covered = [];

  for (const advisory of highOrCritical) {
    const exception = findException(advisory, exceptions);

    if (!exception) {
      failures.push({ reason: "UNEXPECTED_HIGH_OR_CRITICAL", advisory });
      continue;
    }

    if (exception.status !== "proposed" && exception.status !== "accepted") {
      failures.push({ reason: "EXCEPTION_NOT_ACTIVE", advisory, exception });
      continue;
    }

    if (exception.status === "proposed" && !allowProposed) {
      failures.push({ reason: "EXCEPTION_NOT_ACCEPTED", advisory, exception });
      continue;
    }

    if (isExpired(exception, now)) {
      failures.push({ reason: "EXCEPTION_EXPIRED", advisory, exception });
      continue;
    }

    if (advisory.severity !== exception.severity) {
      failures.push({ reason: "SEVERITY_MISMATCH", advisory, exception });
      continue;
    }

    const installedVersion = installedVersions[exception.package];
    if (installedVersion && installedVersion !== exception.version) {
      failures.push({ reason: "VERSION_MISMATCH", advisory, exception, installedVersion });
      continue;
    }

    // Dependency-path validation (CC-04N-S1): the gate independently
    // derives the CURRENT actual path(s) from real npm dependency-tree
    // data (see findAllDependencyPaths / main()'s `dependencyPaths`
    // argument) rather than trusting the exception JSON's own
    // `dependencyPath` field as fact. An exception only covers the exact
    // governed path it names; drift to a different path, or the same
    // package becoming reachable via an ADDITIONAL path, both fail.
    const actualPaths = dependencyPaths[exception.package];
    if (exception.dependencyPath && actualPaths) {
      if (!actualPaths.includes(exception.dependencyPath)) {
        failures.push({ reason: "DEPENDENCY_PATH_MISMATCH", advisory, exception, actualPaths });
        continue;
      }
      const extraPaths = actualPaths.filter((p) => p !== exception.dependencyPath);
      if (extraPaths.length > 0) {
        failures.push({
          reason: "UNEXPECTED_ADDITIONAL_DEPENDENCY_PATH",
          advisory,
          exception,
          extraPaths,
        });
        continue;
      }
    }

    covered.push({ advisory, exception });
  }

  // Stale-exception detection: an exception whose advisory no longer
  // appears anywhere in the current audit at all (the package was
  // upgraded/removed, or the advisory was withdrawn) must be flagged for
  // removal, not silently left in the allowlist forever.
  const currentAdvisoryUrls = new Set(advisories.map((a) => a.url));
  const staleExceptions = exceptions.filter((e) => !currentAdvisoryUrls.has(e.advisoryUrl));

  return {
    pass: failures.length === 0,
    failures,
    covered,
    staleExceptions,
    totalHighOrCritical: highOrCritical.length,
  };
}

function formatFailure(f) {
  switch (f.reason) {
    case "UNEXPECTED_HIGH_OR_CRITICAL":
      return `UNEXPECTED ${f.advisory.severity.toUpperCase()} finding with no exception: ${f.advisory.package} -- ${f.advisory.title} (${f.advisory.url})`;
    case "EXCEPTION_NOT_ACTIVE":
      return `Exception ${f.exception.id} has status "${f.exception.status}" (not proposed/accepted) -- treating as unexcepted: ${f.advisory.url}`;
    case "EXCEPTION_NOT_ACCEPTED":
      return `Exception ${f.exception.id} has status "proposed" -- NORMAL mode only permits "accepted" exceptions. Run "npm run security:audit:review" to test a proposed exception, or have Product Owner / Project Architect accept it: ${f.advisory.url}`;
    case "EXCEPTION_EXPIRED":
      return `Exception ${f.exception.id} EXPIRED on ${f.exception.expiresOn} -- re-review required: ${f.advisory.url}`;
    case "SEVERITY_MISMATCH":
      return `Exception ${f.exception.id} is scoped to severity "${f.exception.severity}" but audit now reports "${f.advisory.severity}": ${f.advisory.url}`;
    case "VERSION_MISMATCH":
      return `Exception ${f.exception.id} is scoped to ${f.exception.package}@${f.exception.version} but installed version is ${f.installedVersion}: ${f.advisory.url}`;
    case "DEPENDENCY_PATH_MISMATCH":
      return `Exception ${f.exception.id}'s governed path "${f.exception.dependencyPath}" was not found among the actual current path(s) for ${f.exception.package} (${JSON.stringify(f.actualPaths)}): ${f.advisory.url}`;
    case "UNEXPECTED_ADDITIONAL_DEPENDENCY_PATH":
      return `Exception ${f.exception.id}'s package ${f.exception.package} is now ALSO reachable via unexpected path(s) beyond the governed one: ${JSON.stringify(f.extraPaths)}: ${f.advisory.url}`;
    default:
      return `Unknown failure: ${JSON.stringify(f)}`;
  }
}

// `npm` is a `.cmd` shim on Windows, which node:child_process cannot spawn
// directly without a shell (EINVAL). `execFileSync` with `shell: true` and
// an args ARRAY triggers Node's DEP0190 warning because array elements
// are concatenated, not individually escaped, when a shell is involved.
// Every argument passed to `runNpm` below is a fixed internal literal or an
// npm package name from this repository's own trusted exceptions file
// (never external/user input, and npm package names cannot contain shell
// metacharacters by npm's own naming rules), so building one pre-joined
// command string and running it via `execSync` is safe here and avoids
// both problems cleanly.
function runNpm(args) {
  return execSync(`npm ${args.join(" ")}`, {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 32,
  }).toString();
}

function runNpmAudit() {
  // `npm audit --json` exits non-zero whenever it finds ANY vulnerability
  // (by design -- this is how a plain `npm audit` CI step fails today).
  // It still prints a complete, valid JSON report to stdout in that case,
  // so the real data collection happens regardless of exit code; only the
  // gate logic below decides pass/fail, never npm's own exit code.
  try {
    return JSON.parse(runNpm(["audit", "--json"]));
  } catch (err) {
    if (err.stdout) {
      return JSON.parse(err.stdout.toString());
    }
    throw err;
  }
}

// ---- CLI wrapper (not exercised by unit tests) ----
async function main() {
  // REVIEW mode is opt-in ONLY via this explicit flag -- there is no
  // environment variable or default that can accidentally enable it, so
  // CI (which never passes this flag) always runs in NORMAL mode.
  const allowProposed = process.argv.includes("--allow-proposed");

  const auditJson = runNpmAudit();
  const exceptions = loadExceptions();

  const installedVersions = {};
  const dependencyPaths = {};
  for (const pkg of new Set(exceptions.map((e) => e.package))) {
    let lsJson;
    try {
      lsJson = JSON.parse(runNpm(["ls", pkg, "--json", "--all"]));
    } catch (err) {
      // `npm ls` exits non-zero on peer/extraneous issues even when it
      // still prints useful JSON to stdout; fall back to parsing stdout
      // from the error if present, otherwise leave unset (VERSION_MISMATCH
      // / DEPENDENCY_PATH_MISMATCH logic simply won't run for this
      // package, which is safe -- absence of a cross-check is not treated
      // as a pass).
      if (err.stdout) {
        try {
          lsJson = JSON.parse(err.stdout.toString());
        } catch {
          // ignore -- leave unset
        }
      }
    }
    if (lsJson) {
      installedVersions[pkg] = findInstalledVersion(lsJson, pkg);
      dependencyPaths[pkg] = findAllDependencyPaths(lsJson, pkg);
    }
  }

  const result = evaluate({ auditJson, exceptions, installedVersions, dependencyPaths, allowProposed });

  console.log(`npm audit gate (${allowProposed ? "REVIEW" : "NORMAL"} mode): ${result.totalHighOrCritical} real HIGH/CRITICAL advisory URL(s) found.`);
  for (const { advisory, exception } of result.covered) {
    console.log(`  COVERED by ${exception.id} (expires ${exception.expiresOn}, status: ${exception.status}): ${advisory.package} -- ${advisory.title}`);
  }
  for (const f of result.failures) {
    console.error(`  FAIL: ${formatFailure(f)}`);
  }
  for (const stale of result.staleExceptions) {
    console.warn(`  WARNING: exception ${stale.id} (${stale.package} ${stale.advisory}) no longer matches any current audit finding -- consider removing it as stale.`);
  }

  if (!result.pass) {
    console.error(`\nnpm audit gate FAILED (${allowProposed ? "REVIEW" : "NORMAL"} mode).`);
    process.exit(1);
  }

  if (result.staleExceptions.length > 0) {
    console.error("\nnpm audit gate FAILED: stale exception(s) present (see warnings above). Remove them from npm-audit-exceptions.json.");
    process.exit(1);
  }

  console.log(
    `\nnpm audit gate PASSED (${allowProposed ? "REVIEW" : "NORMAL"} mode) -- all HIGH/CRITICAL findings are exactly covered by ${allowProposed ? "active (proposed or accepted)" : "ACCEPTED"}, unexpired, version- and path-matched exceptions.`,
  );
  if (allowProposed) {
    console.log(
      "REVIEW mode only proves a proposed exception would work if accepted -- it does NOT make CI green. CI always runs NORMAL mode.",
    );
  }
}

function findInstalledVersion(lsJson, pkgName) {
  // Walk the (possibly deep) npm ls dependency tree for the first
  // installed version of pkgName.
  const stack = [lsJson];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) continue;
    const deps = node.dependencies || {};
    if (deps[pkgName]?.version) return deps[pkgName].version;
    for (const dep of Object.values(deps)) stack.push(dep);
  }
  return undefined;
}

const isMainModule = process.argv[1] && import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`;
if (isMainModule || process.argv[1]?.endsWith("check-npm-audit.mjs")) {
  main().catch((err) => {
    console.error("npm audit gate crashed:", err);
    process.exit(1);
  });
}
