import { t } from "$lib/i18n/i18n.svelte";
import { ok, err } from "$lib/result";
import type { Result } from "$lib/result";

const MAX_INPUT = 500_000;

export function formatJson(input: string): Result<string> {
  if (input.length > MAX_INPUT) return err(t().tools.json.errorSize);
  try {
    return ok(JSON.stringify(JSON.parse(input), null, 2));
  } catch (e) {
    return err(`${t().common.error}: ${(e as Error).message}`);
  }
}

export function minifyJson(input: string): Result<string> {
  if (input.length > MAX_INPUT) return err(t().tools.json.errorSize);
  try {
    return ok(JSON.stringify(JSON.parse(input)));
  } catch (e) {
    return err(`${t().common.error}: ${(e as Error).message}`);
  }
}
