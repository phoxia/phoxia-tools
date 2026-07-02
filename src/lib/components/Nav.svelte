<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import { t, cycleLang, getLang } from "$lib/i18n/i18n.svelte";
  import { cycleMode, getModePref } from "$lib/theme/theme.svelte";
  import { Sun, Moon, Monitor, Languages, Menu, X } from "$lib/icons";
  import { sidebarState } from "$lib/sidebar.svelte";

  const isToolPage = $derived(page.url.pathname.startsWith("/tools/"));

  let modePref = $derived(getModePref());
  let lang = $state(getLang());
  let scrolled = $state(false);

  onMount(() => {
    let ticking = false;
    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        scrolled = window.scrollY > 16;
        ticking = false;
      });
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  });

  function handleMode() {
    cycleMode();
  }

  function handleLang() {
    cycleLang();
    lang = getLang();
  }

  const ModeIcon = $derived(modePref === "dark" ? Sun : modePref === "light" ? Moon : Monitor);

  let locale = $derived(t());
  let modeLabel = $derived(
    modePref === "dark"
      ? locale.common.dark
      : modePref === "light"
        ? locale.common.light
        : locale.common.system
  );
</script>

<a href="#main-content" class="skip-link">{locale.nav.skipToContent}</a>

<header class="nav-header" class:scrolled>
  <nav class="nav-inner" aria-label={locale.nav.mainNavAria}>
    <a href={resolve("/")} class="nav-logo" aria-label={locale.aria.homeLogo}>
      <img src="/brand/symbol.png" alt="" width="28" height="28" aria-hidden="true" />
      <span class="nav-wordmark">Phoxia <span class="nav-accent">Tools</span></span>
    </a>

    <div class="nav-controls">
      <button
        onclick={handleLang}
        aria-label={locale.nav.toggleLang}
        title={locale.nav.toggleLang}
        class="ctrl-btn"
      >
        <Languages size={15} aria-hidden="true" />
        <span class="ctrl-label">{lang === "en" ? "PT" : "EN"}</span>
      </button>

      <button
        onclick={handleMode}
        aria-label={locale.nav.toggleTheme}
        title="{locale.nav.toggleTheme}: {modeLabel}"
        class="ctrl-btn"
      >
        <ModeIcon size={15} aria-hidden="true" />
      </button>

      {#if isToolPage}
        <button
          class="ctrl-btn sidebar-menu-btn"
          onclick={() => (sidebarState.open = !sidebarState.open)}
          aria-label="Toggle sidebar"
        >
          {#if sidebarState.open}
            <X size={15} aria-hidden="true" />
          {:else}
            <Menu size={15} aria-hidden="true" />
          {/if}
        </button>
      {/if}
    </div>
  </nav>
</header>

<style>
  .skip-link {
    position: absolute;
    top: -100%;
    left: 1rem;
    background: var(--color-accent);
    color: #050508;
    padding: 0.5rem 1rem;
    border-radius: var(--radius);
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 600;
    z-index: 200;
    min-height: unset;
    display: block;
  }

  .skip-link:focus {
    top: 0.75rem;
  }

  .nav-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(13, 13, 20, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--color-border);
    transition: background-color 0.2s ease;
  }

  :global([data-mode="light"]) .nav-header {
    background: rgba(250, 249, 245, 0.85);
  }

  .nav-header.scrolled {
    background: rgba(13, 13, 20, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  :global([data-mode="light"]) .nav-header.scrolled {
    background: rgba(250, 249, 245, 0.95);
  }

  .nav-inner {
    padding: 0 2rem;
    height: 60px;
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .nav-logo {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: var(--color-text);
    min-height: unset;
    flex-shrink: 0;
  }

  .nav-logo:hover {
    opacity: 0.85;
  }

  .nav-wordmark {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 1.1rem;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }

  .nav-accent {
    color: var(--color-accent);
  }

  .nav-controls {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-left: auto;
  }

  .ctrl-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 0.35rem 0.6rem;
    cursor: pointer;
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    min-height: 32px;
    transition:
      border-color 0.15s,
      color 0.15s;
  }

  .ctrl-btn:hover {
    border-color: var(--color-border-strong);
    color: var(--color-text);
  }

  .ctrl-label {
    line-height: 1;
  }
  .sidebar-menu-btn {
    display: none;
  }

  @media (max-width: 768px) {
    .sidebar-menu-btn {
      display: inline-flex;
    }
  }
</style>
