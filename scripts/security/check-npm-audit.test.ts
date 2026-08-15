/**
 * Fixture-based unit tests for the npm-audit exception gate
 * (CC-04N-S, hardened in CC-04N-S1). Deliberately deterministic -- no
 * live npm/network calls -- per the task's own instruction to prefer
 * fixtures over live advisory responses.
 */
import { describe, expect, it } from "vitest";

import { evaluate, extractRealAdvisories, findAllDependencyPaths } from "./check-npm-audit.mjs";

const IMAGE_SIZE_ADVISORY_1 = {
  title: "image-size: ICNS parser allows denial of service through an infinite loop",
  url: "https://github.com/advisories/GHSA-w3rx-r6r6-pgpr",
  severity: "high",
  range: "<=2.0.2",
  name: "image-size",
};

const IMAGE_SIZE_ADVISORY_2 = {
  title: "image-size: JXL and HEIF parsers allow denial of service through infinite loops",
  url: "https://github.com/advisories/GHSA-5p2g-fcmc-qvqq",
  severity: "high",
  range: "<=2.0.2",
  name: "image-size",
};

const GOVERNED_PATH = "expo@57.0.13 > @expo/metro@56.0.0 > metro@0.84.4 > image-size@1.2.1";

/** Mimics the real, empirically-captured shape: a root advisory-bearing
 * finding plus several pure "depends on vulnerable versions of X" fanout
 * entries whose `via` arrays contain only strings. */
function realWorldAuditFixture() {
  return {
    vulnerabilities: {
      "image-size": {
        severity: "high",
        via: [IMAGE_SIZE_ADVISORY_1, IMAGE_SIZE_ADVISORY_2],
      },
      metro: {
        severity: "high",
        via: ["image-size", "metro-config", "metro-transform-worker"],
      },
      "@expo/metro": {
        severity: "high",
        via: ["metro", "metro-config", "metro-transform-worker"],
      },
      expo: {
        severity: "high",
        via: ["@expo/cli", "@expo/config", "@expo/metro", "@expo/metro-config"],
      },
      uuid: {
        severity: "moderate",
        via: [
          {
            title: "Missing buffer bounds check in v3/v5/v6 when buf is provided",
            url: "https://github.com/advisories/GHSA-w5hq-g745-h8pq",
            severity: "moderate",
            range: "<11.1.1",
            name: "uuid",
          },
        ],
      },
    },
  };
}

/** Mimics the real, empirically-captured `npm ls image-size --json --all`
 * shape (root -> local workspace member "mobile", resolved as "file:...",
 * skipped as a path segment -> expo -> @expo/metro -> metro -> image-size). */
