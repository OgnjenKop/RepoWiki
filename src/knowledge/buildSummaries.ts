import type { RepoKnowledge, RepoScan, RepoSummaries, SummaryRecord } from "../types/index.js";
import { routeCoverageDescriptor } from "../utils/routeCoverage.js";
import { moduleLabel } from "../utils/moduleLabel.js";
import { buildAreaFlows } from "./areaFlows.js";
import { orderedAreas } from "./areaOrdering.js";
import { selectModuleChangePaths, selectModuleConsumers, selectModuleEntryFiles, selectProjectEntryFiles, selectRouteChangePaths } from "./moduleFocus.js";
import { formatVerificationHint, selectAreaVerificationHints, selectModuleVerificationHints, selectRouteVerificationHints } from "./verification.js";
import { selectAreaConsumers, selectAreaEntryFiles } from "./areaFocus.js";
import { splitConsumers } from "../utils/consumers.js";

export function buildDeterministicSummaries(scan: RepoScan, knowledge: RepoKnowledge): RepoSummaries {
  const projectItem = knowledge.items.find((item) => item.kind === "project");
  const areas: Record<string, SummaryRecord> = {};
  for (const area of orderedAreas(scan)) {
    const areaItem = knowledge.items.find((item) => item.kind === "area" && item.id === area.id);
    areas[area.id] = {
      provider: "deterministic",
      content: buildAreaSummary(scan, area.id, area.purpose ?? area.name),
      sources: area.files.slice(0, 8)
    };
    if (areaItem) {
      areas[area.id] = {
        provider: "deterministic",
        content: buildAreaSummary(scan, area.id, areaItem.summary),
        sources: area.files.slice(0, 8)
      };
    }
  }
  const modules: Record<string, SummaryRecord> = {};

  for (const module of scan.graph.modules) {
    modules[module.id] = {
      provider: "deterministic",
      content: buildModuleSummary(scan, module.id, module.purpose),
      sources: module.files.slice(0, 8),
    };
  }

  const routes: Record<string, SummaryRecord> = {};
  for (const route of scan.graph.routes) {
    routes[routeSummaryKey(route)] = {
      provider: "deterministic",
      content: buildRouteSummary(scan, route),
      sources: [route.file]
    };
  }

  return {
    project: projectItem
      ? {
          provider: "deterministic",
          content: buildProjectSummary(scan, projectItem.summary),
          sources: projectItem.files,
        }
      : undefined,
    areas: Object.keys(areas).length ? areas : undefined,
    modules,
    routes: Object.keys(routes).length ? routes : undefined
  };
}

function buildAreaSummary(scan: RepoScan, areaId: string, purpose?: string): string {
  const area = scan.graph.areas.find((item) => item.id === areaId);
  if (!area) return purpose ?? `Area ${areaId} detected from repository structure.`;
  const modules = scan.graph.modules.filter((module) => area.modules.includes(module.id)).map((module) => moduleLabel(module)).slice(0, 4);
  const rootPaths = area.rootPaths.slice(0, 4);
  const entryFiles = selectAreaEntryFiles(scan, area.files).slice(0, 3).map((entry) => `${entry.path}${entry.line ? `:${entry.line}` : ""}`);
  const areaConsumers = splitConsumers(selectAreaConsumers(scan, area.files));
  const runtimeConsumers = areaConsumers.runtime.slice(0, 3).map((consumer) => `${consumer.path} -> ${consumer.targets.slice(0, 2).join(", ")}`);
  const testConsumers = areaConsumers.tests.slice(0, 3).map((consumer) => `${consumer.path} -> ${consumer.targets.slice(0, 2).join(", ")}`);
  const outgoingFlows = buildAreaFlows(scan).filter((flow) => flow.fromId === area.id).slice(0, 3).map((flow) => `${flow.fromName} -> ${flow.toName}`);
  const incomingFlows = buildAreaFlows(scan).filter((flow) => flow.toId === area.id).slice(0, 3).map((flow) => `${flow.fromName} -> ${flow.toName}`);
  const changePaths = selectModuleChangePaths(scan, area.files).slice(0, 3).map((path) => `${path.task}: ${path.files.slice(0, 3).join(", ")}${path.note ? ` - ${path.note}` : ""}${path.evidence.length ? ` (evidence: ${path.evidence.slice(0, 3).join(", ")})` : ""}`);
  const verificationHints = selectAreaVerificationHints(scan, area.files);
  const verification = verificationHints.length ? `Verification: ${verificationHints.map((hint) => formatVerificationHint(hint)).join(" ")}` : "";
  const parts = [
    purpose ?? `Connected area rooted at ${area.name}.`,
    modules.length ? `Modules: ${modules.join(", ")}.` : "",
    rootPaths.length ? `Root paths: ${rootPaths.join(", ")}.` : "",
    entryFiles.length ? `Entry files: ${entryFiles.join(", ")}.` : "",
    runtimeConsumers.length ? `Runtime consumers: ${runtimeConsumers.join(", ")}.` : "",
    testConsumers.length ? `Test consumers: ${testConsumers.join(", ")}.` : "",
    incomingFlows.length ? `Incoming area flows: ${incomingFlows.join(", ")}.` : "",
    outgoingFlows.length ? `Outgoing area flows: ${outgoingFlows.join(", ")}.` : "",
    changePaths.length ? `Common change paths: ${changePaths.join("; ")}.` : "",
    verification
  ].filter(Boolean);
  return parts.join(" ");
}

