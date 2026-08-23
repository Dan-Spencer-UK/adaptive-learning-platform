/**
 * CC-11.5: ALP Visual Production Studio -- a localhost-only development
 * tool for producing and approving premium instructional artwork
 * (task brief §2). Deliberately built with zero new npm dependencies:
 * plain node:http + a static HTML/CSS/JS page, per the task brief's own
 * "choose the simplest architecture" / "may be preferable to introducing
 * unnecessary app framework dependencies" guidance.
 *
 * This is a development tool only. It is never imported by, bundled
 * into, or reachable from any learner-runtime code path (apps/mobile,
 * apps/web) -- it lives entirely under tools/, binds to 127.0.0.1 only,
 * and every filesystem write it performs is validated by paths.ts
 * before it happens.
 *
 * Usage: npm run visuals:studio
 */

import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { allAssets, findAsset, FAMILIES } from "./catalogue.ts";
import { MASTER_PROMPT } from "./master-prompt.ts";
import { buildAssetPrompt } from "./prompt-builder.ts";
import { inspectImage, formatApproxSize } from "./image-utils.ts";
import { resolveStagingPath, APPROVED_ASSET_ROOT, CONTACT_SHEET_PATH } from "./paths.ts";
import { loadState, setStatus, currentManifestEntry, STUDIO_STATUSES, type StudioStatus } from "./state-store.ts";
import { approveStagedImage, type VersioningChoice } from "./approval.ts";
import { pickNextAsset } from "./next-asset.ts";
import { buildContactSheetHtml } from "./contact-sheet.ts";

const PORT = Number(process.env.STUDIO_PORT ?? 4756);
const HOST = "127.0.0.1"; // local only -- never bind 0.0.0.0
const PUBLIC_DIR = fileURLToPath(new URL("./public/", import.meta.url));
const MAX_UPLOAD_BYTES = 30 * 1024 * 1024; // 30MB sanity cap

const STATIC_FILES: Record<string, { file: string; type: string }> = {
  "/": { file: "index.html", type: "text/html; charset=utf-8" },
  "/index.html": { file: "index.html", type: "text/html; charset=utf-8" },
  "/studio.css": { file: "studio.css", type: "text/css; charset=utf-8" },
  "/studio.js": { file: "studio.js", type: "text/javascript; charset=utf-8" },
};

function sendJson(res: import("node:http").ServerResponse, statusCode: number, body: unknown): void {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8", "Content-Length": Buffer.byteLength(payload) });
  res.end(payload);
}

