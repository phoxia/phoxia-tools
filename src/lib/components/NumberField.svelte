<script lang="ts">
  import Lux from "$lib/components/Lux.svelte";
  import { isAllowedChars, exceedsMax, clampNumber } from "./number-field-logic";
  import { statusToLux, statusToColor, type FieldStatus } from "./field-status";

  type Status = FieldStatus;

  let {
    value = $bindable(0),
    id,
    label,
    min,
    max,
    integerOnly = true,
    status = "idle",
    hint,
    showMascot = false,
    width,
  }: {
    value?: number;
    id: string;
    label: string;
    min?: number;
    max?: number;
    integerOnly?: boolean;
    status?: Status;
    hint?: string;
    showMascot?: boolean;
    width?: string;
  } = $props();

  // Writable $derived: primarily mirrors `value`, but stays directly
  // assignable so bind:value + oninput/onblur below can hold intermediate
  // typed states (e.g. "-", "07") that aren't valid parsed numbers yet.
  // Recomputes fresh from `value` whenever `value` itself changes.
  let raw = $derived(String(value));

  const luxState = $derived(statusToLux(status));
  const borderColor = $derived(statusToColor(status));

  function onbeforeinput(e: InputEvent) {
    const el = e.target as HTMLInputElement;
    if (e.data == null) return;
    const start = el.selectionStart ?? raw.length;
    const end = el.selectionEnd ?? raw.length;
    const prospective = raw.slice(0, start) + e.data + raw.slice(end);
    if (!isAllowedChars(prospective, integerOnly)) {
      e.preventDefault();
      return;
    }
    if (exceedsMax(prospective, max)) {
      e.preventDefault();
    }
  }

  function oninput() {
    // Number("") is 0, not NaN — skip mid-edit empty/bare-minus states so the
    // value-sync effect doesn't snap the field back to "0" while clearing it.
    if (raw === "" || raw === "-") return;
    const n = Number(raw);
    if (!Number.isNaN(n)) value = n;
  }

  function onblur() {
    const n = Number(raw);
    value = Number.isNaN(n) ? (min ?? 0) : clampNumber(n, min, max, integerOnly);
    raw = String(value);
  }
</script>

<div class="field">
  <label for={id} class="field-label">{label}</label>
  <input
    {id}
    type="text"
    inputmode={integerOnly ? "numeric" : "decimal"}
    bind:value={raw}
    {onbeforeinput}
    {oninput}
    {onblur}
    aria-invalid={status === "error"}
    aria-describedby={hint ? `${id}-hint` : undefined}
    class="field-input"
    style="border-color: {borderColor}; {width ? `width: ${width};` : ''}"
  />
  {#if hint}
    <div class="field-hint-row">
      {#if showMascot && status !== "idle"}
        <Lux state={luxState} size={20} float={false} label="" />
      {/if}
      <p
        id="{id}-hint"
        role={status === "error" ? "alert" : undefined}
        class="field-hint"
        style="color: {borderColor};"
      >
        {hint}
      </p>
    </div>
  {/if}
</div>

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .field-label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .field-input {
    box-sizing: border-box;
    padding: 0.5rem 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    color: var(--color-text);
    transition: border-color 0.15s;
  }

  .field-hint-row {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .field-hint {
    font-size: 0.75rem;
    margin: 0;
    font-family: var(--font-mono);
  }
</style>
