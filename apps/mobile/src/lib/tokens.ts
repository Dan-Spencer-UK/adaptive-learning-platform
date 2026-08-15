/**
 * Minimal local constants for the CC-04N proving shell only. This is
 * explicitly NOT the final learner-facing design system -- see
 * docs/product/MOBILE-UX-ENGINEERING-STANDARD.md §5 (Design system),
 * which the real design system must satisfy when it is built. Do not
 * copy the web client's Tailwind token system; these are independent,
 * minimal, native-appropriate constants sized only for this thin shell.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
} as const;

export const color = {
  background: "#0B0D12",
  surface: "#151821",
  border: "#262B38",
  text: "#F2F4F8",
  textSecondary: "#9AA3B2",
  accent: "#4C8DFF",
  danger: "#FF6B6B",
  success: "#4CD07A",
} as const;

export const typography = {
  title: { fontSize: 24, fontWeight: "700" as const },
  body: { fontSize: 16, fontWeight: "400" as const },
  caption: { fontSize: 13, fontWeight: "400" as const },
  code: { fontSize: 13, fontFamily: "monospace" as const },
} as const;

// Minimum recommended touch target, native platforms (see
// MOBILE-UX-ENGINEERING-STANDARD.md's low-level accessibility rules).
export const minTouchTarget = 44;

// Motion: a single restrained duration constant, not a motion system.
// See MOBILE-UX-ENGINEERING-STANDARD.md §3 -- the governed motion-token
// system is future work, not established by this foundation.
export const motionDurationMs = 180;