function buildModuleSummary(scan: RepoScan, moduleId: string, purpose?: string): string {
  const module = scan.graph.modules.find((item) => item.id === moduleId);
  if (!module) return purpose ?? `Module ${moduleId} detected from repository structure.`;
  const fileCount = module.files.length;
  const areas = orderedAreas(scan).filter((area) => area.modules.includes(module.id)).map((area) => area.name).slice(0, 3);
  const topFiles = module.files.slice(0, 4).join(", ");
  const exported = scan.graph.files
    .filter((file) => module.files.includes(file.path))
    .flatMap((file) => {
      const symbols = file.symbols.filter((symbol) => symbol.exported);
      if (symbols.length) {
        return symbols.map((symbol) => `${symbol.name}${symbol.line ? ` (${file.path}:${symbol.line})` : ` (${file.path})`}`);
      }
      return file.exports.map((name) => `${name} (${file.path})`);
    })
    .slice(0, 8);
  const routes = scan.graph.routes
    .filter((route) => module.files.includes(route.file))
    .slice(0, 3)
    .map((route) => `${route.method ?? "ANY"} ${route.path ?? "(unknown path)"}${route.line ? ` at ${route.file}:${route.line}` : ` in ${route.file}`}`);
  const importers = scan.graph.imports
    .filter((edge) => module.files.includes(edge.to) && !module.files.includes(edge.from))
    .map((edge) => edge.from);
  const entryFiles = selectModuleEntryFiles(scan, module.files).slice(0, 3).map((entry) => `${entry.path}${entry.line ? `:${entry.line}` : ""}`);
  const moduleConsumers = splitConsumers(selectModuleConsumers(scan, module.files));
  const runtimeConsumers = moduleConsumers.runtime.slice(0, 3).map((consumer) => `${consumer.path} -> ${consumer.targets.slice(0, 2).join(", ")}`);
  const testConsumers = moduleConsumers.tests.slice(0, 3).map((consumer) => `${consumer.path} -> ${consumer.targets.slice(0, 2).join(", ")}`);
  const internalEdges = scan.graph.imports
    .filter((edge) => module.files.includes(edge.from) && module.files.includes(edge.to))
    .slice(0, 1)
    .map((edge) => `${edge.from} -> ${edge.to}`);
  const changePaths = selectModuleChangePaths(scan, module.files).slice(0, 3).map((path) => `${path.task}: ${path.files.slice(0, 3).join(", ")}${path.note ? ` - ${path.note}` : ""}${path.evidence.length ? ` (evidence: ${path.evidence.slice(0, 3).join(", ")})` : ""}`);
  const verificationHints = selectModuleVerificationHints(scan, module.files);
  const verification = verificationHints.length ? `Verification: ${verificationHints.map((hint) => formatVerificationHint(hint)).join(" ")}` : "";
  const parts = [
    purpose ?? `Module rooted at ${module.rootPath}.`,
    `${fileCount} file${fileCount === 1 ? "" : "s"} belong to this module.`,
    topFiles ? `Main files: ${topFiles}.` : "",
    entryFiles.length ? `Entry files: ${entryFiles.join(", ")}.` : "",
    areas.length ? `Module areas: ${areas.join(", ")}.` : "",
    exported.length ? `Exported symbols include ${exported.join(", ")}.` : "",
    routes.length ? `Entry points: ${routes.join(", ")}.` : "",
    importers.length ? `Used by: ${uniqueSorted(importers).slice(0, 4).join(", ")}.` : "",
    runtimeConsumers.length ? `Runtime consumers: ${runtimeConsumers.join(", ")}.` : "",
    testConsumers.length ? `Test consumers: ${testConsumers.join(", ")}.` : "",
    changePaths.length ? `Common change paths: ${changePaths.join("; ")}.` : "",
    verification,
    internalEdges.length ? `Internal flow: ${internalEdges.join(", ")}.` : ""
  ].filter(Boolean);
  return parts.join(" ");
}

