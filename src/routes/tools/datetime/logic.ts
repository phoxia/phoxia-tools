// --- Datetime mode ---
export type DateTimeMode = "timestamp" | "cron" | "diff" | "math" | "hours" | "countdown";

// --- Timestamp (from timestamp/logic.ts) ---

const MS_THRESHOLD = 1e12;

export type ParseResult =
  | { unix: number; unixMs: number; iso: string; utc: string; error?: undefined }
  | { error: string; unix?: undefined; unixMs?: undefined; iso?: undefined; utc?: undefined };

export function parseTimestamp(input: string): ParseResult {
  const trimmed = input.trim();
  if (/^\d+$/.test(trimmed)) {
    const n = parseInt(trimmed, 10);
    const ms = n > MS_THRESHOLD ? n : n * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return { error: "Invalid timestamp" };
    return { unix: Math.floor(ms / 1000), unixMs: ms, iso: d.toISOString(), utc: d.toUTCString() };
  }
  const d = new Date(trimmed);
  if (isNaN(d.getTime())) return { error: `Cannot parse: "${trimmed}"` };
  const ms = d.getTime();
  return { unix: Math.floor(ms / 1000), unixMs: ms, iso: d.toISOString(), utc: d.toUTCString() };
}

export function nowTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

// --- Cron (from cron/logic.ts) ---

export type CronField = "min" | "hour" | "dom" | "month" | "dow";

export function parseCron(
  expr: string
):
  { fields: Record<CronField, string>; error?: undefined } | { error: string; fields?: undefined } {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return { error: "Cron expression must have 5 fields" };
  const valid = /^[\d*/,\-]+$/;
  for (const part of parts) {
    if (!valid.test(part)) return { error: "Invalid cron expression" };
  }
  return {
    fields: {
      min: parts[0],
      hour: parts[1],
      dom: parts[2],
      month: parts[3],
      dow: parts[4],
    },
  };
}

export function nextCronExecutions(expr: string, count: number = 5): Date[] {
  const result = parseCron(expr);
  if ("error" in result) return [];
  const results: Date[] = [];
  const now = new Date();
  let cursor = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes() + 1,
    0,
    0
  );

  const maxIter = 525600; // 1 year in minutes
  for (let iter = 0; iter < maxIter && results.length < count; iter++) {
    if (cronMatches(result.fields, cursor)) {
      results.push(new Date(cursor));
    }
    cursor = new Date(cursor.getTime() + 60000);
  }
  return results;
}

function cronMatches(f: Record<CronField, string>, d: Date): boolean {
  return (
    fieldMatch(f.min, d.getMinutes(), 0, 59) &&
    fieldMatch(f.hour, d.getHours(), 0, 23) &&
    fieldMatch(f.dom, d.getDate(), 1, 31) &&
    fieldMatch(f.month, d.getMonth() + 1, 1, 12) &&
    fieldMatch(f.dow, d.getDay(), 0, 6)
  );
}

function fieldMatch(expr: string, value: number, _min: number, _max: number): boolean {
  if (expr === "*") return true;
  const parts = expr.split(",");
  for (const part of parts) {
    if (part.includes("/")) {
      const [range, stepStr] = part.split("/");
      const step = parseInt(stepStr, 10);
      const r = range === "*" ? { start: _min, end: _max } : parseRange(range);
      if (r && value >= r.start && value <= r.end && (value - r.start) % step === 0) return true;
    } else if (part.includes("-")) {
      const r = parseRange(part);
      if (r && value >= r.start && value <= r.end) return true;
    } else {
      if (parseInt(part, 10) === value) return true;
    }
  }
  return false;
}

function parseRange(expr: string): { start: number; end: number } | null {
  const [a, b] = expr.split("-").map(Number);
  if (isNaN(a) || isNaN(b)) return null;
  return { start: a, end: b };
}

// --- Date Diff ---

export interface DateDiffResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

export function diffDates(from: string, to: string): DateDiffResult | { error: string } {
  const d1 = new Date(from);
  const d2 = new Date(to);
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return { error: "Invalid date" };

  const [earlier, later] = d1 <= d2 ? [d1, d2] : [d2, d1];
  const totalDays = Math.floor((later.getTime() - earlier.getTime()) / 86400000);

  let years = later.getFullYear() - earlier.getFullYear();
  let months = later.getMonth() - earlier.getMonth();
  let days = later.getDate() - earlier.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days, totalDays };
}

// --- Date Math ---

export function addToDate(
  dateStr: string,
  days: number,
  months: number,
  years: number
): string | { error: string } {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { error: "Invalid date" };
  d.setFullYear(d.getFullYear() + years);
  d.setMonth(d.getMonth() + months);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

// --- Hours Calculator ---

export function sumHours(
  entries: string[]
): { ok: true; total: string } | { ok: false; error: string } {
  let totalMin = 0;
  for (const entry of entries) {
    const m = entry.trim().match(/^(-?\d+):(\d{2})$/);
    if (!m) return { ok: false, error: `Invalid time format: "${entry}". Use HH:MM.` };
    totalMin += parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  }
  const sign = totalMin < 0 ? "-" : "";
  const abs = Math.abs(totalMin);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return { ok: true, total: `${sign}${h}:${String(m).padStart(2, "0")}` };
}

// --- Countdown ---

export interface CountdownState {
  total: number; // ms remaining
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

export function computeCountdown(targetIso: string): CountdownState {
  const target = new Date(targetIso);
  const now = Date.now();
  const total = target.getTime() - now;
  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const totalSec = Math.floor(total / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { total, days, hours, minutes, seconds, done: false };
}
