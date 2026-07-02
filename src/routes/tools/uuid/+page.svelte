<script lang="ts">
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { copyToClipboard } from "$lib/clipboard.svelte";
  import { trackToolUsed } from "$lib/analytics/analytics";
  import { generateUuidV4 } from "./logic";

  let count = $state(1);
  let uuids = $state<string[]>([]);
  let copied = $state(false);
  let loading = $state(false);

  function generate() {
    const n = Math.max(1, Math.min(100, Math.floor(count) || 1));
    count = n;
    loading = true;
    try {
      uuids = Array.from({ length: count }, () => generateUuidV4());
      trackToolUsed("uuid");
    } finally {
      loading = false;
    }
  }

  async function copy() {
    copied = await copyToClipboard(uuids.join("\n"), t().common.copied);
    if (copied) setTimeout(() => (copied = false), 1500);
  }
</script>

<ToolLayout toolId="uuid" title={t().tools.uuid.name} description={t().tools.uuid.desc}>
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
      <label
        style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--color-text-muted);"
      >
        {t().tools.uuid.labelCount}
        <input
          type="number"
          min="1"
          max="100"
          bind:value={count}
          style="
						width: 70px; font-size: 0.875rem;
						background: var(--color-surface); border: 1px solid var(--color-border);
						border-radius: var(--radius); color: var(--color-text);
						padding: 0.375rem 0.5rem;
					"
        />
      </label>
      <button
        onclick={generate}
        disabled={loading}
        style="
					background: var(--color-accent); color: #050508;
					border: none; border-radius: var(--radius); padding: 0.5rem 1rem;
					font-weight: 600; cursor: pointer; font-size: 0.875rem;
				"
      >
        {loading ? "..." : t().common.generate}
      </button>
    </div>

    {#if uuids.length > 0}
      <div>
        <div
          style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.375rem;"
        >
          <span style="font-size: 0.85rem; color: var(--color-text-muted);"
            >{t().tools.uuid.generatedCount.replace("{n}", String(uuids.length))}</span
          >
          <button
            onclick={copy}
            style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.25rem 0.625rem; cursor: pointer; font-size: 0.75rem;"
          >
            {copied ? t().common.copied : t().common.copy}
          </button>
        </div>
        <div
          style="
						font-family: var(--font-mono); font-size: 0.85rem;
						background: var(--color-surface); border: 1px solid var(--color-border);
						border-radius: var(--radius); padding: 0.75rem;
						display: flex; flex-direction: column; gap: 0.25rem;
					"
        >
          {#each uuids as uuid}
            <span>{uuid}</span>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</ToolLayout>
