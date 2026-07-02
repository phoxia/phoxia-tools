<script lang="ts">
  import { onMount } from "svelte";
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { copyToClipboard } from "$lib/clipboard.svelte";
  import { trackToolUsed } from "$lib/analytics/analytics";
  import { COPY_DETECT_PREFILL_KEY } from "$lib/copyDetect";
  import { parseCurl } from "./logic";

  const EXAMPLE = `curl -X POST https://api.example.com/users \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer eyJhbGci...' \\
  -d '{"name":"John","email":"john@example.com"}'`;

  let input = $state(EXAMPLE);
  let tab = $state<"fetch" | "axios">("fetch");
  let copied = $state(false);

  onMount(() => {
    const prefill = sessionStorage.getItem(COPY_DETECT_PREFILL_KEY);
    if (prefill) {
      input = prefill;
      sessionStorage.removeItem(COPY_DETECT_PREFILL_KEY);
    }
  });

  const result = $derived.by(() => {
    if (!input.trim()) return null;
    const r = parseCurl(input.trim());
    return r;
  });

  async function copy() {
    const code = tab === "fetch" ? result?.fetch : result?.axios;
    if (!code) return;
    copied = await copyToClipboard(code, t().common.copied);
    if (copied) setTimeout(() => (copied = false), 1500);
  }

  function clear() {
    input = "";
  }
</script>

<ToolLayout toolId="curl" title={t().tools.curl.name} description={t().tools.curl.desc}>
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <div>
      <label
        for="curl-input"
        style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);"
      >
        {t().tools.curl.labelCommand}
      </label>
      <textarea
        id="curl-input"
        bind:value={input}
        spellcheck={false}
        placeholder={t().tools.curl.placeholder}
        style="
					width: 100%; min-height: 130px; resize: vertical; box-sizing: border-box;
					font-family: var(--font-mono); font-size: 0.8rem;
					background: var(--color-surface); border: 1px solid var(--color-border);
					border-radius: var(--radius); color: var(--color-text); padding: 0.75rem;
				"></textarea>
    </div>

    <div style="display: flex; gap: 0.5rem;">
      <button
        onclick={clear}
        style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.4rem 0.875rem; cursor: pointer; font-size: 0.8rem;"
      >
        {t().common.clear}
      </button>
      <button
        onclick={() => {
          input = EXAMPLE;
          trackToolUsed("curl");
        }}
        style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.4rem 0.875rem; cursor: pointer; font-size: 0.8rem;"
      >
        {t().common.example}
      </button>
    </div>

    {#if result}
      {#if result!.error}
        <p role="alert" style="color: var(--color-error); font-size: 0.875rem; margin: 0;">
          {result!.error}
        </p>
      {:else}
        <!-- Method + URL badge -->
        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem;">
          <span
            style="
						font-family: var(--font-mono); font-weight: 700; padding: 0.15rem 0.5rem;
						border-radius: 4px; background: color-mix(in srgb, var(--color-accent) 15%, transparent); color: var(--color-accent);
					">{result!.method}</span
          >
          <span
            style="font-family: var(--font-mono); color: var(--color-text-muted); word-break: break-all;"
            >{result!.url}</span
          >
        </div>

        <!-- Tabs -->
        <div
          style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); overflow: hidden;"
        >
          <div style="display: flex; border-bottom: 1px solid var(--color-border);">
            {#each [t().tools.curl.fetch, t().tools.curl.axios] as label, i (i)}
              {@const t_ = i === 0 ? ("fetch" as const) : ("axios" as const)}
              <button
                onclick={() => {
                  tab = t_;
                  copied = false;
                }}
                style="
									flex: 1; padding: 0.5rem; font-size: 0.8rem; font-weight: 600; cursor: pointer; border: none;
									background: {tab === t_ ? 'var(--color-bg)' : 'transparent'};
									color: {tab === t_ ? 'var(--color-text)' : 'var(--color-text-muted)'};
									border-right: {t_ === 'fetch' ? '1px solid var(--color-border)' : 'none'};
								">{label}</button
              >
            {/each}
            <button
              onclick={copy}
              style="padding: 0.5rem 1rem; font-size: 0.75rem; cursor: pointer; border: none; border-left: 1px solid var(--color-border); background: transparent; color: var(--color-text-muted);"
            >
              {copied ? t().common.copied : t().common.copy}
            </button>
          </div>
          <pre
            style="margin: 0; padding: 1rem; font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.6; overflow-x: auto; color: var(--color-text);">{tab ===
            "fetch"
              ? result!.fetch
              : result!.axios}</pre>
        </div>
      {/if}
    {/if}
  </div>
</ToolLayout>