function buildProjectSummary(scan: RepoScan, baseSummary: string): string {
  const moduleEdges = [...new Set(scan.graph.imports.flatMap((edge) => {
    const from = moduleNameForFile(scan, edge.from);
    const to = moduleNameForFile(scan, edge.to);
    return from && to && from !== to ? [`${from} -> ${to}`] : [];
  }))].slice(0, 5);
  const moduleLabels = new Map(scan.graph.modules.map((module) => [module.id, moduleLabel(module)] as const));
  const labeledEdges = moduleEdges.map((edge) => {
    const [from, to] = edge.split(" -> ");
    return `${moduleLabels.get(from) ?? from} -> ${moduleLabels.get(to) ?? to}`;
  });
  const areaNames = orderedAreas(scan).map((area) => area.name).slice(0, 6);
  const areaFlows = buildAreaFlows(scan).slice(0, 5).map((flow) => `${flow.fromName} -> ${flow.toName}`);
  const entryFiles = selectProjectEntryFiles(scan, 8).map((entry) => entry.line ? `${entry.path}:${entry.line}` : entry.path);
  const parts = [baseSummary];
  if (areaNames.length) parts.push(`Key module areas: ${areaNames.join(", ")}.`);
  if (areaFlows.length) parts.push(`Key area flows: ${areaFlows.join(", ")}.`);
  if (entryFiles.length) parts.push(`Important entry files: ${entryFiles.join(", ")}.`);
  if (labeledEdges.length) parts.push(`Key module flows: ${labeledEdges.join(", ")}.`);
  return parts.join(" ");
}

function buildRouteSummary(scan: RepoScan, route: import("../types/index.js").RouteRecord): string {
  const method = route.method ?? "ANY";
  const pathValue = route.path ?? "(unknown path)";
  const handler = route.handler ? ` Handled by ${route.handler}.` : "";
  const controller = route.controller ? ` Inside ${route.controller}.` : "";
  const location = route.line ? `${route.file}:${route.line}` : route.file;
  const changePaths = selectRouteChangePaths(scan, route.file).slice(0, 2).map((path) => `${path.task}: ${path.files.slice(0, 3).join(", ")}${path.note ? ` - ${path.note}` : ""}${path.evidence.length ? ` (evidence: ${path.evidence.slice(0, 3).join(", ")})` : ""}`);
  const verificationHints = selectRouteVerificationHints(scan, route.file);
  const verification = verificationHints.length ? ` Verification: ${verificationHints.map((hint) => formatVerificationHint(hint)).join(" ")}` : "";
  const changePathText = changePaths.length ? ` Common change paths: ${changePaths.join("; ")}.` : "";
  return `${routeCoverageDescriptor(route)} ${method} ${pathValue} is detected in ${location}.${controller}${handler}${changePathText}${verification}`.trim();
}

function routeSummaryKey(route: import("../types/index.js").RouteRecord): string {
  return `${route.file}:${route.method ?? "ANY"}:${route.path ?? "unknown"}`;
}

function moduleNameForFile(scan: RepoScan, file: string): string | undefined {
  return scan.graph.modules.find((module) => module.files.includes(file))?.id;
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort();
}
