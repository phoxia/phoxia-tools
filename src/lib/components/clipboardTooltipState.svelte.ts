import { detectFormat, hasBeenHandled, markHandled, type FormatMatch } from "$lib/copyDetect";

const AUTO_HIDE_MS = 10_000;

let _visible = $state(false);
let _luxState = $state<"thinking" | "happy">("thinking");
let _match = $state<FormatMatch | null>(null);
let _originalText = $state("");

let hideTimer: ReturnType<typeof setTimeout> | undefined;
let happyTimer: ReturnType<typeof setTimeout> | undefined;

export function tooltipVisible(): boolean {
  return _visible;
}
export function tooltipLuxState(): "thinking" | "happy" {
  return _luxState;
}
export function tooltipMatch(): FormatMatch | null {
  return _match;
}
export function tooltipOriginalText(): string {
  return _originalText;
}

// Runs the shared multi-format detection pipeline (ambient clipboard checks
// only — the in-page copy trigger was removed, this only ever fires from
// content already sitting in the OS clipboard when the tab regains focus).
// Returns true if a match was shown, false otherwise (blank/short text, no
// recognizable format, or a value already surfaced this session).
export function evaluateClipboardText(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || hasBeenHandled(trimmed)) return false;

  const match = detectFormat(trimmed);
  if (!match) return false;

  markHandled(trimmed);
  _match = match;
  _originalText = trimmed;
  _luxState = "thinking";
  _visible = true;

  clearTimeout(hideTimer);
  clearTimeout(happyTimer);
  happyTimer = setTimeout(() => (_luxState = "happy"), 400);
  hideTimer = setTimeout(() => (_visible = false), AUTO_HIDE_MS);
  return true;
}

export function dismissTooltip() {
  _visible = false;
  clearTimeout(hideTimer);
  clearTimeout(happyTimer);
}
