import { describe, it, expect } from "vitest";
import { escape, escapeAttr, safeHref, renderInline, renderMd } from "./logic";

describe("escape", () => {
  it("escapes HTML entities", () => {
    expect(escape('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert("xss")&lt;/script&gt;'
    );
  });

  it("escapes ampersands", () => {
    expect(escape("a & b")).toBe("a &amp; b");
  });

  it("returns plain text unchanged", () => {
    expect(escape("hello world")).toBe("hello world");
  });
});

describe("escapeAttr", () => {
  it("escapes double quotes for HTML attributes", () => {
    const result = escapeAttr('" onclick="alert(1)');
    expect(result).not.toContain('"');
    expect(result).toContain("&quot;");
  });

  it("escapes single quotes for HTML attributes", () => {
    const result = escapeAttr("' onclick='alert(1)");
    expect(result).not.toContain("'");
    expect(result).toContain("&#39;");
  });
});

describe("safeHref", () => {
  it("allows http URLs", () => {
    expect(safeHref("http://example.com")).toBe("http://example.com");
  });

  it("allows https URLs", () => {
    expect(safeHref("https://example.com")).toBe("https://example.com");
  });

  it("blocks javascript: URLs", () => {
    expect(safeHref("javascript:alert(1)")).toBe("");
  });

  it("blocks data: URLs", () => {
    expect(safeHref("data:text/html,<script>alert(1)</script>")).toBe("");
  });

  it("blocks vbscript: URLs", () => {
    expect(safeHref("vbscript:msgbox(1)")).toBe("");
  });

  it("is case-insensitive for dangerous protocols", () => {
    expect(safeHref("JavaScript:alert(1)")).toBe("");
    expect(safeHref("DATA:foo")).toBe("");
  });
});

describe("renderInline", () => {
  it("renders bold with **", () => {
    expect(renderInline("**hello**")).toBe("<strong>hello</strong>");
  });

  it("renders italic with *", () => {
    expect(renderInline("*hello*")).toBe("<em>hello</em>");
  });

  it("renders inline code", () => {
    expect(renderInline("`code`")).toBe("<code>code</code>");
  });

  it("renders links", () => {
    const result = renderInline("[click](https://example.com)");
    expect(result).toContain('<a href="https://example.com"');
    expect(result).toContain(">click</a>");
  });

  it("strips dangerous link hrefs", () => {
    // note: nested parens like alert(1) cause the regex to capture only up to the first )
    // this is a known limitation, security is preserved, just the trailing ) remains as text
    const result = renderInline("[click](javascript:alert(1))");
    expect(result).not.toContain("<a");
    expect(result).toContain("click");
  });

  it("escapes HTML in text content", () => {
    const result = renderInline("<script>alert(1)</script>");
    expect(result).not.toContain("<script>");
    expect(result).toContain("&lt;script&gt;");
  });
});

describe("renderMd", () => {
  it("renders headings", () => {
    const html = renderMd("# Hello\n## World");
    expect(html).toContain("<h1>Hello</h1>");
    expect(html).toContain("<h2>World</h2>");
  });

  it("renders paragraphs", () => {
    const html = renderMd("hello world");
    expect(html).toContain("<p>hello world</p>");
  });

  it("renders code blocks with escaped lang", () => {
    const html = renderMd('```"><script>\nalert(1)\n```');
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("<pre><code");
  });

  it("renders unordered lists", () => {
    const html = renderMd("- item 1\n- item 2");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>item 1</li>");
    expect(html).toContain("<li>item 2</li>");
  });

  it("renders ordered lists", () => {
    const html = renderMd("1. first\n2. second");
    expect(html).toContain("<ol>");
    expect(html).toContain("<li>first</li>");
  });

  it("renders horizontal rules", () => {
    expect(renderMd("---")).toBe("<hr>");
    expect(renderMd("***")).toBe("<hr>");
  });

  it("escapes HTML in paragraphs", () => {
    const html = renderMd("<script>bad</script>");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;bad&lt;/script&gt;");
  });

  it("renders blockquotes", () => {
    const html = renderMd("> quoted text");
    expect(html).toContain("<blockquote>");
    expect(html).toContain("quoted text");
  });

  it("returns empty string for empty input", () => {
    expect(renderMd("")).toBe("");
  });
});
