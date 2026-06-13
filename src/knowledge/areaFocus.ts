import type { RepoScan } from "../types/index.js";

export type AreaEntryFile = {
  path: string;
  line?: number;
  reason: string;
};

export type AreaConsumer = {
  path: string;
  count: number;
  targets: string[];
  kind: "runtime" | "test";
};

export function selectAreaEntryFiles(scan: RepoScan, areaFiles: string[], limit = 5): AreaEntryFile[] {
  const candidateSet = new Set(areaFiles);
  const incomingExternal = new Map<string, number>();
  const incomingTotal = new Map<string, number>();
  const outgoing = new Map<string, number>();
  const exportCounts = new Map<string, number>();
  const symbolCounts = new Map<string, number>();

  for (const edge of scan.graph.imports) {
    if (!candidateSet.has(edge.to)) continue;
    incomingTotal.set(edge.to, (incomingTotal.get(edge.to) ?? 0) + 1);
    if (!candidateSet.has(edge.from)) {
      incomingExternal.set(edge.to, (incomingExternal.get(edge.to) ?? 0) + 1);
    } else {
      outgoing.set(edge.from, (outgoing.get(edge.from) ?? 0) + 1);
    }
  }

  for (const file of scan.graph.files) {
    if (!candidateSet.has(file.path)) continue;
    exportCounts.set(file.path, file.exports.length);
    symbolCounts.set(file.path, file.symbols.length);
  }

  return [...candidateSet]
    .map((path) => {
      const record = scan.graph.files.find((entry) => entry.path === path);
      const route = scan.graph.routes.find((entry) => entry.file === path);
      const test = scan.graph.tests.find((entry) => entry.path === path);
      const externalImports = incomingExternal.get(path) ?? 0;
      const totalImports = incomingTotal.get(path) ?? 0;
      const outgoingImports = outgoing.get(path) ?? 0;
      const exports = exportCounts.get(path) ?? 0;
      const symbols = symbolCounts.get(path) ?? 0;
      const score =
        externalImports * 300 +
        totalImports * 120 +
        outgoingImports * 45 +
        exports * 18 +
        symbols * 10 +
        (route ? 200 : 0) +
        (test ? -100 : 0) +
        (isIndexLike(path) ? 40 : 0);

      return {
        path,
        score,
        line: firstInterestingLine(record),
        reason: buildReason({ externalImports, totalImports, outgoingImports, exports, symbols, route, test })
      };
    })
    .filter((entry) => !isTestFile(entry.path))
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path))
    .slice(0, limit)
    .map(({ path, line, reason }) => ({ path, line, reason }));
}

export function selectAreaConsumers(scan: RepoScan, areaFiles: string[], limit = 8): AreaConsumer[] {
  const candidateSet = new Set(areaFiles);
  const counts = new Map<string, { count: number; targets: Set<string> }>();

  for (const edge of scan.graph.imports) {
    if (!candidateSet.has(edge.to) || candidateSet.has(edge.from)) continue;
    const current = counts.get(edge.from) ?? { count: 0, targets: new Set<string>() };
    current.count += 1;
    current.targets.add(edge.to);
    counts.set(edge.from, current);
  }

  return [...counts.entries()]
    .map(([path, entry]) => ({
      path,
      kind: consumerKind(path),
      count: entry.count,
      targets: [...entry.targets].sort()
    }))
    .sort((a, b) => b.count - a.count || a.path.localeCompare(b.path))
    .slice(0, limit);
}

function buildReason(input: {
  externalImports: number;
  totalImports: number;
  outgoingImports: number;
  exports: number;
  symbols: number;
  route?: { file: string; path?: string; method?: string };
  test?: { path: string };
}): string {
  if (input.route) return input.route.path ? `Runtime route entry for ${input.route.method ?? "ANY"} ${input.route.path}.` : "Runtime route entry for this area.";
  if (input.externalImports > 0) return `Imported by ${input.externalImports} external file${input.externalImports === 1 ? "" : "s"}.`;
  if (input.exports > 0 && input.symbols > 0) return "Central implementation file with exported behavior.";
  if (input.exports > 0) return "Exported API surface for this area.";
  if (input.symbols > 0) return `Defines ${input.symbols} symbol${input.symbols === 1 ? "" : "s"} used inside this area.`;
  if (input.outgoingImports > 0) return "File that connects to nearby implementation details.";
  if (input.totalImports > 0) return "Frequently referenced within the area.";
  return "Representative file for this area.";
}

function firstInterestingLine(record: { exports: string[]; symbols: Array<{ exported: boolean; line?: number }>} | undefined): number | undefined {
  if (!record) return undefined;
  const exported = record.symbols.find((symbol) => symbol.exported && symbol.line);
  if (exported?.line) return exported.line;
  const anySymbol = record.symbols.find((symbol) => symbol.line);
  return anySymbol?.line;
}

function isTestFile(filePath: string): boolean {
  return /(^|\/)(__tests__|tests?|specs?|__mocks__)(\/|$)|(\.|\/)(test|spec)\.[^.]+$/i.test(filePath);
}

function isIndexLike(filePath: string): boolean {
  return /(^|\/)(index|page|layout)\.(mjs|cjs|js|jsx|ts|tsx)$/i.test(filePath);
}

function consumerKind(filePath: string): AreaConsumer["kind"] {
  return isTestFile(filePath) ? "test" : "runtime";
}
