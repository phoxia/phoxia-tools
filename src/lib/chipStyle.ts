export function chipStyle(active: boolean, opts?: { mono?: boolean; extra?: string }): string {
  return `padding: 0.375rem 0.625rem; font-size: 0.75rem; border-radius: var(--radius); cursor: pointer; white-space: nowrap;
    border: 1px solid ${active ? "var(--color-accent)" : "var(--color-border)"};
    background: ${active ? "color-mix(in srgb, var(--color-accent) 10%, transparent)" : "transparent"};
    color: ${active ? "var(--color-accent)" : "var(--color-text-muted)"};
    font-weight: ${active ? 600 : 400};
    ${opts?.mono ? "font-family: var(--font-mono);" : ""}
    ${opts?.extra ?? ""}`;
}
