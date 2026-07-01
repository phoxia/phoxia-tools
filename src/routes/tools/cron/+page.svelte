<script lang="ts">
	import ToolLayout from '$lib/components/ToolLayout.svelte';
	import { t } from '$lib/i18n/i18n.svelte';
import { copyToClipboard } from '$lib/clipboard.svelte';
	import { trackToolUsed } from '$lib/analytics/analytics';
	import { parseCron, type CronLocale } from './logic';

	const EXAMPLES = $derived([
		{ label: t().tools.cron.examples.everyMinute, expr: '* * * * *' },
		{ label: t().tools.cron.examples.every15Min, expr: '*/15 * * * *' },
		{ label: t().tools.cron.examples.dailyAt9, expr: '0 9 * * *' },
		{ label: t().tools.cron.examples.weekdaysAt9, expr: '0 9 * * 1-5' },
		{ label: t().tools.cron.examples.everySunday, expr: '0 0 * * 0' },
		{ label: t().tools.cron.examples.firstOfMonth, expr: '0 0 1 * *' },
	]);

	let input = $state('0 9 * * 1-5');
	let copied = $state(false);

	const result = $derived.by(() => {
		if (!input.trim()) return null;
		const locale: CronLocale = {
			dayNames: t().tools.cron.dayNames,
			monthNames: t().tools.cron.monthNames,
			descriptions: t().tools.cron.descriptions,
			errorInvalid: t().tools.cron.errorInvalid,
		};
		const r = parseCron(input.trim(), locale);
		return r;
	});

	async function copy() {
		copied = await copyToClipboard(input, t().common.copied);
		if (copied) setTimeout(() => (copied = false), 1200);
	}

	const FIELD_LABELS = $derived([
		t().tools.cron.labels.min, t().tools.cron.labels.hour,
		t().tools.cron.labels.dom, t().tools.cron.labels.month, t().tools.cron.labels.dow,
	]);

	const FMT = new Intl.DateTimeFormat(undefined, {
		weekday: 'short', month: 'short', day: 'numeric',
		hour: '2-digit', minute: '2-digit', second: '2-digit'
	});
</script>

<ToolLayout toolId="cron" title={t().tools.cron.name} description={t().tools.cron.desc}>
	<div style="display: flex; flex-direction: column; gap: 1.25rem;">
		<!-- Input -->
		<div>
			<label for="cron-input" style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);">
				{t().tools.cron.labelExpression}
			</label>
			<div style="display: flex; gap: 0.5rem;">
				<input
					id="cron-input"
					type="text"
					bind:value={input}
					spellcheck={false}
					placeholder={t().tools.cron.placeholder}
					style="
						flex: 1; padding: 0.625rem 0.875rem;
						font-family: var(--font-mono); font-size: 0.95rem; letter-spacing: 0.05em;
						background: var(--color-surface); border: 1px solid {result && !result!.valid ? 'var(--color-error)' : 'var(--color-border)'};
						border-radius: var(--radius); color: var(--color-text);
					"
				/>
				<button onclick={copy}
					style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.5rem 0.875rem; cursor: pointer; font-size: 0.8rem;">
					{copied ? t().common.copied : t().common.copy}
				</button>
			</div>
		</div>

		<!-- Examples -->
		<div style="display: flex; flex-wrap: wrap; gap: 0.375rem;">
			{#each EXAMPLES as ex}
				<button onclick={() => { input = ex.expr; trackToolUsed('cron'); }}
					style="
						padding: 0.25rem 0.625rem; border-radius: 99px; font-size: 0.78rem; cursor: pointer;
						border: 1px solid {input === ex.expr ? 'var(--color-accent)' : 'var(--color-border)'};
						background: {input === ex.expr ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)' : 'transparent'};
						color: {input === ex.expr ? 'var(--color-accent)' : 'var(--color-text-muted)'};
					"
				>
					{ex.label}
				</button>
			{/each}
		</div>

		<!-- Result -->
		{#if result}
			{#if result!.valid}
				<div style="display: flex; flex-direction: column; gap: 0.875rem;">
					<!-- Field labels -->
					<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); overflow: hidden;">
						<div style="display: flex; border-bottom: 1px solid var(--color-border);">
							{#each ['min','hour','dom','month','dow'] as lbl, i}
								{@const part = input.trim().split(/\s+/)[i] ?? '*'}
								<div style="flex: 1; padding: 0.5rem; text-align: center; {i < 4 ? 'border-right: 1px solid var(--color-border);' : ''}">
									<div style="font-size: 0.65rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-text-faint); margin-bottom: 0.25rem;">{FIELD_LABELS[i]}</div>
									<div style="font-family: var(--font-mono); font-size: 0.9rem; font-weight: 600; color: var(--color-accent);">{part}</div>
								</div>
							{/each}
						</div>
						<div style="padding: 0.75rem 1rem; font-size: 0.875rem; color: var(--color-text);">
							<strong>{t().tools.cron.runs}</strong> {result!.summary}
						</div>
					</div>

					<!-- Next runs -->
					{#if result!.nextRuns.length > 0}
						<div>
							<div style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 0.375rem;">{t().tools.cron.nextExecutions}</div>
							<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); overflow: hidden;">
								{#each result!.nextRuns as d, i}
									<div style="padding: 0.5rem 0.875rem; font-family: var(--font-mono); font-size: 0.82rem; color: var(--color-text); {i < result!.nextRuns.length - 1 ? 'border-bottom: 1px solid var(--color-border);' : ''}">
										{FMT.format(d)}
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{:else}
				<p role="alert" style="color: var(--color-error); font-size: 0.875rem; margin: 0; font-family: var(--font-mono);">{result!.error}</p>
			{/if}
		{/if}
	</div>
</ToolLayout>
