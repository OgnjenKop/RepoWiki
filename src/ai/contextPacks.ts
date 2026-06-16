import fs from "node:fs/promises";
import path from "node:path";
import { writeJson } from "../utils/fs.js";
import type { KnowledgeKind, RepoWikiIndex } from "../types/index.js";
import type { ContextFile, ContextFlow, ContextPack, ContextRelation, ModuleContextInput, RouteContextInput, AreaContextInput } from "./types.js";
import type { RepoScan } from "../types/index.js";
import { selectCentralFiles, selectModuleFocusFiles, selectProjectFocusFiles } from "../knowledge/fileImportance.js";
import { selectModuleChangeTargets, selectProjectChangeTargets, selectRouteChangeTargets } from "../knowledge/changeTargets.js";
import { selectAreaVerificationHints, selectModuleVerificationHints, selectProjectVerificationHints, selectRouteVerificationHints } from "../knowledge/verification.js";
import { routeCoverageLabel } from "../utils/routeCoverage.js";
import { moduleLabel } from "../utils/moduleLabel.js";
import { selectModuleChangePaths, selectModuleConsumers, selectModuleEntryFiles, selectProjectChangePaths, selectProjectConsumers, selectProjectEntryFiles, selectRouteChangePaths } from "../knowledge/moduleFocus.js";
import { selectAreaConsumers, selectAreaEntryFiles } from "../knowledge/areaFocus.js";
import { buildAreaFlows } from "../knowledge/areaFlows.js";
import { orderedAreas } from "../knowledge/areaOrdering.js";
import { splitConsumers } from "../utils/consumers.js";

const defaultSnippetLines = 20;
const reducedSnippetLines = 10;
const maxSnippetChars = 600;
const maxContextFiles = 8;

export async function buildProjectContextPack(scan: RepoScan): Promise<ContextPack> {
  const changePaths = selectProjectChangePaths(scan);
  const verificationHints = selectProjectVerificationHints(scan);
  const priorityFiles = uniquePreserveOrder([
    ...selectProjectEntryFiles(scan, 4).map((entry) => entry.path),
    ...changePaths.flatMap((path) => path.files),
    ...verificationHintFiles(verificationHints)
  ]);
  const files = await selectFiles(scan, [...selectProjectFocusFiles(scan), ...scan.project.configFiles], priorityFiles);
  const centralFiles = selectCentralFiles(scan, 8);
  const entryFiles = selectProjectEntryFiles(scan, 8);
  const consumers = selectProjectConsumers(scan, 8);
  const splitProjectConsumers = splitConsumers(consumers);
  return {
    scope: "project",
    title: scan.project.name,
    summaryHint: `Summarize the repository at a high level for an AI coding agent. The project is ${scan.project.type}.`,
    files,
    knowledge: filterKnowledge(scan, ["project", "area", "module", "config", "dependency"]),
    relations: [
      relation("Central files", centralFiles, "Files with the most incoming imports and architectural influence."),
      relation("Important entry files", entryFiles.map((entry: { path: string }) => entry.path), "Best starting points inside the repo."),
      relation("Runtime consumers", splitProjectConsumers.runtime.map((consumer) => consumer.path), "Runtime-like files outside modules that depend on repo code."),
      relation("Test consumers", splitProjectConsumers.tests.map((consumer) => consumer.path), "Test files that depend on repo code."),
      relation("Module areas", orderedAreas(scan).map((area) => area.name), "Connected module clusters detected from import relationships."),
      relation("Module roots", scan.graph.modules.map((module) => module.rootPath), "Top-level module boundaries detected from repo structure."),
      relation("Config files", scan.project.configFiles, "Configuration files that define runtime or tooling behavior."),
      relation("Test files", scan.graph.tests.map((test) => test.path), "Tests that show expected behavior and guard changes.")
    ],
    flows: buildProjectFlows(scan),
    verificationHints,
    changePaths: selectProjectChangePaths(scan),
    changeTargets: selectProjectChangeTargets(scan)
  };
}

