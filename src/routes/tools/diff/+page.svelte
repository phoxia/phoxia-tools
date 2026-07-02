<script lang="ts">
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { trackToolUsed } from "$lib/analytics/analytics";
  import { computeDiff } from "./logic";
  import { copyToClipboard } from "$lib/clipboard.svelte";

  let left = $state("The quick brown fox\njumps over the lazy dog\nHello World");
  let right = $state("The quick brown fox\nleaps over the lazy cat\nHello World\nGoodbye");
  let hasTrackedDiff = false;
  let copied = $state(false);

  const diff = $derived.by(() => {
    const d = computeDiff(left, right);
    if (!hasTrackedDiff && left !== right && left && right) {
      trackToolUsed("diff");
      hasTrackedDiff = true;
    }
    return d;
  });

  const stats = $derived.by(() => {
    const d = diff;
    return {
      added: d.filter((l) => l.type === "added").length,
      removed: d.filter((l) => l.type === "removed").length,
    };
  });

  async function copyDiff() {
    const text = diff
      .map((l) => {
        const prefix = l.type === "added" ? "+" : l.type === "removed" ? "-" : " ";
        return `${prefix} ${l.text}`;
      })
      .join("\n");
    copied = await copyToClipboard(text, t().common.copied);
    if (copied) setTimeout(() => (copied = false), 1500);
  }
</script>

<ToolLayout toolId="diff" title={t().tools.diff.name} description={t().tools.diff.desc}>
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <!-- Two inputs -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
      <div>
        <label
          for="diff-left"
          style="display: block; font-size: 0.8rem; margin-bottom: 0.375rem; color: var(--color-text-muted);"
          >{t().tools.diff.labelOriginal}</label
        >
        <textarea
          id="diff-left"
          bind:value={left}
          spellcheck={false}
          style="
						width: 100%; min-height: 180px; resize: vertical; box-sizing: border-box;
						font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.6;
						background: var(--color-surface); border: 1px solid var(--color-border);
						border-radius: var(--radius); color: var(--color-text); padding: 0.75rem;
					"></textarea>
      </div>
      <div>
        <label
          for="diff-right"
          style="display: block; font-size: 0.8rem; margin-bottom: 0.375rem; color: var(--color-text-muted);"
          >{t().tools.diff.labelModified}</label
        >
        <textarea
          id="diff-right"
          bind:value={right}
          spellcheck={false}
          style="
						width: 100%; min-height: 180px; resize: vertical; box-sizing: border-box;
						font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.6;
						background: var(--color-surface); border: 1px solid var(--color-border);
						border-radius: var(--radius); color: var(--color-text); padding: 0.75rem;
					"></textarea>
      </div>
    </div>

    <!-- Stats -->
    {#if left || right}
      <div style="display: flex; gap: 1rem; font-size: 0.8rem; align-items: center;">
        <span style="color: var(--color-success);"
          >{t().tools.diff.added.replace("{n}", String(stats.added))}</span
        >
        <span style="color: var(--color-error);"
          >{t().tools.diff.removed.replace("{n}", String(stats.removed))}</span
        >
        {#if stats.added === 0 && stats.removed === 0}
          <span style="color: var(--color-text-muted);">{t().tools.diff.noDifferences}</span>
        {/if}
        <button
          onclick={copyDiff}
          style="margin-left: auto; background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.25rem 0.625rem; cursor: pointer; font-size: 0.75rem;"
        >
          {copied ? t().common.copied : t().common.copy}
        </button>
      </div>
    {/if}

    <!-- Diff output -->
    {#if diff.length > 0}
      <div
        style="border: 1px solid var(--color-border); border-radius: var(--radius); overflow: hidden; font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.6;"
      >
        {#each diff as line, i (i)}
          {@const bg =
            line.type === "added"
              ? "color-mix(in srgb, var(--color-success) 10%, transparent)"
              : line.type === "removed"
                ? "color-mix(in srgb, var(--color-error) 8%, transparent)"
                : "transparent"}
          {@const color =
            line.type === "added"
              ? "var(--color-success)"
              : line.type === "removed"
                ? "var(--color-error)"
                : "var(--color-text-muted)"}
          {@const prefix = line.type === "added" ? "+" : line.type === "removed" ? "−" : " "}
          <div
            style="display: flex; background: {bg}; border-bottom: {i < diff.length - 1
              ? '1px solid color-mix(in srgb, var(--color-border) 40%, transparent)'
              : 'none'};"
          >
            <!-- Left line no -->
            <span
              style="width: 2.5rem; text-align: right; padding: 0.15rem 0.5rem; color: var(--color-text-faint); user-select: none; flex-shrink: 0; border-right: 1px solid var(--color-border);"
            >
              {line.leftLine ?? ""}
            </span>
            <!-- Right line no -->
            <span
              style="width: 2.5rem; text-align: right; padding: 0.15rem 0.5rem; color: var(--color-text-faint); user-select: none; flex-shrink: 0; border-right: 1px solid var(--color-border);"
            >
              {line.rightLine ?? ""}
            </span>
            <!-- Sign -->
            <span
              style="width: 1.25rem; text-align: center; padding: 0.15rem 0; color: {color}; font-weight: 700; flex-shrink: 0; user-select: none;"
              >{prefix}</span
            >
            <!-- Content -->
            <span
              style="padding: 0.15rem 0.5rem; color: {line.type === 'equal'
                ? 'var(--color-text)'
                : color}; white-space: pre; overflow-x: auto; flex: 1;"
            >
              {line.text}
            </span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</ToolLayout>
