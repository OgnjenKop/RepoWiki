import type { RepoScan } from "../types/index.js";
import { code, list, pluralize, statCards, section, linkCard, callout, breadcrumbs, tableOfContents, command, keyValue } from "../utils/markdown.js";
import { scriptCommand } from "../utils/packageManager.js";
import { moduleLabel } from "../utils/moduleLabel.js";
import { renderRepoWikiCommands, renderRepoWikiFlags } from "./repoWikiCli.js";
import { testCoveragePrefix } from "../utils/testCoverage.js";
import { buildAreaFlows } from "../knowledge/areaFlows.js";
import { areaDocFileName } from "../utils/docPaths.js";
import { formatChangePath } from "../utils/changePaths.js";
import { selectProjectChangePaths, selectProjectConsumers, selectProjectEntryFiles } from "../knowledge/moduleFocus.js";
import { formatVerificationHint, selectProjectVerificationHints } from "../knowledge/verification.js";
import { summaryExcerpt } from "../utils/summaryExcerpt.js";
import { aiSummaryBody } from "../ai/summaryFormat.js";
import { orderedAreas } from "../knowledge/areaOrdering.js";
import { renderConsumerList, splitConsumers } from "../utils/consumers.js";
import { renderProjectNarrative } from "../utils/insightRenderer.js";

