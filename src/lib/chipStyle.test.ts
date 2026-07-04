import { describe, it, expect } from "vitest";
import { chipStyle } from "./chipStyle";

describe("chipStyle", () => {
  it("uses accent border/background/color when active", () => {
    const style = chipStyle(true);
    expect(style).toContain("border: 1px solid var(--color-accent);");
    expect(style).toContain("color-mix(in srgb, var(--color-accent) 10%, transparent)");
    expect(style).toContain("color: var(--color-accent);");
    expect(style).toContain("font-weight: 600;");
  });

  it("uses muted border/background/color when inactive", () => {
    const style = chipStyle(false);
    expect(style).toContain("border: 1px solid var(--color-border);");
    expect(style).toContain("background: transparent;");
    expect(style).toContain("color: var(--color-text-muted);");
    expect(style).toContain("font-weight: 400;");
  });

  it("appends mono font-family only when requested", () => {
    expect(chipStyle(true, { mono: true })).toContain("font-family: var(--font-mono);");
    expect(chipStyle(true)).not.toContain("font-family");
  });

  it("appends extra CSS verbatim when provided", () => {
    expect(chipStyle(true, { extra: "text-transform: capitalize;" })).toContain(
      "text-transform: capitalize;"
    );
  });

  it("has no mono or extra segments when no options are passed", () => {
    const style = chipStyle(false);
    expect(style).not.toContain("font-family");
    expect(style).not.toContain("text-transform");
  });
});
