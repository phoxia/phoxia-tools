import { describe, it, expect } from "vitest";
import { statusToLux, statusToColor } from "./field-status";

describe("statusToLux", () => {
  it("maps error to worried", () => {
    expect(statusToLux("error")).toBe("worried");
  });

  it("maps warning to confused", () => {
    expect(statusToLux("warning")).toBe("confused");
  });

  it("maps success to happy", () => {
    expect(statusToLux("success")).toBe("happy");
  });

  it("maps info and idle to active", () => {
    expect(statusToLux("info")).toBe("active");
    expect(statusToLux("idle")).toBe("active");
  });
});

describe("statusToColor", () => {
  it("maps each status to its design token", () => {
    expect(statusToColor("error")).toBe("var(--color-error)");
    expect(statusToColor("warning")).toBe("var(--color-warning)");
    expect(statusToColor("success")).toBe("var(--color-success)");
    expect(statusToColor("info")).toBe("var(--color-accent)");
    expect(statusToColor("idle")).toBe("var(--color-border)");
  });
});
