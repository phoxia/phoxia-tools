<script lang="ts">
	import ToolLayout from '$lib/components/ToolLayout.svelte';
	import { t } from '$lib/i18n/i18n.svelte';
import { copyToClipboard } from '$lib/clipboard.svelte';
	import { trackToolUsed } from '$lib/analytics/analytics';
	import { encodeUrl, decodeUrl, parseUrl } from './logic';
	import type { UrlParts } from './logic';

	let input = $state('');
	let output = $state('');
	let error = $state('');
	let hasResult = $state(false);
	let parsed = $state<UrlParts | null>(null);
	let copied = $state(false);

	function run(mode: 'encode' | 'decode' | 'parse') {
		error = '';
		parsed = null;
		hasResult = false;
		output = '';

		if (mode === 'encode') {
			output = encodeUrl(input);
			hasResult = true;
			trackToolUsed('url');
		} else if (mode === 'decode') {
			const r = decodeUrl(input);
			if (!r.ok) { error = r.error; } else { output = r.value; hasResult = true; trackToolUsed('url'); }
		} else {
			const r = parseUrl(input);
			if ('error' in r) { error = r.error; } else { parsed = r; trackToolUsed('url'); }
		}
	}

	function clear() { input = ''; output = ''; error = ''; hasResult = false; parsed = null; }

	async function copy() {
		copied = await copyToClipboard(output, t().common.copied);
		if (copied) setTimeout(() => (copied = false), 1500);
	}
</script>

<ToolLayout toolId="url" title={t().tools.url.name} description={t().tools.url.desc}>
	<div style="display: flex; flex-direction: column; gap: 1rem;">
		<div>
			<label for="url-input" style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);">
				{t().common.inputPlaceholder}
			</label>
			<input
				id="url-input"
				type="text"
				bind:value={input}
				placeholder={t().tools.url.placeholder}
				spellcheck={false}
				style="
					width: 100%; font-size: 0.875rem; font-family: var(--font-mono);
					background: var(--color-surface); border: 1px solid var(--color-border);
					border-radius: var(--radius); color: var(--color-text);
					padding: 0.5rem 0.75rem; box-sizing: border-box;
				"
			/>
		</div>

		<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
			{#each [['encode', t().common.encode], ['decode', t().common.decode], ['parse', t().tools.url.parseUrl]] as [mode, label]}
				<button
					onclick={() => run(mode as 'encode' | 'decode' | 'parse')}
					disabled={!input.trim()}
					style="
						background: {mode === 'encode' ? 'var(--color-accent)' : 'var(--color-surface)'};
						color: {mode === 'encode' ? '#050508' : 'var(--color-text)'};
						border: 1px solid {mode === 'encode' ? 'transparent' : 'var(--color-border)'};
						border-radius: var(--radius); padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;
						{mode === 'encode' ? 'font-weight: 600; border: none;' : ''}
					"
				>
					{label}
				</button>
			{/each}
			<button
				onclick={clear}
				style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
			>
				{t().common.clear}
			</button>
		</div>

		{#if error}
			<p role="alert" style="color: var(--color-error); font-size: 0.875rem; margin: 0;">{error}</p>
		{/if}

		{#if hasResult}
			<div>
				<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.375rem;">
					<label for="url-output" style="font-size: 0.85rem; color: var(--color-text-muted);">{t().common.outputPlaceholder}</label>
					<button onclick={copy} style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.25rem 0.625rem; cursor: pointer; font-size: 0.75rem;">
						{copied ? t().common.copied : t().common.copy}
					</button>
				</div>
				<input id="url-output" readonly value={output} style="width: 100%; font-family: var(--font-mono); font-size: 0.85rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text); padding: 0.75rem; box-sizing: border-box;" />
			</div>
		{/if}

		{#if parsed}
			<div style="display: flex; flex-direction: column; gap: 0.375rem;">
				{#each Object.entries(parsed).filter(([k]) => k !== 'params') as [key, value]}
					{#if value}
						<div style="display: flex; gap: 0.75rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.5rem 0.75rem;">
							<span style="font-size: 0.75rem; color: var(--color-text-faint); min-width: 80px; flex-shrink: 0;">{key}</span>
							<span style="font-family: var(--font-mono); font-size: 0.85rem;">{value}</span>
						</div>
					{/if}
				{/each}
				{#if Object.keys(parsed.params).length > 0}
					<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.5rem 0.75rem;">
						<span style="font-size: 0.75rem; color: var(--color-text-faint);">params</span>
						{#each Object.entries(parsed.params) as [k, v]}
							<div style="display: flex; gap: 0.5rem; font-family: var(--font-mono); font-size: 0.8rem; margin-top: 0.25rem;">
								<span style="color: var(--color-accent);">{k}</span>
								<span style="color: var(--color-text-faint);">=</span>
								<span>{v}</span>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</ToolLayout>
