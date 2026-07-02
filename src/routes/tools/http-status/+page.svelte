<script lang="ts">
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { copyToClipboard } from "$lib/clipboard.svelte";
  import { trackToolUsed } from "$lib/analytics/analytics";

  type StatusCode = { code: number; name: string; desc: string };
  type Group = { label: string; color: string; codes: StatusCode[] };

  const groups = $derived.by(() => {
    const codes = t().tools.httpStatus.codes;
    const groupDefs: { label: string; color: string; prefix: number }[] = [
      {
        label: t().tools.httpStatus.groups.informational,
        color: "var(--color-text-muted)",
        prefix: 1,
      },
      { label: t().tools.httpStatus.groups.success, color: "var(--color-success)", prefix: 2 },
      { label: t().tools.httpStatus.groups.redirection, color: "#3b82f6", prefix: 3 },
      { label: t().tools.httpStatus.groups.clientError, color: "#f59e0b", prefix: 4 },
      { label: t().tools.httpStatus.groups.serverError, color: "var(--color-error)", prefix: 5 },
    ];
    return groupDefs
      .map((g) => ({
        label: g.label,
        color: g.color,
        codes: Object.entries(codes)
          .filter(([code]) => Math.floor(Number(code) / 100) === g.prefix)
          .map(([code, { name, desc }]) => ({ code: Number(code), name, desc }))
          .sort((a, b) => a.code - b.code),
      }))
      .filter((g) => g.codes.length > 0);
  });

  let query = $state("");
  let copiedCode = $state(0);

  const filtered = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        codes: g.codes.filter(
          (c) =>
            String(c.code).includes(q) ||
            c.name.toLowerCase().includes(q) ||
            c.desc.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.codes.length > 0);
  });

  async function copy(code: number) {
    const ok = await copyToClipboard(String(code), t().common.copied);
    copiedCode = ok ? code : 0;
    if (ok) trackToolUsed("httpStatus");
    if (ok) setTimeout(() => (copiedCode = 0), 1200);
  }
</script>

<ToolLayout
  toolId="httpStatus"
  route="/tools/http-status"
  title={t().tools.httpStatus.name}
  description={t().tools.httpStatus.desc}
>
  <div style="display: flex; flex-direction: column; gap: 1.5rem;">
    <input
      type="search"
      aria-label="Search HTTP status codes"
      bind:value={query}
      placeholder={t().tools.httpStatus.placeholder}
      style="
				width: 100%; padding: 0.625rem 0.875rem; box-sizing: border-box;
				background: var(--color-surface); border: 1px solid var(--color-border);
				border-radius: var(--radius); color: var(--color-text); font-size: 0.875rem;
			"
    />

    {#each filtered as group}
      <div>
        <h3
          style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: {group.color}; margin: 0 0 0.625rem;"
        >
          {group.label}
        </h3>
        <div
          style="display: flex; flex-direction: column; gap: 1px; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--color-border);"
        >
          {#each group.codes as entry}
            <div
              style="display: flex; align-items: baseline; gap: 1rem; padding: 0.6rem 0.875rem; background: var(--color-surface);"
            >
              <button
                onclick={() => copy(entry.code)}
                title={t().common.copy}
                style="
									flex-shrink: 0; width: 3.25rem; font-family: var(--font-mono);
									font-size: 0.875rem; font-weight: 700; color: {group.color};
									background: none; border: none; cursor: pointer; text-align: left; padding: 0;
								"
              >
                {copiedCode === entry.code ? "✓" : entry.code}
              </button>
              <span
                style="flex-shrink: 0; min-width: 12rem; font-size: 0.85rem; font-weight: 600; color: var(--color-text);"
              >
                {entry.name}
              </span>
              <span style="font-size: 0.8rem; color: var(--color-text-muted); line-height: 1.4;">
                {entry.desc}
              </span>
            </div>
          {/each}
        </div>
      </div>
    {/each}

    {#if filtered.length === 0}
      <p
        style="color: var(--color-text-muted); font-size: 0.875rem; text-align: center; padding: 2rem 0;"
      >
        {t().tools.httpStatus.noResults.replace("{query}", query)}
      </p>
    {/if}
  </div>
</ToolLayout>
