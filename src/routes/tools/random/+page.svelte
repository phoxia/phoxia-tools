<script lang="ts">
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import NumberField from "$lib/components/NumberField.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { copyToClipboard } from "$lib/clipboard.svelte";
  import { trackToolUsed } from "$lib/analytics/analytics";
  import { pickOne, shuffle, generateNumbers, rollDice, DICE_FACES } from "./logic";
  import type { RandomMode } from "./logic";

  const tabs: { id: RandomMode; label: string }[] = $derived.by(() => [
    { id: "picker" as RandomMode, label: t().tools.random.tabs.picker },
    { id: "shuffle" as RandomMode, label: t().tools.random.tabs.shuffle },
    { id: "numbers" as RandomMode, label: t().tools.random.tabs.numbers },
    { id: "dice" as RandomMode, label: t().tools.random.tabs.dice },
  ]);

  let activeTab = $state<RandomMode>("picker");

  // Shared
  let listInput = $state("");

  // Numbers state
  let numMin = $state(1);
  let numMax = $state(100);
  let numCount = $state(5);
  let numUnique = $state(true);

  // Dice state
  let diceFaces = $state(6);
  let diceQty = $state(2);

  let output = $state("");
  let error = $state("");
  let resultList = $state<string[]>([]);
  let diceResults = $state<number[]>([]);

  function pickerRun() {
    error = "";
    const items = listInput.split("\n").filter((l) => l.trim());
    const picked = pickOne(items);
    if (picked === null) {
      error = t().tools.random.emptyList;
      return;
    }
    output = picked;
    trackToolUsed("random");
  }

  function shuffleRun() {
    error = "";
    const items = listInput.split("\n").filter((l) => l.trim());
    if (items.length === 0) {
      error = t().tools.random.emptyList;
      return;
    }
    resultList = shuffle(items);
    trackToolUsed("random");
  }

  function numbersRun() {
    error = "";
    resultList = [];
    const r = generateNumbers(numMin, numMax, numCount, numUnique);
    if (Array.isArray(r)) {
      resultList = r.map(String);
      trackToolUsed("random");
    } else {
      error = r.error;
    }
  }

  function diceRun() {
    diceResults = rollDice(diceFaces, diceQty);
    trackToolUsed("random");
  }

  function clearTab() {
    listInput = "";
    numMin = 1;
    numMax = 100;
    numCount = 5;
    numUnique = true;
    diceFaces = 6;
    diceQty = 2;
    output = "";
    error = "";
    resultList = [];
    diceResults = [];
  }

  let copiedId = $state("");
  async function copy(value: string, id: string) {
    const ok = await copyToClipboard(value, t().common.copied);
    copiedId = ok ? id : "";
    if (ok) setTimeout(() => (copiedId = ""), 1500);
  }

  const tabStyle = (id: RandomMode) =>
    `padding: 0.375rem 0.625rem; font-size: 0.75rem; border-radius: var(--radius); cursor: pointer; white-space: nowrap;
		border: 1px solid ${activeTab === id ? "var(--color-accent)" : "var(--color-border)"};
		background: ${activeTab === id ? "color-mix(in srgb, var(--color-accent) 10%, transparent)" : "transparent"};
		color: ${activeTab === id ? "var(--color-accent)" : "var(--color-text-muted)"};
		font-weight: ${activeTab === id ? 600 : 400};`;

  const inputStyle =
    "width: 100%; padding: 0.5rem 0.75rem; box-sizing: border-box; font-family: var(--font-mono); font-size: 0.875rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text);";

  const textareaStyle =
    "width: 100%; min-height: 120px; resize: vertical; font-family: var(--font-mono); font-size: 0.85rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text); padding: 0.75rem; box-sizing: border-box;";

  const btnPrimary =
    "align-self: flex-start; background: var(--color-accent); color: #050508; border: none; border-radius: var(--radius); padding: 0.5rem 1rem; font-weight: 600; cursor: pointer; font-size: 0.875rem;";
</script>

