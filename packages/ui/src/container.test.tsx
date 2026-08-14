import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "./container";

describe("Container", () => {
  it("renders its children", () => {
    render(
      <Container>
        <p>Foundation content</p>
      </Container>,
    );

    expect(screen.getByText("Foundation content")).toBeInTheDocument();
  });
});
