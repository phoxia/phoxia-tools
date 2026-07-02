<script lang="ts">
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import TextField from "$lib/components/TextField.svelte";
  import TextAreaField from "$lib/components/TextAreaField.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { copyToClipboard } from "$lib/clipboard.svelte";
  import { trackToolUsed } from "$lib/analytics/analytics";
  import { encrypt, decrypt } from "./logic";

  let plaintext = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  let ciphertext = $state("");
  let output = $state("");
  let error = $state("");
  let loading = $state(false);

  const passwordMismatch = $derived(error === t().tools.cipher.passwordMismatch);

  async function runEncrypt() {
    if (password !== confirmPassword) {
      error = t().tools.cipher.passwordMismatch;
      return;
    }
    error = "";
    loading = true;
    try {
      ciphertext = await encrypt(plaintext, password);
      output = "";
      trackToolUsed("cipher");
    } catch (e) {
      error = `${t().common.error}: ${(e as Error).message}`;
    } finally {
      loading = false;
    }
  }

  async function runDecrypt() {
    error = "";
    loading = true;
    try {
      const r = await decrypt(ciphertext, password);
      if (!r.ok) {
        error = r.error;
        output = "";
      } else {
        output = r.value;
        plaintext = "";
        trackToolUsed("cipher");
      }
    } catch (e) {
      error = `${t().common.error}: ${(e as Error).message}`;
    } finally {
      loading = false;
    }
  }

  function clear() {
    plaintext = "";
    password = "";
    confirmPassword = "";
    ciphertext = "";
    output = "";
    error = "";
  }

  let copiedId = $state("");
  async function copy(value: string, id: string) {
    const ok = await copyToClipboard(value, t().common.copied);
    copiedId = ok ? id : "";
    if (ok) setTimeout(() => (copiedId = ""), 1500);
  }

  const textareaStyle =
    "width: 100%; min-height: 120px; resize: vertical; font-family: var(--font-mono); font-size: 0.85rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text); padding: 0.75rem; box-sizing: border-box;";
</script>

<ToolLayout toolId="cipher" title={t().tools.cipher.name} description={t().tools.cipher.desc}>
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 200px;">
        <TextField
          id="cipher-pass"
          type="password"
          bind:value={password}
          label={t().tools.cipher.password}
        />
      </div>
      <div style="flex: 1; min-width: 200px;">
        <TextField
          id="cipher-confirm"
          type="password"
          bind:value={confirmPassword}
          label={t().tools.cipher.confirmPassword}
          status={passwordMismatch ? "error" : "idle"}
          hint={passwordMismatch ? error : undefined}
          showMascot
        />
      </div>
    </div>

    <TextAreaField
      id="cipher-plain"
      bind:value={plaintext}
      label={t().tools.cipher.plaintext}
      placeholder={t().tools.cipher.plaintextPlaceholder}
      minHeight="120px"
    />

    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <button
        onclick={runEncrypt}
        disabled={!plaintext.trim() || !password || loading}
        style="background: var(--color-accent); color: #050508; border: none; border-radius: var(--radius); padding: 0.5rem 1rem; font-weight: 600; cursor: pointer; font-size: 0.875rem;"
        >{loading ? "..." : t().common.encode}</button
      >
    </div>

    {#if ciphertext}
      <div>
        <div
          style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.375rem;"
        >
          <span style="font-size: 0.85rem; color: var(--color-text-muted);"
            >{t().tools.cipher.ciphertext}</span
          >
          <button
            onclick={() => copy(ciphertext, "ct")}
            style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.25rem 0.625rem; cursor: pointer; font-size: 0.75rem;"
            >{copiedId === "ct" ? t().common.copied : t().common.copy}</button
          >
        </div>
        <textarea readonly value={ciphertext} spellcheck={false} style={textareaStyle}></textarea>
      </div>
    {/if}

    <hr style="border: none; border-top: 1px solid var(--color-border);" />

    <TextAreaField
      id="cipher-ct"
      bind:value={ciphertext}
      label={t().tools.cipher.ciphertextInput}
      placeholder={t().tools.cipher.ciphertextPlaceholder}
      minHeight="120px"
    />

    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <button
        onclick={runDecrypt}
        disabled={!ciphertext.trim() || !password || loading}
        style="background: var(--color-accent); color: #050508; border: none; border-radius: var(--radius); padding: 0.5rem 1rem; font-weight: 600; cursor: pointer; font-size: 0.875rem;"
        >{loading ? "..." : t().common.decode}</button
      >
    </div>

    {#if output}
      <div>
        <div
          style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.375rem;"
        >
          <span style="font-size: 0.85rem; color: var(--color-text-muted);"
            >{t().common.outputPlaceholder}</span
          >
          <button
            onclick={() => copy(output, "out")}
            style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.25rem 0.625rem; cursor: pointer; font-size: 0.75rem;"
            >{copiedId === "out" ? t().common.copied : t().common.copy}</button
          >
        </div>
        <textarea readonly value={output} spellcheck={false} style={textareaStyle}></textarea>
      </div>
    {/if}

    {#if error && !passwordMismatch}
      <p role="alert" style="color: var(--color-error); font-size: 0.875rem; margin: 0;">{error}</p>
    {/if}

    <div style="display: flex; gap: 0.5rem;">
      <button
        onclick={clear}
        style="background: none; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text-muted); padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
        >{t().common.clear}</button
      >
    </div>

    <p style="font-size: 0.7rem; color: var(--color-text-faint); margin: 0;">
      {t().tools.cipher.notice}
    </p>
  </div>
</ToolLayout>
