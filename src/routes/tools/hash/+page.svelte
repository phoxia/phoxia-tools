<script lang="ts">
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import TextAreaField from "$lib/components/TextAreaField.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { copyToClipboard } from "$lib/clipboard.svelte";
  import { trackToolUsed } from "$lib/analytics/analytics";
  import { hashText } from "./logic";
  import type { HashAlgo } from "./logic";

  const algos: HashAlgo[] = ["SHA-256", "SHA-512", "SHA-1"];

  let input = $state("");
  let results = $state<Record<HashAlgo, string>>({ "SHA-256": "", "SHA-512": "", "SHA-1": "" });
  let loading = $state(false);
  let hasResult = $state(false);
  let error = $state("");

  async function run() {
    if (!input) return;
    loading = true;
    error = "";
    try {
      const out = await Promise.all(algos.map((a) => hashText(input, a)));
      const failed = out.find((r) => !r.ok);
      if (failed) {
        error = failed.error;
        hasResult = false;
      } else {
        hasResult = true;
        algos.forEach((a, i) => (results[a] = (out[i] as { value: string }).value));
        trackToolUsed("hash");
      }
    } finally {
      loading = false;
    }
  }

  function clear() {
    input = "";
    results = { "SHA-256": "", "SHA-512": "", "SHA-1": "" };
    hasResult = false;
    error = "";
  }

  let copiedAlgo = $state("");
  async function copy(value: string, algo: string) {
    const ok = await copyToClipboard(value, t().common.copied);
    copiedAlgo = ok ? algo : "";
    if (ok) setTimeout(() => (copiedAlgo = ""), 1500);
  }
</script>

<ToolLayout toolId="hash" title={t().tools.hash.name} description={t().tools.hash.desc}>
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <TextAreaField
      id="hash-input"
      bind:value={input}
      label={t().common.inputPlaceholder}
      placeholder={t().tools.hash.placeholder}
      maxlength={500_000}
      minHeight="120px"
    />

    <div style="display: flex; gap: 0.5rem;">
      <button
        onclick={run}
        disabled={!input.trim() || loading}
        style="
					background: var(--color-accent); color: #050508;
					border: none; border-radius: var(--radius); padding: 0.5rem 1rem;
					font-weight: 600; cursor: pointer; font-size: 0.875rem;
				"
      >
        {loading ? "..." : t().common.generate}
      </button>
      <button
        onclick={clear}
        style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
      >
        {t().common.clear}
      </button>
    </div>

    {#if error}
      <p role="alert" style="color: var(--color-error); font-size: 0.875rem; margin: 0;">{error}</p>
    {/if}

    {#if hasResult}
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        {#each algos as algo (algo)}
          <div
            style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); overflow: hidden;"
          >
            <div
              style="display: flex; justify-content: space-between; align-items: center; padding: 0.375rem 0.75rem; border-bottom: 1px solid var(--color-border);"
            >
              <span
                style="font-size: 0.7rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-text-faint);"
                >{algo}</span
              >
              <button
                onclick={() => copy(results[algo], algo)}
                style="background: none; border: none; color: var(--color-text-muted); cursor: pointer; font-size: 0.75rem; padding: 0;"
              >
                {copiedAlgo === algo ? t().common.copied : t().common.copy}
              </button>
            </div>
            <code
              style="display: block; padding: 0.625rem 0.75rem; font-family: var(--font-mono); font-size: 0.78rem; word-break: break-all; color: var(--color-text); line-height: 1.5;"
            >
              {results[algo]}
            </code>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</ToolLayout>