function realWorldLsTreeFixture() {
  return {
    name: "adaptive-learning-platform",
    version: "0.1.0",
    dependencies: {
      mobile: {
        version: "0.1.0",
        resolved: "file:../apps/mobile",
        dependencies: {
          expo: {
            version: "57.0.13",
            resolved: "https://registry.npmjs.org/expo/-/expo-57.0.13.tgz",
            dependencies: {
              "@expo/metro": {
                version: "56.0.0",
                resolved: "https://registry.npmjs.org/@expo/metro/-/metro-56.0.0.tgz",
                dependencies: {
                  metro: {
                    version: "0.84.4",
                    resolved: "https://registry.npmjs.org/metro/-/metro-0.84.4.tgz",
                    dependencies: {
                      "image-size": {
                        version: "1.2.1",
                        resolved: "https://registry.npmjs.org/image-size/-/image-size-1.2.1.tgz",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

/** Baseline "everything correct and accepted" exception fixture -- the
 * happy-path default used by tests that exercise a DIFFERENT failure mode
 * (version/expiry/path/etc), so each test isolates exactly one condition
 * rather than also tripping the accepted-vs-proposed check. */
function acceptedExceptions() {
  return [
    {
      id: "SEC-EXC-001",
      package: "image-size",
      version: "1.2.1",
      severity: "high",
      advisory: "GHSA-w3rx-r6r6-pgpr",
      advisoryUrl: "https://github.com/advisories/GHSA-w3rx-r6r6-pgpr",
      dependencyPath: GOVERNED_PATH,
      status: "accepted",
      expiresOn: "2099-01-01",
    },
    {
      id: "SEC-EXC-002",
      package: "image-size",
      version: "1.2.1",
      severity: "high",
      advisory: "GHSA-5p2g-fcmc-qvqq",
      advisoryUrl: "https://github.com/advisories/GHSA-5p2g-fcmc-qvqq",
      dependencyPath: GOVERNED_PATH,
      status: "accepted",
      expiresOn: "2099-01-01",
    },
  ];
}

/** The real, current repository state: identical to acceptedExceptions()
 * except status: "proposed" -- matches scripts/security/npm-audit-exceptions.json. */
function proposedExceptions() {
  return acceptedExceptions().map((e) => ({ ...e, status: "proposed" }));
}

const GOVERNED_DEPENDENCY_PATHS = { "image-size": [GOVERNED_PATH] };

describe("extractRealAdvisories", () => {
  it("extracts only advisory objects, deduplicated by url, ignoring pure fanout string references", () => {
    const advisories = extractRealAdvisories(realWorldAuditFixture());
    const urls = advisories.map((a) => a.url).sort();

    expect(urls).toEqual(
      [
        IMAGE_SIZE_ADVISORY_1.url,
        IMAGE_SIZE_ADVISORY_2.url,
        "https://github.com/advisories/GHSA-w5hq-g745-h8pq",
      ].sort(),
    );
  });
});

describe("findAllDependencyPaths", () => {
  it("derives the exact governed path from real npm ls --json --all structure, skipping the local workspace member", () => {
    const paths = findAllDependencyPaths(realWorldLsTreeFixture(), "image-size");
    expect(paths).toEqual([GOVERNED_PATH]);
  });

  it("finds multiple distinct paths when the target package is reachable more than one way", () => {
    const tree = {
      dependencies: {
        mobile: {
          version: "0.1.0",
          resolved: "file:../apps/mobile",
          dependencies: {
            expo: {
              version: "57.0.13",
              resolved: "https://registry.npmjs.org/expo/-/expo-57.0.13.tgz",
              dependencies: {
                metro: {
                  version: "0.84.4",
                  resolved: "https://registry.npmjs.org/metro/-/metro-0.84.4.tgz",
                  dependencies: {
                    "image-size": { version: "1.2.1", resolved: "https://registry.npmjs.org/image-size/-/image-size-1.2.1.tgz" },
                  },
                },
              },
            },
            "react-native": {
              version: "0.86.2",
              resolved: "https://registry.npmjs.org/react-native/-/react-native-0.86.2.tgz",
              dependencies: {
                "metro-config": {
                  version: "0.84.4",
                  resolved: "https://registry.npmjs.org/metro-config/-/metro-config-0.84.4.tgz",
                  dependencies: {
                    "image-size": { version: "1.2.1", resolved: "https://registry.npmjs.org/image-size/-/image-size-1.2.1.tgz" },
                  },
                },
              },
            },
          },
        },
      },
    };

    const paths = findAllDependencyPaths(tree, "image-size").sort();
    expect(paths).toEqual(
      [
        "expo@57.0.13 > metro@0.84.4 > image-size@1.2.1",
        "react-native@0.86.2 > metro-config@0.84.4 > image-size@1.2.1",
      ].sort(),
    );
  });
});

describe("evaluate", () => {
  // 1 / A. accepted + exact advisory/version/path -> PASS
  it("1: PASSes when every real HIGH/CRITICAL advisory is covered by an ACCEPTED, unexpired, version- and path-matched exception", () => {
    const result = evaluate({
      auditJson: realWorldAuditFixture(),
      exceptions: acceptedExceptions(),
      installedVersions: { "image-size": "1.2.1" },
      dependencyPaths: GOVERNED_DEPENDENCY_PATHS,
      now: new Date("2026-08-15"),
    });

    expect(result.pass).toBe(true);
    expect(result.failures).toEqual([]);
    expect(result.covered).toHaveLength(2);
    expect(result.staleExceptions).toEqual([]);
    // The moderate uuid finding is correctly excluded from the HIGH/CRITICAL count.
    expect(result.totalHighOrCritical).toBe(2);
  });

  // 2. proposed + normal mode -> FAIL
  it("2: FAILs in NORMAL mode when the covering exception is only 'proposed', not 'accepted'", () => {
    const result = evaluate({
      auditJson: realWorldAuditFixture(),
      exceptions: proposedExceptions(),
      installedVersions: { "image-size": "1.2.1" },
      dependencyPaths: GOVERNED_DEPENDENCY_PATHS,
      allowProposed: false,
      now: new Date("2026-08-15"),
    });

    expect(result.pass).toBe(false);
    expect(result.failures).toHaveLength(2);
    expect(result.failures.every((f) => f.reason === "EXCEPTION_NOT_ACCEPTED")).toBe(true);
  });

  // 3. proposed + explicit review mode -> PASS
  it("3: PASSes in REVIEW mode (allowProposed: true) for the same still-proposed exception, proving it would work once accepted", () => {
    const result = evaluate({
      auditJson: realWorldAuditFixture(),
      exceptions: proposedExceptions(),
      installedVersions: { "image-size": "1.2.1" },
      dependencyPaths: GOVERNED_DEPENDENCY_PATHS,
      allowProposed: true,
      now: new Date("2026-08-15"),
    });

    expect(result.pass).toBe(true);
    expect(result.covered).toHaveLength(2);
  });

  // 4. an unexpected fake/new HIGH finding causes FAIL
  it("4: FAILs when a new, unexcepted HIGH advisory appears alongside the known one", () => {
    const audit = realWorldAuditFixture();
    (audit.vulnerabilities as Record<string, unknown>)["left-pad"] = {
      severity: "high",
      via: [
        {
          title: "left-pad: hypothetical new vulnerability",
          url: "https://github.com/advisories/GHSA-fake0-0000-0000",
          severity: "high",
          range: "*",
          name: "left-pad",
        },
      ],
    };

    const result = evaluate({
      auditJson: audit,
      exceptions: acceptedExceptions(),
      installedVersions: { "image-size": "1.2.1" },
      dependencyPaths: GOVERNED_DEPENDENCY_PATHS,
      now: new Date("2026-08-15"),
    });

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(
      expect.objectContaining({ reason: "UNEXPECTED_HIGH_OR_CRITICAL" }),
    );
    expect(result.failures.find((f) => f.reason === "UNEXPECTED_HIGH_OR_CRITICAL")?.advisory.url).toBe(
      "https://github.com/advisories/GHSA-fake0-0000-0000",
    );
  });

  // 5. an unexpected CRITICAL causes FAIL
  it("5: FAILs when a new, unexcepted CRITICAL advisory appears", () => {
    const audit = realWorldAuditFixture();
    (audit.vulnerabilities as Record<string, unknown>)["some-critical-pkg"] = {
      severity: "critical",
      via: [
        {
          title: "some-critical-pkg: hypothetical critical RCE",
          url: "https://github.com/advisories/GHSA-crit0-0000-0000",
          severity: "critical",
          range: "*",
          name: "some-critical-pkg",
        },
      ],
    };

    const result = evaluate({
      auditJson: audit,
      exceptions: acceptedExceptions(),
      installedVersions: { "image-size": "1.2.1" },
      dependencyPaths: GOVERNED_DEPENDENCY_PATHS,
      now: new Date("2026-08-15"),
    });

    expect(result.pass).toBe(false);
    expect(
      result.failures.some(
        (f) => f.reason === "UNEXPECTED_HIGH_OR_CRITICAL" && f.advisory.severity === "critical",
      ),
    ).toBe(true);
  });

  // 6. expired exception causes FAIL
  it("6: FAILs when the covering (accepted) exception has expired, even though advisory/version/path otherwise match exactly", () => {
    const expiredExceptions = acceptedExceptions().map((e) => ({ ...e, expiresOn: "2026-01-01" }));

    const result = evaluate({
      auditJson: realWorldAuditFixture(),
      exceptions: expiredExceptions,
      installedVersions: { "image-size": "1.2.1" },
      dependencyPaths: GOVERNED_DEPENDENCY_PATHS,
      now: new Date("2026-08-15"),
    });

    expect(result.pass).toBe(false);
    expect(result.failures.every((f) => f.reason === "EXCEPTION_EXPIRED")).toBe(true);
    expect(result.failures).toHaveLength(2);
  });

  // 7. wrong package version causes FAIL
  it("7: FAILs when the installed image-size version no longer matches the exception's pinned version", () => {
    const result = evaluate({
      auditJson: realWorldAuditFixture(),
      exceptions: acceptedExceptions(),
      installedVersions: { "image-size": "1.3.0" }, // upgraded, no longer 1.2.1
      dependencyPaths: GOVERNED_DEPENDENCY_PATHS,
      now: new Date("2026-08-15"),
    });

    expect(result.pass).toBe(false);
    expect(result.failures.every((f) => f.reason === "VERSION_MISMATCH")).toBe(true);
  });

  // 8. wrong dependency path causes FAIL
  it("8: FAILs when the actual dependency path drifts away from the governed expected path (e.g. an intermediate package version changed)", () => {
    const driftedPath = "expo@57.0.13 > @expo/metro@57.0.0 > metro@0.85.0 > image-size@1.2.1";

    const result = evaluate({
      auditJson: realWorldAuditFixture(),
      exceptions: acceptedExceptions(),
      installedVersions: { "image-size": "1.2.1" },
      dependencyPaths: { "image-size": [driftedPath] },
      now: new Date("2026-08-15"),
    });

    expect(result.pass).toBe(false);
    expect(result.failures.every((f) => f.reason === "DEPENDENCY_PATH_MISMATCH")).toBe(true);
  });

  // 9. an additional, unexpected dependency path causes FAIL even though the
  // originally-governed path is still present
  it("9: FAILs when image-size becomes reachable via an ADDITIONAL unexpected path, even though the governed path still also exists", () => {
    const newUnexpectedPath = "react-native@0.86.2 > metro-config@0.84.4 > image-size@1.2.1";

    const result = evaluate({
      auditJson: realWorldAuditFixture(),
      exceptions: acceptedExceptions(),
      installedVersions: { "image-size": "1.2.1" },
      dependencyPaths: { "image-size": [GOVERNED_PATH, newUnexpectedPath] },
      now: new Date("2026-08-15"),
    });

    expect(result.pass).toBe(false);
    expect(
      result.failures.every((f) => f.reason === "UNEXPECTED_ADDITIONAL_DEPENDENCY_PATH"),
    ).toBe(true);
  });

  // 10. no vulnerability + stale exception is detected rather than silently tolerated
  it("10: detects a stale exception (no matching current finding) rather than silently ignoring it, and treats it as a FAIL condition", () => {
    const auditWithNoVulnerabilities = { vulnerabilities: {} };

    const result = evaluate({
      auditJson: auditWithNoVulnerabilities,
      exceptions: acceptedExceptions(),
      installedVersions: {},
      now: new Date("2026-08-15"),
    });

    // No HIGH/CRITICAL findings at all, so nothing is "covered" or "failed"
    // on the advisory side -- but the exceptions no longer correspond to
    // anything real and must be surfaced as stale, not silently kept.
    expect(result.totalHighOrCritical).toBe(0);
    expect(result.covered).toEqual([]);
    expect(result.staleExceptions).toHaveLength(2);
    expect(
      (result.staleExceptions as Array<{ id: string }>).map((e) => e.id).sort(),
    ).toEqual(["SEC-EXC-001", "SEC-EXC-002"]);
  });

  it("also FAILs (not just warns) when only a stale exception exists, via the CLI wrapper's exit-code contract", () => {
    // The pure evaluate() function reports staleExceptions separately from
    // pass/fail (so callers can distinguish "actively wrong" from "tidy-up
    // needed"), but the CLI wrapper in this file's main() treats any
    // non-empty staleExceptions as a failing exit code too (see main()).
    // This test documents that contract at the pure-function level: a
    // caller MUST check staleExceptions in addition to `pass`.
    const result = evaluate({
      auditJson: { vulnerabilities: {} },
      exceptions: acceptedExceptions(),
      now: new Date("2026-08-15"),
    });
    const effectivelyPasses = result.pass && result.staleExceptions.length === 0;
    expect(effectivelyPasses).toBe(false);
  });

  it("real current repository state (proposed exceptions) FAILs NORMAL mode but PASSes REVIEW mode against the actual known audit shape", () => {
    // Guards against the exact live scenario this repository is in right
    // now: scripts/security/npm-audit-exceptions.json's two exceptions are
    // status: "proposed" pending Product Owner / Project Architect
    // acceptance.
    const normal = evaluate({
      auditJson: realWorldAuditFixture(),
      exceptions: proposedExceptions(),
      installedVersions: { "image-size": "1.2.1" },
      dependencyPaths: GOVERNED_DEPENDENCY_PATHS,
      allowProposed: false,
      now: new Date("2026-08-15"),
    });
    const review = evaluate({
      auditJson: realWorldAuditFixture(),
      exceptions: proposedExceptions(),
      installedVersions: { "image-size": "1.2.1" },
      dependencyPaths: GOVERNED_DEPENDENCY_PATHS,
      allowProposed: true,
      now: new Date("2026-08-15"),
    });

    expect(normal.pass).toBe(false);
    expect(review.pass).toBe(true);
  });
});
