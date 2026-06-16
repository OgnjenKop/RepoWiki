import type { RepoScan } from "../types/index.js";
import { moduleLabel } from "../utils/moduleLabel.js";

export function generateModuleDiagram(scan: RepoScan): string {
  const edges = buildModuleEdges(scan);
  const lines = ["flowchart TD"];
  for (const module of scan.graph.modules) {
    lines.push(`  ${nodeId(module.id)}["${escapeLabel(moduleLabel(module))}"]`);
  }
  if (!edges.length) {
    lines.push("  %% No internal module dependencies detected");
    return lines.join("\n");
  }
  for (const edge of edges) {
    lines.push(`  ${nodeId(edge.from)} --> ${nodeId(edge.to)}`);
  }
  return lines.join("\n");
}

export function generateRouteDiagram(scan: RepoScan): string {
  const lines = ["flowchart TD"];
  if (!scan.graph.routes.length) {
    lines.push("  %% No routes detected");
    return lines.join("\n");
  }
  for (const route of scan.graph.routes) {
    const routeId = nodeId(`${route.file}:${route.method ?? "ANY"}:${route.path ?? "unknown"}`);
    const routeLabel = `${route.method ?? "ANY"} ${route.path ?? "(unknown path)"}`.trim();
    lines.push(`  ${routeId}["${escapeLabel(routeLabel)}"]`);
    lines.push(`  ${routeId} --> ${nodeId(route.file)}`);
  }
  return lines.join("\n");
}

export function generateLayeredDiagram(scan: RepoScan): string {
  const lines = ["flowchart TB"];
  const grouped = groupModulesByArea(scan);
  for (const [areaName, modules] of grouped) {
    const areaId = nodeId(`area_${areaName}`);
    const label = modules.length === scan.graph.modules.length
      ? `${escapeLabel(areaName)} (all modules)`
      : escapeLabel(areaName);
    lines.push(`  subgraph ${areaId}["${label}"]`);
    lines.push(`    direction LR`);
    for (const module of modules) {
      lines.push(`    ${nodeId(module.id)}["${escapeLabel(moduleLabel(module))}"]`);
    }
    lines.push(`  end`);
  }
  for (const edge of buildModuleEdges(scan)) {
    lines.push(`  ${nodeId(edge.from)} --> ${nodeId(edge.to)}`);
  }
  return lines.join("\n");
}

function groupModulesByArea(scan: RepoScan): Array<[string, typeof scan.graph.modules]> {
  const moduleToArea = new Map<string, string>();
  for (const area of scan.graph.areas) {
    for (const moduleId of area.modules) {
      if (!moduleToArea.has(moduleId)) moduleToArea.set(moduleId, area.name);
    }
  }
  const groups = new Map<string, typeof scan.graph.modules>();
  for (const module of scan.graph.modules) {
    const areaName = moduleToArea.get(module.id) ?? "Other";
    if (!groups.has(areaName)) groups.set(areaName, []);
    groups.get(areaName)!.push(module);
  }
  return [...groups.entries()];
}

export function generateTestCoverageDiagram(scan: RepoScan): string {
  const lines = ["flowchart LR"];
  lines.push(`  %% Test coverage: each module shows the number of tests covering it`);
  for (const module of scan.graph.modules) {
    const tests = scan.graph.tests.filter((test) =>
      module.files.includes(test.path) ||
      (test.testedFile ? module.files.includes(test.testedFile) : false) ||
      (test.testedFiles ? test.testedFiles.some((file) => module.files.includes(file)) : false)
    );
    const count = tests.length;
    const label = count > 0 ? `${escapeLabel(moduleLabel(module))}<br/>${count} test${count === 1 ? "" : "s"}` : `${escapeLabel(moduleLabel(module))}<br/>0 tests`;
    const shape = count > 0 ? `["${label}"]` : `(["${label}"])`;
    lines.push(`  ${nodeId(module.id)}${shape}`);
  }
  const edges = buildTestEdges(scan);
  for (const edge of edges) {
    lines.push(`  ${nodeId(edge.from)} --> ${nodeId(edge.to)}`);
  }
  return lines.join("\n");
}

function buildTestEdges(scan: RepoScan): Array<{ from: string; to: string }> {
  const fileToModule = new Map<string, string>();
  for (const module of scan.graph.modules) {
    for (const file of module.files) fileToModule.set(file, module.id);
  }
  const testToModule = new Map<string, string>();
  for (const test of scan.graph.tests) {
    const testedFile = test.testedFile ?? test.testedFiles?.[0];
    if (testedFile) {
      const moduleId = fileToModule.get(testedFile);
      if (moduleId) testToModule.set(test.path, moduleId);
    }
  }
  const edges = new Set<string>();
  for (const test of scan.graph.tests) {
    const testedFile = test.testedFile ?? test.testedFiles?.[0];
    if (!testedFile) continue;
    const testModule = fileToModule.get(test.path);
    const targetModule = fileToModule.get(testedFile);
    if (testModule && targetModule && testModule !== targetModule) {
      edges.add(`${testModule}::${targetModule}`);
    }
  }
  return [...edges].map((item) => {
    const [from, to] = item.split("::");
    return { from, to };
  });
}

function buildModuleEdges(scan: RepoScan): Array<{ from: string; to: string }> {
  const fileToModule = new Map<string, string>();
  for (const module of scan.graph.modules) {
    for (const file of module.files) fileToModule.set(file, module.id);
  }
  const edges = new Set<string>();
  for (const edge of scan.graph.imports) {
    const fromModule = fileToModule.get(edge.from);
    const toModule = fileToModule.get(edge.to);
    if (!fromModule || !toModule || fromModule === toModule) continue;
    edges.add(`${fromModule}::${toModule}`);
  }
  return [...edges].map((item) => {
    const [from, to] = item.split("::");
    return { from, to };
  }).sort((a, b) => `${a.from}:${a.to}`.localeCompare(`${b.from}:${b.to}`));
}

function nodeId(value: string): string {
  return value.replace(/[^A-Za-z0-9_]/g, "_");
}

function escapeLabel(value: string): string {
  return value.replaceAll("\"", "'");
}
