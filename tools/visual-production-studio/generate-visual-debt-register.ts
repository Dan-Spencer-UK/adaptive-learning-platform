/**
 * CC-11.13 §12: the concise Unit 202 visual-debt register -- classifies
 * every asset with a KNOWN, RECORDED debt finding (not all 53 assets;
 * assets with no entry in `asset-lifecycle.ts`'s `ASSET_LIFECYCLE` carry
 * no known debt) into BLOCKING_CORRECTNESS / DEVELOPMENT_USABLE_POLISH_
 * PENDING / DEFERRED_SCOPE. Deliberately lean per the task brief's own
 * "use careful judgement, but do not bloat the list" instruction -- this
 * is a triage register, not a full asset inventory (see
 * `unit202-final-state-completeness.json` for that).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { findAsset } from "./catalogue.ts";
import { ASSET_LIFECYCLE, isDevelopmentUsable, UNIT202_GENERATIVE_SUITE_STATUS, type VisualDebtClass } from "./asset-lifecycle.ts";
import { productionModeFor } from "./production-mode.ts";
import { REPO_ROOT } from "./paths.ts";

const JSON_PATH = join(REPO_ROOT, "reports", "instructional-visuals", "unit202-visual-debt-register.json");
const MD_PATH = join(REPO_ROOT, "reports", "instructional-visuals", "unit202-visual-debt-register.md");

interface DebtRow {
  visualId: string;
  displayName: string;
  debtClass: VisualDebtClass;
  lifecycleGate: string;
  productionMode: string;
  developmentUsable: boolean;
  notes: string;
}

function buildRows(): DebtRow[] {
  return Object.entries(ASSET_LIFECYCLE).map(([visualId, rec]) => {
    const asset = findAsset(visualId.split(".state.")[0] ?? visualId);
    return {
      visualId,
      displayName: asset?.displayName ?? visualId,
      debtClass: rec.debtClass,
      lifecycleGate: rec.gate,
      productionMode: productionModeFor(visualId)?.mode ?? "UNKNOWN",
      developmentUsable: isDevelopmentUsable(visualId),
      notes: rec.notes,
    };
  });
}

function toMarkdown(rows: DebtRow[]): string {
  const lines: string[] = [];
  lines.push("# Unit 202 — Visual Debt Register (CC-11.13)");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push("Concise triage register of KNOWN, INDIVIDUALLY-IDENTIFIED visual debt only -- not a full 98-state inventory (see `unit202-final-state-completeness.md` for that). Assets with no entry here carry no individually-identified defect, but see the suite-level status immediately below: they are NOT thereby claimed visually finished.");
  lines.push("");
  lines.push(`## ${UNIT202_GENERATIVE_SUITE_STATUS.id} — ${UNIT202_GENERATIVE_SUITE_STATUS.status}`);
  lines.push("");
  lines.push(`Applies to: ${UNIT202_GENERATIVE_SUITE_STATUS.appliesTo}`);
  lines.push("");
  for (const m of UNIT202_GENERATIVE_SUITE_STATUS.meaning) lines.push(`- ${m}`);
  lines.push("");
  lines.push(UNIT202_GENERATIVE_SUITE_STATUS.notes);
  lines.push("");
  lines.push(`Of the 51 generative learner-visible outputs produced through CC-11.12, ${rows.length} carry an individually-identified debt finding below; the remaining ${51 - rows.length} fall under the suite-level ${UNIT202_GENERATIVE_SUITE_STATUS.status} status above rather than being padded into per-asset entries here.`);
  lines.push("");

  for (const cls of ["BLOCKING_CORRECTNESS", "DEVELOPMENT_USABLE_POLISH_PENDING", "DEFERRED_SCOPE"] as VisualDebtClass[]) {
    const inClass = rows.filter((r) => r.debtClass === cls);
    lines.push(`## ${cls} (${inClass.length})`);
    lines.push("");
    if (cls === "BLOCKING_CORRECTNESS") lines.push("Wrong / misleading / technically unsafe for teaching -- **not development-usable as a correct teaching asset** until fixed.");
    if (cls === "DEVELOPMENT_USABLE_POLISH_PENDING") lines.push("Correct enough to continue product development now; visually below the desired finish.");
    if (cls === "DEFERRED_SCOPE") lines.push("Not worth further Unit 202 time right now.");
    lines.push("");
    for (const r of inClass) {
      lines.push(`### \`${r.visualId}\` — ${r.displayName}`);
      lines.push(`- Lifecycle gate: ${r.lifecycleGate}`);
      lines.push(`- Production mode: ${r.productionMode}`);
      lines.push(`- Development-usable: ${r.developmentUsable ? "yes" : "**no**"}`);
      lines.push(`- ${r.notes}`);
      lines.push("");
    }
  }
  return lines.join("\n");
}

export function generateVisualDebtRegister(): { jsonPath: string; mdPath: string; counts: Record<VisualDebtClass, number> } {
  const rows = buildRows();
  const counts: Record<VisualDebtClass, number> = {
    BLOCKING_CORRECTNESS: rows.filter((r) => r.debtClass === "BLOCKING_CORRECTNESS").length,
    DEVELOPMENT_USABLE_POLISH_PENDING: rows.filter((r) => r.debtClass === "DEVELOPMENT_USABLE_POLISH_PENDING").length,
    DEFERRED_SCOPE: rows.filter((r) => r.debtClass === "DEFERRED_SCOPE").length,
  };
  mkdirSync(join(REPO_ROOT, "reports", "instructional-visuals"), { recursive: true });
  writeFileSync(
    JSON_PATH,
    JSON.stringify({ generatedAt: new Date().toISOString(), suiteStatus: UNIT202_GENERATIVE_SUITE_STATUS, counts, rows }, null, 2) + "\n",
    "utf8",
  );
  writeFileSync(MD_PATH, toMarkdown(rows), "utf8");
  return { jsonPath: JSON_PATH, mdPath: MD_PATH, counts };
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const { jsonPath, mdPath, counts } = generateVisualDebtRegister();
  console.log(`Visual debt register written: ${jsonPath}`);
  console.log(`Visual debt register written: ${mdPath}`);
  console.log(JSON.stringify(counts, null, 2));
}
