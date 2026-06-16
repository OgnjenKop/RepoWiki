import type { KnowledgeItem, RepoKnowledge, RepoScan, EvidenceRef } from "../types/index.js";
import { testCoveragePrefix } from "../utils/testCoverage.js";
import { routeCoverageDescriptor } from "../utils/routeCoverage.js";
import { moduleLabel } from "../utils/moduleLabel.js";
import { orderedAreas } from "./areaOrdering.js";

export function buildKnowledge(scan: RepoScan): RepoKnowledge {
  const items: KnowledgeItem[] = [];

  items.push({
    id: "project",
    kind: "project",
    title: scan.project.name,
    files: ["package.json", ...scan.project.configFiles],
    summary: buildProjectSummary(scan),
    evidence: buildEvidence(["package.json", ...scan.project.configFiles], "Project metadata and configuration files")
  });

  for (const area of orderedAreas(scan)) {
    items.push({
      id: `area:${area.id}`,
      kind: "area",
      title: area.name,
      files: area.files,
      summary: area.purpose ?? `Connected implementation area spanning ${area.name}.`,
      evidence: area.files.slice(0, 5).map((file) => evidence(file, "Module area file"))
    });
  }

  for (const module of scan.graph.modules) {
    items.push({
      id: `module:${module.id}`,
      kind: "module",
      title: module.name,
      files: module.files,
      summary: module.purpose ?? `Detected module rooted at ${module.rootPath}.`,
      evidence: module.files.slice(0, 5).map((file) => evidence(file, `Module file under ${module.rootPath}`))
    });
  }

  for (const route of scan.graph.routes) {
    const title = `${route.method ?? "ANY"} ${route.path ?? "(unknown path)"}`.trim();
    items.push({
      id: `route:${route.file}:${title}`,
      kind: "route",
      title,
      files: [route.file],
      summary: `${routeCoverageDescriptor(route)} in ${route.line ? `${route.file}:${route.line}` : route.file}${route.controller ? ` inside ${route.controller}` : ""}${route.handler ? ` handled by ${route.handler}` : ""}.`,
      evidence: [evidence(route.file, "Route detector match", route.line)]
    });
  }

  for (const envVar of scan.graph.envVars) {
    items.push({
      id: `env:${envVar.name}`,
      kind: "env",
      title: envVar.name,
      files: [envVar.sourceFile],
      summary: `Environment variable ${envVar.name} detected in ${envVar.line ? `${envVar.sourceFile}:${envVar.line}` : envVar.sourceFile}.`,
      evidence: [evidence(envVar.sourceFile, "Environment variable detector match", envVar.line)]
    });
  }

  for (const test of scan.graph.tests) {
    const testedFiles = [...new Set([test.testedFile, ...(test.testedFiles ?? [])].filter(Boolean))];
    items.push({
      id: `test:${test.path}`,
      kind: "test",
      title: test.path,
      files: [test.path],
      summary: testedFiles.length ? `Test file ${testCoveragePrefix(test)} ${testedFiles.join(", ")}${test.line ? ` (see ${test.path}:${test.line})` : ""}.` : `Test file detected${test.line ? ` at ${test.path}:${test.line}` : ""}.`,
      evidence: [evidence(test.path, "Test file classifier match", test.line)]
    });
  }

  for (const dependency of scan.project.dependencies) {
    items.push({
      id: `dependency:${dependency}`,
      kind: "dependency",
      title: dependency,
      files: ["package.json"],
      summary: `Runtime dependency declared in package.json.`,
      evidence: [evidence("package.json", "Dependency listed in package.json")]
    });
  }

  for (const dependency of scan.project.devDependencies) {
    items.push({
      id: `devDependency:${dependency}`,
      kind: "dependency",
      title: dependency,
      files: ["package.json"],
      summary: `Development dependency declared in package.json.`,
      evidence: [evidence("package.json", "Dev dependency listed in package.json")]
    });
  }

  if (scan.graph.designSystem) {
    const designSystem = scan.graph.designSystem;
    const summaryParts: string[] = [];
    summaryParts.push(`Detected ${designSystem.framework} UI framework.`);
    if (designSystem.componentLibraries.length) {
      summaryParts.push(`Component libraries: ${designSystem.componentLibraries.join(", ")}.`);
    }
    summaryParts.push(`${designSystem.componentFiles.length} component file(s) and ${designSystem.tokenFiles.length} token file(s) detected.`);
    if (designSystem.hasStorybook) summaryParts.push("Storybook detected.");
    items.push({
      id: "design:system",
      kind: "design",
      title: "Design System",
      files: [...designSystem.componentFiles, ...designSystem.tokenFiles].slice(0, 20),
      summary: summaryParts.join(" "),
      evidence: [...designSystem.componentFiles.slice(0, 3), ...designSystem.tokenFiles.slice(0, 3)].map((file) => evidence(file, "Design system file"))
    });
  }

  for (const component of (scan.graph.components ?? []).filter((c) => !c.isStory)) {
    items.push({
      id: `component:${component.file}:${component.name}`,
      kind: "component",
      title: component.name,
      files: [component.file],
      summary: `${component.framework} component${component.exported ? " (exported)" : ""}${component.props?.length ? ` with props: ${component.props.join(", ")}` : ""}.`,
      evidence: [evidence(component.file, `${component.framework} component declaration`, component.line)]
    });
  }

  for (const token of scan.graph.designTokens ?? []) {
    items.push({
      id: `token:${token.file}:${token.name}`,
      kind: "token",
      title: token.name,
      files: [token.file],
      summary: `${token.category} design token (${token.source}) with value ${token.value}.`,
      evidence: [evidence(token.file, `${token.source} design token`, token.line)]
    });
  }

  return { items };
}

function buildProjectSummary(scan: RepoScan): string {
  const moduleNames = summarizeNames(scan.graph.modules.map((module) => moduleLabel(module)), 12);
  const configFiles = summarizeNames(scan.project.configFiles, 5);
  const scriptNames = summarizeNames(Object.keys(scan.project.scripts), 6);
  const cliCommands = summarizeNames(scan.project.cliCommands ?? [], 6);
  const cliOptions = summarizeNames(scan.project.cliOptions ?? [], 6);
  const parts = [
    `${scan.project.name} is a ${scan.project.type} repository.`,
    moduleNames.length ? `Detected modules: ${moduleNames.join(", ")}.` : "No top-level modules were detected.",
    configFiles.length ? `Important config files: ${configFiles.join(", ")}.` : "No notable config files detected.",
    scriptNames.length ? `Scripts: ${scriptNames.join(", ")}.` : "No package scripts detected.",
    cliCommands.length ? `CLI commands: ${cliCommands.join(", ")}.` : "No CLI commands detected.",
    cliOptions.length ? `CLI flags: ${cliOptions.join(", ")}.` : "No CLI flags detected."
  ];
  return parts.join(" ");
}

function summarizeNames(names: string[], limit: number): string[] {
  const unique = [...new Set(names.filter(Boolean))].sort();
  if (unique.length <= limit) return unique;
  return [...unique.slice(0, limit), `and ${unique.length - limit} more`];
}

function buildEvidence(files: string[], reason: string): EvidenceRef[] {
  return files.map((file) => evidence(file, reason));
}

function evidence(file: string, reason: string, line?: number): EvidenceRef {
  return line ? { file, reason, lines: [line, line] } : { file, reason };
}
