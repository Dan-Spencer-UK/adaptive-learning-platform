/**
 * Tier 3 (mobile component/application) test -- renders the real sign-in
 * screen component through @testing-library/react-native, with the auth
 * session context mocked (no real Supabase call). Proves component
 * rendering, accessibility labelling and interactive state (button
 * enable/disable) work under the RN/Jest pipeline. `render()` is async in
 * @testing-library/react-native v14 (confirmed empirically 2026-08-15).
 */
import { fireEvent, render } from "@testing-library/react-native";

import SignInScreen from "../sign-in";

const mockRequestOtp = jest.fn().mockResolvedValue({ error: null });

jest.mock("@/lib/auth/session-context", () => ({
  useSession: () => ({
    session: null,
    isLoading: false,
    requestOtp: mockRequestOtp,
    verifyOtp: jest.fn(),
    signOut: jest.fn(),
  }),
}));

describe("SignInScreen", () => {
  beforeEach(() => {
    mockRequestOtp.mockClear();
  });

  it("renders the email step with the send-code button disabled until an email is entered", async () => {
    const { getByText, getByLabelText } = await render(<SignInScreen />);

    expect(getByText("Sign in")).toBeTruthy();

    const sendButton = getByLabelText("Send sign-in code");
    expect(sendButton.props.accessibilityState?.disabled).toBe(true);

    await fireEvent.changeText(getByLabelText("Email address"), "learner@example.test");
    expect(sendButton.props.accessibilityState?.disabled).toBe(false);
  });

  it("calls requestOtp with the entered email when the send-code button is pressed", async () => {
    const { getByLabelText } = await render(<SignInScreen />);

    await fireEvent.changeText(getByLabelText("Email address"), "learner@example.test");
    await fireEvent.press(getByLabelText("Send sign-in code"));

    expect(mockRequestOtp).toHaveBeenCalledWith("learner@example.test");
  });
});
