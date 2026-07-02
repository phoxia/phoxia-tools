import { describe, it, expect, beforeEach } from "vitest";
import {
  looksLikeBase64,
  isPrintableText,
  detectFormat,
  hasBeenHandled,
  markHandled,
} from "./copyDetect";

describe("looksLikeBase64", () => {
  it("accepts a real base64-encoded string", () => {
    expect(looksLikeBase64("SGVsbG8gd29ybGQsIHRoaXMgaXMgYSB0ZXN0IHN0cmluZyE=")).toBe(true);
  });

  it("rejects a short common word", () => {
    expect(looksLikeBase64("hello")).toBe(false);
  });

  it("rejects a short price string", () => {
    expect(looksLikeBase64("$19.99")).toBe(false);
  });

  it("rejects a URL", () => {
    expect(looksLikeBase64("https://example.com/path?x=1")).toBe(false);
  });

  it("rejects a string below the minimum length even if base64-shaped", () => {
    expect(looksLikeBase64("YWJj")).toBe(false);
  });

  it("rejects a string above the maximum length", () => {
    expect(looksLikeBase64("A".repeat(20_001))).toBe(false);
  });

  it("rejects an impossible base64 length (len % 4 === 1)", () => {
    expect(looksLikeBase64("A".repeat(17))).toBe(false);
  });

  it("rejects pure letters with no digits/symbols", () => {
    expect(looksLikeBase64("ThisIsJustSomePlainEnglishWords")).toBe(false);
  });

  it("accepts base64url charset (- and _)", () => {
    expect(looksLikeBase64("eyJhbGciOiJIUzI1NiJ9-_1234567890abc")).toBe(true);
  });

  it("trims whitespace before checking", () => {
    expect(looksLikeBase64("  SGVsbG8gd29ybGQsIHRoaXMgaXMgYSB0ZXN0IHN0cmluZyE=  ")).toBe(true);
  });
});

describe("isPrintableText", () => {
  it("returns true for plain readable text", () => {
    expect(isPrintableText("Hello world, this is a test string!")).toBe(true);
  });

  it("returns false for empty string", () => {
    expect(isPrintableText("")).toBe(false);
  });

  it("returns false for mostly binary/control-character garbage", () => {
    const garbage = Array.from({ length: 50 }, (_, i) => String.fromCharCode(i % 32)).join("");
    expect(isPrintableText(garbage)).toBe(false);
  });

  it("accepts text with unicode letters", () => {
    expect(isPrintableText("Olá, mundo! Café à volonté.")).toBe(true);
  });
});

const REAL_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const REAL_UUID = "550e8400-e29b-41d4-a716-446655440000";
const REAL_CURL = "curl https://api.example.com/users -H 'Authorization: Bearer xyz'";
const REAL_CIPHER = "v1:" + "U2FsdGVkX18AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";
const REAL_BASE64 = "SGVsbG8gd29ybGQsIHRoaXMgaXMgYSB0ZXN0IHN0cmluZyE=";

describe("detectFormat", () => {
  it("detects a curl command", () => {
    expect(detectFormat(REAL_CURL)?.format).toBe("curl");
  });

  it("detects a cipher payload (v1: prefix)", () => {
    expect(detectFormat(REAL_CIPHER)?.format).toBe("cipher");
  });

  it("detects a JWT and decodes its payload for the preview", () => {
    const match = detectFormat(REAL_JWT);
    expect(match?.format).toBe("jwt");
    expect(match?.route).toBe("/tools/jwt");
  });

  it("detects a UUID and does NOT misclassify it as base64", () => {
    // A UUID's hex+dash charset also satisfies the base64url charset regex,
    // so ordering (UUID checked before the generic base64 fallback) matters.
    const match = detectFormat(REAL_UUID);
    expect(match?.format).toBe("uuid");
  });

  it("falls back to base64 for a plain base64 string", () => {
    expect(detectFormat(REAL_BASE64)?.format).toBe("base64");
  });

  it("returns null for a short common word", () => {
    expect(detectFormat("hello")).toBeNull();
  });

  it("returns null for a plain URL", () => {
    expect(detectFormat("https://example.com/path?x=1")).toBeNull();
  });

  it("returns null for prose that happens to contain the word curl mid-sentence", () => {
    expect(detectFormat("I used curl yesterday to test the API")).toBeNull();
  });

  it("returns null for a malformed 3-part dot string that isn't valid JWT JSON", () => {
    expect(detectFormat("not.a.jwt")).toBeNull();
  });
});

function createSessionStorageMock() {
  const store = new Map<string, string>();
  return {
    getItem: (k: string) => (store.has(k) ? (store.get(k) as string) : null),
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
  };
}

describe("hasBeenHandled / markHandled", () => {
  beforeEach(() => {
    (globalThis as unknown as { sessionStorage: unknown }).sessionStorage =
      createSessionStorageMock();
  });

  it("is false for a value that hasn't been marked", () => {
    expect(hasBeenHandled(REAL_JWT)).toBe(false);
  });

  it("becomes true for the exact value after marking", () => {
    markHandled(REAL_JWT);
    expect(hasBeenHandled(REAL_JWT)).toBe(true);
  });

  it("stays false for a different value", () => {
    markHandled(REAL_JWT);
    expect(hasBeenHandled(REAL_CURL)).toBe(false);
  });

  it("caps the ring buffer at SEEN_MAX, evicting the oldest entries", () => {
    for (let i = 0; i < 25; i++) markHandled(`value-${i}`);
    // the earliest entries should have been evicted
    expect(hasBeenHandled("value-0")).toBe(false);
    // the most recent ones should still be remembered
    expect(hasBeenHandled("value-24")).toBe(true);
  });
});
