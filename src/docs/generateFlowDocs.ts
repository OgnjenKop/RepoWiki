import type { ModuleRecord, RepoScan } from "../types/index.js";
import { code, list, pluralize, callout, breadcrumbs, tableOfContents, statCards, section } from "../utils/markdown.js";
import { moduleLabel } from "../utils/moduleLabel.js";
import { scriptCommand } from "../utils/packageManager.js";
import { selectModuleChangeTargets } from "../knowledge/changeTargets.js";
import { buildAreaFlows } from "../knowledge/areaFlows.js";
import { formatChangeTargetSymbols } from "../utils/changeTargets.js";
import { testCoveragePrefix } from "../utils/testCoverage.js";
import { routeCoverageLabel } from "../utils/routeCoverage.js";
import { areaDocFileName } from "../utils/docPaths.js";
import { selectModuleChangePaths, selectModuleConsumers, selectModuleEntryFiles } from "../knowledge/moduleFocus.js";
import { formatChangePath } from "../utils/changePaths.js";
import { formatVerificationHint, selectProjectVerificationHints } from "../knowledge/verification.js";
import { summaryExcerpt } from "../utils/summaryExcerpt.js";
import { orderedAreas } from "../knowledge/areaOrdering.js";
import { renderConsumerList, splitConsumers } from "../utils/consumers.js";

export function generateFlowsIndexDoc(scan: RepoScan): string {
  const moduleEdges = buildModuleEdges(scan);
  const testCoverage = buildModuleTestCoverage(scan).map((item) => `${code(item.module)} — ${item.count} test${item.count === 1 ? "" : "s"}${item.tests.length ? ` (${item.tests.slice(0, 3).map((test) => `${code(test.ref)} ${testCoveragePrefix(test)}`).join(", ")})` : ""}`);
  const routeEntries = scan.graph.routes
    .map((route) => `${route.method ? `${route.method} ` : ""}${route.path ?? "(unknown path)"}${route.controller ? ` (${route.controller})` : ""} [${routeCoverageLabel(route)}] in ${code(route.line ? `${route.file}:${route.line}` : route.file)}`)
    .sort();
  const areaFlows = buildAreaFlows(scan).slice(0, 8).map((flow) => `${code(flow.fromName)} → ${code(flow.toName)} (${flow.count} imports)`);
  const areas = orderedAreas(scan);
  const areaSummaries = areas.map((area) => `[${area.name}](../areas/${areaDocFileName(area.id)}) — ${summaryExcerpt(scan.summaries?.areas?.[area.id]?.content ?? area.purpose ?? "Connected implementation area.")}`);
  const verificationHints = selectProjectVerificationHints(scan);

  return `# Flows

${breadcrumbs([{ label: "Wiki", href: "../index.md" }, { label: "Flows" }])}

## What This Shows

${callout("note", "About flow docs", "Flow docs explain how code moves through the repository: module imports, route entry points, and the files that shape behavior. Use this page to understand **execution paths** — what depends on what, and where changes propagate.")}

## Project Shape

${statCards([
  { label: "Modules", value: scan.graph.modules.length, hint: "detected" },
  { label: "Routes", value: scan.graph.routes.length, hint: "API endpoints" },
  { label: "Tests", value: scan.graph.tests.length, hint: "files" },
  { label: "Imports", value: scan.graph.imports.length, hint: "edges" }
])}

${tableOfContents([
  { anchor: "key-module-flows", label: "Key Module Flows" },
  { anchor: "module-areas", label: "Module Areas" },
  { anchor: "area-flows", label: "Area Flows" },
  { anchor: "test-coverage-map", label: "Test Coverage Map" },
  { anchor: "route-entry-points", label: "Route Entry Points" },
  { anchor: "verification", label: "Verification" },
  { anchor: "module-flow-docs", label: "Module Flow Docs" }
])}

## Key Module Flows

${callout("tip", "Reading the flows", "An arrow from A to B means \"A imports from B\". The module at the head of the arrow is depended on; the module at the tail is the consumer. Modules with many incoming arrows are the most depended-on.")}

${list(moduleEdges.map((edge) => `${code(edge.from)} → ${code(edge.to)}${edge.count > 1 ? ` (${edge.count} imports)` : ""}`), "_No inter-module flows detected._")}

## Module Areas

${list(areas.map((area) => `[${area.name}](../areas/${areaDocFileName(area.id)}) — ${pluralize(area.modules.length, "module")}`), "_No module areas detected._")}

${section("Area Summaries", list(areaSummaries, "_No area summaries available._"))}

## Area Flows

${list(areaFlows, "_No area-to-area flows detected._")}

## Test Coverage Map

${list(testCoverage, "_No module-level test coverage detected._")}

## Route Entry Points

${list(routeEntries, "_No routes detected._")}

## Verification

${list(verificationHints.map(formatVerificationHint), "_No project verification hints detected._")}

## Module Flow Docs

${list(scan.graph.modules.map((module) => `[${moduleLabel(module)}](modules/${module.id}.md) — ${pluralize(module.files.length, "file")}`))}

## How To Use

- Read this page first when you need the execution path, not just the high-level architecture.
- Open the module flow doc for the area you plan to change.
- Use the architecture page for broader structure and diagrams.
`;
}

