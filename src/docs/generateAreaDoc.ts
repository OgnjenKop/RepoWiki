import type { ModuleAreaRecord, RepoScan } from "../types/index.js";
import { code, list, pluralize } from "../utils/markdown.js";
import { moduleLabel } from "../utils/moduleLabel.js";
import { buildAreaFlows } from "../knowledge/areaFlows.js";
import { selectModuleChangeTargets } from "../knowledge/changeTargets.js";
import { formatChangeTargetSymbols } from "../utils/changeTargets.js";
import { formatVerificationHint, selectAreaVerificationHints } from "../knowledge/verification.js";
import { testCoveragePrefix } from "../utils/testCoverage.js";
import { routeCoverageLabel } from "../utils/routeCoverage.js";
import { selectAreaConsumers, selectAreaEntryFiles } from "../knowledge/areaFocus.js";
import { selectModuleChangePaths } from "../knowledge/moduleFocus.js";
import { formatChangePath } from "../utils/changePaths.js";
import { renderConsumerList, splitConsumers } from "../utils/consumers.js";

export function generateAreaDoc(scan: RepoScan, area: ModuleAreaRecord): string {
  const modules = scan.graph.modules.filter((module) => area.modules.includes(module.id));
  const summary = scan.summaries?.areas?.[area.id]?.content ?? area.purpose ?? "Connected implementation area.";
  const flows = buildAreaFlows(scan);
  const moduleConnections = buildModuleConnections(scan, modules);
  const tests = scan.graph.tests.filter((test) =>
    area.files.includes(test.path) ||
    (test.testedFile ? area.files.includes(test.testedFile) : false) ||
    (test.testedFiles ? test.testedFiles.some((file) => area.files.includes(file)) : false)
  );
  const routes = scan.graph.routes.filter((route) => area.files.includes(route.file));
  const incomingFlows = flows.filter((flow) => flow.toId === area.id);
  const outgoingFlows = flows.filter((flow) => flow.fromId === area.id);
  const entryFiles = selectAreaEntryFiles(scan, area.files);
  const consumers = selectAreaConsumers(scan, area.files);
  const splitAreaConsumers = splitConsumers(consumers);
  const centralFiles = rankAreaFiles(scan, area.files).slice(0, 8);
  const changePaths = selectModuleChangePaths(scan, area.files);
  const changeTargets = selectModuleChangeTargets(scan, area.files, 8);
  const verificationHints = selectAreaVerificationHints(scan, area.files);

  return `# ${area.name}

## Purpose

${area.purpose ?? "Connected implementation area."}

## Summary

${summary}

## Modules

${list(modules.map((module) => `[${moduleLabel(module)}](../modules/${module.id}.md) - ${pluralize(module.files.length, "file")}`), "_No modules detected in this area._")}

## Entry Files

${list(entryFiles.map((entry) => `${code(entry.line ? `${entry.path}:${entry.line}` : entry.path)} - ${entry.reason}`), "_No entry files detected._")}

## Root Paths

${list(area.rootPaths.map(code), "_No root paths detected._")}

## Key Files

${list(centralFiles.map(code), "_No key files detected._")}

## Module Connections

${list(moduleConnections, "_No module-to-module connections detected in this area._")}

## Area Flows In

${list(incomingFlows.map((flow) => `${code(flow.fromName)} -> ${code(flow.toName)} (${flow.count} imports)`), "_No incoming area flows detected._")}

## Area Flows Out

${list(outgoingFlows.map((flow) => `${code(flow.fromName)} -> ${code(flow.toName)} (${flow.count} imports)`), "_No outgoing area flows detected._")}

## Runtime Consumers

${renderConsumerList(splitAreaConsumers.runtime, "this area", "_No runtime consumers detected._")}

## Test Consumers

${renderConsumerList(splitAreaConsumers.tests, "this area", "_No test consumers detected._")}

## Common Change Paths

${list(changePaths.map(formatChangePath), "_No common change paths derived._")}

## Change Guidance

${list(changeTargets.map((target) => `${code(target.line ? `${target.path}:${target.line}` : target.path)} - ${target.reason}${formatChangeTargetSymbols(target) ? ` [Symbols: ${formatChangeTargetSymbols(target)}]` : ""}${target.caution ? ` (${target.caution})` : ""}`), "_No area-level change targets derived._")}

## Verification

${list(verificationHints.map(formatVerificationHint), "_No area-level verification hints derived._")}

## Related Tests

${list(tests.map((test) => `${code(test.line ? `${test.path}:${test.line}` : test.path)} ${testCoveragePrefix(test)}${test.testedFiles?.length ? ` ${test.testedFiles.map(code).join(", ")}` : test.testedFile ? ` ${code(test.testedFile)}` : ""}`), "_No related tests detected._")}

## Related Routes

${list(routes.map((route) => `${route.method ? `${route.method} ` : ""}${route.path ?? "(unknown path)"}${route.controller ? ` (${route.controller})` : ""} [${routeCoverageLabel(route)}] in ${code(route.line ? `${route.file}:${route.line}` : route.file)}`), "_No related routes detected._")}

## Files

${list(area.files.map(code), "_No files detected in this area._")}

## Navigation

- [Areas index](index.md)
- [Repo wiki index](../index.md)
- [Flow overview](../flows/index.md)

## Notes

- This page groups modules that appear to belong to the same functional area.
- Use the linked module pages for file-level details.
- Use the flow overview for cross-area movement.
`;
}

function rankAreaFiles(scan: RepoScan, files: string[]): string[] {
  const candidateSet = new Set(files);
  const incomingCounts = new Map<string, number>();
  const exportCounts = new Map<string, number>();
  const symbolCounts = new Map<string, number>();
  for (const edge of scan.graph.imports) {
    if (!candidateSet.has(edge.to)) continue;
    incomingCounts.set(edge.to, (incomingCounts.get(edge.to) ?? 0) + 1);
  }
  for (const file of scan.graph.files) {
    if (!candidateSet.has(file.path)) continue;
    exportCounts.set(file.path, file.exports.length);
    symbolCounts.set(file.path, file.symbols.length);
  }
  return [...candidateSet]
    .map((path) => ({
      path,
      score: (incomingCounts.get(path) ?? 0) * 100 + (exportCounts.get(path) ?? 0) * 10 + (symbolCounts.get(path) ?? 0) * 5
    }))
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path))
    .map((entry) => entry.path);
}

function buildModuleConnections(scan: RepoScan, modules: Array<{ id: string; name: string; rootPath: string; files: string[] }>): string[] {
  const moduleIds = new Set(modules.map((module) => module.id));
  const fileToModule = new Map<string, string>();
  const moduleLabels = new Map<string, string>();
  for (const module of modules) {
    moduleLabels.set(module.id, `${module.name} (${module.rootPath})`);
    for (const file of module.files) fileToModule.set(file, module.id);
  }
  const counts = new Map<string, number>();
  for (const edge of scan.graph.imports) {
    const fromModule = fileToModule.get(edge.from);
    const toModule = fileToModule.get(edge.to);
    if (!fromModule || !toModule || fromModule === toModule) continue;
    if (!moduleIds.has(fromModule) || !moduleIds.has(toModule)) continue;
    const key = `${moduleLabels.get(fromModule) ?? fromModule} -> ${moduleLabels.get(toModule) ?? toModule}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => `${code(key)}${count > 1 ? ` (${count} imports)` : ""}`)
    .sort();
}
