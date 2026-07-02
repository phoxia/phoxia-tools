import { describe, it, expect } from "vitest";
import { pickOne, shuffle, generateNumbers, rollDice } from "./logic";

describe("pickOne", () => {
  it("picks an item from the list", () => {
    const items = ["a", "b", "c"];
    const result = pickOne(items);
    expect(result).toBeDefined();
    expect(items).toContain(result);
  });

  it("returns null for empty list", () => {
    expect(pickOne([])).toBeNull();
  });
});

describe("shuffle", () => {
  it("returns a permutation of the input", () => {
    const items = [1, 2, 3, 4, 5];
    const result = shuffle(items);
    expect(result.length).toBe(items.length);
    expect(result.sort()).toEqual(items.sort());
  });

  it("does not mutate the original", () => {
    const items = [1, 2, 3];
    const copy = [...items];
    shuffle(items);
    expect(items).toEqual(copy);
  });
});

describe("generateNumbers", () => {
  it("generates the requested count", () => {
    const r = generateNumbers(1, 100, 5, false);
    expect(Array.isArray(r)).toBe(true);
    if (Array.isArray(r)) expect(r.length).toBe(5);
  });

  it("generates unique numbers", () => {
    const r = generateNumbers(1, 10, 5, true);
    if (Array.isArray(r)) {
      expect(new Set(r).size).toBe(5);
    }
  });

  it("rejects impossible unique range", () => {
    const r = generateNumbers(1, 3, 10, true);
    expect(Array.isArray(r)).toBe(false);
  });

  it("returns empty for zero count", () => {
    expect(generateNumbers(1, 10, 0, false)).toEqual([]);
  });
});

describe("rollDice", () => {
  it("rolls the requested quantity", () => {
    const r = rollDice(6, 3);
    expect(r.length).toBe(3);
    r.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(6);
    });
  });
});
