<script lang="ts">
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { copyToClipboard } from "$lib/clipboard.svelte";
  import { trackToolUsed } from "$lib/analytics/analytics";
  import { generatePassword, calcEntropy, charsetSize } from "./logic";

  let length = $state(20);
  let upper = $state(true);
  let lower = $state(true);
  let digits = $state(true);
  let symbols = $state(false);
  let count = $state(1);

  let passwords = $state<string[]>([]);
  let copied = $state(false);

  const entropy = $derived(calcEntropy(length, charsetSize({ upper, lower, digits, symbols })));

  const strengthKey = $derived(
    entropy < 40
      ? ("weak" as const)
      : entropy < 60
        ? ("fair" as const)
        : entropy < 80
          ? ("good" as const)
          : entropy < 100
            ? ("strong" as const)
            : ("veryStrong" as const)
  );

  const entropyColor = $derived(
    entropy < 40
      ? "var(--color-error)"
      : entropy < 60
        ? "var(--color-warning)"
        : entropy < 80
          ? "#eab308"
          : "var(--color-success)"
  );

  function generate() {
    passwords = Array.from({ length: count }, () =>
      generatePassword({ length, upper, lower, digits, symbols })
    );
  }

  function generateAndTrack() {
    generate();
    trackToolUsed("password");
  }

  async function copy() {
    copied = await copyToClipboard(passwords.join("\n"), t().common.copied);
    if (copied) setTimeout(() => (copied = false), 1500);
  }

  // generate on mount
  $effect(() => {
    generate();
  });
</script>

<ToolLayout toolId="password" title={t().tools.password.name} description={t().tools.password.desc}>
  <div style="display: flex; flex-direction: column; gap: 1.25rem;">
    <!-- Options -->
    <div
      style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.875rem;"
    >
      <label
        style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; color: var(--color-text-muted);"
      >
        {t().tools.password.labelLength}:
        <strong style="color: var(--color-text);">{length}</strong>
        <input
          type="range"
          min="8"
          max="128"
          bind:value={length}
          oninput={generate}
          style="accent-color: var(--color-accent);"
        />
      </label>
      <label
        style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; color: var(--color-text-muted);"
      >
        {t().tools.password.labelCount}: <strong style="color: var(--color-text);">{count}</strong>
        <input
          type="range"
          min="1"
          max="20"
          bind:value={count}
          oninput={generate}
          style="accent-color: var(--color-accent);"
        />
      </label>
    </div>

    <div style="display: flex; gap: 1.25rem; flex-wrap: wrap;">
      {#each [{ label: t().tools.password.labelUpper, bind: "upper" }, { label: t().tools.password.labelLower, bind: "lower" }, { label: t().tools.password.labelDigits, bind: "digits" }, { label: t().tools.password.labelSymbols, bind: "symbols" }] as opt}
        <label
          style="display: flex; align-items: center; gap: 0.375rem; font-size: 0.875rem; cursor: pointer; min-height: unset;"
        >
          <input
            type="checkbox"
            checked={opt.bind === "upper"
              ? upper
              : opt.bind === "lower"
                ? lower
                : opt.bind === "digits"
                  ? digits
                  : symbols}
            onchange={(e) => {
              const v = (e.target as HTMLInputElement).checked;
              if (opt.bind === "upper") upper = v;
              else if (opt.bind === "lower") lower = v;
              else if (opt.bind === "digits") digits = v;
              else symbols = v;
              generate();
            }}
            style="accent-color: var(--color-accent); width: 14px; height: 14px;"
          />
          <code style="font-family: var(--font-mono); font-size: 0.8rem;">{opt.label}</code>
        </label>
      {/each}
    </div>

    <!-- Entropy meter -->
    <div>
      <div
        style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--color-text-muted); margin-bottom: 0.25rem;"
      >
        <span>{t().tools.password.entropy}</span>
        <span style="color: {entropyColor}; font-weight: 600;"
          >{t().tools.password.strength[strengthKey]} · {Math.round(entropy)}
          {t().tools.password.bits}</span
        >
      </div>
      <div
        style="height: 4px; background: var(--color-border); border-radius: 2px; overflow: hidden;"
      >
        <div
          style="height: 100%; width: {Math.min(
            100,
            (entropy / 128) * 100
          )}%; background: {entropyColor}; border-radius: 2px; transition: width 0.2s, background 0.2s;"
        ></div>
      </div>
    </div>

    <!-- Actions -->
    <div style="display: flex; gap: 0.5rem;">
      <button
        onclick={generateAndTrack}
        style="background: var(--color-accent); color: #050508; border: none; border-radius: var(--radius); padding: 0.5rem 1rem; font-weight: 600; cursor: pointer; font-size: 0.875rem;"
      >
        {t().common.generate}
      </button>
      <button
        onclick={copy}
        disabled={passwords.length === 0}
        style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text); padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
      >
        {copied ? t().common.copied : t().common.copy}
      </button>
    </div>

    <!-- Output -->
    {#if passwords.length > 0}
      <div
        style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.875rem; display: flex; flex-direction: column; gap: 0.375rem;"
      >
        {#each passwords as pw}
          <code
            style="font-family: var(--font-mono); font-size: 0.9rem; letter-spacing: 0.03em; color: var(--color-text); word-break: break-all;"
          >
            {pw}
          </code>
        {/each}
      </div>
    {/if}
  </div>
</ToolLayout>
