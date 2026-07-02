<script lang="ts">
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { copyToClipboard } from "$lib/clipboard.svelte";
  import { trackToolUsed } from "$lib/analytics/analytics";
  import {
    toCase,
    toSlug,
    countText,
    reverseText,
    sortLines,
    dedupeLines,
    findReplace,
    addAffix,
  } from "./logic";
  import type { TextMode, CaseMode } from "./logic";

  const tabs: { id: TextMode; icon: string }[] = [
    { id: "case", icon: "Aa" },
    { id: "slug", icon: "~" },
    { id: "counter", icon: "#" },
    { id: "reverse", icon: "←→" },
    { id: "sort", icon: "↓↑" },
    { id: "dedupe", icon: "⊜" },
    { id: "find", icon: "?" },
    { id: "affix", icon: "«»" },
  ];

  let activeTab = $state<TextMode>("case");

  const caseModes = $derived.by(() => {
    const labels = t().tools.case.labels;
    const examples = t().tools.case.examples;
    return [
      { id: "camel" as CaseMode, label: labels.camel, example: examples.camel },
      { id: "pascal" as CaseMode, label: labels.pascal, example: examples.pascal },
      { id: "snake" as CaseMode, label: labels.snake, example: examples.snake },
      {
        id: "screaming" as CaseMode,
        label: labels.screamingSnake,
        example: examples.screamingSnake,
      },
      { id: "kebab" as CaseMode, label: labels.kebab, example: examples.kebab },
      { id: "upper" as CaseMode, label: labels.upper, example: examples.upper },
      { id: "lower" as CaseMode, label: labels.lower, example: examples.lower },
    ];
  });

  let input = $state("");
  let slugSeparator = $state<"-" | "_">("-");
  let sortAsc = $state(true);
  let sortCaseInsensitive = $state(true);
  let findSearch = $state("");
  let findReplaceWith = $state("");
  let findUseRegex = $state(false);
  let affixPrefix = $state("");
  let affixSuffix = $state("");

  // Derived outputs
  const caseResults = $derived.by(() =>
    input.trim() ? caseModes.map((m) => ({ ...m, output: toCase(input, m.id) })) : []
  );

  const slugOutput = $derived(input.trim() ? toSlug(input, slugSeparator) : "");

  const counterResult = $derived(countText(input));

  const reverseOutput = $derived(input ? reverseText(input) : "");

  const sortOutput = $derived(input.trim() ? sortLines(input, sortAsc, sortCaseInsensitive) : "");

  const dedupeResult = $derived.by(() => {
    if (!input.trim()) return { output: "", removed: 0 };
    return dedupeLines(input);
  });

  const findResult = $derived.by(() => {
    if (!input.trim() || !findSearch) return { output: "", count: 0 };
    return findReplace(input, findSearch, findReplaceWith, findUseRegex);
  });

  const affixOutput = $derived(
    input && (affixPrefix || affixSuffix) ? addAffix(input, affixPrefix, affixSuffix) : input
  );

  // Copy state
  let copiedId = $state("");
  async function copy(value: string, id: string) {
    if (input.trim()) trackToolUsed("text");
    const ok = await copyToClipboard(value, t().common.copied);
    copiedId = ok ? id : "";
    if (ok) setTimeout(() => (copiedId = ""), 1500);
  }

  // Style helpers
  const tabStyle = (id: TextMode) =>
    `padding: 0.375rem 0.625rem; font-size: 0.75rem; border-radius: var(--radius); cursor: pointer; white-space: nowrap;
		border: 1px solid ${activeTab === id ? "var(--color-accent)" : "var(--color-border)"};
		background: ${activeTab === id ? "color-mix(in srgb, var(--color-accent) 10%, transparent)" : "transparent"};
		color: ${activeTab === id ? "var(--color-accent)" : "var(--color-text-muted)"};
		font-weight: ${activeTab === id ? 600 : 400};`;

  const inputStyle =
    "width: 100%; font-size: 0.875rem; font-family: var(--font-mono); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text); padding: 0.5rem 0.75rem; box-sizing: border-box;";

  const textareaStyle =
    "width: 100%; min-height: 140px; resize: vertical; font-family: var(--font-mono); font-size: 0.85rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text); padding: 0.75rem; box-sizing: border-box;";
</script>

