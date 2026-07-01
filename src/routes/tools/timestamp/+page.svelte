<script lang="ts">
	import ToolLayout from '$lib/components/ToolLayout.svelte';
	import { t } from '$lib/i18n/i18n.svelte';
import { copyToClipboard } from '$lib/clipboard.svelte';
	import { trackToolUsed } from '$lib/analytics/analytics';
	import { parseTimestamp, nowTimestamp } from './logic';

	let input = $state('');
	let result = $state<ReturnType<typeof parseTimestamp> | null>(null);

	function parse() {
		result = parseTimestamp(input || String(nowTimestamp()));
		if (!result.error) trackToolUsed('timestamp');
	}

	function useNow() {
		input = String(nowTimestamp());
		parse();
	}

	function clear() {
		input = '';
		result = null;
	}

	let copiedField = $state('');
	async function copy(value: string, field: string) {
		const ok = await copyToClipboard(value, t().common.copied);
		copiedField = ok ? field : '';
		if (ok) setTimeout(() => (copiedField = ''), 1500);
	}
</script>

<ToolLayout toolId="timestamp" title={t().tools.timestamp.name} description={t().tools.timestamp.desc}>
	<div style="display: flex; flex-direction: column; gap: 1rem;">
		<div>
			<label for="ts-input" style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);">
				{t().tools.timestamp.labelInput}
			</label>
			<div style="display: flex; gap: 0.5rem;">
				<input
					id="ts-input"
					type="text"
					bind:value={input}
					placeholder={t().tools.timestamp.placeholder}
					spellcheck={false}
					style="
						flex: 1; font-family: var(--font-mono); font-size: 0.875rem;
						background: var(--color-surface); border: 1px solid var(--color-border);
						border-radius: var(--radius); color: var(--color-text);
						padding: 0.5rem 0.75rem;
					"
				/>
			</div>
		</div>

		<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
			<button
				onclick={parse}
				disabled={!input.trim()}
				style="
					background: var(--color-accent); color: #050508;
					border: none; border-radius: var(--radius); padding: 0.5rem 1rem;
					font-weight: 600; cursor: pointer; font-size: 0.875rem;
				"
			>
				{t().tools.timestamp.parse}
			</button>
			<button
				onclick={useNow}
				style="
					background: var(--color-surface); color: var(--color-text);
					border: 1px solid var(--color-border); border-radius: var(--radius);
					padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;
				"
			>
				{t().tools.timestamp.now}
			</button>
			<button
				onclick={clear}
				style="
					background: none; border: 1px solid var(--color-border);
					border-radius: var(--radius); color: var(--color-text-muted);
					padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;
				"
			>
				{t().common.clear}
			</button>
		</div>

		{#if result}
			{#if result.error}
				<p role="alert" style="color: var(--color-error); font-size: 0.875rem; margin: 0;">{result.error}</p>
			{:else}
				<div style="display: flex; flex-direction: column; gap: 0.5rem;">
					{#each [
						{ label: t().tools.timestamp.labelUnix, value: String(result.unix) },
						{ label: t().tools.timestamp.labelUnixMs, value: String(result.unixMs) },
						{ label: t().tools.timestamp.labelIso, value: result.iso ?? '' },
						{ label: t().tools.timestamp.labelUtc, value: result.utc ?? '' }
					] as row}
						<div style="
							display: flex; align-items: center; gap: 0.75rem;
							background: var(--color-surface); border: 1px solid var(--color-border);
							border-radius: var(--radius); padding: 0.5rem 0.75rem;
						">
							<span style="font-size: 0.75rem; color: var(--color-text-faint); min-width: 80px; flex-shrink: 0;">{row.label}</span>
							<span style="font-family: var(--font-mono); font-size: 0.85rem; flex: 1; overflow-x: auto;">{row.value}</span>
							<button
								onclick={() => copy(row.value, row.label)}
								style="background: none; border: none; color: var(--color-text-muted); cursor: pointer; padding: 0; font-size: 0.75rem; flex-shrink: 0;"
							>
								{copiedField === row.label ? t().common.copied : t().common.copy}
							</button>
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</ToolLayout>
