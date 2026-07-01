import { t } from '$lib/i18n/i18n.svelte';

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
		if (isNaN(d.getTime())) return { error: t().tools.timestamp.errorInvalidTimestamp };
		return { unix: Math.floor(ms / 1000), unixMs: ms, iso: d.toISOString(), utc: d.toUTCString() };
	}

	const d = new Date(trimmed);
	if (isNaN(d.getTime())) return { error: t().tools.timestamp.errorCannotParse.replace('{input}', trimmed) };
	const ms = d.getTime();
	return { unix: Math.floor(ms / 1000), unixMs: ms, iso: d.toISOString(), utc: d.toUTCString() };
}

export function nowTimestamp(): number {
	return Math.floor(Date.now() / 1000);
}
