/**
 * CC-19R2 section 4: writes the mechanically-computed CC-19R1 new-source
 * access addendum to disk. See source-access-reconciliation.ts for how it
 * is derived (a pure diff against already-frozen data -- no new research).
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { computeCc19r1Addendum, validateSourceAccessCompleteness } from "./source-access-reconciliation.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const outDir = path.join(repoRoot, "reports", "backtests", "unit202-cleanroom");

const addendum = computeCc19r1Addendum();
const violations = validateSourceAccessCompleteness();

const output = {
  packageId: "CC-19R2",
  purpose: "CC-19R1 new-source access addendum -- every distinct technical-truth source URL used by CC-19R1 that was not already present in CC-19R's original CC-19R-SOURCE-ACCESS-LOG.json, computed by mechanical diff (no new research performed for this package).",
  cc19r1NewSourceLogConstruction: "RECONSTRUCTED_AFTER_RESEARCH_FROM_SAME_SESSION_HISTORY",
  cc19r1NewSourceChainOfCustodyLimitation:
    "New technical-source accesses made during CC-19R1 were reconstructed from the same uninterrupted Claude session transcript rather than appended to the access log contemporaneously. No access timestamp is asserted beyond 'occurred during the CC-19R1 package, after the original CC-19R log was written.'",
  entryCount: addendum.length,
  entries: addendum,
  completenessCheckAtGenerationTime: {
    violationCount: violations.length,
    violations,
  },
};

writeFileSync(path.join(outDir, "CC-19R1-SOURCE-ACCESS-ADDENDUM.json"), JSON.stringify(output, null, 2) + "\n", "utf-8");
console.log(`CC-19R1-SOURCE-ACCESS-ADDENDUM.json written: ${addendum.length} entries, ${violations.length} completeness violations.`);
