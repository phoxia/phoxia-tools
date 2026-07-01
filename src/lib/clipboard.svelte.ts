import { announce } from '$lib/announce.svelte';

export async function copyToClipboard(text: string, successMsg?: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		if (successMsg) announce(successMsg);
		return true;
	} catch {
		announce('Copy failed');
		return false;
	}
}
