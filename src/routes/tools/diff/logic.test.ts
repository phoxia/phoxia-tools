import { describe, it, expect } from "vitest";
import { computeDiff } from "./logic";

describe("computeDiff", () => {
  it("returns empty for identical inputs", () => {
    const d = computeDiff("foo\nbar", "foo\nbar");
    expect(d.every((l) => l.type === "equal")).toBe(true);
  });

  it("shows added line", () => {
    const d = computeDiff("foo", "foo\nbar");
    expect(d.some((l) => l.type === "added" && l.text === "bar")).toBe(true);
    expect(d.some((l) => l.type === "equal" && l.text === "foo")).toBe(true);
  });

  it("shows removed line", () => {
    const d = computeDiff("foo\nbar", "foo");
    expect(d.some((l) => l.type === "removed" && l.text === "bar")).toBe(true);
  });

  it("shows modified line as removed+added", () => {
    const d = computeDiff("hello", "world");
    expect(d.some((l) => l.type === "removed")).toBe(true);
    expect(d.some((l) => l.type === "added")).toBe(true);
  });

  it("handles empty left", () => {
    const d = computeDiff("", "foo\nbar");
    expect(d.filter((l) => l.type === "added").map((l) => l.text)).toEqual(["foo", "bar"]);
  });

  it("handles empty right", () => {
    const d = computeDiff("foo\nbar", "");
    expect(d.filter((l) => l.type === "removed").map((l) => l.text)).toEqual(["foo", "bar"]);
  });

  it("handles both empty", () => {
    expect(computeDiff("", "")).toEqual([]);
  });

  it("preserves order of equal lines", () => {
    const d = computeDiff("a\nb\nc", "a\nb\nc");
    expect(d.map((l) => l.text)).toEqual(["a", "b", "c"]);
  });

  it("multi-line diff with changes in middle", () => {
    const d = computeDiff("a\nb\nc", "a\nX\nc");
    const types = d.map((l) => l.type);
    expect(types).toContain("equal");
    expect(types).toContain("removed");
    expect(types).toContain("added");
  });

  it("tracks left line numbers for removed/equal lines", () => {
    const d = computeDiff("a\nb", "a\nc");
    const aLine = d.find((l) => l.type === "equal");
    expect(aLine?.leftLine).toBe(1);
  });

  it("tracks right line numbers for added/equal lines", () => {
    const d = computeDiff("a\nb", "a\nc");
    const cLine = d.find((l) => l.type === "added");
    expect(cLine?.rightLine).toBe(2);
  });
});
