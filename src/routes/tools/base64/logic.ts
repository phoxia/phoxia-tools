import { t } from '$lib/i18n/i18n.svelte';
import { ok, err } from '$lib/result';
import type { Result } from '$lib/result';

const MAX_INPUT = 500_000;

export function encodeBase64(input: string): Result<string> {
	if (input.length > MAX_INPUT) return err(t().tools.base64.errorSize);
	try {
		const bytes = new TextEncoder().encode(input);
		let binary = '';
		for (const byte of bytes) binary += String.fromCharCode(byte);
		return ok(btoa(binary));
	} catch (e) {
		return err(`${t().common.error}: ${(e as Error).message}`);
	}
}

export function decodeBase64(input: string): Result<string> {
	try {
		const padded = input.replace(/-/g, '+').replace(/_/g, '/');
		const binary = atob(padded);
		const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
		return ok(new TextDecoder().decode(bytes));
	} catch (e) {
		return err(`${t().common.error}: ${(e as Error).message}`);
	}
}
