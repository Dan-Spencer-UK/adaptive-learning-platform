import { describe, expect, it } from "vitest";

import { isValidEmail, isValidOtpCode } from "./sign-in-validation";

describe("isValidEmail", () => {
  it("accepts a plausible email address", () => {
    expect(isValidEmail("user-a@example.test")).toBe(true);
  });

  it("rejects an empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("rejects a value with no @", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
  });

  it("rejects a value with no domain", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

  it("rejects a value containing whitespace", () => {
    expect(isValidEmail("user a@example.test")).toBe(false);
  });
});

describe("isValidOtpCode", () => {
  it("accepts a 6-digit code", () => {
    expect(isValidOtpCode("123456")).toBe(true);
  });

  it("rejects a code that is too short", () => {
    expect(isValidOtpCode("12345")).toBe(false);
  });

  it("rejects a code that is too long", () => {
    expect(isValidOtpCode("1234567")).toBe(false);
  });

  it("rejects a non-numeric code", () => {
    expect(isValidOtpCode("12a456")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isValidOtpCode("")).toBe(false);
  });
});
