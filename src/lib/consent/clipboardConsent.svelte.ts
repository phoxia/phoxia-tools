export const CLIPBOARD_CONSENT_VERSION = "1";
const CLIPBOARD_CONSENT_KEY = "phoxia-clipboard-consent";

type StoredClipboardConsent = { granted: boolean; version: string; timestamp: string };

let _consent = $state<StoredClipboardConsent | null>(null);
let _showPrompt = $state(true);

export function initClipboardConsent() {
  try {
    const raw = localStorage.getItem(CLIPBOARD_CONSENT_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);

    if (parsed.version !== CLIPBOARD_CONSENT_VERSION) {
      localStorage.removeItem(CLIPBOARD_CONSENT_KEY);
      return;
    }

    _consent = parsed;
    _showPrompt = false;
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded)
    localStorage.removeItem(CLIPBOARD_CONSENT_KEY);
  }
}

export function hasClipboardConsent(): boolean {
  return _consent?.granted === true;
}

export function showClipboardPrompt(): boolean {
  return _showPrompt;
}

function store(granted: boolean) {
  const stored: StoredClipboardConsent = {
    granted,
    version: CLIPBOARD_CONSENT_VERSION,
    timestamp: new Date().toISOString(),
  };
  try {
    localStorage.setItem(CLIPBOARD_CONSENT_KEY, JSON.stringify(stored));
  } catch {
    // localStorage may be unavailable
  }
  _consent = stored;
  _showPrompt = false;
}

export function grantClipboardConsent() {
  store(true);
}

export function declineClipboardConsent() {
  store(false);
}

export function revokeClipboardConsent() {
  localStorage.removeItem(CLIPBOARD_CONSENT_KEY);
  _consent = null;
  _showPrompt = true;
}
