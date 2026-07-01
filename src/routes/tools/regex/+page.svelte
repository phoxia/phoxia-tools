<script lang="ts">
	import ToolLayout from '$lib/components/ToolLayout.svelte';
	import { t } from '$lib/i18n/i18n.svelte';
	import { trackToolUsed } from '$lib/analytics/analytics';

	let pattern = $state('\\b\\w+@\\w+\\.\\w+\\b');
	let flags = $state(new Set(['g', 'i']));
	let testStr = $state('Contact us at hello@example.com or support@phoxia.org for help.');
	let error = $state('');
	let hasTrackedRegex = false;

	const ALL_FLAGS = ['g','i','m','s'];

	type Match = { value: string; index: number; groups: (string | undefined)[] };

	const result = $derived.by(() => {
		if (!pattern) return { matches: [], highlighted: [{ text: testStr, match: false }], error: '' };
		try {
			const re = new RegExp(pattern, [...flags].join(''));
			const matches: Match[] = [];
			let m: RegExpExecArray | null;
			const re2 = new RegExp(pattern, ([...flags].includes('g') ? [...flags] : [...flags, 'g']).join(''));
			while ((m = re2.exec(testStr)) !== null) {
				matches.push({ value: m[0], index: m.index, groups: m.slice(1) });
				if (!flags.has('g')) break;
			}
			const highlighted = buildHighlight(testStr, matches);
				if (!hasTrackedRegex && matches.length > 0) {
					trackToolUsed('regex');
					hasTrackedRegex = true;
				}
			return { matches, highlighted, error: '' };
		} catch (e) {
			return { matches: [], highlighted: [{ text: testStr, match: false }], error: (e as Error).message };
		}
	});

	function buildHighlight(str: string, matches: Match[]): { text: string; match: boolean }[] {
		if (!matches.length) return [{ text: str, match: false }];
		const parts: { text: string; match: boolean }[] = [];
		let pos = 0;
		for (const m of matches) {
			if (m.index > pos) parts.push({ text: str.slice(pos, m.index), match: false });
			parts.push({ text: m.value, match: true });
			pos = m.index + m.value.length;
		}
		if (pos < str.length) parts.push({ text: str.slice(pos), match: false });
		return parts;
	}

	function toggleFlag(f: string) {
		const next = new Set(flags);
		if (next.has(f)) next.delete(f); else next.add(f);
		flags = next;
	}

	const FLAG_DESC: Record<string, string> = $derived({
		g: t().tools.regex.flags.global,
		i: t().tools.regex.flags.caseInsensitive,
		m: t().tools.regex.flags.multiline,
		s: t().tools.regex.flags.dotAll,
	});
</script>

<ToolLayout toolId="regex" title={t().tools.regex.name} description={t().tools.regex.desc}>
	<div style="display: flex; flex-direction: column; gap: 1rem;">
		<!-- Pattern input -->
		<div>
			<label for="regex-pattern" style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);">
				{t().tools.regex.labelPattern}
			</label>
			<div style="display: flex; align-items: center; gap: 0; background: var(--color-surface); border: 1px solid {result.error ? 'var(--color-error)' : 'var(--color-border)'}; border-radius: var(--radius); overflow: hidden;">
				<span style="padding: 0 0.625rem; color: var(--color-text-faint); font-family: var(--font-mono); font-size: 1rem; user-select: none;">/</span>
				<input
					id="regex-pattern"
					type="text"
					bind:value={pattern}
					spellcheck={false}
					style="flex: 1; border: none; background: transparent; font-family: var(--font-mono); font-size: 0.875rem; color: var(--color-text); padding: 0.5rem 0; outline: none;"
				/>
				<span style="padding: 0 0.625rem; color: var(--color-text-faint); font-family: var(--font-mono); font-size: 1rem; user-select: none;">/{[...flags].join('')}</span>
			</div>
				{#if !pattern}
					<p style="color: var(--color-text-muted); font-size: 0.8rem; margin: 0.25rem 0 0;">{t().tools.regex.hintEmptyPattern}</p>
				{/if}
			{#if result.error}
				<p role="alert" style="color: var(--color-error); font-size: 0.8rem; margin: 0.25rem 0 0; font-family: var(--font-mono);">{result.error}</p>
			{/if}
		</div>

		<!-- Flags -->
		<div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
			<span style="font-size: 0.8rem; color: var(--color-text-muted);">{t().tools.regex.labelFlags}</span>
			{#each ALL_FLAGS as f}
				<button
					onclick={() => toggleFlag(f)}
					title={FLAG_DESC[f]}
					style="
						padding: 0.2rem 0.625rem; border-radius: 99px; font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer;
						border: 1px solid {flags.has(f) ? 'var(--color-accent)' : 'var(--color-border)'};
						background: {flags.has(f) ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)' : 'transparent'};
						color: {flags.has(f) ? 'var(--color-accent)' : 'var(--color-text-muted)'};
					"
				>{f}</button>
			{/each}
		</div>

		<!-- Test string -->
		<div>
			<label for="regex-test" style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);">
				{t().tools.regex.labelTestString}
			</label>
			<textarea
				id="regex-test"
				bind:value={testStr}
				spellcheck={false}
				style="
					width: 100%; min-height: 120px; resize: vertical; box-sizing: border-box;
					font-family: var(--font-mono); font-size: 0.85rem;
					background: var(--color-surface); border: 1px solid var(--color-border);
					border-radius: var(--radius); color: var(--color-text); padding: 0.75rem;
				"
			></textarea>
		</div>

		<!-- Highlighted result -->
		{#if testStr && !result.error}
			<div>
				<div style="display: flex; justify-content: space-between; margin-bottom: 0.375rem;">
					<span style="font-size: 0.85rem; color: var(--color-text-muted);">{t().tools.regex.labelMatches}</span>
					<span style="font-size: 0.8rem; font-weight: 600; color: {result.matches.length > 0 ? 'var(--color-success)' : 'var(--color-text-muted)'};">
						{t().tools.regex.matchCount.replace('{n}', String(result.matches.length))}
					</span>
				</div>
				<div style="
					background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius);
					padding: 0.875rem; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.7;
					white-space: pre-wrap; word-break: break-all; color: var(--color-text);
				">
					{#each result.highlighted as part}
						{#if part.match}
							<mark style="background: color-mix(in srgb, var(--color-accent) 30%, transparent); color: var(--color-text); border-radius: 2px; padding: 0 1px;">{part.text}</mark>
						{:else}
							{part.text}
						{/if}
					{/each}
				</div>
			</div>

			<!-- Groups -->
			{#if result.matches.some((m) => m.groups.length > 0)}
				<div style="display: flex; flex-direction: column; gap: 0.25rem;">
					<span style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 0.25rem;">{t().tools.regex.labelCaptureGroups}</span>
					{#each result.matches as m, i}
						{#if m.groups.length > 0}
							<div style="font-size: 0.78rem; font-family: var(--font-mono); color: var(--color-text-muted);">
								{t().tools.regex.matchLabel.replace('{n}', String(i + 1))}: {m.groups.map((g, j) => `$${j + 1}="${g ?? 'undefined'}"`).join('  ')}
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</ToolLayout>