<ToolLayout toolId="text" title={t().tools.text.name} description={t().tools.text.desc}>
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <!-- Tabs -->
    <div style="display: flex; gap: 0.375rem; flex-wrap: wrap;">
      {#each tabs as tab}
        <button onclick={() => (activeTab = tab.id)} style={tabStyle(tab.id)}>
          {tab.icon}
          {t().tools.text.tabs[tab.id]}
        </button>
      {/each}
    </div>

    <!-- Input area (shared, but tweaked per tab) -->
    <div>
      <label
        for="text-input"
        style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);"
      >
        {t().common.inputPlaceholder}
      </label>
      {#if activeTab === "counter" || activeTab === "reverse" || activeTab === "sort" || activeTab === "dedupe" || activeTab === "find" || activeTab === "affix"}
        <textarea
          id="text-input"
          bind:value={input}
          placeholder={t().tools.text.placeholder}
          spellcheck={false}
          style={textareaStyle}></textarea>
      {:else}
        <input
          id="text-input"
          type="text"
          bind:value={input}
          placeholder={t().tools.text.placeholder}
          spellcheck={false}
          style={inputStyle}
        />
      {/if}
    </div>

    <!-- === CASE === -->
    {#if activeTab === "case" && caseResults.length > 0}
      <div style="display: flex; flex-direction: column; gap: 0.375rem;">
        {#each caseResults as row}
          <div
            style="display: flex; align-items: center; gap: 0.75rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.5rem 0.75rem;"
          >
            <span
              style="font-size: 0.75rem; color: var(--color-text-faint); min-width: 130px; flex-shrink: 0;"
              >{row.label}</span
            >
            <span
              style="font-family: var(--font-mono); font-size: 0.875rem; flex: 1; overflow-x: auto;"
              >{row.output}</span
            >
            <button
              onclick={() => copy(row.output, row.id)}
              style="background: none; border: none; color: var(--color-text-muted); cursor: pointer; padding: 0; font-size: 0.75rem; flex-shrink: 0;"
            >
              {copiedId === row.id ? t().common.copied : t().common.copy}
            </button>
          </div>
        {/each}
      </div>
    {/if}

    <!-- === SLUG === -->
    {#if activeTab === "slug"}
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <span style="font-size: 0.8rem; color: var(--color-text-muted);"
          >{t().tools.slug.labelSeparator}</span
        >
        {#each ["-", "_"] as sep}
          <button
            onclick={() => (slugSeparator = sep as "-" | "_")}
            style="
						padding: 0.25rem 0.75rem; border-radius: 99px; font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer;
						border: 1px solid {slugSeparator === sep ? 'var(--color-accent)' : 'var(--color-border)'};
						background: {slugSeparator === sep
              ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)'
              : 'transparent'};
						color: {slugSeparator === sep ? 'var(--color-accent)' : 'var(--color-text-muted)'};
					">{sep}</button
          >
        {/each}
      </div>
      {#if slugOutput}
        <div
          style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); overflow: hidden;"
        >
          <div
            style="display: flex; justify-content: space-between; align-items: center; padding: 0.375rem 0.875rem; border-bottom: 1px solid var(--color-border);"
          >
            <span
              style="font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-text-faint);"
              >{t().tools.slug.labelSlug}</span
            >
            <button
              onclick={() => copy(slugOutput, "slug")}
              style="background: none; border: none; color: var(--color-text-muted); cursor: pointer; font-size: 0.75rem; padding: 0;"
            >
              {copiedId === "slug" ? t().common.copied : t().common.copy}
            </button>
          </div>
          <code
            style="display: block; padding: 0.875rem; font-family: var(--font-mono); font-size: 0.9rem; color: var(--color-text); word-break: break-all; line-height: 1.5;"
          >
            {slugOutput}
          </code>
        </div>
      {/if}
    {/if}

    <!-- === COUNTER === -->
    {#if activeTab === "counter" && input.length > 0}
      {@const items = [
        { label: t().tools.text.counter.chars, value: counterResult.chars },
        { label: t().tools.text.counter.charsNoSpaces, value: counterResult.charsNoSpaces },
        { label: t().tools.text.counter.words, value: counterResult.words },
        { label: t().tools.text.counter.lines, value: counterResult.lines },
        { label: t().tools.text.counter.paragraphs, value: counterResult.paragraphs },
      ]}
      <div
        style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.5rem;"
      >
        {#each items as item}
          <div
            style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.75rem; text-align: center;"
          >
            <div
              style="font-size: 1.5rem; font-weight: 700; font-family: var(--font-mono); color: var(--color-accent);"
            >
              {item.value.toLocaleString()}
            </div>
            <div style="font-size: 0.7rem; color: var(--color-text-muted); margin-top: 0.25rem;">
              {item.label}
            </div>
          </div>
        {/each}
      </div>
    {/if}

    <!-- === REVERSE === -->
    {#if activeTab === "reverse" && reverseOutput}
      {@const rid = "reverse"}
      <div>
        <div
          style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.375rem;"
        >
          <span style="font-size: 0.85rem; color: var(--color-text-muted);"
            >{t().common.outputPlaceholder}</span
          >
          <button
            onclick={() => copy(reverseOutput, rid)}
            style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.25rem 0.625rem; cursor: pointer; font-size: 0.75rem;"
          >
            {copiedId === rid ? t().common.copied : t().common.copy}
          </button>
        </div>
        <textarea readonly value={reverseOutput} spellcheck={false} style={textareaStyle}
        ></textarea>
      </div>
    {/if}

    <!-- === SORT === -->
    {#if activeTab === "sort"}
      <div style="display: flex; gap: 1rem; align-items: center;">
        <label
          style="display: flex; align-items: center; gap: 0.375rem; font-size: 0.8rem; color: var(--color-text-muted); cursor: pointer;"
        >
          <input type="checkbox" bind:checked={sortAsc} />
          {t().tools.text.sort.ascending}
        </label>
        <label
          style="display: flex; align-items: center; gap: 0.375rem; font-size: 0.8rem; color: var(--color-text-muted); cursor: pointer;"
        >
          <input type="checkbox" bind:checked={sortCaseInsensitive} />
          {t().tools.text.sort.caseInsensitive}
        </label>
      </div>
      {#if sortOutput}
        {@const sid = "sort"}
        <div>
          <div
            style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.375rem;"
          >
            <span style="font-size: 0.85rem; color: var(--color-text-muted);"
              >{t().common.outputPlaceholder}</span
            >
            <button
              onclick={() => copy(sortOutput, sid)}
              style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.25rem 0.625rem; cursor: pointer; font-size: 0.75rem;"
            >
              {copiedId === sid ? t().common.copied : t().common.copy}
            </button>
          </div>
          <textarea readonly value={sortOutput} spellcheck={false} style={textareaStyle}></textarea>
        </div>
      {/if}
    {/if}

    <!-- === DEDUPE === -->
    {#if activeTab === "dedupe" && dedupeResult.output}
      {@const did = "dedupe"}
      <div>
        {#if dedupeResult.removed > 0}
          <p style="font-size: 0.8rem; color: var(--color-text-muted); margin: 0 0 0.5rem 0;">
            {t().tools.text.dedupe.removed.replace("{n}", String(dedupeResult.removed))}
          </p>
        {/if}
        <div
          style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.375rem;"
        >
          <span style="font-size: 0.85rem; color: var(--color-text-muted);"
            >{t().common.outputPlaceholder}</span
          >
          <button
            onclick={() => copy(dedupeResult.output, did)}
            style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.25rem 0.625rem; cursor: pointer; font-size: 0.75rem;"
          >
            {copiedId === did ? t().common.copied : t().common.copy}
          </button>
        </div>
        <textarea readonly value={dedupeResult.output} spellcheck={false} style={textareaStyle}
        ></textarea>
      </div>
    {/if}

    <!-- === FIND & REPLACE === -->
    {#if activeTab === "find"}
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <div style="display: flex; gap: 0.5rem;">
          <input
            type="text"
            bind:value={findSearch}
            placeholder={t().tools.text.find.searchPlaceholder}
            style="flex: 1; {inputStyle}"
          />
          <input
            type="text"
            bind:value={findReplaceWith}
            placeholder={t().tools.text.find.replacePlaceholder}
            style="flex: 1; {inputStyle}"
          />
        </div>
        <label
          style="display: flex; align-items: center; gap: 0.375rem; font-size: 0.8rem; color: var(--color-text-muted); cursor: pointer;"
        >
          <input type="checkbox" bind:checked={findUseRegex} />
          {t().tools.text.find.regex}
        </label>
        {#if findSearch && findResult.count > 0}
          <p style="font-size: 0.8rem; color: var(--color-text-muted); margin: 0;">
            {t().tools.text.find.matches.replace("{n}", String(findResult.count))}
          </p>
        {/if}
        {#if findResult.output !== input && findSearch}
          {@const fid = "find"}
          <div>
            <div
              style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.375rem;"
            >
              <span style="font-size: 0.85rem; color: var(--color-text-muted);"
                >{t().common.outputPlaceholder}</span
              >
              <button
                onclick={() => copy(findResult.output, fid)}
                style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.25rem 0.625rem; cursor: pointer; font-size: 0.75rem;"
              >
                {copiedId === fid ? t().common.copied : t().common.copy}
              </button>
            </div>
            <textarea readonly value={findResult.output} spellcheck={false} style={textareaStyle}
            ></textarea>
          </div>
        {/if}
      </div>
    {/if}

    <!-- === AFFIX === -->
    {#if activeTab === "affix"}
      <div style="display: flex; gap: 0.5rem;">
        <input
          type="text"
          bind:value={affixPrefix}
          placeholder={t().tools.text.affix.prefixPlaceholder}
          style="flex: 1; {inputStyle}"
        />
        <input
          type="text"
          bind:value={affixSuffix}
          placeholder={t().tools.text.affix.suffixPlaceholder}
          style="flex: 1; {inputStyle}"
        />
      </div>
      {#if input && (affixPrefix || affixSuffix)}
        {@const aid = "affix"}
        <div>
          <div
            style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.375rem;"
          >
            <span style="font-size: 0.85rem; color: var(--color-text-muted);"
              >{t().common.outputPlaceholder}</span
            >
            <button
              onclick={() => copy(affixOutput, aid)}
              style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.25rem 0.625rem; cursor: pointer; font-size: 0.75rem;"
            >
              {copiedId === aid ? t().common.copied : t().common.copy}
            </button>
          </div>
          <textarea readonly value={affixOutput} spellcheck={false} style={textareaStyle}
          ></textarea>
        </div>
      {/if}
    {/if}
  </div>
</ToolLayout>
