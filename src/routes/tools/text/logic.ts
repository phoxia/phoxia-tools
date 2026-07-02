// --- Text mode ---
export type TextMode =
  "case" | "slug" | "counter" | "reverse" | "sort" | "dedupe" | "find" | "affix";

// --- Case conversion (from case/logic.ts) ---

export type CaseMode = "camel" | "pascal" | "snake" | "screaming" | "kebab" | "upper" | "lower";

function tokenize(input: string): string[] {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[\s_\-./\\]+/)
    .map((w) => w.toLowerCase())
    .filter(Boolean);
}

export function toCase(input: string, mode: CaseMode): string {
  const words = tokenize(input);
  if (words.length === 0) return "";
  const modes: Record<CaseMode, () => string> = {
    camel: () => words.map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1))).join(""),
    pascal: () => words.map((w) => w[0].toUpperCase() + w.slice(1)).join(""),
    snake: () => words.join("_").toLowerCase(),
    screaming: () => words.join("_").toUpperCase(),
    kebab: () => words.join("-"),
    upper: () => input.toUpperCase(),
    lower: () => input.toLowerCase(),
  };
  return modes[mode]();
}

// --- Slug (from slug/logic.ts) ---

export function toSlug(input: string, separator: "-" | "_" = "-"): string {
  const base = input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return separator === "_" ? base.replace(/-/g, "_") : base;
}

// --- Counter ---

export interface CountResult {
  chars: number;
  charsNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
}

export function countText(input: string): CountResult {
  const trimmed = input.trim();
  if (trimmed.length === 0)
    return { chars: 0, charsNoSpaces: 0, words: 0, lines: 0, paragraphs: 0 };
  return {
    chars: input.length,
    charsNoSpaces: input.replace(/\s/g, "").length,
    words: trimmed.split(/\s+/).length,
    lines: input.split("\n").length,
    paragraphs: trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length,
  };
}

// --- Reverse ---

export function reverseText(input: string): string {
  return input.split("").reverse().join("");
}

// --- Sort lines ---

export function sortLines(
  input: string,
  asc: boolean = true,
  caseInsensitive: boolean = true
): string {
  const lines = input.split("\n");
  const sorted = [...lines].sort((a, b) => {
    const la = caseInsensitive ? a.toLowerCase() : a;
    const lb = caseInsensitive ? b.toLowerCase() : b;
    if (la < lb) return asc ? -1 : 1;
    if (la > lb) return asc ? 1 : -1;
    return 0;
  });
  return sorted.join("\n");
}

// --- Dedupe lines ---

export function dedupeLines(input: string): { output: string; removed: number } {
  const lines = input.split("\n");
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const line of lines) {
    if (!seen.has(line)) {
      seen.add(line);
      unique.push(line);
    }
  }
  return { output: unique.join("\n"), removed: lines.length - unique.length };
}

// --- Find & Replace ---

export function findReplace(
  input: string,
  find: string,
  replace: string,
  useRegex: boolean = false
): { output: string; count: number } {
  if (find.length === 0) return { output: input, count: 0 };
  let count = 0;
  let output: string;
  if (useRegex) {
    try {
      const re = new RegExp(find, "g");
      output = input.replace(re, () => {
        count++;
        return replace;
      });
    } catch {
      return { output: input, count: 0 };
    }
  } else {
    // Escape regex special chars for literal search
    const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(escaped, "g");
    output = input.replace(re, () => {
      count++;
      return replace;
    });
  }
  return { output, count };
}

// --- Prefix / Suffix ---

export function addAffix(input: string, prefix: string = "", suffix: string = ""): string {
  if (!prefix && !suffix) return input;
  return input
    .split("\n")
    .map((line) => `${prefix}${line}${suffix}`)
    .join("\n");
}
