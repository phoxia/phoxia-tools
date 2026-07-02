<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { SvelteSet } from "svelte/reactivity";
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import Seo from "$lib/components/Seo.svelte";
  import { t } from "$lib/i18n/i18n.svelte";
  import { copyToClipboard } from "$lib/clipboard.svelte";
  import { trackToolUsed } from "$lib/analytics/analytics";
  import { generateRecord, getFields, isCommonField, findCountryForDoc } from "./logic";
  import { countryList, getCountry } from "$lib/faker/countries";

  const fieldParam = page.url.searchParams.get("field");
  const countryParam = page.url.searchParams.get("country");

  // Resolve initial country: ?country= > doc auto-detect > default BR
  let initialCountry = countryParam ? getCountry(countryParam) : getCountry("br");
  if (fieldParam && !countryParam) {
    const auto = findCountryForDoc(fieldParam);
    if (auto) initialCountry = auto;
  }

  let selectedCountry = $state(initialCountry);
  let count = $state(5);
  let activeFields = $state(
    fieldParam && getFields(selectedCountry).includes(fieldParam)
      ? new SvelteSet<string>([fieldParam])
      : new SvelteSet<string>(["name", "email", "phone", "postalCode", "state", "city"])
  );
  let records = $state<Record<string, string>[]>([]);
  let copiedJson = $state(false);
  let copiedCsv = $state(false);

  function generate() {
    records = Array.from({ length: count }, () => generateRecord(selectedCountry));
    trackToolUsed("faker");
  }

  const availableFields = $derived(getFields(selectedCountry));
  const visibleFields = $derived(availableFields.filter((f) => activeFields.has(f)));

  function fieldLabel(fieldId: string): string {
    const key = selectedCountry.fieldI18nKeys[fieldId] ?? fieldId;
    return t().tools.faker.fields[key] ?? fieldId;
  }

  function toggleField(f: string) {
    if (activeFields.has(f)) {
      if (activeFields.size > 1) activeFields.delete(f);
    } else activeFields.add(f);
  }

  function onCountryChange(id: string) {
    selectedCountry = getCountry(id);
    activeFields = new SvelteSet(["name", "email", "phone", "postalCode", "state", "city"]);
    generate();
  }

  // ponytail: clear stale ?field / ?country from URL without full navigation
  $effect(() => {
    if ((fieldParam || countryParam) && typeof window !== "undefined") {
      goto(resolve("/tools/faker"), { replaceState: true, noScroll: true });
    }
  });

  async function copyJson() {
    const rows = records.map((r) => Object.fromEntries(visibleFields.map((f) => [f, r[f]])));
    copiedJson = await copyToClipboard(JSON.stringify(rows, null, 2), t().common.copied);
    if (copiedJson) setTimeout(() => (copiedJson = false), 1500);
  }

  async function copyCsv() {
    const header = visibleFields.join(",");
    const rows = records.map((r) =>
      visibleFields.map((f) => `"${r[f].replace(/"/g, '""')}"`).join(",")
    );
    copiedCsv = await copyToClipboard([header, ...rows].join("\n"), t().common.copied);
    if (copiedCsv) setTimeout(() => (copiedCsv = false), 1500);
  }

  generate();

  // ── Dynamic SEO meta ──
  const seoField = $derived(fieldParam && visibleFields.length === 1 ? fieldParam : null);
  const seoLabel = $derived(seoField ? fieldLabel(seoField) : "");
  const seoCountryName = $derived(
    t().tools.faker.countries[selectedCountry.id] ?? selectedCountry.id.toUpperCase()
  );
  const isDocField = $derived(seoField ? !isCommonField(seoField) : false);

  const seoTitle = $derived.by(() => {
    const locale = t();
    if (isDocField) return `${locale.seo.siteName} • ${seoLabel}`;
    if (seoField) return `${locale.seo.siteName} • ${seoCountryName} ${seoLabel}`;
    return `${locale.seo.siteName} • ${locale.tools.faker.name}`;
  });

  const seoDesc = $derived.by(() => {
    const locale = t();
    const label = seoLabel.toLowerCase();
    if (isDocField)
      return `Generate valid-format ${label}s for software testing. Free, no sign-up, runs entirely in your browser.`;
    if (seoField)
      return `Generate random ${seoCountryName.toLowerCase()} ${label} for testing. Free, no sign-up, runs in your browser.`;
    return locale.tools.faker.desc;
  });

  const seoPath = $derived.by(() => {
    let path = "/tools/faker";
    if (seoField) path += `?field=${seoField}`;
    if (seoField && isDocField) return path;
    if (seoField && selectedCountry) path += `&country=${selectedCountry.id}`;
    return path;
  });
