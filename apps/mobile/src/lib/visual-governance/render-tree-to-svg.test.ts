import { renderTreeToSvg, type RenderTreeNode } from "./render-tree-to-svg";

const BLACK_ARGB = { payload: 0xff000000, type: 0 };
const BLUE_ARGB = { payload: 0xff4c8dff, type: 0 };

function svgRoot(children: RenderTreeNode["children"], overrides: Partial<RenderTreeNode["props"]> = {}): RenderTreeNode {
  return {
    type: "RNSVGSvgView",
    props: { width: 100, height: 80, vbWidth: 100, vbHeight: 80, minX: 0, minY: 0, ...overrides },
    children,
  };
}

describe("renderTreeToSvg", () => {
  it("throws if the root node is not RNSVGSvgView", () => {
    expect(() => renderTreeToSvg({ type: "View", props: {}, children: null })).toThrow(/expected the root node to be RNSVGSvgView/);
  });

  it("produces a well-formed <svg> root with width/height/viewBox", () => {
    const svg = renderTreeToSvg(svgRoot([]));
    expect(svg).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="100" height="80" viewBox="0 0 100 80"/);
    expect(svg).toContain("</svg>");
  });

  it("embeds the accessibility label as both a <title> and aria-label", () => {
    const svg = renderTreeToSvg(svgRoot([], { accessibilityLabel: "Series circuit with current flowing left to right" }));
    expect(svg).toContain('aria-label="Series circuit with current flowing left to right"');
    expect(svg).toContain("<title>Series circuit with current flowing left to right</title>");
  });

  it("converts RNSVGLine into a real <line> with numeric coordinates", () => {
    const node: RenderTreeNode = {
      type: "RNSVGLine",
      props: { x1: 24, y1: 24, x2: 396, y2: 24, propList: ["stroke", "strokeWidth"], stroke: BLACK_ARGB, strokeWidth: 2 },
      children: null,
    };
    const svg = renderTreeToSvg(svgRoot([node]));
    expect(svg).toContain('<line x1="24" y1="24" x2="396" y2="24" stroke="#000000" stroke-width="2" />');
  });

  it("converts an RNSVGGroup ARGB payload into the correct #RRGGBB (alpha=ff case)", () => {
    const node: RenderTreeNode = {
      type: "RNSVGPath",
      props: { d: "M0,0 L10,10", propList: ["fill", "stroke"], fill: null, stroke: BLUE_ARGB },
      children: null,
    };
    const svg = renderTreeToSvg(svgRoot([node]));
    // 0xff4c8dff -> alpha ff, rgb 4c8dff -> "#4c8dff"
    expect(svg).toContain('stroke="#4c8dff"');
    expect(svg).toContain('fill="none"');
  });

  it("preserves an explicit path 'd' attribute exactly, including negative/decimal coordinates", () => {
    const node: RenderTreeNode = {
      type: "RNSVGPath",
      props: { d: "M206 66 199.93782217350892 69.5 199.93782217350892 62.5z", propList: ["fill"], fill: BLACK_ARGB },
      children: null,
    };
    const svg = renderTreeToSvg(svgRoot([node]));
    expect(svg).toContain('d="M206 66 199.93782217350892 69.5 199.93782217350892 62.5z"');
  });

  it("only emits paint attributes that were actually in propList -- never fabricates a fill/stroke that was never set", () => {
    const node: RenderTreeNode = {
      type: "RNSVGCircle",
      props: { cx: 10, cy: 10, r: 5, propList: ["stroke"], stroke: BLACK_ARGB },
      children: null,
    };
    const svg = renderTreeToSvg(svgRoot([node]));
    expect(svg).toContain('<circle cx="10" cy="10" r="5" stroke="#000000" />');
    expect(svg).not.toContain("fill=");
  });

  it("maps numeric strokeLinecap codes to real SVG keyword values", () => {
    const node: RenderTreeNode = {
      type: "RNSVGLine",
      props: { x1: 0, y1: 0, x2: 10, y2: 10, propList: ["stroke", "strokeLinecap"], stroke: BLACK_ARGB, strokeLinecap: 1 },
      children: null,
    };
    const svg = renderTreeToSvg(svgRoot([node]));
    expect(svg).toContain('stroke-linecap="round"');
  });

  it("renders RNSVGText/RNSVGTSpan as real <text>/<tspan> with font attributes and escaped content", () => {
    const node: RenderTreeNode = {
      type: "RNSVGText",
      props: {
        x: [130],
        y: [36],
        propList: ["fill"],
        fill: BLUE_ARGB,
        font: { fontSize: 12, fontWeight: "700", textAnchor: "middle" },
      },
      children: [
        {
          type: "RNSVGTSpan",
          props: { content: "Force: up & <down>" },
          children: null,
        },
      ],
    };
    const svg = renderTreeToSvg(svgRoot([node]));
    expect(svg).toContain('<text x="130" y="36" fill="#4c8dff" font-size="12" font-weight="700" text-anchor="middle">');
    expect(svg).toContain("Force: up &amp; &lt;down&gt;");
  });

  it("recurses through nested RNSVGGroup/Path structures faithfully (structural fidelity, not a flattened approximation)", () => {
    const inner: RenderTreeNode = { type: "RNSVGCircle", props: { cx: 1, cy: 2, r: 3, propList: ["fill"], fill: BLACK_ARGB }, children: null };
    const group: RenderTreeNode = { type: "RNSVGGroup", props: {}, children: [inner] };
    const svg = renderTreeToSvg(svgRoot([group]));
    expect(svg).toContain("<g>");
    expect(svg).toContain('<circle cx="1" cy="2" r="3" fill="#000000" />');
    expect(svg).toContain("</g>");
  });

  it("throws loudly on an unrecognised element type rather than silently dropping it", () => {
    const node: RenderTreeNode = { type: "RNSVGSomeFutureElement", props: {}, children: null };
    expect(() => renderTreeToSvg(svgRoot([node]))).toThrow(/unrecognised element type/);
  });

  it("is deterministic -- the same tree always produces byte-identical SVG", () => {
    const node: RenderTreeNode = {
      type: "RNSVGLine",
      props: { x1: 1, y1: 2, x2: 3, y2: 4, propList: ["stroke"], stroke: BLACK_ARGB },
      children: null,
    };
    const first = renderTreeToSvg(svgRoot([node]));
    const second = renderTreeToSvg(svgRoot([node]));
    expect(first).toBe(second);
  });
});
