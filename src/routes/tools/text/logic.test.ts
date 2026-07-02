import { describe, it, expect } from "vitest";
import {
  toCase,
  toSlug,
  countText,
  reverseText,
  sortLines,
  dedupeLines,
  findReplace,
  addAffix,
} from "./logic";

describe("toCase", () => {
  it("converts to camelCase", () => {
    expect(toCase("hello world", "camel")).toBe("helloWorld");
    expect(toCase("HELLO_WORLD", "camel")).toBe("helloWorld");
    expect(toCase("helloWorld", "camel")).toBe("helloWorld");
  });

  it("converts to PascalCase", () => {
    expect(toCase("hello world", "pascal")).toBe("HelloWorld");
  });

  it("converts to snake_case", () => {
    expect(toCase("hello world", "snake")).toBe("hello_world");
    expect(toCase("HelloWorld", "snake")).toBe("hello_world");
  });

  it("converts to SCREAMING_SNAKE", () => {
    expect(toCase("hello world", "screaming")).toBe("HELLO_WORLD");
  });

  it("converts to kebab-case", () => {
    expect(toCase("hello world", "kebab")).toBe("hello-world");
  });

  it("converts to UPPER CASE", () => {
    expect(toCase("hello world", "upper")).toBe("HELLO WORLD");
  });

  it("converts to lower case", () => {
    expect(toCase("HELLO WORLD", "lower")).toBe("hello world");
  });

  it("returns empty string for empty input", () => {
    expect(toCase("", "camel")).toBe("");
    expect(toCase("   ", "pascal")).toBe("");
  });
});

describe("toSlug", () => {
  it("converts text to slug with default dash separator", () => {
    expect(toSlug("Hello, World!")).toBe("hello-world");
  });

  it("uses underscore separator", () => {
    expect(toSlug("Hello, World!", "_")).toBe("hello_world");
  });

  it("removes accents", () => {
    expect(toSlug("Olá, João!")).toBe("ola-joao");
  });

  it("handles empty string", () => {
    expect(toSlug("")).toBe("");
  });
});

describe("countText", () => {
  it("counts characters, words, lines, paragraphs", () => {
    const result = countText("hello world\n\nfoo bar baz");
    expect(result.chars).toBe(24);
    expect(result.charsNoSpaces).toBe(19);
    expect(result.words).toBe(5);
    expect(result.lines).toBe(3);
    expect(result.paragraphs).toBe(2);
  });

  it("returns zeroes for empty input", () => {
    const result = countText("");
    expect(result).toEqual({ chars: 0, charsNoSpaces: 0, words: 0, lines: 0, paragraphs: 0 });
  });

  it("handles whitespace-only input", () => {
    const result = countText("   \n  \n  ");
    expect(result.words).toBe(0);
  });
});

describe("reverseText", () => {
  it("reverses a string", () => {
    expect(reverseText("abc")).toBe("cba");
  });

  it("handles empty string", () => {
    expect(reverseText("")).toBe("");
  });

  it("handles unicode", () => {
    expect(reverseText("olá")).toBe("álo");
  });
});

describe("sortLines", () => {
  it("sorts lines ascending", () => {
    expect(sortLines("banana\napple\ncherry")).toBe("apple\nbanana\ncherry");
  });

  it("sorts lines descending", () => {
    expect(sortLines("banana\napple\ncherry", false)).toBe("cherry\nbanana\napple");
  });

  it("sorts case-insensitive by default", () => {
    expect(sortLines("Banana\napple\nCherry")).toBe("apple\nBanana\nCherry");
  });
});

describe("dedupeLines", () => {
  it("removes duplicate lines keeping first occurrence", () => {
    const result = dedupeLines("a\nb\na\nc\nb");
    expect(result.output).toBe("a\nb\nc");
    expect(result.removed).toBe(2);
  });

  it("returns empty for empty input", () => {
    const result = dedupeLines("");
    expect(result.output).toBe("");
    expect(result.removed).toBe(0);
  });

  it("handles no duplicates", () => {
    const result = dedupeLines("a\nb\nc");
    expect(result.output).toBe("a\nb\nc");
    expect(result.removed).toBe(0);
  });
});

describe("findReplace", () => {
  it("replaces literal text", () => {
    const result = findReplace("hello world hello", "hello", "hi");
    expect(result.output).toBe("hi world hi");
    expect(result.count).toBe(2);
  });

  it("uses regex when enabled", () => {
    const result = findReplace("cat cot cut", "c.t", "X", true);
    expect(result.output).toBe("X X X");
    expect(result.count).toBe(3);
  });

  it("returns unchanged on empty find", () => {
    const result = findReplace("hello", "", "X");
    expect(result.output).toBe("hello");
    expect(result.count).toBe(0);
  });

  it("handles invalid regex gracefully", () => {
    const result = findReplace("hello", "[invalid", "X", true);
    expect(result.output).toBe("hello");
    expect(result.count).toBe(0);
  });
});

describe("addAffix", () => {
  it("adds prefix to each line", () => {
    expect(addAffix("a\nb\nc", "> ")).toBe("> a\n> b\n> c");
  });

  it("adds suffix to each line", () => {
    expect(addAffix("a\nb\nc", "", ";")).toBe("a;\nb;\nc;");
  });

  it("adds both prefix and suffix", () => {
    expect(addAffix("a\nb", "(", ")")).toBe("(a)\n(b)");
  });

  it("returns unchanged if neither prefix nor suffix", () => {
    expect(addAffix("hello")).toBe("hello");
  });
});
