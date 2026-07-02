import { describe, it, expect } from "vitest";
import { isValidCpf, generateCpf, formatCpf, stripCpf } from "./logic";

describe("isValidCpf", () => {
  it("accepts known valid CPF (formatted)", () => {
    expect(isValidCpf("123.456.789-09")).toBe(true);
  });
  it("accepts known valid CPF (raw digits)", () => {
    expect(isValidCpf("12345678909")).toBe(true);
  });
  it("rejects wrong check digit", () => {
    expect(isValidCpf("123.456.789-00")).toBe(false);
  });
  it("rejects all-same-digit CPFs", () => {
    for (let d = 0; d <= 9; d++) {
      expect(isValidCpf(String(d).repeat(11))).toBe(false);
    }
  });
  it("rejects too short", () => {
    expect(isValidCpf("1234567")).toBe(false);
  });
  it("rejects too long", () => {
    expect(isValidCpf("123456789099")).toBe(false);
  });
  it("rejects empty string", () => {
    expect(isValidCpf("")).toBe(false);
  });
  it("accepts another valid CPF", () => {
    expect(isValidCpf("529.982.247-25")).toBe(true);
  });
  it("rejects CPF with letters", () => {
    expect(isValidCpf("abc.def.ghi-jk")).toBe(false);
  });
});

describe("generateCpf", () => {
  it("generates a valid CPF by default", () => {
    for (let i = 0; i < 20; i++) {
      expect(isValidCpf(generateCpf())).toBe(true);
    }
  });
  it("generates formatted CPF by default", () => {
    expect(generateCpf()).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
  });
  it("generates unformatted when formatted=false", () => {
    expect(generateCpf(false)).toMatch(/^\d{11}$/);
  });
  it("unformatted output is also valid", () => {
    for (let i = 0; i < 20; i++) {
      expect(isValidCpf(generateCpf(false))).toBe(true);
    }
  });
});

describe("formatCpf", () => {
  it("formats raw digits", () => {
    expect(formatCpf("12345678909")).toBe("123.456.789-09");
  });
  it("formats zero-padded digits", () => {
    expect(formatCpf("00000000000")).toBe("000.000.000-00");
  });
});

describe("stripCpf", () => {
  it("strips formatting from CPF", () => {
    expect(stripCpf("123.456.789-09")).toBe("12345678909");
  });
  it("leaves raw digits unchanged", () => {
    expect(stripCpf("12345678909")).toBe("12345678909");
  });
});