<ToolLayout toolId="random" title={t().tools.random.name} description={t().tools.random.desc}>
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <!-- Tabs -->
    <div style="display: flex; gap: 0.375rem; flex-wrap: wrap;">
      {#each tabs as tab (tab.id)}
        <button
          onclick={() => {
            activeTab = tab.id;
            clearTab();
          }}
          style={tabStyle(tab.id)}>{tab.label}</button
        >
      {/each}
    </div>

    <!-- === PICKER === -->
    {#if activeTab === "picker"}
      <div>
        <label
          for="picker-input"
          style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);"
          >{t().tools.random.listLabel}</label
        >
        <textarea
          id="picker-input"
          bind:value={listInput}
          placeholder={t().tools.random.listPlaceholder}
          spellcheck={false}
          style={textareaStyle}></textarea>
      </div>
      <button onclick={pickerRun} disabled={!listInput.trim()} style={btnPrimary}
        >{t().tools.random.pick}</button
      >
      {#if output}
        <div
          style="background: var(--color-surface); border: 1px solid var(--color-accent); border-radius: var(--radius); padding: 1.5rem; text-align: center;"
        >
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--color-accent);">
            {output}
          </div>
        </div>
      {/if}
    {/if}

    <!-- === SHUFFLE === -->
    {#if activeTab === "shuffle"}
      <div>
        <label
          for="shuffle-input"
          style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);"
          >{t().tools.random.listLabel}</label
        >
        <textarea
          id="shuffle-input"
          bind:value={listInput}
          placeholder={t().tools.random.listPlaceholder}
          spellcheck={false}
          style={textareaStyle}></textarea>
      </div>
      <button onclick={shuffleRun} disabled={!listInput.trim()} style={btnPrimary}
        >{t().tools.random.shuffleBtn}</button
      >
      {#if resultList.length > 0}
        <div>
          <div
            style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.375rem;"
          >
            <span style="font-size: 0.85rem; color: var(--color-text-muted);"
              >{t().common.outputPlaceholder}</span
            >
            <button
              onclick={() => copy(resultList.join("\n"), "shuffle")}
              style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.25rem 0.625rem; cursor: pointer; font-size: 0.75rem;"
              >{copiedId === "shuffle" ? t().common.copied : t().common.copy}</button
            >
          </div>
          <textarea readonly value={resultList.join("\n")} spellcheck={false} style={textareaStyle}
          ></textarea>
        </div>
      {/if}
    {/if}

    <!-- === NUMBERS === -->
    {#if activeTab === "numbers"}
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: flex-start;">
        <NumberField
          id="random-min"
          bind:value={numMin}
          label={t().tools.random.min}
          min={-1_000_000}
          max={1_000_000}
          width="80px"
          status="info"
        />
        <NumberField
          id="random-max"
          bind:value={numMax}
          label={t().tools.random.max}
          min={-1_000_000}
          max={1_000_000}
          width="80px"
          status="info"
        />
        <NumberField
          id="random-count"
          bind:value={numCount}
          label={t().common.count}
          min={1}
          max={1000}
          width="80px"
          status="info"
        />
        <label
          style="display: flex; align-items: center; gap: 0.375rem; font-size: 0.8rem; color: var(--color-text-muted); cursor: pointer; padding-bottom: 0.5rem;"
        >
          <input type="checkbox" bind:checked={numUnique} />
          {t().tools.random.unique}
        </label>
      </div>
      <button onclick={numbersRun} style={btnPrimary}>{t().common.generate}</button>
      {#if resultList.length > 0}
        <div style="display: flex; flex-wrap: wrap; gap: 0.375rem;">
          {#each resultList as n, i (i)}
            <span
              style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.375rem 0.75rem; font-family: var(--font-mono); font-size: 0.875rem;"
              >{n}</span
            >
          {/each}
        </div>
      {/if}
    {/if}

    <!-- === DICE === -->
    {#if activeTab === "dice"}
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: flex-start;">
        <label
          style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.75rem; color: var(--color-text-muted);"
          >{t().tools.random.diceFaces}
          <select bind:value={diceFaces} style={inputStyle}>
            {#each DICE_FACES as f (f)}
              <option value={f}>d{f}</option>
            {/each}
          </select>
        </label>
        <NumberField
          id="random-dice-qty"
          bind:value={diceQty}
          label={t().tools.random.diceQty}
          min={1}
          max={100}
          width="80px"
          status="info"
        />
      </div>
      <button onclick={diceRun} style={btnPrimary}>{t().tools.random.roll}</button>
      {#if diceResults.length > 0}
        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <div style="display: flex; flex-wrap: wrap; gap: 0.375rem;">
            {#each diceResults as v, i (i)}
              <span
                style="background: var(--color-accent); color: #050508; border-radius: var(--radius); width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 1.1rem; font-weight: 700;"
                >{v}</span
              >
            {/each}
          </div>
          {#if diceResults.length > 1}
            <div
              style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.5rem 0.75rem;"
            >
              <span style="font-size: 0.7rem; color: var(--color-text-muted);">Sum</span>
              <span
                style="font-family: var(--font-mono); font-size: 1rem; font-weight: 700; color: var(--color-accent); margin-left: 0.5rem;"
                >{diceResults.reduce((a, b) => a + b, 0)}</span
              >
            </div>
          {/if}
        </div>
      {/if}
    {/if}

    {#if error}
      <p role="alert" style="color: var(--color-error); font-size: 0.875rem; margin: 0;">{error}</p>
    {/if}
  </div>
</ToolLayout>
