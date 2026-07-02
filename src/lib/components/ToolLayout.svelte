<script lang="ts">
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import { onMount } from "svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { getToolsByCategory } from "$lib/tools/registry";
  import { sidebarState } from "$lib/sidebar.svelte";
  import Seo from "$lib/components/Seo.svelte";
  import type { Category } from "$lib/tools/registry";
  import type { LocaleShape } from "$lib/i18n/types";

  function handleSidebarKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && sidebarState.open) {
      e.preventDefault();
      sidebarState.open = false;
    }
  }

  let sidebarNavEl = $state<HTMLElement | null>(null);
  let focusBeforeSidebar = $state<HTMLElement | null>(null);

  $effect(() => {
    if (sidebarState.open) {
      focusBeforeSidebar = document.activeElement as HTMLElement | null;
      requestAnimationFrame(() => {
        sidebarNavEl?.querySelector("a")?.focus();
      });
    } else if (focusBeforeSidebar) {
      focusBeforeSidebar.focus();
      focusBeforeSidebar = null;
    }
  });

  let {
    title,
    description,
    toolId,
    route,
    children,
  }: {
    title: string;
    description: string;
    toolId: string;
    route?: string;
    children: import("svelte").Snippet;
  } = $props();

  const categories: Category[] = ["dev", "text", "reference"];
  const grouped = $derived(getToolsByCategory());
  const currentPath = $derived(page.url.pathname);

  onMount(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch {
      // AdSense script not loaded: noop
    }
  });
</script>

<Seo title="{t().seo.siteName} • {title}" {description} path={route ?? `/tools/${toolId}`} />

<svelte:window onkeydown={handleSidebarKeydown} />

<div class="tool-shell" id="main-content">
  <!-- Sidebar -->
  <aside class="tool-sidebar" class:sidebar-open={sidebarState.open} bind:this={sidebarNavEl}>
    <nav aria-label={t().aria.allTools}>
      {#each categories as category (category)}
        {#if grouped[category].length > 0}
          <div class="sidebar-group">
            <p class="sidebar-category">{t().home.categories[category]}</p>
            {#each grouped[category] as tool (tool.id)}
              {@const ToolIcon = tool.icon}
              {@const toolLocale = t().tools[tool.id as keyof LocaleShape["tools"]]}
              <!-- resolve()'s overloads are keyed on one literal route at a
                   time; TS can't narrow them against tool.route, which is
                   typed as the full Pathname union (data-driven list). Each
                   route is already checked against Pathname in registry.ts,
                   so a typo there is caught — this cast just avoids fighting
                   the overload resolution for an already-validated value. -->
              <a
                href={resolve(tool.route as any)}
                class="sidebar-link"
                class:active={currentPath === tool.route}
                aria-current={currentPath === tool.route ? "page" : undefined}
                onclick={() => (sidebarState.open = false)}
              >
                <span class="sidebar-icon"><ToolIcon size={14} strokeWidth={1.75} /></span>
                {toolLocale?.name ?? tool.id}
              </a>
            {/each}
          </div>
        {/if}
      {/each}
    </nav>
  </aside>

  <!-- Overlay for mobile -->
  {#if sidebarState.open}
    <div
      class="sidebar-overlay"
      onclick={() => (sidebarState.open = false)}
      role="presentation"
    ></div>
  {/if}

  <!-- Main tool content -->
  <main class="tool-main">
    <header style="margin-bottom: 1.75rem;">
      <h1
        style="font-family: var(--font-heading); font-size: 1.5rem; margin: 0 0 0.25rem; line-height: 1.2;"
      >
        {title}
      </h1>
      <p style="color: var(--color-text-muted); margin: 0; font-size: 0.95rem;">{description}</p>
    </header>

    {@render children()}

    <!-- Ad slot: below output. Desktop only, height reserved to prevent CLS -->
    <div class="below-output-ad" aria-hidden="true">
      <ins
        class="adsbygoogle"
        style="display:block;width:100%;min-height:90px;"
        data-ad-client="ca-pub-7052672921293029"
        data-ad-slot="9966832386"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  </main>
</div>

<style>
  .below-output-ad {
    margin-top: 2.5rem;
    min-height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    .below-output-ad {
      display: none;
    }
  }

  .tool-shell {
    display: flex;
    width: 100%;
    min-height: calc(100vh - 56px);
    position: relative;
  }

  .tool-sidebar {
    width: 230px;
    flex-shrink: 0;
    border-right: 1px solid var(--color-border);
    padding: 1.25rem 0;
    position: sticky;
    top: 56px;
    height: calc(100vh - 56px);
    overflow-y: auto;
    scrollbar-width: thin;
  }

  .sidebar-group {
    margin-bottom: 1rem;
    padding: 0 0.625rem;
  }

  .sidebar-category {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-faint);
    margin: 0 0 0.25rem 0.375rem;
  }

  .sidebar-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.625rem;
    border-radius: 6px;
    font-size: 0.8rem;
    color: var(--color-text-muted);
    min-height: unset;
    transition:
      background 0.1s,
      color 0.1s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sidebar-link:hover {
    background: var(--color-border);
    color: var(--color-text);
  }

  .sidebar-link.active {
    background: color-mix(in srgb, var(--color-accent) 12%, transparent);
    color: var(--color-accent);
    font-weight: 500;
  }

  .sidebar-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .sidebar-overlay {
    display: none;
  }

  .tool-main {
    flex: 1;
    min-width: 0;
    padding: 2rem 2.5rem;
  }

  @media (max-width: 768px) {
    .tool-sidebar {
      display: none;
      position: fixed;
      top: 60px;
      left: 0;
      z-index: 105;
      height: calc(100vh - 60px);
      width: 260px;
      background: var(--color-surface);
      border-right: 1px solid var(--color-border);
      box-shadow: 4px 0 16px rgba(0, 0, 0, 0.3);
    }

    .tool-sidebar.sidebar-open {
      display: block;
    }

    .sidebar-overlay {
      display: block;
      position: fixed;
      inset: 0;
      top: 60px;
      z-index: 100;
      background: rgba(0, 0, 0, 0.5);
    }

    .tool-main {
      padding: 1.25rem;
    }
  }
</style>
