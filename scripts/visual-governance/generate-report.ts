/**
 * CC-05D: generates the human-readable HTML audit
 * (reports/instructional-visuals/index.html) and consolidated
 * machine-readable evidence (mechanical-audit.json) from the canonical
 * JSON sources already produced by the render/mechanical/semantic/
 * human-review steps -- never hand-edited, always regenerated. Design
 * authority: docs/architecture/CC-05D-INSTRUCTIONAL-VISUAL-GOVERNANCE-
 * AND-SEMANTIC-QA.md §L/§M.
 *
 * Usage:
 *   node scripts/visual-governance/generate-report.ts
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

import { renderManifestSchema, semanticAuditRecordSchema, humanReviewDecisionSchema, pedagogyManifestSchema, type SemanticAuditRecord, type HumanReviewDecision } from "@alp/content-schema";

import { cc05aPedagogyUnit202 } from "../content/data/cc05a-pedagogy-unit202.ts";
import { visualSemanticContracts } from "./data/cc05d-visual-contracts-unit202.ts";
import { buildReport as buildMechanicalReport } from "./check-visual-governance.ts";
import { checkCurrentArrowGeometry } from "./artifact-geometry-check.ts";
import { computeContractHash } from "./audit-cache.ts";
import { isDecisionCurrent } from "./human-review.ts";
import { isSimulatedReviewerIdentity } from "./semantic-review/mock-provider.ts";

/**
 * TRUTHFULNESS CORRECTION (Product Owner review, 2026-08-17): a semantic
 * result produced by MockSemanticReviewProvider must never be presented
 * identically to a real vision-model review -- a "PASS" from the mock
 * pipeline proves the QA *architecture* works end-to-end, not that any
 * image has been visually inspected and approved. Every place this
 * report shows a semantic result classifies it into exactly one of
 * these three buckets, always recomputed from the recorded
 * `reviewerIdentity` (never inferred from a label), and labels the
 * simulated bucket unmistakably as simulated.
 */
export type SemanticEvidenceKind = "real" | "simulated" | "unreviewed";

export function classifySemanticEvidence(reviewerIdentity: string | undefined): SemanticEvidenceKind {
  if (!reviewerIdentity) return "unreviewed";
  return isSimulatedReviewerIdentity(reviewerIdentity) ? "simulated" : "real";
}

const REPORTS_DIR = join(import.meta.dirname, "..", "..", "reports", "instructional-visuals");
const MANIFEST_PATH = join(REPORTS_DIR, "manifest.json");
const SEMANTIC_AUDIT_PATH = join(REPORTS_DIR, "semantic-audit.json");
const HUMAN_REVIEW_PATH = join(REPORTS_DIR, "human-review.json");
const HUMAN_REVIEW_QUEUE_PATH = join(REPORTS_DIR, "human-review-queue.json");
const MECHANICAL_AUDIT_PATH = join(REPORTS_DIR, "mechanical-audit.json");
const INDEX_HTML_PATH = join(REPORTS_DIR, "index.html");

