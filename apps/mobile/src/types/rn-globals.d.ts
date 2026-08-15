/**
 * Minimal ambient declarations for the two Web-standard globals this
 * foundation actually uses, both genuinely available at runtime in
 * Hermes/React Native (performance timing is a Hermes built-in;
 * `crypto.getRandomValues` is polyfilled by `react-native-get-random-values`,
 * imported as a side effect wherever it's needed). Deliberately not
 * including the full "DOM" TypeScript lib, which would expose many
 * browser-only globals (document, window, ...) that do not exist on
 * React Native and would mask real platform-usage bugs.
 */
declare const crypto: {
  getRandomValues<T extends ArrayBufferView>(array: T): T;
};

interface Performance {
  now(): number;
}

declare const performance: Performance | undefined;
