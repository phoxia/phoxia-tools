<script lang="ts">
  import Lux from "$lib/components/Lux.svelte";
  import { statusToLux, statusToColor, type FieldStatus } from "./field-status";

  type Status = FieldStatus;

  let {
    value = $bindable(""),
    id,
    label,
    placeholder = "",
    maxlength,
    type = "text",
    required = false,
    disabled = false,
    status = "idle",
    hint,
    showMascot = false,
  }: {
    value?: string;
    id: string;
    label: string;
    placeholder?: string;
    maxlength?: number;
    type?: "text" | "password";
    required?: boolean;
    disabled?: boolean;
    status?: Status;
    hint?: string;
    showMascot?: boolean;
  } = $props();

  const luxState = $derived(statusToLux(status));
  const borderColor = $derived(statusToColor(status));
</script>

<div class="field">
  <label for={id} class="field-label">{label}</label>
  <input
    {id}
    {type}
    bind:value
    {placeholder}
    {maxlength}
    {required}
    {disabled}
    aria-invalid={status === "error"}
    aria-describedby={hint ? `${id}-hint` : undefined}
    class="field-input"
    style="border-color: {borderColor};"
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
    gap: 0.375rem;
  }

  .field-label {
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }

  .field-input {
    width: 100%;
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
    font-size: 0.8rem;
    margin: 0;
    font-family: var(--font-mono);
  }
</style>
