<script module lang="ts">
  import { hasClipboardConsent } from "$lib/consent/clipboardConsent.svelte";
  import { evaluateClipboardText } from "./clipboardTooltipState.svelte";

  // Exported as a plain function (not a component method) so the consent
  // prompt's Accept handler can run the very first check in the same click,
  // without needing a component-instance reference. Gated only by the site's
  // clipboard consent (revocable via the footer link / browser permission) —
  // no separate in-tooltip opt-out, that would be a second place to disable
  // the same thing.
  export async function checkClipboard() {
    if (!hasClipboardConsent()) return;
    try {
      const text = await navigator.clipboard.readText();
      evaluateClipboardText(text);
    } catch {
      // permission denied/revoked at the browser level, or API unsupported
      // (Firefox/Safari outside a paste gesture) — silently no-op
    }
  }
</script>

<script lang="ts">
  function handleFocus() {
    checkClipboard();
  }
</script>

<svelte:window onfocus={handleFocus} />
