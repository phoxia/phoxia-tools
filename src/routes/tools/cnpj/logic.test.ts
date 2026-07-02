import { describe, it, expect } from "vitest";
import { isValidCnpj, generateCnpj, formatCnpj, stripCnpj } from "./logic";

describe("isValidCnpj", () => {
  it("accepts known valid CNPJ (formatted)", () => {
    expect(isValidCnpj("11.222.333/0001-81")).toBe(true);
  });
  it("accepts known valid CNPJ (raw digits)", () => {
    expect(isValidCnpj("11222333000181")).toBe(true);
  });
  it("rejects wrong check digit", () => {
    expect(isValidCnpj("11.222.333/0001-00")).toBe(false);
  });
  it("rejects all-same-digit CNPJs", () => {
    for (let d = 0; d <= 9; d++) {
      expect(isValidCnpj(String(d).repeat(14))).toBe(false);
    }
  });
  it("rejects too short", () => {
    expect(isValidCnpj("1234567")).toBe(false);
  });
  it("rejects empty string", () => {
    expect(isValidCnpj("")).toBe(false);
  });
  it("accepts another known valid CNPJ", () => {
    expect(isValidCnpj("45.997.418/0001-53")).toBe(true);
  });
});

describe("generateCnpj", () => {
  it("generates a valid CNPJ by default", () => {
    for (let i = 0; i < 20; i++) {
      expect(isValidCnpj(generateCnpj())).toBe(true);
    }
  });
  it("generates formatted CNPJ by default", () => {
    expect(generateCnpj()).toMatch(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);
  });
  it("generates unformatted when formatted=false", () => {
    expect(generateCnpj(false)).toMatch(/^\d{14}$/);
  });
  it("unformatted output is also valid", () => {
    for (let i = 0; i < 20; i++) {
      expect(isValidCnpj(generateCnpj(false))).toBe(true);
    }
  });
});

describe("formatCnpj", () => {
  it("formats raw digits", () => {
    expect(formatCnpj("11222333000181")).toBe("11.222.333/0001-81");
  });
});

describe("stripCnpj", () => {
  it("strips formatting from CNPJ", () => {
    expect(stripCnpj("11.222.333/0001-81")).toBe("11222333000181");
  });
  it("leaves raw digits unchanged", () => {
    expect(stripCnpj("11222333000181")).toBe("11222333000181");
  });
});
