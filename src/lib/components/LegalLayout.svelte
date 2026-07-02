<script lang="ts">
  import { onMount } from "svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import type { IconComponent } from "$lib/icons";

  interface Section {
    id: string;
    title: string;
    content: string;
  }

  let {
    title = "",
    icon,
    lastUpdated = "",
    tocLabel = "",
    sections = [] as Section[],
  }: {
    title?: string;
    icon?: IconComponent;
    lastUpdated?: string;
    tocLabel?: string;
    sections?: Section[];
  } = $props();

  const Icon = $derived(icon);

  let activeSection = $state("");
  let observer: IntersectionObserver | null = null;

  onMount(() => {
    activeSection = sections[0]?.id ?? "";
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) activeSection = visible[0].target.id;
      },
      { rootMargin: "-8% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer!.observe(el);
    });
    return () => observer?.disconnect();
  });

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    activeSection = id;
  }
</script>

<div class="legal-root" id="main-content">
  <!-- Header sits above the flex body, aligned with the content column on wide screens -->
  <header class="legal-header">
    <div class="legal-header-inner">
      {#if Icon}
        <div class="legal-header-icon" aria-hidden="true">
          <Icon size={22} strokeWidth={1.75} />
        </div>
      {/if}
      <div>
        <h1 class="legal-title">{title}</h1>
        {#if lastUpdated}
          <p class="legal-updated">{lastUpdated}</p>
        {/if}
      </div>
    </div>
    <hr class="legal-divider" />
  </header>

  <div class="legal-body">
    <!-- Sidebar TOC, sticky, only visible on wide screens -->
    <nav class="legal-sidebar" aria-label={t().aria.toc}>
      <span class="legal-toc-label">{tocLabel}</span>
      <ul class="legal-toc" role="list">
        {#each sections as section (section.id)}
          <li>
            <button
              class="legal-toc-item"
              class:active={activeSection === section.id}
              onclick={() => scrollTo(section.id)}
            >
              {section.title}
            </button>
          </li>
        {/each}
      </ul>
    </nav>

    <main class="legal-col">
      {#each sections as section, i (section.id)}
        <section id={section.id} class="legal-section" class:last={i === sections.length - 1}>
          <h2 class="legal-section-title">{section.title}</h2>
          <p class="legal-section-text">{section.content}</p>
        </section>
      {/each}
    </main>
  </div>
</div>

<style>
  .legal-root {
    padding: 3rem 2rem 6rem;
  }

  /* ── Header: centered by default, aligns with content column on wide screens ── */
  .legal-header {
    max-width: 700px;
    margin: 0 auto 2.5rem;
  }

  @media (min-width: 1024px) {
    .legal-header {
      /* Align with content column start:
			   body is max-width 1100px centered → (100% - 1100px) / 2 is the body's left offset.
			   Content starts after sidebar (260px) + gap (3rem). */
      margin-left: max(0px, calc((100% - 1100px) / 2 + 260px + 3rem));
      margin-bottom: 2.5rem;
      max-width: 700px;
    }
  }

  .legal-body {
    display: flex;
    align-items: flex-start;
    max-width: 1100px;
    margin: 0 auto;
    gap: 3rem;
  }

  /* ── Sidebar TOC ── */
  .legal-sidebar {
    display: none;
    width: 260px;
    flex-shrink: 0;
    position: sticky;
    top: calc(56px + 1.5rem);
    max-height: calc(100vh - 80px);
    overflow-y: auto;
  }

  @media (min-width: 1024px) {
    .legal-sidebar {
      display: block;
    }
  }

  .legal-toc-label {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.63rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-faint);
    padding: 0 0.5rem;
    margin-bottom: 0.4rem;
  }

  .legal-toc {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .legal-toc-item {
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.4rem 0.6rem;
    margin-bottom: 1px;
    border-radius: var(--radius-sm);
    border: none;
    border-left: 2px solid transparent;
    background: transparent;
    color: var(--color-text-faint);
    font-family: var(--font-body);
    font-size: 0.8rem;
    cursor: pointer;
    line-height: 1.45;
    transition:
      color 0.12s,
      background 0.12s,
      border-color 0.12s;
    min-height: unset;
  }

  .legal-toc-item:hover {
    background: var(--color-surface);
    color: var(--color-text-muted);
  }

  .legal-toc-item.active {
    border-left-color: var(--color-accent);
    color: var(--color-accent);
    font-weight: 600;
    background: color-mix(in srgb, var(--color-accent) 7%, transparent);
  }

  /* ── Content column ── */
  .legal-col {
    flex: 1;
    min-width: 0;
    max-width: 700px;
    margin: 0 auto;
  }

  @media (min-width: 1024px) {
    .legal-col {
      margin: 0;
    }
  }

  .legal-header-inner {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .legal-header-icon {
    width: 38px;
    height: 38px;
    border-radius: 8px;
    background: color-mix(in srgb, var(--color-accent) 10%, transparent);
    color: var(--color-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .legal-title {
    font-family: var(--font-heading);
    font-size: clamp(1.5rem, 3vw, 1.9rem);
    font-weight: 700;
    color: var(--color-text);
    line-height: 1.2;
    margin: 0;
    letter-spacing: -0.025em;
  }

  .legal-updated {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-faint);
    margin: 0.3rem 0 0;
  }

  .legal-divider {
    border: none;
    border-top: 1px solid var(--color-border);
    margin-top: 1.25rem;
    margin-bottom: 0;
  }

  /* ── Sections ── */
  .legal-section {
    padding: 2.25rem 0;
    scroll-margin-top: 72px;
  }

  .legal-section:not(.last) {
    border-bottom: 1px solid var(--color-border);
  }

  .legal-section-title {
    font-family: var(--font-heading);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 1rem;
    line-height: 1.35;
    letter-spacing: -0.015em;
  }

  .legal-section-text {
    font-family: var(--font-body);
    font-size: 0.9375rem;
    line-height: 1.85;
    color: var(--color-text-muted);
    white-space: pre-line;
    margin: 0;
  }
</style>
