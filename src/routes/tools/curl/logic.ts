import { t } from "$lib/i18n/i18n.svelte";

export type CurlResult = {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string | null;
  fetch: string;
  axios: string;
  error?: string;
};

function tokenize(cmd: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote = "";
  for (const ch of cmd.trim()) {
    if (quote) {
      if (ch === quote) {
        quote = "";
        tokens.push(current);
        current = "";
      } else current += ch;
    } else if (ch === "'" || ch === '"') {
      quote = ch;
    } else if (ch === " " || ch === "\t") {
      if (current) {
        tokens.push(current);
        current = "";
      }
    } else {
      current += ch;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

function btoa64(s: string): string {
  return btoa(s);
}

export function parseCurl(cmd: string): CurlResult {
  const tokens = tokenize(cmd.replace(/\\\n/g, " "));

  if (tokens[0]?.toLowerCase() !== "curl") {
    return {
      method: "GET",
      url: "",
      headers: {},
      body: null,
      fetch: "",
      axios: "",
      error: t().tools.curl.errorNotCurl,
    };
  }

  let method = "";
  const headers: Record<string, string> = {};
  let body: string | null = null;
  let url = "";

  for (let i = 1; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "-X" || t === "--request") {
      method = tokens[++i]?.toUpperCase() ?? "GET";
    } else if (t === "-H" || t === "--header") {
      const h = tokens[++i] ?? "";
      const colon = h.indexOf(":");
      if (colon !== -1) headers[h.slice(0, colon).trim()] = h.slice(colon + 1).trim();
    } else if (t === "-d" || t === "--data" || t === "--data-raw" || t === "--data-binary") {
      body = tokens[++i] ?? null;
    } else if (t === "-u" || t === "--user") {
      const creds = tokens[++i] ?? "";
      headers["Authorization"] = `Basic ${btoa64(creds)}`;
    } else if (!t.startsWith("-")) {
      url = t;
    }
  }

  if (!url)
    return {
      method: "GET",
      url: "",
      headers: {},
      body: null,
      fetch: "",
      axios: "",
      error: t().tools.curl.errorNoUrl,
    };

  if (!method) method = body ? "POST" : "GET";

  const fetchCode = buildFetch(method, url, headers, body);
  const axiosCode = buildAxios(method, url, headers, body);

  return { method, url, headers, body, fetch: fetchCode, axios: axiosCode };
}

function buildFetch(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string | null
): string {
  const hasHeaders = Object.keys(headers).length > 0;
  const isGet = method === "GET";
  if (isGet && !hasHeaders) return `fetch('${url}')`;
  const opts: string[] = [];
  if (!isGet) opts.push(`  method: '${method}',`);
  if (hasHeaders)
    opts.push(
      `  headers: {\n${Object.entries(headers)
        .map(([k, v]) => `    '${k}': '${v}'`)
        .join(",\n")}\n  },`
    );
  if (body) opts.push(`  body: ${JSON.stringify(body)},`);
  return `fetch('${url}', {\n${opts.join("\n")}\n})`;
}

function buildAxios(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string | null
): string {
  const m = method.toLowerCase();
  const hasConfig = Object.keys(headers).length > 0;
  const config = hasConfig
    ? `, {\n  headers: {\n${Object.entries(headers)
        .map(([k, v]) => `    '${k}': '${v}'`)
        .join(",\n")}\n  }\n}`
    : "";

  if (m === "get" || m === "delete") return `axios.${m}('${url}'${config})`;
  const data = body ? `\n  ${JSON.stringify(body)},` : "";
  return `axios.${m}('${url}',${data}${config ? `\n${config.slice(2)}` : ""})`;
}
