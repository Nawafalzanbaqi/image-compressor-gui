import "server-only";
import fs from "node:fs";
import path from "node:path";
import { options as compiledOptions, type Options } from "./options";

/**
 * SERVER-ONLY options resolver. Reads the mounted options.json at runtime so a
 * docker deployment can override the compiled-in copy without a rebuild. Never
 * import this from Client Components or the Edge middleware — it uses node:fs.
 *
 * Resolution order:
 *   1. FACTORY_OPTIONS_PATH env override
 *   2. /app/options.json (docker mount)
 *   3. <repo-root>/options.json (dev)
 *   4. compiled-in copy from ./options (build-time import)
 */
const CANDIDATES = [
  process.env.FACTORY_OPTIONS_PATH,
  "/app/options.json",
  path.resolve(process.cwd(), "..", "options.json"),
  path.resolve(process.cwd(), "options.json"),
].filter(Boolean) as string[];

export function resolveOptions(): Options {
  for (const candidate of CANDIDATES) {
    try {
      if (fs.existsSync(candidate)) {
        const raw = fs.readFileSync(candidate, "utf8");
        return { ...compiledOptions, ...(JSON.parse(raw) as Options) };
      }
    } catch {
      // try next
    }
  }
  return compiledOptions;
}
