export const CONSENT_VERSION = '2';

const CONSENT_KEY = 'phoxia-consent';

export type ConsentCategories = {
	analytics: boolean;
	advertising: boolean;
};

type StoredConsent = {
	analytics: boolean;
	advertising: boolean;
	version: string;
	timestamp: string;
};

let _consent = $state<StoredConsent | null>(null);
let _showBanner = $state(true);
let _versionChanged = $state(false);

export function initConsent() {
	try {
		const raw = localStorage.getItem(CONSENT_KEY);
		if (!raw) return;
		const parsed = JSON.parse(raw);

		// Upgrade from v1 (binary 'accepted'/'declined') to v2 (granular)
		if (!parsed.version || parsed.version === '1') {
			localStorage.removeItem(CONSENT_KEY);
			_versionChanged = true;
			return;
		}

		if (parsed.version !== CONSENT_VERSION) {
			localStorage.removeItem(CONSENT_KEY);
			_versionChanged = true;
			return;
		}

		_consent = parsed;
		_showBanner = false;
	} catch {
		// localStorage may be unavailable (private browsing, quota exceeded)
		localStorage.removeItem(CONSENT_KEY);
	}
}

export function getConsent(): StoredConsent | null {
	return _consent;
}

export function isAccepted(): boolean {
	return _consent !== null;
}

export function hasAnalyticsConsent(): boolean {
	return _consent?.analytics === true;
}

export function hasAdvertisingConsent(): boolean {
	return _consent?.advertising === true;
}

export function showBanner(): boolean {
	return _showBanner;
}

export function versionChanged(): boolean {
	return _versionChanged;
}

export function saveConsent({ analytics, advertising }: ConsentCategories) {
	const stored: StoredConsent = {
		analytics,
		advertising,
		version: CONSENT_VERSION,
		timestamp: new Date().toISOString()
	};
	try {
		localStorage.setItem(CONSENT_KEY, JSON.stringify(stored));
	} catch {
		// localStorage may be unavailable (private browsing, quota exceeded)
	}
	_consent = stored;
	_showBanner = false;
	_versionChanged = false;
}

export function decline() {
	const stored: StoredConsent = {
		analytics: false,
		advertising: false,
		version: CONSENT_VERSION,
		timestamp: new Date().toISOString()
	};
	try {
		localStorage.setItem(CONSENT_KEY, JSON.stringify(stored));
	} catch {
		// localStorage may be unavailable
	}
	_consent = stored;
	_showBanner = false;
	_versionChanged = false;
}

export function revoke() {
	localStorage.removeItem(CONSENT_KEY);
	_consent = null;
	_showBanner = true;
	_versionChanged = false;
}
