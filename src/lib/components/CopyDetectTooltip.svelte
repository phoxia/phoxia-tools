<script lang="ts">
  import Lux from "$lib/components/Lux.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { looksLikeBase64, isPrintableText, COPY_DETECT_PREFILL_KEY } from "$lib/copyDetect";
  import { decodeBase64 } from "../../routes/tools/encode/logic";

  const OPT_OUT_KEY = "phoxia-copy-detect-disabled";
  const AUTO_HIDE_MS = 8000;

  let visible = $state(false);
  let luxState = $state<"thinking" | "happy">("thinking");
  let decoded = $state("");
  let originalText = $state("");
  let pos = $state({ top: 0, left: 0 });
  let lastShownText = $state("");
  let boxEl = $state<HTMLElement | null>(null);

  let hideTimer: ReturnType<typeof setTimeout> | undefined;
  let happyTimer: ReturnType<typeof setTimeout> | undefined;

  // Range.getBoundingClientRect() collapses to (0,0,0,0) when the selection lives
  // inside a <textarea>/<input> — native form controls don't expose their internal
  // text layout to Range geometry, even though sel.toString() still returns the text.
  // Since most copyable content on this site lives in output/input textareas, fall
  // back to the focused element's own box so the tooltip doesn't pin to the page corner.
  function getAnchorRect(sel: Selection | null): DOMRect | null {
    if (sel && sel.rangeCount > 0) {
      try {
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        if (rect.width > 0 || rect.height > 0 || rect.top > 0 || rect.left > 0) {
          return rect;
        }
      } catch {
        // fall through to activeElement fallback
      }
    }
    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body) {
      return active.getBoundingClientRect();
    }
    return null;
  }

  function handleCopy() {
    if (typeof localStorage !== "undefined" && localStorage.getItem(OPT_OUT_KEY) === "1") return;

    const sel = window.getSelection();
    const text = sel?.toString().trim() ?? "";
    if (!text || text === lastShownText) return;
    if (!looksLikeBase64(text)) return;

    const r = decodeBase64(text);
    if (!r.ok || !isPrintableText(r.value)) return;

    const rect = getAnchorRect(sel);
    if (!rect) return;

    pos = { top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX };
    decoded = r.value.slice(0, 200);
    originalText = text;
    lastShownText = text;
    luxState = "thinking";
    visible = true;

    clearTimeout(hideTimer);
    clearTimeout(happyTimer);
    happyTimer = setTimeout(() => (luxState = "happy"), 400);
    hideTimer = setTimeout(() => (visible = false), AUTO_HIDE_MS);
  }

  function dismiss() {
    visible = false;
    clearTimeout(hideTimer);
    clearTimeout(happyTimer);
  }

  function optOut() {
    localStorage.setItem(OPT_OUT_KEY, "1");
    dismiss();
  }

  function openInTool() {
    sessionStorage.setItem(COPY_DETECT_PREFILL_KEY, originalText);
    dismiss();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && visible) dismiss();
  }

  function handlePointerDown(e: PointerEvent) {
    if (visible && boxEl && !boxEl.contains(e.target as Node)) dismiss();
  }
</script>

<svelte:window oncopy={handleCopy} onkeydown={handleKeydown} onpointerdown={handlePointerDown} />

{#if visible}
  <div
    bind:this={boxEl}
    role="dialog"
    aria-label={t().copyDetect.prompt}
    class="copy-tooltip"
    style="top: {pos.top}px; left: {pos.left}px;"
  >
    <div class="copy-tooltip-header">
      <Lux state={luxState} size={40} float={false} label="" />
      <div class="copy-tooltip-body">
        <p class="copy-tooltip-prompt">{t().copyDetect.prompt}</p>
        <code class="copy-tooltip-preview">{decoded}</code>
      </div>
      <button class="copy-tooltip-close" onclick={dismiss} aria-label={t().copyDetect.dismiss}>
        &times;
      </button>
    </div>
    <div class="copy-tooltip-actions">
      <a href="/tools/encode?tab=base64" class="copy-tooltip-link" onclick={openInTool}>
        {t().copyDetect.openInTool}
      </a>
      <button class="copy-tooltip-optout" onclick={optOut}>{t().copyDetect.optOut}</button>
    </div>
  </div>
{/if}

<style>
  .copy-tooltip {
    position: absolute;
    z-index: 200;
    max-width: 320px;
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius);
    padding: 0.75rem;
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
    gap: 0.5rem;
  }

  .copy-tooltip-body {
    flex: 1;
    min-width: 0;
  }

  .copy-tooltip-prompt {
    margin: 0 0 0.375rem;
    font-size: 0.8rem;
    color: var(--color-text);
  }

  .copy-tooltip-preview {
    display: block;
    max-height: 80px;
    overflow: auto;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-muted);
    word-break: break-all;
    background: var(--color-surface);
    border-radius: var(--radius-sm);
    padding: 0.375rem 0.5rem;
  }

  .copy-tooltip-close {
    background: none;
    border: none;
    color: var(--color-text-faint);
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    padding: 0;
    min-height: unset;
  }

  .copy-tooltip-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.625rem;
  }

  .copy-tooltip-link {
    font-size: 0.75rem;
    color: var(--color-accent);
    text-decoration: none;
    min-height: unset;
  }

  .copy-tooltip-link:hover {
    text-decoration: underline;
  }

  .copy-tooltip-optout {
    background: none;
    border: none;
    color: var(--color-text-faint);
    cursor: pointer;
    font-size: 0.7rem;
    text-decoration: underline;
    padding: 0;
    min-height: unset;
  }
</style>