interface VariantCard {
  variantId: string;
  contractId: string;
  diagramBlueprintId: string;
  diagramType: string;
  mode: string;
  svgRelativePath: string;
  imageHash: string;
  teachingIntent: string;
  representationRole: string;
  assertionFamilyIds: string[];
  assertionIdentifiers: string[];
  capabilityIds: string[];
  relevantQuestionBlueprintIds: string[];
  mustShow: string[];
  mustNotShow: string[];
  mechanicalPassed: boolean;
  mechanicalFailures: string[];
  semantic?: SemanticAuditRecord;
  humanReviewRequired: boolean;
  humanReviewStatus: HumanReviewDecision["status"];
  humanReviewReason?: string;
}

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildCards(): VariantCard[] {
  if (!existsSync(MANIFEST_PATH)) {
    throw new Error(`No render manifest found at ${MANIFEST_PATH}. Run 'npm run visuals:render' first.`);
  }
  const manifest = renderManifestSchema.parse(JSON.parse(readFileSync(MANIFEST_PATH, "utf8")));
  const pedagogy = pedagogyManifestSchema.parse(cc05aPedagogyUnit202);
  const diagramTypeByBlueprintId = new Map(pedagogy.diagramBlueprints.map((d) => [d.id, d.type]));
  const contractById = new Map(visualSemanticContracts.map((c) => [c.id, c]));

  const semanticRecords: SemanticAuditRecord[] = existsSync(SEMANTIC_AUDIT_PATH)
    ? (JSON.parse(readFileSync(SEMANTIC_AUDIT_PATH, "utf8")) as unknown[]).map((r) => semanticAuditRecordSchema.parse(r))
    : [];
  const semanticByVariantId = new Map(semanticRecords.map((r) => [r.variantId, r]));

  const humanReviewQueue: Array<{ variantId: string; reason: "mandatory" | "sampled" }> = existsSync(HUMAN_REVIEW_QUEUE_PATH)
    ? JSON.parse(readFileSync(HUMAN_REVIEW_QUEUE_PATH, "utf8"))
    : [];
  const queueByVariantId = new Map(humanReviewQueue.map((q) => [q.variantId, q.reason]));

  const humanDecisions: HumanReviewDecision[] = existsSync(HUMAN_REVIEW_PATH)
    ? (JSON.parse(readFileSync(HUMAN_REVIEW_PATH, "utf8")) as unknown[]).map((d) => humanReviewDecisionSchema.parse(d))
    : [];
  const decisionByVariantId = new Map(humanDecisions.map((d) => [d.variantId, d]));

  const cards: VariantCard[] = [];
  for (const artifact of manifest.artifacts) {
    const contract = contractById.get(artifact.contractId);
    if (!contract) continue;

    const svgPath = join(REPORTS_DIR, artifact.svgRelativePath);
    const svg = existsSync(svgPath) ? readFileSync(svgPath, "utf8") : "";
    const geometry = svg ? checkCurrentArrowGeometry(svg) : { passed: true, failures: [] as string[] };

    const semantic = semanticByVariantId.get(artifact.variantId);
    const queueReason = queueByVariantId.get(artifact.variantId);
    const decision = decisionByVariantId.get(artifact.variantId);
    const contractHash = computeContractHash(contract);
    const currentDecision = decision && isDecisionCurrent(decision, { imageHash: artifact.imageHash, contractHash }) ? decision : undefined;

    cards.push({
      variantId: artifact.variantId,
      contractId: artifact.contractId,
      diagramBlueprintId: artifact.diagramBlueprintId,
      diagramType: diagramTypeByBlueprintId.get(artifact.diagramBlueprintId) ?? "unknown",
      mode: artifact.mode,
      svgRelativePath: artifact.svgRelativePath,
      imageHash: artifact.imageHash,
      teachingIntent: contract.teachingIntent,
      representationRole: contract.representationRole,
      assertionFamilyIds: contract.assertionFamilyIds,
      assertionIdentifiers: contract.assertionIdentifiers,
      capabilityIds: contract.capabilityIds,
      relevantQuestionBlueprintIds: contract.relevantQuestionBlueprintIds,
      mustShow: contract.mustShow,
      mustNotShow: contract.mustNotShow,
      mechanicalPassed: geometry.passed,
      mechanicalFailures: geometry.failures,
      semantic,
      humanReviewRequired: Boolean(queueReason),
      humanReviewStatus: currentDecision?.status ?? (queueReason ? "required" : "not_required"),
      humanReviewReason: queueReason,
    });
  }
  return cards.sort((a, b) => a.variantId.localeCompare(b.variantId));
}

