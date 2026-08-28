/**
 * CC-05C: Tier 3 test for the lesson screen, proving design doc §11's
 * "teach the whole family together" distinction -- every governed form is
 * presented, not just one target. Placed in __tests__ (sibling of the
 * route files, matching sign-in.test.tsx's convention) rather than beside
 * the route file itself so expo-router's file-based routing never treats
 * it as a route.
 */
import { render } from "@testing-library/react-native";
import { Text as MockText } from "react-native";

let mockFamilyId = "electrical.ohms_law";

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({ family: mockFamilyId }),
  // Mirrors real Link behaviour closely enough for this test: a bare
  // string child (no `asChild`) renders as text, an element child (the
  // `asChild` pattern) renders as-is.
  Link: ({ children, ...props }: { children: React.ReactNode }) =>
    typeof children === "string" ? <MockText {...props}>{children}</MockText> : children,
}));

import LessonScreen from "../[family]/index";

describe("LessonScreen", () => {
  it("Ohm's law: presents all three governed forms (V, I, R), the VIR mnemonic, and worked substitutions for every target", async () => {
    mockFamilyId = "electrical.ohms_law";
    const { getAllByLabelText, getByLabelText, getByText } = await render(<LessonScreen />);

    expect(getByText("Ohm's Law")).toBeTruthy();
    // Each relationship is stated at least once in the family overview, and
    // again inside its own self-contained worked-example block (steps
    // include "show_formula" per the governed worked-example blueprint) --
    // both are correct, so assert presence (>=1), not uniqueness.
    expect(getAllByLabelText("V equals I times R").length).toBeGreaterThanOrEqual(1);
    expect(getAllByLabelText("I equals V divided by R").length).toBeGreaterThanOrEqual(1);
    expect(getAllByLabelText("R equals V divided by I").length).toBeGreaterThanOrEqual(1);

    // VIR mnemonic present (region hit areas)
    expect(getByLabelText("Cover voltage V")).toBeTruthy();

    // Worked substitutions for all three targets, using the shared teaching value set (V=24, I=4, R=6):
    // the numeric substitution line, then the final answer-with-unit line.
    expect(getByLabelText("V equals 4 times 6")).toBeTruthy();
    expect(getByLabelText("V equals 24 V")).toBeTruthy();
    expect(getByLabelText("I equals 24 divided by 6")).toBeTruthy();
    expect(getByLabelText("I equals 4 A")).toBeTruthy();
    expect(getByLabelText("R equals 24 divided by 4")).toBeTruthy();
    expect(getByLabelText("R equals 6 Ω")).toBeTruthy();
  });

  it("series circuits: presents the add-form relationship and a diagram, not the Ohm's-law content", async () => {
    mockFamilyId = "electrical.series_circuits";
    const { getAllByLabelText, queryByLabelText } = await render(<LessonScreen />);
    expect(getAllByLabelText(/Rt equals R1 plus R2 plus R3 plus R4/).length).toBeGreaterThanOrEqual(1);
    expect(queryByLabelText("Cover voltage V")).toBeNull();
  });

  it("magnetism: presents the right-hand grip rule as a genuine hand-based diagram, distinct from the motor-principle force diagram", async () => {
    mockFamilyId = "electrical.magnetism_and_electromagnetism";
    const { getByText, getByLabelText } = await render(<LessonScreen />);

    // Two distinct, correctly-attributed sections -- not one diagram mislabelled as both rules.
    expect(getByText("Right-hand grip rule (magnetic field direction)")).toBeTruthy();
    expect(getByText("Motor principle (force on a current-carrying conductor)")).toBeTruthy();

    // Grip-rule diagram: thumb (current direction) always shown, field-curl direction revealed for teaching.
    expect(getByLabelText(/The thumb points along the conductor, in the direction the conventional current .* flows/)).toBeTruthy();
    expect(getByLabelText(/The curled fingers show the magnetic field circling (clockwise|counterclockwise) as seen by the viewer\./)).toBeTruthy();

    // Motor-principle diagram: force direction revealed for teaching.
    expect(getByLabelText(/Resulting force on the conductor acts \w+wards\./)).toBeTruthy();
  });

  it("shows an unknown-family message for an unrecognised family id", async () => {
    mockFamilyId = "electrical.nonexistent";
    const { getByText } = await render(<LessonScreen />);
    expect(getByText("Unknown family.")).toBeTruthy();
  });
});
