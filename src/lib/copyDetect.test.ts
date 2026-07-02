import { describe, it, expect } from "vitest";
import { looksLikeBase64, isPrintableText } from "./copyDetect";

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