export async function buildAreaContextPack(input: AreaContextInput): Promise<ContextPack> {
  const { scan, area } = input;
  const modules = scan.graph.modules.filter((module) => area.modules.includes(module.id));
  const relatedTests = uniqueSorted(scan.graph.tests
    .filter((test) =>
      area.files.includes(test.path) ||
      (test.testedFile ? area.files.includes(test.testedFile) : false) ||
      (test.testedFiles ? test.testedFiles.some((file) => area.files.includes(file)) : false)
    )
    .map((test) => test.path));
  const relatedRoutes = uniqueSorted(scan.graph.routes.filter((route) => area.files.includes(route.file)).map((route) => route.file));
  const relatedImports = uniqueSorted(scan.graph.imports
    .filter((edge) => area.files.includes(edge.from) || area.files.includes(edge.to))
    .flatMap((edge) => [edge.from, edge.to]));
  const entryFiles = selectAreaEntryFiles(scan, area.files);
  const consumers = selectAreaConsumers(scan, area.files);
  const splitAreaConsumers = splitConsumers(consumers);
  const incomingFlows = buildAreaFlows(scan).filter((flow) => flow.toId === area.id);
  const outgoingFlows = buildAreaFlows(scan).filter((flow) => flow.fromId === area.id);
  const changePaths = selectModuleChangePaths(scan, area.files);
  const changeTargets = selectModuleChangeTargets(scan, area.files, 8);
  const verificationHints = selectAreaVerificationHints(scan, area.files);
  const priorityFiles = uniquePreserveOrder([
    ...entryFiles.map((entry) => entry.path),
    ...changePaths.flatMap((path) => path.files),
    ...verificationHintFiles(verificationHints)
  ]);
  const files = await selectFiles(scan, [...selectModuleFocusFiles(scan, area.files, [...relatedTests, ...relatedRoutes, ...relatedImports]), ...scan.project.configFiles], priorityFiles);
  return {
    scope: "area",
    title: area.name,
    summaryHint: area.purpose ?? `Explain the ${area.name} functional area and how its modules work together.`,
    files,
    knowledge: filterKnowledge(scan, ["area", "module", "route", "test", "config", "dependency"]).filter((item) => item.files.some((file) => area.files.includes(file))),
    relations: [
      relation("Area modules", modules.map((module) => module.rootPath), "Modules grouped into this functional area."),
      relation("Root paths", area.rootPaths, "Folder or file roots that define the area."),
      relation("Entry files", entryFiles.map((entry) => entry.path), "Best starting points inside this area."),
      relation("Runtime consumers", splitAreaConsumers.runtime.map((consumer) => consumer.path), "Runtime-like files outside the area that depend on it."),
      relation("Test consumers", splitAreaConsumers.tests.map((consumer) => consumer.path), "Test files outside the area that depend on it."),
      relation("Incoming area flows", incomingFlows.map((flow) => flow.fromName), "Areas that import into this area."),
      relation("Outgoing area flows", outgoingFlows.map((flow) => flow.toName), "Areas this area imports into."),
      relation("Related tests", relatedTests, "Tests that exercise area files or their direct targets."),
      relation("Related routes", relatedRoutes, "Routes backed by files in this area.")
    ],
    flows: buildAreaFlows(scan)
      .filter((flow) => flow.fromId === area.id || flow.toId === area.id)
      .slice(0, 6)
      .map((flow) => ({
        title: `${flow.fromName} -> ${flow.toName}`,
        note: `Area flow between ${flow.fromName} and ${flow.toName}.`,
        steps: [
          `Follow ${flow.fromName} into ${flow.toName}.`,
          "Check the linked module pages for the file-level path.",
          relatedTests.length ? "Use the related tests to confirm the change." : "No related tests were detected."
        ],
        files: uniqueSorted([...area.files.slice(0, 4), ...relatedTests.slice(0, 3), ...relatedRoutes.slice(0, 3)])
      })),
    verificationHints,
    changePaths,
    changeTargets
  };
}

