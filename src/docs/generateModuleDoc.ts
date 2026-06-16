import type { ModuleRecord, RepoScan } from "../types/index.js";
import { code, list, pluralize, callout, statCards, section, tableOfContents, breadcrumbs, keyValue } from "../utils/markdown.js";
import { selectModuleChangeTargets } from "../knowledge/changeTargets.js";
import { selectModuleConsumers, selectModuleEntryFiles } from "../knowledge/moduleFocus.js";
import { formatChangeTargetSymbols } from "../utils/changeTargets.js";
import { scriptCommand } from "../utils/packageManager.js";
import { testCoveragePrefix } from "../utils/testCoverage.js";
import { areaDocFileName } from "../utils/docPaths.js";
import { selectModuleChangePaths } from "../knowledge/moduleFocus.js";
import { formatChangePath } from "../utils/changePaths.js";
import { summaryExcerpt } from "../utils/summaryExcerpt.js";
import { aiSummaryBody, summaryLead } from "../ai/summaryFormat.js";
import { orderedAreas } from "../knowledge/areaOrdering.js";
import { renderConsumerList, splitConsumers } from "../utils/consumers.js";
import { renderModuleInsight } from "../utils/insightRenderer.js";

export function generateModuleDoc(scan: RepoScan, module: ModuleRecord): string {
  const files = scan.graph.files.filter((file) => module.files.includes(file.path));
  const exports = files.flatMap((file) =>
    file.exports.map((name) => {
      const symbol = file.symbols.find((entry) => entry.exported && entry.name === name);
      return symbol?.line ? `${code(name)} from ${code(`${file.path}:${symbol.line}`)}` : `${code(name)} from ${code(file.path)}`;
    })
  );
  const internalDeps = scan.graph.imports
    .filter((edge) => module.files.includes(edge.from) && module.files.includes(edge.to))
    .map((edge) => `${code(edge.from)} → ${code(edge.to)}`);
  const externalDeps = [...new Set(files.flatMap((file) => file.imports.filter((item) => !item.startsWith("."))))].sort();
  const tests = scan.graph.tests.filter((test) =>
    module.files.includes(test.path) ||
    (test.testedFile ? module.files.includes(test.testedFile) : false) ||
    (test.testedFiles ? test.testedFiles.some((file) => module.files.includes(file)) : false)
  );
  const entryFiles = selectModuleEntryFiles(scan, module.files);
  const consumers = selectModuleConsumers(scan, module.files);
  const splitModuleConsumers = splitConsumers(consumers);
  const changePaths = selectModuleChangePaths(scan, module.files);
  const changeTargets = selectModuleChangeTargets(scan, module.files, 5);
  const decisionPoints = buildDecisionPoints(changeTargets, tests);
  const verificationCommand = scan.project.scripts.test ? scriptCommand(scan.project.packageManager, "test") : undefined;
  const summary = scan.summaries?.modules?.[module.id]?.content
    ? summaryLead(scan.summaries.modules[module.id].content)
    : (module.purpose ?? "No summary available.");
  const areas = orderedAreas(scan).filter((area) => area.modules.includes(module.id));
  const areaSummaries = areas.map((area) => `[${area.name}](../areas/${areaDocFileName(area.id)}) — ${summaryExcerpt(scan.summaries?.areas?.[area.id]?.content ?? area.purpose ?? "Connected implementation area.")}`);
  const moduleStory = buildModuleStory(scan, module, entryFiles, consumers, changeTargets, tests);
  const insight = scan.insights?.moduleInsights?.[module.id];

  return `# ${module.name}

${breadcrumbs([
  { label: "Wiki", href: "../index.md" },
  { label: "Modules", href: "../index.md#modules" },
  { label: module.name }
])}

## At a Glance

${statCards([
  { label: "Files", value: module.files.length, hint: `in ${code(module.rootPath)}` },
  { label: "Entry files", value: entryFiles.length, hint: "imported by others" },
  { label: "Exports", value: exports.length, hint: "public API" },
  { label: "Tests", value: tests.length, hint: "covering files" }
])}

## What This Module Does

${summary}

${insight ? `
## Design Insights

${renderModuleInsight(insight)}
` : ""}

${callout("note", "Module path", `${code(module.rootPath)} contains ${pluralize(module.files.length, "file")}. Open the path in your editor to see them all.`)}

## How It Fits In

${areas.length ? `This module is part of ${pluralize(areas.length, "functional area")}: ${areas.map((area) => `[${area.name}](../areas/${areaDocFileName(area.id)})`).join(", ")}.` : "_No connected module areas detected._"}

${insight?.relatedConcepts?.length ? `${callout("note", "Related concepts", list(insight.relatedConcepts))}` : ""}

${section("Area Summaries", list(areaSummaries, "_No connected area summaries available._"))}

${tableOfContents([
  { anchor: "what-this-module-does", label: "What This Module Does" },
  { anchor: "how-it-fits-in", label: "How It Fits In" },
  { anchor: "entry-files", label: "Entry Files" },
  { anchor: "main-files", label: "Main Files" },
  { anchor: "exported-symbols", label: "Exported Symbols" },
  { anchor: "dependencies", label: "Dependencies" },
  { anchor: "consumers", label: "Consumers" },
  { anchor: "common-change-paths", label: "Common Change Paths" },
  { anchor: "related-tests", label: "Related Tests" },
  { anchor: "change-guidance", label: "Change Guidance" },
  { anchor: "verification", label: "Verification" }
])}

## Entry Files

${callout("tip", "What is an entry file?", "An entry file is one that other files import from. Read these first to understand the module's public surface.")}

${list(entryFiles.map((entry) => `${code(entry.line ? `${entry.path}:${entry.line}` : entry.path)} — ${entry.reason}`), "_No entry files detected._")}

## Main Files

${list(module.files.map(code))}

## Exported Symbols

${callout("note", "Public API", "These are the symbols other modules import. Changes here may break consumers — check [Consumers](#consumers) before editing.")}

${list(exports)}

## Dependencies

${callout("note", "Internal vs external", "Internal dependencies are imports from other files in this module. External dependencies are npm packages or other outside code.")}

${section("Internal Dependencies", list(internalDeps, "_No internal dependencies._"))}

${section("External Dependencies", list(externalDeps.map(code), "_No external dependencies._"))}

## Consumers

${callout("note", "Runtime vs test consumers", "Runtime consumers are other source files that import this module. Test consumers are test files that exercise it. Both matter: runtime changes affect behavior, test changes affect coverage.")}

${section("Runtime Consumers", renderConsumerList(splitModuleConsumers.runtime, "this module", "_No runtime consumers detected._"))}

${section("Test Consumers", renderConsumerList(splitModuleConsumers.tests, "this module", "_No test consumers detected._"))}

## Common Change Paths

${list(changePaths.map(formatChangePath), "_No common change paths derived._")}

## Related Tests

${list(tests.map((test) => `${code(test.line ? `${test.path}:${test.line}` : test.path)} ${testCoveragePrefix(test)}${test.testedFiles?.length ? ` ${test.testedFiles.map(code).join(", ")}` : test.testedFile ? ` ${code(test.testedFile)}` : ""}`), "_No related tests detected._")}

## Change Guidance

${list(changeTargets.map((target) => `${code(target.line ? `${target.path}:${target.line}` : target.path)} — ${target.reason}${formatChangeTargetSymbols(target) ? ` [Symbols: ${formatChangeTargetSymbols(target)}]` : ""}${target.caution ? ` (${target.caution})` : ""}`), "_No change targets derived._")}

${section("Decision Points", list(decisionPoints, "_No decision points derived._"))}

## Verification

${list([
  tests.length ? `Related tests: ${tests.map((test) => code(test.line ? `${test.path}:${test.line}` : test.path)).join(", ")}` : "_No related tests detected._",
  verificationCommand ? `Run: ${code(verificationCommand)}` : "_No test command detected._"
])}

${callout("important", "Before you commit", `After editing this module, regenerate the wiki with ${code("repowiki update")} so the docs stay accurate.`)}

## Notes For AI Agents

- Start by reading the entry files listed above.
- Treat the purpose summary as heuristic unless confirmed by code comments, tests, or README content.
- Update this wiki after changing public exports, routing, environment config, or test behavior.
`;
}

