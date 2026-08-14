const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Matches the configured otp_length (supabase/config.toml [auth.email] otp_length = 6).
const OTP_CODE_PATTERN = /^\d{6}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

export function isValidOtpCode(token: string): boolean {
  return OTP_CODE_PATTERN.test(token);
}