export async function buildModuleContextPack(input: ModuleContextInput): Promise<ContextPack> {
  const { scan, module } = input;
  const relatedTests = uniqueSorted(scan.graph.tests
    .filter((test) =>
      module.files.includes(test.path) ||
      (test.testedFile ? module.files.includes(test.testedFile) : false) ||
      (test.testedFiles ? test.testedFiles.some((file) => module.files.includes(file)) : false)
    )
    .map((test) => test.path));
  const relatedRoutes = uniqueSorted(scan.graph.routes.filter((route) => module.files.includes(route.file)).map((route) => route.file));
  const relatedImports = uniqueSorted(scan.graph.imports
    .filter((edge) => module.files.includes(edge.from) || module.files.includes(edge.to))
    .flatMap((edge) => [edge.from, edge.to]));
  const importers = uniqueSorted(scan.graph.imports.filter((edge) => module.files.includes(edge.to) && !module.files.includes(edge.from)).map((edge) => edge.from));
  const internalImports = uniqueSorted(scan.graph.imports
    .filter((edge) => module.files.includes(edge.from) && module.files.includes(edge.to))
    .flatMap((edge) => [edge.from, edge.to]));
  const moduleAreas = uniquePreserveOrder(orderedAreas(scan).filter((area) => area.modules.includes(module.id)).map((area) => area.name));
  const entryFiles = selectModuleEntryFiles(scan, module.files);
  const consumers = selectModuleConsumers(scan, module.files);
  const splitModuleConsumers = splitConsumers(consumers);
  const changePaths = selectModuleChangePaths(scan, module.files);
  const verificationHints = selectModuleVerificationHints(scan, module.files);
  const priorityFiles = uniquePreserveOrder([
    ...entryFiles.map((entry) => entry.path),
    ...changePaths.flatMap((path) => path.files),
    ...verificationHintFiles(verificationHints)
  ]);
  const files = await selectFiles(scan, [...selectModuleFocusFiles(scan, module.files, [...relatedTests, ...relatedRoutes, ...relatedImports]), ...scan.project.configFiles], priorityFiles);
  return {
    scope: "module",
    title: moduleLabel(module),
    summaryHint: module.purpose ?? `Explain what the ${module.name} module at ${module.rootPath} does and where to change it safely.`,
    files,
    knowledge: filterKnowledge(scan, ["area", "module", "route", "test", "config", "dependency"]).filter((item) => item.files.some((file) => module.files.includes(file) || relatedTests.includes(file) || relatedRoutes.includes(file))),
    relations: [
      relation("Module files", module.files, "Files that belong to this module."),
      relation("Entry files", entryFiles.map((entry) => entry.path), "Files that look like the best starting points inside this module."),
      relation("Module areas", moduleAreas, "Connected areas that include this module."),
      relation("Runtime consumers", splitModuleConsumers.runtime.map((consumer) => consumer.path), "Runtime-like files outside the module that depend on it."),
      relation("Test consumers", splitModuleConsumers.tests.map((consumer) => consumer.path), "Test files outside the module that depend on it."),
      relation("Importers", importers, "Files outside the module that import from it."),
      relation("Internal imports", internalImports, "Internal file-to-file dependencies within the module."),
      relation("Related tests", relatedTests, "Tests that exercise module files or their targets."),
      relation("Related routes", relatedRoutes, "Routes backed by files in this module.")
    ],
    flows: buildModuleFlows(scan, module.files, relatedRoutes, relatedTests, relatedImports, entryFiles, consumers),
    verificationHints,
    changePaths: selectModuleChangePaths(scan, module.files),
    changeTargets: selectModuleChangeTargets(scan, module.files)
  };
}

