import { describe, it, expect } from "vitest";
import { generateUuidV4, isValidUuid } from "./logic";

describe("generateUuidV4", () => {
  it("returns a valid v4 UUID", () => {
    const uuid = generateUuidV4();
    expect(isValidUuid(uuid)).toBe(true);
  });

  it("returns unique values", () => {
    const set = new Set(Array.from({ length: 100 }, () => generateUuidV4()));
    expect(set.size).toBe(100);
  });

  it("has correct v4 version bit", () => {
    const uuid = generateUuidV4();
    expect(uuid[14]).toBe("4");
  });
});

describe("isValidUuid", () => {
  it("returns true for valid UUID", () => {
    expect(isValidUuid("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
  });

  it("returns false for invalid string", () => {
    expect(isValidUuid("not-a-uuid")).toBe(false);
  });

  it("is case-insensitive", () => {
    expect(isValidUuid("550E8400-E29B-41D4-A716-446655440000")).toBe(true);
  });
});
