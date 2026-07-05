<script lang="ts">
  import { hasAdvertisingConsent } from "$lib/consent/consent.svelte";

  interface Props {
    slot: string;
  }

  let { slot }: Props = $props();

  const ADSENSE_CLIENT = "ca-pub-7289452505616948";
  let pushed = false;

  // The adsbygoogle.js loader script itself is injected once, site-wide, by
  // +layout.svelte (gated on hasAdvertisingConsent). This only queues the
  // per-slot fill request; the array-push pattern works even if the loader
  // script hasn't finished loading yet.
  $effect(() => {
    if (!hasAdvertisingConsent()) {
      // Consent revoked: allow a future re-grant to push again.
      pushed = false;
      return;
    }
    if (pushed) return;
    pushed = true;
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  });
</script>

{#if hasAdvertisingConsent()}
  <ins
    class="adsbygoogle"
    style="display:block"
    data-ad-client={ADSENSE_CLIENT}
    data-ad-slot={slot}
    data-ad-format="auto"
    data-full-width-responsive="true"
  ></ins>
{/if}
