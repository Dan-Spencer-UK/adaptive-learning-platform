import * as Haptics from "expo-haptics";
import { triggerHaptic } from "./haptics";

jest.mock("expo-haptics", () => ({
  ImpactFeedbackStyle: { Light: "light" },
  NotificationFeedbackType: { Success: "success", Error: "error" },
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
}));

describe("triggerHaptic", () => {
  afterEach(() => jest.clearAllMocks());

  it("maps 'selection' to Haptics.selectionAsync", () => {
    triggerHaptic("selection");
    expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
  });

  it("maps 'confirmation' to a light impact", () => {
    triggerHaptic("confirmation");
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it("maps 'correct' to a success notification", () => {
    triggerHaptic("correct");
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Success);
  });

  it("maps 'incorrect' to an error notification", () => {
    triggerHaptic("incorrect");
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Error);
  });

  it("never throws when the underlying haptics call rejects", async () => {
    (Haptics.selectionAsync as jest.Mock).mockRejectedValueOnce(new Error("unsupported"));
    expect(() => triggerHaptic("selection")).not.toThrow();
    // Allow the swallowed rejection's microtask to flush before the test ends.
    await Promise.resolve();
    await Promise.resolve();
  });
});
