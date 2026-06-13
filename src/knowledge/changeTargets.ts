import type { ChangeTarget, ChangeTargetSymbol, RepoScan } from "../types/index.js";
import { rankImportantFiles } from "./fileImportance.js";
import { routeCoverageDescriptor } from "../utils/routeCoverage.js";

export function selectProjectChangeTargets(scan: RepoScan, limit = 6): ChangeTarget[] {
  const ordered = rankImportantFiles(scan, [
    "README.md",
    "package.json",
    ...scan.project.configFiles,
    ...scan.graph.files.map((file) => file.path)
  ]).slice(0, limit * 2);
  return toTargets(scan, ordered, "project").slice(0, limit);
}

export function selectModuleChangeTargets(scan: RepoScan, moduleFiles: string[], limit = 6): ChangeTarget[] {
  const relatedTests = scan.graph.tests
    .filter((test) => moduleFiles.includes(test.path) || (test.testedFile ? moduleFiles.includes(test.testedFile) : false))
    .map((test) => test.path);
  const relatedRoutes = scan.graph.routes.filter((route) => moduleFiles.includes(route.file)).map((route) => route.file);
  const importers = scan.graph.imports
    .filter((edge) => moduleFiles.includes(edge.to) && !moduleFiles.includes(edge.from))
    .map((edge) => edge.from);
  const ordered = rankImportantFiles(scan, [...moduleFiles, ...relatedTests, ...relatedRoutes, ...importers]).slice(0, limit * 2);
  return toTargets(scan, ordered, "module", moduleFiles, relatedTests, relatedRoutes, importers).slice(0, limit);
}

export function selectRouteChangeTargets(scan: RepoScan, routeFile: string, limit = 4): ChangeTarget[] {
  const module = scan.graph.modules.find((candidate) => candidate.files.includes(routeFile));
  const moduleFiles = module?.files ?? [];
  const relatedTests = scan.graph.tests
    .filter((test) => test.path.includes(routeFile.split("/").slice(0, -1).join("/")) || (test.testedFile ? moduleFiles.includes(test.testedFile) : false))
    .map((test) => test.path);
  const relatedImports = scan.graph.imports
    .filter((edge) => edge.from === routeFile || edge.to === routeFile)
    .flatMap((edge) => [edge.from, edge.to]);
  const ordered = rankImportantFiles(scan, [routeFile, ...moduleFiles, ...relatedTests, ...relatedImports]).slice(0, limit * 2);
  return toTargets(scan, ordered, "route", moduleFiles, relatedTests, [routeFile], relatedImports).slice(0, limit);
}

function toTargets(
  scan: RepoScan,
  paths: string[],
  scope: "project" | "module" | "route",
  moduleFiles: string[] = [],
  relatedTests: string[] = [],
  relatedRoutes: string[] = [],
  relatedImports: string[] = []
): ChangeTarget[] {
  const unique = [...new Set(paths.filter(Boolean))];
  return unique.map((path) => ({
    path,
    reason: describeTarget(scan, path, scope, moduleFiles, relatedTests, relatedRoutes, relatedImports),
    caution: describeCaution(scan, path, scope, moduleFiles),
    line: inferTargetLine(scan, path, scope, moduleFiles, relatedTests, relatedRoutes),
    symbols: inferTargetSymbols(scan, path)
  }));
}

function describeTarget(
  scan: RepoScan,
  filePath: string,
  scope: "project" | "module" | "route",
  moduleFiles: string[],
  relatedTests: string[],
  relatedRoutes: string[],
  relatedImports: string[]
): string {
  if (filePath === "README.md") return "Project overview and contributor guidance.";
  if (filePath === "package.json") return "Scripts, dependencies, and package-level entry points.";
  if (scan.project.configFiles.includes(filePath)) return "Configuration that shapes runtime or tooling behavior.";
  if (scope === "route" && filePath === relatedRoutes[0]) {
    const route = scan.graph.routes.find((entry) => entry.file === filePath);
    const prefix = route ? `${routeCoverageDescriptor(route)}` : "Route";
    return route?.controller ? `${prefix} entry file for ${route.controller}.` : `${prefix} entry file.`;
  }
  if (scope === "module" && relatedRoutes.includes(filePath)) {
    const route = scan.graph.routes.find((entry) => entry.file === filePath);
    const prefix = route ? `${routeCoverageDescriptor(route)}` : "Route";
    return route?.controller ? `${prefix} entry point for ${route.controller}.` : `${prefix} entry point for this module.`;
  }
  if (relatedTests.includes(filePath)) return "Tests that verify this area.";
  if (relatedImports.includes(filePath)) return "A directly connected implementation file.";
  const record = scan.graph.files.find((entry) => entry.path === filePath);
  if (!record) return "Relevant file selected by repository heuristics.";
  if (record.imports.length > 0 && record.exports.length > 0) return "A connected implementation file with both imports and exports.";
  if (record.imports.length > 0) return "A dependency-heavy file that influences nearby code.";
  if (record.exports.length > 0) return "A file that exposes behavior used elsewhere.";
  if (record.symbols.length > 0) return "A symbol-rich file that likely contains core logic.";
  if (moduleFiles.includes(filePath)) return "A file in the module boundary.";
  return "A relevant file for understanding or changing this scope.";
}

function describeCaution(
  scan: RepoScan,
  filePath: string,
  scope: "project" | "module" | "route",
  moduleFiles: string[]
): string | undefined {
  if (filePath === "package.json") return "Changing scripts or dependencies can affect the whole repo.";
  if (scan.project.configFiles.includes(filePath)) return "Configuration changes should be checked against build and runtime behavior.";
  if (scope === "route" && moduleFiles.includes(filePath)) return "This file is part of the route's owning module.";
  if (scope === "module" && filePath.endsWith("test.ts")) return "Update the test expectations if behavior changes.";
  return undefined;
}

function inferTargetLine(
  scan: RepoScan,
  filePath: string,
  scope: "project" | "module" | "route",
  moduleFiles: string[],
  relatedTests: string[],
  relatedRoutes: string[]
): number | undefined {
  const route = scan.graph.routes.find((entry) => entry.file === filePath);
  if (route?.line) return route.line;

  const test = scan.graph.tests.find((entry) => entry.path === filePath);
  if (test?.line) return test.line;

  const record = scan.graph.files.find((entry) => entry.path === filePath);
  if (!record) return undefined;

  const exported = record.symbols.find((symbol) => symbol.exported && symbol.line);
  if (exported?.line) return exported.line;

  const anySymbol = record.symbols.find((symbol) => symbol.line);
  if (anySymbol?.line) return anySymbol.line;

  if (scope === "project" && (filePath === "README.md" || filePath === "package.json")) return 1;
  if (scan.project.configFiles.includes(filePath)) return 1;
  if (moduleFiles.includes(filePath) || relatedTests.includes(filePath) || relatedRoutes.includes(filePath)) return 1;
  return undefined;
}

function inferTargetSymbols(scan: RepoScan, filePath: string): ChangeTargetSymbol[] | undefined {
  const record = scan.graph.files.find((entry) => entry.path === filePath);
  if (!record) return undefined;
  const symbols = [...record.symbols]
    .filter((symbol) => symbol.exported)
    .sort((a, b) => (a.line ?? Number.MAX_SAFE_INTEGER) - (b.line ?? Number.MAX_SAFE_INTEGER) || a.name.localeCompare(b.name))
    .slice(0, 4)
    .map((symbol) => ({ name: symbol.name, line: symbol.line }));
  return symbols.length ? symbols : undefined;
}
