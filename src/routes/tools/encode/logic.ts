import type { Result } from "$lib/result";

// --- Encode mode ---
export type EncodeMode = "base64" | "url" | "binary" | "morse" | "hex";

// --- Base64 (from base64/logic.ts) ---

export function encodeBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function decodeBase64(input: string): Result<string> {
  try {
    const padded = input.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return { ok: true, value: new TextDecoder().decode(bytes) };
  } catch (e) {
    return { ok: false, error: `Decode error: ${(e as Error).message}` };
  }
}

// --- URL (from url/logic.ts) ---

export function encodeUrl(input: string): string {
  return encodeURIComponent(input);
}

export function decodeUrl(input: string): Result<string> {
  try {
    return { ok: true, value: decodeURIComponent(input) };
  } catch (e) {
    return { ok: false, error: `Decode error: ${(e as Error).message}` };
  }
}

// --- Binary ---

export function encodeBinary(input: string): string {
  const bytes = new TextEncoder().encode(input);
  return Array.from(bytes)
    .map((b) => b.toString(2).padStart(8, "0"))
    .join(" ");
}

export function decodeBinary(input: string): Result<string> {
  try {
    const cleaned = input.replace(/\s/g, "");
    if (cleaned.length % 8 !== 0)
      return { ok: false, error: "Binary input must be groups of 8 bits" };
    if (!/^[01]+$/.test(cleaned)) return { ok: false, error: "Invalid binary input" };
    const bytes = new Uint8Array(cleaned.length / 8);
    for (let i = 0; i < cleaned.length; i += 8) {
      bytes[i / 8] = parseInt(cleaned.slice(i, i + 8), 2);
    }
    return { ok: true, value: new TextDecoder().decode(bytes) };
  } catch (e) {
    return { ok: false, error: `Decode error: ${(e as Error).message}` };
  }
}

// --- Morse ---

const MORSE_MAP: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "'": ".----.",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  _: "..--.-",
  '"': ".-..-.",
  $: "...-..-",
  "@": ".--.-.",
  " ": "/",
};

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([k, v]) => [v, k])
);

export function encodeMorse(input: string): string {
  return input
    .toUpperCase()
    .split("")
    .map((c) => MORSE_MAP[c] ?? c)
    .join(" ");
}

export function decodeMorse(input: string): Result<string> {
  try {
    const words = input.trim().split(/\s*\/\s*/);
    const decoded = words.map((word) =>
      word
        .trim()
        .split(/\s+/)
        .map((code) => REVERSE_MORSE[code] ?? "?")
        .join("")
    );
    return { ok: true, value: decoded.join(" ") };
  } catch (e) {
    return { ok: false, error: `Decode error: ${(e as Error).message}` };
  }
}

// --- Hex ---

export function encodeHex(input: string): string {
  const bytes = new TextEncoder().encode(input);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}

export function decodeHex(input: string): Result<string> {
  try {
    const cleaned = input.replace(/\s/g, "");
    if (cleaned.length % 2 !== 0)
      return { ok: false, error: "Hex input must have an even number of characters" };
    if (!/^[0-9a-fA-F]+$/.test(cleaned)) return { ok: false, error: "Invalid hex input" };
    const bytes = new Uint8Array(cleaned.length / 2);
    for (let i = 0; i < cleaned.length; i += 2) {
      bytes[i / 2] = parseInt(cleaned.slice(i, i + 2), 16);
    }
    return { ok: true, value: new TextDecoder().decode(bytes) };
  } catch (e) {
    return { ok: false, error: `Decode error: ${(e as Error).message}` };
  }
}
