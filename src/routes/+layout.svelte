<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import Nav from "$lib/components/Nav.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import ConsentBanner from "$lib/components/ConsentBanner.svelte";
  import { initTheme } from "$lib/theme/theme.svelte";
  import { initClientLang } from "$lib/i18n/i18n.svelte";
  import {
    initConsent,
    isAccepted,
    hasAnalyticsConsent,
    hasAdvertisingConsent,
  } from "$lib/consent/consent.svelte";
  import { getAnnouncement, clearAnnouncement } from "$lib/announce.svelte";

  let { children } = $props();

  const GA_ID = import.meta.env.PUBLIC_GA_ID ?? "";

  onMount(() => {
    initTheme();
    initClientLang();
    initConsent();
    const ann = getAnnouncement();
    if (ann) {
      const t = setTimeout(() => clearAnnouncement(), 3000);
      return () => clearTimeout(t);
    }
  });

  // Google Consent Mode v2: defaults denied before any Google script loads
  $effect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("phoxia-consent-defaults")) return;

    const consentDefaults = document.createElement("script");
    consentDefaults.id = "phoxia-consent-defaults";
    consentDefaults.textContent = `
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('consent', 'default', {
				ad_storage: 'denied',
				ad_user_data: 'denied',
				ad_personalization: 'denied',
				analytics_storage: 'denied',
				wait_for_update: 500
			});
		`;
    document.head.appendChild(consentDefaults);
  });

  // Inject AdSense + GA4 based on granular consent
  $effect(() => {
    if (typeof window === "undefined") return;
    if (!isAccepted()) return;
    if (document.getElementById("phoxia-scripts")) return;

    const container = document.createElement("div");
    container.id = "phoxia-scripts";

    // AdSense, gated behind advertising consent
    if (hasAdvertisingConsent()) {
      const adsScript = document.createElement("script");
      adsScript.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7052672921293029";
      adsScript.async = true;
      adsScript.crossOrigin = "anonymous";
      container.appendChild(adsScript);
    }

    // GA4, gated behind analytics consent
    if (hasAnalyticsConsent() && GA_ID) {
      const gaScript = document.createElement("script");
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      gaScript.async = true;
      container.appendChild(gaScript);

      const gaInline = document.createElement("script");
      gaInline.textContent = `
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('config', '${GA_ID}', { anonymize_ip: true });
			`;
      container.appendChild(gaInline);
    }

    document.head.appendChild(container);
  });

  // Re-inject scripts if user accepts later (consent banner still shown, then accepted)
  $effect(() => {
    if (!isAccepted()) return;
    if (typeof window === "undefined") return;

    // Update Consent Mode to reflect granular choices
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("consent", "update", {
        ad_storage: hasAdvertisingConsent() ? "granted" : "denied",
        ad_user_data: hasAdvertisingConsent() ? "granted" : "denied",
        ad_personalization: hasAdvertisingConsent() ? "granted" : "denied",
        analytics_storage: hasAnalyticsConsent() ? "granted" : "denied",
      });
    }

    // GA4 re-inject if analytics consent granted
    if (hasAnalyticsConsent() && GA_ID && !document.getElementById("phoxia-ga")) {
      const gaScript = document.createElement("script");
      gaScript.id = "phoxia-ga";
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      gaScript.async = true;
      document.head.appendChild(gaScript);

      const gaInline = document.createElement("script");
      gaInline.textContent = `
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('config', '${GA_ID}', { anonymize_ip: true });
			`;
      document.head.appendChild(gaInline);
    }

    // AdSense re-inject if advertising consent granted
    if (
      hasAdvertisingConsent() &&
      !document.getElementById("phoxia-ads") &&
      !document.getElementById("phoxia-scripts")
    ) {
      const adsScript = document.createElement("script");
      adsScript.id = "phoxia-ads";
      adsScript.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7052672921293029";
      adsScript.async = true;
      adsScript.crossOrigin = "anonymous";
      document.head.appendChild(adsScript);
    }
  });
</script>

<svelte:head>
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Phoxia Tools",
      "url": "https://tools.phoxia.org",
      "description": "Free developer tools that run entirely in your browser.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://tools.phoxia.org/tools/http-status?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  </script>
  <meta property="og:site_name" content="Phoxia Tools" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:locale:alternate" content="pt_BR" />
  <meta property="og:image" content="https://tools.phoxia.org/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="https://tools.phoxia.org/og.png" />
  <link rel="alternate" hreflang="en" href="https://tools.phoxia.org" />
  <link rel="alternate" hreflang="pt" href="https://tools.phoxia.org" />
  <link rel="alternate" hreflang="x-default" href="https://tools.phoxia.org" />
</svelte:head>

<div class="page-shell">
  <Nav />
  <ConsentBanner />

  <main class="main-content">
    {@render children()}
  </main>

  <!-- Footer ads: responsive grid: 3 cols desktop, 2 tablet, 1 mobile -->
  <div aria-hidden="true" class="footer-ad">
    <ins
      class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-7052672921293029"
      data-ad-slot="4438107876"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
    <ins
      class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-7052672921293029"
      data-ad-slot="7974862354"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
    <ins
      class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-7052672921293029"
      data-ad-slot="5733475305"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  </div>

  <div
    aria-live="polite"
    class="sr-only"
    style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;"
  >
    {getAnnouncement()}
  </div>
  <Footer />
</div>

<style>
  .page-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
  }

  .footer-ad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    padding: 1rem 2rem;
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
  }

  @media (max-width: 1024px) {
    .footer-ad {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .footer-ad {
      grid-template-columns: 1fr;
    }
  }
</style>
