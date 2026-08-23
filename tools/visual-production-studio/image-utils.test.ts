import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";

import {
  computeNextVersion,
  detectImageFormat,
  formatApproxSize,
  inspectImage,
  mimeTypeFor,
  sha256Hex,
  versionedFilename,
} from "./image-utils.ts";

/** Builds a syntactically minimal PNG header -- enough for detectImageFormat/readPngDimensions, not a real decodable image. */
function makeMinimalPng(width: number, height: number, colorType: number): Buffer {
  const buf = Buffer.alloc(26);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buf, 0);
  buf.writeUInt32BE(13, 8);
  buf.write("IHDR", 12, "ascii");
  buf.writeUInt32BE(width, 16);
  buf.writeUInt32BE(height, 20);
  buf[24] = 8;
  buf[25] = colorType;
  return buf;
}

function makeMinimalJpeg(width: number, height: number): Buffer {
  const buf = Buffer.alloc(20);
  buf[0] = 0xff;
  buf[1] = 0xd8; // SOI
  buf[2] = 0xff;
  buf[3] = 0xc0; // SOF0
  buf.writeUInt16BE(0x11, 4); // segment length
  buf[6] = 0x08; // precision
  buf.writeUInt16BE(height, 7);
  buf.writeUInt16BE(width, 9);
  return buf;
}

function makeMinimalWebpVp8x(width: number, height: number, alpha: boolean): Buffer {
  const buf = Buffer.alloc(30);
  buf.write("RIFF", 0, "ascii");
  buf.writeUInt32LE(22, 4);
  buf.write("WEBP", 8, "ascii");
  buf.write("VP8X", 12, "ascii");
  buf.writeUInt32LE(10, 16);
  buf[20] = alpha ? 0x10 : 0x00;
  const w = width - 1;
  const h = height - 1;
  buf[24] = w & 0xff;
  buf[25] = (w >> 8) & 0xff;
  buf[26] = (w >> 16) & 0xff;
  buf[27] = h & 0xff;
  buf[28] = (h >> 8) & 0xff;
  buf[29] = (h >> 16) & 0xff;
  return buf;
}

describe("detectImageFormat", () => {
  it("recognises PNG, WEBP and JPEG magic bytes", () => {
    expect(detectImageFormat(makeMinimalPng(1, 1, 2))).toBe("png");
    expect(detectImageFormat(makeMinimalWebpVp8x(1, 1, false))).toBe("webp");
    expect(detectImageFormat(makeMinimalJpeg(1, 1))).toBe("jpeg");
  });

  it("returns null for an unrecognised buffer", () => {
    expect(detectImageFormat(Buffer.from("not an image"))).toBeNull();
  });
});

describe("inspectImage -- PNG", () => {
  it("reads width/height exactly from the IHDR chunk", () => {
    const info = inspectImage(makeMinimalPng(1024, 768, 2));
    expect(info?.width).toBe(1024);
    expect(info?.height).toBe(768);
    expect(info?.format).toBe("png");
    expect(info?.mimeType).toBe("image/png");
  });

  it("detects alpha presence from colour type (6 = truecolor+alpha, 2 = truecolor no alpha)", () => {
    expect(inspectImage(makeMinimalPng(4, 4, 6))?.hasAlpha).toBe(true);
    expect(inspectImage(makeMinimalPng(4, 4, 2))?.hasAlpha).toBe(false);
  });

  it("reports unknown (null) alpha for palette colour type (alpha is only optionally present via a separate tRNS chunk this tool does not scan)", () => {
    expect(inspectImage(makeMinimalPng(4, 4, 3))?.hasAlpha).toBeNull();
  });
});

describe("inspectImage -- JPEG", () => {
  it("reads width/height from the SOF0 marker and always reports no alpha", () => {
    const info = inspectImage(makeMinimalJpeg(1920, 1080));
    expect(info?.format).toBe("jpeg");
    expect(info?.width).toBe(1920);
    expect(info?.height).toBe(1080);
    expect(info?.hasAlpha).toBe(false);
  });
});

describe("inspectImage -- WEBP", () => {
  it("reads width/height/alpha from a VP8X extended header", () => {
    const info = inspectImage(makeMinimalWebpVp8x(800, 600, true));
    expect(info?.format).toBe("webp");
    expect(info?.width).toBe(800);
    expect(info?.height).toBe(600);
    expect(info?.hasAlpha).toBe(true);
  });

  it("reports no alpha when the VP8X flags byte does not set the alpha bit", () => {
    const info = inspectImage(makeMinimalWebpVp8x(800, 600, false));
    expect(info?.hasAlpha).toBe(false);
  });
});

describe("mimeTypeFor", () => {
  it("maps each format to its correct MIME type", () => {
    expect(mimeTypeFor("png")).toBe("image/png");
    expect(mimeTypeFor("webp")).toBe("image/webp");
    expect(mimeTypeFor("jpeg")).toBe("image/jpeg");
  });
});

describe("sha256Hex (hashing)", () => {
  it("matches node:crypto's own sha256 hex digest for the same bytes", () => {
    const buffer = Buffer.from("ALP premium artwork fixture bytes");
    const expected = createHash("sha256").update(buffer).digest("hex");
    expect(sha256Hex(buffer)).toBe(expected);
  });

  it("produces different hashes for different bytes and the same hash for identical bytes", () => {
    const a = Buffer.from("candidate A");
    const b = Buffer.from("candidate B");
    expect(sha256Hex(a)).not.toBe(sha256Hex(b));
    expect(sha256Hex(a)).toBe(sha256Hex(Buffer.from("candidate A")));
  });
});

describe("formatApproxSize", () => {
  it("formats bytes, kilobytes and megabytes proportionately", () => {
    expect(formatApproxSize(500)).toBe("500 B");
    expect(formatApproxSize(2048)).toBe("2.0 KB");
    expect(formatApproxSize(5 * 1024 * 1024)).toBe("5.00 MB");
  });
});

describe("computeNextVersion / versionedFilename", () => {
  it("returns 1 when no prior version exists", () => {
    expect(computeNextVersion([], "right-hand-grip-teaching-base")).toBe(1);
  });

  it("returns the next free version number given existing versioned files", () => {
    const existing = ["right-hand-grip-teaching-base-v1.png", "right-hand-grip-teaching-base-v2.png", "unrelated-file-v9.png"];
    expect(computeNextVersion(existing, "right-hand-grip-teaching-base")).toBe(3);
  });

  it("ignores files that merely share a filename prefix without matching the full versioned pattern", () => {
    const existing = ["right-hand-grip-teaching-base-extra-v1.png"];
    expect(computeNextVersion(existing, "right-hand-grip-teaching-base")).toBe(1);
  });

  it("versionedFilename builds the exact deterministic stem-v{N}.{ext} pattern", () => {
    expect(versionedFilename("right-hand-grip-teaching-base", 2, "png")).toBe("right-hand-grip-teaching-base-v2.png");
  });
});
