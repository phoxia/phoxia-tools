<script lang="ts">
  import Lux from "$lib/components/Lux.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { COPY_DETECT_PREFILL_KEY, type Format } from "$lib/copyDetect";
  import {
    tooltipVisible,
    tooltipLuxState,
    tooltipMatch,
    tooltipOriginalText,
    dismissTooltip,
  } from "./clipboardTooltipState.svelte";

  let boxEl = $state<HTMLElement | null>(null);

  // Plain hard navigation (not SvelteKit's goto()) — this button lives inside
  // a reactive {#if} that unmounts itself on dismiss, and every SPA-router
  // approach tried here (native <a href>, then goto()) ended up silently
  // cancelled by that same unmount. sessionStorage survives a full navigation
  // within the same tab, so a hard redirect is simple and always works.
  function openInTool() {
    const route = tooltipMatch()?.route;
    if (!route) return;
    sessionStorage.setItem(COPY_DETECT_PREFILL_KEY, tooltipOriginalText());
    window.location.href = route;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && tooltipVisible()) dismissTooltip();
  }

  function handlePointerDown(e: PointerEvent) {
    if (tooltipVisible() && boxEl && !boxEl.contains(e.target as Node)) dismissTooltip();
  }

  function promptFor(format: Format): string {
    switch (format) {
      case "jwt":
        return t().copyDetect.promptJwt;
      case "curl":
        return t().copyDetect.promptCurl;
      case "cipher":
        return t().copyDetect.promptCipher;
      case "uuid":
        return t().copyDetect.promptUuid;
      default:
        return t().copyDetect.promptBase64;
    }
  }

  const match = $derived(tooltipMatch());
</script>

<svelte:window onkeydown={handleKeydown} onpointerdown={handlePointerDown} />

{#if tooltipVisible() && match}
  <div bind:this={boxEl} role="dialog" aria-label={promptFor(match.format)} class="copy-tooltip">
    <div class="copy-tooltip-header">
      <Lux state={tooltipLuxState()} size={52} float={false} label="" />
      <div class="copy-tooltip-body">
        <p class="copy-tooltip-prompt">{promptFor(match.format)}</p>
        <code class="copy-tooltip-preview">{match.preview}</code>
      </div>
      <button
        class="copy-tooltip-close"
        onclick={dismissTooltip}
        aria-label={t().copyDetect.dismiss}
      >
        &times;
      </button>
    </div>
    <div class="copy-tooltip-actions">
      <button class="copy-tooltip-link" onclick={openInTool}>
        {t().copyDetect.openInTool}
      </button>
    </div>
  </div>
{/if}

<style>
  .copy-tooltip {
    position: fixed;
    bottom: 1.25rem;
    right: 1.25rem;
    z-index: 200;
    max-width: 400px;
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-lg);
    padding: 1.125rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }

  @media not (prefers-reduced-motion: reduce) {
    .copy-tooltip {
      animation: copy-tooltip-in 0.15s ease-out;
    }
  }

  @keyframes copy-tooltip-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .copy-tooltip-header {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .copy-tooltip-body {
    flex: 1;
    min-width: 0;
  }

  .copy-tooltip-prompt {
    margin: 0 0 0.5rem;
    font-size: 0.95rem;
    color: var(--color-text);
  }

  .copy-tooltip-preview {
    display: block;
    max-height: 110px;
    overflow: auto;
    font-family: var(--font-mono);
    font-size: 0.82rem;
    color: var(--color-text-muted);
    word-break: break-all;
    background: var(--color-surface);
    border-radius: var(--radius-sm);
    padding: 0.5rem 0.625rem;
  }

  .copy-tooltip-close {
    background: none;
    border: none;
    color: var(--color-text-faint);
    cursor: pointer;
    font-size: 1.15rem;
    line-height: 1;
    padding: 0;
    min-height: unset;
  }

  .copy-tooltip-actions {
    display: flex;
    align-items: center;
    margin-top: 0.75rem;
  }

  .copy-tooltip-link {
    background: none;
    border: none;
    font-size: 0.82rem;
    color: var(--color-accent);
    text-decoration: none;
    cursor: pointer;
    padding: 0;
    min-height: unset;
  }

  .copy-tooltip-link:hover {
    text-decoration: underline;
  }
</style>
