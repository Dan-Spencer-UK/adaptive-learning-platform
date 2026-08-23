/**
 * CC-11.5 §6/§9: pure, dependency-free image inspection and versioning
 * helpers. No image-processing library is added -- every format this tool
 * accepts (PNG/WEBP/JPEG) is sniffed from its own magic bytes/header,
 * which is all task brief §6 actually asks for ("detected dimensions;
 * file type; approximate size; whether transparency exists if
 * detectable").
 */

import { createHash } from "node:crypto";

export type ImageFormat = "png" | "webp" | "jpeg";

export interface ImageInfo {
  format: ImageFormat;
  mimeType: string;
  width: number | null;
  height: number | null;
  byteLength: number;
  hasAlpha: boolean | null;
}

export function detectImageFormat(buffer: Buffer): ImageFormat | null {
  if (buffer.length >= 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return "png";
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpeg";
  return null;
}

export function mimeTypeFor(format: ImageFormat): string {
  if (format === "png") return "image/png";
  if (format === "webp") return "image/webp";
  return "image/jpeg";
}

function readPngDimensions(buffer: Buffer): { width: number; height: number; hasAlpha: boolean | null } | null {
  if (buffer.length < 26) return null;
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  const colorType = buffer[25];
  // 0 grayscale, 2 truecolor, 3 palette (alpha only via optional tRNS chunk -- not scanned, reported unknown), 4 grayscale+alpha, 6 truecolor+alpha.
  const hasAlpha = colorType === 4 || colorType === 6 ? true : colorType === 0 || colorType === 2 ? false : null;
  return { width, height, hasAlpha };
}

function readJpegDimensions(buffer: Buffer): { width: number; height: number } | null {
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    if (marker === undefined) break;
    // SOF0-SOF3, SOF5-SOF7, SOF9-SOF11, SOF13-SOF15 carry dimensions; SOF markers exclude 0xC4 (DHT), 0xC8 (JPG), 0xCC (DAC).
    const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) {
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      return { width, height };
    }
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    const segmentLength = buffer.readUInt16BE(offset + 2);
    offset += 2 + segmentLength;
  }
  return null;
}

function readWebpDimensions(buffer: Buffer): { width: number; height: number; hasAlpha: boolean | null } | null {
  if (buffer.length < 30) return null;
  const chunk = buffer.toString("ascii", 12, 16);

  if (chunk === "VP8X") {
    const flags = buffer[20];
    const width = 1 + (buffer[24]! | (buffer[25]! << 8) | (buffer[26]! << 16));
    const height = 1 + (buffer[27]! | (buffer[28]! << 8) | (buffer[29]! << 16));
    const hasAlpha = flags === undefined ? null : (flags & 0x10) !== 0;
    return { width, height, hasAlpha };
  }

  if (chunk === "VP8L") {
    const b0 = buffer[21]!;
    const b1 = buffer[22]!;
    const b2 = buffer[23]!;
    const b3 = buffer[24]!;
    const width = 1 + (((b1 & 0x3f) << 8) | b0);
    const height = 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
    const hasAlpha = ((b3 >> 4) & 0x01) === 1;
    return { width, height, hasAlpha };
  }

  if (chunk === "VP8 ") {
    // Lossy VP8: 3-byte frame tag at offset 20, 3-byte start code (0x9d 0x01 0x2a) at offset 23-25, then 16-bit LE width/height (top 2 bits are a scale factor, masked off) at offsets 26/28.
    if (buffer[23] === 0x9d && buffer[24] === 0x01 && buffer[25] === 0x2a) {
      const width = buffer.readUInt16LE(26) & 0x3fff;
      const height = buffer.readUInt16LE(28) & 0x3fff;
      return { width, height, hasAlpha: false };
    }
  }

  return null;
}

export function inspectImage(buffer: Buffer): ImageInfo | null {
  const format = detectImageFormat(buffer);
  if (!format) return null;

  let width: number | null = null;
  let height: number | null = null;
  let hasAlpha: boolean | null = null;

  if (format === "png") {
    const dims = readPngDimensions(buffer);
    if (dims) {
      width = dims.width;
      height = dims.height;
      hasAlpha = dims.hasAlpha;
    }
  } else if (format === "jpeg") {
    const dims = readJpegDimensions(buffer);
    if (dims) {
      width = dims.width;
      height = dims.height;
    }
    hasAlpha = false; // baseline JPEG has no alpha channel
  } else if (format === "webp") {
    const dims = readWebpDimensions(buffer);
    if (dims) {
      width = dims.width;
      height = dims.height;
      hasAlpha = dims.hasAlpha;
    }
  }

  return { format, mimeType: mimeTypeFor(format), width, height, byteLength: buffer.length, hasAlpha };
}

export function sha256Hex(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

export function formatApproxSize(byteLength: number): string {
  if (byteLength < 1024) return `${byteLength} B`;
  if (byteLength < 1024 * 1024) return `${(byteLength / 1024).toFixed(1)} KB`;
  return `${(byteLength / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * CC-11.5 §9: given the filenames already present in an asset's output
 * directory and its deterministic stem, computes the next free version
 * number -- e.g. existing ["right-hand-grip-teaching-base-v1.png"] with
 * stem "right-hand-grip-teaching-base" returns 2. Pure function: callers
 * read the directory themselves (state-store.ts / server.ts) and pass the
 * list in, so this stays testable without touching disk.
 */
export function computeNextVersion(existingFilenames: string[], filenameBase: string): number {
  const pattern = new RegExp(`^${filenameBase}-v(\\d+)\\.(png|webp|jpg|jpeg)$`);
  let highest = 0;
  for (const name of existingFilenames) {
    const match = pattern.exec(name);
    if (match?.[1]) {
      const version = Number.parseInt(match[1], 10);
      if (version > highest) highest = version;
    }
  }
  return highest + 1;
}

export function versionedFilename(filenameBase: string, version: number, extension: string): string {
  return `${filenameBase}-v${version}.${extension}`;
}
