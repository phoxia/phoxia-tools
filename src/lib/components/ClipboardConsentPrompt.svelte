<script lang="ts">
  import Lux from "$lib/components/Lux.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import {
    showClipboardPrompt,
    grantClipboardConsent,
    declineClipboardConsent,
  } from "$lib/consent/clipboardConsent.svelte";
  import { checkClipboard } from "./ClipboardWatcher.svelte";

  async function accept() {
    grantClipboardConsent();
    // The permission prompt (and the very first clipboard check) fires here,
    // inside this click handler — the only context where readText() reliably
    // works without a prior gesture.
    await checkClipboard();
  }

  function decline() {
    declineClipboardConsent();
  }
</script>

{#if showClipboardPrompt()}
  <div role="dialog" aria-label={t().clipboardWatcher.title} class="clipboard-prompt">
    <Lux state="thinking" size={32} float={false} label="" />
    <div class="clipboard-prompt-body">
      <p class="clipboard-prompt-title">{t().clipboardWatcher.title}</p>
      <p class="clipboard-prompt-text">{t().clipboardWatcher.body}</p>
      <div class="clipboard-prompt-actions">
        <button class="clipboard-prompt-decline" onclick={decline}>
          {t().clipboardWatcher.decline}
        </button>
        <button class="clipboard-prompt-accept" onclick={accept}>
          {t().clipboardWatcher.accept}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .clipboard-prompt {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 150;
    max-width: 300px;
    display: flex;
    gap: 0.625rem;
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-lg);
    padding: 0.875rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  }

  .clipboard-prompt-body {
    flex: 1;
    min-width: 0;
  }

  .clipboard-prompt-title {
    margin: 0 0 0.25rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .clipboard-prompt-text {
    margin: 0 0 0.75rem;
    font-size: 0.78rem;
    color: var(--color-text-muted);
    line-height: 1.4;
  }

  .clipboard-prompt-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  .clipboard-prompt-decline {
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    cursor: pointer;
    font-size: 0.75rem;
    padding: 0.375rem 0.625rem;
    min-height: unset;
  }

  .clipboard-prompt-accept {
    background: var(--color-accent);
    border: none;
    border-radius: var(--radius-sm);
    color: #050508;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.375rem 0.625rem;
    min-height: unset;
  }
</style>
