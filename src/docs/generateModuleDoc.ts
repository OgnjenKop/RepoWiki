import type { ModuleRecord, RepoScan } from "../types/index.js";
import { code, heading, list } from "../utils/markdown.js";
import { selectModuleChangeTargets } from "../knowledge/changeTargets.js";
import { selectModuleConsumers, selectModuleEntryFiles } from "../knowledge/moduleFocus.js";
import { formatChangeTargetSymbols } from "../utils/changeTargets.js";
import { scriptCommand } from "../utils/packageManager.js";
import { testCoveragePrefix } from "../utils/testCoverage.js";
import { areaDocFileName } from "../utils/docPaths.js";
import { selectModuleChangePaths } from "../knowledge/moduleFocus.js";
import { formatChangePath } from "../utils/changePaths.js";
import { summaryExcerpt } from "../utils/summaryExcerpt.js";
import { orderedAreas } from "../knowledge/areaOrdering.js";
import { renderConsumerList, splitConsumers } from "../utils/consumers.js";

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
    .map((edge) => `${code(edge.from)} -> ${code(edge.to)}`);
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
  const summary = scan.summaries?.modules[module.id]?.content ?? module.purpose ?? "No summary available.";
  const areas = orderedAreas(scan).filter((area) => area.modules.includes(module.id));
  const areaSummaries = areas.map((area) => `[${area.name}](../areas/${areaDocFileName(area.id)}) - ${summaryExcerpt(scan.summaries?.areas?.[area.id]?.content ?? area.purpose ?? "Connected implementation area.")}`);

  return `# ${heading(module.name)}

## Purpose

${summary}

## Module Path

${code(module.rootPath)}

## Module Areas

${list(areas.map((area) => `[${area.name}](../areas/${areaDocFileName(area.id)}) - ${area.purpose ?? "Connected module area."}`), "_No connected module areas detected._")}

## Area Summaries

${list(areaSummaries, "_No connected area summaries available._")}

## Entry Files

${list(entryFiles.map((entry) => `${code(entry.line ? `${entry.path}:${entry.line}` : entry.path)} - ${entry.reason}`), "_No entry files detected._")}

## Main Files

${list(module.files.map(code))}

## Exported Symbols

${list(exports)}

## Internal Dependencies

${list(internalDeps)}

## External Dependencies

${list(externalDeps.map(code))}

## Runtime Consumers

${renderConsumerList(splitModuleConsumers.runtime, "this module", "_No runtime consumers detected._")}

## Test Consumers

${renderConsumerList(splitModuleConsumers.tests, "this module", "_No test consumers detected._")}

## Common Change Paths

${list(changePaths.map(formatChangePath), "_No common change paths derived._")}

## Related Tests

${list(tests.map((test) => `${code(test.line ? `${test.path}:${test.line}` : test.path)} ${testCoveragePrefix(test)}${test.testedFiles?.length ? ` ${test.testedFiles.map(code).join(", ")}` : test.testedFile ? ` ${code(test.testedFile)}` : ""}`))}

## Change Guidance

${list(changeTargets.map((target) => `${code(target.line ? `${target.path}:${target.line}` : target.path)} - ${target.reason}${formatChangeTargetSymbols(target) ? ` [Symbols: ${formatChangeTargetSymbols(target)}]` : ""}${target.caution ? ` (${target.caution})` : ""}`))}

## Decision Points

${list(decisionPoints, "_No decision points derived._")}

## Verification

${list([
  tests.length ? `Related tests: ${tests.map((test) => code(test.line ? `${test.path}:${test.line}` : test.path)).join(", ")}` : "_No related tests detected._",
  verificationCommand ? `Run: ${code(verificationCommand)}` : "_No test command detected._"
])}

## Notes For AI Agents

- Start by reading the main files listed above.
- Treat the purpose as heuristic unless confirmed by code comments, tests, or README content.
- Update this wiki after changing public exports, routing, environment config, or test behavior.
`;
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
