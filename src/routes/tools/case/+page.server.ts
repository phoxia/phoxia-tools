import { redirect } from "@sveltejs/kit";
export function load() {
  throw redirect(301, "/tools/text?tab=case");
}
