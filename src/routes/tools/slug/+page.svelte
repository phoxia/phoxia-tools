<script lang="ts">
	import ToolLayout from '$lib/components/ToolLayout.svelte';
	import { t } from '$lib/i18n/i18n.svelte';
import { copyToClipboard } from '$lib/clipboard.svelte';
	import { trackToolUsed } from '$lib/analytics/analytics';
	import { toSlug } from './logic';

	let input = $state('Hello, World! · Olá Mundo');
	let separator = $state<'-' | '_'>('-');
	let copied = $state(false);

	const slug = $derived.by(() => {
		const base = toSlug(input);
		return separator === '_' ? base.replace(/-/g, '_') : base;
	});

	async function copy() {
		if (!slug) return;
		copied = await copyToClipboard(slug, t().common.copied);
		if (copied) { trackToolUsed('slug'); setTimeout(() => (copied = false), 1500); }
	}
</script>

<ToolLayout toolId="slug" title={t().tools.slug.name} description={t().tools.slug.desc}>
	<div style="display: flex; flex-direction: column; gap: 1rem;">
		<div>
			<label for="slug-input" style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);">
				{t().tools.slug.labelInput}
			</label>
			<input
				id="slug-input"
				type="text"
				bind:value={input}
				placeholder={t().tools.slug.placeholder}
				style="
					width: 100%; padding: 0.625rem 0.875rem; box-sizing: border-box;
					background: var(--color-surface); border: 1px solid var(--color-border);
					border-radius: var(--radius); color: var(--color-text); font-size: 0.9rem;
				"
			/>
		</div>

		<div style="display: flex; gap: 0.5rem; align-items: center;">
			<span style="font-size: 0.8rem; color: var(--color-text-muted);">{t().tools.slug.labelSeparator}</span>
			{#each ['-', '_'] as sep}
				<button
					onclick={() => (separator = sep as '-' | '_')}
					style="
						padding: 0.25rem 0.75rem; border-radius: 99px; font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer;
						border: 1px solid {separator === sep ? 'var(--color-accent)' : 'var(--color-border)'};
						background: {separator === sep ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)' : 'transparent'};
						color: {separator === sep ? 'var(--color-accent)' : 'var(--color-text-muted)'};
					"
				>{sep}</button>
			{/each}
		</div>

		{#if slug}
			<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); overflow: hidden;">
				<div style="display: flex; justify-content: space-between; align-items: center; padding: 0.375rem 0.875rem; border-bottom: 1px solid var(--color-border);">
					<span style="font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-text-faint);">{t().tools.slug.labelSlug}</span>
					<button onclick={copy}
						style="background: none; border: none; color: var(--color-text-muted); cursor: pointer; font-size: 0.75rem; padding: 0;">
						{copied ? t().common.copied : t().common.copy}
					</button>
				</div>
				<code style="display: block; padding: 0.875rem; font-family: var(--font-mono); font-size: 0.9rem; color: var(--color-text); word-break: break-all; line-height: 1.5;">
					{slug}
				</code>
			</div>
		{/if}
	</div>
</ToolLayout>
