/**
 * Secure session storage adapter for the native Supabase client, following
 * Supabase's official documented Expo/React Native pattern verbatim
 * (https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native,
 * verified 2026-08-15): `expo-secure-store` alone cannot hold a full
 * serialized Supabase session (SecureStore values are capped at 2048
 * bytes), so the pattern stores a random AES-256 encryption key in
 * SecureStore (OS Keychain/Keystore) and the AES-CTR-encrypted session
 * payload in AsyncStorage.
 *
 * This is NOT bespoke cryptography: the algorithm, library (`aes-js`) and
 * structure are Supabase's own documented, currently-recommended pattern
 * for this exact problem (see docs/architecture/adr/ADR-0001-mobile-client-technology.md
 * consequences and docs/architecture/MOBILE-ARCHITECTURE.md §3, Auth and session).
 * No sensitive value is ever logged.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as aesjs from "aes-js";
import * as SecureStore from "expo-secure-store";
// Polyfill required by aes-js's use of crypto.getRandomValues in the
// React Native/Hermes environment (no native Web Crypto implementation).
import "react-native-get-random-values";

export class LargeSecureStore {
  private async _encrypt(key: string, value: string): Promise<string> {
    const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));
    const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1));
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

    await SecureStore.setItemAsync(key, aesjs.utils.hex.fromBytes(encryptionKey));

    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }

  private async _decrypt(key: string, value: string): Promise<string | null> {
    const encryptionKeyHex = await SecureStore.getItemAsync(key);
    if (!encryptionKeyHex) {
      return null;
    }

    const cipher = new aesjs.ModeOfOperation.ctr(
      aesjs.utils.hex.toBytes(encryptionKeyHex),
      new aesjs.Counter(1),
    );
    const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));

    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }

  async getItem(key: string): Promise<string | null> {
    const encrypted = await AsyncStorage.getItem(key);
    if (!encrypted) {
      return null;
    }
    return this._decrypt(key, encrypted);
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
    await SecureStore.deleteItemAsync(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    const encrypted = await this._encrypt(key, value);
    await AsyncStorage.setItem(key, encrypted);
  }
}
