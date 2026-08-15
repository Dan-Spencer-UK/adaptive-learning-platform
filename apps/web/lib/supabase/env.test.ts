import { afterEach, describe, expect, it, vi } from "vitest";

import { getSupabaseEnv } from "./env";

describe("getSupabaseEnv", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the configured URL and publishable key when both are set", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
    vi.stubEnv(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "sb_publishable_test_value",
    );

    expect(getSupabaseEnv()).toEqual({
      url: "http://127.0.0.1:54321",
      publishableKey: "sb_publishable_test_value",
    });
  });

  it("fails fast when NEXT_PUBLIC_SUPABASE_URL is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "sb_publishable_test_value",
    );

    expect(() => getSupabaseEnv()).toThrow(
      /Missing NEXT_PUBLIC_SUPABASE_URL/,
    );
  });

  it("fails fast when NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");

    expect(() => getSupabaseEnv()).toThrow(
      /Missing NEXT_PUBLIC_SUPABASE_URL/,
    );
  });

  it("fails fast when both values are missing, and never invents a fallback", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");

    expect(() => getSupabaseEnv()).toThrow(
      /Missing NEXT_PUBLIC_SUPABASE_URL/,
    );
  });
});
