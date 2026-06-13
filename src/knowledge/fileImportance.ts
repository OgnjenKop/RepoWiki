import type { RepoScan } from "../types/index.js";
import { selectProjectEntryFiles } from "./moduleFocus.js";

export function rankImportantFiles(scan: RepoScan, candidates: string[]): string[] {
  const fileSet = new Set(scan.graph.files.map((file) => file.path));
  const candidateSet = [...new Set(candidates.filter((file) => fileSet.has(file)))];
  const importCounts = new Map<string, number>();
  const outgoingCounts = new Map<string, number>();
  const exportCounts = new Map<string, number>();
  const symbolCounts = new Map<string, number>();

  for (const edge of scan.graph.imports) {
    importCounts.set(edge.to, (importCounts.get(edge.to) ?? 0) + 1);
    outgoingCounts.set(edge.from, (outgoingCounts.get(edge.from) ?? 0) + 1);
  }

  for (const file of scan.graph.files) {
    exportCounts.set(file.path, file.exports.length);
    symbolCounts.set(file.path, file.symbols.length);
  }

  return candidateSet
    .map((path) => {
      let score = 0;
      if (path === "README.md") score += 1000;
      if (path === "package.json") score += 950;
      if (path === "src/cli.ts") score += 980;
      if (scan.project.configFiles.includes(path)) score += 850;
      if (/(\.env|docker|compose|schema\.prisma|migration|drizzle|typeorm|sequelize|knex|vitest|jest|next|vite|tsconfig|eslint|prettier|README\.md)/i.test(path)) score += 500;
      score += (importCounts.get(path) ?? 0) * 25;
      score += (outgoingCounts.get(path) ?? 0) * 10;
      score += (exportCounts.get(path) ?? 0) * 8;
      score += (symbolCounts.get(path) ?? 0) * 5;
      return { path, score };
    })
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path))
    .map((entry) => entry.path);
}

export function selectProjectFocusFiles(scan: RepoScan, limit = 12): string[] {
  const anchors = rankImportantFiles(scan, ["README.md", "package.json", ...scan.project.configFiles]);
  const entryFiles = selectProjectEntryFiles(scan, limit * 2).map((entry) => entry.path);
  const ranked = rankImportantFiles(scan, [
    "README.md",
    "package.json",
    ...scan.project.configFiles,
    ...scan.graph.files.map((file) => file.path)
  ]);
  return uniquePreservingOrder([...anchors, ...entryFiles, ...ranked]).slice(0, limit);
}

export function selectModuleFocusFiles(scan: RepoScan, moduleFiles: string[], relatedFiles: string[] = [], limit = 12): string[] {
  return uniquePreservingOrder([
    ...selectProjectEntryFiles(scan, limit * 2).map((entry) => entry.path).filter((path) => moduleFiles.includes(path)),
    ...rankImportantFiles(scan, [...moduleFiles, ...relatedFiles])
  ]).slice(0, limit);
}

export function selectCentralFiles(scan: RepoScan, limit = 8): string[] {
  const incomingCounts = new Map<string, number>();
  const exportCounts = new Map<string, number>();
  const symbolCounts = new Map<string, number>();
  for (const edge of scan.graph.imports) {
    incomingCounts.set(edge.to, (incomingCounts.get(edge.to) ?? 0) + 1);
  }
  for (const file of scan.graph.files) {
    exportCounts.set(file.path, file.exports.length);
    symbolCounts.set(file.path, file.symbols.length);
  }
  return scan.graph.files
    .map((file) => ({
      path: file.path,
      score: (incomingCounts.get(file.path) ?? 0) * 100 + (exportCounts.get(file.path) ?? 0) * 10 + (symbolCounts.get(file.path) ?? 0) * 5
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path))
    .map((entry) => entry.path)
    .slice(0, limit);
}

function uniquePreservingOrder(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