export function generateModuleFlowDoc(scan: RepoScan, module: ModuleRecord): string {
  const moduleFiles = module.files;
  const summary = scan.summaries?.modules[module.id]?.content ?? module.purpose ?? "No summary available.";
  const areas = orderedAreas(scan).filter((area) => area.modules.includes(module.id));
  const areaSummaries = areas.map((area) => `[${area.name}](../areas/${areaDocFileName(area.id)}) — ${summaryExcerpt(scan.summaries?.areas?.[area.id]?.content ?? area.purpose ?? "Connected implementation area.")}`);
  const moduleConnections = buildModuleConnections(scan, module);
  const entryFiles = selectModuleEntryFiles(scan, moduleFiles);
  const relatedRoutes = uniqueSorted(scan.graph.routes.filter((route) => moduleFiles.includes(route.file)).map((route) => route.file));
  const relatedTests = scan.graph.tests.filter((test) =>
    moduleFiles.includes(test.path) ||
    (test.testedFile ? moduleFiles.includes(test.testedFile) : false) ||
    (test.testedFiles ? test.testedFiles.some((file) => moduleFiles.includes(file)) : false)
  );
  const consumers = selectModuleConsumers(scan, moduleFiles);
  const splitModuleConsumers = splitConsumers(consumers);
  const importers = uniqueSorted(scan.graph.imports.filter((edge) => moduleFiles.includes(edge.to) && !moduleFiles.includes(edge.from)).map((edge) => edge.from));
  const internalEdges = scan.graph.imports
    .filter((edge) => moduleFiles.includes(edge.from) && moduleFiles.includes(edge.to))
    .map((edge) => `${code(edge.from)} → ${code(edge.to)}`);
  const changePaths = selectModuleChangePaths(scan, moduleFiles);
  const externalDeps = [...new Set(
    scan.graph.files
      .filter((file) => moduleFiles.includes(file.path))
      .flatMap((file) => file.imports.filter((item) => !item.startsWith(".")))
  )].sort();
  const changeTargets = selectModuleChangeTargets(scan, module.files, 5);
  const buildCommand = scan.project.scripts.build ? scriptCommand(scan.project.packageManager, "build") : undefined;
  const testCommand = scan.project.scripts.test ? scriptCommand(scan.project.packageManager, "test") : undefined;

  return `# ${module.name} Flow

${breadcrumbs([
  { label: "Wiki", href: "../../index.md" },
  { label: "Flows", href: "../index.md" },
  { label: module.name }
])}

## Overview

${summary}

${callout("note", "Module path", `${code(module.rootPath)} contains this module's files.`)}

## Module Areas

${list(areas.map((area) => `[${area.name}](../../areas/${areaDocFileName(area.id)}) — ${area.purpose ?? "Connected module area."}`), "_No connected module areas detected._")}

${section("Area Summaries", list(areaSummaries, "_No connected area summaries available._"))}

## Entry Files

${list(entryFiles.map((entry) => `${code(entry.line ? `${entry.path}:${entry.line}` : entry.path)} — ${entry.reason}`), "_No entry files detected._")}

## Area Flows

${list(areaFlowsForModule(scan, module.id), "_No area-to-area flows detected for this module._")}

## Entry Points

${list([
  ...relatedRoutes.map((file) => {
    const route = scan.graph.routes.find((entry) => entry.file === file);
    return `${route?.method ?? "ANY"} ${route?.path ?? "(unknown path)"}${route?.controller ? ` (${route.controller})` : ""} [${route ? routeCoverageLabel(route) : "direct"}] in ${code(route?.line ? `${route.file}:${route.line}` : file)}`;
  }),
  ...relatedTests.map((test) => `${code(test.line ? `${test.path}:${test.line}` : test.path)} ${testCoveragePrefix(test)}${test.testedFiles?.length ? ` ${test.testedFiles.map(code).join(", ")}` : test.testedFile ? ` ${code(test.testedFile)}` : ""}`),
  ...importers.map((file) => `${code(file)} imports this module`)
], "_No clear runtime entry points detected._")}

## Common Change Paths

${list(changePaths.map(formatChangePath), "_No common change paths derived._")}

## Module Connections

${list(moduleConnections, "_No module-to-module connections detected._")}

## Internal Flow

${list(internalEdges, "_No internal module-to-module flow detected._")}

## External Dependencies

${list(externalDeps.map(code), "_No external dependencies detected._")}

## Runtime Consumers

${renderConsumerList(splitModuleConsumers.runtime, "this module", "_No runtime consumers detected._")}

## Test Consumers

${renderConsumerList(splitModuleConsumers.tests, "this module", "_No test consumers detected._")}

## Related Tests

${list(relatedTests.map((test) => `${code(test.line ? `${test.path}:${test.line}` : test.path)} ${testCoveragePrefix(test)}${test.testedFiles?.length ? ` ${test.testedFiles.map(code).join(", ")}` : test.testedFile ? ` ${code(test.testedFile)}` : ""}`), "_No related tests detected._")}

## Change Targets

${list(changeTargets.map((target) => `${code(target.line ? `${target.path}:${target.line}` : target.path)} — ${target.reason}${formatChangeTargetSymbols(target) ? ` [Symbols: ${formatChangeTargetSymbols(target)}]` : ""}${target.caution ? ` (${target.caution})` : ""}`))}

## Verification

${list([
  buildCommand ? `Run: ${code(buildCommand)}` : "_No build command detected._",
  relatedTests.length ? `Related tests: ${uniqueSorted(relatedTests.map((test) => code(test.line ? `${test.path}:${test.line}` : test.path))).join(", ")}` : "_No related tests detected._",
  testCommand ? `Run: ${code(testCommand)}` : "_No test command detected._"
])}
`;
}

function buildModuleEdges(scan: RepoScan): Array<{ from: string; to: string; count: number }> {
  const fileToModule = new Map<string, string>();
  const moduleLabels = new Map<string, string>();
  for (const module of scan.graph.modules) {
    moduleLabels.set(module.id, moduleLabel(module));
    for (const file of module.files) fileToModule.set(file, module.id);
  }
  const counts = new Map<string, number>();
  for (const edge of scan.graph.imports) {
    const fromModule = fileToModule.get(edge.from);
    const toModule = fileToModule.get(edge.to);
    if (!fromModule || !toModule || fromModule === toModule) continue;
    counts.set(`${fromModule}::${toModule}`, (counts.get(`${fromModule}::${toModule}`) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => {
      const [from, to] = key.split("::");
      return { from: moduleLabels.get(from) ?? from, to: moduleLabels.get(to) ?? to, count };
    })
    .sort((a, b) => `${a.from}:${a.to}`.localeCompare(`${b.from}:${b.to}`));
}

function buildModuleConnections(scan: RepoScan, module: ModuleRecord): string[] {
  const fileToModule = new Map<string, string>();
  const moduleLabels = new Map<string, string>();
  for (const candidate of scan.graph.modules) {
    moduleLabels.set(candidate.id, moduleLabel(candidate));
    for (const file of candidate.files) fileToModule.set(file, candidate.id);
  }
  const counts = new Map<string, number>();
  for (const edge of scan.graph.imports) {
    const fromModule = fileToModule.get(edge.from);
    const toModule = fileToModule.get(edge.to);
    if (!fromModule || !toModule || fromModule === toModule) continue;
    if (fromModule !== module.id && toModule !== module.id) continue;
    const key = fromModule === module.id
      ? `${moduleLabels.get(fromModule) ?? fromModule} → ${moduleLabels.get(toModule) ?? toModule}`
      : `${moduleLabels.get(toModule) ?? toModule} ← ${moduleLabels.get(fromModule) ?? fromModule}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => `${code(key)}${count > 1 ? ` (${count} imports)` : ""}`)
    .sort();
}

function buildModuleTestCoverage(scan: RepoScan): Array<{ module: string; count: number; tests: Array<{ ref: string; coverageConfidence?: "direct" | "inferred" | "fallback" }> }> {
  return scan.graph.modules
    .map((module) => {
      const tests = scan.graph.tests
        .filter((test) =>
          module.files.includes(test.path) ||
          (test.testedFile ? module.files.includes(test.testedFile) : false) ||
          (test.testedFiles ? test.testedFiles.some((file) => module.files.includes(file)) : false)
        )
        .map((test) => ({ ref: test.line ? `${test.path}:${test.line}` : test.path, coverageConfidence: test.coverageConfidence }));
      return { module: moduleLabel(module), count: tests.length, tests };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.module.localeCompare(b.module));
}

function areaFlowsForModule(scan: RepoScan, moduleId: string): string[] {
  const moduleAreas = new Set(orderedAreas(scan).filter((area) => area.modules.includes(moduleId)).map((area) => area.name));
  return buildAreaFlows(scan)
    .filter((flow) => moduleAreas.has(flow.fromName) || moduleAreas.has(flow.toName))
    .map((flow) => `${code(flow.fromName)} → ${code(flow.toName)} (${flow.count} imports)`)
    .sort();
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort();
}