</script>

<Seo title={seoTitle} description={seoDesc} path={seoPath} />

<ToolLayout toolId="faker" title={t().tools.faker.name} description={t().tools.faker.desc}>
  <div style="display: flex; flex-direction: column; gap: 1.25rem;">
    <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end;">
      <!-- Country selector -->
      <label
        style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--color-text-muted);"
      >
        {t().tools.faker.labelCountry}
        <select
          value={selectedCountry.id}
          onchange={(e) => onCountryChange((e.target as HTMLSelectElement).value)}
          style="padding: 0.35rem 0.6rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-surface); color: var(--color-text); font-size: 0.85rem; cursor: pointer;"
        >
          {#each countryList as c (c.id)}
            <option value={c.id}
              >{c.flag} {t().tools.faker.countries[c.id] ?? c.id.toUpperCase()}</option
            >
          {/each}
        </select>
      </label>

      <!-- Count slider -->
      <label
        style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; color: var(--color-text-muted);"
      >
        {t().tools.faker.labelCount}:
        <strong style="color: var(--color-text); min-width: 1.5rem;">{count}</strong>
        <input
          type="range"
          min="1"
          max="50"
          bind:value={count}
          oninput={generate}
          style="accent-color: var(--color-accent); width: 120px;"
        />
      </label>

      <!-- Actions -->
      <div style="display: flex; gap: 0.5rem;">
        <button
          onclick={generate}
          style="background: var(--color-accent); color: #050508; border: none; border-radius: var(--radius); padding: 0.5rem 1rem; font-weight: 600; cursor: pointer; font-size: 0.875rem;"
        >
          {t().common.generate}
        </button>
        {#if records.length > 0}
          <button
            onclick={copyJson}
            style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text); padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
          >
            {copiedJson ? t().common.copied : t().tools.faker.json}
          </button>
          <button
            onclick={copyCsv}
            style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text); padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem;"
          >
            {copiedCsv ? t().common.copied : t().tools.faker.csv}
          </button>
        {/if}
      </div>
    </div>

    <!-- Field pills -->
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
      {#each availableFields as f (f)}
        <button
          onclick={() => toggleField(f)}
          style="
						padding: 0.25rem 0.625rem; border-radius: 99px; font-size: 0.78rem; cursor: pointer;
						border: 1px solid {activeFields.has(f) ? 'var(--color-accent)' : 'var(--color-border)'};
						background: {activeFields.has(f)
            ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)'
            : 'transparent'};
						color: {activeFields.has(f) ? 'var(--color-accent)' : 'var(--color-text-muted)'};
					"
        >
          {fieldLabel(f)}
        </button>
      {/each}
    </div>

    <!-- Table -->
    {#if records.length > 0}
      <div
        style="overflow-x: auto; border: 1px solid var(--color-border); border-radius: var(--radius);"
      >
        <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem;">
          <thead>
            <tr style="background: color-mix(in srgb, var(--color-surface) 50%, transparent);">
              {#each visibleFields as f (f)}
                <th
                  style="padding: 0.5rem 0.875rem; text-align: left; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-text-faint); white-space: nowrap; border-bottom: 1px solid var(--color-border);"
                >
                  {fieldLabel(f)}
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each records as row, i (i)}
              <tr style="border-top: {i > 0 ? '1px solid var(--color-border)' : 'none'};">
                {#each visibleFields as f (f)}
                  <td
                    style="padding: 0.5rem 0.875rem; color: var(--color-text); font-family: {selectedCountry
                      .docs[f]?.mono
                      ? 'var(--font-mono)'
                      : 'inherit'}; white-space: nowrap;"
                  >
                    {row[f]}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</ToolLayout>
