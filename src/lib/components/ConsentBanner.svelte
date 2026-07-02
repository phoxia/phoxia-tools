<script lang="ts">
  import { resolve } from "$app/paths";
  import { t } from "$lib/i18n/i18n.svelte";
  import { showBanner, versionChanged, saveConsent, decline } from "$lib/consent/consent.svelte";

  let dialogEl = $state<HTMLElement | null>(null);
  let acceptBtn = $state<HTMLElement | null>(null);
  let previousFocus = $state<HTMLElement | null>(null);
  let analytics = $state(true);
  let advertising = $state(true);

  const isVersionUpdate = $derived(versionChanged());

  $effect(() => {
    const visible = showBanner();
    if (visible) {
      previousFocus = document.activeElement as HTMLElement | null;
      requestAnimationFrame(() => {
        acceptBtn?.focus();
      });
    } else if (previousFocus) {
      previousFocus.focus();
      previousFocus = null;
    }
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && showBanner()) {
      e.preventDefault();
      decline();
    }
  }

  function acceptSelected() {
    saveConsent({ analytics, advertising });
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if showBanner()}
  <div
    bind:this={dialogEl}
    role="dialog"
    aria-label={t().consent.message}
    aria-modal="false"
    style="
			position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
			background: var(--color-surface);
			border-top: 1px solid var(--color-border-strong);
			padding: 1rem 1.5rem;
		"
  >
    <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
      <!-- Left: message + toggles -->
      <div style="flex: 1; min-width: 280px;">
        {#if isVersionUpdate}
          <p
            style="margin: 0 0 0.375rem; color: var(--color-text); font-size: 0.875rem; font-weight: 600;"
          >
            We've updated our privacy settings. Please review your preferences below.
          </p>
        {:else}
          <p style="margin: 0 0 0.375rem; color: var(--color-text); font-size: 0.875rem;">
            {t().consent.message}
            <a
              href={resolve("/privacy")}
              style="margin-left: 0.375rem; color: var(--color-text-muted); font-size: 0.8rem;"
              >{t().consent.bannerPrivacy}</a
            >
          </p>
        {/if}

        <div style="display: flex; gap: 1.25rem; flex-wrap: wrap;">
          <label
            style="display: flex; align-items: center; gap: 0.375rem; cursor: pointer; opacity: 0.55;"
          >
            <input type="checkbox" checked disabled style="accent-color: var(--color-accent);" />
            <span style="font-size: 0.8rem; color: var(--color-text-muted);">Essential</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.375rem; cursor: pointer;">
            <input
              type="checkbox"
              bind:checked={analytics}
              style="accent-color: var(--color-accent);"
            />
            <span style="font-size: 0.8rem; color: var(--color-text);">Analytics</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.375rem; cursor: pointer;">
            <input
              type="checkbox"
              bind:checked={advertising}
              style="accent-color: var(--color-accent);"
            />
            <span style="font-size: 0.8rem; color: var(--color-text);">Advertising</span>
          </label>
        </div>
      </div>

      <!-- Right: buttons -->
      <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
        <button
          onclick={decline}
          style="
						padding: 0.5rem 1.25rem; border-radius: var(--radius-sm);
						border: 1px solid var(--color-border-strong);
						background: transparent; color: var(--color-text-muted);
						cursor: pointer; font-size: 0.875rem; min-height: 44px;
					"
        >
          {t().consent.decline}
        </button>
        <button
          bind:this={acceptBtn}
          onclick={acceptSelected}
          style="
						padding: 0.5rem 1.25rem; border-radius: var(--radius-sm);
						border: none; background: var(--color-accent);
						color: #050508; cursor: pointer;
						font-size: 0.875rem; font-weight: 600; min-height: 44px;
					"
        >
          {t().consent.accept}
        </button>
      </div>
    </div>
  </div>
{/if}
