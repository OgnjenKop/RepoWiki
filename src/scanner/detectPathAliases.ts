import fs from "node:fs/promises";
import path from "node:path";
import type { PathAlias } from "../types/index.js";
import { pathExists } from "../utils/fs.js";
import { toPosixPath } from "../utils/paths.js";
import { stripComments } from "../utils/sourceText.js";

type TsConfig = {
  compilerOptions?: {
    baseUrl?: string;
    paths?: Record<string, string[]>;
  };
};

export async function detectPathAliases(rootDir: string): Promise<PathAlias[]> {
  const tsconfigPath = path.join(rootDir, "tsconfig.json");
  if (!(await pathExists(tsconfigPath))) return [];

  try {
    const tsconfig = JSON.parse(stripComments(await fs.readFile(tsconfigPath, "utf8"))) as TsConfig;
    const baseUrl = tsconfig.compilerOptions?.baseUrl ?? ".";
    const paths = tsconfig.compilerOptions?.paths ?? {};
    return Object.entries(paths)
      .map(([pattern, targets]) => ({
        pattern,
        targets: targets.map((target) => toPosixPath(path.posix.normalize(path.posix.join(baseUrl, target))))
      }))
      .sort((a, b) => b.pattern.length - a.pattern.length);
  } catch {
    return [];
  }
}
