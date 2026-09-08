// Deterministic Batch 04-06 freeze manifest generator.
//
// Enumerates every canonical file in the three accepted-and-identity-frozen
// Batch 04-06 directories and records its exact repository-relative path and
// SHA-256 hash. Contains no wall-clock value so regeneration is byte-for-byte
// reproducible. This manifest is the mechanical basis the validator uses to
// prove the Batch 04-06 freeze is real (exact file-set equality + exact hash
// match), not merely a status string change.
//
// Run with: node scripts/backtests/unit202-production-acquisition/generate-batches-04-06-freeze-manifest.mjs
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const repoRoot = path.resolve(import.meta.dirname, "..", "..", "..");
const rel = (p) => path.join(repoRoot, p);

const FREEZE_DECISION_ID = "PA-UNIT202-20260908-CURRICULUM-INPUT-FREEZE-001";
const QUALIFICATION_CONTEXT_ID = "unit202";

const ACCEPTED_BATCH_DIRS = [
  { id: "batch-04", dir: "reports/unit202-production-acquisition/batch-04-electrical-quantities-and-circuit-theory" },
  { id: "batch-05", dir: "reports/unit202-production-acquisition/batch-05-electromagnetism-and-induction" },
  { id: "batch-06", dir: "reports/unit202-production-acquisition/batch-06-electronic-devices-and-applications" },
];

function sha256Of(absPath) {
  return crypto.createHash("sha256").update(fs.readFileSync(absPath)).digest("hex");
}

// Recursively enumerate every REGULAR file beneath absDir (repository-relative
// paths, forward-slash-normalised). Symlinks are rejected outright -- a
// symlinked file or directory could point outside the governed batch
// directory and silently smuggle ungoverned content into the freeze. Any
// resolved relative path that escapes the batch directory (e.g. via "..")
// is likewise rejected, even though normal directory walking cannot produce
// one; this is a defence against a future change to the walk itself.
function walkGovernedFiles(absDir, repoRelDir) {
  const out = [];
  const entries = fs.readdirSync(absDir, { withFileTypes: true });
  for (const e of entries) {
    const absChild = path.join(absDir, e.name);
    const repoRelChild = `${repoRelDir}/${e.name}`;
    const lst = fs.lstatSync(absChild);
    if (lst.isSymbolicLink()) {
      throw new Error(`Freeze manifest generation refused: symlink found at ${repoRelChild}. Governed batch directories must contain only regular files and directories.`);
    }
    const normalizedRel = repoRelChild.replace(/\\/g, "/");
    const escapesRoot = normalizedRel.split("/").some((seg) => seg === "..");
    if (escapesRoot) {
      throw new Error(`Freeze manifest generation refused: path escape detected at ${repoRelChild}.`);
    }
    if (lst.isDirectory()) {
      out.push(...walkGovernedFiles(absChild, repoRelChild));
    } else if (lst.isFile()) {
      out.push(normalizedRel);
    }
  }
  return out;
}

const files = [];
for (const b of ACCEPTED_BATCH_DIRS) {
  const absDir = rel(b.dir);
  const relPaths = walkGovernedFiles(absDir, b.dir);
  for (const relPath of relPaths) {
    files.push({ path: relPath, batchId: b.id, sha256: sha256Of(rel(relPath)) });
  }
}
files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));

const seenPaths = new Set();
for (const f of files) {
  if (seenPaths.has(f.path)) {
    throw new Error(`Freeze manifest generation refused: duplicate path ${f.path}.`);
  }
  seenPaths.add(f.path);
}

const manifest = {
  manifestId: "UNIT202-BATCHES-04-06-FREEZE-MANIFEST",
  freezeDecisionId: FREEZE_DECISION_ID,
  qualificationContextId: QUALIFICATION_CONTEXT_ID,
  generatedBy: "scripts/backtests/unit202-production-acquisition/generate-batches-04-06-freeze-manifest.mjs",
  note: "Deterministic content-hash manifest -- no wall-clock value, so regeneration from an unchanged working tree is byte-for-byte identical. Every listed file's SHA-256 is independently recomputed by the correction-pass validator, which also enumerates the three accepted batch directories itself and requires exact path-set equality with this manifest (no missing file, no extra file).",
  acceptedBatchIds: ACCEPTED_BATCH_DIRS.map((b) => b.id),
  batchDirs: Object.fromEntries(ACCEPTED_BATCH_DIRS.map((b) => [b.id, b.dir])),
  fileCount: files.length,
  files,
};

const outPath = rel("reports/unit202-production-acquisition/UNIT202-BATCHES-04-06-FREEZE-MANIFEST.json");
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
console.log(`Freeze manifest written: ${files.length} governed file(s) across ${ACCEPTED_BATCH_DIRS.length} accepted batches.`);
