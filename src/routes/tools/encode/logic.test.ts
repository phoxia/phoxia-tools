import { describe, it, expect } from "vitest";
import {
  encodeBase64,
  decodeBase64,
  encodeUrl,
  decodeUrl,
  encodeBinary,
  decodeBinary,
  encodeMorse,
  decodeMorse,
  encodeHex,
  decodeHex,
} from "./logic";

describe("encodeBase64 / decodeBase64", () => {
  it("encodes and decodes roundtrip", () => {
    const encoded = encodeBase64("hello");
    const decoded = decodeBase64(encoded);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) expect(decoded.value).toBe("hello");
  });

  it("handles unicode", () => {
    const encoded = encodeBase64("olá");
    const decoded = decodeBase64(encoded);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) expect(decoded.value).toBe("olá");
  });
});

describe("encodeUrl / decodeUrl", () => {
  it("encodes special characters", () => {
    expect(encodeUrl("hello world")).toBe("hello%20world");
  });

  it("roundtrips", () => {
    const encoded = encodeUrl("olá mundo?");
    const decoded = decodeUrl(encoded);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) expect(decoded.value).toBe("olá mundo?");
  });
});

describe("encodeBinary / decodeBinary", () => {
  it("encodes text to binary", () => {
    const result = encodeBinary("A");
    expect(result).toBe("01000001");
  });

  it("roundtrips", () => {
    const encoded = encodeBinary("Hi");
    const decoded = decodeBinary(encoded);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) expect(decoded.value).toBe("Hi");
  });

  it("rejects invalid binary", () => {
    expect(decodeBinary("hello").ok).toBe(false);
  });

  it("rejects uneven bits", () => {
    expect(decodeBinary("101").ok).toBe(false);
  });
});

describe("encodeMorse / decodeMorse", () => {
  it("encodes text to morse", () => {
    expect(encodeMorse("SOS")).toBe("... --- ...");
  });

  it("roundtrips", () => {
    const encoded = encodeMorse("HELLO WORLD");
    const decoded = decodeMorse(encoded);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) expect(decoded.value).toBe("HELLO WORLD");
  });

  it("handles spaces with slash separator", () => {
    const result = encodeMorse("HI THERE");
    expect(result).toContain("/");
    const decoded = decodeMorse(result);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) expect(decoded.value).toBe("HI THERE");
  });
});

describe("encodeHex / decodeHex", () => {
  it("encodes text to hex", () => {
    const result = encodeHex("A");
    expect(result).toBe("41");
  });

  it("roundtrips", () => {
    const encoded = encodeHex("hello");
    const decoded = decodeHex(encoded);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) expect(decoded.value).toBe("hello");
  });

  it("rejects invalid hex", () => {
    expect(decodeHex("xyz").ok).toBe(false);
  });

  it("rejects odd-length hex", () => {
    expect(decodeHex("abc").ok).toBe(false);
  });
});
