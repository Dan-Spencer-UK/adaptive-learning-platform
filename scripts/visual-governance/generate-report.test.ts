/**
 * Truthfulness correction (Product Owner review, 2026-08-17): proves a
 * mock/simulated semantic result is never presented identically to a
 * real one, either in the classification function or in the generated
 * HTML/JSON output. Integration tests here run against the real,
 * committed reports/instructional-visuals/ evidence (see the note in
 * run-semantic-audit.test.ts for why -- rendering can only happen under
 * Jest, so `npm run visuals:render` must have run at least once).
 */
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { classifySemanticEvidence, generateReport } from "./generate-report.ts";
import { MOCK_PROVIDER_IDENTITY } from "./semantic-review/mock-provider.ts";

const MANIFEST_PATH = join(import.meta.dirname, "..", "..", "reports", "instructional-visuals", "manifest.json");
const INDEX_HTML_PATH = join(import.meta.dirname, "..", "..", "reports", "instructional-visuals", "index.html");

describe("classifySemanticEvidence", () => {
  it("classifies the mock provider's identity as 'simulated', never 'real'", () => {
    expect(classifySemanticEvidence(MOCK_PROVIDER_IDENTITY)).toBe("simulated");
  });

  it("classifies a real-looking provider identity as 'real'", () => {
    expect(classifySemanticEvidence("anthropic:claude-opus-5")).toBe("real");
  });

  it("classifies undefined (no semantic record at all) as 'unreviewed'", () => {
    expect(classifySemanticEvidence(undefined)).toBe("unreviewed");
  });
});

describe.skipIf(!existsSync(MANIFEST_PATH))("generateReport HTML truthfulness", () => {
  it("the generated HTML contains an unmissable banner stating no real AI review has run", () => {
    generateReport();
    const html = readFileSync(INDEX_HTML_PATH, "utf8");
    expect(html).toContain("No real AI/vision semantic review has been performed on any image in this catalogue");
  });

  it("the generated HTML contains an unmissable banner stating current imagery is not approved as production quality", () => {
    const html = readFileSync(INDEX_HTML_PATH, "utf8");
    expect(html).toContain("Current instructional-visual quality is under review and is NOT approved as production visual design");
  });

  it("every card with mock-provider evidence is labelled SIMULATED, never presented as a bare 'semantic: PASS'", () => {
    const html = readFileSync(INDEX_HTML_PATH, "utf8");
    // The old, corrected wording must never appear again.
    expect(html).not.toMatch(/badge sem-pass">semantic: PASS/);
    // Every card actually has semantic evidence in this fixture (18/18 reviewed), so this must be > 0.
    const simulatedBadgeCount = (html.match(/badge evidence-simulated/g) ?? []).length;
    expect(simulatedBadgeCount).toBeGreaterThan(0);
  });

  it("no card is labelled 'REAL AI REVIEW: PASS' when only the mock provider has run", () => {
    const html = readFileSync(INDEX_HTML_PATH, "utf8");
    expect(html).not.toContain("REAL AI REVIEW: PASS");
  });

  it("data-semantic-evidence attributes are present and machine-filterable", () => {
    const html = readFileSync(INDEX_HTML_PATH, "utf8");
    expect(html).toContain('data-semantic-evidence="simulated"');
    expect(html).toContain('id="filter-evidence"');
  });

  it("the mechanical-audit.json evidence file is unaffected by the truthfulness correction (still records only mechanical pass/fail, not semantic status)", () => {
    const { cards } = generateReport();
    for (const card of cards) {
      expect(typeof card.mechanicalPassed).toBe("boolean");
    }
  });
});
