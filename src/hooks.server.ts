import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const lang = event.request.headers.get("accept-language") ?? "";
  const isPT = lang.toLowerCase().includes("pt");
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace("%sveltekit.lang%", isPT ? "pt-BR" : "en"),
  });
};
