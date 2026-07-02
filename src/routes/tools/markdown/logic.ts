export function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function escapeAttr(s: string): string {
  return escape(s).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function safeHref(url: string): string {
  const trimmed = url.trim();
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return "";
  return trimmed;
}

export function renderInline(s: string): string {
  return escape(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_: string, text: string, url: string) => {
      const href = safeHref(url);
      return href
        ? `<a href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">${text}</a>`
        : text;
    });
}

export function renderMd(src: string, onTrack?: () => void): string {
  onTrack?.();
  const lines = src.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(escape(lines[i]));
        i++;
      }
      out.push(`<pre><code class="lang-${escapeAttr(lang)}">${codeLines.join("\n")}</code></pre>`);
      i++;
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      out.push("<hr>");
      i++;
      continue;
    }

    const hm = line.match(/^(#{1,6})\s+(.+)/);
    if (hm) {
      const level = hm[1].length;
      out.push(`<h${level}>${renderInline(hm[2])}</h${level}>`);
      i++;
      continue;
    }

    if (line.startsWith(">")) {
      const bqLines: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        bqLines.push(lines[i].slice(1).trim());
        i++;
      }
      out.push(`<blockquote>${renderMd(bqLines.join("\n"))}</blockquote>`);
      continue;
    }

    if (/^[-*+]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        items.push(`<li>${renderInline(lines[i].slice(2))}</li>`);
        i++;
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(`<li>${renderInline(lines[i].replace(/^\d+\.\s/, ""))}</li>`);
        i++;
      }
      out.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith(">") &&
      !/^[-*+]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !lines[i].startsWith("```") &&
      !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    out.push(`<p>${renderInline(paraLines.join(" "))}</p>`);
  }

  return out.join("\n");
}
