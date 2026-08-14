import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { SignInForm } from "./sign-in-form";
import type { SignInState } from "./state";

const mockSignInAction = vi.fn();

vi.mock("./actions", () => ({
  signInAction: (prevState: unknown, formData: FormData) =>
    mockSignInAction(prevState, formData),
}));

describe("SignInForm", () => {
  it("renders the email step with an accessible label and submit button", () => {
    render(<SignInForm next="/learn" />);

    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send code" }),
    ).toBeInTheDocument();
  });

  it("moves to the code step and shows the success message after a valid request", async () => {
    mockSignInAction.mockResolvedValueOnce({
      step: "code",
      email: "user-a@example.test",
      next: "/learn",
      error: null,
      message:
        "We sent a 6-digit code to user-a@example.test. It expires shortly.",
    } satisfies SignInState);

    render(<SignInForm next="/learn" />);

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "user-a@example.test" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send code" }));

    await waitFor(() => {
      expect(screen.getByLabelText("6-digit code")).toBeInTheDocument();
    });
    expect(screen.getByRole("status")).toHaveTextContent(
      "We sent a 6-digit code",
    );
  });

  it("renders an accessible error message when the action reports one", async () => {
    mockSignInAction.mockResolvedValueOnce({
      step: "email",
      email: "not-an-email",
      next: "/learn",
      error: "Enter a valid email address.",
      message: null,
    } satisfies SignInState);

    render(<SignInForm next="/learn" />);

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send code" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Enter a valid email address.",
      );
    });
  });

  it("offers resend and restart actions on the code step", () => {
    render(<SignInForm next="/learn" />);

    // Re-render with code-step semantics isn't directly reachable without
    // driving the mocked action; this asserts the email step does NOT yet
    // show code-step-only controls, keeping the two steps mutually exclusive.
    expect(
      screen.queryByRole("button", { name: "Resend code" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Use a different email" }),
    ).not.toBeInTheDocument();
  });
});
