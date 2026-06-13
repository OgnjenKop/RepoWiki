import path from "node:path";
import type { FileRecord, TestRecord } from "../types/index.js";
import { isTestFile } from "./fileClassifiers.js";
import { lineNumberAtIndex, stripComments } from "../utils/sourceText.js";

export function detectTests(files: FileRecord[], contents: Record<string, string> = {}): TestRecord[] {
  return files
    .filter((file) => isTestFile(file.path))
    .map((file) => {
      const content = contents[file.path];
      const importedTargets = inferFromImports(file, files);
      const specialTargets = inferSpecialTargets(file, content, files);
      const fallbackTargets = importedTargets.length || specialTargets.length ? [] : inferFallbackTarget(file.path);
      const coverageConfidence = importedTargets.length
        ? "direct"
        : specialTargets.length
          ? "inferred"
          : fallbackTargets.length
            ? "fallback"
            : undefined;
      const testedFiles = uniqueSorted([...importedTargets, ...specialTargets, ...fallbackTargets]);
      return {
        path: file.path,
        line: inferTestLine(file.path, content, files),
        testedFile: testedFiles[0],
        testedFiles: testedFiles.length ? testedFiles : undefined,
        coverageConfidence
      };
    });
}

function inferFallbackTarget(testPath: string): string[] {
  const fallback = testPath
    .replace("__tests__/", "")
    .replace(/\.(test|spec)\./, ".")
    .replace(/^test\//, "src/");
  return fallback ? [fallback] : [];
}

function inferFromImports(testFile: FileRecord, files: FileRecord[]): string[] {
  const fileSet = new Set(files.map((file) => file.path));
  const targets = new Set<string>();
  for (const specifier of testFile.imports) {
    if (!specifier.startsWith(".")) continue;
    const resolved = resolveRelativeImport(testFile.path, specifier, fileSet);
    if (resolved && !isTestFile(resolved)) targets.add(resolved);
  }
  return [...targets].sort();
}

function inferSpecialTargets(testFile: FileRecord, content: string | undefined, files: FileRecord[]): string[] {
  if (!content) return [];
  const fileSet = new Set(files.map((file) => file.path));
  const targets = new Set<string>();
  if (!/cliPath|dist\/cli\.js|tsx\s+src\/cli\.ts|node\s+dist\/cli\.js/.test(content)) return [];
  for (const candidate of ["src/cli.ts", "src/cli.js", "cli.ts", "cli.js"]) {
    if (fileSet.has(candidate)) targets.add(candidate);
  }
  return [...targets].sort();
}

function inferTestLine(testPath: string, content: string | undefined, files: FileRecord[]): number | undefined {
  if (!content) return undefined;
  const source = stripComments(content);
  const fileSet = new Set(files.map((file) => file.path));
  let firstLine: number | undefined;
  for (const match of source.matchAll(/import\s+(?:type\s+)?(?:[^'"]+\s+from\s+)?["']([^"']+)["']/g)) {
    if (match.index === undefined) continue;
    const resolved = resolveRelativeImport(testPath, match[1], fileSet);
    if (!resolved || isTestFile(resolved)) continue;
    const line = lineNumberAtIndex(source, match.index);
    if (firstLine === undefined || line < firstLine) firstLine = line;
  }
  return firstLine;
}

function resolveRelativeImport(fromFile: string, specifier: string, files: Set<string>): string | undefined {
  const base = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), specifier));
  const normalizedBase = stripKnownExtension(base);
  const candidates = [
    base,
    normalizedBase,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    `${normalizedBase}.ts`,
    `${normalizedBase}.tsx`,
    `${normalizedBase}.js`,
    `${normalizedBase}.jsx`,
    `${base}/index.ts`,
    `${base}/index.tsx`,
    `${base}/index.js`,
    `${base}/index.jsx`,
    `${normalizedBase}/index.ts`,
    `${normalizedBase}/index.tsx`,
    `${normalizedBase}/index.js`,
    `${normalizedBase}/index.jsx`
  ];
  return candidates.find((candidate) => files.has(candidate));
}

function stripKnownExtension(filePath: string): string {
  return filePath.replace(/\.(mjs|cjs|js|jsx|ts|tsx)$/, "");
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort();
}
