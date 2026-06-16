import type { RepoScan } from "../types/index.js";
import { code, list, pluralize, statCards, section, callout, tableOfContents, linkCard } from "../utils/markdown.js";
import { generateModuleDiagram, generateRouteDiagram, generateLayeredDiagram, generateTestCoverageDiagram } from "../diagrams/generateDiagrams.js";
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
import { aiSummaryBody } from "../ai/summaryFormat.js";
import { orderedAreas } from "../knowledge/areaOrdering.js";
import { renderConsumerList, splitConsumers } from "../utils/consumers.js";
import { renderArchitectureStory } from "../utils/insightRenderer.js";

export function generateArchitectureDoc(scan: RepoScan): string {
  const incoming = new Map<string, number>();
  for (const edge of scan.graph.imports) incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
  const centralFiles = selectCentralFiles(scan, 10).map((file) => `${code(file)} — ${incoming.get(file) ?? 0} incoming imports`);
  const moduleFlows = buildModuleFlows(scan).map((flow) => `${code(flow.from)} → ${code(flow.to)}${flow.count > 1 ? ` (${flow.count} imports)` : ""}`);
  const areaFlows = buildAreaFlows(scan).slice(0, 8).map((flow) => `${code(flow.fromName)} → ${code(flow.toName)} (${flow.count} imports)`);
  const testCoverage = buildModuleTestCoverage(scan);
  const dbFiles = scan.graph.files
    .map((file) => file.path)
    .filter((file) => /(migrations|schema\.prisma|models|entities|drizzle|typeorm|sequelize|knex|\/db\/|^db\/)/i.test(file));
  const componentFiles = scan.graph.designSystem?.componentFiles ?? [];
  const tokenFiles = scan.graph.designSystem?.tokenFiles ?? [];
  const designFramework = scan.graph.designSystem?.framework;
  const componentLibraries = scan.graph.designSystem?.componentLibraries ?? [];
  const moduleDiagram = generateModuleDiagram(scan);
  const routeDiagram = generateRouteDiagram(scan);
  const layeredDiagram = generateLayeredDiagram(scan);
  const coverageDiagram = generateTestCoverageDiagram(scan);
  const routeSummaries = Object.entries(scan.summaries?.routes ?? {})
    .map(([key, summary]) => `- ${code(key)} — ${summary.content}`)
    .sort();
  const areas = orderedAreas(scan);
  const areaSummaries = areas.map((area) => {
    const summary = summaryExcerpt(scan.summaries?.areas?.[area.id]?.content ?? area.purpose ?? "Connected implementation area.");
    return `${code(area.name)} — ${summary}`;
  });
  const entryFiles = selectProjectEntryFiles(scan, 8);
  const consumers = selectProjectConsumers(scan, 8);
  const splitProjectConsumers = splitConsumers(consumers);
  const changePaths = selectProjectChangePaths(scan).slice(0, 4);
  const verificationHints = selectProjectVerificationHints(scan);
  const layeredAreas = groupAreasByLayer(scan);

  return `# Architecture

> How this system is organized: its layers, its dependencies, and the data that flows through it.

## At a Glance

${statCards([
  { label: "Modules", value: scan.graph.modules.length, hint: "isolated units" },
  { label: "Files", value: scan.graph.files.length, hint: "scanned" },
  { label: "Import edges", value: scan.graph.imports.length, hint: "dependencies" },
  { label: "Tests", value: scan.graph.tests.length, hint: "coverage files" },
  { label: "Routes", value: scan.graph.routes.length, hint: scan.graph.routes.length ? "API endpoints" : "no API" },
  { label: "Areas", value: scan.graph.areas.length, hint: "functional groups" }
])}

${tableOfContents([
  { anchor: "the-system-in-one-paragraph", label: "The System in One Paragraph" },
  { anchor: "layered-view", label: "Layered View" },
  { anchor: "module-map", label: "Module Map" },
  { anchor: "high-level-structure", label: "High-Level Structure" },
  { anchor: "module-areas", label: "Module Areas" },
  { anchor: "data-flow", label: "Data Flow" },
  { anchor: "key-files", label: "Key Files" },
  { anchor: "api-routes", label: "API Routes" },
  { anchor: "database-and-migrations", label: "Database & Migrations" },
  { anchor: "design-system", label: "Design System" },
  { anchor: "external-dependencies", label: "External Dependencies" },
  { anchor: "verification", label: "Verification" }
])}

## The System in One Paragraph

${scan.insights?.project?.overview ? scan.insights.project.overview : generateSystemOverview(scan)}

${scan.insights?.architecture ? `
## The Architectural Story

${renderArchitectureStory(scan.insights.architecture)}
` : ""}

${callout("tip", "Reading path", `If you're new here: read **Layered View** to see the system shape, then **Data Flow** to see how a request moves through it, then jump to the [module doc](modules/${firstModuleId(scan)}.md) you'll be changing.`)}

## Layered View

${callout("note", "What is a layer?", "Layers group modules by what they do, not where they live. Operations (entry points) call into Application Logic (domain code), which depends on Storage (persistence) and Shared Support (types, utilities). Presentation modules read everything and format output.")}

${list(layeredAreas.map(({ layer, areas: layerAreas }) => `**${layer}**: ${layerAreas.map((area) => `[${area.name}](areas/${areaDocFileName(area.id)})`).join(", ")}`), "_No layers detected._")}

### Layer Diagram

\`\`\`mermaid
${layeredDiagram}
\`\`\`

## Module Map

### Module Dependency Diagram

\`\`\`mermaid
${moduleDiagram}
\`\`\`

${callout("tip", "Reading the diagram", "An arrow from A to B means \"A imports from B\". The module at the head of the arrow is depended on; the module at the tail is the consumer. Most-used modules have many incoming arrows.")}

## High-Level Structure

${section("Modules", list(scan.graph.modules.map((module) => {
    const summary = scan.summaries?.modules?.[module.id]?.content
      ? aiSummaryBody(summaryExcerpt(scan.summaries.modules[module.id].content))
      : (module.purpose ?? "Detected from file structure.");
    return `${code(moduleLabel(module))} — ${summary}`;
  })))}

${callout("note", "What is a module?", `A module is a folder or file with a coherent purpose. Modules group related code so you can reason about one concern at a time. Click through to the [module docs](modules/${firstModuleId(scan)}.md) for file-level detail.`)}

## Module Areas

${section("Area Summaries", list(areaSummaries, "_No area summaries available._"))}

${section("Area Docs", list(areas.map((area) => `[${area.name}](areas/${areaDocFileName(area.id)}) — ${pluralize(area.modules.length, "module")}`), "_No area docs generated._"))}

## Data Flow

${callout("note", "How to read this", "An arrow from A to B means \"A imports from B\". The module at the head of the arrow is depended on; the module at the tail is the consumer. Modules with many incoming arrows are the most depended-on.")}

${list(moduleFlows, "_No inter-module flows detected._")}

## Area Flows

${list(areaFlows, "_No area-to-area flows detected._")}

## Test Coverage

### Coverage Diagram

\`\`\`mermaid
${coverageDiagram}
\`\`\`

${section("Coverage by Module", list(testCoverage.map((item) => `${code(item.module)} — ${item.count} test${item.count === 1 ? "" : "s"}${item.tests.length ? ` (${item.tests.slice(0, 3).map((test) => `${code(test.ref)} ${testCoveragePrefix(test)}`).join(", ")})` : ""}`), "_No module-level test coverage detected._"))}

## Key Files

${callout("note", "What makes a file \"key\"?", "Key files are the ones other files import from most often. Changing them ripples through the codebase, so read them carefully before editing.")}

${list(centralFiles)}

## Important Entry Files

${list(entryFiles.map((entry) => `${code(entry.line ? `${entry.path}:${entry.line}` : entry.path)} — ${entry.reason}`), "_No important entry files detected._")}

## API Routes

${callout("note", "Route diagram", "Routes are API entry points. The diagram below shows each route and the file that defines it.")}

\`\`\`mermaid
${routeDiagram}
\`\`\`

${list(scan.graph.routes.map((route) => `${route.method ? `${route.method} ` : ""}${route.path ?? "(unknown path)"}${route.controller ? ` (${route.controller})` : ""} [${routeCoverageLabel(route)}] in ${code(route.line ? `${route.file}:${route.line}` : route.file)}`), "_No routes detected._")}

${section("Route Summaries", list(routeSummaries, "_No route summaries available._"))}

## Database & Migrations

${list(dbFiles.map((file) => `Likely database-related: ${code(file)}`), "_No database or migration files detected._")}

## Design System

${list(
  [
    designFramework ? `UI framework: ${code(designFramework)}` : "No primary UI framework detected.",
    componentLibraries.length ? `Component libraries: ${componentLibraries.map(code).join(", ")}` : undefined,
    componentFiles.length ? `Component files: ${componentFiles.map(code).join(", ")}` : "No UI component files detected.",
    tokenFiles.length ? `Token files: ${tokenFiles.map(code).join(", ")}` : "No design token files detected.",
    scan.graph.designSystem?.hasStorybook ? "Storybook configuration detected." : "No Storybook configuration detected."
  ].filter((value): value is string => Boolean(value)),
  "_No design system detected._"
)}

See [Design system overview](design.md) for full component and token details.

## External Dependencies

${list(scan.project.dependencies.map(code), "_No runtime dependencies detected._")}

## Development Dependencies

${list(scan.project.devDependencies.map(code), "_No development dependencies detected._")}

## Runtime Consumers

${renderConsumerList(splitProjectConsumers.runtime, "the repo", "_No runtime consumers detected._")}

## Test Consumers

${renderConsumerList(splitProjectConsumers.tests, "the repo", "_No test consumers detected._")}

## Common Change Paths

${list(changePaths.map(formatChangePath), "_No common change paths detected._")}

## Verification

${list(verificationHints.map(formatVerificationHint), "_No project verification hints detected._")}

## Flow Docs

- [Flow overview](flows/index.md) — execution paths and module relationships
- [Module flow docs](flows/modules/${firstModuleId(scan)}.md) — per-module flow detail
`;
}

