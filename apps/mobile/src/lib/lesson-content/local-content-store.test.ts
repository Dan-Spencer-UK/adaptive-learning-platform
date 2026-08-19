/**
 * Logic-level test for the local content-library store, run against the
 * in-memory Jest mock (see storage/db.test.ts's header comment) -- proves
 * the ready/invalid state-machine and the LOCAL_READY lookup are correct.
 * Real on-device persistence-across-restart remains a separate real-
 * device/emulator verification item.
 */
import * as mockExpoSqlite from "../storage/__mocks__/expo-sqlite-jest-mock";
import { resetFoundationDbHandleForTests } from "../storage/db";
import type { LocalContentInventory } from "./content-availability";
import { getLessonContentRecord, isLessonAvailableOffline, prepareLessonContent } from "./local-content-store";

jest.mock("expo-sqlite", () => mockExpoSqlite);

function manifest(overrides: Partial<Parameters<typeof prepareLessonContent>[0]> = {}) {
  return {
    lessonId: "lesson.test",
    lessonVersion: 1,
    contentRelease: "release.1",
    assertionFamilyIds: [],
    assertionIdentifiers: [],
    capabilityIds: [],
    questionBlueprintIds: ["qb.a"],
    formulaFamilyIds: [],
    workedExampleBlueprintIds: [],
    visualAidBlueprintIds: [],
    diagramBlueprintIds: [],
    misconceptionIdentifiers: [],
    ...overrides,
  };
}

function fullInventory(): LocalContentInventory {
  return {
    questionBlueprintIds: new Set(["qb.a"]),
    formulaFamilyIds: new Set(),
    workedExampleBlueprintIds: new Set(),
    visualAidBlueprintIds: new Set(),
    diagramBlueprintIds: new Set(),
    assertionIdentifiersWithStatements: new Set(),
    misconceptionIdentifiersWithDescriptions: new Set(),
  };
}

function emptyInventory(): LocalContentInventory {
  return {
    questionBlueprintIds: new Set(),
    formulaFamilyIds: new Set(),
    workedExampleBlueprintIds: new Set(),
    visualAidBlueprintIds: new Set(),
    diagramBlueprintIds: new Set(),
    assertionIdentifiersWithStatements: new Set(),
    misconceptionIdentifiersWithDescriptions: new Set(),
  };
}

describe("local content store", () => {
  beforeEach(() => {
    resetFoundationDbHandleForTests();
  });

  it("marks a lesson ready when every dependency is present in the inventory", async () => {
    const record = await prepareLessonContent(manifest(), fullInventory());
    expect(record.status).toBe("ready");
    expect(record.missingDependencies).toEqual([]);
    expect(record.preparedAt).not.toBeNull();
  });

  it("marks a lesson invalid, with the missing dependencies listed, when the inventory is incomplete", async () => {
    const record = await prepareLessonContent(manifest(), emptyInventory());
    expect(record.status).toBe("invalid");
    expect(record.missingDependencies).toEqual([{ category: "questionBlueprint", id: "qb.a" }]);
    expect(record.preparedAt).toBeNull();
  });

  it("isLessonAvailableOffline is false before preparation, true after a ready preparation, false after an invalid one", async () => {
    expect(await isLessonAvailableOffline("lesson.test", 1, "release.1")).toBe(false);

    await prepareLessonContent(manifest(), fullInventory());
    expect(await isLessonAvailableOffline("lesson.test", 1, "release.1")).toBe(true);

    await prepareLessonContent(manifest(), emptyInventory());
    expect(await isLessonAvailableOffline("lesson.test", 1, "release.1")).toBe(false);
  });

  it("tracks separate content releases for the same lesson independently", async () => {
    await prepareLessonContent(manifest({ contentRelease: "release.1" }), fullInventory());
    await prepareLessonContent(manifest({ contentRelease: "release.2" }), emptyInventory());

    expect(await isLessonAvailableOffline("lesson.test", 1, "release.1")).toBe(true);
    expect(await isLessonAvailableOffline("lesson.test", 1, "release.2")).toBe(false);
  });

  it("getLessonContentRecord returns null for a lesson that was never prepared", async () => {
    expect(await getLessonContentRecord("lesson.never-prepared", 1, "release.1")).toBeNull();
  });
});
