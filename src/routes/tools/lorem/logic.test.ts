import { describe, it, expect } from "vitest";
import { generateLorem } from "./logic";

describe("generateLorem", () => {
  it("generates words", () => {
    const r = generateLorem("words", 5);
    const words = r.split(" ");
    expect(words.length).toBe(5);
  });

  it("generates sentences", () => {
    const r = generateLorem("sentences", 2);
    expect(r.endsWith(".")).toBe(true);
    expect(r.split(". ").length).toBeGreaterThanOrEqual(1);
  });

  it("generates paragraphs", () => {
    const r = generateLorem("paragraphs", 2);
    expect(r.split("\n\n").length).toBe(2);
  });

  it("clamps count to maximum", () => {
    expect(generateLorem("words", 9999).split(" ").length).toBeLessThanOrEqual(200);
  });

  it("clamps count to minimum", () => {
    expect(generateLorem("words", 0).split(" ").length).toBeGreaterThanOrEqual(1);
  });
});
