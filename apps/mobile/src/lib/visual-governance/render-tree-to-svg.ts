/**
 * CC-05D: converts the real `react-native-svg` element tree (the exact
 * `toJSON()` output `@testing-library/react-native` already produces --
 * the same tree the existing structural-snapshot tests assert against,
 * see apps/mobile/src/components/__snapshot-tests__/) into a real,
 * standalone, openable `<svg>...</svg>` document.
 *
 * This is deliberately NOT a JSX/source-code serialiser -- it walks the
 * component's real, computed post-render prop tree (actual numeric
 * coordinates, actual resolved colours, actual text content), which is
 * a materially stronger audit subject than source (see CC-05D
 * architecture doc §D). No RN import here -- this is a pure function
 * over plain data, unit-testable without any native module mock.
 *
 * Deliberately throws on an unrecognised element type rather than
 * silently dropping it -- an instructional-visual audit tool that
 * silently produces an incomplete image is exactly the failure class
 * this whole package exists to prevent.
 */

export interface RenderTreeNode {
  readonly type: string;
  readonly props: Record<string, unknown>;
  readonly children: readonly (RenderTreeNode | string)[] | null;
}

const STROKE_LINECAP_BY_CODE: Record<number, string> = { 0: "butt", 1: "round", 2: "square" };
const STROKE_LINEJOIN_BY_CODE: Record<number, string> = { 0: "miter", 1: "round", 2: "bevel" };

function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** react-native-svg's processColor output: a 32-bit 0xAARRGGBB integer wrapped as { payload, type }. */
function colorToHex(value: unknown): string {
  if (value === null || value === undefined) return "none";
  if (typeof value === "object" && value !== null && "payload" in value) {
    const payload = (value as { payload: number }).payload;
    const hex8 = (payload >>> 0).toString(16).padStart(8, "0");
    const alpha = hex8.slice(0, 2);
    const rgb = hex8.slice(2);
    return alpha === "ff" ? `#${rgb}` : `#${rgb}${alpha}`;
  }
  return String(value);
}

function propListIncludes(props: Record<string, unknown>, key: string): boolean {
  const list = props.propList;
  return Array.isArray(list) && list.includes(key);
}

function paintAttrs(props: Record<string, unknown>): string {
  const attrs: string[] = [];
  if (propListIncludes(props, "fill")) attrs.push(`fill="${colorToHex(props.fill)}"`);
  if (propListIncludes(props, "stroke")) attrs.push(`stroke="${colorToHex(props.stroke)}"`);
  if (propListIncludes(props, "strokeWidth") && typeof props.strokeWidth === "number") attrs.push(`stroke-width="${props.strokeWidth}"`);
  if (propListIncludes(props, "strokeLinecap") && typeof props.strokeLinecap === "number") {
    attrs.push(`stroke-linecap="${STROKE_LINECAP_BY_CODE[props.strokeLinecap] ?? "butt"}"`);
  }
  if (propListIncludes(props, "strokeLinejoin") && typeof props.strokeLinejoin === "number") {
    attrs.push(`stroke-linejoin="${STROKE_LINEJOIN_BY_CODE[props.strokeLinejoin] ?? "miter"}"`);
  }
  return attrs.length ? " " + attrs.join(" ") : "";
}

function firstOf(value: unknown): number | undefined {
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === "number") return value[0];
  return undefined;
}

function renderChildren(children: RenderTreeNode["children"]): string {
  if (!children) return "";
  return children.map((child) => (typeof child === "string" ? escapeXml(child) : renderNode(child))).join("");
}

function renderNode(node: RenderTreeNode): string {
  const p = node.props;
  switch (node.type) {
    case "RNSVGSvgView": {
      const width = p.width;
      const height = p.height;
      const vbWidth = p.vbWidth ?? width;
      const vbHeight = p.vbHeight ?? height;
      const minX = p.minX ?? 0;
      const minY = p.minY ?? 0;
      const accessibilityLabel = typeof p.accessibilityLabel === "string" ? p.accessibilityLabel : undefined;
      const titleEl = accessibilityLabel ? `<title>${escapeXml(accessibilityLabel)}</title>` : "";
      const ariaAttrs = accessibilityLabel ? ` role="img" aria-label="${escapeXml(accessibilityLabel)}"` : "";
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${minX} ${minY} ${vbWidth} ${vbHeight}"${ariaAttrs}>${titleEl}${renderChildren(node.children)}</svg>`;
    }
    case "RNSVGGroup":
      return `<g${paintAttrs(p)}>${renderChildren(node.children)}</g>`;
    case "RNSVGPath":
      return `<path d="${escapeXml(String(p.d ?? ""))}"${paintAttrs(p)} />`;
    case "RNSVGLine":
      return `<line x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}"${paintAttrs(p)} />`;
    case "RNSVGCircle":
      return `<circle cx="${p.cx}" cy="${p.cy}" r="${p.r}"${paintAttrs(p)} />`;
    case "RNSVGRect": {
      const rxAttr = typeof p.rx === "number" ? ` rx="${p.rx}"` : "";
      return `<rect x="${p.x}" y="${p.y}" width="${p.width}" height="${p.height}"${rxAttr}${paintAttrs(p)} />`;
    }
    case "RNSVGText": {
      const x = firstOf(p.x) ?? 0;
      const y = firstOf(p.y) ?? 0;
      const font = (p.font ?? {}) as Record<string, unknown>;
      const fontAttrs: string[] = [];
      if (typeof font.fontSize === "number") fontAttrs.push(`font-size="${font.fontSize}"`);
      if (font.fontWeight) fontAttrs.push(`font-weight="${font.fontWeight}"`);
      if (font.textAnchor) fontAttrs.push(`text-anchor="${font.textAnchor}"`);
      return `<text x="${x}" y="${y}"${paintAttrs(p)}${fontAttrs.length ? " " + fontAttrs.join(" ") : ""}>${renderChildren(node.children)}</text>`;
    }
    case "RNSVGTSpan": {
      const content = typeof p.content === "string" ? p.content : "";
      return `<tspan${paintAttrs(p)}>${escapeXml(content)}</tspan>`;
    }
    default:
      throw new Error(
        `render-tree-to-svg: unrecognised element type "${node.type}" -- add explicit handling rather than silently dropping it (an instructional-visual audit that silently omits part of the image is worse than one that fails loudly).`,
      );
  }
}

/** Entry point: the root of an RTL `toJSON()` tree for a react-native-svg component -> a standalone SVG document string. */
export function renderTreeToSvg(root: RenderTreeNode): string {
  if (root.type !== "RNSVGSvgView") {
    throw new Error(`render-tree-to-svg: expected the root node to be RNSVGSvgView, got "${root.type}". Pass the diagram component's own toJSON() output, not a wrapping <View>.`);
  }
  return renderNode(root);
}
