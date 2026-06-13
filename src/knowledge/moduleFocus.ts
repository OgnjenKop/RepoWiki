import type { RepoScan } from "../types/index.js";
import { routeCoverageDescriptor } from "../utils/routeCoverage.js";
import { orderedAreas } from "./areaOrdering.js";

export type ModuleEntryFile = {
  path: string;
  line?: number;
  reason: string;
};

export type ModuleConsumer = {
  path: string;
  count: number;
  targets: string[];
  kind: "runtime" | "test";
};

export type ContextChangePath = {
  task: string;
  files: string[];
  note: string;
  evidence: string[];
};

export function selectModuleEntryFiles(scan: RepoScan, moduleFiles: string[], limit = 5): ModuleEntryFile[] {
  const candidateSet = new Set(moduleFiles);
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

export function selectModuleConsumers(scan: RepoScan, moduleFiles: string[], limit = 8): ModuleConsumer[] {
  const candidateSet = new Set(moduleFiles);
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

export function selectProjectEntryFiles(scan: RepoScan, limit = 8): ModuleEntryFile[] {
  const moduleEntries = scan.graph.modules.flatMap((module) => selectModuleEntryFiles(scan, module.files, 2));
  const explicitEntryCandidates = scan.graph.files
    .filter((file) => entryPathPriority(file.path) > 0)
    .map((file) => {
      const route = scan.graph.routes.find((entry) => entry.file === file.path);
      const test = scan.graph.tests.find((entry) => entry.path === file.path);
      return {
        path: file.path,
        line: firstInterestingLine(file),
        reason: buildReason({
          externalImports: 0,
          totalImports: file.imports.length,
          outgoingImports: file.imports.filter((item) => !item.startsWith(".")).length,
          exports: file.exports.length,
          symbols: file.symbols.length,
          route,
          test
        })
      };
    });
  const entries = [...moduleEntries, ...explicitEntryCandidates];
  const ranked = [...new Map(entries.map((entry) => [entry.path, entry] as const)).values()]
    .sort((a, b) => {
      const aModule = scan.graph.modules.find((module) => module.files.includes(a.path));
      const bModule = scan.graph.modules.find((module) => module.files.includes(b.path));
      const aSize = aModule?.files.length ?? 0;
      const bSize = bModule?.files.length ?? 0;
      const aScore = entryScore(a) + entryPathPriority(a.path);
      const bScore = entryScore(b) + entryPathPriority(b.path);
      return bScore - aScore || bSize - aSize || a.path.localeCompare(b.path);
    });
  return ranked.slice(0, limit);
}

export function selectProjectConsumers(scan: RepoScan, limit = 8): ModuleConsumer[] {
  const counts = new Map<string, { count: number; targets: Set<string> }>();
  const moduleFiles = new Set(scan.graph.modules.flatMap((module) => module.files));
  for (const edge of scan.graph.imports) {
    if (!moduleFiles.has(edge.to) || moduleFiles.has(edge.from)) continue;
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

export function selectProjectChangePaths(scan: RepoScan): ContextChangePath[] {
  const paths: ContextChangePath[] = [];
  const areaByPrefix = (prefix: string) => orderedAreas(scan).find((area) => area.name.startsWith(prefix));
  const entryFiles = selectProjectEntryFiles(scan, 6).map((entry) => entry.path);
  const consumers = selectProjectConsumers(scan, 8);
  const runtimeConsumers = consumers.filter((consumer) => consumer.kind === "runtime").map((consumer) => consumer.path);
  const testConsumers = consumers.filter((consumer) => consumer.kind === "test").map((consumer) => consumer.path);
  const addPath = (task: string, prefix: string, note: string) => {
    const area = areaByPrefix(prefix);
    if (!area) return;
    const files = uniquePreservingOrder([
      ...entryFiles.filter((file) => area.files.includes(file)),
      ...area.files.slice(0, 4),
      ...scan.graph.modules
        .filter((module) => area.modules.includes(module.id))
        .flatMap((module) => module.files.slice(0, 2))
    ]).slice(0, 6);
    paths.push({
      task,
      files,
      note,
      evidence: [area.name, ...files.slice(0, 3)]
    });
  };

  addPath("Change operations, scripts, or entry behavior", "Operations and entry points", "Start in runnable entry points, scripts, and top-level orchestration.");
  addPath("Change core application behavior", "Core application logic", "Start in the domain, service, state, routing, or data-flow modules.");
  addPath("Change UI, docs, or generated output", "Presentation and output", "Start in user-facing presentation, docs, or output-generation modules.");
  addPath("Change shared types, configuration, persistence, or helpers", "Shared support", "Start in shared utility, configuration, storage, and type layers.");

  if (entryFiles.length) {
    paths.push({
      task: "Read the main entry files first",
      files: entryFiles,
      note: "These are the strongest repo-wide starting points.",
      evidence: entryFiles.slice(0, 4)
    });
  }

  if (runtimeConsumers.length) {
    paths.push({
      task: "Inspect runtime consumers before changing shared code",
      files: runtimeConsumers.slice(0, 6),
      note: "These runtime-like files depend on the repo's internal modules.",
      evidence: runtimeConsumers.slice(0, 4)
    });
  }

  if (testConsumers.length) {
    paths.push({
      task: "Review test consumers before changing behavior",
      files: testConsumers.slice(0, 6),
      note: "These tests show expected behavior around the files you are likely to edit.",
      evidence: testConsumers.slice(0, 4)
    });
  }

  return paths;
}

export function selectModuleChangePaths(scan: RepoScan, moduleFiles: string[]): ContextChangePath[] {
  const entryFiles = selectModuleEntryFiles(scan, moduleFiles, 4).map((entry) => entry.path);
  const consumers = selectModuleConsumers(scan, moduleFiles, 6);
  const runtimeConsumers = consumers.filter((consumer) => consumer.kind === "runtime").flatMap((consumer) => [consumer.path, ...consumer.targets]);
  const testConsumers = consumers.filter((consumer) => consumer.kind === "test").flatMap((consumer) => [consumer.path, ...consumer.targets]);
  const consumerFiles = uniquePreservingOrder([...runtimeConsumers, ...testConsumers]);
  const ordered = uniquePreservingOrder([...entryFiles, ...moduleFiles, ...consumerFiles]).slice(0, 6);
  return [
    {
      task: "Read the module entry files first",
      files: entryFiles.slice(0, 4),
      note: "These are the strongest module starting points.",
      evidence: entryFiles.slice(0, 4)
    },
    {
      task: "Inspect runtime consumers before changing shared code",
      files: uniquePreservingOrder(runtimeConsumers).slice(0, 6),
      note: "These runtime-like files depend on the module boundary.",
      evidence: uniquePreservingOrder(runtimeConsumers).slice(0, 6)
    },
    {
      task: "Review test consumers before changing behavior",
      files: uniquePreservingOrder(testConsumers).slice(0, 6),
      note: "These tests show expected behavior around the module boundary.",
      evidence: uniquePreservingOrder(testConsumers).slice(0, 6)
    },
    {
      task: "Change module implementation files together",
      files: ordered,
      note: "These files are part of the same module boundary and likely need coordinated edits.",
      evidence: uniquePreservingOrder([...moduleFiles, ...entryFiles, ...consumerFiles]).slice(0, 6)
    }
  ].filter((path) => path.files.length > 0);
}

export function selectRouteChangePaths(scan: RepoScan, routeFile: string): ContextChangePath[] {
  const module = scan.graph.modules.find((candidate) => candidate.files.includes(routeFile));
  const moduleFiles = module?.files ?? [];
  const route = scan.graph.routes.find((entry) => entry.file === routeFile);
  const moduleEntryFiles = module ? selectModuleEntryFiles(scan, moduleFiles, 3).map((entry) => entry.path) : [];
  const tests = scan.graph.tests
    .filter((test) =>
      test.path.includes(routeFile.split("/").slice(0, -1).join("/")) ||
      (test.testedFile ? moduleFiles.includes(test.testedFile) : false) ||
      (test.testedFiles ? test.testedFiles.some((file) => moduleFiles.includes(file)) : false)
    )
    .map((test) => test.path);
  const changeTargets = [
    routeFile,
    ...moduleFiles.slice(0, 4),
    ...moduleEntryFiles,
    ...tests.slice(0, 4)
  ];
  return [
    {
      task: "Change route behavior",
      files: [routeFile],
      note: route
        ? `${routeCoverageDescriptor(route)} route file.`
        : "Route file and primary handler entry point.",
      evidence: [routeFile]
    },
    {
      task: "Read the owning module entry files first",
      files: moduleEntryFiles,
      note: "These show how the route fits into the broader module.",
      evidence: moduleEntryFiles.slice(0, 4)
    },
    {
      task: "Inspect tests before changing route logic",
      files: tests.slice(0, 6),
      note: "These tests show the expected route behavior.",
      evidence: tests.slice(0, 6)
    },
    {
      task: "Coordinate changes across the owning module",
      files: uniquePreservingOrder(changeTargets).slice(0, 6),
      note: "These files are the most likely to need updates if route behavior changes.",
      evidence: uniquePreservingOrder(changeTargets).slice(0, 6)
    }
  ].filter((path) => path.files.length > 0);
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
  if (input.route) return input.route.path ? `Runtime route entry for ${input.route.method ?? "ANY"} ${input.route.path}.` : "Runtime route entry for this module.";
  if (input.externalImports > 0) return `Imported by ${input.externalImports} external file${input.externalImports === 1 ? "" : "s"}.`;
  if (input.exports > 0 && input.symbols > 0) return "Central implementation file with exported behavior.";
  if (input.exports > 0) return "Exported API surface for this module.";
  if (input.symbols > 0) return `Defines ${input.symbols} symbol${input.symbols === 1 ? "" : "s"} used inside this module.`;
  if (input.outgoingImports > 0) return "File that connects to nearby implementation details.";
  if (input.totalImports > 0) return "Frequently referenced within the module.";
  return "Representative file for this module.";
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

function entryScore(entry: ModuleEntryFile): number {
  return (entry.reason.includes("Imported by") ? 300 : 0) +
    (entry.reason.includes("Runtime route entry") ? 200 : 0) +
    (entry.reason.includes("Central implementation file") ? 120 : 0) +
    (entry.reason.includes("Exported API surface") ? 80 : 0) +
    (entry.reason.includes("Symbol-rich") ? 40 : 0) +
    (entry.line ? 10 : 0);
}

function consumerKind(filePath: string): ModuleConsumer["kind"] {
  return isTestFile(filePath) ? "test" : "runtime";
}

function uniquePreservingOrder(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function entryPathPriority(path: string): number {
  const fileName = path.split("/").pop() ?? path;
  if (/^cli\.(mjs|cjs|js|jsx|ts|tsx)$/i.test(fileName)) return 1000;
  if (/^(main|server|app)\.(mjs|cjs|js|jsx|ts|tsx)$/i.test(fileName)) return 900;
  if (/^(index|page|layout)\.(mjs|cjs|js|jsx|ts|tsx)$/i.test(fileName)) return 700;
  if (/\/(cli|main|server|app)\.(mjs|cjs|js|jsx|ts|tsx)$/i.test(path)) return 1000;
  if (/\/(index|page|layout)\.(mjs|cjs|js|jsx|ts|tsx)$/i.test(path)) return 700;
  return 0;
}