export function generateIndexDoc(scan: RepoScan): string {
  const scripts = Object.entries(scan.project.scripts).map(([name, value]) => `${code(name)}: ${code(value)}`);
  const structure = [...new Set(scan.graph.files.map((file) => file.path.split("/")[0]))].sort();
  const projectSummary = scan.summaries?.project?.content
    ? aiSummaryBody(scan.summaries.project.content)
    : scan.knowledge?.items.find((item) => item.kind === "project")?.summary;
  const areas = orderedAreas(scan);
  const areaSummaries = areas.map((area) => ({
    area,
    summary: summaryExcerpt(scan.summaries?.areas?.[area.id]?.content ?? area.purpose ?? "Connected implementation area.")
  }));
  const testCoverage = buildModuleTestCoverage(scan).map((item) => `${code(item.module)} - ${item.count} test${item.count === 1 ? "" : "s"}${item.tests.length ? ` (${item.tests.slice(0, 2).map((test) => `${code(test.ref)} ${testCoveragePrefix(test)}`).join(", ")})` : ""}`);
  const areaFlows = buildAreaFlows(scan).slice(0, 5).map((flow) => `${code(flow.fromName)} → ${code(flow.toName)} (${flow.count} imports)`);
  const entryFiles = selectProjectEntryFiles(scan, 8);
  const consumers = selectProjectConsumers(scan, 8);
  const splitProjectConsumers = splitConsumers(consumers);
  const changePaths = selectProjectChangePaths(scan).slice(0, 4);
  const verificationHints = selectProjectVerificationHints(scan);
  const hasDesignSystem = Boolean(scan.graph.designSystem) || (scan.graph.components?.length ?? 0) > 0 || (scan.graph.designTokens?.length ?? 0) > 0;

  return `# ${scan.project.name} — Repository Wiki

> A living map of this codebase: what it is, how it fits together, and where to start.

## At a Glance

${statCards([
  { label: "Project", value: scan.project.name, hint: scan.project.type },
  { label: "Files", value: scan.graph.files.length, hint: "scanned" },
  { label: "Modules", value: scan.graph.modules.length, hint: "detected" },
  { label: "Tests", value: scan.graph.tests.length, hint: "files" },
  { label: "Routes", value: scan.graph.routes.length, hint: "API endpoints" },
  { label: "Env vars", value: scan.graph.envVars.length, hint: "configured" },
  { label: "Components", value: (scan.graph.components ?? []).filter((c) => !c.isStory).length, hint: hasDesignSystem ? scan.graph.designSystem?.framework ?? "detected" : "no UI" },
  { label: "Tokens", value: (scan.graph.designTokens ?? []).length, hint: "design system" }
])}

## What This Project Is

${scan.insights?.project ? renderProjectNarrative(scan.insights.project) : (projectSummary ?? "No project summary available yet. Run with `--ai` to generate one.")}

${callout("tip", "New here?", `Start with the [Setup](setup.md) page, then read [Architecture](architecture.md) to understand the system shape, then jump into the [module](${firstModuleLink(scan)}) closest to the code you plan to change.`)}

${tableOfContents([
  { anchor: "navigation-map", label: "Navigation Map" },
  { anchor: "the-five-minute-tour", label: "The Five-Minute Tour" },
  { anchor: "repository-structure", label: "Repository Structure" },
  { anchor: "modules", label: "Modules" },
  { anchor: "areas-functional-groups", label: "Areas (Functional Groups)" },
  { anchor: "important-entry-files", label: "Important Entry Files" },
  { anchor: "common-change-paths", label: "Common Change Paths" },
  { anchor: "how-areas-depend-on-each-other", label: "How Areas Depend on Each Other" },
  { anchor: "test-coverage", label: "Test Coverage" },
  { anchor: "verification", label: "Verification" },
  { anchor: "repowiki-commands", label: "RepoWiki Commands" }
])}

## Navigation Map

${linkCard("Setup", "Install, build, test, and the first commands to run.", "setup.md")}
${linkCard("Architecture", "System shape, layered view, and how data flows through the codebase.", "architecture.md")}
${linkCard("Agent Context", "Concise reference for AI coding agents: entry points, change targets, and safety notes.", "agent-context.md")}
${linkCard("Design System", hasDesignSystem ? "Components, design tokens, and the visual language of this project." : "No design system detected. This page documents UI components and design tokens if any are added.", "design.md")}
${linkCard("Flow Overview", "Execution paths, area-to-area flows, and where changes propagate.", "flows/index.md")}
${linkCard("Quality Bar", "What good documentation looks like and how to review it.", "quality.md")}
${linkCard("Areas", "Functional groupings of modules with their own summaries.", "areas/index.md")}
${linkCard("Module Docs", "One page per module with entry files, exports, and change guidance.", `modules/${firstModuleId(scan)}.md`)}

## The Five-Minute Tour

${formatFiveMinuteTour(scan)}

## Repository Structure

${list(structure.map((item) => code(item)))}

## Modules

${list(scan.graph.modules.map((module) => `[${moduleLabel(module)}](modules/${module.id}.md) — ${pluralize(module.files.length, "file")}`))}

## Areas (Functional Groups)

${callout("note", "What is an area?", "An area groups modules that work toward the same goal. Areas give you a higher-level view than individual modules: instead of \"where is auth?\", you ask \"where is the security area?\".")}

${list(areas.map((area) => `[${area.name}](areas/${areaDocFileName(area.id)}) — ${pluralize(area.modules.length, "module")} · ${pluralize(area.files.length, "file")}`), "_No area docs generated._")}

${section("Area Summaries", list(areaSummaries.map(({ area, summary }) => `[${area.name}](areas/${areaDocFileName(area.id)}) — ${summary}`), "_No area summaries available._"))}

## Important Entry Files

${callout("tip", "What is an entry file?", "An entry file is one that other files import from. Reading these first gives you the highest-leverage understanding of the codebase.")}

${list(entryFiles.map((entry) => `${code(entry.line ? `${entry.path}:${entry.line}` : entry.path)} — ${entry.reason}`), "_No important entry files detected._")}

## Common Change Paths

${callout("note", "What is a change path?", "A change path is a common task (\"change the API\") mapped to the concrete files you'll likely need to touch. Start from these when you have a goal but not a starting point.")}

${list(changePaths.map(formatChangePath), "_No common change paths detected._")}

## How Areas Depend on Each Other

${list(areaFlows, "_No area-to-area flows detected._")}

## Test Coverage

${list(testCoverage, "_No module-level test coverage detected._")}

## Verification

${list(verificationHints.map(formatVerificationHint), "_No project verification hints detected._")}

## Runtime Consumers

${renderConsumerList(splitProjectConsumers.runtime, "the repo", "_No runtime consumers detected._")}

## Test Consumers

${renderConsumerList(splitProjectConsumers.tests, "the repo", "_No test consumers detected._")}

## RepoWiki Commands

${callout("note", "About this section", "These commands regenerate this wiki. Use them after changing the codebase, or to add AI-powered summaries.")}

${list(renderRepoWikiCommands(scan), "_No RepoWiki commands detected._")}

## RepoWiki Flags

${list(renderRepoWikiFlags(scan), "_No RepoWiki flags detected._")}

## Diagrams

- [Module dependency diagram](diagrams/modules.mmd)
- [Route entry points diagram](diagrams/routes.mmd)
`;
}