export async function buildRouteContextPack(input: RouteContextInput): Promise<ContextPack> {
  const { scan, route } = input;
  const module = scan.graph.modules.find((candidate) => candidate.files.includes(route.file));
  const moduleFiles = module?.files ?? [];
  const relatedTests = uniqueSorted(scan.graph.tests
    .filter((test) =>
      test.path.includes(path.posix.dirname(route.file)) ||
      (test.testedFile ? moduleFiles.includes(test.testedFile) : false) ||
      (test.testedFiles ? test.testedFiles.some((file) => moduleFiles.includes(file)) : false)
    )
    .map((test) => test.path));
  const relatedImports = uniqueSorted(scan.graph.imports
    .filter((edge) => edge.from === route.file || edge.to === route.file)
    .flatMap((edge) => [edge.from, edge.to]));
  const moduleAreas = uniquePreserveOrder(module ? orderedAreas(scan).filter((area) => area.modules.includes(module.id)).map((area) => area.name) : []);
  const changePaths = selectRouteChangePaths(scan, route.file);
  const verificationHints = selectRouteVerificationHints(scan, route.file);
  const priorityFiles = uniquePreserveOrder([
    route.file,
    ...changePaths.flatMap((path) => path.files),
    ...verificationHintFiles(verificationHints)
  ]);
  const files = await selectFiles(scan, [...selectModuleFocusFiles(scan, [route.file, ...moduleFiles], [...relatedTests, ...relatedImports], 10), ...scan.project.configFiles], priorityFiles);
  return {
    scope: "route",
    title: `${route.method ?? "ANY"} ${route.path ?? "(unknown path)"}`.trim(),
    summaryHint: module
      ? `Explain the route ${route.method ?? "ANY"} ${route.path ?? "(unknown path)"} and how it relates to module ${moduleLabel(module)}.`
      : `Explain the route ${route.method ?? "ANY"} ${route.path ?? "(unknown path)"}.`,
    files,
    knowledge: filterKnowledge(scan, ["area", "route", "module", "test", "config", "dependency"]).filter((item) => item.files.some((file) => file === route.file || moduleFiles.includes(file) || relatedTests.includes(file))),
    relations: [
      relation("Route file", [route.file], "The file where the route is detected."),
      relation("Module files", moduleFiles, "Files in the module that owns the route, when a module is detected."),
      relation("Module areas", moduleAreas, "Connected areas that include the route's owning module."),
      relation("Related tests", relatedTests, "Tests in the same area or covering the route implementation."),
      relation("Related imports", relatedImports, "Files directly linked to the route file through imports.")
    ],
    flows: buildRouteFlows(route, module?.name, moduleFiles, relatedTests, relatedImports),
    verificationHints,
    changePaths,
    changeTargets: selectRouteChangeTargets(scan, route.file)
  };
}

export async function writeContextPacks(scan: RepoScan): Promise<string[]> {
  return writeContextPacksSelective(scan, {});
}

export type ContextPackWriteOptions = {
  areas?: "all" | string[];
  modules?: "all" | string[];
  routes?: "all" | string[];
  cleanAreas?: boolean;
  cleanModules?: boolean;
  cleanRoutes?: boolean;
  previousIndex?: RepoWikiIndex;
};

