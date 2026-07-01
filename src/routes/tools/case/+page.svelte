<script lang="ts">
	import ToolLayout from '$lib/components/ToolLayout.svelte';
	import { t } from '$lib/i18n/i18n.svelte';
import { copyToClipboard } from '$lib/clipboard.svelte';
	import { trackToolUsed } from '$lib/analytics/analytics';
	import { toCase } from './logic';
	import type { CaseMode } from './logic';

	const modes = $derived.by(() => {
		const labels = t().tools.case.labels;
		const examples = t().tools.case.examples;
		return [
			{ id: 'camel' as CaseMode,     label: labels.camel,         example: examples.camel },
			{ id: 'pascal' as CaseMode,    label: labels.pascal,        example: examples.pascal },
			{ id: 'snake' as CaseMode,     label: labels.snake,         example: examples.snake },
			{ id: 'screaming' as CaseMode, label: labels.screamingSnake, example: examples.screamingSnake },
			{ id: 'kebab' as CaseMode,     label: labels.kebab,         example: examples.kebab },
			{ id: 'upper' as CaseMode,     label: labels.upper,         example: examples.upper },
			{ id: 'lower' as CaseMode,     label: labels.lower,         example: examples.lower },
		];
	});

	let input = $state('');
	let results = $derived(
		input.trim()
			? modes.map((m) => ({ ...m, output: toCase(input, m.id) }))
			: []
	);

	let copiedId = $state('');
	async function copy(value: string, id: string) {
		if (input.trim()) trackToolUsed('case');
  	const ok = await copyToClipboard(value, t().common.copied);
		copiedId = ok ? id : '';
		if (ok) setTimeout(() => (copiedId = ''), 1500);
	}
</script>

<ToolLayout toolId="case" title={t().tools.case.name} description={t().tools.case.desc}>
	<div style="display: flex; flex-direction: column; gap: 1rem;">
		<div>
			<label for="case-input" style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);">
				{t().common.inputPlaceholder}
			</label>
			<input
				id="case-input"
				type="text"
				bind:value={input}
				placeholder={t().tools.case.placeholder}
				spellcheck={false}
				style="
					width: 100%; font-size: 0.875rem; font-family: var(--font-mono);
					background: var(--color-surface); border: 1px solid var(--color-border);
					border-radius: var(--radius); color: var(--color-text);
					padding: 0.5rem 0.75rem; box-sizing: border-box;
				"
			/>
		</div>

		{#if results.length > 0}
			<div style="display: flex; flex-direction: column; gap: 0.375rem;">
				{#each results as row}
					<div style="
						display: flex; align-items: center; gap: 0.75rem;
						background: var(--color-surface); border: 1px solid var(--color-border);
						border-radius: var(--radius); padding: 0.5rem 0.75rem;
					">
						<span style="font-size: 0.75rem; color: var(--color-text-faint); min-width: 130px; flex-shrink: 0;">{row.label}</span>
						<span style="font-family: var(--font-mono); font-size: 0.875rem; flex: 1; overflow-x: auto;">{row.output}</span>
						<button
							onclick={() => copy(row.output, row.id)}
							style="background: none; border: none; color: var(--color-text-muted); cursor: pointer; padding: 0; font-size: 0.75rem; flex-shrink: 0;"
						>
							{copiedId === row.id ? t().common.copied : t().common.copy}
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</ToolLayout>
