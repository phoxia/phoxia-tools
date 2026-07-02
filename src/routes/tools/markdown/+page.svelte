<script lang="ts">
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { copyToClipboard } from "$lib/clipboard.svelte";
  import { trackToolUsed } from "$lib/analytics/analytics";
  import { renderMd } from "./logic";

  let source = $state(t().tools.markdown.example);
  let view = $state<"split" | "preview">("split");
  let copied = $state(false);
  let hasTrackedMd = false;

  const views = $derived({ split: t().tools.markdown.split, preview: t().tools.markdown.preview });

  const html = $derived(
    renderMd(source, () => {
      if (!hasTrackedMd && source) {
        trackToolUsed("markdown");
        hasTrackedMd = true;
      }
    })
  );

  async function copy() {
    copied = await copyToClipboard(html, t().common.copied);
    if (copied) setTimeout(() => (copied = false), 1500);
  }
</script>

<ToolLayout toolId="markdown" title={t().tools.markdown.name} description={t().tools.markdown.desc}>
  <div style="display: flex; flex-direction: column; gap: 0.875rem;">
    <!-- Toolbar -->
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; gap: 0.375rem;">
        {#each ["split", "preview"] as const as v}
          <button
            onclick={() => (view = v)}
            style="
							padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.78rem; cursor: pointer; text-transform: capitalize;
							border: 1px solid {view === v ? 'var(--color-accent)' : 'var(--color-border)'};
							background: {view === v
              ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)'
              : 'transparent'};
							color: {view === v ? 'var(--color-accent)' : 'var(--color-text-muted)'};
						">{views[v]}</button
          >
        {/each}
      </div>
      <button
        onclick={copy}
        style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.3rem 0.75rem; cursor: pointer; font-size: 0.78rem;"
      >
        {copied ? t().common.copied : t().tools.markdown.copyHtml}
      </button>
    </div>

    <div
      style="display: {view === 'split'
        ? 'grid'
        : 'block'}; grid-template-columns: 1fr 1fr; gap: 1rem; align-items: start;"
    >
      {#if view === "split"}
        <textarea
          bind:value={source}
          spellcheck={false}
          style="
						width: 100%; min-height: 400px; resize: vertical; box-sizing: border-box;
						font-family: var(--font-mono); font-size: 0.82rem; line-height: 1.6;
						background: var(--color-surface); border: 1px solid var(--color-border);
						border-radius: var(--radius); color: var(--color-text); padding: 0.875rem;
					"></textarea>
      {/if}

      <div
        class="md-preview"
        style="
				min-height: {view === 'split' ? '400px' : '0'};
				background: var(--color-surface); border: 1px solid var(--color-border);
				border-radius: var(--radius); padding: 1.25rem 1.5rem; overflow: auto;
			"
      >
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html html}
      </div>
    </div>
  </div>
</ToolLayout>

<style>
  .md-preview :global(h1) {
    font-size: 1.6rem;
    margin: 0 0 0.875rem;
    color: var(--color-text);
  }
  .md-preview :global(h2) {
    font-size: 1.3rem;
    margin: 1.5rem 0 0.625rem;
    color: var(--color-text);
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 0.25rem;
  }
  .md-preview :global(h3) {
    font-size: 1.1rem;
    margin: 1.25rem 0 0.5rem;
    color: var(--color-text);
  }
  .md-preview :global(h4),
  .md-preview :global(h5),
  .md-preview :global(h6) {
    margin: 1rem 0 0.375rem;
    color: var(--color-text);
  }
  .md-preview :global(p) {
    margin: 0 0 0.875rem;
    line-height: 1.7;
    color: var(--color-text);
  }
  .md-preview :global(a) {
    color: var(--color-accent);
    text-decoration: underline;
  }
  .md-preview :global(strong) {
    font-weight: 700;
  }
  .md-preview :global(em) {
    font-style: italic;
  }
  .md-preview :global(code) {
    font-family: var(--font-mono);
    font-size: 0.85em;
    background: color-mix(in srgb, var(--color-accent) 10%, transparent);
    padding: 0.1em 0.35em;
    border-radius: 3px;
  }
  .md-preview :global(pre) {
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 1rem;
    overflow-x: auto;
    margin: 0 0 1rem;
  }
  .md-preview :global(pre code) {
    background: none;
    padding: 0;
    font-size: 0.8rem;
    line-height: 1.6;
  }
  .md-preview :global(blockquote) {
    border-left: 3px solid var(--color-accent);
    margin: 0 0 1rem;
    padding: 0.5rem 1rem;
    color: var(--color-text-muted);
    font-style: italic;
  }
  .md-preview :global(ul),
  .md-preview :global(ol) {
    margin: 0 0 1rem;
    padding-left: 1.5rem;
    color: var(--color-text);
  }
  .md-preview :global(li) {
    margin-bottom: 0.25rem;
    line-height: 1.6;
  }
  .md-preview :global(hr) {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: 1.5rem 0;
  }
</style>
