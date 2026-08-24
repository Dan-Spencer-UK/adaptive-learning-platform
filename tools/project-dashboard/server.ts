/**
 * CC-11.8 §G -- ALP Project Dashboard: a localhost-only architectural
 * visibility tool (roadmap + platform-flow), built with the same
 * zero-new-server-dependency approach as tools/visual-production-studio
 * (plain node:http + static HTML/CSS/JS; Mermaid itself is loaded
 * client-side from a CDN by the browser, not bundled here).
 *
 * This is a local development/visibility tool only -- never imported by
 * or reachable from any learner-runtime code path. No live GitHub/PM
 * integration; it reads only the version-controlled data sources in
 * this directory (roadmap-data.ts, platform-flow.mmd).
 *
 * Usage: npm run project:dashboard
 */

import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { execFile } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { ROADMAP } from "./roadmap-data.ts";

const PORT = Number(process.env.PROJECT_DASHBOARD_PORT ?? 4757);
const HOST = "127.0.0.1";
const PUBLIC_DIR = fileURLToPath(new URL("./public/", import.meta.url));
const FLOW_PATH = fileURLToPath(new URL("./platform-flow.mmd", import.meta.url));

const STATIC_FILES: Record<string, { file: string; type: string }> = {
  "/": { file: "index.html", type: "text/html; charset=utf-8" },
  "/index.html": { file: "index.html", type: "text/html; charset=utf-8" },
  "/dashboard.css": { file: "dashboard.css", type: "text/css; charset=utf-8" },
  "/dashboard.js": { file: "dashboard.js", type: "text/javascript; charset=utf-8" },
};

function sendJson(res: import("node:http").ServerResponse, statusCode: number, body: unknown): void {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8", "Content-Length": Buffer.byteLength(payload) });
  res.end(payload);
}

function openInBrowser(url: string): void {
  try {
    if (process.platform === "win32") execFile("cmd.exe", ["/c", "start", "", url]);
    else if (process.platform === "darwin") execFile("open", [url]);
    else execFile("xdg-open", [url]);
  } catch {
    // best-effort only
  }
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${HOST}:${PORT}`);
  const pathname = url.pathname;
  const method = req.method ?? "GET";

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

  if (method === "GET" && pathname === "/api/roadmap") {
    sendJson(res, 200, ROADMAP);
    return;
  }

  if (method === "GET" && pathname === "/api/platform-flow") {
    sendJson(res, 200, { mermaid: readFileSync(FLOW_PATH, "utf8") });
    return;
  }

  sendJson(res, 404, { error: "not found" });
});

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) return false;
  return fileURLToPath(import.meta.url) === entryPoint;
}

if (isMainModule()) {
  server.listen(PORT, HOST, () => {
    const url = `http://${HOST}:${PORT}/`;
    console.log("ALP Project Dashboard");
    console.log(`  Local only: ${url}`);
    console.log("  Press Ctrl+C to stop.");
    if (!process.env.DASHBOARD_NO_OPEN) openInBrowser(url);
  });
}

export { server };
