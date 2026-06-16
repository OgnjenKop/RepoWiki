import type { RepoScan } from "../types/index.js";
import { code, list, pluralize } from "../utils/markdown.js";
import { scriptCommand } from "../utils/packageManager.js";
import { selectProjectFocusFiles } from "../knowledge/fileImportance.js";
import { selectProjectChangeTargets } from "../knowledge/changeTargets.js";
import { buildAreaFlows } from "../knowledge/areaFlows.js";
import { formatChangeTargetSymbols } from "../utils/changeTargets.js";
import { moduleLabel } from "../utils/moduleLabel.js";
import { areaDocFileName } from "../utils/docPaths.js";
import { renderInstallCommand, renderRepoWikiCommands, renderRepoWikiFlags } from "./repoWikiCli.js";
import { formatChangePath } from "../utils/changePaths.js";
import { selectProjectChangePaths, selectProjectConsumers, selectProjectEntryFiles } from "../knowledge/moduleFocus.js";
import { summaryExcerpt } from "../utils/summaryExcerpt.js";
import { aiSummaryBody } from "../ai/summaryFormat.js";
import { orderedAreas } from "../knowledge/areaOrdering.js";
import { renderConsumerList, splitConsumers } from "../utils/consumers.js";

export function generateAgentContextDoc(scan: RepoScan): string {
  const areas = orderedAreas(scan);
  const firstFiles = selectProjectFocusFiles(scan, 12);
  const entryFiles = selectProjectEntryFiles(scan, 10);
  const consumers = selectProjectConsumers(scan, 10);
  const splitProjectConsumers = splitConsumers(consumers);
  const changePaths = selectProjectChangePaths(scan).slice(0, 4);
  const sensitive = scan.graph.files
    .map((file) => file.path)
    .filter((file) => /(auth|payment|billing|security|secret|env|migration|schema|deploy|docker)/i.test(file));
  const scripts = Object.keys(scan.project.scripts).map((name) => code(name));
  const commands = buildUsefulCommands(scan);
  const knowledgeCount = scan.knowledge?.items.length ?? 0;
  const changeTargets = selectProjectChangeTargets(scan, 8);
  const areaFlows = buildAreaFlows(scan).slice(0, 5).map((flow) => `${code(flow.fromName)} -> ${code(flow.toName)} (${flow.count} imports)`);
  const projectSummary = scan.summaries?.project?.content
    ? aiSummaryBody(scan.summaries.project.content)
    : `${scan.project.name} is detected as ${scan.project.type}. This summary is generated from repository structure and package metadata only.`;
  const areaSummaries = areas.map((area) => {
    const summary = summaryExcerpt(scan.summaries?.areas?.[area.id]?.content ?? area.purpose ?? "Connected implementation area.");
    return `[${area.name}](areas/${areaDocFileName(area.id)}) - ${summary}`;
  });

  return `# Agent Context

## Project Summary

${projectSummary}

## Knowledge Base

- Knowledge items: ${knowledgeCount}
- Routes detected: ${scan.graph.routes.length}
- Environment variables detected: ${scan.graph.envVars.length}
- Test files detected: ${scan.graph.tests.length}

## Documentation Quality Bar

- Target: Qoder-style, agent-ready repository documentation.
- Read ${code("docs/repo-wiki/quality.md")} for the quality checklist and model-review loop.
- Use ${code("docs/repo-wiki/codex-review.md")} with Codex or ChatGPT to identify weak generated docs and concrete RepoWiki improvements.

## Important Files To Read First

${list(firstFiles.map(code))}

## Important Entry Files

${list(entryFiles.map((entry) => `${code(entry.line ? `${entry.path}:${entry.line}` : entry.path)} - ${entry.reason}`), "_No important entry files detected._")}

## Module Map

${list(scan.graph.modules.map((module) => `${code(moduleLabel(module))}: ${pluralize(module.files.length, "file")} under ${code(module.rootPath)}`))}

## Module Areas

${list(areas.map((area) => {
    const summary = scan.summaries?.areas?.[area.id]?.content
      ? aiSummaryBody(summaryExcerpt(scan.summaries.areas[area.id].content))
      : (area.purpose ?? "");
    return `${code(area.name)}: ${pluralize(area.modules.length, "module")}${summary ? ` - ${summary}` : ""}`;
  }), "_No module areas detected._")}

## Area Summaries

${list(areaSummaries, "_No area summaries available._")}

## Area Docs

Read ${code("docs/repo-wiki/areas/index.md")} for the area-level map.

${list(areas.map((area) => `[${area.name}](areas/${areaDocFileName(area.id)}) - ${pluralize(area.modules.length, "module")}`), "_No area docs generated._")}

## Area Flows

${list(areaFlows, "_No area-to-area flows detected._")}

## Runtime Consumers

${renderConsumerList(splitProjectConsumers.runtime, "the repo", "_No runtime consumers detected._")}

## Test Consumers

${renderConsumerList(splitProjectConsumers.tests, "the repo", "_No test consumers detected._")}

## Common Change Paths

${list(changePaths.map(formatChangePath), "_No common change paths detected._")}

## Flow Overview

- Read ${code("docs/repo-wiki/flows/index.md")} for execution paths and module-to-module relationships.

## Useful Commands

${list([renderInstallCommand(scan), ...commands], "_No useful commands detected._")}

## RepoWiki Commands

${list(renderRepoWikiCommands(scan), "_No RepoWiki commands detected._")}

## RepoWiki Flags

${list(renderRepoWikiFlags(scan), "_No RepoWiki flags detected._")}

## Change Safety Notes

${list(sensitive.map((file) => `Review carefully before changing ${code(file)}`), "_No sensitive-looking files detected by filename heuristic._")}

## Change Targets

${list(changeTargets.map((target) => `${code(target.line ? `${target.path}:${target.line}` : target.path)} - ${target.reason}${formatChangeTargetSymbols(target) ? ` [Symbols: ${formatChangeTargetSymbols(target)}]` : ""}${target.caution ? ` (${target.caution})` : ""}`))}

## Testing Commands

${scan.project.scripts.test ? code(scriptCommand(scan.project.packageManager, "test")) : "_No test command detected._"}

## Coding Conventions

- Keep changes consistent with existing file layout and exported symbols.
- Existing scripts detected: ${scripts.length ? scripts.join(", ") : "_none_"}.
- Generated docs are deterministic; do not add unsupported behavior claims.
`;
}

function buildUsefulCommands(scan: RepoScan): string[] {
  const priority = ["build", "dev", "test", "check", "update", "generate", "lint", "typecheck", "start"];
  const commandNames = Object.keys(scan.project.scripts);
  return priority
    .filter((name) => commandNames.includes(name))
    .map((name) => {
      if (name === "dev" && commandNames.includes("dev")) return code(scriptCommand(scan.project.packageManager, "dev"));
      return code(scriptCommand(scan.project.packageManager, name));
    });
}
