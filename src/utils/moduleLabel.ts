import type { ModuleRecord } from "../types/index.js";

export function moduleLabel(module: Pick<ModuleRecord, "name" | "rootPath">): string {
  return module.rootPath && module.rootPath !== module.name ? `${module.name} (${module.rootPath})` : module.name;
}
