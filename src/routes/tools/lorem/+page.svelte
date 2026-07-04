<script lang="ts">
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { copyToClipboard } from "$lib/clipboard.svelte";
  import { trackToolUsed } from "$lib/analytics/analytics";
  import { chipStyle } from "$lib/chipStyle";
  import { generateLorem } from "./logic";
  import type { LoremType } from "./logic";

  let type = $state<LoremType>("paragraphs");
  let count = $state(3);
  let output = $state("");

  function run() {
    output = generateLorem(type, count);
    trackToolUsed("lorem");
  }

  let copied = $state(false);
  async function copy() {
    copied = await copyToClipboard(output, t().common.copied);
    if (copied) setTimeout(() => (copied = false), 1500);
  }

  const types: { id: LoremType; label: string }[] = $derived([
    { id: "paragraphs", label: t().tools.lorem.paragraphs },
    { id: "sentences", label: t().tools.lorem.sentences },
    { id: "words", label: t().tools.lorem.words },
  ]);

  const inputStyle =
    "width: 100%; padding: 0.5rem 0.75rem; box-sizing: border-box; font-family: var(--font-mono); font-size: 0.875rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text);";

  const textareaStyle =
    "width: 100%; min-height: 180px; resize: vertical; font-family: var(--font-mono); font-size: 0.85rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text); padding: 0.75rem; box-sizing: border-box;";
</script>

<ToolLayout toolId="lorem" title={t().tools.lorem.name} description={t().tools.lorem.desc}>
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: flex-end;">
      <div>
        <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 0.375rem;">
          {t().tools.lorem.type}
        </div>
        <div style="display: flex; gap: 0.375rem;">
          {#each types as t (t.id)}
            <button onclick={() => (type = t.id)} style={chipStyle(type === t.id)}>{t.label}</button
            >
          {/each}
        </div>
      </div>
      <label
        style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.75rem; color: var(--color-text-muted);"
      >
        {t().common.count}
        <input
          type="number"
          bind:value={count}
          min="1"
          max="50"
          style="width: 70px; {inputStyle}"
        />
      </label>
    </div>

    <div style="display: flex; gap: 0.5rem;">
      <button
        onclick={run}
        style="background: var(--color-accent); color: #050508; border: none; border-radius: var(--radius); padding: 0.5rem 1rem; font-weight: 600; cursor: pointer; font-size: 0.875rem;"
        >{t().common.generate}</button
      >
    </div>

    {#if output}
      <div>
        <div
          style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.375rem;"
        >
          <span style="font-size: 0.85rem; color: var(--color-text-muted);"
            >{t().common.outputPlaceholder}</span
          >
          <button
            onclick={copy}
            style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.25rem 0.625rem; cursor: pointer; font-size: 0.75rem;"
            >{copied ? t().common.copied : t().common.copy}</button
          >
        </div>
        <textarea readonly value={output} spellcheck={false} style={textareaStyle}></textarea>
      </div>
    {/if}
  </div>
</ToolLayout>