function formatFiveMinuteTour(scan: RepoScan): string {
  const topModules = scan.graph.modules.slice(0, 5);
  const moduleList = topModules.map((m) => `${code(m.name)}`).join(", ");
  const cliFlags = (scan.project.cliCommands ?? []).slice(0, 3).map((c) => code(c)).join(", ");

  const tagline = scan.insights?.project?.tagline;
  const oneLiner = tagline ?? `${scan.project.name} is a ${scan.graph.files.length}-file codebase organized into ${scan.graph.modules.length} modules.`;
  const parts: string[] = [];
  parts.push(`**1. What it is.** ${oneLiner} ${scan.project.dependencies.length} runtime dependencies, ${scan.project.devDependencies.length} dev dependencies.`);
  if (moduleList) {
    parts.push(`**2. The shape.** The codebase is organized into ${scan.graph.modules.length} modules including ${moduleList}. See [Modules](#modules) for the full list and [Architecture](architecture.md) for the dependency view.`);
  }
  if (scan.project.cliCommands?.length) {
    parts.push(`**3. How you use it.** Run ${code("npm run dev")} for the CLI, or invoke commands like ${cliFlags}. See [Setup](setup.md) for the full command reference.`);
  } else {
    const scripts = describePrimaryScripts(scan);
    parts.push(`**3. How you use it.** ${scripts}. See [Setup](setup.md) for the full command reference.`);
  }
  parts.push(`**4. Where to start.** Open [Architecture](architecture.md) for the layered view, then jump to the [module](modules/${firstModuleId(scan)}.md) closest to the code you plan to change.`);
  return parts.join("\n\n");
}

function firstModuleId(scan: RepoScan): string {
  return scan.graph.modules[0]?.id ?? "src-cli";
}

function firstModuleLink(scan: RepoScan): string {
  return `modules/${firstModuleId(scan)}.md`;
}

function describePrimaryScripts(scan: RepoScan): string {
  const scripts = scan.project.scripts;
  const pm = scan.project.packageManager;
  const candidates: Array<{ key: string; purpose: string; verb: string }> = [
    { key: "start", purpose: "launches the app", verb: "starts" },
    { key: "start:dev", purpose: "launches the dev build", verb: "starts (dev)" },
    { key: "dev", purpose: "launches the dev server", verb: "starts" },
    { key: "serve", purpose: "launches the dev server", verb: "starts" },
    { key: "build", purpose: "produces a production build", verb: "builds" },
    { key: "test", purpose: "runs the test suite", verb: "tests" },
    { key: "typecheck", purpose: "type-checks the code", verb: "type-checks" }
  ];
  const present = candidates.filter((c) => scripts[c.key]);
  if (!present.length) return `${code("npm run <script>")} runs any script from ${code("package.json")}`;
  const seen = new Set<string>();
  const phrases = present
    .filter((c) => {
      if (seen.has(c.verb)) return false;
      seen.add(c.verb);
      return true;
    })
    .slice(0, 3)
    .map((c) => `${code(scriptCommand(pm, c.key))} ${c.verb}`);
  return phrases.join(", ");
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
