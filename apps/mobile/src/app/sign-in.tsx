/**
 * Minimal passwordless email-OTP sign-in screen -- the FOUNDATION auth
 * proof required by CC-04N, not final identity UX (see
 * docs/architecture/evidence/CC-04N-MOBILE-FOUNDATION-EVIDENCE.md). Reuses
 * the same local Supabase Auth email-OTP mechanism already proven for the
 * web client; local development codes arrive via Mailpit (see
 * apps/mobile/README.md), exactly as documented for the web client.
 */
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSession } from "@/lib/auth/session-context";
import { color, minTouchTarget, radius, spacing, typography } from "@/lib/tokens";

type Stage = "enter-email" | "enter-code";

export default function SignInScreen(): React.JSX.Element {
  const { requestOtp, verifyOtp } = useSession();
  const [stage, setStage] = useState<Stage>("enter-email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestOtp = async () => {
    setError(null);
    setIsSubmitting(true);
    const { error: requestError } = await requestOtp(email.trim());
    setIsSubmitting(false);
    if (requestError) {
      setError(requestError);
      return;
    }
    setStage("enter-code");
  };

  const handleVerifyOtp = async () => {
    setError(null);
    setIsSubmitting(true);
    const { error: verifyError } = await verifyOtp(email.trim(), code.trim());
    setIsSubmitting(false);
    if (verifyError) {
      setError(verifyError);
    }
    // On success, SessionProvider's onAuthStateChange fires and the root
    // navigator's Stack.Protected guard switches to (app) automatically.
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title} accessibilityRole="header">
          Sign in
        </Text>
        <Text style={styles.subtitle}>
          Adaptive Learning Platform -- development foundation
        </Text>

        {stage === "enter-email" ? (
          <>
            <Text style={styles.label} nativeID="email-label">
              Email address
            </Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.test"
              placeholderTextColor={color.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              accessibilityLabel="Email address"
              accessibilityLabelledBy={Platform.OS === "android" ? "email-label" : undefined}
            />
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
                (isSubmitting || email.trim().length === 0) && styles.buttonDisabled,
              ]}
              onPress={handleRequestOtp}
              disabled={isSubmitting || email.trim().length === 0}
              accessibilityRole="button"
              accessibilityLabel="Send sign-in code"
              accessibilityState={{ disabled: isSubmitting || email.trim().length === 0 }}
            >
              {isSubmitting ? (
                <ActivityIndicator color={color.background} />
              ) : (
                <Text style={styles.primaryButtonText}>Send code</Text>
              )}
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.label} nativeID="code-label">
              6-digit code sent to {email}
            </Text>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholder="123456"
              placeholderTextColor={color.textSecondary}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              maxLength={6}
              accessibilityLabel="Sign-in code"
              accessibilityLabelledBy={Platform.OS === "android" ? "code-label" : undefined}
            />
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
                (isSubmitting || code.trim().length === 0) && styles.buttonDisabled,
              ]}
              onPress={handleVerifyOtp}
              disabled={isSubmitting || code.trim().length === 0}
              accessibilityRole="button"
              accessibilityLabel="Verify code and sign in"
              accessibilityState={{ disabled: isSubmitting || code.trim().length === 0 }}
            >
              {isSubmitting ? (
                <ActivityIndicator color={color.background} />
              ) : (
                <Text style={styles.primaryButtonText}>Verify and sign in</Text>
              )}
            </Pressable>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => setStage("enter-email")}
              accessibilityRole="button"
              accessibilityLabel="Use a different email address"
            >
              <Text style={styles.secondaryButtonText}>Use a different email</Text>
            </Pressable>
          </>
        )}

        {error ? (
          <Text style={styles.error} accessibilityLiveRegion="polite" role="alert">
            {error}
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.background,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography.title,
    color: color.text,
  },
  subtitle: {
    ...typography.body,
    color: color.textSecondary,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    color: color.textSecondary,
  },
  input: {
    minHeight: minTouchTarget,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    color: color.text,
    backgroundColor: color.surface,
    fontSize: 16,
  },
  primaryButton: {
    minHeight: minTouchTarget,
    borderRadius: radius.md,
    backgroundColor: color.accent,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    ...typography.body,
    fontWeight: "600",
    color: color.background,
  },
  secondaryButton: {
    minHeight: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    ...typography.body,
    color: color.accent,
  },
  error: {
    ...typography.body,
    color: color.danger,
    marginTop: spacing.sm,
  },
});
