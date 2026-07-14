<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import { t, getLang, setLang } from "$lib/i18n/i18n.svelte";
  import { getModePref, setModePref } from "$lib/theme/theme.svelte";
  import { Sun, Moon, Monitor, Menu, X } from "$lib/icons";
  import Globe from "lucide-svelte/icons/globe";
  import { sidebarState } from "$lib/sidebar.svelte";

  const isToolPage = $derived(page.url.pathname.startsWith("/tools/"));

  let modePref = $derived(getModePref());
  let lang = $state(getLang());
  let scrolled = $state(false);
  let themeOpen = $state(false);
  let langOpen = $state(false);

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

    function closeMenus(e: MouseEvent) {
      if (!(e.target as HTMLElement)?.closest(".menu")) { themeOpen = false; langOpen = false; }
    }
    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") { themeOpen = false; langOpen = false; }
    }
    document.addEventListener("click", closeMenus);
    document.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", closeMenus);
      document.removeEventListener("keydown", onKeydown);
    };
  });

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
      <div class="menu">
        <button
          aria-label={locale.nav.toggleLang}
          aria-expanded={langOpen}
          class="ctrl-btn"
          title={locale.nav.toggleLang}
          onclick={() => { langOpen = !langOpen; themeOpen = false; }}
        >
          <Globe size={15} aria-hidden="true" />
          <span class="ctrl-label">{lang === "en" ? "PT" : "EN"}</span>
        </button>
        {#if langOpen}
          <div class="dropdown">
            <button aria-pressed={lang === "en"} onclick={() => { setLang("en"); langOpen = false; }}>English</button>
            <button aria-pressed={lang === "pt-BR"} onclick={() => { setLang("pt-BR"); langOpen = false; }}>Português</button>
          </div>
        {/if}
      </div>

      <div class="menu">
        <button
          aria-label={locale.nav.toggleTheme}
          aria-expanded={themeOpen}
          class="ctrl-btn"
          title="{locale.nav.toggleTheme}: {modeLabel}"
          onclick={() => { themeOpen = !themeOpen; langOpen = false; }}
        >
          <ModeIcon size={15} aria-hidden="true" />
        </button>
        {#if themeOpen}
          <div class="dropdown">
            <button aria-pressed={modePref === "system"} onclick={() => { setModePref("system"); themeOpen = false; }}><Monitor size={15} aria-hidden="true" />{locale.common.system}</button>
            <button aria-pressed={modePref === "light"} onclick={() => { setModePref("light"); themeOpen = false; }}><Sun size={15} aria-hidden="true" />{locale.common.light}</button>
            <button aria-pressed={modePref === "dark"} onclick={() => { setModePref("dark"); themeOpen = false; }}><Moon size={15} aria-hidden="true" />{locale.common.dark}</button>
          </div>
        {/if}
      </div>

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

  .menu { position: relative; }
  .dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    display: grid;
    min-width: 130px;
    padding: 6px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-surface);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
    z-index: 50;
  }
  .dropdown button {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    min-height: 36px;
    padding: 6px 10px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--color-text);
    font-family: var(--font-body);
    font-size: 0.8125rem;
    cursor: pointer;
  }
  .dropdown button:hover { background: var(--color-surface-raised); }
  .dropdown button[aria-pressed="true"] { background: var(--color-surface-raised); }

  .sidebar-menu-btn {
    display: none;
  }

  @media (max-width: 768px) {
    .sidebar-menu-btn {
      display: inline-flex;
    }
  }
</style>
