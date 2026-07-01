const MODE_KEY = 'phoxia-mode';

export type ModePref = 'light' | 'dark' | 'system';
export type ResolvedMode = 'light' | 'dark';

function readStoredMode(): ModePref {
	if (typeof localStorage === 'undefined') return 'system';
	const stored = localStorage.getItem(MODE_KEY);
	if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
	return 'system';
}

function resolveSystem(): ResolvedMode {
	if (typeof window === 'undefined') return 'dark';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolve(mode: ModePref): ResolvedMode {
	return mode === 'system' ? resolveSystem() : mode;
}

let _mode: ModePref = $state('system');

if (typeof window !== 'undefined') {
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
		if (_mode === 'system') syncDom();
	});
}

function syncDom() {
	if (typeof document === 'undefined') return;
	const resolved = resolve(_mode);
	if (resolved === 'dark') {
		document.documentElement.removeAttribute('data-mode');
	} else {
		document.documentElement.setAttribute('data-mode', 'light');
	}
}

export function initTheme() {
	_mode = readStoredMode();
	syncDom();
}

export function getModePref(): ModePref {
	return _mode;
}

export function setModePref(mode: ModePref) {
	_mode = mode;
	if (typeof localStorage !== 'undefined') localStorage.setItem(MODE_KEY, mode);
	syncDom();
}

export function cycleMode() {
	const order: ModePref[] = ['dark', 'light', 'system'];
	const current = getModePref();
	setModePref(order[(order.indexOf(current) + 1) % order.length]);
}
