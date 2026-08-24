import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const FAKE_KEY = "test-fake-gemini-key-do-not-leak-1234567890";

const mockGenerateContent = vi.fn();
vi.mock("@google/genai", () => ({
  GoogleGenAI: vi.fn().mockImplementation(function MockGoogleGenAI() {
    return { models: { generateContent: mockGenerateContent } };
  }),
  Modality: { IMAGE: "IMAGE", TEXT: "TEXT" },
}));

describe("gemini-client -- CC-11.8 §H targeted tests", () => {
  const originalKey = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    mockGenerateContent.mockReset();
  });

  afterEach(() => {
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
  });

  it("refuses to call the API when GEMINI_API_KEY is not set, and the error never contains a key value", async () => {
    delete process.env.GEMINI_API_KEY;
    const { generateImage } = await import("./gemini-client.ts");
    await expect(generateImage({ promptText: "test", technicalReference: { mimeType: "image/png", bytes: Buffer.from("fake") } })).rejects.toThrow(/GEMINI_API_KEY is not set/);
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  it("attaches the technical reference image as inlineData with correct base64 + mimeType, and never logs/exposes the API key", async () => {
    process.env.GEMINI_API_KEY = FAKE_KEY;
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const fakeImageBytes = Buffer.from("fake-generated-png-bytes");
    mockGenerateContent.mockResolvedValue({
      candidates: [{ content: { parts: [{ text: "note" }, { inlineData: { mimeType: "image/png", data: fakeImageBytes.toString("base64") } }] } }],
    });

    const { generateImage, GEMINI_IMAGE_MODEL } = await import("./gemini-client.ts");
    const refBytes = Buffer.from("fake-reference-bytes");
    const result = await generateImage({ promptText: "draw a magnet", technicalReference: { mimeType: "image/png", bytes: refBytes } });

    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    const call = mockGenerateContent.mock.calls[0]![0];
    expect(call.model).toBe(GEMINI_IMAGE_MODEL);
    const parts = call.contents[0].parts;
    expect(parts[0].text).toBe("draw a magnet");
    expect(parts[1].inlineData.mimeType).toBe("image/png");
    expect(parts[1].inlineData.data).toBe(refBytes.toString("base64"));

    expect(result.image.bytes.equals(fakeImageBytes)).toBe(true);
    expect(result.image.mimeType).toBe("image/png");
    expect(result.responseText).toBe("note");

    // Never log/expose the raw key anywhere.
    const allLoggedText = [...consoleSpy.mock.calls, ...errorSpy.mock.calls].flat().join(" ");
    expect(allLoggedText).not.toContain(FAKE_KEY);
    consoleSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("includes an optional style-reference image as a third part when supplied", async () => {
    process.env.GEMINI_API_KEY = FAKE_KEY;
    mockGenerateContent.mockResolvedValue({
      candidates: [{ content: { parts: [{ inlineData: { mimeType: "image/png", data: Buffer.from("x").toString("base64") } }] } }],
    });
    const { generateImage } = await import("./gemini-client.ts");
    await generateImage({
      promptText: "p",
      technicalReference: { mimeType: "image/png", bytes: Buffer.from("ref") },
      styleReference: { mimeType: "image/png", bytes: Buffer.from("style") },
    });
    const parts = mockGenerateContent.mock.calls[0]![0].contents[0].parts;
    expect(parts).toHaveLength(3);
    expect(parts[2].inlineData.data).toBe(Buffer.from("style").toString("base64"));
  });

  it("throws a clear error (never a silent empty result) when Gemini returns no image data", async () => {
    process.env.GEMINI_API_KEY = FAKE_KEY;
    mockGenerateContent.mockResolvedValue({ candidates: [{ content: { parts: [{ text: "I cannot generate that image." }] } }] });
    const { generateImage } = await import("./gemini-client.ts");
    await expect(generateImage({ promptText: "p", technicalReference: { mimeType: "image/png", bytes: Buffer.from("ref") } })).rejects.toThrow(/no image data/);
  });
});
