/**
 * CC-11.8 §20: the ONLY file in this tool permitted to construct a Gemini
 * client or read GEMINI_API_KEY. Gemini is the implementation renderer in
 * the automated visual-production pipeline (docs/architecture/
 * PREMIUM-INSTRUCTIONAL-VISUAL-PRODUCTION-PIPELINE.md §20) -- it receives
 * an approved technical reference image, the canonical ALP style guide,
 * and an individual asset contract, and redraws/re-illustrates within
 * governed style. It is never technical authority (ADR-0004): the caller
 * is responsible for supplying immutable facts and prohibited changes in
 * the prompt, and for independently auditing the result afterward -- this
 * module only performs the API call.
 *
 * The API key is read once from `process.env.GEMINI_API_KEY` and never
 * logged, returned, echoed into an error message, or written to any file.
 */

import { GoogleGenAI, Modality } from "@google/genai";

export const GEMINI_IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL_OVERRIDE ?? "gemini-3.1-flash-image";

export interface InlineImage {
  mimeType: string;
  /** Raw bytes, never base64 -- this module handles the base64 encoding required by the API so callers never have to reason about it (or accidentally log it). */
  bytes: Buffer;
}

export interface GenerationRequest {
  /** The full text prompt -- see prompt-builder-gemini.ts for how this is constructed from the style guide + asset contract. */
  promptText: string;
  /** The actual approved technical-reference image bytes (never a URL -- ADR-0004 / pipeline doc §20). */
  technicalReference: InlineImage;
  /** An approved style-reference image, if one exists yet (docs/design/visual-style-references/). Optional -- the text style guide alone is sufficient. */
  styleReference?: InlineImage;
}

export interface GenerationResult {
  image: InlineImage;
  /** The model's own text response accompanying the image, if any (e.g. a caption or note) -- for logging/debugging only, never trusted as proof of correctness (task brief E6: "Do not trust labels as proof"). */
  responseText?: string;
  model: string;
  requestedAt: string;
}

function requireApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is not set in the environment. Refusing to proceed -- never falls back to a hard-coded or logged key.");
  }
  return key;
}

// Constructed fresh per call (never at module load, and never cached) so
// importing this file never requires the key to be present -- only
// actually calling generateImage does -- and so tests can exercise both
// the missing-key and present-key paths without cross-test state.
function client(): GoogleGenAI {
  return new GoogleGenAI({ apiKey: requireApiKey() });
}

/**
 * One Gemini call. Throws on any API error (network, auth, safety-block) --
 * callers decide whether that counts toward the bounded retry budget (task
 * brief E7: max 1 initial + 1 automatic correction attempt per asset, 4
 * total across the whole two-asset proof).
 */
export async function generateImage(request: GenerationRequest): Promise<GenerationResult> {
  const parts: Array<{ text?: string } | { inlineData: { mimeType: string; data: string } }> = [
    { text: request.promptText },
    { inlineData: { mimeType: request.technicalReference.mimeType, data: request.technicalReference.bytes.toString("base64") } },
  ];
  if (request.styleReference) {
    parts.push({ inlineData: { mimeType: request.styleReference.mimeType, data: request.styleReference.bytes.toString("base64") } });
  }

  const requestedAt = new Date().toISOString();
  const response = await client().models.generateContent({
    model: GEMINI_IMAGE_MODEL,
    contents: [{ role: "user", parts }],
    config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
  });

  const candidateParts = response.candidates?.[0]?.content?.parts ?? [];
  const imagePart = candidateParts.find((p) => p.inlineData?.data);
  if (!imagePart?.inlineData?.data) {
    const textParts = candidateParts
      .map((p) => p.text)
      .filter(Boolean)
      .join(" ");
    throw new Error(`Gemini returned no image data. Model text response: ${textParts || "(none)"}`);
  }

  const responseText = candidateParts
    .map((p) => p.text)
    .filter(Boolean)
    .join(" ");

  return {
    image: { mimeType: imagePart.inlineData.mimeType ?? "image/png", bytes: Buffer.from(imagePart.inlineData.data, "base64") },
    responseText: responseText || undefined,
    model: GEMINI_IMAGE_MODEL,
    requestedAt,
  };
}
