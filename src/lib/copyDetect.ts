import { decodeBase64 } from "../routes/tools/encode/logic";
import { decodeJwt } from "../routes/tools/jwt/logic";
import { parseCurl } from "../routes/tools/curl/logic";
import { isValidUuid } from "../routes/tools/uuid/logic";

const MIN_LEN = 16; // ~12 decoded bytes; below this, false positives dominate
const MAX_LEN = 20_000;

export const COPY_DETECT_PREFILL_KEY = "phoxia-encode-prefill";

export function looksLikeBase64(raw: string): boolean {
  const s = raw.trim();
  if (s.length < MIN_LEN || s.length > MAX_LEN) return false;
  if (!/^[A-Za-z0-9+/_-]+={0,2}$/.test(s)) return false;
  if (s.replace(/=+$/, "").length % 4 === 1) return false;
  if (!/[0-9+/=_-]/.test(s)) return false;
  return true;
}

export function isPrintableText(s: string): boolean {
  if (!s) return false;
  let printable = 0;
  for (const ch of s) {
    const c = ch.codePointAt(0)!;
    if (c === 9 || c === 10 || c === 13 || (c >= 32 && c < 127) || c > 127) printable++;
  }
  return printable / [...s].length > 0.85;
}

export type Format = "base64" | "jwt" | "curl" | "cipher" | "uuid";
export type FormatMatch = { format: Format; route: string; preview: string };

const CIPHER_RE = /^v1:[A-Za-z0-9+/=]+$/;
const JWT_SHAPE_RE = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
const CURL_RE = /^curl\s/i;

// Order matters: JWT/curl/cipher/UUID are checked before the generic base64
// fallback. A UUID's hex+dash charset also satisfies the base64url charset
// regex (dashes are valid base64url chars), so checking it first prevents it
// from being misreported as "just base64".
export function detectFormat(raw: string): FormatMatch | null {
  const s = raw.trim();
  if (s.length < 3 || s.length > MAX_LEN) return null;

  if (CURL_RE.test(s)) {
    const r = parseCurl(s);
    if (!r.error) return { format: "curl", route: "/tools/curl", preview: `${r.method} ${r.url}` };
  }

  if (CIPHER_RE.test(s)) {
    return { format: "cipher", route: "/tools/cipher", preview: "Payload criptografado detectado" };
  }

  if (JWT_SHAPE_RE.test(s)) {
    const r = decodeJwt(s);
    if (!r.error && r.payload) {
      const sub = typeof r.payload.sub === "string" ? r.payload.sub : undefined;
      const preview = sub ? `sub: ${sub}` : JSON.stringify(r.payload).slice(0, 100);
      return { format: "jwt", route: "/tools/jwt", preview };
    }
  }

  if (isValidUuid(s)) {
    return { format: "uuid", route: "/tools/uuid", preview: s };
  }

  if (looksLikeBase64(s)) {
    const r = decodeBase64(s);
    if (r.ok && isPrintableText(r.value)) {
      return {
        format: "base64",
        route: "/tools/encode?tab=base64",
        preview: r.value.slice(0, 200),
      };
    }
  }

  return null;
}

const SEEN_KEY = "phoxia-clipboard-seen";
const SEEN_MAX = 20; // small ring buffer, not indefinite retention

function simpleHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h.toString(36);
}

export function hasBeenHandled(text: string): boolean {
  try {
    const seen: string[] = JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? "[]");
    return seen.includes(simpleHash(text));
  } catch {
    return false;
  }
}

export function markHandled(text: string): void {
  try {
    const seen: string[] = JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? "[]");
    const hash = simpleHash(text);
    if (seen.includes(hash)) return;
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([...seen, hash].slice(-SEEN_MAX)));
  } catch {
    // sessionStorage unavailable (private browsing) — dedupe just won't persist, not fatal
  }
}
