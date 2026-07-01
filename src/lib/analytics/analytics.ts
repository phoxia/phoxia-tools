import { isAccepted } from '$lib/consent/consent.svelte';

declare function gtag(...args: unknown[]): void;

export function trackToolUsed(toolId: string) {
	if (!isAccepted()) return;
	if (typeof gtag === 'undefined') return;
	gtag('event', 'tool_used', { tool_id: toolId });
}
