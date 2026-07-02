<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import TextAreaField from "$lib/components/TextAreaField.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { copyToClipboard } from "$lib/clipboard.svelte";
  import { trackToolUsed } from "$lib/analytics/analytics";
  import { COPY_DETECT_PREFILL_KEY } from "$lib/copyDetect";
  import {
    encodeBase64,
    decodeBase64,
    encodeUrl,
    decodeUrl,
    encodeBinary,
    decodeBinary,
    encodeMorse,
    decodeMorse,
    encodeHex,
    decodeHex,
  } from "./logic";
  import type { EncodeMode } from "./logic";

  const tabs: { id: EncodeMode; label: string }[] = $derived.by(() => [
    { id: "base64" as EncodeMode, label: "Base64" },
    { id: "url" as EncodeMode, label: "URL" },
    { id: "binary" as EncodeMode, label: t().tools.encode.tabs.binary },
    { id: "morse" as EncodeMode, label: t().tools.encode.tabs.morse },
    { id: "hex" as EncodeMode, label: t().tools.encode.tabs.hex },
  ]);

  let activeTab = $state<EncodeMode>("base64");
  let input = $state("");
  let output = $state("");
  let error = $state("");
  let hasResult = $state(false);

  onMount(() => {
    const tabParam = page.url.searchParams.get("tab") as EncodeMode | null;
    if (tabParam && ["base64", "url", "binary", "morse", "hex"].includes(tabParam)) {
      activeTab = tabParam;
    }
    const prefill = sessionStorage.getItem(COPY_DETECT_PREFILL_KEY);
    if (prefill) {
      input = prefill;
      sessionStorage.removeItem(COPY_DETECT_PREFILL_KEY);
    }
  });

  let parsedUrl = $state<Record<string, string> | null>(null);
  const urlParams = $derived(
    parsedUrl
      ? Object.entries(parsedUrl).filter(
          ([k]) => !["protocol", "hostname", "port", "pathname", "search", "hash"].includes(k)
        )
      : []
  );

  function run(mode: "encode" | "decode") {
    error = "";
    parsedUrl = null;
    hasResult = false;
    output = "";

    const encodeFns: Record<EncodeMode, (s: string) => string> = {
      base64: encodeBase64,
      url: encodeUrl,
      binary: encodeBinary,
      morse: encodeMorse,
      hex: encodeHex,
    };
    const decodeFns: Record<EncodeMode, (s: string) => ReturnType<typeof decodeBase64>> = {
      base64: decodeBase64,
      url: decodeUrl,
      binary: decodeBinary,
      morse: decodeMorse,
      hex: decodeHex,
    };

    if (mode === "encode") {
      output = encodeFns[activeTab](input);
      hasResult = true;
    } else {
      const r = decodeFns[activeTab](input);
      if (!r.ok) {
        error = r.error;
      } else {
        output = r.value;
        hasResult = true;
      }
    }
    trackToolUsed("encode");
  }

  function parseUrlParts() {
    error = "";
    parsedUrl = null;
    hasResult = false;
    output = "";
    try {
      const url = new URL(input);
      const params: Record<string, string> = {};
      url.searchParams.forEach((v, k) => (params[k] = v));
      parsedUrl = {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        ...params,
      };
      trackToolUsed("encode");
    } catch {
      error = t().tools.url.errorInvalid.replace("{input}", input);
    }
  }

  function clear() {
    input = "";
    output = "";
    error = "";
    hasResult = false;
    parsedUrl = null;
  }

  let copiedId = $state("");
  async function copy(value: string, id: string) {
    const ok = await copyToClipboard(value, t().common.copied);
    copiedId = ok ? id : "";
    if (ok) setTimeout(() => (copiedId = ""), 1500);
  }

  const tabStyle = (id: EncodeMode) =>
    `padding: 0.375rem 0.625rem; font-size: 0.75rem; border-radius: var(--radius); cursor: pointer; white-space: nowrap;
		border: 1px solid ${activeTab === id ? "var(--color-accent)" : "var(--color-border)"};
		background: ${activeTab === id ? "color-mix(in srgb, var(--color-accent) 10%, transparent)" : "transparent"};
		color: ${activeTab === id ? "var(--color-accent)" : "var(--color-text-muted)"};
		font-weight: ${activeTab === id ? 600 : 400};`;

  const textareaStyle =
    "width: 100%; min-height: 140px; resize: vertical; font-family: var(--font-mono); font-size: 0.85rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text); padding: 0.75rem; box-sizing: border-box;";
