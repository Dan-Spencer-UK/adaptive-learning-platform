/**
 * CC-12H: keeps tools/qa/lesson-ids.txt (the flat lesson-id list the
 * runtime QA walker reads, so that Bash/adb tooling doesn't need a TS
 * runtime against the mobile app's path-aliased source) honest against
 * the real bundled release -- if a lesson is ever added, removed, or
 * renamed in the local content projection without updating that file,
 * this fails loudly rather than silently leaving the QA walker's
 * coverage stale.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { bundledContentReleaseId, getLocalReleaseLessons } from "./local-content-registry";

describe("tools/qa/lesson-ids.txt", () => {
  it("matches the real bundled release's lesson ids exactly", () => {
    const manifestPath = join(__dirname, "..", "..", "..", "..", "..", "tools", "qa", "lesson-ids.txt");
    const fileIds = readFileSync(manifestPath, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const releaseIds = getLocalReleaseLessons(bundledContentReleaseId()).map((lesson) => lesson.id);

    expect(new Set(fileIds)).toEqual(new Set(releaseIds));
    expect(fileIds.length).toBe(releaseIds.length);
  });
});
