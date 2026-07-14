import { existsSync } from "node:fs";

for (const path of ["static/lux", "static/site.webmanifest", "static/apple-touch-icon.png"]) {
  if (existsSync(path)) throw new Error(`Use @phoxia/lux instead of copied asset: ${path}`);
}
console.log("Lux assets resolve from @phoxia/lux.");
