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
