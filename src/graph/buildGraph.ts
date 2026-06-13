import path from "node:path";
import type { FileRecord, GraphEdge, PathAlias } from "../types/index.js";

export function buildGraph(files: FileRecord[], aliases: PathAlias[] = []): GraphEdge[] {
  const fileSet = new Set(files.map((file) => file.path));
  const edges: GraphEdge[] = [];
  for (const file of files) {
    for (const imported of file.imports) {
      const target = imported.startsWith(".")
        ? resolveRelativeImport(file.path, imported, fileSet)
        : resolveAliasImport(imported, fileSet, aliases) ?? imported;
      if (target) edges.push({ from: file.path, to: target, type: "import" });
    }
  }
  return edges.sort((a, b) => `${a.from}:${a.to}`.localeCompare(`${b.from}:${b.to}`));
}

function resolveRelativeImport(fromFile: string, specifier: string, files: Set<string>): string | undefined {
  const base = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), specifier));
  const normalizedBase = stripKnownExtension(base);
  return resolveFileCandidate(normalizedBase, files) ?? resolveFileCandidate(base, files);
}

function stripKnownExtension(filePath: string): string {
  return filePath.replace(/\.(mjs|cjs|js|jsx|ts|tsx)$/, "");
}

function resolveAliasImport(specifier: string, files: Set<string>, aliases: PathAlias[]): string | undefined {
  for (const alias of aliases) {
    const wildcardIndex = alias.pattern.indexOf("*");
    if (wildcardIndex === -1) {
      if (specifier !== alias.pattern) continue;
      for (const target of alias.targets) {
        const resolved = resolveFileCandidate(target, files);
        if (resolved) return resolved;
      }
      continue;
    }

    const prefix = alias.pattern.slice(0, wildcardIndex);
    const suffix = alias.pattern.slice(wildcardIndex + 1);
    if (!specifier.startsWith(prefix) || !specifier.endsWith(suffix)) continue;
    const matched = specifier.slice(prefix.length, specifier.length - suffix.length);
    for (const target of alias.targets) {
      const resolved = resolveFileCandidate(target.replace("*", matched), files);
      if (resolved) return resolved;
    }
  }
  return undefined;
}

function resolveFileCandidate(base: string, files: Set<string>): string | undefined {
  const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.jsx`, `${base}.json`, `${base}/index.ts`, `${base}/index.tsx`, `${base}/index.js`];
  return candidates.find((candidate) => files.has(candidate));
}
