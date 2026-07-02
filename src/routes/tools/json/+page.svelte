<script lang="ts">
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { copyToClipboard } from "$lib/clipboard.svelte";
  import { trackToolUsed } from "$lib/analytics/analytics";
  import { formatJson, minifyJson } from "./logic";

  const MAX_INPUT = 500_000;

  let input = $state("");
  let output = $state("");
  let hasResult = $state(false);
  let error = $state("");
  let touched = $state(false);

  function run(mode: "format" | "minify") {
    const result = mode === "format" ? formatJson(input) : minifyJson(input);
    if (!result.ok) {
      error = result.error;
      output = "";
      hasResult = false;
    } else {
      error = "";
      output = result.value;
      hasResult = true;
      trackToolUsed("json");
    }
  }

  function clear() {
    input = "";
    output = "";
    error = "";
    hasResult = false;
    touched = false;
  }

  let copied = $state(false);
  async function copy() {
    copied = await copyToClipboard(output, t().common.copied);
    if (copied) setTimeout(() => (copied = false), 1500);
  }
</script>

<ToolLayout toolId="json" title={t().tools.json.name} description={t().tools.json.desc}>
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <div>
      <label
        for="json-input"
        style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);"
      >
        {t().common.inputPlaceholder}
      </label>
      <textarea
        id="json-input"
        bind:value={input}
        onblur={() => (touched = true)}
        placeholder={t().tools.json.placeholder}
        spellcheck={false}
        style="
					width: 100%; min-height: 180px; resize: vertical;
					font-family: var(--font-mono); font-size: 0.85rem;
					background: var(--color-surface); border: 1px solid var(--color-border);
					border-radius: var(--radius); color: var(--color-text);
					padding: 0.75rem; box-sizing: border-box;
				"></textarea>
      {#if touched && input.length > MAX_INPUT}
        <p role="alert" style="color: var(--color-error); font-size: 0.8rem; margin: 0.25rem 0 0;">
          {t().common.inputTooLarge}
        </p>
      {/if}
    </div>

    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <button
        onclick={() => run("format")}
        disabled={!input.trim() || input.length > MAX_INPUT}
        style="
					background: var(--color-accent); color: #050508;
					border: none; border-radius: var(--radius); padding: 0.5rem 1rem;
					font-weight: 600; cursor: pointer; font-size: 0.875rem;
				"
      >
        {t().common.format}
      </button>
      <button
        onclick={() => run("minify")}
        disabled={!input.trim() || input.length > MAX_INPUT}
        style="
					background: var(--color-surface); color: var(--color-text);
					border: 1px solid var(--color-border); border-radius: var(--radius);
					padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;
				"
      >
        {t().common.minify}
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
      <p
        role="alert"
        style="color: var(--color-error); font-size: 0.875rem; margin: 0; font-family: var(--font-mono);"
      >
        {error}
      </p>
    {/if}

    {#if hasResult}
      <div>
        <div
          style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.375rem;"
        >
          <label for="json-output" style="font-size: 0.85rem; color: var(--color-text-muted);">
            {t().common.outputPlaceholder}
          </label>
          <button
            onclick={copy}
            style="
							background: none; border: 1px solid var(--color-border);
							border-radius: var(--radius); color: var(--color-text-muted);
							padding: 0.25rem 0.625rem; cursor: pointer; font-size: 0.75rem;
						"
          >
            {copied ? t().common.copied : t().common.copy}
          </button>
        </div>
        <textarea
          id="json-output"
          readonly
          value={output}
          spellcheck={false}
          style="
						width: 100%; min-height: 180px; resize: vertical;
						font-family: var(--font-mono); font-size: 0.85rem;
						background: var(--color-surface); border: 1px solid var(--color-border);
						border-radius: var(--radius); color: var(--color-text);
						padding: 0.75rem; box-sizing: border-box;
					"></textarea>
      </div>
    {/if}
  </div>
</ToolLayout>
