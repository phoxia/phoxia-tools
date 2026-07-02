import type { Result } from "$lib/result";

const ENC_PREFIX = "v1:";
const PBKDF2_ITERATIONS = 100_000;
const KEY_LENGTH = 256;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

function bufToBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function base64ToBuf(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function deriveKey(password: string, salt: BufferSource): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveKey",
  ]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encrypt(plaintext: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(password, salt);
  const enc = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(plaintext)
  );
  const payload = `${bufToBase64(salt.buffer as ArrayBuffer)}.${bufToBase64(iv.buffer as ArrayBuffer)}.${bufToBase64(ciphertext)}`;
  return ENC_PREFIX + btoa(payload);
}

export async function decrypt(payload: string, password: string): Promise<Result<string>> {
  try {
    if (!payload.startsWith(ENC_PREFIX)) return { ok: false, error: "Invalid ciphertext format" };
    const inner = atob(payload.slice(ENC_PREFIX.length));
    const parts = inner.split(".");
    if (parts.length !== 3) return { ok: false, error: "Invalid ciphertext format" };
    const salt = base64ToBuf(parts[0]);
    const iv = base64ToBuf(parts[1]);
    const ct = base64ToBuf(parts[2]);
    const key = await deriveKey(password, salt as BufferSource);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv as BufferSource },
      key,
      ct as BufferSource
    );
    return { ok: true, value: new TextDecoder().decode(decrypted) };
  } catch {
    return { ok: false, error: "Decryption failed. Wrong password or corrupted data." };
  }
}
