import { describe, it, expect } from "vitest";
import { isAllowedChars, exceedsMax, clampNumber } from "./number-field-logic";

describe("isAllowedChars", () => {
  it("allows digits for integer-only fields", () => {
    expect(isAllowedChars("123", true)).toBe(true);
  });

  it("rejects letters for integer-only fields", () => {
    expect(isAllowedChars("12a", true)).toBe(false);
  });

  it("allows a leading minus sign", () => {
    expect(isAllowedChars("-42", true)).toBe(true);
  });

  it("allows an empty string (mid-deletion)", () => {
    expect(isAllowedChars("", true)).toBe(true);
  });

  it("rejects a decimal point for integer-only fields", () => {
    expect(isAllowedChars("1.5", true)).toBe(false);
  });

  it("allows a decimal point when integer-only is false", () => {
    expect(isAllowedChars("1.5", false)).toBe(true);
  });

  it("rejects letters when integer-only is false", () => {
    expect(isAllowedChars("1.5a", false)).toBe(false);
  });
});

describe("exceedsMax", () => {
  it("returns false when max is undefined", () => {
    expect(exceedsMax("999999", undefined)).toBe(false);
  });

  it("returns false for an empty prospective value", () => {
    expect(exceedsMax("", 100)).toBe(false);
  });

  it("returns false for a lone minus sign", () => {
    expect(exceedsMax("-", 100)).toBe(false);
  });

  it("returns true when the prospective value exceeds max", () => {
    expect(exceedsMax("101", 100)).toBe(true);
  });

  it("returns false when the prospective value equals max", () => {
    expect(exceedsMax("100", 100)).toBe(false);
  });

  it("returns false when the prospective value is under max", () => {
    expect(exceedsMax("50", 100)).toBe(false);
  });
});

describe("clampNumber", () => {
  it("clamps to min when below range", () => {
    expect(clampNumber(-5, 0, 100)).toBe(0);
  });

  it("clamps to max when above range", () => {
    expect(clampNumber(500, 0, 100)).toBe(100);
  });

  it("leaves in-range values untouched", () => {
    expect(clampNumber(42, 0, 100)).toBe(42);
  });

  it("rounds non-integers when integerOnly is true", () => {
    expect(clampNumber(4.7, 0, 100, true)).toBe(5);
  });

  it("preserves decimals when integerOnly is false", () => {
    expect(clampNumber(4.7, 0, 100, false)).toBe(4.7);
  });

  it("handles missing min/max bounds", () => {
    expect(clampNumber(4.7, undefined, undefined, false)).toBe(4.7);
  });
});
