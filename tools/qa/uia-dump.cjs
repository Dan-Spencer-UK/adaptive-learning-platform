#!/usr/bin/env node
/**
 * CC-12H: small, dependency-free helper for parsing a `uiautomator dump`
 * XML snapshot -- used by tools/qa/lesson-runtime-walk.sh. Regex/sed-based
 * attribute extraction on the raw XML (the approach the original
 * root-level smoke_walk.sh used) breaks on any attribute value containing
 * regex metacharacters (parentheses, brackets) or non-ASCII symbols
 * (Ω, ×, °) that governed content genuinely uses -- e.g. matching a
 * content-desc like "V (voltage): V" needs the parentheses treated
 * literally, not as a regex group. A real per-node attribute parse avoids
 * that whole class of fragile escaping bugs.
 *
 * Every `<node .../>` tag in the dump is flattened onto one line by
 * uiautomator itself, so a simple non-greedy `<node ... />` regex per tag
 * is sufficient -- no real XML parser dependency needed.
 *
 * Commands:
 *   node uia-dump.js <dumpFile> find <attr> <exactValue>
 *     Prints "cx,cy" (bounds centre) of the LAST node whose <attr> equals
 *     <exactValue> exactly (uiautomator lists nodes in paint order; the
 *     LAST match is the top-most/most-recently-drawn one -- the same
 *     convention the original smoke_walk.sh used). Exits 1, prints
 *     nothing, if no node matches.
 *   node uia-dump.js <dumpFile> text <attr> <exactValue>
 *     Prints the `text` attribute of the LAST node whose <attr> equals
 *     <exactValue> exactly -- used to read a testID-tagged debug node's
 *     own payload (e.g. the CC-12H debug overlay's answer readout).
 *   node uia-dump.js <dumpFile> list <attr>
 *     Prints every distinct non-empty <attr> value, one per line, in
 *     document order.
 */
const fs = require("fs");

const [, , dumpFile, command, attr, ...rest] = process.argv;

function decodeXmlEntities(value) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_m, code) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, "&");
}

function parseNodes(xml) {
  const nodes = [];
  const nodeRegex = /<node\b[^>]*?\/?>/g;
  let match;
  while ((match = nodeRegex.exec(xml)) !== null) {
    const tag = match[0];
    const attrs = {};
    const attrRegex = /([a-zA-Z-]+)="([^"]*)"/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(tag)) !== null) {
      attrs[attrMatch[1]] = decodeXmlEntities(attrMatch[2]);
    }
    nodes.push(attrs);
  }
  return nodes;
}

function boundsCentre(boundsAttr) {
  const m = /\[(\d+),(\d+)\]\[(\d+),(\d+)\]/.exec(boundsAttr ?? "");
  if (!m) return null;
  const [, x1, y1, x2, y2] = m.map(Number);
  return { cx: Math.round((x1 + x2) / 2), cy: Math.round((y1 + y2) / 2) };
}

function main() {
  if (!dumpFile || !command || !attr) {
    process.stderr.write("usage: uia-dump.js <dumpFile> <find|list> <attr> [value]\n");
    process.exit(2);
  }
  const xml = fs.readFileSync(dumpFile, "utf8");
  const nodes = parseNodes(xml);

  if (command === "find") {
    const value = rest.join(" ");
    const matches = nodes.filter((n) => n[attr] === value);
    if (matches.length === 0) process.exit(1);
    const last = matches[matches.length - 1];
    const centre = boundsCentre(last.bounds);
    if (!centre) process.exit(1);
    process.stdout.write(`${centre.cx},${centre.cy}\n`);
    return;
  }

  if (command === "find-prefix") {
    // Like "find", but matches any node whose <attr> STARTS WITH <value>
    // -- used for NumericAnswerInput's accessibilityLabel, which is
    // "Your answer, in {unitSymbol}" (the unit varies per blueprint, so an
    // exact match isn't possible from a static QA script).
    const value = rest.join(" ");
    const matches = nodes.filter((n) => typeof n[attr] === "string" && n[attr].startsWith(value));
    if (matches.length === 0) process.exit(1);
    const last = matches[matches.length - 1];
    const centre = boundsCentre(last.bounds);
    if (!centre) process.exit(1);
    process.stdout.write(`${centre.cx},${centre.cy}\n`);
    return;
  }

  if (command === "text") {
    // Prints the `text` attribute of the LAST node whose <attr> equals
    // <value> exactly -- used to read the debug overlay's own testID
    // (resource-id) nodes, whose payload is their `text`, not a tappable
    // content-desc.
    const value = rest.join(" ");
    const matches = nodes.filter((n) => n[attr] === value);
    if (matches.length === 0) process.exit(1);
    const last = matches[matches.length - 1];
    process.stdout.write(`${last.text ?? ""}\n`);
    return;
  }

  if (command === "list") {
    const seen = new Set();
    for (const n of nodes) {
      const value = n[attr];
      if (value && !seen.has(value)) {
        seen.add(value);
        process.stdout.write(`${value}\n`);
      }
    }
    return;
  }

  if (command === "list-clickable") {
    // Like "list", but restricted to nodes with clickable="true" -- used
    // to pick a genuinely tappable wrong answer option, never a
    // non-interactive text node (a working-shown box, a prompt line) that
    // happens to also carry a content-desc for screen-reader purposes.
    const seen = new Set();
    for (const n of nodes) {
      if (n.clickable !== "true") continue;
      const value = n[attr];
      if (value && !seen.has(value)) {
        seen.add(value);
        process.stdout.write(`${value}\n`);
      }
    }
    return;
  }

  process.stderr.write(`unknown command "${command}"\n`);
  process.exit(2);
}

main();
