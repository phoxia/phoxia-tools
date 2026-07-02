<script lang="ts">
	import { t } from '$lib/i18n/i18n.svelte';
	import { getToolsByCategory } from '$lib/tools/registry';
	import Seo from '$lib/components/Seo.svelte';
	import type { Category } from '$lib/tools/registry';
	import type { LocaleShape } from '$lib/i18n/types';

	const categories: Category[] = ['dev', 'text', 'br', 'reference'];

	const grouped = $derived(getToolsByCategory());
</script>

<Seo title={t().seo.homeTitle} description={t().seo.homeDescription} path="/" />

<main id="main-content" class="home-main">
	<header class="home-header">
		<h1 class="home-title">{t().home.title}</h1>
		<p class="home-subtitle">{t().home.subtitle}</p>
	</header>

	{#each categories as category}
		{#if grouped[category].length > 0}
			<section class="home-section">
				<h2 class="section-label">{t().home.categories[category]}</h2>
				<div class="tool-grid">
					{#each grouped[category] as tool}
						{@const toolLocale = t().tools[tool.id as keyof LocaleShape['tools']]}
						{@const ToolIcon = tool.icon}
						<a href={tool.route} class="tool-card">
							<div class="tool-card-icon"><ToolIcon size={18} strokeWidth={1.75} /></div>
							<div>
								<div class="tool-card-name">{toolLocale?.name ?? tool.id}</div>
								<div class="tool-card-desc">{toolLocale?.desc ?? ''}</div>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	{/each}
</main>

<style>
	.home-main {
		padding: 2.5rem 2rem;
	}

	.home-header {
		margin-bottom: 2.5rem;
	}

	.home-title {
		font-family: var(--font-heading);
		font-size: 2rem;
		margin: 0 0 0.5rem;
		line-height: 1.2;
	}

	.home-subtitle {
		color: var(--color-text-muted);
		margin: 0;
		font-size: 1.05rem;
	}

	.home-section {
		margin-bottom: 2.5rem;
	}

	.section-label {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text-faint);
		margin: 0 0 0.875rem;
	}

	.tool-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 0.75rem;
	}

	.tool-card {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		color: var(--color-text);
		min-height: unset;
		transition: border-color 0.12s, background 0.12s;
	}

	.tool-card:hover {
		border-color: var(--color-accent);
		background: color-mix(in srgb, var(--color-accent) 4%, var(--color-surface));
	}

	.tool-card-icon {
		color: var(--color-accent);
		margin-top: 2px;
		flex-shrink: 0;
	}

	.tool-card-name {
		font-weight: 500;
		font-size: 0.875rem;
		margin-bottom: 0.15rem;
	}

	.tool-card-desc {
		color: var(--color-text-muted);
		font-size: 0.78rem;
		line-height: 1.4;
	}
</style>
