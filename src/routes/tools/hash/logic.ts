import { t } from '$lib/i18n/i18n.svelte';
import { ok, err } from '$lib/result';
import type { Result } from '$lib/result';

export type HashAlgo = 'SHA-1' | 'SHA-256' | 'SHA-512';

const MAX_INPUT = 500_000;

export async function hashText(input: string, algo: HashAlgo): Promise<Result<string>> {
	if (input.length > MAX_INPUT) return err(t().tools.hash.errorSize);
	const bytes = new TextEncoder().encode(input);
	const buf = await crypto.subtle.digest(algo, bytes);
	const hex = Array.from(new Uint8Array(buf))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
	return ok(hex);
}