function cardHtml(card: VariantCard): string {
  const status = card.semantic?.verification.status ?? "unreviewed";
  const confidence = card.semantic?.verification.confidence ?? "n/a";
  const issues = card.semantic?.verification.issues ?? [];
  const evidenceKind = classifySemanticEvidence(card.semantic?.verification.reviewerIdentity);
  const semanticBadgeLabel =
    evidenceKind === "real"
      ? `REAL AI REVIEW: ${esc(status).toUpperCase()} (${esc(confidence)})`
      : evidenceKind === "simulated"
        ? `SIMULATED SEMANTIC (mock pipeline, not a real review): ${esc(status).toUpperCase()}`
        : "REAL AI REVIEW: NOT RUN";

  return `
<article class="card"
  data-family="${esc(card.assertionFamilyIds.join(" "))}"
  data-diagram-type="${esc(card.diagramType)}"
  data-blueprint="${esc(card.diagramBlueprintId)}"
  data-semantic-status="${esc(status)}"
  data-semantic-evidence="${evidenceKind}"
  data-mechanical-status="${card.mechanicalPassed ? "pass" : "fail"}"
  data-human-review="${card.humanReviewRequired ? "required" : "not_required"}"
  data-mode="${esc(card.mode)}"
  data-role="${esc(card.representationRole)}"
>
  <div class="card-image"><img src="${esc(card.svgRelativePath)}" alt="${esc(card.teachingIntent)}" loading="lazy" /></div>
  <div class="card-body">
    <h3>${esc(card.teachingIntent)}</h3>
    <div class="badges">
      <span class="badge role-${esc(card.representationRole)}">${esc(card.representationRole)}</span>
      <span class="badge mode">${esc(card.mode)}</span>
      <span class="badge mech-${card.mechanicalPassed ? "pass" : "fail"}">mechanical: ${card.mechanicalPassed ? "PASS" : "FAIL"}</span>
      <span class="badge evidence-${evidenceKind}">${semanticBadgeLabel}</span>
      ${card.humanReviewRequired ? `<span class="badge human-required">human review: ${esc(card.humanReviewStatus)} (${esc(card.humanReviewReason ?? "")})</span>` : `<span class="badge human-ok">human review: not required</span>`}
    </div>
    <details>
      <summary>Traceability &amp; contract detail</summary>
      <dl>
        <dt>Diagram blueprint</dt><dd><code>${esc(card.diagramBlueprintId)}</code> (${esc(card.diagramType)})</dd>
        <dt>Visual semantic contract</dt><dd><code>${esc(card.contractId)}</code></dd>
        <dt>Assertion family</dt><dd>${card.assertionFamilyIds.map(esc).join(", ")}</dd>
        <dt>Atomic assertions</dt><dd>${card.assertionIdentifiers.map(esc).join(", ") || "&mdash;"}</dd>
        <dt>Capability</dt><dd>${card.capabilityIds.map(esc).join(", ") || "&mdash;"}</dd>
        <dt>Question blueprints</dt><dd>${card.relevantQuestionBlueprintIds.map(esc).join(", ") || "&mdash;"}</dd>
        <dt>Must show</dt><dd>${card.mustShow.map(esc).join("; ")}</dd>
        <dt>Must not show</dt><dd>${card.mustNotShow.map(esc).join("; ") || "&mdash;"}</dd>
        <dt>Variant id</dt><dd><code class="small">${esc(card.variantId)}</code></dd>
        <dt>Image SHA-256</dt><dd><code class="small">${esc(card.imageHash)}</code></dd>
      </dl>
    </details>
    ${
      card.mechanicalFailures.length
        ? `<details open><summary>Mechanical failures</summary><ul>${card.mechanicalFailures.map((f) => `<li>${esc(f)}</li>`).join("")}</ul></details>`
        : ""
    }
    ${
      card.semantic
        ? `<details><summary>Pass A (blind observation) &amp; Pass B (semantic verification)</summary>
      ${evidenceKind === "simulated" ? `<p class="simulated-warning"><strong>&#9888; This is a SIMULATED result from a deterministic mock pipeline, not a real AI/vision review.</strong> It proves the QA architecture processes this image correctly end-to-end -- it is not evidence that any model has actually looked at this image and approved it. Real semantic review has not yet been run against this or any image in this catalogue (see the summary banner above).</p>` : ""}
      <p><strong>Reviewer identity:</strong> <code>${esc(card.semantic.verification.reviewerIdentity)}</code> &mdash; <strong>cache:</strong> ${card.semantic.cacheHit ? "reused" : "fresh"}</p>
      <p><strong>Observed:</strong> ${esc(card.semantic.observation.visibleObjects.join(", ") || "(none reported)")}</p>
      ${issues.length ? `<ul>${issues.map((i) => `<li><strong>${esc(i.code)}</strong> (${esc(i.severity)}): expected ${esc(i.expected)}, observed ${esc(i.observed)} &mdash; ${esc(i.explanation)}</li>`).join("")}</ul>` : "<p>No issues reported.</p>"}
    </details>`
        : `<p class="unreviewed">REAL AI REVIEW: NOT RUN -- no semantic audit evidence yet. Run <code>npm run visuals:audit:semantic</code>.</p>`
    }
  </div>
</article>`;
}

