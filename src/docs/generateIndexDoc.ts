import type { RepoScan } from "../types/index.js";
import { code, list, pluralize } from "../utils/markdown.js";
import { moduleLabel } from "../utils/moduleLabel.js";
import { renderRepoWikiCommands, renderRepoWikiFlags } from "./repoWikiCli.js";
import { testCoveragePrefix } from "../utils/testCoverage.js";
import { buildAreaFlows } from "../knowledge/areaFlows.js";
import { areaDocFileName } from "../utils/docPaths.js";
import { formatChangePath } from "../utils/changePaths.js";
import { selectProjectChangePaths, selectProjectConsumers, selectProjectEntryFiles } from "../knowledge/moduleFocus.js";
import { formatVerificationHint, selectProjectVerificationHints } from "../knowledge/verification.js";
import { summaryExcerpt } from "../utils/summaryExcerpt.js";
import { orderedAreas } from "../knowledge/areaOrdering.js";
import { renderConsumerList, splitConsumers } from "../utils/consumers.js";

export function generateIndexDoc(scan: RepoScan): string {
  const scripts = Object.entries(scan.project.scripts).map(([name, value]) => `${code(name)}: ${code(value)}`);
  const structure = [...new Set(scan.graph.files.map((file) => file.path.split("/")[0]))].sort();
  const projectSummary = scan.summaries?.project?.content ?? scan.knowledge?.items.find((item) => item.kind === "project")?.summary;
  const areas = orderedAreas(scan);
  const areaSummaries = areas.map((area) => ({
    area,
    summary: summaryExcerpt(scan.summaries?.areas?.[area.id]?.content ?? area.purpose ?? "Connected implementation area.")
  }));
  const testCoverage = buildModuleTestCoverage(scan).map((item) => `${code(item.module)} - ${item.count} test${item.count === 1 ? "" : "s"}${item.tests.length ? ` (${item.tests.slice(0, 2).map((test) => `${code(test.ref)} ${testCoveragePrefix(test)}`).join(", ")})` : ""}`);
  const areaFlows = buildAreaFlows(scan).slice(0, 5).map((flow) => `${code(flow.fromName)} -> ${code(flow.toName)} (${flow.count} imports)`);
  const entryFiles = selectProjectEntryFiles(scan, 8);
  const consumers = selectProjectConsumers(scan, 8);
  const splitProjectConsumers = splitConsumers(consumers);
  const changePaths = selectProjectChangePaths(scan).slice(0, 4);
  const verificationHints = selectProjectVerificationHints(scan);
  return `# Repo Wiki

## Project Overview

- Project: ${scan.project.name}
- Detected stack: ${scan.project.type}
- Package manager: ${scan.project.packageManager}
- Files scanned: ${scan.graph.files.length}
- Modules detected: ${scan.graph.modules.length}

## Summary

${projectSummary ?? "No summary available yet."}

## Detected Stack

Detected from package metadata, config files, and repository structure.

## Main Scripts

${list(scripts)}

## Repository Structure

${list(structure.map((item) => code(item)))}

## Modules

${list(scan.graph.modules.map((module) => `[${moduleLabel(module)}](modules/${module.id}.md) - ${pluralize(module.files.length, "file")}`))}

## Area Docs

${list(areas.map((area) => `[${area.name}](areas/${areaDocFileName(area.id)}) - ${pluralize(area.modules.length, "module")}`), "_No area docs generated._")}

## Area Summaries

${list(areaSummaries.map(({ area, summary }) => `[${area.name}](areas/${areaDocFileName(area.id)}) - ${summary}`), "_No area summaries available._")}

## Module Areas

${list(areas.map((area) => `${code(area.name)} - ${pluralize(area.modules.length, "module")}${area.rootPaths.length ? ` (${area.rootPaths.map(code).join(", ")})` : ""}`), "_No module areas detected._")}

## Important Entry Files

${list(entryFiles.map((entry) => `${code(entry.line ? `${entry.path}:${entry.line}` : entry.path)} - ${entry.reason}`), "_No important entry files detected._")}

## Runtime Consumers

${renderConsumerList(splitProjectConsumers.runtime, "the repo", "_No runtime consumers detected._")}

## Test Consumers

${renderConsumerList(splitProjectConsumers.tests, "the repo", "_No test consumers detected._")}

## Common Change Paths

${list(changePaths.map(formatChangePath), "_No common change paths detected._")}

## Verification

${list(verificationHints.map(formatVerificationHint), "_No project verification hints detected._")}

## Area Flows

${list(areaFlows, "_No area-to-area flows detected._")}

## Test Coverage Hotspots

${list(testCoverage, "_No module-level test coverage detected._")}

## RepoWiki Commands

${list(renderRepoWikiCommands(scan), "_No RepoWiki commands detected._")}

## RepoWiki Flags

${list(renderRepoWikiFlags(scan), "_No RepoWiki flags detected._")}

## Diagrams

- [Module diagram](diagrams/modules.mmd)
- [Route diagram](diagrams/routes.mmd)

## Flows

- [Flow overview](flows/index.md)

## Documentation Quality

- [Quality bar](quality.md)

## Model Review

- [Codex review prompt](codex-review.md)

## Suggested Reading Order

- [Setup](setup.md)
- [Architecture](architecture.md)
- [Agent Context](agent-context.md)
- [Documentation Quality Bar](quality.md)
- [Codex Review Prompt](codex-review.md)
- [Areas](areas/index.md)
- [Flow Overview](flows/index.md)
${scan.graph.modules.map((module) => `- [${moduleLabel(module)}](modules/${module.id}.md)`).join("\n")}
`;
}

function buildModuleTestCoverage(scan: RepoScan): Array<{ module: string; count: number; tests: Array<{ coverageConfidence?: "direct" | "inferred" | "fallback"; ref: string }> }> {
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