</script>

<ToolLayout toolId="encode" title={t().tools.encode.name} description={t().tools.encode.desc}>
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <!-- Tabs -->
    <div style="display: flex; gap: 0.375rem; flex-wrap: wrap;">
      {#each tabs as tab (tab.id)}
        <button
          onclick={() => {
            activeTab = tab.id;
            clear();
          }}
          style={tabStyle(tab.id)}
        >
          {tab.label}
        </button>
      {/each}
    </div>

    <!-- Input -->
    <TextAreaField
      id="encode-input"
      bind:value={input}
      label={t().common.inputPlaceholder}
      placeholder={t().tools.encode.placeholder}
      maxlength={100_000}
      status={error ? "error" : "idle"}
      hint={error || undefined}
      showMascot
    />

    <!-- Buttons -->
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <button
        onclick={() => run("encode")}
        disabled={!input.trim()}
        style="background: var(--color-accent); color: #050508; border: none; border-radius: var(--radius); padding: 0.5rem 1rem; font-weight: 600; cursor: pointer; font-size: 0.875rem;"
      >
        {t().common.encode}
      </button>
      <button
        onclick={() => run("decode")}
        disabled={!input.trim()}
        style="background: var(--color-surface); color: var(--color-text); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
      >
        {t().common.decode}
      </button>
      {#if activeTab === "url"}
        <button
          onclick={parseUrlParts}
          disabled={!input.trim()}
          style="background: var(--color-surface); color: var(--color-text); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
        >
          {t().tools.url.parseUrl}
        </button>
      {/if}
      <button
        onclick={clear}
        style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
      >
        {t().common.clear}
      </button>
    </div>

    <!-- Output -->
    {#if hasResult}
      <div>
        <div
          style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.375rem;"
        >
          <span style="font-size: 0.85rem; color: var(--color-text-muted);"
            >{t().common.outputPlaceholder}</span
          >
          <button
            onclick={() => copy(output, "output")}
            style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.25rem 0.625rem; cursor: pointer; font-size: 0.75rem;"
          >
            {copiedId === "output" ? t().common.copied : t().common.copy}
          </button>
        </div>
        <textarea readonly value={output} spellcheck={false} style={textareaStyle}></textarea>
      </div>
    {/if}

    <!-- URL Parse Result -->
    {#if parsedUrl}
      <div style="display: flex; flex-direction: column; gap: 0.375rem;">
        {#each ["protocol", "hostname", "port", "pathname", "search", "hash"] as key (key)}
          {#if parsedUrl[key]}
            <div
              style="display: flex; gap: 0.75rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.5rem 0.75rem;"
            >
              <span
                style="font-size: 0.75rem; color: var(--color-text-faint); min-width: 80px; flex-shrink: 0;"
                >{key}</span
              >
              <span style="font-family: var(--font-mono); font-size: 0.85rem;"
                >{parsedUrl[key]}</span
              >
            </div>
          {/if}
        {/each}
        {#if urlParams.length > 0}
          <div
            style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.5rem 0.75rem;"
          >
            <span style="font-size: 0.75rem; color: var(--color-text-faint);">params</span>
            {#each urlParams as [k, v] (k)}
              <div
                style="display: flex; gap: 0.5rem; font-family: var(--font-mono); font-size: 0.8rem; margin-top: 0.25rem;"
              >
                <span style="color: var(--color-accent);">{k}</span>
                <span style="color: var(--color-text-faint);">=</span>
                <span>{v}</span>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</ToolLayout>