export async function writeContextPacksSelective(scan: RepoScan, options: ContextPackWriteOptions): Promise<string[]> {
  const contextRoot = path.join(scan.rootDir, ".repowiki/context");
  const written: string[] = [];
  const projectPack = await buildProjectContextPack(scan);
  await writeJson(path.join(contextRoot, "project.json"), projectPack);
  written.push(".repowiki/context/project.json");

  const selectedAreas = options.areas === "all" || options.areas === undefined
    ? scan.graph.areas
    : scan.graph.areas.filter((area) => options.areas?.includes(area.id));
  for (const area of selectedAreas) {
    const areaPack = await buildAreaContextPack({ scan, area });
    await writeJson(path.join(contextRoot, "areas", `${area.id}.json`), areaPack);
    written.push(`.repowiki/context/areas/${area.id}.json`);
  }

  const selectedModules = options.modules === "all" || options.modules === undefined
    ? scan.graph.modules
    : scan.graph.modules.filter((module) => options.modules?.includes(module.id));
  for (const module of selectedModules) {
    const modulePack = await buildModuleContextPack({ scan, module });
    await writeJson(path.join(contextRoot, "modules", `${module.id}.json`), modulePack);
    written.push(`.repowiki/context/modules/${module.id}.json`);
  }

  const selectedRoutes = options.routes === "all" || options.routes === undefined
    ? scan.graph.routes
    : scan.graph.routes.filter((route) => options.routes?.includes(routeContextKey(route)));
  for (const route of selectedRoutes) {
    const routePack = await buildRouteContextPack({ scan, route });
    const routeFile = `routes/${routeContextFileName(route)}`;
    await writeJson(path.join(contextRoot, routeFile), routePack);
    written.push(`.repowiki/context/${routeFile}`);
  }

  if (options.cleanModules && options.previousIndex) {
    const currentModules = new Set(scan.graph.modules.map((module) => module.id));
    for (const moduleName of Object.keys(options.previousIndex.moduleContextFiles ?? {})) {
      if (!currentModules.has(moduleName)) {
        await fs.rm(path.join(contextRoot, "modules", `${moduleName}.json`), { force: true });
      }
    }
  }

  if (options.previousIndex) {
    const currentAreas = new Set(scan.graph.areas.map((area) => area.id));
    for (const areaId of Object.keys(options.previousIndex.areaContextFiles ?? {})) {
      if (!currentAreas.has(areaId)) {
        await fs.rm(path.join(contextRoot, "areas", `${areaId}.json`), { force: true });
      }
    }
  }

  if (options.cleanRoutes && options.previousIndex) {
    const currentRoutes = new Set(scan.graph.routes.map((route) => routeContextKey(route)));
    for (const routeKey of Object.keys(options.previousIndex.routeContextFiles ?? {})) {
      if (!currentRoutes.has(routeKey)) {
        await fs.rm(path.join(contextRoot, "routes", `${sanitizePathFragment(routeKey)}.json`), { force: true });
      }
    }
  }

  return written;
}

export function routeContextKey(route: import("../types/index.js").RouteRecord): string {
  return `${route.file}:${route.method ?? "ANY"}:${route.path ?? "unknown"}`;
}

export function routeContextFileName(route: import("../types/index.js").RouteRecord): string {
  return sanitizePathFragment(routeContextKey(route)) + ".json";
}

export function sanitizePathFragment(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "") || "route";
}

async function selectFiles(scan: RepoScan, files: string[], priorityFiles: string[] = []): Promise<ContextFile[]> {
  const unique = uniquePreserveOrder([...priorityFiles, ...files]).slice(0, maxContextFiles);
  const selected: ContextFile[] = [];
  for (const file of unique) {
    const record = scan.graph.files.find((entry) => entry.path === file);
    if (!record) continue;
    selected.push({
      path: record.path,
      language: record.language,
      imports: record.imports.slice(0, 20),
      exports: record.exports.slice(0, 20),
      symbols: record.symbols.slice(0, 20),
      snippet: await readSnippet(scan.rootDir, record)
    });
  }
  return selected;
}

async function readSnippet(rootDir: string, record: import("../types/index.js").FileRecord): Promise<string> {
  try {
    const content = await fs.readFile(path.join(rootDir, record.path), "utf8");
    const allLines = content.split(/\r?\n/);

    // Prefer snippets centered on the first exported symbol when available.
    const anchorSymbol = record.symbols.find((symbol) => symbol.exported && symbol.line) ?? record.symbols.find((symbol) => symbol.line);
    let startLine = 0;
    if (anchorSymbol?.line) {
      startLine = Math.max(0, anchorSymbol.line - 3);
    }

    const lines = allLines.slice(startLine, startLine + defaultSnippetLines);
    const snippet = lines.join("\n");
    return snippet.length > maxSnippetChars ? `${snippet.slice(0, maxSnippetChars)}\n…` : snippet;
  } catch {
    return "";
  }
}

