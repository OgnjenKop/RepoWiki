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
