import type { RepoScan } from "../types/index.js";
import { code, list, pluralize } from "../utils/markdown.js";
import { generateModuleDiagram, generateRouteDiagram } from "../diagrams/generateDiagrams.js";
import { selectCentralFiles } from "../knowledge/fileImportance.js";
import { buildAreaFlows } from "../knowledge/areaFlows.js";
import { testCoveragePrefix } from "../utils/testCoverage.js";
import { routeCoverageLabel } from "../utils/routeCoverage.js";
import { moduleLabel } from "../utils/moduleLabel.js";
import { areaDocFileName } from "../utils/docPaths.js";
import { formatChangePath } from "../utils/changePaths.js";
import { selectProjectChangePaths, selectProjectConsumers, selectProjectEntryFiles } from "../knowledge/moduleFocus.js";
import { formatVerificationHint, selectProjectVerificationHints } from "../knowledge/verification.js";
import { summaryExcerpt } from "../utils/summaryExcerpt.js";
import { orderedAreas } from "../knowledge/areaOrdering.js";
import { renderConsumerList, splitConsumers } from "../utils/consumers.js";

export function generateArchitectureDoc(scan: RepoScan): string {
  const incoming = new Map<string, number>();
  for (const edge of scan.graph.imports) incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
  const centralFiles = selectCentralFiles(scan, 10).map((file) => `${code(file)} - ${incoming.get(file) ?? 0} incoming imports`);
  const moduleFlows = buildModuleFlows(scan).map((flow) => `${code(flow.from)} -> ${code(flow.to)}${flow.count > 1 ? ` (${flow.count} imports)` : ""}`);
  const areaFlows = buildAreaFlows(scan).slice(0, 8).map((flow) => `${code(flow.fromName)} -> ${code(flow.toName)} (${flow.count} imports)`);
  const testCoverage = buildModuleTestCoverage(scan);
  const dbFiles = scan.graph.files
    .map((file) => file.path)
    .filter((file) => /(migrations|schema\.prisma|models|entities|drizzle|typeorm|sequelize|knex|\/db\/|^db\/)/i.test(file));
  const moduleDiagram = generateModuleDiagram(scan);
  const routeDiagram = generateRouteDiagram(scan);
  const routeSummaries = Object.entries(scan.summaries?.routes ?? {})
    .map(([key, summary]) => `- ${code(key)} - ${summary.content}`)
    .sort();
  const areas = orderedAreas(scan);
  const areaSummaries = areas.map((area) => {
    const summary = summaryExcerpt(scan.summaries?.areas?.[area.id]?.content ?? area.purpose ?? "Connected implementation area.");
    return `- ${code(area.name)} - ${summary}`;
  });
  const entryFiles = selectProjectEntryFiles(scan, 8);
  const consumers = selectProjectConsumers(scan, 8);
  const splitProjectConsumers = splitConsumers(consumers);
  const changePaths = selectProjectChangePaths(scan).slice(0, 4);
  const verificationHints = selectProjectVerificationHints(scan);

  return `# Architecture

## High-Level Structure

${list(scan.graph.modules.map((module) => `${code(moduleLabel(module))}: ${module.purpose ?? "Detected from file structure."}`))}

## Module Areas

${list(areas.map((area) => `${code(area.name)} - ${pluralize(area.modules.length, "module")}${area.rootPaths.length ? ` (${area.rootPaths.map(code).join(", ")})` : ""}${area.purpose ? ` - ${area.purpose}` : ""}`), "_No module areas detected._")}

## Area Summaries

${list(areaSummaries, "_No area summaries available._")}

## Area Docs

${list(areas.map((area) => `[${area.name}](areas/${areaDocFileName(area.id)}) - ${pluralize(area.modules.length, "module")}`), "_No area docs generated._")}

## Area Flows

${list(areaFlows, "_No area-to-area flows detected._")}

## Important Config Files

${list(scan.project.configFiles.map(code))}

## Import Graph Summary

- Import edges detected: ${scan.graph.imports.length}
- Files with imports: ${new Set(scan.graph.imports.map((edge) => edge.from)).size}

## Key Module Flows

${list(moduleFlows, "_No inter-module flows detected._")}

## Central Files

${list(centralFiles)}

## Important Entry Files

${list(entryFiles.map((entry) => `${code(entry.line ? `${entry.path}:${entry.line}` : entry.path)} - ${entry.reason}`), "_No important entry files detected._")}

## Test Coverage Summary

${list(testCoverage.map((item) => `${code(item.module)} - ${item.count} test${item.count === 1 ? "" : "s"}${item.tests.length ? ` (${item.tests.slice(0, 3).map((test) => `${code(test.ref)} ${testCoveragePrefix(test)}`).join(", ")})` : ""}`), "_No module-level test coverage detected._")}

## API Routes

${list(scan.graph.routes.map((route) => `${route.method ? `${route.method} ` : ""}${route.path ?? "(unknown path)"}${route.controller ? ` (${route.controller})` : ""} [${routeCoverageLabel(route)}] in ${code(route.line ? `${route.file}:${route.line}` : route.file)}`))}

## Route Summaries

${list(routeSummaries, "_No route summaries available._")}

## Database And Migrations

${list(dbFiles.map((file) => `Likely database-related: ${code(file)}`))}

## External Dependencies

${list(scan.project.dependencies.map(code))}

## Development Dependencies

${list(scan.project.devDependencies.map(code))}

## Runtime Consumers

${renderConsumerList(splitProjectConsumers.runtime, "the repo", "_No runtime consumers detected._")}

## Test Consumers

${renderConsumerList(splitProjectConsumers.tests, "the repo", "_No test consumers detected._")}

## Common Change Paths

${list(changePaths.map(formatChangePath), "_No common change paths detected._")}

## Verification

${list(verificationHints.map(formatVerificationHint), "_No project verification hints detected._")}

## Module Diagram

\`\`\`mermaid
${moduleDiagram}
\`\`\`

## Route Diagram

\`\`\`mermaid
${routeDiagram}
\`\`\`

## Flow Docs

- [Flow overview](flows/index.md)
`;
}

function buildModuleFlows(scan: RepoScan): Array<{ from: string; to: string; count: number }> {
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
    const key = `${fromModule}::${toModule}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => {
      const [from, to] = key.split("::");
      return { from: moduleLabels.get(from) ?? from, to: moduleLabels.get(to) ?? to, count };
    })
    .sort((a, b) => `${a.from}:${a.to}`.localeCompare(`${b.from}:${b.to}`));
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
