import { describe, expect, it } from "vitest";
import { contentReleaseManifestSchema, contentReleaseSchema } from "./content-release.ts";

function release(overrides: Record<string, unknown> = {}) {
  return {
    id: "release.test.v1",
    schemaVersion: 1,
    lessons: [{ lessonId: "lesson.a", lessonVersion: 1 }],
    knowledgeCorpusId: "corpus.knowledge.test",
    pedagogyCorpusId: "corpus.pedagogy.test",
    questionBlueprintVersion: 1,
    ...overrides,
  };
}

describe("contentReleaseSchema", () => {
  it("accepts a valid release", () => {
    const parsed = contentReleaseSchema.parse(release());
    expect(parsed.id).toBe("release.test.v1");
    expect(parsed.lessons).toHaveLength(1);
  });

  it("rejects an empty membership -- a release must name at least one lesson", () => {
    expect(() => contentReleaseSchema.parse(release({ lessons: [] }))).toThrow();
  });

  it("rejects duplicate membership for the same lesson id (a release names exactly one version of a lesson)", () => {
    expect(() =>
      contentReleaseSchema.parse(
        release({
          lessons: [
            { lessonId: "lesson.a", lessonVersion: 1 },
            { lessonId: "lesson.a", lessonVersion: 2 },
          ],
        }),
      ),
    ).toThrow(/duplicate membership/);
  });

  it("rejects a non-positive lesson version or blueprint version", () => {
    expect(() => contentReleaseSchema.parse(release({ lessons: [{ lessonId: "lesson.a", lessonVersion: 0 }] }))).toThrow();
    expect(() => contentReleaseSchema.parse(release({ questionBlueprintVersion: 0 }))).toThrow();
  });

  it("rejects an unknown manifest schema version", () => {
    expect(() => contentReleaseSchema.parse(release({ schemaVersion: 2 }))).toThrow();
  });
});

describe("contentReleaseManifestSchema", () => {
  it("accepts multiple distinct releases (two lessons may live in one release; test releases stay independently resolvable)", () => {
    const parsed = contentReleaseManifestSchema.parse({
      releases: [
        release({
          id: "release.a.v1",
          lessons: [
            { lessonId: "lesson.a", lessonVersion: 1 },
            { lessonId: "lesson.b", lessonVersion: 1 },
          ],
        }),
        release({ id: "release.b.v1" }),
      ],
    });
    expect(parsed.releases).toHaveLength(2);
  });

  it("rejects duplicate release ids", () => {
    expect(() => contentReleaseManifestSchema.parse({ releases: [release(), release()] })).toThrow(/duplicate content release id/);
  });
});