function buildHtml(cards: VariantCard[]): string {
  const families = [...new Set(cards.flatMap((c) => c.assertionFamilyIds))].sort();
  const diagramTypes = [...new Set(cards.map((c) => c.diagramType))].sort();

  const evidenceKinds = cards.map((c) => classifySemanticEvidence(c.semantic?.verification.reviewerIdentity));
  const summary = {
    contracts: new Set(cards.map((c) => c.contractId)).size,
    variants: cards.length,
    mechanicalPass: cards.filter((c) => c.mechanicalPassed).length,
    mechanicalFail: cards.filter((c) => !c.mechanicalPassed).length,
    // Simulated (mock-pipeline) results -- these are NOT a real AI/vision review. See the banner below.
    simulatedPass: cards.filter((c, i) => evidenceKinds[i] === "simulated" && c.semantic?.verification.status === "pass").length,
    simulatedWarn: cards.filter((c, i) => evidenceKinds[i] === "simulated" && c.semantic?.verification.status === "warn").length,
    simulatedFail: cards.filter((c, i) => evidenceKinds[i] === "simulated" && c.semantic?.verification.status === "fail").length,
    // Real provider (e.g. Anthropic vision) results -- currently always 0 in this environment; see the banner below.
    realPass: cards.filter((c, i) => evidenceKinds[i] === "real" && c.semantic?.verification.status === "pass").length,
    realWarn: cards.filter((c, i) => evidenceKinds[i] === "real" && c.semantic?.verification.status === "warn").length,
    realFail: cards.filter((c, i) => evidenceKinds[i] === "real" && c.semantic?.verification.status === "fail").length,
    unreviewed: evidenceKinds.filter((k) => k === "unreviewed").length,
    humanReviewRequired: cards.filter((c) => c.humanReviewRequired).length,
    humanReviewCompleted: cards.filter((c) => c.humanReviewRequired && (c.humanReviewStatus === "approved" || c.humanReviewStatus === "approved_with_note" || c.humanReviewStatus === "rejected")).length,
  };
  const anyRealReview = summary.realPass + summary.realWarn + summary.realFail > 0;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>CC-05D Instructional Visual Audit</title>
<style>
  :root { color-scheme: dark light; --bg:#0b0d12; --surface:#151821; --border:#262b38; --text:#f2f4f8; --text2:#9aa3b2; --accent:#4c8dff; --good:#4cd07a; --warn:#e8b93f; --bad:#ff6b6b; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--text); font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
  header { padding: 24px; border-bottom: 1px solid var(--border); }
  h1 { margin: 0 0 4px; font-size: 22px; }
  .subtitle { color: var(--text2); font-size: 14px; }
  .summary { display: flex; flex-wrap: wrap; gap: 12px; padding: 16px 24px; }
  .stat { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 10px 14px; min-width: 120px; }
  .stat .n { font-size: 20px; font-weight: 700; }
  .stat .l { font-size: 12px; color: var(--text2); }
  .filters { display: flex; flex-wrap: wrap; gap: 10px; padding: 0 24px 16px; align-items: center; }
  .filters select, .filters input { background: var(--surface); color: var(--text); border: 1px solid var(--border); border-radius: 8px; padding: 6px 10px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; padding: 0 24px 32px; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; }
  .card.hidden { display: none; }
  .card-image { background: #05060a; padding: 12px; text-align: center; }
  .card-image img { max-width: 100%; height: auto; }
  .card-body { padding: 14px; display: flex; flex-direction: column; gap: 8px; }
  .card-body h3 { margin: 0; font-size: 15px; line-height: 1.35; }
  .badges { display: flex; flex-wrap: wrap; gap: 6px; }
  .badge { font-size: 11px; padding: 3px 8px; border-radius: 999px; border: 1px solid var(--border); color: var(--text2); }
  .badge.mech-pass, .badge.human-ok { color: var(--good); border-color: var(--good); }
  .badge.mech-fail, .badge.human-required { color: var(--bad); border-color: var(--bad); }
  .badge.evidence-real { color: var(--good); border-color: var(--good); font-weight: 700; }
  .badge.evidence-simulated { color: #c9a6ff; border-color: #8a5cf6; background: rgba(138,92,246,0.12); font-weight: 700; }
  .badge.evidence-unreviewed { color: var(--warn); border-color: var(--warn); }
  dl { display: grid; grid-template-columns: 140px 1fr; gap: 4px 10px; font-size: 13px; margin: 8px 0 0; }
  dt { color: var(--text2); }
  code.small { font-size: 11px; word-break: break-all; }
  details summary { cursor: pointer; font-size: 13px; color: var(--text2); }
  .unreviewed { color: var(--warn); font-size: 13px; }
  .simulated-warning { background: rgba(138,92,246,0.12); border: 1px solid #8a5cf6; border-radius: 8px; padding: 8px 10px; color: #c9a6ff; }
  .notice-banner { margin: 0 24px 16px; padding: 14px 16px; border-radius: 10px; border: 1px solid; font-size: 13px; line-height: 1.5; }
  .notice-banner.critical { background: rgba(138,92,246,0.12); border-color: #8a5cf6; color: #d9c6ff; }
  .notice-banner.warning { background: rgba(232,185,63,0.10); border-color: var(--warn); color: #f0d78c; }
  .notice-banner strong { color: var(--text); }
  footer { padding: 24px; color: var(--text2); font-size: 12px; }
</style>
</head>
<body>
<header>
  <h1>CC-05D &mdash; Instructional Visual Audit</h1>
  <div class="subtitle">Generated from reports/instructional-visuals/*.json. Not hand-edited -- regenerate with <code>npm run visuals:report</code>.</div>
</header>
<div class="notice-banner critical">
  <strong>&#9888; No real AI/vision semantic review has been performed on any image in this catalogue.</strong>
  Every "semantic" result shown below is from <code>MockSemanticReviewProvider</code> &mdash; a deterministic simulation used to prove the two-pass QA <em>architecture</em> works end-to-end. It is <strong>not</strong> evidence that a vision model, or anyone, has actually inspected and approved these images. Results from a real provider will be clearly labelled "REAL AI REVIEW"; simulated results are labelled "SIMULATED SEMANTIC" everywhere in this report. Real semantic review remains a required, currently-deferred follow-on (see the CC-05D evidence document).
</div>
<div class="notice-banner warning">
  <strong>&#9888; Current instructional-visual quality is under review and is NOT approved as production visual design.</strong>
  Product Owner manual review of this catalogue found the current imagery below the required eventual product standard. CC-05D's governance/QA <em>workflow</em> is approved; the visuals it currently governs are proving-slice content, not final artwork. Future work must address pedagogical fidelity, visual clarity, illustration quality, label placement, arrow/direction clarity, visual hierarchy, accessibility, consistency, native mobile legibility and overall polish before any of these images (or their style) are treated as production-ready.
</div>
<div class="summary">
  <div class="stat"><div class="n">${summary.contracts}</div><div class="l">governed contracts</div></div>
  <div class="stat"><div class="n">${summary.variants}</div><div class="l">rendered variants</div></div>
  <div class="stat"><div class="n">${summary.mechanicalPass} / ${summary.mechanicalFail}</div><div class="l">mechanical pass / fail</div></div>
  <div class="stat"><div class="n">${summary.simulatedPass} / ${summary.simulatedWarn} / ${summary.simulatedFail}</div><div class="l">SIMULATED semantic pass / warn / fail (mock pipeline)</div></div>
  <div class="stat"><div class="n">${summary.realPass} / ${summary.realWarn} / ${summary.realFail}</div><div class="l">REAL AI review pass / warn / fail${anyRealReview ? "" : " (none run yet)"}</div></div>
  <div class="stat"><div class="n">${summary.unreviewed}</div><div class="l">no semantic evidence at all</div></div>
  <div class="stat"><div class="n">${summary.humanReviewCompleted} / ${summary.humanReviewRequired}</div><div class="l">human review completed / required</div></div>
</div>
<div class="filters">
  <select id="filter-family"><option value="">All assertion families</option>${families.map((f) => `<option value="${esc(f)}">${esc(f)}</option>`).join("")}</select>
  <select id="filter-diagram-type"><option value="">All diagram types</option>${diagramTypes.map((t) => `<option value="${esc(t)}">${esc(t)}</option>`).join("")}</select>
  <select id="filter-evidence"><option value="">Any evidence kind</option><option value="real">Real AI review</option><option value="simulated">Simulated (mock)</option><option value="unreviewed">Unreviewed</option></select>
  <select id="filter-semantic"><option value="">Any semantic status</option><option value="pass">Pass</option><option value="warn">Warn</option><option value="fail">Fail</option><option value="unreviewed">Unreviewed</option></select>
  <select id="filter-mechanical"><option value="">Any mechanical status</option><option value="pass">Pass</option><option value="fail">Fail</option></select>
  <select id="filter-human"><option value="">Any human-review status</option><option value="required">Requires review</option><option value="not_required">Not required</option></select>
  <select id="filter-mode"><option value="">Any mode</option><option value="teaching">Teaching</option><option value="assessment">Assessment</option><option value="both">Both</option></select>
  <input id="filter-search" type="search" placeholder="Search title / id..." />
</div>
<div class="grid" id="grid">
${cards.map(cardHtml).join("\n")}
</div>
<footer>CC-05D instructional-visual governance &amp; semantic QA. Structural Jest snapshots prove component-tree stability; this report's rendered images prove real computed SVG geometry/text; native-device rendering remains a distinct, separately-tracked evidence tier (see the CC-05D architecture doc &sect;D). Semantic results are simulated (mock pipeline) until a real vision-provider review has actually been run -- see the banner above.</footer>
<script>
(function () {
  var family = document.getElementById('filter-family');
  var diagramType = document.getElementById('filter-diagram-type');
  var evidence = document.getElementById('filter-evidence');
  var semantic = document.getElementById('filter-semantic');
  var mechanical = document.getElementById('filter-mechanical');
  var human = document.getElementById('filter-human');
  var mode = document.getElementById('filter-mode');
  var search = document.getElementById('filter-search');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));

  function apply() {
    var f = family.value, dt = diagramType.value, ev = evidence.value, sem = semantic.value, mech = mechanical.value, hr = human.value, m = mode.value, q = search.value.trim().toLowerCase();
    cards.forEach(function (card) {
      var ok = true;
      if (f && (' ' + card.dataset.family + ' ').indexOf(' ' + f + ' ') === -1) ok = false;
      if (dt && card.dataset.diagramType !== dt) ok = false;
      if (ev && card.dataset.semanticEvidence !== ev) ok = false;
      if (sem && card.dataset.semanticStatus !== sem) ok = false;
      if (mech && card.dataset.mechanicalStatus !== mech) ok = false;
      if (hr && card.dataset.humanReview !== hr) ok = false;
      if (m && card.dataset.mode !== m) ok = false;
      if (q && card.textContent.toLowerCase().indexOf(q) === -1) ok = false;
      card.classList.toggle('hidden', !ok);
    });
  }
  [family, diagramType, evidence, semantic, mechanical, human, mode].forEach(function (el) { el.addEventListener('change', apply); });
  search.addEventListener('input', apply);
})();
</script>
</body>
</html>`;
}

export function generateReport(): { cards: VariantCard[]; mechanicalReport: ReturnType<typeof buildMechanicalReport> } {
  const cards = buildCards();
  const mechanicalReport = buildMechanicalReport();

  mkdirSync(REPORTS_DIR, { recursive: true });
  writeFileSync(
    MECHANICAL_AUDIT_PATH,
    JSON.stringify(
      cards.map((c) => ({ variantId: c.variantId, passed: c.mechanicalPassed, failures: c.mechanicalFailures })),
      null,
      2,
    ) + "\n",
    "utf8",
  );
  writeFileSync(INDEX_HTML_PATH, buildHtml(cards), "utf8");

  return { cards, mechanicalReport };
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  const { cards } = generateReport();
  console.log(`CC-05D report generated: ${cards.length} variant cards.`);
  console.log(`  HTML: ${INDEX_HTML_PATH}`);
  console.log(`  Mechanical evidence: ${MECHANICAL_AUDIT_PATH}`);
}
