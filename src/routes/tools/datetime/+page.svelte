<script lang="ts">
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { copyToClipboard } from "$lib/clipboard.svelte";
  import { trackToolUsed } from "$lib/analytics/analytics";
  import {
    parseTimestamp,
    nowTimestamp,
    parseCron,
    nextCronExecutions,
    diffDates,
    addToDate,
    sumHours,
    computeCountdown,
  } from "./logic";
  import type { DateTimeMode, ParseResult, DateDiffResult, CountdownState } from "./logic";

  const tabs: { id: DateTimeMode; label: string }[] = $derived.by(() => [
    { id: "timestamp" as DateTimeMode, label: t().tools.datetime.tabs.timestamp },
    { id: "cron" as DateTimeMode, label: t().tools.datetime.tabs.cron },
    { id: "diff" as DateTimeMode, label: t().tools.datetime.tabs.diff },
    { id: "math" as DateTimeMode, label: t().tools.datetime.tabs.math },
    { id: "hours" as DateTimeMode, label: t().tools.datetime.tabs.hours },
    { id: "countdown" as DateTimeMode, label: t().tools.datetime.tabs.countdown },
  ]);

  let activeTab = $state<DateTimeMode>("timestamp");

  // Timestamp state
  let tsInput = $state("");
  let tsResult = $state<ParseResult | null>(null);

  // Cron state
  let cronInput = $state("* * * * *");
  let cronNext = $state<Date[]>([]);
  let cronError = $state("");

  // Diff state
  let diffFrom = $state("");
  let diffTo = $state("");
  let diffResult = $state<DateDiffResult | null>(null);
  let diffError = $state("");

  // Math state
  let mathDate = $state("");
  let mathDays = $state(0);
  let mathMonths = $state(0);
  let mathYears = $state(0);
  let mathResult = $state("");

  // Hours state
  let hoursEntries = $state("8:00");
  let hoursResult = $state("");
  let hoursError = $state("");

  // Countdown state
  let cdTarget = $state("");
  let cdTitle = $state("");
  let cdState = $state<CountdownState | null>(null);
  let cdLink = $state("");
  let cdInterval: ReturnType<typeof setInterval> | null = null;

  // --- Actions ---

  function tsParse() {
    tsResult = parseTimestamp(tsInput || String(nowTimestamp()));
    if (!("error" in tsResult)) trackToolUsed("datetime");
  }
  function tsUseNow() {
    tsInput = String(nowTimestamp());
    tsParse();
  }
  function tsClear() {
    tsInput = "";
    tsResult = null;
  }

  function cronParse() {
    cronError = "";
    const r = parseCron(cronInput);
    if (r.error) {
      cronError = r.error;
      cronNext = [];
    } else {
      cronNext = nextCronExecutions(cronInput, 5);
      trackToolUsed("datetime");
    }
  }
  function cronQuick(expr: string) {
    cronInput = expr;
    cronParse();
  }

  function diffCalc() {
    diffError = "";
    const r = diffDates(diffFrom, diffTo);
    if ("error" in r) {
      diffError = r.error;
      diffResult = null;
    } else {
      diffResult = r;
      trackToolUsed("datetime");
    }
  }

  function mathCalc() {
    const r = addToDate(mathDate, mathDays, mathMonths, mathYears);
    if (typeof r === "string") {
      mathResult = r;
      trackToolUsed("datetime");
    } else {
      mathResult = "";
    }
  }

  function hoursCalc() {
    hoursError = "";
    const lines = hoursEntries.split("\n").filter((l) => l.trim());
    const r = sumHours(lines);
    if (!r.ok) {
      hoursError = r.error;
      hoursResult = "";
    } else {
      hoursResult = r.total;
      trackToolUsed("datetime");
    }
  }

  function cdSetup() {
    if (cdInterval) clearInterval(cdInterval);
    if (!cdTarget) return;
    cdLink = `${window.location.origin}/tools/datetime?tab=countdown&to=${encodeURIComponent(cdTarget)}&title=${encodeURIComponent(cdTitle)}`;
    cdInterval = setInterval(() => {
      cdState = computeCountdown(cdTarget);
      if (cdState.done && cdInterval) {
        clearInterval(cdInterval);
        cdInterval = null;
      }
    }, 1000);
    cdState = computeCountdown(cdTarget);
  }

  $effect(() => {
    // Parse URL params for countdown share link
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "countdown") {
        activeTab = "countdown";
        cdTarget = params.get("to") ?? "";
        cdTitle = params.get("title") ?? "";
        if (cdTarget) cdSetup();
      }
    }
    return () => {
      if (cdInterval) clearInterval(cdInterval);
    };
  });

  function clearTab() {
    tsInput = "";
    tsResult = null;
    cronInput = "* * * * *";
    cronNext = [];
    cronError = "";
    diffFrom = "";
    diffTo = "";
    diffResult = null;
    diffError = "";
    mathDate = "";
    mathDays = 0;
    mathMonths = 0;
    mathYears = 0;
    mathResult = "";
    hoursEntries = "8:00";
    hoursResult = "";
    hoursError = "";
    cdTarget = "";
    cdTitle = "";
    cdState = null;
    cdLink = "";
    if (cdInterval) {
      clearInterval(cdInterval);
      cdInterval = null;
    }
  }

  let copiedId = $state("");
  async function copy(value: string, id: string) {
    const ok = await copyToClipboard(value, t().common.copied);
    copiedId = ok ? id : "";
    if (ok) setTimeout(() => (copiedId = ""), 1500);
  }

  const tabStyle = (id: DateTimeMode) =>
    `padding: 0.375rem 0.625rem; font-size: 0.75rem; border-radius: var(--radius); cursor: pointer; white-space: nowrap;
		border: 1px solid ${activeTab === id ? "var(--color-accent)" : "var(--color-border)"};
		background: ${activeTab === id ? "color-mix(in srgb, var(--color-accent) 10%, transparent)" : "transparent"};
		color: ${activeTab === id ? "var(--color-accent)" : "var(--color-text-muted)"};
		font-weight: ${activeTab === id ? 600 : 400};`;

  const inputStyle =
    "width: 100%; padding: 0.5rem 0.75rem; box-sizing: border-box; font-family: var(--font-mono); font-size: 0.875rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text);";

  const resultRow = (label: string, value: string) => `
		display: flex; align-items: center; gap: 0.75rem;
		background: var(--color-surface); border: 1px solid var(--color-border);
		border-radius: var(--radius); padding: 0.5rem 0.75rem;
	`;

  function pad(n: number) {
    return String(n).padStart(2, "0");
  }

  const cronExamples = $derived.by(() => [
    { expr: "* * * * *", label: t().tools.cron.examples.everyMinute },
    { expr: "*/15 * * * *", label: t().tools.cron.examples.every15Min },
    { expr: "0 9 * * *", label: t().tools.cron.examples.dailyAt9 },
    { expr: "0 9 * * 1-5", label: t().tools.cron.examples.weekdaysAt9 },
    { expr: "0 9 * * 0", label: t().tools.cron.examples.everySunday },
    { expr: "0 0 1 * *", label: t().tools.cron.examples.firstOfMonth },
  ]);