function filterKnowledge(scan: RepoScan, kinds: KnowledgeKind[]) {
  return scan.knowledge?.items.filter((item) => kinds.includes(item.kind)) ?? [];
}

function relation(title: string, files: string[], note: string): ContextRelation {
  return {
    title,
    files: uniquePreserveOrder(files),
    note
  };
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort();
}

function uniquePreserveOrder(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function verificationHintFiles(hints: Array<{ files: string[] }>): string[] {
  return uniqueSorted(hints.flatMap((hint) => hint.files));
}

function buildProjectFlows(scan: RepoScan): ContextFlow[] {
  const moduleFileMap = new Map<string, string[]>();
  const moduleLabels = new Map<string, string>();
  for (const module of scan.graph.modules) {
    moduleFileMap.set(module.id, module.files);
    moduleLabels.set(module.id, moduleLabel(module));
  }
  const moduleEdges = [...new Set(scan.graph.imports.flatMap((edge) => {
    const from = moduleNameForFile(scan, edge.from);
    const to = moduleNameForFile(scan, edge.to);
    return from && to && from !== to ? [`${from}::${to}`] : [];
  }))].slice(0, 5);
  return moduleEdges.map((entry) => {
    const [from, to] = entry.split("::");
    const fromFiles = moduleFileMap.get(from) ?? [];
    const toFiles = moduleFileMap.get(to) ?? [];
    const fromLabel = moduleLabels.get(from) ?? from;
    const toLabel = moduleLabels.get(to) ?? to;
    return {
      title: `${fromLabel} -> ${toLabel}`,
      note: `Module ${fromLabel} imports module ${toLabel}.`,
      steps: [
        `Code in ${fromFiles[0] ?? fromLabel} depends on ${toFiles[0] ?? toLabel}.`,
        `Review the shared files in ${toLabel} before changing ${fromLabel}.`
      ],
      files: [...new Set([...fromFiles.slice(0, 3), ...toFiles.slice(0, 3)])]
    };
  });
}

function buildModuleFlows(
  scan: RepoScan,
  moduleFiles: string[],
  relatedRoutes: string[],
  relatedTests: string[],
  relatedImports: string[],
  entryFiles: Array<{ path: string; line?: number; reason: string }>,
  consumers: Array<{ path: string; count: number; targets: string[]; kind: "runtime" | "test" }>
): ContextFlow[] {
  const importEdges = scan.graph.imports.filter((edge) => moduleFiles.includes(edge.from) && moduleFiles.includes(edge.to));
  const flows: ContextFlow[] = [];
  if (entryFiles.length) {
    flows.push({
      title: "Entry file path",
      note: "Best starting points inside the module.",
      steps: [
        `Start with ${entryFiles[0]!.line ? `${entryFiles[0]!.path}:${entryFiles[0]!.line}` : entryFiles[0]!.path}.`,
        `Follow the exported behavior and related imports from there.`,
        relatedTests.length ? "Use the related tests to confirm the behavior you change." : "No related tests were detected."
      ],
      files: [...new Set([...entryFiles.slice(0, 3).map((entry) => entry.path), ...moduleFiles.slice(0, 4), ...relatedTests.slice(0, 3)])]
    });
  }
  if (relatedRoutes.length) {
    flows.push({
      title: "Route entry path",
      note: "Requests or route handlers connected to this module.",
      steps: [
        `Start from ${relatedRoutes[0]}.`,
        `Trace into the files in this module that the route touches.`,
        `Use the related tests to confirm expected behavior.`
      ],
      files: [...new Set([...relatedRoutes.slice(0, 3), ...moduleFiles.slice(0, 4), ...relatedTests.slice(0, 3)])]
    });
  }
  const consumer = consumers.find((entry) => entry.kind === "runtime") ?? consumers[0];
  if (consumer) {
    flows.push({
      title: consumer.kind === "runtime" ? "Runtime consumer path" : "Test consumer path",
      note: consumer.kind === "runtime" ? "Runtime-like files outside the module that depend on it." : "Test files outside the module that depend on it.",
      steps: [
        `${consumer.path} imports ${consumer.targets.slice(0, 2).join(", ")}.`,
        "Check the consumer before changing shared behavior in this module.",
        relatedTests.length ? "Confirm the change with related tests." : "No related tests were detected."
      ],
      files: [...new Set([consumer.path, ...consumer.targets.slice(0, 3), ...moduleFiles.slice(0, 4), ...relatedTests.slice(0, 3)])]
    });
  }
  if (importEdges.length) {
    const edge = importEdges[0];
    flows.push({
      title: "Internal import path",
      note: "A simple file-to-file dependency inside the module.",
      steps: [
        `${edge.from} imports ${edge.to}.`,
        `Start with the importer, then inspect the imported file for helper logic.`
      ],
      files: [...new Set([edge.from, edge.to, ...relatedTests.slice(0, 2)])]
    });
  }
  if (!flows.length && relatedImports.length) {
    flows.push({
      title: "Module dependency path",
      note: "Related files that help explain this module's implementation.",
      steps: [
        `Review the module files alongside their most related imports.`,
        `Use the adjacent tests to verify behavior.`
      ],
      files: [...new Set([...moduleFiles.slice(0, 4), ...relatedImports.slice(0, 4), ...relatedTests.slice(0, 2)])]
    });
  }
  return flows;
}

function buildRouteFlows(route: import("../types/index.js").RouteRecord, moduleName: string | undefined, moduleFiles: string[], relatedTests: string[], relatedImports: string[]): ContextFlow[] {
  return [
    {
      title: "Request handling path",
      note: moduleName ? `Route handled by module ${moduleName}.` : "Route handling path inferred from the route file.",
      steps: [
        `${route.method ?? "ANY"} ${route.path ?? "(unknown path)"}${route.controller ? ` via ${route.controller}` : ""} [${routeCoverageLabel(route)}]`,
        `Handled in ${route.file}.`,
        moduleName ? `Continue into module ${moduleName} files.` : "Continue into nearby related files.",
        relatedTests.length ? "Confirm behavior with route-related tests." : "No related tests were detected."
      ],
      files: [...new Set([route.file, ...moduleFiles.slice(0, 4), ...relatedTests.slice(0, 3), ...relatedImports.slice(0, 3)])]
    }
  ];
}

export function reduceContextPack(pack: ContextPack): ContextPack {
  const reducedFileCount = Math.max(2, Math.floor(pack.files.length / 2));
  const reducedFiles = pack.files.slice(0, reducedFileCount).map((file) => ({
    ...file,
    snippet: truncateSnippetLines(file.snippet, reducedSnippetLines)
  }));
  return {
    ...pack,
    files: reducedFiles,
    relations: pack.relations.map((relation) => ({
      ...relation,
      files: relation.files.slice(0, Math.max(3, Math.floor(relation.files.length / 2)))
    })),
    flows: pack.flows.slice(0, Math.max(1, Math.floor(pack.flows.length / 2)))
  };
}

function truncateSnippetLines(snippet: string, lines: number): string {
  const allLines = snippet.split(/\r?\n/);
  if (allLines.length <= lines) return snippet;
  const truncated = allLines.slice(0, lines).join("\n");
  return `${truncated}\n…`;
}

function moduleNameForFile(scan: RepoScan, file: string): string | undefined {
  return scan.graph.modules.find((module) => module.files.includes(file))?.id;
}
