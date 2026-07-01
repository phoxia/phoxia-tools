import { t } from '$lib/i18n/i18n.svelte';
import { ok, err } from '$lib/result';
import type { Result } from '$lib/result';

export type UrlParts = {
	protocol: string;
	hostname: string;
	port: string;
	pathname: string;
	search: string;
	hash: string;
	params: Record<string, string>;
};
export type UrlParseError = { error: string };

export function encodeUrl(input: string): string {
	return encodeURIComponent(input);
}

export function decodeUrl(input: string): Result<string> {
	try {
		return ok(decodeURIComponent(input));
	} catch (e) {
		return err(`${t().common.error}: ${(e as Error).message}`);
	}
}

export function parseUrl(input: string): UrlParts | UrlParseError {
	try {
		const url = new URL(input);
		const params: Record<string, string> = {};
		url.searchParams.forEach((v, k) => (params[k] = v));
		return {
			protocol: url.protocol,
			hostname: url.hostname,
			port: url.port,
			pathname: url.pathname,
			search: url.search,
			hash: url.hash,
			params
		};
	} catch {
		return { error: t().tools.url.errorInvalid.replace('{input}', input) };
	}
}
