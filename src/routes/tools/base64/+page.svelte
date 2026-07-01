<script lang="ts">
	import ToolLayout from '$lib/components/ToolLayout.svelte';
	import { t } from '$lib/i18n/i18n.svelte';
import { copyToClipboard } from '$lib/clipboard.svelte';
	import { trackToolUsed } from '$lib/analytics/analytics';
	import { encodeBase64, decodeBase64 } from './logic';

	let input = $state('');
	let output = $state('');
	let error = $state('');
	let hasResult = $state(false);
	let copied = $state(false);

	function run(mode: 'encode' | 'decode') {
		const result = mode === 'encode' ? encodeBase64(input) : decodeBase64(input);
		if (!result.ok) {
			error = result.error;
			output = '';
			hasResult = false;
		} else {
			error = '';
			output = result.value;
			hasResult = true;
			trackToolUsed('base64');
		}
	}

	function clear() {
		input = '';
		output = '';
		error = '';
		hasResult = false;
	}

	async function copy() {
		copied = await copyToClipboard(output, t().common.copied);
		if (copied) setTimeout(() => (copied = false), 1500);
	}
</script>

<ToolLayout toolId="base64" title={t().tools.base64.name} description={t().tools.base64.desc}>
	<div style="display: flex; flex-direction: column; gap: 1rem;">
		<div>
			<label for="b64-input" style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);">
				{t().common.inputPlaceholder}
			</label>
			<textarea
				id="b64-input"
				bind:value={input}
				placeholder={t().tools.base64.placeholder}
				spellcheck={false}
				style="
					width: 100%; min-height: 140px; resize: vertical;
					font-family: var(--font-mono); font-size: 0.85rem;
					background: var(--color-surface); border: 1px solid var(--color-border);
					border-radius: var(--radius); color: var(--color-text);
					padding: 0.75rem; box-sizing: border-box;
				"
			></textarea>
		</div>

		<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
			<button
				onclick={() => run('encode')}
				disabled={!input.trim()}
				style="
					background: var(--color-accent); color: #050508;
					border: none; border-radius: var(--radius); padding: 0.5rem 1rem;
					font-weight: 600; cursor: pointer; font-size: 0.875rem;
				"
			>
				{t().common.encode}
			</button>
			<button
				onclick={() => run('decode')}
				disabled={!input.trim()}
				style="
					background: var(--color-surface); color: var(--color-text);
					border: 1px solid var(--color-border); border-radius: var(--radius);
					padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;
				"
			>
				{t().common.decode}
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

		{#if error}
			<p role="alert" style="color: var(--color-error); font-size: 0.875rem; margin: 0; font-family: var(--font-mono);">{error}</p>
		{/if}

		{#if hasResult}
			<div>
				<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.375rem;">
					<label for="b64-output" style="font-size: 0.85rem; color: var(--color-text-muted);">{t().common.outputPlaceholder}</label>
					<button
						onclick={copy}
						style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.25rem 0.625rem; cursor: pointer; font-size: 0.75rem;"
					>
						{copied ? t().common.copied : t().common.copy}
					</button>
				</div>
				<textarea
					id="b64-output"
					readonly
					value={output}
					spellcheck={false}
					style="
						width: 100%; min-height: 140px; resize: vertical;
						font-family: var(--font-mono); font-size: 0.85rem;
						background: var(--color-surface); border: 1px solid var(--color-border);
						border-radius: var(--radius); color: var(--color-text);
						padding: 0.75rem; box-sizing: border-box;
					"
				></textarea>
			</div>
		{/if}
	</div>
</ToolLayout>