function firstModuleId(scan: RepoScan): string {
  return scan.graph.modules[0]?.id ?? "src-cli";
}

function generateSystemOverview(scan: RepoScan): string {
  const parts: string[] = [];
  const operationArea = scan.graph.areas.find((a) => a.id.includes("orchestration") || a.id.includes("cli"));
  const analysisArea = scan.graph.areas.find((a) => a.id.includes("analysis") || a.id.includes("graph") || a.id.includes("scanner"));
  const generationArea = scan.graph.areas.find((a) => a.id.includes("generation") || a.id.includes("docs"));
  const supportArea = scan.graph.areas.find((a) => a.id.includes("support") || a.id.includes("types"));

  parts.push(`${scan.project.name} is a ${scan.project.type} project with ${scan.graph.modules.length} modules organized into ${scan.graph.areas.length} functional areas.`);

  if (operationArea) {
    parts.push(`**Entry points** live in the ${code(operationArea.name)} area — these are the runnable scripts and CLI commands users invoke.`);
  }
  if (analysisArea) {
    parts.push(`**Domain logic** lives in the ${code(analysisArea.name)} area — this is where the core analysis and scanning happens.`);
  }
  if (generationArea) {
    parts.push(`**Output generation** lives in the ${code(generationArea.name)} area — this is where the system formats results into docs, diagrams, and AI summaries.`);
  }
  if (supportArea) {
    parts.push(`**Shared support** (types, helpers, utilities) lives in the ${code(supportArea.name)} area — every other area depends on it.`);
  }

  if (scan.graph.routes.length) {
    parts.push(`The system exposes ${scan.graph.routes.length} API routes.`);
  }
  return parts.join("\n\n");
}

function groupAreasByLayer(scan: RepoScan): Array<{ layer: string; areas: typeof scan.graph.areas }> {
  const groups: Record<string, typeof scan.graph.areas> = {};
  for (const area of scan.graph.areas) {
    const id = area.id.toLowerCase();
    let layer = "Other";
    if (id.includes("orchestration") || id.includes("cli") || id.includes("commands")) layer = "Operations & Entry Points";
    else if (id.includes("analysis") || id.includes("graph") || id.includes("scanner")) layer = "Application Logic (Analysis & Detection)";
    else if (id.includes("storage")) layer = "Storage & Persistence";
    else if (id.includes("generation") || id.includes("docs") || id.includes("knowledge") || id.includes("ai")) layer = "Presentation & Output Generation";
    else if (id.includes("support") || id.includes("types") || id.includes("utils")) layer = "Shared Support (Types, Utilities)";
    if (!groups[layer]) groups[layer] = [];
    groups[layer].push(area);
  }
  return Object.entries(groups).map(([layer, areas]) => ({ layer, areas }));
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