function readBody(req: import("node:http").IncomingMessage, limit: number): Promise<Buffer> {
  return new Promise((resolvePromise, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;
    req.on("data", (chunk: Buffer) => {
      total += chunk.length;
      if (total > limit) {
        reject(new Error("payload too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolvePromise(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function readJsonBody<T>(req: import("node:http").IncomingMessage): Promise<T> {
  const raw = await readBody(req, 1024 * 1024);
  if (raw.length === 0) return {} as T;
  return JSON.parse(raw.toString("utf8")) as T;
}

function manifestSnapshot(): Record<string, ReturnType<typeof currentManifestEntry>> {
  const snapshot: Record<string, ReturnType<typeof currentManifestEntry>> = {};
  for (const asset of allAssets()) snapshot[asset.assetId] = currentManifestEntry(asset.assetId);
  return snapshot;
}

function openInBrowser(url: string): void {
  const platform = process.platform;
  try {
    if (platform === "win32") execFile("cmd.exe", ["/c", "start", "", url]);
    else if (platform === "darwin") execFile("open", [url]);
    else execFile("xdg-open", [url]);
  } catch {
    // best-effort only -- never fatal if no GUI/browser is available
  }
}

function openApprovedFile(path: string): void {
  const platform = process.platform;
  try {
    if (platform === "win32") execFile("cmd.exe", ["/c", "start", "", path]);
    else if (platform === "darwin") execFile("open", [path]);
    else execFile("xdg-open", [path]);
  } catch {
    // best-effort only
  }
}

const server = createServer((req, res) => {
  void handleRequest(req, res).catch((error: unknown) => {
    if (!res.headersSent) sendJson(res, 500, { error: error instanceof Error ? error.message : "internal error" });
  });
});

async function handleRequest(req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse): Promise<void> {
  const url = new URL(req.url ?? "/", `http://${HOST}:${PORT}`);
  const pathname = url.pathname;
  const method = req.method ?? "GET";

  // -------------------------------------------------------------
  // Static assets
  // -------------------------------------------------------------
  if (method === "GET" && pathname in STATIC_FILES) {
    const entry = STATIC_FILES[pathname]!;
    const filePath = join(PUBLIC_DIR, entry.file);
    if (!existsSync(filePath)) {
      sendJson(res, 404, { error: "static asset missing" });
      return;
    }
    const body = readFileSync(filePath);
    res.writeHead(200, { "Content-Type": entry.type, "Content-Length": body.length });
    res.end(body);
    return;
  }
  if (method === "GET" && pathname === "/favicon.ico") {
    res.writeHead(204);
    res.end();
    return;
  }

  // -------------------------------------------------------------
  // API
  // -------------------------------------------------------------
  if (method === "GET" && pathname === "/api/catalogue") {
    sendJson(res, 200, FAMILIES);
    return;
  }

  if (method === "GET" && pathname === "/api/master-prompt") {
    sendJson(res, 200, { text: MASTER_PROMPT });
    return;
  }

  if (method === "GET" && pathname === "/api/state") {
    sendJson(res, 200, { state: loadState(), manifestCurrent: manifestSnapshot() });
    return;
  }

  if (method === "GET" && pathname === "/api/next") {
    const next = pickNextAsset(FAMILIES, loadState());
    sendJson(res, 200, { assetId: next?.assetId ?? null });
    return;
  }

  if (method === "GET" && pathname === "/api/contact-sheet") {
    const html = buildContactSheetHtml();
    mkdirSync(dirname(CONTACT_SHEET_PATH), { recursive: true });
    writeFileSync(CONTACT_SHEET_PATH, html, "utf8");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Content-Length": Buffer.byteLength(html) });
    res.end(html);
    return;
  }

  const promptMatch = /^\/api\/prompt\/(.+)$/.exec(pathname);
  if (method === "GET" && promptMatch?.[1]) {
    const assetId = decodeURIComponent(promptMatch[1]);
    const entry = findAsset(assetId);
    if (!entry) {
      sendJson(res, 404, { error: `unknown assetId: ${assetId}` });
      return;
    }
    sendJson(res, 200, { text: buildAssetPrompt(entry) });
    return;
  }

  const statusMatch = /^\/api\/status\/(.+)$/.exec(pathname);
  if (method === "POST" && statusMatch?.[1]) {
    const assetId = decodeURIComponent(statusMatch[1]);
    const entry = findAsset(assetId);
    if (!entry) {
      sendJson(res, 404, { error: `unknown assetId: ${assetId}` });
      return;
    }
    const body = await readJsonBody<{ status: StudioStatus; notes?: string }>(req);
    if (!STUDIO_STATUSES.includes(body.status)) {
      sendJson(res, 400, { error: `invalid status: ${String(body.status)}` });
      return;
    }
    const state = setStatus(assetId, body.status, { notes: body.notes });
    sendJson(res, 200, { state: state[assetId] });
    return;
  }

  const pasteMatch = /^\/api\/paste\/(.+)$/.exec(pathname);
  if (method === "POST" && pasteMatch?.[1]) {
    const assetId = decodeURIComponent(pasteMatch[1]);
    const entry = findAsset(assetId);
    if (!entry) {
      sendJson(res, 404, { error: `unknown assetId: ${assetId}` });
      return;
    }
    let buffer: Buffer;
    try {
      buffer = await readBody(req, MAX_UPLOAD_BYTES);
    } catch {
      sendJson(res, 413, { error: "image too large" });
      return;
    }
    const info = inspectImage(buffer);
    if (!info) {
      sendJson(res, 400, { error: "unrecognised image format -- expected PNG, WEBP or JPEG" });
      return;
    }
    const extension = info.format === "jpeg" ? "jpg" : info.format;
    const stagingPath = resolveStagingPath(assetId, extension);
    mkdirSync(dirname(stagingPath), { recursive: true });
    writeFileSync(stagingPath, buffer);
    setStatus(assetId, "IMAGE_PASTED");
    sendJson(res, 200, {
      format: info.format,
      mimeType: info.mimeType,
      width: info.width,
      height: info.height,
      hasAlpha: info.hasAlpha,
      byteLength: info.byteLength,
      approxSize: formatApproxSize(info.byteLength),
    });
    return;
  }

  const approveMatch = /^\/api\/approve\/(.+)$/.exec(pathname);
  if (method === "POST" && approveMatch?.[1]) {
    const assetId = decodeURIComponent(approveMatch[1]);
    const entry = findAsset(assetId);
    if (!entry) {
      sendJson(res, 404, { error: `unknown assetId: ${assetId}` });
      return;
    }
    const body = await readJsonBody<{ versioning?: VersioningChoice }>(req);

    let stagedPath: string | null = null;
    for (const ext of ["png", "webp", "jpg", "jpeg"]) {
      const candidate = resolveStagingPath(assetId, ext);
      if (existsSync(candidate)) {
        stagedPath = candidate;
        break;
      }
    }
    if (!stagedPath) {
      sendJson(res, 400, { error: "no pasted image found for this asset -- paste/drop an image before approving" });
      return;
    }

    const stagedBuffer = readFileSync(stagedPath);
    const result = approveStagedImage({ entry, stagedBuffer, versioning: body.versioning });

    if (result.status === "conflict") {
      sendJson(res, 409, { conflict: true, existing: result.existing });
      return;
    }

    setStatus(assetId, "SAVED");
    sendJson(res, 200, { manifestEntry: result.manifestEntry, outputPath: relative(process.cwd(), result.outputPath) });
    return;
  }

  const openMatch = /^\/api\/open-file\/(.+)$/.exec(pathname);
  if (method === "POST" && openMatch?.[1]) {
    const assetId = decodeURIComponent(openMatch[1]);
    const current = currentManifestEntry(assetId);
    if (!current) {
      sendJson(res, 404, { error: "no approved/saved file recorded for this asset" });
      return;
    }
    if (!current.outputPath.startsWith(APPROVED_ASSET_ROOT)) {
      sendJson(res, 400, { error: "refusing to open a path outside the approved asset root" });
      return;
    }
    openApprovedFile(current.outputPath);
    sendJson(res, 200, { opened: current.outputPath });
    return;
  }

  sendJson(res, 404, { error: "not found" });
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  server.listen(PORT, HOST, () => {
    const url = `http://${HOST}:${PORT}/`;
    console.log("ALP Visual Production Studio");
    console.log(`  Local only: ${url}`);
    console.log(`  Approved asset root: ${APPROVED_ASSET_ROOT}`);
    console.log("  Press Ctrl+C to stop.");
    if (!process.env.STUDIO_NO_OPEN) openInBrowser(url);
  });
}

export { server };
