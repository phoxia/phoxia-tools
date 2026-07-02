<script lang="ts">
  import { onMount } from "svelte";
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { copyToClipboard } from "$lib/clipboard.svelte";
  import { trackToolUsed } from "$lib/analytics/analytics";
  import { COPY_DETECT_PREFILL_KEY } from "$lib/copyDetect";
  import { decodeJwt, isExpired, formatExp } from "./logic";

  let input = $state("");
  let result = $state<ReturnType<typeof decodeJwt> | null>(null);

  onMount(() => {
    const prefill = sessionStorage.getItem(COPY_DETECT_PREFILL_KEY);
    if (prefill) {
      input = prefill;
      sessionStorage.removeItem(COPY_DETECT_PREFILL_KEY);
      decode();
    }
  });

  const EXAMPLE =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  function decode() {
    result = decodeJwt(input.trim());
    if (!result.error) trackToolUsed("jwt");
  }

  function clear() {
    input = "";
    result = null;
  }

  function useExample() {
    input = EXAMPLE;
    decode();
  }

  let copied = $state("");
  async function copy(val: string, key: string) {
    const ok = await copyToClipboard(val, t().common.copied);
    copied = ok ? key : "";
    if (ok) setTimeout(() => (copied = ""), 1500);
  }

  const expStatus = $derived.by(() => {
    if (!result || result.error) return null;
    const exp = result.payload?.exp as number | undefined;
    const status = isExpired(exp);
    if (status === null) return null;
    return { expired: status, date: formatExp(exp!) };
  });

  const errorMessage = $derived.by(() => {
    if (!result?.error) return "";
    if (result.error.includes("3 parts")) return t().tools.jwt.errorParts;
    return t().tools.jwt.errorDecode;
  });
</script>

<ToolLayout toolId="jwt" title={t().tools.jwt.name} description={t().tools.jwt.desc}>
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <div>
      <label
        for="jwt-input"
        style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);"
      >
        {t().tools.jwt.labelToken}
      </label>
      <textarea
        id="jwt-input"
        bind:value={input}
        placeholder={t().tools.jwt.placeholder}
        spellcheck={false}
        oninput={() => {
          if (input.trim()) decode();
          else result = null;
        }}
        style="
					width: 100%; min-height: 100px; resize: vertical;
					font-family: var(--font-mono); font-size: 0.8rem;
					background: var(--color-surface); border: 1px solid var(--color-border);
					border-radius: var(--radius); color: var(--color-text);
					padding: 0.75rem; box-sizing: border-box; word-break: break-all;
				"></textarea>
    </div>

    <div style="display: flex; gap: 0.5rem;">
      <button
        onclick={useExample}
        style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.4rem 0.875rem; cursor: pointer; font-size: 0.8rem;"
      >
        {t().tools.jwt.example}
      </button>
      <button
        onclick={clear}
        style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.4rem 0.875rem; cursor: pointer; font-size: 0.8rem;"
      >
        {t().common.clear}
      </button>
    </div>

    {#if result}
      {#if result.error}
        <p
          role="alert"
          style="color: var(--color-error); font-size: 0.875rem; margin: 0; font-family: var(--font-mono);"
        >
          {errorMessage}
        </p>
      {:else}
        <!-- exp banner -->
        {#if expStatus}
          <div
            style="
						padding: 0.5rem 0.875rem; border-radius: var(--radius); font-size: 0.8rem;
						background: {expStatus!.expired
              ? 'color-mix(in srgb, var(--color-error) 10%, transparent)'
              : 'color-mix(in srgb, var(--color-success) 10%, transparent)'};
						color: {expStatus!.expired ? 'var(--color-error)' : 'var(--color-success)'};
						border: 1px solid {expStatus!.expired
              ? 'color-mix(in srgb, var(--color-error) 30%, transparent)'
              : 'color-mix(in srgb, var(--color-success) 30%, transparent)'};
					"
          >
            {expStatus!.expired ? "⚠ " + t().tools.jwt.expired : "✓ " + t().tools.jwt.valid} · exp: {expStatus!
              .date}
          </div>
        {/if}

        <!-- Three panels -->
        {#each [{ label: t().tools.jwt.header, data: result.header, raw: result.raw?.header, key: "header" }, { label: t().tools.jwt.payload, data: result.payload, raw: result.raw?.payload, key: "payload" }, { label: t().tools.jwt.signature, data: null, raw: result.signature, key: "sig" }] as panel (panel.key)}
          <div
            style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); overflow: hidden;"
          >
            <div
              style="
							display: flex; justify-content: space-between; align-items: center;
							padding: 0.5rem 0.875rem;
							border-bottom: 1px solid var(--color-border);
						"
            >
              <span
                style="font-size: 0.75rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-text-faint);"
              >
                {panel.label}
              </span>
              <button
                onclick={() =>
                  copy(panel.data ? JSON.stringify(panel.data, null, 2) : panel.raw!, panel.key)}
                style="background: none; border: none; color: var(--color-text-muted); cursor: pointer; font-size: 0.75rem; padding: 0;"
              >
                {copied === panel.key ? t().common.copied : t().common.copy}
              </button>
            </div>
            <pre
              style="margin: 0; padding: 0.875rem; font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.6; overflow-x: auto; color: var(--color-text);">{panel.data
                ? JSON.stringify(panel.data, null, 2)
                : panel.raw}</pre>
          </div>
        {/each}
      {/if}
    {/if}
  </div>
</ToolLayout>
