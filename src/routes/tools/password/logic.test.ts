import { describe, it, expect } from "vitest";
import { generatePassword, calcEntropy } from "./logic";

describe("generatePassword", () => {
  it("generates password of correct length", () => {
    const p = generatePassword({
      length: 16,
      upper: true,
      lower: true,
      digits: true,
      symbols: false,
    });
    expect(p.length).toBe(16);
  });

  it("includes uppercase when requested", () => {
    const p = generatePassword({
      length: 100,
      upper: true,
      lower: false,
      digits: false,
      symbols: false,
    });
    expect(/[A-Z]/.test(p)).toBe(true);
    expect(/[a-z]/.test(p)).toBe(false);
  });

  it("includes digits when requested", () => {
    const p = generatePassword({
      length: 100,
      upper: false,
      lower: false,
      digits: true,
      symbols: false,
    });
    expect(/[0-9]/.test(p)).toBe(true);
  });

  it("includes symbols when requested", () => {
    const p = generatePassword({
      length: 100,
      upper: false,
      lower: false,
      digits: false,
      symbols: true,
    });
    expect(/[^a-zA-Z0-9]/.test(p)).toBe(true);
  });

  it("generates unique passwords", () => {
    const passwords = new Set(
      Array.from({ length: 20 }, () =>
        generatePassword({ length: 16, upper: true, lower: true, digits: true, symbols: true })
      )
    );
    expect(passwords.size).toBeGreaterThan(15);
  });

  it("falls back to lowercase when all options off", () => {
    const p = generatePassword({
      length: 10,
      upper: false,
      lower: false,
      digits: false,
      symbols: false,
    });
    expect(p.length).toBe(10);
  });
});

describe("calcEntropy", () => {
  it("returns higher entropy for larger charset", () => {
    const low = calcEntropy(12, 26);
    const high = calcEntropy(12, 94);
    expect(high).toBeGreaterThan(low);
  });

  it("returns higher entropy for longer password", () => {
    const short = calcEntropy(8, 62);
    const long = calcEntropy(24, 62);
    expect(long).toBeGreaterThan(short);
  });

  it("entropy is bits = length * log2(charset)", () => {
    const bits = calcEntropy(10, 2);
    expect(bits).toBeCloseTo(10, 5);
  });
});
