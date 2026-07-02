export type FieldStatus = "idle" | "info" | "error" | "warning" | "success";

export function statusToLux(status: FieldStatus): "worried" | "confused" | "happy" | "active" {
  switch (status) {
    case "error":
      return "worried";
    case "warning":
      return "confused";
    case "success":
      return "happy";
    default:
      return "active";
  }
}

export function statusToColor(status: FieldStatus): string {
  switch (status) {
    case "error":
      return "var(--color-error)";
    case "warning":
      return "var(--color-warning)";
    case "success":
      return "var(--color-success)";
    case "info":
      return "var(--color-accent)";
    default:
      return "var(--color-border)";
  }
}