</script>

<ToolLayout toolId="datetime" title={t().tools.datetime.name} description={t().tools.datetime.desc}>
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <!-- Tabs -->
    <div style="display: flex; gap: 0.375rem; flex-wrap: wrap;">
      {#each tabs as tab}
        <button
          onclick={() => {
            activeTab = tab.id;
            clearTab();
          }}
          style={tabStyle(tab.id)}>{tab.label}</button
        >
      {/each}
    </div>

    <!-- === TIMESTAMP === -->
    {#if activeTab === "timestamp"}
      <div>
        <label
          for="ts-input"
          style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);"
          >{t().tools.timestamp.labelInput}</label
        >
        <div style="display: flex; gap: 0.5rem;">
          <input
            id="ts-input"
            type="text"
            bind:value={tsInput}
            placeholder={t().tools.timestamp.placeholder}
            spellcheck={false}
            style="flex: 1; {inputStyle}"
          />
        </div>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button
          onclick={tsParse}
          disabled={!tsInput.trim()}
          style="background: var(--color-accent); color: #050508; border: none; border-radius: var(--radius); padding: 0.5rem 1rem; font-weight: 600; cursor: pointer; font-size: 0.875rem;"
          >{t().tools.timestamp.parse}</button
        >
        <button
          onclick={tsUseNow}
          style="background: var(--color-surface); color: var(--color-text); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
          >{t().tools.timestamp.now}</button
        >
        <button
          onclick={tsClear}
          style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
          >{t().common.clear}</button
        >
      </div>
      {#if tsResult}
        {#if "error" in tsResult}
          <p role="alert" style="color: var(--color-error); font-size: 0.875rem; margin: 0;">
            {tsResult.error}
          </p>
        {:else}
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            {#each [{ label: t().tools.timestamp.labelUnix, value: String(tsResult.unix) }, { label: t().tools.timestamp.labelUnixMs, value: String(tsResult.unixMs) }, { label: t().tools.timestamp.labelIso, value: tsResult.iso ?? "" }, { label: t().tools.timestamp.labelUtc, value: tsResult.utc ?? "" }] as row}
              <div style={resultRow(row.label, row.value)}>
                <span
                  style="font-size: 0.75rem; color: var(--color-text-faint); min-width: 80px; flex-shrink: 0;"
                  >{row.label}</span
                >
                <span
                  style="font-family: var(--font-mono); font-size: 0.85rem; flex: 1; overflow-x: auto;"
                  >{row.value}</span
                >
                <button
                  onclick={() => copy(row.value, row.label)}
                  style="background: none; border: none; color: var(--color-text-muted); cursor: pointer; padding: 0; font-size: 0.75rem; flex-shrink: 0;"
                  >{copiedId === row.label ? t().common.copied : t().common.copy}</button
                >
              </div>
            {/each}
          </div>
        {/if}
      {/if}
    {/if}

    <!-- === CRON === -->
    {#if activeTab === "cron"}
      <div>
        <label
          for="cron-input"
          style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);"
          >{t().tools.cron.labelExpression}</label
        >
        <input
          id="cron-input"
          type="text"
          bind:value={cronInput}
          placeholder={t().tools.cron.placeholder}
          style={inputStyle}
        />
      </div>
      <div style="display: flex; gap: 0.375rem; flex-wrap: wrap;">
        {#each cronExamples as ex}
          <button
            onclick={() => cronQuick(ex.expr)}
            style="padding: 0.25rem 0.5rem; font-size: 0.7rem; border: 1px solid var(--color-border); border-radius: 99px; background: transparent; color: var(--color-text-muted); cursor: pointer;"
            >{ex.label}</button
          >
        {/each}
      </div>
      <button
        onclick={cronParse}
        style="background: var(--color-accent); color: #050508; border: none; border-radius: var(--radius); padding: 0.5rem 1rem; font-weight: 600; cursor: pointer; font-size: 0.875rem; align-self: flex-start;"
        >{t().tools.timestamp.parse}</button
      >
      {#if cronError}
        <p role="alert" style="color: var(--color-error); font-size: 0.875rem; margin: 0;">
          {cronError}
        </p>
      {/if}
      {#if cronNext.length > 0}
        <div>
          <span style="font-size: 0.8rem; color: var(--color-text-muted);"
            >{t().tools.cron.nextExecutions}</span
          >
          <div style="display: flex; flex-direction: column; gap: 0.375rem; margin-top: 0.5rem;">
            {#each cronNext as d, i}
              <div style={resultRow(String(i + 1), d.toLocaleString())}>
                <span
                  style="font-size: 0.75rem; color: var(--color-text-faint); min-width: 24px; flex-shrink: 0;"
                  >{i + 1}</span
                >
                <span style="font-family: var(--font-mono); font-size: 0.85rem; flex: 1;"
                  >{d.toLocaleString()}</span
                >
              </div>
            {/each}
          </div>
        </div>
      {/if}
    {/if}

    <!-- === DIFF === -->
    {#if activeTab === "diff"}
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <input type="date" bind:value={diffFrom} style={inputStyle} />
        <span style="color: var(--color-text-muted);">—</span>
        <input type="date" bind:value={diffTo} style={inputStyle} />
      </div>
      <button
        onclick={diffCalc}
        disabled={!diffFrom || !diffTo}
        style="background: var(--color-accent); color: #050508; border: none; border-radius: var(--radius); padding: 0.5rem 1rem; font-weight: 600; cursor: pointer; font-size: 0.875rem; align-self: flex-start;"
        >{t().common.parse}</button
      >
      {#if diffError}
        <p role="alert" style="color: var(--color-error); font-size: 0.875rem; margin: 0;">
          {diffError}
        </p>
      {/if}
      {#if diffResult}
        {@const items = [
          { label: t().tools.datetime.diff.years, value: diffResult.years },
          { label: t().tools.datetime.diff.months, value: diffResult.months },
          { label: t().tools.datetime.diff.days, value: diffResult.days },
          { label: t().tools.datetime.diff.totalDays, value: diffResult.totalDays },
        ]}
        <div
          style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.5rem;"
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
    {/if}

    <!-- === MATH === -->
    {#if activeTab === "math"}
      <div>
        <label
          for="math-date"
          style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);"
          >{t().tools.datetime.math.label}</label
        >
        <input id="math-date" type="date" bind:value={mathDate} style={inputStyle} />
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        {#each [{ k: "days" as const, v: mathDays }, { k: "months" as const, v: mathMonths }, { k: "years" as const, v: mathYears }] as field}
          <label
            style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.75rem; color: var(--color-text-muted);"
          >
            {t().tools.datetime.math[field.k]}
            <input
              type="number"
              value={field.v}
              oninput={(e) => {
                const v = parseInt(e.currentTarget.value) || 0;
                if (field.k === "days") mathDays = v;
                else if (field.k === "months") mathMonths = v;
                else mathYears = v;
              }}
              style="width: 80px; {inputStyle}"
            />
          </label>
        {/each}
      </div>
      <button
        onclick={mathCalc}
        disabled={!mathDate}
        style="background: var(--color-accent); color: #050508; border: none; border-radius: var(--radius); padding: 0.5rem 1rem; font-weight: 600; cursor: pointer; font-size: 0.875rem; align-self: flex-start;"
        >{t().common.parse}</button
      >
      {#if mathResult}
        <div
          style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.75rem; font-family: var(--font-mono); font-size: 1.1rem; color: var(--color-accent); text-align: center;"
        >
          {mathResult}
        </div>
      {/if}
    {/if}

    <!-- === HOURS === -->
    {#if activeTab === "hours"}
      <div>
        <label
          for="hours-input"
          style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);"
          >{t().tools.datetime.hours.label}</label
        >
        <textarea
          id="hours-input"
          bind:value={hoursEntries}
          placeholder="8:30&#10;7:45&#10;1:15"
          spellcheck={false}
          rows={5}
          style="width: 100%; font-family: var(--font-mono); font-size: 0.875rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text); padding: 0.75rem; box-sizing: border-box; resize: vertical;"
        ></textarea>
      </div>
      <button
        onclick={hoursCalc}
        disabled={!hoursEntries.trim()}
        style="background: var(--color-accent); color: #050508; border: none; border-radius: var(--radius); padding: 0.5rem 1rem; font-weight: 600; cursor: pointer; font-size: 0.875rem; align-self: flex-start;"
        >{t().common.parse}</button
      >
      {#if hoursError}
        <p role="alert" style="color: var(--color-error); font-size: 0.875rem; margin: 0;">
          {hoursError}
        </p>
      {/if}
      {#if hoursResult}
        <div
          style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.75rem; display: flex; justify-content: space-between; align-items: center;"
        >
          <div>
            <span style="font-size: 0.7rem; color: var(--color-text-faint); display: block;"
              >{t().tools.datetime.hours.total}</span
            >
            <span
              style="font-family: var(--font-mono); font-size: 1.3rem; color: var(--color-accent); font-weight: 700;"
              >{hoursResult}</span
            >
          </div>
          <button
            onclick={() => copy(hoursResult, "hours")}
            style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.25rem 0.625rem; cursor: pointer; font-size: 0.75rem;"
            >{copiedId === "hours" ? t().common.copied : t().common.copy}</button
          >
        </div>
      {/if}
    {/if}

    <!-- === COUNTDOWN === -->
    {#if activeTab === "countdown"}
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <input
          type="text"
          bind:value={cdTitle}
          placeholder={t().tools.datetime.countdown.titlePlaceholder}
          style={inputStyle}
        />
        <input type="datetime-local" bind:value={cdTarget} style={inputStyle} />
      </div>
      <button
        onclick={cdSetup}
        disabled={!cdTarget}
        style="background: var(--color-accent); color: #050508; border: none; border-radius: var(--radius); padding: 0.5rem 1rem; font-weight: 600; cursor: pointer; font-size: 0.875rem; align-self: flex-start;"
        >{t().common.generate}</button
      >
      {#if cdState}
        <div
          style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 1rem; text-align: center;"
        >
          {#if cdState.done}
            <div style="font-size: 1.2rem; font-weight: 700; color: var(--color-accent);">
              {t().tools.datetime.countdown.done}
            </div>
          {:else}
            <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
              {#each [{ v: cdState.days, l: t().tools.datetime.countdown.days }, { v: cdState.hours, l: t().tools.datetime.countdown.hours }, { v: cdState.minutes, l: t().tools.datetime.countdown.minutes }, { v: cdState.seconds, l: t().tools.datetime.countdown.seconds }] as part}
                <div style="text-align: center; min-width: 60px;">
                  <div
                    style="font-size: 2rem; font-weight: 700; font-family: var(--font-mono); color: var(--color-accent);"
                  >
                    {pad(part.v)}
                  </div>
                  <div
                    style="font-size: 0.65rem; color: var(--color-text-muted); text-transform: uppercase;"
                  >
                    {part.l}
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
        {#if cdLink}
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <input readonly value={cdLink} style="flex: 1; {inputStyle}; font-size: 0.75rem;" />
            <button
              onclick={() => copy(cdLink, "cdlink")}
              style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.25rem 0.625rem; cursor: pointer; font-size: 0.75rem; white-space: nowrap;"
              >{copiedId === "cdlink" ? t().common.copied : t().common.copy}</button
            >
          </div>
        {/if}
      {/if}
    {/if}
  </div>
</ToolLayout>