function buildModuleStory(
  scan: RepoScan,
  module: ModuleRecord,
  entryFiles: Array<{ path: string; line?: number; reason: string }>,
  consumers: Array<{ path: string; count: number; kind: "runtime" | "test" }>,
  changeTargets: Array<{ path: string; reason: string; caution?: string }>,
  tests: Array<{ path: string; line?: number }>
): string {
  const parts: string[] = [];
  if (entryFiles.length) {
    const first = entryFiles[0];
    const ref = first.line ? code(`${first.path}:${first.line}`) : code(first.path);
    parts.push(`**Start here:** ${ref}. ${first.reason}.`);
  }
  const runtimeCount = consumers.filter((c) => c.kind === "runtime").length;
  const testCount = consumers.filter((c) => c.kind === "test").length;
  if (runtimeCount || testCount) {
    const parts2: string[] = [];
    if (runtimeCount) parts2.push(`${pluralize(runtimeCount, "runtime consumer")}`);
    if (testCount) parts2.push(`${pluralize(testCount, "test consumer")}`);
    parts.push(`**Usage:** Imported by ${parts2.join(" and ")}. Changes here ripple to those files.`);
  }
  if (changeTargets.length && changeTargets[0].caution) {
    parts.push(`**Caution:** ${changeTargets[0].path} — ${changeTargets[0].caution}.`);
  }
  if (tests.length) {
    parts.push(`**Tests:** ${pluralize(tests.length, "test file")} cover this module. Run them with ${code(scan.project.scripts.test ? "npm run test" : "your test command")} after editing.`);
  }
  return parts.join("\n\n");
}

function buildDecisionPoints(
  changeTargets: Array<{ path: string; reason: string; caution?: string; line?: number }>,
  tests: Array<{ path: string; line?: number; testedFile?: string }>
): string[] {
  const points = [
    changeTargets[0] ? `Start with ${code(changeTargets[0].line ? `${changeTargets[0].path}:${changeTargets[0].line}` : changeTargets[0].path)} if you are changing public behavior.` : undefined,
    changeTargets[1] ? `Use ${code(changeTargets[1].line ? `${changeTargets[1].path}:${changeTargets[1].line}` : changeTargets[1].path)} as the next stop for supporting logic.` : undefined,
    tests[0] ? `Check ${code(tests[0].line ? `${tests[0].path}:${tests[0].line}` : tests[0].path)} before changing implementation details.` : undefined
  ].filter((value): value is string => Boolean(value));
  return [...new Set(points)];
}
